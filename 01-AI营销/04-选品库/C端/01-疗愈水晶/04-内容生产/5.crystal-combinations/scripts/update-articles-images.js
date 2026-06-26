/**
 * 给 207 篇 JSON 写 images 字段（file 路径 + alt），指向合成图
 * 图在 02-网站规划/assets/images/generated/5.crystal-combinations/{slug}/
 */
const fs = require('fs'), p = require('path');
const sel = JSON.parse(fs.readFileSync(p.join(__dirname, '..', 'selected-articles.json'), 'utf8'));
const BASE = '02-网站规划/assets/images/generated/5.crystal-combinations';
let cnt = 0;
for (const art of sel.articles) {
  const f = p.join(__dirname, '..', 'articles', art.slug + '.json');
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const [na, nb] = art.stoneNames;
  a.images = {
    featured: { file: `${BASE}/${art.slug}/${art.slug}-featured.webp`, alt: `${na} and ${nb} crystals paired together` },
    crystal_pair: { file: `${BASE}/${art.slug}/${art.slug}-crystal-pair.webp`, alt: `${na} and ${nb} combination for crystal pairing` },
    how_to_use: { file: `${BASE}/${art.slug}/${art.slug}-how-to-use.webp`, alt: `How to wear ${na} and ${nb} together` },
  };
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  cnt++;
}
console.log(`✅ ${cnt} 篇 images 字段写入完成`);
console.log(`   示例: ${BASE}/amethyst-and-selenite/amethyst-and-selenite-featured.webp`);
