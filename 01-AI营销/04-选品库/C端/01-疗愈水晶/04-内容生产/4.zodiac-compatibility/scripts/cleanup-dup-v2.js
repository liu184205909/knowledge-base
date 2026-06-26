/**
 * 清理 -2 后缀的重复 draft post：
 * 1. 分页查询所有 zodiac-compatibility posts
 * 2. 找 slug 以 -2 结尾的 draft post
 * 3. 把 featured_media 迁移到去掉 -2 的 future post
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
  // 1. 分页获取所有 post
  const allPosts = [];
  for (let page = 1; page <= 3; page++) {
    const posts = await wpGet(`/wp-json/wp/v2/posts?categories=1560&status=draft,publish,future&per_page=100&page=${page}&orderby=slug&order=asc`);
    if (!Array.isArray(posts) || posts.length === 0) break;
    allPosts.push(...posts);
  }
  console.log(`总 post 数: ${allPosts.length}`);

  // 2. 找 -2 后缀的 draft post + 对应的原 post
  const dupPosts = allPosts.filter(p => p.slug.endsWith('-2') && p.status === 'draft');
  console.log(`重复 draft post (-2): ${dupPosts.length} 个\n`);

  if (dupPosts.length === 0) {
    console.log('✅ 没有重复 post');
    return;
  }

  // 3. 建 slug → post 映射（原 post）
  const slugMap = {};
  for (const p of allPosts) {
    slugMap[p.slug] = p;
  }

  // 4. 逐个处理
  let migrated = 0, deleted = 0, failed = 0;
  for (const dup of dupPosts) {
    const originalSlug = dup.slug.replace(/-2$/, '');
    const original = slugMap[originalSlug];

    if (!original) {
      console.log(`⚠️ ${dup.slug}: 找不到原 post ${originalSlug}`);
      // 如果找不到原 post，说明 -2 post 可能就是唯一的 — 重命名 slug
      const result = await wpPost('/wp-json/wp/v2/posts/' + dup.id, { slug: originalSlug });
      console.log(`  → 重命名为 ${originalSlug}: ${result.id ? '✅' : '❌'}`);
      continue;
    }

    console.log(`[${deleted + failed + 1}/${dupPosts.length}] ${dup.slug} → original ${original.slug} (ID:${original.id})`);

    // 迁移 featured_media
    if (dup.featured_media > 0 && original.featured_media === 0) {
      console.log(`  → 迁移 featured_media ${dup.featured_media}`);
      const r = await wpPost('/wp-json/wp/v2/posts/' + original.id, { featured_media: dup.featured_media });
      if (r.id) { migrated++; }
    }

    // 删除 draft post
    const del = await wpDelete('/wp-json/wp/v2/posts/' + dup.id);
    if (del.deleted || del.id) {
      deleted++;
      console.log(`  → 已删除 ${dup.id}`);
    } else {
      failed++;
      console.log(`  → ❌ 删除失败`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== 清理完成 ===`);
  console.log(`图片迁移: ${migrated}`);
  console.log(`删除 post: ${deleted}`);
  console.log(`失败: ${failed}`);
}

main().catch(e => console.error(e.message));
