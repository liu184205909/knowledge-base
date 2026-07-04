/**
 * Crystal Tarot Reading v10.6 — v10.5 翻牌结果卡颜色修复: 绿色边框/光晕 → 金色外扩 + 文字区加宽
 * v10.6 改进(对比v10.5):
 *   1) 翻牌结果卡(.ect-card 详细解读卡) 边框灰 #EEE → 金 #CFAA3E + 金色外扩光晕(box-shadow 0 0 0 5px rgba(207,170,62,.22) 往外扩);
 *      牌头(.ect-card-head)底边加 3px 金线 + body padding 26→32px 让文字区呼吸更宽(用户原话"字体就可以宽一点显示")
 *   2) Deck 翻开牌(.ect-card-back.flipped/.ect-is-front) 消除翻牌后残留的 selected 绿色光晕 → 金色 border + 金色外扩(0 0 0 4px rgba(207,170,62,.32));
 *      翻牌态视觉与详细解读卡统一金色外扩(检查 agent 发现翻牌后绿色 #2D6A4F + 绿光晕已修)
 *   3) 牌头位置条(.ect-card-pos) 绿调 → 金调背景(#FBF3E5+金线+#7A5A12 字)协调金色外扩主题
 * 保留 v10.5 全部: 每行 11 张完整 / 卡牌矮 142 / 删圈圈 / focus必选 / 自动翻 / 爱情场景 / 三模式 / 英文 / 合规 / base64
 *
 * Crystal Tarot Reading v10.5 — v10.4 deck 优化: 每行 11 张完整可见 + 滚动效果优化
 * v10.5 改进(对比v10.4):
 *   1) 每行 11 张牌完整可见(用户核心诉求): 桌面牌宽改为 flex:1 1 0 + width:100%(自适应均分) + min-width 96/max-width 134,
 *      配合 .ect-deck-row flex nowrap + gap:6px → 11 张精确填满一行(1192视口≈108px/牌), 无溢出无需水平滚动看第 11 张;
 *      v10.4 固定宽 114px → 11×114+60gap=1314>1192 溢出只显示 10; v10.5 自适应填满 11 张全可见(用户明确要 11 张不滚动最直观)
 *   2) 滚动效果优化(用户不满意统一滚动条+拖动): 桌面 11 张完整无溢出 → horizontalMode()=false → 底部统一滚动条 JS 自动隐藏(桌面无需);
 *      鼠标拖动(horizontalMode 才激活)桌面自动失效; 平板/移动 grid 多列本就无水平滚动; 滚动机制仅在溢出场景(极窄视口)保留兜底
 *   3) 牌背水晶图形 48×60 + "Crystal Tarot"文字在 108px 仍清晰(比 114 仅小 6px); hover 浮起/selected/翻转动画不受影响
 * 保留 v10.4 全部逻辑(机制层不动, 仅牌宽自适应让桌面无溢出): 两行 11+11 / focus必选 + 选满自动翻 + Reveal + 爱情场景 + 三模式 +
 *   默认洗牌 + 卡牌矮 142px + 删圈圈 + 水晶牌背 + 英文 + 合规 + base64; 滚动条/拖动/同步代码保留, horizontalMode 守卫让桌面自动隐藏
 * 保留 v10.3: 滚动统一+拖动机制 / 卡牌矮 / 删圈圈
 * v10.4 详见 git 历史(滚动统一+拖动 / 卡牌矮 / 删圈圈)
 *
 * Crystal Tarot Reading v10.1 — v10 + 爱情场景预设(focus=love → 显示场景子选择, 吸收爱情塔罗4场景)
 * v10.1 改进(对比v10):
 *   1) focus 选 love → 显示"Your love focus"场景子选择(thinking/truelove/status/reconcile 4场景, 吸收爱情塔罗)
 *      其他 focus(general/career/healing/guidance)不显示场景子选择(CSS display:none, focus 切换时显隐)
 *   2) 场景影响解读: 场景引导块("Your focus: [场景]"+ 场景guide文案) + 位置标签场景化(three模式用场景three_pos)
 *      + meaning-lbl 场景化("Meaning in your [场景短名] reading") + practice 反思问题场景化(场景guide合规非命运确定论)
 *      + love 水晶优先 best_love(爱情石)
 *   3) focus 必选保留: focus 是必选第一步(value="" 占位), 场景是 love 下的子选(love 已满足 focusReady, 场景默认选第一个)
 * v10.2 改进(对比v10.1): deck flex 左右滚动单排 → grid 自适应换行(桌面 minmax(135px,1fr) 22牌自然 11+11 两行/多行, 移动 minmax(100px) 2-3列),
 *   去掉 overflow-x 水平滚动条(grid 无滚动), 牌宽 width:100% 自适应单元格; 保留 hover 浮起/selected/翻转/shuffle 动画
 * 保留 v10.1 全部: focus必选 + 选满0.5s自动翻牌 + Reveal 高亮 + 默认洗牌 + 水晶牌背 + 三模式 + 爱情场景预设 + 英文 + 合规 + base64
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
    // v10.5: 22 张大牌分两行(11+11), 每行 .ect-deck-row(flex nowrap + overflow-x兜底); 桌面牌宽自适应(flex:1 1 0)→11张精确填满无溢出(无需滚动);
    // 两行原生滚动条隐藏, 底部统一滚动条 .ect-deck-scrollbar 仅在溢出时(JS horizontalMode)显示, 桌面11张满显自动隐藏
    var perRow=deck.length;
    var h='';
    for(var r=0;r<Math.ceil(deck.length/perRow);r++){
      h+='<div class="ect-deck-row">';
      for(var i=r*perRow;i<Math.min((r+1)*perRow,deck.length);i++){
        h+='<div class="ect-card-back ect-enter" data-pos="'+i+'" style="--i:'+i+'">'
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
      h+='</div>';
    }
    // v10.4: 底部统一滚动条(默认隐藏, 桌面横向模式时 JS 加 .ect-sb-show 显示)
    h+='<div class="ect-deck-scrollbar" aria-hidden="true"><div class="ect-deck-thumb"></div></div>';
    el.innerHTML=h;
    var backs=el.querySelectorAll('.ect-card-back');
    for(var k=0;k<backs.length;k++){
      (function(b){ b.addEventListener('click', function(){ pickCard(parseInt(b.getAttribute('data-pos'),10)); }); })(backs[k]);
    }
    // v10.4: DOM 重建后刷新统一滚动条可见性 + thumb(切回 initial 重新选牌时);
    // 延迟一帧让浏览器完成新 22 张牌布局后再判 scrollWidth/clientWidth, 否则 horizontalMode() 会误判 false
    if(typeof deckScrollRefresh==='function'){ try{ setTimeout(deckScrollRefresh, 30); }catch(_){} }
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
      else if(s==='revealed') hint.textContent='Your '+(n===1?'card':'reading')+' is revealed. The interpretation is shown below.';
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
          el.classList.add('flipped','ect-reveal-card','ect-reveal-pos-'+i);
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
      var deckEl=document.getElementById('ect-deck');
      if(deckEl){
        var offset = window.innerWidth <= 640 ? 86 : 112;
        var top = deckEl.getBoundingClientRect().top + window.pageYOffset - offset;
        try { window.scrollTo({top:Math.max(0, top), behavior:'smooth'}); }
        catch(e){ window.scrollTo(0, Math.max(0, top)); }
      }
    },520);
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

  // v10.4: deck 两行统一滚动 + 鼠标拖动卡牌滚动 + 底部统一滚动条同步
  // 用事件委托(绑 deck 容器一次) + 全局 activeRow 处理, renderDeck 重建 DOM 后无需重新绑
  function initDeckScroll(){
    var deckEl=document.getElementById('ect-deck');
    if(!deckEl) return;
    // sb/thumb 都实时查询(renderDeck 会 innerHTML 重建 DOM, 旧引用失效), 闭包只持有 deckEl
    function sb(){ return deckEl.querySelector('.ect-deck-scrollbar'); }
    function thumb(){ var s=sb(); return s ? s.querySelector('.ect-deck-thumb') : null; }
    function rows(){ return deckEl.querySelectorAll('.ect-deck-row'); }
    // 判断当前是否处于"横向滚动模式"(桌面 flex); 平板/移动切 grid 后无横向溢出 → 隐藏统一滚动条
    function horizontalMode(){
      var rs=rows(); var r0=rs[0];
      return r0 && (r0.scrollWidth - r0.clientWidth) > 2;
    }
    function maxScroll(){
      var rs=rows(); var r0=rs[0];
      return r0 ? Math.max(0, r0.scrollWidth - r0.clientWidth) : 0;
    }
    function updateThumb(){
      var s=sb(); var th=thumb(); if(!th || !s) return;
      var rs=rows(); var r0=rs[0]; if(!r0) return;
      var trackW = s.clientWidth;
      var ms = maxScroll();
      var ratio = r0.scrollWidth > 0 ? r0.clientWidth / r0.scrollWidth : 1;
      // thumb 宽度按可视/内容比例, 但封顶 55% 轨道宽(避免溢出小时 thumb 占满整条不利拖), 最少 48px 易点
      var thumbW = Math.max(48, Math.min(Math.round(trackW * 0.55), Math.round(trackW * ratio)));
      if(ms <= 0){ th.style.width = trackW + 'px'; th.style.left='1px'; return; }
      th.style.width = thumbW + 'px';
      var pct = r0.scrollLeft / ms;
      var left = Math.max(1, Math.round((trackW - thumbW) * pct));
      th.style.left = left + 'px';
    }
    function refreshSbVisibility(){
      var s=sb(); if(!s) return;
      if(horizontalMode()){ s.classList.add('ect-sb-show'); updateThumb(); }
      else { s.classList.remove('ect-sb-show'); }
    }

    var syncing=false;
    function syncFromRow(srcRow){
      if(syncing) return; syncing=true;
      var sl=srcRow.scrollLeft;
      var rs=rows();
      for(var i=0;i<rs.length;i++){ if(rs[i]!==srcRow) rs[i].scrollLeft=sl; }
      updateThumb();
      syncing=false;
    }
    function syncFromValue(sl){
      if(syncing) return; syncing=true;
      var rs=rows();
      for(var i=0;i<rs.length;i++){ rs[i].scrollLeft=sl; }
      updateThumb();
      syncing=false;
    }
    // row scroll 同步(委托: 每次重建 DOM 仍生效)
    deckEl.addEventListener('scroll', function(e){
      var t=e.target;
      if(t && t.classList && t.classList.contains('ect-deck-row')) syncFromRow(t);
    }, true);

    // 鼠标/触摸拖动卡牌滚动 — 全局 activeRow, mousedown 委托到 deck
    var dragRow=null, dStartX=0, dStartScroll=0, dMoved=0;
    function shouldIgnoreTarget(tgt){
      return tgt && (tgt.closest && (tgt.closest('.ect-deck-scrollbar') || tgt.tagName==='BUTTON' || tgt.tagName==='A' || tgt.tagName==='SELECT' || tgt.tagName==='INPUT'));
    }
    function onDragDown(e){
      if(!horizontalMode()) return;
      var tgt=e.target;
      if(shouldIgnoreTarget(tgt)) return;
      var rowEl = tgt.closest ? tgt.closest('.ect-deck-row') : null;
      if(!rowEl) return;
      dragRow=rowEl; dMoved=0;
      dStartX = (e.touches ? e.touches[0].clientX : e.clientX);
      dStartScroll = rowEl.scrollLeft;
      rowEl.classList.add('ect-dragging');
      if(!e.touches){ try{ e.preventDefault(); }catch(_){} } // 鼠标阻止文字/图片选中
    }
    function onDragMove(e){
      if(!dragRow) return;
      var cx = (e.touches ? e.touches[0].clientX : e.clientX);
      var dx = cx - dStartX;
      if(Math.abs(dx) > 5) dMoved++;
      syncFromValue(dStartScroll - dx);
      if(e.touches){ try{ e.preventDefault(); }catch(_){} }
    }
    function onDragUp(){
      if(!dragRow) return;
      dragRow.classList.remove('ect-dragging');
      // 若确为拖动(dMoved>1), 短暂标记吞掉紧接着的 click(避免拖完误点选牌)
      if(dMoved>1){
        var el=dragRow;
        el.setAttribute('data-just-dragged','1');
        setTimeout(function(){ el.removeAttribute('data-just-dragged'); }, 350);
      }
      dragRow=null;
    }
    deckEl.addEventListener('mousedown', onDragDown);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragUp);
    deckEl.addEventListener('touchstart', onDragDown, {passive:false});
    deckEl.addEventListener('touchmove', onDragMove, {passive:false});
    deckEl.addEventListener('touchend', onDragUp);
    // 捕获阶段: 拖动刚结束的 row 上的 click 吞掉(委托)
    deckEl.addEventListener('click', function(e){
      var rowEl = e.target.closest ? e.target.closest('.ect-deck-row') : null;
      if(rowEl && rowEl.getAttribute('data-just-dragged')==='1'){
        e.preventDefault(); e.stopPropagation(); return false;
      }
    }, true);

    // 拖统一滚动条 thumb → 两行一起滚(事件委托到 deckEl, renderDeck 重建 scrollbar 后仍生效)
    var thDown=false, thStartX=0, thStartScroll=0;
    function onThumbDown(e){
      if(!horizontalMode()) return;
      var th=thumb(); if(!th) return;
      // target 是 thumb 或其内 → 启动拖动; (thumb 无子节点, 严格相等即可, 但用 contains 更稳健)
      if(e.target!==th && !(th.contains && th.contains(e.target))) return;
      thDown=true; thStartX=(e.touches ? e.touches[0].clientX : e.clientX);
      var rs=rows(); thStartScroll = rs[0] ? rs[0].scrollLeft : 0;
      th.classList.add('ect-sb-dragging');
      try{ e.preventDefault(); e.stopPropagation(); }catch(_){}
    }
    function onThumbMove(e){
      if(!thDown) return;
      var s=sb(); var th=thumb(); if(!th||!s) return;
      var cx=(e.touches ? e.touches[0].clientX : e.clientX);
      var dx=cx-thStartX;
      var rs=rows(); var r0=rs[0]; if(!r0) return;
      var ms=maxScroll();
      var reach = s.clientWidth - th.offsetWidth;
      var ratio = reach>0 ? ms/reach : 0;
      syncFromValue(thStartScroll + dx*ratio);
      if(e.touches){ try{ e.preventDefault(); }catch(_){} }
    }
    function onThumbUp(){ if(!thDown) return; thDown=false; var th=thumb(); if(th) th.classList.remove('ect-sb-dragging'); }
    // thumb 拖动 — 委托: mousedown 只在 target 是 thumb 时启动
    deckEl.addEventListener('mousedown', onThumbDown, true);
    window.addEventListener('mousemove', onThumbMove);
    window.addEventListener('mouseup', onThumbUp);
    deckEl.addEventListener('touchstart', onThumbDown, {passive:false, capture:true});
    deckEl.addEventListener('touchmove', onThumbMove, {passive:false});
    deckEl.addEventListener('touchend', onThumbUp);
    // 点击轨道空白(非 thumb) → 跳一屏 — 委托: target 在 scrollbar 上但不是 thumb
    deckEl.addEventListener('mousedown', function(e){
      var s=sb(); if(!s || !s.contains(e.target)) return;
      var th=thumb(); if(!th || e.target===th) return;
      if(!horizontalMode()) return;
      var rs=rows(); var r0=rs[0]; if(!r0) return;
      var rect=s.getBoundingClientRect();
      var x=e.clientX-rect.left;
      var dir = (x < (parseFloat(th.style.left||0))) ? -1 : 1;
      syncFromValue(r0.scrollLeft + dir*r0.clientWidth*0.85);
    });

    // 窗口尺寸变化 → 重新评估滚动条可见性 + thumb 比例
    var rt;
    window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(refreshSbVisibility, 120); });
    // 暴露刷新给 renderDeck 后调用
    deckScrollRefresh = refreshSbVisibility;
    // 初次刷新
    setTimeout(refreshSbVisibility, 60);
  }
  var deckScrollRefresh = null;
  function init(){
    buildDeck();
    renderDeck();
    initDeckScroll();
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

let html = `<!-- ===== Earthward Crystal Tarot Reading v10.5 ===== -->
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

/* v10.5 牌背布局: deck 块容器垂直排两行(11+11), 每行 .ect-deck-row 是 flex nowrap + overflow-x:auto,
   v10.5 改进(对比v10.4): 桌面牌宽改为 calc((100% - 60px)/11) 自适应(11张×6px gap=60px),
   → 11 张精确填满一行无溢出(1192视口约108px/牌), 无需水平滚动看第11张(用户要"每行11张完整可见");
   因桌面无溢出 horizontalMode()=false → 底部统一滚动条 JS 自动隐藏(逻辑现成, 桌面无需);
   平板/移动切 grid 多列无水平滚动 */
.ect-deck{display:block;margin:4px 0 18px;padding:22px 18px 16px;transition:opacity .4s;overflow:visible;background:linear-gradient(135deg,#FAFAFA 0%,#F8F5EC 100%);border:1px solid #EFE6D2;border-radius:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.75)}
.ect-deck-rows-wrap{position:relative}
.ect-deck-row{display:flex;flex-wrap:nowrap;gap:0;margin-bottom:8px;overflow-x:auto;overflow-y:hidden;padding:14px 0 18px;scroll-snap-type:x proximity;cursor:grab;user-select:none;-webkit-user-select:none;min-height:208px;align-items:center}
.ect-deck-row.ect-dragging{cursor:grabbing;scroll-snap-type:none}
.ect-deck-row:last-of-type{margin-bottom:0}
/* v10.4: 隐藏两行各自原生滚动条(改用底部统一滚动条) */
.ect-deck-row::-webkit-scrollbar{display:none}
.ect-deck-row{scrollbar-width:none;-ms-overflow-style:none}
/* v10.5: 卡牌矮(沿用v10.4 142px) + 宽自适应填满11张/行 — flex:1 1 0 + width:100% 让11张均分一行宽度(1192视口≈108px/牌),
   配合 .ect-deck-row nowrap + gap:6px, 11张×6px=60px gap 占用固定, 剩余宽度11等分, 无溢出无需滚动(用户要"每行11张完整可见");
   max-width 134px 防止超宽视口下单张过大(平衡可读性); min-width 96px 防极窄 */
.ect-card-back{flex:0 0 126px;width:126px;min-width:126px;max-width:126px;height:178px;margin-left:-78px;scroll-snap-align:center;border-radius:14px;position:relative;background:radial-gradient(circle at 50% 24%,rgba(207,170,62,.18) 0 12%,transparent 34%),radial-gradient(circle at 80% 86%,rgba(127,209,168,.13),transparent 35%),linear-gradient(155deg,#0F1515 0%,#18201F 48%,#101326 100%);border:1px solid rgba(207,170,62,.9);box-shadow:0 9px 18px rgba(26,26,46,.2),inset 0 0 0 1px rgba(255,255,255,.08),inset 0 0 26px rgba(207,170,62,.08);transition:transform .25s,box-shadow .25s,border-color .25s,filter .25s;cursor:pointer;transform-origin:center bottom;z-index:var(--i,1)}
.ect-card-back:first-child{margin-left:0}
.ect-card-back:focus-visible{outline:3px solid rgba(127,209,168,.75);outline-offset:3px}
.ect-card-back:before{content:'';position:absolute;inset:7px;border:1px solid rgba(207,170,62,.28);border-radius:11px;pointer-events:none}
.ect-card-back:after{content:'';position:absolute;left:18px;right:18px;top:18px;height:1px;background:linear-gradient(90deg,transparent,rgba(207,170,62,.72),transparent);box-shadow:0 122px 0 rgba(207,170,62,.34);pointer-events:none}
.ect-card-back.ect-enter{animation:ectEnter .45s ease backwards}
/* v10.4: 删中间圈圈(用户要) — .ect-back-inner 去掉金色 border + 圆角(原外圈装饰), 改为无边框纯定位容器;
   水晶图形 + Crystal Tarot 文字直接显示在牌面上(无外圈包裹) */
.ect-back-inner{position:absolute;inset:10px;border:none;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#E4C878;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,0))}
.ect-back-inner:before,.ect-back-inner:after{content:'';position:absolute;left:50%;transform:translateX(-50%);width:42px;height:1px;background:linear-gradient(90deg,transparent,rgba(207,170,62,.62),transparent)}
.ect-back-inner:before{top:14px}.ect-back-inner:after{bottom:14px}

/* v10.4 水晶主题牌背(适配矮牌 142px): 六棱柱水晶图形 48×60(原 54×74 缩小适配矮牌) + 火花 + 标签清晰 */
.ect-back-crystal{position:relative;width:48px;height:60px;margin-bottom:4px}
.ect-back-crystal:before{content:'';position:absolute;left:50%;top:50%;width:58px;height:58px;transform:translate(-50%,-50%);border:1px solid rgba(207,170,62,.32);border-radius:50%;background:radial-gradient(circle,rgba(127,209,168,.1),transparent 68%)}
.ect-crystal-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-bottom:15px solid rgba(127,209,168,.85)}
.ect-crystal-face.ect-crystal-m{position:absolute;top:13px;left:8px;width:32px;height:36px;background:linear-gradient(180deg,rgba(127,209,168,.7) 0%,rgba(207,170,62,.6) 100%);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.ect-crystal-side.ect-crystal-l{position:absolute;top:15px;left:0;width:11px;height:31px;background:rgba(45,106,79,.75);clip-path:polygon(100% 0,80% 0,100% 100%,30% 100%)}
.ect-crystal-side.ect-crystal-r{position:absolute;top:15px;right:0;width:11px;height:31px;background:rgba(45,106,79,.55);clip-path:polygon(0 0,20% 0,70% 100%,0 100%)}
.ect-crystal-base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:9px solid rgba(45,106,79,.85)}
.ect-back-spark{position:absolute;left:50%;bottom:17px;transform:translateX(-50%);font-size:12px;color:rgba(228,200,120,.82);opacity:.9}
.ect-back-label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;text-align:center;line-height:1.25;color:#E4C878;text-shadow:0 1px 0 rgba(0,0,0,.22)}
/* v10.4 底部统一滚动条(两行同步): 加宽 16px 易点击/拖动 + 金色渐变明显 + 点击轨道跳转(JS); 默认隐藏 JS 加 .ect-sb-show */
.ect-deck-scrollbar{position:relative;height:16px;margin:10px 4px 4px;background:linear-gradient(90deg,#FBF3E5 0%,#FFF8F0 100%);border-radius:10px;border:1px solid #F0E2C5;cursor:pointer;display:none}
.ect-deck-scrollbar.ect-sb-show{display:block}
.ect-deck-thumb{position:absolute;top:1px;left:1px;height:14px;min-width:48px;border-radius:8px;background:linear-gradient(90deg,#CFAA3E 0%,#E8C887 50%,#CFAA3E 100%);border:1px solid #B8932E;box-shadow:0 1px 4px rgba(184,147,46,.4);transition:width .1s}
.ect-deck-thumb:hover{background:linear-gradient(90deg,#E8C887 0%,#F5D89A 50%,#E8C887 100%)}
.ect-deck-thumb.ect-sb-dragging{background:linear-gradient(90deg,#E8C887 0%,#F5D89A 50%,#E8C887 100%);box-shadow:0 2px 8px rgba(184,147,46,.6)}
.ect-deck:not(.ect-deck-pickable) .ect-card-back{opacity:.78}
.ect-deck:not(.ect-deck-pickable) .ect-card-back:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(26,26,46,.28);border-color:#7FD1A8;opacity:1}
.ect-deck-pickable .ect-card-back{cursor:pointer}
.ect-deck-pickable .ect-card-back:hover{transform:translateY(-8px);box-shadow:0 16px 30px rgba(26,26,46,.34);border-color:#7FD1A8;filter:saturate(1.08)}
.ect-card-back.selected{border-color:#7FD1A8;box-shadow:0 0 0 3px rgba(127,209,168,.42),0 18px 32px rgba(26,26,46,.32);transform:translateY(-12px)}
.ect-card-back.selected .ect-back-inner{color:#7FD1A8}
.ect-deck.ect-deck-done{pointer-events:none}
.ect-deck.ect-deck-done{background:linear-gradient(135deg,#FFFDF8 0%,#F8F3E7 100%)}
.ect-deck.ect-deck-done .ect-deck-row{justify-content:center;align-items:center;gap:14px;overflow-x:visible;overflow-y:visible;min-height:238px;padding:28px 0 30px;cursor:default}
.ect-deck.ect-deck-done .ect-card-back:not(.flipped){display:none}
.ect-deck.ect-deck-done .ect-card-back.flipped{display:block;flex:0 0 132px;width:132px;min-width:132px;max-width:132px;height:186px;margin-left:0;opacity:1;filter:none}
.ect-deck.ect-deck-done .ect-reveal-card{transform:translateY(0) rotate(0);transition:transform .35s ease,box-shadow .35s ease}
.ect-deck.ect-deck-done .ect-reveal-pos-0{transform:translateY(10px) rotate(-7deg)}
.ect-deck.ect-deck-done .ect-reveal-pos-1{transform:translateY(-8px) rotate(0)}
.ect-deck.ect-deck-done .ect-reveal-pos-2{transform:translateY(10px) rotate(7deg)}
.ect-deck.ect-deck-done .ect-reveal-pos-3{transform:translateY(14px) rotate(-5deg)}
.ect-deck.ect-deck-done .ect-reveal-pos-4{transform:translateY(4px) rotate(5deg)}
.ect-card-back.flipped{animation:ectFlipOver .55s ease}
/* v10.6 翻牌态金色外扩(用户要"翻牌后黄色线条往外扩"): 翻开瞬间覆盖 selected 绿光晕 → 金色 border + 金色外扩光晕(0 0 0 4px rgba(207,170,62,.32) 往外扩) */
.ect-card-back.flipped.selected{border-color:#CFAA3E;box-shadow:0 0 0 4px rgba(207,170,62,.32),0 18px 32px rgba(26,26,46,.3);z-index:90}
.ect-card-back.ect-is-front{background:radial-gradient(circle at 50% 14%,rgba(207,170,62,.18),transparent 38%),linear-gradient(180deg,#FFFDF8 0%,#F7F0DF 100%);opacity:1 !important;cursor:default;border-color:#CFAA3E;box-shadow:0 0 0 4px rgba(207,170,62,.28),0 18px 32px rgba(26,26,46,.24);z-index:90}
.ect-front-face{position:absolute;inset:8px;border:1px solid rgba(207,170,62,.72);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:#1A1A2E;padding:8px;text-align:center;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,250,238,.42))}
.ect-front-face:before{content:'';position:absolute;width:64px;height:64px;border:1px solid rgba(207,170,62,.22);border-radius:50%;top:18px;left:50%;transform:translateX(-50%);pointer-events:none}
.ect-front-num{position:relative;font-size:10px;color:#8A6517;font-weight:700;line-height:1.1;text-transform:uppercase;letter-spacing:.02em}
.ect-front-name{position:relative;font-size:15px;font-weight:700;line-height:1.08;color:#1A1A2E}
.ect-front-arch{position:relative;font-size:10.5px;color:#7A5A12;line-height:1.15}
.ect-front-orient{font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-top:2px}
.ect-front-up{background:#7FD1A8;color:#1A1A2E}
.ect-front-rev{background:#B59AC9;color:#1A1A2E}
@keyframes ectFlipOver{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}100%{transform:rotateY(0)}}
.ect-deck.ect-shuffle-anim{animation:ectShuffle .55s ease}
@keyframes ectEnter{0%{transform:translateY(-14px) rotate(-3deg);opacity:0}100%{transform:translateY(0) rotate(0);opacity:1}}
@keyframes ectShuffle{0%{transform:translateX(0)}20%{transform:translateX(-8px) rotate(-1deg)}40%{transform:translateX(8px) rotate(1deg)}60%{transform:translateX(-6px) rotate(-.5deg)}80%{transform:translateX(6px) rotate(.5deg)}100%{transform:translateX(0) rotate(0)}}

/* 结果卡 */
.ect-result{margin-top:14px;scroll-margin-top:120px}
/* v10.6 翻牌结果卡金色外扩(用户要"翻牌后黄色线条往外扩+字体宽"): 边框灰→金 #CFAA3E + 金色外扩光晕(0 0 0 5px rgba(207,170,62,.3) 往外扩) */
.ect-card{background:#fff;border:1px solid #CFAA3E;border-radius:16px;padding:0;margin-bottom:22px;overflow:hidden;box-shadow:0 0 0 5px rgba(207,170,62,.18),0 12px 28px rgba(26,26,46,.1);animation:ectReveal .5s ease}
/* v10.1 爱情场景引导块(focus=love 时 revealAll 输出) */
.ect-scenario-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(135deg,#FBF3E5 0%,#FFF8F0 100%);border:1px solid #E8C887;border-radius:12px;padding:14px 18px;margin-bottom:14px}
.ect-scenario-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;background:#fff;padding:4px 10px;border-radius:8px;border:1px solid #E8C887}
.ect-scenario-name{font-size:18px;font-weight:700;color:#1A1A2E}
.ect-scenario-guide{color:#666;font-size:15px;line-height:1.65;margin:0 0 20px;padding:0 4px}
@keyframes ectReveal{0%{opacity:0;transform:translateY(14px) rotateY(-12deg)}100%{opacity:1;transform:translateY(0) rotateY(0)}}
.ect-card-pos{background:#FBF3E5;border-bottom:1px solid #E8C887;padding:9px 28px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7A5A12}
/* v10.6 牌头/牌体 padding 加宽(26→32px) 让文字区呼吸更宽(用户要"字体就可以宽一点显示"); 牌头底边加金线协调金色外扩 */
.ect-card-head{position:relative;background:radial-gradient(circle at 82% 18%,rgba(207,170,62,.2),transparent 32%),linear-gradient(135deg,#111525 0%,#1A1A2E 58%,#26324B 100%);padding:24px 32px;color:#fff;border-bottom:3px solid #CFAA3E;overflow:hidden}
.ect-card-head:after{content:'';position:absolute;right:24px;top:18px;width:92px;height:92px;border:1px solid rgba(207,170,62,.28);border-radius:50%;box-shadow:inset 0 0 0 22px rgba(255,255,255,.02);pointer-events:none}
.ect-card-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:13px;font-weight:700;padding:3px 10px;border-radius:10px;margin-bottom:8px}
.ect-card-name{font-size:32px;font-weight:700;line-height:1.1}
.ect-card-arch{font-size:16px;color:#CFAA3E;font-weight:600;margin-top:4px}
.ect-card-orient{display:inline-block;font-size:14px;font-weight:700;padding:5px 14px;border-radius:14px;margin-top:12px}
.ect-upright{background:#2D6A4F;color:#fff}
.ect-reversed{background:#6B4E8A;color:#fff}
.ect-card-body{padding:24px 32px;background:linear-gradient(180deg,#FFFFFF 0%,#FFFDF8 100%)}
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
/* v10.4 平板: deck-row 切回 grid 自适应换行(minmax 120px), 取消 flex 横向滚动; 卡牌矮(198→160); grid 模式统一滚动条 JS 自动隐藏 */
@media(max-width:780px){
  .ect-input-row{gap:10px;margin-bottom:12px}
  .ect-field{width:100%}
  .ect-field-grow{min-width:0}
  .ect-input-row select,.ect-input-row input{width:100%;min-width:0}
  .ect-deck{padding:18px 14px 14px}
  .ect-deck-row{display:flex;flex-wrap:nowrap;gap:0;overflow-x:auto;overflow-y:hidden;cursor:grab;padding:12px 0 16px;min-height:184px}
  .ect-card-back{flex:0 0 112px;width:112px;height:156px;max-width:112px;min-width:112px;margin-left:-44px}
  .ect-card-back:first-child{margin-left:0}
  .ect-deck.ect-deck-done .ect-deck-row{gap:10px;min-height:214px;padding:24px 0 26px;flex-wrap:wrap}
  .ect-deck.ect-deck-done .ect-card-back.flipped{flex:0 0 118px;width:118px;min-width:118px;max-width:118px;height:164px}
  .ect-front-name{font-size:15px}
  .ect-front-num,.ect-front-arch{font-size:11px}
  .ect-result{scroll-margin-top:96px}
}
/* v10.4 移动: deck-row grid 自适应 2-3 列(minmax 100px), 无水平滚动; 卡牌矮(162→132) */
@media(max-width:640px){
  .ect-h1{font-size:26px}.ect-input-row select,.ect-input-row input{min-width:0;font-size:15px}.ect-card-name{font-size:24px}
  .ect-card-head{padding:16px 14px}.ect-card-body{padding:16px 14px}
  .ect-card-pos{padding:8px 14px;font-size:12px}
  .ect-deck{padding:16px 12px 12px;border-radius:12px}
  .ect-deck-row{display:flex;grid-template-columns:none;gap:0;overflow-x:auto;overflow-y:hidden;cursor:grab;padding:10px 0 14px;min-height:166px}
  .ect-card-back{flex:0 0 100px;width:100px;min-width:100px;max-width:100px;height:140px;margin-left:-38px}
  .ect-card-back:first-child{margin-left:0}
  .ect-deck.ect-deck-done .ect-deck-row{gap:8px;min-height:190px;padding:22px 0 24px;flex-wrap:wrap}
  .ect-deck.ect-deck-done .ect-card-back.flipped{flex:0 0 104px;width:104px;min-width:104px;max-width:104px;height:146px}
  .ect-deck.ect-deck-done .ect-reveal-pos-0{transform:translateY(6px) rotate(-5deg)}
  .ect-deck.ect-deck-done .ect-reveal-pos-1{transform:translateY(-5px) rotate(0)}
  .ect-deck.ect-deck-done .ect-reveal-pos-2{transform:translateY(6px) rotate(5deg)}
  .ect-back-crystal{width:34px;height:44px}
  .ect-back-label{font-size:10px;letter-spacing:.1em}
  .ect-front-face{inset:6px;gap:4px;padding:6px}
  .ect-front-name{font-size:13px}
  .ect-front-num,.ect-front-arch{font-size:10px}
  .ect-front-orient{font-size:10px;padding:3px 7px}
  .ect-stone-card{padding:12px;gap:10px}
  .ect-stone-img{width:54px;height:54px}
  .ect-btn{padding:12px 22px;font-size:14px;height:44px}
  .ect-btn-ritual{min-width:110px}
  .ect-stage-hint{font-size:14px;padding:8px 12px}
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
