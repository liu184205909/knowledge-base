/**
 * Chinese Zodiac 12 生肖骨架生成器（框架 v2，9 模块）
 * 读 chinese-zodiac-knowledge.json（动物4维石只读）+ chinese-zodiac-config.json（Eastern锚点+合规模板）+ _cta-validation.json（CTA降级）
 * → 9 模块骨架（M1/M2强制事实表/M3四维/M4场景表/M5使用/M6避讳硬化/M7双镜头/M8 FAQ7问/M9 Shop）
 * 关键：文化数据锁死只读（本命佛/五行/兼容性/year_boost 不重写）+ M6 合规硬化必填位 + M7 双镜头非硬映射
 * 用法：node generate-articles.js --slug=dragon | (全12生肖)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/chinese-zodiac-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const CFG = require('../configs/chinese-zodiac-config.json');
const CTA = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', '_cta-validation.json'), 'utf8'));

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const animals = KNOW.animals;
const list = slugArg ? Object.values(animals).filter(a => a.name.toLowerCase() === slugArg.toLowerCase() || a.article.includes(slugArg)) : Object.values(animals).sort((a, b) => a.order - b.order);

// 显示名（slug → proper name）
const DISPLAY_OVERRIDES = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Jade', jadeite: 'Jade', aventurine: 'Green Aventurine', apatite: 'Yellow Apatite', 'black-tourmaline': 'Black Tourmaline', 'blue-sapphire': 'Blue Sapphire', 'red-jasper': 'Red Jasper', 'rose-quartz': 'Rose Quartz', 'smoky-quartz': 'Smoky Quartz', 'tiger-eye': "Tiger's Eye" };
function stoneName(slug) {
  if (DISPLAY_OVERRIDES[slug]) return DISPLAY_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// 从 ATTR 取 overview Element / Best for（M3 维度表用）
function stoneMeta(slug) {
  const a = ATTR[slug + '-meaning'];
  if (a && a.overview) {
    return { element: a.overview.Element || '', bestFor: a.overview['Best for'] || '' };
  }
  return { element: '', bestFor: '' };
}

// CTA 降级（三级：category > shop search）
function resolveCta(slug) {
  const c = CTA[slug] || CTA[slug.replace(/s$/, '')];
  if (!c) return { meaningInclude: false, meaningUrl: null, shopUrl: '/shop/' };
  return {
    meaningInclude: c.meaning_cta === 'INCLUDE',
    meaningUrl: c.meaning_url,
    shopUrl: c.shop_url,
  };
}

// 4 维水晶装配（lucky/balance/year_boost/avoid）
function buildCrystals(animal) {
  const out = {};
  const dims = [
    ['lucky', animal.lucky_stone],
    ['balance', animal.balance_stone],
    ['year_boost', animal.year_boost],
    ['avoid', animal.avoid_stone],
  ];
  for (const [dim, info] of dims) {
    const slug = info.slug;
    const name = stoneName(slug);
    const meta = stoneMeta(slug);
    const cta = resolveCta(slug);
    out[dim] = {
      slug, name,
      why: info.why, // 文化依据（数据层只读）
      element: meta.element, bestFor: meta.bestFor,
      meaning_cta: cta.meaningInclude ? 'INCLUDE' : 'OMIT',
      meaning_url: cta.meaningUrl,
      shop_url: cta.shopUrl,
      dim_type: dim,
    };
  }
  return out;
}

// CTA 文案轮换池（3套）
const readVariants = [`{N} Meaning`, `Explore {N} in depth`, `{N} properties & symbolism`];
const shopVariants = [`Shop {N}`, `Browse {N} jewelry`, `Find your {N} piece`];

// 西方星座双镜头映射（按出生年月大致区间，标注 approximate，非硬等号）
// 每生肖给 1-2 个最常被读者联想到的西方星座做条件式 CTA（非 Dragon=Leo 硬等号）
const WESTERN_LENS = {
  rat: [{ sign: 'Aquarius', slug: 'aquarius' }, { sign: 'Gemini', slug: 'gemini' }],
  ox: [{ sign: 'Taurus', slug: 'taurus' }, { sign: 'Capricorn', slug: 'capricorn' }],
  tiger: [{ sign: 'Aries', slug: 'aries' }, { sign: 'Leo', slug: 'leo' }],
  rabbit: [{ sign: 'Cancer', slug: 'cancer' }, { sign: 'Libra', slug: 'libra' }],
  dragon: [{ sign: 'Leo', slug: 'leo' }, { sign: 'Aries', slug: 'aries' }],
  snake: [{ sign: 'Scorpio', slug: 'scorpio' }, { sign: 'Virgo', slug: 'virgo' }],
  horse: [{ sign: 'Sagittarius', slug: 'sagittarius' }, { sign: 'Gemini', slug: 'gemini' }],
  goat: [{ sign: 'Pisces', slug: 'pisces' }, { sign: 'Cancer', slug: 'cancer' }],
  monkey: [{ sign: 'Gemini', slug: 'gemini' }, { sign: 'Aquarius', slug: 'aquarius' }],
  rooster: [{ sign: 'Virgo', slug: 'virgo' }, { sign: 'Capricorn', slug: 'capricorn' }],
  dog: [{ sign: 'Libra', slug: 'libra' }, { sign: 'Taurus', slug: 'taurus' }],
  pig: [{ sign: 'Taurus', slug: 'taurus' }, { sign: 'Pisces', slug: 'pisces' }],
};

// 文化变体（Rabbit→Vietnam Cat / Pig→Japan Boar，其余轻量）
const CULTURAL_VARIANT = {
  rabbit: { region: 'Vietnam', note: "Vietnam's zodiac features the Cat where the Chinese tradition features the Rabbit — so a Vietnamese-reader 'Cat' and a Chinese-tradition 'Rabbit' are looking at the same position in the 12-animal cycle, just with different cultural framing." },
  pig: { region: 'Japan', note: "Japan's zodiac uses the Boar (Inoshishi) where the Chinese tradition uses the Pig — same position, slightly different symbolism around wild vitality." },
  ox: { region: 'Vietnam', note: "In Vietnam's zodiac, the Water Buffalo occupies the Ox's position — same steady, dependable archetype in a different regional form." },
};

const CY = KNOW.current_year;
const curYear = CY.year, curAnimal = CY.animal, curElement = CY.element;

let made = 0; const index = [];
for (const animal of list) {
  const key = animal.name.toLowerCase().split(/\s|\(/)[0].trim(); // "Goat (Sheep)" → "goat"
  const crystals = buildCrystals(animal);
  const isBenMingNian = !!animal.ben_ming_nian;
  const isSnake = key === 'snake'; // 刚出本命年回响
  const westernLens = WESTERN_LENS[key] || [];
  const variant = CULTURAL_VARIANT[key];

  // 动物显示名（Goat→Goat (Sheep)）
  const dispName = animal.name;
  const articleSlug = key + '-crystals';

  // ---- 模块 ----

  // Intro
  const intro = `{{AI_INTRODUCTION}}`;

  // M1 Quick Answer
  const m1 = `<h2>Quick Answer: Best Crystals for the ${dispName}</h2>\n<p>{{AI_QUICK_ANSWER}}</p>\n<ul>\n<li><strong>Lucky stone (traditional):</strong> ${crystals.lucky.name}</li>\n<li><strong>Balance stone:</strong> ${crystals.balance.name}</li>\n<li><strong>${curYear} (${curElement} ${curAnimal}) booster:</strong> ${crystals.year_boost.name}</li>\n<li><strong>Use mindfully:</strong> ${crystals.avoid.name}</li>\n</ul>\n<p><em>Cultural guidance for symbolic reflection — not fortune-telling. Trust how a stone feels to you over any tradition.</em></p>`;

  // M2 Understanding（强制事实表 + 自然段，不讲水晶）
  const benMingCell = isBenMingNian
    ? `Yes — ${curYear} is the ${dispName}'s ben ming nian (本命年). Traditionally a year of change, not pure luck; protective stones are the priority.`
    : (isSnake ? `Not in ${curYear}. ${dispName}'s ben ming nian was 2025 — the "just-past" Tai Sui echo may linger into early ${curYear}; protective stones still help.` : `No. ${curYear} is the Horse's ben ming nian, not the ${dispName}'s.`);
  const m2 = `<h2>The ${dispName} in the Chinese Zodiac (${animal.chinese})</h2>\n<p>{{AI_M2_INTRO}}</p>\n<table>\n<thead>\n<tr><th>Field</th><th>The ${dispName}</th></tr>\n</thead>\n<tbody>\n<tr><td>Zodiac position</td><td>#${animal.order} of 12 animals</td></tr>\n<tr><td>Chinese name</td><td>${animal.chinese}</td></tr>\n<tr><td>Element (Five Elements)</td><td>${animal.element}</td></tr>\n<tr><td>Recent years</td><td>${animal.years_sample}</td></tr>\n<tr><td>Most compatible with</td><td>${animal.compatibility_best.join(', ')}</td></tr>\n<tr><td>Traditional theme</td><td>${animal.personality}</td></tr>\n<tr><td>Ben ming nian in ${curYear}?</td><td>${benMingCell}</td></tr>\n<tr><td>Affiliated Buddha/Bodhisattva (folk tradition)</td><td>${animal.affiliate_buddha}</td></tr>\n</tbody>\n</table>\n<p>{{AI_M2_CULTURE_PARA}}</p>\n<p><em>DiffHint (M2 物理区隔):</em> 只讲生肖文化本身（性格/五行/本命年状态/文化变体），<strong>不展开「所以你需要什么水晶」</strong>（水晶留给 M3）。本命佛用「in some East Asian Buddhist-inspired traditions」谨慎措辞。Eastern 锚点 ≥2（五行属性 / 本命佛 / 本命年 / 兼容性）。</p>\n<p>Not sure whether you're a ${dispName}? Chinese zodiac year begins at lunar new year (late Jan/Feb), not Jan 1 — <a href="/chinese-zodiac/find-your-sign/"><strong>find your Chinese zodiac sign</strong> →</a></p>`;

  // M3 四维水晶（核心）
  const dimLabels = {
    lucky: { h3: `Lucky Stone: ${crystals.lucky.name}`, sub: 'Traditional consensus' },
    balance: { h3: `Balance Stone: ${crystals.balance.name}`, sub: 'Softens the ' + dispName + ' edge' },
    year_boost: { h3: `${curYear} ${curElement} ${curAnimal} Stone: ${crystals.year_boost.name}`, sub: `Booster for the current year` },
    avoid: { h3: `Use Mindfully: ${crystals.avoid.name}`, sub: 'Elemental-tradition guidance' },
  };
  let m3 = `<h2>Crystals for the ${dispName}: Lucky, Balance, ${curYear} &amp; Mindful Use</h2>\n<p>{{AI_M3_INTRO}}</p>\n`;
  let vi = 0;
  for (const dim of ['lucky', 'balance', 'year_boost', 'avoid']) {
    const c = crystals[dim];
    const lbl = dimLabels[dim];
    m3 += `<h3>${lbl.h3}</h3>\n<p><em>(${lbl.sub})</em></p>\n`;
    if (dim === 'avoid') {
      // M6 合规硬化：避讳石用框架 §6.2 收尾模板
      m3 += `<p>{{AI_CRYSTAL_${dim.toUpperCase()}}}</p>\n`;
      m3 += `<p class="m6-closing"><em>${CFG.m6_compliance.closing_template.replace('{Animal}', dispName).replace('{avoid_stone}', c.name)}</em></p>\n`;
    } else {
      m3 += `<p>{{AI_CRYSTAL_${dim.toUpperCase()}}}</p>\n`;
      // Element / Best for 行
      const metaLine = [];
      if (c.element) metaLine.push(`<strong>Element:</strong> ${c.element}`);
      if (c.bestFor) metaLine.push(`<strong>Best for:</strong> ${c.bestFor}`);
      if (metaLine.length) m3 += `<p>${metaLine.join(' | ')}</p>\n`;
      // CTA 行（meaning + shop，文案轮换）
      const readTpl = readVariants[vi % 3].replace('{N}', c.name);
      const shopTpl = shopVariants[vi % 3].replace('{N}', c.name);
      const links = [];
      if (c.meaning_cta === 'INCLUDE' && c.meaning_url) links.push(`<a href="${c.meaning_url}">${readTpl} →</a>`);
      links.push(`<a href="${c.shop_url}">${shopTpl} →</a>`);
      m3 += `<p>${links.join(' · ')}</p>\n`;
      vi++;
    }
  }
  m3 += `<p><em>DiffHint (M3 偏知识):</em> 每维 120-160 词写「why it fits this ${dispName}（文化依据 + 矿物属性 + 灵性传统 why）+ how to use + also consider」，非通用句。year_boost 维读 chinese-zodiac-knowledge year_boost 字段（${curYear} ${curElement} ${curAnimal} 年）只读不编。</p>`;

  // M4 How to Choose（生活化需求场景对照表，非 M3 换表格）
  const benMingNoteRow = (isBenMingNian || isSnake) ? `\n<tr><td>⚠️ A protective anchor for ${curYear}${isBenMingNian ? ' (your ben ming nian)' : ' (just-past ben ming nian echo)'}</td><td>Black Tourmaline or Smoky Quartz</td><td>Many people wear one throughout a transitional zodiac year as a symbolic anchor — not a guarantee of safety, just a steady reminder.</td></tr>` : '';
  const m4 = `<h2>How to Choose Your ${dispName} Crystal</h2>\n<p>{{AI_M4_INTRO}}</p>\n<table>\n<thead>\n<tr><th>Life situation right now</th><th>Reach for</th><th>Why (in this moment)</th></tr>\n</thead>\n<tbody>\n<tr><td>{{AI_SCENE_1_SITUATION}}</td><td>{{AI_SCENE_1_STONE}}</td><td>{{AI_SCENE_1_WHY}}</td></tr>\n<tr><td>{{AI_SCENE_2_SITUATION}}</td><td>{{AI_SCENE_2_STONE}}</td><td>{{AI_SCENE_2_WHY}}</td></tr>\n<tr><td>{{AI_SCENE_3_SITUATION}}</td><td>{{AI_SCENE_3_STONE}}</td><td>{{AI_SCENE_3_WHY}}</td></tr>\n<tr><td>{{AI_SCENE_4_SITUATION}}</td><td>{{AI_SCENE_4_STONE}}</td><td>{{AI_SCENE_4_WHY}}</td></tr>${benMingNoteRow}\n</tbody>\n</table>\n<p><em>DiffHint (M4 偏行动):</em> 生活化需求场景（${dispName} 真实生活：重大决定前 clarity / 软化强势 / 野心期接地 / 选日常手链 / 本年度保护石）。Why 列写<strong>场景理由 + 行动指引</strong>，不重复 M3 文化 why/矿物属性。</p>`;

  // M5 How to Use（使用方式 × 产品形态 + 东方佩戴讲究合规）
  const m5 = `<h2>How to Use ${dispName} Crystals</h2>\n<p>{{AI_M5_INTRO}}</p>\n<ul>\n<li><strong>Wear it:</strong> bracelets and necklaces as a daily reminder ({{AI_M5_WEAR}})</li>\n<li><strong>Meditate with it:</strong> palm stones or tumbled stones in hand for a few minutes of intention-setting</li>\n<li><strong>Place it:</strong> a tower or raw stone on your desk, bedside, or wealth corner (财位) as environmental support</li>\n<li><strong>Pair with your affiliated Buddha/Bodhisattva amulet:</strong> a small pendant or pocket stone alongside, if that tradition is meaningful to you</li>\n</ul>\n<p><strong>A note on wearing traditions:</strong> In some Chinese wearing traditions, the left wrist is associated with receiving energy, so absorbing stones (lucky/wealth stones) are often worn there; the right with releasing, so protective stones may go there. This is symbolic practice, not a hard rule — wear what feels right for you.${isBenMingNian ? `\n<br><strong>Ben ming nian note:</strong> Many people choose to wear a protective stone (like Black Tourmaline, Smoky Quartz, or Jade) throughout their ben ming nian as a symbolic anchor through a year of change. This is a personal practice of steadiness — not a guarantee of avoiding difficulty.` : ''}</p>\n<p><em>DiffHint (M5 合规):</em> 「左进右出」必用 traditionally/symbolically 框架，禁「to absorb luck / 化太岁 / 保证避灾」。本命佛用「if that tradition is meaningful to you」非确定。</p>`;

  // M6 避讳石（已在 M3 第4维呈现，这里做独立 H2 深化 + 合规硬化必填位）
  const avoidStone = crystals.avoid;
  const m6 = `<h2>Crystals the ${dispName} Should Use Mindfully</h2>\n<p>{{AI_M6_INTRO}}</p>\n<p>${avoidStone.name} (${avoidStone.slug}) — ${avoidStone.why}</p>\n<p>{{AI_M6_DEEPEN}}</p>\n<p><strong>Two things to hold alongside any elemental guideline:</strong></p>\n<ul>\n<li>${CFG.m6_compliance.must_fill_1}</li>\n<li>${CFG.m6_compliance.must_fill_2}</li>\n</ul>\n<p class="m6-closing"><em>${CFG.m6_compliance.closing_template.replace('{Animal}', dispName).replace('{avoid_stone}', avoidStone.name)}</em></p>\n<p><em>DiffHint (M6 合规硬化):</em> 必填①②各出现一次。禁 harmful/bad for/should never wear/will bring bad luck/clashes with/must avoid/forbidden 裸用（命中强制改写为 traditionally suggested to use mindfully）。元素冲突按 ${animal.element} 元素定制（${avoidStone.slug} 与 ${animal.element} 的关系）。</p>`;

  // M7 东西方双镜头（条件式非硬映射）
  let m7 = `<h2>${dispName} Chinese Sign vs Your Western Zodiac</h2>\n<p>${CFG.m7_dual_lens.explanation}</p>\n<p>{{AI_M7_BRIDGE}}</p>`;
  if (westernLens.length) {
    const w0 = westernLens[0];
    m7 += `\n<p><strong>If you're a ${dispName} <em>and</em> a ${w0.sign}:</strong> both pages offer something — read both: <a href="/${w0.slug}-crystals/">${w0.sign} Crystals →</a> and <a href="/chinese-zodiac/${key}-crystals/">${dispName} Crystals →</a>. Two lenses on one you.</p>`;
    if (westernLens[1]) {
      const w1 = westernLens[1];
      m7 += `\n<p><strong>If you're a ${dispName} <em>and</em> a ${w1.sign}:</strong> the same applies — <a href="/${w1.slug}-crystals/">${w1.sign} Crystals →</a> sits alongside this page.</p>`;
    }
  }
  m7 += `\n<p><em>Approximate correspondence only — your Western sign depends on exact birth date; the two systems are not equivalent.</em></p>\n<p><em>DiffHint (M7):</em> 「If you're X and Y」条件式，<strong>禁「Dragon = Leo」陈述式硬等号</strong>。每篇对应不同西方星座条件式 CTA。</p>`;

  // Gentle Note
  const gentleNote = `<p class="gentle-note"><em>${CFG.disclaimer}</em></p>`;

  // M8 FAQ（7 问固定 + 文化变体）
  let faqVariant = '';
  if (variant) {
    faqVariant = `\n<details><summary>Is the ${dispName} the same across all East Asian traditions?</summary>${variant.note} We follow the common 12-animal Chinese framework here.</details>`;
  }
  const m8 = `<h2>FAQ About ${dispName} Crystals</h2>\n<details><summary>What is the best crystal for the ${dispName}?</summary>{{AI_FAQ_BEST}}</details>\n<details><summary>What is the lucky crystal for the ${dispName} in ${curYear} (${curElement} ${curAnimal} year)?</summary>{{AI_FAQ_YEARBOOST}}</details>\n<details><summary>What is the protection crystal for the ${dispName}?</summary>{{AI_FAQ_PROTECTION}}</details>\n<details><summary>Is crystal healing scientifically proven?</summary>{{AI_FAQ_SCIENCE}}</details>\n<details><summary>Can I wear a crystal that's traditionally not recommended for my sign?</summary>{{AI_FAQ_PERSONAL}}</details>\n<details><summary>What if I was born in January or February?</summary>Chinese zodiac year starts at lunar new year (late Jan/Feb), not Jan 1. If your birthday falls in Jan/Feb, check the exact lunar new year date for your birth year to confirm your sign — <a href="/chinese-zodiac/find-your-sign/">find your Chinese zodiac sign →</a></details>\n<details><summary>How is this different from Western zodiac crystals?</summary>{{AI_FAQ_VSWESTERN}}</details>${faqVariant}`;

  // M9 Shop + 内链
  const compatLinks = animal.compatibility_best.map(cn => {
    const cs = cn.toLowerCase().replace(/\s.*$/, '');
    const ca = animals[cs] || Object.values(animals).find(x => x.name.toLowerCase().startsWith(cs));
    return ca ? `<li><a href="/chinese-zodiac/${ca.name.toLowerCase().split(/\s|\(/)[0].trim()}-crystals/">${ca.name} Crystals</a> — a traditionally compatible sign</li>` : '';
  }).filter(Boolean).join('\n');
  const m9 = `<h2>Shop ${dispName} Crystals</h2>\n<p>{{AI_M9_SHOP_INTRO}}</p>\n<ul>\n<li><a href="${crystals.lucky.shop_url}">Shop ${crystals.lucky.name} →</a></li>\n<li><a href="${crystals.balance.shop_url}">Shop ${crystals.balance.name} →</a></li>\n<li><a href="${crystals.year_boost.shop_url}">Shop ${crystals.year_boost.name} →</a></li>\n</ul>\n<h3>Read more</h3>\n<ul>\n<li><a href="/chinese-zodiac/fire-horse-2026/">2026 Year of the Fire Horse →</a> (current year overview)</li>\n<li><a href="/chinese-zodiac/year-crystals/">Chinese Zodiac Crystals: complete guide →</a> (all 12 signs)</li>${compatLinks}\n</ul>\n<p>{{AI_CLOSING}}</p>`;

  // 组装
  let content = [intro, m1, m2, m3, m4, m5, m6, m7, gentleNote, m8, m9].join('\n\n');

  // 清理 DiffHint 指导段（骨架内嵌给 AI 看的指令，不进正文；diffHints 元数据已保留）
  content = content.replace(/<p>\s*<em>DiffHint[\s\S]*?<\/p>/g, '').replace(/\n{3,}/g, '\n\n');

  // TKD（evergreen 优先，不写死 2026）
  const title = `${dispName} Lucky Crystals: Chinese Zodiac Stones for Luck, Balance & Protection`;
  const focusKw = `${key} lucky crystal`;
  const article = {
    title,
    slug: articleSlug,
    url: `/chinese-zodiac/${key}-crystals/`,
    animal: animal.name,
    chinese_name: animal.chinese,
    element: animal.element,
    order: animal.order,
    years_sample: animal.years_sample,
    compatibility_best: animal.compatibility_best,
    affiliate_buddha: animal.affiliate_buddha,
    ben_ming_nian: isBenMingNian,
    personality: animal.personality,
    crystals,
    western_lens: westernLens,
    cultural_variant: variant || null,
    current_year: { year: curYear, animal: curAnimal, element: curElement },
    rank_math_title: title,
    rank_math_description: `{{AI_META_DESC}}`,
    rank_math_focus_keyword: focusKw,
    excerpt: `{{AI_EXCERPT}}`,
    diffHints: {
      m2_physical_separation: '只讲生肖文化本身，不展开水晶（水晶留 M3）',
      m3_knowledge: `每维 120-160 词 why（${animal.element} 元素 + ${dispName} 性格 + ${curYear} 年度能量）`,
      m4_action: '生活化场景行动，非 M3 换表格',
      m6_compliance: `禁裸用 harmful/bad for/should never wear/will bring bad luck/clashes with；必填①②+收尾模板`,
      m7_no_hard_mapping: 'If you\'re X and Y 条件式，禁 Dragon=Leo 硬等号',
      eastern_anchors_min2: '五行属性 / 本命佛 / 本命年 / 兼容性 / 左进右出 ≥2 锚点',
    },
    images: {
      hero: { file: `assets/images/generated/12.chinese-zodiac/${key}-crystals/${key}-crystals-hero.webp`, alt: `${crystals.lucky.name} and ${crystals.balance.name} crystals for ${dispName} Chinese zodiac`, source_type: 'zodiac-hero' },
      animal: { file: `assets/images/generated/12.chinese-zodiac/${key}-crystals/${key}-crystals-animal.webp`, alt: `${dispName} Chinese zodiac symbol with elemental ${animal.element} theme`, source_type: 'zodiac-animal' },
      lucky_stone: { file: `assets/images/generated/12.chinese-zodiac/${key}-crystals/${key}-crystals-${crystals.lucky.slug}.webp`, alt: `${crystals.lucky.name} crystal for ${dispName} Chinese zodiac`, source_type: 'scene' },
    },
    content,
  };

  fs.writeFileSync(path.join(DIR, 'articles', articleSlug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: articleSlug, animal: animal.name, title, element: animal.element, ben_ming_nian: isBenMingNian });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Chinese Zodiac 生肖骨架生成（9模块 + M2强制事实表 + M3四维只读 + M4场景表 + M6合规硬化 + M7双镜头非硬映射 + M8 FAQ7问）${slugArg ? '（⚠️ --slug 模式已重写 index，如需保留全量请跑无参数版本）' : ''}`);
