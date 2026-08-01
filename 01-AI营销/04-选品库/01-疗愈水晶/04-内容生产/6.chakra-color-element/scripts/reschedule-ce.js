/**
 * chakra/color/element 23篇 → schedule(每天1篇,交错type+主力先,06-28起)
 * 查 category 1564/1565/1566 的 draft → slug→id → status=future + 递增date
 * 用法：node reschedule-ce.js(全23篇)
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
const TIME = 'T09:00:00'; // 每天09:00(本地UTC+8)
const D0 = new Date(2026, 5, 28); // 2026-06-28

// 交错type+主力先(chakra/color/element交替,主力脉轮/色/元素先)
const ORDER = [
  'root', 'black', 'fire',           // 主力:接地/保护/火
  'heart', 'pink', 'water',          // 主力:心/爱/水
  'third-eye', 'green', 'earth',     // 主力:直觉/成长/土
  'throat', 'blue',                  // 喉/蓝
  'sacral', 'purple',                // 脐轮/紫
  'solar-plexus', 'red',             // 太阳神经丛/红
  'crown', 'yellow',                 // 顶轮/黄
  'white', 'orange',                 // 白/橙
  'brown', 'air',                    // 棕/风
  'grey', 'blue-green',              // 灰/蓝绿(长尾)
];

function fetchMap() {
  const all = {};
  for (const cid of [1564, 1565, 1566]) {
    for (let p = 1; p <= 3; p++) {
      const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?categories=' + cid + '&status=any&per_page=100&page=' + p + '&_fields=id,slug" --max-time 30', { encoding: 'utf8' });
      try { const arr = JSON.parse(r); if (!arr.length) break; for (const x of arr) if (x.slug) all[x.slug] = x.id; } catch (e) { break; }
    }
  }
  return all;
}
function updatePost(id, data, retries = 3) {
  const tmp = path.join(__dirname, '_tmp-sch.json');
  fs.writeFileSync(tmp, JSON.stringify(data), 'utf8');
  for (let n = 0; n < retries; n++) {
    try {
      const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,status,date" --max-time 60', { encoding: 'utf8' });
      fs.unlinkSync(tmp);
      return JSON.parse(r);
    } catch (e) { if (n === retries - 1) { try { fs.unlinkSync(tmp); } catch (_) {} throw e; } }
  }
}

const map = fetchMap();
console.log(`查到 ${Object.keys(map).length} 篇`);

let ok = 0, miss = 0;
ORDER.forEach((slug, i) => {
  const id = map[slug];
  if (!id) { console.log('⚠ ' + slug + ': 无post'); miss++; return; }
  const d = new Date(D0); d.setDate(d.getDate() + i);
  const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + TIME;
  try {
    updatePost(id, { status: 'future', date });
    ok++;
    console.log(`✓ [${i + 1}/23] ${slug} → ${date}`);
  } catch (e) { console.log('❌ ' + slug + ': ' + e.message.slice(0, 50)); }
});
console.log(`\n=== schedule完成: ${ok} OK, ${miss} 无post ===`);
console.log(`首篇 ${ORDER[0]} ${D0.toISOString().slice(0,10)} | 末篇 ${ORDER[ORDER.length-1]} (共 ${ORDER.length} 天)`);
