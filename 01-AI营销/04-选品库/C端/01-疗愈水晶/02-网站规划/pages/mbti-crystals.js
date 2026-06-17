/**
 * MBTI & Crystals 页面模板
 * URL: /mbti-crystals/[mbti-type]
 *
 * 6个Section:
 * 1. Hero — "Best Crystals for [MBTI Type] Personality"
 * 2. MBTI性格解读 — 核心特征/优势/挑战（3列卡片）
 * 3. 推荐水晶 — 3-5种水晶 x 为什么适合 + 产品链接
 * 4. MBTI x 水晶使用指南 — 该性格如何有效使用水晶
 * 5. 16型导航 — 16个MBTI类型网格
 * 6. 对应产品 — wdProductsWidget
 *
 * 用法:
 *   node mbti-crystals.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.mbti.typeCard.url;

// ============================================================
// 16种 MBTI 类型数据
// ============================================================
var MBTI_TYPES = [
  { code: 'INTJ', name: 'The Architect',   group: 'Analysts' },
  { code: 'INTP', name: 'The Logician',    group: 'Analysts' },
  { code: 'ENTJ', name: 'The Commander',   group: 'Analysts' },
  { code: 'ENTP', name: 'The Debater',     group: 'Analysts' },
  { code: 'INFJ', name: 'The Advocate',    group: 'Diplomats' },
  { code: 'INFP', name: 'The Mediator',    group: 'Diplomats' },
  { code: 'ENFJ', name: 'The Protagonist', group: 'Diplomats' },
  { code: 'ENFP', name: 'The Campaigner',  group: 'Diplomats' },
  { code: 'ISTJ', name: 'The Logistician', group: 'Sentinels' },
  { code: 'ISFJ', name: 'The Defender',    group: 'Sentinels' },
  { code: 'ESTJ', name: 'The Executive',   group: 'Sentinels' },
  { code: 'ESFJ', name: 'The Consul',      group: 'Sentinels' },
  { code: 'ISTP', name: 'The Virtuoso',    group: 'Explorers' },
  { code: 'ISFP', name: 'The Adventurer',  group: 'Explorers' },
  { code: 'ESTP', name: 'The Entrepreneur',group: 'Explorers' },
  { code: 'ESFP', name: 'The Entertainer', group: 'Explorers' }
];

/**
 * 生成 MBTI & Crystals 页面
 *
 * @param {Object} config
 * @param {string} config.mbtiType      — MBTI 类型代码，如 "INFJ"
 * @param {string} config.mbtiName      — MBTI 昵称，如 "The Advocate"
 * @param {string} config.group         — 分组名，如 "Diplomats"
 * @param {string} config.description   — MBTI 类型概述
 * @param {Object} config.traits        — { strengths: [...], challenges: [...], core: [...] }
 * @param {Array}  config.crystals      — [{name, subtitle, reason, image, link}]
 * @param {string} config.usageGuide    — 水晶使用指南文案
 */
