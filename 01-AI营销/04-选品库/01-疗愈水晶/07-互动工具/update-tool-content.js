/**
 * 更新工具 page content（page 已存在，update 非create）
 * 用法：node update-tool-content.js <page_id> <html_file>   需 socks5 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const id = process.argv[2], htmlFile = process.argv[3];
if (!id || !htmlFile) { console.error('用法: node update-tool-content.js <page_id> <html_file>'); process.exit(1); }
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808', UA = '-A "curl/8.0.0"';
const html = fs.readFileSync(path.resolve(htmlFile), 'utf8');
const content = '<!-- wp:html -->\n' + html + '\n<!-- /wp:html -->';
const tmp = path.resolve(htmlFile + '.tmp.json');
fs.writeFileSync(tmp, JSON.stringify({ content }), 'utf8');
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/pages/' + id + '?_fields=id,status,link,modified" --max-time 120', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
fs.unlinkSync(tmp);
const pg = JSON.parse(r);
if (pg.id) console.log('✅ page ' + pg.id + ' updated (' + pg.status + ') modified=' + pg.modified);
else console.log('✗ 失败:', r.slice(0, 200));
