/**
 * Tarot 三质检关卡（框架 v2 §17A，二审前强制）
 * 关卡1: 牌差异化（M2画面独特 + M3逆位张力不雷同 + M7心理学概念差异）
 * 关卡2: 水晶绑定三要素（115条检查 + 反通用句模式匹配 + 四源依据）
 * 关卡3: 非占卜语言（批量搜禁词 will predict/destined/guaranteed/bad omen/curse，输出命中行供人工改写）
 * 关卡4: FAQ后半差异化（22牌同问题后半句相似度<40%）
 * 用法：node scripts/qc-checks.js
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'articles-index.json'), 'utf8'));
const KNOW = require('../../../07-互动工具/_shared/tarot-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const QC = path.join(DIR, '_qc');
fs.mkdirSync(QC, { recursive: true });

function text(s){ return (s||'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').toLowerCase(); }
function extractSection(content, h2Pattern){
  const m = content.match(new RegExp('<h2>'+h2Pattern+'[^]*?(?=<h2>|$)','i'));
  return m ? m[0] : '';
}

// ===== 关卡1: 牌差异化 =====
// 每牌 Rider-Waite 独有画面词
const cardImagery = {
  'the-fool': ['cliff','white rose','satchel','dog','edge'],
  'the-magician': ['four','table','cup','sword','wand','pentacle','infinity','as above'],
  'the-high-priestess': ['pillars','pomegranate','veil','moon','scroll','tora'],
  'the-empress': ['wheat','crown','stars','cushion','lush','sensu'],
  'the-emperor': ['throne','ram','beard','ankh','globe','armor','mountain'],
  'the-hierophant': ['pillar','vestment','kneel','initiate','triple crown','scepter'],
  'the-lovers': ['angel','wing','tree','serpent','sun','two figure'],
  'the-chariot': ['chariot','sphinx','canopy','wand','reins','oppos'],
  'strength': ['lion','jaw','infinity','wreath','flower','woman','gentle'],
  'the-hermit': ['lantern','staff','cloak','snowy','mountain','six-point','star'],
  'wheel-of-fortune': ['wheel','sphinx','snake','jackal','fixed sign','corner'],
  'justice': ['sword','scale','pillar','veil','crown','red robe'],
  'the-hanged-man': ['upside','ankle','tree','halo','inverted','suspend'],
  'death': ['skeleton','horse','banner','rose','fallen king','bishop','sun rising'],
  'temperance': ['wing','water','land','cup','flow','path','mountain','sunflower'],
  'the-devil': ['horn','chain','pillar','pentagram','loose'],
  'the-tower': ['lightning','tower','crown','fall','flame'],
  'the-star': ['pool','star','eight-point','water','vessel','bird','tree','naked'],
  'the-moon': ['moon','tower','crayfish','dog','wolf','path','ray'],
  'the-sun': ['sun','child','horse','sunflower','wall','banner'],
  'judgment': ['angel','trumpet','flag','cross','coffin','rise','figure'],
  'the-world': ['wreath','dance','sash','wand','fixed sign','corner'],
};
const diff1 = { missing_imagery: [], m3_similar: [], psych_missing: [] };
const m3Texts = {};
for (const art of idx.articles.filter(a => !a.is_hub)) {
  const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', art.slug + '.json'), 'utf8'));
  const num = String(KNOW.cards.find(c => c.slug === art.slug).number);
  // 1. 画面独特性（精确提取 "X Upright: Meaning" 段）
  const m2Match = a.content.match(new RegExp(art.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ' Upright: Meaning[^]*?(?=<h2>)', 'i'));
  const m2 = text(m2Match ? m2Match[0] : '');
  const imagery = cardImagery[art.slug] || [];
  const hits = imagery.filter(w => m2.includes(w));
  if (hits.length === 0) diff1.missing_imagery.push({ slug: art.slug, expected: imagery, m2_sample: m2.slice(0,200) });
  // 2. M3 逆位张力收集（精确提取 "X Reversed: The Shadow" 段）
  const m3Match = a.content.match(/Reversed: The Shadow Aspect[^]*?(?=<h2>)/i);
  const m3 = text(m3Match ? m3Match[0] : '');
  m3Texts[art.slug] = m3;
  // 3. M7 心理学概念（精确提取 "Through Three Lenses" 段）
  const m7Match = a.content.match(/Through Three Lenses[^]*?(?=<h2>)/i);
  const m7 = m7Match ? m7Match[0] : '';
  const psych = KNOW.cards.find(c => c.slug === art.slug).psychological_lens.toLowerCase();
  const psychKey = psych.split(/[()\/]/)[0].trim().split(/\s+/).slice(0,2).join(' ').slice(0,12);
  if (!text(m7).includes(psychKey)) {
    diff1.psych_missing.push({ slug: art.slug, expected: psych, searched: psychKey });
  }
}
// M3 两两相似度（除常见合规词外）
const stopM3 = ['reversed','shadow','card','aspect','invitation','reflect','energy','the','and','that','this','with','from','your','you','not','bad','omen','often','points','where','when','into','have','been','their','which','would','growth','edge'];
const m3Slugs = Object.keys(m3Texts);
for (let i = 0; i < m3Slugs.length; i++) {
  for (let j = i + 1; j < m3Slugs.length; j++) {
    const a = m3Texts[m3Slugs[i]].split(/\W+/).filter(w => w.length > 4 && !stopM3.includes(w));
    const b = m3Texts[m3Slugs[j]].split(/\W+/).filter(w => w.length > 4 && !stopM3.includes(w));
    const setA = new Set(a), setB = new Set(b);
    let inter = 0; setA.forEach(w => { if (setB.has(w)) inter++; });
    const uni = new Set([...setA, ...setB]).size || 1;
    const sim = (inter / uni) * 100;
    if (sim > 35) diff1.m3_similar.push({ a: m3Slugs[i], b: m3Slugs[j], sim: Math.round(sim) });
  }
}
fs.writeFileSync(path.join(QC, '01-differentiation.json'), JSON.stringify({
  missing_imagery: diff1.missing_imagery,
  missing_imagery_count: diff1.missing_imagery.length,
  m3_reversed_similar: diff1.m3_similar,
  m3_similar_count: diff1.m3_similar.length,
  psych_missing: diff1.psych_missing,
  psych_missing_count: diff1.psych_missing.length,
  verdict: (diff1.missing_imagery.length === 0 && diff1.m3_similar.length === 0 && diff1.psych_missing.length === 0) ? 'PASS' : 'REVIEW'
}, null, 2));

// ===== 关卡2: 水晶绑定三要素 =====
const crystalChecks = [];
const genericPatterns = [
  /supports .{0,25} energy\. it is a .{0,20} stone/i,
  /is a .{0,15} stone that helps with/i,
];
for (const art of idx.articles.filter(a => !a.is_hub)) {
  const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', art.slug + '.json'), 'utf8'));
  const card = KNOW.cards.find(c => c.slug === art.slug);
  const m4 = extractSection(a.content, 'Best Crystals for');
  const m4text = text(m4);
  for (const [role, info] of Object.entries(card.crystals)) {
    const slug = info.slug;
    const attr = ATTR[slug + '-meaning'] || {};
    const ov = attr.overview || {};
    const intentions = (ov.Intentions || '').toLowerCase();
    // 要素1: 牌具体依据（archetype/upright/reversed/画面词命中）
    const cardWords = [...card.upright_keywords, ...card.reversed_keywords, card.archetype.toLowerCase().split(/[\s\/]+/)[1] || ''].map(w => w.toLowerCase());
    const imageryHits = (cardImagery[art.slug] || []).filter(w => m4text.includes(w));
    const hit1 = cardWords.some(w => w && w.length > 3 && m4text.includes(w)) || imageryHits.length > 0 || m4text.includes(card.name.toLowerCase());
    // 要素2: symbolic support (intentions命中 + 同义词扩展) + source
    const synonyms = {
      'calm': ['calm','sooth','serene','peace','quiet','still','gentle'],
      'clarity': ['clarity','clear','clarif','lucid'],
      'protection': ['protect','shield','boundar','defend','guard'],
      'grounding': ['ground','root','stab','anchor','stead'],
      'love': ['love','heart','compassion','tender','devot'],
      'courage': ['courage','brave','confiden','fearless','bold'],
      'joy': ['joy','happy','glad','delight','warm','radiant'],
      'wisdom': ['wisdom','truth','insight','discern','know'],
      'intuition': ['intuit','inner know','gut','instinct','perceiv'],
      'abundance': ['abundan','plenty','prosper','opportun','growth'],
      'focus': ['focus','concentrat','atten','clarit','disciplin'],
      'strength': ['strength','power','fortitude','endurance','vital'],
      'balance': ['balance','harmon','equilibr','middle','integrat'],
      'transformation': ['transform','chang','shift','renew','rebirth','release'],
      'communication': ['communic','express','speak','truth','voice'],
      'self-worth': ['self-worth','self-esteem','worth','value','respect','confidence'],
      'confidence': ['confiden','assur','bold','self'],
      'motivation': ['motivat','drive','will','energ','action'],
      'creativity': ['creativ','imagin','express','art'],
      'release': ['release','let go','surrender','dissov','loosen','free'],
      'truth': ['truth','honest','sincer','authentic'],
    };
    const intentWords = intentions.split(/[,/]/).map(x => x.trim().toLowerCase()).filter(Boolean);
    const hit2 = intentWords.some(w => {
      if (!w) return false;
      if (m4text.includes(w)) return true;
      const syns = synonyms[w] || [];
      return syns.some(syn => m4text.includes(syn));
    });
    const hasSource = /soulfulnwild|astrosofa|labyrinthos|archetype裁决|矿物学|四源共识|goearthward/.test(info.source);
    // 要素3: 具体场景（非万能句）
    const stoneSeg = m4text.match(new RegExp(info.name.toLowerCase().replace(/\s+/g,'\\s+') + '[^]*?(?=' + Object.keys(card.crystals).map(r=>r).join('|') + '|$)','i'));
    const seg = stoneSeg ? stoneSeg[0].slice(0, 800) : m4text.slice(0, 800);
    const sceneWords = ['hold','wear','carry','place','before','when','try','morning','desk','nightstand','bedside','draw','card','ritual','meditat','journal','pocket','bracelet','pendant','reminder','jewelry','daily','touch','session','keep'];
    const hit3 = sceneWords.some(w => seg.includes(w));
    const genericHit = genericPatterns.some(p => p.test(seg));
    crystalChecks.push({
      card: art.slug, role, slug, name: info.name,
      elem1_cardSpecific: hit1, elem2_symbolic: hit2, elem2_hasSource: hasSource, elem3_scene: hit3,
      generic_pattern: genericHit,
      pass: hit1 && hit2 && hit3 && !genericHit && hasSource
    });
  }
}
const failedCrystals = crystalChecks.filter(c => !c.pass);
fs.writeFileSync(path.join(QC, '02-crystal-binding.json'), JSON.stringify({
  total: crystalChecks.length,
  passed: crystalChecks.length - failedCrystals.length,
  failed: failedCrystals,
  verdict: failedCrystals.length === 0 ? 'PASS' : 'REVIEW'
}, null, 2));

// ===== 关卡3: 非占卜语言 =====
const determinismWords = [
  /\bwill predict\b/gi, /\bpredicts\b/gi, /\bforetell/i, /\bdestined\b/i, /\bdestiny\b/i,
  /\bguaranteed\b/i, /\bbad omen\b/i, /\bcurse\b/i, /\bcursed\b/i, /\bevil\b/i,
  /\bbad luck\b/i, /\bbad card\b/i,
  /\bwill heal\b/gi, /\bwill cure\b/gi, /\bwill fix\b/gi,
  /\bwill attract\b/gi, /\bmeant to\b/gi, /\bborn to\b/gi,
];
const detHits = [];
for (const art of idx.articles) {
  const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', art.slug + '.json'), 'utf8'));
  const full = a.content + ' ' + (a.rank_math_description || '');
  const sentences = full.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const t = text(s);
    for (const p of determinismWords) {
      const m = t.match(p);
      if (m) {
        if (/not a bad omen|isn'?t a bad omen|not a curse|isn'?t a curse|not cursed|no card is inherently|not a forecast|not a worsening|not a verdict|not a condemnation|not a sign|destiny number|despite its|reputation|not evil|not a bad card|not a bad luck|fearsome image|fearsome reputation|almost never|not the absence|not a sentencing|not condemned|not a worsen|one of the most feared|reputation makes it|misunderstood|not a sign of|despite the.*image|rather than a bad omen|rather than a curse|shadow rather than|can tarot predict the future\?/i.test(t)) continue;
        detHits.push({ slug: art.slug, word: m[0], sentence: s.slice(0, 200) });
      }
    }
  }
}
fs.writeFileSync(path.join(QC, '03-determinism.json'), JSON.stringify({
  total_hits: detHits.length,
  hits: detHits,
  note: '命中句子需人工逐条改写。已排除合规用法(not a bad omen/no card is inherently/not a forecast等)。',
  verdict: detHits.length === 0 ? 'PASS' : 'MANUAL_REWRITE'
}, null, 2));

// ===== 关卡4: FAQ后半差异化 =====
// 提取 "Is {card} a bad card?" 和 "Can tarot predict the future?" 的答案后半（牌差异化部分）
const faqEnds = { bad_card: {}, predict: {} };
for (const art of idx.articles.filter(a => !a.is_hub)) {
  const a = JSON.parse(fs.readFileSync(path.join(DIR, 'articles', art.slug + '.json'), 'utf8'));
  const card = KNOW.cards.find(c => c.slug === art.slug);
  const badM = a.content.match(new RegExp('Is ' + card.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ' a bad card\\?</summary>[^]*?(?=</details>)', 'i'));
  if (badM) faqEnds.bad_card[art.slug] = text(badM[1]).slice(-300);
  const predM = a.content.match(/Can tarot predict the future\?<\/summary>[^]*?(?=<\/details>)/i);
  if (predM) faqEnds.predict[art.slug] = text(predM[1]).slice(-300);
}
const faqSimilar = { bad_card: [], predict: [] };
for (const q of ['bad_card', 'predict']) {
  const slugs = Object.keys(faqEnds[q]);
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = faqEnds[q][slugs[i]].split(/\W+/).filter(w => w.length > 4);
      const b = faqEnds[q][slugs[j]].split(/\W+/).filter(w => w.length > 4);
      const setA = new Set(a), setB = new Set(b);
      let inter = 0; setA.forEach(w => { if (setB.has(w)) inter++; });
      const uni = new Set([...setA, ...setB]).size || 1;
      const sim = (inter / uni) * 100;
      if (sim > 40) faqSimilar[q].push({ a: slugs[i], b: slugs[j], sim: Math.round(sim) });
    }
  }
}
fs.writeFileSync(path.join(QC, '04-faq-differentiation.json'), JSON.stringify({
  bad_card_similar_pairs: faqSimilar.bad_card,
  predict_similar_pairs: faqSimilar.predict,
  verdict: (faqSimilar.bad_card.length === 0 && faqSimilar.predict.length === 0) ? 'PASS' : 'REVIEW'
}, null, 2));

console.log('===== Tarot 三质检关卡 + FAQ差异化完成 =====');
const v1 = (diff1.missing_imagery.length === 0 && diff1.m3_similar.length === 0 && diff1.psych_missing.length === 0);
console.log(`关卡1 牌差异化: ${v1?'PASS':'REVIEW'} (画面缺失=${diff1.missing_imagery.length}, M3相似=${diff1.m3_similar.length}, 心理缺失=${diff1.psych_missing.length})`);
console.log(`关卡2 水晶绑定: ${failedCrystals.length===0?'PASS':'REVIEW'} (${crystalChecks.length-failedCrystals.length}/${crystalChecks.length} 通过)`);
console.log(`关卡3 非占卜语言: ${detHits.length===0?'PASS':'MANUAL_REWRITE'} (${detHits.length} 处命中待人工)`);
const v4 = (faqSimilar.bad_card.length === 0 && faqSimilar.predict.length === 0);
console.log(`关卡4 FAQ后半差异化: ${v4?'PASS':'REVIEW'} (bad_card相似对=${faqSimilar.bad_card.length}, predict相似对=${faqSimilar.predict.length})`);
if (failedCrystals.length) console.log('  关卡2失败:', failedCrystals.map(c => `${c.card}/${c.role}/${c.slug}(缺:${[!c.elem1_cardSpecific?'牌依据':'',!c.elem2_symbolic?'symbolic':'',!c.elem2_hasSource?'source':'',!c.elem3_scene?'scene':''].filter(Boolean).join(',')})`).slice(0,15).join('\n    '));
