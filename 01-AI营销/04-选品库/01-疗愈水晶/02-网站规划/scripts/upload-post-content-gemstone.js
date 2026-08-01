/**
 * Upload a Crystal Meaning post_content package to WordPress (gemstone CPT).
 *
 * New contract — post_content 主源（不再用结构化字段组装 HTML）:
 *   {
 *     title, slug, excerpt,
 *     rank_math_title, rank_math_description, rank_math_focus_keyword,
 *     content: "<整串 HTML, 含图片占位符>",
 *     images: { featured:{file,alt}, overview:{...}, properties, benefits, how_to_use, form_bracelet }
 *   }
 *
 * Image placeholders in content (replaced on --upload-images):
 *   {KEY}_IMAGE_URL      -> real media URL
 *   wp-image-{KEY}_ID    -> wp-image-{real_id}
 *   KEY = FEATURED | OVERVIEW | PROPERTIES | BENEFITS | HOW_TO_USE | FORM_BRACELET
 *
 * Usage:
 *   node upload-post-content-gemstone.js [jsonPath]                              # 默认 dry-run，不连 WP
 *   node upload-post-content-gemstone.js [jsonPath] --status draft   --upload-images   # 真实创建草稿 + 上传图片
 *   node upload-post-content-gemstone.js [jsonPath] --publish        --upload-images   # 显式发布
 *   node upload-post-content-gemstone.js [jsonPath] --status draft   --skip-images     # 只更新 content/SEO（图片已传过）
 *
 * Safety: 默认 dry-run，绝不自动发布。只有 --publish / --status publish 才上线。
 * 缺图片占位符时报错（不静默跳过）。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

function loadHomeEnvOverride() {
  const envPath = path.join(os.homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  const keys = new Set(['WP_SITE', 'WP_USER', 'WP_APP_PASSWORD']);
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (keys.has(key)) process.env[key] = trimmed.slice(eq + 1).trim();
  }
}
loadHomeEnvOverride();

const E = require('../templates/elementor-utils');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_JSON = path.resolve(PROJECT_ROOT, '../04-内容生产/crystal-meaning/amethyst-meaning.json');
const RESULTS_PATH = path.resolve(PROJECT_ROOT, 'assets/upload-results-post-content-gemstone.json');

// 图片 key -> content 占位符
const IMAGE_PLACEHOLDERS = {
  featured:   { urlToken: '{FEATURED_IMAGE_URL}',   idToken: 'wp-image-FEATURED_ID' },
  overview:   { urlToken: '{OVERVIEW_IMAGE_URL}',   idToken: 'wp-image-OVERVIEW_ID' },
  properties: { urlToken: '{PROPERTIES_IMAGE_URL}', idToken: 'wp-image-PROPERTIES_ID' },
  benefits:   { urlToken: '{BENEFITS_IMAGE_URL}',   idToken: 'wp-image-BENEFITS_ID' },
  how_to_use: { urlToken: '{HOW_TO_USE_IMAGE_URL}', idToken: 'wp-image-HOW_TO_USE_ID' },
  form_bracelet: { urlToken: '{FORM_BRACELET_IMAGE_URL}', idToken: 'wp-image-FORM_BRACELET_ID' }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const jsonPath = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--status' && args[i - 1] !== '--schedule');
  const statusIdx = args.indexOf('--status');
  const statusVal = statusIdx >= 0 ? args[statusIdx + 1] : null;
  const scheduleIdx = args.indexOf('--schedule');
  const scheduleDate = scheduleIdx >= 0 ? args[scheduleIdx + 1] : null;
  let status = null;
  if (scheduleDate) status = 'future';           // --schedule "datetime" => WP 定时发布，到点自动 publish
  else if (args.includes('--publish')) status = 'publish';
  else if (statusVal === 'publish') status = 'publish';
  else if (statusVal === 'draft') status = 'draft';
  // status === null => dry-run
  return {
    jsonPath: path.resolve(jsonPath || DEFAULT_JSON),
    status,
    scheduleDate,
    dryRun: status === null,
    skipImages: args.includes('--skip-images'),
    uploadImages: args.includes('--upload-images')
  };
}

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function mimeType(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.png') return 'image/png';
  throw new Error('Unsupported image type: ' + p);
}

// ---- WP helpers ----
function apiRequestRaw(apiPath, method, body, headers) {
  return new Promise((resolve, reject) => {
    const payload = body || Buffer.alloc(0);
    const options = {
      hostname: E.SITE, port: 443, path: apiPath, method,
      headers: Object.assign({ Authorization: E.AUTH, 'Content-Length': payload.length }, headers || {})
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch (e) { parsed = { raw: data }; }
        if (res.statusCode >= 400) {
          const err = new Error('HTTP ' + res.statusCode + ' ' + method + ' ' + apiPath);
          err.response = parsed; reject(err); return;
        }
        resolve(parsed);
      });
    });
    req.on('error', reject);
    if (payload.length) req.write(payload);
    req.end();
  });
}

async function uploadMedia(filePath, fileName, altText) {
  const fileData = fs.readFileSync(filePath);
  const result = await apiRequestRaw('/wp-json/wp/v2/media', 'POST', fileData, {
    'Content-Disposition': 'attachment; filename="' + fileName + '"',
    'Content-Type': mimeType(filePath)
  });
  if (!result.id) throw new Error('Media upload returned no id: ' + fileName);
  if (altText) {
    await E.apiRequest('/wp-json/wp/v2/media/' + result.id, 'POST', { alt_text: altText });
  }
  console.log('  Uploaded media: ' + fileName + ' -> id ' + result.id);
  return { id: result.id, source_url: result.source_url };
}

async function findExistingGemstone(slug) {
  // 必须带 status=draft,publish：默认只查 publish，draft 的 post 查不到 → 每次 Created 新的
  const items = await E.apiRequest('/wp-json/wp/v2/gemstone?slug=' + encodeURIComponent(slug) + '&status=draft,publish&context=edit', 'GET');
  return Array.isArray(items) && items.length ? items[0] : null;
}

async function checkConnectionOrThrow() {
  const result = await apiRequestRaw('/wp-json/wp/v2/users/me', 'GET');
  if (!result.id) throw new Error('WP auth check returned no user id: ' + JSON.stringify(result).slice(0, 300));
  console.log('WP connected as: ' + (result.name || result.slug || result.id));
}

async function updateRankMathMeta(postId, data) {
  const meta = {
    rank_math_title: data.rank_math_title || data.title || '',
    rank_math_description: data.rank_math_description || data.excerpt || '',
    rank_math_focus_keyword: data.rank_math_focus_keyword || String(data.slug || '').replace(/-/g, ' ').trim(),
    rank_math_robots: ['index', 'follow']
  };
  return E.apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', { objectType: 'post', objectID: postId, meta });
}

// ---- validation ----
function validatePayload(data) {
  const required = [
    ['title', data.title],
    ['slug', data.slug],
    ['excerpt', data.excerpt],
    ['content', data.content]
  ];
  const missing = required.filter(r => !r[1]).map(r => r[0]);
  if (missing.length) throw new Error('Missing required fields: ' + missing.join(', '));
  if (typeof data.content !== 'string') {
    throw new Error('content must be a string (full HTML). Got ' + typeof data.content + '. 旧结构化字段契约已退役。');
  }
}

// content 里出现占位符但 images 没提供对应图
function findUnresolvedPlaceholders(content, images) {
  const unresolved = [];
  for (const [key, ph] of Object.entries(IMAGE_PLACEHOLDERS)) {
    const inContent = content.includes(ph.urlToken) || content.includes(ph.idToken);
    const provided = images && images[key] && images[key].file;
    if (inContent && !provided) {
      unresolved.push(key + ' (' + ph.urlToken + ')');
    }
  }
  return unresolved;
}

// 上传图片 + 替换 content 占位符
async function uploadAndReplaceImages(data) {
  const images = data.images || {};
  let content = data.content;
  const mediaIds = {};
  for (const [key, ph] of Object.entries(IMAGE_PLACEHOLDERS)) {
    if (!content.includes(ph.urlToken) && !content.includes(ph.idToken)) continue; // content 没用到这张图
    const img = images[key];
    if (!img || !img.file) {
      throw new Error('Placeholder ' + ph.urlToken + ' found in content but images.' + key + ' missing. Provide image or remove placeholder.');
    }
    const filePath = path.resolve(PROJECT_ROOT, img.file);
    if (!fs.existsSync(filePath)) {
      throw new Error('Missing image file for ' + key + ': ' + filePath);
    }
    const uploaded = await uploadMedia(filePath, path.basename(img.file), img.alt || '');
    mediaIds[key] = uploaded;
    content = content.split(ph.urlToken).join(uploaded.source_url);
    content = content.split(ph.idToken).join('wp-image-' + uploaded.id);
  }
  return { content, mediaIds };
}

async function main() {
  const opts = parseArgs();
  const data = readJson(opts.jsonPath);

  validatePayload(data);

  const unresolved = findUnresolvedPlaceholders(data.content, data.images);

  // 图片模式：显式 flag 优先；否则非 dry-run 默认传图，dry-run 不传
  let useImages;
  if (opts.uploadImages) useImages = true;
  else if (opts.skipImages) useImages = false;
  else useImages = !opts.dryRun;

  // dry-run: 不连 WP
  if (opts.dryRun) {
    console.log('=== DRY RUN (no WP call) ===');
    console.log('JSON: ' + opts.jsonPath);
    console.log('title: ' + data.title);
    console.log('slug: ' + data.slug);
    console.log('excerpt: ' + (data.excerpt || '').slice(0, 80) + '...');
    console.log('content length: ' + data.content.length + ' chars');
    const used = Object.entries(IMAGE_PLACEHOLDERS)
      .filter(([, ph]) => data.content.includes(ph.urlToken) || data.content.includes(ph.idToken))
      .map(([k]) => k);
    console.log('image placeholders in content: ' + (used.length ? used.join(', ') : '(none)'));
    if (unresolved.length) console.log('⚠ UNRESOLVED (no image provided): ' + unresolved.join(', '));
    console.log('\nNo WP call made. Use --status draft to create a real draft, --publish to go live.');
    return;
  }

  // 非 dry-run：未解析的占位符必须为 0
  if (unresolved.length) {
    throw new Error('Cannot upload — unresolved image placeholders: ' + unresolved.join('; '));
  }

  await checkConnectionOrThrow();

  let content = data.content;
  const mediaIds = {};
  if (useImages) {
    console.log('Uploading images & replacing placeholders...');
    // featured 独立上传：content 不含 featured 占位符（踩坑规则：避免 hero 区重复显示），
    // 但 featured_media 必须设，所以这里单独上传 featured 图，不依赖 content 占位符。
    if (data.images && data.images.featured && data.images.featured.file) {
      const fp = path.resolve(PROJECT_ROOT, data.images.featured.file);
      if (fs.existsSync(fp)) {
        const fup = await uploadMedia(fp, path.basename(fp), data.images.featured.alt || '');
        mediaIds.featured = fup;
        console.log('  Uploaded featured: ' + path.basename(fp) + ' -> id ' + fup.id);
      } else {
        console.log('  ⚠ featured file missing, featured_media not set: ' + fp);
      }
    }
    const r = await uploadAndReplaceImages(data);
    content = r.content;
    Object.assign(mediaIds, r.mediaIds);
  } else {
    // --skip-images: content 必须已无占位符
    const stillHas = Object.values(IMAGE_PLACEHOLDERS)
      .some(ph => content.includes(ph.urlToken) || content.includes(ph.idToken));
    if (stillHas) {
      throw new Error('--skip-images 但 content 仍含图片占位符。请用 --upload-images 或先手动替换 URL。');
    }
  }

  const existing = await findExistingGemstone(data.slug);
  const payload = {
    title: data.title,
    slug: data.slug,
    status: opts.status, // 'draft' | 'publish' | 'future'(--schedule 定时发布)
    content,
    excerpt: data.excerpt
  };
  if (opts.status === 'future' && opts.scheduleDate) payload.date = opts.scheduleDate;
  if (mediaIds.featured) payload.featured_media = mediaIds.featured.id;

  const apiPath = existing ? '/wp-json/wp/v2/gemstone/' + existing.id : '/wp-json/wp/v2/gemstone';
  const result = await E.apiRequest(apiPath, 'POST', payload);
  if (!result.id) throw new Error('Gemstone upload failed: ' + JSON.stringify(result).slice(0, 500));

  await updateRankMathMeta(result.id, data);

  // 保留旧 media，并合并本次新增/替换 media，避免 partial image upload 覆盖掉既有记录。
  let outputMedia = {};
  try {
    const oldRes = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
    if (oldRes && oldRes.media) outputMedia = oldRes.media;
  } catch (e) {}
  outputMedia = Object.assign({}, outputMedia, mediaIds);
  const output = {
    uploaded_at: new Date().toISOString(),
    source_json: opts.jsonPath,
    mode: existing ? 'updated' : 'created',
    status: result.status || opts.status,
    gemstone: { id: result.id, slug: result.slug, link: result.link },
    media: outputMedia
  };
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(output, null, 2), 'utf8');

  // 写回本地 json：content 替换为 wp-image + media id 回填，让下次 --skip-images 可用（避免重复传图）
  if (useImages) {
    data.content = content;
    for (const [k, v] of Object.entries(mediaIds)) {
      if (data.images && data.images[k]) data.images[k].wp_id = v.id;
    }
    fs.writeFileSync(opts.jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Wrote back to JSON (content + wp_id): ' + opts.jsonPath);
  }

  console.log((existing ? 'Updated' : 'Created') + ' gemstone [' + opts.status + ']: ' + result.id);
  console.log('Rank Math meta updated.');
  console.log('Link: ' + result.link);
  console.log('Wrote: ' + RESULTS_PATH);
}

main().catch(e => {
  console.error(e.stack || e.message || e);
  if (e.response) console.error(JSON.stringify(e.response, null, 2));
  process.exit(1);
});
