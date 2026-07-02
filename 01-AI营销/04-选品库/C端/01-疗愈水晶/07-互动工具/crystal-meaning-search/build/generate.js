/**
 * 生成 Crystal Meaning Search 页面（T2）
 * 搜索 + 4 facet 多选（color/chakra/element/intention）+ 卡片网格
 *
 * 输出：./crystal-meaning-search.html
 * 数据：../data/search-data.json（由 extract-search-data.js 生成）
 */
const fs = require('fs');
const path = require('path');
const { relatedHtml } = require('../../_shared/related-tools/related-html');

const DATA = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/search-data.json'), 'utf8'));
const C = DATA.crystals;
const C_JSON = JSON.stringify(C);

// 可选 SEO 内容（T2-3 产出 seo-content.html 后自动注入折叠区）
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}

let html = `<!-- ===== Earthward Crystal Meaning Search ===== -->
<div id="ew-meaning">
  <h1 class="ewm-h1">What Does Your Crystal Mean?</h1>
  <p class="ewm-intro">Search ${C.length} crystals by name, or filter by color, chakra, element, or intention to find the stone that matches your needs — then open its full meaning guide.</p>

  <div class="ewm-searchwrap">
    <input class="ewm-search" id="ewm-q" type="text" placeholder="Search by name (e.g. amethyst, rose quartz)..." oninput="EWMSearch.setQ(this.value)">
  </div>

  <div class="ewm-filters" id="ewm-filters"></div>
  <div class="ewm-toolbar">
    <span class="ewm-count" id="ewm-count"></span>
    <button class="ewm-clear" id="ewm-clear" onclick="EWMSearch.clearAll()" style="display:none;">Clear filters</button>
  </div>

  <div class="ewm-grid" id="ewm-grid"></div>
  <p class="ewm-empty" id="ewm-empty" style="display:none;">No crystals match your filters. Try clearing some.</p>
</div>
<style>
.ewm-h1{font-size:32px;color:#1A1A2E;margin:0 0 10px;font-weight:700;line-height:1.2}
.ewm-intro{color:#444;font-size:17px;line-height:1.6;margin:0 0 22px;max-width:760px}
.ewm-searchwrap{margin:0 0 18px}
.ewm-search{width:100%;padding:13px 16px;border:1px solid #EEE;border-radius:10px;font-size:15px;box-sizing:border-box;background:#fff}
.ewm-search:focus{outline:none;border-color:#2D6A4F;box-shadow:0 0 0 3px #2D6A4F22}
.ewm-filters{display:flex;flex-direction:column;gap:12px;margin:0 0 14px}
.ewm-fgroup{background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:12px 14px}
.ewm-flabel{font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}
.ewm-chips{display:flex;flex-wrap:wrap;gap:7px}
.ewm-chip{padding:6px 13px;border:1px solid #DDD;border-radius:20px;background:#fff;color:#444;cursor:pointer;font-size:13px;transition:.15s}
.ewm-chip:hover{border-color:#95D5B2}
.ewm-chip.sel{background:#2D6A4F;color:#fff !important;border-color:#2D6A4F}
.ewm-toolbar{display:flex;justify-content:space-between;align-items:center;margin:0 0 16px}
.ewm-count{color:#666;font-size:14px}
.ewm-clear{background:none;border:none;color:#2D6A4F;cursor:pointer;font-size:14px;text-decoration:underline;padding:0}
.ewm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
.ewm-card{display:flex;flex-direction:column;background:#fff;border:1px solid #EEE;border-radius:12px;overflow:hidden;text-decoration:none;color:#1A1A2E;transition:.15s}
.ewm-card:hover{border-color:#2D6A4F;box-shadow:0 4px 14px rgba(45,106,79,.10)}
.ewm-img{width:100%;aspect-ratio:4/3;background:#F0F7F4;overflow:hidden}
.ewm-img img{width:100%;height:100%;object-fit:cover}
.ewm-body{padding:13px 14px 15px;display:flex;flex-direction:column;gap:7px;flex:1}
.ewm-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:0;line-height:1.25}
.ewm-tags{display:flex;flex-wrap:wrap;gap:5px}
.ewm-tag{background:#F0F7F4;color:#1B4332;padding:3px 9px;border-radius:12px;font-size:13px;font-weight:600}
.ewm-tag.int{background:#FBF3EC;color:#A66A43}
.ewm-exc{font-size:15px;color:#666;line-height:1.5;margin:2px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ewm-go{color:#2D6A4F;font-size:13px;font-weight:600;margin-top:auto;padding-top:4px}
.ewm-empty{text-align:center;color:#888;padding:40px 0;font-size:15px}
@media(max-width:640px){.ewm-h1{font-size:26px}.ewm-intro{font-size:15px}.ewm-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:11px}.ewm-body{padding:11px 12px 13px}.ewm-name{font-size:15px}}
</style>
<script>
var EWMSearch=(function(){
  var C=${C_JSON};
  var FACETS=[
    {key:'color',field:'colors',label:'Color',vals:['red','orange','yellow','green','blue','purple','pink','brown','black','white','grey']},
    {key:'chakra',field:'chakras',label:'Chakra',vals:['root','sacral','solar-plexus','heart','throat','third-eye','crown']},
    {key:'element',field:'element',label:'Element',vals:['fire','water','earth','air','ether']},
    {key:'intention',field:'intentions',label:'Intention',vals:['calm','protection','love','abundance','health','spiritual','personal-power','new-beginnings']}
  ];
  var LAB={
    color:{red:'Red',orange:'Orange',yellow:'Yellow',green:'Green',blue:'Blue',purple:'Purple',pink:'Pink',brown:'Brown',black:'Black',white:'White',grey:'Grey'},
    chakra:{root:'Root',sacral:'Sacral','solar-plexus':'Solar Plexus',heart:'Heart',throat:'Throat','third-eye':'Third Eye',crown:'Crown'},
    element:{fire:'Fire',water:'Water',earth:'Earth',air:'Air',ether:'Ether'},
    intention:{calm:'Calm',protection:'Protection',love:'Love',abundance:'Abundance',health:'Health',spiritual:'Spiritual','personal-power':'Personal Power','new-beginnings':'New Beginnings'}
  };
  var state={q:'',sel:{color:new Set(),chakra:new Set(),element:new Set(),intention:new Set()}};

  function init(){renderFacets();filter();}
  function renderFacets(){
    var f=document.getElementById('ewm-filters');if(!f)return;f.innerHTML='';
    FACETS.forEach(function(ft){
      var g=document.createElement('div');g.className='ewm-fgroup';
      var chips='<div class="ewm-chips">';
      ft.vals.forEach(function(v){
        chips+='<button class="ewm-chip" data-f="'+ft.key+'" data-v="'+v+'" onclick="EWMSearch.toggle(\\''+ft.key+'\\',\\''+v+'\\')">'+(LAB[ft.key][v]||v)+'</button>';
      });
      chips+='</div>';
      g.innerHTML='<p class="ewm-flabel">'+ft.label+'</p>'+chips;
      f.appendChild(g);
    });
  }
  function toggle(fk,v){
    var s=state.sel[fk];
    if(s.has(v))s.delete(v);else s.add(v);
    document.querySelectorAll('.ewm-chip[data-f="'+fk+'"][data-v="'+v+'"]').forEach(function(b){b.classList.toggle('sel',s.has(v));});
    filter();
  }
  function setQ(q){state.q=(q||'').toLowerCase();filter();}
  function clearAll(){
    state.q='';var qi=document.getElementById('ewm-q');if(qi)qi.value='';
    Object.keys(state.sel).forEach(function(k){state.sel[k].clear();});
    document.querySelectorAll('.ewm-chip.sel').forEach(function(b){b.classList.remove('sel');});
    filter();
  }
  function filter(){
    var q=state.q;
    var res=C.filter(function(c){
      if(q&&c.name.toLowerCase().indexOf(q)<0)return false;
      for(var i=0;i<FACETS.length;i++){
        var ft=FACETS[i],sel=state.sel[ft.key];
        if(sel.size>0){
          var cv=c[ft.field];
          var arr=Array.isArray(cv)?cv:(cv?[cv]:[]);
          var hit=false;for(var j=0;j<arr.length;j++){if(sel.has(arr[j])){hit=true;break;}}
          if(!hit)return false;
        }
      }
      return true;
    });
    renderGrid(res);
  }
  function renderGrid(res){
    var g=document.getElementById('ewm-grid');var e=document.getElementById('ewm-empty');var co=document.getElementById('ewm-count');var cl=document.getElementById('ewm-clear');
    if(co)co.textContent=res.length+' crystal'+(res.length===1?'':'s')+' found';
    var anySel=state.q||Object.keys(state.sel).some(function(k){return state.sel[k].size>0;});
    if(cl)cl.style.display=anySel?'inline':'none';
    if(res.length===0){g.innerHTML='';if(e)e.style.display='block';return;}
    if(e)e.style.display='none';
    g.innerHTML=res.map(function(c){
      var tags=(c.colors||[]).slice(0,3).map(function(x){return'<span class="ewm-tag">'+(LAB.color[x]||x)+'</span>';}).join('')
        +(c.intentions||[]).slice(0,2).map(function(x){return'<span class="ewm-tag int">'+(LAB.intention[x]||x)+'</span>';}).join('');
      return '<a class="ewm-card" href="'+c.link+'">'
        +'<div class="ewm-img">'+(c.img?'<img src="'+c.img+'" alt="'+c.name+'" loading="lazy">':'')+'</div>'
        +'<div class="ewm-body"><h3 class="ewm-name">'+c.name+'</h3>'
        +(tags?'<div class="ewm-tags">'+tags+'</div>':'')
        +'<p class="ewm-exc">'+(c.excerpt||'')+'</p>'
        +'<span class="ewm-go">View meaning \\u2192</span></div></a>';
    }).join('');
  }
  return{init:init,toggle:toggle,setQ:setQ,clearAll:clearAll};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWMSearch.init);}else{EWMSearch.init();}
</script>`;

