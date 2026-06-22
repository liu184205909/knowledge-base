/**
 * Homepage V2 — 基于文档 4 标尺优化的 Elementor JSON 生成器
 *
 * 4 标尺（对照 品牌语调配置.md / 页面布局方案.md / 00-项目简报.md）：
 *  1. 合规(§4/§5)：保留 home.js 已合规的文案（无虚构数据/能量治愈话术）
 *  2. 新色调(§0.1)：标题 Deep Ink #1A1A2E、浅背景 Pale Green #F0F7F4、CTA Primary Green #2D6A4F
 *  3. 品牌叙事(§0)：Earthward = "Return to what's real"（沿用 home.js 已写好的哲学段）
 *  4. 品类通用化(简报产品线边界)：bracelet → crystal jewelry/pieces；URL 对齐线上真实页面
 *
 * 与 home.js 的差异：仅改配色常量 + 文案(bracelet→通用) + URL(对齐线上)，结构/widget 沿用已验证版本。
 * 产出：运行后写 home-v2.json（Elementor _elementor_data 数组），可用 REST meta 覆盖 page-id-7535。
 */

const fs = require('fs');
const path = require('path');
const IMAGES = require('../assets/site-images');

// ============================================================
// 品牌色（品牌语调配置.md §0.1 权威源）
// ============================================================
const COLOR = {
  green:      '#2D6A4F', // Primary Green — 主按钮、强调
  deepGreen:  '#1B4332', // Deep Green — 深色 section
  softGreen:  '#95D5B2', // Soft Green — 轻量强调
  paleGreen:  '#F0F7F4', // Pale Green — 浅背景
  deepInk:    '#1A1A2E', // Deep Ink — 标题
  body:       '#444444', // 正文
  secondary:  '#666666', // 次要
  muted:      '#888888', // 弱化
  surface:    '#F8F8F8', // 卡片
  white:      '#FFFFFF'
};

// ============================================================
// 工具函数（沿用 home.js 已验证实现）
// ============================================================
function uid() { return Math.random().toString(16).slice(2, 9); }

/** 清掉图片 alt 里的 bracelet→piece（品类通用化，§简报产品线边界） */
function cleanAlt(s) { return (s || '').replace(/\bbracelets\b/gi, 'pieces').replace(/\bbracelet\b/gi, 'piece'); }

