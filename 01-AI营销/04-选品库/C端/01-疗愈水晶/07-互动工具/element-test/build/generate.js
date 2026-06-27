/**
 * Element Test 鈥?8棰樻祴浣犵殑涓诲鍏冪礌(earth/water/fire/air) 鈫?鎺ㄨ崘璇ュ厓绱犳按鏅? * 4鍏冪礌脳2棰?1琛屼负姝ｉ潰+1鍦烘櫙/闃村奖,姝ｄ氦瀵圭珛鍘昏禐璁告€у亸宸?,3绾ч噺琛?楂樺垎=涓诲(鐪熸鍚屽垎鎵嶅叡涓诲)
 * 澶嶇敤 crystal-meaning-search/data/search-data.json 鐨?element 瀛楁(宸插綊涓€鍖栦簲鍏?390棰?
 * 2026-06-27 瀹℃牳淇:棰樼洰鍦烘櫙鍖?鍘昏嚜澶搁€氳儉)+ 绠楀垎鏀剁揣 + 鍒犵暀璧勬閾?+ 鍚堣杞寲
 *
 * 杈撳嚭锛?/element-test.html
 */
const fs = require('fs');
const path = require('path');

// ===== 8 棰橈紙4 鍏冪礌 脳 2锛? 琛屼负姝ｉ潰 + 1 鍦烘櫙/闃村奖锛屾浜ゅ绔嬶級=====
const QUESTIONS = [
  { el: 'earth', q: "Friends would describe me as the dependable one who keeps plans." },
  { el: 'earth', q: "When my daily routine gets disrupted, I find it unsettling." },
  { el: 'water', q: "In a tough situation, I lead with how I feel rather than what's logical." },
  { el: 'water', q: "I sometimes take on other people's moods as my own." },
  { el: 'fire', q: "In group settings, I'm usually the one who kicks things off." },
  { el: 'fire', q: "When something excites me, I tend to jump in before thinking it through." },
  { el: 'air', q: "I enjoy exploring different sides of an issue, even one I don't personally hold." },
  { el: 'air', q: "I'd rather explore a new idea than stick with what's already familiar." },
];

// 4 鍏冪礌椤哄簭
const ELEMENT_ORDER = ['earth', 'water', 'fire', 'air'];
// 鍏冪礌鐭ヨ瘑鍗曟簮锛歘shared/element-knowledge.json锛堟枃绔?M2 鐢诲儚 + 宸ュ叿 ELEMENTS 鍏辩敤锛岄伩鍏嶄笉涓€鑷达級
const EK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/element-knowledge.json'), 'utf8')).elements;
const ELEMENT_COLOR = { earth:'#6FAE7A', water:'#5A9BBF', fire:'#E0833C', air:'#95B8D1' };
const ELEMENTS = {};
for (const el of ELEMENT_ORDER) {
  const k = EK[el];
  const q = k.traits.toLowerCase();
  ELEMENTS[el] = { name:k.name, color:ELEMENT_COLOR[el], area:q, focus:q, traits:k.balanced.toLowerCase() };
}

// Read normalized crystal data and keep 6 stones per element.
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const ELEMENT_CRYSTALS = {};
function compactCrystal(c) {
  return { slug: c.slug, name: c.name, img: c.img || '', link: c.link || '', shop: c.shop || '' };
}
function safeJSON(value) {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}
for (const el of ELEMENT_ORDER) {
  ELEMENT_CRYSTALS[el] = SD.crystals.filter(c => c.element === el).slice(0, 6).map(compactCrystal);
}
const CRYSTALS_JSON = safeJSON(ELEMENT_CRYSTALS);
const ELEMENTS_JSON = safeJSON(ELEMENTS);
const QUESTIONS_JSON = safeJSON(QUESTIONS);
const ELEMENT_ORDER_JSON = safeJSON(ELEMENT_ORDER);

