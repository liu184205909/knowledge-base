#!/usr/bin/env node

/**
 * Fix English-source GoEarthward posts in place.
 *
 * - Keeps short, glossed Chinese/Eastern terms.
 * - Removes leaked Chinese production notes, appended QC reports, and blocks
 *   that are substantially Chinese prose in otherwise English posts.
 * - Adds a real WooCommerce [products] shortcode when one is missing.
 * - Creates a gzip rollback backup before any write.
 *
 * Default mode is dry-run. Pass --apply to write to WordPress.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFile, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APPLY = process.argv.includes('--apply');
const LIMIT_ARG = process.argv.find((arg) => arg.startsWith('--limit='));
const LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : Infinity;
const ONLY_ARG = process.argv.find((arg) => arg.startsWith('--slug='));
const ONLY_SLUG = ONLY_ARG ? ONLY_ARG.split('=').slice(1).join('=') : null;
const CONCURRENCY = Number(process.env.EARTHWARD_FIX_CONCURRENCY || 5);
const ROOT = __dirname;
const REPORT_DIR = path.join(ROOT, 'reports');
const BACKUP_DIR = path.join(ROOT, 'backups');
const ENV = loadEnv();
const SITE = ENV.WP_SITE || 'goearthward.com';
const AUTH = `${ENV.WP_USER || ''}:${ENV.WP_APP_PASSWORD || ''}`;
const PROXY = process.env.EARTHWARD_PROXY || 'socks5://127.0.0.1:10808';
const HAN = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/u;
const HAN_GLOBAL = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/gu;

if (!ENV.WP_USER || !ENV.WP_APP_PASSWORD) throw new Error('Missing WordPress credentials in ~/.env');

function loadEnv() {
  const result = {};
  for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;
    const equals = text.indexOf('=');
    if (equals > 0) result[text.slice(0, equals).trim()] = text.slice(equals + 1).trim();
  }
  return result;
}

function curlJsonSync(endpoint) {
  const stdout = execFileSync('curl.exe', [
    '-sS', '--fail-with-body', '--proxy', PROXY, '-u', AUTH,
    '--max-time', '150', `https://${SITE}${endpoint}`,
  ], { encoding: 'utf8', maxBuffer: 120 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function curlWrite(postId, payload) {
  return new Promise((resolve, reject) => {
    const child = execFile('curl.exe', [
      '-sS', '--fail-with-body', '--proxy', PROXY, '-u', AUTH,
      '-X', 'POST', '-H', 'Content-Type: application/json',
      '--data-binary', '@-', '--max-time', '180',
      `https://${SITE}/wp-json/wp/v2/posts/${postId}?context=edit&_fields=id,slug,status,modified_gmt`,
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) return reject(new Error((stderr || stdout || error.message).slice(0, 600)));
      try { resolve(JSON.parse(stdout)); }
      catch (parseError) { reject(new Error(`Invalid JSON for post ${postId}: ${stdout.slice(0, 300)}`)); }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'");
}

function textOf(html) {
  return decodeEntities(String(html || ''))
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitSchemas(raw) {
  const index = raw.search(/<script\b[^>]*type=["']application\/ld\+json["']/i);
  return index < 0 ? { body: raw, schemas: '' } : { body: raw.slice(0, index), schemas: raw.slice(index) };
}

function stripQcTail(body) {
  const markers = [
    /质检报告(?:（[^）]*）|\([^)]*\))?/u,
    /QC\s*质检报告/iu,
    /关卡\s*0\s*[—-]\s*合规前置门/u,
  ];
  let cut = -1;
  for (const marker of markers) {
    const match = marker.exec(body);
    if (match && (cut < 0 || match.index < cut)) cut = match.index;
  }
  if (cut < 0) return { body, removed: false };
  return { body: body.slice(0, cut).replace(/\s+$/, '') + '\n', removed: true };
}

const LEAK_MARKERS = /(?:DiffHint|合规口径|处锚点|需校验|钩子|质检|关卡|内链配方|禁用表达库|泛泛开头|自检|可上线|非泛\s*trait|写\s*\d+\s*个|结构指纹|跨场景去重报告)/iu;
const INTENT_CONTEXT = /(?:Chinese\s+(?:name|Zodiac|Five Elements?|medicine)|Eastern\s+(?:lens|view|tradition|frame|perspective)|Wu Xing|pinyin|Dao(?:ist)?|Tao(?:ist)?|Buddh(?:a|ist)|bodhisattva|meridian|qi\b|qì\b|feng shui|Vedic|Tibetan)/i;

function isReasonableTermBlock(block) {
  const text = textOf(block);
  const runs = text.match(HAN_GLOBAL) || [];
  if (!runs.length) return true;
  if (LEAK_MARKERS.test(text)) return false;
  if (/[，。；：！？]/u.test(text)) return false;
  if (runs.some((run) => run.length > 7)) return false;
  if (!INTENT_CONTEXT.test(text)) {
    return runs.every((run) => {
      const index = text.indexOf(run);
      const nearby = text.slice(Math.max(0, index - 60), index + run.length + 100);
      return /\([^)]*[A-Za-z][^)]*\)|（[^）]*[A-Za-z][^）]*）/.test(nearby);
    });
  }
  return true;
}

function stripChineseFragments(text) {
  return String(text)
    .replace(/\s*[（(]([^()（）]*[A-Za-z][^()（）]*)[)）]/g, ' ($1)')
    .replace(HAN_GLOBAL, '')
    .replace(/[，；：。！？、]/g, ' ')
    .replace(/[「」『』]/g, '"')
    .replace(/[（）]/g, ' ')
    .replace(/—{2,}/g, ' — ')
    .replace(/\s*\/\s*(?=\/|—|:|\.)/g, ' ')
    .replace(/\s{2,}/g, ' ');
}

function cjkOccurrenceIsGlossed(text, index, run) {
  const before = text.slice(Math.max(0, index - 90), index);
  const after = text.slice(index + run.length, index + run.length + 150);
  // Chinese term followed by an English/pinyin gloss.
  if (/^\s*[（(]\s*[A-Za-z][^()（）]{0,120}[)）]/.test(after)) return true;
  if (/^\s*(?:—|-)\s*(?:that\b|the\b|a\b|an\b|meaning\b|[A-Z][a-z])/i.test(after)) return true;
  // English term followed by the original Chinese characters in parentheses.
  if (/[A-Za-z][A-Za-z\s'-]{0,55}[（(]\s*$/.test(before) && /^\s*[)）]/.test(after)) return true;
  // Explicit Chinese-name table cells sometimes put the pinyin in the next cell.
  if (/Chinese\s+name\s*$/i.test(before) && /^\s*[（(]\s*[A-Za-z]/.test(after)) return true;
  return false;
}

function normalizeAllCjk(body, stats) {
  let result = body;
  // "术语 (pinyin, English gloss)" -> "pinyin (English gloss)"
  result = result.replace(/([\u3400-\u9fff]+)\s*[（(]\s*([A-Za-z][A-Za-z\s'-]{0,60}),\s*([^()（）]{1,140})[)）]/gu,
    (_, _term, romanized, gloss) => `${romanized.trim()} (${gloss.trim()})`);
  // "术语 (English gloss)" -> "English gloss"
  result = result.replace(/([\u3400-\u9fff]+)\s*[（(]\s*([A-Za-z][^()（）]{0,140})[)）]/gu,
    (_, _term, gloss) => gloss.trim());
  const count = (result.match(HAN_GLOBAL) || []).length;
  if (count) {
    stats.unglossedRunsRemoved += count;
    result = result.replace(HAN_GLOBAL, '');
  }
  return result
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/\(\s*\)/g, '')
    .replace(/\bidea of\s+—\s+that\b/gi, 'idea that')
    .replace(/\s*[，；：。！？、]\s*/g, ' ')
    .replace(/\s{2,}/g, ' ');
}

