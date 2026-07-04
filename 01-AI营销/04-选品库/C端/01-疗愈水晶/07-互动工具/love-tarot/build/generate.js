/**
 * Love Tarot Reading v1 — 复用 crystal-tarot-draw v7 选牌引擎
 * 打开即22牌背横向铺开 → Shuffle洗牌 → Cut切牌 → 用户点选牌背 → Validate确认 → 翻牌揭示
 *
 * 爱情塔罗差异化（vs crystal-tarot-draw）：
 *   1) 4 爱情场景预设（选场景→抽牌）：What is he thinking / True love / Relationship status / Getting back together
 *   2) Spread: 单牌(快速答) + 三牌阵(Relationship Past/Present/Future)
 *   3) 解读侧重感情/关系：场景化引导 + 牌义爱情向 + 水晶用 crystals.best_love（爱情石）
 *   4) self-reflection 合规：关系解读非命运确定论，禁"他一定会回来"类承诺
 *
 * 复用 v7：flex 横向铺开 + Shuffle/Cut/Pick/Validate/翻牌 + base64 包装 JS + asciiJSON 数据块
 *       + 翻牌 scrollIntoView({block:'nearest'}) 不跳走 + 字体 min14 + 水晶牌背
 * 22 张大阿尔卡那 tarot-knowledge.json + crystal-meaning-search/data/search-data.json
 * CSS 前缀 elv-. URL 根级 /tools/love-tarot/. 输出: ./love-tarot-reading.html
 */
const fs = require('fs');
const path = require('path');

const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));

// >>>>>>> added by fix-major-crystal-slugs.js (兼容 tarot-knowledge -meaning slug + search-data 短 slug key)
function normSlug(s){ return s ? String(s).replace(/-meaning$/,'') : s; }
// <<<<<<< added by fix-major-crystal-slugs.js

const BY_SLUG = {};
SD.crystals.forEach(c => {
  BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || ('/shop/?s=' + c.slug) };
});
const HEALING = '/product-category/healing-crystals-jewelry/';

function enrichStone(s) {
  if (!s) return null;
  const sc = BY_SLUG[normSlug(s.slug)] || { name: s.name, img: '', link: '', shop: HEALING };
  return { slug: s.slug, name: sc.name || s.name, reason: s.reason, img: sc.img, link: sc.link, shop: sc.shop };
}

const NUM2SLUG = {};
TK.cards.forEach(c => { NUM2SLUG[c.number] = c.slug; });

const CARDS = TK.cards.map(c => ({
  number: c.number, slug: c.slug, name: c.name, archetype: c.archetype,
  element: c.element, astrology: c.astrology, theme: c.theme,
  upright_keywords: c.upright_keywords, reversed_keywords: c.reversed_keywords,
  upright_meaning: c.upright_meaning, reversed_meaning: c.reversed_meaning,
  psych: c.psychological_lens || '',
  practice: c.recommended_practice || '',
  chakra: c.chakra || [],
  related: (c.related_cards || []).map(n => NUM2SLUG[n]).filter(Boolean),
  crystals: {
    best_love: enrichStone(c.crystals.best_love),
    best_overall: enrichStone(c.crystals.best_overall),
    best_reversed: enrichStone(c.crystals.best_reversed)
  }
}));

// 4 爱情场景预设
const SCENARIOS = [
  {
    id: 'thinking',
    label: 'What Is He/She Thinking?',
    short: 'What they\'re thinking',
    single_pos: 'Their inner world right now',
    three_pos: ['What shaped their view', 'Where they are now', 'Where this is tending'],
    guide_single: 'This card reflects the archetype moving through their inner world — the energy coloring their thoughts, not a literal transcript of their mind. Read it as a mirror of the climate between you, and let it surface a question rather than a verdict.',
    guide_three: 'Read the three cards as a small story of the dynamic: what shaped how they see the connection, where they actually are now, and the direction the pattern is leaning — if nothing changes. It describes tendencies to reflect on, not fixed outcomes.'
  },
  {
    id: 'truelove',
    label: 'True Love / Soulmate',
    short: 'True love energy',
    single_pos: 'The energy around love right now',
    three_pos: ['What you carry into love', 'Where love is asking for attention', 'What love is leaning toward'],
    guide_single: 'This card speaks to the archetype active in your love life — the quality love is asking of you right now. It is not a forecast of a specific person arriving; it is a mirror of what is already moving, and what to tend.',
    guide_three: 'The three cards trace your relationship with love itself: what you bring from the past, what is asking for care now, and the direction the present pattern tends toward. Soulmate readings work best when they reveal what you are ready for — not who is coming.'
  },
  {
    id: 'status',
    label: 'Relationship Status',
    short: 'Where the relationship stands',
    single_pos: 'The heart of the relationship now',
    three_pos: ['What brought you together', 'Where the relationship stands', 'Where it is tending'],
    guide_single: 'This card names the archetype at the center of the relationship right now — its prevailing energy. Read it as a snapshot of the dynamic, surfacing what needs attention rather than pronouncing the relationship good or doomed.',
    guide_three: 'The three cards tell the story of the bond: what originally connected you, where the relationship actually stands today, and the direction things lean if the present continues. Use it to see the shape of the relationship more clearly, then choose how to tend it.'
  },
  {
    id: 'reconcile',
    label: 'Getting Back Together?',
    short: 'Reconciliation energy',
    single_pos: 'The energy around reconnecting',
    three_pos: ['What remains between you', 'What needs to change', 'Where this is tending'],
    guide_single: 'This card reflects the archetype moving through the question of reconciliation — the energy around reconnecting. It is not a yes/no on whether they will return; it is a mirror of what the reconnection would actually ask of you, and what needs honesty first.',
    guide_three: 'The three cards map the reconciliation question: what still lives between you, what would genuinely need to shift, and the direction the current pattern leans. Reconciliation readings cannot promise an outcome — they can only clarify what is real and what work it would take.'
  }
];

