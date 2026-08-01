/**
 * 为 78 组配对生成参数化文章模板（模块 1/2/3/10/11/12/14/15/16）
 * 模块 4-9（Love/Friendship/Sex/Marriage/Communication/Challenges）留占位，待 agent 填
 * 模块 13（Famous Couples）留占位
 *
 * 输出：../article-templates.json（78 组）
 * 用法：node generate-article-templates.js
 */
const fs = require('fs');
const path = require('path');

const PAIRING_FILE = path.resolve(__dirname, '../pairing-data.json');
const OUTPUT_FILE = path.resolve(__dirname, '../article-templates.json');

const pd = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf8'));

// ─── 星座基础数据 ───
const ZD = {
  Aries:       { dates:'March 21 – April 19',     element:'Fire',  quality:'Cardinal', ruler:'Mars',             symbol:'Ram' },
  Taurus:      { dates:'April 20 – May 20',       element:'Earth', quality:'Fixed',    ruler:'Venus',            symbol:'Bull' },
  Gemini:      { dates:'May 21 – June 20',        element:'Air',   quality:'Mutable',  ruler:'Mercury',          symbol:'Twins' },
  Cancer:      { dates:'June 21 – July 22',       element:'Water', quality:'Cardinal', ruler:'Moon',             symbol:'Crab' },
  Leo:         { dates:'July 23 – August 22',     element:'Fire',  quality:'Fixed',    ruler:'Sun',              symbol:'Lion' },
  Virgo:       { dates:'August 23 – September 22',element:'Earth', quality:'Mutable',  ruler:'Mercury',          symbol:'Virgin' },
  Libra:       { dates:'September 23 – October 22',element:'Air',  quality:'Cardinal', ruler:'Venus',            symbol:'Scales' },
  Scorpio:     { dates:'October 23 – November 21',element:'Water', quality:'Fixed',    ruler:'Mars/Pluto',       symbol:'Scorpion' },
  Sagittarius: { dates:'November 22 – December 21',element:'Fire', quality:'Mutable',  ruler:'Jupiter',          symbol:'Archer' },
  Capricorn:   { dates:'December 22 – January 19',element:'Earth', quality:'Cardinal', ruler:'Saturn',           symbol:'Goat' },
  Aquarius:    { dates:'January 20 – February 18',element:'Air',   quality:'Fixed',    ruler:'Saturn/Uranus',    symbol:'Water Bearer' },
  Pisces:      { dates:'February 19 – March 20',  element:'Water', quality:'Mutable',  ruler:'Jupiter/Neptune',  symbol:'Fish' },
};
const ORDER = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const slug = s => s.toLowerCase();
const cap = s => s.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');

// ─── 模块模板 ───

function mod1(p) {
  const [a,b] = p.signs;
  return `<h2>Quick Answer</h2>
<p><strong>Quick Answer:</strong> ${a} and ${b} share a ${p.phase} connection (${p.score}/100 — ${p.band}). ${p.headline}. ${p.dynamics}. This guide covers all five dimensions of the relationship — love, friendship, sexual chemistry, marriage, and communication — plus the best crystal pair for this couple.</p>`;
}

function mod2(p) {
  const [a,b] = p.signs;
  const za = ZD[a], zb = ZD[b];
  const card = (name, z) => `<div style="flex:1;min-width:200px;background:#F8F8F8;border:1px solid #EEE;border-radius:12px;padding:20px;margin:8px;">
<h3 style="margin:0 0 10px;color:#1A1A2E;">${name}</h3>
<p style="font-size:14px;color:#666;line-height:1.8;margin:0;">
<strong>Dates:</strong> ${z.dates}<br>
<strong>Element:</strong> ${z.element}<br>
<strong>Quality:</strong> ${z.quality}<br>
<strong>Ruling Planet:</strong> ${z.ruler}<br>
<strong>Symbol:</strong> ${z.symbol}
</p>
<p style="margin:10px 0 0;"><a href="/zodiac/${slug(name)}/" style="color:#2D6A4F;">Learn more about ${name} →</a></p>
</div>`;
  return `<h2>${a} and ${b}: The Basics</h2>
<div style="display:flex;flex-wrap:wrap;">
${card(a, za)}
${card(b, zb)}
</div>`;
}

