/**
 * 30 颗水晶两两配对：计算 435 组评分 + 筛选精选文章清单
 *
 * 筛选规则：
 *   Tier 1（必做）：pairHit=true（站内认可的搭配）
 *   Tier 2（推荐）：score>=85（Excellent，含同脉轮/同元素高分组合）或 (score>=80 且 sharedTags>=1)
 *   Tier 3（差异化）：conflict=true 或 score<40（冲突组合）
 *
 * 输出：
 *   combinations-data-30.json（全部 435 组评分）
 *   selected-articles.json（精选文章清单）
 */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/03-视觉层/crystal-stones-30.json'), 'utf8'));
const STONES = DATA.stones;
const ELEM = DATA.elem;
const CONFLICTS = DATA.conflicts;
const SLUGS = Object.keys(STONES);

const TAG_SCENE = {
  calm: 'Sleep & relaxation', protection: 'Protection & grounding', love: 'Love & relationships',
  abundance: 'Wealth & abundance', 'personal-power': 'Confidence & motivation',
  spiritual: 'Meditation & spiritual growth', 'new-beginnings': 'New beginnings',
};

function isConflict(a, b) {
  return CONFLICTS.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
}

function pairScore(a, b) {
  if (isConflict(a, b)) return { score:25, band:'Conflicting', sharedTags:[], sharedChakras:[], pairHit:false, conflict:true };
  const sa = STONES[a], sb = STONES[b];
  const base = ELEM[sa.element][sb.element];
  const sharedChakras = sa.chakras.filter(c => sb.chakras.includes(c));
  const sharedTags = sa.tags.filter(t => sb.tags.includes(t));
  const pairHit = sa.pairings.includes(b) || sb.pairings.includes(a);
  let score = base + 5*sharedChakras.length + 5*sharedTags.length;
  if (pairHit) score += 15;
  score = Math.min(100, score);
  if (pairHit) score = Math.max(score, 80);
  const band = score>=85?'Excellent':score>=70?'Harmonious':score>=55?'Moderate':score>=40?'Neutral':'Conflicting';
  return { score, band, sharedTags, sharedChakras, pairHit, conflict:false };
}

// 计算 435 组
const all = {};
const selected = {};
let count = 0, selCount = 0;

for (let i = 0; i < SLUGS.length; i++) {
  for (let j = i + 1; j < SLUGS.length; j++) {
    const a = SLUGS[i], b = SLUGS[j];
    const key = `${a}-and-${b}`;
    const r = pairScore(a, b);
    const bestFor = r.sharedTags.map(t => TAG_SCENE[t]).filter(Boolean);

    all[key] = {
      stones: [a, b], stoneNames: [STONES[a].name, STONES[b].name],
      score: r.score, band: r.band, sharedTags: r.sharedTags,
      sharedChakras: r.sharedChakras, pairHit: r.pairHit, conflict: r.conflict,
      bestFor, elements: [STONES[a].element, STONES[b].element],
    };
    count++;

    // 筛选精选
    let tier = null;
    if (r.conflict || r.score < 40) tier = 'T3_conflict';
    else if (r.pairHit) tier = 'T1_pairing';
    else if (r.score >= 85 || (r.score >= 80 && r.sharedTags.length >= 1)) tier = 'T2_highscore';

    if (tier) {
      selected[key] = { ...all[key], tier };
      selCount++;
    }
  }
}

// 输出
const OUT_DIR = path.resolve(__dirname, '..');
fs.writeFileSync(path.join(OUT_DIR, 'combinations-data-30.json'), JSON.stringify({
  _meta: { total: count, stones: SLUGS.length, generated_at: new Date().toISOString() },
  combinations: all,
}, null, 2), 'utf8');

fs.writeFileSync(path.join(OUT_DIR, 'selected-articles.json'), JSON.stringify({
  _meta: { total_selected: selCount, from_total: count, generated_at: new Date().toISOString() },
  tiers: {
    T1_pairing: Object.values(selected).filter(s => s.tier === 'T1_pairing').length,
    T2_highscore: Object.values(selected).filter(s => s.tier === 'T2_highscore').length,
    T3_conflict: Object.values(selected).filter(s => s.tier === 'T3_conflict').length,
  },
  articles: Object.entries(selected).sort((a,b) => {
    const order = { T1_pairing: 0, T2_highscore: 1, T3_conflict: 2 };
    return order[a[1].tier] - order[b[1].tier] || b[1].score - a[1].score;
  }).map(([key, data]) => ({
    slug: key,
    url: `/${key}/`,
    title: `${data.stoneNames[0]} and ${data.stoneNames[1]} Together: Benefits + How to Use`,
    tier: data.tier,
    score: data.score,
    band: data.band,
    stoneNames: data.stoneNames,
    bestFor: data.bestFor,
  })),
}, null, 2), 'utf8');

console.log(`✅ 全部 ${count} 组评分 → combinations-data-30.json`);
console.log(`✅ 精选 ${selCount} 篇文章清单 → selected-articles.json\n`);

// Tier 统计
const tiers = { T1_pairing: 0, T2_highscore: 0, T3_conflict: 0 };
for (const s of Object.values(selected)) tiers[s.tier]++;
console.log(`精选分布：`);
console.log(`  T1 站内认可（pairHit）: ${tiers.T1_pairing} 篇`);
console.log(`  T2 高分+场景（score>=80+tags）: ${tiers.T2_highscore} 篇`);
console.log(`  T3 冲突组合（差异化）: ${tiers.T3_conflict} 篇`);
console.log(`  总计: ${selCount} 篇`);

// Top 10
console.log(`\nTop 10（按 tier + score）：`);
Object.values(selected).sort((a,b) => {
  const order = { T1_pairing: 0, T2_highscore: 1, T3_conflict: 2 };
  return order[a.tier] - order[b.tier] || b.score - a.score;
}).slice(0, 10).forEach(s => {
  console.log(`  [${s.tier}] ${s.stoneNames[0]} + ${s.stoneNames[1]}: ${s.score} ${s.band}`);
});
