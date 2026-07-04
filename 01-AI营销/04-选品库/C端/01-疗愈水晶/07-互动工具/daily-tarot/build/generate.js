/**
 * Daily Tarot v1.0 — 每日运势工具页（第 19 个工具）
 *
 * 定位：留存 + Shop 转化（非 SEO 获客）。全站当天共享同一张牌，用户进入页面即见当日定局，
 *      无需抽牌操作。JS 日期种子渲染（PRD §4 方案 A：读 daily-knowledge.json dates[today].card 预分配）。
 *
 * 6 模块（PRD §4）：
 *   Hero   今日牌（牌图 + 牌名 + 日期 + 一句话能量）+ 分享按钮
 *   M1     Today's Card Energy（今日牌落点 × 当日星象）
 *   M2 ⭐  Today's Crystal + Shop CTA（best_daily_wear，核心转化，三级降级）
 *   M3     Eastern Hour（子午流注能量）
 *   M4     Astrological Context（月相 SunCalc 实时 + 行星位 + 逆行/食相/特殊事件）
 *   M5     History（昨日 / 前日运势卡片，留存钩子）
 *
 * 数据源（4 层，全注入前端 0 成本）：
 *   _shared/tarot-knowledge.json                       22 牌（best_daily_wear 22/22）
 *   _shared/moon-knowledge.json                        4 月相 × 水晶
 *   04-内容生产/13.tarot/configs/daily-knowledge.json   365 天星象 + 东方时辰 + 每日 card 种子
 *   crystal-meaning-search/data/search-data.json       水晶 img/shop（三级降级）
 *
 * T17 教训严守：
 *   1) 一份 generate.js（无 generate-deploy.js 双版本）
 *   2) 浅色 + 站点品牌（白底 #fff + 品牌绿 #2D6A4F + 金 #CFAA3E，对齐 18 工具）
 *   3) 嵌入式布局（max-width 1080px，非全屏）
 *   4) base64 包装 APP_JS（CJK + &&/< 必须，wp_kses 防护）+ asciiJSON 数据块
 *   5) id 加 edt- 前缀（容器/数据/脚本不同 id）
 *   6) 避 headless Playwright（验证用 node + 静态 grep + 真机 HTTP server）
 *   7) draft 部署（不 publish）
 *
 * 合规：self-reflection 框架（invites/notices/a mirror of），禁 today will/guaranteed/destined/cure/invest。
 * CSS 前缀 edt-。Shop 三级降级（CATEGORY→SEARCH→HEALING）。输出：./daily-tarot.html
 */
const fs = require('fs');
const path = require('path');

// ===== 数据加载 =====
const ROOT = path.resolve(__dirname, '../..');
const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));
const MK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/moon-knowledge.json'), 'utf8'));
const DK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../04-内容生产/13.tarot/configs/daily-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));

// >>>>>>> added by fix-major-crystal-slugs.js (兼容 tarot-knowledge -meaning slug + search-data 短 slug key)
function normSlug(s){ return s ? String(s).replace(/-meaning$/,'') : s; }
// <<<<<<< added by fix-major-crystal-slugs.js
// NOTE: daily-tarot 是 /tools/ 工具，"Keep exploring" 由 snippet 19 (wp_footer) 统一注入，
// generate.js 不再烤进 content（否则与 wp_footer 重复，用户 preview 反馈问题 1）。
// 3 个根级页（meaning/bracelet/ring）才需烤 content（它们不跑 wp_footer）。

// ===== Shop 三级降级（复用皇冠 enrichStone + BY_SLUG 模式）=====
const HEALING = '/product-category/healing-jewelry/'; // 注意：皇冠用 healing-crystals-jewelry，PRD §7 用 healing-jewelry，以 PRD 为准
const BY_SLUG = {};
SD.crystals.forEach(c => {
  BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || ('/shop/?s=' + c.slug) };
});
function enrichStone(s) {
  if (!s) return null;
  const sc = BY_SLUG[normSlug(s.slug)] || { name: s.name, img: '', link: '', shop: HEALING };
  return { slug: s.slug, name: sc.name || s.name, reason: s.reason || '', img: sc.img, shop: sc.shop };
}

// ===== 22 牌精简（含 best_daily_wear / best_overall + 解读字段）=====
// 问题 2：eastern_anchors.tibetan / eastern_lens 含中文（菩萨石/藏传佛教/初发心等），英文站需全英文。
// 这些字段是文化深度叙述（非纯名词），逐字翻译会失真，改用英文兜底（保留 Eastern 维度但不显中文）。
// 检测到 CJK 的字段 → 替换为通用英文 Eastern perspective 文案（self-reflection 框架，合规）。
function hasCJK(s){ return /[一-鿿]/.test(s||''); }
const EASTERN_FALLBACK = 'In Eastern traditions this archetype is held as a point of contemplation — a way to notice inner rhythm rather than a fixed doctrine. Sit with the card and let it surface what it will.';
const CARDS = TK.cards.map(c => {
  const easternRaw = (c.eastern_anchors && c.eastern_anchors.tibetan) || '';
  const easternLensRaw = c.eastern_lens || '';
  return {
    number: c.number, slug: c.slug, name: c.name, archetype: c.archetype,
    element: c.element, astrology: c.astrology, theme: c.theme,
    upright_keywords: c.upright_keywords || [], reversed_keywords: c.reversed_keywords || [],
    upright_meaning: c.upright_meaning || '', reversed_meaning: c.reversed_meaning || '',
    psych: c.psychological_lens || '',
    eastern: hasCJK(easternRaw) ? EASTERN_FALLBACK : easternRaw,         // CJK → 英文兜底
    eastern_lens: hasCJK(easternLensRaw) ? '' : easternLensRaw,          // CJK → 空（M3 未用此字段，保险）
    practice: c.recommended_practice || '',
    crystals: {
      best_daily_wear: enrichStone(c.crystals && c.crystals.best_daily_wear),
      best_overall: enrichStone(c.crystals && c.crystals.best_overall)
    }
  };
});
const CARD_BY_SLUG = {};
CARDS.forEach(c => { CARD_BY_SLUG[normSlug(c.slug)] = c; });

