/**
 * Love & Relationships draft page generator.
 *
 * Source brief:
 *   content-v1.md
 *
 * This generator is now aligned with:
 *   ui-prototype-v1.html
 */

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
  rose: '#b76e79',
  gold: '#c9a96e',
  white: '#ffffff',
  border: '#e5e0d8',
  dark: '#1A1A2E'
};

const IMG = {
  hero: IMAGES.home.intentionLove,
  roseQuartz: {
    id: 43114,
    url: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-rose-quartz-overview-v3.webp',
    alt: 'Rose quartz crystal for self-love and tenderness'
  },
  rhodonite: {
    id: 43115,
    url: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-rhodonite-overview-v3.webp',
    alt: 'Rhodonite crystal for compassion and self-worth'
  },
  ruby: {
    id: 43116,
    url: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-ruby-overview-v3.webp',
    alt: 'Ruby crystal for passion courage and devotion'
  },
  prehnite: {
    id: 43117,
    url: 'https://goearthward.com/wp-content/uploads/2026/06/intention-love-prehnite-overview-v3.webp',
    alt: 'Prehnite crystal for calm love and clarity'
  },
  cta: IMAGES.home.useCompassion
};

const STONES = [
  {
    name: 'Rose Quartz',
    image: IMG.roseQuartz.url,
    alt: IMG.roseQuartz.alt,
    link: '/gemstone/rose-quartz-meaning/',
    text: 'A gentle classic for self-love, tenderness, and emotional softness.'
  },
  {
    name: 'Rhodonite',
    image: IMG.rhodonite.url,
    alt: IMG.rhodonite.alt,
    link: '/gemstone/rhodonite-meaning/',
    text: 'A heart-centered stone often chosen for compassion, forgiveness, and self-worth.'
  },
  {
    name: 'Ruby',
    image: IMG.ruby.url,
    alt: 'Ruby crystal reference image for passion, courage, and devotion',
    link: '/gemstone/ruby-meaning/',
    text: 'A vivid choice for passion, courage, devotion, and life force.'
  },
  {
    name: 'Prehnite',
    image: IMG.prehnite.url,
    alt: 'Prehnite crystal reference image for calm love and clarity',
    link: '/gemstone/prehnite-meaning/',
    text: 'A soft green stone for calm love, clarity, and steady emotional presence.'
  }
];

const CONDITION_LINKS = [
  {
    title: 'Crystals for Love',
    text: 'A deeper guide for love-focused crystal choices.',
    link: '/crystals-for-love/'
  },
  {
    title: 'Crystals for Self-Love',
    text: 'Explore stones for self-kindness, confidence, and emotional care.',
    link: '/crystals-for-self-love/'
  },
  {
    title: 'Crystals for Emotional Healing',
    text: 'For tender seasons, grief, recovery, and gentle emotional support.',
    link: '/crystals-for-emotional-healing/'
  }
];

const FAQ = [
  {
    title: 'What crystal is best for love and relationships?',
    content: 'Rose quartz is the most familiar first choice for love and self-compassion. Rhodonite, ruby, and prehnite are also strong options depending on whether your focus is tenderness, forgiveness, passion, or steadier connection.'
  },
  {
    title: 'Can crystals attract a specific person?',
    content: 'No. Crystals should not be treated as a way to control another person or guarantee a relationship outcome. Many people use them as symbolic reminders for how they want to show up in love.'
  },
  {
    title: 'What is the best crystal for self-love?',
    content: 'Rose quartz is the classic starting point. Rhodonite is often chosen for self-worth, while prehnite is a softer option for calm self-care and emotional clarity.'
  },
  {
    title: 'What crystal supports emotional healing after heartbreak?',
    content: 'Rhodonite and rose quartz are commonly chosen for tender emotional seasons. They are symbolic supports, not substitutes for therapy, time, boundaries, or real relationship work.'
  },
  {
    title: 'Are love crystals scientifically proven to change relationships?',
    content: 'No. There is no clinical evidence that crystals change relationships. The value is personal and symbolic: a crystal can become a visible cue for intention, reflection, and daily practice.'
  },
  {
    title: 'How should I choose a love crystal?',
    content: 'Start with the intention that feels most honest: self-compassion, emotional repair, passion, or steady connection. Then choose the stone, color, and product form you would actually keep close.'
  }
];

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

