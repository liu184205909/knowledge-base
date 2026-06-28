/**
 * P2 schedule: Numerology 12 + Chinese Zodiac 15 = 27篇
 * 每天1篇,06-29起,随机时间(8-20时),Numerology/ChineseZodiac交错
 * 用法：node reschedule-p2.js
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

// 27篇交错(Chinese Zodiac / Numerology 交替,丰富每天类型)
const ORDER = [
  'fire-horse-2026','life-path-1',      // 06-29/30 时效+旗舰
  'horse-crystals','life-path-2',        // 07-01/02 本命年
  'dragon-crystals','life-path-3',       // 07-03/04
  'rabbit-crystals','life-path-4',       // 07-05/06
  'snake-crystals','life-path-5',        // 07-07/08
  'tiger-crystals','life-path-6',        // 07-09/10
  'ox-crystals','life-path-7',           // 07-11/12
  'goat-crystals','life-path-8',         // 07-13/14
  'monkey-crystals','life-path-9',       // 07-15/16
  'rooster-crystals','life-path-11',     // 07-17/18
  'dog-crystals','life-path-22',         // 07-19/20
  'rat-crystals','life-path-33',         // 07-21/22
  'pig-crystals','year-crystals','find-your-sign' // 07-23/24/25
];
const D0 = new Date(2026, 5, 29); // 2026-06-29

let ok = 0; const miss = [];
ORDER.forEach((slug, i) => {
  let id;
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id&per_page=1" --max-time 20', { encoding: 'utf8' });
    id = JSON.parse(r)[0]?.id;
  } catch (e) {}
  if (!id) { miss.push(slug); return; }
  const d = new Date(D0); d.setDate(d.getDate() + i);
  // 随机时间 8-20时
  const h = 8 + Math.floor(Math.random() * 12); // 8-19
  const m = Math.floor(Math.random() * 60);
  const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':00';
  const tmp = path.join(__dirname, '_tmp-sch.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date }), 'utf8');
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
    ok++; console.log('✓ [' + (i + 1) + '/27] ' + slug + ' → ' + date);
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 50)); }
  try { fs.unlinkSync(tmp); } catch (_) {}
});
console.log('\n=== P2 schedule完成: ' + ok + ' OK, ' + miss.length + ' 缺post ===');
if (miss.length) console.log('缺: ' + miss.join(', '));
const lastD = new Date(D0); lastD.setDate(lastD.getDate() + ORDER.length - 1);
console.log('首篇 2026-06-29 | 末篇 ' + lastD.toISOString().slice(0, 10) + ' (共' + ORDER.length + '天每天1篇随机时间)');
