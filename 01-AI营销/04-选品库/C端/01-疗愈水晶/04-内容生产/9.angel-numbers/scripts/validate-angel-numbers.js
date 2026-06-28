/**
 * 天使号码 100篇机械校验（填充后跑）
 * 硬规则(必须0): 占位符残留 / 合规红线绝对禁词 / master number 误用
 * 软提示(统计不自动改): 去AI化禁词(可能有合理用法，人工/二审裁定)
 * 用法：node validate-angel-numbers.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));

// master number 严格仅 11/22/33
const MASTER = new Set(['11', '22', '33']);

// 合规红线（绝对禁止，精确 includes）
const HARD_BANNED = [
  'will attract your soulmate',
  'guarantee manifestation', 'guarantees manifestation',
  'will become rich', 'become rich',
  'heal anxiety', 'cure anxiety', 'treat anxiety',
  'heal depression', 'cure depression',
  'heal illness', 'cure illness', 'treats illness',
  'guaranteed to', 'will definitely',
];

// 去AI化禁词（软提示，toLowerCase 匹配）
const SOFT_BANNED = [
  'delve', 'harness', 'realm', 'tapestry', 'unlock', 'transformative',
  'elevate', 'vibrant', 'intricate', 'seamless', 'leverage', 'foster',
  'paramount', 'plethora', 'myriad', 'beacon', 'conduit', 'navigate',
  "in today's fast-paced", "it's important to note", 'shed light',
  'pave the way', 'when it comes to', 'moreover', 'furthermore',
];

let totalWords = 0, hardIssues = [], softStats = {};
let placeholderIssues = [], wordCountIssues = [], masterIssues = [];
let checked = 0;

for (const art of idx.articles) {
  const f = path.join(DIR, 'articles', art.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const content = a.content || '';
  const lower = content.toLowerCase();
  checked++;

  // 1. 占位符残留
  const phCount = (content.match(/\{\{AI_/g) || []).length
    + ((a.rank_math_description || '').match(/\{\{AI_/g) || []).length
    + ((a.excerpt || '').match(/\{\{AI_/g) || []).length;
  if (phCount > 0) placeholderIssues.push(`${art.slug}(${phCount})`);

  // 2. 字数
  const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  totalWords += words;
  if (words < 1800) wordCountIssues.push(`${art.slug}(${words})`);

  // 3. master number 误用（非11/22/33 却提 master number）
  if (!MASTER.has(art.number) && /master number/.test(lower) && !a.is_hub) {
    // hub 页(angel-numbers-guide)允许讲 master number 概念
    if (!art.slug.startsWith('angel-numbers')) {
      masterIssues.push(`${art.slug}(number=${art.number})`);
    }
  }

  // 4. 合规红线（硬）
  for (const b of HARD_BANNED) {
    if (lower.includes(b)) hardIssues.push(`${art.slug}: "${b}"`);
  }

  // 5. 去AI化禁词（软统计）
  for (const b of SOFT_BANNED) {
    const cnt = lower.split(b).length - 1;
    if (cnt > 0) {
      softStats[b] = (softStats[b] || 0) + cnt;
    }
  }
}

console.log(`\n===== 天使号码校验（${checked}篇）=====`);
console.log(`平均词数: ${Math.round(totalWords / checked)}`);

console.log(`\n[硬] 占位符残留: ${placeholderIssues.length} 篇`);
if (placeholderIssues.length) console.log('  ' + placeholderIssues.join(', '));

console.log(`\n[硬] 字数<1800: ${wordCountIssues.length} 篇`);
if (wordCountIssues.length) console.log('  ' + wordCountIssues.join(', '));

console.log(`\n[硬] master number 误用(非11/22/33): ${masterIssues.length} 篇`);
if (masterIssues.length) console.log('  ' + masterIssues.join(', '));

console.log(`\n[硬] 合规红线命中: ${hardIssues.length} 处`);
if (hardIssues.length) hardIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[软] 去AI化禁词统计:`);
const sorted = Object.entries(softStats).sort((a, b) => b[1] - a[1]);
if (sorted.length) sorted.forEach(([w, c]) => console.log(`  ${w}: ${c}`));
else console.log('  (无)');
