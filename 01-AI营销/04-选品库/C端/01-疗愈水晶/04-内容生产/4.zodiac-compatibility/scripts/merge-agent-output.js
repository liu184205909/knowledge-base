/**
 * 合并 5 个 agent 输出到 pairing-data.json
 *
 * 读取：
 *   - pairing-data.json（78 组骨架）
 *   - agent{1-5}-output.json（差异化字段）
 *
 * 写回：
 *   - pairing-data.json（合并后的完整 78 组）
 *
 * 用法：node merge-agent-output.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAIRING_FILE = path.join(ROOT, 'pairing-data.json');

const pairing = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));

const agentFiles = [1, 2, 3, 4, 5].map(n =>
  path.join(__dirname, `agent${n}-output.json`)
);

// 收集所有 agent 输出
const agentData = {};
for (const f of agentFiles) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [slug, fields] of Object.entries(data)) {
    if (agentData[slug]) {
      console.warn(`⚠️  重复 slug: ${slug}（来自多个 agent）`);
    }
    agentData[slug] = fields;
  }
}

console.log(`📊 Agent 输出合并：共 ${Object.keys(agentData).length} 组`);

// 合并到 pairing-data.json
let merged = 0, missing = 0, skipped = 0;
const allSlugs = Object.keys(pairing.pairs);
const agentSlugs = Object.keys(agentData);

// 检查覆盖
for (const slug of allSlugs) {
  if (!agentData[slug]) {
    console.warn(`⚠️  pairing 有但 agent 没生成: ${slug}`);
    missing++;
    continue;
  }
  const a = agentData[slug];
  // 合并字段（只更新 3 个差异化字段 + 可选 scores）
  if (a.coreChallenge) { pairing.pairs[slug].coreChallenge = a.coreChallenge; }
  if (a.synergy) { pairing.pairs[slug].synergy = a.synergy; }
  if (a.communicationPattern) { pairing.pairs[slug].communicationPattern = a.communicationPattern; }
  // 如果 agent 微调了 scores，覆盖
  if (a.scores) { pairing.pairs[slug].scores = { ...pairing.pairs[slug].scores, ...a.scores }; }
  merged++;
}

// 反向检查：agent 多生成的不在 pairing 里
for (const slug of agentSlugs) {
  if (!pairing.pairs[slug]) {
    console.warn(`⚠️  agent 多生成的不在 pairing: ${slug}`);
    skipped++;
  }
}

// 更新 meta
pairing._meta.last_updated = new Date().toISOString();
pairing._meta.content_fields_status = {
  coreChallenge: `${merged}/${allSlugs.length} 已填`,
  synergy: `${merged}/${allSlugs.length} 已填`,
  communicationPattern: `${merged}/${allSlugs.length} 已填`,
  famousCouples: '0/78（待建名人×星座映射表）',
};

// 写回
fs.writeFileSync(PAIRING_FILE, JSON.stringify(pairing, null, 2), 'utf8');

console.log(`\n✅ 合并完成`);
console.log(`   合并 ${merged} 组 / 缺失 ${missing} / 多余 ${skipped}`);
console.log(`   输出 → ${PAIRING_FILE}`);

// 质量抽检：打印 3 组示例
const samples = ['aries-cancer', 'leo-scorpio', 'pisces-pisces'];
console.log(`\n📋 质量抽检（3 组）：`);
for (const s of samples) {
  const p = pairing.pairs[s];
  if (!p) continue;
  console.log(`\n  ${s} (${p.phase}, score ${p.score}):`);
  console.log(`    coreChallenge: ${p.coreChallenge ? p.coreChallenge.slice(0, 100) + '...' : '【空】'}`);
  console.log(`    synergy: ${p.synergy ? p.synergy.slice(0, 100) + '...' : '【空】'}`);
  console.log(`    communicationPattern: ${p.communicationPattern ? p.communicationPattern.slice(0, 100) + '...' : '【空】'}`);
}