function generateMbtiPage(config) {
  var mbtiType = config.mbtiType || 'INFJ';
  var mbtiName = config.mbtiName || 'The Advocate';
  var group = config.group || 'Diplomats';
  var crystals = config.crystals || [];
  var traits = config.traits || {
    core: ['Intuitive', 'Empathic', 'Idealistic', 'Visionary'],
    strengths: ['Deep empathy', 'Creative vision', 'Principled action'],
    challenges: ['Perfectionism', 'Burnout risk', 'Overthinking']
  };

  // ----------------------------------------------------------
  // Section 1: Hero — "Best Crystals for [MBTI Type] Personality"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.mbti.hero.url, id: 0, size: '', alt: IMAGES.mbti.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/mbti-crystals/" style="color:#ccc;">MBTI & Crystals</a> &gt; <span style="color:#fff;">' + mbtiType + '</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Best Crystals for ' + mbtiType + ' Personality', {
      fontSize: 42,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(mbtiName + ' \u2014 ' + group + ' Group', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.description || mbtiType + ' (' + mbtiName + ') is one of the rarest and most fascinating personality types in the MBTI framework. Discover the crystals that naturally align with your unique energy signature, amplifying your strengths and supporting your growth areas.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: MBTI性格解读 — 核心特征/优势/挑战（3列卡片）
  // ----------------------------------------------------------
  var coreTraitsHtml = traits.core.map(function (t) {
    return '<span style="display:inline-block;background:rgba(124,58,237,0.1);color:#7C3AED;padding:4px 12px;border-radius:20px;margin:3px;font-size:14px;">' + t + '</span>';
  }).join(' ');

  var strengthsHtml = traits.strengths.map(function (s) {
    return '<div style="padding:6px 0;font-size:15px;color:#555;">&#10003; ' + s + '</div>';
  }).join('');

  var challengesHtml = traits.challenges.map(function (c) {
    return '<div style="padding:6px 0;font-size:15px;color:#555;">&#9679; ' + c + '</div>';
  }).join('');

  var traitSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Understanding the ' + mbtiType + ' Personality', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(25)
    }, [
      // 核心特征
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#F9F5FF'
      }, E.rWidth('33', '100', '100')), [
        E.heading('Core Traits', {
          fontSize: 20,
          color: '#7C3AED',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }),
        E.textEditor(
          coreTraitsHtml,
          { align: 'center', fontSize: 14, lineHeight: 22, responsive: false }
        )
      ]),
      // 优势
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#F0FDF4'
      }, E.rWidth('33', '100', '100')), [
        E.heading('Strengths', {
          fontSize: 20,
          color: '#10B981',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }),
        E.textEditor(
          strengthsHtml,
          { align: 'left', fontSize: 15, lineHeight: 24, responsive: false }
        )
      ]),
      // 挑战
      E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('25', '25', '25', '25'),
        background_background: 'classic',
        background_color: '#FFF7ED'
      }, E.rWidth('33', '100', '100')), [
        E.heading('Growth Areas', {
          fontSize: 20,
          color: '#F97316',
          align: 'center',
          fontWeight: '600',
          padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
        }),
        E.textEditor(
          challengesHtml,
          { align: 'left', fontSize: 15, lineHeight: 24, responsive: false }
        )
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 3: 推荐水晶 — 3-5种水晶 x 为什么适合 + 产品链接
  // ----------------------------------------------------------
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
        crystal.reason || 'This crystal aligns beautifully with ' + mbtiType + ' energy, providing the exact support your personality type needs.',
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
    E.heading('Recommended Crystals for ' + mbtiType, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Based on the unique personality dynamics of ' + mbtiType + ' (' + mbtiName + '), these crystals have been carefully selected to complement your natural energy patterns and support your personal growth journey.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, crystalCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: MBTI x 水晶使用指南
  // ----------------------------------------------------------
  var usageGuideSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('How ' + mbtiType + ' Can Best Work With Crystals', {
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
          config.usageGuide || 'As an ' + mbtiType + ', your relationship with crystals is uniquely shaped by your personality architecture. Here is a personalized guide to maximizing your crystal practice:<br><br><strong>Wear With Intention</strong> — For ' + mbtiType + ', wearing a crystal bracelet is not just about aesthetics. Each time you notice the weight of the stone on your wrist, let it serve as a mindful anchor, bringing you back to your intention for the day.<br><br><strong>Meditation Enhancement</strong> — Hold your recommended crystal during meditation. As a ' + mbtiName + ', your natural tendency toward deep thought can be channeled into powerful visualization when supported by the right stone\'s frequency.<br><br><strong>Environmental Placement</strong> — Place crystals in your workspace and sleeping area. ' + mbtiType + ' personalities are deeply affected by their environment, and having the right crystals nearby creates a supportive energy field throughout your day.',
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
  // Section 5: 16型导航 — 16个MBTI类型网格
  // ----------------------------------------------------------
  var groups = {
    'Analysts':   { color: '#3B82F6', types: [] },
    'Diplomats':  { color: '#10B981', types: [] },
    'Sentinels':  { color: '#F59E0B', types: [] },
    'Explorers':  { color: '#EF4444', types: [] }
  };
  MBTI_TYPES.forEach(function (t) {
    if (groups[t.group]) groups[t.group].types.push(t);
  });

  var groupSections = Object.keys(groups).map(function (groupName) {
    var g = groups[groupName];
    var typeCards = g.types.map(function (t) {
      var isCurrent = t.code === mbtiType;
      return E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('15', '10', '15', '10'),
        background_background: 'classic',
        background_color: isCurrent ? '#7C3AED' : '#FAFAFA'
      }, E.rWidth('25', '50', '50')), [
        E.heading(t.code, {
          fontSize: 18,
          color: isCurrent ? '#FFFFFF' : '#333333',
          align: 'center',
          fontWeight: '700',
          padding: { unit: 'px', top: '0', right: '0', bottom: '3', left: '0', isLinked: '' }
        }),
        E.textEditor(
          t.name,
          { align: 'center', fontSize: 12, color: isCurrent ? '#DDDDDD' : '#999999', lineHeight: 16 }
        ),
        !isCurrent ? E.buttonWidget('Explore', '/mbti-crystals/' + t.code.toLowerCase()) : E.spacer('5')
      ]);
    });

    return E.wrap({
      flex_direction: 'column',
      content_width: 'full'
    }, [
      E.heading(groupName, {
        fontSize: 16,
        color: g.color,
        align: 'left',
        fontWeight: '600',
        extra: { title_color: g.color },
        padding: { unit: 'px', top: '0', right: '0', bottom: '8', left: '0', isLinked: '' }
      }),
      E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(10),
        flex_wrap: 'wrap',
        content_width: 'full'
      }, typeCards)
    ]);
  });

  var navSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Explore All 16 MBTI Types', {
      fontSize: 28,
      color: '#FFFFFF',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every personality type has its own unique crystal allies. Discover which stones resonate with your MBTI type and unlock a deeper connection to your authentic self.',
      { fontSize: 16, color: '#AAAAAA', lineHeight: 24 }
    ),
    E.spacer('10')
  ].concat(groupSections));

  // ----------------------------------------------------------
  // Section 6: 对应产品 — wdProductsWidget
  // ----------------------------------------------------------
  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading(mbtiType + ' Crystal Bracelet Collection', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Curated crystal bracelets chosen specifically for the ' + mbtiType + ' personality. Each piece is ethically sourced, energetically cleansed, and ready to support your unique journey.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wdProductsWidget(6)
  ]);

  return [
    heroSection,
    traitSection,
    crystalSection,
    usageGuideSection,
    navSection,
    productsSection
  ];
}

