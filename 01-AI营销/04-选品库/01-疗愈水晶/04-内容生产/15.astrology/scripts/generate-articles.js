/**
 * Astrology × Crystals 骨架生成器（6 事件 + 1 Hub = 7 篇）
 * 读 astrology-knowledge.json + astrology-config.json + _cta-by-slug.json
 * → 13 模块骨架（Intro/TL;DR/M2事件/M3场景/M4水晶6角色+CTA降级/M5仪式/M6星座细分/M7三视角/M8东方/M9Shop/M10FAQ/M11Related/M12GentleNote）
 * URL: /crystals-for-{event-slug}/（根级）；Hub /crystals-for-astrology-events/
 * 用法：node generate-articles.js --slug=mercury-retrograde | (全7篇) | --hub
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/astrology-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const CFG = require('../configs/astrology-config.json');
const CTA = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', '_cta-by-slug.json'), 'utf8'));

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const onlyHub = args.includes('--hub');

const DISPLAY_OVERRIDES = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', aventurine: 'Green Aventurine' };
function stoneName(slug) {
  if (DISPLAY_OVERRIDES[slug]) return DISPLAY_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// 角色标签美化
const ROLE_LABELS = {
  best_overall: (ev) => `Best Overall Crystal for ${ev}`,
  best_for_communication: (ev) => `Best Crystal for Clear Communication`,
  best_for_protection: (ev) => `Best Crystal for Protection`,
  best_for_intuition: (ev) => `Best Crystal for Intuition`,
  best_for_grounding: (ev) => `Best Crystal for Grounding`,
  best_for_patience: (ev) => `Best Crystal for Patience`,
  best_for_discipline: (ev) => `Best Crystal for Discipline`,
  best_for_release: (ev) => `Best Crystal for Release`,
  best_for_purpose: (ev) => `Best Crystal for Purpose`,
  best_for_emotion: (ev) => `Best Crystal for Emotional Balance`,
  best_for_clarity: (ev) => `Best Crystal for Clarity`,
  best_for_manifestation: (ev) => `Best Crystal for Manifestation`,
  best_for_new_beginnings: (ev) => `Best Crystal for New Beginnings`,
  best_for_self_worth: (ev) => `Best Crystal for Self-Worth`,
  best_for_harmony: (ev) => `Best Crystal for Harmony`,
  best_for_comfort: (ev) => `Best Crystal for Comfort`,
  best_to_wear_daily: (ev) => `Best Crystal to Wear Daily`,
};

// CTA 文案轮换池（3套）
const readVariants = [`Read the {N} Meaning`, `Explore {N} in depth`, `{N} properties & uses`];
const shopVariants = [`Shop {N} Jewelry`, `Browse {N} pieces`, `Find your {N}`];

let made = 0; const index = [];

const events = onlyHub ? [] : (slugArg ? KNOW.events.filter(e => e.slug === slugArg) : KNOW.events);

for (const ev of events) {
  const mw = CFG.module_weights[ev.slug];
  const ctaEntry = (slug) => CTA[slug] || { meaning_cta:'OMIT', meaning_url:null, shop_cta:'HEALING_JEWELRY', shop_url:'/product-category/healing-jewelry/', status:'FALLBACK', no_meaning:true };

  // 水晶 6 角色 + CTA 降级
  const crystals = {};
  let vi = 0;
  for (const [role, info] of Object.entries(ev.crystals)) {
    const slug = info.slug;
    const cc = ctaEntry(slug);
    const readTpl = readVariants[vi % 3].replace('{N}', info.name);
    const shopTpl = shopVariants[vi % 3].replace('{N}', info.name);
    crystals[role] = {
      slug, name: info.name, reason: info.reason, source: info.source,
      meaning_cta: cc.meaning_cta, meaning_url: cc.meaning_url,
      shop_cta: cc.shop_cta, shop_url: cc.shop_url,
      read_text: readTpl, shop_text: shopTpl,
    };
    vi++;
  }

  const overAll = crystals.best_overall;

  // ---- 13 模块 ----
  const intro = `{{AI_INTRODUCTION}}`;

  const m1 = `<h2>${ev.name} at a Glance</h2>\n<p>{{AI_TLDR}}</p>\n<ul>\n<li><strong>What it is:</strong> ${ev.astrology_meaning.split('. ').slice(0,1).join('. ')}.</li>\n<li><strong>What to expect:</strong> ${ev.what_to_expect.slice(0,2).join('; ')}.</li>\n<li><strong>Best crystal overall:</strong> ${overAll.name}</li>\n<li><strong>The reframing:</strong> ${ev.invitation_framing}</li>\n</ul>`;

  const m2 = `<h2>What ${ev.name} Actually Means</h2>\n<p>{{AI_MEANING}}</p>\n<p><em>DiffHint (M2 占星背景重心):</em> ${mw.M2_focus}。必须落到该事件的真实占星机制（周期/时长/司掌域），非泛"cosmic chaos"。</p>`;

  const wteLi = ev.what_to_expect.map(w => `<li>${w}</li>`).join('\n');
  const m3 = `<h2>What to Expect During ${ev.name}</h2>\n<p>{{AI_EXPECT_INTRO}}</p>\n<ul>\n${wteLi}\n</ul>\n<p><em>DiffHint (M3 场景重心):</em> ${mw.M3_scenes}。用该事件独有的 4 点生活场景（禁泛化"emotional intensity"塞满）。</p>\n<p><em>合规口径:</em> ${ev.invitation_framing}</p>`;

  // M4 6 角色（每颗追加 role-specific 使用场景句，满足 QC elem3）
  const SCENE_BY_ROLE = {
    best_overall: `Try holding this stone for two minutes at the start of each day during ${ev.name} as a cue to set one clear intention.`,
    best_for_communication: `Carry it in a pocket or wear it as jewelry on days when clear, honest conversations are scheduled.`,
    best_for_protection: `Keep a piece on your desk or near your front door during ${ev.name} as a grounding anchor when the day feels scattered.`,
    best_for_intuition: `Hold it for two minutes before journaling during ${ev.name} to help read what the period is surfacing.`,
    best_for_grounding: `Place it on your nightstand and hold it briefly before bed during ${ev.name} to discharge the day's static.`,
    best_for_patience: `Hold this stone when you feel the urge to rush a decision during ${ev.name}, and pause for three slow breaths first.`,
    best_for_discipline: `Keep it on your workspace during ${ev.name} as a tactile reminder of the long-term commitment you are building.`,
    best_for_release: `Use it during a release ritual at ${ev.name}, holding the stone as you name what you are letting go of.`,
    best_for_purpose: `Hold it during morning reflection in ${ev.name} to clarify the direction you are committing to next.`,
    best_for_emotion: `Wear it as jewelry or place it by your bedside during ${ev.name} to steady emotional intensity.`,
    best_for_clarity: `Hold it for two minutes when mental fog rises during ${ev.name}, breathing slowly to clear the field.`,
    best_for_manifestation: `Place it on a small intention grid during ${ev.name} to anchor what you are growing this cycle.`,
    best_for_new_beginnings: `Carry it with you during ${ev.name} as a tangible reminder of the fresh start you are seeding.`,
    best_for_self_worth: `Wear it daily during ${ev.name} to keep self-compassion close through the heart's review.`,
    best_for_harmony: `Hold it before a values-based conversation during ${ev.name} to speak with both honesty and grace.`,
    best_for_comfort: `Place it under your pillow or on your chest during ${ev.name} to soothe the season's emotional tides.`,
    best_to_wear_daily: `Its durability and everyday energy make it ideal to wear as a bracelet or necklace through the whole ${ev.name} season.`,
  };
  const roleBlocks = Object.entries(crystals).map(([role, c]) => {
    const label = ROLE_LABELS[role] ? ROLE_LABELS[role](ev.name) : `Best Crystal (${role.replace(/_/g,' ')})`;
    let ctaLine = '';
    if (c.meaning_cta === 'INCLUDE') ctaLine += ` <a href="${c.meaning_url}">${c.read_text}</a>.`;
    if (c.shop_cta === 'CATEGORY') ctaLine += ` <a href="${c.shop_url}">${c.shop_text} →</a>`;
    else if (c.shop_cta === 'SEARCH') ctaLine += ` <a href="${c.shop_url}">${c.shop_text} →</a>`;
    else if (c.shop_cta === 'HEALING_JEWELRY') ctaLine += ` <a href="${c.shop_url}">Browse healing jewelry →</a>`;
    const scene = SCENE_BY_ROLE[role] || `Hold or carry this stone during ${ev.name} as an anchor for intention.`;
    return `### ${label}\n<p><strong>${c.name}.</strong> ${c.reason} <em>(${c.source})</em>. ${scene}${ctaLine}</p>`;
  }).join('\n\n');
  const m4 = `<h2>Best Crystals for ${ev.name}</h2>\n<p>{{AI_CRYSTALS_INTRO}}</p>\n${roleBlocks}`;

  const m5 = `<h2>How to Work with ${ev.name} Crystals</h2>\n<p>{{AI_RITUAL}}</p>\n<p><em>Ritual focus:</em> ${ev.ritual_focus}。</p>`;

  // M6 星座细分（若有）
  let m6 = '';
  if (ev.sign_specific && Object.keys(ev.sign_specific).length) {
    const signBlocks = Object.entries(ev.sign_specific).map(([sign, sd]) => {
      const names = sd.crystals.map(s => stoneName(s)).join(', ');
      return `<li><strong>${sign.charAt(0).toUpperCase()+sign.slice(1)}:</strong> ${names} — ${sd.note}</li>`;
    }).join('\n');
    m6 = `<h2>Crystals by Zodiac Sign for ${ev.name}</h2>\n<p>{{AI_SIGN_INTRO}}</p>\n<ul>\n${signBlocks}\n</ul>`;
  }

  const m7 = `<h2>${ev.name} Through Three Lenses</h2>\n<p>{{AI_LENSES}}</p>\n<ul>\n<li><strong>Astrological tradition:</strong> {{AI_LENS_ASTRO}}</li>\n<li><strong>Psychological lens:</strong> {{AI_LENS_PSYCH}}</li>\n<li><strong>Crystal companion:</strong> {{AI_LENS_CRYSTAL}}</li>\n</ul>\n<p><em>DiffHint (M7 心理学锚点):</em> ${mw.M7_psych}。</p>`;

  const m8 = `<h2>${ev.name} in the Eastern Tradition</h2>\n<p>{{AI_EASTERN}}</p>\n<p><em>Eastern anchor (Vedic + Tibetan, ≥2 处锚点):</em> ${mw.M8_eastern}。${ev.eastern_lens}</p>`;

  // M9 Shop CTA 总
  const shopStones = Object.values(crystals).filter(c => c.shop_cta === 'CATEGORY').slice(0,4);
  const shopLi = shopStones.map(c => `<li><a href="${c.shop_url}">${c.name} jewelry</a></li>`).join('\n');
  const m9 = `<h2>Shop ${ev.name} Crystals</h2>\n<p>{{AI_SHOP}}</p>\n<ul>\n${shopLi || '<li><a href="/product-category/healing-jewelry/">Browse all healing jewelry</a></li>'}\n</ul>`;

  // M10 FAQ
  const faqs = [...ev.faq_seed];
  faqs.push('Is ' + ev.name + ' a bad time?');
  faqs.push('Can ' + ev.name + ' predict what will happen to me?');
  const faqBlocks = faqs.map((q,i) => `<h3>${q}</h3>\n<p>{{AI_FAQ_${i}}}</p>`).join('\n\n');
  const m10 = `<h2>Frequently Asked Questions</h2>\n${faqBlocks}\n<p><em>合规 shared halves:</em> is_doom → ${CFG.faq_shared_halves.is_doom_first_half} | predict → ${CFG.faq_shared_halves.can_predict_future_first_half}</p>`;

  const m11 = `<h2>Related Astrology Guides</h2>\n<p>{{AI_RELATED}}</p>\n<ul>\n<li><a href="/crystals-for-astrology-events/">All Astrology × Crystals Guides</a></li>\n</ul>`;

  const m12 = `<p><em>${CFG.gentle_note}</em></p>`;

  const content = [intro, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12].filter(Boolean).join('\n\n');

  const article = {
    title: ev.title,
    slug: ev.slug,
    url: ev.url,
    name: ev.name,
    category: 'astrology',
    line: ev.line,
    priority: ev.priority,
    primary_kw: ev.primary_kw,
    secondary_kw: ev.secondary_kw,
    astrology_meaning: ev.astrology_meaning,
    invitation_framing: ev.invitation_framing,
    what_to_expect: ev.what_to_expect,
    psych_lens: ev.psych_lens,
    eastern_lens: ev.eastern_lens,
    ritual_focus: ev.ritual_focus,
    crystals,
    sign_specific: ev.sign_specific || {},
    faq_seed: ev.faq_seed,
    module_weights: mw,
    rank_math_title: ev.title,
    rank_math_description: `Best crystals for ${ev.name}: ${ev.primary_kw.slice(0,2).join(', ')}. Grounding, protection & ritual stones for ${ev.name.toLowerCase()}.`,
    rank_math_focus_keyword: ev.primary_kw[0],
    excerpt: `The best crystals for ${ev.name}, with grounding, protection, and ritual practices. ${ev.invitation_framing}`,
    diffHints: { M2: mw.M2_focus, M3: mw.M3_scenes, M7: mw.M7_psych, M8: mw.M8_eastern },
    images: {
      hero: { file: `images/astrology/hero-${ev.slug}.webp`, alt: `Crystals for ${ev.name} — grounding and ritual stones`, source_type: 'astrology-hero' },
      diagram: { file: `images/astrology/diagram-${ev.slug}.webp`, alt: `${ev.name} crystal correspondences diagram`, source_type: 'astrology-diagram' },
    },
    content,
  };

  fs.writeFileSync(path.join(DIR, 'articles', ev.slug + '.json'), JSON.stringify(article, null, 2));
  index.push({ slug: ev.slug, title: ev.title, url: ev.url, priority: ev.priority, line: ev.line, name: ev.name });
  made++;
  console.log(`✓ ${ev.slug} — ${ev.title}`);
}

// Hub
if (!slugArg || onlyHub) {
  const hubSlug = 'crystals-for-astrology-events';
  const eventLi = KNOW.events.map(e => `<li><a href="${e.url}">Crystals for ${e.name}</a> — ${e.astrology_meaning.split('. ').slice(0,1).join('. ')}.</li>`).join('\n');
  const hub = {
    title: 'Crystals for Astrology Events: Retrogrades, Eclipses, Moon Phases',
    slug: hubSlug, url: '/crystals-for-astrology-events/', category: 'astrology', line: 'cross', priority: 'P0',
    rank_math_title: 'Crystals for Astrology Events: Retrogrades, Eclipses & Moon Phases',
    rank_math_description: 'Complete guide to crystals for astrology events — Mercury retrograde, Saturn return, full moon, new moon, eclipses, Venus retrograde.',
    rank_math_focus_keyword: 'crystals for astrology events',
    images: { hero: { file: `images/astrology/hero-${hubSlug}.webp`, alt: 'Crystals for astrology events overview', source_type: 'astrology-hero' } },
    content: `{{AI_INTRODUCTION}}\n\n<h2>Astrology × Crystals Guides</h2>\n<ul>\n${eventLi}\n</ul>\n\n<p><em>${CFG.gentle_note}</em></p>`,
  };
  fs.writeFileSync(path.join(DIR, 'articles', hubSlug + '.json'), JSON.stringify(hub, null, 2));
  index.push({ slug: hubSlug, title: hub.title, url: hub.url, priority: 'P0', line: 'hub', name: 'Astrology Events Hub' });
  made++;
  console.log(`✓ ${hubSlug} (Hub)`);
}

fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ generated: new Date().toISOString(), framework: '模板-Astrology文章框架.md v2', count: index.length, articles: index }, null, 2));
console.log(`\n完成: ${made} 篇骨架（含占位符 {{AI_*}} 待填充）`);
