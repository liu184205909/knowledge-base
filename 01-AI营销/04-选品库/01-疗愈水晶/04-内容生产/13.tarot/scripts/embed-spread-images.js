/**
 * 补嵌 spread 图到已上传的22篇Major content
 * upload脚本嵌图正则有bug导致spread图未嵌入（hero已嵌、spread图已上传但未嵌content）
 * 流程：GET线上post content → 在M10标题后插入spread图(media URL by id) → PUT更新
 * 用法：node embed-spread-images.js
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');
const env = {};
for (const line of fs.readFileSync(path.join(os.homedir(), '.env'), 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const DIR = path.resolve(__dirname, '..');
const results = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', 'upload-results.json'), 'utf8'));
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';

function getPost(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug,content&context=edit" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return JSON.parse(r);
}
function getMediaUrl(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/media/' + id + '?_fields=source_url" --max-time 15', { encoding: 'utf8' });
  return JSON.parse(r).source_url;
}
function updatePost(id, content) {
  const tmp = path.join(__dirname, '_tmp-upd.json');
  fs.writeFileSync(tmp, JSON.stringify({ content }), 'utf8');
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?_fields=id,slug" --max-time 60', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  fs.unlinkSync(tmp);
  return JSON.parse(r);
}

let ok = 0, skip = 0, fail = 0;
for (const r of results) {
  if (!r.spread) { skip++; continue; } // Hub 无 spread
  try {
    const post = getPost(r.id);
    let content = post.content && post.content.rendered ? post.content.rendered : '';
    // 检查是否已嵌 spread 图（避免重复）
    if (content.includes('spread-' + r.slug) || content.includes('Mini Crystal Tarot Spread') && /<img[^>]*spread/.test(content)) {
      console.log('⏭ ' + r.slug + ' (spread图已嵌)'); skip++; continue;
    }
    const spreadUrl = getMediaUrl(r.spread);
    const alt = 'Mini crystal tarot spread for ' + r.slug.replace(/-/g, ' ');
    const imgTag = '<img src="' + spreadUrl + '" alt="' + alt + '" style="' + IMG_STYLE + '" loading="lazy">';
    // 在M10标题后插入（修正正则）
    const newContent = content.replace(/(<h2>A Mini Crystal Tarot Spread[^<]*<\/h2>)/, '$1\n' + imgTag);
    if (newContent === content) {
      console.log('⚠️ ' + r.slug + ' M10标题未匹配，跳过'); fail++; continue;
    }
    updatePost(r.id, newContent);
    ok++;
    console.log('✅ ' + r.slug + ' spread图已嵌');
  } catch (e) {
    fail++;
    console.log('❌ ' + r.slug + ': ' + e.message.slice(0, 100));
  }
}
console.log('\n=== 补嵌完成: ' + ok + ' OK, ' + skip + ' 跳过, ' + fail + ' 失败 ===');
