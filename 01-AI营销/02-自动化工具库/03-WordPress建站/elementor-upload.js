/**
 * Homepage V3 - 关键修正：
 * 1. 所有多列布局用纯 Flexbox 模式（flex_direction: "row"），不用 structure
 * 2. Widget 以 Elementor 标准为主，WoodMart 仅用于 WooCommerce 场景
 * 3. 顶层 container 不设 content_width（默认 boxed）
 * 4. 嵌套 container 设 content_width: "full" + isInner: true
 *
 * Widget 选择策略：
 * - heading     → 标题（Elementor 标准）
 * - text-editor → 段落文字（Elementor 标准）
 * - image-box   → 图片+标题+描述卡片（Elementor Pro 标准）
 * - icon-box    → 图标+标题+描述（Elementor Pro 标准）
 * - image       → 纯图片（Elementor 标准）
 * - button      → 按钮（Elementor 标准）
 * - spacer      → 间距（Elementor 标准）
 * - social-icons→ 社交图标（Elementor 标准）
 * - form        → 表单（Elementor Pro 标准）
 * - wd_products_widget  → 产品网格（WoodMart，WooCommerce 必需）
 * - wd_products_tabs   → 产品标签页（WoodMart，WooCommerce 必需）
 */

const https = require('https');

// ============================================================
// 认证配置 — 从环境变量读取，不再硬编码
// 在项目根目录创建 .env 文件（已被 .gitignore 忽略）：
//   WP_SITE=goearthward.com
//   WP_USER=your_username
//   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
// 运行方式：node -r dotenv/config elementor-upload.js
// ============================================================
const SITE = process.env.WP_SITE || 'goearthward.com';
const AUTH = 'Basic ' + Buffer.from(
  (process.env.WP_USER || '') + ':' + (process.env.WP_APP_PASSWORD || '')
).toString('base64');

// ============================================================
// 工具函数
// ============================================================
function uid() {
  return Math.random().toString(16).slice(2, 9);
}

/**
 * 顶层容器（section）— 不设 content_width，默认 boxed
 * flex_direction 默认 column（垂直排列子元素）
 * 支持响应式 padding
 */
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

/**
 * 嵌套容器 — content_width: "full", isInner: true
 * 可通过 opts 覆盖 flex_direction 等属性
 */
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

/**
 * 响应式 padding 辅助
 * @param {string} t - desktop top
 * @param {string} r - desktop right
 * @param {string} b - desktop bottom
 * @param {string} l - desktop left
 * @param {object} overrides - {tablet: {t,r,b,l}, mobile: {t,r,b,l}}
 */
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

/**
 * heading widget（Elementor 标准标题）— 支持响应式字号
 */
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
  // 响应式字号（自动递减：desktop → tablet 75% → mobile 60%）
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

/**
 * text-editor widget（Elementor 标准富文本）— 支持响应式字号
 */
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
  // 响应式字号
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

/**
 * image widget（Elementor 标准图片）
 */
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

/**
 * image-box widget（Elementor Pro - 图片+标题+描述卡片）
 */
function imageBox(url, title, desc, linkUrl) {
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
      image_border_radius: { unit: 'px', size: 5, sizes: [] },
      hover_animation: 'pulse-shrink',
      scroll_y: -80,
      __globals__: { title_color: 'globals/colors?id=4616873' }
    },
    elements: [],
    widgetType: 'image-box'
  };
}

/**
 * icon-box widget（Elementor Pro - 图标特性卡片）
 */
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

/**
 * button widget（Elementor 标准）
 */
function buttonWidget(text, linkUrl) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      text: text,
      link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
      size: 'md',
      align: 'center',
      scroll_y: -80
    },
    elements: [],
    widgetType: 'button'
  };
}

/**
 * spacer widget（Elementor 标准间距）
 */
function spacer(size) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      spacer: size || '40'
    },
    elements: [],
    widgetType: 'spacer'
  };
}

/**
 * divider widget
 */
function divider() {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      style: 'solid',
      weight: { unit: 'px', size: 1, sizes: [] },
      color: '#e0e0e0',
      width: '100%',
      align: 'center',
      gap: { unit: 'px', size: 10, sizes: [] }
    },
    elements: [],
    widgetType: 'divider'
  };
}

