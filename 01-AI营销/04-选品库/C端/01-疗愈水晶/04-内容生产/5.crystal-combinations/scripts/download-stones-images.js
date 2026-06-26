/**
 * 下载 30 颗水晶的 meaning 图（form_bracelet + overview + how_to_use），缓存到 stones-img/
 * form_bracelet 缺失的用 overview fallback
 * 用法：node scripts/download-stones-images.js（需 socks5 代理 + disableSandbox）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imgs = JSON.parse(fs.readFileSync(path.join(__dirname, 'stones-images.json'), 'utf8'));
const DIR = path.join(__dirname, 'stones-img');
fs.mkdirSync(DIR, { recursive: true });

let dl = 0, skip = 0, miss = 0;
const missing = [];

for (const slug of Object.keys(imgs)) {
  const types = imgs[slug];
  const fb = types.form_bracelet || types.overview; // fallback
  const ov = types.overview;
  const hu = types.how_to_use;

  for (const [key, url] of [['form_bracelet', fb], ['overview', ov], ['how_to_use', hu]]) {
    if (!url) { miss++; missing.push(slug + '-' + key); continue; }
    const file = path.join(DIR, slug + '-' + key + '.webp');
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) { skip++; continue; }
    try {
      execSync('curl -s --proxy socks5://127.0.0.1:10808 -o "' + file + '" "' + url + '" --max-time 20', { stdio: 'ignore' });
      if (fs.existsSync(file) && fs.statSync(file).size > 5000) { dl++; }
      else { miss++; missing.push(slug + '-' + key + '(小)'); }
    } catch (e) { miss++; missing.push(slug + '-' + key + '(ERR)'); }
  }
}

console.log('=== 下载完成 ===');
console.log('下载:' + dl + ' | 缓存跳过:' + skip + ' | 缺失:' + miss);
if (missing.length) console.log('缺失:', missing.slice(0, 20).join(', '));
console.log('缓存目录:', DIR, '| 文件:', fs.readdirSync(DIR).length);
