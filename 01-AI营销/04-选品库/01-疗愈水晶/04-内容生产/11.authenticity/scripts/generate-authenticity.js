/**
 * 真伪鉴别骨架生成器（A1-A4，独立于 How-to）
 * 读 configs/a{N}.json + identification-methods(10法) + stone-cases(石种) → 7 模块骨架 + 矿物数据表 + Buying Guide
 * 输出 articles/{slug}.json，结构与 How-to 同构（content/images/faq_schema 等），复用 fill/validate/upload/generate-images
 *
 * 7 模块（框架 §2）：
 *   M1 Quick Answer（速答+3可靠测试 Featured Snippet bait）
 *   M2 Why Fake Crystals Are So Common（市场背景）
 *   M3 Identification Methods（10法库三件套：原理/对比表/局限性）+ crystal vs glass 段（A1）
 *   M4 Stone-Specific Tests（A2/A3 单石深挖 / A4 集合每石一表 / A1 案例子集）
 *   M5 When to Use Professional Tools（Mohs计/折射仪/UV灯/loupe）
 *   M6 FAQ + Gentle Note（三层分层）
 *   M7 Buying Guide CTA（5条清单→goearthward承诺→Shop）
 *
 * E-E-A-T 强化：作者署名 byline + dateModified + 权威引用 + 矿物数据精确值 + 诚实局限性
 *
 * 用法：node generate-authenticity.js --slug=a1-tell-if-crystal-is-real
 *      node generate-authenticity.js  (跑全部 a*.json)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const METHODS = require('./identification-methods').methods;
const STONES = require('./stone-cases').stones;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const configDir = path.join(DIR, 'configs');
const cfgFiles = slugArg
  ? (fs.existsSync(path.join(configDir, slugArg + '.json'))
      ? [slugArg + '.json']
      : fs.readdirSync(configDir).filter(f => f.endsWith('.json') && JSON.parse(fs.readFileSync(path.join(configDir, f), 'utf8')).slug === slugArg))
  : fs.readdirSync(configDir).filter(f => f.startsWith('a') && f.endsWith('.json'));

// 矿物数据表生成（M3 末或 M4 头，从 STONES 读）
function mineralTable(stoneKeys) {
  const rows = stoneKeys.map(k => {
    const s = STONES[k];
    if (!s) return '';
    const m = s.mineral;
    return `<tr><td><strong>${s.name}</strong></td><td>${m.mohs}</td><td>${m.specific_gravity}</td><td>${m.refractive_index}</td><td>${m.formula}</td><td>${s.fake_types[0]}</td></tr>`;
  }).filter(Boolean).join('\n');
  return `<table>
<thead><tr><th>Stone</th><th>Mohs hardness</th><th>Specific gravity</th><th>Refractive index</th><th>Formula</th><th>Common imitation</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p><em>Mineral data: GIA Gem Reference Guide, mindat.org, USGS Mineral Database. SG = specific gravity; RI = refractive index.</em></p>`;
}

// 单法卡片（三件套：原理/对比表/局限性）
function methodCard(methodKey) {
  const m = METHODS[methodKey];
  if (!m) return '';
  const tableRows = m.comparison_table.map(r => `<tr><td>${r.signal}</td><td>${r.genuine}</td><td>${r.fake}</td></tr>`).join('\n');
  const steps = m.how_to.map(s => `<li>${s}</li>`).join('\n');
  return `<h3>${m.icon} Test ${m.num}: ${m.name}</h3>
<p><strong>The science behind it:</strong> ${m.science}</p>
<p><strong>Real vs fake at a glance:</strong></p>
<table>
<thead><tr><th>Signal</th><th>Genuine</th><th>Fake (glass / plastic)</th></tr></thead>
<tbody>
${tableRows}
</tbody>
</table>
<p><strong>How to do it:</strong></p>
<ol>
${steps}
</ol>
<p><strong>Limitations:</strong> ${m.limitations}</p>
<p><strong>Best stones for this test:</strong> ${m.best_for}</p>
<p><em>Source: ${m.source_citation}.</em></p>`;
}

// 石种案例卡片（M4，A2/A3 深挖 / A4 集合 / A1 子集）
function stoneCaseCard(stoneKey, deepDive) {
  const s = STONES[stoneKey];
  if (!s) return '';
  const m = s.mineral;
  const keyTests = s.key_tests.map((t, i) => `<li>${t}</li>`).join('\n');
  const fakeList = s.fake_types.map(f => `<li>${f}</li>`).join('\n');
  const heading = deepDive ? `${s.name}: Quick Mineral Profile` : `${s.name}`;
  return `<h3>${heading}</h3>
<p><strong>Mineral data:</strong> Formula ${m.formula} · Mohs ${m.mohs} · Specific gravity ${m.specific_gravity} · Refractive index ${m.refractive_index} · Color cause: ${m.color_cause}. Primary origins: ${m.origins}.</p>
<p><strong>What gets faked:</strong></p>
<ul>
${fakeList}
</ul>
<p><strong>How to tell ${s.name} is real — the key tests:</strong></p>
<ol>
${keyTests}
</ol>
<p><strong>Price sanity check:</strong> ${s.price_range}</p>
<p><em>Source: ${s.source_citation}.</em></p>
<p><a href="${s.meaning_url}">Read the full ${s.name} meaning</a> · <a href="${s.shop_category}">Shop ${s.name}</a></p>`;
}

let made = 0; const index = [];
let existing = { total: 0, articles: [] };
const idxPath = path.join(DIR, 'articles-index.json');
if (fs.existsSync(idxPath)) existing = JSON.parse(fs.readFileSync(idxPath, 'utf8'));

for (const cfgFile of cfgFiles) {
  const cfgPath = path.join(configDir, cfgFile);
  if (!fs.existsSync(cfgPath)) { console.log('⚠️ config not found:', cfgFile); continue; }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const methodKeys = cfg.methods_used;
  const stoneKeys = cfg.stone_cases || [];

  // ==================== M1 Quick Answer ====================
  const m1 = `<h2>Quick Answer: How to Tell If a ${cfg.subject_label} Is Real</h2>
<p>{{AI_M1_INTRO}}</p>
<p>The three most reliable at-home tests to start with:</p>
<ul>
<li>{{AI_M1_TEST_TEMPERATURE}}</li>
<li>{{AI_M1_TEST_HARDNESS_OR_BUBBLES}}</li>
<li>{{AI_M1_TEST_PRICE_NAMING}}</li>
</ul>
<p><em>No single home test is 100% conclusive — these tests work together. For valuable specimens, a gemological lab report is the gold standard.</em></p>`;

  // ==================== M2 Why Fakes Exist ====================
  const m2 = `<h2>Why Fake Crystals Are So Common</h2>
<p>{{AI_M2_PARA1_MARKET}}</p>
<p>{{AI_M2_PARA2_FAKE_TYPES}}</p>
<p>{{AI_M2_PARA3_WHY_HARD}}</p>`;

  // ==================== M3 Identification Methods ====================
  let m3 = `<h2>${cfg.m3_heading}</h2>
<p>{{AI_M3_METHODS_INTRO}}</p>`;
  for (const mk of methodKeys) {
    m3 += methodCard(mk);
  }

  // crystal vs glass 段（A1 专属，吃 1600 长尾）
  if (cfg.crystal_vs_glass_section) {
    m3 += `<h2>Crystal vs Glass: What's the Difference?</h2>
<p>{{AI_M3_CVG_PARA1_NAMING_TRAP}}</p>
<p>{{AI_M3_CVG_PARA2_COMPOSITION}}</p>
<p>{{AI_M3_CVG_PARA3_FIVE_TESTS}}</p>
<p>{{AI_M3_CVG_PARA4_WHY_GLASS_IMPERSONATES}}</p>`;
  }

  // 矿物数据表（A1/A4 在 M3 末，A2/A3 在 M4 头）
  if (cfg.mineral_table_position === 'm3' && stoneKeys.length) {
    m3 += `<h3>Mineral Data Reference (Mohs Hardness, Specific Gravity, Refractive Index)</h3>
<p><em>The numbers behind the tests — these are fixed mineralogical facts, not opinion. Use them to verify what the home tests suggest.</em></p>
${mineralTable(stoneKeys)}`;
  }

  // ==================== M4 Stone Case Studies ====================
  let m4 = `<h2>${cfg.m4_heading}</h2>
<p>{{AI_M4_INTRO}}</p>`;
  // A2/A3 单石深挖（deepDive=true，一张完整深挖）；A4 集合每石一卡；A1 案例子集
  const deepDive = cfg.m4_mode === 'single_deep_dive';
  if (cfg.mineral_table_position === 'm4' && stoneKeys.length && !deepDive) {
    m4 += mineralTable(stoneKeys);
  }
  for (const sk of stoneKeys) {
    m4 += stoneCaseCard(sk, deepDive);
  }
  // 真伪系列互链（A2/A3/A4 顶部链 A1 旗舰）
  if (cfg.series_links && cfg.series_links.to_flagship) {
    m4 += `<p><em>For the full 10-test overview across all crystal types, start with <a href="${cfg.series_links.to_flagship.url}">${cfg.series_links.to_flagship.anchor}</a>.</em></p>`;
  }
  if (cfg.series_links && cfg.series_links.to_hub) {
    m4 += `<p><em>See the full list: <a href="${cfg.series_links.to_hub.url}">${cfg.series_links.to_hub.anchor}</a>.</em></p>`;
  }

  // ==================== M5 Professional Tools ====================
  const m5 = `<h2>When to Use Professional Tools</h2>
<p>{{AI_M5_INTRO}}</p>
<ul>
<li>{{AI_M5_TOOL_LOUPE}}</li>
<li>{{AI_M5_TOOL_MOHS_KIT}}</li>
<li>{{AI_M5_TOOL_UV_LIGHT}}</li>
<li>{{AI_M5_TOOL_REFRACTOMETER}}</li>
<li>{{AI_M5_TOOL_LAB_CERT}}</li>
</ul>
<p><em>For high-value specimens (jadeite, imperial-grade amethyst, moldavite, large geodes), a gemological laboratory certificate is the only definitive answer — home tests narrow the odds, they do not replace a professional report.</em></p>`;

  // ==================== M6 FAQ + Gentle Note ====================
  const faqData = [
    ...cfg.faq_picks.intent.map(q => ({ q, cat: 'intent' })),
    ...cfg.faq_picks.conversion.map(q => ({ q, cat: 'conversion' })),
    ...cfg.faq_picks.trust.map(q => ({ q, cat: 'trust' })),
    ...(cfg.faq_picks.selective || []).map(q => ({ q, cat: 'selective' }))
  ];
  const faqHtml = faqData.map((f, i) => `<h3>${f.q}</h3>\n<p>{{AI_FAQ_${i}}}</p>`).join('\n');
  const gentleNote = `<p class="gentle-note"><em>${cfg.compliance.gentle_note}</em></p>`;
  const m6 = `<h2>Frequently Asked Questions About Real vs Fake ${cfg.subject_label}</h2>
${faqHtml}
${gentleNote}`;

  // ==================== M7 Buying Guide CTA ====================
  const bg = cfg.buying_guide;
  const m7 = `<h2>How to Buy Genuine Crystals (Without Getting Fooled)</h2>
<p>{{AI_M7_INTRO}}</p>
<h3>Five Signs of a Reputable Seller</h3>
<ul>
<li>{{AI_M7_CHECK_1_NAMING}}</li>
<li>{{AI_M7_CHECK_2_ORIGIN}}</li>
<li>{{AI_M7_CHECK_3_MINERAL_DATA}}</li>
<li>{{AI_M7_CHECK_4_RETURN_POLICY}}</li>
<li>{{AI_M7_CHECK_5_REAL_PHOTOS}}</li>
</ul>
<h3>How Earthward Approaches This</h3>
<p>{{AI_M7_EARTHWARD_PROMISE}}</p>
<p><a href="${bg.shop_cta_target}"><strong>${bg.shop_cta_anchor}</strong></a></p>
<p><em>${cfg.compliance.brand_tagline}</em></p>`;

  // ---- 作者署名 byline（E-E-A-T）----
  const author = cfg.author;
  const byline = `<p class="article-byline"><em>By ${author.name} · ${author.byline} · Updated ${cfg.date_modified} · Reviewed by ${author.reviewed_by}</em></p>`;

  // ---- 组装 ----
  const intro = `${byline}
<p>{{AI_INTRODUCTION}}</p>`;
  const content = [intro, m1, m2, m3, m4, m5, m6, m7].join('\n\n');

  const faqSchema = faqData.map((f, i) => ({ question: f.q, answer_placeholder: `{{AI_FAQ_${i}}}`, category: f.cat }));

  // HowTo schema（真伪鉴别 = 鉴别流程步骤）
  const howtoSteps = cfg.schema.howto_steps || [
    { step: 1, name: 'Start with non-destructive tests', text: 'Temperature, loupe bubble check, and color zoning — all harmless to the stone.' },
    { step: 2, name: 'Cross-check with mineral data', text: 'Compare Mohs hardness, specific gravity, and refractive index against known values for the claimed species.' },
    { step: 3, name: 'Use price and naming as auxiliary signals', text: 'Far-below-market pricing or vague naming raises the stakes for further testing.' },
    { step: 4, name: 'Confirm with a destructive test only if needed', text: 'The scratch test (Mohs) damages the stone — use only on rough or tumbled quartz-family stones, never on jewelry.' },
    { step: 5, name: 'For valuable specimens, get a lab report', text: 'A gemological laboratory certificate is the only definitive answer for high-value stones.' }
  ];

  const howtoSchema = {
    name: cfg.schema.howto_name,
    totalTime: cfg.schema.howto_total_time || 'PT15M',
    steps: howtoSteps,
    supplies: ['10x jeweler\'s loupe', '365nm UV flashlight (optional)', 'Reference glass object for heft comparison'],
    tools: []
  };

  // 图片字段（hero + 真假对比 + 矿物示意）
  const ip = cfg.image_plan;
  const imgBase = `assets/images/generated/11.authenticity/${cfg.slug}`;
  const images = {
    hero: { file: `${imgBase}/${ip.hero.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'comparison', alt: `{{AI_IMG_HERO_ALT}}` }
  };
  if (ip.comparison) {
    images.comparison = { file: `${imgBase}/${ip.comparison.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'comparison', alt: `{{AI_IMG_COMPARISON_ALT}}` };
  }
  if (ip.test_diagram) {
    images.test = { file: `${imgBase}/${ip.test_diagram.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'diagram', alt: `{{AI_IMG_TEST_ALT}}` };
  }
  if (ip.mineral_chart) {
    images.mineral = { file: `${imgBase}/${ip.mineral_chart.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'diagram', alt: `{{AI_IMG_MINERAL_ALT}}` };
  }

  const article = {
    title: cfg.title, slug: cfg.slug, url: cfg.url,
    subject_label: cfg.subject_label, h1: cfg.h1,
    primary_kw: cfg.primary_kw, secondary_kw: cfg.secondary_kw,
    word_target: cfg.word_target, quality_tier: cfg.quality_tier,
    methods_used: cfg.methods_used, stone_cases: stoneKeys,
    author, date_modified: cfg.date_modified, date_published: cfg.date_published,
    faq_picks: cfg.faq_picks, buying_guide: cfg.buying_guide,
    internal_links: cfg.internal_links || {},
    schema: cfg.schema, compliance: cfg.compliance,
    three_perspectives: cfg.three_perspectives || { science: '50%', spirituality: '30%', psychology: '20%' },
    image_plan: ip,
    rank_math_title: cfg.title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: cfg.primary_kw,
    excerpt: '{{AI_EXCERPT}}',
    faq_schema: faqSchema, howto_schema: howtoSchema,
    diffHints: {
      subject_scope: cfg.subject_scope,
      methods_count: methodKeys.length,
      stone_cases_count: stoneKeys.length,
      crystal_vs_glass: !!cfg.crystal_vs_glass_section,
      m4_mode: cfg.m4_mode
    },
    content, images
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', cfg.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: cfg.slug, title: cfg.title, quality_tier: cfg.quality_tier });
  made++;
}

// 合并到 articles-index.json
const existingSlugs = new Set(existing.articles.map(a => a.slug));
for (const item of index) {
  if (existingSlugs.has(item.slug)) {
    existing.articles = existing.articles.map(a => a.slug === item.slug ? item : a);
  } else {
    existing.articles.push(item);
  }
}
existing.total = existing.articles.length;
fs.writeFileSync(idxPath, JSON.stringify(existing, null, 2), 'utf8');

console.log(`✅ ${made} 篇真伪鉴别骨架生成`);
console.log(`   articles-index 总计: ${existing.total} 篇`);
index.forEach(i => console.log(`   - ${i.slug} (${i.title.slice(0, 50)}...)`));
