/**
 * Numerology 12篇 CTA: how-to-calculate → /tools/numerology-calculator/(工具已上线200)
 * + year-crystals 补 schedule(P2漏,07-24随机时间)
 * 用法：node fix-numerology-cta.js
 */
const fs = require('fs'), os = require('os'), path = require('path'), { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';

const SLUGS = ['life-path-1','life-path-2','life-path-3','life-path-4','life-path-5','life-path-6','life-path-7','life-path-8','life-path-9','life-path-11','life-path-22','life-path-33'];

let ctaOk = 0;
for (const slug of SLUGS) {
  try {
    // GET post id + content
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,content&per_page=1" --max-time 25', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const a = JSON.parse(r)[0]; if (!a) { console.log('⚠ ' + slug + ': 未找到'); continue; }
    let content = a.content.rendered;
    const orig = content;
    // 替换 CTA: how-to-calculate URL → numerology-calculator + 文案
    content = content.replace(/\/how-to-calculate\//g, '/tools/numerology-calculator/');
    content = content.replace(/Life Path calculation guide/gi, 'Calculate Your Life Path Number');
    if (content === orig) { console.log('⏭ ' + slug + ': 无how-to-calculate(已改或无)'); continue; }
    // PUT content
    const tmp = path.join(__dirname, '_tmp-cta.json');
    fs.writeFileSync(tmp, JSON.stringify({ content }), 'utf8');
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + a.id + '?_fields=id,slug" --max-time 60', { encoding: 'utf8' });
    fs.unlinkSync(tmp);
    ctaOk++; console.log('✓ CTA ' + slug + ' → /tools/numerology-calculator/');
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 60)); }
}
console.log('=== CTA修改: ' + ctaOk + '/12 ===');

// year-crystals 补 schedule (P2 第26篇, 07-24 随机时间)
try {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=year-crystals&status=any&_fields=id&per_page=1" --max-time 20', { encoding: 'utf8' });
  const id = JSON.parse(r)[0]?.id;
  if (id) {
    const h = 8 + Math.floor(Math.random() * 12), m = Math.floor(Math.random() * 60);
    const date = '2026-07-24T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00';
    const tmp = path.join(__dirname, '_tmp-sch.json');
    fs.writeFileSync(tmp, JSON.stringify({ status: 'future', date }), 'utf8');
    execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
    fs.unlinkSync(tmp);
    console.log('✓ year-crystals → ' + date + ' (补schedule)');
  }
} catch (e) { console.log('❌ year-crystals schedule失败'); }
