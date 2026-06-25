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

const STONES_JSON = JSON.stringify(STONES);
const ELEM_JSON = JSON.stringify(ELEM);
const CONFLICTS_JSON = JSON.stringify(CONFLICTS);

const html = `<!-- ===== Earthward Crystal Compatibility Checker ===== -->
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
.ewc-panel{background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:20px}
.ewc-search{width:100%;padding:10px 14px;border:1px solid #EEE;border-radius:8px;font-size:15px;margin-bottom:14px;box-sizing:border-box}
.ewc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px;max-height:420px;overflow-y:auto}
.ewc-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px 8px;border:1px solid #EEE;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}.ewc-chip:hover{border-color:#95D5B2}.ewc-chip.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}.ewc-chip .ic{width:56px;height:56px;border-radius:50%;overflow:hidden;background:#F0F7F4;display:flex;align-items:center;justify-content:center}.ewc-chip .ic img{width:100%;height:100%;object-fit:cover}.ewc-chip .nm{font-size:12px;color:#444;line-height:1.2;min-height:28px;display:flex;align-items:center}
.ewc-hint{color:#666;font-size:13px;margin:14px 0 10px;text-align:center}
.ewc-btn{display:block;width:100%;padding:14px;background:#2D6A4F;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer}.ewc-btn:hover{background:#1B4332}.ewc-btn:disabled{background:#CCC;cursor:not-allowed}
.ewc-result{margin-top:24px;display:none}.ewc-result.show{display:block}
.ewc-card{background:#fff;border:1px solid #EEE;border-radius:12px;padding:24px;margin-bottom:16px}
.ewc-score-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}.ewc-ring{position:relative;width:160px;height:160px}.ewc-ring svg{transform:rotate(-90deg)}.ewc-ring .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.ewc-ring .num b{font-size:40px;color:#1A1A2E;line-height:1}.ewc-ring .num span{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.ewc-pair{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}.ewc-pair .p{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;text-decoration:none}
.ewc-narr{font-size:15px;color:#444;line-height:1.7;margin:14px 0 0}
.ewc-h{font-size:18px;color:#1A1A2E;margin:0 0 12px}
.ewc-reason{list-style:none;padding:0;margin:0}.ewc-reason li{padding:6px 0;font-size:14px;color:#444;display:flex;gap:8px}.ewc-reason .pos{color:#2D6A4F;font-weight:700}.ewc-reason .neg{color:#B5715A;font-weight:700}
.ewc-bestfor{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.ewc-bestfor .tag{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600}
.ewc-rec{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.ewc-rec a{display:block;background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:14px;text-align:center;text-decoration:none;color:#1A1A2E}.ewc-rec a:hover{border-color:#2D6A4F}.ewc-rec .pn{font-weight:600;font-size:14px;margin-bottom:6px}.ewc-rec .go{color:#2D6A4F;font-size:13px}
.ewc-shop{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.ewc-shop a{display:block;background:#2D6A4F;color:#fff;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-size:14px;font-weight:600}.ewc-shop a:hover{background:#1B4332}
.ewc-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}.ewc-actions button{padding:8px 16px;background:#fff;border:1px solid #DDD;border-radius:8px;color:#444;cursor:pointer;font-size:13px}
</style>
<script>
var EWCrystal=(function(){
  var D={STONES:${STONES_JSON},ELEM:${ELEM_JSON},CONFLICTS:${CONFLICTS_JSON}};
  var sel=[];
  var TAG_SCENE={calm:'Sleep & relaxation',protection:'Protection & grounding',love:'Love & relationships',abundance:'Wealth & abundance','personal-power':'Confidence & motivation',spiritual:'Meditation & spiritual growth','new-beginnings':'New beginnings'};
  function band(s){return s>=85?'Excellent':s>=70?'Harmonious':s>=55?'Moderate':s>=40?'Neutral':'Conflicting';}
  function color(s){return s>=70?'#2D6A4F':s>=40?'#A66A43':'#B5715A';}
  function isConflict(a,b){return D.CONFLICTS.some(function(c){return(c[0]===a&&c[1]===b)||(c[0]===b&&c[1]===a);});}
  function init(){renderStones(Object.keys(D.STONES));}
  function chipHTML(s,sel){return '<div class="ewc-chip'+(sel?' sel':'')+'" data-slug="'+s.slug+'"><div class="ic">'+(s.img?'<img src="'+s.img+'" alt="'+s.name+'" loading="lazy">':s.name[0])+'</div><div class="nm">'+s.name+'</div></div>';}
  function renderStones(keys){var g=document.getElementById('ewc-stone-grid');g.innerHTML='';keys.forEach(function(slug){var c=document.createElement('div');c.innerHTML=chipHTML(D.STONES[slug],sel.indexOf(slug)>=0);c.firstChild.onclick=function(){toggle(slug);};g.appendChild(c.firstChild);});}
  function toggle(slug){var i=sel.indexOf(slug);if(i>=0){sel.splice(i,1);}else{if(sel.length>=2)sel.shift();sel.push(slug);}document.querySelectorAll('#ewc-stone-grid .ewc-chip').forEach(function(c){c.classList.toggle('sel',sel.indexOf(c.dataset.slug)>=0);});updBtn();}
  function updBtn(){var b=document.getElementById('ewc-analyze');b.disabled=sel.length<2;b.textContent='Analyze Compatibility'+(sel.length>0?' ('+sel.length+' of 2 selected)':'');}
  function filterStones(q){q=q.toLowerCase();renderStones(Object.keys(D.STONES).filter(function(s){return D.STONES[s].name.toLowerCase().indexOf(q)>=0;}));}
  function pairScore(aSlug,bSlug){
    if(isConflict(aSlug,bSlug))return{score:25,band:'Conflicting',reasons:[{t:'neg',s:'Traditionally not worn together — energies pull in opposite directions'}],sharedTags:[],pairHit:false,conflict:true};
    var a=D.STONES[aSlug],b=D.STONES[bSlug],base=D.ELEM[a.element][b.element],sc=base,rs=[{t:'pos',s:'Element '+a.element+' x '+b.element+' = '+base}];
    var sh=a.chakras.filter(function(c){return b.chakras.indexOf(c)>=0;});if(sh.length){sc+=5*sh.length;rs.push({t:'pos',s:'Shared chakras +'+(5*sh.length)+' ('+sh.join(', ')+')'});}
    var st=a.tags.filter(function(t){return b.tags.indexOf(t)>=0;});if(st.length){sc+=5*st.length;rs.push({t:'pos',s:'Intention synergy +'+(5*st.length)+' ('+st.join(', ')+')'});}
    var ph=a.pairings.indexOf(bSlug)>=0||b.pairings.indexOf(aSlug)>=0;if(ph){sc+=15;rs.push({t:'pos',s:'Recommended pairing +15'});}
    sc=Math.min(100,sc);if(ph)sc=Math.max(sc,80);
    return{score:sc,band:band(sc),reasons:rs,sharedTags:st,pairHit:ph,conflict:false};
  }
  function analyze(){
    if(sel.length<2)return;
    var r=pairScore(sel[0],sel[1]);
    var pair=[D.STONES[sel[0]],D.STONES[sel[1]]];
    renderResult(r,pair);
  }
  function renderResult(r,pair){
    var res=document.getElementById('ewc-result');var c=color(r.score);var C=2*Math.PI*70;var off=C*(1-r.score/100);
    var html='<div class="ewc-card"><div class="ewc-score-wrap"><div class="ewc-ring"><svg width="160" height="160"><circle cx="80" cy="80" r="70" stroke="#EEE" stroke-width="12" fill="none"/><circle cx="80" cy="80" r="70" stroke="'+c+'" stroke-width="12" fill="none" stroke-dasharray="'+C+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="num"><b>'+r.score+'</b><span>'+r.band+'</span></div></div><div class="ewc-pair">'+pair.map(function(p){return'<a class="p" href="'+(p.meaning||'#')+'">'+p.name+'</a>';}).join('')+'</div></div></div>';
    /* Why This Pairing */
    if(r.reasons.length){html+='<div class="ewc-card"><h3 class="ewc-h">Why This Pairing</h3><ul class="ewc-reason">'+r.reasons.map(function(x){return'<li><span class="'+x.t+'">'+(x.t==='pos'?'\\u2713':'\\u2717')+'</span><span>'+x.s+'</span></li>';}).join('')+'</ul></div>';}
    /* Best For */
    if(r.sharedTags.length){html+='<div class="ewc-card"><h3 class="ewc-h">Best For</h3><div class="ewc-bestfor">'+r.sharedTags.map(function(t){return'<span class="tag">'+(TAG_SCENE[t]||t)+'</span>';}).join('')+'</div></div>';}
    /* Conflict advice */
    if(r.conflict){html+='<div class="ewc-card"><h3 class="ewc-h">How to Handle This</h3><p style="font-size:14px;color:#444;line-height:1.7">Many people find that wearing these stones on different days works better than combining them. '+pair[0].name+' energizes; '+pair[1].name+' calms — wear one by day, the other by night. A neutral amplifier like Clear Quartz can bridge them if you want both energies active.</p></div>';}
    /* Shop */
    html+='<div class="ewc-card"><h3 class="ewc-h">Shop These Crystals</h3><div class="ewc-shop">'+pair.map(function(p){return'<a href="'+p.shop+'">'+p.name+' \\u2192</a>';}).join('')+'</div></div>';
    /* Meaning buttons */
    html+='<div class="ewc-card"><h3 class="ewc-h">Learn More</h3><div class="ewc-rec">'+pair.map(function(p){return'<a href="'+p.meaning+'"><div class="pn">'+p.name+' Meaning</div><div class="go">Complete guide \\u2192</div></a>';}).join('')+'</div></div>';
    /* Actions */
    html+='<div class="ewc-actions"><button onclick="EWCrystal.reset()">Try Another</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)">Copy Link</button></div>';
    res.innerHTML=html;res.classList.add('show');res.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){sel=[];renderStones(Object.keys(D.STONES));updBtn();document.getElementById('ewc-result').classList.remove('show');}
  return{init:init,filterStones:filterStones,toggle:toggle,analyze:analyze,reset:reset};
})();
document.addEventListener('DOMContentLoaded',EWCrystal.init);
</script>
<!-- ===== End Crystal Compatibility Checker ===== -->`;

const OUT = path.resolve(__dirname, '../crystal-checker.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Crystal Checker 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`   ${Object.keys(STONES).length} 颗水晶，选 2 颗`);
