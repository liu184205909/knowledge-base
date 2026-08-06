/**
 * 批量改 draft → future schedule（每天2篇，随机时段9-20点，从明天起）
 * 用法：node schedule-draft-to-future.js   需 socks5 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os'), { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = `-u "${U}:${P}"`, PROXY = '--proxy socks5://127.0.0.1:10808', UA = 'curl/8.0.0';

function getDrafts() {
  let all = [], page = 1;
  while (page <= 10) {
    const r = execSync(`curl -s ${PROXY} ${AUTH} -A "${UA}" "https://${SITE}/wp-json/wp/v2/posts?status=draft&per_page=100&page=${page}&_fields=id,slug" --max-time 30`, { encoding: 'utf8' });
    let arr; try { arr = JSON.parse(r); } catch (e) { break; }
    if (!Array.isArray(arr) || !arr.length) break;
    all = all.concat(arr);
    if (arr.length < 100) break;
    page++;
  }
  return all;
}

function assignDate(i) {
  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0);
  const dayOffset = Math.floor(i / 2);
  const date = new Date(start);
  date.setDate(date.getDate() + dayOffset);
  const hour = 9 + Math.floor(Math.random() * 12);
  const minute = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, 0);
  return date.toISOString();
}

function updatePost(id, dateStr) {
  const tmp = path.join(__dirname, '_tmp-sched.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date: dateStr }), 'utf8');
  const r = execSync(`curl -s ${PROXY} ${AUTH} -A "${UA}" -H "Content-Type: application/json" -d @"${tmp}" "https://${SITE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,status,date" --max-time 30`, { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

(async () => {
  const drafts = getDrafts();
  console.log(`找到 ${drafts.length} 篇 draft，开始排期（每天2篇随机9-20点）...\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < drafts.length; i++) {
    const dateStr = assignDate(i);
    try {
      const r = updatePost(drafts[i].id, dateStr);
      ok++;
      if (i < 5 || i % 50 === 0 || i === drafts.length - 1) console.log(`✅ [${i + 1}/${drafts.length}] ${drafts[i].slug} → ${dateStr.slice(0, 16)} (${r.status})`);
    } catch (e) {
      fail++;
      console.log(`❌ [${i + 1}] ${drafts[i].slug}: ${e.message.slice(0, 100)}`);
    }
    // 每20篇暂停1秒避限流
    if ((i + 1) % 20 === 0) { await new Promise(r => setTimeout(r, 1000)); }
  }
  console.log(`\n=== ${ok} scheduled, ${fail} ERR (共${drafts.length}篇) ===`);
})();
