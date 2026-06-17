/**
 * Angel Numbers 模板页
 * URL: /angel-numbers/[number]-meaning
 *
 * 4个Section:
 * 1. Hero — "Angel Number [XXX] Meaning"
 * 2. 数字详情 — 6段式模板: 数字含义/灵性解读/爱情关系/事业财富/Best Crystals/冥想指南
 * 3. 对应水晶 — 推荐水晶+产品链接
 * 4. 数字范围导航 — 000-999索引
 *
 * 函数: generateAngelNumberPage(config) 参数化数字/含义/水晶
 *
 * 用法:
 *   node angel-numbers.js
 *   或在其他脚本中: var gen = require('./angel-numbers'); gen(config);
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.angelNumbers.product.url;

// ============================================================
// 默认配置 (111)
// ============================================================
var DEFAULT_CONFIG = {
  number: '111',
  title: 'Angel Number 111',
  subtitle: 'New Beginnings, Intuition, and Spiritual Awakening',

  // 6段式内容
  sections: {
    meaning: {
      heading: 'What Does Angel Number 111 Mean?',
      content: 'Angel Number 111 is one of the most powerful signs from the universe. When you repeatedly see 111, it is a direct message from your guardian angels that a new chapter of your life is about to begin. The number 1 represents fresh starts, independence, and initiative — and when it appears three times, its energy is amplified exponentially. Your angels are telling you that your thoughts are manifesting rapidly right now, so it is essential to focus on what you truly desire rather than what you fear.'
    },
    spiritual: {
      heading: 'Spiritual Significance of 111',
      content: 'Spiritually, Angel Number 111 is a wake-up call from the divine realm. It signals that your spiritual gifts are awakening and your connection to higher consciousness is strengthening. This number invites you to trust your intuition, pay attention to your inner voice, and recognize that you are being divinely guided. Meditation, prayer, and mindfulness practices are especially powerful during this time. The universe is opening a gateway of spiritual growth — walk through it with faith and courage.'
    },
    love: {
      heading: 'Angel Number 111 in Love & Relationships',
      content: 'In matters of the heart, Angel Number 111 signifies new beginnings and the manifestation of love. If you are single, this number is a sign that love is on its way — stay open and optimistic. If you are in a relationship, 111 encourages you to bring fresh energy into your partnership, communicate your deepest desires, and co-create the relationship of your dreams. For twin flames, 111 is a powerful confirmation that your reunion or next stage of growth is imminent.'
    },
    career: {
      heading: 'Angel Number 111 in Career & Finances',
      content: 'When it comes to career and wealth, Angel Number 111 is an extremely positive omen. It signals that new opportunities, creative ideas, and financial breakthroughs are aligning for you. Your angels are encouraging you to take bold action toward your professional goals. This is not a time to play small — the universe is supporting your ambitions. Trust your instincts, start that project, pitch that idea, or launch that business. Abundance flows when you align your actions with your higher purpose.'
    },
    crystals: {
      heading: 'Best Crystals for Angel Number 111',
      content: 'Angel Number 111 carries the energy of new beginnings and manifestation. These crystals amplify that energy and help you align with the divine messages you are receiving.',
      items: [
        { name: 'Clear Quartz', reason: 'The Master Healer amplifies your intentions and clarifies the messages from your angels. Use Clear Quartz during meditation to strengthen your connection to divine guidance.', link: '/product-category/clear-quartz-crystals' },
        { name: 'Citrine', reason: 'The Stone of Abundance resonates with 111\'s manifestation energy. Citrine helps you attract the new opportunities and wealth that this angel number is bringing into your life.', link: '/product-category/citrine-crystals' },
        { name: 'Selenite', reason: 'The Stone of Clarity opens your crown chakra to receive angelic messages more clearly. Selenite creates a peaceful, high-vibration space for spiritual communication.', link: '/product-category/selenite-crystals' }
      ]
    },
    meditation: {
      heading: 'Meditation Guide for Angel Number 111',
      content: 'To fully receive the blessings of Angel Number 111, practice this simple meditation: Find a quiet space and hold your chosen crystal in your receiving hand (left hand). Close your eyes and take seven deep breaths. Visualize the number 111 glowing with golden light above your head. With each inhale, imagine this golden light flowing down through your crown chakra, filling your entire body with divine energy. With each exhale, release any doubts, fears, or limiting beliefs. Repeat the affirmation: "I am aligned with divine guidance. New beginnings flow to me effortlessly." Practice this for 5-10 minutes daily, especially when you see 111.'
    }
  },

  // 推荐水晶产品
  products: [
    { name: 'Clear Quartz Bracelet', subtitle: 'The Master Healer', link: '/products/clear-quartz-bracelet' },
    { name: 'Citrine Bracelet', subtitle: 'The Stone of Abundance', link: '/products/citrine-bracelet' },
    { name: 'Selenite Bracelet', subtitle: 'The Stone of Clarity', link: '/products/selenite-bracelet' }
  ]
};

/**
 * 生成 Angel Number 页面
 *
 * @param {Object} config
 * @param {string} config.number        — 天使数字 (e.g. '111', '222', '444')
 * @param {string} config.title         — 页面标题
 * @param {string} config.subtitle      — 副标题
 * @param {Object} config.sections      — 6段内容 {meaning, spiritual, love, career, crystals, meditation}
 * @param {Array}  config.products      — [{name, subtitle, link}] 推荐水晶产品
 */
