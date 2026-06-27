/**
 * Crystal Quiz 閳?8妫版ɑ绁存担鐘烩偓鍌氭値閻ㄥ嫰顤侀懝鍙夋寜閺?white/black/pink/green/blue/purple/red/yellow)
 * 8娑撴槒澹婅劤1妫?闂団偓濮瑰倸婧€閺咁垰瀵?,3缁狙囧櫤鐞?0/1/2:Not really/Somewhat/Yes),妤傛ê鍨?娑撹顕辨０婊嗗(閸楁洑瀵岀€?閸氬苯鍨庨崣鏈嘜LOR_ORDER閸?
 * 鐠?_shared/color-knowledge.json(area=symbolism/focus=psychology)+ search-data colors(濮樺瓨娅?
 * 瀹割喖绱撻崠?缁旂偛鎼?crystals.com/energymuse)閹稿鍓伴崶?閻╃顫?閹存垳婊戦幐澶愵杹閼规祴鍟嬮幒銊嚉閼瑰弶鎸夐弲?闁?2color閺傚洨鐝?
 * 2026-06-27 鐎光剝鐗虫穱顔款吂:鐎涙顔岄崢濠氬櫢(P0-1)+閸楁洑瀵岀€?P0-2)+缂佹挻鐏夐崶鐐村⒏閸欐瑤绨?P0-3)+闁插繗銆?/1/2(P1-2)+妫版娲伴幒顏囩犯閸樺鍣搁崣? *
 * 鏉堟挸鍤敍?/crystal-quiz.html
 */
const fs = require('fs');
const path = require('path');

// ===== 8 妫版﹫绱? 娑撴槒澹?鑴?1閿涘矂娓跺Ч鍌氭簚閺咁垰瀵查敍灞藉箵閻╂悂鍋﹂懝鏌ュ櫢閸欑媴绱?====
const QUESTIONS = [
  { color: 'white', q: "I'm seeking mental clarity, cleansing, or a fresh start." },
  { color: 'black', q: "I need to feel protected or set stronger boundaries." },
  { color: 'pink', q: "I'm looking for love, compassion, or gentle self-care." },
  { color: 'green', q: "I want growth, abundance, or a sense of renewal." },
  { color: 'blue', q: "I crave calm, peace, or clearer self-expression." },
  { color: 'purple', q: "I'm drawn to intuition, insight, or spiritual depth." },
  { color: 'red', q: "I need energy, courage, or motivation to take action." },
  { color: 'yellow', q: "I want confidence, optimism, or sharper mental focus." },
];

// 8 娑撴槒澹婃い鍝勭碍
const COLOR_ORDER = ['white', 'black', 'pink', 'green', 'blue', 'purple', 'red', 'yellow'];
// Read shared color knowledge.
const CK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/color-knowledge.json'), 'utf8')).colors;
const COLOR_HEX = { white:'#BFBFBF', black:'#3A3A3A', pink:'#E0839E', green:'#6FAE7A', blue:'#5A9BBF', purple:'#8E6AAE', red:'#C0533B', yellow:'#CFAA3E' };
const COLORS = {};
for (const cl of COLOR_ORDER) {
  const k = CK[cl];
  COLORS[cl] = { name:k.name, color:COLOR_HEX[cl], area:k.symbolism.toLowerCase(), focus:k.psychology.toLowerCase() };
}

// Read normalized crystal data and keep 6 stones per color.
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const COLOR_CRYSTALS = {};
function compactCrystal(c) {
  return { slug: c.slug, name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || '' };
}
function safeJSON(value) {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}
for (const cl of COLOR_ORDER) {
  COLOR_CRYSTALS[cl] = SD.crystals.filter(c => (c.colors || []).includes(cl)).slice(0, 6).map(compactCrystal);
}
const CRYSTALS_JSON = safeJSON(COLOR_CRYSTALS);
const COLORS_JSON = safeJSON(COLORS);
const QUESTIONS_JSON = safeJSON(QUESTIONS);
const COLOR_ORDER_JSON = safeJSON(COLOR_ORDER);

