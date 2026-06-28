/**
 * Angel Numbers 图片 prompt 生成
 * hero: 号码视觉化 graphic（数字为主+水晶+灵性美学，允许文字，source_type=number-hero）
 * 水晶图: 复用 390 图库，不重生
 * 用法：node generate-image-prompts.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const config = require('../../../07-互动工具/_shared/angel-numbers-config.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const GEN = 'assets/images/generated/9.angel-numbers';

// 线上特殊 slug → 标准显示名（同 generate-articles.js）
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
  const cfg = config.numbers.find(c => c.slug === art.slug);
  if (!cfg) continue;
  // top3 水晶名（干净显示名，无 & Uses 后缀）
  const top3 = ['best_overall', 'best_love', 'best_manifestation']
    .map(r => cfg.crystals[r] ? stoneName(cfg.crystals[r].slug) : '')
    .filter(Boolean).join(', ');
  const num = art.number;
  // hub 页画 "Angel Numbers" 字样（短可画），数字页画具体数字
  const isHub = art.is_hub;
  const focalText = isHub ? 'the words "Angel Numbers"' : `the digits "${num}"`;
  const numLabel = isHub ? 'the Angel Numbers guide' : `angel number ${num}`;
  // 号码视觉化：文字/数字为发光主体 + 水晶环绕 + 灵性美学
  a.images = {
    hero: {
      file: `${GEN}/${art.slug}/${art.slug}-hero.webp`,
      source_type: 'number-hero',
      alt: `A spiritual artwork for ${numLabel}: ${focalText} rendered as a luminous central focal point in elegant glowing golden typography radiating warm light, surrounded by delicate arrangements of ${top3} crystals and subtle sacred geometry, ethereal cosmic background in deep indigo and gold tones, floating light particles, premium editorial spiritual design`,
    },
  };
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  n++;
}
console.log(`✅ ${n} 篇写入 hero 图片 prompt（号码视觉化 graphic 风格）`);
