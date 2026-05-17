/**
 * 产品详情页模板 — /products/[product-slug]
 *
 * 11个Section：
 *  1. 产品图片（5-7张图占位）— 左图右信息 2列布局
 *  2. 产品信息 — 标题+诗意副标题+评分+价格+尺寸选择+CTA+信任信息
 *  3. 简短描述 — 1-2句核心功效
 *  4. 详细功效 — "Why This Crystal Works" — 每种成分一段说明+Affirmation
 *  5. 产品规格 — Stone/Bead Size/Length/Material/Chakra/Zodiac/Origin/Weight
 *  6. 如何使用 — "How to Work With Your Crystal" 4步指南
 *  7. 包装展示 — "What You'll Receive" 清单
 *  8. 三视角百科摘要 — 科学+灵性+心理学视角（简版）
 *  9. 相关产品 — 4-6个占位
 *  10. 评论区 — 占位
 *  11. 信任徽章 — 6项信任点
 *
 * 用法：
 *   const config = { name: 'Amethyst Bracelet', subtitle: '...', ... };
 *   generateProductDetail(config);
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// 占位图 URL
const IMG = IMAGES.products.bracelet.url;

/**
 * 生成产品详情页 Elementor 数据
 *
 * @param {object} config
 * @param {string} config.name          - 产品名 (e.g. "Amethyst Healing Bracelet")
 * @param {string} config.subtitle      - 诗意副标题
 * @param {string} config.price         - 价格 (e.g. "$39.99")
 * @param {string} config.comparePrice  - 原价 (e.g. "$59.99")
 * @param {string} config.shortDesc     - 1-2句核心功效
 * @param {Array}  config.ingredients   - [{name, why, affirmation}] 成分说明
 * @param {object} config.specs         - {stone, beadSize, length, material, chakra, zodiac, origin, weight}
 * @param {Array}  config.steps         - [{title, desc}] 4步使用指南
 * @param {Array}  config.packageItems  - [{title, desc}] 包装内容清单
 * @param {Array}  config.perspectives  - [{title, content}] 三视角内容
 * @param {number} config.imageCount    - 图片数量 (5-7)
 * @param {Array}  config.sizes         - 可选尺寸 (e.g. ["S (6mm)", "M (8mm)", "L (10mm)"])
 * @param {number} config.rating        - 评分 (e.g. 4.8)
 * @param {number} config.reviewCount   - 评论数
 */
