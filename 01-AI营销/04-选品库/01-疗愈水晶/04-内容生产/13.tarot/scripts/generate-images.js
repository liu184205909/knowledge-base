/**
 * Tarot 多图生图（hero 牌视觉+水晶 + mini spread 示意）
 * source_type 决定风格：
 *   tarot-hero: 牌的视觉符号 + 该牌 best_overall 水晶，允许罗马数字/牌符号清晰
 *   tarot-spread: 3牌+3水晶小牌阵示意，1024x1024
 *   tarot-hub: 汇总页 hero，22牌总览+水晶
 * 已存在跳过（支持补生）
 * 用法：
 *   node generate-images.js --slug=the-fool   # 单篇
 *   node generate-images.js --type=tarot-hero # 只生某类型
 *   node generate-images.js                   # 全部缺图
 * 需 NODE_PATH 全局 sharp；loadEnv 强制覆盖 shell 错误 key
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');
// loadEnv 强制覆盖（shell 可能有错误 OPENAI_API_KEY 占位）
const ENV_OVERRIDES = {};
const envPath = path.join(require('os').homedir(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) ENV_OVERRIDES[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
// 强制覆盖（不用 !process.env 条件）
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

function buildPrompt(alt, sourceType, cardName, crystalName) {
  const s = (sourceType || '').toLowerCase();
  if (s === 'tarot-spread') {
    return `${alt}. Three tarot cards arranged in a row on a dark velvet surface, each card paired with a natural crystal gemstone placed beside it, soft candlelight, mystical atmosphere, top-down flat lay view, ornate borders, rich spiritual editorial illustration, deep indigo and warm gold palette, symmetrical composition, highly detailed digital art, premium quality. Any roman numerals on cards must be clearly legible and correctly formed.`;
  }
  if (s === 'tarot-hub') {
    return `${alt}. A collection of tarot major arcana cards fanned out around a central cluster of natural crystals, spiritual graphic design, sacred geometry, deep indigo and warm gold palette, glowing light rays, floating luminous particles, symmetrical balanced composition, highly detailed digital art, premium editorial quality. Any roman numerals or symbols must be clearly legible.`;
  }
  // tarot-hero: 牌的视觉符号 + best_overall 水晶
  const cName = crystalName ? ` paired with a ${crystalName} crystal gemstone` : '';
  return `A symbolic illustration for the tarot card ${cardName}: ${alt}${cName}. The card's roman numeral and key visual symbols must be clearly legible, correctly formed and prominent, rendered in elegant luminous golden line work with a soft glow. Rich spiritual graphic design, sacred geometry motifs, deep indigo and warm gold palette, glowing light rays, floating luminous particles, symmetrical balanced composition, mystical atmosphere, highly detailed digital art, premium editorial quality.`;
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
  const cardName = art.name || art.slug;
  const crystalName = art.crystals && art.crystals.best_overall ? art.crystals.best_overall.name : null;
  const prompt = buildPrompt(img.alt, img.source_type, cardName, crystalName);
  const isSquare = img.source_type === 'tarot-spread';
  const size = isSquare ? '1024x1024' : '1536x1024';
  console.log(`[${art.slug}/${key}] ${size}`);
  try {
    const res = await requestImage(prompt, size, 'medium');
    const d = res.data && res.data[0];
    if (!d) { console.log(`  ✗ 无图: ${JSON.stringify(res).slice(0, 150)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`  ✗ 无 b64/url`); return false; }
    const sharp = require('sharp');
    const outSize = isSquare ? [1024, 1024] : [1536, 864];
    await sharp(buf).resize(outSize[0], outSize[1], { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log(`  ✅ ${key}`);
    return true;
  } catch (e) { console.log(`  ✗ ${key}: ${e.message}`); return false; }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL} model=${MODEL} count=${list.length} type=${typeArg || 'all'}\n`);
  let ok = 0, fail = 0, skip = 0;
  const CONCURRENCY = 3;
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
