/**
 * Homepage — Elementor V3 (Flexbox) + B1a 2C执行版
 *
 * 基于 16-Section 布局方案（页面布局方案.md Section 1）
 * 竞品参考: Energy Muse(首页结构) + Conscious Items(转化设计) + Tiny Rituals(电商导航) + Moonrise Crystals(品牌信任)
 *
 * Elementor V3 说明：所有多列布局用纯 Flexbox 模式（flex_direction: "row"），不用 structure
 *
 * Section Map (S1公告栏+S16 Footer 由主题处理):
 *  S2  Hero Banner       ← brand positioning + guide/product-category入口
 *  S3  Trust Score Bar   ← Tiny Rituals + Conscious Items
 *  S4  Shop by Intention ← 6个核心意图入口
 *  S5  Product Browse    ← WooCommerce产品网格
 *  S6  Guide Entry       ← B1a可兑现入口
 *  S7  Shop by Stone     ← Tiny Rituals + Crystal Vaults诗意命名 (16水晶)
 *  S8  Comparison Table  ← Conscious Items "Why Choose Us"
 *  S9  Brand Story       ← Earthward品牌预览
 *  S10 Use Cases         ← everyday intention scenarios
 *  S11 FAQ               ← Conscious Items (6-FAQ手风琴)
 *  S12 Guide Preview     ← Crystal Guide入口
 *  S13 Launch CTA        ← guide入口
 *  S14 SEO Content       ← Tiny Rituals
 *  S15 Trust Signals     ← 可兑现信任信号
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
const fs = require('fs');
const os = require('os');
const IMAGES = require('../assets/site-images');

// ============================================================
// 加载全局凭证 — C:\Users\Dylan\.env（或 HOME/.env）
// ============================================================
(function loadGlobalEnv() {
  var envPaths = [
    path.join(os.homedir(), '.env'),
    path.join('D:', '.env')
  ];
  for (var i = 0; i < envPaths.length; i++) {
    try {
      var content = fs.readFileSync(envPaths[i], 'utf-8');
      content.split('\n').forEach(function(line) {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        var eq = line.indexOf('=');
        if (eq < 1) return;
        var key = line.slice(0, eq).trim();
        if (!process.env[key]) { process.env[key] = line.slice(eq + 1).trim(); }
      });
      break;
    } catch (e) { /* skip */ }
  }
})();

// ============================================================
// 认证配置 — 优先环境变量（已含全局 .env），fallback 到项目 config
// ============================================================
let _creds = { wp_username: '', wp_app_password: '' };
try {
  _creds = require(path.resolve(__dirname, '../../config/api-credentials.json'));
} catch (e) { /* fallback to env only */ }

const SITE = process.env.WP_SITE || 'goearthward.com';
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
    header_size: o.headerSize || 'h2',
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
    settings.typography_font_size_tablet = { unit: 'px', size: Math.max(22, Math.round(fs * 0.85)), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.max(20, Math.round(fs * 0.75)), sizes: [] };
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
  const editorHtml = '<p>' + content + '</p>';
  const settings = {
    editor: editorHtml,
    editor_content: editorHtml,
    align: o.align || 'center',
    text_color: o.color || '#666666',
    typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fs, sizes: [] },
    typography_line_height: { unit: 'px', size: o.lineHeight || 26, sizes: [] },
    _element_width: o.width || 'initial',
    scroll_y: -80
  };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.max(16, Math.round(fs * 0.9)), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.max(16, Math.round(fs * 0.85)), sizes: [] };
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
      title_typography_typography: 'custom',
      title_typography_font_size: { unit: 'px', size: 18, sizes: [] },
      title_typography_font_size_tablet: { unit: 'px', size: 18, sizes: [] },
      title_typography_font_size_mobile: { unit: 'px', size: 16, sizes: [] },
      description_typography_typography: 'custom',
      description_typography_font_size: { unit: 'px', size: 16, sizes: [] },
      description_typography_font_size_tablet: { unit: 'px', size: 16, sizes: [] },
      description_typography_font_size_mobile: { unit: 'px', size: 16, sizes: [] },
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

