/**
 * 分析 78 篇文章的句式模板化问题
 * 检查模块 4-9 各段的开头句（前 3 词），找出跨篇雷同
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
const mods = ['Love', 'Friendship', 'Sexual', 'Marriage', 'Communication', 'Challenges'];

console.log('句式模板化分析（78 篇 × 6 模块）\n');

for (const m of mods) {
  const starts = {};
  for (const f of files) {
    const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    // 匹配 <h2>...{Module}...</h2> 后第一个 <p> 的前 5 词
    const re = new RegExp('<h2>[^<]*' + m + '[^<]*</h2>\\s*<p>([^<]{0,200})', 'i');
    const match = a.content.match(re);
    if (match) {
      const words = match[1].trim().split(/\s+/).slice(0, 5).join(' ').toLowerCase();
        // 取前 3 词作为指纹
        const fp3 = words.split(/\s+/).slice(0, 3).join(' ');
        starts[fp3] = (starts[fp3] || 0) + 1;
    }
  }
  const sorted = Object.entries(starts).sort((a, b) => b[1] - a[1]);
  const top5 = sorted.slice(0, 5);
  const unique = sorted.filter(([, v]) => v === 1).length;
  console.log(`=== ${m}（${sorted.length} 种开头 / ${unique} 种唯一）===`);
  top5.forEach(([k, v]) => {
    const flag = v > 15 ? '🔴' : v > 8 ? '🟡' : '✅';
    console.log(`  ${flag} ${v}x: "${k}..."`);
  });
  console.log();
}
