/**
 * 上传 Crystal Checker + Zodiac Checker HTML 到 WordPress pages
 *
 * Crystal Checker → page 43180 (crystal-compatibility-checker)
 * Zodiac Checker → 搜索 "zodiac" 相关 page
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

// 读取 WP 凭证
const envPath = path.join(os.homedir(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const WP_SITE = envContent.match(/WP_SITE=(.+)/)?.[1]?.trim() || 'goearthward.com';
const WP_USER = envContent.match(/WP_USER=(.+)/)?.[1]?.trim();
const WP_PASS = envContent.match(/WP_APP_PASSWORD=(.+)/)?.[1]?.trim();

const AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64');

function wpRequest(apiPath, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: WP_SITE,
      path: apiPath,
      method: method || 'GET',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json',
      },
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); }
        catch(e) { resolve({ raw: chunks, statusCode: res.statusCode }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // 1. 搜索 Zodiac Checker page
  console.log('=== 搜索 Zodiac Checker page ===');
  const pages = await wpRequest('/wp-json/wp/v2/pages?search=zodiac&per_page=10', 'GET');
  if (Array.isArray(pages)) {
    pages.forEach(p => console.log(`  [${p.id}] ${p.title?.rendered} — ${p.slug} — ${p.link}`));
  }

  // 2. 上传 Crystal Checker 到 page 43180
  console.log('\n=== 上传 Crystal Checker → page 43180 ===');
  const crystalHtml = fs.readFileSync(
    path.resolve(__dirname, '../../07-互动工具/crystal-compatibility-checker/build/crystal-checker.html'), 'utf8'
  );
  const crystalResult = await wpRequest('/wp-json/wp/v2/pages/43180', 'POST', {
    content: crystalHtml,
    title: { rendered: 'Crystal Compatibility Checker' },
  });
  if (crystalResult.id) {
    console.log(`✅ Crystal Checker 上传成功 → page ${crystalResult.id}`);
    console.log(`   Link: ${crystalResult.link}`);
  } else {
    console.log('❌ Crystal Checker 上传失败:', JSON.stringify(crystalResult).slice(0, 200));
  }

  // 3. 如果找到 Zodiac Checker page，上传
  const zodiacPage = Array.isArray(pages) ? pages.find(p => p.slug && p.slug.includes('zodiac') && p.slug.includes('compatibility')) : null;
  if (zodiacPage) {
    console.log(`\n=== 上传 Zodiac Checker → page ${zodiacPage.id} ===`);
    const zodiacHtml = fs.readFileSync(
      path.resolve(__dirname, '../../07-互动工具/zodiac-compatibility-checker/build/zodiac-checker.html'), 'utf8'
    );
    const zodiacResult = await wpRequest('/wp-json/wp/v2/pages/' + zodiacPage.id, 'POST', {
      content: zodiacHtml,
      title: { rendered: 'Zodiac Compatibility Checker' },
    });
    if (zodiacResult.id) {
      console.log(`✅ Zodiac Checker 上传成功 → page ${zodiacResult.id}`);
      console.log(`   Link: ${zodiacResult.link}`);
    } else {
      console.log('❌ Zodiac Checker 上传失败:', JSON.stringify(zodiacResult).slice(0, 200));
    }
  } else {
    console.log('\n⚠️  未找到 Zodiac Checker page。请提供 page ID。');
  }
}

main().catch(e => console.error('Error:', e.message));
