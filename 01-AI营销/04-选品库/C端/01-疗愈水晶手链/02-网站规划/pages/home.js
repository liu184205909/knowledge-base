/**
 * Homepage — Elementor V3 (Flexbox) + B1a 2C执行版
 *
 * 基于 16-Section 布局方案（页面布局方案.md Section 1）
 * 竞品参考: Energy Muse(首页结构) + Conscious Items(转化设计) + Tiny Rituals(社交证明) + Moonrise Crystals(道德采购)
 *
 * Elementor V3 说明：所有多列布局用纯 Flexbox 模式（flex_direction: "row"），不用 structure
 *
 * Section Map (S1公告栏+S16 Footer 由主题处理):
 *  S2  Hero Banner       ← Energy Muse + 差异化"Find Your Crystal"入口
 *  S3  Trust Score Bar   ← Tiny Rituals + Conscious Items
 *  S4  Shop by Intention ← Energy Muse "Shop by Intention" (6卡片)
 *  S5  Best Sellers      ← Tiny Rituals (WooCommerce产品网格)
 *  S6  Quiz Tool Entry   ← Conscious Items + Energy Muse (差异化核心)
 *  S7  Shop by Stone     ← Tiny Rituals + Crystal Vaults诗意命名 (16水晶)
 *  S8  Comparison Table  ← Conscious Items "Why Choose Us"
 *  S9  Brand Story       ← Energy Muse + Moonrise Crystals
 *  S10 Testimonials      ← Energy Muse + Tiny Rituals
 *  S11 FAQ               ← Conscious Items (6-FAQ手风琴)
 *  S12 Blog              ← Energy Muse (4篇博客卡片)
 *  S13 Newsletter        ← 标准
 *  S14 SEO Content       ← Tiny Rituals
 *  S15 Trust Guarantees  ← Tiny Rituals + Moonrise Crystals (6项)
 *
 * Widget 选择策略：
 * - heading     → 标题（Elementor 标准）
 * - text-editor → 段落文字（Elementor 标准）
 * - image-box   → 图片+标题+描述卡片（Elementor Pro 标准）
 * - icon-box    → 图标+标题+描述（Elementor Pro 标准）
 * - image       → 纯图片（Elementor 标准）
 * - button      → 按钮（Elementor 标准）
 * - spacer      → 间距（Elementor 标准）
 * - accordion   → FAQ手风琴（Elementor 标准）
 * - wd_products_tabs → 产品标签页（WoodMart，WooCommerce 必需）
 */

const https = require('https');
const path = require('path');
const IMAGES = require('../assets/site-images');

// ============================================================
// 认证配置 — 优先环境变量，fallback 到 api-credentials.json
// ============================================================
let _creds = { wp_username: '', wp_app_password: '' };
try {
  _creds = require(path.resolve(__dirname, '../../config/api-credentials.json'));
} catch (e) { /* fallback to env only */ }

const SITE = process.env.WP_SITE || 'luckycrystals.org';
const AUTH = 'Basic ' + Buffer.from(
  (process.env.WP_USER || _creds.wp_username || '') + ':' + (process.env.WP_APP_PASSWORD || _creds.wp_app_password || '')
).toString('base64');

// ============================================================
// 工具函数
// ============================================================
function uid() {
  return Math.random().toString(16).slice(2, 9);
}

/** 顶层容器（section）— 不设 content_width，默认 boxed */
function section(settings, elements) {
  return {
    id: uid(),
    elType: 'container',
    settings: Object.assign({
      wd_section_stretch: 'stretch',
      scroll_y: -80,
      flex_direction: 'column'
    }, settings),
    elements: elements,
    isInner: false
  };
}

/** 嵌套容器 — content_width: "full", isInner: true */
function wrap(settings, elements) {
  return {
    id: uid(),
    elType: 'container',
    settings: Object.assign({
      content_width: 'full',
      scroll_y: -80
    }, settings),
    elements: elements,
    isInner: true
  };
}

/** 响应式 padding 辅助 */
function rPadding(t, r, b, l, overrides) {
  const pad = { unit: 'px', top: t, right: r, bottom: b, left: l, isLinked: '' };
  if (overrides && overrides.tablet) {
    const tb = overrides.tablet;
    pad.padding_tablet = { unit: 'px', top: tb.t || t, right: tb.r || r, bottom: tb.b || b, left: tb.l || l, isLinked: '' };
  }
  if (overrides && overrides.mobile) {
    const mb = overrides.mobile;
    pad.padding_mobile = { unit: 'px', top: mb.t || t, right: mb.r || r, bottom: mb.b || b, left: mb.l || l, isLinked: '' };
  }
  return pad;
}

