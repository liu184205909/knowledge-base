/**
 * 微调 78 篇文章
 * 1. Quick Answer → AIO 格式（加水晶+分数）
 * 2. 删除名人配对段
 * 3. 新字段融入（archetype/conflictLoop/repairMove/crystalStrategy/avoidCrystal/ritualAngle）
 */
const fs = require('fs');
const path = require('path');

const PAIRING = path.resolve(__dirname, '../pairing-data.json');
const ARTICLES_DIR = path.resolve(__dirname, '../articles');
const pd = JSON.parse(fs.readFileSync(PAIRING, 'utf8'));
const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

let updated = 0;

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = file.replace('.json', '');
  const p = pd.pairs[slug];
  if (!p) continue;

  let content = a.content;
  let changed = false;
  const [signA, signB] = p.signs;
  const c = p.crystals;
  const stoneA = cap(c.signA), stoneB = cap(c.signB), stoneH = cap(c.harmony);

  // 1. Quick Answer → AIO 格式
  const qaRegex = /<h2>Quick Answer<\/h2>\s*<p>[\s\S]*?<\/p>/;
  const newQA = `<h2>Quick Answer</h2>\n<p><strong>Quick Answer:</strong> ${signA} and ${signB} have a compatibility score of ${p.score}/100 (${p.band}). The best crystal pair for this couple is ${stoneA} (for ${signA}), ${stoneB} (for ${signB}), and ${stoneH} (harmonizer). ${p.headline}.</p>`;
  if (qaRegex.test(content)) {
    content = content.replace(qaRegex, newQA);
    changed = true;
  }

  // 2. 删除名人配对段
  const famousRegex = /<h2>Famous[^<]*Couples<\/h2>\s*<p>[\s\S]*?<\/p>/;
  if (famousRegex.test(content)) {
    content = content.replace(famousRegex, '');
    changed = true;
  }
  // 也删残留的注释占位
  content = content.replace(/<!--\s*MODULE_13[^>]*-->/g, '');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 3. 融入 relationshipArchetype → Overview 末尾
  if (p.relationshipArchetype) {
    const overviewEnd = content.indexOf('</div>', content.indexOf('Compatibility Overview'));
    if (overviewEnd > -1 && !content.includes('Relationship Archetype')) {
      const insert = `\n<p style="font-size:16px;font-style:italic;color:#666;margin-top:12px;"><strong>Relationship archetype:</strong> ${p.relationshipArchetype}</p>`;
      content = content.slice(0, overviewEnd + 6) + insert + content.slice(overviewEnd + 6);
      changed = true;
    }
  }

  // 4. 融入 conflictLoop + repairMove → Challenges 末尾（在 Best Crystal Pair 之前）
  if (p.conflictLoop && !content.includes('Conflict pattern')) {
    const bcpIdx = content.indexOf('<h2>Best Crystal Pair');
    if (bcpIdx > -1) {
      const insert = `<p style="margin-top:12px;"><strong>Conflict pattern:</strong> ${p.conflictLoop}</p>\n<p><strong>The repair:</strong> ${p.repairMove || ''}</p>\n`;
      content = content.slice(0, bcpIdx) + insert + '\n' + content.slice(bcpIdx);
      changed = true;
    }
  }

  // 5. 融入 crystalStrategy → Crystal Pair 卡之后
  if (p.crystalStrategy && !content.includes('Crystal strategy')) {
    const shopIdx = content.indexOf('<h2>Shop');
    if (shopIdx > -1) {
      const insert = `<p style="margin-top:8px;"><strong>Crystal strategy:</strong> ${p.crystalStrategy}</p>\n`;
      content = content.slice(0, shopIdx) + insert + '\n' + content.slice(shopIdx);
      changed = true;
    }
  }

  // 6. 融入 avoidCrystal → FAQ 里加一问
  if (p.avoidCrystal && !content.includes('What crystal should')) {
    const faqIdx = content.indexOf('<h2>Frequently Asked Questions</h2>');
    if (faqIdx > -1) {
      const avoidQ = `\n<h3>What crystal should ${signA} and ${signB} avoid?</h3>\n<p>${p.avoidCrystal}</p>\n`;
      content = content.slice(0, faqIdx + 35) + avoidQ + content.slice(faqIdx + 35);
      changed = true;
    }
  }

  // 7. 融入 ritualAngle → How to Use 末尾
  if (p.ritualAngle && !content.includes('Pair ritual')) {
    const useEnd = content.indexOf('<h2>Shop');
    if (useEnd > -1) {
      const insert = `\n<p style="margin-top:10px;"><strong>Pair ritual:</strong> ${p.ritualAngle}</p>\n`;
      content = content.slice(0, useEnd) + insert + content.slice(useEnd);
      changed = true;
    }
  }

  if (changed) {
    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
    updated++;
  }
}

console.log(`✅ 微调完成: ${updated}/${files.length} 篇文章更新`);
console.log(`   - Quick Answer → AIO 格式`);
console.log(`   - 删除名人配对段`);
console.log(`   - 融入 6 个新字段`);
