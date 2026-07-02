/**
 * fk 补：场景+配对文章 rank_math_focus_keyword 空，从 Brief 提取 → setRankMath
 * 提取优先级：① focus_keyword（rank_math）字段 ② [1] 主关键词首个
 * 用法：node fix-fk.js   需 socks5 + ~/.env
 */
const fs = require('fs'), path = require('path'), os = require('os'), { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
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
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    const a = JSON.parse(r); return a.length ? a[0].id : null;
  } catch (e) { return null; }
}
function setFK(id, fk) {
  const tmp = path.join(__dirname, '_tmp-fk.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta: { rank_math_focus_keyword: fk } }), 'utf8');
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
}

const mdFiles = fs.readdirSync(ART).filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('README'));
let ok = 0, skip = 0, fail = 0, noFK = 0;
for (const f of mdFiles) {
  const fileSlug = f.replace(/\.md$/, '');
  const postSlug = fileSlug.replace(/-combination$/, '');
  const md = fs.readFileSync(path.join(ART, f), 'utf8');
  let fk = parseFK(md);
  // 配对 fallback：无 fk 且是配对文章(-and-)，从文件名推导（strength-and-the-devil → "strength and the devil tarot"）
  if (!fk && fileSlug.includes('-and-')) {
    fk = fileSlug.replace(/-combination$/, '').replace(/-/g, ' ') + ' tarot';
  }
  if (!fk) { noFK++; console.log('⚠ 无fk: ' + fileSlug); continue; }
  const id = getPostId(postSlug);
  if (!id) { skip++; continue; }
  try { setFK(id, fk); ok++; if (ok % 20 === 0) console.log('✅ ' + ok + ' 篇 fk 补齐 (' + postSlug + '="' + fk + '")'); }
  catch (e) { fail++; console.log('❌ ' + postSlug + ': ' + e.message.slice(0, 100)); }
}
console.log('\n=== fk补完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 无post, ' + noFK + ' 无fk ===');
