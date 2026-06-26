/**
 * 生成 Crystal Compatibility Checker 独立页面
 * 30 颗水晶，只选 2 颗，新结果页架构
 *
 * 输出：../crystal-checker.html
 */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../crystal-stones-30.json'), 'utf8'));
const STONES = DATA.stones;
const ELEM = DATA.elem;
const CONFLICTS = DATA.conflicts;

// HAS_ARTICLE = selected-articles.json 计划清单（207 组将产出文章）
// 207 篇即将批量上线 → 这 207 组 CTA 现在就显示 "Read Full Combination Guide"（接受上线前临时 404，符合 internal-link-planned-pages-ok-404）
// 其余 228 组（无文章）显示 "Shop This Pair"。文章上线后清单不变，无需改这里。
const SELECTED_PATH = path.resolve(__dirname, '../../../04-内容生产/5.crystal-combinations/selected-articles.json');
let HAS_ARTICLE = [];
try { HAS_ARTICLE = JSON.parse(fs.readFileSync(SELECTED_PATH, 'utf8')).articles.map(a => a.slug); } catch (e) { console.log('⚠ selected-articles.json 读取失败，HAS_ARTICLE 用空'); }
const HAS_ARTICLE_JSON = JSON.stringify(HAS_ARTICLE);

const STONES_JSON = JSON.stringify(STONES);
const ELEM_JSON = JSON.stringify(ELEM);
const CONFLICTS_JSON = JSON.stringify(CONFLICTS);
const SEO_PATH = path.resolve(__dirname, '../seo-content.html');
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(SEO_PATH, 'utf8'); } catch(e) {}

