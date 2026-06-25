/**
 * 星座×星座兼容矩阵（Tab A「By Zodiac」）— 12×12=78 组
 *
 * 依据：占星 synastry 传统（元素 + 黄道相位），非凭空编。
 * 相位评分：trine(120°同元素)最和谐 / sextile(60°)友好 / opposition(180°)吸引-紧张 / square(90°)摩擦成长
 * 水晶推荐：站内 crystal-attributes Zodiac 字段反向提取 + 调和水晶（按关系紧张度）
 */
const fs = require('fs');
const ATTR = JSON.parse(fs.readFileSync('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/crystal-attributes.json', 'utf8'));

const ORDER = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const ZODIAC = {
  aries:{element:'fire',mode:'cardinal'}, taurus:{element:'earth',mode:'fixed'}, gemini:{element:'air',mode:'mutable'},
  cancer:{element:'water',mode:'cardinal'}, leo:{element:'fire',mode:'fixed'}, virgo:{element:'earth',mode:'mutable'},
  libra:{element:'air',mode:'cardinal'}, scorpio:{element:'water',mode:'fixed'}, sagittarius:{element:'fire',mode:'mutable'},
  capricorn:{element:'earth',mode:'cardinal'}, aquarius:{element:'air',mode:'fixed'}, pisces:{element:'water',mode:'mutable'}
};
const LABEL = {aries:'Aries',taurus:'Taurus',gemini:'Gemini',cancer:'Cancer',leo:'Leo',virgo:'Virgo',libra:'Libra',scorpio:'Scorpio',sagittarius:'Sagittarius',capricorn:'Capricorn',aquarius:'Aquarius',pisces:'Pisces'};

// 黄道相位（min(d,12-d)）
function phase(i, j) { let d = Math.abs(i - j); return Math.min(d, 12 - d); }

// 相位 → 评分/定性/文案（占星 synastry 传统）
const PHASE = {
  0: { name:'Conjunction', score:76, band:'Harmonious', headline:'Mirror Souls',
       desc:'Same sign — you reflect each other deeply. Comfort and understanding come naturally, though a touch too much sameness can stall growth. Crystals that support both individuality and togetherness keep the spark alive.' },
  1: { name:'Semi-sextile', score:62, band:'Moderate', headline:'Gentle Neighbors',
       desc:'Adjacent signs with subtle differences. A quiet, easygoing bond that grows with patience — neither electric nor dull, just steady.' },
  2: { name:'Sextile', score:80, band:'Harmonious', headline:'Natural Allies',
       desc:'Complementary elements (fire-air or earth-water) that spark each other forward. Friendship and flow come easily — a supportive, energizing match.' },
  3: { name:'Square', score:43, band:'Neutral', headline:'Growth Through Tension',
       desc:'Same mode, clashing needs — friction is real, but so is the chemistry. This pairing demands work yet rewards it with deep mutual growth.' },
  4: { name:'Trine', score:91, band:'Excellent', headline:'Powerful Synergy',
       desc:'Same element — souls that speak the same language. Effortless understanding and natural harmony; the easiest, most instinctive connection.' },
  5: { name:'Quincunx', score:51, band:'Neutral', headline:'Delicate Balance',
       desc:'Signs that don\'t quite understand each other. Requires conscious adjustment and curiosity — fascinating but never automatic.' },
  6: { name:'Opposition', score:67, band:'Moderate', headline:'Magnetic Opposites',
       desc:'Opposite signs — instant attraction, mirror-image needs. You complete each other, but balancing the tension takes awareness. Passionate and transformative.' }
};

