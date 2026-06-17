/**
 * Moon Calendar 页面模板
 * URL: /moon-calendar
 *
 * 5个Section:
 * 1. 标题 — "Moon Calendar 2026"
 * 2. 当前月相 — 月相名称+可视化+推荐水晶
 * 3. 12月月相日历 — 每月新月+满月日期（HTML 表格）
 * 4. 下一次预告 — 新月/满月日期+星座+主题+推荐水晶
 * 5. 月相百科 — New/Waxing/Full/Waning 4个月相解释
 *
 * 用法:
 *   node moon-calendar.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.shared.card.url;
var MOON_PHASE_IMAGE = IMAGES.moonCalendar.currentPhase.url;

// ============================================================
// 2026 年月相数据（示例数据，上线前替换为精确天文数据）
// ============================================================
var MOON_PHASES_2026 = [
  { month: 'January',   newMoon: 'Jan 6',  fullMoon: 'Jan 21',  newZodiac: 'Capricorn',  fullZodiac: 'Leo' },
  { month: 'February',  newMoon: 'Feb 5',  fullMoon: 'Feb 19',  newZodiac: 'Aquarius',   fullZodiac: 'Virgo' },
  { month: 'March',     newMoon: 'Mar 6',  fullMoon: 'Mar 21',  newZodiac: 'Pisces',     fullZodiac: 'Libra' },
  { month: 'April',     newMoon: 'Apr 5',  fullMoon: 'Apr 20',  newZodiac: 'Aries',      fullZodiac: 'Scorpio' },
  { month: 'May',       newMoon: 'May 4',  fullMoon: 'May 19',  newZodiac: 'Taurus',     fullZodiac: 'Sagittarius' },
  { month: 'June',      newMoon: 'Jun 3',  fullMoon: 'Jun 18',  newZodiac: 'Gemini',     fullZodiac: 'Capricorn' },
  { month: 'July',      newMoon: 'Jul 2',  fullMoon: 'Jul 17',  newZodiac: 'Cancer',     fullZodiac: 'Aquarius' },
  { month: 'August',    newMoon: 'Aug 1',  fullMoon: 'Aug 16',  newZodiac: 'Leo',        fullZodiac: 'Pisces' },
  { month: 'September', newMoon: 'Aug 30', fullMoon: 'Sep 14',  newZodiac: 'Virgo',      fullZodiac: 'Aries' },
  { month: 'October',   newMoon: 'Sep 29', fullMoon: 'Oct 14',  newZodiac: 'Libra',      fullZodiac: 'Taurus' },
  { month: 'November',  newMoon: 'Oct 28', fullMoon: 'Nov 13',  newZodiac: 'Scorpio',    fullZodiac: 'Gemini' },
  { month: 'December',  newMoon: 'Nov 27', fullMoon: 'Dec 12',  newZodiac: 'Sagittarius', fullZodiac: 'Cancer' }
];

/**
 * 生成 Moon Calendar 页面
 *
 * @param {Object} config
 * @param {string} config.currentPhase       — 当前月相名称
 * @param {string} config.currentPhaseDesc   — 当前月相描述
 * @param {string} config.currentPhaseImage  — 月相可视化图片 URL
 * @param {Array}  config.currentCrystals    — [{name, link}] 推荐水晶
 * @param {Object} config.nextNewMoon        — {date, zodiac, theme, crystals: [{name, link}]}
 * @param {Object} config.nextFullMoon       — {date, zodiac, theme, crystals: [{name, link}]}
 * @param {Array}  config.calendarData       — 月相日历数据（12个月）
 */
