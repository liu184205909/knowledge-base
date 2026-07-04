/**
 * 重排塔罗 668 篇 future（排除每日运势365/水晶/玄学）
 *
 * 策略：拉所有 future → 正向匹配塔罗 slug → 按 slug 排序（类型自然分组）
 *       → 分配 2026-07-04 起每天4篇（09/12/15/18点）→ update post date+status=future
 *
 * 用法：
 *   node reschedule-tarot.js --dry   (打印分类+计划，不写)
 *   node reschedule-tarot.js         (执行重排)
 *
 * 需 socks5(127.0.0.1:10808) + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = `-u "${U}:${P}"`, PROXY = '--proxy socks5://127.0.0.1:10808', UA = '-H "User-Agent: curl/8.0.0"';
const DRY = process.argv.includes('--dry');

function fetchPage(page) {
  const cmd = `curl -s ${AUTH} ${PROXY} ${UA} "https://${SITE}/wp-json/wp/v2/posts?status=future&per_page=100&page=${page}&_fields=id,slug,date&orderby=date&order=asc"`;
  const r = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  try { return JSON.parse(r); } catch (e) { console.error('parse err page', page, r.slice(0, 200)); return []; }
}

// 拉所有 future
console.log('拉取 future post...');
const all = [];
for (let p = 1; p <= 15; p++) {
  const b = fetchPage(p);
  if (!b.length) break;
  all.push(...b);
  console.log(`  page ${p}: +${b.length} (总 ${all.length})`);
  if (b.length < 100) break;
}

// 22 Major 牌精确列表（slug 无 the-，如 fool/death/hanged-man）
const CARDS = 'fool|magician|high-priestess|empress|emperor|hierophant|lovers|chariot|strength|hermit|wheel-of-fortune|justice|hanged-man|death|temperance|devil|tower|star|moon|sun|judg(e)?ment|world';
const tarotRe = new RegExp(
  'is-(the-)?(' + CARDS + ')-yes-or-no|' +  // 是与否（含/不含 the-）
  'tarot-.*-crystals|' +  // 牌义 Major (tarot-{card}-crystals) + Minor (tarot-{slug}-crystals)
  '(' + CARDS + ')-for-(love|career|finances|health|spiritual)|' +  // 场景正位
  '(' + CARDS + ')-for-.*-reversed|' +  // 场景逆位
  '(' + CARDS + ')-and-(the-)?(' + CARDS + ')|' +  // 配对（22牌两两，避水晶配对）
  '-spread$|' +  // 牌阵
  'how-to.*tarot|tarot-for-beginners|first-tarot|storing-tarot|reading-tarot|reversed-tarot|major-vs-minor|arcana|daily-tarot-practice|crystals-for-tarot|tarot-card-meanings-list|tarot-journaling',
  'i');
const tarotPosts = all.filter(p => tarotRe.test(p.slug));
const excluded = all.filter(p => !tarotRe.test(p.slug));
// 诊断：排除里含塔罗特征的可疑漏项
const suspectRe = /tarot|yes-or-no|-spread$|how-to|arcana|-for-(love|career|finances|health|spiritual)|-and-the-/i;
const suspects = excluded.filter(p => suspectRe.test(p.slug));
console.log(`\n排除里可疑塔罗(${suspects.length}): ${suspects.map(p => p.slug).slice(0, 40).join(', ')}`);

console.log(`\n=== 分类 ===`);
console.log(`总 future: ${all.length}`);
console.log(`塔罗(匹配): ${tarotPosts.length}`);
console.log(`排除(非塔罗): ${excluded.length}（每日运势365+水晶/玄学约168）`);
console.log(`排除样例: ${excluded.slice(0, 15).map(p => p.slug).join(', ')}`);

if (tarotPosts.length < 600 || tarotPosts.length > 700) {
  console.log(`\n⚠️ 塔罗数 ${tarotPosts.length} ≠ 预期 668，分类可能不准。检查排除样例。`);
  if (DRY) console.log('[dry] 仍继续打印计划供检阅');
}

// 按 slug 排序（类型自然分组：is-/tarot-/the-*-and/the-*-for/spread/how-to）
tarotPosts.sort((a, b) => a.slug.localeCompare(b.slug));

// 分配 date：2026-07-04 起，每天 4 篇 09/12/15/18（本地日期，避 UTC 时区偏移）
const start = new Date(2026, 6, 4);  // 本地 2026-07-04（月 0 基）
const times = ['09:00:00', '12:00:00', '15:00:00', '18:00:00'];
const plan = tarotPosts.map((p, i) => {
  const day = Math.floor(i / 4);
  const slot = i % 4;
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + day);
  const yyyy = d.getFullYear(), mm = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return { ...p, newDate: `${yyyy}-${mm}-${dd}T${times[slot]}` };
});

console.log(`\n=== 重排计划 ===`);
console.log(`${plan.length} 篇, ${plan[0].newDate.slice(0, 10)} → ${plan[plan.length - 1].newDate.slice(0, 10)} (${Math.ceil(plan.length / 4)} 天)`);
console.log(`前8:`);
plan.slice(0, 8).forEach(p => console.log(`  ${p.newDate.slice(0, 16)}  ${p.slug.slice(0, 50)}`));
console.log(`后4:`);
plan.slice(-4).forEach(p => console.log(`  ${p.newDate.slice(0, 16)}  ${p.slug.slice(0, 50)}`));

if (DRY) { console.log('\n[dry] 不写入。确认无误后去 --dry 执行。'); process.exit(0); }

// update
console.log('\n=== 执行 update ===');
let ok = 0, fail = 0;
const tmp = path.join(__dirname, '_tmp-resched.json');
for (const p of plan) {
  try {
    fs.writeFileSync(tmp, JSON.stringify({ date: p.newDate, status: 'future' }), 'utf8');
    const r = execSync(`curl -s ${AUTH} ${PROXY} ${UA} -H "Content-Type: application/json" -X POST -d @"${tmp}" "https://${SITE}/wp-json/wp/v2/posts/${p.id}?_fields=id,slug,date"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const j = JSON.parse(r);
    if (j.id) { ok++; if (ok % 20 === 0) console.log(`  ${ok}/${plan.length}...`); }
    else { fail++; console.log(`✗ ${p.slug}: ${r.slice(0, 150)}`); }
  } catch (e) { fail++; console.log(`✗ ${p.slug}: ${e.message.slice(0, 150)}`); }
}
try { fs.unlinkSync(tmp); } catch (e) {}
console.log(`\n=== 完成: ${ok} OK, ${fail} ERR / ${plan.length} ===`);
