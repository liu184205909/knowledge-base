const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

console.log(`QA Gate: 检查 ${files.length} 篇星座详解文章\n`);

const KILL_LIST = ['delve','leverage','tapestry','landscape','seamless','robust','moreover','furthermore','ultimately'];
const BOUNDARY = ['traditionally','many people','not a substitute','entertainment'];

let allClean = true;

for (const file of files) {
  const a = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const slug = file.replace('.json', '');
  const plain = a.content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const lower = plain.toLowerCase();

  // 检查项
  const h2s = (a.content.match(/<h2>/g) || []).length;
  const wc = plain.split(/\s+/).filter(Boolean).length;
  const killCount = KILL_LIST.reduce((s, w) => s + ((lower.match(new RegExp(w, 'g')) || []).length), 0);
  const boundaryCount = BOUNDARY.reduce((s, t) => s + ((lower.match(new RegExp(t, 'g')) || []).length), 0);
  const placeholders = (a.content.match(/<!--\s*MODULE/g) || []).length;
  const hasFAQ = a.content.includes('FAQPage') || a.content.includes('application/ld+json');
  const hasCrystals = a.content.includes('-crystals/');
  const hasPairing = a.content.includes('match') || a.content.includes('compatibility');

  const issues = [];
  if (h2s < 10) issues.push(`H2<10 (${h2s})`);
  if (wc < 1500) issues.push(`WC<1500 (${wc})`);
  if (killCount > 5) issues.push(`KL>${killCount}`);
  if (placeholders > 0) issues.push(`PLACEHOLDER`);
  if (!hasFAQ) issues.push(`NO_FAQ_SCHEMA`);
  if (!hasCrystals) issues.push(`NO_CRYSTAL_LINK`);

  const status = issues.length === 0 ? '✅' : '❌';
  if (issues.length > 0) allClean = false;

  console.log(`${status} ${slug}: ${h2s} H2, ${wc} words, KL=${killCount}, boundary=${boundaryCount}, ${hasFAQ?'FAQ✓':'FAQ✗'}, ${hasCrystals?'crystals✓':'crystals✗'}${issues.length > 0 ? ' — ' + issues.join(', ') : ''}`);
}

console.log(`\n${allClean ? '✅ 全部通过' : '⚠️ 有问题需要修复'}`);
