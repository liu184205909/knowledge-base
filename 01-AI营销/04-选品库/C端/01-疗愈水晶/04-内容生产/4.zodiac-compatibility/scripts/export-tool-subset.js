/**
 * 从 pairing-data.json 导出工具子集到 07-互动工具/zodiac-compatibility-checker/data/zodiac-matrix.json
 *
 * 数据流（单向）：pairing-data.json（权威）→ zodiac-matrix.json（工具静态子集）
 * 工具前端只读 zodiac-matrix.json，不读 pairing-data.json（不动态耦合）
 *
 * 用法：node export-tool-subset.js
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../pairing-data.json');
const DST = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/zodiac-compatibility-checker/data/zodiac-matrix.json';

const pairing = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// 导出字段（工具需要的子集）
const matrix = {};
for (const [slug, p] of Object.entries(pairing.pairs)) {
  matrix[slug] = {
    // ─── 原有字段（保持兼容） ───
    signs: p.signs,
    elements: p.elements,
    phase: p.phase,
    score: p.score,
    band: p.band,
    headline: p.headline,
    description: p.description,
    crystals: p.crystals,

    // ─── 新增字段（差异化内容，从 pairing-data 静态导入） ───
    dynamics: p.dynamics,
    coreChallenge: p.coreChallenge,
    synergy: p.synergy,
    communicationPattern: p.communicationPattern,

    // ─── 5 维评分（工具结果区可选展示） ───
    scores: p.scores,
  };
}

const output = {
  _meta: {
    type: 'Zodiac × Zodiac compatibility matrix (Tab A)',
    basis: '占星 synastry 传统（元素 + 黄道相位）',
    total_pairs: Object.keys(matrix).length,
    score_basis: 'phase score (trine91/sextile80/conj76/opp67/semi62/quincunx51/square43)',
    crystal_source: '站内 crystal-attributes Zodiac 字段反向提取（优先35有产品）',
    content_fields_source: '04-内容生产/4.zodiac-compatibility/pairing-data.json（单向导出）',
    content_fields_status: 'coreChallenge / synergy / communicationPattern / scores 已导入',
    last_export: new Date().toISOString(),
    note: '此文件由 export-tool-subset.js 从 pairing-data.json 单向导出。修改差异化内容请编辑 pairing-data.json 后重跑导出，不要直接编辑本文件。',
  },
  matrix,
};

fs.writeFileSync(DST, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ 导出 ${Object.keys(matrix).length} 组工具子集 → ${DST}`);
console.log(`   含字段：基础(phase/score/crystals) + 差异化(coreChallenge/synergy/communicationPattern) + 5维scores`);
