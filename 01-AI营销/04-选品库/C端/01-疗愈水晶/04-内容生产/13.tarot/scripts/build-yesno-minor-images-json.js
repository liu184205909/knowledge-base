/**
 * 建塔罗图片清单 json（是与否 100 篇 + Minor Top20 篇）
 * 仅建数据（slug + hero{prompt,file} + crystals[{slug,name}]），不调 moleapi
 * prompt 风格对齐既有 generate-scenario-images.js（站点塔罗 hero 一致性）
 * 水晶 slug 全带 -meaning 后缀对齐 390 库
 *
 * 用法: node build-yesno-minor-images-json.js
 * 输出:
 *   configs/articles-yesno-images.json  (100 篇)
 *   configs/articles-minor-images.json  (20 篇)
 */
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..');
const yn = require(path.join(DIR, 'configs/yes-no-knowledge.json'));
const minor = require(path.join(DIR, 'configs/minor-knowledge.json'));

// ---------- Rider-Waite 22 Major 标志性画面映射（业界通识）----------
const MAJOR_VISUAL = {
  'the-fool': 'a youthful figure poised at the edge of a cliff, a small white dog leaping at his heels, a white rose in his left hand and a wanderer\'s staff in his right, the sun high and bright behind the mountains',
  'the-magician': 'a magus standing before a table bearing a cup, sword, wand and pentacle, one hand raised with a wand toward the sky and the other pointing to the earth, an infinity symbol above his brow and a garden of roses and lilies before him',
  'the-high-priestess': 'a serene priestess seated between two pillars (one dark, one light), a scroll inscribed TORA on her lap, a solar cross at her breast, pomegranates behind her like a veil, a crescent moon at her feet',
  'the-empress': 'a crowned empress seated on a cushioned throne in a lush wheat field, twelve stars over her head, a scepter in her right hand, a shield bearing the Venus symbol at her feet, trees and a flowing stream behind her',
  'the-emperor': 'a bearded emperor seated on a stone throne adorned with ram heads, a golden scepter in his right hand and an orange globe under his left arm, his armor visible beneath his red robe, a barren mountain range behind him',
  'the-hierophant': 'a robed pontiff seated between two temple pillars, raising his right hand in blessing with two acolytes kneeling before him in tonsure, his triple crown gleaming, crossed keys at his feet',
  'the-lovers': 'a man and a woman beneath a winged angel with outspread wings and a radiant sun, the woman before a tree of apples with a serpent coiled around its trunk, the man before a tree of flaming torches, a luminous cloud-draped mountain behind',
  'the-chariot': 'a warrior in a crown of stars standing within a canopy-decked chariot drawn by two sphinxes (one black, one white) facing opposite directions, a crescent moon on his shoulders and a scepter in his hand, a walled city behind him',
  'strength': 'a serene woman in a flowing white robe gently closing the jaws of a golden-maned lion with her bare hands, an infinity symbol above her head, wildflowers and distant green mountains in the background',
  'the-hermit': 'an aged robed hermit standing on an icy peak, holding aloft a six-pointed lantern that glows with an inner star, his staff in his other hand, head bowed in contemplation',
  'wheel-of-fortune': 'a great spoked wheel inscribed with the letters TARO and Hebrew letters, a sphinx perched atop it, a snake descending on the left and Anubis rising on the right, the four winged creatures of the evangelists reading books in the corners',
  'justice': 'a crowned sovereign seated on a stone throne between two pillars, holding an upright sword in her right hand and balanced scales in her left, a purple veil draped behind her',
  'the-hanged-man': 'a serene figure suspended upside down by one ankle from a T-shaped gallows, a radiant halo around his head, his free leg crossed behind the bound one, his hands behind his back, leafy green branches growing from the gallows wood',
  'death': 'a black-armored skeleton riding a pale white horse, bearing a banner emblazoned with a white rose, a fallen king at his feet, a bishop pleading, a child watching, and the sun rising between two towers in the distance',
  'temperance': 'a winged angel in a flowing white robe with a solar crown, standing with one foot in a pool and one on the rocks, pouring liquid between two golden cups, a path leading to twin peaks crowned with a glowing radiance',
  'the-devil': 'a horned goat-headed demon perched on a black pillar, an inverted pentagram above its brow, a chained naked man and woman at its feet with small horns and tails, a black cave and an inverted torch behind',
  'the-tower': 'a tall stone tower struck by a lightning bolt, its crown shattering into flames as two figures (one crowned) tumble from the windows, twenty-two flames shaped like Hebrew letters leaping around the impact',
  'the-star': 'a serene nude maiden kneeling at the edge of a pool, pouring water from two pitchers (one onto the land into a stream, one back into the pool), a great eight-pointed star above with seven smaller stars scattered around, a bird perched on a distant tree',
  'the-moon': 'a full moon with a radiant human face hanging between two towers, a crustacean crawling up from a pool in the foreground, a wolf and a dog howling on either side of a winding path, drops of dew falling like Hebrew yod letters',
  'the-sun': 'a radiant sun with a cheerful human face shining upon a naked joyful child riding a white horse, surrounded by a wall of green sunflowers, four sunflowers bending toward the child overhead',
  'judgment': 'a winged angel in a long trumpet sounding the call from a cloud, a cross-bearing banner streaming from the horn, naked figures (a man, a woman, and a child) rising with arms outstretched from rectangular graves in the mountains below',
  'the-world': 'a wreath of green enclosing a joyous dancer wrapped in a violet sash, holding two wands, surrounded in the corners by the four fixed creatures (lion, ox, eagle, angel), a vista of distant mountains within the wreath'
};

