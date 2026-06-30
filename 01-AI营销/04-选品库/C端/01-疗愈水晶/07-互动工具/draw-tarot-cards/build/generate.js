/**
 * Draw Tarot Cards (自由抽牌) — v6 简化包装
 * 用户自由选抽 1-10 张(无场景预设/无判定), 纯抽牌 + 每张牌义(正逆位) + 水晶推荐 + Shop CTA
 * 复用 v6 引擎(Shuffle/Cut/Pick/翻牌), 去掉 focus/spread, 改为"选抽牌数(1-10) → Shuffle → Cut → 选 N 张 → 翻牌"
 * 数据: _shared/tarot-knowledge.json + crystal-meaning-search/data/search-data.json
 * 约束: base64 包装可执行 JS / safeJSON 只转义 </ / 字体 min14 / 翻牌 scrollIntoView block:nearest /
 *       SEO accordion 真实换行 / self-reflection 合规 / CSS 前缀 efd- 避冲突
 * URL /tools/draw-tarot-cards/ (parent 43101). 输出 ./draw-tarot-cards.html
 */
const fs = require('fs');
const path = require('path');

const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));

const BY_SLUG = {};
SD.crystals.forEach(c => {
  BY_SLUG[c.slug] = { name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || ('/shop/?s=' + c.slug) };
});
const HEALING = '/product-category/healing-crystals-jewelry/';

function enrichStone(s) {
  if (!s) return null;
  const sc = BY_SLUG[s.slug] || { name: s.name, img: '', link: '', shop: HEALING };
  return { slug: s.slug, name: sc.name || s.name, reason: s.reason, img: sc.img, shop: sc.shop };
}

const NUM2SLUG = {};
TK.cards.forEach(c => { NUM2SLUG[c.number] = c.slug; });

const CARDS = TK.cards.map(c => ({
  number: c.number, slug: c.slug, name: c.name, archetype: c.archetype,
  element: c.element, astrology: c.astrology,
  upright_keywords: c.upright_keywords, reversed_keywords: c.reversed_keywords,
  upright_meaning: c.upright_meaning, reversed_meaning: c.reversed_meaning,
  psych: c.psychological_lens || '',
  eastern: (c.eastern_anchors && c.eastern_anchors.tibetan) || '',
  practice: c.recommended_practice || '',
  chakra: c.chakra || [],
  related: (c.related_cards || []).map(n => NUM2SLUG[n]).filter(Boolean),
  crystals: {
    best_overall: enrichStone(c.crystals.best_overall),
    best_upright: enrichStone(c.crystals.best_upright),
    best_reversed: enrichStone(c.crystals.best_reversed),
    best_love: enrichStone(c.crystals.best_love),
    best_daily_wear: enrichStone(c.crystals.best_daily_wear)
  }
}));

