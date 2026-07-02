/**
 * T17 Woo 验证公共库 — 强制覆盖凭证（防 shell 残留错误值，见 memory shell-envkey-override-loadenv）。
 */
const https = require('https');
const fs = require('fs');
const os = require('os');

function loadEnvForce() {
  const paths = [os.homedir() + '/.env', 'D:/Code/.env'];
  const forced = new Set(['WP_SITE', 'WP_USER', 'WP_APP_PASSWORD']);
  for (const p of paths) {
    try {
      const content = fs.readFileSync(p, 'utf-8');
      content.split('\n').forEach(l => {
        l = l.trim();
        if (!l || l.startsWith('#') || l.indexOf('=') < 1) return;
        const k = l.slice(0, l.indexOf('=')).trim();
        const v = l.slice(l.indexOf('=') + 1).trim();
        if (forced.has(k) || !process.env[k]) process.env[k] = v;
      });
    } catch (e) {}
  }
}
loadEnvForce();

const SITE = process.env.WP_SITE;
const AUTH = 'Basic ' + Buffer.from(process.env.WP_USER + ':' + process.env.WP_APP_PASSWORD).toString('base64');

function req(path, method, body, raw) {
  return new Promise((resolve, reject) => {
    const has = body !== undefined && body !== null;
    const payload = has ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const headers = { Authorization: AUTH, 'Content-Type': 'application/json' };
    if (has) headers['Content-Length'] = Buffer.byteLength(payload);
    const r = https.request({ hostname: SITE, port: 443, path, method, headers }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (raw) return resolve({ status: res.statusCode, raw: d, headers: res.headers });
        try { resolve({ status: res.statusCode, json: JSON.parse(d), raw: d }); }
        catch (e) { resolve({ status: res.statusCode, raw: d }); }
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

module.exports = { req, SITE, AUTH, loadEnvForce };
