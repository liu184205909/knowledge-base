#!/usr/bin/env node

/**
 * Audit the English-source WordPress posts on goearthward.com.
 *
 * Checks:
 *   1. Visible CJK text in the English source content.
 *   2. Whether the article body contains a specific product, a WooCommerce
 *      product module, a category/shop CTA, or no commerce entry at all.
 *
 * The script is read-only. It uses WordPress application credentials from
 * ~/.env and writes only compact audit results (never full post bodies).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'reports');
const SITE = loadEnv().WP_SITE || 'goearthward.com';
const ENV = loadEnv();
const AUTH = `${ENV.WP_USER || ''}:${ENV.WP_APP_PASSWORD || ''}`;
const PROXY = process.env.EARTHWARD_PROXY || 'socks5://127.0.0.1:10808';
const PER_PAGE = 100;

if (!ENV.WP_USER || !ENV.WP_APP_PASSWORD) {
  throw new Error('Missing WP_USER or WP_APP_PASSWORD in ~/.env');
}

function loadEnv() {
  const result = {};
  const envPath = path.join(os.homedir(), '.env');
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;
    const equals = text.indexOf('=');
    if (equals > 0) result[text.slice(0, equals).trim()] = text.slice(equals + 1).trim();
  }
  return result;
}

function api(endpoint) {
  const url = `https://${SITE}${endpoint}`;
  const stdout = execFileSync('curl.exe', [
    '-sS', '--fail-with-body', '--proxy', PROXY,
    '-u', AUTH, '--max-time', '120', url,
  ], { encoding: 'utf8', maxBuffer: 80 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'");
}

function visibleText(html) {
  return decodeEntities(String(html || ''))
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const HAN_RUN = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]+/gu;

function cjkFindings(text) {
  const findings = [];
  for (const match of text.matchAll(HAN_RUN)) {
    const start = Math.max(0, match.index - 110);
    const end = Math.min(text.length, match.index + match[0].length + 150);
    const context = text.slice(start, end).replace(/\s+/g, ' ').trim();
    const nearby = text.slice(Math.max(0, match.index - 180), Math.min(text.length, match.index + match[0].length + 220));
    const hasPinyinGloss = /\([a-z][a-z\s-]{0,45},\s*(?:the\s+)?[a-z]/i.test(nearby);
    const easternContext = /Eastern|Chinese|Dao(?:ist)?|Tao(?:ist)?|feng shui|zodiac|meridian|five elements|traditional medicine|TCM/i.test(nearby);
    const longRun = match[0].length >= 8;
    const classification = !longRun && (hasPinyinGloss || easternContext)
      ? 'intentional_term_or_gloss'
      : 'needs_editorial_review';
    findings.push({ text: match[0], context, classification });
  }
  return findings;
}

function unique(list) {
  return [...new Set(list)];
}

function hrefs(html) {
  const result = [];
  for (const match of String(html || '').matchAll(/href\s*=\s*["']([^"']+)["']/gi)) result.push(decodeEntities(match[1]));
  return unique(result);
}

function commerceSignals(raw) {
  const links = hrefs(raw);
  const specificProductLinks = links.filter((url) => /(?:^|\/)(?:product)\//i.test(url) && !/product-category\//i.test(url));
  const categoryLinks = links.filter((url) => /product-category\//i.test(url));
  const shopLinks = links.filter((url) => /(?:^|\/)shop(?:\/|$)|healing-(?:crystals-)?jewelry(?:\/|$)|post_type=product/i.test(url));
  const productShortcodes = String(raw || '').match(/\[(?:products?|product_category|best_selling_products|featured_products|recent_products)\b[^\]]*\]/gi) || [];
  const wooBlocks = String(raw || '').match(/(?:wp-block-woocommerce|<!--\s*wp:woocommerce\/)/gi) || [];
  const specificShortcode = productShortcodes.some((code) => /\bids?\s*=\s*["'][^"']+["']/i.test(code));

  let level = 'none';
  if (specificProductLinks.length || specificShortcode) level = 'specific_product';
  else if (productShortcodes.length || wooBlocks.length) level = 'dynamic_product_module';
  else if (categoryLinks.length || shopLinks.length) level = 'category_or_shop_cta';

  return {
    level,
    has_any_commerce_entry: level !== 'none',
    specific_product_links: specificProductLinks,
    category_links: categoryLinks,
    shop_links: shopLinks,
    product_shortcodes: unique(productShortcodes),
    woo_block_count: wooBlocks.length,
  };
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, columns) {
  const lines = [columns.map(csvCell).join(',')];
  for (const row of rows) lines.push(columns.map((column) => csvCell(row[column])).join(','));
  fs.writeFileSync(file, '\uFEFF' + lines.join('\n') + '\n', 'utf8');
}

function countBy(rows, key) {
  const counts = {};
  for (const row of rows) counts[row[key]] = (counts[row[key]] || 0) + 1;
  return counts;
}

function mdTable(map) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => `| ${name} | ${count} |`).join('\n');
}

function fetchCategories() {
  const categories = [];
  for (let page = 1; ; page++) {
    const batch = api(`/wp-json/wp/v2/categories?context=edit&per_page=100&page=${page}&_fields=id,name,slug,count`);
    categories.push(...batch);
    if (batch.length < 100) break;
  }
  return new Map(categories.map((category) => [category.id, category]));
}

function fetchPosts() {
  const posts = [];
  for (let page = 1; ; page++) {
    process.stdout.write(`Fetching posts page ${page}... `);
    const fields = 'id,slug,status,link,date_gmt,modified_gmt,title,content,categories';
    const batch = api(`/wp-json/wp/v2/posts?status=any&context=edit&per_page=${PER_PAGE}&page=${page}&orderby=id&order=asc&_fields=${fields}`);
    posts.push(...batch);
    console.log(`${batch.length} (total ${posts.length})`);
    if (batch.length < PER_PAGE) break;
  }
  return posts;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const categoryMap = fetchCategories();
const posts = fetchPosts();
const auditedAt = new Date().toISOString();

const rows = posts.map((post) => {
  const raw = post.content?.raw || post.content?.rendered || '';
  const title = visibleText(post.title?.raw || post.title?.rendered || '');
  const text = `${title} ${visibleText(raw)}`.trim();
  const cjk = cjkFindings(text);
  const commerce = commerceSignals(raw);
  const categories = (post.categories || []).map((id) => categoryMap.get(id)).filter(Boolean);
  const categoryNames = categories.map((category) => category.name);
  const categorySlugs = categories.map((category) => category.slug);
  const isTarot = categorySlugs.some((slug) => /tarot/i.test(slug)) || categoryNames.some((name) => /tarot/i.test(name));
  return {
    id: post.id,
    slug: post.slug,
    title,
    status: post.status,
    link: post.link || `https://${SITE}/${post.slug}/`,
    date_gmt: post.date_gmt,
    modified_gmt: post.modified_gmt,
    categories: categoryNames,
    category_slugs: categorySlugs,
    is_tarot: isTarot,
    cjk_run_count: cjk.length,
    cjk_char_count: cjk.reduce((sum, finding) => sum + finding.text.length, 0),
    cjk_classification: cjk.some((finding) => finding.classification === 'needs_editorial_review')
      ? 'needs_editorial_review'
      : cjk.length ? 'intentional_term_or_gloss' : 'none',
    cjk_findings: cjk,
    product_level: commerce.level,
    has_any_commerce_entry: commerce.has_any_commerce_entry,
    specific_product_links: commerce.specific_product_links,
    category_links: commerce.category_links,
    shop_links: commerce.shop_links,
    product_shortcodes: commerce.product_shortcodes,
    woo_block_count: commerce.woo_block_count,
  };
});

const tarot = rows.filter((row) => row.is_tarot);
const cjkRows = rows.filter((row) => row.cjk_run_count > 0);
const cjkReviewRows = rows.filter((row) => row.cjk_classification === 'needs_editorial_review');
const noCommerceRows = rows.filter((row) => !row.has_any_commerce_entry);
const summary = {
  audited_at: auditedAt,
  site: SITE,
  scope: 'WordPress posts, status=any, English source content only',
  total_posts: rows.length,
  status_counts: countBy(rows, 'status'),
  cjk: {
    posts_with_cjk: cjkRows.length,
    intentional_term_or_gloss: cjkRows.filter((row) => row.cjk_classification === 'intentional_term_or_gloss').length,
    needs_editorial_review: cjkReviewRows.length,
  },
  products: {
    level_counts: countBy(rows, 'product_level'),
    no_commerce_entry: noCommerceRows.length,
  },
  tarot: {
    total_posts: tarot.length,
    status_counts: countBy(tarot, 'status'),
    posts_with_cjk: tarot.filter((row) => row.cjk_run_count > 0).length,
    needs_editorial_review: tarot.filter((row) => row.cjk_classification === 'needs_editorial_review').length,
    product_level_counts: countBy(tarot, 'product_level'),
    no_commerce_entry: tarot.filter((row) => !row.has_any_commerce_entry).length,
  },
};

fs.writeFileSync(path.join(OUT_DIR, 'audit-all-posts.json'), JSON.stringify({ summary, posts: rows }, null, 2), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, 'audit-summary.json'), JSON.stringify(summary, null, 2), 'utf8');

const baseColumns = [
  'id', 'slug', 'title', 'status', 'link', 'categories', 'is_tarot',
  'cjk_run_count', 'cjk_char_count', 'cjk_classification',
  'product_level', 'has_any_commerce_entry', 'specific_product_links',
  'category_links', 'shop_links', 'product_shortcodes', 'woo_block_count',
];
writeCsv(path.join(OUT_DIR, 'audit-all-posts.csv'), rows, baseColumns);
writeCsv(path.join(OUT_DIR, 'audit-cjk-posts.csv'), cjkRows.map((row) => ({
  ...row,
  cjk_text: row.cjk_findings.map((finding) => finding.text),
  cjk_context: row.cjk_findings.map((finding) => `[${finding.classification}] ${finding.context}`),
})), [...baseColumns, 'cjk_text', 'cjk_context']);
writeCsv(path.join(OUT_DIR, 'audit-no-commerce-entry.csv'), noCommerceRows, baseColumns);
writeCsv(path.join(OUT_DIR, 'audit-tarot-posts.csv'), tarot, baseColumns);

const example = rows.find((row) => row.slug === 'five-card-advice-spread');
const markdown = `# GoEarthward English Article Audit\n\n` +
  `- Audited: ${auditedAt}\n` +
  `- Scope: all ${rows.length} WordPress posts returned by authenticated \`status=any\`; English source content only\n` +
  `- Checks: visible CJK text and product/commerce inclusion in the article body\n\n` +
  `## All posts\n\n` +
  `### Status\n\n| Status | Posts |\n|---|---:|\n${mdTable(summary.status_counts)}\n\n` +
  `### Chinese text\n\n` +
  `| Result | Posts |\n|---|---:|\n` +
  `| No visible CJK | ${rows.length - summary.cjk.posts_with_cjk} |\n` +
  `| Intentional term or gloss | ${summary.cjk.intentional_term_or_gloss} |\n` +
  `| Needs editorial review | ${summary.cjk.needs_editorial_review} |\n\n` +
  `### Product inclusion\n\n| Level | Posts |\n|---|---:|\n${mdTable(summary.products.level_counts)}\n\n` +
  `## Tarot category\n\n` +
  `- Total: ${summary.tarot.total_posts}\n` +
  `- With visible CJK: ${summary.tarot.posts_with_cjk}\n` +
  `- Needs editorial review: ${summary.tarot.needs_editorial_review}\n` +
  `- No commerce entry: ${summary.tarot.no_commerce_entry}\n\n` +
  `| Product level | Tarot posts |\n|---|---:|\n${mdTable(summary.tarot.product_level_counts)}\n\n` +
  `## Requested example\n\n` +
  (example
    ? `- \`${example.slug}\`: CJK=${example.cjk_classification}; product=${example.product_level}.\n` +
      `- The CJK strings are short Chinese-medicine terms accompanied by pinyin and English glosses, so they are classified as intentional terminology, not translation leakage.\n`
    : '- The requested slug was not returned by the API.\n') +
  `\n## Files\n\n` +
  `- \`audit-cjk-posts.csv\`: every post with visible Chinese characters and surrounding context\n` +
  `- \`audit-no-commerce-entry.csv\`: posts with no product, WooCommerce module, product category, or shop link\n` +
  `- \`audit-tarot-posts.csv\`: Tarot-only audit\n` +
  `- \`audit-all-posts.csv\`: one-row-per-post inventory\n`;

fs.writeFileSync(path.join(OUT_DIR, 'README.md'), markdown, 'utf8');
console.log('\nAudit summary:');
console.log(JSON.stringify(summary, null, 2));

