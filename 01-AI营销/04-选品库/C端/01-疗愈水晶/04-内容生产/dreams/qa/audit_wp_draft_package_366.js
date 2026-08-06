const fs = require('fs');
const path = require('path');

const DREAMS_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(DREAMS_DIR, 'wp-draft-package', 'posts');
const MANIFEST_PATH = path.join(DREAMS_DIR, 'wp-draft-package', 'manifest.json');
const OUT_PATH = path.join(__dirname, 'wp-draft-package-366-audit.json');
const WRITE_REPORT = process.argv.includes('--write');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function textOnly(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(text) {
  return (String(text || '').match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu) || []).length;
}

function countMatches(text, re) {
  return (String(text || '').match(re) || []).length;
}

function severity(issue) {
  if (issue.startsWith('missing_') || issue.includes('publication_ready') || issue.includes('human_review')) return 'critical';
  if (issue.includes('no_product') || issue.includes('thin_content') || issue.includes('suspicious_slug') || issue.includes('generic_title') || issue.includes('duplicate_h2')) return 'major';
  return 'minor';
}

function auditOne(payload) {
  const issues = [];
  const html = payload.content_html || '';
  const plain = textOnly(html);
  const words = wordCount(plain);
  const slug = payload.slug || '';
  const title = payload.title || '';
  const editorialRepair = payload.repair_status === 'editorially_repaired_from_slug_artifact';
  const lower = (title + ' ' + slug + ' ' + plain).toLowerCase();

  if (payload.status !== 'draft') issues.push('status_not_draft');
  if (payload.publication_ready !== false) issues.push('publication_ready_not_false');
  if (payload.requires_human_review !== true) issues.push('requires_human_review_not_true');
  if (!payload.rank_math_title || !payload.rank_math_description || !payload.rank_math_focus_keyword) issues.push('missing_rank_math_field');
  if (!payload.featured_image || !fs.existsSync(payload.featured_image.file)) issues.push('missing_featured_image');
  if (!payload.crystal_images || payload.crystal_images.length < 1) issues.push('missing_crystal_images');
  if (!/dream-crystal-reflection-strip|crystal-meaning-reuse/.test(html)) issues.push('missing_crystal_reuse_strip');
  if (!payload.shop_module || !payload.shop_module.mode) issues.push('missing_shop_module_metadata');
  if (!/data-module="shop-dream-reflection-crystals"/.test(html)) issues.push('missing_shop_module');
  if (!/\[products(?: category="[^"]+")? limit="6" columns="3"/i.test(html)) issues.push('missing_product_shortcode');

  const h2Count = countMatches(html, /<h2\b/gi);
  const h2Titles = [...html.matchAll(/<h2\b[^>]*>(.*?)<\/h2>/gi)]
    .map((match) => textOnly(match[1]).toLowerCase());
  const duplicateH2 = [...new Set(h2Titles.filter((title, index) => h2Titles.indexOf(title) !== index))];
  const faqCount = countMatches(html, /<h3\b[^>]*>.*?\?/gi);
  if (h2Count < 5) issues.push(`thin_h2_count_${h2Count}`);
  if (duplicateH2.length) issues.push(`duplicate_h2_${duplicateH2.join('_')}`);
  const minimumWords = payload.source_bucket === 'wp_draft_ready_backbone' ? 1200 : 1150;
  if (words < minimumWords) issues.push(`thin_content_words_${words}`);
  if (title.length > 80) issues.push('title_too_long');
  if (/^(islamic|biblical|christian|spiritual) dream interpretation ai$/i.test(title)) issues.push('generic_title_ai_artifact');
  if (!editorialRepair && /\b(ai|online|free|define|definition|dreamscape|dreamlookup|dreamy-bot|tattoo|parody|az|z)\b/i.test(slug)) issues.push('suspicious_slug_or_navigation_artifact');
  if (/\b(and-meanings|and-their|meanings-for|verse-big|within-dream)\b/i.test(slug)) issues.push('suspicious_slug_fragment');
  if (/LuckyCrystals/i.test(payload.rank_math_title + payload.rank_math_description + html)) issues.push('brand_old_luckycrystals_present');
  if (/dream-dictionary\//i.test(html + ' ' + slug)) issues.push('old_dream_dictionary_url_present');

  const sensitive = /\b(abortion|sex|incest|evil|demon|devil|death|died|dying|shot|blood|cancer|paralysis|suicide|self-harm|rape)\b/i.test(lower);
  if (sensitive) {
    if (!/not a treatment|not medical advice|qualified professional|professional care|not a religious ruling|not a fatwa|reflection/i.test(html)) {
      issues.push('sensitive_topic_missing_boundary_language');
    }
  }
  if (/\b(islamic|biblical|christian|prophetic|god|jesus|devil|demon)\b/i.test(lower)) {
    if (!/not a fatwa|not a religious ruling|reflective|discernment|not doctrine|binding faith ruling/i.test(html)) {
      issues.push('religious_topic_missing_humility_boundary');
    }
  }
  if (/\b(treat|cure|heal|diagnose|guarantee|promise)\b/i.test(html) && !/not a treatment|not a diagnosis|not.*promise|not.*guarantee|symbolic supports/i.test(html)) {
    issues.push('possible_crystal_medical_or_guarantee_claim');
  }

  return {
    slug,
    title,
    source_bucket: payload.source_bucket,
    page_type: payload.page_type,
    priority: payload.priority,
    h2_count: h2Count,
    plain_chars: plain.length,
    word_count: words,
    crystal_images: (payload.crystal_images || []).length,
    shop_products: (payload.shop_products || []).length,
    issues: issues.map((issue) => ({ issue, severity: severity(issue) })),
  };
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) throw new Error('Missing active payload manifest: ' + MANIFEST_PATH);
  const manifest = readJson(MANIFEST_PATH);
  const files = (manifest.slugs || []).map((slug) => path.join(POSTS_DIR, `${slug}.json`));
  const missing = files.filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error('Manifest references missing payload files: ' + missing.slice(0, 5).join(', '));
  const rows = files.map((file) => auditOne(readJson(file)));
  const issueRows = rows.filter((row) => row.issues.length);
  const issueCounts = {};
  const severityCounts = {};
  for (const row of issueRows) {
    for (const item of row.issues) {
      issueCounts[item.issue] = (issueCounts[item.issue] || 0) + 1;
      severityCounts[item.severity] = (severityCounts[item.severity] || 0) + 1;
    }
  }
  const majorOrCritical = rows.filter((row) => row.issues.some((item) => item.severity === 'critical' || item.severity === 'major'));
  const report = {
    generated_at: new Date().toISOString(),
    total: rows.length,
    issue_rows: issueRows.length,
    major_or_critical_rows: majorOrCritical.length,
    issue_counts: Object.fromEntries(Object.entries(issueCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    severity_counts: severityCounts,
    major_or_critical_examples: majorOrCritical.slice(0, 80),
    rows,
  };
  if (WRITE_REPORT) fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({
    total: report.total,
    issue_rows: report.issue_rows,
    major_or_critical_rows: report.major_or_critical_rows,
    issue_counts: report.issue_counts,
    severity_counts: report.severity_counts,
    out: WRITE_REPORT ? OUT_PATH : null,
  }, null, 2));
}

main();
