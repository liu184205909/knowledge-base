/**
 * 生成 Bracelet Size Calculator（T1）— Crystal Bracelet Sizing & Buying Guide
 * 2E §七修订：以"选购指南"为核心，计算器是其中一个模块（防 Generative UI 抢）
 *
 * 结构：Hero + S1为何重要 + S2测量方法（图占位）+ S3计算器 + S4珠子尺寸建议 + S5产品 + S6 FAQ + S7尺寸反馈CTA
 * 计算器：手腕周长(cm/inch) + 松紧偏好 → 推荐手链内周长 + 尺寸档 + 珠子建议
 *
 * 输出：./bracelet-size-calculator.html
 * Usage: node generate.js
 */
const fs = require('fs');
const path = require('path');

// ===== 尺寸数据（通用标准，无外部数据依赖）=====

// 松紧偏好：加放（cm）到手腕周长 = 手链内周长
const FITS = [
  { key: 'snug', label: 'Snug', sub: 'hugs the wrist', add: 1.5 },
  { key: 'comfort', label: 'Comfort', sub: 'classic fit, most popular', add: 2.0 },
  { key: 'loose', label: 'Loose', sub: 'relaxed drape', add: 2.7 },
];

// 尺寸档（基于手链内周长 cm）
function sizeBand(cm) {
  if (cm < 17) return { size: 'XS', range: 'under 17 cm / 6.7"' };
  if (cm < 18.5) return { size: 'S', range: '17–18.5 cm / 6.7–7.3"' };
  if (cm < 20) return { size: 'M', range: '18.5–20 cm / 7.3–7.9"' };
  if (cm < 21.5) return { size: 'L', range: '20–21.5 cm / 7.9–8.5"' };
  return { size: 'XL', range: '21.5 cm+ / 8.5"+' };
}

// 珠子尺寸建议（基于手腕周长 cm）
function beadAdvice(wristCm) {
  if (wristCm < 16) return { bead: '6–8 mm', desc: 'Dainty beads balance a slender wrist; 10 mm+ can look bulky.' };
  if (wristCm < 18) return { bead: '8–10 mm', desc: 'The versatile middle ground — our most popular bead size.' };
  return { bead: '10–12 mm', desc: 'Bolder beads carry a sturdier wrist with confidence.' };
}

const FITS_JSON = JSON.stringify(FITS);

// 测量方法图（base64 内联，T1 自包含；由 generate-measurement-images.js 生成）
function imgData(name) {
  const p = path.resolve(__dirname, 'images/measure-' + name + '.webp');
  if (!fs.existsSync(p)) return '';
  return 'data:image/webp;base64,' + fs.readFileSync(p).toString('base64');
}
const IMG_TAPE = imgData('tape');
const IMG_PAPER = imgData('paper');
const IMG_EXISTING = imgData('existing');