function section(settings, elements) {
  return { id: uid(), elType: 'container',
    settings: Object.assign({ wd_section_stretch: 'stretch', scroll_y: -80, flex_direction: 'column' }, settings),
    elements: elements, isInner: false };
}
function wrap(settings, elements) {
  return { id: uid(), elType: 'container',
    settings: Object.assign({ content_width: 'full', scroll_y: -80 }, settings),
    elements: elements, isInner: true };
}
function rPadding(t, r, b, l, overrides) {
  const pad = { unit: 'px', top: t, right: r, bottom: b, left: l, isLinked: '' };
  if (overrides && overrides.tablet) { const tb = overrides.tablet; pad.padding_tablet = { unit: 'px', top: tb.t||t, right: tb.r||r, bottom: tb.b||b, left: tb.l||l, isLinked: '' }; }
  if (overrides && overrides.mobile) { const mb = overrides.mobile; pad.padding_mobile = { unit: 'px', top: mb.t||t, right: mb.r||r, bottom: mb.b||b, left: mb.l||l, isLinked: '' }; }
  return pad;
}
function heading(title, opts) {
  const o = opts || {}; const fsz = o.fontSize || 32;
  const settings = { title, align: o.align || 'center', title_color: o.color || COLOR.deepInk,
    typography_typography: 'custom', typography_font_size: { unit: 'px', size: fsz, sizes: [] },
    typography_font_weight: o.fontWeight || '700', _element_width: o.width || 'initial',
    _element_vertical_alignment: o.vAlign || '',
    _padding: o.padding || { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }, scroll_y: -80 };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.round(fsz * 0.75), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.round(fsz * 0.6), sizes: [] };
  }
  return { id: uid(), elType: 'widget', settings: Object.assign(settings, o.extra || {}), elements: [], widgetType: 'heading' };
}
function textEditor(content, opts) {
  const o = opts || {}; const fsz = o.fontSize || 16;
  const settings = { editor_content: '<p>' + content + '</p>', align: o.align || 'center',
    text_color: o.color || COLOR.secondary, typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fsz, sizes: [] },
    typography_line_height: { unit: 'px', size: o.lineHeight || 26, sizes: [] },
    _element_width: o.width || 'initial', scroll_y: -80 };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.max(14, Math.round(fsz * 0.9)), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.max(13, Math.round(fsz * 0.85)), sizes: [] };
  }
  return { id: uid(), elType: 'widget', settings: Object.assign(settings, o.extra || {}), elements: [], widgetType: 'text-editor' };
}
function imageWidget(url, opts) {
  const o = opts || {};
  return { id: uid(), elType: 'widget', settings: {
    image: { url, id: o.id || 0, alt: cleanAlt(o.alt || ''), source: 'library', size: '' },
    image_size: o.imageSize || 'full', align: o.align || 'center',
    width: o.width ? { unit: '%', size: o.width, sizes: [] } : { unit: '%', size: 100, sizes: [] },
    image_border_radius: o.radius ? { unit: 'px', size: o.radius, sizes: [] } : { unit: 'px', size: 5, sizes: [] },
    scroll_y: -80 }, elements: [], widgetType: 'image' };
}
function imageBox(url, title, desc, linkUrl, opts) {
  const o = opts || {};
  return { id: uid(), elType: 'widget', settings: {
    image: { url, id: 0, size: '', source: 'library' }, title_text: title, description_text: desc,
    link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
    title_bottom_space: { unit: 'px', size: 10, sizes: [] }, image_size: { unit: '%', size: 100, sizes: [] },
    image_border_radius: o.radius ? { unit: '%', size: o.radius, sizes: [] } : { unit: 'px', size: 5, sizes: [] },
    hover_animation: 'pulse-shrink', scroll_y: -80,
    __globals__: { title_color: 'globals/colors?id=4616873' } }, elements: [], widgetType: 'image-box' };
}
function iconBox(title, desc) {
  return { id: uid(), elType: 'widget', settings: {
    selected_icon: { value: '', library: '' }, title_text: title, description_text: desc, text_align: 'center',
    icon_space: { unit: 'px', size: 10, sizes: [] }, title_bottom_space: { unit: 'px', size: 10, sizes: [] },
    title_typography_typography: 'custom', scroll_y: -80,
    __globals__: { title_color: 'globals/colors?id=4616873' } }, elements: [], widgetType: 'icon-box' };
}
function buttonWidget(text, linkUrl, opts) {
  const o = opts || {};
  const settings = { text, link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
    size: o.size || 'md', align: o.align || 'center', scroll_y: -80 };
  // 新色调：CTA 套 Primary Green
  if (o.background) {
    settings.background_background = 'classic';
    settings.background_color = o.background;
    settings.text_color = o.text || COLOR.white;
    settings.border_radius = { unit: 'px', top: '4', right: '4', bottom: '4', left: '4', isLinked: true };
    settings.typography_typography = 'custom';
    settings.typography_font_weight = '700';
  }
  return { id: uid(), elType: 'widget', settings, elements: [], widgetType: 'button' };
}
function spacer(size) {
  return { id: uid(), elType: 'widget', settings: { spacer: size || '40' }, elements: [], widgetType: 'spacer' };
}
function accordionWidget(items) {
  return { id: uid(), elType: 'widget', settings: {
    tabs: items.map(function(item){ return { _id: uid(), tab_title: item.q, tab_content: '<p>' + item.a + '</p>' }; }),
    scroll_y: -80 }, elements: [], widgetType: 'accordion' };
}
function wdProductsTabs() {
  return { id: uid(), elType: 'widget', settings: {
    title: 'Crystal Jewelry', design: 'simple', color: COLOR.green,
    tabs_items: [
      { _id: uid(), image_size: 'custom', title: 'New', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'post__in' },
      { _id: uid(), image_size: 'custom', title: 'Featured', items_per_page: '8', pagination: 'arrows', columns: { size: '4' }, orderby: 'rand', query_type: 'AND', order: 'DESC' }
    ],
    scroll_y: -80, items_per_page: '8', pagination: 'arrows', columns: { unit: 'px', size: '4', sizes: [] }
  }, elements: [], widgetType: 'wd_products_tabs' };
}

