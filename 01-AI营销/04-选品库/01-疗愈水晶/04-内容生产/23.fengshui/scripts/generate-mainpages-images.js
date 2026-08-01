/**
 * Feng Shui 主词页 hero 生图（moleapi gpt-image-2）
 * 读 articles-mainpages/{slug}.json 的 images.hero → 生 hero-{slug}.webp
 * 需 NODE_PATH 全局 sharp；reqImg 重试3次（moleapi 偶发 timeout/5xx，memory moleapi-image-gen-strategy）
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
    r.on('error', rej); r.setTimeout(240000, () => r.destroy(new Error('timeout'))); r.write(body); r.end();
  });
}
async function reqImgRetry(prompt, size, tries) {
  tries = tries || 3;
  for (let i = 0; i < tries; i++) {
    try { return await reqImg(prompt, size); }
    catch (e) { const retryable = /timeout|HTTP 5\d\d|524|500|503|overloaded|cpu|socket|ECONNRESET|ETIMEDOUT/i.test(e.message); if (!retryable || i === tries - 1) throw e; console.log('    重试 ' + (i + 1) + '/' + (tries - 1) + ': ' + e.message.slice(0, 60)); await new Promise(r => setTimeout(r, 6000)); }
  }
}
async function gen(art) {
  const img = art.images && art.images.hero; if (!img) return null;
  const abs = path.join(PROJECT_ROOT, img.file);
  if (fs.existsSync(abs)) { console.log('⏭', art.slug); return 'skip'; }
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const prompt = `${art.title.replace(/:.*/, '')}. Serene feng shui concept art, a glowing bagua nine-grid mandala with crystals placed at the cardinal points, Eastern-inspired sacred geometry, warm earth tones with jade green and citrine gold accents, balanced symmetrical composition, calm luminous atmosphere, premium spiritual editorial quality, no readable text, no watermark.`;
  console.log(`[${art.slug}] 生图中...`);
  try {
    const r = await reqImgRetry(prompt, '1536x1024');
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
  let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json')).filter(f => {
    try { const a = JSON.parse(fs.readFileSync(path.join(ART_DIR, f), 'utf8')); const h = a.images && a.images.hero; return !h || !fs.existsSync(path.join(PROJECT_ROOT, h.file)); } catch (e) { return true; }
  });
  if (slugArg) files = files.filter(f => f === slugArg + '.json');
  else { const OFFSET = parseInt(process.argv.slice(2).find(a => a.startsWith('--offset='))?.split('=')[1] || '0'); const LIMIT = parseInt(process.argv.slice(2).find(a => a.startsWith('--limit='))?.split('=')[1] || '0'); if (OFFSET) files = files.slice(OFFSET); if (LIMIT) files = files.slice(0, LIMIT); }
  console.log('base=' + BASE_URL + ' model=' + MODEL + ' count=' + files.length + ' (待生成)');
  let ok = 0, fail = 0, skip = 0; const CONC = 3; let cur = 0;
  const workers = Array.from({ length: CONC }, async () => {
    while (true) { const i = cur++; if (i >= files.length) break; const art = JSON.parse(fs.readFileSync(path.join(ART_DIR, files[i]), 'utf8')); const r = await gen(art); if (r === 'skip') skip++; else if (r) ok++; else fail++; }
  });
  await Promise.all(workers);
  console.log(`\nok=${ok} skip=${skip} fail=${fail}`);
})();
