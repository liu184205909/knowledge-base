/**
 * Shop by Stone 分类页模板
 * URL: /collections/[crystal-name]-crystals
 *
 * 5个Section:
 * 1. Hero — 水晶名+诗意副标题+描述
 * 2. 精选产品 — wdProductsWidget
 * 3. 水晶简介 — 简短百科介绍（链接到完整百科页）
 * 4. 相关博客 — 3篇占位
 * 5. 其他水晶推荐 — 4-6个其他水晶链接
 *
 * 用法:
 *   node shop-by-stone.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 常见水晶数据（用于导航推荐）
// ============================================================
const ALL_STONES = [
  { name: 'Amethyst',         subtitle: 'The Stone of Peace' },
  { name: 'Rose Quartz',      subtitle: 'The Stone of Love' },
  { name: 'Citrine',          subtitle: 'The Stone of Abundance' },
  { name: 'Black Tourmaline', subtitle: 'The Shield Stone' },
  { name: 'Clear Quartz',     subtitle: 'The Master Healer' },
  { name: 'Tiger Eye',        subtitle: 'The Stone of Courage' },
  { name: 'Moonstone',        subtitle: 'The Stone of New Beginnings' },
  { name: 'Obsidian',         subtitle: 'The Mirror Stone' },
  { name: 'Lepidolite',       subtitle: 'The Stone of Transition' },
  { name: 'Selenite',         subtitle: 'The Stone of Clarity' },
  { name: 'Green Aventurine', subtitle: 'The Stone of Luck' },
  { name: 'Fluorite',         subtitle: 'The Stone of Focus' },
  { name: 'Howlite',          subtitle: 'The Stone of Calm' },
  { name: 'Rhodonite',        subtitle: 'The Stone of Compassion' },
  { name: 'Malachite',        subtitle: 'The Stone of Transformation' },
  { name: 'Hematite',         subtitle: 'The Grounding Stone' }
];

/**
 * 生成 Shop by Stone 分类页
 *
 * @param {Object} config
 * @param {string} config.crystal          — 水晶名，如 "Amethyst"
 * @param {string} config.poeticTitle      — 诗意副标题，如 "The Stone of Peace"
 * @param {string} config.heroImage        — Hero 背景图 URL
 * @param {string} config.description      — 水晶描述文案（200-300词简介）
 * @param {string} config.encyclopediaUrl  — 完整百科页链接
 * @param {Array}  config.blogPosts        — [{title, image, link}]（3篇）
 * @param {Array}  config.relatedStones    — [{name, subtitle, image}]（4-6个）
 */
