/**
 * Shared Elementor builder for Intention Page test drafts.
 *
 * This is for WordPress Page + Elementor drafts only. It follows the Love
 * v3 flow: content source -> UI-shaped structure -> Elementor containers.
 */

const path = require('path');
const E = require('../../../templates/elementor-utils');
const IMAGES = require('../../../assets/site-images');

const C = {
  ink: '#1A1A2E',
  body: '#444444',
  muted: '#666666',
  paleGreen: '#F0F7F4',
  deepGreen: '#1B4332',
  green: '#2D6A4F',
  cream: '#faf8f5',
  card: '#f5f0eb',
  blush: '#f7edee',
  gold: '#c9a96e',
  white: '#ffffff',
  border: '#e5e0d8',
  dark: '#1A1A2E'
};

const FALLBACK_IMAGES = {
  hero: IMAGES.shared.heroBracelet.url,
  cta: IMAGES.home.newsletter.url,
  card: IMAGES.shared.crystalGrid.url
};

const STONE_IMAGE = {
  amethyst: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-amethyst.webp',
  amazonite: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-amazonite.webp',
  angelite: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-angelite.webp',
  selenite: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-selenite.webp',
  lepidolite: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-lepidolite.webp',
  howlite: 'https://goearthward.com/wp-content/uploads/2026/06/crystal-howlite.webp',
  'rose-quartz': 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-rose-quartz-overview-v3.webp',
  rhodonite: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-rhodonite-overview-v3.webp',
  ruby: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-ruby-overview-v3.webp',
  prehnite: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-prehnite-overview-v3.webp'
};

const DEEP_LINKS = {
  'calm-mindfulness': [
    ['Best Crystals for Anxiety', '/crystals-for-anxiety/'],
    ['Best Crystals for Stress', '/crystals-for-stress/'],
    ['Best Crystals for Sleep', '/crystals-for-sleep/']
  ],
  'abundance-success': [
    ['Crystals for Money', '/crystals-for-money/'],
    ['Crystals for Prosperity', '/crystals-for-prosperity/'],
    ['Crystals for Motivation', '/crystals-for-motivation/']
  ],
  'protection-clearing': [
    ['Crystals for Protection', '/crystals-for-protection/'],
    ['Crystals for Grounding', '/crystals-for-grounding/'],
    ['Crystals for Peace', '/crystals-for-peace/']
  ],
  'health-vitality': [
    ['Crystals for Energy', '/crystals-for-energy/'],
    ['Crystals for Strength', '/crystals-for-strength/'],
    ['Crystals for Peace', '/crystals-for-peace/']
  ],
  'personal-empowerment': [
    ['Crystals for Confidence', '/crystals-for-confidence/'],
    ['Crystals for Courage', '/crystals-for-courage/'],
    ['Crystals for Motivation', '/crystals-for-motivation/']
  ],
  transformation: [
    ['Crystals for New Beginnings', '/crystals-for-new-beginnings/'],
    ['Crystals for Transformation', '/crystals-for-transformation/'],
    ['Crystals for Emotional Healing', '/crystals-for-emotional-healing/']
  ],
  'spiritual-connection': [
    ['Crystals for Spirituality', '/crystals-for-spirituality/'],
    ['Crystals for Meditation', '/crystals-for-meditation/'],
    ['Crystals for Intuition', '/crystals-for-intuition/']
  ]
};

function slugifyName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function firstParagraph(text) {
  return String(text || '').split(/\n\s*\n/).filter(Boolean)[0] || '';
}

function safeText(text, fallback) {
  const raw = String(text || fallback || '').replace(/\s+/g, ' ').trim();
  return raw.length > 310 ? raw.slice(0, 307).replace(/\s+\S*$/, '') + '...' : raw;
}

function stoneImage(stone) {
  if (stone.image) return stone.image;
  const slug = slugifyName(stone.slug || stone.name);
  return STONE_IMAGE[slug] || FALLBACK_IMAGES.card;
}

function brandButton(text, linkUrl, secondary) {
  const b = E.buttonWidget(text, linkUrl);
  Object.assign(b.settings, {
    border_radius: { unit: 'px', size: 4, sizes: [] },
    button_text_color: secondary ? C.green : C.white,
    background_color: secondary ? C.white : C.green,
    border_border: 'solid',
    border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: secondary ? C.border : C.green
  });
  return b;
}

