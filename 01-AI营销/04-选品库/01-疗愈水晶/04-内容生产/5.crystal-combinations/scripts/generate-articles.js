/**
 * 水晶配对文章参数化骨架生成器
 * 从 selected-articles.json (207) + combinations-data-30.json (source) + crystal-attributes.json (矿物/safety)
 *   + crystal-stones-30.json (shop/img/meaning) 生成文章骨架 JSON
 *
 * 模块 1/2/3/7/8/9/10 参数化填充；模块 4/5/6 留占位 + source 字段（待 agent 差异化）
 * T3 冲突篇用 §六 柔和措辞
 *
 * 用法：
 *   node generate-articles.js --slug=amethyst-and-selenite          # 单篇
 *   node generate-articles.js --tier=T1_pairing --limit=1           # T1 前 1 篇
 *   node generate-articles.js --tier=T1_pairing                     # T1 全量
 *   node generate-articles.js                                       # 全 207 篇
 *
 * 输出：../articles/{slug}.json + 更新 ../articles-index.json
 */
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..');
const sel = JSON.parse(fs.readFileSync(path.join(DIR, 'selected-articles.json'), 'utf8'));
const combos = JSON.parse(fs.readFileSync(path.join(DIR, 'combinations-data-30.json'), 'utf8')).combinations;
const stones30 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/crystal-compatibility-checker/data/crystal-stones-30.json'), 'utf8')).stones;
const ATTR = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../07-互动工具/_shared/crystal-attributes.json'), 'utf8')).crystals;

// ---- args ----
const args = process.argv.slice(2);
const get = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : null; };
const slugArg = get('slug'), tierArg = get('tier'), limitArg = get('limit');

let list = sel.articles.slice();
if (slugArg) list = list.filter(a => a.slug === slugArg);
if (tierArg) list = list.filter(a => a.tier === tierArg);
if (limitArg) list = list.slice(0, +limitArg);

// ---- helpers ----
function stoneData(slug) {
  const s30 = stones30[slug] || {};
  const attr = ATTR[slug + '-meaning'] || {};
  return {
    slug, name: s30.name || slug,
    element: s30.element, chakras: s30.chakras || [], tags: s30.tags || [], zodiac: s30.zodiac || [],
    shop: s30.shop || ('/product-category/' + slug + '-crystals/'),
    img: s30.img || '', meaning: s30.meaning || ('/gemstone/' + slug + '-meaning/'),
    overview: attr.overview || {},
    mineral: attr.mineral || {},
    safety: attr.safety || {},
  };
}
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const list9 = arr => (arr || []).join(', ');
// 同 stone 的其它配对（Related 用，挑 3-5）
function relatedCombos(aSlug, bSlug, selfSlug) {
  const out = [];
  for (const a of sel.articles) {
    if (a.slug === selfSlug) continue;
    const c = combos[a.slug]; if (!c) continue;
    if (c.stones.includes(aSlug) || c.stones.includes(bSlug)) out.push(a);
    if (out.length >= 5) break;
  }
  return out.slice(0, 4);
}

// ---- 模块骨架 ----
function quickAnswer(A, B, shared) {
  const names = `${A.name} and ${B.name}`;
  if (shared.conflict) {
    // T3 A 类（conflict=true, score 25）柔和措辞
    return `<h2>Quick Answer</h2>\n<p>Traditionally, ${names} are usually used separately because their energies are believed to move in different directions. Compatibility score: ${shared.score}/100.</p>`;
  }
  if (shared.score < 40) {
    // T3 B 类（fire×水 相克, score 35）柔和措辞
    return `<h2>Quick Answer</h2>\n<p>This is a low-compatibility pairing in traditional crystal systems because fire and water intentions may feel scattered when used together. Compatibility score: ${shared.score}/100.</p>`;
  }
  // 标准篇
  const reasons = [];
  if (shared.pairHit) reasons.push('a time-honored pairing in crystal practice');
  if (shared.tags.length) reasons.push(`sharing ${list9(shared.tags)} intentions`);
  if (shared.chakras.length) reasons.push(`both resonating with the ${list9(shared.chakras)} chakra${shared.chakras.length > 1 ? 's' : ''}`);
  if (shared.elements[0] === shared.elements[1]) reasons.push(`both ${shared.elements[0]}-element stones`);
  const reason = reasons[0] || 'complementary energies';
  return `<h2>Quick Answer</h2>\n<p>Yes — ${names} can be worn together (compatibility score: ${shared.score}/100 — ${shared.band}). They're ${reason}${shared.bestFor[0] ? ', and many people pair them for ' + shared.bestFor[0].toLowerCase() : ''}.</p>`;
}

