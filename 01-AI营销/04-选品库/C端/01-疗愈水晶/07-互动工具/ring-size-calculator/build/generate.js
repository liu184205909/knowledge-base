/**
 * 生成 Ring Size Calculator（R）— Crystal Ring Sizing & Buying Guide
 * 复用 T1 范式，逻辑独立：方式切换（手指周长 / 现有戒指内径）→ US 号 + EU/HK/CN 转换
 * 独特价值：国际尺码转换表（US/EU/港度/CN）
 *
 * 输出：./ring-size-calculator.html
 * Usage: node generate.js
 */
const fs = require('fs');
const path = require('path');

// ===== 戒指尺码表（US 含半号 / EU / 港度 HK / CN / 内径 dia mm / 内周长 cir mm）=====
const RING_SIZES = [
  { us: 3,    eu: 44,   hk: 6,   cn: 4,    dia: 14.0, cir: 44.0 },
  { us: 3.5,  eu: 45.5, hk: 7,   cn: 4.5,  dia: 14.4, cir: 45.2 },
  { us: 4,    eu: 47,   hk: 8,   cn: 5,    dia: 14.8, cir: 46.5 },
  { us: 4.5,  eu: 48.5, hk: 8.5, cn: 5.5,  dia: 15.2, cir: 47.8 },
  { us: 5,    eu: 49,   hk: 10,  cn: 6,    dia: 15.7, cir: 49.3 },
  { us: 5.5,  eu: 50.5, hk: 11,  cn: 6.5,  dia: 16.1, cir: 50.6 },
  { us: 6,    eu: 52,   hk: 12,  cn: 7,    dia: 16.5, cir: 51.9 },
  { us: 6.5,  eu: 53,   hk: 13,  cn: 7.5,  dia: 16.9, cir: 53.1 },
  { us: 7,    eu: 54,   hk: 14,  cn: 8,    dia: 17.3, cir: 54.4 },
  { us: 7.5,  eu: 55.5, hk: 15,  cn: 8.5,  dia: 17.7, cir: 55.7 },
  { us: 8,    eu: 57,   hk: 16,  cn: 9,    dia: 18.1, cir: 56.9 },
  { us: 8.5,  eu: 58.5, hk: 17,  cn: 9.5,  dia: 18.5, cir: 58.2 },
  { us: 9,    eu: 59,   hk: 18,  cn: 10,   dia: 19.0, cir: 59.7 },
  { us: 9.5,  eu: 60.5, hk: 19,  cn: 10.5, dia: 19.4, cir: 60.9 },
  { us: 10,   eu: 62,   hk: 20,  cn: 11,   dia: 19.8, cir: 62.2 },
  { us: 10.5, eu: 63.5, hk: 21,  cn: 11.5, dia: 20.2, cir: 63.5 },
  { us: 11,   eu: 64,   hk: 22,  cn: 12,   dia: 20.6, cir: 64.7 },
  { us: 11.5, eu: 65.5, hk: 23,  cn: 12.5, dia: 21.0, cir: 65.9 },
  { us: 12,   eu: 67,   hk: 24,  cn: 13,   dia: 21.4, cir: 67.2 },
  { us: 13,   eu: 69,   hk: 26,  cn: 14,   dia: 22.2, cir: 69.7 },
];

// 找最接近的尺码（按 field: cir 周长 或 dia 内径）
function findSize(mm, field) {
  return RING_SIZES.reduce((best, s) => Math.abs(s[field] - mm) < Math.abs(best[field] - mm) ? s : best);
}

const RING_JSON = JSON.stringify(RING_SIZES);

// 测量方法图（base64 内联，由 generate-ring-images.js 生成）
function imgData(name) {
  const p = path.resolve(__dirname, 'images/measure-' + name + '.webp');
  if (!fs.existsSync(p)) return '';
  return 'data:image/webp;base64,' + fs.readFileSync(p).toString('base64');
}
const IMG_FINGER = imgData('finger');
const IMG_RING = imgData('ring');
const IMG_SIZER = imgData('sizer');