function cardStyle(widthDesktop, widthTablet) {
  return {
    content_width: 'full',
    width: { unit: '%', size: widthDesktop || 23, sizes: [] },
    width_tablet: { unit: '%', size: widthTablet || 45, sizes: [] },
    width_mobile: { unit: '%', size: 100, sizes: [] },
    background_background: 'classic',
    background_color: C.white,
    border_border: 'solid',
    border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: C.border,
    border_radius: { unit: 'px', top: '10', right: '10', bottom: '10', left: '10', isLinked: true },
    padding: E.rPadding('26', '22', '26', '22', {
      mobile: { t: '22', r: '18', b: '22', l: '18' }
    }),
    flex_direction: 'column',
    flex_gap: E.gap(10)
  };
}

function sectionTitle(title, subtitle, dark) {
  return [
    E.heading(title, {
      headerSize: 'h2',
      fontSize: 38,
      color: dark ? C.white : C.ink,
      align: 'center',
      extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' } }
    }),
    E.textEditor(subtitle, {
      fontSize: 17,
      lineHeight: 28,
      color: dark ? '#eaded9' : C.body,
      align: 'center'
    })
  ];
}

function quickCards(cfg) {
  const crystals = cfg.crystals || [];
  const top = crystals.slice(0, 4);
  return top.map(function (stone) {
    return [
      E.heading(stone.name, { headerSize: 'h3', fontSize: 22, color: C.deepGreen, align: 'left' }),
      E.textEditor(safeText(stone.best_for || stone.benefits || stone.subtitle, 'A practical starting point for this intention.'), {
        fontSize: 16,
        color: C.body,
        align: 'left'
      }),
      brandButton('Learn More', stone.link || ('/gemstone/' + slugifyName(stone.name) + '-meaning/'), true)
    ];
  });
}

function faqItems(cfg) {
  if (Array.isArray(cfg.faq) && cfg.faq.length) {
    return cfg.faq.map(function (item) { return { title: item.q || item.title, content: item.a || item.content }; });
  }
  return [
    {
      title: 'How should I choose a crystal for ' + cfg.intention.toLowerCase() + '?',
      content: 'Start with the intention you most want to practice daily, then choose a stone, color, and product form you would realistically keep close.'
    },
    {
      title: 'Are crystals a guaranteed solution?',
      content: 'No. Crystals are symbolic objects for intention-setting and personal ritual. They do not guarantee outcomes or replace professional support.'
    },
    {
      title: 'Can I use more than one crystal?',
      content: 'Yes. Many people choose one main stone and one supporting stone, keeping the practice simple enough to repeat.'
    },
    {
      title: 'Where should I start?',
      content: 'Begin with the first crystal on this page or browse the product categories below, then refine your choice after reading the crystal guide.'
    }
  ];
}

function deepLinks(cfg) {
  if (Array.isArray(cfg.relatedConditions) && cfg.relatedConditions.length) {
    return cfg.relatedConditions.slice(0, 3).map(function (item) {
      return [item.name, '/crystals-for-' + item.slug + '/'];
    });
  }
  return DEEP_LINKS[cfg.slug] || [];
}

