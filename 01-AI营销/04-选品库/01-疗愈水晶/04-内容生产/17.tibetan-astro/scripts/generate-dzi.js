/**
 * 藏式 Dzi bead 系列骨架生成器（读 dzi_beads）
 * 结构: What Is/Symbolism+Benefits/Who Wear·Avoid/Authenticity[占位]/Crystals(ZH→slug内链)/Cultural/FAQ/Related
 * crystals 中文名→slug 映射；Cultural Source 保留作 E-E-A-T
 * 用法：node generate-dzi.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../_shared/tibetan-knowledge.json');
const ZH_SLUG = { '青金石': 'lapis', '紫水晶': 'amethyst', '粉晶': 'rose-quartz', '月光石': 'moonstone', '黄水晶': 'citrine', '绿幽灵': 'green-phantom', '绿松石': 'turquoise', '红玉髓': 'carnelian', '黑曜石': 'black-obsidian', '茶晶': 'smoky-quartz', '发晶': 'rutilated-quartz', '白水晶': 'clear-quartz', '东陵玉': 'green-aventurine', '石榴石': 'garnet', '虎眼石': 'tiger-eye', '海蓝宝': 'aquamarine', '翡翠': 'jade' };

const all = KNOW.dzi_beads; let made = 0; const index = [];
for (const d of all) {
  const { slug, name_en, name_zh, meaning, benefits, who_should_wear, who_should_avoid, crystals, crystals_note, cultural_source, eyes } = d;
  const cslugs = (crystals || []).map(c => ZH_SLUG[c] || c).filter(c => /^[a-z]/.test(c));
  const siblings = all.filter(x => x.slug !== slug).slice(0, 6);
  const relatedHtml = siblings.map(s => `<li><a href="/${s.slug}/">${s.name_en}</a></li>`).join('\n');
  const benefitsHtml = (benefits || []).map(b => `<li>${b}</li>`).join('\n');
  const quickAnswer = `<div class="quick-answer"><p><strong>${name_en} (${name_zh}):</strong> ${meaning.slice(0, 100)}</p><ul><li><strong>Eyes:</strong> ${eyes}</li>${cslugs.length ? `<li><strong>Paired stones:</strong> ${cslugs.join(', ')}</li>` : ''}</ul></div>`;
  const whatIs = `<h2>What Is the ${name_en}?</h2>\n<p>{{AI_WHAT_IS}}</p>`;
  const symbolism = `<h2>Symbolism &amp; Meaning</h2>\n<p>${meaning}</p>\n<h3>Key Benefits (Traditional)</h3>\n<ul>\n${benefitsHtml}\n</ul>\n<p>{{AI_SYMBOLISM_DEEP}}</p>`;
  const who = `<h2>Who Should Wear the ${name_en}</h2>\n<p>${who_should_wear || '{{AI_WHO_WEAR}}'}</p>\n${who_should_avoid ? `<h3>Considerations</h3>\n<p>${who_should_avoid}</p>` : ''}`;
  const auth = `<h2>Authenticity &amp; Care</h2>\n<p>{{AI_AUTHENTICITY}}</p>`;
  const crystalsHtml = cslugs.length ? `<h2>Crystals &amp; Jewelry Pairing</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n<ul>\n${cslugs.map(s => `<li><a href="/${s}-meaning/">${s.replace(/-/g, ' ')}</a> — {{AI_CRYSTAL_${s.toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n${crystals_note ? `<p><em>${crystals_note}</em></p>` : ''}\n<p><em>Genuine ancient Dzi beads are rare and precious; pair their symbolism with our <a href="/shop/?s=turquoise">turquoise</a>, <a href="/shop/?s=carnelian">carnelian</a>, or <a href="/shop/?s=lapis">lapis</a> jewelry.</em></p>` : '';
  const cultural = `<h2>Cultural Background</h2>\n<p><em>Source: ${cultural_source || 'Tibetan cultural traditions'}</em></p>\n<p>{{AI_CULTURAL_NOTE}}</p>`;
  const faq = `<h2>Frequently Asked Questions</h2>\n<h3>What does the ${eyes}-eye Dzi bead mean?</h3>\n<p>{{AI_FAQ_MEANING}}</p>\n<h3>Who should wear the ${eyes}-eye Dzi bead?</h3>\n<p>{{AI_FAQ_WHO}}</p>\n<h3>How can I tell if a Dzi bead is authentic?</h3>\n<p>{{AI_FAQ_AUTH}}</p>`;
  const related = `<h2>Related Dzi Beads</h2>\n<ul>\n${relatedHtml}\n</ul>`;
  const content = [`<h1>${name_en}: Meaning, Benefits &amp; Who Should Wear</h1>`, quickAnswer, whatIs, symbolism, who, auth, crystalsHtml, cultural, faq, related, `<p class="gentle-note"><em>Dzi bead meanings are drawn from Tibetan cultural traditions and symbolism, offered as cultural appreciation and personal reflection — not guarantees of outcome, and not a substitute for professional advice.</em></p>`].filter(Boolean).join('\n\n');
  const title = `${name_en}: Meaning, Benefits & Who Should Wear`;
  const article = { title, slug, url: `/${slug}/`, page_type: 'dzi', eyes, name_en, name_zh, meaning, benefits, who_should_wear, who_should_avoid, crystals: cslugs, crystals_note, cultural_source, rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: `${eyes}-eye dzi bead`, excerpt: '{{AI_EXCERPT}}', images: { hero: { file: `images/tibetan-dzi/hero-${slug}.webp`, alt: `${name_en} — Tibetan Dzi bead meaning`, source_type: 'dzi-hero' } }, content };
  fs.writeFileSync(path.join(DIR, 'articles', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug, title, eyes }); made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Dzi bead 骨架生成 → articles/`);
