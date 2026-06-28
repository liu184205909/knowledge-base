/**
 * Horoscope 补图：crystal + ritual（featured 已有，跳过）
 * 覆盖年运(7.zodiac-yearly-horoscope) + 月运(8.zodiac-monthly-horoscope)
 * source_type 决定风格：
 *   closeup (crystal_year/crystal_month): 水晶特写，方图 1024x1024
 *   lifestyle (ritual): 仪式场景，1536x864
 * 用 json 内 prompt（已由 generate-image-prompts.js 生成），直接用
 * loadEnv 强制覆盖（shell 有错误 sk-local 占位 key）
 * 已存在跳过（支持补生）
 * 用法：
 *   node generate-crystal-ritual-images.js              # 全部缺图
 *   node generate-crystal-ritual-images.js --test=1     # 仅生1张测试
 *   node generate-crystal-ritual-images.js --type=ritual # 只生 ritual
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

const args = process.argv.slice(2);
const testArg = parseInt(args.find(a => a.startsWith('--test='))?.split('=')[1] || '0', 10);
const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1];

const KB = 'D:/Code/knowledge-base';
const PROJECT_ROOT = path.join(KB, '02-网站规划');
const YEARLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/7.zodiac-yearly-horoscope/articles');
const MONTHLY_DIR = path.join(KB, '01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/8.zodiac-monthly-horoscope/articles');

// 待补的 image key（featured 跳过）
const KEYS = ['crystal_year', 'crystal_month', 'ritual'];

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

async function processImg(task) {
  const { art, dir, key, img } = task;
  if (typeArg && !key.includes(typeArg) && typeArg !== 'ritual') return null;
  if (typeArg === 'ritual' && key !== 'ritual') return null;
  if (typeArg && typeArg !== 'ritual' && !key.startsWith('crystal')) return null;
  const absFile = path.join(PROJECT_ROOT, img.file);
  if (fs.existsSync(absFile)) return 'skip';
  fs.mkdirSync(path.dirname(absFile), { recursive: true });
  const prompt = img.prompt || img.alt;
  const isCloseup = (img.source_type || '').toLowerCase().includes('closeup');
  const size = isCloseup ? '1024x1024' : '1536x1024';
  const outSize = isCloseup ? [1024, 1024] : [1536, 864];
  console.log(`[${art}/${key}] ${size} ${img.source_type}`);
  try {
    const res = await requestImage(prompt, size);
    const d = res.data?.[0];
    if (!d) { console.log(`  X no image: ${JSON.stringify(res).slice(0, 200)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', d => c.push(d)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`  X no b64/url`); return false; }
    const sharp = require('sharp');
    await sharp(buf).resize(outSize[0], outSize[1], { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    console.log(`  OK ${key}`);
    return true;
  } catch (e) { console.log(`  X ${key}: ${e.message}`); return false; }
}

function collectTasks() {
  const tasks = [];
  for (const dir of [YEARLY_DIR, MONTHLY_DIR]) {
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')) : [];
    for (const f of files) {
      const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!a.images) continue;
      for (const k of KEYS) {
        const img = a.images[k];
        if (!img || !img.file) continue;
        tasks.push({ art: a.slug, dir, key: k, img });
      }
    }
  }
  return tasks;
}

(async () => {
  if (!API_KEY) { console.error('X ~/.env missing OPENAI_API_KEY'); process.exit(1); }
  let tasks = collectTasks();
  if (testArg > 0) tasks = tasks.slice(0, testArg);
  console.log(`base_url=${BASE_URL} model=${MODEL} total=${tasks.length} type=${typeArg || 'all'}\n`);
  let ok = 0, fail = 0, skip = 0;
  const failed = [];
  const CONCURRENCY = 4;
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) break;
      const t = tasks[i];
      const r = await processImg(t);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else { fail++; failed.push(`${t.art}/${t.key}`); }
    }
  });
  await Promise.all(workers);
  console.log(`\n=== DONE ok=${ok} skip=${skip} fail=${fail} ===`);
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach(x => console.log('  ' + x));
    fs.writeFileSync(path.join(__dirname, 'gen-crystal-ritual-failed.json'), JSON.stringify(failed, null, 2));
  }
})();
