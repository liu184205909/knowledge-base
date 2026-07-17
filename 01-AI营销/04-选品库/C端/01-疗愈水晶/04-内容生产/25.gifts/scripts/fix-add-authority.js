/**
 * Gift anniversary 子集补权威引用段（P0 缺口，~10 篇）
 * 竞品 loveandlavender 引 Emily Post《Etiquette》传统历法（15周年=crystal）；E-E-A-T 关键
 * 插在 FAQ 前（先于 fix-add-care 跑，顺序：权威→Care→FAQ）
 * 用法：node fix-add-authority.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const AUTH = `<h2>Where the Crystal Anniversary Tradition Comes From</h2>
<p>The custom of pairing a material with each anniversary year took shape in the 1920s and was codified in Emily Post's <em>Etiquette</em>. In that traditional list, the 15th anniversary is <strong>crystal</strong> — chosen for the clarity, transparency, and lasting strength that mirror a fifteen-year bond. A later modern list, assembled by librarians at the Chicago Public Library and popularized by Hallmark, names <strong>watches</strong> for year 15, yet crystal remains the anniversary theme most people recognize today — and the one a thoughtfully chosen healing stone honors most directly.</p>`;
const FAQ_TAG = '<h2>Frequently Asked Questions</h2>';
const AUTH_TITLE = '<h2>Where the Crystal Anniversary Tradition Comes From</h2>';
// anniversary 子集：occasion 含 anniversary/wedding/15th，或 subcategory=anniversary/wedding
function isAnniversary(a) {
  const occ = (a.occasion || '').toLowerCase();
  const sub = (a.subcategory || '').toLowerCase();
  return occ.includes('anniversary') || occ.includes('wedding') || occ.includes('15th') || sub === 'anniversary' || sub === 'wedding';
}
let added = 0, skip = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = path.join(DIR, f); const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!isAnniversary(a)) { skip++; continue; }
  let c = a.content || '';
  if (!c.includes(FAQ_TAG)) { skip++; continue; }
  if (c.includes(AUTH_TITLE)) { skip++; continue; }
  a.content = c.replace(FAQ_TAG, AUTH + '\n\n' + FAQ_TAG);
  fs.writeFileSync(p, JSON.stringify(a, null, 2), 'utf8'); added++; console.log('  +', a.slug);
}
console.log(`权威段插入: ${added} 篇 (跳过 ${skip})`);
