/**
 * 生成 Zodiac Compatibility Checker 独立页面
 * 只有星座选择器 + Tab B 结果渲染（5 张卡）
 *
 * 输出：../zodiac-checker.html
 */
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.resolve(__dirname, '../compatibility-tool.html');
const html = fs.readFileSync(HTML_FILE, 'utf8');
const dMatch = html.match(/const D=(\{[\s\S]*?\});/);
const D = eval('(' + dMatch[1] + ')');
const ZM = D.ZM;
const ZM_JSON = JSON.stringify(ZM);

const zodiacHTML = `<!-- ===== Earthward Zodiac Compatibility Checker ===== -->
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
.ewz-panel{background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:20px}
.ewz-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.ewz-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 6px;border:1px solid #EEE;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}.ewz-chip:hover{border-color:#95D5B2}.ewz-chip.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}.ewz-chip .sym{font-size:24px;color:#2D6A4F;font-weight:700}.ewz-chip .nm{font-size:12px;color:#444}
.ewz-hint{color:#666;font-size:13px;margin:14px 0 10px;text-align:center}
.ewz-btn{display:block;width:100%;padding:14px;background:#2D6A4F;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer}.ewz-btn:hover{background:#1B4332}.ewz-btn:disabled{background:#CCC;cursor:not-allowed}
.ewz-result{margin-top:24px;display:none}.ewz-result.show{display:block}
.ewz-card{background:#fff;border:1px solid #EEE;border-radius:12px;padding:24px;margin-bottom:16px}
.ewz-score-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}.ewz-ring{position:relative;width:160px;height:160px}.ewz-ring svg{transform:rotate(-90deg)}.ewz-ring .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.ewz-ring .num b{font-size:40px;color:#1A1A2E;line-height:1}.ewz-ring .num span{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.ewz-pair{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}.ewz-pair .p{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600}
.ewz-lead{font-size:20px;color:#1A1A2E;font-weight:600;margin:0 0 6px}.ewz-leadband{font-size:14px;color:#A66A43;font-weight:600}
.ewz-narr{font-size:15px;color:#444;line-height:1.7;margin:14px 0 0}
.ewz-h{font-size:18px;color:#1A1A2E;margin:0 0 12px}
.ewz-reason{list-style:none;padding:0;margin:0}.ewz-reason li{padding:6px 0;font-size:14px;color:#444;display:flex;gap:8px}.ewz-reason .pos{color:#2D6A4F;font-weight:700}
.ewz-cp{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.ewz-cp-s{background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:14px 10px;text-align:center}.ewz-cp-s b{display:block;color:#1B4332;font-size:15px;margin-bottom:4px}.ewz-cp-s span{color:#888;font-size:12px}.ewz-cp-h{background:#F0F7F4;border-color:#95D5B2}
.ewz-ins{font-size:14px;color:#444;line-height:1.7;margin:10px 0}.ewz-ins b{color:#1A1A2E;font-weight:600}
.ewz-cta{display:block;text-align:center;background:#2D6A4F;color:#fff;padding:14px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600;margin-top:4px}.ewz-cta:hover{background:#1B4332}
.ewz-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}.ewz-actions button{padding:8px 16px;background:#fff;border:1px solid #DDD;border-radius:8px;color:#444;cursor:pointer;font-size:13px}
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
    var r=document.getElementById('ewz-result');var c=color(m.score);var C=2*Math.PI*70;var off=C*(1-m.score/100);
    var html='<div class="ewz-card"><div class="ewz-score-wrap"><div class="ewz-ring"><svg width="160" height="160"><circle cx="80" cy="80" r="70" stroke="#EEE" stroke-width="12" fill="none"/><circle cx="80" cy="80" r="70" stroke="'+c+'" stroke-width="12" fill="none" stroke-dasharray="'+C+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="num"><b>'+m.score+'</b><span>'+m.band+'</span></div></div><div class="ewz-pair"><span class="p">'+cap(m.signs[0])+'</span><span class="p">'+cap(m.signs[1])+'</span></div></div></div>';
    /* Narrative */
    html+='<div class="ewz-card"><div class="ewz-lead">'+m.headline+'</div><div class="ewz-leadband">'+m.band+' \\u00b7 '+cap(m.crystals.signA)+' + '+cap(m.crystals.signB)+'</div><p class="ewz-narr">'+m.desc+'</p></div>';
    /* Crystal Pair */
    if(m.crystals){html+='<div class="ewz-card"><h3 class="ewz-h">Crystal Pair for This Couple</h3><div class="ewz-cp"><div class="ewz-cp-s"><b>'+cap(m.crystals.signA)+'</b><span>For '+m.signs[0]+'</span></div><div class="ewz-cp-s"><b>'+cap(m.crystals.signB)+'</b><span>For '+m.signs[1]+'</span></div><div class="ewz-cp-s ewz-cp-h"><b>'+cap(m.crystals.harmony)+'</b><span>Harmonizer</span></div></div></div>';}
    /* Why This Pairing */
    if(m.phase||m.dynamics){html+='<div class="ewz-card"><h3 class="ewz-h">Why This Pairing</h3><ul class="ewz-reason">';if(m.phase)html+='<li><span class="pos">\\u2726</span><span>'+m.phase+' \\u2014 '+m.band+' ('+m.score+'/100)</span></li>';if(m.dynamics)html+='<li><span class="pos">\\u2726</span><span>'+m.dynamics+'</span></li>';html+='</ul></div>';}
    /* Relationship Insight */
    if(m.coreChallenge||m.synergy||m.communicationPattern){html+='<div class="ewz-card"><h3 class="ewz-h">Relationship Insight</h3>';if(m.coreChallenge)html+='<p class="ewz-ins"><b>The challenge \\u2014</b> '+m.coreChallenge+'</p>';if(m.synergy)html+='<p class="ewz-ins"><b>The synergy \\u2014</b> '+m.synergy+'</p>';if(m.communicationPattern)html+='<p class="ewz-ins"><b>How they talk \\u2014</b> '+m.communicationPattern+'</p>';html+='</div>';}
    /* CTA */
    var ctaUrl='/zodiac-compatibility/'+(sel.slice().sort().join('-'))+'/';
    html+='<a class="ewz-cta" href="'+ctaUrl+'">Read the Full Pairing Guide \\u2192</a><div class="ewz-actions"><button onclick="EWZodiac.reset()">Try Another</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)">Copy Link</button></div>';
    r.innerHTML=html;r.classList.add('show');r.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){sel=[];init();document.getElementById('ewz-result').classList.remove('show');document.getElementById('ewz-analyze').disabled=true;}
  return{init:init,analyze:analyze,reset:reset};
})();
document.addEventListener('DOMContentLoaded',EWZodiac.init);
</script>
<!-- ===== End Zodiac Compatibility Checker ===== -->`;

const OUT = path.resolve(__dirname, '../zodiac-checker.html');
fs.writeFileSync(OUT, zodiacHTML, 'utf8');
console.log(`✅ Zodiac Checker 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`   ${Object.keys(ZM).length} 组星座配对数据`);
