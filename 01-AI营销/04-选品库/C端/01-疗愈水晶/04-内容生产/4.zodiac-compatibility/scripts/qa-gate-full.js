/**
 * QA Gate Full — 78 篇全面检查（非抽检）
 *
 * 检查项（基于二次审核发现的系统性问题）：
 *   1. Crystal Pair 覆盖：模块4-9正文是否提及 signA/signB/harmony 3块石头
 *   2. 空白内链表：模块14 Other Signs 的表格是否为空（同星座配对风险高）
 *   3. Related links 重复：模块16 链接是否重复（同星座配对风险高）
 *   4. 模块13语法：Famous Couples 段是否有语法错误（同星座的 its/their 问题）
 *   5. 句式开头多样性：模块4-9各段的开头词跨篇统计（检测模板化）
 *   6. Kill List + 边界声明 + 占位残留 + 相似度（继承 qa-gate.js）
 *   7. 每段词数（模块4-9是否在200-250词范围）
 *
 * 输出：qa-report-full.json + 控制台摘要
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../articles');
const REPORT_FILE = path.resolve(__dirname, '../qa-report-full.json');
const PAIRING_FILE = path.resolve(__dirname, '../pairing-data.json');

const pd = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));
const KILL_LIST = ['delve','leverage','tapestry','landscape','seamless','robust','moreover','furthermore','ultimately'];
const BOUNDARY = ['traditionally','many couples','many people','not a substitute','entertainment'];

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
console.log(`📊 QA Gate FULL: 全面检查 ${files.length} 篇文章\n`);

const results = [];
const moduleStarts = {}; // 开头词统计

for (const file of files) {
  const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
  const slug = file.replace('.json', '');
  const pairing = pd.pairs[slug];
  const text = a.content;
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const lower = plain.toLowerCase();
  const issues = [];

  // ── 1. Crystal Pair 覆盖 ──
  if (pairing) {
    const c = pairing.crystals;
    const mod49Match = text.match(/<h2>[^<]*Love[^<]*<\/h2>([\s\S]*?)<h2>[^<]*Best Crystal Pair/);
    const mod49Text = mod49Match ? mod49Match[1].replace(/<[^>]+>/g, ' ').toLowerCase() : '';

    for (const [role, stone] of [['signA', c.signA], ['signB', c.signB], ['harmony', c.harmony]]) {
      const stoneName = stone.replace(/-/g, ' ');
      if (!mod49Text.includes(stoneName) && !mod49Text.includes(stone)) {
        issues.push(`CRYSTAL_MISSING: ${role} (${stone}) not mentioned in modules 4-9`);
      }
    }
  }

  // ── 2. 空白内链表 ──
  const emptyTbody = text.match(/<tbody>\s*<\/tbody>/g);
  if (emptyTbody) {
    issues.push(`EMPTY_TABLE: ${emptyTbody.length} empty <tbody> (Other Signs links broken)`);
  }

  // ── 3. Related links 重复 ──
  const relatedMatch = text.match(/<h2>Related<\/h2>([\s\S]*?)$/);
  if (relatedMatch) {
    const links = relatedMatch[1].match(/href="([^"]+)"/g) || [];
    const unique = new Set(links);
    if (links.length !== unique.size) {
      issues.push(`DUPLICATE_LINKS: ${links.length - unique.size} duplicate links in Related`);
    }
  }

  // ── 4. 模块13语法（同星座占位替换） ──
  const famousMatch = text.match(/<h2>Famous[^<]*Couples<\/h2>\s*<p>([\s\S]*?)<\/p>/);
  if (famousMatch) {
    const fText = famousMatch[1];
    if (fText.includes("its own reflection") && slug.split('-')[0] === slug.split('-')[1]) {
      issues.push(`GRAMMAR: same-sign Famous Couples has "its own reflection" error`);
    }
  }

  // ── 5. 模块4-9开头词（检测模板化） ──
  const mod49Sections = ['Love', 'Friendship', 'Sexual', 'Marriage', 'Communication', 'Challenges'];
  for (const mod of mod49Sections) {
    const regex = new RegExp(`<h2>[^<]*${mod}[^<]*</h2>\\s*<p>([^<]{0,80})`, 'i');
    const match = text.match(regex);
    if (match) {
      const firstWord = match[1].trim().split(/\s+/)[0].toLowerCase();
      const key = `${mod}:${firstWord}`;
      moduleStarts[key] = (moduleStarts[key] || 0) + 1;
    }
  }

  // ── 6. Kill List ──
  let killCount = 0;
  for (const w of KILL_LIST) {
    killCount += (lower.match(new RegExp(w, 'g')) || []).length;
  }
  if (killCount > 5) issues.push(`KILL_LIST: ${killCount}`);

  // ── 7. 边界声明 ──
  let boundaryCount = 0;
  for (const term of BOUNDARY) {
    boundaryCount += (lower.match(new RegExp(term, 'g')) || []).length;
  }
  if (boundaryCount < 2) issues.push(`BOUNDARY_LOW: ${boundaryCount}`);

  // ── 8. 占位残留 ──
  if (text.includes('<!-- MODULE')) issues.push('PLACEHOLDER_FOUND');

  // ── 9. 词数 ──
  const wc = plain.split(/\s+/).filter(Boolean).length;
  if (wc < 1800) issues.push(`WORD_COUNT_LOW: ${wc}`);

  // ── 10. 模块4-9各段词数 ──
  for (const mod of mod49Sections) {
    const regex = new RegExp(`<h2>[^<]*${mod}[^<]*</h2>([\\s\\S]*?)<h2>`, 'i');
    const match = text.match(regex);
    if (match) {
      const modText = match[1].replace(/<[^>]+>/g, ' ');
      const modWc = modText.split(/\s+/).filter(Boolean).length;
      if (modWc < 150) issues.push(`SHORT_MODULE: ${mod} only ${modWc} words`);
    }
  }

  results.push({ slug, issues, killCount, boundaryCount, wordCount: wc });
}

// ─── 句式开头模板化统计 ───
const templateRisks = Object.entries(moduleStarts)
  .filter(([k, v]) => v > 10) // 同一模块+同一开头词出现超过10次
  .sort((a, b) => b[1] - a[1]);

// ─── 汇总 ───
const allIssues = results.filter(r => r.issues.length > 0);
const issueTypes = {};
for (const r of allIssues) {
  for (const issue of r.issues) {
    const type = issue.split(':')[0];
    issueTypes[type] = (issueTypes[type] || 0) + 1;
  }
}

const report = {
  total: results.length,
  checked_at: new Date().toISOString(),
  summary: {
    clean: results.length - allIssues.length,
    has_issues: allIssues.length,
    issue_types: issueTypes,
  },
  template_risks: templateRisks,
  issue_articles: allIssues,
  all_results: results.map(r => ({ slug: r.slug, issues: r.issues.length, kill: r.killCount, boundary: r.boundaryCount, wc: r.wordCount })),
};

fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');

// ─── 控制台摘要 ───
console.log('========================================');
console.log('QA Gate FULL — 全面检查报告');
console.log('========================================\n');

console.log(`总计：${results.length} 篇`);
console.log(`干净：${report.summary.clean} 篇`);
console.log(`有问题：${report.summary.has_issues} 篇\n`);

console.log('问题类型统计：');
for (const [type, count] of Object.entries(issueTypes).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count} 篇`);
}

console.log('\n句式模板化风险（同一模块+同一开头词 >10次）：');
if (templateRisks.length === 0) {
  console.log('  ✅ 无明显模板化');
} else {
  templateRisks.slice(0, 10).forEach(([k, v]) => console.log(`  ⚠️  ${k}: ${v} 篇`));
}

console.log(`\n问题文章清单（前 20）：`);
allIssues.slice(0, 20).forEach(r => {
  console.log(`  ${r.slug}: ${r.issues.join(' | ')}`);
});

console.log(`\n📄 完整报告 → ${REPORT_FILE}`);
