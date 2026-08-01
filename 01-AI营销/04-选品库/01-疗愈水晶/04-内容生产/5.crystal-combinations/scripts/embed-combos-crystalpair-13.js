/**
 * crystal-combinations 13篇补嵌 crystal_pair 图（P2）
 * 这13篇是早期模板：已嵌1张how-to-use图(在 What Happens If You Combine Them H2后)，
 * 缺 crystal_pair 图(应在 Can You Wear X and Y Together? H2后)
 * 流程：GET content → 备份 → 上传crystal_pair图 → 嵌入H2后(若该H2后无img) → PUT
 * 幂等：Can You Wear H2 后紧跟已有 <img 则跳过该篇
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
const BACKUP_DIR = path.join(SCRIPT_DIR, '_backups_cp13');
const IMG_ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated/5.crystal-combinations';
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// 13篇 id+slug（来自 imgcount 报告）
const TARGETS = [
  { id: 44412, slug: 'tiger-eye-and-larimar' },
  { id: 44416, slug: 'carnelian-and-larimar' },
  { id: 44420, slug: 'moonstone-and-ruby' },
  { id: 44424, slug: 'moonstone-and-pyrite' },
  { id: 44428, slug: 'citrine-and-larimar' },
  { id: 44432, slug: 'opal-and-malachite' },
  { id: 44436, slug: 'larimar-and-pyrite' },
  { id: 44440, slug: 'amethyst-and-carnelian' },
  { id: 44444, slug: 'jade-and-black-tourmaline' },
  { id: 44448, slug: 'rose-quartz-and-obsidian' },
  { id: 44452, slug: 'moonstone-and-citrine' },
  { id: 44456, slug: 'selenite-and-red-jasper' },
  { id: 44460, slug: 'turquoise-and-malachite' },
];

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 150)));
  return { id: j.id, url: j.source_url };
}
function getPost(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content,featured_media,status" --max-time 40', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-cp13.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status" --max-time 120', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

// 检查 Can You Wear H2 后是否紧跟 <img（跳过空白/注释）
function hasImgAfterWearH2(content) {
  const m = content.match(/<h2[^>]*>Can You Wear[^<]*Together\?<\/h2>([\s\S]*?)(<h2\b|$)/i);
  if (!m) return { hasH2: false, hasImg: false };
  const seg = m[1];
  return { hasH2: true, hasImg: /<img\b/i.test(seg) };
}

let ok = 0, skip = 0, fail = 0;
const report = [];

for (const t of TARGETS) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, t.slug + '.json'), 'utf8'));
    const cpFile = path.join(IMG_ROOT, t.slug, t.slug + '-crystal-pair.webp');
    if (!fs.existsSync(cpFile)) throw new Error('无crystal-pair本地图: ' + cpFile);

    const raw = getPost(t.id);
    const content = raw.content.raw;
    // 备份
    fs.writeFileSync(path.join(BACKUP_DIR, t.slug + '.json'), JSON.stringify({ id: t.id, slug: t.slug, content, featured_media: raw.featured_media }, null, 2), 'utf8');

    const chk = hasImgAfterWearH2(content);
    if (!chk.hasH2) throw new Error('未匹配 Can You Wear H2');
    if (chk.hasImg) {
      skip++;
      report.push({ ...t, mode: 'skip_already_cp' });
      console.log('SKIP ' + t.slug + ' (Can You Wear H2后已有img)');
      continue;
    }

    const alt = a.images.crystal_pair.alt;
    const up = uploadMedia(cpFile, alt);
    const imgTag = '<img src="' + up.url + '" alt="' + alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    const newContent = content.replace(/(<h2[^>]*>Can You Wear[^<]*Together\?<\/h2>)/i, '$1\n' + imgTag);
    if (newContent === content) throw new Error('替换失败');

    updatePost(t.id, { content: '<!-- wp:html -->\n' + newContent + '\n<!-- /wp:html -->' });
    ok++;
    report.push({ ...t, mode: 'update', media_id: up.id });
    console.log('OK ' + t.slug + ' -> post:' + t.id + ' media:' + up.id);
  } catch (e) {
    fail++;
    report.push({ ...t, mode: 'error', error: e.message.slice(0, 200) });
    console.log('FAIL ' + t.slug + ': ' + e.message.slice(0, 200));
  }
}
fs.writeFileSync(path.join(SCRIPT_DIR, '_combos-cp13-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n=== 完成 ok=' + ok + ' skip=' + skip + ' fail=' + fail + ' ===');