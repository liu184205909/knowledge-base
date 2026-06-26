/**
 * 水晶配对 207 篇 → images 字段（两石物理在一起 prompt，非并排拼图）
 * 每篇 3 图：featured（两石同场景 16:9）/ crystal_pair（两石近景同构图）/ how_to_use（两石佩戴/摆放）
 * alt 含两石颜色+形态（从 crystal-attributes），source_type 控摄影风格
 * 用法：node scripts/generate-image-prompts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES = path.join(ROOT, 'articles');
const sel = JSON.parse(fs.readFileSync(path.join(ROOT, 'selected-articles.json'), 'utf8'));
const combos = JSON.parse(fs.readFileSync(path.join(ROOT, 'combinations-data-30.json'), 'utf8')).combinations;
const ATTR = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/_shared/crystal-attributes.json'), 'utf8')).crystals;

const cap = s => s.split(/[- ]/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// 颜色+形态描述（让 gpt-image-2 准确识石）
function stoneDesc(slug) {
  const a = ATTR[slug + '-meaning'];
  if (!a || !a.overview) return cap(slug);
  const color = (a.overview.Color || '').toLowerCase().split(/[,;]/)[0].trim();
  const forms = (a.overview.Forms || '').toLowerCase().split(/[,;]/)[0].trim();
  return `${color} ${cap(slug)}${forms ? ' (' + forms + ')' : ''}`;
}

let n = 0;
for (const meta of sel.articles) {
  const f = path.join(ARTICLES, meta.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const c = combos[meta.slug];
  if (!c) continue;
  const [aSlug, bSlug] = c.stones;
  const aDesc = stoneDesc(aSlug), bDesc = stoneDesc(bSlug);
  const aName = cap(aSlug), bName = cap(bSlug);

  a.images = {
    featured: {
      file: `assets/images/generated/5.crystal-combinations/${meta.slug}/${meta.slug}-featured.webp`,
      source_type: 'scene',
      alt: `${aDesc} and ${bDesc} crystals placed together touching on a warm wooden surface, both stones in a single composition side by side, soft natural light, editorial product photography`,
    },
    crystal_pair: {
      file: `assets/images/generated/5.crystal-combinations/${meta.slug}/${meta.slug}-crystal-pair.webp`,
      source_type: 'closeup',
      alt: `A macro close-up of ${aDesc} and ${bDesc} crystals arranged together in one frame, both stones touching, fine surface textures visible, soft even studio light`,
    },
    how_to_use: {
      file: `assets/images/generated/5.crystal-combinations/${meta.slug}/${meta.slug}-how-to-use.webp`,
      source_type: 'lifestyle',
      alt: `${aName} and ${bName} crystal bracelets worn together stacked on one wrist, real hand, natural daylight, minimalist wellness lifestyle scene`,
    },
  };
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  n++;
}
console.log(`✅ ${n} 篇写入 images（两石物理在一起 alt）→ 下步 generate-crystal-images.js 生图`);
