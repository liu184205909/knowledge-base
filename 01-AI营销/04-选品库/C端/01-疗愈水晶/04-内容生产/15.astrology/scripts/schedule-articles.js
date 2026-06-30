/**
 * Astrology 7 篇排期(future) — 每天1篇随机时间(UTC)
 * 顺序: hub 先发(建立系列入口) → 6 事件按优先级
 * 起始 2026-06-30，每天1篇，到 2026-07-06
 * 用法：node schedule-articles.js [--dry-run]
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const dryRun = process.argv.includes('--dry-run');

// (slug, postId) — 来自 verify-results.json
const ORDER = [
  { slug: 'crystals-for-astrology-events', id: 48049, date: '2026-06-30' }, // hub 先发
  { slug: 'crystals-for-mercury-retrograde', id: 48045, date: '2026-07-01' },
  { slug: 'crystals-for-saturn-return', id: 48028, date: '2026-07-02' },
  { slug: 'crystals-for-full-moon', id: 48031, date: '2026-07-03' },
  { slug: 'crystals-for-new-moon', id: 48034, date: '2026-07-04' },
  { slug: 'crystals-for-eclipse', id: 48037, date: '2026-07-05' },
  { slug: 'crystals-for-venus-retrograde', id: 48040, date: '2026-07-06' },
];

function randTime() {
  // UTC 13:00-22:59 随机（美东 09:00-18:59 活跃窗口）
  const h = 13 + Math.floor(Math.random() * 10);
  const m = Math.floor(Math.random() * 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`;
}

const results = [];
for (const a of ORDER) {
  const time = randTime();
  const dateIso = a.date + 'T' + time; // UTC, WP timezone=""
  if (dryRun) {
    console.log(`[DRY] ${a.slug} (id:${a.id}) -> ${dateIso}`);
    results.push({ slug: a.slug, id: a.id, date: dateIso, status: 'dry' });
    continue;
  }
  const tmp = path.join(__dirname, '_tmp-sched.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date: dateIso, date_gmt: dateIso }), 'utf8');
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + a.id + '?_fields=id,status,date,link" --max-time 30', { encoding: 'utf8' });
    fs.unlinkSync(tmp);
    const j = JSON.parse(r);
    if (j.id) {
      results.push({ slug: a.slug, id: j.id, date: j.date, status: j.status, link: j.link });
      console.log(`OK ${a.slug} (id:${j.id}) -> ${j.date} [${j.status}]`);
    } else {
      results.push({ slug: a.slug, id: a.id, error: (j.message || r).slice(0, 150) });
      console.log(`FAIL ${a.slug}: ${(j.message || r).slice(0, 150)}`);
    }
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch (_) {}
    results.push({ slug: a.slug, id: a.id, error: e.message.slice(0, 150) });
    console.log(`ERR ${a.slug}: ${e.message.slice(0, 100)}`);
  }
}
fs.writeFileSync(path.join(__dirname, '..', '_qc', 'schedule-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log(`\n=== schedule done: ${results.filter(r => !r.error).length}/${results.length} ${dryRun?'(dry)':''} ===`);
