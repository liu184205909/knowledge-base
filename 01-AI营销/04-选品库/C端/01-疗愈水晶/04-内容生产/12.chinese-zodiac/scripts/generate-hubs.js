/**
 * Chinese Zodiac hub 页生成器（3 篇：fire-horse-2026 年度子页 + year-crystals 总览 hub + find-your-sign 静态年表降级页）
 * 框架 v2 §1/§8/§11.1/§17
 * - fire-horse-2026: 时效 hub，2026 火马年加持石总览 + 本命年(Horse)避讳 + 12 生肖年度石表
 * - year-crystals: 常青主 hub（永久），12 生肖总览 + 东西方对比 + 找入口
 * - find-your-sign: 静态生肖年表降级页（Chinese Zodiac Checker 未上线时承接 CTA）
 * 用法：node generate-hubs.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/chinese-zodiac-knowledge.json');
const CFG = require('../configs/chinese-zodiac-config.json');
const animals = KNOW.animals;
const CY = KNOW.current_year;
const curYear = CY.year, curAnimal = CY.animal, curElement = CY.element;

// ---- 1. fire-horse-2026 年度子页 ----
function buildFireHorse2026() {
  const sigStones = CY.signature_stones.map(s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')).join(', ');
  // 12 生肖年度加持石表（读 year_boost 字段，只读不编）
  const yearRows = Object.values(animals).sort((a, b) => a.order - b.order).map(a => {
    const yb = a.year_boost;
    const isBMN = a.ben_ming_nian;
    return `<tr><td><a href="/chinese-zodiac/${a.name.toLowerCase().split(/\s|\(/)[0].trim()}-crystals/">${a.name}</a>${isBMN ? ' (本命年)' : ''}</td><td>${yb.name}</td><td>${yb.why}</td></tr>`;
  }).join('\n');

  const title = `2026 Year of the Fire Horse: Lucky Crystals & What to Avoid`;
  const content = [
    `{{AI_FH_INTRO}}`,
    `<h2>2026 Fire Horse at a Glance</h2>
<table>
<thead><tr><th>Field</th><th>${curYear} ${curElement} ${curAnimal} Year</th></tr></thead>
<tbody>
<tr><td>Stem-branch</td><td>${CY.stem_branch}</td></tr>
<tr><td>Dates</td><td>${CY.dates}</td></tr>
<tr><td>Theme</td><td>${CY.theme}</td></tr>
<tr><td>Signature stones</td><td>${sigStones}</td></tr>
<tr><td>Ben ming nian sign</td><td>${CY.ben_ming_nian_sign}</td></tr>
</tbody>
</table>
<p>{{AI_FH_THEME_PARA}}</p>`,
    `<h2>Signature Crystals for the Fire Horse Year</h2>
<p>{{AI_FH_SIGNATURE_INTRO}}</p>
<ul>
<li><strong>Citrine</strong> — {{AI_FH_CITRINE}}</li>
<li><strong>Jade</strong> — {{AI_FH_JADE}}</li>
<li><strong>Black Tourmaline</strong> — {{AI_FH_BLACKTOURMALINE}}</li>
<li><strong>Smoky Quartz</strong> — {{AI_FH_SMOKY}}</li>
<li><strong>Clear Quartz</strong> — {{AI_FH_CLEAR}}</li>
</ul>
<p><em>DiffHint:</em> 5 颗签名石各 80-120 词 why（火马年能量 + 五行 Fire on Fire 需 grounding/cooling），非通用句。本命年保护石优先。</p>`,
    `<h2>Ben Ming Nian (本命年): If You're a Horse</h2>
<p>{{AI_FH_BMN_INTRO}}</p>
<p><strong>Protective priority stones:</strong> Black Tourmaline, Smoky Quartz, Jade — many Horses choose to wear one throughout ${curYear} as a symbolic anchor through a year of change. <em>This is a personal steadiness practice, not a guarantee of avoiding difficulty.</em></p>
<p><strong>Use mindfully:</strong> excessive Fire-element stones (large Ruby / Carnelian / Sunstone stacks) — Fire on Fire can over-amp. Favor grounding and cooling stones this year. Personal resonance overrules any guideline.</p>
<p><a href="/chinese-zodiac/horse-crystals/"><strong>Read the full Horse Crystals guide →</strong></a></p>`,
    `<h2>The ${curYear} Booster Stone for Every Sign</h2>
<p>Each animal has a stone traditionally associated with supporting them through the Fire Horse year's energy. This reads from a single shared data source used by both the articles and our upcoming checker tool.</p>
<table>
<thead><tr><th>Sign</th><th>${curYear} booster</th><th>Why</th></tr></thead>
<tbody>
${yearRows}
</tbody>
</table>`,
    `<p class="gentle-note"><em>${CFG.disclaimer}</em></p>`,
    `<h2>Frequently Asked Questions</h2>
<details><summary>What does "Fire Horse year" mean?</summary>{{AI_FH_FAQ_MEANING}}</details>
<details><summary>Is 2026 a bad year for Horses?</summary>{{AI_FH_FAQ_BMN}}</details>
<details><summary>Which stones should I avoid in 2026?</summary>{{AI_FH_FAQ_AVOID}}</details>
<details><summary>What if I was born in January or February 2026?</summary>Chinese zodiac year starts at lunar new year (${CY.dates.split('–')[0].trim()}). If your birthday is before that date, you're technically the previous sign (Goat). <a href="/chinese-zodiac/find-your-sign/">Find your Chinese zodiac sign →</a></details>`,
    `<h2>Read more</h2>
<ul>
<li><a href="/chinese-zodiac/year-crystals/">Chinese Zodiac Crystals: complete guide →</a></li>
<li><a href="/chinese-zodiac/horse-crystals/">Horse Crystals (2026 ben ming nian) →</a></li>
<li><a href="/chinese-zodiac/snake-crystals/">Snake Crystals (2025 just-past) →</a></li>
</ul>`,
  ].join('\n\n');

  return {
    title, slug: 'fire-horse-2026', url: '/chinese-zodiac/fire-horse-2026/',
    type: 'year-hub',
    rank_math_title: title,
    rank_math_description: `{{AI_META_DESC}}`,
    rank_math_focus_keyword: `fire horse 2026 crystals`,
    excerpt: `{{AI_EXCERPT}}`,
    images: {
      hero: { file: `assets/images/generated/12.chinese-zodiac/fire-horse-2026/fire-horse-2026-hero.webp`, alt: `2026 Fire Horse year signature crystals — citrine, jade, black tourmaline`, source_type: 'zodiac-hero' },
    },
    content: content.replace(/<p>\s*<em>DiffHint[\s\S]*?<\/p>/g, '').replace(/\n{3,}/g, '\n\n'),
  };
}

// ---- 2. year-crystals 常青总览 hub ----
function buildYearCrystalsHub() {
  const tableRows = Object.values(animals).sort((a, b) => a.order - b.order).map(a => {
    return `<tr><td>${a.order}</td><td><a href="/chinese-zodiac/${a.name.toLowerCase().split(/\s|\(/)[0].trim()}-crystals/">${a.name}</a></td><td>${a.chinese}</td><td>${a.element}</td><td>${a.lucky_stone.name}</td><td>${a.balance_stone.name}</td></tr>`;
  }).join('\n');

  const title = `Chinese Zodiac Crystals: Complete Guide to Lucky Stones for All 12 Signs`;
  const content = [
    `{{AI_HUB_INTRO}}`,
    `<h2>Chinese Zodiac vs Western Zodiac</h2>
<p>${CFG.m7_dual_lens.explanation}</p>
<p>{{AI_HUB_VSWESTERN}}</p>
<p><em>This hub follows the common 12-animal Chinese framework. Traditions vary across regions — e.g., Vietnam's zodiac features the <strong>Cat</strong> where China features the <strong>Rabbit</strong>; Japan uses the <strong>Boar</strong> where China uses the <strong>Pig</strong>.</em></p>`,
    `<h2>All 12 Signs at a Glance</h2>
<table>
<thead><tr><th>#</th><th>Sign</th><th>Chinese</th><th>Element</th><th>Lucky stone</th><th>Balance stone</th></tr></thead>
<tbody>
${tableRows}
</tbody>
</table>
<p>Not sure which sign you are? <a href="/chinese-zodiac/find-your-sign/"><strong>Find your Chinese zodiac sign →</strong></a></p>`,
    `<h2>${curYear}: Year of the ${curElement} ${curAnimal}</h2>
<p>{{AI_HUB_YEAR_INTRO}}</p>
<p><a href="/chinese-zodiac/fire-horse-2026/"><strong>${curYear} Fire Horse year crystals guide →</strong></a></p>`,
    `<h2>How to Choose Crystals by Element</h2>
<p>{{AI_HUB_ELEMENT_INTRO}}</p>
<ul>
<li><strong>Wood (Tiger, Rabbit):</strong> growth, expansion — pair with grounding when restless</li>
<li><strong>Fire (Snake, Horse):</strong> passion, visibility — balance with cooling/grounding stones</li>
<li><strong>Earth (Ox, Dragon, Goat, Dog):</strong> stability, reliability — flow stones prevent rigidity</li>
<li><strong>Metal (Monkey, Rooster):</strong> decisiveness, precision — soft stones prevent over-sharpness</li>
<li><strong>Water (Rat, Pig):</strong> adaptability, wisdom — focus stones prevent scattering</li>
</ul>`,
    `<h2>Ben Ming Nian (本命年): Your Own Zodiac Year</h2>
<p>{{AI_HUB_BMN_INTRO}}</p>
<p><em>Traditionally a year of change rather than pure luck — many people wear a protective stone as a symbolic anchor. Not a guarantee of safety, just a steady reminder.</em></p>`,
    `<p class="gentle-note"><em>${CFG.disclaimer}</em></p>`,
    `<h2>Frequently Asked Questions</h2>
<details><summary>How is the Chinese zodiac different from Western astrology?</summary>{{AI_HUB_FAQ_VS}}</details>
<details><summary>What is ben ming nian?</summary>{{AI_HUB_FAQ_BMN}}</details>
<details><summary>Are crystal meanings scientifically proven?</summary>{{AI_HUB_FAQ_SCIENCE}}</details>
<details><summary>Can I wear a stone that's not traditional for my sign?</summary>Absolutely. These are cultural-symbolic guidelines, not rules. Personal resonance overrules tradition — trust how a stone feels to you over any textbook.</details>`,
  ].join('\n\n');

  return {
    title, slug: 'year-crystals', url: '/chinese-zodiac/year-crystals/',
    type: 'evergreen-hub',
    rank_math_title: title,
    rank_math_description: `{{AI_META_DESC}}`,
    rank_math_focus_keyword: `chinese zodiac crystals`,
    excerpt: `{{AI_EXCERPT}}`,
    images: {
      hero: { file: `assets/images/generated/12.chinese-zodiac/year-crystals/year-crystals-hero.webp`, alt: `12 Chinese zodiac animals with their lucky crystals`, source_type: 'zodiac-hero' },
    },
    content,
  };
}

// ---- 3. find-your-sign 静态年表降级页 ----
function buildFindYourSign() {
  // 12 生肖 × 近年（含 2020-2030 跨度），农历新年边界说明
  const yearMap = [
    { range: 'Jan 25, 2020 – Feb 11, 2021', sign: 'Rat', slug: 'rat-crystals' },
    { range: 'Feb 12, 2021 – Jan 31, 2022', sign: 'Ox', slug: 'ox-crystals' },
    { range: 'Feb 1, 2022 – Jan 21, 2023', sign: 'Tiger', slug: 'tiger-crystals' },
    { range: 'Jan 22, 2023 – Feb 9, 2024', sign: 'Rabbit', slug: 'rabbit-crystals' },
    { range: 'Feb 10, 2024 – Jan 28, 2025', sign: 'Dragon', slug: 'dragon-crystals' },
    { range: 'Jan 29, 2025 – Feb 16, 2026', sign: 'Snake', slug: 'snake-crystals' },
    { range: 'Feb 17, 2026 – Feb 5, 2027', sign: 'Horse', slug: 'horse-crystals' },
    { range: 'Feb 6, 2027 – Jan 25, 2028', sign: 'Goat', slug: 'goat-crystals' },
    { range: 'Jan 26, 2028 – Feb 12, 2029', sign: 'Monkey', slug: 'monkey-crystals' },
    { range: 'Feb 13, 2029 – Feb 2, 2030', sign: 'Rooster', slug: 'rooster-crystals' },
    { range: 'Feb 3, 2030 – Jan 22, 2031', sign: 'Dog', slug: 'dog-crystals' },
    { range: 'Jan 23, 2031 – Feb 10, 2032', sign: 'Pig', slug: 'pig-crystals' },
  ];
  const rows = yearMap.map(r => `<tr><td>${r.range}</td><td><a href="/chinese-zodiac/${r.slug}/">${r.sign}</a></td></tr>`).join('\n');

  const title = `Find Your Chinese Zodiac Sign (Birth Year Table)`;
  const content = [
    `<h2>Find Your Chinese Zodiac Sign</h2>
<p>The Chinese zodiac runs on a 12-year animal cycle based on the <strong>lunar new year</strong> (late January / early February), <em>not</em> January 1. So if your birthday falls in January or early February, you may actually belong to the previous year's sign — check the exact lunar new year date for your birth year below.</p>
<p>This page is a simple reference table. Our interactive <strong>Chinese Zodiac Checker</strong> tool is coming soon — for now, look up your sign here.</p>`,
    `<h2>Chinese Zodiac Year Table (2020 – 2032)</h2>
<table>
<thead><tr><th>Lunar year range</th><th>Your sign</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p><em>Dates are approximate near the lunar-new-year boundary. For birthdays on the exact cusp (1-2 days around lunar new year), consult a detailed lunar calendar for your birth year.</em></p>`,
    `<h2>Why the Lunar Boundary Matters</h2>
<p>Unlike Western astrology (which switches by calendar month), the Chinese zodiac switches once a year at lunar new year. Someone born on <strong>February 1, 2022</strong> is a <strong>Tiger</strong>, but someone born on <strong>January 30, 2022</strong> is still an <strong>Ox</strong> — because the Tiger year didn't begin until February 1.</p>
<p>This is why so many people are surprised by their "real" sign when they finally check.</p>`,
    `<h2>Once You Know Your Sign</h2>
<p>Each sign has traditional lucky stones, balance stones, a current-year booster, and elemental guidance. Pick your sign above to read its full crystal guide — or start with the <a href="/chinese-zodiac/year-crystals/">complete Chinese Zodiac crystals overview →</a></p>`,
    `<p class="gentle-note"><em>${CFG.disclaimer}</em></p>`,
  ].join('\n\n');

  return {
    title, slug: 'find-your-sign', url: '/chinese-zodiac/find-your-sign/',
    type: 'tool-fallback',
    rank_math_title: title,
    rank_math_description: `Find your Chinese zodiac sign by birth year. Lunar new year boundary table (2020-2032) — essential for January/February birthdays.`,
    rank_math_focus_keyword: `find your chinese zodiac sign`,
    excerpt: `Look up your Chinese zodiac sign by birth year. Includes exact lunar new year boundaries so January/February birthdays get the right sign.`,
    images: {
      hero: { file: `assets/images/generated/12.chinese-zodiac/find-your-sign/find-your-sign-hero.webp`, alt: `12 Chinese zodiac animals year cycle table`, source_type: 'zodiac-hero' },
    },
    content,
  };
}

// 生成 3 个 hub
const hubs = [buildFireHorse2026(), buildYearCrystalsHub(), buildFindYourSign()];
for (const h of hubs) {
  fs.writeFileSync(path.join(DIR, 'articles', h.slug + '.json'), JSON.stringify(h, null, 2), 'utf8');
}

// 合并到 articles-index（追加到 12 生肖后）
const idxPath = path.join(DIR, 'articles-index.json');
const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
for (const h of hubs) {
  idx.articles.push({ slug: h.slug, animal: h.type, title: h.title, element: '', ben_ming_nian: false, is_hub: true });
  idx.total++;
}
fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2), 'utf8');
console.log(`✅ 3 篇 hub 生成（fire-horse-2026 + year-crystals + find-your-sign），articles-index 合并至 ${idx.total} 篇`);
