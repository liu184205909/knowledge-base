/**
 * 验证 Astrology 文章线上产出（featured/img/schema/去AI化禁词=0）
 * memory completion-requires-online-verification：声明完成前必须 WP GET 验证
 * 用法：node verify-upload.js --slug=mercury-retrograde | (全7篇)
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

const FORBIDDEN = [/destined/i,/destiny/i,/guaranteed/i,/will heal/i,/will attract/i,/meant to/i,/cure/i,/doom/i,/cursed/i,/catastrophe/i,/disaster/i,/bad luck/i];

const results = [];
for (const art of list) {
  const postSlug = art.line === 'hub' ? art.slug : 'crystals-for-' + art.slug;
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + postSlug + '&status=any&_fields=id,status,slug,link,featured_media,title,excerpt" --max-time 20', { encoding: 'utf8' });
    const arr = JSON.parse(r);
    if (!arr.length) { results.push({ slug: art.slug, postSlug, status: 'NOT_FOUND' }); console.log('NOT FOUND ' + postSlug); continue; }
    const p = arr[0];
    // 取全文 content（含 schema/图片）验证
    const r2 = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + p.id + '?context=view&_fields=content" --max-time 20', { encoding: 'utf8' });
    const full = JSON.parse(r2).content?.rendered || '';
    const text = full.replace(/<[^>]+>/g, ' ').toLowerCase();
    const imgCount = (full.match(/<img /g) || []).length;
    const hasArticle = full.includes('"@type":"Article"') || full.includes('"@type": "Article"');
    const hasFAQ = full.includes('"@type":"FAQPage"') || full.includes('"@type": "FAQPage"');
    const hasBreadcrumb = full.includes('"@type":"BreadcrumbList"') || full.includes('"@type": "BreadcrumbList"');
    const forbiddenHits = [];
    for (const f of FORBIDDEN) {
      const m = text.match(f);
      if (m && !/not a guarantee|not guaranteed|no guarantee|rather than a|not a prediction|not inherently/.test(text.slice(Math.max(0,m.index-50), m.index+50))) forbiddenHits.push(m[0]);
    }
    const v = {
      slug: art.slug, postSlug, id: p.id, status: p.status, link: p.link,
      featured_media: p.featured_media, has_featured: !!p.featured_media,
      img_count: imgCount, schema_article: hasArticle, schema_faq: hasFAQ, schema_breadcrumb: hasBreadcrumb,
      forbidden_hits: forbiddenHits, forbidden_pass: forbiddenHits.length === 0,
      word_count: text.split(/\s+/).length,
      all_pass: !!p.featured_media && imgCount >= 2 && hasArticle && hasFAQ && forbiddenHits.length === 0,
    };
    results.push(v);
    console.log(`[${v.all_pass?'PASS':'FAIL'}] ${postSlug} id:${p.id} status:${p.status} featured:${v.has_featured} img:${imgCount} schema:${hasArticle}/${hasFAQ}/${hasBreadcrumb} forbidden:${forbiddenHits.length} words:${v.word_count}`);
  } catch (e) {
    results.push({ slug: art.slug, postSlug, error: e.message.slice(0, 150) });
    console.log('ERR ' + postSlug + ': ' + e.message.slice(0, 100));
  }
}
fs.writeFileSync(path.join(__dirname, '..', '_qc', 'verify-results.json'), JSON.stringify(results, null, 2), 'utf8');
const passed = results.filter(r => r.all_pass).length;
console.log(`\n=== verify: ${passed}/${results.length} ALL PASS ===`);
