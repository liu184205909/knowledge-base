#!/usr/bin/env node

/**
 * Restore and translate the 11 future Tarot posts whose original bodies were
 * substantially Chinese. Uses the pre-fix gzip backup as the source of truth,
 * preserves current JSON-LD and product modules, then writes English HTML.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV = loadEnv();
const SITE = ENV.WP_SITE || 'goearthward.com';
const AUTH = `${ENV.WP_USER}:${ENV.WP_APP_PASSWORD}`;
const PROXY = process.env.EARTHWARD_PROXY || 'socks5://127.0.0.1:10808';
const APPLY = process.argv.includes('--apply');
const IDS = [49416, 50249, 48364, 49564, 50209, 49634, 50223, 48340, 49912, 49010, 49047, 49618];
const ID_ARG = process.argv.find((arg) => arg.startsWith('--id='));
const TARGET_IDS = ID_ARG ? [Number(ID_ARG.split('=')[1])] : IDS;
const CJK = /[\u3400-\u9fff]/u;
const OUTPUT_DIR = path.join(__dirname, 'reports', 'translated-thin-tarot');

function loadEnv() {
  const result = {};
  for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
    const text = line.trim();
    if (!text || text.startsWith('#')) continue;
    const equals = text.indexOf('=');
    if (equals > 0) result[text.slice(0, equals).trim()] = text.slice(equals + 1).trim();
  }
  return result;
}

function curl(args, input) {
  const full = ['-sS', '--fail-with-body', '--proxy', PROXY, '--max-time', '300', ...args];
  return execFileSync('curl.exe', full, {
    input, encoding: 'utf8', maxBuffer: 80 * 1024 * 1024,
  });
}

function wpGet(endpoint) {
  return JSON.parse(curl(['-u', AUTH, `https://${SITE}${endpoint}`]));
}

function wpWrite(id, payload) {
  return JSON.parse(curl([
    '-u', AUTH, '-X', 'POST', '-H', 'Content-Type: application/json',
    '--data-binary', '@-', `https://${SITE}/wp-json/wp/v2/posts/${id}?context=edit&_fields=id,slug,status,modified_gmt`,
  ], JSON.stringify(payload)));
}

function deepseek(messages) {
  const base = (ENV.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const payload = JSON.stringify({
    model: ENV.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.1,
    max_tokens: 12000,
    messages,
  });
  const response = JSON.parse(curl([
    '-H', `Authorization: Bearer ${ENV.DEEPSEEK_API_KEY}`,
    '-H', 'Content-Type: application/json', '--data-binary', '@-',
    `${base}/chat/completions`,
  ], payload));
  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error(`DeepSeek response missing content: ${JSON.stringify(response).slice(0, 500)}`);
  return content.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

function latestFullBackup() {
  const dir = path.join(__dirname, 'backups');
  const files = fs.readdirSync(dir)
    .filter((name) => /^wp-posts-before-fix-.*\.json\.gz$/.test(name))
    .map((name) => ({ name, full: path.join(dir, name), stat: fs.statSync(path.join(dir, name)) }))
    .filter((file) => {
      try {
        const parsed = JSON.parse(zlib.gunzipSync(fs.readFileSync(file.full)).toString('utf8'));
        return parsed.length === 1738;
      } catch { return false; }
    })
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  if (!files.length) throw new Error('No full 1738-post rollback backup found');
  return files[0].full;
}

function splitSchemas(raw) {
  const index = raw.search(/<script\b[^>]*type=["']application\/ld\+json["']/i);
  return index < 0 ? { body: raw, schemas: '' } : { body: raw.slice(0, index), schemas: raw.slice(index) };
}

function productModule(raw) {
  const match = raw.match(/<section class="earthward-product-module"[\s\S]*?<\/section>/i);
  if (!match) throw new Error('Current content is missing the Earthward product module');
  return match[0];
}

function visibleWords(html) {
  const text = String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\[[^\]]+\]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  return text ? text.split(/\s+/).length : 0;
}

function cleanSourceBody(raw) {
  const { body } = splitSchemas(raw);
  return body
    .replace(/质检报告[\s\S]*$/u, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function fixedTitle(post) {
  const map = {
    'justice-and-the-star': 'Justice and The Star Together: Tarot Combination Meaning',
    'the-lovers-and-strength': 'The Lovers and Strength Together: Tarot Combination Meaning',
  };
  return map[post.slug] || post.title.raw;
}

function setH1(html, title) {
  return /<h1\b/i.test(html)
    ? html.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${title}</h1>`)
    : html;
}

if (!ENV.DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY is missing');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const backupPath = latestFullBackup();
console.log(`Source backup: ${backupPath}`);
const backup = JSON.parse(zlib.gunzipSync(fs.readFileSync(backupPath)).toString('utf8'));
const oldById = new Map(backup.map((post) => [post.id, post]));
// Sample runs created one-post backups before the full backup. For each target,
// prefer the backup version with the most CJK source text so a previously
// cleaned sample cannot become the translation source.
for (const name of fs.readdirSync(path.join(__dirname, 'backups')).filter((file) => file.endsWith('.json.gz'))) {
  try {
    const items = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'backups', name))).toString('utf8'));
    for (const candidate of items) {
      if (!TARGET_IDS.includes(candidate.id)) continue;
      const currentBest = oldById.get(candidate.id);
      const candidateCjk = (candidate.content?.raw?.match(/[\u3400-\u9fff]/g) || []).length;
      const bestCjk = (currentBest?.content?.raw?.match(/[\u3400-\u9fff]/g) || []).length;
      if (candidateCjk > bestCjk) oldById.set(candidate.id, candidate);
    }
  } catch { /* ignore incomplete/non-post backup files */ }
}

