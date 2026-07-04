/**
 * 测试 3 张 hero 图（确认 moleapi 额度 + prompt 效果，不批量）
 * - 是与否 strong-yes: is-the-sun-yes-or-no-love (绿✓)
 * - 是与否 strong-no: is-the-high-priestess-yes-or-no-timing (红✗)
 * - Minor 数字牌: tarot-two-of-wands-crystals (Wands 火元素色)
 * 复用 generate-scenario-images.js 的 moleapi gpt-image-2 + sharp 1536x864 webp 模式
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
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

// 3 张测试图
const TASKS = [
  {
    name: 'strong-yes (绿✓)',
    slug: 'is-the-sun-yes-or-no-love',
    prompt: JSON.parse(fs.readFileSync(path.join(DIR, 'configs/articles-yesno-images.json'), 'utf8')).articles['is-the-sun-yes-or-no-love'].hero.prompt,
    outDir: path.join(DIR, 'generated', 'yesno'),
    file: 'is-the-sun-yes-or-no-love.webp'
  },
  {
    name: 'strong-no (红✗)',
    slug: 'is-the-high-priestess-yes-or-no-timing',
    prompt: JSON.parse(fs.readFileSync(path.join(DIR, 'configs/articles-yesno-images.json'), 'utf8')).articles['is-the-high-priestess-yes-or-no-timing'].hero.prompt,
    outDir: path.join(DIR, 'generated', 'yesno'),
    file: 'is-the-high-priestess-yes-or-no-timing.webp'
  },
  {
    name: 'Minor Wands 火元素',
    slug: 'tarot-two-of-wands-crystals',
    prompt: JSON.parse(fs.readFileSync(path.join(DIR, 'configs/articles-minor-images.json'), 'utf8')).articles['tarot-two-of-wands-crystals'].hero.prompt,
    outDir: path.join(DIR, 'generated', 'minor'),
    file: 'tarot-two-of-wands-crystals.webp'
  }
];

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
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 600)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(240000, () => { req.destroy(new Error('timeout 240s')); });
    req.write(body); req.end();
  });
}

async function processTask(t) {
  fs.mkdirSync(t.outDir, { recursive: true });
  const outFile = path.join(t.outDir, t.file);
  const t0 = Date.now();
  process.stdout.write(`[${t.slug}] 生成中... `);
  try {
    const res = await requestImage(t.prompt, '1536x1024', 'medium');
    const elapsedApi = ((Date.now() - t0) / 1000).toFixed(1);
    const d = res.data && res.data[0];
    if (!d) { console.log(`✗ 无图 (${elapsedApi}s): ${JSON.stringify(res).slice(0, 250)}`); return { ok: false, slug: t.slug, err: 'no image data' }; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`✗ 无 b64/url`); return { ok: false, slug: t.slug, err: 'no b64/url' }; }

    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(outFile);
    const totalSec = ((Date.now() - t0) / 1000).toFixed(1);
    const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
    console.log(`✅ ${totalSec}s total (api ${elapsedApi}s + sharp resize) ${kb}KB → ${outFile}`);
    return { ok: true, slug: t.slug, file: outFile, totalSec, apiSec: elapsedApi, kb };
  } catch (e) {
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`✗ ${sec}s ${e.message}`);
    return { ok: false, slug: t.slug, err: e.message };
  }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL} model=${MODEL}`);
  console.log(`测试 ${TASKS.length} 张 (串行，便于观察每张耗时/额度)\n`);

  const results = [];
  for (const t of TASKS) {
    const r = await processTask(t);
    results.push(r);
    if (!r.ok && /403|额度|余额|quota|insufficient/i.test(r.err || '')) {
      console.log(`\n⚠️ 检测到额度错误，停止后续测试：${r.err}`);
      break;
    }
  }

  console.log(`\n=== 测试结果汇总 ===`);
  const ok = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);
  console.log(`成功 ${ok.length} / 失败 ${fail.length} / 共 ${TASKS.length}`);
  for (const r of results) {
    console.log(r.ok ? `  ✅ ${r.slug} (${r.totalSec}s, ${r.kb}KB)` : `  ✗ ${r.slug}: ${r.err}`);
  }
  if (fail.length) {
    console.log(`\n失败详情（用于判断是否额度问题）：`);
    for (const r of fail) console.log(`  ${r.slug}: ${r.err}`);
  }
})();
