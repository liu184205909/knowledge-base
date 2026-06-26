const fs = require('fs'), p = require('path');
const d = 'articles';
const files = fs.readdirSync(d).filter(f => f.endsWith('.json') && !f.startsWith('_'));
let total = 0, badJson = 0, placeholder = 0, filled = 0;
let noDisclaimer = 0, flipCount = 0;
const benefitTitles = {};
let totalBenefits = 0, contentLens = [];
for (const x of files) {
  total++;
  let a;
  try { a = JSON.parse(fs.readFileSync(p.join(d, x), 'utf8')); } catch (e) { badJson++; continue; }
  const c = a.content || '';
  if (/AGENT_M/.test(c)) { placeholder++; continue; }
  const m = a.modules || {};
  if (m.m2_agent && m.m2_agent.filled && m.m6_agent && m.m6_agent.filled) filled++;
  contentLens.push(c.length);
  // 边界声明
  if (!/traditionally associated|not scientifically|many people find|not established by/i.test(c)) noDisclaimer++;
  // 同构翻转句 "not just X but Y"
  flipCount += (c.match(/\bnot just\b/gi) || []).length;
  // benefit 标题去重
  if (m.m5_agent && m.m5_agent.benefits) {
    for (const b of m.m5_agent.benefits) {
      totalBenefits++;
      const t = (b.title || '').toLowerCase().trim();
      benefitTitles[t] = (benefitTitles[t] || 0) + 1;
    }
  }
}
const dupes = Object.entries(benefitTitles).filter(([, v]) => v > 3).sort((a, b) => b[1] - a[1]).slice(0, 15);
const avgLen = Math.round(contentLens.reduce((a, b) => a + b, 0) / contentLens.length);
console.log('=== 全面校验（207篇）===');
console.log('总:' + total + ' JSON坏:' + badJson + ' 占位:' + placeholder + ' 全填:' + filled);
console.log('content 均长:' + avgLen + ' 字符');
console.log('无边界声明:' + noDisclaimer + '篇 | 同构翻转句(not just):' + flipCount + '个');
console.log('Benefit 标题总数:' + totalBenefits + ' | 重复>3次:' + dupes.length + '个标题');
if (dupes.length) console.log('重复最多:', dupes.map(([k, v]) => k + '(' + v + ')').join(', '));
else console.log('✅ benefit 标题无严重雷同（<4次重复）');
