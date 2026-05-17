/**
 * Blog 页面模板
 * URL: /blog
 *
 * 5个Section:
 * 1. 标题 — "Crystal Wisdom Blog"
 * 2. 分类导航 — All/Beginner/Meanings/Moon Phases/Angel Numbers/Chakras/Zodiac/Spirituality/Seasonal
 * 3. 特色文章 — 2-3篇置顶占位
 * 4. 最新文章 — 9-12篇占位
 * 5. Crystal of the Month — 月度主推水晶+文章占位
 *
 * 用法:
 *   node blog.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.shared.card.url;
var PLACEHOLDER_WIDE = IMAGES.shared.wide.url;

/**
 * 生成 Blog 页面
 *
 * @param {Object} config
 * @param {Array}  config.featuredPosts  — [{title, subtitle, image, link}]（2-3篇）
 * @param {Array}  config.latestPosts    — [{title, subtitle, image, link}]（9-12篇）
 * @param {Object} config.crystalOfMonth — {name, subtitle, description, image, link}
 * @param {Array}  config.categories     — [{name, slug}] 分类导航
 */
function generateBlogPage(config) {
  var featuredPosts = config.featuredPosts || [];
  var latestPosts = config.latestPosts || [];
  var crystalOfMonth = config.crystalOfMonth || {};
  var categories = config.categories || [
    { name: 'All',           slug: '/blog' },
    { name: 'Beginner',      slug: '/blog/category/beginner' },
    { name: 'Meanings',      slug: '/blog/category/meanings' },
    { name: 'Moon Phases',   slug: '/blog/category/moon-phases' },
    { name: 'Angel Numbers', slug: '/blog/category/angel-numbers' },
    { name: 'Chakras',       slug: '/blog/category/chakras' },
    { name: 'Zodiac',        slug: '/blog/category/zodiac' },
    { name: 'Spirituality',  slug: '/blog/category/spirituality' },
    { name: 'Seasonal',      slug: '/blog/category/seasonal' }
  ];

  // ----------------------------------------------------------
  // Section 1: 标题 — "Crystal Wisdom Blog"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '50', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_image: {
      url: IMAGES.blog.hero.url,
      id: 0, size: '', alt: IMAGES.blog.hero.alt, source: 'library'
    },
    background_position: 'center center',
    background_repeat: 'no-repeat',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: '#1A0A2E',
    background_overlay_opacity: { unit: 'px', size: 0.72, sizes: [] }
  }, [
    E.heading('Crystal Wisdom Blog', {
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore the fascinating world of crystals. From beginner guides to deep spiritual insights, discover articles that illuminate your crystal journey.',
      { fontSize: 18, color: '#CCCCCC', lineHeight: 28 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 分类导航 — 按钮组
  // ----------------------------------------------------------
  var categoryButtons = categories.map(function (cat) {
    return E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('auto', 'auto', 'auto')), [
      E.buttonWidget(cat.name, cat.slug)
    ]);
  });

  var categorySection = E.section({
    _padding: E.rPadding('20', '40', '20', '40', { tablet: { t: '15', r: '20', b: '15', l: '20' }, mobile: { t: '10', r: '15', b: '10', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(10),
      flex_wrap: 'wrap'
    }, categoryButtons)
  ]);

  // ----------------------------------------------------------
  // Section 3: 特色文章 — 2-3篇置顶
  // ----------------------------------------------------------
  var defaultFeatured = [
    {
      title: 'The Ultimate Beginner\'s Guide to Crystal Healing',
      subtitle: 'Everything you need to know to start your crystal journey \u2014 from choosing your first stone to cleansing and programming it with intention.',
      image: IMAGES.blog.beginnerGuide.url,
      link: '/blog/beginners-guide-crystal-healing'
    },
    {
      title: 'How to Cleanse and Charge Your Crystals Under the Full Moon',
      subtitle: 'A step-by-step guide to the most powerful crystal cleansing method, aligned with lunar energy.',
      image: IMAGES.blog.fullMoon.url,
      link: '/blog/cleanse-charge-crystals-full-moon'
    },
    {
      title: 'Angel Numbers 111, 222, 333: What the Universe Is Telling You',
      subtitle: 'Decode the hidden messages behind repeating numbers and discover which crystals amplify their energy.',
      image: IMAGES.blog.angelNumbers.url,
      link: '/blog/angel-numbers-meaning'
    }
  ];

  var featured = featuredPosts.length > 0 ? featuredPosts : defaultFeatured;

  // 第一篇大图
  var firstFeatured = E.wrap(Object.assign({
    flex_direction: 'column'
  }, E.rWidth('100', '100', '100')), [
    E.imageWidget(featured[0].image || PLACEHOLDER_WIDE, {
      width: 100,
      radius: 10
    }),
    E.heading(featured[0].title, {
      fontSize: 26,
      color: '#333333',
      align: 'left',
      padding: { unit: 'px', top: '15', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      featured[0].subtitle || '',
      { align: 'left', fontSize: 16, color: '#666666', lineHeight: 24 }
    ),
    E.buttonWidget('Read Article \u2192', featured[0].link)
  ]);

  // 其余篇小图并排
  var otherFeaturedCards = featured.slice(1).map(function (post) {
    return E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('50', '100', '100')), [
      E.imageBox(
        post.image || PLACEHOLDER,
        post.title,
        post.subtitle || 'Explore this fascinating topic and deepen your crystal knowledge.',
        post.link
      )
    ]);
  });

  var featuredSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Featured Articles', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    firstFeatured,
    E.spacer('20'),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20)
    }, otherFeaturedCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: 最新文章 — 9-12篇占位
  // ----------------------------------------------------------
  var defaultLatest = [
    { title: 'Amethyst Meaning: The Complete Guide to the Stone of Peace', image: IMAGES.blog.amethyst.url, link: '/blog/amethyst-meaning-guide' },
    { title: 'Rose Quartz: How the Stone of Love Can Transform Your Relationships', image: IMAGES.blog.roseQuartz.url, link: '/blog/rose-quartz-relationships' },
    { title: 'Best Crystals for Sleep: 7 Stones for Deep, Restful Nights', image: IMAGES.blog.sleep.url, link: '/blog/crystals-for-sleep' },
    { title: 'Citrine: Your Guide to the Stone of Abundance and Prosperity', image: IMAGES.blog.citrine.url, link: '/blog/citrine-abundance-guide' },
    { title: 'How to Create a Crystal Grid for Manifestation', image: IMAGES.blog.grid.url, link: '/blog/crystal-grid-manifestation' },
    { title: 'Black Tourmaline: The Ultimate Protection Stone Explained', image: IMAGES.blog.protection.url, link: '/blog/black-tourmaline-protection' },
    { title: 'Chakra Healing with Crystals: A Complete Beginner\'s Guide', image: IMAGES.blog.chakra.url, link: '/blog/chakra-healing-beginners' },
    { title: 'Moon Phases and Crystals: How to Align Your Practice with Lunar Cycles', image: IMAGES.blog.moonPhases.url, link: '/blog/moon-phases-crystals' },
    { title: 'Clear Quartz: Why It\'s Called the Master Healer', image: IMAGES.blog.clearQuartz.url, link: '/blog/clear-quartz-master-healer' }
  ];

  var latest = latestPosts.length > 0 ? latestPosts : defaultLatest;

  var latestCards = latest.map(function (post) {
    return E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('33', '50', '100')), [
      E.imageBox(
        post.image || PLACEHOLDER,
        post.title,
        post.subtitle || 'Dive deeper into the world of crystals with this insightful article.',
        post.link
      )
    ]);
  });

  var latestSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Latest Articles', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, latestCards)
  ]);

  // ----------------------------------------------------------
  // Section 5: Crystal of the Month — 月度主推水晶+文章占位
  // ----------------------------------------------------------
  var defaultCrystalOfMonth = {
    name: 'Amethyst',
    subtitle: 'The Stone of Peace',
    description: 'This month, we\'re celebrating Amethyst \u2014 one of the most beloved crystals in the healing world. Known for its ability to calm the mind, ease anxiety, and enhance spiritual awareness, Amethyst is the perfect companion as we transition into a new season. Discover its rich history, powerful properties, and how to incorporate it into your daily practice.',
    image: IMAGES.crystals.amethyst.url,
    link: '/crystal-guide/amethyst-meaning',
    articleLink: '/blog/amethyst-crystal-of-the-month'
  };

  var cotm = Object.assign({}, defaultCrystalOfMonth, crystalOfMonth || {});

  var crystalOfMonthSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Crystal of the Month', {
      fontSize: 14,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '600',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
      extra: { title_color: '#C4A1FF' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('45', '100', '100')), [
        E.imageWidget(cotm.image || PLACEHOLDER, {
          width: 100,
          radius: 10
        })
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.heading(cotm.name, {
          fontSize: 36,
          color: '#FFFFFF',
          align: 'left',
          fontWeight: '700',
          padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
        }),
        E.heading(cotm.subtitle || '', {
          fontSize: 18,
          color: '#C4A1FF',
          align: 'left',
          fontWeight: '400',
          padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }),
        E.textEditor(
          cotm.description || 'Discover why this crystal is our featured stone of the month.',
          { align: 'left', fontSize: 16, color: '#CCCCCC', lineHeight: 26, extra: { text_color: '#CCCCCC' } }
        ),
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(15)
        }, [
          E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', '100', '100')), [
            E.buttonWidget('Read Full Article \u2192', cotm.articleLink || '#')
          ]),
          E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', '100', '100')), [
            E.buttonWidget('Shop ' + cotm.name, cotm.link || '#')
          ])
        ])
      ])
    ])
  ]);

  return [
    heroSection,
    categorySection,
    featuredSection,
    latestSection,
    crystalOfMonthSection
  ];
}

// ============================================================
// Main — 示例：生成 Blog 页面
// ============================================================
async function main() {
  var config = {
    crystalOfMonth: {
      name: 'Moonstone',
      subtitle: 'The Stone of New Beginnings',
      description: 'This month, we\'re celebrating Moonstone \u2014 the ethereal gem of new beginnings and inner growth. With its mesmerizing adularescence that mirrors the light of the moon, this crystal has been revered across cultures for millennia. Whether you\'re starting a new chapter, seeking deeper intuition, or connecting with lunar cycles, Moonstone is your celestial companion. Discover its ancient lore, healing properties, and how to harness its gentle yet powerful energy.',
      link: '/crystal-guide/moonstone-meaning',
      articleLink: '/blog/moonstone-crystal-of-the-month'
    }
  };

  var data = generateBlogPage(config);
  await E.createPage('Crystal Wisdom Blog', 'blog', data, 'draft');
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateBlogPage;
