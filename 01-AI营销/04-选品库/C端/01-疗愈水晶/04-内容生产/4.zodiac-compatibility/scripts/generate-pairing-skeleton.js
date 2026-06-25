/**
 * 从 zodiac-matrix.json 转换出 pairing-data.json 骨架（78 组）
 *
 * 用法：node generate-pairing-skeleton.js
 *
 * 输出：../pairing-data.json（78 组骨架，含占位字段，待 agent 补差异化内容）
 */
const fs = require('fs');
const path = require('path');

const SRC = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/zodiac-matrix.json';
const DST = path.resolve(__dirname, '../pairing-data.json');

const matrix = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// 元素互动定性模板（6 种组合）
const DYNAMICS_MAP = {
  'fire-fire': 'fire+fire=互旺（能量叠加，易过旺）',
  'fire-air': 'fire+air=互旺（风助火势，相互激活）',
  'fire-earth': 'fire+earth=摩擦（冲动 vs 稳重，需调谐）',
  'fire-water': 'fire+water=相克（热 vs 冷，蒸气-紧张）',
  'earth-earth': 'earth+earth=共鸣（同频稳定，可能停滞）',
  'earth-air': 'earth+air=摩擦（务实 vs 抽象，节奏不同）',
  'earth-water': 'earth+water=滋养（土养水，稳定情感）',
  'air-air': 'air+air=共鸣（心智共振，易飘）',
  'air-water': 'air+water=互补（理性 vs 感性，可中和）',
  'water-water': 'water+water=共鸣（情感深流，易泛滥）',
};

// 相位 → 5 维度 baseline（agent 在此基础上微调）
const PHASE_BASELINE = {
  'Conjunction':  { love: 72, friendship: 78, sexual: 74, marriage: 70, communication: 72 },
  'Trine':        { love: 86, friendship: 88, sexual: 85, marriage: 84, communication: 85 },
  'Sextile':      { love: 78, friendship: 82, sexual: 76, marriage: 75, communication: 80 },
  'Opposition':   { love: 68, friendship: 60, sexual: 80, marriage: 60, communication: 55 },
  'Square':       { love: 45, friendship: 55, sexual: 65, marriage: 42, communication: 40 },
  'Semi-sextile': { love: 60, friendship: 65, sexual: 58, marriage: 58, communication: 60 },
  'Quincunx':     { love: 50, friendship: 55, sexual: 52, marriage: 48, communication: 50 },
};

function getDynamics(elA, elB) {
  const sorted = [elA, elB].sort();
  const key = `${sorted[0]}-${sorted[1]}`;
  return DYNAMICS_MAP[key] || `${elA}+${elB}=互动`;
}

function getBaseline(phase) {
  return PHASE_BASELINE[phase] || { love: 60, friendship: 65, sexual: 60, marriage: 58, communication: 60 };
}

// 转换
const pairs = {};
let count = 0;
for (const [slug, data] of Object.entries(matrix.matrix)) {
  const [sa, sb] = data.elements;
  const baseline = getBaseline(data.phase);
  pairs[slug] = {
    // ─── 段1：基础字段（派生自 zodiac-matrix.json） ───
    url: `/zodiac-compatibility/${slug}/`,
    slug: slug,
    signs: data.signs,
    elements: data.elements,
    phase: data.phase,
    score: data.score,
    band: data.band,
    headline: data.headline,
    description: data.description,
    crystals: data.crystals,

    // ─── 段2：5 维度评分（baseline，agent 后续微调） ───
    scores: { ...baseline },

    // ─── 段3：差异化内容字段（占位，agent 后续生成） ───
    dynamics: getDynamics(sa, sb),
    coreChallenge: '',   // 待 agent 生成
    synergy: '',          // 待 agent 生成
    communicationPattern: '', // 待 agent 生成

    // ─── 段4：名人配对（占位） ───
    famousCouples: {
      together: [],
      brokenUp: [],
    },
  };
  count++;
}

const output = {
  _meta: {
    type: 'Zodiac Compatibility pairing data (78 pairs)',
    purpose: 'Article content source for /zodiac-compatibility/{a}-{b}/ pages',
    schema_version: '1.0',
    total_pairs: count,
    generated_at: new Date().toISOString(),
    source: {
      base_fields: '07-互动工具/02-数据层/zodiac-matrix.json (派生)',
      content_fields: 'AI agent 生成（5 维评分 + 核心挑战 + 协同优势 + 沟通模式 + 名人配对）',
    },
    schema_doc: '03-内容策略/内容Brief/模板-星座配对×水晶框架.md §10.3',
    next_steps: [
      'baseline scores 已填（按相位），agent 需按元素互动微调单维度',
      'coreChallenge / synergy / communicationPattern 为空，待 agent 逐对生成',
      'famousCouples 待建名人×星座映射表后参数化',
    ],
  },
  pairs,
};

fs.writeFileSync(DST, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ 生成 ${count} 组配对骨架 → ${DST}`);
console.log(`   待补字段：coreChallenge / synergy / communicationPattern / famousCouples`);
