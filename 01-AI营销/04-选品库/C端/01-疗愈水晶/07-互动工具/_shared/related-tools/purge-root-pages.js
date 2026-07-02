/**
 * Purge 3 根级工具页的页面缓存（REST 重新保存 = 触发 save_post → LiteSpeed 自动 purge 该页）。
 * 验证 Related Tools snippet 是否在 purge 后注入。
 * 若仍不注入，说明这些页真不跑 wp_footer，需走 inject-root-pages.js 追加到 content。
 *
 * Usage: node purge-root-pages.js
 */
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');
const { execSync } = require('child_process');

const ROOT = [
  { slug: 'crystal-meaning-search', id: 44461, url: '/crystal-meaning-search/' },
  { slug: 'bracelet-size-calculator', id: 44469, url: '/bracelet-size-calculator/' },
  { slug: 'ring-size-calculator', id: 44471, url: '/ring-size-calculator/' },
];

(async () => {
  // 1) re-save each page (bump post_modified → purge cache)
  for (const p of ROOT) {
    const raw = await E.apiRequest('/wp-json/wp/v2/pages/' + p.id + '?context=edit&_fields=content', 'GET');
    if (!raw || !raw.content || !raw.content.raw) { console.log(p.slug, '取 raw content 失败'); continue; }
    const r = await E.apiRequest('/wp-json/wp/v2/pages/' + p.id, 'POST', { content: raw.content.raw });
    console.log(p.slug, 're-saved | modified:', r.modified);
  }
  console.log('等 10s 缓存刷新...');
  await new Promise(r => setTimeout(r, 10000));

  // 2) verify snippet injection via curl
  for (const p of ROOT) {
    const out = execSync('curl -s "https://goearthward.com' + p.url + '?v=' + Date.now() + Math.random() + '" -H "User-Agent: Mozilla/5.0" --max-time 30').toString();
    const has = out.indexOf('ew-related') >= 0 || out.indexOf('Keep exploring') >= 0;
    console.log(p.slug, has ? '✅ snippet 已注入' : '❌ 仍未注入 (走 inject-root-pages.js)');
  }
})().catch(e => console.error('ERR', e.message || e));
