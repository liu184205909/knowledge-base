const https = require('https');
const fs = require('fs');
const os = require('os');
const env = fs.readFileSync(os.homedir() + '/.env', 'utf8');
const USER = env.match(/WP_USER=(.+)/)[1].trim();
const PASS = env.match(/WP_APP_PASSWORD=(.+)/)[1].trim();
const AUTH = 'Basic ' + Buffer.from(USER + ':' + PASS).toString('base64');

const body = JSON.stringify({
  objectType: 'page',
  objectID: 50319,
  meta: {
    rank_math_title: "Daily Tarot — Today's Card & Crystal | Earthward",
    rank_math_description: "Today's tarot card for the whole community — a free daily tarot reading with crystal guidance and Eastern double-hour energy. A new card every day, shared by everyone.",
    rank_math_focus_keyword: "daily tarot"
  }
});

const r = https.request({
  hostname: 'goearthward.com',
  path: '/wp-json/rankmath/v1/updateMeta',
  method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTTP', res.statusCode);
    console.log('response:', d.slice(0, 500));
  });
});
r.on('error', e => console.log('err:', e.message));
r.write(body);
r.end();
