/**
 * 验证 horoscope 156篇 WP content img 数
 * - 月运144 + 年运12
 * - 设计: crystal + ritual = 2张内容img (featured_media 单独不计)
 * - 排除 WoodMart 商品块 img (wd-products/woocommerce/product-grid/wd-product 等)
 * - 输出每篇 img 数 + 不达标清单
 */
const fs = require('fs'), path = require('path'), os = require('os');

const envPath = path.join(os.homedir(), '.env');
const env = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('='); if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}
const U = env.WP_USER, P = env.WP_APP_PASSWORD, SITE = env.WP_SITE || 'goearthward.com';
const AUTH = '-u "' + U + ':' + P + '"', PROXY = '--proxy socks5://127.0.0.1:10808';
const { execSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const monMap = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, '..', '_wp_mon.json'), 'utf8'));
const yrMap = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, '..', '_wp_yr.json'), 'utf8'));

// 商品块特征: 这些 class/shortcode 出现的块里的 img 不算内容img
// 实际 WoodMart 商品块标记: <!-- wp:woodmart... / [products ... / class含 wd-products|woocommerce|product-grid|wd-product
function stripCommerceBlocks(html) {
  let out = html;
  // 移除 HTML 注释里的 block 标记 (wp:woodmart/woocommerce等)
  // 简化: 按含商品特征的注释块整体移除
  out = out.replace(/<!--\s*wp:(woodmart|woocommerce)[\s\S]*?-->/g, '');
  // 移除 [products ...] shortcode
  out = out.replace(/\[products[^\]]*\][\s\S]*?\[\/products\]/g, '');
  out = out.replace(/\[products[^\]]*?\/\]/g, '');
  // 移除含 wd-products/woocommerce/product-grid 的 div 块 (粗暴: 整个 <figure>/<div class~="wd-products..."> )
  // 用正则移除 class 含关键词的整块 div (非贪婪到对应</div>难, 改: 标记后过滤img)
  return out;
}

// 更稳: 直接在 img 标签层面判断, 排除处于商品块上下文的img
// 策略: 找所有 <img>, 检查其前后500字符内是否含商品块特征关键词
function countContentImgs(html) {
  // 先移除明显商品块整段
  let cleaned = stripCommerceBlocks(html);
  // 收集所有 img (含自闭合和非自闭合)
  const imgRe = /<img\b[^>]*>/gi;
  const imgs = [];
  let m;
  while ((m = imgRe.exec(cleaned)) !== null) {
    const tag = m[0];
    const start = m.index;
    const ctx = cleaned.slice(Math.max(0, start - 800), start + tag.length + 200).toLowerCase();
    // 商品块关键词 (排除这些 img)
    const commerceKw = [
      'wd-products', 'woocommerce', 'product-grid', 'wd-product',
      'products-block', 'wc-block', 'wp:woodmart', 'wp:woocommerce',
      'class="products', 'data-source="featured"', 'product-item',
      'wd-products-element'
    ];
    // 自身 class 也要看
    const isCommerce = commerceKw.some(k => ctx.includes(k)) || /class="[^"]*(?:product-grid|wd-product|woocommerce-products|products-grid)[^"]*"/i.test(tag);
    imgs.push({ tag: tag.slice(0, 80), isCommerce, src: (tag.match(/src="([^"]+)"/i) || [])[1] || '' });
  }
  const total = imgs.length;
  const content = imgs.filter(i => !i.isCommerce);
  return { total, contentCount: content.length, contentImgs: content };
}

function getContent(id) {
  const r = execSync('curl -s ' + PROXY + ' ' + AUTH + ' "https://' + SITE + '/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=content,featured_media,status,slug" --max-time 50', { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  return JSON.parse(r);
}

const all = [
  ...monMap.map(p => ({ ...p, scope: 'monthly' })),
  ...yrMap.map(p => ({ ...p, scope: 'yearly' }))
];

const report = [];
let passCount = 0;
for (const t of all) {
  try {
    const raw = getContent(t.id);
    const html = raw.content.raw || raw.content.rendered || '';
    const { total, contentCount, contentImgs } = countContentImgs(html);
    const fm = raw.featured_media || 0;
    const ok = contentCount === 2 && fm !== 0;
    if (ok) passCount++;
    report.push({ slug: t.slug, scope: t.scope, id: t.id, status: raw.status, contentImg: contentCount, totalImg: total, featured_media: fm, pass: ok });
    console.log((ok ? '✅' : '❌') + ' ' + t.slug + ' [' + t.scope + '] contentImg=' + contentCount + ' total=' + total + ' fm=' + fm + (ok ? '' : ' FAIL'));
  } catch (e) {
    report.push({ slug: t.slug, scope: t.scope, id: t.id, error: e.message.slice(0, 150), pass: false });
    console.log('💥 ' + t.slug + ': ' + e.message.slice(0, 100));
  }
}

fs.writeFileSync(path.join(SCRIPT_DIR, '_verify-horoscope-report.json'), JSON.stringify(report, null, 2), 'utf8');
const fails = report.filter(r => !r.pass);
console.log('\n=== 验证完成: ' + passCount + '/' + all.length + ' 通过 ===');
console.log('不达标: ' + fails.length + ' 篇');
if (fails.length) fails.forEach(f => console.log('  - ' + f.slug + ' [' + f.scope + '] img=' + f.contentImg + ' fm=' + f.featured_media + ' err=' + (f.error||'')));