// ============================================================
// Main — 示例：生成 INFJ 页面
// ============================================================
async function main() {
  var config = {
    mbtiType: 'INFJ',
    mbtiName: 'The Advocate',
    group: 'Diplomats',
    description: 'INFJ, known as "The Advocate," is the rarest of all MBTI types, making up only about 2% of the population. With a unique blend of idealism and determination, INFJs are driven by a deep sense of purpose and an unwavering desire to make the world a better place. Their rich inner world, powerful intuition, and profound empathy make them natural healers, counselors, and visionaries.',
    traits: {
      core: ['Introverted', 'Intuitive', 'Feeling', 'Judging', 'Empathic', 'Visionary'],
      strengths: ['Deep empathy and understanding', 'Creative and visionary thinking', 'Strong sense of purpose and conviction', 'Passionate commitment to ideals'],
      challenges: ['Perfectionism and self-doubt', 'Prone to burnout from over-giving', 'Difficulty with conflict and confrontation', 'Overthinking and analysis paralysis']
    },
    crystals: [
      {
        name: 'Amethyst',
        subtitle: 'The Stone of Peace',
        reason: 'Amethyst resonates deeply with the INFJ\'s spiritual nature, enhancing your already powerful intuition while providing the calm and clarity you need to navigate your complex inner world. It protects your energy from overwhelm.',
        productLink: '/product-category/amethyst-crystals'
      },
      {
        name: 'Labradorite',
        subtitle: 'The Stone of Magic',
        reason: 'Labradorite is the ultimate stone for the INFJ\'s transformative energy. It strengthens your natural psychic abilities, protects your aura from energy drain, and helps you trust the insights that flow from your deep intuition.',
        productLink: '/product-category/labradorite-crystals'
      },
      {
        name: 'Rose Quartz',
        subtitle: 'The Stone of Love',
        reason: 'As an INFJ, you pour so much love into others. Rose Quartz reminds you to extend that same compassion to yourself. It supports self-love, emotional healing, and the heart-centered living that comes naturally to you.',
        productLink: '/product-category/rose-quartz-crystals'
      },
      {
        name: 'Black Tourmaline',
        subtitle: 'The Shield Stone',
        reason: 'INFJs are highly sensitive to the energies of people around them. Black Tourmaline creates a powerful protective boundary, grounding your energy and shielding you from absorbing others\' negativity or emotional weight.',
        productLink: '/product-category/black-tourmaline-crystals'
      }
    ],
    usageGuide: 'As an INFJ, your relationship with crystals is uniquely profound. Your natural intuition allows you to sense the subtle energy of each stone in ways other types may not experience. Here is how to deepen your crystal practice:<br><br><strong>The Morning Ritual</strong> — Before putting on your bracelet each morning, hold it in your hands, close your eyes, and set a specific intention. INFJs thrive when their actions are aligned with meaning, and this small ritual transforms a simple accessory into a powerful tool for purposeful living.<br><br><strong>The Evening Release</strong> — At night, remove your crystal bracelet and place it on a Selenite charging plate. As you do, consciously release any emotional weight you\'ve absorbed during the day. This practice is essential for INFJs, who tend to carry the world\'s burdens on their shoulders.<br><br><strong>Meditation Amplifier</strong> — During meditation, hold a crystal that resonates with your current focus. Your rich inner world and natural visualization abilities make you uniquely equipped to receive the crystal\'s messages and integrate its energy.'
  };

  var data = generateMbtiPage(config);
  await E.createPage(
    'Best Crystals for ' + config.mbtiType + ' (' + config.mbtiName + ')',
    config.mbtiType.toLowerCase(),
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateMbtiPage;
