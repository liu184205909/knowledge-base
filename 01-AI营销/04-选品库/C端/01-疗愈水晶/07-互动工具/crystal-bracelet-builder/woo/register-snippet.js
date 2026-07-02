/**
 * 注册 T17 Woo 加购 Code Snippet（Code Snippets REST API）。
 * 复用 ai-tarot-chat/register-snippet.js 模式：POST 新建 / PUT 更新。
 *
 * Usage: node register-snippet.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');

const PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
const NAME = 'T17 Crystal Bracelet Builder — WooCommerce custom add-to-cart';

async function run() {
  const list = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const existing = Array.isArray(list) ? list.find(s => (s.name || '') === NAME) : null;

  const payload = {
    name: NAME,
    description: 'T17 builder: cart_item_data + woocommerce_before_calculate_totals server-side reprice (anti-tamper) + cart/order display + admin-ajax endpoint t17_add_custom_bracelet. Step-0 verification.',
    code: PHP,
    scope: 'global',
    active: true
  };

  if (existing && existing.id) {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + existing.id, 'PUT', payload);
    console.log('UPDATED snippet id=' + r.id + ' | active=' + r.active);
    verifyCode(r.code);
  } else {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets', 'POST', payload);
    if (r && r.id) {
      console.log('CREATED snippet id=' + r.id + ' | active=' + r.active);
      verifyCode(r.code);
    } else {
      console.log('CREATE result:', JSON.stringify(r).slice(0, 500));
    }
  }
}

function verifyCode(code) {
  console.log('  has reprice hook:', code.indexOf('woocommerce_before_calculate_totals') >= 0);
  console.log('  has get_item_data:', code.indexOf('woocommerce_get_item_data') >= 0);
  console.log('  has order line item:', code.indexOf('woocommerce_checkout_create_order_line_item') >= 0);
  console.log('  has admin-ajax endpoint:', code.indexOf('t17_add_custom_bracelet') >= 0);
  console.log('  has anti-tamper set_price:', code.indexOf('set_price') >= 0);
}
run().catch(e => console.error('ERR', e.message || e));
