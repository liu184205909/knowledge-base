#!/usr/bin/env node

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
const HIDDEN_CJK_IDS = [
  48356, 48376, 48438, 48713, 48819, 48839, 48914, 49244, 49544, 49618,
  49622, 49693, 49869, 49879, 49884, 49916, 50113, 50166, 50276, 51220,
  51226, 51236, 51308,
];
const TITLE_FIXES = new Map([
  [48291, 'Judgment Reversed for Career: Meaning & Crystals'],
  [48301, 'Judgment Reversed for Finances: Meaning & Crystals'],
  [48311, 'Judgment Reversed for Health: Meaning & Crystals'],
  [48321, 'Judgment Reversed in Love: Meaning & Crystals'],
  [48331, 'Judgment Reversed for Spiritual Growth: Meaning & Crystals'],
  [48450, 'Strength and The Hanged Man Together: Tarot Combination Meaning'],
  [48474, 'Strength and The World Together: Tarot Combination Meaning'],
  [48717, 'The Devil and The Tower Together: Tarot Combination Meaning'],
  [49544, 'The Lovers and The Hermit Together: Tarot Combination Meaning'],
  [49622, 'The Magician and Judgment Together: Tarot Combination Meaning'],
  [50108, 'Judgment Reversed for Finances: Meaning & Crystals'],
  [50171, 'The Hermit and Judgment Together: Tarot Combination Meaning'],
]);

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
  return execFileSync('curl.exe', [
    '-sS', '--fail-with-body', '--proxy', PROXY, '--max-time', '180', ...args,
  ], { input, encoding: 'utf8', maxBuffer: 80 * 1024 * 1024 });
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

function cleanScriptCjk(raw) {
  return raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => script
    .replace(/[\u3400-\u9fff]/g, '')
    .replace(/，/g, ', ')
    .replace(/。/g, '. ')
    .replace(/；/g, '; ')
    .replace(/：/g, ': ')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/、/g, ', '));
}

function validateJsonLd(raw, slug) {
  for (const match of raw.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1].trim()); }
    catch (error) { throw new Error(`${slug}: invalid JSON-LD after cleanup: ${error.message}`); }
  }
}

function replaceH1(raw, title) {
  return raw.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${title}</h1>`);
}

const ids = [...new Set([...HIDDEN_CJK_IDS, ...TITLE_FIXES.keys()])];
const posts = [];
for (let offset = 0; offset < ids.length; offset += 50) {
  const include = ids.slice(offset, offset + 50).join(',');
  posts.push(...wpGet(`/wp-json/wp/v2/posts?include=${include}&status=any&context=edit&per_page=100&_fields=id,slug,status,title,content`));
}

fs.mkdirSync(path.join(__dirname, 'backups'), { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(__dirname, 'backups', `hidden-cjk-title-fix-${stamp}.json.gz`);
fs.writeFileSync(backupPath, zlib.gzipSync(Buffer.from(JSON.stringify(posts), 'utf8'), { level: 9 }));
console.log(`Backup: ${backupPath}`);

let updated = 0;
for (const post of posts) {
  const payload = {};
  let content = post.content.raw;
  if (HIDDEN_CJK_IDS.includes(post.id) && /[\u3400-\u9fff]/.test(content)) {
    content = cleanScriptCjk(content);
    validateJsonLd(content, post.slug);
    payload.content = content;
  }
  const title = TITLE_FIXES.get(post.id);
  if (title) {
    payload.title = title;
    payload.content = replaceH1(payload.content || content, title);
  }
  if (!Object.keys(payload).length) continue;
  wpWrite(post.id, payload);
  updated++;
  console.log(`Updated ${post.id} ${post.slug}`);
}

console.log(JSON.stringify({ inspected: posts.length, updated }, null, 2));