// ============================================================
// 数据常量（4 标尺优化：bracelet→通用，URL 对齐线上）
// ============================================================

/** S7 Shop by Stone — 16 种水晶，slug 对齐线上 /crystals-stones/by-stone/{slug}-crystals/ */
const CRYSTALS = [
  { key:'amethyst',        name:'Amethyst',         poetic:'The Stone of Peace' },
  { key:'roseQuartz',      name:'Rose Quartz',      poetic:'The Stone of Love' },
  { key:'citrine',         name:'Citrine',          poetic:'The Stone of Abundance' },
  { key:'blackTourmaline', name:'Black Tourmaline', poetic:'The Shield Stone' },
  { key:'clearQuartz',     name:'Clear Quartz',     poetic:'The Clarity Stone' },
  { key:'tigerEye',        name:'Tiger Eye',        poetic:'The Stone of Courage' },
  { key:'moonstone',       name:'Moonstone',        poetic:'The Stone of New Beginnings' },
  { key:'obsidian',        name:'Obsidian',         poetic:'The Mirror Stone' },
  { key:'lepidolite',      name:'Lepidolite',       poetic:'The Stone of Transition' },
  { key:'selenite',        name:'Selenite',         poetic:'The Stone of Clarity' },
  { key:'greenAventurine', name:'Green Aventurine', poetic:'The Stone of Luck' },
  { key:'fluorite',        name:'Fluorite',         poetic:'The Stone of Focus' },
  { key:'howlite',         name:'Carnelian',        poetic:'The Stone of Motivation' },
  { key:'rhodonite',       name:'Rhodonite',        poetic:'The Stone of Compassion' },
  { key:'malachite',       name:'Malachite',        poetic:'The Stone of Transformation' },
  { key:'hematite',        name:'Hematite',         poetic:'The Grounding Stone' }
];
// slug 精确映射线上真实 URL（线上是 rainbow-fluorite / rainbow-moonstone / aventurine；howlite 不存在→换 Carnelian）
const STONE_SLUG = { 'Amethyst':'amethyst','Rose Quartz':'rose-quartz','Citrine':'citrine','Black Tourmaline':'black-tourmaline','Clear Quartz':'clear-quartz','Tiger Eye':'tiger-eye','Moonstone':'rainbow-moonstone','Obsidian':'obsidian','Lepidolite':'lepidolite','Selenite':'selenite','Green Aventurine':'aventurine','Fluorite':'rainbow-fluorite','Carnelian':'carnelian','Rhodonite':'rhodonite','Malachite':'malachite','Hematite':'hematite' };
function stoneLink(name) {
  const s = STONE_SLUG[name] || name.toLowerCase().replace(/\s+/g, '-');
  return 'https://goearthward.com/crystals-stones/by-stone/' + s + '-crystals/';
}

/** S4 Shop by Intention — 对齐线上 8 个真实意图页（取 6 个高频） */
const INTENTIONS = [
  { name:'Calm & Mindfulness',     desc:'Build a simple ritual for steadier days',         slug:'calm-mindfulness',        homeImg:'intentionCalm' },
  { name:'Love & Relationships',   desc:'Practice tenderness toward yourself and others',  slug:'love-relationships',      homeImg:'intentionLove' },
  { name:'Abundance & Success',    desc:'Set intentions around abundance and success',     slug:'abundance-success',       homeImg:'intentionAbundance' },
  { name:'Protection & Clearing',  desc:'Create a tangible cue for steadiness',            slug:'protection-clearing',     homeImg:'intentionGrounding' },
  { name:'Spiritual Connection',   desc:'Mark space for reflection and inner focus',       slug:'spiritual-connection',    homeImg:'intentionSleep' },
  { name:'Health & Vitality',      desc:'Choose a daily reminder for steadier energy',     slug:'health-vitality',         homeImg:'intentionFocus' }
];

