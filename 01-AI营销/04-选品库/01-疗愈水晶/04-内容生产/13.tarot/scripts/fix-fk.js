/**
 * fk 补：场景+配对文章 rank_math_focus_keyword 空，从 Brief 提取 → setRankMath
 * 提取优先级：① focus_keyword（rank_math）字段 ② [1] 主关键词首个
 * 配对 fallback：无 fk 且文件名含 -and-，从文件名推导（strength-and-the-devil → "strength and the devil tarot"）
 * 关键：用 spawnSync + 数组参数 + stdin payload，绕开 cmd.exe 引号嵌套地狱（exit 4 根因）
 * 用法：node fix-fk.js   需 socks5://127.0.0.1:10808 + ~/.env (WP_USER/WP_APP_PASSWORD/WP_SITE)
 */
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');

const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const PROXY = 'socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');
const ART = path.join(BASE, 'articles');

function parseFK(md) {
  // ① focus_keyword（rank_math）字段
  let m = md.match(/focus_keyword[^\n]*?[`']([^`']+)[`']/i);
  if (m) return m[1].trim();
  // ② [1] 主关键词首个（带反引号）
  m = md.match(/\[1\][^\n]*?主关键词[^\n]*?[`']([^`']+)[`']/i);
  if (m) return m[1].trim();
  // ③ [1] 主关键词首个（无反引号，到 / 或 ， 止）
  m = md.match(/\[1\][^\n]*?主关键词[：:]\s*`?([^\n/,，]+)/i);
  if (m) return m[1].trim();
  return '';
}

function getPostId(slug) {
  // 数组参数 + GET，不经 shell
  const args = ['-s', '--proxy', PROXY, '-u', U + ':' + P,
    'https://' + SITE + '/wp-json/wp/v2/posts?slug=' + encodeURIComponent(slug) + '&status=any&_fields=id',
    '--max-time', '15'];
  const r = spawnSync('curl', args, { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout) return null;
  try { const a = JSON.parse(r.stdout); return a.length ? a[0].id : null; }
  catch (e) { return null; }
}

function setFK(id, fk) {
  // 数组参数 + stdin payload：完全绕开 shell 引号问题
  const payload = JSON.stringify({ objectType: 'post', objectID: String(id), meta: { rank_math_focus_keyword: fk } });
  const args = ['-s', '--proxy', PROXY, '-u', U + ':' + P,
    '-X', 'POST', '-H', 'Content-Type: application/json', '--data', '@-',
    '-w', '\n%{http_code}', '--max-time', '30',
    'https://' + SITE + '/wp-json/rankmath/v1/updateMeta'];
  const r = spawnSync('curl', args, { encoding: 'utf8', input: payload });
  if (r.status !== 0) throw new Error('curl exit ' + r.status + ' ' + (r.stderr || '').slice(0, 80));
  const out = (r.stdout || '').trim().split(/\n/);
  const code = out[out.length - 1].trim();
  if (code !== '200') throw new Error('HTTP ' + code + ' body=' + out.slice(0, -1).join('').slice(0, 120));
  return code;
}

const mdFiles = fs.readdirSync(ART).filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('README'));
let ok = 0, skip = 0, fail = 0, noFK = 0;
const failList = [];
for (const f of mdFiles) {
  const fileSlug = f.replace(/\.md$/, '');
  const postSlug = fileSlug.replace(/-combination$/, '');
  const md = fs.readFileSync(path.join(ART, f), 'utf8');
  let fk = parseFK(md);
  // 配对 fallback：无 fk 且文件名含 -and-（配对文章），从文件名推导
  if (!fk && fileSlug.includes('-and-')) {
    fk = fileSlug.replace(/-combination$/, '').replace(/-/g, ' ') + ' tarot';
  }
  if (!fk) { noFK++; if (noFK <= 5) console.log('⚠ 无fk: ' + fileSlug); continue; }
  const id = getPostId(postSlug);
  if (!id) { skip++; if (skip <= 5) console.log('⊘ 无post: ' + postSlug); continue; }
  try {
    setFK(id, fk);
    ok++;
    if (ok % 25 === 0) console.log('✅ ' + ok + ' 篇 fk 补齐 (' + postSlug + '="' + fk + '")');
  } catch (e) {
    fail++;
    failList.push(postSlug + ': ' + e.message.slice(0, 80));
    if (fail <= 10) console.log('❌ ' + postSlug + ': ' + e.message.slice(0, 100));
  }
}
console.log('\n=== fk补完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 无post, ' + noFK + ' 无fk ===');
if (failList.length) console.log('失败明细:\n' + failList.join('\n'));