/** heading widget */
function heading(title, opts) {
  const o = opts || {};
  const fs = o.fontSize || 32;
  const settings = {
    title: title,
    align: o.align || 'center',
    title_color: o.color || '#333333',
    typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fs, sizes: [] },
    typography_font_weight: o.fontWeight || '700',
    _element_width: o.width || 'initial',
    _element_vertical_alignment: o.vAlign || '',
    _padding: o.padding || { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' },
    scroll_y: -80
  };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.round(fs * 0.75), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.round(fs * 0.6), sizes: [] };
  }
  return {
    id: uid(),
    elType: 'widget',
    settings: Object.assign(settings, o.extra || {}),
    elements: [],
    widgetType: 'heading'
  };
}

/** text-editor widget */
function textEditor(content, opts) {
  const o = opts || {};
  const fs = o.fontSize || 16;
  const settings = {
    editor_content: '<p>' + content + '</p>',
    align: o.align || 'center',
    text_color: o.color || '#666666',
    typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fs, sizes: [] },
    typography_line_height: { unit: 'px', size: o.lineHeight || 26, sizes: [] },
    _element_width: o.width || 'initial',
    scroll_y: -80
  };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.max(14, Math.round(fs * 0.9)), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.max(13, Math.round(fs * 0.85)), sizes: [] };
  }
  return {
    id: uid(),
    elType: 'widget',
    settings: Object.assign(settings, o.extra || {}),
    elements: [],
    widgetType: 'text-editor'
  };
}

/** image widget */
function imageWidget(url, opts) {
  const o = opts || {};
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      image: { url: url, id: o.id || 0, alt: o.alt || '', source: 'library', size: '' },
      image_size: o.imageSize || 'full',
      align: o.align || 'center',
      width: o.width ? { unit: '%', size: o.width, sizes: [] } : { unit: '%', size: 100, sizes: [] },
      image_border_radius: o.radius ? { unit: 'px', size: o.radius, sizes: [] } : { unit: 'px', size: 5, sizes: [] },
      scroll_y: -80
    },
    elements: [],
    widgetType: 'image'
  };
}

/** image-box widget（图片+标题+描述卡片） */
function imageBox(url, title, desc, linkUrl, opts) {
  const o = opts || {};
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      image: { url: url, id: 0, size: '', source: 'library' },
      title_text: title,
      description_text: desc,
      link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
      title_bottom_space: { unit: 'px', size: 10, sizes: [] },
      image_size: { unit: '%', size: 100, sizes: [] },
      image_border_radius: o.radius ? { unit: '%', size: o.radius, sizes: [] } : { unit: 'px', size: 5, sizes: [] },
      hover_animation: 'pulse-shrink',
      scroll_y: -80,
      __globals__: { title_color: 'globals/colors?id=4616873' }
    },
    elements: [],
    widgetType: 'image-box'
  };
}

/** icon-box widget（图标+标题+描述） */
function iconBox(title, desc) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      selected_icon: { value: '', library: '' },
      title_text: title,
      description_text: desc,
      text_align: 'center',
      icon_space: { unit: 'px', size: 10, sizes: [] },
      title_bottom_space: { unit: 'px', size: 10, sizes: [] },
      title_typography_typography: 'custom',
      text_stroke_text_stroke_type: 'yes',
      text_stroke_text_stroke: { unit: 'px', size: 1, sizes: [] },
      text_stroke_text_stroke_tablet: { unit: 'em', size: '', sizes: [] },
      text_stroke_text_stroke_mobile: { unit: 'em', size: '', sizes: [] },
      text_stroke_stroke_color: '#787878',
      scroll_y: -80,
      __globals__: { title_color: 'globals/colors?id=4616873' }
    },
    elements: [],
    widgetType: 'icon-box'
  };
}

/** button widget */
function buttonWidget(text, linkUrl, opts) {
  const o = opts || {};
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      text: text,
      link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
      size: o.size || 'md',
      align: o.align || 'center',
      scroll_y: -80
    },
    elements: [],
    widgetType: 'button'
  };
}

