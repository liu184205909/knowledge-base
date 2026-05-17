/**
 * Crystals by Condition 功效分类页模板 — /crystal-guide/crystals-for-[condition]
 *
 * 5个Section：
 *  1. Hero: "Best Crystals for [Condition]" + 描述
 *  2. 推荐水晶 — 3-5种推荐水晶卡片（图+名+为什么有效+链接）
 *  3. 对应产品 — 推荐水晶的产品列表
 *  4. 使用指南 — 如何使用水晶帮助 [condition]
 *  5. 相关功效 — "Also helpful for..."
 *
 * 用法：
 *   const config = { condition: 'Anxiety', crystals: [...], ... };
 *   generateConditionPage(config);
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// 占位图 URL
const IMG = IMAGES.products.bracelet.url;
const IMG_HERO = IMAGES.shared.heroBracelet.url;

/**
 * 生成 Crystals by Condition 页面 Elementor 数据
 *
 * @param {object} config
 * @param {string} config.condition       - 功效名称 (e.g. "Anxiety", "Sleep", "Love")
 * @param {string} config.heroDesc        - Hero 区描述段
 * @param {Array}  config.crystals        - [{name, slug, image, whyEffective, linkText}] 3-5种推荐水晶
 * @param {string} config.usageTitle      - 使用指南标题
 * @param {Array}  config.usageSteps      - [{title, desc}] 使用步骤
 * @param {string} config.usageClosing    - 使用指南结尾段
 * @param {Array}  config.relatedConditions - [{name, slug}] 相关功效
 */
