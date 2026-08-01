/**
 * horoscope 补图(本地图已生成,只上传+嵌入,不生图)
 * - 年运12 + 月运144 = 156 篇 post 全部已存在于 WP
 * - 已完成(跳过): aquarius-2026(44482) + aquarius-april-2026(45323) content 已含 crystal+ritual img
 * - 待处理: 154 篇 (年运11 future + 月运142 future + aquarius-august-2026 publish)
 *
 * 流程(每篇,update路径):
 *   GET content -> 备份 -> 若已含该alt的img则跳过 ->
 *   uploadMedia(crystal) -> 嵌入H2后 -> uploadMedia(ritual) -> 嵌入H2后 -> PUT content
 * - featured_media 已全设,不动
 * - 嵌入格式(对齐线上aquarius-2026): <figure class="wp-block-image size-large"><img src loading=lazy decoding=async /></figure>
 *   紧跟 </h2> 后(单\n分隔)
 *
 * 嵌入点:
 *   年运 crystal_year: <h2>Crystal of the Year: XXX</h2>
 *   年运 ritual      : <h2>Year-Long Crystal Ritual: ...</h2>
 *   月运 crystal_month: <h2>Crystal of the Month: XXX</h2>
 *   月运 ritual      : <h2>Monthly Crystal Ritual</h2>
 *
 * 用法:
 *   node upload-embed-horoscope.js --slug=aquarius-august-2026   (单篇验证)
 *   node upload-embed-horoscope.js --scope=yearly                 (仅年运)
 *   node upload-embed-horoscope.js --scope=monthly                (仅月运)
 *   node upload-embed-horoscope.js                                (全部154篇)
 * 需 socks5 + disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

// 强制覆盖 shell 错误 env (memory: shell-envkey-override-loadenv)
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';

const SCRIPT_DIR = __dirname;
const KB = 'D:/Code/knowledge-base';
const YEARLY_ART = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/7.zodiac-yearly-horoscope/articles');
const MONTHLY_ART = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/articles');
const IMG_ROOT = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated');
const BACKUP_DIR = path.join(SCRIPT_DIR, '_backups_embed');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// slug -> {id, status, scope} 字典(从已拉的 _wp_mon.json/_wp_yr.json 读)
function loadSlugMap() {
  const map = {};
  const monDir = path.join(SCRIPT_DIR, '_wp_mon.json');
  const yrDir = path.join(SCRIPT_DIR, '_wp_yr.json');
  // 月运脚本目录就在 scripts/ 下, _wp_mon.json 已生成在 scripts/ 父级? 实际生成在 8.zodiac-monthly-horoscope/
  const monCandidates = [monDir, path.join(SCRIPT_DIR, '_wp_mon.json')];
  // 上面生成在 8.zodiac-monthly-horoscope/ 根, scripts 是子目录, 所以回上一层
  const monRoot = path.join(SCRIPT_DIR, '..', '_wp_mon.json');
  const yrRoot = path.join(SCRIPT_DIR, '..', '_wp_yr.json');
  if (fs.existsSync(monRoot)) {
    for (const p of JSON.parse(fs.readFileSync(monRoot, 'utf8'))) map[p.slug] = { id: p.id, status: p.status, scope: 'monthly' };
  }
  if (fs.existsSync(yrRoot)) {
    for (const p of JSON.parse(fs.readFileSync(yrRoot, 'utf8'))) map[p.slug] = { id: p.id, status: p.status, scope: 'yearly' };
  }
  return map;
}

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt.replace(/"/g, '') + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 120', { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 150)));
  return { id: j.id, url: j.source_url };
}
function getPostContent(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content,featured_media,status,slug" --max-time 40', { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-up.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,modified" --max-time 120', { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function buildFigure(url, alt) {
  const a = (alt || '').replace(/"/g, '&quot;');
  return '<figure class="wp-block-image size-large"><img src="' + url + '" alt="' + a + '" loading="lazy" decoding="async" /></figure>';
}
function imgPath(slug, kind) {
  // kind: featured / crystal-year / crystal-month / ritual
  const scope = /-(january|february|march|april|may|june|july|august|september|october|november|december)-/.test(slug) ? 'monthly' : 'yearly';
  const sub = scope === 'yearly' ? '7.zodiac-yearly-horoscope' : '8.zodiac-monthly-horoscope';
  return path.join(IMG_ROOT, sub, slug, slug + '-' + kind + '.webp');
}
// 在 H2 </h2> 后插入 figure(紧跟, 单\n分隔, 对齐线上格式)
function insertAfterH2(content, h2Regex, figure) {
  const m = content.match(h2Regex);
  if (!m) return null;
  const endIdx = m.index + m[0].length;
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  // after 通常以 \n 开头(线上格式 </h2>\n<figure>)
  const nlMatch = after.match(/^\n+/);
  const sep = nlMatch ? nlMatch[0] : '\n';
  return before + sep + figure + after.slice(sep.length);
}

// === 主流程 ===
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const scopeArg = args.find(a => a.startsWith('--scope='))?.split('=')[1];

const slugMap = loadSlugMap();
// 取本地 json 列表(决定 scope + 文件存在性)
const tasks = [];
function collect(artDir, scope) {
  if (!fs.existsSync(artDir)) return;
  for (const f of fs.readdirSync(artDir).filter(f => f.endsWith('.json'))) {
    const slug = f.replace('.json', '');
    const meta = slugMap[slug];
    if (!meta) continue; // WP 无 post 跳过(理论上不存在,因为156全建)
    tasks.push({ slug, scope, artPath: path.join(artDir, f), ...meta });
  }
}
if (!scopeArg || scopeArg === 'yearly') collect(YEARLY_ART, 'yearly');
if (!scopeArg || scopeArg === 'monthly') collect(MONTHLY_ART, 'monthly');

const list = slugArg ? tasks.filter(t => t.slug === slugArg) : tasks;

let okUp = 0, skip = 0, fail = 0, skipAlready = 0;
const report = [];

for (const t of list) {
  try {
    const a = JSON.parse(fs.readFileSync(t.artPath, 'utf8'));
    if (!a.images) throw new Error('无 images 字段');
    const isYearly = t.scope === 'yearly';
    const crystalKey = isYearly ? 'crystal_year' : 'crystal_month';
    const cImg = a.images[crystalKey], rImg = a.images.ritual;
    if (!cImg || !rImg) throw new Error('缺 images.' + crystalKey + ' 或 images.ritual');

    const cFile = imgPath(t.slug, isYearly ? 'crystal-year' : 'crystal-month');
    const rFile = imgPath(t.slug, 'ritual');
    if (!fs.existsSync(cFile)) throw new Error('图缺失: ' + cFile);
    if (!fs.existsSync(rFile)) throw new Error('图缺失: ' + rFile);

    const raw = getPostContent(t.id);
    let content = raw.content.raw || '';

    // 备份
    fs.writeFileSync(path.join(BACKUP_DIR, t.slug + '.json'), JSON.stringify({ id: t.id, slug: t.slug, content, featured_media: raw.featured_media, status: raw.status }, null, 2), 'utf8');

    // 幂等: 已含 crystal alt 字符串则跳过(认为已嵌)
    const cAltKey = cImg.alt.slice(0, 30);
    const rAltKey = rImg.alt.slice(0, 30);
    if (content.includes(cAltKey) && content.includes(rAltKey)) {
      skipAlready++;
      report.push({ slug: t.slug, mode: 'skip_already', id: t.id });
      console.log('⏭ ' + t.slug + ' (已含crystal+ritual img)');
      continue;
    }

    // 上传 crystal
    const crystal = uploadMedia(cFile, cImg.alt);
    const cFig = buildFigure(crystal.url, cImg.alt);
    const cRegex = isYearly
      ? /<h2[^>]*>\s*Crystal of the Year[^<]*<\/h2>/
      : /<h2[^>]*>\s*Crystal of the Month[^<]*<\/h2>/;
    let newContent = insertAfterH2(content, cRegex, cFig);
    if (!newContent) throw new Error('crystal H2 未找到');

    // 上传 ritual
    const ritual = uploadMedia(rFile, rImg.alt);
    const rFig = buildFigure(ritual.url, rImg.alt);
    const rRegex = isYearly
      ? /<h2[^>]*>\s*Year-Long Crystal Ritual[^<]*<\/h2>/
      : /<h2[^>]*>\s*Monthly Crystal Ritual[^<]*<\/h2>/;
    newContent = insertAfterH2(newContent, rRegex, rFig);
    if (!newContent) throw new Error('ritual H2 未找到');

    const res = updatePost(t.id, { content: newContent });
    okUp++;
    report.push({ slug: t.slug, mode: 'update', id: t.id, crystal: crystal.id, ritual: ritual.id, modified: res.modified });
    console.log('✅ ' + t.slug + ' → post:' + t.id + ' [c:' + crystal.id + '/r:' + ritual.id + ']');
  } catch (e) {
    fail++;
    report.push({ slug: t.slug, mode: 'error', error: e.message.slice(0, 200) });
    console.log('❌ ' + t.slug + ': ' + e.message.slice(0, 200));
  }
}

fs.writeFileSync(path.join(SCRIPT_DIR, '_embed-horoscope-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n=== horoscope embed完成: update ' + okUp + ', 跳过(已嵌) ' + skipAlready + ', 跳过 ' + skip + ', 失败 ' + fail + ' ===');
