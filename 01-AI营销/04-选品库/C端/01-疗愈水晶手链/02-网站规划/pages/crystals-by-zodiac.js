/**
 * Crystals by Zodiac 页面模板
 * URL: /crystal-guide/[zodiac]-crystals
 *
 * 5个Section:
 * 1. Hero — 星座名+日期
 * 2. 星座特征 — 元素/守护星/性格关键词
 * 3. 推荐水晶 — 3-5种水晶+为什么适合
 * 4. 对应产品 — 产品列表占位
 * 5. 12星座导航 — 其他11个星座快速链接网格
 *
 * 用法:
 *   node crystals-by-zodiac.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 12星座完整数据
// ============================================================
const ALL_ZODIAC = [
  { name: 'Aries',       symbol: '\u2648', dates: 'Mar 21 \u2013 Apr 19',  element: 'Fire',    ruler: 'Mars',    traits: 'Courageous, Energetic, Optimistic, Confident' },
  { name: 'Taurus',      symbol: '\u2649', dates: 'Apr 20 \u2013 May 20',  element: 'Earth',   ruler: 'Venus',   traits: 'Reliable, Patient, Devoted, Sensual' },
  { name: 'Gemini',      symbol: '\u264A', dates: 'May 21 \u2013 Jun 20',  element: 'Air',     ruler: 'Mercury', traits: 'Adaptable, Curious, Witty, Expressive' },
  { name: 'Cancer',      symbol: '\u264B', dates: 'Jun 21 \u2013 Jul 22',  element: 'Water',   ruler: 'Moon',    traits: 'Intuitive, Nurturing, Empathic, Protective' },
  { name: 'Leo',         symbol: '\u264C', dates: 'Jul 23 \u2013 Aug 22',  element: 'Fire',    ruler: 'Sun',     traits: 'Charismatic, Generous, Creative, Passionate' },
  { name: 'Virgo',       symbol: '\u264D', dates: 'Aug 23 \u2013 Sep 22',  element: 'Earth',   ruler: 'Mercury', traits: 'Analytical, Practical, Detail-oriented, Helpful' },
  { name: 'Libra',       symbol: '\u264E', dates: 'Sep 23 \u2013 Oct 22',  element: 'Air',     ruler: 'Venus',   traits: 'Diplomatic, Graceful, Harmonious, Fair' },
  { name: 'Scorpio',     symbol: '\u264F', dates: 'Oct 23 \u2013 Nov 21',  element: 'Water',   ruler: 'Pluto',   traits: 'Intense, Passionate, Resourceful, Brave' },
  { name: 'Sagittarius', symbol: '\u2650', dates: 'Nov 22 \u2013 Dec 21',  element: 'Fire',    ruler: 'Jupiter', traits: 'Adventurous, Optimistic, Philosophical, Free-spirited' },
  { name: 'Capricorn',   symbol: '\u2651', dates: 'Dec 22 \u2013 Jan 19',  element: 'Earth',   ruler: 'Saturn',  traits: 'Ambitious, Disciplined, Patient, Wise' },
  { name: 'Aquarius',    symbol: '\u2652', dates: 'Jan 20 \u2013 Feb 18',  element: 'Air',     ruler: 'Uranus',  traits: 'Innovative, Independent, Humanitarian, Visionary' },
  { name: 'Pisces',      symbol: '\u2653', dates: 'Feb 19 \u2013 Mar 20',  element: 'Water',   ruler: 'Neptune', traits: 'Compassionate, Artistic, Intuitive, Dreamy' }
];

/**
 * 生成 Crystals by Zodiac 页面
 *
 * @param {Object} config
 * @param {string} config.zodiac       — 星座名，如 "Aries"
 * @param {string} config.dates        — 日期范围，如 "Mar 21 \u2013 Apr 19"
 * @param {string} config.element      — 元素，如 "Fire"
 * @param {string} config.ruler        — 守护星，如 "Mars"
 * @param {string} config.traits       — 性格关键词
 * @param {string} config.description  — 星座描述文案
 * @param {Array}  config.crystals     — [{name, subtitle, reason, image, link}]
 */
