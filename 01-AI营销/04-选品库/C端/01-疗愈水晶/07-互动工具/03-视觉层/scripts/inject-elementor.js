/**
 * 注入工具到 page 43180 的 _elementor_data（HTML widget）
 * 测试 WP REST 能否更新 protected meta _elementor_data
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

// 读 ~/.env 凭证
const envPath = path.join(require('os').homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) env[m[1]] = m[2].trim();
}

const code = fs.readFileSync('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/03-视觉层/compatibility-tool.html', 'utf8');

// 构造 Elementor _elementor_data：section > column > html widget
const elData = JSON.stringify([{
  id: 'ewcsec1', elType: 'section', settings: {}, elements: [{
    id: 'ewccol1', elType: 'column', settings: {}, elements: [{
      id: 'ewchtml1', elType: 'widget', widgetType: 'html', settings: { html: code }, elements: []
    }]
  }]
}]);

const body = JSON.stringify({ meta: { _elementor_data: elData } });
const auth = 'Basic ' + Buffer.from(env.WP_USER + ':' + env.WP_APP_PASSWORD).toString('base64');

const opts = {
  hostname: env.WP_SITE, port: 443, path: '/wp-json/wp/v2/pages/43180?context=edit', method: 'POST',
  headers: { Authorization: auth, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
};
const req = https.request(opts, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTTP', res.statusCode);
    try {
      const j = JSON.parse(d);
      const metaKeys = Object.keys(j.meta || {});
      const dataLen = j.meta && j.meta._elementor_data ? j.meta._elementor_data.length : 0;
      console.log('meta keys:', metaKeys);
      console.log('_elementor_data 长度:', dataLen, '(期望 ~' + elData.length + ')');
      console.log('content.raw 长度:', (j.content && j.content.raw || '').length);
      if (j.code || j.message) console.log('错误:', j.code, j.message);
    } catch (e) { console.log('raw:', d.slice(0, 400)); }
  });
});
req.on('error', e => console.error('ERR', e.message));
req.write(body);
req.end();
