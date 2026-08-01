/**
 * Numerology 主词深度页骨架生成器（10 篇知识中心）
 * 读 numerology-mainpages-knowledge.json + crystal-attributes.json
 * → 主词页模板（Quick Answer / What Is / Explained+Calculation / Key Facts / Crystals / FAQ / Related）
 * 对齐 generate-articles.js 输出字段，复用 upload-numerology.js + generate-images.js 管线
 * 框架：模板-Numerology主词页框架.md（F16 主词页争AIO结构）
 * 用法：node generate-mainpages.js  （全10篇）
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/numerology-mainpages-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const DISPLAY_OVERRIDES = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', apatite: 'Yellow Apatite' };
function stoneName(slug) {
  if (DISPLAY_OVERRIDES[slug]) return DISPLAY_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) { const s = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim(); if (s) return s; }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
// Shop CTA 三级降级（简化版，生产时可接 _cta-validation.json）
function shopCTA(slug) {
  return `<p><a href="/shop/?s=${slug}">Shop ${stoneName(slug)} Jewelry</a></p>`;
}

const all = KNOW.mainpages;
let made = 0; const index = [];
for (const mp of all) {
  const { slug, title, focus_keyword, definition, calculation, crystals, faq_seeds, eastern_note } = mp;
  const isHub = mp.page_type === 'hub';

  // 兄弟主词互链（Related）
  const siblings = all.filter(x => x.slug !== slug).slice(0, 6);
  const relatedHtml = siblings.map(s => `<li><a href="/${s.slug}/">${s.title.replace(/:.*/, '')}</a></li>`).join('\n');

  // Quick Answer 速答卡
  const quickCalc = calculation.formula ? `<li><strong>Calculation:</strong> ${calculation.formula}</li>` : '';
  const quickCrystals = (crystals || []).slice(0, 3).map(c => stoneName(c)).join(', ');
  const quickAnswer = `<div class="quick-answer"><p>${definition}</p><ul>${quickCalc}${quickCrystals ? `<li><strong>Crystals:</strong> ${quickCrystals}</li>` : ''}</ul></div>`;

  // What Is
  const whatIs = `<h2>What Is ${isHub ? 'Numerology' : title.replace(/:.*/, '').replace(/ Number.*/, ' Number')}?</h2>\n<p>${definition}</p>`;

  // Explained + Calculation
  let explained = `<h2>${isHub ? 'Numerology' : title.replace(/:.*/, '').replace(/ Number.*/, ' Number')} Explained</h2>`;
  explained += `\n<p>{{AI_EXPLAINED_INTRO}}</p>`;
  if (calculation.steps && calculation.steps.length) {
    explained += `\n<h3>How to Calculate</h3>\n<ol>\n${calculation.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('\n')}\n</ol>`;
  }
  if (calculation.formula) explained += `\n<p><strong>Formula:</strong> ${calculation.formula}</p>`;
  if (calculation.example) explained += `\n<p><em>Example:</em> ${calculation.example}</p>`;
  // by Number（主词页只总览，深度归 life-path 交叉页）
  if (!isHub && slug !== 'numerology-compatibility') {
    explained += `\n<h3>By Number (1–9)</h3>\n<p>{{AI_BY_NUMBER_OVERVIEW}}</p>`;
    explained += `\n<p>For each number's in-depth meaning, see <a href="/life-path-number/">Life Path Number</a> and the individual <a href="/life-path-1/">Life Path 1</a>–<a href="/life-path-9/">9</a> pages.</p>`;
  }
  if (calculation.meaning) {
    const m = calculation.meaning;
    if (typeof m === 'object') {
      explained += `\n<h3>Meaning by Value</h3>\n<ul>\n${Object.entries(m).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('\n')}\n</ul>`;
    }
  }
  explained += `\n<h3>Meaning &amp; Interpretation</h3>\n<p>{{AI_MEANING_DEEP}}</p>`;

  // Key Facts
  const keyFacts = `<h2>Key Facts</h2>\n<table><tr><th>Aspect</th><th>Detail</th></tr><tr><td>Calculation</td><td>${calculation.method}</td></tr><tr><td>Reveals</td><td>${mp.definition.split('.')[0]}.</td></tr>${quickCrystals ? `<tr><td>Best Crystals</td><td>${quickCrystals}</td></tr>` : ''}</table>`;

  // Crystals
  const crystalsHtml = (crystals || []).length ? `<h2>${title.replace(/:.*/, '').replace(/ Number.*/, ' Number')} and Crystals</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n<ul>\n${crystals.map(c => `<li><a href="/${c}-meaning/">${stoneName(c)}</a> — {{AI_CRYSTAL_${c.toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n${crystals.map(shopCTA).join('\n')}\n<p><em>For crystals by your specific Life Path number, see <a href="/best-crystals-for-life-path-1/">Life Path crystal guides</a>.</em></p>` : '';

  // Eastern anchor
  const eastern = eastern_note ? `<h2>Eastern Perspective</h2>\n<p>${eastern_note}</p>` : '';

  // FAQ
  const faq = `<h2>Frequently Asked Questions</h2>\n${(faq_seeds || []).map(q => `<h3>${q}</h3>\n<p>{{AI_FAQ_ANSWER}}</p>`).join('\n')}`;

  // Related
  const related = `<h2>Related Numerology Guides</h2>\n<ul>\n${relatedHtml}\n</ul>`;

  const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, keyFacts, crystalsHtml, eastern, faq, related, `<p class="gentle-note"><em>Numerology and crystal meanings are tools for self-reflection, not substitutes for professional advice — not a deterministic prediction.</em></p>`].filter(Boolean).join('\n\n');

  const article = {
    title, slug, url: `/${slug}/`,
    page_type: mp.page_type,
    definition, calculation,
    crystals: crystals || [],
    eastern_note: mp.eastern_note || null,
    faq_seeds: mp.faq_seeds || [],
    rank_math_title: title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: focus_keyword,
    excerpt: '{{AI_EXCERPT}}',
    images: { hero: { file: `images/numerology-mainpages/hero-${slug}.webp`, alt: `${title.replace(/:.*/, '')} — meaning and how to calculate`, source_type: 'mainpage-hero', prompt_hint: `${title}, numerology concept with crystals, spiritual aesthetic, no text` } },
    content,
  };

  fs.mkdirSync(path.join(DIR, 'articles-mainpages'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles-mainpages', slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug, title, page_type: mp.page_type });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-mainpages-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Numerology 主词页骨架生成 → articles-mainpages/`);