function generateAngelNumberPage(config) {
  var cfg = config || DEFAULT_CONFIG;
  var num = cfg.number || '111';
  var title = cfg.title || 'Angel Number ' + num;
  var subtitle = cfg.subtitle || '';
  var sections = cfg.sections || DEFAULT_CONFIG.sections;
  var products = cfg.products || DEFAULT_CONFIG.products;

  // ----------------------------------------------------------
  // Section 1: Hero — "Angel Number [XXX] Meaning"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.angelNumbers.hero.url, id: 0, size: '', alt: IMAGES.angelNumbers.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <a href="/angel-numbers" style="color:#ccc;">Angel Numbers</a> &gt; <span style="color:#fff;">' + num + '</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading(title + ' Meaning', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(subtitle, {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Are you seeing ' + num + ' everywhere? Discover the spiritual meaning, love implications, career significance, and best crystals to amplify the energy of Angel Number ' + num + '.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 数字详情 — 6段式模板
  // ----------------------------------------------------------
  var detailElements = [];

  // 目录导航
  var tocHtml = '<div style="max-width:700px;margin:0 auto 30px;padding:20px;background:#f9f5ff;border-radius:12px;">';
  tocHtml += '<h3 style="font-size:16px;color:#333;margin-bottom:10px;">In This Guide:</h3>';
  tocHtml += '<ol style="padding-left:20px;color:#7C3AED;line-height:28px;">';
  tocHtml += '<li><a href="#meaning" style="color:#7C3AED;text-decoration:none;">What Does ' + title + ' Mean?</a></li>';
  tocHtml += '<li><a href="#spiritual" style="color:#7C3AED;text-decoration:none;">Spiritual Significance</a></li>';
  tocHtml += '<li><a href="#love" style="color:#7C3AED;text-decoration:none;">Love & Relationships</a></li>';
  tocHtml += '<li><a href="#career" style="color:#7C3AED;text-decoration:none;">Career & Finances</a></li>';
  tocHtml += '<li><a href="#crystals" style="color:#7C3AED;text-decoration:none;">Best Crystals for ' + num + '</a></li>';
  tocHtml += '<li><a href="#meditation" style="color:#7C3AED;text-decoration:none;">Meditation Guide</a></li>';
  tocHtml += '</ol>';
  tocHtml += '</div>';
  detailElements.push(E.htmlWidget(tocHtml));

  // ① 数字含义
  if (sections.meaning) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.meaning.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'meaning' }
    }));
    detailElements.push(E.textEditor(sections.meaning.content, {
      align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
    }));
  }

  // ② 灵性解读
  if (sections.spiritual) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.spiritual.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'spiritual' }
    }));
    detailElements.push(E.textEditor(sections.spiritual.content, {
      align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
    }));
  }

  // ③ 爱情/关系
  if (sections.love) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.love.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'love' }
    }));
    detailElements.push(E.textEditor(sections.love.content, {
      align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
    }));
  }

  // ④ 事业/财富
  if (sections.career) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.career.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'career' }
    }));
    detailElements.push(E.textEditor(sections.career.content, {
      align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
    }));
  }

  // ⑤ Best Crystals (差异化)
  if (sections.crystals) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.crystals.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'crystals' }
    }));
    if (sections.crystals.content) {
      detailElements.push(E.textEditor(sections.crystals.content, {
        align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
      }));
    }

    // 水晶卡片
    if (sections.crystals.items && sections.crystals.items.length > 0) {
      var crystalCards = sections.crystals.items.map(function (crystal) {
        return E.wrap(Object.assign({
          flex_direction: 'column',
          _padding: E.rPadding('20', '20', '20', '20'),
          background_background: 'classic',
          background_color: '#FFFFFF'
        }, E.rWidth('33', '50', '100')), [
          E.imageWidget(PLACEHOLDER, { width: 100, radius: 50 }),
          E.heading(crystal.name, {
            fontSize: 18, color: '#333333', align: 'center',
            padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
          }),
          E.textEditor(crystal.reason, {
            align: 'center', fontSize: 14, color: '#666666', lineHeight: 22
          }),
          E.buttonWidget('Shop ' + crystal.name, crystal.link)
        ]);
      });
      detailElements.push(E.wrap({
        flex_direction: 'row',
        flex_gap: E.gap(20),
        flex_wrap: 'wrap'
      }, crystalCards));
    }
  }

  // ⑥ 冥想指南
  if (sections.meditation) {
    detailElements.push(E.spacer('15'));
    detailElements.push(E.heading(sections.meditation.heading, {
      fontSize: 26, color: '#333333', align: 'left',
      padding: { unit: 'px', top: '10', right: '0', bottom: '10', left: '0', isLinked: '' },
      extra: { id: 'meditation' }
    }));
    detailElements.push(E.textEditor(sections.meditation.content, {
      align: 'left', fontSize: 16, color: '#555555', lineHeight: 26
    }));
  }

  var detailSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, detailElements);

  // ----------------------------------------------------------
  // Section 3: 对应水晶 — 推荐水晶产品
  // ----------------------------------------------------------
  var productCards = products.map(function (p) {
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('20', '20', '20', '20'),
      background_background: 'classic',
      background_color: '#FFFFFF'
    }, E.rWidth('33', '50', '100')), [
      E.imageWidget(PLACEHOLDER, { width: 100, radius: 10 }),
      E.heading(p.name, {
        fontSize: 18, color: '#333333', align: 'center',
        padding: { unit: 'px', top: '10', right: '0', bottom: '3', left: '0', isLinked: '' }
      }),
      E.textEditor(p.subtitle || '', {
        align: 'center', fontSize: 14, color: '#7C3AED'
      }),
      E.buttonWidget('Shop Now', p.link)
    ]);
  });

  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Crystals for Angel Number ' + num, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'These hand-selected crystals resonate with the energy of Angel Number ' + num + '. Wear them as bracelets to keep the angelic vibration close throughout your day.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(20),
      flex_wrap: 'wrap'
    }, productCards)
  ]);

  // ----------------------------------------------------------
  // Section 4: 数字范围导航 — 000-999索引
  // ----------------------------------------------------------
  // 热门数字
  var popularNumbers = ['111', '222', '333', '444', '555', '666', '777', '888', '999'];
  var popularCards = popularNumbers.map(function (n) {
    var isActive = n === num;
    return E.wrap(Object.assign({
      flex_direction: 'column',
      _padding: E.rPadding('12', '12', '12', '12'),
      background_background: 'classic',
      background_color: isActive ? '#7C3AED' : '#FFFFFF'
    }, E.rWidth('11', '22', '33')), [
      E.textEditor(
        '<a href="/angel-numbers/' + n + '-meaning" style="color:' + (isActive ? '#fff' : '#7C3AED') + ';text-decoration:none;font-weight:700;font-size:18px;">' + n + '</a>',
        { align: 'center', fontSize: 18 }
      )
    ]);
  });

  // 数字范围 000-999 索引
  var rangeHtml = '<div style="max-width:800px;margin:0 auto;">';

  // 百位分组
  var ranges = [
    { prefix: '000', label: '000s — New Beginnings & Infinity' },
    { prefix: '100', label: '100s — Intuition & New Cycles' },
    { prefix: '200', label: '200s — Balance & Partnership' },
    { prefix: '300', label: '300s — Creativity & Expression' },
    { prefix: '400', label: '400s — Stability & Foundation' },
    { prefix: '500', label: '500s — Change & Freedom' },
    { prefix: '600', label: '600s — Love & Responsibility' },
    { prefix: '700', label: '700s — Spirituality & Wisdom' },
    { prefix: '800', label: '800s — Abundance & Power' },
    { prefix: '900', label: '900s — Completion & Release' }
  ];

  ranges.forEach(function (range) {
    rangeHtml += '<div style="margin-bottom:20px;">';
    rangeHtml += '<h4 style="font-size:14px;color:#333;margin-bottom:8px;">' + range.label + '</h4>';
    rangeHtml += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    for (var i = 0; i < 10; i++) {
      var n = range.prefix.charAt(0) + '' + i + '' + i;
      rangeHtml += '<a href="/angel-numbers/' + n + '-meaning" style="display:inline-block;padding:5px 10px;background:' + (n === num ? '#7C3AED' : '#f0e6ff') + ';color:' + (n === num ? '#fff' : '#7C3AED') + ';text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">' + n + '</a>';
    }
    rangeHtml += '</div>';
    rangeHtml += '</div>';
  });

  rangeHtml += '</div>';

  var navSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Explore More Angel Numbers', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every angel number carries a unique message from the divine. Explore the complete guide below.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.heading('Popular Angel Numbers', {
      fontSize: 20,
      color: '#333333',
      padding: { unit: 'px', top: '15', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(10),
      flex_wrap: 'wrap'
    }, popularCards),
    E.spacer('15'),
    E.heading('Complete Angel Number Index', {
      fontSize: 20,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.htmlWidget(rangeHtml)
  ]);

  return [
    heroSection,
    detailSection,
    productsSection,
    navSection
  ];
}

// ============================================================
// Main — 示例：生成 Angel Number 111 页面
// ============================================================
async function main() {
  var data = generateAngelNumberPage(DEFAULT_CONFIG);
  await E.createPage(
    'Angel Number 111 Meaning',
    '111-meaning',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateAngelNumberPage;
