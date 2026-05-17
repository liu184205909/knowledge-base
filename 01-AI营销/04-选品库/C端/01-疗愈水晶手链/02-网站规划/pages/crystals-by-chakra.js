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
// 占位图片
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
    description: 'The Root Chakra is your foundation. When balanced, it provides a sense of security, stability, and groundedness. It connects you to the earth and your basic survival instincts.',
    crystals: [
      { name: 'Black Tourmaline', subtitle: 'The Shield Stone', reason: 'Black Tourmaline is one of the most powerful grounding stones. It creates a protective energy shield around the root chakra, dispelling fear and enhancing security.', link: '/crystal-guide/black-tourmaline-meaning' },
      { name: 'Hematite', subtitle: 'The Grounding Stone', reason: 'Hematite anchors your energy to the earth, providing stability and strength. It is ideal for those feeling scattered or disconnected.', link: '/crystal-guide/hematite-meaning' },
      { name: 'Red Jasper', subtitle: 'The Stone of Endurance', reason: 'Red Jasper stimulates the root chakra with its deep earth energy, promoting courage, stamina, and a strong sense of self.', link: '/crystal-guide/red-jasper-meaning' },
      { name: 'Smoky Quartz', subtitle: 'The Stone of Serenity', reason: 'Smoky Quartz gently grounds and neutralizes negative energy, helping you feel safe and secure in your physical body.', link: '/crystal-guide/smoky-quartz-meaning' }
    ]
  },
  {
    name: 'Sacral Chakra',
    slug: 'sacral',
    sanskrit: 'Svadhisthana',
    color: '#FF8C00',
    colorName: 'Orange',
    location: 'Lower Abdomen',
    description: 'The Sacral Chakra governs creativity, passion, and emotional flow. When open, it allows you to experience pleasure, embrace change, and express your authentic self.',
    crystals: [
      { name: 'Carnelian', subtitle: 'The Stone of Motivation', reason: 'Carnelian ignites the creative fire within the sacral chakra, boosting confidence, passion, and the courage to take action.', link: '/crystal-guide/carnelian-meaning' },
      { name: 'Moonstone', subtitle: 'The Stone of New Beginnings', reason: 'Moonstone harmonizes with the sacral chakra\'s watery energy, enhancing intuition, emotional balance, and feminine power.', link: '/crystal-guide/moonstone-meaning' },
      { name: 'Orange Calcite', subtitle: 'The Stone of Joy', reason: 'Orange Calcite energizes the sacral chakra, releasing blockages around creativity and inviting playfulness and joy back into your life.', link: '/crystal-guide/orange-calcite-meaning' }
    ]
  },
  {
    name: 'Solar Plexus',
    slug: 'solar-plexus',
    sanskrit: 'Manipura',
    color: '#FFD700',
    colorName: 'Yellow',
    location: 'Upper Abdomen',
    description: 'The Solar Plexus Chakra is your center of personal power, willpower, and self-confidence. When balanced, it fuels your ambition and helps you take decisive action.',
    crystals: [
      { name: 'Citrine', subtitle: 'The Stone of Abundance', reason: 'Citrine radiates the warm, confident energy of the sun. It activates the solar plexus, enhancing self-esteem and manifestation power.', link: '/crystal-guide/citrine-meaning' },
      { name: 'Tiger Eye', subtitle: 'The Stone of Courage', reason: 'Tiger Eye empowers the solar plexus with grounded confidence, helping you face challenges with clarity and determination.', link: '/crystal-guide/tiger-eye-meaning' },
      { name: 'Yellow Jasper', subtitle: 'The Stone of Protection', reason: 'Yellow Jasper provides a steady, nurturing energy to the solar plexus, building inner strength and emotional resilience.', link: '/crystal-guide/yellow-jasper-meaning' },
      { name: 'Pyrite', subtitle: 'The Stone of Action', reason: 'Pyrite stimulates the solar plexus with its bold, masculine energy, inspiring leadership and the pursuit of goals.', link: '/crystal-guide/pyrite-meaning' }
    ]
  },
  {
    name: 'Heart Chakra',
    slug: 'heart',
    sanskrit: 'Anahata',
    color: '#00CC00',
    colorName: 'Green',
    location: 'Center of the Chest',
    description: 'The Heart Chakra is the bridge between the physical and spiritual. It governs love, compassion, and forgiveness. When open, it allows deep connection with yourself and others.',
    crystals: [
      { name: 'Rose Quartz', subtitle: 'The Stone of Love', reason: 'Rose Quartz is the ultimate heart chakra stone. It opens the heart to all forms of love \u2014 self-love, romantic love, and universal compassion.', link: '/crystal-guide/rose-quartz-meaning' },
      { name: 'Green Aventurine', subtitle: 'The Stone of Luck', reason: 'Green Aventurine soothes the heart chakra, releasing old patterns and inviting in new opportunities with an open heart.', link: '/crystal-guide/green-aventurine-meaning' },
      { name: 'Rhodonite', subtitle: 'The Stone of Compassion', reason: 'Rhodonite heals emotional wounds stored in the heart chakra, nurturing forgiveness and compassion for yourself and others.', link: '/crystal-guide/rhodonite-meaning' },
      { name: 'Malachite', subtitle: 'The Stone of Transformation', reason: 'Malachite clears and activates the heart chakra, encouraging deep emotional healing and the release of guarded heart patterns.', link: '/crystal-guide/malachite-meaning' }
    ]
  },
  {
    name: 'Throat Chakra',
    slug: 'throat',
    sanskrit: 'Vishuddha',
    color: '#0099FF',
    colorName: 'Blue',
    location: 'Throat',
    description: 'The Throat Chakra governs communication, truth, and self-expression. When balanced, it empowers you to speak your truth with clarity and authenticity.',
    crystals: [
      { name: 'Lapis Lazuli', subtitle: 'The Stone of Truth', reason: 'Lapis Lazuli activates the throat chakra, encouraging honest communication and the courage to express your inner truth.', link: '/crystal-guide/lapis-lazuli-meaning' },
      { name: 'Aquamarine', subtitle: 'The Stone of Courage', reason: 'Aquamarine clears the throat chakra, soothing communication anxiety and helping you articulate your thoughts with grace.', link: '/crystal-guide/aquamarine-meaning' },
      { name: 'Sodalite', subtitle: 'The Stone of Logic', reason: 'Sodalite balances the throat chakra, promoting rational thinking and clear, effective communication.', link: '/crystal-guide/sodalite-meaning' }
    ]
  },
  {
    name: 'Third Eye Chakra',
    slug: 'third-eye',
    sanskrit: 'Ajna',
    color: '#4B0082',
    colorName: 'Indigo',
    location: 'Between the Eyebrows',
    description: 'The Third Eye Chakra is the seat of intuition, insight, and inner wisdom. When activated, it enhances your ability to see beyond the physical and trust your inner guidance.',
    crystals: [
      { name: 'Amethyst', subtitle: 'The Stone of Peace', reason: 'Amethyst opens the third eye, deepening meditation and enhancing intuition while keeping the mind calm and focused.', link: '/crystal-guide/amethyst-meaning' },
      { name: 'Fluorite', subtitle: 'The Stone of Focus', reason: 'Fluorite stimulates the third eye chakra, sharpening mental clarity and enhancing your ability to process spiritual insights.', link: '/crystal-guide/fluorite-meaning' },
      { name: 'Labradorite', subtitle: 'The Stone of Magic', reason: 'Labradorite activates the third eye, awakening mystical abilities and enhancing your connection to higher realms of consciousness.', link: '/crystal-guide/labradorite-meaning' },
      { name: 'Lepidolite', subtitle: 'The Stone of Transition', reason: 'Lepidolite calms the third eye chakra, easing mental overwhelm and supporting deep, restorative meditation.', link: '/crystal-guide/lepidolite-meaning' }
    ]
  },
  {
    name: 'Crown Chakra',
    slug: 'crown',
    sanskrit: 'Sahasrara',
    color: '#9400D3',
    colorName: 'Violet',
    location: 'Top of the Head',
    description: 'The Crown Chakra is your gateway to divine consciousness and universal connection. When open, it brings enlightenment, spiritual awakening, and a deep sense of oneness.',
    crystals: [
      { name: 'Clear Quartz', subtitle: 'The Master Healer', reason: 'Clear Quartz amplifies the crown chakra\'s connection to higher consciousness, serving as a bridge between the physical and spiritual realms.', link: '/crystal-guide/clear-quartz-meaning' },
      { name: 'Selenite', subtitle: 'The Stone of Clarity', reason: 'Selenite opens and cleanses the crown chakra, allowing divine light to flow through and illuminating your spiritual path.', link: '/crystal-guide/selenite-meaning' },
      { name: 'Amethyst', subtitle: 'The Stone of Peace', reason: 'Amethyst elevates the crown chakra, facilitating spiritual awareness, deep meditation, and connection to universal wisdom.', link: '/crystal-guide/amethyst-meaning' }
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
      config.description || 'Discover the crystals that resonate with the ' + name + '. These stones help balance and activate this vital energy center.',
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
        crystal.reason || 'This crystal resonates deeply with the ' + name + ', providing support and energetic alignment.',
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
      'Each of these crystals has been carefully selected for its unique resonance with the ' + name + '. Discover how they can support your energetic balance.',
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
      'Browse our curated selection of crystal bracelets and sets designed to balance and activate your ' + name + '.',
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
      'Every chakra plays a vital role in your energetic health. Discover the crystals that resonate with each energy center.',
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

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = { generateChakraPage: generateChakraPage, ALL_CHAKRAS: ALL_CHAKRAS };
