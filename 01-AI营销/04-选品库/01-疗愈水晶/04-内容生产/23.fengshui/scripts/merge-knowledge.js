/**
 * 合并 3 个 fengshui batch → fengshui-knowledge.json + 严格校验
 * 校验：45篇/slug唯一/crystals slug在390库存在/必填字段全/slug无/前缀
 * 用法：node merge-knowledge.js
 */
const fs = require('fs'), path = require('path');
const SHARED = path.resolve(__dirname, '../../../07-互动工具/_shared');
const ATTR = require(path.join(SHARED, 'crystal-attributes.json')).crystals;
const attrKeys = Object.keys(ATTR);

const batches = ['fengshui-batch-core.json', 'fengshui-batch-crystals1.json', 'fengshui-batch-crystals2.json'];
let all = [];
for (const b of batches) {
  const j = JSON.parse(fs.readFileSync(path.join(SHARED, b), 'utf8'));
  all = all.concat(j.mainpages || []);
}
console.log('合并总数:', all.length);

// 校验
const required = ['slug', 'title', 'focus_keyword', 'page_type', 'definition', 'calculation', 'crystals', 'faq_seeds', 'eastern_note'];
const seen = {}; const dup = []; const issues = []; const badCrystals = []; const pageTypes = {};
for (const m of all) {
  if (seen[m.slug]) dup.push(m.slug);
  seen[m.slug] = (seen[m.slug] || 0) + 1;
  for (const f of required) {
    if (m[f] === undefined || m[f] === null || m[f] === '' || (Array.isArray(m[f]) && m[f].length === 0) || (typeof m[f] === 'object' && !Array.isArray(m[f]) && Object.keys(m[f]).length === 0)) {
      issues.push(`${m.slug}: 缺 ${f}`);
    }
  }
  if (m.calculation && (!m.calculation.steps || !m.calculation.steps.length)) issues.push(`${m.slug}: 缺 calculation.steps`);
  if (m.calculation && !m.calculation.formula) issues.push(`${m.slug}: 缺 calculation.formula`);
  for (const c of (m.crystals || [])) {
    if (!attrKeys.includes(c + '-meaning')) badCrystals.push(`${m.slug}: ${c}`);
  }
  if (m.slug && m.slug.includes('/')) issues.push(`${m.slug}: slug含/`);
  pageTypes[m.page_type] = (pageTypes[m.page_type] || 0) + 1;
}

console.log('\n=== page_type 分布 ===', pageTypes);
console.log('=== 重复 slug ===', dup.length ? dup.join(', ') : '无');
console.log('=== 缺字段/格式问题 ===', issues.length ? issues.join('\n  ') : '无');
console.log('=== crystals slug 不在390库 ===', badCrystals.length ? badCrystals.join('\n  ') : '无');

const ok = !dup.length && !issues.length && !badCrystals.length && all.length === 45;
if (!ok) {
  console.log('\n❌ 校验未通过，未写出 fengshui-knowledge.json');
  process.exit(1);
}

// 写出
const meta = {
  name: 'fengshui-knowledge',
  purpose: '风水文章线 45 篇 mainpages（hub+概念8+意图5+房间5+单石×feng shui 27），与 kua-knowledge/bagua-knowledge 工具数据共用单源',
  school: 'BTB (Black Sect Tantric Buddhism) 门对齐为主 + 八宅 Ba Zhai + 五行 Five Elements',
  scope_rule: '只做水晶交叉词，不碰泛 feng shui 大媒体垄断词；不进 PiXiu 工厂红海；BTB 流派为主',
  crystal_sources: 'crystals 字段对齐 390 库 {slug}-meaning；五行映射 Water→obsidian·Wood→aventurine·Fire→carnelian·Earth→citrine·Metal→quartz',
  compliance: 'BTB framing + 参考传统不强装大师；禁 cures/guarantees/will bring wealth；Wealth宫BTB主色=紫(Amethyst)非绿；立春Feb4太阳历年份切换',
  url_rule: '全根级无前缀（/feng-shui/、/citrine-in-feng-shui/、/feng-shui-bagua-map/）',
  crystal_slug_note: '文章 slug 用人类可读全名（clear-quartz-in-feng-shui），crystals 数组用 390 真实 slug（quartz）',
  pipeline: '复用 meditation mainpages 管线（generate→fill分批→fill-from→image→upload）+ feng shui 专用 fill prompt（BTB+水晶现代配伍+合规+去AI化）',
  related_tool_data: ['kua-knowledge.json (Kua工具)', 'bagua-knowledge.json (Bagua工具)'],
  article_count: { hub: pageTypes.hub || 0, concept: pageTypes.concept || 0, intention: pageTypes.intention || 0, room: pageTypes.room || 0, crystal: pageTypes.crystal || 0, total: all.length }
};
fs.writeFileSync(path.join(SHARED, 'fengshui-knowledge.json'), JSON.stringify({ _meta: meta, mainpages: all }, null, 2), 'utf8');
console.log(`\n✅ 校验通过，写出 fengshui-knowledge.json（${all.length} 篇）→ 07-互动工具/_shared/`);
