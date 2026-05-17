/**
 * Mystery Crystal Box 页面模板
 * URL: /collections/mystery-box
 *
 * 6个Section:
 * 1. Hero — "Mystery Crystal Box"
 * 2. 档位选择 — 4档: $15入门/$35进阶/$75高端/$99至尊
 * 3. 本月主题 — 当月神秘主题预览
 * 4. 往期回顾 — 3-4个往期盒子占位
 * 5. FAQ — 手风琴（3-4题）
 * 6. 用户见证 — 4-6条开箱评价
 *
 * 用法:
 *   node mystery-box.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 档位默认数据
// ============================================================
var DEFAULT_TIERS = [
  {
    name: 'Starter Box',
    price: '$15',
    subtitle: 'Perfect for Beginners',
    description: '1-2 hand-selected crystal bracelets, a cleansing guide card, and a surprise mini crystal. The ideal introduction to crystal energy.',
    color: '#E8F5E9'
  },
  {
    name: 'Explorer Box',
    price: '$35',
    subtitle: 'For the Crystal Curious',
    description: '2-3 premium crystal bracelets, a raw crystal specimen, energy guide card, and a velvet pouch. A deeper dive into crystal wisdom.',
    color: '#E3F2FD'
  },
  {
    name: 'Luxe Box',
    price: '$75',
    subtitle: 'The Crystal Enthusiast',
    description: '3-4 high-quality crystal bracelets, a large raw specimen, essential oil roller, intention card set, and premium gift packaging. Curated for transformation.',
    color: '#FFF3E0'
  },
  {
    name: 'Supreme Box',
    price: '$99',
    subtitle: 'The Ultimate Experience',
    description: '4-5 rare crystal bracelets, a collector-grade specimen, crystal grid kit, sage bundle, guided meditation access, and luxury unboxing experience. For the devoted crystal soul.',
    color: '#F3E5F5'
  }
];

/**
 * 生成 Mystery Crystal Box 页面
 *
 * @param {Object} config
 * @param {Array}  config.tiers          — [{name, price, subtitle, description, color}] 档位
 * @param {Object} config.monthlyTheme   — {title, subtitle, description, image, teasers: []}
 * @param {Array}  config.pastBoxes      — [{title, subtitle, image, link}] 往期盒子
 * @param {Array}  config.faqItems       — [{title, content}] FAQ
 * @param {Array}  config.testimonials   — [{name, text, product, rating}] 用户评价
 */
