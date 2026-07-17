/**
 * 更新线上 gift 文章 content（P0 补丁后：Care 段+权威段已加到本地 articles）
 * 复用现有 featured_media（不重传图，从线上 post content 提取 hero img url），POST 更新 content
 * 用法：node update-content.js [--slug=xxx]   需 disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const l of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) { const t = l.trim(); if (!t || t.startsWith('#')) continue; const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim(); }
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const DIR = path.resolve(__dirname, '..', 'articles');
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
const slugArg = process.argv.slice(2).find(a => a.startsWith('--slug='))?.split('=')[1];
const NORM = { 'clear-quartz': 'quartz', 'green-aventurine': 'aventurine', 'green-jade': 'jade', 'tigers-eye': 'tiger-eye' };
function get(p) { return execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + p + '" --max-time 30', { encoding: 'utf8' }); }
function post(id, data) { const tmp = path.join(__dirname, '_tmp-up.json'); fs.writeFileSync(tmp, JSON.stringify(data), 'utf8'); const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }); fs.unlinkSync(tmp); return JSON.parse(r); }
function buildSchema(a) {
  const url = 'https://' + SITE + '/' + a.slug + '/'; const schemas = [];
  schemas.push({ "@context": "https://schema.org", "@type": "Article", "headline": a.title, "mainEntityOfPage": { "@type": "WebPage", "@id": url }, "description": a.rank_math_description, "url": url, "author": { "@type": "Organization", "name": "Earthward" }, "publisher": { "@type": "Organization", "name": "Earthward" } });
  const faqM = [...a.content.matchAll(/<h3>([^<]+\?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];
  if (faqM.length) schemas.push({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqM.map(m => ({ "@type": "Question", "name": m[1].trim(), "acceptedAnswer": { "@type": "Answer", "text": m[2].replace(/<[^>]+>/g, '').trim() } })) });
  const items = (a.crystals || []).slice(0, 6).map((c, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Article", "name": c, "url": "https://" + SITE + "/" + (NORM[c] || c) + "-meaning/" } }));
  if (items.length) schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "name": a.title, "itemListElement": items });
  schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" }, { "@type": "ListItem", "position": 2, "name": "Crystal Gifts", "item": "https://" + SITE + "/category/crystal-gifts/" }, { "@type": "ListItem", "position": 3, "name": a.title.replace(/:.*/, ''), "item": url }] });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;
let ok = 0, fail = 0, nosync = 0;
for (const art of list) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(DIR, art.slug + '.json'), 'utf8'));
    const ps = JSON.parse(get('/wp-json/wp/v2/posts?slug=' + art.slug + '&status=any&_fields=id,content'));
    if (!ps.length) { nosync++; continue; }
    const post0 = ps[0]; const id = post0.id;
    const m = ((post0.content && post0.content.rendered) || '').match(/<img[^>]+src="([^"]+)"/);
    if (!m) { fail++; console.log('❌ ' + art.slug + ': 无现有 hero img'); continue; }
    const heroImg = '<img src="' + m[1] + '" alt="' + (a.images && a.images.hero ? a.images.hero.alt : a.title) + '" style="' + IMG_STYLE + '" loading="lazy">';
    const schemaHtml = buildSchema(a).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    const content = heroImg + '\n' + a.content + '\n\n' + schemaHtml;
    post(id, { content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->' });
    ok++; console.log('✅ ' + art.slug + ' → ' + id);
  } catch (e) { fail++; console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 100)); }
}
console.log('\n=== 更新完成: ' + ok + ' OK, ' + fail + ' ERR, ' + nosync + ' 线上无 ===');
