/**
 * 上传 Chinese Zodiac 文章到 WP(draft)
 * 图: hero(featured+顶部) + animal(嵌M2事实表后) + lucky_stone(嵌M3 lucky H3后)
 * category: chinese-zodiac(自动查/建)
 * rank_math: createPost 后调 rankmath/v1/updateMeta(objectType=post)
 * Schema: Article + FAQPage + BreadcrumbList(Rank Math schema 字段)
 * slug 唯一检查（slugExists 防重复）
 * 用法：node upload-chinese-zodiac.js --slug=dragon-crystals
 * 需 socks5 + disableSandbox
 * 参考：10.how-to/scripts/upload-how-to.js
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

// 从 content 提取 FAQ（<details>）构 FAQPage schema
function buildFAQSchema(content) {
  const faqs = [];
  const re = /<details><summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    let ans = m[2].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    faqs.push({ '@type': 'Question', name: m[1].trim(), acceptedAnswer: { '@type': 'Answer', text: ans } });
  }
  return faqs.length ? faqs : null;
}

const CAT_ID = ensureCategory('chinese-zodiac', 'Chinese Zodiac');
console.log('分类 chinese-zodiac → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');
    const heroFile = path.join(ROOT, a.images.hero.file);
    if (!fs.existsSync(heroFile)) throw new Error('hero 图文件不存在: ' + a.images.hero.file);

    // 1. 上传所有图
    const hero = uploadMedia(heroFile, a.images.hero.alt);
    console.log('  hero → ' + hero.id);
    const imgs = {};
    for (const key of ['animal', 'lucky_stone']) {
      if (a.images[key]) {
        const f = path.join(ROOT, a.images[key].file);
        if (fs.existsSync(f)) {
          imgs[key] = uploadMedia(f, a.images[key].alt);
          console.log('  ' + key + ' → ' + imgs[key].id);
        }
      }
    }

    // 2. content 嵌图
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    const mkImg = (k) => '<img src="' + imgs[k].url + '" alt="' + a.images[k].alt + '" style="' + IMG_STYLE + '" loading="lazy">';

    // animal 图嵌 M2 事实表后（<table>...</table> 后第一个 <p>）
    if (imgs.animal) {
      const imgTag = mkImg('animal');
      // 嵌在 M2 H2 内第一个 </table> 后
      content = content.replace(/(<\/table>\s*<p>)/, '</table>\n' + imgTag + '\n<p>');
    }
    // lucky_stone 图嵌 M3 第一个 H3（Lucky Stone）后第一个 </p>
    if (imgs.lucky_stone) {
      const imgTag = mkImg('lucky_stone');
      // 匹配 "Lucky Stone" H3 后到第二个 </p>（sub + 段落）
      const re = /(<h3>[^<]*Lucky Stone[^<]*<\/h3>\s*<p><em>[^<]*<\/em><\/p>\s*<p>[\s\S]*?<\/p>)/;
      if (re.test(content)) {
        content = content.replace(re, '$1\n' + imgTag);
      } else {
        // fallback: M3 第一个 H3 后
        content = content.replace(/(<h3>[^<]+<\/h3>\s*<p>[\s\S]*?<\/p>)/, '$1\n' + imgTag);
      }
    }

    // 3. Schema（FAQPage）
    const faqs = buildFAQSchema(content);
    const schema = {};
    if (faqs) {
      schema['faq-schema'] = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs
      });
    }

    // 4. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });

    // 5. rank_math（TKD + focus keyword + schema）
    const rmMeta = {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    };
    // FAQ schema 写入 rank_math schema 字段（how-to 同款机制）
    if (schema['faq-schema']) {
      rmMeta['rank_math_schema'] = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Article', headline: a.title, description: (a.rank_math_description || '').slice(0, 160), author: { '@type': 'Organization', name: 'Earthward' } },
          { '@type': 'FAQPage', mainEntity: faqs },
          { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Chinese Zodiac', item: 'https://' + SITE + '/category/chinese-zodiac/' },
            { '@type': 'ListItem', position: 2, name: a.title, item: 'https://' + SITE + a.url },
          ] },
        ]
      });
    }
    setRankMath(post.id, rmMeta);

    console.log('✅ ' + art.slug + ' → post:' + post.id + ' link:' + post.link);
    ok++;
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 200));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
