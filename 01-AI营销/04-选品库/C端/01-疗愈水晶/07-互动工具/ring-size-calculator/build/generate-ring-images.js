/**
 * 生成 Ring Size Calculator 测量方法图（R-2）
 * 复用 bracelet generate-measurement-images.js 的 moleapi gpt-image-2 + sharp 逻辑
 * Prompt 同 T1 三大优化避手部瑕疵：手指局部/真实皮肤/负面指令
 *
 * 输出：./images/measure-{finger,ring,sizer}.webp（4:3, 1024x768）
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
const sharp = (function () {
  try { return require('sharp'); }
  catch (e) {
    const g = require('child_process').execSync('npm root -g').toString().trim();
    return require(g + '/sharp');
  }
})();

function loadEnv() {
  const p = path.join(os.homedir(), '.env');
  if (!fs.existsSync(p)) return;
  for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = l.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    if (k.startsWith('OPENAI_') || k === 'IMAGE_MODEL') process.env[k] = t.slice(eq + 1).trim();
  }
}
loadEnv();
const BASE = (process.env.OPENAI_BASE_URL || '').replace(/\/$/, '');
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const OUT_DIR = path.resolve(__dirname, 'images');
fs.mkdirSync(OUT_DIR, { recursive: true });

const COMMON_NEG = 'No plastic skin, no smooth airbrushed skin, no extra fingers, no deformed hands, no text overlay, no watermark.';

const IMAGES = [
  {
    key: 'finger', file: 'measure-finger.webp',
    prompt: `Close-up macro photograph of a single finger being measured with a thin white paper strip wrapped snugly around its base (the knuckle area). The paper strip is marked with a small pen dot where it overlaps. Only one finger and the immediate surrounding skin is in frame — no full palm spread, no face. Realistic human skin with visible pores, fine finger texture, subtle nail edge, anatomically correct single finger. Soft diffused natural daylight, shallow depth of field, clean light neutral background. Calm editorial tutorial photography. ${COMMON_NEG}`,
  },
  {
    key: 'ring', file: 'measure-ring.webp',
    prompt: `Top-down flat lay product photograph: a single crystal ring with a purple amethyst stone, laid flat on a clean ivory linen surface, with a wooden ruler placed directly beside it showing clear millimeter markings, demonstrating how to measure the inner diameter of a ring across its center. No human hand or skin visible in frame — only the crystal ring and the wooden ruler. Soft natural light, minimal uncluttered composition, editorial product photography. ${COMMON_NEG}`,
  },
  {
    key: 'sizer', file: 'measure-sizer.webp',
    prompt: `Top-down flat lay product photograph: a plastic multi-size ring sizer tool — a fan-shaped set of graduated metal ring-sizing bands — laid open on a clean ivory surface beside a wooden ruler. No human hand or skin visible in frame — only the ring sizer tool and the ruler. Soft natural light, minimal, clean editorial product photography, light neutral background. ${COMMON_NEG}`,
  },
];

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const u = new URL(BASE + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality });
    const req = https.request({
      hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: 'POST',
      headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + d.slice(0, 500)));
        try { resolve(JSON.parse(d)); } catch (e) { reject(new Error('Bad JSON: ' + d.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  if (!KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  const qIdx = process.argv.indexOf('--quality');
  const quality = qIdx >= 0 ? process.argv[qIdx + 1] : 'medium';
  console.log(`base=${BASE}\nmodel=${MODEL}\nquality=${quality}\n`);
  for (const img of IMAGES) {
    console.log(`[${img.key}] generating...`);
    try {
      const res = await requestImage(img.prompt, '1024x1024', quality);
      const item = (res.data && res.data[0]) || {};
      const b64 = item.b64_json;
      if (!b64 && !item.url) { console.error('  ✗ 无图:', JSON.stringify(res).slice(0, 200)); continue; }
      const pngPath = path.join(OUT_DIR, img.file.replace(/\.webp$/, '.png'));
      if (b64) fs.writeFileSync(pngPath, Buffer.from(b64, 'base64'));
      else {
        const r = await new Promise((rs, rj) => https.get(item.url, x => { const c = []; x.on('data', d => c.push(d)); x.on('end', () => rs(Buffer.concat(c))); }).on('error', rj));
        fs.writeFileSync(pngPath, r);
      }
      const webpPath = path.join(OUT_DIR, img.file);
      await sharp(pngPath).resize(1024, 768, { fit: 'cover', position: 'center' }).webp({ quality: 82 }).toFile(webpPath);
      fs.unlinkSync(pngPath);
      console.log(`  ✓ ${webpPath}`);
    } catch (e) { console.error(`  ✗ ${img.key}: ${e.message}`); }
  }
  console.log('\n完成。图在 build/images/。');
}
main().catch(e => { console.error(e); process.exit(1); });
