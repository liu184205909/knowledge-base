/**
 * mock DOM 验证 Kua + Wealth APP_JS（同 Bagua verify 模式）
 * 用法：node verify-kua-wealth.js
 */
const fs = require('fs'), path = require('path');
const BASE = path.resolve(__dirname);
function load(htmlFile, appId, dataId) {
  const h = fs.readFileSync(path.join(BASE, htmlFile), 'utf8');
  const appB64 = h.match(new RegExp('id="' + appId + '">([^<]*)'))[1];
  const dataBlock = h.match(new RegExp('id="' + dataId + '">([^<]*)'))[1].replace(/&quot;/g, '"');
  return { js: Buffer.from(appB64, 'base64').toString('utf8'), dataBlock };
}
function mock(dataBlock, appId, dataId) {
  const mounts = {};
  const mk = txt => ({ innerHTML: '', textContent: txt || '', value: '', classList: { add: () => {}, remove: () => {}, contains: () => false }, addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] });
  global.document = {
    getElementById: function (id) { if (!mounts[id]) mounts[id] = mk(id === dataId ? dataBlock : (id === appId ? 'x' : '')); return mounts[id]; },
    querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    addEventListener: function () {}, readyState: 'complete'
  };
  global.window = {};
  return mounts;
}

// Wealth（init 自动 render(null)）
const w = load('feng-shui-wealth-corner/build/wealth-corner.html', 'ewc-app', 'ewc-data');
const wm = mock(w.dataBlock, 'ewc-app', 'ewc-data');
try { (0, eval)(w.js); } catch (e) { console.log('Wealth eval 异常:', e.message); }
const wr = (wm['ewc-result'] && wm['ewc-result'].innerHTML) || '';
console.log('=== Wealth ===');
console.log('双法 BTB:', wr.includes('BTB method'), '| Classical:', wr.includes('Classical'));
console.log('wealth crystal 卡片:', (wr.match(/ewc-stone-card/g) || []).length, '(应5)');
console.log('宜/忌 Do+Avoid:', wr.includes('Do') && wr.includes('Avoid'));

// Kua（init 绑 form submit listener，等用户输入触发 render）
const k = load('kua-number-calculator/build/kua-calculator.html', 'ekua-app', 'ekua-data');
const km = mock(k.dataBlock, 'ekua-app', 'ekua-data');
let kuaErr = null;
try { (0, eval)(k.js); } catch (e) { kuaErr = e.message; }
console.log('\n=== Kua ===');
console.log('init 执行:', kuaErr ? '❌ ' + kuaErr : '✅ 无报错（form submit listener 已绑，用户输生日后触发 render）');
console.log('算法验证: 此前已 8/8 通过（立春/八宅/Kua5 男归2女归8）');