function cleanTaggedBlocks(body, stats) {
  // Work from innermost common content blocks. Whole Chinese prose blocks are
  // removed; short terms with an English gloss are preserved.
  const tagPattern = /<(h[1-6]|p|li|blockquote|figcaption|summary|td|th)\b[^>]*>[\s\S]*?<\/\1>/giu;
  return body.replace(tagPattern, (block) => {
    if (!HAN.test(textOf(block))) return block;
    if (isReasonableTermBlock(block)) {
      stats.reasonableBlocksKept++;
      return block;
    }
    const plain = textOf(block);
    const cjkChars = (plain.match(HAN_GLOBAL) || []).length;
    const visibleChars = plain.replace(/\s/g, '').length || 1;
    const cjkRatio = cjkChars / visibleChars;
    if (LEAK_MARKERS.test(plain) || /[，。；！？]/u.test(plain) || cjkRatio >= 0.08 || cjkChars >= 12) {
      stats.chineseBlocksRemoved++;
      return '';
    }
    stats.fragmentsStripped++;
    return stripChineseFragments(block);
  });
}

function cleanKnownLeaks(body, stats) {
  let result = body;
  const replacements = [
    [/DiffHint\s*\(M3\s*重心\)\s*:[^。<]*(?:。写\s*\d+\s*个该号码独有日常场景，非泛\s*trait\s*词。?)/giu, ''],
    [/\[需校验\]/gu, '[needs verification]'],
    [/合规口径\s*[:：]\s*/gu, 'Editorial framing: '],
    [/[≥>]\s*2\s*处锚点/gu, 'at least two anchors'],
    [/Hero\s*\+\s*钩子\s*\(Intro\)/giu, 'Introduction'],
    [/Intro（hero\s*\+\s*钩子，~?120\s*词）/giu, 'Introduction'],
  ];
  for (const [pattern, replacement] of replacements) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) stats.knownLeakReplacements++;
  }
  return result;
}

