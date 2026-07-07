/**
 * MBTI Tarot v1.0 — MBTI 16型 × 塔罗本命大牌映射工具（第 22 个工具）
 *
 * 定位：MBTI×塔罗映射工具页，吃 mbti tarot card / mbti birth card 长尾。
 *      用户选 MBTI 型（4 步下拉）→ 出本命主牌+成长牌+3 水晶+东方锚点+Shop CTA。
 *      选填生日双轨（吃 mbti birth card calculator 错位词）。
 *
 * 7 模块（PRD §4）：
 *   Input   4 步下拉（I/E, N/S, T/F, J/P）+ 选填生日折叠区
 *   Hero    型+昵称+认知栈+双牌缩略+分享
 *   M1      Primary Birth Card（主牌大图+完整解读+认知功能对齐）
 *   M2      Growth Card（成长牌+阴影整合）
 *   M3 ⭐   Crystals（3 水晶+Shop CTA，三级降级）
 *   M4      Eastern Anchor（藏式/东方文化呼应）
 *   M5      Related（延伸阅读+认知相近型内链）
 *
 * 数据源（3 层，全注入前端 0 成本）：
 *   _shared/mbti-tarot-knowledge.json              16 型 × 映射
 *   _shared/tarot-knowledge.json                   22 Major 牌（birth_cards.slug 外键）
 *   crystal-meaning-search/data/search-data.json   390 水晶 img/shop（三级降级）
 *
 * T17/daily-tarot 教训严守：
 *   1) 一份 generate.js
 *   2) 浅色 + 站点品牌（白底 #fff + 品牌绿 #2D6A4F + 金 #CFAA3E）
 *   3) 嵌入式布局（max-width 1140px）
 *   4) base64 包装 APP_JS（CJK + &&/< 必须，wp_kses 防护）+ asciiJSON 数据块
 *   5) id 加 emt- 前缀（Earthward MBTI Tarot）
 *   6) 避 headless Playwright（验证用 node + 静态 grep + 真机 HTTP server）
 *   7) draft 部署（不 publish）
 *
 * 合规：self-reflection 框架（invites/notices/a mirror of），禁 you will/guaranteed/destined/cure/personality diagnosis。
 *      MBTI 商标 disclaimer 页脚恒显（_meta.mbti_trademark_notice）。
 * CSS 前缀 emt-。Shop 三级降级（CATEGORY→SEARCH→HEALING）。输出：./mbti-tarot.html
 */
const fs = require('fs');
const path = require('path');

// ===== 数据加载 =====
const ROOT = path.resolve(__dirname, '../..');
const M = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/mbti-tarot-knowledge.json'), 'utf8'));
const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));

// ===== normSlug（兼容 -meaning 后缀 + 短 slug key）=====
function normSlug(s){ return s ? String(s).replace(/-meaning$/,'') : s; }

// ===== Shop 三级降级（复用 daily-tarot enrichStone + BY_SLUG）=====
// HEALING 必须 200（healing-jewelry 404，改 healing-crystals-jewelry，memory shop-cta-no-deadlink-rule）
const HEALING = '/product-category/healing-crystals-jewelry/';
const BY_SLUG = {};
SD.crystals.forEach(c => {
  BY_SLUG[normSlug(c.slug)] = { name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || ('/shop/?s=' + c.slug) };
});
// crystals[].reason 在 mbti-tarot-knowledge 含中文（设计文档中文撰写），英文站需 CJK 兜底。
// 按 role 区分三段英文文案（self-reflection 框架，合规，非医疗声明）。
// 注意：这些文案进入 DATA JSON → 经 esc() 渲染（esc 会把 & 转 &amp;），所以这里必须用真撇号 ' 和 em dash —，
// 不能用 HTML 实体 &apos; / &mdash;（否则前端显示字面实体）。em dash 经 asciiJSON 转义为 —，前端 JSON.parse 还原。
const CRYSTAL_REASON_BY_ROLE = {
  best_overall: 'This stone is the traditional companion of your primary card\'s archetype — a mindful pairing for the dominant cognitive function of your type. Worn as jewelry, it serves as a quiet daily reminder of the energy you are noticing, not a medical claim.',
  best_upright: 'A supporting stone for your primary card\'s gift — traditionally paired with this archetype to help you stay grounded in the pattern, not a fix or a cure.',
  best_growth: 'A growth stone for the edge your growth card points to — a gentle invitation to notice where the pattern asks to be stretched, worn as a reminder rather than a remedy.'
};
function crystalReasonEn(role){
  return CRYSTAL_REASON_BY_ROLE[role] || 'This stone is traditionally paired with your card\'s archetype — a mindful companion for your type\'s energy, not a medical claim.';
}
function enrichStone(s) {
  if (!s) return null;
  const sc = BY_SLUG[normSlug(s.slug)] || { name: s.name, img: '', link: '', shop: HEALING };
  const role = s.role || '';
  // CJK 兜底：reason 含中文 → 按 role 英文文案（hasCJK 在下方定义，hoist 提升可用）
  const reasonRaw = s.reason || '';
  const reason = hasCJK(reasonRaw) ? crystalReasonEn(role) : reasonRaw;
  return { slug: s.slug, name: sc.name || s.name, role: role, reason: reason, img: sc.img, shop: sc.shop };
}

// ===== 22 牌精简（含 archetype/psychological_lens/eastern_anchors/practice + crystals）=====
// 与 daily-tarot 同款：CJK 字段做英文兜底（eastern_anchors.tibetan / eastern_lens 含中文时替换为通用英文）
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
    eastern: hasCJK(easternRaw) ? EASTERN_FALLBACK : easternRaw,
    eastern_lens: hasCJK(easternLensRaw) ? '' : easternLensRaw,
    practice: c.recommended_practice || ''
  };
});
const CARD_BY_SLUG = {};
CARDS.forEach(c => { CARD_BY_SLUG[c.slug] = c; });

// ===== 16 型精简（含 birth_cards 外键 + crystals enrichStone + eastern_anchor CJK 兜底）=====
// 注意：upright_reading / reversed_shadow / crystals[].reason / eastern_anchor 在 mbti-tarot-knowledge 含中文（设计文档中文撰写），
// 英文站需全英文。CJK 检测 → 替换为通用英文文案（self-reflection 框架，合规）。
const TYPE_READING_FALLBACK = "Your dominant cognitive function resonates with this card's archetype — a mirror for how you naturally process the world. The card invites you to notice the gifts of your type's pattern, and the edges where that pattern asks to be stretched.";
const TYPE_SHADOW_FALLBACK = "The reversed shadow of this card points to where your type's pattern can over-extend — a growth invitation, not a diagnosis. Notice where the archetype's shadow shows up for you; sit with it rather than fixing it.";
// crystals[].reason 的英文兜底文案已下沉到 enrichStone 的 CRYSTAL_REASON_BY_ROLE（按 role 区分），此处不再保留单值 FALLBACK。
const EASTERN_ANCHOR_FALLBACK = "In Eastern traditions this archetype is held as a point of contemplation — a way to notice inner rhythm rather than a fixed doctrine. The crystal pairing echoes this in mineral form.";

const TYPES = {};
Object.keys(M.types).forEach(t => {
  const tp = M.types[t];
  const cs = tp.cognitive_stack || {};
  TYPES[t] = {
    type: t,
    nickname: tp.nickname || '',
    group: tp.group || '',
    cognitive_stack: { dominant: cs.dominant || '', auxiliary: cs.auxiliary || '', tertiary: cs.tertiary || '', inferior: cs.inferior || '' },
    birth_cards: {
      primary: { slug: tp.birth_cards.primary.slug, reason: hasCJK(tp.birth_cards.primary.reason) ? '' : tp.birth_cards.primary.reason },
      growth: { slug: tp.birth_cards.growth.slug, reason: hasCJK(tp.birth_cards.growth.reason) ? '' : tp.birth_cards.growth.reason }
    },
    upright_reading: hasCJK(tp.upright_reading) ? TYPE_READING_FALLBACK : tp.upright_reading,
    reversed_shadow: hasCJK(tp.reversed_shadow) ? TYPE_SHADOW_FALLBACK : tp.reversed_shadow,
    crystals: (tp.crystals || []).map(enrichStone),
    eastern_anchor: hasCJK(tp.eastern_anchor) ? EASTERN_ANCHOR_FALLBACK : tp.eastern_anchor,
    related_types: tp.related_types || [],
    related_intentions: tp.related_intentions || []
  };
});

// ===== 4 dichotomy 选项（16personalities 同款分组）=====
const DICHOTOMIES = [
  { key: 'attitude', label: 'Energy', sub: 'Where do you draw your energy?', opts: [
    { v: 'I', t: 'Introverted', d: 'Reflective, depth-focused, recharges alone' },
    { v: 'E', t: 'Extraverted', d: 'Outward-focused, recharges with others' }
  ]},
  { key: 'perceiving', label: 'Mind', sub: 'How do you take in information?', opts: [
    { v: 'N', t: 'Intuitive', d: 'Patterns, possibilities, future-focused' },
    { v: 'S', t: 'Sensing', d: 'Details, present moment, hands-on' }
  ]},
  { key: 'judging', label: 'Nature', sub: 'How do you make decisions?', opts: [
    { v: 'T', t: 'Thinking', d: 'Logic, principles, consistency' },
    { v: 'F', t: 'Feeling', d: 'Values, harmony, people-centered' }
  ]},
  { key: 'lifestyle', label: 'Tactics', sub: 'How do you organize life?', opts: [
    { v: 'J', t: 'Judging', d: 'Planned, structured, decided' },
    { v: 'P', t: 'Perceiving', d: 'Flexible, open, exploratory' }
  ]}
];

// ===== 28 题测试器（ABCD 4 选项 Likert，aa17d11e 设计 + a46a276a 整合）=====
// 数据真源：build/mbti-quiz-4opt.json（28 题 × 4 选项 + 计分 meta）
// 维度映射：EI（能量方向）/ NS（信息收集）/ TF（决策）/ JP（生活方式）
// 每题 4 选项 A/B/C/D → 加权计分：A=+2X / B=+1X / C=+1Y / D=+2Y（X/Y 是维度两端）
// 每维度两极累计 0..14（7 题 × 权重 1 或 2，全答 X+Y=14）
// 决主导极：decide(X,Y) 用 >= tiebreak（first-letter-wins，与原 binary 一致，无静默翻转）
// strength 标签：4 维 gap 平均 → ≥6 strong / 3-5.99 moderate / <3 mild
// 关联站特色：部分题干带水晶/冥想/塔罗场景（#2 持握水晶 / #9 塔罗 / #11 冥想 / #12 选水晶 / #17 选石）
const QUIZ_SRC = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mbti-quiz-4opt.json'), 'utf8'));
const QUIZ = QUIZ_SRC.questions;

const MBTI_NOTICE = (M._meta && M._meta.mbti_trademark_notice) || 'MBTI is a registered trademark of The Myers-Briggs Company. This tool is an independent framework based on Jungian cognitive functions, offered for self-reflection — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company.';

