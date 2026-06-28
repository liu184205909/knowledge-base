/**
 * 清理 articles/*.json content 里的生产指令注释
 * 移除整段 <p><em>DiffHint.../></em></p> 和 <p><em>合规口径.../></em></p>
 * 以及 <p>> Prefer 类的 markdown 残留 '>' 前缀
 * 用法：node clean-production-notes.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));

let cleaned = 0, removed = 0;
for (const art of idx.articles) {
  const file = path.join(DIR, 'articles', art.slug + '.json');
  const a = JSON.parse(fs.readFileSync(file, 'utf8'));
  const before = a.content;
  // 移除 <p><em>DiffHint...:</em> 文字 </p> 整段（</em> 后可能有说明文字，匹配到该段第一个 </p>）
  a.content = a.content.replace(/<p><em>DiffHint[\s\S]*?<\/p>\n?/gi, '');
  // 移除 <p><em>合规口径...:</em> 文字 </p> 整段
  a.content = a.content.replace(/<p><em>合规口径[\s\S]*?<\/p>\n?/gi, '');
  // 修正 <p>> Prefer (markdown > 残留) → <p>Prefer
  a.content = a.content.replace(/<p>>\s*/g, '<p>');
  // 清理多余空行（3+连续空行→2）
  a.content = a.content.replace(/\n{3,}/g, '\n\n');
  if (a.content !== before) {
    fs.writeFileSync(file, JSON.stringify(a, null, 2), 'utf8');
    cleaned++;
    removed += (before.match(/<p><em>(DiffHint|合规口径)/gi) || []).length;
  }
}
console.log(`✅ 清理 ${cleaned}/${idx.articles.length} 篇，移除 ${removed} 处生产注释`);
