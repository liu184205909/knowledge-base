/**
 * publish 风水 45 文章(category 1599 draft) + 3 工具 page(55939/55940/55943) draft→publish
 * 用法：node publish-all.js   需 socks5 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808', UA = '-A "curl/8.0.0"';

function publishPost(type, id) {
  const tmp = path.join(__dirname, '_tmp-pub.json');
  fs.writeFileSync(tmp, JSON.stringify({ status: 'publish' }), 'utf8');
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/' + type + '/' + id + '?_fields=id,status,link" --max-time 30', { encoding: 'utf8' });
    fs.unlinkSync(tmp);
    return true;
  } catch (e) { fs.unlinkSync(tmp, () => {}); return false; }
}

// 1. 文章
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/wp/v2/posts?categories=1599&status=draft&per_page=100&_fields=id,slug" --max-time 30', { encoding: 'utf8' });
const posts = JSON.parse(r);
console.log('=== publish 文章 ' + posts.length + ' 篇 (category 1599) ===');
let ok = 0, fail = 0;
for (const p of posts) {
  if (publishPost('posts', p.id)) { ok++; if (ok % 10 === 0) console.log('  ' + ok + ' 篇...'); }
  else { fail++; console.log('  ❌ ' + p.slug); }
}
console.log('文章 publish: ' + ok + ' OK, ' + fail + ' ERR');

// 2. 工具
const tools = [55939, 55940, 55943];
console.log('\n=== publish 工具 3 个 ===');
let tok = 0;
for (const id of tools) {
  if (publishPost('pages', id)) { tok++; console.log('  ✅ page ' + id); }
  else console.log('  ❌ page ' + id);
}
console.log('工具 publish: ' + tok + '/3');
