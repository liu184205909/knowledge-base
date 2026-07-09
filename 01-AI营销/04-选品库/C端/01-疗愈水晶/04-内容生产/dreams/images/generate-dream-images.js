/**
 * Dream hero image generation.
 *
 * Reads the image generation queue created by the Dream image manifest worker,
 * calls the configured OpenAI-compatible image endpoint, writes WebP files, and
 * appends a JSONL result log so interrupted runs can resume safely.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = __dirname;
const DREAMS_DIR = path.resolve(IMAGES_DIR, '..');
const PROJECT_ROOT = path.resolve(DREAMS_DIR, '../..');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, '02-网站规划', 'assets', 'images', 'generated', 'dreams');
const QUEUE_PATH = path.join(IMAGES_DIR, 'dream-image-generation-queue-20260709-image-manifest-worker.jsonl');
const RESULTS_PATH = path.join(IMAGES_DIR, 'dream-image-generation-results.jsonl');
const SUMMARY_PATH = path.join(IMAGES_DIR, 'dream-image-generation-summary.json');

function loadEnv() {
  const envPath = path.join(require('os').homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Z_]+)\s*=\s*(.+)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1];
const concurrencyArg = args.find((a) => a.startsWith('--concurrency='))?.split('=')[1];
const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const LIMIT = limitArg ? Number(limitArg) : Infinity;
const CONCURRENCY = Math.max(1, Math.min(4, Number(concurrencyArg || 2)));

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function appendResult(row) {
  fs.appendFileSync(RESULTS_PATH, JSON.stringify(row) + '\n', 'utf8');
}

function existingCompletedSlugs() {
  const done = new Set();
  if (!fs.existsSync(RESULTS_PATH)) return done;
  for (const line of fs.readFileSync(RESULTS_PATH, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      if (row.status === 'ok' || row.status === 'skip_existing') done.add(row.slug);
    } catch {}
  }
  return done;
}

function requestImage(prompt, size, quality) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + '/images/generations');
    const body = JSON.stringify({ model: MODEL, prompt, size, quality, response_format: 'b64_json' });
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode + ': ' + data.slice(0, 500)));
        try { resolve(JSON.parse(data)); } catch { reject(new Error('Bad JSON: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => req.destroy(new Error('timeout')));
    req.write(body);
    req.end();
  });
}

function outPathFor(item) {
  return path.join(OUTPUT_ROOT, item.slug, item.filename || `${item.slug}-hero.webp`);
}

async function generateOne(item) {
  const absFile = outPathFor(item);
  if (fs.existsSync(absFile)) {
    appendResult({ slug: item.slug, source_row: item.source_row, status: 'skip_existing', file: absFile, ts: new Date().toISOString() });
    return 'skip';
  }
  fs.mkdirSync(path.dirname(absFile), { recursive: true });
  const prompt = [
    item.hero_prompt,
    'Premium editorial image quality.',
    'No text, no watermark, no logo.',
    Array.isArray(item.negative_prompt) && item.negative_prompt.length
      ? `Avoid: ${item.negative_prompt.join(', ')}.`
      : '',
  ].filter(Boolean).join(' ');
  try {
    const res = await requestImage(prompt, '1536x1024', 'medium');
    const data = res.data?.[0];
    if (!data) throw new Error('No image data returned');
    let buf;
    if (data.b64_json) {
      buf = Buffer.from(data.b64_json, 'base64');
    } else if (data.url) {
      buf = await new Promise((resolve, reject) => {
        https.get(data.url, (dl) => {
          if (dl.statusCode >= 400) return reject(new Error('download HTTP ' + dl.statusCode));
          const chunks = [];
          dl.on('data', (chunk) => chunks.push(chunk));
          dl.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
      });
    } else {
      throw new Error('No b64_json or url in image response');
    }
    const sharp = require('sharp');
    await sharp(buf).resize(1536, 864, { fit: 'cover', position: 'center' }).webp({ quality: 85 }).toFile(absFile);
    appendResult({ slug: item.slug, source_row: item.source_row, status: 'ok', file: absFile, ts: new Date().toISOString() });
    return 'ok';
  } catch (error) {
    appendResult({ slug: item.slug, source_row: item.source_row, status: 'fail', error: error.message, ts: new Date().toISOString() });
    return 'fail';
  }
}

async function main() {
  if (!API_KEY) {
    console.error('Missing OPENAI_API_KEY in environment or ~/.env.');
    process.exit(1);
  }
  const completed = existingCompletedSlugs();
  let queue = readJsonl(QUEUE_PATH).filter((item) => item.actual_image_request && item.route === 'draftable');
  if (slugArg) queue = queue.filter((item) => item.slug === slugArg);
  queue = queue.filter((item) => !completed.has(item.slug)).slice(0, LIMIT);
  console.log(JSON.stringify({ base_url: BASE_URL, model: MODEL, queue: queue.length, concurrency: CONCURRENCY, output_root: OUTPUT_ROOT }, null, 2));

  let cursor = 0;
  const counts = { ok: 0, fail: 0, skip: 0 };
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= queue.length) break;
      const item = queue[i];
      console.log(`[${i + 1}/${queue.length}] ${item.slug}`);
      const result = await generateOne(item);
      counts[result === 'ok' ? 'ok' : result === 'skip' ? 'skip' : 'fail']++;
    }
  });
  await Promise.all(workers);

  const summary = {
    ts: new Date().toISOString(),
    base_url: BASE_URL,
    model: MODEL,
    attempted_this_run: queue.length,
    counts,
    output_root: OUTPUT_ROOT,
    results_log: RESULTS_PATH,
  };
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
