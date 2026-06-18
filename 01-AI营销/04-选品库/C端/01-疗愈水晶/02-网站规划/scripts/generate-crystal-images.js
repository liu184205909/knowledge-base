/**
 * Generate crystal article images via OpenAI-compatible API (gpt-image-2).
 *
 * 国内中转站 / OpenRouter / 官方都走同一套 OpenAI 兼容格式，base_url 在 ~/.env 配。
 *
 * Usage:
 *   node generate-crystal-images.js [jsonPath]                 # 默认 medium 质量
 *   node generate-crystal-images.js [jsonPath] --quality low   # 更便宜
 *   node generate-crystal-images.js [jsonPath] --dry-run       # 只打印 prompt，不调 API
 *
 * ~/.env 需配置（你选定中转站后填）:
 *   OPENAI_BASE_URL=https://你的中转站地址/v1
 *   OPENAI_API_KEY=sk-xxx
 *   IMAGE_MODEL=gpt-image-2
 *
 * 读 {jsonPath} 的 images（每张有 file/alt/source_type）→ 对每张生图
 * → 保存到 02-网站规划/assets/images/generated/{file-stem}.png
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
const sharp = require('sharp');

// ---- 读 ~/.env 的 OPENAI_* ----
function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    if (k.startsWith('OPENAI_') || k === 'IMAGE_MODEL') process.env[k] = t.slice(eq + 1).trim();
  }
}
loadEnv();

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.resolve(PROJECT_ROOT, 'assets/images/generated');

// source_type → 摄影风格修饰
function styleFor(sourceType) {
  const s = (sourceType || '').toLowerCase();
  if (s.includes('closeup')) return 'macro close-up photograph, fine surface texture, soft natural light, shallow depth of field';
  if (s.includes('wearing') || s.includes('product')) return 'lifestyle product photograph worn in daily use, natural daylight, real skin, authentic, warm tone';
  if (s.includes('scene') || s.includes('diagram')) return 'natural lifestyle scene photograph, soft window light, calm muted background, realistic';
  return 'high-quality studio photograph, soft even lighting, neutral background, realistic';
}

// 图片位 → OpenAI size（gpt-image-2 支持 1024x1024 / 1536x1024 / 1024x1536）
function sizeFor(key) {
  return key === 'form_bracelet' ? '1024x1024' : '1536x1024'; // 横幅 3:2，方形 1:1
}

function buildPrompt(alt, sourceType, crystalName) {
  // alt 已是描述性英文文本（如 "Coral meaning guide with red coral branch specimen"）
  return `${alt}. ${styleFor(sourceType)}. Photorealistic, no text, no watermark, no human face unless specified. Editorial crystal/gemstone content quality.`;
}

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality });
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 500)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const jsonPath = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--quality' && args[i - 1] !== '--only') || path.resolve(PROJECT_ROOT, '../04-内容生产/crystal-meaning/coral-meaning.json'));
  const qualityIdx = args.indexOf('--quality');
  const quality = qualityIdx >= 0 ? args[qualityIdx + 1] : 'medium'; // low | medium | high
  const dryRun = args.includes('--dry-run');
  const onlyIdx = args.indexOf('--only');
  const onlyKey = onlyIdx >= 0 ? args[onlyIdx + 1] : null;  // --only benefits 只生指定图

  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL}\nmodel=${MODEL}\nquality=${quality}\ndry_run=${dryRun}\n`);

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const images = data.images || {};
  const outDir = path.join(GENERATED_DIR, 'crystal-meaning', data.slug.replace(/-meaning$/, '')); // generated/crystal-meaning/{crystal}/ 对齐 amethyst
  fs.mkdirSync(outDir, { recursive: true });

  for (const [key, img] of Object.entries(images)) {
    if (onlyKey && key !== onlyKey) continue;  // --only 只生指定图
    const prompt = buildPrompt(img.alt, img.preferred_source_type || img.source_type, data.slug);
    const size = sizeFor(key);
    console.log(`[${key}] size=${size}\n  prompt: ${prompt}`);
    if (dryRun) { console.log('  (dry-run, 跳过)\n'); continue; }

    try {
      const res = await requestImage(prompt, size, quality);
      const item = (res.data && res.data[0]) || {};
      const b64 = item.b64_json || (item.url ? null : null); // gpt-image 系列返回 b64_json
      if (!b64 && !item.url) { console.error('  ✗ 无 b64_json/url:', JSON.stringify(res).slice(0, 200)); continue; }

      const outName = path.basename(img.file || key + '.png').replace(/\.(webp|png|jpg|jpeg)$/i, '') + '.png';
      const outPath = path.join(outDir, outName);
      if (b64) {
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      } else {
        // 极少数中转站返回 url，下载
        const r = await new Promise((rs, rj) => { https.get(item.url, (x) => { const c=[]; x.on('data',(d)=>c.push(d)); x.on('end',()=>rs(Buffer.concat(c))); }).on('error', rj); });
        fs.writeFileSync(outPath, r);
      }
      // sharp: 按 key 强制目标尺寸（form 方图，其余 16:9 横幅）+ 转 webp + 删 png
      // gpt-image-2 的 size 参数不严格（返回方向乱），用 resize cover 兜底统一尺寸
      const webpPath = outPath.replace(/\.png$/i, '.webp');
      const tw = 1536;  // 全部 16:9 横幅（含 form_bracelet，按用户要求统一）
      const th = 864;
      await sharp(outPath)
        .resize(tw, th, { fit: 'cover', position: 'center' })
        .webp({ quality: 82 })
        .toFile(webpPath);
      fs.unlinkSync(outPath); // 删 png，只留 webp
      img.file = path.relative(PROJECT_ROOT, webpPath).replace(/\\/g, '/'); // 回填 webp 路径，供上传脚本找图
      console.log(`  ✓ 保存 ${webpPath}\n`);
    } catch (e) {
      console.error(`  ✗ 生图失败: ${e.message}\n`);
    }
  }
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8'); // 回填 images.file（完整相对路径 + png）到 json
  console.log('完成。json images.file 已回填相对路径（含 png 扩展名）。后续用 upload-post-content-gemstone.js --upload-images 上传。');
}

main().catch(e => { console.error(e); process.exit(1); });
