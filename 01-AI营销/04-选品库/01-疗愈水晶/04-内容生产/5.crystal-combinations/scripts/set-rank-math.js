/**
 * 设置 207 篇配对文章的 rank_math (title/description/focus_keyword)
 * 重查全分类文章 slug→id(含新传5篇) → 读 article.json rank_math_* → POST rankmath/v1/updateMeta
 * 用法：node scripts/set-rank-math.js --slug=obsidian-and-red-jasper  # 单篇
 *       node scripts/set-rank-math.js                                  # 全207篇
 * 需 socks5 + disableSandbox + upload-5-failed 已跑完(5新篇已建)
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
const ARTICLES = path.resolve(__dirname, '..', 'articles');
const slugArg = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// 重查所有配对文章 slug→id
function fetchAll() {
  const all = {};
  for (let p = 1; p <= 5; p++) {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?categories=1563&status=any&per_page=100&page=' + p + '&_fields=id,slug" --max-time 30', { encoding: 'utf8' });
    try { const arr = JSON.parse(r); if (!arr.length) break; for (const x of arr) if (x.slug && x.slug.includes('-and-')) all[x.slug] = x.id; } catch (e) { break; }
  }
  return all;
}
function setRankMath(id, meta) {
  const tmp = path.join(__dirname, '_tmp-rm.json');
  fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

const map = fetchAll();
console.log(`=== 重查到 ${Object.keys(map).length} 篇配对文章 ===`);
const sel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'selected-articles.json'), 'utf8'));
const list = slugArg ? sel.articles.filter(a => a.slug === slugArg) : sel.articles;

let ok = 0, fail = 0, noPost = 0;
for (const art of list) {
  const id = map[art.slug];
  if (!id) { noPost++; console.log('⚠ ' + art.slug + ': 无 post(未上传?)'); continue; }
  try {
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES, art.slug + '.json'), 'utf8'));
    if (!a.rank_math_title) { fail++; console.log('⚠ ' + art.slug + ': article 无 rank_math_title'); continue; }
    setRankMath(id, {
      rank_math_title: a.rank_math_title,
      rank_math_description: a.rank_math_description || '',
      rank_math_focus_keyword: a.rank_math_focus_keyword || '',
    });
    ok++;
    if (ok % 20 === 0) console.log(`✓ ${ok}/${list.length}...`);
  } catch (e) { fail++; console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 60)); }
}
console.log(`\n=== rank_math 设置完成: ${ok} OK, ${fail} ERR, ${noPost} 无post ===`);
