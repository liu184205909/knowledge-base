/**
 * Yes / No Tarot v10.6 — 对齐皇冠 crystal-tarot-draw v10.6(每行11张自适应/矮牌/删圈圈/金色外扩结果卡)
 * v10.6 改进(对比 v10):
 *   1) 卡牌布局: 22 张大牌固定 150px 横排单滚动 → 每行 11 张自适应(flex:1 1 0 + min96/max134)两行全可见无水平滚动
 *   2) 卡牌矮化: 225px → 178px(桌面)/156px(平板)/140px(移动); 牌背水晶图形 48×60 适配矮牌
 *   3) 删牌背圈圈: .eyn-back-inner 去 border + 圆角(原金色圈装饰) → 无边框纯定位容器(对齐皇冠 v10.4)
 *   4) 翻牌结果卡金色外扩: 边框灰 #EEE → 金 #CFAA3E + box-shadow 0 0 0 5px rgba(207,170,62,.18) 往外扩;
 *      牌头底边加 3px 金线 + body padding 26→32px 文字区呼吸更宽; 翻牌态 deck 金色外扩(flipped.selected)
 *   5) 牌头位置条金调: .eyn-card-pos 绿调 → 金调背景(#FBF3E5 + 金线 + #7A5A12 字)协调金色外扩主题
 * 保留 v10 全部: LEAN_MAP 判定 + 大判定卡(Yes 绿/No 红/Maybe 金) + focus 必选 + 选满 0.5s 自动翻 + Reveal 高亮
 *   + 默认洗牌 + 牌义 + 水晶 + Shop CTA + base64 + asciiJSON + 字体 min14 + CSS 前缀 eyn-
 * 数据: _shared/tarot-knowledge.json(22 大牌) + crystal-meaning-search/data/search-data.json(水晶 img/shop)
 * 约束: base64 包装可执行 JS / safeJSON + asciiJSON / 字体 min14 / 翻牌 scrollIntoView block:nearest /
 *       self-reflection 合规 / CSS 前缀 eyn-
 * URL /tools/yes-no-tarot/ (page 48070). 输出 ./yes-no-tarot.html
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
    // v10.8: 22 张大牌一排（不分两行），单 .eyn-deck-row 横向 margin-left:-78px 堆叠 + overflow scroll
    var perRow=deck.length;
    var h='';
    for(var r=0;r<Math.ceil(deck.length/perRow);r++){
      h+='<div class="eyn-deck-row">';
      for(var i=r*perRow;i<Math.min((r+1)*perRow,deck.length);i++){
        h+='<div class="eyn-card-back eyn-enter" data-pos="'+i+'" style="--i:'+i+'">'
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
      h+='</div>';
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
        (function(el,card,rev,i){
          el.classList.add('flipped','eyn-reveal-card','eyn-reveal-pos-'+i);
          setTimeout(function(){ el.classList.add('eyn-is-front'); el.innerHTML=cardFrontHtml(card,rev); }, 280);
        })(backEl, CARDS[d2.cardIdx], d2.reversed, k);
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

/* v10.7 牌背布局(完全对齐皇冠选牌态): deck 块容器 + 两行 .eyn-deck-row(flex nowrap + gap:0 + overflow-x + scroll-snap + cursor:grab),
   卡牌固定宽 126px + margin-left:-78px → 牌背横向重叠堆叠(扇形连排, 和皇冠一样), 可拖滚 + snap 吸附 */
