/**
 * 生成 66 组水晶配对数据
 * 12 颗核心水晶两两组合，用 compatibility-engine 的评分逻辑
 *
 * 输出：../combinations-data.json（66 组）
 * 用法：node generate-combinations-data.js
 */
const fs = require('fs');
const path = require('path');

// ─── 12 颗核心水晶数据（从 compatibility-tool.html D.STONES 提取）───
const STONES = {
  amethyst:        { name:'Amethyst',       element:'air',   chakras:['crown','third-eye'],                    tags:['calm','protection','spiritual'],            pairings:['rose-quartz','clear-quartz','black-tourmaline'], meaning:'/gemstone/amethyst-meaning/' },
  'rose-quartz':   { name:'Rose Quartz',    element:'earth', chakras:['heart'],                                tags:['love'],                                     pairings:['amethyst','clear-quartz','moonstone'],           meaning:'/gemstone/rose-quartz-meaning/' },
  quartz:          { name:'Clear Quartz',   element:'ether', chakras:[],                                       tags:['spiritual','personal-power'],               pairings:['amethyst','rose-quartz','citrine'],              meaning:'/gemstone/quartz-meaning/' },
  citrine:         { name:'Citrine',        element:'fire',  chakras:['solar-plexus','sacral'],                tags:['abundance','personal-power'],               pairings:['amethyst'],                                       meaning:'/gemstone/citrine-meaning/' },
  'black-tourmaline':{name:'Black Tourmaline',element:'earth',chakras:['root'],                                tags:['protection'],                               pairings:['selenite','rose-quartz','quartz'],                meaning:'/gemstone/black-tourmaline-meaning/' },
  carnelian:       { name:'Carnelian',      element:'fire',  chakras:['sacral','solar-plexus','root'],         tags:['personal-power'],                           pairings:['citrine','amethyst'],                             meaning:'/gemstone/carnelian-meaning/' },
  selenite:        { name:'Selenite',       element:'air',   chakras:['crown','third-eye'],                    tags:['calm','protection','spiritual','personal-power'], pairings:['black-tourmaline','amethyst','clear-quartz','rose-quartz'], meaning:'/gemstone/selenite-meaning/' },
  moonstone:       { name:'Moonstone',      element:'water', chakras:['third-eye','crown','sacral'],           tags:['calm','spiritual','new-beginnings'],        pairings:['rose-quartz'],                                    meaning:'/gemstone/moonstone-meaning/' },
  'tiger-eye':     { name:"Tiger's Eye",    element:'fire',  chakras:['solar-plexus','root','sacral'],         tags:['protection','personal-power'],              pairings:['citrine','black-tourmaline'],                     meaning:'/gemstone/tiger-eye-meaning/' },
  labradorite:     { name:'Labradorite',    element:'water', chakras:['throat','third-eye'],                   tags:['protection','spiritual','personal-power','new-beginnings'], pairings:['moonstone','black-tourmaline','amethyst','quartz'], meaning:'/gemstone/labradorite-meaning/' },
  pyrite:          { name:'Pyrite',         element:'fire',  chakras:['solar-plexus'],                         tags:['abundance','personal-power'],               pairings:['citrine','carnelian','quartz'],                   meaning:'/gemstone/pyrite-meaning/' },
  jade:            { name:'Jade',           element:'earth', chakras:['heart'],                                tags:['calm','abundance','spiritual'],             pairings:['rose-quartz','quartz','amethyst','citrine'],      meaning:'/gemstone/jade-meaning/' },
};

const SLUGS = Object.keys(STONES);

// ─── 元素矩阵 ───
const ELEM = {
  fire:  { fire:85, water:35, earth:55, air:80, ether:65 },
  water: { fire:35, water:85, earth:80, air:50, ether:65 },
  earth: { fire:55, water:80, earth:85, air:55, ether:65 },
  air:   { fire:80, water:50, earth:55, air:85, ether:65 },
  ether: { fire:65, water:65, earth:65, air:65, ether:75 },
};

// ─── 冲突库（12 颗内的 3 组）───
const CONFLICTS = [
  ['carnelian','amethyst'],
  ['moonstone','citrine'],
  ['black-tourmaline','jade'],
];

function isConflict(a, b) {
  return CONFLICTS.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
}

