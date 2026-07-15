/**
 * 藏式 Dzi bead AI 批量填充（文化 E-E-A-T）
 * 读 articles/{slug}.json → 文化 prompt（英化中文数据 + cultural_source + 不强装大师 + 文化尊重）→ _placeholders/{slug}.txt
 * BATCH=2。用法：node fill-ai-batch-dzi.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
function loadEnv() { const p = path.join(os.homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles');
const PH_DIR = path.join(DIR, '_placeholders');
const BASE_URL = (process.env.AGNES_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = process.env.AGNES_TEXT_MODEL || process.env.GLM_MODEL || 'gpt-4o-mini';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const BATCH = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '2');
function getPlaceholders(art) { const phs = []; const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g; let m; while ((m = re.exec(art.content || '')) !== null) if (!phs.includes(m[1])) phs.push(m[1]); for (const f of ['rank_math_description', 'excerpt']) if (art[f] && art[f].includes('{{AI_')) { const mm = art[f].match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (mm && !phs.includes(mm[1])) phs.push(mm[1]); } return phs; }
function buildPrompt(art) {
  const phs = getPlaceholders(art);
  const phList = phs.map(p => `- @@@${p}@@@`).join('\n');
  return `You are an expert SEO content writer for Earthward (Eastern-inspired healing crystal jewelry). Write premium, evidence-grounded, CULTURALLY RESPECTFUL English content about a Tibetan Dzi bead.

ARTICLE: ${art.title}
SUBJECT: ${art.name_en} (${art.name_zh}), ${art.eyes} eyes
PRIMARY KEYWORD: ${art.rank_math_focus_keyword}

FACTUAL DATA (from Tibetan cultural sources — translate to natural English, do NOT fabricate beyond this):
- Meaning: ${art.meaning}
- Traditional benefits: ${(art.benefits || []).join(' | ')}
- Who should wear: ${art.who_should_wear || 'general'}
- Considerations: ${art.who_should_avoid || 'none specific'}
- Paired crystals: ${(art.crystals || []).join(', ')} — ${art.crystals_note || ''}
- Cultural source: ${art.cultural_source || 'Tibetan cultural traditions'}

CRITICAL RULES (CULTURAL E-E-A-T — this is the lifeline):
1. CULTURAL RESPECT: Dzi beads come from Tibetan/Bhutanese/Himalayan traditions. Frame as "in Tibetan tradition...", "Tibetan culture regards...", "traditionally believed to...". Acknowledge the cultural origin. Do NOT appropriate, do NOT claim authority/master status, do NOT fabricate lineage or scripture.
2. HONESTY: where data is marked "待核文化源" or uncertain, use hedged language ("some traditions hold...", "is often associated with") rather than definitive claims. Do NOT invent specific historical figures or dates.
3. COMPLIANCE: NEVER "guarantees wealth/health/protection", "ward off evil definitively", "cures". Use: traditionally associated with / believed to support / many wearers find / a symbol of. Benefits = cultural symbolism + personal reflection, NOT promises.
4. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/intricate/seamless/leverage/foster/paramount/plethora/myriad.
5. TRANSLATE the Chinese factual data into natural, respectful English (the data above is the source of truth — don't add meanings not present).
6. AUTHENTICITY section: address the genuine-ancient-Dzi rarity honestly (most are modern reproductions; ancient beads are heirloom-priced) — practical guidance, not hype.
7. Output HTML <p> paragraphs (<strong> key terms, <em> notes).

OUTPUT: for EACH placeholder, "@@@PLACEHOLDER@@@" then content then blank line. Output ALL ${phs.length} placeholders. No commentary.

${phList}

Now generate all placeholders:`;
}
function callAI(prompt) { return new Promise((res, rej) => { const u = new URL(BASE_URL + '/chat/completions'); const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert SEO content writer specializing in Tibetan cultural symbols and crystals. Culturally respectful, evidence-grounded English, avoids AI clichés, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 16000 }); const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { const j = JSON.parse(d); const c = j.choices?.[0]?.message?.content || ''; if (!c) return rej(new Error('empty: ' + d.slice(0, 200))); res(c); } catch (e) { rej(new Error('Bad JSON')); } }); }); r.on('error', rej); r.setTimeout(300000, () => r.destroy(new Error('timeout'))); r.write(body); r.end(); }); }
async function processArticle(f) { const slug = path.basename(f, '.json'); const phFile = path.join(PH_DIR, slug + '.txt'); if (fs.existsSync(phFile)) { console.log('⏭', slug); return 'skip'; } const art = JSON.parse(fs.readFileSync(f, 'utf8')); const phs = getPlaceholders(art); console.log(`[${slug}] ${phs.length} 占位符...`); try { const content = await callAI(buildPrompt(art)); const covered = phs.filter(p => content.includes('@@@' + p + '@@@')); fs.writeFileSync(phFile, covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content, 'utf8'); console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok'; } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; } }
(async () => { if (!API_KEY) { console.error('✗ 缺 API_KEY'); process.exit(1); } fs.mkdirSync(PH_DIR, { recursive: true }); let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json')); if (slugArg) files = files.filter(f => f === slugArg + '.json'); console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${files.length}\n`); let ok = 0, fail = 0, skip = 0; for (let i = 0; i < files.length; i += BATCH) { const batch = files.slice(i, i + BATCH); const results = await Promise.all(batch.map(f => processArticle(path.join(ART_DIR, f)))); for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; } if (i + BATCH < files.length) { console.log('  (间隔 8s)'); await new Promise(r => setTimeout(r, 8000)); } } console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`); })();
