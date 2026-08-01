/**
 * Bagua Map Tool v1.0 — 风水工具三件套 #2（P0）
 *
 * 定位：最大工具缝（头部全是文章0交互工具，连buddhastoneshop水晶电商都没九宫逐宫水晶）。
 *      交互九宫(BTB门对齐) → 点击任一宫看元素/颜色/形状/激活法/水晶3颗+Shop CTA。
 *
 * 竞品差异化(2026-07-16调研): 5家竞品(karenrauchcarter/anjiecho/ifsguild/msfengshui/buddhastoneshop)
 *   全静态文章0交互工具; 九宫逐宫水晶映射竞品集体缺位。goearthward填空白。
 *
 * 3精度点: BTB门对齐(门在底部Knowledge/Career/Helpful People排) / Wealth宫BTB紫色Amethyst非绿 /
 *   BTB vs Compass双流派明示
 *
 * 数据: _shared/bagua-knowledge.json(9宫×元素/颜色/形状/激活法/水晶) +
 *         crystal-meaning-search/data/search-data.json(水晶img/shop)
 *
 * 教训严守(同Kua): 1份generate.js / 浅色品牌 / 嵌入式 / base64+asciiJSON / ebg-前缀 /
 *   draft部署 / 合规(based on traditional, not a guarantee)
 *
 * 输出: ./bagua-map.html
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const BK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/bagua-knowledge.json'), 'utf8'));
let SD = { crystals: [] };
try { SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8')); } catch (e) {}

const HEALING = '/product-category/healing-crystals-jewelry/';
function normSlug(s) { return s ? String(s).replace(/-meaning$/, '') : s; }
const BY_SLUG = {};
(SD.crystals || []).forEach(c => { BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', shop: c.shop || ('/shop/?s=' + normSlug(c.slug)) }; });
function stoneName(slug) { const a = BY_SLUG[normSlug(slug)]; return (a && a.name) || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function enrichStone(s) { if (!s) return null; const sc = BY_SLUG[normSlug(s.slug)] || { name: stoneName(s.slug), shop: HEALING }; return { slug: s.slug, name: sc.name || stoneName(s.slug), reason: s.reason || '', img: sc.img, shop: sc.shop }; }

// ===== 9 宫精简 =====
const AREAS = BK.areas.map(a => ({
  position: a.position,
  name: a.name,
  short: a.name.split(/[&/]/)[0].trim(),
  trigram: a.trigram,
  element: a.element,
  color: a.colors.primary,
  shape: a.shape || '',
  life_area: a.life_area || '',
  activation: a.activation || '',
  crystals: (a.crystals || []).map(c => enrichStone({ slug: c.slug, reason: c.reason }))
}));

function asciiJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
function stripCJK(s){ return String(s==null?'':s).replace(/[一-鿿]/g,'').replace(/\s+/g,' ').replace(/[()（）]\s*[()（）]/g,'').trim(); }
const DATA_BLOCK = asciiJSON({
  areas: AREAS,
  healing: HEALING,
  school: { btb: stripCJK(BK.school_orientation.btb), compass: stripCJK(BK.school_orientation.compass) },
  btb_note: stripCJK(BK._meta.school_primary)
});

// ===== APP_JS =====
const APP_JS = `(function(){
  var DATA;
  try { DATA = JSON.parse(document.getElementById('ebg-data').textContent); }
  catch (e) { console.error('EBG data parse failed', e); return; }
  var AREAS = DATA.areas, HEALING = DATA.healing;
  var AREA_BY_POS = {}; AREAS.forEach(function(a){ AREA_BY_POS[a.position] = a; });

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function shopUrl(stone){ if(!stone) return HEALING; return stone.shop || (stone.slug ? '/shop/?s='+encodeURIComponent(stone.slug) : HEALING); }

  // BTB 网格顺序：上=back row(远离门), 中=middle, 下=front row(门)
  var GRID = ['back_left','back_center','back_right','middle_left','center','middle_right','front_left','front_center','front_right'];
  var COLOR_LABEL = { blue:'#3D5A80', black:'#2A2A3A', gray:'#7A7A8A', green:'#2D6A4F', yellow:'#CFAA3E', white:'#B8C4CC', purple:'#6B4E9E', red:'#B8453A', pink:'#D17B8A' };

  function renderGrid(){
    var html = '<div class="ebg-grid" role="group" aria-label="Bagua nine areas">';
    html += '<div class="ebg-door-label">FRONT DOOR ↓</div>';
    GRID.forEach(function(pos){
      var a = AREA_BY_POS[pos]; if (!a) return;
      var c = COLOR_LABEL[a.color] || '#888';
      html += '<button type="button" class="ebg-cell" data-pos="'+pos+'" style="--cell-c:'+c+'" aria-label="'+esc(a.name)+'">';
      html += '<div class="ebg-tri">'+esc(a.trigram.symbol)+'</div>';
      html += '<div class="ebg-cname">'+esc(a.short)+'</div>';
      if (a.crystals && a.crystals[0]) html += '<div class="ebg-cstone">'+esc(a.crystals[0].name)+'</div>';
      html += '</button>';
    });
    html += '</div>';
    return html;
  }

  function renderCrystalCard(stone){
    if (!stone) return '';
    var img = stone.img ? '<img class="ebg-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">' : '<div class="ebg-stone-img ebg-stone-ph"></div>';
    return '<div class="ebg-stone-card">'+img+'<div class="ebg-stone-body"><div class="ebg-stone-name">'+esc(stone.name)+'</div>'+
      '<p class="ebg-stone-reason">'+esc(stone.reason)+'</p>'+
      '<a class="ebg-stone-shop" href="'+esc(shopUrl(stone))+'">Shop '+esc(stone.name)+' &rarr;</a></div></div>';
  }

  function renderDetail(pos){
    var a = AREA_BY_POS[pos]; if (!a) return '';
    var c = COLOR_LABEL[a.color] || '#888';
    var html = '<div class="ebg-detail" style="--detail-c:'+c+'">';
    html += '<div class="ebg-detail-head"><span class="ebg-detail-tri">'+esc(a.trigram.symbol)+'</span>';
    html += '<div><h2 class="ebg-detail-name">'+esc(a.name)+'</h2>';
    html += '<div class="ebg-detail-meta">'+esc(a.trigram.name)+' trigram · '+esc(a.element)+' element · '+esc(a.color)+' area</div></div>';
    html += '<button type="button" class="ebg-close" aria-label="Close">&times;</button></div>';

    if (a.life_area) html += '<p class="ebg-detail-life"><strong>Life area:</strong> '+esc(a.life_area)+'</p>';
    if (a.activation) html += '<div class="ebg-detail-act"><span class="ebg-act-lbl">How to activate</span><p>'+esc(a.activation)+'</p></div>';
    if (a.shape) html += '<p class="ebg-detail-shape"><strong>Supporting shape:</strong> '+esc(a.shape)+'</p>';

    if (a.crystals && a.crystals.length){
      html += '<div class="ebg-detail-stones-title">Crystals for this area</div>';
      html += '<div class="ebg-stones-grid">';
      a.crystals.forEach(function(s){ html += renderCrystalCard(s); });
      html += '</div>';
    }
    html += '<p class="ebg-note">BTB feng shui places the front door along the bottom row (Knowledge, Career, Helpful People). This is a traditional framework for reflecting on your space &mdash; not a guarantee of outcomes.</p>';
    html += '</div>';
    return html;
  }

  function init(){
    var gridMount = document.getElementById('ebg-grid-mount');
    if (gridMount) gridMount.innerHTML = renderGrid();
    // 默认显示 Wealth 详情（打开即有内容，不空）
    var dm0 = document.getElementById('ebg-detail-mount');
    if (dm0) dm0.innerHTML = renderDetail('back_left');
    // 高亮 Wealth 宫为默认选中
    var wealthCell = document.querySelector('.ebg-cell[data-pos="back_left"]');
    if (wealthCell) wealthCell.classList.add('ebg-cell-active');
    // 点击宫
    document.querySelectorAll('.ebg-cell').forEach(function(btn){
      btn.addEventListener('click', function(){
        var pos = btn.getAttribute('data-pos');
        var allCells = document.querySelectorAll('.ebg-cell-active');
        for (var i=0;i<allCells.length;i++) allCells[i].classList.remove('ebg-cell-active');
        btn.classList.add('ebg-cell-active');
        var dm = document.getElementById('ebg-detail-mount');
        if (dm) { dm.innerHTML = renderDetail(pos); }
      });
    });
    // close 按钮（event delegation，避免 onclick 单引号嵌套冲突）
    document.addEventListener('click', function(e){
      if (e.target.classList && e.target.classList.contains('ebg-close')) {
        var dm = document.getElementById('ebg-detail-mount');
        if (dm) dm.innerHTML = '';
      }
    });
    // 流派切换
    var toggle = document.getElementById('ebg-school-toggle');
    if (toggle) {
      toggle.addEventListener('click', function(){
        var panel = document.getElementById('ebg-school-panel');
        if (panel) panel.classList.toggle('ebg-open');
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`;

function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');

const html = `<!-- ===== Bagua Map Tool v1.0 (feng shui tool #2) ===== -->
<div class="ebg-root">
  <div class="ebg-inner">

    <div class="ebg-hero">
      <h1 class="ebg-h1">Feng Shui Bagua Map</h1>
      <p class="ebg-sub">An interactive nine-area bagua map. <strong>Click any area below</strong> to see its element, colors, how to activate it, and the best crystals. The Wealth corner is shown by default &mdash; based on BTB (Black Sect) feng shui.</p>
    </div>

    <div class="ebg-school-bar">
      <button type="button" id="ebg-school-toggle" class="ebg-school-btn">BTB front-door alignment <span class="ebg-toggle-ico">▾</span></button>
      <div id="ebg-school-panel" class="ebg-school-panel">
        <p><strong>BTB (Black Sect, Western mainstream):</strong> The bagua aligns to your front door. Stand at the threshold facing in &mdash; the door sits along the bottom row (Knowledge, Career, Helpful People). Works for any floor plan, apartments included.</p>
        <p><strong>Classical / Compass:</strong> Areas align to fixed compass directions (Career = North, Fame = South, Wealth = Southeast) using the home's actual bearing. This tool defaults to BTB.</p>
      </div>
    </div>

    <div id="ebg-grid-mount"></div>

    <div id="ebg-detail-mount"></div>

    <div class="ebg-legend">
      <div class="ebg-leg-title">How to read this map</div>
      <p>The grid mirrors your space with the front door at the bottom. The far back-left corner is the Wealth area (BTB signature color: purple), back-center is Fame, back-right is Love. Click each area above for placement guidance and crystals.</p>
    </div>

    <!-- SEO Accordion -->
    <section class="ebg-seo-accordion" aria-label="Bagua map guide">
      <details class="ebg-seo-details">
        <summary>Learn More About the Feng Shui Bagua Map</summary>
        <div class="ebg-seo-content">
          <h2>What is a feng shui bagua map?</h2>
          <p>A bagua map is a feng shui tool that divides a space into nine areas, each relating to a theme of life such as wealth, career, love, family, or knowledge. In BTB (Black Sect) feng shui, the map aligns to your front door and overlays onto your floor plan so you can reflect on each area of life through the corresponding area of your home.</p>
          <h2>How to apply the bagua map to your home</h2>
          <p>Stand at your front door facing into the home and align the bottom row of the bagua (Knowledge, Career, Helpful People) with the door wall. The far back-left corner becomes the Wealth area, back-center is Fame, and back-right is Love. The map works on any shape, including apartments and irregular floor plans.</p>
          <h2>The nine areas of the bagua</h2>
          <p>The nine areas are: <strong>Wealth &amp; Prosperity</strong> (back-left, purple), <strong>Fame &amp; Reputation</strong> (back-center, red), <strong>Love &amp; Relationships</strong> (back-right, pink), <strong>Family &amp; Health</strong> (middle-left, green), <strong>Center / Health</strong> (yellow), <strong>Children &amp; Creativity</strong> (middle-right, white), <strong>Knowledge &amp; Self-Cultivation</strong> (front-left, blue), <strong>Career &amp; Life Path</strong> (front-center, black), and <strong>Helpful People &amp; Travel</strong> (front-right, gray).</p>
          <h2>BTB vs classical compass bagua</h2>
          <p>BTB (Black Sect) feng shui aligns the bagua to the front door regardless of compass direction, which suits modern apartments and homes. Classical or compass feng shui fixes the areas to compass bearings (Career in the North, Fame in the South, Wealth in the Southeast). This tool defaults to BTB, the most widely used school in Western feng shui.</p>
          <h2>Crystals for each bagua area</h2>
          <p>Each area pairs with a traditional element and color, and a set of crystals: amethyst for the Wealth corner (BTB purple signature), citrine for the Center, rose quartz for Love, black tourmaline for Career, carnelian for Fame. Click any area above to see its crystals and how to activate it. Crystal placements are traditional and symbolic, not a guarantee of outcomes.</p>
          <h3>Frequently asked questions</h3>
          <h3>What is a feng shui bagua map?</h3>
          <p>A bagua map divides a space into nine areas, each relating to a life theme. In BTB feng shui it aligns to the front door and overlays your floor plan.</p>
          <h3>How do I apply the bagua map to my home?</h3>
          <p>Stand at your front door facing in. The bottom row (Knowledge, Career, Helpful People) aligns with the door wall; the far back-left corner is the Wealth area.</p>
          <h3>What is the difference between BTB and classical compass bagua?</h3>
          <p>BTB aligns the bagua to the front door; classical fixes areas to compass bearings (Career North, Fame South). This tool uses BTB.</p>
          <h3>Which crystals go in the wealth corner?</h3>
          <p>In BTB the wealth corner (far back-left) uses purple, so amethyst is the traditional anchor, often with pyrite and green aventurine. Classical favors green stones.</p>
          <h3>Do I need all nine crystals?</h3>
          <p>No. Focus on the one or two areas that matter most right now. Feng shui is about intention, not a checklist.</p>
        </div>
      </details>
    </section>

  </div>
</div>

<style>
.ebg-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1A1A2E;line-height:1.6}
.ebg-inner{max-width:1140px;margin:0 auto;padding:24px 28px 40px}
.ebg-hero{text-align:center;margin-bottom:20px}
.ebg-h1{font-size:32px;font-weight:800;color:#1A1A2E;margin:0 0 8px;letter-spacing:-.01em}
.ebg-sub{font-size:15px;color:#5A5A6E;max-width:680px;margin:0 auto;line-height:1.65}
.ebg-school-bar{margin-bottom:22px;text-align:center}
.ebg-school-btn{background:#F4F0E6;border:1px solid #D5CFC2;color:#2D6A4F;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px;cursor:pointer}
.ebg-toggle-ico{font-size:11px;margin-left:4px}
.ebg-school-panel{text-align:left;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:10px;padding:14px 18px;margin-top:8px;max-width:680px;margin-left:auto;margin-right:auto;display:none;font-size:14px;color:#5A5A6E}
.ebg-school-panel.ebg-open{display:block}
.ebg-school-panel p{margin:0 0 8px}
.ebg-school-panel p:last-child{margin-bottom:0}
.ebg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;position:relative}
.ebg-door-label{grid-column:1/-1;text-align:center;font-size:11px;font-weight:700;color:#888;letter-spacing:.1em;margin-bottom:-4px;text-transform:uppercase}
.ebg-cell{background:#fff;border:2px solid var(--cell-c,#888);border-radius:12px;padding:14px 10px;text-align:center;cursor:pointer;transition:transform .15s,box-shadow .15s;font-family:inherit;color:#1A1A2E}
.ebg-cell:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.12)}
.ebg-cell-active{transform:translateY(-3px);box-shadow:0 8px 22px rgba(0,0,0,.2);border-width:3px;background:#FBF8F1}
.ebg-tri{font-size:22px;color:var(--cell-c);margin-bottom:4px;font-weight:700}
.ebg-cname{font-size:13px;font-weight:800;color:#1A1A2E;line-height:1.2;margin-bottom:3px}
.ebg-cstone{font-size:11px;color:#5A5A6E;font-style:italic}
.ebg-detail{background:#fff;border:1px solid #E8E2D5;border-left:5px solid var(--detail-c,#2D6A4F);border-radius:14px;padding:22px 24px;margin-bottom:22px}
.ebg-detail-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.ebg-detail-tri{font-size:34px;color:var(--detail-c);font-weight:700;flex-shrink:0}
.ebg-detail-name{font-size:22px;font-weight:800;color:#1A1A2E;margin:0 0 2px}
.ebg-detail-meta{font-size:13px;color:#5A5A6E;font-weight:600}
.ebg-close{margin-left:auto;background:none;border:none;font-size:28px;color:#888;cursor:pointer;line-height:1;padding:0 4px}
.ebg-detail-life{font-size:14px;color:#444;margin:0 0 12px}
.ebg-detail-act{background:#F0F5F1;border-left:3px solid var(--detail-c);padding:12px 14px;border-radius:0 8px 8px 0;margin-bottom:12px}
.ebg-act-lbl{display:block;font-size:11px;font-weight:700;color:var(--detail-c);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.ebg-detail-act p{margin:0;font-size:14px;color:#444;line-height:1.6}
.ebg-detail-shape{font-size:13px;color:#5A5A6E;margin:0 0 12px;font-style:italic}
.ebg-detail-stones-title{font-size:14px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px}
.ebg-stones-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:6px}
.ebg-stone-card{background:#FBF8F1;border:1px solid #E8E2D5;border-radius:10px;padding:12px;text-align:center}
.ebg-stone-img{width:70px;height:70px;object-fit:cover;border-radius:50%;margin:0 auto 8px;border:2px solid #CFAA3E;background:#F0F0F5}
.ebg-stone-ph{background:linear-gradient(135deg,#CFAA3E,#E8E2D5)}
.ebg-stone-name{font-size:14px;font-weight:800;color:#1A1A2E;margin-bottom:3px}
.ebg-stone-reason{font-size:11px;color:#5A5A6E;line-height:1.45;margin:0 0 6px;min-height:42px}
.ebg-stone-shop{font-size:12px;font-weight:700;color:#2D6A4F !important;text-decoration:none;border-bottom:1px solid #CFAA3E}
.ebg-note{font-size:12px;color:#888;font-style:italic;line-height:1.6;margin:12px 0 0}
.ebg-legend{background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px;padding:16px 20px;font-size:14px;color:#5A5A6E}
.ebg-leg-title{font-size:13px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.ebg-legend p{margin:0;line-height:1.65}
.ebg-seo-accordion{margin:32px 0 8px}
.ebg-seo-details{border:1px solid #E8E2D5;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ebg-seo-details summary{list-style:none;cursor:pointer;background:#F4F0E6;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;display:flex;justify-content:space-between;align-items:center}
.ebg-seo-details summary::-webkit-details-marker{display:none}
.ebg-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F;font-weight:300}
.ebg-seo-details[open] summary:after{content:'–'}
.ebg-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ebg-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px;letter-spacing:-.005em}
.ebg-seo-content h2:first-child{margin-top:0}
.ebg-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.ebg-seo-content p{margin:0 0 12px}
.ebg-seo-content strong{color:#2D6A4F}
@media(max-width:640px){.ebg-inner{padding:16px 14px 32px}.ebg-h1{font-size:25px}.ebg-cell{padding:10px 6px}.ebg-tri{font-size:18px}.ebg-cname{font-size:12px}.ebg-cstone{font-size:10px}.ebg-stones-grid{grid-template-columns:1fr}.ebg-detail{padding:16px 14px}.ebg-detail-name{font-size:19px}.ebg-seo-content{padding:18px 16px;font-size:15px}.ebg-seo-content h2{font-size:21px}.ebg-seo-content h3{font-size:17px}.ebg-seo-details summary{font-size:16px;padding:15px 16px}}
</style>

<script type="application/json" id="ebg-data">${DATA_BLOCK}</script>
<script type="text/plain" id="ebg-app">${APP_B64}</script>
<script>(function(){var b=document.getElementById('ebg-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EBG init failed',e);}})();</script>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a feng shui bagua map?","acceptedAnswer":{"@type":"Answer","text":"A bagua map is a feng shui tool that divides a space into nine areas, each relating to a theme of life such as wealth, career, love, family, or knowledge. In BTB (Black Sect) feng shui, the map aligns to your front door and overlays onto your floor plan so you can reflect on each area of life through the corresponding area of your home."}},
{"@type":"Question","name":"How do I apply the bagua map to my home?","acceptedAnswer":{"@type":"Answer","text":"In BTB feng shui, stand at your front door facing into the home and align the bottom row of the bagua (Knowledge, Career, Helpful People) with the door wall. The far back-left corner becomes the Wealth area, back-center is Fame, and back-right is Love. The map works on any shape, including apartments and irregular floor plans."}},
{"@type":"Question","name":"What is the difference between BTB and classical compass bagua?","acceptedAnswer":{"@type":"Answer","text":"BTB (Black Sect) feng shui aligns the bagua to the front door regardless of compass direction, which suits modern apartments and homes. Classical or compass feng shui fixes the areas to compass bearings (Career in the North, Fame in the South, Wealth in the Southeast). This tool defaults to BTB, the most widely used school in Western feng shui."}},
{"@type":"Question","name":"Which crystals go in the wealth corner?","acceptedAnswer":{"@type":"Answer","text":"In BTB feng shui the wealth corner (far back-left) uses purple as its signature color, so amethyst is the traditional anchor crystal, often paired with pyrite and green aventurine. Classical feng shui may favor green stones for this area instead. Crystal placements are traditional and symbolic, not a guarantee of wealth."}},
{"@type":"Question","name":"Do I need all nine crystals for the bagua to work?","acceptedAnswer":{"@type":"Answer","text":"No. Feng shui is about intention and reflection, not a checklist. You can focus on one or two areas that matter most to you right now. Crystals, plants, colors, and meaningful objects are all ways to support an area — choose what feels right rather than completing a set."}}
]}
</script>
<!-- ===== End Bagua Map Tool v1.0 ===== -->`;

const OUT = path.resolve(__dirname, 'bagua-map.html');
fs.writeFileSync(OUT, html, 'utf8');
const KB = (fs.statSync(OUT).size / 1024).toFixed(1);

// 合规门
const BLACK = /\\b(cures|treats illness|guarantees wealth|will bring wealth|removes negative energy)\\b/gi;
const ALLOW_BEFORE = /\\b(not\\s+(a|the)\\s+|no\\s+|never\\s+)/i;
function isAllowed(src, idx){ return ALLOW_BEFORE.test(src.substring(Math.max(0, idx - 40), idx)); }
let violations = [];
[html, APP_JS].forEach(function (src) { var re = new RegExp(BLACK.source, BLACK.flags); var m; while ((m = re.exec(src)) !== null) { if (!isAllowed(src, m.index)) violations.push(m[0] + ' @' + m.index); } });

console.log('Bagua Map Tool v1.0 generated:', OUT);
console.log('  size:', KB, 'KB | areas:', AREAS.length, ' | crystals covered:', Object.keys(BY_SLUG).length);
console.log('  DATA_BLOCK:', DATA_BLOCK.length, 'chars | APP_B64:', APP_B64.length, 'chars');
console.log('  compliance violations:', violations.length === 0 ? 'NONE (PASS)' : violations.join('; '));