function generateZodiacPage(config) {
  var zodiac = config.zodiac || 'Aries';
  var dates = config.dates || 'Mar 21 \u2013 Apr 19';
  var element = config.element || 'Fire';
  var ruler = config.ruler || 'Mars';
  var traits = config.traits || 'Courageous, Energetic, Optimistic';
  var crystals = config.crystals || [];
  var slug = zodiac.toLowerCase();

  // ----------------------------------------------------------
  // Section 1: Hero — 星座名 + 日期
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/crystal-guide/" style="color:#ccc;">Crystal Guide</a> &gt; <span style="color:#fff;">' + zodiac + '</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Best Crystals for ' + zodiac, {
      fontSize: 44,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(dates, {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.description || 'Discover the crystals that resonate most powerfully with the energy of ' + zodiac + '. These carefully selected stones align with your celestial blueprint, amplifying your natural strengths and supporting your growth areas.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 星座特征 — 元素/守护星/性格关键词
  // ----------------------------------------------------------
  var traitItems = traits.split(',').map(function (t) { return t.trim(); });

  var traitCards = traitItems.map(function (trait) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('25', '50', '100')), [
      E.heading(trait, {
        fontSize: 18,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
      })
    ]);
  });

  var traitsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading(zodiac + ' at a Glance', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(30)
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#F9F5FF'
      }, E.rWidth('50', '100', '100')), [
        E.heading('Element: ' + element, {
          fontSize: 22,
          color: '#7C3AED',
          align: 'left',
          padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }),
        E.textEditor(
          'As a ' + element + ' sign, ' + zodiac + ' carries the dynamic energy of ' + element.toLowerCase() + ' \u2014 ' + (element === 'Fire' ? 'passionate, transformative, and full of vitality' : element === 'Earth' ? 'grounded, nurturing, and deeply connected to the material world' : element === 'Air' ? 'intellectual, communicative, and ever-seeking truth' : 'intuitive, emotional, and flowing with deep wisdom') + '.',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 24 }
        )
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#F9F5FF'
      }, E.rWidth('50', '100', '100')), [
        E.heading('Ruling Planet: ' + ruler, {
          fontSize: 22,
          color: '#7C3AED',
          align: 'left',
          padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }),
        E.textEditor(
          'Guided by ' + ruler + ', ' + zodiac + ' embodies qualities of ' + ruler.toLowerCase() + ' energy. Understanding this celestial influence helps you choose crystals that harmonize with your astrological DNA.',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 24 }
        )
      ])
    ]),
    E.heading('Key Personality Traits', {
      fontSize: 20,
      color: '#555555',
      align: 'center',
      padding: { unit: 'px', top: '25', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, traitCards)
  ]);

  // ----------------------------------------------------------
  // Section 3: 推荐水晶 — 3-5种水晶 + 为什么适合
  // ----------------------------------------------------------
  var crystalCards = crystals.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth(String(Math.floor(100 / crystals.length)), '50', '100')), [
      E.imageWidget(crystal.image || PLACEHOLDER, {
        width: 100,
        radius: 8
      }),
      E.heading(crystal.name, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        padding: { unit: 'px', top: '12', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        crystal.subtitle || '',
        { align: 'center', fontSize: 14, color: '#999999' }
      ),
      E.textEditor(
        crystal.reason || 'This crystal resonates deeply with ' + zodiac + ' energy, providing support and alignment.',
        { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
      ),
      E.buttonWidget('Explore ' + crystal.name, crystal.link || '/crystal-guide/' + crystal.name.toLowerCase().replace(/\s+/g, '-') + '-meaning')
    ]);
  });

  var crystalSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Recommended Crystals for ' + zodiac, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each of these crystals has been chosen for its unique resonance with ' + zodiac + ' energy. Discover why they are the perfect companions for your zodiac journey.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, crystalCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: 对应产品 — 产品列表占位
  // ----------------------------------------------------------
  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading(zodiac + ' Crystal Collection', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Browse our curated selection of crystal bracelets and sets, hand-picked to align with ' + zodiac + ' energy.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(6)
  ]);

  // ----------------------------------------------------------
  // Section 5: 12星座导航 — 其他11个星座快速链接网格
  // ----------------------------------------------------------
  var otherSigns = ALL_ZODIAC.filter(function (z) { return z.name !== zodiac; });
  var zodiacNavCards = otherSigns.map(function (sign) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('15', '15', '15', '15'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('25', '33', '50')), [
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
      E.buttonWidget('Explore', '/crystal-guide/' + sign.name.toLowerCase() + '-crystals')
    ]);
  });

  var zodiacNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Explore All Zodiac Signs', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every zodiac sign has its own unique crystal allies. Discover the stones that resonate with each sign\'s celestial energy.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, zodiacNavCards)
  ]);

  return [
    heroSection,
    traitsSection,
    crystalSection,
    productsSection,
    zodiacNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Aries 页面
// ============================================================
async function main() {
  var config = {
    zodiac: 'Aries',
    dates: 'Mar 21 \u2013 Apr 19',
    element: 'Fire',
    ruler: 'Mars',
    traits: 'Courageous, Energetic, Optimistic, Confident, Passionate',
    description: 'Aries, the first sign of the zodiac, blazes with the fire of new beginnings. Ruled by Mars, the planet of action and desire, Aries energy is bold, ambitious, and fearless. Discover the crystals that amplify your natural courage and help channel your powerful energy with intention.',
    crystals: [
      {
        name: 'Carnelian',
        subtitle: 'The Stone of Motivation',
        reason: 'Carnelian\'s fiery orange energy perfectly matches Aries\' passionate nature. It boosts confidence, creativity, and courage, helping you take bold action toward your dreams.',
        link: '/crystal-guide/carnelian-meaning'
      },
      {
        name: 'Red Jasper',
        subtitle: 'The Stone of Endurance',
        reason: 'A grounding stone that channels Aries\' intense energy into sustained, focused action. Red Jasper provides stability and stamina for your ambitious pursuits.',
        link: '/crystal-guide/red-jasper-meaning'
      },
      {
        name: 'Bloodstone',
        subtitle: 'The Stone of Courage',
        reason: 'Bloodstone has been worn by warriors for centuries. For Aries, it enhances courage, dispels negative energy, and promotes wise decision-making in the heat of passion.',
        link: '/crystal-guide/bloodstone-meaning'
      },
      {
        name: 'Clear Quartz',
        subtitle: 'The Master Healer',
        reason: 'Clear Quartz amplifies Aries\' natural leadership energy while bringing clarity of purpose. It helps you focus your abundant energy on what truly matters.',
        link: '/crystal-guide/clear-quartz-meaning'
      }
    ]
  };

  var data = generateZodiacPage(config);
  await E.createPage(
    'Best Crystals for ' + config.zodiac,
    config.zodiac.toLowerCase() + '-crystals',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateZodiacPage;
