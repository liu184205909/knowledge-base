/**
 * 补生 121 篇分屏图 → AI 生（两石物理在一起，gpt-image-2）
 * 读 _regen-image-slugs.json（121 篇非 AI 生），循环 generate-crystal-images.js
 * 用法：node scripts/batch-regen-121.js（background，~2h，~$14）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GEN = path.resolve(__dirname, '../../../02-网站规划/scripts/generate-crystal-images.js');
const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, '_regen-image-slugs.json'), 'utf8'));
const NODE_PATH = execSync('npm root -g').toString().trim();

console.log(`=== 补生 ${slugs.length} 篇 × 3 图 = ${slugs.length * 3} 图（分屏→AI两石物理在一起）===`);
console.log(`开始：${new Date().toISOString()}`);

let ok = 0, err = 0;
slugs.forEach((slug, i) => {
  const f = path.join(ROOT, 'articles', slug + '.json');
  console.log(`[${i + 1}/${slugs.length}] ${slug}`);
  try {
    execSync(`node "${GEN}" "${f}" --quality low`, { stdio: 'inherit', env: { ...process.env, NODE_PATH } });
    ok++;
  } catch (e) { console.log(`  ❌ ${slug}`); err++; }
});

console.log(`\n=== 补生完成：${ok} OK，${err} ERR ===`);
console.log(`结束：${new Date().toISOString()}`);
