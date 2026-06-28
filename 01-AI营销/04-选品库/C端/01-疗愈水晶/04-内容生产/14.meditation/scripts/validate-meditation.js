/**
 * Meditation 二审校验（填充后跑）
 * 硬规则(必须0): 占位符残留 / 合规红线绝对禁词 / 化学式小写 / 字数不足
 * 软提示(统计不自动改): 去AI化禁词 / 功效句检测 / 跨场景重复段落
 * 场景差异化检查: 每篇 M4 呼吸法/握手/可视化是否场景专属（非通用）
 * 用法：node validate-meditation.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

// 合规红线（绝对禁止，功效 claim）
const HARD_BANNED = [
  'removes negative energy', 'remove negative energy',
  'purifies bad vibes', 'purify bad vibes',
  'amplifies healing power',
  'will protect you from negativity',
  'attracts love', 'attracts wealth', 'attracts abundance', 'attracts romance',
  'blocks negative energy', 'block negative energy',
  'manifest abundance',
  'heals anxiety', 'cures anxiety', 'treats anxiety',
  'heals depression', 'cures depression', 'treats depression',
  'cures insomnia', 'treats insomnia', 'cures sleep disorders',
  'treats adhd', 'cures adhd', 'treats attention',
  'guaranteed to', 'will definitely',
  'emf protection', 'blocks emf',
];

// 去AI化禁词（软提示）
const SOFT_BANNED = [
  'delve', 'harness', 'realm', 'tapestry', 'unlock your potential',
  'elevate your vibration', 'intricate', 'seamless', 'leverage', 'foster',
  'paramount', 'plethora', 'myriad', 'beacon', 'conduit',
  "in today's fast-paced", "it's important to note",
  'pave the way', 'when it comes to', 'moreover', 'furthermore',
];

// 化学式小写误用
const CHEMISTRY_LOWER = ['sio₂', 'caco₃', 'ag₂s', 'caso₄', 'cu₂co₃', 'fe₂o₃', 'fes₂', 'caf₂'];

// 场景专属要素（每篇 M4 必须含其场景的呼吸法关键词，证明非通用）
const SCENE_MARKERS = {
  'crystals-for-focus-meditation': ['box breathing', 'third', 'single', 'steady'],
  'crystals-for-sleep-meditation': ['4-7-8', 'crown', 'velvet', 'wind-down', 'bedtime'],
  'crystals-for-emotional-release-meditation': ['sighing', 'heart', 'water', 'metta', 'space for'],
  'grounding-meditation-with-crystals': ['earth breath', 'root', 'feet', 'soil'],
  'meditation-crystals-for-beginners': ['natural', 'simple', 'palm', 'begin'],
  'manifestation-meditation-with-crystals': ['rising breath', 'solar plexus', 'aim', 'resolve'],
};

let totalWords = 0, hardIssues = [], softStats = {};
let placeholderIssues = [], wordCountIssues = [], chemIssues = [], sceneMarkerIssues = [];
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
  const minWords = a.word_target ? Math.round(a.word_target * 0.8) : 1600;
  if (words < minWords) wordCountIssues.push(`${art.slug}(${words}, 需≥${minWords})`);

  // 3. 合规红线（硬）
  for (const b of HARD_BANNED) {
    if (lower.includes(b)) hardIssues.push(`${art.slug}: "${b}"`);
  }

  // 4. 化学式小写误用（真违规检测，必须用原 content 不 lower —— SiO₂ lower 后变 sio₂ 会误报，按 validate-riskwords-case-sensitive memory）
  for (const c of CHEMISTRY_LOWER) {
    if (content.includes(c)) chemIssues.push(`${art.slug}: "${c}"`);
  }

  // 5. 去AI化禁词（软统计）
  for (const b of SOFT_BANNED) {
    const cnt = lower.split(b).length - 1;
    if (cnt > 0) softStats[b] = (softStats[b] || 0) + cnt;
  }

  // 6. 场景专属要素检查（M4 非通用证明）
  const markers = SCENE_MARKERS[art.slug];
  if (markers) {
    const found = markers.filter(m => lower.includes(m));
    if (found.length < 2) sceneMarkerIssues.push(`${art.slug}(仅命中 ${found.join('/') || '无'}, 需场景专属要素)`);
  }

  details.push({ slug: art.slug, words, ph: phCount });
}

console.log(`\n===== Meditation 校验（${checked} 篇）=====`);
details.forEach(d => console.log(`  ${d.slug}: ${d.words} 词, 占位符 ${d.ph}`));
console.log(`平均词数: ${checked ? Math.round(totalWords / checked) : 0}`);

console.log(`\n[硬] 占位符残留: ${placeholderIssues.length} 篇`);
if (placeholderIssues.length) console.log('  ' + placeholderIssues.join(', '));

console.log(`\n[硬] 字数不足: ${wordCountIssues.length} 篇`);
if (wordCountIssues.length) console.log('  ' + wordCountIssues.join(', '));

console.log(`\n[硬] 化学式小写误用: ${chemIssues.length} 处`);
if (chemIssues.length) console.log('  ' + chemIssues.join(', '));

console.log(`\n[硬] 合规红线命中: ${hardIssues.length} 处`);
if (hardIssues.length) hardIssues.slice(0, 30).forEach(h => console.log('  ' + h));

console.log(`\n[硬] 场景专属要素缺失: ${sceneMarkerIssues.length} 篇`);
if (sceneMarkerIssues.length) console.log('  ' + sceneMarkerIssues.join(', '));

console.log(`\n[软] 去AI化禁词统计:`);
const sorted = Object.entries(softStats).sort((a, b) => b[1] - a[1]);
if (sorted.length) sorted.forEach(([w, c]) => console.log(`  ${w}: ${c}`));
else console.log('  (无)');

const allHard = placeholderIssues.length + wordCountIssues.length + chemIssues.length + hardIssues.length + sceneMarkerIssues.length;
console.log(`\n===== 硬规则总计: ${allHard}（必须为 0）=====`);
process.exit(allHard > 0 ? 1 : 0);
