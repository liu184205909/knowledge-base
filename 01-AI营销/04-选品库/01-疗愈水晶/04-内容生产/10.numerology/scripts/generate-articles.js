/**
 * Numerology (Life Path) 骨架生成器（12 篇：1-9 + Master 11/22/33）
 * 读 numerology-knowledge.json + numerology-config.json(module_weights/eastern)
 * → 11 模块骨架（M2计算单源 / M6水晶5角色+CTA降级 / M7仪式 / M8强制表格 / Master加重 / Eastern占位）
 * 框架 v2 对齐：Intro + QuickAnswer + HowToCalculate + Personality + Love + Career + BestCrystals + Ritual + Strengths&Challenges + FAQ + Related
 * 用法：node generate-articles.js --slug=1 | (全12篇)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/numerology-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const CFG = require('../configs/numerology-config.json');

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const list = slugArg ? KNOW.numbers.filter(n => n.slug === slugArg) : KNOW.numbers;

// CTA 降级映射（_cta-validation.json）
const CTA = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', '_cta-validation.json'), 'utf8'));

// 显示名（lapis -> Lapis Lazuli 等）
const DISPLAY_OVERRIDES = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', apatite: 'Yellow Apatite' };
function stoneName(slug) {
  if (DISPLAY_OVERRIDES[slug]) return DISPLAY_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// 计算段（全站单源，每篇一致）
function buildCalculationSection(num, isMaster) {
  const calc = KNOW.calculation;
  let s = `<h2>${calc.title}</h2>\n`;
  s += `<p>{{AI_CALC_INTRO}}</p>\n`;
  s += `<ol>\n`;
  for (const st of calc.steps) {
    s += `<li><strong>Step ${st.step}:</strong> ${st.action}<br><em>Example:</em> ${st.example}</li>\n`;
  }
  s += `</ol>\n`;
  s += `<p><strong>Master Number rule:</strong> ${calc.master_number_rule}</p>\n`;
  s += `<p><strong>Worked example:</strong> ${calc.quick_example}</p>\n`;
  // Master 加重段（仅 11/22/33）
  if (isMaster) {
    const nd = KNOW.numbers.find(n => n.number === num);
    s += `<h3>Why ${num} Is Not Reduced</h3>\n`;
    s += `<p>In numerology, 11, 22, and 33 are Master Numbers. They are kept in double-digit form because they carry intensified energy with higher potential — and higher demand. Operating at master level is a choice, not a guarantee; many people with Master Numbers also experience the grounded energy of their root number (2, 4, or 6) as their everyday baseline.</p>\n`;
    s += `<p>${nd.master_note}</p>\n`;
  }
  // 计算器 CTA（降级：工具未上线，指本文档计算段，文案非死链）
  s += `<p>Want to skip the math? <strong>{{AI_CALC_CTA}}</strong></p>\n`;
  return s;
}

let made = 0; const index = [];
for (const nd of list) {
  const num = nd.number;
  const isMaster = nd.is_master;
  const mw = CFG.module_weights[String(num)];
  const archShort = nd.archetype.split('/')[0].trim(); // "The Leader"

  // 水晶 5 角色 + CTA 降级
  const crystals = {};
  for (const [role, info] of Object.entries(nd.crystals)) {
    const slug = info.slug;
    const cta = CTA[String(num)][role];
    crystals[role] = {
      slug, name: stoneName(slug),
      reason: info.reason,
      meaning_cta: cta.meaning_cta, // INCLUDE / OMIT
      meaning_url: cta.meaning_url,
      shop_url: cta.shop_url, // /shop/?s={slug}
    };
  }

  // CTA 文案轮换池（3套）
  const readVariants = [`Read {N} Meaning`, `Explore {N} in depth`, `{N} properties & symbolism`];
  const shopVariants = [`Shop {N}`, `Browse {N} jewelry`, `Find your {N} piece`];

  // ---- 模块 ----
  const intro = `{{AI_INTRODUCTION}}`;

  // M1 Quick Answer
  const m1 = `<h2>Life Path ${num} at a Glance</h2>\n<p>{{AI_QUICK_ANSWER}}</p>\n<ul>\n<li><strong>Archetype:</strong> ${nd.archetype}</li>\n<li><strong>Core theme:</strong> ${nd.theme} — ${nd.unique_angle}</li>\n<li><strong>Recommended crystal:</strong> ${crystals.best_overall.name}</li>\n</ul>`;

  // M2 How to Calculate（单源）
  const m2 = buildCalculationSection(num, isMaster);

  // M3 Personality & Traits（按 module_weights M3 重心）
  const m3 = `<h2>Life Path ${num} Personality &amp; Traits</h2>\n<p>{{AI_PERSONALITY}}</p>\n<p><strong>Everyday signs you may recognize:</strong></p>\n<ul>\n<li>{{AI_TRAIT_SCENE_1}}</li>\n<li>{{AI_TRAIT_SCENE_2}}</li>\n</ul>\n<p><em>DiffHint (M3 重心):</em> ${mw.M3}。写 2 个该号码独有日常场景，非泛 trait 词。</p>`;

  // M4 Love & Compatibility
  const loveWeight = isMaster && num === 11 ? 'heavy' : 'normal';
  const m4 = `<h2>Life Path ${num} in Love &amp; Compatibility</h2>\n<p>{{AI_LOVE${loveWeight === 'heavy' ? '_HEAVY' : ''}}}</p>\n<p><strong>Compatibility notes:</strong> Life Path ${num} pairs naturally with ${nd.related_numbers.join(', ')} (see Related section).</p>`;

  // M5 Career & Purpose（purpose_keyword 展开）
  const careerWeight = isMaster && (num === 22 || num === 33) ? 'heavy' : 'normal';
  const m5 = `<h2>Life Path ${num} Career &amp; Life Purpose</h2>\n<p>{{AI_CAREER${careerWeight === 'heavy' ? '_HEAVY' : ''}}}</p>\n<p><em>DiffHint:</em> 用 purpose_keyword = <strong>${mw.purpose_keyword}</strong> 展开，非"find your purpose"套话。</p>`;

  // M6 Best Crystals（5角色 + CTA降级 + 文案轮换 + 过渡占位）
  let m6 = `<h2>Best Crystals for Life Path ${num}</h2>\n<p>{{AI_CRYSTAL_TRANSITION}}</p>\n`;
  const roleLabels = {
    best_overall: `Best Overall Crystal for Life Path ${num}`,
    best_love: 'Best Crystal for Love &amp; Relationships',
    best_protection: 'Best Crystal for Grounding &amp; Protection',
    best_manifestation: 'Best Crystal for Manifestation &amp; Focus',
    best_daily_wear: 'Best Crystal to Wear Daily',
  };
  let vi = 0;
  for (const [role, c] of Object.entries(crystals)) {
    const readTpl = readVariants[vi % 3].replace('{N}', c.name);
    const shopTpl = shopVariants[vi % 3].replace('{N}', c.name);
    m6 += `<h3>${roleLabels[role]}</h3>\n<p>{{AI_CRYSTAL_${role.toUpperCase()}}}</p>\n`;
    let ctaLine = `<p><em>${c.name}</em> — ${c.reason}. `;
    const links = [];
    if (c.meaning_cta === 'INCLUDE') links.push(`<a href="${c.meaning_url}">${readTpl} →</a>`);
    links.push(`<a href="${c.shop_url}">${shopTpl} →</a>`);
    ctaLine += links.join(' · ') + `</p>\n`;
    m6 += ctaLine;
    vi++;
  }

  // M7 Ritual / Daily Practice（仪式型，H2轮换）
  const ritualH2 = isMaster
    ? `Working with Crystals at the Master Level: A Practice for Life Path ${num}`
    : (parseInt(num) % 2 === 0 ? `Daily Crystal Practice for Life Path ${num}` : `A Simple Crystal Ritual for Life Path ${num}`);
  const m7 = `<h2>${ritualH2}</h2>\n<p>{{AI_RITUAL_INTRO}}</p>\n<p><strong>You'll need:</strong> ${crystals.best_overall.name}${crystals.best_protection.slug !== crystals.best_overall.slug ? ` or ${crystals.best_protection.name}` : ''}.</p>\n<p><strong>Step 1 — Set the focus (1 min):</strong> {{AI_RITUAL_STEP1}}</p>\n<p><strong>Step 2 — Hold the stone (2 min):</strong> {{AI_RITUAL_STEP2}}</p>\n<p><strong>Step 3 — Close with one commitment:</strong> {{AI_RITUAL_STEP3}}</p>\n<p><em>DiffHint:</em> 仪式动作锚定 ${mw.purpose_keyword}（如 ${nd.recommended_action}），禁 12 篇都是 hold &amp; breathe。</p>`;

  // M8 Strengths & Challenges（强制表格）
  const m8 = `<h2>The Gifts and Growth Edges of Life Path ${num}</h2>\n<p>{{AI_STRENGTHS_INTRO}}</p>\n<table>\n<thead>\n<tr><th>Gift (healthy expression)</th><th>Overplayed Edge (when imbalanced)</th><th>How to Rebalance</th></tr>\n</thead>\n<tbody>\n<tr><td>{{AI_GIFT_1}}</td><td>{{AI_EDGE_1}}</td><td>{{AI_REBAL_1}}</td></tr>\n<tr><td>{{AI_GIFT_2}}</td><td>{{AI_EDGE_2}}</td><td>{{AI_REBAL_2}}</td></tr>\n<tr><td>{{AI_GIFT_3}}</td><td>{{AI_EDGE_3}}</td><td>{{AI_REBAL_3}}</td></tr>\n</tbody>\n</table>\n<p><em>DiffHint (M8 张力):</em> ${mw.M8_tension}。Rebalance 落可执行动作（非"be balanced"），可与 M7 呼应不复述。</p>`;

  // M9 FAQ（三层分层 + Eastern 占位放这里或 M3）
  const faqExtra = isMaster ? `\n<details><summary>Is ${num} a Master Number?</summary>{{AI_FAQ_MASTER}}</details>` : '';
  const m9 = `<h2>Frequently Asked Questions</h2>\n<details><summary>What does Life Path ${num} mean?</summary>{{AI_FAQ_MEANING}}</details>\n<details><summary>What is the personality of a Life Path ${num}?</summary>{{AI_FAQ_PERSONALITY}}</details>\n<details><summary>What are the best crystals for Life Path ${num}?</summary>{{AI_FAQ_CRYSTALS}}</details>\n<details><summary>Who is Life Path ${num} most compatible with?</summary>{{AI_FAQ_COMPAT}}</details>\n<details><summary>What careers suit Life Path ${num}?</summary>{{AI_FAQ_CAREER}}</details>\n<details><summary>What is the lucky stone for number ${num}?</summary>{{AI_FAQ_LUCKYSTONE}}</details>\n<details><summary>Is numerology scientifically proven?</summary>{{AI_FAQ_SCIENCE}}</details>\n<details><summary>Can my Life Path Number change?</summary>{{AI_FAQ_CHANGE}}</details>${faqExtra}`;

  // Gentle Note（全站组件，FAQ前——这里放FAQ后Related前也可，按框架放FAQ前）
  const gentleNote = `<p class="gentle-note"><em>Numerology and crystal meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. They are a tool for self-reflection, not a substitute for medical, financial, or professional advice — and not a deterministic prediction of your life.</em></p>`;

  // M10 Related + Closing（兄弟号码互链）
  const related = nd.related_numbers.map(rn => {
    const rc = KNOW.numbers.find(n => String(n.number) === String(rn));
    return rc ? `<li><a href="/life-path-${rc.slug}/">Life Path ${rc.number}: ${rc.archetype.split('/')[0].trim()}</a> — ${rc.theme}</li>` : '';
  }).filter(Boolean).join('\n');
  const m10 = `<h2>Related Life Path Numbers</h2>\n<ul>\n${related}\n</ul>\n<p>{{AI_CLOSING}}</p>`;

  // 组装
  const content = [intro, m1, m2, m3, m4, m5, m6, m7, m8, gentleNote, m9, m10].join('\n\n');

  // TKD
  const title = isMaster
    ? `Life Path ${num}: Meaning, Personality & Best Crystals`
    : `Life Path ${num}: Meaning, Personality & Best Crystals`;
  const focusKw = `life path ${num}`;
  const article = {
    title, slug: nd.slug, url: `/life-path-${nd.slug}/`,
    number: num, is_master: isMaster,
    archetype: nd.archetype, theme: nd.theme, unique_angle: nd.unique_angle,
    primary_intent: nd.primary_intent, secondary_intent: nd.secondary_intent,
    core_traits: nd.core_traits, strengths: nd.strengths, challenges: nd.challenges,
    emotional_state: nd.emotional_state, recommended_action: nd.recommended_action,
    purpose_keyword: mw.purpose_keyword,
    element: nd.element, color: nd.color, ruling_planet_note: nd.ruling_planet_note,
    avoid_claims: nd.avoid_claims, master_note: nd.master_note || null,
    crystals, related_numbers: nd.related_numbers, related_reason: nd.related_reason,
    module_weights: mw,
    eastern_hints: {
      tibetan: CFG.eastern_anchors.tibetan[String(num)] || null,
      indian_navratna: CFG.eastern_anchors.indian_navratna[String(num)] || null,
    },
    rank_math_title: title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: focusKw,
    excerpt: '{{AI_EXCERPT}}',
    diffHints: {
      unique_angle: nd.unique_angle, emotional_state: nd.emotional_state,
      recommended_action: nd.recommended_action, avoid_claims: nd.avoid_claims,
      module_weights: mw, M8_tension: mw.M8_tension,
      eastern: { tibetan: CFG.eastern_anchors.tibetan[String(num)] || null, navratna: CFG.eastern_anchors.indian_navratna[String(num)] || null },
    },
    images: {
      hero: { file: `images/numerology/hero-life-path-${nd.slug}.webp`, alt: `Life Path ${num}: ${archShort} — number ${num} with crystals`, source_type: 'number-hero' },
      calculation: { file: `images/numerology/calculation-diagram.webp`, alt: `How to calculate your Life Path Number: 4 steps + Master Number rule`, source_type: 'number-diagram' },
    },
    content,
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', nd.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: nd.slug, number: num, is_master: isMaster, title, theme: nd.theme });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Numerology 骨架生成（11模块 + M2计算单源 + M6水晶5角色CTA降级 + M7仪式 + M8强制表格 + Master加重${index.filter(a => a.is_master).length}篇）`);
