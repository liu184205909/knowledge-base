/**
 * Compatibility Checker 兼容引擎 v2（修正版）
 *
 * v1 暴露的问题：①slug 别名 missing ②amethyst×rose-quartz 经典搭配只 50（crystalmeaning 元素矩阵 air×earth=40 太苛刻 + 没用 intention）
 * v2 修正：①slug 别名映射 ②站内 pairing 命中保底 80 ③intention 协同(8tag) ④元素矩阵相克放宽
 *
 * 核心原则：站内 pairing 是权威（内容已认可），算法是补充——反转 crystalmeaning 的"算法与库脱节"缺陷。
 */
const fs = require('fs');
const ATTR = JSON.parse(fs.readFileSync('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/crystal-attributes.json', 'utf8'));

// slug 别名（stone-core-data 用通用名 → crystal-attributes 实际 slug）
const SLUG_ALIASES = { 'clear-quartz':'quartz', 'green-aventurine':'aventurine', 'lapis-lazuli':'lapis', 'rainbow-fluorite':'fluorite', 'rainbow-moonstone':'moonstone' };
function realSlug(s) { return SLUG_ALIASES[s] || s; }
function getStone(slug) { return ATTR.crystals[realSlug(slug) + '-meaning']; }

const CHAKRA_MAP = { root:'root', base:'root', 'earth star':'root', sacral:'sacral', 'solar plexus':'solar-plexus', heart:'heart', throat:'throat', 'third eye':'third-eye', crown:'crown', 'higher centers':'crown' };
function parseChakras(s) { return [...new Set((s||'').toLowerCase().split(/[,\/;(]/).map(c=>c.trim()).map(c=>CHAKRA_MAP[c]).filter(Boolean))]; }

// 35 石种的 8 intention tag（来自 intention-tag-map.md，权威）
const STONE_TAGS = {
  amethyst:['calm','protection','spiritual'], 'tiger-eye':['protection','personal-power'], jade:['calm','abundance','spiritual'],
  'rose-quartz':['love'], carnelian:['personal-power'], labradorite:['protection','spiritual','personal-power','new-beginnings'],
  moonstone:['calm','spiritual','new-beginnings'], obsidian:['protection'], 'black-tourmaline':['protection'], quartz:['spiritual','personal-power'],
  amazonite:['calm','personal-power'], aventurine:['calm','abundance','personal-power','new-beginnings'], selenite:['calm','protection','spiritual','personal-power'],
  turquoise:['protection'], lapis:['spiritual','personal-power'], fluorite:['spiritual','personal-power'], ruby:['love','health','personal-power'],
  citrine:['abundance','personal-power'], 'red-jasper':['calm','protection','health','personal-power'], opal:['personal-power'],
  bloodstone:['protection','health','personal-power'], hematite:['protection','health','personal-power'], lepidolite:['calm','new-beginnings'],
  malachite:['protection','new-beginnings'], kyanite:['calm','spiritual','personal-power'], larimar:['calm'], rhodonite:['love'],
  apatite:['personal-power'], shungite:['protection'], chrysocolla:['calm'], angelite:['calm','spiritual'], pyrite:['abundance','personal-power'],
  serpentine:['protection','new-beginnings'], 'herkimer-diamond':['spiritual','personal-power'], prehnite:['calm','love','spiritual']
};
function getTags(slug) { return STONE_TAGS[slug] || STONE_TAGS[realSlug(slug)] || []; }

// 元素矩阵（v2：相克值放宽 air×earth/earth×air 40→55，避免互补搭配被误判）
const ELEM = {
  fire:  { fire:85, water:35, earth:55, air:80, ether:65 },
  water: { fire:35, water:85, earth:80, air:50, ether:65 },
  earth: { fire:55, water:80, earth:85, air:55, ether:65 },
  air:   { fire:80, water:50, earth:55, air:85, ether:65 },
  ether: { fire:65, water:65, earth:65, air:65, ether:75 }
};
function normalizeElement(raw) {
  const parts = (raw||'').toLowerCase().split(/[,\/]/).map(x=>x.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (/storm/.test(p)) { out.push('fire'); continue; }
    if (/water/.test(p)) { out.push('water'); continue; }
    if (/fire/.test(p)) { out.push('fire'); continue; }
    if (/air|wind/.test(p)) { out.push('air'); continue; }
    if (/earth/.test(p)) { out.push('earth'); continue; }
    if (/ether|spirit|cosmos|light|space|all|éther/.test(p)) { out.push('ether'); continue; }
  }
  return out[0] || 'ether';
}

const CONFLICTS = [['carnelian','amethyst'],['moonstone','citrine'],['black-tourmaline','jade'],['selenite','red-jasper'],['rose-quartz','obsidian'],['turquoise','malachite']];
function isConflict(a, b) { const ra=realSlug(a),rb=realSlug(b); return CONFLICTS.some(([x,y])=>(x===ra&&y===rb)||(x===rb&&y===ra)); }

function pairScore(slugA, slugB) {
  if (isConflict(slugA, slugB)) return { score:25, band:'Conflicting', reason:'⚠ 站内冲突（avoid）' };
  const a = getStone(slugA), b = getStone(slugB);
  if (!a || !b) return { error:`missing: ${!a?slugA:slugB}` };

  const ea = normalizeElement(a.overview.Element), eb = normalizeElement(b.overview.Element);
  const base = ELEM[ea][eb];
  const ca = parseChakras(a.overview.Chakra), cb = parseChakras(b.overview.Chakra);
  const sharedChakra = ca.filter(c=>cb.includes(c)).length;

  // intention 协同（我们独有）
  const ta = getTags(slugA), tb = getTags(slugB);
  const sharedTag = ta.filter(t=>tb.includes(t)).length;

  // 站内 pairing 命中
  const ra = realSlug(slugA), rb = realSlug(slugB);
  const pairHit = a.pairings.some(p=>p.slug===rb) || b.pairings.some(p=>p.slug===ra);

  let score = base + 5*sharedChakra + 5*sharedTag;
  const reasons = [`element ${ea}×${eb}=${base}`, `chakra +${5*sharedChakra}(${sharedChakra})`, `intention +${5*sharedTag}(${sharedTag})`];
  if (pairHit) { reasons.push('站内pairing +15'); score += 15; }
  score = Math.min(100, score);
  if (pairHit) score = Math.max(score, 80);  // pairing 命中保底 Harmonious

  const band = score>=85?'Excellent':score>=70?'Harmonious':score>=55?'Moderate':score>=40?'Neutral':'Conflicting';
  return { score, band, reason:reasons.join(' | '), pairHit, sharedTag };
}

console.log('=== 兼容引擎 v2 测试 ===\n');
const tests = [
  ['amethyst','rose-quartz','经典互补搭配(pairing)'],
  ['amethyst','clear-quartz','放大搭配(alias)'],
  ['amethyst','black-tourmaline','calm+grounding(pairing)'],
  ['citrine','pyrite','同fire+abundance'],
  ['tiger-eye','carnelian','同solar-plexus'],
  ['carnelian','amethyst','冲突'],
  ['black-tourmaline','jade','冲突'],
  ['selenite','red-jasper','冲突'],
  ['rose-quartz','obsidian','冲突'],
  ['turquoise','malachite','冲突'],
  ['rainbow-moonstone','citrine','冲突(alias)'],
  ['jade','rose-quartz','earth+heart'],
  ['labradorite','moonstone','transformation'],
  ['ruby','rose-quartz','love主题']
];
for (const [x,y,note] of tests) {
  const r = pairScore(x,y);
  if (r.error) { console.log(`${x} × ${y}: ❌ ${r.error}`); continue; }
  const flag = r.pairHit ? '⭐pairing' : '';
  console.log(`${x.padEnd(18)} × ${y.padEnd(18)} = ${String(r.score).padStart(3)} [${r.band.padEnd(12)}] ${note} ${flag}`);
  console.log(`    ${r.reason}`);
}