// ─── 评分逻辑（复用 compatibility-engine.js）───
function pairScore(slugA, slugB) {
  if (isConflict(slugA, slugB)) {
    return { score:25, band:'Conflicting', reasons:['⚠ Traditional conflict — energies pull in opposite directions'], sharedTags:[], sharedChakras:[], pairHit:false, conflict:true };
  }
  const a = STONES[slugA], b = STONES[slugB];
  const ea = a.element, eb = b.element;
  const base = ELEM[ea][eb];
  const reasons = [`Element ${ea} × ${eb} = ${base}`];

  const sharedChakras = a.chakras.filter(c => b.chakras.includes(c));
  if (sharedChakras.length) { reasons.push(`Shared chakras +${5*sharedChakras.length} (${sharedChakras.join(', ')})`); }

  const sharedTags = a.tags.filter(t => b.tags.includes(t));
  if (sharedTags.length) { reasons.push(`Intention synergy +${5*sharedTags.length} (${sharedTags.join(', ')})`); }

  const pairHit = a.pairings.includes(slugB) || b.pairings.includes(slugA);
  if (pairHit) { reasons.push('Recommended pairing +15'); }

  let score = base + 5*sharedChakras.length + 5*sharedTags.length;
  if (pairHit) score += 15;
  score = Math.min(100, score);
  if (pairHit) score = Math.max(score, 80);

  const band = score>=85?'Excellent':score>=70?'Harmonious':score>=55?'Moderate':score>=40?'Neutral':'Conflicting';

  return { score, band, reasons, sharedTags, sharedChakras, pairHit, conflict:false };
}

// ─── Best For 映射（intention → 场景）───
const TAG_TO_SCENE = {
  calm: 'Sleep & relaxation',
  protection: 'Protection & grounding',
  love: 'Love & relationships',
  abundance: 'Wealth & abundance',
  'personal-power': 'Confidence & motivation',
  spiritual: 'Meditation & spiritual growth',
  'new-beginnings': 'New beginnings & transformation',
};

// ─── 生成 66 组 ───
const combinations = {};
let count = 0;

for (let i = 0; i < SLUGS.length; i++) {
  for (let j = i + 1; j < SLUGS.length; j++) {
    const a = SLUGS[i], b = SLUGS[j];
    const key = `${a}-and-${b}`;
    const r = pairScore(a, b);

    // Best For（基于共享 tags）
    const bestFor = r.sharedTags.map(t => TAG_TO_SCENE[t]).filter(Boolean);

    // 如果没有共享 tags，用元素互动推场景
    if (bestFor.length === 0 && !r.conflict) {
      const ea = STONES[a].element, eb = STONES[b].element;
      if ((ea==='fire'||eb==='fire') && (ea==='air'||eb==='air')) bestFor.push('Energy & motivation');
      if ((ea==='earth'||eb==='earth') && (ea==='water'||eb==='water')) bestFor.push('Emotional stability');
      if (ea===eb) bestFor.push(`Amplified ${ea} energy`);
    }

    combinations[key] = {
      url: `/crystal-combinations/${key}/`,
      slug: key,
      stones: [a, b],
      stoneNames: [STONES[a].name, STONES[b].name],
      score: r.score,
      band: r.band,
      reasons: r.reasons,
      sharedTags: r.sharedTags,
      sharedChakras: r.sharedChakras || [],
      pairHit: r.pairHit,
      conflict: r.conflict || false,
      bestFor: bestFor,
      elements: [STONES[a].element, STONES[b].element],
    };
    count++;
  }
}

const output = {
  _meta: {
    type: 'Crystal × Crystal combination data (66 pairs)',
    purpose: 'Article content source for /crystal-combinations/{a}-and-{b}/ pages',
    total_pairs: count,
    stones_count: SLUGS.length,
    stones: SLUGS,
    generated_at: new Date().toISOString(),
    score_basis: 'element matrix + shared chakras + shared intentions + pairing hits',
    conflict_pairs: CONFLICTS.length,
  },
  combinations,
};

const OUT = path.resolve(__dirname, '../combinations-data.json');
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');

console.log(`✅ 生成 ${count} 组水晶配对数据 → ${OUT}`);

// 统计
const bands = {};
for (const c of Object.values(combinations)) {
  bands[c.band] = (bands[c.band]||0) + 1;
}
console.log('\n分档统计：');
Object.entries(bands).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v} 组`));

// 抽检
console.log('\n抽检：');
['amethyst-and-citrine','rose-quartz-and-amethyst','carnelian-and-amethyst','black-tourmaline-and-selenite'].forEach(k => {
  const c = combinations[k];
  if (c) console.log(`  ${k}: ${c.score}/100 ${c.band} | Best for: ${c.bestFor.join(', ') || 'N/A'}`);
});
