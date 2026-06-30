/**
 * Tarot Birth Card Calculator v10-UI — UI 对齐皇冠 v10 视觉(计算器, 非抽牌工具, 不应用抽牌 v10 标准)
 * v10-UI 视觉升级(对齐皇冠 crystal-tarot-draw v10 风格):
 *   1) 配色统一品牌(#2D6A4F 主绿 / #1A1A2E 深夜 / #CFAA3E 金)
 *   2) 字体 min14/min16, 标题层级 + label 大写letter-spacing 风格统一
 *   3) 按钮 v10 风格: 主按钮 hover 上浮 transform + 内层渐变; 输入框 focus 态金色边
 *   4) 卡片 hover 微浮起 + 阴影; 结果头深色卡片 + 金色 eyebrow
 *   5) 响应式: 移动端字体/间距对齐皇冠 v10
 * 保留算法(Tarot.com 权威版, MM+DD+YY+YY 公式) + 2 本命牌 + 组合解读 + 水晶 + Shop CTA:
 *   Total = Month + Day + floor(Year/100) + (Year%100)   // e.g. 02+05+19+62 = 88
 *   Card1 = 反复相加 Total 各位直至落在 1-22 (0→22 The Fool)   // 88 → 8+8=16 (Tower)
 *   Card2 = 继续把 Card1 归约到单数字(1-9); 若 Card1 已是单数字则 Card2=Card1   // 16 → 1+6=7 (Chariot)
 * 读 _shared/tarot-knowledge.json(22大牌 number0-21) + crystal-meaning-search/data/search-data.json(slug→img/shop)
 * 约束: base64 包装 JS (wp_kses 防转义) + asciiJSON 数据块 + 字体 min14 + self-reflection 合规 + CSS 前缀 ebc-
 * URL /tools/tarot-birth-card/ (page 48075). 输出: ./tarot-birth-card.html
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

// 卡牌数据: number 0-21, 归约时 0→22 映射 The Fool. UI 内部统一用 1-22 (Fool=22)
const CARDS = TK.cards.map(c => ({
  number: c.number, // 0-21
  num22: c.number === 0 ? 22 : c.number, // 1-22 (Fool=22)
  slug: c.slug, name: c.name, archetype: c.archetype,
  element: c.element, astrology: c.astrology, theme: c.theme,
  upright_keywords: c.upright_keywords || [],
  upright_meaning: c.upright_meaning || '',
  psych: c.psychological_lens || '',
  eastern: (c.eastern_anchors && c.eastern_anchors.tibetan) || '',
  practice: c.recommended_practice || '',
  crystals: {
    best_overall: enrichStone(c.crystals.best_overall),
    best_daily_wear: enrichStone(c.crystals.best_daily_wear)
  }
}));

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({ cards: CARDS });

// 本命牌组合解读模板 (基于两牌 archetype/theme, self-reflection 框架)
const APP_JS = `(function(){
  var rawData = document.getElementById('ebc-data');
  var parsed;
  try { parsed = JSON.parse(rawData.textContent); } catch(e){ console.error('EBC data parse failed', e); return; }
  var CARDS = parsed.cards || [];
  // 22 键映射: number 1-22 (Fool=22). card22[i] = 卡牌(number==i 或 i==22 且 number==0)
  var BY22 = {};
  for (var i=0;i<CARDS.length;i++){ var c=CARDS[i]; BY22[c.num22]=c; }

  function digitSum(n){ n=Math.abs(Math.floor(n)); var s=0; while(n>0){ s+=n%10; n=Math.floor(n/10); } return s; }
  // Card1: 归约 total 到 1-22 (反复各位相加直至 ≤22; 0→22 The Fool)
  function reduceTo22(n){
    n=Math.abs(Math.floor(n));
    while(n>22){ n=digitSum(n); }
    if(n===0) n=22;
    return n;
  }
  // Card2: 对 Card1 继续归约到单数字(1-9); 单数字不变; 22→4 (Tarot.com 风格继续归约)
  function reduceToSingle(n){
    n=Math.abs(Math.floor(n));
    if(n<10) return n;
    if(n===22) return 4;
    return digitSum(n);
  }

  function calc(){
    var m=Number(document.getElementById('ebc-month').value);
    var d=Number(document.getElementById('ebc-day').value);
    var y=Number(document.getElementById('ebc-year').value);
    var err=document.getElementById('ebc-err');
    if(err) err.style.display='none';
    if(!m||!d||!y||String(y).length<4){ if(err){err.textContent='Please enter your full birth date (month, day, and 4-digit year).';err.style.display='block';} return; }

    // Total = Month + Day + floor(Year/100) + (Year%100)  (Tarot.com 公式: MM+DD+YY+YY)
    var yy1=Math.floor(y/100), yy2=y%100;
    var total=m+d+yy1+yy2;
    var card1=reduceTo22(total);
    var card2=reduceToSingle(card1);
    render(m,d,y,total,card1,card2,yy1,yy2);
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function comboNarrative(c1,c2,same){
    var a1=c1.archetype, a2=c2.archetype;
    var t1=c1.theme, t2=c2.theme;
    if(same){
      return 'Both of your Birth Cards are '+c1.name+' ('+a1+'), which means this archetype is unusually concentrated in your life. The theme of '+t1.toLowerCase()+' is not a background note for you — it is a central, recurring invitation. When '+c1.name+'\\'s energy is well-tended, it can become one of your greatest gifts; when ignored, it tends to surface until you listen. The lifelong work here is depth, not balance between two forces.';
    }
    return 'Your two Birth Cards sit in a lifelong dialogue. '+c1.name+' ('+a1+', "'+t1+'") is your more outward, dominant archetype — the energy you tend to lead with. '+c2.name+' ('+a2+', "'+t2+'") is the underlying companion — the quieter theme that supports, complicates, or deepens the first. The integration of these two is itself your growth edge: how to honor the drive of '+c1.name+' without losing the wisdom of '+c2.name+', and vice versa. Neither card is more "you" than the other.';
  }

  function cardBlock(c,label){
    var c22 = c.num22;
    var kws=(c.upright_keywords||[]).slice(0,5).map(function(k){return '<span class="ebc-kw">'+esc(k)+'</span>';}).join('');
    var stones=[];
    if(c.crystals.best_overall) stones.push(['Primary crystal',c.crystals.best_overall]);
    if(c.crystals.best_daily_wear) stones.push(['Daily wear',c.crystals.best_daily_wear]);
    var stonesHtml=stones.map(function(s){
      var st=s[1]; var img=st.img?'<img class="ebc-stone-img" src="'+esc(st.img)+'" alt="'+esc(st.name)+'" loading="lazy">':'';
      return '<div class="ebc-stone-card">'+img+'<div class="ebc-stone-body"><div class="ebc-stone-tag">'+esc(s[0])+'</div><div class="ebc-stone-name">'+esc(st.name)+'</div><div class="ebc-stone-reason">'+esc(st.reason)+'</div><a class="ebc-stone-shop" href="'+esc(st.shop)+'">Shop '+esc(st.name)+' &rarr;</a></div></div>';
    }).join('');
    return '<div class="ebc-bc-card">'
      +'<div class="ebc-bc-label">'+label+'</div>'
      +'<div class="ebc-bc-head">'
      +'<div class="ebc-bc-num">#'+c22+' of the Major Arcana</div>'
      +'<div class="ebc-bc-name">'+esc(c.name)+'</div>'
      +'<div class="ebc-bc-arch">'+esc(c.archetype)+'</div>'
      +'</div>'
      +'<div class="ebc-bc-body">'
      +'<div class="ebc-meta-row">'
      +'<span class="ebc-meta-chip"><b>Theme:</b> '+esc(c.theme)+'</span>'
      +'<span class="ebc-meta-chip"><b>Element:</b> '+esc(c.element)+'</span>'
      +'<span class="ebc-meta-chip"><b>Astrology:</b> '+esc(c.astrology)+'</span>'
      +'</div>'
      +(kws?'<div class="ebc-kw-row">'+kws+'</div>':'')
      +'<div class="ebc-meaning">'+esc(c.upright_meaning)+'</div>'
      +'<div class="ebc-stones">'+stonesHtml+'</div>'
      +'<a class="ebc-read-link" href="/tarot-'+c.slug+'-crystals/">Read the full '+esc(c.name)+' guide &rarr;</a>'
      +'</div></div>';
  }

  function render(m,d,y,total,card1,card2,yy1,yy2){
    var el=document.getElementById('ebc-result');
    el.style.display='block';
    var c1=BY22[card1], c2=BY22[card2];
    var same = (card1===card2);
    var narrative = comboNarrative(c1,c2,same);
    var datePretty = prettyDate(m,d,y);
    // 计算步骤展示 (供用户验证 MM+DD+YY+YY 公式)
    var stepTxt;
    if(total<=22){
      var tdisp = total===0?22:total;
      stepTxt='Your birth date '+datePretty+' gives '+m+' + '+d+' + '+yy1+' + '+yy2+' = <b>'+total+'</b>. Since '+total+' is 22 or less, your first Birth Card is <b>'+tdisp+'</b> ('+esc(c1.name)+').';
    } else {
      stepTxt='Your birth date '+datePretty+' gives '+m+' + '+d+' + '+yy1+' + '+yy2+' = <b>'+total+'</b>. Reducing the digits ('+digitChain(total)+') gives <b>'+card1+'</b> ('+esc(c1.name)+') — your first Birth Card.';
    }
    if(!same){
      stepTxt+=' Reducing '+card1+' again ('+digitChain(card1)+') gives <b>'+card2+'</b> ('+esc(c2.name)+') — your second Birth Card.';
    } else {
      stepTxt+=' '+card1+' is already a single digit, so it cannot be reduced further — your second Birth Card is also <b>'+card1+'</b> ('+esc(c1.name)+').';
    }

    el.innerHTML='<div class="ebc-r-head">'
      +'<div class="ebc-r-eyebrow">Your Tarot Birth Cards</div>'
      +'<div class="ebc-r-pair">'+esc(c1.name)+' <span class="ebc-r-amp">&amp;</span> '+esc(c2.name)+'</div>'
      +'<div class="ebc-r-step">'+stepTxt+'</div>'
      +'</div>'
      +'<div class="ebc-bc-grid">'
      +cardBlock(c1,'Birth Card 1 — the dominant archetype')
      +(same?'':cardBlock(c2,'Birth Card 2 — the companion archetype'))
      +'</div>'
      +'<div class="ebc-combo"><div class="ebc-combo-lbl">How your two cards work together</div><div class="ebc-combo-txt">'+esc(narrative)+'</div></div>'
      +'<div class="ebc-cta-row">'
      +'<a class="ebc-cta ebc-cta-sec" href="/crystals-for-tarot-cards/">Explore all 22 Major Arcana &rarr;</a>'
      +'<a class="ebc-cta ebc-cta-primary" href="/product-category/healing-crystals-jewelry/">Shop healing crystal jewelry &rarr;</a>'
      +'</div>'
      +'<p class="ebc-disclaim">Tarot Birth Cards are a symbolic framework for self-reflection — they describe archetypal themes to notice, not a fixed fate. Crystal pairings are offered for spiritual inspiration and are not a substitute for professional advice.</p>';

    var offset=window.innerWidth<768?80:120;
    var top=el.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }

  function digitChain(n){
    // 把 n 展开为 "2+9" 形式
    var s=String(n); var parts=[];
    for(var i=0;i<s.length;i++) parts.push(s.charAt(i));
    return parts.join('+');
  }
  function prettyDate(m,d,y){
    var ms=['','January','February','March','April','May','June','July','August','September','October','November','December'];
    return ms[m]+' '+d+', '+y;
  }

  function init(){
    var ms=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var mh=document.getElementById('ebc-month'), dh=document.getElementById('ebc-day');
    for(var i=1;i<=12;i++) mh.innerHTML+='<option value="'+i+'">'+ms[i]+'</option>';
    for(var dd=1;dd<=31;dd++) dh.innerHTML+='<option value="'+dd+'">'+dd+'</option>';
    var btn=document.getElementById('ebc-btn');
    if(btn) btn.addEventListener('click', calc);
    var yr=document.getElementById('ebc-year');
    if(yr && yr.addEventListener){
      yr.addEventListener('keydown', function(e){ if(e.key==='Enter'){ calc(); } });
    }
    window.EBCalc={ calc:calc };
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();`;

let html = `<!-- ===== Earthward Tarot Birth Card Calculator ===== -->
<div id="ebc-wrap">
  <h1 class="ebc-h1">Tarot Birth Card Calculator</h1>
  <p class="ebc-intro">Enter your birth date to discover your two Tarot Birth Cards — the Major Arcana archetypes tied to your life's core themes. The calculator shows the exact math, then pairs each card with its crystals and a combined reading for self-reflection.</p>

  <div class="ebc-input-card">
    <div class="ebc-input-row">
      <div class="ebc-field">
        <label class="ebc-field-lbl" for="ebc-month">Month</label>
        <select id="ebc-month"><option value="">Month</option></select>
      </div>
      <div class="ebc-field">
        <label class="ebc-field-lbl" for="ebc-day">Day</label>
        <select id="ebc-day"><option value="">Day</option></select>
      </div>
      <div class="ebc-field ebc-field-year">
        <label class="ebc-field-lbl" for="ebc-year">Year</label>
        <input id="ebc-year" type="number" placeholder="e.g. 1990" min="1900" max="2099">
      </div>
      <button class="ebc-btn" id="ebc-btn" type="button">Reveal Cards</button>
    </div>
    <p class="ebc-err" id="ebc-err" style="display:none"></p>
  </div>

  <div class="ebc-result" id="ebc-result" style="display:none"></div>

  <p class="ebc-disclaim-top">Tarot Birth Cards are a symbolic self-reflection framework, not a prediction of fate. No card is "good" or "bad" — each names an archetype to notice.</p>
</div>
<style>
#ebc-wrap{font-size:16px;color:#1A1A2E}
.ebc-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ebc-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}

/* v10-UI: 输入卡片(浅底圆角, 与皇冠输入区视觉统一) */
.ebc-input-card{background:#FAFAFA;border:1px solid #EEE;border-radius:14px;padding:20px 22px;margin-bottom:20px}
.ebc-input-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end}
.ebc-field{display:flex;flex-direction:column;gap:5px}
.ebc-field-year{flex:0 0 150px}
.ebc-field-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#1B4332}
.ebc-input-row select,.ebc-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff;font-family:inherit;transition:border-color .2s,box-shadow .2s}
.ebc-input-row select{min-width:120px}
.ebc-input-row input{width:100%;min-width:0}
.ebc-input-row select:focus,.ebc-input-row input:focus{outline:none;border-color:#CFAA3E;box-shadow:0 0 0 3px rgba(207,170,62,.18)}
/* v10-UI: 主按钮(品牌绿 + 金色脉冲 hover 上浮, 对齐皇冠 v10) */
.ebc-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 30px;font-size:15px;font-weight:600;cursor:pointer;height:48px;font-family:inherit;transition:background .2s,transform .2s,box-shadow .2s}
.ebc-btn:hover{background:#1B4332;transform:translateY(-2px);box-shadow:0 8px 18px rgba(26,26,46,.22)}
.ebc-btn:active{transform:translateY(0)}
.ebc-err{color:#8B1A1A;background:#FFF0F0;border:1px solid #F0C8C8;border-radius:8px;padding:10px 14px;margin:12px 0 0;font-size:14px}
.ebc-disclaim-top{color:#888;font-size:13px;line-height:1.6;margin-top:22px;border-left:3px solid #DDD;padding-left:14px}

.ebc-result{margin-top:18px}
/* v10-UI: 结果头深色卡片 + 金色 eyebrow + 渐变(对齐皇冠结果卡) */
.ebc-r-head{background:linear-gradient(135deg,#1A1A2E 0%,#2D2D52 100%);border:1px solid #CFAA3E;border-radius:16px;padding:28px 30px;color:#fff;margin-bottom:22px;animation:ebcReveal .5s ease}
@keyframes ebcReveal{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
.ebc-r-eyebrow{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#CFAA3E}
.ebc-r-pair{font-size:32px;font-weight:700;line-height:1.2;margin-top:6px}
.ebc-r-amp{color:#CFAA3E;font-style:italic;font-weight:400}
.ebc-r-step{font-size:15px;color:#C9D2E0;line-height:1.65;margin-top:14px}
.ebc-r-step b{color:#fff}

/* v10-UI: 本命牌卡(hover 微浮起 + 阴影) */
.ebc-bc-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.ebc-bc-card{background:#fff;border:1px solid #EEE;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s,border-color .25s}
.ebc-bc-card:hover{transform:translateY(-4px);box-shadow:0 12px 26px rgba(26,26,46,.14);border-color:#CFAA3E}
.ebc-bc-label{background:#F0F7F4;border-bottom:1px solid #E0EDE6;padding:10px 20px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#1B4332}
.ebc-bc-head{background:linear-gradient(135deg,#2D6A4F 0%,#1B4332 100%);padding:22px 24px;color:#fff}
.ebc-bc-num{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:12px;font-weight:700;padding:3px 10px;border-radius:10px;letter-spacing:.04em}
.ebc-bc-name{font-size:24px;font-weight:700;line-height:1.15;margin-top:8px}
.ebc-bc-arch{font-size:15px;color:#CFAA3E;font-weight:600;margin-top:4px}
.ebc-bc-body{padding:20px 22px;flex:1;display:flex;flex-direction:column}
.ebc-meta-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}
.ebc-meta-chip{background:#FAFAFA;border:1px solid #EEE;border-radius:8px;padding:5px 11px;font-size:14px;color:#444}
.ebc-meta-chip b{color:#1A1A2E}
.ebc-kw-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}
.ebc-kw{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:4px 11px;border-radius:14px;font-size:14px;font-weight:500}
.ebc-meaning{font-size:15px;color:#555;line-height:1.65;margin-bottom:16px}

.ebc-stones{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px}
.ebc-stone-card{background:#FAFAFA;border:1px solid #EEE;border-radius:10px;padding:12px;display:flex;gap:12px;align-items:flex-start;transition:transform .2s,box-shadow .2s}
.ebc-stone-card:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(26,26,46,.1)}
.ebc-stone-img{width:58px;height:58px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#EEE}
.ebc-stone-body{flex:1;min-width:0}
.ebc-stone-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.ebc-stone-name{font-size:15px;font-weight:700;color:#1A1A2E;margin:2px 0 4px}
.ebc-stone-reason{font-size:14px;color:#666;line-height:1.5}
.ebc-stone-shop{display:inline-block;margin-top:5px;font-size:14px;font-weight:600;color:#2D6A4F !important;text-decoration:none}
.ebc-read-link{display:inline-block;margin-top:auto;padding-top:8px;font-size:14px;font-weight:600;color:#2D6A4F !important;text-decoration:none}
.ebc-read-link:hover{text-decoration:underline}

.ebc-combo{background:#FBF3E5;border:1px solid #E8C887;border-radius:14px;padding:20px 22px;margin-bottom:20px}
.ebc-combo-lbl{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7A5A12;margin-bottom:8px}
.ebc-combo-txt{font-size:16px;color:#5A4208;line-height:1.7}

/* v10-UI: CTA 按钮对齐皇冠 v10(hover 上浮) */
.ebc-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
.ebc-cta{display:inline-block;padding:13px 24px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;transition:background .2s,transform .2s}
.ebc-cta-primary{background:#2D6A4F;color:#fff !important}
.ebc-cta-primary:hover{background:#1B4332;transform:translateY(-2px)}
.ebc-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.ebc-cta-sec:hover{background:#F0F7F4;transform:translateY(-2px)}

.ebc-disclaim{color:#888;font-size:13px;line-height:1.6;margin-top:6px;border-left:3px solid #EEE;padding-left:14px}

@media(max-width:820px){.ebc-bc-grid{grid-template-columns:1fr}}
@media(max-width:640px){
  .ebc-h1{font-size:26px}.ebc-r-pair{font-size:24px}
  .ebc-input-card{padding:16px}
  .ebc-input-row select{min-width:100px;font-size:15px}.ebc-input-row input{font-size:15px}
  .ebc-field-year{flex:1 1 120px}
  .ebc-btn{padding:12px 22px;font-size:14px;width:100%}
  .ebc-bc-name{font-size:21px}
  .ebc-bc-head{padding:18px}.ebc-bc-body{padding:18px}
}
</style>
<!-- Tarot Birth Card data (asciiJSON, non-ASCII escaped) -->
<script type="application/json" id="ebc-data">${DATA_BLOCK}</script>
<!-- executable JS Base64-encoded to survive WP wp_kses entity-escaping; loader decodes + evals at runtime -->
<script type="text/plain" id="ebc-app">__EBC_APP_B64__</script>
<script>
(function(){var b=document.getElementById('ebc-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EBC init failed',e);}})();
</script>
<!-- ===== Tarot Birth Card Calculator Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What are Tarot Birth Cards?","acceptedAnswer":{"@type":"Answer","text":"Tarot Birth Cards are two Major Arcana cards derived from your date of birth. Together they describe the core archetypal themes you are working with across this lifetime. Unlike a daily tarot draw, your Birth Cards do not change — they are a fixed symbolic framework for self-reflection, popularized by The Tarot School."}},
{"@type":"Question","name":"How do I calculate my Tarot Birth Cards?","acceptedAnswer":{"@type":"Answer","text":"Add every digit of your birth date (MM/DD/YYYY) together to get a total. If the total is 22 or less, that number is your first Birth Card directly. If the total is greater than 22, add its digits and keep reducing until you land between 1 and 22 — that is your first card. Then reduce that number once more by adding its digits to get your second Birth Card. A result of 0 maps to 22, The Fool."}},
{"@type":"Question","name":"Can my two Birth Cards be the same?","acceptedAnswer":{"@type":"Answer","text":"Yes. If your birth-date total reduces to a single digit (1-9) or to 22 (The Fool), the second reduction produces the same number, so both cards are identical. This means one archetype is especially prominent for you — it is not a less valid reading."}},
{"@type":"Question","name":"Are Tarot Birth Cards accurate or scientific?","acceptedAnswer":{"@type":"Answer","text":"Birth Cards are a symbolic and spiritual framework, not a science. There is no scientific evidence that birth dates or tarot cards determine personality or fate. They are best used as a mirror for self-reflection — archetypes that name patterns and growth edges you are invited to notice."}},
{"@type":"Question","name":"What do the two Tarot Birth Cards mean together?","acceptedAnswer":{"@type":"Answer","text":"The first card is traditionally the more dominant, outward-facing archetype, while the second is the underlying companion theme. The most useful reading looks at how the two energies interact — for example, balancing The Emperor's structure with The High Priestess's stillness — rather than treating one as more important than the other."}},
{"@type":"Question","name":"Which crystals go with my Tarot Birth Cards?","acceptedAnswer":{"@type":"Answer","text":"Each Major Arcana card has traditional crystal correspondences tied to its archetype and theme. Once you know your Birth Cards, you can choose crystals that support those specific energies — a stone that steadies the shadow side of the archetype, or one that amplifies its gifts. This calculator recommends the primary crystal paired with each of your two cards."}}
]}
]}
</script>
<!-- ===== End Tarot Birth Card Calculator ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Tarot Birth Card SEO Accordion ===== -->
<section class="ebc-seo-accordion" aria-label="Tarot birth cards guide">
  <details class="ebc-seo-details">
    <summary>Learn More About Tarot Birth Cards</summary>
    <div class="ebc-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Tarot Birth Card SEO Accordion ===== -->
<style>
.ebc-seo-accordion{margin:32px 0 0}
.ebc-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ebc-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.ebc-seo-details summary::-webkit-details-marker{display:none}
.ebc-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.ebc-seo-details[open] summary:after{content:'-'}
.ebc-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ebc-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.ebc-seo-content h2:first-child{margin-top:0}
.ebc-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.ebc-seo-content p,.ebc-seo-content li{font-size:16px;line-height:1.75}
</style>`;
}

const OUT = path.resolve(__dirname, 'tarot-birth-card.html');
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');
html = html.replace('__EBC_APP_B64__', APP_B64);
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, function (full, open, inner, close) {
  return open + asciiEscape(inner) + close;
});
fs.writeFileSync(OUT, html, 'utf8');
console.log('Tarot Birth Card Calculator generated:', OUT, '|', (fs.statSync(OUT).size / 1024).toFixed(1), 'KB |', CARDS.length, 'cards |', APP_B64.length, 'b64 chars');
