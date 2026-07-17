/**
 * Gift listicle AI 批量填充（44 篇）
 * 读 articles/{slug}.json → gift 选购指南 prompt（礼物寓意+赠礼仪式+东方锚点+合规+去AI化）→ _placeholders/{slug}.txt
 * 水晶寓意取 390 库 ATTR；BATCH=2 避限流；支持 --slug / --batch / --limit / --offset
 * 用法：node fill-ai-batch.js [--limit=8 --offset=0] [--slug=xxx] [--batch=2]
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
function loadEnv() { const p = path.join(os.homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles');
const PH_DIR = path.join(DIR, '_placeholders');
const IDX = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const NORM = { 'clear-quartz': 'quartz', 'green-aventurine': 'aventurine', 'green-jade': 'jade', 'tigers-eye': 'tiger-eye' };
const DISPLAY = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', 'tiger-eye': "Tiger's Eye" };
const BASE_URL = (process.env.AGNES_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = process.env.AGNES_TEXT_MODEL || process.env.GLM_MODEL || 'gpt-4o-mini';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const BATCH = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '2');
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0');
const OFFSET = parseInt(args.find(a => a.startsWith('--offset='))?.split('=')[1] || '0');

function norm(s) { return NORM[s] || s; }
function stoneName(slug) { const s = norm(slug); if (DISPLAY[s]) return DISPLAY[s]; const a = ATTR[s + '-meaning']; if (a && a.title) { const t = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').replace(/\s*Meaning.*$/i, '').trim(); if (t) return t; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function stoneInfo(slug) { const s = norm(slug); const a = ATTR[s + '-meaning']; const name = stoneName(slug); if (!a) return `${name} (${s}): [attribute not in 390 library — describe common gifting symbolism, mark as needing verification]`; return `${name} (${s}): mineral=${a.mineral || 'n/a'}\n  SCIENCE: ${(a.science || a.healing || '').slice(0, 200)}\n  TRADITION: ${(a.tradition || a.spiritual || '').slice(0, 200)}`; }

function getPlaceholders(art) {
  const phs = []; const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g; let m;
  while ((m = re.exec(art.content || '')) !== null) if (!phs.includes(m[1])) phs.push(m[1]);
  for (const f of ['rank_math_description', 'excerpt']) if (art[f] && art[f].includes('{{AI_')) { const m2 = art[f].match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (m2 && !phs.includes(m2[1])) phs.push(m2[1]); }
  return phs;
}

function buildPrompt(art) {
  const phs = getPlaceholders(art);
  const crystals = art.crystals || [];
  const crystalBlock = crystals.map(stoneInfo).join('\n');
  const recipient = art.recipient || 'this recipient';
  const occasion = art.occasion || 'this occasion';
  // FAQ pairs from faq_seeds (reliable, not regex on content)
  const faqPairs = (art.faq_seeds || []).map((q, i) => ({ n: i + 1, q: q }));
  const faqBlock = faqPairs.length ? '\nFAQ PLACEHOLDERS — each @@@AI_FAQ_ANSWER_N@@@ must directly answer its SPECIFIC question (do NOT repeat the question; specific, not generic):\n' + faqPairs.map(f => `- @@@AI_FAQ_ANSWER_${f.n}@@@ → answers: "${f.q}"`).join('\n') : '';
  // related candidates: same subcategory siblings (real slugs, so AI can't invent)
  const siblings = IDX.articles.filter(x => x.slug !== art.slug && x.subcategory === art.subcategory).slice(0, 8);
  const relatedCands = siblings.length ? siblings.map(s => `<li><a href="/${s.slug}/">${s.title.replace(/:.*/, '').trim()}</a></li>`).join('\n') : '';
  const phList = phs.filter(p => !p.startsWith('AI_FAQ_ANSWER_')).map(p => `- @@@${p}@@@`).join('\n');

  return `You are an expert SEO content writer for Earthward (Eastern-inspired healing crystal jewelry, US market). Write premium, evidence-grounded, non-AI-sounding content for a Crystal Gift Guide.

ARTICLE: ${art.title}
PRIMARY KEYWORD: ${art.keyword}
RECIPIENT: ${recipient}  |  OCCASION: ${occasion}  |  TYPE: ${art.page_type}

CRYSTAL DATA (use these facts; weave into prose, do NOT output "mineral="/"SCIENCE:"/"TRADITION:" labels or [brackets]):
${crystalBlock}

