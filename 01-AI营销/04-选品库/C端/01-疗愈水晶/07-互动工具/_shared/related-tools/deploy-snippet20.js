/**
 * 部署 snippet 20 (Customize Bracelet CTA) 到线上 Code Snippets
 * 先 GET list 查重(避双 active), 存在则更新 code, 不存在则创建.
 * 用法：node deploy-snippet20.js   需 socks5 + disableSandbox
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
const NAME = 'Earthward Customize Bracelet CTA';

const code = fs.readFileSync(path.resolve(__dirname, 'snippet20_customize.php'), 'utf8');

// 1. GET list 查重
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/code-snippets/v1/snippets?_fields=id,name,active" --max-time 30', { encoding: 'utf8' });
const list = JSON.parse(r);
const existing = list.find(s => /customize.?bracelet|ew_customize_bracelet/i.test(s.name || ''));
const tmp = path.join(__dirname, '_tmp-snip20.json');

if (existing) {
  console.log('找到已存在 snippet:', existing.id, '"' + existing.name + '" active=' + existing.active + ' → 更新 code');
  // GET full 保留 name/scopes
  const full = JSON.parse(execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' "https://' + SITE + '/wp-json/code-snippets/v1/snippets/' + existing.id + '" --max-time 30', { encoding: 'utf8' }));
  const update = { id: existing.id, name: full.name || NAME, code, active: true, scopes: full.scopes || 'front-end' };
  fs.writeFileSync(tmp, JSON.stringify(update), 'utf8');
  const rr = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/code-snippets/v1/snippets/' + existing.id + '?_fields=id,active,name" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  const res = JSON.parse(rr);
  console.log('✅ snippet ' + res.id + ' 更新成功 (active=' + res.active + ', name="' + res.name + '")');
} else {
  console.log('未找到 customize-bracelet snippet → 创建新的. 现有 snippets:', list.map(s => s.id + ':' + s.name).join(' | '));
  const create = { name: NAME, code, active: true, scopes: 'front-end' };
  fs.writeFileSync(tmp, JSON.stringify(create), 'utf8');
  const rr = execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + UA + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/code-snippets/v1/snippets?_fields=id,active,name" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  const res = JSON.parse(rr);
  if (res.id) console.log('✅ snippet 创建成功 id=' + res.id + ' (active=' + res.active + ', name="' + res.name + '")');
  else console.log('⚠️ 创建返回:', rr.slice(0, 300));
}
