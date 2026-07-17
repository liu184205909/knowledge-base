/**
 * Feng Shui 主词页 AI 批量填充（45 篇）
 * 读 articles-mainpages/{slug}.json → feng shui BTB 文化 prompt（八宅/五行准确+合规+禁医疗/招财+去AI化）→ _placeholders-mainpages/{slug}.txt
 * BATCH=2 避限流；支持 --slug / --batch / --limit / --offset（>30 篇线分批避 bash 卡死）
 * 用法：node fill-ai-batch-mainpages.js [--limit=8 --offset=0] [--slug=xxx] [--batch=2]
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
function loadEnv() { const p = path.join(os.homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
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
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0');
const OFFSET = parseInt(args.find(a => a.startsWith('--offset='))?.split('=')[1] || '0');
function stoneName(slug) { const a = ATTR[slug + '-meaning']; if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').replace(/\s*Meaning.*$/i, '').trim(); if (s) return s; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function stoneInfo(slug) { const a = ATTR[slug + '-meaning']; if (!a) return `${stoneName(slug)} (${slug})`; return `${stoneName(slug)} (${slug}): mineral=${a.mineral || 'n/a'}\n  SCIENCE: ${(a.science || a.healing || '').slice(0, 180)}\n  TRADITION: ${(a.tradition || a.spiritual || '').slice(0, 180)}`; }
function getPlaceholders(art) { const phs = []; const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g; let m; while ((m = re.exec(art.content || '')) !== null) if (!phs.includes(m[1])) phs.push(m[1]); if (art.rank_math_description && art.rank_math_description.includes('{{AI_')) { const m2 = art.rank_math_description.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (m2 && !phs.includes(m2[1])) phs.push(m2[1]); } if (art.excerpt && art.excerpt.includes('{{AI_')) { const m3 = art.excerpt.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (m3 && !phs.includes(m3[1])) phs.push(m3[1]); } return phs; }
function buildPrompt(art) {
  const phs = getPlaceholders(art); const calc = art.calculation || {};
  const crystalBlock = (art.crystals || []).map(stoneInfo).join('\n');
  const faqPairs = [...(art.content || '').matchAll(/<h3>([^<]+)<\/h3>\s*<p>\{\{AI_FAQ_ANSWER_(\d+)\}\}/g)].map(m => ({ n: m[2], q: m[1].trim() }));
  const faqBlock = faqPairs.length ? '\nFAQ PLACEHOLDERS — each @@@AI_FAQ_ANSWER_N@@@ must directly answer its SPECIFIC question (do NOT repeat the question; do NOT give a generic answer):\n' + faqPairs.map(f => `- @@@AI_FAQ_ANSWER_${f.n}@@@ → answers: "${f.q}"`).join('\n') : '';
  const phList = phs.filter(p => !p.startsWith('AI_FAQ_ANSWER_')).map(p => `- @@@${p}@@@`).join('\n');
  return `You are an expert SEO content writer for Earthward (Eastern-inspired healing crystal jewelry). Write premium, evidence-grounded, non-AI-sounding content for a Feng Shui knowledge article.

ARTICLE: ${art.title}
PRIMARY KEYWORD: ${art.rank_math_focus_keyword}
DEFINITION (factual basis): ${art.definition}

PLACEMENT STEPS (use EXACTLY — specific bagua area, direction, room, activation method; do NOT genericize):
${(calc.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}
${calc.formula ? 'CORE PLACEMENT: ' + calc.formula : ''}
${calc.example ? 'EXAMPLE: ' + calc.example : ''}

CRYSTALS (for EACH AI_CRYSTAL_XXX placeholder, write 2-3 NATURAL flowing sentences weaving its mineralogy + feng shui element/bagua placement + modern mindful application. CRITICAL: do NOT output "mineral="/"SCIENCE:"/"TRADITION:" labels or [brackets] — integrate those facts into readable prose. NOT generic "X is calming"):
${crystalBlock}

FENG SHUI TRADITION (ACCURATE terminology, do NOT mix labels or schools):
- BTB (Black Sect Tantric Buddhism, Master Lin Yun lineage): front-door alignment (door at bottom row: Knowledge/Career/Helpful People), no compass — Western mainstream.
- Classical/Compass: Career=North, Fame=South, by actual compass bearing.
- Five Elements: Water (black/North·Career & Helpful People) · Wood (green·Family & Wealth-purple) · Fire (red·Fame) · Earth (yellow·Center/Knowledge/Love) · Metal (white·Children & Helpful People).
- Ba Zhai Eight Mansions (Kua Number): 4 auspicious directions (Sheng Chi 成功 / Tien Yi 健康 / Nien Yen 爱情 / Fu Wei 稳定) + 4 inauspicious; year begins at Li Chun (~Feb 4, solar calendar).
- Wealth corner: BTB signature color is PURPLE (Amethyst), not green.
Frame as "in the BTB tradition...", "in classical Eight Mansions feng shui...", "the five elements describe..." — NOT cultural appropriation, NOT power claims, NOT a "master" persona.
Eastern anchor for this article: ${art.eastern_note || '(choose the accurate tradition per topic)'}

CRITICAL RULES:
1. COMPLIANCE: NEVER "cures/treats/heals illness", "guarantees", "will bring wealth", "removes negative energy", "scientifically proven". Use: supports / invites / aligns / many people find / based on traditional. Wealth = "invites abundance" (NEVER guarantees money); protection = "supports a sense of clear, settled energy" (NEVER claims to banish entities).
2. THREE PERSPECTIVES woven naturally (no labels): feng shui tradition + crystal mineralogy + modern mindful space application.
3. CULTURAL RESPECT: accurate tradition per topic, BTB framing, "a traditional practice for reflection, not a guarantee", never perform the authority of a feng shui master.
4. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/manifest abundance/intricate/seamless/leverage/foster/paramount/plethora/myriad.
5. Placement must be SPECIFIC and executable — which bagua area, which direction, how to activate — what competitors lack.
6. Output HTML <p> paragraphs (<strong> key terms, <em> notes).

OUTPUT: for EACH placeholder, "@@@PLACEHOLDER@@@" then content then blank line. Output ALL ${phs.length} placeholders. No commentary.

${phList}${faqBlock}

Now generate all placeholders:`;
}
function callAI(prompt) { return new Promise((res, rej) => { const u = new URL(BASE_URL + '/chat/completions'); const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert SEO content writer for crystals & feng shui. Natural evidence-grounded English, avoids AI clichés, culturally respectful, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 16000 }); const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { const j = JSON.parse(d); const c = j.choices?.[0]?.message?.content || ''; if (!c) return rej(new Error('empty: ' + d.slice(0, 200))); res(c); } catch (e) { rej(new Error('Bad JSON')); } }); }); r.on('error', rej); r.setTimeout(300000, () => r.destroy(new Error('timeout'))); r.write(body); r.end(); }); }
async function processArticle(f) { const slug = path.basename(f, '.json'); const phFile = path.join(PH_DIR, slug + '.txt'); if (fs.existsSync(phFile)) { console.log('⏭', slug); return 'skip'; } const art = JSON.parse(fs.readFileSync(f, 'utf8')); const phs = getPlaceholders(art); console.log(`[${slug}] ${phs.length} 占位符...`); try { const content = await callAI(buildPrompt(art)); const covered = phs.filter(p => content.includes('@@@' + p + '@@@')); fs.writeFileSync(phFile, covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content, 'utf8'); console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok'; } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; } }
(async () => {
  if (!API_KEY) { console.error('✗ 缺 API_KEY'); process.exit(1); }
  fs.mkdirSync(PH_DIR, { recursive: true });
  let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json'));
  if (slugArg) files = files.filter(f => f === slugArg + '.json');
  else {
    // 只处理未 fill 的（skip 已有 placeholder），支持断点续传分批
    files = files.filter(f => !fs.existsSync(path.join(PH_DIR, path.basename(f, '.json') + '.txt')));
    if (OFFSET) files = files.slice(OFFSET);
    if (LIMIT) files = files.slice(0, LIMIT);
  }
  console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} limit=${LIMIT || 'all'} offset=${OFFSET} count=${files.length}\n`);
  let ok = 0, fail = 0, skip = 0;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(f => processArticle(path.join(ART_DIR, f))));
    for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; }
    if (i + BATCH < files.length) { console.log('  (间隔 8s)'); await new Promise(r => setTimeout(r, 8000)); }
  }
  console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`);
})();