// ===== 365 天星象精简（去文章残留字段，仅工具用字段）=====
// 问题 2 修复：eastern_hour 的 label/meridian_note 含中文时辰名（子时/大肠经等 24 个 CJK run），
// 英文站需全英文。这里在精简阶段做英文归一化（strip CJK + 保留已有英文部分）。
// label 形如 "Mao 卯时 05:00–07:00" → "Mao hour · 5–7am"；meridian_note 形如
// "Large Intestine meridian (大肠经) — ..." → "Large Intestine meridian — ..."（strip 括号 CJK）。
const CJK_HOUR_MAP = {
  '子时':'Zi hour','丑时':'Chou hour','寅时':'Yin hour','卯时':'Mao hour','辰时':'Chen hour','巳时':'Si hour',
  '午时':'Wu hour','未时':'Wei hour','申时':'Shen hour','酉时':'You hour','戌时':'Xu hour','亥时':'Hai hour'
};
function normalizeHourLabel(s){
  if(!s) return '';
  // strip CJK 时辰名（前面已有拼音英文如 "Mao"），收尾空格
  let out = String(s).replace(/[一-鿿]+/g, ' ').replace(/\s+/g,' ').trim();
  return out;
}
function normalizeMeridianNote(s){
  if(!s) return '';
  // strip CJK 经络名（前面已有英文如 "Large Intestine meridian"），常见格式 "(大肠经)" → 去整个 CJK 括号
  let out = String(s).replace(/\s*[（(][^)）]*[一-鿿][^)）]*[)）]\s*/g, ' ')  // 去"含 CJK 的括号段"
                    .replace(/[一-鿿]+/g,'')                                  // 去残留 CJK
                    .replace(/\s+/g,' ').trim();
  return out;
}
const DATES = {};
Object.keys(DK.dates || {}).forEach(dateKey => {
  const d = DK.dates[dateKey];
  DATES[dateKey] = {
    card_slug: d.card && d.card.slug || null,        // PRD 方案 A：每日预分配牌 slug（Fisher-Yates）
    card_name: d.card && d.card.name || '',
    card_url: d.card && d.card.card_url || '',
    crystal_slug: d.crystal && d.crystal.slug || null, // daily-knowledge 已为每日配 crystal（best_overall 角色）
    crystal_role: d.crystal && d.crystal.role || 'best_overall',
    moon: d.moon || null,                             // {phase, zodiac, detail, exact_date}
    outer_backdrop: d.outer_backdrop || '',
    retrogrades: d.retrogrades || [],
    eclipse: d.eclipse || null,
    special_event: d.special_event || null,
    eastern_hour: d.eastern_hour ? {                  // 问题 2：英文归一化（strip 子时/大肠经 CJK）
      label: normalizeHourLabel(d.eastern_hour.label),
      meridian_note: normalizeMeridianNote(d.eastern_hour.meridian_note)
    } : null
  };
});
const DATES_COVERAGE = Object.keys(DATES).sort();
const META_YEAR = (DK._meta && DK._meta.year) || 2026;
const META_RANGE = (DK._meta && DK._meta.date_range) || '2026-01-01 .. 2026-12-31';

// ===== 月相 phases（SunCalc 归类用）=====
const PHASES = MK.phases;

// ===== asciiJSON + safeJSON（皇冠同款，wp_kses 防）=====
function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({
  cards: CARDS,
  card_by_slug: CARD_BY_SLUG,
  phases: PHASES,
  dates: DATES,
  dates_coverage: DATES_COVERAGE,
  healing: HEALING,
  meta: { year: META_YEAR, range: META_RANGE }
});

