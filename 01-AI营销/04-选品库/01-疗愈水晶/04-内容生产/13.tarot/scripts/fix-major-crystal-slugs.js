/**
 * fix-major-crystal-slugs.js
 * 把 tarot-knowledge.json（22 Major）的 cards[].crystals.{5角色}.slug
 * 从短形式（quartz）改为 390 库对齐的 -meaning 形式（quartz-meaning）。
 *
 * 改前必做：每 slug 确认 04-内容生产/1.crystal-meaning/{slug}-meaning.json 存在才改。
 * 同步依赖（避免源头改 -meaning 后消费方失配）：
 *   1. 13.tarot/scripts/generate-articles.js   DISPLAY_OVERRIDES key + ATTR[slug+'-meaning']
 *   2. 13.tarot/scripts/qc-checks.js            ATTR[slug+'-meaning']
 *   3. 6 个 tarot 工具页 generate.js enrichStone   BY_SLUG[s.slug]（search-data key 是短 slug）
 *   4. 13.tarot/_qc/_cta-by-slug.json           key 加 -meaning（孤儿 QC 快照，无代码消费，保持一致）
 *
 * 归一化策略：消费方加 normSlug() = slug.replace(/-meaning$/,'')，兼容新 -meaning 源头 + 老 短 slug。
 *
 * 用法：node fix-major-crystal-slugs.js
 * 回滚：git checkout -- 07-互动工具/_shared/tarot-knowledge.json 04-内容生产/13.tarot/scripts/*.js
 *       或从 07-互动工具/_shared/tarot-knowledge.json.bak-pre-slug-fix 恢复
 */
const fs = require('fs'), path = require('path');

const BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';
const DB_DIR = path.join(BASE, '04-内容生产/1.crystal-meaning');
const ROLES = ['best_overall', 'best_upright', 'best_reversed', 'best_love', 'best_daily_wear'];

// ===== 1. 加载 390 库有效 slug 集合（xxx-meaning 形式）=====
const validMeaning = new Set();
for (const f of fs.readdirSync(DB_DIR).filter(f => f.endsWith('-meaning.json'))) {
  validMeaning.add(f.slice(0, -5)); // 去 .json，得 xxx-meaning
}
console.log(`390 库 ${validMeaning.size} 颗 -meaning slug`);

// ===== 2. 改 tarot-knowledge.json 源头 =====
const KNOW_PATH = path.join(BASE, '07-互动工具/_shared/tarot-knowledge.json');
const know = JSON.parse(fs.readFileSync(KNOW_PATH, 'utf8'));

let changed = 0;        // 改的 slug 出现次数（含重复）
const uniqueChanged = new Set();
const skipped = [];     // 390 库无对应文件的（应不存在）

for (const card of know.cards) {
  const cr = card.crystals || {};
  for (const role of ROLES) {
    const v = cr[role];
    if (!v) continue;
    if (Array.isArray(v)) {
      for (const it of v) {
        if (it && typeof it.slug === 'string' && !it.slug.endsWith('-meaning')) {
          const tgt = it.slug + '-meaning';
          if (validMeaning.has(tgt)) {
            it.slug = tgt; changed++; uniqueChanged.add(it.slug);
          } else {
            skipped.push({ card: card.slug, role, slug: it.slug, reason: '390 库无 ' + tgt });
          }
        }
      }
    } else if (v && typeof v.slug === 'string' && !v.slug.endsWith('-meaning')) {
      const tgt = v.slug + '-meaning';
      if (validMeaning.has(tgt)) {
        v.slug = tgt; changed++; uniqueChanged.add(v.slug);
      } else {
        skipped.push({ card: card.slug, role, slug: v.slug, reason: '390 库无 ' + tgt });
      }
    }
  }
}

fs.writeFileSync(KNOW_PATH, JSON.stringify(know, null, 2) + '\n', 'utf8');
console.log(`\n[tarot-knowledge.json] 改 ${changed} 处 slug，unique ${uniqueChanged.size} 个`);
console.log(`  改的 unique slug:`, [...uniqueChanged].sort().join(', '));
if (skipped.length) {
  console.log(`  ⚠ 跳过 ${skipped.length} 处（390 库无对应文件）:`);
  for (const s of skipped) console.log(`    ${s.card}/${s.role}: ${s.slug} (${s.reason})`);
} else {
  console.log(`  ✓ 全部 31 个短 slug 都有对应 -meaning.json，无跳过`);
}

// ===== 3. 同步消费方：归一化函数 normSlug =====
const NORM_HELP = `
// >>>>>>> added by fix-major-crystal-slugs.js (兼容 tarot-knowledge -meaning slug + search-data 短 slug key)
function normSlug(s){ return s ? String(s).replace(/-meaning$/,'') : s; }
// <<<<<<< added by fix-major-crystal-slugs.js`;