function generateProductDetail(config) {
  const c = Object.assign({
    name: 'Crystal Healing Bracelet',
    subtitle: 'Where ancient wisdom meets modern intention',
    price: '$39.99',
    comparePrice: '$59.99',
    shortDesc: 'Handcrafted with genuine crystals to bring balance, peace, and positive energy into your daily life.',
    ingredients: [
      { name: 'Amethyst', why: 'Known as the master healer, Amethyst purifies the mind and clears negative thoughts, opening the door to deeper intuition and spiritual awareness.', affirmation: 'I am calm, centered, and connected to my inner wisdom.' },
      { name: 'Clear Quartz', why: 'The universal amplifier, Clear Quartz magnifies the energy of every stone it touches, bringing clarity and focus to your intentions.', affirmation: 'My intentions are clear, powerful, and aligned with my highest good.' },
      { name: 'Rose Quartz', why: 'The stone of unconditional love, Rose Quartz opens the heart chakra, inviting compassion, self-love, and deep emotional healing.', affirmation: 'I give and receive love freely and without fear.' }
    ],
    specs: {
      stone: 'Natural Amethyst, Clear Quartz, Rose Quartz',
      beadSize: '8mm (also available in 6mm & 10mm)',
      length: '7.5 inches (adjustable)',
      material: '100% natural gemstone beads, elastic cord',
      chakra: 'Crown, Heart, Third Eye',
      zodiac: 'Pisces, Aquarius, Virgo',
      origin: 'Brazil, Madagascar',
      weight: 'Approx. 25g'
    },
    steps: [
      { title: 'Cleanse', desc: 'Before first wear, cleanse your bracelet under moonlight or with sage smoke to clear any absorbed energies.' },
      { title: 'Set Your Intention', desc: 'Hold your bracelet close and silently speak your intention. Let the crystals absorb your deepest wish.' },
      { title: 'Wear Daily', desc: 'Place on your left wrist (receiving side) to absorb healing energy throughout the day.' },
      { title: 'Recharge Weekly', desc: 'Set your bracelet on a selenite plate or in moonlight once a week to keep its energy vibrant.' }
    ],
    packageItems: [
      { title: 'Crystal Bracelet', desc: 'Handcrafted with genuine, ethically-sourced gemstone beads' },
      { title: 'Velvet Pouch', desc: 'A soft storage pouch to protect and carry your crystals' },
      { title: 'Guide Card', desc: 'A detailed crystal care guide with cleansing and intention-setting instructions' },
      { title: 'Purification Card', desc: 'Step-by-step purification ritual for your new crystal companion' }
    ],
    perspectives: [
      { title: 'Scientific Perspective', content: 'Amethyst is a variety of quartz (SiO2) containing iron impurities that create its signature purple hue through natural irradiation. Clear Quartz exhibits piezoelectric properties used in modern technology.' },
      { title: 'Spiritual Perspective', content: 'In crystal healing traditions, Amethyst resonates with the crown chakra, facilitating spiritual growth and divine connection. Rose Quartz opens the heart chakra to unconditional love.' },
      { title: 'Psychological Perspective', content: 'The practice of wearing intention-based jewelry engages mindful awareness, serving as a tactile anchor for positive affirmations and daily reflection rituals.' }
    ],
    imageCount: 6,
    sizes: ['S (6mm)', 'M (8mm)', 'L (10mm)'],
    rating: 4.8,
    reviewCount: 1247
  }, config);

  // 信任徽章数据
  const trustBadges = [
    { title: '100% Natural Crystals', desc: 'Every stone is genuine and ethically sourced' },
    { title: 'Cleansed & Charged', desc: 'Purified with sage and moonlight before shipping' },
    { title: 'Free Shipping', desc: 'On all orders over $50' },
    { title: '30-Day Returns', desc: 'Love it or your money back' },
    { title: 'Gift-Ready Packaging', desc: 'Arrives in a beautiful velvet pouch' },
    { title: '1-Year Warranty', desc: 'We stand behind every crystal we sell' }
  ];

  return [

    // ===================== Section 1: 产品图片（左图右信息 2列） =====================
    E.section({
      flex_direction: 'row',
      content_width: 'full',
      padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      // 左列：产品图片（占位）
      E.wrap(Object.assign({
        flex_direction: 'column',
        padding: E.rPadding('0', '20', '0', '0', { mobile: { r: '0', b: '20' } })
      }, E.rWidth('55', '50', '100')), [
        E.imageWidget(IMG, { alt: c.name + ' - Main Image', width: 100, radius: 8 }),
        E.spacer('15'),
        // 缩略图行
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(10),
          content_width: 'full'
        }, Array.from({ length: Math.min(c.imageCount, 5) }, (_, i) =>
          E.imageWidget(IMG, { alt: c.name + ' - View ' + (i + 1), width: 100, radius: 5 })
        ))
      ]),
      // 右列：基本信息摘要（简版，详情在 Section 2）
      E.wrap(Object.assign({
        flex_direction: 'column',
        flex_gap: E.gap(12)
      }, E.rWidth('45', '50', '100')), [
        E.heading(c.name, { fontSize: 28, align: 'left', fontWeight: '700' }),
        E.textEditor('<em>' + c.subtitle + '</em>', { fontSize: 16, align: 'left', color: '#8b7d6b' }),
        // 评分
        E.htmlWidget(
          '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span style="color:#f5a623;font-size:18px;">' + '\u2605'.repeat(Math.floor(c.rating)) + (c.rating % 1 >= 0.5 ? '\u2606' : '') + '</span>' +
          '<span style="font-size:14px;color:#666;">' + c.rating + ' (' + c.reviewCount + ' reviews)</span>' +
          '</div>'
        ),
        // 价格
        E.htmlWidget(
          '<div style="display:flex;align-items:baseline;gap:12px;">' +
          '<span style="font-size:32px;font-weight:700;color:#333;">' + c.price + '</span>' +
          (c.comparePrice ? '<span style="font-size:18px;color:#999;text-decoration:line-through;">' + c.comparePrice + '</span>' +
          '<span style="font-size:14px;color:#e74c3c;font-weight:600;">SAVE ' + Math.round((1 - parseFloat(c.price.replace('$', '')) / parseFloat(c.comparePrice.replace('$', ''))) * 100) + '%</span>' : '') +
          '</div>'
        ),
        // 尺寸选择
        E.heading('Select Your Size:', { fontSize: 14, align: 'left', fontWeight: '600', color: '#555' }),
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(8),
          content_width: 'full'
        }, c.sizes.map(s =>
          E.wrap({
            padding: E.rPadding('10', '20', '10', '20'),
            border_border: 'solid',
            border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
            border_color: '#d4c5b0',
            border_radius: { unit: 'px', size: 6, sizes: [] }
          }, [
            E.textEditor(s, { fontSize: 14, align: 'center', color: '#555' })
          ])
        )),
        // CTA
        E.buttonWidget('Add to Cart', '#'),
        E.spacer('5'),
        // 信任信息
        E.textEditor('<span style="color:#6b8e23;">\u2713</span> Free shipping on orders over $50 &nbsp;&nbsp; <span style="color:#6b8e23;">\u2713</span> 30-day money-back guarantee', { fontSize: 13, align: 'left', color: '#777' })
      ])
    ]),

    // ===================== Section 2: 产品信息（已在 Section 1 右列整合，此处补充信任信息栏） =====================
    E.section({
      padding: E.rPadding('40', '40', '40', '40', { mobile: { t: '20', r: '15', b: '20', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(30),
        content_width: 'full'
      }, [
        E.wrap(Object.assign({
          flex_direction: 'row',
          flex_gap: E.gap(8),
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '50')), [
          E.htmlWidget('<span style="font-size:20px;">\uD83D\uDE9A</span>'),
          E.textEditor('<strong>Free Shipping</strong><br>Orders over $50', { fontSize: 13, align: 'left', color: '#555' })
        ]),
        E.wrap(Object.assign({
          flex_direction: 'row',
          flex_gap: E.gap(8),
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '50')), [
          E.htmlWidget('<span style="font-size:20px;">\u2728</span>'),
          E.textEditor('<strong>Cleansed & Charged</strong><br>Ready to wear', { fontSize: 13, align: 'left', color: '#555' })
        ]),
        E.wrap(Object.assign({
          flex_direction: 'row',
          flex_gap: E.gap(8),
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '50')), [
          E.htmlWidget('<span style="font-size:20px;">\uD83C\uDF81</span>'),
          E.textEditor('<strong>Gift-Ready</strong><br>Velvet pouch included', { fontSize: 13, align: 'left', color: '#555' })
        ]),
        E.wrap(Object.assign({
          flex_direction: 'row',
          flex_gap: E.gap(8),
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '50')), [
          E.htmlWidget('<span style="font-size:20px;">\uD83D\uDD12</span>'),
          E.textEditor('<strong>1-Year Warranty</strong><br>Quality guaranteed', { fontSize: 13, align: 'left', color: '#555' })
        ])
      ])
    ]),

    // ===================== Section 3: 简短描述 =====================
    E.section({
      padding: E.rPadding('50', '40', '30', '40', { mobile: { t: '30', r: '15', b: '20', l: '15' } })
    }, [
      E.textEditor(c.shortDesc, {
        fontSize: 18,
        align: 'center',
        color: '#555',
        lineHeight: 30
      })
    ]),

    // ===================== Section 4: 详细功效 "Why This Crystal Works" =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Why This Crystal Works', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Each stone in this bracelet was chosen for a reason. Here is what makes it special.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      // 每种成分一段
      ...c.ingredients.map(ing =>
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(30),
          content_width: 'full',
          padding: E.rPadding('0', '0', '30', '0')
        }, [
          E.wrap(Object.assign({
            flex_direction: 'column'
          }, E.rWidth('65', '60', '100')), [
            E.heading(ing.name, { fontSize: 22, align: 'left', fontWeight: '600' }),
            E.spacer('5'),
            E.textEditor(ing.why, { fontSize: 15, align: 'left', color: '#555', lineHeight: 26 })
          ]),
          E.wrap(Object.assign({
            flex_direction: 'column',
            padding: E.rPadding('20', '25', '20', '25'),
            background_background: 'classic',
            background_color: '#ffffff',
            border_border: 'solid',
            border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
            border_color: '#e8e0d4',
            border_radius: { unit: 'px', size: 8, sizes: [] }
          }, E.rWidth('35', '40', '100')), [
            E.heading('Affirmation', { fontSize: 13, align: 'center', fontWeight: '600', color: '#8b7d6b' }),
            E.textEditor('<em>"' + ing.affirmation + '"</em>', { fontSize: 15, align: 'center', color: '#666', lineHeight: 24 })
          ])
        ])
      )
    ]),

    // ===================== Section 5: 产品规格 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Product Specifications', { fontSize: 32, align: 'center' }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, [
        // 左列
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(12)
        }, E.rWidth('50', '50', '100')), [
          specRow('Stone', c.specs.stone),
          specRow('Bead Size', c.specs.beadSize),
          specRow('Length', c.specs.length),
          specRow('Material', c.specs.material)
        ]),
        // 右列
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(12)
        }, E.rWidth('50', '50', '100')), [
          specRow('Chakra', c.specs.chakra),
          specRow('Zodiac', c.specs.zodiac),
          specRow('Origin', c.specs.origin),
          specRow('Weight', c.specs.weight)
        ])
      ])
    ]),

    // ===================== Section 6: 如何使用 "How to Work With Your Crystal" =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('How to Work With Your Crystal', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('A simple four-step ritual to activate your bracelet\'s energy.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, c.steps.map((step, i) =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10),
          padding: E.rPadding('25', '20', '25', '20'),
          background_background: 'classic',
          background_color: '#ffffff',
          border_radius: { unit: 'px', size: 8, sizes: [] },
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          E.heading(String(i + 1), { fontSize: 36, align: 'center', fontWeight: '700', color: '#d4c5b0' }),
          E.heading(step.title, { fontSize: 18, align: 'center', fontWeight: '600' }),
          E.textEditor(step.desc, { fontSize: 14, align: 'center', color: '#666', lineHeight: 22 })
        ])
      ))
    ]),

    // ===================== Section 7: 包装展示 "What You'll Receive" =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('What You\'ll Receive', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Every order is thoughtfully prepared with love and intention.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, c.packageItems.map(item =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(8),
          padding: E.rPadding('20', '20', '20', '20'),
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          E.imageWidget(IMG, { alt: item.title, width: 100, radius: 8 }),
          E.heading(item.title, { fontSize: 16, align: 'center', fontWeight: '600' }),
          E.textEditor(item.desc, { fontSize: 13, align: 'center', color: '#777' })
        ])
      ))
    ]),

    // ===================== Section 8: 三视角百科摘要 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Three Perspectives on This Crystal', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Understanding your crystal through science, spirit, and mind.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(24),
        content_width: 'full'
      }, c.perspectives.map(p =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10),
          padding: E.rPadding('25', '25', '25', '25'),
          background_background: 'classic',
          background_color: '#ffffff',
          border_radius: { unit: 'px', size: 8, sizes: [] }
        }, E.rWidth('33.33', '50', '100')), [
          E.heading(p.title, { fontSize: 18, align: 'center', fontWeight: '600', color: '#8b7d6b' }),
          E.textEditor(p.content, { fontSize: 14, align: 'left', color: '#555', lineHeight: 24 }),
          E.buttonWidget('Read Full Guide \u2192', '/crystal-guide/' + c.name.toLowerCase().replace(/\s+/g, '-') + '-meaning')
        ])
      ))
    ]),

    // ===================== Section 9: 相关产品 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('You May Also Love', { fontSize: 32, align: 'center' }),
      E.spacer('30'),
      // 使用 WoodMart 产品组件占位
      E.wdProductsWidget(6)
    ]),

    // ===================== Section 10: 评论区 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('What Our Customers Say', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.htmlWidget(
        '<div style="text-align:center;">' +
        '<div style="font-size:48px;color:#f5a623;">\u2605\u2605\u2605\u2605\u2606</div>' +
        '<p style="font-size:24px;font-weight:700;color:#333;">' + c.rating + ' out of 5</p>' +
        '<p style="font-size:14px;color:#888;">Based on ' + c.reviewCount + ' reviews</p>' +
        '</div>'
      ),
      E.spacer('30'),
      // 评论区占位 — WooCommerce 评论将由主题渲染，此处留 HTML 占位
      E.htmlWidget(
        '<div style="text-align:center;padding:40px;background:#fff;border-radius:8px;color:#999;">' +
        '<p>Customer reviews will be displayed here by WooCommerce.</p>' +
        '</div>'
      )
    ]),

    // ===================== Section 11: 信任徽章 =====================
    E.section({
      padding: E.rPadding('50', '40', '50', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Why Shop With LuckyCrystals', { fontSize: 28, align: 'center' }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        content_width: 'full'
      }, trustBadges.map(badge =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(6),
          padding: E.rPadding('15', '15', '15', '15'),
          flex_align_items: 'center'
        }, E.rWidth('16.66', '33', '50')), [
          E.heading(badge.title, { fontSize: 14, align: 'center', fontWeight: '600', color: '#333' }),
          E.textEditor(badge.desc, { fontSize: 12, align: 'center', color: '#888' })
        ])
      ))
    ])
  ];
}