/** spacer widget */
function spacer(size) {
  return {
    id: uid(),
    elType: 'widget',
    settings: { spacer: size || '40' },
    elements: [],
    widgetType: 'spacer'
  };
}

/** WoodMart: wd_products_tabs */
function wdProductsTabs() {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      title: 'Healing Crystal',
      design: 'simple',
      color: '#007bc4',
      tabs_items: [
        { _id: uid(), image_size: 'custom', title: 'New', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'post__in' },
        { _id: uid(), image_size: 'custom', title: 'BEST SELLERS', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'rand', query_type: 'AND', order: 'DESC' }
      ],
      scroll_y: -80,
      items_per_page: '8',
      pagination: 'arrows',
      columns: { unit: 'px', size: '4', sizes: [] }
    },
    elements: [],
    widgetType: 'wd_products_tabs'
  };
}

/** accordion widget（FAQ） */
function accordionWidget(items) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      tabs: items.map(function(item) {
        return { _id: uid(), tab_title: item.q, tab_content: '<p>' + item.a + '</p>' };
      }),
      scroll_y: -80
    },
    elements: [],
    widgetType: 'accordion'
  };
}

// ============================================================
// 页面数据常量
// ============================================================

/** S7 Shop by Stone — 16种水晶 + Crystal Vaults 诗意命名 */
var CRYSTALS = [
  { key: 'amethyst',        name: 'Amethyst',         poetic: 'The Stone of Peace',          slug: 'amethyst-crystals' },
  { key: 'roseQuartz',      name: 'Rose Quartz',      poetic: 'The Stone of Love',           slug: 'rose-quartz-crystals' },
  { key: 'citrine',         name: 'Citrine',          poetic: 'The Stone of Abundance',      slug: 'citrine-crystals' },
  { key: 'blackTourmaline', name: 'Black Tourmaline', poetic: 'The Shield Stone',            slug: 'black-tourmaline-crystals' },
  { key: 'clearQuartz',     name: 'Clear Quartz',     poetic: 'The Master Healer',           slug: 'clear-quartz-crystals' },
  { key: 'tigerEye',        name: 'Tiger Eye',        poetic: 'The Stone of Courage',        slug: 'tiger-eye-crystals' },
  { key: 'moonstone',       name: 'Moonstone',        poetic: 'The Stone of New Beginnings', slug: 'moonstone-crystals' },
  { key: 'obsidian',        name: 'Obsidian',         poetic: 'The Mirror Stone',            slug: 'obsidian-crystals' },
  { key: 'lepidolite',      name: 'Lepidolite',       poetic: 'The Stone of Transition',     slug: 'lepidolite-crystals' },
  { key: 'selenite',        name: 'Selenite',         poetic: 'The Stone of Clarity',        slug: 'selenite-crystals' },
  { key: 'greenAventurine', name: 'Green Aventurine', poetic: 'The Stone of Luck',           slug: 'green-aventurine-crystals' },
  { key: 'fluorite',        name: 'Fluorite',         poetic: 'The Stone of Focus',          slug: 'fluorite-crystals' },
  { key: 'howlite',         name: 'Howlite',          poetic: 'The Stone of Calm',           slug: 'howlite-crystals' },
  { key: 'rhodonite',       name: 'Rhodonite',        poetic: 'The Stone of Compassion',     slug: 'rhodonite-crystals' },
  { key: 'malachite',       name: 'Malachite',        poetic: 'The Stone of Transformation', slug: 'malachite-crystals' },
  { key: 'hematite',        name: 'Hematite',         poetic: 'The Grounding Stone',         slug: 'hematite-crystals' }
];

/** S4 Shop by Intention — 6个核心意图 */
var INTENTIONS = [
  { name: 'Anxiety & Stress Relief', desc: 'Find your calm with soothing crystals',   slug: 'anxiety-relief',     img: 'amethyst' },
  { name: 'Love & Relationships',    desc: 'Open your heart to deeper connections',    slug: 'love-relationships', img: 'roseQuartz' },
  { name: 'Wealth & Prosperity',     desc: 'Manifest abundance and success',           slug: 'wealth-prosperity',  img: 'citrine' },
  { name: 'Protection & Grounding',  desc: 'Shield your energy from negativity',       slug: 'protection-grounding', img: 'blackTourmaline' },
  { name: 'Sleep & Calm',            desc: 'Rest deeply with calming stones',          slug: 'sleep-calm',         img: 'moonstone' },
  { name: 'Focus & Clarity',         desc: 'Clear the noise and sharpen your mind',    slug: 'focus-clarity',      img: 'fluorite' }
];

