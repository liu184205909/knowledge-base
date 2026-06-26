/**
 * 替换已上传分屏图 → AI 图（补生完成后跑）
 * 读 _wp-post-map.json(slug→id) ∩ _regen-image-slugs.json(121分屏) = 已上传分屏篇
 * 每篇：重传3新AI图 + 更新post(featured_media + content 嵌入新crystal_pair/how_to_use图)
 * 用法：node scripts/replace-images.js --slug=moonstone-and-pyrite  # 单篇测试
 *       node scripts/replace-images.js                              # 全部已上传分屏篇
 * 需 socks5 + disableSandbox + 补生已完成(图就绪)
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
const AUTH = '-u "' + U + ':' + P + '"';
const PROXY = '--proxy socks5://127.0.0.1:10808';
const ROOT = path.resolve(__dirname, '../../..'); // 01-疗愈水晶/
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

const map = JSON.parse(fs.readFileSync(path.join(__dirname, '_wp-post-map.json'), 'utf8'));
const regen = JSON.parse(fs.readFileSync(path.join(__dirname, '_regen-image-slugs.json'), 'utf8'));
const uploaded = regen.filter(s => map[s]); // 已上传的分屏篇(118)
const slugArg = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
const list = slugArg ? [slugArg] : uploaded;

console.log(`=== 替换 ${list.length} 篇分屏图 → AI 图（已上传 ${uploaded.length} / 121 分屏）===`);

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 100)));
  return { id: j.id, url: j.source_url };
}
function updatePost(id, data) {
  const tmp = path.join(__dirname, '_tmp-rep.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,featured_media,link" --max-time 90', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, fail = 0;
for (const slug of list) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', slug + '.json'), 'utf8'));
    if (!a.images) throw new Error('article 无 images 字段');
    // 1. 重传 3 新 AI 图
    const fImg = uploadMedia(path.join(ROOT, a.images.featured.file), a.images.featured.alt);
    const pImg = uploadMedia(path.join(ROOT, a.images.crystal_pair.file), a.images.crystal_pair.alt);
    const hImg = uploadMedia(path.join(ROOT, a.images.how_to_use.file), a.images.how_to_use.alt);
    // 2. 重建 content（嵌入新 crystal_pair + how_to_use 图）
    let content = a.content;
    content = content.replace(/(<h2>Benefits of)/, '<img src="' + pImg.url + '" alt="' + a.images.crystal_pair.alt + '" style="' + IMG_STYLE + '" loading="lazy">\n$1');
    content = content.replace(/(<h2>How to Use)/, '<img src="' + hImg.url + '" alt="' + a.images.how_to_use.alt + '" style="' + IMG_STYLE + '" loading="lazy">\n$1');
    // 3. 更新 post（featured_media + content）
    const r = updatePost(map[slug].id, {
      content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->',
      featured_media: fImg.id,
    });
    ok++;
    console.log('✅ ' + slug + ' → fm:' + r.featured_media + ' (' + (r.link || '') + ')');
  } catch (e) {
    fail++;
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 80));
  }
}
console.log('\n=== 替换完成: ' + ok + ' OK, ' + fail + ' ERR ===');
