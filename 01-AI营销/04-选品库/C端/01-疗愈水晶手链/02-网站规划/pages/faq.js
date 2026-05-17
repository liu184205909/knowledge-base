/**
 * FAQ 页面脚本
 * URL: /faq
 *
 * 布局规格（来自页面布局方案 §4）：
 * - Section 1: Hero 标题 "Frequently Asked Questions"
 * - Section 2: FAQ 分类手风琴（4类，共15题）
 * - Section 3: CTA "Still have questions?" → /contact
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// FAQ 内容数据（4类15题）
// ============================================================

const faqCategories = [
  {
    heading: 'About Our Crystals',
    items: [
      {
        title: 'Are your crystals real and natural?',
        content: 'Yes, every crystal we sell is 100% natural and genuine. We source directly from trusted mines and suppliers, and each piece is hand-selected for quality. Every order includes an authenticity card that verifies the stone\'s origin and type. We never sell dyed, synthetic, or lab-created stones unless explicitly labeled.'
      },
      {
        title: 'How are your crystals energetically cleansed?',
        content: 'Before shipping, every crystal undergoes a thorough cleansing and charging process. We use a combination of methods: sage smudging to clear stagnant energy, moonlight bathing during the full moon to recharge natural vibrations, and sound healing with singing bowls to restore harmonic resonance. This ensures your crystal arrives ready to work with your energy from the moment you receive it.'
      },
      {
        title: 'Do crystal bracelets actually work?',
        content: 'Crystal healing is based on thousands of years of tradition across many cultures. While scientific evidence is still emerging, many of our customers report feeling more grounded, calm, and focused when wearing their crystal bracelets. The key is intention setting — when you wear a crystal with a clear purpose, it serves as a daily mindfulness anchor that keeps you aligned with your goals. Think of it as a wearable reminder of the energy you want to cultivate.'
      },
      {
        title: 'Where do you source your crystals from?',
        content: 'We partner with ethical suppliers in Brazil, India, Madagascar, and other renowned mining regions. Every supplier is vetted for fair labor practices, environmental responsibility, and conflict-free sourcing. We believe that the energy of a crystal begins at its source, which is why we maintain full traceability from mine to your wrist. Learn more on our Ethical Sourcing page.'
      }
    ]
  },
  {
    heading: 'Ordering & Products',
    items: [
      {
        title: 'How do I choose the right crystal for me?',
        content: 'There are several ways to find your perfect crystal. You can browse by intention on our Shop by Intention page to find crystals that align with your current needs — whether it\'s anxiety relief, love, abundance, or protection. For a more personalized experience, try our free Crystal Quiz, which asks a few questions and recommends crystals tailored to your energy. You can also simply trust your intuition — the crystal that catches your eye is often the one meant for you.'
      },
      {
        title: 'What bead size should I choose?',
        content: 'We offer bracelets in 6mm, 8mm, and 10mm bead sizes. 6mm beads create a delicate, understated look perfect for stacking multiple bracelets. 8mm is our most popular size — a balanced look that works well on its own or stacked. 10mm beads make a bolder statement and are great if you want your bracelet to be a focal point. All sizes are available in standard wrist circumferences. Check our size guide for detailed measurements.'
      },
      {
        title: 'What\'s included in my order?',
        content: 'Every LuckyCrystals order includes: your crystal bracelet (or selected item), a premium velvet drawstring pouch for storage, an energy guide card explaining your crystal\'s properties and best uses, a cleansing instruction card, and an authenticity certificate. Gift wrapping is available at checkout for a small additional fee.'
      },
      {
        title: 'Can I stack multiple crystal bracelets together?',
        content: 'Absolutely! Crystal stacking is one of the most popular ways to wear our bracelets. You can combine crystals that share similar intentions for amplified energy, or mix complementary intentions for a balanced approach. For example, Black Tourmaline (protection) pairs beautifully with Rose Quartz (love) — grounding your energy while opening your heart. Just make sure the combined weight feels comfortable on your wrist.'
      }
    ]
  },
  {
    heading: 'Shipping & Returns',
    items: [
      {
        title: 'How long does shipping take?',
        content: 'US orders: Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. International orders: Delivery typically takes 10-21 business days depending on your location and local customs processing. All orders include tracking information sent via email once your package ships.'
      },
      {
        title: 'Do you offer free shipping?',
        content: 'Yes! We offer free standard shipping on all US orders over $75. For orders under $75, standard shipping is a flat rate of $4.95. International shipping rates vary by destination and are calculated at checkout. We frequently run free shipping promotions, so sign up for our newsletter to stay informed.'
      },
      {
        title: 'What is your return policy?',
        content: 'We offer a 30-day hassle-free return policy. If you\'re not completely satisfied with your crystal, simply contact us within 30 days of delivery for a full refund or exchange. Items must be returned in their original condition with all packaging. Crystals are deeply personal — we understand that sometimes the energy just isn\'t the right match, and we want you to find the perfect one.'
      },
      {
        title: 'Do you ship internationally?',
        content: 'Yes, we ship to over 50 countries worldwide. International orders may be subject to customs duties and import taxes, which are the responsibility of the buyer. We recommend checking your country\'s import regulations before placing an order. All international shipments include tracking, and we partner with reliable carriers to ensure safe delivery.'
      }
    ]
  },
  {
    heading: 'Crystal Care',
    items: [
      {
        title: 'How do I cleanse and charge my crystal bracelet?',
        content: 'There are several effective methods: Moonlight — place your bracelet under the moonlight overnight, especially during a full moon. Sage — pass your bracelet through sage smoke for 30-60 seconds. Selenite — place your bracelet on a selenite charging plate overnight. Sound — use a singing bowl or tuning fork near your bracelet. Avoid using water or salt with soft or porous stones like Selenite, Lepidolite, or Malachite, as they can be damaged.'
      },
      {
        title: 'How often should I cleanse my crystals?',
        content: 'As a general rule, cleanse your crystals every 2-4 weeks, or whenever you feel their energy has dulled. You should also cleanse them after intense emotional periods, after someone else has touched them, or when you first set a new intention. If you wear your bracelet daily, a monthly cleansing routine under the full moon is a wonderful ritual to maintain.'
      },
      {
        title: 'Can I wear my crystal bracelet in water?',
        content: 'While brief exposure to water (like washing hands) is generally fine for most crystals, we recommend removing your bracelet before swimming, bathing, or exercising. Some crystals like Selenite, Lepidolite, and Malachite are particularly sensitive to moisture and can degrade over time. Salt water and chlorinated water can damage the elastic cord and the stones. When not wearing your bracelet, store it in the provided velvet pouch to protect it.'
      }
    ]
  }
];

// ============================================================
// 生成 FAQ 页面 Elementor 结构
// ============================================================
function generateFAQ() {
  return [

    // ===================== Section 1: Hero =====================
    E.section({
      padding: E.rPadding('100', '10', '60', '10', {
        tablet: { t: '80', r: '10', b: '40', l: '10' },
        mobile: { t: '60', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.faq.hero.url,
        id: 0, size: '', alt: IMAGES.faq.hero.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#1a1a2e',
      background_overlay_opacity: { unit: 'px', size: 0.62, sizes: [] }
    }, [
      E.heading('Frequently Asked Questions', {
        fontSize: 48,
        color: '#FFFFFF',
        align: 'center',
        extra: {
          _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }
      }),
      E.textEditor('Everything you need to know about our crystals, ordering, shipping, and care', {
        fontSize: 18,
        color: '#E8E0F5',
        align: 'center',
        extra: {
          _element_width: 'initial',
          _margin: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: '' }
        }
      })
    ]),

    // ===================== Section 2: FAQ Categories =====================
    E.section({
      padding: E.rPadding('60', '10', '80', '10', {
        tablet: { t: '40', r: '10', b: '60', l: '10' },
        mobile: { t: '30', r: '10', b: '40', l: '10' }
      }),
      flex_gap: E.gap(40)
    }, faqCategories.flatMap(function(category) {
      return [
        // Category heading
        E.heading(category.heading, {
          fontSize: 28,
          color: '#333333',
          align: 'left',
          extra: {
            typography_font_weight: '600',
            _element_width: 'initial',
            _margin: { unit: 'px', top: '20', right: '0', bottom: '15', left: '0', isLinked: '' },
            _padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
          }
        }),
        // FAQ Accordion for this category
        E.accordion(category.items),
        // Divider between categories (except last)
        E.divider()
      ];
    }).slice(0, -1)), // Remove trailing divider

    // ===================== Section 3: CTA =====================
    E.section({
      padding: E.rPadding('80', '10', '80', '10', {
        tablet: { t: '60', r: '10', b: '60', l: '10' },
        mobile: { t: '40', r: '10', b: '40', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.faq.cta.url,
        id: 0, size: '', alt: IMAGES.faq.cta.alt, source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#f5f0eb',
      background_overlay_opacity: { unit: 'px', size: 0.9, sizes: [] }
    }, [
      E.wrap({ content_width: 'boxed' }, [
        E.heading('Still Have Questions?', {
          fontSize: 36,
          color: '#333333',
          align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
          }
        }),
        E.textEditor('We\'d love to hear from you. Reach out and our team will get back to you within 24 hours.', {
          fontSize: 18,
          color: '#666666',
          align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
          }
        }),
        E.buttonWidget('Contact Us', '/contact')
      ])
    ])
  ];
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  console.log('=== FAQ Page Upload ===\n');
  await E.createPage('FAQ', 'faq', generateFAQ(), 'draft');
}

main().catch(function(err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});