function generateIntentionPage(cfg) {
  const crystals = cfg.crystals || [];
  const heroImage = cfg.heroImage || (crystals[0] && stoneImage(crystals[0])) || FALLBACK_IMAGES.hero;
  const quick = safeText(cfg.quickAnswer || cfg.heroSubtitle, 'A practical guide to choosing crystals for ' + cfg.intention.toLowerCase() + '.');
  const editorial = safeText(cfg.understanding || firstParagraph(cfg.description), 'Choose a stone as a visible reminder for the intention you want to practice each day.');
  const productCategories = cfg.productCategories || [];
  const links = deepLinks(cfg);

  return [
    E.section({
      padding: E.rPadding('130', '10', '120', '10', {
        tablet: { t: '90', r: '10', b: '80', l: '10' },
        mobile: { t: '65', r: '10', b: '60', l: '10' }
      }),
      background_background: 'classic',
      background_image: { url: heroImage, id: 0, alt: cfg.intention + ' crystals hero image', source: 'library', size: '' },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: C.dark,
      background_overlay_opacity: { unit: 'px', size: 0.66, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'column', flex_align_items: 'center' }, [
        E.heading(cfg.intention + ' Crystals', { headerSize: 'h1', fontSize: 54, color: C.white, align: 'center' }),
        E.textEditor(quick, { fontSize: 22, lineHeight: 34, color: '#f4ece9', align: 'center' }),
        E.buttonRow([
          brandButton('Shop ' + cfg.intention + ' Crystals', '#shop-intention-crystals'),
          brandButton('Find Your Stone', '#find-your-stone', true)
        ], { gap: 12 })
      ])
    ]),

    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.paleGreen
    }, sectionTitle(
      'Which crystal fits this intention?',
      'Start with the stone that best matches the way you want to practice ' + cfg.intention.toLowerCase() + '.',
      false
    ).concat([
      E.flexColumns(quickCards(cfg), { desktop: 4, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(23, 45) })
    ])),

    E.section({
      padding: E.rPadding('90', '10', '90', '10', {
        tablet: { t: '65', r: '10', b: '65', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      })
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'row', flex_align_items: 'center', flex_gap: E.gap(40) }, [
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 54, sizes: [] },
          width_tablet: { unit: '%', size: 100, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_direction: 'column',
          flex_gap: E.gap(12)
        }, [
          E.heading('A daily reminder for ' + cfg.intention.toLowerCase(), { headerSize: 'h2', fontSize: 38, color: C.ink, align: 'left' }),
          E.textEditor(editorial, { fontSize: 18, lineHeight: 30, color: C.body, align: 'left' })
        ]),
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 40, sizes: [] },
          width_tablet: { unit: '%', size: 100, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] }
        }, [
          E.imageWidget((crystals[0] && stoneImage(crystals[0])) || heroImage, { radius: 12, width: 100 })
        ])
      ])
    ]),

    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.blush
    }, sectionTitle(
      'Featured ' + cfg.intention + ' Crystals',
      'A simple starting set for browsing this intention.',
      false
    ).concat([
      E.flexColumns(crystals.slice(0, 4).map(function (stone) {
        return [E.imageBox(stoneImage(stone), stone.name, safeText(stone.best_for || stone.benefits || stone.subtitle, 'Learn why this stone is often chosen.'), stone.link || ('/gemstone/' + slugifyName(stone.name) + '-meaning/'))];
      }), { desktop: 4, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(23, 45) })
    ])),

    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      })
    }, sectionTitle(
      'Shop ' + cfg.intention + ' Crystal Categories',
      cfg.shopSubtitle || 'Browse real crystal products and categories connected to this intention.',
      false
    ).concat([
      E.wrap({ content_width: 'full', _element_id: 'shop-intention-crystals' }, [
        productCategories.length
          ? E.wdProductCategoriesWidget({ ids: productCategories.map(function (cat) { return cat.id; }), number: productCategories.length, columns: 4, orderby: 'include' })
          : E.wdProductsWidget(8)
      ])
    ])),

    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.paleGreen
    }, sectionTitle(
      'Deepen Your Path',
      'Use these related guides when you want a more specific next step.',
      false
    ).concat([
      E.flexColumns(links.map(function (item) {
        return [
          E.heading(item[0], { headerSize: 'h3', fontSize: 24, color: C.deepGreen, align: 'left' }),
          E.textEditor('A deeper guide for this related need.', { fontSize: 16, lineHeight: 26, color: C.body, align: 'left' }),
          brandButton('Read Guide', item[1], true)
        ];
      }), { desktop: 3, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(30, 45) })
    ])),

    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      })
    }, sectionTitle(
      cfg.intention + ' Crystals FAQ',
      'A few grounded answers before choosing a stone.',
      false
    ).concat([
      E.accordion(faqItems(cfg))
    ])),

    E.section({
      padding: E.rPadding('100', '10', '100', '10', {
        tablet: { t: '70', r: '10', b: '70', l: '10' },
        mobile: { t: '50', r: '10', b: '50', l: '10' }
      }),
      background_background: 'classic',
      background_image: { url: cfg.featuredCta && cfg.featuredCta.image || heroImage || FALLBACK_IMAGES.cta, id: 0, alt: cfg.intention + ' crystals final call to action', source: 'library', size: '' },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: C.dark,
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'column', flex_align_items: 'center' }, [
        E.heading('Choose a small reminder for ' + cfg.intention.toLowerCase() + '.', { headerSize: 'h2', fontSize: 42, color: C.white, align: 'center' }),
        E.textEditor('Browse crystals selected for this intention, then refine the page by hand in Elementor.', { fontSize: 18, lineHeight: 28, color: '#eaded9', align: 'center' }),
        brandButton('Shop ' + cfg.intention, '#shop-intention-crystals')
      ])
    ])
  ];
}

function loadSource(sourcePath) {
  return require(path.resolve(sourcePath));
}

module.exports = {
  generateIntentionPage,
  loadSource
};

