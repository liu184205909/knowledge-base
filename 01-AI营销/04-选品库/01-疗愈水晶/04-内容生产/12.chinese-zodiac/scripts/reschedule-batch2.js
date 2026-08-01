/**
 * 统一schedule: Chinese Zodiac 15 + Meditation 9 + Tarot 23 = 47篇
 * 每天1篇随机时间,07-23起(Numerology 12完后连续),3类型交错
 * 用法：node reschedule-batch2.js
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

// 3类型数组（优先级排序）
const CZ = ['fire-horse-2026','horse-crystals','dragon-crystals','rabbit-crystals','snake-crystals','tiger-crystals','ox-crystals','goat-crystals','monkey-crystals','rooster-crystals','dog-crystals','rat-crystals','pig-crystals','year-crystals','find-your-sign'];
const MED = ['crystals-for-focus-meditation','crystals-for-sleep-meditation','crystals-for-emotional-release-meditation','best-crystals-for-meditation','grounding-meditation-with-crystals','meditation-crystals-for-beginners','manifestation-meditation-with-crystals','crystal-meditation-script','meditation-room-crystals'];
const TAROT = ['tarot-the-fool-crystals','crystals-for-tarot-cards','tarot-the-magician-crystals','tarot-the-high-priestess-crystals','tarot-the-empress-crystals','tarot-the-emperor-crystals','tarot-the-hierophant-crystals','tarot-the-lovers-crystals','tarot-the-chariot-crystals','tarot-strength-crystals','tarot-the-hermit-crystals','tarot-wheel-of-fortune-crystals','tarot-justice-crystals','tarot-the-hanged-man-crystals','tarot-death-crystals','tarot-temperance-crystals','tarot-the-devil-crystals','tarot-the-tower-crystals','tarot-the-star-crystals','tarot-the-moon-crystals','tarot-the-sun-crystals','tarot-judgment-crystals','tarot-the-world-crystals'];

// round-robin交错3类型
const ORDER = [];
let ci = 0, mi = 0, ti = 0;
while (ci < CZ.length || mi < MED.length || ti < TAROT.length) {
  if (ci < CZ.length) ORDER.push(CZ[ci++]);
  if (mi < MED.length) ORDER.push(MED[mi++]);
  if (ti < TAROT.length) ORDER.push(TAROT[ti++]);
}
console.log('总篇数:', ORDER.length, '(CZ15+Med9+Tarot23=47)');

const D0 = new Date(2026, 6, 23); // 2026-07-23

let ok = 0; const miss = [];
ORDER.forEach((slug, i) => {
  let id;
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id&per_page=1" --max-time 20', { encoding: 'utf8' });
    id = JSON.parse(r)[0]?.id;
  } catch (e) {}
  if (!id) { miss.push(slug); return; }
  const d = new Date(D0); d.setDate(d.getDate() + i);
  const h = 8 + Math.floor(Math.random() * 12);
  const m = Math.floor(Math.random() * 60);
  const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':00';
  const tmp = path.join(__dirname, '_tmp-bs2.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date }), 'utf8');
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
    ok++;
    if (i < 3 || i >= ORDER.length - 3) console.log('✓ [' + (i + 1) + '/47] ' + slug + ' → ' + date);
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 50)); }
  try { fs.unlinkSync(tmp); } catch (_) {}
});
console.log('\n=== 统一schedule完成: ' + ok + ' OK, ' + miss.length + ' 缺post ===');
if (miss.length) console.log('缺: ' + miss.join(', '));
const lastD = new Date(D0); lastD.setDate(lastD.getDate() + ORDER.length - 1);
console.log('首篇 2026-07-23 | 末篇 ' + lastD.toISOString().slice(0, 10) + ' (共' + ORDER.length + '天每天1篇随机时间, 3类型交错)');
