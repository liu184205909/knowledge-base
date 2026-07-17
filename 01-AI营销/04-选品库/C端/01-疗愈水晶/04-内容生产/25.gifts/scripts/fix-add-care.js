/**
 * Gift 文章补 Care & Cleansing 段（P0 缺口，全 43 篇）
 * 竞品 tinyrituals 有独立 H2 保养段；礼物场景收礼人需知保养。插在 FAQ 前。
 * 通用 HTML（水晶保养通用知识+内链 cleansing-timer），合规有据，不调 AI（一致高效）
 * 用法：node fix-add-care.js  （在 fix-add-authority 之后跑，保证顺序：权威→Care→FAQ）
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const CARE = `<h2>Caring for Your Crystal Gift</h2>
<p>A crystal gift carries meaning worth preserving, and a little care keeps it beautiful for the recipient long after the occasion has passed.</p>
<h3>Cleansing the Energy</h3>
<p>Before giving the gift — and occasionally after — clear lingering energy from handling and shipping. Rest the stone under moonlight overnight, pass it through sage or palo santo smoke, or place it on a selenite slab for a few hours. For a timed routine, our <a href="/tools/crystal-cleansing-timer/">crystal cleansing timer</a> walks through each method step by step.</p>
<h3>Everyday Physical Care</h3>
<p>Wipe the stone gently with a soft, damp cloth and mild soap; steer clear of harsh chemicals, long sun exposure (which can fade stones like amethyst or rose quartz), and sudden heat. Store softer stones — those below 7 on the Mohs scale, such as calcite or fluorite — separately from harder ones so they don't pick up scratches.</p>`;
const FAQ_TAG = '<h2>Frequently Asked Questions</h2>';
let added = 0, skip = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = path.join(DIR, f); const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  let c = a.content || '';
  if (!c.includes(FAQ_TAG)) { skip++; continue; }
  if (c.includes('<h2>Caring for Your Crystal Gift</h2>')) { skip++; continue; }
  a.content = c.replace(FAQ_TAG, CARE + '\n\n' + FAQ_TAG);
  fs.writeFileSync(p, JSON.stringify(a, null, 2), 'utf8'); added++;
}
console.log(`Care 段插入: ${added} 篇 (跳过 ${skip})`);
