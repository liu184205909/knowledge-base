/**
 * Gift 文章 hero 生图（moleapi gpt-image-2）
 * 读 articles/{slug}.json 的 images.hero → 生 hero-{slug}.webp（1536x864）到 02-网站规划/images/gifts/
 * prompt 按 subcategory 分模板（礼物盒+水晶+东方元素，无文字）；需 NODE_PATH 全局 sharp；reqImg 重试3次
 * 用法：NODE_PATH=$(npm root -g) node generate-images.js [--slug=xxx]   需 disableSandbox
 */
const fs = require('fs'), path = require('path'), https = require('https');
function loadEnv() { const p = path.join(require('os').homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles');
// moleapi gpt-image-2 额度耗尽(403)，换 agnes-image-2.1-flash（免费全模态）
const BASE_URL = (process.env.AGNES_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.AGNES_IMAGE_MODEL || process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;
const PROJECT_ROOT = path.resolve(__dirname, '../../../02-网站规划');
const slugArg = process.argv.slice(2).find(a => a.startsWith('--slug='))?.split('=')[1];

// hero prompt 按 subcategory/occasion 分（主题化，差异化；无文字无水印）
const PROMPT_BY_KEY = {
  anniversary: 'elegant crystal anniversary gift box revealing glowing rose quartz and clear quartz on blush silk, soft romantic golden light, delicate ribbon and dried rose petals, Eastern-inspired premium spiritual editorial aesthetic',
  '15th-anniversary': 'crystal 15th anniversary gift, open jewelry box with clear quartz and rose quartz crystals, traditional milestone celebration aesthetic, warm golden glow, refined romantic styling',
  wedding: 'wedding crystal gift, open box with moonstone and rose quartz on ivory silk, soft ceremonial light, white florals, elegant Eastern-inspired spiritual aesthetic',
  'wedding-anniversary': 'wedding anniversary crystal gift box, glowing rose quartz and moonstone, warm romantic golden tones, silk and ribbon, premium spiritual editorial',
  him: "masculine crystal gift, dark leather box with tiger's eye, hematite and obsidian stones, moody warm lighting, grounded premium aesthetic, deep wood and brass accents",
  men: "men's crystal gift, dark wood box with tiger's eye and pyrite stones, earthy muted tones, sophisticated grounding aesthetic, soft directional light",
  her: 'feminine crystal gift box, rose quartz and moonstone on dusty pink silk, soft diffused light, delicate floral accents, Eastern-inspired romantic premium aesthetic',
  women: 'crystal gift for women, open jewelry box with amethyst and rose quartz, soft luminous styling, blush and lavender tones, elegant spiritual editorial',
  mom: 'crystal gift for a mother, rose quartz and green aventurine on soft sage silk, warm nurturing light, gentle florals, heartfelt premium aesthetic',
  wife: 'crystal gift for a wife, rose quartz and rhodonite on blush silk, romantic warm light, delicate ribbon, intimate premium styling',
  couples: 'crystal gift for couples, two matching stones (rose quartz) in a shared box, warm intimate light, symmetry and connection, Eastern-inspired aesthetic',
  'crystal-lovers': 'curated crystal lover gift box, raw and polished specimens of labradorite, selenite and quartz on dark velvet, collector aesthetic, dramatic lighting',
  home: 'crystal home gift, selenite tower and black tourmaline on a bright wooden shelf, serene interior, soft daylight, mindful home aesthetic',
  housewarming: 'housewarming crystal gift, black tourmaline and citrine on a wooden entryway table, warm welcoming home light, fresh greenery, feng shui aesthetic',
  'new-home': 'new home crystal blessing, citrine and green aventurine on a sunlit windowsill, serene interior, fresh start aesthetic, warm daylight',
  love: 'crystal gift for love, rose quartz hearts on blush silk, soft romantic light, delicate petals, Eastern-inspired romantic aesthetic',
  protection: "crystal protection gift, black tourmaline and obsidian on dark slate, grounding protective aesthetic, moody warm light, strong contrast",
  prosperity: 'crystal prosperity gift, citrine and pyrite on warm gold silk, abundance aesthetic, glowing golden light, Eastern-inspired wealth symbolism',
  calm: 'crystal calm gift, amethyst and howlite on lavender silk, soft serene light, peaceful meditation aesthetic, gentle mist',
  budget: 'affordable crystal gift set, assorted tumbled stones (quartz, amethyst, rose quartz) in a simple kraft box, bright cheerful light, accessible aesthetic',
  'tea-lovers': 'crystal gift for tea lovers, clear quartz and amethyst beside a ceramic tea set, zen tea ceremony aesthetic, soft warm light, minimalist Eastern styling',
  travelers: 'crystal travel gift, black tourmaline and moonstone with a passport and leather journal, adventurous warm light, wanderlust aesthetic',
  doctors: 'crystal gift for healthcare workers, amethyst and selenite on a clean clinical-soft surface, calming pale light, caring professional aesthetic',
  'senior-women': 'crystal gift for a senior woman, rose quartz and jade on soft pearl silk, warm gentle light, timeless elegant aesthetic',
  knitters: 'crystal gift for crafters, rose quartz and amethyst beside soft yarn skeins, cozy warm light, handmade artisan aesthetic',
  hikers: "crystal gift for hikers, tiger's eye and bloodstone with a compass and leather boots, earthy outdoor aesthetic, golden forest light",
  adults: 'crystal Easter gift for adults, rose quartz and green aventurine with spring florals, fresh pastel light, seasonal renewal aesthetic',
  veterans: "crystal gift for veterans, tiger's eye and bloodstone on deep navy, respectful grounded aesthetic, solemn warm light",
  easter: 'crystal Easter gift, rose quartz and aquamarine with spring blossoms, fresh pastel light, renewal aesthetic',
  'valentines-day': "Valentine's crystal gift, rose quartz and garnet on red silk, romantic warm light, intimate premium aesthetic",
  'mothers-day': "Mother's Day crystal gift, rose quartz and green aventurine with spring florals, warm nurturing light, heartfelt aesthetic",
  'veterans-day': "Veterans Day crystal gift, tiger's eye and bloodstone on deep navy, respectful solemn aesthetic",
  default: 'elegant crystal gift box revealing glowing healing crystals on silk, soft Eastern-inspired warm light, delicate ribbon and botanical accents, premium spiritual editorial quality',
};
function promptFor(art) {
  const keys = [art.occasion, art.recipient, art.subcategory].filter(Boolean);
  for (const k of keys) if (PROMPT_BY_KEY[k]) return `${art.title.replace(/:.*/, '')}. ${PROMPT_BY_KEY[k]}, no readable text, no watermark.`;
  return `${art.title.replace(/:.*/, '')}. ${PROMPT_BY_KEY.default}, no readable text, no watermark.`;
}

function reqImg(prompt, size) {
  return new Promise((res, rej) => {
    const u = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size });
    const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => {
      let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { res(JSON.parse(d)); } catch (e) { rej(new Error('Bad JSON')); } });
    });
    r.on('error', rej); r.setTimeout(240000, () => r.destroy(new Error('timeout'))); r.write(body); r.end();
  });
}
async function reqImgRetry(prompt, size, tries) {
  tries = tries || 3;
  for (let i = 0; i < tries; i++) {
    try { return await reqImg(prompt, size); }
    catch (e) { const retryable = /timeout|HTTP 5\d\d|524|500|503|overloaded|cpu|socket|ECONNRESET|ETIMEDOUT/i.test(e.message); if (!retryable || i === tries - 1) throw e; console.log('    重试 ' + (i + 1) + '/' + (tries - 1) + ': ' + e.message.slice(0, 60)); await new Promise(r => setTimeout(r, 6000)); }
  }
}
async function gen(art) {
  const img = art.images && art.images.hero; if (!img) return null;
  const abs = path.join(PROJECT_ROOT, img.file);
  if (fs.existsSync(abs)) { console.log('⏭', art.slug); return 'skip'; }
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  console.log(`[${art.slug}] 生图中...`);
  try {
    const r = await reqImgRetry(promptFor(art), '1536x1024');
    const d = r.data && r.data[0]; if (!d) { console.log('  ✗ 无图'); return false; }
    let buf = d.b64_json ? Buffer.from(d.b64_json, 'base64') : null;
    if (!buf && d.url) buf = await new Promise((res, rej) => https.get(d.url, x => { if (x.statusCode >= 400) return rej(new Error('dl')); const c = []; x.on('data', dd => c.push(dd)); x.on('end', () => res(Buffer.concat(c))); }).on('error', rej));
    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(abs);
    console.log('  ✅', art.slug); return true;
  } catch (e) { console.log('  ✗', art.slug, e.message.slice(0, 100)); return false; }
}
(async () => {
  if (!API_KEY) { console.error('✗ 缺 OPENAI_API_KEY'); process.exit(1); }
  let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json')).filter(f => {
    try { const a = JSON.parse(fs.readFileSync(path.join(ART_DIR, f), 'utf8')); const h = a.images && a.images.hero; return !h || !fs.existsSync(path.join(PROJECT_ROOT, h.file)); } catch (e) { return true; }
  });
  if (slugArg) files = files.filter(f => f === slugArg + '.json');
  else { const OFFSET = parseInt(process.argv.slice(2).find(a => a.startsWith('--offset='))?.split('=')[1] || '0'); const LIMIT = parseInt(process.argv.slice(2).find(a => a.startsWith('--limit='))?.split('=')[1] || '0'); if (OFFSET) files = files.slice(OFFSET); if (LIMIT) files = files.slice(0, LIMIT); }
  console.log('base=' + BASE_URL + ' model=' + MODEL + ' count=' + files.length + ' (待生成)');
  let ok = 0, fail = 0, skip = 0; const CONC = 5; let cur = 0;
  const workers = Array.from({ length: CONC }, async () => {
    while (true) { const i = cur++; if (i >= files.length) break; const art = JSON.parse(fs.readFileSync(path.join(ART_DIR, files[i]), 'utf8')); const r = await gen(art); if (r === 'skip') skip++; else if (r) ok++; else fail++; }
  });
  await Promise.all(workers);
  console.log(`\nok=${ok} skip=${skip} fail=${fail}`);
})();
