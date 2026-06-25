// 修复 virgo-crystals.json：content 值内未转义的双引号转义为 \"
// 用法：node fix-virgo-json.js <jsonPath>
const fs = require('fs');
const f = process.argv[2];
let c = fs.readFileSync(f, 'utf8');
const startMarker = '"content": "';
const si = c.indexOf(startMarker) + startMarker.length;
const endMarker = '",\n  "images"';
const ei = c.lastIndexOf(endMarker);
if (si < startMarker.length || ei < 0 || ei <= si) {
  console.log('找不到 content 区域'); process.exit(1);
}
let region = c.slice(si, ei);
// 未转义 "（前面不是 \）→ 转义
let fixed = region.replace(/(?<!\\)"/g, '\\"');
let count = (region.match(/(?<!\\)"/g) || []).length;
c = c.slice(0, si) + fixed + c.slice(ei);
fs.writeFileSync(f, c, 'utf8');
console.log('转义了', count, '处未转义引号');
try { JSON.parse(c); console.log('virgo json 解析 OK'); }
catch (e) { console.log('仍错:', e.message.slice(0, 100)); }
