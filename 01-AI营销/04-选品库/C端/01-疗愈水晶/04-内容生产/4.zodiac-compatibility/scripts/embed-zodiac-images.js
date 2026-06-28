/**
 * zodiac-compatibility 补图脚本
 * - 78篇: 上传 crystal_pair(78) + how_to_use(76) 嵌入 content
 * - featured: 仅 virgo-sagittarius(43397缺) 上传; aries-cancer(WP无post) createPost时一起
 * - aries-cancer: createPost 全量(featured+2图+嵌图+rank_math)
 * - 幂等: content 已含 <img 标签则跳过(update路径)
 * - 备份: update前 GET 原始 content 存 _backups/{slug}.json
 * 用法: node embed-zodiac-images.js --slug=aries-aquarius  (单篇验证)
 *       node embed-zodiac-images.js                       (全78篇)
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
const SCRIPT_DIR = __dirname;
const ARTICLES_DIR = path.resolve(SCRIPT_DIR, '..', 'articles');
const BACKUP_DIR = path.join(SCRIPT_DIR, '_backups');
const IMG_ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated/4.zodiac-compatibility';
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
const IMG_STYLE_CP = 'width:100%;border-radius:12px;margin:16px 0;';

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const statusMap = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, '_post-status.json'), 'utf8'));

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 120)));
  return { id: j.id, url: j.source_url };
}
function getPostContent(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content,featured_media,status" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,featured_media" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function createPost(data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function setRankMath(id, meta) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-rm.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
}
function ensureCategory(slug, name) {
  let r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/categories?slug=' + slug + '&_fields=id" --max-time 15', { encoding: 'utf8' });
  let arr; try { arr = JSON.parse(r); } catch (e) { arr = []; }
  if (arr.length) return arr[0].id;
  const tmp = path.join(SCRIPT_DIR, '_tmp-cat.json');
  fs.writeFileSync(tmp, JSON.stringify({ name, slug }), 'utf8');
  r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/categories?_fields=id,name" --max-time 30', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  return JSON.parse(r).id;
}

function buildImg(url, alt) {
  return '<img src="' + url + '" alt="' + alt + '" style="' + IMG_STYLE + '" loading="lazy">';
}
function imgPath(slug, kind) {
  // kind: featured / crystal-pair / how-to-use
  return path.join(IMG_ROOT, slug, slug + '-' + kind + '.webp');
}

// === 主流程 ===
const slugs = slugArg
  ? [slugArg]
  : fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')).sort();

let okUp = 0, okCreate = 0, fail = 0, skip = 0;
const report = [];

for (const slug of slugs) {
  const st = statusMap[slug] || {};
  try {
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, slug + '.json'), 'utf8'));
    if (!a.images) throw new Error('无 images 字段');
    const cpFile = imgPath(slug, 'crystal-pair');
    const htFile = imgPath(slug, 'how-to-use');
    const ftFile = imgPath(slug, 'featured');

    // ---- 路径A: WP无post → createPost (aries-cancer) ----
    if (!st.exists) {
      if (!fs.existsSync(ftFile)) throw new Error('无featured图: ' + ftFile);
      const featured = uploadMedia(ftFile, a.images.featured.alt);
      const crystal = fs.existsSync(cpFile) ? uploadMedia(cpFile, a.images.crystal_pair.alt) : null;
      const howto = fs.existsSync(htFile) ? uploadMedia(htFile, a.images.how_to_use.alt) : null;
      let content = a.content;
      if (crystal) {
        content = content.replace(/(<h2>Best Crystal Pair for [^<]+<\/h2>)/, '$1\n' + buildImg(crystal.url, a.images.crystal_pair.alt));
      }
      if (howto) {
        content = content.replace(/(<h2>How to Use the Crystal Pair<\/h2>)/, '$1\n' + buildImg(howto.url, a.images.how_to_use.alt));
      }
      const catId = ensureCategory('zodiac-compatibility', 'Zodiac Compatibility');
      const post = createPost({
        title: a.title, slug,
        content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
        status: 'future', categories: [catId], featured_media: featured.id, excerpt: a.excerpt || '',
      });
      if (a.rank_math_title) setRankMath(post.id, {
        rank_math_title: a.rank_math_title,
        rank_math_description: a.rank_math_description || '',
        rank_math_focus_keyword: a.rank_math_focus_keyword || '',
      });
      okCreate++;
      report.push({ slug, mode: 'create', id: post.id, crystal: !!crystal, howto: !!howto, featured: featured.id });
      console.log('🆕 ' + slug + ' → post:' + post.id + ' [cp:' + (crystal ? 'Y' : 'N') + '/ht:' + (howto ? 'Y' : 'N') + ']');
      continue;
    }

    // ---- 路径B: WP已存在post → update ----
    const id = st.id;
    const raw = getPostContent(id);
    // 备份原始content
    fs.writeFileSync(path.join(BACKUP_DIR, slug + '.json'), JSON.stringify({ id, slug, content: raw.content.raw, featured_media: raw.featured_media, status: raw.status }, null, 2), 'utf8');

    // 幂等: 已含img标签则跳过
    if (raw.content.raw.includes('<img')) {
      skip++;
      report.push({ slug, mode: 'skip_already_img', id });
      console.log('⏭ ' + slug + ' (content已含img,跳过)');
      continue;
    }

    let content = raw.content.raw;
    const update = { content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->' };

    // featured 缺失才上传 (virgo-sagittarius)
    if (!raw.featured_media) {
      if (fs.existsSync(ftFile)) {
        const featured = uploadMedia(ftFile, a.images.featured.alt);
        update.featured_media = featured.id;
      }
    }

    // crystal_pair
    let cpUp = false;
    if (fs.existsSync(cpFile)) {
      const crystal = uploadMedia(cpFile, a.images.crystal_pair.alt);
      content = content.replace(/(<h2>Best Crystal Pair for [^<]+<\/h2>)/, '$1\n' + buildImg(crystal.url, a.images.crystal_pair.alt));
      cpUp = true;
    }
    // how_to_use
    let htUp = false;
    if (fs.existsSync(htFile)) {
      const howto = uploadMedia(htFile, a.images.how_to_use.alt);
      content = content.replace(/(<h2>How to Use the Crystal Pair<\/h2>)/, '$1\n' + buildImg(howto.url, a.images.how_to_use.alt));
      htUp = true;
    }
    if (!cpUp && !htUp) {
      skip++;
      report.push({ slug, mode: 'skip_no_img', id });
      console.log('⏭ ' + slug + ' (无本地图可嵌)');
      continue;
    }
    update.content = '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->';
    const res = updatePost(id, update);
    okUp++;
    report.push({ slug, mode: 'update', id, crystal: cpUp, howto: htUp, featured_set: !!update.featured_media });
    console.log('✅ ' + slug + ' → post:' + id + ' [cp:' + (cpUp ? 'Y' : 'N') + '/ht:' + (htUp ? 'Y' : 'N') + '/fm:' + (update.featured_media ? 'set' : '-') + ']');
  } catch (e) {
    fail++;
    report.push({ slug, mode: 'error', error: e.message.slice(0, 150) });
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 150));
  }
}

fs.writeFileSync(path.join(SCRIPT_DIR, '_embed-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n=== zodiac完成: update ' + okUp + ', create ' + okCreate + ', 跳过 ' + skip + ', 失败 ' + fail + ' ===');
