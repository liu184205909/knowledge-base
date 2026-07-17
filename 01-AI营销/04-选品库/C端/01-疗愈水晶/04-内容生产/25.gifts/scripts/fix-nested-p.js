/**
 * Gift 文章修复：<p> 嵌套拍平（AI 偶发 <p><p>）+ 合规词 cure disease 改写（否定语境也避嫌）
 * 用法：node fix-nested-p.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
let fixedFile = 0, fixedCompliance = 0, fixedNested = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  let c = a.content || ''; let changed = false;
  // 拍平 <p> 嵌套：<p><p> → <p>，</p></p> → </p>（含空白/换行，循环到稳定）
  const before = c;
  let prev;
  do { prev = c; c = c.replace(/<p>\s*<p>/g, '<p>').replace(/<\/p>\s*<\/p>/g, '</p>'); } while (c !== prev);
  if (c !== before) { changed = true; fixedNested++; }
  // 合规：cure disease → address medical conditions（doctors 否定语境避嫌）
  if (/cure disease/i.test(c)) { c = c.replace(/cure disease/gi, 'address medical conditions'); changed = true; fixedCompliance++; }
  if (changed) { a.content = c; fs.writeFileSync(p, JSON.stringify(a, null, 2), 'utf8'); fixedFile++; }
}
console.log(`修复文件: ${fixedFile} 篇（<p>嵌套 ${fixedNested}，合规词 ${fixedCompliance}）`);
