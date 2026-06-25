/**
 * 修复 dynamics 字段：中文 → 英文
 *
 * 同时修复 3 个文件：
 *   1. pairing-data.json（权威源）
 *   2. zodiac-matrix.json（工具子集）
 *   3. compatibility-tool.html（内嵌数据）
 *
 * 用法：node fix-dynamics-en.js
 */
const fs = require('fs');
const path = require('path');

// 英文版元素互动模板
const DYNAMICS_EN = {
  'fire-fire': 'Fire + Fire = amplified energy, risk of overload',
  'fire-air': 'Fire + Air = mutual fuel, air feeds fire',
  'fire-earth': 'Fire + Earth = friction, impulse meets steadiness',
  'fire-water': 'Fire + Water = clash, heat meets cool',
  'earth-earth': 'Earth + Earth = shared ground, risk of stagnation',
  'earth-air': 'Earth + Air = friction, practical meets abstract',
  'earth-water': 'Earth + Water = nourishment, earth steadies water',
  'air-air': 'Air + Air = mental resonance, risk of drifting',
  'air-water': 'Air + Water = complement, reason meets feeling',
  'water-water': 'Water + Water = emotional depth, risk of flooding',
};

function getDynamicsKey(elA, elB) {
  const sorted = [elA, elB].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

// ─── 1. 修复 pairing-data.json ───
const PAIRING_FILE = path.resolve(__dirname, '../pairing-data.json');
const pairing = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));
let fixedPairing = 0;
for (const [slug, p] of Object.entries(pairing.pairs)) {
  const key = getDynamicsKey(p.elements[0], p.elements[1]);
  const newDyn = DYNAMICS_EN[key];
  if (newDyn && p.dynamics !== newDyn) {
    p.dynamics = newDyn;
    fixedPairing++;
  }
}
pairing._meta.last_updated = new Date().toISOString();
fs.writeFileSync(PAIRING_FILE, JSON.stringify(pairing, null, 2), 'utf8');
console.log(`1. pairing-data.json: 修复 ${fixedPairing} 组 dynamics`);

// ─── 2. 修复 zodiac-matrix.json ───
const MATRIX_FILE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/zodiac-matrix.json';
const matrix = JSON.parse(fs.readFileSync(MATRIX_FILE, 'utf8'));
let fixedMatrix = 0;
for (const [slug, m] of Object.entries(matrix.matrix)) {
  const key = getDynamicsKey(m.elements[0], m.elements[1]);
  const newDyn = DYNAMICS_EN[key];
  if (newDyn && m.dynamics !== newDyn) {
    m.dynamics = newDyn;
    fixedMatrix++;
  }
}
fs.writeFileSync(MATRIX_FILE, JSON.stringify(matrix, null, 2), 'utf8');
console.log(`2. zodiac-matrix.json: 修复 ${fixedMatrix} 组 dynamics`);

// ─── 3. 修复 compatibility-tool.html（内嵌数据正则替换）───
const HTML_FILE = path.resolve(__dirname, '../../../07-互动工具/03-视觉层/compatibility-tool.html');
let html = fs.readFileSync(HTML_FILE, 'utf8');
let fixedHtml = 0;
for (const [cnKey, enVal] of Object.entries({
  'fire+fire=互旺（能量叠加，易过旺）': DYNAMICS_EN['fire-fire'],
  'fire+air=互旺（风助火势，相互激活）': DYNAMICS_EN['fire-air'],
  'fire+earth=摩擦（冲动 vs 稳重，需调谐）': DYNAMICS_EN['fire-earth'],
  'fire+water=相克（热 vs 冷，蒸气-紧张）': DYNAMICS_EN['fire-water'],
  'earth+earth=共鸣（同频稳定，可能停滞）': DYNAMICS_EN['earth-earth'],
  'earth+air=摩擦（务实 vs 抽象，节奏不同）': DYNAMICS_EN['earth-air'],
  'earth+water=滋养（土养水，稳定情感）': DYNAMICS_EN['earth-water'],
  'air+air=共鸣（心智共振，易飘）': DYNAMICS_EN['air-air'],
  'air+water=互补（理性 vs 感性，可中和）': DYNAMICS_EN['air-water'],
  'water+water=共鸣（情感深流，易泛滥）': DYNAMICS_EN['water-water'],
})) {
  // 转义正则特殊字符
  const escaped = cnKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  const count = (html.match(regex) || []).length;
  if (count > 0) {
    html = html.replace(regex, enVal);
    fixedHtml += count;
  }
}
fs.writeFileSync(HTML_FILE, html, 'utf8');
console.log(`3. compatibility-tool.html: 替换 ${fixedHtml} 处中文 dynamics`);

console.log(`\n✅ 全部修复完成`);