/** S11 FAQ — 6 题（bracelet→通用 crystal piece/jewelry） */
const FAQ_ITEMS = [
  { q:'Are your crystals real?', a:'Every crystal piece is selected as a genuine natural stone and visually inspected for authenticity before it reaches you. During inspection we look for natural formation and set aside any stone that shows signs of dye or synthetic treatment.' },
  { q:'How are crystals prepared before shipping?', a:'Every piece is physically cleaned, inspected, and packed with simple guidance for setting your own intention. As a low-key preparation step, we rest stones on selenite and handle them with care before they ship.' },
  { q:'Do crystals actually work?', a:'Crystals are not medical tools and cannot promise a specific result. Many people use them as tactile reminders for intentions such as calm, love, or focus, similar to how a journal, ring, or ritual object can support a mindfulness practice.' },
  { q:'What\'s included in my order?', a:'Every order includes your crystal piece in a premium velvet pouch, an intention guide card with traditional meaning and care notes, and practical instructions for wearing and storing it. Orders over $75 receive free shipping.' },
  { q:'How do I choose the right crystal?', a:'Start with your current intention, then browse by stone or read the crystal guide before choosing a piece. The goal is not to find a perfect answer, but to choose a piece whose meaning feels useful in your daily life.' },
  { q:'What\'s your return policy?', a:'We offer a 30-day worry-free return policy. If your crystal doesn\'t feel like the right match, simply send it back within 30 days for a full refund — no questions asked.' }
];

/** S8 Comparison — 6 维度（合规，无虚构对比） */
const COMPARISON = [
  { ours:'Genuine Natural Crystals',           theirs:'Dyed or synthetic stones' },
  { ours:'Prepared with care',                 theirs:'Shipped without any preparation' },
  { ours:'Origin and handling notes where available', theirs:'Little sourcing context' },
  { ours:'Intention guide card included',      theirs:'No information provided' },
  { ours:'Premium velvet pouch packaging',     theirs:'Plastic bag packaging' },
  { ours:'30-day worry-free returns',          theirs:'No returns accepted' }
];

/** S15 Trust Signals — 可兑现信任信号（无虚构数字） */
const TRUST_ITEMS = [
  { title:'Genuine Crystals',       desc:'Every stone is hand-selected and verified authentic' },
  { title:'Prepared With Care',     desc:'Physically cleaned, inspected, and paired with an intention guide' },
  { title:'Responsible Sourcing',   desc:'We ask suppliers clear questions about origin, handling, and labor context' },
  { title:'Free Shipping $75+',     desc:'Fast, tracked delivery on all US orders over $75' },
  { title:'30-Day Returns',         desc:'Not the right fit? Return within 30 days' },
  { title:'Eco-Friendly Packaging', desc:'Recyclable materials, velvet pouch included' }
];

// 列宽辅助
const cardWidth3 = () => ({ unit: '%', size: 30, sizes: [] });
const cardWidth4 = () => ({ unit: '%', size: 23, sizes: [] });
const tabletWidth2 = () => ({ unit: '%', size: 45, sizes: [] });
const mobileWidth100 = () => ({ unit: '%', size: 100, sizes: [] });

