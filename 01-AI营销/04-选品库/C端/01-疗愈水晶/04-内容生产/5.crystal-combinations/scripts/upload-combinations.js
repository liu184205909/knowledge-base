/**
 * 上传水晶配对文章到 WP（post + category 1563 + 3 图 + content 嵌入图）
 * 用法：node scripts/upload-combinations.js --slug=amethyst-and-selenite  # 单篇测试
 *       node scripts/upload-combinations.js                                  # 全 207 篇
 * 需 socks5 代理 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

// ~/.env
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"';
const PROXY = '--proxy socks5://127.0.0.1:10808';
const CAT_ID = 1563;
const ROOT = path.resolve(__dirname, '../../..'); // 01-疗愈水晶/

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const sel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'selected-articles.json'), 'utf8'));
const list = slugArg ? sel.articles.filter(a => a.slug === slugArg) : sel.articles.filter(a => a.slug !== 'amethyst-and-selenite');

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media upload failed: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}

function createPost(data) {
  const tmp = path.join(__dirname, '_tmp-post.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts?_fields=id,slug,link,status" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, fail = 0;
for (const art of list) {
  try {
    const artPath = path.join(__dirname, '..', 'articles', art.slug + '.json');
    const a = JSON.parse(fs.readFileSync(artPath, 'utf8'));

    // 1. 上传 3 图
    const fFile = path.join(ROOT, a.images.featured.file);
    const pFile = path.join(ROOT, a.images.crystal_pair.file);
    const hFile = path.join(ROOT, a.images.how_to_use.file);
    const fImg = uploadMedia(fFile, a.images.featured.alt);
    const pImg = uploadMedia(pFile, a.images.crystal_pair.alt);
    const hImg = uploadMedia(hFile, a.images.how_to_use.alt);

    // 2. content 嵌入 pair + how_to_use 图
    let content = a.content;
    content = content.replace(/(<h2>Benefits of)/, '<img src="' + pImg.url + '" alt="' + a.images.crystal_pair.alt + '" style="width:100%;border-radius:12px;margin:16px 0;" loading="lazy">\n$1');
    content = content.replace(/(<h2>How to Use)/, '<img src="' + hImg.url + '" alt="' + a.images.how_to_use.alt + '" style="width:100%;border-radius:12px;margin:16px 0;" loading="lazy">\n$1');

    // 3. 创建 post
    const post = createPost({
      title: a.title,
      slug: art.slug,
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      status: 'draft',
      categories: [CAT_ID],
      featured_media: fImg.id,
      excerpt: a.excerpt,
    });

    ok++;
    console.log('✅ ' + art.slug + ' → post:' + post.id + ' (' + (post.link || '') + ')');
  } catch (e) {
    fail++;
    console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 80));
  }
}

console.log('\n=== 上传完成: ' + ok + ' 成功, ' + fail + ' 失败 ===');
