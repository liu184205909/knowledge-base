/**
 * 上传 Numerology 主词页（10篇）到 WP(draft)
 * 适配：根级 slug（/destiny-number/ 非 life-path-）、hero only、schema(ItemList 用 meaning URL，FAQ 从 h3+p 提取)
 * category: numerology(复用 1568)；rank_math: updateMeta；wp:html 块
 * 用法：node upload-mainpages.js [--slug=xxx]   需 socks5 + disableSandbox
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
const ROOT = path.resolve(__dirname, '../../../02-网站规划');
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-merged-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

function ensureCategory(slug, name) {
  let r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/categories?slug=' + slug + '&_fields=id" --max-time 15', { encoding: 'utf8' });
  let arr; try { arr = JSON.parse(r); } catch (e) { arr = []; }
  if (arr.length) return arr[0].id;
  const tmp = path.join(__dirname, '_tmp-cat.json'); fs.writeFileSync(tmp, JSON.stringify({ name, slug }), 'utf8');
  r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/categories?_fields=id,name" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp); const j = JSON.parse(r); if (!j.id) throw new Error('建分类失败: ' + (j.message || r.slice(0, 120))); return j.id;
}
function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r); if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100))); return { id: j.id, url: j.source_url };
}
function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-up.json'); fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp); return JSON.parse(r);
}
function setRankMath(id, meta) {
  const tmp = path.join(__dirname, '_tmp-rm.json'); fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' }); fs.unlinkSync(tmp);
}
function slugExists(slug) { try { const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' }); return JSON.parse(r).length > 0; } catch (e) { return false; } }

function buildSchema(a) {
  const url = 'https://' + SITE + a.url; const schemas = [];
  schemas.push({ "@context": "https://schema.org", "@type": "Article", "headline": a.title, "mainEntityOfPage": { "@type": "WebPage", "@id": url }, "description": a.rank_math_description, "url": url, "author": { "@type": "Organization", "name": "Earthward" }, "publisher": { "@type": "Organization", "name": "Earthward" } });
  // FAQPage: 从 <h3>Q</h3><p>A</p> 提取
  const faqM = [...a.content.matchAll(/<h3>([^<]+\?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];
  if (faqM.length) schemas.push({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqM.map(m => ({ "@type": "Question", "name": m[1].trim(), "acceptedAnswer": { "@type": "Answer", "text": m[2].replace(/<[^>]+>/g, '').trim() } })) });
  // ItemList: crystals slug 数组 → meaning URL
  const items = (a.crystals || []).slice(0, 5).map((c, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Article", "name": c, "url": "https://" + SITE + "/" + c + "-meaning/" } }));
  if (items.length) schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": items });
  schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" }, { "@type": "ListItem", "position": 2, "name": "Merged Lines", "item": "https://" + SITE + "/merged-lines/" }, { "@type": "ListItem", "position": 3, "name": a.title.replace(/:.*/, ''), "item": url }] });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}

const CAT_ID = ensureCategory('merged-lines', 'Merged Lines');
console.log('分类 numerology → ' + CAT_ID + '\n');
let ok = 0, fail = 0, skip = 0;
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-merged', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    const schemaHtml = buildSchema(a).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;
    const post = createPost({ title: a.title, slug: art.slug, content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->', status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '' });
    if (a.rank_math_title) setRankMath(post.id, { rank_math_title: a.rank_math_title, rank_math_description: a.rank_math_description || '', rank_math_focus_keyword: a.rank_math_focus_keyword || '' });
    ok++; console.log('✅ ' + art.slug + ' → post:' + post.id + ' (media:' + hero.id + ')');
  } catch (e) { fail++; console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 120)); }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
