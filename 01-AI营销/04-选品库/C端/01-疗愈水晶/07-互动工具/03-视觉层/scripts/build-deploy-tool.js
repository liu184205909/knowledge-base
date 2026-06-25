/**
 * 构建 Compatibility Checker 部署代码 v3
 * v3 修复：中文reasons→英文 / 实物图(form_bracelet) / H1+intro / 结果文字描述 / 跳转内链 / CTA替代留资
 */
const fs = require('fs');
const BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/02-数据层/';
const ATTR = JSON.parse(fs.readFileSync(BASE + 'crystal-attributes.json', 'utf8'));
const ZMAT = JSON.parse(fs.readFileSync(BASE + 'zodiac-matrix.json', 'utf8')).matrix;

const SLUG_ALIASES = { 'clear-quartz':'quartz', 'green-aventurine':'aventurine', 'lapis-lazuli':'lapis', 'rainbow-fluorite':'fluorite', 'rainbow-moonstone':'moonstone' };
const STONE_TAGS = { amethyst:['calm','protection','spiritual'],'tiger-eye':['protection','personal-power'],jade:['calm','abundance','spiritual'],'rose-quartz':['love'],carnelian:['personal-power'],labradorite:['protection','spiritual','personal-power','new-beginnings'],moonstone:['calm','spiritual','new-beginnings'],obsidian:['protection'],'black-tourmaline':['protection'],quartz:['spiritual','personal-power'],amazonite:['calm','personal-power'],aventurine:['calm','abundance','personal-power','new-beginnings'],selenite:['calm','protection','spiritual','personal-power'],turquoise:['protection'],lapis:['spiritual','personal-power'],fluorite:['spiritual','personal-power'],ruby:['love','health','personal-power'],citrine:['abundance','personal-power'],'red-jasper':['calm','protection','health','personal-power'],opal:['personal-power'],bloodstone:['protection','health','personal-power'],hematite:['protection','health','personal-power'],lepidolite:['calm','new-beginnings'],malachite:['protection','new-beginnings'],kyanite:['calm','spiritual','personal-power'],larimar:['calm'],rhodonite:['love'],apatite:['personal-power'],shungite:['protection'],chrysocolla:['calm'],angelite:['calm','spiritual'],pyrite:['abundance','personal-power'],serpentine:['protection','new-beginnings'],'herkimer-diamond':['spiritual','personal-power'],prehnite:['calm','love','spiritual'] };
const CHAKRA_MAP = { root:'root',base:'root','earth star':'root',sacral:'sacral','solar plexus':'solar-plexus',heart:'heart',throat:'throat','third eye':'third-eye',crown:'crown','higher centers':'crown' };
const ELEM = { fire:{fire:85,water:35,earth:55,air:80,ether:65},water:{fire:35,water:85,earth:80,air:50,ether:65},earth:{fire:55,water:80,earth:85,air:55,ether:65},air:{fire:80,water:50,earth:55,air:85,ether:65},ether:{fire:65,water:65,earth:65,air:65,ether:75} };
const CONFLICTS = [['carnelian','amethyst'],['moonstone','citrine'],['black-tourmaline','jade'],['selenite','red-jasper'],['rose-quartz','obsidian'],['turquoise','malachite']];

