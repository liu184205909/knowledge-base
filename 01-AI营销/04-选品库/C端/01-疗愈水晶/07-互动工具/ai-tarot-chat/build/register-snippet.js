/**
 * 注册 AI Chat 塔罗师 Code Snippet 到 WP (Code Snippets REST API)。
 * 先尝试 POST 新建; 若同名已存在则查 list 拿 id 后 PUT 更新。
 *
 * Usage: node register-snippet.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');

const PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
const NAME = 'AI Chat Tarot Reader (ect_ai_chat endpoint)';

async function run() {
  // 1) 先查是否已存在同名 snippet
  const list = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const existing = Array.isArray(list) ? list.find(s => (s.name || '') === NAME) : null;

  const payload = {
    name: NAME,
    description: 'admin-ajax endpoint ect_ai_chat: 4 universal tarot reader personas (Seraphina/Maverick/The Oracle/Elder Sage), English-only output -> DeepSeek chat. Key kept server-side. Per-IP daily rate limit.',
    code: PHP,
    scope: 'global',
    active: true
  };

  if (existing && existing.id) {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + existing.id, 'PUT', payload);
    console.log('UPDATED snippet id=' + r.id + ' | active=' + r.active + ' | name=' + r.name);
    console.log('  has handler:', r.code.indexOf('eac_chat_handler') >= 0, '| has deepseek:', r.code.indexOf('deepseek') >= 0, '| has 4 personas:', ['seraphina','maverick','oracle','sage'].every(k => r.code.indexOf("'" + k + "'") >= 0), '| forced english:', r.code.indexOf('RESPOND IN ENGLISH ONLY') >= 0);
  } else {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets', 'POST', payload);
    if (r && r.id) {
      console.log('CREATED snippet id=' + r.id + ' | active=' + r.active + ' | name=' + r.name);
      console.log('  has handler:', r.code.indexOf('eac_chat_handler') >= 0, '| has deepseek:', r.code.indexOf('deepseek') >= 0);
    } else {
      console.log('CREATE result:', JSON.stringify(r).slice(0, 500));
    }
  }
}
run().catch(e => console.error('ERR', e.message || e));
