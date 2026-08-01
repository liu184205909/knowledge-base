/**
 * Astrology 多图生图（hero 事件视觉+水晶 + diagram 对应图）
 * source_type:
 *   astrology-hero: 占星事件视觉符号 + best_overall 水晶，1536x864，允许画事件符号(逆行箭头/满月/土星环/食相/心),水晶写实
 *   astrology-diagram: 事件×水晶对应图/星座细分, 1024x1024
 *   astrology-hub: 汇总页 hero
 * 已存在跳过（支持补生）
 * 用法：node generate-images.js --slug=mercury-retrograde | (全部缺图) | --type=astrology-hero
 * 需 NODE_PATH 全局 sharp；loadEnv 强制覆盖
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');
const ENV_OVERRIDES = {};
const envPath = path.join(require('os').homedir(), '.env');
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

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const list = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles;
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

function buildPrompt(alt, sourceType, eventName, crystalName) {
  const s = (sourceType || '').toLowerCase();
  if (s === 'astrology-diagram') {
    return `${alt}. A clean editorial infographic showing crystal correspondences for an astrology event, natural crystal gemstones labeled and arranged around a central celestial symbol, soft starlit background, deep indigo and warm gold palette, elegant minimal layout, readable labels, symmetrical balanced composition, highly detailed digital art, premium spiritual editorial quality.`;
  }
  if (s === 'astrology-hub') {
    return `${alt}. A celestial arrangement of natural crystals surrounding a glowing astrological wheel with zodiac symbols and planetary glyphs, deep night sky background, sacred geometry, deep indigo and warm gold palette, glowing light rays, floating luminous particles, symmetrical balanced composition, highly detailed digital art, premium editorial quality. Any astrological symbols must be clearly legible.`;
  }
  const cName = crystalName ? ` paired with a natural ${crystalName} crystal gemstone, realistically rendered with natural texture and color` : '';
  return `A symbolic celestial illustration for the astrology event ${eventName}: ${alt}${cName}. The event's astrological symbol (such as a planet glyph, moon phase, or zodiac sign) must be clearly legible and prominent, rendered in elegant luminous golden line work with a soft glow against a deep indigo night sky. Sacred geometry motifs, glowing stars and light rays, floating luminous particles, symmetrical balanced composition, mystical atmosphere, highly detailed digital art, premium editorial quality.`;
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
  const eventName = art.name || art.slug;
  const crystalName = art.crystals && art.crystals.best_overall ? art.crystals.best_overall.name : null;
  const prompt = buildPrompt(img.alt, img.source_type, eventName, crystalName);
  const isSquare = img.source_type === 'astrology-diagram';
  const size = isSquare ? '1024x1024' : '1536x1024';
  console.log(`[${art.slug}/${key}] ${size}`);
  try {
    const res = await requestImage(prompt, size, 'medium');
    const d = res.data && res.data[0];
    if (!d) { console.log(`  X no image: ${JSON.stringify(res).slice(0, 150)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`  X no b64/url`); return false; }
    const sharp = require('sharp');
    const outSize = isSquare ? [1024, 1024] : [1536, 864];
    await sharp(buf).resize(outSize[0], outSize[1], { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log(`  OK ${key}`);
    return true;
  } catch (e) { console.log(`  X ${key}: ${e.message}`); return false; }
}

(async () => {
  if (!API_KEY) { console.error('X ~/.env missing OPENAI_API_KEY'); process.exit(1); }
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
  console.log(`\nDone ok=${ok} skip=${skip} fail=${fail}`);
})();
