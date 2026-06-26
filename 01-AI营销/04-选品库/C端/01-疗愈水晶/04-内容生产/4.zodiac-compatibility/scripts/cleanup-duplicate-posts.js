/**
 * 清理重复 post：
 * 1. 查询所有 zodiac-compatibility posts（draft/future/publish）
 * 2. 找出同 slug 的重复 post
 * 3. 把 draft post 的 featured_media 迁移到 future post
 * 4. 删除 draft post
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(env.match(/WP_USER=(.+)/)[1].trim() + ':' + env.match(/WP_APP_PASSWORD=(.+)/)[1].trim()).toString('base64');

function wpGet(p) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: SITE, path: p, headers: { Authorization: AUTH } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

function wpPost(p, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({ hostname: SITE, path: p, method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }, timeout: 30000 }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({}); } });
    });
    req.on('error', reject); req.write(data); req.end();
  });
}

function wpDelete(p) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: SITE, path: p + '?force=true', method: 'DELETE', headers: { Authorization: AUTH }, timeout: 30000 }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({}); } });
    });
    req.on('error', reject); req.end();
  });
}

async function main() {
  console.log('=== 查询所有 zodiac-compatibility posts ===');
  const posts = await wpGet('/wp-json/wp/v2/posts?categories=1560&status=draft,publish,future&per_page=100&orderby=slug&order=asc');
  console.log('总 post 数:', posts.length);

  // 按 slug 分组
  const bySlug = {};
  for (const p of posts) {
    const key = p.slug;
    if (!bySlug[key]) bySlug[key] = [];
    bySlug[key].push({ id: p.id, status: p.status, featured: p.featured_media, slug: p.slug });
  }

  // 找重复
  const duplicates = [];
  for (const [slug, list] of Object.entries(bySlug)) {
    if (list.length > 1) {
      const future = list.find(p => p.status === 'future');
      const draft = list.find(p => p.status === 'draft');
      if (future && draft) {
        duplicates.push({ slug, future, draft });
      }
    }
  }

  console.log('重复 slug:', duplicates.length, '个\n');

  if (duplicates.length === 0) {
    console.log('✅ 没有重复 post');
    return;
  }

  // 逐个处理
  let migrated = 0, deleted = 0, failed = 0;
  for (const dup of duplicates) {
    console.log(`[${deleted + failed + 1}/${duplicates.length}] ${dup.slug}: future=${dup.future.id}(img:${dup.future.featured}) draft=${dup.draft.id}(img:${dup.draft.featured})`);

    // 如果 future 没有 featured_media 但 draft 有，迁移
    if (dup.future.featured === 0 && dup.draft.featured > 0) {
      console.log(`  → 迁移 featured_media ${dup.draft.featured} → future post ${dup.future.id}`);
      const result = await wpPost('/wp-json/wp/v2/posts/' + dup.future.id, { featured_media: dup.draft.featured });
      if (result.id) { migrated++; }
    }

    // 删除 draft post
    console.log(`  → 删除 draft post ${dup.draft.id}`);
    const delResult = await wpDelete('/wp-json/wp/v2/posts/' + dup.draft.id);
    if (delResult.deleted || delResult.id) {
      deleted++;
    } else {
      failed++;
      console.log(`  ❌ 删除失败: ${JSON.stringify(delResult).slice(0, 100)}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== 清理完成 ===`);
  console.log(`图片迁移: ${migrated} 篇`);
  console.log(`删除 draft: ${deleted} 篇`);
  console.log(`失败: ${failed} 篇`);
}

main().catch(e => console.error(e.message));
