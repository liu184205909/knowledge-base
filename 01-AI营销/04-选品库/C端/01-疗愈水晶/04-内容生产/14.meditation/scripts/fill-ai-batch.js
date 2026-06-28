/**
 * Meditation AI 批量填充（9 篇 × ~42 占位符）
 * 读 articles/{slug}.json → 构建差异化 prompt → 调 glm API → 输出 _placeholders/{slug}.txt（@@@分隔符@@@格式）
 * BATCH=2 并发避智谱限流（claude-code-yolo-panel-overload memory）
 * 统一把控重复度：每篇 prompt 注入场景专属要素（呼吸/握手/可视化/Eastern/合规措辞/水晶三要素）
 * 用法：node fill-ai-batch.js [--slug=xxx] [--limit=N]
 * 之后跑 fill-from-placeholders.js 把 .txt 回填到 articles
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');

function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const m = t.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const DIR = path.resolve(__dirname, '..');
const KB = require('../../../07-互动工具/_shared/meditation-knowledge.json');

// 优先 AGNES 文本生成中转（moleapi 不支持 glm-4.6 文本模型），回退 OPENAI
const BASE_URL = (process.env.AGNES_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = process.env.AGNES_TEXT_MODEL || process.env.GLM_MODEL || 'gpt-4o-mini';

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const BATCH = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '2');

const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
let list = idx.articles;
if (slugArg) list = list.filter(a => a.slug === slugArg);
if (limitArg) list = list.slice(0, parseInt(limitArg));

// 收集文章的所有占位符名（有序）
function getPlaceholders(art) {
  const phs = [];
  const re = /\{\{(AI_[A-Za-z0-9_]+)\}\}/g;
  let m;
  while ((m = re.exec(art.content)) !== null) {
    if (!phs.includes(m[1])) phs.push(m[1]);
  }
  // rank_math_description + excerpt
  if (art.rank_math_description && art.rank_math_description.includes('{{AI_')) {
    const m2 = art.rank_math_description.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/);
    if (m2 && !phs.includes(m2[1])) phs.push(m2[1]);
  }
  if (art.excerpt && art.excerpt.includes('{{AI_')) {
    const m3 = art.excerpt.match(/\{\{(AI_[A-Za-z0-9_]+)\}\}/);
    if (m3 && !phs.includes(m3[1])) phs.push(m3[1]);
  }
  return phs;
}

function buildPrompt(art) {
  const scene = art.scene_data;
  const crystals = art.crystals;
  const isHub = art.id === 'M0';
  const isScript = art.id === 'M7';
  const isRoom = art.id === 'M8';

  const phs = getPlaceholders(art);

  // 场景差异化要素
  let sceneBlock = '';
  if (scene) {
    sceneBlock = `
SCENE-SPECIFIC ELEMENTS (use these EXACTLY, do NOT genericize):
- Pain point: ${scene.pain_point}
- Breath technique: ${scene.breath}
- Hold hand: ${scene.hold_hand}
- Body scan focus: ${scene.scan_focus}
- Visualization image: ${scene.visualization}
- Associated chakra: ${scene.chakra}
- Duration: ${scene.duration}
- Affirmation: ${scene.affirmation}
- COMPLIANCE PHRASING (mandatory): ${scene.compliance_phrasing}
- Eastern traditions (anchor each, ≥1 paragraph each in M5): ${art.eastern.join(' | ')}`;
  } else if (isHub) {
    sceneBlock = `
HUB ARTICLE: cover 13 crystals organized by meditation goal (focus/sleep/emotional/grounding/beginners/manifestation).
Route readers to scene deep-dives. Eastern: ${art.eastern.join(' | ')}.`;
  } else if (isScript) {
    sceneBlock = `
SCRIPT COMPILATION: provide 5 condensed ready-to-read scripts (focus/sleep/emotional-release/grounding/manifestation), each a 6-step mini-script drawn from the deep-dive articles. Stones: ${crystals.map(c => c.name).join(', ')}.`;
  } else if (isRoom) {
    sceneBlock = `
SPACE SETUP: how to arrange crystals in a meditation room (4 corners + center layout, light/sound/scent layering). Eastern: ${art.eastern.join(' | ')}.`;
  }

  // 水晶三要素
  const crystalBlock = crystals.map(c => `
- ${c.name} (${c.slug}): mineral=${c.mineral}
  SCIENCE: ${c.science}
  TRADITION: ${c.tradition}
  MINDFULNESS: ${c.mindfulness}
  SAFETY: ${c.safety_note}`).join('');

  const phList = phs.map(p => `- @@@${p}@@@`).join('\n');

  return `You are an expert SEO content writer for a crystal jewelry brand (Earthward, Eastern-inspired healing crystal jewelry). Write premium, evidence-grounded, non-AI-sounding English content for a meditation article.

ARTICLE: ${art.title}
PRIMARY KEYWORD: ${art.primary_kw}
WORD TARGET: ${art.word_target} words total
H1: ${art.h1}
${sceneBlock}

CRYSTALS (use the THREE-ELEMENT structure for each: science fact + tradition + mindfulness use; do NOT write generic "X is a calming stone"):
${crystalBlock}

STEP FLOW (M4 — the core differentiator competitors lack; write as an EXECUTABLE meditation script, not generic advice):
${art.howto_schema.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.text}`).join('\n')}

FAQ QUESTIONS (answer each 40-70 words, neutral on science, compliance-safe):
${art.faq_schema.map((f, i) => `${i + 1}. ${f.question}`).join('\n')}

CRITICAL RULES:
1. COMPLIANCE: NEVER use "cures/treats/heals anxiety/insomnia/depression", "removes negative energy", "blocks negativity", "attracts love/wealth", "guaranteed". Use: support/invite/gentle companion/mindful anchor/traditionally associated/many people experience.
2. For Sleep: use "bedtime ritual/wind-down/settling into rest" (NEVER "cures insomnia").
3. For Emotional: use "emotional release practice/holding space for feelings" (NEVER "treats depression/heals trauma").
4. THREE PERSPECTIVES woven naturally (40% science mineralogy/color psychology, 40% tradition/chakra, 20% mindfulness/placebo balance) — do NOT label them as headers.
5. EASTERN traditions: anchor with cultural framing ("in the Tibetan tradition of...", "yoga describes..."), NOT appropriation or power claims.
6. NO AI CLICHES: avoid delve/harness/realm/tapestry/journey/unlock/elevate vibration/manifest abundance/intricate/seamless/leverage/foster/paramount/plethora/myriad.
7. Each crystal M3 section = 3 sentences: one science, one tradition, one mindfulness (NOT generic praise).
8. M4 steps must be SPECIFIC to this scene (the exact breath count, the exact body part, the exact image) — this is what competitors don't do.
9. Output as HTML <p> paragraphs (and <strong> for key terms, <em> for mineral/care notes inline).

OUTPUT FORMAT — for EACH placeholder below, output a line "@@@PLACEHOLDER_NAME@@@" followed by the content, then a blank line. Output ALL ${phs.length} placeholders. Do not add any other commentary.

${phList}

Now generate all placeholders:`;
}

function callAI(prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/chat/completions');
    const body = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert SEO content writer specializing in crystals, meditation, and mindfulness. You write in natural, evidence-grounded English that avoids AI clichés. You follow formatting instructions precisely.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 16000,
    });
    const req = https.request({
      hostname: url.hostname, port: url.port || 443,
      path: url.pathname + url.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 400)));
        try {
          const j = JSON.parse(data);
          const content = j.choices?.[0]?.message?.content || '';
          if (!content) return reject(new Error('empty content: ' + data.slice(0, 200)));
          resolve(content);
        } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(300000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function processArticle(meta) {
  const artFile = path.join(DIR, 'articles', meta.slug + '.json');
  const phFile = path.join(DIR, '_placeholders', meta.slug + '.txt');
  if (fs.existsSync(phFile)) { console.log(`⏭ ${meta.slug} (已存在)`); return 'skip'; }
  const art = JSON.parse(fs.readFileSync(artFile, 'utf8'));
  const prompt = buildPrompt(art);
  const phs = getPlaceholders(art);
  console.log(`[${meta.slug}] ${phs.length} 占位符, 请求中...`);
  try {
    const content = await callAI(prompt);
    // 验证占位符覆盖
    const covered = phs.filter(p => content.includes('@@@' + p + '@@@'));
    if (covered.length < phs.length * 0.7) {
      console.log(`  ⚠ 覆盖率低 ${covered.length}/${phs.length}, 重试...`);
      const content2 = await callAI(prompt);
      fs.writeFileSync(phFile, content2, 'utf8');
    } else {
      fs.writeFileSync(phFile, content, 'utf8');
    }
    console.log(`  ✅ ${meta.slug} (${covered.length}/${phs.length} 覆盖)`);
    return 'ok';
  } catch (e) {
    console.log(`  ❌ ${meta.slug}: ${e.message.slice(0, 120)}`);
    return 'fail';
  }
}

(async () => {
  if (!API_KEY) { console.error('✗ 缺 OPENAI_API_KEY'); process.exit(1); }
  console.log(`base=${BASE_URL} model=${MODEL} batch=${BATCH} count=${list.length}\n`);

  let ok = 0, fail = 0, skip = 0;
  // 分批 BATCH 并发
  for (let i = 0; i < list.length; i += BATCH) {
    const batch = list.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(m => processArticle(m)));
    for (const r of results) {
      if (r === 'ok') ok++;
      else if (r === 'skip') skip++;
      else fail++;
    }
    // 批间间隔避限流
    if (i + BATCH < list.length) {
      console.log(`  (批间间隔 8s)`);
      await new Promise(r => setTimeout(r, 8000));
    }
  }
  console.log(`\n=== 完成: ${ok} OK, ${fail} ERR, ${skip} 跳过 ===`);
  if (fail > 0) console.log(`失败篇可重跑: node fill-ai-batch.js --slug=<slug>`);
})();
