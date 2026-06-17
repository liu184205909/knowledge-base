/**
 * Crystal Quiz 页面
 * URL: /crystal-quiz
 *
 * 3个Section:
 * 1. 标题 — "Find Your Crystal" + 副标题
 * 2. 测试问题 — 5题占位（HTML表单，JavaScript后续开发交互）
 * 3. 结果页预告 — Top 3水晶推荐+脉轮分析+邮箱注册引导占位
 *
 * 用法:
 *   node crystal-quiz.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.crystalQuiz.hero.url;

// ============================================================
// 5道测试题目数据
// ============================================================
var QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What do you need most right now?',
    options: [
      { value: 'peace',     label: 'Peace and calm' },
      { value: 'love',      label: 'Love and connection' },
      { value: 'confidence', label: 'Confidence and strength' },
      { value: 'clarity',   label: 'Clarity and focus' },
      { value: 'protection', label: 'Protection and grounding' }
    ]
  },
  {
    id: 'q2',
    question: 'How are you feeling today?',
    options: [
      { value: 'anxious',  label: 'Anxious or overwhelmed' },
      { value: 'hopeful',  label: 'Hopeful and inspired' },
      { value: 'tired',    label: 'Tired or drained' },
      { value: 'creative', label: 'Creative and expressive' },
      { value: 'stuck',    label: 'Stuck or uncertain' }
    ]
  },
  {
    id: 'q3',
    question: 'Which element speaks to your soul?',
    options: [
      { value: 'water', label: 'Water \u2014 flowing, intuitive, emotional' },
      { value: 'earth', label: 'Earth \u2014 grounded, stable, nurturing' },
      { value: 'fire',  label: 'Fire \u2014 passionate, bold, transformative' },
      { value: 'air',   label: 'Air \u2014 free, intellectual, communicative' }
    ]
  },
  {
    id: 'q4',
    question: 'What is your zodiac sign?',
    options: [
      { value: 'fire-sign',  label: 'Aries / Leo / Sagittarius' },
      { value: 'earth-sign', label: 'Taurus / Virgo / Capricorn' },
      { value: 'air-sign',   label: 'Gemini / Libra / Aquarius' },
      { value: 'water-sign', label: 'Cancer / Scorpio / Pisces' }
    ]
  },
  {
    id: 'q5',
    question: 'How experienced are you with crystals?',
    options: [
      { value: 'beginner',     label: 'Complete beginner \u2014 just starting my journey' },
      { value: 'some',         label: 'Somewhat familiar \u2014 I own a few crystals' },
      { value: 'experienced',  label: 'Experienced \u2014 crystals are part of my daily practice' }
    ]
  }
];

// ============================================================
// 生成 Crystal Quiz 页面
// ============================================================
function generateCrystalQuiz() {

  // ----------------------------------------------------------
  // Section 1: 标题 — "Find Your Crystal" + 副标题
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.crystalQuiz.hero.url, id: 0, size: '', alt: IMAGES.crystalQuiz.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Crystal Quiz</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Find Your Crystal', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Answer 5 Questions. Discover the Crystals That Align With Your Energy.', {
      fontSize: 20,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Our Crystal Quiz analyzes your needs, emotions, and astrological profile to match you with the perfect healing stones. Takes less than 2 minutes.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 测试问题 — 5题HTML表单占位
  // ----------------------------------------------------------
  var questionsHtml = '<form id="crystal-quiz-form" style="max-width:700px;margin:0 auto;">';

  QUIZ_QUESTIONS.forEach(function (q, idx) {
    questionsHtml += '<div class="quiz-question" data-step="' + (idx + 1) + '" style="margin-bottom:30px;padding:25px;background:#fff;border-radius:12px;border:1px solid #f0e6ff;' + (idx > 0 ? 'display:none;' : '') + '">';
    questionsHtml += '<h3 style="font-size:20px;color:#333;margin-bottom:15px;">' + (idx + 1) + '. ' + q.question + '</h3>';
    q.options.forEach(function (opt) {
      questionsHtml += '<label style="display:block;padding:12px 15px;margin-bottom:8px;background:#f9f5ff;border-radius:8px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;">';
      questionsHtml += '<input type="radio" name="' + q.id + '" value="' + opt.value + '" style="margin-right:10px;" />' + opt.label;
      questionsHtml += '</label>';
    });
    if (idx < QUIZ_QUESTIONS.length - 1) {
      questionsHtml += '<button type="button" class="quiz-next" style="margin-top:15px;padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">Next Question</button>';
    } else {
      questionsHtml += '<button type="submit" style="margin-top:15px;padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">See My Results</button>';
    }
    questionsHtml += '</div>';
  });

  questionsHtml += '<div id="quiz-progress" style="max-width:700px;margin:0 auto 20px;">';
  questionsHtml += '<div style="background:#e0d0f0;border-radius:10px;height:6px;"><div id="progress-bar" style="background:linear-gradient(135deg,#7C3AED,#C4A1FF);height:6px;border-radius:10px;width:20%;transition:width 0.3s;"></div></div>';
  questionsHtml += '<p style="text-align:center;font-size:13px;color:#999;margin-top:5px;">Question <span id="current-step">1</span> of ' + QUIZ_QUESTIONS.length + '</p>';
  questionsHtml += '</div>';
  questionsHtml += '</form>';

  questionsHtml += '<style>';
  questionsHtml += 'label:has(input:checked) { border-color: #7C3AED !important; background: #ede5ff !important; }';
  questionsHtml += '</style>';

  questionsHtml += '<script>';
  questionsHtml += 'document.addEventListener("DOMContentLoaded",function(){';
  questionsHtml += '  var currentStep=1;var totalSteps=' + QUIZ_QUESTIONS.length + ';';
  questionsHtml += '  var nextBtns=document.querySelectorAll(".quiz-next");';
  questionsHtml += '  nextBtns.forEach(function(btn){';
  questionsHtml += '    btn.addEventListener("click",function(){';
  questionsHtml += '      var currentQ=this.parentElement;';
  questionsHtml += '      var radioGroup=currentQ.querySelectorAll("input[type=radio]");';
  questionsHtml += '      var checked=false;radioGroup.forEach(function(r){if(r.checked)checked=true;});';
  questionsHtml += '      if(!checked){alert("Please select an answer before continuing.");return;}';
  questionsHtml += '      currentQ.style.display="none";';
  questionsHtml += '      currentStep++;';
  questionsHtml += '      var nextQ=document.querySelector(\'[data-step="\'+currentStep+\'"]\');';
  questionsHtml += '      if(nextQ)nextQ.style.display="block";';
  questionsHtml += '      document.getElementById("progress-bar").style.width=(currentStep/totalSteps*100)+"%";';
  questionsHtml += '      document.getElementById("current-step").textContent=currentStep;';
  questionsHtml += '    });';
  questionsHtml += '  });';
  questionsHtml += '  document.getElementById("crystal-quiz-form").addEventListener("submit",function(e){';
  questionsHtml += '    e.preventDefault();';
  questionsHtml += '    var resultSection=document.getElementById("quiz-results");';
  questionsHtml += '    if(resultSection){resultSection.style.display="block";resultSection.scrollIntoView({behavior:"smooth"});}';
  questionsHtml += '    var form=this;form.style.display="none";';
  questionsHtml += '  });';
  questionsHtml += '});';
  questionsHtml += '</script>';

  var quizSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Take the Quiz', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Answer honestly \u2014 there are no wrong answers. Your energy is uniquely yours.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.htmlWidget(questionsHtml)
  ]);

  // ----------------------------------------------------------
  // Section 3: 结果页预告 — Top 3水晶推荐+脉轮分析+邮箱注册引导占位
  // ----------------------------------------------------------
  var resultsHtml = '<div id="quiz-results" style="display:none;max-width:700px;margin:0 auto;">';

  // 结果标题
  resultsHtml += '<div style="text-align:center;margin-bottom:30px;">';
  resultsHtml += '<h2 style="font-size:28px;color:#333;margin-bottom:8px;">Your Crystal Match</h2>';
  resultsHtml += '<p style="font-size:16px;color:#888;">Based on your unique energy profile, here are your top crystal allies:</p>';
  resultsHtml += '</div>';

  // Top 3 水晶推荐卡片
  var resultCrystals = [
    { name: 'Amethyst', subtitle: 'The Stone of Peace', chakra: 'Crown & Third Eye', desc: 'Your energy resonates with Amethyst\'s calming, intuitive vibration. It will help you find clarity and inner peace.', image: IMAGES.crystalQuiz.amethyst.url },
    { name: 'Rose Quartz', subtitle: 'The Stone of Love', chakra: 'Heart', desc: 'Rose Quartz aligns with your desire for deeper connection. It opens the heart to love, compassion, and emotional healing.', image: IMAGES.crystalQuiz.roseQuartz.url },
    { name: 'Citrine', subtitle: 'The Stone of Abundance', chakra: 'Solar Plexus', desc: 'Citrine matches your ambitious energy. It amplifies confidence, creativity, and your ability to manifest your dreams.', image: IMAGES.crystalQuiz.citrine.url }
  ];

  resultCrystals.forEach(function (crystal) {
    resultsHtml += '<div style="display:flex;gap:20px;padding:20px;background:#fff;border-radius:12px;border:1px solid #f0e6ff;margin-bottom:15px;align-items:center;">';
    resultsHtml += '<img src="' + crystal.image + '" alt="' + crystal.name + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;flex-shrink:0;" />';
    resultsHtml += '<div>';
    resultsHtml += '<h3 style="font-size:18px;color:#333;margin-bottom:3px;">' + crystal.name + '</h3>';
    resultsHtml += '<p style="font-size:13px;color:#7C3AED;margin-bottom:5px;">' + crystal.subtitle + ' \u2014 ' + crystal.chakra + ' Chakra</p>';
    resultsHtml += '<p style="font-size:14px;color:#888;line-height:22px;">' + crystal.desc + '</p>';
    resultsHtml += '</div>';
    resultsHtml += '</div>';
  });

  // 脉轮分析摘要
  resultsHtml += '<div style="padding:20px;background:#1A0A2E;border-radius:12px;margin-bottom:20px;text-align:center;">';
  resultsHtml += '<h3 style="font-size:18px;color:#fff;margin-bottom:8px;">Your Chakra Insight</h3>';
  resultsHtml += '<p style="font-size:14px;color:#C4A1FF;line-height:22px;">Your energy profile suggests your <strong style="color:#fff;">Heart Chakra</strong> and <strong style="color:#fff;">Crown Chakra</strong> are most receptive right now. Focus on crystals that open these centers for maximum energetic benefit.</p>';
  resultsHtml += '</div>';

  // 邮箱注册引导
  resultsHtml += '<div style="padding:25px;background:#f9f5ff;border-radius:12px;border:2px dashed #7C3AED;text-align:center;">';
  resultsHtml += '<h3 style="font-size:20px;color:#333;margin-bottom:8px;">Get Your Full Crystal Profile</h3>';
  resultsHtml += '<p style="font-size:14px;color:#888;margin-bottom:15px;line-height:22px;">Receive a detailed 5-page crystal report with personalized recommendations, affirmations, and a daily crystal ritual guide \u2014 delivered to your inbox.</p>';
  resultsHtml += '<input type="email" placeholder="Enter your email" style="padding:12px 18px;border:1px solid #ddd;border-radius:25px;width:60%;font-size:14px;margin-bottom:10px;" /><br/>';
  resultsHtml += '<button style="padding:12px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:25px;font-size:16px;cursor:pointer;">Send My Free Report</button>';
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
    quizSection,
    resultsSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateCrystalQuiz();
  await E.createPage(
    'Crystal Quiz: Find Your Perfect Crystal',
    'crystal-quiz',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateCrystalQuiz;
