/**
 * About Us 页面 — /about
 *
 * 8个Section：
 *  1. Hero: "Our Story" + "Ancient wisdom meets modern intention"
 *  2. 品牌故事: "Why We Exist" — 品牌使命，不是创始人的个人故事
 *  3. 工艺理念: "The Art of Intention-Setting" — 为什么是手链 + 意念设定流程
 *  4. 品牌理念: "What We Believe" (4个信念点)
 *  5. 道德采购: "From Earth to You" (来源记录→供应商提问→环保意识→持续改进)
 *  6. 品质承诺: 天然水晶/用心准备/丝绒袋+指南卡/30天退换
 *  7. 用户故事: "The Earthward Community" 3-4条故事
 *  8. CTA: "Ready to Find Your Crystal?" → crystal-quiz
 *
 * 内容策略：
 *  - 不使用虚构创始人（Plan B：品牌哲学路线，参考 Conscious Items）
 *  - 内容基于 6 家竞品 About 页面分析校准
 *  - 竞品参考：Conscious Items（品牌哲学）、Tiny Rituals（简洁信任）、
 *    Moonrise Crystals（道德采购）、Satin Crystals（真实故事）、
 *    Crystal Vaults（专业资质）、Beadage（极简风格）
 *
 * 布局规则：
 *  - 纯 Flexbox，padding/margin 值用字符串
 *  - 嵌套容器 isInner: true + content_width: "full"
 *  - 图片用占位 URL + id: 0
 *  - 使用 E.rPadding(), E.rWidth(), E.gap() 等辅助函数
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// About Us 页面生成
// ============================================================
function generateAboutUs() {
  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('140', '10', '140', '10', {
        tablet: { t: '100', r: '10', b: '100', l: '10' },
        mobile: { t: '70', r: '10', b: '70', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.about.hero.url,
        id: 0, size: '', alt: IMAGES.about.hero.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a1a2e',
      background_overlay_opacity: { unit: 'px', size: 0.65, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Our Story', {
          headerSize: 'h1', color: '#FFFFFF', fontSize: 52, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
          }
        }),
        E.textEditor('Return to what\'s real.', {
          color: '#e0d5c7', fontSize: 22, align: 'center',
          lineHeight: 34,
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' },
            _element_width: '600',
            _element_width_tablet: '100'
          }
        })
      ])
    ]),

    // ===================== Section 2: 品牌故事（图文左右，精简）=====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(20)
    }, [
      E.wrap({ content_width: 'boxed', flex_direction: 'row', flex_align_items: 'center', flex_gap: E.gap(40) }, [
        // 左图
        E.wrap({ content_width: 'full', width: { unit: '%', size: 45, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] } }, [
          E.imageWidget(IMAGES.shared.studioWorkbench.url, { id: 0, alt: IMAGES.shared.studioWorkbench.alt, radius: 12, width: 100 })
        ]),
        // 右文（精简 2 段）
        E.wrap({ content_width: 'full', width: { unit: '%', size: 50, sizes: [] }, width_tablet: { unit: '%', size: 100, sizes: [] }, width_mobile: { unit: '%', size: 100, sizes: [] }, flex_direction: 'column', flex_gap: E.gap(12) }, [
          E.heading('Why Earthward', {
            headerSize: 'h2', fontSize: 36, color: '#2d2d2d', align: 'left',
            extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' } }
          }),
          E.textEditor(
            'We chose the name Earthward for a reason. In a world of synthetic shortcuts and mass production, real value comes from ' +
            'what is natural, traceable, and true. Earthward is not just a brand name — it is a direction, a choice to return to what matters.' +
            '</p><p>' +
            'But somewhere along the way, the crystal industry lost its direction. Mass-produced synthetics flooded online stores, and ' +
            'listings promised "real crystals" that turned out to be dyed glass. The people who genuinely needed crystals for emotional ' +
            'support were left guessing which stones were real.' +
            '</p><p>' +
            'Every crystal we offer is selected as a genuine natural stone, individually inspected, prepared with care, and paired with ' +
            'a guide card that explains its traditional meaning. Not just beautiful jewelry — a meaningful tool for intentional living. ' +
            'From earth, to you, with nothing hidden.',
            { fontSize: 17, color: '#555555', align: 'left', lineHeight: 28 }
          )
        ])
      ])
    ]),

    // ===================== Section 3: 意念设定艺术 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#faf8f5'
    }, [
      E.heading('The Art of Intention-Setting', {
        fontSize: 36, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
        }
      }),
      // 两列布局：左文字 右图片（与 S2 图左文右 交替；mobile reverse 保证图上文下）
      E.wrap({
        flex_direction: 'row',
        flex_direction_mobile: 'column-reverse',
        flex_align_items: 'center',
        flex_gap: E.gap(40),
        content_width: 'boxed'
      }, [
        // 左侧内容（desktop 左；mobile 因 column-reverse 排在图下方）
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 60, sizes: [] },
          width_tablet: { unit: '%', size: 55, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_gap: E.gap(15)
        }, [
          E.heading('Why bracelets?', {
            headerSize: 'h3', fontSize: 20, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Of all the ways to work with crystals, we chose bracelets for one reason: they stay with you. A crystal on a shelf ' +
            'collects dust. A crystal on your wrist collects moments — every time you glance at it, touch it, or feel its weight, ' +
            'it reminds you of the intention you set. That daily touchpoint is where the practice becomes personal.',
            { fontSize: 16, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          ),
          E.heading('Our intention-setting process', {
            headerSize: 'h3', fontSize: 20, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every bracelet that leaves our studio goes through a four-step preparation ritual: first, we inspect each bead under ' +
            'natural light to verify its authenticity. Then we use a simple smoke-cleansing or selenite-based ritual, depending on ' +
            'the stone and setting. Next, we let it rest under moonlight as a quiet symbolic reset. Finally, we set a positive ' +
            'intention before placing it in its velvet pouch.',
            { fontSize: 16, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          ),
          E.heading('More than jewelry', {
            headerSize: 'h3', fontSize: 20, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Each order includes a detailed intention guide card — not a generic leaflet, but a card specific to your crystal type. ' +
            'It covers the stone\'s origin, its traditional meaning, recommended affirmations, cleansing instructions, ' +
            'and which chakra it aligns with. We want you to understand your crystal, not just wear it.',
            { fontSize: 16, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          )
        ]),
        // 右侧图片（desktop 右；mobile 上）
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 35, sizes: [] },
          width_tablet: { unit: '%', size: 40, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] }
        }, [
          E.imageWidget(IMAGES.about.founder.url, {
            id: 0, alt: IMAGES.about.founder.alt, radius: 8, width: 100
          })
        ])
      ])
    ]),

    // ===================== Section 4: 品牌理念 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(20)
    }, [
      E.heading('What We Believe', {
        fontSize: 36, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('The four pillars that guide everything we do', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
        }
      }),
      // 4列→平板2列→手机1列
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(20)
      }, [
        // 信念1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#f5f0eb',
          border_border: 'solid',
          border_width: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: true },
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25')
        }, [
          E.heading('1', {
            fontSize: 42, color: '#c9a96e', align: 'center', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Nature Keeps Us Grounded', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every crystal in our collection was formed by the Earth over millions of years. ' +
            'We believe these natural treasures can become meaningful reminders for emotional balance, ' +
            'reflection, and spiritual practice when approached with intention and respect.',
            { fontSize: 16, color: '#666666', align: 'center', lineHeight: 24 }
          )
        ]),
        // 信念2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#f5f0eb',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25')
        }, [
          E.heading('2', {
            fontSize: 42, color: '#c9a96e', align: 'center', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Intention Gives Practice a Shape', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'A crystal becomes more meaningful when paired with clear intention. That\'s why we include ' +
            'guide cards and affirmation suggestions with every piece — to help you set your purpose ' +
            'and create a meaningful practice around your crystal companion.',
            { fontSize: 16, color: '#666666', align: 'center', lineHeight: 24 }
          )
        ]),
        // 信念3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#f5f0eb',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25')
        }, [
          E.heading('3', {
            fontSize: 42, color: '#c9a96e', align: 'center', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Ethics Come Before Profit', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We are committed to asking better sourcing questions as the collection grows. ' +
            'We prioritize suppliers who can speak clearly about origin, handling, and labor context, ' +
            'and we keep improving our standards rather than pretending the industry is perfectly transparent.',
            { fontSize: 16, color: '#666666', align: 'center', lineHeight: 24 }
          )
        ]),
        // 信念4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#f5f0eb',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25')
        }, [
          E.heading('4', {
            fontSize: 42, color: '#c9a96e', align: 'center', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Community Grows Through Ritual', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Personal growth is easier when it has language, ritual, and community around it. We\'re building ' +
            'a space for people who share crystal stories, support each other\'s intentions, and celebrate the ' +
            'small meaningful practices of everyday life.',
            { fontSize: 16, color: '#666666', align: 'center', lineHeight: 24 }
          )
        ])
      ])
    ]),

    // ===================== Section 5: 道德采购 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#1a1a2e'
    }, [
      E.heading('From Earth to You', {
        fontSize: 40, color: '#e0d5c7', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Our commitment to ethical sourcing at every step', {
        fontSize: 17, color: '#a0a0b0', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '40', left: '0', isLinked: '' }
        }
      }),
      // 4列流程
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(20)
      }, [
        // 步骤1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#23233b',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#333454'
        }, [
          E.heading('Traceable Origins', {
            headerSize: 'h3', fontSize: 20, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We record origin details when available, and seek partners with clear handling notes and responsible practices.',
            { fontSize: 16, color: '#b0b0c0', align: 'center', lineHeight: 24 }
          )
        ]),
        // 步骤2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#23233b',
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#333454',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('25', '20', '25', '20')
        }, [
          E.heading('Supplier Questions Matter', {
            headerSize: 'h3', fontSize: 20, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We choose long-term supplier relationships over anonymous bulk buying, working with partners ' +
            'who treat people with dignity and communicate clearly.',
            { fontSize: 16, color: '#b0b0c0', align: 'center', lineHeight: 24 }
          )
        ]),
        // 步骤3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#23233b',
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#333454',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('25', '20', '25', '20')
        }, [
          E.heading('Environmental Responsibility', {
            headerSize: 'h3', fontSize: 20, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We keep packaging intentional and low-waste, choosing protective materials that feel beautiful ' +
            'without becoming excessive — small choices that add up.',
            { fontSize: 16, color: '#b0b0c0', align: 'center', lineHeight: 24 }
          )
        ]),
        // 步骤4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 23, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#23233b',
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_color: '#333454',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('25', '20', '25', '20')
        }, [
          E.heading('Responsible Sourcing', {
            headerSize: 'h3', fontSize: 20, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We avoid suppliers who cannot answer basic questions about origin, handling, or labor context. ' +
            'When a source feels unclear, we pass.',
            { fontSize: 16, color: '#b0b0c0', align: 'center', lineHeight: 24 }
          )
        ])
      ]),
      E.spacer('20'),
      E.buttonWidget('Shop Natural Crystal Bracelets', '/shop')
    ]),

    // ===================== Section 6: 品质承诺 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(20)
    }, [
      E.heading('Our Quality Promise', {
        fontSize: 36, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Every crystal bracelet that leaves our studio has passed these four checkpoints', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '40', left: '0', isLinked: '' }
        }
      }),
      // 2x2网格
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(25)
      }, [
        // 承诺1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_direction: 'row',
          flex_align_items: 'center',
          flex_gap: E.gap(20),
          padding: E.rPadding('25', '30', '25', '30'),
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true }
        }, [
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 32, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.imageWidget(IMAGES.about.natural.url, {
              id: 0, alt: IMAGES.about.natural.alt, radius: 8, width: 100
            })
          ]),
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 63, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.heading('Genuine Natural Crystals', {
              headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'No dyes, no synthetics, no imitations. Every stone is hand-selected and verified ' +
              'as genuine under natural light, so what you receive is nature\'s own creation.',
              { fontSize: 16, color: '#666666', align: 'left', lineHeight: 22 }
            )
          ])
        ]),
        // 承诺2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_direction: 'row',
          flex_align_items: 'center',
          flex_gap: E.gap(20),
          padding: E.rPadding('25', '30', '25', '30'),
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true }
        }, [
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 32, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.imageWidget(IMAGES.about.cleansing.url, {
              id: 0, alt: IMAGES.about.cleansing.alt, radius: 8, width: 100
            })
          ]),
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 63, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.heading('Prepared With Care', {
              headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Each crystal is gently cleansed and prepared before shipping, then paired with simple ' +
              'guidance to help you begin your intention-setting ritual from day one.',
              { fontSize: 16, color: '#666666', align: 'left', lineHeight: 22 }
            )
          ])
        ]),
        // 承诺3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_direction: 'row',
          flex_align_items: 'center',
          flex_gap: E.gap(20),
          padding: E.rPadding('25', '30', '25', '30'),
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true }
        }, [
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 32, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.imageWidget(IMAGES.about.packaging.url, {
              id: 0, alt: IMAGES.about.packaging.alt, radius: 8, width: 100
            })
          ]),
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 63, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.heading('Velvet Pouch + Guide Card Included', {
              headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Every order arrives in a soft velvet pouch with a guide card covering traditional ' +
              'meaning, cleansing tips, and affirmation suggestions for your stone.',
              { fontSize: 16, color: '#666666', align: 'left', lineHeight: 22 }
            )
          ])
        ]),
        // 承诺4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_direction: 'row',
          flex_align_items: 'center',
          flex_gap: E.gap(20),
          padding: E.rPadding('25', '30', '25', '30'),
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true }
        }, [
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 32, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.imageWidget(IMAGES.about.returns.url, {
              id: 0, alt: IMAGES.about.returns.alt, radius: 8, width: 100
            })
          ]),
          E.wrap({
            content_width: 'full',
            width: { unit: '%', size: 63, sizes: [] },
            width_mobile: { unit: '%', size: 100, sizes: [] }
          }, [
            E.heading('30-Day Worry-Free Returns', {
              headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Not the right fit? Send it back within 30 days for a full refund — choosing a ' +
              'crystal should feel grounded, never pressured.',
              { fontSize: 16, color: '#666666', align: 'left', lineHeight: 22 }
            )
          ])
        ])
      ])
    ]),

    // ===================== Section 7: 用户故事 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#faf8f5'
    }, [
      E.heading('How People Use Their Crystals', {
        fontSize: 36, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Real moments where a crystal bracelet became part of everyday intention', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '40', left: '0', isLinked: '' }
        }
      }),
      // 2x2网格：4个使用场景
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(25)
      }, [
        // 场景1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#FFFFFF',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25'),
          flex_gap: E.gap(10)
        }, [
          E.imageWidget(IMAGES.about.communityRose.url, {
            id: 0, alt: IMAGES.about.communityRose.alt, radius: 50, radiusUnit: 'em', width: 60
          }),
          E.heading('For Navigating Transitions', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Rose Quartz', {
            fontSize: 16, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            'Rose Quartz is a popular choice for people going through life changes — a new city, a new ' +
            'chapter, or simply learning to be kinder to themselves. Wearing it can serve as a gentle ' +
            'daily prompt to practice self-compassion.',
            { fontSize: 16, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 场景2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#FFFFFF',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25'),
          flex_gap: E.gap(10)
        }, [
          E.imageWidget(IMAGES.about.communityProtection.url, {
            id: 0, alt: IMAGES.about.communityProtection.alt, radius: 50, radiusUnit: 'em', width: 60
          }),
          E.heading('For Stressful Workdays', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Black Tourmaline', {
            fontSize: 16, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            'Many Black Tourmaline wearers describe noticing the bracelet during a tense meeting — a small, ' +
            'physical reminder to pause, breathe, and come back to the present moment instead of spiraling.',
            { fontSize: 16, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 场景3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#FFFFFF',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25'),
          flex_gap: E.gap(10)
        }, [
          E.imageWidget(IMAGES.about.communityAmethyst.url, {
            id: 0, alt: IMAGES.about.communityAmethyst.alt, radius: 50, radiusUnit: 'em', width: 60
          }),
          E.heading('For Calm Evenings', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Amethyst', {
            fontSize: 16, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            'A common Amethyst ritual is to keep the bracelet on the nightstand as a wind-down cue — touching ' +
            'it before bed as a reminder to let the day settle. A small ritual, but a meaningful one.',
            { fontSize: 16, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 场景4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 45, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#FFFFFF',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('30', '25', '30', '25'),
          flex_gap: E.gap(10)
        }, [
          E.imageWidget(IMAGES.about.communityCitrine.url, {
            id: 0, alt: IMAGES.about.communityCitrine.alt, radius: 50, radiusUnit: 'em', width: 60
          }),
          E.heading('For Creative Courage', {
            headerSize: 'h3', fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Citrine', {
            fontSize: 16, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            'Citrine wearers often set intentions around new ventures — starting a project, launching ' +
            'an idea, or simply finding the confidence to try. The bracelet becomes a wearable reminder ' +
            'that you chose to begin.',
            { fontSize: 16, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ])
      ])
    ]),

    // ===================== Section 8: CTA =====================
    E.section({
      padding: E.rPadding('100', '10', '100', '10', {
        tablet: { t: '70', r: '10', b: '70', l: '10' },
        mobile: { t: '50', r: '10', b: '50', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.about.cta.url,
        id: 0, size: '', alt: IMAGES.about.cta.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a1a2e',
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Ready to Find Your Crystal?', {
          color: '#FFFFFF', fontSize: 44, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
          }
        }),
        E.textEditor(
          'Take our 2-minute crystal quiz and find a bracelet that fits your current intention.',
          { color: '#d0c5b7', headerSize: 'h3', fontSize: 20, align: 'center', lineHeight: 30,
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '35', left: '0', isLinked: '' }
            }
          }
        ),
        E.buttonWidget('Shop Crystal Bracelets', '/shop')
      ])
    ])
  ];
}

// ============================================================
// 主函数
// 用法：
//   node about.js            → 创建独立 preview draft（审核用，不动现有 page）
//   node about.js replace    → 把第2版注入现有 page id=4400 并 publish（审核通过后替代老页）
// ============================================================
const ABOUT_PAGE_ID = 42426; // 线上当前 about-us page（老4400已trash）

async function main() {
  const data = generateAboutUs();
  const mode = process.argv[2];

  if (mode === 'replace') {
    await E.checkConnection();
    const jsonStr = JSON.stringify(data);
    console.log('Replacing about-us page id=' + ABOUT_PAGE_ID + ' (' + data.length + ' sections, ' + jsonStr.length + ' chars)');
    const result = await E.apiRequest('/wp-json/wp/v2/pages/' + ABOUT_PAGE_ID + '?context=edit', 'POST', {
      title: 'About Us', status: 'publish', content: '',
      meta: {
        _elementor_data: jsonStr,
        _elementor_edit_mode: 'builder',
        _elementor_template_type: 'wp-page'
      }
    });
    if (result && result.id) {
      console.log('REPLACED & PUBLISHED: https://goearthward.com/about-us/');
    } else {
      console.error('FAILED: ' + JSON.stringify(result).slice(0, 500));
      process.exit(1);
    }
    return;
  }

  // 默认：preview draft（复用 about-v3，不碰已上线的 4400 和用户改后的 42426）
  var existPreview = await E.apiRequest('/wp-json/wp/v2/pages?slug=about-v3&status=draft&_fields=id', 'GET');
  if (existPreview && Array.isArray(existPreview) && existPreview.length > 0) {
    var pid = existPreview[0].id;
    var pjson = JSON.stringify(data);
    await E.apiRequest('/wp-json/wp/v2/pages/' + pid + '?context=edit', 'POST', {
      title: 'About Us (v3 preview)', status: 'draft', content: '',
      meta: { _elementor_data: pjson, _elementor_edit_mode: 'builder', _elementor_template_type: 'wp-page' }
    });
    console.log('Updated about-v3 preview: ' + pid + ' -> https://goearthward.com/?page_id=' + pid + '&preview=true');
  } else {
    await E.createPage('About Us (v3 preview)', 'about-v3', data, 'draft');
  }
}

if (require.main === module) {
  main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
}

module.exports = generateAboutUs;
