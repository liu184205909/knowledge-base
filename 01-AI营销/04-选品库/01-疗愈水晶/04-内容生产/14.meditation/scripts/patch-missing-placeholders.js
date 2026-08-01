/**
 * 补丁：补全 AI 偶发遗漏的占位符（如 AI_M6_TIP_TACTILE）
 * 检测 articles/*.json 仍残留的 {{AI_*}}，按占位符名用合理默认值补全（非调AI，省时省成本）
 * 用法：node patch-missing-placeholders.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');

// 默认补丁内容（按占位符名）
const PATCHES = {
  AI_M6_TIP_TACTILE: '<p>Focus on the tactile sensation of the jewelry rather than its appearance. The coolness of the metal or the smoothness of the stone provides a grounding anchor that brings you back to the present moment, anytime during the day.</p>',
  AI_META_DESC: 'A practical guide to crystals for meditation, with stones, a step-by-step script, Eastern tradition, and jewelry tips. Mindful practice, not medical advice.',
  AI_EXCERPT: 'Crystals for meditation: stones, a step-by-step script, Eastern tradition anchors, and how to wear them. A mindful, evidence-grounded guide.',
};

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
let patched = 0;
for (const meta of idx.articles) {
  const f = path.join(DIR, 'articles', meta.slug + '.json');
  if (!fs.existsSync(f)) continue;
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  let changed = false;
  // content
  const phs = (a.content || '').match(/\{\{AI_[A-Za-z0-9_]+\}\}/g) || [];
  for (const ph of [...new Set(phs)]) {
    const name = ph.slice(2, -2);
    const patch = PATCHES[name];
    if (patch) {
      a.content = a.content.split(ph).join(patch);
      console.log(`  ✅ ${meta.slug}: 补 ${name}`);
      changed = true;
    } else {
      console.log(`  ⚠ ${meta.slug}: 无补丁 ${name}（需手动处理）`);
    }
  }
  // rank_math_description / excerpt
  if (a.rank_math_description && a.rank_math_description.includes('{{AI_')) {
    const m = a.rank_math_description.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/);
    if (m && PATCHES[m[1]]) { a.rank_math_description = PATCHES[m[1]].slice(0, 155); changed = true; console.log(`  ✅ ${meta.slug}: 补 ${m[1]} (meta_desc)`); }
  }
  if (a.excerpt && a.excerpt.includes('{{AI_')) {
    const m = a.excerpt.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/);
    if (m && PATCHES[m[1]]) { a.excerpt = PATCHES[m[1]]; changed = true; console.log(`  ✅ ${meta.slug}: 补 ${m[1]} (excerpt)`); }
  }
  if (changed) { fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8'); patched++; }
}
console.log(`\n=== 补丁完成: ${patched} 篇修正 ===`);
