// 临时探针：moleapi gpt-image-2 是否恢复（生成 1 张测试图）
const fs = require('fs'), path = require('path'), os = require('os'), https = require('https');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}
const BASE = (env.OPENAI_BASE_URL || '').replace(/\/$/, '');
const KEY = env.OPENAI_API_KEY;
const MODEL = env.IMAGE_MODEL || 'gpt-image-2';
const u = new URL(BASE + '/images/generations');
const body = JSON.stringify({ model: MODEL, prompt: 'a single red rose on white background, simple test', size: '1024x1024', quality: 'low', response_format: 'b64_json' });
const req = https.request({
  hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: 'POST',
  headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTTP', res.statusCode);
    try {
      const j = JSON.parse(d);
      const ok = !!(j.data && j.data[0]);
      const len = j.data && j.data[0] && j.data[0].b64_json ? j.data[0].b64_json.length : 0;
      console.log('ok:', ok, 'b64_len:', len);
      if (!ok) console.log('body:', d.slice(0, 300));
    } catch (e) {
      console.log('raw:', d.slice(0, 300));
    }
    process.exit(0);
  });
});
req.on('error', e => { console.log('ERR:', e.message); process.exit(1); });
req.setTimeout(50000, () => { req.destroy(new Error('timeout')); console.log('TIMEOUT'); });
req.write(body);
req.end();
