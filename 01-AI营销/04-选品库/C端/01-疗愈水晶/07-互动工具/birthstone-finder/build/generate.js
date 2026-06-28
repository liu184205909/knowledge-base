/**
 * Birthstone Finder（T8）— 选月份 → 生辰石 + 含义 + 水晶属性 + 选购
 * 复用旧脚本 BIRTHSTONES 数据（02-网站规划/pages/birthstone-finder.js）+ search-data img/link
 * 定位：主题词红海(GIA/AGS/Brilliant Earth权威+AIO)，差异化=交互工具+水晶属性深度+选购
 *
 * 输出：./birthstone-finder.html
 */
const fs = require('fs');
const path = require('path');

// ===== 12 月生辰石（复用旧脚本数据 + 标准石）=====
const BIRTHSTONES = [
  { month:'January', num:1, stone:'Garnet', subtitle:'The Stone of Commitment', color:'#8B0000', colorName:'Deep Red', chakra:'Root Chakra', properties:['Passion','Energy','Creativity','Protection'], description:'Garnet is a stone of deep, passionate energy. It revitalizes your spirit, boosts confidence, and inspires love and devotion. Known as a powerful protection stone, Garnet has been treasured since ancient Egyptian times for its ability to ward off negative energy and attract abundance.', affirmation:'I am filled with passionate energy and my creative fire burns bright.' },
  { month:'February', num:2, stone:'Amethyst', subtitle:'The Stone of Peace', color:'#6A0DAD', colorName:'Violet Purple', chakra:'Crown & Third Eye Chakra', properties:['Calm','Intuition','Spiritual Growth','Clarity'], description:'Amethyst is the ultimate stone of peace and spiritual awareness. Its soothing violet energy calms the mind, enhances intuition, and connects you to higher states of consciousness. Ancient Greeks believed Amethyst could prevent intoxication, symbolizing clarity of thought and sobriety of spirit.', affirmation:'I am at peace, and my inner wisdom guides me clearly.' },
  { month:'March', num:3, stone:'Aquamarine', subtitle:'The Stone of Courage', color:'#006994', colorName:'Ocean Blue', chakra:'Throat Chakra', properties:['Courage','Communication','Calm','Clarity'], description:'Aquamarine carries the calming energy of the ocean. It is a stone of courage and clear communication, helping you speak your truth with confidence. Sailors once carried Aquamarine as a talisman of protection and safe passage across treacherous waters.', affirmation:'I speak my truth with courage and my words flow like calm waters.' },
  { month:'April', num:4, stone:'Diamond', subtitle:'The Stone of Invincibility', color:'#E8E8E8', colorName:'Clear White', chakra:'Crown Chakra', properties:['Strength','Purity','Eternity','Clarity'], description:'Diamond is the hardest natural substance on Earth, symbolizing unbreakable strength and eternal love. It is traditionally said to amplify the energy of other crystals and bring clarity to the mind. As the April birthstone, Diamond represents purity of intention and infinite potential.', affirmation:'I am strong, pure, and radiant. My inner light shines brightly.' },
  { month:'May', num:5, stone:'Emerald', subtitle:'The Stone of Successful Love', color:'#006400', colorName:'Rich Green', chakra:'Heart Chakra', properties:['Love','Abundance','Wisdom','Harmony'], description:'Emerald is the stone of unconditional love and abundance. Its lush green energy opens the heart to deep compassion and draws prosperity into your life. Cleopatra treasured Emeralds above all other gemstones, believing they held the power of eternal youth and fertility.', affirmation:'My heart is open to love, and abundance flows to me naturally.' },
  { month:'June', num:6, stone:'Pearl', subtitle:'The Stone of Purity', color:'#FFF5E1', colorName:'Luminous White', chakra:'Solar Plexus Chakra', properties:['Purity','Wisdom','Integrity','Calming'], description:'Pearl is the only gemstone created by a living creature, making it a symbol of natural purity and wisdom born from experience. Like the oyster that transforms an irritant into something beautiful, Pearl teaches you to turn challenges into strengths and find inner calm amidst chaos.', affirmation:'I transform challenges into wisdom and shine with inner purity.' },
  { month:'July', num:7, stone:'Ruby', subtitle:'The Stone of Vitality', color:'#E0115F', colorName:'Fiery Red', chakra:'Root & Heart Chakra', properties:['Vitality','Passion','Protection','Leadership'], description:'Ruby is the king of gemstones, radiating fierce vitality and life-force energy. It activates your root chakra for grounding and your heart chakra for passionate love. Ancient warriors wore Ruby into battle, believing it granted invincibility and protected against physical harm.', affirmation:'I am filled with vibrant life energy and I lead with passion.' },
  { month:'August', num:8, stone:'Peridot', subtitle:'The Stone of Compassion', color:'#9ACD32', colorName:'Lime Green', chakra:'Heart & Solar Plexus Chakra', properties:['Compassion','Abundance','Joy','Wellbeing'], description:'Peridot is a stone of warm, joyful energy, traditionally associated with releasing emotional tension and inviting abundance. Known as the evening emerald, Peridot was Cleopatra’s favorite gemstone. It carries the energy of sunshine and new growth, helping you let go of jealousy and embrace gratitude.', affirmation:'I release what no longer serves me and embrace joy and abundance.' },
  { month:'September', num:9, stone:'Sapphire', subtitle:'The Stone of Wisdom', color:'#0F52BA', colorName:'Royal Blue', chakra:'Third Eye & Throat Chakra', properties:['Wisdom','Focus','Truth','Spiritual Insight'], description:'Sapphire is the stone of mental clarity and spiritual wisdom. Its deep blue energy activates the third eye, enhancing intuition and focus. Ancient kings wore Sapphire as protection from envy and harm, believing it attracted divine favor and aligned them with their highest purpose.', affirmation:'I see clearly, speak truthfully, and trust my inner knowing.' },
  { month:'October', num:10, stone:'Opal', subtitle:'The Stone of Inspiration', color:'#FF7F50', colorName:'Iridescent Multi', chakra:'All Chakras', properties:['Creativity','Inspiration','Originality','Emotional Balance'], description:'Opal is a kaleidoscope of color, representing the full spectrum of human emotion and experience. It amplifies your unique gifts and stimulates originality and creativity. Opal helps you release inhibitions and express your true self with confidence and joy.', affirmation:'I embrace my unique gifts and express my creativity freely.' },
  { month:'November', num:11, stone:'Citrine', subtitle:'The Stone of Abundance', color:'#FFB300', colorName:'Golden Yellow', chakra:'Solar Plexus Chakra', properties:['Abundance','Confidence','Joy','Manifestation'], description:'Citrine is the merchant’s stone, long associated with attracting wealth, success, and positive energy. Its warm golden vibration is linked to the solar plexus, empowering confidence and willpower. In crystal tradition, Citrine is one of the few stones said to rarely need cleansing, associated with transmuting negativity.', affirmation:'I am a magnet for abundance and my confidence radiates like sunlight.' },
  { month:'December', num:12, stone:'Turquoise', subtitle:'The Stone of Protection', color:'#40E0D0', colorName:'Sky Blue-Green', chakra:'Throat Chakra', properties:['Protection','Communication','Healing','Friendship'], description:'Turquoise is one of the oldest protection stones, revered by Native American cultures for thousands of years. It guards against negative energy, promotes honest communication, and strengthens friendships. Turquoise changes color to warn its wearer of danger, making it a living talisman of protection.', affirmation:'I am protected, I speak honestly, and I attract true friendship.' }
];

