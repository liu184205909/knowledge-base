/**
 * Crystals by Element 页面模板
 * URL: /[element]-crystals
 *
 * 4个Section:
 * 1. Hero — 元素名+描述+特性
 * 2. 该元素水晶 — 3-5种水晶卡片
 * 3. 对应产品 — wdProductsWidget
 * 4. 4元素导航 — Earth/Air/Fire/Water
 *
 * 用法:
 *   node crystals-by-element.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 4元素完整数据
// ============================================================
const ALL_ELEMENTS = [
  {
    name: 'Earth',
    symbol: '\u2663',
    color: '#10B981',
    traits: 'Grounding, Stable, Nurturing, Patient, Practical',
    zodiac: 'Taurus, Virgo, Capricorn',
    description: 'Earth element crystals connect you to the physical world, providing stability, abundance, and a deep sense of rootedness. These stones are the foundation of any crystal collection, offering grounding energy that keeps you centered amid life\'s storms.'
  },
  {
    name: 'Air',
    symbol: '\u2660',
    color: '#3B82F6',
    traits: 'Intellectual, Communicative, Free-thinking, Social, Curious',
    zodiac: 'Gemini, Libra, Aquarius',
    description: 'Air element crystals stimulate the mind, enhance communication, and expand your intellectual horizons. These light, ethereal stones carry the energy of new ideas, mental clarity, and the freedom to express your authentic voice.'
  },
  {
    name: 'Fire',
    symbol: '\u2666',
    color: '#EF4444',
    traits: 'Passionate, Courageous, Energetic, Creative, Bold',
    zodiac: 'Aries, Leo, Sagittarius',
    description: 'Fire element crystals burn with transformative energy, igniting passion, courage, and creative power within. These vibrant stones fuel your ambitions, spark your inner flame, and give you the strength to take bold action toward your dreams.'
  },
  {
    name: 'Water',
    symbol: '\u2665',
    color: '#6366F1',
    traits: 'Intuitive, Emotional, Healing, Empathic, Flowing',
    zodiac: 'Cancer, Scorpio, Pisces',
    description: 'Water element crystals carry the deep, flowing energy of the emotional realm. These soothing stones enhance intuition, promote emotional healing, and help you navigate the currents of your feelings with grace and wisdom.'
  }
];

/**
 * 生成 Crystals by Element 页面
 *
 * @param {Object} config
 * @param {string} config.element      — 元素名，如 "Earth"
 * @param {string} config.symbol       — 元素符号，如 "\u2663"
 * @param {string} config.color        — 主题色 HEX，如 "#10B981"
 * @param {string} config.traits       — 元素特性关键词
 * @param {string} config.zodiac       — 对应星座
 * @param {string} config.description  — 元素描述文案
 * @param {Array}  config.crystals     — [{name, subtitle, benefits, image, link}]
 */