// ===== asciiJSON + safeJSON（皇冠/daily-tarot 同款，wp_kses 防）=====
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DATA_BLOCK = asciiJSON({
  types: TYPES,
  cards: CARDS,
  card_by_slug: CARD_BY_SLUG,
  dichotomies: DICHOTOMIES,
  quiz: QUIZ,
  healing: HEALING,
  notice: MBTI_NOTICE
});

// ===== APP_JS（4 步选择 + 双牌渲染 + 3 水晶 + 生日双轨 + deep link + 分享）=====
// 守 wp_kses：CJK 已在数据 asciiJSON 转义；APP_JS 文案全英文 + ASCII，base64 包装后 &&/< 全部躲过实体转义。
const APP_JS = `(function(){
  var DATA;
  try { DATA = JSON.parse(document.getElementById('emt-data').textContent); }
  catch (e) { console.error('EMT data parse failed', e); return; }

  var TYPES = DATA.types, CARDS = DATA.cards, CARD_BY_SLUG = DATA.card_by_slug;
  var DICHOTOMIES = DATA.dichotomies, QUIZ = DATA.quiz, HEALING = DATA.healing, NOTICE = DATA.notice;

  // ---------- 工具函数 ----------
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  // Case transforms (rendering layer only — JSON data unchanged)
  // toTitleCaseEvery: 每词首字母大写（含小词 at/of/the 都大写），保留尾部标点（— , .）和连字符词
  function toTitleCaseEvery(s){
    s = String(s==null?'':s);
    return s.split(' ').map(function(w){
      // 跳过纯标点/破折号 token（如 "—" 或 "—")
      if (!w || !/[a-zA-Z]/.test(w)) return w;
      // 连字符词：每段首字母大写（self-reflection → Self-Reflection）
      return w.split('-').map(function(seg){
        if (!seg || !/[a-zA-Z]/.test(seg.charAt(0))) return seg;
        return seg.charAt(0).toUpperCase() + seg.slice(1);
      }).join('-');
    }).join(' ');
  }
  // sentenceCase: 句首大写，其余保持（如 label 全小写则首字母大写其余不动；不强制 lower-case 后续）
  function sentenceCase(s){
    s = String(s==null?'':s);
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // displayType: INTJ → Intj（前端显示柔和；数据层 type=INTJ 不变，用于查表/deep link 解析）
  // 商标 "MBTI" 本身仍全大写（NOTICE 文案不动）。
  function displayType(t){ t = String(t||''); return t ? (t[0] + t.slice(1).toLowerCase()) : t; }
  function shopUrl(stone){
    if (!stone) return HEALING;
    if (stone.shop) return stone.shop;
    if (stone.slug) return '/shop/?s='+encodeURIComponent(stone.slug);
    return HEALING;
  }
  function meaningUrl(stone){
    if (!stone || !stone.slug) return '';
    return '/' + stone.slug + '/';
  }

  // Tarot Birth Card 算法（路径 B 生日双轨，复用 tarot-birth-card 数值归约）
  // Tarot.com: month + day + year + month + day → 反复归约到 ≤22
  function birthCardFromBirthday(m, d, y){
    var sum = m + d + y + m + d;
    while (sum > 22) {
      sum = String(sum).split('').reduce(function(a, c){ return a + Number(c); }, 0);
      if (String(sum).length === 1) break; // 单位数已 ≤22
    }
    var idx = (sum === 22) ? 0 : sum - 1; // 22 → The Fool（循环）
    if (idx >= CARDS.length) idx = idx % CARDS.length;
    return CARDS[idx];
  }

  // ---------- 程序化牌面（复用 daily-tarot .edt-tarot-face 视觉，改 emt- 前缀）----------
  function cardFace(c, sizeClass){
    sizeClass = sizeClass || '';
    var html = '<div class="emt-tarot-face ' + sizeClass + '" aria-hidden="true">';
    html += '<div class="emt-tarot-crystal ' + sizeClass + '"></div>';
    html += '<div class="emt-tarot-num">' + esc(c.number) + '</div>';
    html += '<div class="emt-tarot-name">' + esc(c.name) + '</div>';
    html += '<div class="emt-tarot-arch">' + esc(c.archetype) + '</div>';
    html += '<div class="emt-tarot-astro">' + esc(c.astrology) + ' &middot; ' + esc(c.element) + '</div>';
    html += '</div>';
    return html;
  }

  // ---------- 模式切换（顶部）----------
  function renderModeSwitch(active){
    active = active || 'quick';
    var html = '';
    html += '<section class="emt-mode-switch" role="tablist" aria-label="Choose how to find your type">';
    html += '  <button type="button" class="emt-mode-tab' + (active==='quick' ? ' emt-mode-tab-active' : '') + '" role="tab" aria-selected="' + (active==='quick' ? 'true' : 'false') + '" data-mode="quick">';
    html += '    <span class="emt-mode-tab-num">A</span>';
    html += '    <span class="emt-mode-tab-t">Quick Pick</span>';
    html += '    <span class="emt-mode-tab-d">Already know your 4 letters? Pick them.</span>';
    html += '  </button>';
    html += '  <button type="button" class="emt-mode-tab' + (active==='test' ? ' emt-mode-tab-active' : '') + '" role="tab" aria-selected="' + (active==='test' ? 'true' : 'false') + '" data-mode="test">';
    html += '    <span class="emt-mode-tab-num">B</span>';
    html += '    <span class="emt-mode-tab-t">Take the 28-Question Test</span>';
    html += '    <span class="emt-mode-tab-d">Not sure yet? Answer 28 scenario questions.</span>';
    html += '  </button>';
    html += '</section>';
    return html;
  }

  // ---------- Test mode (28-question ABCD Likert) ----------
  // 4-option weighted scoring: A=+2X / B=+1X / C=+1Y / D=+2Y (X/Y are the two poles; poles[0]=X, poles[1]=Y)
  // Each dimension pole sum 0..14; decide(X,Y) uses >= tiebreak (first-letter-wins, identical to the old binary version)
  // strength: average of the 4 |X-Y| gaps -> >=6 strong / 3-5.99 moderate / <3 mild
  function scoreQuiz(answers){
    // answers: { questionId: 'A'|'B'|'C'|'D' }
    var poles = { E:0, I:0, N:0, S:0, T:0, F:0, J:0, P:0 };
    for (var i = 0; i < QUIZ.length; i++){
      var q = QUIZ[i];
      var pick = answers[q.id];
      if (!pick) continue;
      var opt = null;
      for (var k = 0; k < q.options.length; k++){
        if (q.options[k].key === pick) { opt = q.options[k]; break; }
      }
      if (!opt || !opt.score) continue;
      var scoreKeys = Object.keys(opt.score);
      for (var ki = 0; ki < scoreKeys.length; ki++){
        var pole = scoreKeys[ki];
        if (poles.hasOwnProperty(pole)) poles[pole] += opt.score[pole];
      }
    }
    function decide(xLetter, yLetter){
      return poles[xLetter] >= poles[yLetter] ? xLetter : yLetter;
    }
    var gapEI = Math.abs(poles.E - poles.I);
    var gapNS = Math.abs(poles.N - poles.S);
    var gapTF = Math.abs(poles.T - poles.F);
    var gapJP = Math.abs(poles.J - poles.P);
    var avgGap = (gapEI + gapNS + gapTF + gapJP) / 4;
    var strength = avgGap >= 6 ? 'strong' : (avgGap >= 3 ? 'moderate' : 'mild');
    return {
      type: decide('E','I') + decide('N','S') + decide('T','F') + decide('J','P'),
      counts: poles,
      gaps: { EI: gapEI, NS: gapNS, TF: gapTF, JP: gapJP },
      strength: strength
    };
  }

  function renderTest(){
    var html = '';
    html += '<section class="emt-test-card">';
    html += '  <h2 class="emt-input-h2">The 28-Question MBTI Test</h2>';
    html += '  <p class="emt-input-sub">Twenty-eight honest scenarios &mdash; pick the option that feels more like you in everyday life. There is no right answer. At the end, we match your type to a Major Arcana card.</p>';
    html += '  <div class="emt-test-stage" id="emt-test-stage"></div>';
    html += '  <div class="emt-test-progress" id="emt-test-progress"></div>';
    html += '</section>';
    return html;
  }

  // renderTestQuestion — Layout B 2x2 grid (cols = poles X/Y, rows = strength strong/slight, diagonal strength pairing)
  // Source order: A(strong X) / C(slight Y) / B(slight X) / D(strong Y) -> explicit grid-area into 2x2
  function renderTestQuestion(idx, answers){
    // idx: 0-based question index; answers: current answers
    var q = QUIZ[idx];
    var total = QUIZ.length;
    var pct = Math.round(((idx) / total) * 100);
    var picked = answers[q.id];
    // Index the 4 options by key (A/B/C/D); strength is derived from key (A/D = strong, B/C = slight)
    var optBy = {};
    for (var i = 0; i < q.options.length; i++) optBy[q.options[i].key] = q.options[i];
    var dimNames = { EI: 'Energy', NS: 'Information', TF: 'Decisions', JP: 'Lifestyle' };
    var xLetter = q.poles[0], yLetter = q.poles[1];
    var dimLabel = dimNames[q.dimension] || q.dimension;
    var html = '';
    // Progress
    html += '<div class="emt-q-progress-bar"><div class="emt-q-progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<div class="emt-q-progress-meta">Question ' + (idx+1) + ' of ' + total + ' &middot; ' + esc(dimLabel) + '</div>';
    // Question (scenario → Title Case every word, per user spec)
    html += '<div class="emt-q-prompt">' + esc(toTitleCaseEvery(q.scenario)) + '</div>';
    // 4 options in a 2x2 grid (top row: A strong X, C slight Y; bottom row: B slight X, D strong Y)
    // Column headers (left X / right Y) + diagonal strength pairing (strong A<->D, slight B<->C)
    html += '<div class="emt-q-opts emt-q-opts-grid">';
    html += '  <div class="emt-q-col-head emt-q-col-x">' + esc(xLetter) + '<span class="emt-q-col-tag">Strongly / Slightly</span></div>';
    html += '  <div class="emt-q-col-head emt-q-col-y">' + esc(yLetter) + '<span class="emt-q-col-tag">Slightly / Strongly</span></div>';
    // Top row: A (strong X), C (slight Y)
    html += renderOptCell(optBy['A'], q.id, 'strong', xLetter, picked);
    html += renderOptCell(optBy['C'], q.id, 'slight', yLetter, picked);
    // Bottom row: B (slight X), D (strong Y)
    html += renderOptCell(optBy['B'], q.id, 'slight', xLetter, picked);
    html += renderOptCell(optBy['D'], q.id, 'strong', yLetter, picked);
    html += '</div>';
    // Nav
    html += '<div class="emt-q-nav">';
    html += '  <button type="button" class="emt-q-back" data-act="back"' + (idx === 0 ? ' disabled' : '') + '>&larr; Back</button>';
    if (idx < total - 1){
      html += '  <button type="button" class="emt-q-next" data-act="next"' + (picked ? '' : ' disabled') + '>Next &rarr;</button>';
    } else {
      html += '  <button type="button" class="emt-q-finish" data-act="finish"' + (picked ? '' : ' disabled') + '>See my MBTI tarot card &rarr;</button>';
    }
    html += '</div>';
    return html;
  }
  function renderOptCell(opt, qid, strength, pole, picked){
    if (!opt) return '';
    var isActive = picked === opt.key;
    var cls = 'emt-q-opt emt-q-opt-' + strength + (isActive ? ' emt-q-opt-active' : '');
    var tag = strength === 'strong' ? 'Strongly' : 'Slightly';
    var html = '';
    html += '<button type="button" class="' + cls + '" data-qid="' + qid + '" data-pick="' + opt.key + '" aria-label="Option ' + opt.key + ', ' + tag + ' ' + pole + '">';
    html += '  <span class="emt-q-opt-mark">' + opt.key + '</span>';
    html += '  <span class="emt-q-opt-tag">' + tag + ' ' + pole + '</span>';
    html += '  <span class="emt-q-opt-text">' + esc(opt.label.toLowerCase()) + '</span>';
    html += '</button>';
    return html;
  }

  // Test 状态机
  var testState = { idx: 0, answers: {} };

  function mountTest(){
    var stage = document.getElementById('emt-test-stage');
    if (!stage) return;
    stage.innerHTML = renderTestQuestion(testState.idx, testState.answers);
    bindTestOpts();
  }
  function bindTestOpts(){
    var stage = document.getElementById('emt-test-stage');
    if (!stage) return;
    var opts = stage.querySelectorAll('.emt-q-opt');
    for (var i = 0; i < opts.length; i++){
      opts[i].addEventListener('click', function(){
        var qid = this.getAttribute('data-qid');
        var pick = this.getAttribute('data-pick');
        testState.answers[qid] = pick;
        // 重渲当前题（点亮选中）+ 自动推进下一题（最后一题不推进，让用户点 finish）
        var total = QUIZ.length;
        if (testState.idx < total - 1){
          testState.idx++;
          mountTest();
        } else {
          mountTest();
        }
      });
    }
    var nav = stage.querySelectorAll('[data-act]');
    for (var j = 0; j < nav.length; j++){
      nav[j].addEventListener('click', function(){
        var act = this.getAttribute('data-act');
        if (act === 'back' && testState.idx > 0){
          testState.idx--;
          mountTest();
        } else if (act === 'next' && testState.idx < QUIZ.length - 1){
          testState.idx++;
          mountTest();
        } else if (act === 'finish'){
          finishTest();
        }
      });
    }
  }
  function finishTest(){
    var r = scoreQuiz(testState.answers);
    if (!r || !TYPES[r.type]) { return; }
    showResult(r.type, r.counts, { strength: r.strength, gaps: r.gaps });
  }

  // Scroll to the target section (avoids sticky header via scroll-margin-top CSS + scrollIntoView)
  // Target class: quick -> .emt-input-card; test -> .emt-test-card (mode switcher itself is not a landing target)
  function scrollToModeTarget(mode){
    var sel = mode === 'test' ? '.emt-test-card' : '.emt-input-card';
    var el = document.querySelector(sel);
    if (!el) return;
    try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    catch (e) { el.scrollIntoView(); }
  }
  function setMode(mode, opts){
    opts = opts || {};
    var fromTabClick = !!opts.fromTabClick;
    var inputMount = document.getElementById('emt-input-mount');
    var resultMount = document.getElementById('emt-result-mount');
    if (!inputMount) return;
    // Clear result mount
    if (resultMount) resultMount.innerHTML = '';
    if (mode === 'quick'){
      inputMount.innerHTML = renderModeSwitch('quick') + renderInput();
      bindModeSwitch();
      bindOpts();
      updateStepStates();
    } else if (mode === 'test'){
      testState = { idx: 0, answers: {} };
      inputMount.innerHTML = renderModeSwitch('test') + renderTest();
      bindModeSwitch();
      mountTest();
    }
    if (history.replaceState) history.replaceState(null, '', '#' + mode);
    // Scroll behavior:
    //   - tab click (fromTabClick): smooth-scroll to the chosen section (quick -> input card, test -> test card)
    //   - deep-link (noScroll=true): do not scroll (user is at top on first paint)
    //   - other callers: also scroll to the target section for consistency
    if (opts.noScroll) return;
    // Wait for re-render + paint before scrolling (inputMount.innerHTML just changed; layout needs a frame)
    setTimeout(function(){ scrollToModeTarget(mode); }, 60);
  }
  function bindModeSwitch(){
    var tabs = document.querySelectorAll('.emt-mode-tab');
    for (var i = 0; i < tabs.length; i++){
      tabs[i].addEventListener('click', function(){
        var m = this.getAttribute('data-mode');
        setMode(m, { fromTabClick: true });
      });
    }
  }

  // ---------- Input 模块（4 步选择 + 选填生日）----------
  function renderInput(){
    var html = '';
    html += '<section class="emt-input-card">';
    html += '  <h2 class="emt-input-h2">Find your MBTI tarot birth card</h2>';
    html += '  <p class="emt-input-sub">Four quick choices &mdash; then your Major Arcana card, your growth card, and three crystals. A mirror for self-reflection, not a diagnosis.</p>';
    html += '  <div class="emt-steps">';
    for (var i = 0; i < DICHOTOMIES.length; i++) {
      var d = DICHOTOMIES[i];
      html += '    <div class="emt-step" data-step="' + i + '">';
      html += '      <div class="emt-step-num">Step ' + (i+1) + ' of 4</div>';
      html += '      <div class="emt-step-label">' + esc(d.label) + '</div>';
      html += '      <div class="emt-step-sub">' + esc(d.sub) + '</div>';
      html += '      <div class="emt-step-opts">';
      for (var j = 0; j < d.opts.length; j++) {
        var o = d.opts[j];
        html += '        <button type="button" class="emt-opt" data-dich="' + d.key + '" data-val="' + o.v + '">';
        html += '          <span class="emt-opt-letter">' + o.v + '</span>';
        html += '          <span class="emt-opt-t">' + esc(o.t) + '</span>';
        html += '          <span class="emt-opt-d">' + esc(o.d.toLowerCase()) + '</span>';
        html += '        </button>';
      }
      html += '      </div>';
      html += '    </div>';
    }
    html += '  </div>';
    // 选填生日（折叠）
    html += '  <details class="emt-birthday">';
    html += '    <summary>Optional: add your birthday for a tarot birth card</summary>';
    html += '    <div class="emt-bday-body">';
    html += '      <p class="emt-bday-note">Already know your MBTI type above? Adding your birthday lets us also calculate your traditional tarot birth card (numerological method) and show how the two cards resonate.</p>';
    html += '      <div class="emt-bday-fields">';
    html += '        <label>Month <input type="number" id="emt-bm" min="1" max="12" placeholder="MM"></label>';
    html += '        <label>Day <input type="number" id="emt-bd" min="1" max="31" placeholder="DD"></label>';
    html += '        <label>Year <input type="number" id="emt-by" min="1900" max="2099" placeholder="YYYY"></label>';
    html += '      </div>';
    html += '    </div>';
    html += '  </details>';
    html += '</section>';
    return html;
  }

  // ---------- 结果渲染 ----------
  function renderResult(type, counts, extra){
    var tp = TYPES[type];
    if (!tp) return '';
    var primary = CARD_BY_SLUG[tp.birth_cards.primary.slug];
    var growth = CARD_BY_SLUG[tp.birth_cards.growth.slug];
    var strength = (extra && extra.strength) ? extra.strength : '';
    var gaps = (extra && extra.gaps) ? extra.gaps : null;
    var strengthLabel = strength ? (strength.charAt(0).toUpperCase() + strength.slice(1)) : '';
    var html = '';

    // Test 计分小条（counts 存在时显示，test 模式专用）+ strength 徽章 + 4 维 gap 迷你柱图
    if (counts){
      html += '<section class="emt-test-result">';
      html += '  <div class="emt-test-result-h">Your answers at a glance' + (strengthLabel ? ' &mdash; <span class="emt-strength-badge emt-strength-' + strength + '">' + strengthLabel + ' clarity</span>' : '') + '</div>';
      html += '  <div class="emt-test-result-dims">';
      var pairs = [['E','I'],['N','S'],['T','F'],['J','P']];
      for (var pi = 0; pi < pairs.length; pi++){
        var a = pairs[pi][0], b = pairs[pi][1];
        var ca = counts[a] || 0, cb = counts[b] || 0;
        var total = ca + cb || 1;
        var pa = Math.round((ca / total) * 100);
        var pb = 100 - pa;
        var winA = ca >= cb;
        html += '    <div class="emt-test-dim">';
        html += '      <div class="emt-test-dim-pair"><span class="' + (winA?'win':'') + '">' + a + ' ' + ca + '</span><span class="' + (!winA?'win':'') + '">' + cb + ' ' + b + '</span></div>';
        html += '      <div class="emt-test-dim-bar"><div class="emt-test-dim-bar-a" style="width:' + pa + '%"></div><div class="emt-test-dim-bar-b" style="width:' + pb + '%"></div></div>';
        html += '    </div>';
      }
      html += '  </div>';
      // 4-axis gap mini-chart (Likert dividend: users see which axes are decisive and which are close)
      if (gaps){
        var gapPairs = [['EI', 'E', 'I'], ['NS', 'N', 'S'], ['TF', 'T', 'F'], ['JP', 'J', 'P']];
        var sumGap = 0;
        for (var gi = 0; gi < gapPairs.length; gi++) sumGap += gaps[gapPairs[gi][0]] || 0;
        var avgGap = sumGap / 4;
        html += '  <div class="emt-gap-chart">';
        html += '    <div class="emt-gap-chart-h">Decisiveness per axis <span class="emt-gap-avg">(avg ' + avgGap.toFixed(1) + ' / 14)</span></div>';
        for (var gj = 0; gj < gapPairs.length; gj++){
          var dimKey = gapPairs[gj][0], xLet = gapPairs[gj][1], yLet = gapPairs[gj][2];
          var g = gaps[dimKey] || 0;
          var gPct = Math.round((g / 14) * 100);
          var gBand = g >= 8 ? 'strong' : (g >= 4 ? 'moderate' : 'mild');
          html += '  <div class="emt-gap-row">';
          html += '    <span class="emt-gap-dim">' + xLet + ' / ' + yLet + '</span>';
          html += '    <span class="emt-gap-track"><span class="emt-gap-fill emt-gap-fill-' + gBand + '" style="width:' + gPct + '%"></span></span>';
          html += '    <span class="emt-gap-num">' + g + '</span>';
          html += '  </div>';
        }
        html += '  </div>';
      }
      html += '</section>';
    }

    // Hero
    html += '<section class="emt-hero-card">';
    html += '  <div class="emt-hero-head">';
    html += '    <div class="emt-hero-left">';
    html += '      <div class="emt-type-badge">' + esc(displayType(type)) + ' &middot; ' + esc(tp.group) + (strength ? ' &middot; ' + strengthLabel : '') + '</div>';
    html += '      <h1 class="emt-h1">' + esc(displayType(type)) + ' &mdash; ' + esc(tp.nickname) + '</h1>';
    html += '      <div class="emt-stack">';
    html += '        <span class="emt-stack-lbl">Cognitive stack</span>';
    html += '        <span class="emt-stack-fn dom">' + esc(tp.cognitive_stack.dominant) + '</span>';
    html += '        <span class="emt-stack-sep">&middot;</span>';
    html += '        <span class="emt-stack-fn">' + esc(tp.cognitive_stack.auxiliary) + '</span>';
    html += '        <span class="emt-stack-sep">&middot;</span>';
    html += '        <span class="emt-stack-fn">' + esc(tp.cognitive_stack.tertiary) + '</span>';
    html += '        <span class="emt-stack-sep">&middot;</span>';
    html += '        <span class="emt-stack-fn inf">' + esc(tp.cognitive_stack.inferior) + '</span>';
    html += '      </div>';
    html += '      <p class="emt-hero-line">Your dominant function (' + esc(tp.cognitive_stack.dominant) + ') resonates with the archetype of <strong>' + esc(primary.name) + '</strong> &mdash; a mirror for how you naturally process the world, not a verdict on who you are.</p>';
    html += '      <div class="emt-share-row">';
    html += '        <button type="button" class="emt-share-btn" id="emt-share">🔗 Share my MBTI tarot card</button>';
    html += '        <span class="emt-share-hint" id="emt-share-hint"></span>';
    html += '        <button type="button" class="emt-reset-btn" id="emt-reset">↺ Try another type</button>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div class="emt-hero-right">';
    html += '      <div class="emt-hero-duo">' + cardFace(primary, 'med') + cardFace(growth, 'med growth') + '</div>';
    html += '      <div class="emt-hero-duo-cap"><span>Primary</span><span>Growth</span></div>';
    html += '    </div>';
    html += '  </div>';
    html += '</section>';

    // M1 Primary
    html += '<section class="emt-module" id="emt-m1">';
    html += '  <div class="emt-mod-head"><span class="emt-mod-num">M1</span><h2>Your Primary Card: ' + esc(primary.name) + '</h2></div>';
    html += '  <div class="emt-m1-grid">';
    html += '    <div class="emt-m1-left">' + cardFace(primary, '') + '</div>';
    html += '    <div class="emt-m1-right">';
    html += '      <div class="emt-card-arch">' + esc(primary.archetype) + ' &middot; ' + esc(primary.astrology) + ' &middot; ' + esc(primary.element) + '</div>';
    html += '      <div class="emt-card-theme">' + esc(primary.theme) + '</div>';
    if (tp.birth_cards.primary.reason){
      html += '      <div class="emt-reason"><span class="emt-reason-lbl">Why this card for ' + esc(displayType(type)) + '</span><p>' + esc(tp.birth_cards.primary.reason) + '</p></div>';
    }
    html += '      <p class="emt-body">' + esc(tp.upright_reading) + '</p>';
    html += '      <div class="emt-lens"><span class="emt-lens-lbl">A psychological lens</span><p>' + esc(primary.psych || primary.upright_meaning.slice(0, 180)) + '</p></div>';
    html += '    </div>';
    html += '  </div>';
    // 生日融合段（若填了）
    var bm = document.getElementById('emt-bm'), bd = document.getElementById('emt-bd'), by = document.getElementById('emt-by');
    if (bm && bd && by && bm.value && bd.value && by.value){
      var m = parseInt(bm.value,10), d = parseInt(bd.value,10), y = parseInt(by.value,10);
      if (m>=1&&m<=12&&d>=1&&d<=31&&y>=1900&&y<=2099){
        var bc = birthCardFromBirthday(m, d, y);
        html += '  <div class="emt-fusion">';
        html += '    <div class="emt-fusion-h">Your birthday card: ' + esc(bc.name) + '</div>';
        html += '    <p class="emt-fusion-body">By the numerological method (month + day + year), your birthday tarot birth card is <strong>' + esc(bc.name) + '</strong>. Your MBTI card (' + esc(primary.name) + ') and birthday card (' + esc(bc.name) + ') sit side by side &mdash; two mirrors, not one. Notice where they reinforce each other and where they offer different angles on the same pattern.</p>';
        html += '  </div>';
      }
    }
    html += '</section>';

    // M2 Growth
    html += '<section class="emt-module" id="emt-m2">';
    html += '  <div class="emt-mod-head"><span class="emt-mod-num">M2</span><h2>Your Growth Card: ' + esc(growth.name) + '</h2></div>';
    html += '  <div class="emt-m2-grid">';
    html += '    <div class="emt-m2-left">' + cardFace(growth, '') + '</div>';
    html += '    <div class="emt-m2-right">';
    html += '      <div class="emt-card-arch">' + esc(growth.archetype) + ' &middot; ' + esc(growth.theme) + '</div>';
    if (tp.birth_cards.growth.reason){
      html += '      <div class="emt-reason emt-reason-growth"><span class="emt-reason-lbl">Why this is your growth card</span><p>' + esc(tp.birth_cards.growth.reason) + '</p></div>';
    }
    html += '      <p class="emt-body">' + esc(tp.reversed_shadow) + '</p>';
    if (growth.practice){
      html += '      <div class="emt-practice"><span class="emt-prac-lbl">A question to sit with</span><p>' + esc(growth.practice) + '</p></div>';
    }
    html += '    </div>';
    html += '  </div>';
    html += '</section>';

    // M3 Crystals
    html += '<section class="emt-module emt-m3" id="emt-m3">';
    html += '  <div class="emt-mod-head"><span class="emt-mod-num edt-mod-num-gold">M3</span><h2>Three Crystals for ' + esc(displayType(type)) + '</h2></div>';
    html += '  <p class="emt-lede edt-lede-soft">Mindful companions for your card&apos;s archetype &mdash; traditionally paired, traditionally worn.</p>';
    html += '  <div class="emt-stones">';
    (tp.crystals || []).forEach(function(stone, idx){
      var imgHtml = stone.img ? '<img class="emt-stone-img" src="' + esc(stone.img) + '" alt="' + esc(stone.name) + '" loading="lazy">' : '<div class="emt-stone-img emt-stone-img-ph"></div>';
      var roleLabel = stone.role === 'best_overall' ? 'Primary stone' : (stone.role === 'best_upright' ? 'Supporting stone' : 'Growth stone');
      html += '    <div class="emt-stone-card">';
      html += '      ' + imgHtml;
      html += '      <div class="emt-stone-body">';
      html += '        <div class="emt-stone-tag">' + esc(roleLabel) + '</div>';
      html += '        <div class="emt-stone-name">' + esc(stone.name) + '</div>';
      html += '        <p class="emt-stone-reason">' + esc(stone.reason) + '</p>';
      html += '        <div class="emt-stone-cta">';
      html += '          <a class="emt-stone-shop" href="' + esc(shopUrl(stone)) + '">Shop ' + esc(stone.name) + ' &rarr;</a>';
      var mu = meaningUrl(stone);
      if (mu) html += '          <a class="emt-stone-meaning" href="' + esc(mu) + '">Meaning &rarr;</a>';
      html += '        </div>';
      html += '      </div>';
      html += '    </div>';
    });
    html += '  </div>';
    html += '  <div class="emt-cta-row">';
    html += '    <a class="emt-cta emt-cta-sec" href="' + esc(HEALING) + '">Shop all healing jewelry &rarr;</a>';
    html += '    <a class="emt-cta emt-cta-link" href="/tarot-' + esc(primary.slug.replace(/^the-/,'')) + '-crystals/">Read the full ' + esc(primary.name) + ' guide &rarr;</a>';
    html += '  </div>';
    html += '</section>';

    // M4 Eastern
    html += '<section class="emt-module" id="emt-m4">';
    html += '  <div class="emt-mod-head"><span class="emt-mod-num">M4</span><h2>Eastern Anchor</h2></div>';
    html += '  <div class="emt-eastern-card">';
    html += '    <div class="emt-eastern-text">' + esc(tp.eastern_anchor) + '</div>';
    if (primary.eastern){
      html += '    <div class="emt-eastern-card-anchor"><span class="emt-anchor-lbl">Eastern anchor of ' + esc(primary.name) + '</span><p>' + esc(primary.eastern) + '</p></div>';
    }
    html += '    <p class="emt-note">A cultural cue for reflection, not a doctrine or prescription. Crystal associations are traditional, not medical claims.</p>';
    html += '  </div>';
    html += '</section>';

    // M5 Related
    html += '<section class="emt-module" id="emt-m5">';
    html += '  <div class="emt-mod-head"><span class="emt-mod-num">M5</span><h2>Related Types &amp; Intentions</h2></div>';
    html += '  <p class="emt-lede edt-lede-soft">Types that share cognitive functions with you &mdash; their cards may resonate too.</p>';
    html += '  <div class="emt-rel-grid">';
    (tp.related_types || []).forEach(function(rt){
      var r = TYPES[rt];
      if (!r) return;
      var rp = CARD_BY_SLUG[r.birth_cards.primary.slug];
      html += '    <a class="emt-rel-card" href="#' + rt.toLowerCase() + '" data-type="' + rt + '">';
      html += '      <span class="emt-rel-type">' + esc(displayType(rt)) + ' &middot; ' + esc(r.nickname) + '</span>';
      html += '      <span class="emt-rel-card-name">' + esc(rp.name) + '</span>';
      html += '    </a>';
    });
    html += '  </div>';
    html += '</section>';

    // MBTI 商标 disclaimer
    html += '<section class="emt-notice-card"><p>' + esc(NOTICE) + '</p></section>';

    return html;
  }

  // ---------- 主流程 ----------
  var selected = { attitude: '', perceiving: '', judging: '', lifestyle: '' };

  function updateStepStates(){
    var steps = document.querySelectorAll('.emt-step');
    for (var i = 0; i < steps.length; i++) {
      var stepIdx = parseInt(steps[i].getAttribute('data-step'), 10);
      var d = DICHOTOMIES[stepIdx];
      var sel = selected[d.key];
      var opts = steps[i].querySelectorAll('.emt-opt');
      for (var j = 0; j < opts.length; j++) {
        if (opts[j].getAttribute('data-val') === sel) opts[j].classList.add('emt-opt-active');
        else opts[j].classList.remove('emt-opt-active');
      }
      steps[i].classList.toggle('emt-step-done', !!sel);
      steps[i].classList.toggle('emt-step-active', stepIdx === currentStep() && !sel);
    }
  }
  function currentStep(){
    for (var i = 0; i < DICHOTOMIES.length; i++) {
      if (!selected[DICHOTOMIES[i].key]) return i;
    }
    return DICHOTOMIES.length;
  }
  function maybeShowResult(){
    if (selected.attitude && selected.perceiving && selected.judging && selected.lifestyle) {
      var type = selected.attitude + selected.perceiving + selected.judging + selected.lifestyle;
      showResult(type);
    }
  }
  function showResult(type, counts, extra){
    var mount = document.getElementById('emt-result-mount');
    if (mount) mount.innerHTML = renderResult(type, counts, extra);
    var inputMount = document.getElementById('emt-input-mount');
    if (inputMount) inputMount.style.display = 'none';
    if (history.replaceState) history.replaceState(null, '', '#' + type.toLowerCase());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    bindShare(type);
    bindReset();
    bindRelCards();
  }
  function reset(){
    // 重置回 Quick Pick 模式（含顶部模式切换）
    selected = { attitude: '', perceiving: '', judging: '', lifestyle: '' };
    testState = { idx: 0, answers: {} };
    var inputMount = document.getElementById('emt-input-mount');
    if (inputMount) { inputMount.style.display = ''; inputMount.innerHTML = renderModeSwitch('quick') + renderInput(); }
    var mount = document.getElementById('emt-result-mount');
    if (mount) mount.innerHTML = '';
    if (history.replaceState) history.replaceState(null, '', '#quick');
    bindModeSwitch();
    bindOpts();
    updateStepStates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function bindOpts(){
    var opts = document.querySelectorAll('.emt-opt');
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener('click', function(){
        var dich = this.getAttribute('data-dich');
        var val = this.getAttribute('data-val');
        selected[dich] = val;
        updateStepStates();
        setTimeout(maybeShowResult, 220);  // 给视觉反馈留过渡
      });
    }
  }
  function bindShare(type){
    var btn = document.getElementById('emt-share');
    var hint = document.getElementById('emt-share-hint');
    if (!btn) return;
    var tp = TYPES[type];
    var cardName = tp && CARD_BY_SLUG[tp.birth_cards.primary.slug] ? CARD_BY_SLUG[tp.birth_cards.primary.slug].name : type;
    var url = window.location.origin + window.location.pathname + '#' + type.toLowerCase();
    var text = 'My MBTI tarot birth card is ' + cardName + ' (' + displayType(type) + '). What\\'s yours? ' + url;
    btn.addEventListener('click', function(){
      if (navigator.share){
        navigator.share({ title: 'MBTI Tarot: ' + displayType(type) + ' — ' + cardName, text: text, url: url }).catch(function(){});
      } else if (navigator.clipboard){
        navigator.clipboard.writeText(text).then(function(){
          if (hint){ hint.textContent = 'Copied!'; setTimeout(function(){ if(hint) hint.textContent = ''; }, 2200); }
        }, function(){ if(hint){ hint.textContent = 'Copy failed — long-press the URL'; } });
      } else { if(hint){ hint.textContent = 'Long-press the URL to share'; } }
    });
  }
  function bindReset(){
    var btn = document.getElementById('emt-reset');
    if (btn) btn.addEventListener('click', reset);
  }
  function bindRelCards(){
    var cards = document.querySelectorAll('.emt-rel-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function(e){
        e.preventDefault();
        var t = this.getAttribute('data-type');
        if (t && TYPES[t]) {
          selected = { attitude: t[0], perceiving: t[1], judging: t[2], lifestyle: t[3] };
          showResult(t);
        }
      });
    }
  }

  function init(){
    var inputMount = document.getElementById('emt-input-mount');
    if (inputMount) inputMount.innerHTML = renderModeSwitch('quick') + renderInput();
    bindModeSwitch();
    bindOpts();
    // Page-hero deck preview: 22 Major Arcana 视觉锚（取 The Fool + The Hermit 作意象，避免绑定具体型）
    var deckEl = document.getElementById('emt-page-hero-deck');
    if (deckEl && CARDS.length){
      var fool = CARD_BY_SLUG['the-fool'] || CARDS[0];
      var hermit = CARD_BY_SLUG['the-hermit'] || CARDS[8] || CARDS[0];
      if (fool && hermit) deckEl.innerHTML = cardFace(fool, 'med') + cardFace(hermit, 'med growth');
    }
    // deep link 优先级：4 字母型 (#intj) > #test > #quick（默认）
    var hashRaw = (window.location.hash || '').replace(/^#/, '');
    var hashUp = hashRaw.toUpperCase();
    if (hashUp && TYPES[hashUp] && /^[EI][NS][TF][JP]$/.test(hashUp)) {
      // 4 字母型 → 直接出结果（不强制模式，沿用 quick mount）
      selected = { attitude: hashUp[0], perceiving: hashUp[1], judging: hashUp[2], lifestyle: hashUp[3] };
      showResult(hashUp);
    } else if (hashRaw.toLowerCase() === 'test') {
      setMode('test', { noScroll: true });
    } else {
      // 默认 quick（含 #quick 或空 hash）
      updateStepStates();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`;

