/**
 * 上传 Numerology 12篇到 WP(draft)
 * 图: hero(featured+嵌content顶部) + calculation diagram(M2后嵌一次,12篇复用同图但每篇单独上传因featured需media id)
 * category: numerology(自动查/建)
 * rank_math: createPost后调 rankmath/v1/updateMeta
 * schema: Article + FAQPage + BreadcrumbList + ItemList(指meaning页,禁Product) 写入 rank_math schema 或 content
 * URL: /life-path-{slug}/（根级，无 /numerology/ 前缀，site-url-rule-post-vs-category-archive）
 * Shop CTA 已预验证(全用/shop/?s= 搜索页200), 计算器CTA降级到/numerology/how-to-calculate/(文章内M2段,不死链)
 * 用法：node upload-numerology.js --slug=1 | (全12篇)
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
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
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
function slugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}

// 构建 schema JSON-LD
function buildSchema(a) {
  const url = 'https://' + SITE + a.url;
  const schemas = [];
  // Article
  schemas.push({
    "@context": "https://schema.org", "@type": "Article",
    "headline": a.title, "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "description": a.rank_math_description, "url": url,
    "author": { "@type": "Organization", "name": "Earthward" },
    "publisher": { "@type": "Organization", "name": "Earthward" },
  });
  // FAQPage (从 content 提取 details)
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
  // ItemList (M6 水晶, 指meaning页, 禁Product)
  const itemListElements = [];
  for (const [role, c] of Object.entries(a.crystals)) {
    if (c.meaning_cta === 'INCLUDE' && c.meaning_url) {
      itemListElements.push({
        "@type": "ListItem",
        "position": itemListElements.length + 1,
        "item": {
          "@type": "Article", "name": c.name + " for Life Path " + a.number,
          "description": c.reason, "url": "https://" + SITE + c.meaning_url
        }
      });
    }
  }
  if (itemListElements.length) {
    schemas.push({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": itemListElements });
  }
  // BreadcrumbList
  schemas.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://" + SITE + "/" },
      { "@type": "ListItem", "position": 2, "name": "Numerology", "item": "https://" + SITE + "/numerology/" },
      { "@type": "ListItem", "position": 3, "name": "Life Path " + a.number, "item": url },
    ]
  });
  return schemas.map(s => JSON.stringify(s)).join('\n');
}

const CAT_ID = ensureCategory('numerology', 'Numerology');
console.log('分类 numerology → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
for (const art of list) {
  if (!slugArg && slugExists('life-path-' + art.slug)) { console.log('⏭ life-path-' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');
    // 1. 上传图
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    let calcImg = null;
    if (a.images.calculation) calcImg = uploadMedia(path.join(ROOT, a.images.calculation.file), a.images.calculation.alt);
    // 2. content 嵌图: hero(顶部) + calculation(M2后)
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    if (calcImg) {
      const cImg = '<img src="' + calcImg.url + '" alt="' + a.images.calculation.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      content = content.replace(/(<h2>How to Calculate Your Life Path Number<\/h2>)/, '$1\n' + cImg);
    }
    // 3. schema 嵌入 (JSON-LD script tags)
    const schemaHtml = buildSchema(a).split('\n').map(s => '<script type="application/ld+json">\n' + s + '\n</script>').join('\n');
    content += '\n\n' + schemaHtml;
    // 4. createPost (slug = life-path-{slug})
    const post = createPost({
      title: a.title, slug: 'life-path-' + art.slug,
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
    console.log('✅ life-path-' + art.slug + ' → post:' + post.id + ' (' + hero.id + (calcImg ? ',' + calcImg.id : '') + ')');
  } catch (e) {
    fail++;
    console.log('❌ life-path-' + art.slug + ': ' + e.message.slice(0, 120));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
