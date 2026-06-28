/**
 * Angel Numbers hero 生图（号码视觉化 graphic，允许文字）
 * 与共享 generate-crystal-images.js 区别：不加 "no text"，强调数字清晰可读
 * 读 articles/{slug}.json 的 images.hero(source_type=number-hero) → gpt-image-2 → resize 1536x864 webp
 * 用法：
 *   node generate-images.js --slug=111          # 单篇
 *   node generate-images.js --slug=111 --dry-run # 只看 prompt
 *   node generate-images.js                      # 全 100 篇
 * 需 NODE_PATH 指向全局 sharp
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');

// 加载 ~/.env
function loadEnv() {
  const envPath = path.join(require('os').homedir(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); // 强制覆盖 ~/.env 真源
    }
  }
}
loadEnv();

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const dryRun = args.includes('--dry-run');

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;

// 02-网站规划（hero.file 相对此根）
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

function buildHeroPrompt(alt) {
  // 号码视觉化：允许文字，graphic 设计，强调数字清晰可读
  return `${alt}. The number digits must be clearly legible, correctly formed and prominent as the central focal point, rendered in elegant luminous golden typography with a soft glow. Rich spiritual graphic design, sacred geometry, deep indigo and warm gold palette, glowing light rays, floating luminous particles, symmetrical balanced composition, highly detailed digital art, premium editorial quality.`;
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

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 400) return reject(new Error('dl HTTP ' + res.statusCode));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function processOne(art) {
  const f = path.join(DIR, 'articles', art.slug + '.json');
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  const hero = a.images?.hero;
  if (!hero) { console.log(`[${art.slug}] 无 hero，跳过`); return false; }
  const absFile = path.join(PROJECT_ROOT, hero.file);
  if (fs.existsSync(absFile) && !dryRun) { console.log(`[${art.slug}] 已存在，跳过`); return true; }
  fs.mkdirSync(path.dirname(absFile), { recursive: true });

  const prompt = buildHeroPrompt(hero.alt);
  console.log(`\n[${art.slug}] size=1536x1024\n  prompt: ${prompt.slice(0, 160)}...`);
  if (dryRun) return true;

  try {
    const res = await requestImage(prompt, '1536x1024', 'medium');
    const d = res.data?.[0];
    if (!d) { console.log(`  ✗ 无图返回: ${JSON.stringify(res).slice(0, 200)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await downloadUrl(d.url);
    else { console.log(`  ✗ 无 b64/url: ${JSON.stringify(d).slice(0, 200)}`); return false; }

    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log(`  ✅ ${hero.file}`);
    return true;
  } catch (e) {
    console.log(`  ✗ ${e.message}`);
    return false;
  }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL}\nmodel=${MODEL}\ndry_run=${dryRun}\ncount=${list.length}\n`);
  let ok = 0; const fail = [];
  let cursor = 0;
  const CONCURRENCY = 3; // moleapi 保守并发
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= list.length) break;
      const r = await processOne(list[i]);
      if (r) ok++; else fail.push(list[i].slug);
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ${ok}/${list.length}` + (fail.length ? `，失败: ${fail.join(',')}` : ''));
})();
