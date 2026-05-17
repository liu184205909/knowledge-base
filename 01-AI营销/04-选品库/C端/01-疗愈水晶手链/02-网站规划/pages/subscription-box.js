/**
 * Subscription Box 页面
 * URL: /collections/subscription-box
 *
 * 4个Section:
 * 1. Hero — "Monthly Crystal Subscription"
 * 2. 套餐选择 — 3档 (Basic $29/月, Premium $49/月, Deluxe $79/月)
 * 3. FAQ — 5题手风琴
 * 4. 用户见证 — 4条评价
 *
 * 用法:
 *   node subscription-box.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.subscription.tier.url;

// ============================================================
// 套餐默认数据
// ============================================================
var DEFAULT_TIERS = [
  {
    name: 'Basic',
    price: '$29',
    period: '/month',
    subtitle: 'Start Your Crystal Journey',
    description: 'Receive 1-2 hand-selected crystal bracelets each month, energetically cleansed and ready to wear. Includes an intention card with each crystal\'s properties and suggested affirmations.',
    features: [
      '1-2 crystal bracelets monthly',
      'Energetically cleansed & charged',
      'Intention card with properties',
      'Velvet storage pouch',
      'Free shipping in the US'
    ],
    color: '#E8F5E9',
    link: '/collections/subscription-box/basic'
  },
  {
    name: 'Premium',
    price: '$49',
    period: '/month',
    subtitle: 'Deepen Your Practice',
    description: 'Everything in Basic, plus a raw crystal specimen, a mini sage bundle for cleansing, and an exclusive crystal guide with monthly rituals and moon phase alignments.',
    features: [
      '2-3 crystal bracelets monthly',
      '1 raw crystal specimen',
      'Mini sage cleansing bundle',
      'Monthly crystal ritual guide',
      'Moon phase alignment tips',
      'Priority shipping',
      '10% off all shop purchases'
    ],
    color: '#E3F2FD',
    popular: true,
    link: '/collections/subscription-box/premium'
  },
  {
    name: 'Deluxe',
    price: '$79',
    period: '/month',
    subtitle: 'The Ultimate Crystal Experience',
    description: 'Our most immersive subscription. Rare crystal bracelets, a collector-grade specimen, essential oil roller, crystal grid kit, and access to exclusive guided meditations and live crystal coaching sessions.',
    features: [
      '3-4 crystal bracelets monthly',
      '1 collector-grade specimen',
      'Essential oil roller',
      'Crystal grid kit',
      'Guided meditation access',
      'Live monthly crystal coaching',
      '15% off all shop purchases',
      'Early access to new collections'
    ],
    color: '#FFF3E0',
    link: '/collections/subscription-box/deluxe'
  }
];

// ============================================================
// FAQ 默认数据
// ============================================================
var DEFAULT_FAQ = [
  {
    title: 'Can I cancel my subscription at any time?',
    content: 'Absolutely. You can cancel your subscription at any time with no cancellation fees. Simply go to your account settings or contact our support team. Your cancellation will take effect at the end of your current billing cycle, and you will not be charged again. We believe in the quality of our crystals and want you to stay because you love them, not because of a contract.'
  },
  {
    title: 'When does my subscription box ship?',
    content: 'All subscription boxes ship on the 1st of each month. If you subscribe before the 15th of the month, you will receive the current month\'s box. If you subscribe after the 15th, your first box will be the following month\'s edition. You will receive a shipping confirmation email with tracking information as soon as your box is dispatched. US delivery typically takes 3-5 business days.'
  },
  {
    title: 'Are the crystals genuine and high quality?',
    content: 'Every crystal in our subscription boxes is 100% natural and ethically sourced. Each stone is hand-selected by our crystal experts for its quality, energy, and beauty. Before shipping, every crystal is cleansed with sage and charged under moonlight according to traditional practices. We include an authenticity card and energy guide with each piece so you know exactly what you are receiving and how to work with it.'
  },
  {
    title: 'Can I gift a subscription to someone else?',
    content: 'Yes! A crystal subscription makes a thoughtful and unique gift. You can purchase a gift subscription for 1, 3, 6, or 12 months. The recipient will receive a beautifully packaged welcome box with their first delivery. You can add a personalized message at checkout. Gift subscriptions do not auto-renew, so there is nothing for the recipient to manage.'
  },
  {
    title: 'What is your return and exchange policy for subscription boxes?',
    content: 'We want you to love every crystal you receive. If a crystal arrives damaged or you are unsatisfied with your box, contact us within 14 days of delivery for a replacement or store credit. Due to the curated nature of subscription boxes, we do not accept returns of opened boxes for a full refund, but we will always make it right if something is not up to your expectations. Our customer satisfaction rate is 98.5% and we intend to keep it that way.'
  }
];

// ============================================================
// 用户见证默认数据
// ============================================================
var DEFAULT_TESTIMONIALS = [
  {
    name: 'Rachel T.',
    text: 'I have been subscribed to the Premium box for 6 months now and every single month is a surprise that brings me joy. The crystals are genuine, beautifully packaged, and the ritual guide has become my monthly self-care tradition. Cancelled all my other subscriptions — this is the one that actually feeds my soul.',
    product: 'Premium Subscriber (6 months)',
    rating: '5'
  },
  {
    name: 'Michael S.',
    text: 'Got the Basic box as a birthday gift from my wife and was so impressed I upgraded to Premium. The quality of the crystals is outstanding — you can feel the energy difference compared to store-bought stones. The sage bundle and cleansing ritual was a game-changer for my meditation practice.',
    product: 'Premium Subscriber',
    rating: '5'
  },
  {
    name: 'Priya K.',
    text: 'The Deluxe subscription is worth every penny. Last month I received a rare Labradorite specimen that flashes blue and green in different lights. The crystal coaching session helped me set intentions for the new moon. This is not just a product, it is a spiritual practice delivered to your door.',
    product: 'Deluxe Subscriber (3 months)',
    rating: '5'
  },
  {
    name: 'Jennifer L.',
    text: 'I gifted a 3-month Basic subscription to my sister who was going through a tough time. She says the crystals and affirmation cards have become her daily anchor. The first thing she does each morning is hold her crystal and set an intention. Best gift I have ever given.',
    product: 'Gift Subscription (Basic)',
    rating: '5'
  }
];

/**
 * 生成 Subscription Box 页面
 *
 * @param {Object} config
 * @param {Array}  config.tiers        — [{name, price, period, subtitle, description, features, color, link}] 套餐
 * @param {Array}  config.faqItems     — [{title, content}] FAQ
 * @param {Array}  config.testimonials — [{name, text, product, rating}] 用户评价
 */
