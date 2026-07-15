/**
 * Numerology 主词页 hero 生图（moleapi gpt-image-2）
 * 读 articles-mainpages/{slug}.json 的 images.hero → 生 hero-{slug}.webp
 * 需 NODE_PATH 全局 sharp
 * 用法：NODE_PATH=$(npm root -g) node generate-mainpages-images.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path'), https = require('https');
function loadEnv() { const p = path.join(require('os').homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles-mainpages');
const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');
const slugArg = process.argv.slice(2).find(a => a.startsWith('--slug='))?.split('=')[1];

function reqImg(prompt, size) {
  return new Promise((res, rej) => {
    const u = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality: 'medium', response_format: 'b64_json' });
    const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => {
      let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { res(JSON.parse(d)); } catch (e) { rej(new Error('Bad JSON')); } });
    });
    r.on('error', rej); r.setTimeout(180000, () => r.destroy(new Error('timeout'))); r.write(body); r.end();
  });
}
async function gen(art) {
  const img = art.images && art.images.hero; if (!img) return null;
  const abs = path.join(PROJECT_ROOT, img.file);
  if (fs.existsSync(abs)) { console.log('⏭', art.slug); return 'skip'; }
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const prompt = `${art.title.replace(/:.*/, '')}. Ethereal crystal and spiritual crystal practice art, glowing sacred geometry with subtle number symbolism, premium healing crystal aesthetic, deep indigo and soft gold palette, luminous particles, balanced symmetrical composition, spiritual editorial quality, no readable text, no watermark.`;
  console.log(`[${art.slug}] 生图中...`);
  try {
    const r = await reqImg(prompt, '1536x1024');
    const d = r.data && r.data[0]; if (!d) { console.log('  ✗ 无图'); return false; }
    let buf = d.b64_json ? Buffer.from(d.b64_json, 'base64') : null;
    if (!buf && d.url) buf = await new Promise((res, rej) => https.get(d.url, x => { if (x.statusCode >= 400) return rej(new Error('dl')); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => res(Buffer.concat(c))); }).on('error', rej));
    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(abs);
    console.log('  ✅', art.slug); return true;
  } catch (e) { console.log('  ✗', art.slug, e.message.slice(0, 100)); return false; }
}
(async () => {
  if (!API_KEY) { console.error('✗ 缺 OPENAI_API_KEY'); process.exit(1); }
  let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json'));
  if (slugArg) files = files.filter(f => f === slugArg + '.json');
  console.log('base=' + BASE_URL + ' model=' + MODEL + ' count=' + files.length);
  let ok = 0, fail = 0, skip = 0; const CONC = 3; let cur = 0;
  const workers = Array.from({ length: CONC }, async () => {
    while (true) { const i = cur++; if (i >= files.length) break; const art = JSON.parse(fs.readFileSync(path.join(ART_DIR, files[i]), 'utf8')); const r = await gen(art); if (r === 'skip') skip++; else if (r) ok++; else fail++; }
  });
  await Promise.all(workers);
  console.log(`\nok=${ok} skip=${skip} fail=${fail}`);
})();
