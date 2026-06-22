/**
 * 更新72分类：WooCommerce category description（正文）+ Rank Math term meta
 * 用法：node update-categories.js
 */
const E = require('../../templates/elementor-utils');
const fs = require('fs');

async function main() {
  var content = JSON.parse(fs.readFileSync(__dirname + '/category-content.json', 'utf8'));
  console.log('待更新分类:', content.length);

  // 1. WooCommerce category description（正文）
  var updates = content.map(function (c) { return { id: c.id, description: c.description }; });
  for (var i = 0; i < updates.length; i += 50) {
    var b = updates.slice(i, i + 50);
    var r = await E.apiRequest('/wp-json/wc/v3/products/categories/batch', 'POST', { update: b });
    console.log('[wc cat] batch', Math.floor(i / 50) + 1, ':', r && r.update ? r.update.length : JSON.stringify(r));
  }

  // 2. Rank Math term meta（meta_description）
  var metaOk = 0, metaFail = 0;
  for (var j = 0; j < content.length; j++) {
    var c = content[j];
    try {
      await E.apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', {
        objectType: 'term', objectID: c.id,
        meta: { rank_math_description: c.meta_description, rank_math_robots: ['index', 'follow'] }
      });
      metaOk++;
    } catch (e) { metaFail++; }
    if ((j + 1) % 10 === 0) console.log('  [meta]', j + 1, '/', content.length);
  }
  console.log('[meta] ok:', metaOk, '| fail:', metaFail);
  console.log('=== 72分类更新完成 ===');
}
main().catch(function (e) { console.error('ERR', e.message); });
