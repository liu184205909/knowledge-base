const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
console.log(`QA Gate: 检查 ${files.length} 篇年运文章\n`);

const KILL_LIST = ['delve','leverage','tapestry','landscape','seamless','robust','moreover','furthermore','ultimately'];
let allClean = true;

for (const file of files) {
  const a = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const slug = file.replace('.json', '');
  const plain = a.content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const lower = plain.toLowerCase();
  const h2s = (a.content.match(/<h2>/g) || []).length;
  const wc = plain.split(/\s+/).filter(Boolean).length;
  const killCount = KILL_LIST.reduce((s, w) => s + ((lower.match(new RegExp(w, 'g')) || []).length), 0);
  const issues = [];
  if (h2s < 10) issues.push(`H2<10(${h2s})`);
  if (wc < 2500) issues.push(`WC<2500(${wc})`);
  if (killCount > 5) issues.push(`KL>${killCount}`);
  const status = issues.length === 0 ? '✅' : '❌';
  if (issues.length > 0) allClean = false;
  console.log(`${status} ${slug}: ${h2s} H2, ${wc} words, KL=${killCount}${issues.length ? ' — ' + issues.join(', ') : ''}`);
}
console.log(`\n${allClean ? '✅ 全部通过' : '⚠️ 有问题'}`);
