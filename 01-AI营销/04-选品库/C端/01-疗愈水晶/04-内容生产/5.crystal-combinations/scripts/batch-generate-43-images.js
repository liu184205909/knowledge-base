/**
 * 43 篇重跑完成 → 补生图（两石物理在一起）
 * 与 164 batch 并行（不同 slug，无冲突）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GEN = path.resolve(__dirname, '../../../02-网站规划/scripts/generate-crystal-images.js');
const NODE_PATH = execSync('npm root -g').toString().trim();

const SLUGS = ["rose-quartz-and-larimar","amethyst-and-fluorite","rose-quartz-and-aventurine","obsidian-and-black-tourmaline","carnelian-and-pyrite","amethyst-and-black-tourmaline","black-tourmaline-and-selenite","rose-quartz-and-malachite","lapis-and-angelite","selenite-and-lepidolite","red-jasper-and-hematite","labradorite-and-turquoise","carnelian-and-malachite","jade-and-rhodonite","lepidolite-and-kyanite","moonstone-and-larimar","lapis-and-lepidolite","amazonite-and-bloodstone","ruby-and-pyrite","lepidolite-and-malachite","tiger-eye-and-kyanite","jade-and-labradorite","jade-and-turquoise","moonstone-and-obsidian","obsidian-and-rhodonite","apatite-and-pyrite","bloodstone-and-rhodonite","black-tourmaline-and-aventurine","amazonite-and-rhodonite","moonstone-and-turquoise","turquoise-and-rhodonite","aventurine-and-turquoise","lapis-and-ruby","selenite-and-malachite","ruby-and-kyanite","selenite-and-citrine","black-tourmaline-and-rhodonite","amazonite-and-turquoise","kyanite-and-pyrite","hematite-and-rhodonite","opal-and-larimar","carnelian-and-larimar","rose-quartz-and-obsidian"];

console.log(`=== 43 篇补生图：${SLUGS.length} × 3 = ${SLUGS.length * 3} 图 ===`);
let ok = 0, err = 0;
SLUGS.forEach((slug, i) => {
  const f = path.join(ROOT, 'articles', slug + '.json');
  if (!fs.existsSync(f)) { console.log(`[${i + 1}] ${slug} 无 JSON`); return; }
  console.log(`[${i + 1}/${SLUGS.length}] ${slug}`);
  try {
    execSync(`node "${GEN}" "${f}" --quality low`, { stdio: 'inherit', env: { ...process.env, NODE_PATH } });
    ok++;
  } catch (e) { console.log(`  ❌ ${slug}`); err++; }
});
console.log(`\n=== 43 篇完成：${ok} OK ${err} ERR ===`);
