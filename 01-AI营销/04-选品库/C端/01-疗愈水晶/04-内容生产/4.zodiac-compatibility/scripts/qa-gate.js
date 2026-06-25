/**
 * QA Gate — 78 篇文章发布前量化门禁
 *
 * 检查项（对齐框架 §10.4）：
 *   1. Kill List 禁用词 ≤5/篇
 *   2. 占位残留 = 0
 *   3. 边界声明（traditionally / many couples / many people）≥2/篇
 *   4. 同构翻转句（"It's not just X, it's Y" / "Not only... but also"）≤4/篇
 *   5. 78 篇间相似度（模块4-9的文本指纹，Jaccard相似度 > 0.7 标红）
 *
 * 输出：qa-report.json + 控制台摘要
 * 用法：node qa-gate.js
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../articles');
const REPORT_FILE = path.resolve(__dirname, '../qa-report.json');

// Kill List（框架 §10.1 + 07 工作流）
const KILL_LIST = [
  'delve', 'leverage', 'tapestry', 'landscape', 'seamless',
  'robust', 'moreover', 'furthermore', 'ultimately',
  "it's not just", "not only", "let's dive", "picture this",
  'in today\'s world', 'it\'s worth noting', 'when it comes to',
  'on the other hand', 'the key takeaway', 'navigating the',
];

// 同构翻转句模式
const FLIP_PATTERNS = [
  /it's not just\s+\w+.*?it's/gi,
  /not.*?but\s+also/gi,
  /less\s+\w+\s+and\s+more\s+\w+/gi,
  /whether\s+or\s+not/gi,
];

// 边界声明关键词
const BOUNDARY_TERMS = [
  'traditionally', 'many couples', 'many people', 'traditionally tied',
  'traditionally associated', 'in crystal tradition', 'crystal traditions',
  'not a substitute', 'not medical', 'entertainment',
];

// ─── 读取所有文章 ───
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
console.log(`📊 QA Gate: 检查 ${files.length} 篇文章\n`);

const articles = [];
const issues = [];

for (const file of files) {
  const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
  const slug = file.replace('.json', '');
  const text = a.content;
  const lowerText = text.toLowerCase();

  // 提取纯文本（去 HTML 标签）
  const plainText = text.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const lowerPlain = plainText.toLowerCase();

  // 1. Kill List
  const killHits = [];
  for (const word of KILL_LIST) {
    const matches = lowerPlain.match(new RegExp(word.replace(/'/g, "'"), 'gi'));
    if (matches) killHits.push({ word, count: matches.length });
  }
  const killCount = killHits.reduce((s, k) => s + k.count, 0);

  // 2. 占位残留
  const placeholders = (text.match(/<!--\s*MODULE/g) || []).length;

  // 3. 边界声明
  let boundaryCount = 0;
  for (const term of BOUNDARY_TERMS) {
    const matches = lowerPlain.match(new RegExp(term, 'gi'));
    if (matches) boundaryCount += matches.length;
  }

  // 4. 同构翻转句
  let flipCount = 0;
  for (const pattern of FLIP_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) flipCount += matches.length;
  }

  // 词数
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // 提取模块 4-9（用于相似度计算）
  const mod49Match = text.match(
    /<h2>[^<]*Love[^<]*<\/h2>([\s\S]*?)<h2>[^<]*Best Crystal Pair/
  );
  const mod49Text = mod49Match
    ? mod49Match[1].replace(/<[^>]+>/g, ' ').toLowerCase().split(/\s+/).filter(w => w.length > 3)
    : [];

  const article = {
    slug,
    killCount,
    killHits: killHits.length > 0 ? killHits : undefined,
    placeholders,
    boundaryCount,
    flipCount,
    wordCount,
    mod49Words: new Set(mod49Text),
    issues: [],
  };

  // 判定
  if (killCount > 5) article.issues.push(`KILL_LIST_EXCEED (${killCount}>5)`);
  if (placeholders > 0) article.issues.push(`PLACEHOLDER (${placeholders})`);
  if (boundaryCount < 2) article.issues.push(`BOUNDARY_LOW (${boundaryCount}<2)`);
  if (flipCount > 4) article.issues.push(`FLIP_EXCEED (${flipCount}>4)`);
  if (wordCount < 1500) article.issues.push(`WORD_COUNT_LOW (${wordCount})`);

  articles.push(article);
  if (article.issues.length > 0) issues.push(article);
}

// ─── 5. 相似度检查（模块4-9文本指纹 Jaccard）───
console.log('🔍 计算相似度...');
const similarityIssues = [];
const SIMILARITY_THRESHOLD = 0.6; // Jaccard > 0.6 标黄, > 0.7 标红

for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    const a = articles[i].mod49Words;
    const b = articles[j].mod49Words;
    if (a.size === 0 || b.size === 0) continue;

    // Jaccard similarity
    let intersection = 0;
    for (const w of a) { if (b.has(w)) intersection++; }
    const union = a.size + b.size - intersection;
    const sim = intersection / union;

    if (sim > SIMILARITY_THRESHOLD) {
      similarityIssues.push({
        pair: `${articles[i].slug} × ${articles[j].slug}`,
        similarity: parseFloat(sim.toFixed(3)),
        severity: sim > 0.7 ? 'RED' : 'YELLOW',
      });
    }
  }
}

similarityIssues.sort((a, b) => b.similarity - a.similarity);

// ─── 报告 ───
const report = {
  total_articles: articles.length,
  checked_at: new Date().toISOString(),
  summary: {
    kill_list_pass: articles.filter(a => a.killCount <= 5).length,
    kill_list_fail: articles.filter(a => a.killCount > 5).length,
    placeholder_pass: articles.filter(a => a.placeholders === 0).length,
    placeholder_fail: articles.filter(a => a.placeholders > 0).length,
    boundary_pass: articles.filter(a => a.boundaryCount >= 2).length,
    boundary_fail: articles.filter(a => a.boundaryCount < 2).length,
    flip_pass: articles.filter(a => a.flipCount <= 4).length,
    flip_fail: articles.filter(a => a.flipCount > 4).length,
    similarity_pairs_checked: articles.length * (articles.length - 1) / 2,
    similarity_red: similarityIssues.filter(s => s.severity === 'RED').length,
    similarity_yellow: similarityIssues.filter(s => s.severity === 'YELLOW').length,
  },
  issue_articles: issues.map(a => ({
    slug: a.slug,
    issues: a.issues,
    killCount: a.killCount,
    killHits: a.killHits,
    placeholders: a.placeholders,
    boundaryCount: a.boundaryCount,
    flipCount: a.flipCount,
    wordCount: a.wordCount,
  })),
  similarity_issues: similarityIssues.slice(0, 30), // top 30
  all_articles: articles.map(a => ({
    slug: a.slug,
    kill: a.killCount,
    boundary: a.boundaryCount,
    flip: a.flipCount,
    words: a.wordCount,
    placeholders: a.placeholders,
  })),
};

fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');

// ─── 控制台摘要 ───
console.log('\n========================================');
console.log('QA Gate Report — 78 篇文章');
console.log('========================================\n');

console.log('指标通过率：');
console.log(`  Kill List (≤5/篇):     ${report.summary.kill_list_pass}/${articles.length} 通过, ${report.summary.kill_list_fail} 失败`);
console.log(`  占位残留 (=0):          ${report.summary.placeholder_pass}/${articles.length} 通过, ${report.summary.placeholder_fail} 失败`);
console.log(`  边界声明 (≥2/篇):       ${report.summary.boundary_pass}/${articles.length} 通过, ${report.summary.boundary_fail} 失败`);
console.log(`  同构翻转 (≤4/篇):       ${report.summary.flip_pass}/${articles.length} 通过, ${report.summary.flip_fail} 失败`);
console.log(`  相似度 (>0.7 RED):      ${report.summary.similarity_red} 对标红, ${report.summary.similarity_yellow} 对标黄`);

console.log(`\n问题文章：${issues.length} 篇`);
if (issues.length > 0 && issues.length <= 20) {
  issues.forEach(a => console.log(`  ⚠️  ${a.slug}: ${a.issues.join(', ')}`));
}

console.log(`\n相似度 TOP 5：`);
similarityIssues.slice(0, 5).forEach(s => {
  console.log(`  ${s.severity === 'RED' ? '🔴' : '🟡'} ${s.pair}: ${s.similarity}`);
});

console.log(`\n📄 完整报告 → ${REPORT_FILE}`);
