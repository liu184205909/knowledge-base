const fs = require('fs'), p = require('path');
const map = { 'ultimately': 'in the end', 'realm': 'area', 'vibrant': 'rich', 'navigate': 'work through', 'journey': 'practice', 'landscape': 'range', 'embrace': 'welcome' };
const files = ['amethyst-and-black-tourmaline', 'turquoise-and-hematite'];
for (const slug of files) {
  const f = p.join('articles', slug + '.json');
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  let c = a.content;
  const chg = [];
  for (const [k, v] of Object.entries(map)) {
    if (c.includes(k)) { c = c.split(k).join(v); chg.push(k + '→' + v); }
  }
  a.content = c;
  fs.writeFileSync(f, JSON.stringify(a, null, 2), 'utf8');
  console.log(slug + ': ' + (chg.length ? chg.join(', ') : '无替换'));
}
