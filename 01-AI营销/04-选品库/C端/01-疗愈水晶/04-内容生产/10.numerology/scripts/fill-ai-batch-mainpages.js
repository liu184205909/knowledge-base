/**
 * Numerology 主词页 AI 批量填充（10 篇 × 占位符）
 * 读 articles-mainpages/{slug}.json → 构建 prompt → 调 API → 输出 _placeholders-mainpages/{slug}.txt
 * 复用 meditation fill-ai-batch 模式，prompt 改为 numerology 主词页
 * BATCH=2 并发避限流。之后跑 fill-from-placeholders-mainpages.js 回填
 * 用法：node fill-ai-batch-mainpages.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
function loadEnv() {
  const p = path.join(os.homedir(), '.env');
  if (fs.existsSync(p)) for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles-mainpages');
const PH_DIR = path.join(DIR, '_placeholders-mainpages');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const BASE_URL = (process.env.AGNES_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = process.env.AGNES_TEXT_MODEL || process.env.GLM_MODEL || 'gpt-4o-mini';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const BATCH = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '2');

function stoneName(slug) {
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim(); if (s) return s; }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function stoneInfo(slug) {
  const a = ATTR[slug + '-meaning'];
  if (!a) return `${stoneName(slug)} (${slug})`;
  return `${stoneName(slug)} (${slug}): mineral=${a.mineral || 'n/a'}\n  SCIENCE: ${(a.science || a.healing || '').slice(0, 200)}\n  TRADITION: ${(a.tradition || a.spiritual || '').slice(0, 200)}`;
}
function getPlaceholders(art) {
  const phs = []; const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g; let m;
  while ((m = re.exec(art.content || '')) !== null) if (!phs.includes(m[1])) phs.push(m[1]);
  if (art.rank_math_description && art.rank_math_description.includes('{{AI_')) { const m2 = art.rank_math_description.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (m2 && !phs.includes(m2[1])) phs.push(m2[1]); }
  if (art.excerpt && art.excerpt.includes('{{AI_')) { const m3 = art.excerpt.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (m3 && !phs.includes(m3[1])) phs.push(m3[1]); }
  return phs;
}
function buildPrompt(art) {
  const phs = getPlaceholders(art);
  const calc = art.calculation || {};
  const crystalBlock = (art.crystals || []).map(stoneInfo).join('\n');
  const phList = phs.map(p => `- @@@${p}@@@`).join('\n');
  return `You are an expert SEO content writer for Earthward (Eastern-inspired healing crystal jewelry, US English site). Write premium, evidence-grounded, non-AI-sounding content for a numerology knowledge article.

ARTICLE: ${art.title}
PRIMARY KEYWORD: ${art.rank_math_focus_keyword}
DEFINITION (use this as the factual basis): ${art.definition}

CALCULATION (factual, use EXACTLY):
- Method: ${calc.method || ''}
- Formula: ${calc.formula || ''}
${calc.steps ? '- Steps:\n' + calc.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n') : ''}
${calc.example ? '- Example: ' + calc.example : ''}
${calc.meaning && typeof calc.meaning === 'object' ? '- Meaning by value:\n' + Object.entries(calc.meaning).map(([k, v]) => `  ${k}: ${v}`).join('\n') : ''}

CRYSTALS (THREE-ELEMENT structure each: science + tradition + mindfulness use; NOT generic "${'X is calming'}"):
${crystalBlock}

EASTERN ANCHOR (parallel reference, NOT historical claim — numerology is Pythagorean Western; Eastern number systems are parallel frames, must note this):
${art.eastern_note || '洛书/河图/七曜 as parallel reference, not historical correspondence'}

CRITICAL RULES:
1. COMPLIANCE: numerology is self-reflection, NOT prediction. NEVER use "guaranteed/will definitely/destined to". Use: suggests/invites/encourages/reflects/many people find.
2. CALCULATION ACCURACY: the formula above is exact (Pythagorean A=1..I=9). Repeat it correctly. destiny=ALL letters, soul_urge=VOWELS, personality=CONSONANTS.
3. THREE PERSPECTIVES woven naturally (no labels): number symbolism + crystal mineralogy + mindfulness application.
4. EASTERN: frame as "in parallel Eastern traditions, the number X also..." NOT appropriation, NOT power claims.
5. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/manifest abundance/intricate/seamless/leverage/foster/paramount/plethora/myriad.
6. BOUNDARY: this is a CONCEPT page (what is / how to calculate / overview). In-depth per-number detail belongs to /life-path-N/ cross pages — link them, do NOT duplicate deep per-number content here.
7. Output HTML <p> paragraphs (<strong> key terms, <em> notes).

OUTPUT: for EACH placeholder, a line "@@@PLACEHOLDER_NAME@@@" then content then blank line. Output ALL ${phs.length} placeholders. No other commentary.

${phList}

Now generate all placeholders:`;
}
function callAI(prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/chat/completions');
    const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert SEO content writer for crystals & numerology. Natural evidence-grounded English, avoids AI clichés, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 16000 });
    const req = https.request({ hostname: url.hostname, port: url.port || 443, path: url.pathname, method: 'POST', headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 300)));
        try { const j = JSON.parse(data); const c = j.choices?.[0]?.message?.content || ''; if (!c) return reject(new Error('empty: ' + data.slice(0, 200))); resolve(c); } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject); req.setTimeout(300000, () => req.destroy(new Error('timeout')));
    req.write(body); req.end();
  });
}
async function processArticle(f) {
  const slug = path.basename(f, '.json');
  const phFile = path.join(PH_DIR, slug + '.txt');
  if (fs.existsSync(phFile)) { console.log(`⏭ ${slug}`); return 'skip'; }
  const art = JSON.parse(fs.readFileSync(f, 'utf8'));
  const phs = getPlaceholders(art);
  console.log(`[${slug}] ${phs.length} 占位符...`);
  try {
    const content = await callAI(buildPrompt(art));
    const covered = phs.filter(p => content.includes('@@@' + p + '@@@'));
    fs.writeFileSync(phFile, covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content, 'utf8');
    console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok';
  } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; }
}
(async () => {
  if (!API_KEY) { console.error('✗ 缺 API_KEY'); process.exit(1); }
  fs.mkdirSync(PH_DIR, { recursive: true });
  let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json'));
  if (slugArg) files = files.filter(f => f === slugArg + '.json');
  console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${files.length}\n`);
  let ok = 0, fail = 0, skip = 0;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(f => processArticle(path.join(ART_DIR, f))));
    for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; }
    if (i + BATCH < files.length) { console.log(`  (间隔 8s)`); await new Promise(r => setTimeout(r, 8000)); }
  }
  console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`);
})();
