// 验证 sharp 能加载 webp + 合成两石 16:9 对比图
const sharp = require('sharp');
const fs = require('fs');

(async () => {
  const ma = await sharp('scripts/tmp-img/amethyst.webp').metadata();
  const mb = await sharp('scripts/tmp-img/selenite.webp').metadata();
  console.log('amethyst:', ma.width + 'x' + ma.height, ma.format, ma.hasAlpha ? '(alpha)' : '');
  console.log('selenite:', mb.width + 'x' + mb.height, mb.format, mb.hasAlpha ? '(alpha)' : '');

  // 合成 1280x720 (16:9)：两图各 cover 640x720，左右并排
  const aBuf = await sharp('scripts/tmp-img/amethyst.webp').resize(640, 720, { fit: 'cover', position: 'center' }).toBuffer();
  const bBuf = await sharp('scripts/tmp-img/selenite.webp').resize(640, 720, { fit: 'cover', position: 'center' }).toBuffer();
  await sharp({ create: { width: 1280, height: 720, channels: 4, background: { r: 245, g: 245, b: 240, alpha: 1 } } })
    .composite([{ input: aBuf, gravity: 'west' }, { input: bBuf, gravity: 'east' }])
    .webp({ quality: 85 })
    .toFile('scripts/tmp-img/composite-test.webp');
  const stat = fs.statSync('scripts/tmp-img/composite-test.webp');
  console.log('✅ 合成OK: composite-test.webp', (stat.size / 1024).toFixed(1) + 'KB, 1280x720');
})().catch(e => console.log('❌ ERR:', e.message));