const GENTLE = 'Love tarot is a mirror for reflection, not a forecast of what someone else will do. The cards surface patterns and questions to sit with — they cannot read another person\'s mind, predict a reunion, or guarantee an outcome. Use this reading to see your situation more clearly; let your own choices, and honest conversation, shape what happens next.';

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({ cards: CARDS, scenarios: SCENARIOS });

// APP_JS: 复用 v7 选牌引擎(flex横向铺开+Shuffle/Cut/Pick/Validate+翻牌) + 爱情场景化解读
const APP_JS = `(function(){
  var rawData = document.getElementById('elv-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('ELVlove data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  var SCENARIOS = parsed.scenarios || [];
  var SCN_MAP = {}; SCENARIOS.forEach(function(s){ SCN_MAP[s.id]=s; });
  var state='initial';
  var deck=[];
  var picked=[];

  function scn(){ var s=document.getElementById('elv-scenario'); return s? (SCN_MAP[s.value]||SCENARIOS[0]) : SCENARIOS[0]; }
  function needed(){ var s=document.getElementById('elv-spread'); return (s&&s.value==='three')?3:1; }

  function buildDeck(){
    var idxs=[]; for(var i=0;i<CARDS.length;i++) idxs.push(i);
    for(var i=idxs.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t; }
    deck = idxs.map(function(ci){ return {cardIdx:ci, reversed:Math.random()<0.4}; });
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderDeck(){
    var el=document.getElementById('elv-deck');
    if(!el) return;
    var h='';
    for(var i=0;i<deck.length;i++){
      h+='<div class="elv-card-back elv-enter" data-pos="'+i+'">'
        +'<div class="elv-back-inner">'
        +'<div class="elv-back-crystal">'
        +'<div class="elv-crystal-top"></div>'
        +'<div class="elv-crystal-side elv-crystal-l"></div>'
        +'<div class="elv-crystal-face elv-crystal-m"></div>'
        +'<div class="elv-crystal-side elv-crystal-r"></div>'
        +'<div class="elv-crystal-base"></div>'
        +'</div>'
        +'<div class="elv-back-label">Love Tarot</div>'
        +'<div class="elv-back-spark">\\u2737</div>'
        +'<div class="elv-back-heart">\\u2661</div>'
        +'</div></div>';
    }
    el.innerHTML=h;
    var backs=el.querySelectorAll('.elv-card-back');
    for(var k=0;k<backs.length;k++){
      (function(b){ b.addEventListener('click', function(){ pickCard(parseInt(b.getAttribute('data-pos'),10)); }); })(backs[k]);
    }
  }

  function setStage(s){
    state=s;
    var deckEl=document.getElementById('elv-deck');
    var cutBtn=document.getElementById('elv-cut-btn');
    var shBtn=document.getElementById('elv-shuffle-btn');
    var validateBtn=document.getElementById('elv-validate-btn');
    var hint=document.getElementById('elv-stage-hint');
    var n=needed();
    if(deckEl){
      if(s==='cut'){ deckEl.classList.add('elv-deck-pickable'); }
      else { deckEl.classList.remove('elv-deck-pickable'); }
    }
    if(cutBtn){ cutBtn.disabled = (s!=='shuffled'); }
    if(shBtn){ shBtn.disabled = (s==='cut'||s==='revealed'); }
    if(validateBtn && s!=='cut'){ validateBtn.style.display='none'; }
    if(hint){
      if(s==='initial') hint.textContent='The 22 Major Arcana are laid out for your love reading. Shuffle the deck to begin.';
      else if(s==='shuffled') hint.textContent='Deck shuffled. Cut the cards to continue.';
      else if(s==='cut') hint.textContent='Pick '+(n===1?'1 card':'3 cards')+' from the spread. Tap a card back to choose, tap again to undo.';
      else if(s==='revealed') hint.textContent='Your '+(n===1?'love card':'love reading')+' is revealed. Scroll down for the full interpretation.';
    }
  }

  function shuffleDeck(){
    buildDeck();
    renderDeck();
    picked=[];
    var deckEl=document.getElementById('elv-deck');
    if(deckEl){ deckEl.classList.remove('elv-deck-done'); }
    var holder=document.getElementById('elv-revealed-cards');
    if(holder) holder.innerHTML='';
    var res=document.getElementById('elv-result'); if(res) res.style.display='none';
    setStage('shuffled');
  }

  function cutDeck(){
    if(state!=='shuffled') return;
    var deckEl=document.getElementById('elv-deck');
    if(deckEl){
      deckEl.classList.add('elv-cut-anim');
      setTimeout(function(){ deckEl.classList.remove('elv-cut-anim'); }, 600);
    }
    setTimeout(function(){ setStage('cut'); }, 300);
  }

  function pickCard(pos){
    if(state!=='cut') return;
    var idx=picked.indexOf(pos);
    if(idx>-1){
      picked.splice(idx,1);
      var backOff=document.querySelector('#elv-deck .elv-card-back[data-pos="'+pos+'"]');
      if(backOff) backOff.classList.remove('selected');
    } else {
      var n=needed();
      if(picked.length>=n) return;
      picked.push(pos);
      var backOn=document.querySelector('#elv-deck .elv-card-back[data-pos="'+pos+'"]');
      if(backOn) backOn.classList.add('selected');
    }
    updatePickUI();
  }

  function updatePickUI(){
    var n=needed();
    var hint=document.getElementById('elv-stage-hint');
    var validateBtn=document.getElementById('elv-validate-btn');
    if(picked.length<n){
      if(validateBtn) validateBtn.style.display='none';
      if(hint){
        var left=n-picked.length;
        if(left===n) hint.textContent='Pick '+n+' card'+(n>1?'s':'')+' from the spread. Tap a card back to choose it.';
        else hint.textContent='Pick '+left+' more card'+(left>1?'s':'')+' ('+picked.length+'/'+n+' chosen). Tap again to undo.';
      }
    } else {
      if(validateBtn) validateBtn.style.display='inline-flex';
      if(hint) hint.textContent='You have chosen '+n+' card'+(n>1?'s':'')+'. Tap Reveal to see your love reading.';
    }
  }

  function onValidate(){
    if(state!=='cut') return;
    var n=needed();
    if(picked.length<n) return;
    revealAll();
  }

  function revealAll(){
    setStage('revealed');
    var spreadEl=document.getElementById('elv-spread');
    var spread=spreadEl?spreadEl.value:'single';
    for(var i=0;i<picked.length;i++){
      var pos=picked[i];
      var d=deck[pos];
      var backEl=document.querySelector('#elv-deck .elv-card-back[data-pos="'+pos+'"]');
      if(backEl){
        (function(el,card,rev){
          el.classList.add('flipped');
          setTimeout(function(){ el.classList.add('elv-is-front'); el.innerHTML=cardFrontHtml(card,rev); }, 280);
        })(backEl, CARDS[d.cardIdx], d.reversed);
      }
    }
    var holder=document.getElementById('elv-revealed-cards');
    var res=document.getElementById('elv-result');
    if(holder) holder.innerHTML='';
    if(res) res.style.display='block';
    // 场景引导块
    var guide=scn();
    var guideTxt = spread==='three' ? guide.guide_three : guide.guide_single;
    if(holder) holder.insertAdjacentHTML('beforeend',
      '<div class="elv-scenario-bar"><span class="elv-scenario-tag">Your focus</span><span class="elv-scenario-name">'+esc(guide.label)+'</span></div>'
      + '<p class="elv-scenario-guide">'+esc(guideTxt)+'</p>');
    for(var j=0;j<picked.length;j++){
      var pos2=picked[j];
      var d2=deck[pos2];
      var draw={ card:CARDS[d2.cardIdx], reversed:d2.reversed };
      var posLabel = spread==='three' ? guide.three_pos[j] : guide.single_pos;
      if(holder) holder.insertAdjacentHTML('beforeend', singleCardHtml(draw,posLabel));
    }
    var deckEl=document.getElementById('elv-deck');
    if(deckEl) deckEl.classList.add('elv-deck-done');
    var resetBtn=document.getElementById('elv-reset-btn');
    if(resetBtn) resetBtn.style.display='inline-block';
    setTimeout(function(){
      var ff=document.querySelector('#elv-deck .elv-card-back.flipped');
      if(ff){ try{ ff.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
    },450);
  }

  function resetDraw(){
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('elv-deck'); if(deckEl) deckEl.classList.remove('elv-deck-done');
    var holder=document.getElementById('elv-revealed-cards'); if(holder) holder.innerHTML='';
    var res=document.getElementById('elv-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('elv-reset-btn'); if(resetBtn) resetBtn.style.display='none';
    setStage('initial');
  }

  function kwRow(kws){ return kws.map(function(k){return '<span class="elv-kw">'+esc(k)+'</span>';}).join(''); }
  function stoneCardHtml(tag,stone){
    if(!stone) return '';
    var img=stone.img?'<img class="elv-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">':'';
    return '<div class="elv-stone-card">'+img
      +'<div class="elv-stone-body">'
      +'<div class="elv-stone-tag">'+esc(tag)+'</div>'
      +'<div class="elv-stone-name">'+esc(stone.name)+'</div>'
      +'<div class="elv-stone-reason">'+esc(stone.reason)+'</div>'
      +'<a class="elv-stone-shop" href="'+esc(stone.shop)+'">Shop '+esc(stone.name)+' &rarr;</a>'
      +'</div></div>';
  }
  function relatedHtml(c){
    if(!c.related||!c.related.length) return '';
    var chips=c.related.map(function(sl){return '<a class="elv-related-chip" href="/tarot-'+sl+'-crystals/">'+esc(cardNameBySlug(sl))+' &rarr;</a>';}).join('');
    return '<div class="elv-related-row"><span class="elv-related-lbl">Related cards:</span>'+chips+'</div>';
  }
  function cardNameBySlug(sl){ for(var i=0;i<CARDS.length;i++){if(CARDS[i].slug===sl) return CARDS[i].name;} return sl; }

  function cardFrontHtml(c,rev){
    return '<div class="elv-front-face">'
      +'<div class="elv-front-num">Major Arcana #'+c.number+'</div>'
      +'<div class="elv-front-name">'+esc(c.name)+'</div>'
      +'<div class="elv-front-arch">'+esc(c.archetype)+'</div>'
      +'<span class="elv-front-orient '+(rev?'elv-front-rev':'elv-front-up')+'">'+(rev?'Reversed':'Upright')+'</span>'
      +'</div>';
  }
  function singleCardHtml(draw,posLabel){
    var c=draw.card, rev=draw.reversed;
    var kws=rev?c.reversed_keywords:c.upright_keywords;
    var meaning=rev?c.reversed_meaning:c.upright_meaning;
    // 爱情侧重: 优先 best_love(爱情石), 逆位用 best_reversed(阴影石), 兜底 best_overall
    var stones=[];
    if(rev){
      if(c.crystals.best_reversed) stones.push(['For the shadow side',c.crystals.best_reversed]);
      if(c.crystals.best_love) stones.push(['For love',c.crystals.best_love]);
    } else {
      if(c.crystals.best_love) stones.push(['For love',c.crystals.best_love]);
      if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }
    var stonesHtml=stones.map(function(s){return stoneCardHtml(s[0],s[1]);}).join('');
    var chakraChip = c.chakra&&c.chakra.length ? '<span class="elv-meta-chip"><b>Chakra:</b> '+esc(c.chakra.join(', '))+'</span>' : '';
    var posHtml = posLabel ? '<div class="elv-card-pos">'+esc(posLabel)+'</div>' : '';
    var practiceHtml = c.practice ? '<div class="elv-practice"><div class="elv-practice-lbl">A question to sit with</div><div class="elv-practice-txt">'+esc(c.practice)+'</div></div>' : '';

    return '<div class="elv-card">'+posHtml
      +'<div class="elv-card-head">'
      +'<div class="elv-card-num">Major Arcana #'+c.number+'</div>'
      +'<div class="elv-card-name">'+esc(c.name)+'</div>'
      +'<div class="elv-card-arch">'+esc(c.archetype)+'</div>'
      +'<span class="elv-card-orient '+(rev?'elv-reversed':'elv-upright')+'">'+(rev?'Reversed \\u2014 shadow aspect':'Upright')+'</span>'
      +'</div>'
      +'<div class="elv-card-body">'
      +'<div class="elv-meta-row">'
      +'<span class="elv-meta-chip"><b>Element:</b> '+esc(c.element)+'</span>'
      +'<span class="elv-meta-chip"><b>Astrology:</b> '+esc(c.astrology)+'</span>'
      +chakraChip
      +'</div>'
      +'<div class="elv-kw-row">'+kwRow(kws)+'</div>'
      +'<div class="elv-meaning-lbl">'+(rev?'Reversed meaning (for reflection)':'Meaning in your love reading')+'</div>'
      +'<div class="elv-meaning">'+esc(meaning)+'</div>'
      +practiceHtml
      +'<div class="elv-stones-lbl">Crystals for love &amp; this draw</div>'
      +'<div class="elv-stones">'+stonesHtml+'</div>'
      +relatedHtml(c)
      +'<div class="elv-cta-row">'
      +'<a class="elv-cta elv-cta-primary" href="/tarot-'+c.slug+'-crystals/">Read the full '+esc(c.name)+' guide &rarr;</a>'
      +'<a class="elv-cta elv-cta-sec" href="/product-category/healing-crystals-jewelry/">Shop love &amp; healing jewelry &rarr;</a>'
      +'</div>'
      +'</div></div>';
  }

  function onScenarioChange(){ /* 场景切换不影响已抽牌, 仅刷新引导(下次抽牌生效) */ }

  function init(){
    buildDeck();
    renderDeck();
    var shBtn=document.getElementById('elv-shuffle-btn');
    var cutBtn=document.getElementById('elv-cut-btn');
    var rstBtn=document.getElementById('elv-reset-btn');
    var valBtn=document.getElementById('elv-validate-btn');
    if(shBtn) shBtn.addEventListener('click', shuffleDeck);
    if(cutBtn) cutBtn.addEventListener('click', cutDeck);
    if(rstBtn) rstBtn.addEventListener('click', resetDraw);
    if(valBtn) valBtn.addEventListener('click', onValidate);
    setStage('initial');
    window.ELVlove={ shuffle:shuffleDeck, cut:cutDeck, pick:pickCard, validate:onValidate, reset:resetDraw };
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

const SCENARIO_OPTIONS = SCENARIOS.map(s => `        <option value="${s.id}">${s.label}</option>`).join('\n');

let html = `<!-- ===== Earthward Love Tarot Reading v1 ===== -->
<div id="elv-wrap">
  <h1 class="elv-h1">Love Tarot Reading</h1>
  <p class="elv-intro">Choose a love scenario, then shuffle, cut, and pick your cards. Each reveals an archetype for reflecting on your relationship — what is moving, what needs attention, and what to sit with. Love tarot is a mirror for self-reflection; it cannot read another person's mind or predict a reunion, but it can help you see the dynamic more clearly.</p>

  <div class="elv-input-row">
    <div class="elv-field">
      <label class="elv-field-lbl" for="elv-scenario">Your love focus</label>
      <select id="elv-scenario">