/**
 * 规格行辅助函数
 */
function specRow(label, value) {
  return E.wrap({
    flex_direction: 'row',
    flex_gap: E.gap(12),
    padding: E.rPadding('12', '16', '12', '16'),
    background_background: 'classic',
    background_color: '#faf7f2',
    border_radius: { unit: 'px', size: 6, sizes: [] },
    flex_align_items: 'center'
  }, [
    E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('30', '30', '30')), [
      E.textEditor('<strong>' + label + '</strong>', { fontSize: 14, align: 'left', color: '#8b7d6b' })
    ]),
    E.wrap(Object.assign({
      flex_direction: 'column'
    }, E.rWidth('70', '70', '70')), [
      E.textEditor(value, { fontSize: 14, align: 'left', color: '#555' })
    ])
  ]);
}

// ============================================================
// 演示入口
// ============================================================
async function main() {
  const config = {
    name: 'Amethyst Dream Bracelet',
    subtitle: 'A whisper of lavender light to calm the storm within',
    price: '$39.99',
    comparePrice: '$59.99',
    shortDesc: 'Handcrafted with genuine Amethyst, Clear Quartz, and Rose Quartz — this bracelet invites calm, clarity, and unconditional love into every moment of your day.',
    ingredients: [
      { name: 'Amethyst', why: 'Known as the master healer, Amethyst purifies the mind and clears negative thoughts, opening the door to deeper intuition and spiritual awareness. Its soothing violet frequency dissolves anxiety and invites restful sleep.', affirmation: 'I am calm, centered, and connected to my inner wisdom.' },
      { name: 'Clear Quartz', why: 'The universal amplifier, Clear Quartz magnifies the energy of every stone it touches, bringing laser-like clarity and focus to your intentions. It acts as a prism, transforming scattered energy into purposeful direction.', affirmation: 'My intentions are clear, powerful, and aligned with my highest good.' },
      { name: 'Rose Quartz', why: 'The stone of unconditional love, Rose Quartz opens the heart chakra, inviting compassion, self-love, and deep emotional healing. Its gentle pink essence wraps you in a warm embrace of acceptance and tenderness.', affirmation: 'I give and receive love freely and without fear.' }
    ],
    specs: {
      stone: 'Natural Amethyst, Clear Quartz, Rose Quartz',
      beadSize: '8mm (also available in 6mm & 10mm)',
      length: '7.5 inches (adjustable stretch)',
      material: '100% natural gemstone beads, premium elastic cord',
      chakra: 'Crown, Heart, Third Eye',
      zodiac: 'Pisces, Aquarius, Virgo',
      origin: 'Brazil, Madagascar',
      weight: 'Approx. 25g'
    },
    steps: [
      { title: 'Cleanse', desc: 'Before first wear, cleanse your bracelet under moonlight or with sage smoke to clear any absorbed energies and reset its vibration.' },
      { title: 'Set Your Intention', desc: 'Hold your bracelet close to your heart and silently speak your deepest intention. Let the crystals absorb and amplify your wish.' },
      { title: 'Wear Daily', desc: 'Place on your left wrist (the receiving side) to absorb healing energy throughout the day. Let it be your mindful companion.' },
      { title: 'Recharge Weekly', desc: 'Set your bracelet on a selenite plate or under moonlight once a week to keep its energy vibrant and potent.' }
    ],
    packageItems: [
      { title: 'Crystal Bracelet', desc: 'Handcrafted with genuine, ethically-sourced gemstone beads' },
      { title: 'Velvet Pouch', desc: 'A luxurious soft storage pouch to protect and carry your crystals' },
      { title: 'Guide Card', desc: 'Detailed crystal care guide with cleansing and intention-setting instructions' },
      { title: 'Purification Card', desc: 'Step-by-step purification ritual for your new crystal companion' }
    ],
    perspectives: [
      { title: 'Scientific Perspective', content: 'Amethyst is a variety of quartz (SiO\u2082) containing iron impurities that create its signature purple hue through natural irradiation. Clear Quartz exhibits piezoelectric properties used in watches and electronics, while Rose Quartz gets its color from trace amounts of titanium and manganese.' },
      { title: 'Spiritual Perspective', content: 'In crystal healing traditions spanning thousands of years, Amethyst resonates with the crown chakra, facilitating spiritual growth and divine connection. Rose Quartz opens the heart chakra to unconditional love, and Clear Quartz acts as a spiritual antenna, amplifying prayers and meditations.' },
      { title: 'Psychological Perspective', content: 'The practice of wearing intention-based jewelry engages mindful awareness and serves as a tactile anchor for positive affirmations. Research in cognitive behavioral therapy shows that physical reminders can reinforce new thought patterns and support daily reflection rituals.' }
    ],
    imageCount: 6,
    sizes: ['S (6mm)', 'M (8mm)', 'L (10mm)'],
    rating: 4.8,
    reviewCount: 1247
  };

  await E.createPage(
    'Amethyst Dream Bracelet',
    'amethyst-dream-bracelet',
    generateProductDetail(config),
    'draft'
  );
}

main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
