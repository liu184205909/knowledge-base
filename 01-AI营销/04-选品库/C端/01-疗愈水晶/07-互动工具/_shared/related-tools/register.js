/**
 * 注册 Related Tools Code Snippet 到 WP (Code Snippets REST API)。
 * 先查同名, 存在则 PUT 更新, 否则 POST 新建。
 *
 * Usage: node register.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');

const PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
const NAME = 'Earthward Related Tools cross-link (ew_related_tools_block)';

async function run() {
  const list = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const existing = Array.isArray(list) ? list.find(s => (s.name || '') === NAME) : null;

  const payload = {
    name: NAME,
    description: 'Injects a "Keep exploring" related-tools card grid at the bottom of all 18 tool pages via the_content filter. Tool->tool only (published pages, no dead links). One snippet maintains all 18 tools.',
    code: PHP,
    scope: 'global',
    active: true
  };

  if (existing && existing.id) {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + existing.id, 'PUT', payload);
    console.log('UPDATED snippet id=' + r.id + ' | active=' + r.active + ' | name=' + r.name);
  } else {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets', 'POST', payload);
    if (r && r.id) {
      console.log('CREATED snippet id=' + r.id + ' | active=' + r.active + ' | name=' + r.name);
    } else {
      console.log('CREATE result:', JSON.stringify(r).slice(0, 600));
    }
  }
  // verify the code landed
  const verify = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const me = Array.isArray(verify) ? verify.find(s => (s.name || '') === NAME) : null;
  if (me) {
    const code = me.code || '';
    console.log('verify -> active=' + me.active + ' | has the_content filter:', code.indexOf("add_filter('the_content'") >= 0);
  }
}
run().catch(e => console.error('ERR', e.message || e));
