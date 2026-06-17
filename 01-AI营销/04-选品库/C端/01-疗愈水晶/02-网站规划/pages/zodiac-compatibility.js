/**
 * Zodiac Compatibility 页面模板
 * URL: /zodiac-compatibility/[sign1]-[sign2]
 *
 * 5个Section:
 * 1. Hero — "[Sign1] and [Sign2] Compatibility" + 配对评分
 * 2. 配对分析 — 爱情/友情/工作三维度
 * 3. 推荐水晶 — 2-3种和谐水晶 + 产品链接
 * 4. 配对水晶使用指南 — 两人如何共同使用水晶
 * 5. 12x12矩阵导航 — 144个配对组合网格（12行x12列）
 *
 * 用法:
 *   node zodiac-compatibility.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.zodiac.crystal.url;

// ============================================================
// 12星座数据
// ============================================================
var ZODIAC_SIGNS = [
  { name: 'Aries',       symbol: '\u2648', element: 'Fire' },
  { name: 'Taurus',      symbol: '\u2649', element: 'Earth' },
  { name: 'Gemini',      symbol: '\u264A', element: 'Air' },
  { name: 'Cancer',      symbol: '\u264B', element: 'Water' },
  { name: 'Leo',         symbol: '\u264C', element: 'Fire' },
  { name: 'Virgo',       symbol: '\u264D', element: 'Earth' },
  { name: 'Libra',       symbol: '\u264E', element: 'Air' },
  { name: 'Scorpio',     symbol: '\u264F', element: 'Water' },
  { name: 'Sagittarius', symbol: '\u2650', element: 'Fire' },
  { name: 'Capricorn',   symbol: '\u2651', element: 'Earth' },
  { name: 'Aquarius',    symbol: '\u2652', element: 'Air' },
  { name: 'Pisces',      symbol: '\u2653', element: 'Water' }
];

/**
 * 生成 Zodiac Compatibility 页面
 *
 * @param {Object} config
 * @param {string} config.sign1          — 第一个星座名，如 "Leo"
 * @param {string} config.sign2          — 第二个星座名，如 "Libra"
 * @param {number} config.overallScore   — 总配对评分 (0-100)
 * @param {number} config.loveScore      — 爱情评分
 * @param {number} config.friendScore    — 友情评分
 * @param {number} config.workScore      — 工作评分
 * @param {string} config.summary        — 配对总评
 * @param {Object} config.loveAnalysis   — 爱情分析文案
 * @param {Object} config.friendAnalysis — 友情分析文案
 * @param {Object} config.workAnalysis   — 工作分析文案
 * @param {Array}  config.crystals       — [{name, subtitle, reason, image, productLink}]
 * @param {string} config.usageGuide     — 配对水晶使用指南
 */
