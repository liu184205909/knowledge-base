/**
 * 清理 30 玄学 draft：
 *   删 16 重复（12 星座-2 id43633-44 + 4 天使-2 id46081/83/85/87）
 *   排期 14 主版（12 星座 id43609-20 + 天使 778/433 id46547/46692）
 *   排期 2026-12-19 起每天 1 篇 09:00（接塔罗重排 2026-12-18 后）
 *
 * 用法：node clean-zodiac-draft.js
 * 需 socks5(127.0.0.1:10808) + ~/.env
 * 注：force=true 永久删除（不可逆），已确认 -2 都是 title 完全相同的重复
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

// 删除 16 重复（12 星座-2 + 4 天使-2）
const delIds = [43633, 43634, 43635, 43636, 43637, 43638, 43639, 43640, 43641, 43642, 43643, 43644, 46081, 46083, 46085, 46087];
// 排期 14 主版（12 星座主 + 天使 778/433）
const schedIds = [43609, 43610, 43611, 43612, 43613, 43614, 43615, 43616, 43617, 43618, 43619, 43620, 46547, 46692];

console.log('=== 删除 16 重复 draft（force=true 永久删除）===');
let delOk = 0, delFail = 0;
for (const id of delIds) {
  try {
    const r = execSync(`curl -s ${AUTH} ${PROXY} ${UA} -X DELETE "https://${SITE}/wp-json/wp/v2/posts/${id}?force=true"`, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    const j = JSON.parse(r);
    if (j.deleted) { delOk++; console.log(`  🗑 删 ${id}`); }
    else { delFail++; console.log(`✗ ${id}: ${r.slice(0, 100)}`); }
  } catch (e) { delFail++; console.log(`✗ ${id}: ${e.message.slice(0, 100)}`); }
}

console.log('\n=== 排期 14 主版（2026-12-19 起每天 1 篇 09:00）===');
let sOk = 0, sFail = 0;
const start = new Date(2026, 11, 19); // 2026-12-19（月 0 基）
const tmp = path.join(__dirname, '_tmp-clean.json');
schedIds.forEach((id, i) => {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T09:00:00`;
  try {
    fs.writeFileSync(tmp, JSON.stringify({ date: dateStr, status: 'future' }), 'utf8');
    const r = execSync(`curl -s ${AUTH} ${PROXY} ${UA} -H "Content-Type: application/json" -X POST -d @"${tmp}" "https://${SITE}/wp-json/wp/v2/posts/${id}?_fields=id,slug,date"`, { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    const j = JSON.parse(r);
    if (j.id) { sOk++; console.log(`  ✅ ${id} → ${dateStr.slice(0, 10)}`); }
    else { sFail++; console.log(`✗ ${id}: ${r.slice(0, 100)}`); }
  } catch (e) { sFail++; console.log(`✗ ${id}: ${e.message.slice(0, 100)}`); }
});
try { fs.unlinkSync(tmp); } catch (e) {}
console.log(`\n=== 完成: 删 ${delOk}✓/${delFail}✗, 排期 ${sOk}✓/${sFail}✗ ===`);