function generateElementPage(config) {
  var element = config.element || 'Earth';
  var symbol = config.symbol || '\u2663';
  var color = config.color || '#10B981';
  var traits = config.traits || 'Grounding, Stable, Nurturing, Patient';
  var zodiac = config.zodiac || 'Taurus, Virgo, Capricorn';
  var crystals = config.crystals || [];
  var slug = element.toLowerCase();

  // ----------------------------------------------------------
  // Section 1: Hero — 元素名 + 描述 + 特性
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'gradient',
    background_color: '#1A0A2E',
    background_color_b: color
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/crystal-guide/" style="color:#ccc;">Crystal Guide</a> &gt; <span style="color:#fff;">' + element + ' Element</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#CCCCCC' } }
    ),
    E.heading(symbol + ' ' + element + ' Element Crystals', {
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.description || 'The ' + element + ' element represents the foundational energy of ' + element.toLowerCase() + ' in the crystal kingdom. These stones carry the primal force of nature, connecting you to the ancient wisdom of the elements.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    ),
    E.spacer('20'),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap',
      content_width: 'full'
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('15', '20', '15', '20'),
        background_background: 'classic',
        background_color: 'rgba(255,255,255,0.1)'
      }, E.rWidth('50', '50', '100')), [
        E.heading('Associated Zodiac Signs', {
          fontSize: 16,
          color: '#AAAAAA',
          align: 'center',
          fontWeight: '400',
          padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.heading(zodiac, {
          fontSize: 18,
          color: '#FFFFFF',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
        })
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('15', '20', '15', '20'),
        background_background: 'classic',
        background_color: 'rgba(255,255,255,0.1)'
      }, E.rWidth('50', '50', '100')), [
        E.heading('Core Qualities', {
          fontSize: 16,
          color: '#AAAAAA',
          align: 'center',
          fontWeight: '400',
          padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.heading(traits, {
          fontSize: 18,
          color: '#FFFFFF',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
        })
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 2: 该元素水晶 — 3-5种水晶卡片
  // ----------------------------------------------------------
  var crystalCards = crystals.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '25', '20'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth(String(Math.floor(100 / crystals.length)), '50', '100')), [
      E.imageWidget(crystal.image || PLACEHOLDER, {
        width: 100,
        radius: 8
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
        { align: 'center', fontSize: 14, color: '#999999', lineHeight: 20 }
      ),
      E.textEditor(
        crystal.benefits || 'A powerful ' + element + '-aligned crystal that channels the elemental energy of ' + element.toLowerCase() + ' to support your spiritual practice.',
        { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
      ),
      E.buttonWidget('Explore ' + crystal.name, crystal.link || '/crystal-guide/' + crystal.name.toLowerCase().replace(/\s+/g, '-') + '-meaning')
    ]);
  });

  var crystalListSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading(element + ' Element Crystals & Their Meanings', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'These crystals embody the primal energy of the ' + element + ' element. Each stone resonates with ' + element.toLowerCase() + ' energy in its own unique way, offering you different pathways to connect with this foundational force of nature.',
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
    E.heading('Shop ' + element + ' Element Crystals', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore our curated collection of ' + element.toLowerCase() + '-element crystal bracelets and sets, each cleansed and charged to carry the authentic energy of ' + element.toLowerCase() + '.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(6)
  ]);

  // ----------------------------------------------------------
  // Section 4: 4元素导航 — Earth / Air / Fire / Water
  // ----------------------------------------------------------
  var otherElements = ALL_ELEMENTS.filter(function (e) { return e.name !== element; });
  var elementNavCards = otherElements.map(function (el) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '20', '25', '20'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('33', '50', '100')), [
      E.heading(el.symbol + ' ' + el.name + ' Element', {
        fontSize: 22,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
      }),
      E.textEditor(
        el.traits,
        { align: 'center', fontSize: 14, color: '#888888', lineHeight: 20 }
      ),
      E.textEditor(
        'Zodiac: ' + el.zodiac,
        { align: 'center', fontSize: 13, color: '#999999', lineHeight: 18 }
      ),
      E.spacer('10'),
      E.buttonWidget('Explore ' + el.name + ' Crystals', '/crystal-guide/' + el.name.toLowerCase() + '-crystals')
    ]);
  });

  var elementNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('The Four Elements of Crystal Energy', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'In the ancient tradition of the elements, every crystal belongs to one of four elemental families. Each element carries its own unique energy signature, connecting you to different aspects of your being and the natural world.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, elementNavCards)
  ]);

  return [
    heroSection,
    crystalListSection,
    productsSection,
    elementNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Earth Element 页面
// ============================================================
async function main() {
  var config = {
    element: 'Earth',
    symbol: '\u2663',
    color: '#10B981',
    traits: 'Grounding, Stable, Nurturing, Patient, Practical',
    zodiac: 'Taurus, Virgo, Capricorn',
    description: 'Earth element crystals are the bedrock of any spiritual practice. Their deep, grounding energy connects you to the physical world, providing stability, abundance, and an unshakeable sense of rootedness. Like ancient trees whose roots reach deep into the soil, Earth crystals anchor your energy and help you build a solid foundation for growth.',
    crystals: [
      {
        name: 'Green Aventurine',
        subtitle: 'The Stone of Luck',
        benefits: 'The quintessential Earth crystal, Green Aventurine attracts abundance, opportunity, and good fortune. Its gentle, nurturing energy encourages perseverance while keeping you grounded in practical reality.',
        link: '/gemstone/green-aventurine-meaning'
      },
      {
        name: 'Moss Agate',
        subtitle: 'The Gardener\'s Stone',
        benefits: 'Deeply connected to the Earth element, Moss Agate carries the energy of forests and growing things. It promotes new beginnings, emotional balance, and a profound connection to the natural world.',
        link: '/gemstone/moss-agate-meaning'
      },
      {
        name: 'Jade',
        subtitle: 'The Stone of Wisdom',
        benefits: 'Revered for millennia, Jade embodies Earth\'s wisdom and serenity. It promotes harmony, abundance, and a deep trust in the natural flow of life while grounding your spirit in calm certainty.',
        link: '/gemstone/jade-meaning'
      },
      {
        name: 'Tiger Eye',
        subtitle: 'The Stone of Courage',
        benefits: 'With its earthy golden-brown bands, Tiger Eye combines grounding energy with a fierce protective power. It builds confidence, sharpens focus, and helps you take practical steps toward your goals.',
        link: '/gemstone/tiger-eye-meaning'
      },
      {
        name: 'Smoky Quartz',
        subtitle: 'The Grounding Stone',
        benefits: 'One of the most powerful grounding stones, Smoky Quartz anchors your energy to the Earth while transmuting negativity. It provides stability during times of stress and a calm, clear perspective.',
        link: '/gemstone/smoky-quartz-meaning'
      }
    ]
  };

  var data = generateElementPage(config);
  await E.createPage(
    config.element + ' Element Crystals: Meaning & Properties',
    config.element.toLowerCase() + '-crystals',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateElementPage;
