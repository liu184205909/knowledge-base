/**
 * Astrology planet-in-sign AI 批量填充（行星×星座组合含义）
 * 读 articles-planet-in-sign/{slug}.json → astrology prompt（AI 组合行星+星座属性）→ _placeholders-planet-in-sign/{slug}.txt
 * BATCH=2。用法：node fill-ai-batch-mainpages.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');
function loadEnv() { const p = path.join(os.homedir(), '.env'); if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.+)$/); if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, ''); } }
loadEnv();
const DIR = path.resolve(__dirname, '..');
const ART_DIR = path.join(DIR, 'articles-planet-in-sign');
const PH_DIR = path.join(DIR, '_placeholders-planet-in-sign');
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
  const phs = getPlaceholders(art); const crystalBlock = (art.crystals || []).map(stoneInfo).join('\n');
  const phList = phs.map(p => `- @@@${p}@@@`).join('\n');
  return `You are an expert astrologer SEO content writer for Earthward (healing crystal jewelry). Write premium, nuanced, non-deterministic English content about an astrology placement.

ARTICLE: ${art.title}
SUBJECT: ${art.planet_name} in ${art.sign_name}
PRIMARY KEYWORD: ${art.rank_math_focus_keyword}

ASTROLOGICAL DATA (Western astrology — public, classical):
- Planet ${art.planet_name} drives: ${art.planet_drives}
- Planet keywords: ${(art.planet_keywords || []).join(', ')}
- Sign ${art.sign_name}: ${art.sign_traits} (element/quality from data)
- Sign keywords: ${(art.sign_keywords || []).join(', ')}

Your task: synthesize what ${art.planet_name} in ${art.sign_name} specifically means — how this planet's drive EXPRESSES through this sign's energy. Be specific to THIS combination (not generic planet or sign descriptions). Reference element/quality dynamics.

CRYSTALS (THREE-ELEMENT each: science + tradition + mindfulness; pairings are MODERN astrological associations):
${crystalBlock}

CRITICAL RULES:
1. NON-DETERMINISTIC: astrology is a symbolic/reflection framework. NEVER "you are destined to", "will definitely", "guarantees", "means you will be". Use: suggests/tends to/invites reflection on/often expresses as/many with this placement find. No two people with the same placement are identical.
2. NOT SCIENCE: do not claim astrology is scientifically proven. Frame as symbolic/archetypal language for self-understanding.
3. NUANCE: every placement has light AND shadow (strengths + challenges). Balance both honestly.
4. EASTERN: parallel reference only — 七曜 (Seven Luminaries: Sun/Moon + 5 visible planets mapped to 火水木金土曜). Frame as parallel, not historical equivalence.
5. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate/intricate/seamless/leverage/foster/paramount/plethora/myriad.
6. THREE PERSPECTIVES woven naturally: astrological symbolism + crystal mineralogy + mindfulness/self-reflection.
7. Output HTML <p> paragraphs (<strong> key terms, <em> notes).

OUTPUT: for EACH placeholder, "@@@PLACEHOLDER@@@" then content then blank line. Output ALL ${phs.length} placeholders. No commentary.

${phList}

Now generate all placeholders:`;
}
function callAI(prompt) { return new Promise((res, rej) => { const u = new URL(BASE_URL + '/chat/completions'); const body = JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: 'Expert astrologer and crystal SEO writer. Nuanced, non-deterministic, evidence-grounded English, avoids AI clichés, follows formatting precisely.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 4000 }); const r = https.request({ hostname: u.hostname, port: u.port || 443, path: u.pathname, method: 'POST', headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { if (x.statusCode >= 400) return rej(new Error('HTTP ' + x.statusCode + ': ' + d.slice(0, 300))); try { const j = JSON.parse(d); const c = j.choices?.[0]?.message?.content || ''; if (!c) return rej(new Error('empty: ' + d.slice(0, 200))); res(c); } catch (e) { rej(new Error('Bad JSON')); } }); }); r.on('error', rej); r.setTimeout(300000, () => r.destroy(new Error('timeout'))); r.write(body); r.end(); }); }
async function processArticle(f) { const slug = path.basename(f, '.json'); const phFile = path.join(PH_DIR, slug + '.txt'); if (fs.existsSync(phFile)) { console.log('⏭', slug); return 'skip'; } const art = JSON.parse(fs.readFileSync(f, 'utf8')); const phs = getPlaceholders(art); console.log(`[${slug}] ${phs.length} 占位符...`); try { const content = await callAI(buildPrompt(art)); const covered = phs.filter(p => content.includes('@@@' + p + '@@@')); fs.writeFileSync(phFile, covered.length < phs.length * 0.7 ? await callAI(buildPrompt(art)) : content, 'utf8'); console.log(`  ✅ ${slug} (${covered.length}/${phs.length})`); return 'ok'; } catch (e) { console.log(`  ❌ ${slug}: ${e.message.slice(0, 120)}`); return 'fail'; } }
(async () => { if (!API_KEY) { console.error('✗ 缺 API_KEY'); process.exit(1); } fs.mkdirSync(PH_DIR, { recursive: true }); let files = fs.readdirSync(ART_DIR).filter(f => f.endsWith('.json')); if (slugArg) files = files.filter(f => f === slugArg + '.json'); const off = parseInt(args.find(a => a.startsWith('--offset='))?.split('=')[1] || '0'); const lim = args.find(a => a.startsWith('--limit='))?.split('=')[1]; if (lim) files = files.slice(off, off + parseInt(lim)); else if (off) files = files.slice(off); console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${files.length}\n`); let ok = 0, fail = 0, skip = 0; for (let i = 0; i < files.length; i += BATCH) { const batch = files.slice(i, i + BATCH); const results = await Promise.all(batch.map(f => processArticle(path.join(ART_DIR, f)))); for (const r of results) { if (r === 'ok') ok++; else if (r === 'skip') skip++; else fail++; } if (i + BATCH < files.length) { console.log('  (间隔 8s)'); await new Promise(r => setTimeout(r, 8000)); } } console.log(`\n=== ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`); })();
