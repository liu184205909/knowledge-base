/**
 * 发布所有 crystal-combinations 文章(draft→publish)
 * 重查全部分类文章(不依赖旧map,含新传的5篇),逐篇 POST status=publish
 * 用法：node scripts/publish-all.js --slug=amethyst-and-selenite   # 单篇测试
 *       node scripts/publish-all.js                                # 全部 draft→publish
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
const AUTH = '-u "' + U + ':' + P + '"';
const PROXY = '--proxy socks5://127.0.0.1:10808';
const slugArg = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// 重查所有配对文章(分页)
function fetchAll() {
  const all = [];
  for (let p = 1; p <= 5; p++) {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?categories=1563&status=any&per_page=100&page=' + p + '&_fields=id,slug,status&context=edit" --max-time 30', { encoding: 'utf8' });
    try { const arr = JSON.parse(r); if (!arr.length) break; all.push(...arr); } catch (e) { break; }
  }
  return all;
}

const all = fetchAll();
const drafts = all.filter(x => x.slug && x.slug.includes('-and-') && x.status === 'draft');
const list = slugArg ? drafts.filter(x => x.slug === slugArg) : drafts;
console.log(`=== 共 ${all.length} 篇配对文章 | draft ${drafts.length} → 发布 ${list.length} ===`);

let ok = 0, fail = 0;
for (const x of list) {
  try {
    const tmp = path.join(__dirname, '_tmp-pub.json');
    fs.writeFileSync(tmp, JSON.stringify({ status: 'publish' }), 'utf8');
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + x.id + '?_fields=id,slug,status,link" --max-time 60', { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    fs.unlinkSync(tmp);
    const j = JSON.parse(r);
    if (j.status === 'publish') { ok++; console.log('✅ ' + x.slug + ' → ' + (j.link || '')); }
    else { fail++; console.log('❌ ' + x.slug + ': status=' + j.status); }
  } catch (e) { fail++; console.log('❌ ' + x.slug + ': ' + e.message.slice(0, 80)); }
}
console.log('\n=== 发布完成: ' + ok + ' OK, ' + fail + ' ERR ===');
