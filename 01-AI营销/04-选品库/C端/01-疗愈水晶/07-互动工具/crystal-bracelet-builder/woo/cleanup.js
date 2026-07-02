/** 清理：把测试产品49026改回draft（不在前台），snippet保留（第1步复用）。cart的测试item会随session过期自动消失。*/
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');
(async () => {
  const r = await E.apiRequest('/wp-json/wc/v3/products/49026', 'POST', { status: 'draft' });
  console.log('product 49026 -> draft:', r.id ? 'OK status=' + r.status : 'FAIL ' + JSON.stringify(r).slice(0,150));
  console.log('snippet 20 保留（第1步复用），可后台手动禁用');
  console.log('cart 测试 item 随 session 过期自动清空');
})();
