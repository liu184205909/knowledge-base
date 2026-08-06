/**
 * 通用更新 WP page content（已存在 page 的 content 更新，不建新页）
 * 复用：T1/R/未来工具部署后更新内容
 *
 * Usage: node update-page.js <pageId> <htmlPath>
 *   node update-page.js 44469 ./bracelet-size-calculator/build/bracelet-size-calculator.html
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const id = process.argv[2];
const htmlPath = process.argv[3];
if (!id || !htmlPath) { console.error('Usage: node update-page.js <pageId> <htmlPath>'); process.exit(1); }

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

const HTML = fs.readFileSync(path.resolve(htmlPath), 'utf8');
const content = '<!-- wp:html -->\n' + HTML + '\n<!-- /wp:html -->';
const body = JSON.stringify({ content });

const req = https.request({
  hostname: SITE, path: '/wp-json/wp/v2/pages/' + id, method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 120000,
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    try {
      const r = JSON.parse(d);
      if (r.id) console.log('✅ page', r.id, '更新 | content:', (r.content.raw || '').length, '字节 | link:', r.link);
      else console.log('❌', r.message || JSON.stringify(r).slice(0, 300));
    } catch (e) { console.log('raw:', d.slice(0, 400)); }
  });
});
req.on('error', e => console.log('err:', e.message));
req.on('timeout', () => { console.log('timeout'); req.destroy(); });
req.write(body);
req.end();