// ============================================================
// 生成 Homepage V2
// ============================================================
function generateHomepage() {
  return [

    // ===================== S2: Hero Banner =====================
    section({
      padding: rPadding('150','0','150','0', { tablet:{t:'100',r:'0',b:'100',l:'0'}, mobile:{t:'80',r:'10',b:'80',l:'10'} }),
      background_background: 'classic',
      background_image: { url: IMAGES.home.hero.url, id: 0, size: '', alt: cleanAlt(IMAGES.home.hero.alt), source: 'library' },
      background_position: 'center center', background_repeat: 'no-repeat', background_size: 'cover',
      background_overlay_background: 'classic', background_overlay_color: '#060000'
    }, [
      wrap({ content_width: 'boxed' }, [
        heading('Real Crystals for <u>Intentional Living</u>', { color: COLOR.white, fontSize: 48, align: 'center',
          extra: { typography_font_size_tablet: { unit:'px', size:36, sizes:[] }, typography_font_size_mobile: { unit:'px', size:28, sizes:[] } } }),
        textEditor('Genuine natural crystal jewelry and stones, individually inspected and chosen for everyday intention. Each piece arrives with a guide card to help you understand its traditional meaning and care.',
          { color: COLOR.white, fontSize: 18, align: 'center', extra: { _margin: { unit:'px', top:'0', right:'0', bottom:'30', left:'0', isLinked:'' } } }),
        wrap({ flex_direction: 'row', flex_justify_content: 'center', flex_gap: { size:15, column:'15', row:'15', unit:'px' } }, [
          buttonWidget('START WITH THE GUIDE', '/crystal-guide/', { size: 'lg', background: COLOR.green, text: COLOR.white }),
          buttonWidget('BROWSE BY INTENTION', '/calm-mindfulness/', { size: 'lg' })
        ])
      ])
    ]),

    // ===================== S3: Trust Score Bar（浅绿背景）=====================
    section({
      padding: rPadding('40','10','40','10', { mobile:{t:'20',r:'10',b:'20',l:'10'} }),
      background_background: 'classic', background_color: COLOR.paleGreen,
      flex_direction: 'row', flex_align_items: 'center', flex_justify_content: 'center',
      flex_wrap: 'wrap', flex_gap: { size:30, column:'30', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Genuine Natural Crystals', 'Hand-selected and verified authentic') ]),
      wrap({ content_width:'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Sourcing With Context', 'Origin and handling notes are reviewed wherever suppliers can provide them') ]),
      wrap({ content_width:'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Inspected & Guide Card Included', 'Ready for your intention from day one') ]),
      wrap({ content_width:'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('30-Day Worry-Free Returns', 'No questions asked') ])
    ]),

    // ===================== S4: Shop by Intention（链接对齐线上）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('What Intention Fits Today?', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('Start with the feeling, habit, or reminder you want to carry', { fontSize: 18, color: COLOR.muted })
      ]),
      wrap({ content_width:'full', flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:15, column:'15', row:'15', unit:'px' } },
        INTENTIONS.map(function(intent){
          return wrap({ content_width:'full', width:{ unit:'%', size:30, sizes:[] }, width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
            imageBox(IMAGES.home[intent.homeImg].url, intent.name, intent.desc,
              'https://goearthward.com/' + intent.slug + '/')
          ]);
        })
      )
    ]),

    // ===================== S5: Product Browse（bracelet→jewelry）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Explore Crystal Jewelry', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('A simple starting point for browsing current Earthward pieces', { fontSize: 18, color: COLOR.muted })
      ]),
      wdProductsTabs()
    ]),

    // ===================== S6: Guide Tool Entry（浅绿背景）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      background_background:'classic', background_color: COLOR.paleGreen,
      flex_direction:'row', flex_align_items:'center', flex_gap:{ size:30, column:'30', row:'30', unit:'px' }
    }, [
      wrap({ content_width:'full', width:{ size:'45', unit:'%' }, width_tablet:{ size:'100', unit:'%' }, flex_direction:'column' }, [
        imageWidget(IMAGES.home.quiz.url, { id:0, alt: IMAGES.home.quiz.alt, radius: 12 })
      ]),
      wrap({ content_width:'full', width:{ size:'50', unit:'%' }, width_tablet:{ size:'100', unit:'%' }, flex_direction:'column', flex_gap:{ size:15, column:'15', row:'15', unit:'px' } }, [
        heading('Not Sure Where to Start?', { fontSize: 36, align: 'left', color: COLOR.deepInk }),
        textEditor('Use the guide paths that are ready now: browse by intention, explore by stone, or read the crystal meaning index before choosing a piece.',
          { fontSize: 16, align: 'left', color: COLOR.body }),
        wrap({ content_width:'full', flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:10, column:'10', row:'10', unit:'px' } }, [
          wrap({ content_width:'full', width:{ unit:'%', size:47, sizes:[] }, width_mobile: mobileWidth100() }, [ iconBox('Browse by Intention', 'Start with calm, love, abundance, protection, or spiritual focus') ]),
          wrap({ content_width:'full', width:{ unit:'%', size:47, sizes:[] }, width_mobile: mobileWidth100() }, [ iconBox('Shop by Stone', 'Choose directly from familiar crystals such as Amethyst or Rose Quartz') ]),
          wrap({ content_width:'full', width:{ unit:'%', size:47, sizes:[] }, width_mobile: mobileWidth100() }, [ iconBox('Crystal Guide A-Z', 'Read traditional meanings before you buy') ]),
          wrap({ content_width:'full', width:{ unit:'%', size:47, sizes:[] }, width_mobile: mobileWidth100() }, [ iconBox('Our Sourcing Approach', 'See how Earthward thinks about origin, care, and realistic expectations') ])
        ]),
        buttonWidget('EXPLORE THE GUIDE', '/crystal-guide/', { size: 'lg', align: 'left', background: COLOR.green, text: COLOR.white })
      ])
    ]),

    // ===================== S7: Shop by Stone（链接对齐线上 by-stone）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Shop by Crystal', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('Explore 16 hand-selected gemstones, each with its own traditional meaning', { fontSize: 18, color: COLOR.muted })
      ]),
      wrap({ content_width:'full', flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:12, column:'12', row:'12', unit:'px' } },
        CRYSTALS.map(function(c){
          return wrap({ content_width:'full', width:{ unit:'%', size:22, sizes:[] }, width_tablet:{ unit:'%', size:30, sizes:[] }, width_mobile:{ unit:'%', size:47, sizes:[] } }, [
            imageBox(IMAGES.crystals[c.key].url, c.name, c.poetic, stoneLink(c.name), { radius: 50 })
          ]);
        })
      )
    ]),

    // ===================== S8: Comparison Table（浅背景）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      background_background:'classic', background_color: COLOR.paleGreen,
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Why Choose Earthward?', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('What sets a careful crystal experience apart from anonymous marketplace listings', { fontSize: 18, color: COLOR.muted })
      ]),
      wrap({ content_width:'full', flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:15, column:'15', row:'15', unit:'px' } },
        COMPARISON.map(function(item){
          return wrap({ content_width:'full', width:{ unit:'%', size:30, sizes:[] }, width_tablet: tabletWidth2(), width_mobile: mobileWidth100(),
            background_background:'classic', background_color: COLOR.white,
            border_border:'solid', border_width:{ unit:'px', top:'1', right:'1', bottom:'1', left:'1', isLinked:true }, border_color:'#E0E0E0',
            border_radius:{ unit:'px', top:'8', right:'8', bottom:'8', left:'8', isLinked:true },
            padding:{ unit:'px', top:'20', right:'15', bottom:'20', left:'15', isLinked:false }
          }, [ iconBox(item.ours, 'Unlike: ' + item.theirs) ]);
        })
      )
    ]),

    // ===================== S9: Brand Story Preview（about 链接对齐线上 /about-us/）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      flex_direction:'row', flex_align_items:'center', flex_gap:{ size:40, column:'40', row:'40', unit:'px' }
    }, [
      wrap({ content_width:'full', width:{ size:'45', unit:'%' }, width_tablet:{ size:'100', unit:'%' } }, [
        imageWidget(IMAGES.home.brandStory.url, { id:0, alt: IMAGES.home.brandStory.alt, radius: 12 })
      ]),
      wrap({ content_width:'full', width:{ size:'50', unit:'%' }, width_tablet:{ size:'100', unit:'%' }, flex_direction:'column', flex_gap:{ size:10, column:'10', row:'10', unit:'px' } }, [
        heading('Why Earthward?', { fontSize: 32, align: 'left', color: COLOR.deepInk }),
        textEditor('In a world of synthetic shortcuts, we chose a different direction: genuine stones, clear guidance, careful preparation, and realistic expectations. Earthward is not about promising outcomes. It is about giving you something real to hold while you practice intention.',
          { fontSize: 16, align: 'left', color: COLOR.body, lineHeight: 28 }),
        wrap({ flex_direction:'row', flex_gap:{ size:15, column:'15', row:'15', unit:'px' } }, [
          buttonWidget('LEARN OUR STORY', '/about-us/', { size:'md', align:'left', background: COLOR.green, text: COLOR.white }),
          buttonWidget('CONTACT US', '/contact-us/', { size:'md', align:'left' })
        ])
      ])
    ]),

    // ===================== S10: How People Use Their Crystals（bracelet→piece）=====================
    section({
      padding: rPadding('70','10','70','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'10',b:'30',l:'10'} }),
      background_background:'classic', background_color: COLOR.surface
    }, [
      heading('How People Use Their Crystals', { fontSize: 36, color: COLOR.deepInk }),
      textEditor('Real moments where a crystal piece became part of everyday intention', { fontSize: 16, color: COLOR.muted }),
      spacer(20),
      wrap({ flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:20, column:'20', row:'20', unit:'px' } }, [
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useCalm.url, { alt: IMAGES.home.useCalm.alt, radius: 50, width: 60 }),
          heading('For Calm Evenings', { fontSize: 18, align:'center', color: COLOR.deepInk }),
          textEditor('A common Amethyst ritual is to keep a piece on a nightstand and touch it before bed as a reminder to let the day settle.',
            { fontSize: 14, align:'center', extra:{ _padding:{ unit:'px', top:'0', right:'10', bottom:'0', left:'10', isLinked:'' } } })
        ]),
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useWorkday.url, { alt: IMAGES.home.useWorkday.alt, radius: 50, width: 60 }),
          heading('For Stressful Workdays', { fontSize: 18, align:'center', color: COLOR.deepInk }),
          textEditor('Black Tourmaline is often chosen as a workday grounding cue: a small physical reminder to pause, breathe, and reset.',
            { fontSize: 14, align:'center', extra:{ _padding:{ unit:'px', top:'0', right:'10', bottom:'0', left:'10', isLinked:'' } } })
        ]),
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [
          imageWidget(IMAGES.home.useCompassion.url, { alt: IMAGES.home.useCompassion.alt, radius: 50, width: 60 }),
          heading('For Self-Compassion', { fontSize: 18, align:'center', color: COLOR.deepInk }),
          textEditor('Rose Quartz is a popular choice for people navigating transitions. Carrying it can serve as a gentle daily prompt to be kinder to yourself.',
            { fontSize: 14, align:'center', extra:{ _padding:{ unit:'px', top:'0', right:'10', bottom:'0', left:'10', isLinked:'' } } })
        ])
      ])
    ]),

    // ===================== S11: FAQ（bracelet→通用）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Common Questions', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('Everything you need to know about our crystals', { fontSize: 18, color: COLOR.muted })
      ]),
      wrap({ content_width:'boxed' }, [ accordionWidget(FAQ_ITEMS) ])
    ]),

    // ===================== S12: Crystal Guide Preview（bracelet→piece）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'5',b:'30',l:'5'} }),
      background_background:'classic', background_color: COLOR.paleGreen,
      flex_gap: { size:15, column:'15', row:'15', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Start With Crystal Meanings', { fontSize: 36, color: COLOR.deepInk }),
        textEditor('Our guide is being built around clear mineral facts, traditional meanings, and everyday intention practices.', { fontSize: 18, color: COLOR.muted })
      ]),
      wrap({ content_width:'full', flex_direction:'row', flex_wrap:'wrap', flex_gap:{ size:15, column:'15', row:'15', unit:'px' } }, [
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Mineral Facts', 'Simple identifiers such as color, hardness, formation, and care notes') ]),
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Traditional Meaning', 'How each crystal has commonly been associated with intention and ritual') ]),
        wrap({ content_width:'full', width: cardWidth3(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100() }, [ iconBox('Everyday Use', 'Practical ways to wear, store, cleanse, and pair your crystal piece') ])
      ]),
      wrap({ content_width:'boxed' }, [ buttonWidget('EXPLORE CRYSTAL GUIDE', '/crystal-guide/', { background: COLOR.green, text: COLOR.white }) ])
    ]),

    // ===================== S13: Launch CTA（Earthward 叙事）=====================
    section({
      padding: rPadding('80','10','80','10', { tablet:{t:'50',r:'10',b:'50',l:'10'}, mobile:{t:'30',r:'10',b:'30',l:'10'} }),
      background_background:'classic',
      background_image: { url: IMAGES.home.newsletter.url, id:0, size:'', alt: cleanAlt(IMAGES.home.newsletter.alt), source:'library' },
      background_repeat:'no-repeat', background_size:'cover',
      background_overlay_background:'classic', background_overlay_color:'#000000',
      background_overlay_opacity:{ unit:'px', size:0.7, sizes:[] }
    }, [
      wrap({ content_width:'boxed' }, [
        heading('Choose Something Real to Carry', { color: COLOR.white, fontSize: 32 }),
        textEditor('Begin with a stone, an intention, or the guide path that helps you make a grounded choice.',
          { color:'#CCCCCC', fontSize: 16, extra:{ _margin:{ unit:'px', top:'0', right:'0', bottom:'30', left:'0', isLinked:'' } } }),
        buttonWidget('EXPLORE CRYSTAL GUIDE', '/crystal-guide/', { background: COLOR.green, text: COLOR.white })
      ])
    ]),

    // ===================== S14: SEO Content Block（bracelet→jewelry）=====================
    section({
      padding: rPadding('40','10','40','10', { mobile:{t:'20',r:'10',b:'20',l:'10'} }),
      flex_gap: { size:5, column:'5', row:'5', unit:'px' }
    }, [
      wrap({ content_width:'boxed' }, [
        textEditor('Earthward offers crystal jewelry and natural stones — including amethyst, rose quartz, citrine, black tourmaline, and clear quartz — alongside handcrafted copper pieces. Each piece is selected with care, paired with practical guidance, and designed for everyday intention. Whether you are choosing a stone for calm, love, abundance, grounding, or personal reflection, start by browsing by intention, exploring the crystal guide, or reading how Earthward approaches sourcing and care.',
          { fontSize: 13, align:'left', color:'#999999', lineHeight: 22, responsive: false })
      ])
    ]),

    // ===================== S15: Trust Signals（浅绿底，避免深底绿字不可读）=====================
    section({
      padding: rPadding('60','10','60','10', { tablet:{t:'40',r:'10',b:'40',l:'10'}, mobile:{t:'20',r:'5',b:'20',l:'5'} }),
      background_background:'classic', background_color: COLOR.paleGreen,
      flex_direction:'row', flex_align_items:'stretch', flex_wrap:'wrap', flex_gap:{ size:10, column:'10', row:'10', unit:'px' }
    },
      TRUST_ITEMS.map(function(item){
        return wrap({ content_width:'full', width: cardWidth4(), width_tablet: tabletWidth2(), width_mobile: mobileWidth100(),
          padding:{ unit:'px', top:'15', right:'10', bottom:'15', left:'10', isLinked:false } }, [ iconBox(item.title, item.desc) ]);
      })
    )

  ];
}

