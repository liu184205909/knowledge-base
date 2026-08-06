/**
 * 通用 Condition 页脚本 — 一个脚本处理所有 /crystals-for-{condition}/
 * 用法：node condition-page-upload.js anxiety
 * 读 condition-configs/{condition}.json（石种/文案/图/TKD）→ 组装 11 模块 post_content → 上传图片(本地重传,独立alt) → 上传 post draft
 * 图片从本地 CM 文件重传（独立 media，可改 title/ALT），不引用 media library 已有
 */
const E = require('../templates/elementor-utils');
const fs = require('fs'), path = require('path');

const cond = process.argv[2];
if (!cond) { console.error('用法: node condition-page-upload.js {condition}'); process.exit(1); }
const cfgPath = path.join(__dirname, 'condition-configs', cond + '.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));

function esc(s){ return String(s||'').replace(/\n/g,' '); }

function build(cfg){
  const p=[];
  const T = cfg.condition_title;
  // M1 Quick Answer + 合规锚点
  p.push(`<!-- wp:heading -->\n<h2>Quick Answer: Best Crystals for ${T}</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.m1_quick)}</p>\n<!-- /wp:paragraph -->`);
  // M2 Understanding
  p.push(`<!-- wp:heading -->\n<h2>Understanding ${T} in Daily Life</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.m2_understanding)}</p>\n<!-- /wp:paragraph -->`);
  // M2.5 How We Chose
  p.push(`<!-- wp:heading -->\n<h2>How We Chose These Crystals</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.m25_chose)}</p>\n<!-- /wp:paragraph -->`);
  // M3 水晶列表（Best for + care note + 矿物 + 可选图）
  p.push(`<!-- wp:heading -->\n<h2>${cfg.crystals.length} Best Crystals for ${T}</h2>\n<!-- /wp:heading -->`);
  for (const c of cfg.crystals){
    p.push(`<!-- wp:heading {"level":3} -->\n<h3><a href="/gemstone/${c.slug}-meaning/">${c.name}</a> — ${c.subtitle}</h3>\n<!-- /wp:heading -->`);
    if (c.image_media_id){
      p.push(`<!-- wp:image {"id":${c.image_media_id},"sizeSlug":"medium"} -->\n<figure class="wp-block-image size-medium"><img src="${c.image_url}" alt="${esc(c.image_alt)}" class="wp-image-${c.image_media_id}"/></figure>\n<!-- /wp:image -->`);
    }
    p.push(`<!-- wp:list -->\n<ul><li><strong>Best for:</strong> ${c.best_for}</li><li><strong>Why people choose it:</strong> ${esc(c.why||'')}</li><li><strong>How to use it:</strong> ${esc(c.how_to_use||'')}</li></ul>\n<!-- /wp:list -->`);
    let desc = esc(c.desc);
    if (c.care_note) desc += ` <strong>Care note:</strong> ${esc(c.care_note)}`;
    if (c.mineral_note) desc += ` ${esc(c.mineral_note)}`;
    p.push(`<!-- wp:paragraph -->\n<p>${desc}</p>\n<!-- /wp:paragraph -->`);
  }
  // M4 场景表（stripes）
  const rows = cfg.scene_table.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  p.push(`<!-- wp:heading -->\n<h2>How to Choose by Your ${T} Pattern</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:table {"className":"is-style-stripes"} -->\n<figure class="wp-block-table is-style-stripes"><table><thead><tr><th>${T} Pattern</th><th>Best Crystals</th></tr></thead><tbody>${rows}</tbody></table></figure>\n<!-- /wp:table -->`);
  // M5 使用方法
  p.push(`<!-- wp:heading -->\n<h2>How to Use Crystals for ${T}</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:list -->\n<ul>${cfg.m5_use.map(u => `<li>${u}</li>`).join('')}</ul>\n<!-- /wp:list -->`);
  // M6 组合
  p.push(`<!-- wp:heading -->\n<h2>Crystal Combinations for ${T}</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.m6_combos)}</p>\n<!-- /wp:paragraph -->`);
  // M8 wd/products（多石种 OR）
  p.push(`<!-- wp:heading -->\n<h2>Shop Crystals for ${T}</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.m8_intro)}</p>\n<!-- /wp:paragraph -->`);
  p.push(`<!-- wp:wd/products {"categoriesIds":"${cfg.category_ids}","orderby":"rand","columns":3,"items_per_page":"6","product_hover":"standard","stretch_product":true} /-->`);
  // M9 FAQ
  p.push(`<!-- wp:heading -->\n<h2>FAQ About Crystals for ${T}</h2>\n<!-- /wp:heading -->`);
  for (const f of cfg.faq){
    p.push(`<!-- wp:heading {"level":3} -->\n<h3>${f.q}</h3>\n<!-- /wp:heading -->`);
    p.push(`<!-- wp:paragraph -->\n<p>${esc(f.a)}</p>\n<!-- /wp:paragraph -->`);
  }
  // M10 内链 + Closing
  p.push(`<!-- wp:heading -->\n<h2>Explore More Crystal Guides</h2>\n<!-- /wp:heading -->`);
  p.push(`<!-- wp:list -->\n<ul>${cfg.related.map(r => `<li><a href="/crystals-for-${r}/">Crystals for ${r[0].toUpperCase()+r.slice(1)}</a></li>`).join('')}</ul>\n<!-- /wp:list -->`);
  p.push(`<!-- wp:paragraph -->\n<p>${esc(cfg.closing)}</p>\n<!-- /wp:paragraph -->`);
  return p.join('\n\n');
}

async function main(){
  console.log('=== Condition 页: ' + cond + ' ===');
  // 1. 上传图片（featured + 选中水晶图，本地重传，独立 alt）
  if (cfg.featured_file){
    const fm = await E.uploadMedia(cfg.featured_file, cond + '-featured.webp', cfg.featured_alt);
    cfg.featured_media_id = fm ? fm.id : 0;
    console.log('featured:', fm ? fm.id : 'FAIL');
  }
  for (const c of cfg.crystals){
    if (c.image_file){
      const im = await E.uploadMedia(c.image_file, cond + '-' + c.slug + '.webp', c.image_alt);
      c.image_media_id = im ? im.id : 0; c.image_url = im ? im.source_url : '';
      console.log(c.slug + ' img:', im ? im.id : 'FAIL/skip');
    }
  }
  // 2. 组装
  const content = build(cfg);
  console.log('content:', content.length, '字符');
  // 3. 上传 post
  const res = await E.apiRequest('/wp-json/wp/v2/posts', 'POST', {
    title: cfg.title,
    slug: 'crystals-for-' + cond,
    status: 'draft',
    content: content,
    excerpt: cfg.excerpt,
    featured_media: cfg.featured_media_id || 0,
    categories: [1544]
  });
  // Rank Math TKD — 用专用 endpoint（WP REST 的 meta 对 Rank Math 不生效，参照 CM 脚本）
  if (res && res.id){
    await E.apiRequest('/wp-json/rankmath/v1/updateMeta', 'POST', {
      objectType: 'post', objectID: res.id,
      meta: {
        rank_math_title: cfg.rank_math_title,
        rank_math_description: cfg.rank_math_description,
        rank_math_focus_keyword: cfg.rank_math_focus_keyword,
        rank_math_robots: ['index', 'follow']
      }
    }).catch(e => console.log('rankmath warn:', e.message));
  }
  if (res && res.id){
    console.log('SUCCESS id=' + res.id);
    console.log('Preview: https://goearthward.com/?p=' + res.id + '&preview=true');
    console.log('featured_media:', res.featured_media);
  } else {
    console.log('FAILED:', JSON.stringify(res).slice(0, 500));
  }
  setTimeout(() => process.exit(0), 3000);
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });
