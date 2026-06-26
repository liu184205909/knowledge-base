/**
 * 生成 Zodiac Compatibility Checker 独立页面
 * 只有星座选择器 + Tab B 结果渲染（5 张卡）
 *
 * 输出：./zodiac-checker.html（同目录 build/）
 */
const fs = require('fs');
const path = require('path');

// 数据源：zodiac-matrix.json（由 generate-matrix.js 从共享 crystal-attributes 生成，摆脱旧 compatibility-tool.html 依赖）
const ZM_DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/zodiac-matrix.json'), 'utf8'));
const ZM = ZM_DATA.matrix;
const ZM_JSON = JSON.stringify(ZM);

const ZODIAC_SEO_CONTENT = `
<h2>What Is Zodiac Compatibility?</h2>
<p>Zodiac compatibility compares two signs by element, modality, aspect, and relationship dynamics. This checker focuses on the practical side: how two signs connect, where tension may appear, and which crystal pair can support the relationship.</p>
<h2>How the Zodiac Compatibility Checker Works</h2>
<p>Choose any two zodiac signs and the tool returns a compatibility score, a short relationship theme, a crystal pairing for both partners, and a deeper relationship insight. The score is a quick summary, while the text explains the emotional pattern behind it.</p>
<h2>How to Use the Crystal Pair</h2>
<p>Use the suggested stones as a simple relationship ritual. Each partner can wear their own sign stone, while the harmonizer stone can be placed in a shared space, used during meditation, or kept near a bedside or desk.</p>
<h2>Frequently Asked Questions</h2>
<h3>Are low zodiac compatibility scores bad?</h3>
<p>No. A lower score usually means the relationship requires more awareness and communication. It can still be meaningful, magnetic, and growth-oriented.</p>
<h3>Can any zodiac signs work together?</h3>
<p>Yes. Astrology describes tendencies, not fixed outcomes. Communication, maturity, shared values, and timing matter more than a score.</p>`;

let zodiacHTML = `<!-- ===== Earthward Zodiac Compatibility Checker ===== -->
<div id="ew-zodiac">
  <h1 class="ewz-h1">Zodiac Compatibility Checker</h1>
  <p class="ewz-intro">How compatible are your zodiac signs? Pick two signs to see your compatibility score, the best crystal pair for the relationship, and a deeper look at how you connect.</p>
  <div class="ewz-panel">
    <div class="ewz-grid" id="ewz-zodiac-grid"></div>
    <p class="ewz-hint">Select two signs</p>
    <button class="ewz-btn" id="ewz-analyze" disabled onclick="EWZodiac.analyze()">Check Compatibility</button>
  </div>
  <div class="ewz-result" id="ewz-result"></div>
</div>
<style>
.ewz-h1{font-size:32px;color:#1A1A2E;margin:0 0 10px;font-weight:700;line-height:1.2}.ewz-intro{color:#444;font-size:16px;line-height:1.6;margin:0 0 24px;max-width:720px}
.ewz-panel{background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:16px;box-sizing:border-box}
.ewz-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.ewz-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border:1px solid #EEE;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}.ewz-chip:hover{border-color:#95D5B2}.ewz-chip.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}.ewz-chip .sym{font-size:24px;color:#2D6A4F;font-weight:700}.ewz-chip .nm{font-size:12px;color:#444}
.ewz-hint{color:#666;font-size:13px;margin:8px 0 8px;text-align:center}
.ewz-btn{display:block;width:100%;padding:12px;background:#2D6A4F;color:#fff !important;border:none;border-radius:10px;font-size:15px;cursor:pointer}.ewz-btn:hover{background:#1B4332;color:#fff !important}.ewz-btn:disabled{background:#CCC;color:#666 !important;cursor:not-allowed}
.ewz-result{margin-top:40px;display:none}.ewz-result.show{display:block}
.ewz-card{background:#FAFAFA;border:1px solid #E8E8E8;border-radius:12px;padding:18px;margin-bottom:12px}
.ewz-result-top,.ewz-result-pairing{display:grid !important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin-bottom:12px;align-items:stretch}
.ewz-result-top .ewz-card,.ewz-result-pairing .ewz-card{margin:0}
.ewz-score-card{display:flex;align-items:center;justify-content:center}
.ewz-cta-card{display:flex;flex-direction:column;justify-content:center;gap:14px}
.ewz-score-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}.ewz-ring{position:relative;width:130px;height:130px}.ewz-ring svg{transform:rotate(-90deg)}.ewz-ring .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.ewz-ring .num b{font-size:34px;color:#1A1A2E;line-height:1}.ewz-ring .num span{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.ewz-pair{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}.ewz-pair .p{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600}
.ewz-lead{font-size:20px;color:#1A1A2E;font-weight:600;margin:0 0 6px}.ewz-leadband{font-size:14px;color:#A66A43;font-weight:600}
.ewz-narr{font-size:15px;color:#444;line-height:1.55;margin:8px 0 0}
.ewz-h{font-size:18px;color:#1A1A2E;margin:0 0 8px}
.ewz-reason{list-style:none;padding:0;margin:0}.ewz-reason li{padding:3px 0;font-size:14px;line-height:1.45;color:#444;display:flex;gap:8px}.ewz-reason .pos{color:#2D6A4F;font-weight:700}
.ewz-cp{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ewz-cp-s{background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:10px 8px;text-align:center}.ewz-cp-s b{display:block;color:#1B4332;font-size:15px;margin-bottom:2px;line-height:1.3}.ewz-cp-s span{color:#888;font-size:12px;line-height:1.35}.ewz-cp-h{background:#F0F7F4;border-color:#95D5B2}
.ewz-ins{font-size:14px;color:#444;line-height:1.55;margin:6px 0}.ewz-ins b{color:#1A1A2E;font-weight:600}
.ewz-cta{display:block;text-align:center;background:#2D6A4F;color:#fff !important;padding:12px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;margin-top:4px}.ewz-cta:hover{background:#1B4332;color:#fff !important}
.ewz-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}.ewz-actions button{padding:8px 16px;background:#fff;border:1px solid #DDD;border-radius:8px;color:#444;cursor:pointer;font-size:13px}
.ewz-seo-accordion{max-width:1220px;margin:32px auto 0}.ewz-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}.ewz-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;box-shadow:inset 0 -1px 0 rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.08)}.ewz-seo-details summary::-webkit-details-marker{display:none}.ewz-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}.ewz-seo-details[open] summary:after{content:'-'}.ewz-seo-content{padding:24px 28px;color:#444;font-size:15px;line-height:1.75}.ewz-seo-content h2{color:#1A1A2E;font-size:26px;margin:28px 0 12px}.ewz-seo-content h3{color:#1A1A2E;font-size:20px;margin:22px 0 10px}.ewz-seo-content p{font-size:15px;line-height:1.75}
@media(max-width:640px){.ewz-h1{font-size:28px}.ewz-intro{font-size:15px;margin-bottom:18px}.ewz-panel{padding:14px}.ewz-grid{grid-template-columns:repeat(3,1fr);gap:8px}.ewz-chip{padding:9px 4px}.ewz-chip .sym{font-size:22px}.ewz-result-top,.ewz-result-pairing{grid-template-columns:1fr}.ewz-card{padding:16px}.ewz-ring{width:118px;height:118px}.ewz-ring svg{width:118px;height:118px}.ewz-ring .num b{font-size:30px}.ewz-cp{grid-template-columns:1fr}.ewz-seo-details summary{font-size:16px;padding:16px}.ewz-seo-content{padding:18px}}
</style>
<script>
var EWZodiac=(function(){
  var ZM=${ZM_JSON};
  var ORDER=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  var ZLAB={aries:'\\u2648 Aries',taurus:'\\u2649 Taurus',gemini:'\\u264a Gemini',cancer:'\\u264b Cancer',leo:'\\u264c Leo',virgo:'\\u264d Virgo',libra:'\\u264e Libra',scorpio:'\\u264f Scorpio',sagittarius:'\\u2650 Sagittarius',capricorn:'\\u2651 Capricorn',aquarius:'\\u2652 Aquarius',pisces:'\\u2653 Pisces'};
  var sel=[];
  function color(s){return s>=70?'#2D6A4F':s>=40?'#A66A43':'#B5715A';}
  function cap(s){return s?s.split('-').map(function(w){return w[0].toUpperCase()+w.slice(1);}).join(' '):'';}
  function init(){var g=document.getElementById('ewz-zodiac-grid');g.innerHTML='';ORDER.forEach(function(z){var c=document.createElement('div');c.className='ewz-chip'+(sel.indexOf(z)>=0?' sel':'');c.dataset.z=z;c.innerHTML='<div class="sym">'+ZLAB[z].slice(0,1)+'</div><div class="nm">'+ZLAB[z].slice(2)+'</div>';c.onclick=function(){toggle(z);};g.appendChild(c);});}
  function toggle(z){var i=sel.indexOf(z);if(i>=0)sel.splice(i,1);else{if(sel.length>=2)sel.shift();sel.push(z);}document.querySelectorAll('#ewz-zodiac-grid .ewz-chip').forEach(function(c){c.classList.toggle('sel',sel.indexOf(c.dataset.z)>=0);});document.getElementById('ewz-analyze').disabled=sel.length<2;}
  function analyze(){
    if(sel.length<2)return;
    var a=sel[0],b=sel[1];
    var key=ORDER.indexOf(a)<=ORDER.indexOf(b)?a+'-'+b:b+'-'+a;
    var m=ZM[key];if(!m)return;
    var r=document.getElementById('ewz-result');var c=color(m.score);var C=2*Math.PI*55;var off=C*(1-m.score/100);
    var ctaUrl='/zodiac-compatibility/'+(sel.slice().sort().join('-'))+'/';
    var html='<div class="ewz-result-top">';
    html+='<div class="ewz-card ewz-score-card"><div class="ewz-score-wrap"><div class="ewz-ring"><svg width="130" height="130"><circle cx="65" cy="65" r="55" stroke="#EEE" stroke-width="10" fill="none"/><circle cx="65" cy="65" r="55" stroke="'+c+'" stroke-width="10" fill="none" stroke-dasharray="'+C+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="num"><b>'+m.score+'</b><span>'+m.band+'</span></div></div><div class="ewz-pair"><span class="p">'+cap(m.signs[0])+'</span><span class="p">'+cap(m.signs[1])+'</span></div></div></div>';
    html+='<div class="ewz-card ewz-cta-card"><div class="ewz-lead">'+m.headline+'</div><div class="ewz-leadband">'+m.band+' \\u00b7 '+cap(m.crystals.signA)+' + '+cap(m.crystals.signB)+'</div><a class="ewz-cta" href="'+ctaUrl+'">Read the Full Pairing Guide \\u2192</a></div>';
    html+='</div>';
    html+='<div class="ewz-card"><h3 class="ewz-h">Relationship Snapshot</h3><p class="ewz-narr">'+m.description+'</p></div>';
    html+='<div class="ewz-result-pairing">';
    if(m.phase||m.dynamics){html+='<div class="ewz-card"><h3 class="ewz-h">Why This Pairing</h3><ul class="ewz-reason">';if(m.phase)html+='<li><span class="pos">\\u2726</span><span>'+m.phase+' \\u2014 '+m.band+' ('+m.score+'/100)</span></li>';if(m.dynamics)html+='<li><span class="pos">\\u2726</span><span>'+m.dynamics+'</span></li>';html+='</ul></div>';}
    if(m.crystals){html+='<div class="ewz-card"><h3 class="ewz-h">Crystal Pair for This Couple</h3><div class="ewz-cp"><div class="ewz-cp-s"><b>'+cap(m.crystals.signA)+'</b><span>For '+m.signs[0]+'</span></div><div class="ewz-cp-s"><b>'+cap(m.crystals.signB)+'</b><span>For '+m.signs[1]+'</span></div><div class="ewz-cp-s ewz-cp-h"><b>'+cap(m.crystals.harmony)+'</b><span>Harmonizer</span></div></div></div>';}
    html+='</div>';
    if(m.coreChallenge||m.synergy||m.communicationPattern){html+='<div class="ewz-card"><h3 class="ewz-h">Relationship Insight</h3>';if(m.coreChallenge)html+='<p class="ewz-ins"><b>The challenge \\u2014</b> '+m.coreChallenge+'</p>';if(m.synergy)html+='<p class="ewz-ins"><b>The synergy \\u2014</b> '+m.synergy+'</p>';if(m.communicationPattern)html+='<p class="ewz-ins"><b>How they talk \\u2014</b> '+m.communicationPattern+'</p>';html+='</div>';}
    html+='<div class="ewz-actions"><button onclick="EWZodiac.reset()">Try Another</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)">Copy Link</button></div>';
    r.innerHTML=html;r.classList.add('show');var offset=window.innerWidth<768?96:150;var y=r.getBoundingClientRect().top+window.pageYOffset-offset;window.scrollTo({top:y,behavior:'smooth'});
  }
  function reset(){sel=[];init();document.getElementById('ewz-result').classList.remove('show');document.getElementById('ewz-analyze').disabled=true;}
  return{init:init,analyze:analyze,reset:reset};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWZodiac.init);}else{EWZodiac.init();}
</script>
<!-- ===== End Zodiac Compatibility Checker ===== -->`;

zodiacHTML += `
<!-- ===== Zodiac Compatibility SEO Accordion ===== -->
<section class="ewz-seo-accordion" aria-label="Zodiac compatibility guide">
  <details class="ewz-seo-details">
    <summary>Learn More About Zodiac Compatibility</summary>
    <div class="ewz-seo-content">
${ZODIAC_SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Zodiac Compatibility SEO Accordion ===== -->`;

const OUT = path.resolve(__dirname, 'zodiac-checker.html');
fs.writeFileSync(OUT, zodiacHTML, 'utf8');
console.log(`✅ Zodiac Checker 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`   ${Object.keys(ZM).length} 组星座配对数据`);
