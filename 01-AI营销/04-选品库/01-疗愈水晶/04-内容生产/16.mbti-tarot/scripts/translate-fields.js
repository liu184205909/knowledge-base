/**
 * 翻译 mbti-tarot-knowledge.json 中的中文字段为英文（站点是英文站）
 * 翻译字段：upright_reading / reversed_shadow / crystals[].reason / eastern_anchor / birth_cards.primary.reason / birth_cards.growth.reason
 * 缓存：configs/translations-cache.json（已存在跳过，支持补译）
 * 用 Agnes text model（AGNES_TEXT_MODEL）+ 全错误重试
 * 用法：node translate-fields.js   （全量翻译缺失项）
 */
const fs = require('fs'), path = require('path'), https = require('https'), os = require('os');

// loadEnv 强制覆盖（shell 可能有错误 OPENAI_API_KEY 占位）
const ENV_OVERRIDES = {};
const envPath = path.join(os.homedir(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) ENV_OVERRIDES[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
for (const [k, v] of Object.entries(ENV_OVERRIDES)) process.env[k] = v;

const BASE_URL = (process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1').replace(/\/$/, '');
const MODEL = process.env.AGNES_TEXT_MODEL || 'agnes-text';
const API_KEY = process.env.AGNES_API_KEY || process.env.OPENAI_API_KEY;

const SHARED = path.resolve(__dirname, '../../../07-互动工具/_shared');
const BASE = path.resolve(__dirname, '..');
const mbti = JSON.parse(fs.readFileSync(path.join(SHARED, 'mbti-tarot-knowledge.json'), 'utf8'));
const cachePath = path.join(BASE, 'configs', 'translations-cache.json');
let cache = {};
if (fs.existsSync(cachePath)) {
  try { cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) {}
}

function requestChat(prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/chat/completions');
    const body = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a precise translator from Simplified Chinese to English for a spirituality / tarot / crystal / MBTI personality website (goearthward.com). Preserve the voice: contemplative, psychologically literate, non-fluffy. Keep all tarot card names in their canonical English form (The Hermit, The Magician, etc.). Keep MBTI type codes (INTJ etc.) and cognitive function codes (Ni/Ne/Si/Se/Ti/Te/Fi/Fe) as-is. Return ONLY the translation, no commentary, no quotes around it.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1200
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
          const txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
          if (!txt) return reject(new Error('no content: ' + data.slice(0, 200)));
          resolve(txt.trim());
        } catch (e) { reject(new Error('Bad JSON: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(new Error('timeout')); });
    req.write(body); req.end();
  });
}

async function translateWithRetry(prompt, retries = 4) {
  for (let i = 0; i <= retries; i++) {
    try { return await requestChat(prompt); }
    catch (e) {
      const msg = e.message || '';
      const retriable = /timeout|HTTP 5\d\d|HTTP 429|overloaded|cpu|503|524|500/i.test(msg);
      if (!retriable || i === retries) throw e;
      console.log('  retry ' + (i+1) + ': ' + msg.slice(0, 80));
      await new Promise(r => setTimeout(r, 8000 * (i+1)));
    }
  }
}

function collectTasks() {
  const tasks = [];
  for (const [type, t] of Object.entries(mbti.types)) {
    const keys = ['upright_reading', 'reversed_shadow', 'eastern_anchor'];
    for (const k of keys) {
      if (t[k] && /[一-鿿]/.test(t[k])) {
        tasks.push({ type, field: k, text: t[k] });
      }
    }
    for (const role of ['primary', 'growth']) {
      const r = t.birth_cards[role];
      if (r.reason && /[一-鿿]/.test(r.reason)) {
        tasks.push({ type, field: 'birth_' + role + '_reason', text: r.reason });
      }
    }
    for (let i = 0; i < t.crystals.length; i++) {
      const c = t.crystals[i];
      if (c.reason && /[一-鿿]/.test(c.reason)) {
        tasks.push({ type, field: 'crystal_' + i + '_reason', text: c.reason });
      }
    }
  }
  return tasks;
}

function key(task) { return task.type + '::' + task.field; }

(async () => {
  if (!API_KEY) { console.error('✗ ~/.env 缺 AGNES_API_KEY 或 OPENAI_API_KEY'); process.exit(1); }
  const tasks = collectTasks();
  const todo = tasks.filter(t => !cache[key(t)]);
  console.log('base=' + BASE_URL + ' model=' + MODEL + ' total=' + tasks.length + ' cached=' + (tasks.length - todo.length) + ' todo=' + todo.length + '\n');
  if (!todo.length) { console.log('全部已缓存'); process.exit(0); }

  let ok = 0, fail = 0;
  const CONCURRENCY = 4;
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= todo.length) break;
      const t = todo[i];
      try {
        const en = await translateWithRetry('Translate to English:\n\n' + t.text);
        cache[key(t)] = en;
        ok++;
        console.log('✓ ' + key(t));
      } catch (e) {
        fail++;
        console.log('✗ ' + key(t) + ': ' + e.message.slice(0, 100));
      }
      // 增量保存
      if ((ok + fail) % 5 === 0) fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
    }
  });
  await Promise.all(workers);
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  console.log('\n完成 ok=' + ok + ' fail=' + fail + ' 缓存 → ' + cachePath);
})();
