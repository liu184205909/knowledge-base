/**
 * 嵌图到 120 篇 future post（是与否 100 + Minor 20）
 *
 * 策略（牌级复用）：
 *   是与否：每牌 5 篇共用 1 张牌级代表图（generated/yesno/is-{card}-yes-or-no-*.webp 任一）
 *           media 首篇上传记 attachment id，同牌其余 4 篇复用 id 不重传
 *   Minor ：各自 tarot-{slug}-crystals.webp（缺图则跳过）
 *
 * 操作：update future post（featured_media + content 顶部嵌 hero img），原 content 保留
 *   1. GET post → 拿原始 content.raw + id
 *   2. 首篇：uploadMedia → {id,url}；同牌缓存
 *   3. POST /wp/v2/posts/{id} {featured_media:id, content: heroImg + '\n' + 原content}
 *
 * 用法：
 *   node embed-yesno-minor-images.js              (全量：是与否已覆盖牌 + Minor已生)
 *   node embed-yesno-minor-images.js --limit=5    (限流测试)
 *   node embed-yesno-minor-images.js --dry        (只打印不写)
 *   node embed-yesno-minor-images.js --type=yesno (仅是与否)
 *   node embed-yesno-minor-images.js --type=minor (仅Minor)
 *
 * 需 socks5(127.0.0.1:10808) + ~/.env(WP_USER/WP_APP_PASSWORD/WP_SITE)
 * Red line：缺图（moleapi limit）不强生，标记跳过；不破坏原 content（hero 仅前置插入）
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

// ---------- env ----------
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const BASE = path.resolve(__dirname, '..');                        // .../13.tarot/
const YESNO_IMG_DIR = path.join(BASE, 'generated', 'yesno');
const MINOR_IMG_DIR = path.join(BASE, 'generated', 'minor');
const SPREADS_IMG_DIR = path.join(BASE, 'generated', 'spreads');
const BEGINNER_IMG_DIR = path.join(BASE, 'generated', 'beginner');
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

const args = process.argv.slice(2);
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const LIMIT = limitArg ? parseInt(limitArg) : 0;
const DRY = args.includes('--dry');
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

// ---------- 派生牌级代表图映射（是与否）----------
// { card: { file, path } }  card = is-{card}-yes-or-no-* 的 {card}（如 the-fool / the-devil / strength）
const cardRepMap = {}; // card -> webp filename (取首张作代表)
if (fs.existsSync(YESNO_IMG_DIR)) {
  for (const f of fs.readdirSync(YESNO_IMG_DIR)) {
    if (!f.endsWith('.webp')) continue;
    const m = f.match(/^is-(.+)-yes-or-no-/);
    if (m) { const c = m[1]; if (!cardRepMap[c]) cardRepMap[c] = f; }
  }
}

// Minor：已生的 .webp 列表
const minorFiles = new Set(
  fs.existsSync(MINOR_IMG_DIR)
    ? fs.readdirSync(MINOR_IMG_DIR).filter(f => f.endsWith('.webp'))
    : []
);
const spreadsFiles = new Set(
  fs.existsSync(SPREADS_IMG_DIR)
    ? fs.readdirSync(SPREADS_IMG_DIR).filter(f => f.endsWith('.webp'))
    : []
);
const beginnerFiles = new Set(
  fs.existsSync(BEGINNER_IMG_DIR)
    ? fs.readdirSync(BEGINNER_IMG_DIR).filter(f => f.endsWith('.webp'))
    : []
);

// ---------- 是与否任务清单（100） ----------
const yesnoCfg = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-yesno-images.json'), 'utf8'));
const yesnoTasks = [];
for (const [slug, a] of Object.entries(yesnoCfg.articles)) {
  const m = slug.match(/^is-(.+)-yes-or-no-(.+)$/);
  if (!m) continue;
  const card = m[1], question = m[2];
  const rep = cardRepMap[card]; // 可能 undefined（缺牌）
  // alt：{card} yes or no {question} tarot card（card 去连字符首字母大写）
  const cardPretty = card.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const qPretty = question.split('-').join(' ');
  yesnoTasks.push({
    kind: 'yesno', slug, card, question,
    imgPath: rep ? path.join(YESNO_IMG_DIR, rep) : null,
    hasImage: !!rep,
    alt: `${cardPretty} yes or no ${qPretty} tarot card`,
    cacheKey: 'card:' + card, // 同牌复用 media id
  });
}

// ---------- Minor 任务清单（20） ----------
const minorTasks = [];
if (fs.existsSync(path.join(BASE, 'configs', 'articles-minor-images.json'))) {
  const minorCfg = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-minor-images.json'), 'utf8'));
  for (const slug of Object.keys(minorCfg.articles)) {
    const fname = slug + '.webp';
    const has = minorFiles.has(fname);
    const cardPretty = slug.replace(/^tarot-/, '').replace(/-crystals$/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    minorTasks.push({
      kind: 'minor', slug,
      imgPath: has ? path.join(MINOR_IMG_DIR, fname) : null,
      hasImage: has,
      alt: `${cardPretty} tarot card meaning crystals`,
      cacheKey: 'minor:' + slug, // 各自独立
    });
  }
}

let tasks = [...yesnoTasks, ...minorTasks];
if (typeArg === 'yesno') tasks = tasks.filter(t => t.kind === 'yesno');
if (typeArg === 'minor') tasks = tasks.filter(t => t.kind === 'minor');

// ---------- Spreads 任务清单（25） ----------
const spreadsTasks = [];
if (fs.existsSync(path.join(BASE, 'configs', 'articles-spreads-images.json'))) {
  const cfg = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-spreads-images.json'), 'utf8'));
  for (const [slug, a] of Object.entries(cfg.articles)) {
    const fname = (a.hero && a.hero.file) || (slug + '.webp');
    const has = spreadsFiles.has(fname);
    const pretty = (a.spread || slug).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    spreadsTasks.push({
      kind: 'spreads', slug,
      imgPath: has ? path.join(SPREADS_IMG_DIR, fname) : null,
      hasImage: has,
      alt: `${pretty} tarot spread layout`,
      cacheKey: 'spreads:' + slug,
    });
  }
}

// ---------- Beginner 任务清单（13） ----------
const beginnerTasks = [];
if (fs.existsSync(path.join(BASE, 'configs', 'articles-beginner-images.json'))) {
  const cfg = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-beginner-images.json'), 'utf8'));
  for (const [slug, a] of Object.entries(cfg.articles)) {
    const fname = (a.hero && a.hero.file) || (slug + '.webp');
    const has = beginnerFiles.has(fname);
    const pretty = (a.primary_kw || slug).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    beginnerTasks.push({
      kind: 'beginner', slug,
      imgPath: has ? path.join(BEGINNER_IMG_DIR, fname) : null,
      hasImage: has,
      alt: `${pretty} tarot guide for beginners`,
      cacheKey: 'beginner:' + slug,
    });
  }
}

tasks = [...tasks, ...spreadsTasks, ...beginnerTasks];
if (typeArg === 'spreads') tasks = tasks.filter(t => t.kind === 'spreads');
if (typeArg === 'beginner') tasks = tasks.filter(t => t.kind === 'beginner');
if (slugArg) tasks = tasks.filter(t => t.slug === slugArg);

// 只处理有图的（缺图汇总报告，不执行）
const todo = tasks.filter(t => t.hasImage);
const missing = tasks.filter(t => !t.hasImage);
const run = LIMIT ? todo.slice(0, LIMIT) : todo;

// ---------- WP helpers ----------
function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt.replace(/"/g, '') + '" "https://' + SITE + '/wp-json/wp/v2/media?_fields=id,source_url" --max-time 180', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 150)));
  return { id: j.id, url: j.source_url };
}
function getPost(slug) {
  // context=edit 才返回 content.raw（默认 list 只返回 rendered）
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&context=edit&_fields=id,slug,status,featured_media,content" --max-time 25', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(r);
}
function updatePost(id, data) {
  const tmp = path.join(__dirname, '_tmp-embed.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -X POST -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,featured_media,status" --max-time 120', { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- 主流程 ----------
console.log('=== embed-yesno-minor-images ===');
console.log('牌级代表图覆盖牌 (' + Object.keys(cardRepMap).length + '): ' + Object.keys(cardRepMap).join(', '));
console.log('Minor 已生图 (' + minorFiles.size + '): ' + [...minorFiles].slice(0, 5).join(', ') + (minorFiles.size > 5 ? ' ...' : ''));
console.log('是与否任务: ' + yesnoTasks.length + ' (有图 ' + yesnoTasks.filter(t => t.hasImage).length + ', 缺图 ' + yesnoTasks.filter(t => !t.hasImage).length + ')');
console.log('Minor 任务: ' + minorTasks.length + ' (有图 ' + minorTasks.filter(t => t.hasImage).length + ', 缺图 ' + minorTasks.filter(t => !t.hasImage).length + ')');
console.log('Spreads 任务: ' + spreadsTasks.length + ' (有图 ' + spreadsTasks.filter(t => t.hasImage).length + ', 缺图 ' + spreadsTasks.filter(t => !t.hasImage).length + ')');
console.log('Beginner 任务: ' + beginnerTasks.length + ' (有图 ' + beginnerTasks.filter(t => t.hasImage).length + ', 缺图 ' + beginnerTasks.filter(t => !t.hasImage).length + ')');
console.log('本次执行: ' + run.length + ' (limit=' + LIMIT + ', dry=' + DRY + ', type=' + (typeArg || 'all') + ')\n');

if (DRY) {
  console.log('--- DRY RUN 前5个任务 ---');
  for (const t of run.slice(0, 5)) console.log('  ' + t.slug + ' ← ' + path.basename(t.imgPath) + '  alt="' + t.alt + '"');
  if (missing.length) {
    console.log('\n--- 缺图清单 (' + missing.length + ') ---');
    const missYesno = missing.filter(t => t.kind === 'yesno');
    if (missYesno.length) {
      const missCards = [...new Set(missYesno.map(t => t.card))];
      console.log('是与否缺牌级图 (' + missYesno.length + '篇 / ' + missCards.length + '牌): ' + missCards.join(', '));
    }
    const missMinor = missing.filter(t => t.kind === 'minor');
    if (missMinor.length) console.log('Minor 缺图 (' + missMinor.length + '篇 / 全部20篇): ' + missMinor.map(t => t.slug).join(', '));
    const missSpreads = missing.filter(t => t.kind === 'spreads');
    if (missSpreads.length) console.log('Spreads 缺图 (' + missSpreads.length + '篇): ' + missSpreads.map(t => t.slug).join(', '));
    const missBeginner = missing.filter(t => t.kind === 'beginner');
    if (missBeginner.length) console.log('Beginner 缺图 (' + missBeginner.length + '篇): ' + missBeginner.map(t => t.slug).join(', '));
  }
  process.exit(0);
}

const mediaCache = {}; // cacheKey -> {id,url}
let ok = 0, fail = 0, skip = 0;
const results = [];

for (const t of run) {
  try {
    // 1. 找 post
    const posts = getPost(t.slug);
    if (!posts.length) { console.log('⏭ ' + t.slug + ' (post 不存在,跳过)'); skip++; results.push({ slug: t.slug, status: 'no-post' }); continue; }
    const post = posts[0];
    if (post.status !== 'future') { console.log('⚠ ' + t.slug + ' (status=' + post.status + ',非future,仍处理)'); }

    // 2. 取/复用 media id
    let media = mediaCache[t.cacheKey];
    if (!media) {
      if (!fs.existsSync(t.imgPath)) { console.log('⏭ ' + t.slug + ' (图文件不存在:' + t.imgPath + ')'); skip++; results.push({ slug: t.slug, status: 'no-file' }); continue; }
      media = uploadMedia(t.imgPath, t.alt);
      mediaCache[t.cacheKey] = media;
      console.log('  📷 上传 ' + path.basename(t.imgPath) + ' → media:' + media.id);
    }

    // 3. content = hero img + 原 content（保留原内容不动）
    const orig = post.content && post.content.raw ? post.content.raw : '';
    if (!orig) { console.log('⚠ ' + t.slug + ' (原 content 空)'); }
    // 幂等：若原 content 已含该 media url，跳过避免重复嵌
    if (orig.includes(media.url)) {
      // 仅补 featured_media（content 已有图）
      const up = updatePost(post.id, { featured_media: media.id });
      console.log('✅ ' + t.slug + ' → post:' + up.id + ' (content已有图,仅补featured:' + media.id + ')');
      ok++; results.push({ slug: t.slug, id: up.id, media: media.id, reused: !!mediaCache[t.cacheKey] && mediaCache[t.cacheKey] !== media, status: 'ok-content-skip' });
      continue;
    }
    const heroImg = '<img src="' + media.url + '" alt="' + escapeAttr(t.alt) + '" style="' + IMG_STYLE + '" loading="lazy">';
    const newContent = heroImg + '\n' + orig;

    // 4. update post
    const up = updatePost(post.id, { featured_media: media.id, content: newContent });
    ok++;
    results.push({ slug: t.slug, id: up.id, media: media.id, status: 'ok' });
    console.log('✅ ' + t.slug + ' → post:' + up.id + ' (featured:' + media.id + (mediaCache[t.cacheKey] === media ? ', 首传' : ', 复用') + ')');
  } catch (e) {
    fail++;
    results.push({ slug: t.slug, error: e.message.slice(0, 200), status: 'fail' });
    console.log('❌ ' + t.slug + ': ' + e.message.slice(0, 200));
  }
}

// ---------- 报告 ----------
fs.writeFileSync(path.join(BASE, '_qc', 'embed-yesno-minor-results.json'), JSON.stringify({
  summary: { ok, fail, skip, executed: run.length, missingTotal: missing.length },
  mediaCache,
  results,
}, null, 2), 'utf8');

console.log('\n=== 完成: ' + ok + ' OK, ' + fail + ' ERR, ' + skip + ' 跳过 / 执行' + run.length + ' ===');
if (missing.length) {
  const missYesnoCards = [...new Set(missing.filter(t => t.kind === 'yesno').map(t => t.card))];
  const missMinor = missing.filter(t => t.kind === 'minor');
  console.log('\n--- 缺图待补（等 moleapi reset）---');
  if (missYesnoCards.length) console.log('是与否缺牌级图: ' + missYesnoCards.length + ' 牌 → ' + missYesnoCards.join(', '));
  if (missMinor.length) console.log('Minor 全缺: ' + missMinor.length + ' 篇');
  const missSpreads2 = missing.filter(t => t.kind === 'spreads');
  if (missSpreads2.length) console.log('Spreads 缺图: ' + missSpreads2.length + ' 篇 → ' + missSpreads2.map(t => t.slug).join(', '));
  const missBeginner2 = missing.filter(t => t.kind === 'beginner');
  if (missBeginner2.length) console.log('Beginner 缺图: ' + missBeginner2.length + ' 篇 → ' + missBeginner2.map(t => t.slug).join(', '));
}
