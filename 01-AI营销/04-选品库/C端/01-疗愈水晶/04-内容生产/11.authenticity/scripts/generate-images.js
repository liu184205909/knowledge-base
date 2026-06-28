/**
 * 真伪鉴别生图（hero + comparison 真假对比 + test/diagram 示意图）
 * source_type:
 *   - comparison: 真假水晶实拍对比，允许 left/right 视觉标注（如 "natural vs glass"），无文字水印
 *   - diagram: 示意图/信息图（Mohs 表/测试示意），允许文字标签
 * gpt-image-2 via moleapi，loadEnv 强制覆盖 shell 错误占位 key（shell-envkey-override-loadenv memory）
 * 需 NODE_PATH="$(npm root -g)" sharp（crystal-scripts-nodepath-sharp memory）
 * 已存在的跳过（支持补生）
 * 用法：
 *   NODE_PATH="$(npm root -g)" node generate-images.js --slug=how-to-tell-if-crystal-is-real
 *   NODE_PATH="$(npm root -g)" node generate-images.js  # 跑全部
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');

// loadEnv 强制覆盖（shell 可能有错误 OPENAI_API_KEY=sk-local 占位，必须 force 覆盖 ~/.env 真源）
function loadEnv() {
  const envPath = path.join(require('os').homedir(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const m = t.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

function buildPrompt(alt, sourceType) {
  const s = (sourceType || '').toLowerCase();
  if (s.includes('comparison')) {
    // 真假水晶对比实拍：左右分屏，真实矿物摄影质感，无文字水印
    return `${alt}. Side-by-side comparison photograph split into left and right halves showing genuine natural crystal versus imitation, real mineral photography with visible texture, inclusions, and light refraction, soft natural studio light, neutral calm background, clearly differentiated specimens, realistic editorial mineral content quality, no text overlay, no watermark, no human face.`;
  }
  if (s.includes('diagram')) {
    // 示意图/信息图（Mohs 表/测试示意）：允许文字标签
    return `${alt}. Clean educational infographic with clearly legible text labels and mineral data, balanced composition, soft natural lighting, accurate mineral colors and textures, professional gemology reference quality, any text must be correctly formed and prominent, no watermark.`;
  }
  // 默认 scene（hero 用，真实水晶摄影无文字）
  return `${alt}. Natural crystal photography, real gemstones with visible texture and light refraction, soft natural window light, calm muted background, realistic, no text, no watermark, no human face. Editorial crystal content quality.`;
}

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
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 500)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function processImg(art, key, img) {
  if (typeArg && key !== typeArg) return null;
  const absFile = path.join(PROJECT_ROOT, img.file);
  if (fs.existsSync(absFile)) return 'skip';
  fs.mkdirSync(path.dirname(absFile), { recursive: true });
  const prompt = buildPrompt(img.alt, img.source_type);
  const size = '1536x1024';
  const outSize = key === 'hero' ? [1536, 864] : [1200, 800];
  console.log(`[${art.slug}/${key}] ${img.source_type} → ${outSize[0]}x${outSize[1]}`);
  try {
    const res = await requestImage(prompt, size, 'medium');
    const d = res.data?.[0];
    if (!d) { console.log(`  ✗ 无图: ${JSON.stringify(res).slice(0, 150)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', d => c.push(d)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`  ✗ 无 b64/url`); return false; }
    const sharp = require('sharp');
    await sharp(buf).resize(outSize[0], outSize[1], { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log(`  ✅ ${key}`);
    return true;
  } catch (e) { console.log(`  ✗ ${key}: ${e.message}`); return false; }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY（或被 shell 占位覆盖，检查 loadEnv）'); process.exit(1); }
  console.log(`base_url=${BASE_URL} model=${MODEL} count=${list.length} type=${typeArg || 'all'}\n`);
  let ok = 0, fail = 0, skip = 0;
  const tasks = [];
  for (const art of list) {
    const f = path.join(DIR, 'articles', art.slug + '.json');
    if (!fs.existsSync(f)) continue;
    const a = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (!a.images) continue;
    for (const [key, img] of Object.entries(a.images)) {
      tasks.push([art, key, img]);
    }
  }
  const CONCURRENCY = 3;
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) break;
      const [art, key, img] = tasks[i];
      const r = await processImg(art, key, img);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else fail++;
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ok=${ok} skip=${skip} fail=${fail}`);
})();