let html = `<!-- ===== Earthward Crystal Compatibility Checker ===== -->
<div id="ew-compat">
  <h1 class="ewc-h1">Crystal Compatibility Checker</h1>
  <p class="ewc-intro">Can you wear these two crystals together? Pick any two stones to see their energetic compatibility, why they pair well, and the best ways to wear them.</p>
  <div class="ewc-panel">
    <input class="ewc-search" placeholder="Search crystals..." oninput="EWCrystal.filterStones(this.value)">
    <div class="ewc-grid" id="ewc-stone-grid"></div>
    <p class="ewc-hint" id="ewc-hint">Select 2 crystals</p>
    <button class="ewc-btn" id="ewc-analyze" disabled onclick="EWCrystal.analyze()">Analyze Compatibility</button>
  </div>
  <div class="ewc-result" id="ewc-result"></div>
</div>
<style>
.ewc-h1{font-size:32px;color:#1A1A2E;margin:0 0 10px;font-weight:700;line-height:1.2}.ewc-intro{color:#444;font-size:16px;line-height:1.6;margin:0 0 24px;max-width:720px}
.ewc-panel{background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:16px;box-sizing:border-box}
.ewc-search{width:100%;padding:10px 14px;border:1px solid #EEE;border-radius:8px;font-size:15px;margin-bottom:10px;box-sizing:border-box}
.ewc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;height:clamp(210px,25vh,300px);overflow-y:auto;align-content:start;padding-right:2px}
.ewc-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px 8px;border:1px solid #EEE;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}.ewc-chip:hover{border-color:#95D5B2}.ewc-chip.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}.ewc-chip .ic{width:56px;height:56px;border-radius:50%;overflow:hidden;background:#F0F7F4;display:flex;align-items:center;justify-content:center}.ewc-chip .ic img{width:100%;height:100%;object-fit:cover}.ewc-chip .nm{font-size:12px;color:#444;line-height:1.2;min-height:28px;display:flex;align-items:center}
.ewc-hint{color:#666;font-size:13px;margin:8px 0 8px;text-align:center}
.ewc-btn{display:block;width:100%;padding:12px;background:#2D6A4F;color:#fff !important;border:none;border-radius:10px;font-size:15px;cursor:pointer}.ewc-btn:hover{background:#1B4332;color:#fff !important}.ewc-btn:disabled{background:#CCC;color:#666 !important;cursor:not-allowed}
.ewc-result{margin-top:40px;display:none}.ewc-result.show{display:block}
.ewc-card{background:#FAFAFA;border:1px solid #E8E8E8;border-radius:12px;padding:18px;margin-bottom:12px}
.ewc-result-top,.ewc-result-detail{display:grid !important;gap:12px;margin-bottom:12px;align-items:stretch}
.ewc-result-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.ewc-result-detail{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.ewc-result-top .ewc-card,.ewc-result-detail .ewc-card{margin:0}
.ewc-score-card{display:flex;align-items:center;justify-content:center}
.ewc-cta-card{display:flex;flex-direction:column;justify-content:center;gap:14px}
.ewc-guide-link{display:block;text-align:center;background:#2D6A4F;color:#fff !important;padding:12px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600}.ewc-guide-link:hover{background:#1B4332;color:#fff !important}
.ewc-score-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}.ewc-ring{position:relative;width:130px;height:130px}.ewc-ring svg{transform:rotate(-90deg)}.ewc-ring .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.ewc-ring .num b{font-size:34px;color:#1A1A2E;line-height:1}.ewc-ring .num span{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:10px}
.ewc-pair{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}.ewc-pair .p{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;text-decoration:none}
.ewc-narr{font-size:15px;color:#444;line-height:1.7;margin:14px 0 0}
.ewc-h{font-size:18px;color:#1A1A2E;margin:0 0 8px}
.ewc-reason{list-style:none;padding:0;margin:0}.ewc-reason li{padding:3px 0;font-size:14px;line-height:1.45;color:#444;display:flex;gap:8px}.ewc-reason .pos{color:#2D6A4F;font-weight:700}.ewc-reason .neg{color:#B5715A;font-weight:700}
.ewc-bestfor{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}.ewc-bestfor .tag{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600}
.ewc-rec{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.ewc-rec a{display:block;background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:14px;text-align:center;text-decoration:none;color:#1A1A2E}.ewc-rec a:hover{border-color:#2D6A4F}.ewc-rec .pn{font-weight:600;font-size:14px;margin-bottom:6px}.ewc-rec .go{color:#2D6A4F;font-size:13px}
.ewc-use-list{list-style:none;padding:0;margin:0;font-size:14px;color:#444;line-height:1.55}.ewc-use-list li{margin:0 0 7px}.ewc-use-list li:last-child{margin-bottom:0}.ewc-shop{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.ewc-shop a{display:block;background:#2D6A4F;color:#fff !important;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-size:14px;font-weight:600}.ewc-shop a:hover{background:#1B4332;color:#fff !important}
.ewc-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}.ewc-actions button{padding:8px 16px;background:#fff;border:1px solid #DDD;border-radius:8px;color:#444;cursor:pointer;font-size:13px}
@media(max-width:640px){.ewc-h1{font-size:28px}.ewc-intro{font-size:15px;margin-bottom:18px}.ewc-panel{padding:14px}.ewc-grid{height:260px;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ewc-chip{padding:8px 4px 7px}.ewc-chip .ic{width:48px;height:48px}.ewc-result-top,.ewc-result-detail{grid-template-columns:1fr}.ewc-card{padding:16px}.ewc-ring{width:118px;height:118px}.ewc-ring svg{width:118px;height:118px}.ewc-ring .num b{font-size:30px}}
</style>
<script>
var EWCrystal=(function(){
  var D={STONES:${STONES_JSON},ELEM:${ELEM_JSON},CONFLICTS:${CONFLICTS_JSON}};
  var HAS_ARTICLE=${HAS_ARTICLE_JSON};
  var sel=[];
  var TAG_SCENE={calm:'Sleep & relaxation',protection:'Protection & grounding',love:'Love & relationships',abundance:'Wealth & abundance','personal-power':'Confidence & motivation',spiritual:'Meditation & spiritual growth','new-beginnings':'New beginnings'};
  var CHAKRA_SCENE={root:'Grounding & stability',sacral:'Creativity & passion','solar-plexus':'Confidence & willpower',heart:'Love & emotional balance',throat:'Communication & truth','third-eye':'Intuition & insight',crown:'Spiritual connection'};
  function band(s){return s>=85?'Excellent':s>=70?'Harmonious':s>=55?'Moderate':s>=40?'Neutral':'Conflicting';}
  function color(s){return s>=70?'#2D6A4F':s>=40?'#A66A43':'#B5715A';}
  function isConflict(a,b){return D.CONFLICTS.some(function(c){return(c[0]===a&&c[1]===b)||(c[0]===b&&c[1]===a);});}
  function init(){if(!document.getElementById('ewc-stone-grid'))return;renderStones(Object.keys(D.STONES));updBtn();}
  function chipHTML(s,sel){return '<div class="ewc-chip'+(sel?' sel':'')+'" data-slug="'+s.slug+'"><div class="ic">'+(s.img?'<img src="'+s.img+'" alt="'+s.name+'" loading="lazy">':s.name[0])+'</div><div class="nm">'+s.name+'</div></div>';}
  function renderStones(keys){var g=document.getElementById('ewc-stone-grid');if(!g)return;g.innerHTML='';keys.forEach(function(slug){var c=document.createElement('div');c.innerHTML=chipHTML(D.STONES[slug],sel.indexOf(slug)>=0);c.firstChild.onclick=function(){toggle(slug);};g.appendChild(c.firstChild);});}
  function toggle(slug){var i=sel.indexOf(slug);if(i>=0){sel.splice(i,1);}else{if(sel.length>=2)sel.shift();sel.push(slug);}document.querySelectorAll('#ewc-stone-grid .ewc-chip').forEach(function(c){c.classList.toggle('sel',sel.indexOf(c.dataset.slug)>=0);});updBtn();}
  function updBtn(){var b=document.getElementById('ewc-analyze');if(!b)return;b.disabled=sel.length<2;b.textContent='Analyze Compatibility'+(sel.length>0?' ('+sel.length+' of 2 selected)':'');}
  function filterStones(q){q=(q||'').toLowerCase();renderStones(Object.keys(D.STONES).filter(function(s){return D.STONES[s].name.toLowerCase().indexOf(q)>=0;}));}
  function pairScore(aSlug,bSlug){
    if(isConflict(aSlug,bSlug))return{score:25,band:'Conflicting',reasons:[{t:'neg',s:'Traditionally not worn together — energies pull in opposite directions'}],sharedTags:[],sharedChakras:[],pairHit:false,conflict:true};
    var a=D.STONES[aSlug],b=D.STONES[bSlug],base=D.ELEM[a.element][b.element],sc=base,rs=[{t:'pos',s:'Element '+a.element+' x '+b.element+' = '+base}];
    var sh=a.chakras.filter(function(c){return b.chakras.indexOf(c)>=0;});if(sh.length){sc+=5*sh.length;rs.push({t:'pos',s:'Shared chakras +'+(5*sh.length)+' ('+sh.join(', ')+')'});}
    var st=a.tags.filter(function(t){return b.tags.indexOf(t)>=0;});if(st.length){sc+=5*st.length;rs.push({t:'pos',s:'Intention synergy +'+(5*st.length)+' ('+st.join(', ')+')'});}
    var ph=a.pairings.indexOf(bSlug)>=0||b.pairings.indexOf(aSlug)>=0;if(ph){sc+=15;rs.push({t:'pos',s:'Recommended pairing +15'});}
    sc=Math.min(100,sc);if(ph)sc=Math.max(sc,80);
    return{score:sc,band:band(sc),reasons:rs,sharedTags:st,sharedChakras:sh,pairHit:ph,conflict:false};
  }
  function analyze(){
    if(sel.length<2)return;
    var r=pairScore(sel[0],sel[1]);
    var pair=[D.STONES[sel[0]],D.STONES[sel[1]]];
    renderResult(r,pair);
  }
  function renderResult(r,pair){
    var res=document.getElementById('ewc-result');var c=color(r.score);var C=2*Math.PI*55;var off=C*(1-r.score/100);
    var html='<div class="ewc-result-top">';
    html+='<div class="ewc-card ewc-score-card">';
    html+='<div class="ewc-ring"><svg width="130" height="130" style="transform:rotate(-90deg);"><circle cx="65" cy="65" r="55" stroke="#EEE" stroke-width="10" fill="none"/><circle cx="65" cy="65" r="55" stroke="'+c+'" stroke-width="10" fill="none" stroke-dasharray="'+C+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="num"><b>'+r.score+'</b><span>'+r.band+'</span></div></div>';
    html+='</div>';
    html+='<div class="ewc-card ewc-cta-card">';
    html+='<div class="ewc-pair" style="margin:0;">'+pair.map(function(p){return'<span class="p">'+p.name+'</span>';}).join(' ')+'</div>';
    var ak=sel[0]+'-and-'+sel[1],ak2=sel[1]+'-and-'+sel[0];
    var hai=HAS_ARTICLE.indexOf(ak)>=0?ak:(HAS_ARTICLE.indexOf(ak2)>=0?ak2:null);
    if(hai){html+='<a class="ewc-guide-link" href="/'+hai+'/">Read Full Combination Guide \\u2192</a>';}
    else{html+='<a class="ewc-guide-link" href="#ewc-shop-section">Shop This Pair \\u2192</a>';}
    html+='</div></div>';
    /* Why This Pairing + Best For (side by side) — Best For 从 sharedTags 优先，空则 sharedChakras 推导，再空通用（避免 228 组无文章时空洞） */
    {
      var best;
      if(r.sharedTags.length){best=r.sharedTags.map(function(t){return TAG_SCENE[t]||t;});}
      else if(r.sharedChakras&&r.sharedChakras.length){best=r.sharedChakras.map(function(c){return CHAKRA_SCENE[c]||c;});}
      else if(r.conflict){best=['Separate wear','Clear Quartz bridge','Different rooms'];}
      else{best=['Daily wear','Meditation','Shared spaces'];}
      html+='<div class="ewc-result-detail">';
      if(r.reasons.length){html+='<div class="ewc-card"><h3 class="ewc-h">Why This Pairing</h3><ul class="ewc-reason">'+r.reasons.map(function(x){return'<li><span class="'+x.t+'">'+(x.t==='pos'?'\\u2713':'\\u2717')+'</span><span>'+x.s+'</span></li>';}).join('')+'</ul></div>';}
      html+='<div class="ewc-card"><h3 class="ewc-h">Best For</h3><div class="ewc-bestfor">'+best.map(function(t){return'<span class="tag">'+t+'</span>';}).join('')+'</div></div>';
      html+='</div>';
    }
    /* How to Use Together */
    if(!r.conflict){html+='<div class="ewc-card"><h3 class="ewc-h">How to Use Together</h3><ul class="ewc-use-list"><li><strong>Wear:</strong> '+pair[0].name+' on one wrist, '+pair[1].name+' on the other.</li><li><strong>Meditate:</strong> Hold one in each hand for 5-10 minutes.</li><li><strong>Place:</strong> Keep both on your nightstand or workspace.</li><li><strong>Grid:</strong> Arrange in a triangle with Clear Quartz at center.</li></ul></div>';}
    else{html+='<div class="ewc-card"><h3 class="ewc-h">How to Use Them</h3><ul class="ewc-use-list"><li><strong>Separate days:</strong> '+pair[0].name+' by day, '+pair[1].name+' by night.</li><li><strong>Different rooms:</strong> One in bedroom, one in office.</li><li><strong>Bridge stone:</strong> Place Clear Quartz between them.</li></ul></div>';}
    /* Shop */
    html+='<div class="ewc-card" id="ewc-shop-section"><h3 class="ewc-h">Shop These Crystals</h3><div class="ewc-shop">'+pair.map(function(p){return'<a href="'+p.shop+'">'+p.name+' \\u2192</a>';}).join('')+'</div></div>';
    /* Actions (CTA already in score row above) */
    html+='<div class="ewc-actions"><button onclick="EWCrystal.reset()">Try Another</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)">Copy Link</button></div>';
    res.innerHTML=html;res.classList.add('show');var offset=window.innerWidth<768?96:150;var y=res.getBoundingClientRect().top+window.pageYOffset-offset;window.scrollTo({top:y,behavior:'smooth'});
  }
  function reset(){sel=[];renderStones(Object.keys(D.STONES));updBtn();document.getElementById('ewc-result').classList.remove('show');}
  return{init:init,filterStones:filterStones,toggle:toggle,analyze:analyze,reset:reset};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWCrystal.init);}else{EWCrystal.init();}
</script>
<!-- ===== End Crystal Compatibility Checker ===== -->`;

