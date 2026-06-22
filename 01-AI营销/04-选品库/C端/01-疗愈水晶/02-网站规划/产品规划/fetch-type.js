/**
 * 按 type 拉剩余产品数据（list 数据已含 description/short/attrs，无需逐个 GET）
 * 用法：node fetch-type.js copper|jewelry|form
 */
const E = require('../templates/elementor-utils');
const fs = require('fs');
const FORM = /sphere|tower|heart|pyramid|cube|tumbled|angel|flame|freeform|cluster|wand|worry|ganesh|mekaba|merkaba|skull|star|octahedron|obelisk|point|generator|geode|egg|by-shape-function|palm/;

function classify(c) {
  if (c.indexOf('copper-jewelry') >= 0) return 'copper';
  if (c.some(function (x) { return /bracelet|necklace|ring|earring|anklet|mala/.test(x); })) return 'jewelry';
  if (c.some(function (x) { return FORM.test(x); })) return 'form';
  return 'other';
}

async function main() {
  var type = process.argv[2] || 'copper';
  var pilot30 = JSON.parse(fs.readFileSync('pilot30-data.json', 'utf8')).map(function (p) { return p.id; });
  var firstBatch = [24999, 25125, 25357]; // 第一批试点3个（pilot-content.json，已更新）
  var excl = {};
  firstBatch.forEach(function (i) { excl[i] = 1; });
  pilot30.forEach(function (i) { excl[i] = 1; });

  var all = [], p = 1;
  while (p < 12) {
    var r = await E.apiRequest('/wp-json/wc/v3/products?per_page=100&page=' + p + '&status=publish', 'GET');
    if (!Array.isArray(r) || !r.length) break;
    all = all.concat(r);
    if (r.length < 100) break;
    p++;
  }
  var targets = all.filter(function (pr) {
    return !excl[pr.id] && classify((pr.categories || []).map(function (c) { return c.slug; })) === type;
  });
  console.log(type + ':', targets.length, '个（排除试点30）');

  var out = targets.map(function (pr) {
    return {
      id: pr.id, name: pr.name, slug: pr.slug,
      cats: (pr.categories || []).map(function (c) { return c.slug; }),
      attrs: (pr.attributes || []).map(function (a) { return { name: a.name, options: a.options }; }),
      short_description: pr.short_description,
      description: pr.description
    };
  });
  fs.writeFileSync('batch-' + type + '-data.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('[saved] batch-' + type + '-data.json |', out.length);
  out.slice(0, 5).forEach(function (d) { console.log('  ', d.id, '|', d.name); });
}
main().catch(function (e) { console.error('ERR', e.message); });
