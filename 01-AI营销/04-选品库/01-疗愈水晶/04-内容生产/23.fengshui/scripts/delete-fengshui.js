/**
 * 删除 feng-shui category(1599) 全 post（force）— 用于重 upload 覆盖前清旧
 * 用法：node delete-fengshui.js   需 socks5 + disableSandbox
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

const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/wp/v2/posts?categories=1599&status=any&per_page=100&_fields=id,slug" --max-time 30', { encoding: 'utf8' });
const posts = JSON.parse(r);
console.log('feng-shui(1599) 共 ' + posts.length + ' 篇，开始删除...');
let del = 0;
for (const p of posts) {
  try {
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X DELETE "https://' + SITE + '/wp-json/wp/v2/posts/' + p.id + '?force=true" --max-time 30', { encoding: 'utf8' });
    console.log('🗑 ' + p.slug + ' (' + p.id + ')');
    del++;
  } catch (e) { console.log('✗ ' + p.slug + ': ' + e.message.slice(0, 60)); }
}
console.log('\n=== 删除 ' + del + '/' + posts.length + ' 篇 ===');
