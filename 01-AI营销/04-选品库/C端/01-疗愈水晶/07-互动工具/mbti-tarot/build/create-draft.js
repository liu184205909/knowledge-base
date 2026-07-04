/**
 * MBTI Tarot draft page 创建（一次性脚本，status=draft，守 PRD"draft 不 publish"红线）
 * 不改共享 create-page.js（硬编码 publish，T17 教训"不改现有线上工具/共享脚本"）
 *
 * Usage: node create-draft.js
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const WP_USER = env.match(/WP_USER=(.+)/)[1].trim();
const WP_PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64');

const HTML = fs.readFileSync(path.resolve(__dirname, 'mbti-tarot.html'), 'utf8');
const content = '<!-- wp:html -->\n' + HTML + '\n<!-- /wp:html -->';

const payload = {
  title: 'MBTI Tarot',
  slug: 'mbti-tarot',
  status: 'draft',          // PRD 红线：draft 不 publish
  parent: 43101,            // tools hub
  content: content
};
const body = JSON.stringify(payload);

const req = https.request({
  hostname: SITE, path: '/wp-json/wp/v2/pages', method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 180000,
}, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    try {
      const r = JSON.parse(d);
      if (r.id) {
        console.log('✅ draft page 创建 id=' + r.id + ' | status=' + r.status + ' | link=' + r.link);
        const previewUrl = 'https://' + SITE + '/?page_id=' + r.id + '&preview=true';
        console.log('   preview URL: ' + previewUrl);
        console.log('   POST_ID=' + r.id + '（用于 update-draft.js / rankmath-tkd.js）');
      } else console.log('❌', r.message || JSON.stringify(r).slice(0, 400));
    } catch (e) { console.log('raw:', d.slice(0, 500)); }
  });
});
req.on('error', e => console.log('err:', e.message));
req.on('timeout', () => { console.log('timeout'); req.destroy(); });
req.write(body);
req.end();
