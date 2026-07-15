/**
 * Meditation 主词页骨架生成器（14 篇纯冥想知识中心）
 * 读 meditation-mainpages-knowledge.json → 主词页模板（Quick Answer/What Is/Explained+HowTo/Key Facts/Crystals内链9交叉页/Eastern/FAQ/Related）
 * 无 by Number 段（meditation 无数字概念）；crystals 内链 best-crystals-for-meditation hub + 9 交叉页
 * 用法：node generate-mainpages.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/meditation-mainpages-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const DISPLAY = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', apatite: 'Yellow Apatite' };
function stoneName(slug) { if (DISPLAY[slug]) return DISPLAY[slug]; const a = ATTR[slug + '-meaning']; if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim(); if (s) return s; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function shopCTA(slug) { return `<p><a href="/shop/?s=${slug}">Shop ${stoneName(slug)} Jewelry</a></p>`; }

const all = KNOW.mainpages; let made = 0; const index = [];
for (const mp of all) {
  const { slug, title, focus_keyword, definition, calculation, crystals, faq_seeds, eastern_note } = mp;
  const isHub = mp.page_type === 'hub';
  const siblings = all.filter(x => x.slug !== slug).slice(0, 6);
  const relatedHtml = siblings.map(s => `<li><a href="/${s.slug}/">${s.title.replace(/:.*/, '')}</a></li>`).join('\n');
  const quickHow = calculation.formula ? `<li><strong>Practice:</strong> ${calculation.formula}</li>` : '';
  const quickCrystals = (crystals || []).slice(0, 3).map(c => stoneName(c)).join(', ');
  const quickAnswer = `<div class="quick-answer"><p>${definition}</p><ul>${quickHow}${quickCrystals ? `<li><strong>Crystals:</strong> ${quickCrystals}</li>` : ''}</ul></div>`;
  const subj = title.replace(/:.*/, '').trim();
  const whatIs = `<h2>What Is ${isHub ? 'Meditation' : subj.replace(/ Meditation.*/, ' Meditation')}?</h2>\n<p>${definition}</p>`;
  let explained = `<h2>${subj} Explained</h2>\n<p>{{AI_EXPLAINED_INTRO}}</p>`;
  if (calculation.steps && calculation.steps.length) explained += `\n<h3>How to Practice</h3>\n<ol>\n${calculation.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('\n')}\n</ol>`;
  if (calculation.example) explained += `\n<p><em>Tip:</em> ${calculation.example}</p>`;
  if (calculation.meaning && typeof calculation.meaning === 'object') explained += `\n<h3>Key Points</h3>\n<ul>\n${Object.entries(calculation.meaning).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('\n')}\n</ul>`;
  explained += `\n<h3>Meaning &amp; Benefits</h3>\n<p>{{AI_MEANING_DEEP}}</p>`;
  const keyFacts = `<h2>Key Facts</h2>\n<table><tr><th>Aspect</th><th>Detail</th></tr><tr><td>Practice</td><td>${calculation.method}</td></tr><tr><td>Reveals</td><td>${definition.split('.')[0]}.</td></tr>${quickCrystals ? `<tr><td>Supporting Crystals</td><td>${quickCrystals}</td></tr>` : ''}</table>`;
  const crystalsHtml = (crystals || []).length ? `<h2>Crystals to Deepen Your Practice</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n<ul>\n${crystals.map(c => `<li><a href="/${c}-meaning/">${stoneName(c)}</a> — {{AI_CRYSTAL_${c.toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n${crystals.map(shopCTA).join('\n')}\n<p><em>Explore <a href="/best-crystals-for-meditation/">Best Crystals for Meditation</a>, <a href="/crystals-for-focus-meditation/">focus</a>, <a href="/crystals-for-sleep-meditation/">sleep</a>, <a href="/grounding-meditation-with-crystals/">grounding</a> guides.</em></p>` : '';
  const eastern = eastern_note ? `<h2>Eastern Traditions</h2>\n<p>${eastern_note}</p>` : '';
  const faq = `<h2>Frequently Asked Questions</h2>\n${(faq_seeds || []).map(q => `<h3>${q}</h3>\n<p>{{AI_FAQ_ANSWER}}</p>`).join('\n')}`;
  const related = `<h2>Related Meditation Guides</h2>\n<ul>\n${relatedHtml}\n<li><a href="/best-crystals-for-meditation/">Best Crystals for Meditation</a></li>\n</ul>`;
  const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, keyFacts, crystalsHtml, eastern, faq, related, `<p class="gentle-note"><em>Meditation and crystal practices are tools for wellbeing and self-reflection, not substitutes for medical or mental health treatment.</em></p>`].filter(Boolean).join('\n\n');
  const article = { title, slug, url: `/${slug}/`, page_type: mp.page_type, definition, calculation, crystals: crystals || [], eastern_note: eastern_note || null, faq_seeds: faq_seeds || [], rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: focus_keyword, excerpt: '{{AI_EXCERPT}}', images: { hero: { file: `images/meditation-mainpages/hero-${slug}.webp`, alt: `${title.replace(/:.*/, '')} — how to practice`, source_type: 'mainpage-hero' } }, content };
  fs.writeFileSync(path.join(DIR, 'articles-mainpages', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug, title, page_type: mp.page_type }); made++;
}
fs.writeFileSync(path.join(DIR, 'articles-mainpages-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Meditation 主词页骨架生成 → articles-mainpages/`);
