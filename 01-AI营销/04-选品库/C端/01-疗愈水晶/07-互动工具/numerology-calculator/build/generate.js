/**
 * Numerology Life Path Calculator — 输入生日→Pythagorean归约→Life Path 1-9/master 11/22/33→archetype+crystals(5用途)
 * 读 _shared/numerology-knowledge.json(12 number+算法) + search-data(slug→img/link/shop)
 * 参考 birthstone-finder(输入生日→输出模式)
 * 输出：./numerology-calculator.html
 */
const fs = require('fs');
const path = require('path');

const NK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/numerology-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const BY_SLUG = {};
SD.crystals.forEach(c => { BY_SLUG[c.slug] = { name:c.name, img:c.img||'', link:c.link||'', shop:c.shop||('/shop/?s='+c.slug) }; });

// compact numbers (12: 1-9 + 11/22/33), crystals 5用途×{slug,reason} 补 name/img/link/shop
const NUMBERS = NK.numbers.map(n => {
  const cr = {};
  for (const use of Object.keys(n.crystals)) {
    const v = n.crystals[use];
    const sc = BY_SLUG[v.slug] || { name:v.slug, img:'', link:'', shop:'/product-category/healing-crystals-jewelry/' };
    cr[use] = { name:sc.name, img:sc.img, link:sc.link, shop:sc.shop, reason:v.reason };
  }
  return {
    number:n.number, is_master:n.is_master, archetype:n.archetype, theme:n.theme,
    primary_intent:n.primary_intent, secondary_intent:n.secondary_intent,
    core_traits:n.core_traits, strengths:n.strengths, challenges:n.challenges,
    element:n.element, color:n.color, crystals:cr
  };
});
function safeJSON(v){ return JSON.stringify(v).replace(/<\//g, '<\\/'); }
const NUMBERS_JSON = safeJSON(NUMBERS);

let html = `<!-- ===== Earthward Numerology Calculator ===== -->
<div id="enc-nc">
  <h1 class="enc-h1">Life Path Number Calculator</h1>
  <p class="enc-intro">Enter your birth date to discover your Life Path Number (1-9, or master 11/22/33) — your numerological archetype, core traits, and the crystals traditionally aligned with your path.</p>

  <div class="enc-input-row">
    <select id="enc-month"><option value="">Month</option></select>
    <select id="enc-day"><option value="">Day</option></select>
    <input id="enc-year" type="number" placeholder="Year (e.g. 1990)" min="1900" max="2099">
    <button class="enc-btn" onclick="EWNum.calc()">Calculate</button>
  </div>

  <div class="enc-result" id="enc-result" style="display:none"></div>
</div>
<style>
.enc-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.enc-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px}
.enc-input-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.enc-input-row select,.enc-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff}
.enc-input-row select{min-width:110px}
.enc-input-row input{width:150px}
.enc-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 26px;font-size:15px;font-weight:600;cursor:pointer}
.enc-btn:hover{background:#1B4332}
.enc-result{margin-top:8px}
.enc-r-head{background:#1A1A2E;border-radius:14px;padding:24px;color:#fff;margin-bottom:18px}
.enc-r-num{font-size:48px;font-weight:700;line-height:1}
.enc-r-master{display:inline-block;background:#CFAA3E;color:#1A1A2E;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;vertical-align:middle}
.enc-r-arch{font-size:20px;margin-top:6px}
.enc-r-theme{font-size:14px;color:#B8C5D6;margin-top:2px}
.enc-r-card{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:20px;margin-bottom:14px}
.enc-r-card h3{font-size:17px;color:#1A1A2E;margin:0 0 10px}
.enc-r-traits{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.enc-r-trait{padding:4px 12px;background:#fff;border:1px solid #DDD;border-radius:15px;font-size:13px;color:#444}
.enc-r-desc{font-size:15px;color:#444;line-height:1.6}
.enc-r-crystals{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.enc-r-cry{background:#fff;border:1px solid #EEE;border-radius:10px;padding:12px}
.enc-r-cry-use{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.enc-r-cry-name{font-size:15px;font-weight:600;color:#1A1A2E;margin:2px 0 4px}
.enc-r-cry-reason{font-size:13px;color:#666;line-height:1.45}
.enc-r-cry-link{font-size:13px;font-weight:600;color:#2D6A4F;text-decoration:none;display:inline-block;margin-top:4px}
.enc-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.enc-h1{font-size:24px}.enc-input-row select{min-width:90px}.enc-input-row input{width:120px}}
</style>
<script>
var EWNum=(function(){
  var N=${NUMBERS_JSON};
  function init(){
    var ms=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var mh=document.getElementById('enc-month'), dh=document.getElementById('enc-day');
    for(var i=1;i<=12;i++) mh.innerHTML+='<option value="'+i+'">'+ms[i]+'</option>';
    for(var d=1;d<=31;d++) dh.innerHTML+='<option value="'+d+'">'+d+'</option>';
  }
  function reduceNum(n){
    n=Math.abs(n);
    while(n>9 && n!==11 && n!==22 && n!==33){
      n=(''+n).split('').reduce(function(a,d){return a+Number(d);},0);
    }
    return n;
  }
  function lifePath(m,d,y){ return reduceNum(reduceNum(m)+reduceNum(d)+reduceNum(y)); }
  function calc(){
    var m=Number(document.getElementById('enc-month').value);
    var d=Number(document.getElementById('enc-day').value);
    var y=Number(document.getElementById('enc-year').value);
    if(!m||!d||!y||String(y).length<4){alert('Please enter your full birth date (month, day, and 4-digit year).');return;}
    var lp=lifePath(m,d,y);
    var n=N.find(function(x){return x.number===lp;})||N[0];
    var el=document.getElementById('enc-result');
    el.style.display='block';
    var traits=(n.core_traits||[]).slice(0,6).map(function(t){return '<span class="enc-r-trait">'+t+'</span>';}).join('');
    var cryHtml=Object.keys(n.crystals).map(function(use){
      var c=n.crystals[use];
      var useLabel=use.replace(/_/g,' ').replace('best ','');
      return '<div class="enc-r-cry"><div class="enc-r-cry-use">'+useLabel+'</div>'
        +'<div class="enc-r-cry-name">'+c.name+'</div>'
        +'<div class="enc-r-cry-reason">'+c.reason+'</div>'
        +'<a class="enc-r-cry-link" href="'+c.shop+'">Shop '+c.name+' -&gt;</a></div>';
    }).join('');
    el.innerHTML='<div class="enc-r-head"><div class="enc-r-num">'+lp+(n.is_master?'<span class="enc-r-master">MASTER</span>':'')+'</div>'
      +'<div class="enc-r-arch">'+n.archetype+'</div>'
      +'<div class="enc-r-theme">'+n.theme+'</div></div>'
      +'<div class="enc-r-card"><h3>Your Core Traits</h3><div class="enc-r-traits">'+traits+'</div>'
      +'<div class="enc-r-desc">Life Path '+lp+' centers on '+n.primary_intent+' and '+n.secondary_intent+'. '
      +'Element: '+n.element+' | Color: '+n.color+'.</div></div>'
      +'<div class="enc-r-card"><h3>Crystals for Life Path '+lp+'</h3><div class="enc-r-crystals">'+cryHtml+'</div></div>'
      +'<a class="enc-btn sec" href="/life-path-'+lp+'/" style="display:inline-block;margin-top:6px;margin-right:10px;text-decoration:none;background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F">Read Your Life Path '+lp+' Guide -&gt;</a>'
      +'<a class="enc-btn" href="/product-category/healing-crystals-jewelry/" style="display:inline-block;text-decoration:none">Shop healing crystal jewelry -&gt;</a>'
      +'<p class="enc-disclaim">Numerology and crystal meanings are offered for reflection and spiritual inspiration. They are not a substitute for medical, financial, or professional advice.</p>';
    var offset=window.innerWidth<768?80:120;
    var top=el.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }
  return{init:init,calc:calc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWNum.init);}else{EWNum.init();}
</script>
<!-- ===== Numerology Calculator Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I calculate my Life Path Number?","acceptedAnswer":{"@type":"Answer","text":"Write your birth date as MM/DD/YYYY. Reduce the month, day, and year each to a single digit (or master number 11/22/33) by adding their digits. Then add those three results together and reduce again the same way. The final number is your Life Path."}},{"@type":"Question","name":"What are master numbers in numerology?","acceptedAnswer":{"@type":"Answer","text":"Master numbers are 11, 22, and 33. When a reduction step produces one of these, it is not reduced further (11 stays 11, not 2). They carry heightened potential and specific challenges."}},{"@type":"Question","name":"Which crystals match my Life Path?","acceptedAnswer":{"@type":"Answer","text":"Each Life Path Number aligns with specific crystals. For example, Life Path 1 pairs with citrine and tiger's eye for confidence and leadership, while Life Path 7 aligns with amethyst and clear quartz for intuition and insight."}},{"@type":"Question","name":"Is numerology scientifically proven?","acceptedAnswer":{"@type":"Answer","text":"No. Numerology is a symbolic and spiritual tradition, not a science. There is no scientific evidence that numbers determine personality or fate, but many find it a meaningful framework for self-reflection."}}]}
]}
</script>
<!-- ===== End Numerology Calculator ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += '\n<!-- ===== Numerology SEO Accordion ===== -->\n<section style="margin:32px auto 0">\n  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">\n    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Numerology & Life Path</summary>\n    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">\n'+SEO_CONTENT+'\n    </div>\n  </details>\n</section>\n<!-- ===== End Numerology SEO Accordion ===== -->';
}

const OUT = path.resolve(__dirname, 'numerology-calculator.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log('Numerology Calculator generated:', OUT, '|', (fs.statSync(OUT).size/1024).toFixed(1), 'KB |', NUMBERS.length, 'Life Path numbers');