let html = `<!-- ===== Earthward Crystal Ring Sizing & Buying Guide ===== -->
<div id="ew-ring">
  <h1 class="ewr-h1">Crystal Ring Sizing & Buying Guide</h1>
  <p class="ewr-intro">Find your ring size in two minutes. Measure your finger or an existing ring, and we'll convert it to US, EU, Hong Kong, and Chinese sizes — so any crystal ring you love fits.</p>

  <!-- S3 计算器（核心）-->
  <div class="ewr-calc">
    <h2 class="ewr-h2">Ring Size Calculator</h2>
    <div class="ewr-method-toggle">
      <button class="ewr-mbtn sel" id="ewr-m-cir" onclick="EWRing.setMethod('cir')">Measure finger circumference</button>
      <button class="ewr-mbtn" id="ewr-m-dia" onclick="EWRing.setMethod('dia')">Measure an existing ring</button>
    </div>
    <div class="ewr-field">
      <label class="ewr-label" id="ewr-input-label">Your finger circumference (mm)</label>
      <div class="ewr-input-row">
        <input class="ewr-input" id="ewr-mm" type="number" min="40" max="80" step="0.1" placeholder="e.g. 54" oninput="EWRing.maybeCalc()">
        <span class="ewr-unit-label">mm</span>
      </div>
      <p class="ewr-hint" id="ewr-input-hint">Wrap a paper strip around the widest part of your finger (the knuckle), mark, lay flat against a ruler.</p>
    </div>
    <div class="ewr-result" id="ewr-result"></div>
  </div>

  <!-- S1 为什么尺寸重要 -->
  <section class="ewr-sec">
    <h2 class="ewr-h2">Why Ring Size Matters (More Than Bracelets)</h2>
    <p>A ring is the one piece of jewelry you can't just stretch or clip. Unlike an elastic crystal bracelet with give in the cord, a ring is rigid — get it wrong by even half a size and it either won't go over your knuckle or spins loosely all day. Resizing a beaded or crystal ring is often impossible without re-making the whole piece.</p>
    <p>That makes measuring correctly <strong>before</strong> you buy essential. The good news: it's a one-time measurement that works for every ring you'll ever own.</p>
  </section>

  <!-- S2 测量方法（图占位）-->
  <section class="ewr-sec">
    <h2 class="ewr-h2">How to Measure Your Ring Size</h2>
    <p class="ewr-muted">Three reliable methods. Measure at the end of the day when fingers are warm (cold fingers measure smaller).</p>
    <div class="ewr-methods">
      <div class="ewr-method">
        <div class="ewr-method-img">${IMG_FINGER ? '<img src="' + IMG_FINGER + '" alt="Measure finger with a paper strip">' : ''}<span class="ewr-method-cap">Paper strip around finger</span></div>
        <p>Wrap a thin paper strip around the widest part of your finger (usually the knuckle), mark the overlap, measure the length in mm — that's your circumference.</p>
      </div>
      <div class="ewr-method">
        <div class="ewr-method-img">${IMG_RING ? '<img src="' + IMG_RING + '" alt="Measure an existing ring inner diameter">' : ''}<span class="ewr-method-cap">Measure an existing ring</span></div>
        <p>Lay a ring that fits perfectly flat. Measure the <em>inner</em> diameter across the center in mm. This is the most accurate method if you already own a well-fitting ring.</p>
      </div>
      <div class="ewr-method">
        <div class="ewr-method-img">${IMG_SIZER ? '<img src="' + IMG_SIZER + '" alt="Ring sizer tool">' : ''}<span class="ewr-method-cap">Ring sizer tool</span></div>
        <p>For frequent ring shoppers, a plastic multi-size ring sizer ($2–3 online) gives you a direct US size read with zero math.</p>
      </div>
    </div>
  </section>

  <!-- S4 国际尺码转换表（戒指独特价值）-->
  <section class="ewr-sec">
    <h2 class="ewr-h2">Ring Size Conversion Chart (US / EU / HK / CN)</h2>
    <p>Shopping internationally or buying from an Asian brand? Use this full conversion. Hong Kong (港度) and Chinese sizes are common for crystal jewelry from Eastern makers.</p>
    <div class="ewr-table-wrap">
      <table class="ewr-table">
        <thead><tr><th>US</th><th>EU</th><th>港度 HK</th><th>CN 中国</th><th>Inner diameter</th><th>Inner circumference</th></tr></thead>
        <tbody>
          ${RING_SIZES.filter(s => Number.isInteger(s.us)).map(s => `<tr><td><b>${s.us}</b></td><td>${s.eu}</td><td>${s.hk}</td><td>${s.cn}</td><td>${s.dia} mm</td><td>${s.cir} mm</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>

  <!-- S5 产品 -->
  <section class="ewr-sec ewr-shop-cta">
    <h2 class="ewr-h2">Shop Crystal Rings</h2>
    <p>Once you know your size, explore our crystal rings and copper jewelry.</p>
    <a class="ewr-btn-primary" href="/product-category/healing-crystals-jewelry/">Shop Healing Crystal Jewelry →</a>
    <a class="ewr-btn-ghost" href="/product-category/copper-jewelry/">Shop Copper Jewelry →</a>
  </section>

  <!-- S6 FAQ -->
  <section class="ewr-sec">
    <h2 class="ewr-h2">Ring Sizing FAQ</h2>
    <details class="ewr-faq"><summary>My measurement falls between two sizes — which do I pick?</summary><p>Always size <strong>up</strong> to the half or full size. A ring needs to clear your knuckle going on; slightly loose is far more comfortable than too tight, and knuckle fit is what actually determines whether you can get it on.</p></details>
    <details class="ewr-faq"><summary>How do wide ring bands affect sizing?</summary><p>Wide bands (6 mm+) sit on more finger surface and feel snugger. For wide-band crystal rings, go up about a quarter to half size from your standard measurement. Thin bands (2–4 mm) use your true size.</p></details>
    <details class="ewr-faq"><summary>My fingers change size during the day — when should I measure?</summary><p>Measure at the end of the day, when your hands are warm and fingers are at their largest. Morning or cold hands can read ½ size small. Avoid measuring right after exercise or salt-heavy meals.</p></details>
    <details class="ewr-faq"><summary>Are US and Hong Kong ring sizes the same?</summary><p>No. Hong Kong sizes (港度) run on a different scale — HK 10 ≈ US 5, HK 14 ≈ US 7. Always cross-check with the conversion chart above when buying from Eastern jewelers, or you'll get the wrong fit.</p></details>
    <details class="ewr-faq"><summary>Which finger is "size 7"?</summary><p>There's no fixed finger-to-size — the same finger varies person to person. But as a rough average: US 5–6 fits many women's ring fingers, US 7–8 the middle finger or a larger ring finger, and US 9–10 an average man's ring finger. Measure your own to be sure.</p></details>
  </section>

  <!-- S7 CTA -->
  <section class="ewr-sec ewr-feedback">
    <h2 class="ewr-h2">Found Your Size?</h2>
    <p>Crystal rings make meaningful gifts — bookmark your size and the conversion chart, or share with someone shopping for you.</p>
    <a class="ewr-btn-primary" href="/product-category/healing-crystals-jewelry/">Shop Crystal Rings →</a>
  </section>
