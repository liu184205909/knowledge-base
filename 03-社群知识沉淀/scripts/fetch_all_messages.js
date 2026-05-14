// 批量拉取钉钉群消息脚本 v4
// 支持命令行参数、断点续传
// 用法:
//   node fetch_all_messages.js --group "cidLqKjFxp9GtKIKa3IHEIniA==" --target "2025-08-01" --name "讨论群"
//   node fetch_all_messages.js  (默认: 重要通知群, 2026-01-15)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function getArg(name, def) { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; }

const GROUP_ID = getArg('group', 'cid4v9NI+PTFeKVa960hCmDHw==');
const TARGET_DATE = new Date(getArg('target', '2026-01-15') + 'T00:00:00+08:00');
const DIR_NAME = getArg('name', '重要通知群');
const LIMIT = 50;
const TIMEOUT = 120;
const MAX_RETRIES = 3;
const SAVE_INTERVAL = 10;
const OUTPUT_DIR = path.join(__dirname, '..', '2026优联荟', 'raw_data_' + DIR_NAME);

console.log('=== ' + DIR_NAME + ' target=' + getArg('target','2026-01-15') + ' ===');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PROGRESS = path.join(OUTPUT_DIR, '_progress.json');
let allMessages = [], batchNum = 0, resumeTime = null;

if (fs.existsSync(PROGRESS)) {
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  console.log('Resume: ' + p.totalMessages + ' msgs at ' + p.lastTime);
  fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('messages_') && f.endsWith('.json'))
    .forEach(f => allMessages.push(...JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8'))));
  batchNum = p.batches; resumeTime = p.lastTime;
}

function doFetch(timeStr, retry) {
  retry = retry || 0;
  batchNum++;
  let cmd = 'dws chat message list --group "' + GROUP_ID + '" --limit ' + LIMIT + ' --format json --timeout ' + TIMEOUT;
  if (timeStr) cmd += ' --time "' + timeStr + '"';
  console.log('[' + batchNum + '] ' + (timeStr || 'latest'));
  try {
    return JSON.parse(execSync(cmd, { encoding: 'utf8', timeout: (TIMEOUT + 30) * 1000, maxBuffer: 10485760 }));
  } catch (e) {
    if (retry < MAX_RETRIES) { console.log('  retry ' + (retry+1)); batchNum--; var s = Date.now(); while (Date.now() - s < 5000); return doFetch(timeStr, retry + 1); }
    throw e;
  }
}

function saveProgress(t) { fs.writeFileSync(PROGRESS, JSON.stringify({ totalMessages: allMessages.length, batches: batchNum, lastTime: t })); }
function saveDaily() {
  const g = {};
  allMessages.forEach(function(m) { var d = m.time.split(' ')[0]; (g[d] = g[d] || []).push(m); });
  Object.keys(g).forEach(function(d) { fs.writeFileSync(path.join(OUTPUT_DIR, 'messages_' + d.replace(/-/g, '') + '.json'), JSON.stringify(g[d], null, 2)); });
}

var cur = resumeTime, hasMore = true, sc = 0;
while (hasMore) {
  try {
    var r = doFetch(cur);
    var ms = (r.result && r.result.messages) || [];
    if (!ms.length) { console.log('Empty.'); break; }
    var ids = new Set(allMessages.map(function(m) { return m.openMessageId || (m.time + m.content.slice(0, 20)); }));
    var nw = ms.filter(function(m) { return !ids.has(m.openMessageId || (m.createTime + m.content.slice(0, 20))); });
    if (!nw.length && allMessages.length) { console.log('No new.'); break; }
    allMessages = allMessages.concat(nw.map(function(m) { return { time: m.createTime, content: m.content, openMessageId: m.openMessageId }; }));
    var lt = ms[ms.length - 1].createTime;
    console.log('  +' + nw.length + ' (' + ms[0].createTime + ' ~ ' + lt + ') total=' + allMessages.length);
    if (++sc >= SAVE_INTERVAL) { saveDaily(); saveProgress(lt); console.log('  [saved]'); sc = 0; }
    if (new Date(lt.replace(/-/g, '/')) <= TARGET_DATE) { console.log('Reached target.'); allMessages = allMessages.filter(function(m) { return new Date(m.time.replace(/-/g, '/')) >= TARGET_DATE; }); break; }
    cur = lt; hasMore = r.result && r.result.hasMore;
    if (!hasMore) break;
  } catch (e) {
    console.error('Err #' + batchNum + ': ' + e.message.substring(0, 200));
    saveDaily();
    if (allMessages.length) { saveProgress(allMessages[allMessages.length - 1].time); console.log('Saved. Re-run to continue.'); }
    break;
  }
}

saveDaily();
allMessages.sort(function(a, b) { return b.time.localeCompare(a.time); });
var dg = {};
allMessages.forEach(function(m) { var d = m.time.split(' ')[0]; (dg[d] = dg[d] || []).push(m); });
fs.writeFileSync(path.join(OUTPUT_DIR, 'summary.json'), JSON.stringify({
  dirName: DIR_NAME, totalMessages: allMessages.length, batches: batchNum,
  dateRange: { from: allMessages.length ? allMessages[allMessages.length - 1].time : 'N/A', to: allMessages.length ? allMessages[0].time : 'N/A' },
  dailyCounts: Object.keys(dg).sort().map(function(d) { return { date: d, count: dg[d].length }; })
}, null, 2));
if (fs.existsSync(PROGRESS)) fs.unlinkSync(PROGRESS);
console.log('Done: ' + allMessages.length + ' msgs');
