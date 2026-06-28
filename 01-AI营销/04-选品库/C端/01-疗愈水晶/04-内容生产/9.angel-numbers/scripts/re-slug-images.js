/**
 * 重命名图片目录+文件：oldSlug → newSlug（匹配 re-slug-articles）
 * 9.angel-numbers/{oldSlug}/{oldSlug}-hero.webp → {newSlug}/{newSlug}-hero.webp
 * hub 保持
 * 用法：node re-slug-images.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const config = require('../../../07-互动工具/_shared/angel-numbers-config.json');
const GEN_DIR = path.resolve(__dirname, '../../../02-网站规划/assets/images/generated/9.angel-numbers');

const slugMap = {};
for (const cfg of config.numbers) {
  slugMap[cfg.slug] = cfg.is_hub ? cfg.slug : `${cfg.number}-angel-number-meaning`;
}
let renamed = 0;
for (const [old, ns] of Object.entries(slugMap)) {
  if (old === ns) continue;
  const oldDir = path.join(GEN_DIR, old);
  const newDir = path.join(GEN_DIR, ns);
  if (!fs.existsSync(oldDir)) { console.log('⚠️ 无旧目录:', old); continue; }
  // 重命名目录
  if (fs.existsSync(newDir)) {
    // 新目录已存在（可能部分），合并文件
    for (const f of fs.readdirSync(oldDir)) {
      const nf = f.replace(new RegExp('^' + old), ns);
      fs.renameSync(path.join(oldDir, f), path.join(newDir, nf));
    }
    fs.rmdirSync(oldDir);
  } else {
    fs.renameSync(oldDir, newDir);
    // 重命名目录内文件
    for (const f of fs.readdirSync(newDir)) {
      if (f.startsWith(old)) {
        fs.renameSync(path.join(newDir, f), path.join(newDir, f.replace(new RegExp('^' + old), ns)));
      }
    }
  }
  renamed++;
}
console.log(`✅ 重命名 ${renamed} 个图片目录`);