// SEO 折叠区（T2-3 提供 seo-content.html 后自动出现）
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Crystal Meaning Search SEO Accordion ===== -->
<section class="ewm-seo-accordion" aria-label="Crystal meanings guide">
  <details class="ewm-seo-details">
    <summary>Learn More About Crystal Meanings</summary>
    <div class="ewm-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<style>
.ewm-seo-accordion{max-width:1220px;margin:32px auto 0}
.ewm-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ewm-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.ewm-seo-details summary::-webkit-details-marker{display:none}
.ewm-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.ewm-seo-details[open] summary:after{content:'-'}
.ewm-seo-content{padding:24px 28px;color:#444;font-size:15px;line-height:1.75}
.ewm-seo-content h2{color:#1A1A2E;font-size:26px;margin:28px 0 12px}
.ewm-seo-content h3{color:#1A1A2E;font-size:20px;margin:22px 0 10px}
.ewm-seo-content a{color:#2D6A4F;text-decoration:underline}
</style>`;
}

html += `
<!-- ===== End Crystal Meaning Search ===== -->`;

const OUT = path.resolve(__dirname, 'crystal-meaning-search.html');
fs.writeFileSync(OUT, html + '\n' + relatedHtml('crystal-meaning-search'), 'utf8');
console.log(`✅ Crystal Meaning Search 生成完成 → ${OUT}`);
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | ${C.length} 颗水晶 | 4 facet (color/chakra/element/intention)`);
console.log(`   SEO 折叠区: ${SEO_CONTENT.trim() ? '已注入' : '待 T2-3 产出 seo-content.html'}`);