function generateMoonCalendarPage(config) {
  var currentPhase = (config.currentPhase || 'Waxing Crescent');
  var currentPhaseDesc = config.currentPhaseDesc || 'The Waxing Crescent moon is a time of intention setting and new beginnings. As the moon grows, so does your energy and momentum. This is the perfect time to set crystal-charged intentions and take the first steps toward your goals.';
  var currentPhaseImage = config.currentPhaseImage || MOON_PHASE_IMAGE;
  var currentCrystals = config.currentCrystals || [
    { name: 'Moonstone', link: '/gemstone/moonstone-meaning' },
    { name: 'Clear Quartz', link: '/gemstone/clear-quartz-meaning' },
    { name: 'Selenite', link: '/gemstone/selenite-meaning' }
  ];
  var nextNewMoon = config.nextNewMoon || { date: 'May 4, 2026', zodiac: 'Taurus', theme: 'Abundance & Grounding', crystals: [{ name: 'Citrine', link: '/gemstone/citrine-meaning' }, { name: 'Green Aventurine', link: '/gemstone/green-aventurine-meaning' }] };
  var nextFullMoon = config.nextFullMoon || { date: 'May 19, 2026', zodiac: 'Sagittarius', theme: 'Expansion & Adventure', crystals: [{ name: 'Lapis Lazuli', link: '/gemstone/lapis-lazuli-meaning' }, { name: 'Labradorite', link: '/gemstone/labradorite-meaning' }] };
  var calendarData = config.calendarData || MOON_PHASES_2026;

  // ----------------------------------------------------------
  // Section 1: 标题 — "Moon Calendar 2026"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '50', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_image: {
      url: IMAGES.moonCalendar.hero.url,
      id: 0, size: '', alt: IMAGES.moonCalendar.hero.alt, source: 'library'
    },
    background_position: 'center center',
    background_repeat: 'no-repeat',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: '#0D0B1A',
    background_overlay_opacity: { unit: 'px', size: 0.74, sizes: [] }
  }, [
    E.heading('Moon Calendar 2026', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Align your crystal practice with the rhythms of the moon. Discover the best crystals for each lunar phase and harness celestial energy for healing, manifestation, and spiritual growth.',
      { fontSize: 18, color: '#BBBBBB', lineHeight: 28, extra: { text_color: '#BBBBBB' } }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 当前月相 — 月相名称+可视化+推荐水晶
  // ----------------------------------------------------------
  var crystalButtons = currentCrystals.map(function (c) {
    return E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
      E.buttonWidget(c.name, c.link)
    ]);
  });

  var currentPhaseSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Current Moon Phase', {
      fontSize: 14,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '600',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' },
      extra: { title_color: '#C4A1FF' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('40', '50', '100')), [
        E.imageWidget(currentPhaseImage, {
          width: 80,
          radius: 50
        })
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('60', '50', '100')), [
        E.heading(currentPhase, {
          fontSize: 32,
          color: '#FFFFFF',
          align: 'left',
          fontWeight: '700',
          padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
        }),
        E.textEditor(
          currentPhaseDesc,
          { align: 'left', fontSize: 16, color: '#CCCCCC', lineHeight: 26, extra: { text_color: '#CCCCCC' } }
        ),
        E.heading('Recommended Crystals', {
          fontSize: 16,
          color: '#C4A1FF',
          align: 'left',
          fontWeight: '600',
          padding: { unit: 'px', top: '15', right: '0', bottom: '8', left: '0', isLinked: '' },
          extra: { title_color: '#C4A1FF' }
        }),
        E.wrap({
          flex_direction: 'row',
          flex_gap: E.gap(10),
          flex_wrap: 'wrap'
        }, crystalButtons)
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 3: 12月月相日历 — HTML 表格
  // ----------------------------------------------------------
  var calendarRows = calendarData.map(function (m) {
    return '<tr>' +
      '<td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#333;">' + m.month + '</td>' +
      '<td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;color:#666;">' + m.newMoon + '</td>' +
      '<td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;color:#999;font-size:13px;">' + m.newZodiac + '</td>' +
      '<td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;color:#666;">' + m.fullMoon + '</td>' +
      '<td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;color:#999;font-size:13px;">' + m.fullZodiac + '</td>' +
      '</tr>';
  }).join('');

  var calendarTableHtml =
    '<table style="width:100%;border-collapse:collapse;font-size:15px;">' +
    '<thead>' +
    '<tr style="background:#F9F5FF;">' +
    '<th style="padding:14px 16px;text-align:left;color:#7C3AED;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Month</th>' +
    '<th style="padding:14px 16px;text-align:left;color:#7C3AED;font-size:14px;text-transform:uppercase;letter-spacing:1px;">New Moon</th>' +
    '<th style="padding:14px 16px;text-align:left;color:#7C3AED;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Sign</th>' +
    '<th style="padding:14px 16px;text-align:left;color:#7C3AED;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Full Moon</th>' +
    '<th style="padding:14px 16px;text-align:left;color:#7C3AED;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Sign</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + calendarRows + '</tbody>' +
    '</table>';

  var calendarSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('2026 Moon Phase Calendar', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Plan your crystal rituals and intentions around the lunar cycle. New Moons are for planting seeds; Full Moons are for release and gratitude.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.htmlWidget(calendarTableHtml)
  ]);

  // ----------------------------------------------------------
  // Section 4: 下一次预告 — 新月/满月
  // ----------------------------------------------------------
  function buildUpcomingBlock(title, data, bg) {
    var crystalBtns = (data.crystals || []).map(function (c) {
      return E.wrap(Object.assign({ flex_direction: 'column' }, E.rWidth('auto', 'auto', 'auto')), [
        E.buttonWidget(c.name, c.link)
      ]);
    });

    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('30', '30', '30', '30'),
      background_background: 'classic',
      background_color: bg
    }, E.rWidth('50', '100', '100')), [
      E.heading(title, {
        fontSize: 24,
        color: '#333333',
        align: 'left',
        fontWeight: '700',
        padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
      }),
      E.heading(data.date || 'TBD', {
        fontSize: 20,
        color: '#7C3AED',
        align: 'left',
        fontWeight: '400',
        padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
      }),
      E.textEditor(
        '<strong>In ' + (data.zodiac || '') + '</strong> \u2014 Theme: ' + (data.theme || ''),
        { align: 'left', fontSize: 15, color: '#666666', lineHeight: 22 }
      ),
      E.textEditor(
        'Recommended crystals for this lunar event:',
        { align: 'left', fontSize: 14, color: '#888888', lineHeight: 20 }
      ),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(10),
        flex_wrap: 'wrap'
      }, crystalBtns)
    ]);
  }

  var upcomingSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Upcoming Lunar Events', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(25)
    }, [
      buildUpcomingBlock('Next New Moon', nextNewMoon, '#FFFFFF'),
      buildUpcomingBlock('Next Full Moon', nextFullMoon, '#FFFFFF')
    ])
  ]);

  // ----------------------------------------------------------
  // Section 5: 月相百科 — 4个月相解释
  // ----------------------------------------------------------
  var moonPhases = [
    {
      title: 'New Moon',
      content: 'The New Moon marks the beginning of the lunar cycle \u2014 a time of fresh starts and new intentions. The sky is dark, inviting you to turn inward, reflect, and plant the seeds of what you wish to manifest. This is the most powerful time for setting crystal-charged intentions. Place your crystals under the night sky, hold them close, and speak your desires into existence. Best crystals: Moonstone, Clear Quartz, Labradorite.'
    },
    {
      title: 'Waxing Moon',
      content: 'As the moon grows from a sliver to full luminance, the Waxing phase is a time of building energy, taking action, and nurturing your goals. Your intentions from the New Moon begin to take shape. This is the time to actively work toward your dreams, charge your crystals in the growing moonlight, and practice gratitude for progress. Best crystals: Citrine, Green Aventurine, Carnelian.'
    },
    {
      title: 'Full Moon',
      content: 'The Full Moon is the peak of lunar energy \u2014 a time of culmination, clarity, and release. Everything you\'ve been building reaches its fullest expression. It\'s also the most powerful time for cleansing and charging your crystals under the moonlight. Use this energy to celebrate wins, release what no longer serves you, and express deep gratitude. Best crystals: Selenite, Amethyst, Moonstone.'
    },
    {
      title: 'Waning Moon',
      content: 'As the moon shrinks back toward darkness, the Waning phase invites reflection, release, and rest. This is a time for letting go of habits, thoughts, and energies that no longer align with your path. Cleanse your crystals, practice self-care, and create space for what\'s coming in the next cycle. The Waning Moon teaches us the wisdom of surrender. Best crystals: Black Tourmaline, Smoky Quartz, Lepidolite.'
    }
  ];

  var phaseCards = moonPhases.map(function (phase) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('25', '25', '25', '25'),
      background_background: 'classic',
      background_color: '#FAFAFA'
    }, E.rWidth('25', '50', '100')), [
      E.heading(phase.title, {
        fontSize: 20,
        color: '#333333',
        align: 'center',
        fontWeight: '700',
        padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
      }),
      E.textEditor(
        phase.content,
        { align: 'left', fontSize: 14, color: '#666666', lineHeight: 22 }
      )
    ]);
  });

  var encyclopediaSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Understanding Moon Phases', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each phase of the moon carries a unique energy that can amplify your crystal practice. Learn how to align your rituals with the lunar cycle for maximum effect.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, phaseCards)
  ]);

  return [
    heroSection,
    currentPhaseSection,
    calendarSection,
    upcomingSection,
    encyclopediaSection
  ];
}