function aboutBlock(stone) {
  const o = stone.overview, m = stone.mineral, s = stone.safety;
  const chakra = o.Chakra || list9(stone.chakras.map(c => c === 'third-eye' ? 'third eye' : c));
  const color = (o.Color || '').toLowerCase();
  const intentions = (o.Intentions || '').toLowerCase();
  const bestFor = (o['Best for'] || '').toLowerCase();
  const forms = (o.Forms || '').toLowerCase();
  const hardRaw = m.Hardness || '';
  const hardNum = parseInt(hardRaw) || 7;
  const formula = m.Formula || '';
  const waterAvoid = !!(s.water && /avoid|soluble/i.test(s.water));
  const wearAdvice = hardNum >= 6.5
    ? `With a Mohs hardness of ${hardNum}, ${stone.name} is durable enough for everyday bracelets, pendants, and rings.`
    : `With a Mohs hardness of just ${hardNum}, ${stone.name} is relatively soft — it's often better as ${forms || 'a wand, plate, tower, or palm stone'} than as heavy everyday jewelry, and it can scratch or chip if knocked against harder stones.`;
  const careNote = waterAvoid ? ` ${stone.name} should be kept dry.` : (s.water ? ` ${stone.name} tolerates only brief contact with water.` : '');
  return `<h2>About ${stone.name}</h2>
<p>${color ? cap(color) + ' ' : ''}${stone.name} is a stone of the ${stone.element} element, traditionally associated with ${intentions || 'calm and clarity'}. In crystal practice it's often linked with the ${chakra || 'heart'} chakra${(chakra || '').includes(',') ? 's' : ''}, which makes it a natural fit for ${bestFor || 'meditation and daily wear'}. Common forms include ${forms || 'tumbled stones, bracelets, and pendants'}.</p>
<p>Mineralogically, ${stone.name} is ${formula || 'a natural mineral'}. ${wearAdvice}${careNote}</p>
<p><a href="${stone.meaning}">${stone.name} Meaning →</a> · Genuine ${stone.name}, ethically sourced — not dyed, not glass.</p>`;
}

function caringBlock(A, B) {
  const line = (s) => [s.water, s.sun, s.salt].filter(Boolean).join(' · ');
  return `<h2>Caring for ${A.name} + ${B.name}</h2>
<p>Each stone has its own care needs:</p>
<ul>
<li><strong>${A.name}:</strong> ${line(A.safety) || 'standard crystal care'}.</li>
<li><strong>${B.name}:</strong> ${line(B.safety) || 'standard crystal care'}.</li>
</ul>
<p>When in doubt, cleanse both with sound or moonlight — methods that are gentle across all stone types.</p>
<p><a href="/blog/how-to-cleanse-crystals/">How to cleanse your crystals →</a></p>`;
}

function shopBlock(A, B) {
  return `<h2>Shop ${A.name} + ${B.name}</h2>
<p>Every stone below is genuine, ethically sourced, and real — not dyed, not glass.</p>
<!-- wp:html -->
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:16px 0;">
<a href="${A.shop}" style="display:block;background:#2D6A4F;color:#fff;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-weight:600;">Shop ${A.name} →</a>
<a href="${B.shop}" style="display:block;background:#2D6A4F;color:#fff;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-weight:600;">Shop ${B.name} →</a>
</div>
<!-- /wp:html -->
<p><em>Bundle any 3 and save 20%.</em></p>`;
}

