const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../zodiac-checker.html', 'utf8');

// 提取 ZM 数据
const m = html.match(/var ZM=(\{[\s\S]*?\});/);
if (!m) { console.log('ZM not found'); process.exit(); }
const ZM = eval('(' + m[1] + ')');

// 检查 3 个不同配对的数据是否真的不同
const pairs = ['aries-cancer', 'leo-sagittarius', 'pisces-pisces'];
for (const k of pairs) {
  const z = ZM[k];
  if (!z) { console.log(k + ': NOT FOUND'); continue; }
  console.log('=== ' + k + ' ===');
  console.log('  headline:', z.headline);
  console.log('  score:', z.score, z.band);
  console.log('  desc:', (z.desc || '').slice(0, 100));
  console.log('  challenge:', (z.coreChallenge || '').slice(0, 100));
  console.log('  synergy:', (z.synergy || '').slice(0, 100));
  console.log('');
}

// 检查乱码
console.log('=== 乱码检查 ===');
const sample = JSON.stringify(ZM['aries-cancer']);
console.log('aries-cancer JSON (前 400 字符):', sample.slice(0, 400));

// 检查所有配对的 headline 是否只有 7 种（= 按相位分组，同相位文字一样）
const headlines = {};
for (const [k, v] of Object.entries(ZM)) {
  const h = v.headline;
  if (!headlines[h]) headlines[h] = [];
  headlines[h].push(k);
}
console.log('\n=== Headline 去重统计 ===');
console.log('不同 headline 数量:', Object.keys(headlines).length);
for (const [h, pairs] of Object.entries(headlines)) {
  console.log('  "' + h + '": ' + pairs.length + ' 组');
}

// 检查 analyze 函数逻辑
const analyzeMatch = html.match(/function analyze\(\)\{([\s\S]*?)\}/);
if (analyzeMatch) {
  console.log('\n=== analyze 函数 ===');
  console.log(analyzeMatch[0].slice(0, 300));
}
