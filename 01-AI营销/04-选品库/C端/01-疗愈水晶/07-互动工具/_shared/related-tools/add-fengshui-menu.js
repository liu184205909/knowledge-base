/**
 * 加 3 风水工具到 menu 66 (mobile, 顶级) + menu 65 (desktop, Tools 43248 sub backup)
 * 用法：node add-fengshui-menu.js   需 socks5 + disableSandbox
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

const TOOLS = [
  { title: 'Kua Number Calculator', id: 55939 },
  { title: 'Feng Shui Bagua Map', id: 55940 },
  { title: 'Wealth Corner Finder', id: 55943 }
];

function addMenuItem(menuId, parentId, t) {
  const data = { menus: menuId, status: 'publish', title: t.title, type: 'post_type', object: 'page', object_id: t.id };
  if (parentId) data.menu_item_parent = String(parentId);
  const tmp = path.join(__dirname, '_tmp-mi.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/menu-items?_fields=id,title,url,menu_item_parent" --max-time 30', { encoding: 'utf8' });
    fs.unlinkSync(tmp);
    const j = JSON.parse(r);
    return j.id ? '✅ ' + j.id + ' ' + (j.title && j.title.rendered) : '✗ ' + r.slice(0, 100);
  } catch (e) { try { fs.unlinkSync(tmp); } catch (e2) {} return '✗ ' + e.message.slice(0, 80); }
}

console.log('=== mobile menu 66（顶级）===');
for (const t of TOOLS) console.log(addMenuItem(66, 0, t));
console.log('\n=== desktop menu 65（Tools 43248 sub, backup）===');
for (const t of TOOLS) console.log(addMenuItem(65, 43248, t));
