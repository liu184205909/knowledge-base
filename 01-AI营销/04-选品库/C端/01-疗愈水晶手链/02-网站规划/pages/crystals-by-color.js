/**
 * Crystals by Color 页面模板
 * URL: /crystal-guide/[color]-crystals
 *
 * 4个Section:
 * 1. Hero — 颜色名+描述+对应脉轮
 * 2. 该颜色水晶列表 — 3-5种水晶卡片（图+名+功效）
 * 3. 对应产品 — wdProductsWidget
 * 4. 12颜色导航 — 其他颜色链接
 *
 * 用法:
 *   node crystals-by-color.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 12种颜色完整数据
// ============================================================
const ALL_COLORS = [
  { name: 'Purple',   hex: '#8B5CF6', chakra: 'Crown & Third Eye',   crystals: 'Amethyst, Lepidolite, Charoite' },
  { name: 'Pink',     hex: '#EC4899', chakra: 'Heart',               crystals: 'Rose Quartz, Rhodonite, Pink Opal' },
  { name: 'Blue',     hex: '#3B82F6', chakra: 'Throat & Third Eye',  crystals: 'Lapis Lazuli, Sodalite, Aquamarine' },
  { name: 'Green',    hex: '#10B981', chakra: 'Heart',               crystals: 'Green Aventurine, Malachite, Jade' },
  { name: 'Red',      hex: '#EF4444', chakra: 'Root',                crystals: 'Red Jasper, Garnet, Ruby' },
  { name: 'Orange',   hex: '#F97316', chakra: 'Sacral',              crystals: 'Carnelian, Sunstone, Orange Calcite' },
  { name: 'Yellow',   hex: '#EAB308', chakra: 'Solar Plexus',        crystals: 'Citrine, Yellow Jade, Tiger Eye' },
  { name: 'White',    hex: '#F8FAFC', chakra: 'Crown',               crystals: 'Clear Quartz, Selenite, Howlite' },
  { name: 'Black',    hex: '#1E293B', chakra: 'Root',                crystals: 'Black Tourmaline, Obsidian, Hematite' },
  { name: 'Brown',    hex: '#92400E', chakra: 'Root',                crystals: 'Smoky Quartz, Tiger Eye, Petrified Wood' },
  { name: 'Gray',     hex: '#6B7280', chakra: 'Root & Crown',        crystals: 'Hematite, Labradorite, Moonstone' },
  { name: 'Rainbow',  hex: '#A855F7', chakra: 'All Seven Chakras',   crystals: 'Rainbow Fluorite, Opal, Labradorite' }
];

/**
 * 生成 Crystals by Color 页面
 *
 * @param {Object} config
 * @param {string} config.color        — 颜色名，如 "Purple"
 * @param {string} config.hex          — 颜色 HEX，如 "#8B5CF6"
 * @param {string} config.chakra       — 对应脉轮，如 "Crown & Third Eye"
 * @param {string} config.description  — 颜色描述文案
 * @param {Array}  config.crystals     — [{name, subtitle, benefits, image, link}]
 */
