/**
 * 扫描 23 篇 Tarot 文章的 SOFT_BANNED 去AI化禁词
 * 输出每处命中的完整句子上下文 + char index，用于精准人工替换
 * 用法：node scripts/scan-softbanned.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));

// 与 validate-angel-numbers.js 的 SOFT_BANNED 对齐 + 任务额外要求
const SOFT_BANNED = [
  'delve', 'harness', 'realm', 'tapestry', 'unlock', 'transformative',
  'elevate', 'vibrant', 'intricate', 'seamless', 'leverage', 'foster',
  'paramount', 'plethora', 'myriad', 'beacon', 'conduit', 'navigate',
  "in today's fast-paced", "it's important to note", 'shed light',
  'pave the way', 'when it comes to', 'moreover', 'furthermore',
  // 任务额外点出
  'serves as', 'journey',
];

// 取命中所在的句子（按句末标点+HTML块边界切）
function findOccurrences(content, word) {
  const lower = content.toLowerCase();
  const occ = [];
  let from = 0;
  let idxPos;
  while ((idxPos = lower.indexOf(word, from)) !== -1) {
    // 找句子边界：往前找最近的开头，往后找最近的结尾
    let start = idxPos;
    // 往前回溯到句号/问号/感叹号/HTML块开始
    const before = content.slice(0, idxPos);
    const startMarkers = before.lastIndexOf('. ');
    const startQ = before.lastIndexOf('? ');
    const startEx = before.lastIndexOf('! ');
    const startBlock = Math.max(
      before.lastIndexOf('<p>'), before.lastIndexOf('<li>'),
      before.lastIndexOf('<h2>'), before.lastIndexOf('<h3>'),
      before.lastIndexOf('<strong>'), before.lastIndexOf('</strong> '),
      before.lastIndexOf('<summary>'), before.lastIndexOf('<details>'),
      before.lastIndexOf('\n'),
    );
    const candidates = [startMarkers, startQ, startEx, startBlock].filter(x => x >= 0);
    start = candidates.length ? Math.max(...candidates) : 0;
    if (start > 0) start += content.slice(start, idxPos).match(/[.?!>\n]\s*$/) ? content.slice(start, idxPos).match(/[.?!>\n]\s*$/)[0].length : 0;
    // 简化：往后找最近的句末
    let end = idxPos + word.length;
    const after = content.slice(end);
    const endMatch = after.match(/[.?!](\s|$)|<\/(?:p|li|h[1-6]|strong|summary|details)>|\n/);
    if (endMatch) end += after.indexOf(endMatch[0]) + (endMatch[0].length);
    const sentence = content.slice(start, end).replace(/\s+/g, ' ').trim();
    occ.push({ at: idxPos, sentence: sentence.slice(0, 400) });
    from = idxPos + word.length;
  }
  return occ;
}

const perArticle = {};
const wordStats = {};
let totalHits = 0;

for (const art of idx.articles) {
  const f = path.join(DIR, 'articles', art.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const content = a.content || '';
  const hits = [];
  for (const w of SOFT_BANNED) {
    const occ = findOccurrences(content, w);
    if (occ.length) {
      wordStats[w] = (wordStats[w] || 0) + occ.length;
      totalHits += occ.length;
      hits.push({ word: w, count: occ.length, occurrences: occ });
    }
  }
  if (hits.length) perArticle[art.slug] = hits;
}

console.log(`\n===== Tarot 23篇 SOFT_BANNED 扫描 =====`);
console.log(`总命中: ${totalHits} 处\n`);
console.log(`[按词频统计]`);
Object.entries(wordStats).sort((a, b) => b[1] - a[1]).forEach(([w, c]) => console.log(`  ${w}: ${c}`));

console.log(`\n[按文章明细]`);
for (const [slug, hits] of Object.entries(perArticle)) {
  const cnt = hits.reduce((s, h) => s + h.count, 0);
  console.log(`\n### ${slug} (${cnt} 处)`);
  for (const h of hits) {
    console.log(`  -- "${h.word}" × ${h.count}`);
    h.occurrences.forEach((o, i) => console.log(`     [${i + 1}@${o.at}] ${o.sentence}`));
  }
}

// 落盘供后续脚本读取
fs.writeFileSync(path.join(DIR, '_qc', 'softbanned-scan.json'), JSON.stringify({
  total_hits: totalHits,
  word_stats: wordStats,
  per_article: perArticle,
}, null, 2));
console.log(`\n已写 _qc/softbanned-scan.json`);
