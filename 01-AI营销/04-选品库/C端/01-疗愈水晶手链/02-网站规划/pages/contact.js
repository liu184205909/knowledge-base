/**
 * Contact 页面脚本
 * URL: /contact
 *
 * 布局规格（来自页面布局方案 §3）：
 * - Section 1: Hero 标题 "Get in Touch"
 * - Section 2: 3列联系方式（Email / Social / Response Time）
 * - Section 3: 联系表单（Name/Email/Order Number/Subject/Message）
 * - Section 4: FAQ 快速链接（4个最常见问题）
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 辅助：3列卡片通用 settings
// ============================================================
function contactCard() {
  return {
    content_width: 'full',
    background_background: 'classic',
    background_color: '#ffffff',
    border_border: 'solid',
    border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: '#e0e0e0',
    border_radius: { unit: 'px', top: '10', right: '10', bottom: '10', left: '10', isLinked: true },
    padding: E.rPadding('30', '20', '30', '20', {
      mobile: { t: '20', r: '15', b: '20', l: '15' }
    }),
    width: { unit: '%', size: 31, sizes: [] },
    width_tablet: { unit: '%', size: 45, sizes: [] },
    width_mobile: { unit: '%', size: 100, sizes: [] },
    flex_direction: 'column',
    flex_align_items: 'center'
  };
}

function faqCard() {
  return {
    content_width: 'full',
    background_background: 'classic',
    background_color: '#fafafa',
    border_border: 'solid',
    border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: '#e0e0e0',
    border_radius: { unit: 'px', top: '8', right: '8', bottom: '8', left: '8', isLinked: true },
    padding: { unit: 'px', top: '20', right: '20', bottom: '20', left: '20', isLinked: true },
    width: { unit: '%', size: 48, sizes: [] },
    width_tablet: { unit: '%', size: 48, sizes: [] },
    width_mobile: { unit: '%', size: 100, sizes: [] }
  };
}

// ============================================================
// 生成 Contact 页面 Elementor 结构
// ============================================================
function generateContact() {
  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('100', '10', '60', '10', {
        tablet: { t: '80', r: '10', b: '40', l: '10' },
        mobile: { t: '60', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.contact.hero.url,
        id: 0, size: '', alt: IMAGES.contact.hero.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a1a2e',
      background_overlay_opacity: { unit: 'px', size: 0.64, sizes: [] }
    }, [
      E.heading('Get in Touch', {
        fontSize: 48,
        color: '#FFFFFF',
        align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Have a question, need help with an order, or just want to say hello? We\'re here for you.', {
        fontSize: 18,
        color: '#E8E0F5',
        align: 'center'
      })
    ]),

    // ===================== Section 2: 3列联系方式 =====================
    E.section({
      padding: E.rPadding('60', '10', '60', '10', {
        tablet: { t: '40', r: '10', b: '40', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      }),
      flex_direction: 'row',
      flex_align_items: 'stretch',
      flex_wrap: 'wrap',
      flex_gap: E.gap(20)
    }, [
      // Column 1: Email
      E.wrap(contactCard(), [
        E.iconBox('Email Us', 'support@luckycrystals.org\nWe respond to all emails within 24 hours.')
      ]),

      // Column 2: Social Media
      E.wrap(contactCard(), [
        E.iconBox('Follow Us', 'Stay connected for crystal tips, new arrivals, and exclusive offers.'),
        E.socialIcons([
          { name: 'instagram', url: 'https://instagram.com/luckycrystals' },
          { name: 'facebook', url: 'https://facebook.com/luckycrystals' },
          { name: 'pinterest', url: 'https://pinterest.com/luckycrystals' },
          { name: 'tiktok', url: 'https://tiktok.com/@luckycrystals' }
        ])
      ]),

      // Column 3: Response Time
      E.wrap(contactCard(), [
        E.iconBox('Fast Response', 'Less than 24 hours.\nMonday through Saturday, 9 AM - 6 PM EST.')
      ])
    ]),

    // ===================== Section 3: Contact Form =====================
    E.section({
      padding: E.rPadding('60', '10', '80', '10', {
        tablet: { t: '40', r: '10', b: '60', l: '10' },
        mobile: { t: '30', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#fafafa'
    }, [
      E.heading('Send Us a Message', {
        fontSize: 32,
        color: '#333333',
        align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
        }
      }),
      E.wrap({ content_width: 'boxed' }, [
        E.imageWidget(IMAGES.contact.form.url, {
          id: 0,
          alt: IMAGES.contact.form.alt,
          width: 100,
          radius: 10
        }),
        E.spacer('25'),
        E.htmlWidget([
          '<style>',
          '  .lc-form { max-width: 600px; margin: 0 auto; }',
          '  .lc-form-row { display: flex; gap: 16px; margin-bottom: 16px; }',
          '  .lc-form-row .lc-field { flex: 1; }',
          '  .lc-field { margin-bottom: 0; }',
          '  .lc-field.full { margin-bottom: 16px; }',
          '  .lc-field label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px; }',
          '  .lc-field input, .lc-field select, .lc-field textarea {',
          '    width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px;',
          '    font-size: 15px; color: #333; background: #fff; box-sizing: border-box;',
          '    transition: border-color 0.2s;',
          '  }',
          '  .lc-field input:focus, .lc-field select:focus, .lc-field textarea:focus {',
          '    outline: none; border-color: #8b7355;',
          '  }',
          '  .lc-field textarea { min-height: 140px; resize: vertical; }',
          '  .lc-submit {',
          '    display: block; width: 100%; max-width: 220px; margin: 20px auto 0;',
          '    padding: 14px 32px; background: #333; color: #fff; border: none;',
          '    border-radius: 8px; font-size: 16px; font-weight: 600;',
          '    cursor: pointer; text-align: center; transition: background 0.2s;',
          '  }',
          '  .lc-submit:hover { background: #555; }',
          '  @media (max-width: 600px) {',
          '    .lc-form-row { flex-direction: column; gap: 0; }',
          '    .lc-form-row .lc-field { margin-bottom: 16px; }',
          '  }',
          '</style>',
          '',
          '<form class="lc-form" action="#" method="post">',
          '  <div class="lc-form-row">',
          '    <div class="lc-field">',
          '      <label for="lc-name">Your Name *</label>',
          '      <input type="text" id="lc-name" name="name" placeholder="Jane Smith" required>',
          '    </div>',
          '    <div class="lc-field">',
          '      <label for="lc-email">Email Address *</label>',
          '      <input type="email" id="lc-email" name="email" placeholder="jane@example.com" required>',
          '    </div>',
          '  </div>',
          '  <div class="lc-form-row">',
          '    <div class="lc-field">',
          '      <label for="lc-order">Order Number</label>',
          '      <input type="text" id="lc-order" name="order_number" placeholder="LC-12345 (optional)">',
          '    </div>',
          '    <div class="lc-field">',
          '      <label for="lc-subject">Subject *</label>',
          '      <select id="lc-subject" name="subject" required>',
          '        <option value="">Select a topic...</option>',
          '        <option value="order">Order Inquiry</option>',
          '        <option value="product">Product Question</option>',
          '        <option value="shipping">Shipping & Delivery</option>',
          '        <option value="returns">Returns & Exchanges</option>',
          '        <option value="wholesale">Wholesale Inquiry</option>',
          '        <option value="other">Other</option>',
          '      </select>',
          '    </div>',
          '  </div>',
          '  <div class="lc-field full">',
          '    <label for="lc-message">Message *</label>',
          '    <textarea id="lc-message" name="message" placeholder="Tell us how we can help you..." required></textarea>',
          '  </div>',
          '  <button type="submit" class="lc-submit">Send Message</button>',
          '</form>'
        ].join('\n'))
      ])
    ]),

    // ===================== Section 4: FAQ Quick Links =====================
    E.section({
      padding: E.rPadding('60', '10', '80', '10', {
        tablet: { t: '40', r: '10', b: '60', l: '10' },
        mobile: { t: '30', r: '10', b: '40', l: '10' }
      })
    }, [
      E.heading('Common Questions', {
        fontSize: 28,
        color: '#333333',
        align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
        }
      }),
      // 2x2 grid of FAQ quick links
      E.wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: E.gap(16)
      }, [
        // FAQ Link 1
        E.wrap(faqCard(), [
          E.heading('Are your crystals real?', {
            fontSize: 18,
            color: '#333333',
            align: 'left',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Yes, every crystal is 100% natural. Each piece is hand-selected and comes with an authenticity card.', {
            fontSize: 14,
            color: '#666666',
            align: 'left'
          })
        ]),

        // FAQ Link 2
        E.wrap(faqCard(), [
          E.heading('What\'s your return policy?', {
            fontSize: 18,
            color: '#333333',
            align: 'left',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('We offer a 30-day hassle-free return policy. Not the right energy? We\'ll help you find the perfect match.', {
            fontSize: 14,
            color: '#666666',
            align: 'left'
          })
        ]),

        // FAQ Link 3
        E.wrap(faqCard(), [
          E.heading('How long does shipping take?', {
            fontSize: 18,
            color: '#333333',
            align: 'left',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('US orders arrive in 5-7 business days. Express shipping (2-3 days) is also available at checkout.', {
            fontSize: 14,
            color: '#666666',
            align: 'left'
          })
        ]),

        // FAQ Link 4
        E.wrap(faqCard(), [
          E.heading('How do I cleanse my crystal?', {
            fontSize: 18,
            color: '#333333',
            align: 'left',
            extra: {
              _margin: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' },
              _padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
            }
          }),
          E.textEditor('Use moonlight, sage, selenite, or sound. We include a cleansing guide card with every order.', {
            fontSize: 14,
            color: '#666666',
            align: 'left'
          })
        ])
      ]),

      // View All FAQ link
      E.spacer('20'),
      E.buttonWidget('View All FAQs', '/faq')
    ])
  ];
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  console.log('=== Contact Page Upload ===\n');
  await E.createPage('Contact Us', 'contact', generateContact(), 'draft');
}

main().catch(function(err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});
