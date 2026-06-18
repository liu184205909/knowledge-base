/**
 * 批量定时发布 Crystal Meaning 文章（WP future + date）。
 *
 * 每天 3 篇，时间随机（9:00-21:00），同一天 3 篇间隔 3h 以上（也随机）。
 * 像真人节奏：不固定 :00/:30，避开整点，自然抖动。
 *
 * 用法：
 *   node schedule-crystal-posts.js [startDate YYYY-MM-DD] [--start-id 38718]
 *
 * 从已上传的 draft post 里按 slug/Volume 顺序取，分配定时发布日期时间，设 WP future。
 * 读取 ~/.env 的 WP_USER/WP_APP_PASSWORD/WP_SITE。
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

// 读 ~/.env WP_*
function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    if (k.startsWith('WP_')) process.env[k] = t.slice(eq + 1).trim();
  }
}
loadEnv();
const E = require('../templates/elementor-utils');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// 生成排期：每天 3 篇，9:00-21:00 随机，间隔 3h+
function genSchedule(n, startDateStr) {
  const slots = [];
  let day = new Date(startDateStr + 'T00:00:00');
  let count = 0;
  while (count < n) {
    // 每天生成 3 个时间点，9-21 之间，间隔 3h+
    const base = 9; // 最早 9 点
    let last = base - 4; // 保证第一个 > base
    const dayTimes = [];
    for (let i = 0; i < 3 && count < n; i++) {
      let h;
      // 确保和上一个间隔 3h+
      do {
        h = base + Math.floor(Math.random() * (21 - base)); // 9-20 点
      } while (h - last < 3);
      last = h;
      const m = Math.floor(Math.random() * 60); // 分钟随机
      const dt = new Date(day);
      dt.setHours(h, m, Math.floor(Math.random() * 60), 0);
      dayTimes.push(dt);
      count++;
    }
    // 打乱当天顺序（更像真人，不严格按时间升序发布）
    dayTimes.sort(() => Math.random() - 0.5);
    // 但 WP 要按时间触发，所以还是升序排
    dayTimes.sort((a, b) => a - b);
    for (const dt of dayTimes) slots.push(dt);
    day = new Date(day.getTime() + 24 * 60 * 60 * 1000); // 下一天
  }
  return slots;
}

async function listDrafts() {
  // 列所有 draft 的 gemstone post
  const items = await E.apiRequest('/wp-json/wp/v2/gemstone?status=draft&per_page=100&context=edit', 'GET');
  return items; // [{id, slug, title, status, date}...]
}

async function schedulePost(id, isoDate) {
  // 设 future + date
  const r = await E.apiRequest('/wp-json/wp/v2/gemstone/' + id, 'POST', { status: 'future', date: isoDate });
  return r;
}

async function main() {
  const args = process.argv.slice(2);
  const startDate = args.find(a => !a.startsWith('--') && /^\d{4}-\d{2}-\d{2}$/.test(a)) || '2026-06-19';
  const startIdIdx = args.indexOf('--start-id');
  const startId = startIdIdx >= 0 ? parseInt(args[startIdIdx + 1]) : 0;

  console.log('=== Schedule Crystal Posts ===');
  console.log('start date:', startDate, startId ? '(from post ' + startId + ')' : '(all drafts)');

  const drafts = await listDrafts();
  console.log('drafts found:', drafts.length);

  // 过滤：排除已 scheduled/published，可选从 startId 开始
  let toSchedule = drafts.filter(d => d.status === 'draft');
  if (startId) {
    const idx = toSchedule.findIndex(d => d.id === startId);
    if (idx >= 0) toSchedule = toSchedule.slice(idx);
  }
  console.log('to schedule:', toSchedule.length);

  if (!toSchedule.length) { console.log('No drafts to schedule.'); return; }

  const slots = genSchedule(toSchedule.length, startDate);

  for (let i = 0; i < toSchedule.length; i++) {
    const post = toSchedule[i];
    const dt = slots[i];
    const iso = dt.toISOString();
    try {
      await schedulePost(post.id, iso);
      console.log('  ✓ %s (post %s) → %s', post.slug || post.title, post.id, iso);
    } catch (e) {
      console.error('  ✗ %s (post %s): %s', post.slug, post.id, e.message.slice(0, 100));
    }
  }
  console.log('done. %d posts scheduled.', toSchedule.length);
}

main().catch(e => { console.error(e); process.exit(1); });