function generateMysteryBoxPage(config) {
  var tiers = config.tiers && config.tiers.length > 0 ? config.tiers : DEFAULT_TIERS;
  var monthlyTheme = config.monthlyTheme || {};
  var pastBoxes = config.pastBoxes || [];
  var faqItems = config.faqItems || [];
  var testimonials = config.testimonials || [];

  // ----------------------------------------------------------
  // Section 1: Hero — "Mystery Crystal Box"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_image: {
      url: IMAGES.mysteryBox.hero.url,
      id: 0, size: '', alt: IMAGES.mysteryBox.hero.alt, source: 'library'
    },
    background_position: 'center center',
    background_repeat: 'no-repeat',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: '#1A0A2E',
    background_overlay_opacity: { unit: 'px', size: 0.72, sizes: [] }
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/collections" style="color:#ccc;">Collections</a> &gt; <span style="color:#fff;">Mystery Crystal Box</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Mystery Crystal Box', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Let the universe choose your crystals. Each Mystery Crystal Box is intuitively curated with hand-selected, energetically cleansed crystals \u2014 a surprise delivered to your door every month.',
      { fontSize: 18, color: '#CCCCCC', lineHeight: 28, extra: { text_color: '#CCCCCC' } }
    ),
    E.buttonWidget('Choose Your Box \u2193', '#tiers'),
    E.spacer('10'),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(30)
    }, [
      E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
        E.textEditor(
          '<span style="font-size:28px;font-weight:700;color:#C4A1FF;">4,200+</span><br><span style="font-size:13px;color:#aaa;">Boxes Shipped</span>',
          { align: 'center', fontSize: 14, color: '#CCCCCC', extra: { text_color: '#CCCCCC' } }
        )
      ]),
      E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
        E.textEditor(
          '<span style="font-size:28px;font-weight:700;color:#C4A1FF;">4.9/5</span><br><span style="font-size:13px;color:#aaa;">Average Rating</span>',
          { align: 'center', fontSize: 14, color: '#CCCCCC', extra: { text_color: '#CCCCCC' } }
        )
      ]),
      E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
        E.textEditor(
          '<span style="font-size:28px;font-weight:700;color:#C4A1FF;">100%</span><br><span style="font-size:13px;color:#aaa;">Natural Crystals</span>',
          { align: 'center', fontSize: 14, color: '#CCCCCC', extra: { text_color: '#CCCCCC' } }
        )
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 2: 档位选择 — 4档卡片
  // ----------------------------------------------------------
  var tierCards = tiers.map(function (tier) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('30', '25', '30', '25'),
      background_background: 'classic',
      background_color: tier.color || '#FAFAFA'
    }, E.rWidth('25', '50', '100')), [
      E.heading(tier.price, {
        fontSize: 36,
        color: '#333333',
        align: 'center',
        fontWeight: '800',
        padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.heading(tier.name, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        tier.subtitle || '',
        { align: 'center', fontSize: 14, color: '#7C3AED', lineHeight: 20 }
      ),
      E.divider(),
      E.textEditor(
        tier.description || '',
        { align: 'center', fontSize: 15, color: '#666666', lineHeight: 23 }
      ),
      E.buttonWidget('Select ' + tier.name, '/collections/mystery-box/' + (tier.name || '').toLowerCase().replace(/\s+/g, '-'))
    ]);
  });

  var tiersSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Choose Your Mystery Box', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Four tiers of crystal magic, from curious beginner to devoted collector. Every box is a unique surprise.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, tierCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: 本月主题 — 当月神秘主题预览
  // ----------------------------------------------------------
  var defaultTeasers = [
    'Crystals connected to this month\'s celestial energy',
    'A rare specimen chosen for its extraordinary properties',
    'An exclusive intention-setting ritual guide'
  ];
  var teasers = monthlyTheme.teasers && monthlyTheme.teasers.length > 0 ? monthlyTheme.teasers : defaultTeasers;
  var teaserHtml = teasers.map(function (t) {
    return '<li style="margin-bottom:8px;color:#666;font-size:15px;">' + t + '</li>';
  }).join('');

  var monthlyThemeSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('This Month\'s Mystery Theme', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('45', '100', '100')), [
        E.imageWidget(monthlyTheme.image || PLACEHOLDER, {
          width: 100,
          radius: 10
        })
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.heading(monthlyTheme.title || 'Celestial Awakening', {
          fontSize: 24,
          color: '#333333',
          align: 'left',
          fontWeight: '700',
          padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.textEditor(
          monthlyTheme.subtitle || 'May 2026 Mystery Theme',
          { align: 'left', fontSize: 14, color: '#7C3AED' }
        ),
        E.textEditor(
          monthlyTheme.description || 'This month\'s box is inspired by the powerful Taurus New Moon energy. Each crystal has been intuitively chosen to help you ground your dreams into reality and cultivate lasting abundance in every area of your life.',
          { align: 'left', fontSize: 16, color: '#666666', lineHeight: 26 }
        ),
        E.textEditor(
          '<strong>What\'s inside (hint):</strong><ul style="padding-left:20px;margin-top:8px;">' + teaserHtml + '</ul>',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 24 }
        ),
        E.buttonWidget('Order This Month\'s Box \u2192', '/collections/mystery-box')
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 4: 往期回顾 — 3-4个往期盒子占位
  // ----------------------------------------------------------
  var defaultPast = [
    { title: 'April 2026: Renewal & Growth', subtitle: 'Featuring Green Aventurine, Moss Agate, and a rare Peridot specimen', image: IMAGES.mysteryBox.april.url, link: '#' },
    { title: 'March 2026: Awakening Intuition', subtitle: 'Featuring Labradorite, Amethyst, and a Selenite charging wand', image: IMAGES.mysteryBox.march.url, link: '#' },
    { title: 'February 2026: Love & Compassion', subtitle: 'Featuring Rose Quartz, Rhodonite, and a Pink Opal heart', image: IMAGES.mysteryBox.february.url, link: '#' },
    { title: 'January 2026: New Year, New Energy', subtitle: 'Featuring Clear Quartz, Citrine, and a Black Tourmaline protector', image: IMAGES.mysteryBox.january.url, link: '#' }
  ];

  var pastItems = pastBoxes.length > 0 ? pastBoxes : defaultPast;

  var pastCards = pastItems.map(function (box) {
    return E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('25', '50', '100')), [
      E.imageBox(
        box.image || PLACEHOLDER,
        box.title,
        box.subtitle || 'A beautifully curated crystal box from a previous month.',
        box.link
      )
    ]);
  });

  var pastSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Past Mystery Boxes', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Take a peek at previous boxes our community has unboxed and loved.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, pastCards)
  ]);

  // ----------------------------------------------------------
  // Section 5: FAQ — 手风琴（3-4题）
  // ----------------------------------------------------------
  var defaultFaq = [
    {
      title: 'What\'s inside the Mystery Crystal Box?',
      content: 'Each box contains hand-selected, ethically sourced crystal bracelets and specimens based on your chosen tier. Every crystal is energetically cleansed with sage and charged under moonlight before shipping. You\'ll also receive an energy guide card explaining each crystal\'s properties and suggested uses.'
    },
    {
      title: 'Can I choose which crystals I receive?',
      content: 'The magic of the Mystery Crystal Box is the surprise! Each box is intuitively curated based on the monthly theme and celestial energy. However, if you have specific crystal allergies or preferences, you can note them at checkout and we\'ll do our best to accommodate.'
    },
    {
      title: 'What is your return and exchange policy?',
      content: 'We want you to love every crystal you receive. If you\'re not satisfied with your Mystery Crystal Box, you can return it within 30 days for a full refund or exchange. The crystals must be in their original condition and packaging. Shipping costs for returns are covered by us.'
    },
    {
      title: 'How often can I order a Mystery Crystal Box?',
      content: 'You can order a one-time box whenever you like, or subscribe monthly to receive a new surprise every month at a discounted rate. Monthly subscribers also get early access to limited-edition themes and exclusive crystals not available in our regular shop.'
    }
  ];

  var faqData = faqItems.length > 0 ? faqItems : defaultFaq;

  var faqSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Frequently Asked Questions', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.accordion(faqData)
  ]);

  // ----------------------------------------------------------
  // Section 6: 用户见证 — 4-6条开箱评价
  // ----------------------------------------------------------
  var defaultTestimonials = [
    {
      name: 'Sarah M.',
      text: 'I was blown away by the quality! The crystals were absolutely stunning, and the guide card helped me understand each one\'s energy. My Explorer Box had a beautiful Labradorite that literally changed color in different lights. Already ordered next month\'s!',
      product: 'Explorer Box',
      rating: '5'
    },
    {
      name: 'James K.',
      text: 'Bought the Starter Box as a gift for my sister and she loved it so much I had to get one for myself. The packaging was gorgeous \u2014 velvet pouch, sage stick, and a handwritten-style note. Feels personal and premium.',
      product: 'Starter Box',
      rating: '5'
    },
    {
      name: 'Emily R.',
      text: 'The Supreme Box is worth every penny. Rare crystals I\'ve never seen in stores, a crystal grid kit, and a meditation guide that\'s actually helpful. This is not just a product \u2014 it\'s an experience.',
      product: 'Supreme Box',
      rating: '5'
    },
    {
      name: 'Mia L.',
      text: 'I\'ve subscribed for 3 months now and each box has been completely different and magical. Last month\'s theme was about intuition and I received a beautiful Amethyst cluster that sits on my desk now. It brings me so much calm.',
      product: 'Monthly Subscriber',
      rating: '5'
    },
    {
      name: 'David P.',
      text: 'Was skeptical at first but decided to try the Luxe Box. The quality of the crystals exceeded my expectations \u2014 genuine, well-polished, and energetically charged (you can feel it). The essential oil roller was a nice bonus.',
      product: 'Luxe Box',
      rating: '5'
    }
  ];

  var testimonialData = testimonials.length > 0 ? testimonials : defaultTestimonials;

  var testimonialCards = testimonialData.map(function (t) {
    var stars = '';
    var count = parseInt(t.rating || '5', 10);
    for (var i = 0; i < count; i++) { stars += '\u2605'; }

    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '25', '25', '25'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth('33', '50', '100')), [
      E.textEditor(
        '<span style="color:#FFD700;font-size:20px;">' + stars + '</span>',
        { align: 'left', fontSize: 20 }
      ),
      E.textEditor(
        '"' + t.text + '"',
        { align: 'left', fontSize: 15, color: '#555555', lineHeight: 23 }
      ),
      E.textEditor(
        '<strong style="color:#333;">' + t.name + '</strong><br><span style="color:#7C3AED;font-size:13px;">Verified Buyer \u2014 ' + t.product + '</span>',
        { align: 'left', fontSize: 14 }
      )
    ]);
  });

  var testimonialSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('What Our Community Says', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Real unboxing stories from crystal lovers who trusted the mystery.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, testimonialCards)
  ]);

  return [
    heroSection,
    tiersSection,
    monthlyThemeSection,
    pastSection,
    faqSection,
    testimonialSection
  ];
}

// ============================================================
// Main — 示例：生成 Mystery Crystal Box 页面
// ============================================================
async function main() {
  var config = {
    monthlyTheme: {
      title: 'Celestial Awakening',
      subtitle: 'May 2026 Mystery Theme',
      description: 'This month\'s box channels the grounding energy of the Taurus New Moon combined with the expansive spirit of the Sagittarius Full Moon. Each crystal has been intuitively chosen to help you anchor your dreams while reaching for the stars. Expect rare specimens and powerful combinations.',
      image: IMAGES.mysteryBox.monthlyTheme.url,
      teasers: [
        'A rare Taurus-energized abundance crystal',
        'A Sagittarius-inspired expansion stone',
        'An exclusive Full Moon ritual guide card',
        'A surprise celestial-themed specimen'
      ]
    }
  };

  var data = generateMysteryBoxPage(config);
  await E.createPage('Mystery Crystal Box', 'mystery-box', data, 'draft');
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateMysteryBoxPage;
