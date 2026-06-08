/**
 * Ethical Sourcing 页面 — /about/ethical-sourcing
 *
 * 5个Section：
 *  1. Hero: "Ethically Sourced, From Earth to You"
 *  2. 采购准则: 8-9条道德采购标准
 *  3. 供应链流程: 图解矿山→选品→净化→质检→包装→发货
 *  4. 影响力数据: 种树数/碳排放补偿/社区支持
 *  5. CTA: "Shop Ethically Sourced Crystals"
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
// Ethical Sourcing 页面生成
// ============================================================
function generateEthicalSourcing() {
  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('140', '10', '140', '10', {
        tablet: { t: '100', r: '10', b: '100', l: '10' },
        mobile: { t: '70', r: '10', b: '70', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.sourcing.hero.url,
        id: 0, size: '', alt: IMAGES.sourcing.hero.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a2e1a',
      background_overlay_opacity: { unit: 'px', size: 0.6, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Ethically Sourced', {
          color: '#FFFFFF', fontSize: 52, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
          }
        }),
        E.heading('From Earth to You', {
          color: '#c9a96e', fontSize: 36, align: 'center',
          fontWeight: '400',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
          }
        }),
        E.textEditor(
          'We believe the beauty of a crystal goes beyond its appearance. ' +
          'True beauty includes the journey it took to reach you — one built on respect, fairness, and care for people and planet.',
          { color: '#d0d0c5', fontSize: 18, align: 'center', lineHeight: 30,
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' },
              _element_width: '700'
            }
          }
        )
      ])
    ]),

    // ===================== Section 2: 采购准则 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(20)
    }, [
      E.heading('Our Ethical Sourcing Standards', {
        fontSize: 40, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Every crystal in our collection meets these rigorous standards before it reaches you', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '40', left: '0', isLinked: '' }
        }
      }),
      // 准则列表：3列→平板2列→手机1列
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(20)
      }, [
        // 准则1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('1', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Fully Traceable Origins', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every crystal can be traced back to the specific mine or region where it was sourced. ' +
            'We maintain detailed records of each stone\'s journey, providing full transparency ' +
            'from the earth to your hands.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('2', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Fair Wages & Safe Conditions', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We ensure all miners and workers in our supply chain receive fair compensation and ' +
            'work in safe, dignified conditions. Our partners are regularly audited by independent ' +
            'third parties to verify compliance.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('3', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Zero Conflict Minerals', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We have a strict zero-tolerance policy for conflict minerals. No crystal in our ' +
            'collection finances armed conflict, forced labor, or any form of exploitation. ' +
            'Every supplier signs our binding ethical agreement.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('4', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Environmental Reclamation', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Our mining partners follow responsible extraction practices and are committed to ' +
            'land rehabilitation. After mining, sites are restored with native vegetation and ' +
            'monitored for long-term ecological recovery.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则5
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('5', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('No Child Labor — Ever', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We categorically prohibit child labor at every stage of our supply chain. Our partners ' +
            'must provide documentation proving compliance with international labor standards, ' +
            'and we conduct unannounced inspections.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则6
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('6', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Community Investment', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'A portion of every purchase goes directly to the communities where our crystals are ' +
            'sourced. We fund local schools, clean water projects, and vocational training programs ' +
            'to create lasting positive impact.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则7
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('7', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Eco-Friendly Packaging', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'From recyclable shipping boxes to biodegradable padding, we\'ve eliminated plastic ' +
            'from our packaging. Each bracelet arrives in a reusable velvet pouch — beautiful ' +
            'and sustainable.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则8
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('8', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Small-Batch Artisan Craft', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Our bracelets are handcrafted in small batches by skilled artisans, not mass-produced ' +
            'in factories. This ensures exceptional quality while supporting traditional craftsmanship ' +
            'and providing meaningful employment.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ]),
        // 准则9
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#faf8f5',
          border_radius: { unit: 'px', top: '12', right: '12', bottom: '12', left: '12', isLinked: true },
          padding: E.rPadding('28', '24', '28', '24')
        }, [
          E.heading('9', {
            fontSize: 36, color: '#c9a96e', align: 'left', fontWeight: '300',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Carbon-Offset Shipping', {
            fontSize: 17, color: '#2d2d2d', align: 'left', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We offset 100% of the carbon emissions from shipping your order. Through verified ' +
            'reforestation and renewable energy projects, every delivery contributes to a healthier ' +
            'planet for future generations.',
            { fontSize: 14, color: '#666666', align: 'left', lineHeight: 23 }
          )
        ])
      ])
    ]),

    // ===================== Section 3: 供应链流程 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#1a2e1a'
    }, [
      E.heading('Our Supply Chain Journey', {
        fontSize: 40, color: '#e0d5c7', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Follow the path every crystal takes from the earth to your doorstep', {
        fontSize: 17, color: '#a0b0a0', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '50', left: '0', isLinked: '' }
        }
      }),
      // 6步流程：3列x2行
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(25)
      }, [
        // 步骤1
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.mining.url, {
            id: 0, alt: IMAGES.sourcing.mining.alt, radius: 8, width: 100
          }),
          E.heading('Step 1: Ethical Mining', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Crystals are carefully extracted by our partner mines using low-impact techniques ' +
            'that minimize environmental disruption. Each mine is vetted for ethical practices ' +
            'before we begin any partnership.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ]),
        // 步骤2
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.selection.url, {
            id: 0, alt: IMAGES.sourcing.selection.alt, radius: 8, width: 100
          }),
          E.heading('Step 2: Expert Selection', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Our gemologists hand-select each crystal for quality, color, and energetic integrity. ' +
            'Only stones that meet our strict standards for natural beauty and authenticity ' +
            'make the cut.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ]),
        // 步骤3
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.cleansing.url, {
            id: 0, alt: IMAGES.sourcing.cleansing.alt, radius: 8, width: 100
          }),
          E.heading('Step 3: Energetic Cleansing', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every crystal undergoes a traditional cleansing ritual using sage smoke and ' +
            'moonlight. This clears any residual energy and prepares the stone to receive ' +
            'your fresh intentions.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ]),
        // 步骤4
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.inspection.url, {
            id: 0, alt: IMAGES.sourcing.inspection.alt, radius: 8, width: 100
          }),
          E.heading('Step 4: Quality Inspection', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Each bracelet passes a multi-point quality check — verifying crystal authenticity, ' +
            'bracelet construction, elastic strength, and overall craftsmanship. Only perfect ' +
            'pieces proceed.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ]),
        // 步骤5
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.packaging.url, {
            id: 0, alt: IMAGES.sourcing.packaging.alt, radius: 8, width: 100
          }),
          E.heading('Step 5: Thoughtful Packaging', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Your bracelet is nestled in a premium velvet pouch, accompanied by a detailed ' +
            'energy guide card. All packaging materials are eco-friendly, recyclable, and ' +
            'plastic-free.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ]),
        // 步骤6
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 45, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          padding: E.rPadding('25', '20', '25', '20'),
          border_border: 'solid',
          border_width: { unit: 'px', top: '2', right: '0', bottom: '0', left: '0', isLinked: false },
          border_color: '#c9a96e',
          flex_gap: E.gap(8)
        }, [
          E.imageWidget(IMAGES.sourcing.delivery.url, {
            id: 0, alt: IMAGES.sourcing.delivery.alt, radius: 8, width: 100
          }),
          E.heading('Step 6: Carbon-Offset Delivery', {
            fontSize: 18, color: '#c9a96e', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Your order is shipped with tracked delivery and 100% carbon offset. From our hands ' +
            'to yours, every mile is accounted for, ensuring your crystal arrives with a clear ' +
            'conscience.',
            { fontSize: 14, color: '#b0c0b0', align: 'center', lineHeight: 22 }
          )
        ])
      ])
    ]),

    // ===================== Section 4: 影响力数据 =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(20)
    }, [
      E.heading('Our Impact in Numbers', {
        fontSize: 40, color: '#2d2d2d', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Together with our customers, we\'re making a positive difference', {
        fontSize: 17, color: '#888888', align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '50', left: '0', isLinked: '' }
        }
      }),
      // 3列→平板3列→手机1列
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(30)
      }, [
        // 数据1: 种树
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 30, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#e8f5e9',
          border_radius: { unit: 'px', top: '16', right: '16', bottom: '16', left: '16', isLinked: true },
          padding: E.rPadding('40', '30', '40', '30'),
          flex_gap: E.gap(8)
        }, [
          E.heading('5,000+', {
            fontSize: 56, color: '#2e7d32', align: 'center', fontWeight: '700',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Trees Planted', {
            fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Through our partnership with reforestation organizations, we plant trees for every ' +
            '100 orders placed. Each tree absorbs carbon, restores habitats, and supports biodiversity.',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 22 }
          )
        ]),
        // 数据2: 碳排放
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 30, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#e3f2fd',
          border_radius: { unit: 'px', top: '16', right: '16', bottom: '16', left: '16', isLinked: true },
          padding: E.rPadding('40', '30', '40', '30'),
          flex_gap: E.gap(8)
        }, [
          E.heading('120 Tons', {
            fontSize: 56, color: '#1565c0', align: 'center', fontWeight: '700',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('CO2 Offset', {
            fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'Every shipment is 100% carbon-offset through verified renewable energy and ' +
            'reforestation projects. We track and report our total carbon footprint annually, ' +
            'always striving to reduce it.',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 22 }
          )
        ]),
        // 数据3: 社区
        E.wrap({
          content_width: 'full',
          width: { unit: '%', size: 30, sizes: [] },
          width_tablet: { unit: '%', size: 30, sizes: [] },
          width_mobile: { unit: '%', size: 100, sizes: [] },
          background_background: 'classic',
          background_color: '#fff3e0',
          border_radius: { unit: 'px', top: '16', right: '16', bottom: '16', left: '16', isLinked: true },
          padding: E.rPadding('40', '30', '40', '30'),
          flex_gap: E.gap(8)
        }, [
          E.heading('8', {
            fontSize: 56, color: '#e65100', align: 'center', fontWeight: '700',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.heading('Communities Supported', {
            fontSize: 20, color: '#2d2d2d', align: 'center', fontWeight: '600',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
            }
          }),
          E.textEditor(
            'We invest in the communities where our crystals are sourced, funding schools, ' +
            'clean water initiatives, and vocational training. Your purchase directly contributes ' +
            'to sustainable development in these regions.',
            { fontSize: 14, color: '#555555', align: 'center', lineHeight: 22 }
          )
        ])
      ]),
      E.spacer('20'),
      E.wrap({ content_width: 'boxed' }, [
        E.textEditor(
          'We publish an annual Impact Report detailing our environmental and social contributions. ' +
          'Transparency is not just a policy — it\'s a promise. When you choose Earthward, ' +
          'you\'re choosing a brand that cares about the planet as much as it cares about your wellbeing.',
          { fontSize: 15, color: '#666666', align: 'center', lineHeight: 26 }
        )
      ])
    ]),

    // ===================== Section 5: CTA =====================
    E.section({
      padding: E.rPadding('100', '10', '100', '10', {
        tablet: { t: '70', r: '10', b: '70', l: '10' },
        mobile: { t: '50', r: '10', b: '50', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.sourcing.cta.url,
        id: 0, size: '', alt: IMAGES.sourcing.cta.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a1a2e',
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Shop Ethically Sourced Crystals', {
          color: '#FFFFFF', fontSize: 44, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
          }
        }),
        E.textEditor(
          'Every crystal in our collection is sourced with integrity, crafted with care, and delivered with purpose. ' +
          'Browse our ethically sourced collection and find the crystal that resonates with your soul.',
          { color: '#d0c5b7', fontSize: 18, align: 'center', lineHeight: 30,
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '35', left: '0', isLinked: '' }
            }
          }
        ),
        // 双按钮
        E.wrap({ flex_direction: 'row', flex_justify_content: 'center', flex_gap: E.gap(15) }, [
          E.buttonWidget('Shop All Crystals', '/collections'),
          E.buttonWidget('Take the Crystal Quiz', '/crystal-quiz')
        ])
      ])
    ])
  ];
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  await E.createPage('Ethical Sourcing', 'about/ethical-sourcing', generateEthicalSourcing(), 'draft');
}

main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