${SCENARIO_OPTIONS}
      </select>
    </div>
    <div class="elv-field">
      <label class="elv-field-lbl" for="elv-spread">Spread</label>
      <select id="elv-spread">
        <option value="single">Single Card — quick answer</option>
        <option value="three">Three Cards — relationship story</option>
      </select>
    </div>
    <div class="elv-field elv-field-grow">
      <label class="elv-field-lbl" for="elv-question">Your question (optional)</label>
      <input id="elv-question" type="text" placeholder="What do you want to understand about your love life?" maxlength="140">
    </div>
  </div>

  <div class="elv-ritual-bar">
    <div class="elv-action-row">
      <button class="elv-btn elv-btn-ritual" id="elv-shuffle-btn">Shuffle</button>
      <button class="elv-btn elv-btn-ritual" id="elv-cut-btn" disabled>Cut</button>
      <button class="elv-btn elv-btn-validate" id="elv-validate-btn" style="display:none">Reveal <span class="elv-validate-arrow">&rarr;</span></button>
      <button class="elv-btn elv-btn-reset" id="elv-reset-btn" style="display:none">Draw Again</button>
    </div>
    <p class="elv-stage-hint" id="elv-stage-hint">The 22 Major Arcana are laid out for your love reading. Shuffle the deck to begin.</p>
  </div>

  <div class="elv-deck" id="elv-deck"></div>

  <div class="elv-result" id="elv-result" style="display:none">
    <div id="elv-revealed-cards"></div>
  </div>

  <p class="elv-disclaim-top">${GENTLE}</p>