/** shortcode widget（嵌 WooCommerce 动态组件，如 [product_categories]） */
function shortcodeWidget(shortcode) {
  return {
    id: uid(),
    elType: 'widget',
    settings: { shortcode: shortcode, scroll_y: -80 },
    elements: [],
    widgetType: 'shortcode'
  };
}

/** icon-box widget（图标+标题+描述） */
function iconBox(title, desc) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      selected_icon: { value: 'eicon-check-circle', library: 'eicons' },
      title_text: title,
      description_text: desc,
      text_align: 'center',
      icon_space: { unit: 'px', size: 10, sizes: [] },
      title_bottom_space: { unit: 'px', size: 10, sizes: [] },
      title_typography_typography: 'custom',
      title_typography_font_size: { unit: 'px', size: 18, sizes: [] },
      title_typography_font_size_tablet: { unit: 'px', size: 18, sizes: [] },
      title_typography_font_size_mobile: { unit: 'px', size: 16, sizes: [] },
      description_typography_typography: 'custom',
      description_typography_font_size: { unit: 'px', size: 16, sizes: [] },
      description_typography_font_size_tablet: { unit: 'px', size: 16, sizes: [] },
      description_typography_font_size_mobile: { unit: 'px', size: 16, sizes: [] },
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
      title: 'Crystal Bracelets',
      design: 'simple',
      color: '#007bc4',
      tabs_items: [
        { _id: uid(), image_size: 'custom', title: 'New', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'post__in' },
        { _id: uid(), image_size: 'custom', title: 'Featured', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'rand', query_type: 'AND', order: 'DESC' }
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
  { key: 'clearQuartz',     name: 'Clear Quartz',     poetic: 'The Clarity Stone',           slug: 'clear-quartz-crystals' },
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
  { name: 'Calm & Steady Days',      desc: 'Stones like amethyst are traditionally used to quiet the mind — a gentle reminder to slow down and let the day settle', slug: 'calm-mindfulness', img: 'amethyst', homeImg: 'intentionCalm' },
  { name: 'Love & Connection',       desc: 'Rose quartz has symbolized compassion for centuries, carried as a daily prompt to treat yourself and others with kindness', slug: 'love-relationships', img: 'roseQuartz', homeImg: 'intentionLove' },
  { name: 'Abundance & Success',     desc: 'Set intentions around growth with citrine, long associated with warmth, vitality, and new opportunity', slug: 'abundance-success', img: 'citrine', homeImg: 'intentionAbundance' },
  { name: 'Protection & Grounding',  desc: 'Stay grounded with protective stones like black tourmaline, used across traditions as a steadying anchor in busy days', slug: 'protection-clearing', img: 'blackTourmaline', homeImg: 'intentionGrounding' },
  { name: 'Sleep & Evening Ritual',  desc: 'Ease into rest with moonstone and similar stones traditionally paired with calming evening routines', slug: 'health-vitality', img: 'moonstone', homeImg: 'intentionSleep' },
  { name: 'Focus & Clarity',         desc: 'Choose stones traditionally linked to clear thinking and steady, focused attention when it matters most', slug: 'personal-empowerment', img: 'fluorite', homeImg: 'intentionFocus' }
];

