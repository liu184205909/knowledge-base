// Update existing mbti-tarot page (PUT /wp-json/wp/v2/pages/51694)
// 2026-07-04 修 INFJ 中文 reason + hover sticky + Shop CTA 死链，按用户指令保持 status=publish（线上已是 publish）
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const WP_USER = env.match(/WP_USER=(.+)/)[1].trim();
const WP_PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64');

const POST_ID = 51694;
const HTML = fs.readFileSync(path.resolve(__dirname, 'mbti-tarot.html'), 'utf8');
const content = '<!-- wp:html -->\n' + HTML + '\n<!-- /wp:html -->';

const body = JSON.stringify({ content: content, status: 'publish' });

const req = https.request({
  hostname: SITE, path: '/wp-json/wp/v2/pages/' + POST_ID, method: 'PUT',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'User-Agent': 'curl/8.0.0' },
  timeout: 180000,
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    try {
      const r = JSON.parse(d);
      if (r.id) {
        console.log('OK updated id=' + r.id + ' | status=' + r.status + ' | slug=' + r.slug + ' | link=' + r.link);
        console.log('   preview: https://' + SITE + '/?page_id=' + r.id + '&preview=true');
      } else console.log('ERR', r.message || JSON.stringify(r).slice(0, 400));
    } catch (e) { console.log('raw:', d.slice(0, 500)); }
  });
});
req.on('error', e => console.log('err:', e.message));
req.on('timeout', () => { console.log('timeout'); req.destroy(); });
req.write(body);
req.end();
