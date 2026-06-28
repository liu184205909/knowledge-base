/**
 * Re-slug 天使号码文章：纯数字 slug → {number}-angel-number-meaning
 * 保留已填充 content，只改 slug/url/related内链 + 文件名 + index
 * hub 页(angel-numbers-guide等)保持原 slug（已非纯数字）
 * 图片目录不动（hero.file 仍指向旧目录，upload能找到）
 * 用法：node re-slug-articles.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const config = require('../../../07-互动工具/_shared/angel-numbers-config.json');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));

// 建 oldSlug → newSlug 映射
const slugMap = {};
for (const cfg of config.numbers) {
  const old = cfg.slug;
  const isNew = cfg.is_hub ? old : `${cfg.number}-angel-number-meaning`;
  slugMap[old] = isNew;
}
console.log('映射数:', Object.keys(slugMap).length);

const newIndex = [];
let renamed = 0;
for (const art of idx.articles) {
  const old = art.slug;
  const ns = slugMap[old];
  if (!ns) { console.log('⚠️ 无映射:', old); continue; }
  const oldFile = path.join(DIR, 'articles', old + '.json');
  if (!fs.existsSync(oldFile)) { console.log('⚠️ 无文件:', old); continue; }
  const a = JSON.parse(fs.readFileSync(oldFile, 'utf8'));

  // 改 slug + url
  a.slug = ns;
  a.url = `/${ns}/`;

  // content 里替换所有 related 内链 /angel-numbers/{oldX}/ → /{newX}/
  let content = a.content;
  for (const [o, n] of Object.entries(slugMap)) {
    content = content.split('/angel-numbers/' + o + '/').join('/' + n + '/');
  }
  a.content = content;

  // 写新文件名 + 删旧
  fs.writeFileSync(path.join(DIR, 'articles', ns + '.json'), JSON.stringify(a, null, 2), 'utf8');
  if (old !== ns) { fs.unlinkSync(oldFile); renamed++; }

  newIndex.push({ slug: ns, number: art.number, is_hub: art.is_hub, title: art.title, theme: art.theme });
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: newIndex.length, articles: newIndex }, null, 2), 'utf8');
console.log(`✅ re-slug ${newIndex.length} 篇，重命名 ${renamed} 个文件`);
console.log('示例:', newIndex.slice(0, 3).map(a => a.slug).join(', '));
