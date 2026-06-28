/**
 * 真伪A1-A4 draft → schedule(每天1篇,A1旗舰起,06-29~07-02,18:00)
 * 错开天使号码(09:00+15:00)+How-to(12:00)
 * 用法：node reschedule-authenticity.js
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';

const ORDER = [
  'how-to-tell-if-crystal-is-real',    // A1 旗舰 06-29
  'real-vs-fake-amethyst',             // A2 06-30
  'how-to-tell-if-clear-quartz-is-real',// A3 07-01
  'most-faked-crystals',               // A4 07-02
];
const D0 = new Date(2026, 5, 29);
const TIME = 'T18:00:00';

let ok = 0; const miss = [];
ORDER.forEach((slug, i) => {
  let id;
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id&per_page=1" --max-time 20', { encoding: 'utf8' });
    id = JSON.parse(r)[0]?.id;
  } catch (e) {}
  if (!id) { miss.push(slug); return; }
  const d = new Date(D0); d.setDate(d.getDate() + i);
  const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + TIME;
  const tmp = path.join(__dirname, '_tmp-sch.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date }), 'utf8');
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
    ok++; console.log('✓ [' + (i + 1) + '/4] ' + slug + ' → ' + date);
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 50)); }
  try { fs.unlinkSync(tmp); } catch (_) {}
});
console.log('\n=== 真伪schedule完成: ' + ok + ' OK, ' + miss.length + ' 缺post ===');
console.log('首篇 A1 2026-06-29 18:00 | 末篇 A4 2026-07-02 (共4天每天1篇)');
