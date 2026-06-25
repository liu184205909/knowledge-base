/**
 * 为 169 组水晶配对生成参数化文章模板
 * 模块 1/2/3/7/8/9/10 用脚本填充，模块 4/5/6 留占位待 agent
 *
 * 输出：../article-templates.json（169 组）
 */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../combinations-data-30.json'), 'utf8'));
const SELECTED = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../selected-articles.json'), 'utf8'));
const ALL = DATA.combinations;

// 30 颗水晶属性（从 crystal-stones-30.json）
const STONES30 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/03-视觉层/crystal-stones-30.json'), 'utf8'));
const STONES = STONES30.stones;

const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// 模板函数
function mod1_quick(p) {
  const [a, b] = p.stoneNames;
  if (p.conflict) {
    return `<h2>Quick Answer</h2>\n<p><strong>Quick Answer:</strong> ${a} and ${b} should generally be used separately (compatibility: ${p.score}/100). Their energies traditionally pull in opposite directions. ${p.bestFor.length ? '' : 'Wear them on different days for the best results.'}</p>`;
  }
  return `<h2>Quick Answer</h2>\n<p><strong>Quick Answer:</strong> Yes, ${a} and ${b} can be worn together (compatibility: ${p.score}/100 — ${p.band}). ${p.bestFor.length ? 'Best for ' + p.bestFor.join(', ').toLowerCase() + '.' : 'A ' + p.elements[0] + '+' + p.elements[1] + ' pairing with good synergy.'}</p>`;
}

function mod2_about(p) {
  const [sa, sb] = p.stones;
  const a = STONES[sa], b = STONES[sb];
  const card = (stone, slug) => `<div style="flex:1;min-width:200px;background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:20px;margin:8px;">
<h3>${stone.name}</h3>
<p style="font-size:14px;color:#666;line-height:1.8;">
<strong>Element:</strong> ${stone.element}<br>
<strong>Chakras:</strong> ${(stone.chakras || []).join(', ') || 'All'}<br>
<strong>Intentions:</strong> ${(stone.tags || []).join(', ')}
</p>
<p><a href="/gemstone/${slug}-meaning/" style="color:#2D6A4F;">${stone.name} Meaning →</a></p>
</div>`;
  return `<h2>About ${a.name} and ${b.name}</h2>\n<div style="display:flex;flex-wrap:wrap;">\n${card(a, sa)}\n${card(b, sb)}\n</div>`;
}

function mod3_canWear_placeholder(p) {
  return `<!-- MODULES_4_5_6:${p.stones[0]}-and-${p.stones[1]} -->`;
}

function mod7_caring(p) {
  const [sa, sb] = p.stones;
  const a = STONES[sa], b = STONES[sb];
  return `<h2>Caring for ${a.name} and ${b.name}</h2>\n<p>Both stones are genuine, ethically sourced, and real — not dyed, not glass. To keep them at their best:</p>\n<ul>\n<li><strong>Cleansing:</strong> Running water for hard stones (Mohs 6+), moonlight for all, smoke (sage/palo santo) for delicate ones.</li>\n<li><strong>Charging:</strong> Place on a Selenite slab or in moonlight overnight. Keep ${a.element === 'fire' ? a.name : b.name} out of prolonged direct sun if color-sensitive.</li>\n<li><strong>Storing:</strong> Store separately or with a soft cloth between them to prevent scratching.</li>\n</ul>\n<p><a href="/blog/how-to-cleanse-crystals/" style="color:#2D6A4F;">Complete crystal cleansing guide →</a></p>`;
}

function mod8_shop(p) {
  const [sa, sb] = p.stones;
  const a = STONES[sa], b = STONES[sb];
  return `<h2>Shop ${a.name} + ${b.name}</h2>\n<p>Every stone below is genuine, ethically sourced, and real — not dyed, not glass.</p>\n<!-- wp:wd/products {"categoriesIds":"1492,1515,1514,1496,1516,1489,1509","orderby":"rand","columns":3,"items_per_page":"6","product_hover":"standard","stretch_product":true} /-->`;
}

