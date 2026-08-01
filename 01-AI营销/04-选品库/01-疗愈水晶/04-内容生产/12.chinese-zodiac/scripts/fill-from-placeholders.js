/**
 * Chinese Zodiac AI 填充后处理：读 _placeholders/{slug}.txt（@@@分隔符@@@格式）
 * → JSON 安全替换 articles/{slug}.json 里所有 {{AI_*}} 占位符
 * 用法：node fill-from-placeholders.js [--slug=dragon-crystals]
 * 安全性：用 split/join 替换（不经 LLM），JSON.stringify 保证转义正确
 * 参考：9.angel-numbers/scripts/fill-from-placeholders.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles');
const PH_DIR = path.join(DIR, '_placeholders');

// 段解析：@@@AI_XXX@@@\n内容（到下一个 @@@ 或文件尾）
function parseSegments(raw) {
  const segs = {};
  const re = /@@@(AI_[A-Za-z0-9_-]+)@@@\r?\n([\s\S]*?)(?=\r?\n@@@AI_|$)/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    segs[m[1]] = m[2].replace(/\r?\n$/, '').trim();
  }
  return segs;
}

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

const slugs = fs.existsSync(path.join(DIR, 'articles-index.json'))
  ? JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8')).articles.map(a => a.slug)
  : [];
const target = slugArg ? [slugArg] : slugs;

let filled = 0, skipped = [], failedReplace = [];
let totalReplaced = 0, totalRemaining = 0;

for (const slug of target) {
  const artFile = path.join(ART_DIR, slug + '.json');
  const phFile = path.join(PH_DIR, slug + '.txt');
  if (!fs.existsSync(phFile)) { skipped.push(slug); continue; }
  if (!fs.existsSync(artFile)) { skipped.push(slug); continue; }

  const art = JSON.parse(fs.readFileSync(artFile, 'utf8'));
  const raw = fs.readFileSync(phFile, 'utf8');
  const segs = parseSegments(raw);

  let count = 0;
  // 收集所有含 {{AI_ 的字段（content + rank_math_description + excerpt）
  const fields = ['content', 'rank_math_description', 'excerpt'];
  for (const [name, content] of Object.entries(segs)) {
    const ph = '{{' + name + '}}';
    let replaced = false;
    for (const f of fields) {
      if (art[f] && typeof art[f] === 'string' && art[f].includes(ph)) {
        art[f] = art[f].split(ph).join(content);
        replaced = true;
      }
    }
    if (replaced) count++;
  }

  // 检查剩余占位符
  let remaining = 0;
  for (const f of fields) {
    if (art[f] && typeof art[f] === 'string') {
      remaining += (art[f].match(/\{\{AI_/g) || []).length;
    }
  }

  fs.writeFileSync(artFile, JSON.stringify(art, null, 2), 'utf8');
  totalReplaced += count;
  totalRemaining += remaining;
  if (remaining > 0) failedReplace.push(`${slug}(${remaining})`);
  filled++;
  console.log(`✓ ${slug}: 替换 ${count} 段, 剩余 ${remaining}`);
}

console.log(`\n=== 填充 ${filled}/${target.length} 篇 ===`);
console.log(`总替换段数: ${totalReplaced}`);
console.log(`剩余占位符总数: ${totalRemaining}`);
if (skipped.length) console.log(`⚠️ 跳过(无.txt): ${skipped.join(', ')}`);
if (failedReplace.length) console.log(`⚠️ 仍有占位符未替换: ${failedReplace.join(', ')}`);
