const fs = require('fs');
const html = fs.readFileSync(require('path').resolve(__dirname, '../compatibility-tool.html'), 'utf8');

// 1. 提取 script 验证语法
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('FAIL: script not found'); process.exit(1); }
try { new Function(m[1]); console.log('PASS: JS syntax OK'); }
catch(e) { console.log('FAIL: syntax', e.message); process.exit(1); }

// 2. ZM 配对数
const pairKeys = html.match(/"(?:aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)-(?:aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)":\{/g);
console.log('PASS: ZM has', pairKeys.length, 'pairs');

// 3. 新字段
['coreChallenge','synergy','communicationPattern','dynamics','phase'].forEach(f => {
  const n = (html.match(new RegExp(f, 'g')) || []).length;
  console.log(n > 0 ? 'PASS' : 'FAIL', ': field', f, '(' + n + ' occurrences)');
});

// 4. 渲染逻辑
['Crystal Pair for This Couple','Relationship Insight','Why This Pairing'].forEach(h => {
  console.log(html.includes(h) ? 'PASS' : 'FAIL', ': render', h);
});

// 5. CTA 跳转逻辑
console.log(html.includes('/zodiac-compatibility/') ? 'PASS' : 'FAIL', ': CTA zodiac URL');
