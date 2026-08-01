/**
 * 检查 zodiac-compatibility 78篇 WP post 现状: id/status/featured_media/content是否已含img
 * 输出 JSON: {slug: {id,status,featured_media,has_img}}
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const ARTICLES_DIR = path.resolve(__dirname, '..', 'articles');

const slugs = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')).sort();
console.log('共 ' + slugs.length + ' 篇');

const result = {};
let done = 0;
for (const slug of slugs) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,slug,status,featured_media" --max-time 20', { encoding: 'utf8' });
    const arr = JSON.parse(r);
    if (!arr.length) {
      result[slug] = { exists: false };
      console.log('❓ ' + slug + ' (WP无post)');
    } else {
      const p = arr[0];
      result[slug] = { exists: true, id: p.id, status: p.status, featured_media: p.featured_media };
      const fm = p.featured_media ? '✓fm' : '✗fm';
      console.log('✅ ' + slug + ' → ' + p.id + ' [' + p.status + '] ' + fm);
    }
  } catch (e) {
    result[slug] = { error: e.message.slice(0, 80) };
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 80));
  }
  done++;
}
fs.writeFileSync(path.join(__dirname, '_post-status.json'), JSON.stringify(result, null, 2), 'utf8');
const ok = Object.values(result).filter(r => r.exists).length;
const noFm = Object.values(result).filter(r => r.exists && !r.featured_media).length;
const notExist = Object.values(result).filter(r => !r.exists).length;
console.log('\n=== 检查完成: WP存在 ' + ok + ', 缺featured ' + noFm + ', WP无post ' + notExist + ' ===');
console.log('状态写入 _post-status.json');