function normElem(raw){const p=(raw||'').toLowerCase().split(/[,\/]/).map(x=>x.trim()).filter(Boolean);for(const x of p){if(/storm/.test(x))return'fire';if(/water/.test(x))return'water';if(/fire/.test(x))return'fire';if(/air|wind/.test(x))return'air';if(/earth/.test(x))return'earth';if(/ether|spirit|cosmos|light|space|all|éther/.test(x))return'ether';}return'ether';}
function parseChakra(s){return [...new Set((s||'').toLowerCase().split(/[,\/;(]/).map(c=>c.trim()).map(c=>CHAKRA_MAP[c]).filter(Boolean))];}

const STONES = {};
for (const slug of Object.keys(STONE_TAGS)) {
  const real = SLUG_ALIASES[slug] || slug;
  const a = ATTR.crystals[real + '-meaning'];
  if (!a) continue;
  let raw = {};
  try { raw = JSON.parse(fs.readFileSync('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/1.crystal-meaning/' + real + '-meaning.json', 'utf8')); } catch (e) {}
  const fb = raw.images && raw.images.form_bracelet;
  const ov = raw.images && raw.images.overview;
  STONES[slug] = {
    name: (a.title || slug).replace(/ Meaning.*$/, '').replace(/^./, c => c.toUpperCase()),
    slug, element: normElem(a.overview.Element), chakras: parseChakra(a.overview.Chakra),
    tags: STONE_TAGS[slug],
    zodiac: (a.overview.Zodiac || '').toLowerCase().split(/[,\/]/).map(z => z.trim()).filter(Boolean).slice(0, 3),
    pairings: a.pairings.map(p => p.slug),
    shop: '/product-category/' + (slug === 'quartz' ? 'clear-quartz' : slug) + '-crystals/',
    img: (fb && fb.src) || (ov && ov.src) || '',
    meaning: '/gemstone/' + slug + '-meaning/'
  };
}
const ZM = {}; for (const [k, v] of Object.entries(ZMAT)) ZM[k] = { score: v.score, band: v.band, headline: v.headline, desc: v.description, crystals: v.crystals };
const data = { STONES, ZM, ELEM, CONFLICTS };
const dataJSON = JSON.stringify(data);

const html = `<!-- ===== Earthward Crystal Compatibility Checker v3 ===== -->
<div id="ew-compat">
  <h1 class="ewc-h1">Crystal Compatibility Checker</h1>
  <p class="ewc-intro">Find out whether your favorite crystals work in harmony — or pull in opposite directions. Pick two to five stones (or match by zodiac) to see their energetic compatibility, why they pair well, and the best ways to wear them together.</p>
  <div class="ewc-tabs">
    <button class="ewc-tab active" data-tab="crystal">By Crystal</button>
    <button class="ewc-tab" data-tab="zodiac">By Zodiac</button>
  </div>
  <div class="ewc-panel" id="ewc-panel-crystal">
    <input class="ewc-search" placeholder="Search crystals..." oninput="EWCompat.filterStones(this.value)">
    <div class="ewc-grid" id="ewc-stone-grid"></div>
    <p class="ewc-hint" id="ewc-hint">Select 2–5 crystals</p>
    <button class="ewc-btn" id="ewc-analyze" disabled onclick="EWCompat.analyzeCrystals()">Analyze Compatibility</button>
  </div>
  <div class="ewc-panel ewc-hide" id="ewc-panel-zodiac">
    <div class="ewc-grid ewc-zodiac-grid" id="ewc-zodiac-grid"></div>
    <p class="ewc-hint">Select two signs</p>
    <button class="ewc-btn" id="ewc-analyze-z" disabled onclick="EWCompat.analyzeZodiac()">Analyze Compatibility</button>
  </div>
  <div class="ewc-result" id="ewc-result"></div>
</div>
<style>
.ewc-h1{font-size:32px;color:#1A1A2E;margin:0 0 10px;font-weight:700;line-height:1.2}.ewc-intro{color:#444;font-size:16px;line-height:1.6;margin:0 0 24px;max-width:720px}
.ewc-tabs{display:flex;gap:8px;margin:0 0 20px}.ewc-tab{padding:10px 20px;border:1px solid #EEE;border-radius:8px;background:#fff;color:#444;cursor:pointer;font-size:15px}.ewc-tab.active{background:#2D6A4F;color:#fff;border-color:#2D6A4F}
.ewc-panel{background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:20px}.ewc-hide{display:none}
.ewc-search{width:100%;padding:10px 14px;border:1px solid #EEE;border-radius:8px;font-size:15px;margin-bottom:14px;box-sizing:border-box}
.ewc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px;max-height:380px;overflow-y:auto}
.ewc-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px 8px;border:1px solid #EEE;border-radius:10px;background:#fff;cursor:pointer;text-align:center;transition:.15s}.ewc-chip:hover{border-color:#95D5B2}.ewc-chip.sel{border-color:#2D6A4F;background:#F0F7F4;box-shadow:0 0 0 2px #2D6A4F22}.ewc-chip .ic{width:56px;height:56px;border-radius:50%;overflow:hidden;background:#F0F7F4;display:flex;align-items:center;justify-content:center}.ewc-chip .ic img{width:100%;height:100%;object-fit:cover}.ewc-chip .nm{font-size:12px;color:#444;line-height:1.2;min-height:28px;display:flex;align-items:center}
.ewc-zodiac-grid{grid-template-columns:repeat(6,1fr)}.ewc-zodiac-grid .ewc-chip .ic{font-size:22px;color:#2D6A4F;font-weight:700;background:#F0F7F4}
.ewc-hint{color:#666;font-size:13px;margin:14px 0 10px;text-align:center}
.ewc-btn{display:block;width:100%;padding:14px;background:#2D6A4F;color:#fff;border:none;border-radius:10px;font-size:16px;cursor:pointer}.ewc-btn:hover{background:#1B4332}.ewc-btn:disabled{background:#CCC;cursor:not-allowed}
.ewc-result{margin-top:24px;display:none}.ewc-result.show{display:block}
.ewc-card{background:#fff;border:1px solid #EEE;border-radius:12px;padding:24px;margin-bottom:16px}
.ewc-score-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}.ewc-ring{position:relative;width:160px;height:160px}.ewc-ring svg{transform:rotate(-90deg)}.ewc-ring .num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.ewc-ring .num b{font-size:40px;color:#1A1A2E;line-height:1}.ewc-ring .num span{font-size:13px;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.ewc-pair{display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap}.ewc-pair .p{background:#F0F7F4;color:#1B4332;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;text-decoration:none}.ewc-pair .p:hover{background:#95D5B2}
.ewc-narr{font-size:15px;color:#444;line-height:1.7;margin:14px 0 0}
.ewc-h{font-size:18px;color:#1A1A2E;margin:0 0 12px}.ewc-reason{list-style:none;padding:0;margin:0}.ewc-reason li{padding:6px 0;font-size:14px;color:#444;display:flex;gap:8px}.ewc-reason .pos{color:#2D6A4F;font-weight:700}.ewc-reason .neg{color:#B5715A;font-weight:700}
.ewc-lead{font-size:20px;color:#1A1A2E;font-weight:600;margin:0 0 6px}.ewc-leadband{font-size:14px;color:#A66A43;font-weight:600}
.ewc-rec{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.ewc-rec a{display:block;background:#F8F8F8;border:1px solid #EEE;border-radius:10px;padding:14px;text-align:center;text-decoration:none;color:#1A1A2E}.ewc-rec a:hover{border-color:#2D6A4F}.ewc-rec .pn{font-weight:600;font-size:14px;margin-bottom:6px}.ewc-rec .go{color:#2D6A4F;font-size:13px}
.ewc-cta{display:block;text-align:center;background:#2D6A4F;color:#fff;padding:14px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:600;margin-top:4px}.ewc-cta:hover{background:#1B4332}
.ewc-actions{display:flex;gap:10px;justify-content:center;margin-top:12px}.ewc-actions button{padding:8px 16px;background:#fff;border:1px solid #DDD;border-radius:8px;color:#444;cursor:pointer;font-size:13px}
</style>
<script>
const EWCompat=(function(){
  const D=${dataJSON};
  const ORDER=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  const ZLAB={aries:'♈ Aries',taurus:'♉ Taurus',gemini:'♊ Gemini',cancer:'♋ Cancer',leo:'♌ Leo',virgo:'♍ Virgo',libra:'♎ Libra',scorpio:'♏ Scorpio',sagittarius:'♐ Sagittarius',capricorn:'♑ Capricorn',aquarius:'♒ Aquarius',pisces:'♓ Pisces'};
  let selStones=[],selZ=[];
  function band(s){return s>=85?'Excellent':s>=70?'Harmonious':s>=55?'Moderate':s>=40?'Neutral':'Conflicting';}
  function color(s){return s>=70?'#2D6A4F':s>=40?'#A66A43':'#B5715A';}
  function init(){
    renderStones(Object.keys(D.STONES));renderZodiac();
    document.querySelectorAll('.ewc-tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.ewc-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById('ewc-panel-crystal').classList.toggle('ewc-hide',t.dataset.tab!=='crystal');document.getElementById('ewc-panel-zodiac').classList.toggle('ewc-hide',t.dataset.tab!=='zodiac');document.getElementById('ewc-result').classList.remove('show');});
  }
  function chipHTML(s,sel){return '<div class="ewc-chip'+(sel?' sel':'')+'" data-slug="'+s.slug+'"><div class="ic">'+(s.img?'<img src="'+s.img+'" alt="'+s.name+'" loading="lazy">':s.name[0])+'</div><div class="nm">'+s.name+'</div></div>';}
  function renderStones(keys){const g=document.getElementById('ewc-stone-grid');g.innerHTML='';keys.forEach(slug=>{const c=document.createElement('div');c.innerHTML=chipHTML(D.STONES[slug],selStones.includes(slug));c.firstChild.onclick=()=>toggleStone(slug);g.appendChild(c.firstChild);});}
  function renderZodiac(){const g=document.getElementById('ewc-zodiac-grid');g.innerHTML='';ORDER.forEach(z=>{const c=document.createElement('div');c.className='ewc-chip'+(selZ.includes(z)?' sel':'');c.dataset.z=z;c.innerHTML='<div class="ic">'+ZLAB[z].slice(0,1)+'</div><div class="nm">'+ZLAB[z].slice(2)+'</div>';c.onclick=()=>toggleZ(z);g.appendChild(c);});}
  function toggleStone(slug){const i=selStones.indexOf(slug);if(i>=0)selStones.splice(i,1);else if(selStones.length<5)selStones.push(slug);document.querySelectorAll('#ewc-stone-grid .ewc-chip').forEach(c=>c.classList.toggle('sel',selStones.includes(c.dataset.slug)));updBtn();}
  function toggleZ(z){const i=selZ.indexOf(z);if(i>=0)selZ.splice(i,1);else{if(selZ.length>=2)selZ.shift();selZ.push(z);}document.querySelectorAll('#ewc-zodiac-grid .ewc-chip').forEach(c=>c.classList.toggle('sel',selZ.includes(c.dataset.z)));document.getElementById('ewc-analyze-z').disabled=selZ.length<2;}
  function updBtn(){const b=document.getElementById('ewc-analyze');b.disabled=selStones.length<2;b.textContent='Analyze Compatibility'+(selStones.length>0?' ('+selStones.length+' selected)':'');}
  function filterStones(q){q=q.toLowerCase();renderStones(Object.keys(D.STONES).filter(s=>D.STONES[s].name.toLowerCase().includes(q)));}
  function isConflict(a,b){return D.CONFLICTS.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
  function pairScore(aSlug,bSlug){
    if(isConflict(aSlug,bSlug))return{score:25,band:'Conflicting',reasons:[{t:'neg',s:'Traditionally not worn together — energies pull in opposite directions'}],pairHit:false};
    const a=D.STONES[aSlug],b=D.STONES[bSlug];let base=D.ELEM[a.element][b.element],sc=base;const rs=[{t:'pos',s:'Element '+a.element+' × '+b.element+' = '+base}];
    const sh=a.chakras.filter(c=>b.chakras.includes(c));if(sh.length){sc+=5*sh.length;rs.push({t:'pos',s:'Shared chakras +'+(5*sh.length)+' ('+sh.join(', ')+')'});}
    const st=a.tags.filter(t=>b.tags.includes(t));if(st.length){sc+=5*st.length;rs.push({t:'pos',s:'Intention synergy +'+(5*st.length)+' ('+st.join(', ')+')'});}
    let pairHit=a.pairings.includes(bSlug)||b.pairings.includes(aSlug);if(pairHit){sc+=15;rs.push({t:'pos',s:'Recommended pairing +15'});}
    sc=Math.min(100,sc);if(pairHit)sc=Math.max(sc,80);
    return{score:sc,band:band(sc),reasons:rs,pairHit};
  }
  function crystalNarrative(pair,r){
    const names=pair.map(p=>p.name).join(' and ');
    if(r.band==='Conflicting')return 'Traditionally, '+names+' are not worn together — their energies tend to pull in opposite directions. If you feel drawn to both, wear them on different days, or bridge them with a neutral amplifier like Clear Quartz.';
    if(r.pairHit)return names+' make a time-honored pairing, long combined to complement each other\\'s strengths. '+(r.band==='Excellent'?'Their elements and intentions reinforce one another, so they amplify rather than compete when worn or meditated with together.':'They bring different qualities into balance when worn or placed together.');
    return names+' share a '+r.band.toLowerCase()+' compatibility. '+(r.score>=70?'Their energies support each other naturally — a comfortable, low-friction combination.':'They can work together, though you may want to set a clear intention to harmonize their different qualities.');
  }
  function pairingUrl(pair){
    const z1=(pair[0].zodiac||[])[0],z2=(pair[1].zodiac||[])[0];
    if(z1&&z2){const arr=[z1,z2].sort();return '/zodiac-compatibility/'+arr[0]+'-'+arr[1]+'/';}
    return '/zodiac-compatibility/';
  }
  function analyzeCrystals(){
    if(selStones.length<2)return;
    let tot=0,allR=[];for(let i=0;i<selStones.length;i++)for(let j=i+1;j<selStones.length;j++){const r=pairScore(selStones[i],selStones[j]);tot+=r.score;allR=allR.concat(r.reasons);}
    const score=Math.round(tot/((selStones.length*(selStones.length-1))/2));
    const pair=selStones.map(s=>D.STONES[s]);
    const lastR=pairScore(selStones[0],selStones[1]);
    renderResult(score,allR,pair,'crystal',null,lastR);
  }
  function analyzeZodiac(){
    if(selZ.length<2)return;const[a,b]=selZ.slice().sort();const key=ORDER.indexOf(a)<=ORDER.indexOf(b)?a+'-'+b:b+'-'+a;const m=D.ZM[key];
    renderResult(m.score,[],[{name:ZLAB[a].slice(2)},{name:ZLAB[b].slice(2)}],'zodiac',m);
  }
  function renderResult(score,reasons,pair,type,m,lastR){
    const r=document.getElementById('ewc-result');const c=color(score);const C=2*Math.PI*70;const off=C*(1-score/100);
    let html='<div class="ewc-card"><div class="ewc-score-wrap"><div class="ewc-ring"><svg width="160" height="160"><circle cx="80" cy="80" r="70" stroke="#EEE" stroke-width="12" fill="none"/><circle cx="80" cy="80" r="70" stroke="'+c+'" stroke-width="12" fill="none" stroke-dasharray="'+C+'" stroke-dashoffset="'+off+'" stroke-linecap="round"/></svg><div class="num"><b>'+score+'</b><span>'+band(score)+'</span></div></div><div class="ewc-pair">'+pair.map(p=>'<a class="p" href="'+(p.meaning||'#')+'">'+p.name+'</a>').join('')+'</div></div></div>';
    let narr='';
    if(m){narr='<div class="ewc-lead">'+m.headline+'</div><div class="ewc-leadband">'+m.band+' · '+m.crystals.signA+' + '+m.crystals.signB+'</div><p class="ewc-narr">'+m.desc+'</p>';}
    else if(type==='crystal'&&lastR){narr='<p class="ewc-narr">'+crystalNarrative(pair,lastR)+'</p>';}
    if(narr)html+='<div class="ewc-card">'+narr+'</div>';
    if(type==='crystal'&&reasons.length){html+='<div class="ewc-card"><h3 class="ewc-h">Why This Pairing</h3><ul class="ewc-reason">'+reasons.slice(0,8).map(x=>'<li><span class="'+x.t+'">'+(x.t==='pos'?'✓':'✗')+'</span><span>'+x.s+'</span></li>').join('')+'</ul></div>';}
    if(type==='crystal'){html+='<div class="ewc-card"><h3 class="ewc-h">Shop This Combination</h3><div class="ewc-rec">'+pair.map(p=>'<a href="'+p.shop+'"><div class="pn">'+p.name+'</div><div class="go">Shop →</div></a>').join('')+'</div></div>';}
    const ctaUrl=type==='crystal'?pairingUrl(pair):('/zodiac-compatibility/'+(selZ.slice().sort().join('-'))+'/');
    html+='<a class="ewc-cta" href="'+ctaUrl+'">Read the Full Pairing Guide →</a><div class="ewc-actions"><button onclick="EWCompat.reset()">Try Another</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)">Copy Link</button></div>';
    r.innerHTML=html;r.classList.add('show');r.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){selStones=[];selZ=[];renderStones(Object.keys(D.STONES));renderZodiac();updBtn();document.querySelectorAll('#ewc-zodiac-grid .ewc-chip').forEach(c=>c.classList.remove('sel'));document.getElementById('ewc-result').classList.remove('show');}
  return{init,filterStones,analyzeCrystals,analyzeZodiac,reset};
})();
document.addEventListener('DOMContentLoaded',EWCompat.init);
</script>
<!-- ===== End Compatibility Checker ===== -->`;

const OUT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/03-视觉层/compatibility-tool.html';
fs.writeFileSync(OUT, html, 'utf8');
let withImg=0;for(const s of Object.keys(STONES))if(STONES[s].img)withImg++;
console.log('=== v3 构建完成 ===');
console.log('水晶:', Object.keys(STONES).length, '| 有实物图:', withImg, '| 星座组:', Object.keys(ZM).length);
console.log('数据:', (dataJSON.length/1024).toFixed(1), 'KB | 总:', (html.length/1024).toFixed(1), 'KB');
console.log('中文检查:', /[一-鿿]/.test(html) ? '⚠ 含中文' : '✓ 无中文');
console.log('输出:', OUT);
