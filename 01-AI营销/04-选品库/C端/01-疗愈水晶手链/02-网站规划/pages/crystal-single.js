/**
 * Crystal Guide 单品百科页模板 — /crystal-guide/[crystal]-meaning
 *
 * 9个Section：
 *  1. Hero: H1: "[Crystal Name] Meaning, Properties & How to Use It" + 诗意副标题
 *  2. 三视角介绍 — 科学(矿物学) + 灵性(脉轮/星座) + 心理学(正念/仪式)
 *  3. 多维属性 — 产地/硬度/化学式/脉轮/星座/元素/数字/最佳搭配
 *  4. 核心功效 — 5-7个功效列表
 *  5. 如何使用 — 佩戴/冥想/家居/仪式 4个场景
 *  6. 对应产品 — 该水晶所有产品列表（零跳转设计）
 *  7. 搭配推荐 — 3-4个最佳搭配建议
 *  8. 相关水晶 — 4个相似功效水晶
 *  9. FAQ — 3-5个该水晶常见问题
 *
 * 用法：
 *   const config = { crystal: 'Amethyst', ... };
 *   generateCrystalSingle(config);
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// 占位图 URL
const IMG = IMAGES.products.bracelet.url;
const IMG_WIDE = IMAGES.shared.wide.url;

/**
 * 生成 Crystal Guide 单品百科页 Elementor 数据
 *
 * @param {object} config
 * @param {string} config.crystal         - 水晶名 (e.g. "Amethyst")
 * @param {string} config.subtitle        - 诗意副标题
 * @param {string} config.heroDesc        - Hero 区描述段
 * @param {object} config.perspectives    - {scientific, spiritual, psychological}
 * @param {object} config.attributes      - {origin, hardness, formula, chakra, zodiac, element, number, bestPairing}
 * @param {Array}  config.benefits        - [{title, desc}] 5-7个功效
 * @param {Array}  config.usageScenes     - [{title, desc, icon}] 4个使用场景
 * @param {Array}  config.pairings        - [{name, why, slug}] 3-4个搭配推荐
 * @param {Array}  config.relatedCrystals - [{name, slug, benefit}] 4个相关水晶
 * @param {Array}  config.faqs            - [{title, content}] 3-5个FAQ
 */
