/**
 * Crystal Tarot Reading v10.1 — v10 + 爱情场景预设(focus=love → 显示场景子选择, 吸收爱情塔罗4场景)
 * v10.1 改进(对比v10):
 *   1) focus 选 love → 显示"Your love focus"场景子选择(thinking/truelove/status/reconcile 4场景, 吸收爱情塔罗)
 *      其他 focus(general/career/healing/guidance)不显示场景子选择(CSS display:none, focus 切换时显隐)
 *   2) 场景影响解读: 场景引导块("Your focus: [场景]"+ 场景guide文案) + 位置标签场景化(three模式用场景three_pos)
 *      + meaning-lbl 场景化("Meaning in your [场景短名] reading") + practice 反思问题场景化(场景guide合规非命运确定论)
 *      + love 水晶优先 best_love(爱情石)
 *   3) focus 必选保留: focus 是必选第一步(value="" 占位), 场景是 love 下的子选(love 已满足 focusReady, 场景默认选第一个)
 * 保留 v10 全部: flex 左右滚动(大牌140px+) + 金色滚动条 + focus必选 + 选满0.5s自动翻牌 + hover浮起 + 按钮栏下方
 *   + 默认洗牌(init buildDeck) + 水晶六棱牌背 + 三模式(single/three/free) + free-count + 英文 + self-reflection合规 + base64
 *
 * Crystal Tarot Reading v10 — 3 个 UX 改进: 卡牌左右滚动(大牌横排) + 选满0.5s自动翻牌(去Validate强制) + focus必选(明确第一步)
 * v10 改进(对比v9):
 *   1) 卡牌左右滚动: deck grid minmax(86px,1fr) → flex 横向 + overflow-x:auto(22张牌横排单排, 水平滑动浏览选牌, evatarot式横向铺开)
 *      牌宽固定 flex:0 0 150px(大牌, 150px 宽, 牌背水晶图案放大 + "Crystal Tarot"文字大清晰, 内容承接多)
 *      金色细滚动条美化(::-webkit-scrollbar 金色渐变); 移动端(640px以下)flex-wrap 换行 2-3 列(105px, 取消横向滚动)
 *   2) 选满自动翻牌(去 Validate 强制): 选满 → 0.5s 后自动 revealAll(选中高亮反馈0.5s→翻牌动画)
 *      Shuffle Again 按钮选满时变 "Reveal" 高亮(视觉提示选满即将翻, 但不强制点; 用户想立即翻可点 Reveal 提前触发)
 *      允许选满前继续调整(点选切换/取消), 选满才触发自动翻; 保留 Validate 按钮但非必须(合并进 Shuffle Again 变 Reveal)
 *   3) focus 必选: focus select 加 placeholder(第一个 option value="" disabled selected "Select your focus", 非默认选中)
 *      未选 focus 时点牌无效 + stage-hint 红色提示 "Select your focus first"
 *      选了 focus 才能选牌(pickCard 先检查 focus 已选); focus 成为明确第一步
 *      stage-hint initial: "Select your focus, then pick N cards"
 * 保留 v9: base64包装JS + hover浮起 + 按钮栏下方居中 + 默认洗牌(init buildDeck) + 点牌有效(initial可选, state==='revealed'拦截)
 *   + Shuffle Again 可选 + 水晶六棱牌背 + 三模式(single/three/free) + free-count + 翻牌scrollIntoView({block:'nearest'})不跳走
 *   + 字体min14 + 英文 + self-reflection合规 + safeJSON只转义</
 * 数据: tarot-knowledge.json + crystal-meaning-search/data/search-data.json
 * CSS 前缀 ect-. URL 根级 /tarot-{card}-crystals/. Shop 三级降级. 输出: ./crystal-tarot-reading.html
 */
const fs = require('fs');
const path = require('path');

const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));
const CFG = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../04-内容生产/13.tarot/configs/tarot-config.json'), 'utf8'));
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
  element: c.element, astrology: c.astrology, theme: c.theme,
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

// v10.1 爱情场景预设(吸收爱情塔罗4场景, focus=love 子选择) — 位置标签/解读prompt/场景文案/practice场景化
const SCENARIOS = [
  {
    id: 'thinking',
    label: 'What Is He/She Thinking?',
    short: 'what-they-think',
    single_pos: 'Their inner world right now',
    three_pos: ['What shaped their view', 'Where they are now', 'Where this is tending'],
    guide_single: 'This card reflects the archetype moving through their inner world — the energy coloring their thoughts, not a literal transcript of their mind. Read it as a mirror of the climate between you, and let it surface a question rather than a verdict.',
    guide_three: 'Read the three cards as a small story of the dynamic: what shaped how they see the connection, where they actually are now, and the direction the pattern is leaning — if nothing changes. It describes tendencies to reflect on, not fixed outcomes.',
    practice: 'What is the climate between us right now, and what would an honest conversation ask of me first?'
  },
  {
    id: 'truelove',
    label: 'True Love / Soulmate',
    short: 'true-love',
    single_pos: 'The energy around love right now',
    three_pos: ['What you carry into love', 'Where love is asking for attention', 'What love is leaning toward'],
    guide_single: 'This card speaks to the archetype active in your love life — the quality love is asking of you right now. It is not a forecast of a specific person arriving; it is a mirror of what is already moving, and what to tend.',
    guide_three: 'The three cards trace your relationship with love itself: what you bring from the past, what is asking for care now, and the direction the present pattern tends toward. Soulmate readings work best when they reveal what you are ready for — not who is coming.',
    practice: 'What am I genuinely ready for in love right now, and what in me still needs tending before I welcome it?'
  },
  {
    id: 'status',
    label: 'Relationship Status',
    short: 'relationship-status',
    single_pos: 'The heart of the relationship now',
    three_pos: ['What brought you together', 'Where the relationship stands', 'Where it is tending'],
    guide_single: 'This card names the archetype at the center of the relationship right now — its prevailing energy. Read it as a snapshot of the dynamic, surfacing what needs attention rather than pronouncing the relationship good or doomed.',
    guide_three: 'The three cards tell the story of the bond: what originally connected you, where the relationship actually stands today, and the direction things lean if the present continues. Use it to see the shape of the relationship more clearly, then choose how to tend it.',
    practice: 'What does the current dynamic most need from me, and what am I choosing to keep tending versus release?'
  },
  {
    id: 'reconcile',
    label: 'Getting Back Together?',
    short: 'reconciliation',
    single_pos: 'The energy around reconnecting',
    three_pos: ['What remains between you', 'What needs to change', 'Where this is tending'],
    guide_single: 'This card reflects the archetype moving through the question of reconciliation — the energy around reconnecting. It is not a yes/no on whether they will return; it is a mirror of what the reconnection would actually ask of you, and what needs honesty first.',
    guide_three: 'The three cards map the reconciliation question: what still lives between you, what would genuinely need to shift, and the direction the current pattern leans. Reconciliation readings cannot promise an outcome — they can only clarify what is real and what work it would take.',
    practice: 'What would this reconnection genuinely ask of me, and what needs honesty before I can decide?'
  }
];

