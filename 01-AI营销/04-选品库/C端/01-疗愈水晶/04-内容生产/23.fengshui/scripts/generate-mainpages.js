/**
 * Feng Shui 主词页骨架生成器（45 篇：hub+概念8 + 意图5 + 房间5 + 单石×feng shui 27）
 * 读 fengshui-knowledge.json → 主词页模板（Quick Answer/What Is/Explained+HowTo/Key Facts/Crystals内链/Eastern/FAQ/Related）
 * 复用 meditation mainpages 管线，改：KNOW 路径/模板主题/内链/images 路径/gentle-note
 * 用法：node generate-mainpages.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/fengshui-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const DISPLAY = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', goldstone: 'Goldstone' };
// slug → Shop 产品类目（wc/store 验证 2026-07-16）；无映射的用 /shop/?s= 搜索降级
const CAT_MAP = { citrine:'citrine-crystals','black-tourmaline':'black-tourmaline-crystals',pyrite:'pyrite-crystals',jade:'jade-crystals',quartz:'clear-quartz-crystals','rose-quartz':'rose-quartz-crystals',amethyst:'amethyst-crystals',aventurine:'aventurine-crystals','tiger-eye':'tiger-eye-crystals',carnelian:'carnelian-crystals',obsidian:'obsidian-crystals',moonstone:'rainbow-moonstone-crystals',hematite:'hematite-crystals',lapis:'lapis-lazuli-crystals',malachite:'malachite-crystals',selenite:'selenite-crystals',fluorite:'rainbow-fluorite-crystals','red-jasper':'red-jasper-crystals',turquoise:'turquoise-crystals',labradorite:'labradorite-crystals',shungite:'shungite-crystals',bloodstone:'bloodstone-crystals',rhodonite:'rhodonite-crystals',amazonite:'amazonite-crystal' };
function stoneName(slug) { if (DISPLAY[slug]) return DISPLAY[slug]; const a = ATTR[slug + '-meaning']; if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').replace(/\s*Meaning.*$/i, '').trim(); if (s) return s; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function shopCTA(slug) { const cat = CAT_MAP[slug]; const url = cat ? `/product-category/${cat}/` : `/shop/?s=${slug}`; return `<p><a href="${url}">Shop ${stoneName(slug)} Jewelry</a></p>`; }

const all = KNOW.mainpages; let made = 0; const index = [];
for (const mp of all) {
  const { slug, title, focus_keyword, definition, calculation, crystals, faq_seeds, eastern_note } = mp;
  const isHub = mp.page_type === 'hub';
  const siblings = all.filter(x => x.slug !== slug && x.slug !== 'feng-shui-crystals').slice(0, 8);
  const relatedHtml = siblings.map(s => `<li><a href="/${s.slug}/">${s.title.replace(/:.*/, '')}</a></li>`).join('\n');
  const quickPlacement = calculation.formula ? `<li><strong>Placement:</strong> ${calculation.formula}</li>` : '';
  const quickCrystals = (crystals || []).slice(0, 3).map(c => stoneName(c)).join(', ');
  const quickAnswer = `<div class="quick-answer"><p>${definition}</p><ul>${quickPlacement}${quickCrystals ? `<li><strong>Crystals:</strong> ${quickCrystals}</li>` : ''}</ul></div>`;
  const subj = title.replace(/:.*/, '').trim();
  const whatIs = `<h2>What Is ${subj}?</h2>\n<p>${definition.split('.').slice(0, 2).join('.')}.</p>`;
  let explained = `<h2>${subj} Explained</h2>\n{{AI_EXPLAINED_INTRO}}`;
  if (calculation.steps && calculation.steps.length) explained += `\n<h3>How to Place &amp; Activate</h3>\n<ol>\n${calculation.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('\n')}\n</ol>`;
  if (calculation.example) explained += `\n<p><em>Tip:</em> ${calculation.example}</p>`;
  explained += `\n<h3>Meaning &amp; Application</h3>\n{{AI_MEANING_DEEP}}`;
  const keyFacts = `<h2>Key Facts</h2>\n<table><tr><th>Aspect</th><th>Detail</th></tr><tr><td>Practice</td><td>${calculation.method}</td></tr><tr><td>Principle</td><td>${definition.split('.')[0]}.</td></tr>${quickCrystals ? `<tr><td>Supporting Crystals</td><td>${quickCrystals}</td></tr>` : ''}</table>`;
  const crystalsHtml = (crystals || []).length ? `<h2>Crystals to Enhance Your Space</h2>\n{{AI_CRYSTALS_INTRO}}\n<ul>\n${crystals.map(c => `<li><a href="/${c}-meaning/">${stoneName(c)}</a> — {{AI_CRYSTAL_${c.toUpperCase().replace(/-/g, '_')}}}</li>`).join('\n')}\n</ul>\n${crystals.map(shopCTA).join('\n')}\n<p><em>Explore <a href="/feng-shui-crystals/">Crystals in Feng Shui</a>, <a href="/feng-shui-bagua-map/">Bagua Map</a>, <a href="/feng-shui-wealth-corner/">Wealth Corner</a> guides.</em></p>` : '';
  const eastern = eastern_note ? `<h2>Eastern Traditions</h2>\n<p>${eastern_note}</p>` : '';
  const faq = `<h2>Frequently Asked Questions</h2>\n${(faq_seeds || []).map((q, i) => `<h3>${q}</h3>\n{{AI_FAQ_ANSWER_${i + 1}}}`).join('\n')}`;
  const related = `<h2>Related Feng Shui Guides</h2>\n<ul>\n${relatedHtml}\n<li><a href="/feng-shui-crystals/">Crystals in Feng Shui</a></li>\n<li><a href="/tools/kua-number-calculator/">Kua Number Calculator</a></li>\n<li><a href="/tools/bagua-map/">Bagua Map Tool</a></li>\n</ul>`;
  const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, keyFacts, crystalsHtml, eastern, faq, related, `<p class="gentle-note"><em>Feng Shui and crystal placement are traditional practices for creating supportive, intentional spaces — tools for reflection and wellbeing, not substitutes for professional advice or guarantees of specific outcomes.</em></p>`].filter(Boolean).join('\n\n');
  const article = { title, slug, url: `/${slug}/`, page_type: mp.page_type, definition, calculation, crystals: crystals || [], eastern_note: eastern_note || null, faq_seeds: faq_seeds || [], rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: focus_keyword, excerpt: '{{AI_EXCERPT}}', images: { hero: { file: `images/fengshui/hero-${slug}.webp`, alt: `${subj} — feng shui placement & meaning`, source_type: 'mainpage-hero' } }, content };
  fs.writeFileSync(path.join(DIR, 'articles-mainpages', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug, title, page_type: mp.page_type }); made++;
}
fs.writeFileSync(path.join(DIR, 'articles-mainpages-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Feng Shui 主词页骨架生成 → articles-mainpages/`);
