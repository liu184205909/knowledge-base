/**
 * 备用生图：Agnes AI agnes-image-2.1-flash（moleapi/gpt-image-2 撞 Free limit 或持续过载时切）
 *
 * 复用 4 类图清单（articles-{yesno,minor,spreads,beginner}-images.json）
 * Agnes 返回 url → 下载 png → sharp resize 1536x864 webp
 * 注：Agnes 颜色精度稍逊（rose quartz 可能画成透明），仅作 moleapi 不可用时的备选
 *
 * 用法：node generate-agnes-images.js [limit]   limit=测试张数(缺省=全)
 * 需 NODE_PATH 全局 sharp；~/.env 含 AGNES_API_KEY/AGNES_BASE_URL/AGNES_IMAGE_MODEL
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');
const LIMIT = parseInt(process.argv[2]) || 0;

// loadEnv 强制覆盖（shell 可能有错误 key 占位）
const ENV_OVERRIDES = {};
const envPath = path.join(require('os').homedir(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) ENV_OVERRIDES[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.AGNES_BASE_URL || '').replace(/\/$/, '');
const MODEL = process.env.AGNES_IMAGE_MODEL || 'agnes-image-2.1-flash';
const API_KEY = process.env.AGNES_API_KEY;

function requestImage(prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size: '1024x1024' });
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

function downloadBuf(url) {
  return new Promise((r, j) => https.get(url, x => {
    if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode));
    const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c)));
  }).on('error', j));
}

// 任务列表（4 类，与 generate-yesno-minor-images.js 一致）
const tasks = [];
function loadList(file, sub) {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', file), 'utf8'));
  for (const [slug, a] of Object.entries(j.articles)) {
    const crystal = a.crystals && a.crystals[0];
    const crystalName = crystal ? crystal.name : '';
    tasks.push({ slug, prompt: a.hero.prompt, crystalName, outFile: path.join(DIR, 'generated', sub, a.hero.file) });
  }
}
loadList('articles-yesno-images.json', 'yesno');
loadList('articles-minor-images.json', 'minor');
loadList('articles-spreads-images.json', 'spreads');
loadList('articles-beginner-images.json', 'beginner');

async function processTask(t) {
  if (fs.existsSync(t.outFile)) return 'skip';
  fs.mkdirSync(path.dirname(t.outFile), { recursive: true });
  process.stdout.write(`[${t.slug}] `);
  const prefix = t.crystalName ? `A large prominent ${t.crystalName} crystal cluster resting in the FOREGROUND at the bottom, detailed facets and natural color clearly visible, large and unmistakable as a central focal point alongside the main figure. ` : '';
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await requestImage(prefix + t.prompt);
      const d = res.data && res.data[0];
      if (!d) { console.log(`✗ 无图: ${JSON.stringify(res).slice(0, 150)}`); return false; }
      let buf;
      if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
      else if (d.url) buf = await downloadBuf(d.url);
      else { console.log(`✗ 无 b64/url`); return false; }
      const sharp = require('sharp');
      await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(t.outFile);
      console.log(`✅${attempt > 1 ? '(重试' + attempt + ')' : ''}`);
      return true;
    } catch (e) {
      lastErr = e;
      const transient = /429|500|503|524|upstream|timeout|temporarily|overloaded|cpu|rate/i.test(e.message);
      // 400 内容过滤不重试（改 prompt 才能救）
      if (attempt < 3 && transient) {
        await new Promise(r => setTimeout(r, 8000));
        process.stdout.write(`[重试${attempt + 1}]`);
        continue;
      }
      console.log(`✗ ${e.message.slice(0, 150)}`);
      return false;
    }
  }
  console.log(`✗ ${lastErr.message.slice(0, 150)}`);
  return false;
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 AGNES_API_KEY'); process.exit(1); }
  if (!BASE_URL) { console.error('✗ ~/.env 缺 AGNES_BASE_URL'); process.exit(1); }
  const todo = tasks.filter(t => !fs.existsSync(t.outFile));
  const run = LIMIT ? todo.slice(0, LIMIT) : todo;
  console.log(`[Agnes 备用] base=${BASE_URL} model=${MODEL} 总${tasks.length} 待生${todo.length} 本次${run.length}(limit=${LIMIT}) 并发6\n`);
  let ok = 0, fail = 0, skip = 0, cursor = 0;
  const CONCURRENCY = 6;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= run.length) break;
      const r = await processTask(run[i]);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else fail++;
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ok=${ok} skip=${skip} fail=${fail} / ${run.length}`);
})();