function generateSubscriptionBoxPage(config) {
  var cfg = config || {};
  var tiers = cfg.tiers && cfg.tiers.length > 0 ? cfg.tiers : DEFAULT_TIERS;
  var faqItems = cfg.faqItems && cfg.faqItems.length > 0 ? cfg.faqItems : DEFAULT_FAQ;
  var testimonials = cfg.testimonials && cfg.testimonials.length > 0 ? cfg.testimonials : DEFAULT_TESTIMONIALS;

  // ----------------------------------------------------------
  // Section 1: Hero — "Monthly Crystal Subscription"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.subscription.hero.url, id: 0, size: '', alt: IMAGES.subscription.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/collections" style="color:#ccc;">Collections</a> &gt; <span style="color:#fff;">Subscription Box</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Monthly Crystal Subscription', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('A New Crystal Journey Delivered Every Month', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Hand-selected crystals, energetically cleansed and charged, delivered to your door each month. Choose the tier that matches your journey and let the crystals come to you.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    ),
    E.spacer('10'),
    // 信任指标
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(30)
    }, [
      E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
        E.textEditor(
          '<span style="font-size:28px;font-weight:700;color:#C4A1FF;">8,500+</span><br><span style="font-size:13px;color:#aaa;">Active Subscribers</span>',
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
          '<span style="font-size:28px;font-weight:700;color:#C4A1FF;">98%</span><br><span style="font-size:13px;color:#aaa;">Satisfaction Rate</span>',
          { align: 'center', fontSize: 14, color: '#CCCCCC', extra: { text_color: '#CCCCCC' } }
        )
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 2: 套餐选择 — 3档卡片
  // ----------------------------------------------------------
  var tierCards = tiers.map(function (tier) {
    var featuresHtml = (tier.features || []).map(function (f) {
      return '<li style="margin-bottom:6px;color:#555;font-size:14px;">&#10003; ' + f + '</li>';
    }).join('');

    var cardElements = [];

    // Popular 标签
    if (tier.popular) {
      cardElements.push(E.textEditor(
        '<span style="display:inline-block;padding:4px 14px;background:#7C3AED;color:#fff;border-radius:15px;font-size:12px;font-weight:600;">MOST POPULAR</span>',
        { align: 'center', fontSize: 12 }
      ));
    }

    cardElements.push(E.heading(tier.price + '<span style="font-size:16px;font-weight:400;color:#888;">' + (tier.period || '/month') + '</span>', {
      fontSize: 40,
      color: '#333333',
      align: 'center',
      fontWeight: '800',
      padding: { unit: 'px', top: tier.popular ? '5' : '0', right: '0', bottom: '3', left: '0', isLinked: '' }
    }));

    cardElements.push(E.heading(tier.name, {
      fontSize: 22,
      color: '#333333',
      align: 'center',
      fontWeight: '600',
      padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
    }));

    cardElements.push(E.textEditor(
      tier.subtitle || '',
      { align: 'center', fontSize: 14, color: '#7C3AED', lineHeight: 20 }
    ));

    cardElements.push(E.divider());

    cardElements.push(E.textEditor(
      tier.description || '',
      { align: 'center', fontSize: 15, color: '#666666', lineHeight: 23 }
    ));

    cardElements.push(E.spacer('10'));

    cardElements.push(E.textEditor(
      '<strong style="font-size:14px;color:#333;">What\'s included:</strong><ul style="list-style:none;padding:0;margin-top:8px;text-align:left;">' + featuresHtml + '</ul>',
      { align: 'center', fontSize: 14, lineHeight: 22 }
    ));

    cardElements.push(E.buttonWidget('Subscribe to ' + tier.name, tier.link));

    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('30', '25', '30', '25'),
      background_background: 'classic',
      background_color: tier.color || '#FAFAFA',
      flex_gap: E.gap(5)
    }, E.rWidth('33', '50', '100')), cardElements);
  });

  var tiersSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Choose Your Subscription', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Three tiers of crystal wisdom. Every box is intuitively curated, ethically sourced, and energetically cleansed before shipping. Cancel anytime.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, tierCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: FAQ — 5题手风琴
  // ----------------------------------------------------------
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
    E.accordion(faqItems)
  ]);

  // ----------------------------------------------------------
  // Section 4: 用户见证 — 4条评价
  // ----------------------------------------------------------
  var testimonialCards = testimonials.map(function (t) {
    var stars = '';
    var count = parseInt(t.rating || '5', 10);
    for (var i = 0; i < count; i++) { stars += '\u2605'; }

    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '25', '25', '25'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth('25', '50', '100')), [
      E.textEditor(
        '<span style="color:#FFD700;font-size:18px;">' + stars + '</span>',
        { align: 'left', fontSize: 18 }
      ),
      E.textEditor(
        '"' + t.text + '"',
        { align: 'left', fontSize: 14, color: '#555555', lineHeight: 22 }
      ),
      E.textEditor(
        '<strong style="color:#333;">' + t.name + '</strong><br><span style="color:#7C3AED;font-size:12px;">Verified Subscriber \u2014 ' + t.product + '</span>',
        { align: 'left', fontSize: 13 }
      )
    ]);
  });

  var testimonialSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('What Our Subscribers Say', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Real stories from our crystal community. Join thousands who have made crystals a monthly ritual.',
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
    faqSection,
    testimonialSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateSubscriptionBoxPage();
  await E.createPage(
    'Monthly Crystal Subscription Box',
    'subscription-box',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateSubscriptionBoxPage;
