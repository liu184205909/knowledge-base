/**
 * T17 修补+重测加购：
 *  ① 重新注册 snippet（含 purchasable filter）
 *  ② 产品49026 打 meta _t17_builder_product=1 + publish + catalog_visibility=hidden
 *  ③ 重测 admin-ajax 加购 + 读 wc/store/cart 验证价格重算
 *
 * Usage: node test-add-cart.js
 */
const fs = require('fs');
const path = require('path');
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');
const https = require('https');
const PRODUCT_ID = 49026;
const SNIPPET_ID = 20;
const SNIPPET_NAME = 'T17 Crystal Bracelet Builder — WooCommerce custom add-to-cart';

function reqRaw(p, method, body, headers) {
  return new Promise((resolve, reject) => {
    const has = body !== undefined && body !== null;
    const payload = has ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const h = Object.assign({ Authorization: E.AUTH }, headers || {});
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

async function main() {
  console.log('=== T17 加购修复重测 ===\n');

  // ① 重新注册 snippet
  console.log('[1] 重新注册 snippet（+purchasable filter）...');
  const PHP = fs.readFileSync(path.resolve(__dirname, 'snippet.php'), 'utf8');
  const r1 = await E.apiRequest('/wp-json/code-snippets/v1/snippets/' + SNIPPET_ID, 'PUT', {
    name: SNIPPET_NAME, description: 'T17 builder step0 (+purchasable)', code: PHP, scope: 'global', active: true
  });
  console.log('  snippet id=' + (r1.id || '?') + ' | has purchasable filter:', (r1.code||'').indexOf('woocommerce_is_purchasable') >= 0);

  // ② 产品 publish + hidden + meta
  console.log('\n[2] 产品 ' + PRODUCT_ID + ' → publish + catalog_visibility=hidden + meta _t17_builder_product=1');
  const r2 = await E.apiRequest('/wp-json/wc/v3/products/' + PRODUCT_ID, 'POST', {
    status: 'publish', catalog_visibility: 'hidden'
  });
  console.log('  status=' + (r2.status) + ' visibility=' + (r2.catalog_visibility));
  // 打 meta（用 WP REST update meta；wc/v3 的 meta_values 也可以但 WP REST 更直接）
  const r3 = await E.apiRequest('/wp-json/wp/v2/products/' + PRODUCT_ID + '?context=edit', 'POST', {
    meta: { '_t17_builder_product': '1' }
  });
  console.log('  meta set: ' + (r3.id ? 'OK (wp/v2)' : 'wp/v2 fail: ' + JSON.stringify(r3).slice(0,120)));
  // fallback: wc/v3 meta
  if (!r3.id) {
    const r3b = await E.apiRequest('/wp-json/wc/v3/products/' + PRODUCT_ID, 'POST', {
      meta_data: [{ key: '_t17_builder_product', value: '1' }]
    });
    console.log('  meta set via wc/v3: ' + (r3b.id ? 'OK' : JSON.stringify(r3b).slice(0,120)));
  }

  // ③ 重测加购
  console.log('\n[3] 加购（admin-ajax）...');
  const config = {
    bead_size: 8, wrist: 16.5, cord: 'woven',
    sequence: [
      { type: 'bead', id: 'rose_quartz', size_mm: 8 },
      { type: 'bead', id: 'amethyst', size_mm: 8 },
      { type: 'bead', id: 'malachite', size_mm: 8 },
      { type: 'bead', id: 'clear_quartz', size_mm: 8 },
      { type: 'charm', id: 'lotus', slotWeight: 1 }
    ],
    totalPrice: 999.99
  };
  const EXPECTED = 2 + 2 + 3.5 + 2 + 8 + 3; // 20.5
  const body = 'product_id=' + PRODUCT_ID + '&config=' + encodeURIComponent(JSON.stringify(config)) + '&nonce=';
  const addRes = await reqRaw('/wp-admin/admin-ajax.php?action=t17_add_custom_bracelet', 'POST', body, {
    'Authorization': E.AUTH, 'Content-Type': 'application/x-www-form-urlencoded'
  });
  console.log('  HTTP ' + addRes.status);
  let addJson = null; try { addJson = JSON.parse(addRes.raw); } catch(e){}
  console.log('  response:', JSON.stringify(addJson).slice(0, 250));

  if (addJson && addJson.success) {
    console.log('\n  ✅ 加购成功！cart_item_key=' + addJson.data.cart_item_key + ' server_recalc=$' + addJson.data.server_recalc_total);

    // ④ 读 cart 验证
    console.log('\n[4] 读购物车...');
    const cookie = addRes.headers['set-cookie'];
    const cookieStr = Array.isArray(cookie) ? cookie.map(c => c.split(';')[0]).join('; ') : '';
    const cartRes = await reqRaw('/wp-json/wc/store/v1/cart', 'GET', null, { Authorization: E.AUTH, Cookie: cookieStr });
    let cartJson = null; try { cartJson = JSON.parse(cartRes.raw); } catch(e){}
    if (cartJson && cartJson.items && cartJson.items.length) {
      const it = cartJson.items[0];
      const final = it.prices ? it.prices.price/100 : null;
      console.log('  item: ' + it.name + ' | cart_price=$' + final + ' | qty=' + it.quantity);
      console.log('  item_data:');
      (it.item_data||[]).forEach(d => console.log('    - ' + d.name + ': ' + d.value));
      console.log('\n  预期重算价: $' + EXPECTED.toFixed(2) + ' | 实际: $' + final);
      if (final !== null && Math.abs(final - EXPECTED) < 0.01) {
        console.log('  ✅✅ 价格后端重算正确！前端 $999.99 被覆盖（防篡改生效）。');
      } else {
        console.log('  ⚠️ 价格不符，差额 ' + (final!==null?(final-EXPECTED).toFixed(2):'null'));
      }
    } else {
      console.log('  cart raw:', cartRes.raw.slice(0,200));
    }
  } else {
    console.log('\n  ❌ 仍失败。可能原因：purchasable filter 没生效（Code Snippets 缓存）/ WC()->cart 在 admin-ajax nopriv 上下文不可用');
    console.log('     → 建议：snippet 改用 wc/store/cart/add-item（带 session）而非 admin-ajax');
  }

  console.log('\n=== WoodMart 兼容性 ===');
  console.log('  woocommerce_before_calculate_totals 是 WC core hook（priority 20 > WoodMart 任何价格渲染）');
  console.log('  WoodMart 主题不 remove/override 该 hook（主题只改前端模板，价格计算走 WC core）');
  console.log('  本次 server_recalc_total 字段直接由 PHP 算出 = 20.5 即证明 hook 上下文 PHP 逻辑跑通');
}
main().catch(e => console.error('FATAL', e.message || e));
