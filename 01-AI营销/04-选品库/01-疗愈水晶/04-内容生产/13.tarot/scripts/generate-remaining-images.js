/**
 * 补图生图（65 张）：
 *   yesno 缺 7 牌代表（每牌 1 张 -love 篇作代表，牌级复用到 5 篇）→ generated/yesno/
 *   minor 20（每牌 1 张，独立不复用）→ generated/minor/
 *   spreads 25（每阵 1 张）→ generated/spreads/
 *   beginner 13（每篇 1 张）→ generated/beginner/
 *
 * moleapi gpt-image-2 → sharp 1536x864 webp，并发保守 2
 * 用法: node generate-remaining-images.js [limit]
 * 需 NODE_PATH 全局 sharp
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
const DIR = path.resolve(__dirname, '..');
const LIMIT = parseInt(process.argv[2]) || 0;

// loadEnv 强制覆盖
const ENV_OVERRIDES = {};
const envPath = path.join(os.homedir(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) ENV_OVERRIDES[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.OPENAI_BASE_URL || '').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

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
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 400)));
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

// ---------- 任务构造 ----------
const tasks = [];

// 1. yesno 缺 7 牌代表（每牌取 -love 篇）
const yesnoCfg = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'articles-yesno-images.json'), 'utf8'));
const haveCards = new Set();
const yesnoDir = path.join(DIR, 'generated', 'yesno');
if (fs.existsSync(yesnoDir)) {
  for (const f of fs.readdirSync(yesnoDir)) {
    const m = f.match(/^is-(.+)-yes-or-no-/);
    if (m) haveCards.add(m[1]);
  }
}
const YESNO_MISSING = ['justice', 'the-hanged-man', 'the-star', 'the-moon', 'the-sun', 'judgment', 'the-world'];
for (const card of YESNO_MISSING) {
  if (haveCards.has(card)) continue;
  const slug = `is-${card}-yes-or-no-love`;
  const a = yesnoCfg.articles[slug];
  if (!a) { console.warn('⚠ 缺 yesno 配置:', slug); continue; }
  const crystal = a.crystals && a.crystals[0];
  tasks.push({ kind: 'yesno', slug, crystalName: crystal ? crystal.name : '', prompt: a.hero.prompt, outFile: path.join(yesnoDir, a.hero.file) });
}

// 2. minor 20
const minorCfg = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'articles-minor-images.json'), 'utf8'));
const minorDir = path.join(DIR, 'generated', 'minor');
for (const [slug, a] of Object.entries(minorCfg.articles)) {
  const crystal = a.crystals && a.crystals[0];
  tasks.push({ kind: 'minor', slug, crystalName: crystal ? crystal.name : '', prompt: a.hero.prompt, outFile: path.join(minorDir, slug + '.webp') });
}

// 3. spreads 25
const spreadsCfg = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'articles-spreads-images.json'), 'utf8'));
const spreadsDir = path.join(DIR, 'generated', 'spreads');
for (const [slug, a] of Object.entries(spreadsCfg.articles)) {
  // spreads 取首个水晶做前景强化
  const crystal = a.crystals && a.crystals[0];
  tasks.push({ kind: 'spreads', slug, crystalName: crystal ? crystal.name : '', prompt: a.hero.prompt, outFile: path.join(spreadsDir, slug + '.webp') });
}

// 4. beginner 13
const beginnerCfg = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'articles-beginner-images.json'), 'utf8'));
const beginnerDir = path.join(DIR, 'generated', 'beginner');
for (const [slug, a] of Object.entries(beginnerCfg.articles)) {
  const crystal = a.crystals && a.crystals[0];
  tasks.push({ kind: 'beginner', slug, crystalName: crystal ? crystal.name : '', prompt: a.hero.prompt, outFile: path.join(beginnerDir, slug + '.webp') });
}

async function processTask(t) {
  if (fs.existsSync(t.outFile)) return 'skip';
  fs.mkdirSync(path.dirname(t.outFile), { recursive: true });
  process.stdout.write(`[${t.kind}/${t.slug}] `);
  try {
    const prefix = t.crystalName ? `A large prominent ${t.crystalName} crystal cluster resting in the FOREGROUND at the bottom, detailed facets and natural color clearly visible, large and unmistakable as a central focal point alongside the main figure. ` : '';
    const res = await requestImage(prefix + t.prompt, '1536x1024', 'medium');
    const d = res.data && res.data[0];
    if (!d) { console.log(`✗ 无图: ${JSON.stringify(res).slice(0, 150)}`); return false; }
    let buf;
    if (d.b64_json) buf = Buffer.from(d.b64_json, 'base64');
    else if (d.url) buf = await new Promise((r, j) => https.get(d.url, x => { if (x.statusCode >= 400) return j(new Error('dl ' + x.statusCode)); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => r(Buffer.concat(c))); }).on('error', j));
    else { console.log(`✗ 无 b64/url`); return false; }
    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(t.outFile);
    console.log(`✅`);
    return true;
  } catch (e) { console.log(`✗ ${e.message.slice(0, 150)}`); return false; }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  if (!BASE_URL) { console.error('✗ ~/.env 缺 OPENAI_BASE_URL'); process.exit(1); }
  const todo = tasks.filter(t => !fs.existsSync(t.outFile));
  const run = LIMIT ? todo.slice(0, LIMIT) : todo;
  const byKind = {};
  for (const t of todo) byKind[t.kind] = (byKind[t.kind] || 0) + 1;
  console.log(`base_url=${BASE_URL} model=${MODEL}`);
  console.log(`待生(全部缺图): yesno=${byKind.yesno || 0} minor=${byKind.minor || 0} spreads=${byKind.spreads || 0} beginner=${byKind.beginner || 0} 共${todo.length}`);
  console.log(`本次执行: ${run.length} (limit=${LIMIT}) 并发2\n`);

  let ok = 0, fail = 0, skip = 0, cursor = 0;
  const CONCURRENCY = 2;
  const failed = [];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= run.length) break;
      const t = run[i];
      const r = await processTask(t);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else { fail++; failed.push({ kind: t.kind, slug: t.slug }); }
      // 节奏：每张之间小歇 1s 降低并发压力
      await new Promise(r => setTimeout(r, 1000));
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ok=${ok} skip=${skip} fail=${fail} / ${run.length}`);
  if (failed.length) {
    fs.writeFileSync(path.join(DIR, '_qc', 'generate-remaining-failed.json'), JSON.stringify(failed, null, 2), 'utf8');
    console.log('失败明细 → _qc/generate-remaining-failed.json');
    console.log('failed:', failed.map(f => f.kind + '/' + f.slug).join(', '));
  }
})();
