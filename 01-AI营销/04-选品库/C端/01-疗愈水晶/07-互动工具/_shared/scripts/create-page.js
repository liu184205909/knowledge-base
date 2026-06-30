/**
 * 通用建 WP page（首次创建，POST /pages，和 update-page.js 配对）
 * Usage: node create-page.js <title> <slug> <htmlPath> [parent]
 *   node create-page.js "Chakra Test" chakra-test ./chakra-test/build/chakra-test.html
 *   node create-page.js "Yes/No Tarot" yes-no-tarot ./yes-no-tarot/build/yes-no-tarot.html 43101
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const title = process.argv[2];
const slug = process.argv[3];
const htmlPath = process.argv[4];
const parent = process.argv[5] ? parseInt(process.argv[5], 10) : 0;
if (!title || !slug || !htmlPath) { console.error('Usage: node create-page.js <title> <slug> <htmlPath> [parent]'); process.exit(1); }

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

const HTML = fs.readFileSync(path.resolve(htmlPath), 'utf8');
const content = '<!-- wp:html -->\n' + HTML + '\n<!-- /wp:html -->';
const payload = { title, slug, status: 'publish', content };
if (parent) payload.parent = parent;
const body = JSON.stringify(payload);

const req = https.request({
  hostname: SITE, path: '/wp-json/wp/v2/pages', method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 120000,
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    try {
      const r = JSON.parse(d);
      if (r.id) {
        console.log('✅ page 创建 id=' + r.id + ' | status=' + r.status + ' | link=' + r.link);
        console.log(/\/tools\//.test(r.link) ? '   /tools/ 下' : '   根级（后台改 parent=tools → /tools/' + slug + '/）');
      } else console.log('❌', r.message || JSON.stringify(r).slice(0, 300));
    } catch (e) { console.log('raw:', d.slice(0, 400)); }
  });
});
req.on('error', e => console.log('err:', e.message));
req.on('timeout', () => { console.log('timeout'); req.destroy(); });
req.write(body);
req.end();