// 读 search-data，按 stone 名匹配 img/link
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
function findStone(name){
  var lc = name.toLowerCase();
  return SD.crystals.find(c => c.name.toLowerCase() === lc)
    || SD.crystals.find(c => c.name.toLowerCase().includes(lc))
    || SD.crystals.find(c => lc.includes(c.name.toLowerCase()));
}
// by-stone 产品类目映射（基于线上验证 2026-06-27：5颗有独立category，其余用总类目）
const SHOP_CAT = {
  'Amethyst':'/product-category/amethyst-crystals/',
  'Ruby':'/product-category/ruby-crystals/',
  'Opal':'/product-category/opal-crystals/',
  'Citrine':'/product-category/citrine-crystals/',
  'Turquoise':'/product-category/turquoise-crystals/'
};
BIRTHSTONES.forEach(b => { var c = findStone(b.stone); b.img = c ? (c.img||'') : ''; b.link = c ? (c.link||'') : ''; b.shop = SHOP_CAT[b.stone] || ('/shop/?s=' + b.stone.toLowerCase()); });

function safeJSON(v){ return JSON.stringify(v).replace(/<\//g, '<\\/'); }
const BS_JSON = safeJSON(BIRTHSTONES);

let html = `<!-- ===== Earthward Birthstone Finder ===== -->
<div id="ebf-bf">
  <h1 class="ebf-h1">Birthstone Finder: What Is My Birthstone?</h1>
  <p class="ebf-intro">Select your birth month below to discover your birthstone — its meaning, color, chakra, and the energy traditionally associated with it. Every month is linked to a unique gemstone carried for protection, luck, and personal power for thousands of years.</p>

  <div class="ebf-months" id="ebf-months"></div>
  <div class="ebf-result" id="ebf-result" style="display:none"></div>
</div>
<style>
.ebf-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ebf-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ebf-months{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
@media(max-width:900px){.ebf-months{grid-template-columns:repeat(4,1fr)}}
@media(max-width:600px){.ebf-months{grid-template-columns:repeat(3,1fr)}}
@media(max-width:400px){.ebf-months{grid-template-columns:repeat(2,1fr)}}
.ebf-month{background:#fff;border:2px solid #E5E5E5;border-radius:14px;padding:18px 12px;cursor:pointer;text-align:center;transition:.15s;box-shadow:0 2px 5px rgba(0,0,0,.05)}
.ebf-month:hover{border-color:#2D6A4F;transform:translateY(-3px);box-shadow:0 6px 16px rgba(45,106,79,.18)}
.ebf-month.active{border-color:#2D6A4F;background:#F0F7F4}
.ebf-m-dot{width:36px;height:36px;border-radius:50%;margin:0 auto 8px;box-shadow:0 2px 6px rgba(0,0,0,.15)}
.ebf-m-name{font-size:15px;font-weight:700;color:#1A1A2E}
.ebf-m-stone{font-size:13px;color:#2D6A4F;margin-top:2px}
.ebf-result{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:24px;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}
.ebf-r-img{flex:0 0 180px;text-align:center}
.ebf-r-photo{width:160px;height:160px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block;background:#F0F7F4}
.ebf-r-colorname{font-size:13px;color:#888}
.ebf-r-info{flex:1;min-width:280px}
.ebf-r-stone{font-size:26px;font-weight:700;color:#1A1A2E;margin:0 0 2px}
.ebf-r-subtitle{font-size:15px;color:#2D6A4F;font-style:italic;margin:0 0 12px}
.ebf-r-props{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.ebf-r-prop{padding:4px 12px;background:#fff;border:1px solid #DDD;border-radius:15px;font-size:13px;color:#444}
.ebf-r-chakra{font-size:14px;color:#666;margin-bottom:10px}
.ebf-r-desc{font-size:15px;color:#444;line-height:1.65;margin-bottom:14px}
.ebf-r-aff{padding:12px 16px;background:#fff;border-left:3px solid #2D6A4F;border-radius:0 8px 8px 0;margin-bottom:16px}
.ebf-r-aff-l{font-size:11px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
.ebf-r-aff-t{font-size:14px;color:#555;font-style:italic;line-height:1.5}
.ebf-r-cta{display:flex;gap:10px;flex-wrap:wrap}
.ebf-btn{display:inline-block;padding:11px 22px;background:#2D6A4F;color:#fff !important;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600}
.ebf-btn:hover{background:#1B4332}
.ebf-btn.sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.ebf-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
@media(max-width:640px){.ebf-h1{font-size:24px}.ebf-result{flex-direction:column}.ebf-r-img{flex:0 0 auto}.ebf-r-photo{width:130px;height:130px}}
</style>
<script>
var EWBirth=(function(){
  var BS=${BS_JSON};
  function init(){
    var el=document.getElementById('ebf-months');
    el.innerHTML=BS.map(function(b,i){
      return '<div class="ebf-month" onclick="EWBirth.show('+i+')">'
        +'<div class="ebf-m-dot" style="background:'+b.color+'"></div>'
        +'<div class="ebf-m-name">'+b.month+'</div>'
        +'<div class="ebf-m-stone">'+b.stone+'</div>'
        +'</div>';
    }).join('');
  }
  function show(i){
    var b=BS[i];
    document.querySelectorAll('.ebf-month').forEach(function(c,idx){c.classList.toggle('active',idx===i);});
    var r=document.getElementById('ebf-result');
    r.style.display='flex';
    var propsHtml=b.properties.map(function(p){return '<span class="ebf-r-prop">'+p+'</span>';}).join('');
    var imgTag=b.img?'<img class="ebf-r-photo" src="'+b.img+'" alt="'+b.stone+'">':'<div class="ebf-r-photo" style="background:'+b.color+'"></div>';
    r.innerHTML='<div class="ebf-r-img">'+imgTag+'<div class="ebf-r-colorname">'+b.colorName+'</div></div>'
      +'<div class="ebf-r-info">'
      +'<h2 class="ebf-r-stone">'+b.month+' Birthstone: '+b.stone+'</h2>'
      +'<div class="ebf-r-subtitle">'+b.subtitle+'</div>'
      +'<div class="ebf-r-props">'+propsHtml+'</div>'
      +'<div class="ebf-r-chakra"><strong>Chakra:</strong> '+b.chakra+'</div>'
      +'<p class="ebf-r-desc">'+b.description+'</p>'
      +'<div class="ebf-r-aff"><div class="ebf-r-aff-l">Daily Affirmation</div><div class="ebf-r-aff-t">“'+b.affirmation+'”</div></div>'
      +'<div class="ebf-r-cta">'
      +(b.link?'<a class="ebf-btn" href="'+b.link+'">Read '+b.stone+' meaning →</a>':'')
      +'<a class="ebf-btn sec" href="'+b.shop+'">Shop '+b.stone+' crystals →</a>'
      +'<a class="ebf-btn sec" href="/gemstones/">Explore all crystals →</a>'
      +'</div>'
      +'<p class="ebf-disclaim">Birthstone meanings reflect cultural and spiritual tradition, not medical claims. There is no scientific evidence that birthstones treat illness, but many treasure them as personal symbols and meditation focuses.</p>'
      +'</div>';
    r.scrollIntoView({behavior:'smooth',block:'start'});
  }
  return{init:init,show:show};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWBirth.init);}else{EWBirth.init();}
</script>
<!-- ===== Birthstone Finder Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What are the 12 birthstones by month?","acceptedAnswer":{"@type":"Answer","text":"January Garnet, February Amethyst, March Aquamarine, April Diamond, May Emerald, June Pearl (also Alexandrite and Moonstone), July Ruby, August Peridot, September Sapphire, October Opal (also Tourmaline), November Citrine (also Topaz), and December Turquoise (also Tanzanite and Zircon)."}},{"@type":"Question","name":"How do I find my birthstone?","acceptedAnswer":{"@type":"Answer","text":"Your birthstone is determined by your birth month. Select your month above to see your stone, its color, chakra, meaning, and the energy traditionally associated with it. Some months have more than one accepted birthstone."}},{"@type":"Question","name":"Can I wear a birthstone that isn't my month?","acceptedAnswer":{"@type":"Answer","text":"Yes. Birthstones are traditionally tied to your birth month, but you can wear any stone whose energy or meaning resonates with you. Many people wear their own birthstone alongside stones chosen for a specific intention."}},{"@type":"Question","name":"Do birthstones have real meanings?","acceptedAnswer":{"@type":"Answer","text":"Birthstone meanings come from centuries of cultural and spiritual tradition. There is no scientific evidence that a birthstone's energy treats illness, but many people use them as meaningful symbols, meditation focuses, and personal reminders."}}]}
]}
</script>
<!-- ===== End Birthstone Finder ===== -->`;

// SEO 折叠长文
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Birthstone Finder SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Birthstones</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Birthstone Finder SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'birthstone-finder.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Birthstone Finder 生成完成 → ${OUT}`);
const withImg = BIRTHSTONES.filter(b => b.img).length;
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | 12 月生辰石 | ${withImg}/12 有图(search-data匹配)`);