function mod3(p) {
  const [a,b] = p.signs;
  const s = p.scores;
  const bar = (label, val) => `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:2px;"><span>${label}</span><span style="font-weight:600;color:${val>=70?'#2D6A4F':val>=50?'#A66A43':'#B5715A'};">${val}/100</span></div><div style="background:#EEE;border-radius:5px;height:6px;"><div style="background:${val>=70?'#2D6A4F':val>=50?'#A66A43':'#B5715A'};height:100%;width:${val}%;border-radius:5px;"></div></div></div>`;
  return `<h2>${a} and ${b}: Compatibility Overview</h2>
<p>${p.dynamics}. ${p.description}</p>
<div style="max-width:400px;margin:20px 0;">
${bar('Love & Romance', s.love)}
${bar('Friendship', s.friendship)}
${bar('Sexual Chemistry', s.sexual)}
${bar('Marriage & Long-term', s.marriage)}
${bar('Communication', s.communication)}
${bar('Overall', p.score)}
</div>`;
}

function mod10(p) {
  const [a,b] = p.signs;
  const c = p.crystals;
  const card = (stone, role) => `<div class="crystal-card" style="flex:1;min-width:200px;background:#fff;border:1px solid #EEE;border-radius:12px;padding:20px;text-align:center;">
<h3 style="color:#1B4332;margin:0 0 8px;">${cap(stone)}</h3>
<p style="font-size:13px;color:#888;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.05em;">${role}</p>
<a href="/gemstone/${stone}-meaning/" style="color:#2D6A4F;font-size:14px;">${cap(stone)} Meaning →</a>
</div>`;
  return `<h2>Best Crystal Pair for ${a} and ${b}</h2>
<p>For this ${p.phase.toLowerCase()} pairing, three stones work together — one for each partner and a harmonizer that bridges their energies.</p>
<div class="crystal-pair" style="display:flex;flex-wrap:wrap;gap:12px;margin:16px 0;">
${card(c.signA, 'For ' + a)}
${card(c.signB, 'For ' + b)}
${card(c.harmony, 'Harmonizer')}
</div>`;
}

function mod11(p) {
  const [a,b] = p.signs;
  const c = p.crystals;
  return `<h2>How to Use the Crystal Pair</h2>
<p>Three ways ${a} and ${b} can work with ${cap(c.signA)}, ${cap(c.signB)}, and ${cap(c.harmony)} together:</p>
<ul>
<li><strong>Wear them as a couple.</strong> One partner carries ${cap(c.signA)}, the other carries ${cap(c.signB)}. The ${cap(c.harmony)} stays in a shared space — a bedroom, a desk — as the bridge between both energies.</li>
<li><strong>Meditate together.</strong> Hold hands with one stone each (${cap(c.signA)} for the ${a} partner, ${cap(c.signB)} for the ${b} partner) and place the ${cap(c.harmony)} between you. Five minutes is enough to align your intentions.</li>
<li><strong>Create a relationship grid.</strong> Place all three stones in a triangle in a shared space. ${cap(c.signA)} at one point (the ${a} energy), ${cap(c.signB)} at another (the ${b} energy), and ${cap(c.harmony)} at the apex (the relationship's intention).</li>
</ul>`;
}

function mod12(p) {
  const [a,b] = p.signs;
  return `<h2>Shop ${a} + ${b} Couple Crystals</h2>
<p>Every stone below is genuine, ethically sourced, and real — not dyed, not glass.</p>
<!-- wp:wd/products {"categoriesIds":"1492,1515,1514,1496,1516,1489,1509","orderby":"rand","columns":3,"items_per_page":"6","product_hover":"standard","stretch_product":true} /-->`;
}

function mod13_placeholder(p) {
  return `<!-- MODULE_13_FAMOUS:${p.slug} -->
<p><em>Famous ${p.signs[0]} and ${p.signs[1]} couples coming soon.</em></p>`;
}

function mod14(p) {
  const [a,b] = p.signs;
  const sa = slug(a), sb = slug(b);
  // 生成 [A] 与其他 11 星座 + [B] 与其他 11 星座的速查表
  const row = (sign, partner) => {
    const s1 = slug(sign), s2 = slug(partner);
    const key = ORDER.indexOf(s1) <= ORDER.indexOf(s2) ? `${s1}-${s2}` : `${s2}-${s1}`;
    const data = pd.pairs[key];
    if (!data) return '';
    const tier = data.score >= 80 ? 'High' : data.score >= 55 ? 'Medium' : 'Low';
    const color = data.score >= 80 ? '#2D6A4F' : data.score >= 55 ? '#A66A43' : '#B5715A';
    return `<tr><td style="padding:6px 12px;"><a href="/zodiac-compatibility/${key}/" style="color:#2D6A4F;text-decoration:none;">${partner}</a></td><td style="padding:6px 12px;color:${color};font-weight:600;">${tier} (${data.score})</td></tr>`;
  };
  const tableA = ORDER.filter(s => s !== a).map(s => row(a, s)).join('');
  const tableB = ORDER.filter(s => s !== b).map(s => row(b, s)).join('');
  return `<h2>${a} & ${b} Compatibility With Other Signs</h2>
<div style="display:flex;flex-wrap:wrap;gap:20px;">
<div style="flex:1;min-width:250px;">
<h3 style="color:#1A1A2E;">${a} Compatibility</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;"><tbody>
${tableA}
</tbody></table>
</div>
<div style="flex:1;min-width:250px;">
<h3 style="color:#1A1A2E;">${b} Compatibility</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;"><tbody>
${tableB}
</tbody></table>
</div>
</div>`;
}

