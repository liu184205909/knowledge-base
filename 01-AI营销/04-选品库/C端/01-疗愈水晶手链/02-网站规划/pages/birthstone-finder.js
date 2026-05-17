/**
 * Birthstone Finder 工具页
 * URL: /birthstone-finder
 *
 * 3个Section:
 * 1. Hero — "Find Your Birthstone" + 说明
 * 2. 交互工具 — 12个月份选择卡片（点击选择月份 → 显示该月生辰石+功效+推荐产品）
 * 3. 结果展示 — 生辰石详情（图片+名称+功效+推荐产品链接）+ 邮箱注册引导
 *
 * 用法:
 *   node birthstone-finder.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.birthstone.result.url;

// ============================================================
// 12个月生辰石数据
// ============================================================
var BIRTHSTONES = [
  {
    month: 'January',
    stone: 'Garnet',
    subtitle: 'The Stone of Commitment',
    color: '#8B0000',
    colorName: 'Deep Red',
    chakra: 'Root Chakra',
    properties: ['Passion', 'Energy', 'Creativity', 'Protection'],
    description: 'Garnet is a stone of deep, passionate energy. It revitalizes your spirit, boosts confidence, and inspires love and devotion. Known as a powerful protection stone, Garnet has been treasured since ancient Egyptian times for its ability to ward off negative energy and attract abundance.',
    affirmation: 'I am filled with passionate energy and my creative fire burns bright.',
    productLink: '/collections/garnet-crystals'
  },
  {
    month: 'February',
    stone: 'Amethyst',
    subtitle: 'The Stone of Peace',
    color: '#6A0DAD',
    colorName: 'Violet Purple',
    chakra: 'Crown & Third Eye Chakra',
    properties: ['Calm', 'Intuition', 'Spiritual Growth', 'Clarity'],
    description: 'Amethyst is the ultimate stone of peace and spiritual awareness. Its soothing violet energy calms the mind, enhances intuition, and connects you to higher states of consciousness. Ancient Greeks believed Amethyst could prevent intoxication, symbolizing clarity of thought and sobriety of spirit.',
    affirmation: 'I am at peace, and my inner wisdom guides me clearly.',
    productLink: '/collections/amethyst-crystals'
  },
  {
    month: 'March',
    stone: 'Aquamarine',
    subtitle: 'The Stone of Courage',
    color: '#006994',
    colorName: 'Ocean Blue',
    chakra: 'Throat Chakra',
    properties: ['Courage', 'Communication', 'Calm', 'Clarity'],
    description: 'Aquamarine, the treasure of mermaids, carries the calming energy of the ocean. It is a stone of courage and clear communication, helping you speak your truth with confidence. Sailors once carried Aquamarine as a talisman of protection and safe passage across treacherous waters.',
    affirmation: 'I speak my truth with courage and my words flow like calm waters.',
    productLink: '/collections/aquamarine-crystals'
  },
  {
    month: 'April',
    stone: 'Diamond',
    subtitle: 'The Stone of Invincibility',
    color: '#E8E8E8',
    colorName: 'Clear White',
    chakra: 'Crown Chakra',
    properties: ['Strength', 'Purity', 'Eternity', 'Clarity'],
    description: 'Diamond is the hardest natural substance on Earth, symbolizing unbreakable strength and eternal love. It amplifies the energy of all other crystals and brings clarity to the mind. As the April birthstone, Diamond represents purity of intention and the infinite potential within you.',
    affirmation: 'I am strong, pure, and radiant. My inner light shines brightly.',
    productLink: '/collections/clear-quartz-crystals'
  },
  {
    month: 'May',
    stone: 'Emerald',
    subtitle: 'The Stone of Successful Love',
    color: '#006400',
    colorName: 'Rich Green',
    chakra: 'Heart Chakra',
    properties: ['Love', 'Abundance', 'Wisdom', 'Harmony'],
    description: 'Emerald is the stone of unconditional love and abundance. Its lush green energy opens the heart to deep compassion and draws prosperity into your life. Cleopatra treasured Emeralds above all other gemstones, believing they held the power of eternal youth and fertility.',
    affirmation: 'My heart is open to love, and abundance flows to me naturally.',
    productLink: '/collections/emerald-crystals'
  },
  {
    month: 'June',
    stone: 'Pearl',
    subtitle: 'The Stone of Purity',
    color: '#FFF5E1',
    colorName: 'Luminous White',
    chakra: 'Solar Plexus Chakra',
    properties: ['Purity', 'Wisdom', 'Integrity', 'Calming'],
    description: 'Pearl is the only gemstone created by a living creature, making it a symbol of natural purity and wisdom born from experience. Like the oyster that transforms an irritant into something beautiful, Pearl teaches you to turn challenges into strengths and find inner calm amidst chaos.',
    affirmation: 'I transform challenges into wisdom and shine with inner purity.',
    productLink: '/collections/moonstone-crystals'
  },
  {
    month: 'July',
    stone: 'Ruby',
    subtitle: 'The Stone of Vitality',
    color: '#E0115F',
    colorName: 'Fiery Red',
    chakra: 'Root & Heart Chakra',
    properties: ['Vitality', 'Passion', 'Protection', 'Leadership'],
    description: 'Ruby is the king of gemstones, radiating fierce vitality and life-force energy. It activates your root chakra for grounding and your heart chakra for passionate love. Ancient warriors wore Ruby into battle, believing it granted invincibility and protected against physical harm.',
    affirmation: 'I am filled with vibrant life energy and I lead with passion.',
    productLink: '/collections/ruby-crystals'
  },
  {
    month: 'August',
    stone: 'Peridot',
    subtitle: 'The Stone of Compassion',
    color: '#9ACD32',
    colorName: 'Lime Green',
    chakra: 'Heart & Solar Plexus Chakra',
    properties: ['Compassion', 'Abundance', 'Joy', 'Healing'],
    description: 'Peridot is a stone of warm, joyful energy that dissolves emotional blockages and invites abundance. Known as the evening emerald, Peridot was Cleopatra\'s favorite gemstone. It carries the energy of sunshine and new growth, helping you release jealousy and resentment while embracing gratitude.',
    affirmation: 'I release what no longer serves me and embrace joy and abundance.',
    productLink: '/collections/peridot-crystals'
  },
  {
    month: 'September',
    stone: 'Sapphire',
    subtitle: 'The Stone of Wisdom',
    color: '#0F52BA',
    colorName: 'Royal Blue',
    chakra: 'Third Eye & Throat Chakra',
    properties: ['Wisdom', 'Focus', 'Truth', 'Spiritual Insight'],
    description: 'Sapphire is the stone of mental clarity and spiritual wisdom. Its deep blue energy activates the third eye, enhancing intuition and focus. Ancient kings wore Sapphire as protection from envy and harm. It is said to attract divine favor and align you with your highest purpose.',
    affirmation: 'I see clearly, speak truthfully, and trust my inner knowing.',
    productLink: '/collections/lapis-lazuli-crystals'
  },
  {
    month: 'October',
    stone: 'Opal',
    subtitle: 'The Stone of Inspiration',
    color: '#FF7F50',
    colorName: 'Iridescent Multi',
    chakra: 'All Chakras',
    properties: ['Creativity', 'Inspiration', 'Originality', 'Emotional Balance'],
    description: 'Opal is a kaleidoscope of color, representing the full spectrum of human emotion and experience. It amplifies your unique gifts and stimulates originality and creativity. Opal helps you release inhibitions and express your true self with confidence and joy.',
    affirmation: 'I embrace my unique gifts and express my creativity freely.',
    productLink: '/collections/opal-crystals'
  },
  {
    month: 'November',
    stone: 'Citrine',
    subtitle: 'The Stone of Abundance',
    color: '#FFB300',
    colorName: 'Golden Yellow',
    chakra: 'Solar Plexus Chakra',
    properties: ['Abundance', 'Confidence', 'Joy', 'Manifestation'],
    description: 'Citrine is the merchant\'s stone, renowned for attracting wealth, success, and positive energy. Its warm golden vibration activates the solar plexus, empowering you with confidence and willpower. Citrine never needs cleansing because it naturally transmutes negative energy into positive light.',
    affirmation: 'I am a magnet for abundance and my confidence radiates like sunlight.',
    productLink: '/collections/citrine-crystals'
  },
  {
    month: 'December',
    stone: 'Turquoise',
    subtitle: 'The Stone of Protection',
    color: '#40E0D0',
    colorName: 'Sky Blue-Green',
    chakra: 'Throat Chakra',
    properties: ['Protection', 'Communication', 'Healing', 'Friendship'],
    description: 'Turquoise is one of the oldest protection stones, revered by Native American cultures for thousands of years. It guards against negative energy, promotes honest communication, and strengthens friendships. Turquoise changes color to warn its wearer of danger, making it a living talisman of protection.',
    affirmation: 'I am protected, I speak honestly, and I attract true friendship.',
    productLink: '/collections/turquoise-crystals'
  }
];

// ============================================================
// 生成 Birthstone Finder 页面
// ============================================================
function generateBirthstoneFinder() {

  // ----------------------------------------------------------
  // Section 1: Hero — "Find Your Birthstone" + 说明
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.birthstone.hero.url, id: 0, size: '', alt: IMAGES.birthstone.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Birthstone Finder</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Find Your Birthstone', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Discover the Crystal That Was Born With You', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every month of the year is connected to a unique birthstone with its own energy, meaning, and healing properties. Select your birth month below to discover your personal crystal ally and the power it holds for your life.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 交互工具 — 12个月份选择卡片
  // ----------------------------------------------------------
  var monthCardsHtml = '';

  // 进度提示
  monthCardsHtml += '<div style="text-align:center;margin-bottom:25px;">';
  monthCardsHtml += '<p style="font-size:16px;color:#888;">Select your birth month to reveal your birthstone</p>';
  monthCardsHtml += '</div>';

  // 12个月份卡片网格
  monthCardsHtml += '<div id="birthstone-months" style="display:flex;flex-wrap:wrap;gap:15px;justify-content:center;max-width:900px;margin:0 auto;">';

  BIRTHSTONES.forEach(function (item, idx) {
    monthCardsHtml += '<div class="month-card" data-month="' + idx + '" style="flex:0 0 calc(25% - 15px);min-width:150px;padding:20px 15px;text-align:center;background:#fff;border-radius:12px;border:2px solid #f0e6ff;cursor:pointer;transition:all 0.3s;">';
    monthCardsHtml += '<div style="width:40px;height:40px;border-radius:50%;background:' + item.color + ';margin:0 auto 10px;box-shadow:0 2px 8px rgba(0,0,0,0.15);"></div>';
    monthCardsHtml += '<h3 style="font-size:15px;color:#333;margin-bottom:3px;">' + item.month + '</h3>';
    monthCardsHtml += '<p style="font-size:12px;color:#7C3AED;">' + item.stone + '</p>';
    monthCardsHtml += '</div>';
  });

  monthCardsHtml += '</div>';

  // 结果展示区域（隐藏，点击月份后显示）
  monthCardsHtml += '<div id="birthstone-result" style="display:none;max-width:800px;margin:30px auto 0;">';

  // 结果标题
  monthCardsHtml += '<div style="text-align:center;margin-bottom:25px;">';
  monthCardsHtml += '<h2 id="result-title" style="font-size:28px;color:#333;margin-bottom:5px;"></h2>';
  monthCardsHtml += '<p id="result-subtitle" style="font-size:16px;color:#7C3AED;"></p>';
  monthCardsHtml += '</div>';

  // 结果详情卡片
  monthCardsHtml += '<div style="display:flex;gap:30px;flex-wrap:wrap;align-items:flex-start;">';

  // 左侧图片
  monthCardsHtml += '<div style="flex:0 0 200px;text-align:center;">';
  monthCardsHtml += '<div id="result-color" style="width:160px;height:160px;border-radius:50%;margin:0 auto 15px;box-shadow:0 4px 20px rgba(0,0,0,0.1);"></div>';
  monthCardsHtml += '<p id="result-color-name" style="font-size:13px;color:#888;"></p>';
  monthCardsHtml += '</div>';

  // 右侧详情
  monthCardsHtml += '<div style="flex:1;min-width:280px;">';

  // 属性标签
  monthCardsHtml += '<div id="result-properties" style="margin-bottom:15px;"></div>';

  // 脉轮
  monthCardsHtml += '<p id="result-chakra" style="font-size:14px;color:#666;margin-bottom:10px;"></p>';

  // 描述
  monthCardsHtml += '<p id="result-description" style="font-size:15px;color:#555;line-height:24px;margin-bottom:15px;"></p>';

  // Affirmation
  monthCardsHtml += '<div style="padding:15px;background:#f9f5ff;border-left:4px solid #7C3AED;border-radius:0 8px 8px 0;margin-bottom:20px;">';
  monthCardsHtml += '<p style="font-size:12px;color:#7C3AED;margin-bottom:3px;font-weight:600;">DAILY AFFIRMATION</p>';
  monthCardsHtml += '<p id="result-affirmation" style="font-size:14px;color:#555;line-height:22px;font-style:italic;"></p>';
  monthCardsHtml += '</div>';

  // 推荐产品链接
  monthCardsHtml += '<a id="result-link" href="#" style="display:inline-block;padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;text-decoration:none;border-radius:25px;font-size:15px;transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">Shop ' + ' ' + 'Crystals</a>';

  monthCardsHtml += '</div>'; // 右侧结束
  monthCardsHtml += '</div>'; // flex row 结束
  monthCardsHtml += '</div>'; // result 结束

  // 邮箱注册
  monthCardsHtml += '<div id="birthstone-email" style="display:none;max-width:600px;margin:30px auto 0;padding:25px;background:#f9f5ff;border-radius:12px;border:2px dashed #7C3AED;text-align:center;">';
  monthCardsHtml += '<h3 style="font-size:20px;color:#333;margin-bottom:8px;">Get Your Free Birthstone Guide</h3>';
  monthCardsHtml += '<p style="font-size:14px;color:#888;margin-bottom:15px;line-height:22px;">Receive a personalized birthstone report with crystal care tips, affirmations, and recommended products — delivered to your inbox.</p>';
  monthCardsHtml += '<input type="email" placeholder="Enter your email" style="padding:12px 18px;border:1px solid #ddd;border-radius:25px;width:60%;font-size:14px;margin-bottom:10px;" /><br/>';
  monthCardsHtml += '<button style="padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">Send My Free Guide</button>';
  monthCardsHtml += '<p style="font-size:11px;color:#aaa;margin-top:8px;">Join 10,000+ crystal lovers. Unsubscribe anytime.</p>';
  monthCardsHtml += '</div>';

  // 样式
  monthCardsHtml += '<style>';
  monthCardsHtml += '.month-card:hover { border-color: #7C3AED !important; transform: translateY(-3px); box-shadow: 0 4px 15px rgba(124,58,237,0.15); }';
  monthCardsHtml += '.month-card.active { border-color: #7C3AED !important; background: #ede5ff !important; }';
  monthCardsHtml += '</style>';

  // 交互JS
  monthCardsHtml += '<script>';
  monthCardsHtml += 'var birthstones = ' + JSON.stringify(BIRTHSTONES) + ';';
  monthCardsHtml += 'document.addEventListener("DOMContentLoaded",function(){';
  monthCardsHtml += '  var cards = document.querySelectorAll(".month-card");';
  monthCardsHtml += '  cards.forEach(function(card){';
  monthCardsHtml += '    card.addEventListener("click",function(){';
  monthCardsHtml += '      cards.forEach(function(c){c.classList.remove("active");});';
  monthCardsHtml += '      this.classList.add("active");';
  monthCardsHtml += '      var idx = parseInt(this.getAttribute("data-month"));';
  monthCardsHtml += '      var data = birthstones[idx];';
  monthCardsHtml += '      var result = document.getElementById("birthstone-result");';
  monthCardsHtml += '      result.style.display="block";';
  monthCardsHtml += '      document.getElementById("result-title").textContent=data.month+" Birthstone: "+data.stone;';
  monthCardsHtml += '      document.getElementById("result-subtitle").textContent=data.subtitle;';
  monthCardsHtml += '      document.getElementById("result-color").style.background=data.color;';
  monthCardsHtml += '      document.getElementById("result-color-name").textContent=data.colorName;';
  monthCardsHtml += '      var propsHtml=data.properties.map(function(p){return \'<span style="display:inline-block;padding:4px 12px;background:#f0e6ff;color:#7C3AED;border-radius:15px;font-size:13px;margin:2px 4px 2px 0;">\'+p+\'</span>\';}).join("");';
  monthCardsHtml += '      document.getElementById("result-properties").innerHTML=propsHtml;';
  monthCardsHtml += '      document.getElementById("result-chakra").innerHTML="<strong>Chakra:</strong> "+data.chakra;';
  monthCardsHtml += '      document.getElementById("result-description").textContent=data.description;';
  monthCardsHtml += '      document.getElementById("result-affirmation").textContent=data.affirmation;';
  monthCardsHtml += '      var link=document.getElementById("result-link");';
  monthCardsHtml += '      link.href=data.productLink;';
  monthCardsHtml += '      link.textContent="Shop "+data.stone+" Crystals";';
  monthCardsHtml += '      document.getElementById("birthstone-email").style.display="block";';
  monthCardsHtml += '      result.scrollIntoView({behavior:"smooth",block:"start"});';
  monthCardsHtml += '    });';
  monthCardsHtml += '  });';
  monthCardsHtml += '});';
  monthCardsHtml += '</script>';

  var toolSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Select Your Birth Month', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.htmlWidget(monthCardsHtml)
  ]);

  // ----------------------------------------------------------
  // Section 3: 结果展示（占位 — 实际结果在HTML交互中动态生成）
  // ----------------------------------------------------------
  var seoSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('What Is a Birthstone?', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Birthstones are gemstones that correspond to each month of the year, each carrying unique meanings, energies, and healing properties. The tradition of wearing birthstones dates back to ancient civilizations, where they were believed to bring protection, good fortune, and spiritual power to their wearer.',
      { fontSize: 16, color: '#666666', lineHeight: 26 }
    ),
    E.textEditor(
      'Today, birthstones are cherished not only for their beauty but for their deep personal significance. Whether you wear your birthstone as a bracelet, necklace, or carry it as a pocket stone, it serves as a powerful reminder of your unique energy and the qualities you were born with.',
      { fontSize: 16, color: '#666666', lineHeight: 26 }
    ),
    E.spacer('15'),
    E.heading('Birthstone by Month', {
      fontSize: 24,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, BIRTHSTONES.map(function (item) {
      return E.wrap(Object.assign({
        flex_direction: 'column',
        _padding: E.rPadding('15', '15', '15', '15'),
        background_background: 'classic',
        background_color: '#FAFAFA'
      }, E.rWidth('25', '50', '100')), [
        E.textEditor(
          '<div style="width:30px;height:30px;border-radius:50%;background:' + item.color + ';margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,0.12);"></div>' +
          '<strong style="color:#333;">' + item.month + '</strong><br>' +
          '<span style="color:#7C3AED;">' + item.stone + '</span><br>' +
          '<span style="font-size:12px;color:#888;">' + item.subtitle + '</span>',
          { align: 'left', fontSize: 14, lineHeight: 22 }
        )
      ]);
    }))
  ]);

  return [
    heroSection,
    toolSection,
    seoSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateBirthstoneFinder();
  await E.createPage(
    'Birthstone Finder: Discover Your Crystal',
    'birthstone-finder',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateBirthstoneFinder;
