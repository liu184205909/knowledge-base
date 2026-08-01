/**
 * crystal-combinations 207篇 content 嵌图核查（只读，不改）
 * 1. 找 combinations 分类
 * 2. 拉该分类所有 post（分页 per_page=100）
 * 3. 统计每篇 content 的 <img 数（排除 WoodMart 商品块内的 img）
 * 4. 输出 _combos-imgcount-report.json：按 img 数分组
 * 需 socks5 + disableSandbox
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

function getJSON(url) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "' + url + '" --max-time 60', { encoding: 'utf8', maxBuffer: 60 * 1024 * 1024 });
  return JSON.parse(r);
}

// WoodMart 商品块标记：常见 <!-- wp:wd-products ... --> 或 [products ...] 或 wd-products 块
// 这些块内的 <img 是商品图，不算编辑嵌入图
function countEditorImgs(content) {
  if (!content) return { total: 0, editor: 0, inProductBlock: 0 };
  const total = (content.match(/<img\b/gi) || []).length;
  // 切掉商品块内的内容再数
  // 商品块模式：<!-- wp:wd-products ... -->...<!-- /wp:wd-products --> 或 [products ...]
  let stripped = content;
  // 移除 wd-products gutenberg 块（含开头注释到结尾注释）
  stripped = stripped.replace(/<!-- wp:wd-products[\s\S]*?<!-- \/wp:wd-products -->/gi, '');
  // 移除 shortcode 商品块 [products ...]
  stripped = stripped.replace(/\[products[\s\S]*?\]/gi, '');
  // 移除 woocommerce 块
  stripped = stripped.replace(/<!-- wp:woocommerce[\s\S]*?<!-- \/wp:woocommerce -->/gi, '');
  const editor = (stripped.match(/<img\b/gi) || []).length;
  return { total, editor, inProductBlock: total - editor };
}

(async () => {
  // 1. 找分类
  const cats = getJSON('https://' + SITE + '/wp-json/wp/v2/categories?per_page=100&_fields=id,name,slug,count');
  let comboCat = null;
  for (const c of cats) {
    const ns = ((c.name || '') + ' ' + (c.slug || '')).toLowerCase();
    if (ns.includes('combin') || ns.includes('crystal-pair')) { comboCat = c; break; }
  }
  if (!comboCat) {
    // 列出所有 count>50 的分类辅助定位
    console.log('未直接命中 combinations 分类，候选：');
    for (const c of cats) if (c.count >= 20) console.log('  id=' + c.id + ' name=' + c.name + ' slug=' + c.slug + ' count=' + c.count);
    // 用 count 最接近 207 且 name 含 crystal 的
    const cand = cats.filter(c => /crystal|combin/i.test((c.name || '') + c.slug)).sort((a, b) => Math.abs(b.count - 207) - Math.abs(a.count - 207));
    if (cand.length) { comboCat = cand[0]; console.log('选用最接近的: id=' + comboCat.id + ' ' + comboCat.name); }
  }
  if (!comboCat) { console.error('X 找不到 combinations 分类'); process.exit(1); }
  console.log('分类: id=' + comboCat.id + ' name=' + comboCat.name + ' slug=' + comboCat.slug + ' count=' + comboCat.count);

  // 2. 拉所有 post（分页）
  const all = [];
  let page = 1;
  while (true) {
    const batch = getJSON('https://' + SITE + '/wp-json/wp/v2/posts?per_page=100&page=' + page + '&categories=' + comboCat.id + '&context=edit&_fields=id,slug,status,content,featured_media&status=any');
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
    if (page > 10) break;
  }
  console.log('拉到 post 数: ' + all.length);

  // 3. 统计
  const report = [];
  const groups = {};
  for (const p of all) {
    const raw = p.content && p.content.raw ? p.content.raw : '';
    const c = countEditorImgs(raw);
    report.push({ id: p.id, slug: p.slug, status: p.status, total: c.total, editor: c.editor, product: c.inProductBlock, featured: p.featured_media || 0 });
    groups[c.editor] = (groups[c.editor] || 0) + 1;
  }
  // 4. 输出
  fs.writeFileSync(path.join(SCRIPT_DIR, '_combos-imgcount-report.json'), JSON.stringify({ category: comboCat, total_posts: all.length, groups, posts: report }, null, 2), 'utf8');
  console.log('\n编辑嵌入图数分组:');
  Object.keys(groups).sort((a, b) => +a - +b).forEach(k => console.log('  editor imgs=' + k + ' : ' + groups[k] + ' 篇'));
  const need = report.filter(p => p.editor < 2);
  console.log('\n需补嵌(editor<2): ' + need.length + ' 篇');
  const zeroEditor = report.filter(p => p.editor === 0);
  console.log('  其中 editor=0: ' + zeroEditor.length + ' 篇');
})();