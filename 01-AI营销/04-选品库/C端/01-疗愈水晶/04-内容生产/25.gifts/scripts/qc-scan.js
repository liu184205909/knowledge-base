/**
 * Gift 文章 publish 前全量 QC 扫描（43 篇）
 * 维度：合规词（礼物向）/ AI套话 / 占位符残留 / <p>嵌套 / 字数 / FAQ数 / Shop CTA 链接格式
 * Shop 死链靠 CAT_MAP（wc/store 验证）+ 降级机制设计保证，此处只查链接格式
 * 用法：node qc-scan.js   （在 fill-from-placeholders 回填后跑）
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
// 合规红线（礼物向：不夸大保证爱情/关系/财富/运势）
const compliance = ['cures ', 'treats illness', 'guarantees', 'will bring wealth', 'will bring love', 'will bring luck', 'will fix your', 'removes negative energy', 'scientifically proven', '100% guaranteed', 'cure disease', 'guarantee love', 'ensure love', 'guaranteed to'];
// AI 套话
const aicliches = ['delve', 'harness', 'tapestry', 'unlock', 'elevate', 'intricate', 'seamless', 'leverage', 'foster', 'paramount', 'plethora', 'myriad', 'realm of', 'manifest abundance', 'elevate your'];
const issues = {};
for (const f of files) {
  const a = require(path.join(DIR, f)); const c = a.content || '';
  const prob = [];
  for (const w of compliance) { if (c.toLowerCase().includes(w)) prob.push('🔴合规:' + w.trim()); }
  for (const w of aicliches) { if (new RegExp('\\b' + w.replace(' ', '\\s') + '\\b', 'i').test(c)) prob.push('🟡AI套话:' + w); }
  if (/\bjourney\b/i.test(c)) prob.push('🟡AI套话?:journey(人工判)');
  if ((c.match(/\{\{AI_/g) || []).length) prob.push('🔴占位符残留:' + (c.match(/\{\{AI_/g) || []).length);
  if ((c.match(/<p><p/g) || []).length) prob.push('🔴<p>嵌套');
  // Shop CTA 链接格式：必须是 /product-category/xxx/ 或 /shop/?s=xxx
  const shopLinks = [...c.matchAll(/href="([^"]*(?:product-category|\/shop\/)[^"]*)"/g)].map(m => m[1]);
  for (const u of shopLinks) { if (!/\/product-category\/[a-z-]+\/$/.test(u) && !/\/shop\/\?s=/.test(u)) prob.push('🔴Shop链接异常:' + u); }
  const words = c.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 1000) prob.push('🟡字数少:' + words);
  const h3 = (c.match(/<h3>[^<]+\?<\/h3>/g) || []).length;
  if (h3 < 3) prob.push('🟡FAQ少:' + h3);
  // meaning 内链格式（/xxx-meaning/）
  const badMeaning = [...c.matchAll(/href="\/([a-z-]+)-meaning\/"/g)].filter(m => !m[1]).length;
  if (prob.length) issues[f] = prob;
}
const keys = Object.keys(issues);
console.log('扫描 ' + files.length + ' 篇，有问题: ' + keys.length + ' 篇\n');
const red = keys.filter(k => issues[k].some(p => p.includes('🔴')));
const yellow = keys.filter(k => !issues[k].some(p => p.includes('🔴')));
if (red.length) { console.log('=== 🔴 严重（必修）==='); for (const k of red) console.log(k + ': ' + issues[k].join(' | ')); }
if (yellow.length) { console.log('\n=== 🟡 轻微（人工判）==='); for (const k of yellow) console.log(k + ': ' + issues[k].join(' | ')); }
if (!keys.length) console.log('✅ 全量扫描通过，无问题');