function generateStonePage(config) {
  var crystal = config.crystal || 'Amethyst';
  var poeticTitle = config.poeticTitle || 'The Stone of Wisdom';
  var encyclopediaUrl = config.encyclopediaUrl || '/crystal-guide/' + crystal.toLowerCase().replace(/\s+/g, '-') + '-meaning';
  var blogPosts = config.blogPosts || [];
  var relatedStones = config.relatedStones || [];
  var slug = crystal.toLowerCase().replace(/\s+/g, '-') + '-crystals';

  // ----------------------------------------------------------
  // Section 1: Hero — 水晶名 + 诗意副标题 + 描述
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.textEditor(
      '<a href="/">Home</a> &gt; <a href="/collections">Shop by Stone</a> &gt; ' + crystal,
      { align: 'left', fontSize: 14, color: '#999999' }
    ),
    E.heading(crystal + ' Crystals', {
      fontSize: 44,
      color: '#333333',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(poeticTitle, {
      fontSize: 22,
      color: '#7C3AED',
      align: 'center',
      fontWeight: '400',
      extra: { title_color: '#7C3AED', typography_font_style: 'italic' },
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.heroDescription || 'Discover the timeless beauty and powerful energy of ' + crystal + '. Each piece in our collection is ethically sourced, energetically cleansed, and ready to support your journey. Whether you seek peace, love, protection, or abundance, ' + crystal + ' holds the wisdom to guide you.',
      { fontSize: 17, color: '#666666', lineHeight: 26 }
    ),
    E.spacer('15'),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      content_width: 'full'
    }, [
      E.buttonWidget('Shop ' + crystal + ' Below', '#products'),
      E.buttonWidget('Learn ' + crystal + ' Meaning', encyclopediaUrl)
    ])
  ]);

  // ----------------------------------------------------------
  // Section 2: 精选产品 — wdProductsWidget
  // ----------------------------------------------------------
  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    extra: { _element_id: 'products' }
  }, [
    E.heading('Shop ' + crystal + ' Collection', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each bracelet is handcrafted with genuine ' + crystal + ', ethically sourced and energetically cleansed under moonlight.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(8)
  ]);

  // ----------------------------------------------------------
  // Section 3: 水晶简介 — 简短百科介绍 + 链接到完整百科页
  // ----------------------------------------------------------
  var introSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#FFFFFF'
  }, [
    E.heading('About ' + crystal, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      // 左侧图片
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('45', '100', '100')), [
        E.imageWidget(config.heroImage || PLACEHOLDER, {
          width: 100,
          radius: 10
        })
      ]),
      // 右侧百科简介
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.textEditor(
          config.description || crystal + ' has been treasured for centuries as one of the most powerful healing stones in the mineral kingdom. Its unique crystalline structure and vibrational frequency make it a versatile ally for spiritual growth, emotional healing, and physical well-being.<br><br>In the scientific realm, ' + crystal + ' is prized for its geological properties and the fascinating processes that formed it deep within the Earth over millions of years. From a spiritual perspective, it is revered across cultures as a stone of profound metaphysical power, connecting the wearer to higher states of consciousness and divine wisdom.<br><br>Psychologically, ' + crystal + ' supports mindfulness practices by serving as a tangible focal point for intention-setting. When worn as a bracelet, it becomes a constant, gentle reminder of your goals and the energy you wish to cultivate in your daily life.',
          { align: 'left', fontSize: 16, color: '#555555', lineHeight: 26, responsive: false }
        ),
        E.spacer('15'),
        E.buttonWidget('Read Full ' + crystal + ' Encyclopedia', encyclopediaUrl)
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 4: 相关博客 — 3篇占位
  // ----------------------------------------------------------
  var defaultBlogPosts = [
    { title: 'How to Use ' + crystal + ' for Healing and Meditation', link: '/blog/how-to-use-' + crystal.toLowerCase().replace(/\s+/g, '-') + '-healing' },
    { title: 'The Hidden Meanings Behind ' + crystal + ': A Complete Guide', link: '/blog/' + crystal.toLowerCase().replace(/\s+/g, '-') + '-complete-guide' },
    { title: crystal + ' Care 101: Cleansing, Charging & Programming Your Stone', link: '/blog/' + crystal.toLowerCase().replace(/\s+/g, '-') + '-care-guide' }
  ];
  var posts = blogPosts.length > 0 ? blogPosts : defaultBlogPosts;

  var blogCards = posts.map(function (post) {
    return E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('33', '50', '100')), [
      E.imageBox(
        post.image || PLACEHOLDER,
        post.title,
        'Explore the wisdom and practical guidance behind ' + crystal + ' energy.',
        post.link
      )
    ]);
  });

  var blogSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Learn More About ' + crystal, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, blogCards)
  ]);

  // ----------------------------------------------------------
  // Section 5: 其他水晶推荐 — 4-6个其他水晶链接
  // ----------------------------------------------------------
  var defaultRelated = ALL_STONES
    .filter(function (s) { return s.name !== crystal; })
    .slice(0, 6);
  var related = relatedStones.length > 0 ? relatedStones : defaultRelated;

  var stoneNavCards = related.map(function (stone) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '20', '15'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth(String(Math.floor(100 / related.length)), '33', '50')), [
      E.imageWidget(stone.image || PLACEHOLDER, {
        width: 100,
        radius: 50
      }),
      E.heading(stone.name, {
        fontSize: 16,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        stone.subtitle || '',
        { align: 'center', fontSize: 13, color: '#999999', lineHeight: 18 }
      ),
      E.buttonWidget('Shop ' + stone.name, '/collections/' + stone.name.toLowerCase().replace(/\s+/g, '-') + '-crystals')
    ]);
  });

  var stoneNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Explore More Crystals', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every crystal in our collection carries its own unique energy and story. Discover the stone that resonates with your soul.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, stoneNavCards)
  ]);

  return [
    heroSection,
    productsSection,
    introSection,
    blogSection,
    stoneNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Amethyst Crystals 页面
// ============================================================
async function main() {
  var config = {
    crystal: 'Amethyst',
    poeticTitle: 'The Stone of Peace',
    heroDescription: 'Amethyst has enchanted humanity for millennia with its deep purple hues and profound spiritual energy. From ancient Greek amulets to modern meditation practices, this extraordinary crystal continues to be one of the most sought-after stones for peace, intuition, and spiritual growth. Discover our hand-selected Amethyst collection and let its calming wisdom transform your daily life.',
    description: 'Amethyst is a variety of quartz that gets its stunning purple color from natural irradiation of iron impurities within the crystal lattice. Found in locations from Brazil to Zambia, each piece carries the unique geological fingerprint of its origin.<br><br>In the spiritual tradition, Amethyst is considered the premier stone for the Crown and Third Eye chakras. It opens the gateway to higher consciousness, enhances intuition, and creates a protective shield of spiritual light around the wearer. Ancient Greeks believed it could prevent intoxication, and the word "amethystos" literally means "not intoxicated."<br><br>From a psychological perspective, Amethyst is a powerful ally for mindfulness and stress reduction. Its calming energy helps quiet an overactive mind, making it an ideal companion for meditation, sleep, and emotional healing. When worn as a bracelet, Amethyst serves as a gentle, constant reminder to return to your center and breathe.',
    encyclopediaUrl: '/crystal-guide/amethyst-meaning',
    relatedStones: [
      { name: 'Rose Quartz', subtitle: 'The Stone of Love' },
      { name: 'Clear Quartz', subtitle: 'The Master Healer' },
      { name: 'Lepidolite', subtitle: 'The Stone of Transition' },
      { name: 'Selenite', subtitle: 'The Stone of Clarity' },
      { name: 'Black Tourmaline', subtitle: 'The Shield Stone' }
    ]
  };

  var data = generateStonePage(config);
  await E.createPage(
    config.crystal + ' Crystals — ' + config.poeticTitle,
    config.crystal.toLowerCase().replace(/\s+/g, '-') + '-crystals',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateStonePage;
