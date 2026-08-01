/**
 * 修复 78 篇文章的内链 + 框架文档 URL
 *
 * 1. /zodiac/{sign}/ → /{sign}（详解文章根级）
 * 2. /category/zodiac-compatibility/ → /category/zodiac/zodiac-compatibility/（hub 层级）
 * 3. /category/zodiac-sign/ → /category/zodiac/zodiac-sign/
 * 4. /category/zodiac-crystals/ → /category/zodiac/zodiac-crystals/
 * 5. /category/horoscope/ → /category/zodiac/horoscope/
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';
const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

let totalFixed = 0;

// 1. 修复 78 篇文章 JSON
const articlesDir = path.join(ROOT, '04-内容生产/4.zodiac-compatibility/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
for (const f of files) {
  const fpath = path.join(articlesDir, f);
  let content = fs.readFileSync(fpath, 'utf8');
  let changed = false;

  // /zodiac/{sign}/ → /{sign}/ （但不改 /zodiac-compatibility/ 因为已经被修复了）
  for (const sign of signs) {
    const oldUrl = '/zodiac/' + sign + '/';
    const newUrl = '/' + sign + '/';
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(newUrl);
      changed = true;
    }
    // 也修不带尾斜杠的
    const oldUrl2 = '/zodiac/' + sign + '"';
    const newUrl2 = '/' + sign + '"';
    if (content.includes(oldUrl2)) {
      content = content.split(oldUrl2).join(newUrl2);
      changed = true;
    }
  }

  // category hub 加层级
  const catFixes = [
    ['/category/zodiac-compatibility/', '/category/zodiac/zodiac-compatibility/'],
    ['/category/zodiac-sign/', '/category/zodiac/zodiac-sign/'],
    ['/category/zodiac-crystals/', '/category/zodiac/zodiac-crystals/'],
    ['/category/horoscope/', '/category/zodiac/horoscope/'],
  ];
  for (const [old, neu] of catFixes) {
    // 先避免重复替换（如果已经是 /category/zodiac/xxx/ 就跳过）
    const alt = old.replace('/category/', '/category/zodiac/');
    if (alt === neu && content.includes(neu)) continue; // 已经是正确的
    if (content.includes(old)) {
      content = content.split(old).join(neu);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fpath, content, 'utf8');
    totalFixed++;
  }
}
console.log('78 篇文章内链修复:', totalFixed, '个文件');

// 2. 修复框架文档
const docs = [
  '03-内容策略/内容Brief/模板-星座详解×水晶框架.md',
  '03-内容策略/内容Brief/模板-星座配对×水晶框架.md',
  '02-网站规划/2A-网站结构.md',
];
let docFixed = 0;
for (const doc of docs) {
  const fpath = path.join(ROOT, doc);
  if (!fs.existsSync(fpath)) continue;
  let content = fs.readFileSync(fpath, 'utf8');
  let changed = false;

  // /zodiac/{sign}/ → /{sign}/
  for (const sign of signs) {
    if (content.includes('/zodiac/' + sign + '/')) {
      content = content.split('/zodiac/' + sign + '/').join('/' + sign + '/');
      changed = true;
    }
    if (content.includes('/zodiac/' + sign + '"')) {
      content = content.split('/zodiac/' + sign + '"').join('/' + sign + '"');
      changed = true;
    }
  }

  // category hub 层级
  for (const [old, neu] of [
    ['/category/zodiac-compatibility/', '/category/zodiac/zodiac-compatibility/'],
    ['/category/zodiac-sign/', '/category/zodiac/zodiac-sign/'],
    ['/category/zodiac-crystals/', '/category/zodiac/zodiac-crystals/'],
  ]) {
    if (content.includes(old) && !content.includes(neu)) {
      content = content.split(old).join(neu);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fpath, content, 'utf8');
    docFixed++;
    console.log('  文档修复:', doc);
  }
}
console.log('框架文档修复:', docFixed, '个文件');

// 3. 验证
console.log('\n=== 验证 ===');
const sample = fs.readFileSync(path.join(articlesDir, 'gemini-virgo.json'), 'utf8');
console.log('/zodiac/gemini/ 残留:', sample.includes('/zodiac/gemini/') ? '❌' : '✅');
console.log('/gemini/ 存在:', sample.includes('/gemini/') ? '✅' : '检查 /gemini"');
console.log('/gemini" 存在:', sample.includes('/gemini"') ? '✅' : '❌');
console.log('/category/zodiac/zodiac-compatibility/:', sample.includes('/category/zodiac/zodiac-compatibility/') ? '✅' : '❌');

// 检查详解框架文档
const detailDoc = fs.readFileSync(path.join(ROOT, '03-内容策略/内容Brief/模板-星座详解×水晶框架.md'), 'utf8');
console.log('\n详解框架 /zodiac/{sign}/:', detailDoc.includes('/zodiac/{sign}/') ? '❌ 残留' : '✅ 已修复');
console.log('详解框架 /{sign}/:', detailDoc.includes('/{sign}/') ? '✅' : '❌');
