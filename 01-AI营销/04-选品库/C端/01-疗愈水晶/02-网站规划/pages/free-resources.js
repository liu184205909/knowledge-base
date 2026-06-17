/**
 * Free Resources 页面
 * URL: /free-resources
 *
 * 4个Section:
 * 1. 标题 — "Free Crystal Resources"
 * 2. 免费PDF — 4个PDF下载卡片（全部需邮箱）
 * 3. Printable Cards — 可下载水晶信息卡占位
 * 4. 免费工具入口 — 4个工具链接卡片
 *
 * 用法:
 *   node free-resources.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const RESOURCE_IMAGES = IMAGES.freeResources;

// ============================================================
// 生成 Free Resources 页面
// ============================================================
function generateFreeResources() {

  // ----------------------------------------------------------
  // Section 1: 标题 — "Free Crystal Resources"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: RESOURCE_IMAGES.hero.url, id: 0, size: '', alt: RESOURCE_IMAGES.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Free Resources</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Free Crystal Resources', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Guides, Printables & Tools to Deepen Your Crystal Journey', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Download our free resources and start your transformation today. All we ask is your email so we can send you more crystal wisdom.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 免费PDF — 4个PDF下载卡片（全部需邮箱）
  // ----------------------------------------------------------
  var pdfs = [
    {
      title: 'Crystal Beginner\'s Guide',
      desc: 'A 25-page comprehensive guide covering crystal meanings, how to choose your first stone, cleansing rituals, and setting intentions.',
      icon: '\uD83D\uDCD6'
    },
    {
      title: 'Moon Calendar 2026',
      desc: 'Track every new moon, full moon, and eclipse in 2026. Includes recommended crystals and rituals for each lunar phase.',
      icon: '\uD83C\uDF19'
    },
    {
      title: 'Cleansing & Charging Checklist',
      desc: 'A printable checklist with 10 methods to cleanse and charge your crystals \u2014 from moonlight to sound baths.',
      icon: '\u2705'
    },
    {
      title: 'Angel Numbers Quick Guide',
      desc: 'Decode the most common angel numbers (111\u2013999) and discover which crystals amplify each number\'s energy.',
      icon: '\uD83D\uDD2E'
    }
  ];

  var pdfCards = pdfs.map(function (pdf) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('30', '25', '30', '25'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
      border_color: '#F0E6FF'
    }, E.rWidth('25', '50', '100')), [
      E.htmlWidget(
        '<div style="font-size:48px;text-align:center;margin-bottom:10px;">' + pdf.icon + '</div>'
      ),
      E.heading(pdf.title, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        fontWeight: '700',
        padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
      }),
      E.textEditor(
        pdf.desc,
        { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
      ),
      E.spacer('10'),
      E.htmlWidget(
        '<div style="text-align:center;">' +
        '<input type="email" placeholder="Enter your email" style="padding:10px 15px;border:1px solid #ddd;border-radius:20px;width:80%;font-size:14px;margin-bottom:8px;" />' +
        '<button style="padding:10px 25px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;">Download Free PDF</button>' +
        '<p style="font-size:11px;color:#aaa;margin-top:6px;">We respect your privacy. Unsubscribe anytime.</p>' +
        '</div>'
      )
    ]);
  });

  var pdfSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Free PDF Guides', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Download our most popular guides \u2014 absolutely free. Just enter your email and we\'ll send the PDF straight to your inbox.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, pdfCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: Printable Cards — 可下载水晶信息卡占位
  // ----------------------------------------------------------
  var printableCardsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Printable Crystal Information Cards', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Beautiful, print-ready reference cards for your favorite crystals. Perfect for your journal, altar, or crystal collection.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFFFFF',
        border_border: 'solid',
        border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
        border_color: '#F0E6FF'
      }, E.rWidth('25', '50', '100')), [
        E.imageWidget(RESOURCE_IMAGES.crystalCards.url, { width: 100, radius: 8, alt: RESOURCE_IMAGES.crystalCards.alt }),
        E.heading('Crystal Meaning Cards', {
          fontSize: 18,
          color: '#333333',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '12', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '16 beautifully designed cards featuring crystal names, meanings, chakra associations, and affirmations.',
          { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
        ),
        E.buttonWidget('Download Coming Soon', '#')
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFFFFF',
        border_border: 'solid',
        border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
        border_color: '#F0E6FF'
      }, E.rWidth('25', '50', '100')), [
        E.imageWidget(RESOURCE_IMAGES.chakraCards.url, { width: 100, radius: 8, alt: RESOURCE_IMAGES.chakraCards.alt }),
        E.heading('Chakra Reference Cards', {
          fontSize: 18,
          color: '#333333',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '12', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '7 chakra cards with color coding, location, balancing crystals, and mantras for each energy center.',
          { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
        ),
        E.buttonWidget('Download Coming Soon', '#')
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFFFFF',
        border_border: 'solid',
        border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
        border_color: '#F0E6FF'
      }, E.rWidth('25', '50', '100')), [
        E.imageWidget(RESOURCE_IMAGES.zodiacCards.url, { width: 100, radius: 8, alt: RESOURCE_IMAGES.zodiacCards.alt }),
        E.heading('Zodiac Crystal Cards', {
          fontSize: 18,
          color: '#333333',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '12', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '12 zodiac-themed cards with each sign\'s ruling crystals, personality traits, and best crystal pairings.',
          { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
        ),
        E.buttonWidget('Download Coming Soon', '#')
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFFFFF',
        border_border: 'solid',
        border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
        border_color: '#F0E6FF'
      }, E.rWidth('25', '50', '100')), [
        E.imageWidget(RESOURCE_IMAGES.moonPhaseCards.url, { width: 100, radius: 8, alt: RESOURCE_IMAGES.moonPhaseCards.alt }),
        E.heading('Moon Phase Ritual Cards', {
          fontSize: 18,
          color: '#333333',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '12', right: '0', bottom: '5', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '8 ritual cards aligned with the moon cycle \u2014 from new moon intentions to full moon release ceremonies.',
          { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
        ),
        E.buttonWidget('Download Coming Soon', '#')
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 4: 免费工具入口 — 4个工具链接卡片
  // ----------------------------------------------------------
  var tools = [
    {
      name: 'Crystal Quiz',
      desc: 'Answer 5 simple questions and discover the crystals that align with your current energy and intentions.',
      icon: '\uD83D\uDCAE',
      link: '/crystal-quiz'
    },
    {
      name: 'Birthstone Finder',
      desc: 'Enter your birth month and find the crystals connected to your birthday, zodiac sign, and numerology.',
      icon: '\uD83D\uDC8E',
      link: '/birthstone-finder'
    },
    {
      name: 'Chakra Balance Test',
      desc: 'Assess which of your seven chakras may be blocked and receive personalized crystal recommendations.',
      icon: '\uD83C\uDF0C',
      link: '/chakra-test'
    },
    {
      name: 'Crystal Oracle',
      desc: 'Draw a free crystal reading for today. Discover what message the crystal kingdom has for you.',
      icon: '\u2728',
      link: '/crystal-oracle'
    }
  ];

  var toolCards = tools.map(function (tool) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '25', '25', '25'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '3', right: '1', bottom: '1', left: '1', isLinked: '' },
      border_color: '#7C3AED'
    }, E.rWidth('25', '50', '100')), [
      E.htmlWidget(
        '<div style="font-size:48px;text-align:center;margin-bottom:10px;">' + tool.icon + '</div>'
      ),
      E.heading(tool.name, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        fontWeight: '700',
        padding: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' }
      }),
      E.textEditor(
        tool.desc,
        { align: 'center', fontSize: 14, color: '#888888', lineHeight: 22 }
      ),
      E.buttonWidget('Try It Free', tool.link)
    ]);
  });

  var toolsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Free Interactive Tools', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore our collection of free crystal tools. No sign-up required \u2014 just click and start discovering.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, toolCards)
  ]);

  return [
    heroSection,
    pdfSection,
    printableCardsSection,
    toolsSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateFreeResources();
  await E.createPage(
    'Free Crystal Resources',
    'free-resources',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateFreeResources;
