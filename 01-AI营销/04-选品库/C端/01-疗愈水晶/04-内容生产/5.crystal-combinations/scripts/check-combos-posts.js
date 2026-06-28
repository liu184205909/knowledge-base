/**
 * 检查 crystal-combinations 13篇 + intention 5页 WP post 现状
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

const combos = 'amethyst-and-carnelian,carnelian-and-larimar,citrine-and-larimar,jade-and-black-tourmaline,larimar-and-pyrite,moonstone-and-citrine,moonstone-and-pyrite,moonstone-and-ruby,opal-and-malachite,rose-quartz-and-obsidian,selenite-and-red-jasper,tiger-eye-and-larimar,turquoise-and-malachite'.split(',');
const intentions = 'calm-mindfulness,love-relationships,protection-clearing,abundance-success,spiritual-connection'.split(',');

const result = { combos: {}, intentions: {} };
for (const slug of combos) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,slug,status,featured_media" --max-time 20', { encoding: 'utf8' });
    const arr = JSON.parse(r);
    if (arr.length) {
      result.combos[slug] = { exists: true, id: arr[0].id, status: arr[0].status, featured_media: arr[0].featured_media };
      console.log('combo ' + slug + ' → ' + arr[0].id + ' [' + arr[0].status + '] fm:' + (arr[0].featured_media || 0));
    } else { result.combos[slug] = { exists: false }; console.log('combo ' + slug + ' (无post)'); }
  } catch (e) { result.combos[slug] = { error: e.message.slice(0, 60) }; console.log('combo ' + slug + ' ERR'); }
}
console.log('---');
for (const slug of intentions) {
  try {
    const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/pages?slug=' + slug + '&status=any&_fields=id,slug,status,featured_media" --max-time 20', { encoding: 'utf8' });
    let arr = JSON.parse(r);
    if (!arr.length) {
      const r2 = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slug + '&status=any&_fields=id,slug,status,featured_media" --max-time 20', { encoding: 'utf8' });
      arr = JSON.parse(r2);
    }
    if (arr.length) {
      result.intentions[slug] = { exists: true, id: arr[0].id, status: arr[0].status, featured_media: arr[0].featured_media };
      console.log('intention ' + slug + ' → ' + arr[0].id + ' [' + arr[0].status + '] fm:' + (arr[0].featured_media || 0));
    } else { result.intentions[slug] = { exists: false }; console.log('intention ' + slug + ' (无post/page)'); }
  } catch (e) { result.intentions[slug] = { error: e.message.slice(0, 60) }; console.log('intention ' + slug + ' ERR'); }
}
fs.writeFileSync(path.join(__dirname, '_combos-intentions-status.json'), JSON.stringify(result, null, 2), 'utf8');
console.log('\n写入 _combos-intentions-status.json');
