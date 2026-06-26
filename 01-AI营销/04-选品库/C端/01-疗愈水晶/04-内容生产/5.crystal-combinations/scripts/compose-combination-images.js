/**
 * sharp 合成 207 篇配对文章图（3 图/篇 = 621 图）
 *   featured: A+B form_bracelet（fallback overview）拼 1280x720 左右
 *   pair: A+B overview 拼原石对比
 *   how_to_use: 有 form_bracelet 那颗的 how_to_use 单图（饰品形态更常见）
 * 用法：NODE_PATH=$(npm root -g) node scripts/compose-combination-images.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const combos = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'combinations-data-30.json'), 'utf8')).combinations;
const sel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'selected-articles.json'), 'utf8'));
const IMG = path.join(__dirname, 'stones-img');
const OUT = path.resolve(__dirname, '../../../02-网站规划/assets/images/generated/5.crystal-combinations');

const fbExists = s => { const f = path.join(IMG, s + '-form_bracelet.webp'); return fs.existsSync(f) && fs.statSync(f).size > 5000; };

async function compose2(a, b, out) {
  const hw = 640;
  const aB = await sharp(a).resize(hw, 720, { fit: 'cover', position: 'center' }).toBuffer();
  const bB = await sharp(b).resize(hw, 720, { fit: 'cover', position: 'center' }).toBuffer();
  await sharp({ create: { width: 1280, height: 720, channels: 4, background: { r: 245, g: 245, b: 240, alpha: 1 } } })
    .composite([{ input: aB, gravity: 'west' }, { input: bB, gravity: 'east' }])
    .webp({ quality: 85 })
    .toFile(out);
}

(async () => {
  let done = 0, fail = 0;
  const failed = [];
  for (const art of sel.articles) {
    const c = combos[art.slug];
    if (!c) { fail++; failed.push(art.slug + '(无combo)'); continue; }
    const [a, b] = c.stones;
    const outDir = path.join(OUT, art.slug);
    fs.mkdirSync(outDir, { recursive: true });
    try {
      const aFb = path.join(IMG, a + '-form_bracelet.webp');
      const aOv = path.join(IMG, a + '-overview.webp');
      const bFb = path.join(IMG, b + '-form_bracelet.webp');
      const bOv = path.join(IMG, b + '-overview.webp');
      // featured: form_bracelet（fallback overview）
      await compose2(fbExists(a) ? aFb : aOv, fbExists(b) ? bFb : bOv, path.join(outDir, art.slug + '-featured.webp'));
      // pair: overview 原石对比
      await compose2(aOv, bOv, path.join(outDir, art.slug + '-crystal-pair.webp'));
      // how_to_use: 有 form_bracelet 那颗（饰品形态更常见）
      const huSlug = fbExists(a) ? a : b;
      const huFile = path.join(IMG, huSlug + '-how_to_use.webp');
      await sharp(huFile).resize(1280, 720, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(path.join(outDir, art.slug + '-how-to-use.webp'));
      done++;
    } catch (e) {
      fail++;
      failed.push(art.slug + '(' + e.message.slice(0, 40) + ')');
    }
  }
  console.log('=== 合成完成 ===');
  console.log('成功:' + done + '篇 | 失败:' + fail);
  if (failed.length) console.log('失败:', failed.slice(0, 20).join(', '));
  console.log('输出:', OUT, '| 目录:', fs.readdirSync(OUT).length);
})();