/** WoodMart: wd_products_widget */
function wdProductsWidget(count) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      order: 'desc',
      scroll_y: -80,
      number: { unit: 'px', size: String(count || 4), sizes: [] }
    },
    elements: [],
    widgetType: 'wd_products_widget'
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
        { _id: uid(), image_size: 'custom', title: 'New', items_per_page: '6', pagination: 'arrows', columns: { size: '3' }, orderby: 'post__in' },
        { _id: uid(), image_size: 'custom', title: 'FEATURED', items_per_page: '6', pagination: 'arrows', columns: { size: '3' }, orderby: 'rand', query_type: 'AND', order: 'DESC' }
      ],
      scroll_y: -80,
      items_per_page: '6',
      pagination: 'arrows',
      columns: { unit: 'px', size: '3', sizes: [] }
    },
    elements: [],
    widgetType: 'wd_products_tabs'
  };
}

/**
 * 通用响应式网格布局(layout 原语之一:等分 N列M行)
 * 只管布局(列数/折行/gap/响应式 width),不碰 cell 内容。
 *
 * @param {Element[]|Element[][]} cells  内容单元;每项可是单元素,也可是元素数组(复合卡片)
 * @param {number|object} cols  列数;数字=desktop,或 {desktop,tablet,mobile}
 * @param {object} opts  {gap=15, alignItems, cellStyle}
 *   - cellStyle: 合并进每个 cell 的 width-wrap(如卡片背景/border),不额外加层
 *
 * 列宽查表 4→23 / 3→30 / 2→45 / 1→100(匹配 home 现有经验值,改用 grid 后 width 逐字段不变);
 * 其他列数 fallback 100/n。
 */
function grid(cells, cols, opts) {
  const o = opts || {};
  const c = typeof cols === 'number' ? { desktop: cols } : cols;
  const desk = c.desktop;
  const tab = c.tablet || Math.min(2, desk);
  const mob = c.mobile || 1;
  const gap = o.gap != null ? o.gap : 15;
  const widthByCols = function (n) {
    return ({ 4: 23, 3: 30, 2: 45, 1: 100 }[n]) || Math.floor(100 / n);
  };
  const settings = {
    content_width: 'full',
    flex_direction: 'row',
    flex_wrap: 'wrap',
    flex_gap: { size: gap, column: String(gap), row: String(gap), unit: 'px' }
  };
  if (o.alignItems) settings.flex_align_items = o.alignItems;
  const cellSettings = Object.assign({
    content_width: 'full',
    width: { unit: '%', size: widthByCols(desk), sizes: [] },
    width_tablet: { unit: '%', size: widthByCols(tab), sizes: [] },
    width_mobile: { unit: '%', size: widthByCols(mob), sizes: [] }
  }, o.cellStyle || {});
  return wrap(settings, cells.map(function (cell) {
    const inner = Array.isArray(cell) ? cell : [cell];
    return wrap(cellSettings, inner);
  }));
}

/**
 * 按钮行(layout 小原语) —— 居中横排按钮
 * home S1/S6 的按钮行模式: flex row + justify center + gap
 */
function buttonRow(buttons, opts) {
  const o = opts || {};
  const gap = o.gap != null ? o.gap : 15;
  return wrap({
    flex_direction: 'row',
    flex_justify_content: 'center',
    flex_gap: { size: gap, column: String(gap), row: String(gap), unit: 'px' }
  }, buttons);
}

