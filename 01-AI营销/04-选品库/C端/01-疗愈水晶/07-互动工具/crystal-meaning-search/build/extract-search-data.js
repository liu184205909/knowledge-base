/**
 * Crystal Meaning Search 数据提取（T2 数据层）
 *
 * 数据源：
 *   - _shared/crystal-attributes.json（overview: Color/Chakra/Element/Intentions，已抽取）
 *   - 04-内容生产/1.crystal-meaning/*.json（img: form_bracelet + excerpt 一句话含义 + title）
 * 输出：../data/search-data.json
 *
 * 归一化（facet 可筛选前提）：
 *   - color: 399 种原始值 → 12 色系（关键词映射）
 *   - chakra: → 7 脉轮（CHAKRA_MAP，复用 engine 逻辑）
 *   - element: 48 种 → 5 元（normElem，复用 engine 逻辑）
 *   - intention: 284 种原始值 → 8 意图 tag（对齐站点 intention 页 + product-structure-plan）
 *
 * Usage: node extract-search-data.js
 */
const fs = require('fs');
const path = require('path');

const ATTR = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/crystal-attributes.json'), 'utf8'));
const SRC_DIR = path.resolve(__dirname, '../../../04-内容生产/1.crystal-meaning');

// Shop 链接：30 核心石种（有 by-stone 产品分类）→ /product-category/{slug}-crystals/；其余 → fallback 首饰类目
const STONES30 = new Set(Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-compatibility-checker/data/crystal-stones-30.json'), 'utf8')).stones || {}));
const CAT_ALIAS = { 'quartz': 'clear-quartz', 'lapis': 'lapis-lazuli' };
function shopFor(slug) {
  return STONES30.has(slug) ? ('/product-category/' + (CAT_ALIAS[slug] || slug) + '-crystals/') : '/product-category/healing-crystals-jewelry/';
}

// ===== 归一化函数 =====

// Color → 12 色系（关键词；一颗可多色，返回数组）
const COLOR_MAP = [
  ['red', /red|crimson|scarlet|ruby|maroon|burgundy/],
  ['orange', /orange|amber|copper|peach|bronze|rust|terracotta/],
  ['yellow', /yellow|gold|citrine|mustard/],
  ['green', /green|jade|emerald|moss|peridot|olive/],
  ['blue', /blue|azure|sapphire|aqua|teal/],
  ['purple', /purple|violet|lavender|amethyst|plum/],
  ['pink', /pink|rose|magenta|salmon/],
  ['brown', /brown|tan|earth|mocha|chestnut|umber|sienna/],
  ['black', /black|obsidian|onyx|jet/],
  ['white', /white|colorless|cream|ivory/],
  ['grey', /grey|gray|silver|slate/],
];
function normColors(raw) {
  const s = (raw || '').toLowerCase();
  const hits = new Set();
  for (const [k, re] of COLOR_MAP) if (re.test(s)) hits.add(k);
  return [...hits];
}

// Chakra → 7 脉轮（复用 engine CHAKRA_MAP）
const CHAKRA_MAP = { root: 'root', base: 'root', 'earth star': 'root', sacral: 'sacral', 'solar plexus': 'solar-plexus', heart: 'heart', throat: 'throat', 'third eye': 'third-eye', 'third-eye': 'third-eye', crown: 'crown', 'higher centers': 'crown' };
function normChakras(raw) {
  return [...new Set((raw || '').toLowerCase().split(/[,\/;(]/).map(c => c.trim()).map(c => CHAKRA_MAP[c]).filter(Boolean))];
}

// Element → 5 元（复用 engine normElem）
function normElem(raw) {
  const p = (raw || '').toLowerCase().split(/[,\/]/).map(x => x.trim()).filter(Boolean);
  for (const x of p) {
    if (/storm|fire/.test(x)) return 'fire';
    if (/water/.test(x)) return 'water';
    if (/earth/.test(x)) return 'earth';
    if (/air|wind/.test(x)) return 'air';
    if (/ether|spirit|cosmos|light|space|all|éther/.test(x)) return 'ether';
  }
  return 'ether';
}

// Intention → 8 意图 tag（对齐站点 intention 页）
const INTENT_MAP = [
  ['calm', /calm|peace|peaceful|relax|sooth|gentle|patien|sleep|stress|tranquil/],
  ['protection', /protect|ground|shield|ward|secur/],
  ['love', /\blove\b|heart|compass|roman|relation|passion|emotional balance|forgive/],
  ['abundance', /abundanc|prosper|wealth|money|luck|success|manifes/],
  ['health', /health|vital|\bheal|strength|energy|wellness/],
  ['spiritual', /spiritual|wisdom|insight|intuit|meditat|conscious|higher self|mystic/],
  ['personal-power', /personal power|confidence|courage|focus|willpower|determin|motivat|self-esteem|truth|communicat/],
  ['new-beginnings', /new beginning|renewal|transform|growth|change|transition|creativ/],
];
function normIntentions(raw) {
  const s = (raw || '').toLowerCase();
  const hits = new Set();
  for (const [k, re] of INTENT_MAP) if (re.test(s)) hits.add(k);
  return [...hits];
}

function stripTags(s) { return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
function firstName(title) { return title.split(/\s+Meaning/)[0].trim(); }

// ===== 提取 =====
const crystals = [];
let withImg = 0, withExcerpt = 0, noFacet = 0;

for (const [slug, c] of Object.entries(ATTR.crystals)) {
  const shortSlug = slug.replace(/-meaning$/, '');
  let raw = {};
  try { raw = JSON.parse(fs.readFileSync(path.join(SRC_DIR, slug + '.json'), 'utf8')); } catch (e) {}

  const img = (raw.images && raw.images.form_bracelet && raw.images.form_bracelet.src)
    || (raw.images && raw.images.overview && raw.images.overview.src) || '';
  if (img) withImg++;

  let excerpt = stripTags((raw.excerpt && raw.excerpt.rendered) || (raw.rank_math_description) || '');
  excerpt = excerpt.slice(0, 150);
  if (excerpt) withExcerpt++;

  const name = firstName(raw.title || c.title || shortSlug);
  const ov = c.overview || {};
  const colors = normColors(ov.Color);
  const chakras = normChakras(ov.Chakra);
  const element = normElem(ov.Element);
  const intentions = normIntentions(ov.Intentions);

  if (!colors.length && !chakras.length && !intentions.length) noFacet++;

  crystals.push({
    slug: shortSlug, name, img, excerpt,
    colors, chakras, element, intentions,
    link: '/gemstone/' + slug + '/',
    shop: shopFor(shortSlug),
  });
}

// 按 name 字母序
crystals.sort((a, b) => a.name.localeCompare(b.name));

const out = {
  _meta: {
    source: '_shared/crystal-attributes.json + 04-内容生产/1.crystal-meaning/*.json',
    total: crystals.length,
    with_img: withImg,
    with_excerpt: withExcerpt,
    no_facet: noFacet,
    facets: {
      color: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white', 'grey'],
      chakra: ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'],
      element: ['fire', 'water', 'earth', 'air', 'ether'],
      intention: ['calm', 'protection', 'love', 'abundance', 'health', 'spiritual', 'personal-power', 'new-beginnings'],
    },
  },
  crystals,
};

fs.writeFileSync(path.resolve(__dirname, '../data/search-data.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('=== Crystal Meaning Search 数据提取完成 ===');
console.log('总水晶:', crystals.length);
console.log('有图(form_bracelet/overview):', withImg, `(${(100 * withImg / crystals.length).toFixed(1)}%)`);
console.log('有excerpt:', withExcerpt);
console.log('无任何facet:', noFacet);
console.log('输出:', path.resolve(__dirname, '../data/search-data.json'));
console.log(`大小: ${(fs.statSync(path.resolve(__dirname, '../data/search-data.json')).size / 1024).toFixed(1)} KB`);