function generateZodiacCompatPage(config) {
  var sign1 = config.sign1 || 'Leo';
  var sign2 = config.sign2 || 'Libra';
  var overallScore = config.overallScore || 75;
  var loveScore = config.loveScore || 80;
  var friendScore = config.friendScore || 70;
  var workScore = config.workScore || 72;

  var sign1Data = ZODIAC_SIGNS.find(function (s) { return s.name === sign1; }) || ZODIAC_SIGNS[0];
  var sign2Data = ZODIAC_SIGNS.find(function (s) { return s.name === sign2; }) || ZODIAC_SIGNS[1];
  var slug = sign1.toLowerCase() + '-' + sign2.toLowerCase();

  // 评分颜色
  function scoreColor(score) {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  }

  // 生成评分进度条 HTML
  function scoreBar(label, score) {
    return '<div style="margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
        '<span style="font-size:14px;color:#666;">' + label + '</span>' +
        '<span style="font-size:14px;font-weight:600;color:' + scoreColor(score) + ';">' + score + '%</span>' +
      '</div>' +
      '<div style="background:#eee;border-radius:10px;height:8px;overflow:hidden;">' +
        '<div style="background:' + scoreColor(score) + ';height:100%;width:' + score + '%;border-radius:10px;"></div>' +
      '</div>' +
    '</div>';
  }

  // ----------------------------------------------------------
  // Section 1: Hero — 配对名称 + 配对评分
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.zodiac.hero.url, id: 0, size: '', alt: IMAGES.zodiac.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/zodiac-compatibility/" style="color:#ccc;">Zodiac Compatibility</a> &gt; <span style="color:#fff;">' + sign1 + ' & ' + sign2 + '</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading(sign1Data.symbol + ' ' + sign1 + ' and ' + sign2 + ' ' + sign2Data.symbol + ' Compatibility', {
      fontSize: 40,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '8', left: '0', isLinked: '' }
    }),
    E.textEditor(
      '<div style="text-align:center;margin-bottom:15px;">' +
        '<span style="display:inline-block;background:' + scoreColor(overallScore) + ';color:#fff;font-size:36px;font-weight:700;padding:10px 30px;border-radius:50px;">' + overallScore + '%</span>' +
      '</div>' +
      '<div style="text-align:center;font-size:18px;color:#C4A1FF;font-weight:300;">Overall Compatibility Score</div>',
      { fontSize: 18, lineHeight: 28, responsive: false }
    ),
    E.textEditor(
      config.summary || sign1 + ' and ' + sign2 + ' share a dynamic cosmic connection that blends the fiery passion of ' + sign1Data.element + ' with the harmonious energy of ' + sign2Data.element + '. Together, they create a partnership rich in growth, learning, and mutual inspiration.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 配对分析 — 爱情/友情/工作三维度
  // ----------------------------------------------------------
  var analysisSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Compatibility Breakdown', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(25)
    }, [
      // 爱情
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFF1F2'
      }, E.rWidth('33', '100', '100')), [
        E.heading('\u2764 Love & Romance', {
          fontSize: 20,
          color: '#E11D48',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '<div style="text-align:center;font-size:32px;font-weight:700;color:#E11D48;margin-bottom:10px;">' + loveScore + '%</div>',
          { fontSize: 32, responsive: false }
        ),
        E.textEditor(
          (config.loveAnalysis && config.loveAnalysis.text) || 'In love, ' + sign1 + ' and ' + sign2 + ' create a passionate and dynamic bond. Their differing elemental energies create a magnetic attraction that keeps the spark alive, while their shared desire for growth helps them build a deep, meaningful connection that evolves over time.',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
        )
      ]),
      // 友情
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#EFF6FF'
      }, E.rWidth('33', '100', '100')), [
        E.heading('\u2709 Friendship', {
          fontSize: 20,
          color: '#2563EB',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '<div style="text-align:center;font-size:32px;font-weight:700;color:#2563EB;margin-bottom:10px;">' + friendScore + '%</div>',
          { fontSize: 32, responsive: false }
        ),
        E.textEditor(
          (config.friendAnalysis && config.friendAnalysis.text) || 'As friends, ' + sign1 + ' and ' + sign2 + ' balance each other beautifully. One brings fire and initiative, the other brings thoughtfulness and balance. Together, they make an unstoppable team that supports each other through every chapter of life.',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
        )
      ]),
      // 工作
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#F0FDF4'
      }, E.rWidth('33', '100', '100')), [
        E.heading('\u2605 Work & Partnership', {
          fontSize: 20,
          color: '#16A34A',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' }
        }),
        E.textEditor(
          '<div style="text-align:center;font-size:32px;font-weight:700;color:#16A34A;margin-bottom:10px;">' + workScore + '%</div>',
          { fontSize: 32, responsive: false }
        ),
        E.textEditor(
          (config.workAnalysis && config.workAnalysis.text) || 'In professional settings, ' + sign1 + ' and ' + sign2 + ' complement each other\'s working styles. Their combined energies create a productive synergy where creativity meets strategy, and ambition meets diplomacy.',
          { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
        )
      ])
    ]),
    E.spacer('20'),
    E.textEditor(
      scoreBar('Love & Romance', loveScore) +
      scoreBar('Friendship', friendScore) +
      scoreBar('Work & Partnership', workScore) +
      scoreBar('Overall', overallScore),
      { align: 'left', responsive: false }
    )
  ]);

  // ----------------------------------------------------------
  // Section 3: 推荐水晶 — 2-3种和谐水晶 + 产品链接
  // ----------------------------------------------------------
  var crystals = config.crystals || [];
  var crystalCards = crystals.map(function (crystal) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '25', '20'),
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
        fontWeight: '600',
        padding: { unit: 'px', top: '12', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(
        crystal.subtitle || '',
        { align: 'center', fontSize: 14, color: '#999999', lineHeight: 20 }
      ),
      E.textEditor(
        crystal.reason || 'A harmonizing crystal that bridges the energy of ' + sign1 + ' and ' + sign2 + ', creating balance and understanding between these two signs.',
        { align: 'left', fontSize: 15, color: '#666666', lineHeight: 23 }
      ),
      E.buttonWidget('Shop ' + crystal.name, crystal.productLink || '/product-category/' + crystal.name.toLowerCase().replace(/\s+/g, '-') + '-crystals')
    ]);
  });

  var crystalSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Harmonizing Crystals for ' + sign1 + ' & ' + sign2, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'These specially selected crystals help bridge the unique energies of ' + sign1 + ' and ' + sign2 + '. Whether worn individually or shared between partners, these stones promote harmony, understanding, and deeper connection.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, crystalCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: 配对水晶使用指南
  // ----------------------------------------------------------
  var usageSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('How ' + sign1 + ' & ' + sign2 + ' Can Use Crystals Together', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.textEditor(
          config.usageGuide || 'Crystals can be a beautiful shared practice that deepens the bond between ' + sign1 + ' and ' + sign2 + '. Here are powerful ways to use crystals together:<br><br><strong>Shared Intention Setting</strong> — Both partners hold the same crystal and set a shared intention for the relationship. This practice aligns your energies and creates a unified vision for your partnership.<br><br><strong>Crystal Exchange</strong> — Gift each other a crystal that resonates with the other person\'s sign. When you wear your partner\'s chosen stone, you carry a piece of their energy and intention with you throughout the day.<br><br><strong>Joint Meditation</strong> — Sit facing each other, each holding a crystal, and meditate together for 5-10 minutes. Focus on the energy flowing between you, letting the crystals amplify the love and understanding in your connection.<br><br><strong>Crystal Grid for Two</strong> — Create a small crystal grid that represents your relationship. Place it in a shared space as a constant energetic reminder of your bond and mutual intentions.',
          { align: 'left', fontSize: 16, color: '#555555', lineHeight: 26, responsive: false }
        )
      ]),
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('45', '100', '100')), [
        E.imageWidget(PLACEHOLDER, {
          width: 100,
          radius: 10
        })
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 5: 12x12矩阵导航 — 144个配对组合网格
  // ----------------------------------------------------------
  // 构建矩阵行（12行，每行12个单元格）
  var matrixHeaderHtml = '<div style="overflow-x:auto;">' +
    '<table style="width:100%;border-collapse:collapse;min-width:600px;">' +
    '<thead><tr><th style="padding:8px 4px;font-size:12px;color:#aaa;text-align:center;"></th>';

  ZODIAC_SIGNS.forEach(function (s) {
    matrixHeaderHtml += '<th style="padding:8px 2px;font-size:11px;color:#ccc;text-align:center;">' + s.symbol + '</th>';
  });
  matrixHeaderHtml += '</tr></thead><tbody>';

  var matrixRows = ZODIAC_SIGNS.map(function (rowSign) {
    var rowHtml = '<tr><td style="padding:8px 4px;font-size:12px;color:#aaa;font-weight:600;white-space:nowrap;">' + rowSign.symbol + ' ' + rowSign.name + '</td>';
    ZODIAC_SIGNS.forEach(function (colSign) {
      var isCurrentPair = (rowSign.name === sign1 && colSign.name === sign2) || (rowSign.name === sign2 && colSign.name === sign1);
      var pairSlug = rowSign.name.toLowerCase() + '-' + colSign.name.toLowerCase();
      var bgStyle = isCurrentPair ? 'background:#7C3AED;' : 'background:rgba(255,255,255,0.05);';
      var textStyle = isCurrentPair ? 'color:#fff;font-weight:700;' : 'color:#888;';
      rowHtml += '<td style="padding:4px 2px;text-align:center;' + bgStyle + 'border-radius:4px;">' +
        '<a href="/zodiac-compatibility/' + pairSlug + '" style="text-decoration:none;' + textStyle + 'font-size:11px;">' +
          rowSign.symbol + colSign.symbol +
        '</a></td>';
    });
    rowHtml += '</tr>';
    return rowHtml;
  }).join('');

  var matrixHtml = matrixHeaderHtml + matrixRows + '</tbody></table></div>';

  var matrixSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Zodiac Compatibility Matrix', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Explore all 144 zodiac compatibility combinations. Click any pair to discover their unique cosmic connection and the crystals that harmonize their energies.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.spacer('10'),
    E.htmlWidget(matrixHtml)
  ]);

  return [
    heroSection,
    analysisSection,
    crystalSection,
    usageSection,
    matrixSection
  ];
}