if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Crystal Compatibility SEO Accordion ===== -->
<section class="ewc-seo-accordion" aria-label="Crystal compatibility guide">
  <details class="ewc-seo-details">
    <summary>Learn More About Crystal Compatibility</summary>
    <div class="ewc-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<style>
.ewc-seo-accordion{max-width:1220px;margin:32px auto 0}
.ewc-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ewc-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px;box-shadow:inset 0 -1px 0 rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.08)}
.ewc-seo-details summary::-webkit-details-marker{display:none}
.ewc-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.ewc-seo-details[open] summary:after{content:'-'}
.ewc-seo-content{padding:24px 28px;color:#444;font-size:15px;line-height:1.75}
.ewc-seo-content h2{color:#1A1A2E;font-size:26px;margin:28px 0 12px}
.ewc-seo-content h3{color:#1A1A2E;font-size:20px;margin:22px 0 10px}
.ewc-seo-content p,.ewc-seo-content li{font-size:15px;line-height:1.75}
.ewc-seo-content a{color:#2D6A4F;text-decoration:underline}
@media(max-width:640px){.ewc-seo-accordion{margin-top:24px}.ewc-seo-details summary{font-size:16px;padding:16px}.ewc-seo-content{padding:18px}}
</style>
<!-- ===== End Crystal Compatibility SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, '../crystal-checker.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Crystal Checker 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`   ${Object.keys(STONES).length} 颗水晶，选 2 颗`);
console.log(`   HAS_ARTICLE 计划清单: ${HAS_ARTICLE.length} 组（CTA 显示 Guide；其余 228 组显示 Shop）`);
