/**
 * Chinese Zodiac 二审校验（填充后跑）
 * 硬规则(必须0):
 *   1. 占位符残留
 *   2. M6 避讳石硬化扫描（harmful/bad for/should never wear/will bring bad luck/clashes with/must avoid/forbidden 裸用）
 *   3. 合规红线（确定性运势 claim / 化太岁 / 保证避灾 / cures heals treats）
 *   4. 确定论语言（destined/always/never/guaranteed 在水晶语境）
 *   5. 字数不足
 *   6. 文化锁死校验（本命佛/五行 vs chinese-zodiac-knowledge.json 锁死值，AI 编造打回）
 *   7. M6 必填缓和语（两道各出现一次）
 * 软提示: 去AI化禁词
 * 用法：node validate-chinese-zodiac.js [--slug=dragon-crystals]
 * 参考：10.how-to/scripts/validate-how-to.js + 框架 v2 §6.2/§13
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const KNOW = require('../../../07-互动工具/_shared/chinese-zodiac-knowledge.json');

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

// M6 避讳石硬化禁词（裸用即违规，框架 §6.2）
const M6_HARD_BANNED = [
  'harmful', 'bad for', 'should never wear', 'will bring bad luck',
  'clashes with', 'must avoid', 'forbidden',
];

// 合规红线（绝对禁止，确定性运势/医学 claim，框架 §13.2）
const COMPLIANCE_BANNED = [
  'will bring you luck', 'will bring you wealth', 'will bring you fortune',
  'guaranteed to bring', 'guaranteed fortune', 'guaranteed luck',
  'will protect you from tai sui', "tai sui's curse",
  '化太岁', '保证好运', '保证避灾', '避灾', '必须全年戴',
  'cures anxiety', 'treats anxiety', 'heals anxiety',
  'cures ', 'treats ', 'heals ', // 医学 claim（注意空格避免误伤 healed 等）
  'will definitely', 'destined to',
  'brings wealth', 'brings fortune', 'brings luck',
  'attracts love', 'attracts wealth', 'attracts abundance',
];

// 确定论语言（水晶语境，软提示）
const DETERMINISTIC_SOFT = ['destined', 'always protects', 'never fails', 'guaranteed', 'will surely'];

// 去AI化禁词（软统计）
const SOFT_BANNED = [
  'delve', 'harness', 'realm', 'tapestry', 'unlock your potential',
  'elevate your vibration', 'intricate', 'seamless', 'leverage',
  'paramount', 'plethora', 'myriad', 'beacon', 'conduit',
  "in today's fast-paced", "it's important to note",
  'pave the way', 'when it comes to', 'moreover', 'furthermore',
];

// M6 必填缓和语（每篇 M6 各出现一次）
const M6_MUST_1 = 'These are traditional elemental guidelines, not hard rules';
const M6_MUST_2 = 'Trust how a stone feels to you';

// 生肖 slug → animal key（用于文化锁死校验）
const animalKeys = Object.keys(KNOW.animals);

let totalWords = 0;
let placeholderIssues = [], m6HardIssues = [], complianceIssues = [], deterministicIssues = [];
let wordCountIssues = [], cultureIssues = [], m6MustFillIssues = [], chemIssues = [];
let softStats = {};
let checked = 0, details = [];

for (const art of list) {
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
  const words = content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').split(/\s+/).filter(Boolean).length;
  totalWords += words;
  const minWords = art.slug === 'find-your-sign' ? 300 : (art.is_hub ? 800 : 1800); // find-your-sign 静态年表页 300，hub 800，生肖 1800
  if (words < minWords) wordCountIssues.push(`${art.slug}(${words}, 需≥${minWords})`);

  // 3. M6 避讳石硬化禁词（裸用）
  for (const b of M6_HARD_BANNED) {
    if (lower.includes(b)) m6HardIssues.push(`${art.slug}: "${b}"`);
  }

  // 4. 合规红线（确定性 claim）
  for (const b of COMPLIANCE_BANNED) {
    if (lower.includes(b)) complianceIssues.push(`${art.slug}: "${b}"`);
  }

  // 5. 确定论语言（软）
  for (const b of DETERMINISTIC_SOFT) {
    if (lower.includes(b)) deterministicIssues.push(`${art.slug}: "${b}"`);
  }

  // 6. M6 必填缓和语（仅生肖页有 M6，hub 无）
  if (!art.is_hub && art.slug.endsWith('-crystals')) {
    if (!content.includes(M6_MUST_1)) m6MustFillIssues.push(`${art.slug}: 缺必填①`);
    if (!content.includes(M6_MUST_2)) m6MustFillIssues.push(`${art.slug}: 缺必填②`);
  }

  // 7. 文化锁死校验（生肖页：本命佛/五行 vs knowledge.json）
  if (!art.is_hub && art.slug.endsWith('-crystals')) {
    const akey = animalKeys.find(k => art.slug.startsWith(k + '-'));
    if (akey) {
      const k = KNOW.animals[akey];
      // 本命佛：文章应包含 knowledge 里的本命佛名（中文或英文部分）
      const buddhaParts = k.affiliate_buddha.split(/[()（）]/).filter(Boolean);
      const hasBuddha = buddhaParts.some(p => p.trim().length > 2 && content.includes(p.trim()));
      if (!hasBuddha) cultureIssues.push(`${art.slug}: 本命佛(${k.affiliate_buddha})未提及`);
      // 五行：文章应包含 element
      if (!content.includes(k.element)) cultureIssues.push(`${art.slug}: 元素(${k.element})未提及`);
    }
  }

  // 8. 去AI化禁词（软）
  for (const b of SOFT_BANNED) {
    const cnt = lower.split(b).length - 1;
    if (cnt > 0) softStats[b] = (softStats[b] || 0) + cnt;
  }

  details.push({ slug: art.slug, words, ph: phCount });
}

console.log(`\n===== Chinese Zodiac 校验（${checked}篇）=====`);
details.forEach(d => console.log(`  ${d.slug}: ${d.words} 词, 占位符 ${d.ph}`));
console.log(`平均词数: ${checked ? Math.round(totalWords / checked) : 0}`);

console.log(`\n[硬] 占位符残留: ${placeholderIssues.length} 篇`);
if (placeholderIssues.length) console.log('  ' + placeholderIssues.join(', '));

console.log(`\n[硬] 字数不足: ${wordCountIssues.length} 篇`);
if (wordCountIssues.length) console.log('  ' + wordCountIssues.join(', '));

console.log(`\n[硬] M6避讳石裸用禁词: ${m6HardIssues.length} 处（框架§6.2 强制改写）`);
if (m6HardIssues.length) m6HardIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[硬] 合规红线(确定性claim): ${complianceIssues.length} 处`);
if (complianceIssues.length) complianceIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[硬] M6必填缓和语缺失: ${m6MustFillIssues.length} 处`);
if (m6MustFillIssues.length) m6MustFillIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[硬] 文化锁死校验(本命佛/五行): ${cultureIssues.length} 处`);
if (cultureIssues.length) cultureIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[软] 确定论语言: ${deterministicIssues.length} 处`);
if (deterministicIssues.length) deterministicIssues.slice(0, 15).forEach(h => console.log('  ' + h));

console.log(`\n[软] 去AI化禁词统计:`);
const sorted = Object.entries(softStats).sort((a, b) => b[1] - a[1]);
if (sorted.length) sorted.forEach(([w, c]) => console.log(`  ${w}: ${c}`));
else console.log('  (无)');

const allHard = placeholderIssues.length + wordCountIssues.length + m6HardIssues.length + complianceIssues.length + m6MustFillIssues.length + cultureIssues.length;
console.log(`\n===== 硬规则总计: ${allHard}（必须为 0）=====`);
process.exit(allHard > 0 ? 1 : 0);
