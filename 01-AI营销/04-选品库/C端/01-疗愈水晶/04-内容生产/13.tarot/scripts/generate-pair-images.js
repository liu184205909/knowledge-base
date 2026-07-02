/**
 * Tarot 配对文章 hero 生图（231对：22牌两两组合）
 * 每对：两牌视觉符号相遇 + 双水晶协同
 * 已存在跳过；3并发；1537x1024 → sharp 1536x864 webp
 */
const fs = require('fs'), path = require('path'), https = require('https');
const DIR = path.resolve(__dirname, '..');
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
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

const pairData = JSON.parse(fs.readFileSync(path.join(DIR, 'configs/pair-knowledge.json'), 'utf8'));
const tarotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../07-互动工具/_shared/tarot-knowledge.json'), 'utf8'));
const td = {};
for (const c of tarotData.cards) td[c.slug] = c;

function crystalName(cs) {
  if (!cs) return null;
  const a = cs.a || cs.a_slug;
  if (typeof a === 'string') return a.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  if (a && a.name) return a.name;
  if (a && a.slug) return a.slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  return null;
}
function crystalB(cs) {
  if (!cs) return null;
  const b = cs.b || cs.b_slug;
  if (typeof b === 'string') return b.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  if (b && b.name) return b.name;
  if (b && b.slug) return b.slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
  return null;
}

function buildPrompt(cardA, cardB, cA, cB) {
  const ca = td[cardA], cb = td[cardB];
  const nameA = ca.name, nameB = cb.name;
  const archA = ca.archetype || '', archB = cb.archetype || '';
  const cStr = (cA && cB) ? ` Two natural crystal gemstones — ${cA} and ${cB} — rest between the two cards, representing their synergy.` : '';
  return `A symbolic editorial illustration for the tarot combination of ${nameA} (${archA}) meeting ${nameB} (${archB}): the key visual symbols of both cards arranged in balanced dialogue, their distinct imagery interacting rather than stacked.${cStr} The roman numerals and key symbols of both cards must be clearly legible, correctly formed and prominent, rendered in elegant luminous golden line work with a soft glow. Rich spiritual graphic design, sacred geometry motifs, deep indigo and warm gold palette, glowing light rays, floating luminous particles, symmetrical balanced composition showing two forces in relationship, mystical atmosphere, highly detailed digital art, premium editorial quality.`;
}

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality, response_format: 'b64_json' });
    const req = https.request({ hostname: url.hostname, port: url.port || 443, path: url.pathname + url.search, method: 'POST', headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => { if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 400))); try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); } });
    });
    req.on('error', reject); req.setTimeout(300000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

const pairs = pairData.pairs || [];
const tasks = [];
for (const p of pairs) {
  const aSlug = typeof p.card_a === 'string' ? p.card_a : p.card_a.slug;
  const bSlug = typeof p.card_b === 'string' ? p.card_b : p.card_b.slug;
  const ps = p.pair_slug || `${aSlug}-and-${bSlug}`;
  const cs = p.crystal_synergy || {};
  tasks.push({ aSlug, bSlug, ps, cA: crystalName(cs), cB: crystalB(cs), outFile: path.join(PROJECT_ROOT, 'images', 'tarot-pair', ps + '.webp') });
}

async function processTask(t) {
  if (fs.existsSync(t.outFile)) return 'skip';
  fs.mkdirSync(path.dirname(t.outFile), { recursive: true });
  const prompt = buildPrompt(t.aSlug, t.bSlug, t.cA, t.cB);
  process.stdout.write(`[${t.ps}] `);
  try {
    const res = await requestImage(prompt, '1536x1024', 'medium');
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
  } catch (e) { console.log(`✗ ${e.message}`); return false; }
}

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base_url=${BASE_URL} model=${MODEL} 配对图任务=${tasks.length} 并发=2\n`);
  let ok = 0, fail = 0, skip = 0, cursor = 0;
  const workers = Array.from({ length: 2 }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) break;
      const r = await processTask(tasks[i]);
      if (r === 'skip') skip++; else if (r) ok++; else fail++;
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ok=${ok} skip=${skip} fail=${fail} / ${tasks.length}`);
})();
