/**
 * Chinese Zodiac 内容更新（UPDATE 现有 post，不新建）
 * 用于修正 fill 后的内容/内链 bug，重新生成图片已绑无需重传
 * 流程：generate --slug=X(修复后) → fill --slug=X → update-content --slug=X
 * 嵌图用已上传的 media（从 article.images 读，但 media id 需重查或用现有 url）
 * 简化：直接读现有 WP post 的 img url（已嵌），仅替换 content 文字部分
 * 实际做法：读本地 article.json（已重 fill），content 里图片占位用 WP 已有的 media url
 *   → 但本地 article.json 的 content 无 img tag（img 是 upload 时注入的）
 *   → 所以这里：从 WP 现有 post content 提取 img tag，注入到新 content 对应位置
 * 用法：node update-content.js --slug=rabbit-crystals
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
const IMG_STYLE = 'width:100%;border-radius:12px;margin:16px 0;';
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
if (!slugArg) { console.log('用法: node update-content.js --slug=rabbit-crystals'); process.exit(1); }

const DIR = path.resolve(__dirname, '..');

// 1. 取 WP 现有 post（含 content + id）
const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts?slug=' + slugArg + '&status=any&_fields=id,content" --max-time 30', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
const arr = JSON.parse(r);
if (!arr.length) { console.log('✗ WP 未找到 ' + slugArg); process.exit(1); }
const postId = arr[0].id;
const wpContent = arr[0].content?.rendered || '';
// 提取 WP 现有 img tags（hero + animal + lucky_stone）
const wpImgs = wpContent.match(/<img[^>]*>/g) || [];
console.log('WP 现有 post id=' + postId + ', imgs=' + wpImgs.length);

// 2. 读本地最新 article.json（已重 fill）
const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', slugArg + '.json'), 'utf8'));
let newContent = a.content;

// 3. 把 WP img tag 注入新 content 对应位置
// hero: 顶部
if (wpImgs[0]) {
  newContent = wpImgs[0] + '\n' + newContent;
}
// animal + lucky_stone: 按 upload 同款规则注入
const mkImg = (i) => wpImgs[i];
if (wpImgs[1]) {
  // animal → </table> 后
  newContent = newContent.replace(/(<\/table>\s*<p>)/, '</table>\n' + wpImgs[1] + '\n<p>');
}
if (wpImgs[2]) {
  // lucky_stone → Lucky Stone H3 后第二个 </p>
  const re = /(<h3>[^<]*Lucky Stone[^<]*<\/h3>\s*<p><em>[^<]*<\/em><\/p>\s*<p>[\s\S]*?<\/p>)/;
  if (re.test(newContent)) {
    newContent = newContent.replace(re, '$1\n' + wpImgs[2]);
  }
}

// 4. UPDATE post content
const payload = {
  content: '<!-- wp:html -->\n' + newContent + '\n<!-- /wp:html -->',
};
const tmp = path.join(__dirname, '_tmp-update.json');
fs.writeFileSync(tmp, JSON.stringify(payload), 'utf8');
const ur = execSync('curl -s ' + PROXY + ' ' + AUTH + ' -X POST -H "Content-Type: application/json" -d @"' + tmp + '" "https://' + SITE + '/wp-json/wp/v2/posts/' + postId + '?_fields=id,slug,link,status" --max-time 120', { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
fs.unlinkSync(tmp);
const uj = JSON.parse(ur);
if (uj.id) {
  console.log('✅ ' + slugArg + ' 已更新 post:' + uj.id);
  // 验证坏链接已消除
  if (!newContent.includes('goat (sheep)-crystals')) console.log('  ✓ goat (sheep) 坏链接已消除');
} else {
  console.log('❌ ' + slugArg + ' 更新失败: ' + ur.slice(0, 200));
}
