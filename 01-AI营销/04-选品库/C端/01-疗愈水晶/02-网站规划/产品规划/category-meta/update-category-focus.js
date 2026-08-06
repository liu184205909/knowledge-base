/**
 * 补72分类 focus_keyword（rank_math_focus_keyword term meta）
 * 从 slug 生成主搜索词，特殊处理
 */
const E = require('../../templates/elementor-utils');
const fs = require('fs');

const SPECIAL = {
  'crystals-stones': 'crystals and stones',
  'healing-crystals-jewelry': 'healing crystal jewelry',
  'gold-silver-bracelets': 'gold and silver bracelets',
  'gemstone-bracelet-sets': 'gemstone bracelet set',
  'by-stone': 'crystals by stone',
  'by-shape-function': 'crystals by shape',
  'accessories': 'crystal accessories',
  'chakra-bracelets-stones': 'chakra bracelet',
  'spiritual-necklace': 'spiritual necklace',
  'raw-crystal-rings': 'raw crystal ring',
  'raw-crystal-necklace': 'raw crystal necklace',
  'stud-earrings': 'stud earrings',
  'crystal-point-earrings': 'crystal point earrings',
  'crystal-palm-stones': 'crystal palm stone',
  'freeform-crystals': 'freeform crystal',
  'herkimer-diamond': 'herkimer diamond',
  'amazonite-crystal': 'amazonite crystal'
};

function focus(slug) {
  if (SPECIAL[slug]) return SPECIAL[slug];
  return slug.replace(/-/g, ' ');
}

async function main() {
  var content = JSON.parse(fs.readFileSync(__dirname + '/category-content.json', 'utf8'));
  var updates = content.map(function (c) { return { id: c.id, slug: c.slug, focus: focus(c.slug) }; });

  var ok = 0, fail = 0;
  for (var i = 0; i < updates.length; i++) {
    var u = updates[i];
    try {
      await E.apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', {
        objectType: 'term', objectID: u.id,
        meta: { rank_math_focus_keyword: u.focus }
      });
      ok++;
    } catch (e) { fail++; }
    if ((i + 1) % 10 === 0) console.log('  [meta]', i + 1, '/', updates.length);
  }
  fs.writeFileSync(__dirname + '/category-focus.json', JSON.stringify(updates, null, 2), 'utf8');
  console.log('[done] focus keyword: ok ' + ok + ' | fail ' + fail);
  console.log('样本:');
  updates.slice(0, 12).forEach(function (u) { console.log('  ' + u.slug + ' → "' + u.focus + '"'); });
}
main().catch(function (e) { console.error('ERR', e.message); });
