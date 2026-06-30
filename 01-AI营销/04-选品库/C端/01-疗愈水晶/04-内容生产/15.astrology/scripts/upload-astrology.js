/**
 * 上传 Astrology 文章到 WP(draft)
 * 图: hero(featured+嵌content顶部) + diagram(M4水晶段后嵌)
 * category: astrology-events (子分类, parent=astrology; 自动查/建)
 * rank_math: createPost后调 rankmath/v1/updateMeta
 * schema: Article + FAQPage(从<h3>FAQ提取) + BreadcrumbList + ItemList(指meaning页,禁Product)
 * URL: /crystals-for-{event-slug}/ + Hub /crystals-for-astrology-events/
 * Shop CTA 已预验证(_cta-by-slug.json 三级降级)
 * 用法：node upload-astrology.js --slug=mercury-retrograde | (全7篇)
 * 需 socks5 + disableSandbox
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
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

function ensureCategory(slug, name, parentId) {
  let r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/categories?slug=' + slug + '&_fields=id,parent" --max-time 15', { encoding: 'utf8' });
  let arr; try { arr = JSON.parse(r); } catch (e) { arr = []; }
  if (arr.length) return arr[0].id;
  const tmp = path.join(__dirname, '_tmp-cat.json');
  const payload = parentId ? { name, slug, parent: parentId } : { name, slug };
  fs.writeFileSync(tmp, JSON.stringify(payload), 'utf8');
  r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/categories?_fields=id,name" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  const j = JSON.parse(r);
  if (!j.id) throw new Error('cat fail: ' + (j.message || r.slice(0, 120)));
  console.log('category ' + name + ' -> ' + j.id);
  return j.id;
}
function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 180', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}
function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function setRankMath(id, meta) {
  const tmp = path.join(__dirname, '_tmp-rm.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  return r;
}
function postSlugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}
function findPostId(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    const arr = JSON.parse(r); return arr.length ? arr[0].id : null;
  } catch (e) { return null; }
}
function updatePost(id, data) {
  const tmp = path.join(__dirname, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function deletePost(id) {
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X DELETE "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?force=true" --max-time 30', { encoding: 'utf8' });
}

// schema：FAQ 从 <h3>问题</h3><p>答案</p> 提取（M10 段）
function buildSchema(a) {
  const url = 'https://' + SITE + a.url;
  const schemas = [];
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": a.title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": a.rank_math_description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });
  // FAQPage：从 M10 FAQ 段的 <h3>Q</h3><p>A</p> 提取
  const faqSection = (a.content.match(/<h2>Frequently Asked Questions[\s\S]*?(?=<h2>|$)/i) || [''])[0];
  const faqPairs = [];
  const h3s = [...faqSection.matchAll(/<h3>([^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];
  for (const m of h3s) {
    faqPairs.push({ q: m[1].trim(), a: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  if (faqPairs.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": faqPairs.map(p => ({
        "@type": "Question", "name": p.q,
        "acceptedAnswer": { "@type": "Answer", "text": p.a }
      }))
    });
  }
  // ItemList（M4 水晶 meaning_cta=INCLUDE 指meaning页）
  const itemListElements = [];
  if (a.crystals) {
    let pos = 0;
    for (const [role, c] of Object.entries(a.crystals)) {
      if (c.meaning_cta === 'INCLUDE' && c.meaning_url) {
        pos++;
        itemListElements.push({
          "@type": "ListItem", "position": pos,
          "item": { "@type": "Article", "name": c.name + (a.name ? ' for ' + a.name : ''), "description": (c.reason || '').slice(0, 200), "url": "https://" + SITE + c.meaning_url }
        });
      }
    }
  }
  if (itemListElements.length) schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": itemListElements });
  // BreadcrumbList
  schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" },
    { "@type": "ListItem", "position": 2, "name": "Astrology", "item": "https://" + SITE + "/crystals-for-astrology-events/" },
    { "@type": "ListItem", "position": 3, "name": a.name || a.title, "item": url },
  ]});
  return schemas.map(s => JSON.stringify(s)).join('\n');
}

const PARENT_CAT = ensureCategory('astrology', 'Astrology');
const CAT_ID = ensureCategory('astrology-events', 'Astrology Events', PARENT_CAT);
console.log('parent astrology -> ' + PARENT_CAT + ' | category astrology-events -> ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
const results = [];
for (const art of list) {
  // post slug：url 是 /crystals-for-{slug}/ → post slug = art.slug（已是 crystals-for-xxx 形式 for hub；event slug 是 mercury-retrograde 需加前缀）
  const postSlug = art.line === 'hub' ? art.slug : 'crystals-for-' + art.slug;
  const existingId = findPostId(postSlug);
  if (existingId) {
    // 已存在 → 删除后重建（content/schema 已更新，重建比 patch 干净）
    if (!slugArg) { console.log('skip ' + postSlug + ' (exists, no --slug)'); skip++; continue; }
    console.log('delete old ' + postSlug + ' (' + existingId + ') for re-upload');
    deletePost(existingId);
  }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('no hero image');
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    let diagramImg = null;
    if (a.images.diagram) diagramImg = uploadMedia(path.join(ROOT, a.images.diagram.file), a.images.diagram.alt);
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    if (diagramImg) {
      const dImg = '<img src="' + diagramImg.url + '" alt="' + a.images.diagram.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      content = content.replace(/(<h2>Best Crystals for[^<]*<\/h2>)/, '$1\n' + dImg);
    }
    const schemaHtml = buildSchema(a).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;
    const post = createPost({
      title: a.title, slug: postSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });
    let rmRes = '';
    if (a.rank_math_title) rmRes = setRankMath(post.id, {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    });
    ok++;
    results.push({ slug: art.slug, postSlug, id: post.id, link: post.link, hero: hero.id, diagram: diagramImg ? diagramImg.id : null, rankmath_ok: rmRes.includes('success') || rmRes.length > 0, status: 'ok' });
    console.log('OK ' + postSlug + ' -> post:' + post.id + ' (hero:' + hero.id + (diagramImg ? ',diagram:' + diagramImg.id : '') + ')');
  } catch (e) {
    fail++;
    results.push({ slug: art.slug, postSlug, error: e.message.slice(0, 200), status: 'fail' });
    console.log('FAIL ' + postSlug + ': ' + e.message.slice(0, 200));
  }
}
fs.writeFileSync(path.join(__dirname, '..', '_qc', 'upload-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\n=== upload done: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' skip ===');
