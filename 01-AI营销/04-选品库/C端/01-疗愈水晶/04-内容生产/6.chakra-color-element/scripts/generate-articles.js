/**
 * chakra/color/element spoke 参数化骨架生成器(23篇)
 * spoke-data.json + stones30 + ATTR → 11模块骨架(参数化M1/M2.5/M3/M8/M10 + 占位M2/M4/M5/M6/M9)
 * 占位 {{AI_XX}} 待 workflow 填充
 * 用法：node generate-articles.js --slug=root  | --type=chakra | (全23篇)
 * 输出：../articles/{slug}.json + 更新 ../articles-index.json
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(DIR, 'spoke-data.json'), 'utf8'));
const stones30 = require('../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json').stones;
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const args = process.argv.slice(2);
const get = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : null; };
const slugArg = get('slug'), typeArg = get('type');
let list = data.spokes.slice();
if (slugArg) list = list.filter(s => s.slug === slugArg);
if (typeArg) list = list.filter(s => s.type === typeArg);

function stoneData(slug) {
  const s30 = stones30[slug] || {};
  const a = ATTR[slug + '-meaning'] || {};
  return {
    slug, name: s30.name || slug,
    overview: a.overview || {}, safety: a.safety || {},
    meaning: s30.meaning || ('/gemstone/' + slug + '-meaning/'),
    shop: s30.shop || ('/product-category/' + slug + '-crystals/'),
  };
}

// 维度知识类型化
function dimTitle(sp) {
  if (sp.type === 'chakra') return `the ${sp.name}`;
  if (sp.type === 'element') return `the ${sp.name} Element`;
  return sp.name; // color
}
function dimKw(sp) { return sp.kw; }

let made = 0;
const index = [];
for (const sp of list) {
  const crystals = sp.crystals.map(stoneData);
  const dt = dimTitle(sp);
  const urlSlug = sp.url.replace(/\//g, '');

  // M1 Quick Answer(参数化)
  const m1 = `<h2>Quick Answer: Best Crystals for ${dt}</h2>\n<p>Looking for the best crystals for ${dt}? ${crystals.slice(0, 3).map(c => c.name).join(', ')} ${crystals.length > 3 ? 'and more' : ''} are among the most popular choices, each traditionally associated with ${sp.type === 'chakra' ? 'balancing and activating this energy center' : sp.type === 'color' ? 'the qualities this color represents' : 'the grounding, energetic nature of this element'}. Below we explain what each one does and how to use it. <em>Crystal properties are complementary wellness tools, not medical treatments.</em></p>`;

  // M2 Understanding(占位,维度知识)
  const m2 = `{{AI_M2_UNDERSTANDING}}`;

  // M2.5 How We Chose(参数化)
  const m25 = `<h2>How We Chose These Crystals</h2>\n<p>We selected these ${crystals.length} crystals based on their traditional association with ${dt}, mineral properties, and practical popularity. Each is commonly available as jewelry or tumbled stones, making them easy to incorporate into daily life.</p>`;

  // M3 推荐列表(参数化每颗框架 + AI描述占位)
  const m3 = `<h2>${crystals.length} Best Crystals for ${dt}</h2>\n` + crystals.map(c => {
    const bestFor = c.overview['Best for'] || '';
    const forms = (c.overview.Forms || '').split(/[,;]/)[0].trim();
    const care = c.safety && c.safety.water === false ? '<p><strong>Care note:</strong> Keep dry — this stone is sensitive to water and should not be cleansed by soaking.</p>' : '';
    return `<h3>${c.name}</h3>\n<p><strong>Best for:</strong> ${bestFor}</p>\n<p><strong>How to use it:</strong> ${forms ? 'Wear as ' + forms.toLowerCase() : 'Carry or wear daily'}; <a href="${c.meaning}">read full ${c.name} meaning</a>.</p>\n<p>{{AI_DESC_${c.slug}}}</p>${care}`;
  }).join('\n');

  // M4 对比表(占位)
  const m4 = `{{AI_M4_CHOOSE_TABLE}}`;
  // M5 使用方法(占位)
  const m5 = `{{AI_M5_HOW_TO_USE}}`;
  // M6 组合(占位,跨维度)
  const m6 = `{{AI_M6_COMBINATIONS}}`;
  // M7 细分(占位可选)
  const m7 = `{{AI_M7_SITUATIONS}}`;

  // M8 Shop(参数化, 链接形式)
  const m8 = `<h2>Shop ${sp.name} ${sp.type === 'chakra' ? 'Chakra' : ''} Crystals</h2>\n<p>Explore jewelry and stones from this guide:</p>\n<ul>\n${crystals.slice(0, 6).map(c => `<li><a href="${c.shop}">Shop ${c.name}</a></li>`).join('\n')}</ul>`;

  // M9 FAQ(占位)
  const m9 = `{{AI_M9_FAQ}}`;

  // M10 内链(参数化, 链到其他维度 + gemstones hub)
  const otherChakras = data.spokes.filter(s => s.type === 'chakra' && s.slug !== sp.slug).slice(0, 6).map(s => `<li><a href="${s.url}">${s.name} Crystals</a></li>`).join('');
  const m10 = `<h2>Explore More Crystal Guides</h2>\n<ul>\n<li><a href="/gemstones/">Crystal Guide Index</a></li>\n${otherChakras}\n</ul>\n<p><em>Explore our full <a href="/gemstones/">crystal encyclopedia</a> for deeper dives into each stone.</em></p>`;

  const content = [m1, m2, m25, m3, m4, m5, m6, m7, m8, m9, m10].join('\n\n');

  const article = {
    title: sp.title,
    slug: sp.slug,
    url: sp.url,
    type: sp.type,
    dimName: sp.name,
    kw: sp.kw,
    rank_math_title: sp.title,
    rank_math_description: `{{AI_META_DESC}}`,
    rank_math_focus_keyword: sp.kw,
    excerpt: `{{AI_EXCERPT}}`,
    stoneSlugs: sp.crystals,
    stoneCount: crystals.length,
    crystals: crystals.map(c => ({ slug: c.slug, name: c.name, meaning: c.meaning, shop: c.shop })),
    content,
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', sp.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: sp.slug, url: sp.url, type: sp.type, title: sp.title, kw: sp.kw, stoneCount: crystals.length });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇骨架生成 → articles/`);
index.slice(0, 5).forEach(a => console.log(`  [${a.type}] ${a.slug} | ${a.stoneCount}颗`));
if (made > 5) console.log(`  ... 共 ${made} 篇`);
