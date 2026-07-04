/**
 * 把 tarot 分类 draft post 排成 future 定时发布（每天2篇，时间随机 9-21点）
 * 优先级：场景正位 → 场景逆位 → 配对（牌义页已排 future，跳过）
 * 起始日：牌义 future 最后日期 +1（查线上动态获取）
 * 用法：node schedule-future-posts.js   需 socks5 + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
process.on('uncaughtException', e => console.log('💥', e.message));

const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const PROXY = 'socks5://127.0.0.1:10808';

function curl(args) {
  const r = spawnSync('curl', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return r.stdout || '';
}

// 1. 查所有 tarot draft post（翻页拿全部）
function fetchDrafts() {
  let all = [], page = 1;
  while (true) {
    const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
      `https://${SITE}/wp-json/wp/v2/posts?categories=1570&status=draft&per_page=100&page=${page}&_fields=id,slug,date`]);
    let arr; try { arr = JSON.parse(out); } catch (e) { break; }
    if (!Array.isArray(arr) || !arr.length) break;
    all = all.concat(arr);
    if (arr.length < 100) break;
    page++;
    if (page > 10) break;
  }
  return all;
}

// 2. 查牌义 future 最后日期（起始日 = 它 +1）
function fetchLastFutureDate() {
  const out = curl(['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
    `https://${SITE}/wp-json/wp/v2/posts?categories=1570&status=future&per_page=100&_fields=id,slug,date`]);
  let arr; try { arr = JSON.parse(out); } catch (e) { return null; }
  if (!arr.length) return null;
  const dates = arr.map(p => p.date).sort();
  return dates[dates.length - 1]; // 最晚的 future 日期
}

// 3. 排序：场景正位 → 场景逆位 → 配对
function sortPriority(drafts) {
  return drafts.sort((a, b) => {
    const ra = rank(a.slug), rb = rank(b.slug);
    return ra - rb || a.slug.localeCompare(b.slug);
  });
}
function rank(slug) {
  if (slug.includes('-reversed')) return 2;          // 场景逆位
  if (slug.includes('-and-')) return 3;              // 配对
  if (/^(is|the-fool|the-magician|the-high|the-empress|the-emperor|the-hierophant|the-lovers|the-chariot|strength|the-hermit|wheel|justice|the-hanged|death|temperance|the-devil|the-tower|the-star|the-moon|the-sun|judgment|the-world)-for-/.test(slug)) return 1; // 场景正位
  return 4; // 其他
}

// 4. 生成定时日期（每天2篇，时间随机 9:00-20:59）
function genSchedule(startISO, total) {
  const start = new Date(startISO);
  const slots = [];
  for (let i = 0; i < total; i++) {
    const dayOffset = Math.floor(i / 2);
    const d = new Date(start);
    d.setDate(d.getDate() + dayOffset + 1);
    const hour = 9 + Math.floor(Math.random() * 12);
    const min = Math.floor(Math.random() * 60);
    d.setHours(hour, min, 0, 0);
    slots.push(d.toISOString().replace(/\.\d+Z$/, ''));
  }
  return slots;
}

// 5. update post status=future + date
function schedule(id, dateISO) {
  const payload = JSON.stringify({ status: 'future', date: dateISO });
  const r = spawnSync('curl', ['-s', '--proxy', PROXY, '-u', U + ':' + P, '--max-time', '30',
    '-X', 'POST', '-H', 'Content-Type: application/json', '-d', '@-',
    `https://${SITE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,status,date`],
    { input: payload, encoding: 'utf8' });
  return r.stdout || '';
}

// 主流程
(async () => {
  console.log('查 tarot draft post...');
  const drafts = fetchDrafts();
  console.log(`draft 数: ${drafts.length}`);

  const lastFuture = fetchLastFutureDate();
  console.log(`牌义 future 最后日期: ${lastFuture || '(无future,从今天起)'}`);
  const startISO = lastFuture || new Date().toISOString();

  const sorted = sortPriority(drafts);
  console.log(`排序后前5: ${sorted.slice(0, 5).map(p => p.slug.slice(0, 30)).join(', ')}`);

  const slots = genSchedule(startISO, sorted.length);
  console.log(`排期: ${slots[0]} → ${slots[slots.length - 1]} (${sorted.length}篇, 每天2篇)`);

  let ok = 0, fail = 0;
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const out = schedule(p.id, slots[i]);
    let success = false;
    try { success = JSON.parse(out).status === 'future'; } catch (e) {}
    if (success) { ok++; if (ok % 20 === 0) console.log(`✅ ${ok} 篇排好`); }
    else { fail++; console.log(`❌ ${p.slug}: ${out.slice(0, 100)}`); }
  }
  console.log(`\n=== 排期完成: ${ok} OK, ${fail} ERR / ${sorted.length} ===`);
})();
