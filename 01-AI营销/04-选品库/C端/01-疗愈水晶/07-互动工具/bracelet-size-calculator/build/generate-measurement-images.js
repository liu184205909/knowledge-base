/**
 * 生成 Bracelet Size Calculator 测量方法图（T1-2）
 * 复用 generate-crystal-images.js 的 moleapi gpt-image-2 调用 + sharp resize 逻辑
 *
 * Prompt 三大优化避免手部 AI 瑕疵：
 *   1. 手腕局部 / 不生整手（forearm-to-wrist 侧面，图3 无手）
 *   2. 强化真实皮肤（pores/hairs/veins，反塑料感）
 *   3. 负面指令（no plastic/smooth/extra fingers/deformed）
 *
 * 输出：./images/measure-{tape,paper,existing}.webp（4:3, 1024x768）
 * Usage: node generate-measurement-images.js [--quality medium|high]
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
    key: 'tape', file: 'measure-tape.webp',
    prompt: `Close-up macro photograph of a wrist being measured with a soft yellow fabric tailor's measuring tape. Side angle view, the wrist and lower forearm rest on a clean ivory linen surface, the tape wrapped snugly around the wrist bone with visible centimeter markings reading clearly. Only the forearm down to the base of the hand is in frame — no full spread hand, no fingers splayed, no face. Realistic human skin with visible pores, fine arm hairs, subtle veins, natural skin tone, anatomically correct wrist anatomy. Soft diffused natural window light from the left, shallow depth of field. Calm editorial tutorial photography, warm neutral background. ${COMMON_NEG}`,
  },
  {
    key: 'paper', file: 'measure-paper.webp',
    prompt: `Top-down flat lay tutorial photograph: a strip of white paper that has been wrapped around a wrist to measure circumference, now laid flat on a clean white desk beside a wooden ruler with clear centimeter markings. Only the fingertips of one hand hold the paper flat at the lower edge of the frame — most of the hand is out of frame. Realistic skin texture with visible pores on the visible fingertips, natural daylight, minimal uncluttered composition, light neutral background. Step-by-step measuring tutorial, editorial craft photography style. ${COMMON_NEG}`,
  },
  {
    key: 'existing', file: 'measure-existing.webp',
    prompt: `Top-down flat lay product photograph: a beaded purple amethyst crystal bracelet laid flat and open on a clean ivory surface, with a wooden ruler placed directly beside it showing centimeter markings, demonstrating how to measure the inner circumference of a bracelet. No human hand or skin visible in frame — only the crystal bracelet and the ruler. Soft natural light, minimal, clean editorial product photography, light neutral background. ${COMMON_NEG}`,
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
    console.log(`[${img.key}] generating (size 1024x1024)...`);
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
  console.log('\n完成。图在 build/images/，用 MCP analyze 验证质量。');
}
main().catch(e => { console.error(e); process.exit(1); });
