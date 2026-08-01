/**
 * 修复 gift 标题：去掉 "(by Stone Meaning)" 多余后缀（不符合 listicle 标题规范，竞品不加）
 * ①本地 articles（title/rank_math_title）②gift-topics.json 真源（title）③线上 post title + rank_math_title
 * 用法：node fix-title.js   需 disableSandbox（线上更新）
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const l of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) { const t = l.trim(); if (!t || t.startsWith('#')) continue; const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim(); }
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const DIR = path.resolve(__dirname, '..', 'articles');
const SUFFIX = /\s*\(by Stone Meaning\)\s*$/i;
function getId(slug) { return JSON.parse(execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 30', { encoding: 'utf8' })); }
function updatePost(id, data) { const tmp = path.join(__dirname, '_tmp-t.json'); fs.writeFileSync(tmp, JSON.stringify(data), 'utf8'); execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id" --max-time 120', { encoding: 'utf8' }); fs.unlinkSync(tmp); }
function setRM(id, meta) { const tmp = path.join(__dirname, '_tmp-rm.json'); fs.writeFileSync(tmp, JSON.stringify({ objectType: 'post', objectID: String(id), meta }), 'utf8'); execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 60', { encoding: 'utf8' }); fs.unlinkSync(tmp); }

// ① 本地 articles
let localFixed = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = path.join(DIR, f); const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  let ch = false;
  if (SUFFIX.test(a.title)) { a.title = a.title.replace(SUFFIX, '').trim(); ch = true; }
  if (a.rank_math_title && SUFFIX.test(a.rank_math_title)) { a.rank_math_title = a.rank_math_title.replace(SUFFIX, '').trim(); ch = true; }
  if (a.content && a.content.includes('(by Stone Meaning)')) { a.content = a.content.replace(/ \(by Stone Meaning\)/g, ''); ch = true; }
  if (ch) { fs.writeFileSync(p, JSON.stringify(a, null, 2), 'utf8'); localFixed++; }
}
console.log('本地 articles 去后缀: ' + localFixed);

// ② gift-topics.json 真源
const tp = path.resolve(__dirname, '..', 'configs', 'gift-topics.json');
const tj = JSON.parse(fs.readFileSync(tp, 'utf8'));
let topicsFixed = 0;
for (const t of tj.topics) { if (t.title && SUFFIX.test(t.title)) { t.title = t.title.replace(SUFFIX, '').trim(); topicsFixed++; } }
fs.writeFileSync(tp, JSON.stringify(tj, null, 2), 'utf8');
console.log('gift-topics 真源去后缀: ' + topicsFixed);

// ③ 线上 title + rank_math_title
const idx = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'articles-index.json'), 'utf8'));
let ok = 0, fail = 0;
for (const art of idx.articles) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(DIR, art.slug + '.json'), 'utf8'));
    const ps = getId(art.slug); if (!ps.length) continue;
    const id = ps[0].id;
    updatePost(id, { title: a.title });
    setRM(id, { rank_math_title: a.title });
    ok++;
  } catch (e) { fail++; console.log('❌ ' + art.slug + ': ' + e.message.slice(0, 80)); }
}
console.log('线上 title 更新: ' + ok + ' OK, ' + fail + ' ERR');
