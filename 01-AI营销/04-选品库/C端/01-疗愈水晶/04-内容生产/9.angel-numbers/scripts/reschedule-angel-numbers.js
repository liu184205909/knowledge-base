/**
 * 天使号码100篇 draft → schedule(每天2篇,06-29起,09:00+15:00)
 * 1.删3个重复slug(-2版本)
 * 2.按articles-index顺序(核心数字先)排程
 * 用法：node reschedule-angel-numbers.js
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
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const SLUGS = idx.articles.map(a => a.slug);

// 1. 删3个重复(-2版本)
const DUPS = [46778, 46770, 46766];
DUPS.forEach(id => {
  try { execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X DELETE "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?force=true" --max-time 20', { encoding: 'utf8' }); console.log('删重复 ' + id); }
  catch (e) { console.log(id + ' 删失败'); }
});

// 2. fetch id+slug（排除 -2 重复）
const map = {};
for (let p = 1; p <= 2; p++) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?status=any&per_page=100&page=' + p + '&search=angel-number-meaning&_fields=id,slug" --max-time 30', { encoding: 'utf8' });
  const arr = JSON.parse(r); if (!arr.length) break;
  arr.forEach(x => { if (x.slug && !/-\d+$/.test(x.slug)) map[x.slug] = x.id; });
}
console.log('唯一slug篇数: ' + Object.keys(map).length);

// 3. 排程（每天2篇，06-29起，09:00+15:00）
const D0 = new Date(2026, 5, 29); // 2026-06-29
const TIMES = ['T09:00:00', 'T15:00:00'];
let ok = 0; const miss = [];
SLUGS.forEach((slug, i) => {
  const id = map[slug];
  if (!id) { miss.push(slug); return; }
  const day = Math.floor(i / 2);
  const t = TIMES[i % 2];
  const d = new Date(D0); d.setDate(d.getDate() + day);
  const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + t;
  const tmp = path.join(__dirname, '_tmp-sch.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date }), 'utf8');
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
    ok++;
    if (i < 4 || i >= SLUGS.length - 2) console.log('✓ [' + (i + 1) + '/100] ' + slug + ' → ' + date);
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 50)); }
  try { fs.unlinkSync(tmp); } catch (_) {}
});
console.log('\n=== schedule完成: ' + ok + ' OK, ' + miss.length + ' 缺post ===');
if (miss.length) console.log('缺: ' + miss.join(', '));
const lastDay = Math.floor((SLUGS.length - 1) / 2);
const lastD = new Date(D0); lastD.setDate(lastD.getDate() + lastDay);
console.log('首篇 2026-06-29 09:00 | 末篇 ' + lastD.toISOString().slice(0, 10) + ' (共 ' + (lastDay + 1) + ' 天, 每天2篇)');