// ============================================================
// 生成 Homepage
// ============================================================
function generateHomepage() {
  return [

    // ===================== Section 1: Hero =====================
    // 全屏背景图 + 居中标题 + 副标题 + 按钮
    section({
      padding: rPadding('150', '0', '150', '0', {
        tablet: { t: '100', r: '0', b: '100', l: '0' },
        mobile: { t: '80', r: '10', b: '80', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: 'https://goearthward.com/wp-content/uploads/2025/05/home.png',
        id: 16850, size: '',
        alt: 'Every Healing Crystal, A Companion for Your Heart',
        source: 'library'
      },
      background_position: 'center center',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#060000'
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Every <u>Healing Crystal</u>,', {
          color: '#FFFFFF', fontSize: 48, align: 'center',
          extra: {
            typography_font_size_tablet: { unit: 'px', size: 36, sizes: [] },
            typography_font_size_mobile: { unit: 'px', size: 28, sizes: [] }
          }
        }),
        heading('A Companion for Your Heart', {
          color: '#FFFFFF', fontSize: 36, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' },
            typography_font_size_tablet: { unit: 'px', size: 28, sizes: [] },
            typography_font_size_mobile: { unit: 'px', size: 22, sizes: [] }
          }
        }),
        textEditor('When Your Spirit Needs Support, Healing Crystals Offer Gentle Strength', {
          color: '#FFFFFF', fontSize: 18, align: 'center',
          extra: {
            _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' }
          }
        }),
        // 按钮行
        buttonRow([buttonWidget('SHOP JEWELRY', ''), buttonWidget('SHOP CRYSTALS', '')])
      ])
    ]),

    // ===================== Section 2: Trust Badges (4列→平板2x2→手机1列) =====================
    // 用 flex_wrap: 'wrap' 实现自动换行，手机端通过 width 控制
    section({
      padding: rPadding('60', '10', '60', '10', {
        mobile: { t: '20', r: '10', b: '20', l: '10' }
      })
    }, [
      // 4个卡片各占 ~25%，平板各 ~45%（2x2），手机各 ~100%（1列）
      // 卡片样式(背景/border/radius/padding)经 cellStyle 合并进 grid 的 width-wrap,不加层
      grid([
        iconBox('Peaceful Mind', 'Let crystals bring inner peace and harmony'),
        iconBox('Love Attraction', 'Open your heart chakra, attract true love'),
        iconBox('Dream Manifestation', 'Energy catalyst turning thoughts into reality'),
        iconBox('Spiritual Revival', 'Reconnect with your higher self and soul')
      ], { desktop: 4, tablet: 2, mobile: 1 }, {
        gap: 10,
        alignItems: 'stretch',
        cellStyle: {
          background_background: 'classic',
          background_color: '#EAEAEA',
          border_border: 'solid',
          border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
          border_radius: { unit: 'px', top: '10', right: '10', bottom: '10', left: '10', isLinked: true },
          padding: { unit: 'px', top: '20', right: '10', bottom: '20', left: '10', isLinked: false }
        }
      })
    ]),

    // ===================== Section 3: Products Area (2列) =====================
    // 左侧 banner+产品，右侧产品 tabs
    section({
      margin: { unit: 'px', top: '0', right: '0', bottom: '65', left: '0', isLinked: '' },
      margin_mobile: { unit: 'px', top: '0', right: '0', bottom: '25', left: '0', isLinked: '' },
      flex_direction: 'row',         // 关键：2列横排
      flex_align_items: 'stretch',
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      // 左侧 25%
      wrap({
        content_width: 'full',
        width: { size: '25', unit: '%' },
        hide_tablet: 'hidden-tablet',
        hide_mobile: 'hidden-phone',
        flex_direction: 'column',
        flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
      }, [
        // Banner 图片
        imageWidget('https://goearthward.com/wp-content/uploads/2023/03/StudioSession-18791-1.jpg', {
          id: 13754, alt: 'Crystals Meaning', radius: 8
        }),
        heading('FEATURED PRODUCTS', { fontSize: 20, color: '#333333',
          extra: {
            _margin: { unit: 'px', top: '20', right: '0', bottom: '10', left: '0', isLinked: '' },
            _padding: { unit: 'px', top: '15', left: '15', right: '15', bottom: '15', isLinked: '1' },
            _background_background: 'classic',
            _background_color: '#007bc4',
            title_color: '#FFFFFF'
          }
        }),
        wdProductsWidget(4)
      ]),

      // 右侧 75%
      wrap({
        content_width: 'full',
        width: { size: '75', unit: '%' },
        width_tablet: { size: '100', unit: '%' }
      }, [wdProductsTabs()])
    ]),

    // ===================== Section 4: Shop by Intention (4列x2行) =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      // 标题
      wrap({ content_width: 'boxed' }, [
        heading('Find Your Crystal Companion', { fontSize: 36 }),
        textEditor('Every Energy Resonates with a Heart', { fontSize: 18 })
      ]),

      // 第一行（4列→平板2列→手机1列）
      grid([
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home.jpeg', 'Love & Relationships', 'Connect deeply and attract harmonious relationships', 'https://goearthward.com/love-relationships/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-2.jpeg', 'Health & Vitality', 'Support your wellbeing and enhance natural energy', 'https://goearthward.com/health-vitality/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-3.jpeg', 'Abundance & Success', 'Attract prosperity and unlock your potential', 'https://goearthward.com/abundance-success/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-5.jpeg', 'Protection & Clearing', 'Shield your energy and cleanse negative influences', 'https://goearthward.com/protection-clearing/')
      ], { desktop: 4, tablet: 2, mobile: 1 }, { gap: 10 }),

      // 第二行（同样的响应式逻辑）
      grid([
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-4.jpeg', 'Calm & Mindfulness', 'Find inner peace and emotional balance', 'https://goearthward.com/calm-mindfulness/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-6.jpeg', 'Spiritual Connection', 'Elevate consciousness and deepen your spiritual journey', 'https://goearthward.com/spiritual-connection/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-7.jpeg', 'Transformation', 'Embrace change and welcome fresh opportunities', 'https://goearthward.com/transformation/'),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-8.jpeg', 'Personal Empowerment', 'Strengthen your resolve and amplify your inner power', 'https://goearthward.com/personal-empowerment/')
      ], { desktop: 4, tablet: 2, mobile: 1 }, { gap: 10 })
    ]),

    // ===================== Section 5: Testimonials (3列→平板2列→手机1列) =====================
    section({
      background_background: 'classic',
      background_color: '#fafafa',
      padding: rPadding('70', '10', '70', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '10', b: '30', l: '10' }
      })
    }, [
      heading('Testimonials', { fontSize: 40, color: '#333333' }),
      textEditor('What Our Customers Say', { fontSize: 16, color: '#888888' }),
      spacer(20),
      // 3列→平板2列→手机1列;每个 cell 是 [头像+名+评价] 复合,用数组直接摊进 width-wrap,不加层
      grid([
        [
          imageWidget('https://goearthward.com/wp-content/uploads/2025/05/cars-testimon-3.jpg', { radius: 50, width: 80 }),
          heading('Sarah M', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('My Moonstone bracelet accompanied me through the most confusing period of my life. It always brings me clear guidance and inspiration.', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ],
        [
          imageWidget('https://goearthward.com/wp-content/uploads/2025/05/fashion-testimon-1.jpg', { radius: 50, width: 80 }),
          heading('Michael T', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('Since placing a Citrine cluster on my desk, my business has improved significantly. Lucky Crystals truly changed my career path.', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ],
        [
          imageWidget('https://goearthward.com/wp-content/uploads/2025/05/cars-testimon-1.jpg', { radius: 50, width: 80 }),
          heading('Emma L', { fontSize: 18, align: 'center', color: '#333333' }),
          textEditor('My Black Obsidian bracelet is like my guardian angel. During an important meeting, touching the bracelet suddenly calmed me down.', {
            fontSize: 14, align: 'center',
            extra: { _padding: { unit: 'px', top: '0', right: '10', bottom: '0', left: '10', isLinked: '' } }
          })
        ]
      ], { desktop: 3, tablet: 2, mobile: 1 }, { gap: 20 })
    ]),

    // ===================== Section 6: CTA Banner =====================
    section({
      padding: rPadding('120', '10', '120', '10', {
        tablet: { t: '80', r: '10', b: '80', l: '10' },
        mobile: { t: '50', r: '10', b: '50', l: '10' }
      }),
      background_background: 'classic',
      background_image: {
        url: 'https://goearthward.com/wp-content/uploads/2025/05/homepage-light_2592x.webp',
        id: 16974, size: '', alt: '', source: 'library'
      },
      background_attachment: 'fixed',
      background_repeat: 'no-repeat',
      background_size: 'cover',
      background_overlay_background: 'classic',
      background_overlay_color: '#000000',
      background_overlay_opacity: { unit: 'px', size: 0.6, sizes: [] }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Transform Your Energy With Us', { color: '#FFFFFF', fontSize: 40 }),
        textEditor('Our mission is to help you raise your vibration with the power of crystal energy', {
          color: '#FFFFFF', fontSize: 18,
          extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '30', left: '0', isLinked: '' } }
        }),
        buttonRow([buttonWidget('SHOP JEWELRY', ''), buttonWidget('SHOP CRYSTALS', '')])
      ])
    ]),

    // ===================== Section 7: Quick Shop (4列) =====================
    section({
      padding: rPadding('80', '10', '80', '10', {
        tablet: { t: '50', r: '10', b: '50', l: '10' },
        mobile: { t: '30', r: '5', b: '30', l: '5' }
      }),
      flex_gap: { size: 15, column: '15', row: '15', unit: 'px' }
    }, [
      heading('Quick Shop', { fontSize: 36 }),
      textEditor('Explore Our Crystal Collections', { fontSize: 18 }),
      spacer(10),
      // 4列→平板2列→手机1列
      grid([
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-9.jpeg', 'Starter Kits', 'Curated Sets for Your First Steps', ''),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-10.jpeg', 'By Intention', 'Find the Perfect Crystal for Your Intention', ''),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home.jpeg', 'Best Sellers', 'Our Most Loved Crystal Bracelets', ''),
        imageBox('https://goearthward.com/wp-content/uploads/2025/05/home-2.jpeg', 'New Arrivals', 'Fresh Crystal Treasures Just Added', '')
      ], { desktop: 4, tablet: 2, mobile: 1 }, { gap: 10 })
    ]),

    // ===================== Section 8: Newsletter (深色底部) =====================
    section({
      background_background: 'classic',
      background_color: '#111111',
      padding: rPadding('60', '20', '60', '20', {
        mobile: { t: '40', r: '15', b: '40', l: '15' }
      }),
      flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Stay Connected', { color: '#FFFFFF', fontSize: 28 }),
        textEditor('Join our community for crystal tips, exclusive offers, and new arrivals', {
          color: '#CCCCCC', fontSize: 16,
          extra: { _margin: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' } }
        })
      ])
    ])
  ];
}

