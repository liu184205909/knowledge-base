/**
 * 修复上传：用 <!-- wp:html --> 块标记包裹，防止 wpautop 破坏 HTML/JS
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const USER = env.match(/WP_USER=(.+)/)[1].trim();
const PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');

function wpUpdate(pageId, content) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ content });
    const req = https.request({
      hostname: SITE,
      path: '/wp-json/wp/v2/pages/' + pageId,
      method: 'POST',
      headers: { 'Authorization': AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({ raw: d }); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // 1. Crystal Checker → page 43180
  const crystalHtml = fs.readFileSync(path.resolve(__dirname, '../../07-互动工具/crystal-compatibility-checker/build/crystal-checker.html'), 'utf8');
  // 用 <!-- wp:html --> 块标记包裹，防止 wpautop
  const crystalWrapped = `<!-- wp:html -->\n${crystalHtml}\n<!-- /wp:html -->`;
  console.log('=== 上传 Crystal Checker (wp:html 包裹) → page 43180 ===');
  const r1 = await wpUpdate(43180, crystalWrapped);
  console.log(r1.id ? `✅ 成功 → ${r1.link}` : `❌ 失败: ${JSON.stringify(r1).slice(0, 200)}`);

  // 2. Zodiac Checker → page 43246
  const zodiacHtml = fs.readFileSync(path.resolve(__dirname, '../../07-互动工具/zodiac-compatibility-checker/build/zodiac-checker.html'), 'utf8');
  const zodiacWrapped = `<!-- wp:html -->\n${zodiacHtml}\n<!-- /wp:html -->`;
  console.log('\n=== 上传 Zodiac Checker (wp:html 包裹) → page 43246 ===');
  const r2 = await wpUpdate(43246, zodiacWrapped);
  console.log(r2.id ? `✅ 成功 → ${r2.link}` : `❌ 失败: ${JSON.stringify(r2).slice(0, 200)}`);

  // 3. 验证 Crystal Checker
  console.log('\n=== 验证 page 43180 ===');
  const verify = await new Promise((resolve, reject) => {
    https.get({ hostname: SITE, path: '/wp-json/wp/v2/pages/43180', headers: { Authorization: AUTH } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    });
  });
  const c = verify.content?.rendered || '';
  console.log('Has wp:html:', c.includes('wp:html'));
  console.log('Has <p> in HTML area:', (c.match(/<p>/g) || []).length, '(should be minimal)');
  console.log('Has EWCrystal:', c.includes('EWCrystal'));
  console.log('Has toggle:', c.includes('function toggle'));
}

main().catch(e => console.error('Error:', e.message));
