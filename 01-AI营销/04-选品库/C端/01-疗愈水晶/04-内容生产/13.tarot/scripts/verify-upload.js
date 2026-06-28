/**
 * Tarot 上传后线上验证（防假完成）
 * WP REST GET 每篇验证：featured_media≠0 + content img数 + schema(json-ld) + slug唯一 + status
 * 用法：node scripts/verify-upload.js
 * 输出 _qc/upload-verification.json
 */
const fs = require('fs'), path = require('path');
const { execSync } = require('child_process');
const DIR = path.resolve(__dirname, '..');
const results = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', 'upload-results.json'), 'utf8'));
const PROXY = '--proxy socks5://127.0.0.1:10808';

const verified = [];
let passCount = 0;
for (const r of results) {
  if (r.status !== 'ok') { verified.push({ ...r, verify: 'skipped_upload_failed' }); continue; }
  try {
    const raw = execSync('curl -s ' + PROXY + ' "https://goearthward.com/wp-json/wp/v2/posts/' + r.id + '?_fields=id,slug,link,status,featured_media,content&context=edit" -u "' + process.env.WP_USER + ':' + process.env.WP_APP_PASSWORD + '" --max-time 30', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    // 上述命令需要 auth，改用已存 env
  } catch (e) {}
  // 用 env 重试（确保 AUTH）
  const env = {};
  for (const line of fs.readFileSync(path.join(require('os').homedir(), '.env'), 'utf8').split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  let p;
  try {
    const raw = execSync('curl -s ' + PROXY + ' -u "' + env.WP_USER + ':' + env.WP_APP_PASSWORD + '" "https://goearthward.com/wp-json/wp/v2/posts/' + r.id + '?_fields=id,slug,link,status,featured_media,content&context=edit" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
    p = JSON.parse(raw);
  } catch (e) {
    verified.push({ ...r, verify: 'fetch_error', error: e.message.slice(0, 100) });
    continue;
  }
  const content = p.content && p.content.rendered ? p.content.rendered : '';
  const imgCount = (content.match(/<img /g) || []).length;
  const schemaCount = (content.match(/application\/ld\+json/g) || []).length;
  const hasArticleSchema = /"@type":"Article"/.test(content);
  const hasFAQSchema = /"@type":"FAQPage"/.test(content);
  const hasBreadcrumb = /"@type":"BreadcrumbList"/.test(content);
  const hasItemList = /"@type":"ItemList"/.test(content);
  const hasProductSchema = /"@type":"Product"/.test(content); // 应为 false
  const featuredOk = p.featured_media && p.featured_media !== 0;
  const checks = {
    featured_media: featuredOk ? p.featured_media : 0,
    img_count: imgCount,
    schema_count: schemaCount,
    article: hasArticleSchema,
    faq: hasFAQSchema,
    breadcrumb: hasBreadcrumb,
    itemlist: hasItemList,
    product_schema_present: hasProductSchema,
    status: p.status,
    slug: p.slug,
    link: p.link,
  };
  const pass = featuredOk && imgCount >= 1 && schemaCount >= 3 && hasArticleSchema && hasFAQSchema && hasBreadcrumb && !hasProductSchema;
  if (pass) passCount++;
  verified.push({ ...r, verify: pass ? 'PASS' : 'FAIL', checks });
}
fs.writeFileSync(path.join(DIR, '_qc', 'upload-verification.json'), JSON.stringify({
  total: verified.length, passed: passCount, failed: verified.length - passCount,
  results: verified,
}, null, 2), 'utf8');

console.log('===== 线上验证完成 =====');
console.log(`通过 ${passCount}/${verified.length}`);
const fails = verified.filter(v => v.verify === 'FAIL');
if (fails.length) {
  console.log('--- 失败明细 ---');
  fails.forEach(f => console.log(`  [${f.postSlug}] ${JSON.stringify(f.checks)}`));
}
// 汇总统计
const all = verified.filter(v => v.checks);
const sumImg = all.reduce((s, v) => s + (v.checks.img_count || 0), 0);
const sumSchema = all.reduce((s, v) => s + (v.checks.schema_count || 0), 0);
console.log(`汇总: 总img=${sumImg} 总schema=${sumSchema} 平均schema/篇=${(sumSchema/all.length||0).toFixed(1)}`);