function cleanResidualPlainText(body, stats) {
  // If suspicious CJK remains outside recognized HTML blocks, remove the
  // complete line. This catches markdown/QC fragments leaked after HTML.
  const lines = body.split(/\r?\n/);
  const kept = [];
  for (const line of lines) {
    if (!HAN.test(textOf(line)) || isReasonableTermBlock(line)) kept.push(line);
    else {
      const visible = textOf(line);
      const count = (visible.match(HAN_GLOBAL) || []).length;
      if (LEAK_MARKERS.test(visible) || /[，。；！？]/u.test(visible) || count >= 12) stats.plainLinesRemoved++;
      else {
        stats.fragmentsStripped++;
        kept.push(stripChineseFragments(line));
      }
    }
  }
  return kept.join('\n');
}

function titleForSlug(post, currentTitle) {
  const fixed = {
    'justice-and-the-hanged-man': 'Justice and The Hanged Man Together: Tarot Combination Meaning',
    'justice-and-the-world': 'Justice and The World Together: Tarot Combination Meaning',
    'the-emperor-and-wheel-of-fortune': 'The Emperor and Wheel of Fortune Together: Tarot Combination Meaning',
    'the-fool-and-the-hermit': 'Wind Moves Outward, Earth Holds Within: The Fool and The Hermit Together',
    'the-hermit-and-death': 'After Reflection Comes a Necessary Clearing: The Hermit and Death Together',
  };
  if (fixed[post.slug]) return fixed[post.slug];
  return currentTitle;
}

function replaceFirstH1(body, title) {
  if (!/<h1\b/i.test(body)) return body;
  return body.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${title}</h1>`);
}

function shortcodeIn(raw) {
  return /\[(?:products?|product_category|best_selling_products|featured_products|recent_products)\b[^\]]*\]/i.test(raw);
}

function linksIn(raw) {
  const links = [];
  for (const match of raw.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) links.push(decodeEntities(match[1]));
  return links;
}

function productCategoryFor(raw, validCategories) {
  for (const link of linksIn(raw)) {
    const match = link.match(/product-category\/([^/?#]+)\/?/i);
    if (match && validCategories.has(match[1])) return match[1];
  }
  return null;
}

function productModule(category) {
  const shortcode = category
    ? `[products category="${category}" limit="4" columns="4" orderby="popularity"]`
    : '[products limit="4" columns="4" orderby="popularity"]';
  return `\n<section class="earthward-product-module" data-module="shop-related-products">\n` +
    `<h2>Shop Crystals for This Guide</h2>\n` +
    `<p>Explore crystal jewelry and stones from our current collection.</p>\n` +
    `${shortcode}\n</section>\n`;
}

function insertProductModule(body, module) {
  const positions = [
    /<h2\b[^>]*>\s*(?:FAQ|Frequently Asked Questions)/i,
    /<h2\b[^>]*>\s*Related\b/i,
  ];
  for (const pattern of positions) {
    const match = pattern.exec(body);
    if (match) return body.slice(0, match.index) + module + body.slice(match.index);
  }
  return body.replace(/\s*$/, '') + '\n' + module;
}

function fetchAll(endpoint, fields) {
  const rows = [];
  for (let page = 1; ; page++) {
    const joiner = endpoint.includes('?') ? '&' : '?';
    const batch = curlJsonSync(`${endpoint}${joiner}per_page=100&page=${page}${fields ? `&_fields=${fields}` : ''}`);
    rows.push(...batch);
    if (batch.length < 100) break;
  }
  return rows;
}

function auditOne(post, validCategories) {
  const raw = post.content?.raw || '';
  const currentTitle = textOf(post.title?.raw || post.title?.rendered || '');
  const nextTitle = titleForSlug(post, currentTitle);
  const stats = {
    qcTailRemoved: false,
    reasonableBlocksKept: 0,
    chineseBlocksRemoved: 0,
    fragmentsStripped: 0,
    knownLeakReplacements: 0,
    plainLinesRemoved: 0,
    unglossedRunsRemoved: 0,
    productAdded: false,
  };
  const split = splitSchemas(raw);
  let body = cleanKnownLeaks(split.body, stats);
  const tail = stripQcTail(body);
  body = tail.body;
  stats.qcTailRemoved = tail.removed;
  body = cleanTaggedBlocks(body, stats);
  body = cleanResidualPlainText(body, stats);
  body = normalizeAllCjk(body, stats);
  if (nextTitle !== currentTitle) body = replaceFirstH1(body, nextTitle);
  if (!shortcodeIn(body + split.schemas)) {
    body = insertProductModule(body, productModule(productCategoryFor(raw, validCategories)));
    stats.productAdded = true;
  }
  const nextRaw = (body.replace(/\n{3,}/g, '\n\n').trim() + '\n\n' + split.schemas.trim()).trim();
  const residual = textOf(nextRaw).match(HAN_GLOBAL) || [];
  const suspiciousResidual = HAN.test(textOf(nextRaw));
  const changed = nextRaw !== raw.trim() || nextTitle !== currentTitle;
  return {
    id: post.id, slug: post.slug, status: post.status,
    old_title: currentTitle, new_title: nextTitle,
    content: nextRaw, changed, stats,
    residual_cjk_chars: residual.length,
    suspicious_residual: Boolean(suspiciousResidual),
    product_shortcode_present: shortcodeIn(nextRaw),
  };
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function lane() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return results;
}

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });
console.log('Fetching product categories...');
const productCategories = fetchAll('/wp-json/wp/v2/product_cat?context=edit', 'id,slug,count,name');
const validCategories = new Set(productCategories.filter((category) => category.count > 0).map((category) => category.slug));
console.log(`Found ${validCategories.size} non-empty product categories.`);

console.log('Fetching all English-source posts...');
let posts = ONLY_SLUG
  ? curlJsonSync(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(ONLY_SLUG)}&status=any&context=edit&per_page=100&_fields=id,slug,status,title,content`)
  : fetchAll('/wp-json/wp/v2/posts?status=any&context=edit&orderby=id&order=asc', 'id,slug,status,title,content');
