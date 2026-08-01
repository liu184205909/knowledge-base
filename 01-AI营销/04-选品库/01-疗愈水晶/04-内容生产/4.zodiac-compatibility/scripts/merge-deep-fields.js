const fs = require('fs');
const path = require('path');

const PAIRING = path.resolve(__dirname, '../pairing-data.json');
const pd = JSON.parse(fs.readFileSync(PAIRING, 'utf8'));

// 读取 5 个 agent deep 文件，处理两种格式
const deepData = {};
for (let n = 1; n <= 5; n++) {
  const f = path.join(__dirname, `agent${n}-deep.json`);
  if (!fs.existsSync(f)) { console.warn(`Missing: agent${n}-deep.json`); continue; }
  const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
  const data = raw.pairs || raw;
  for (const [slug, fields] of Object.entries(data)) {
    if (slug.startsWith('_') || typeof fields !== 'object' || !fields.relationshipArchetype) continue;
    deepData[slug] = fields;
  }
}

console.log(`Agent deep 数据: ${Object.keys(deepData).length} 组`);

// 合并 + 删 famousCouples
let merged = 0, missing = [];
for (const [slug, p] of Object.entries(pd.pairs)) {
  // 删 famousCouples
  if (p.famousCouples) delete p.famousCouples;

  const d = deepData[slug];
  if (d) {
    p.relationshipArchetype = d.relationshipArchetype;
    p.conflictLoop = d.conflictLoop;
    p.repairMove = d.repairMove;
    p.crystalStrategy = d.crystalStrategy;
    p.avoidCrystal = d.avoidCrystal;
    p.ritualAngle = d.ritualAngle;
    merged++;
  } else {
    missing.push(slug);
  }
}

pd._meta.last_updated = new Date().toISOString();
pd._meta.deep_fields_added = `${merged}/78`;
fs.writeFileSync(PAIRING, JSON.stringify(pd, null, 2), 'utf8');

console.log(`\n✅ 合并完成: ${merged}/78`);
if (missing.length > 0) console.log(`⚠️ 缺失 ${missing.length} 组: ${missing.join(', ')}`);

// 验证 famousCouples 已删
const fc = Object.values(pd.pairs).filter(p => p.famousCouples).length;
console.log(`famousCouples 残留: ${fc}`);

// 抽检
const samples = ['aries-cancer', 'leo-scorpio', 'pisces-pisces'];
console.log(`\n📋 抽检:`);
for (const s of samples) {
  const p = pd.pairs[s];
  if (!p) continue;
  console.log(`  ${s}:`);
  console.log(`    archetype: ${p.relationshipArchetype}`);
  console.log(`    conflictLoop: ${p.conflictLoop}`);
  console.log(`    crystalStrategy: ${p.crystalStrategy}`);
}
