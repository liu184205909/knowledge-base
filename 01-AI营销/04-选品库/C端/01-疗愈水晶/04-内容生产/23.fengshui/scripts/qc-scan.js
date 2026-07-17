/**
 * publish 前全量 QC 扫描（45 篇）
 * 维度：合规词 / AI套话 / 占位符残留 / }残留 / <p>嵌套 / 字数 / FAQ独立性
 * 用法：node qc-scan.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles-mainpages');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
// 合规红线（精确短语，小写匹配）
const compliance = ['cures ', 'treats illness', 'guarantees', 'will bring wealth', 'removes negative energy', 'scientifically proven', '100% guaranteed', 'cure disease', 'treat depression', 'treat anxiety'];
// AI 套话（词根，正则词边界）
const aicliches = ['delve', 'harness', 'tapestry', 'unlock', 'elevate', 'intricate', 'seamless', 'leverage', 'foster', 'paramount', 'plethora', 'myriad', 'realm of', 'manifest abundance'];
const issues = {};
for (const f of files) {
  const a = require(path.join(DIR, f)); const c = a.content || '';
  const prob = [];
  for (const w of compliance) { if (c.toLowerCase().includes(w)) prob.push('🔴合规:' + w.trim()); }
  for (const w of aicliches) { if (new RegExp('\\b' + w.replace(' ', '\\s') + '\\b', 'i').test(c)) prob.push('🟡AI套话:' + w); }
  if (/\bjourney\b/i.test(c)) prob.push('🟡AI套话?:journey(人工判)');
  if ((c.match(/\{\{AI_/g) || []).length) prob.push('🔴占位符残留');
  if ((c.match(/<\/p>\s*}/g) || []).length) prob.push('🔴}残留');
  if ((c.match(/<p><p/g) || []).length) prob.push('🔴<p>嵌套');
  const words = c.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 1200) prob.push('🟡字数少:' + words);
  // FAQ 独立性（h3 数 vs FAQ 答案段）
  const h3 = (c.match(/<h3>[^<]+\?<\/h3>/g) || []).length;
  if (h3 < 3) prob.push('🟡FAQ少:' + h3);
  if (prob.length) issues[f] = prob;
}
const keys = Object.keys(issues);
console.log('扫描 ' + files.length + ' 篇，有问题: ' + keys.length + ' 篇\n');
// 按严重度排序（🔴优先）
const red = keys.filter(k => issues[k].some(p => p.includes('🔴')));
const yellow = keys.filter(k => !issues[k].some(p => p.includes('🔴')));
if (red.length) { console.log('=== 🔴 严重（必修）==='); for (const k of red) console.log(k + ': ' + issues[k].join(' | ')); }
if (yellow.length) { console.log('\n=== 🟡 轻微（人工判）==='); for (const k of yellow) console.log(k + ': ' + issues[k].join(' | ')); }
if (!keys.length) console.log('✅ 全量扫描通过，无问题');