// ===== asciiEscape（base64 包装前的全 ASCII 化，皇冠/daily-tarot 同款）=====
function asciiEscape(s){ return s.replace(/[^\x00-\x7F]/g, function (ch) { return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4); }); }
const APP_B64 = Buffer.from(asciiEscape(APP_JS), 'utf8').toString('base64');

// ===== HTML 组装（浅色站点品牌 + 嵌入式 + emt- 前缀）=====
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}

const html = `<!-- ===== MBTI Tarot v1.0 (tool #22) ===== -->
<div class="emt-root">
  <div class="emt-inner">

    <!-- Page Hero: tool-level banner (above selector) -->
    <section class="emt-page-hero" aria-label="MBTI Tarot Birth Card Finder intro">
      <div class="emt-page-hero-left">
        <div class="emt-page-hero-eyebrow">Free Tool &middot; Self-Reflection</div>
        <h1 class="emt-page-hero-title">MBTI Tarot Birth Card Finder</h1>
        <p class="emt-page-hero-sub">Match your MBTI type to a Major Arcana card through Jungian cognitive functions &mdash; a primary birth card, a growth card, and three crystals. A mirror for contemplation, not a diagnosis.</p>
        <div class="emt-page-hero-trust">
          <span class="emt-trust-pill">16 types</span>
          <span class="emt-trust-pill">22 Major Arcana</span>
          <span class="emt-trust-pill">No sign-up</span>
        </div>
      </div>
      <div class="emt-page-hero-right" aria-hidden="true">
        <div class="emt-page-hero-deck" id="emt-page-hero-deck"></div>
        <div class="emt-page-hero-deck-cap">22 Major Arcana &middot; 16 type mirrors</div>
      </div>
    </section>

    <!-- Input: 4-step selector + optional birthday -->
    <div id="emt-input-mount"><div class="emt-loading">Loading the MBTI tarot selector&hellip;</div></div>

    <!-- Result mount (Hero + M1-M5 rendered here after selection) -->
    <div id="emt-result-mount"></div>

    <!-- Gentle Note disclaimer -->
    <section class="emt-gentle">
      <p><strong>A gentle note.</strong> Tarot is a tool for self-reflection, not a prediction of fixed outcomes. Crystal associations and Eastern anchors are traditional and cultural &mdash; not medical, financial, or personality-diagnosis advice. Sit with what surfaces; choose what serves you.</p>
    </section>

  </div>
</div>

<style>
.emt-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#1A1A2E;line-height:1.6}
.emt-inner{max-width:1140px;margin:0 auto;padding:24px 28px 40px}

.emt-loading{padding:60px 20px;text-align:center;color:#888;font-size:16px}

/* Page Hero (tool-level banner above selector) */
.emt-page-hero{display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center;background:linear-gradient(135deg,#FBF8F1 0%,#F0F7F4 60%,#fff 100%);border:1px solid #E8E2D5;border-radius:20px;padding:36px 40px;margin-bottom:24px;overflow:hidden;position:relative}
.emt-page-hero:before{content:"";position:absolute;top:-40px;right:-40px;width:240px;height:240px;background:radial-gradient(circle,rgba(207,170,62,.12) 0%,transparent 70%);pointer-events:none}
.emt-page-hero-left{min-width:0;position:relative}
.emt-page-hero-eyebrow{display:inline-block;background:#fff;color:#7A5A12;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;letter-spacing:.08em;text-transform:uppercase;border:1px solid #E8C77A;margin-bottom:14px}
.emt-page-hero-title{font-size:34px;font-weight:800;color:#1A1A2E;margin:0 0 12px;line-height:1.15;letter-spacing:-.015em}
.emt-page-hero-sub{font-size:16px;color:#444;margin:0 0 18px;line-height:1.65;max-width:560px}
.emt-page-hero-trust{display:flex;gap:8px;flex-wrap:wrap}
.emt-trust-pill{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #C8E6D5;color:#2D6A4F;font-size:12px;font-weight:700;padding:6px 12px;border-radius:20px}
.emt-trust-pill:before{content:"";width:6px;height:6px;border-radius:50%;background:#2D6A4F}
.emt-page-hero-right{display:flex;flex-direction:column;align-items:center;position:relative}
.emt-page-hero-deck{display:flex;gap:14px}
.emt-page-hero-deck .emt-tarot-face{box-shadow:0 12px 32px rgba(26,26,46,.22)}
.emt-page-hero-deck .emt-tarot-face:first-child{transform:rotate(-4deg)}
.emt-page-hero-deck .emt-tarot-face:last-child{transform:rotate(4deg) translateY(-8px)}
.emt-page-hero-deck-cap{margin-top:14px;font-size:11px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.08em;text-align:center}

/* Mode switch (top dual-mode) */
.emt-mode-switch{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.emt-mode-tab{display:flex;flex-direction:column;align-items:flex-start;text-align:left;background:#fff;border:2px solid #E8E2D5;border-radius:14px;padding:16px 20px;cursor:pointer;transition:border-color .2s,box-shadow .2s,background .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-mode-tab:hover{border-color:#2D6A4F;box-shadow:0 2px 10px rgba(26,26,46,.07)}}
.emt-mode-tab-active{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 3px rgba(45,106,79,.12)}
.emt-mode-tab-num{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:#CFAA3E;color:#fff;border-radius:50%;font-size:14px;font-weight:800;margin-bottom:8px}
.emt-mode-tab-active .emt-mode-tab-num{background:#2D6A4F}
.emt-mode-tab-t{font-size:16px;font-weight:800;color:#1A1A2E;margin-bottom:3px}
.emt-mode-tab-d{font-size:13px;color:#5A5A6E;line-height:1.45;text-transform:none}

/* Test mode */
.emt-test-card{background:#fff;border:1px solid #E8E2D5;border-radius:18px;padding:32px 36px;margin-bottom:24px;scroll-margin-top:90px}
.emt-q-progress-bar{width:100%;height:6px;background:#F0F0F0;border-radius:6px;overflow:hidden;margin-bottom:8px}
.emt-q-progress-fill{height:100%;background:linear-gradient(90deg,#2D6A4F 0%,#CFAA3E 100%);transition:width .3s}
.emt-q-progress-meta{font-size:12px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-bottom:22px}
.emt-q-prompt{font-size:21px;font-weight:700;color:#1A1A2E;line-height:1.4;margin-bottom:20px;letter-spacing:-.005em}
/* 2x2 grid: columns = poles (X left, Y right), rows = strength (strong top, slight bottom); source order A,C,B,D -> explicit grid-area */
.emt-q-opts-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto auto;gap:12px 14px;margin-bottom:20px}
.emt-q-col-head{display:flex;flex-direction:column;font-size:13px;font-weight:800;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;padding:0 4px 6px}
.emt-q-col-head .emt-q-col-tag{font-size:10px;font-weight:600;color:#888;text-transform:none;letter-spacing:.02em;margin-top:2px}
.emt-q-col-head.emt-q-col-y{color:#7A5A12}
.emt-q-opts-grid > .emt-q-col-x{grid-area:1 / 1}
.emt-q-opts-grid > .emt-q-col-y{grid-area:1 / 2}
.emt-q-opts-grid > button:nth-of-type(1){grid-area:2 / 1} /* A strong X */
.emt-q-opts-grid > button:nth-of-type(2){grid-area:2 / 2} /* C slight Y */
.emt-q-opts-grid > button:nth-of-type(3){grid-area:3 / 1} /* B slight X */
.emt-q-opts-grid > button:nth-of-type(4){grid-area:3 / 2} /* D strong Y */
.emt-q-opt{display:flex;flex-direction:column;gap:6px;align-items:flex-start;text-align:left;background:#FAFAFA;border:2px solid #E8E2D5;border-radius:12px;padding:14px 16px;cursor:pointer;transition:border-color .15s,box-shadow .15s,background .15s;font-family:inherit;-webkit-tap-highlight-color:transparent;min-height:100%}
@media (hover:hover){.emt-q-opt:hover{border-color:#2D6A4F;box-shadow:0 2px 8px rgba(26,26,46,.07);transform:translateY(-1px)}}
.emt-q-opt-active{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 3px rgba(45,106,79,.12)}
.emt-q-opt:focus-visible{outline:2px solid #2D6A4F;outline-offset:2px}
.emt-q-opt-mark{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:#fff;border:2px solid #CFAA3E;color:#7A5A12;border-radius:50%;font-size:13px;font-weight:800;text-transform:uppercase}
.emt-q-opt-active .emt-q-opt-mark{background:#2D6A4F;border-color:#2D6A4F;color:#fff}
.emt-q-opt-tag{display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#888;background:#F0F0F0;padding:2px 8px;border-radius:10px}
.emt-q-opt-active .emt-q-opt-tag{background:#CFAA3E;color:#1A1A2E}
.emt-q-opt-text{font-size:14px;color:#1A1A2E;line-height:1.5;font-weight:500;text-transform:capitalize}
/* Strength accents: strong = deep pole-colored left border, slight = pale left border */
.emt-q-opt-strong{border-left-width:4px;border-left-color:#2D6A4F}
.emt-q-opt-strong.emt-q-opt-active{border-left-color:#2D6A4F}
.emt-q-opt-slight{border-left-width:4px;border-left-color:#C8E6D5}
.emt-q-opt-slight.emt-q-opt-active{border-left-color:#CFAA3E}
.emt-q-nav{display:flex;justify-content:space-between;gap:12px;margin-top:6px}
.emt-q-back,.emt-q-next,.emt-q-finish{font-family:inherit;border-radius:8px;padding:12px 22px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,border-color .2s,opacity .15s;-webkit-tap-highlight-color:transparent}
.emt-q-back{background:transparent;color:#5A5A6E;border:1px solid #E8E2D5}
@media (hover:hover){.emt-q-back:not(:disabled):hover{border-color:#CFAA3E;color:#1A1A2E}}
.emt-q-next{background:#2D6A4F;color:#fff;border:none}
@media (hover:hover){.emt-q-next:not(:disabled):hover{background:#1B4332}}
.emt-q-finish{background:#CFAA3E;color:#1A1A2E;border:none}
@media (hover:hover){.emt-q-finish:not(:disabled):hover{background:#B89530}}
.emt-q-back:disabled,.emt-q-next:disabled,.emt-q-finish:disabled{opacity:.4;cursor:not-allowed}

/* Test result summary bar (above hero, test-mode only) */
.emt-test-result{background:#F0F7F4;border:1px solid #C8E6D5;border-radius:12px;padding:14px 18px;margin-bottom:18px}
.emt-test-result-h{font-size:13px;font-weight:800;color:#2D6A4E;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.emt-test-result-dims{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.emt-test-dim{display:flex;flex-direction:column;gap:4px}
.emt-test-dim-pair{font-size:13px;font-weight:700;color:#5A5A6E;display:flex;justify-content:space-between}
.emt-test-dim-pair .win{color:#2D6A4F}
.emt-test-dim-bar{height:8px;background:#fff;border:1px solid #E8E2D5;border-radius:6px;overflow:hidden;display:flex}
.emt-test-dim-bar-a{background:#2D6A4F;height:100%}
.emt-test-dim-bar-b{background:#CFAA3E;height:100%}

/* Strength badge (Likert strength summary) */
.emt-strength-badge{display:inline-block;font-size:12px;font-weight:800;padding:3px 10px;border-radius:12px;letter-spacing:.04em;text-transform:uppercase;margin-left:4px}
.emt-strength-strong{background:#2D6A4F;color:#fff}
.emt-strength-moderate{background:#CFAA3E;color:#1A1A2E}
.emt-strength-mild{background:#E8E2D5;color:#5A5A6E}

/* Gap chart (4-axis decisiveness, Likert dividend) */
.emt-gap-chart{margin-top:14px;padding-top:14px;border-top:1px dashed #C8E6D5}
.emt-gap-chart-h{font-size:12px;font-weight:800;color:#5A5A6E;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.emt-gap-avg{font-size:11px;font-weight:600;color:#888;text-transform:none;letter-spacing:.02em;margin-left:4px}
.emt-gap-row{display:grid;grid-template-columns:46px 1fr 28px;gap:10px;align-items:center;margin-bottom:6px}
.emt-gap-dim{font-size:12px;font-weight:700;color:#5A5A6E}
.emt-gap-track{height:8px;background:#F0F0F0;border-radius:6px;overflow:hidden}
.emt-gap-fill{display:block;height:100%;border-radius:6px}
.emt-gap-fill-strong{background:#2D6A4F}
.emt-gap-fill-moderate{background:#CFAA3E}
.emt-gap-fill-mild{background:#C8E6D5}
.emt-gap-num{font-size:12px;font-weight:800;color:#1A1A2E;text-align:right}

/* Input card */
.emt-input-card{background:#fff;border:1px solid #E8E2D5;border-radius:18px;padding:32px 36px;margin-bottom:24px;scroll-margin-top:90px}
.emt-input-h2{font-size:28px;font-weight:800;color:#1A1A2E;margin:0 0 6px;letter-spacing:-.01em}
.emt-input-sub{font-size:15px;color:#5A5A6E;margin:0 0 22px}
.emt-steps{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.emt-step{background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px;padding:18px 20px;transition:border-color .2s,box-shadow .2s}
.emt-step-active{border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.12)}
.emt-step-done{border-color:#CFAA3E;background:#FCFAF3}
.emt-step-num{font-size:11px;font-weight:800;color:#CFAA3E;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.emt-step-label{font-size:19px;font-weight:800;color:#1A1A2E;margin-bottom:2px}
.emt-step-sub{font-size:13px;color:#5A5A6E;margin-bottom:12px;font-style:italic}
.emt-step-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.emt-opt{display:flex;flex-direction:column;align-items:flex-start;text-align:left;background:#fff;border:2px solid #E8E2D5;border-radius:10px;padding:12px 14px;cursor:pointer;transition:border-color .15s,box-shadow .15s;font-family:inherit;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-opt:hover{border-color:#2D6A4F;box-shadow:0 2px 8px rgba(26,26,46,.08)}}
.emt-opt-active{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 3px rgba(45,106,79,.15)}
.emt-opt-letter{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#2D6A4F;color:#fff;border-radius:50%;font-size:15px;font-weight:800;margin-bottom:8px}
.emt-opt-active .emt-opt-letter{background:#CFAA3E}
.emt-opt-t{font-size:14px;font-weight:700;color:#1A1A2E;margin-bottom:2px;text-transform:none}
.emt-opt-d{font-size:12px;color:#5A5A6E;line-height:1.4;text-transform:capitalize}

/* Birthday optional */
.emt-birthday{margin-top:18px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px;padding:14px 20px}
.emt-birthday summary{cursor:pointer;font-size:15px;font-weight:700;color:#2D6A4F;padding:4px 0}
.emt-bday-body{padding-top:14px}
.emt-bday-note{font-size:13px;color:#5A5A6E;margin:0 0 12px;line-height:1.55}
.emt-bday-fields{display:flex;gap:12px;flex-wrap:wrap}
.emt-bday-fields label{display:flex;flex-direction:column;font-size:12px;font-weight:700;color:#5A5A6E;text-transform:uppercase;letter-spacing:.04em}
.emt-bday-fields input{margin-top:4px;width:96px;padding:8px 10px;border:1px solid #E8E2D5;border-radius:8px;font-size:15px;color:#1A1A2E;font-family:inherit}

/* Hero */
.emt-hero-card{background:linear-gradient(135deg,#FBF8F1 0%,#fff 100%);border:1px solid #E8E2D5;border-radius:18px;padding:32px;margin-bottom:22px}
.emt-hero-head{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}
.emt-hero-left{min-width:0}
.emt-type-badge{display:inline-block;background:#2D6A4F;color:#fff;font-size:12px;font-weight:800;padding:5px 13px;border-radius:20px;letter-spacing:.06em;width:fit-content;margin-bottom:12px}
.emt-h1{font-size:34px;font-weight:800;color:#1A1A2E;margin:0 0 12px;line-height:1.15;letter-spacing:-.01em}
.emt-stack{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;font-size:14px}
.emt-stack-lbl{font-size:11px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-right:4px}
.emt-stack-fn{display:inline-block;background:#fff;border:1px solid #E8E2D5;padding:4px 10px;border-radius:6px;font-weight:700;color:#1A1A2E;font-size:13px}
.emt-stack-fn.dom{background:#2D6A4F;color:#fff;border-color:#2D6A4F}
.emt-stack-fn.inf{background:#FFF8F0;color:#7A5A12;border-color:#E8C77A}
.emt-stack-sep{color:#CFAA3E;font-weight:700}
.emt-hero-line{font-size:15px;color:#444;margin:0 0 18px;line-height:1.65}
.emt-hero-line strong{color:#2D6A4F}
.emt-share-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.emt-share-btn{background:#2D6A4F;color:#fff;border:none;border-radius:8px;padding:11px 18px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-share-btn:hover{background:#1B4332}}
.emt-share-hint{font-size:13px;color:#2D6A4F;font-weight:600}
.emt-reset-btn{background:transparent;color:#5A5A6E;border:1px solid #E8E2D5;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s;font-family:inherit;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-reset-btn:hover{border-color:#CFAA3E;color:#1A1A2E}}
.emt-hero-right{display:flex;flex-direction:column;align-items:center}
.emt-hero-duo{display:flex;gap:14px}
.emt-hero-duo-cap{display:flex;justify-content:space-between;width:100%;font-size:11px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-top:8px;padding:0 6px}

/* Tarot face (procedural card) */
.emt-tarot-face{width:200px;height:286px;border-radius:12px;background:linear-gradient(160deg,#2D6A4F 0%,#1B4332 100%);border:3px solid #CFAA3E;box-shadow:0 8px 24px rgba(26,26,46,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 14px;position:relative;overflow:hidden}
.emt-tarot-face.med{width:130px;height:186px;border-radius:9px;border-width:2px;padding:12px 8px;box-shadow:0 4px 12px rgba(26,26,46,.15)}
.emt-tarot-face.med.growth{background:linear-gradient(160deg,#7A5A12 0%,#5A4010 100%);border-color:#E8C77A;opacity:.92}
.emt-tarot-crystal{width:80px;height:108px;background:linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(207,170,62,.6) 50%,rgba(255,255,255,.4) 100%);clip-path:polygon(50% 0,100% 30%,100% 70%,50% 100%,0 70%,0 30%);margin-bottom:12px;filter:drop-shadow(0 0 12px rgba(255,255,255,.4))}
.emt-tarot-crystal.med{width:42px;height:56px;margin-bottom:6px}
.emt-tarot-num{color:rgba(255,255,255,.7);font-size:12px;letter-spacing:.18em;font-weight:700;margin-bottom:4px}
.emt-tarot-face.med .emt-tarot-num{font-size:9px;margin-bottom:2px;letter-spacing:.12em}
.emt-tarot-name{color:#fff;font-size:20px;font-weight:800;text-align:center;line-height:1.15;margin-bottom:4px;letter-spacing:.01em}
.emt-tarot-face.med .emt-tarot-name{font-size:13px;margin-bottom:2px}
.emt-tarot-arch{color:#CFAA3E;font-size:12px;font-style:italic;text-align:center;margin-bottom:6px}
.emt-tarot-face.med .emt-tarot-arch{font-size:9px;margin-bottom:3px}
.emt-tarot-astro{color:rgba(255,255,255,.85);font-size:11px;text-align:center;letter-spacing:.04em}
.emt-tarot-face.med .emt-tarot-astro{font-size:8px;letter-spacing:.02em}

/* Modules */
.emt-module{background:#fff;border:1px solid #E8E2D5;border-radius:14px;padding:28px 30px;margin-bottom:22px}
.emt-mod-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.emt-mod-num{background:#2D6A4F;color:#fff;font-size:13px;font-weight:800;padding:4px 10px;border-radius:6px;letter-spacing:.05em}
.edt-mod-num-gold{background:#CFAA3E}
.emt-mod-head h2{font-size:24px;font-weight:800;color:#1A1A2E;margin:0;letter-spacing:-.005em}
.emt-lede{font-size:17px;color:#1A1A2E;margin:0 0 14px;line-height:1.55;font-weight:500}
.edt-lede-soft{color:#5A5A6E;font-weight:400;font-size:15px;font-style:italic}
.emt-body{font-size:15px;color:#444;margin:0 0 14px;line-height:1.7}

/* M1 + M2 layout */
.emt-m1-grid,.emt-m2-grid{display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:flex-start}
.emt-m1-left,.emt-m2-left{display:flex;justify-content:center}
.emt-card-arch{font-size:13px;color:#CFAA3E;font-weight:700;letter-spacing:.04em;margin-bottom:6px;text-transform:uppercase}
.emt-card-theme{font-size:15px;color:#2D6A4F;font-style:italic;margin-bottom:14px;font-weight:600;line-height:1.5}

.emt-reason{background:#F0F7F1;border-left:3px solid #2D6A4F;padding:14px 16px;margin:0 0 14px;border-radius:0 8px 8px 0}
.emt-reason-growth{background:#FFF8F0;border-left-color:#CFAA3E}
.emt-reason-lbl{display:block;font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.emt-reason-growth .emt-reason-lbl{color:#7A5A12}
.emt-reason p{margin:0;font-size:14px;color:#444;line-height:1.65}

.emt-lens{background:#FAFAFA;border-left:3px solid #CFAA3E;padding:14px 16px;margin:0 0 6px;border-radius:0 8px 8px 0}
.emt-lens-lbl{display:block;font-size:12px;font-weight:700;color:#CFAA3E;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.emt-lens p{margin:0;font-size:14px;color:#444;line-height:1.65}

.emt-practice{background:#F0F5F1;border-left:3px solid #2D6A4F;padding:14px 16px;margin:0 0 6px;border-radius:0 8px 8px 0}
.emt-prac-lbl{display:block;font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.emt-practice p{margin:0;font-size:15px;color:#1A1A2E;line-height:1.6;font-style:italic}

/* Fusion (birthday merge) */
.emt-fusion{background:linear-gradient(135deg,#FBF8F1 0%,#fff 100%);border:1px solid #CFAA3E;border-radius:12px;padding:16px 20px;margin-top:18px}
.emt-fusion-h{font-size:16px;font-weight:800;color:#7A5A12;margin-bottom:6px}
.emt-fusion-body{font-size:14px;color:#444;margin:0;line-height:1.65}

/* M3 Crystals */
.emt-m3{background:linear-gradient(135deg,#FBF8F1 0%,#fff 70%);border-color:#CFAA3E}
.emt-stones{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px}
.emt-stone-card{display:flex;flex-direction:column;gap:10px;background:#fff;border:1px solid #E8E2D5;border-radius:12px;padding:16px}
.emt-stone-img{width:80px;height:80px;object-fit:cover;border-radius:50%;align-self:center;background:#F0F0F5;border:2px solid #CFAA3E}
.emt-stone-img-ph{background:linear-gradient(135deg,#CFAA3E 0%,#E8E2D5 100%)}
.emt-stone-body{flex:1;text-align:center}
.emt-stone-tag{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#CFAA3E}
.emt-stone-name{font-size:18px;font-weight:800;color:#1A1A2E;margin:2px 0 6px}
.emt-stone-reason{font-size:13px;color:#5A5A6E;line-height:1.55;margin:0 0 10px;text-align:left}
.emt-stone-cta{display:flex;flex-direction:column;gap:4px;align-items:center}
.emt-stone-shop{display:inline-block;font-size:13px;font-weight:700;color:#2D6A4F !important;text-decoration:none;border-bottom:2px solid #CFAA3E;padding-bottom:1px;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-stone-shop:hover{color:#1B4332 !important}}
.emt-stone-meaning{font-size:12px;color:#5A5A6E !important;text-decoration:none;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-stone-meaning:hover{color:#2D6A4F !important}}
.emt-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.emt-cta{display:inline-block;padding:11px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;transition:background .2s}
.emt-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-cta-sec:hover{background:#F0F5F1}}
.emt-cta-link{background:transparent;color:#CFAA3E !important;padding:11px 6px;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-cta-link:hover{color:#1A1A2E !important}}

/* M4 Eastern */
.emt-eastern-card{background:#F4F0E6;border:1px solid #E8E2D5;border-radius:12px;padding:18px 22px}
.emt-eastern-text{font-size:15px;color:#444;line-height:1.7;margin-bottom:14px}
.emt-eastern-card-anchor{background:#FAFAFA;border-left:3px solid #2D6A4F;padding:12px 16px;margin-bottom:10px;border-radius:0 8px 8px 0}
.emt-anchor-lbl{display:block;font-size:12px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.emt-eastern-card-anchor p{margin:0;font-size:14px;color:#444;line-height:1.65}
.emt-note{font-size:13px;color:#888;font-style:italic;margin:8px 0 0;line-height:1.55}

/* M5 Related */
.emt-rel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:6px}
.emt-rel-card{display:flex;flex-direction:column;gap:4px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:10px;padding:14px 16px;text-decoration:none;color:#1A1A2E;transition:border-color .2s,box-shadow .2s,transform .15s;cursor:pointer;-webkit-tap-highlight-color:transparent}
@media (hover:hover){.emt-rel-card:hover{border-color:#CFAA3E;box-shadow:0 4px 12px rgba(26,26,46,.08);transform:translateY(-2px)}}
.emt-rel-type{font-size:14px;font-weight:800;color:#1A1A2E}
.emt-rel-card-name{font-size:13px;color:#2D6A4F;font-weight:600;font-style:italic}

/* MBTI notice */
.emt-notice-card{margin-top:18px;padding:16px 20px;background:#F0F5F1;border:1px solid #C8E6D5;border-radius:10px}
.emt-notice-card p{margin:0;font-size:12px;color:#5A5A6E;line-height:1.65}

/* Gentle Note */
.emt-gentle{margin-top:24px;padding:20px 24px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:12px}
.emt-gentle p{margin:0;font-size:13px;color:#5A5A6E;line-height:1.7}
.emt-gentle strong{color:#2D6A4F}

/* SEO Accordion (mirror daily-tarot .edt-seo visual language with emt- prefix) */
.emt-seo-accordion{margin:32px 0 8px}
.emt-seo-details{border:1px solid #E8E2D5;border-radius:12px;background:#FAFAFA;overflow:hidden}
.emt-seo-details summary{list-style:none;cursor:pointer;background:#F4F0E6;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;display:flex;justify-content:space-between;align-items:center}
.emt-seo-details summary::-webkit-details-marker{display:none}
.emt-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F;font-weight:300}
.emt-seo-details[open] summary:after{content:'–'}
.emt-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.emt-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px;letter-spacing:-.005em}
.emt-seo-content h2:first-child{margin-top:0}
.emt-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
.emt-seo-content p{margin:0 0 12px}
.emt-seo-content ul{margin:0 0 12px;padding-left:22px}
.emt-seo-content li{margin-bottom:6px}
.emt-seo-content strong{color:#2D6A4F}

/* Responsive: tablet/mobile */
@media(max-width:900px){
  .emt-page-hero{grid-template-columns:1fr;gap:24px;padding:28px 26px;text-align:center}
  .emt-page-hero-sub{margin-left:auto;margin-right:auto}
  .emt-page-hero-trust{justify-content:center}
  .emt-page-hero-title{font-size:28px}
  .emt-page-hero-right{order:-1}
  .emt-page-hero-deck{justify-content:center}
  .emt-input-card{padding:24px 22px}
  .emt-steps{grid-template-columns:1fr;gap:14px}
  .emt-mode-switch{grid-template-columns:1fr 1fr;gap:10px}
  .emt-test-card{padding:24px 22px}
  /* 2x2 grid stays 2 columns on mobile (per user spec: A/B top, C/D bottom); only tighten gaps + compact cells */
  .emt-q-opts-grid{gap:10px 10px}
  .emt-q-col-head{font-size:11px;padding:0 2px 4px}
  .emt-q-col-head .emt-q-col-tag{font-size:9px}
  .emt-q-opt{padding:12px 12px;gap:5px}
  .emt-q-opt-mark{width:24px;height:24px;font-size:12px}
  .emt-q-opt-tag{font-size:9px;padding:2px 6px}
  .emt-q-opt-text{font-size:13px;line-height:1.45}
  .emt-test-result-dims{grid-template-columns:repeat(2,1fr);gap:10px}
  .emt-q-prompt{font-size:19px}
  .emt-hero-card{padding:24px}
  .emt-hero-head{grid-template-columns:1fr;gap:20px;text-align:center}
  .emt-hero-right{order:-1}
  .emt-hero-duo{justify-content:center}
  .emt-stack{justify-content:center}
  .emt-share-row{justify-content:center}
  .emt-h1{font-size:28px}
  .emt-m1-grid,.emt-m2-grid{grid-template-columns:1fr;gap:18px}
  .emt-m1-left,.emt-m2-left{order:-1}
  .emt-tarot-face{margin:0 auto}
  .emt-stones{grid-template-columns:1fr 1fr}
  .emt-rel-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .emt-inner{padding:16px 14px 32px;border-radius:12px}
  .emt-page-hero{padding:22px 18px;gap:18px;border-radius:16px}
  .emt-page-hero-title{font-size:24px}
  .emt-page-hero-sub{font-size:15px}
  .emt-page-hero-deck .emt-tarot-face.med{width:96px;height:138px}
  .emt-input-card{padding:20px 16px}
  .emt-input-h2{font-size:22px}
  .emt-test-card{padding:20px 16px}
  .emt-q-prompt{font-size:18px;line-height:1.4}
  .emt-q-opt{padding:11px 11px;gap:5px}
  .emt-q-opt-mark{width:23px;height:23px;font-size:11px}
  .emt-q-opt-text{font-size:12.5px;line-height:1.42}
  .emt-q-opt-tag{font-size:9px;padding:1px 6px}
  .emt-q-col-head{font-size:10px;padding:0 2px 3px}
  .emt-q-col-head .emt-q-col-tag{font-size:8px}
  .emt-q-opts-grid{gap:8px 8px}
  .emt-q-back,.emt-q-next,.emt-q-finish{padding:11px 16px;font-size:13px;flex:1}
  .emt-test-result-dims{grid-template-columns:1fr 1fr;gap:8px}
  /* Quick Pick: keep 2 columns on mobile (per user spec — 2 options side-by-side) */
  .emt-hero-card{padding:20px 16px}
  .emt-tarot-face{width:170px;height:244px;padding:16px 10px}
  .emt-tarot-name{font-size:17px}
  .emt-tarot-face.med{width:108px;height:154px}
  .emt-h1{font-size:22px;line-height:1.2}
  .emt-module{padding:20px 18px}
  .emt-mod-head h2{font-size:20px}
  .emt-stones{grid-template-columns:1fr}
  .emt-rel-grid{grid-template-columns:1fr}
  .emt-cta-row{flex-direction:column}
  .emt-cta{width:100%;text-align:center;padding:13px 20px;font-size:15px}
  .emt-gentle{padding:16px 18px}
  .emt-gentle p{font-size:13px}
  .emt-seo-content{padding:18px 16px;font-size:15px}
  .emt-seo-content h2{font-size:21px}
  .emt-seo-details summary{font-size:16px;padding:15px 16px}
}
@media(max-width:380px){
  .emt-inner{padding:14px 10px 28px;border-radius:10px}
  .emt-page-hero{padding:18px 14px;border-radius:14px}
  .emt-page-hero-title{font-size:21px}
  .emt-page-hero-deck .emt-tarot-face.med{width:84px;height:120px}
  .emt-input-card{padding:18px 14px}
  .emt-hero-card{padding:16px 12px}
  .emt-tarot-face{width:150px;height:214px;padding:14px 8px}
  .emt-tarot-name{font-size:16px}
  .emt-h1{font-size:20px}
  .emt-module{padding:18px 14px;margin-bottom:18px}
  .emt-mod-head h2{font-size:19px}
  .emt-share-btn,.emt-reset-btn{flex:1;padding:11px 14px;font-size:13px}
  /* 2x2 grid stays; tighten further for 320-380px screens */
  .emt-q-opt{padding:10px 9px;gap:4px}
  .emt-q-opt-mark{width:22px;height:22px;font-size:11px}
  .emt-q-opt-text{font-size:12px;line-height:1.38}
  .emt-q-opt-tag{display:none}
  .emt-q-col-head{font-size:10px;padding:0 2px 2px}
  .emt-q-col-head .emt-q-col-tag{display:none}
  .emt-q-opts-grid{gap:7px 7px}
}
</style>

<!-- Data: 16 types + 22 cards + dichotomies + shop slugs (asciiJSON, CJK escaped) -->
<script type="application/json" id="emt-data">${DATA_BLOCK}</script>

<!-- App JS Base64-wrapped (wp_kses defense: CJK/&&/< entity-escaping). Loader atob → eval. -->
<script type="text/plain" id="emt-app">${APP_B64}</script>
<script>
(function(){var b=document.getElementById('emt-app').textContent;try{var s=atob(b);(0,eval)(s);}catch(e){console.error('EMT init failed',e);}})();
</script>

<!-- ===== MBTI Tarot Schema (FAQPage, self-reflection framing + MBTI trademark) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is an MBTI tarot birth card?","acceptedAnswer":{"@type":"Answer","text":"An MBTI tarot birth card is a Major Arcana tarot card matched to your MBTI personality type through Jungian cognitive functions (Ni, Ne, Si, Se, Ti, Te, Fi, Fe). Each of the sixteen MBTI types maps to a primary card that mirrors how your dominant function naturally processes the world, plus a growth card that points to where your pattern asks to be stretched. It is a mirror for self-reflection, not a diagnosis or a forecast."}},
{"@type":"Question","name":"How is my MBTI type matched to a tarot card?","acceptedAnswer":{"@type":"Answer","text":"Each MBTI type's dominant cognitive function is matched to the Major Arcana archetype that shares its core theme. For example, INTJ's dominant function Ni (introverted intuition) resonates with The Hermit, the seeker of inner vision. The mapping is built on Jungian cognitive function theory rather than copied from any other tool, and it is an editorial interpretation offered for self-reflection — not official MBTI doctrine."}},
{"@type":"Question","name":"Can I have two MBTI tarot cards?","acceptedAnswer":{"@type":"Answer","text":"Yes. Each MBTI type maps to two cards: a primary birth card (aligned to the dominant function) and a growth card (aligned to the auxiliary or inferior function). The primary card mirrors your natural gift; the growth card points to a development edge. Together they offer a more complete picture than a single card could."}},
{"@type":"Question","name":"What is the difference between an MBTI tarot card and a birthday tarot birth card?","acceptedAnswer":{"@type":"Answer","text":"A birthday tarot birth card is calculated by reducing your date of birth through numerology (month + day + year). An MBTI tarot card is matched to your self-reported personality type through cognitive functions. The two methods work with different inputs and answer different questions; they can sit side by side as two mirrors on the same person. This tool lets you see both if you add your birthday."}},
{"@type":"Question","name":"Which crystals go with my MBTI tarot card?","acceptedAnswer":{"@type":"Answer","text":"Each MBTI type is paired with three crystals chosen for how they resonate with the type's primary and growth cards: a primary stone, a supporting stone, and a growth stone. The pairings are traditional and symbolic, drawn from the tarot card's established crystal associations and the type's cognitive function profile. They are offered as mindful companions, not as medical treatments."}},
{"@type":"Question","name":"Is the MBTI tarot mapping scientific?","acceptedAnswer":{"@type":"Answer","text":"The mapping is an editorial interpretation built on Jungian cognitive function theory, which is itself a framework for self-reflection rather than a clinically validated measurement. Tarot, similarly, is a tool for contemplation rather than prediction. Nothing on this page is a personality diagnosis, a medical claim, or a forecast of fixed outcomes — treat it as a mirror, not a verdict."}},
{"@type":"Question","name":"Can my MBTI tarot card change?","acceptedAnswer":{"@type":"Answer","text":"Your MBTI tarot card stays the same as long as your self-reported MBTI type stays the same. The card is matched to your type, not to your mood or the day. If you later decide a different MBTI type fits you better, you can return to this tool and see the cards matched to that type instead."}},
{"@type":"Question","name":"What if I don't know my MBTI type?","acceptedAnswer":{"@type":"Answer","text":"The tool walks you through the four dichotomies (Extraversion vs Introversion, Intuition vs Sensing, Thinking vs Feeling, Judging vs Perceiving) with a short description on each option, so you can self-select the type that fits you best without needing a separate test. There is no right answer — pick the option that feels most like you in everyday life."}},
{"@type":"Question","name":"Is this MBTI tarot tool free?","acceptedAnswer":{"@type":"Answer","text":"Yes. The MBTI Tarot tool is completely free, with no sign-up required. You can pick your type, read your primary and growth cards, see the three crystals, and add your birthday for a numerological tarot birth card — all at no cost. The optional Shop links let you browse the suggested crystals as jewelry if you wish."}}
]}
]}
</script>
${SEO_CONTENT.trim() ? `
<!-- ===== MBTI Tarot SEO Accordion (long-tail depth, self-reflection framing) ===== -->
<section class="emt-seo-accordion" aria-label="MBTI tarot guide">
  <details class="emt-seo-details">
    <summary>Learn More About MBTI Tarot Cards</summary>
    <div class="emt-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End MBTI Tarot SEO Accordion ===== -->` : ''}