// 从站内 Zodiac 字段反向提取每星座的水晶（优先 35 有产品的核心石种）
const STONES35 = new Set(['amethyst','tiger-eye','jade','rose-quartz','carnelian','labradorite','moonstone','obsidian','black-tourmaline','quartz','amazonite','aventurine','selenite','turquoise','lapis','fluorite','ruby','citrine','red-jasper','opal','bloodstone','hematite','lepidolite','malachite','kyanite','larimar','rhodonite','apatite','shungite','chrysocolla','angelite','pyrite','serpentine','herkimer-diamond','prehnite','garnet','aquamarine','smoky-quartz','sodalite','sunstone','topaz','tourmaline','tanzanite','morganite','iolite','peridot','amber','emerald']);
const ZOD_CRYSTALS = {};
for (const z of ORDER) ZOD_CRYSTALS[z] = [];
for (const [k, v] of Object.entries(ATTR.crystals)) {
  const slug = v.slug.replace(/-meaning$/, '');
  const zods = (v.overview.Zodiac || '').toLowerCase();
  for (const z of ORDER) {
    if (zods.includes(z) && STONES35.has(slug)) ZOD_CRYSTALS[z].push(slug);
  }
}
function pickCrystal(z, exclude) {
  const list = (ZOD_CRYSTALS[z] || []).filter(c => c !== exclude);
  return list[0] || 'clear-quartz';
}

// 调和水晶（按关系紧张度）
function harmonyCrystal(phaseD) {
  if (phaseD === 3 || phaseD === 5 || phaseD === 6) return 'rose-quartz'; // 紧张→柔化
  if (phaseD === 0) return 'black-tourmaline'; // 同星座→差异化 grounding
  return 'quartz'; // 和谐→放大
}

// 生成 78 组（i<=j，A↔B 对称）
const matrix = {};
let count = 0;
for (let i = 0; i < 12; i++) {
  for (let j = i; j < 12; j++) {
    const a = ORDER[i], b = ORDER[j];
    const d = phase(i, j);
    const p = PHASE[d];
    const ca = pickCrystal(a), cb = pickCrystal(b, ca);
    const harmony = harmonyCrystal(d);
    const key = `${a}-${b}`;
    matrix[key] = {
      signs: [LABEL[a], LABEL[b]],
      elements: [ZODIAC[a].element, ZODIAC[b].element],
      phase: p.name,
      score: p.score,
      band: p.band,
      headline: p.headline,
      description: p.desc,
      crystals: { signA: ca, signB: cb, harmony }
    };
    count++;
  }
}

const out = {
  _meta: {
    type: 'Zodiac × Zodiac compatibility matrix (Tab A)',
    basis: '占星 synastry 传统（元素 + 黄道相位）',
    total_pairs: count,
    score_basis: 'phase score (trine91/sextile80/conj76/opp67/semi62/quincunx51/square43)',
    crystal_source: '站内 crystal-attributes Zodiac 字段反向提取（优先35有产品）'
  },
  matrix
};
fs.writeFileSync('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/zodiac-matrix.json', JSON.stringify(out, null, 2), 'utf8');

console.log('=== 星座矩阵生成（' + count + ' 组）===\n');
console.log('星座→站内水晶映射（前几例）:');
for (const z of ['aries','leo','libra','scorpio','pisces']) console.log(`  ${LABEL[z]}: ${ZOD_CRYSTALS[z].slice(0,4).join(', ') || '(站内无标注)'} (共${ZOD_CRYSTALS[z].length})`);

console.log('\n=== 经典配对测试 ===');
const tests = [
  ['aries','leo','同火元素 trine 应最高'],
  ['aries','sagittarius','同火元素 trine'],
  ['aries','libra','对宫 opposition'],
  ['aries','cancer','刑 square'],
  ['aries','gemini','六合 sextile'],
  ['taurus','scorpio','对宫'],
  ['cancer','capricorn','对宫'],
  ['leo','aquarius','对宫'],
  ['pisces','scorpio','同水 trine']
];
for (const [x, y, note] of tests) {
  const k = ORDER.indexOf(x) <= ORDER.indexOf(y) ? `${x}-${y}` : `${y}-${x}`;
  const m = matrix[k];
  console.log(`${LABEL[x].padEnd(13)} × ${LABEL[y].padEnd(13)} = ${String(m.score).padStart(2)} [${m.band.padEnd(12)}] ${m.phase.padEnd(13)} ${m.headline}  | ${note}`);
  console.log(`    水晶: ${m.crystals.signA}, ${m.crystals.signB}, 调和:${m.crystals.harmony}`);
}
console.log('\n输出: zodiac-matrix.json (', count, '组)');
