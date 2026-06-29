/**
 * 23篇Tarot去AI化禁词精准替换（按牌意上下文，非机械批量）
 * 每处用唯一上下文锚定 oldStr，避免误伤；Fool's Journey / hero's journey 作为专有名词保留
 * 用法：node scripts/fix-softbanned.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');

// 每条: [slug, uniqueOldString, newString, reason]
const EDITS = [
  // ============ the-chariot (harness × 18) ============
  // 牌意核心: 驾驭/统合对立的斯芬克斯两股力。替换词保留"统合驾驭"语义: direct/channel/coordinate/focus
  ['the-chariot', 'the triumph that comes not from raw force but from harnessing opposing pulls toward a single aim',
    'the triumph that comes not from raw force but from directing opposing pulls toward a single aim',
    'harnessing→directing (动名词+宾语, 保留驾驭义)'],
  ['the-chariot', 'the more difficult victory of <em>harnessing</em> — of taking the two sphinxes within',
    'the more difficult victory of <em>direction</em> — of taking the two sphinxes within',
    'harnessing→direction (单独动名词)'],
  ['the-chariot', 'Then name the single aim that, if you committed to it, could harness both.',
    'Then name the single aim that, if you committed to it, could coordinate both.',
    'harness→coordinate (不定式+both)'],
  ['the-chariot', "matching the card's theme of harnessed momentum",
    "matching the card's theme of focused momentum",
    'harnessed momentum→focused momentum (定语)'],
  ['the-chariot', 'the same energy, harnessed rather than spent. Hold a piece while naming the one aim',
    'the same energy, focused rather than spent. Hold a piece while naming the one aim',
    'harnessed rather than spent→focused rather than spent'],
  ['the-chariot', 'the same energy, harnessed rather than spent. <a href="/gemstone/carnelian-meaning/">',
    'the same energy, focused rather than spent. <a href="/gemstone/carnelian-meaning/">',
    'harnessed rather than spent→focused (第二处卡片重复段)'],
  ['the-chariot', 'a quiet support for the discipline that harnessed momentum requires.',
    'a quiet support for the discipline that focused momentum requires.',
    'harnessed momentum→focused momentum'],
  ['the-chariot', 'Then name the single goal that could, if you let it, harness both pulls rather than split you between them.',
    'Then name the single goal that could, if you let it, direct both pulls rather than split you between them.',
    'harness both pulls→direct both pulls'],
  ['the-chariot', "The Chariot's triumph is the harnessing sustained, not the force declared.",
    "The Chariot's triumph is the direction sustained, not the force declared.",
    'harnessing sustained→direction sustained'],
  ['the-chariot', 'that every meaningful pursuit requires you to harness rather than suppress.',
    'that every meaningful pursuit requires you to coordinate rather than suppress.',
    'harness→coordinate (不定式)'],
  ['the-chariot', 'The Chariot reminds you that triumph comes from harnessing, not from pushing;',
    'The Chariot reminds you that triumph comes from focused direction, not from pushing;',
    'harnessing→focused direction'],
  ['the-chariot', "The Chariot's theme of harnessing opposing forces resonates with the Eastern principle of",
    "The Chariot's theme of directing opposing forces resonates with the Eastern principle of",
    'harnessing opposing forces→directing opposing forces'],
  ['the-chariot', "each piece can serve as a daily reminder of The Chariot's invitation to harness opposing pulls toward one aim.",
    "each piece can serve as a daily reminder of The Chariot's invitation to direct opposing pulls toward one aim.",
    'harness→direct + serve as→acts as (下方serves as处理)'],
  ['the-chariot', 'the archetype of victory through mastery — the harnessing of opposing forces toward a single aim.',
    'the archetype of victory through mastery — the coordination of opposing forces toward a single aim.',
    'harnessing of→coordination of'],
  ['the-chariot', 'It suggests that competing demands can be harnessed toward a single aim,',
    'It suggests that competing demands can be aligned toward a single aim,',
    'be harnessed→be aligned (被动)'],
  ['the-chariot', 'The principle across references is focused, directed, harnessed energy.',
    'The principle across references is focused, directed, coordinated energy.',
    'harnessed energy→coordinated energy (三词并列, 用coordinate避免与focused/directed重复)'],
  ['the-chariot', 'the momentum available when competing pulls are harnessed — but the aim you choose,',
    'the momentum available when competing pulls are aligned — but the aim you choose,',
    'are harnessed→are aligned (被动)'],
  ['the-chariot', 'the kind of harnessed will that actually carries a life forward.',
    'the kind of focused will that actually carries a life forward.',
    'harnessed will→focused will'],

  // ============ strength (harness × 1) ============
  ['strength', 'the complement to The Chariot, where triumph came from harnessing outward force.',
    'the complement to The Chariot, where triumph came from directing outward force.',
    'harnessing→directing (与Chariot呼应)'],

  // ============ the-fool (journey ×3 普通用法替换; Fool's Journey×3 + hero's journey×1 保留为专有名词) ============
  ['the-fool', 'The satchel holds the hidden tools the journey will eventually reveal.',
    'The satchel holds the hidden tools the path will eventually reveal.',
    'journey→path (普通用法)'],
  ['the-fool', 'It is traditionally read as the start of a journey — literal or symbolic — undertaken before the whole path is known.',
    'It is traditionally read as the start of a new chapter — literal or symbolic — undertaken before the whole path is known.',
    'journey→new chapter (避免与同句path重复)'],
  ['the-fool', 'The Fool is the card that begins the whole journey — and the one we are invited to return to whenever life asks for a fresh start.',
    'The Fool is the card that begins the whole sequence — and the one we are invited to return to whenever life asks for a fresh start.',
    'journey→sequence (指22张大阿尔卡那序列, 更精准)'],

  // ============ the-world (journey ×1 普通用法替换; Fool's Journey×3 保留) ============
  ['the-world', 'The scene marks an ending that is also a fulfillment: the journey that began with The Fool\'s cliff-edge leap has come full circle,',
    "The scene marks an ending that is also a fulfillment: the arc that began with The Fool's cliff-edge leap has come full circle,",
    'journey→arc (叙事弧, Fool\'s Journey保留)'],

  // ============ the-hermit (journey ×1) ============
  ['the-hermit', 'At this stage of the journey, the guidance has to be your own, found in the quiet.',
    'At this stage of the path, the guidance has to be your own, found in the quiet.',
    'journey→path'],

  // ============ the-magician (realm ×1, serves as ×2; Fool's Journey 保留) ============
  ['the-magician', 'What is grasped in the realm of idea can be brought down into form,',
    'What is grasped in the domain of idea can be brought down into form,',
    'realm→domain'],
  ['the-magician', 'Worn as a bracelet or ring, it serves as a daily reminder to act on what you say you will, keeping the card\'s resourcefulness in motion rather than locked in planning.',
    'Worn as a bracelet or ring, it acts as a daily reminder to act on what you say you will, keeping the card\'s resourcefulness in motion rather than locked in planning.',
    'serves as→acts as'],
  ['the-magician', "Worn as jewelry, it serves as a daily reminder to act on what you say you will — keeping The Magician's resourcefulness in motion.",
    "Worn as jewelry, it acts as a daily reminder to act on what you say you will — keeping The Magician's resourcefulness in motion.",
    'serves as→acts as'],

  // ============ the-fool serves as ×2 ============
  ['the-fool', 'Worn as a bracelet or pendant, it serves as a quiet daily reminder to stay open to change without losing your footing — the kind of subtle, ongoing support a jewelry piece can offer that a raw stone in a drawer cannot.',
    'Worn as a bracelet or pendant, it acts as a quiet daily reminder to stay open to change without losing your footing — the kind of subtle, ongoing support a jewelry piece can offer that a raw stone in a drawer cannot.',
    'serves as→acts as'],
  ['the-fool', 'Worn as jewelry, it serves as a quiet daily reminder to stay open to change without losing your footing.',
    'Worn as jewelry, it acts as a quiet daily reminder to stay open to change without losing your footing.',
    'serves as→acts as'],

  // ============ the-tower transformative ×1 ============
  ['the-tower', 'and Labradorite for the transformative will of the Solar Plexus.',
    'and Labradorite for the catalytic will of the Solar Plexus.',
    'transformative→catalytic (Solar Plexus意志, 塔罗破立转化义; 避开profound/significant等过弱词, catalytic精准)'],

  // ============ the-moon transformative ×1 ============
  ['the-moon', 'let its steady, transformative presence support the clear seeing the moment requires',
    'let its steady, grounding presence support the clear seeing the moment requires',
    'transformative→grounding (月亮牌水晶稳重陪伴义)'],

  // ============ the-star navigate ×1 ============
  ['the-star', 'and the ability to navigate difficulty without collapsing into despair.',
    'and the ability to move through difficulty without collapsing into despair.',
    'navigate→move through'],
];

const perSlug = {};
let totalApplied = 0, totalFailed = 0;

for (const [slug, oldStr, newStr, reason] of EDITS) {
  const f = path.join(DIR, 'articles', slug + '.json');
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const count = a.content.split(oldStr).length - 1;
  if (count === 0) {
    console.log(`  [FAIL] ${slug}: 未找到 -> "${oldStr.slice(0, 70)}..."`);
    totalFailed++;
  } else if (count > 1) {
    console.log(`  [FAIL] ${slug}: 匹配${count}处(>1), 需更唯一上下文 -> "${oldStr.slice(0, 60)}..."`);
    totalFailed++;
  } else {
    a.content = a.content.replace(oldStr, newStr);
    fs.writeFileSync(f, JSON.stringify(a, null, 2) + '\n', 'utf8');
    (perSlug[slug] = perSlug[slug] || []).push({ reason, old: oldStr.slice(0, 60), new: newStr.slice(0, 60) });
    totalApplied++;
  }
}

console.log(`\n===== 替换结果 =====`);
console.log(`成功: ${totalApplied} 处, 失败: ${totalFailed} 处`);
for (const [slug, edits] of Object.entries(perSlug)) {
  console.log(`\n### ${slug} (${edits.length} 处)`);
  edits.forEach(e => console.log(`  - ${e.reason}`));
}
