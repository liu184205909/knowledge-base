/**
 * Moon Phase Calendar闁挎稑婀?0闁挎稑顦埀?SunCalc闁告挸绉堕顒傜不濡も偓缂嶅宕滃鍡樼畱闁?闁?闁规亽鍔忓畷妯侯潩鐎涙ɑ鐝?濞寸媭浜滅槐?+ cleansing/闁哄牆鐗愮换宥夋嚂閺傚灝袟 + 4闁烩晛鎽滃▍銊х矓? * 闁藉啯绻冮幑锝夋晬濮濆┄RP闁哄啰鍤処O闁挎稑鑻弫顔界▔閳ь剙顔忛妷銉ュ緮缂佹梻鍋涢幖顪糴raluna(闁哄啰濮炬禒鍫ュ礉?闁靛棗鍊稿Ο濠傤嚕閸屾艾顕ч柨娑欑濠€鈧柣?婵ê鐡ㄥ▍?cleansing(闁哄牆鐗忓ù澶愬礄閳ь剟宕?+闁哄牆鐗愮换?闁哄嫮鍠庢鍥嫉椤掍焦绠?闁哄牆鐗嗙€规娊姊婚鐘茬畾
 * SunCalc CDN闁告挸绉堕顒傜不濡や焦绠戦柣?缂侇喖澧介垾妯尖偓鍦仦濡炲倿寮悤妗篒)闁挎稑鐭侀鐧瑂hared/moon-knowledge.json(4闁烩晛鎲￠幐澶愬疾?濞寸媭浜滅槐?zodiac濞戞挸顭烽。?
 *
 * 閺夊牊鎸搁崵顓㈡晬?/moon-calendar.html
 */
const fs = require('fs');
const path = require('path');