/** S11 FAQ — 6个核心问题 ← Conscious Items */
var FAQ_ITEMS = [
  { q: 'Are your crystals real?', a: 'Absolutely. Every crystal bracelet is made with 100% natural, genuine gemstones. We never use dyed, synthetic, or imitation stones. Each piece is hand-selected and visually inspected for authenticity before it reaches you.' },
  { q: 'How are crystals cleansed before shipping?', a: 'Every bracelet is energetically cleansed using a combination of dried white sage smoke and selenite charging, then placed under moonlight. This process clears any accumulated energy so your crystal arrives ready for your personal intention.' },
  { q: 'Do crystal bracelets actually work?', a: 'Crystal bracelets work as mindfulness tools — wearing one serves as a daily reminder of your intention, whether that\'s calm, love, or focus. Many of our customers report feeling more grounded and connected to their goals. Think of crystals as partners in your personal growth journey.' },
  { q: 'What\'s included in my order?', a: 'Every order includes your crystal bracelet in a premium velvet pouch, an energy guide card explaining your crystal\'s properties and care instructions, and a cleansing guide. Orders over $75 also receive free shipping.' },
  { q: 'How do I choose the right crystal?', a: 'Take our 2-minute Crystal Quiz for a personalized recommendation based on your current needs, or browse by intention to find crystals for specific goals like anxiety relief, love, or abundance.' },
  { q: 'What\'s your return policy?', a: 'We offer a 30-day worry-free return policy. If your crystal doesn\'t feel like the right match, simply send it back within 30 days for a full refund — no questions asked.' }
];

/** S8 Comparison — 6个对比维度 ← Conscious Items */
var COMPARISON = [
  { ours: '100% Natural Crystals', theirs: 'Dyed or synthetic stones' },
  { ours: 'Energetically cleansed & charged', theirs: 'Shipped without any energy work' },
  { ours: 'Ethically sourced, traceable origins', theirs: 'Unknown supply chain' },
  { ours: 'Energy guide card included', theirs: 'No information provided' },
  { ours: 'Premium velvet pouch packaging', theirs: 'Plastic bag packaging' },
  { ours: '30-day worry-free returns', theirs: 'No returns accepted' }
];

/** S12 Blog — 4篇占位博客 */
var BLOG_POSTS = [
  { title: 'The Complete Beginner\'s Guide to Healing Crystals',      slug: 'beginners-guide-healing-crystals',   img: 'beginnerGuide' },
  { title: 'How to Cleanse and Charge Your Crystal Bracelet',         slug: 'how-to-cleanse-crystal-bracelet',    img: 'fullMoon' },
  { title: '7 Crystals for Better Sleep and Calm Nights',             slug: 'crystals-for-better-sleep',          img: 'sleep' },
  { title: 'What Your Birth Month Says About Your Perfect Crystal',   slug: 'birth-month-crystal',                img: 'angelNumbers' }
];

/** S15 Trust Guarantees — 6项 ← Tiny Rituals + Moonrise Crystals */
var TRUST_ITEMS = [
  { title: 'Genuine Crystals',       desc: 'Every stone is hand-selected and verified authentic' },
  { title: 'Cleansed & Charged',     desc: 'Purified with sage and charged under moonlight before shipping' },
  { title: 'Ethically Sourced',      desc: 'Traceable supply chain, fair labor, no conflict minerals' },
  { title: 'Free Shipping $75+',     desc: 'Fast, tracked delivery on all US orders over $75' },
  { title: '30-Day Returns',         desc: 'Not the right energy? Return within 30 days' },
  { title: 'Eco-Friendly Packaging', desc: 'Recyclable materials, velvet pouch included' }
];

// ============================================================
// 响应式卡片列辅助 — 统一的 width 响应式设置
// ============================================================
function cardWidth3() {
  return { unit: '%', size: 30, sizes: [] };
}
function cardWidth4() {
  return { unit: '%', size: 23, sizes: [] };
}
function tabletWidth2() {
  return { unit: '%', size: 45, sizes: [] };
}
function mobileWidth100() {
  return { unit: '%', size: 100, sizes: [] };
}