// ===== APP_JS（日期种子 + SunCalc + 6 模块渲染 + 分享）=====
// 守 wp_kses：CJK 已在数据 asciiJSON 转义；APP_JS 文案全英文 + ASCII，base64 包装后 &&/< 全部躲过实体转义。
const APP_JS = `(function(){
  var DATA;
  try { DATA = JSON.parse(document.getElementById('edt-data').textContent); }
  catch (e) { console.error('EDT data parse failed', e); return; }

  var CARDS = DATA.cards, CARD_BY_SLUG = DATA.card_by_slug, PHASES = DATA.phases;
  var DATES = DATA.dates, COVERAGE = DATA.dates_coverage, HEALING = DATA.healing;

  // ---------- 工具函数 ----------
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function pad(n){ return n<10?'0'+n:''+n; }
  function dateKey(d){ return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate()); } // UTC 全站同步
  function fmtLong(d){ var m=['January','February','March','April','May','June','July','August','September','October','November','December']; var wd=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; return wd[d.getUTCDay()]+', '+m[d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear(); }
  function fmtMed(d){ var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return m[d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear(); }

  // PRD 方案 B：dates 无当日时，hash%22 程序化出牌（2027 降级）
  function hashCardIdx(key){
    var h=0; for(var i=0;i<key.length;i++){ h=(h*31+key.charCodeAt(i))>>>0; }
    return h % CARDS.length;
  }

  // 取当日数据：dates 有则用预分配牌 slug，否则 hash%22 降级
  function getDay(key){
    var d = DATES[key];
    var card;
    if (d && d.card_slug && CARD_BY_SLUG[d.card_slug]) {
      card = CARD_BY_SLUG[d.card_slug];
    } else {
      card = CARDS[hashCardIdx(key)];
    }
    return { key: key, date: d || null, card: card };
  }

  // SunCalc 月相归类（CDN 加载后 window.SunCalc 可用；未加载时降级用 dates.moon.phase）
  function livePhase(d){
    if (typeof window.SunCalc === 'undefined') {
      // 降级：从 dates.moon.phase 字符串推断
      var p = (d && d.date && d.date.moon && d.date.moon.phase) || '';
      if (/new/i.test(p)) return 'new';
      if (/full/i.test(p)) return 'full';
      if (/waxing/i.test(p)) return 'waxing';
      if (/waning/i.test(p)) return 'waning';
      return 'waxing';
    }
    var illum = window.SunCalc.getMoonIllumination(new Date(keyToUTC(d.key)));
    var f = illum.phase; // 0..1
    if (f < 0.0375 || f >= 0.9625) return 'new';
    if (f < 0.4625) return 'waxing';
    if (f < 0.5375) return 'full';
    return 'waning';
  }
  function keyToUTC(key){ var parts=key.split('-'); return Date.UTC(+parts[0],+parts[1]-1,+parts[2]); }

  // Shop url 兜底（build 时 BY_SLUG 已三级降级，前端再加保险）
  function shopUrl(stone){
    if (!stone) return HEALING;
    if (stone.shop) return stone.shop;
    if (stone.slug) return '/shop/?s='+encodeURIComponent(stone.slug);
    return HEALING;
  }

  // ---------- 模块渲染 ----------
  function renderHero(today, day, livePhaseKey){
    var c = day.card;
    var phase = PHASES[livePhaseKey] || {};
    var orient = (day.date && day.date.card_name) ? '' : ''; // 正位为主（每日牌不翻逆位）
    var html = '';
    html += '<div class="edt-hero-card">';
    html += '  <div class="edt-hero-left">';
    // 程序化牌面（水晶六棱牌背样式，复用皇冠视觉语言但简化为今日大图位）
    html += '    <div class="edt-tarot-face" aria-hidden="true">';
    html += '      <div class="edt-tarot-crystal"></div>';
    html += '      <div class="edt-tarot-num">'+esc(c.number)+'</div>';
    html += '      <div class="edt-tarot-name">'+esc(c.name)+'</div>';
    html += '      <div class="edt-tarot-arch">'+esc(c.archetype)+'</div>';
    html += '      <div class="edt-tarot-astro">'+esc(c.astrology)+' &middot; '+esc(c.element)+'</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <div class="edt-hero-right">';
    html += '    <div class="edt-date-badge">'+esc(fmtLong(today))+'</div>';
    html += '    <h1 class="edt-h1">Today&rsquo;s Tarot: '+esc(c.name)+'</h1>';
    html += '    <p class="edt-hero-theme">'+esc(c.theme)+'</p>';
    html += '    <div class="edt-hero-moon"><span class="edt-moon-ico">'+(phase.icon||'🌙')+'</span> '+esc(phase.name||'Moon')+(day.date&&day.date.moon&&day.date.moon.zodiac?(' in '+esc(day.date.moon.zodiac)):'')+'</div>';
    html += '    <p class="edt-hero-line">Today&rsquo;s card invites you into the archetype of <strong>'+esc(c.name)+'</strong> &mdash; a mirror for the day, not a forecast. Sit with what it surfaces.</p>';
    html += '    <div class="edt-share-row">';
    html += '      <button type="button" class="edt-share-btn" id="edt-share">🔗 Share today&rsquo;s card</button>';
    html += '      <span class="edt-share-hint" id="edt-share-hint"></span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    return html;
  }

  function renderM1(day, phaseKey){
    var c = day.card, d = day.date;
    var moonTxt = (d && d.moon) ? (d.moon.phase + (d.moon.zodiac?(' in '+d.moon.zodiac):'') + (d.moon.detail?(' &mdash; '+d.moon.detail):'')) : 'Moon phase unavailable';
    // 关键词改独立 chip（Image #31 UI 反馈：拼一串会挤一起，每词单独背景胶囊更清晰，参考皇冠 .ect-kw）
    var kwChips = c.upright_keywords.slice(0,4).map(function(k){ return '<span class="edt-kw">'+esc(k)+'</span>'; }).join('');
    var html = '';
    html += '<section class="edt-module" id="edt-m1">';
    html += '  <div class="edt-mod-head"><span class="edt-mod-num">M1</span><h2>Today&rsquo;s Card Energy</h2></div>';
    html += '  <p class="edt-lede">With '+esc(moonTxt)+', today&rsquo;s card asks you to notice <em>'+esc(c.theme.toLowerCase())+'</em>.</p>';
    html += '  <div class="edt-kw-row">'+kwChips+'</div>';
    html += '  <p class="edt-body">'+esc(c.upright_meaning)+'</p>';
    if (c.psych){
      html += '  <div class="edt-lens"><span class="edt-lens-lbl">A psychological lens</span><p>'+esc(c.psych)+'</p></div>';
    }
    html += '  <div class="edt-practice"><span class="edt-prac-lbl">A question to sit with</span><p>'+esc(c.practice || ('Where does the archetype of '+c.name+' show up in your day?'))+'</p></div>';
    html += '</section>';
    return html;
  }

  function renderM2(day){
    var c = day.card;
    var stone = (c.crystals && c.crystals.best_daily_wear) || (c.crystals && c.crystals.best_overall) || null;
    var html = '';
    html += '<section class="edt-module edt-m2" id="edt-m2">';
    html += '  <div class="edt-mod-head"><span class="edt-mod-num edt-mod-num-gold">M2</span><h2>Today&rsquo;s Crystal</h2></div>';
    html += '  <p class="edt-lede edt-lede-soft">A mindful companion for the archetype of '+esc(c.name)+' &mdash; traditionally paired, traditionally worn.</p>';
    if (stone){
      var imgHtml = stone.img ? '<img class="edt-stone-img" src="'+esc(stone.img)+'" alt="'+esc(stone.name)+'" loading="lazy">' : '<div class="edt-stone-img edt-stone-img-ph"></div>';
      html += '  <div class="edt-stone-card">';
      html += '    '+imgHtml;
      html += '    <div class="edt-stone-body">';
      html += '      <div class="edt-stone-tag">Today&rsquo;s wear</div>';
      html += '      <div class="edt-stone-name">'+esc(stone.name)+'</div>';
      html += '      <p class="edt-stone-reason">'+esc(stone.reason)+'</p>';
      html += '      <a class="edt-stone-shop" href="'+esc(shopUrl(stone))+'">Shop '+esc(stone.name)+' jewelry &rarr;</a>';
      html += '    </div>';
      html += '  </div>';
    } else {
      html += '  <div class="edt-stone-card"><div class="edt-stone-body"><div class="edt-stone-name">Today&rsquo;s crystal is being curated</div><p class="edt-stone-reason">Browse our healing jewelry collection for a mindful companion.</p><a class="edt-stone-shop" href="'+esc(HEALING)+'">Shop healing jewelry &rarr;</a></div></div>';
    }
    html += '  <div class="edt-cta-row">';
    html += '    <a class="edt-cta edt-cta-primary" href="'+esc(shopUrl(stone))+'">Shop today&rsquo;s crystal &rarr;</a>';
    html += '    <a class="edt-cta edt-cta-sec" href="'+esc(HEALING)+'">Shop all healing jewelry &rarr;</a>';
    if (day.date && day.date.card_url){
      html += '    <a class="edt-cta edt-cta-link" href="'+esc(day.date.card_url)+'">Read the full '+esc(c.name)+' guide &rarr;</a>';
    }
    html += '  </div>';
    html += '</section>';
    return html;
  }

  function renderM3(day){
    var d = day.date, eh = d && d.eastern_hour;
    var c = day.card;
    var html = '';
    html += '<section class="edt-module" id="edt-m3">';
    html += '  <div class="edt-mod-head"><span class="edt-mod-num">M3</span><h2>Eastern Hour</h2></div>';
    if (eh){
      html += '  <div class="edt-hour-card">';
      html += '    <div class="edt-hour-label">'+esc(eh.label||'')+'</div>';
      html += '    <p class="edt-hour-meridian">'+esc(eh.meridian_note||'')+'</p>';
      html += '  </div>';
    } else {
      html += '  <div class="edt-hour-card"><div class="edt-hour-label">Today&rsquo;s double-hour</div><p class="edt-hour-meridian">In traditional Chinese medicine, each two-hour window aligns with a meridian. Notice the rhythm of your day &mdash; a cue, not a prescription.</p></div>';
    }
    if (c.eastern){
      html += '  <div class="edt-eastern-anchor"><span class="edt-anchor-lbl">Eastern anchor of '+esc(c.name)+'</span><p>'+esc(c.eastern)+'</p></div>';
    }
    html += '  <p class="edt-note">A rhythm to notice, not a medical prescription. Crystal associations are traditional, not medical claims.</p>';
    html += '</section>';
    return html;
  }

  function renderM4(day, phaseKey){
    var d = day.date;
    var phase = PHASES[phaseKey] || {};
    var html = '';
    html += '<section class="edt-module" id="edt-m4">';
    html += '  <div class="edt-mod-head"><span class="edt-mod-num">M4</span><h2>Astrological Context</h2></div>';
    // 月相（SunCalc 实时 + daily-knowledge 月星座）
    html += '  <div class="edt-astro-block">';
    html += '    <div class="edt-astro-h"><span class="edt-moon-ico">'+(phase.icon||'🌙')+'</span> '+esc(phase.name||'Moon')+(d&&d.moon&&d.moon.zodiac?(' in '+esc(d.moon.zodiac)):'')+'</div>';
    if (phase.energy){ html += '    <p class="edt-astro-body">'+esc(phase.energy)+'</p>'; }
    if (d && d.moon && d.moon.detail){ html += '    <p class="edt-astro-detail">'+esc(d.moon.detail)+'</p>'; }
    html += '  </div>';
    // 外行星位
    if (d && d.outer_backdrop){
      html += '  <div class="edt-astro-block"><div class="edt-astro-h">Outer planets</div><p class="edt-astro-body">'+esc(d.outer_backdrop)+'</p></div>';
    }
    // 逆行
    if (d && d.retrogrades && d.retrogrades.length){
      html += '  <div class="edt-astro-block edt-astro-retro"><div class="edt-astro-h">Retrogrades</div><ul class="edt-retro-list">';
      d.retrogrades.forEach(function(r){ html += '<li>'+esc(r)+'</li>'; });
      html += '  </ul><p class="edt-astro-note">Retrogrades traditionally invite reflection on their themes &mdash; a cue to slow down, not a forecast of events.</p></div>';
    }
    // 食相 / 特殊事件
    if (d && d.eclipse){
      html += '  <div class="edt-astro-block edt-astro-event"><div class="edt-astro-h">Eclipse</div><p class="edt-astro-body">'+esc(d.eclipse)+'</p></div>';
    }
    if (d && d.special_event){
      html += '  <div class="edt-astro-block edt-astro-event"><div class="edt-astro-h">Notable event</div><p class="edt-astro-body">'+esc(d.special_event)+'</p></div>';
    }
    html += '</section>';
    return html;
  }

  function renderM5(today){
    var yesterday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-1));
    var dayBefore = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-2));
    var yDay = getDay(dateKey(yesterday));
    var bDay = getDay(dateKey(dayBefore));
    var html = '';
    html += '<section class="edt-module" id="edt-m5">';
    html += '  <div class="edt-mod-head"><span class="edt-mod-num">M5</span><h2>Recent Cards</h2></div>';
    html += '  <p class="edt-lede edt-lede-soft">Yesterday and the day before &mdash; the trail your week is leaving.</p>';
    html += '  <div class="edt-history-grid">';
    [ { lbl:'Yesterday', day:yDay, dt:yesterday }, { lbl:'Day before', day:bDay, dt:dayBefore } ].forEach(function(it){
      var c = it.day.card;
      var stone = (c.crystals && c.crystals.best_daily_wear) || null;
      html += '  <div class="edt-hist-card">';
      html += '    <div class="edt-hist-date">'+esc(it.lbl)+' &middot; '+esc(fmtMed(it.dt))+'</div>';
      html += '    <div class="edt-hist-card-row">';
      html += '      <div class="edt-hist-face"><div class="edt-tarot-crystal sm"></div><div class="edt-hist-num">'+esc(c.number)+'</div></div>';
      html += '      <div class="edt-hist-info"><div class="edt-hist-name">'+esc(c.name)+'</div><div class="edt-hist-theme">'+esc(c.theme)+'</div></div>';
      html += '    </div>';
      if (stone){ html += '      <div class="edt-hist-stone"><span class="edt-moon-ico">💎</span> '+esc(stone.name)+'</div>'; }
      html += '  </div>';
    });
    html += '  </div>';
    html += '  <p class="edt-note">Come back tomorrow &mdash; a new card will be waiting, shared by everyone who visits today.</p>';
    html += '</section>';
    return html;
  }

  // ---------- 分享 ----------
  function bindShare(today, day){
    var btn = document.getElementById('edt-share');
    var hint = document.getElementById('edt-share-hint');
    if (!btn) return;
    var url = window.location.href;
    var text = 'My today\\'s tarot card is ' + day.card.name + '. What\\'s yours? ' + url;
    btn.addEventListener('click', function(){
      if (navigator.share){
        navigator.share({ title: 'Today\\'s Tarot: '+day.card.name, text: text, url: url }).catch(function(){});
      } else if (navigator.clipboard){
        navigator.clipboard.writeText(text).then(function(){
          if (hint){ hint.textContent='Copied!'; setTimeout(function(){ if(hint) hint.textContent=''; }, 2200); }
        }, function(){ if(hint){ hint.textContent='Copy failed &mdash; long-press the URL'; } });
      } else { if(hint){ hint.textContent='Long-press the URL to share'; } }
    });
  }

  // ---------- 主流程 ----------
  function init(){
    var today = new Date();
    var key = dateKey(today);
    var day = getDay(key);
    var phaseKey = livePhase(day);

    var heroEl = document.getElementById('edt-hero');
    if (heroEl) heroEl.innerHTML = renderHero(today, day, phaseKey);
    var m1 = document.getElementById('edt-m1-mount'); if (m1) m1.innerHTML = renderM1(day, phaseKey);
    var m2 = document.getElementById('edt-m2-mount'); if (m2) m2.innerHTML = renderM2(day);
    var m3 = document.getElementById('edt-m3-mount'); if (m3) m3.innerHTML = renderM3(day);
    var m4 = document.getElementById('edt-m4-mount'); if (m4) m4.innerHTML = renderM4(day, phaseKey);
    var m5 = document.getElementById('edt-m5-mount'); if (m5) m5.innerHTML = renderM5(today);

    bindShare(today, day);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`;