// ---------- 是与否 verdict → 符号/色彩映射 ----------
const VERDICT_MAP = {
  'strong-yes': {
    symbol: 'a large luminous green checkmark',
    color: 'emerald green',
    accent: 'fresh emerald-green and warm gold'
  },
  'conditional': {
    symbol: 'a large luminous golden question mark',
    color: 'amber gold',
    accent: 'warm amber-gold and soft yellow'
  },
  'strong-no': {
    symbol: 'a large luminous crimson cross (X)',
    color: 'crimson red',
    accent: 'deep crimson and warm gold'
  }
};

// ---------- 是与否 问题类型 → 图标映射 ----------
const QUESTION_ICON = {
  'love': 'a small luminous heart icon',
  'career': 'a small luminous briefcase icon',
  'decision': 'a small luminous forked-path icon',
  'timing': 'a small luminous clock icon',
  'move-or-stay': 'a small luminous house icon'
};

const QUESTION_LABEL = {
  'love': 'Love',
  'career': 'Career',
  'decision': 'Decision',
  'timing': 'Timing',
  'move-or-stay': 'Move or Stay'
};

// ---------- Minor 花色 → 元素色背景渐变 + 符号映射 ----------
const SUIT_MAP = {
  'wands': {
    element_color: 'a warm gradient of crimson, burnt-orange and ember-red flame tones',
    symbol: 'a living flourishing wand / staff wrapped in green leaves and small salamanders',
    accent: 'fiery crimson-orange and burnished gold'
  },
  'cups': {
    element_color: 'a cool gradient of deep blue, teal and luminous aqua water tones',
    symbol: 'an ornate golden chalice overflowing with light',
    accent: 'deep blue-teal and silver-white'
  },
  'swords': {
    element_color: 'a pale gradient of soft yellow, cream and dawn-grey wind tones',
    symbol: 'an upright silver sword with an ornate hilt piercing through a crown of clouds',
    accent: 'pale gold-yellow and clear silver-grey'
  },
  'pentacles': {
    element_color: 'a grounded gradient of moss-green, forest and warm umber-brown earth tones',
    symbol: 'a glowing golden pentacle coin engraved with a five-pointed star',
    accent: 'moss-green and earthy bronze-gold'
  }
};

