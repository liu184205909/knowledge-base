/**
 * Schedule the active Dream manifest: two posts per Shanghai calendar day at
 * deterministic-but-varied daytime times. Default is dry-run.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const DREAMS_DIR = path.resolve(__dirname, '..');
const PACKAGE_DIR = path.join(DREAMS_DIR, 'wp-draft-package');
const MANIFEST_PATH = path.join(PACKAGE_DIR, 'manifest.json');
const RESULTS_PATH = path.join(PACKAGE_DIR, 'upload-results.jsonl');
const args = process.argv.slice(2);
const EXECUTE = args.includes('--execute');
const offsetArg = args.find((arg) => arg.startsWith('--offset='))?.split('=')[1];
const limitArg = args.find((arg) => arg.startsWith('--limit='))?.split('=')[1];
const startArg = args.find((arg) => arg.startsWith('--start='))?.split('=')[1] || '2026-07-11';
const OFFSET = offsetArg ? Number(offsetArg) : 0;
const LIMIT = limitArg ? Number(limitArg) : Infinity;

function loadEnv() {
  const envPath = path.join(os.homedir(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([^#=]+)=(.*)$/);
    if (match && ['WP_SITE', 'WP_USER', 'WP_APP_PASSWORD'].includes(match[1].trim())) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const SITE = (process.env.WP_SITE || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const USER = process.env.WP_USER;
const PASS = process.env.WP_APP_PASSWORD;
const AUTH = USER && PASS ? 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64') : '';

function request(apiPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(JSON.stringify(body)) : Buffer.alloc(0);
    const req = https.request({
      hostname: SITE,
      port: 443,
      path: apiPath,
      method,
      headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': payload.length },
    }, (res) => {
      let text = '';
      res.on('data', (chunk) => { text += chunk; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 240)}`));
        resolve(parsed);
      });
    });
    req.on('error', reject);
    req.setTimeout(180000, () => req.destroy(new Error('timeout')));
    if (payload.length) req.write(payload);
    req.end();
  });
}

function appendResult(row) {
  fs.appendFileSync(RESULTS_PATH, JSON.stringify(row) + '\n', 'utf8');
}

function seedFrom(text) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function random(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(values, rng) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index--) {
    const target = Math.floor(rng() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function addDays(dateText, days) {
  const [year, month, day] = dateText.split('-').map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + days));
  return value.toISOString().slice(0, 10);
}

function localAndGmt(date, minutes) {
  const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
  const minute = String(minutes % 60).padStart(2, '0');
  const local = `${date}T${hour}:${minute}:00`;
  const utc = new Date(`${local}+08:00`).toISOString().slice(0, 19);
  return { local, utc };
}

function buildPlan(slugs) {
  const rng = random(seedFrom(`dream-schedule:${startArg}:${slugs.length}`));
  const ordered = shuffled(slugs, rng);
  return ordered.map((slug, index) => {
    const dayIndex = Math.floor(index / 2);
    const dayRng = random(seedFrom(`dream-day:${startArg}:${dayIndex}`));
    const minutes = [
      8 * 60 + 15 + Math.floor(dayRng() * (12 * 60 + 30)),
      8 * 60 + 15 + Math.floor(dayRng() * (12 * 60 + 30)),
    ].sort((a, b) => a - b);
    if (minutes[1] === minutes[0]) minutes[1] = Math.min(minutes[1] + 17, 20 * 60 + 45);
    const { local, utc } = localAndGmt(addDays(startArg, dayIndex), minutes[index % 2]);
    return { slug, date_local: local, date_gmt: utc };
  });
}

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) throw new Error('Missing active manifest: ' + MANIFEST_PATH);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const plan = buildPlan(manifest.slugs).slice(OFFSET, OFFSET + LIMIT);
  console.log(JSON.stringify({ mode: EXECUTE ? 'execute' : 'dry-run', active: manifest.slugs.length, start: startArg, offset: OFFSET, count: plan.length, sample: plan.slice(0, 4) }, null, 2));
  if (!EXECUTE) return;
  if (!SITE || !USER || !PASS) throw new Error('Missing WordPress credentials.');
  const categories = await request('/wp-json/wp/v2/categories?slug=dreams&_fields=id,slug');
  const categoryId = categories[0]?.id;
  if (!categoryId) throw new Error('Dreams category not found.');
  let scheduled = 0;
  let failed = 0;
  for (const item of plan) {
    try {
      const found = await request(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(item.slug)}&status=any&_fields=id,slug,status`);
      const post = found[0];
      if (!post) throw new Error('post not found');
      const updated = await request(`/wp-json/wp/v2/posts/${post.id}?_fields=id,slug,status,date,date_gmt`, 'POST', {
        status: 'future', date: item.date_local, date_gmt: item.date_gmt, categories: [categoryId],
      });
      await request('/wp-json/rankmath/v1/updateMeta', 'POST', {
        objectType: 'post', objectID: post.id,
        meta: { rank_math_robots: ['index', 'follow'] },
      });
      scheduled++;
      appendResult({ slug: item.slug, status: 'scheduled', post: updated, scheduled_at: item.date_local, ts: new Date().toISOString() });
    } catch (error) {
      failed++;
      appendResult({ slug: item.slug, status: 'schedule_fail', error: error.message, scheduled_at: item.date_local, ts: new Date().toISOString() });
    }
  }
  console.log(JSON.stringify({ scheduled, failed }, null, 2));
  if (failed) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exit(1); });
