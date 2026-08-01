/**
 * crystal-combinations 13篇: 上传 crystal_pair 图嵌入 content
 * 嵌入点: <h2>Can You Wear X and Y Together?</h2> 后
 * featured_media 已全设, 不动
 * 幂等: content 已含 <img 跳过
 * 用法: node embed-combos-images.js --slug=xxx | (全13篇)
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
const IMG_ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated/5.crystal-combinations';
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const statusMap = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, '_combos-intentions-status.json'), 'utf8')).combos;

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 120)));
  return { id: j.id, url: j.source_url };
}
function getPost(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content,featured_media,status" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

const slugs = slugArg ? [slugArg] : Object.keys(statusMap).sort();
let ok = 0, skip = 0, fail = 0;
const report = [];

for (const slug of slugs) {
  const st = statusMap[slug] || {};
  try {
    if (!st.exists) throw new Error('WP无post');
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, slug + '.json'), 'utf8'));
    const cpFile = path.join(IMG_ROOT, slug, slug + '-crystal-pair.webp');
    if (!fs.existsSync(cpFile)) throw new Error('无crystal-pair图');

    const raw = getPost(st.id);
    fs.writeFileSync(path.join(BACKUP_DIR, slug + '.json'), JSON.stringify({ id: st.id, slug, content: raw.content.raw, featured_media: raw.featured_media }, null, 2), 'utf8');
    if (raw.content.raw.includes('<img')) { skip++; report.push({ slug, mode: 'skip_img' }); console.log('⏭ ' + slug + ' (已含img)'); continue; }

    const crystal = uploadMedia(cpFile, a.images.crystal_pair.alt);
    let content = raw.content.raw.replace(/(<h2>Can You Wear [^<]+Together\?<\/h2>)/, '$1\n<img src="' + crystal.url + '" alt="' + a.images.crystal_pair.alt + '" style="' + IMG_STYLE + '" loading="lazy">');
    if (content === raw.content.raw) throw new Error('未匹配到Wear H2');

    updatePost(st.id, { content: '<!-- wp:html -->\n' + content + '\n<!-- /wp:html -->' });
    ok++; report.push({ slug, mode: 'update', id: st.id, crystal_id: crystal.id });
    console.log('✅ ' + slug + ' → post:' + st.id);
  } catch (e) {
    fail++; report.push({ slug, mode: 'error', error: e.message.slice(0, 150) });
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 150));
  }
}
fs.writeFileSync(path.join(SCRIPT_DIR, '_combos-embed-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n=== combos完成: 成功 ' + ok + ', 跳过 ' + skip + ', 失败 ' + fail + ' ===');
