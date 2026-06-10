/**
 * Crystals by Chakra 页面模板
 * URL: /crystal-guide/[chakra]-chakra-crystals
 *
 * 4个Section:
 * 1. Hero — 脉轮名+颜色+位置+描述
 * 2. 推荐水晶 — 3-5种水晶卡片
 * 3. 对应产品 — wdProductsWidget
 * 4. 7脉轮导航 — 其他6个脉轮链接
 *
 * 函数: generateChakraPage(config) 参数化脉轮名/颜色/位置/水晶
 *
 * 用法:
 *   node crystals-by-chakra.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// Draft-only fallback. B2正式进入2C前，每个推荐水晶都必须传入真实图片。
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 7脉轮完整数据
// ============================================================
const ALL_CHAKRAS = [
  {
    name: 'Root Chakra',
    slug: 'root',
    sanskrit: 'Muladhara',
    color: '#FF0000',
    colorName: 'Red',
    location: 'Base of the Spine',
    description: 'The Root Chakra is traditionally associated with foundation, steadiness, and feeling grounded in daily life. Many people choose red or dark stones as tactile reminders to slow down and return to the present moment.',
    crystals: [
      { name: 'Black Tourmaline', subtitle: 'The Grounding Stone', reason: 'Black Tourmaline is commonly chosen for grounding intentions. Its dark color and weight make it a natural reminder to pause, breathe, and feel steady.', link: '/crystal-guide/black-tourmaline-meaning' },
      { name: 'Hematite', subtitle: 'The Grounding Stone', reason: 'Hematite is traditionally linked with stability and focus. Many people use it as a pocket stone or bracelet when they want a tangible cue for steadiness.', link: '/crystal-guide/hematite-meaning' },
      { name: 'Red Jasper', subtitle: 'The Stone of Endurance', reason: 'Red Jasper is often associated with patience and stamina. For root chakra work, it can serve as a reminder to move slowly and stay consistent.', link: '/crystal-guide/red-jasper-meaning' },
      { name: 'Smoky Quartz', subtitle: 'The Stone of Release', reason: 'Smoky Quartz is often used in grounding rituals. Its muted tone supports a visual language of calm, release, and returning to basics.', link: '/crystal-guide/smoky-quartz-meaning' }
    ]
  },
  {
    name: 'Sacral Chakra',
    slug: 'sacral',
    sanskrit: 'Svadhisthana',
    color: '#FF8C00',
    colorName: 'Orange',
    location: 'Lower Abdomen',
    description: 'The Sacral Chakra is traditionally connected with creativity, emotional expression, and openness to change. Orange and warm-toned stones are often used as reminders to make space for play, movement, and creative practice.',
    crystals: [
      { name: 'Carnelian', subtitle: 'The Stone of Motivation', reason: 'Carnelian is traditionally associated with motivation and creative momentum. It works well as a daily reminder to begin before every detail feels settled.', link: '/crystal-guide/carnelian-meaning' },
      { name: 'Moonstone', subtitle: 'The Stone of New Beginnings', reason: 'Moonstone is often connected with cycles, change, and intuition. It can support a gentler ritual language for transitions and emotional reflection.', link: '/crystal-guide/moonstone-meaning' },
      { name: 'Orange Calcite', subtitle: 'The Stone of Joy', reason: 'Orange Calcite is commonly used in creativity-focused rituals. Its bright color makes it a useful symbolic cue for playfulness and renewed attention.', link: '/crystal-guide/orange-calcite-meaning' }
    ]
  },
  {
    name: 'Solar Plexus',
    slug: 'solar-plexus',
    sanskrit: 'Manipura',
    color: '#FFD700',
    colorName: 'Yellow',
    location: 'Upper Abdomen',
    description: 'The Solar Plexus Chakra is traditionally associated with confidence, self-direction, and purposeful action. Yellow stones are often chosen as visual reminders for courage, planning, and follow-through.',
    crystals: [
      { name: 'Citrine', subtitle: 'The Stone of Abundance', reason: 'Citrine is often associated with optimism, abundance, and creative planning. It can serve as a bright reminder to make choices that support growth.', link: '/crystal-guide/citrine-meaning' },
      { name: 'Tiger Eye', subtitle: 'The Stone of Courage', reason: 'Tiger Eye is traditionally linked with courage and practical confidence. Its banded surface makes it a strong visual cue for grounded decision-making.', link: '/crystal-guide/tiger-eye-meaning' },
      { name: 'Yellow Jasper', subtitle: 'The Stone of Endurance', reason: 'Yellow Jasper is often used as a steadying stone in confidence rituals. It pairs well with intentions around patience and self-trust.', link: '/crystal-guide/yellow-jasper-meaning' },
      { name: 'Pyrite', subtitle: 'The Stone of Action', reason: 'Pyrite is commonly associated with action, ambition, and clear goals. In bracelet form, it can become a small reminder to follow through.', link: '/crystal-guide/pyrite-meaning' }
    ]
  },
  {
    name: 'Heart Chakra',
    slug: 'heart',
    sanskrit: 'Anahata',
    color: '#00CC00',
    colorName: 'Green',
    location: 'Center of the Chest',
    description: 'The Heart Chakra is traditionally connected with love, compassion, and forgiveness. Green and pink stones are often used as reminders to soften, listen, and practice care toward yourself and others.',
    crystals: [
      { name: 'Rose Quartz', subtitle: 'The Stone of Love', reason: 'Rose Quartz is widely associated with love and self-compassion. Many people wear it as a gentle reminder to speak to themselves with more care.', link: '/crystal-guide/rose-quartz-meaning' },
      { name: 'Green Aventurine', subtitle: 'The Stone of Luck', reason: 'Green Aventurine is often connected with renewal and opportunity. For heart intentions, it can symbolize openness to growth and possibility.', link: '/crystal-guide/green-aventurine-meaning' },
      { name: 'Rhodonite', subtitle: 'The Stone of Compassion', reason: 'Rhodonite is traditionally associated with compassion and emotional repair. It works well for rituals centered on forgiveness and gentleness.', link: '/crystal-guide/rhodonite-meaning' },
      { name: 'Malachite', subtitle: 'The Stone of Transformation', reason: 'Malachite is often linked with transformation and courage. Its strong green pattern makes it a bold reminder to meet change with honesty.', link: '/crystal-guide/malachite-meaning' }
    ]
  },
  {
    name: 'Throat Chakra',
    slug: 'throat',
    sanskrit: 'Vishuddha',
    color: '#0099FF',
    colorName: 'Blue',
    location: 'Throat',
    description: 'The Throat Chakra is traditionally associated with communication, truth, and self-expression. Blue stones are often chosen as reminders to speak clearly, listen carefully, and choose words with intention.',
    crystals: [
      { name: 'Lapis Lazuli', subtitle: 'The Stone of Truth', reason: 'Lapis Lazuli is traditionally associated with truth, wisdom, and expression. It can serve as a reminder to speak with clarity and care.', link: '/crystal-guide/lapis-lazuli-meaning' },
      { name: 'Aquamarine', subtitle: 'The Stone of Courage', reason: 'Aquamarine is often connected with calm communication. Its watery blue tone supports intentions around steadiness before speaking.', link: '/crystal-guide/aquamarine-meaning' },
      { name: 'Sodalite', subtitle: 'The Stone of Logic', reason: 'Sodalite is commonly linked with reason and clear thought. It pairs well with communication rituals that ask for patience and precision.', link: '/crystal-guide/sodalite-meaning' }
    ]
  },
  {
    name: 'Third Eye Chakra',
    slug: 'third-eye',
    sanskrit: 'Ajna',
    color: '#4B0082',
    colorName: 'Indigo',
    location: 'Between the Eyebrows',
    description: 'The Third Eye Chakra is traditionally connected with intuition, insight, and reflection. Indigo and purple stones are often used as quiet cues for journaling, meditation, and inner listening.',
    crystals: [
      { name: 'Amethyst', subtitle: 'The Stone of Peace', reason: 'Amethyst is commonly associated with calm, reflection, and spiritual practice. It is a natural fit for meditation or evening journaling rituals.', link: '/crystal-guide/amethyst-meaning' },
      { name: 'Fluorite', subtitle: 'The Stone of Focus', reason: 'Fluorite is often linked with clarity and organization. Its layered colors make it a useful symbol for sorting through thoughts with patience.', link: '/crystal-guide/fluorite-meaning' },
      { name: 'Labradorite', subtitle: 'The Stone of Mystery', reason: 'Labradorite is traditionally associated with intuition and inner change. Its shifting flash gives it a reflective, contemplative quality.', link: '/crystal-guide/labradorite-meaning' },
      { name: 'Lepidolite', subtitle: 'The Stone of Transition', reason: 'Lepidolite is often chosen for transition rituals. Its soft purple tone supports intentions around slowing down and making room for change.', link: '/crystal-guide/lepidolite-meaning' }
    ]
  },
  {
    name: 'Crown Chakra',
    slug: 'crown',
    sanskrit: 'Sahasrara',
    color: '#9400D3',
    colorName: 'Violet',
    location: 'Top of the Head',
    description: 'The Crown Chakra is traditionally associated with meaning, perspective, and spiritual connection. Clear and violet stones are often used as simple reminders to make room for reflection and humility.',
    crystals: [
      { name: 'Clear Quartz', subtitle: 'The Clarity Stone', reason: 'Clear Quartz is often associated with clarity and intention. Its transparent form makes it a useful symbol for focus, simplicity, and reflection.', link: '/crystal-guide/clear-quartz-meaning' },
      { name: 'Selenite', subtitle: 'The Stone of Clarity', reason: 'Selenite is traditionally used in cleansing and clarity rituals. Its pale surface supports a visual language of simplicity and reset.', link: '/crystal-guide/selenite-meaning' },
      { name: 'Amethyst', subtitle: 'The Stone of Peace', reason: 'Amethyst is commonly used in spiritual and meditative traditions. For crown chakra content, it works best as a reminder of calm reflection.', link: '/crystal-guide/amethyst-meaning' }
    ]
  }
];

/**
 * 生成 Crystals by Chakra 页面
 *
 * @param {Object} config
 * @param {string} config.name        — 脉轮名，如 "Root Chakra"
 * @param {string} config.slug        — URL slug，如 "root"
 * @param {string} config.sanskrit    — 梵文名，如 "Muladhara"
 * @param {string} config.color       — 颜色，如 "#FF0000"
 * @param {string} config.colorName   — 颜色英文名，如 "Red"
 * @param {string} config.location    — 位置，如 "Base of the Spine"
 * @param {string} config.description — 脉轮描述
 * @param {Array}  config.crystals    — [{name, subtitle, reason, link}]
 */