// --- 3a. 13.tarot/scripts/generate-articles.js ---
(function patchGenerateArticles() {
  const f = path.join(BASE, '04-内容生产/13.tarot/scripts/generate-articles.js');
  if (!fs.existsSync(f)) return console.log('\n[generate-articles.js] 跳过（不存在）');
  let src = fs.readFileSync(f, 'utf8');
  if (src.includes('normSlug')) { console.log('\n[generate-articles.js] 已含 normSlug，跳过（不重复打补丁）'); return; }

  // 注入 normSlug 定义（DISPLAY_OVERRIDES 行之前）
  src = src.replace(
    /const DISPLAY_OVERRIDES = /,
    `${NORM_HELP}\nconst DISPLAY_OVERRIDES = `
  );
  // DISPLAY_OVERRIDES 查询用短 slug
  src = src.replace(
    /if \(DISPLAY_OVERRIDES\[slug\]\) return DISPLAY_OVERRIDES\[slug\];/,
    'if (DISPLAY_OVERRIDES[normSlug(slug)]) return DISPLAY_OVERRIDES[normSlug(slug)];'
  );
  // ATTR 查询：源头已是 -meaning 时直接用，否则补 -meaning（双兼容）
  src = src.replace(
    /const a = ATTR\[slug \+ '-meaning'\];/,
    "const a = ATTR[slug.endsWith('-meaning') ? slug : slug + '-meaning'];"
  );
  // 兜底 titleize 也用短 slug（去 -meaning 后缀再大写）
  src = src.replace(
    /return slug\.split\('-'\)\.map\(w => w\[0\]\.toUpperCase\(\) \+ w\.slice\(1\)\)\.join\(' '\);/,
    "return normSlug(slug).split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');"
  );
  fs.writeFileSync(f, src, 'utf8');
  console.log(`\n[generate-articles.js] ✓ 打补丁：normSlug + DISPLAY_OVERRIDES[short] + ATTR[双兼容] + titleize`);
})();

// --- 3b. 13.tarot/scripts/qc-checks.js ---
(function patchQcChecks() {
  const f = path.join(BASE, '04-内容生产/13.tarot/scripts/qc-checks.js');
  if (!fs.existsSync(f)) return console.log('\n[qc-checks.js] 跳过（不存在）');
  let src = fs.readFileSync(f, 'utf8');
  if (src.includes('normSlug')) { console.log('\n[qc-checks.js] 已含 normSlug，跳过'); return; }

  // 在 const ATTR 行后注入 normSlug
  src = src.replace(
    /const ATTR = require\('\.\.\/\.\.\/\.\.\/07-互动工具\/_shared\/crystal-attributes\.json'\)\.crystals;/,
    m => m + '\n' + NORM_HELP
  );
  // ATTR 查询：line 110 `ATTR[slug + '-meaning']` → 双兼容
  src = src.replace(
    /const attr = ATTR\[slug \+ '-meaning'\] \|\| \{\};/,
    "const attr = ATTR[slug.endsWith('-meaning') ? slug : slug + '-meaning'] || {};"
  );
  fs.writeFileSync(f, src, 'utf8');
  console.log(`\n[qc-checks.js] ✓ 打补丁：normSlug + ATTR[双兼容]`);
})();

// --- 3c. 6 个 tarot 工具页 generate.js enrichStone（BY_SLUG 用短 slug key）---
(function patchToolPages() {
  const tools = [
    'crystal-tarot-draw', 'daily-tarot', 'draw-tarot-cards',
    'love-tarot', 'tarot-birth-card', 'yes-no-tarot',
  ];
  console.log('\n[工具页 enrichStone]');
  for (const t of tools) {
    const f = path.join(BASE, `07-互动工具/${t}/build/generate.js`);
    if (!fs.existsSync(f)) { console.log(`  ${t}: 跳过（不存在）`); continue; }
    let src = fs.readFileSync(f, 'utf8');
    if (src.includes('normSlug')) { console.log(`  ${t}: 已含 normSlug，跳过`); continue; }

    // 注入 normSlug（在 const SD = JSON.parse 那一行末尾之后）
    const m = src.match(/const SD = JSON\.parse\(fs\.readFileSync[^\n]*\n/);
    if (!m) { console.log(`  ${t}: ⚠ 未找到 const SD 注入点，跳过`); continue; }
    src = src.replace(m[0], m[0].replace(/\n$/, '') + '\n' + NORM_HELP + '\n');

    // enrichStone 查询：BY_SLUG[s.slug] → BY_SLUG[normSlug(s.slug)]
    // 匹配多种写法：BY_SLUG[s.slug] || {...} / BY_SLUG[stone.slug] || {...}
    const beforeCount = (src.match(/BY_SLUG\[[a-z]+\.slug\]/g) || []).length;
    src = src.replace(
      /BY_SLUG\[([a-z]+)\.slug\]/g,
      'BY_SLUG[normSlug($1.slug)]'
    );
    const afterCount = (src.match(/BY_SLUG\[normSlug\([a-z]+\.slug\)\]/g) || []).length;

    fs.writeFileSync(f, src, 'utf8');
    console.log(`  ${t}: ✓ normSlug 注入 + BY_SLUG 替换 ${beforeCount}→${afterCount}`);
  }
})();

// --- 3d. _qc/_cta-by-slug.json 孤儿快照同步 key ---
(function patchCtaBySlug() {
  const f = path.join(BASE, '04-内容生产/13.tarot/_qc/_cta-by-slug.json');
  if (!fs.existsSync(f)) return console.log('\n[_cta-by-slug.json] 跳过（不存在）');
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  let renamed = 0;
  const out = {};
  for (const [k, v] of Object.entries(d)) {
    if (k.endsWith('-meaning') || k.startsWith('_')) { out[k] = v; continue; }
    const nk = k + '-meaning';
    if (validMeaning.has(nk)) { out[nk] = v; renamed++; }
    else { out[k] = v; } // 无对应文件（如 emerald）保留原名
  }
  fs.writeFileSync(f, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`\n[_cta-by-slug.json] ✓ 重命名 ${renamed} 个 key → -meaning（emerald 等无 -meaning 文件的保留原名）`);
})();

console.log('\n=== 完成。验证：node 04-内容生产/13.tarot/scripts/check-crystal-slugs.js 应显示 tarot-knowledge.json 0 违规 ===');