// ============================================================
// Main — 示例：生成 Leo & Libra 配对页面
// ============================================================
async function main() {
  var sign1Name = 'Leo';
  var sign2Name = 'Libra';
  var config = {
    sign1: sign1Name,
    sign2: sign2Name,
    overallScore: 78,
    loveScore: 82,
    friendScore: 75,
    workScore: 70,
    summary: 'Leo and Libra form one of the most charismatic and socially magnetic pairs in the zodiac. Fire meets Air, creating a brilliant flame of creativity, romance, and mutual admiration. Their shared love of beauty, harmony, and self-expression makes this a partnership that shines brightly in any room.',
    loveAnalysis: {
      text: 'In love, Leo brings the fire and passion, while Libra brings romance and grace. This combination creates a love story that feels like a grand adventure filled with beautiful moments. Leo\'s warmth and generosity perfectly complement Libra\'s desire for partnership and harmony. Together, they create a relationship that is both exciting and deeply loving.'
    },
    friendAnalysis: {
      text: 'As friends, Leo and Libra are the life of every gathering. They share an appreciation for art, culture, and the finer things in life. Leo\'s boldness encourages Libra to be more decisive, while Libra\'s diplomatic nature helps Leo navigate social situations with greater finesse. Their friendship is built on mutual respect and genuine admiration.'
    },
    workAnalysis: {
      text: 'In the workplace, Leo and Libra make an impressive team. Leo\'s natural leadership and creative vision pair beautifully with Libra\'s strategic thinking and ability to build consensus. Together, they can tackle ambitious projects with both confidence and grace, inspiring those around them with their collaborative energy.'
    },
    crystals: [
      {
        name: 'Rose Quartz',
        subtitle: 'The Stone of Unconditional Love',
        reason: 'Rose Quartz opens the heart chakra for both Leo and Libra, fostering the deep emotional connection that underpins their passionate bond. It softens Leo\'s pride and encourages Libra to express needs more directly, creating a love built on genuine vulnerability and trust.',
        productLink: '/product-category/rose-quartz-crystals'
      },
      {
        name: 'Citrine',
        subtitle: 'The Stone of Abundance',
        reason: 'Citrine carries the radiant energy of the Sun (Leo\'s ruler) while promoting the positivity and joy that Libra craves. Together, it amplifies their shared optimism and attracts abundance into their partnership, both emotionally and materially.',
        productLink: '/product-category/citrine-crystals'
      },
      {
        name: 'Lapis Lazuli',
        subtitle: 'The Stone of Truth & Friendship',
        reason: 'Lapis Lazuli enhances honest communication between Leo and Libra, helping them express their needs without ego or avoidance. It deepens their intellectual connection and supports the meaningful conversations that keep their bond strong.',
        productLink: '/product-category/lapis-lazuli-crystals'
      }
    ],
    usageGuide: 'Leo and Libra can create a beautiful crystal practice together that celebrates their unique dynamic. Here are tailored ways for this Fire-Air pair to work with crystals:<br><br><strong>The Couples\' Bracelet Ritual</strong> — Each partner chooses a crystal bracelet that resonates with their own sign, then exchanges it with their partner. Leo might wear Rose Quartz (Libra\'s stone of love) while Libra wears Citrine (Leo\'s stone of radiance). This exchange symbolizes carrying each other\'s energy.<br><br><strong>Evening Wind-Down</strong> — Place a shared Selenite crystal between you during evening conversations or dinner. Selenite\'s purifying energy clears the day\'s stress and creates a sacred space for authentic connection.<br><br><strong>Creative Vision Board</strong> — As a couple known for your shared love of beauty, create a vision board together adorned with crystals. Place Citrine for abundance, Rose Quartz for love, and Lapis Lazuli for clear communication around your shared goals and dreams.'
  };

  var data = generateZodiacCompatPage(config);
  await E.createPage(
    sign1Name + ' and ' + sign2Name + ' Compatibility',
    sign1Name.toLowerCase() + '-' + sign2Name.toLowerCase(),
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateZodiacCompatPage;
