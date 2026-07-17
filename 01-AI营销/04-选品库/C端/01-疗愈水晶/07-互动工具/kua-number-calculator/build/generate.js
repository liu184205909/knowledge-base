/**
 * Kua Number Calculator v1.0 — 风水工具三件套 #1（P0）
 *
 * 定位：转化型风水工具。生日+性别 → 立春Feb4太阳历校正 → 八宅Ba Zhai Kua数 →
 *      4吉4凶方向(双语) + 八卦Trigram + 五行Element + 东西四命 + 罗盘SVG可视化 +
 *      本命水晶3颗(Element×Color×390库,竞品0覆盖的差异化) + 方向手链 + 家居应用。
 *
 * 竞品调研(2026-07-16, SERP驱动): wofs/squaredaway/baguame(功能天花板但0水晶推荐)。
 * 差异化: baguame做到Trigram+家居应用,但全行业无Kua结果后推荐实物水晶。goearthward独占。
 *
 * 3精度点(E-E-A-T必守): 立春Feb4太阳历年份切换 / 八宅八方向双语 / Kua5男归2女归8
 *
 * 数据源: _shared/kua-knowledge.json(8 Kua×方向/Trigram/Element/本命水晶) +
 *         crystal-meaning-search/data/search-data.json(水晶img/shop三级降级)
 *
 * T17/daily-tarot 教训严守: 1份generate.js / 浅色品牌(白+#2D6A4F绿+#CFAA3E金) /
 *   嵌入式max-width1080 / base64包装APP_JS(CJK+&&/<) + asciiJSON数据 / ekua-前缀 /
 *   避headless Playwright / draft部署 / 合规(invites/aligns/not a guarantee,禁cures·guarantees·will bring)
 *
 * Shop三级降级: CATEGORY→SEARCH→HEALING。输出: ./kua-calculator.html
 */
const fs = require('fs');
const path = require('path');

// ===== 数据加载 =====
const ROOT = path.resolve(__dirname, '../..');
const KK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/kua-knowledge.json'), 'utf8'));
const SD_PATH = path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json');
let SD = { crystals: [] };
try { SD = JSON.parse(fs.readFileSync(SD_PATH, 'utf8')); } catch (e) { console.log('  ⚠ search-data.json 未找到，水晶 img/shop 用兜底'); }

