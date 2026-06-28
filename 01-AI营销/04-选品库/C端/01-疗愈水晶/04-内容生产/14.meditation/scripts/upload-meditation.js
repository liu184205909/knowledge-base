/**
 * 上传 Meditation 文章到 WP(draft)
 * 图: hero(featured+顶部) + step(嵌M4分步后)
 * category: meditation(自动查/建)
 * rank_math: createPost 后调 rankmath/v1/updateMeta(objectType=post)
 * Schema: Article + FAQPage + HowTo + BreadcrumbList —— 全量 JSON-LD 手动推送 rank_math_schema
 *   （关键修正：Rank Math 不自动生成 FAQPage/HowTo，全站0篇HowTo验证；angel-numbers/how-to 批次漏推 schema）
 * URL: 根级 /{slug}/ （不带/blog/）
 * Shop CTA: 已在 generate 阶段按 meditation-knowledge crystal_pool.shop_category 预填（3级优先验证过）
 * Cleansing Timer: 决策卡片已在 content 内（双向，工具侧回链见框架§6.2供用户改）
 * 用法：node upload-meditation.js --slug=crystals-for-sleep-meditation | (全9篇)
 * 需 socks5 + disableSandbox
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

// 构建完整 rank_math_schema JSON-LD（Article + FAQPage + HowTo + BreadcrumbList）
function buildSchema(a, postId, heroUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const article = {
    '@context': 'https://schema.org',
    '@graph': []
  };
  const graph = article['@graph'];

  // Article
  graph.push({
    '@type': 'Article',
    '@id': a.url + '#article',
    'headline': a.title,
    'description': a.rank_math_description || '',
    'datePublished': today,
    'dateModified': today,
    'author': { '@type': 'Person', 'name': 'Earthward Team' },
    'image': { '@type': 'ImageObject', 'url': heroUrl || '' },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': a.url }
  });

  // FAQPage（从 faq_schema 生成，答案用填充后的 content 提取）
  const faqEntries = [];
  for (const f of (a.faq_schema || [])) {
    // 从 content 找 <h3>{question}</h3>\n<p>{answer}</p>
    const escQ = f.question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('<h3>' + escQ + '</h3>\\s*<p>([\\s\\S]*?)</p>', 'i');
    const m = (a.content || '').match(re);
    const answer = m ? m[1].replace(/<[^>]+>/g, '').trim() : f.question;
    faqEntries.push({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: answer } });
  }
  if (faqEntries.length) {
    graph.push({ '@type': 'FAQPage', '@id': a.url + '#faqpage', mainEntity: faqEntries });
  }

  // HowTo（从 howto_schema 生成）
  const ht = a.howto_schema;
  if (ht && ht.steps && ht.steps.length) {
    graph.push({
      '@type': 'HowTo',
      '@id': a.url + '#howto',
      'name': ht.name,
      'totalTime': ht.totalTime,
      'step': ht.steps.map((s, i) => ({
        '@type': 'HowToStep',
        'position': i + 1,
        'name': s.name,
        'text': s.text
      })),
      'supply': (ht.supply || []).map(s => ({ '@type': 'HowToSupply', 'name': s }))
    });
  }

  // BreadcrumbList
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': a.url + '#breadcrumb',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://' + SITE + '/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Meditation', 'item': 'https://' + SITE + '/category/meditation/' },
      { '@type': 'ListItem', 'position': 3, 'name': a.h1 }
    ]
  });

  return JSON.stringify(article);
}

const CAT_ID = ensureCategory('meditation', 'Meditation');
console.log('分类 meditation → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
const results = [];
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');

    // 1. 上传图
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    console.log('  hero → ' + hero.id);
    const imgs = {};
    if (a.images.step) {
      imgs.step = uploadMedia(path.join(ROOT, a.images.step.file), a.images.step.alt);
      console.log('  step → ' + imgs.step.id);
    }

    // 2. content 嵌图
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    if (imgs.step) {
      const stepImg = '<img src="' + imgs.step.url + '" alt="' + a.images.step.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      // 嵌 M4 分步流程后（How to ... Steps H2 后的 </ol> 后）
      const m4Match = content.match(/(<h2>How to[^<]*Steps<\/h2>[\s\S]*?<\/ol>)/);
      if (m4Match) {
        content = content.replace(m4Match[0], m4Match[0] + '\n' + stepImg);
      } else {
        // fallback: 嵌第一个 How to H2 后
        content = content.replace(/(<h2>How to[^<]*<\/h2>)/, '$1\n' + stepImg);
      }
    }

    // 3. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });

    // 4. rank_math（TKD + focus keyword + 全量 schema）
    const schemaJson = buildSchema(a, post.id, hero.url);
    const rmMeta = {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
      rank_math_schema: schemaJson,
    };
    setRankMath(post.id, rmMeta);

    console.log('✅ ' + art.slug + ' → post:' + post.id + ' link:' + post.link);
    results.push({ slug: art.slug, id: post.id, link: post.link, status: post.status, hero_id: hero.id, has_schema: true });
    ok++;
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 150));
    results.push({ slug: art.slug, error: e.message.slice(0, 150) });
  }
}
fs.writeFileSync(path.join(__dirname, '..', 'upload-results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
console.log('结果已写入 upload-results.json（供阶段4验证）');
