/**
 * 排期 Minor 36 + 新手 10 = 46 篇 future
 * 接现有 future 最晚 2027-07-07 之后，每天 2 篇 → 23 天 → 2027-07-08 至 2027-07-30
 *
 * 排序规则：
 *   - 新手 10 优先排前（入门指引）
 *   - Minor 36 按 slug 字典序
 * 对象：本批次 upload 的 post id（Minor 51272-51307 + 新手 51308-51317）
 *
 * 红线：
 *   - update status=future + date 必带 context=edit（取 raw，避免 content 反序列化事故）
 *   - spawnSync 数组参数 + stdin payload
 *
 * 用法：node schedule-minor-beginner.js
 * 需 socks5(127.0.0.1:10808) + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');

const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const PROXY = 'socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');
const QC_DIR = path.join(BASE, '_qc');
const CAT_ID = 1570;

function curl(args, payload) {
  const r = spawnSync('curl', args, { encoding: 'utf8', input: payload });
  if (r.status !== 0) throw new Error('curl exit ' + r.status + ' ' + (r.stderr || '').slice(0, 120));
  return r.stdout || '';
}

function scheduleFuture(id, dateISO) {
  const payload = JSON.stringify({ status: 'future', date: dateISO });
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-X', 'POST', '-H', 'Content-Type: application/json', '--data', '@-',
    '-w', '\n%{http_code}', '--max-time', '60',
    'https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=id,slug,status,date'],
    payload);
  const arr = out.trim().split(/\n/);
  const code = arr[arr.length - 1].trim();
  const body = arr.slice(0, -1).join('');
  if (code !== '200') throw new Error('schedule HTTP ' + code + ' body=' + body.slice(0, 160));
  return JSON.parse(body);
}

// ---------- 1. 取本批 46 篇 draft（ Minor + 新手，按 slug 区分） ----------
// Minor slug: tarot-*-crystals，新手 slug: 在 articles-beginner/ 文件名清单内
const beginnerSlugs = fs.readdirSync(path.join(BASE, 'articles-beginner'))
  .filter(f => /\.md$/.test(f)).map(f => f.replace(/\.md$/, ''));

function fetchDrafts() {
  // status=draft，分类 1570，翻页拿全
  let all = [], page = 1;
  while (true) {
    const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
      'https://' + SITE + '/wp-json/wp/v2/posts?categories=' + CAT_ID + '&status=draft&per_page=100&page=' + page + '&_fields=id,slug,date,status']);
    let a; try { a = JSON.parse(out); } catch (e) { break; }
    if (!Array.isArray(a) || !a.length) break;
    all = all.concat(a); if (a.length < 100) break; page++; if (page > 10) break;
  }
  return all;
}

const drafts = fetchDrafts();
console.log('分类 1570 现有 draft: ' + drafts.length);

// 本批 46 = Minor（tarot-*-crystals，但排除 Major 22 + Top20 已 future 的）
//   Minor 文件清单 = articles/tarot-*-crystals.md 56 篇（含 Major 22 不在 articles/，实际 articles/ 全是 Minor 56）
//   Top20 已 future（不在 draft），本批 Minor 36 在 draft
// 新手 10 在 draft
const minorFileSlugs = fs.readdirSync(path.join(BASE, 'articles'))
  .filter(f => /^tarot-.+-crystals\.md$/.test(f)).map(f => f.replace(/\.md$/, ''));

const batch = drafts.filter(p => {
  if (beginnerSlugs.includes(p.slug)) return true;
  if (minorFileSlugs.includes(p.slug)) return true;
  return false;
});
console.log('本批待排期（Minor 36 + 新手 10）: ' + batch.length);

// ---------- 2. 排序：新手先，Minor 字典序 ----------
const sorted = batch.slice().sort((a, b) => {
  const aBeg = beginnerSlugs.includes(a.slug), bBeg = beginnerSlugs.includes(b.slug);
  if (aBeg !== bBeg) return aBeg ? -1 : 1;
  return a.slug.localeCompare(b.slug);
});

// ---------- 3. 起始日 = 现有 future 最晚 +1 天 ----------
let allFuture = [], page = 1;
while (true) {
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
    'https://' + SITE + '/wp-json/wp/v2/posts?categories=' + CAT_ID + '&status=future&per_page=100&page=' + page + '&_fields=id,slug,date']);
  let a; try { a = JSON.parse(out); } catch (e) { break; }
  if (!Array.isArray(a) || !a.length) break;
  allFuture = allFuture.concat(a); if (a.length < 100) break; page++; if (page > 10) break;
}
const futureDates = allFuture.map(p => p.date).sort();
const lastFuture = futureDates[futureDates.length - 1];
console.log('现有 future: ' + allFuture.length + '，最晚: ' + lastFuture);

const start = new Date(lastFuture || new Date().toISOString());
// 生成定时：每天 2 篇，时间随机 9:00-20:59
const slots = [];
for (let i = 0; i < sorted.length; i++) {
  const dayOffset = Math.floor(i / 2);
  const d = new Date(start);
  d.setDate(d.getDate() + dayOffset + 1);
  const hour = 9 + Math.floor(Math.random() * 12);
  const min = Math.floor(Math.random() * 60);
  d.setHours(hour, min, 0, 0);
  slots.push(d.toISOString().replace(/\.\d+Z$/, ''));
}
console.log('排期范围: ' + slots[0] + ' → ' + slots[slots.length - 1] + ' (' + sorted.length + ' 篇, 每天 2 篇)');

// ---------- 4. 执行排期 ----------
let sOk = 0, sFail = 0;
const sResults = [];
for (let i = 0; i < sorted.length; i++) {
  const u = sorted[i];
  try {
    const r = scheduleFuture(u.id, slots[i]);
    const success = r.status === 'future';
    sResults.push({ slug: u.slug, id: u.id, date: slots[i], status: r.status, ok: success });
    if (success) { sOk++; console.log('✅ ' + u.slug + ' (id:' + u.id + ') → ' + slots[i]); }
    else { sFail++; console.log('❌ ' + u.slug + ' → status=' + r.status); }
  } catch (e) {
    sFail++; sResults.push({ slug: u.slug, id: u.id, date: slots[i], error: e.message.slice(0, 120), ok: false });
    console.log('❌ ' + u.slug + ': ' + e.message.slice(0, 120));
  }
}

fs.writeFileSync(path.join(QC_DIR, 'schedule-minor-beginner-results.json'), JSON.stringify(sResults, null, 2), 'utf8');
console.log('\n=== 排期完成: ' + sOk + ' OK, ' + sFail + ' ERR / ' + sorted.length + ' ===');
console.log('排期范围: ' + slots[0] + ' → ' + slots[slots.length - 1]);
console.log('结果已写: _qc/schedule-minor-beginner-results.json');