<!-- ===== End MBTI Tarot v1.0 ===== -->`;

// ===== 写出 + 替换占位 + 统计 =====
const OUT = path.resolve(__dirname, 'mbti-tarot.html');
fs.writeFileSync(OUT, html, 'utf8');

const KB = (fs.statSync(OUT).size / 1024).toFixed(1);
const typesLen = Object.keys(TYPES).length;
const cardsLen = CARDS.length;
const dataLen = DATA_BLOCK.length;
const appLen = APP_B64.length;

// 合规门：grep 黑名单（PRD §8 关卡 0）
// 白名单（前置 not/no/not a 排除 self-reflection 否定声明）
const BLACK = { health: /\b(cure|heals|treats|therapy|prescription|diagnos)\b/gi, finance: /\b(invest now|guaranteed return|get rich|wealth guaranteed)\b/gi, deterministic: /\b(you will|guaranteed|destined|will happen|fortune telling)\b/gi };
const ALLOW_BEFORE = /\b(not\s+(a|a\s+medical|the)\s+|no\s+(medical\s+)?|never\s+(a\s+)?|predict\s+what\s+|not\s+a\s+forecast|not\s+a\s+verdict)$/i;
function isAllowed(src, idx){
  const before = src.substring(Math.max(0, idx-50), idx);
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

console.log('MBTI Tarot v1.0 generated:', OUT);
console.log('  size:', KB, 'KB | types:', typesLen, '| cards:', cardsLen);
console.log('  DATA_BLOCK:', dataLen, 'chars | APP_B64:', appLen, 'chars');
console.log('  keep-exploring: via snippet 19 wp_footer (not baked, no duplicate)');
console.log('  seo accordion:', SEO_CONTENT.trim() ? 'injected ('+SEO_CONTENT.length+' chars)' : 'MISSING seo-content.html');
console.log('  compliance violations:', violations.length === 0 ? 'NONE (PASS)' : violations.join('; '));