const MK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/moon-knowledge.json'), 'utf8'));
const PHASES = MK.phases;
PHASES.waxing.name = 'Waxing Moon (Crescent -> Gibbous)';
PHASES.waning.name = 'Waning Moon (Gibbous -> Crescent)';
function asciiText(value) {
  if (typeof value === 'string') {
    return value
      .replace(/[–—]/g, '-')
      .replace(/→/g, '->')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");
  }
  if (Array.isArray(value)) return value.map(asciiText);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = asciiText(value[key]);
  }
  return value;
}
asciiText(PHASES);
for (const phase of Object.values(PHASES)) {
  delete phase.icon;
}
const ZODIAC = MK.zodiac_themes;
const PHASE_ORDER = ['new', 'waxing', 'full', 'waning'];
function safeJSON(v){
  return JSON.stringify(v).replace(/<\//g, '<\\/');
}
const PHASES_JSON = safeJSON(PHASES);

let html = `<!-- ===== Earthward Moon Calendar ===== -->
<div id="emc-mc">
  <h1 class="emc-h1">Moon Phase Crystal Calendar</h1>
  <p class="emc-intro">See today's moon phase and the crystals traditionally aligned with it - plus the ritual and intention for this point in the lunar cycle. The moon has guided crystal cleansing and charging practices for centuries; this calendar pairs each phase with the right stones.</p>

  <div class="emc-current" id="emc-current"></div>
  <div class="emc-next" id="emc-next"></div>

  <div class="emc-link-row">
    <a class="emc-link" href="/tools/crystal-cleansing-timer/">Cleansing & charging safety -&gt;</a>
    <a class="emc-link sec" href="/category/zodiac/horoscope/">Your zodiac this month -&gt;</a>
  </div>

  <h2 class="emc-section-title">The Four Moon Phases & Their Crystals</h2>
  <div class="emc-phases" id="emc-phases"></div>
</div>
<style>
.emc-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.emc-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.emc-current{background:#1A1A2E;border-radius:16px;padding:28px;margin-bottom:18px;color:#fff}
.emc-cur-top{display:flex;align-items:center;gap:16px;margin-bottom:14px}
.emc-moon{display:inline-block;width:56px;height:56px;border-radius:50%;background:#f6f0d8;border:1px solid rgba(255,255,255,.45);box-shadow:inset -10px 0 0 rgba(26,26,46,.48),0 0 16px rgba(246,240,216,.22);flex:0 0 auto}
.emc-moon-new{background:#22243a;box-shadow:inset 0 0 0 2px rgba(255,255,255,.15)}
.emc-moon-waxing{background:linear-gradient(90deg,#554577 0 42%,#ffd979 43% 100%);box-shadow:inset -8px 0 0 rgba(255,255,255,.18),0 0 16px rgba(255,217,121,.18)}
.emc-moon-full{background:#f8edc9;box-shadow:0 0 18px rgba(248,237,201,.32)}
.emc-moon-waning{background:linear-gradient(90deg,#ffd979 0 42%,#554577 43% 100%);box-shadow:inset 8px 0 0 rgba(255,255,255,.18),0 0 16px rgba(255,217,121,.18)}
.emc-ph-icon.emc-moon{width:28px;height:28px;box-shadow:inset -5px 0 0 rgba(26,26,46,.38)}
.emc-current .emc-cur-name,.emc-current .emc-cur-name *{font-size:26px;font-weight:700;margin:0;color:#fff !important}
.emc-cur-intent{font-size:15px;color:#fff;margin:4px 0 0}
.emc-cur-energy{font-size:17px;line-height:1.65;color:#fff;margin-bottom:16px}
.emc-cur-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;margin-bottom:8px;opacity:.8}
.emc-cur-crystals{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.emc-crystal{padding:6px 14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:20px;font-size:14px;color:#fff}
.emc-cur-ritual{background:rgba(255,255,255,.06);border-left:3px solid #95B8D1;padding:14px 16px;border-radius:0 8px 8px 0;font-size:16px;line-height:1.6;color:#fff}
.emc-next{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.emc-next-card{flex:1;min-width:200px;background:#F7F3EA;border:1px solid #EEE;border-radius:12px;padding:18px}
.emc-next-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#888;margin-bottom:4px}
.emc-next-date{font-size:18px;font-weight:700;color:#1A1A2E;margin-bottom:4px}
.emc-next-note{font-size:14px;color:#666;line-height:1.5}
.emc-link-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px}
.emc-link{display:inline-block;padding:11px 20px;background:#2D6A4F;color:#fff !important;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600}
.emc-link:hover{background:#1B4332}
.emc-link.sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.emc-section-title{font-size:22px;color:#1A1A2E;margin:0 0 16px;font-weight:700}
.emc-phases{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.emc-phase{background:#fff;border:1px solid #EEE;border-radius:14px;padding:20px}
.emc-ph-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.emc-ph-icon{flex:0 0 auto}
.emc-ph-name{font-size:17px;font-weight:700;color:#1A1A2E}
.emc-ph-intent{font-size:13px;color:#2D6A4F;font-style:italic;margin-bottom:8px}
.emc-ph-crystals{font-size:14px;color:#666;margin-bottom:8px}
.emc-ph-energy{font-size:14px;color:#444;line-height:1.55}
.emc-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:768px){.emc-phases{grid-template-columns:1fr}}
@media(max-width:640px){.emc-h1{font-size:24px}.emc-cur-top{flex-direction:column;text-align:center}.emc-moon{width:48px;height:48px}.emc-ph-icon.emc-moon{width:28px;height:28px}.emc-next{flex-direction:column}}
</style>
<script src="https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js"></script>
<script>
var EWMoon=(function(){
  var P=${PHASES_JSON};
  function phaseKey(frac){
    // Phase fraction: 0=new, 0.5=full.
    if(frac<0.0625||frac>0.9375) return 'new';
    if(frac<0.4375) return 'waxing';
    if(frac<0.5625) return 'full';
    return 'waning';
  }
  function findNext(targetFrac){
    // 闁归潧褰炵粭鍛枎閳╁啫澶嶉弶?targetFrac(0=new,0.5=full)闁汇劌瀚Λ鈺呭嫉閻曞倻绀夐梺顐ｅ姈濡晠骞嶉锝呬紟
    var d=new Date();
    for(var i=0;i<35;i++){
      var dd=new Date(d.getTime()+i*86400000);
      var f=SunCalc.getMoonIllumination(dd).phase;
      var dist=Math.min(Math.abs(f-targetFrac), Math.abs(f-targetFrac+1), Math.abs(f-targetFrac-1));
      if(dist<0.03) return dd;
    }
    return null;
  }
  function fmtDate(d){
    if(!d) return '-';
    return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  }
  function init(){
    var now=new Date();
    var illum=SunCalc.getMoonIllumination(now);
    var key=phaseKey(illum.phase);
    var ph=P[key];
    // Render current phase.
    var cur=document.getElementById('emc-current');
    cur.innerHTML='<div class="emc-cur-top"><span class="emc-cur-icon emc-moon emc-moon-'+key+'" aria-hidden="true"></span><div><h2 class="emc-cur-name">'+ph.name+' (Now)</h2><div class="emc-cur-intent">'+ph.intention+'</div></div></div>'
      +'<p class="emc-cur-energy">'+ph.energy+'</p>'
      +'<div class="emc-cur-label">Crystals for this phase</div><div class="emc-cur-crystals">'+ph.crystals.map(function(c){return '<span class="emc-crystal">'+c+'</span>';}).join('')+'</div>'
      +'<div class="emc-cur-label">Ritual</div><div class="emc-cur-ritual">'+ph.ritual+'</div>';
    // Render upcoming full and new moon dates.
    var nextFull=findNext(0.5);
    var nextNew=findNext(0);
    document.getElementById('emc-next').innerHTML=
      '<div class="emc-next-card"><div class="emc-next-label">Next Full Moon</div><div class="emc-next-date">'+fmtDate(nextFull)+'</div><div class="emc-next-note">Best night to cleanse & charge crystals in moonlight.</div></div>'
      +'<div class="emc-next-card"><div class="emc-next-label">Next New Moon</div><div class="emc-next-date">'+fmtDate(nextNew)+'</div><div class="emc-next-note">Time to set fresh crystal-charged intentions.</div></div>';
    // Render the four phase cards.
    var div=document.getElementById('emc-phases');
    div.innerHTML=['new','waxing','full','waning'].map(function(k){
      var p=P[k];
      return '<div class="emc-phase'+(k===key?' emc-phase-now':'')+'"><div class="emc-ph-head"><span class="emc-ph-icon emc-moon emc-moon-'+k+'" aria-hidden="true"></span><span class="emc-ph-name">'+p.name+'</span></div>'
        +'<div class="emc-ph-intent">'+p.intention+'</div>'
        +'<div class="emc-ph-crystals"><strong>Crystals:</strong> '+p.crystals.join(', ')+'</div>'
        +'<div class="emc-ph-energy">'+p.energy+'</div></div>';
    }).join('');
  }
  return{init:init};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWMoon.init);}else{EWMoon.init();}
</script>
<!-- ===== Moon Calendar Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"When should I cleanse my crystals with moonlight?","acceptedAnswer":{"@type":"Answer","text":"The full moon is the most popular time to cleanse and charge crystals in moonlight 闁?place them on a windowsill or covered porch from sunset to sunrise. Moonlight is safe for every crystal and carries no UV risk. The new moon is a quieter alternative for setting fresh intentions."}},{"@type":"Question","name":"Which crystals are best for the full moon?","acceptedAnswer":{"@type":"Answer","text":"Selenite, clear quartz, amethyst, and moonstone are traditionally associated with full-moon energy. Selenite and clear quartz are also self-cleansing stones often used to charge other crystals placed near them."}},{"@type":"Question","name":"What do I do during a new moon with crystals?","acceptedAnswer":{"@type":"Answer","text":"The new moon is traditionally a time to set intentions and new beginnings. Hold a moonstone or clear quartz, state your goal aloud, and place the crystal overnight to 'charge' your intention. It's a quieter, lower-energy phase good for clarifying what you want to call in."}},{"@type":"Question","name":"Does the moon phase really affect crystals?","acceptedAnswer":{"@type":"Answer","text":"There is no scientific evidence that moon phase changes a crystal's physical properties. The practice comes from centuries of cultural and spiritual tradition. Many people find it a meaningful rhythm for cleansing, charging, and intention-setting rituals."}}]}
]}
</script>
<!-- ===== End Moon Calendar ===== -->`;

// SEO 闁硅埖锚瑜版棃姊归幐搴㈢€?
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Moon Calendar SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Moon Phases & Crystals</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Moon Calendar SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'moon-calendar.html');
html = html
  .split(String.fromCharCode(0x9225) + '?').join('-')
  .split(String.fromCharCode(0x9225)).join('-')
  .split(String.fromCharCode(0x922b) + '?').join('->')
  .split(String.fromCharCode(0x922b)).join('->')
  .replace(/\u9225.?/g, '-')
  .replace(/\u922b.?/g, '->')
  .replace(/鈥\?/g, '-')
  .replace(/鈥/g, '-')
  .replace(/鈫\?/g, '->')
  .replace(/鈫/g, '->')
  .replace(/馃寫|馃寎|馃寑|馃寏|倮惠/g, '');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`闁?Moon Calendar 闁汇垻鍠愰崹姘扁偓鐟版湰閸?闁?${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | SunCalc闁告挸绉堕顒勫嫉閸垺绁?| 4闁烩晛鎽滃▍銊х矓?+ cleansing/闁哄牆鐗愮换宥夋嚂閺傚灝袟`);
