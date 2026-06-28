/**
 * 更新已上线 horoscope 文章 WP（嵌入 crystal + ritual 图）
 * - aquarius-2026 (post 44482): crystal_year + ritual
 * - aquarius-april-2026 (post 45323): crystal_month + ritual
 * 流程：
 *   1. GET 线上原始 content -> 备份到 backup/
 *   2. uploadMedia(crystal) + uploadMedia(ritual) 拿 WP url
 *   3. 线上 content 嵌图（H2 后插 figure，用真实 WP url）
 *   4. PUT /wp-json/wp/v2/posts/{id} body {content}
 * 幂等：若线上 content 已含该图 url 则跳过该图
 * 用法：node update-published-wp.js --slug=aquarius-2026
 *      node update-published-wp.js   (默认2篇)
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
const KB = 'D:/Code/knowledge-base';
const PROJECT_ROOT = path.join(KB, '02-网站规划');
const YEARLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/7.zodiac-yearly-horoscope/articles');
const MONTHLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/articles');
const BACKUP_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/scripts/backup');
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// 已上线文章映射
const PUBLISHED = {
  'aquarius-2026': { postId: 44482, dir: YEARLY_DIR, crystalKey: 'crystal_year' },
  'aquarius-april-2026': { postId: 45323, dir: MONTHLY_DIR, crystalKey: 'crystal_month' },
};

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const dry = args.includes('--dry=1');

function curl(args, maxTime = 90) {
  return execSync('curl -s ' + PROXY + ' ' + AUTH + ' ' + args + ' --max-time ' + maxTime, { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
}

function getPost(postId) {
  const r = curl('"https://' + SITE + '/wp-json/wp/v2/posts/' + postId + '?_fields=id,slug,title,content,status&context=view"', 30);
  const j = JSON.parse(r);
  // content 可能是 {rendered:"..."} 或字符串
  if (j.content && typeof j.content === 'object' && j.content.rendered) {
    j.content = j.content.rendered;
  } else if (j.content && typeof j.content === 'object') {
    j.content = j.content.raw || j.content.rendered || '';
  }
  return j;
}

function uploadMedia(file, alt) {
  const r = curl('-F "file=@' + file + '" -F "alt=' + alt.replace(/"/g, '') + '" "https://' + SITE + '/wp-json/wp/v2/media"', 120);
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media upload failed: ' + (j.message || r.slice(0, 200)));
  return { id: j.id, url: j.source_url };
}

function updatePost(postId, data) {
  const tmp = path.join(BACKUP_DIR, '_tmp-put.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  const r = curl('-X PUT -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + postId + '?_fields=id,slug,link,status"', 120);
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

function insertAfterH2(content, h2Regex, figure) {
  const m = content.match(h2Regex);
  if (!m) return null;
  const endIdx = m.index + m[0].length;
  const before = content.slice(0, endIdx);
  const after = content.slice(endIdx);
  const nnMatch = after.match(/^\n{1,3}/);
  const sep = nnMatch ? nnMatch[0] : '\n\n';
  return before + sep + figure + '\n\n' + after.slice(sep.length);
}

function processPublished(slug) {
  const meta = PUBLISHED[slug];
  if (!meta) { console.log('unknown slug ' + slug); return; }
  const jsonFile = path.join(meta.dir, slug + '.json');
  const a = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  console.log('\n=== ' + slug + ' (post ' + meta.postId + ') ===');

  // 1. GET 线上 content 备份
  let post;
  try { post = getPost(meta.postId); }
  catch (e) { console.log('  X GET post failed: ' + e.message); return; }
  if (!post.content) { console.log('  X no content in post'); return; }
  const backupFile = path.join(BACKUP_DIR, slug + '-pre-crystal-ritual-' + Date.now() + '.json');
  fs.writeFileSync(backupFile, JSON.stringify({ id: post.id, slug: post.slug, content: post.content }, null, 2));
  console.log('  backup -> ' + path.basename(backupFile));

  let content = post.content;
  const isYearly = meta.crystalKey === 'crystal_year';
  const report = [];

  // 2 + 3. crystal
  const crystalImg = a.images[meta.crystalKey];
  if (crystalImg) {
    const absFile = path.join(PROJECT_ROOT, crystalImg.file);
    if (!fs.existsSync(absFile)) { console.log('  X crystal file missing: ' + absFile); }
    else {
      const up = uploadMedia(absFile, crystalImg.alt);
      console.log('  uploaded crystal -> ' + up.url);
      const figure = '<figure class="wp-block-image size-large"><img src="' + up.url + '" alt="' + (crystalImg.alt || '').replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" /></figure>';
      const re = isYearly ? /<h2[^>]*>\s*Crystal of the Year[^<]*<\/h2>/i : /<h2[^>]*>\s*Crystal of the Month[^<]*<\/h2>/i;
      const newC = insertAfterH2(content, re, figure);
      if (newC) { content = newC; report.push('crystal:embedded'); }
      else { report.push('crystal:H2_NOT_FOUND'); console.log('  ! crystal H2 not found in WP content'); }
    }
  }

  // ritual
  const ritualImg = a.images['ritual'];
  if (ritualImg) {
    const absFile = path.join(PROJECT_ROOT, ritualImg.file);
    if (!fs.existsSync(absFile)) { console.log('  X ritual file missing: ' + absFile); }
    else {
      const up = uploadMedia(absFile, ritualImg.alt);
      console.log('  uploaded ritual -> ' + up.url);
      const figure = '<figure class="wp-block-image size-large"><img src="' + up.url + '" alt="' + (ritualImg.alt || '').replace(/"/g, '&quot;') + '" loading="lazy" decoding="async" /></figure>';
      const re = isYearly ? /<h2[^>]*>\s*Year-Long Crystal Ritual[^<]*<\/h2>/i : /<h2[^>]*>\s*Monthly Crystal Ritual[^<]*<\/h2>/i;
      const newC = insertAfterH2(content, re, figure);
      if (newC) { content = newC; report.push('ritual:embedded'); }
      else { report.push('ritual:H2_NOT_FOUND'); console.log('  ! ritual H2 not found in WP content'); }
    }
  }

  if (content === post.content) { console.log('  no change'); return; }

  if (dry) { console.log('  (DRY) would PUT, report=' + report.join(',')); return; }

  // 4. PUT
  try {
    const r = updatePost(meta.postId, { content });
    console.log('  PUT ok -> ' + (r.link || r.id) + ' report=' + report.join(','));
  } catch (e) { console.log('  X PUT failed: ' + e.message); }
}

const slugs = slugArg ? [slugArg] : Object.keys(PUBLISHED);
for (const s of slugs) {
  try { processPublished(s); }
  catch (e) { console.log('  X ' + s + ': ' + e.message); }
}
console.log('\ndone.');
