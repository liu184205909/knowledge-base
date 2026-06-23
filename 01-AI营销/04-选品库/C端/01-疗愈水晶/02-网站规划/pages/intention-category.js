/**
 * Shop by Intention 分类页模板 V2（UI 对齐 about/首页 + 水晶卡用 stone-core-data 百科数据）
 * URL: /[intention-slug]（根级 WordPress page）
 *
 * V2：去 S5 使用场景 / 水晶卡减负为选购入口 / S8 强化相关 condition
 *
 * 8 Section：Hero / 意图共鸣 / 意图故事 / 水晶卡(百科数据) / Shop / FAQ / CTA banner / Related
 * H1 由 WoodMart 主题 Page Title 区输出，本页 Hero 不写 H1。
 * *
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
  const shopSubtitle = config.shopSubtitle;
  const featuredCta = config.featuredCta || {};
  const crystals = config.crystals || [];
  const productCategories = config.productCategories || [];
  const faq = config.faq || [];
  const relatedIntentions = config.relatedIntentions || [];
  const relatedConditions = config.relatedConditions || [];

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
      E.heading(intention + ' Crystals', { headerSize: 'h1', fontSize: 52, color: '#FFFFFF', align: 'center' }),
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
        E.imageWidget((crystals[0] && crystals[0].image) || heroImage || PLACEHOLDER, { radius: 12, width: 100 })
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
        E.imageWidget((crystals[1] && crystals[1].image) || heroImage || PLACEHOLDER, { radius: 10, width: 100 })
      ])
    ])
  ]);

  // S4 水晶卡：只保留一眼能判断的选购信息，百科细节留给 meaning 页。
  const crystalCards = crystals.map(function (crystal) {
    const bestFor = crystal.best_for ? ('Often chosen for ' + crystal.best_for.toLowerCase() + '.') : 'Learn why this crystal is often chosen for this intention.';
    return E.wrap({
      content_width: 'full',
      width: { unit: '%', size: 31, sizes: [] }, width_tablet: { unit: '%', size: 45, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] },
      background_background: 'classic', background_color: C.card,
      border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
      padding: E.rPadding('25', '22', '25', '22'),
      flex_direction: 'column', flex_gap: E.gap(8)
    }, [
      E.imageBox(crystal.image || PLACEHOLDER, crystal.name, bestFor, crystal.link || '#')
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
    E.heading('Shop ' + intention + ' Crystal Categories', { headerSize: 'h2', fontSize: 36, color: C.text, align: 'center' }),
    E.textEditor(shopSubtitle || ('Start with crystal pieces chosen for ' + intentionLower + '.'), { fontSize: 17, color: C.mute, align: 'center' }),
    E.wdProductCategoriesWidget({
      ids: productCategories.map(function (cat) { return cat.id; }),
      number: productCategories.length || 5,
      columns: 3,
      orderby: 'include'
    })
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
    background_image: { url: featuredCta.image || heroImage || PLACEHOLDER, source: 'url', size: '' },
    background_position: 'center center', background_repeat: 'no-repeat', background_size: 'cover',
    background_overlay_background: 'classic', background_overlay_color: C.dark,
    background_overlay_opacity: { unit: 'px', size: 0.72, sizes: [] }
  }, [
    E.wrap({ content_width: 'boxed' }, [
      E.heading(featuredCta.title || ('Find Your ' + intention + ' Crystal'), { fontSize: 40, color: '#FFFFFF', align: 'center' }),
      E.textEditor(featuredCta.subtitle || 'Choose one crystal to start with, then build a ritual that feels simple enough to keep.', { fontSize: 18, color: '#d0c5b7', align: 'center', lineHeight: 28 }),
      E.buttonWidget(featuredCta.buttonText || 'Explore the First Crystal', featuredCta.link || '/shop')
    ])
  ]);

  // S8 Related：优先给强相关 condition，避免页面末尾把用户分散到过多弱入口。
  const relatedChildren = [
    E.heading('Related Needs', { headerSize: 'h2', fontSize: 34, color: C.text, align: 'center' })
  ];
  if (relatedConditions.length > 0) {
    relatedChildren.push(E.textEditor('If calm is your goal, these guides are the closest next steps.', { fontSize: 17, color: C.mute, align: 'center' }));
    relatedChildren.push(E.wrap({ flex_direction: 'row', flex_wrap: 'wrap', flex_justify_content: 'center', flex_gap: E.gap(12) },
      relatedConditions.map(function (rc) {
        return E.buttonWidget('Read: ' + rc.name, '/crystals-for-' + rc.slug + '/');
      })
    ));
  }
  if (relatedIntentions.length > 0) {
    relatedChildren.push(E.textEditor('Other intention paths', { fontSize: 17, color: C.mute, align: 'center' }));
    relatedChildren.push(E.wrap({ content_width: 'full', flex_direction: 'row', flex_wrap: 'wrap', flex_gap: E.gap(20) },
      relatedIntentions.slice(0, 3).map(function (item) {
        return E.wrap({ width: { unit: '%', size: 31, sizes: [] }, width_tablet: { unit: '%', size: 45, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] } }, [
          E.imageBox(item.image || PLACEHOLDER, item.name, 'Explore crystals for ' + item.name.toLowerCase(), '/' + item.slug)
        ]);
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
