/**
 * 给 yes-no-knowledge.json 每个 card 补 common_mistakes 布尔字段
 * 依据：母框架 §2 O2 启用明单（误读牌）—— The Moon/Tower/Devil/Fool/Hermit/Hanged Man/Death
 * 解决：T2 agent 发现矩阵缺此字段，生产端按框架明单兜底；现补齐对齐框架
 * 用法：node fix-yesno-common-mistakes.js
 */
const fs = require('fs');
const F = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/yes-no-knowledge.json';
const j = JSON.parse(fs.readFileSync(F, 'utf8'));

// 母框架 §2 O2 启用明单（有明显常见误读的牌）
const mistakeCards = new Set([
  'the-moon', 'the-tower', 'death', 'the-devil',
  'the-fool', 'the-hermit', 'the-hanged-man'
]);

let added = 0;
for (const c of j.cards) {
  if (c.common_mistakes === undefined) {
    c.common_mistakes = mistakeCards.has(c.card);
    added++;
  }
}

fs.writeFileSync(F, JSON.stringify(j, null, 2));
console.log(`cards: ${j.cards.length}, 补 common_mistakes 字段: ${added} 条`);
console.log('误读牌（common_mistakes=true）:');
for (const c of j.cards) if (c.common_mistakes) console.log('  ✓', c.card);
