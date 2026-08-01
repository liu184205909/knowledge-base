/**
 * 将 horoscope 分类（1561）下的月运 draft 文章定时发布
 * 每天 4 篇，随机时间（6:00-22:00），从明天开始
 *
 * Usage: node schedule-monthly-horoscope.js
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

async function main() {
  console.log('获取 category 1561 (horoscope) 的 draft posts...');
  // WordPress per_page 上限 100，分两页获取
  const page1 = await wpGet('/wp-json/wp/v2/posts?categories=1561&status=draft,future,publish&per_page=100&page=1&orderby=slug&order=asc');
  const page2 = await wpGet('/wp-json/wp/v2/posts?categories=1561&status=draft,future,publish&per_page=100&page=2&orderby=slug&order=asc');
  const all = Array.isArray(page1) ? page1.concat(Array.isArray(page2) ? page2 : []) : [];
  // 月运 slug 格式：{sign}-{month}-2026（三段），年运：{sign}-2026（两段）
  const drafts = all.filter(p => p.status === 'draft' && p.slug.split('-').length >= 3);
  console.log(`找到 ${drafts.length} 篇月运 draft 文章（排除年运）`);

  if (drafts.length === 0) {
    console.log('没有月运 draft 文章需要调度');
    return;
  }

  // 按 slug 排序
  drafts.sort((a, b) => a.slug.localeCompare(b.slug));

  // 每天 4 篇，从明天开始
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(0, 0, 0, 0);

  // 4 个时间段，避免太集中
  const slots = [
    { hMin: 6, hMax: 10 },   // 早间 6-10
    { hMin: 11, hMax: 14 },  // 午间 11-14
    { hMin: 15, hMax: 18 },  // 下午 15-18
    { hMin: 19, hMax: 22 },  // 晚间 19-22
  ];

  let scheduled = 0, failed = 0;

  for (let i = 0; i < drafts.length; i++) {
    const post = drafts[i];
    const dayOffset = Math.floor(i / 4);  // 每 4 篇一天
    const slotIdx = i % 4;                // 当天第几个时间段
    const slot = slots[slotIdx];

    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    const hour = slot.hMin + Math.floor(Math.random() * (slot.hMax - slot.hMin + 1));
    const minute = Math.floor(Math.random() * 60);
    date.setHours(hour, minute, 0);
    const isoDate = date.toISOString();

    try {
      const result = await wpPost('/wp-json/wp/v2/posts/' + post.id, {
        status: 'future',
        date: isoDate,
      });
      if (result.id) {
        if (scheduled < 10 || (scheduled + 1) % 12 === 0) {
          // 前 10 篇详细输出，之后每 12 篇输出一次
          console.log(`✓ [${scheduled+1}/${drafts.length}] ${post.slug} -> ${isoDate.slice(0, 16)}`);
        } else if (scheduled === 10) {
          console.log(`... （后续省略详细输出，每 12 篇报告一次）`);
        }
        scheduled++;
      } else {
        console.log(`✗ ${post.slug}: ${JSON.stringify(result).slice(0, 200)}`);
        failed++;
      }
    } catch (e) {
      console.log(`✗ ${post.slug}: ${e.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 400)); // 小延迟避免速率限制
  }

  const totalDays = Math.ceil(drafts.length / 4);
  console.log(`\n=== 完成 ===`);
  console.log(`调度: ${scheduled} | 失败: ${failed}`);
  console.log(`节奏: 每天 4 篇 × ${totalDays} 天`);
  console.log(`起止: ${startDate.toISOString().slice(0,10)} ~ ${new Date(startDate.getTime() + (totalDays-1)*86400000).toISOString().slice(0,10)}`);
}

main().catch(e => console.error(e));
