/**
 * zodiac-compatibility 2篇补嵌 how-to-use 图（P1补生闭环）
 * taurus-capricorn(43384) + virgo-sagittarius(43397)：已嵌crystal-pair，缺how-to-use
 * 新图已补生到 generated/4.zodiac-compatibility/{slug}/{slug}-how-to-use.webp
 * 流程：GET→备份→上传how-to-use→嵌 How to Use H2后→PUT
 * 幂等：How to Use H2后已有img则跳过
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
const BACKUP_DIR = path.join(SCRIPT_DIR, '_backups_ht2');
const IMG_ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated/4.zodiac-compatibility';
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const TARGETS = [
  { id: 43384, slug: 'taurus-capricorn' },
  { id: 43397, slug: 'virgo-sagittarius' },
];

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 150)));
  return { id: j.id, url: j.source_url };
}
function getPost(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content" --max-time 40', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-ht2.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status" --max-time 120', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, skip = 0, fail = 0;
for (const t of TARGETS) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, t.slug + '.json'), 'utf8'));
    const htFile = path.join(IMG_ROOT, t.slug, t.slug + '-how-to-use.webp');
    if (!fs.existsSync(htFile)) throw new Error('无how-to-use本地图: ' + htFile);
    const raw = getPost(t.id);
    const content = raw.content.raw;
    fs.writeFileSync(path.join(BACKUP_DIR, t.slug + '.json'), JSON.stringify({ id: t.id, slug: t.slug, content }, null, 2), 'utf8');
    // 检查 How to Use H2 后是否已有 img
    const m = content.match(/<h2[^>]*>How to Use[^<]*<\/h2>([\s\S]*?)(<h2\b|$)/i);
    if (!m) throw new Error('未匹配 How to Use H2');
    if (/<img\b/i.test(m[1])) { skip++; console.log('SKIP ' + t.slug + ' (已有how-to-use img)'); continue; }
    const alt = a.images.how_to_use.alt;
    const up = uploadMedia(htFile, alt);
    const imgTag = '<img src="' + up.url + '" alt="' + alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    const newContent = content.replace(/(<h2[^>]*>How to Use[^<]*<\/h2>)/i, '$1\n' + imgTag);
    if (newContent === content) throw new Error('替换失败');
    updatePost(t.id, { content: '<!-- wp:html -->\n' + newContent + '\n<!-- /wp:html -->' });
    ok++; console.log('OK ' + t.slug + ' -> post:' + t.id + ' media:' + up.id);
  } catch (e) {
    fail++; console.log('FAIL ' + t.slug + ': ' + e.message.slice(0, 200));
  }
}
console.log('\n=== 完成 ok=' + ok + ' skip=' + skip + ' fail=' + fail + ' ===');