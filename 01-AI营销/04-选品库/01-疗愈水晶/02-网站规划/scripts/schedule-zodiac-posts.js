/**
 * 将 78 篇 zodiac-compatibility 文章从 draft 改为 schedule
 * 每天 2 篇，随机时间（8:00-20:00），从明天开始
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

function wpGet(apiPath) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: SITE, path: apiPath, headers: { Authorization: AUTH } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

function wpPost(apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: SITE, path: apiPath, method: 'POST',
      headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout: 30000,
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function randomTime() {
  // 8:00 - 20:00 之间的随机时间
  const hour = 8 + Math.floor(Math.random() * 12);
  const minute = Math.floor(Math.random() * 60);
  return { hour, minute };
}

async function main() {
  // 1. 获取所有 zodiac-compatibility draft posts
  console.log('获取 category 1560 的 draft posts...');
  const posts = await wpGet('/wp-json/wp/v2/posts?categories=1560&status=draft,future,publish&per_page=100&orderby=slug&order=asc');
  const drafts = posts.filter(p => p.status === 'draft');

  console.log(`找到 ${drafts.length} 篇 draft 文章`);

  if (drafts.length === 0) {
    console.log('没有 draft 文章需要调度');
    return;
  }

  // 2. 按 slug 排序
  drafts.sort((a, b) => a.slug.localeCompare(b.slug));

  // 3. 分配日期：每天 2 篇，从明天开始
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // 明天
  startDate.setHours(0, 0, 0, 0);

  let scheduled = 0, failed = 0;

  for (let i = 0; i < drafts.length; i++) {
    const post = drafts[i];
    const dayOffset = Math.floor(i / 2); // 每 2 篇一天
    const slotInDay = i % 2; // 0 = 第一篇, 1 = 第二篇

    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);

    // 随机时间：第一篇 8:00-13:00，第二篇 14:00-20:00（避免太接近）
    let hour, minute;
    if (slotInDay === 0) {
      hour = 8 + Math.floor(Math.random() * 5); // 8-12
      minute = Math.floor(Math.random() * 60);
    } else {
      hour = 14 + Math.floor(Math.random() * 6); // 14-19
      minute = Math.floor(Math.random() * 60);
    }

    date.setHours(hour, minute, 0);

    const dateStr = date.toISOString().replace(/\.\d+Z$/, '');

    console.log(`[${i + 1}/${drafts.length}] ${post.slug} → ${dateStr.slice(0, 16)} ...`);

    try {
      const result = await wpPost('/wp-json/wp/v2/posts/' + post.id, {
        status: 'future',
        date: dateStr,
      });

      if (result.id) {
        scheduled++;
        console.log(`  ✅ scheduled (ID: ${result.id})`);
      } else {
        failed++;
        console.log(`  ❌ ${JSON.stringify(result).slice(0, 100)}`);
      }
    } catch (e) {
      failed++;
      console.log(`  ❌ ${e.message}`);
    }

    // 间隔 500ms 避免速率限制
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Schedule 完成 ===`);
  console.log(`成功: ${scheduled}/${drafts.length}`);
  console.log(`失败: ${failed}`);
  console.log(`发布周期: ${drafts.length} 篇 ÷ 2 篇/天 = ${Math.ceil(drafts.length / 2)} 天`);
}

main().catch(e => console.error(e.message));
