/**
 * Chakra Test（T5）— 14题问卷测失衡脉轮 → 推荐水晶
 * 7脉轮×2题,3级量表(Rarely/Sometimes/Often),低分=blocked,推荐对应chakra水晶(390颗search-data)
 * 复用 crystal-meaning-search/data/search-data.json 的 chakras 字段
 *
 * 输出：./chakra-test.html
 */
const fs = require('fs');
const path = require('path');

// ===== 14 题（7 脉轮 × 2）=====
const QUESTIONS = [
  { chakra: 'root', q: "I feel secure, grounded, and safe in my daily life." },
  { chakra: 'root', q: "I trust that my basic needs — money, shelter, stability — will be met." },
  { chakra: 'sacral', q: "I feel creative and can express my emotions freely." },
  { chakra: 'sacral', q: "I allow myself to experience pleasure and joy without guilt." },
  { chakra: 'solar-plexus', q: "I feel confident and in control of my choices." },
  { chakra: 'solar-plexus', q: "I can make decisions and stand by them." },
  { chakra: 'heart', q: "I give and receive love openly." },
  { chakra: 'heart', q: "I forgive easily and don't hold onto grudges." },
  { chakra: 'throat', q: "I express my thoughts and feelings honestly." },
  { chakra: 'throat', q: "I feel heard and understood by others." },
  { chakra: 'third-eye', q: "I trust my intuition and inner knowing." },
  { chakra: 'third-eye', q: "I can focus and see situations clearly." },
  { chakra: 'crown', q: "I feel connected to something greater than myself." },
  { chakra: 'crown', q: "I have a sense of purpose and meaning in life." },
];

// 7 脉轮（传统色 + 生活领域）
const CHAKRAS = {
  root: { name: 'Root', color: '#C0533B', area: 'security · stability · grounding', focus: 'feeling safe, grounded, and financially secure' },
  sacral: { name: 'Sacral', color: '#E0833C', area: 'creativity · emotion · pleasure', focus: 'creativity, emotional flow, and capacity for joy' },
  'solar-plexus': { name: 'Solar Plexus', color: '#CFAA3E', area: 'confidence · willpower · self-worth', focus: 'confidence, motivation, and personal power' },
  heart: { name: 'Heart', color: '#6FAE7A', area: 'love · compassion · connection', focus: 'giving and receiving love, emotional healing' },
  throat: { name: 'Throat', color: '#5A9BBF', area: 'communication · truth · expression', focus: 'speaking your truth and being heard' },
  'third-eye': { name: 'Third Eye', color: '#6A6AAE', area: 'intuition · insight · clarity', focus: 'intuition, focus, and inner vision' },
  crown: { name: 'Crown', color: '#8E6AAE', area: 'spirituality · purpose · connection', focus: 'spiritual connection and sense of purpose' },
};

// 读 search-data，每脉轮水晶（chakras 字段含，取 5，优先有 by-stone shop 的）
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const CHAKRA_ORDER = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
const CHAKRA_CRYSTALS = {};
for (const ck of CHAKRA_ORDER) {
  const all = SD.crystals.filter(c => (c.chakras || []).includes(ck));
  // 优先有 by-stone shop（/product-category/xxx-crystals/）的，取前 5
  const withShop = all.filter(c => /-crystals\/$/.test(c.shop));
  CHAKRA_CRYSTALS[ck] = (withShop.length >= 5 ? withShop : all).slice(0, 5);
}
const CRYSTALS_JSON = JSON.stringify(CHAKRA_CRYSTALS);
const CHAKRAS_JSON = JSON.stringify(CHAKRAS);
const QUESTIONS_JSON = JSON.stringify(QUESTIONS);
const CHAKRA_ORDER_JSON = JSON.stringify(CHAKRA_ORDER);