</div>
<style>
.ewr-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ewr-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ewr-h2{font-size:24px;color:#1A1A2E;margin:0 0 14px;font-weight:700}
.ewr-calc{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:26px;margin:0 0 36px}
.ewr-method-toggle{display:flex;gap:8px;margin-bottom:18px;background:#fff;border:1px solid #EEE;border-radius:10px;padding:5px}
.ewr-mbtn{flex:1;padding:11px;background:transparent;border:none;cursor:pointer;font-size:14px;color:#666;border-radius:7px;font-weight:600}
.ewr-mbtn.sel{background:#2D6A4F;color:#fff}
.ewr-field{margin-bottom:8px}
.ewr-label{display:block;font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.ewr-input-row{display:flex;gap:10px;align-items:center}
.ewr-input{flex:1;max-width:240px;padding:13px 14px;border:1px solid #DDD;border-radius:10px;font-size:16px;background:#fff;box-sizing:border-box}
.ewr-input:focus{outline:none;border-color:#2D6A4F;box-shadow:0 0 0 3px #2D6A4F22}
.ewr-unit-label{color:#888;font-size:15px;font-weight:600}
.ewr-hint{color:#888;font-size:13px;margin:10px 0 0;line-height:1.5}
.ewr-result{margin-top:14px;display:none}
.ewr-result.show{display:block}
.ewr-result-card{background:#fff;border:1px solid #2D6A4F33;border-radius:12px;padding:20px}
.ewr-result-head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #EEE}
.ewr-r-us{font-size:42px;color:#2D6A4F;font-weight:700;line-height:1}
.ewr-r-us span{font-size:14px;color:#888;font-weight:600;margin-left:6px}
.ewr-r-dims{color:#666;font-size:14px}
.ewr-r-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:14px}
.ewr-r-item b{display:block;font-size:20px;color:#1A1A2E;font-weight:700}
.ewr-r-item span{display:block;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
.ewr-r-cta{margin-top:18px}
.ewr-sec{margin:0 0 34px}
.ewr-sec p{color:#444;font-size:17px;line-height:1.7;margin:0 0 12px}
.ewr-muted{color:#666;font-size:14px}
.ewr-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:14px}
.ewr-method-img{position:relative;aspect-ratio:4/3;background:#F0F7F4;border:1px solid #EEE;border-radius:10px;overflow:hidden;margin-bottom:10px}
.ewr-method-img img{width:100%;height:100%;object-fit:cover;display:block}
.ewr-method-cap{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.55));color:#fff;font-size:12px;font-weight:600;padding:14px 10px 8px}
.ewr-method p{font-size:13px;color:#666;line-height:1.55;margin:0}
.ewr-table-wrap{overflow-x:auto;margin-top:12px}
.ewr-table{width:100%;border-collapse:collapse;font-size:14px;background:#fff;border-radius:10px;overflow:hidden;min-width:560px}
.ewr-table th,.ewr-table td{padding:11px 14px;text-align:left;border-bottom:1px solid #EEE}
.ewr-table th{background:#F0F7F4;color:#1B4332;font-size:13px;text-transform:uppercase;letter-spacing:.04em}
.ewr-table td{color:#444}
.ewr-table td b{color:#2D6A4F}
.ewr-btn-primary{display:inline-block;background:#2D6A4F;color:#fff !important;padding:13px 24px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600;margin-right:10px;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewr-btn-primary:hover{background:#1B4332}
.ewr-btn-ghost{display:inline-block;background:#fff;border:1px solid #2D6A4F;color:#2D6A4F !important;padding:13px 24px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600}
.ewr-btn-ghost:hover{background:#F0F7F4}
.ewr-feedback{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:26px}
.ewr-faq{border:1px solid #EEE;border-radius:10px;background:#fff;margin-bottom:8px;overflow:hidden}
.ewr-faq summary{cursor:pointer;padding:14px 18px;font-weight:600;color:#1A1A2E;font-size:15px;list-style:none}
.ewr-faq summary::-webkit-details-marker{display:none}
.ewr-faq summary:after{content:'+';float:right;color:#2D6A4F;font-size:20px;line-height:1}
.ewr-faq[open] summary:after{content:'-'}
.ewr-faq p{margin:0;padding:0 18px 16px;color:#444;font-size:16px;line-height:1.65}
@media(max-width:768px){.ewr-methods{grid-template-columns:1fr}.ewr-h1{font-size:28px}}
@media(max-width:560px){.ewr-method-toggle{flex-direction:column}.ewr-h1{font-size:25px}.ewr-calc{padding:18px}}
</style>
<script>
var EWRing=(function(){
  var RING=${RING_JSON};
  var state={method:'cir',mm:''};
  function init(){maybeCalc();}
  function setMethod(m){
    state.method=m;
    document.getElementById('ewr-m-cir').classList.toggle('sel',m==='cir');
    document.getElementById('ewr-m-dia').classList.toggle('sel',m==='dia');
    var isCir=m==='cir';
    document.getElementById('ewr-input-label').textContent=isCir?'Your finger circumference (mm)':'Ring inner diameter (mm)';
    document.getElementById('ewr-input-hint').textContent=isCir?'Wrap a paper strip around the widest part of your finger (the knuckle), mark, lay flat against a ruler.':'Lay a ring that fits flat. Measure the inner diameter across the center in mm.';
    var i=document.getElementById('ewr-mm');i.placeholder=isCir?'e.g. 54':'e.g. 16.5';
    maybeCalc();
  }
  function maybeCalc(){
    var raw=parseFloat(document.getElementById('ewr-mm').value);
    var r=document.getElementById('ewr-result');
    if(!raw||raw<=0){r.classList.remove('show');r.innerHTML='';return;}
    var field=state.method;  // 'cir' or 'dia'
    var s=findSize(raw,field);
    var other=field==='cir'?'dia':'cir';
    r.innerHTML='<div class="ewr-result-card">'
      +'<div class="ewr-result-head"><div class="ewr-r-us">US '+s.us+'<span>size</span></div><div class="ewr-r-dims">Inner diameter '+s.dia+' mm · circumference '+s.cir+' mm</div></div>'
      +'<div class="ewr-r-grid">'
      +'<div class="ewr-r-item"><b>'+s.eu+'</b><span>EU</span></div>'
      +'<div class="ewr-r-item"><b>'+s.hk+'</b><span>港度 HK</span></div>'
      +'<div class="ewr-r-item"><b>'+s.cn+'</b><span>CN 中国</span></div>'
      +'</div>'
      +'<div class="ewr-r-cta"><a class="ewr-btn-primary" href="/product-category/healing-crystals-jewelry/">Shop US '+s.us+' Crystal Rings →</a></div>'
      +'</div>';
    r.classList.add('show');
  }
  function findSize(mm,field){return RING.reduce(function(best,s){return Math.abs(s[field]-mm)<Math.abs(best[field]-mm)?s:best;});}
  return{init:init,setMethod:setMethod,maybeCalc:maybeCalc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWRing.init);}else{EWRing.init();}
</script>
<!-- ===== Ring Sizing Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Measure Your Ring Size","description":"Three reliable methods to measure your ring size at home and convert to US, EU, Hong Kong, and Chinese sizes.","step":[{"@type":"HowToStep","name":"Paper strip method","text":"Wrap a thin paper strip around the widest part of your finger, mark the overlap, measure the length in mm for your circumference."},{"@type":"HowToStep","name":"Existing ring method","text":"Lay a ring that fits flat and measure the inner diameter across the center in mm."},{"@type":"HowToStep","name":"Ring sizer tool","text":"Use a plastic multi-size ring sizer for a direct US size read with no math."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"My measurement falls between two sizes — which do I pick?","acceptedAnswer":{"@type":"Answer","text":"Always size up to the half or full size. A ring needs to clear your knuckle; slightly loose is more comfortable than too tight."}},{"@type":"Question","name":"How do wide ring bands affect sizing?","acceptedAnswer":{"@type":"Answer","text":"Wide bands (6 mm+) feel snugger. For wide-band rings, go up about a quarter to half size from your standard measurement."}},{"@type":"Question","name":"When should I measure my finger?","acceptedAnswer":{"@type":"Answer","text":"Measure at the end of the day when fingers are warm. Morning or cold hands can read half a size small."}},{"@type":"Question","name":"Are US and Hong Kong ring sizes the same?","acceptedAnswer":{"@type":"Answer","text":"No. Hong Kong sizes run on a different scale — HK 10 is about US 5, HK 14 is about US 7. Always cross-check the conversion chart."}},{"@type":"Question","name":"Which finger is size 7?","acceptedAnswer":{"@type":"Answer","text":"There is no fixed finger-to-size. Roughly, US 5-6 fits many women's ring fingers, US 7-8 a middle or larger ring finger, US 9-10 an average man's ring finger. Measure your own."}}]}
]}
</script>
<!-- ===== End Ring Sizing Guide ===== -->`;

const OUT = path.resolve(__dirname, 'ring-size-calculator.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Ring Size Calculator 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | 双方式计算器 + US/EU/HK/CN 转换表 + FAQ`);
console.log(`   测量图(S2): 占位中，待 R-2 生图后替换 .ewr-method-img`);
