/**
 * Upload Dream WP draft payloads.
 *
 * Default mode is dry-run and makes no WordPress calls.
 * Use --execute to create real draft posts. Add --sync-existing to update
 * existing drafts from the rebuilt payload without changing publish status.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const DREAMS_DIR = path.resolve(__dirname, '..');
const PACKAGE_DIR = path.join(DREAMS_DIR, 'wp-draft-package');
const POSTS_DIR = path.join(PACKAGE_DIR, 'posts');
const MANIFEST_PATH = path.join(PACKAGE_DIR, 'manifest.json');
const RESULTS_PATH = path.join(PACKAGE_DIR, 'upload-results.jsonl');

function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    if (['WP_SITE', 'WP_USER', 'WP_APP_PASSWORD'].includes(key)) {
      process.env[key] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const SITE = (process.env.WP_SITE || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const USER = process.env.WP_USER;
const PASS = process.env.WP_APP_PASSWORD;
const AUTH = USER && PASS ? 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64') : '';

const args = process.argv.slice(2);
const EXECUTE = args.includes('--execute');
const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1];
const offsetArg = args.find((a) => a.startsWith('--offset='))?.split('=')[1];
const LIMIT = limitArg ? Number(limitArg) : Infinity;
const OFFSET = offsetArg ? Number(offsetArg) : 0;
const skipImages = args.includes('--skip-images');
const syncExisting = args.includes('--sync-existing');
const verifySyncSince = args.find((a) => a.startsWith('--verify-active-sync='))?.split('=')[1];
const verifyLiveSlugs = args.find((a) => a.startsWith('--verify-live-slugs='))?.split('=')[1];
const repairOnly = args.includes('--repair-only');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function appendResult(row) {
  fs.appendFileSync(RESULTS_PATH, JSON.stringify(row) + '\n', 'utf8');
}

function readResultObjects() {
  if (!fs.existsSync(RESULTS_PATH)) return [];
  const text = fs.readFileSync(RESULTS_PATH, 'utf8');
  const rows = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === '{') {
      if (depth === 0) start = index;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && start >= 0) rows.push(JSON.parse(text.slice(start, index + 1)));
    }
  }
  return rows;
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  throw new Error('Unsupported media type: ' + file);
}

function apiRequest(apiPath, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body
      ? Buffer.isBuffer(body)
        ? body
        : Buffer.from(JSON.stringify(body))
      : Buffer.alloc(0);
    const req = https.request({
      hostname: SITE,
      port: 443,
      path: apiPath,
      method,
      headers: Object.assign({
        Authorization: AUTH,
        'Content-Length': payload.length,
      }, Buffer.isBuffer(body) ? {} : { 'Content-Type': 'application/json' }, headers),
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = { raw: data }; }
        if (res.statusCode >= 400) {
          const err = new Error(`HTTP ${res.statusCode} ${method} ${apiPath}: ${data.slice(0, 300)}`);
          err.response = parsed;
          reject(err);
          return;
        }
        resolve(parsed);
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => req.destroy(new Error('timeout')));
    if (payload.length) req.write(payload);
    req.end();
  });
}

async function checkAuth() {
  const me = await apiRequest('/wp-json/wp/v2/users/me?_fields=id,name,slug', 'GET');
  if (!me.id) throw new Error('WP auth check returned no user id.');
  return me;
}

async function ensureCategory(slug, name) {
  const found = await apiRequest(`/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}&_fields=id,slug,name`, 'GET');
  if (Array.isArray(found) && found.length) return found[0].id;
  const created = await apiRequest('/wp-json/wp/v2/categories?_fields=id,slug,name', 'POST', { slug, name });
  if (!created.id) throw new Error('Category create returned no id.');
  return created.id;
}

async function existingPost(slug) {
  const rows = await apiRequest(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=any&_fields=id,slug,status,link`, 'GET');
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function uploadMedia(file, alt) {
  const data = fs.readFileSync(file);
  const result = await apiRequest('/wp-json/wp/v2/media?_fields=id,source_url', 'POST', data, {
    'Content-Disposition': `attachment; filename="${path.basename(file)}"`,
    'Content-Type': mimeType(file),
  });
  if (!result.id) throw new Error('Media upload returned no id: ' + file);
  if (alt) {
    await apiRequest(`/wp-json/wp/v2/media/${result.id}?_fields=id`, 'POST', { alt_text: alt });
  }
  return result;
}

async function updateRankMath(postId, payload) {
  const meta = {
    rank_math_title: payload.rank_math_title || payload.title,
    rank_math_description: payload.rank_math_description || payload.excerpt || '',
    rank_math_focus_keyword: payload.rank_math_focus_keyword || payload.slug.replace(/-/g, ' '),
    rank_math_robots: ['noindex', 'nofollow'],
  };
  return apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', { objectType: 'post', objectID: postId, meta });
}

function validatePayload(payload) {
  for (const key of ['title', 'slug', 'content_html', 'rank_math_title', 'rank_math_description']) {
    if (!payload[key]) throw new Error(`Missing ${key}: ${payload.slug || '(unknown)'}`);
  }
  if (payload.status !== 'draft') throw new Error(`Only draft payloads allowed: ${payload.slug}`);
  if (payload.publication_ready !== false) throw new Error(`publication_ready must remain false: ${payload.slug}`);
  if (payload.requires_human_review !== true) throw new Error(`requires_human_review must remain true: ${payload.slug}`);
  if (!payload.featured_image || !fs.existsSync(payload.featured_image.file)) {
    throw new Error(`Missing featured image: ${payload.slug}`);
  }
}

function payloadFiles() {
  if (!fs.existsSync(MANIFEST_PATH)) throw new Error('Missing active payload manifest: ' + MANIFEST_PATH);
  const manifest = readJson(MANIFEST_PATH);
  let files = (manifest.slugs || []).map((slug) => path.join(POSTS_DIR, `${slug}.json`));
  const missing = files.filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error('Manifest references missing payload files: ' + missing.slice(0, 5).join(', '));
  if (slugArg) files = files.filter((f) => path.basename(f, '.json') === slugArg);
  if (repairOnly) files = files.filter((file) => readJson(file).repair_status === 'editorially_repaired_from_slug_artifact');
  return files.slice(OFFSET, OFFSET + LIMIT);
}

async function main() {
  if (verifySyncSince) {
    if (!fs.existsSync(MANIFEST_PATH)) throw new Error('Missing active payload manifest: ' + MANIFEST_PATH);
    const manifest = readJson(MANIFEST_PATH);
    const latest = new Map();
    for (const row of readResultObjects()) {
      if (row.status === 'updated_existing_draft' && row.ts >= verifySyncSince) latest.set(row.slug, row);
    }
    const missing = manifest.slugs.filter((slug) => !latest.has(slug));
    const nonDraft = manifest.slugs.filter((slug) => latest.has(slug) && latest.get(slug).post?.status !== 'draft');
    console.log(JSON.stringify({
      active: manifest.slugs.length,
      updated_since: latest.size,
      missing_count: missing.length,
      missing,
      non_draft: nonDraft,
    }, null, 2));
    if (missing.length || nonDraft.length) process.exitCode = 1;
    return;
  }
  if (verifyLiveSlugs) {
    if (!SITE || !USER || !PASS) throw new Error('Missing WP_SITE/WP_USER/WP_APP_PASSWORD in ~/.env.');
    await checkAuth();
    const rows = [];
    for (const slug of verifyLiveSlugs.split(',').filter(Boolean)) {
      const existing = await existingPost(slug);
      if (!existing) throw new Error('Missing WordPress draft: ' + slug);
      const post = await apiRequest(`/wp-json/wp/v2/posts/${existing.id}?context=edit&_fields=id,slug,status,content`, 'GET');
      const content = post.content?.raw || post.content?.rendered || '';
      rows.push({
        slug,
        status: post.status,
        has_shop_module: content.includes('shop-dream-reflection-crystals'),
        has_product_shortcode: content.includes('[products'),
        has_category_link_list: content.includes('dream-shop-crystal-link'),
        duplicate_spiritual_h2: (content.match(/<h2>Spiritual Symbolism<\/h2>/g) || []).length > 1,
      });
    }
    console.log(JSON.stringify({ rows }, null, 2));
    if (rows.some((row) => row.status !== 'draft' || !row.has_shop_module || !row.has_product_shortcode || row.has_category_link_list || row.duplicate_spiritual_h2)) process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(POSTS_DIR)) throw new Error('Missing posts dir: ' + POSTS_DIR);
  const files = payloadFiles();
  const payloads = files.map(readJson);
  for (const payload of payloads) validatePayload(payload);

  console.log(JSON.stringify({
    mode: EXECUTE ? 'execute' : 'dry-run',
    site: SITE || '(missing)',
    count: payloads.length,
    slug: slugArg || null,
    limit: Number.isFinite(LIMIT) ? LIMIT : null,
    offset: OFFSET,
    upload_images: !skipImages,
    sync_existing: syncExisting,
  }, null, 2));

  if (!EXECUTE) {
    const samples = payloads.slice(0, 5).map((p) => ({
      slug: p.slug,
      title: p.title,
      content_chars: p.content_html.length,
      featured_image: path.basename(p.featured_image.file),
      crystal_images: p.crystal_images.length,
    }));
    console.log(JSON.stringify({ dry_run_samples: samples }, null, 2));
    console.log('No WP calls made. Add --execute to create real draft posts.');
    return;
  }

  if (!SITE || !USER || !PASS) throw new Error('Missing WP_SITE/WP_USER/WP_APP_PASSWORD in ~/.env.');
  const me = await checkAuth();
  console.log(`WP connected as ${me.name || me.slug || me.id}`);
  const categoryId = await ensureCategory('dreams', 'Dreams');
  console.log(`Category dreams id=${categoryId}`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  for (let index = 0; index < payloads.length; index++) {
    const payload = payloads[index];
    process.stdout.write(`[${index + 1}/${payloads.length}] ${payload.slug} ... `);
    try {
      const existing = await existingPost(payload.slug);
      const prior = !existing && payload.previous_slug ? await existingPost(payload.previous_slug) : null;
      const targetPost = existing || prior;
      if (targetPost) {
        if (syncExisting) {
          const post = await apiRequest(`/wp-json/wp/v2/posts/${targetPost.id}?_fields=id,slug,status,link`, 'POST', {
            title: payload.title,
            slug: payload.slug,
            status: 'draft',
            content: payload.content_html,
            excerpt: payload.excerpt || payload.rank_math_description || '',
            categories: [categoryId],
          });
          await updateRankMath(targetPost.id, payload);
          updated++;
          appendResult({ slug: payload.slug, previous_slug: payload.previous_slug || null, status: 'updated_existing_draft', post, ts: new Date().toISOString() });
          console.log(`updated draft id=${targetPost.id}`);
          continue;
        }
        skipped++;
        appendResult({ slug: payload.slug, status: 'skip_existing', existing: targetPost, ts: new Date().toISOString() });
        console.log(`skip existing id=${targetPost.id}`);
        continue;
      }
      let featuredId = 0;
      if (!skipImages) {
        const media = await uploadMedia(payload.featured_image.file, payload.featured_image.alt);
        featuredId = media.id;
      }
      const post = await apiRequest('/wp-json/wp/v2/posts?_fields=id,slug,status,link', 'POST', {
        title: payload.title,
        slug: payload.slug,
        status: 'draft',
        content: payload.content_html,
        excerpt: payload.excerpt || payload.rank_math_description || '',
        categories: [categoryId],
        featured_media: featuredId || undefined,
      });
      if (!post.id) throw new Error('Post create returned no id.');
      await updateRankMath(post.id, payload);
      created++;
      appendResult({ slug: payload.slug, status: 'created', post, featured_media: featuredId, ts: new Date().toISOString() });
      console.log(`created id=${post.id}`);
    } catch (error) {
      failed++;
      appendResult({ slug: payload.slug, status: 'fail', error: error.message, ts: new Date().toISOString() });
      console.log('FAIL ' + error.message.slice(0, 180));
    }
  }
  console.log(JSON.stringify({ created, updated, skipped, failed, results_path: RESULTS_PATH }, null, 2));
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
