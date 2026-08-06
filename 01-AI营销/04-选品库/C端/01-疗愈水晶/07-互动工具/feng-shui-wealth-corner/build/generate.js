/**
 * Feng Shui Wealth Corner Finder v1.0 — 风水工具三件套 #3（P1）
 *
 * 定位：转化型工具。入口朝向 → 双法财位(BTB远左后角 + Classical SE) + 宜忌 + wealth crystal。
 *
 * 竞品差异化(2026-07-16调研): 头部0交互工具(thecrystalcouncil占文章位but无工具)。
 *   流派风险低(BTB/形势两套并存呈现) + 常青无年度更新 + 天然承接水晶Shop。
 *
 * 数据: wealth crystal 5颗(Pyrite/Citrine/Jade/Aventurine/Malachite, thecrystalcouncil验证路径) +
 *         crystal-meaning-search/data/search-data.json(img/shop)
 *
 * 输出: ./wealth-corner.html
 */
const fs = require('fs');
const path = require('path');

let SD = { crystals: [] };
try { SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8')); } catch (e) {}

const HEALING = '/product-category/healing-crystals-jewelry/';
function normSlug(s) { return s ? String(s).replace(/-meaning$/, '') : s; }
const BY_SLUG = {};
(SD.crystals || []).forEach(c => { BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', shop: c.shop || ('/shop/?s=' + normSlug(c.slug)) }; });
function stoneName(slug) { const a = BY_SLUG[normSlug(slug)]; return (a && a.name) || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }

// wealth crystal 5 颗（设计文档 §4.3，thecrystalcouncil 验证）
const WEALTH_CRYSTALS = [
  { slug: 'pyrite', reason: "Often called fool's gold, pyrite is traditionally placed in the wealth corner as a magnet for abundance and confident prosperity." },
  { slug: 'citrine', reason: "The merchant's stone — citrine is the classic BTB wealth-corner anchor, placed near business materials or a cash box." },
  { slug: 'jade', reason: "Green jade sustains wealth across generations in East Asian tradition, supporting steady, lasting prosperity." },
  { slug: 'aventurine', reason: "Green aventurine is known as a stone of opportunity and lucky new ventures, often paired with abundance work." },
  { slug: 'malachite', reason: "Malachite supports wealth transformation and growth, inviting prosperity that evolves with you." }
].map(c => { const sc = BY_SLUG[normSlug(c.slug)] || {}; return { slug: c.slug, name: sc.name || stoneName(c.slug), reason: c.reason, img: sc.img || '', shop: sc.shop || ('/shop/?s=' + c.slug) }; });

function asciiJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const DATA_BLOCK = asciiJSON({ crystals: WEALTH_CRYSTALS, healing: HEALING });

const APP_JS = `(function(){
  var DATA;
  try { DATA = JSON.parse(document.getElementById('ewc-data').textContent); }
  catch (e) { console.error('EWC data parse failed', e); return; }
  var CRYSTALS = DATA.crystals, HEALING = DATA.healing;

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function renderCrystalCard(stone){
    var img = stone.img ? '<img class="ewc-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">' : '<div class="ewc-stone-img ewc-stone-ph"></div>';
    return '<div class="ewc-stone-card">'+img+'<div class="ewc-stone-body"><div class="ewc-stone-name">'+esc(stone.name)+'</div>'+
      '<p class="ewc-stone-reason">'+esc(stone.reason)+'</p>'+
      '<a class="ewc-stone-shop" href="'+esc(stone.shop)+'">Shop '+esc(stone.name)+' &rarr;</a></div></div>';
  }

  function render(facing){
    var el = document.getElementById('ewc-result'); if (!el) return;
    var facingTxt = facing ? (facing + '-facing front door') : 'your front door';
    var html = '';

    // 双法财位
    html += '<div class="ewc-methods">';
    html += '<div class="ewc-method ewc-method-btb">';
    html += '<div class="ewc-m-tag">BTB method</div>';
    html += '<h2 class="ewc-m-title">Far Left Back Corner</h2>';
    html += '<p class="ewc-m-body">Stand at '+esc(facingTxt)+' facing into your home. The wealth corner is the <strong>far back-left corner</strong> from your position — aligned to the door, not to compass direction. This works for any floor plan, including apartments.</p>';
    html += '<div class="ewc-m-color">BTB signature color: <strong>purple</strong> (amethyst)</div>';
    html += '</div>';
    html += '<div class="ewc-method ewc-method-classical">';
    html += '<div class="ewc-m-tag">Classical / Compass method</div>';
    html += '<h2 class="ewc-m-title">Southeast (SE) Sector</h2>';
    html += '<p class="ewc-m-body">In classical compass feng shui, the wealth corner is fixed at the <strong>southeast</strong> sector of your space, determined by the actual compass bearing rather than the door. Classical tradition favors <strong>green</strong> and Wood-element stones here.</p>';
    html += '<div class="ewc-m-color">Classical signature color: <strong>green</strong> (jade, aventurine)</div>';
    html += '</div>';
    html += '</div>';

    // 宜忌
    html += '<div class="ewc-do-row">';
    html += '<div class="ewc-do ewc-good"><div class="ewc-do-title">Do</div><ul><li>Keep the area clean, bright, and uncluttered</li><li>Add a healthy plant or small fountain (water nourishes wood)</li><li>Use purple, green, red, or gold accents</li><li>Place wealth crystals or a meaningful abundance symbol</li></ul></div>';
    html += '<div class="ewc-do ewc-bad"><div class="ewc-do-title">Avoid</div><ul><li>Clutter, broken items, or storage boxes</li><li>A bathroom or trash in this corner</li><li>Mirrors reflecting away abundance</li><li>Dried, dead, or wilting plants</li></ul></div>';
    html += '</div>';

    // wealth crystal
    html += '<section class="ewc-module ewc-m-stones">';
    html += '<div class="ewc-mod-head"><span class="ewc-mod-num ewc-mod-gold">★</span><h2>Wealth Corner Crystals</h2></div>';
    html += '<p class="ewc-lede-soft">Five crystals traditionally placed in the wealth corner &mdash; a mindful anchor for abundance, not a guarantee of outcomes.</p>';
    html += '<div class="ewc-stones-grid">';
    CRYSTALS.forEach(function(c){ html += renderCrystalCard(c); });
    html += '</div></section>';

    html += '<p class="ewc-note">Two common feng shui traditions locate the wealth corner differently: BTB uses the far back-left corner (front-door aligned), classical uses the southeast sector (compass aligned). You can work with either or both. Crystal placements are traditional and symbolic &mdash; not financial advice.</p>';

    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init(){
    var form = document.getElementById('ewc-form');
    if (form) form.addEventListener('submit', function(e){
      e.preventDefault();
      var sel = document.querySelector('input[name="ewc-facing"]:checked');
      render(sel ? sel.value : null);
    });
    // 默认渲染（无朝向也展示双法）
    render(null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`;

function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');

const html = `<!-- ===== Feng Shui Wealth Corner Finder v1.0 (tool #3) ===== -->
<div class="ewc-root">
  <div class="ewc-inner">

    <div class="ewc-hero">
      <h1 class="ewc-h1">Feng Shui Wealth Corner Finder</h1>
      <p class="ewc-sub">Find your feng shui wealth corner (money area) and the crystals traditionally placed there. Two methods compared: BTB far back-left corner and classical southeast sector.</p>
    </div>

    <form id="ewc-form" class="ewc-form" onsubmit="return false;">
      <div class="ewc-form-title">Which way does your front door face? (optional)</div>
      <div class="ewc-facing-row">
        <label class="ewc-facing"><input type="radio" name="ewc-facing" value="North"> North</label>
        <label class="ewc-facing"><input type="radio" name="ewc-facing" value="East"> East</label>
        <label class="ewc-facing"><input type="radio" name="ewc-facing" value="South"> South</label>
        <label class="ewc-facing"><input type="radio" name="ewc-facing" value="West"> West</label>
      </div>
      <button type="submit" class="ewc-submit">Show My Wealth Corner &rarr;</button>
      <p class="ewc-form-hint">Optional — the two wealth-corner methods below work for any home orientation.</p>
    </form>

    <div id="ewc-result" class="ewc-result"></div>

    <!-- SEO Accordion -->
    <section class="ewc-seo-accordion" aria-label="Wealth corner guide">
      <details class="ewc-seo-details">
        <summary>Learn More About the Feng Shui Wealth Corner</summary>
        <div class="ewc-seo-content">
          <h2>Where is the feng shui wealth corner?</h2>
          <p>There are two widely used methods. In <strong>BTB feng shui</strong>, the wealth corner is the far back-left corner when you stand at your front door facing into your home. In <strong>classical compass feng shui</strong>, the wealth corner is the southeast sector of your space, based on the actual compass bearing. Both are legitimate traditions and you can work with either.</p>
          <h2>BTB vs classical wealth corner</h2>
          <p>BTB (Black Sect) feng shui locates the wealth corner by the front door (far back-left), which works for any floor plan including apartments. Classical or compass feng shui locates it at the fixed southeast bearing. BTB favors purple stones like amethyst as the signature color; classical favors green Wood-element stones like jade and aventurine.</p>
          <h2>Best crystals for the wealth corner</h2>
          <p>Common wealth-corner crystals include <strong>pyrite</strong> (abundance magnet), <strong>citrine</strong> (the merchant's stone), <strong>green jade</strong> (sustained prosperity), <strong>green aventurine</strong> (opportunity), and <strong>malachite</strong> (wealth growth). In BTB, purple <strong>amethyst</strong> is the signature wealth-corner stone. Crystal pairings are traditional and symbolic, not a guarantee of financial outcomes.</p>
          <h2>What to place and avoid in the wealth corner</h2>
          <p>Keep the area clean, bright, and uncluttered; add a healthy plant or small fountain (water nourishes wood in the five-element cycle); use purple, green, red, or gold accents; place wealth crystals or a meaningful abundance symbol. Avoid clutter, broken items, trash bins, bathrooms, mirrors that reflect energy away, and dried or wilting plants.</p>
          <h2>How to activate your wealth corner</h2>
          <p>Activation is about intention rather than a checklist. Choose one or two crystals that resonate, set a clear intention for the area, and tend it regularly — dusting, refreshing plants, or simply pausing to notice what abundance means to you. Feng shui is a practice of mindful attention to your space, not a guarantee of income.</p>
          <h3>Frequently asked questions</h3>
          <h3>Where is the feng shui wealth corner in a home?</h3>
          <p>BTB uses the far back-left corner from the front door; classical uses the southeast sector. Both are widely used.</p>
          <h3>What is the difference between BTB and classical wealth corner?</h3>
          <p>BTB locates it by the front door and favors purple amethyst; classical locates it at the southeast bearing and favors green stones.</p>
          <h3>Which crystals are best for the wealth corner?</h3>
          <p>Pyrite, citrine, green jade, green aventurine, and malachite are common; amethyst is the BTB signature. Pairings are traditional and symbolic.</p>
          <h3>What should I avoid in the wealth corner?</h3>
          <p>Clutter, broken items, trash bins, bathrooms, mirrors reflecting energy away, and dead or wilting plants.</p>
          <h3>Does a wealth corner actually bring money?</h3>
          <p>No. Feng shui is a traditional practice for supporting intention. The wealth corner is a framework for reflecting on abundance, not a guarantee of income or financial advice.</p>
        </div>
      </details>
    </section>

  </div>
</div>

<style>
.ewc-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1A1A2E;line-height:1.6}
.ewc-inner{max-width:1140px;margin:0 auto;padding:24px 28px 40px}
.ewc-hero{text-align:center;margin-bottom:24px}
.ewc-h1{font-size:32px;font-weight:800;color:#1A1A2E;margin:0 0 8px;letter-spacing:-.01em}
.ewc-sub{font-size:15px;color:#5A5A6E;max-width:680px;margin:0 auto;line-height:1.65}
.ewc-form{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:22px 26px;margin-bottom:26px;max-width:620px;margin-left:auto;margin-right:auto}
.ewc-form-title{font-size:14px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;text-align:center}
.ewc-facing-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
.ewc-facing{display:flex;align-items:center;justify-content:center;padding:11px 6px;border:1px solid #D5CFC2;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;background:#fff}
.ewc-facing input{accent-color:#2D6A4F;margin-right:4px}
.ewc-submit{width:100%;background:#2D6A4F;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer}
.ewc-submit:hover{background:#1B4332}
.ewc-form-hint{font-size:12px;color:#888;margin:8px 0 0;text-align:center;font-style:italic}
.ewc-methods{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
.ewc-method{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:22px 24px}
.ewc-method-btb{background:linear-gradient(135deg,#F4EFFC 0%,#fff 70%);border-color:#6B4E9E}
.ewc-method-classical{background:linear-gradient(135deg,#F0F7F4 0%,#fff 70%);border-color:#2D6A4F}
.ewc-m-tag{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.ewc-method-btb .ewc-m-tag{color:#6B4E9E}
.ewc-method-classical .ewc-m-tag{color:#2D6A4F}
.ewc-m-title{font-size:20px;font-weight:800;color:#1A1A2E;margin:0 0 8px}
.ewc-m-body{font-size:14px;color:#444;margin:0 0 10px;line-height:1.65}
.ewc-m-body strong{color:#1A1A2E}
.ewc-m-color{font-size:13px;color:#5A5A6E;font-style:italic}
.ewc-m-color strong{font-style:normal;font-weight:700}
.ewc-do-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
.ewc-do{background:#fff;border:1px solid #E8E2D5;border-radius:12px;padding:18px 20px}
.ewc-good{border-left:4px solid #2D6A4F}
.ewc-bad{border-left:4px solid #B8453A}
.ewc-do-title{font-size:14px;font-weight:800;margin-bottom:8px}
.ewc-good .ewc-do-title{color:#2D6A4F}
.ewc-bad .ewc-do-title{color:#B8453A}
.ewc-do ul{margin:0;padding-left:18px;font-size:14px;color:#444;line-height:1.7}
.ewc-module{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:24px 26px;margin-bottom:20px}
.ewc-m-stones{background:linear-gradient(135deg,#FBF8F1 0%,#fff 70%);border-color:#CFAA3E}
.ewc-mod-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.ewc-mod-num{background:#CFAA3E;color:#fff;font-size:14px;font-weight:800;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:7px}
.ewc-mod-head h2{font-size:21px;font-weight:800;color:#1A1A2E;margin:0}
.ewc-lede-soft{font-size:14px;color:#5A5A6E;font-style:italic;margin:0 0 14px}
.ewc-stones-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ewc-stone-card{background:#fff;border:1px solid #E8E2D5;border-radius:10px;padding:12px;text-align:center}
.ewc-stone-img{width:72px;height:72px;object-fit:cover;border-radius:50%;margin:0 auto 8px;border:2px solid #CFAA3E;background:#F0F0F5}
.ewc-stone-ph{background:linear-gradient(135deg,#CFAA3E,#E8E2D5)}
.ewc-stone-name{font-size:14px;font-weight:800;color:#1A1A2E;margin-bottom:3px}
.ewc-stone-reason{font-size:11px;color:#5A5A6E;line-height:1.5;margin:0 0 6px;min-height:50px}
.ewc-stone-shop{font-size:12px;font-weight:700;color:#2D6A4F !important;text-decoration:none;border-bottom:1px solid #CFAA3E}
.ewc-note{font-size:13px;color:#888;font-style:italic;line-height:1.65;margin:18px 0 0;padding:0 10px}
.ewc-seo-accordion{margin:32px 0 8px}
.ewc-seo-details{border:1px solid #E8E2D5;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ewc-seo-details summary{list-style:none;cursor:pointer;background:#F4F0E6;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;display:flex;justify-content:space-between;align-items:center}
.ewc-seo-details summary::-webkit-details-marker{display:none}
.ewc-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F;font-weight:300}
.ewc-seo-details[open] summary:after{content:'–'}
.ewc-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ewc-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px;letter-spacing:-.005em}
.ewc-seo-content h2:first-child{margin-top:0}
.ewc-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.ewc-seo-content p{margin:0 0 12px}
.ewc-seo-content strong{color:#2D6A4F}
@media(max-width:780px){.ewc-methods,.ewc-do-row{grid-template-columns:1fr}.ewc-stones-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.ewc-seo-content{padding:18px 16px;font-size:15px}.ewc-seo-content h2{font-size:21px}.ewc-seo-content h3{font-size:17px}.ewc-seo-details summary{font-size:16px;padding:15px 16px}}
@media(max-width:560px){.ewc-inner{padding:16px 14px 32px}.ewc-h1{font-size:25px}.ewc-form{padding:18px 16px}.ewc-facing-row{grid-template-columns:repeat(2,1fr)}.ewc-stones-grid{grid-template-columns:1fr}}
</style>

<script type="application/json" id="ewc-data">${DATA_BLOCK}</script>
<script type="text/plain" id="ewc-app">${APP_B64}</script>
<script>(function(){var b=document.getElementById('ewc-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EWC init failed',e);}})();</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Where is the feng shui wealth corner in a home?","acceptedAnswer":{"@type":"Answer","text":"There are two common methods. In BTB feng shui, the wealth corner is the far back-left corner when you stand at your front door facing into the home. In classical compass feng shui, the wealth corner is the southeast sector of your space, based on the actual compass bearing. Both are widely used and you can work with either."}},
{"@type":"Question","name":"What is the difference between BTB and classical wealth corner?","acceptedAnswer":{"@type":"Answer","text":"BTB (Black Sect) feng shui locates the wealth corner by the front door (far back-left), which works for any floor plan including apartments. Classical or compass feng shui locates it at the fixed southeast bearing. BTB favors purple stones like amethyst; classical favors green Wood-element stones like jade and aventurine."}},
{"@type":"Question","name":"Which crystals are best for the wealth corner?","acceptedAnswer":{"@type":"Answer","text":"Common wealth-corner crystals include pyrite (abundance magnet), citrine (the merchant's stone), green jade (sustained prosperity), green aventurine (opportunity), and malachite (wealth growth). In BTB, purple amethyst is the signature wealth-corner stone. Crystal pairings are traditional and symbolic, not a guarantee of financial outcomes."}},
{"@type":"Question","name":"What should I avoid placing in the wealth corner?","acceptedAnswer":{"@type":"Answer","text":"Avoid clutter, broken items, storage boxes, trash bins, and bathrooms in the wealth corner. Mirrors that reflect energy away from the area and dried, dead, or wilting plants are also traditionally avoided. Keep the area clean, bright, and alive with healthy plants or meaningful objects."}},
{"@type":"Question","name":"Does a wealth corner actually bring money?","acceptedAnswer":{"@type":"Answer","text":"No. Feng shui is a traditional cultural practice for arranging your space to support intention and wellbeing. The wealth corner is a framework for reflecting on abundance and how you tend your resources &mdash; not a guarantee of income or financial outcomes, and not financial advice."}}
]}
</script>
<!-- ===== End Wealth Corner Finder v1.0 ===== -->`;

const OUT = path.resolve(__dirname, 'wealth-corner.html');
fs.writeFileSync(OUT, html, 'utf8');
const KB = (fs.statSync(OUT).size / 1024).toFixed(1);

const BLACK = /\\b(guarantees wealth|will bring wealth|will bring money|guaranteed return)\\b/gi;
const ALLOW_BEFORE = /\\b(not\\s+(a|the)\\s+|no\\s+|never\\s+)/i;
function isAllowed(src, idx){ return ALLOW_BEFORE.test(src.substring(Math.max(0, idx - 40), idx)); }
let violations = [];
[html, APP_JS].forEach(function (src) { var re = new RegExp(BLACK.source, BLACK.flags); var m; while ((m = re.exec(src)) !== null) { if (!isAllowed(src, m.index)) violations.push(m[0] + ' @' + m.index); } });

console.log('Wealth Corner Finder v1.0 generated:', OUT);
console.log('  size:', KB, 'KB | wealth crystals:', WEALTH_CRYSTALS.length);
console.log('  DATA_BLOCK:', DATA_BLOCK.length, 'chars | APP_B64:', APP_B64.length, 'chars');
console.log('  compliance violations:', violations.length === 0 ? 'NONE (PASS)' : violations.join('; '));
