/**
 * 按 content-v1.md 的 Hero 图片需求生成 8 张 intention hero 图。
 * moleapi gpt-image-2，sharp 强制 1536x864 webp。
 *
 * Usage:
 *   NODE_PATH=$(npm root -g) node generate-intention-hero.js            # 生 8 张
 *   NODE_PATH=$(npm root -g) node generate-intention-hero.js --dry-run   # 只打印 prompt
 *   NODE_PATH=$(npm root -g) node generate-intention-hero.js calm-mindfulness  # 只生 1 个
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
let sharp = null;
try { sharp = require('sharp'); } catch (e) {}

function loadEnv() {
  const p = path.join(os.homedir(), '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    if (k.startsWith('OPENAI_') || k === 'IMAGE_MODEL') process.env[k] = t.slice(eq + 1).trim();
  }
}
loadEnv();
const BASE_URL = (process.env.OPENAI_BASE_URL || '').replace(/\/$/, '');
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const OUT_DIR = path.resolve(__dirname, '../assets/images/generated/intentions/hero-v1');

const HERO = {
  'calm-mindfulness': 'Serene natural-light scene with amethyst, howlite, and selenite crystals arranged on a soft linen cloth beside an open journal, calm and mindful morning atmosphere, soft diffused light. Photorealistic, no medical imagery, no text, no watermark.',
  'abundance-success': 'Warm golden natural-light scene with citrine, pyrite, green aventurine, and tiger eye crystals on a wooden surface, abundance and opportunity mood, soft sunlight. Photorealistic, no coins, no cash, no luxury brand symbols, no text, no watermark.',
  'health-vitality': 'Fresh natural-light scene with bloodstone, red jasper, carnelian, and jade crystals near green leaves and a glass of water, vibrant life-force and wellness energy, bright daylight. Photorealistic, no medical imagery, no text, no watermark.',
  'personal-empowerment': 'Warm natural-light scene with tiger eye, carnelian, citrine, and labradorite crystals on a dark leather surface, confident and empowering atmosphere, directional warm light. Photorealistic, not exaggerated, no text, no watermark.',
  'protection-clearing': 'Dark moody natural-light scene with black tourmaline, obsidian, and clear quartz crystals on dark stone, stable and grounded protection feel, single shaft of light. Photorealistic, not scary, not mystical, no text, no watermark.',
  'spiritual-connection': 'Quiet ritual altar scene with amethyst, clear quartz, selenite, and labradorite crystals, soft candlelight, spiritual meditation atmosphere, gentle smoke. Photorealistic, no exaggerated starlight or magic effects, no text, no watermark.',
  'transformation': 'Natural-light scene with labradorite, moonstone, and malachite crystals near a sunlit doorway at sunrise, sense of transformation and new beginnings. Photorealistic, no magic effects, no text, no watermark.',
  'love-relationships': 'Warm natural-light scene with rose quartz, rhodonite, and ruby crystals on soft fabric with dried petals, loving and heartfelt atmosphere, golden hour light. Photorealistic, no text, no watermark.'
};

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality });
    const req = https.request({ hostname: url.hostname, port: url.port || 443, path: url.pathname + url.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ if(res.statusCode>=400) return reject(new Error('HTTP '+res.statusCode+': '+d.slice(0,400))); try{resolve(JSON.parse(d));}catch(e){reject(new Error('Bad JSON: '+d.slice(0,200)));} }); });
    req.on('error', reject); req.setTimeout(120000,()=>req.destroy(new Error('timeout 120s'))); req.write(body); req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const slug = args.find(a => !a.startsWith('--'));
  const slugs = slug ? [slug] : Object.keys(HERO);
  if (!dryRun && !API_KEY) { console.error('缺 OPENAI_API_KEY'); process.exit(1); }
  console.log('model='+MODEL+' dry_run='+dryRun+' slugs='+slugs.length+'\n');
  if (!dryRun) fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const s of slugs) {
    const prompt = HERO[s];
    const outPath = path.join(OUT_DIR, s + '.webp');
    console.log('[' + s + '] ' + (dryRun ? 'PROMPT' : '生成') + '\n  ' + prompt);
    if (dryRun) { console.log(''); continue; }
    try {
      const res = await requestImage(prompt, '1536x1024', 'medium');
      const item = (res.data && res.data[0]) || {};
      let buf;
      if (item.b64_json) buf = Buffer.from(item.b64_json, 'base64');
      else if (item.url) buf = await new Promise((rs,rj)=>https.get(item.url,x=>{const c=[];x.on('data',d=>c.push(d));x.on('end',()=>rs(Buffer.concat(c)));}).on('error',rj));
      if (!buf) { console.error('  ✗ 无图'); continue; }
      await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 82 }).toFile(outPath);
      console.log('  ✓ ' + outPath);
    } catch (e) { console.error('  ✗ ' + e.message); }
    if (!dryRun) await new Promise(r => setTimeout(r, 500));
  }
  console.log('\n完成。输出: ' + OUT_DIR);
}
main().catch(e => { console.error(e); process.exit(1); });
