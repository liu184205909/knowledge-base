/**
 * Chinese Zodiac Checker — 输入生日(年月日) → 农历精确生肖 → 性格+五行+3水晶+本命年+兼容+CTA
 * 读 _shared/chinese-zodiac-knowledge.json(12生肖全属性) + crystal-meaning-search/data/search-data.json(水晶img/shop)
 * 参考 zodiac-compatibility-checker(结果样式) + numerology-calculator(生日输入)
 * 精确版:内嵌1900-2030农历新年表,自动判断1-2月出生者的生肖边界
 * 输出:./chinese-zodiac-checker.html
 */
const fs = require('fs');
const path = require('path');

const CK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/chinese-zodiac-knowledge.json'), 'utf8'));
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
const BY_SLUG = {};
SD.crystals.forEach(c => { BY_SLUG[c.slug] = { name:c.name, img:c.img||'', link:c.link||'', shop:c.shop||('/shop/?s='+c.slug) }; });

const ORDER = ['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'];

// compact 12 生肖(前端数组),3水晶补 img/shop
const ANIMALS = ORDER.map(key => {
  const a = CK.animals[key];
  const mapStone = s => {
    const sc = BY_SLUG[s.slug] || { name:s.name, img:'', shop:'/product-category/healing-crystals-jewelry/' };
    return { name:s.name, slug:s.slug, img:sc.img, shop:sc.shop, why:s.why };
  };
  return {
    key, name:a.name, chinese:a.chinese, element:a.element,
    personality:a.personality,
    lucky: mapStone(a.lucky_stone),
    balance: mapStone(a.balance_stone),
    year_boost: mapStone(a.year_boost),
    compatibility_best: a.compatibility_best
  };
});

// 当前年(本命年判断用)
const CUR = { year: CK.current_year.year, animal: CK.current_year.animal, element: CK.current_year.element, theme: CK.current_year.theme };

// 农历新年(春节)公历日期表 1900-2030,格式 {year:[month,day]}。表外年份回退公历计算
const LUNAR = {1900:[1,31],1901:[2,19],1902:[2,8],1903:[1,29],1904:[2,16],1905:[2,4],1906:[1,25],1907:[2,13],1908:[2,2],1909:[1,22],1910:[2,10],1911:[1,30],1912:[2,18],1913:[2,6],1914:[1,26],1915:[2,14],1916:[2,3],1917:[1,23],1918:[2,11],1919:[2,1],1920:[2,20],1921:[2,8],1922:[1,28],1923:[2,16],1924:[2,5],1925:[1,25],1926:[2,13],1927:[2,2],1928:[1,23],1929:[2,10],1930:[1,30],1931:[2,17],1932:[2,6],1933:[1,26],1934:[2,14],1935:[2,4],1936:[1,24],1937:[2,11],1938:[1,31],1939:[2,19],1940:[2,8],1941:[1,27],1942:[2,15],1943:[2,5],1944:[1,25],1945:[2,13],1946:[2,2],1947:[1,22],1948:[2,10],1949:[1,29],1950:[2,17],1951:[2,6],1952:[1,27],1953:[2,14],1954:[2,3],1955:[1,24],1956:[2,12],1957:[1,31],1958:[2,18],1959:[2,8],1960:[1,28],1961:[2,15],1962:[2,5],1963:[1,25],1964:[2,13],1965:[2,2],1966:[1,21],1967:[2,9],1968:[1,30],1969:[2,17],1970:[2,6],1971:[1,27],1972:[2,15],1973:[2,3],1974:[1,23],1975:[2,11],1976:[1,31],1977:[2,18],1978:[2,7],1979:[1,28],1980:[2,16],1981:[2,5],1982:[1,25],1983:[2,13],1984:[2,2],1985:[2,20],1986:[2,9],1987:[1,29],1988:[2,17],1989:[2,6],1990:[1,27],1991:[2,15],1992:[2,4],1993:[1,23],1994:[2,10],1995:[1,31],1996:[2,19],1997:[2,7],1998:[1,28],1999:[2,16],2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],2004:[1,22],2005:[2,9],2006:[1,29],2007:[2,18],2008:[2,7],2009:[1,26],2010:[2,14],2011:[2,3],2012:[1,23],2013:[2,10],2014:[1,31],2015:[2,19],2016:[2,8],2017:[1,28],2018:[2,16],2019:[2,5],2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],2024:[2,10],2025:[1,29],2026:[2,17],2027:[2,6],2028:[1,26],2029:[2,13],2030:[2,3]};

