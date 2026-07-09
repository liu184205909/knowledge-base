/**
 * T17 Step 3 — create the builder page as DRAFT (NOT publish — red line:
 * no real orders while user is asleep; builder is preview-only).
 *
 * Usage: node create-draft-page.js
 * Output: prints the new page id + preview URL.
 *
 * Reuses the WP REST pages endpoint with status=draft, parent=43101 (tools hub).
 * If the page already exists (same slug), updates it in place (still draft).
 */
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');

const TITLE = 'Crystal Bracelet Builder';
const SLUG = 'crystal-bracelet-builder';
const PARENT = 43101;   // tools hub
const HTML_PATH = path.resolve(__dirname, 'crystal-bracelet-builder-wp-fragment.html');

const env = fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8');
const SITE = env.match(/WP_SITE=(.+)/)[1].trim();
const USER = env.match(/WP_USER=(.+)/)[1].trim();
const PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');

const HTML = fs.readFileSync(HTML_PATH, 'utf8');
const content = '<!-- wp:html -->\n' + HTML + '\n<!-- /wp:html -->';

function api(method, p, body) {
  return new Promise((resolve, reject) => {
    const has = body !== undefined;
    const payload = has ? JSON.stringify(body) : '';
    const headers = { Authorization: AUTH, 'Content-Type': 'application/json' };
    if (has) headers['Content-Length'] = Buffer.byteLength(payload);
    const r = https.request({ hostname: SITE, path: p, method, headers, timeout: 120000 }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(d), raw: d }); }
        catch (e) { resolve({ status: res.statusCode, raw: d }); }
      });
    });
    r.on('error', reject);
    r.on('timeout', () => { r.destroy(); reject(new Error('timeout')); });
    if (payload) r.write(payload);
    r.end();
  });
}

async function run() {
  // 1) check existing by slug
  const list = await api('GET', '/wp-json/wp/v2/pages?slug=' + SLUG + '&status=any&context=edit');
  const arr = (list.json && Array.isArray(list.json)) ? list.json : [];
  const existing = arr.length ? arr[0] : null;

  const payload = {
    title: TITLE,
    slug: SLUG,
    content,
    parent: PARENT
  };
  if (!existing) payload.status = 'draft';

  let r;
  if (existing && existing.id) {
    r = await api('POST', '/wp-json/wp/v2/pages/' + existing.id + '?context=edit', payload);
    console.log('UPDATED existing page id=' + existing.id + ' | status=' + (r.json && r.json.status));
  } else {
    r = await api('POST', '/wp-json/wp/v2/pages?context=edit', payload);
    if (r.json && r.json.id) console.log('CREATED page id=' + r.json.id + ' | status=' + r.json.status);
    else console.log('CREATE raw:', String(r.raw).slice(0, 400));
  }
  if (r.json && r.json.id) {
    const id = r.json.id;
    const link = r.json.link || ('https://' + SITE + '/tools/' + SLUG + '/');
    console.log('link=' + link);
    console.log('preview=' + link + '?preview=true');
    console.log('content_chars=' + (r.json.content && r.json.content.raw ? r.json.content.raw.length : 'n/a'));
  }
}
run().catch(e => console.error('ERR', e.message || e));