// ===== asciiEscape（base64 包装前的全 ASCII 化，皇冠同款）=====
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');

// ===== HTML 组装（浅色站点品牌 + 嵌入式 + edt- 前缀）=====
// 问题 1：不再烤 related-html（/tools/ 工具由 snippet 19 wp_footer 统一注入 "Keep exploring"）。
// 问题 3：底部加 SEO accordion（外部 seo-content.html）+ 扩充 FAQPage schema。
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}

const html = `<!-- ===== Daily Tarot v1.0 (tool #19) ===== -->
<div class="edt-root">
  <div class="edt-inner">

    <!-- Hero: today's card + date + share -->
    <div id="edt-hero" class="edt-hero"><div class="edt-loading">Loading today&rsquo;s card&hellip;</div></div>

    <!-- M1: today's card energy -->
    <div id="edt-m1-mount"></div>
    <!-- M2: today's crystal + Shop CTA -->
    <div id="edt-m2-mount"></div>
    <!-- M3: Eastern double-hour (TCM meridian rhythm) -->
    <div id="edt-m3-mount"></div>
    <!-- M4: astrological context -->
    <div id="edt-m4-mount"></div>
    <!-- M5: recent cards -->
    <div id="edt-m5-mount"></div>

    <!-- Gentle Note disclaimer -->
    <section class="edt-gentle">
      <p><strong>A gentle note.</strong> Tarot is a tool for self-reflection, not a prediction of fixed outcomes. Crystal associations and Eastern-hour meridian notes are traditional and cultural &mdash; not medical or financial advice. Sit with what surfaces; choose what serves you.</p>
    </section>

  </div>
</div>

<style>
.edt-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1A1A2E;line-height:1.6}
/* 内容直接用站点主容器宽度 1140px 居中，不加白底卡片嵌套（外层 .edt-root 已透明继承页面底色） */
.edt-inner{max-width:1140px;margin:0 auto;padding:24px 28px 40px}

.edt-loading{padding:60px 20px;text-align:center;color:#888;font-size:16px}

/* Hero */
.edt-hero{margin-bottom:28px}
.edt-hero-card{display:grid;grid-template-columns:280px 1fr;gap:28px;background:linear-gradient(135deg,#FBF8F1 0%,#fff 100%);border:1px solid #E8E2D5;border-radius:18px;padding:32px}
.edt-hero-left{display:flex;justify-content:center;align-items:flex-start}
.edt-tarot-face{width:260px;height:380px;border-radius:14px;background:linear-gradient(160deg,#2D6A4F 0%,#1B4332 100%);border:3px solid #CFAA3E;box-shadow:0 8px 24px rgba(26,26,46,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;position:relative;overflow:hidden}
.edt-tarot-face.sm{width:56px;height:80px;border-radius:8px;border-width:2px;padding:6px;box-shadow:none}
.edt-tarot-crystal{width:90px;height:120px;background:linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(207,170,62,.6) 50%,rgba(255,255,255,.4) 100%);clip-path:polygon(50% 0,100% 30%,100% 70%,50% 100%,0 70%,0 30%);margin-bottom:14px;filter:drop-shadow(0 0 12px rgba(255,255,255,.4))}
.edt-tarot-crystal.sm{width:24px;height:32px;margin-bottom:0}
.edt-tarot-num{color:rgba(255,255,255,.7);font-size:13px;letter-spacing:.18em;font-weight:700;margin-bottom:4px}
.edt-tarot-name{color:#fff;font-size:22px;font-weight:800;text-align:center;line-height:1.2;margin-bottom:4px;letter-spacing:.01em}
.edt-tarot-arch{color:#CFAA3E;font-size:13px;font-style:italic;text-align:center;margin-bottom:6px}
.edt-tarot-astro{color:rgba(255,255,255,.85);font-size:12px;text-align:center;letter-spacing:.04em}
.edt-hero-right{display:flex;flex-direction:column;justify-content:center}
.edt-date-badge{display:inline-block;background:#CFAA3E;color:#fff;font-size:13px;font-weight:700;padding:5px 13px;border-radius:20px;letter-spacing:.04em;width:fit-content;margin-bottom:14px}
.edt-h1{font-size:34px;font-weight:800;color:#1A1A2E;margin:0 0 8px;line-height:1.15;letter-spacing:-.01em}
.edt-hero-theme{font-size:16px;color:#2D6A4F;font-weight:600;margin:0 0 12px;font-style:italic}
.edt-hero-moon{display:flex;align-items:center;gap:6px;font-size:14px;color:#5A5A6E;margin-bottom:14px;font-weight:600}
.edt-moon-ico{font-size:18px;line-height:1}
.edt-hero-line{font-size:15px;color:#444;margin:0 0 18px;line-height:1.65}
.edt-share-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.edt-share-btn{background:#2D6A4F;color:#fff;border:none;border-radius:8px;padding:11px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s}
.edt-share-btn:hover{background:#1B4332}
.edt-share-hint{font-size:13px;color:#2D6A4F;font-weight:600}

/* Modules */
.edt-module{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:28px 30px;margin-bottom:22px}
.edt-mod-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.edt-mod-num{background:#2D6A4F;color:#fff;font-size:13px;font-weight:800;padding:4px 10px;border-radius:6px;letter-spacing:.05em}
.edt-mod-num-gold{background:#CFAA3E}
.edt-mod-head h2{font-size:24px;font-weight:800;color:#1A1A2E;margin:0;letter-spacing:-.005em}
.edt-lede{font-size:17px;color:#1A1A2E;margin:0 0 14px;line-height:1.55;font-weight:500}
.edt-lede-soft{color:#5A5A6E;font-weight:400;font-size:15px;font-style:italic}
.edt-body{font-size:15px;color:#444;margin:0 0 14px;line-height:1.7}
/* Image #31 UI fix: keywords from a joined text string → per-word chip pills (mirrors crown .ect-kw, brand-green palette) */
.edt-kw-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.edt-kw{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:5px 12px;border-radius:16px;font-size:13px;font-weight:600;letter-spacing:.01em;line-height:1.3;display:inline-block}

.edt-lens{background:#FAFAFA;border-left:3px solid #CFAA3E;padding:14px 16px;margin:0 0 14px;border-radius:0 8px 8px 0}
.edt-lens-lbl{display:block;font-size:12px;font-weight:700;color:#CFAA3E;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.edt-lens p{margin:0;font-size:14px;color:#444;line-height:1.65}

.edt-practice{background:#F0F5F1;border-left:3px solid #2D6A4F;padding:14px 16px;margin:0 0 6px;border-radius:0 8px 8px 0}
.edt-prac-lbl{display:block;font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.edt-practice p{margin:0;font-size:15px;color:#1A1A2E;line-height:1.6;font-style:italic}

/* M2 Crystal */
.edt-m2{background:linear-gradient(135deg,#FBF8F1 0%,#fff 70%);border-color:#CFAA3E}
.edt-stone-card{display:flex;gap:18px;align-items:flex-start;background:#fff;border:1px solid #E8E2D5;border-radius:12px;padding:18px;margin-bottom:16px}
.edt-stone-img{width:96px;height:96px;object-fit:cover;border-radius:50%;flex-shrink:0;background:#F0F0F5;border:2px solid #CFAA3E}
.edt-stone-img-ph{background:linear-gradient(135deg,#CFAA3E 0%,#E8E2D5 100%)}
.edt-stone-body{flex:1;min-width:0}
.edt-stone-tag{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#CFAA3E}
.edt-stone-name{font-size:22px;font-weight:800;color:#1A1A2E;margin:2px 0 6px;letter-spacing:-.005em}
.edt-stone-reason{font-size:14px;color:#5A5A6E;line-height:1.6;margin:0 0 10px}
.edt-stone-shop{display:inline-block;font-size:14px;font-weight:700;color:#2D6A4F !important;text-decoration:none;border-bottom:2px solid #CFAA3E;padding-bottom:2px}
.edt-stone-shop:hover{color:#1B4332 !important}
.edt-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.edt-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;transition:background .2s}
.edt-cta-primary{background:#2D6A4F;color:#fff !important}
.edt-cta-primary:hover{background:#1B4332}
.edt-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.edt-cta-sec:hover{background:#F0F5F1}
.edt-cta-link{background:transparent;color:#CFAA3E !important;padding:12px 6px}
.edt-cta-link:hover{color:#1A1A2E !important}

/* M3 Eastern Hour */
.edt-hour-card{background:#F4F0E6;border:1px solid #E8E2D5;border-radius:12px;padding:18px 20px;margin-bottom:14px}
.edt-hour-label{font-size:18px;font-weight:800;color:#7A5A12;margin-bottom:6px;letter-spacing:.01em}
.edt-hour-meridian{font-size:14px;color:#5A5A6E;margin:0;line-height:1.6}
.edt-eastern-anchor{background:#FAFAFA;border-left:3px solid #2D6A4F;padding:14px 16px;margin-bottom:10px;border-radius:0 8px 8px 0}
.edt-anchor-lbl{display:block;font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.edt-eastern-anchor p{margin:0;font-size:14px;color:#444;line-height:1.65}
.edt-note{font-size:13px;color:#888;font-style:italic;margin:10px 0 0;line-height:1.55}

/* M4 Astrology */
.edt-astro-block{margin-bottom:14px}
.edt-astro-block:last-child{margin-bottom:0}
.edt-astro-h{font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.edt-astro-body{font-size:14px;color:#444;margin:0 0 6px;line-height:1.65}
.edt-astro-detail{font-size:13px;color:#5A5A6E;margin:0;font-style:italic}
.edt-astro-retro{background:#FFF8F0;border-radius:10px;padding:14px 16px}
.edt-retro-list{margin:6px 0;padding-left:20px}
.edt-retro-list li{font-size:14px;color:#444;line-height:1.7}
.edt-astro-note{font-size:13px;color:#888;font-style:italic;margin:8px 0 0}
.edt-astro-event{background:#F0F5F1;border-radius:10px;padding:14px 16px;border-left:3px solid #2D6A4F}

/* M5 History */
.edt-history-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:12px}
.edt-hist-card{background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px;padding:16px}
.edt-hist-date{font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
.edt-hist-card-row{display:flex;gap:12px;align-items:center}
.edt-hist-face{width:56px;height:80px;background:linear-gradient(160deg,#2D6A4F 0%,#1B4332 100%);border:2px solid #CFAA3E;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;position:relative}
.edt-hist-num{color:rgba(255,255,255,.8);font-size:11px;font-weight:700;position:absolute;top:4px}
.edt-hist-info{flex:1;min-width:0}
.edt-hist-name{font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:3px}
.edt-hist-theme{font-size:13px;color:#5A5A6E;line-height:1.4}
.edt-hist-stone{margin-top:10px;font-size:13px;color:#2D6A4F;font-weight:600;display:flex;align-items:center;gap:5px}

/* Gentle Note */
.edt-gentle{margin-top:24px;padding:20px 24px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px}
.edt-gentle p{margin:0;font-size:13px;color:#5A5A6E;line-height:1.7}
.edt-gentle strong{color:#2D6A4F}

/* SEO Accordion (Issue 3 — mirrors crown .ect-seo visual language with edt- prefix) */
.edt-seo-accordion{margin:32px 0 8px}
.edt-seo-details{border:1px solid #E8E2D5;border-radius:12px;background:#FAFAFA;overflow:hidden}
.edt-seo-details summary{list-style:none;cursor:pointer;background:#F4F0E6;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;display:flex;justify-content:space-between;align-items:center}
.edt-seo-details summary::-webkit-details-marker{display:none}
.edt-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F;font-weight:300}
.edt-seo-details[open] summary:after{content:'–'}
.edt-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.edt-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px;letter-spacing:-.005em}
.edt-seo-content h2:first-child{margin-top:0}
.edt-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.edt-seo-content p{margin:0 0 12px}
.edt-seo-content ul{margin:0 0 12px;padding-left:22px}
.edt-seo-content li{margin-bottom:6px}
.edt-seo-content strong{color:#2D6A4F}

/* Responsive: tablet/mobile */
@media(max-width:900px){
  .edt-hero-card{grid-template-columns:1fr;padding:24px;text-align:center}
  .edt-hero-left{order:-1}
  .edt-tarot-face{width:220px;height:320px}
  .edt-h1{font-size:28px}
  .edt-share-row{justify-content:center}
}
@media(max-width:640px){
  .edt-inner{padding:16px 14px 32px;border-radius:12px}
  .edt-hero-card{padding:20px 16px;gap:18px}
  .edt-tarot-face{width:180px;height:264px;padding:18px 12px}
  .edt-tarot-name{font-size:18px}
  .edt-h1{font-size:24px}
  .edt-hero-theme{font-size:15px}
  .edt-module{padding:20px 18px}
  .edt-mod-head{gap:10px;margin-bottom:12px}
  .edt-mod-head h2{font-size:20px}
  .edt-lede{font-size:16px}
  .edt-stone-card{flex-direction:column;align-items:center;text-align:center}
  .edt-stone-img{width:88px;height:88px}
  .edt-stone-body{width:100%}
  .edt-stone-shop{display:inline-block;margin-top:8px}
  .edt-cta-row{flex-direction:column}
  .edt-cta{width:100%;text-align:center;padding:13px 20px;font-size:15px}
  .edt-history-grid{grid-template-columns:1fr}
  .edt-hist-card-row{gap:10px}
  .edt-hist-face{width:48px;height:68px}
  .edt-gentle{padding:16px 18px}
  .edt-gentle p{font-size:13px}
  .edt-seo-content{padding:18px 16px;font-size:15px}
  .edt-seo-content h2{font-size:21px}
  .edt-seo-content h3{font-size:17px}
  .edt-seo-details summary{font-size:16px;padding:15px 16px}
}
@media(max-width:380px){
  .edt-inner{padding:14px 10px 28px;border-radius:10px}
  .edt-hero-card{padding:16px 12px}
  .edt-tarot-face{width:160px;height:234px}
  .edt-tarot-name{font-size:17px}
  .edt-h1{font-size:22px;line-height:1.2}
  .edt-hero-line{font-size:14px}
  .edt-module{padding:18px 14px;margin-bottom:18px}
  .edt-mod-head h2{font-size:19px}
  .edt-lede{font-size:15px}
  .edt-body{font-size:14px}
  .edt-share-btn{width:100%;padding:13px 18px;font-size:14px}
  .edt-cta{font-size:14px;padding:12px 16px}
}
</style>

<!-- Data: 22 cards + 365-day astrology + moon phases + shop slugs (asciiJSON) -->
<script type="application/json" id="edt-data">${DATA_BLOCK}</script>

<!-- SunCalc for live moon phase (CDN, same as moon-calendar) -->
<script src="https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js"></script>

<!-- App JS Base64-wrapped (wp_kses defense: CJK/&&/< entity-escaping). Loader atob → eval. -->
<script type="text/plain" id="edt-app">${APP_B64}</script>
<script>
(function(){var b=document.getElementById('edt-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EDT init failed',e);}})();
</script>

<!-- ===== Daily Tarot Schema (FAQPage, self-reflection framing) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is a daily tarot reading?","acceptedAnswer":{"@type":"Answer","text":"A daily tarot reading shows one tarot card for the day as a focal point for self-reflection. Instead of drawing your own card, the Daily Tarot tool displays a single Major Arcana card shared by everyone who visits on the same date — paired with that card's traditional crystal, its Eastern double-hour meridian note, and the day's astrological context. It is a daily ritual, not a personal forecast."}},
{"@type":"Question","name":"How is today's tarot card chosen?","acceptedAnswer":{"@type":"Answer","text":"The card is selected by the day's date using a fixed seed, so every visitor on the same calendar day sees the same card. The assignment rotates through the 22 Major Arcana across the year and is computed in advance — it is not random per visit and it is not influenced by who you are. The next day brings a new shared card."}},
{"@type":"Question","name":"Can I change today's daily tarot card?","acceptedAnswer":{"@type":"Answer","text":"No — the Daily Tarot is a community ritual, so the card for a given date is the same for everyone and cannot be redrawn on this page. If you would like a personal, on-demand draw where you choose how many cards and what to ask, use the Crystal Tarot Reading tool or the AI Tarot Chat tool, both of which let you pull your own cards."}},
{"@type":"Question","name":"Is the Daily Tarot tool free?","acceptedAnswer":{"@type":"Answer","text":"Yes. The Daily Tarot tool is completely free, with no sign-up required. You can visit every day, share the card, and read the day's crystal pairing and astrological context at no cost. The optional Shop links let you browse the suggested crystal as jewelry if you wish — the reading itself never costs anything."}},
{"@type":"Question","name":"How accurate is daily tarot?","acceptedAnswer":{"@type":"Answer","text":"Tarot is best understood as a mirror for reflection rather than a measurement of accuracy. The card of the day surfaces an archetype and a question to sit with — what it reflects back depends on what you bring to it. No tarot reading, daily or otherwise, predicts fixed outcomes or replaces medical, financial, or professional advice. Treat accuracy as personal resonance, not forecast precision."}},
{"@type":"Question","name":"Does the daily tarot card predict what will happen today?","acceptedAnswer":{"@type":"Answer","text":"No. The card is a mirror for self-reflection, not a forecast of fixed outcomes. Tarot surfaces archetypes, patterns, and questions to sit with. The day's crystal pairing and Eastern-hour notes are traditional and cultural, not medical or financial advice."}},
{"@type":"Question","name":"Why does everyone see the same daily tarot card?","acceptedAnswer":{"@type":"Answer","text":"The Daily Tarot is a shared daily anchor: every visitor on the same date sees the same card, crystal, and astrological context. It is designed as a community ritual and a reason to come back tomorrow, not as a personalized reading. For a personal draw, use the Crystal Tarot Reading or AI Tarot Chat tools."}},
{"@type":"Question","name":"What crystal goes with today's tarot card?","acceptedAnswer":{"@type":"Answer","text":"Each Major Arcana card pairs with a traditional daily-wear crystal chosen for its archetype. The Today's Crystal module shows that pairing with a short reason and a link to shop the stone as jewelry. The pairing is traditional and symbolic, not a medical claim."}},
{"@type":"Question","name":"What is the Eastern double-hour on the daily tarot page?","acceptedAnswer":{"@type":"Answer","text":"The Eastern double-hour is a concept from traditional Chinese medicine in which each two-hour window of the day corresponds to a meridian (an energy pathway). The Daily Tarot page shows the day's double-hour and its meridian note as a rhythm to notice — a cultural cue for reflection, not a medical prescription or treatment."}}
]}
]}
</script>
${SEO_CONTENT.trim() ? `
<!-- ===== Daily Tarot SEO Accordion (long-tail depth, self-reflection framing) ===== -->
<section class="edt-seo-accordion" aria-label="Daily tarot guide">
  <details class="edt-seo-details">
    <summary>Learn More About Daily Tarot</summary>
    <div class="edt-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Daily Tarot SEO Accordion ===== -->` : ''}