function faqBlock(A, B) {
  const sLine = s => [s.water, s.sun, s.salt].filter(Boolean).join(' · ');
  const sameElement = A.element === B.element;
  const softB = (parseInt(B.mineral.Hardness) || 7) < 5;
  const softA = (parseInt(A.mineral.Hardness) || 7) < 5;
  const qa = [
    { q: `Can I wear ${A.name} and ${B.name} together every day?`,
      a: `Many people do. If you're new to combining stones, start with a few hours and notice how the pairing feels before making it a daily habit.` },
    { q: `Can I wear ${A.name} and ${B.name} on the same hand?`,
      a: sameElement
        ? `Yes — both are ${A.element}-element stones, so they're traditionally considered comfortable together on the same wrist or in the same bracelet stack.`
        : `You can. Some wearers follow the tradition of keeping calming stones on the receiving (left) hand and active ones on the giving (right) hand, but it comes down to personal preference.` },
    { q: `Can I sleep with ${A.name} and ${B.name}?`,
      a: `You can keep them nearby while you sleep. ${A.name} is often placed on the wrist or nightstand, while ${B.name}${softB ? ` is best kept on the nightstand, since it's soft and can be damaged by pressure or moisture` : ` can rest on the nightstand or nearby`}.` },
    { q: `How do I cleanse ${A.name} and ${B.name}?`,
      a: `<strong>${A.name}:</strong> ${sLine(A.safety) || 'standard care'}. <strong>${B.name}:</strong> ${sLine(B.safety) || 'standard care'}. When in doubt, sound or moonlight cleansing is gentle across all stone types.` },
    { q: `Can I add a third stone to ${A.name} and ${B.name}?`,
      a: `Yes — Clear Quartz is a neutral amplifier that bridges most pairings without competing. Add one stone at a time so you can notice each shift.` },
  ];
  const body = qa.map(x => `<h3>${x.q}</h3>\n<p>${x.a}</p>`).join('\n\n');
  const schema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: qa.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a.replace(/<[^>]+>/g, '') } }))
  });
  return `<h2>Frequently Asked Questions</h2>\n\n${body}\n\n<script type="application/ld+json">\n${schema}\n</script>`;
}

function relatedBlock(A, B, selfSlug) {
  const rel = relatedCombos(A.slug, B.slug, selfSlug);
  const relLinks = rel.map(r => `<li><a href="/${r.slug}/">${r.stoneNames[0]} and ${r.stoneNames[1]}</a></li>`).join('');
  return `<h2>Related</h2>
<ul>
<li><a href="${A.meaning}">${A.name} Meaning</a></li>
<li><a href="${B.meaning}">${B.name} Meaning</a></li>
<li><a href="/blog/how-to-cleanse-crystals/">How to Cleanse Crystals</a></li>
${relLinks}
<li><a href="/tools/crystal-compatibility-checker/">Crystal Compatibility Checker</a></li>
</ul>`;
}

