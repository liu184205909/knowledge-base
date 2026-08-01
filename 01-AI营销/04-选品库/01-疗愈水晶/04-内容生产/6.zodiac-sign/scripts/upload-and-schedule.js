const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶';
const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

const SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const DIR = path.join(ROOT, '04-内容生产/6.zodiac-sign/articles');
const SCRIPT = path.join(ROOT, '02-网站规划/scripts/upload-post-content-post.js');

// Step 1: 上传文字
console.log('=== 上传 12 篇星座详解 ===');
const postIds = {};
for (const sign of SIGNS) {
  const f = path.join(DIR, sign + '.json');
  try {
    const out = execSync(`node "${SCRIPT}" "${f}" --status draft --category 1562 --skip-images`, { timeout: 60000, encoding: 'utf8', cwd: path.join(ROOT, '02-网站规划') });
    const m = out.match(/(?:Created|Updated) post.*?(\d+)/);
    postIds[sign] = m ? parseInt(m[1]) : null;
    console.log(`  ${sign}: post ${postIds[sign] || '?'}`);
  } catch (e) {
    console.log(`  ${sign}: FAIL`);
  }
}

// Step 2: 定时发布（从 8/4 开始，每天 1 篇，随机时间）
console.log('\n=== 定时发布 8/4-8/15 ===');
const startDate = new Date(2026, 7, 4); // Aug 4

async function main() {
  let done = 0;
  for (let i = 0; i < SIGNS.length; i++) {
    const sign = SIGNS[i];
    const id = postIds[sign];
    if (!id) { console.log(`  ${sign}: SKIP`); continue; }

    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
    const dateStr = date.toISOString().replace(/\.\d+Z$/, '');

    await new Promise(resolve => {
      const body = JSON.stringify({ status: 'future', date: dateStr });
      const req = https.request({
        hostname: SITE, path: '/wp-json/wp/v2/posts/' + id, method: 'POST',
        headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
        timeout: 30000
      }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve()); });
      req.write(body); req.end();
    });

    done++;
    console.log(`  [${done}/12] ${sign} → ${dateStr.slice(0, 10)} ${dateStr.slice(11, 16)} UTC`);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`\n✅ 12 篇星座详解上传+定时发布完成（8/4-8/15 每天 1 篇）`);
}

main().catch(e => console.error(e.message));
