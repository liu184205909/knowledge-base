const fs = require('fs');
const path = require('path');
const ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';

function walk(dir) {
  const r = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'articles') {
      r.push(...walk(f));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      r.push(f);
    }
  }
  return r;
}

const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const files = walk(ROOT);
let fixed = 0;

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;

  // /zodiac/{sign}/ → /{sign}/
  if (c.includes('/zodiac/{sign}/')) { c = c.split('/zodiac/{sign}/').join('/{sign}/'); changed = true; }
  if (c.includes('/zodiac/{sign}"')) { c = c.split('/zodiac/{sign}"').join('/{sign}"'); changed = true; }
  if (c.includes('/zodiac/{sign} ')) { c = c.split('/zodiac/{sign} ').join('/{sign} '); changed = true; }
  if (c.includes('/zodiac/{sign}|')) { c = c.split('/zodiac/{sign}|').join('/{sign}|'); changed = true; }

  // 具体示例 /zodiac/aries → /aries
  for (const s of signs) {
    const patterns = ['/zodiac/' + s + '"', '/zodiac/' + s + ' ', '/zodiac/' + s + '|', '/zodiac/' + s + ')'];
    for (const p of patterns) {
      if (c.includes(p)) {
        c = c.split(p).join(p.replace('/zodiac/', '/'));
        changed = true;
      }
    }
  }

  // /category/zodiac-crystals/ → /category/zodiac/zodiac-crystals/
  if (c.includes('/category/zodiac-crystals/') && !c.includes('/category/zodiac/zodiac-crystals/')) {
    c = c.split('/category/zodiac-crystals/').join('/category/zodiac/zodiac-crystals/');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, c, 'utf8');
    fixed++;
    console.log('  修复:', path.relative(ROOT, f));
  }
}
console.log('\n总修复:', fixed, '个文件');
