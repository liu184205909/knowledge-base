/**
 * 上传天使号码 100篇到 WP(draft)
 * 图: hero 号码视觉化(featured + 嵌content顶部)
 * category: angel-numbers(自动查/建)
 * rank_math: createPost后调 rankmath/v1/updateMeta
 * 用法：node upload-angel-numbers.js --slug=111 | (全100篇)
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
const ROOT = path.resolve(__dirname, '../../../02-网站规划'); // images.file 相对此
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
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}
function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
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

const CAT_ID = ensureCategory('angel-numbers', 'Angel Numbers');
console.log('分类 angel-numbers → ' + CAT_ID + '\n');

let ok = 0, fail = 0, skip = 0;
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');
    // 1. 上传3图（如存在）
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    let crystal = null, numerology = null;
    if (a.images['crystal-grid']) crystal = uploadMedia(path.join(ROOT, a.images['crystal-grid'].file), a.images['crystal-grid'].alt);
    if (a.images.numerology) numerology = uploadMedia(path.join(ROOT, a.images.numerology.file), a.images.numerology.alt);
    // 2. content 嵌图：hero(顶部) + crystal-grid(M6后) + numerology(M3后)
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;
    if (crystal) {
      const cImg = '<img src="' + crystal.url + '" alt="' + a.images['crystal-grid'].alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      content = content.replace(/(<h2>Best Crystals for Angel Number[^<]*<\/h2>)/, '$1\n' + cImg);
    }
    if (numerology) {
      const nImg = '<img src="' + numerology.url + '" alt="' + a.images.numerology.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
      content = content.replace(/(<h2>The Numerology Behind[^<]*<\/h2>)/, '$1\n' + nImg);
    }
    // 3. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });
    // 4. rank_math
    if (a.rank_math_title) setRankMath(post.id, {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    });
    ok++;
    console.log('✅ ' + art.slug + ' → post:' + post.id);
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 100));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
