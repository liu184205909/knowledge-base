/**
 * chakra/color/element 批量生图(39张: hero23 + shade12 + diagram4)
 * 循环调 generate-crystal-images.js(gpt-image-2)
 * 用法：node batch-generate-images.js(后台,~30min,~$3-4)
 */
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const GEN = path.resolve(__dirname, '../../../02-网站规划/scripts/generate-crystal-images.js');
const ART = path.resolve(__dirname, '..', 'articles');
const NODE_PATH = execSync('npm root -g').toString().trim();
const files = fs.readdirSync(ART).filter(f => f.endsWith('.json'));

console.log(`=== 生图 ${files.length} 篇(39张) ===`);
let ok = 0, err = 0;
files.forEach((f, i) => {
  console.log(`[${i + 1}/${files.length}] ${f.replace('.json', '')}`);
  try { execSync(`node "${GEN}" "${path.join(ART, f)}" --quality low`, { stdio: 'inherit', env: { ...process.env, NODE_PATH } }); ok++; }
  catch (e) { console.log(`  ❌ ${f}`); err++; }
});
console.log(`\n=== 完成: ${ok} OK, ${err} ERR ===`);