function generateConditionPage(config) {
  const c = Object.assign({
    condition: 'Anxiety',
    heroDesc: 'When the weight of worry feels too heavy to carry alone, the right crystals can serve as gentle allies — grounding your energy, calming racing thoughts, and reminding you to breathe. Here are the most powerful crystals for finding your center again.',
    crystals: [
      {
        name: 'Amethyst',
        slug: 'amethyst',
        whyEffective: 'Known as the "all-purpose healer," Amethyst emits a soothing violet frequency that calms an overactive nervous system. It quiets the mental chatter that fuels anxiety and replaces it with a gentle, pervasive sense of peace. Place it on your nightstand or wear it as a bracelet for all-day support.',
        linkText: 'Explore Amethyst \u2192'
      },
      {
        name: 'Lepidolite',
        slug: 'lepidolite',
        whyEffective: 'Lepidolite is nature\'s tranquility stone, rich in lithium — the same element used in anxiety medication. Its soft lavender energy dissolves panic and worry at their source, promoting emotional balance and a deep sense that everything will be okay. Keep it close during stressful moments.',
        linkText: 'Explore Lepidolite \u2192'
      },
      {
        name: 'Black Tourmaline',
        slug: 'black-tourmaline',
        whyEffective: 'Anxiety often stems from feeling unprotected or overwhelmed by external energies. Black Tourmaline creates an impenetrable energetic shield, grounding your energy to the earth and deflecting negativity. It is the ultimate "I am safe" stone for moments of overwhelm.',
        linkText: 'Explore Black Tourmaline \u2192'
      },
      {
        name: 'Rose Quartz',
        slug: 'rose-quartz',
        whyEffective: 'At its core, anxiety often carries a fear of not being enough. Rose Quartz wraps you in unconditional love and self-compassion, softening the harsh inner critic. Its gentle pink frequency reminds you that you deserve kindness — especially from yourself.',
        linkText: 'Explore Rose Quartz \u2192'
      },
      {
        name: 'Blue Lace Agate',
        slug: 'blue-lace-agate',
        whyEffective: 'Blue Lace Agate carries a light, airy energy that feels like a cool breeze on a hot day. It is particularly effective for anxiety related to communication — helping you express yourself clearly and calmly without the fear of judgment. Wear it before difficult conversations.',
        linkText: 'Explore Blue Lace Agate \u2192'
      }
    ],
    usageTitle: 'How to Use Crystals for Anxiety Relief',
    usageSteps: [
      { title: 'Choose Your Crystal', desc: 'Trust your intuition. Hold each crystal and notice which one draws you in. The crystal that feels warm, tingly, or simply "right" is the one your energy is calling for.' },
      { title: 'Create a Daily Practice', desc: 'Set aside 5 minutes each morning to hold your crystal and set a calming intention: "I release what I cannot control. I am safe in this moment." Repeat this like a mantra.' },
      { title: 'Wear It as an Anchor', desc: 'Wear your crystal as a bracelet or pendant. When anxiety spikes, touch the stone and take three slow, deep breaths. Let the physical sensation ground you back to the present.' },
      { title: 'Build a Calming Space', desc: 'Create a small crystal grid on your nightstand or desk. Combine Amethyst for calm, Black Tourmaline for protection, and Rose Quartz for self-love. Let this be your sanctuary of peace.' }
    ],
    usageClosing: 'Remember: crystals are gentle companions on your wellness journey, not a substitute for professional help. If anxiety is significantly impacting your daily life, we encourage you to speak with a mental health professional. You deserve support.',
    relatedConditions: [
      { name: 'Stress Relief', slug: 'stress-relief' },
      { name: 'Sleep & Insomnia', slug: 'sleep' },
      { name: 'Depression', slug: 'depression' },
      { name: 'Emotional Healing', slug: 'emotional-healing' },
      { name: 'Self-Love', slug: 'self-love' },
      { name: 'Meditation', slug: 'meditation' }
    ]
  }, config);

  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '20', b: '40', l: '20' }, mobile: { t: '40', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Best Crystals for ' + c.condition, {
        fontSize: 42, align: 'center', fontWeight: '700',
        padding: E.rPadding('0', '0', '15', '0')
      }),
      E.textEditor(c.heroDesc, {
        fontSize: 17, align: 'center', color: '#555', lineHeight: 28
      }),
      E.spacer('25'),
      E.imageWidget(IMG_HERO, { alt: 'Crystals for ' + c.condition, width: 80, radius: 12 })
    ]),

    // ===================== Section 2: 推荐水晶卡片 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading('Our Top Crystal Recommendations', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('These crystals have been carefully selected for their proven ability to support ' + c.condition.toLowerCase() + ' relief.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      ...c.crystals.map(crystal =>
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(30),
          content_width: 'full',
          padding: E.rPadding('0', '0', '30', '0')
        }, [
          // 左侧图片
          E.wrap(Object.assign({
            flex_direction: 'column',
            flex_align_items: 'center'
          }, E.rWidth('25', '30', '100')), [
            E.imageWidget(IMG, { alt: crystal.name, width: 80, radius: 10 })
          ]),
          // 右侧内容
          E.wrap(Object.assign({
            flex_direction: 'column',
            flex_gap: E.gap(8)
          }, E.rWidth('75', '70', '100')), [
            E.heading(crystal.name, { fontSize: 22, align: 'left', fontWeight: '600' }),
            E.textEditor(crystal.whyEffective, { fontSize: 15, align: 'left', color: '#555', lineHeight: 26 }),
            E.buttonWidget(crystal.linkText, '/crystal-guide/' + crystal.slug + '-meaning')
          ])
        ])
      )
    ]),

    // ===================== Section 3: 对应产品 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Shop ' + c.condition + ' Relief Bracelets', { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('Handcrafted with the crystals recommended above. Each bracelet comes cleansed, charged, and ready to support your healing journey.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      // WoodMart 产品组件 — 通过 WooCommerce 分类/标签自动筛选
      E.wdProductsWidget(6)
    ]),

    // ===================== Section 4: 使用指南 =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } })
    }, [
      E.heading(c.usageTitle, { fontSize: 32, align: 'center' }),
      E.spacer('10'),
      E.textEditor('A simple daily practice to get the most from your healing crystals.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(24),
        content_width: 'full'
      }, c.usageSteps.map((step, i) =>
        E.wrap(Object.assign({
          flex_direction: 'column',
          flex_gap: E.gap(10),
          padding: E.rPadding('25', '25', '25', '25'),
          background_background: 'classic',
          background_color: '#faf7f2',
          border_radius: { unit: 'px', size: 10, sizes: [] },
          flex_align_items: 'center'
        }, E.rWidth('25', '50', '100')), [
          // 步骤编号
          E.wrap({
            padding: E.rPadding('8', '18', '8', '18'),
            background_background: 'classic',
            background_color: '#d4c5b0',
            border_radius: { unit: 'px', size: 50, sizes: [] }
          }, [
            E.heading(String(i + 1), { fontSize: 20, align: 'center', fontWeight: '700', color: '#ffffff' })
          ]),
          E.heading(step.title, { fontSize: 18, align: 'center', fontWeight: '600' }),
          E.textEditor(step.desc, { fontSize: 14, align: 'center', color: '#666', lineHeight: 22 })
        ])
      )),
      E.spacer('20'),
      E.textEditor('<em>' + c.usageClosing + '</em>', {
        fontSize: 14, align: 'center', color: '#999', lineHeight: 22
      })
    ]),

    // ===================== Section 5: 相关功效 "Also helpful for..." =====================
    E.section({
      padding: E.rPadding('60', '40', '60', '40', { mobile: { t: '30', r: '15', b: '30', l: '15' } }),
      background_background: 'classic',
      background_color: '#faf7f2'
    }, [
      E.heading('Also Helpful For...', { fontSize: 28, align: 'center' }),
      E.spacer('10'),
      E.textEditor('These related conditions may benefit from similar crystals. Explore more healing pathways.', {
        fontSize: 16, align: 'center', color: '#888'
      }),
      E.spacer('30'),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(16),
        content_width: 'full',
        flex_wrap: 'wrap',
        flex_justify_content: 'center'
      }, c.relatedConditions.map(rc => {
        var w = Math.floor(100 / Math.min(c.relatedConditions.length, 3));
        if (w > 33) w = 33;
        return E.wrap({
          padding: E.rPadding('15', '20', '15', '20'),
          background_background: 'classic',
          background_color: '#ffffff',
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#e8e0d4',
          border_radius: { unit: 'px', size: 8, sizes: [] },
          flex_align_items: 'center'
        }, [
          E.buttonWidget(rc.name, '/crystal-guide/crystals-for-' + rc.slug)
        ]);
      }))
    ])
  ];
}

