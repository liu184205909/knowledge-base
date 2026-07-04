/**
 * 核查塔罗数据层所有 crystal slug vs 390 库真实 slug，找不一致（潜在死链）
 * 扫描：tarot-knowledge.json + 13.tarot/configs/*.json 里所有水晶相关 slug
 * 比对：04-内容生产/1.crystal-meaning/*-meaning.json 的 slug 字段（URL 真源）
 * 用法：node check-crystal-slugs.js
 */
const fs = require('fs'), path = require('path');
const BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';
const DB_DIR = path.join(BASE, '04-内容生产/1.crystal-meaning');

// --- 1. 加载 390 库真实 slug 集合 ---
const dbSlugs = new Map(); // slug -> file
for (const f of fs.readdirSync(DB_DIR).filter(f => f.endsWith('.json'))) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DB_DIR, f), 'utf8'));
    if (j.slug) dbSlugs.set(j.slug, f);
  } catch (e) {}
}
console.log(`390 库 ${dbSlugs.size} 颗水晶 slug（URL 真源 /gemstone/{slug}/）`);

// --- 2. 递归收集所有水晶相关 slug ---
const found = new Map(); // slug -> [出现路径]
function add(slug, p) {
  if (!found.has(slug)) found.set(slug, []);
  found.get(slug).push(p);
}
function walk(obj, p) {
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    const path_ = p ? `${p}.${k}` : k;
    if (typeof v === 'string') {
      // yes-no 用 "crystal": "rose-quartz"
      if (k === 'crystal' && v) add(v, path_);
      // crystals.X.slug (路径含 crystal)
      else if (k === 'slug' && /crystal/i.test(path_)) add(v, path_);
    } else if (typeof v === 'object') {
      walk(v, path_);
    }
  }
}

// --- 3. 扫描所有数据源 ---
const sources = [
  ['tarot-knowledge.json', path.join(BASE, '07-互动工具/_shared/tarot-knowledge.json')],
];
const configsDir = path.join(BASE, '04-内容生产/13.tarot/configs');
if (fs.existsSync(configsDir)) {
  for (const f of fs.readdirSync(configsDir).filter(f => f.endsWith('.json'))) {
    sources.push(['configs/' + f, path.join(configsDir, f)]);
  }
}
for (const [name, file] of sources) {
  if (!fs.existsSync(file)) continue;
  try {
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    walk(j, name);
  } catch (e) { console.log(`⚠ 解析失败 ${name}: ${e.message}`); }
}

console.log(`\n塔罗数据层共引用 ${found.size} 个唯一水晶 slug（跨 ${sources.length} 个文件）`);

// --- 4. 比对 ---
const ok = [], missing = [];
for (const [slug, paths] of found) {
  if (dbSlugs.has(slug)) ok.push([slug, paths]);
  else {
    const meaningVariant = dbSlugs.has(slug + '-meaning') ? slug + '-meaning' : null;
    missing.push({ slug, paths, count: paths.length, meaningVariant });
  }
}

console.log(`\n=== ✅ 一致（${ok.length}）===`);
for (const [s] of ok) console.log(`  ${s}`);

console.log(`\n=== ❌ 不一致 / 潜在死链（${missing.length}）===`);
for (const m of missing) {
  console.log(`\n  "${m.slug}"  ×${m.count}  ${m.meaningVariant ? `→ 应为 "${m.meaningVariant}"` : '→ 390 库无此 slug 也无 -meaning 变体'}`);
  console.log(`    出现于: ${m.paths.slice(0, 4).join(' | ')}${m.paths.length > 4 ? ' ...' : ''}`);
}

// --- 5. 汇总建议 ---
console.log(`\n=== 汇总 ===`);
console.log(`一致 ${ok.length} / 不一致 ${missing.length}`);
const fixable = missing.filter(m => m.meaningVariant);
const noVariant = missing.filter(m => !m.meaningVariant);
if (fixable.length) console.log(`可自动修（加 -meaning 后缀）: ${fixable.map(m => `${m.slug}→${m.meaningVariant}`).join(', ')}`);
if (noVariant.length) console.log(`需人工核对（390 库无变体）: ${noVariant.map(m => m.slug).join(', ')}`);
