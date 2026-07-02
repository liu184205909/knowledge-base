const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'ai-live.html'), 'utf8');

console.log('===== 1. eac-app (APP_JS base64) 完整性 =====');
const appMatch = html.match(/id="eac-app">([\s\S]*?)<\/script>/);
console.log('eac-app 块存在:', !!appMatch);
if (appMatch) {
  const b64 = appMatch[1].trim();
  console.log('base64 长度:', b64.length);
  // 检查 base64 是否混入非 base64 字符(wp_kses 破坏迹象)
  const badChars = b64.match(/[^A-Za-z0-9+/=\s]/g);
  console.log('base64 非法字符数:', badChars ? badChars.length : 0, badChars ? badChars.slice(0,5) : '');
  try {
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    console.log('解码后长度:', decoded.length);
    console.log('含 function send:', /function send\(/.test(decoded));
    console.log('含 renderRoles:', /renderRoles/.test(decoded));
    console.log('含 selectRole:', /selectRole/.test(decoded));
    console.log('含 addEventListener(bind):', /addEventListener/.test(decoded));
    const nonAscii = decoded.match(/[^\x00-\x7F]/g);
    console.log('解码后非ASCII字符数:', nonAscii ? nonAscii.length : 0, nonAscii ? nonAscii.slice(0,3) : '');
  } catch(e) {
    console.log('解码失败:', e.message);
  }
}

console.log('\n===== 2. eac-roles (角色数据 base64) =====');
const rolesMatch = html.match(/id="eac-roles">([\s\S]*?)<\/script>/);
if (rolesMatch) {
  const b64 = rolesMatch[1].trim();
  console.log('roles base64 长度:', b64.length);
  const decoded = Buffer.from(b64, 'base64').toString('utf8');
  console.log('含 Seraphina:', decoded.includes('Seraphina'));
  console.log('含 4 个 name 字段:', (decoded.match(/"name"/g)||[]).length);
}

console.log('\n===== 3. 裸 <script> loader 块(关键!) =====');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
console.log('裸 script 块数:', scripts.length);
scripts.forEach((m, i) => {
  const s = m[1];
  console.log(`\n--- 裸 script #${i} ---`);
  console.log('原文:', JSON.stringify(s));
  console.log('含 atob:', s.includes('atob'), '| 含 eval:', s.includes('eval'));
  console.log('含 &&(未转义):', s.includes('&&'), '| 含 &#038;(转义破坏):', s.includes('&#038;'));
});

console.log('\n===== 4. wp:html 块边界 =====');
console.log('含 <!-- wp:html -->:', html.includes('wp:html'));
console.log('HTML 中 eac-chat-panel 出现:', (html.match(/eac-chat-panel/g)||[]).length);
console.log('HTML 中 textarea 出现:', (html.match(/<textarea/g)||[]).length);