</div>
<style>
#elv-wrap{font-size:16px;color:#1A1A2E}
.elv-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.elv-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.elv-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.elv-field{display:flex;flex-direction:column;gap:5px}
.elv-field-grow{flex:1;min-width:220px}
.elv-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#7A2E4A}
.elv-input-row select,.elv-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;min-width:200px;font-family:inherit}
.elv-field-grow input{width:100%;min-width:0}

.elv-ritual-bar{position:sticky;top:0;z-index:200;background:#fff;padding:12px 0;margin:0 0 14px;border-bottom:1px solid #EEE;box-shadow:0 2px 10px rgba(0,0,0,.06)}
.elv-action-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
.elv-btn{background:#A23E5C;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:46px;font-family:inherit}
.elv-btn:hover:not(:disabled){background:#7A2E4A}
.elv-btn:disabled{background:#BBB;cursor:not-allowed}
.elv-btn-ritual{min-width:130px}
.elv-btn-reset{background:#fff;color:#A23E5C !important;border:1px solid #A23E5C}
.elv-btn-reset:hover:not(:disabled){background:#FBF0F4}
.elv-btn-validate{display:inline-flex;align-items:center;gap:8px;background:#CFAA3E;color:#1A1A2E !important;border:none;min-width:150px;font-weight:700;animation:elvPulse 2s ease-in-out infinite}
.elv-btn-validate:hover{background:#B8902A;transform:translateY(-1px)}
.elv-validate-arrow{display:inline-block;transition:transform .2s}
.elv-btn-validate:hover .elv-validate-arrow{transform:translateX(3px)}
@keyframes elvPulse{0%,100%{box-shadow:0 0 0 0 rgba(207,170,62,.5)}50%{box-shadow:0 0 0 8px rgba(207,170,62,0)}}
.elv-stage-hint{color:#7A2E4A;font-size:15px;margin:0;font-weight:500;padding:8px 16px;background:#FBF0F4;border-radius:8px;border-left:3px solid #A23E5C}
.elv-disclaim-top{color:#888;font-size:13px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

/* 牌背横向铺开 */
.elv-deck{display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;gap:14px;margin-bottom:24px;padding:6px 4px 14px;transition:opacity .4s;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#A23E5C transparent}
.elv-deck::-webkit-scrollbar{height:8px}
.elv-deck::-webkit-scrollbar-thumb{background:#A23E5C;border-radius:4px}
.elv-deck::-webkit-scrollbar-track{background:rgba(0,0,0,.05)}
.elv-card-back{flex:0 0 120px;width:120px;aspect-ratio:2/3;border-radius:12px;position:relative;background:linear-gradient(135deg,#2A1A2E 0%,#4A2D4A 100%);border:2px solid #CFAA3E;box-shadow:0 4px 14px rgba(42,26,46,.22);transition:transform .25s,box-shadow .25s,border-color .25s;cursor:default}
.elv-card-back.elv-enter{animation:elvEnter .45s ease backwards}
.elv-back-inner{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.5);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#E8B8C8}

.elv-back-crystal{position:relative;width:42px;height:58px;margin-bottom:2px}
.elv-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-bottom:14px solid rgba(232,184,200,.85)}
.elv-crystal-face.elv-crystal-m{position:absolute;top:12px;left:7px;width:28px;height:34px;background:linear-gradient(180deg,rgba(232,184,200,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.elv-crystal-side.elv-crystal-l{position:absolute;top:14px;left:0;width:9px;height:30px;background:rgba(162,62,92,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.elv-crystal-side.elv-crystal-r{position:absolute;top:14px;right:0;width:9px;height:30px;background:rgba(162,62,92,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.elv-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:8px solid rgba(162,62,92,.85)}
.elv-back-spark{position:absolute;top:14px;font-size:12px;color:rgba(207,170,62,.85);opacity:.8}
.elv-back-heart{position:absolute;bottom:14px;font-size:14px;color:rgba(232,184,200,.85)}
.elv-back-label{font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.2;color:#CFAA3E}
.elv-deck:not(.elv-deck-pickable) .elv-card-back{opacity:.72}
.elv-deck:not(.elv-deck-pickable) .elv-card-back:hover{transform:none}
.elv-deck-pickable .elv-card-back{cursor:pointer}
.elv-deck-pickable .elv-card-back:hover{transform:translateY(-7px);box-shadow:0 10px 22px rgba(42,26,46,.32)}
.elv-card-back.selected{border-color:#A23E5C;box-shadow:0 0 0 3px rgba(162,62,92,.35),0 8px 18px rgba(42,26,46,.3);transform:translateY(-7px)}
.elv-card-back.selected .elv-back-inner{color:#F5C8D8}
.elv-deck.elv-deck-done{pointer-events:none}
.elv-deck.elv-deck-done .elv-card-back:not(.flipped){opacity:.3}
.elv-card-back.flipped{animation:elvFlipOver .55s ease}
.elv-card-back.elv-is-front{background:linear-gradient(135deg,#A23E5C 0%,#7A2E4A 100%);opacity:1 !important;cursor:default}
.elv-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.55);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;padding:8px;text-align:center}
.elv-front-num{font-size:12px;color:#E8B8C8;font-weight:700}
.elv-front-name{font-size:16px;font-weight:700;line-height:1.15}
.elv-front-arch{font-size:12px;color:#E8B8C8;line-height:1.2}
.elv-front-orient{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;margin-top:4px}
.elv-front-up{background:#E8B8C8;color:#2A1A2E}
.elv-front-rev{background:#B59AC9;color:#2A1A2E}
@keyframes elvFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.elv-deck.elv-cut-anim{animation:elvCut .55s ease}
@keyframes elvEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes elvCut{0%{transform:translateX(0)}30%{transform:translateX(-10px) rotate(-1deg)}60%{transform:translateX(10px) rotate(1deg)}100%{transform:translateX(0) rotate(0)}}

/* 结果区 */
.elv-result{margin-top:8px}
.elv-scenario-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,#FBF0F4 0%,#FFF8F0 100%);border:1px solid #E8C8D5;border-radius:12px;padding:14px 18px;margin-bottom:14px}
.elv-scenario-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#A23E5C;background:#fff;padding:4px 10px;border-radius:8px;border:1px solid #E8C8D5}
.elv-scenario-name{font-size:18px;font-weight:700;color:#2A1A2E}
.elv-scenario-guide{color:#666;font-size:15px;line-height:1.65;margin:0 0 20px;padding:0 4px}
.elv-card{background:#fff;border:1px solid #EEE;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;animation:elvReveal .5s ease}
@keyframes elvReveal{0%{opacity:0;transform:translateY(14px) rotateY(-12deg)}100%{opacity:1;transform:translateY(0) rotateY(0)}}
.elv-card-pos{background:#FBF0F4;border-bottom:1px solid #EEE;padding:8px 22px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7A2E4A}
.elv-card-head{background:#2A1A2E;padding:24px 26px;color:#fff}
.elv-card-num{display:inline-block;background:#CFAA3E;color:#2A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.elv-card-name{font-size:32px;font-weight:700;line-height:1.1}
.elv-card-arch{font-size:16px;color:#E8B8C8;font-weight:600;margin-top:4px}
.elv-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.elv-upright{background:#A23E5C;color:#fff}
.elv-reversed{background:#6B4E8A;color:#fff}
.elv-card-body{padding:22px 26px}
.elv-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.elv-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.elv-meta-chip b{color:#2A1A2E}
.elv-kw-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.elv-kw{background:#FBF0F4;border:1px solid #E8C8D5;color:#7A2E4A;padding:4px 11px;border-radius:14px;font-size:14px;font-weight:500}
.elv-meaning-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#A23E5C;margin-bottom:6px}
.elv-meaning{font-size:16px;color:#444;line-height:1.7;margin-bottom:18px}

.elv-practice{background:#FFF8F0;border:1px solid #E8C887;border-radius:12px;padding:16px 18px;margin-bottom:18px}
.elv-practice-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;margin-bottom:6px}
.elv-practice-txt{font-size:15px;color:#5A4208;line-height:1.6;font-style:italic}

.elv-stones-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#A23E5C;margin-bottom:10px}
.elv-stones{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:6px}
.elv-stone-card{background:#FAFAFA;border:1px solid #EEE;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.elv-stone-img{width:64px;height:64px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#EEE}
.elv-stone-body{flex:1;min-width:0}
.elv-stone-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#A23E5C}
.elv-stone-name{font-size:16px;font-weight:700;color:#2A1A2E;margin:2px 0 5px}
.elv-stone-reason{font-size:14px;color:#666;line-height:1.55}
.elv-stone-shop{display:inline-block;margin-top:6px;font-size:14px;font-weight:600;color:#A23E5C !important;text-decoration:none}

.elv-related-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:16px;padding-top:14px;border-top:1px dashed #EEE}
.elv-related-lbl{font-size:13px;font-weight:700;color:#888;margin-right:4px}
.elv-related-chip{background:#F5F0F5;border:1px solid #DDD;border-radius:8px;padding:5px 11px;font-size:14px;color:#444 !important;text-decoration:none}
.elv-related-chip:hover{background:#EFEAF5;color:#2A1A2E !important}

.elv-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.elv-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600}
.elv-cta-primary{background:#A23E5C;color:#fff !important}
.elv-cta-primary:hover{background:#7A2E4A}
.elv-cta-sec{background:#fff;color:#A23E5C !important;border:1px solid #A23E5C}

.elv-seo-accordion{margin:32px 0 0}
.elv-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.elv-seo-details summary{list-style:none;cursor:pointer;background:#F5E8F0;color:#2A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.elv-seo-details summary::-webkit-details-marker{display:none}
.elv-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#A23E5C}
.elv-seo-details[open] summary:after{content:'-'}
.elv-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.elv-seo-content h2{color:#2A1A2E;font-size:24px;margin:26px 0 10px}
.elv-seo-content h2:first-child{margin-top:0}
.elv-seo-content h3{color:#2A1A2E;font-size:19px;margin:20px 0 8px}
@media(max-width:900px){.elv-stones{grid-template-columns:1fr}}
@media(max-width:780px){
  .elv-deck{flex-wrap:wrap;overflow-x:visible;justify-content:center}
  .elv-card-back{flex:0 0 calc(33.333% - 14px);width:calc(33.333% - 14px)}
}
@media(max-width:640px){
  .elv-h1{font-size:26px}.elv-input-row select,.elv-input-row input{min-width:150px;font-size:15px}.elv-card-name{font-size:26px}
  .elv-card-head{padding:20px 18px}.elv-card-body{padding:18px}
  .elv-card-back{flex:0 0 calc(50% - 10px);width:calc(50% - 10px)}
  .elv-back-crystal{width:36px;height:50px}
  .elv-btn{padding:12px 22px;font-size:14px;height:44px}
  .elv-btn-ritual{min-width:110px}
  .elv-stage-hint{font-size:14px}
  .elv-scenario-name{font-size:16px}
}
</style>
<!-- JSON data in standalone application/json block -->
<script type="application/json" id="elv-data">${DATA_BLOCK}</script>
<!-- executable JS Base64-encoded to survive WP wp_kses entity-escaping. Loader decodes + evals at runtime. -->
<script type="text/plain" id="elv-app">__ELV_APP_B64__</script>
<script>
(function(){var b=document.getElementById('elv-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('ELVlove init failed',e);}})();
</script>
<!-- ===== Love Tarot Reading Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Is love tarot accurate?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('Love tarot is best understood as a mirror for reflection, not a literal forecast. The cards surface patterns, tensions, and questions about your relationship that are worth sitting with. They cannot read another person\'s mind or predict a guaranteed outcome, but they can help you see the dynamic you are in more clearly. The "accuracy" of a love reading lies in how honestly it helps you reflect, not in whether it predicts a specific event.')}}}},
{"@type":"Question","name":"How does a love tarot reading work?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('You choose a love focus (what someone is thinking, true love, your relationship status, or reconciliation), shuffle the deck, cut the cards, and pick one or three cards. Each card is a Major Arcana archetype read through a relationship lens — its upright meaning points to the open expression of that energy, while a reversed card points to its shadow side. The reading frames the dynamic and surfaces questions to consider; it does not hand down a verdict on your love life.')}}}},
{"@type":"Question","name":"Which spread should I choose — single card or three cards?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('Use a single card for a quick read on the energy around one question — for example, "what is the heart of the relationship right now." Use the three-card spread when you want the fuller story: what shaped the situation, where it stands now, and the direction it is tending if the present pattern continues. The three-card spread gives more context; the single card gives a sharper focus.')}}}},
{"@type":"Question","name":"Can love tarot tell me if we will get back together?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('No love tarot reading can promise whether a specific person will return. The reconciliation reading maps the energy around reconnecting — what still lives between you, what would genuinely need to shift, and the direction the current pattern leans — so you can see the situation honestly. It cannot override another person\'s free will or guarantee a reunion; it can only clarify what is real and what work a reconciliation would ask of you.')}}}},
{"@type":"Question","name":"Can tarot read someone else\'s thoughts?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('Tarot cannot literally read another person\'s mind. A "what is he thinking" reading reflects the archetype moving through the dynamic between you — the climate of the connection — rather than a transcript of their thoughts. Read it as a mirror of the relationship\'s energy and a prompt for honest conversation, not as a window into someone else\'s private mind.')}}}},
{"@type":"Question","name":"What crystals support a love tarot reading?","acceptedAnswer":{"@type":"Answer","text":${safeJSON('Each draw recommends love stones chosen for the card\'s archetype — most often Rose Quartz (the heart-opening stone) and Rhodonite or Rhodochrosite for emotional healing, with other stones matched to the specific card. An upright card leans toward stones of open-hearted love, while a reversed card leans toward stones that steady the shadow side. Holding or wearing the suggested stone while you sit with your reading keeps the card\'s theme present through the day.')}}}}
]}
]}
</script>
<!-- ===== End Love Tarot Reading v1 ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Love Tarot Reading SEO Accordion ===== -->
<section class="elv-seo-accordion" aria-label="Love tarot guide">
  <details class="elv-seo-details">
    <summary>Learn More About Love Tarot</summary>
    <div class="elv-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Love Tarot Reading SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'love-tarot-reading.html');
function asciiEscape(s) { return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__ELV_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function (full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Love Tarot Reading v1 generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'cards |', SCENARIOS.length, 'scenarios |', APP_B64.length, 'b64 chars');