let html = `<!-- ===== Earthward Element Test ===== -->
<div id="ewe-el">
  <h1 class="ewe-h1">Element Test: Which Element Are You?</h1>
  <p class="ewe-intro">Answer ${QUESTIONS.length} honest questions about how you think, feel, and act. We'll reveal your dominant element - Earth, Water, Fire, or Air - and the crystals traditionally associated with each element.</p>

  <div class="ewe-quiz" id="ewe-quiz"></div>
  <div class="ewe-actions">
    <button class="ewe-btn" id="ewe-submit" disabled onclick="EWElement.calc()">See My Element</button>
    <span class="ewe-progress" id="ewe-progress">0 of ${QUESTIONS.length} answered</span>
  </div>

  <div class="ewe-result" id="ewe-result"></div>
</div>
<style>
.ewe-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ewe-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ewe-q{background:#fff;border:1px solid #EEE;border-radius:12px;padding:18px 20px;margin-bottom:10px}
.ewe-q-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ewe-q-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.ewe-q-text{font-size:17px;color:#1A1A2E;font-weight:600;line-height:1.4}
.ewe-opts{display:flex;gap:8px;flex-wrap:wrap}
.ewe-opt{flex:1;min-width:90px;padding:10px;border:1px solid #DDD;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;color:#444;text-align:center;transition:.15s}
.ewe-opt:hover{border-color:#95D5B2}
.ewe-opt.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewe-actions{display:flex;align-items:center;gap:16px;margin:18px 0 0}
.ewe-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:10px;padding:13px 28px;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewe-btn:hover:not(:disabled){background:#1B4332}
.ewe-btn:disabled{background:#CCC;color:#888 !important;cursor:not-allowed;box-shadow:none}
.ewe-progress{color:#666;font-size:15px}
.ewe-result{margin-top:30px;display:none}
.ewe-result.show{display:block}
.ewe-result-card{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:22px;margin-bottom:14px}
.ewe-result-card h2{font-size:22px;color:#1A1A2E;margin:0 0 6px}
.ewe-el-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#666}
.ewe-el-name{font-size:26px;font-weight:700}
.ewe-el-area{color:#666;font-size:15px;margin:4px 0 4px;line-height:1.45}
.ewe-el-traits{color:#444;font-size:15px;margin:4px 0 0;font-style:italic}
.ewe-el-crystals{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:12px}
.ewe-cc{background:#fff;border:1px solid #EEE;border-radius:10px;overflow:hidden;text-decoration:none;color:#1A1A2E;transition:.15s}
.ewe-cc:hover{border-color:#2D6A4F;transform:translateY(-2px)}
.ewe-cc img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#F0F7F4}
.ewe-cc-name{padding:8px 10px;font-size:14px;font-weight:600;text-align:center}
.ewe-chart{background:#fff;border:1px solid #EEE;border-radius:12px;padding:20px;margin-bottom:18px}
.ewe-chart h3{font-size:17px;color:#1A1A2E;margin:0 0 14px}
.ewe-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.ewe-bar-label{width:90px;font-size:13px;color:#444;font-weight:600}
.ewe-bar-track{flex:1;height:14px;background:#F0F0F0;border-radius:7px;overflow:hidden}
.ewe-bar-fill{height:100%;border-radius:7px}
.ewe-bar-val{width:30px;font-size:12px;color:#888;text-align:right}
.ewe-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.ewe-h1{font-size:24px}.ewe-result-card h2{font-size:20px}.ewe-el-name{font-size:23px}.ewe-intro,.ewe-q-text,#ewe-el p,#ewe-el li,#ewe-el td,#ewe-el th{font-size:16px!important}.ewe-opt{min-width:70px;font-size:13px}.ewe-bar-label{width:70px}}
</style>
<script>
var EWElement=(function(){
  var Q=${QUESTIONS_JSON};
  var EL=${ELEMENTS_JSON};
  var EO=${ELEMENT_ORDER_JSON};
  var EC=${CRYSTALS_JSON};
  var answers={}; // qIndex -> 1/2/3

  function init(){renderQuiz();}
  function renderQuiz(){
    var el=document.getElementById('ewe-quiz');if(!el)return;
    el.innerHTML=Q.map(function(q,i){
      var e=EL[q.el];
      return '<div class="ewe-q">'
        +'<div class="ewe-q-head"><span class="ewe-q-dot" style="background:'+e.color+'"></span><span class="ewe-q-text">'+(i+1)+'. '+q.q+'</span></div>'
        +'<div class="ewe-opts" data-qi="'+i+'">'
        +'<button class="ewe-opt" onclick="EWElement.answer('+i+',1)">Rarely</button>'
        +'<button class="ewe-opt" onclick="EWElement.answer('+i+',2)">Sometimes</button>'
        +'<button class="ewe-opt" onclick="EWElement.answer('+i+',3)">Often</button>'
        +'</div></div>';
    }).join('');
  }
  function answer(qi,val){
    answers[qi]=val;
    document.querySelectorAll('.ewe-opts[data-qi="'+qi+'"] .ewe-opt').forEach(function(b,idx){
      b.classList.toggle('sel',idx===(val-1));
    });
    var n=Object.keys(answers).length;
    document.getElementById('ewe-progress').textContent=n+' of '+Q.length+' answered';
    document.getElementById('ewe-submit').disabled=(n<Q.length);
  }
  function calc(){
    // Sum two questions per element. True ties share dominance.
    var scores={};EO.forEach(function(el){scores[el]=0;});
    Q.forEach(function(q,i){if(answers[i])scores[q.el]+=answers[i];});
    var sorted=EO.map(function(el){return{el:el,s:scores[el]};}).sort(function(a,b){return b.s-a.s;});
    var dominant=[sorted[0].el];
    for(var i=1;i<sorted.length;i++){ if(sorted[i].s===sorted[0].s) dominant.push(sorted[i].el); else break; }
    renderResult(scores,dominant,sorted);
  }
  function scrollToResult(r){
    var offset=window.innerWidth<768?80:120;
    var y=r.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
  function renderResult(scores,dominant,sorted){
    var r=document.getElementById('ewe-result');
    var html='<div class="ewe-result-card">';
    html+='<div class="ewe-el-label">Your dominant element'+(dominant.length>1?'s':'')+'</div>';
    html+=dominant.map(function(el){
      var e=EL[el];
      return '<div style="margin-top:10px"><span class="ewe-el-name" style="color:'+e.color+'">'+e.name+'</span><div class="ewe-el-area">'+e.area+'</div><div class="ewe-el-traits">'+e.traits+'</div></div>';
    }).join('');
    html+='<p style="color:#444;font-size:16px;margin:10px 0 0;line-height:1.5">'+dominant.map(function(el){return EL[el].name+' energy is traditionally associated with '+EL[el].focus;}).join(' and ')+'. People with this element tend to be '+dominant.map(function(el){return EL[el].traits;}).join(' and ')+'. The crystals below are traditionally associated with this element and often used as a focus for intention or mindfulness.</p>';
    html+='</div>';
    // 鎺ㄨ崘姘存櫠
    html+='<div class="ewe-result-card"><h2>Crystals Traditionally Associated with Your '+dominant.map(function(el){return EL[el].name;}).join(' & ')+' Element</h2>';
    dominant.forEach(function(el){
      html+='<div class="ewe-el-crystals" style="margin-bottom:14px">';
      (EC[el]||[]).forEach(function(c){
        html+='<a class="ewe-cc" href="'+c.link+'"><img src="'+(c.img||'')+'" alt="'+c.name+'" loading="lazy"><div class="ewe-cc-name">'+c.name+'</div></a>';
      });
      html+='<a href="/'+el+'-crystals/" style="display:block;margin-top:12px;color:#2D6A4F;font-weight:600;text-decoration:none;font-size:15px">Read the '+EL[el].name+' Element Crystals Guide -&gt;</a>';
      html+='</div>';
    });
    html+='<a class="ewe-btn" href="/product-category/healing-crystals-jewelry/" style="display:inline-block;margin-top:6px;text-decoration:none">Shop Healing Crystal Jewelry -&gt;</a>';
    html+='</div>';
    // 鍏ㄥ厓绱犲浘琛?    html+='<div class="ewe-chart"><h3>Your Full Element Balance</h3>';
    sorted.slice().sort(function(a,b){return EO.indexOf(a.el)-EO.indexOf(b.el);}).forEach(function(item){
      var pct=Math.round((item.s/6)*100);
      var e=EL[item.el];
      var lab=dominant.indexOf(item.el)>=0?' - dominant':'';
      html+='<div class="ewe-bar-row"><span class="ewe-bar-label">'+e.name+lab+'</span><div class="ewe-bar-track"><div class="ewe-bar-fill" style="width:'+pct+'%;background:'+e.color+'"></div></div><span class="ewe-bar-val">'+item.s+'/6</span></div>';
    });
    html+='</div>';
    html+='<p class="ewe-disclaim">Element typing and crystal meanings are offered for reflection and spiritual inspiration. There is no scientific evidence that crystals directly treat disease, but many people use them as meditation, intention-setting, and self-awareness tools. Crystals are not a substitute for medical, financial, or professional advice.</p>';
    r.innerHTML=html;
    r.classList.add('show');
    scrollToResult(r);
  }
  return{init:init,answer:answer,calc:calc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWElement.init);}else{EWElement.init();}
</script>
<!-- ===== Element Test Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Find Out Which Element You Are","description":"A short self-assessment to identify the element that most strongly reflects your temperament (Earth, Water, Fire, or Air) and the crystals traditionally associated with it.","step":[{"@type":"HowToStep","name":"Answer 8 questions","text":"Rate how true each statement feels about your temperament, from Rarely to Often."},{"@type":"HowToStep","name":"See your dominant element","text":"Scores are tallied per element; the highest reveal the element that most strongly reflects your temperament."},{"@type":"HowToStep","name":"Use the recommended crystals","text":"Explore the crystals traditionally associated with your element - carry one, place it on your desk, or hold it during a few minutes of mindful breathing as a focus for intention."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What are the four elements?","acceptedAnswer":{"@type":"Answer","text":"In the Western tradition the four elements are Earth, Water, Fire, and Air. Together they describe the core energies that shape personality, emotion, action, and thought."}},{"@type":"Question","name":"How do I know which element I am?","acceptedAnswer":{"@type":"Answer","text":"Take the 8-question element test above. The element scoring highest reflects your dominant temperament - grounded Earth, emotional Water, passionate Fire, or intellectual Air."}},{"@type":"Question","name":"Which crystals match my element?","acceptedAnswer":{"@type":"Answer","text":"Each element is traditionally associated with specific crystals - for example, Earth stones like smoky quartz often used as a symbol of grounding, Water stones like aquamarine linked to emotional reflection, Fire stones like carnelian associated with passion, and Air stones like blue lace agate used as a focus for clear communication."}},{"@type":"Question","name":"Can my dominant element change?","acceptedAnswer":{"@type":"Answer","text":"Your core element is relatively stable, but stress, life seasons, and intentional practice can shift the balance. Retake the test periodically to see how your elemental makeup evolves."}}]}
]}
</script>
<!-- ===== End Element Test ===== -->`;

// SEO 鎶樺彔闀挎枃锛坋lement test 鍏抽敭璇嶈鐩栵紝娉ㄥ叆椤甸潰搴曢儴锛?let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Element Test SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About the Elements & Crystals</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Element Test SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'element-test.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`Element Test generated -> ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${QUESTIONS.length} questions | ${Object.values(ELEMENT_CRYSTALS)[0].length} crystals per element`);
console.log('   crystal counts:', Object.fromEntries(ELEMENT_ORDER.map(el => [ELEMENTS[el].name, ELEMENT_CRYSTALS[el].length])));

