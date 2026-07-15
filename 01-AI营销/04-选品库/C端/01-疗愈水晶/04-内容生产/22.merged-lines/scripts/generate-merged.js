/**
 * 合并项骨架生成器（遍历 merged-lines-knowledge.json 4数组：vedic/moonphase/humandesign/iching）
 * 用法：node generate-merged.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const K = require('../../../07-互动工具/_shared/merged-lines-knowledge.json');
const all = [...K.vedic, ...K.moonphase, ...K.humandesign, ...K.iching];
fs.mkdirSync(path.join(DIR, 'articles-merged'), { recursive: true });
let made = 0; const index = [];
for (const mp of all) {
  const { slug, title, focus_keyword, definition, calculation, crystals, faq_seeds, eastern_note } = mp;
  const siblings = all.filter(x => x.slug !== slug).slice(0, 6);
  const relatedHtml = siblings.map(s => `<li><a href="/${s.slug}/">${s.title.replace(/:.*/, '')}</a></li>`).join('\n');
  const quickCrystals = (crystals || []).slice(0, 3).join(', ');
  const quickAnswer = `<div class="quick-answer"><p>${definition}</p><ul>${calculation && calculation.formula ? `<li><strong>Practice:</strong> ${calculation.formula}</li>` : ''}${quickCrystals ? `<li><strong>Crystals:</strong> ${quickCrystals}</li>` : ''}</ul></div>`;
  const subj = title.replace(/:.*/, '').trim();
  const whatIs = `<h2>What Is ${subj}?</h2>\n<p>${definition}</p>`;
  let explained = `<h2>${subj} Explained</h2>\n<p>{{AI_EXPLAINED}}</p>`;
  if (calculation && calculation.steps && calculation.steps.length) explained += `\n<h3>How to Engage</h3>\n<ol>\n${calculation.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('\n')}\n</ol>`;
  explained += `\n<h3>Meaning &amp; Symbolism</h3>\n<p>{{AI_MEANING_DEEP}}</p>`;
  const crystalsHtml = (crystals || []).length ? `<h2>Crystals &amp; Symbolism</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n<ul>\n${crystals.map(c => `<li><a href="/${c}-meaning/">${c.replace(/-/g, ' ')}</a> — {{AI_CRYSTAL_${c.toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n<p><em><a href="/shop/?s=${crystals[0]}">Shop ${crystals[0].replace(/-/g, ' ')} jewelry</a></em></p>` : '';
  const eastern = eastern_note ? `<h2>Tradition</h2>\n<p>${eastern_note}</p>` : '';
  const faq = `<h2>Frequently Asked Questions</h2>\n${(faq_seeds || []).map(q => `<h3>${q}</h3>\n<p>{{AI_FAQ_ANSWER}}</p>`).join('\n')}`;
  const related = `<h2>Related Guides</h2>\n<ul>\n${relatedHtml}\n</ul>`;
  const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, crystalsHtml, eastern, faq, related, `<p class="gentle-note"><em>Symbolic and reflective content for personal exploration — not medical, financial, or deterministic advice; crystal pairings are modern associations.</em></p>`].join('\n\n');
  const article = { title, slug, url: `/${slug}/`, page_type: mp.page_type || 'merged', definition, calculation, crystals: crystals || [], eastern_note, merge_target: mp.merge_target, caveat: mp.caveat, rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: focus_keyword, excerpt: '{{AI_EXCERPT}}', images: { hero: { file: `images/merged-lines/hero-${slug}.webp`, alt: `${subj} meaning`, source_type: 'merged-hero' } }, content };
  fs.writeFileSync(path.join(DIR, 'articles-merged', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug, title }); made++;
}
fs.writeFileSync(path.join(DIR, 'articles-merged-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇合并项骨架(4线)`);
