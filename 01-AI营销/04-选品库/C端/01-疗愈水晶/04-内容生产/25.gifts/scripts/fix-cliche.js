/**
 * Gift 文章 cliche 清理：intricate→detailed, elevate→strengthen（去 AI 化）
 * journey 保留（多数为"婚姻/疗愈旅程"合法用法，人工判接受）
 * 用法：node fix-cliche.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const RULES = [
  [/\bintricate\b/gi, 'detailed'], [/\bintricately\b/gi, 'carefully'],
  [/\belevate\b/gi, 'strengthen'], [/\belevates\b/gi, 'strengthens'],
  [/\belevated\b/gi, 'lifted'], [/\belevating\b/gi, 'uplifting'],
];
let fixed = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = path.join(DIR, f); const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  let c = a.content || ''; let changed = false;
  for (const [re, rep] of RULES) { const nc = c.replace(re, rep); if (nc !== c) { c = nc; changed = true; } }
  if (changed) { a.content = c; fs.writeFileSync(p, JSON.stringify(a, null, 2), 'utf8'); fixed++; }
}
console.log(`cliche 修复: ${fixed} 篇 (intricate/elevate)`);
