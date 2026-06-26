/**
 * 批量生 164 篇水晶配对图（两石物理在一起，gpt-image-2）
 * 跳过 43 篇重跑中（content 变动，避免同 JSON 写 race；43 完成后单独生）
 * 用法：node scripts/batch-generate-combination-images.js （background，~3h，~$19）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GEN = path.resolve(__dirname, '../../../02-网站规划/scripts/generate-crystal-images.js');
const sel = JSON.parse(fs.readFileSync(path.join(ROOT, 'selected-articles.json'), 'utf8'));
const NODE_PATH = execSync('npm root -g').toString().trim();

// 43 篇重跑中（跳过，完成后再生）
const SKIP = new Set(["rose-quartz-and-larimar","amethyst-and-fluorite","rose-quartz-and-aventurine","obsidian-and-black-tourmaline","carnelian-and-pyrite","amethyst-and-black-tourmaline","black-tourmaline-and-selenite","rose-quartz-and-malachite","lapis-and-angelite","selenite-and-lepidolite","red-jasper-and-hematite","labradorite-and-turquoise","carnelian-and-malachite","jade-and-rhodonite","lepidolite-and-kyanite","moonstone-and-larimar","lapis-and-lepidolite","amazonite-and-bloodstone","ruby-and-pyrite","lepidolite-and-malachite","tiger-eye-and-kyanite","jade-and-labradorite","jade-and-turquoise","moonstone-and-obsidian","obsidian-and-rhodonite","apatite-and-pyrite","bloodstone-and-rhodonite","black-tourmaline-and-aventurine","amazonite-and-rhodonite","moonstone-and-turquoise","turquoise-and-rhodonite","aventurine-and-turquoise","lapis-and-ruby","selenite-and-malachite","ruby-and-kyanite","selenite-and-citrine","black-tourmaline-and-rhodonite","amazonite-and-turquoise","kyanite-and-pyrite","hematite-and-rhodonite","opal-and-larimar","carnelian-and-larimar","rose-quartz-and-obsidian"]);

const rest = sel.articles.filter(a => !SKIP.has(a.slug));
console.log(`=== 批量生图：${rest.length} 篇 × 3 图 = ${rest.length * 3} 图（跳过 43 重跑）===`);
console.log(`开始：${new Date().toISOString()}`);

let ok = 0, err = 0;
rest.forEach((a, i) => {
  const f = path.join(ROOT, 'articles', a.slug + '.json');
  if (!fs.existsSync(f)) { console.log(`[${i + 1}/${rest.length}] ${a.slug} 无 JSON，跳过`); return; }
  console.log(`[${i + 1}/${rest.length}] ${a.slug}`);
  try {
    execSync(`node "${GEN}" "${f}" --quality low`, {
      stdio: 'inherit',
      env: { ...process.env, NODE_PATH },
    });
    ok++;
  } catch (e) { console.log(`  ❌ ${a.slug} ERR`); err++; }
});

console.log(`\n=== 完成：${ok} 篇 OK，${err} 篇 ERR ===`);
console.log(`结束：${new Date().toISOString()}`);
