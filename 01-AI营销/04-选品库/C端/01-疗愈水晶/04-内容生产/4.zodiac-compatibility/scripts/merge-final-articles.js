/**
 * 合并参数化模板 + agent 模块 4-9 → 78 篇完整文章 JSON
 *
 * 读取：
 *   - article-templates.json（78 组，含占位 <!-- MODULES_4_9:{slug} -->）
 *   - agent{1-5}-modules.json（模块 4-9 内容）
 *
 * 输出：
 *   - articles/ 目录下 78 个独立 JSON 文件（每篇一个，格式对齐 aries-crystals.json）
 *   - articles-index.json（索引）
 *
 * 用法：node merge-final-articles.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_FILE = path.join(ROOT, 'article-templates.json');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const INDEX_FILE = path.join(ROOT, 'articles-index.json');

const templates = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));

// ─── 读取所有 agent modules（处理两种格式）───
const agentFiles = [1, 2, 3, 4, 5].map(n =>
  path.join(__dirname, `agent${n}-modules.json`)
);

const allModules = {}; // {slug: {love, friendship, sexual, marriage, communication, challenges}}

for (const f of agentFiles) {
  const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
  // 两种格式：直接 {slug: {...}} 或 {_meta, pairs: {slug: {...}}}
  const data = raw.pairs || raw;
  for (const [slug, mods] of Object.entries(data)) {
    // 跳过 _meta 等非 slug key
    if (slug.startsWith('_') || typeof mods !== 'object') continue;
    if (!mods.love && !mods.friendship) continue; // 不是配对数据
    if (allModules[slug]) {
      console.warn(`⚠️  重复 slug: ${slug}`);
    }
    allModules[slug] = mods;
  }
}

console.log(`📊 Agent modules 合并：${Object.keys(allModules).length} 组`);

// ─── 创建 articles 目录 ───
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

// ─── 合并 + 输出 ───
const index = [];
let merged = 0, missing = 0;

for (const [slug, tpl] of Object.entries(templates)) {
  const mods = allModules[slug];
  if (!mods) {
    console.warn(`⚠️  缺少模块 4-9: ${slug}`);
    missing++;
    continue;
  }

  // 组装模块 4-9 的 HTML
  const modules49 = [
    mods.love,
    mods.friendship,
    mods.sexual,
    mods.marriage,
    mods.communication,
    mods.challenges,
  ].filter(Boolean).join('\n\n');

  // 替换占位
  let content = tpl.content.replace(
    `<!-- MODULES_4_9:${slug} -->`,
    modules49
  );

  // 构建完整文章（格式对齐 aries-crystals.json）
  const article = {
    title: tpl.title,
    slug: tpl.slug,
    excerpt: tpl.excerpt,
    rank_math_title: tpl.rank_math_title,
    rank_math_description: tpl.rank_math_description,
    rank_math_focus_keyword: tpl.rank_math_focus_keyword,
    content: content,
  };

  // 写独立文件
  const outFile = path.join(ARTICLES_DIR, `${slug}.json`);
  fs.writeFileSync(outFile, JSON.stringify(article, null, 2), 'utf8');

  // 索引
  index.push({
    slug: slug,
    title: tpl.title,
    file: `articles/${slug}.json`,
    word_count: content.split(/\s+/).length,
  });

  merged++;
}

// 写索引
fs.writeFileSync(INDEX_FILE, JSON.stringify({
  total: merged,
  generated_at: new Date().toISOString(),
  articles: index.sort((a, b) => a.slug.localeCompare(b.slug)),
}, null, 2), 'utf8');

console.log(`\n✅ 合并完成`);
console.log(`   ${merged} 篇文章 → ${ARTICLES_DIR}/`);
console.log(`   ${missing} 篇缺失`);
console.log(`   索引 → ${INDEX_FILE}`);

// 质量统计
if (index.length > 0) {
  const wcs = index.map(a => a.word_count);
  const avg = Math.round(wcs.reduce((a, b) => a + b, 0) / wcs.length);
  const min = Math.min(...wcs);
  const max = Math.max(...wcs);
  console.log(`\n📋 字数统计：avg ${avg} / min ${min} / max ${max}`);
}
