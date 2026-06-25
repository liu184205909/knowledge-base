const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

let html = fs.readFileSync(__dirname + '/../zodiac-checker.html', 'utf8');

// 修复字面 \uXXXX → 实际 Unicode 字符
const replacements = [
  [/\\u2726/g, '\u2726'],   // ✦
  [/\\u2014/g, '\u2014'],   // —
  [/\\u2192/g, '\u2192'],   // →
  [/\\u2648/g, '\u2648'],   // ♈
  [/\\u2649/g, '\u2649'],   // ♉
  [/\\u2650/g, '\u2650'],   // ♐
  [/\\u264a/g, '\u264a'],   // ♊
  [/\\u264b/g, '\u264b'],   // ♋
  [/\\u264c/g, '\u264c'],   // ♌
  [/\\u264d/g, '\u264d'],   // ♍
  [/\\u264e/g, '\u264e'],   // ♎
  [/\\u264f/g, '\u264f'],   // ♏
  [/\\u2651/g, '\u2651'],   // ♑
  [/\\u2652/g, '\u2652'],   // ♒
  [/\\u2653/g, '\u2653'],   // ♓
  [/\\u00b7/g, '\u00b7'],   // ·
];

let totalFixed = 0;
for (const [pattern, replacement] of replacements) {
  const matches = html.match(pattern);
  if (matches) {
    html = html.replace(pattern, replacement);
    totalFixed += matches.length;
    console.log('  替换', pattern.source, '→', replacement, ':', matches.length, '处');
  }
}

fs.writeFileSync(__dirname + '/../zodiac-checker.html', html, 'utf8');
console.log('\n总修复:', totalFixed, '处');

// 验证
const litU = html.match(/\\u[0-9a-f]{4}/gi);
console.log('残留 \\uXXXX:', litU ? litU.length + ' 处 (' + litU.slice(0, 5).join(', ') + ')' : '0（干净）');

// 上传到 page 43246
const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');
const content = '<!-- wp:html -->\n' + html + '\n<!-- /wp:html -->';
const body = JSON.stringify({ content });
const req = https.request({
  hostname: SITE,
  path: '/wp-json/wp/v2/pages/43246',
  method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 120000
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    try { const r = JSON.parse(d); console.log(r.id ? '\n✅ Zodiac Checker 上传成功 page ' + r.id : '\n❌ ' + JSON.stringify(r).slice(0, 200)); }
    catch (e) { console.log('\n❌ WP:', d.slice(0, 200)); }
  });
});
req.write(body);
req.end();
