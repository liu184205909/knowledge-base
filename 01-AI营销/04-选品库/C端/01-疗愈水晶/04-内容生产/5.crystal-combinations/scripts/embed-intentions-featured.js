/**
 * intention 5页: 上传 hero 图设 featured_media (page, publish, fm=0)
 * 不改 content (body图已充足)
 * hero图: intentions/hero-v1/{slug}.webp
 * 用法: node embed-intentions-featured.js
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const SCRIPT_DIR = __dirname;
const IMG_ROOT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/assets/images/generated/intentions/hero-v1';

const statusMap = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, '_combos-intentions-status.json'), 'utf8')).intentions;

const altMap = {
  'calm-mindfulness': 'Calming crystals and mindfulness tools arranged for meditation and inner peace',
  'love-relationships': 'Crystals for love and relationships, rose quartz and romantic gemstones',
  'protection-clearing': 'Protective and cleansing crystals for energy clearing and spiritual shielding',
  'abundance-success': 'Abundance and success crystals, citrine and prosperity gemstones',
  'spiritual-connection': 'Crystals for spiritual connection and higher consciousness',
};

function uploadMedia(file, alt) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -F "file=@' + file + '" -F "alt=' + alt + '" "https://' + SITE + '/wp-json/wp/v2/media" --max-time 90', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  const j = JSON.parse(r);
  if (!j.id) throw new Error('media: ' + (j.message || r.slice(0, 120)));
  return j.id;
}
function updateFeatured(type, id, fm) {
  const tmp = path.join(SCRIPT_DIR, '_tmp-page.json');
  fs.writeFileSync(tmp, JSON.stringify({ featured_media: fm }), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/' + type + '/' + id + '?_fields=id,featured_media" --max-time 60', { encoding: 'utf8' });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, fail = 0;
const report = [];
for (const slug of Object.keys(statusMap).sort()) {
  const st = statusMap[slug];
  try {
    if (!st.exists) throw new Error('WP无page/post');
    if (st.featured_media) { console.log('⏭ ' + slug + ' (已有fm:' + st.featured_media + ')'); report.push({ slug, mode: 'skip_has_fm' }); continue; }
    const file = path.join(IMG_ROOT, slug + '.webp');
    if (!fs.existsSync(file)) throw new Error('无hero图: ' + file);
    const fm = uploadMedia(file, altMap[slug] || slug);
    // intention 5页都是 page
    const type = 'pages';
    const res = updateFeatured(type, st.id, fm);
    ok++; report.push({ slug, mode: 'set', id: st.id, fm });
    console.log('✅ ' + slug + ' → page:' + st.id + ' fm:' + (res.featured_media || fm));
  } catch (e) {
    fail++; report.push({ slug, mode: 'error', error: e.message.slice(0, 150) });
    console.log('❌ ' + slug + ': ' + e.message.slice(0, 150));
  }
}
fs.writeFileSync(path.join(SCRIPT_DIR, '_intentions-featured-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n=== intentions完成: 成功 ' + ok + ', 失败 ' + fail + ' ===');
