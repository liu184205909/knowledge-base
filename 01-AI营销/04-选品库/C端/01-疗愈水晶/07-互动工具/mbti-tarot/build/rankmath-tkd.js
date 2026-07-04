// MBTI Tarot TKD — rankmath/v1/updateMeta (objectID=51694, page post_type)
// memory rankmath-tkd-write-ua-curl：必须 User-Agent: curl/8.0.0 避 CF UA 拦截
// 关键：objectType=post（不是 page！）—— Rank Math updateMeta 路由只对 post 放行；
//        page 的 post_type 走 post 路由（post 是任何 post_type 的通用入口），objectType=page 会 403。
// 成功响应：{"slug":true,"schemas":[]}（slug:true 即写入成功）
// 纯 ASCII（em-dash → 连字符 " - "），focus_keyword 单值（不含 \n）
const https = require('https');
const fs = require('fs');
const os = require('os');
const env = fs.readFileSync(os.homedir() + '/.env', 'utf8');
const USER = env.match(/WP_USER=(.+)/)[1].trim();
const PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');

const body = JSON.stringify({
  objectType: 'post',
  objectID: 51694,
  meta: {
    rank_math_title: 'MBTI Tarot Birth Card Calculator: Major Arcana by Type',
    rank_math_description: 'Find your MBTI tarot birth card by personality type. A free Major Arcana mapping with your growth card, three crystals, and an Eastern anchor - for self-reflection.',
    rank_math_focus_keyword: 'mbti tarot'
  }
});

const r = https.request({
  hostname: 'goearthward.com',
  path: '/wp-json/rankmath/v1/updateMeta',
  method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'User-Agent': 'curl/8.0.0' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTTP', res.statusCode);
    console.log('response:', d.slice(0, 600));
    if (d.includes('"slug":true')) console.log('TKD write OK (slug:true)');
  });
});
r.on('error', e => console.log('err:', e.message));
r.write(body);
r.end();
