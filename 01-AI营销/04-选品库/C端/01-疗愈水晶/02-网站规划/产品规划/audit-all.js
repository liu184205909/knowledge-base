/**
 * 全量内容审计：扫描814产品质量维度
 * - name/desc 违规词（desc 排除 disclaimer 句）
 * - Details H2/strong 保留
 * - Earthward 品牌内链
 * - disclaimer
 * - slug 与 name 一致性（kebab）
 * 用法：node audit-all.js
 */
const E = require('../templates/elementor-utils');
const fs = require('fs');

const VIOL_NAME = /\b(heal|healing|cures|cure|energy|vibrations?|divine|mystical|mystic|magnetic|psychic|high-energy|astro|chakra)\b/i;
const VIOL_DESC = /\b(heal|healing|heals|healer|cures|cure|energy|vibrations?|vibrational|divine energy|divine|mystical|mystic|magnetic|psychic|high-energy|astro|circulation|immune system|balance chakras|align chakras|cleanse)\b/i;

function kebab(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  var all = [], p = 1;
  while (p < 12) {
    var r = await E.apiRequest('/wp-json/wc/v3/products?per_page=100&page=' + p + '&status=publish', 'GET');
    if (!Array.isArray(r) || !r.length) break;
    all = all.concat(r);
    if (r.length < 100) break;
    p++;
  }
  console.log('总产品:', all.length);

  var issues = { violName: [], violDesc: [], noDetails: [], noBrand: [], noDisclaimer: [], slugMismatch: [] };
  all.forEach(function (pr) {
    var name = pr.name || '', desc = pr.description || '', slug = pr.slug || '';
    var descClean = desc.replace(/not intended to diagnose[^<]*condition/i, '').replace(/Crystal meanings are based on tradition[^<]*\./i, '').replace(/Cultural and symbolic meanings[^<]*\./i, '');
    if (VIOL_NAME.test(name)) issues.violName.push(pr.id + ': ' + name);
    if (VIOL_DESC.test(descClean)) issues.violDesc.push(pr.id + ': ' + name + ' → ' + (descClean.match(VIOL_DESC) || ['?'])[0]);
    if (!/<h2>Details<\/h2>|<strong>Details<\/strong>|>Details</i.test(desc)) issues.noDetails.push(pr.id + ': ' + name);
    if (!/goearthward\.com/.test(desc)) issues.noBrand.push(pr.id + ': ' + name);
    if (!/not intended to diagnose/i.test(desc)) issues.noDisclaimer.push(pr.id + ': ' + name);
    if (slug !== kebab(name)) issues.slugMismatch.push(pr.id + ': ' + name + ' | ' + slug + ' ≠ ' + kebab(name));
  });

  console.log('\n=== 全量审计结果（814产品）===');
  console.log('name 含违规词:', issues.violName.length);
  console.log('desc 含违规词(除disclaimer):', issues.violDesc.length);
  console.log('缺 Details:', issues.noDetails.length);
  console.log('缺品牌内链:', issues.noBrand.length);
  console.log('缺 disclaimer:', issues.noDisclaimer.length);
  console.log('slug≠name kebab:', issues.slugMismatch.length);

  ['violName', 'violDesc', 'noDetails', 'noBrand', 'noDisclaimer'].forEach(function (k) {
    if (issues[k].length) {
      console.log('\n--- ' + k + ' (' + issues[k].length + ') ---');
      issues[k].slice(0, 30).forEach(function (x) { console.log('  ' + x); });
    }
  });
  fs.writeFileSync('audit-all.json', JSON.stringify(issues, null, 2), 'utf8');
  console.log('\n[saved] audit-all.json');
}
main().catch(function (e) { console.error('ERR', e.message); });