function sectionTitle(title, subtitle, dark) {
  return [
    E.heading(title, {
      headerSize: 'h2',
      fontSize: 38,
      color: dark ? C.white : C.ink,
      align: 'center',
      extra: {
        _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
      }
    }),
    E.textEditor(subtitle, {
      fontSize: 17,
      lineHeight: 28,
      color: dark ? '#eaded9' : C.body,
      align: 'center',
      width: 'initial'
    })
  ];
}

function generateLoveRelationships() {
  return [
    // S1 Hero
    E.section({
      padding: E.rPadding('130', '10', '120', '10', {
        tablet: { t: '90', r: '10', b: '80', l: '10' },
        mobile: { t: '65', r: '10', b: '60', l: '10' }
      }),
      background_background: 'classic',
      background_image: { url: IMG.hero.url, id: 0, alt: IMG.hero.alt, source: 'library', size: '' },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: C.dark,
      background_overlay_opacity: { unit: 'px', size: 0.62, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'column', flex_align_items: 'center' }, [
        E.heading('Love & Relationships Crystals', {
          headerSize: 'h1',
          fontSize: 54,
          color: C.white,
          align: 'center'
        }),
        E.textEditor('Choose crystals as gentle reminders for self-love, honest connection, and the kind of love you want to practice.', {
          fontSize: 22,
          lineHeight: 34,
          color: '#f4ece9',
          align: 'center'
        }),
        E.buttonRow([
          brandButton('Shop Love Crystals', '#shop-love-crystals'),
          brandButton('Find Your Stone', '#find-your-stone', true)
        ], { gap: 12 })
      ])
    ]),

    // S2 Quick Chooser
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.paleGreen
    }, sectionTitle(
      'Which crystal fits your heart right now?',
      'Start with the feeling or relationship intention that is most honest today.',
      false
    ).concat([
      E.flexColumns([
        [
          E.heading('Softer with myself', { headerSize: 'h3', fontSize: 22, color: C.deepGreen, align: 'left' }),
          E.textEditor('Rose Quartz and Prehnite for self-kindness, tenderness, and quieter self-talk.', { fontSize: 16, color: C.body, align: 'left' }),
          brandButton('Read Self-Love Guide', '/crystals-for-self-love/', true)
        ],
        [
          E.heading('Healing after hurt', { headerSize: 'h3', fontSize: 22, color: C.deepGreen, align: 'left' }),
          E.textEditor('Rhodonite and Rose Quartz for compassion, forgiveness, and emotional care.', { fontSize: 16, color: C.body, align: 'left' }),
          brandButton('Read Healing Guide', '/crystals-for-emotional-healing/', true)
        ],
        [
          E.heading('More warmth in love', { headerSize: 'h3', fontSize: 22, color: C.deepGreen, align: 'left' }),
          E.textEditor('Ruby and Rose Quartz for passion, devotion, and opening to meaningful connection.', { fontSize: 16, color: C.body, align: 'left' }),
          brandButton('Read Love Guide', '/crystals-for-love/', true)
        ],
        [
          E.heading('Steadier connection', { headerSize: 'h3', fontSize: 22, color: C.deepGreen, align: 'left' }),
          E.textEditor('Prehnite and Rhodonite for calmer communication, patience, and grounded care.', { fontSize: 16, color: C.body, align: 'left' }),
          brandButton('Shop This Intention', '#shop-love-crystals', true)
        ]
      ], { desktop: 4, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(23, 45) })
    ])),

    // S3 Editorial
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
          E.heading('Love begins with what you practice daily', {
            headerSize: 'h2',
            fontSize: 38,
            color: C.ink,
            align: 'left'
          }),
          E.textEditor('Love is not only about attracting someone else. It is also the way you speak to yourself, the boundaries you choose, the tenderness you allow, and the honesty you bring into connection. A crystal can become a small, visible cue for that practice. Kept on a desk, worn as jewelry, or placed beside a journal, it turns an abstract intention into something you can see and touch each day.', {
            fontSize: 18,
            lineHeight: 30,
            color: C.body,
            align: 'left'
          })
        ]),
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 40, sizes: [] },
          width_tablet: { unit: '%', size: 100, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] }
        }, [
          E.imageWidget(IMG.roseQuartz.url, { id: IMG.roseQuartz.id, alt: IMG.roseQuartz.alt, radius: 12, width: 100 })
        ])
      ])
    ]),

    // S4 Featured Stones
    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.blush
    }, sectionTitle(
      'Featured Love & Relationships Crystals',
      'Four starting points for self-love, tenderness, passion, and steadier connection.',
      false
    ).concat([
      E.flexColumns(STONES.map(function (stone) {
        return [
          E.imageBox(stone.image, stone.name, stone.text, stone.link)
        ];
      }), { desktop: 4, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(23, 45) })
    ])),

    // S5 Shop
    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.white
    }, sectionTitle(
      'Shop Love & Relationships Crystal Categories',
      'Browse real crystal categories connected to love, self-compassion, passion, and heart-centered care.',
      false
    ).concat([
      E.wrap({ content_width: 'full', _element_id: 'shop-love-crystals' }, [
        E.wdProductCategoriesWidget({
          ids: [1507, 1530, 1527, 1528],
          number: 4,
          columns: 4,
          orderby: 'include'
        })
      ])
    ])),

    // S6 Deep links
    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      }),
      background_background: 'classic',
      background_color: C.paleGreen
    }, sectionTitle(
      'Deepen Your Path',
      'If you want a more specific guide, these pages go deeper without asking this page to become a long article.',
      false
    ).concat([
      E.flexColumns(CONDITION_LINKS.map(function (item) {
        return [
          E.heading(item.title, { headerSize: 'h3', fontSize: 24, color: C.deepGreen, align: 'left' }),
          E.textEditor(item.text, { fontSize: 16, lineHeight: 26, color: C.body, align: 'left' }),
          brandButton('Read Guide', item.link, true)
        ];
      }), { desktop: 3, tablet: 2, mobile: 1 }, { gap: 22, alignItems: 'stretch', cellStyle: cardStyle(30, 45) })
    ])),

    // S7 FAQ
    E.section({
      padding: E.rPadding('85', '10', '85', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '45', r: '10', b: '45', l: '10' }
      })
    }, sectionTitle(
      'Love & Relationships Crystals FAQ',
      'A few grounded answers before choosing a stone.',
      false
    ).concat([
      E.accordion(FAQ)
    ])),

    // S8 Final CTA
    E.section({
      padding: E.rPadding('100', '10', '100', '10', {
        tablet: { t: '70', r: '10', b: '70', l: '10' },
        mobile: { t: '50', r: '10', b: '50', l: '10' }
      }),
      background_background: 'classic',
      background_image: { url: IMG.cta.url, id: 0, alt: IMG.cta.alt, source: 'library', size: '' },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: C.dark,
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'column', flex_align_items: 'center' }, [
        E.heading('Choose a small reminder for the love you want to practice.', {
          headerSize: 'h2',
          fontSize: 42,
          color: C.white,
          align: 'center'
        }),
        E.textEditor('Browse crystals selected for self-love, compassion, tenderness, and meaningful connection.', {
          fontSize: 18,
          lineHeight: 28,
          color: '#eaded9',
          align: 'center'
        }),
        brandButton('Shop Love & Relationships', '#shop-love-crystals')
      ])
    ])
  ];
}

async function main() {
  const data = generateLoveRelationships();
  await E.createPage('Love & Relationships V3 Draft', 'love-relationships-v3', data, 'draft');
}

if (require.main === module) {
  main().catch(function (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

module.exports = generateLoveRelationships;
