/**
 * Shop by Intention 分类页模板
 * URL: /product-category/[intention-slug]
 *
 * 6个Section:
 * 1. Hero — 意图名称+描述+面包屑
 * 2. 精选产品 — wdProductsWidget 占位
 * 3. 意图介绍 — "Understanding [Intention] Through Crystal Energy"
 * 4. 水晶指南 — 每种水晶简要卡片（图+名+功效+链接）
 * 5. 相关博客 — 3-4篇占位
 * 6. 相关意图推荐 — "You might also be interested in..."
 *
 * 用法:
 *   const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');
 *   const generateIntentionPage = require('./intention-category');
 *   const data = generateIntentionPage({ intention: 'Anxiety & Stress Relief', ... });
 *   await E.createPage('Title', 'slug', data, 'draft');
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片 URL
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

/**
 * 生成 Shop by Intention 分类页
 *
 * @param {Object} config
 * @param {string} config.intention       — 意图名称，如 "Anxiety & Stress Relief"
 * @param {string} config.slug            — URL slug，如 "anxiety-relief"
 * @param {string} config.heroSubtitle    — Hero 副标题描述
 * @param {string} config.description     — 意图介绍长文案（300-500词）
 * @param {Array}  config.crystals        — [{name, subtitle, benefits, image, link}]
 * @param {Array}  config.blogPosts       — [{title, image, link}]（3-4篇）
 * @param {Array}  config.relatedIntentions — [{name, slug, image}]（3-4个）
 */
function generateIntentionPage(config) {
  const {
    intention,
    slug,
    heroSubtitle,
    description,
    crystals = [],
    blogPosts = [],
    relatedIntentions = []
  } = config;

  const intentionLower = intention.toLowerCase();

  // ----------------------------------------------------------
  // Section 1: Hero — 意图名称 + 描述 + 面包屑
  // ----------------------------------------------------------
  const heroSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '30', b: '40', l: '30' }, mobile: { t: '30', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.textEditor(
      '<a href="/">Home</a> &gt; <a href="/collections">Shop by Intention</a> &gt; ' + intention,
      { align: 'left', fontSize: 14, color: '#999999' }
    ),
    E.heading('Crystals for ' + intention, {
      fontSize: 42,
      color: '#333333',
      align: 'center',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      heroSubtitle || 'Discover hand-selected crystals to support your journey toward ' + intentionLower + '. Each stone is energetically cleansed and ready to work with your intentions.',
      { fontSize: 18, color: '#666666', lineHeight: 28 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 精选产品 — wdProductsWidget
  // ----------------------------------------------------------
  const productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Shop ' + intention + ' Crystals', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wdProductsWidget(8)
  ]);

  // ----------------------------------------------------------
  // Section 3: 意图介绍 — "Understanding [Intention] Through Crystal Energy"
  // ----------------------------------------------------------
  const introSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#FFFFFF'
  }, [
    E.heading('Understanding ' + intention + ' Through Crystal Energy', {
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
      // 右侧文案
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.textEditor(
          description || 'Crystals have been used for thousands of years as tools for healing, meditation, and intention setting. When it comes to ' + intentionLower + ', certain stones carry unique vibrational frequencies that resonate with the energy centers in your body, helping to restore balance and promote a sense of well-being.<br><br>Each crystal in our curated ' + intentionLower + ' collection has been carefully selected for its specific properties. Whether worn as a bracelet, placed in your living space, or used during meditation, these crystals work as gentle reminders of your intention, helping you stay aligned with your goals throughout the day.<br><br>At Earthward, every piece is ethically sourced, energetically cleansed with sage and moonlight, and comes with a detailed energy guide card so you can start your practice right away. Discover the transformative power of crystal energy and find the perfect stone to support your journey.',
          { align: 'left', fontSize: 16, color: '#555555', lineHeight: 26, responsive: false }
        )
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 4: 水晶指南 — 每种水晶简要卡片
  // ----------------------------------------------------------
  const crystalCards = crystals.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth(String(Math.floor(100 / crystals.length)), '50', '100')), [
      E.imageWidget(crystal.image || PLACEHOLDER, {
        width: 100,
        radius: 8
      }),
      E.heading(crystal.name, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
      }),
      E.textEditor(
        crystal.subtitle || '',
        { align: 'center', fontSize: 14, color: '#999999', lineHeight: 20 }
      ),
      E.textEditor(
        crystal.benefits || 'A powerful crystal known for its unique energetic properties.',
        { align: 'center', fontSize: 15, color: '#666666', lineHeight: 22 }
      ),
      E.buttonWidget('Learn More', crystal.link || '#')
    ]);
  });

  const crystalGuideSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Your ' + intention + ' Crystal Guide', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore the crystals that resonate most deeply with the energy of ' + intentionLower + '. Each stone carries its own unique vibration and wisdom.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    )
  ].concat(crystalCards.length > 0 ? [
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, crystalCards)
  ] : []));

  // ----------------------------------------------------------
  // Section 5: 相关博客 — 3-4篇占位
  // ----------------------------------------------------------
  const blogCards = (blogPosts.length > 0 ? blogPosts : [
    { title: 'How to Use Crystals for ' + intention, link: '/blog/how-to-use-crystals-' + slug },
    { title: 'The Science Behind Crystal Healing', link: '/blog/science-behind-crystal-healing' },
    { title: 'Beginner\'s Guide to Crystal Intention Setting', link: '/blog/beginners-guide-intention-setting' }
  ]).map(function (post) {
    return E.imageBox(
      post.image || PLACEHOLDER,
      post.title,
      'Discover practical tips and spiritual insights to deepen your crystal practice.',
      post.link
    );
  });

  const blogSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Related Articles', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, blogCards.map(function (card) {
      return E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('33', '50', '100')), [card]);
    }))
  ]);

  // ----------------------------------------------------------
  // Section 6: 相关意图推荐
  // ----------------------------------------------------------
  const defaultRelated = [
    { name: 'Love & Relationships', slug: 'love-relationships', image: PLACEHOLDER },
    { name: 'Sleep & Calm', slug: 'sleep-calm', image: PLACEHOLDER },
    { name: 'Protection & Clearing', slug: 'protection-clearing', image: PLACEHOLDER },
    { name: 'Abundance & Success', slug: 'abundance-success', image: PLACEHOLDER }
  ];
  const relatedItems = relatedIntentions.length > 0 ? relatedIntentions : defaultRelated;

  const relatedCards = relatedItems.map(function (item) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15')
    }, E.rWidth('25', '50', '100')), [
      E.imageBox(
        item.image || PLACEHOLDER,
        item.name,
        'Explore crystals for ' + item.name.toLowerCase(),
        '/product-category/' + item.slug
      )
    ]);
  });

  const relatedSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('You Might Also Be Interested In...', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, relatedCards)
  ]);

  return [
    heroSection,
    productsSection,
    introSection,
    crystalGuideSection,
    blogSection,
    relatedSection
  ];
}

