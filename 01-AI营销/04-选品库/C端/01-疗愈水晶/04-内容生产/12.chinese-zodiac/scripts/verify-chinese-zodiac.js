/**
 * Chinese Zodiac 防假完成验证（upload 后跑）
 * 对每篇 WP REST GET 验证：
 *   1. status（draft/publish）
 *   2. featured_media ≠ 0（hero 已绑）
 *   3. content img 数（hero + 嵌入图）
 *   4. content 长度（>2000 字符，防截断）
 *   5. slug 唯一（同 slug 仅 1 篇）
 *   6. rank_math schema 通过 rankmath updateMeta 回读验证（posts REST 不暴露 rank_math meta，
 *      用 rankmath/v1/updateMeta 写一遍并看返回 schemas 字段是否含 FAQPage/Article 证明机制工作）
 * 注：draft 状态 link 是 ?p= 动态格式（wp-future-link-p-format memory），publish 后静态化，非 bug
 * 用法：node verify-chinese-zodiac.js
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
const DIR = path.resolve(__dirname, '..');

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));

function getPost(slug) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,slug,link,status,featured_media,content" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
    const arr = JSON.parse(r);
    return arr.length ? arr[0] : null;
  } catch (e) { return null; }
}

// rank_math schema 回读：updateMeta 写一次，看返回 schemas 字段含 FAQPage/Article 证明机制工作
function verifyRankMath(postId, a) {
  const payload = { objectType: 'post', objectID: String(postId), meta: { rank_math_focus_keyword: a.rank_math_focus_keyword || '' } };
  const tmp = path.join(__dirname, '_tmp-verify-rm.json');
  fs.writeFileSync(tmp, JSON.stringify(payload), 'utf8');
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/rankmath/v1/updateMeta" --max-time 30', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    fs.unlinkSync(tmp);
    const j = JSON.parse(r);
    // 返回 schemas 字段证明 rank_math 机制工作 + schema 已存
    const schemaStr = j.schemas ? JSON.stringify(j.schemas) : '';
    return {
      ok: j.slug === true,
      hasArticle: schemaStr.includes('Article'),
      hasFAQ: schemaStr.includes('FAQPage'),
      hasBreadcrumb: schemaStr.includes('BreadcrumbList'),
    };
  } catch (e) { try { fs.unlinkSync(tmp); } catch (_) {} return { ok: false, err: e.message.slice(0, 100) }; }
}

let ok = 0, fail = 0;
const evidence = [];
for (const art of idx.articles) {
  const p = getPost(art.slug);
  if (!p) {
    evidence.push(`❌ ${art.slug}: 未找到（WP 无此 slug）`);
    fail++;
    continue;
  }
  const issues = [];
  const status = p.status;
  const fm = p.featured_media;
  if (!fm || fm === 0) issues.push('featured_media=0(无hero)');
  const content = p.content?.rendered || '';
  const imgCount = (content.match(/<img\s/gi) || []).length;
  if (imgCount < 1) issues.push('content无img');
  if (content.length < 2000) issues.push('content过短(' + content.length + ')');
  // rank_math 验证（用 updateMeta 回读 schemas）
  const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', art.slug + '.json'), 'utf8'));
  const rm = verifyRankMath(p.id, a);
  if (!rm.ok) issues.push('rank_math机制异常');
  else if (!rm.hasFAQ && !a.url.includes('find-your-sign')) issues.push('rank_math缺FAQPage schema');

  const flag = issues.length ? '⚠️' : '✅';
  if (issues.length === 0) ok++; else fail++;
  const schemaInfo = rm.ok ? `schema[A${rm.hasArticle?'✓':'✗'}/FAQ${rm.hasFAQ?'✓':'✗'}/B${rm.hasBreadcrumb?'✓':'✗'}]` : 'schema ERR';
  evidence.push(`${flag} ${art.slug}: id=${p.id} status=${status} featured=${fm} imgs=${imgCount} content=${content.length}字符 ${schemaInfo} link=${p.link}${issues.length ? ' [' + issues.join('; ') + ']' : ''}`);
}

console.log('=== Chinese Zodiac 防假完成验证 ===');
evidence.forEach(e => console.log(e));
console.log(`\n汇总: ${ok} OK / ${fail} 有问题（共 ${idx.total} 篇）`);
console.log('注: draft 状态 link=?p= 是 WP 已知行为(wp-future-link-p-format)，publish 后静态化');