function generateChakraPage(config) {
  var name = config.name || 'Root Chakra';
  var slug = config.slug || 'root';
  var sanskrit = config.sanskrit || 'Muladhara';
  var color = config.color || '#FF0000';
  var colorName = config.colorName || 'Red';
  var location = config.location || 'Base of the Spine';
  var crystals = config.crystals || [];

  // ----------------------------------------------------------
  // Section 1: Hero — 脉轮名+颜色+位置+描述
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/crystal-guide/" style="color:#ccc;">Crystal Guide</a> &gt; <span style="color:#fff;">' + name + '</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.htmlWidget(
      '<div style="width:60px;height:60px;border-radius:50%;background:' + color + ';margin:15px auto 10px;box-shadow:0 0 20px ' + color + '66;"></div>'
    ),
    E.heading('Best Crystals for the ' + name, {
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '5', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(sanskrit + ' \u2014 ' + colorName + ' \u2014 ' + location, {
      fontSize: 18,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.description || 'Discover crystals traditionally associated with the ' + name + '. These stones can serve as symbolic reminders for the intentions connected with this chakra.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 推荐水晶 — 3-5种水晶卡片
  // ----------------------------------------------------------
  var crystalCards = crystals.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '3', right: '1', bottom: '1', left: '1', isLinked: '' },
      border_color: color
    }, E.rWidth(String(Math.floor(100 / crystals.length)), '50', '100')), [
      E.imageWidget(crystal.image || PLACEHOLDER, {
        width: 100,
        radius: 8,
        alt: crystal.name
      }),
      E.heading(crystal.name, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '12', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        crystal.subtitle || '',
        { align: 'center', fontSize: 14, color: '#999999' }
      ),
      E.textEditor(
        crystal.reason || 'This crystal is traditionally associated with the ' + name + ' and can serve as a meaningful reminder for related intentions.',
        { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
      ),
      E.buttonWidget('Explore ' + crystal.name, crystal.link || '/crystal-guide/' + crystal.name.toLowerCase().replace(/\s+/g, '-') + '-meaning')
    ]);
  });

  var crystalSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Recommended Crystals for the ' + name, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each of these crystals is commonly associated with the ' + name + ' in modern chakra practice. Use this guide as a starting point for choosing a stone that fits your intention.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, crystalCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: 对应产品 — wdProductsWidget
  // ----------------------------------------------------------
  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading(name + ' Crystal Collection', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Browse crystal bracelets and sets selected around the traditional color, symbolism, and intentions of the ' + name + '.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(6)
  ]);

  // ----------------------------------------------------------
  // Section 4: 7脉轮导航 — 其他6个脉轮链接
  // ----------------------------------------------------------
  var otherChakras = ALL_CHAKRAS.filter(function (c) { return c.slug !== slug; });
  var chakraNavCards = otherChakras.map(function (chakra) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('16', '33', '50')), [
      E.htmlWidget(
        '<div style="width:30px;height:30px;border-radius:50%;background:' + chakra.color + ';margin:0 auto 8px;"></div>'
      ),
      E.heading(chakra.name, {
        fontSize: 14,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        chakra.sanskrit,
        { align: 'center', fontSize: 12, color: '#999999' }
      ),
      E.buttonWidget('Explore', '/crystal-guide/' + chakra.slug + '-chakra-crystals')
    ]);
  });

  var chakraNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Explore All 7 Chakras', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each chakra carries its own symbolic language. Explore the crystals commonly associated with each center and choose the path that fits your current intention.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, chakraNavCards)
  ]);

  return [
    heroSection,
    crystalSection,
    productsSection,
    chakraNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Root Chakra 页面
// ============================================================
async function main() {
  var config = ALL_CHAKRAS[0]; // Root Chakra
  var data = generateChakraPage(config);
  await E.createPage(
    'Best Crystals for the ' + config.name,
    config.slug + '-chakra-crystals',
    data,
    'draft'
  );
}

if (require.main === module) {
  main().catch(function (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

module.exports = { generateChakraPage: generateChakraPage, ALL_CHAKRAS: ALL_CHAKRAS };
