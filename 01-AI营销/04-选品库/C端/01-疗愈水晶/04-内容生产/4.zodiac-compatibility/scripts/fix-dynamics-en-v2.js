/**
 * 补丁：强制覆盖所有 dynamics 字段为英文（不管原来是什么）
 * 处理 3 个文件：pairing-data.json / zodiac-matrix.json / compatibility-tool.html
 */
const fs = require('fs');
const path = require('path');

// 按元素排序后 key 映射英文
const DYN = {
  'air-air': 'Air + Air = mental resonance, risk of drifting',
  'air-earth': 'Earth + Air = friction, practical meets abstract',
  'air-fire': 'Fire + Air = mutual fuel, air feeds fire',
  'air-water': 'Air + Water = complement, reason meets feeling',
  'earth-earth': 'Earth + Earth = shared ground, risk of stagnation',
  'earth-fire': 'Fire + Earth = friction, impulse meets steadiness',
  'earth-water': 'Earth + Water = nourishment, earth steadies water',
  'fire-fire': 'Fire + Fire = amplified energy, risk of overload',
  'fire-water': 'Fire + Water = clash, heat meets cool',
  'water-water': 'Water + Water = emotional depth, risk of flooding',
};

function dynKey(a, b) { return [a, b].sort().join('-'); }
function getDyn(a, b) { return DYN[dynKey(a, b)] || `${a} + ${b}`; }

// 1. pairing-data.json
const PF = path.resolve(__dirname, '../pairing-data.json');
const pd = JSON.parse(fs.readFileSync(PF, 'utf8'));
let n1 = 0;
for (const p of Object.values(pd.pairs)) {
  const en = getDyn(p.elements[0], p.elements[1]);
  if (p.dynamics !== en) { p.dynamics = en; n1++; }
}
pd._meta.last_updated = new Date().toISOString();
fs.writeFileSync(PF, JSON.stringify(pd, null, 2), 'utf8');
console.log(`1. pairing-data.json: ${n1} 组更新`);

// 2. zodiac-matrix.json
const MF = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/zodiac-matrix.json';
const mx = JSON.parse(fs.readFileSync(MF, 'utf8'));
let n2 = 0;
for (const m of Object.values(mx.matrix)) {
  const en = getDyn(m.elements[0], m.elements[1]);
  if (m.dynamics !== en) { m.dynamics = en; n2++; }
}
fs.writeFileSync(MF, JSON.stringify(mx, null, 2), 'utf8');
console.log(`2. zodiac-matrix.json: ${n2} 组更新`);

// 3. HTML — 重新嵌入整个 ZM（确保完全同步）
const HF = path.resolve(__dirname, '../../../07-互动工具/03-视觉层/compatibility-tool.html');
let html = fs.readFileSync(HF, 'utf8');

// 构建 ZM JSON（从 matrix）
const zm = {};
for (const [slug, m] of Object.entries(mx.matrix)) {
  zm[slug] = {
    signs: m.signs, score: m.score, band: m.band, headline: m.headline,
    desc: m.description, phase: m.phase, dynamics: m.dynamics,
    crystals: m.crystals, coreChallenge: m.coreChallenge,
    synergy: m.synergy, communicationPattern: m.communicationPattern,
  };
}
const zmJson = JSON.stringify(zm);
const sIdx = html.indexOf('"ZM":{');
const eIdx = html.indexOf('},"ELEM":', sIdx);
if (sIdx === -1 || eIdx === -1) { console.error('ZM marker not found'); process.exit(1); }
html = html.slice(0, sIdx + '"ZM":'.length) + zmJson + html.slice(eIdx + 1);
fs.writeFileSync(HF, html, 'utf8');
console.log(`3. compatibility-tool.html: ZM 重新嵌入完成`);

// 验证无中文
const cn = html.match(/[\u4e00-\u9fff]/g);
console.log(cn ? `⚠️ HTML 仍含中文: ${cn.length} 字符` : '✅ HTML 无中文残留');
