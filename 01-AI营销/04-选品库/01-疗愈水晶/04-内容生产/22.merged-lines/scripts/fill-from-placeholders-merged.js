/**
 * Numerology 主词页 AI 填充回填：读 _placeholders-merged/{slug}.txt（@@@格式）
 * → 替换 articles-merged/{slug}.json 里所有 {{AI_*}} 占位符
 * 用法：node fill-from-placeholders-mainpages.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles-merged');
const PH_DIR = path.join(DIR, '_placeholders-merged');

function parseSegments(raw) {
  const segs = {};
  const re = /@@@(AI_[A-Za-z0-9_-]+)@@@\r?\n([\s\S]*?)(?=\r?\n@@@AI_|$)/g;
  let m;
  while ((m = re.exec(raw)) !== null) segs[m[1]] = m[2].replace(/\r?\n$/, '').trim();
  return segs;
}

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-merged-index.json'), 'utf8'));
let filled = 0, skipped = [], failedReplace = [];
let totalReplaced = 0, totalRemaining = 0;

for (const a of idx.articles) {
  const slug = a.slug;
  const artFile = path.join(ART_DIR, slug + '.json');
  const phFile = path.join(PH_DIR, slug + '.txt');
  if (!fs.existsSync(phFile)) { skipped.push(slug); continue; }
  if (!fs.existsSync(artFile)) { skipped.push(slug); continue; }
  const art = JSON.parse(fs.readFileSync(artFile, 'utf8'));
  const segs = parseSegments(fs.readFileSync(phFile, 'utf8'));
  let count = 0;
  for (const [name, content] of Object.entries(segs)) {
    const ph = '{{' + name + '}}';
    let replaced = false;
    if (art.content && art.content.includes(ph)) { art.content = art.content.split(ph).join(content); replaced = true; }
    else if (art.rank_math_description && art.rank_math_description.includes(ph)) { art.rank_math_description = art.rank_math_description.split(ph).join(content); replaced = true; }
    else if (art.excerpt && art.excerpt.includes(ph)) { art.excerpt = art.excerpt.split(ph).join(content); replaced = true; }
    if (replaced) count++;
  }
  const remaining = ((art.content || '').match(/\{\{AI_/g) || []).length + ((art.rank_math_description || '').match(/\{\{AI_/g) || []).length + ((art.excerpt || '').match(/\{\{AI_/g) || []).length;
  fs.writeFileSync(artFile, JSON.stringify(art, null, 2), 'utf8');
  totalReplaced += count; totalRemaining += remaining;
  if (remaining > 0) failedReplace.push(`${slug}(${remaining})`);
  filled++;
}
console.log(`✅ 回填 ${filled}/${idx.articles.length} 篇`);
console.log(`   总替换段数: ${totalReplaced}`);
console.log(`   剩余占位符总数: ${totalRemaining}`);
if (skipped.length) console.log(`⚠️ 跳过(无.txt): ${skipped.join(', ')}`);
if (failedReplace.length) console.log(`⚠️ 仍有占位符未替换: ${failedReplace.join(', ')}`);
