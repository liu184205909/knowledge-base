/**
 * Yes / No Tarot v10 — 升级 v10 抽牌标准(对齐皇冠 crystal-tarot-draw v10)
 * v10 改进(对比旧 v6 引擎):
 *   1) 卡牌左右滚动: deck grid → flex 横向 + overflow-x:auto(22 张大牌横排单排, 水平滑动浏览选牌)
 *      牌宽固定 flex:0 0 150px(大牌, 150px), 金色滚动条美化; 移动端(640px 以下)flex-wrap 换行(105px)
 *   2) focus 必选: focus select 加 placeholder(第一个 option value="" disabled selected), 未选 focus 点牌无效 + 红色提示
 *      focus = 问题类型(Love/Career/General Yes-No), 明确第一步
 *   3) 默认洗牌: init 即 buildDeck(initial 态可选牌, revealed 态拦截); 点牌直接有效, 不再需 Shuffle/Cut 三阶段
 *   4) 选满自动翻牌(去 Validate 强制): 选满 → 0.5s 后自动 revealAll + Shuffle Again 变 "Reveal" 高亮
 *   5) 按钮栏下方居中(justify-content:center), 不再 sticky 顶部
 * 保留: LEAN_MAP 判定 + 大判定卡(Yes 绿/No 红/Maybe 金) + 牌义 + 水晶 + Shop CTA
 * 数据: _shared/tarot-knowledge.json(22 大牌) + crystal-meaning-search/data/search-data.json(水晶 img/shop)
 * 约束: base64 包装可执行 JS / safeJSON + asciiJSON / 字体 min14 / 翻牌 scrollIntoView block:nearest /
 *       self-reflection 合规 / CSS 前缀 eyn-
 * URL /tools/yes-no-tarot/ (page 48070). 输出 ./yes-no-tarot.html
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

// 22 牌 yes/no/maybe 倾向映射(基于传统塔罗 yes/no 解读)
const LEAN_MAP = {
  'the-fool':           { upright: 'yes',   reversed: 'maybe' },
  'the-magician':       { upright: 'yes',   reversed: 'no'    },
  'the-high-priestess': { upright: 'maybe', reversed: 'maybe' },
  'the-empress':        { upright: 'yes',   reversed: 'no'    },
  'the-emperor':        { upright: 'yes',   reversed: 'no'    },
  'the-hierophant':     { upright: 'maybe', reversed: 'no'    },
  'the-lovers':         { upright: 'yes',   reversed: 'no'    },
  'the-chariot':        { upright: 'yes',   reversed: 'no'    },
  'strength':           { upright: 'yes',   reversed: 'maybe' },
  'the-hermit':         { upright: 'maybe', reversed: 'no'    },
  'wheel-of-fortune':   { upright: 'yes',   reversed: 'no'    },
  'justice':            { upright: 'maybe', reversed: 'no'    },
  'the-hanged-man':     { upright: 'no',    reversed: 'no'    },
  'death':              { upright: 'no',    reversed: 'no'    },
  'temperance':         { upright: 'yes',   reversed: 'no'    },
  'the-devil':          { upright: 'no',    reversed: 'maybe' },
  'the-tower':          { upright: 'no',    reversed: 'no'    },
  'the-star':           { upright: 'yes',   reversed: 'no'    },
  'the-moon':           { upright: 'no',    reversed: 'maybe' },
  'the-sun':            { upright: 'yes',   reversed: 'maybe' },
  'judgment':           { upright: 'yes',   reversed: 'no'    },
  'the-world':          { upright: 'yes',   reversed: 'maybe' }
};

const CARDS = TK.cards.map(c => ({
  number: c.number, slug: c.slug, name: c.name, archetype: c.archetype,
  element: c.element, astrology: c.astrology,
  upright_keywords: c.upright_keywords, reversed_keywords: c.reversed_keywords,
  upright_meaning: c.upright_meaning, reversed_meaning: c.reversed_meaning,
  lean: LEAN_MAP[c.slug] || { upright: 'maybe', reversed: 'maybe' },
  crystals: {
    best_overall: enrichStone(c.crystals.best_overall),
    best_upright: enrichStone(c.crystals.best_upright),
    best_reversed: enrichStone(c.crystals.best_reversed),
    best_love: enrichStone(c.crystals.best_love),
    best_daily_wear: enrichStone(c.crystals.best_daily_wear)
  }
}));

const GENTLE = 'Tarot and crystal meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. A yes/no reading is a tool for self-reflection on the energy around your question — not a prediction of fixed outcomes, and not a substitute for medical, financial, or professional advice.';

const LEAN_COPY = {
  yes:   { label: 'Yes',   color: '#2D6A4F', bg: '#F0F7F4', tag: 'The cards lean toward Yes',
           summary: 'The energy around your question is open and moving forward. Conditions support a "yes" — and they also ask you to act on it rather than wait for permission.' },
  no:    { label: 'No',    color: '#9B2D2D', bg: '#FBF0F0', tag: 'The cards lean toward No',
           summary: 'The energy is blocked, reversed, or not aligned. This is a sign to pause, reframe the question, or wait — pushing harder now is unlikely to help.' },
  maybe: { label: 'Maybe', color: '#7A5A12', bg: '#FBF3E5', tag: 'The cards lean toward Maybe',
           summary: 'The answer is mixed and hinges on something the cards are flagging for you to look at. The clearest next step is to examine that factor, not to force a decision.' }
};

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function(ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({ cards: CARDS, leans: LEAN_COPY, gentle: GENTLE });

// v10 APP_JS: flex 左右滚动(大牌) + focus 必选 + 默认洗牌 + 选满 0.5s 自动翻牌(去 Validate 强制)
const APP_JS = `(function(){
  var rawData = document.getElementById('eyn-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('EYN data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  var LEANS = parsed.leans || {};
  var state='initial'; // v10: initial(可选牌, 需先选focus) -> revealed (默认洗好)
  var deck=[];
  var picked=[];
  var autoRevealTimer=null; // v10: 选满 0.5s 自动翻牌定时器

  function needed(){ var s=document.getElementById('eyn-count'); return (s&&s.value==='three')?3:1; }

  // v10: focus 必选检查 — 未选 focus(value==="") 返回 false
  function focusReady(){
    var f=document.getElementById('eyn-focus');
    if(!f) return true;
    var v=f.value;
    return v && v!=='';
  }

  function buildDeck(){
    var idxs=[]; for(var i=0;i<CARDS.length;i++) idxs.push(i);
    for(var i=idxs.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t; }
    deck = idxs.map(function(ci){ return {cardIdx:ci, reversed:Math.random()<0.4}; });
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderDeck(){
    var el=document.getElementById('eyn-deck');
    if(!el) return;
    var h='';
    for(var i=0;i<deck.length;i++){
      h+='<div class="eyn-card-back eyn-enter" data-pos="'+i+'">'
        +'<div class="eyn-back-inner">'
        +'<div class="eyn-back-crystal">'
        +'<div class="eyn-crystal-top"></div>'
        +'<div class="eyn-crystal-side eyn-crystal-l"></div>'
        +'<div class="eyn-crystal-face eyn-crystal-m"></div>'
        +'<div class="eyn-crystal-side eyn-crystal-r"></div>'
        +'<div class="eyn-crystal-base"></div>'
        +'</div>'
        +'<div class="eyn-back-label">Yes / No Tarot</div>'
        +'<div class="eyn-back-spark">\\u2737</div>'
        +'</div></div>';
    }
    el.innerHTML=h;
    var backs=el.querySelectorAll('.eyn-card-back');
    for(var k=0;k<backs.length;k++){
      (function(b){ b.addEventListener('click', function(){ pickCard(parseInt(b.getAttribute('data-pos'),10)); }); })(backs[k]);
    }
  }

  function setStage(s){
    state=s;
    var deckEl=document.getElementById('eyn-deck');
    var shuffleBtn=document.getElementById('eyn-shuffle-btn');
    var hint=document.getElementById('eyn-stage-hint');
    var n=needed();
    if(deckEl){
      if(s==='revealed'){ deckEl.classList.remove('eyn-deck-pickable'); }
      else { deckEl.classList.add('eyn-deck-pickable'); }
    }
    if(shuffleBtn && s==='revealed'){ shuffleBtn.classList.remove('eyn-btn-reveal'); shuffleBtn.textContent='Shuffle Again'; }
    if(hint){
      if(s==='initial'){
        if(!focusReady()) hint.textContent='Select your focus, then pick '+(n===1?'1 card':'3 cards')+' from the spread below.';
        else hint.textContent='Pick '+(n===1?'1 card':'3 cards')+' from the spread below. Tap a card back to choose, tap again to undo.';
      }
      else if(s==='revealed') hint.textContent='Your reading is revealed. Scroll down for the verdict and full interpretation.';
    }
  }

  // v10: Shuffle Again = 重新洗牌(可选); 默认已洗好, 想换牌序再点
  function shuffleDeck(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('eyn-deck');
    if(deckEl){
      deckEl.classList.remove('eyn-deck-done');
      deckEl.classList.add('eyn-shuffle-anim');
      setTimeout(function(){ deckEl.classList.remove('eyn-shuffle-anim'); }, 600);
    }
    var holder=document.getElementById('eyn-revealed-cards'); if(holder) holder.innerHTML='';
    var verdict=document.getElementById('eyn-verdict'); if(verdict) verdict.style.display='none';
    var res=document.getElementById('eyn-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('eyn-reset-btn'); if(resetBtn) resetBtn.style.display='none';
    var shuffleBtn=document.getElementById('eyn-shuffle-btn'); if(shuffleBtn) shuffleBtn.classList.remove('eyn-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function pickCard(pos){
    if(state==='revealed') return; // v10: initial 态即可选(需先选 focus)
    if(!focusReady()){
      var hint=document.getElementById('eyn-stage-hint');
      if(hint){
        hint.textContent='Select your focus first, then pick your card' + (needed()>1?'s':'') + '.';
        hint.classList.add('eyn-hint-warn');
        setTimeout(function(){ hint.classList.remove('eyn-hint-warn'); }, 1800);
      }
      return;
    }
    var idx=picked.indexOf(pos);
    if(idx>-1){
      picked.splice(idx,1);
      var backOff=document.querySelector('#eyn-deck .eyn-card-back[data-pos="'+pos+'"]');
      if(backOff) backOff.classList.remove('selected');
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      var sb1=document.getElementById('eyn-shuffle-btn');
      if(sb1) sb1.classList.remove('eyn-btn-reveal');
    } else {
      var n=needed();
      if(picked.length>=n) return;
      picked.push(pos);
      var backOn=document.querySelector('#eyn-deck .eyn-card-back[data-pos="'+pos+'"]');
      if(backOn) backOn.classList.add('selected');
    }
    updatePickUI();
  }

  // v10: 选满后 Shuffle Again 按钮变 "Reveal" 高亮 + 0.5s 自动翻牌
  function updatePickUI(){
    if(state==='revealed') return;
    var n=needed();
    var hint=document.getElementById('eyn-stage-hint');
    var shuffleBtn=document.getElementById('eyn-shuffle-btn');
    if(picked.length<n){
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      if(shuffleBtn){ shuffleBtn.classList.remove('eyn-btn-reveal'); shuffleBtn.textContent='Shuffle Again'; }
      if(hint){
        if(!focusReady()) hint.textContent='Select your focus, then pick '+(n===1?'1 card':'3 cards')+' from the spread below.';
        else {
          var left=n-picked.length;
          if(left===n) hint.textContent='Pick '+n+' card'+(n>1?'s':'')+' from the spread below. Tap a card back to choose, tap again to undo.';
          else hint.textContent='Pick '+left+' more card'+(left>1?'s':'')+' ('+picked.length+'/'+n+' chosen). Tap again to undo.';
        }
      }
    } else {
      if(shuffleBtn){ shuffleBtn.classList.add('eyn-btn-reveal'); shuffleBtn.textContent='Reveal \\u2192'; }
      if(hint) hint.textContent='You have chosen '+n+' card'+(n>1?'s':'')+'. Revealing\\u2026';
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); }
      autoRevealTimer=setTimeout(function(){
        autoRevealTimer=null;
        if(state==='initial' && picked.length>=n){ revealAll(); }
      }, 500);
    }
  }

  // v10: Shuffle Again 按钮双功能 — 未选满=重新洗牌; 选满=Reveal 提前翻牌
  function onShuffleClick(){
    if(state==='initial' && picked.length>=needed()){
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      revealAll();
    } else {
      shuffleDeck();
    }
  }

  // 是与否判定: 每张牌取 lean(upright/reversed) -> 统计 yes/no/maybe, 多数决, 平票=maybe
  function computeVerdict(draws){
    var counts={yes:0,no:0,maybe:0};
    for(var i=0;i<draws.length;i++){
      var d=draws[i];
      var lean = d.reversed ? d.card.lean.reversed : d.card.lean.upright;
      counts[lean]=(counts[lean]||0)+1;
    }
    var arr=[['yes',counts.yes],['no',counts.no],['maybe',counts.maybe]];
    arr.sort(function(a,b){ return b[1]-a[1]; });
    if(arr[0][1]===arr[1][1]) return 'maybe';
    return arr[0][0];
  }

  function revealAll(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    setStage('revealed');
    var draws=[];
    for(var i=0;i<picked.length;i++){
      var pos=picked[i];
      var d=deck[pos];
      draws.push({ card:CARDS[d.cardIdx], reversed:d.reversed });
    }
    // 1) 选中牌背原地翻开显示牌面(翻转动画, 中途换内容)
    for(var k=0;k<picked.length;k++){
      var p2=picked[k];
      var d2=deck[p2];
      var backEl=document.querySelector('#eyn-deck .eyn-card-back[data-pos="'+p2+'"]');
      if(backEl){
        (function(el,card,rev){
          el.classList.add('flipped');
          setTimeout(function(){ el.classList.add('eyn-is-front'); el.innerHTML=cardFrontHtml(card,rev); }, 280);
        })(backEl, CARDS[d2.cardIdx], d2.reversed);
      }
    }
    // 2) 大判定卡
    var verdictKey = computeVerdict(draws);
    var verdictEl=document.getElementById('eyn-verdict');
    if(verdictEl){
      var vc = LEANS[verdictKey] || LEANS.maybe;
      verdictEl.style.display='block';
      verdictEl.style.borderColor=vc.color;
      verdictEl.style.background=vc.bg;
      verdictEl.innerHTML='<div class="eyn-verdict-tag" style="color:'+vc.color+'">'+esc(vc.tag)+'</div>'
        +'<div class="eyn-verdict-big" style="color:'+vc.color+'">'+esc(vc.label)+'</div>'
        +'<div class="eyn-verdict-sum">'+esc(vc.summary)+'</div>';
    }
    // 3) 每张牌义
    var holder=document.getElementById('eyn-revealed-cards');
    var res=document.getElementById('eyn-result');
    if(holder) holder.innerHTML='';
    if(res) res.style.display='block';
    for(var j=0;j<draws.length;j++){
      if(holder) holder.insertAdjacentHTML('beforeend', singleCardHtml(draws[j], draws.length===3?(j+1):0));
    }
    var deckEl=document.getElementById('eyn-deck'); if(deckEl) deckEl.classList.add('eyn-deck-done');
    var resetBtn=document.getElementById('eyn-reset-btn'); if(resetBtn) resetBtn.style.display='inline-block';
    setTimeout(function(){
      var ff=document.querySelector('#eyn-deck .eyn-card-back.flipped');
      if(ff){ try{ ff.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
    },450);
  }

  function resetDraw(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('eyn-deck'); if(deckEl) deckEl.classList.remove('eyn-deck-done');
    var holder=document.getElementById('eyn-revealed-cards'); if(holder) holder.innerHTML='';
    var verdict=document.getElementById('eyn-verdict'); if(verdict) verdict.style.display='none';
    var res=document.getElementById('eyn-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('eyn-reset-btn'); if(resetBtn) resetBtn.style.display='none';
    var shuffleBtn=document.getElementById('eyn-shuffle-btn'); if(shuffleBtn) shuffleBtn.classList.remove('eyn-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function kwRow(kws){ return kws.map(function(k){return '<span class="eyn-kw">'+esc(k)+'</span>';}).join(''); }
  function stoneCardHtml(tag,stone){
    if(!stone) return '';
    var img=stone.img?'<img class="eyn-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">':'';
    return '<div class="eyn-stone-card">'+img
      +'<div class="eyn-stone-body">'
      +'<div class="eyn-stone-tag">'+esc(tag)+'</div>'
      +'<div class="eyn-stone-name">'+esc(stone.name)+'</div>'
      +'<div class="eyn-stone-reason">'+esc(stone.reason)+'</div>'
      +'<a class="eyn-stone-shop" href="'+esc(stone.shop)+'">Shop '+esc(stone.name)+' &rarr;</a>'
      +'</div></div>';
  }

  function cardFrontHtml(c,rev){
    var lean = rev ? c.lean.reversed : c.lean.upright;
    var leanUp = lean.charAt(0).toUpperCase()+lean.slice(1);
    return '<div class="eyn-front-face">'
      +'<div class="eyn-front-num">Major Arcana #'+c.number+'</div>'
      +'<div class="eyn-front-name">'+esc(c.name)+'</div>'
      +'<div class="eyn-front-arch">'+esc(c.archetype)+'</div>'
      +'<span class="eyn-front-orient '+(rev?'eyn-front-rev':'eyn-front-up')+'">'+(rev?'Reversed':'Upright')+'</span>'
      +'<span class="eyn-front-lean">'+esc(leanUp)+'</span>'
      +'</div>';
  }

  function singleCardHtml(draw,posNum){
    var c=draw.card, rev=draw.reversed;
    var lean = rev ? c.lean.reversed : c.lean.upright;
    var kws=rev?c.reversed_keywords:c.upright_keywords;
    var meaning=rev?c.reversed_meaning:c.upright_meaning;
    var focusEl=document.getElementById('eyn-focus');
    var focus=focusEl?focusEl.value:'general';
    var stones=[];
    if(rev){
      if(c.crystals.best_reversed) stones.push(['For the shadow side',c.crystals.best_reversed]);
      if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }else if(focus==='love' && c.crystals.best_love){
      stones.push(['For love',c.crystals.best_love]);
      if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }else{
      if(c.crystals.best_overall) stones.push(['Best for this draw',c.crystals.best_overall]);
      if(c.crystals.best_daily_wear) stones.push(['Daily wear',c.crystals.best_daily_wear]);
    }
    var stonesHtml=stones.map(function(s){return stoneCardHtml(s[0],s[1]);}).join('');
    var posHtml = posNum ? '<div class="eyn-card-pos">Card '+posNum+' of 3</div>' : '';
    var leanLabel = LEANS[lean] ? LEANS[lean].label : 'Maybe';
    return '<div class="eyn-card">'+posHtml
      +'<div class="eyn-card-head">'
      +'<div class="eyn-card-num">Major Arcana #'+c.number+'</div>'
      +'<div class="eyn-card-name">'+esc(c.name)+'</div>'
      +'<div class="eyn-card-arch">'+esc(c.archetype)+'</div>'
      +'<span class="eyn-card-orient '+(rev?'eyn-reversed':'eyn-upright')+'">'+(rev?'Reversed':'Upright')+'</span>'
      +'<span class="eyn-card-lean">This card leans: '+esc(leanLabel)+'</span>'
      +'</div>'
      +'<div class="eyn-card-body">'
      +'<div class="eyn-meta-row">'
      +'<span class="eyn-meta-chip"><b>Element:</b> '+esc(c.element)+'</span>'
      +'<span class="eyn-meta-chip"><b>Astrology:</b> '+esc(c.astrology)+'</span>'
      +'</div>'
      +'<div class="eyn-kw-row">'+kwRow(kws)+'</div>'
      +'<div class="eyn-meaning-lbl">'+(rev?'Reversed meaning (for reflection)':'Upright meaning')+'</div>'
      +'<div class="eyn-meaning">'+esc(meaning)+'</div>'
      +'<div class="eyn-stones-lbl">Crystals for this card</div>'
      +'<div class="eyn-stones">'+stonesHtml+'</div>'
      +'<div class="eyn-cta-row">'
      +'<a class="eyn-cta eyn-cta-primary" href="/tarot-'+c.slug+'-crystals/">Read the full '+esc(c.name)+' guide &rarr;</a>'
      +'<a class="eyn-cta eyn-cta-sec" href="/product-category/healing-crystals-jewelry/">Shop healing jewelry &rarr;</a>'
      +'</div>'
      +'</div></div>';
  }

  function init(){
    buildDeck(); // v10: 默认洗好, initial 态即可选牌(需先选 focus)
    renderDeck();
    var shBtn=document.getElementById('eyn-shuffle-btn');
    var rstBtn=document.getElementById('eyn-reset-btn');
    if(shBtn) shBtn.addEventListener('click', onShuffleClick);
    if(rstBtn) rstBtn.addEventListener('click', resetDraw);
    var fe=document.getElementById('eyn-focus');
    if(fe) fe.addEventListener('change', function(){ if(state==='initial') updatePickUI(); });
    setStage('initial');
    updatePickUI();
    window.EYN={ shuffle:shuffleDeck, pick:pickCard, reveal:revealAll, reset:resetDraw };
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

let html = `<!-- ===== Earthward Yes/No Tarot v10 ===== -->
<div id="eyn-wrap">
  <h1 class="eyn-h1">Yes / No Tarot</h1>
  <p class="eyn-intro">Ask a yes-or-no question, choose your focus, then pick one or three cards from the Major Arcana laid out below. Each card leans toward <strong>Yes</strong>, <strong>No</strong>, or <strong>Maybe</strong> based on its upright or reversed meaning — and together they give you a clear lean, the energy around your question, and crystals to sit with as you decide. No card is "good" or "bad"; the reading is a mirror for reflection, not a fixed forecast.</p>

  <div class="eyn-input-row">
    <div class="eyn-field">
      <label class="eyn-field-lbl" for="eyn-focus">Your focus</label>
      <select id="eyn-focus">
        <option value="" disabled selected>Select your focus</option>
        <option value="love">Love Yes / No</option>
        <option value="career">Career Yes / No</option>
        <option value="general">General Yes / No</option>
      </select>
    </div>
    <div class="eyn-field">
      <label class="eyn-field-lbl" for="eyn-count">Number of cards</label>
      <select id="eyn-count">
        <option value="single">One card (direct)</option>
        <option value="three">Three cards (majority)</option>
      </select>
    </div>
    <div class="eyn-field eyn-field-grow">
      <label class="eyn-field-lbl" for="eyn-question">Your yes/no question (optional)</label>
      <input id="eyn-question" type="text" placeholder="e.g. Should I take the new role?" maxlength="120">
    </div>
  </div>

  <div class="eyn-deck" id="eyn-deck"></div>

  <div class="eyn-ritual-bar">
    <div class="eyn-action-row">
      <button class="eyn-btn eyn-btn-ritual" id="eyn-shuffle-btn" type="button">Shuffle Again</button>
      <button class="eyn-btn eyn-btn-reset" id="eyn-reset-btn" type="button" style="display:none">Ask Again</button>
    </div>
    <p class="eyn-stage-hint" id="eyn-stage-hint">The 22 Major Arcana are laid out face-down, already shuffled. Select your focus, then swipe through the deck to pick your card.</p>
  </div>

  <div class="eyn-verdict" id="eyn-verdict" style="display:none"></div>

  <div class="eyn-result" id="eyn-result" style="display:none">
    <div id="eyn-revealed-cards"></div>
  </div>

  <p class="eyn-disclaim-top">${GENTLE}</p>
</div>
<style>
#eyn-wrap{font-size:16px;color:#1A1A2E}
.eyn-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.eyn-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.eyn-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.eyn-field{display:flex;flex-direction:column;gap:5px}
.eyn-field-grow{flex:1;min-width:240px}
.eyn-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#1B4332}
.eyn-input-row select,.eyn-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;min-width:200px;font-family:inherit}
.eyn-field-grow input{width:100%;min-width:0}

.eyn-ritual-bar{background:#fff;padding:14px 0 4px;margin:14px 0 0;border-top:1px solid #EEE}
.eyn-action-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:10px}
.eyn-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:46px;font-family:inherit}
.eyn-btn:hover:not(:disabled){background:#1B4332}
.eyn-btn:disabled{background:#BBB;cursor:not-allowed}
.eyn-btn-ritual{min-width:130px;transition:background .2s,border-color .2s,transform .2s}
/* v10: 选满态 Shuffle Again 按钮变 Reveal 高亮(金色脉冲) */
.eyn-btn-ritual.eyn-btn-reveal{background:#CFAA3E;color:#1A1A2E !important;border-color:#CFAA3E;font-weight:700;animation:eynPulse 1.6s ease-in-out infinite}
.eyn-btn-ritual.eyn-btn-reveal:hover{background:#B8902A;transform:translateY(-1px)}
.eyn-btn-reset{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.eyn-btn-reset:hover:not(:disabled){background:#F0F7F4}
@keyframes eynPulse{0%,100%{box-shadow:0 0 0 0 rgba(207,170,62,.5)}50%{box-shadow:0 0 0 8px rgba(207,170,62,0)}}
.eyn-stage-hint{color:#1B4332;font-size:15px;margin:0 auto;font-weight:500;padding:8px 16px;background:#F0F7F4;border-radius:8px;border-left:3px solid #2D6A4F;max-width:680px;text-align:center;transition:color .2s,background .2s,border-color .2s}
.eyn-stage-hint.eyn-hint-warn{color:#8B1A1A;background:#FFF0F0;border-color:#C83030;animation:eynHintShake .35s ease}
@keyframes eynHintShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.eyn-disclaim-top{color:#888;font-size:13px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

/* 大判定卡(醒目) */
.eyn-verdict{border:2px solid #2D6A4F;border-radius:16px;padding:28px 30px;margin:0 0 24px;text-align:center;animation:eynReveal .5s ease}
@keyframes eynReveal{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
.eyn-verdict-tag{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.eyn-verdict-big{font-size:64px;font-weight:800;line-height:1;margin:10px 0 14px}
.eyn-verdict-sum{font-size:16px;color:#444;line-height:1.65;max-width:640px;margin:0 auto}

/* v10 牌背布局: flex 横向单排 + 左右滚动(evatarot 式横向铺开), 22 张大牌(150px)横排 */
.eyn-deck{display:flex;gap:14px;overflow-x:auto;margin-bottom:18px;padding:10px 4px 18px;transition:opacity .4s;-webkit-overflow-scrolling:touch;scrollbar-color:#CFAA3E #F0F0E8}
.eyn-deck::-webkit-scrollbar{height:10px}
.eyn-deck::-webkit-scrollbar-track{background:#F0F0E8;border-radius:6px}
.eyn-deck::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px;border:1px solid #F0F0E8}
.eyn-deck::-webkit-scrollbar-thumb:hover{background:#B8902A}
.eyn-card-back{flex:0 0 150px;width:150px;height:225px;border-radius:12px;position:relative;background:linear-gradient(135deg,#1A1A2E 0%,#2D2D52 100%);border:2px solid #CFAA3E;box-shadow:0 4px 14px rgba(26,26,46,.22);transition:transform .25s,box-shadow .25s,border-color .25s;cursor:default;transform-origin:center bottom}
.eyn-card-back.eyn-enter{animation:eynEnter .45s ease backwards}
.eyn-back-inner{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.5);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#CFAA3E}

/* v10 水晶主题牌背(六棱柱水晶图形) */
.eyn-back-crystal{position:relative;width:62px;height:84px;margin-bottom:4px}
.eyn-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-bottom:21px solid rgba(127,209,168,.85)}
.eyn-crystal-face.eyn-crystal-m{position:absolute;top:18px;left:10px;width:42px;height:50px;background:linear-gradient(180deg,rgba(127,209,168,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.eyn-crystal-side.eyn-crystal-l{position:absolute;top:21px;left:0;width:14px;height:44px;background:rgba(45,106,79,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.eyn-crystal-side.eyn-crystal-r{position:absolute;top:21px;right:0;width:14px;height:44px;background:rgba(45,106,79,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.eyn-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-top:12px solid rgba(45,106,79,.85)}
.eyn-back-spark{position:absolute;font-size:18px;color:rgba(207,170,62,.85);opacity:.8}
.eyn-back-label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.2}
.eyn-deck:not(.eyn-deck-pickable) .eyn-card-back{opacity:.78}
.eyn-deck:not(.eyn-deck-pickable) .eyn-card-back:hover{transform:translateY(-8px);box-shadow:0 10px 22px rgba(26,26,46,.32);border-color:#7FD1A8;opacity:1}
.eyn-deck-pickable .eyn-card-back{cursor:pointer}
.eyn-deck-pickable .eyn-card-back:hover{transform:translateY(-10px);box-shadow:0 14px 28px rgba(26,26,46,.38);border-color:#7FD1A8}
.eyn-card-back.selected{border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.35),0 8px 18px rgba(26,26,46,.3);transform:translateY(-7px)}
.eyn-card-back.selected .eyn-back-inner{color:#7FD1A8}
.eyn-deck.eyn-deck-done{pointer-events:none}
.eyn-deck.eyn-deck-done .eyn-card-back:not(.flipped){opacity:.3}
.eyn-card-back.flipped{animation:eynFlipOver .55s ease}
.eyn-card-back.eyn-is-front{background:linear-gradient(135deg,#2D6A4F 0%,#1B4332 100%);opacity:1 !important;cursor:default}
.eyn-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.55);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;padding:8px;text-align:center}
.eyn-front-num{font-size:12px;color:#CFAA3E;font-weight:700}
.eyn-front-name{font-size:16px;font-weight:700;line-height:1.15}
.eyn-front-arch{font-size:12px;color:#CFAA3E;line-height:1.2}
.eyn-front-orient{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px}
.eyn-front-up{background:#7FD1A8;color:#1A1A2E}
.eyn-front-rev{background:#B59AC9;color:#1A1A2E}
.eyn-front-lean{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;background:#CFAA3E;color:#1A1A2E}
@keyframes eynFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.eyn-deck.eyn-shuffle-anim{animation:eynShuffle .55s ease}
@keyframes eynEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes eynShuffle{0%{transform:translateX(0)}20%{transform:translateX(-8px) rotate(-1deg)}40%{transform:translateX(8px) rotate(1deg)}60%{transform:translateX(-6px) rotate(-.5deg)}80%{transform:translateX(6px) rotate(.5deg)}100%{transform:translateX(0) rotate(0)}}

/* 单牌结果卡 */
.eyn-result{margin-top:8px}
.eyn-card{background:#fff;border:1px solid #EEE;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;animation:eynReveal .5s ease}
.eyn-card-pos{background:#F0F7F4;border-bottom:1px solid #EEE;padding:8px 22px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1B4332}
.eyn-card-head{background:#1A1A2E;padding:24px 26px;color:#fff}
.eyn-card-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.eyn-card-name{font-size:30px;font-weight:700;line-height:1.1}
.eyn-card-arch{font-size:16px;color:#CFAA3E;font-weight:600;margin-top:4px}
.eyn-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.eyn-card-lean{display:inline-block;font-size:14px;font-weight:600;padding:5px 14px;border-radius:14px;margin-top:12px;margin-left:8px;background:rgba(207,170,62,.25);color:#CFAA3E}
.eyn-upright{background:#2D6A4F;color:#fff}
.eyn-reversed{background:#6B4E8A;color:#fff}
.eyn-card-body{padding:22px 26px}
.eyn-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.eyn-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.eyn-meta-chip b{color:#1A1A2E}
.eyn-kw-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.eyn-kw{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:4px 11px;border-radius:14px;font-size:14px;font-weight:500}
.eyn-meaning-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.eyn-meaning{font-size:16px;color:#444;line-height:1.7;margin-bottom:18px}
.eyn-stones-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:10px}
.eyn-stones{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:6px}
.eyn-stone-card{background:#FAFAFA;border:1px solid #EEE;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.eyn-stone-img{width:64px;height:64px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#EEE}
.eyn-stone-body{flex:1;min-width:0}
.eyn-stone-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.eyn-stone-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:2px 0 5px}
.eyn-stone-reason{font-size:14px;color:#666;line-height:1.55}
.eyn-stone-shop{display:inline-block;margin-top:6px;font-size:14px;font-weight:600;color:#2D6A4F !important;text-decoration:none}
.eyn-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.eyn-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600}
.eyn-cta-primary{background:#2D6A4F;color:#fff !important}
.eyn-cta-primary:hover{background:#1B4332}
.eyn-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}

.eyn-seo-accordion{margin:32px 0 0}
.eyn-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.eyn-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.eyn-seo-details summary::-webkit-details-marker{display:none}
.eyn-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.eyn-seo-details[open] summary:after{content:'-'}
.eyn-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.eyn-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.eyn-seo-content h2:first-child{margin-top:0}
.eyn-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
@media(max-width:900px){.eyn-stones{grid-template-columns:1fr}}
/* v10 平板: 保持 flex 横向滚动(大牌 150px), 牌稍小 130px */
@media(max-width:780px){
  .eyn-card-back{flex:0 0 130px;width:130px;height:195px}
}
/* v10 移动: flex-wrap 换行 2-3 列(105px), 取消横向滚动 */
@media(max-width:640px){
  .eyn-h1{font-size:26px}.eyn-input-row select,.eyn-input-row input{min-width:150px;font-size:15px}.eyn-card-name{font-size:24px}.eyn-verdict-big{font-size:48px}
  .eyn-card-head{padding:20px 18px}.eyn-card-body{padding:18px}
  .eyn-deck{flex-wrap:wrap;justify-content:center;overflow-x:visible;gap:10px}
  .eyn-card-back{flex:0 0 105px;width:105px;height:158px}
  .eyn-back-crystal{width:38px;height:52px}
  .eyn-btn{padding:12px 22px;font-size:14px;height:44px}
  .eyn-btn-ritual{min-width:110px}
  .eyn-stage-hint{font-size:14px}
}
</style>
<!-- JSON data in standalone application/json block -->
<script type="application/json" id="eyn-data">${DATA_BLOCK}</script>
<!-- executable JS Base64-encoded to survive WP wp_kses entity-escaping. Loader decodes + evals at runtime. -->
<script type="text/plain" id="eyn-app">__EYN_APP_B64__</script>
<script>
(function(){var b=document.getElementById('eyn-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EYN init failed',e);}})();
</script>
<!-- ===== Yes/No Tarot Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How does a yes/no tarot reading work?","acceptedAnswer":{"@type":"Answer","text":"A yes/no tarot reading draws one to three Major Arcana cards and reads each card's upright or reversed meaning as a lean toward Yes, No, or Maybe. Upright cards tend to lean toward an open 'yes' energy; reversed cards tend to lean toward a 'no' or a held-back 'not yet'. A single card gives a direct lean; three cards use a majority vote, with a tie landing on Maybe."}},
{"@type":"Question","name":"Is yes/no tarot accurate?","acceptedAnswer":{"@type":"Answer","text":"Tarot is a symbolic system for self-reflection, not a literal oracle. A yes/no reading is best read as a mirror for the energy around your question — what is moving freely, what is blocked, what needs examining — rather than a guaranteed outcome. A 'Maybe' is often the most honest signal: the answer depends on something you have not fully looked at yet."}},
{"@type":"Question","name":"What does a Maybe answer mean in tarot?","acceptedAnswer":{"@type":"Answer","text":"A Maybe means the cards are mixed and the answer hinges on a factor the cards are flagging for you to examine. Rather than forcing a yes or no, the clearest next step is to look closely at that factor — what is unclear, what is unresolved, what is still in motion."}},
{"@type":"Question","name":"Should I use one card or three for a yes/no question?","acceptedAnswer":{"@type":"Answer","text":"One card gives a fast, direct lean and works well for small questions. Three cards use a majority vote — two cards leaning one way overrides a single dissenting card — which adds nuance at the cost of speed. If a three-card answer still feels unclear, reframe the question and draw again."}},
{"@type":"Question","name":"What crystals help with a yes/no reading?","acceptedAnswer":{"@type":"Answer","text":"Each card in your draw comes with crystals chosen for its archetype and orientation: a reversed card leans toward stones of steadying and discernment, while an upright card leans toward stones that support its open expression. Clear quartz is a traditional companion for yes/no readings because it helps keep the question clear in your mind."}}
]}
]}
</script>
<!-- ===== End Yes/No Tarot v10 ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Yes/No Tarot SEO Accordion ===== -->
<section class="eyn-seo-accordion" aria-label="Yes/No tarot guide">
  <details class="eyn-seo-details">
    <summary>Learn More About Yes/No Tarot</summary>
    <div class="eyn-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Yes/No Tarot SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'yes-no-tarot.html');
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function(ch){ return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__EYN_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function(full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Yes/No Tarot v10 generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'cards |', APP_B64.length, 'b64 chars');