// ---- 组装一篇 ----
function buildArticle(meta) {
  const combo = combos[meta.slug];
  const [sa, sb] = combo.stones;
  const A = stoneData(sa), B = stoneData(sb);
  const shared = {
    tags: combo.sharedTags, chakras: combo.sharedChakras, elements: combo.elements,
    pairHit: combo.pairHit, conflict: combo.conflict, bestFor: combo.bestFor,
    score: combo.score, band: combo.band,
  };
  const isT3 = meta.tier === 'T3_conflict';

  const title = `${A.name} and ${B.name} Together: Benefits, Meaning + How to Use`;
  const focusKw = `${A.name.toLowerCase()} and ${B.name.toLowerCase()}`;
  const excerpt = isT3 && shared.conflict
    ? `${A.name} and ${B.name} compatibility (${shared.score}/100). Traditionally used separately — why, and how to wear each on its own.`
    : `${A.name} and ${B.name} together score ${shared.score}/100 for compatibility. Learn how to wear them and their traditional use for ${shared.tags.slice(0, 3).join(', ')} — benefits, meaning, and care.`;

  // content：模块 1/2/3/7/8/9/10 参数化 + 4/5/6 占位
  const content = [
    `<h1>${A.name} and ${B.name} Together: Benefits, Meaning + How to Use</h1>`,
    quickAnswer(A, B, shared),
    `<!-- AGENT_M2: About ${A.name} — 100-150词自然段（颜色/元素/chakra/传统用途 + 矿物 Formula/Hardness + safety + 形态：硬度≥6.5 适合日常首饰，<6.5 适合 wand/plate/tower）。数据: element=${A.element}, chakras=[${A.chakras}], color="${A.overview.Color || ''}", intentions="${A.overview.Intentions || ''}", bestFor="${A.overview['Best for'] || ''}", forms="${A.overview.Forms || ''}", formula="${A.mineral.Formula || ''}", hardness="${A.mineral.Hardness || ''}", safety=${JSON.stringify(A.safety)} -->`,
    `<!-- AGENT_M3: About ${B.name} — 同 M2 结构（100-150词自然段）。数据: element=${B.element}, chakras=[${B.chakras}], color="${B.overview.Color || ''}", intentions="${B.overview.Intentions || ''}", bestFor="${B.overview['Best for'] || ''}", forms="${B.overview.Forms || ''}", formula="${B.mineral.Formula || ''}", hardness="${B.mineral.Hardness || ''}", safety=${JSON.stringify(B.safety)} -->`,
    `<!-- AGENT_M4: Can You Wear ${A.name} and ${B.name} Together? — 三视角 200-250 词（科学元素/矿物+灵性脉轮/能量+心理 intention/仪式）。不绝对否定。source: shared=${JSON.stringify({tags:shared.tags,chakras:shared.chakras,elements:shared.elements,pairHit:shared.pairHit,conflict:shared.conflict})} -->`,
    `<!-- AGENT_M5: Benefits of ${A.name} + ${B.name} — ${isT3 ? '改为 What Happens If You Combine Them（T3 见框架 §六）' : '5-7 个好处，每个 60-80 词，每个必标 source ∈ sharedTags/sharedChakras/element/pairHit'}。可用 source: tags=[${shared.tags}] chakras=[${shared.chakras}] elements=[${shared.elements}] pairHit=${shared.pairHit} -->`,
    `<!-- AGENT_M6: How to Use ${A.name} and ${B.name} Together — 4 种方式（Wear/Meditate/Grid/Place）各 60-80 词${isT3 ? '（T3 改 How to Use Them Separately）' : ''}。长尾埋词：can I wear on same hand / bracelet / for [calm/sleep/love] -->`,
    caringBlock(A, B),
    shopBlock(A, B),
    faqBlock(A, B),
    relatedBlock(A, B, meta.slug),
    `<p><em>Crystal meanings are shared for entertainment and spiritual practice. They're not a substitute for professional medical or mental-health care.</em></p>`,
  ].join('\n\n');

  return {
    title, slug: meta.slug, url: '/' + meta.slug + '/',
    tier: meta.tier, score: meta.score, band: meta.band,
    stoneNames: [A.name, B.name],
    excerpt,
    rank_math_title: `${A.name} and ${B.name} Together: Benefits + How to Use`,
    rank_math_description: isT3 && shared.conflict
      ? `${A.name} and ${B.name} (${shared.score}/100) — traditionally used separately. Why, and how to wear each on its own.`
      : `${A.name} and ${B.name} score ${shared.score}/100 compatibility — benefits, how to wear, and care for the pair.`,
    rank_math_focus_keyword: focusKw,
    shared,  // agent 写 4/5/6 的 source 依据
    stones: { a: A, b: B },
    content,
    modules: { m4_agent: null, m5_agent: null, m6_agent: null },  // 待 agent 填
    images: { featured: null, pair: null, how_to_use: null },  // 待生图
  };
}

// ---- 跑 ----
const outDir = path.join(DIR, 'articles');
fs.mkdirSync(outDir, { recursive: true });

const index = [];
for (const meta of list) {
  const art = buildArticle(meta);
  fs.writeFileSync(path.join(outDir, meta.slug + '.json'), JSON.stringify(art, null, 2), 'utf8');
  index.push({ slug: meta.slug, title: art.title, tier: meta.tier, score: meta.score, has_agent: false });
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: list.length, articles: index }, null, 2), 'utf8');

console.log(`✅ 生成 ${list.length} 篇骨架 → articles/`);
console.log(`   ${slugArg ? 'slug=' + slugArg : tierArg ? 'tier=' + tierArg : '全量'}${limitArg ? ' limit=' + limitArg : ''}`);
const sample = list[0];
if (sample) console.log(`   样例: ${sample.slug} (${sample.tier}, ${sample.score})`);
console.log(`\n下一步: agent 填模块 4/5/6（见每篇 content 里 AGENT_M4/M5/M6 注释 + shared 字段）`);
