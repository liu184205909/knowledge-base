/**
 * 更新线上 Code Snippet 19 (related tools Keep exploring) 的 code
 * 读 snippet19_local.php → GET snippet → POST 更新 code
 * 用法：node update-snippet19.js   需 socks5 + disableSandbox
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

const code = fs.readFileSync(path.resolve(__dirname, 'snippet19_local.php'), 'utf8');

// GET snippets list 找 related tools snippet
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/code-snippets/v1/snippets?_fields=id,name,active" --max-time 30', { encoding: 'utf8' });
const list = JSON.parse(r);
const snip = list.find(s => /related|keep.?explor|tools cross/i.test(s.name || ''));
if (!snip) { console.log('✗ 未找到 related-tools snippet。所有 snippets:', list.map(s => s.id + ':' + s.name).join(', ')); process.exit(1); }
console.log('找到 snippet:', snip.id, '"' + snip.name + '" active=' + snip.active);

// GET full snippet（保留 name/active/scopes，只换 code）
const full = JSON.parse(execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/code-snippets/v1/snippets/' + snip.id + '" --max-time 30', { encoding: 'utf8' }));
const update = { id: snip.id, name: full.name, code, active: full.active, scopes: full.scopes || 'front-end' };

const tmp = path.join(__dirname, '_tmp-snip.json');
fs.writeFileSync(tmp, JSON.stringify(update), 'utf8');
const rr = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/code-snippets/v1/snippets/' + snip.id + '?_fields=id,active" --max-time 60', { encoding: 'utf8' });
fs.unlinkSync(tmp);
const res = JSON.parse(rr);
if (res.id || res.active !== undefined) console.log('✅ snippet ' + snip.id + ' 更新成功 (active=' + res.active + ')');
else console.log('⚠️ 更新返回:', rr.slice(0, 200));