/** S11 FAQ — 6个核心问题 ← Conscious Items */
var FAQ_ITEMS = [
  { q: 'Are your crystals real?', a: 'We prioritize genuine natural gemstones and do not sell glass or synthetic materials as natural crystals. Each bracelet is hand-selected and visually inspected for quality, color, and material consistency. If a design includes a treated, man-made, or decorative accent material, we label it clearly.' },
  { q: 'How are crystals prepared before shipping?', a: 'Every bracelet is inspected, prepared with care, and packed with simple guidance for setting your own intention. We use neutral, low-drama preparation practices such as selenite-based resting and careful handling.' },
  { q: 'Do crystal bracelets actually work?', a: 'Crystal bracelets are not medical tools and cannot promise a specific result. Many people use them as tactile reminders for intentions such as calm, love, or focus, similar to how a journal, ring, or ritual object can support a mindfulness practice.' },
  { q: 'What\'s included in my order?', a: 'Every order includes your crystal bracelet in a premium velvet pouch, an intention guide card with traditional meaning and care notes, and practical instructions for wearing and storing your piece. Orders over $75 receive free shipping.' },
  { q: 'How do I choose the right crystal?', a: 'Start with your current intention, then browse by stone or read the crystal guide before choosing a bracelet. The goal is not to find a perfect answer, but to choose a piece whose meaning feels useful in your daily life.' },
  { q: 'What\'s your return policy?', a: 'We offer a 30-day worry-free return policy. If your crystal doesn\'t feel like the right match, simply send it back within 30 days for a full refund — no questions asked.' }
];

/** S8 Comparison — 6个对比维度 ← Conscious Items */
var COMPARISON = [
  { ours: 'Genuine Natural Crystals', theirs: 'Dyed or synthetic stones' },
  { ours: 'Prepared with care', theirs: 'Shipped without any preparation' },
  { ours: 'Origin and handling notes where available', theirs: 'Little sourcing context' },
  { ours: 'Intention guide card included', theirs: 'No information provided' },
  { ours: 'Premium velvet pouch packaging', theirs: 'Plastic bag packaging' },
  { ours: '30-day worry-free returns', theirs: 'No returns accepted' }
];