// ============================================================
// Main — 示例：生成 Anxiety & Stress Relief 页面
// ============================================================
async function main() {
  const config = {
    intention: 'Anxiety & Stress Relief',
    slug: 'anxiety-relief',
    heroSubtitle: 'Find your calm. Discover powerful crystals hand-selected to ease anxiety, release stress, and restore inner peace.',
    crystals: [
      {
        name: 'Amethyst',
        subtitle: 'The Stone of Peace',
        benefits: 'A soothing stone that calms the mind, eases anxiety, and promotes restful sleep. Its gentle purple energy dissolves nervous tension.',
        link: '/crystal-guide/amethyst-meaning'
      },
      {
        name: 'Lepidolite',
        subtitle: 'The Stone of Transition',
        benefits: 'Rich in natural lithium, Lepidolite is one of the best crystals for anxiety relief, bringing deep emotional balance and calm.',
        link: '/crystal-guide/lepidolite-meaning'
      },
      {
        name: 'Howlite',
        subtitle: 'The Stone of Calm',
        benefits: 'An ultra-calming stone that quiets an overactive mind, reduces stress, and encourages patient, thoughtful responses.',
        link: '/crystal-guide/howlite-meaning'
      },
      {
        name: 'Black Tourmaline',
        subtitle: 'The Shield Stone',
        benefits: 'A powerful grounding stone that absorbs negative energy and creates a protective shield, helping you feel safe and secure.',
        link: '/crystal-guide/black-tourmaline-meaning'
      }
    ],
    relatedIntentions: [
      { name: 'Sleep & Calm', slug: 'sleep-calm' },
      { name: 'Protection & Clearing', slug: 'protection-clearing' },
      { name: 'Focus & Clarity', slug: 'focus-clarity' }
    ]
  };

  const data = generateIntentionPage(config);
  await E.createPage(
    'Crystals for ' + config.intention,
    config.slug,
    data,
    'draft'
  );
}

// 防止被 require 时自动执行
if (require.main === module) {
  main().catch(function (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

module.exports = generateIntentionPage;