// ---------- Minor 20 篇 Rider-Waite 画面映射 ----------
const MINOR_VISUAL = {
  'page-of-wands': 'a youth in an orange tunic standing in a barren desert landscape, holding a living wand upright, the salamander-lizard motif biting its own tail embroidered on his clothing, his curious gaze lifted toward the horizon',
  'knight-of-wands': 'a bold knight in armor-patterned robes riding a rearing horse, his wand raised high, tunic adorned with salamanders, charging across a desert of pyramids in the distance',
  'queen-of-wands': 'a confident queen seated on an ornate throne adorned with lions and sunflowers, a wand in one hand and a sunflower in the other, a black cat of self-possession curled at her feet, a barren desert behind her',
  'king-of-wands': 'a commanding king on a throne decorated with salamanders and lions, holding a flowering wand as a scepter, a fire-salamander crest on his cloak, his gaze fixed on a distant horizon',
  'page-of-cups': 'a gentle youth in a floral blue tunic standing at the seashore, holding a golden cup from which a small curious fish emerges like a message, the calm sea and distant ships behind him',
  'knight-of-cups': 'a romantic knight in fish-patterned armor riding a slow graceful white horse, holding aloft a cup as if offering a gift or proposal, crossing a barren riverbed under a soft sky',
  'king-of-cups': 'a calm bearded king on a stone throne adorned with dolphins and water motifs, holding a cup and a scepter, his throne floating upon a calm sea with a ship and a leaping fish behind, a stable wave on his right and a turbulent one on his left',
  'ace-of-wands': 'a single living hand emerging from a luminous cloud, holding a flourishing leafy wand upright, green leaves sprouting from its tip, a verdant valley and a castle in the distant landscape',
  'ace-of-cups': 'a single living hand emerging from a luminous cloud, holding an ornate overflowing golden chalice, five streams of water shaped like the letter W pouring onto a buttercup-dotted meadow, a dove bearing a wafer descending into the cup',
  'ace-of-swords': 'a single living right hand emerging from a luminous cloud, gripping an upright shining silver sword, a golden crown of victory suspended at its tip, jagged mountains carved beneath the blade and storm clouds clearing',
  'ace-of-pentacles': 'a single living hand emerging from a luminous cloud, offering a glowing golden pentacle coin engraved with a five-pointed star, a verdant garden and a flowering archway of white lilies and red roses beneath a distant pathway',
  'queen-of-swords': 'a clear-eyed queen seated on an ornate stone throne adorned with a butterfly and winged cherub, holding an upright sword in her right hand, her left hand raised in a gesture of reception, a bound figure on the ground before her and stormy clouds behind',
  'queen-of-pentacles': 'a nurturing queen seated on an ornate throne adorned with fruits, goats and cherubs, a glowing pentacle cradled in her lap, a rabbit at her feet, a lush landscape of greenery, mountains and a flowing stream behind her',
  'page-of-pentacles': 'a studious youth in earth-toned robes standing on a green meadow, holding up and gazing attentively at a golden pentacle coin, distant trees and a freshly furrowed field behind him',
  'king-of-pentacles': 'a robust king on a throne decorated with bull heads, grapes and carved trees, a golden pentacle resting on his knee and a scepter in his hand, his robe embroidered with grapevines, a flourishing field and castle behind him',
  'three-of-pentacles': 'a master mason, a monk and an architect gathered before an arched cathedral doorway examining a blueprint together, three pentacles mounted on the arch above, scaffolding and carved stone around them',
  'six-of-pentacles': 'a wealthy merchant in red robes holding a balance scale in one hand, distributing coins to two kneeling beggars from a bag of pentacles, three pentacles arranged in an arch above his head',
  'seven-of-pentacles': 'a patient farmer in blue leaning on his hoe, gazing up at a flourishing vine heavy with six pentacles arranged like a chandelier, one pentacle resting at his feet, a distant farmhouse and rolling fields behind',
  'eight-of-pentacles': 'a dedicated apprentice engraving a pentacle coin at a workbench, six finished pentacles stacked neatly beside him on the wall and one in progress in his hands, an arched window and a distant town behind',
  'nine-of-swords': 'a figure sitting bolt upright in bed, hands covering their weeping face, nine swords mounted in a row on the dark wall above the quilt decorated with zodiac and floral squares, a single bed and a window with a moon-and-stars quilt',
  'ten-of-swords': 'a still figure lying face down on the ground at dawn, ten swords driven across their back in a fan, a blood-red figure in the landscape, a distant river, mountains and a deep black sky with a single yellow sunrise breaking through',
  'two-of-wands': 'a nobleman in red robes standing on a castle parapet, holding a globe of the world in his right hand and a wand in his left, a second wand mounted beside him in a stone bracket, a distant sea, ships and coastline below'
};