// ============================================================
// API
// ============================================================
function apiRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const options = {
      hostname: SITE, port: 443, path: path, method: method,
      headers: { 'Authorization': AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { resolve({ raw: data, status: res.statusCode }); } });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('=== Homepage V3 Upload (Flexbox Layout + Standard Widgets) ===\n');

  // Step 1: Create page
  console.log('1. Creating page...');
  const page = await apiRequest('/wp-json/wp/v2/pages', 'POST', {
    title: 'Homepage (AI V3)', status: 'draft', slug: 'homepage-ai-v3', content: ''
  });
  const pageId = page.id;
  console.log('   Page ID: ' + pageId);

  // Step 2: Generate data
  console.log('2. Generating Elementor data...');
  const data = generateHomepage();
  const jsonStr = JSON.stringify(data);
  console.log('   JSON: ' + jsonStr.length + ' chars, ' + data.length + ' top sections');

  // Step 3: Validate
  console.log('3. Validation...');
  let totalContainers = 0, rowContainers = 0;
  function walk(elements) {
    elements.forEach(el => {
      if (el.elType === 'container') {
        totalContainers++;
        if (el.settings.flex_direction === 'row') {
          rowContainers++;
          const childCount = el.elements.length;
          const hasStructure = !!el.settings.structure;
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
  const result = await apiRequest('/wp-json/wp/v2/pages/' + pageId + '?context=edit', 'POST', {
    title: 'Homepage (AI V3)', status: 'draft', content: '',
    meta: { _elementor_data: jsonStr, _elementor_edit_mode: 'builder', _elementor_template_type: 'wp-page' }
  });

  if (result.id) {
    console.log('\n   SUCCESS!');
    console.log('   URL: https://' + SITE + '/?page_id=' + pageId + '&preview=true');
    console.log('\n   Widget types used:');
    const types = new Set();
    (function collect(elements) {
      elements.forEach(el => { if (el.elType === 'widget') types.add(el.widgetType); if (el.elements) collect(el.elements); });
    })(data);
    types.forEach(t => console.log('     - ' + t));
  } else {
    console.log('   FAILED: ' + JSON.stringify(result).slice(0, 500));
  }
}

// 直接运行才上传;被 require 时不触发(供 verify/其他页面脚本复用积木与布局函数)
if (require.main === module) {
  main().catch(err => { console.error('Error:', err.message || err); process.exit(1); });
}

module.exports = {
  section, wrap, rPadding, heading, textEditor, imageWidget, imageBox, iconBox,
  buttonWidget, spacer, divider, wdProductsWidget, wdProductsTabs, grid, buttonRow,
  generateHomepage, apiRequest, main
};
