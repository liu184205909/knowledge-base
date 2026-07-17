/**
 * Gift 线上验证（completion-requires-online-verification）
 * 查 crystal-gifts category 文章数(status=any) + 抽样 content（占位符残留/schema/img/字数/status）
 * 用法：node verify-online.js   需 disableSandbox（curl proxy）
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const l of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) { const t = l.trim(); if (!t || t.startsWith('#')) continue; const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim(); }
const AUTH = '-u "' + env.WP_USER + ':' + env.WP_APP_PASSWORD + '"', PROXY = '--proxy socks5://127.0.0.1:10808', SITE = env.WP_SITE || 'goearthward.com';
function head(p) { return execSync('curl -s ' + PROXY + ' ' + AUTH + ' -I "https://' + SITE + p + '" --max-time 30', { encoding: 'utf8' }); }
function get(p) { return execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + p + '" --max-time 30', { encoding: 'utf8' }); }

console.log('=== crystal-gifts category 文章数 (status=any) ===');
const h = head('/wp-json/wp/v2/posts?categories=1600&status=any&per_page=1');
const m = h.match(/x-wp-total:\s*(\d+)/i);
console.log(m ? '总数: ' + m[1] : '未取到 header');

console.log('\n=== status 分布 ===');
for (const st of ['publish', 'draft', 'future']) {
  const hs = head('/wp-json/wp/v2/posts?categories=1600&status=' + st + '&per_page=1');
  const ms = hs.match(/x-wp-total:\s*(\d+)/i);
  console.log(st + ': ' + (ms ? ms[1] : '0'));
}

console.log('\n=== 抽样内容验证（占位符/schema/img/字数）===');
const samples = ['crystal-anniversary-gifts', 'crystal-gifts-for-men', 'crystal-gifts-for-knitters', 'crystal-gifts-under-50', 'what-anniversary-is-crystal'];
for (const slug of samples) {
  try {
    const s = JSON.parse(get('/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,status,featured_media,content'));
    if (!s.length) { console.log(slug + ': ❌ 未找到'); continue; }
    const j = s[0]; const c = (j.content && j.content.rendered) || '';
    const ph = (c.match(/\{\{AI_/g) || []).length;
    const schema = (c.match(/application\/ld\+json/g) || []).length;
    const img = (c.match(/<img/g) || []).length;
    const words = c.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`${slug}: status=${j.status} featured=${j.featured_media ? '✓' : '✗'} 占位符=${ph} schema=${schema} img=${img} 字数=${words} ${ph === 0 && schema >= 3 ? '✅' : '⚠️'}`);
  } catch (e) { console.log(slug + ': ❌ ' + e.message.slice(0, 80)); }
}
