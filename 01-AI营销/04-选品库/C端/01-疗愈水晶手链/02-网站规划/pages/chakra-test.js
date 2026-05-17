/**
 * Chakra Test 工具页
 * URL: /chakra-test
 *
 * 3个Section:
 * 1. Hero — "Chakra Balance Test" + 说明
 * 2. 7脉轮测试 — 每个脉轮1题（共7题），HTML表单+JS交互
 * 3. 结果展示 — 脉轮平衡图+不平衡脉轮推荐水晶+产品链接+邮箱注册
 *
 * 用法:
 *   node chakra-test.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
var PLACEHOLDER = IMAGES.chakraTest.result.url;

// ============================================================
// 7个脉轮数据
// ============================================================
var CHAKRAS = [
  {
    id: 'root',
    name: 'Root Chakra',
    sanskrit: 'Muladhara',
    color: '#FF0000',
    colorName: 'Red',
    location: 'Base of the spine',
    theme: 'Security, Grounding, Survival',
    question: 'How often do you feel physically safe, grounded, and connected to the present moment?',
    options: [
      { value: '1', label: 'Rarely — I often feel anxious, unstable, or disconnected from my body' },
      { value: '2', label: 'Sometimes — I have moments of stability but also periods of feeling ungrounded' },
      { value: '3', label: 'Usually — I feel secure and grounded most of the time' },
      { value: '4', label: 'Always — I feel deeply rooted, safe, and connected to the physical world' }
    ],
    crystals: [
      { name: 'Black Tourmaline', link: '/collections/black-tourmaline-crystals' },
      { name: 'Hematite', link: '/collections/hematite-crystals' },
      { name: 'Red Jasper', link: '/collections/red-jasper-crystals' }
    ]
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    color: '#FF8C00',
    colorName: 'Orange',
    location: 'Lower abdomen',
    theme: 'Creativity, Pleasure, Emotional Flow',
    question: 'How freely do you express your creativity, emotions, and ability to experience joy?',
    options: [
      { value: '1', label: 'Rarely — I feel emotionally blocked and struggle to experience pleasure or creativity' },
      { value: '2', label: 'Sometimes — My creative energy and emotional expression come in waves' },
      { value: '3', label: 'Usually — I can express my emotions and creativity with relative ease' },
      { value: '4', label: 'Always — My creative and emotional energy flows freely and abundantly' }
    ],
    crystals: [
      { name: 'Carnelian', link: '/collections/carnelian-crystals' },
      { name: 'Orange Calcite', link: '/collections/orange-calcite-crystals' },
      { name: 'Moonstone', link: '/collections/moonstone-crystals' }
    ]
  },
  {
    id: 'solar',
    name: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    color: '#FFD700',
    colorName: 'Yellow',
    location: 'Upper abdomen',
    theme: 'Personal Power, Confidence, Willpower',
    question: 'How confident do you feel in your personal power and ability to direct your own life?',
    options: [
      { value: '1', label: 'Rarely — I often doubt myself and feel powerless over my circumstances' },
      { value: '2', label: 'Sometimes — My confidence fluctuates depending on the situation' },
      { value: '3', label: 'Usually — I trust my abilities and make decisions with confidence' },
      { value: '4', label: 'Always — I am deeply empowered and trust my inner strength completely' }
    ],
    crystals: [
      { name: 'Citrine', link: '/collections/citrine-crystals' },
      { name: 'Tiger Eye', link: '/collections/tiger-eye-crystals' },
      { name: 'Yellow Jasper', link: '/collections/yellow-jasper-crystals' }
    ]
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    sanskrit: 'Anahata',
    color: '#00CC00',
    colorName: 'Green',
    location: 'Center of the chest',
    theme: 'Love, Compassion, Connection',
    question: 'How open is your heart to giving and receiving love, compassion, and forgiveness?',
    options: [
      { value: '1', label: 'Rarely — I find it difficult to open up and often feel emotionally guarded' },
      { value: '2', label: 'Sometimes — I want to love deeply but past wounds make me cautious' },
      { value: '3', label: 'Usually — I can give and receive love with an open heart most of the time' },
      { value: '4', label: 'Always — My heart is fully open to unconditional love and compassion' }
    ],
    crystals: [
      { name: 'Rose Quartz', link: '/collections/rose-quartz-crystals' },
      { name: 'Green Aventurine', link: '/collections/green-aventurine-crystals' },
      { name: 'Rhodonite', link: '/collections/rhodonite-crystals' }
    ]
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    color: '#0099CC',
    colorName: 'Blue',
    location: 'Throat',
    theme: 'Communication, Truth, Self-Expression',
    question: 'How easily can you express your truth and communicate your thoughts and feelings?',
    options: [
      { value: '1', label: 'Rarely — I struggle to speak up and often hold back my true thoughts' },
      { value: '2', label: 'Sometimes — I can communicate well in comfortable situations but hold back with others' },
      { value: '3', label: 'Usually — I can express myself clearly and honestly in most situations' },
      { value: '4', label: 'Always — I speak my truth with confidence, clarity, and compassion' }
    ],
    crystals: [
      { name: 'Aquamarine', link: '/collections/aquamarine-crystals' },
      { name: 'Lapis Lazuli', link: '/collections/lapis-lazuli-crystals' },
      { name: 'Blue Lace Agate', link: '/collections/blue-lace-agate-crystals' }
    ]
  },
  {
    id: 'third-eye',
    name: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    color: '#4B0082',
    colorName: 'Indigo',
    location: 'Forehead, between the eyes',
    theme: 'Intuition, Insight, Imagination',
    question: 'How strong is your intuition and your ability to trust your inner guidance?',
    options: [
      { value: '1', label: 'Rarely — I rarely trust my gut feelings and feel disconnected from my intuition' },
      { value: '2', label: 'Sometimes — I get intuitive flashes but often second-guess myself' },
      { value: '3', label: 'Usually — I trust my inner guidance and it serves me well most of the time' },
      { value: '4', label: 'Always — My intuition is strong and clear, guiding me with precision' }
    ],
    crystals: [
      { name: 'Amethyst', link: '/collections/amethyst-crystals' },
      { name: 'Fluorite', link: '/collections/fluorite-crystals' },
      { name: 'Labradorite', link: '/collections/labradorite-crystals' }
    ]
  },
  {
    id: 'crown',
    name: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    color: '#9400D3',
    colorName: 'Violet',
    location: 'Top of the head',
    theme: 'Spirituality, Connection, Higher Consciousness',
    question: 'How connected do you feel to something greater than yourself — spirit, the universe, or higher consciousness?',
    options: [
      { value: '1', label: 'Rarely — I feel disconnected from spiritual meaning and higher purpose' },
      { value: '2', label: 'Sometimes — I have moments of spiritual connection but they are inconsistent' },
      { value: '3', label: 'Usually — I feel a steady connection to my spiritual practice and higher purpose' },
      { value: '4', label: 'Always — I am deeply connected to divine consciousness and my highest self' }
    ],
    crystals: [
      { name: 'Clear Quartz', link: '/collections/clear-quartz-crystals' },
      { name: 'Selenite', link: '/collections/selenite-crystals' },
      { name: 'Amethyst', link: '/collections/amethyst-crystals' }
    ]
  }
];

// ============================================================
// 生成 Chakra Test 页面
// ============================================================
function generateChakraTest() {

  // ----------------------------------------------------------
  // Section 1: Hero — "Chakra Balance Test" + 说明
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.chakraTest.hero.url, id: 0, size: '', alt: IMAGES.chakraTest.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Chakra Test</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Chakra Balance Test', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Discover Which of Your 7 Chakras Need Balancing', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Answer 7 simple questions about how you feel in different areas of your life. Your responses reveal which chakras are balanced and which ones may need crystal healing support. Takes about 3 minutes.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    ),
    E.spacer('10'),
    // 7脉轮色条预览
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(4)
    }, CHAKRAS.map(function (chakra) {
      return E.wrap({
        flex_direction: 'column',
        _padding: E.rPadding('8', '8', '8', '8'),
        background_background: 'classic',
        background_color: chakra.color
      }, [
        E.textEditor(
          '<span style="color:#fff;font-size:11px;font-weight:600;">' + chakra.name.split(' ')[0] + '</span>',
          { align: 'center', fontSize: 11, color: '#FFFFFF' }
        )
      ]);
    }))
  ]);

  // ----------------------------------------------------------
  // Section 2: 7脉轮测试 — 每个脉轮1题
  // ----------------------------------------------------------
  var testHtml = '<form id="chakra-test-form" style="max-width:700px;margin:0 auto;">';

  // 进度条
  testHtml += '<div id="chakra-progress" style="margin-bottom:25px;">';
  testHtml += '<div style="background:#e0d0f0;border-radius:10px;height:6px;"><div id="chakra-progress-bar" style="background:linear-gradient(90deg,#FF0000,#FF8C00,#FFD700,#00CC00,#0099CC,#4B0082,#9400D3);height:6px;border-radius:10px;width:14%;transition:width 0.3s;"></div></div>';
  testHtml += '<p style="text-align:center;font-size:13px;color:#999;margin-top:5px;">Question <span id="chakra-current-step">1</span> of ' + CHAKRAS.length + '</p>';
  testHtml += '</div>';

  CHAKRAS.forEach(function (chakra, idx) {
    var isHidden = idx > 0 ? 'display:none;' : '';
    testHtml += '<div class="chakra-question" data-step="' + (idx + 1) + '" style="margin-bottom:30px;padding:25px;background:#fff;border-radius:12px;border:1px solid #f0e6ff;' + isHidden + '">';

    // 脉轮头部
    testHtml += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">';
    testHtml += '<div style="width:36px;height:36px;border-radius:50%;background:' + chakra.color + ';flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);"></div>';
    testHtml += '<div>';
    testHtml += '<h3 style="font-size:18px;color:#333;margin-bottom:2px;">' + chakra.name + ' <span style="font-size:13px;color:#999;">(' + chakra.sanskrit + ')</span></h3>';
    testHtml += '<p style="font-size:12px;color:#888;">' + chakra.theme + '</p>';
    testHtml += '</div>';
    testHtml += '</div>';

    // 问题
    testHtml += '<p style="font-size:16px;color:#444;margin-bottom:15px;line-height:24px;">' + chakra.question + '</p>';

    // 选项
    chakra.options.forEach(function (opt) {
      testHtml += '<label style="display:block;padding:12px 15px;margin-bottom:8px;background:#f9f5ff;border-radius:8px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;">';
      testHtml += '<input type="radio" name="' + chakra.id + '" value="' + opt.value + '" style="margin-right:10px;" />' + opt.label;
      testHtml += '</label>';
    });

    // 导航按钮
    if (idx < CHAKRAS.length - 1) {
      testHtml += '<button type="button" class="chakra-next" style="margin-top:15px;padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">Next Question</button>';
    } else {
      testHtml += '<button type="submit" style="margin-top:15px;padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">See My Results</button>';
    }

    testHtml += '</div>';
  });

  testHtml += '</form>';

  // 选中样式
  testHtml += '<style>';
  testHtml += 'label:has(input:checked) { border-color: #7C3AED !important; background: #ede5ff !important; }';
  testHtml += '</style>';

  // 交互JS
  testHtml += '<script>';
  testHtml += 'var chakras = ' + JSON.stringify(CHAKRAS) + ';';
  testHtml += 'document.addEventListener("DOMContentLoaded",function(){';
  testHtml += '  var currentStep=1;var totalSteps=chakras.length;';
  testHtml += '  var nextBtns=document.querySelectorAll(".chakra-next");';
  testHtml += '  nextBtns.forEach(function(btn){';
  testHtml += '    btn.addEventListener("click",function(){';
  testHtml += '      var currentQ=this.parentElement;';
  testHtml += '      var radioGroup=currentQ.querySelectorAll("input[type=radio]");';
  testHtml += '      var checked=false;radioGroup.forEach(function(r){if(r.checked)checked=true;});';
  testHtml += '      if(!checked){alert("Please select an answer before continuing.");return;}';
  testHtml += '      currentQ.style.display="none";';
  testHtml += '      currentStep++;';
  testHtml += '      var nextQ=document.querySelector(\'[data-step="\'+currentStep+\'"]\');';
  testHtml += '      if(nextQ)nextQ.style.display="block";';
  testHtml += '      document.getElementById("chakra-progress-bar").style.width=(currentStep/totalSteps*100)+"%";';
  testHtml += '      document.getElementById("chakra-current-step").textContent=currentStep;';
  testHtml += '    });';
  testHtml += '  });';
  testHtml += '  document.getElementById("chakra-test-form").addEventListener("submit",function(e){';
  testHtml += '    e.preventDefault();';
  testHtml += '    var scores=[];chakras.forEach(function(c){';
  testHtml += '      var sel=document.querySelector("input[name="+c.id+"]:checked");';
  testHtml += '      scores.push({id:c.id,name:c.name,color:c.color,crystals:c.crystals,score:sel?parseInt(sel.value):0});';
  testHtml += '    });';
  testHtml += '    renderResults(scores);';
  testHtml += '    this.style.display="none";';
  testHtml += '    document.getElementById("chakra-progress").style.display="none";';
  testHtml += '    document.getElementById("chakra-results").style.display="block";';
  testHtml += '    document.getElementById("chakra-results").scrollIntoView({behavior:"smooth"});';
  testHtml += '  });';
  testHtml += '});';

  // 结果渲染
  testHtml += 'function renderResults(scores){';
  testHtml += '  var barChart=document.getElementById("chakra-chart");';
  testHtml += '  var maxScore=4;';
  testHtml += '  scores.forEach(function(s){';
  testHtml += '    var pct=(s.score/maxScore*100);';
  testHtml += '    var row=document.createElement("div");';
  testHtml += '    row.style.cssText="display:flex;align-items:center;gap:10px;margin-bottom:10px;";';
  testHtml += '    row.innerHTML=\'<div style="width:36px;height:36px;border-radius:50%;background:\'+s.color+\';flex-shrink:0;"></div>\' +';
  testHtml += '      \'<div style="flex:1;"><div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:13px;color:#333;">\'+s.name+\'</span><span style="font-size:12px;color:#888;">\'+pct+\'%</span></div>\' +';
  testHtml += '      \'<div style="background:#eee;border-radius:5px;height:8px;"><div style="background:\'+s.color+\';height:8px;border-radius:5px;width:\'+pct+\'%;transition:width 0.5s;"></div></div></div>\';';
  testHtml += '    barChart.appendChild(row);';
  testHtml += '  });';

  // 推荐不平衡脉轮
  testHtml += '  var weak=scores.filter(function(s){return s.score<=2;});';
  testHtml += '  var recDiv=document.getElementById("chakra-recommendations");';
  testHtml += '  if(weak.length===0){recDiv.innerHTML=\'<p style="text-align:center;font-size:16px;color:#333;">Your chakras appear to be well balanced! Keep up your spiritual practice.</p>\';}';
  testHtml += '  else{';
  testHtml += '    weak.forEach(function(w){';
  testHtml += '      var card=document.createElement("div");';
  testHtml += '      card.style.cssText="padding:20px;background:#fff;border-radius:12px;border:1px solid #f0e6ff;margin-bottom:15px;";';
  testHtml += '      var crystalLinks=w.crystals.map(function(c){return \'<a href="\'+c.link+\'" style="color:#7C3AED;text-decoration:none;border-bottom:1px dotted #7C3AED;">\'+c.name+\'</a>\';}).join(" &middot; ");';
  testHtml += '      card.innerHTML=\'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:28px;height:28px;border-radius:50%;background:\'+w.color+\';flex-shrink:0;"></div><h4 style="font-size:16px;color:#333;">\'+w.name+\'</h4></div>\' +';
  testHtml += '        \'<p style="font-size:14px;color:#666;line-height:22px;">This chakra may benefit from balancing. Recommended crystals: \'+crystalLinks+\'</p>\';';
  testHtml += '      recDiv.appendChild(card);';
  testHtml += '    });';
  testHtml += '  }';

  testHtml += '}';

  testHtml += '</script>';

  var testSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Assess Your Chakras', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Answer honestly based on how you typically feel. There are no wrong answers.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.htmlWidget(testHtml)
  ]);

  // ----------------------------------------------------------
  // Section 3: 结果展示 — 脉轮平衡图+推荐+邮箱注册
  // ----------------------------------------------------------
  var resultsHtml = '<div id="chakra-results" style="display:none;max-width:700px;margin:0 auto;">';

  // 结果标题
  resultsHtml += '<div style="text-align:center;margin-bottom:25px;">';
  resultsHtml += '<h2 style="font-size:28px;color:#333;margin-bottom:8px;">Your Chakra Balance Results</h2>';
  resultsHtml += '<p style="font-size:16px;color:#888;">Here is a snapshot of your current chakra energy levels.</p>';
  resultsHtml += '</div>';

  // 脉轮平衡图
  resultsHtml += '<div style="padding:25px;background:#fff;border-radius:12px;border:1px solid #f0e6ff;margin-bottom:25px;">';
  resultsHtml += '<h3 style="font-size:18px;color:#333;margin-bottom:15px;">Chakra Energy Levels</h3>';
  resultsHtml += '<div id="chakra-chart"></div>';
  resultsHtml += '</div>';

  // 不平衡脉轮推荐
  resultsHtml += '<div style="margin-bottom:25px;">';
  resultsHtml += '<h3 style="font-size:18px;color:#333;margin-bottom:12px;">Recommended Crystals for Balancing</h3>';
  resultsHtml += '<div id="chakra-recommendations"></div>';
  resultsHtml += '</div>';

  // 邮箱注册引导
  resultsHtml += '<div style="padding:25px;background:#1A0A2E;border-radius:12px;text-align:center;">';
  resultsHtml += '<h3 style="font-size:20px;color:#fff;margin-bottom:8px;">Get Your Full Chakra Healing Guide</h3>';
  resultsHtml += '<p style="font-size:14px;color:#C4A1FF;margin-bottom:15px;line-height:22px;">Receive a personalized chakra balancing guide with crystal recommendations, meditation scripts, and daily affirmations tailored to your unique energy profile.</p>';
  resultsHtml += '<input type="email" placeholder="Enter your email" style="padding:12px 18px;border:1px solid #555;border-radius:25px;width:60%;font-size:14px;margin-bottom:10px;background:#2A1A3E;color:#fff;" /><br/>';
  resultsHtml += '<button style="padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">Send My Free Guide</button>';
  resultsHtml += '<p style="font-size:11px;color:#aaa;margin-top:8px;">Join 10,000+ crystal lovers. Unsubscribe anytime.</p>';
  resultsHtml += '</div>';

  resultsHtml += '</div>';

  var resultsSection = E.section({
    _padding: E.rPadding('40', '40', '60', '40', { tablet: { t: '30', r: '20', b: '40', l: '20' }, mobile: { t: '20', r: '15', b: '30', l: '15' } })
  }, [
    E.htmlWidget(resultsHtml)
  ]);

  return [
    heroSection,
    testSection,
    resultsSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateChakraTest();
  await E.createPage(
    'Chakra Balance Test: Discover Your Energy',
    'chakra-test',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateChakraTest;