<!-- ===== End Daily Tarot v1.0 ===== -->`;

// ===== 写出 + 替换占位 + 统计 =====
const OUT = path.resolve(__dirname, 'daily-tarot.html');
fs.writeFileSync(OUT, html, 'utf8');

const KB = (fs.statSync(OUT).size / 1024).toFixed(1);
const dateCount = Object.keys(DATES).length;
const cardsLen = CARDS.length;
const dataLen = DATA_BLOCK.length;
const appLen = APP_B64.length;

// 合规门：grep 黑名单（PRD §8 关卡 0）
// 注：prescription / will happen today 仅在否定/设问语境出现（"not a prescription"、"predict what will happen today?"）属正确合规措辞，
// 用白名单（前置 not/no/not a medical）排除误报，避免误杀 self-reflection 否定声明。
const BLACK = { health: /\b(cure|heals|treats|therapy|prescription)\b/gi, finance: /\b(invest now|guaranteed return|get rich|wealth guaranteed)\b/gi, deterministic: /\b(today will|guaranteed|destined|will happen today)\b/gi };
const ALLOW_BEFORE = /\b(not\s+(a|a\s+medical|the)\s+|no\s+(medical\s+)?|never\s+(a\s+)?|predict\s+what\s+)$/i; // 否定/设问前置白名单
function isAllowed(src, idx){
  const before = src.substring(Math.max(0, idx-40), idx);
  return ALLOW_BEFORE.test(before);
}
let violations = [];
[html, APP_JS].forEach(function(src){
  Object.keys(BLACK).forEach(function(k){
    var re = new RegExp(BLACK[k].source, BLACK[k].flags); var m;
    while ((m = re.exec(src)) !== null){
      if (!isAllowed(src, m.index)) violations.push(k+': '+m[0]+' @'+m.index);
    }
  });
});

console.log('Daily Tarot v1.0 generated:', OUT);
console.log('  size:', KB, 'KB |', 'cards:', cardsLen, '| dates:', dateCount, '| coverage:', META_RANGE);
console.log('  DATA_BLOCK:', dataLen, 'chars | APP_B64:', appLen, 'chars');
console.log('  keep-exploring: via snippet 19 wp_footer (not baked, no duplicate)');
console.log('  seo accordion:', SEO_CONTENT.trim() ? 'injected ('+SEO_CONTENT.length+' chars)' : 'MISSING seo-content.html');
console.log('  compliance violations:', violations.length === 0 ? 'NONE (PASS)' : violations.join('; '));
