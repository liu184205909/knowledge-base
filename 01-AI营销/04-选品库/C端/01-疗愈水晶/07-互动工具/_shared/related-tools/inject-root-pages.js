/**
 * 把 Related Tools HTML 追加到 3 个根级工具页的 content 末尾。
 * 这 3 个页面（5月建的裸 HTML）不跑 wp_footer/the_content hook，所以 snippet.php
 * 对它们无效；直接把 related 烤进 post_content，前端 the_content 渲染原样输出。
 *
 * 幂等：若 content 已含 "ew-related" 则跳过。
 *
 * Usage: node inject-root-pages.js
 */
const E = require('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/02-网站规划/templates/elementor-utils');
const { relatedHtml } = require('./related-html');

const ROOT = [
  { slug: 'crystal-meaning-search', id: 44461 },
  { slug: 'bracelet-size-calculator', id: 44469 },
  { slug: 'ring-size-calculator', id: 44471 },
];

(async () => {
  for (const p of ROOT) {
    const raw = await E.apiRequest('/wp-json/wp/v2/pages/' + p.id + '?context=edit&_fields=content,slug', 'GET');
    if (!raw || !raw.content || !raw.content.raw) { console.log(p.slug, '❌ 取 raw content 失败'); continue; }
    let html = raw.content.raw;
    // 清旧 trailing related(块外 freeform Gutenberg 不渲染)
    html = html.replace(/\n*<!-- ===== Related Tools[\s\S]*$/, '');
    // 新 related 包 wp:html 块(Gutenberg 渲染 trailing 块)
    const rel = '\n\n<!-- wp:html -->\n<!-- ===== Related Tools (managed by _shared/related-tools) ===== -->\n' + relatedHtml(p.slug) + '\n<!-- /wp:html -->';
    const r = await E.apiRequest('/wp-json/wp/v2/pages/' + p.id, 'POST', { content: html + rel });
    console.log(p.slug, '✅ 已追加 related | modified:', r.modified, '| +bytes:', rel.length);
  }
})().catch(e => console.error('ERR', e.message || e));
