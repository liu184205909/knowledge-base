/**
 * Tarot Major Arcana 骨架生成器（22 Major + 1 Hub = 23 篇）
 * 读 tarot-knowledge.json + tarot-config.json + _cta-validation.json
 * → 12 模块骨架（Intro/TL;DR/M2正位/M3逆位/M4水晶5角色+CTA降级/M5仪式/M6逆位水晶/M7三视角/M8东方/M9Shop/M10Spread/FAQ/Related）
 * URL: /tarot-{card-slug}-crystals/（避产品词污染）；Hub /crystals-for-tarot-cards/
 * 用法：node generate-articles.js --slug=the-fool | (全23篇)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const KNOW = require('../../../07-互动工具/_shared/tarot-knowledge.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;
const CFG = require('../configs/tarot-config.json');
const CTA = JSON.parse(fs.readFileSync(path.join(DIR, '_qc', '_cta-validation.json'), 'utf8'));

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const onlyHub = args.includes('--hub');


// >>>>>>> added by fix-major-crystal-slugs.js (兼容 tarot-knowledge -meaning slug + search-data 短 slug key)
function normSlug(s){ return s ? String(s).replace(/-meaning$/,'') : s; }
// <<<<<<< added by fix-major-crystal-slugs.js
const DISPLAY_OVERRIDES = { quartz: 'Clear Quartz', lapis: 'Lapis Lazuli', aventurine: 'Green Aventurine' };
function stoneName(slug) {
  if (DISPLAY_OVERRIDES[normSlug(slug)]) return DISPLAY_OVERRIDES[normSlug(slug)];
  const a = ATTR[slug.endsWith('-meaning') ? slug : slug + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return normSlug(slug).split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// CTA 文案轮换池（3套）
const readVariants = [`Read {N} Meaning`, `Explore {N} in depth`, `{N} properties & symbolism`];
const shopVariants = [`Shop {N}`, `Browse {N} jewelry`, `Find your {N} piece`];

let made = 0; const index = [];

// ====== 22 Major 牌 ======
const cards = onlyHub ? [] : (slugArg ? KNOW.cards.filter(c => c.slug === slugArg) : KNOW.cards);

for (const card of cards) {
  const num = card.number;
  const mw = CFG.module_weights[String(num)];
  const cardCTA = CTA[String(num)];

  // 水晶 5 角色 + CTA 降级
  const crystals = {};
  let vi = 0;
  for (const [role, info] of Object.entries(card.crystals)) {
    const slug = info.slug;
    const cc = cardCTA[role];
    const readTpl = readVariants[vi % 3].replace('{N}', info.name);
    const shopTpl = shopVariants[vi % 3].replace('{N}', info.name);
    crystals[role] = {
      slug, name: info.name, reason: info.reason, source: info.source,
      meaning_cta: cc.meaning_cta,
      meaning_url: cc.meaning_url,
      shop_cta: cc.shop_cta, shop_url: cc.shop_url,
      read_text: readTpl, shop_text: shopTpl,
    };
    vi++;
  }

  // ---- 12 模块 ----
  const intro = `{{AI_INTRODUCTION}}`;

  // M1 TL;DR Quick Answer
  const m1 = `<h2>${card.name} at a Glance</h2>\n<p>{{AI_TLDR}}</p>\n<ul>\n<li><strong>Archetype:</strong> ${card.archetype}</li>\n<li><strong>Core theme:</strong> ${card.theme}</li>\n<li><strong>Recommended crystal:</strong> ${crystals.best_overall.name}</li>\n<li><strong>Upright:</strong> ${card.upright_keywords.slice(0,3).join(', ')}</li>\n<li><strong>Reversed:</strong> ${card.reversed_keywords.slice(0,3).join(', ')}</li>\n</ul>`;

  // M2 Upright Meaning（正位深化，锚定 archetype + Rider-Waite 画面）
  const m2 = `<h2>${card.name} Upright: Meaning &amp; Message</h2>\n<p>{{AI_UPRIGHT}}</p>\n<p><em>DiffHint (M2 正位重心):</em> ${mw.M2_upright}。必须落到该牌 Rider-Waite 具体画面象征（非泛词），并融入 archetype 表达。</p>`;

  // M3 Reversed Meaning（逆位专章，shadow aspect 合规口径）
  const m3 = `<h2>${card.name} Reversed: The Shadow Aspect</h2>\n<p>{{AI_REVERSED}}</p>\n<p><strong>A reflection prompt:</strong> {{AI_REVERSED_PROMPT}}</p>\n<p><em>DiffHint (M3 逆位张力):</em> ${mw.M3_reversed_tension}。逆位 = 成长邀请非凶兆，禁 bad omen/curse，用 shadow aspect/invitation to reflect。</p>`;

  // M4 Best Crystals（5 角色 H3 + CTA降级 + 文案轮换）
  const roleLabels = {
    best_overall: `Best Overall Crystal for ${card.name}`,
    best_upright: `Best Crystal for Upright ${card.name} Energy`,
    best_reversed: `Best Crystal for Reversed ${card.name} (Shadow Work)`,
    best_love: `Best Crystal for Love &amp; Relationship Readings`,
    best_daily_wear: `Best Crystal to Wear Daily`,
  };
  let m4 = `<h2>Best Crystals for ${card.name}</h2>\n<p>{{AI_CRYSTAL_TRANSITION}}</p>\n`;
  for (const [role, c] of Object.entries(crystals)) {
    m4 += `<h3>${roleLabels[role]}</h3>\n<p>{{AI_CRYSTAL_${role.toUpperCase()}}}</p>\n`;
    let ctaLine = `<p><em>${c.name}</em> — ${c.reason} `;
    const links = [];
    if (c.meaning_cta === 'INCLUDE' && c.meaning_url) {
      links.push(`<a href="${c.meaning_url}">${c.read_text} →</a>`);
    }
    links.push(`<a href="${c.shop_url}">${c.shop_text} →</a>`);
    ctaLine += links.join(' · ') + `</p>\n`;
    m4 += ctaLine;
  }
  m4 += `<p><em>DiffHint:</em> 5 颗水晶三要素齐全（牌具体画面 + symbolic support 四源依据 + 具体使用场景），4 套句式轮换避免模板感。</p>`;

  // M5 How to Work with Crystals（仪式型，H2轮换）
  const ritualH2s = [`How to Work with ${card.name} Crystals`, `A Crystal Practice for ${card.name}`, `Using ${card.name} Crystals in Your Tarot Practice`];
  const ritualH2 = ritualH2s[num % 3];
  const m5 = `<h2>${ritualH2}</h2>\n<p>A short practice to bring ${card.name}'s energy into your reading or your day. Keep it practical — crystals are a focus for intention, not magic.</p>\n<p><strong>You'll need:</strong> ${crystals.best_overall.name}${crystals.best_upright.slug !== crystals.best_overall.slug ? ` or ${crystals.best_upright.name}` : ''}.</p>\n<p><strong>Step 1 — Set the focus (1 min):</strong> {{AI_RITUAL_STEP1}}</p>\n<p><strong>Step 2 — Hold the stone + draw a card (2 min):</strong> {{AI_RITUAL_STEP2}}</p>\n<p><strong>Step 3 — Close with one commitment:</strong> {{AI_RITUAL_STEP3}}</p>\n<p>> Prefer something quicker? <strong>{{AI_RITUAL_DAILY}}</strong></p>\n<p><em>DiffHint:</em> 仪式焦点锚定 ${mw.M5_focus}（${card.recommended_practice}），禁 22 篇都是 hold &amp; breathe。</p>`;

  // M6 Crystals for Reversed（逆位水晶差异化）
  const m6 = `<h2>Crystals to Support ${card.name} Reversed</h2>\n<p>When ${card.name} appears reversed, it often points to ${card.reversed_keywords.slice(0,3).join(', ')} — the card's energy in shadow rather than a bad omen. It's an invitation to notice where ${card.upright_keywords.slice(0,2).join(' and ')} has gone into overdrive or gone quiet. The crystal below is traditionally used to support this specific reflection.</p>\n<p><strong>Supporting stone — ${crystals.best_reversed.name}:</strong> {{AI_REVERSED_CRYSTAL}}</p>\n<p><em>合规口径:</em> 用 shadow aspect/invitation to reflect/growth edge，禁 bad omen/curse/evil。</p>`;

  // M7 Three-Perspective Reading（三视角差异化）
  const m7 = `<h2>${card.name} Through Three Lenses</h2>\n<p><strong>1. Tarot tradition:</strong> {{AI_LENS_TAROT}}</p>\n<p><strong>2. Psychological archetype:</strong> {{AI_LENS_PSYCH}}</p>\n<p><em>This lens treats ${card.name} as a mirror for self-inquiry — the psychological dimension here is <strong>${mw.M7_psych}</strong> — rather than a prediction.</em></p>\n<p><strong>3. Crystal companion:</strong> {{AI_LENS_CRYSTAL}}</p>\n<p><em>DiffHint:</em> 三段长度均衡（60-90词），心理学段必须引用 ${mw.M7_psych} 具体概念，第三段落回水晶推荐。</p>`;

  // M8 Eastern Perspective（护城河，≥2 处 Eastern 锚点）
  const m8 = `<h2>${card.name} in the Eastern Tradition</h2>\n<p>{{AI_EASTERN_MAIN}}</p>\n<p>{{AI_EASTERN_CRYSTAL}}</p>\n<p><em>DiffHint:</em> 至少 2 处 Eastern 锚点（${mw.eastern}）。不主导/不算命/不宗教化，落回水晶推荐。</p>`;

  // M9 Shop CTA（首饰转化差异化）
  const m9 = `<h2>Shop ${card.name} Crystals</h2>\n<p>${crystals.best_overall.name} and its companions are available as wearable jewelry in our shop — each piece can serve as a daily reminder of ${card.name}'s invitation to ${mw.M5_focus}.</p>\n<ul>\n<li><a href="${crystals.best_overall.shop_url}">Shop ${crystals.best_overall.name} →</a></li>\n<li><a href="${crystals.best_daily_wear.shop_url}">Browse ${crystals.best_daily_wear.name} →</a></li>\n<li><a href="/product-category/healing-jewelry/">Explore all healing jewelry →</a></li>\n</ul>`;

  // M10 Mini Crystal Tarot Spread（差异化）
  const m10 = `<h2>A Mini Crystal Tarot Spread for ${card.name}</h2>\n<p>A three-card spread to explore ${card.name}'s message in your life, with a crystal paired to each position.</p>\n<table>\n<thead>\n<tr><th>Position</th><th>Question</th><th>Companion Crystal</th></tr>\n</thead>\n<tbody>\n<tr><td>1. Where ${card.name} is showing up</td><td>Where is ${card.archetype} energy active in my life right now?</td><td>${crystals.best_overall.name}</td></tr>\n<tr><td>2. What it invites</td><td>What is this card asking me to notice or do?</td><td>${crystals.best_upright.name}</td></tr>\n<tr><td>3. The next step</td><td>What small action aligns me with this card's healthy expression?</td><td>${crystals.best_daily_wear.name}</td></tr>\n</tbody>\n</table>\n<p>Shuffle your deck, place a stone on each position as you draw, and sit with the three cards together for a few minutes before journaling.</p>`;

  // Gentle Note（全站组件，FAQ前）
  const gentleNote = `<p class="gentle-note"><em>${CFG.gentle_note}</em></p>`;

  // M11 FAQ（三层分层 + 全站前半一致 + 牌后半差异化）
  const m11 = `<h2>Frequently Asked Questions</h2>\n<details><summary>What does ${card.name} mean in tarot?</summary>{{AI_FAQ_MEANING}}</details>\n<details><summary>What is the upright meaning of ${card.name}?</summary>{{AI_FAQ_UPRIGHT}}</details>\n<details><summary>What are the best crystals for ${card.name}?</summary>{{AI_FAQ_CRYSTALS}}</details>\n<details><summary>What does ${card.name} mean in love?</summary>{{AI_FAQ_LOVE}}</details>\n<details><summary>What does ${card.name} reversed mean?</summary>{{AI_FAQ_REVERSED}}</details>\n<details><summary>What chakra is ${card.name} associated with?</summary>{{AI_FAQ_CHAKRA}}</details>\n<details><summary>Is ${card.name} a bad card?</summary>${CFG.faq_shared_halves.is_bad_card_first_half} {{AI_FAQ_BAD_CARD_HALF}}</details>\n<details><summary>Can tarot predict the future?</summary>${CFG.faq_shared_halves.can_predict_future_first_half} {{AI_FAQ_PREDICT_HALF}}</details>`;

  // M12 Related + Closing（相关牌互链 + Hub + Closing）
  const related = card.related_cards.map(rn => {
    const rc = KNOW.cards.find(c => c.number === rn);
    return rc ? `<li><a href="/tarot-${rc.slug}-crystals/">${rc.name}: ${rc.archetype}</a> — ${rc.theme}</li>` : '';
  }).filter(Boolean).join('\n');
  const m12 = `<h2>Related Tarot Cards</h2>\n<ul>\n${related}\n<li><a href="/crystals-for-tarot-cards/">All Tarot Card Crystals →</a> (Hub)</li>\n</ul>\n<p>{{AI_CLOSING}}</p>`;

  // 组装
  const content = [intro, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, gentleNote, m11, m12].join('\n\n');

  // TKD
  const title = `${card.name} Tarot Card Meaning & Best Crystals`;
  const focusKw = `${card.slug.replace(/-/g,' ')} tarot`;
  const article = {
    title, slug: card.slug, url: `/tarot-${card.slug}-crystals/`,
    number: num, name: card.name, archetype: card.archetype, element: card.element, astrology: card.astrology,
    theme: card.theme,
    upright_keywords: card.upright_keywords, reversed_keywords: card.reversed_keywords,
    upright_meaning: card.upright_meaning, reversed_meaning: card.reversed_meaning,
    psychological_lens: card.psychological_lens,
    eastern_anchors: card.eastern_anchors, recommended_practice: card.recommended_practice,
    crystals, chakra: card.chakra,
    related_cards: card.related_cards, source_notes: card.source_notes,
    module_weights: mw,
    rank_math_title: title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: focusKw,
    excerpt: '{{AI_EXCERPT}}',
    diffHints: {
      archetype: card.archetype, upright_meaning: card.upright_meaning, reversed_meaning: card.reversed_meaning,
      psychological_lens: card.psychological_lens, eastern_anchors: card.eastern_anchors,
      recommended_practice: card.recommended_practice, module_weights: mw,
      faq_shared_halves: CFG.faq_shared_halves,
    },
    images: {
      hero: { file: `images/tarot/hero-tarot-${card.slug}.webp`, alt: `${card.name} tarot card meaning with crystals — ${card.archetype}`, source_type: 'tarot-hero' },
      spread: { file: `images/tarot/spread-${card.slug}.webp`, alt: `Mini crystal tarot spread for ${card.name} — 3 cards with companion crystals`, source_type: 'tarot-spread' },
    },
    content,
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', card.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: card.slug, number: num, name: card.name, title, theme: card.theme, is_hub: false });
  made++;
}

// ====== Hub 页 ======
if (!slugArg || onlyHub) {
  const hub = KNOW.hub;
  const hubCardsList = KNOW.cards.map(c =>
    `<li><a href="/tarot-${c.slug}-crystals/">${c.number}. ${c.name}: ${c.archetype}</a> — best crystal: ${stoneName(c.crystals.best_overall.slug)}</li>`
  ).join('\n');
  const hubContent = `{{AI_HUB_INTRO}}

<h2>The 22 Major Arcana &amp; Their Crystals</h2>
<ul>
${hubCardsList}
</ul>

<h2>How to Choose a Crystal for a Tarot Card</h2>
{{AI_HUB_HOWTO}}

<h2>What Makes This Guide Different</h2>
{{AI_HUB_DIFFERENCE}}

<h2>Minor Arcana: A Note on Scope</h2>
{{AI_HUB_MINOR}}

${'<p class="gentle-note"><em>' + CFG.gentle_note + '</em></p>'}

<h2>Frequently Asked Questions</h2>
<details><summary>How do I pair crystals with tarot cards?</summary>{{AI_HUB_FAQ_PAIR}}</details>
<details><summary>Do I need a different crystal for reversed cards?</summary>{{AI_HUB_FAQ_REVERSED}}</details>
<details><summary>Is tarot the same as fortune-telling?</summary>${CFG.faq_shared_halves.can_predict_future_first_half} {{AI_HUB_FAQ_PREDICT_HALF}}</details>`;

  const hubArticle = {
    title: hub.title, slug: hub.slug, url: hub.url, is_hub: true,
    rank_math_title: hub.title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: 'crystals for tarot cards',
    excerpt: '{{AI_EXCERPT}}',
    crystals: {},
    images: { hero: { file: `images/tarot/hero-tarot-hub.webp`, alt: `Crystals for tarot cards — major arcana companion guide`, source_type: 'tarot-hub' } },
    content: hubContent,
  };
  fs.writeFileSync(path.join(DIR, 'articles', hub.slug + '.json'), JSON.stringify(hubArticle, null, 2), 'utf8');
  index.push({ slug: hub.slug, name: hub.name, title: hub.title, is_hub: true });
  made++;
}

fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇 Tarot 骨架生成（22 Major 12模块 + 1 Hub，M2正位/M3逆位/M4水晶5角色CTA降级/M5仪式/M6逆位水晶/M7三视角/M8东方/M9Shop/M10Spread/FAQ三层）`);
