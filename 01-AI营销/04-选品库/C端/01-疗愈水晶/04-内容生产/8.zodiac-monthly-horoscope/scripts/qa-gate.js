const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
console.log(`QA Gate: 检查 ${files.length} 篇月运文章\n`);

const KILL_LIST = ['delve','leverage','tapestry','landscape','seamless','robust','moreover','furthermore','ultimately'];
let issueCount = 0;
let parseErrors = 0;

for (const file of files) {
  try {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const a = JSON.parse(raw);
    let contentStr = a.content || '';
    if (typeof contentStr !== 'string') contentStr = JSON.stringify(contentStr);

    const plain = contentStr.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
    const lower = plain.toLowerCase();
    const h2s = (contentStr.match(/<h2>/g) || []).length;
    const wc = plain.split(/\s+/).filter(Boolean).length;
    const killCount = KILL_LIST.reduce((s, w) => s + ((lower.match(new RegExp(w, 'g')) || []).length), 0);

    const issues = [];
    if (h2s < 8) issues.push(`H2<8(${h2s})`);
    if (wc < 1200) issues.push(`WC<1200(${wc})`);
    if (killCount > 5) issues.push(`KL>${killCount}`);

    if (issues.length > 0) {
      issueCount++;
      if (issueCount <= 30) console.log(`❌ ${file}: ${issues.join(', ')}`);
    }
  } catch (e) {
    parseErrors++;
    if (parseErrors <= 10) console.log(`💥 ${file}: JSON parse error`);
  }
}

console.log(`\n总计: ${files.length} 篇`);
console.log(`JSON 错误: ${parseErrors}`);
console.log(`内容问题: ${issueCount}`);
console.log(`通过: ${files.length - issueCount - parseErrors}`);
