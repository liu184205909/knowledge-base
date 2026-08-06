/**
 * 部署 Bagua Map 到 WP（page draft, parent=43101 /tools/, TKD）
 * 用法：node deploy-bagua.js   需 socks5 + disableSandbox
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

const html = fs.readFileSync(path.join(__dirname, 'bagua-map.html'), 'utf8');
const content = '<!-- wp:html -->\n' + html + '\n<!-- /wp:html -->';
const data = {
  title: 'Feng Shui Bagua Map: Interactive 9 Areas & Crystals',
  slug: 'bagua-map',
  parent: 43101,
  status: 'draft',
  content
};
const tmp = path.join(__dirname, '_tmp-page.json');
fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/pages?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
fs.unlinkSync(tmp);
const pg = JSON.parse(r);
if (!pg.id) { console.error('✗ 创建失败:', r.slice(0, 200)); process.exit(1); }
console.log('✅ page:', pg.id, pg.link, '(' + pg.status + ')');

const meta = {
  rank_math_title: 'Feng Shui Bagua Map: 9 Areas, Directions & Best Crystals',
  rank_math_description: 'Interactive feng shui bagua map. Click any of the 9 areas to see its element, colors, how to activate it, and the best crystals — BTB front-door alignment, free tool.',
  rank_math_focus_keyword: 'feng shui bagua map'
};
const tm = path.join(__dirname, '_tmp-rm.json');
fs.writeFileSync(tm, JSON.stringify({ objectType: 'post', objectID: String(pg.id), meta }), 'utf8');
execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tm + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
fs.unlinkSync(tm);
console.log('✅ TKD set');
