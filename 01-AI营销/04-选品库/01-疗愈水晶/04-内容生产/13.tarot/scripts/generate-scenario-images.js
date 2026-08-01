/**
 * Tarot 场景文章 hero 生图（110篇：22牌×5场景）
 * 每篇：牌视觉符号 + 场景元素 + 该场景主水晶
 * 已存在跳过（支持补生）；3并发；1536x1024 → sharp 1536x864 webp
 * 需 NODE_PATH 全局 sharp；loadEnv 强制覆盖 shell 错误 key
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
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');

const SCENARIOS = ['love', 'career', 'finances', 'health', 'spiritual'];
const SCENARIO_VISUAL = {
  love: 'two intertwined hearts joined by a delicate red thread, scattered rose petals, warm rose-pink and soft gold tones',
  career: 'a spiral staircase ascending toward a bright opening, brass tools and a small ledger on a desk, amber and deep gold tones',
  finances: 'stacked coins beside a sprouting seedling and a small balanced scale, emerald-green and warm gold tones',
  health: 'a glowing silhouette in gentle motion surrounded by fresh leaves and calm water, soft sage-green and clear blue tones',
  spiritual: 'a luminous mandala of sacred geometry with a single steady candle flame at its center, deep violet and luminous white tones'
};
const SCENARIO_LABEL = { love: 'Love', career: 'Career', finances: 'Finances', health: 'Health', spiritual: 'Spiritual Growth' };

const scenarioData = JSON.parse(fs.readFileSync(path.join(DIR, 'configs/scenario-knowledge.json'), 'utf8'));
const tarotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../07-互动工具/_shared/tarot-knowledge.json'), 'utf8'));
const td = {};
for (const c of tarotData.cards) td[c.slug] = c;

function buildPrompt(card, scenario, crystalName) {
  const c = td[card];
  const cardName = c.name;
  const archetype = c.archetype || '';
  const vis = SCENARIO_VISUAL[scenario];
  const cStr = crystalName ? ` Paired with a ${crystalName} crystal gemstone placed gracefully in the composition.` : '';
  return `A symbolic editorial illustration for the tarot card ${cardName} (${archetype}) interpreted in a ${SCENARIO_LABEL[scenario]} reading context: ${vis}.${cStr} The card's roman numeral and key visual symbols must be clearly legible, correctly formed and prominent, rendered in elegant luminous golden line work with a soft glow. Rich spiritual graphic design, sacred geometry motifs, deep indigo background harmonized with the scenario's accent palette, glowing light rays, floating luminous particles, symmetrical balanced composition, mystical contemplative atmosphere, highly detailed digital art, premium editorial quality.`;
}

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

// 构建任务列表（110篇）
const tasks = [];
for (const cardEntry of scenarioData.cards) {
  const card = cardEntry.card;
  for (const scenario of SCENARIOS) {
    const sc = cardEntry.scenarios[scenario];
    const crystalSlug = (sc.crystals && sc.crystals[0]) || td[card].crystals.best_overall.slug;
    const crystalName = crystalSlug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
    const outFile = path.join(PROJECT_ROOT, 'images', 'tarot-scenario', `${card}-for-${scenario}.webp`);
    tasks.push({ card, scenario, crystalName, outFile });
  }
}

async function processTask(t) {
  if (fs.existsSync(t.outFile)) return 'skip';
  fs.mkdirSync(path.dirname(t.outFile), { recursive: true });
  const prompt = buildPrompt(t.card, t.scenario, t.crystalName);
  process.stdout.write(`[${t.card}-for-${t.scenario}] `);
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
  console.log(`base_url=${BASE_URL} model=${MODEL} 场景图任务=${tasks.length} 并发=3\n`);
  let ok = 0, fail = 0, skip = 0;
  let cursor = 0;
  const CONCURRENCY = 3;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) break;
      const r = await processTask(tasks[i]);
      if (r === 'skip') skip++;
      else if (r) ok++;
      else fail++;
    }
  });
  await Promise.all(workers);
  console.log(`\n完成 ok=${ok} skip=${skip} fail=${fail} / ${tasks.length}`);
})();