// ---------- 通用站点风格尾段（对齐 generate-scenario-images.js）----------
const STYLE_TAIL = 'The composition is rendered in elegant luminous golden line work with a soft glow. Rich spiritual graphic design, sacred geometry motifs, deep indigo background harmonized with the accent palette, glowing light rays, floating luminous particles, symmetrical balanced composition, mystical contemplative Eastern-inspired Tibetan gallery atmosphere, highly detailed digital art, premium editorial quality, no text, no words, no letters.';

// ---------- 水晶 slug → 显示名 ----------
function crystalName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}

// =========================================================
// 任务 1：建 articles-yesno-images.json（100 篇）
// =========================================================
function buildYesNo() {
  const articles = fs.readdirSync(path.join(DIR, 'articles'))
    .filter(f => f.startsWith('is-') && f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
  const articleSet = new Set(articles);

  const result = {};
  let count = 0;
  const qmap = ['love', 'career', 'decision', 'timing', 'move-or-stay'];

  for (const c of yn.cards) {
    for (const q of qmap) {
      const slug = `is-${c.card}-yes-or-no-${q}`;
      if (!articleSet.has(slug)) continue; // 仅含已生产文章
      const v = c.verdicts[q];
      if (!v) continue;

      const verdictMeta = VERDICT_MAP[v.verdict];
      const iconMeta = QUESTION_ICON[q];
      const visual = MAJOR_VISUAL[c.card] || `the tarot card ${c.card}`;
      const cardName = c.card.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
      const archetype = c.archetype || '';

      const crystalSlug = v.crystal + '-meaning'; // 带 -meaning 后缀
      const cName = crystalName(v.crystal);

      const prompt = `A symbolic editorial illustration for the tarot card ${cardName} (${archetype}) interpreted in a Yes-or-No ${QUESTION_LABEL[q]} reading context. Central Rider-Waite imagery: ${visual}. To the upper right of the card visual, ${verdictMeta.symbol} rendered large, crisp and clearly legible in luminous ${verdictMeta.color}, signifying a ${v.verdict.replace('-', ' ')} verdict. ${iconMeta.charAt(0).toUpperCase() + iconMeta.slice(1)} glows softly near the upper left corner, marking the question domain. At the base of the composition, a single ${cName} crystal gemstone placed gracefully as the recommended stone. ${STYLE_TAIL}`;

      result[slug] = {
        hero: {
          prompt,
          file: `${slug}.webp`
        },
        verdict: v.verdict,
        question: q,
        card: c.card,
        crystals: [
          { slug: crystalSlug, name: cName }
        ]
      };
      count++;
    }
  }

  const out = {
    _meta: {
      purpose: '是与否 100 篇 hero 生图清单（slug 索引）',
      framework: '模板-Tarot-是与否框架.md',
      data_sources: [
        'configs/yes-no-knowledge.json (verdict + crystal)',
        'articles/is-{card}-yes-or-no-{question}.md (已生产 100 篇)'
      ],
      hero_prompt_spec: {
        size: '1536x1024 → sharp resize 1536x864 webp',
        style_alignment: 'scripts/generate-scenario-images.js (站点塔罗 hero 一致风格)',
        elements: [
          'Rider-Waite 牌标志性画面（22 Major 内置映射表）',
          'verdict 符号（strong-yes=绿色✓ / conditional=黄色? / strong-no=红色✗）',
          '问题类型图标（love=心 / career=公文包 / decision=分叉路 / timing=时钟 / move-or-stay=房子）',
          'best_overall 水晶 gemstone（底部）',
          'Eastern-inspired Tibetan 调性 + sacred geometry + deep indigo'
        ]
      },
      crystal_slug_rule: '全部带 -meaning 后缀对齐 390 库',
      total_articles: count
    },
    articles: result
  };

  fs.writeFileSync(path.join(DIR, 'configs/articles-yesno-images.json'), JSON.stringify(out, null, 2));
  return count;
}

// =========================================================
// 任务 2：建 articles-minor-images.json（20 篇）
// =========================================================
function buildMinor() {
  const articles = fs.readdirSync(path.join(DIR, 'articles'))
    .filter(f => f.startsWith('tarot-') && f.endsWith('-crystals.md'))
    .map(f => f.replace(/\.md$/, '').replace(/^tarot-/, '').replace(/-crystals$/, ''));
  const articleSet = new Set(articles);

  const result = {};
  let count = 0;

  for (const card of minor.cards) {
    if (!articleSet.has(card.slug)) continue; // 仅含已生产 20 篇

    const suitMeta = SUIT_MAP[card.suit];
    const visual = MINOR_VISUAL[card.slug] || `the Minor Arcana card ${card.name}`;
    const cardName = card.name;
    const archetype = card.archetype || card.court_archetype || '';

    // 5 角色水晶（全带 -meaning）
    const cr = card.crystals;
    const crystalsList = [
      { slug: cr.best_overall.slug, name: cr.best_overall.name, role: 'best_overall' },
      { slug: cr.best_upright.slug, name: cr.best_upright.name, role: 'best_upright' },
      { slug: cr.best_reversed.slug, name: cr.best_reversed.name, role: 'best_reversed' },
      { slug: cr.best_love.slug, name: cr.best_love.name, role: 'best_love' },
      { slug: cr.best_daily_wear.slug, name: cr.best_daily_wear.name, role: 'best_daily_wear' }
    ];

    // 数字/角色暗示
    let roleHint = '';
    if (card.card_type === 'court') {
      roleHint = ` The figure carries the unmistakable presence of the ${card.court_role} (the ${card.court_archetype}).`;
    } else if (card.slug.startsWith('ace-of-')) {
      roleHint = ` A single luminous hand emerges from a glowing cloud, marking this as the Ace — the spark and seed of the suit.`;
    } else {
      // 数字牌：从 slug 抽数字
      const numWord = card.slug.split('-')[0];
      const numMap = { 'two': 'two', 'three': 'three', 'four': 'four', 'five': 'five', 'six': 'six', 'seven': 'seven', 'eight': 'eight', 'nine': 'nine', 'ten': 'ten' };
      const n = numMap[numWord];
      if (n) roleHint = ` The composition subtly encodes the number ${n} in the arrangement of the suit symbols.`;
    }

    const bestOverallName = cr.best_overall.name;

    const prompt = `A symbolic editorial illustration for the tarot card ${cardName} (${archetype}) from the Minor Arcana, set in the realm of the ${card.suit} suit (${card.suit_element} element). Central Rider-Waite imagery: ${visual}.${roleHint} The background is built from ${suitMeta.element_color}. Beside the card visual, ${suitMeta.symbol} glows as the suit emblem. At the base of the composition, a single ${bestOverallName} crystal gemstone placed gracefully as the recommended stone. ${STYLE_TAIL}`;

    const slug = `tarot-${card.slug}-crystals`;
    result[slug] = {
      hero: {
        prompt,
        file: `${slug}.webp`
      },
      suit: card.suit,
      suit_element: card.suit_element,
      card_type: card.card_type,
      crystals: crystalsList
    };
    count++;
  }

  const out = {
    _meta: {
      purpose: 'Minor Arcana Top20 篇 hero 生图清单（slug 索引）',
      framework: 'Minor-Arcana-牌义竞品研究.md',
      data_sources: [
        'configs/minor-knowledge.json (crystals 5角色 + suit_element)',
        'articles/tarot-{slug}-crystals.md (已生产 20 篇)'
      ],
      hero_prompt_spec: {
        size: '1536x1024 → sharp resize 1536x864 webp',
        style_alignment: 'scripts/generate-scenario-images.js (站点塔罗 hero 一致风格)',
        elements: [
          'Rider-Waite Minor 牌画面（20 张内置映射表）',
          '花色元素色背景渐变（Wands=fire红橙 / Cups=water蓝青 / Swords=air浅黄 / Pentacles=earth绿棕）',
          '花色符号（Wands=火焰权杖 / Cups=圣杯 / Swords=宝剑 / Pentacles=星币）',
          'best_overall 水晶 gemstone（底部）',
          '数字牌编码数字 / 宫廷牌编码角色',
          'Eastern-inspired Tibetan 调性 + sacred geometry + deep indigo'
        ]
      },
      crystal_slug_rule: '全部带 -meaning 后缀对齐 390 库（5 角色：best_overall/upright/reversed/love/daily_wear）',
      total_articles: count
    },
    articles: result
  };

  fs.writeFileSync(path.join(DIR, 'configs/articles-minor-images.json'), JSON.stringify(out, null, 2));
  return count;
}

// ---------- 运行 ----------
const ynCount = buildYesNo();
const minorCount = buildMinor();

// ---------- 自检报告 ----------
console.log('=== 建图清单完成 ===');
console.log(`是与否: ${ynCount} 篇 → configs/articles-yesno-images.json`);
console.log(`Minor : ${minorCount} 篇 → configs/articles-minor-images.json`);

// 自检：水晶 slug 全带 -meaning
const ynData = require(path.join(DIR, 'configs/articles-yesno-images.json'));
const minData = require(path.join(DIR, 'configs/articles-minor-images.json'));
let slugIssues = 0;
for (const [slug, entry] of Object.entries(ynData.articles)) {
  for (const c of entry.crystals) {
    if (!c.slug.endsWith('-meaning')) { console.log(`⚠️  yesno ${slug} crystal ${c.slug} 缺 -meaning`); slugIssues++; }
  }
}
for (const [slug, entry] of Object.entries(minData.articles)) {
  for (const c of entry.crystals) {
    if (!c.slug.endsWith('-meaning')) { console.log(`⚠️  minor ${slug} crystal ${c.slug} 缺 -meaning`); slugIssues++; }
  }
}
console.log(`水晶 slug -meaning 自检: ${slugIssues === 0 ? '✅ 全部合规' : '⚠️  ' + slugIssues + ' 处违规'}`);

// verdict 分布自检（是与否）
const vd = {};
for (const entry of Object.values(ynData.articles)) vd[entry.verdict] = (vd[entry.verdict] || 0) + 1;
console.log(`verdict 分布: ${JSON.stringify(vd)}`);

// 花色分布自检（Minor）
const sd = {};
const eld = {};
for (const entry of Object.values(minData.articles)) { sd[entry.suit] = (sd[entry.suit] || 0) + 1; eld[entry.suit_element] = (eld[entry.suit_element] || 0) + 1; }
console.log(`花色分布: ${JSON.stringify(sd)} | 元素分布: ${JSON.stringify(eld)}`);

// prompt 完整性自检（每个 prompt 含关键元素）
let promptIssues = 0;
const ynChecks = { 'Rider-Waite': 0, 'verdict符号': 0, '问题图标': 0, '水晶gemstone': 0, 'STYLE_TAIL': 0 };
for (const entry of Object.values(ynData.articles)) {
  const p = entry.hero.prompt;
  if (/Rider-Waite/.test(p)) ynChecks['Rider-Waite']++;
  if (/(checkmark|question mark|cross \(X\))/.test(p)) ynChecks['verdict符号']++;
  if (/(heart icon|briefcase icon|forked-path icon|clock icon|house icon)/.test(p)) ynChecks['问题图标']++;
  if (/crystal gemstone/.test(p)) ynChecks['水晶gemstone']++;
  if (/no text, no words/.test(p)) ynChecks['STYLE_TAIL']++;
}
console.log(`yesno prompt 元素覆盖: ${JSON.stringify(ynChecks)} (应全=${ynCount})`);

const minChecks = { 'Rider-Waite': 0, '花色元素色': 0, '花色符号': 0, '水晶gemstone': 0, 'STYLE_TAIL': 0 };
for (const entry of Object.values(minData.articles)) {
  const p = entry.hero.prompt;
  if (/Rider-Waite/.test(p)) minChecks['Rider-Waite']++;
  if (/(gradient of|gradient)/.test(p)) minChecks['花色元素色']++;
  if (/(flourishing wand|golden chalice|silver sword|pentacle coin)/.test(p)) minChecks['花色符号']++;
  if (/crystal gemstone/.test(p)) minChecks['水晶gemstone']++;
  if (/no text, no words/.test(p)) minChecks['STYLE_TAIL']++;
}
console.log(`minor prompt 元素覆盖: ${JSON.stringify(minChecks)} (应全=${minorCount})`);
