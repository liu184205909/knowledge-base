/**
 * How-to AI 填充后处理：读 _placeholders/{slug}.txt（@@@AI_XXX@@@ 分隔符格式）
 * → JSON 安全替换 articles/{slug}.json 里所有 {{AI_*}} 占位符
 * 用法：node fill-from-placeholders.js [--slug=how-to-cleanse-crystals]
 * 安全性：split/join 替换（不经 LLM），JSON.stringify 保证转义正确
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

const slugs = slugArg
  ? [slugArg]
  : (fs.existsSync(path.join(DIR, 'articles-index.json'))
      ? JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8')).articles.map(a => a.slug)
      : []);

let filled = 0, skipped = [], failedReplace = [];
let totalReplaced = 0, totalRemaining = 0;

for (const slug of slugs) {
  const artFile = path.join(ART_DIR, slug + '.json');
  const phFile = path.join(PH_DIR, slug + '.txt');
  if (!fs.existsSync(phFile)) { skipped.push(slug); continue; }
  if (!fs.existsSync(artFile)) { skipped.push(slug); continue; }

  const art = JSON.parse(fs.readFileSync(artFile, 'utf8'));
  const raw = fs.readFileSync(phFile, 'utf8');
  const segs = parseSegments(raw);

  let count = 0;
  for (const [name, content] of Object.entries(segs)) {
    const ph = '{{' + name + '}}';
    let replaced = false;
    if (art.content && art.content.includes(ph)) {
      art.content = art.content.split(ph).join(content);
      replaced = true;
    } else if (art.rank_math_description && art.rank_math_description.includes(ph)) {
      art.rank_math_description = art.rank_math_description.split(ph).join(content);
      replaced = true;
    } else if (art.excerpt && art.excerpt.includes(ph)) {
      art.excerpt = art.excerpt.split(ph).join(content);
      replaced = true;
    } else if (art.images) {
      // 图片 alt 占位符替换
      for (const [key, img] of Object.entries(art.images)) {
        if (img.alt && img.alt.includes(ph)) {
          img.alt = img.alt.split(ph).join(content);
          replaced = true;
        }
      }
    }
    if (replaced) count++;
  }

  const remaining = ((art.content || '').match(/\{\{AI_/g) || []).length
    + ((art.rank_math_description || '').match(/\{\{AI_/g) || []).length
    + ((art.excerpt || '').match(/\{\{AI_/g) || []).length
    + (art.images ? Object.values(art.images).reduce((s, img) => s + ((img.alt || '').match(/\{\{AI_/g) || []).length, 0) : 0);

  fs.writeFileSync(artFile, JSON.stringify(art, null, 2), 'utf8');
  totalReplaced += count;
  totalRemaining += remaining;
  if (remaining > 0) failedReplace.push(`${slug}(${remaining})`);
  filled++;
  console.log(`✅ ${slug}: 替换 ${count} 段，剩余 ${remaining}`);
}

console.log(`\n===== 填充 ${filled}/${slugs.length} 篇 =====`);
console.log(`总替换段数: ${totalReplaced}`);
console.log(`剩余占位符总数: ${totalRemaining}`);
if (skipped.length) console.log(`⚠️ 跳过(无.txt): ${skipped.join(', ')}`);
if (failedReplace.length) console.log(`⚠️ 仍有占位符未替换: ${failedReplace.join(', ')}`);