const GENTLE = CFG.gentle_note;
const HALVES = CFG.faq_shared_halves;

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function(ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({ cards: CARDS, gentle: GENTLE, scenarios: SCENARIOS });

// v10 APP_JS: flex左右滚动(大牌) + focus必选 + 选满0.5s自动翻牌(去Validate强制) + 翻牌深度内容
const APP_JS = `(function(){
  var rawData = document.getElementById('ect-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('ECTaro data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  var SCENARIOS = parsed.scenarios || [];
  var SCN_MAP = {}; SCENARIOS.forEach(function(s){ SCN_MAP[s.id]=s; });
  var POSITIONS=['Past','Present','Future'];
  var FOCUS_LBL={general:'General Guidance',love:'Love & Relationships',career:'Career & Direction',healing:'Healing & Release',guidance:'Inner Guidance'};
  var state='initial'; // v10: initial(可选牌, 需先选focus) -> revealed (默认洗好)
  var deck=[];        // 22 个 {cardIdx, reversed} 按位置
  var picked=[];      // 已选位置
  var autoRevealTimer=null; // v10: 选满0.5s自动翻牌定时器

  function needed(){
    var s=document.getElementById('ect-spread');
    if(!s) return 1;
    if(s.value==='three') return 3;
    if(s.value==='free'){
      var fc=document.getElementById('ect-free-count');
      var n=fc?parseInt(fc.value,10):3;
      if(isNaN(n)) n=3;
      if(n<1) n=1;
      if(n>10) n=10;
      return n;
    }
    return 1;
  }

  // v10: focus 必选检查 — 未选 focus(value==="") 返回 false
  function focusReady(){
    var f=document.getElementById('ect-focus');
    if(!f) return true; // 无 focus 控件时不拦截(降级)
    var v=f.value;
    return v && v!=='';
  }

  // v10.1: 当前选中的爱情场景(focus=love 子选) — 默认第一个场景
  function scn(){
    var s=document.getElementById('ect-scenario');
    if(!s) return SCENARIOS[0]||null;
    return SCN_MAP[s.value]||SCENARIOS[0]||null;
  }
  // v10.1: focus=love 时显示场景子选择, 其他 focus 隐藏
  function onFocusChange(){
    var f=document.getElementById('ect-focus');
    var scnField=document.getElementById('ect-scenario-field');
    var isLove = f && f.value==='love';
    if(scnField) scnField.style.display = isLove ? 'flex' : 'none';
    if(state==='initial') updatePickUI();
  }

  function buildDeck(){
    var idxs=[]; for(var i=0;i<CARDS.length;i++) idxs.push(i);
    for(var i=idxs.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t; }
    deck = idxs.map(function(ci){ return {cardIdx:ci, reversed:Math.random()<0.4}; });
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderDeck(){
    var el=document.getElementById('ect-deck');
    if(!el) return;
    var h='';
    for(var i=0;i<deck.length;i++){
      h+='<div class="ect-card-back ect-enter" data-pos="'+i+'">'
        +'<div class="ect-back-inner">'
        +'<div class="ect-back-crystal">'
        +'<div class="ect-crystal-top"></div>'
        +'<div class="ect-crystal-side ect-crystal-l"></div>'
        +'<div class="ect-crystal-face ect-crystal-m"></div>'
        +'<div class="ect-crystal-side ect-crystal-r"></div>'
        +'<div class="ect-crystal-base"></div>'
        +'</div>'
        +'<div class="ect-back-label">Crystal Tarot</div>'
        +'<div class="ect-back-spark">\\u2737</div>'
        +'</div></div>';
    }
    el.innerHTML=h;
    var backs=el.querySelectorAll('.ect-card-back');
    for(var k=0;k<backs.length;k++){
      (function(b){ b.addEventListener('click', function(){ pickCard(parseInt(b.getAttribute('data-pos'),10)); }); })(backs[k]);
    }
  }

  function setStage(s){
    state=s;
    var deckEl=document.getElementById('ect-deck');
    var shuffleBtn=document.getElementById('ect-shuffle-btn');
    var hint=document.getElementById('ect-stage-hint');
    var n=needed();
    // v10: initial 态即可选牌(默认洗好, 需先选focus), revealed 态禁用
    if(deckEl){
      if(s==='revealed'){ deckEl.classList.remove('ect-deck-pickable'); }
      else { deckEl.classList.add('ect-deck-pickable'); }
    }
    // Shuffle Again 按钮在 revealed 后恢复默认态(非 Reveal 高亮, 文字改回 Shuffle Again)
    if(shuffleBtn && s==='revealed'){ shuffleBtn.classList.remove('ect-btn-reveal'); shuffleBtn.textContent='Shuffle Again'; }
    if(hint){
      if(s==='initial'){
        // v10: focus 未选时提示先选 focus
        if(!focusReady()) hint.textContent='Select your focus, then pick '+(n===1?'1 card':n+' cards')+' from the spread below.';
        else hint.textContent='Pick '+(n===1?'1 card':n+' cards')+' from the spread below. Tap a card back to choose, tap again to undo.';
      }
      else if(s==='revealed') hint.textContent='Your '+(n===1?'card':'reading')+' is revealed. Scroll down for the full interpretation.';
    }
  }

  // v10: Shuffle Again = 重新洗牌(可选, 不强制) — 想换牌序再点; 点了重新 buildDeck + 洗牌动画, 停留 initial 态继续选
  function shuffleDeck(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    buildDeck();
    renderDeck();
    picked=[];
    var deckEl=document.getElementById('ect-deck');
    if(deckEl){
      deckEl.classList.remove('ect-deck-done');
      deckEl.classList.add('ect-shuffle-anim');
      setTimeout(function(){ deckEl.classList.remove('ect-shuffle-anim'); }, 600);
    }
    var holder=document.getElementById('ect-revealed-cards');
    if(holder) holder.innerHTML='';
    var res=document.getElementById('ect-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('ect-reset-btn');
    if(resetBtn) resetBtn.style.display='none';
    var shuffleBtn=document.getElementById('ect-shuffle-btn');
    if(shuffleBtn) shuffleBtn.classList.remove('ect-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function pickCard(pos){
    if(state==='revealed') return; // v10: initial 态即可选(需先选focus)
    // v10: focus 必选 — 未选 focus 时点牌无效 + 红色提示
    if(!focusReady()){
      var hint=document.getElementById('ect-stage-hint');
      if(hint){
        hint.textContent='Select your focus first, then pick your card' + (needed()>1?'s':'') + '.';
        hint.classList.add('ect-hint-warn');
        setTimeout(function(){ hint.classList.remove('ect-hint-warn'); }, 1800);
      }
      return;
    }
    // 切换选中(再点取消), evatarot式可反悔
    var idx=picked.indexOf(pos);
    if(idx>-1){
      picked.splice(idx,1);
      var backOff=document.querySelector('#ect-deck .ect-card-back[data-pos="'+pos+'"]');
      if(backOff) backOff.classList.remove('selected');
      // v10: 取消选中 → 清除自动翻牌定时器 + 恢复 Shuffle Again 按钮
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      var sb1=document.getElementById('ect-shuffle-btn');
      if(sb1) sb1.classList.remove('ect-btn-reveal');
    } else {
      var n=needed();
      if(picked.length>=n) return; // 选满不可再加
      picked.push(pos);
      var backOn=document.querySelector('#ect-deck .ect-card-back[data-pos="'+pos+'"]');
      if(backOn) backOn.classList.add('selected');
    }
    updatePickUI();
  }

  // v10: 选满后 Shuffle Again 按钮变 "Reveal" 高亮 + 0.5s 自动翻牌(选中高亮反馈0.5s→翻牌动画)
  // 不强制点 Reveal(0.5s自动翻); 用户想立即翻可点 Reveal 提前触发; 选满前可继续调整(点选切换/取消)
  function updatePickUI(){
    if(state==='revealed') return; // revealed 态不更新提示
    var n=needed();
    var hint=document.getElementById('ect-stage-hint');
    var shuffleBtn=document.getElementById('ect-shuffle-btn');
    if(picked.length<n){
      // 未选满: Shuffle Again 恢复默认态 + 清自动翻牌定时器
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      if(shuffleBtn){ shuffleBtn.classList.remove('ect-btn-reveal'); shuffleBtn.textContent='Shuffle Again'; }
      if(hint){
        if(!focusReady()){
          hint.textContent='Select your focus, then pick '+(n===1?'1 card':n+' cards')+' from the spread below.';
        } else {
          var left=n-picked.length;
          if(left===n) hint.textContent='Pick '+n+' card'+(n>1?'s':'')+' from the spread below. Tap a card back to choose, tap again to undo.';
          else hint.textContent='Pick '+left+' more card'+(left>1?'s':'')+' ('+picked.length+'/'+n+' chosen). Tap again to undo.';
        }
      }
    } else {
      // 选满: Shuffle Again → Reveal 高亮(文字变 Reveal) + 启动 0.5s 自动翻牌
      if(shuffleBtn){ shuffleBtn.classList.add('ect-btn-reveal'); shuffleBtn.textContent='Reveal →'; }
      if(hint) hint.textContent='You have chosen '+n+' card'+(n>1?'s':'')+'. Revealing…';
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); }
      autoRevealTimer=setTimeout(function(){
        autoRevealTimer=null;
        if(state==='initial' && picked.length>=n){ revealAll(); }
      }, 500);
    }
  }

  // v10: Shuffle Again 按钮双功能 — 未选满=重新洗牌; 选满=Reveal 提前翻牌(避开0.5s等待)
  function onShuffleClick(){
    if(state==='initial' && picked.length>=needed()){
      // 选满态: 提前触发翻牌
      if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
      revealAll();
    } else {
      shuffleDeck();
    }
  }

  function onValidate(){
    if(state==='revealed') return; // 兼容: Validate 按钮若保留仍可翻(非强制)
    var n=needed();
    if(picked.length<n) return;
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    revealAll();
  }

  // spread 切换: 显隐 free-count; 若已选超过新上限则裁剪; 重新计算选牌提示
  function onSpreadChange(){
    var s=document.getElementById('ect-spread');
    var val=s?s.value:'single';
    var ff=document.getElementById('ect-free-field');
    if(ff) ff.style.display = (val==='free')?'flex':'none';
    // v9: 若在 initial 阶段(选牌中), 按新 needed 收敛已选(超出上限的弹出)
    if(state==='initial'){
      var n=needed();
      while(picked.length>n){
        var off=picked.pop();
        var backOff=document.querySelector('#ect-deck .ect-card-back[data-pos="'+off+'"]');
        if(backOff) backOff.classList.remove('selected');
      }
      updatePickUI();
    }
  }

  function revealAll(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    setStage('revealed');
    var spreadEl=document.getElementById('ect-spread');
    var spread=spreadEl?spreadEl.value:'single';
    var focusEl=document.getElementById('ect-focus');
    var focus=focusEl?focusEl.value:'general';
    var isLove = focus==='love';
    var scenario = isLove ? scn() : null;
    // 1) 选中牌背原地翻开显示牌面(翻转动画,中途换内容)
    for(var i=0;i<picked.length;i++){
      var pos=picked[i];
      var d=deck[pos];
      var backEl=document.querySelector('#ect-deck .ect-card-back[data-pos="'+pos+'"]');
      if(backEl){
        (function(el,card,rev){
          el.classList.add('flipped');
          setTimeout(function(){ el.classList.add('ect-is-front'); el.innerHTML=cardFrontHtml(card,rev); }, 280);
        })(backEl, CARDS[d.cardIdx], d.reversed);
      }
    }
    // 2) 下方详细解读
    var holder=document.getElementById('ect-revealed-cards');
    var res=document.getElementById('ect-result');
    if(holder) holder.innerHTML='';
    if(res) res.style.display='block';
    // v10.1: love 场景引导块(场景标签 + guide文案, 合规非命运确定论)
    if(isLove && scenario){
      var guideTxt = spread==='three' ? scenario.guide_three : scenario.guide_single;
      if(holder) holder.insertAdjacentHTML('beforeend',
        '<div class="ect-scenario-bar"><span class="ect-scenario-tag">Your love focus</span><span class="ect-scenario-name">'+esc(scenario.label)+'</span></div>'
        + '<p class="ect-scenario-guide">'+esc(guideTxt)+'</p>');
    }
    for(var j=0;j<picked.length;j++){
      var pos2=picked[j];
      var d2=deck[pos2];
      var draw={ card:CARDS[d2.cardIdx], reversed:d2.reversed };
      // v10.1: love 场景化位置标签(三牌用场景three_pos, 单牌用场景single_pos); 非love三牌用通用Past/Present/Future
      var posLabel='';
      if(spread==='three'){
        posLabel = (isLove && scenario && scenario.three_pos) ? scenario.three_pos[j] : POSITIONS[j];
      } else if(isLove && scenario){
        posLabel = scenario.single_pos || '';
      }
      if(holder) holder.insertAdjacentHTML('beforeend', singleCardHtml(draw,posLabel));
    }
    var deckEl=document.getElementById('ect-deck');
    if(deckEl) deckEl.classList.add('ect-deck-done');
    var resetBtn=document.getElementById('ect-reset-btn');
    if(resetBtn) resetBtn.style.display='inline-block';
    setTimeout(function(){
      // 不跳到结果区(会把刚翻开的牌滚走); 仅最小滚动确保翻开牌可见, sticky提示引导下滚看解读
      var ff=document.querySelector('#ect-deck .ect-card-back.flipped');
      if(ff){ try{ ff.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
    },450);
  }

  function resetDraw(){
    if(autoRevealTimer){ clearTimeout(autoRevealTimer); autoRevealTimer=null; }
    buildDeck(); renderDeck(); picked=[];
    var deckEl=document.getElementById('ect-deck'); if(deckEl) deckEl.classList.remove('ect-deck-done');
    var holder=document.getElementById('ect-revealed-cards'); if(holder) holder.innerHTML='';
    var res=document.getElementById('ect-result'); if(res) res.style.display='none';
    var resetBtn=document.getElementById('ect-reset-btn'); if(resetBtn) resetBtn.style.display='none';
    var shuffleBtn=document.getElementById('ect-shuffle-btn');
    if(shuffleBtn) shuffleBtn.classList.remove('ect-btn-reveal');
    setStage('initial');
    updatePickUI();
  }

  function scrollToDeck(){
    var deckEl=document.getElementById('ect-deck');
    if(!deckEl) return;
    var top=deckEl.getBoundingClientRect().top+window.pageYOffset-120;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }

  function kwRow(kws){ return kws.map(function(k){return '<span class="ect-kw">'+esc(k)+'</span>';}).join(''); }
  function stoneCardHtml(tag,stone){
    if(!stone) return '';
    var img=stone.img?'<img class="ect-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">':'';
    return '<div class="ect-stone-card">'+img
      +'<div class="ect-stone-body">'
      +'<div class="ect-stone-tag">'+esc(tag)+'</div>'
      +'<div class="ect-stone-name">'+esc(stone.name)+'</div>'
      +'<div class="ect-stone-reason">'+esc(stone.reason)+'</div>'
      +'<a class="ect-stone-shop" href="'+esc(stone.shop)+'">Shop '+esc(stone.name)+' &rarr;</a>'
      +'</div></div>';
  }
  function relatedHtml(c){
    if(!c.related||!c.related.length) return '';
    var chips=c.related.map(function(sl){return '<a class="ect-related-chip" href="/tarot-'+sl+'-crystals/">'+esc(cardNameBySlug(sl))+' &rarr;</a>';}).join('');
    return '<div class="ect-related-row"><span class="ect-related-lbl">Related cards:</span>'+chips+'</div>';
  }
  function cardNameBySlug(sl){ for(var i=0;i<CARDS.length;i++){if(CARDS[i].slug===sl) return CARDS[i].name;} return sl; }

  function cardFrontHtml(c,rev){
    return '<div class="ect-front-face">'
      +'<div class="ect-front-num">Major Arcana #'+c.number+'</div>'
      +'<div class="ect-front-name">'+esc(c.name)+'</div>'
      +'<div class="ect-front-arch">'+esc(c.archetype)+'</div>'
      +'<span class="ect-front-orient '+(rev?'ect-front-rev':'ect-front-up')+'">'+(rev?'Reversed':'Upright')+'</span>'
      +'</div>';
  }
  function singleCardHtml(draw,posLabel){
    var c=draw.card, rev=draw.reversed;
    var kws=rev?c.reversed_keywords:c.upright_keywords;
    var meaning=rev?c.reversed_meaning:c.upright_meaning;
    var focusEl=document.getElementById('ect-focus');
    var focus=focusEl?focusEl.value:'general';
    var isLove = focus==='love';
    var scenario = isLove ? scn() : null;
    var stones=[];
    if(rev){
      if(c.crystals.best_reversed) stones.push(['For the shadow side',c.crystals.best_reversed]);
      if(isLove && c.crystals.best_love) stones.push(['For love',c.crystals.best_love]);
      else if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }else if(isLove && c.crystals.best_love){
      stones.push(['For love',c.crystals.best_love]);
      if(c.crystals.best_overall) stones.push(['Overall support',c.crystals.best_overall]);
    }else{
      if(c.crystals.best_overall) stones.push(['Best for this draw',c.crystals.best_overall]);
      if(c.crystals.best_daily_wear) stones.push(['Daily wear',c.crystals.best_daily_wear]);
    }
    var stonesHtml=stones.map(function(s){return stoneCardHtml(s[0],s[1]);}).join('');
    var chakraChip = c.chakra&&c.chakra.length ? '<span class="ect-meta-chip"><b>Chakra:</b> '+esc(c.chakra.join(', '))+'</span>' : '';
    var posHtml = posLabel ? '<div class="ect-card-pos">'+esc(posLabel)+'</div>' : '';
    var lensHtml='';
    if(c.psych||c.eastern){
      lensHtml='<div class="ect-lens-grid">';
      if(c.psych) lensHtml+='<div class="ect-lens"><div class="ect-lens-lbl">Psychological lens</div><div class="ect-lens-txt">'+esc(c.psych)+'</div></div>';
      if(c.eastern) lensHtml+='<div class="ect-lens eastern"><div class="ect-lens-lbl">Eastern perspective</div><div class="ect-lens-txt">'+esc(c.eastern)+'</div></div>';
      lensHtml+='</div>';
    }
    // v10.1: practice 场景化 — love 用场景反思问题(合规非命运确定论); 其他 focus 用卡片自带 practice
    var practiceTxt = (isLove && scenario && scenario.practice) ? scenario.practice : c.practice;
    var practiceHtml = practiceTxt ? '<div class="ect-practice"><div class="ect-practice-lbl">A question to sit with</div><div class="ect-practice-txt">'+esc(practiceTxt)+'</div></div>' : '';
    // v10.1: meaning-lbl 场景化 — love 显示 "Meaning in your [场景短名] reading", 逆位仍标注 shadow
    var meaningLbl;
    if(rev) meaningLbl='Reversed meaning (for reflection)';
    else if(isLove && scenario) meaningLbl='Meaning in your '+scenario.label.toLowerCase()+' reading';
    else meaningLbl='Upright meaning';

    return '<div class="ect-card">'+posHtml
      +'<div class="ect-card-head">'
      +'<div class="ect-card-num">Major Arcana #'+c.number+'</div>'
      +'<div class="ect-card-name">'+esc(c.name)+'</div>'
      +'<div class="ect-card-arch">'+esc(c.archetype)+'</div>'
      +'<span class="ect-card-orient '+(rev?'ect-reversed':'ect-upright')+'">'+(rev?'Reversed \\u2014 shadow aspect':'Upright')+'</span>'
      +'</div>'
      +'<div class="ect-card-body">'
      +'<div class="ect-meta-row">'
      +'<span class="ect-meta-chip"><b>Element:</b> '+esc(c.element)+'</span>'
      +'<span class="ect-meta-chip"><b>Astrology:</b> '+esc(c.astrology)+'</span>'
      +chakraChip
      +'</div>'
      +'<div class="ect-kw-row">'+kwRow(kws)+'</div>'
      +'<div class="ect-meaning-lbl">'+esc(meaningLbl)+'</div>'
      +'<div class="ect-meaning">'+esc(meaning)+'</div>'
      +lensHtml
      +practiceHtml
      +'<div class="ect-stones-lbl">Crystals for this draw</div>'
      +'<div class="ect-stones">'+stonesHtml+'</div>'
      +relatedHtml(c)
      +'<div class="ect-cta-row">'
      +'<a class="ect-cta ect-cta-primary" href="/tarot-'+c.slug+'-crystals/">Read the full '+esc(c.name)+' guide &rarr;</a>'
      +'<a class="ect-cta ect-cta-sec" href="/product-category/healing-crystals-jewelry/">Shop healing jewelry &rarr;</a>'
      +'</div>'
      +'</div></div>';
  }

  function init(){
    buildDeck();
    renderDeck();
    var shBtn=document.getElementById('ect-shuffle-btn');
    var rstBtn=document.getElementById('ect-reset-btn');
    var valBtn=document.getElementById('ect-validate-btn');
    if(shBtn) shBtn.addEventListener('click', shuffleDeck);
    if(rstBtn) rstBtn.addEventListener('click', resetDraw);
    if(valBtn) valBtn.addEventListener('click', onValidate);
    var sp=document.getElementById('ect-spread');
    if(sp) sp.addEventListener('change', onSpreadChange);
    var fc=document.getElementById('ect-free-count');
    if(fc) fc.addEventListener('change', onSpreadChange);
    var fe=document.getElementById('ect-focus');
    if(fe) fe.addEventListener('change', onFocusChange); // v10.1: focus 切换 → 显隐场景子选择 + 刷新提示
    onSpreadChange(); // 初始化 free-count 显隐
    onFocusChange(); // v10.1: 初始化场景 select 显隐(focus 未选 → 隐藏)
    setStage('initial'); // v9: 默认洗好, initial 态即可选牌
    updatePickUI();
    window.ECTaro={ shuffle:shuffleDeck, pick:pickCard, validate:onValidate, reset:resetDraw };
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

let html = `<!-- ===== Earthward Crystal Tarot Reading v10 ===== -->
<div id="ect-wrap">
  <h1 class="ect-h1">Crystal Tarot Reading</h1>
  <p class="ect-intro">The 22 Major Arcana are laid out face-down below, already shuffled. First choose your focus, then swipe through the deck and pick your card — each reveals an archetype for self-reflection, paired with crystals, a psychological lens, and an Eastern perspective. No card is "good" or "bad"; every reading is an invitation to look more closely.</p>

  <div class="ect-input-row">
    <div class="ect-field">
      <label class="ect-field-lbl" for="ect-focus">Your focus</label>
      <select id="ect-focus">
        <option value="" disabled selected>Select your focus</option>
        <option value="general">General Guidance</option>
        <option value="love">Love &amp; Relationships</option>
        <option value="career">Career &amp; Direction</option>
        <option value="healing">Healing &amp; Release</option>
        <option value="guidance">Inner Guidance</option>
      </select>
    </div>
    <div class="ect-field ect-field-scenario" id="ect-scenario-field" style="display:none">
      <label class="ect-field-lbl" for="ect-scenario">Your love focus</label>
      <select id="ect-scenario">
        <option value="thinking">What Is He/She Thinking?</option>
        <option value="truelove">True Love / Soulmate</option>
        <option value="status">Relationship Status</option>
        <option value="reconcile">Getting Back Together?</option>
      </select>
    </div>
    <div class="ect-field">
      <label class="ect-field-lbl" for="ect-spread">Spread</label>
      <select id="ect-spread">
        <option value="single">Single Card</option>
        <option value="three">Past — Present — Future</option>
        <option value="free">Free Draw (1–10)</option>
      </select>
    </div>
    <div class="ect-field ect-field-free" id="ect-free-field" style="display:none">
      <label class="ect-field-lbl" for="ect-free-count">How many cards</label>
      <input id="ect-free-count" type="number" min="1" max="10" value="3">
    </div>
    <div class="ect-field ect-field-grow">
      <label class="ect-field-lbl" for="ect-question">Your question (optional)</label>
      <input id="ect-question" type="text" placeholder="What do you want to reflect on?" maxlength="120">
    </div>
  </div>

  <div class="ect-deck" id="ect-deck"></div>

  <div class="ect-ritual-bar">
    <div class="ect-action-row">
      <button class="ect-btn ect-btn-ritual" id="ect-shuffle-btn" type="button">Shuffle Again</button>
      <button class="ect-btn ect-btn-validate" id="ect-validate-btn" type="button" style="display:none">Validate <span class="ect-validate-arrow">&rarr;</span></button>
      <button class="ect-btn ect-btn-reset" id="ect-reset-btn" type="button" style="display:none">Draw Again</button>
    </div>
    <p class="ect-stage-hint" id="ect-stage-hint">The 22 Major Arcana are laid out face-down. Select your focus, then swipe through the deck to pick your card.</p>
  </div>

  <div class="ect-result" id="ect-result" style="display:none">
    <div id="ect-revealed-cards"></div>
  </div>

  <p class="ect-disclaim-top">${GENTLE}</p>
</div>
<style>
#ect-wrap{font-size:16px;color:#1A1A2E}
.ect-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ect-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.ect-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.ect-field{display:flex;flex-direction:column;gap:5px}
.ect-field-grow{flex:1;min-width:220px}
.ect-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#1B4332}
.ect-input-row select,.ect-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;min-width:190px;font-family:inherit}
.ect-field-grow input{width:100%;min-width:0}
.ect-field-free input{min-width:90px;max-width:110px}

