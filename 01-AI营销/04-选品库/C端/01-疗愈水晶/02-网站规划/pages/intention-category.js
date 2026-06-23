/**
 * Shop by Intention 分类页模板 V2（UI 对齐 about/首页 + 水晶卡用 stone-core-data 百科数据）
 * URL: /[intention-slug]（根级 WordPress page）
 *
 * V2：去 S5 使用场景 / 水晶卡用 stone-core-data 百科字段 / S8 拆 CTA+Related / related 图用对应 intention heroImage
 *
 * 8 Section：Hero / 意图共鸣 / 意图故事 / 水晶卡(百科数据) / Shop / FAQ / CTA banner / Related
 * H1 由 WoodMart 主题 Page Title 区输出，本页 Hero 不写 H1。
 *
 * config schema：
 *   { intention, heroSubtitle, heroImage, quickAnswer, understanding,
 *     crystals:[{name,image,link, meanings, best_for, chakras, mineral}],
 *     faq:[{q,a}],
 *     relatedIntentions:[{name,slug,image}],  // image 填对应 intention heroImage
 *     relatedConditions:[{name,slug}], blogPosts:[{title,link}] }
 *
 * 线上 8 页已存在，用 updatePage（非 create）。
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');
const PLACEHOLDER = IMAGES.shared.card.url;

const C = {
  text: '#2d2d2d', gold: '#c9a96e', purple: '#7b5ea7',
  cream: '#faf8f5', card: '#f5f0eb', dark: '#1a1a2e', mute: '#888888', body: '#555555'
};

function generateIntentionPage(config) {
  const intention = config.intention;
  const intentionLower = intention.toLowerCase();
  const heroSubtitle = config.heroSubtitle;
  const heroImage = config.heroImage;
  const quickAnswer = config.quickAnswer;
  const understanding = config.understanding;
  const crystals = config.crystals || [];
  const faq = config.faq || [];
  const relatedIntentions = config.relatedIntentions || [];
  const relatedConditions = config.relatedConditions || [];
  const blogPosts = config.blogPosts || [];

  // S1 Hero
  const heroSection = E.section({
    padding: E.rPadding('130', '10', '130', '10', { tablet: { t: '90', r: '10', b: '90', l: '10' }, mobile: { t: '60', r: '10', b: '60', l: '10' } }),
    background_background: 'classic',
    background_image: { url: heroImage || PLACEHOLDER, source: 'url', size: '' },
    background_position: 'center center', background_repeat: 'no-repeat', background_size: 'cover',
    background_overlay_background: 'classic', background_overlay_color: C.dark,
    background_overlay_opacity: { unit: 'px', size: 0.55, sizes: [] }
  }, [
    E.wrap({ content_width: 'boxed' }, [
      E.textEditor(heroSubtitle || ('Hand-selected crystals many people keep close on the journey toward ' + intentionLower + '.'), { fontSize: 30, color: '#FFFFFF', lineHeight: 40, align: 'center' }),
      E.buttonWidget('Shop ' + intention + ' Crystals', '/shop')
    ])
  ]);

  // S2 意图共鸣（图文左右）
  const resonanceSection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } }),
    flex_gap: E.gap(20)
  }, [
    E.wrap({ content_width: 'boxed', flex_direction: 'row', flex_align_items: 'center', flex_gap: E.gap(40) }, [
      E.wrap({ content_width: 'full', width: { unit: '%', size: 45, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] } }, [
        E.imageWidget(heroImage || PLACEHOLDER, { radius: 12, width: 100 })
      ]),
      E.wrap({ content_width: 'full', width: { unit: '%', size: 50, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] }, flex_direction: 'column', flex_gap: E.gap(12) }, [
        E.heading('A Quick Answer', { headerSize: 'h2', fontSize: 35, color: C.text, align: 'left' }),
        E.textEditor(quickAnswer || '', { fontSize: 17, color: C.body, align: 'left', lineHeight: 28 })
      ])
    ])
  ]);

  // S3 意图故事（图文反向）
  const storySection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } }),
    background_background: 'classic', background_color: C.cream
  }, [
    E.wrap({ content_width: 'boxed', flex_direction: 'row', flex_direction_mobile: 'column-reverse', flex_align_items: 'center', flex_gap: E.gap(40) }, [
      E.wrap({ content_width: 'full', width: { unit: '%', size: 58, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] }, flex_direction: 'column', flex_gap: E.gap(12) }, [
        E.heading('Understanding ' + intention, { headerSize: 'h2', fontSize: 35, color: C.text, align: 'left' }),
        E.textEditor(understanding || '', { fontSize: 17, color: C.body, align: 'left', lineHeight: 28 })
      ]),
      E.wrap({ content_width: 'full', width: { unit: '%', size: 38, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] } }, [
        E.imageWidget(heroImage || PLACEHOLDER, { radius: 10, width: 100 })
      ])
    ])
  ]);

  // S4 水晶卡（stone-core-data 百科字段）
  const crystalCards = crystals.map(function (crystal) {
    return E.wrap({
      content_width: 'full',
      width: { unit: '%', size: 31, sizes: [] }, width_tablet: { unit: '%', size: 45, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] },
      background_background: 'classic', background_color: C.card,
      border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
      padding: E.rPadding('25', '22', '25', '22'),
      flex_direction: 'column', flex_gap: E.gap(8)
    }, [
      E.imageWidget(crystal.image || PLACEHOLDER, { radius: 8, width: 100 }),
      E.heading(crystal.name, { headerSize: 'h3', fontSize: 22, color: C.text, align: 'center', fontWeight: '600' }),
      E.textEditor('<strong>Meanings:</strong> ' + (crystal.meanings || ''), { fontSize: 16, color: C.body, align: 'left', lineHeight: 24 }),
      E.textEditor('<strong>Best for:</strong> ' + (crystal.best_for || ''), { fontSize: 16, color: C.body, align: 'left', lineHeight: 24 }),
      E.textEditor('<strong>Chakras:</strong> ' + (crystal.chakras || ''), { fontSize: 16, color: C.body, align: 'left', lineHeight: 24 }),
      E.textEditor('<strong>Mineral:</strong> ' + (crystal.mineral || ''), { fontSize: 16, color: C.mute, align: 'left', lineHeight: 22 }),
      E.buttonWidget('Read the Full Guide', crystal.link || '#')
    ]);
  });

  const crystalSection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } })
  }, [
    E.heading('Your ' + intention + ' Crystals', { headerSize: 'h2', fontSize: 36, color: C.text, align: 'center' }),
    E.textEditor('The stones most often turned to for ' + intentionLower + '. Each card links to a complete crystal guide.', { fontSize: 17, color: C.mute, align: 'center' })
  ].concat(crystalCards.length > 0 ? [
    E.wrap({ content_width: 'full', flex_direction: 'row', flex_wrap: 'wrap', flex_gap: E.gap(22) }, crystalCards)
  ] : []));

  // S5 Shop
  const shopSection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } }),
    background_background: 'classic', background_color: C.cream
  }, [
    E.heading('Shop ' + intention + ' Crystals', { headerSize: 'h2', fontSize: 36, color: C.text, align: 'center' }),
    E.textEditor('Genuine natural pieces, ethically prepared and ready to work with your intention.', { fontSize: 17, color: C.mute, align: 'center' }),
    E.wdProductsWidget(8)
  ]);

  // S6 FAQ
  const faqSection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } })
  }, [
    E.heading(intention + ' Crystals: FAQ', { headerSize: 'h2', fontSize: 36, color: C.text, align: 'center' })
  ].concat(faq.length > 0 ? [
    E.accordion(faq.map(function (f) { return { title: f.q, content: f.a }; }))
  ] : []));

  // S7 CTA banner（独立）
  const ctaSection = E.section({
    padding: E.rPadding('90', '10', '90', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '45', r: '10', b: '45', l: '10' } }),
    background_background: 'classic',
    background_image: { url: heroImage || PLACEHOLDER, source: 'url', size: '' },
    background_position: 'center center', background_repeat: 'no-repeat', background_size: 'cover',
    background_overlay_background: 'classic', background_overlay_color: C.dark,
    background_overlay_opacity: { unit: 'px', size: 0.72, sizes: [] }
  }, [
    E.wrap({ content_width: 'boxed' }, [
      E.heading('Find Your ' + intention + ' Crystal', { fontSize: 40, color: '#FFFFFF', align: 'center' }),
      E.textEditor('Browse genuine natural stones, each prepared with care and ready to support your intention.', { fontSize: 18, color: '#d0c5b7', align: 'center', lineHeight: 28 }),
      E.buttonWidget('Shop All Crystals', '/shop')
    ])
  ]);

  // S8 Related intention/condition（独立）
  const relatedChildren = [
    E.heading('Explore More', { headerSize: 'h2', fontSize: 34, color: C.text, align: 'center' })
  ];
  if (relatedIntentions.length > 0) {
    relatedChildren.push(E.textEditor('Other intentions worth exploring', { fontSize: 17, color: C.mute, align: 'center' }));
    relatedChildren.push(E.wrap({ content_width: 'full', flex_direction: 'row', flex_wrap: 'wrap', flex_gap: E.gap(20) },
      relatedIntentions.map(function (item) {
        return E.wrap({ width: { unit: '%', size: 31, sizes: [] }, width_tablet: { unit: '%', size: 45, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] } }, [
          E.imageBox(item.image || PLACEHOLDER, item.name, 'Explore crystals for ' + item.name.toLowerCase(), '/' + item.slug)
        ]);
      })
    ));
  }
  if (relatedConditions.length > 0) {
    relatedChildren.push(E.textEditor('<strong>Read the full guides</strong>', { fontSize: 18, color: C.text, align: 'center' }));
    relatedChildren.push(E.wrap({ flex_direction: 'row', flex_wrap: 'wrap', flex_justify_content: 'center', flex_gap: E.gap(12) },
      relatedConditions.map(function (rc) {
        return E.buttonWidget('Read: ' + rc.name, '/crystals-for-' + rc.slug + '/');
      })
    ));
  }

  const relatedSection = E.section({
    padding: E.rPadding('80', '10', '80', '10', { tablet: { t: '60', r: '10', b: '60', l: '10' }, mobile: { t: '40', r: '10', b: '40', l: '10' } }),
    background_background: 'classic', background_color: C.cream
  }, relatedChildren);

  return [heroSection, resonanceSection, storySection, crystalSection, shopSection, faqSection, ctaSection, relatedSection];
}

async function main() {
  const cfg = require('../configs/intentions/calm-mindfulness.json');
  const data = generateIntentionPage(cfg);
  await E.updatePage(16883, data, 'draft');
}

if (require.main === module) {
  main().catch(function (err) { console.error('Error:', err.message || err); process.exit(1); });
}

module.exports = generateIntentionPage;
