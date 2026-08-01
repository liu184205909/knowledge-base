/**
 * AI Tarot Chat — 4 tarot reader avatars (gpt-image-2 via moleapi).
 * Style: mystical tarot reader portrait illustration, dark background, golden accents,
 *         consistent style across 4 readers, square composition (face-centric for circular crop).
 * Output: build/images/avatar-{id}.webp (256x256, fit cover center).
 * Re-run safe: skips existing files.
 *
 * Needs NODE_PATH -> global sharp (crystal-scripts-nodepath-sharp memory).
 */
const fs = require('fs'), path = require('path'), https = require('https');
const os = require('os');

function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();
const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error('~/.env missing OPENAI_API_KEY'); process.exit(1); }

const READERS = [
  {
    id: 'seraphina',
    prompt: 'Portrait illustration of Seraphina, a gentle young female tarot reader known as The Healer. ' +
            'Soft warm features, kind empathetic eyes, flowing hair, holding a sprig of herbs and a pink rose close to her heart. ' +
            'She wears a layered shawl in dusty rose and soft pink. ' +
            'Mystical editorial illustration style, delicate linework, painterly. ' +
            'Dark moody background of deep midnight blue with soft pink and lavender glow, faint moonlight, floating particles. ' +
            'Warm golden rim light. Square composition, face centered, head and shoulders. ' +
            'No text, no watermark, no symbols on face.'
  },
  {
    id: 'maverick',
    prompt: 'Portrait illustration of Maverick, a sharp decisive tarot reader known as The Guide. ' +
            'A clear-eyed person with a focused, piercing gaze, strong jaw, neat short hair, wearing a structured dark green and charcoal coat. ' +
            'Confident, restrained, no-nonsense presence, holding a single tarot card edge. ' +
            'Mystical editorial illustration style, clean confident linework, painterly. ' +
            'Dark moody background of deep midnight blue with deep forest green and bronze glow, sharp directional light. ' +
            'Subtle golden rim light. Square composition, face centered, head and shoulders. ' +
            'No text, no watermark, no symbols on face.'
  },
  {
    id: 'oracle',
    prompt: 'Portrait illustration of The Oracle, a mysterious intuitive tarot reader. ' +
            'An enigmatic figure with deep knowing eyes, partly veiled or hooded in flowing deep violet and amethyst robes, ' +
            'cradling a glowing crystal ball that emits soft purple light. Starry ethereal aura, faint constellation motifs. ' +
            'Mystical editorial illustration style, rich detail, painterly, slightly otherworldly. ' +
            'Dark moody background of deep midnight blue and violet with glowing purple and gold light, swirling mist, stars. ' +
            'Golden rim light. Square composition, face centered, head and shoulders. ' +
            'No text, no watermark, no symbols on face.'
  },
  {
    id: 'sage',
    prompt: 'Portrait illustration of Elder Sage, a wise grounded elder tarot reader. ' +
            'A warm weathered elder of indeterminate gender with kind knowing eyes, silver hair, gentle wrinkles, ' +
            'wearing earthy brown and burnished gold robes with a simple jade pendant. ' +
            'Holding a worn tarot deck wrapped in cloth. Practical, caring, lived-wisdom presence. ' +
            'Mystical editorial illustration style, textured painterly, warm. ' +
            'Dark moody background of deep midnight blue with warm amber, brown and burnished gold glow, candlelight warmth. ' +
            'Golden rim light. Square composition, face centered, head and shoulders. ' +
            'No text, no watermark, no symbols on face.'
  }
];

function requestImage(prompt, size) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality: 'medium', response_format: 'b64_json' });
    const req = https.request({
      hostname: url.hostname, port: url.port || 443,
      path: url.pathname + url.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 400)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function genOne(r) {
  const outFile = path.resolve(__dirname, 'images/avatar-' + r.id + '.webp');
  if (fs.existsSync(outFile)) { console.log('[skip]', r.id, '(exists)'); return; }
  console.log('[gen]', r.id, '...');
  try {
    const res = await requestImage(r.prompt, '1024x1024');
    const d = res.data && res.data[0];
    if (!d) { console.log('  x no image:', JSON.stringify(res).slice(0, 200)); return; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) {
      buf = await new Promise((resolve, reject) => https.get(d.url, x => {
        if (x.statusCode >= 400) return reject(new Error('dl ' + x.statusCode));
        const c = []; x.on('data', ck => c.push(ck)); x.on('end', () => resolve(Buffer.concat(c)));
      }).on('error', reject));
    } else { console.log('  x no b64/url'); return; }
    const sharp = require('sharp');
    await sharp(buf).resize(256, 256, { fit: 'cover', position: 'center' }).webp({ quality: 88 }).toFile(outFile);
    console.log('  ok', r.id, (fs.statSync(outFile).size / 1024).toFixed(1) + 'KB');
  } catch (e) { console.log('  x', r.id, e.message); }
}

(async () => {
  console.log('base_url=' + BASE_URL + ' model=' + MODEL);
  for (const r of READERS) { await genOne(r); }
  console.log('\ndone.');
})();
