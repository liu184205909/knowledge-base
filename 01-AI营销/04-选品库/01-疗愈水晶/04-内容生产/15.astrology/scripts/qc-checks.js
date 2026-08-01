/**
 * Astrology 三质检关卡（框架 v2，二审前强制）
 * 关卡1: 事件差异化（M2重心词重叠 + M3场景雷同）
 * 关卡2: 水晶绑定三要素（事件词命中 + intentions + 具体场景）
 * 关卡3: 确定论/doom 禁词（命中=0 才PASS，硬门禁）
 * 用法：node qc-checks.js [--slug=xxx]
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const QC = path.join(DIR, '_qc'); fs.mkdirSync(QC, { recursive: true });

const slugArg = process.argv.slice(2).find(a => a.startsWith('--slug='))?.split('=')[1];
const articles = slugArg ? idx.articles.filter(a => a.slug === slugArg) : idx.articles.filter(a => a.line !== 'hub');

function text(s){ return (s||'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').toLowerCase(); }
function extractSection(content, h2Pattern){
  const m = content.match(new RegExp('<h2>'+h2Pattern+'[^]*?(?=<h2>|$)','i'));
  return m ? text(m[0]) : '';
}

// ===== 关卡1: 事件差异化（M2/M3 跨事件重心词重叠） =====
const eventTraitWords = {
  'mercury-retrograde': ['mercury','retrograde','communication','review','revis','reconnect','detail','technology','travel','re-'],
  'saturn-return': ['saturn','return','structure','foundation','responsibility','maturation','discipline','long-term','adult','29'],
  'full-moon': ['full moon','release','climax','illuminate','completion','gratitude','lunar','culmination','emotional peak'],
  'new-moon': ['new moon','seed','intention','dark','beginning','rest','inward','plant','manifest','quiet'],
  'eclipse': ['eclipse','node','accelerat','turning','revelation','shift','course correction','fate','sudden'],
  'venus-retrograde': ['venus','love','worth','beauty','value','heart','relationship','ex','reconnect','self-worth'],
};
const diffPairs = [];
const evSlugs = Object.keys(eventTraitWords);
for(let i=0;i<evSlugs.length;i++){
  for(let j=i+1;j<evSlugs.length;j++){
    const a=eventTraitWords[evSlugs[i]], b=eventTraitWords[evSlugs[j]];
    const inter=a.filter(w=>b.includes(w));
    const pct=(inter.length/Math.min(a.length,b.length))*100;
    if(pct>=25) diffPairs.push({a:evSlugs[i],b:evSlugs[j],overlap:Math.round(pct),shared:inter});
  }
}

// ===== 关卡2: 水晶绑定三要素 =====
const crystalChecks=[];
const genericPatterns=[
  /supports .{0,20} energy\. it is a .{0,20} stone/i,
  /is a .{0,15} stone that helps with/i,
];
for(const art of articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const m4=extractSection(a.content,'Best Crystals for');
  for(const [role,c] of Object.entries(a.crystals||{})){
    const slug=c.slug;
    const attr=ATTR[slug+'-meaning']||{};const ov=attr.overview||{};
    const intentions=(ov.Intentions||'').toLowerCase();
    // 要素1: 事件词或事件名命中
    const evWords=[art.slug.replace(/-/g,' '),a.name?a.name.toLowerCase():''].filter(Boolean);
    const hit1=evWords.some(w=>w&&m4.includes(w)) || m4.includes(art.slug.split('-')[0]);
    // 要素2: intentions 命中
    const intentWords=intentions.split(/[,/]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
    const hit2=intentWords.some(w=>w&&m4.includes(w));
    // 要素3: 具体场景词
    const stoneName=c.name||slug;
    const segMatch=m4.match(new RegExp(stoneName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[^]*?(?=###|<h3>|$)','i'));
    const seg=segMatch?segMatch[0]:'';
    const sceneWords=['hold','keep','wear','place','carry','before','when','try','desk','nightstand','morning','jewelry','bracelet','workspace'];
    const hit3=sceneWords.some(w=>seg.toLowerCase().includes(w));
    const genericHit=genericPatterns.some(p=>p.test(seg));
    crystalChecks.push({event:art.slug,role,slug,name:stoneName,elem1_event:hit1,elem2_symbolic:hit2,elem3_scene:hit3,generic:genericHit,pass:hit1&&hit2&&hit3&&!genericHit});
  }
}
const failedCrystals=crystalChecks.filter(c=>!c.pass);

// ===== 关卡3: 确定论/doom 禁词（硬门禁 =0） =====
const forbidden=[
  /\bdestined\b/i,/\bdestiny\b/i,/\bguaranteed\b/i,
  /\bwill heal\b/gi,/\bwill attract\b/gi,/\bwill bring\b/gi,
  /\bmeant to\b/gi,/\bborn to\b/gi,/\bcure\b/gi,/\bsuperior\b/i,
  /\bdoom\b/gi,/\bcursed\b/gi,/\bcatastrophe\b/gi,/\bdisaster\b/gi,
  /\bbad luck\b/gi,/\bmisfortune will\b/gi,
];
const detHits=[];
for(const art of articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const full=a.content+' '+(a.rank_math_description||'');
  const sentences=full.split(/(?<=[.!?])\s+/);
  for(const s of sentences){
    const t=text(s);
    for(const p of forbidden){
      const m=t.match(p);
      if(m){
        if(/not a guarantee|not guaranteed|no guarantee|rather than a|not a prediction|not a doom|not for bracing|inherently .bad.|not inherently bad/.test(t)) continue;
        detHits.push({event:art.slug,word:m[0],sentence:s.slice(0,180)});
      }
    }
  }
}

// ===== 残留占位符检查 =====
const placeholderHits=[];
for(const art of articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const remain=(a.content.match(/\{\{AI_[A-Z_0-9]*\}\}/g)||[]);
  if(remain.length) placeholderHits.push({event:art.slug,count:remain.length,sample:remain.slice(0,3)});
}

fs.writeFileSync(path.join(QC,'01-differentiation.json'),JSON.stringify({trait_overlap_pairs:diffPairs,verdict:diffPairs.length===0?'PASS':'REVIEW'},null,2));
fs.writeFileSync(path.join(QC,'02-crystal-binding.json'),JSON.stringify({total:crystalChecks.length,passed:crystalChecks.length-failedCrystals.length,failed:failedCrystals,verdict:failedCrystals.length===0?'PASS':'REVIEW'},null,2));
fs.writeFileSync(path.join(QC,'03-forbidden-words.json'),JSON.stringify({total_hits:detHits.length,hits:detHits,placeholder_residual:placeholderHits,verdict:detHits.length===0&&placeholderHits.length===0?'PASS':'FAIL_HARD_GATE'},null,2));

console.log('===== Astrology QC =====');
console.log(`关卡1 事件差异化: ${diffPairs.length===0?'PASS':'REVIEW'} (重叠对=${diffPairs.length})`);
console.log(`关卡2 水晶三要素: ${failedCrystals.length===0?'PASS':'REVIEW'} (${crystalChecks.length-failedCrystals.length}/${crystalChecks.length})`);
console.log(`关卡3 禁词+占位符: ${detHits.length===0&&placeholderHits.length===0?'PASS':'FAIL_HARD_GATE'} (禁词=${detHits.length}, 残留占位符=${placeholderHits.length})`);
if(failedCrystals.length) console.log('  关卡2失败:', failedCrystals.map(c=>`${c.event}/${c.role}`).join(', '));
if(detHits.length) console.log('  关卡3禁词命中:', JSON.stringify(detHits));