posts = posts.slice(0, LIMIT);
console.log(`Loaded ${posts.length} posts for ${APPLY ? 'APPLY' : 'DRY-RUN'}.`);

if (APPLY) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `wp-posts-before-fix-${timestamp}.json.gz`);
  fs.writeFileSync(backupPath, zlib.gzipSync(Buffer.from(JSON.stringify(posts), 'utf8'), { level: 9 }));
  console.log(`Rollback backup: ${backupPath}`);
}

const plan = posts.map((post) => auditOne(post, validCategories));
const changed = plan.filter((row) => row.changed);
const planSummary = {
  mode: APPLY ? 'apply' : 'dry-run',
  total: plan.length,
  changed: changed.length,
  product_modules_added: plan.filter((row) => row.stats.productAdded).length,
  qc_tails_removed: plan.filter((row) => row.stats.qcTailRemoved).length,
  posts_with_chinese_blocks_removed: plan.filter((row) => row.stats.chineseBlocksRemoved > 0).length,
  chinese_blocks_removed: plan.reduce((sum, row) => sum + row.stats.chineseBlocksRemoved, 0),
  title_fixes: plan.filter((row) => row.old_title !== row.new_title).length,
  suspicious_residual_posts: plan.filter((row) => row.suspicious_residual).length,
  missing_shortcode_after_fix: plan.filter((row) => !row.product_shortcode_present).length,
};
console.log('Plan summary:', JSON.stringify(planSummary, null, 2));

const compactPlan = plan.map(({ content, ...row }) => row);
const planFile = path.join(REPORT_DIR, APPLY ? 'fix-apply-results.json' : 'fix-dry-run.json');
fs.writeFileSync(planFile, JSON.stringify({ summary: planSummary, posts: compactPlan }, null, 2), 'utf8');

if (!APPLY) process.exit(0);

let completed = 0;
let failures = 0;
const applied = await runPool(changed, async (row) => {
  try {
    const payload = { content: row.content };
    if (row.new_title !== row.old_title) payload.title = row.new_title;
    const response = await curlWrite(row.id, payload);
    completed++;
    if (completed % 25 === 0 || completed === changed.length) console.log(`Updated ${completed}/${changed.length}; failures=${failures}`);
    return { id: row.id, slug: row.slug, ok: true, modified_gmt: response.modified_gmt };
  } catch (error) {
    failures++;
    console.error(`FAILED ${row.id} ${row.slug}: ${error.message}`);
    return { id: row.id, slug: row.slug, ok: false, error: error.message };
  }
}, CONCURRENCY);

const applySummary = { ...planSummary, completed, failures };
fs.writeFileSync(planFile, JSON.stringify({ summary: applySummary, posts: compactPlan, applied }, null, 2), 'utf8');
console.log('Apply summary:', JSON.stringify(applySummary, null, 2));
if (failures) process.exitCode = 1;
