/**
 * Astrology planet-in-sign 程式化骨架生成器（10行星×12星座=120篇）
 * 读 planet-in-sign-knowledge.json → 遍历 planets×signs → 每篇骨架（AI 组合填充含义）
 * 用法：node generate-planet-in-sign.js [--planets=5]（默认全10；--planets=5 核心个人行星首批60）
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/planet-in-sign-knowledge.json');
const args = process.argv.slice(2);
const planetLimit = args.find(a => a.startsWith('--planets='))?.split('=')[1];
const planetEntries = Object.entries(KNOW.planets);
const signEntries = Object.entries(KNOW.signs);
const offsetArg = args.find(a => a.startsWith('--offset='))?.split('=')[1];
const offset = offsetArg ? parseInt(offsetArg) : 0;
const planets = planetLimit ? planetEntries.slice(offset, offset + parseInt(planetLimit)) : (offset ? planetEntries.slice(offset) : planetEntries);

let made = 0; const index = [];
for (const [pSlug, p] of planets) {
  for (const [sSlug, s] of signEntries) {
    const slug = `${pSlug}-in-${sSlug}`;
    const title = `${p.name} in ${s.name}: Meaning, Traits & Crystals`;
    const focus = `${pSlug} in ${sSlug}`;
    const definition = `${p.name} in ${s.name} blends the archetypal drive of ${p.name} (${p.drives}) with the ${s.element}, ${s.quality.toLowerCase()} nature of ${s.name}.`;
    const quickAnswer = `<div class="quick-answer"><p>${definition}</p><ul><li><strong>Planet:</strong> ${p.name} — ${p.keywords.join(', ')}</li><li><strong>Sign:</strong> ${s.name} (${s.element}/${s.quality}) — ${s.keywords.join(', ')}</li></ul></div>`;
    const whatIs = `<h2>What Does ${p.name} in ${s.name} Mean?</h2>\n<p>{{AI_WHAT_IS}}</p>`;
    const explained = `<h2>${p.name} in ${s.name} Explained</h2>\n<p>{{AI_EXPLAINED}}</p>\n<h3>How This Combination Feels</h3>\n<p>{{AI_COMBO_FEELS}}</p>\n<h3>Strengths &amp; Challenges</h3>\n<p>{{AI_STRENGTHS}}</p>`;
    const keyFacts = `<h2>Key Facts</h2>\n<table><tr><th>Planet</th><td>${p.name} (${p.keywords.slice(0, 3).join(', ')})</td></tr><tr><th>Sign</th><td>${s.name} — ${s.element}/${s.quality}</td></tr><tr><th>Drives</th><td>${p.drives}</td></tr><tr><th>Sign traits</th><td>${s.traits}</td></tr></table>`;
    const crystalsHtml = `<h2>Crystals for ${p.name} in ${s.name}</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n<ul>\n${p.crystals.map(c => `<li><a href="/${c}-meaning/">${c.replace(/-/g, ' ')}</a> — {{AI_CRYSTAL_${c.toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n<p>${p.crystals_note}</p>\n<p><em><a href="/shop/?s=${p.crystals[0]}">Shop ${p.crystals[0].replace(/-/g, ' ')} jewelry</a></em></p>`;
    const eastern = `<h2>Eastern Perspective</h2>\n<p>${KNOW.eastern_anchor_note}</p>`;
    const faq = `<h2>Frequently Asked Questions</h2>\n<h3>What does ${p.name} in ${s.name} mean in astrology?</h3>\n<p>{{AI_FAQ_MEANING}}</p>\n<h3>Is ${p.name} in ${s.name} a strong placement?</h3>\n<p>{{AI_FAQ_STRONG}}</p>`;
    const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, keyFacts, crystalsHtml, eastern, faq, `<p class="gentle-note"><em>Astrology is a symbolic framework for self-reflection and creative meaning-making — not a science or deterministic prediction of your life or personality.</em></p>`].join('\n\n');
    const article = { title, slug, url: `/${slug}/`, page_type: 'planet-in-sign', planet: pSlug, planet_name: p.name, sign: sSlug, sign_name: s.name, definition, planet_keywords: p.keywords, sign_keywords: s.keywords, planet_drives: p.drives, sign_traits: s.traits, crystals: p.crystals, crystals_note: p.crystals_note, eastern_note: KNOW.eastern_anchor_note, rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: focus, excerpt: '{{AI_EXCERPT}}', images: { hero: { file: `images/planet-in-sign/hero-${slug}.webp`, alt: `${p.name} in ${s.name} astrology meaning`, source_type: 'planet-in-sign' } }, content };
    fs.writeFileSync(path.join(DIR, 'articles-planet-in-sign', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
    index.push({ slug, title, planet: pSlug, sign: sSlug }); made++;
  }
}
fs.writeFileSync(path.join(DIR, 'articles-planet-in-sign-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 planet-in-sign 骨架 (${planets.length}行星×12星座)`);
