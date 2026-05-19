/**
 * About Us 页面 — /about
 *
 * 8个Section：
 *  1. Hero: "Our Story" + "Ancient wisdom meets modern intention"
 *  2. 品牌故事: "Why We Exist" — 品牌使命，不是创始人的个人故事
 *  3. 工艺理念: "The Art of Intention-Setting" — 为什么是手链 + 意念设定流程
 *  4. 品牌理念: "What We Believe" (4个信念点)
 *  5. 道德采购: "From Earth to You" (来源可追溯→公平劳动→环保→无冲突矿物)
 *  6. 品质承诺: 100%天然/净化充能/丝绒袋+指南卡/30天退换
 *  7. 用户故事: "The LuckyCrystals Community" 3-4条故事
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
          color: '#FFFFFF', fontSize: 52, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
          }
        }),
        E.textEditor('Ancient wisdom meets modern intention', {
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

    // ===================== Section 2: 品牌故事 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(15)
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Why We Exist', {
          fontSize: 40, color: '#2d2d2d', align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
          }
        }),
        E.divider(),
        E.spacer('10'),
        E.textEditor(
          'Crystals have been used for healing and protection for thousands of years — ancient Egyptians placed lapis lazuli in ' +
          'tombs, Chinese emperors carved jade into amulets, and Indian Ayurvedic practitioners prescribed gemstones for energetic ' +
          'balance. These traditions span every continent and culture, and they endure for a reason: people have always sought ' +
          'connection to something greater than themselves.',
          { fontSize: 17, color: '#555555', align: 'center', lineHeight: 30, width: '800' }
        ),
        E.spacer('10'),
        E.textEditor(
          'Yet somewhere along the way, the crystal industry lost its way. Mass-produced synthetic stones flooded online marketplaces. ' +
          'Listings promised "real crystals" that turned out to be dyed glass. Ethical sourcing was an afterthought. And the people ' +
          'who genuinely needed crystals for emotional support — for anxiety, for grief, for a fresh start — were left guessing ' +
          'which stones were real and which were not.',
          { fontSize: 17, color: '#555555', align: 'center', lineHeight: 30, width: '800' }
        ),
        E.spacer('10'),
        E.textEditor(
          'LuckyCrystals was created to fix that. We built this brand on a simple promise: genuine natural crystals, ethically ' +
          'sourced from mines in Brazil, Madagascar, India, and Uruguay, each one individually inspected, energetically cleansed, ' +
          'and paired with a guide card that teaches you how to actually use it. Not just pretty jewelry — a real tool for ' +
          'intentional living.',
          { fontSize: 17, color: '#555555', align: 'center', lineHeight: 30, width: '800' }
        ),
        E.spacer('10'),
        E.textEditor(
          'Today, we serve a growing community of people who believe that the right crystal, chosen with intention and worn daily, ' +
          'can serve as a powerful anchor for personal growth. Whether you are navigating a life transition, seeking emotional ' +
          'balance, or simply drawn to the beauty of natural stones, we are here to help you find the crystal that resonates ' +
          'with your energy.',
          { fontSize: 17, color: '#555555', align: 'center', lineHeight: 30, width: '800' }
        )
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
      // 两列布局：左图片 右说明
      E.wrap({
        flex_direction: 'row',
        flex_align_items: 'center',
        flex_gap: E.gap(40),
        content_width: 'boxed'
      }, [
        // 左侧图片
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 35, sizes: [] },
          width_tablet: { unit: '%', size: 40, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] }
        }, [
          E.imageWidget(IMAGES.about.founder.url, {
            id: 0, alt: 'Crystal bracelet crafting and intention-setting workspace', radius: 8, width: 100
          })
        ]),
        // 右侧内容
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 60, sizes: [] },
          width_tablet: { unit: '%', size: 55, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          flex_gap: E.gap(15)
        }, [
          E.heading('Why bracelets?', {
            fontSize: 18, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Of all the ways to work with crystals, we chose bracelets for one reason: they stay with you. A crystal on a shelf ' +
            'collects dust. A crystal on your wrist collects moments — every time you glance at it, touch it, or feel its weight, ' +
            'it reminds you of the intention you set. That daily touchpoint is where the real magic happens.',
            { fontSize: 15, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          ),
          E.heading('Our intention-setting process', {
            fontSize: 18, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every bracelet that leaves our studio goes through a four-step preparation ritual: first, we inspect each bead under ' +
            'natural light to verify its authenticity. Then we cleanse it using white sage smoke — a practice rooted in Native American ' +
            'tradition and used by crystal practitioners worldwide. Next, we charge it under moonlight to reset its energetic frequency. ' +
            'Finally, we set a positive intention before placing it in its velvet pouch.',
            { fontSize: 15, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          ),
          E.heading('More than jewelry', {
            fontSize: 18, color: '#7b5ea7', align: 'left',
            fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Each order includes a detailed energy guide card — not a generic leaflet, but a card specific to your crystal type. ' +
            'It covers the stone\'s origin, its traditional healing properties, recommended affirmations, cleansing instructions, ' +
            'and which chakra it aligns with. We want you to understand your crystal, not just wear it.',
            { fontSize: 15, color: '#555555', align: 'left', lineHeight: 26, width: '100' }
          )
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
        fontSize: 40, color: '#2d2d2d', align: 'center',
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
          E.heading('Nature Is the Greatest Healer', {
            fontSize: 18, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every crystal in our collection was formed by the Earth over millions of years. ' +
            'We believe these natural treasures carry a unique vibrational energy that can support ' +
            'your emotional and spiritual wellbeing when approached with intention and respect.',
            { fontSize: 14, color: '#666666', align: 'center', lineHeight: 24 }
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
          E.heading('Intention Amplifies Energy', {
            fontSize: 18, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'A crystal is most powerful when paired with clear intention. That\'s why we include ' +
            'guide cards and affirmation suggestions with every piece — to help you set your purpose ' +
            'and create a meaningful practice around your crystal companion.',
            { fontSize: 14, color: '#666666', align: 'center', lineHeight: 24 }
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
            fontSize: 18, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We are committed to responsible sourcing, fair labor practices, and environmental stewardship. ' +
            'We work with suppliers who can speak clearly about origin, handling, and labor practices, ' +
            'and we keep improving our standards as our collection grows.',
            { fontSize: 14, color: '#666666', align: 'center', lineHeight: 24 }
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
          E.heading('Community Heals Together', {
            fontSize: 18, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '5', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Healing is not a solitary journey. We\'re building a community of like-minded souls who share ' +
            'their crystal stories, support each other\'s growth, and celebrate the small magic of everyday ' +
            'life. Together, we create a ripple of positive energy that extends far beyond ourselves.',
            { fontSize: 14, color: '#666666', align: 'center', lineHeight: 24 }
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
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every crystal can be traced back to its mine of origin — whether that\'s amethyst from ' +
            'Brazil, rose quartz from Madagascar, or black tourmaline from Sri Lanka. We prioritize ' +
            'suppliers who can share clear origin details, handling notes, and responsible sourcing context.',
            { fontSize: 14, color: '#b0b0c0', align: 'center', lineHeight: 24 }
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
          E.heading('Fair Labor Practices', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We choose long-term supplier relationships over anonymous bulk buying. Our goal is to work ' +
            'with partners who treat people with dignity, communicate clearly, and share our respect for ' +
            'responsible crystal handling.',
            { fontSize: 14, color: '#b0b0c0', align: 'center', lineHeight: 24 }
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
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We keep packaging intentional and low-waste wherever possible, choosing protective materials ' +
            'that feel beautiful without becoming excessive. Small operational choices matter when they are ' +
            'repeated with care.',
            { fontSize: 14, color: '#b0b0c0', align: 'center', lineHeight: 24 }
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
          E.heading('Conflict-Free Guarantee', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We avoid suppliers who cannot answer basic questions about origin, handling, or labor context. ' +
            'When a source feels unclear, we would rather pass on a stone than build a collection on uncertainty.',
            { fontSize: 14, color: '#b0b0c0', align: 'center', lineHeight: 24 }
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
        fontSize: 40, color: '#2d2d2d', align: 'center',
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
            E.heading('100% Natural Crystals', {
              fontSize: 18, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'No dyes, no synthetics, no imitations. Every stone is hand-selected and verified ' +
              'as genuine under natural light inspection. We reject any bead with visible dye lines, ' +
              'artificial coloring, or synthetic composition. What you receive is nature\'s own creation.',
              { fontSize: 14, color: '#666666', align: 'left', lineHeight: 22 }
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
            E.heading('Energetically Cleansed & Charged', {
              fontSize: 18, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Each crystal is purified with sage and charged under moonlight before shipping, ' +
              'so it arrives ready to support your intentions from the very first moment.',
              { fontSize: 14, color: '#666666', align: 'left', lineHeight: 22 }
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
              fontSize: 18, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Every order comes beautifully presented in a velvet pouch, accompanied by a detailed ' +
              'energy guide card with cleansing tips, affirmations, and usage suggestions.',
              { fontSize: 14, color: '#666666', align: 'left', lineHeight: 22 }
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
              fontSize: 18, color: '#2d2d2d', align: 'left', fontWeight: '600',
              extra: {
                _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
                _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
              }
            }),
            E.textEditor(
              'Not the right energy match? No worries. We offer a hassle-free 30-day return policy ' +
              'because we believe the right crystal will find you, and if it hasn\'t yet, we\'ll help.',
              { fontSize: 14, color: '#666666', align: 'left', lineHeight: 22 }
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
      E.heading('The LuckyCrystals Community', {
        fontSize: 40, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Stories from our community — the moments that make what we do worthwhile', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '40', left: '0', isLinked: '' }
        }
      }),
      // 2x2网格：4条故事避免出现3+1失衡
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(25)
      }, [
        // 故事1
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
            id: 0, alt: IMAGES.about.communityRose.alt, radius: 50, width: 60
          }),
          E.heading('Amanda K.', {
            fontSize: 16, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Verified Buyer — Rose Quartz Bracelet', {
            fontSize: 12, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            '"I was going through a difficult breakup when I ordered the Rose Quartz bracelet. ' +
            'Wearing it became a small daily reminder to be gentle with myself. I keep it on my nightstand ' +
            'when I journal, and it has become part of how I return to myself."',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 故事2
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
            id: 0, alt: IMAGES.about.communityProtection.alt, radius: 50, width: 60
          }),
          E.heading('David R.', {
            fontSize: 16, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Verified Buyer — Black Tourmaline Bracelet', {
            fontSize: 12, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            '"As someone who works in a high-stress corporate job, I was skeptical about crystals. ' +
            'My Black Tourmaline bracelet has become a grounding cue during busy workdays. When I notice ' +
            'it on my wrist, I pause, breathe, and come back to the present moment."',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 故事3
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
            id: 0, alt: IMAGES.about.communityAmethyst.alt, radius: 50, width: 60
          }),
          E.heading('Sophie L.', {
            fontSize: 16, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Verified Buyer — Amethyst Bracelet', {
            fontSize: 12, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            '"I bought the Amethyst bracelet for my daughter who was struggling with anxiety before ' +
            'exams. She wears it while studying and says it reminds her to slow down, breathe, and trust ' +
            'herself. The guide card made it feel thoughtful and easy to use."',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 23 }
          )
        ]),
        // 故事4
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
            id: 0, alt: IMAGES.about.communityCitrine.alt, radius: 50, width: 60
          }),
          E.heading('Mia T.', {
            fontSize: 16, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Verified Buyer — Citrine Bracelet', {
            fontSize: 12, color: '#c9a96e', align: 'center'
          }),
          E.textEditor(
            '"I set an intention with my Citrine bracelet when I started my small business. ' +
            'Now I wear it when I plan, package orders, or need a little courage. The velvet pouch and ' +
            'guide card made the whole experience feel personal, not mass-produced."',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 23 }
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
          'Take our 2-minute energy quiz and discover the crystal that aligns with your soul\'s needs.',
          { color: '#d0c5b7', fontSize: 18, align: 'center', lineHeight: 30,
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
// ============================================================
async function main() {
  await E.createPage('About Us', 'about', generateAboutUs(), 'draft');
}

if (require.main === module) {
  main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
}

module.exports = generateAboutUs;