let html = `<!-- ===== Earthward Crystal Bracelet Sizing & Buying Guide ===== -->
<div id="ew-bracelet">
  <h1 class="ewb-h1">Crystal Bracelet Sizing & Buying Guide</h1>
  <p class="ewb-intro">Find your perfect fit in two minutes. Measure your wrist, pick how you like it to sit, and we'll recommend the right bracelet size — plus the bead thickness that suits your wrist best.</p>

  <!-- S3 计算器（核心模块）-->
  <div class="ewb-calc">
    <h2 class="ewb-h2">Bracelet Size Calculator</h2>
    <div class="ewb-field">
      <label class="ewb-label">Your wrist circumference</label>
      <div class="ewb-input-row">
        <input class="ewb-input" id="ewb-wrist" type="number" min="10" max="30" step="0.1" placeholder="e.g. 16.5" oninput="EWBracelet.maybeCalc()">
        <div class="ewb-unit">
          <button class="ewb-unit-btn sel" id="ewb-unit-cm" onclick="EWBracelet.setUnit('cm')">cm</button>
          <button class="ewb-unit-btn" id="ewb-unit-in" onclick="EWBracelet.setUnit('in')">inch</button>
        </div>
      </div>
    </div>
    <div class="ewb-field">
      <label class="ewb-label">How do you like it to fit?</label>
      <div class="ewb-fits" id="ewb-fits"></div>
    </div>
    <div class="ewb-result" id="ewb-result"></div>
  </div>

  <!-- S1 为什么尺寸重要 -->
  <section class="ewb-sec">
    <h2 class="ewb-h2">Why Bracelet Size Matters</h2>
    <p>A crystal bracelet only works if you actually wear it — and the wrong size is the #1 reason bracelets end up in a drawer. Too tight and it pinches, leaves marks, and never lets you forget it's there. Too loose and it constantly slides, spins the clasp to the top, and risks snagging on things.</p>
    <p>The catch with crystal bracelets: <strong>bead size changes everything</strong>. A 12 mm bead bracelet sits very differently from an 8 mm one at the same length — heavier, chunkier, and often needing a touch more room. That's why we size the <em>bead</em> to your wrist, not just the strand.</p>
  </section>

  <!-- S2 测量方法（图占位 + 步骤）-->
  <section class="ewb-sec">
    <h2 class="ewb-h2">How to Measure Your Wrist</h2>
    <p class="ewb-muted">Three ways — pick whichever you have on hand. Measure snug against the wrist bone, not tight.</p>
    <div class="ewb-methods">
      <div class="ewb-method">
        <div class="ewb-method-img">${IMG_TAPE ? '<img src="' + IMG_TAPE + '" alt="Measure wrist with a soft tape">' : '📷'}<span class="ewb-method-cap">Soft tape method</span></div>
        <p>Wrap a flexible tailor's tape around your wrist bone. Read the number — that's your wrist circumference.</p>
      </div>
      <div class="ewb-method">
        <div class="ewb-method-img">${IMG_PAPER ? '<img src="' + IMG_PAPER + '" alt="Paper strip and ruler method">' : '📷'}<span class="ewb-method-cap">Paper strip + ruler</span></div>
        <p>No tape? Wrap a strip of paper around your wrist, mark where it overlaps, lay it flat against a ruler.</p>
      </div>
      <div class="ewb-method">
        <div class="ewb-method-img">${IMG_EXISTING ? '<img src="' + IMG_EXISTING + '" alt="Measure an existing bracelet">' : '📷'}<span class="ewb-method-cap">From an existing bracelet</span></div>
        <p>Lay a bracelet that fits you well flat, measure the inner circumference end-to-end, then subtract ~2 cm to estimate wrist size.</p>
      </div>
    </div>
  </section>

  <!-- S4 珠子尺寸建议 -->
  <section class="ewb-sec">
    <h2 class="ewb-h2">Bead Size: Which Thickness Suits You</h2>
    <p>Bead diameter (mm) shapes both look and feel. Here's how to choose based on your wrist:</p>
    <div class="ewb-table-wrap">
      <table class="ewb-table">
        <thead><tr><th>Wrist size</th><th>Recommended bead</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Under 16 cm (6.3")</td><td><strong>6–8 mm</strong></td><td>Dainty beads balance a slender wrist; 10 mm+ looks bulky.</td></tr>
          <tr><td>16–18 cm (6.3–7.1")</td><td><strong>8–10 mm</strong></td><td>The versatile middle ground — most popular across styles.</td></tr>
          <tr><td>Over 18 cm (7.1")</td><td><strong>10–12 mm</strong></td><td>Bolder beads carry a sturdier wrist with presence.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- S5 推荐产品 -->
  <section class="ewb-sec ewb-shop-cta">
    <h2 class="ewb-h2">Shop Crystal Bracelets</h2>
    <p>Once you know your size, explore our crystal bracelets — each available across standard sizes.</p>
    <a class="ewb-btn-primary" href="/product-category/healing-crystals-jewelry/">Shop Healing Crystal Jewelry →</a>
    <a class="ewb-btn-ghost" href="/product-category/crystals-stones/">Shop Crystals & Stones →</a>
  </section>

  <!-- S6 FAQ -->
  <section class="ewb-sec">
    <h2 class="ewb-h2">Sizing FAQ</h2>
    <details class="ewb-faq"><summary>How do I know if a bracelet will fit over my hand?</summary><p>Elastic crystal bracelets stretch to roll over the widest part of your hand. If your knuckle-to-knuckle hand width is much larger than your wrist, lean toward the "Comfort" or "Loose" fit so it slides on without over-stretching the cord.</p></details>
    <details class="ewb-faq"><summary>What if I'm between two sizes?</summary><p>Size up. A slightly looser crystal bracelet is far more comfortable than one that pinches, and elastic cord has natural give. Most of our bracelets are re-stringable if you want it tighter later.</p></details>
    <details class="ewb-faq"><summary>Does bead size affect the length I need?</summary><p>Yes — larger beads (10–12 mm) sit chunkier and can feel snug at the same inner length. If you're choosing 10 mm+ beads, add about 0.5 cm to your usual fit, or pick "Comfort" over "Snug."</p></details>
    <details class="ewb-faq"><summary>Are your bracelets adjustable?</summary><p>Most elastic styles fit a range (e.g. S/M or M/L). Rigid bangles and cuffs have a fixed inner diameter — for those, measure around your knuckles, not your wrist, to ensure they slip on.</p></details>
    <details class="ewb-faq"><summary>What's the average women's / men's bracelet size?</summary><p>For women, the average wrist is about 16 cm (size S/M, 8 mm beads). For men, about 18 cm (size L, 10–12 mm beads). But averages are just that — always measure your own wrist for the best fit.</p></details>
  </section>

  <!-- S7 尺寸反馈 CTA -->
  <section class="ewb-sec ewb-feedback">
    <h2 class="ewb-h2">Help Future Buyers</h2>
    <p>Your wrist size helps others choose the right fit. After you receive your bracelet, share how it fits — we'll show "Most 16 cm wearers chose Size M" alongside the products.</p>
    <a class="ewb-btn-primary" href="/product-category/healing-crystals-jewelry/">Share My Fit Experience →</a>
  </section>
</div>
<style>
.ewb-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ewb-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ewb-h2{font-size:24px;color:#1A1A2E;margin:0 0 14px;font-weight:700}
.ewb-calc{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:26px;margin:0 0 36px}
.ewb-field{margin-bottom:18px}
.ewb-label{display:block;font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.ewb-input-row{display:flex;gap:10px;align-items:stretch}
.ewb-input{flex:1;padding:13px 14px;border:1px solid #DDD;border-radius:10px;font-size:16px;background:#fff;box-sizing:border-box}
.ewb-input:focus{outline:none;border-color:#2D6A4F;box-shadow:0 0 0 3px #2D6A4F22}
.ewb-unit{display:flex;border:1px solid #DDD;border-radius:10px;overflow:hidden}
.ewb-unit-btn{padding:0 16px;background:#fff;border:none;cursor:pointer;font-size:14px;color:#666;border-radius:0}
.ewb-unit-btn.sel{background:#2D6A4F;color:#fff}
.ewb-fits{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ewb-fit{padding:14px 12px;border:1px solid #DDD;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}
.ewb-fit:hover{border-color:#95D5B2}
.ewb-fit.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}
.ewb-fit b{display:block;color:#1A1A2E;font-size:15px}
.ewb-fit span{display:block;color:#888;font-size:12px;margin-top:3px;line-height:1.35}
.ewb-result{margin-top:8px;display:none}
.ewb-result.show{display:block}
.ewb-result-card{background:#fff;border:1px solid #2D6A4F33;border-radius:12px;padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px}
.ewb-r-item b{display:block;font-size:24px;color:#2D6A4F;font-weight:700;line-height:1.1}
.ewb-r-item span{display:block;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin-top:5px}
.ewb-r-item p{color:#444;font-size:13px;margin:6px 0 0;line-height:1.45}
.ewb-r-cta{grid-column:1/-1;margin-top:6px}
.ewb-sec{margin:0 0 34px}
.ewb-sec p{color:#444;font-size:17px;line-height:1.7;margin:0 0 12px}
.ewb-muted{color:#666;font-size:14px}
.ewb-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:14px}
.ewb-method-img{position:relative;aspect-ratio:4/3;background:#F0F7F4;border:1px solid #EEE;border-radius:10px;overflow:hidden;margin-bottom:10px}.ewb-method-img img{width:100%;height:100%;object-fit:cover;display:block}.ewb-method-cap{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.55));color:#fff;font-size:12px;font-weight:600;padding:14px 10px 8px}
.ewb-method p{font-size:13px;color:#666;line-height:1.55;margin:0}
.ewb-table-wrap{overflow-x:auto;margin-top:12px}
.ewb-table{width:100%;border-collapse:collapse;font-size:14px;background:#fff;border-radius:10px;overflow:hidden}
.ewb-table th,.ewb-table td{padding:12px 14px;text-align:left;border-bottom:1px solid #EEE}
.ewb-table th{background:#F0F7F4;color:#1B4332;font-size:13px;text-transform:uppercase;letter-spacing:.04em}
.ewb-table td{color:#444;line-height:1.5}
.ewb-shop-cta a,.ewb-feedback a{margin-top:8px}
.ewb-btn-primary{display:inline-block;background:#2D6A4F;color:#fff !important;padding:13px 24px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600;margin-right:10px;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewb-btn-primary:hover{background:#1B4332}
.ewb-btn-ghost{display:inline-block;background:#fff;border:1px solid #2D6A4F;color:#2D6A4F !important;padding:13px 24px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600}
.ewb-btn-ghost:hover{background:#F0F7F4}
.ewb-feedback{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:26px}
.ewb-faq{border:1px solid #EEE;border-radius:10px;background:#fff;margin-bottom:8px;overflow:hidden}
.ewb-faq summary{cursor:pointer;padding:14px 18px;font-weight:600;color:#1A1A2E;font-size:15px;list-style:none}
.ewb-faq summary::-webkit-details-marker{display:none}
.ewb-faq summary:after{content:'+';float:right;color:#2D6A4F;font-size:20px;line-height:1}
.ewb-faq[open] summary:after{content:'-'}
.ewb-faq p{margin:0;padding:0 18px 16px;color:#444;font-size:16px;line-height:1.65}
@media(max-width:768px){.ewb-methods{grid-template-columns:1fr}.ewb-h1{font-size:28px}}
@media(max-width:560px){.ewb-fits{grid-template-columns:1fr}.ewb-h1{font-size:25px}.ewb-calc{padding:18px}.ewb-input-row{flex-direction:column}}
</style>
<script>
var EWBracelet=(function(){
  var FITS=${FITS_JSON};
  var state={wrist:'',unit:'cm',fit:'comfort'};
  function init(){renderFits();maybeCalc();}
  function renderFits(){
    var f=document.getElementById('ewb-fits');if(!f)return;
    f.innerHTML=FITS.map(function(ft){
      return '<div class="ewb-fit'+(state.fit===ft.key?' sel':'')+'" onclick="EWBracelet.setFit(\\''+ft.key+'\\')"><b>'+ft.label+'</b><span>'+ft.sub+'</span></div>';
    }).join('');
  }
  function setUnit(u){state.unit=u;document.getElementById('ewb-unit-cm').classList.toggle('sel',u==='cm');document.getElementById('ewb-unit-in').classList.toggle('sel',u==='in');var i=document.getElementById('ewb-wrist');i.placeholder=u==='cm'?'e.g. 16.5':'e.g. 6.5';maybeCalc();}
  function setFit(k){state.fit=k;renderFits();maybeCalc();}
  function maybeCalc(){
    var raw=parseFloat(document.getElementById('ewb-wrist').value);
    var r=document.getElementById('ewb-result');
    if(!raw||raw<=0){r.classList.remove('show');r.innerHTML='';return;}
    var wristCm=state.unit==='in'?raw*2.54:raw;
    var ft=FITS.filter(function(x){return x.key===state.fit;})[0];
    var braceletCm=wristCm+ft.add;
    var size=sizeBand(braceletCm);
    var bead=beadAdvice(wristCm);
    var braceletIn=(braceletCm/2.54).toFixed(1);
    r.innerHTML='<div class="ewb-result-card">'
      +'<div class="ewb-r-item"><b>'+braceletCm.toFixed(1)+' cm</b><span>Recommended length ('+braceletIn+'")</span></div>'
      +'<div class="ewb-r-item"><b>'+size.size+'</b><span>Size band</span><p>'+size.range+'</p></div>'
      +'<div class="ewb-r-item"><b>'+bead.bead+'</b><span>Suggested bead</span><p>'+bead.desc+'</p></div>'
      +'<div class="ewb-r-cta"><a class="ewb-btn-primary" href="/product-category/healing-crystals-jewelry/">Shop '+size.size+' Bracelets →</a></div>'
      +'</div>';
    r.classList.add('show');
  }
  function sizeBand(cm){
    if(cm<17)return{size:'XS',range:'under 17 cm / 6.7"'};
    if(cm<18.5)return{size:'S',range:'17–18.5 cm / 6.7–7.3"'};
    if(cm<20)return{size:'M',range:'18.5–20 cm / 7.3–7.9"'};
    if(cm<21.5)return{size:'L',range:'20–21.5 cm / 7.9–8.5"'};
    return{size:'XL',range:'21.5 cm+ / 8.5"+'};
  }
  function beadAdvice(w){
    if(w<16)return{bead:'6–8 mm',desc:'Dainty beads balance a slender wrist.'};
    if(w<18)return{bead:'8–10 mm',desc:'The versatile middle ground — most popular.'};
    return{bead:'10–12 mm',desc:'Bolder beads carry a sturdier wrist.'};
  }
  return{init:init,setUnit:setUnit,setFit:setFit,maybeCalc:maybeCalc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWBracelet.init);}else{EWBracelet.init();}
</script>
<!-- ===== Bracelet Sizing Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Measure Your Wrist for a Crystal Bracelet","description":"Three simple methods to measure your wrist and find the right crystal bracelet size.","step":[{"@type":"HowToStep","name":"Soft tape method","text":"Wrap a flexible tailor's tape around your wrist bone and read the number."},{"@type":"HowToStep","name":"Paper strip method","text":"Wrap a paper strip around your wrist, mark the overlap, lay it flat against a ruler."},{"@type":"HowToStep","name":"Existing bracelet method","text":"Lay a bracelet that fits flat, measure inner circumference, subtract about 2 cm for wrist size."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I know if a bracelet will fit over my hand?","acceptedAnswer":{"@type":"Answer","text":"Elastic crystal bracelets stretch to roll over the widest part of your hand. If your hand is much wider than your wrist, choose Comfort or Loose fit so it slides on without over-stretching the cord."}},{"@type":"Question","name":"What if I'm between two sizes?","acceptedAnswer":{"@type":"Answer","text":"Size up. A slightly looser bracelet is more comfortable than one that pinches, and elastic cord has natural give."}},{"@type":"Question","name":"Does bead size affect the length I need?","acceptedAnswer":{"@type":"Answer","text":"Yes. Larger beads (10–12 mm) sit chunkier and can feel snug at the same inner length. Add about 0.5 cm or choose Comfort over Snug for 10 mm+ beads."}},{"@type":"Question","name":"Are your bracelets adjustable?","acceptedAnswer":{"@type":"Answer","text":"Most elastic styles fit a range like S/M or M/L. Rigid bangles and cuffs have a fixed inner diameter — for those, measure around your knuckles, not your wrist."}},{"@type":"Question","name":"What's the average bracelet size?","acceptedAnswer":{"@type":"Answer","text":"For women, the average wrist is about 16 cm (size S/M, 8 mm beads). For men, about 18 cm (size L, 10–12 mm beads). Always measure your own for the best fit."}}]}
]}
</script>
<!-- ===== End Bracelet Sizing Guide ===== -->`;

const OUT = path.resolve(__dirname, 'bracelet-size-calculator.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Bracelet Size Calculator 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | 计算器 + 测量方法(图占位) + 珠子建议 + FAQ`);
console.log(`   测量图(S2): 占位中，待 T1-2 生图后替换 .ewb-method-img`);