// ============================================================
// 演示入口
// ============================================================
async function main() {
  const config = {
    condition: 'Anxiety',
    heroDesc: 'When the weight of worry feels too heavy to carry alone, the right crystals can serve as gentle allies — grounding your energy, calming racing thoughts, and reminding you to breathe. Here are the most powerful crystals for finding your center again.',
    crystals: [
      {
        name: 'Amethyst',
        slug: 'amethyst',
        whyEffective: 'Known as the "all-purpose healer," Amethyst emits a soothing violet frequency that calms an overactive nervous system. It quiets the mental chatter that fuels anxiety and replaces it with a gentle, pervasive sense of peace. Place it on your nightstand or wear it as a bracelet for all-day support.',
        linkText: 'Explore Amethyst \u2192'
      },
      {
        name: 'Lepidolite',
        slug: 'lepidolite',
        whyEffective: 'Lepidolite is nature\'s tranquility stone, rich in lithium — the same element used in anxiety medication. Its soft lavender energy dissolves panic and worry at their source, promoting emotional balance and a deep sense that everything will be okay.',
        linkText: 'Explore Lepidolite \u2192'
      },
      {
        name: 'Black Tourmaline',
        slug: 'black-tourmaline',
        whyEffective: 'Anxiety often stems from feeling unprotected or overwhelmed by external energies. Black Tourmaline creates an impenetrable energetic shield, grounding your energy to the earth and deflecting negativity. It is the ultimate "I am safe" stone for moments of overwhelm.',
        linkText: 'Explore Black Tourmaline \u2192'
      },
      {
        name: 'Rose Quartz',
        slug: 'rose-quartz',
        whyEffective: 'At its core, anxiety often carries a fear of not being enough. Rose Quartz wraps you in unconditional love and self-compassion, softening the harsh inner critic. Its gentle pink frequency reminds you that you deserve kindness — especially from yourself.',
        linkText: 'Explore Rose Quartz \u2192'
      },
      {
        name: 'Blue Lace Agate',
        slug: 'blue-lace-agate',
        whyEffective: 'Blue Lace Agate carries a light, airy energy that feels like a cool breeze on a hot day. It is particularly effective for anxiety related to communication — helping you express yourself clearly and calmly without the fear of judgment.',
        linkText: 'Explore Blue Lace Agate \u2192'
      }
    ],
    usageTitle: 'How to Use Crystals for Anxiety Relief',
    usageSteps: [
      { title: 'Choose Your Crystal', desc: 'Trust your intuition. Hold each crystal and notice which one draws you in. The crystal that feels warm, tingly, or simply "right" is the one your energy is calling for.' },
      { title: 'Create a Daily Practice', desc: 'Set aside 5 minutes each morning to hold your crystal and set a calming intention: "I release what I cannot control. I am safe in this moment."' },
      { title: 'Wear It as an Anchor', desc: 'Wear your crystal as a bracelet. When anxiety spikes, touch the stone and take three slow, deep breaths. Let the physical sensation ground you back to the present.' },
      { title: 'Build a Calming Space', desc: 'Create a small crystal grid on your nightstand or desk. Combine Amethyst for calm, Black Tourmaline for protection, and Rose Quartz for self-love.' }
    ],
    usageClosing: 'Remember: crystals are gentle companions on your wellness journey, not a substitute for professional help. If anxiety is significantly impacting your daily life, we encourage you to speak with a mental health professional. You deserve support.',
    relatedConditions: [
      { name: 'Stress Relief', slug: 'stress-relief' },
      { name: 'Sleep & Insomnia', slug: 'sleep' },
      { name: 'Depression', slug: 'depression' },
      { name: 'Emotional Healing', slug: 'emotional-healing' },
      { name: 'Self-Love', slug: 'self-love' },
      { name: 'Meditation', slug: 'meditation' }
    ]
  };

  await E.createPage(
    'Best Crystals for ' + config.condition,
    'crystals-for-' + config.condition.toLowerCase().replace(/\s+/g, '-'),
    generateConditionPage(config),
    'draft'
  );
}

main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