PLACEHOLDER INSTRUCTIONS:
- AI_QUICK_N (one per crystal): ONE short line — what crystal #N is best for as a gift here (e.g. "Best for enduring love & milestone anniversaries").
- AI_INTRO: why crystals make meaningful gifts for ${recipient}/${occasion} — symbolism, longevity, personalization vs ordinary gifts.
- AI_GIFTS_INTRO: 2-3 sentences introducing the curated list.
- AI_GIFT_N_MEANING: the stone's mineralogy + traditional symbolism as readable prose (2-3 sentences).
- AI_GIFT_N_WHY: why THIS stone suits ${recipient}/${occasion} specifically — concrete, not generic "X is calming".
- AI_GIFT_N_HOWTO: a thoughtful way to gift/present it or a small gifting ritual (differentiation competitors lack).
- AI_BY_INTENTION: how to choose by intention — love (Rose Quartz) / protection (Black Tourmaline) / prosperity (Citrine) / calm (Amethyst). Short bullets or mini-table.
- AI_EASTERN: Eastern anchor — accurate tradition per the direction below; cultural symbolism for reflection, NOT cultural appropriation or guarantees.
  EASTERN DIRECTION: ${art.eastern_note}
- AI_HOW_TO_CHOOSE: budget tiers ($ / $$ / $$$) / recipient's intention / relationship stage / cleansing before gifting (mention /tools/crystal-cleansing-timer/).
- AI_META_DESC: SEO meta description <=155 chars, includes primary keyword.
- AI_EXCERPT: 1-2 sentence post excerpt.
- AI_RELATED: output these exact <li> lines (pick 4-6 most relevant):
${relatedCands}
- Concept-page only — AI_QUICK_ANSWER (40-60 word direct answer), AI_WHAT_IS (definition 80-120 words), AI_EXPLAINED (deeper explanation + bullets), AI_CRYSTAL_XXX (2-3 sentence stone writeup).

CRITICAL RULES:
1. COMPLIANCE: NEVER "guarantees love/relationship/wealth/luck", "scientifically proven", "will bring". Use: symbolizes / traditionally associated with / many find / a thoughtful way to mark. A crystal gift is a meaningful gesture, NOT an outcome guarantee.
2. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/manifest/intricate/seamless/leverage/foster/paramount/plethora/myriad/elevate.
3. Rose Quartz leads the love/anniversary/wedding picks (industry standard, recipients expect it).
4. Three perspectives woven naturally (no labels): crystal mineralogy + traditional symbolism + modern gifting application.
5. Output HTML <p> paragraphs (<strong> key terms, <em> notes). For each placeholder output: "@@@PLACEHOLDER@@@" then its content then a blank line.
6. Pricing: use $ / $$ / $$$ tiers only — never invent exact dollar prices.

OUTPUT ALL ${phs.length} placeholders. No commentary.

${phList}${faqBlock}

Now generate all placeholders:`;
}

function callAI(prompt) {
  return new Promise((res, rej) => {
    const u = new URL(BASE_URL + '/chat/completions');
    const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert SEO gift-guide writer for crystals & jewelry. Natural evidence-grounded English, avoids AI clichés, culturally respectful, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 16000 });
    const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => {
      let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { const c = JSON.parse(d).choices?.[0]?.message?.content || ''; if (!c) return rej(new Error('empty: ' + d.slice(0, 200))); res(c); } catch (e) { rej(new Error('Bad JSON')); } });
    }); r.on('error', rej); r.setTimeout(300000, () => r.destroy(new Error('timeout'))); r.write(body); r.end();
  });
}

async function processArticle(slug) {
  const artFile = path.join(ART_DIR, slug + '.json'); const phFile = path.join(PH_DIR, slug + '.txt');
  if (fs.existsSync(phFile)) { console.log('⏭', slug); return 'skip'; }
  const art = JSON.parse(fs.readFileSync(artFile, 'utf8')); const phs = getPlaceholders(art);
  console.log(`[${slug}] ${phs.length} 占位符...`);
  try {
    const content = await callAI(buildPrompt(art));
    const covered = phs.filter(p => content.includes('@@@' + p + '@@@'));
    const out = covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content;
    fs.writeFileSync(phFile, out, 'utf8'); console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok';
  } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; }
}

(async () => {
  if (!API_KEY) { console.error('✗ 缺 API_KEY (AGNES_API_KEY/OPENAI_API_KEY)'); process.exit(1); }
  fs.mkdirSync(PH_DIR, { recursive: true });
  let slugs = IDX.articles.map(a => a.slug);
  if (slugArg) slugs = slugs.filter(s => s === slugArg);
  else {
    slugs = slugs.filter(s => !fs.existsSync(path.join(PH_DIR, s + '.txt')));
    if (OFFSET) slugs = slugs.slice(OFFSET);
    if (LIMIT) slugs = slugs.slice(0, LIMIT);
  }
  console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${slugs.length}\n`);
  let ok = 0, fail = 0, skip = 0;
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(processArticle));
    for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; }
    if (i + BATCH < slugs.length) { console.log('  (间隔 8s)'); await new Promise(r => setTimeout(r, 8000)); }
  }
  console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`);
})();
