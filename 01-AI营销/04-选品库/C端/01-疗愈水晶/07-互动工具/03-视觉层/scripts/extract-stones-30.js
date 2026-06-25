/**
 * 从 compatibility-tool.html 提取 30 颗水晶数据
 * 减去 5 颗不太流行的：serpentine / herkimer-diamond / prehnite / shungite / chrysocolla
 *
 * 输出：crystal-stones-30.json
 */
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.resolve(__dirname, '../compatibility-tool.html');
const OUT_FILE = path.resolve(__dirname, '../crystal-stones-30.json');

const html = fs.readFileSync(HTML_FILE, 'utf8');

// 提取 D 对象里的 STONES
const dMatch = html.match(/const D=(\{[\s\S]*?\});/);
if (!dMatch) { console.error('D 对象未找到'); process.exit(1); }

// 用 eval 解析（D 是 JS 对象字面量，不是严格 JSON）
const D = eval('(' + dMatch[1] + ')');

const REMOVE = ['serpentine', 'herkimer-diamond', 'prehnite', 'shungite', 'chrysocolla'];

const stones30 = {};
let kept = 0, removed = 0;
for (const [slug, data] of Object.entries(D.STONES)) {
  if (REMOVE.includes(slug)) {
    removed++;
    continue;
  }
  stones30[slug] = data;
  kept++;
}

const output = {
  total: kept,
  removed: removed + ' stones removed (' + REMOVE.join(', ') + ')',
  stones: stones30,
  // 元素矩阵 + 冲突库（保留原样）
  elem: D.ELEM,
  conflicts: D.CONFLICTS,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ 提取 ${kept} 颗水晶（减 ${removed} 颗）→ ${OUT_FILE}`);
console.log(`   文件大小：${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB`);