.ect-ritual-bar{background:#fff;padding:14px 0 4px;margin:14px 0 0;border-top:1px solid #EEE}
.ect-action-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:center;margin-bottom:10px}
.ect-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:46px;font-family:inherit}
.ect-btn:hover:not(:disabled){background:#1B4332}
.ect-btn:disabled{background:#BBB;cursor:not-allowed}
.ect-btn-ritual{min-width:130px;transition:background .2s,border-color .2s,transform .2s}
/* v10: 选满态 Shuffle Again 按钮变 Reveal 高亮(金色脉冲, 视觉提示选满即将翻, 不强制点) */
.ect-btn-ritual.ect-btn-reveal{background:#CFAA3E;color:#1A1A2E !important;border-color:#CFAA3E;font-weight:700;animation:ectPulse 1.6s ease-in-out infinite}
.ect-btn-ritual.ect-btn-reveal:hover{background:#B8902A;transform:translateY(-1px)}
.ect-btn-reset{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.ect-btn-reset:hover:not(:disabled){background:#F0F7F4}
.ect-btn-validate{display:inline-flex;align-items:center;gap:8px;background:#CFAA3E;color:#1A1A2E !important;border:none;min-width:150px;font-weight:700;animation:ectPulse 2s ease-in-out infinite}
.ect-btn-validate:hover{background:#B8902A;transform:translateY(-1px)}
.ect-validate-arrow{display:inline-block;transition:transform .2s}
.ect-btn-validate:hover .ect-validate-arrow{transform:translateX(3px)}
@keyframes ectPulse{0%,100%{box-shadow:0 0 0 0 rgba(207,170,62,.5)}50%{box-shadow:0 0 0 8px rgba(207,170,62,0)}}
.ect-stage-hint{color:#1B4332;font-size:15px;margin:0 auto;font-weight:500;padding:8px 16px;background:#F0F7F4;border-radius:8px;border-left:3px solid #2D6A4F;max-width:680px;text-align:center;transition:color .2s,background .2s,border-color .2s}
.ect-stage-hint.ect-hint-warn{color:#8B1A1A;background:#FFF0F0;border-color:#C83030;animation:ectHintShake .35s ease}
@keyframes ectHintShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.ect-disclaim-top{color:#888;font-size:13px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

/* v10 牌背布局: flex 横向单排 + 左右滚动(evatarot式横向铺开), 22张大牌(150px)横排, 水平滑动浏览选牌 */
.ect-deck{display:flex;gap:14px;overflow-x:auto;margin-bottom:18px;padding:10px 4px 18px;transition:opacity .4s;-webkit-overflow-scrolling:touch;scrollbar-color:#CFAA3E #F0F0E8}
.ect-deck::-webkit-scrollbar{height:10px}
.ect-deck::-webkit-scrollbar-track{background:#F0F0E8;border-radius:6px}
.ect-deck::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#CFAA3E 0%,#B8902A 100%);border-radius:6px;border:1px solid #F0F0E8}
.ect-deck::-webkit-scrollbar-thumb:hover{background:#B8902A}
.ect-card-back{flex:0 0 150px;width:150px;height:225px;border-radius:12px;position:relative;background:linear-gradient(135deg,#1A1A2E 0%,#2D2D52 100%);border:2px solid #CFAA3E;box-shadow:0 4px 14px rgba(26,26,46,.22);transition:transform .25s,box-shadow .25s,border-color .25s;cursor:default;transform-origin:center bottom}
.ect-card-back.ect-enter{animation:ectEnter .45s ease backwards}
.ect-back-inner{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.5);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#CFAA3E}

/* v10 水晶主题牌背放大(牌 150px 承接更多内容): 六棱柱水晶图形放大 */
.ect-back-crystal{position:relative;width:62px;height:84px;margin-bottom:4px}
.ect-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-bottom:21px solid rgba(127,209,168,.85)}
.ect-crystal-face.ect-crystal-m{position:absolute;top:18px;left:10px;width:42px;height:50px;background:linear-gradient(180deg,rgba(127,209,168,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.ect-crystal-side.ect-crystal-l{position:absolute;top:21px;left:0;width:14px;height:44px;background:rgba(45,106,79,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.ect-crystal-side.ect-crystal-r{position:absolute;top:21px;right:0;width:14px;height:44px;background:rgba(45,106,79,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.ect-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;border-top:12px solid rgba(45,106,79,.85)}
.ect-back-spark{position:absolute;font-size:18px;color:rgba(207,170,62,.85);opacity:.8}
.ect-back-label{font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.2}
.ect-deck:not(.ect-deck-pickable) .ect-card-back{opacity:.78}
.ect-deck:not(.ect-deck-pickable) .ect-card-back:hover{transform:translateY(-8px);box-shadow:0 10px 22px rgba(26,26,46,.32);border-color:#7FD1A8;opacity:1}
.ect-deck-pickable .ect-card-back{cursor:pointer}
.ect-deck-pickable .ect-card-back:hover{transform:translateY(-10px);box-shadow:0 14px 28px rgba(26,26,46,.38);border-color:#7FD1A8}
.ect-card-back.selected{border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.35),0 8px 18px rgba(26,26,46,.3);transform:translateY(-7px)}
.ect-card-back.selected .ect-back-inner{color:#7FD1A8}
.ect-deck.ect-deck-done{pointer-events:none}
.ect-deck.ect-deck-done .ect-card-back:not(.flipped){opacity:.3}
.ect-card-back.flipped{animation:ectFlipOver .55s ease}
.ect-card-back.ect-is-front{background:linear-gradient(135deg,#2D6A4F 0%,#1B4332 100%);opacity:1 !important;cursor:default}
.ect-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.55);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;padding:8px;text-align:center}
.ect-front-num{font-size:12px;color:#CFAA3E;font-weight:700}
.ect-front-name{font-size:16px;font-weight:700;line-height:1.15}
.ect-front-arch{font-size:12px;color:#CFAA3E;line-height:1.2}
.ect-front-orient{font-size:11px;font-weight:700;padding:3px 9px;border-radius:8px;margin-top:4px}
.ect-front-up{background:#7FD1A8;color:#1A1A2E}
.ect-front-rev{background:#B59AC9;color:#1A1A2E}
@keyframes ectFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.ect-deck.ect-shuffle-anim{animation:ectShuffle .55s ease}
@keyframes ectEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes ectShuffle{0%{transform:translateX(0)}20%{transform:translateX(-8px) rotate(-1deg)}40%{transform:translateX(8px) rotate(1deg)}60%{transform:translateX(-6px) rotate(-.5deg)}80%{transform:translateX(6px) rotate(.5deg)}100%{transform:translateX(0) rotate(0)}}

/* 结果卡 */
.ect-result{margin-top:8px}
/* v10.1 爱情场景引导块(focus=love 时 revealAll 输出) */
.ect-scenario-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,#FBF3E5 0%,#FFF8F0 100%);border:1px solid #E8C887;border-radius:12px;padding:14px 18px;margin-bottom:14px}
.ect-scenario-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;background:#fff;padding:4px 10px;border-radius:8px;border:1px solid #E8C887}
.ect-scenario-name{font-size:18px;font-weight:700;color:#1A1A2E}
.ect-scenario-guide{color:#666;font-size:15px;line-height:1.65;margin:0 0 20px;padding:0 4px}
.ect-card{background:#fff;border:1px solid #EEE;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;animation:ectReveal .5s ease}
@keyframes ectReveal{0%{opacity:0;transform:translateY(14px) rotateY(-12deg)}100%{opacity:1;transform:translateY(0) rotateY(0)}}
.ect-card-pos{background:#F0F7F4;border-bottom:1px solid #EEE;padding:8px 22px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1B4332}
.ect-card-head{background:#1A1A2E;padding:24px 26px;color:#fff}
.ect-card-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.ect-card-name{font-size:32px;font-weight:700;line-height:1.1}
.ect-card-arch{font-size:16px;color:#CFAA3E;font-weight:600;margin-top:4px}
.ect-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.ect-upright{background:#2D6A4F;color:#fff}
.ect-reversed{background:#6B4E8A;color:#fff}
.ect-card-body{padding:22px 26px}
.ect-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.ect-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.ect-meta-chip b{color:#1A1A2E}
.ect-kw-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.ect-kw{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:4px 11px;border-radius:14px;font-size:14px;font-weight:500}
.ect-meaning-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.ect-meaning{font-size:16px;color:#444;line-height:1.7;margin-bottom:18px}

.ect-lens-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}
.ect-lens{background:#FAFAFA;border:1px solid #EEE;border-radius:10px;padding:14px}
.ect-lens.eastern{background:#FBF3E5;border-color:#E8C887}
.ect-lens-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:6px}
.ect-lens.eastern .ect-lens-lbl{color:#7A5A12}
.ect-lens-txt{font-size:15px;color:#555;line-height:1.6}
.ect-lens.eastern .ect-lens-txt{color:#5A4208}

.ect-practice{background:#FBF3E5;border:1px solid #E8C887;border-radius:12px;padding:16px 18px;margin-bottom:18px}
.ect-practice-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;margin-bottom:6px}
.ect-practice-txt{font-size:15px;color:#5A4208;line-height:1.6;font-style:italic}

.ect-stones-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F;margin-bottom:10px}
.ect-stones{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:6px}
.ect-stone-card{background:#FAFAFA;border:1px solid #EEE;border-radius:12px;padding:14px;display:flex;gap:12px;align-items:flex-start}
.ect-stone-img{width:64px;height:64px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#EEE}
.ect-stone-body{flex:1;min-width:0}
.ect-stone-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.ect-stone-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:2px 0 5px}
.ect-stone-reason{font-size:14px;color:#666;line-height:1.55}
.ect-stone-shop{display:inline-block;margin-top:6px;font-size:14px;font-weight:600;color:#2D6A4F !important;text-decoration:none}

.ect-related-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:16px;padding-top:14px;border-top:1px dashed #EEE}
.ect-related-lbl{font-size:13px;font-weight:700;color:#888;margin-right:4px}
.ect-related-chip{background:#F0F0F5;border:1px solid #DDD;border-radius:8px;padding:5px 11px;font-size:14px;color:#444 !important;text-decoration:none}
.ect-related-chip:hover{background:#EAEAF5;color:#1A1A2E !important}

.ect-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.ect-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600}
.ect-cta-primary{background:#2D6A4F;color:#fff !important}
.ect-cta-primary:hover{background:#1B4332}
.ect-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}

.ect-seo-accordion{margin:32px 0 0}
.ect-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ect-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.ect-seo-details summary::-webkit-details-marker{display:none}
.ect-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.ect-seo-details[open] summary:after{content:'-'}
.ect-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ect-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.ect-seo-content h2:first-child{margin-top:0}
.ect-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
@media(max-width:900px){.ect-lens-grid{grid-template-columns:1fr}.ect-stones{grid-template-columns:1fr}}
/* v10 平板: 保持 flex 横向滚动(牌 150px 大牌), 牌稍小 130px */
@media(max-width:780px){
  .ect-card-back{flex:0 0 130px;width:130px;height:195px}
}
/* v10 移动: flex-wrap 换行 2-3 列(375px 以下大牌换行浏览), 取消横向滚动 */
@media(max-width:640px){
  .ect-h1{font-size:26px}.ect-input-row select,.ect-input-row input{min-width:150px;font-size:15px}.ect-card-name{font-size:26px}
  .ect-card-head{padding:20px 18px}.ect-card-body{padding:18px}
  .ect-deck{flex-wrap:wrap;justify-content:center;overflow-x:visible;gap:10px}
  .ect-card-back{flex:0 0 105px;width:105px;height:158px}
  .ect-back-crystal{width:38px;height:52px}
  .ect-btn{padding:12px 22px;font-size:14px;height:44px}
  .ect-btn-ritual{min-width:110px}
  .ect-stage-hint{font-size:14px}
}
</style>
<!-- v10: JSON data in standalone application/json block -->
<script type="application/json" id="ect-data">${DATA_BLOCK}</script>
<!-- v10: executable JS Base64-encoded to survive WP wp_kses entity-escaping. Loader decodes + evals at runtime. -->
<script type="text/plain" id="ect-app">__ECT_APP_B64__</script>
<script>
(function(){var b=document.getElementById('ect-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('ECTaro init failed',e);}})();
</script>
<!-- ===== Crystal Tarot Reading Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How does a tarot reading work?","acceptedAnswer":{"@type":"Answer","text":"A tarot reading draws one or more cards from the Major Arcana and reads them as symbolic prompts for self-reflection. Each card has an archetype, an upright meaning, and a reversed (shadow) meaning. The cards surface patterns and questions to sit with — they are a framework for contemplation, not a fixed forecast."}},
{"@type":"Question","name":"Do tarot cards predict the future?","acceptedAnswer":{"@type":"Answer","text":${safeJSON(HALVES.can_predict_future_first_half)}}},
{"@type":"Question","name":"Can a tarot card be bad or evil?","acceptedAnswer":{"@type":"Answer","text":${safeJSON(HALVES.is_bad_card_first_half)}}},
{"@type":"Question","name":"What crystals go with tarot cards?","acceptedAnswer":{"@type":"Answer","text":"Each Major Arcana card pairs with crystals chosen for its archetype. A draw's crystal is selected to support the energy of the card in its position — for example, an upright Fool pairs with stones of new beginnings, while a reversed Fool leans toward stones of steadying discernment. Clear quartz and selenite are also traditional companions for keeping the reading space clear."}},
{"@type":"Question","name":"What is the difference between upright and reversed cards?","acceptedAnswer":{"@type":"Answer","text":"An upright card points to the archetype expressing in its more open form. A reversed card points to the shadow side of that archetype — the tension, block, or invitation to reflect — never to a curse or bad luck. Both are simply information: one is not better than the other."}}
]}
]}
</script>
<!-- ===== End Crystal Tarot Reading v10 ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Crystal Tarot Reading SEO Accordion ===== -->
<section class="ect-seo-accordion" aria-label="Tarot reading guide">
  <details class="ect-seo-details">
    <summary>Learn More About Tarot &amp; Crystals</summary>
    <div class="ect-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Crystal Tarot Reading SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'crystal-tarot-reading.html');
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function(ch){ return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__ECT_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function(full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Crystal Tarot Reading v10 generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'cards |', APP_B64.length, 'b64 chars');
