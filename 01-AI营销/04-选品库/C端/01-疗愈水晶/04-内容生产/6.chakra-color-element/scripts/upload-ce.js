/**
 * 上传 chakra/color/element 23篇到 WP(draft)
 * 图: hero(featured) + shade(color)/diagram(element) 嵌content
 * category: chakra=1564 / color=1565 / element=1566
 * rank_math: createPost后调 rankmath/v1/updateMeta
 * 用法：node upload-ce.js --slug=root | (全23篇)
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
const CAT = { chakra: 1564, color: 1565, element: 1566 };
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

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
function slugExists(slug) { // 查重:已上传的跳过(避免slug冲突)
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 15', { encoding: 'utf8' });
    return JSON.parse(r).length > 0;
  } catch (e) { return false; }
}

let ok = 0, fail = 0, skip = 0;
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    // 1. 上传图
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    let shadeImg = null, diagImg = null;
    if (a.images.shade_guide) shadeImg = uploadMedia(path.join(ROOT, a.images.shade_guide.file), a.images.shade_guide.alt);
    if (a.images.diagram) diagImg = uploadMedia(path.join(ROOT, a.images.diagram.file), a.images.diagram.alt);
    // 2. content 嵌图
    let content = a.content;
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    content = content.replace(/(<\/h2>\s*<p>The best crystals)/, '\n' + heroImg + '\n$1'); // hero 在 M1 Quick Answer 段后
    if (shadeImg) content = content.replace(/(<h2>How to Identify)/, '<img src="' + shadeImg.url + '" alt="' + a.images.shade_guide.alt + '" style="' + IMG_STYLE + '" loading="lazy">\n$1');
    if (diagImg) content = content.replace(/(<h2>Understanding the)/, '<img src="' + diagImg.url + '" alt="' + a.images.diagram.alt + '" style="' + IMG_STYLE + '" loading="lazy">\n$1');
    // 3. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT[art.type]], featured_media: hero.id, excerpt: a.excerpt,
    });
    // 4. rank_math
    if (a.rank_math_title) setRankMath(post.id, { rank_math_title: a.rank_math_title, rank_math_description: a.rank_math_description || '', rank_math_focus_keyword: a.rank_math_focus_keyword || '' });
    ok++;
    console.log('✅ ' + art.slug + ' → post:' + post.id);
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 80));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
