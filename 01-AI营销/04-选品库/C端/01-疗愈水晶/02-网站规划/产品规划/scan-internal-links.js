/**
 * 内链扫描：找站内引用了 28 个旧 slug 的地方（page/post/product/menu）
 * 读 pilot30-slugmap.json → 扫所有 page+post+product content → 输出引用清单
 * 用法：node scan-internal-links.js
 */
const E = require('../templates/elementor-utils');
const fs = require('fs');

async function main() {
  var mapPath = fs.existsSync('all-slugmap.json') ? 'all-slugmap.json' : 'pilot30-slugmap.json';
  var map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  var changed = map.filter(function (x) { return x.changed; });
  var oldSlugs = changed.map(function (x) { return x.old_slug; });
  console.log('扫描旧 slug 引用:', oldSlugs.length, '个');

  var refs = [];

  // pages
  var pages = [], p = 1;
  while (p < 5) {
    var r = await E.apiRequest('/wp-json/wp/v2/pages?per_page=100&page=' + p + '&_fields=id,slug,link,content', 'GET');
    if (!Array.isArray(r) || !r.length) break;
    pages = pages.concat(r); if (r.length < 100) break; p++;
  }
  // posts
  var posts = [], q = 1;
  while (q < 5) {
    var r2 = await E.apiRequest('/wp-json/wp/v2/posts?per_page=100&page=' + q + '&_fields=id,slug,link,content', 'GET');
    if (!Array.isArray(r2) || !r2.length) break;
    posts = posts.concat(r2); if (r2.length < 100) break; q++;
  }
  console.log('pages:', pages.length, '| posts:', posts.length);

  function scanContent(items, type) {
    items.forEach(function (item) {
      var c = (item.content && (item.content.rendered || item.content)) || '';
      oldSlugs.forEach(function (os) {
        if (c.indexOf(os) >= 0) refs.push({ type: type, id: item.id, slug: item.slug, old_slug: os, link: item.link });
      });
    });
  }
  scanContent(pages, 'page');
  scanContent(posts, 'post');

  // products（互链）
  var prods = [], s = 1;
  while (s < 12) {
    var r3 = await E.apiRequest('/wp-json/wc/v3/products?per_page=100&page=' + s + '&status=publish', 'GET');
    if (!Array.isArray(r3) || !r3.length) break;
    prods = prods.concat(r3); if (r3.length < 100) break; s++;
  }
  console.log('products:', prods.length);
  prods.forEach(function (pr) {
    var c = (pr.description || '') + ' ' + (pr.short_description || '');
    oldSlugs.forEach(function (os) {
      if (c.indexOf(os) >= 0) refs.push({ type: 'product', id: pr.id, slug: pr.slug, old_slug: os });
    });
  });

  console.log('\n=== 旧 slug 被引用:', refs.length, '处 ===');
  refs.forEach(function (r) { console.log('  [' + r.type + ']', r.id, '(' + r.slug + ') 含 "' + r.old_slug + '"'); });
  fs.writeFileSync('internal-refs.json', JSON.stringify(refs, null, 2), 'utf8');
  console.log('[saved] internal-refs.json');

  // 按旧slug汇总
  var bySlug = {};
  refs.forEach(function (r) { bySlug[r.old_slug] = (bySlug[r.old_slug] || 0) + 1; });
  console.log('\n按旧slug汇总:', JSON.stringify(bySlug));
}
main().catch(function (e) { console.error('ERR', e.message); });
