/**
 * 爬 30 颗 meaning 图 URL（WP REST status=any + 认证，含 future/draft）
 * 输出 stones-images.json（30 颗 overview/form_bracelet/how_to_use 等 URL，供配对文章图复用）
 * 用法：node scripts/crawl-stones-images.js（需 socks5 + disableSandbox + ~/.env WP 凭证）
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ~/.env WP 凭证
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const WP_USER = env.WP_USER, WP_PASS = env.WP_APP_PASSWORD;

const stones = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json'), 'utf8')).stones;
const slugs = Object.keys(stones);
const WANTED = ['hero', 'overview', 'properties', 'benefits', 'how-to-use', 'form-bracelet'];
const out = {};
let okCount = 0;

for (const s of slugs) {
  try {
    const r = execSync('curl -s --proxy socks5://127.0.0.1:10808 -u "' + WP_USER + ':' + WP_PASS + '" "https://goearthward.com/wp-json/wp/v2/gemstone?slug=' + s + '-meaning&status=any&context=edit&_fields=content" --max-time 25', { encoding: 'utf8' });
    const j = JSON.parse(r);
    const item = j[0];
    if (!item || !item.content) { out[s] = {}; console.log(s, '| 无content'); continue; }
    const c = (item.content.raw || item.content.rendered) || '';
    const imgs = [...new Set((c.match(/https:\/\/goearthward\.com\/wp-content\/uploads\/[^"' )]+\.webp/g) || []))].filter(u => !/\d+x\d+/.test(u));
    const orig = {};
    for (const u of imgs) {
      for (const k of WANTED) {
        const kk = k.replace(/-/g, '_');
        const re = new RegExp('/' + s + '-' + k.replace(/-/g, '[-_]') + '(-\\d+)?\\.webp$', 'i');
        if (re.test(u) && !orig[kk]) orig[kk] = u;
      }
    }
    out[s] = orig;
    if (orig.overview || orig.form_bracelet) okCount++;
    console.log(s, '|', Object.keys(orig).join(', ') || '(无)');
  } catch (e) { out[s] = {}; console.log(s, '| ERR', e.message.slice(0, 60)); }
}

fs.writeFileSync(path.resolve(__dirname, 'stones-images.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('\n=== stones-images.json: ' + Object.keys(out).length + ' 颗 | 有图: ' + okCount + ' ===');