// ============================================================
// 生成 Homepage V4
// ============================================================
function generateHomepage() {
  return [

    // ===================== S2: Hero Banner ← Energy Muse + 差异化 =====================
    section({
      padding: rPadding('150', '0', '150', '0', {
        tablet: { t: '100', r: '0', b: '100', l: '0' },
        mobile: { t: '80', r: '10', b: '80', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.shared.heroBracelet.url,
        id: 16850, size: '',
        alt: 'Crystals That Work With Your Energy',
        source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#060000'
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Crystals That Work With <u>Your Energy</u>', {
          color: '#FFFFFF', fontSize: 48, align: 'center',
          extra: {
            typography_font_size_tablet: { unit: 'px', size: 36, sizes: [] },
            typography_font_size_mobile: { unit: 'px', size: 28, sizes: [] }
          }
        }),
        textEditor('Handcrafted crystal bracelets, ethically sourced and energetically cleansed. Each piece is ready to support your journey.', {
          color: '#FFFFFF', fontSize: 18, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
          }
        }),
        wrap({ flex_direction: 'row', flex_justify_content: 'center', flex_gap: { size: 15, column: '15', row: '15', unit: 'px' } }, [
          buttonWidget('FIND YOUR CRYSTAL', '/crystal-quiz', { size: 'lg' }),
          buttonWidget('SHOP BY INTENTION', '/collections/', { size: 'lg' })
        ])
      ])
    ]),

    // ===================== S3: Trust Score Bar ← Tiny Rituals + Conscious Items =====================
    section({
      padding: rPadding('40', '10', '40', '10', {
        mobile: { t: '20', r: '10', b: '20', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#F8F5F0',
      flex_direction: 'row',
      flex_align_items: 'center',
      flex_justify_content: 'center',
      flex_wrap: 'wrap',
      flex_gap: { size: 30, column: '30', row: '15', unit: 'px' }
    }, [
      // 4 trust metrics
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('4.9 / 5 Stars', 'Based on 10,000+ verified reviews')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('10,000+ Happy Customers', 'Join our growing crystal community')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('Ethically Sourced', 'Traceable origins from trusted mines worldwide')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('Free Shipping $75+', 'Fast tracked delivery across the US')
      ])
    ]),

    // ===================== S4: Shop by Intention ← Energy Muse (6卡片) =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('What Energy Do You Need Today?', { fontSize: 36 }),
        textEditor('Find the crystal that resonates with your intention', { fontSize: 18, color: '#888888' })
      ]),
      wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
      },
        INTENTIONS.map(function(intent) {
          return wrap({
            content_width: 'full',
            width: { unit: '%', size: 30, sizes: [] },
            width_tablet: tabletWidth2(),
            width_mobile: mobileWidth100()
          }, [
            imageBox(
              IMAGES.crystals[intent.img].url,
              intent.name,
              intent.desc,
              'https://luckycrystals.org/collections/' + intent.slug + '/'
            )
          ]);
        })
      )
    ]),

    // ===================== S5: Best Sellers ← Tiny Rituals =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading("Our Community's Favorites", { fontSize: 36 }),
        textEditor('The crystal bracelets our customers love most', { fontSize: 18, color: '#888888' })
      ]),
      wdProductsTabs()
    ]),

    // ===================== S6: Quiz Tool Entry ← Conscious Items (差异化核心) =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      background_background: 'classic',
      background_color: '#F0EDE8',
      flex_direction: 'row',
      flex_align_items: 'center',
      flex_gap: { size: 30, column: '30', row: '30', unit: 'px' }
    }, [
      // 左侧: 工具预览图
      wrap({
        content_width: 'full',
        width: { size: '45', unit: '%' },
        width_tablet: { size: '100', unit: '%' },
        flex_direction: 'column'
      }, [
        imageWidget(IMAGES.crystalQuiz.hero.url, {
          id: 0, alt: 'Crystal Quiz - Find your perfect crystal match', radius: 12
        })
      ]),
      // 右侧: 文字 + 4工具入口 + CTA
      wrap({
        content_width: 'full',
        width: { size: '50', unit: '%' },
        width_tablet: { size: '100', unit: '%' },
        flex_direction: 'column',
        flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
      }, [
        heading('Not Sure Where to Start?', { fontSize: 36, align: 'left' }),
        textEditor('Take our 2-minute energy quiz and discover the crystals that align with your current needs.', {
          fontSize: 16, align: 'left', color: '#666666'
        }),
        // 4工具入口 2x2
        wrap({
          content_width: 'full',
          flex_direction: 'row',
          flex_wrap: 'wrap',
          flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
        }, [
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Crystal Quiz', 'Answer 5 questions, get your personalized recommendation')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Chakra Guide', 'Learn which chakras need balancing and the crystals to help')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Crystal Oracle', 'Get a free crystal reading for today\'s energy')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Crystal Guide A-Z', 'Explore 100+ crystal meanings and properties')
          ])
        ]),
        buttonWidget('TAKE THE QUIZ', '/crystal-quiz', { size: 'lg', align: 'left' })
      ])
    ]),

    // ===================== S7: Shop by Stone ← Tiny Rituals + Crystal Vaults (16水晶) =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Shop by Crystal', { fontSize: 36 }),
        textEditor('Explore 16 hand-selected gemstones, each with its own unique energy', { fontSize: 18, color: '#888888' })
      ]),
      // 4x4 网格 → 平板 3x6 → 手机 2x8
      wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: { size: 12, column: '12', row: '12', unit: 'px' }
      },
        CRYSTALS.map(function(c) {
          return wrap({
            content_width: 'full',
            width: { unit: '%', size: 22, sizes: [] },
            width_tablet: { unit: '%', size: 30, sizes: [] },
            width_mobile: { unit: '%', size: 47, sizes: [] }
          }, [
            imageBox(
              IMAGES.crystals[c.key].url,
              c.name,
              c.poetic,
              'https://luckycrystals.org/collections/' + c.slug,
              { radius: 50 }
            )
          ]);
        })
      )
    ]),

    // ===================== S8: Comparison Table ← Conscious Items =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      background_background: 'classic',
      background_color: '#FAFAFA',
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Why Choose LuckyCrystals?', { fontSize: 36 }),
        textEditor('Why 10,000+ customers choose us over cheap alternatives', { fontSize: 18, color: '#888888' })
      ]),
      // 3x2 优势网格
      wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
      },
        COMPARISON.map(function(item) {
          return wrap({
            content_width: 'full',
            width: { unit: '%', size: 30, sizes: [] },
            width_tablet: tabletWidth2(),
            width_mobile: mobileWidth100(),
            background_background: 'classic',
            background_color: '#FFFFFF',
            border_border: 'solid',
            border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
            border_color: '#E0E0E0',
            border_radius: { unit: 'px', top: '8', right: '8', bottom: '8', left: '8', isLinked: true },
            padding: { unit: 'px', top: '20', right: '15', bottom: '20', left: '15', isLinked: false }
          }, [
            iconBox(item.ours, 'Unlike: ' + item.theirs)
          ]);
        })
      )
    ]),

    // ===================== S9: Brand Story Preview ← Energy Muse + Moonrise Crystals =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_direction: 'row',
      flex_align_items: 'center',
      flex_gap: { size: 40, column: '40', row: '40', unit: 'px' }
    }, [
      // 左侧: 图片
      wrap({
        content_width: 'full',
        width: { size: '45', unit: '%' },
        width_tablet: { size: '100', unit: '%' }
      }, [
        imageWidget(IMAGES.shared.studioWorkbench.url, {
          id: 13754, alt: 'LuckyCrystals studio — handcrafting crystal bracelets with intention', radius: 12
        })
      ]),
      // 右侧: 文字
      wrap({
        content_width: 'full',
        width: { size: '50', unit: '%' },
        width_tablet: { size: '100', unit: '%' },
        flex_direction: 'column',
        flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
      }, [
        heading('More Than Just Crystals', { fontSize: 32, align: 'left' }),
        textEditor('At LuckyCrystals, we believe every stone carries a story. From the mines of Brazil to the moonlit cleansing ritual in our studio, each bracelet is crafted with intention and care. Our mission is to make the healing power of crystals accessible, ethical, and deeply personal.', {
          fontSize: 16, align: 'left', color: '#666666', lineHeight: 28
        }),
        textEditor('We partner with trusted, traceable suppliers and ensure every crystal is energetically cleansed before it reaches your hands.', {
          fontSize: 16, align: 'left', color: '#666666', lineHeight: 28
        }),
        wrap({ flex_direction: 'row', flex_gap: { size: 15, column: '15', row: '15', unit: 'px' } }, [
          buttonWidget('LEARN OUR STORY', '/about', { size: 'md', align: 'left' }),
          buttonWidget('ETHICAL SOURCING', '/about/ethical-sourcing', { size: 'md', align: 'left' })
        ])
      ])
    ]),

    // ===================== S10: Testimonials ← Energy Muse + Tiny Rituals =====================
    section({
      padding: rPadding('70', '10', '70', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#fafafa'
    }, [
      heading('Real Stories, Real Energy Shifts', { fontSize: 36, color: '#333333' }),
      textEditor('Hear from customers who found their perfect crystal match', { fontSize: 16, color: '#888888' }),
      spacer(20),
      wrap({ flex_direction: 'row', flex_wrap: 'wrap', flex_gap: { size: 20, column: '20', row: '20', unit: 'px' } }, [
        // Testimonial 1
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.about.communityRose.url, { radius: 50, width: 60 }),
          heading('Sarah M.', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('My Rose Quartz bracelet helped me open up to self-love during a really tough transition. I wear it every day as a reminder to be gentle with myself.', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ]),
        // Testimonial 2
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.about.communityAmethyst.url, { radius: 50, width: 60 }),
          heading('Michael T.', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('Since wearing my Amethyst bracelet, I sleep more deeply and feel calmer during stressful work meetings. It\'s become an essential part of my daily routine.', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ]),
        // Testimonial 3
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.about.communityCitrine.url, { radius: 50, width: 60 }),
          heading('Emma L.', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('The Citrine bracelet was my first purchase, and I immediately felt a shift in my confidence. Three months later, I got the promotion I\'d been working toward!', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ])
      ])
    ]),

    // ===================== S11: FAQ ← Conscious Items =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Common Questions', { fontSize: 36 }),
        textEditor('Everything you need to know about our crystal bracelets', { fontSize: 18, color: '#888888' })
      ]),
      wrap({ content_width: 'boxed' }, [
        accordionWidget(FAQ_ITEMS)
      ])
    ]),

    // ===================== S12: Blog ← Energy Muse =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      background_background: 'classic',
      background_color: '#FAFAFA',
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Learn & Explore', { fontSize: 36 }),
        textEditor('Discover the wisdom behind every crystal', { fontSize: 18, color: '#888888' })
      ]),
      wrap({
        content_width: 'full',
        flex_direction: 'row',
        flex_wrap: 'wrap',
        flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
      },
        BLOG_POSTS.map(function(post) {
          return wrap({
            content_width: 'full',
            width: cardWidth4(),
            width_tablet: tabletWidth2(),
            width_mobile: mobileWidth100()
          }, [
            imageBox(
              IMAGES.blog[post.img].url,
              post.title,
              'Read More →',
              'https://luckycrystals.org/blog/' + post.slug
            )
          ]);
        })
      ),
      wrap({ content_width: 'boxed' }, [
        buttonWidget('VIEW ALL ARTICLES', '/blog/')
      ])
    ]),

    // ===================== S13: Newsletter =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.shared.moonRitual.url,
        id: 16974, size: '', alt: '', source: 'library'
      },
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#000000',
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Join the LuckyCrystals Community', { color: '#FFFFFF', fontSize: 32 }),
        textEditor('Get crystal guides, moon phase updates, and 10% off your first order.', {
          color: '#CCCCCC', fontSize: 16,
          extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' } }
        }),
        buttonWidget('SUBSCRIBE & GET 10% OFF', '/#newsletter')
      ])
    ]),

    // ===================== S14: SEO Content Block ← Tiny Rituals =====================
    section({
      padding: rPadding('40', '10', '40', '10', {
        mobile: { t: '20', r: '10', b: '20', l: '10' }
      }),
      flex_gap: { size: 5, column: '5', row: '5', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        textEditor('LuckyCrystals offers handcrafted healing crystal bracelets made from 100% natural gemstones including amethyst, rose quartz, citrine, black tourmaline, and clear quartz. Each bracelet is ethically sourced from trusted mines, energetically cleansed with sage and moonlight, and shipped in eco-friendly packaging with a velvet pouch and energy guide card. Whether you\'re seeking crystals for anxiety relief, love, abundance, protection, or spiritual growth, our collection is designed to support your journey. Shop by intention, explore our crystal guide, or take the Crystal Quiz to find your perfect match.', {
          fontSize: 13, align: 'left', color: '#999999', lineHeight: 22, responsive: false
        })
      ])
    ]),

    // ===================== S15: Trust Guarantees ← Tiny Rituals + Moonrise Crystals =====================
    section({
      padding: rPadding('60', '10', '60', '10', {
        tablet: { t: '40', r: '10', b: '40', l: '10' },
        mobile: { t: '20', r: '5', b: '20', l: '5' }
      }),
      background_background: 'classic',
      background_color: '#111111',
      flex_direction: 'row',
      flex_align_items: 'stretch',
      flex_wrap: 'wrap',
      flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
    },
      TRUST_ITEMS.map(function(item) {
        return wrap({
          content_width: 'full',
          width: cardWidth4(),
          width_tablet: tabletWidth2(),
          width_mobile: mobileWidth100(),
          padding: { unit: 'px', top: '15', right: '10', bottom: '15', left: '10', isLinked: false }
        }, [
          iconBox(item.title, item.desc)
        ]);
      }).concat([
        // Fix: iconBox in dark section needs white text - handled via extra overrides below
      ])
    )

  ];
}

