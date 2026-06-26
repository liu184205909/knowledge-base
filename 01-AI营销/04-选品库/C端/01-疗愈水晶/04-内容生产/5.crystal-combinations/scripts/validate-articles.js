const fs = require('fs'), p = require('path');
const d = 'articles';
let jsonBad = 0, placeholder = 0, filled = 0, killBad = 0, riskBad = 0, total = 0;
const prob = [];
for (const x of fs.readdirSync(d).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
  total++;
  let a;
  try { a = JSON.parse(fs.readFileSync(p.join(d, x), 'utf8')); } catch (e) { jsonBad++; prob.push(x.replace('.json', '') + '(JSON坏)'); continue; }
  const c = a.content || '';
  const m = a.modules || {};
  const ok = m.m2_agent && m.m2_agent.filled && m.m3_agent && m.m3_agent.filled && m.m4_agent && m.m4_agent.filled && m.m5_agent && m.m5_agent.filled && m.m6_agent && m.m6_agent.filled;
  if (/AGENT_M[23456]/.test(c)) { placeholder++; prob.push(x.replace('.json', '') + '(占位)'); }
  else if (!ok) { prob.push(x.replace('.json', '') + '(未填)'); }
  else filled++;
  if (c.includes('sio₂') || c.includes('caso₄')) { killBad++; prob.push(x.replace('.json', '') + '(化学式)'); }
  if (c.includes('ultimately') || c.includes('realm') || c.includes('vibrant') || c.includes('navigate') || c.includes('journey') || c.includes('landscape') || c.includes('embrace')) {
    riskBad++; prob.push(x.replace('.json', '') + '(KillList)');
  }
}
console.log('总:' + total + ' JSON坏:' + jsonBad + ' 占位:' + placeholder + ' 全填:' + filled);
console.log('化学式:' + killBad + ' KillList:' + riskBad);
console.log('问题:' + prob.length);
if (prob.length) console.log(prob.slice(0, 30).join(', '));