// ============================================================
// 输出 Elementor JSON（home-v2.json）+ 结构校验
// ============================================================
function main() {
  const data = generateHomepage();
  const jsonStr = JSON.stringify(data, null, 2);
  const outPath = path.join(__dirname, 'home-v2.json');
  fs.writeFileSync(outPath, jsonStr);

  // 校验
  let totalContainers = 0, rowContainers = 0, widgets = {};
  (function walk(elements){
    elements.forEach(function(el){
      if (el.elType === 'container') {
        totalContainers++;
        if (el.settings.flex_direction === 'row') rowContainers++;
        if (el.elements && el.elements.length) walk(el.elements);
      } else if (el.elType === 'widget') {
        widgets[el.widgetType] = (widgets[el.widgetType] || 0) + 1;
      }
    });
  })(data);

  console.log('=== home-v2.json generated ===');
  console.log('Path: ' + outPath);
  console.log('Size: ' + jsonStr.length + ' chars | ' + data.length + ' top sections');
  console.log('Containers: ' + totalContainers + ' (row: ' + rowContainers + ')');
  console.log('Widgets:');
  Object.keys(widgets).forEach(function(t){ console.log('  - ' + t + ' (' + widgets[t] + ')'); });
  console.log('\n用法：');
  console.log('  方式1 (REST 覆盖首页): meta._elementor_data = 本 JSON 数组，POST /wp-json/wp/v2/pages/7535?context=edit');
  console.log('  方式2 (Elementor 导入): 包成 {content:本数组, version:"0.4", title:"Home", type:"wp-page"} 后台 Templates>Import');
}

main();
