/**
 * 修 23 篇 title + rank_math_title 按 v2 框架(主词靠前+合规)
 * chakra: Best {Name} Crystals: Stones for Balance, Energy & Mindful Rituals
 * color: Best {Name} Crystals: Names, Meanings, Properties & Uses
 * element: Best Crystals for {Name} Energy: Meaning, Uses & Zodiac Signs
 * 只改 title/rank_math_title,不动 content
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const T = {
  chakra: n => `Best ${n} Crystals: Stones for Balance, Energy & Mindful Rituals`,
  color: n => `Best ${n} Crystals: Names, Meanings, Properties & Uses`,
  element: n => `Best Crystals for ${n} Energy: Meaning, Uses & Zodiac Signs`,
};
let n = 0;
for (const art of idx.articles) {
  const f = path.join(DIR, 'articles', art.slug + '.json');
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const newT = T[art.type](a.dimName);
  a.title = newT;
  a.rank_math_title = newT;
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  n++;
  if (n <= 4) console.log(`  [${art.type}] ${art.slug} → ${newT}`);
}
console.log(`✅ ${n} 篇 title 修正(v2 主词靠前+合规)`);