/** S15 Trust Signals — 可兑现信任信号 */
var TRUST_ITEMS = [
  { title: 'Genuine Crystals',       desc: 'Hand-selected and visually inspected' },
  { title: 'Prepared With Care',     desc: 'Cleansed, inspected, intention guide included' },
  { title: 'Free Shipping $95+',     desc: 'Tracked delivery on US orders over $95' },
  { title: '30-Day Returns',         desc: 'Not the right fit? Return within 30 days' }
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

    // ===================== S2: Hero Banner =====================
    section({
      padding: rPadding('150', '0', '150', '0', {
        tablet: { t: '100', r: '0', b: '100', l: '0' },
        mobile: { t: '80', r: '10', b: '80', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.home.hero.url,
        id: 0, size: '',
        alt: IMAGES.home.hero.alt,
        source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#060000'
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Real Crystals for <u>Intentional Living</u>', {
          headerSize: 'h1', color: '#FFFFFF', fontSize: 50, align: 'center',
          extra: {
            typography_font_size_tablet: { unit: 'px', size: 45, sizes: [] },
            typography_font_size_mobile: { unit: 'px', size: 40, sizes: [] }
          }
        }),
        textEditor('Genuine natural crystal bracelets, individually inspected and prepared with care. Each piece comes with a guide card to its traditional meaning and everyday use. Return to what\'s real.', {
          color: '#FFFFFF', fontSize: 20, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
          }
        }),
        wrap({ flex_direction: 'row', flex_justify_content: 'center', flex_gap: { size: 15, column: '15', row: '15', unit: 'px' } }, [
          buttonWidget('SHOP CRYSTAL BRACELETS', '/shop/', { size: 'lg' }),
          buttonWidget('BROWSE BY INTENTION', '/calm-mindfulness/', { size: 'lg' })
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
      // 4 trust metrics — no fabricated numbers
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('Genuine Natural Crystals', 'Hand-selected and visually inspected')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('Sourcing With Context', 'Origin and handling notes are reviewed wherever suppliers can provide them')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('Cleansed & Guide Card Included', 'Ready for your intention from day one')
      ]),
      wrap({ content_width: 'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
        iconBox('30-Day Worry-Free Returns', 'No questions asked')
      ])
    ]),

    // ===================== S4: Shop by Intention =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('What Intention Fits Today?', { fontSize: 35 }),
        textEditor('Start with the feeling, habit, or reminder you want to carry', { fontSize: 20, color: '#888888' })
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
            width: { unit: '%', size: 22, sizes: [] },
            width_tablet: tabletWidth2(),
            width_mobile: mobileWidth100()
          }, [
            imageBox(
              IMAGES.home[intent.homeImg].url,
              intent.name,
              intent.desc,
              '/' + intent.slug + '/'
            )
          ]);
        })
      )
    ]),

    // ===================== S5: Product Browse =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Explore Crystal Bracelets', { fontSize: 35 }),
        textEditor('A simple starting point for browsing current Earthward pieces', { fontSize: 20, color: '#888888' })
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
        imageWidget(IMAGES.home.quiz.url, {
          id: 0, alt: IMAGES.home.quiz.alt, radius: 12
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
        heading('Not Sure Where to Start?', { fontSize: 35, align: 'left' }),
        textEditor('Use the guide paths that are ready now: browse by intention, explore by stone, or read the crystal meaning index before choosing a bracelet.', {
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
            iconBox('Browse by Intention', 'Start with calm, love, abundance, grounding, sleep, or focus')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Shop by Stone', 'Choose directly from familiar crystals such as Amethyst or Rose Quartz')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Crystal Guide A-Z', 'Read traditional meanings before you buy')
          ]),
          wrap({ content_width: 'full', width: { unit: '%', size: 47, sizes: [] }, width_mobile: mobileWidth100() }, [
            iconBox('Our Sourcing Approach', 'See how Earthward thinks about origin, care, and realistic expectations')
          ])
        ]),
        buttonWidget('EXPLORE THE GUIDE', '/gemstones/', { size: 'lg', align: 'left' })
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
        heading('Shop by Crystal', { fontSize: 35 }),
        textEditor('Browse genuine crystals by stone — categories update live from our inventory', { fontSize: 20, color: '#888888' })
      ]),
      shortcodeWidget('[product_categories parent="981" number="16" columns="4" hide_empty="1" orderby="count" order="DESC"]')
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
        heading('Why Choose Earthward?', { fontSize: 35 }),
        textEditor('What sets a careful crystal bracelet experience apart from anonymous marketplace listings', { fontSize: 20, color: '#888888' })
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

    // S9 Brand Story 已删（品牌故事压缩到 About Us，home 不重复）

    // ===================== S10: How People Use Their Crystals ← Use-case scenarios =====================
    section({
      padding: rPadding('70', '10', '70', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_color: '#fafafa'
    }, [
      heading('How People Use Their Crystals', { fontSize: 35, color: '#333333' }),
      textEditor('Real moments where a crystal bracelet became part of everyday intention', { fontSize: 16, color: '#888888' }),
      spacer(20),
      wrap({ flex_direction: 'row', flex_wrap: 'wrap', flex_gap: { size: 20, column: '20', row: '20', unit: 'px' } }, [
        // Scenario 1
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useCalm.url, { alt: IMAGES.home.useCalm.alt, radius: 50, width: 60 }),
          heading('For Calm Evenings', { headerSize: 'h3', fontSize: 22, align: 'center', color: '#333333' }),
          textEditor('A common Amethyst ritual is to keep the bracelet on a nightstand and touch it before bed as a reminder to let the day settle.', {
            fontSize: 16, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          }),
          buttonWidget('SHOP AMETHYST', '/product-category/amethyst-crystals/', { size: 'sm', align: 'center' })
        ]),
        // Scenario 2
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useWorkday.url, { alt: IMAGES.home.useWorkday.alt, radius: 50, width: 60 }),
          heading('For Stressful Workdays', { headerSize: 'h3', fontSize: 22, align: 'center', color: '#333333' }),
          textEditor('Black Tourmaline is often chosen as a workday grounding cue: a small physical reminder to pause, breathe, and reset.', {
            fontSize: 16, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          }),
          buttonWidget('SHOP BLACK TOURMALINE', '/product-category/black-tourmaline-crystals/', { size: 'sm', align: 'center' })
        ]),
        // Scenario 3
        wrap({ content_width: 'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useCompassion.url, { alt: IMAGES.home.useCompassion.alt, radius: 50, width: 60 }),
          heading('For Self-Compassion', { headerSize: 'h3', fontSize: 22, align: 'center', color: '#333333' }),
          textEditor('Rose Quartz is a popular choice for people navigating transitions. Wearing it can serve as a gentle daily prompt to be kinder to yourself.', {
            fontSize: 16, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          }),
          buttonWidget('SHOP ROSE QUARTZ', '/product-category/rose-quartz-crystals/', { size: 'sm', align: 'center' })
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
        heading('Common Questions', { fontSize: 35 }),
        textEditor('Everything you need to know about our crystal bracelets', { fontSize: 20, color: '#888888' })
      ]),
      wrap({ content_width: 'boxed' }, [
        accordionWidget(FAQ_ITEMS)
      ])
    ]),

    // S12 Crystal Guide Preview 已删（移到 /gemstones/ Guide 页，home 不重复）

    // ===================== S13: Launch CTA =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: IMAGES.home.newsletter.url,
        id: 0, size: '', alt: IMAGES.home.newsletter.alt, source: 'library'
      },
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#000000',
      background_overlay_opacity: { unit: 'px', size: 0.7, sizes: [] }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Choose Something Real to Carry', { color: '#FFFFFF', fontSize: 35 }),
        textEditor('Begin with a stone, an intention, or the guide path that helps you make a grounded choice. Go Earthward. Return to what\'s real.', {
          color: '#CCCCCC', fontSize: 16,
          extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' } }
        }),
        buttonWidget('EXPLORE CRYSTAL GUIDE', '/gemstones/')
      ])
    ]),

    // S14 SEO Content Block 已删（SEO 关键词移到 Rank Math meta description）
    // S15 Trust Signals 已删（与 S3 重复）

  ];
}

