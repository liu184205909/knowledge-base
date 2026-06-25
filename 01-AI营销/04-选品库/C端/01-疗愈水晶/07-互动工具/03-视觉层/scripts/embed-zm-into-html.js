/**
 * 把 zodiac-matrix.json 的完整数据（含差异化字段）嵌入 compatibility-tool.html 的 D.ZM
 *
 * 数据流：07-互动工具/02-数据层/zodiac-matrix.json → compatibility-tool.html (D.ZM 内嵌)
 * 工具完全静态，数据内嵌在 HTML 里
 *
 * 用法：node embed-zm-into-html.js
 */
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.resolve(__dirname, '../compatibility-tool.html');
const MATRIX_FILE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/zodiac-matrix.json';

let html = fs.readFileSync(HTML_FILE, 'utf8');
const matrix = JSON.parse(fs.readFileSync(MATRIX_FILE, 'utf8'));

// 构建新的 ZM 数据（含差异化字段）
const zm = {};
for (const [slug, m] of Object.entries(matrix.matrix)) {
  zm[slug] = {
    signs: m.signs,
    score: m.score,
    band: m.band,
    headline: m.headline,
    desc: m.description,  // HTML 用 desc，matrix 用 description
    phase: m.phase,
    dynamics: m.dynamics,
    crystals: m.crystals,
    coreChallenge: m.coreChallenge,
    synergy: m.synergy,
    communicationPattern: m.communicationPattern,
  };
}

const zmJson = JSON.stringify(zm);

// 精确定位替换：找到 "ZM":{ ... },"ELEM": 的范围
const startMarker = '"ZM":{';
const endMarker = '},"ELEM":';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('❌ 无法找到 ZM 数据标记位');
  process.exit(1);
}

// 拼接：保留 "ZM": 前缀 + 新 JSON + ,"ELEM": 后续
const before = html.slice(0, startIdx + '"ZM":'.length);  // 到 "ZM": 为止
const after = html.slice(endIdx + 1);  // 跳过 }，保留 ,"ELEM":...
html = before + zmJson + after;

fs.writeFileSync(HTML_FILE, html, 'utf8');

// 统计
const oldSize = fs.statSync(HTML_FILE).size;
console.log(`✅ D.ZM 数据已嵌入 → ${HTML_FILE}`);
console.log(`   ${Object.keys(zm).length} 组配对，含差异化字段`);
console.log(`   文件大小：${(oldSize / 1024).toFixed(1)} KB`);

// 抽检
const samples = ['aries-cancer', 'leo-scorpio', 'pisces-pisces'];
console.log(`\n📋 抽检：`);
for (const s of samples) {
  const z = zm[s];
  console.log(`  ${s}: phase=${z.phase}, challenge="${z.coreChallenge.slice(0, 50)}..."`);
}