let html = `<!-- ===== Earthward Chakra Test ===== -->
<div id="ew-chakra">
  <h1 class="ewc5-h1">Chakra Test: Which Chakra Is Blocked?</h1>
  <p class="ewc5-intro">Answer ${QUESTIONS.length} honest questions about how you've been feeling. We'll identify which of your seven chakras needs the most attention — and the crystals traditionally used to bring it back into balance.</p>

  <div class="ewc5-quiz" id="ewc5-quiz"></div>
  <div class="ewc5-actions">
    <button class="ewc5-btn" id="ewc5-submit" disabled onclick="EWChakra.calc()">See My Results</button>
    <span class="ewc5-progress" id="ewc5-progress">0 of ${QUESTIONS.length} answered</span>
  </div>

  <div class="ewc5-result" id="ewc5-result"></div>
</div>
<style>
.ewc5-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ewc5-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ewc5-q{background:#fff;border:1px solid #EEE;border-radius:12px;padding:18px 20px;margin-bottom:10px}
.ewc5-q-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ewc5-q-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.ewc5-q-text{font-size:17px;color:#1A1A2E;font-weight:600;line-height:1.4}
.ewc5-opts{display:flex;gap:8px;flex-wrap:wrap}
.ewc5-opt{flex:1;min-width:90px;padding:10px;border:1px solid #DDD;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;color:#444;text-align:center;transition:.15s}
.ewc5-opt:hover{border-color:#95D5B2}
.ewc5-opt.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewc5-actions{display:flex;align-items:center;gap:16px;margin:18px 0 0}
.ewc5-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:10px;padding:13px 28px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewc5-btn:hover:not(:disabled){background:#1B4332}
.ewc5-btn:disabled{background:#CCC;color:#888 !important;cursor:not-allowed;box-shadow:none}
.ewc5-progress{color:#666;font-size:14px}
.ewc5-result{margin-top:30px;display:none}
.ewc5-result.show{display:block}
.ewc5-result-card{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:26px;margin-bottom:18px}
.ewc5-result-card h2{font-size:22px;color:#1A1A2E;margin:0 0 6px}
.ewc5-blocked-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#666}
.ewc5-blocked-name{font-size:26px;font-weight:700}
.ewc5-blocked-area{color:#666;font-size:15px;margin:6px 0 14px}
.ewc5-chakra-crystals{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:14px}
.ewc5-cc{background:#fff;border:1px solid #EEE;border-radius:10px;overflow:hidden;text-decoration:none;color:#1A1A2E;transition:.15s}
.ewc5-cc:hover{border-color:#2D6A4F;transform:translateY(-2px)}
.ewc5-cc img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#F0F7F4}
.ewc5-cc-name{padding:8px 10px;font-size:13px;font-weight:600;text-align:center}
.ewc5-chart{background:#fff;border:1px solid #EEE;border-radius:12px;padding:20px;margin-bottom:18px}
.ewc5-chart h3{font-size:17px;color:#1A1A2E;margin:0 0 14px}
.ewc5-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.ewc5-bar-label{width:90px;font-size:13px;color:#444;font-weight:600}
.ewc5-bar-track{flex:1;height:14px;background:#F0F0F0;border-radius:7px;overflow:hidden}
.ewc5-bar-fill{height:100%;border-radius:7px}
.ewc5-bar-val{width:30px;font-size:12px;color:#888;text-align:right}
.ewc5-lead{background:#fff;border:1px solid #2D6A4F33;border-radius:12px;padding:22px;text-align:center}
.ewc5-lead h3{font-size:18px;color:#1A1A2E;margin:0 0 8px}
.ewc5-lead p{color:#666;font-size:14px;margin:0 0 14px}
.ewc5-email-row{display:flex;gap:8px;max-width:380px;margin:0 auto}
.ewc5-email{flex:1;padding:11px 14px;border:1px solid #DDD;border-radius:8px;font-size:14px}
.ewc5-email:focus{outline:none;border-color:#2D6A4F}
.ewc5-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.ewc5-h1{font-size:26px}.ewc5-opt{min-width:70px;font-size:13px}.ewc5-bar-label{width:70px}}
</style>
<script>
var EWChakra=(function(){
  var Q=${QUESTIONS_JSON};
  var CH=${CHAKRAS_JSON};
  var CO=${CHAKRA_ORDER_JSON};
  var CC=${CRYSTALS_JSON};
  var answers={}; // qIndex -> 1/2/3

  function init(){renderQuiz();}
  function renderQuiz(){
    var el=document.getElementById('ewc5-quiz');if(!el)return;
    el.innerHTML=Q.map(function(q,i){
      var c=CH[q.chakra];
      return '<div class="ewc5-q">'
        +'<div class="ewc5-q-head"><span class="ewc5-q-dot" style="background:'+c.color+'"></span><span class="ewc5-q-text">'+(i+1)+'. '+q.q+'</span></div>'
        +'<div class="ewc5-opts" data-qi="'+i+'">'
        +'<button class="ewc5-opt" onclick="EWChakra.answer('+i+',1)">Rarely</button>'
        +'<button class="ewc5-opt" onclick="EWChakra.answer('+i+',2)">Sometimes</button>'
        +'<button class="ewc5-opt" onclick="EWChakra.answer('+i+',3)">Often</button>'
        +'</div></div>';
    }).join('');
  }
  function answer(qi,val){
    answers[qi]=val;
    document.querySelectorAll('.ewc5-opts[data-qi="'+qi+'"] .ewc5-opt').forEach(function(b,idx){
      b.classList.toggle('sel',idx===(val-1));
    });
    var n=Object.keys(answers).length;
    document.getElementById('ewc5-progress').textContent=n+' of '+Q.length+' answered';
    document.getElementById('ewc5-submit').disabled=(n<Q.length);
  }
  function calc(){
    // 每脉轮 2 题和 (2-6), blocked=最低
    var scores={};CO.forEach(function(ck){scores[ck]=0;});
    Q.forEach(function(q,i){if(answers[i])scores[q.chakra]+=answers[i];});
    var sorted=CO.map(function(ck){return{ck:ck,s:scores[ck]};}).sort(function(a,b){return a.s-b.s;});
    var blocked=[sorted[0].ck];
    if(sorted[1].s<=sorted[0].s+1)blocked.push(sorted[1].ck); // 接近最低也算
    renderResult(scores,blocked,sorted);
  }
  function renderResult(scores,blocked,sorted){
    var r=document.getElementById('ewc5-result');
    var html='<div class="ewc5-result-card">';
    html+='<div class="ewc5-blocked-label">Your most blocked chakra'+(blocked.length>1?'s':'')+'</div>';
    html+=blocked.map(function(ck){
      var c=CH[ck];
      return '<div style="margin-top:10px"><span class="ewc5-blocked-name" style="color:'+c.color+'">'+c.name+'</span><div class="ewc5-blocked-area">'+c.area+'</div></div>';
    }).join('');
    html+='<p style="color:#444;font-size:15px;margin:14px 0 0;line-height:1.6">This energy center governs '+blocked.map(function(ck){return CH[ck].focus;}).join(' and ')+'. When blocked, it often shows up as imbalance in these areas. The crystals below are traditionally used to support it.</p>';
    html+='</div>';
    // 推荐水晶
    html+='<div class="ewc5-result-card"><h2>Crystals to Balance Your '+blocked.map(function(ck){return CH[ck].name;}).join(' & ')+'</h2>';
    blocked.forEach(function(ck){
      html+='<div class="ewc5-chakra-crystals" style="margin-bottom:14px">';
      (CC[ck]||[]).forEach(function(c){
        html+='<a class="ewc5-cc" href="'+c.link+'"><img src="'+(c.img||'')+'" alt="'+c.name+'" loading="lazy"><div class="ewc5-cc-name">'+c.name+'</div></a>';
      });
      html+='</div>';
    });
    html+='<a class="ewc5-btn" href="/product-category/healing-crystals-jewelry/" style="display:inline-block;margin-top:6px;text-decoration:none">Shop Healing Crystal Jewelry →</a>';
    html+='</div>';
    // 全脉轮图表
    html+='<div class="ewc5-chart"><h3>Your Full Chakra Balance</h3>';
    sorted.slice().sort(function(a,b){return CO.indexOf(a.ck)-CO.indexOf(b.ck);}).forEach(function(item){
      var pct=Math.round((item.s/6)*100);
      var c=CH[item.ck];
      var lab=blocked.indexOf(item.ck)>=0?' ← needs care':'';
      html+='<div class="ewc5-bar-row"><span class="ewc5-bar-label">'+c.name+lab+'</span><div class="ewc5-bar-track"><div class="ewc5-bar-fill" style="width:'+pct+'%;background:'+c.color+'"></div></div><span class="ewc5-bar-val">'+item.s+'/6</span></div>';
    });
    html+='</div>';
    // 留资
    html+='<div class="ewc5-lead"><h3>Get Your Full 7-Chakra Report</h3><p>Free personalized report with the status of each chakra, deeper crystal guidance, and a daily balancing ritual. Drop your email.</p>';
    html+='<div class="ewc5-email-row"><input class="ewc5-email" type="email" placeholder="your@email.com"><button class="ewc5-btn" onclick="alert(\\'Report feature coming soon\\')">Get Full Report</button></div></div>';
    html+='<p class="ewc5-disclaim">Astrology, chakras, and crystal meanings are offered for reflection and spiritual inspiration. Crystals carry traditional symbolic qualities but are not a substitute for medical, financial, or professional advice.</p>';
    r.innerHTML=html;
    r.classList.add('show');
    r.scrollIntoView({behavior:'smooth',block:'start'});
  }
  return{init:init,answer:answer,calc:calc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWChakra.init);}else{EWChakra.init();}
</script>
<!-- ===== Chakra Test Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Test Which Chakra Is Blocked","description":"A 14-question self-assessment to identify your most blocked chakra and the crystals that traditionally restore balance.","step":[{"@type":"HowToStep","name":"Answer 14 questions","text":"Rate how true each statement feels about your current state, from Rarely to Often."},{"@type":"HowToStep","name":"See your blocked chakra","text":"Scores are tallied per chakra; the lowest indicate where energy is most blocked."},{"@type":"HowToStep","name":"Use the recommended crystals","text":"Each chakra maps to specific crystals traditionally used to restore balance."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is a chakra test?","acceptedAnswer":{"@type":"Answer","text":"A chakra test is a self-assessment quiz that helps identify which of your seven chakras may be blocked or out of balance, based on how you currently feel."}},{"@type":"Question","name":"How accurate is a chakra test?","acceptedAnswer":{"@type":"Answer","text":"A chakra test is a reflective tool, not a diagnostic. It points to where you might focus based on your current state. Energy shifts, so results can change over time."}},{"@type":"Question","name":"What crystal helps a blocked chakra?","acceptedAnswer":{"@type":"Answer","text":"Each chakra maps to specific crystals — root chakra stones like smoky quartz for grounding, heart chakra stones like rose quartz for love, third eye stones like amethyst for intuition."}},{"@type":"Question","name":"Can chakra test results change?","acceptedAnswer":{"@type":"Answer","text":"Yes. Your energy shifts with life circumstances, stress, and intentional practice. Retake the test periodically to track how your balance evolves."}}]}
]}
</script>
<!-- ===== End Chakra Test ===== -->`;

// SEO 折叠长文（chakra test 关键词覆盖，注入页面底部）
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Chakra Test SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Chakras & Crystals</summary>
    <div style="padding:24px 28px;color:#444;font-size:15px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Chakra Test SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'chakra-test.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Chakra Test 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${QUESTIONS.length} 题(7脉轮×2) | 每脉轮 ${Object.values(CHAKRA_CRYSTALS)[0].length} 颗推荐水晶`);
console.log(`   每脉轮水晶数:`, Object.fromEntries(CHAKRA_ORDER.map(ck => [CHAKRAS[ck].name, CHAKRA_CRYSTALS[ck].length])));
