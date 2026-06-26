/**
 * 生成 Gemstones Hub（/gemstones/）— T2 风格 + A-Z 字母索引
 *
 * 复用 crystal-meaning-search/data/search-data.json（390 颗，不重复造数据）
 * 加：①顶部 A-Z 字母导航（图4竞品风格，圆形按钮高亮，点击筛选首字母，含 All）
 *     ②双按钮卡片（View Meaning + Shop，图4风格）
 * 默认全 390 按 A-Z 排序展示
 *
 * 输出：./gemstones-hub.html
 * Usage: node generate-hub.js
 */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const C = DATA.crystals;
const C_JSON = JSON.stringify(C);

let html = `<!-- ===== Earthward Gemstones Hub (A-Z + Search + Facet) ===== -->
<div id="ew-gems">
  <h1 class="ewg-h1">Crystal Encyclopedia</h1>
  <p class="ewg-intro">Browse all ${C.length} crystals A–Z, or filter by color, chakra, or intention. Each entry opens a full meaning guide and shop.</p>

  <div class="ewg-letters" id="ewg-letters"></div>

  <div class="ewg-searchwrap">
    <input class="ewg-search" id="ewg-q" type="text" placeholder="Search by name (e.g. amethyst, rose quartz)..." oninput="EWGems.setQ(this.value)">
  </div>
  <div class="ewg-filters" id="ewg-filters"></div>
  <div class="ewg-toolbar">
    <span class="ewg-count" id="ewg-count"></span>
    <button class="ewg-clear" id="ewg-clear" onclick="EWGems.clearAll()" style="display:none;">Clear filters</button>
  </div>

  <div class="ewg-grid" id="ewg-grid"></div>
  <p class="ewg-empty" id="ewg-empty" style="display:none;">No crystals match. Try another letter or clear some filters.</p>
</div>
<style>
.ewg-h1{font-size:32px;color:#1A1A2E;margin:0 0 10px;font-weight:700;line-height:1.2}
.ewg-intro{color:#444;font-size:17px;line-height:1.6;margin:0 0 20px;max-width:760px}
.ewg-letters{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 22px}
.ewg-letter{width:38px;height:38px;border-radius:50%;border:1px solid #DDD;background:#fff;color:#444;cursor:pointer;font-size:14px;font-weight:600;transition:.15s;padding:0}
.ewg-letter:hover{border-color:#95D5B2}
.ewg-letter.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewg-searchwrap{margin:0 0 18px}
.ewg-search{width:100%;padding:13px 16px;border:1px solid #EEE;border-radius:10px;font-size:15px;box-sizing:border-box;background:#fff}
.ewg-search:focus{outline:none;border-color:#2D6A4F;box-shadow:0 0 0 3px #2D6A4F22}
.ewg-filters{display:flex;flex-direction:column;gap:12px;margin:0 0 14px}
.ewg-fgroup{background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:12px 14px}
.ewg-flabel{font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}
.ewg-chips{display:flex;flex-wrap:wrap;gap:7px}
.ewg-chip{padding:6px 13px;border:1px solid #DDD;border-radius:20px;background:#fff;color:#444;cursor:pointer;font-size:13px;transition:.15s}
.ewg-chip:hover{border-color:#95D5B2}
.ewg-chip.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewg-toolbar{display:flex;justify-content:space-between;align-items:center;margin:0 0 16px}
.ewg-count{color:#666;font-size:14px}
.ewg-clear{background:none;border:none;color:#2D6A4F;cursor:pointer;font-size:14px;text-decoration:underline;padding:0}
.ewg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.ewg-card{display:flex;flex-direction:column;background:#fff;border:1px solid #EEE;border-radius:12px;overflow:hidden;transition:.15s}
.ewg-card:hover{border-color:#2D6A4F;box-shadow:0 4px 14px rgba(45,106,79,.10)}
.ewg-img{width:100%;aspect-ratio:4/3;background:#F0F7F4;overflow:hidden}
.ewg-img img{width:100%;height:100%;object-fit:cover}
.ewg-body{padding:13px 14px 15px;display:flex;flex-direction:column;gap:7px;flex:1}
.ewg-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:0;line-height:1.25}
.ewg-tags{display:flex;flex-wrap:wrap;gap:5px}
.ewg-tag{background:#F0F7F4;color:#1B4332;padding:3px 9px;border-radius:12px;font-size:13px;font-weight:600}
.ewg-tag.int{background:#FBF3EC;color:#A66A43}
.ewg-exc{font-size:15px;color:#666;line-height:1.5;margin:2px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ewg-btns{display:flex;gap:8px;margin-top:auto;padding-top:6px}
.ewg-b-meaning{display:block;flex:1;text-align:center;background:#2D6A4F;color:#fff !important;padding:10px 6px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;box-shadow:0 2px 6px rgba(45,106,79,.25)}
.ewg-b-meaning:hover{background:#1B4332}
.ewg-b-shop{display:block;flex:1;text-align:center;background:#fff;border:1px solid #2D6A4F;color:#2D6A4F !important;padding:10px 6px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600}
.ewg-b-shop:hover{background:#F0F7F4}
.ewg-empty{text-align:center;color:#888;padding:40px 0;font-size:15px}
@media(max-width:1024px){.ewg-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}}
@media(max-width:640px){.ewg-h1{font-size:24px}.ewg-intro{font-size:14px}.ewg-letter{width:34px;height:34px;font-size:13px}.ewg-letters{gap:5px;margin-bottom:16px}.ewg-grid{grid-template-columns:repeat(2,1fr);gap:11px}.ewg-body{padding:10px 11px 12px}.ewg-name{font-size:14px}.ewg-b-meaning,.ewg-b-shop{padding:8px 4px;font-size:12px}.ewg-btns{gap:6px}.ewg-exc{font-size:12px;-webkit-line-clamp:2}}
@media(max-width:420px){.ewg-grid{grid-template-columns:1fr}.ewg-btns{flex-direction:column}.ewg-b-meaning,.ewg-b-shop{font-size:13px;padding:9px}}
</style>
<script>
var EWGems=(function(){
  var C=${C_JSON};
  var LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var FACETS=[
    {key:'color',field:'colors',label:'Color',vals:['red','orange','yellow','green','blue','purple','pink','brown','black','white','grey']},
    {key:'chakra',field:'chakras',label:'Chakra',vals:['root','sacral','solar-plexus','heart','throat','third-eye','crown']},
    {key:'intention',field:'intentions',label:'Intention',vals:['calm','protection','love','abundance','health','spiritual','personal-power','new-beginnings']}
  ];
  var LAB={
    color:{red:'Red',orange:'Orange',yellow:'Yellow',green:'Green',blue:'Blue',purple:'Purple',pink:'Pink',brown:'Brown',black:'Black',white:'White',grey:'Grey'},
    chakra:{root:'Root',sacral:'Sacral','solar-plexus':'Solar Plexus',heart:'Heart',throat:'Throat','third-eye':'Third Eye',crown:'Crown'},
    intention:{calm:'Calm',protection:'Protection',love:'Love',abundance:'Abundance',health:'Health',spiritual:'Spiritual','personal-power':'Personal Power','new-beginnings':'New Beginnings'}
  };
  var state={q:'',letter:'all',sel:{color:new Set(),chakra:new Set(),intention:new Set()}};
  var PAGE=48;var visibleCount=PAGE;var observer=null;

  function init(){renderLetters();renderFacets();filter();}
  function renderLetters(){
    var l=document.getElementById('ewg-letters');if(!l)return;
    var h='<button class="ewg-letter'+(state.letter==='all'?' sel':'')+'" onclick="EWGems.setLetter(\\'all\\')">All</button>';
    LETTERS.forEach(function(L){h+='<button class="ewg-letter'+(state.letter===L?' sel':'')+'" onclick="EWGems.setLetter(\\''+L+'\\')">'+L+'</button>';});
    l.innerHTML=h;
  }
  function setLetter(L){state.letter=L;renderLetters();filter();}
  function renderFacets(){
    var f=document.getElementById('ewg-filters');if(!f)return;f.innerHTML='';
    FACETS.forEach(function(ft){
      var g=document.createElement('div');g.className='ewg-fgroup';
      var chips='<div class="ewg-chips">';
      ft.vals.forEach(function(v){
        chips+='<button class="ewg-chip'+(state.sel[ft.key].has(v)?' sel':'')+'" onclick="EWGems.toggle(\\''+ft.key+'\\',\\''+v+'\\')">'+(LAB[ft.key][v]||v)+'</button>';
      });
      chips+='</div>';
      g.innerHTML='<p class="ewg-flabel">'+ft.label+'</p>'+chips;
      f.appendChild(g);
    });
  }
  function toggle(fk,v){
    var s=state.sel[fk];
    if(s.has(v))s.delete(v);else s.add(v);
    renderFacets();
    filter();
  }
  function setQ(q){state.q=(q||'').toLowerCase();filter();}
  function clearAll(){
    state.q='';state.letter='all';
    Object.keys(state.sel).forEach(function(k){state.sel[k].clear();});
    var qi=document.getElementById('ewg-q');if(qi)qi.value='';
    renderLetters();renderFacets();filter();
  }
  function filter(){
    var q=state.q;
    var res=C.filter(function(c){
      if(state.letter!=='all'&&c.name[0].toUpperCase()!==state.letter)return false;
      if(q&&c.name.toLowerCase().indexOf(q)<0)return false;
      for(var i=0;i<FACETS.length;i++){
        var ft=FACETS[i],sel=state.sel[ft.key];
        if(sel.size>0){
          var cv=c[ft.field];var arr=Array.isArray(cv)?cv:(cv?[cv]:[]);
          var hit=false;for(var j=0;j<arr.length;j++){if(sel.has(arr[j])){hit=true;break;}}
          if(!hit)return false;
        }
      }
      return true;
    });
    visibleCount=PAGE;renderGrid(res);
  }
  function renderGrid(res){
    var g=document.getElementById('ewg-grid');var e=document.getElementById('ewg-empty');var co=document.getElementById('ewg-count');var cl=document.getElementById('ewg-clear');
    if(co)co.textContent=res.length+' crystal'+(res.length===1?'':'s');
    var anySel=state.q||state.letter!=='all'||Object.keys(state.sel).some(function(k){return state.sel[k].size>0;});
    if(cl)cl.style.display=anySel?'inline':'none';
    if(res.length===0){g.innerHTML='';if(e)e.style.display='block';return;}
    if(e)e.style.display='none';
    var shown=res.slice(0,visibleCount);g.innerHTML=shown.map(function(c){
      var tags=(c.colors||[]).slice(0,3).map(function(x){return'<span class="ewg-tag">'+(LAB.color[x]||x)+'</span>';}).join('')
        +(c.intentions||[]).slice(0,2).map(function(x){return'<span class="ewg-tag int">'+(LAB.intention[x]||x)+'</span>';}).join('');
      return '<div class="ewg-card">'
        +'<div class="ewg-img">'+(c.img?'<img src="'+c.img+'" alt="'+c.name+'" loading="lazy">':'')+'</div>'
        +'<div class="ewg-body"><h3 class="ewg-name">'+c.name+'</h3>'
        +(tags?'<div class="ewg-tags">'+tags+'</div>':'')
        +'<p class="ewg-exc">'+(c.excerpt||'')+'</p>'
        +'<div class="ewg-btns"><a class="ewg-b-meaning" href="'+c.link+'">View Meaning</a><a class="ewg-b-shop" href="'+c.shop+'">Shop</a></div>'
        +'</div></div>';
    }).join('');
    if(visibleCount<res.length){var sen=document.createElement('div');sen.id='ewg-sentinel';sen.style.cssText='grid-column:1/-1;text-align:center;padding:24px;color:#888;font-size:14px';sen.textContent='Loading more…';g.appendChild(sen);setupObserver(res);}
  }
  function setupObserver(res){
    if(typeof IntersectionObserver==='undefined')return;
    var s=document.getElementById('ewg-sentinel');if(!s)return;
    if(observer)observer.disconnect();
    observer=new IntersectionObserver(function(entries){if(entries[0].isIntersecting){visibleCount+=PAGE;renderGrid(res);}},{rootMargin:'300px'});
    observer.observe(s);
  }
  return{init:init,setLetter:setLetter,toggle:toggle,setQ:setQ,clearAll:clearAll};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWGems.init);}else{EWGems.init();}
</script>
<!-- ===== End Gemstones Hub ===== -->`;

const OUT = path.resolve(__dirname, 'gemstones-hub.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Gemstones Hub 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${C.length} 颗 | A-Z 字母导航 + 搜索 + 3 facet + 双按钮卡片`);
