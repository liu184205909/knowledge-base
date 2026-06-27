/**
 * Cleansing Timer（T4）— 选水晶 → safety检查(water/sun/salt) → 推荐安全净化方式 → 倒计时+步骤+下次日期+配件
 * 蓝海:全行业无工具竞品(都是文章)。差异化:把竞品 safety 文章表变成交互工具(避免损坏水晶)
 * 读 crystal-attributes(390 safety) + _shared/cleansing-knowledge.json(7 methods,文章+工具单源)
 *
 * 输出：./cleansing-timer.html
 */
const fs = require('fs');
const path = require('path');

// 读 crystal-attributes(390 safety) → compact
// 读 search-data(name/img/link,图有效)+ crystal-attributes(补 safety 按 slug)
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const ATTR = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/crystal-attributes.json'), 'utf8'));
const SAFETY = {};
Object.values(ATTR.crystals || {}).forEach(c => { SAFETY[c.slug] = c.safety || {}; });
const CRYSTALS = (SD.crystals || []).map(c => ({
  name: c.slug === 'quartz-meaning' ? 'Clear Quartz' : (c.name || c.slug),
  slug: c.slug,
  img: c.img || '',
  link: c.link || ('/gemstone/' + c.slug + '-meaning/'),
  safety: {
    water: (SAFETY[c.slug] || {}).water || '',
    sun: (SAFETY[c.slug] || {}).sun || '',
    salt: (SAFETY[c.slug] || {}).salt || ''
  }
})).sort((a, b) => a.name.localeCompare(b.name));

// 读 cleansing-knowledge(7 methods)
const CK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/cleansing-knowledge.json'), 'utf8'));
const METHODS = CK.methods;
const METHODS_ORDER = ['moonlight', 'selenite', 'sound', 'smoke', 'water', 'earth', 'salt'];
const UNIVERSAL_SAFE = CK.universal_safe;
const ACCESSORIES = CK.accessories;

