/**
 * 删除一个 gift 选题（全链路：线上 post + 本地 articles/placeholders + index + topics）
 * 用法：node delete-topic.js --slug=xxx   需 disableSandbox
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const l of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) { const t = l.trim(); if (!t || t.startsWith('#')) continue; const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim(); }
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const slug = process.argv.slice(2).find(a => a.startsWith('--slug='))?.split('=')[1];
if (!slug) { console.error('缺 --slug'); process.exit(1); }
const DIR = path.resolve(__dirname, '..');
// 线上删
try {
  const ps = JSON.parse(execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id" --max-time 30', { encoding: 'utf8' }));
  if (ps.length) { const id = ps[0].id; execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X DELETE "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?force=true" --max-time 30', { encoding: 'utf8' }); console.log('线上删除 post ' + id); }
  else console.log('线上无此 slug');
} catch (e) { console.log('线上删失败: ' + e.message.slice(0, 80)); }
// 本地删
for (const f of [path.join(DIR, 'articles', slug + '.json'), path.join(DIR, '_placeholders', slug + '.txt')]) { if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('删 ' + path.basename(f)); } }
// index 移除
const idxP = path.join(DIR, 'articles-index.json');
const idx = JSON.parse(fs.readFileSync(idxP, 'utf8'));
idx.articles = idx.articles.filter(a => a.slug !== slug); idx.total = idx.articles.length;
fs.writeFileSync(idxP, JSON.stringify(idx, null, 2), 'utf8');
// topics 移除
const tp = path.join(DIR, 'configs', 'gift-topics.json');
const tj = JSON.parse(fs.readFileSync(tp, 'utf8'));
tj.topics = tj.topics.filter(t => t.slug !== slug); tj.meta.total = tj.topics.length;
fs.writeFileSync(tp, JSON.stringify(tj, null, 2), 'utf8');
console.log('完成：' + slug + ' 已全链路移除，剩 ' + idx.total + ' 篇');