.eyn-deck{display:block;margin:4px 0 18px;padding:22px 18px 16px;transition:opacity .4s;overflow:visible;background:linear-gradient(135deg,#FAFAFA 0%,#F8F5EC 100%);border:1px solid #EFE6D2;border-radius:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.75)}
.eyn-deck-row{display:flex;flex-wrap:nowrap;gap:0;margin-bottom:8px;overflow-x:auto;overflow-y:hidden;padding:14px 0 18px;scroll-snap-type:x proximity;cursor:grab;user-select:none;-webkit-user-select:none;min-height:208px;align-items:center}
.eyn-deck-row.eyn-dragging{cursor:grabbing;scroll-snap-type:none}
.eyn-deck-row:last-of-type{margin-bottom:0}
.eyn-deck-row::-webkit-scrollbar{height:8px}
.eyn-deck-row::-webkit-scrollbar-track{background:transparent}
.eyn-deck-row::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px}
.eyn-deck-row{scrollbar-color:#CFAA3E transparent}
/* v10.7 卡牌矮(178px 对齐皇冠) + 固定宽 126px + margin-left:-78px 牌背重叠堆叠(扇形连排) + 深色 radial 渐变牌背 + 金边 + 删圈圈(back-inner 无 border) */
.eyn-card-back{flex:0 0 126px;width:126px;min-width:126px;max-width:126px;height:178px;margin-left:-78px;scroll-snap-align:center;border-radius:14px;position:relative;background:radial-gradient(circle at 50% 24%,rgba(207,170,62,.18) 0 12%,transparent 34%),radial-gradient(circle at 80% 86%,rgba(127,209,168,.13),transparent 35%),linear-gradient(155deg,#0F1515 0%,#18201F 48%,#101326 100%);border:1px solid rgba(207,170,62,.9);box-shadow:0 9px 18px rgba(26,26,46,.2),inset 0 0 0 1px rgba(255,255,255,.08),inset 0 0 26px rgba(207,170,62,.08);transition:transform .25s,box-shadow .25s,border-color .25s,filter .25s;cursor:pointer;transform-origin:center bottom;z-index:var(--i,1)}
.eyn-card-back:first-child{margin-left:0}
.eyn-card-back.eyn-enter{animation:eynEnter .45s ease backwards}
.eyn-card-back:before{content:'';position:absolute;inset:7px;border:1px solid rgba(207,170,62,.28);border-radius:11px;pointer-events:none}
.eyn-card-back:after{content:'';position:absolute;left:18px;right:18px;top:18px;height:1px;background:linear-gradient(90deg,transparent,rgba(207,170,62,.72),transparent);box-shadow:0 122px 0 rgba(207,170,62,.34);pointer-events:none}
/* v10.6 删中间圈圈(对齐皇冠 v10.4): .eyn-back-inner 去 border + 圆角 → 无边框纯定位容器 */
.eyn-back-inner{position:absolute;inset:10px;border:none;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#E4C878;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,0))}
.eyn-back-inner:before,.eyn-back-inner:after{content:'';position:absolute;left:50%;transform:translateX(-50%);width:42px;height:1px;background:linear-gradient(90deg,transparent,rgba(207,170,62,.62),transparent)}
.eyn-back-inner:before{top:14px}.eyn-back-inner:after{bottom:14px}

/* v10.6 水晶主题牌背(对齐皇冠矮牌): 六棱柱水晶图形 48×60 + 火花 + 标签清晰 */
.eyn-back-crystal{position:relative;width:48px;height:60px;margin-bottom:4px}
.eyn-back-crystal:before{content:'';position:absolute;left:50%;top:50%;width:58px;height:58px;transform:translate(-50%,-50%);border:1px solid rgba(207,170,62,.32);border-radius:50%;background:radial-gradient(circle,rgba(127,209,168,.1),transparent 68%)}
.eyn-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-bottom:15px solid rgba(127,209,168,.85)}
.eyn-crystal-face.eyn-crystal-m{position:absolute;top:13px;left:8px;width:32px;height:36px;background:linear-gradient(180deg,rgba(127,209,168,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.eyn-crystal-side.eyn-crystal-l{position:absolute;top:15px;left:0;width:11px;height:31px;background:rgba(45,106,79,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.eyn-crystal-side.eyn-crystal-r{position:absolute;top:15px;right:0;width:11px;height:31px;background:rgba(45,106,79,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.eyn-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:9px solid rgba(45,106,79,.85)}
.eyn-back-spark{position:absolute;left:50%;bottom:17px;transform:translateX(-50%);font-size:12px;color:rgba(228,200,120,.82);opacity:.9}
.eyn-back-label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.25;color:#E4C878;text-shadow:0 1px 0 rgba(0,0,0,.22)}
.eyn-deck:not(.eyn-deck-pickable) .eyn-card-back{opacity:.78}
.eyn-deck:not(.eyn-deck-pickable) .eyn-card-back:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(26,26,46,.28);border-color:#7FD1A8;opacity:1}
.eyn-deck-pickable .eyn-card-back{cursor:pointer}
.eyn-deck-pickable .eyn-card-back:hover{transform:translateY(-8px);box-shadow:0 16px 30px rgba(26,26,46,.34);border-color:#7FD1A8;filter:saturate(1.08)}
.eyn-card-back.selected{border-color:#7FD1A8;box-shadow:0 0 0 3px rgba(127,209,168,.42),0 18px 32px rgba(26,26,46,.32);transform:translateY(-12px)}
.eyn-card-back.selected .eyn-back-inner{color:#7FD1A8}
.eyn-deck.eyn-deck-done{pointer-events:none;background:linear-gradient(135deg,#FFFDF8 0%,#F8F3E7 100%)}
.eyn-deck.eyn-deck-done .eyn-deck-row{justify-content:center;align-items:center;gap:14px;overflow-x:visible;overflow-y:visible;min-height:238px;padding:28px 0 30px;cursor:default}
.eyn-deck.eyn-deck-done .eyn-card-back:not(.flipped){display:none}
.eyn-deck.eyn-deck-done .eyn-card-back.flipped{display:block;flex:0 0 132px;width:132px;min-width:132px;max-width:132px;height:186px;margin-left:0;opacity:1;filter:none}
.eyn-deck.eyn-deck-done .eyn-reveal-card{transform:translateY(0) rotate(0);transition:transform .35s ease,box-shadow .35s ease}
.eyn-deck.eyn-deck-done .eyn-reveal-pos-0{transform:translateY(10px) rotate(-7deg)}
.eyn-deck.eyn-deck-done .eyn-reveal-pos-1{transform:translateY(-8px) rotate(0)}
.eyn-deck.eyn-deck-done .eyn-reveal-pos-2{transform:translateY(10px) rotate(7deg)}
.eyn-card-back.flipped{animation:eynFlipOver .55s ease}
/* v10.6 翻牌态金色外扩(对齐皇冠 v10.6): 翻开瞬间覆盖 selected 绿光晕 → 金色 border + 金色外扩光晕 */
.eyn-card-back.flipped.selected{border-color:#CFAA3E;box-shadow:0 0 0 4px rgba(207,170,62,.32),0 18px 32px rgba(26,26,46,.3);z-index:90}
.eyn-card-back.eyn-is-front{background:radial-gradient(circle at 50% 14%,rgba(207,170,62,.18),transparent 38%),linear-gradient(180deg,#FFFDF8 0%,#F7F0DF 100%);opacity:1 !important;cursor:default;border-color:#CFAA3E;box-shadow:0 0 0 4px rgba(207,170,62,.28),0 18px 32px rgba(26,26,46,.24);z-index:90}
.eyn-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.72);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:#1A1A2E;padding:8px;text-align:center;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,250,238,.42))}
.eyn-front-num{position:relative;font-size:10px;color:#8A6517;font-weight:700;line-height:1.1;text-transform:uppercase;letter-spacing:.02em}
.eyn-front-name{position:relative;font-size:15px;font-weight:700;line-height:1.08;color:#1A1A2E}
.eyn-front-arch{position:relative;font-size:10.5px;color:#7A5A12;line-height:1.15}
.eyn-front-orient{font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-top:2px}
.eyn-front-up{background:#7FD1A8;color:#1A1A2E}
.eyn-front-rev{background:#B59AC9;color:#1A1A2E}
.eyn-front-lean{font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-top:2px;background:#CFAA3E;color:#1A1A2E}
@keyframes eynFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.eyn-deck.eyn-shuffle-anim{animation:eynShuffle .55s ease}
@keyframes eynEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes eynShuffle{0%{transform:translateX(0)}20%{transform:translateX(-8px) rotate(-1deg)}40%{transform:translateX(8px) rotate(1deg)}60%{transform:translateX(-6px) rotate(-.5deg)}80%{transform:translateX(6px) rotate(.5deg)}100%{transform:translateX(0) rotate(0)}}

/* v10.6 结果卡金色外扩(对齐皇冠 v10.6): 边框灰→金 #CFAA3E + 金色外扩光晕 + 牌头 3px 金线 + body 32px 文字区呼吸更宽 */
.eyn-result{margin-top:8px;scroll-margin-top:120px}
.eyn-card{background:#fff;border:1px solid #CFAA3E;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;box-shadow:0 0 0 5px rgba(207,170,62,.18),0 12px 28px rgba(26,26,46,.1);animation:eynReveal .5s ease}
.eyn-card-pos{background:#FBF3E5;border-bottom:1px solid #E8C887;padding:9px 28px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7A5A12}
.eyn-card-head{position:relative;background:radial-gradient(circle at 82% 18%,rgba(207,170,62,.2),transparent 32%),linear-gradient(135deg,#111525 0%,#1A1A2E 58%,#26324B 100%);padding:24px 32px;color:#fff;border-bottom:3px solid #CFAA3E;overflow:hidden}
.eyn-card-head:after{content:'';position:absolute;right:24px;top:18px;width:92px;height:92px;border:1px solid rgba(207,170,62,.28);border-radius:50%;box-shadow:inset 0 0 0 22px rgba(255,255,255,.02);pointer-events:none}
.eyn-card-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.eyn-card-name{font-size:30px;font-weight:700;line-height:1.1}
.eyn-card-arch{font-size:16px;color:#CFAA3E;font-weight:600;margin-top:4px}
.eyn-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.eyn-card-lean{display:inline-block;font-size:14px;font-weight:600;padding:5px 14px;border-radius:14px;margin-top:12px;margin-left:8px;background:rgba(207,170,62,.25);color:#CFAA3E}
.eyn-upright{background:#2D6A4F;color:#fff}
.eyn-reversed{background:#6B4E8A;color:#fff}
.eyn-card-body{padding:24px 32px;background:linear-gradient(180deg,#FFFFFF 0%,#FFFDF8 100%)}
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
/* v10.6 平板(对齐皇冠 v10.4): deck-row 保持 flex 横向滚动兜底, 卡牌矮(156px);牌宽固定 112px */
@media(max-width:780px){
  .eyn-input-row{gap:10px;margin-bottom:12px}
  .eyn-field{width:100%}
  .eyn-field-grow{min-width:0}
  .eyn-input-row select,.eyn-input-row input{width:100%;min-width:0}
  .eyn-deck{padding:18px 14px 14px}
  .eyn-deck-row{display:flex;flex-wrap:nowrap;gap:0;overflow-x:auto;overflow-y:hidden;padding:12px 0 16px;min-height:184px}
  .eyn-card-back{flex:0 0 112px;width:112px;min-width:112px;max-width:112px;height:156px;margin-left:-44px}
  .eyn-card-back:first-child{margin-left:0}
  .eyn-deck.eyn-deck-done .eyn-deck-row{gap:10px;min-height:214px;padding:24px 0 26px;flex-wrap:wrap}
  .eyn-deck.eyn-deck-done .eyn-card-back.flipped{flex:0 0 118px;width:118px;min-width:118px;max-width:118px;height:164px}
  .eyn-front-name{font-size:15px}
  .eyn-front-num,.eyn-front-arch{font-size:11px}
  .eyn-result{scroll-margin-top:96px}
}
/* v10.6 移动(对齐皇冠 v10.4): deck-row flex 兜底, 卡牌矮(140px);牌宽固定 100px */
@media(max-width:640px){
  .eyn-h1{font-size:26px}.eyn-input-row select,.eyn-input-row input{min-width:0;font-size:15px}.eyn-card-name{font-size:24px}.eyn-verdict-big{font-size:48px}
  .eyn-card-head{padding:16px 14px}.eyn-card-body{padding:16px 14px}
  .eyn-card-pos{padding:8px 14px;font-size:12px}
  .eyn-deck{padding:16px 12px 12px;border-radius:12px}
  .eyn-deck-row{display:flex;gap:0;overflow-x:auto;overflow-y:hidden;padding:10px 0 14px;min-height:166px}
  .eyn-card-back{flex:0 0 100px;width:100px;min-width:100px;max-width:100px;height:140px;margin-left:-38px}
  .eyn-card-back:first-child{margin-left:0}
  .eyn-deck.eyn-deck-done .eyn-deck-row{gap:8px;min-height:190px;padding:22px 0 24px;flex-wrap:wrap}
  .eyn-deck.eyn-deck-done .eyn-card-back.flipped{flex:0 0 104px;width:104px;min-width:104px;max-width:104px;height:146px}
  .eyn-deck.eyn-deck-done .eyn-reveal-pos-0{transform:translateY(6px) rotate(-5deg)}
  .eyn-deck.eyn-deck-done .eyn-reveal-pos-1{transform:translateY(-5px) rotate(0)}
  .eyn-deck.eyn-deck-done .eyn-reveal-pos-2{transform:translateY(6px) rotate(5deg)}
  .eyn-back-crystal{width:34px;height:44px}
  .eyn-back-label{font-size:10px;letter-spacing:.1em}
  .eyn-front-face{inset:6px;gap:4px;padding:6px}
  .eyn-front-name{font-size:13px}
  .eyn-front-num,.eyn-front-arch{font-size:10px}
  .eyn-front-orient,.eyn-front-lean{font-size:10px;padding:3px 7px}
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
