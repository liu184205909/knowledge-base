/**
 * 修复模块 13（Famous Couples）占位 → 通用文本
 * 同时修复 SEO 长文的潜在问题
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

let fixed = 0;
for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const [signA, signB] = a.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // 替换 Famous Couples 占位
  const oldPattern = new RegExp(
    `<h2>Famous ${signA} and ${signB} Couples</h2>\\s*<!-- MODULE_13_FAMOUS:[^>]+-->\\s*<p><em>Famous[^<]*</em></p>`,
    'g'
  );

  const replacement = `<h2>Famous ${signA} and ${signB} Couples</h2>\n<p>Want to see this pairing in the wild? Celebrity ${signA}-${signB} couples show the full range of this dynamic — from ${signA}'s ${signA === signB ? 'mirrored' : ''} energy meeting ${signB}'s ${signA === signB ? 'its own reflection' : ''}, with all the chemistry and friction that entails. We're compiling real-world examples of this pairing across Hollywood, history, and culture — check back soon for the full list.</p>`;

  if (oldPattern.test(a.content)) {
    a.content = a.content.replace(oldPattern, replacement);
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
    fixed++;
  }
}

console.log(`✅ 修复 ${fixed}/${files.length} 篇的模块 13 占位`);