function mod9_faq(p) {
  const [a, b] = p.stoneNames;
  const [sa, sb] = p.stones;
  return `<h2>Frequently Asked Questions</h2>\n\n<h3>Can I wear ${a} and ${b} together every day?</h3>\n<p>${p.conflict ? 'Traditionally, ' + a + ' and ' + b + ' are best worn on separate days rather than together. Wear ' + a + ' when you need its energy, and ' + b + ' when you need a different kind of support.' : 'Yes. ' + a + ' and ' + b + ' are a ' + p.band.toLowerCase() + ' pairing (score ' + p.score + '/100). Many people wear them daily as a bracelet combination or carry them as pocket stones.'}</p>\n\n<h3>What is ${a} and ${b} good for together?</h3>\n<p>${p.bestFor.length ? 'This combination is traditionally associated with ' + p.bestFor.join(', ').toLowerCase() + '.' : 'This combination brings together ' + p.elements[0] + ' and ' + p.elements[1] + ' energies.'}</p>\n\n<h3>Which hand should I wear them on?</h3>\n<p>There's no strict rule. A common approach: wear the receiving stone (traditionally the calming one) on the left wrist and the projecting stone on the right. Trust what feels right.</p>\n\n<h3>How do I cleanse ${a} and ${b}?</h3>\n<p>Moonlight works for both. Running water is fine for hard stones (quartz family, Mohs 6+). Selenite slabs clear and charge any stone placed on them. See our <a href="/blog/how-to-cleanse-crystals/">complete cleansing guide</a>.</p>\n\n<h3>Can I add a third stone?</h3>\n<p>Yes, but keep your intention clear. Clear Quartz is a safe amplifier that works with almost any combination. Avoid adding stones with conflicting intentions.</p>`;
}

function mod10_related(p) {
  const [sa, sb] = p.stones;
  const a = STONES[sa], b = STONES[sb];
  return `<h2>Related</h2>\n<ul>\n<li><a href="/gemstone/${sa}-meaning/">${a.name} Meaning</a></li>\n<li><a href="/gemstone/${sb}-meaning/">${b.name} Meaning</a></li>\n<li><a href="/tools/crystal-compatibility-checker/">Crystal Compatibility Checker</a></li>\n<li><a href="/category/crystal-combinations/">All Crystal Combinations</a></li>\n</ul>\n<p><em>Crystal meanings are shared for entertainment and spiritual practice. They're not a substitute for professional medical or mental-health care. All stones are genuine, ethically sourced, and real.</em></p>`;
}

// 生成 169 组
const templates = {};
let count = 0;

for (const article of SELECTED.articles) {
  const slug = article.slug;
  const p = ALL[slug];
  if (!p) {
    console.warn('Missing data for:', slug);
    continue;
  }

  const [a, b] = p.stoneNames;
  const kw = `${a.toLowerCase()} and ${b.toLowerCase()}`;

  templates[slug] = {
    title: `${a} and ${b} Together: Benefits, Meaning + How to Use`,
    slug: slug,
    excerpt: `${a} and ${b} together (${p.score}/100 — ${p.band}). ${p.conflict ? 'Should be used separately.' : 'Can you wear them together? Benefits, how to use, and caring tips.'}`,
    rank_math_title: `${a} and ${b} Together: Compatibility + Benefits`,
    rank_math_description: `${a} + ${b} compatibility: ${p.score}/100 (${p.band}). ${p.conflict ? 'Why they should be worn separately' : 'Benefits, how to wear together, and caring tips'}.`,
    rank_math_focus_keyword: kw,
    content: [
      mod1_quick(p),
      mod2_about(p),
      mod3_canWear_placeholder(p),
      mod7_caring(p),
      mod8_shop(p),
      mod9_faq(p),
      mod10_related(p),
    ].join('\n\n'),
  };
  count++;
}

const OUT = path.resolve(__dirname, '../article-templates.json');
fs.writeFileSync(OUT, JSON.stringify(templates, null, 2), 'utf8');
console.log(`✅ 生成 ${count} 组文章模板 → ${OUT}`);
console.log(`   含模块 1/2/7/8/9/10（参数化）`);
console.log(`   模块 4/5/6 留占位，待 agent 填`);
console.log(`   冲突组合: ${SELECTED.articles.filter(a => ALL[a.slug]?.conflict).length} 篇（特殊 Quick Answer）`);

// 抽检
const samples = ['amethyst-and-citrine', 'carnelian-and-amethyst', 'rose-quartz-and-black-tourmaline'];
console.log(`\n📋 抽检：`);
for (const s of samples) {
  const t = templates[s];
  if (!t) continue;
  const p = ALL[s];
  console.log(`  ${s}: ${p.score}/100 ${p.band} | conflict=${p.conflict} | title="${t.title.slice(0, 50)}..."`);
}
