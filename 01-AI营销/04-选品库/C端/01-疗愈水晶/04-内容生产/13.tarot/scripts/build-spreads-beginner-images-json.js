/**
 * 建 configs/articles-spreads-images.json + configs/articles-beginner-images.json
 *   hero prompt 风格参照 articles-yesno-images.json（编辑级、东方调性、水晶落位）
 *
 * spreads: 牌阵布局示意（layout keyword）+ 卡位水晶落位 + 东方阵法调性
 * beginner: 学塔罗实践场景 + 水晶触觉锚 + 东方禅意
 *
 * 运行: node build-spreads-beginner-images-json.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');

// ---------- 牌阵 layout → 视觉描述（英文喂给 gpt-image-2）----------
const LAYOUT_VISUAL = {
  'linear': 'a horizontal row of evenly spaced tarot cards laid face up in a straight line',
  'cross-and-staff': 'a complex Celtic Cross layout: a central cross of overlapping cards plus a vertical staff of cards running to the right',
  'fan': 'cards arranged in an elegant symmetrical fan arc',
  'balanced-triangle': 'three cards arranged in an upward-pointing equilateral triangle',
  'single': 'a single tarot card laid flat and centered',
  'two-columns': 'two vertical columns of cards facing each other across a central divide',
  'fork': 'cards arranged in a Y-shaped fork with two diverging paths branching from one base card',
  'diamond': 'four cards arranged in a diamond rhombus shape',
  'crescent': 'cards arranged in a gentle crescent moon arc',
  'circle': 'cards arranged in a complete circle ring',
  'heart': 'cards arranged in the outline of a heart shape',
  'star': 'cards arranged in a five-pointed star pattern',
  'cross': 'four cards arranged in a plus-sign / cross shape',
  'days-row': 'seven cards laid in a horizontal row labeled by days of the week',
  'wheel': 'twelve cards arranged in a circular wheel like zodiac positions',
  'mirror': 'two mirrored rows of cards facing each other across a central axis',
  'descending': 'cards arranged in a descending staircase diagonal from upper left to lower right',
  'plus': 'five cards arranged in a plus-sign shape with one center card',
  'horseshoe': 'cards arranged in a U-shaped horseshoe arc opening upward'
};

// 东方阵法调性 snippet（按 layout/intent 给一个稳定的东方氛围短语）
const EASTERN_LENS = 'subtle Eastern-inspired Tibetan gallery atmosphere, sacred geometry motifs, faint mandala line work in the deep indigo background, luminous golden particles floating, soft glow of contemplative practice';

// 水晶英文名映射（slug → display name）
function crystalPretty(slug) {
  if (!slug) return '';
  const map = {
    'smoky-quartz': 'Smoky Quartz', 'quartz': 'Clear Quartz', 'moonstone': 'Moonstone',
    'black-tourmaline': 'Black Tourmaline', 'citrine': 'Citrine', 'labradorite': 'Labradorite',
    'amethyst': 'Amethyst', 'tiger-eye': 'Tiger Eye', 'garnet': 'Garnet',
    'carnelian': 'Carnelian', 'rose-quartz': 'Rose Quartz', 'rhodonite': 'Rhodonite',
    'kunzite': 'Kunzite', 'fluorite': 'Fluorite', 'bloodstone': 'Bloodstone',
    'aventurine': 'Aventurine', 'pyrite': 'Pyrite', 'jade': 'Jade',
    'selenite': 'Selenite', 'aquamarine': 'Aquamarine'
  };
  if (map[slug]) return map[slug];
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ---------- spreads ----------
function buildSpreads() {
  const sp = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'spreads', 'spreads-knowledge.json'), 'utf8'));
  const out = {
    _meta: {
      purpose: '塔罗牌阵 25 篇 hero 生图清单（slug 索引）',
      framework: '../../03-内容策略/内容Brief/模板-Tarot-牌阵框架.md',
      data_sources: ['configs/spreads/spreads-knowledge.json'],
      hero_prompt_spec: '每张 = 牌阵布局示意（layout keyword 驱动）+ 卡位水晶落位（最多 3 颗代表性水晶）+ 东方阵法调性（mandala/Tibetan gallery）',
      total_articles: sp.spreads.length
    },
    articles: {}
  };
  for (const s of sp.spreads) {
    const layoutVisual = LAYOUT_VISUAL[s.layout] || LAYOUT_VISUAL['linear'];
    // 取前 3 颗水晶作画面落位（其余略避免拥挤）
    const crystals = (s.positions || []).map(p => p.crystal).filter(Boolean).slice(0, 3);
    const crystalText = crystals.length
      ? `At the base of the composition, ${crystals.length} natural crystal gemstones placed gracefully as the recommended stones for this spread — ${crystals.map((c, i) => `${crystalPretty(c)} (${['left', 'center', 'right'][i] || 'arranged'})`).join(', ')} — their natural color and facets clearly visible. `
      : '';
    // 阵型强调（如果 layout 是 celtic-cross / wheel / star 等，加几何强调）
    const geomEmph = (s.layout === 'cross-and-staff') ? 'intricate Celtic Cross pattern with a central cross and vertical staff, '
      : (s.layout === 'wheel') ? 'a twelve-position zodiac wheel pattern, '
      : (s.layout === 'star') ? 'a precise five-pointed star geometry, '
      : '';
    const prompt = `A symbolic editorial illustration for the tarot spread titled "${s.name}" (${s.card_count}-card layout, ${s.layout} pattern). Central composition: ${geomEmph}${layoutVisual} rendered on a deep indigo velvet reading cloth. The cards are shown as elegant backs with subtle Rider-Waite-style ornamental borders, suggesting the layout structure itself rather than specific card faces. ${crystalText}A luminous golden sacred-geometry mandala glow softly frames the entire spread arrangement, marking the energetic field of the reading. The composition is rendered in elegant luminous golden line work with a soft glow. Rich spiritual graphic design, ${EASTERN_LENS}, symmetrical balanced composition, premium editorial quality, no text, no words, no letters.`;
    out.articles[s.slug] = { hero: { prompt, file: s.slug + '.webp' }, spread: s.name, layout: s.layout, card_count: s.card_count, crystals: crystals.map(c => ({ slug: c, name: crystalPretty(c) })) };
  }
  fs.writeFileSync(path.join(DIR, 'configs', 'articles-spreads-images.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('✓ spreads:', Object.keys(out.articles).length, '→ configs/articles-spreads-images.json');
}

// ---------- beginner ----------
function buildBeginner() {
  const bg = JSON.parse(fs.readFileSync(path.join(DIR, 'configs', 'beginner', 'beginner-knowledge.json'), 'utf8'));
  const out = {
    _meta: {
      purpose: '塔罗新手指南 13 篇 hero 生图清单（slug 索引）',
      framework: '../../03-内容策略/内容Brief/模板-Tarot-新手框架.md',
      data_sources: ['configs/beginner/beginner-knowledge.json'],
      hero_prompt_spec: '每张 = 学塔罗实践场景（关键词驱动）+ 水晶触觉锚（手边 1-2 颗水晶）+ 东方禅意锚点',
      total_articles: bg.articles.length
    },
    articles: {}
  };
  // 每篇主题 → 场景视觉关键词
  const SCENE = {
    'how-to-read-tarot': 'a beginner sitting at a wooden reading table laying out their first three tarot cards in a row, hands gently drawing the cards from a deck',
    'tarot-for-beginners': 'a complete beginner\'s starter setup: an open tarot deck, a single clear quartz point placed beside it, and a journal waiting to be written',
    'first-tarot-deck': 'an unboxed brand-new tarot deck with its cards fanned out for the very first time, the practitioner\'s hands unwrapping the deck',
    'how-to-shuffle-tarot': 'hands shuffling a tarot deck in the bridge-shuffle style over a reading cloth, a small amethyst held loosely in the non-shuffling hand as a tactile anchor',
    'how-to-cleanse-tarot': 'a tarot deck being cleansed: a piece of selenite laid across the top card of the deck, soft moonlight or sound-bowl energy suggested by luminous particles',
    'tarot-card-meanings-list': 'a study reference layout: a Major Arcana card (The Fool) prominently displayed with smaller card-silhouettes arranged around it like a learning chart',
    'storing-tarot-cards': 'a tarot deck resting inside a wooden or silk-lined storage box, a piece of selenite placed at the side of the deck inside the box',
    'daily-tarot-practice': 'a calm morning ritual: a single tarot card drawn for the day, a cup of tea and a small crystal placed beside it on a wooden tray',
    'tarot-journaling': 'an open journal beside a laid-out three-card spread, a hand poised to write, a clear quartz point resting on the journal as an intention anchor',
    'reading-tarot-for-yourself': 'a single practitioner reading tarot solo at a candle-lit table, a piece of smoky quartz held near the cards as a grounding anchor',
    'reversed-tarot-cards': 'a tarot spread where two cards are upright and one card is drawn upside-down (reversed), the reversed card clearly marked by its inverted orientation',
    'major-vs-minor-arcana': 'two rows of tarot cards: top row showing a Major Arcana card (The Sun) larger and ornate, bottom row showing a Minor Arcana pip card smaller, visually contrasting the two',
    'reading-tarot-for-others': 'two people sitting across a reading table, one laying cards for the other, an amethyst placed at the center of the table as a shared grounding anchor'
  };
  for (const a of bg.articles) {
    const scene = SCENE[a.slug] || 'a calm tarot reading scene with cards laid on a cloth and a single crystal placed beside them';
    const crystals = (a.process_steps || []).map(s => s.crystal).filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 2);
    const crystalText = crystals.length
      ? ` ${crystals.map(c => `a single ${crystalPretty(c)} crystal gemstone`).join(' and ')} placed gracefully beside the reading as a tactile anchor, its natural color and facets clearly visible.`
      : '';
    const prompt = `A symbolic editorial illustration for the tarot beginner article "${a.name}". Scene: ${scene}.${crystalText ? ' ' + crystalText.trim() : ''} The composition is rendered in warm elegant luminous golden line work with a soft glow, deep indigo background harmonized with the accent palette. Rich spiritual graphic design, ${EASTERN_LENS}, contemplative and inviting educational atmosphere, premium editorial quality, no text, no words, no letters.`;
    out.articles[a.slug] = { hero: { prompt, file: a.slug + '.webp' }, primary_kw: a.primary_kw, crystals: crystals.map(c => ({ slug: c, name: crystalPretty(c) })) };
  }
  fs.writeFileSync(path.join(DIR, 'configs', 'articles-beginner-images.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('✓ beginner:', Object.keys(out.articles).length, '→ configs/articles-beginner-images.json');
}

buildSpreads();
buildBeginner();