function safeJSON(v) { return JSON.stringify(v).replace(/<\//g, '<\\/'); }
const CRYSTALS_JSON = safeJSON(CRYSTALS);
const METHODS_JSON = safeJSON(METHODS);
const METHODS_ORDER_JSON = safeJSON(METHODS_ORDER);
const UNIVERSAL_SAFE_JSON = safeJSON(UNIVERSAL_SAFE);
const ACCESSORIES_JSON = safeJSON(ACCESSORIES);

let html = `<!-- ===== Earthward Cleansing Timer ===== -->
<div id="ecl-ct">
  <h1 class="ecl-h1">Crystal Cleansing Timer & Safety Checker</h1>
  <p class="ecl-intro">Pick your crystal, and we'll show which cleansing methods are safe for it — then start a timer, see the steps, and get a reminder for next time. Because the one non-negotiable in crystal cleansing is <strong>not damaging the stone</strong> (selenite dissolves in water, amethyst fades in sun).</p>

  <div class="ecl-search-wrap">
    <input class="ecl-search" id="ecl-search" type="text" placeholder="Search your crystal (e.g. amethyst, selenite, rose quartz)..." autocomplete="off">
    <div class="ecl-dropdown" id="ecl-dropdown"></div>
  </div>

  <div class="ecl-selected" id="ecl-selected" style="display:none"></div>
  <div class="ecl-methods" id="ecl-methods" style="display:none"></div>
  <div class="ecl-timer" id="ecl-timer" style="display:none"></div>
</div>
<style>
.ecl-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ecl-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.ecl-search-wrap{position:relative;max-width:560px;margin:0 0 20px}
.ecl-search{width:100%;padding:14px 16px;border:1px solid #DDD;border-radius:10px;font-size:16px;background:#fff}
.ecl-search:focus{outline:none;border-color:#2D6A4F;box-shadow:0 0 0 3px rgba(45,106,79,.12)}
.ecl-dropdown{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #EEE;border-radius:0 0 10px 10px;max-height:280px;overflow-y:auto;z-index:10;display:none;box-shadow:0 6px 18px rgba(0,0,0,.08)}
.ecl-dropdown.show{display:block}
.ecl-drop-item{padding:10px 16px;cursor:pointer;font-size:15px;color:#1A1A2E;border-bottom:1px solid #F5F5F5}
.ecl-drop-item:hover{background:#F7F3EA}
.ecl-selected{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:20px;margin-bottom:18px;display:flex;gap:18px;align-items:center}
.ecl-sel-img{width:72px;height:72px;border-radius:10px;object-fit:cover;background:#F0F7F4;flex-shrink:0}
.ecl-sel-info{flex:1}
.ecl-sel-name{font-size:22px;font-weight:700;color:#1A1A2E;margin:0 0 8px}
.ecl-safety-row{display:flex;gap:8px;flex-wrap:wrap}
.ecl-sf{font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;border:1px solid}
.ecl-sf.safe{background:#E8F5E9;color:#2E7D32;border-color:#A5D6A7}
.ecl-sf.caution{background:#FFF8E1;color:#F57F17;border-color:#FFD54F}
.ecl-sf.avoid{background:#FFEBEE;color:#C62828;border-color:#EF9A9A}
.ecl-methods{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:18px}
.ecl-method{background:#fff;border:2px solid #E5E5E5;border-radius:14px;padding:20px 14px;cursor:pointer;text-align:center;transition:.15s;position:relative;box-shadow:0 2px 5px rgba(0,0,0,.05)}
.ecl-method:hover{border-color:#2D6A4F;transform:translateY(-3px);box-shadow:0 6px 16px rgba(45,106,79,.18)}
.ecl-method.safe{border-color:#A5D6A7}
.ecl-method.caution{border-color:#FFD54F}
.ecl-method.avoid{border-color:#EF9A9A;opacity:.7}
.ecl-method.neutral{border-color:#CCC;opacity:.85}
.ecl-m-badge.neutral{color:#888}
.ecl-m-icon{font-size:34px;display:block;margin-bottom:8px}
.ecl-m-name{font-size:15px;font-weight:700;color:#1A1A2E}
.ecl-m-badge{font-size:11px;font-weight:700;margin-top:6px;text-transform:uppercase}
.ecl-m-badge.safe{color:#2E7D32}
.ecl-m-badge.caution{color:#F57F17}
.ecl-m-badge.avoid{color:#C62828}
.ecl-timer{background:#fff;border:1px solid #EEE;border-radius:14px;padding:24px}
.ecl-timer h2{font-size:20px;color:#1A1A2E;margin:0 0 6px}
.ecl-timer h2 .ecl-m-icon{display:inline;font-size:20px}
.ecl-duration{color:#666;font-size:15px;margin:0 0 16px}
.ecl-countdown{background:#F7F3EA;border-radius:12px;padding:18px;text-align:center;margin-bottom:16px}
.ecl-cd-val{font-size:36px;font-weight:700;color:#2D6A4F;font-variant-numeric:tabular-nums;letter-spacing:1px}
.ecl-cd-label{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.ecl-cd-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:10px 22px;font-size:14px;font-weight:600;cursor:pointer;margin-top:10px}
.ecl-cd-btn:hover{background:#1B4332}
.ecl-steps{margin:0 0 16px;padding-left:20px}
.ecl-steps li{font-size:15px;color:#444;line-height:1.6;margin-bottom:6px}
.ecl-next{background:#F0F7F4;border-left:3px solid #2D6A4F;padding:12px 16px;border-radius:0 8px 8px 0;font-size:15px;color:#444;margin-bottom:16px}
.ecl-warn{background:#FFEBEE;border-left:3px solid #C62828;padding:12px 16px;border-radius:0 8px 8px 0;font-size:15px;color:#444;margin-bottom:16px}
.ecl-acc-title{font-size:15px;font-weight:700;color:#1A1A2E;margin:0 0 10px}
.ecl-acc{display:flex;gap:8px;flex-wrap:wrap}
.ecl-acc a{font-size:14px;color:#2D6A4F;text-decoration:none;border:1px solid #DDD;border-radius:8px;padding:8px 14px;background:#fff}
.ecl-acc a:hover{border-color:#2D6A4F}
.ecl-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.ecl-h1{font-size:24px}.ecl-selected{flex-direction:column;text-align:center}.ecl-methods{grid-template-columns:repeat(2,1fr)}.ecl-cd-val{font-size:28px}}
</style>
<script>
var EWCleanse=(function(){
  var CR=${CRYSTALS_JSON};
  var ME=${METHODS_JSON};
  var MO=${METHODS_ORDER_JSON};
  var US=${UNIVERSAL_SAFE_JSON};
  var AC=${ACCESSORIES_JSON};
  var selected=null;
  var timerInt=null;

  function safetyLevel(text){
    var t=(text||'').toLowerCase();
    if(t.includes('prolonged')||t.includes('may fade')||t.includes('fades')) return 'caution';
    if(t.includes('avoid')||t.includes('never')||t.includes('dissolve')||t.includes('rust')||t.includes('soluble')||t.includes('toxic')||t.includes('acid')) return 'avoid';
    if(t.includes('brief')||t.includes('caution')||t.includes('limit')||t.includes('wipe')||t.includes('dry')) return 'caution';
    return 'safe';
  }
  function methodSafety(mk, crystal){
    var m=ME[mk];
    if(m.safe==='all') return 'safe';
    if(!crystal) return 'neutral';
    var chk=m.check; // water | salt
    var txt=crystal.safety[chk]||'';
    return safetyLevel(txt);
  }
  function search(q){
    var dd=document.getElementById('ecl-dropdown');
    if(!q||q.length<1){dd.classList.remove('show');dd.innerHTML='';return;}
    var lc=q.toLowerCase();
    var matches=CR.filter(function(c){return c.name.toLowerCase().includes(lc);}).slice(0,12);
    dd.innerHTML=matches.map(function(c){return '<div class="ecl-drop-item" onclick="EWCleanse.select(\\''+c.slug+'\\')">'+c.name+'</div>';}).join('');
    dd.classList.toggle('show',matches.length>0);
  }
  function select(slug){
    selected=CR.find(function(c){return c.slug===slug;});
    if(!selected)return;
    document.getElementById('ecl-search').value=selected.name;
    document.getElementById('ecl-dropdown').classList.remove('show');
    renderSelected();
    renderMethods(selected);
    document.getElementById('ecl-timer').style.display='none';
  }
  function renderSelected(){
    var el=document.getElementById('ecl-selected');
    var s=selected.safety;
    el.style.display='flex';
    el.innerHTML='<img class="ecl-sel-img" src="'+(selected.img||'')+'" alt="'+selected.name+'">'+
      '<div class="ecl-sel-info"><div class="ecl-sel-name">'+selected.name+'</div>'+
      '<div class="ecl-safety-row">'+
        sfBadge('Water',safetyLevel(s.water))+
        sfBadge('Sunlight',safetyLevel(s.sun))+
        sfBadge('Salt',safetyLevel(saltLevel(s.salt)))+
      '</div></div>';
  }
  function saltLevel(t){var x=safetyLevel(t);return t.toLowerCase().includes('avoid')?'avoid':x;}
  function sfBadge(label,lvl){
    var txt={safe:'Safe',caution:'Caution',avoid:'Avoid'}[lvl];
    return '<span class="ecl-sf '+lvl+'">'+label+': '+txt+'</span>';
  }
  function renderMethods(sel){
    var el=document.getElementById('ecl-methods');
    el.style.display='grid';
    var hint=sel?'Tap a method to start its timer and see steps:':'Tap a method to start a timer and see the steps. Moonlight, selenite, sound, and smoke are safe for every crystal — for water, earth, or salt, search your crystal above first to check if it’s safe.';
    el.innerHTML='<div style="grid-column:1/-1;margin-bottom:10px"><div style="font-size:19px;font-weight:700;color:#1A1A2E">Choose a Cleansing Method</div><div style="font-size:14px;color:#666;line-height:1.5;margin-top:4px">'+hint+'</div></div>'+
      MO.map(function(mk){
        var m=ME[mk];
        var lvl=methodSafety(mk,sel);
        var badge=lvl==='neutral'?'Select crystal':(lvl==='safe'?'Safe':lvl==='caution'?'Use caution':'Not recommended');
        return '<div class="ecl-method '+lvl+'" onclick="EWCleanse.start(\\''+mk+'\\')">'+
          '<span class="ecl-m-icon">'+m.icon+'</span>'+
          '<div class="ecl-m-name">'+m.name+'</div>'+
          '<div class="ecl-m-badge '+lvl+'">'+badge+'</div>'+
        '</div>';
      }).join('');
  }
  function start(mk){
    var m=ME[mk];
    if(m.safe!=='all' && !selected){
      var s=document.getElementById('ecl-search');
      s.focus();
      s.placeholder='Search your crystal first to check water/salt safety (e.g. amethyst, selenite)...';
      return;
    }
    var lvl=methodSafety(mk,selected);
    var el=document.getElementById('ecl-timer');
    el.style.display='block';
    if(timerInt){clearInterval(timerInt);timerInt=null;}
    var html='<h2><span class="ecl-m-icon">'+m.icon+'</span> '+m.name+' — '+selected.name+'</h2>';
    html+='<p class="ecl-duration">Recommended duration: '+m.duration_label+'</p>';
    if(lvl==='avoid'){
      html+='<div class="ecl-warn"><strong>Not recommended for '+selected.name+'.</strong> '+(m.practical||'')+' Choose a universally safe method instead: moonlight, selenite, sound, or smoke.</div>';
    }else if(lvl==='caution'){
      html+='<div class="ecl-warn"><strong>Use caution.</strong> '+(selected.safety[m.check]||'Brief contact only; dry immediately.')+'</div>';
    }
    // countdown
    var totalSec=m.minutes*60;
    html+='<div class="ecl-countdown"><div class="ecl-cd-val" id="ecl-cd">--:--:--</div><div class="ecl-cd-label">Time remaining</div><button class="ecl-cd-btn" id="ecl-cdbtn" onclick="EWCleanse.toggleTimer()">Start Timer</button></div>';
    // steps
    html+='<ol class="ecl-steps">'+m.steps.map(function(s){return '<li>'+s+'</li>';}).join('')+'</ol>';
    // next date
    var next=new Date(Date.now()+30*24*3600*1000);
    html+='<div class="ecl-next"><strong>Next cleanse reminder:</strong> '+next.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})+' (monthly is a common rhythm — or whenever it feels right).</div>';
    // 导购：水晶首饰(站点主营)+ 该水晶 meaning(净化工具 sage/bowl 站点不卖,不推避免死链)
    html+='<div class="ecl-acc-title">Continue with '+selected.name+'</div><div class="ecl-acc"><a href="'+selected.link+'">Read '+selected.name+' meaning →</a><a href="/product-category/healing-crystals-jewelry/">Shop healing crystal jewelry →</a></div>';
    html+='<p class="ecl-disclaim">Cleansing guidance blends cultural tradition with practical mineral care. There is no scientific evidence that crystals store or release energy, but the safety information (which stones tolerate water, sun, or salt) is real mineralogy and the reason this tool exists.</p>';
    el.innerHTML=html;
    el.dataset.total=totalSec;
    el.dataset.left=totalSec;
    el.dataset.running='0';
    document.getElementById('ecl-cd').textContent=fmt(totalSec);
  }
  function fmt(sec){
    var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
    return [h,m,s].map(function(n){return String(n).padStart(2,'0');}).join(':');
  }
  function toggleTimer(){
    var el=document.getElementById('ecl-timer');
    var btn=document.getElementById('ecl-cdbtn');
    if(el.dataset.running==='1'){
      clearInterval(timerInt);timerInt=null;el.dataset.running='0';btn.textContent='Resume';
    }else{
      el.dataset.running='1';btn.textContent='Pause';
      timerInt=setInterval(function(){
        var left=parseInt(el.dataset.left,10)-1;
        el.dataset.left=left;
        document.getElementById('ecl-cd').textContent=fmt(Math.max(0,left));
        if(left<=0){clearInterval(timerInt);timerInt=null;el.dataset.running='0';btn.textContent='Done ✓';btn.disabled=true;}
      },1000);
    }
  }
  function init(){renderMethods(null);}
  return{search:search,select:select,start:start,toggleTimer:toggleTimer,init:init};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWCleanse.init);}else{EWCleanse.init();}
document.getElementById('ecl-search').addEventListener('input',function(e){EWCleanse.search(e.target.value);});
document.addEventListener('click',function(e){
  if(!e.target.closest('.ecl-search-wrap'))document.getElementById('ecl-dropdown').classList.remove('show');
});
</script>
<!-- ===== Cleansing Timer Schema (HowTo + FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"HowTo","name":"How to Cleanse Crystals Safely","description":"Pick your crystal, see which cleansing methods are safe for it, and start a timer with step-by-step guidance.","step":[{"@type":"HowToStep","name":"Search your crystal","text":"Type your crystal name to load its water, sunlight, and salt safety profile."},{"@type":"HowToStep","name":"Choose a safe method","text":"Tap a cleansing method marked Safe for your stone (moonlight, selenite, sound, and smoke are safe for every crystal)."},{"@type":"HowToStep","name":"Run the timer","text":"Start the countdown for the recommended duration and follow the steps."}]},
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I cleanse my crystals safely?","acceptedAnswer":{"@type":"Answer","text":"First check whether your stone tolerates water, sunlight, and salt — selenite dissolves in water and amethyst fades in sun. Universally safe methods for every crystal include moonlight, a selenite plate, sound from a singing bowl, and smoke from sage or palo santo. Use this tool to check a specific stone and start a timer."}},{"@type":"Question","name":"Which crystals cannot go in water?","acceptedAnswer":{"@type":"Answer","text":"Selenite, malachite, calcite, fluorite, pyrite, desert rose, halite, angelite, lepidolite, turquoise, and kyanite should not go in water — they can dissolve, release compounds, crack, or rust. Stick to Mohs 6+ stones for water rinsing, or use moonlight, selenite, sound, or smoke instead."}},{"@type":"Question","name":"How often should I cleanse my crystals?","acceptedAnswer":{"@type":"Answer","text":"For physical care, a monthly wipe-down with a dry or slightly damp cloth keeps displayed stones clean. For ritual cleansing, do it whenever it feels right — when you bring a new crystal home, after heavy use, on the full moon, or at the start of a new season."}},{"@type":"Question","name":"Can I put amethyst in sunlight?","acceptedAnswer":{"@type":"Answer","text":"It is not recommended. Amethyst gets its purple color from iron and natural irradiation in the crystal lattice, and UV light reverses that process, causing permanent fading. Display amethyst away from direct sun and use moonlight or a selenite plate to charge it instead."}}]}
]}
</script>
<!-- ===== End Cleansing Timer ===== -->`;

// SEO 折叠长文
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Cleansing Timer SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Cleansing Crystals</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Cleansing Timer SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'cleansing-timer.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Cleansing Timer 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${CRYSTALS.length} 颗水晶(含safety) | ${METHODS_ORDER.length} 净化方式`);
