/**
 * T17 验证2 Step 1: 创建 draft 虚拟产品 "Custom Crystal Bracelet Test"
 * 用 wc/store REST（goearthward 用的是 WooCommerce Store API）。
 * 若 wc/store 不支持创建产品（通常只读+加购），fallback 到 wc/v3。
 *
 * Usage: node create-draft-product.js
 */
const https = require('https');
const fs = require('fs');
const os = require('os');

// load creds
function loadEnv() {
  for (const p of [os.homedir() + '/.env', 'D:/Code/.env']) {
    try {
      fs.readFileSync(p, 'utf-8').split('\n').forEach(l => {
        l = l.trim();
        if (!l || l.startsWith('#') || l.indexOf('=') < 1) return;
        const k = l.slice(0, l.indexOf('=')).trim();
        if (!process.env[k]) process.env[k] = l.slice(l.indexOf('=') + 1).trim();
      });
      return;
    } catch (e) {}
  }
}
loadEnv();

const SITE = process.env.WP_SITE || 'goearthward.com';
const AUTH = 'Basic ' + Buffer.from(process.env.WP_USER + ':' + process.env.WP_APP_PASSWORD).toString('base64');

function req(path, method, body) {
  return new Promise((resolve, reject) => {
    const has = body !== undefined && body !== null;
    const payload = has ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const r = https.request({
      hostname: SITE, port: 443, path, method,
      headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(d), raw: d }); }
        catch (e) { resolve({ status: res.statusCode, raw: d }); }
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

(async () => {
  // Try wc/v3 first (admin product creation endpoint; works with app password if user is admin)
  const payload = {
    name: 'Custom Crystal Bracelet Test',
    type: 'simple',
    regular_price: '0.00',
    virtual: true,
    downloadable: false,
    status: 'draft',
    description: 'T17 builder placeholder product (draft, not for sale). Configuration stored in cart_item_data.',
    short_description: 'T17 test',
    catalog_visibility: 'hidden',
    manage_stock: false,
    stock_status: 'instock'
  };

  console.log('Creating draft virtual product via wc/v3...');
  const r = await req('/wp-json/wc/v3/products', 'POST', payload);
  if (r.status === 201 && r.json && r.json.id) {
    console.log('CREATED product id=' + r.json.id + ' | status=' + r.json.status + ' | price=' + r.json.regular_price + ' | virtual=' + r.json.virtual + ' | slug=' + r.json.slug);
    console.log('permalink: ' + r.json.permalink);
    return;
  }
  console.log('wc/v3 create failed. status=' + r.status);
  console.log('response:', (r.raw || JSON.stringify(r.json)).slice(0, 500));

  // fallback: maybe wc/v3 not enabled / app password scope. Try wp/v2 to at least confirm auth.
  const me = await req('/wp-json/wp/v2/users/me', 'GET');
  console.log('auth check users/me:', me.status, me.json && me.json.id ? 'OK id=' + me.json.id + ' roles=' + (me.json.roles||[]).join(',') : 'FAIL');
})();