// ============================================================
// API
// ============================================================
function apiRequest(path, method, body) {
  return new Promise(function(resolve, reject) {
    var payload = typeof body === 'string' ? body : JSON.stringify(body);
    var options = {
      hostname: SITE, port: 443, path: path, method: method,
      headers: { 'Authorization': AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };
    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({ raw: data, status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('=== Homepage Upload (Elementor V3 + B1a 2C) ===\n');

  // Step 1: Create page
  console.log('1. Creating page...');
  var page = await apiRequest('/wp-json/wp/v2/pages', 'POST', {
    title: 'Homepage (B1a 2C)', status: 'draft', slug: 'homepage-b1a-2c', content: ''
  });
  var pageId = page.id;
  console.log('   Page ID: ' + pageId);

  // Step 2: Generate data
  console.log('2. Generating Elementor data...');
  var data = generateHomepage();
  var jsonStr = JSON.stringify(data);
  console.log('   JSON: ' + jsonStr.length + ' chars, ' + data.length + ' top sections');

  // Step 3: Validate
  console.log('3. Validation...');
  var totalContainers = 0, rowContainers = 0;
  function walk(elements) {
    elements.forEach(function(el) {
      if (el.elType === 'container') {
        totalContainers++;
        if (el.settings.flex_direction === 'row') {
          rowContainers++;
          var childCount = el.elements.length;
          var hasStructure = !!el.settings.structure;
          console.log('   ROW: ' + el.id + ', children=' + childCount + ', structure=' + (hasStructure ? el.settings.structure : 'none'));
        }
        if (el.elements && el.elements.length > 0) walk(el.elements);
      }
    });
  }
  walk(data);
  console.log('   Total containers: ' + totalContainers + ', Row containers: ' + rowContainers);

  // Step 4: Upload
  console.log('4. Injecting via context=edit...');
  var result = await apiRequest('/wp-json/wp/v2/pages/' + pageId + '?context=edit', 'POST', {
    title: 'Homepage (B1a 2C)', status: 'draft', content: '',
    meta: { _elementor_data: jsonStr, _elementor_edit_mode: 'builder', _elementor_template_type: 'wp-page' }
  });

  if (result.id) {
    console.log('\n   SUCCESS!');
    console.log('   URL: https://' + SITE + '/?page_id=' + pageId + '&preview=true');
    console.log('\n   Widget types used:');
    var types = {};
    (function collect(elements) {
      elements.forEach(function(el) {
        if (el.elType === 'widget') types[el.widgetType] = (types[el.widgetType] || 0) + 1;
        if (el.elements) collect(el.elements);
      });
    })(data);
    Object.keys(types).forEach(function(t) { console.log('     - ' + t + ' (' + types[t] + ')'); });
  } else {
    console.log('   FAILED: ' + JSON.stringify(result).slice(0, 500));
  }
}

main().catch(function(err) { console.error('Error:', err.message || err); process.exit(1); });
