/**
 * chakra/color/element spoke 骨架生成器 v3（基于 v2 框架）
 * 新字段: Best way to use(参数化) / Color Meaning / Elemental link+Element action(Element独有,AI填)
 * 新模块: Color M2.5 How to Identify
 * 工具CTA位置(v2): chakra M2末+M5前 / color M2末+M4 / element M2末(失衡后)+M6后
 * 差异化提示 diffHints(供AI): 每篇 M6/M5/M4 独特内容
 * 用法：node generate-articles.js --slug=root | --type=chakra | (全23篇)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(DIR, 'spoke-data.json'), 'utf8'));
const stones30 = require('../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json').stones;
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const CHAKRA_K = require('../../../07-互动工具/_shared/chakra-knowledge.json').chakras;
const COLOR_K = require('../../../07-互动工具/_shared/color-knowledge.json').colors;
const ELEMENT_K = require('../../../07-互动工具/_shared/element-knowledge.json').elements;

// 工具CTA
const TOOL = {
  chakra: { url: '/tools/chakra-test/', text: 'Take the free Chakra Test', lead: 'Not sure which chakra to focus on?' },
  color: { url: '/tools/crystal-quiz/', text: 'Try the Crystal Quiz', lead: 'Not sure which color is right for you?' },
  element: { url: '/tools/element-test/', text: 'Take the Element Test', lead: 'Discover your dominant element —' },
};

// 差异化提示（每篇独特，供 AI 填占位时参考）
const CHAKRA_BEYOND = {
  root: 'barefoot walking, mountain pose, root vegetables, drumming, slow breathing',
  sacral: 'dance, creative journaling, hip-opening yoga, water rituals, orange foods',
  'solar-plexus': 'core breathwork, morning sunlight, warrior pose, goal setting, yellow foods',
  heart: 'loving-kindness meditation, chest-opening yoga, rose oil, gratitude practice, green foods',
  throat: 'humming, chanting, journaling, neck stretches, blue foods/herbal tea',
  'third-eye': 'dream journaling, screen breaks, alternate nostril breathing, dark quiet meditation',
  crown: 'silence, prayer-like reflection, meditation, digital minimalism, gentle breathwork',
};
const COLOR_FOCUS = {
  black: { use: 'carrying, home & workspace, meditation, doorway/desk placement', scene: 'Boundaries and Protection' },
  pink: { use: 'jewelry, self-care ritual, bedside placement, heart meditation', scene: 'Self-Love and Relationships' },
  green: { use: 'heart meditation, garden/plant care, jewelry, workspace', scene: 'Growth, Renewal, Heart-Centered Habits' },
  blue: { use: 'throat meditation, jewelry near throat, journaling desk, calming sleep routine', scene: 'Communication and Calm Expression' },
  red: { use: 'morning routine, carrying, jewelry, action ritual', scene: 'Motivation, Passion, Action' },
  orange: { use: 'creative workspace, jewelry, sacral meditation, movement', scene: 'Creativity and Emotional Warmth' },
  yellow: { use: 'morning routine, desk/workspace, confidence ritual, solar plexus meditation', scene: 'Confidence and Personal Power' },
  purple: { use: 'meditation, bedside, dream journaling, spiritual altar', scene: 'Intuition and Spiritual Reflection' },
  white: { use: 'cleansing rituals, meditation space, bedside, new-beginning ritual', scene: 'Clarity, Cleansing, New Beginnings' },
  brown: { use: 'desk placement, grounding meditation, garden, carrying', scene: 'Stability and Everyday Grounding' },
  grey: { use: 'transition rituals, desk, meditation, calm-focus practice', scene: 'Transition, Neutrality, Calm Focus' },
  'blue-green': { use: 'throat/heart meditation, journaling, bedside, communication ritual', scene: 'Emotional Communication' },
};
const ELEMENT_FOCUS = {
  fire: { use: 'morning ritual, candle-safe altar (safe distance), confidence jewelry', zodiac: 'Aries→Carnelian,Red Jasper; Leo→Sunstone,Citrine; Sagittarius→Tiger Eye,Labradorite', regulate: 'Boost(lack drive):Carnelian,Sunstone,Garnet; Channel(creativity):Citrine,Fire Agate; Calm excess:Smoky Quartz,Hematite; Build confidence:Tiger Eye,Sunstone' },
  earth: { use: 'grounding meditation, desk placement, garden/plant altar, body-based rituals', zodiac: 'Taurus→Rose Quartz,Emerald; Virgo→Moss Agate,Amazonite; Capricorn→Garnet,Onyx', regulate: 'Grounding:Hematite,Smoky Quartz,Black Tourmaline; Stability:Red Jasper,Moss Agate; Abundance:Green Aventurine,Pyrite,Jade; Patience:Moss Agate,Unakite' },
  air: { use: 'breathwork, journaling, communication practice, study/workspace', zodiac: 'Gemini→Aquamarine,Citrine; Libra→Lapis Lazuli,Rose Quartz; Aquarius→Amethyst,Labradorite', regulate: 'Mental clarity:Fluorite,Selenite; Communication:Aquamarine,Lapis; Ideas:Citrine,Labradorite; Focus:Fluorite,Clear Quartz' },
  water: { use: 'emotional reflection, moon/water symbolism, bedside ritual, self-compassion meditation', zodiac: 'Cancer→Moonstone,Rose Quartz; Scorpio→Malachite,Obsidian; Pisces→Aquamarine,Amethyst', regulate: 'Emotional depth:Moonstone,Aquamarine; Intuition:Labradorite,Amethyst; Calm:Blue Lace Agate,Angelite; Flow:Aquamarine,Clear Quartz' },
};

const args = process.argv.slice(2);
const get = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : null; };
const slugArg = get('slug'), typeArg = get('type');
let list = data.spokes.slice();
if (slugArg) list = list.filter(s => s.slug === slugArg);
if (typeArg) list = list.filter(s => s.type === typeArg);

function stoneData(slug) {
  const s30 = stones30[slug] || {};
  const a = ATTR[slug + '-meaning'] || {};
  return { slug, name: s30.name || slug, overview: a.overview || {}, safety: a.safety || {}, meaning: s30.meaning || ('/gemstone/' + slug + '-meaning/'), shop: s30.shop || ('/product-category/' + slug + '-crystals/') };
}
// Best way to use 从 Forms 参数化
function bestUse(forms) {
  const f = (forms || '').toLowerCase();
  if (/bracelet|pendant|ring|necklace|earring|anklet/.test(f)) return 'Wear as jewelry';
  if (/tumbled|palm|worry|pocket/.test(f)) return 'Carry or hold in meditation';
  if (/cluster|tower|raw|point|sphere/.test(f)) return 'Place in your space';
  return 'Wear, carry, or place in your space';
}
function ctaBlock(sp, lead) {
  const t = TOOL[sp.type];
  return `<p class="tool-cta"><em>${lead || t.lead} <a href="${t.url}">${t.text} ↗</a></em></p>`;
}
function care(c) {
  return (c.safety && c.safety.water === false) ? '\n<p><strong>Care note:</strong> Keep dry — sensitive to water.</p>' : '';
}

// 字段卡片（按 type）
function card(c, sp) {
  const o = c.overview || {};
  const use = bestUse(o.Forms);
  const rows = [];
  if (sp.type === 'chakra') {
    if (o.Chakra) rows.push(['Chakra', o.Chakra]);
    if (o.Color) rows.push(['Color', o.Color]);
    if (o.Element) rows.push(['Element', o.Element]);
    if (o['Best for']) rows.push(['Best for', o['Best for']]);
    rows.push(['Best way to use', use]);
    if (o.Zodiac) rows.push(['Zodiac', o.Zodiac]);
  } else if (sp.type === 'color') {
    if (o.Color) rows.push(['Color', o.Color]);
    rows.push(['Meaning', COLOR_K[sp.slug] ? COLOR_K[sp.slug].symbolism : `{{AI_MEANING_${c.slug}}}`]);
    if (o['Best for']) rows.push(['Best for', o['Best for']]);
    if (o.Chakra) rows.push(['Chakra', o.Chakra]);
    if (o.Element) rows.push(['Element', o.Element]);
    rows.push(['Best way to use', use]);
  } else { // element
    if (o.Element) rows.push(['Element', o.Element]);
    rows.push(['Elemental link', `{{AI_LINK_${c.slug}}}`]); // AI: 为什么属此元素
    rows.push(['Element action', `{{AI_ACTION_${c.slug}}}`]); // AI: Amplifies/Balances/Grounds
    if (o.Color) rows.push(['Color', o.Color]);
    if (o.Chakra) rows.push(['Chakra', o.Chakra]);
    if (o.Zodiac) rows.push(['Zodiac', o.Zodiac]);
    if (o['Best for']) rows.push(['Best for', o['Best for']]);
    rows.push(['Best way to use', use]);
  }
  rows.push(['Affirmation', `{{AI_AFFIRM_${c.slug}}}`]);
  const fields = rows.filter(r => r[1] && !r[1].startsWith('{{') || r[1].startsWith('{{AI_')).map(r => `<p><strong>${r[0]}:</strong> ${r[1]}</p>`).join('\n');
  return `<h3>${c.name}</h3>\n${fields}\n<p>{{AI_DESC_${c.slug}}}</p>\n<p><a href="${c.meaning}">Read full ${c.name} meaning →</a></p>${care(c)}`;
}

// M2 facts（引用 knowledge）
function m2facts(sp) {
  if (sp.type === 'chakra') { const k = CHAKRA_K[sp.slug]; return `<p><strong>Quick facts:</strong> Sanskrit <em>${k.sanskrit}</em> · Position: ${k.position} · Color: ${k.color} · Element: ${k.element}. <strong>Balanced:</strong> ${k.balanced}. <strong>Out of balance:</strong> ${k.imbalanced}.</p>`; }
  if (sp.type === 'color') { const k = COLOR_K[sp.slug]; return `<p><strong>Quick facts:</strong> Symbolism: ${k.symbolism}. Psychology: ${k.psychology}. Associated chakra: ${k.chakra}, element: ${k.element}.</p>`; }
  const k = ELEMENT_K[sp.slug]; return `<p><strong>Quick facts:</strong> Traits: ${k.traits}. <strong>Balanced:</strong> ${k.balanced}. <strong>Out of balance:</strong> ${k.imbalanced}. Western zodiac: ${k.zodiac}. Feng Shui: ${k.fengshui}.</p>`;
}
function dimLabel(sp) { return sp.type === 'chakra' ? `the ${sp.name}` : sp.type === 'element' ? `the ${sp.name} Element` : sp.name; }

let made = 0; const index = [];
for (const sp of list) {
  const crystals = sp.crystals.map(stoneData);
  const dt = dimLabel(sp);
  const m1 = `<h2>Quick Answer: Best Crystals for ${dt}</h2>\n<p>The best crystals for ${dt} include ${crystals.slice(0, 3).map(c => c.name).join(', ')}, traditionally used in mindfulness and spiritual practices. <em>Crystal properties are complementary wellness tools, not medical treatments.</em></p>`;
  const m3 = `<h2>${crystals.length} Best Crystals for ${dt}</h2>\n` + crystals.map(c => card(c, sp)).join('\n');
  const m2 = `{{AI_M2_UNDERSTANDING}}\n${m2facts(sp)}`;

  // Shop + 内链（通用）
  const shop = `<h2>Shop ${sp.name} ${sp.type === 'chakra' ? 'Chakra' : ''} Crystals: What to Look For</h2>\n<ul>\n${crystals.slice(0, 6).map(c => `<li><a href="${c.shop}">Shop ${c.name}</a></li>`).join('\n')}</ul>`;
  const sib = data.spokes.filter(s => s.type === sp.type && s.slug !== sp.slug).slice(0, 6).map(s => `<li><a href="${s.url}">${s.name} ${s.type === 'chakra' ? 'Chakra' : ''}Crystals</a></li>`).join('\n');
  const link = `<h2>Explore More Crystal Guides</h2>\n<ul>\n<li><a href="/gemstones/">Crystal Guide Index</a></li>\n${sib}\n</ul>`;

  let content, diffHints = {};
  if (sp.type === 'chakra') {
    diffHints = { beyond: CHAKRA_BEYOND[sp.slug] };
    content = [m1, m2 + '\n' + ctaBlock(sp), m3, '{{AI_M4_CHOOSE}}', '{{AI_M5_HOW_TO_USE}}\n' + ctaBlock(sp), '{{AI_M6_BEYOND}}', '{{AI_M7_FAQ}}', shop, link].join('\n\n');
  } else if (sp.type === 'color') {
    const f = COLOR_FOCUS[sp.slug];
    diffHints = { useFocus: f.use, scene: f.scene };
    content = [m1, m2 + '\n' + ctaBlock(sp), '{{AI_M2_5_IDENTIFY}}', m3, '{{AI_M4_MATRIX}}', '{{AI_M5_USE}}', '{{AI_M6_SCENE}}', '{{AI_M7_GLANCE}}', '{{AI_M8_FAQ}}', shop, link].join('\n\n');
  } else { // element
    const f = ELEMENT_FOCUS[sp.slug];
    diffHints = { useFocus: f.use, zodiac: f.zodiac, regulate: f.regulate };
    content = [m1, m2 + '\n' + ctaBlock(sp, 'Not sure if your ' + sp.name + ' is balanced? '), m3, '{{AI_M4_REGULATE}}', '{{AI_M5_SAFE}}', '{{AI_M6_ZODIAC}}', '{{AI_M7_FENGSHUI}}', '{{AI_M8_FAQ}}', shop, link].join('\n\n');
  }

  const article = {
    title: sp.title, slug: sp.slug, url: sp.url, type: sp.type, dimName: sp.name, kw: sp.kw,
    rank_math_title: sp.title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: sp.kw, excerpt: '{{AI_EXCERPT}}',
    stoneSlugs: sp.crystals, stoneCount: crystals.length,
    crystals: crystals.map(c => ({ slug: c.slug, name: c.name, meaning: c.meaning, shop: c.shop })),
    toolCta: TOOL[sp.type], diffHints, content,
  };
  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', sp.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: sp.slug, type: sp.type, url: sp.url, title: sp.title, stoneCount: crystals.length });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ v3 骨架 ${made} 篇（新字段+How to Identify+diffHints+knowledge引用）`);
index.slice(0, 3).forEach(a => console.log(`  [${a.type}] ${a.slug} | ${a.stoneCount}颗`));
