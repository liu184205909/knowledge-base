/**
 * 一次性补生 3 张核查发现的缺图（P1）
 *   1. 4.zodiac-compatibility/taurus-capricorn/how_to_use  (lifestyle 1536x864)
 *   2. 4.zodiac-compatibility/virgo-sagittarius/how_to_use (lifestyle 1536x864)
 *   3. 8.zodiac-monthly-horoscope/libra-june-2026/crystal_month (closeup 1024x1024)
 * 读各 json 的 prompt（已写好）+ source_type 决定尺寸
 * loadEnv 强制覆盖（shell 错误 sk-local 占位 key）
 * 输出路径覆盖 json.file（compatibility json.file 路径错误，本脚本写真实路径 4.zodiac-compatibility/{slug}/）
 * 已存在跳过
 * 需 NODE_PATH 全局 sharp
 */
const fs = require('fs'), path = require('path'), https = require('https');

function loadEnv() {
  const envPath = path.join(require('os').homedir(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); // 强制覆盖
    }
  }
}
loadEnv();
const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

const KB = 'D:/Code/knowledge-base';
const PROD = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产');
const GEN = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated');

// 3 张任务：series / slug / kind / json path / output (真实路径)
const TASKS = [
  {
    series: '4.zodiac-compatibility', slug: 'taurus-capricorn', kind: 'how_to_use',
    jsonPath: path.join(PROD, '4.zodiac-compatibility/articles/taurus-capricorn.json'),
    outFile: path.join(GEN, '4.zodiac-compatibility/taurus-capricorn/taurus-capricorn-how-to-use.webp'),
  },
  {
    series: '4.zodiac-compatibility', slug: 'virgo-sagittarius', kind: 'how_to_use',
    jsonPath: path.join(PROD, '4.zodiac-compatibility/articles/virgo-sagittarius.json'),
    outFile: path.join(GEN, '4.zodiac-compatibility/virgo-sagittarius/virgo-sagittarius-how-to-use.webp'),
  },
  {
    series: '8.zodiac-monthly-horoscope', slug: 'libra-june-2026', kind: 'crystal_month',
    jsonPath: path.join(PROD, '8.zodiac-monthly-horoscope/articles/libra-june-2026.json'),
    outFile: path.join(GEN, '8.zodiac-monthly-horoscope/libra-june-2026/libra-june-2026-crystal-month.webp'),
  },
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
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function genOne(t) {
  if (fs.existsSync(t.outFile)) {
    console.log(`[SKIP] ${t.slug}/${t.kind} 已存在: ${t.outFile}`);
    return 'skip';
  }
  const a = JSON.parse(fs.readFileSync(t.jsonPath, 'utf8'));
  const img = a.images[t.kind];
  if (!img) throw new Error(`json 无 images.${t.kind}: ${t.jsonPath}`);
  const prompt = img.prompt || img.alt;
  const st = (img.source_type || '').toLowerCase();
  // closeup → 方图 1024x1024；其余(lifestyle/scene) → 1536x864
  const isCloseup = st.includes('closeup');
  const size = isCloseup ? '1024x1024' : '1536x1024';
  const outSize = isCloseup ? [1024, 1024] : [1536, 864];
  fs.mkdirSync(path.dirname(t.outFile), { recursive: true });
  console.log(`[GEN] ${t.slug}/${t.kind} ${size} ${st} -> ${path.relative(GEN, t.outFile)}`);
  const res = await requestImage(prompt, size);
  const d = res.data?.[0];
  if (!d) throw new Error('无图返回: ' + JSON.stringify(res).slice(0, 200));
  let buf;
  if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
  else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', d => c.push(d)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
  else throw new Error('无 b64/url');
  const sharp = require('sharp');
  await sharp(buf).resize(outSize[0], outSize[1], { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(t.outFile);
  const stat = fs.statSync(t.outFile);
  console.log(`  OK ${(stat.size/1024).toFixed(0)}KB`);
  return true;
}

(async () => {
  if (!API_KEY) { console.error('X ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL} model=${MODEL} tasks=${TASKS.length}\n`);
  let ok = 0, skip = 0, fail = 0;
  for (const t of TASKS) {
    try {
      const r = await genOne(t);
      if (r === 'skip') skip++; else ok++;
    } catch (e) {
      fail++;
      console.log(`  X ${t.slug}/${t.kind}: ${e.message.slice(0, 200)}`);
    }
  }
  console.log(`\n=== DONE ok=${ok} skip=${skip} fail=${fail} ===`);
})();
