/**
 * Meditation 骨架生成器（9 篇：1 枢纽 + 6 场景深度 + 2 延伸）
 * 读 _shared/meditation-knowledge.json → 8 模块骨架（场景分步 + 水晶三要素 + Eastern + 首饰 + FAQ + Schema 占位）
 * 框架 v2 对齐：Hero痛点 + Why needs crystals + Best Crystals + Step-by-Step(场景分步) + Scene Ritual(Eastern) + Jewelry + FAQ + Related
 * 数据单源：meditation-knowledge.json(scenes/crystal_pool/articles) + crystal-attributes.json(390 mineral) + mineral-safety-reference.json + chakra-knowledge.json
 * 用法：node generate-articles.js --slug=crystals-for-sleep-meditation | (全9篇)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KB = require('../../../07-互动工具/_shared/meditation-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const MS = require('../../../07-互动工具/_shared/mineral-safety-reference.json');
const CHAKRA = require('../../../07-互动工具/_shared/chakra-knowledge.json').chakras;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const list = slugArg ? KB.articles.filter(a => a.slug === slugArg) : KB.articles;

const MEANING_SLUG_OVERRIDES = KB._meta.meaning_slug_overrides || { 'clear-quartz': 'quartz' };
function meaningSlug(slug) { return MEANING_SLUG_OVERRIDES[slug] || slug; }
function meaningUrl(slug) { return `/gemstone/${meaningSlug(slug)}-meaning/`; }
function stoneName(slug) {
  const pool = KB.crystal_pool[slug];
  if (pool && pool.name) return pool.name;
  const a = ATTR[meaningSlug(slug) + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function stoneData(slug) {
  const pool = KB.crystal_pool[slug] || {};
  const safetyKey = MS.stones[slug] ? slug : null;
  const ms = safetyKey ? MS.stones[safetyKey] : null;
  return {
    slug, name: stoneName(slug),
    science: pool.science_angle || '',
    tradition: pool.tradition_angle || '',
    mindfulness: pool.mindfulness_angle || '',
    mineral: pool.mineral || (ms ? ms.mineral : ''),
    safety_note: ms ? ms.notes : (pool.safety || 'moonlight, selenite plate, and sound are safe universal methods for this stone'),
    meaning_url: meaningUrl(slug),
    meaning_online: pool.meaning_online !== false,
    shop_url: pool.shop_category || '/product-category/healing-crystals-jewelry/'
  };
}

// Cleansing Timer 决策卡片（按框架 v2 §6.1）
function decisionCard() {
  return `<div class="cleansing-timer-card" style="background:#f0f7ff;border-left:4px solid #2e7d32;padding:16px 20px;margin:24px 0;border-radius:6px;">
<p>💡 <strong>Before your next session, is your stone ready?</strong></p>
<p>Crystals used in meditation benefit from regular cleansing. Enter your stone name in the <a href="/tools/crystal-cleansing-timer/"><strong>Crystal Cleansing Timer</strong></a> → check its water/salt/sun safety, get the recommended method, and start a guided countdown.</p>
</div>`;
}

let made = 0; const index = [];

for (const cfg of list) {
  const isHub = cfg.scene === 'hub';
  const isScript = cfg.id === 'M7';
  const isRoom = cfg.id === 'M8';
  const scene = isHub || isScript || isRoom ? null : KB.scenes[cfg.scene];
  // 场景短名（用于标题拼接，避免 "Sleep & Bedtime Ritual Meditation" 冗长）
  const SCENE_SHORT = { focus: 'Focus', sleep: 'Sleep', emotional: 'Emotional Release', grounding: 'Grounding', beginners: 'Beginner', manifestation: 'Manifestation' };
  const sceneShort = scene ? (SCENE_SHORT[cfg.scene] || scene.name.split(' &')[0]) : '';

  // 解析水晶列表
  let crystalSlugs;
  if (isHub) crystalSlugs = cfg.crystals_13;
  else crystalSlugs = cfg.crystals;
  const crystals = crystalSlugs.map(s => stoneData(s));

  const title = cfg.title;
  const primary = cfg.primary_kw;

  // ---- 模块化组装 ----

  // Introduction（占位，AI 写场景痛点切入）
  const intro = `<p>{{AI_INTRODUCTION}}</p>`;

  // ==================== M1 Hero 场景痛点切入 ====================
  const m1Title = isHub ? 'Why Meditate with Crystals?'
    : isScript ? 'Why Use a Crystal Meditation Script?'
    : isRoom ? 'Why Set Up a Meditation Space with Crystals?'
    : `Why ${sceneShort} Meditation?`;
  const m1 = `<h2>${m1Title}</h2>
<p>{{AI_M1_PAIN_POINT}}</p>
<p>{{AI_M1_THREE_PERSPECTIVES}}</p>`;

  // ==================== M2 Why {Scene} Needs Crystals ====================
  const m2Title = isHub ? 'How Crystals Support Meditation'
    : isScript ? 'How a Script and a Crystal Work Together'
    : isRoom ? 'How Crystals Shape a Meditation Space'
    : `How Crystals Support ${sceneShort} Meditation`;
  const m2 = `<h2>${m2Title}</h2>
<p>{{AI_M2_PARA1_SCIENCE}}</p>
<p>{{AI_M2_PARA2_TRADITION}}</p>
<p>{{AI_M2_PARA3_MINDFULNESS}}</p>
<ul>
<li>{{AI_M2_BULLET_POINT_1}}</li>
<li>{{AI_M2_BULLET_POINT_2}}</li>
<li>{{AI_M2_BULLET_POINT_3}}</li>
</ul>`;

  // ==================== M3 Best Crystals（三要素 + safety + Shop）====================
  const m3Title = isHub ? 'Best Crystals for Meditation (by Goal)'
    : `Best Crystals for ${sceneShort} Meditation`;
  let m3Body = `<h2>${m3Title}</h2>\n<p>{{AI_M3_CRYSTAL_TRANSITION}}</p>\n`;
  for (const c of crystals) {
    const meaningLink = c.meaning_online
      ? ` · <a href="${c.meaning_url}">Read full ${c.name} meaning</a>`
      : '';
    m3Body += `<h3>${c.name}</h3>
<p>{{AI_M3_${c.slug.toUpperCase().replace(/-/g, '_')}_THREE_ELEMENT}}</p>
<p><em><strong>Mineral:</strong> ${c.mineral}</em></p>
<p><em><strong>Care note:</strong> ${c.safety_note}</em></p>
<p><a href="${c.shop_url}">Shop ${c.name}</a>${meaningLink}</p>
`;
  }
  const m3 = m3Body;

  // ==================== M4 Step-by-Step（场景化分步，核心差异化）====================
  const steps = cfg.howto_6_steps;
  let m4Title;
  if (isHub) m4Title = 'How to Meditate with Crystals: A Simple Flow';
  else if (isScript) m4Title = 'How to Use These 5 Scripts';
  else if (isRoom) m4Title = 'How to Set Up Your Crystal Space: 6 Steps';
  else m4Title = `How to Meditate with Crystals for ${sceneShort}: ${steps.length} Steps`;

  let m4Body = `<h2>${m4Title}</h2>\n<p>{{AI_M4_INTRO}}</p>\n<ol>\n`;
  for (const s of steps) {
    m4Body += `<li><strong>${s.name}.</strong> ${s.text} {{AI_M4_STEP_${s.step}_DEEPEN}}</li>\n`;
  }
  m4Body += `</ol>\n<p>{{AI_M4_CLOSING_NOTE}}</p>`;
  // M4 末决策卡片
  m4Body += `\n${decisionCard()}`;
  const m4 = m4Body;

  // ==================== M5 Scene Ritual (Eastern + Western) ====================
  const easternArr = cfg.eastern || (scene ? scene.eastern : []);
  const m5Title = isHub ? 'Meditation Traditions: East & West'
    : isScript ? 'The Traditions Behind These Scripts'
    : isRoom ? 'Space Traditions: Shrines & Zen Rooms'
    : `${sceneShort} Rituals: Eastern & Western Traditions`;
  let m5Body = `<h2>${m5Title}</h2>\n<p>{{AI_M5_INTRO}}</p>\n`;
  easternArr.forEach((e, i) => {
    m5Body += `<h3>${e}</h3>\n<p>{{AI_M5_EASTERN_${i + 1}}}</p>\n`;
  });
  m5Body += `<h3>Western Mindful Ritual Framing</h3>\n<p>{{AI_M5_WESTERN}}</p>`;
  const m5 = m5Body;

  // ==================== M6 Jewelry in Meditation ====================
  const m6Title = isHub ? 'Wearing Crystals During Meditation'
    : isRoom ? 'Wearable Crystals for Your Space'
    : isScript ? 'Wearing a Crystal During a Scripted Session'
    : `Wearing Crystals During ${sceneShort} Meditation`;
  const m6 = `<h2>${m6Title}</h2>
<p>{{AI_M6_JEWELRY_MAIN}}</p>
<ul>
<li>{{AI_M6_TIP_WHICH_HAND}}</li>
<li>{{AI_M6_TIP_NECKLACE}}</li>
<li>{{AI_M6_TIP_TACTILE}}</li>
</ul>`;

  // ==================== M7 FAQ + Gentle Note + 底部卡 ====================
  const faqData = [
    ...cfg.faq_picks.intent.map(q => ({ q, cat: 'intent' })),
    ...cfg.faq_picks.conversion.map(q => ({ q, cat: 'conversion' })),
    ...cfg.faq_picks.trust.map(q => ({ q, cat: 'trust' })),
  ];
  const faqHtml = faqData.map((f, i) => `<h3>${f.q}</h3>\n<p>{{AI_FAQ_${i}}}</p>`).join('\n');
  const gentleNote = `<p class="gentle-note"><em>Crystal meditation practices draw on spiritual traditions, symbolism, and personal mindfulness. There is no scientific evidence that crystals store or release energy, but the mineral properties (piezoelectricity, color, thermal conductivity) and the mindfulness principle of tactile anchoring are real — and a meditation ritual can be meaningful whether or not one believes in a stone's energetic properties. Crystals are not a substitute for medical or mental health care.</em></p>`;
  const m7TitleText = `Frequently Asked Questions`;
  const m7 = `<h2>${m7TitleText}</h2>
${faqHtml}
${gentleNote}
${decisionCard()}`;

  // ==================== M8 Related + 工具 CTA ====================
  let relatedHtml = '';
  if (cfg.internal_links.hub && cfg.id !== 'M0') {
    const hub = KB.articles.find(a => a.id === cfg.internal_links.hub);
    if (hub) relatedHtml += `<li><a href="${hub.url}"><strong>Best Crystals for Meditation</strong></a> — the full overview of 13 stones by goal</li>`;
  }
  // sibling 互链
  if (cfg.internal_links.sibling) {
    for (const sid of cfg.internal_links.sibling) {
      const sib = KB.articles.find(a => a.id === sid);
      if (sib) relatedHtml += `<li><a href="${sib.url}">${sib.title.replace(/:.*$/, '').replace(/Crystals? for /i, '').replace(/ Meditation.*/, ' Meditation')}</a> — ${sib.secondary_kw[0]}</li>`;
    }
  }
  if (cfg.id === 'M0') {
    // 枢纽：链所有 M1-M8
    for (const a of KB.articles.filter(x => x.id !== 'M0')) {
      relatedHtml += `<li><a href="${a.url}">${a.title.replace(/:.*/, '')}</a></li>`;
    }
  }
  const intentionLink = cfg.internal_links.intention === 'calm-mindfulness'
    ? `<li><a href="/calm-mindfulness/">Shop Calm &amp; Mindfulness Jewelry</a> — pieces chosen for a settled practice</li>` : '';
  const conditionLink = cfg.internal_links.condition
    ? `<li><a href="${cfg.internal_links.condition}">Crystals for ${cfg.internal_links.condition.includes('sleep') ? 'Sleep' : cfg.internal_links.condition.includes('anxiety') ? 'Anxiety' : 'Your Condition'}</a></li>` : '';
  const shopLink = `<li><a href="${cfg.internal_links.shop_fallback}">Shop Healing Crystal Jewelry</a></li>`;
  const timerLink = `<li><a href="${cfg.internal_links.cleansing_timer}">Crystal Cleansing Timer</a> — check your stone's safety before next session</li>`;

  const m8 = `<h2>Related Meditation Guides</h2>
<ul>
${relatedHtml}
${conditionLink}
${intentionLink}
${shopLink}
${timerLink}
</ul>
<p>{{AI_CLOSING}}</p>`;

  // ---- 组装 ----
  const content = [intro, m1, m2, m3, m4, m5, m6, m7, m8].join('\n\n');

  // FAQ Schema
  const faqSchema = faqData.map((f, i) => ({ question: f.q, answer_placeholder: `{{AI_FAQ_${i}}}`, category: f.cat }));

  // HowTo Schema（6 步通用流程）
  const howtoSchema = {
    name: cfg.schema.howto_name,
    totalTime: cfg.schema.howto_total_time,
    steps: cfg.howto_6_steps.map(s => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
    supply: crystals.slice(0, 3).map(c => c.name + ' (' + c.mineral.split('(')[0].trim() + ')')
  };

  // 图片字段
  const ip = cfg.image_plan;
  const imgBase = `assets/images/generated/14.meditation/${cfg.slug}`;
  const images = {
    hero: { file: `${imgBase}/${ip.hero.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'scene', alt: ip.hero.alt }
  };
  if (ip.step_diagrams && ip.step_diagrams.length) {
    const sd = ip.step_diagrams[0];
    images.step = { file: `${imgBase}/${sd.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'scene', alt: sd.alt };
  }

  const article = {
    title: cfg.title, slug: cfg.slug, url: cfg.url, h1: cfg.h1,
    id: cfg.id, scene: cfg.scene, priority: cfg.priority, tier: cfg.tier,
    primary_kw: cfg.primary_kw, secondary_kw: cfg.secondary_kw,
    word_target: cfg.word_target, concept_focus: cfg.concept_focus,
    scene_data: scene,
    crystals, eastern: cfg.eastern,
    faq_picks: cfg.faq_picks, internal_links: cfg.internal_links,
    schema: cfg.schema,
    rank_math_title: cfg.title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: cfg.primary_kw,
    excerpt: '{{AI_EXCERPT}}',
    faq_schema: faqSchema, howto_schema: howtoSchema,
    diffHints: {
      scene: cfg.scene,
      concept_focus: cfg.concept_focus,
      breath: scene ? scene.breath : null,
      visualization: scene ? scene.visualization : null,
      eastern: cfg.eastern,
      compliance_phrasing: scene ? scene.compliance_phrasing : 'support/invite/mindful anchor; no medical claims'
    },
    content, images
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', cfg.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: cfg.slug, title: cfg.title, id: cfg.id, tier: cfg.tier });
  made++;
}

fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Meditation 骨架生成（8 模块 + 场景分步 + 水晶三要素 + Eastern + 首饰 + FAQ + Schema 占位）`);
console.log(`   分布: ${index.map(a => a.id).join(', ')}`);