let html = `<!-- ===== Earthward Crystal Quiz ===== -->
<div id="ewq-cq">
  <h1 class="ewq-h1">Crystal Quiz: Which Crystal Is Right for You?</h1>
  <p class="ewq-intro">Answer ${QUESTIONS.length} quick questions about what you're seeking right now. We'll match you with the color that fits your energy - and the crystals traditionally associated with it.</p>

  <div class="ewq-quiz" id="ewq-quiz"></div>
  <div class="ewq-actions">
    <button class="ewq-btn" id="ewq-submit" disabled onclick="EWQuiz.calc()">See My Crystal</button>
    <span class="ewq-progress" id="ewq-progress">0 of ${QUESTIONS.length} answered</span>
  </div>

  <div class="ewq-result" id="ewq-result"></div>
</div>
<style>
.ewq-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ewq-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ewq-q{background:#fff;border:1px solid #EEE;border-radius:12px;padding:18px 20px;margin-bottom:8px}
.ewq-q-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ewq-q-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.ewq-q-text{font-size:17px;color:#1A1A2E;font-weight:600;line-height:1.4}
.ewq-opts{display:flex;gap:8px;flex-wrap:wrap}
.ewq-opt{flex:1;min-width:90px;padding:10px;border:1px solid #DDD;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;color:#444;text-align:center;transition:.15s}
.ewq-opt:hover{border-color:#95D5B2}
.ewq-opt.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewq-actions{display:flex;align-items:center;gap:16px;margin:18px 0 0}
.ewq-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:10px;padding:13px 28px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewq-btn:hover:not(:disabled){background:#1B4332}
.ewq-btn:disabled{background:#CCC;color:#888 !important;cursor:not-allowed;box-shadow:none}
.ewq-progress{color:#666;font-size:15px}
.ewq-result{margin-top:30px;display:none}
.ewq-result.show{display:block}
.ewq-result-card{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:22px;margin-bottom:14px}
.ewq-result-card h2{font-size:22px;color:#1A1A2E;margin:0 0 6px}
.ewq-color-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#666}
.ewq-color-name{font-size:26px;font-weight:700}
.ewq-color-area{color:#666;font-size:15px;margin:4px 0 4px;line-height:1.45}
.ewq-color-crystals{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px}
.ewq-cc{background:#fff;border:1px solid #EEE;border-radius:10px;overflow:hidden;text-decoration:none;color:#1A1A2E;transition:.15s}
.ewq-cc:hover{border-color:#2D6A4F;transform:translateY(-2px)}
.ewq-cc img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#F0F7F4}
.ewq-cc-name{padding:8px 10px;font-size:14px;font-weight:600;text-align:center}
.ewq-chart{background:#fff;border:1px solid #EEE;border-radius:12px;padding:20px;margin-bottom:18px}
.ewq-chart h3{font-size:17px;color:#1A1A2E;margin:0 0 14px}
.ewq-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.ewq-bar-label{width:90px;font-size:13px;color:#444;font-weight:600}
.ewq-bar-track{flex:1;height:14px;background:#F0F0F0;border-radius:7px;overflow:hidden}
.ewq-bar-fill{height:100%;border-radius:7px}
.ewq-bar-val{width:30px;font-size:12px;color:#888;text-align:right}
.ewq-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.ewq-h1{font-size:24px}.ewq-result-card h2{font-size:20px}.ewq-color-name{font-size:23px}.ewq-intro,.ewq-q-text,#ewq-cq p,#ewq-cq li,#ewq-cq td,#ewq-cq th{font-size:16px!important}.ewq-opt{min-width:70px;font-size:13px}.ewq-bar-label{width:70px}}
</style>
<script>
var EWQuiz=(function(){
  var Q=${QUESTIONS_JSON};
  var CL=${COLORS_JSON};
  var CO=${COLOR_ORDER_JSON};
  var CC=${CRYSTALS_JSON};
  var answers={}; // qIndex -> 0/1/2

  function init(){renderQuiz();}
  function renderQuiz(){
    var el=document.getElementById('ewq-quiz');if(!el)return;
    el.innerHTML=Q.map(function(q,i){
      var c=CL[q.color];
      return '<div class="ewq-q">'
        +'<div class="ewq-q-head"><span class="ewq-q-dot" style="background:'+c.color+'"></span><span class="ewq-q-text">'+(i+1)+'. '+q.q+'</span></div>'
        +'<div class="ewq-opts" data-qi="'+i+'">'
        +'<button class="ewq-opt" onclick="EWQuiz.answer('+i+',0)">Not really</button>'
        +'<button class="ewq-opt" onclick="EWQuiz.answer('+i+',1)">Somewhat</button>'
        +'<button class="ewq-opt" onclick="EWQuiz.answer('+i+',2)">Yes, exactly</button>'
        +'</div></div>';
    }).join('');
  }
  function answer(qi,val){
    answers[qi]=val;
    document.querySelectorAll('.ewq-opts[data-qi="'+qi+'"] .ewq-opt').forEach(function(b,idx){
      b.classList.toggle('sel',idx===val);
    });
    var n=Object.keys(answers).length;
    document.getElementById('ewq-progress').textContent=n+' of '+Q.length+' answered';
    document.getElementById('ewq-submit').disabled=(n<Q.length);
  }
  function calc(){
    // 濮ｅ繗澹?1 妫?(0-2), dominant=閺堚偓妤?閸楁洑瀵岀€?閸氬苯鍨庨崣鏈嘜LOR_ORDER閸?P0-2)
    var scores={};CO.forEach(function(cl){scores[cl]=0;});
    Q.forEach(function(q,i){if(answers[i])scores[q.color]+=answers[i];});
    var maxS=-1;CO.forEach(function(cl){if(scores[cl]>maxS)maxS=scores[cl];});
    var dominant=[CO.find(function(cl){return scores[cl]===maxS;})]; // 閸楁洑瀵岀€?COLOR_ORDER 娑擃厾顑囨稉鈧稉顏囨彧 maxS
    var sorted=CO.map(function(cl){return{cl:cl,s:scores[cl]};}).sort(function(a,b){return b.s-a.s;});
    renderResult(scores,dominant,sorted);
  }
  function renderResult(scores,dominant,sorted){
    var r=document.getElementById('ewq-result');
    var html='<div class="ewq-result-card">';
    html+='<div class="ewq-color-label">Your color match</div>';
    dominant.forEach(function(cl){
      var c=CL[cl], q=Q.find(function(x){return x.color===cl;});
      var resp=q.q.replace(/^I'm /,"You're ").replace(/^I /,"You ");
      html+='<div style="margin-top:10px"><span class="ewq-color-name" style="color:'+c.color+'">'+c.name+'</span><div class="ewq-color-area">'+c.area+'</div></div>';
      html+='<p style="color:#444;font-size:17px;margin:12px 0 0;line-height:1.6"><strong>'+c.name+'</strong> matched your response: "'+resp+'." '+c.name+' crystals are traditionally associated with '+c.focus+', and are often used as a focus for that intention.</p>';
    });
    html+='</div>';
    // 閹恒劏宕樺瀛樻珷
    html+='<div class="ewq-result-card"><h2>Crystals Traditionally Associated with '+dominant.map(function(cl){return CL[cl].name;}).join(' & ')+'</h2>';
    dominant.forEach(function(cl){
      html+='<div class="ewq-color-crystals" style="margin-bottom:14px">';
      (CC[cl]||[]).forEach(function(c){
        html+='<a class="ewq-cc" href="'+c.link+'"><img src="'+(c.img||'')+'" alt="'+c.name+'" loading="lazy"><div class="ewq-cc-name">'+c.name+'</div></a>';
      });
      html+='<a href="/'+cl+'-crystals/" style="display:block;margin-top:12px;color:#2D6A4F;font-weight:600;text-decoration:none;font-size:15px">Read the '+CL[cl].name+' Crystals Guide -&gt;</a>';
      html+='</div>';
    });
    html+='<a class="ewq-btn" href="/product-category/healing-crystals-jewelry/" style="display:inline-block;margin-top:6px;text-decoration:none">Shop Healing Crystal Jewelry -&gt;</a>';
    html+='</div>';
    // 閸忋劏澹婇崶鎹愩€?濞喡ゅ閼奉亞鍔ч弰鍓с仛,閺冪娀娓堕崗鍙樺瘜鐎靛吋鐖ｅ▔?
    html+='<div class="ewq-chart"><h3>Your Full Color Match</h3>';
    sorted.slice().sort(function(a,b){return CO.indexOf(a.cl)-CO.indexOf(b.cl);}).forEach(function(item){
      var pct=Math.round((item.s/2)*100);
      var c=CL[item.cl];
      var lab=dominant.indexOf(item.cl)>=0?' - match':'';
      html+='<div class="ewq-bar-row"><span class="ewq-bar-label">'+c.name+lab+'</span><div class="ewq-bar-track"><div class="ewq-bar-fill" style="width:'+pct+'%;background:'+c.color+'"></div></div><span class="ewq-bar-val">'+item.s+'/2</span></div>';
    });
    html+='</div>';
    html+='<p class="ewq-disclaim">Crystal meanings are offered for reflection and spiritual inspiration. There is no scientific evidence that crystals directly treat disease, but many people use them as meditation, intention-setting, and self-awareness tools. They are not a substitute for medical, financial, or professional advice.</p>';
    r.innerHTML=html;
    r.classList.add('show');
    var offset=window.innerWidth<768?80:120;
    var top=r.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:top,behavior:'smooth'});
  }
  return{init:init,answer:answer,calc:calc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWQuiz.init);}else{EWQuiz.init();}
</script>
<!-- ===== Crystal Quiz Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Find the Right Crystal for You","description":"A short quiz to match you with the crystal color that fits what you are seeking right now, and the stones traditionally associated with it.","step":[{"@type":"HowToStep","name":"Answer 8 questions","text":"Rate how much each statement matches what you are seeking, from Not really to Yes, exactly."},{"@type":"HowToStep","name":"See your color match","text":"Scores are tallied per color; the highest reveals the color that fits your current intention."},{"@type":"HowToStep","name":"Use the recommended crystals","text":"Explore the crystals traditionally associated with your color 閳?carry one, wear it as jewelry, or hold it during a few minutes of mindful breathing."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I know which crystal is right for me?","acceptedAnswer":{"@type":"Answer","text":"Take the 8-question crystal quiz above. The color scoring highest reflects what you are seeking right now 閳?and each color maps to specific crystals traditionally used for that intention, such as rose quartz for love or amethyst for intuition. Many people retake it weekly or as their focus shifts."}},{"@type":"Question","name":"What crystal should I buy?","acceptedAnswer":{"@type":"Answer","text":"It depends on what you need. For calm, blue stones like aquamarine are often used. For love, pink stones like rose quartz. For protection, black stones like black tourmaline. The quiz above matches you to a color based on your current intention."}},{"@type":"Question","name":"Can I choose a crystal by color?","acceptedAnswer":{"@type":"Answer","text":"Yes. Color is one of the simplest ways to choose a crystal, because each color is traditionally associated with certain intentions 閳?white for clarity, green for growth, purple for intuition, yellow for confidence, and so on."}},{"@type":"Question","name":"Do I have to stick with my result?","acceptedAnswer":{"@type":"Answer","text":"No. Your result reflects what you are seeking right now, which can change. You can use crystals from any color at any time 閳?trust your own sense of what draws you."}}]}
]}
</script>
<!-- ===== End Crystal Quiz ===== -->`;

// SEO 閹舵ê褰旈梹鎸庢瀮閿涘潏rystal quiz 閸忔娊鏁拠宥堫洬閻╂牭绱濆▔銊ュ弳妞ょ敻娼版惔鏇㈠劥閿?let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Crystal Quiz SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Choosing Crystals</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Crystal Quiz SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'crystal-quiz.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`Crystal Quiz generated -> ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${QUESTIONS.length} questions | ${Object.values(COLOR_CRYSTALS)[0].length} crystals per color`);
console.log('   crystal counts:', Object.fromEntries(COLOR_ORDER.map(cl => [COLORS[cl].name, COLOR_CRYSTALS[cl].length])));
