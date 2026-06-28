/**
 * 把 fix-nav-chinese.js 修后的月运 content 重新 POST 到对应 WP post。
 *
 * - slug → id（status=future,publish,draft 全量查，避免 future 漏查）
 * - 只更新 content，不动 status / date / title / slug → future 文章保持 future，不提前发布
 * - 132 篇带中文 nav 的批次会被覆盖；其余文件若 slug 查不到则跳过并报告
 *
 * 用法： node reupload-nav-fix.js                # 全量
 *        node reupload-nav-fix.js --slug=aries-june-2026   # 单篇测试
 *        node reupload-nav-fix.js --dry-run      # 只查 id 不 POST
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

const ARTICLES_DIR = path.resolve(__dirname, '..', 'articles');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

// 只处理本地 content 中确实曾含中文 nav 残留的文件（避免无谓覆盖干净文件）。
// 简化策略：处理 articles/ 全部 json，但 dry-run/单篇优先；对查不到 post 的报告 SKIP。
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).sort();
const sel = slugArg ? files.filter(f => f === slugArg + '.json') : files;

function wpGet(apiPath) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' --max-time 30 "https://' + SITE + apiPath + '"',
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(r);
}

function wpUpdatePost(postId, content) {
  const tmp = path.join(__dirname, '_tmp-reupload-nav.json');
  fs.writeFileSync(tmp, JSON.stringify({ content }), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + postId + '?_fields=id,slug,status,link" --max-time 90',
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, fail = 0, skip = 0;
const fails = [];

for (const file of sel) {
  const fp = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const slug = a.slug || file.replace(/\.json$/, '');
  try {
    const found = wpGet('/wp-json/wp/v2/posts?slug=' + encodeURIComponent(slug) + '&status=future,publish,draft&_fields=id,slug,status');
    if (!Array.isArray(found) || !found.length) {
      skip++; console.log('⏭  ' + slug + ' (no WP post)');
      continue;
    }
    const post = found[0];

    if (dryRun) {
      console.log('DRY ' + slug + ' → id:' + post.id + ' [' + post.status + ']');
      continue;
    }

    const res = wpUpdatePost(post.id, a.content);
    if (res && res.id) {
      ok++;
      if (ok <= 5 || ok % 20 === 0) console.log('✅ [' + ok + '] ' + slug + ' → id:' + res.id + ' [' + res.status + ']');
    } else {
      fail++; fails.push({ slug, err: JSON.stringify(res).slice(0, 200) });
      console.log('❌ ' + slug + ': ' + JSON.stringify(res).slice(0, 150));
    }
  } catch (e) {
    fail++; fails.push({ slug, err: e.message.slice(0, 200) });
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 150));
  }
}

console.log('\n=== reupload-nav-fix ===');
console.log('mode      : ' + (dryRun ? 'DRY-RUN' : 'WRITE'));
console.log('processed : ' + sel.length);
console.log('updated   : ' + ok);
console.log('skipped   : ' + skip + ' (no WP post)');
console.log('failed    : ' + fail);
if (fails.length) console.log('failures  :\n' + fails.map(f => '  ' + f.slug + ': ' + f.err).join('\n'));
