/**
 * 批量定时发布文章（WP future + date）。支持 gemstone CPT 和 post 两种端点。
 *
 * 每天 3 篇，时间随机（9:00-21:00），同一天 3 篇间隔 3h 以上（随机抖动）。
 *
 * 两种模式：
 *   1. 默认（draft → future，自动接续）：
 *        node schedule-crystal-posts.js [--type gemstone|post] [--start-id N] [--from YYYY-MM-DD]
 *      自动检测现有 future 的最大日期，新 draft 从【次日】接续排 → 多次运行不再堆积。
 *      --type 指定 WP 端点（gemstone=水晶百科 CPT，post=星座/博客等普通文章），默认 gemstone。
 *      --from 可强制起始日（覆盖自动接续）。
 *
 *   2. 重排现有 future（--redistribute）：
 *        node schedule-crystal-posts.js --redistribute YYYY-MM-DD [--type post]           # dry-run 预览
 *        node schedule-crystal-posts.js --redistribute YYYY-MM-DD --type post --apply     # 实写
 *      取所有 future，从指定日期起每天 3 篇重新均匀分配。默认 dry-run，加 --apply 才写。
 *
 * 读取 ~/.env 的 WP_USER/WP_APP_PASSWORD/WP_SITE。
 *
 * 历史 bug（已修）：
 *   - 旧版间隔 3-6h + cursor>21 break → 第 3 篇常被丢，且多次运行从固定 startDate 起、无去重，
 *     多批 draft 叠在开头几天 → 出现 7-8 篇/天。现间隔收为 3-4.5h（3 篇必在 9-21 内，无需 break），
 *     默认模式自动接续，redistribute 模式用于一次性铺平。
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

// WP 端点：gemstone（水晶百科 CPT）| post（星座/博客等普通文章）。main 里按 --type 设置。
let ENDPOINT = 'gemstone';

// 生成排期：每天 3 篇，间隔 3-4.5h（3 篇最多 11+4.5+4.5=20 ≤ 21），分钟/秒随机抖动
function genSchedule(n, startDateStr) {
  const slots = [];
  let day = new Date(startDateStr + 'T00:00:00');
  let count = 0;
  while (count < n) {
    let cursor = 9 + Math.random() * 2; // 第一篇 9-11
    const dayTimes = [];
    for (let i = 0; i < 3 && count < n; i++) {
      if (i > 0) cursor += 3 + Math.random() * 1.5; // 间隔 3-4.5h
      const h = Math.floor(cursor);
      const m = Math.floor((cursor - h) * 60 + Math.random() * 10) % 60;
      const s = Math.floor(Math.random() * 60);
      const dt = new Date(day);
      dt.setHours(h, m, s, 0);
      dayTimes.push(dt);
      count++;
    }
    dayTimes.sort((a, b) => a - b);
    for (const dt of dayTimes) slots.push(dt);
    day = new Date(day.getTime() + 24 * 60 * 60 * 1000);
  }
  return slots;
}

async function listByStatus(status) {
  let all = [], page = 1;
  while (true) {
    const items = await E.apiRequest(
      '/wp-json/wp/v2/' + ENDPOINT + '?status=' + status + '&per_page=100&page=' + page + '&context=edit',
      'GET'
    );
    if (!items || !items.length) break;
    all = all.concat(items);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

async function getMaxFutureDate() {
  const future = await listByStatus('future');
  if (!future.length) return null;
  return future.reduce((max, p) => {
    const d = new Date(p.date);
    return d > max ? d : max;
  }, new Date(0));
}

async function schedulePost(id, isoDate) {
  return await E.apiRequest('/wp-json/wp/v2/' + ENDPOINT + '/' + id, 'POST', { status: 'future', date: isoDate });
}

const nextDay = d => new Date(d.getTime() + 24 * 60 * 60 * 1000);
const ymd = d => d.toISOString().slice(0, 10);

async function main() {
  const args = process.argv.slice(2);
  const redistribute = args.includes('--redistribute');
  const apply = args.includes('--apply');
  const dateArg = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
  const startIdIdx = args.indexOf('--start-id');
  const startId = startIdIdx >= 0 ? parseInt(args[startIdIdx + 1]) : 0;
  const typeIdx = args.indexOf('--type');
  ENDPOINT = typeIdx >= 0 ? args[typeIdx + 1] : 'gemstone'; // gemstone | post

  console.log('=== Schedule Posts ===  endpoint: /wp/v2/' + ENDPOINT);

  if (redistribute) {
    const startDate = dateArg || ymd(new Date());
    let posts = await listByStatus('future');
    console.log('mode: REDISTRIBUTE | start:', startDate, '| future:', posts.length, apply ? '| APPLY' : '| DRY-RUN');
    if (!posts.length) { console.log('No future posts.'); return; }

    posts.sort((a, b) => a.id - b.id); // 按 id 稳定排序，保证重排顺序确定
    const slots = genSchedule(posts.length, startDate);

    const byDay = {};
    slots.forEach(dt => { const d = ymd(dt); byDay[d] = (byDay[d] || 0) + 1; });
    const uneven = Object.values(byDay).filter(n => n !== 3).length;
    console.log('new plan: %d posts over %d days | days not 3-per-day: %d', posts.length, Object.keys(byDay).length, uneven);
    console.log('first day:', slots[0].toISOString(), '| last day:', slots[slots.length - 1].toISOString());
    Object.keys(byDay).sort().slice(0, 6).forEach(d => console.log('  %s : %d', d, byDay[d]));

    if (!apply) { console.log('\nDRY-RUN, nothing written. Add --apply to write.'); return; }

    let ok = 0, fail = 0;
    for (let i = 0; i < posts.length; i++) {
      try {
        await schedulePost(posts[i].id, slots[i].toISOString());
        ok++;
        if (i % 30 === 0) console.log('  %d/%d ...', i + 1, posts.length);
      } catch (e) {
        fail++;
        console.error('  ✗ post %s: %s', posts[i].id, e.message.slice(0, 100));
      }
    }
    console.log('done. redistributed %d posts (ok=%d fail=%d).', posts.length, ok, fail);
  } else {
    let drafts = (await listByStatus('draft')).filter(d => d.status === 'draft');
    if (startId) {
      const idx = drafts.findIndex(d => d.id === startId);
      if (idx >= 0) drafts = drafts.slice(idx);
    }
    console.log('mode: SCHEDULE DRAFTS | drafts:', drafts.length);
    if (!drafts.length) { console.log('No drafts to schedule.'); return; }

    let startDate;
    if (dateArg) {
      startDate = dateArg;
      console.log('start date (--from):', startDate);
    } else {
      const maxD = await getMaxFutureDate();
      startDate = maxD ? ymd(nextDay(maxD)) : ymd(new Date());
      console.log('start date (auto-continue from last future):', startDate);
    }

    const slots = genSchedule(drafts.length, startDate);
    console.log('first slot:', slots[0].toISOString(), '| last slot:', slots[slots.length - 1].toISOString());

    let ok = 0, fail = 0;
    for (let i = 0; i < drafts.length; i++) {
      try { await schedulePost(drafts[i].id, slots[i].toISOString()); ok++; }
      catch (e) { fail++; console.error('  ✗ post %s: %s', drafts[i].id, e.message.slice(0, 100)); }
    }
    console.log('done. scheduled %d drafts (ok=%d fail=%d).', drafts.length, ok, fail);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
