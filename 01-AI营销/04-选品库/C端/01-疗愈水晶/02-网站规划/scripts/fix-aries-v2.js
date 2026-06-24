/**
 * aries draft(43158) 二次修复：
 *   1) 加回 3 条被误摘的内链（meaning 是 schedule/future 状态、表确认有效；hub 是 category archive）
 *      - /gemstone/quartz-meaning/       (id 38927, future)
 *      - /gemstone/bloodstone-meaning/   (id 39344, future)
 *      - /zodiac-crystals/               (category 875 archive, 归对类目即有效)
 *   2) 改类目 1(Angel Numbers) -> 875(Zodiac & Crystals)
 *   保持摘掉：horoscope/aries-2026-07、zodiac-compatibility/aries-gemini（真没建，非 schedule）
 *   方法论：meaning 内链以 Crystal Tracker 表为准，不靠线上 curl（schedule 文章会误判 404）。
 *   用法：node fix-aries-v2.js   只更新 draft，不发布。
 */
const fs = require('fs');
const path = require('path');
const E = require('../templates/elementor-utils');

const JSON_PATH = path.resolve(__dirname, '../../04-内容生产/zodiac-crystals/aries-crystals.json');
const POST_ID = 43158;
const CAT_ZODIAC_CRYSTALS = 875;

// 精确锚点替换（每步验证命中）
const ADDS = [
  {
    name: 'Clear Quartz Learn more',
    anchor: 'single intention each morning.</li>\n</ul>',
    insert: 'single intention each morning.</li>\n</ul>\n<p>Learn more: <a href="/gemstone/quartz-meaning/">Clear Quartz Meaning: Complete Guide</a></p>'
  },
  {
    name: 'Bloodstone Learn more',
    anchor: 'for grounding courage.</li>\n</ul>',
    insert: 'for grounding courage.</li>\n</ul>\n<p>Learn more: <a href="/gemstone/bloodstone-meaning/">Bloodstone Meaning: Complete Guide</a></p>'
  },
  {
    name: 'Related: zodiac-crystals hub',
    anchor: '<li><a href="/crystals-for-confidence/">',
    insert: '<li><a href="/zodiac-crystals/">Crystals for All Zodiac Signs</a></li>\n<li><a href="/crystals-for-confidence/">'
  },
];

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let content = data.content;
  const before = content.length;

  for (const a of ADDS) {
    if (content.includes(a.insert)) {
      console.log('ALREADY-PRESENT: ' + a.name);
    } else if (content.includes(a.anchor)) {
      content = content.replace(a.anchor, a.insert);
      console.log('ADDED: ' + a.name);
    } else {
      console.log('!! ANCHOR NOT FOUND: ' + a.name + ' —— 中止，检查 content');
      throw new Error('anchor missing: ' + a.anchor.slice(0, 50));
    }
  }

  console.log('content: %d -> %d (delta +%d)', before, content.length, content.length - before);
  data.content = content;
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('wrote local json');

  // 更新线上 draft：content + 类目
  const r = await E.apiRequest('/wp-json/wp/v2/posts/' + POST_ID, 'POST', {
    content,
    categories: [CAT_ZODIAC_CRYSTALS],
    status: 'draft'
  });
  if (!r.id) throw new Error('post update failed: ' + JSON.stringify(r).slice(0, 300));
  console.log('updated draft %s | categories=%s | content_len=%d', r.id, JSON.stringify(r.categories), ((r.content && r.content.raw) || '').length);

  // 复核：类目名 + 剩余内链
  const cats = await E.apiRequest('/wp-json/wp/v2/categories?include=' + (r.categories || []).join(',') + '&_fields=name,slug', 'GET');
  console.log('category now:', cats.map(c => c.name + '(' + c.slug + ')').join(', '));
  const links = [...new Set([...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(u => u.startsWith('/')))];
  console.log('--- internal links (%d) ---', links.length);
  links.forEach(u => console.log('  ' + u));
}

main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
