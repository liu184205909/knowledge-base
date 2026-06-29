/**
 * 上传 Tarot 23篇到 WP(draft)
 * 图: hero(featured+嵌content顶部) + spread(M10后嵌,22 Major有; Hub仅hero)
 * category: tarot(自动查/建)
 * rank_math: createPost后调 rankmath/v1/updateMeta
 * schema: Article + FAQPage + BreadcrumbList + ItemList(指meaning页,禁Product)
 * URL: /tarot-{card-slug}-crystals/ + Hub /crystals-for-tarot-cards/
 * Shop CTA 已预验证(_cta-validation.json 三级降级)
 * 用法：node upload-tarot.js --slug=the-fool | (全23篇)
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

function ensureCategory(slug, name) {
  let r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/categories?slug=' + slug + '&_fields=id" --max-time 15', { encoding: 'utf8' });
  let arr; try { arr = JSON.parse(r); } catch (e) { arr = []; }
  if (arr.length) return arr[0].id;
  const tmp = path.join(__dirname, '_tmp-cat.json');
  fs.writeFileSync(tmp, JSON.stringify({ name, slug }), 'utf8');
  r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/categories?_fields=id,name" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  const j = JSON.parse(r);
  if (!j.id) throw new Error('建分类失败: ' + (j.message || r.slice(0, 120)));
  console.log('📁 创建分类 ' + name + ' → ' + j.id);
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
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
}
function postSlugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}

// 构建 schema JSON-LD（Article + FAQPage + BreadcrumbList + ItemList 指meaning页禁Product）
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
  // FAQPage（从 content details 提取）
  const faqMatches = [...a.content.matchAll(/<details><summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/g)];
  if (faqMatches.length) {
    schemas.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": faqMatches.map(m => ({
        "@type": "Question", "name": m[1].trim(),
        "acceptedAnswer": { "@type": "Answer", "text": m[2].replace(/<[^>]+>/g, '').trim() }
      }))
    });
  }
  // ItemList（M4 水晶，仅 meaning_cta=INCLUDE 的指meaning页；禁Product）
  const itemListElements = [];
  if (a.crystals) {
    let pos = 0;
    for (const [role, c] of Object.entries(a.crystals)) {
      if (c.meaning_cta === 'INCLUDE' && c.meaning_url) {
        pos++;
        itemListElements.push({
          "@type": "ListItem",
          "position": pos,
          "item": {
            "@type": "Article", "name": c.name + (a.name ? ' for ' + a.name : ''),
            "description": (c.reason || '').slice(0, 200), "url": "https://" + SITE + c.meaning_url
          }
        });
      }
    }
  }
  if (itemListElements.length) {
    schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": itemListElements });
  }
  // BreadcrumbList
  const crumbs = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" },
    { "@type": "ListItem", "position": 2, "name": "Tarot", "item": "https://" + SITE + "/crystals-for-tarot-cards/" },
  ];
  if (a.is_hub) {
    crumbs.push({ "@type": "ListItem", "position": 3, "name": "Crystals for Tarot Cards", "item": url });
  } else {
    crumbs.push({ "@type": "ListItem", "position": 3, "name": a.name, "item": url });
  }
  schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}

const CAT_ID = ensureCategory('tarot', 'Tarot');
console.log('分类 tarot → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
const results = [];
for (const art of list) {
  const postSlug = art.is_hub ? 'crystals-for-tarot-cards' : 'tarot-' + art.slug + '-crystals';
  if (!slugArg && postSlugExists(postSlug)) { console.log('⏭ ' + postSlug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');
    // 1. 上传图
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    let spreadImg = null;
    if (a.images.spread) spreadImg = uploadMedia(path.join(ROOT, a.images.spread.file), a.images.spread.alt);
    // 2. content 嵌图: hero 顶部 + spread(M10 Mini Spread 段后)
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    if (spreadImg) {
      const sImg = '<img src="' + spreadImg.url + '" alt="' + a.images.spread.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      content = content.replace(/(<h2>A Mini Crystal Tarot Spread[^<]*<\/h2>)/, '$1\n' + sImg);
    }
    // 3. schema 嵌入
    const schemaHtml = buildSchema(a).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;
    // 4. createPost
    const post = createPost({
      title: a.title, slug: postSlug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });
    // 5. rank_math
    if (a.rank_math_title) setRankMath(post.id, {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    });
    ok++;
    results.push({ slug: art.slug, postSlug, id: post.id, hero: hero.id, spread: spreadImg ? spreadImg.id : null, status: 'ok' });
    console.log('✅ ' + postSlug + ' → post:' + post.id + ' (hero:' + hero.id + (spreadImg ? ',spread:' + spreadImg.id : '') + ')');
  } catch (e) {
    fail++;
    results.push({ slug: art.slug, postSlug, error: e.message.slice(0, 150), status: 'fail' });
    console.log('❌ ' + postSlug + ': ' + e.message.slice(0, 150));
  }
}
fs.writeFileSync(path.join(__dirname, '..', '_qc', 'upload-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