function generateCrystalSingle(config) {
  const c = Object.assign({
    crystal: 'Amethyst',
    subtitle: 'A gateway to higher consciousness and inner peace',
    heroDesc: 'For centuries, Amethyst has been revered as a stone of spiritual protection, purification, and divine connection. Its mesmerizing violet hues carry a frequency that calms the mind, opens the third eye, and invites a profound sense of serenity.',
    perspectives: {
      scientific: 'Amethyst is a purple variety of quartz (SiO\u2082) colored by iron impurities and natural irradiation. With a Mohs hardness of 7, it is durable enough for daily wear. Major deposits are found in Brazil, Uruguay, and Zambia. The color ranges from pale lavender to deep violet, with the most valued specimens exhibiting a rich, saturated purple.',
      spiritual: 'Amethyst resonates primarily with the crown chakra (Sahasrara) and the third eye chakra (Ajna), creating a bridge between earthly awareness and higher consciousness. In ancient traditions, it was worn by priests and healers as a talisman against negative energy. It is associated with the zodiac signs of Pisces, Aquarius, and Virgo.',
      psychological: 'The violet wavelength of Amethyst is associated with calm and contemplation in color psychology. Using Amethyst as a mindfulness anchor — holding it during meditation or wearing it as a daily reminder — creates a powerful behavioral trigger for present-moment awareness and intentional breathing exercises.'
    },
    attributes: {
      origin: 'Brazil, Uruguay, Zambia, Madagascar',
      hardness: '7 (Mohs scale)',
      formula: 'SiO\u2082 (Silicon Dioxide)',
      chakra: 'Crown, Third Eye',
      zodiac: 'Pisces, Aquarius, Virgo',
      element: 'Air, Water',
      number: '3',
      bestPairing: 'Clear Quartz, Rose Quartz, Black Tourmaline'
    },
    benefits: [
      { title: 'Deep Calm & Tranquility', desc: 'Amethyst\'s soothing energy dissolves anxiety and nervous tension, replacing it with a blanket of serenity that permeates your entire being.' },
      { title: 'Enhanced Intuition', desc: 'By opening the third eye chakra, Amethyst sharpens your inner vision and heightens your ability to trust your instincts and inner knowing.' },
      { title: 'Restful Sleep', desc: 'Placing Amethyst under your pillow or on your nightstand promotes deep, restorative sleep and helps ward off insomnia and nightmares.' },
      { title: 'Spiritual Growth', desc: 'As a crown chakra stone, Amethyst accelerates your spiritual journey, deepening meditation and opening doorways to higher states of consciousness.' },
      { title: 'Emotional Balance', desc: 'Amethyst gently clears emotional blockages, helping you process grief, anger, and sadness with grace and self-compassion.' },
      { title: 'Mental Clarity', desc: 'Its purifying vibration cuts through mental fog, allowing you to think clearly, make decisions confidently, and focus on what truly matters.' },
      { title: 'Protection & Purification', desc: 'Historically worn as a protective amulet, Amethyst creates an energetic shield against negative influences and psychic attacks.' }
    ],
    usageScenes: [
      { title: 'Wear It Daily', desc: 'Wear an Amethyst bracelet on your left wrist to absorb its calming energy throughout the day. Let it be your portable peace anchor.', icon: '\uD83D\uDC8E' },
      { title: 'Meditation Companion', desc: 'Hold a raw Amethyst crystal in your palm or place it on your third eye during meditation to deepen your practice and enhance intuitive insights.', icon: '\uD83E\uDDD8' },
      { title: 'Home Sanctuary', desc: 'Place Amethyst clusters in your bedroom or meditation space to create a calming atmosphere and purify the energy of your environment.', icon: '\uD83C\uDFE0' },
      { title: 'Ritual & Ceremony', desc: 'Incorporate Amethyst into full moon rituals, intention-setting ceremonies, or energy cleansing practices for amplified spiritual connection.', icon: '\uD83C\uDF19' }
    ],
    pairings: [
      { name: 'Clear Quartz', why: 'Amplifies Amethyst\'s energy and creates a powerful clarity-calming combo for meditation and intention work.', slug: 'clear-quartz' },
      { name: 'Rose Quartz', why: 'Together they form a heart-mind bridge — Rose Quartz opens the heart while Amethyst stills the mind, creating profound inner harmony.', slug: 'rose-quartz' },
      { name: 'Black Tourmaline', why: 'The ultimate protection pair — Black Tourmaline grounds and shields while Amethyst elevates and purifies.', slug: 'black-tourmaline' },
      { name: 'Citrine', why: 'Citrine\'s solar energy balances Amethyst\'s lunar calm, creating a beautiful yin-yang dynamic for manifesting with joy.', slug: 'citrine' }
    ],
    relatedCrystals: [
      { name: 'Lepidolite', slug: 'lepidolite', benefit: 'Calming & Anxiety Relief' },
      { name: 'Labradorite', slug: 'labradorite', benefit: 'Intuition & Spiritual Growth' },
      { name: 'Selenite', slug: 'selenite', benefit: 'Purification & Crown Chakra' },
      { name: 'Fluorite', slug: 'fluorite', benefit: 'Mental Clarity & Focus' }
    ],
    faqs: [
      { title: 'How do I cleanse my Amethyst?', content: 'Amethyst is best cleansed under moonlight (especially during a full moon), with sage smoke, or by placing it on a selenite charging plate. Avoid prolonged direct sunlight, which can fade its color over time.' },
      { title: 'Can I wear Amethyst every day?', content: 'Absolutely! With a Mohs hardness of 7, Amethyst is durable enough for daily wear. Many people find that wearing it consistently deepens their connection to the stone\'s energy.' },
      { title: 'Which chakra does Amethyst activate?', content: 'Amethyst primarily activates the crown chakra (at the top of the head) and the third eye chakra (between the eyebrows), creating a bridge to higher consciousness and enhanced intuition.' },
      { title: 'Is Amethyst safe in water?', content: 'Brief contact with water is fine, but avoid prolonged soaking as it can damage the stone over time. Amethyst should not be placed in salt water.' },
      { title: 'How can I tell if my Amethyst is real?', content: 'Genuine Amethyst has natural color variations, feels cool to the touch initially, and may contain slight inclusions. If the color is perfectly uniform or the price seems too good to be true, it may be synthetic.' }
    ]
  }, config);

  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '20', b: '40', l: '20' }, mobile: { t: '40', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading(c.crystal + ' Meaning, Properties & How to Use It', {
        fontSize: 42, align: 'center', fontWeight: '700',
        padding: E.rPadding('0', '0', '15', '0')
      }),
      E.textEditor('<em>' + c.subtitle + '</em>', {
        fontSize: 20, align: 'center', color: '#8b7d6b', lineHeight: 32
      }),
      E.spacer('25'),
      E.textEditor(c.heroDesc, {
        fontSize: 16, align: 'center', color: '#555', lineHeight: 28
      }),
      E.spacer('20'),
      E.imageWidget(IMG_WIDE, { alt: c.crystal, width: 80, radius: 12 })
    ]),

    // ===================== Section 2: 三视角介绍 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Understanding ' + c.crystal, { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Three perspectives. One crystal. Infinite wisdom.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(24),
        content_width: 'full'
      }, [
        // 科学视角
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(12),
          padding: E.rPadding('30', '25', '30', '25'),
          background_background: 'classic',
          background_color: '#faf7f2',
          border_radius: { unit: 'px', size: 10, sizes: [] }
        }, E.rWidth('33.33', '50', '100')), [
          E.heading('Scientific Perspective', { fontSize: 20, align: 'center', fontWeight: '600', color: '#5b8c5a' }),
          E.divider(),
          E.textEditor(c.perspectives.scientific, { fontSize: 14, align: 'left', color: '#555', lineHeight: 24 })
        ]),
        // 灵性视角
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(12),
          padding: E.rPadding('30', '25', '30', '25'),
          background_background: 'classic',
          background_color: '#faf7f2',
          border_radius: { unit: 'px', size: 10, sizes: [] }
        }, E.rWidth('33.33', '50', '100')), [
          E.heading('Spiritual Perspective', { fontSize: 20, align: 'center', fontWeight: '600', color: '#7b68ae' }),
          E.divider(),
          E.textEditor(c.perspectives.spiritual, { fontSize: 14, align: 'left', color: '#555', lineHeight: 24 })
        ]),
        // 心理学视角
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(12),
          padding: E.rPadding('30', '25', '30', '25'),
          background_background: 'classic',
          background_color: '#faf7f2',
          border_radius: { unit: 'px', size: 10, sizes: [] }
        }, E.rWidth('33.33', '50', '100')), [
          E.heading('Psychological Perspective', { fontSize: 20, align: 'center', fontWeight: '600', color: '#c47a5a' }),
          E.divider(),
          E.textEditor(c.perspectives.psychological, { fontSize: 14, align: 'left', color: '#555', lineHeight: 24 })
        ])
      ])
    ]),

    // ===================== Section 3: 多维属性 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading(c.crystal + ' at a Glance', { fontSize: 32, align: 'center' }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(16),
        content_width: 'full'
      }, [
        // 左列
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10)
        }, E.rWidth('50', '50', '100')), [
          attrRow('Origin', c.attributes.origin),
          attrRow('Hardness', c.attributes.hardness),
          attrRow('Chemical Formula', c.attributes.formula),
          attrRow('Chakra', c.attributes.chakra)
        ]),
        // 右列
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10)
        }, E.rWidth('50', '50', '100')), [
          attrRow('Zodiac Signs', c.attributes.zodiac),
          attrRow('Element', c.attributes.element),
          attrRow('Numerology', c.attributes.number),
          attrRow('Best Pairing', c.attributes.bestPairing)
        ])
      ])
    ]),

    // ===================== Section 4: 核心功效 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('The Healing Benefits of ' + c.crystal, { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Discover what this ancient stone can do for your mind, body, and spirit.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, c.benefits.slice(0, 7).map(b =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(8),
          padding: E.rPadding('20', '20', '20', '20'),
          background_background: 'classic',
          background_color: '#faf7f2',
          border_radius: { unit: 'px', size: 8, sizes: [] }
        }, E.rWidth(getBenefitWidth(c.benefits.length), '50', '100')), [
          E.heading(b.title, { fontSize: 16, align: 'left', fontWeight: '600' }),
          E.textEditor(b.desc, { fontSize: 14, align: 'left', color: '#555', lineHeight: 22 })
        ])
      ))
    ]),

    // ===================== Section 5: 如何使用 — 4个场景 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('How to Use ' + c.crystal, { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Four simple ways to invite this crystal\'s energy into your life.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(24),
        content_width: 'full'
      }, c.usageScenes.map(scene =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10),
          padding: E.rPadding('25', '25', '25', '25'),
          background_background: 'classic',
          background_color: '#ffffff',
          border_radius: { unit: 'px', size: 10, sizes: [] },
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          E.htmlWidget('<div style="font-size:40px;text-align:center;">' + scene.icon + '</div>'),
          E.heading(scene.title, { fontSize: 18, align: 'center', fontWeight: '600' }),
          E.textEditor(scene.desc, { fontSize: 14, align: 'center', color: '#666', lineHeight: 22 })
        ])
      ))
    ]),

    // ===================== Section 6: 对应产品（零跳转设计） =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Shop ' + c.crystal + ' Bracelets', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Bring the energy of ' + c.crystal + ' into your life. Each piece is handcrafted with intention and love.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      // WoodMart 产品组件 — 通过 WooCommerce 标签/分类自动筛选该水晶产品
      E.wdProductsWidget(6)
    ]),

    // ===================== Section 7: 搭配推荐 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Best Crystal Pairings for ' + c.crystal, { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Crystals that amplify and complement ' + c.crystal + '\'s unique energy.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, c.pairings.map(p =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10),
          padding: E.rPadding('20', '20', '20', '20'),
          background_background: 'classic',
          background_color: '#ffffff',
          border_radius: { unit: 'px', size: 8, sizes: [] },
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          E.imageWidget(IMG, { alt: p.name, width: 60, radius: 50 }),
          E.heading(p.name, { fontSize: 18, align: 'center', fontWeight: '600' }),
          E.textEditor(p.why, { fontSize: 14, align: 'center', color: '#666', lineHeight: 22 }),
          E.buttonWidget('Learn More \u2192', '/crystal-guide/' + p.slug + '-meaning')
        ])
      ))
    ]),

    // ===================== Section 8: 相关水晶 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Related Crystals You\'ll Love', { fontSize: 32, align: 'center' }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, c.relatedCrystals.map(rc =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(8),
          padding: E.rPadding('20', '20', '20', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#e8e0d4',
          border_radius: { unit: 'px', size: 8, sizes: [] },
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          E.imageWidget(IMG, { alt: rc.name, width: 50, radius: 50 }),
          E.heading(rc.name, { fontSize: 18, align: 'center', fontWeight: '600' }),
          E.textEditor(rc.benefit, { fontSize: 14, align: 'center', color: '#888' }),
          E.buttonWidget('Explore \u2192', '/crystal-guide/' + rc.slug + '-meaning')
        ])
      ))
    ]),

    // ===================== Section 9: FAQ =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Frequently Asked Questions About ' + c.crystal, { fontSize: 28, align: 'center' }),
      E.spacer('30'),
      E.accordion(c.faqs)
    ])
  ];
}

