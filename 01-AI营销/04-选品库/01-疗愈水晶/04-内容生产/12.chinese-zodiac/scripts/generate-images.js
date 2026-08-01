/**
 * Chinese Zodiac 生图（hero + animal 象征 + lucky_stone 实拍）
 * source_type:
 *   - zodiac-hero: hero 图 — 生肖动物 motif + 代表石 flat-lay，Eastern 美学（暖色 linen / 木桌面 / 玉石质感）
 *   - zodiac-animal: 生肖动物象征图（元素主题色，无文字）
 *   - scene: 真实水晶摄影（lucky stone 实拍，无文字）
 * gpt-image-2 via moleapi，loadEnv 强制覆盖 shell 错误占位 key（shell-envkey-override-loadenv memory）
 * 需 NODE_PATH="$(npm root -g)" sharp（crystal-scripts-nodepath-sharp memory）
 * 已存在的跳过（支持补生）
 * 用法：
 *   NODE_PATH="$(npm root -g)" node generate-images.js --slug=dragon-crystals
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

// 生肖动物中文名（用于 prompt 东方意象）
const ANIMAL_CN = { rat: 'rat (鼠)', ox: 'ox (牛)', tiger: 'tiger (虎)', rabbit: 'rabbit (兔)', dragon: 'dragon (龙)', snake: 'snake (蛇)', horse: 'horse (马)', goat: 'goat (羊)', monkey: 'monkey (猴)', rooster: 'rooster (鸡)', dog: 'dog (狗)', pig: 'pig (猪)' };
const ELEMENT_COLOR = { Wood: 'soft greens and browns', Fire: 'warm reds and oranges', Earth: 'earthy yellows and terracotta', Metal: 'whites golds and silvers', Water: 'deep blues and blacks' };

function buildPrompt(alt, sourceType, slug) {
  const s = (sourceType || '').toLowerCase();
  // 提取动物 key（dragon-crystals → dragon）
  const animalKey = slug ? slug.replace(/-crystals$/, '').replace(/fire-horse-2026/, 'horse').replace(/year-crystals|find-your-sign/, '') : '';
  const cn = ANIMAL_CN[animalKey];
  if (s.includes('zodiac-hero')) {
    if (slug === 'fire-horse-2026') {
      return `${alt}. Editorial hero photograph for a Chinese zodiac Fire Horse year feature: a stylized noble horse motif alongside signature crystals (citrine, jade, black tourmaline, smoky quartz) arranged as a flat-lay, warm Fire-element palette of reds oranges and golds tempered by grounding earthy tones, Eastern aesthetic with linen textile and light wood surface, soft natural window light, real mineral photography with visible texture and light refraction, calm balanced composition, no text overlay, no watermark, no human face. Cultural-appreciation quality.`;
    }
    if (slug === 'year-crystals') {
      return `${alt}. Editorial hero photograph for a Chinese zodiac crystals complete guide: all 12 zodiac animal motifs (rat ox tiger rabbit dragon snake horse goat monkey rooster dog pig) arranged in an elegant circular or grid composition alongside representative crystals, balanced Eastern aesthetic, warm linen textile and light wood surface, soft natural window light, real mineral photography with visible texture, cultural-appreciation quality, no text overlay, no watermark, no human face.`;
    }
    if (slug === 'find-your-sign') {
      return `${alt}. Editorial hero photograph for a Chinese zodiac find-your-sign year table: a clean 12-position circular arrangement of zodiac animal motifs with a subtle lunar-cycle theme, warm Eastern aesthetic, linen textile and light wood surface, soft natural light, balanced composition, no text overlay, no watermark, no human face. Reference-quality cultural illustration.`;
    }
    return `${alt}. Editorial hero photograph for a Chinese zodiac crystals feature: a stylized ${cn || 'zodiac animal'} motif alongside its traditional crystals arranged as a flat-lay, warm Eastern aesthetic with linen textile and light wood surface, soft natural window light, real mineral photography with visible texture and light refraction, calm balanced composition, no text overlay, no watermark, no human face. Cultural-appreciation quality.`;
  }
  if (s.includes('zodiac-animal')) {
    return `${alt}. A graceful artistic rendering of the Chinese zodiac ${cn || "animal"} symbol, subtle elemental color theme, Eastern brush-and-ink inspired aesthetic mixed with soft mineral-texture illustration, balanced composition with soft natural light, cultural-appreciation quality, no text overlay, no watermark, no human face.`;
  }
  // scene（真实水晶摄影无文字）
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
  const prompt = buildPrompt(img.alt, img.source_type, art.slug);
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
