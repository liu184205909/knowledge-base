/**
 * MBTI 16 hero 图生图（gpt-image-2 / moleapi 代理）
 * - loadEnv 强制覆盖（shell 错误 OPENAI_API_KEY 占位）
 * - NODE_PATH 全局 sharp
 * - 已存在跳过（支持补生）
 * - 并发 6（moleapi 不限并发），全错误码重试（524/500/503/overloaded/cpu/timeout/429）
 * - 1536x1024 → 1536x864 webp
 * 用法：
 *   node generate-images.js --slug=mbti-intj-tarot   # 单篇
 *   node generate-images.js                            # 全量缺图
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');

// loadEnv 强制覆盖
const ENV_OVERRIDES = {};
const envPath = path.join(os.homedir(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) ENV_OVERRIDES[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

const BASE = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');
const imgMap = JSON.parse(fs.readFileSync(path.join(BASE, 'configs', 'articles-images.json'), 'utf8'));
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality, response_format: 'b64_json' });
    const req = https.request({
      hostname: url.hostname, port: url.port || 443,
      path: url.pathname + url.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 400)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function processWithRetry(prompt, size, quality, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    try { return await requestImage(prompt, size, quality); }
    catch (e) {
      const msg = e.message || '';
      const retriable = /timeout|HTTP 5\d\d|HTTP 429|overloaded|cpu|503|524|500|Bad JSON/i.test(msg);
      if (!retriable || i === retries) throw e;
      console.log('  retry ' + (i+1) + ': ' + msg.slice(0, 80));
      await new Promise(r => setTimeout(r, 10000 * (i+1)));
    }
  }
}

async function genOne(slug) {
  const info = imgMap.articles[slug];
  if (!info || !info.hero) return;
  const absFile = path.join(PROJECT_ROOT, info.hero.file);
  if (fs.existsSync(absFile)) { console.log('⏭ ' + slug); return 'skip'; }
  fs.mkdirSync(path.dirname(absFile), { recursive: true });
  const size = '1536x1024';
  console.log('▶ ' + slug);
  try {
    const res = await processWithRetry(info.hero.prompt, size, 'medium');
    const d = res.data && res.data[0];
    if (!d) { console.log('  ✗ 无图: ' + JSON.stringify(res).slice(0, 150)); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log('  ✗ 无 b64/url'); return false; }
    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log('  ✅ ' + slug);
    return true;
  } catch (e) { console.log('  ✗ ' + slug + ': ' + e.message.slice(0, 150)); return false; }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  const slugs = slugArg ? [slugArg] : Object.keys(imgMap.articles);
  console.log('base=' + BASE_URL + ' model=' + MODEL + ' count=' + slugs.length + ' concurrency=' + CONCURRENCY + '\n');
  let ok = 0, fail = 0, skip = 0;
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= slugs.length) break;
      const r = await genOne(slugs[i]);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else fail++;
    }
  });
  await Promise.all(workers);
  console.log('\n完成 ok=' + ok + ' skip=' + skip + ' fail=' + fail);
})();