// ============================================================
// Main — 示例：生成 Moon Calendar 页面
// ============================================================
async function main() {
  var config = {
    currentPhase: 'Waxing Crescent',
    currentPhaseDesc: 'The Waxing Crescent moon invites you to nurture the intentions you set during the New Moon. As the silver sliver grows in the night sky, your dreams begin to take root. Hold your crystals close, affirm your desires, and take one small step toward your vision tonight.',
    nextNewMoon: {
      date: 'May 4, 2026',
      zodiac: 'Taurus',
      theme: 'Abundance, Grounding & Material Intentions',
      crystals: [
        { name: 'Citrine', link: '/gemstone/citrine-meaning' },
        { name: 'Green Aventurine', link: '/gemstone/green-aventurine-meaning' },
        { name: 'Pyrite', link: '/gemstone/pyrite-meaning' }
      ]
    },
    nextFullMoon: {
      date: 'May 19, 2026',
      zodiac: 'Sagittarius',
      theme: 'Expansion, Adventure & Spiritual Growth',
      crystals: [
        { name: 'Lapis Lazuli', link: '/gemstone/lapis-lazuli-meaning' },
        { name: 'Labradorite', link: '/gemstone/labradorite-meaning' }
      ]
    }
  };

  var data = generateMoonCalendarPage(config);
  await E.createPage('Moon Calendar 2026', 'moon-calendar', data, 'draft');
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateMoonCalendarPage;
