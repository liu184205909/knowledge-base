/**
 * mock DOM 验证 Bagua APP_JS 渲染（排除 wp_kses/cache，确认 JS 逻辑）
 * 用法：node verify-bagua.js
 */
const fs = require('fs'), path = require('path');
const h = fs.readFileSync(path.join(__dirname, 'bagua-map.html'), 'utf8');
const appB64 = h.match(/id="ebg-app">([^<]*)/)[1];
const dataBlock = h.match(/id="ebg-data">([^<]*)/)[1].replace(/&quot;/g, '"');
const js = Buffer.from(appB64, 'base64').toString('utf8');

const mounts = {};
function mkEl(txt) { return { innerHTML: '', textContent: txt || '', classList: { add: () => {}, remove: () => {}, contains: () => false } }; }
global.document = {
  getElementById: function (id) { if (!mounts[id]) mounts[id] = mkEl(id === 'ebg-data' ? dataBlock : (id === 'ebg-app' ? appB64 : '')); return mounts[id]; },
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  addEventListener: function () {},
  readyState: 'complete'
};
global.window = {};

try { (0, eval)(js); } catch (e) { console.log('❌ eval 异常:', e.message); }

const g = mounts['ebg-grid-mount'] && mounts['ebg-grid-mount'].innerHTML || '';
const d = mounts['ebg-detail-mount'] && mounts['ebg-detail-mount'].innerHTML || '';
console.log('=== Bagua APP_JS 渲染验证 ===');
console.log('九宫 cells:', (g.match(/ebg-cell/g) || []).length, '(应9)');
console.log('gridMount 含 Wealth(back_left):', g.includes('back_left'));
console.log('gridMount 含 9 卦符号:', (g.match(/ebg-tri/g) || []).length, '(应9)');
console.log('detailMount 默认 Wealth:', d.includes('Wealth'));
console.log('detailMount 水晶卡片:', (d.match(/ebg-stone-card/g) || []).length);
console.log('detailMount 激活法:', d.includes('How to activate'));
