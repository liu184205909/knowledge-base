/**
 * aries-crystals 按升级后框架（模板-星座水晶框架.md P0+P1）重做：
 *   补 Quick Answer 标准化 / Aries Basics 信息卡 / at a Glance 对比表 / Pairings / Shop Starter Set / FAQ扩2问(含stress内链,补到≥12)
 * 用法：node fix-aries-rebuild.js   只更新 draft，不发布。
 */
const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');

const P = path.resolve(__dirname, '../../04-内容生产/zodiac-crystals/aries-crystals.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
let c = d.content;

const QUICK = '<h2>Quick Answer</h2>\n<p><strong>Quick Answer:</strong> The best crystals for Aries are Carnelian, Red Jasper, Clear Quartz, and Citrine. The lucky crystal for Aries is Carnelian, traditionally associated with courage, motivation, and bold action.</p>\n\n<h2>About Aries</h2>\n\n';

const BASICS = '<table>\n<thead><tr><th>Field</th><th>Content</th></tr></thead>\n<tbody>\n<tr><td>Zodiac Sign</td><td>Aries</td></tr>\n<tr><td>Dates</td><td>March 21 – April 19</td></tr>\n<tr><td>Element</td><td>Fire</td></tr>\n<tr><td>Quality</td><td>Cardinal</td></tr>\n<tr><td>Ruling Planet</td><td>Mars</td></tr>\n<tr><td>Symbol</td><td>Ram</td></tr>\n<tr><td>Modern Birthstone</td><td>Diamond</td></tr>\n<tr><td>Lucky Crystal</td><td>Carnelian</td></tr>\n<tr><td>Best Crystal Themes</td><td>Courage, motivation, grounding, focus</td></tr>\n</tbody>\n</table>';

const ATAGLANCE = '<h2>Best Aries Crystals at a Glance</h2>\n<table>\n<thead><tr><th>Crystal</th><th>Best For Aries</th><th>Energy Type</th><th>Best Use</th></tr></thead>\n<tbody>\n<tr><td>Carnelian</td><td>Motivation, courage</td><td>Energizing</td><td>Bracelet</td></tr>\n<tr><td>Red Jasper</td><td>Patience, grounding</td><td>Stabilizing</td><td>Pocket stone</td></tr>\n<tr><td>Clear Quartz</td><td>Focus, clarity</td><td>Amplifying</td><td>Crystal point</td></tr>\n<tr><td>Citrine</td><td>Success, optimism</td><td>Uplifting</td><td>Workspace</td></tr>\n<tr><td>Bloodstone</td><td>Resilience, courage</td><td>Grounding</td><td>Pocket</td></tr>\n<tr><td>Aquamarine</td><td>Calm communication</td><td>Cooling</td><td>Necklace</td></tr>\n<tr><td>Amethyst</td><td>Balance, rest</td><td>Calming</td><td>Nightstand</td></tr>\n<tr><td>Tiger\'s Eye</td><td>Decision-making</td><td>Focusing</td><td>Bracelet</td></tr>\n</tbody>\n</table>';

const PAIRINGS = '<h2>Best Crystal Combinations for Aries</h2>\n<p>Aries energy pairs beautifully in sets. Try these combinations—bundle any 3 and save 20%:</p>\n<table>\n<thead><tr><th>Pairing</th><th>Best For</th></tr></thead>\n<tbody>\n<tr><td>Carnelian + Clear Quartz</td><td>Motivation with focused intention</td></tr>\n<tr><td>Red Jasper + Bloodstone</td><td>Grounding and resilience under pressure</td></tr>\n<tr><td>Aquamarine + Amethyst</td><td>Cooling anger and emotional balance</td></tr>\n</tbody>\n</table>';

const SHOP_SET = '<h3>Aries Starter Set</h3>\n<p>New to Aries crystals? Start with <strong>Carnelian + Red Jasper + Clear Quartz</strong>—motivation, grounding, and focus in one set. Bundle any 3 and save 20%.</p>\n\n';

const FAQ_NEW = '<h3>Is Carnelian good for Aries?</h3>\n<p>Yes. Carnelian is widely considered the signature crystal for Aries, traditionally associated with the courage and motivation that match this Mars-ruled fire sign.</p>\n\n<h3>What crystal helps Aries stay calm?</h3>\n<p>Aquamarine and Amethyst are the top calming stones for Aries—Aquamarine cools the temper and Amethyst eases impulsiveness. See our <a href="/crystals-for-stress/">crystals for stress</a> guide for more calming options.</p>\n\n';

const ops = [
  { name: 'Quick Answer + About H2',
    find: '<p><strong>Crystals for Aries</strong> speak directly',
    ins: QUICK + '<p><strong>Crystals for Aries</strong> speak directly' },
  { name: 'Aries Basics 信息卡',
    find: 'More</a> guide.</p>\n\n<h2>The 8 Best Crystals for Aries</h2>',
    ins: 'More</a> guide.</p>\n\n' + BASICS + '\n\n<h2>The 8 Best Crystals for Aries</h2>' },
  { name: 'at a Glance 对比表',
    find: 'Tiger\'s Eye Meaning: Complete Guide</a></p>\n\n<h2>Why These Crystals Work for Aries</h2>',
    ins: 'Tiger\'s Eye Meaning: Complete Guide</a></p>\n\n' + ATAGLANCE + '\n\n<h2>Why These Crystals Work for Aries</h2>' },
  { name: 'Pairings',
    find: 'Clear Quartz</li>\n</ul>\n\n<h2>Aries Crystals for Women &amp; Men</h2>',
    ins: 'Clear Quartz</li>\n</ul>\n\n' + PAIRINGS + '\n\n<h2>Aries Crystals for Women &amp; Men</h2>' },
  { name: 'Shop Starter Set',
    find: 'intention.</p>\n\n<!-- wp:wd/products',
    ins: 'intention.</p>\n\n' + SHOP_SET + '<!-- wp:wd/products' },
  { name: 'FAQ 扩2问(含 stress 内链)',
    find: 'amplify and clarify focus.</p>\n\n<h2>Related</h2>',
    ins: 'amplify and clarify focus.</p>\n\n' + FAQ_NEW + '<h2>Related</h2>' },
];

for (const op of ops) {
  if (c.includes(op.ins)) { console.log('SKIP(already): ' + op.name); continue; }
  if (c.includes(op.find)) { c = c.replace(op.find, op.ins); console.log('DONE: ' + op.name); }
  else { console.log('!! NOT FOUND: ' + op.name + ' —— 中止'); console.log('  find: ' + JSON.stringify(op.find).slice(0,90)); process.exit(1); }
}

console.log('content len:', c.length, '| h2:', (c.match(/<h2/g) || []).length);
d.content = c;
fs.writeFileSync(P, JSON.stringify(d, null, 2), 'utf8');

(async () => {
  const r = await E.apiRequest('/wp-json/wp/v2/posts/43158', 'POST', { content: c, status: 'draft' });
  console.log('draft updated', r.id, '| status=' + r.status);
  const links = [...new Set([...c.matchAll(/href="(\/[^"]+)"/g)].map(m => m[1]))];
  console.log('internal links:', links.length, '(框架要求≥12)');
})();