// ============================================================
// API
// ============================================================
function apiRequest(path, method, body) {
  return new Promise(function(resolve, reject) {
    var payload = body === undefined ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
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
  var mode = process.argv[2];
  var HOME_PAGE_ID = 42428;
  if (mode === 'replace') {
    var dataR = generateHomepage();
    var jsonStrR = JSON.stringify(dataR);
    console.log('Replacing home page id=' + HOME_PAGE_ID + ' (' + dataR.length + ' sections, ' + jsonStrR.length + ' chars)');
    var resultR = await apiRequest('/wp-json/wp/v2/pages/' + HOME_PAGE_ID + '?context=edit', 'POST', {
      title: 'Home', status: 'publish', content: '',
      meta: { _elementor_data: jsonStrR, _elementor_edit_mode: 'builder', _elementor_template_type: 'wp-page' }
    });
    if (resultR && resultR.id) console.log('REPLACED & PUBLISHED: https://goearthward.com/');
    else { console.error('FAILED: ' + JSON.stringify(resultR).slice(0, 500)); process.exit(1); }
    return;
  }
  console.log('=== Homepage Upload (Elementor V3 + B1a 2C) ===\n');

  // Step 1: 每次创建新版本 page（V3/V4...），content 空 + 新 _data
  // 避免 REST 改老 page 的 _data 但 post_content(Elementor渲染缓存)不同步的问题
  console.log('1. Creating NEW version page (home-v12)...');
  var page = await apiRequest('/wp-json/wp/v2/pages', 'POST', {
    title: 'Homepage', status: 'draft', slug: 'home-v12', content: ''
  });
  var pageId = page.id;
  console.log('   Created home-v12: ' + pageId);

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
    title: 'Homepage', status: 'publish', content: '',
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
