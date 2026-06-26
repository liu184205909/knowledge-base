const fs = require('fs');
const path = require('path');

const BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated';
const ARTICLES = path.join(BASE, 'articles');
const COMPAT = path.join(BASE, 'zodiac-compatibility');
const SIGN = path.join(BASE, 'zodiac-sign');

fs.mkdirSync(COMPAT, { recursive: true });
fs.mkdirSync(SIGN, { recursive: true });

const ZODIAC_SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

// 1. 移动星座详解（单星座名文件夹）
let movedSign = 0;
for (const sign of ZODIAC_SIGNS) {
  const src = path.join(ARTICLES, sign);
  if (fs.existsSync(src)) {
    const dst = path.join(SIGN, sign);
    fs.renameSync(src, dst);
    movedSign++;
    console.log(`  详解: ${sign} → zodiac-sign/`);
  }
}
console.log(`星座详解移动: ${movedSign} 个\n`);

// 2. 剩余全部是配对，移到 zodiac-compatibility
let movedCompat = 0;
const remaining = fs.readdirSync(ARTICLES).filter(f => fs.statSync(path.join(ARTICLES, f)).isDirectory());
for (const dir of remaining) {
  const src = path.join(ARTICLES, dir);
  const dst = path.join(COMPAT, dir);
  fs.renameSync(src, dst);
  movedCompat++;
}
console.log(`星座配对移动: ${movedCompat} 个\n`);

// 3. 验证
console.log('=== 验证 ===');
console.log('zodiac-sign:', fs.readdirSync(SIGN).filter(f => fs.statSync(path.join(SIGN, f)).isDirectory()).length, '个');
console.log('zodiac-compatibility:', fs.readdirSync(COMPAT).filter(f => fs.statSync(path.join(COMPAT, f)).isDirectory()).length, '个');
const artLeft = fs.readdirSync(ARTICLES).filter(f => fs.statSync(path.join(ARTICLES, f)).isDirectory()).length;
console.log('articles (剩余):', artLeft, '个');
if (artLeft === 0) {
  fs.rmdirSync(ARTICLES);
  console.log('articles/ 已清空删除');
}
