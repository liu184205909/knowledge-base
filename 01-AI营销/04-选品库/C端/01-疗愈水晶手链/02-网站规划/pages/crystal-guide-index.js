/**
 * Crystal Guide 百科索引页
 * URL: /crystal-guide/
 *
 * 7个Section:
 * 1. 标题+搜索框 — "Crystal Encyclopedia: Your Complete Guide"
 * 2. 水晶A-Z — 16种水晶圆形缩略图+名称+诗意副标题（4x4网格）
 * 3. 按功效浏览 — "What Do You Need Help With?" 30+功效分类网格
 * 4. 按脉轮浏览 — 7个脉轮卡片
 * 5. 按星座浏览 — 12个星座卡片
 * 6. 按颜色浏览 — 12个颜色卡片
 * 7. 入门文章 — 3-4篇入门指南链接
 *
 * 用法:
 *   node crystal-guide-index.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 16种水晶数据（含诗意副标题）
// ============================================================
const CRYSTALS_AZ = [
  { name: 'Amethyst',         subtitle: 'The Stone of Peace',          image: IMAGES.crystals.amethyst.url,         link: '/crystal-guide/amethyst-meaning' },
  { name: 'Rose Quartz',      subtitle: 'The Stone of Love',           image: IMAGES.crystals.roseQuartz.url,      link: '/crystal-guide/rose-quartz-meaning' },
  { name: 'Citrine',          subtitle: 'The Stone of Abundance',      image: IMAGES.crystals.citrine.url,          link: '/crystal-guide/citrine-meaning' },
  { name: 'Black Tourmaline', subtitle: 'The Shield Stone',            image: IMAGES.crystals.blackTourmaline.url, link: '/crystal-guide/black-tourmaline-meaning' },
  { name: 'Clear Quartz',     subtitle: 'The Master Healer',           image: IMAGES.crystals.clearQuartz.url,     link: '/crystal-guide/clear-quartz-meaning' },
  { name: 'Tiger Eye',        subtitle: 'The Stone of Courage',        image: IMAGES.crystals.tigerEye.url,        link: '/crystal-guide/tiger-eye-meaning' },
  { name: 'Moonstone',        subtitle: 'The Stone of New Beginnings', image: IMAGES.crystals.moonstone.url,        link: '/crystal-guide/moonstone-meaning' },
  { name: 'Obsidian',         subtitle: 'The Mirror Stone',            image: IMAGES.crystals.obsidian.url,         link: '/crystal-guide/obsidian-meaning' },
  { name: 'Lepidolite',       subtitle: 'The Stone of Transition',     image: IMAGES.crystals.lepidolite.url,       link: '/crystal-guide/lepidolite-meaning' },
  { name: 'Selenite',         subtitle: 'The Stone of Clarity',        image: IMAGES.crystals.selenite.url,         link: '/crystal-guide/selenite-meaning' },
  { name: 'Green Aventurine', subtitle: 'The Stone of Luck',           image: IMAGES.crystals.greenAventurine.url, link: '/crystal-guide/green-aventurine-meaning' },
  { name: 'Fluorite',         subtitle: 'The Stone of Focus',          image: IMAGES.crystals.fluorite.url,         link: '/crystal-guide/fluorite-meaning' },
  { name: 'Howlite',          subtitle: 'The Stone of Calm',           image: IMAGES.crystals.howlite.url,          link: '/crystal-guide/howlite-meaning' },
  { name: 'Rhodonite',        subtitle: 'The Stone of Compassion',     image: IMAGES.crystals.rhodonite.url,        link: '/crystal-guide/rhodonite-meaning' },
  { name: 'Malachite',        subtitle: 'The Stone of Transformation', image: IMAGES.crystals.malachite.url,        link: '/crystal-guide/malachite-meaning' },
  { name: 'Hematite',         subtitle: 'The Grounding Stone',         image: IMAGES.crystals.hematite.url,         link: '/crystal-guide/hematite-meaning' }
];

// ============================================================
// 30+功效分类数据
// ============================================================
const CONDITIONS = [
  { name: 'Anxiety & Stress',     slug: 'anxiety' },
  { name: 'Sleep & Insomnia',     slug: 'sleep' },
  { name: 'Love & Relationships', slug: 'love' },
  { name: 'Wealth & Prosperity',  slug: 'wealth' },
  { name: 'Protection',           slug: 'protection' },
  { name: 'Focus & Clarity',      slug: 'focus' },
  { name: 'Confidence',           slug: 'confidence' },
  { name: 'Emotional Healing',    slug: 'emotional-healing' },
  { name: 'Meditation',           slug: 'meditation' },
  { name: 'Spiritual Growth',     slug: 'spiritual-growth' },
  { name: 'Grounding',            slug: 'grounding' },
  { name: 'Intuition',            slug: 'intuition' },
  { name: 'Creativity',           slug: 'creativity' },
  { name: 'Patience',             slug: 'patience' },
  { name: 'Self-Love',            slug: 'self-love' },
  { name: 'Communication',        slug: 'communication' },
  { name: 'Forgiveness',          slug: 'forgiveness' },
  { name: 'New Beginnings',       slug: 'new-beginnings' },
  { name: 'Strength & Courage',   slug: 'strength' },
  { name: 'Happiness & Joy',      slug: 'happiness' },
  { name: 'Abundance',            slug: 'abundance' },
  { name: 'Balance & Harmony',    slug: 'balance' },
  { name: 'Chakra Healing',       slug: 'chakra-healing' },
  { name: 'Manifestation',        slug: 'manifestation' },
  { name: 'Energy Cleansing',     slug: 'energy-cleansing' },
  { name: 'Grief & Loss',         slug: 'grief' },
  { name: 'Fertility',            slug: 'fertility' },
  { name: 'Luck & Fortune',       slug: 'luck' },
  { name: 'Pain Relief',          slug: 'pain-relief' },
  { name: 'Third Eye Opening',    slug: 'third-eye' }
];

// ============================================================
// 7个脉轮数据
// ============================================================
const CHAKRAS = [
  { name: 'Root Chakra',        sanskrit: 'Muladhara',    color: '#FF0000', colorName: 'Red',    link: '/crystal-guide/root-chakra-crystals' },
  { name: 'Sacral Chakra',      sanskrit: 'Svadhisthana', color: '#FF8C00', colorName: 'Orange', link: '/crystal-guide/sacral-chakra-crystals' },
  { name: 'Solar Plexus',       sanskrit: 'Manipura',     color: '#FFD700', colorName: 'Yellow', link: '/crystal-guide/solar-plexus-chakra-crystals' },
  { name: 'Heart Chakra',       sanskrit: 'Anahata',      color: '#00CC00', colorName: 'Green',  link: '/crystal-guide/heart-chakra-crystals' },
  { name: 'Throat Chakra',      sanskrit: 'Vishuddha',    color: '#0099FF', colorName: 'Blue',   link: '/crystal-guide/throat-chakra-crystals' },
  { name: 'Third Eye Chakra',   sanskrit: 'Ajna',         color: '#4B0082', colorName: 'Indigo', link: '/crystal-guide/third-eye-chakra-crystals' },
  { name: 'Crown Chakra',       sanskrit: 'Sahasrara',    color: '#9400D3', colorName: 'Violet', link: '/crystal-guide/crown-chakra-crystals' }
];

// ============================================================
// 12个星座数据
// ============================================================
const ZODIACS = [
  { name: 'Aries',       symbol: '\u2648', dates: 'Mar 21 \u2013 Apr 19',  link: '/crystal-guide/aries-crystals' },
  { name: 'Taurus',      symbol: '\u2649', dates: 'Apr 20 \u2013 May 20',  link: '/crystal-guide/taurus-crystals' },
  { name: 'Gemini',      symbol: '\u264A', dates: 'May 21 \u2013 Jun 20',  link: '/crystal-guide/gemini-crystals' },
  { name: 'Cancer',      symbol: '\u264B', dates: 'Jun 21 \u2013 Jul 22',  link: '/crystal-guide/cancer-crystals' },
  { name: 'Leo',         symbol: '\u264C', dates: 'Jul 23 \u2013 Aug 22',  link: '/crystal-guide/leo-crystals' },
  { name: 'Virgo',       symbol: '\u264D', dates: 'Aug 23 \u2013 Sep 22',  link: '/crystal-guide/virgo-crystals' },
  { name: 'Libra',       symbol: '\u264E', dates: 'Sep 23 \u2013 Oct 22',  link: '/crystal-guide/libra-crystals' },
  { name: 'Scorpio',     symbol: '\u264F', dates: 'Oct 23 \u2013 Nov 21',  link: '/crystal-guide/scorpio-crystals' },
  { name: 'Sagittarius', symbol: '\u2650', dates: 'Nov 22 \u2013 Dec 21',  link: '/crystal-guide/sagittarius-crystals' },
  { name: 'Capricorn',   symbol: '\u2651', dates: 'Dec 22 \u2013 Jan 19',  link: '/crystal-guide/capricorn-crystals' },
  { name: 'Aquarius',    symbol: '\u2652', dates: 'Jan 20 \u2013 Feb 18',  link: '/crystal-guide/aquarius-crystals' },
  { name: 'Pisces',      symbol: '\u2653', dates: 'Feb 19 \u2013 Mar 20',  link: '/crystal-guide/pisces-crystals' }
];

// ============================================================
// 12个颜色数据
// ============================================================
const COLORS = [
  { name: 'Red Crystals',    color: '#E74C3C', link: '/crystal-guide/red-crystals' },
  { name: 'Orange Crystals', color: '#E67E22', link: '/crystal-guide/orange-crystals' },
  { name: 'Yellow Crystals', color: '#F1C40F', link: '/crystal-guide/yellow-crystals' },
  { name: 'Green Crystals',  color: '#2ECC71', link: '/crystal-guide/green-crystals' },
  { name: 'Blue Crystals',   color: '#3498DB', link: '/crystal-guide/blue-crystals' },
  { name: 'Purple Crystals', color: '#9B59B6', link: '/crystal-guide/purple-crystals' },
  { name: 'Pink Crystals',   color: '#E91E8C', link: '/crystal-guide/pink-crystals' },
  { name: 'White Crystals',  color: '#ECF0F1', link: '/crystal-guide/white-crystals' },
  { name: 'Black Crystals',  color: '#2C3E50', link: '/crystal-guide/black-crystals' },
  { name: 'Brown Crystals',  color: '#8B6914', link: '/crystal-guide/brown-crystals' },
  { name: 'Gold Crystals',   color: '#DAA520', link: '/crystal-guide/gold-crystals' },
  { name: 'Clear Crystals',  color: '#D5DBDB', link: '/crystal-guide/clear-crystals' }
];

// ============================================================
// 生成 Crystal Guide 索引页
// ============================================================
function generateCrystalGuideIndex() {

  // ----------------------------------------------------------
  // Section 1: 标题 + 搜索框
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_image: {
      url: IMAGES.shared.crystalGrid.url,
      id: 0, size: '', alt: IMAGES.shared.crystalGrid.alt, source: 'library'
    },
    background_position: 'center center',
    background_repeat: 'no-repeat',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: '#1A0A2E',
    background_overlay_opacity: { unit: 'px', size: 0.72, sizes: [] }
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Crystal Guide</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Crystal Encyclopedia', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Your Complete Guide to Crystal Wisdom', {
      fontSize: 22,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '25', left: '0', isLinked: '' }
    }),
    E.htmlWidget(
      '<div style="max-width:600px;margin:0 auto;">' +
      '<input type="text" id="crystal-search" placeholder="Search crystals, meanings, properties..." style="width:100%;padding:14px 20px;border-radius:30px;border:2px solid rgba(196,161,255,0.4);background:rgba(255,255,255,0.1);color:#fff;font-size:16px;outline:none;box-sizing:border-box;" />' +
      '</div>'
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 水晶 A-Z — 4x4 网格
  // ----------------------------------------------------------
  var crystalCards = CRYSTALS_AZ.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      flex_align_items: 'center',
      _padding: E.rPadding('20', '15', '20', '15'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
      border_color: '#F0E6FF'
    }, E.rWidth('25', '50', '50')), [
      E.imageWidget(crystal.image || PLACEHOLDER, {
        width: 80,
        radius: 50,
        alt: crystal.name
      }),
      E.heading(crystal.name, {
        fontSize: 16,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        crystal.subtitle,
        { align: 'center', fontSize: 13, color: '#999999' }
      ),
      E.buttonWidget('Learn More', crystal.link)
    ]);
  });

  var azSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Crystal Meanings A\u2013Z', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore the properties, meanings, and healing powers of each crystal. Click any stone to discover its full story.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, crystalCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: 按功效浏览 — 30+功效分类网格
  // ----------------------------------------------------------
  var conditionCards = CONDITIONS.map(function (cond) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15'),
      background_background: 'classic',
      background_color: '#F9F5FF'
    }, E.rWidth('20', '25', '50')), [
      E.heading(cond.name, {
        fontSize: 15,
        color: '#7C3AED',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
      }),
      E.buttonWidget('Explore', '/crystal-guide/crystals-for-' + cond.slug)
    ]);
  });

  var conditionSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('What Do You Need Help With?', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'From anxiety to abundance, find the crystals that support your specific needs and intentions.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(10),
      flex_wrap: 'wrap'
    }, conditionCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: 按脉轮浏览 — 7个脉轮卡片
  // ----------------------------------------------------------
  var chakraCards = CHAKRAS.map(function (chakra) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '3', right: '1', bottom: '1', left: '1', isLinked: '' },
      border_color: chakra.color
    }, E.rWidth('14', '25', '50')), [
      E.htmlWidget(
        '<div style="width:40px;height:40px;border-radius:50%;background:' + chakra.color + ';margin:0 auto 10px;"></div>'
      ),
      E.heading(chakra.name, {
        fontSize: 16,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        chakra.sanskrit + ' \u2014 ' + chakra.colorName,
        { align: 'center', fontSize: 13, color: '#999999' }
      ),
      E.buttonWidget('View Crystals', chakra.link)
    ]);
  });

  var chakraSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Browse by Chakra', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Discover the crystals associated with each of the seven energy centers in your body.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, chakraCards)
  ]);

  // ----------------------------------------------------------
  // Section 5: 按星座浏览 — 12个星座卡片
  // ----------------------------------------------------------
  var zodiacCards = ZODIACS.map(function (sign) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('25', '25', '50')), [
      E.heading(sign.symbol + ' ' + sign.name, {
        fontSize: 16,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        sign.dates,
        { align: 'center', fontSize: 12, color: '#999999' }
      ),
      E.buttonWidget('Explore', sign.link)
    ]);
  });

  var zodiacSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Browse by Zodiac Sign', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Find the crystals that resonate with your astrological sign and amplify your celestial energy.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, zodiacCards)
  ]);

  // ----------------------------------------------------------
  // Section 6: 按颜色浏览 — 12个颜色卡片
  // ----------------------------------------------------------
  var colorCards = COLORS.map(function (item) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth('25', '25', '50')), [
      E.htmlWidget(
        '<div style="width:36px;height:36px;border-radius:50%;background:' + item.color + ';margin:0 auto 8px;border:2px solid #eee;"></div>'
      ),
      E.heading(item.name, {
        fontSize: 15,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
      }),
      E.buttonWidget('Explore', item.link)
    ]);
  });

  var colorSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Browse by Color', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Drawn to a certain color? Discover the crystals that match your visual and energetic preference.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, colorCards)
  ]);

  // ----------------------------------------------------------
  // Section 7: 入门文章 — 3-4篇入门指南链接
  // ----------------------------------------------------------
  var guideArticles = [
    {
      title: 'Crystal Beginner\'s Guide: Everything You Need to Know',
      desc: 'New to crystals? Start here with our comprehensive guide to choosing, cleansing, and using your first healing stones.',
      image: IMAGES.blog.beginnerGuide.url,
      link: '/blog/crystal-beginners-guide'
    },
    {
      title: 'How to Cleanse and Charge Your Crystals',
      desc: 'Learn the essential rituals for keeping your crystals energetically pure and fully charged.',
      image: IMAGES.blog.fullMoon.url,
      link: '/blog/how-to-cleanse-charge-crystals'
    },
    {
      title: 'Understanding Chakras: A Crystal Lover\'s Introduction',
      desc: 'Explore the seven chakras and discover which crystals can help balance each energy center.',
      image: IMAGES.blog.chakra.url,
      link: '/blog/understanding-chakras-introduction'
    },
    {
      title: 'The Science Behind Crystal Energy',
      desc: 'From piezoelectricity to mindfulness practices \u2014 explore the fascinating intersection of science and crystal healing.',
      image: IMAGES.blog.clearQuartz.url,
      link: '/blog/science-behind-crystal-energy'
    }
  ];

  var articleCards = guideArticles.map(function (article) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '25', '25', '25'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
      border_color: '#F0E6FF'
    }, E.rWidth('25', '50', '100')), [
      E.imageWidget(article.image || PLACEHOLDER, {
        width: 100,
        radius: 8,
        alt: article.title
      }),
      E.heading(article.title, {
        fontSize: 17,
        color: '#333333',
        align: 'left',
        fontWeight: '600',
        padding: { unit: 'px', top: '12', right: '0', bottom: '8', left: '0', isLinked: '' }
      }),
      E.textEditor(
        article.desc,
        { align: 'left', fontSize: 14, color: '#888888', lineHeight: 22 }
      ),
      E.buttonWidget('Read Guide', article.link)
    ]);
  });

  var articleSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Getting Started with Crystals', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'New to the world of crystals? These beginner-friendly guides will help you build a strong foundation.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, articleCards)
  ]);

  return [
    heroSection,
    azSection,
    conditionSection,
    chakraSection,
    zodiacSection,
    colorSection,
    articleSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateCrystalGuideIndex();
  await E.createPage(
    'Crystal Encyclopedia: Your Complete Guide',
    'crystal-guide',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateCrystalGuideIndex;