const current = [];
for (let offset = 0; offset < TARGET_IDS.length; offset += 50) {
  const ids = TARGET_IDS.slice(offset, offset + 50).join(',');
  current.push(...wpGet(`/wp-json/wp/v2/posts?include=${ids}&status=any&context=edit&per_page=100&_fields=id,slug,status,title,content`));
}

const translations = new Map();
const results = [];
for (let index = 0; index < current.length; index++) {
  const post = current[index];
  const old = oldById.get(post.id);
  if (!old) throw new Error(`Post ${post.id} missing from backup`);
  const sourceBody = cleanSourceBody(old.content.raw);
  const cacheKey = sourceBody;
  let translated = translations.get(cacheKey);
  if (!translated) {
    console.log(`Translating ${index + 1}/${current.length}: ${post.slug} (${sourceBody.length} chars)`);
    translated = deepseek([
      {
        role: 'system',
        content: 'You are a meticulous English localization editor for a tarot and crystal website. Return only publication-ready HTML, with no markdown code fence and no commentary.',
      },
      {
        role: 'user',
        content: `Translate every Chinese-language sentence, heading, table cell, and phrase in the HTML below into natural US English.\n\nRequirements:\n- Preserve all existing HTML tags, attributes, links, images, and existing English text.\n- Translate the meaning faithfully; do not shorten or summarize the article.\n- Remove production-only labels such as module numbers, writing notes, QC notes, or placeholder labels instead of translating them into visible copy.\n- Convert Chinese punctuation to normal English punctuation.\n- The final visible article must contain zero Chinese characters.\n- Keep tarot names, crystal names, safety disclaimers, and non-deterministic wording accurate.\n- Do not add a product module or JSON-LD; those are appended separately.\n\nHTML:\n${sourceBody}`,
      },
    ]);
    translations.set(cacheKey, translated);
  } else {
    console.log(`Reusing identical translation for ${post.slug}`);
  }

  if (CJK.test(translated)) {
    console.log(`Second-pass CJK cleanup for ${post.slug}`);
    translated = deepseek([
      {
        role: 'system',
        content: 'You are a strict English copy editor. Return only the corrected HTML, with no markdown fence or commentary.',
      },
      {
        role: 'user',
        content: `The HTML below is already translated, but a few Chinese characters or Chinese phrases remain. Translate every remaining Chinese character into natural English. Preserve all HTML, links, existing English copy, and article length. Do not summarize. The final result must contain zero CJK characters.\n\n${translated}`,
      },
    ]);
    translations.set(cacheKey, translated);
  }

  const title = fixedTitle(post);
  translated = setH1(translated, title);
  let { schemas } = splitSchemas(post.content.raw);
  if (CJK.test(schemas)) {
    console.log(`Translating JSON-LD CJK for ${post.slug}`);
    schemas = deepseek([
      {
        role: 'system',
        content: 'You are a strict structured-data localization editor. Return only the corrected script elements, with no markdown fence or commentary.',
      },
      {
        role: 'user',
        content: `Translate every Chinese string value in these application/ld+json script elements into natural English. Preserve every script tag, JSON key, URL, schema type, and valid JSON syntax. Do not add or remove schema objects. The result must contain zero CJK characters.\n\n${schemas}`,
      },
    ]);
  }
  const nextContent = `${translated}\n\n${productModule(post.content.raw)}\n\n${schemas}`.trim();
  const words = visibleWords(nextContent);
  const cjk = CJK.test(nextContent);
  if (cjk) throw new Error(`${post.slug}: translation still contains CJK`);
  if (words < 650) throw new Error(`${post.slug}: translation too short (${words} words)`);
  fs.writeFileSync(path.join(OUTPUT_DIR, `${post.slug}.html`), nextContent, 'utf8');

  let response = null;
  if (APPLY) response = wpWrite(post.id, { title, content: nextContent });
  results.push({ id: post.id, slug: post.slug, words, title, applied: APPLY, modified_gmt: response?.modified_gmt || null });
  console.log(`${APPLY ? 'Updated' : 'Validated'} ${post.slug}: ${words} words`);
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'results.json'), JSON.stringify(results, null, 2), 'utf8');
console.log(JSON.stringify({ total: results.length, applied: APPLY, min_words: Math.min(...results.map((row) => row.words)) }, null, 2));