function generateColorPage(config) {
  var color = config.color || 'Purple';
  var hex = config.hex || '#8B5CF6';
  var chakra = config.chakra || 'Crown & Third Eye';
  var crystals = config.crystals || [];
  var slug = color.toLowerCase();

  // ----------------------------------------------------------
  // Section 1: Hero — 颜色名 + 描述 + 对应脉轮
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'gradient',
    background_color: hex,
    background_color_b: '#1A0A2E'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/crystal-guide/" style="color:#ccc;">Crystal Guide</a> &gt; <span style="color:#fff;">' + color + ' Crystals</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#CCCCCC' } }
    ),
    E.heading(color + ' Crystals: Meaning, Properties & Uses', {
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
    }),
    E.heading('Associated Chakra: ' + chakra, {
      fontSize: 20,
      color: hex,
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' },
      extra: { title_color: hex }
    }),
    E.textEditor(
      config.description || color + ' crystals carry a unique vibrational frequency that resonates with the ' + chakra + ' chakra. These stones have been revered across cultures for their ability to bring balance, healing, and spiritual growth. Explore the meanings and properties of ' + color.toLowerCase() + ' crystals and discover which ones call to your soul.',
      { fontSize: 17, color: '#DDDDDD', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 该颜色水晶列表 — 3-5种水晶卡片
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
        crystal.benefits || 'A powerful ' + color.toLowerCase() + ' crystal known for its unique energetic properties and deep spiritual resonance.',
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
    E.heading(color + ' Crystals & Their Meanings', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each ' + color.toLowerCase() + ' crystal carries its own unique vibration while sharing the unifying energy of the ' + color.toLowerCase() + ' spectrum. Discover the stone that resonates with your journey.',
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
    E.heading('Shop ' + color + ' Crystal Bracelets', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Handcrafted bracelets featuring genuine ' + color.toLowerCase() + ' crystals, ethically sourced and energetically cleansed for your practice.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(6)
  ]);

  // ----------------------------------------------------------
  // Section 4: 12颜色导航 — 其他颜色链接
  // ----------------------------------------------------------
  var otherColors = ALL_COLORS.filter(function (c) { return c.name !== color; });
  var colorNavCards = otherColors.map(function (c) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('18', '15', '18', '15'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('25', '33', '50')), [
      E.wrap({
        flex_direction: 'row',
        content_width: 'full',
        flex_gap: E.gap(8),
        flex_align_items: 'center'
      }, [
        E.wrap({
          content_width: 'full',
          background_background: 'classic',
          background_color: c.hex,
          _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' },
          extra: {
            _element_width: 'initial',
            width: { unit: 'px', size: 24, sizes: [] },
            height: { unit: 'px', size: 24, sizes: [] },
            border_border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true }
          }
        }, []),
        E.heading(c.name, {
          fontSize: 16,
          color: '#333333',
          align: 'left',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
        })
      ]),
      E.textEditor(
        c.chakra,
        { align: 'left', fontSize: 12, color: '#999999' }
      ),
      E.buttonWidget('Explore', '/crystal-guide/' + c.name.toLowerCase() + '-crystals')
    ]);
  });

  var colorNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Explore Crystals by Color', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every color in the crystal kingdom carries its own unique energy signature. From the grounding depths of black stones to the ethereal heights of white crystals, discover the full spectrum of crystal wisdom.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, colorNavCards)
  ]);

  return [
    heroSection,
    crystalListSection,
    productsSection,
    colorNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Purple Crystals 页面
// ============================================================
async function main() {
  var config = {
    color: 'Purple',
    hex: '#8B5CF6',
    chakra: 'Crown & Third Eye',
    description: 'Purple crystals are among the most spiritually powerful stones in the mineral kingdom. Their rich violet hues resonate with the higher chakras, opening gateways to intuition, wisdom, and divine connection. From the calming embrace of Amethyst to the transformative energy of Charoite, purple crystals guide you toward inner peace and spiritual awakening.',
    crystals: [
      {
        name: 'Amethyst',
        subtitle: 'The Stone of Peace',
        benefits: 'The quintessential purple crystal, Amethyst calms the mind, enhances intuition, and creates a protective bubble of spiritual light around the wearer. It is the ultimate stone for meditation and inner peace.',
        link: '/crystal-guide/amethyst-meaning'
      },
      {
        name: 'Lepidolite',
        subtitle: 'The Stone of Transition',
        benefits: 'With its natural lithium content, Lepidolite is a master at dissolving anxiety and bringing emotional balance. Its soft purple energy supports you through life changes with grace and calm.',
        link: '/crystal-guide/lepidolite-meaning'
      },
      {
        name: 'Charoite',
        subtitle: 'The Stone of Transformation',
        benefits: 'A rare and mesmerizing stone from Siberia, Charoite accelerates spiritual growth, overcomes fear, and helps you embrace your true path with courage and conviction.',
        link: '/crystal-guide/charoite-meaning'
      },
      {
        name: 'Sugilite',
        subtitle: 'The Healer\'s Stone',
        benefits: 'A deep purple stone of spiritual protection and unconditional love, Sugilite shields the aura from negativity while opening the heart to divine compassion and healing energy.',
        link: '/crystal-guide/sugilite-meaning'
      }
    ]
  };

  var data = generateColorPage(config);
  await E.createPage(
    config.color + ' Crystals: Meaning, Properties & Uses',
    config.color.toLowerCase() + '-crystals',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateColorPage;