const GENTLE = 'Tarot and crystal meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. A free draw is a tool for self-reflection and contemplation — not a prediction of fixed outcomes, and not a substitute for medical, financial, or professional advice.';

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function(ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({ cards: CARDS, gentle: GENTLE });

// APP_JS: v6 引擎简化(选抽牌数 1-10, 无 focus/spread, 无判定)
const APP_JS = `(function(){
  var rawData = document.getElementById('efd-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('EFD data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  var state='initial';
  var deck=[];
  var picked=[];

  function needed(){ var s=document.getElementById('efd-count'); var v=s?parseInt(s.value,10):1; return (v>=1&&v<=10)?v:1; }

  function buildDeck(){
    var idxs=[]; for(var i=0;i<CARDS.length;i++) idxs.push(i);
    for(var i=idxs.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t; }
    deck = idxs.map(function(ci){ return {cardIdx:ci, reversed:Math.random()<0.4}; });
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderDeck(){
    var el=document.getElementById('efd-deck');
    if(!el) return;
    var h='';
    for(var i=0;i<deck.length;i++){
      h+='<div class="efd-card-back efd-enter" data-pos="'+i+'">'
        +'<div class="efd-back-inner">'
        +'<div class="efd-back-sym">\\u2726</div>'
        +'<div class="efd-back-label">Tarot</div>'
        +'</div></div>';
    }
    el.innerHTML=h;
    var backs=el.querySelectorAll('.efd-card-back');
    for(var k=0;k<backs.length;k++){
      (function(b){ b.addEventListener('click', function(){ pickCard(parseInt(b.getAttribute('data-pos'),10)); }); })(backs[k]);
    }
  }

  function setStage(s){
    state=s;
    var deckEl=document.getElementById('efd-deck');
    var cutBtn=document.getElementById('efd-cut-btn');
    var shBtn=document.getElementById('efd-shuffle-btn');
    var cntEl=document.getElementById('efd-count');
    var hint=document.getElementById('efd-stage-hint');
    var n=needed();
    if(deckEl){
      if(s==='cut'){ deckEl.classList.add('efd-deck-pickable'); }
      else { deckEl.classList.remove('efd-deck-pickable'); }
    }
    if(cutBtn){ cutBtn.disabled = (s!=='shuffled'); }
    if(shBtn){ shBtn.disabled = (s==='cut'||s==='revealed'); }
    if(cntEl){ cntEl.disabled = (s!=='initial'); }
    if(hint){
      if(s==='initial') hint.textContent='The 22 Major Arcana are laid out. Choose how many cards to draw, then shuffle.';
      else if(s==='shuffled') hint.textContent='Deck shuffled. Cut the cards to continue.';
      else if(s==='cut') hint.textContent='Pick '+n+' card'+(n>1?'s':'')+' from the spread below.';
      else if(s==='revealed') hint.textContent='Your draw is revealed. Scroll down for each card’s full interpretation.';
    }
  }

  function shuffleDeck(){
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('efd-deck'); if(deckEl) deckEl.classList.remove('efd-deck-done');
    var holder=document.getElementById('efd-revealed-cards'); if(holder) holder.innerHTML='';
    var res=document.getElementById('efd-result'); if(res) res.style.display='none';
    setStage('shuffled');
  }

  function cutDeck(){
    if(state!=='shuffled') return;
    var deckEl=document.getElementById('efd-deck');
    if(deckEl){ deckEl.classList.add('efd-cut-anim'); setTimeout(function(){ deckEl.classList.remove('efd-cut-anim'); }, 600); }
    setTimeout(function(){ setStage('cut'); }, 300);
  }

  function pickCard(pos){
    if(state!=='cut') return;
    if(picked.indexOf(pos)>-1) return;
    picked.push(pos);
    var back=document.querySelector('#efd-deck .efd-card-back[data-pos="'+pos+'"]');
    if(back) back.classList.add('selected');
    var n=needed();
    var hint=document.getElementById('efd-stage-hint');
    if(picked.length>=n){ revealAll(); }
    else if(hint){ var left=n-picked.length; hint.textContent='Pick '+left+' more card'+(left>1?'s':'')+' ('+picked.length+'/'+n+' chosen).'; }
  }

  function revealAll(){
    setStage('revealed');
    // 翻牌
    for(var k=0;k<picked.length;k++){
      var p2=picked[k];
      var d2=deck[p2];
      var backEl=document.querySelector('#efd-deck .efd-card-back[data-pos="'+p2+'"]');
      if(backEl){
        (function(el,card,rev){
          el.classList.add('flipped');
          setTimeout(function(){ el.classList.add('efd-is-front'); el.innerHTML=cardFrontHtml(card,rev); }, 280);
        })(backEl, CARDS[d2.cardIdx], d2.reversed);
      }
    }
    var holder=document.getElementById('efd-revealed-cards');
    var res=document.getElementById('efd-result');
    if(holder) holder.innerHTML='';
    if(res) res.style.display='block';
    for(var j=0;j<picked.length;j++){
      var pos2=picked[j];
      var dd=deck[pos2];
      var draw={ card:CARDS[dd.cardIdx], reversed:dd.reversed };
      if(holder) holder.insertAdjacentHTML('beforeend', singleCardHtml(draw, picked.length, j+1));
    }
    var deckEl=document.getElementById('efd-deck'); if(deckEl) deckEl.classList.add('efd-deck-done');
    var resetBtn=document.getElementById('efd-reset-btn'); if(resetBtn) resetBtn.style.display='inline-block';
    setTimeout(function(){
      var ff=document.querySelector('#efd-deck .efd-card-back.flipped');
      if(ff){ try{ ff.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
    },450);
  }

  function resetDraw(){
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('efd-deck'); if(deckEl) deckEl.classList.remove('efd-deck-done');
    var holder=document.getElementById('efd-revealed-cards'); if(holder) holder.innerHTML='';
    var res=document.getElementById('efd-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('efd-reset-btn'); if(resetBtn) resetBtn.style.display='none';
    setStage('initial');
  }

  function kwRow(kws){ return kws.map(function(k){return '<span class="efd-kw">'+esc(k)+'</span>';}).join(''); }
  function stoneCardHtml(tag,stone){
    if(!stone) return '';
    var img=stone.img?'<img class="efd-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">':'';
    return '<div class="efd-stone-card">'+img
      +'<div class="efd-stone-body">'
      +'<div class="efd-stone-tag">'+esc(tag)+'</div>'
      +'<div class="efd-stone-name">'+esc(stone.name)+'</div>'
      +'<div class="efd-stone-reason">'+esc(stone.reason)+'</div>'
      +'<a class="efd-stone-shop" href="'+esc(stone.shop)+'">Shop '+esc(stone.name)+' &rarr;</a>'
      +'</div></div>';
  }
  function relatedHtml(c){
    if(!c.related||!c.related.length) return '';
    var chips=c.related.map(function(sl){return '<a class="efd-related-chip" href="/tarot-'+sl+'-crystals/">'+esc(cardNameBySlug(sl))+' &rarr;</a>';}).join('');
    return '<div class="efd-related-row"><span class="efd-related-lbl">Related cards:</span>'+chips+'</div>';
  }
  function cardNameBySlug(sl){ for(var i=0;i<CARDS.length;i++){if(CARDS[i].slug===sl) return CARDS[i].name;} return sl; }

  function cardFrontHtml(c,rev){
    return '<div class="efd-front-face">'
      +'<div class="efd-front-num">Major Arcana #'+c.number+'</div>'
      +'<div class="efd-front-name">'+esc(c.name)+'</div>'
      +'<div class="efd-front-arch">'+esc(c.archetype)+'</div>'
      +'<span class="efd-front-orient '+(rev?'efd-front-rev':'efd-front-up')+'">'+(rev?'Reversed':'Upright')+'</span>'
      +'</div>';
  }
  function singleCardHtml(draw,total,posNum){
    var c=draw.card, rev=draw.reversed;
    var kws=rev?c.reversed_keywords:c.upright_keywords;
    var meaning=rev?c.reversed_meaning:c.upright_meaning;
    var stones=[];
    if(rev){
      if(c.crystals.best_reversed) stones.push(['For the shadow side',c.crystals.best_reversed]);
      if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }else{
      if(c.crystals.best_overall) stones.push(['Best for this draw',c.crystals.best_overall]);
      if(c.crystals.best_daily_wear) stones.push(['Daily wear',c.crystals.best_daily_wear]);
    }
    var stonesHtml=stones.map(function(s){return stoneCardHtml(s[0],s[1]);}).join('');
    var chakraChip = c.chakra&&c.chakra.length ? '<span class="efd-meta-chip"><b>Chakra:</b> '+esc(c.chakra.join(', '))+'</span>' : '';
    var posHtml = total>1 ? '<div class="efd-card-pos">Card '+posNum+' of '+total+'</div>' : '';
    var lensHtml='';
    if(c.psych||c.eastern){
      lensHtml='<div class="efd-lens-grid">';
      if(c.psych) lensHtml+='<div class="efd-lens"><div class="efd-lens-lbl">Psychological lens</div><div class="efd-lens-txt">'+esc(c.psych)+'</div></div>';
      if(c.eastern) lensHtml+='<div class="efd-lens eastern"><div class="efd-lens-lbl">Eastern perspective</div><div class="efd-lens-txt">'+esc(c.eastern)+'</div></div>';
      lensHtml+='</div>';
    }
    var practiceHtml = c.practice ? '<div class="efd-practice"><div class="efd-practice-lbl">A question to sit with</div><div class="efd-practice-txt">'+esc(c.practice)+'</div></div>' : '';

    return '<div class="efd-card">'+posHtml
      +'<div class="efd-card-head">'
      +'<div class="efd-card-num">Major Arcana #'+c.number+'</div>'
      +'<div class="efd-card-name">'+esc(c.name)+'</div>'
      +'<div class="efd-card-arch">'+esc(c.archetype)+'</div>'
      +'<span class="efd-card-orient '+(rev?'efd-reversed':'efd-upright')+'">'+(rev?'Reversed \\u2014 shadow aspect':'Upright')+'</span>'
      +'</div>'
      +'<div class="efd-card-body">'
      +'<div class="efd-meta-row">'
      +'<span class="efd-meta-chip"><b>Element:</b> '+esc(c.element)+'</span>'
      +'<span class="efd-meta-chip"><b>Astrology:</b> '+esc(c.astrology)+'</span>'
      +chakraChip
      +'</div>'
      +'<div class="efd-kw-row">'+kwRow(kws)+'</div>'
      +'<div class="efd-meaning-lbl">'+(rev?'Reversed meaning (for reflection)':'Upright meaning')+'</div>'
      +'<div class="efd-meaning">'+esc(meaning)+'</div>'
      +lensHtml
      +practiceHtml
      +'<div class="efd-stones-lbl">Crystals for this card</div>'
      +'<div class="efd-stones">'+stonesHtml+'</div>'
      +relatedHtml(c)
      +'<div class="efd-cta-row">'
      +'<a class="efd-cta efd-cta-primary" href="/tarot-'+c.slug+'-crystals/">Read the full '+esc(c.name)+' guide &rarr;</a>'
      +'<a class="efd-cta efd-cta-sec" href="/product-category/healing-crystals-jewelry/">Shop healing jewelry &rarr;</a>'
      +'</div>'
      +'</div></div>';
  }

  function init(){
    buildDeck(); renderDeck();
    var shBtn=document.getElementById('efd-shuffle-btn');
    var cutBtn=document.getElementById('efd-cut-btn');
    var rstBtn=document.getElementById('efd-reset-btn');
    if(shBtn) shBtn.addEventListener('click', shuffleDeck);
    if(cutBtn) cutBtn.addEventListener('click', cutDeck);
    if(rstBtn) rstBtn.addEventListener('click', resetDraw);
    setStage('initial');
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

let html = `<!-- ===== Earthward Draw Tarot Cards ===== -->
<div id="efd-wrap">
  <h1 class="efd-h1">Draw Tarot Cards</h1>
  <p class="efd-intro">A free, open-ended tarot draw. Choose how many cards to pull — one to ten — then shuffle, cut, and pick them yourself from the 22 Major Arcana. There is no fixed spread and no verdict: each card is read on its own, upright or reversed, as a prompt for self-reflection, paired with crystals, a psychological lens, and an Eastern perspective. Pull a single card for a daily prompt, or several to survey the landscape of a situation.</p>

  <div class="efd-input-row">
    <div class="efd-field">
      <label class="efd-field-lbl" for="efd-count">How many cards?</label>
      <select id="efd-count">
        <option value="1">1 card</option>
        <option value="2">2 cards</option>
        <option value="3" selected>3 cards</option>
        <option value="4">4 cards</option>
        <option value="5">5 cards</option>
        <option value="6">6 cards</option>
        <option value="7">7 cards</option>
        <option value="8">8 cards</option>
        <option value="9">9 cards</option>
        <option value="10">10 cards</option>
      </select>
    </div>
    <div class="efd-field efd-field-grow">
      <label class="efd-field-lbl" for="efd-question">What's on your mind? (optional)</label>
      <input id="efd-question" type="text" placeholder="A theme, a feeling, or nothing at all" maxlength="120">
    </div>
  </div>

  <div class="efd-ritual-bar">
    <div class="efd-action-row">
      <button class="efd-btn efd-btn-ritual" id="efd-shuffle-btn">Shuffle</button>
      <button class="efd-btn efd-btn-ritual" id="efd-cut-btn" disabled>Cut</button>
      <button class="efd-btn efd-btn-reset" id="efd-reset-btn" style="display:none">Draw Again</button>
    </div>
    <p class="efd-stage-hint" id="efd-stage-hint">The 22 Major Arcana are laid out. Choose how many cards to draw, then shuffle.</p>
  </div>

  <div class="efd-deck" id="efd-deck"></div>

  <div class="efd-result" id="efd-result" style="display:none">
    <div id="efd-revealed-cards"></div>
  </div>

  <p class="efd-disclaim-top">${GENTLE}</p>
</div>
<style>
#efd-wrap{font-size:16px;color:#1A1A2E}
.efd-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.efd-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.efd-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.efd-field{display:flex;flex-direction:column;gap:5px}
.efd-field-grow{flex:1;min-width:240px}
.efd-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#1B4332}
.efd-input-row select,.efd-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;min-width:200px;font-family:inherit}
.efd-input-row select:disabled{background:#F3F3F3;color:#888}
.efd-field-grow input{width:100%;min-width:0}

.efd-ritual-bar{position:sticky;top:0;z-index:200;background:#fff;padding:12px 0;margin:0 0 14px;border-bottom:1px solid #EEE;box-shadow:0 2px 10px rgba(0,0,0,.06)}
.efd-action-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
.efd-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:46px;font-family:inherit}
.efd-btn:hover:not(:disabled){background:#1B4332}
.efd-btn:disabled{background:#BBB;cursor:not-allowed}
.efd-btn-ritual{min-width:130px}
.efd-btn-reset{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.efd-btn-reset:hover:not(:disabled){background:#F0F7F4}
.efd-stage-hint{color:#1B4332;font-size:15px;margin:0;font-weight:500;padding:8px 16px;background:#F0F7F4;border-radius:8px;border-left:3px solid #2D6A4F}
.efd-disclaim-top{color:#888;font-size:14px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

/* 牌背网格 */
.efd-deck{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:14px;margin-bottom:24px;transition:opacity .4s}
.efd-card-back{aspect-ratio:2/3;border-radius:12px;position:relative;background:linear-gradient(135deg,#1A1A2E 0%,#2D2D52 100%);border:2px solid #CFAA3E;box-shadow:0 4px 14px rgba(26,26,46,.22);transition:transform .25s,box-shadow .25s,border-color .25s;cursor:default}
.efd-card-back.efd-enter{animation:efdEnter .45s ease backwards}
.efd-back-inner{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.5);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#CFAA3E}
.efd-back-sym{font-size:34px;line-height:1}
.efd-back-label{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700}
.efd-deck:not(.efd-deck-pickable) .efd-card-back{opacity:.72}
.efd-deck:not(.efd-deck-pickable) .efd-card-back:hover{transform:none}
.efd-deck-pickable .efd-card-back{cursor:pointer}
.efd-deck-pickable .efd-card-back:hover{transform:translateY(-7px);box-shadow:0 10px 22px rgba(26,26,46,.32)}
.efd-card-back.selected{border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.35),0 8px 18px rgba(26,26,46,.3);transform:translateY(-7px)}
.efd-card-back.selected .efd-back-inner{color:#7FD1A8}
.efd-deck.efd-deck-done{pointer-events:none}
.efd-deck.efd-deck-done .efd-card-back:not(.flipped){opacity:.3}
.efd-card-back.flipped{animation:efdFlipOver .55s ease}
.efd-card-back.efd-is-front{background:linear-gradient(135deg,#2D6A4F 0%,#1B4332 100%);opacity:1 !important;cursor:default}
.efd-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.55);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;padding:8px;text-align:center}
.efd-front-num{font-size:12px;color:#CFAA3E;font-weight:700}
.efd-front-name{font-size:16px;font-weight:700;line-height:1.15}
.efd-front-arch{font-size:12px;color:#CFAA3E;line-height:1.2}
.efd-front-orient{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;margin-top:4px}
.efd-front-up{background:#7FD1A8;color:#1A1A2E}
.efd-front-rev{background:#B59AC9;color:#1A1A2E}
@keyframes efdFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.efd-deck.efd-cut-anim{animation:efdCut .55s ease}
@keyframes efdEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes efdCut{0%{transform:translateX(0)}30%{transform:translateX(-10px) rotate(-1deg)}60%{transform:translateX(10px) rotate(1deg)}100%{transform:translateX(0) rotate(0)}}

/* 单牌结果卡 */
.efd-result{margin-top:8px}
.efd-card{background:#fff;border:1px solid #EEE;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;animation:efdReveal .5s ease}
@keyframes efdReveal{0%{opacity:0;transform:translateY(14px) rotateY(-12deg)}100%{opacity:1;transform:translateY(0) rotateY(0)}}
.efd-card-pos{background:#F0F7F4;border-bottom:1px solid #EEE;padding:8px 22px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1B4332}
.efd-card-head{background:#1A1A2E;padding:24px 26px;color:#fff}
.efd-card-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.efd-card-name{font-size:30px;font-weight:700;line-height:1.1}
.efd-card-arch{font-size:16px;color:#CFAA3E;font-weight:600;margin-top:4px}
.efd-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.efd-upright{background:#2D6A4F;color:#fff}
.efd-reversed{background:#6B4E8A;color:#fff}
.efd-card-body{padding:22px 26px}
.efd-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.efd-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.efd-meta-chip b{color:#1A1A2E}
.efd-kw-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.efd-kw{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:4px 11px;border-radius:14px;font-size:14px;font-weight:500}
.efd-meaning-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.efd-meaning{font-size:16px;color:#444;line-height:1.7;margin-bottom:18px}

.efd-lens-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}
.efd-lens{background:#FAFAFA;border:1px solid #EEE;border-radius:10px;padding:14px}
.efd-lens.eastern{background:#FBF3E5;border-color:#E8C887}
.efd-lens-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.efd-lens.eastern .efd-lens-lbl{color:#7A5A12}
.efd-lens-txt{font-size:15px;color:#555;line-height:1.6}
.efd-lens.eastern .efd-lens-txt{color:#5A4208}

.efd-practice{background:#FBF3E5;border:1px solid #E8C887;border-radius:12px;padding:16px 18px;margin-bottom:18px}
.efd-practice-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;margin-bottom:6px}
.efd-practice-txt{font-size:15px;color:#5A4208;line-height:1.6;font-style:italic}

.efd-stones-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:10px}
.efd-stones{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:6px}
.efd-stone-card{background:#FAFAFA;border:1px solid #EEE;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.efd-stone-img{width:64px;height:64px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#EEE}
.efd-stone-body{flex:1;min-width:0}
.efd-stone-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.efd-stone-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:2px 0 5px}
.efd-stone-reason{font-size:14px;color:#666;line-height:1.55}
.efd-stone-shop{display:inline-block;margin-top:6px;font-size:14px;font-weight:600;color:#2D6A4F !important;text-decoration:none}

.efd-related-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:16px;padding-top:14px;border-top:1px dashed #EEE}
.efd-related-lbl{font-size:13px;font-weight:700;color:#888;margin-right:4px}
.efd-related-chip{background:#F0F0F5;border:1px solid #DDD;border-radius:8px;padding:5px 11px;font-size:14px;color:#444 !important;text-decoration:none}
.efd-related-chip:hover{background:#EAEAF5;color:#1A1A2E !important}

.efd-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.efd-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600}
.efd-cta-primary{background:#2D6A4F;color:#fff !important}
.efd-cta-primary:hover{background:#1B4332}
.efd-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}

.efd-seo-accordion{margin:32px 0 0}
.efd-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.efd-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.efd-seo-details summary::-webkit-details-marker{display:none}
.efd-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.efd-seo-details[open] summary:after{content:'-'}
.efd-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.efd-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.efd-seo-content h2:first-child{margin-top:0}
.efd-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
@media(max-width:900px){.efd-lens-grid{grid-template-columns:1fr}.efd-stones{grid-template-columns:1fr}}
@media(max-width:640px){.efd-h1{font-size:26px}.efd-input-row select,.efd-input-row input{min-width:150px;font-size:15px}.efd-card-name{font-size:24px}.efd-back-sym{font-size:28px}.efd-card-head{padding:20px 18px}.efd-card-body{padding:18px}.efd-deck{grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px}}
</style>
<!-- JSON data in standalone application/json block -->
<script type="application/json" id="efd-data">${DATA_BLOCK}</script>
<!-- executable JS Base64-encoded to survive WP wp_kses entity-escaping. Loader decodes + evals at runtime. -->
<script type="text/plain" id="efd-app">__EFD_APP_B64__</script>
<script>
(function(){var b=document.getElementById('efd-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EFD init failed',e);}})();
</script>
<!-- ===== Draw Tarot Cards Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How do I draw tarot cards for free?","acceptedAnswer":{"@type":"Answer","text":"Choose how many cards you want to draw (one to ten), shuffle the deck, cut it, then pick your cards from the spread. Each card you pick is revealed upright or reversed, with its full meaning, keywords, and crystal pairings. There is no fixed spread meaning and no verdict imposed — you read each card on its own."}},
{"@type":"Question","name":"How many tarot cards should I draw?","acceptedAnswer":{"@type":"Answer","text":"One card works well for a daily pull or a quick prompt. Three cards let you read a small constellation, such as Past-Present-Future, or three independent threads. Five to ten cards suit a fuller survey of a situation. There is no right number — fewer cards ask for deeper attention to each, more cards ask for synthesis."}},
{"@type":"Question","name":"What is the difference between upright and reversed tarot cards?","acceptedAnswer":{"@type":"Answer","text":"An upright card points to the archetype expressing in its more open form. A reversed card points to the shadow side of that archetype — the tension, block, or invitation to reflect — never to a curse or bad luck. Both are simply information: one is not better than the other."}},
{"@type":"Question","name":"Is a free tarot draw different from a spread?","acceptedAnswer":{"@type":"Answer","text":"A spread assigns a fixed meaning to each position, such as card 2 being the challenge. A free draw leaves position open: you can assign meanings if you like, or read each card independently. The free draw is more flexible when you do not yet know what shape your question takes."}},
{"@type":"Question","name":"What crystals go with tarot cards?","acceptedAnswer":{"@type":"Answer","text":"Each Major Arcana card pairs with crystals chosen for its archetype and orientation. A reversed card leans toward stones of steadying and discernment, while an upright card leans toward stones that support its open expression. Clear quartz and selenite are traditional companions for keeping the reading space clear."}}
]}
]}
</script>
<!-- ===== End Draw Tarot Cards ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Draw Tarot Cards SEO Accordion ===== -->
<section class="efd-seo-accordion" aria-label="Tarot draw guide">
  <details class="efd-seo-details">
    <summary>Learn More About Drawing Tarot Cards</summary>
    <div class="efd-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Draw Tarot Cards SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'draw-tarot-cards.html');
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function(ch){ return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__EFD_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function(full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Draw Tarot Cards generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'cards |', APP_B64.length, 'b64 chars');
