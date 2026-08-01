/**
 * Angel Numbers 图片 prompt 生成（3张/篇：hero + crystal-grid + numerology）
 * hero: 号码视觉化（专用，允许文字）
 * crystal-grid: 5颗水晶组合（scene，无文字，可复用共享脚本或专用）
 * numerology: 数字拆解示意图（专用，允许文字）
 * hub 页 hero 用"Angel Numbers"字样
 * 用法：node generate-image-prompts.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const config = require('../../../07-互动工具/_shared/angel-numbers-config.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const GEN = 'assets/images/generated/9.angel-numbers';

const DISPLAY_NAME_OVERRIDES = { quartz: 'Clear Quartz' };
function stoneName(slug) {
  if (DISPLAY_NAME_OVERRIDES[slug]) return DISPLAY_NAME_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

let n = 0;
for (const art of idx.articles) {
  const f = path.join(DIR, 'articles', art.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const cfg = config.numbers.find(c => c.slug === art.slug) || config.numbers.find(c => `${c.number}-angel-number-meaning` === art.slug);
  if (!cfg) continue;

  const num = art.number;
  const isHub = art.is_hub;

  // top5 水晶名
  const top5 = ['best_overall', 'best_love', 'best_protection', 'best_manifestation', 'best_daily_wear']
    .map(r => cfg.crystals[r] ? stoneName(cfg.crystals[r].slug) : '')
    .filter(Boolean).join(', ');

  // hero（号码视觉化）
  const focalText = isHub ? 'the words "Angel Numbers"' : `the digits "${num}"`;
  const numLabel = isHub ? 'the Angel Numbers guide' : `angel number ${num}`;
  const heroAlt = `A spiritual artwork for ${numLabel}: ${focalText} rendered as a luminous central focal point in elegant glowing golden typography radiating warm light, surrounded by delicate arrangements of ${top5.split(',')[0] || 'healing crystals'} and subtle sacred geometry, ethereal cosmic background in deep indigo and gold tones, floating light particles, premium editorial spiritual design`;

  // crystal-grid（5颗水晶组合，无文字，scene）
  const crystalAlt = `Five healing crystals for angel number ${num} — ${top5} — arranged in a balanced sacred geometry composition on a soft cloth, warm natural light, calm muted background with subtle floral accents, editorial crystal photography, no text`;

  // numerology（数字拆解示意，允许文字）
  const sd = cfg.numerology.single_digit;
  const rs = cfg.numerology.reduced_sum;
  const numerologyAlt = `A clean numerology breakdown infographic for angel number ${num}: showing ${rs} reducing to the single digit ${sd}, the number ${num} displayed prominently at top in elegant golden typography with reduction steps below, minimalist sacred geometry frame, deep indigo background with gold accents, spiritual educational diagram style`;

  a.images = {
    hero: { file: `${GEN}/${art.slug}/${art.slug}-hero.webp`, source_type: 'number-hero', alt: heroAlt },
    'crystal-grid': { file: `${GEN}/${art.slug}/${art.slug}-crystal-grid.webp`, source_type: 'scene', alt: crystalAlt },
    numerology: { file: `${GEN}/${art.slug}/${art.slug}-numerology.webp`, source_type: 'number-diagram', alt: numerologyAlt },
  };
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  n++;
}
console.log(`✅ ${n} 篇写入 3 图 prompt（hero + crystal-grid + numerology）`);
