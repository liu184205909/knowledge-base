/**
 * Spiritual 集群 AI 批量填充（cross-tradition 反思框架）
 * 读 articles-mainpages/{slug}.json → spiritual prompt（跨传统 framing + reflection framework 非医疗/非超能力）→ _placeholders-mainpages/{slug}.txt
 * BATCH=2。用法：node fill-ai-batch-mainpages.js [--slug=xxx]
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
function stoneName(slug) { const a = ATTR[slug + '-meaning']; if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim(); if (s) return s; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function stoneInfo(slug) { const a = ATTR[slug + '-meaning']; if (!a) return `${stoneName(slug)} (${slug})`; return `${stoneName(slug)} (${slug}): mineral=${a.mineral || 'n/a'}\n  SCIENCE: ${(a.science || a.healing || '').slice(0, 160)}\n  TRADITION: ${(a.tradition || a.spiritual || '').slice(0, 160)}`; }
function getPlaceholders(art) { const phs = []; const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g; let m; while ((m = re.exec(art.content || '')) !== null) if (!phs.includes(m[1])) phs.push(m[1]); for (const f of ['rank_math_description', 'excerpt']) if (art[f] && art[f].includes('{{AI_')) { const mm = art[f].match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/); if (mm && !phs.includes(mm[1])) phs.push(mm[1]); } return phs; }
function buildPrompt(art) {
  const phs = getPlaceholders(art); const calc = art.calculation || {};
  const crystalBlock = (art.crystals || []).map(stoneInfo).join('\n');
  const phList = phs.map(p => `- @@@${p}@@@`).join('\n');
  return `You are an expert SEO content writer for Earthward (healing crystal jewelry). Write premium, evidence-grounded, CULTURALLY INCLUSIVE English content about a spiritual practice/topic.

ARTICLE: ${art.title}
SUBJECT: ${art.title.replace(/:.*/, '')}
PRIMARY KEYWORD: ${art.rank_math_focus_keyword}

FACTUAL DATA (symbolic/reflective framework — translate to natural English, do NOT fabricate):
- Meaning: ${art.definition}
- How to engage: ${(calc.steps || []).join(' | ')}
${calc.example ? 'Note: ' + calc.example : ''}

CRYSTALS (THREE-ELEMENT each: science + tradition + mindfulness; pairings are modern associations):
${crystalBlock}

TRADITIONS (cross-tradition — reference multiple as parallel frames): ${art.eastern_note || 'cross-tradition spiritual (Hindu tantric/Tibetan Buddhist/Daoist/Sufi/Christian mystic/Native etc. — cite as parallel frames)'}

CRITICAL RULES:
1. REFLECTION FRAMEWORK: spirituality here is symbolic/reflective, NOT religion, NOT medical, NOT supernatural. NEVER "cures/heals illness", "grants supernatural powers", "guarantees awakening", "manifests wealth". Use: invites reflection on / many find a mindful anchor in / traditionally associated with / a symbolic practice for. Spiritual healing = "a framework for self-reflection, not a substitute for medical or mental health treatment". Spiritual gifts = "ordinary human capacities (empathy/intuition), not supernatural powers".
2. CROSS-TRADITION: cite multiple traditions as parallel frames ("in Hindu tantric tradition...", "Tibetan Buddhism describes...", "Daoist practice...", "Christian mystic tradition..."). Do NOT favor one, do NOT appropriate, do NOT claim exclusive truth.
3. COMPLIANCE: no medical claims, no supernatural power claims, no guaranteed outcomes. Crystal pairings = modern associations.
4. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/manifest abundance/intricate/seamless/leverage/foster/paramount/plethora/myriad.
5. THREE PERSPECTIVES woven naturally: spiritual symbolism + crystal mineralogy + mindfulness/self-reflection.
6. DIFFERENTIATE from intention (outcome-focused) and meditation (technique): spiritual = the living practice/journey/theme.
7. Output HTML <p> paragraphs (<strong> key terms, <em> notes).

OUTPUT: for EACH placeholder, "@@@PLACEHOLDER@@@" then content then blank line. Output ALL ${phs.length} placeholders. No commentary.

${phList}

Now generate all placeholders:`;
}
function callAI(prompt) { return new Promise((res, rej) => { const u = new URL(BASE_URL + '/chat/completions'); const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert SEO content writer for spirituality and crystals. Cross-tradition, reflection-framework, evidence-grounded English, avoids AI clichés, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 16000 }); const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { const j = JSON.parse(d); const c = j.choices?.[0]?.message?.content || ''; if (!c) return rej(new Error('empty: ' + d.slice(0, 200))); res(c); } catch (e) { rej(new Error('Bad JSON')); } }); }); r.on('error', rej); r.setTimeout(300000, () => r.destroy(new Error('timeout'))); r.write(body); r.end(); }); }
async function processArticle(f) { const slug = path.basename(f, '.json'); const phFile = path.join(PH_DIR, slug + '.txt'); if (fs.existsSync(phFile)) { console.log('⏭', slug); return 'skip'; } const art = JSON.parse(fs.readFileSync(f, 'utf8')); const phs = getPlaceholders(art); console.log(`[${slug}] ${phs.length} 占位符...`); try { const content = await callAI(buildPrompt(art)); const covered = phs.filter(p => content.includes('@@@' + p + '@@@')); fs.writeFileSync(phFile, covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content, 'utf8'); console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok'; } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; } }
(async () => { if (!API_KEY) { console.error('✗ 缺 API_KEY'); process.exit(1); } fs.mkdirSync(PH_DIR, { recursive: true }); let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json')); if (slugArg) files = files.filter(f => f === slugArg + '.json'); console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${files.length}\n`); let ok = 0, fail = 0, skip = 0; for (let i = 0; i < files.length; i += BATCH) { const batch = files.slice(i, i + BATCH); const results = await Promise.all(batch.map(f => processArticle(path.join(ART_DIR, f)))); for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; } if (i + BATCH < files.length) { console.log('  (间隔 8s)'); await new Promise(r => setTimeout(r, 8000)); } } console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`); })();
