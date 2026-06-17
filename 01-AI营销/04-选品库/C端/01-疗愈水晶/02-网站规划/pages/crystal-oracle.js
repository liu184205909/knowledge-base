/**
 * Crystal Oracle 页面
 * URL: /crystal-oracle
 *
 * 4个Section:
 * 1. 标题 — "Crystal Oracle: Free Crystal Reading"
 * 2. 占卜交互 — 点击"Draw a Crystal"按钮占位（HTML+CSS动画效果）
 * 3. 结果页 — 水晶含义+能量解读+推荐产品链接占位
 * 4. 邮箱注册 — "Get your full reading + crystal guide" 留资
 *
 * 用法:
 *   node crystal-oracle.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.crystalOracle.card.url;

// ============================================================
// Oracle 水晶卡池（用于随机抽取展示）
// ============================================================
var ORACLE_CRYSTALS = [
  { name: 'Amethyst',       subtitle: 'The Stone of Peace',          color: '#9B59B6', message: 'Trust the whispers of your intuition. Amethyst has appeared to remind you that clarity comes not from thinking harder, but from allowing space for inner wisdom to surface. Take a moment of stillness today.' },
  { name: 'Rose Quartz',    subtitle: 'The Stone of Love',           color: '#E91E8C', message: 'Love is flowing toward you in unexpected ways. Rose Quartz invites you to soften your heart, release old guards, and let compassion lead your next step. You are worthy of deep, unconditional love.' },
  { name: 'Citrine',        subtitle: 'The Stone of Abundance',      color: '#F39C12', message: 'Abundance is your birthright. Citrine\'s golden energy signals a turning point \u2014 your efforts are about to bear fruit. Stay confident and keep your energy focused on what you desire, not what you fear.' },
  { name: 'Black Tourmaline', subtitle: 'The Shield Stone',         color: '#2C3E50', message: 'Your energy field is being called for reinforcement. Black Tourmaline has drawn itself to you as a guardian. Set clear boundaries, protect your peace, and release any energy that does not serve your highest good.' },
  { name: 'Clear Quartz',   subtitle: 'The Master Healer',          color: '#BDC3C7', message: 'Purify your intentions. Clear Quartz arrives when it is time to strip away distractions and amplify what truly matters. Focus your energy on one clear goal \u2014 the universe is ready to conspire with you.' },
  { name: 'Moonstone',      subtitle: 'The Stone of New Beginnings', color: '#AEB6BF', message: 'A new chapter is unfolding. Moonstone whispers of cycles, transitions, and the courage to begin again. Trust the timing of your life. What feels like an ending is actually a doorway to something beautiful.' },
  { name: 'Tiger Eye',      subtitle: 'The Stone of Courage',       color: '#D4A017', message: 'Step into your power. Tiger Eye empowers you to face challenges with unwavering confidence. The path ahead requires courage \u2014 and you already have everything you need within you. Trust yourself.' },
  { name: 'Labradorite',    subtitle: 'The Stone of Magic',          color: '#5B6C8A', message: 'Something mystical is at work. Labradorite appears when hidden potential is ready to emerge. Pay attention to synchronicities and dreams \u2014 the universe is sending you signs that your magic is awakening.' }
];

// ============================================================
// 生成 Crystal Oracle 页面
// ============================================================
function generateCrystalOracle() {

  // ----------------------------------------------------------
  // Section 1: 标题 — "Crystal Oracle: Free Crystal Reading"
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#1A0A2E',
    background_image: { url: IMAGES.crystalOracle.hero.url, id: 0, size: '', alt: IMAGES.crystalOracle.hero.alt, source: 'library' },
    background_position: 'center center',
    background_size: 'cover',
    background_overlay_background: 'classic',
    background_overlay_color: 'rgba(26,10,46,0.72)'
  }, [
    E.textEditor(
      '<a href="/" style="color:#ccc;">Home</a> &gt; <span style="color:#fff;">Crystal Oracle</span>',
      { align: 'center', fontSize: 14, color: '#AAAAAA', extra: { text_color: '#AAAAAA' } }
    ),
    E.heading('Crystal Oracle', {
      fontSize: 48,
      color: '#FFFFFF',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading('Free Crystal Reading for Today\'s Energy', {
      fontSize: 22,
      color: '#C4A1FF',
      align: 'center',
      fontWeight: '400',
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Let the crystal kingdom speak to you. Close your eyes, take a deep breath, and draw a crystal to receive its message.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    )
  ]);

  // ----------------------------------------------------------
  // Section 2: 占卜交互 — Draw a Crystal 按钮 + CSS动画
  // ----------------------------------------------------------
  // 构建水晶卡数据（用于 JavaScript 随机抽取）
  var crystalDataJson = JSON.stringify(ORACLE_CRYSTALS.map(function (c) {
    return { name: c.name, subtitle: c.subtitle, color: c.color, message: c.message };
  }));

  var oracleHtml = '<div id="oracle-container" style="text-align:center;max-width:600px;margin:0 auto;">';

  // 装饰性水晶石堆图片占位
  oracleHtml += '<div id="oracle-crystals-visual" style="margin-bottom:25px;">';
  oracleHtml += '<img src="' + PLACEHOLDER + '" alt="Crystal Oracle" style="width:200px;border-radius:12px;opacity:0.8;" />';
  oracleHtml += '</div>';

  // Draw 按钮
  oracleHtml += '<button id="draw-crystal-btn" style="padding:16px 45px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:30px;font-size:18px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(124,58,237,0.4);transition:all 0.3s;letter-spacing:0.5px;">';
  oracleHtml += '\u2728 Draw a Crystal \u2728</button>';

  oracleHtml += '<p style="font-size:13px;color:#999;margin-top:12px;">Click the button to receive your crystal message</p>';

  // 动画遮罩层
  oracleHtml += '<div id="oracle-loading" style="display:none;margin-top:30px;">';
  oracleHtml += '<div style="width:80px;height:80px;margin:0 auto;border:4px solid #f3e8ff;border-top:4px solid #7C3AED;border-radius:50%;animation:oracle-spin 1s linear infinite;"></div>';
  oracleHtml += '<p style="color:#7C3AED;margin-top:15px;font-size:16px;">The crystals are choosing their message for you...</p>';
  oracleHtml += '</div>';

  oracleHtml += '</div>';

  // CSS 动画
  oracleHtml += '<style>';
  oracleHtml += '@keyframes oracle-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';
  oracleHtml += '@keyframes oracle-reveal{0%{opacity:0;transform:scale(0.8) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}';
  oracleHtml += '@keyframes oracle-glow{0%{box-shadow:0 0 10px rgba(124,58,237,0.3)}50%{box-shadow:0 0 30px rgba(124,58,237,0.6)}100%{box-shadow:0 0 10px rgba(124,58,237,0.3)}}';
  oracleHtml += '#draw-crystal-btn:hover{transform:translateY(-2px);box-shadow:0 6px 25px rgba(124,58,237,0.5);}';
  oracleHtml += '.oracle-result-card{animation:oracle-reveal 0.6s ease-out forwards;}';
  oracleHtml += '.oracle-glow{animation:oracle-glow 2s ease-in-out infinite;}';
  oracleHtml += '</style>';

  // JavaScript 交互逻辑
  oracleHtml += '<script>';
  oracleHtml += 'var ORACLE_CRYSTALS=' + crystalDataJson + ';';
  oracleHtml += 'document.getElementById("draw-crystal-btn").addEventListener("click",function(){';
  oracleHtml += '  var btn=this;btn.disabled=true;btn.style.opacity="0.6";';
  oracleHtml += '  var visual=document.getElementById("oracle-crystals-visual");if(visual)visual.style.display="none";';
  oracleHtml += '  var loading=document.getElementById("oracle-loading");loading.style.display="block";';
  oracleHtml += '  setTimeout(function(){';
  oracleHtml += '    loading.style.display="none";';
  oracleHtml += '    var crystal=ORACLE_CRYSTALS[Math.floor(Math.random()*ORACLE_CRYSTALS.length)];';
  oracleHtml += '    var container=document.getElementById("oracle-container");';
  oracleHtml += '    var resultHtml=\'<div class="oracle-result-card" style="padding:30px;background:#fff;border-radius:16px;border:2px solid \'+crystal.color+\';text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.08);">\';';
  oracleHtml += '    resultHtml+=\'<div style="width:70px;height:70px;border-radius:50%;background:\'+crystal.color+\';margin:0 auto 15px;box-shadow:0 0 20px \'+crystal.color+\'66;"></div>\';';
  oracleHtml += '    resultHtml+=\'<h3 style="font-size:24px;color:#333;margin-bottom:3px;">\'+crystal.name+\'</h3>\';';
  oracleHtml += '    resultHtml+=\'<p style="font-size:14px;color:\'+crystal.color+\';margin-bottom:15px;">\'+crystal.subtitle+\'</p>\';';
  oracleHtml += '    resultHtml+=\'<p style="font-size:16px;color:#555;line-height:26px;margin-bottom:20px;">\'+crystal.message+\'</p>\';';
  oracleHtml += '    resultHtml+=\'<a href="/crystal-guide/\'+crystal.name.toLowerCase().replace(/\\s+/g,\'-\')+\'-meaning" style="display:inline-block;padding:10px 25px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border-radius:25px;text-decoration:none;font-size:14px;">Explore \'+crystal.name+\'</a>\';';
  oracleHtml += '    resultHtml+=\'</div>\';';
  oracleHtml += '    resultHtml+=\'<div style="margin-top:20px;"><button onclick="location.reload()" style="padding:10px 25px;background:transparent;border:2px solid #7C3AED;color:#7C3AED;border-radius:25px;font-size:14px;cursor:pointer;">Draw Again</button></div>\';';
  oracleHtml += '    container.innerHTML=resultHtml;';
  oracleHtml += '    var resultSection=document.getElementById("oracle-results-section");';
  oracleHtml += '    if(resultSection){resultSection.style.display="block";resultSection.scrollIntoView({behavior:"smooth"});}';
  oracleHtml += '    btn.disabled=false;btn.style.opacity="1";';
  oracleHtml += '  },2000);';
  oracleHtml += '});';
  oracleHtml += '</script>';

  var oracleSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.htmlWidget(oracleHtml)
  ]);

  // ----------------------------------------------------------
  // Section 3: 结果页 — 水晶含义+能量解读+推荐产品链接占位
  // ----------------------------------------------------------
  var resultsHtml = '<div id="oracle-results-section" style="display:none;max-width:700px;margin:0 auto;">';

  resultsHtml += '<div style="text-align:center;margin-bottom:25px;">';
  resultsHtml += '<h2 style="font-size:28px;color:#333;margin-bottom:8px;">Deepen Your Crystal Connection</h2>';
  resultsHtml += '<p style="font-size:16px;color:#888;line-height:24px;">Your oracle reading has revealed the crystal energy that surrounds you today. Explore these recommended crystals to strengthen your connection.</p>';
  resultsHtml += '</div>';

  // 推荐产品网格
  resultsHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:15px;margin-bottom:20px;">';
  resultsHtml += '<div style="text-align:center;padding:15px;background:#fff;border-radius:10px;border:1px solid #f0e6ff;"><img src="' + PLACEHOLDER + '" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;" /><p style="font-size:13px;color:#333;">Amethyst Bracelet</p><p style="font-size:12px;color:#7C3AED;">$29.99</p></div>';
  resultsHtml += '<div style="text-align:center;padding:15px;background:#fff;border-radius:10px;border:1px solid #f0e6ff;"><img src="' + PLACEHOLDER + '" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;" /><p style="font-size:13px;color:#333;">Rose Quartz Bracelet</p><p style="font-size:12px;color:#7C3AED;">$29.99</p></div>';
  resultsHtml += '<div style="text-align:center;padding:15px;background:#fff;border-radius:10px;border:1px solid #f0e6ff;"><img src="' + PLACEHOLDER + '" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;" /><p style="font-size:13px;color:#333;">Citrine Bracelet</p><p style="font-size:12px;color:#7C3AED;">$32.99</p></div>';
  resultsHtml += '<div style="text-align:center;padding:15px;background:#fff;border-radius:10px;border:1px solid #f0e6ff;"><img src="' + PLACEHOLDER + '" style="width:60px;height:60px;border-radius:50%;margin-bottom:8px;" /><p style="font-size:13px;color:#333;">Moonstone Bracelet</p><p style="font-size:12px;color:#7C3AED;">$34.99</p></div>';
  resultsHtml += '</div>';

  resultsHtml += '</div>';

  var resultsSection = E.section({
    _padding: E.rPadding('40', '40', '60', '40', { tablet: { t: '30', r: '20', b: '40', l: '20' }, mobile: { t: '20', r: '15', b: '30', l: '15' } })
  }, [
    E.htmlWidget(resultsHtml)
  ]);

  // ----------------------------------------------------------
  // Section 4: 邮箱注册 — "Get your full reading + crystal guide" 留资
  // ----------------------------------------------------------
  var signupSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#1A0A2E'
  }, [
    E.heading('Get Your Full Crystal Reading', {
      fontSize: 32,
      color: '#FFFFFF',
      align: 'center',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Your oracle message is just the beginning. Receive a complete crystal energy reading plus our Crystal Beginner\'s Guide \u2014 delivered to your inbox for free.',
      { fontSize: 17, color: '#CCCCCC', lineHeight: 26 }
    ),
    E.spacer('10'),
    E.htmlWidget(
      '<div style="max-width:500px;margin:0 auto;text-align:center;">' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">' +
      '<input type="email" placeholder="Enter your email" style="padding:14px 20px;border:2px solid rgba(196,161,255,0.4);border-radius:30px;background:rgba(255,255,255,0.1);color:#fff;font-size:15px;outline:none;flex:1;min-width:200px;" />' +
      '<button style="padding:14px 30px;background:linear-gradient(135deg,#7C3AED,#C4A1FF);color:#fff;border:none;border-radius:30px;font-size:15px;font-weight:600;cursor:pointer;white-space:nowrap;">Get Free Reading</button>' +
      '</div>' +
      '<p style="font-size:12px;color:#888;margin-top:10px;">Join 10,000+ crystal lovers. Unsubscribe anytime. We respect your privacy.</p>' +
      '</div>'
    ),
    E.spacer('20'),
    E.textEditor(
      'What you\'ll receive:',
      { fontSize: 16, color: '#C4A1FF', extra: { _padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' } } }
    ),
    E.htmlWidget(
      '<div style="max-width:500px;margin:0 auto;text-align:left;">' +
      '<p style="color:#ccc;font-size:14px;line-height:28px;">' +
      '\u2728 Full crystal energy reading (5+ pages)<br/>' +
      '\uD83D\uDCD6 Crystal Beginner\'s Guide PDF<br/>' +
      '\uD83C\uDF19 Moon Calendar 2026<br/>' +
      '\uD83D\uDC8E Weekly crystal recommendations<br/>' +
      '\uD83D\uDD2E Exclusive oracle insights' +
      '</p>' +
      '</div>'
    )
  ]);

  return [
    heroSection,
    oracleSection,
    resultsSection,
    signupSection
  ];
}

// ============================================================
// Main
// ============================================================
async function main() {
  var data = generateCrystalOracle();
  await E.createPage(
    'Crystal Oracle: Free Crystal Reading',
    'crystal-oracle',
    data,
    'draft'
  );
}

main().catch(function (err) {
  console.error('Error:', err.message || err);
  process.exit(1);
});

module.exports = generateCrystalOracle;