const HEALING = '/product-category/healing-crystals-jewelry/';
function normSlug(s) { return s ? String(s).replace(/-meaning$/, '') : s; }
const BY_SLUG = {};
(SD.crystals || []).forEach(c => {
  BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || ('/shop/?s=' + normSlug(c.slug)) };
});
function stoneName(slug) {
  const a = BY_SLUG[normSlug(slug)];
  if (a && a.name) return a.name;
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function enrichStone(s) {
  if (!s) return null;
  const sc = BY_SLUG[normSlug(s.slug)] || { name: stoneName(s.slug), img: '', shop: HEALING };
  return { slug: s.slug, name: sc.name || stoneName(s.slug), reason: s.reason || '', img: sc.img, shop: sc.shop };
}

// ===== 8 Kua 精简（工具用字段）=====
const DIRECTIONS_META = KK._meta.direction_names;
const KUAS = KK.kua_numbers.map(k => ({
  kua: k.kua,
  trigram: k.trigram,
  element: k.element,
  group: k.group,
  colors: k.lucky_colors || [],
  directions: k.directions,
  personality: k.personality || '',
  home: k.home_application || '',
  crystals: (k.birth_crystals || []).map(c => enrichStone({ slug: c.slug, reason: c.reason })),
  bracelets: (k.direction_bracelets || []).map(b => ({ direction: b.direction, intent: b.intent, slug: b.slug, name: stoneName(b.slug) }))
}));

// ===== asciiJSON（CJK转义，wp_kses防）=====
function stripCJK(s){ return String(s==null?'':s).replace(/[一-鿿]/g,'').replace(/\s+/g,' ').replace(/[()（）]\s*[()（）]/g,'').replace(/\s+$/,'').trim(); }
const DIRNAMES_CLEAN = { auspicious: {}, inauspicious: {} };
Object.keys(DIRECTIONS_META.auspicious || {}).forEach(function(k){ DIRNAMES_CLEAN.auspicious[k] = stripCJK(DIRECTIONS_META.auspicious[k]); });
Object.keys(DIRECTIONS_META.inauspicious || {}).forEach(function(k){ DIRNAMES_CLEAN.inauspicious[k] = stripCJK(DIRECTIONS_META.inauspicious[k]); });
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({
  kuas: KUAS,
  dir_names: DIRNAMES_CLEAN,
  healing: HEALING,
  li_chun_note: 'Feng shui uses the solar calendar — the year begins at Li Chun (Start of Spring, ~February 4). If you were born Jan 1 – Feb 3, your feng shui birth year is the previous year.'
});

// ===== APP_JS（Kua算法 + 立春 + 罗盘SVG + 渲染）=====
const APP_JS = `(function(){
  var DATA;
  try { DATA = JSON.parse(document.getElementById('ekua-data').textContent); }
  catch (e) { console.error('EKUA data parse failed', e); return; }
  var KUAS = DATA.kuas, DIRNAMES = DATA.dir_names, HEALING = DATA.healing;
  var KUA_BY_NUM = {}; KUAS.forEach(function(k){ KUA_BY_NUM[k.kua] = k; });

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function shopUrl(stone){ if(!stone) return HEALING; if(stone.shop) return stone.shop; if(stone.slug) return '/shop/?s='+encodeURIComponent(stone.slug); return HEALING; }

  // ===== Kua 计算（立春 Feb4 + 八宅公式）=====
  function calcKua(y, mo, da, g){
    // 立春 Feb4 太阳历年份校正
    if (mo < 2 || (mo === 2 && da < 4)) y = y - 1;
    // 后两位相加到单数字 d
    var d = y % 100;
    while (d >= 10) { var ds = String(d).split(''); d = 0; ds.forEach(function(c){ d += parseInt(c,10); }); }
    var k;
    if (g === 'male') k = (y >= 2000) ? (9 - d) : (10 - d);
    else k = (y >= 2000) ? (d + 6) : (d + 5);
    // 归约到 1-9
    while (k >= 10) { var ks = String(k).split(''); k = 0; ks.forEach(function(c){ k += parseInt(c,10); }); }
    if (k <= 0) k += 9;
    // Kua 5: 男归2(Kun) / 女归8(Gen)
    if (k === 5) k = (g === 'male') ? 2 : 8;
    return k;
  }

  // 8 方位罗盘 SVG（N/NE/E/SE/S/SW/W/NW）
  var COMPASS_ORDER = ['N','NE','E','SE','S','SW','W','NW'];
  var COMPASS_ANGLE = { N:-90, NE:-45, E:0, SE:45, S:90, SW:135, W:180, NW:-135 };
  var AUSPICIOUS = ['sheng_chi','tien_yi','nien_yen','fu_wei'];
  function renderCompass(kua){
    var dirs = kua.directions;
    var svg = '<svg class="ekua-compass" viewBox="0 0 320 320" role="img" aria-label="Kua '+kua.kua+' compass">';
    svg += '<circle cx="160" cy="160" r="150" class="ekua-c-ring"/>';
    // 8 扇区
    COMPASS_ORDER.forEach(function(dir){
      var ang = COMPASS_ANGLE[dir];
      var isGood = AUSPICIOUS.some(function(key){ return dirs[key] === dir; });
      // 找该方位对应的方向键
      var keyForDir = null, label = '';
      Object.keys(dirs).forEach(function(key){ if (dirs[key] === dir) { keyForDir = key; } });
      if (keyForDir && DIRNAMES.auspicious[keyForDir]) label = DIRNAMES.auspicious[keyForDir].split(' ')[0];
      else if (keyForDir && DIRNAMES.inauspicious[keyForDir]) label = DIRNAMES.inauspicious[keyForDir].split(' ')[0];
      var cls = isGood ? 'ekua-c-good' : (keyForDir ? 'ekua-c-bad' : 'ekua-c-neutral');
      var rad = ang * Math.PI / 180;
      var tx = 160 + Math.cos(rad) * 110, ty = 160 + Math.sin(rad) * 110;
      svg += '<g class="'+cls+'">';
      // 扇区弧（简化用圆点 + 标签）
      svg += '<circle cx="'+tx.toFixed(1)+'" cy="'+ty.toFixed(1)+'" r="26" class="ekua-c-sect"/>';
      svg += '<text x="'+tx.toFixed(1)+'" y="'+(ty-6).toFixed(1)+'" class="ekua-c-dir">'+dir+'</text>';
      svg += '<text x="'+tx.toFixed(1)+'" y="'+(ty+10).toFixed(1)+'" class="ekua-c-lbl">'+esc(label)+'</text>';
      svg += '</g>';
    });
    // 中心 Kua
    svg += '<circle cx="160" cy="160" r="44" class="ekua-c-center"/>';
    svg += '<text x="160" y="156" class="ekua-c-center-num">'+kua.kua+'</text>';
    svg += '<text x="160" y="174" class="ekua-c-center-lbl">KUA</text>';
    svg += '</svg>';
    return svg;
  }

  function renderDirectionRow(key, dir, type){
    var name = DIRNAMES[type][key] || key;
    var cls = type === 'auspicious' ? 'ekua-good' : 'ekua-bad';
    var ico = type === 'auspicious' ? '✓' : '✗';
    return '<div class="ekua-dir-row '+cls+'"><span class="ekua-dir-ico">'+ico+'</span><span class="ekua-dir-name">'+esc(name)+'</span><span class="ekua-dir-pos">'+dir+'</span></div>';
  }

  function renderCrystalCard(stone){
    if (!stone) return '';
    var img = stone.img ? '<img class="ekua-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">' : '<div class="ekua-stone-img ekua-stone-ph"></div>';
    return '<div class="ekua-stone-card">'+img+
      '<div class="ekua-stone-body"><div class="ekua-stone-name">'+esc(stone.name)+'</div>'+
      '<p class="ekua-stone-reason">'+esc(stone.reason)+'</p>'+
      '<a class="ekua-stone-shop" href="'+esc(shopUrl(stone))+'">Shop '+esc(stone.name)+' &rarr;</a></div></div>';
  }

  function render(kua, gender, birthStr){
    var el = document.getElementById('ekua-result'); if (!el) return;
    var dirs = kua.directions;
    var html = '';
    // 结果头：Kua + Trigram + Element + Group
    html += '<div class="ekua-res-head">';
    html += '<div class="ekua-res-badge">Kua Number <strong>'+kua.kua+'</strong></div>';
    html += '<div class="ekua-res-meta"><span class="ekua-tri">'+esc(kua.trigram.symbol)+' '+esc(kua.trigram.name)+'</span> · <span class="ekua-el">'+esc(kua.element)+'</span> element · <span class="ekua-grp">'+esc(kua.group)+' Group</span></div>';
    html += '<div class="ekua-res-colors">Lucky colors: '+kua.colors.map(esc).join(', ')+'</div>';
    html += '</div>';

    // 罗盘 + 方向列表
    html += '<div class="ekua-compass-row">';
    html += '<div class="ekua-compass-mount">'+renderCompass(kua)+'</div>';
    html += '<div class="ekua-dirs-col">';
    html += '<div class="ekua-dirs-title">Your 4 Auspicious Directions</div>';
    html += renderDirectionRow('sheng_chi', dirs.sheng_chi, 'auspicious');
    html += renderDirectionRow('tien_yi', dirs.tien_yi, 'auspicious');
    html += renderDirectionRow('nien_yen', dirs.nien_yen, 'auspicious');
    html += renderDirectionRow('fu_wei', dirs.fu_wei, 'auspicious');
    html += '<div class="ekua-dirs-title ekua-dirs-title-bad">4 Challenging Directions</div>';
    html += renderDirectionRow('ho_hai', dirs.ho_hai, 'inauspicious');
    html += renderDirectionRow('wu_kwei', dirs.wu_kwei, 'inauspicious');
    html += renderDirectionRow('liu_sha', dirs.liu_sha, 'inauspicious');
    html += renderDirectionRow('chueh_ming', dirs.chueh_ming, 'inauspicious');
    html += '</div></div>';

    // 本命水晶（差异化，竞品0覆盖）
    if (kua.crystals && kua.crystals.length){
      html += '<section class="ekua-module ekua-m-stones">';
      html += '<div class="ekua-mod-head"><span class="ekua-mod-num ekua-mod-gold">★</span><h2>Your Birth Crystals</h2></div>';
      html += '<p class="ekua-lede-soft">Crystals traditionally paired with '+esc(kua.element)+' energy and your Kua '+kua.kua+' directions &mdash; a mindful companion, not a guarantee.</p>';
      html += '<div class="ekua-stones-grid">';
      kua.crystals.forEach(function(c){ html += renderCrystalCard(c); });
      html += '</div></section>';
    }

    // 方向手链（4吉方向×意图）
    if (kua.bracelets && kua.bracelets.length){
      html += '<section class="ekua-module"><div class="ekua-mod-head"><span class="ekua-mod-num">◈</span><h2>Direction Bracelets</h2></div>';
      html += '<div class="ekua-bracelets">';
      kua.bracelets.forEach(function(b){
        html += '<a class="ekua-bracelet" href="'+esc(shopUrl({slug:b.slug}))+'"><span class="ekua-b-intent">'+esc(b.intent)+'</span><span class="ekua-b-name">'+esc(b.name)+'</span></a>';
      });
      html += '</div></section>';
    }

    // 性格 + 家居应用
    if (kua.personality){
      html += '<section class="ekua-module"><div class="ekua-mod-head"><span class="ekua-mod-num">①</span><h2>Your Energy Profile</h2></div>';
      html += '<p class="ekua-body">'+esc(kua.personality)+'</p>';
      if (kua.home) html += '<div class="ekua-home"><span class="ekua-home-lbl">Home application</span><p>'+esc(kua.home)+'</p></div>';
      html += '</section>';
    }

    // 免责
    html += '<p class="ekua-note">Based on classical Ba Zhai (Eight Mansions) feng shui and the Li Chun solar-year rule. '+esc(DATA.li_chun_note)+' Directions are a traditional framework for arranging your space &mdash; a tool for reflection, not a guarantee of outcomes, and not medical or financial advice.</p>';

    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 表单提交 =====
  function init(){
    var form = document.getElementById('ekua-form');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var y = parseInt(document.getElementById('ekua-year').value, 10);
      var mo = parseInt(document.getElementById('ekua-month').value, 10);
      var da = parseInt(document.getElementById('ekua-day').value, 10);
      var g = document.querySelector('input[name="ekua-gender"]:checked');
      if (!y || !mo || !da || !g) { alert('Please enter your birth date and gender.'); return; }
      g = g.value;
      var kuaNum = calcKua(y, mo, da, g);
      var kua = KUA_BY_NUM[kuaNum];
      if (!kua) { alert('Kua ' + kuaNum + ' data missing.'); return; }
      render(kua, g, mo + '/' + da + '/' + y);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`;

// ===== asciiEscape + base64 =====
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');

// ===== HTML =====
const html = `<!-- ===== Kua Number Calculator v1.0 (feng shui tool #1) ===== -->
<div class="ekua-root">
  <div class="ekua-inner">

    <div class="ekua-hero">
      <h1 class="ekua-h1">Kua Number Calculator</h1>
      <p class="ekua-sub">Find your feng shui Kua (Gua) number, your four auspicious and four challenging directions, and the birth crystals traditionally paired with your energy &mdash; based on classical Ba Zhai (Eight Mansions) feng shui.</p>
    </div>

    <!-- Input form -->
    <form id="ekua-form" class="ekua-form" onsubmit="return false;">
      <div class="ekua-form-title">Enter your birth details</div>
      <div class="ekua-form-row">
        <label class="ekua-field">Month
          <select id="ekua-month" required><option value="">MM</option>${Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}</select>
        </label>
        <label class="ekua-field">Day
          <select id="ekua-day" required><option value="">DD</option>${Array.from({length:31},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}</select>
        </label>
        <label class="ekua-field">Year
          <select id="ekua-year" required><option value="">YYYY</option>${Array.from({length:120},(_,i)=>`${2026-i}`).map(y=>`<option value="${y}">${y}</option>`).join('')}</select>
        </label>
      </div>
      <div class="ekua-gender-row">
        <label class="ekua-gender"><input type="radio" name="ekua-gender" value="male" required> Male</label>
        <label class="ekua-gender"><input type="radio" name="ekua-gender" value="female" required> Female</label>
      </div>
      <button type="submit" class="ekua-submit">Reveal My Kua Number &rarr;</button>
      <p class="ekua-form-hint">Feng shui uses the solar year (starts ~Feb 4, Li Chun). Born Jan 1–Feb 3? We auto-adjust to the prior year.</p>
    </form>

    <!-- Result mount -->
    <div id="ekua-result" class="ekua-result"></div>

    <!-- SEO Accordion -->
    <section class="ekua-seo-accordion" aria-label="Kua number guide">
      <details class="ekua-seo-details">
        <summary>Learn More About Kua Numbers</summary>
        <div class="ekua-seo-content">
          <h2>What is a Kua number in feng shui?</h2>
          <p>A Kua number (also called Gua number) is a number from 1 to 9 used in classical Ba Zhai (Eight Mansions) feng shui. Calculated from your birth year and gender, it reveals your four auspicious and four challenging compass directions — a traditional framework for arranging your bed, desk, and stove to align with supportive energy. It is a tool for reflection, not a guarantee of outcomes.</p>
          <h2>How to calculate your Kua number</h2>
          <p>Take the last two digits of your birth year, add them together, and reduce to a single digit. Males subtract that digit from 10 (for births 1900–1999) or 9 (for births 2000 onward); females add 5 (1900s) or 6 (2000s), then reduce to a single digit. If the result is 5, males use 2 and females use 8. Feng shui follows the solar calendar, so if you were born between January 1 and February 3 (before Li Chun, the Start of Spring around February 4), use the previous year as your birth year.</p>
          <h2>Your four auspicious directions</h2>
          <p>Each Kua number has four supportive directions: <strong>Sheng Chi</strong> (success and wealth), <strong>Tien Yi</strong> (health), <strong>Nien Yen</strong> (love and relationships), and <strong>Fu Wei</strong> (stability and personal growth). The four challenging directions — Ho Hai, Wu Kwei, Liu Sha, and Chueh Ming — are traditionally avoided for the orientation of beds and desks. Kua numbers 1, 3, 4, and 9 belong to the East group; 2, 6, 7, and 8 to the West group.</p>
          <h2>Kua numbers and birth crystals</h2>
          <p>Each Kua number belongs to one of the five elements — Water, Wood, Fire, Earth, or Metal. This calculator pairs you with three birth crystals traditionally aligned with your element and lucky colors, drawn from a library of over 390 stones. Crystal pairings are traditional and symbolic, not a medical claim.</p>
          <h2>BTB vs classical feng shui</h2>
          <p>The Kua number system comes from classical (compass) feng shui and the Eight Mansions tradition. BTB (Black Sect) feng shui, the most widely practiced school in the West, uses the front door rather than compass directions to place the bagua. The two can be used alongside each other — this calculator focuses on the classical Kua direction system.</p>
          <h3>Frequently asked questions</h3>
          <h3>What is a Kua number in feng shui?</h3>
          <p>A Kua number is a number from 1 to 9 used in classical Eight Mansions feng shui, calculated from your birth year and gender. It reveals your four auspicious and four challenging directions for success, health, relationships, and stability.</p>
          <h3>How do I calculate my Kua number?</h3>
          <p>Add the last two digits of your birth year and reduce to a single digit. Males subtract from 10 (1900s) or 9 (2000s); females add 5 (1900s) or 6 (2000s), then reduce. If born January 1 – February 3, use the prior year (Li Chun solar rule).</p>
          <h3>Why does my birth date before February 4 change my Kua number?</h3>
          <p>Feng shui uses the solar calendar, and the Chinese solar year begins at Li Chun (Start of Spring, ~February 4). If you were born before that date, your feng shui birth year is the previous calendar year.</p>
          <h3>Which crystals match my Kua number?</h3>
          <p>Each Kua number belongs to one of the five elements. This calculator pairs you with three birth crystals aligned with your element and lucky colors from a 390-stone library. Pairings are traditional and symbolic.</p>
          <h3>Is the Kua number different for males and females?</h3>
          <p>Yes. The formula differs by gender (males subtract, females add), so the same birth date yields different Kua numbers for men and women, reflecting the classical Eight Mansions tradition.</p>
          <h3>Are Kua numbers scientifically proven?</h3>
          <p>No. Feng shui is a traditional cultural practice. Kua numbers and their directions are a framework for reflection, not a scientifically proven system and not a guarantee of specific results, wealth, or outcomes.</p>
        </div>
      </details>
    </section>

  </div>
</div>

<style>
.ekua-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1A1A2E;line-height:1.6}
.ekua-inner{max-width:1140px;margin:0 auto;padding:24px 28px 40px}
.ekua-hero{text-align:center;margin-bottom:28px}
.ekua-h1{font-size:34px;font-weight:800;color:#1A1A2E;margin:0 0 10px;letter-spacing:-.01em}
.ekua-sub{font-size:16px;color:#5A5A6E;max-width:720px;margin:0 auto;line-height:1.65}
.ekua-form{background:#fff;border:1px solid #E8E2D5;border-radius:16px;padding:28px 30px;margin-bottom:28px;max-width:560px;margin-left:auto;margin-right:auto}
.ekua-form-title{font-size:15px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}
.ekua-form-row{display:flex;gap:12px;margin-bottom:16px}
.ekua-field{flex:1;display:flex;flex-direction:column;font-size:13px;font-weight:600;color:#5A5A6E}
.ekua-field select{margin-top:5px;padding:11px 10px;border:1px solid #D5CFC2;border-radius:8px;font-size:15px;background:#fff;color:#1A1A2E}
.ekua-gender-row{display:flex;gap:14px;margin-bottom:18px}
.ekua-gender{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border:1px solid #D5CFC2;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;background:#fff}
.ekua-gender input{accent-color:#2D6A4F}
.ekua-submit{width:100%;background:#2D6A4F;color:#fff;border:none;border-radius:10px;padding:14px;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s}
.ekua-submit:hover{background:#1B4332}
.ekua-form-hint{font-size:12px;color:#888;margin:10px 0 0;line-height:1.5;font-style:italic}
.ekua-result{margin-top:8px}
.ekua-res-head{text-align:center;margin-bottom:24px}
.ekua-res-badge{display:inline-block;background:#CFAA3E;color:#fff;font-size:15px;font-weight:600;padding:7px 18px;border-radius:20px;margin-bottom:10px}
.ekua-res-badge strong{font-size:22px;font-weight:800;margin-left:4px}
.ekua-res-meta{font-size:16px;color:#1A1A2E;font-weight:600;margin-bottom:6px}
.ekua-tri{color:#2D6A4F;font-weight:700}
.ekua-el{color:#CFAA3E;font-weight:700}
.ekua-res-colors{font-size:14px;color:#5A5A6E;font-style:italic}
.ekua-compass-row{display:grid;grid-template-columns:340px 1fr;gap:28px;background:linear-gradient(135deg,#FBF8F1 0%,#fff 100%);border:1px solid #E8E2D5;border-radius:16px;padding:26px;margin-bottom:24px;align-items:center}
.ekua-compass{width:100%;max-width:320px;height:auto}
.ekua-c-ring{fill:none;stroke:#E8E2D5;stroke-width:2}
.ekua-c-sect{fill:#F4F0E6;stroke:#D5CFC2;stroke-width:1}
.ekua-c-good .ekua-c-sect{fill:#D4E9DD;stroke:#2D6A4F}
.ekua-c-bad .ekua-c-sect{fill:#F0E0E0;stroke:#A05050}
.ekua-c-dir{text-anchor:middle;font-size:11px;font-weight:800;fill:#1A1A2E}
.ekua-c-lbl{text-anchor:middle;font-size:8px;fill:#5A5A6E}
.ekua-c-good .ekua-c-lbl{fill:#1B4332;font-weight:600}
.ekua-c-bad .ekua-c-lbl{fill:#804040}
.ekua-c-center{fill:#2D6A4F;stroke:#CFAA3E;stroke-width:3}
.ekua-c-center-num{text-anchor:middle;font-size:24px;font-weight:800;fill:#fff}
.ekua-c-center-lbl{text-anchor:middle;font-size:9px;fill:#CFAA3E;letter-spacing:.1em;font-weight:700}
.ekua-dirs-col{}
.ekua-dirs-title{font-size:14px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px}
.ekua-dirs-title-bad{color:#804040;margin-top:14px}
.ekua-dir-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F0EDE5;font-size:14px}
.ekua-dir-ico{font-weight:800;width:18px}
.ekua-good .ekua-dir-ico{color:#2D6A4F}
.ekua-bad .ekua-dir-ico{color:#A05050}
.ekua-dir-name{flex:1;color:#1A1A2E}
.ekua-dir-pos{font-weight:700;color:#5A5A6E}
.ekua-module{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:24px 26px;margin-bottom:20px}
.ekua-m-stones{background:linear-gradient(135deg,#FBF8F1 0%,#fff 70%);border-color:#CFAA3E}
.ekua-mod-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ekua-mod-num{background:#2D6A4F;color:#fff;font-size:14px;font-weight:800;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:7px}
.ekua-mod-gold{background:#CFAA3E}
.ekua-mod-head h2{font-size:21px;font-weight:800;color:#1A1A2E;margin:0}
.ekua-lede-soft{font-size:14px;color:#5A5A6E;font-style:italic;margin:0 0 14px}
.ekua-body{font-size:15px;color:#444;margin:0 0 12px;line-height:1.7}
.ekua-stones-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ekua-stone-card{background:#fff;border:1px solid #E8E2D5;border-radius:12px;padding:14px;text-align:center}
.ekua-stone-img{width:80px;height:80px;object-fit:cover;border-radius:50%;margin:0 auto 10px;border:2px solid #CFAA3E;background:#F0F0F5}
.ekua-stone-ph{background:linear-gradient(135deg,#CFAA3E,#E8E2D5)}
.ekua-stone-name{font-size:15px;font-weight:800;color:#1A1A2E;margin-bottom:4px}
.ekua-stone-reason{font-size:12px;color:#5A5A6E;line-height:1.5;margin:0 0 8px;min-height:50px}
.ekua-stone-shop{font-size:13px;font-weight:700;color:#2D6A4F !important;text-decoration:none;border-bottom:2px solid #CFAA3E;padding-bottom:1px}
.ekua-bracelets{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.ekua-bracelet{display:flex;flex-direction:column;background:#F4F0E6;border:1px solid #E8E2D5;border-radius:10px;padding:12px 14px;text-decoration:none;transition:border-color .2s}
.ekua-bracelet:hover{border-color:#CFAA3E}
.ekua-b-intent{font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.04em}
.ekua-b-name{font-size:15px;font-weight:700;color:#1A1A2E;margin-top:2px}
.ekua-home{background:#F0F5F1;border-left:3px solid #2D6A4F;padding:12px 14px;border-radius:0 8px 8px 0;margin-top:8px}
.ekua-home-lbl{display:block;font-size:11px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.ekua-home p{margin:0;font-size:14px;color:#444;line-height:1.6}
.ekua-note{font-size:13px;color:#888;font-style:italic;line-height:1.65;margin:20px 0 0;padding:0 10px}
.ekua-seo-accordion{margin:32px 0 8px}
.ekua-seo-details{border:1px solid #E8E2D5;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ekua-seo-details summary{list-style:none;cursor:pointer;background:#F4F0E6;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;display:flex;justify-content:space-between;align-items:center}
.ekua-seo-details summary::-webkit-details-marker{display:none}
.ekua-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F;font-weight:300}
.ekua-seo-details[open] summary:after{content:'–'}
.ekua-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ekua-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px;letter-spacing:-.005em}
.ekua-seo-content h2:first-child{margin-top:0}
.ekua-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.ekua-seo-content p{margin:0 0 12px}
.ekua-seo-content strong{color:#2D6A4F}
@media(max-width:640px){.ekua-seo-content{padding:18px 16px;font-size:15px}.ekua-seo-content h2{font-size:21px}.ekua-seo-content h3{font-size:17px}.ekua-seo-details summary{font-size:16px;padding:15px 16px}}
@media(max-width:900px){.ekua-compass-row{grid-template-columns:1fr;text-align:center}.ekua-stones-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.ekua-inner{padding:16px 14px 32px}.ekua-h1{font-size:26px}.ekua-form{padding:20px 18px}.ekua-form-row{flex-wrap:wrap}.ekua-field{min-width:90px}.ekua-stones-grid{grid-template-columns:1fr}.ekua-bracelets{grid-template-columns:1fr}.ekua-mod-head h2{font-size:18px}}
</style>

<script type="application/json" id="ekua-data">${DATA_BLOCK}</script>
<script type="text/plain" id="ekua-app">${APP_B64}</script>
<script>(function(){var b=document.getElementById('ekua-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EKUA init failed',e);}})();</script>

<!-- ===== Kua Calculator Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a Kua number in feng shui?","acceptedAnswer":{"@type":"Answer","text":"A Kua number (also called Gua number) is a number from 1 to 9 used in classical Ba Zhai (Eight Mansions) feng shui. It is calculated from your birth year and gender, and reveals your four auspicious and four challenging compass directions for success, health, relationships, and stability. It is a traditional framework for arranging your space, not a guarantee of outcomes."}},
{"@type":"Question","name":"How do I calculate my Kua number?","acceptedAnswer":{"@type":"Answer","text":"Take the last two digits of your birth year, add them, and reduce to a single digit. Males subtract that digit from 10 (1900s) or 9 (2000s); females add 5 (1900s) or 6 (2000s), then reduce to a single digit. If the result is 5, males use 2 and females use 8. Feng shui uses the solar calendar, so if you were born January 1 to February 3 (before Li Chun, around February 4), use the previous year."}},
{"@type":"Question","name":"Why does my birth date before February 4 change my Kua number?","acceptedAnswer":{"@type":"Answer","text":"Feng shui follows the solar calendar, and the Chinese solar year begins at Li Chun (Start of Spring), which falls around February 4 each year. If you were born between January 1 and February 3, your feng shui birth year is the previous calendar year. This calculator applies the Li Chun adjustment automatically."}},
{"@type":"Question","name":"Which crystals match my Kua number?","acceptedAnswer":{"@type":"Answer","text":"Each Kua number belongs to one of the five elements (Water, Wood, Fire, Earth, or Metal). This calculator pairs you with three birth crystals traditionally aligned with your element and lucky colors, drawn from a library of over 390 stones. Crystal pairings are traditional and symbolic, not a medical claim."}},
{"@type":"Question","name":"Is the Kua number different for males and females?","acceptedAnswer":{"@type":"Answer","text":"Yes. The Kua formula differs by gender: males subtract from 10 (or 9 for births after 2000) and females add 5 (or 6 for births after 2000), so the same birth date yields different Kua numbers for men and women. This reflects the classical Eight Mansions tradition."}},
{"@type":"Question","name":"Are Kua numbers and feng shui directions scientifically proven?","acceptedAnswer":{"@type":"Answer","text":"No. Feng shui is a traditional cultural practice for arranging your environment to support intention and wellbeing. Kua numbers and their directions are a framework for reflection, not a scientifically proven system and not a guarantee of specific results, wealth, or outcomes. They are best used as a mindful lens alongside your own judgment."}}
]}
</script>
<!-- ===== End Kua Number Calculator v1.0 ===== -->`;

// ===== 写出 + 合规门 =====
const OUT = path.resolve(__dirname, 'kua-calculator.html');
fs.writeFileSync(OUT, html, 'utf8');
const KB = (fs.statSync(OUT).size / 1024).toFixed(1);

const BLACK = { health: /\\b(cures|treats illness|heals disease)\\b/gi, finance: /\\b(guaranteed return|get rich|wealth guaranteed)\\b/gi, deterministic: /\\b(will bring wealth|guarantees success|guarantees wealth)\\b/gi };
const ALLOW_BEFORE = /\\b(not\\s+(a|a\\s+medical|the)\\s+|no\\s+|never\\s+)/i;
function isAllowed(src, idx){ return ALLOW_BEFORE.test(src.substring(Math.max(0, idx - 40), idx)); }
let violations = [];
[html, APP_JS].forEach(function (src) {
  Object.keys(BLACK).forEach(function (k) {
    var re = new RegExp(BLACK[k].source, BLACK[k].flags); var m;
    while ((m = re.exec(src)) !== null) { if (!isAllowed(src, m.index)) violations.push(k + ': ' + m[0] + ' @' + m.index); }
  });
});

console.log('Kua Number Calculator v1.0 generated:', OUT);
console.log('  size:', KB, 'KB | kuas:', KUAS.length, ' crystals covered:', Object.keys(BY_SLUG).length);
console.log('  DATA_BLOCK:', DATA_BLOCK.length, 'chars | APP_B64:', APP_B64.length, 'chars');
console.log('  compliance violations:', violations.length === 0 ? 'NONE (PASS)' : violations.join('; '));
