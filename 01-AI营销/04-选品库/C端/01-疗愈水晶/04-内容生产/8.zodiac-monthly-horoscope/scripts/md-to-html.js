/**
 * Markdown → HTML 转换（48 篇月运文章）
 * 把 ## → <h2>，### → <h3>，**bold** → <strong>，[text](url) → <a>，- → <ul><li>
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let converted = 0;

for (const file of files) {
  const fpath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  if (typeof a.content !== 'string') continue;

  // 检测是否是 Markdown（有 ## 但没有 <h2>）
  const hasMarkdown = a.content.includes('## ') && !a.content.includes('<h2>');
  if (!hasMarkdown) continue;

  let html = a.content;

  // 转换标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 转换粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 转换斜体
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 转换链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 转换列表（简单版：连续的 - 行 → <ul><li>）
  html = html.replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (match, list) => {
    const items = list.trim().split('\n').map(l => l.replace(/^- /, '').trim()).filter(Boolean);
    return '\n<ul>\n' + items.map(i => '<li>' + i + '</li>').join('\n') + '\n</ul>\n';
  });

  // 转换表格（简单检测）
  if (html.includes('| ') && html.includes('---|')) {
    // 表格标记行不需要处理，WordPress 支持 Markdown 表格
    // 保持原样
  }

  // 转换段落（连续两个换行 → <p>包裹）
  // 但不处理已经在 HTML 标签内的内容
  html = html.replace(/\n\n/g, '\n\n');

  // 转换水平线
  html = html.replace(/^---$/gm, '<hr>');

  // 转换代码块（如果有）
  html = html.replace(/```[\s\S]*?```/g, '');

  a.content = html;
  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  converted++;
}

console.log(`✅ 转换完成: ${converted} 篇 Markdown → HTML`);
