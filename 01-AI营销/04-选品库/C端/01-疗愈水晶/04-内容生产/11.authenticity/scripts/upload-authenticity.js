/**
 * 上传真伪鉴别文章到 WP (draft)
 * 图: hero(featured+顶部) + comparison(嵌M3/矿物表后) + test(嵌M3首法卡后) + mineral(嵌M3矿物表H3后)
 * category: how-to(1567 复用，已验证) — 真伪鉴别不单建分类，归入 How To
 * rank_math: createPost 后调 rankmath/v1/updateMeta(objectType=post) 写 title/description/focus_keyword
 * Schema: 写 rank_math_schema 字段（Article + FAQPage + BreadcrumbList，含 author/dateModified E-E-A-T）
 * 用法：node upload-authenticity.js --slug=how-to-tell-if-crystal-is-real
 * 需 socks5 + disableSandbox
 * 参考：10.how-to/scripts/upload-how-to.js（补全了 schema 写入，How-to H1遗留未写schema）
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}
function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
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
function slugExists(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}

const CAT_ID = ensureCategory('how-to', 'How To');
console.log('分类 how-to → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
const results = [];
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');

    // 1. 上传所有图
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    console.log('  hero → ' + hero.id);
    const imgs = {};
    for (const key of ['comparison', 'test', 'mineral']) {
      if (a.images[key]) {
        imgs[key] = uploadMedia(path.join(ROOT, a.images[key].file), a.images[key].alt);
        console.log('  ' + key + ' → ' + imgs[key].id);
      }
    }

    // 2. content 嵌图
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    const mkImg = (k) => '<img src="' + imgs[k].url + '" alt="' + a.images[k].alt + '" style="' + IMG_STYLE + '" loading="lazy">';

    // comparison 图嵌矿物数据表后（Mineral Data Reference H3 后的表后）或 M3 末
    if (imgs.comparison) {
      const imgTag = mkImg('comparison');
      // 优先嵌 "Mineral Data Reference" 表后
      const matched = content.replace(/(<\/table>\s*<p><em>Mineral data: GIA)/, '</table>\n' + imgTag + '\n$1');
      if (matched !== content) content = matched;
      else {
        // A2/A3 无矿物表在M3：嵌 M4 第一个石种 H3 前
        const m4match = content.match(/<h2>[^<]*(Deep Dive|Most Faked|Stone-Specific)[^<]*<\/h2>/);
        if (m4match) content = content.replace(m4match[0], m4match[0] + '\n' + imgTag);
        else content = content.replace(/(<h2>When to Use Professional Tools)/, imgTag + '\n$1');
      }
    }
    // test 图嵌 M3 第一个法卡（Test 1）后
    if (imgs.test) {
      const imgTag = mkImg('test');
      const matched = content.replace(/(<p><strong>Best stones for this test:<\/strong>[^<]*<\/p>\s*<p><em>Source:[^<]*<\/em><\/p>)/, '$1\n' + imgTag);
      if (matched !== content) content = matched;
    }
    // mineral 图嵌矿物表 H3 后
    if (imgs.mineral) {
      const imgTag = mkImg('mineral');
      const matched = content.replace(/(<h3>Mineral Data Reference[^<]*<\/h3>)/, '$1\n' + imgTag);
      if (matched !== content) content = matched;
    }

    // 3. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });

    // 4. 构造 Schema（Article + FAQPage + BreadcrumbList，E-E-A-T 强化）
    const schemaGraph = [];
    // Article（含 author/dateModified E-E-A-T；review 信息并 contributor，用标准字段）
    schemaGraph.push({
      '@type': 'Article',
      'headline': a.title,
      'description': a.rank_math_description,
      'author': { '@type': 'Person', 'name': a.author.name, 'jobTitle': a.author.byline },
      'contributor': [{ '@type': 'Person', 'name': a.author.reviewed_by }],
      'datePublished': a.date_published,
      'dateModified': a.date_modified,
      'publisher': { '@type': 'Organization', 'name': 'Earthward', 'logo': { '@type': 'ImageObject', 'url': 'https://' + SITE + '/wp-content/uploads/2024/01/earthward-logo.png' } },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://' + SITE + a.url }
    });
    // FAQPage（从 faq_schema，答案已填充）
    if (a.faq_schema && a.faq_schema.length) {
      schemaGraph.push({
        '@type': 'FAQPage',
        'mainEntity': a.faq_schema.map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.answer_placeholder }
        }))
      });
    }
    // BreadcrumbList
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://' + SITE + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://' + SITE + '/blog/' },
        { '@type': 'ListItem', 'position': 3, 'name': a.h1, 'item': 'https://' + SITE + a.url }
      ]
    });
    const schemaJson = JSON.stringify({ '@graph': schemaGraph });

    // 5. rank_math（TKD + focus keyword + schema）
    const rmMeta = {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
      rank_math_schema: schemaJson,
    };
    setRankMath(post.id, rmMeta);

    // 统计图片数
    const imgCount = (content.match(/<img /g) || []).length;
    console.log('✅ ' + art.slug + ' → post:' + post.id + ' link:' + post.link + ' imgs:' + imgCount);
    results.push({ slug: art.slug, postId: post.id, link: post.link, featuredMedia: hero.id, imgCount });
    ok++;
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 150));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
if (results.length) {
  console.log('\n=== 线上验证清单 ===');
  results.forEach(r => console.log(`  ${r.slug}: post=${r.postId} featured=${r.featuredMedia} imgs=${r.imgCount} link=${r.link}`));
}
