/**
 * 上传 How-to 文章到 WP(draft)
 * 图: hero(featured+顶部) + moonlight/selenite/smoke(分步嵌M3) + jewelry(嵌M6)
 * category: how-to(自动查/建)
 * rank_math: createPost 后调 rankmath/v1/updateMeta(objectType=post)
 * Schema: Article + FAQPage + HowTo + BreadcrumbList(Rank Math schema 字段)
 * 用法：node upload-how-to.js --slug=how-to-cleanse-crystals
 * 需 socks5 + disableSandbox
 * 参考：9.angel-numbers/scripts/upload-angel-numbers.js
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
for (const art of list) {
  if (!slugArg && slugExists(art.slug)) { console.log('⏭ ' + art.slug + ' (已存在,跳过)'); skip++; continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', art.slug + '.json'), 'utf8'));
    if (!a.images || !a.images.hero) throw new Error('无 hero 图');

    // 1. 上传所有图（hero + 各篇 step 图 key + jewelry）
    const hero = uploadMedia(path.join(ROOT, a.images.hero.file), a.images.hero.alt);
    console.log('  hero → ' + hero.id);
    const imgs = {};
    // 支持所有可能的 step 图 key（H1: moonlight/selenite/smoke; H2: moonlight; H3: moonlight; H4: intention; H5: chakra; H6: care; H7: materials）
    for (const key of ['moonlight', 'selenite', 'smoke', 'intention', 'chakra', 'care', 'materials', 'jewelry']) {
      if (a.images[key]) {
        imgs[key] = uploadMedia(path.join(ROOT, a.images[key].file), a.images[key].alt);
        console.log('  ' + key + ' → ' + imgs[key].id);
      }
    }

    // 2. content 嵌图
    const heroImg = '<img src="' + hero.url + '" alt="' + a.images.hero.alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    let content = heroImg + '\n' + a.content;

    const mkImg = (k) => '<img src="' + imgs[k].url + '" alt="' + a.images[k].alt + '" style="' + IMG_STYLE + '" loading="lazy">';

    // H1 专用精确嵌图（moonlight/selenite/smoke 嵌对应方法卡后）
    const isH1 = art.slug === 'how-to-cleanse-crystals';
    if (isH1 && imgs.moonlight) {
      content = content.replace(/(<h3>🌙 Moonlight<\/h3>[\s\S]*?<p><strong>How long:<\/strong> Overnight \(8\+ hours\)<\/p>)/, '$1\n' + mkImg('moonlight'));
    }
    if (isH1 && imgs.selenite) {
      content = content.replace(/(<h3>✨ Selenite Plate \/ Bowl<\/h3>[\s\S]*?<p><strong>How long:<\/strong> 6\+ hours \(or overnight\)<\/p>)/, '$1\n' + mkImg('selenite'));
    }
    if (isH1 && imgs.smoke) {
      content = content.replace(/(<h3>🌿 Smoke \(Sage \/ Palo Santo\)<\/h3>[\s\S]*?<p><strong>How long:<\/strong> 30–60 seconds per stone<\/p>)/, '$1\n' + mkImg('smoke'));
    }

    // H2-H7 通用嵌图：step 图嵌 M3 第一个方法 H3 卡后（第一个 <h3>{icon} 开头后到 How long 结束的块）
    if (!isH1) {
      // 找第一个非概念表的 H3 方法卡（以 emoji 开头的 H3，后跟 How long）
      // step 图 key 优先级：moonlight > intention > chakra > care > materials > selenite > smoke
      const stepKey = ['moonlight', 'intention', 'chakra', 'care', 'materials', 'selenite', 'smoke'].find(k => imgs[k]);
      if (stepKey) {
        const imgTag = mkImg(stepKey);
        // 匹配第一个方法卡：从第一个 <h3>{非cleanse概念}... 到第一个 How long </p>
        // 用宽松匹配：第一个 <h3> 后到第一个 How long </p>
        const matched = content.replace(/(<h3>[^<]+<\/h3>[\s\S]*?<p><strong>How long:[^<]*<\/p>)/, (m) => m + '\n' + imgTag);
        if (matched !== content) content = matched;
        else {
          // fallback: H6 无方法卡(10用法)，H5 有 chakra layout；嵌 M3 第一个 H3 后
          content = content.replace(/(<h3>[^<]+<\/h3>)/, '$1\n' + imgTag);
        }
      }
    }

    // jewelry 图嵌 M6 首饰模块 H2 后（通用：匹配 M6 的 H2，含 Jewelry/Bracelet/Care 关键词）
    if (imgs.jewelry) {
      const imgTag = mkImg('jewelry');
      // 匹配 M6 H2（含 Jewelry 或 Bracelet 或 Care Guide）
      const m6Match = content.match(/<h2>[^<]*(Jewelry|Bracelet|Care Guide|Meditation)[^<]*<\/h2>/);
      if (m6Match) {
        content = content.replace(m6Match[0], m6Match[0] + '\n' + imgTag);
      } else {
        // fallback: 嵌 FAQ H2 前
        content = content.replace(/(<h2>Frequently Asked Questions[^<]*<\/h2>)/, '$1\n' + imgTag);
      }
    }

    // 3. createPost
    const post = createPost({
      title: a.title, slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft', categories: [CAT_ID], featured_media: hero.id, excerpt: a.excerpt || '',
    });

    // 4. rank_math（TKD + focus keyword）
    const rmMeta = {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    };
    setRankMath(post.id, rmMeta);

    console.log('✅ ' + art.slug + ' → post:' + post.id + ' link:' + post.link);
    ok++;
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 150));
  }
}
console.log('\n=== 上传完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 ===');