/**
 * 属性行辅助函数
 */
function attrRow(label, value) {
  return E.wrap({
    flex_direction: 'row',
    flex_gap: E.gap(12),
    padding: E.rPadding('10', '16', '10', '16'),
    background_background: 'classic',
    background_color: '#ffffff',
    border_radius: { unit: 'px', size: 6, sizes: [] },
    flex_align_items: 'center'
  }, [
    E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('35', '35', '35')), [
      E.textEditor('<strong>' + label + '</strong>', { fontSize: 13, align: 'left', color: '#8b7d6b' })
    ]),
    E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('65', '65', '65')), [
      E.textEditor(value, { fontSize: 14, align: 'left', color: '#555' })
    ])
  ]);
}

/**
 * 根据功效数量计算每行宽度百分比
 */
function getBenefitWidth(count) {
  if (count <= 3) return '33.33';
  if (count <= 4) return '25';
  if (count <= 6) return '33.33';
  return '25';
}

// ============================================================
// 演示入口
// ============================================================
async function main() {
  const config = {
    crystal: 'Amethyst',
    subtitle: 'A gateway to higher consciousness and inner peace',
    heroDesc: 'For centuries, Amethyst has been revered as a stone of spiritual protection, purification, and divine connection. Its mesmerizing violet hues carry a frequency that calms the mind, opens the third eye, and invites a profound sense of serenity into your daily life.',
    perspectives: {
      scientific: 'Amethyst is a purple variety of quartz (SiO\u2082) colored by iron impurities and natural irradiation. With a Mohs hardness of 7, it is durable enough for daily wear. Major deposits are found in Brazil, Uruguay, and Zambia. The color ranges from pale lavender to deep violet, with the most valued specimens exhibiting a rich, saturated purple.',
      spiritual: 'Amethyst resonates primarily with the crown chakra (Sahasrara) and the third eye chakra (Ajna), creating a bridge between earthly awareness and higher consciousness. In ancient traditions, it was worn by priests and healers as a talisman against negative energy. It is associated with the zodiac signs of Pisces, Aquarius, and Virgo.',
      psychological: 'The violet wavelength of Amethyst is associated with calm and contemplation in color psychology. Using Amethyst as a mindfulness anchor — holding it during meditation or wearing it as a daily reminder — creates a powerful behavioral trigger for present-moment awareness and intentional breathing exercises.'
    },
    attributes: {
      origin: 'Brazil, Uruguay, Zambia, Madagascar',
      hardness: '7 (Mohs scale)',
      formula: 'SiO\u2082 (Silicon Dioxide)',
      chakra: 'Crown, Third Eye',
      zodiac: 'Pisces, Aquarius, Virgo',
      element: 'Air, Water',
      number: '3',
      bestPairing: 'Clear Quartz, Rose Quartz, Black Tourmaline'
    },
    benefits: [
      { title: 'Deep Calm & Tranquility', desc: 'Amethyst\'s soothing energy dissolves anxiety and nervous tension, replacing it with a blanket of serenity that permeates your entire being.' },
      { title: 'Enhanced Intuition', desc: 'By opening the third eye chakra, Amethyst sharpens your inner vision and heightens your ability to trust your instincts.' },
      { title: 'Restful Sleep', desc: 'Placing Amethyst under your pillow promotes deep, restorative sleep and helps ward off insomnia.' },
      { title: 'Spiritual Growth', desc: 'As a crown chakra stone, Amethyst deepens meditation and opens doorways to higher states of consciousness.' },
      { title: 'Emotional Balance', desc: 'Amethyst gently clears emotional blockages, helping you process grief and sadness with grace.' },
      { title: 'Mental Clarity', desc: 'Its purifying vibration cuts through mental fog, allowing clear thinking and confident decisions.' },
      { title: 'Protection & Purification', desc: 'Historically worn as a protective amulet, Amethyst creates an energetic shield against negative influences.' }
    ],
    usageScenes: [
      { title: 'Wear It Daily', desc: 'Wear an Amethyst bracelet on your left wrist to absorb its calming energy throughout the day.', icon: '\uD83D\uDC8E' },
      { title: 'Meditation Companion', desc: 'Hold a raw Amethyst in your palm or place it on your third eye during meditation for deeper insights.', icon: '\uD83E\uDDD8' },
      { title: 'Home Sanctuary', desc: 'Place Amethyst clusters in your bedroom or meditation space to purify the energy of your environment.', icon: '\uD83C\uDFE0' },
      { title: 'Ritual & Ceremony', desc: 'Incorporate Amethyst into full moon rituals and intention-setting ceremonies for amplified connection.', icon: '\uD83C\uDF19' }
    ],
    pairings: [
      { name: 'Clear Quartz', why: 'Amplifies Amethyst\'s energy and creates a powerful clarity-calming combo for meditation.', slug: 'clear-quartz' },
      { name: 'Rose Quartz', why: 'Together they form a heart-mind bridge — Rose Quartz opens the heart while Amethyst stills the mind.', slug: 'rose-quartz' },
      { name: 'Black Tourmaline', why: 'The ultimate protection pair — Black Tourmaline grounds while Amethyst elevates.', slug: 'black-tourmaline' },
      { name: 'Citrine', why: 'Citrine\'s solar energy balances Amethyst\'s lunar calm for manifesting with joy.', slug: 'citrine' }
    ],
    relatedCrystals: [
      { name: 'Lepidolite', slug: 'lepidolite', benefit: 'Calming & Anxiety Relief' },
      { name: 'Labradorite', slug: 'labradorite', benefit: 'Intuition & Spiritual Growth' },
      { name: 'Selenite', slug: 'selenite', benefit: 'Purification & Crown Chakra' },
      { name: 'Fluorite', slug: 'fluorite', benefit: 'Mental Clarity & Focus' }
    ],
    faqs: [
      { title: 'How do I cleanse my Amethyst?', content: 'Amethyst is best cleansed under moonlight (especially during a full moon), with sage smoke, or by placing it on a selenite charging plate. Avoid prolonged direct sunlight, which can fade its color over time.' },
      { title: 'Can I wear Amethyst every day?', content: 'Absolutely! With a Mohs hardness of 7, Amethyst is durable enough for daily wear. Many people find that wearing it consistently deepens their connection to the stone\'s energy.' },
      { title: 'Which chakra does Amethyst activate?', content: 'Amethyst primarily activates the crown chakra (at the top of the head) and the third eye chakra (between the eyebrows), creating a bridge to higher consciousness and enhanced intuition.' },
      { title: 'Is Amethyst safe in water?', content: 'Brief contact with water is fine, but avoid prolonged soaking as it can damage the stone over time.' },
      { title: 'How can I tell if my Amethyst is real?', content: 'Genuine Amethyst has natural color variations, feels cool to the touch initially, and may contain slight inclusions. If the color is perfectly uniform, it may be synthetic.' }
    ]
  };

  await E.createPage(
    config.crystal + ' Meaning, Properties & How to Use It',
    config.crystal.toLowerCase() + '-meaning',
    generateCrystalSingle(config),
    'draft'
  );
}

main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
