/**
 * Numerology 三质检关卡（框架 v2 §13A，二审前强制）
 * 关卡1: 号码差异化（trait词重叠<30% + 场景独特 + M8 rebalance不雷同）
 * 关卡2: 水晶绑定三要素（60条检查 + 反通用句模式匹配）
 * 关卡3: 确定论语言（批量搜禁词，输出命中行供人工改写）
 * 用法：node scripts/qc-checks.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const QC = path.join(DIR, '_qc');
fs.mkdirSync(QC, { recursive: true });

// 提取正文文本（去标签）
function text(s){ return (s||'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').toLowerCase(); }

// ===== 关卡1: 号码差异化 =====
const traitWords = {
  '1':['independence','initiative','self-leadership','self-directed','pioneer','original','self-reliant'],
  '2':['cooperation','sensitivity','mediation','peacemaker','diplomatic','empathy','harmony'],
  '3':['creativity','expression','imagination','communicator','joyful','sociable','playful'],
  '4':['structure','discipline','foundation','builder','organizer','reliable','steady'],
  '5':['freedom','adaptability','restlessness','adventurer','versatile','curious','experience'],
  '6':['care','nurturer','service','responsibility','compassion','harmony','devotion'],
  '7':['introspection','seeker','truth','analysis','spiritual','solitude','wisdom'],
  '8':['ambition','mastery','powerhouse','power','leadership','executive','material'],
  '9':['compassion','humanitarian','completion','universal','idealistic','old soul','generous'],
  '11':['intuition','illumination','visionary','spiritual messenger','sensitivity','master','illuminate'],
  '22':['master builder','manifestation','legacy','vision','structure','scale','masterful'],
  '33':['master teacher','compassionate','uplift','nurturing','devotion','self-sacrifice','magnetic'],
};
// 提取M3段(M6 M8)
function extractSection(content, h2Pattern){
  const m = content.match(new RegExp('<h2>'+h2Pattern+'[^]*?(?=<h2>|$)','i'));
  return m ? text(m[0]) : '';
}
const diff1 = { pairs:[], overlap:{} };
// 两两 trait 词重叠
const nums = Object.keys(traitWords);
for(let i=0;i<nums.length;i++){
  for(let j=i+1;j<nums.length;j++){
    const a=traitWords[nums[i]], b=traitWords[nums[j]];
    const inter=a.filter(w=>b.includes(w));
    const overlapPct=(inter.length/Math.min(a.length,b.length))*100;
    if(overlapPct>=30){
      diff1.pairs.push({a:nums[i],b:nums[j],overlap:Math.round(overlapPct),shared:inter});
    }
  }
}
// M8 rebalance 雷同（"How to Rebalance"列跨号相似）
const rebals={};
for(const art of idx.articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const m8=extractSection(a.content,'The Gifts and Growth Edges');
  // 提取 rebalance 单元
  const cells=(m8.match(/how to rebalance[^.]*\.|pause[^.]*\.|schedule[^.]*\.|name one[^.]*\.|each week[^.]*\./g)||[]).slice(0,5);
  rebals[art.slug]=cells;
}
// 比较 rebalance 跨号 jaccard
const rebalPairs=[];
const slugs=Object.keys(rebals);
for(let i=0;i<slugs.length;i++){
  for(let j=i+1;j<slugs.length;j++){
    const setA=new Set(rebals[slugs[i]].join(' ').split(/\W+/).filter(w=>w.length>4));
    const setB=new Set(rebals[slugs[j]].join(' ').split(/\W+/).filter(w=>w.length>4));
    let inter=0;setA.forEach(w=>{if(setB.has(w))inter++;});
    const uni=new Set([...setA,...setB]).size||1;
    const sim=(inter/uni)*100;
    if(sim>40) rebalPairs.push({a:slugs[i],b:slugs[j],sim:Math.round(sim)});
  }
}
fs.writeFileSync(path.join(QC,'01-differentiation.json'),JSON.stringify({
  trait_overlap_high:diff1.pairs,
  trait_overlap_count:diff1.pairs.length,
  m8_rebalance_similar:rebalPairs,
  m8_rebalance_similar_count:rebalPairs.length,
  verdict: diff1.pairs.length===0 && rebalPairs.length===0 ? 'PASS' : 'REVIEW'
},null,2));

// ===== 关卡2: 水晶绑定三要素 =====
const KNOW=require('../../../07-互动工具/_shared/numerology-knowledge.json');
const ATTR=require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const crystalChecks=[];
// 通用句反例模式
const genericPatterns=[
  /supports .{0,20} energy\. it is a .{0,20} stone/i,
  /is a .{0,15} stone that helps with/i,
  /.{0,30} resonates with.{0,30} energy\.\s*it/i, // 过于通用但我们的句式A类似，需结合三要素判断
];
for(const art of idx.articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const num=art.number;
  const nd=KNOW.numbers.find(n=>n.number===num);
  // M6段
  const m6=extractSection(a.content,'Best Crystals for Life Path');
  for(const [role,c] of Object.entries(nd.crystals)){
    const slug=c.slug;
    const attr=ATTR[slug+'-meaning']||{};const ov=attr.overview||{};
    const intentions=(ov.Intentions||'').toLowerCase();
    // 三要素1: 号码挑战/优势词命中(trait/challenge)
    const traits=(nd.core_traits||[]).map(x=>x.toLowerCase());
    const challs=(nd.challenges||[]).map(x=>x.toLowerCase());
    const numWords=[...traits,...challs].filter(Boolean);
    const hit1=numWords.some(w=>w&&m6.includes(w)) || m6.includes(`life path ${num}`);
    // 三要素2: symbolic support(intentions命中)
    const intentWords=intentions.split(/[,/]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
    const hit2=intentWords.some(w=>w&&m6.includes(w));
    // 三要素3: 具体场景(非carry/wear万能句)—— 检查该水晶段是否有 hold/keep/wear/place + 具体场景词
    // 找该水晶的段落
    const stoneName=c.slug.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
    const segMatch=m6.match(new RegExp(stoneName+'[^]*?(?=###|<h3>|$)','i'));
    const seg=segMatch?segMatch[0]:'';
    const sceneWords=['hold','keep','wear','place','carry','before','when','try','minute','desk','nightstand','morning','bedside'];
    const hit3=sceneWords.some(w=>seg.toLowerCase().includes(w));
    // 通用句反例
    const genericHit=genericPatterns.some(p=>p.test(seg));
    crystalChecks.push({
      num,role,slug,name:stoneName,
      elem1_numberChallenge:hit1, elem2_symbolic:hit2, elem3_scene:hit3,
      generic_pattern:genericHit,
      pass: hit1&&hit2&&hit3&&!genericHit
    });
  }
}
const failedCrystals=crystalChecks.filter(c=>!c.pass);
fs.writeFileSync(path.join(QC,'02-crystal-binding.json'),JSON.stringify({
  total:crystalChecks.length,
  passed:crystalChecks.length-failedCrystals.length,
  failed:failedCrystals,
  verdict: failedCrystals.length===0 ? 'PASS' : 'REVIEW'
},null,2));

// ===== 关卡3: 确定论语言 =====
const determinismWords=[
  /\bdestined\b/i, /\bdestiny\b/i, /\balways\b/gi, /\bnever\b/gi, /\bguaranteed\b/gi,
  /\bwill heal\b/gi, /\bwill attract\b/gi, /\bwill bring\b/gi,
  /\bmeant to\b/gi, /\bborn to\b/gi, /\bfix\b/gi, /\bcure\b/gi,
  /\bsuperior\b/gi,
];
const detHits=[];
for(const art of idx.articles){
  const a=JSON.parse(fs.readFileSync(path.join(DIR,'articles',art.slug+'.json'),'utf8'));
  const full=a.content+' '+(a.rank_math_description||'');
  // 按句拆
  const sentences=full.split(/(?<=[.!?])\s+/);
  for(const s of sentences){
    const t=text(s);
    for(const p of determinismWords){
      const m=t.match(p);
      if(m){
        // 排除合规用法: "not a guarantee/guaranteed", "destiny number"(numerology术语), "nevertheless"
        const ctx=t;
        if(/not a guarantee|not guaranteed|no guarantee|destiny number|nevertheless|never rarer/.test(ctx)) continue;
        // "always" 在 "always valid/always 200"等也可能;这里content内"always"需人工
        detHits.push({num:art.slug, word:m[0], sentence:s.slice(0,200)});
      }
    }
  }
}
fs.writeFileSync(path.join(QC,'03-determinism.json'),JSON.stringify({
  total_hits:detHits.length,
  hits:detHits,
  note:'命中句子需人工逐条改写（非脚本替换）。已排除合规用法(not a guarantee/destiny number等)。',
  verdict: detHits.length===0 ? 'PASS' : 'MANUAL_REWRITE'
},null,2));

console.log('===== 三质检关卡完成 =====');
console.log(`关卡1 号码差异化: ${diff1.pairs.length===0&&rebalPairs.length===0?'PASS':'REVIEW'} (trait重叠对=${diff1.pairs.length}, M8相似对=${rebalPairs.length})`);
console.log(`关卡2 水晶绑定: ${failedCrystals.length===0?'PASS':'REVIEW'} (${crystalChecks.length-failedCrystals.length}/${crystalChecks.length} 通过)`);
console.log(`关卡3 确定论语言: ${detHits.length===0?'PASS':'MANUAL_REWRITE'} (${detHits.length} 处命中待人工)`);
if(failedCrystals.length) console.log('  关卡2失败:', failedCrystals.map(c=>`LP${c.num}/${c.role}`).join(', '));
