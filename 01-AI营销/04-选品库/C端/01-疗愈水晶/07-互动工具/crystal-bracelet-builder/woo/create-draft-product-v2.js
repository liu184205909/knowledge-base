/**
 * 用 elementor-utils（已验证能认证）创建 draft 产品 + 诊断 wc/v3 权限。
 */
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');

(async () => {
  // 1. 复核认证
  const me = await E.apiRequest('/wp-json/wp/v2/users/me', 'GET');
  console.log('[elementor-utils] users/me:', me.id ? 'OK id=' + me.id + ' name=' + me.name + ' roles=' + ((me.roles||[]).join(',')) : 'FAIL ' + JSON.stringify(me).slice(0,120));

  // 2. wc/v3 read test
  const plist = await E.apiRequest('/wp-json/wc/v3/products?per_page=1', 'GET');
  console.log('[wc/v3 GET products]', Array.isArray(plist) ? 'OK count=' + plist.length + ' first=' + (plist[0] && plist[0].name) : 'status=' + (plist.status || JSON.stringify(plist).slice(0,150)));

  // 3. wc/v3 create test
  const created = await E.apiRequest('/wp-json/wc/v3/products', 'POST', {
    name: 'Custom Crystal Bracelet Test',
    type: 'simple',
    regular_price: '0.00',
    virtual: true,
    status: 'draft',
    description: 'T17 builder placeholder (draft). Config in cart_item_data.',
    catalog_visibility: 'hidden',
    stock_status: 'instock'
  });
  if (created && created.id) {
    console.log('[wc/v3 CREATE] OK id=' + created.id + ' status=' + created.status + ' virtual=' + created.virtual + ' price=' + created.regular_price + ' slug=' + created.slug);
  } else {
    console.log('[wc/v3 CREATE] FAIL:', JSON.stringify(created).slice(0,300));
    // 4. fallback: check if user role can't manage woocommerce
    const caps = await E.apiRequest('/wp-json/wp/v2/users/me?context=edit', 'GET');
    console.log('  user capabilities sample:', caps && caps.capabilities ? Object.keys(caps.capabilities).filter(k=>k.indexOf('woocommerce')>=0||k.indexOf('manage_')>=0||k==='administrator').slice(0,10) : (caps&&caps.code?'code='+caps.code:'n/a'));
  }
})();
