/**
 * 分析 266 组未选配对的特征（435 全量 - 169 精选）
 * 用法：node scripts/analyze-unselected.js
 * 输出：band/score 分布 + 高分被卡组 + 中等组画像，供"266 组处理策略"决策
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const sel = JSON.parse(fs.readFileSync(path.join(dir, 'selected-articles.json'), 'utf8'));
const all = JSON.parse(fs.readFileSync(path.join(dir, 'combinations-data-30.json'), 'utf8'));

const selSlugs = new Set(sel.articles.map(a => a.slug));
const combos = all.combinations;
const allKeys = Object.keys(combos);

const selected = [], unselected = [];
for (const k of allKeys) {
  if (selSlugs.has(k)) selected.push(combos[k]);
  else unselected.push({ slug: k, ...combos[k] });
}

console.log(`全量 ${allKeys.length} | 精选 ${selected.length} | 未选 ${unselected.length}\n`);

const bandCount = (arr) => arr.reduce((m, x) => (m[x.band] = (m[x.band] || 0) + 1, m), {});
console.log('未选 band 分布:', JSON.stringify(bandCount(unselected)));
console.log('精选 band 分布:', JSON.stringify(bandCount(selected)), '\n');

const scoreBuckets = { '<40': 0, '40-54': 0, '55-69': 0, '70-84': 0, '85+': 0 };
for (const x of unselected) {
  if (x.score < 40) scoreBuckets['<40']++;
  else if (x.score < 55) scoreBuckets['40-54']++;
  else if (x.score < 70) scoreBuckets['55-69']++;
  else if (x.score < 85) scoreBuckets['70-84']++;
  else scoreBuckets['85+']++;
}
console.log('未选 score 分布:', JSON.stringify(scoreBuckets));
console.log(`未选 sharedTags 非空: ${unselected.filter(x => x.sharedTags.length > 0).length}`);
console.log(`未选 pairHit=true: ${unselected.filter(x => x.pairHit).length}\n`);

const highUnsel = unselected.filter(x => x.score >= 70).sort((a, b) => b.score - a.score);
console.log(`未选 score>=70 (Harmonious/Excellent 但被 sharedTags 卡掉): ${highUnsel.length}`);
console.log('前 20 个高分未选:');
for (const x of highUnsel.slice(0, 20)) {
  console.log(`  ${x.slug}: ${x.score} ${x.band} tags=[${x.sharedTags}] chakras=[${x.sharedChakras}]`);
}

const modUnsel = unselected.filter(x => x.score >= 55 && x.score < 70);
console.log(`\n未选 Moderate(55-69): ${modUnsel.length}, 其中 sharedTags 非空 ${modUnsel.filter(x => x.sharedTags.length > 0).length}`);

const neutUnsel = unselected.filter(x => x.score >= 40 && x.score < 55);
console.log(`未选 Neutral(40-54): ${neutUnsel.length}, 其中 sharedTags 非空 ${neutUnsel.filter(x => x.sharedTags.length > 0).length}`);

// 哪些 stone 在未选里出现最多（= 该石种的"弱搭档"多）
const stoneFreq = {};
for (const x of unselected) for (const s of x.stones) stoneFreq[s] = (stoneFreq[s] || 0) + 1;
console.log('\n未选组合中各石种出现次数:', JSON.stringify(stoneFreq));
