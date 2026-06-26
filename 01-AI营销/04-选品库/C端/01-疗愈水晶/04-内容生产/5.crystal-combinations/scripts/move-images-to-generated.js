/**
 * 把 images/{slug}/{featured,pair,how_to_use}.webp 移到 assets/images/generated/articles/{slug}/{slug}-{type}.webp
 * 跟星座配对 gemini-virto 结构一致，删旧 images/
 */
const fs = require('fs');
const path = require('path');

const OLD = path.join(__dirname, '..', 'images');
const NEW = path.join(__dirname, '..', 'assets', 'images', 'generated', 'articles');

if (!fs.existsSync(OLD)) { console.log('images/ 不存在，跳过'); process.exit(0); }

fs.mkdirSync(NEW, { recursive: true });

let cnt = 0;
for (const slug of fs.readdirSync(OLD)) {
  const oldDir = path.join(OLD, slug);
  if (!fs.statSync(oldDir).isDirectory()) continue;
  const newDir = path.join(NEW, slug);
  fs.mkdirSync(newDir, { recursive: true });

  // featured.webp → {slug}-featured.webp
  if (fs.existsSync(path.join(oldDir, 'featured.webp')))
    fs.copyFileSync(path.join(oldDir, 'featured.webp'), path.join(newDir, slug + '-featured.webp'));
  // pair.webp → {slug}-crystal-pair.webp（跟星座配对 crystal_pair 一致）
  if (fs.existsSync(path.join(oldDir, 'pair.webp')))
    fs.copyFileSync(path.join(oldDir, 'pair.webp'), path.join(newDir, slug + '-crystal-pair.webp'));
  // how_to_use.webp → {slug}-how-to-use.webp
  if (fs.existsSync(path.join(oldDir, 'how_to_use.webp')))
    fs.copyFileSync(path.join(oldDir, 'how_to_use.webp'), path.join(newDir, slug + '-how-to-use.webp'));

  cnt++;
}

// 删旧 images/
fs.rmSync(OLD, { recursive: true });

console.log('✅ 移动 ' + cnt + ' 篇图 → assets/images/generated/articles/');
console.log('   旧 images/ 已删除');
console.log('   新路径示例: assets/images/generated/articles/amethyst-and-selenite/amethyst-and-selenite-featured.webp');