function safeJSON(v){ return JSON.stringify(v).replace(/<\//g, '<\\/'); }
const ANIMALS_JSON = safeJSON(ANIMALS);
const CUR_JSON = safeJSON(CUR);
const LUNAR_JSON = safeJSON(LUNAR);
const ORDER_JSON = safeJSON(ORDER);

let html = `<!-- ===== Earthward Chinese Zodiac Checker ===== -->
<div id="ecz-wrap">
  <h1 class="ecz-h1">Chinese Zodiac Checker</h1>
  <p class="ecz-intro">Enter your date of birth to find your Chinese zodiac animal — its personality traits, element, lucky stones for ${CUR.year}, and your most compatible signs. The tool accounts for the lunar new year cutoff, so January and February birthdays are placed correctly.</p>

  <div class="ecz-input-row">
    <select id="ecz-month"><option value="">Month</option></select>
    <select id="ecz-day"><option value="">Day</option></select>
    <input id="ecz-year" type="number" placeholder="Year (e.g. 1990)" min="1900" max="2099">
    <button class="ecz-btn" onclick="ECZodiac.calc()">Find My Zodiac</button>
  </div>

  <div class="ecz-result" id="ecz-result" style="display:none"></div>
</div>
<style>
.ecz-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ecz-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 24px;max-width:760px}
.ecz-input-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.ecz-input-row select,.ecz-input-row input{padding:12px 14px;border:1px solid #DDD;border-radius:8px;font-size:16px;background:#fff}
.ecz-input-row select{min-width:110px}
.ecz-input-row input{width:160px}
.ecz-btn{background:#2D6A4F;color:#fff !important;border:none;border-radius:8px;padding:12px 26px;font-size:15px;font-weight:600;cursor:pointer}
.ecz-btn:hover{background:#1B4332}
.ecz-result{margin-top:8px}
.ecz-head{background:#1A1A2E;border-radius:14px;padding:28px;color:#fff;margin-bottom:16px}
.ecz-animal-row{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.ecz-animal-name{font-size:38px;font-weight:700;line-height:1.1}
.ecz-chinese{font-size:18px;color:#CFAA3E;font-weight:600}
.ecz-badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.ecz-badge{background:#2D6A4F;color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:12px}
.ecz-personality{font-size:15px;color:#C8D1E0;line-height:1.6;margin-top:12px}
.ecz-bmn{background:#FBF3E5;border:1px solid #E8C887;border-radius:12px;padding:14px 18px;margin-bottom:16px;color:#7A5A12;font-size:14px;line-height:1.55}
.ecz-bmn b{color:#5A4208}
.ecz-card{background:#fff;border:1px solid #EEE;border-radius:14px;padding:20px;margin-bottom:14px}
.ecz-card h3{font-size:17px;color:#1A1A2E;margin:0 0 12px}
.ecz-stones{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ecz-stone{background:#FAFAFA;border:1px solid #EEE;border-radius:12px;padding:14px;text-align:center}
.ecz-stone-img{width:90px;height:90px;object-fit:cover;border-radius:50%;margin-bottom:8px}
.ecz-stone-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2D6A4F}
.ecz-stone-name{font-size:16px;font-weight:700;color:#1A1A2E;margin:3px 0 6px}
.ecz-stone-why{font-size:13px;color:#666;line-height:1.5;text-align:left}
.ecz-stone-shop{display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#2D6A4F;text-decoration:none}
.ecz-compat{display:flex;gap:8px;flex-wrap:wrap}
.ecz-chip{background:#F0F7F4;border:1px solid #C8E6D5;color:#1B4332;padding:6px 14px;border-radius:18px;font-size:14px;font-weight:600}
.ecz-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.ecz-cta{display:inline-block;padding:12px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600}
.ecz-cta-primary{background:#2D6A4F;color:#fff !important}
.ecz-cta-primary:hover{background:#1B4332}
.ecz-cta-sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.ecz-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
.ecz-seo-accordion{max-width:1220px;margin:32px auto 0}
.ecz-seo-details{border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden}
.ecz-seo-details summary{list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px}
.ecz-seo-details summary::-webkit-details-marker{display:none}
.ecz-seo-details summary:after{content:'+';float:right;font-size:24px;line-height:1;color:#2D6A4F}
.ecz-seo-details[open] summary:after{content:'-'}
.ecz-seo-content{padding:24px 28px;color:#444;font-size:16px;line-height:1.75}
.ecz-seo-content h2{color:#1A1A2E;font-size:24px;margin:26px 0 10px}
.ecz-seo-content h3{color:#1A1A2E;font-size:19px;margin:20px 0 8px}
@media(max-width:640px){.ecz-h1{font-size:26px}.ecz-input-row select{min-width:90px}.ecz-input-row input{width:120px}.ecz-animal-name{font-size:30px}.ecz-stones{grid-template-columns:1fr}}
</style>
<script>
var ECZodiac=(function(){
  var A=${ANIMALS_JSON};
  var CUR=${CUR_JSON};
  var LUNAR=${LUNAR_JSON};
  var ORDER=${ORDER_JSON};
  function init(){
    var ms=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var mh=document.getElementById('ecz-month'), dh=document.getElementById('ecz-day');
    for(var i=1;i<=12;i++) mh.innerHTML+='<option value="'+i+'">'+ms[i]+'</option>';
    for(var d=1;d<=31;d++) dh.innerHTML+='<option value="'+d+'">'+d+'</option>';
  }
  function calcZodiac(y,m,d){
    var yr=y;
    var l=LUNAR[y];
    if(l){
      var lunarDate=new Date(y,l[0]-1,l[1]);
      var bd=new Date(y,m-1,d);
      if(bd<lunarDate) yr=y-1;
    }
    var idx=((yr-2020)%12+12)%12; // Rat=2020=idx0
    return { key:ORDER[idx], year:yr };
  }
  function calc(){
    var m=Number(document.getElementById('ecz-month').value);
    var d=Number(document.getElementById('ecz-day').value);
    var y=Number(document.getElementById('ecz-year').value);
    if(!m||!d||!y||String(y).length<4){alert('Please enter your full birth date (month, day, and 4-digit year).');return;}
    var z=calcZodiac(y,m,d);
    var a=A.filter(function(x){return x.key===z.key;})[0];
    var el=document.getElementById('ecz-result');
    el.style.display='block';
    var isBMN = z.key===CUR.animal.toLowerCase();
    var stones=[['Lucky Stone',a.lucky],['Balance Stone',a.balance],[CUR.year+' Year Boost',a.year_boost]];
    var stonesHtml=stones.map(function(s){
      var lbl=s[0],c=s[1];
      return '<div class="ecz-stone">'
        +(c.img?'<img class="ecz-stone-img" src="'+c.img+'" alt="'+c.name+'" loading="lazy">':'')
        +'<div class="ecz-stone-lbl">'+lbl+'</div>'
        +'<div class="ecz-stone-name">'+c.name+'</div>'
        +'<div class="ecz-stone-why">'+c.why+'</div>'
        +'<a class="ecz-stone-shop" href="'+c.shop+'">Shop '+c.name+' -&gt;</a></div>';
    }).join('');
    var compatHtml=a.compatibility_best.map(function(n){return '<span class="ecz-chip">'+n+'</span>';}).join('');
    el.innerHTML='<div class="ecz-head">'
      +'<div class="ecz-animal-row"><div class="ecz-animal-name">'+a.name+'</div><div class="ecz-chinese">'+a.chinese+'</div></div>'
      +'<div class="ecz-badges"><span class="ecz-badge">'+a.element+' Element</span><span class="ecz-badge">Birth year '+z.year+'</span></div>'
      +'<div class="ecz-personality">'+a.personality+'</div></div>'
      +(isBMN?'<div class="ecz-bmn"><b>'+CUR.year+' is your Ben Ming Nian (\\u672c\\u547d\\u5e74) \\u2014 your zodiac year.</b> In Chinese tradition, encountering your own animal year is seen as a time of change rather than pure luck, so grounding and protective stones are especially supportive this year.</div>':'')
      +'<div class="ecz-card"><h3>Your Crystals for '+a.name+'</h3><div class="ecz-stones">'+stonesHtml+'</div></div>'
      +'<div class="ecz-card"><h3>Most Compatible Signs</h3><div class="ecz-compat">'+compatHtml+'</div></div>'
      +'<div class="ecz-cta-row">'
      +'<a class="ecz-cta ecz-cta-primary" href="/'+z.key+'-crystals/">Read the '+a.name+' Crystals Guide -&gt;</a>'
      +'<a class="ecz-cta ecz-cta-sec" href="/product-category/healing-crystals-jewelry/">Shop healing jewelry -&gt;</a></div>'
      +'<p class="ecz-disclaim">Chinese zodiac traditions and crystal meanings are shared for cultural appreciation and self-reflection, not as deterministic fortune-telling or medical advice. Trust how a stone feels to you over any hard rule.</p>';
    var offset=window.innerWidth<768?80:120;
    var top=el.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }
  return{init:init,calc:calc};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',ECZodiac.init);}else{ECZodiac.init();}
</script>
<!-- ===== Chinese Zodiac Checker Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How do I find my Chinese zodiac sign?","acceptedAnswer":{"@type":"Answer","text":"Your Chinese zodiac animal is determined by your birth year, based on a 12-year cycle. Enter your full date of birth into the checker above. Because the Chinese zodiac follows the lunar new year (which falls in late January or February), the exact cutoff date changes each year — the tool accounts for this automatically."}},
{"@type":"Question","name":"What if I was born in January or February?","acceptedAnswer":{"@type":"Answer","text":"The lunar new year falls between January 21 and February 20, so if your birthday is before that date in your birth year, you belong to the previous year's zodiac animal. For example, someone born on January 10, 2020 is a Pig (the 2019 animal), not a Rat. This checker uses the exact lunar new year date for each year to place you correctly."}},
{"@type":"Question","name":"What are the 12 Chinese zodiac animals in order?","acceptedAnswer":{"@type":"Answer","text":"Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat (Sheep), Monkey, Rooster, Dog, and Pig. The cycle repeats every 12 years. Each animal also pairs with one of five elements (Wood, Fire, Earth, Metal, Water), giving a 60-year full cycle."}},
{"@type":"Question","name":"What is Ben Ming Nian (your zodiac year)?","acceptedAnswer":{"@type":"Answer","text":"Ben Ming Nian occurs every 12 years when your zodiac animal returns. In Chinese tradition it is viewed as a year of change rather than guaranteed luck, and many people wear protective stones such as jade or black tourmaline as a symbolic anchor through the year."}},
{"@type":"Question","name":"How is the Chinese zodiac different from Western astrology?","acceptedAnswer":{"@type":"Answer","text":"The Chinese zodiac is year-based (one animal per birth year) and combines with five elements. Western astrology is month-based, with twelve constellations and four elements. They are two separate systems of self-reflection — your Chinese sign and Western sign describe different lenses, not the same thing."}}
]}
]}
</script>
<!-- ===== End Chinese Zodiac Checker ===== -->`;

let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Chinese Zodiac SEO Accordion ===== -->
<section class="ecz-seo-accordion" aria-label="Chinese zodiac guide">
  <details class="ecz-seo-details">
    <summary>Learn More About the Chinese Zodiac</summary>
    <div class="ecz-seo-content">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Chinese Zodiac SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'chinese-zodiac-checker.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log('Chinese Zodiac Checker generated:', OUT, '|', (fs.statSync(OUT).size/1024).toFixed(1), 'KB |', ANIMALS.length, 'animals | lunar table', Object.keys(LUNAR).length, 'years');
