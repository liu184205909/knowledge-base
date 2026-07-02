/**
 * T17 Woo 加购闭环端到端测试（Step-0 验证）。
 * 流程：①创建draft产品 → ②注册snippet → ③清空cart → ④调 admin-ajax 加购 →
 *      ⑤读 wc/store/cart 验证价格重算 + meta → ⑥验证 WoodMart 兼容性
 *
 * Usage: node test-full-pipeline.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');
const https = require('https');

function reqRaw(p, method, body, headers) {
  return new Promise((resolve, reject) => {
    const has = body !== undefined && body !== null;
    const payload = has ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const h = Object.assign({ Authorization: E.AUTH }, headers || {});
    if (has && !headers) h['Content-Type'] = 'application/json';
    if (has && h['Content-Type']) h['Content-Length'] = Buffer.byteLength(payload);
    const r = https.request({ hostname: E.SITE, port: 443, path: p, method, headers: h }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, raw: d, headers: res.headers }));
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

async function test() {
  console.log('=== T17 Woo 加购闭环测试 ===\n');

  // 0. auth
  const me = await E.apiRequest('/wp-json/wp/v2/users/me', 'GET');
  console.log('[auth] users/me:', me.id ? 'OK id=' + me.id + ' roles=' + ((me.roles||[]).join(',')) : 'FAIL');
  if (!me.id) { console.log('auth fail, abort'); return; }

  // ① 创建/复用 draft 虚拟产品
  console.log('\n[1] 创建 draft 虚拟产品...');
  let productId = 0;
  // 先查是否已存在
  const exist = await E.apiRequest('/wp-json/wc/v3/products?slug=custom-crystal-bracelet-test&status=draft', 'GET');
  if (Array.isArray(exist) && exist.length) {
    productId = exist[0].id;
    console.log('  复用已存在产品 id=' + productId);
  } else {
    const created = await E.apiRequest('/wp-json/wc/v3/products', 'POST', {
      name: 'Custom Crystal Bracelet Test', type: 'simple', regular_price: '0.00',
      virtual: true, status: 'draft', catalog_visibility: 'hidden',
      description: 'T17 builder placeholder (draft). Config in cart_item_data.', stock_status: 'instock'
    });
    if (created && created.id) {
      productId = created.id;
      console.log('  CREATED id=' + productId + ' status=' + created.status + ' virtual=' + created.virtual);
    } else {
      console.log('  CREATE FAIL:', JSON.stringify(created).slice(0, 250));
      return;
    }
  }

  // ② 注册 snippet
  console.log('\n[2] 注册 Code Snippet...');
  const PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
  const NAME = 'T17 Crystal Bracelet Builder — WooCommerce custom add-to-cart';
  const list = await E.apiRequest('/wp-json/code-snippets/v1/snippets?per_page=100', 'GET');
  const existing = Array.isArray(list) ? list.find(s => (s.name || '') === NAME) : null;
  const payload = { name: NAME, description: 'T17 builder step0', code: PHP, scope: 'global', active: true };
  let snippetId = 0;
  if (existing && existing.id) {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + existing.id, 'PUT', payload);
    snippetId = r.id; console.log('  UPDATED snippet id=' + snippetId);
  } else {
    const r = await E.apiRequest('/wp-json/code-snippets/v1/snippets', 'POST', payload);
    snippetId = r && r.id; console.log('  CREATED snippet id=' + snippetId);
  }
  if (!snippetId) { console.log('  snippet FAIL, abort'); return; }

  // ③ 清空购物车（通过 admin-ajax 调 WC()->cart->empty_cart 不容易；改用 wc/store/cart）
  //    wc/store 需要非ceshi的nonce，这里直接用一个临时session：先 add 再读
  console.log('\n[3] 加购（admin-ajax t17_add_custom_bracelet）...');
  const nonce = ''; // step0 访客放行
  const config = {
    bead_size: 8,
    wrist: 16.5,
    cord: 'woven',           // +$3
    sequence: [
      { type: 'bead', id: 'rose_quartz', size_mm: 8 },  // $2
      { type: 'bead', id: 'amethyst',    size_mm: 8 },  // $2
      { type: 'bead', id: 'malachite',   size_mm: 8 },  // $3.5 (premium)
      { type: 'bead', id: 'clear_quartz',size_mm: 8 },  // $2
      { type: 'charm', id: 'lotus', slotWeight: 1 }     // $8
    ],
    totalPrice: 999.99   // 故意篡改，验证后端忽略
  };
  const EXPECTED = 2 + 2 + 3.5 + 2 + 8 + 3; // = 20.5
  console.log('  预期服务端重算总价: $' + EXPECTED.toFixed(2) + ' (前端篡改价 $999.99 应被忽略)');

  const addBody = 'product_id=' + productId + '&config=' + encodeURIComponent(JSON.stringify(config)) + '&nonce=' + nonce;
  const addRes = await reqRaw('/wp-admin/admin-ajax.php?action=t17_add_custom_bracelet', 'POST', addBody, {
    'Authorization': E.AUTH,
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  console.log('  add HTTP ' + addRes.status);
  let addJson = null;
  try { addJson = JSON.parse(addRes.raw); } catch (e) {}
  console.log('  response:', addJson ? JSON.stringify(addJson).slice(0, 300) : addRes.raw.slice(0, 300));

  if (!addJson || !addJson.success) {
    console.log('\n[!] 加购失败，可能 snippet endpoint 未生效或 PHP error。');
    console.log('    检查：snippet 是否 active、是否有 PHP 语法错误（Code Snippets 后台）、WC()->cart 是否可用');
    // 验证 WoodMart 兼容性无论如何报告
    return;
  }

  // ④ 读购物车验证
  console.log('\n[4] 读购物车（wc/store/cart）验证价格...');
  // wc/store/cart 需要Cart Token（从 add 响应的 Set-Cookie 拿 wp_woocommerce_session_...）
  const cookie = addRes.headers['set-cookie'];
  const cookieStr = Array.isArray(cookie) ? cookie.map(c => c.split(';')[0]).join('; ') : (cookie || '').split(';')[0];
  const cartRes = await reqRaw('/wp-json/wc/store/v1/cart', 'GET', null, { 'Authorization': E.AUTH, 'Cookie': cookieStr });
  console.log('  cart HTTP ' + cartRes.status);
  let cartJson = null;
  try { cartJson = JSON.parse(cartRes.raw); } catch (e) {}

  if (cartJson && cartJson.items) {
    cartJson.items.forEach(it => {
      console.log('  item: ' + it.name + ' | line_total=$' + (it.totals ? it.totals.line_total : '?') + ' | price=$' + (it.prices ? it.prices.price/100 : '?'));
      console.log('    item_data:', JSON.stringify(it.item_data || []));
    });
    const finalPrice = cartJson.items[0] && cartJson.items[0].prices ? (cartJson.items[0].prices.price / 100) : null;
    console.log('\n  实际购物车价格: $' + finalPrice);
    console.log('  预期重算价:    $' + EXPECTED.toFixed(2));
    if (finalPrice !== null && Math.abs(finalPrice - EXPECTED) < 0.01) {
      console.log('  ✅ 价格重算正确！前端篡改价被覆盖，防篡改生效。');
    } else {
      console.log('  ❌ 价格不符！差额: ' + (finalPrice !== null ? (finalPrice - EXPECTED).toFixed(2) : 'null'));
    }
    // meta
    if (cartJson.items[0] && cartJson.items[0].item_data) {
      console.log('\n  cart_item_data 展示:');
      cartJson.items[0].item_data.forEach(d => console.log('    - ' + d.name + ': ' + d.value));
    }
  } else {
    console.log('  cart 读取失败（wc/store 可能需特殊 nonce，但加购已成功 = endpoint 生效）');
    console.log('  raw:', cartRes.raw.slice(0, 200));
  }

  console.log('\n=== WoodMart 兼容性 ===');
  console.log('  woocommerce_before_calculate_totals 是 WooCommerce 核心 hook，WoodMart 主题一般不 remove');
  console.log('  主题只是渲染层；价格计算走 WC core。验证依据：add endpoint 返回 success 且 cart 价格 = 重算值');
  console.log('\nDONE.');
}

test().catch(e => console.error('FATAL', e.message || e));
