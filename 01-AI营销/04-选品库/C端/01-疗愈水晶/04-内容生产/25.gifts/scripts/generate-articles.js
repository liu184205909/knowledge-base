/**
 * Gift listicle 文章骨架生成器（44 篇）
 * 读 configs/gift-topics.json → listicle 骨架（Quick Picks + N 礼物卡 + by intention + 东方锚点 + How to Choose + FAQ + Related）
 * 占位符 {{AI_*}} 由 fill-ai-batch.js 调 AI 填充，fill-from-placeholders.js 回填
 * 水晶寓意取 07-互动工具/_shared/crystal-attributes.json（390 库），Shop 类目映射复用 fengshui CAT_MAP（wc/store 验证 2026-07-16）
 * 概念页（subcategory=concept）用定义型结构（Quick Answer + What Is + FAQ），非概念页用 listicle
 * 用法：node generate-articles.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const TOPICS = require('../configs/gift-topics.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

// slug 归一化（gift-topics 用法 → 390 库/ATTR key 惯例，对齐 fengshui）
const NORM = { 'clear-quartz': 'quartz', 'green-aventurine': 'aventurine', 'green-jade': 'jade', 'tigers-eye': 'tiger-eye' };
function norm(s) { return NORM[s] || s; }

// Shop 产品类目（wc/store 验证，复用 fengshui）；无映射 → /shop/?s= 搜索降级（shop-cta-no-deadlink-rule）
const CAT_MAP = { citrine: 'citrine-crystals', 'black-tourmaline': 'black-tourmaline-crystals', pyrite: 'pyrite-crystals', jade: 'jade-crystals', quartz: 'clear-quartz-crystals', 'rose-quartz': 'rose-quartz-crystals', amethyst: 'amethyst-crystals', aventurine: 'aventurine-crystals', 'tiger-eye': 'tiger-eye-crystals', carnelian: 'carnelian-crystals', obsidian: 'obsidian-crystals', moonstone: 'rainbow-moonstone-crystals', hematite: 'hematite-crystals', lapis: 'lapis-lazuli-crystals', malachite: 'malachite-crystals', selenite: 'selenite-crystals', fluorite: 'rainbow-fluorite-crystals', 'red-jasper': 'red-jasper-crystals', turquoise: 'turquoise-crystals', labradorite: 'labradorite-crystals', shungite: 'shungite-crystals', bloodstone: 'bloodstone-crystals', rhodonite: 'rhodonite-crystals', amazonite: 'amazonite-crystal' };
const DISPLAY = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', jade: 'Green Jade', aventurine: 'Green Aventurine', 'tiger-eye': "Tiger's Eye" };

function stoneName(slug) { const s = norm(slug); if (DISPLAY[s]) return DISPLAY[s]; const a = ATTR[s + '-meaning']; if (a && a.title) { const t = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').replace(/\s*Meaning.*$/i, '').trim(); if (t) return t; } return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function shopCTA(slug) { const s = norm(slug); const cat = CAT_MAP[s]; const url = cat ? `/product-category/${cat}/` : `/shop/?s=${s}`; return `<p><a href="${url}">Shop ${stoneName(slug)} Jewelry</a></p>`; }
function meaningLink(slug) { const s = norm(slug); return `<a href="/${s}-meaning/">${stoneName(slug)}</a>`; }
function shopUrl(slug) { const s = norm(slug); const cat = CAT_MAP[s]; return cat ? `/product-category/${cat}/` : `/shop/?s=${s}`; }

// 按 occasion/recipient/intention 的礼物水晶池（只用 390 库可靠水晶；content-must-have-evidence）
const GIFT_POOL = {
  love: ['rose-quartz', 'rhodonite', 'moonstone', 'malachite', 'rhodochrosite'],
  protection: ['black-tourmaline', 'obsidian', 'hematite', 'shungite', 'tiger-eye'],
  prosperity: ['citrine', 'pyrite', 'aventurine', 'jade', 'tiger-eye'],
  calm: ['amethyst', 'howlite', 'selenite', 'lepidolite', 'celestite'],
  her: ['rose-quartz', 'moonstone', 'amethyst', 'rhodonite', 'malachite', 'labradorite'],
  women: ['rose-quartz', 'amethyst', 'moonstone', 'aventurine', 'labradorite'],
  him: ['tiger-eye', 'hematite', 'obsidian', 'pyrite', 'black-tourmaline', 'bloodstone'],
  men: ['tiger-eye', 'hematite', 'obsidian', 'pyrite', 'bloodstone', 'shungite'],
  mom: ['rose-quartz', 'aventurine', 'moonstone', 'amethyst', 'jade'],
  wife: ['rose-quartz', 'rhodonite', 'moonstone', 'malachite', 'amethyst'],
  couples: ['rose-quartz', 'rhodonite', 'moonstone', 'malachite'],
  'crystal-lovers': ['labradorite', 'selenite', 'quartz', 'fluorite', 'malachite'],
  anniversary: ['rose-quartz', 'quartz', 'amethyst', 'rhodonite', 'moonstone', 'malachite'],
  '15th-anniversary': ['quartz', 'rose-quartz', 'amethyst', 'moonstone'],
  wedding: ['rose-quartz', 'moonstone', 'quartz', 'rhodonite', 'aventurine'],
  housewarming: ['black-tourmaline', 'selenite', 'citrine', 'quartz', 'aventurine'],
  home: ['black-tourmaline', 'selenite', 'citrine', 'quartz', 'rose-quartz'],
  'new-home': ['black-tourmaline', 'selenite', 'citrine', 'aventurine', 'jade'],
  'tea-lovers': ['quartz', 'amethyst', 'rose-quartz', 'carnelian', 'howlite'],
  travelers: ['black-tourmaline', 'moonstone', 'aquamarine', 'tiger-eye', 'labradorite'],
  doctors: ['amethyst', 'howlite', 'selenite', 'celestite', 'quartz'],
  'senior-women': ['rose-quartz', 'amethyst', 'aventurine', 'moonstone', 'jade'],
  knitters: ['rose-quartz', 'amethyst', 'howlite', 'celestite', 'fluorite'],
  hikers: ['tiger-eye', 'bloodstone', 'black-tourmaline', 'carnelian', 'hematite'],
  adults: ['rose-quartz', 'aventurine', 'quartz', 'aquamarine', 'moonstone'],
  veterans: ['tiger-eye', 'bloodstone', 'black-tourmaline', 'hematite', 'obsidian'],
  easter: ['rose-quartz', 'aventurine', 'quartz', 'aquamarine', 'moonstone'],
  'valentines-day': ['rose-quartz', 'rhodonite', 'garnet', 'moonstone', 'malachite'],
  'mothers-day': ['rose-quartz', 'aventurine', 'moonstone', 'amethyst', 'jade'],
  'veterans-day': ['tiger-eye', 'bloodstone', 'black-tourmaline', 'hematite', 'obsidian'],
  ideas: ['rose-quartz', 'amethyst', 'quartz', 'citrine', 'labradorite'],
  budget: ['quartz', 'amethyst', 'rose-quartz', 'citrine', 'howlite', 'aventurine'],
  default: ['rose-quartz', 'amethyst', 'quartz', 'citrine', 'black-tourmaline', 'moonstone'],
};

// 标题里的人群/场景短语
const WHO = { her: 'Her', him: 'Him', women: 'Women', men: 'Men', mom: 'Mom', wife: 'Your Wife', couples: 'Couples', 'crystal-lovers': 'Crystal Lovers', 'tea-lovers': 'Tea Lovers', travelers: 'Travelers', doctors: 'Doctors & Healthcare Workers', 'senior-women': 'Senior Women', knitters: 'Knitters', hikers: 'Hikers & Outdoor Lovers', veterans: 'Veterans', adults: 'Adults', 'crystal-lovers': 'Crystal Lovers' };
const OCC_WHO = { anniversary: 'Anniversaries', '15th-anniversary': 'a 15th Anniversary', wedding: 'Newlyweds', 'wedding-anniversary': 'Wedding Anniversaries', housewarming: 'a New Home', home: 'the Home', 'new-home': 'a New Home', love: 'Love & Relationships', protection: 'Protection', prosperity: 'Prosperity', calm: 'Calm & Stress Relief', budget: 'Under $50', easter: 'Easter', 'valentines-day': "Valentine's Day", 'mothers-day': "Mother's Day", 'veterans-day': 'Veterans Day' };

// 东方锚点提示（给 AI 的方向，AI 据此写东方段；独家差异化）
const EASTERN = {
  anniversary: 'Tie 15th=crystal to Eastern "yuan" (fated bond) & jade/rose quartz as relationship stones in Chinese/Indian tradition; frame as enduring bond, not guarantee.',
  '15th-anniversary': 'Traditional & modern anniversary lists both mark year 15 as crystal; add Eastern view of clear quartz (光/圆满) and rose quartz (姻缘) as enduring-love stones.',
  wedding: 'Eastern wedding stone traditions: jade (purity/endurance in Chinese culture), moonstone (Indian/Vedic love), rose quartz (姻缘石). Frame as cultural symbolism for reflection.',
  housewarming: 'Feng shui housewarming: black tourmaline by the door (镇宅/protection), citrine in the wealth corner (招财/abundance), selenite for clearing. BTB framing, not guarantees.',
  home: 'Feng shui for the home: placement by bagua area, elements. BTB tradition framing for intentional space.',
  'new-home': 'New home blessing across traditions: feng shui (镇宅), Indian vastu, selenite space-clearing. Cultural framing.',
  love: 'Eastern love stones: rose quartz (姻缘), moonstone (Vedic), rhodonite. Frame as traditional symbolism for relationships.',
  protection: 'Eastern protection stones: black tourmaline (风水镇宅), obsidian (佛教/道家), tiger eye. Frame as traditional protective symbolism.',
  prosperity: 'Eastern abundance stones: citrine (招财), pyrite, jade. BTB wealth-corner tradition (purple/amethyst). Frame as inviting abundance, not guaranteeing money.',
  calm: 'Eastern calming stones: amethyst (中医/禅修), howlite, selenite. Frame as traditional aids for settling attention.',
  default: 'Choose an accurate Eastern tradition (Tibetan/Indian/Chinese/七曜) relevant to this gift theme; frame as cultural symbolism for reflection, not cultural appropriation or guarantees.',
};

function selectCrystals(t) {
  const keys = [t.recipient, t.occasion, t.subcategory === 'by-intention' ? t.occasion : null].filter(Boolean);
  const pool = [];
  for (const k of keys) (GIFT_POOL[k] || []).forEach(s => { if (!pool.includes(s)) pool.push(s); });
  if (pool.length < 5) GIFT_POOL.default.forEach(s => { if (!pool.includes(s)) pool.push(s); });
  // 主力（topics.crystals 归一化）置顶
  const main = (t.crystals || []).map(norm).filter(s => ATTR[s + '-meaning']);
  const merged = []; [...main, ...pool].forEach(s => { const n = norm(s); if (ATTR[n + '-meaning'] && !merged.includes(n)) merged.push(n); });
  return merged.slice(0, 6);
}

function faqSeeds(t) {
  const who = t.recipient ? WHO[t.recipient] : (OCC_WHO[t.occasion] || 'Someone');
  const seeds = [
    `What is a meaningful crystal gift for ${who.toLowerCase()}?`,
    `How do I choose the right crystal gift?`,
    `How do I cleanse a crystal before gifting it?`,
    `What does it mean to give someone a crystal?`,
  ];
  if (t.occasion === '15th-anniversary' || t.occasion === 'anniversary') seeds.push('Which crystal is traditionally given for a 15th anniversary?');
  if (t.occasion === 'housewarming' || t.occasion === 'home' || t.occasion === 'new-home') seeds.push('Which crystals bring good energy to a new home?');
  if (t.recipient === 'men' || t.recipient === 'him') seeds.push('Which crystals do men actually like to wear?');
  if (t.subcategory === 'budget') seeds.push('Can I find a meaningful crystal gift under $50?');
  return seeds.slice(0, 6);
}

function buildListicle(t, crystals) {
  const n = crystals.length;
  const who = t.recipient ? WHO[t.recipient] : (OCC_WHO[t.occasion] || 'Loved Ones');
  const title = `${n} Best Crystal Gifts for ${who} (by Stone Meaning)`;
  const subj = who;
  const quickRows = crystals.map((c, i) => `<tr><td>${i + 1}</td><td>${stoneName(c)}</td><td>{{AI_QUICK_${i + 1}}}</td></tr>`).join('\n');
  const quickPicks = `<h2>Quick Picks</h2>\n<table class="quick-picks"><tr><th>#</th><th>Crystal</th><th>Best For</th></tr>\n${quickRows}\n</table>`;
  const intro = `<h2>Why Crystals Make Meaningful Gifts for ${subj}</h2>\n{{AI_INTRO}}`;
  const gifts = [`<h2>${title}</h2>`, `{{AI_GIFTS_INTRO}}`].concat(
    crystals.map((c, i) => [
      `<h3>${i + 1}. ${stoneName(c)}</h3>`,
      `<p><em>Meaning:</em> {{AI_GIFT_${i + 1}_MEANING}}</p>`,
      `<p><em>Why it's a great gift for ${subj.toLowerCase()}:</em> {{AI_GIFT_${i + 1}_WHY}}</p>`,
      `<p><em>How to gift it:</em> {{AI_GIFT_${i + 1}_HOWTO}}</p>`,
      `<p>Read more: ${meaningLink(c)} meaning &nbsp;·&nbsp; <a href="${shopUrl(c)}">Shop ${stoneName(c)} Jewelry</a></p>`,
    ].join('\n'))
  ).join('\n\n');
  const byIntention = `<h2>By Intention</h2>\n{{AI_BY_INTENTION}}`;
  const eastern = `<h2>Eastern Traditions</h2>\n{{AI_EASTERN}}`;
  const howToChoose = `<h2>How to Choose the Right Crystal Gift</h2>\n{{AI_HOW_TO_CHOOSE}}`;
  const faq = `<h2>Frequently Asked Questions</h2>\n${faqSeeds(t).map((q, i) => `<h3>${q}</h3>\n{{AI_FAQ_ANSWER_${i + 1}}}`).join('\n')}`;
  const related = `<h2>Related Gift Guides</h2>\n<ul>{{AI_RELATED}}</ul>`;
  const gentle = `<p class="gentle-note"><em>Crystals are meaningful gifts chosen for their traditional symbolism and beauty — a thoughtful way to mark an intention or occasion, not a guarantee of specific outcomes. Always pair the sentiment with the person.</em></p>`;
  const content = [`<h1>${title}</h1>`, quickPicks, intro, gifts, byIntention, eastern, howToChoose, faq, related, gentle].join('\n\n');
  return { title, content };
}

function buildConcept(t) {
  const title = t.title;
  const subj = title.replace(/\?.*/, '').trim();
  const quickAnswer = `<div class="quick-answer"><p>{{AI_QUICK_ANSWER}}</p></div>`;
  const whatIs = `<h2>${subj}?</h2>\n{{AI_WHAT_IS}}`;
  const explained = `<h2>${subj}, Explained</h2>\n{{AI_EXPLAINED}}`;
  const crystals = (t.crystals || []).map(norm).slice(0, 3);
  const crystalsHtml = crystals.length ? `<h2>Crystals to Gift</h2>\n<ul>\n${crystals.map(c => `<li>${meaningLink(c)} — {{AI_CRYSTAL_${norm(c).toUpperCase().replace(/-/g, '_')}}}}</li>`).join('\n')}\n</ul>\n${crystals.map(shopCTA).join('\n')}` : '';
  const faq = `<h2>Frequently Asked Questions</h2>\n${faqSeeds(t).map((q, i) => `<h3>${q}</h3>\n{{AI_FAQ_ANSWER_${i + 1}}}`).join('\n')}`;
  const related = `<h2>Related Gift Guides</h2>\n<ul>{{AI_RELATED}}</ul>`;
  const gentle = `<p class="gentle-note"><em>Crystal gifting draws on cultural symbolism and tradition — a meaningful gesture, not a guarantee of outcomes.</em></p>`;
  const content = [`<h1>${title}</h1>`, quickAnswer, whatIs, explained, crystalsHtml, faq, related, gentle].filter(Boolean).join('\n\n');
  return { title, content, crystals };
}

fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
let made = 0; const index = []; const missing = [];
for (const t of TOPICS.topics) {
  const isConcept = t.subcategory === 'concept';
  let title, content, crystals;
  if (isConcept) { const b = buildConcept(t); title = b.title; content = b.content; crystals = b.crystals || []; }
  else { crystals = selectCrystals(t); if (crystals.length < 3) missing.push(`${t.slug}: only ${crystals.length} crystals`); const b = buildListicle(t, crystals); title = b.title; content = b.content; }

  const easternKey = EASTERN[t.occasion] ? t.occasion : 'default';
  const article = {
    title, slug: t.slug, url: `/${t.slug}/`, page_type: isConcept ? 'concept' : 'listicle',
    recipient: t.recipient, occasion: t.occasion, keyword: t.keyword, priority: t.priority, subcategory: t.subcategory,
    crystals, eastern_note: EASTERN[easternKey],
    faq_seeds: faqSeeds(t),
    rank_math_title: title, rank_math_description: '{{AI_META_DESC}}', rank_math_focus_keyword: t.keyword, excerpt: '{{AI_EXCERPT}}',
    images: { hero: { file: `images/gifts/hero-${t.slug}.webp`, alt: `${title.replace(/:.*/, '')} — crystal gift guide`, source_type: 'gift-hero' } },
    content,
  };
  fs.writeFileSync(path.join(DIR, 'articles', t.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: t.slug, title, subcategory: t.subcategory, priority: t.priority, page_type: article.page_type });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Gift 文章骨架生成 → articles/`);
if (missing.length) console.log(`⚠️ 水晶不足预警:\n  ${missing.join('\n  ')}`);
