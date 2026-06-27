/**
 * 生成 chakra/color/element spoke 数据映射(23篇)
 * chakra 7 + color 12 + element 4, 每维度→水晶列表(优先30核心有产品)
 * 输出 spoke-data.json + selected-spokes.json(23篇清单)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const stones30 = require('../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json').stones;
const attr = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const coreSlugs = Object.keys(stones30); // 30 核心(有产品)
const cap = s => s.split(/[-\s]/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// 维度定义
const CHAKRAS = [
  { slug: 'root', name: 'Root Chakra', kw: 'root chakra crystals' },
  { slug: 'sacral', name: 'Sacral Chakra', kw: 'sacral chakra crystals' },
  { slug: 'solar-plexus', name: 'Solar Plexus Chakra', kw: 'solar plexus chakra crystals' },
  { slug: 'heart', name: 'Heart Chakra', kw: 'heart chakra crystals' },
  { slug: 'throat', name: 'Throat Chakra', kw: 'throat chakra crystals' },
  { slug: 'third-eye', name: 'Third Eye Chakra', kw: 'third eye chakra crystals' },
  { slug: 'crown', name: 'Crown Chakra', kw: 'crown chakra crystals' },
];
const COLORS = [
  { slug: 'white', name: 'White', kw: 'white crystals' },
  { slug: 'yellow', name: 'Yellow', kw: 'yellow crystals' },
  { slug: 'green', name: 'Green', kw: 'green crystals' },
  { slug: 'brown', name: 'Brown', kw: 'brown crystals' },
  { slug: 'black', name: 'Black', kw: 'black crystals' },
  { slug: 'pink', name: 'Pink', kw: 'pink crystals' },
  { slug: 'blue', name: 'Blue', kw: 'blue crystals' },
  { slug: 'red', name: 'Red', kw: 'red crystals' },
  { slug: 'orange', name: 'Orange', kw: 'orange crystals' },
  { slug: 'grey', name: 'Grey', kw: 'grey crystals' },
  { slug: 'blue-green', name: 'Blue-Green', kw: 'blue green crystals' },
  { slug: 'purple', name: 'Purple', kw: 'purple crystals' },
];
const ELEMENTS = [
  { slug: 'earth', name: 'Earth', kw: 'earth element crystals' },
  { slug: 'fire', name: 'Fire', kw: 'fire element crystals' },
  { slug: 'air', name: 'Air', kw: 'air element crystals' },
  { slug: 'water', name: 'Water', kw: 'water element crystals' },
];

function norm(s) { return (s || '').toLowerCase().trim(); }

// 按 Chakra 字段筛选(30核心优先 + 390补到12)
function byChakra(chakraSlug) {
  const target = chakraSlug.replace(/-/g, ' '); // solar-plexus → solar plexus
  const core = [], extra = [];
  for (const s of coreSlugs) {
    const a = attr[s + '-meaning'] || {};
    const ch = norm((a.overview || {}).Chakra).replace(/ chakra/g, '');
    if (ch.split(/[,/]/).map(x => x.trim()).includes(target)) core.push(s);
  }
  for (const k of Object.keys(attr)) {
    if (coreSlugs.includes(k.replace(/-meaning$/, ''))) continue;
    const a = attr[k] || {};
    const ch = norm((a.overview || {}).Chakra).replace(/ chakra/g, '');
    if (ch.split(/[,/]/).map(x => x.trim()).includes(target)) extra.push(k.replace(/-meaning$/, ''));
  }
  return [...core, ...extra].slice(0, 12); // 核心 + 补到12
}
// 按 Color 筛选(30核心 + 390补到8-10)
function byColor(colorSlug) {
  const core = [], extra = [];
  for (const s of coreSlugs) {
    const a = attr[s + '-meaning'] || {};
    const cs = (a.overview || {}).Color || '';
    if (cs.toLowerCase().includes(colorSlug.replace('-', ' ')) || cs.toLowerCase().includes(colorSlug)) core.push(s);
  }
  // 390 补充(非核心)
  for (const k of Object.keys(attr)) {
    if (coreSlugs.includes(k.replace(/-meaning$/, ''))) continue;
    const cs = (attr[k].overview || {}).Color || '';
    if (cs.toLowerCase().includes(colorSlug.replace('-', ' ')) || cs.toLowerCase().includes(colorSlug)) {
      extra.push(k.replace(/-meaning$/, ''));
    }
  }
  // 核心优先 + 补到 9 颗
  const all = [...core, ...extra].slice(0, 9);
  return all;
}
// 按 Element 筛选(30核心优先 + 390补到12)
function byElement(elSlug) {
  const core = [], extra = [];
  for (const s of coreSlugs) {
    const a = attr[s + '-meaning'] || {};
    const el = norm((a.overview || {}).Element).split(/[,/]/).map(x => x.split('(')[0].trim());
    if (el.includes(elSlug)) core.push(s);
  }
  for (const k of Object.keys(attr)) {
    if (coreSlugs.includes(k.replace(/-meaning$/, ''))) continue;
    const a = attr[k] || {};
    const el = norm((a.overview || {}).Element).split(/[,/]/).map(x => x.split('(')[0].trim());
    if (el.includes(elSlug)) extra.push(k.replace(/-meaning$/, ''));
  }
  return [...core, ...extra].slice(0, 12);
}

const spokes = [];
for (const c of CHAKRAS) {
  const list = byChakra(c.slug);
  spokes.push({ type: 'chakra', slug: c.slug, url: `/${c.slug}-chakra-crystals/`, name: c.name, kw: c.kw, title: `Best Crystals for the ${c.name}: A Complete Guide`, crystals: list });
}
for (const c of COLORS) {
  const list = byColor(c.slug);
  spokes.push({ type: 'color', slug: c.slug, url: `/${c.slug}-crystals/`, name: c.name, kw: c.kw, title: `Best ${c.name} Crystals: Meanings, Benefits & How to Use`, crystals: list });
}
for (const e of ELEMENTS) {
  const list = byElement(e.slug);
  spokes.push({ type: 'element', slug: e.slug, url: `/${e.slug}-crystals/`, name: e.name, kw: e.kw, title: `Best ${e.name} Element Crystals: Grounding, Energy & Meaning`, crystals: list });
}

fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(path.join(DIR, 'spoke-data.json'), JSON.stringify({ _meta: { total: spokes.length, chakra: 7, color: 12, element: 4 }, spokes }, null, 2));
fs.writeFileSync(path.join(DIR, 'selected-spokes.json'), JSON.stringify({ total: spokes.length, spokes: spokes.map(s => ({ type: s.type, slug: s.slug, url: s.url, title: s.title, kw: s.kw, stoneCount: s.crystals.length })) }, null, 2));

console.log(`✅ ${spokes.length} 篇 spoke 数据生成`);
spokes.forEach(s => console.log(`  [${s.type}] ${s.slug} | ${s.crystals.length}颗 | ${s.url}`));
console.log(`\n输出: spoke-data.json + selected-spokes.json`);