function mod15(p) {
  const [a,b] = p.signs;
  const kw = `${slug(a)} ${slug(b)} compatibility`;
  return `<h2>Frequently Asked Questions</h2>
<h3>Are ${a} and ${b} compatible?</h3>
<p>${a} and ${b} share a ${p.phase} connection with an overall compatibility of ${p.score}/100 (${p.band}). ${p.headline}. ${p.dynamics}.</p>
<h3>What is the best crystal for ${a} and ${b} together?</h3>
<p>${cap(p.crystals.harmony)} is the harmonizer for this couple — it bridges the ${p.elements[0]} and ${p.elements[1]} energies. ${cap(p.crystals.signA)} supports the ${a} partner and ${cap(p.crystals.signB)} supports the ${b} partner.</p>
<h3>What is the biggest challenge for ${a} and ${b}?</h3>
<p>${p.coreChallenge}</p>
<h3>What makes ${a} and ${b} work well together?</h3>
<p>${p.synergy}</p>
<h3>How do ${a} and ${b} communicate?</h3>
<p>${p.communicationPattern}</p>`;
}

function mod16(p) {
  const [a,b] = p.signs;
  const sa = slug(a), sb = slug(b);
  return `<h2>Related</h2>
<ul>
<li><a href="/${sa}-crystals/">Best Crystals for ${a}</a></li>
<li><a href="/${sb}-crystals/">Best Crystals for ${b}</a></li>
<li><a href="/zodiac/${sa}/">${a} Zodiac Sign Guide</a></li>
<li><a href="/zodiac/${sb}/">${b} Zodiac Sign Guide</a></li>
<li><a href="/category/zodiac-compatibility/">All Zodiac Compatibility Guides</a></li>
<li><a href="/tools/crystal-compatibility-checker/">Crystal Compatibility Checker</a></li>
</ul>
<p><em>Crystal meanings are shared for entertainment and spiritual practice. They're not a substitute for professional medical or mental-health care.</em></p>`;
}

// ─── 组装文章 ───
const templates = {};
for (const [slugKey, p] of Object.entries(pd.pairs)) {
  const [a, b] = p.signs;
  const kw = `${slug(a)} and ${slug(b)} compatibility`;
  templates[slugKey] = {
    title: `${a} and ${b} Compatibility: Love, Friendship + Best Crystal Pair`,
    slug: slugKey,
    excerpt: `${a} and ${b} compatibility (${p.score}/100 — ${p.band}). ${p.headline}. Love, friendship, sexual chemistry, marriage, communication + the best crystal pair for this couple.`,
    rank_math_title: `${a} and ${b} Compatibility: Love, Friendship + Crystal Pair`,
    rank_math_description: `${a} + ${b} compatibility guide: ${p.score}/100 (${p.band}). 5 dimensions — love, friendship, sex, marriage, communication. Plus the best crystal pair for this couple.`,
    rank_math_focus_keyword: kw,
    // content 由模块拼接，模块 4-9 留占位
    content: [
      mod1(p),
      mod2(p),
      mod3(p),
      `<!-- MODULES_4_9:${slugKey} -->`,  // Agent 填：Love/Friendship/Sex/Marriage/Communication/Challenges
      mod10(p),
      mod11(p),
      mod12(p),
      `<h2>Famous ${a} and ${b} Couples</h2>`,
      mod13_placeholder(p),
      mod14(p),
      mod15(p),
      mod16(p),
    ].join('\n\n'),
  };
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(templates, null, 2), 'utf8');
console.log(`✅ 生成 ${Object.keys(templates).length} 组文章模板 → ${OUTPUT_FILE}`);
console.log(`   含模块 1/2/3/10/11/12/14/15/16（参数化）`);
console.log(`   模块 4-9 留占位，待 agent 填`);
