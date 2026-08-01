/**
 * MBTI 16 型 hub 文章生成（基于 mbti-tarot-knowledge.json + tarot-knowledge.json + 竞品研究）
 * 输出：articles/{type-lowercase}.md（16 篇，~3000 词）
 * URL 规则：/mbti-{type-lowercase}-tarot/（根级，避产品词污染）
 * 结构（竞品研究驱动：Cosmopolitan Court Cards 差异化 + beanlex crystal allies + PAA 问题覆盖）：
 *   H1 + intro（型概述 + 4 字母解码 + 商标 disclaimer）
 *   H2 What Tarot Card Is {TYPE}? (PAA 问题直接命中) → primary 牌解读 + Major vs Court Cards 差异化说明
 *   H2 Your Growth Card: {growth name} → growth 牌 + 成长邀请
 *   H2 {TYPE} Cognitive Stack（Ni/Ne/Si/Se/Ti/Te/Fi/Fe 解码）
 *   H2 Crystals for {TYPE}（beanlex 风格 3 石 allies：best_overall/best_upright/best_growth）
 *   H2 The Eastern Anchor（藏传/东方锚点差异化）
 *   H2 {TYPE} in Love (关系)
 *   H2 {TYPE} at Work (职业)
 *   H2 {TYPE} Personal Growth Path（成长）
 *   H2 FAQ（5 问，覆盖 PAA + 商标 + reversed shadow）
 *   H2 Try Our MBTI Tarot Tool（工具 CTA）
 *   H2 Keep Exploring（内链：本命大牌牌义页 + related types）
 * 数据源：knowledge（不凭通识）
 */
const fs = require('fs'), path = require('path');
const BASE = path.resolve(__dirname, '..');
const SHARED = path.resolve(__dirname, '../../../07-互动工具/_shared');
const mbti = JSON.parse(fs.readFileSync(path.join(SHARED, 'mbti-tarot-knowledge.json'), 'utf8'));
const tarot = JSON.parse(fs.readFileSync(path.join(SHARED, 'tarot-knowledge.json'), 'utf8'));

// 翻译缓存（站点是英文站，knowledge 中文字段需英文化）
let translations = {};
const transPath = path.join(BASE, 'configs', 'translations-cache.json');
if (fs.existsSync(transPath)) {
  try { translations = JSON.parse(fs.readFileSync(transPath, 'utf8')); }
  catch (e) { console.error('翻译缓存解析失败:', e.message); }
}
function tr(type, field, fallback) {
  const k = type + '::' + field;
  return translations[k] || fallback;
}

// tarot 卡索引：slug → card
const cardBySlug = {};
for (const c of tarot.cards) cardBySlug[c.slug] = c;

const TYPE_ORDER = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

// 4 字母维度解码
const LETTERS = {
  I: { letter: 'I', word: 'Introverted', desc: 'recharged by time alone, drawn to depth over breadth in social exchange' },
  E: { letter: 'E', word: 'Extraverted', desc: 'recharged by interaction, energized by the external world of people and action' },
  N: { letter: 'N', word: 'Intuitive', desc: 'oriented toward patterns, future possibilities, and the meaning beneath facts' },
  S: { letter: 'S', word: 'Sensing', desc: 'oriented toward present facts, lived experience, and concrete detail' },
  T: { letter: 'T', word: 'Thinking', desc: 'decisions made through logic, analysis, and principled consistency' },
  F: { letter: 'F', word: 'Feeling', desc: 'decisions made through values, harmony, and consideration of impact on people' },
  J: { letter: 'J', word: 'Judging', desc: 'prefers structure, closure, and planned sequence over open-ended flexibility' },
  P: { letter: 'P', word: 'Perceiving', desc: 'prefers openness, adaptability, and responding to information as it arrives' }
};

// 认知功能全称
const FUNC_FULL = {
  Ni: 'Introverted Intuition (Ni)',
  Ne: 'Extraverted Intuition (Ne)',
  Si: 'Introverted Sensing (Si)',
  Se: 'Extraverted Sensing (Se)',
  Ti: 'Introverted Thinking (Ti)',
  Te: 'Extraverted Thinking (Te)',
  Fi: 'Introverted Feeling (Fi)',
  Fe: 'Extraverted Feeling (Fe)'
};

function cardName(slug) {
  const c = cardBySlug[slug];
  return c ? c.name : slug.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}
function cardArticle(slug) {
  // "The Fool" → "the Fool"; "Justice" → "Justice"
  const n = cardName(slug);
  return /^(the|a|an)\s/i.test(n) ? n.toLowerCase().replace(/^t/, 't') : n;
}
function lower(s){return s.toLowerCase();}

// 生成关系/职业/成长/FAQ（基于型 group + primary/growth 牌组合 + 认知功能）
function perTypeExtras(type, t) {
  const grp = t.group;
  const cs = t.cognitive_stack;
  const pCard = cardName(t.birth_cards.primary.slug);
  const gCard = cardName(t.birth_cards.growth.slug);

  // 关系：基于 F/T + I/E
  const hasFeFi = cs.dominant === 'Fe' || cs.dominant === 'Fi' || cs.auxiliary === 'Fe' || cs.auxiliary === 'Fi';
  const isIntro = type[0] === 'I';
  const loveTheme = hasFeFi
    ? `In love, ${type} brings a depth of emotional attunement that few types can match — but the same sensitivity can become ${cs.dominant === 'Fi' ? 'a private weighing of whether your inner values are honored' : 'a tendency to absorb your partner\'s emotional weather as your own'}. Your ${cardArticle(t.birth_cards.primary.slug)} energy asks for a partner who respects ${isIntro ? 'your need for processing time' : 'your directional intensity'} without taking it personally.`
    : `In love, ${type} leads with clarity and directness — you tend to know quickly whether a connection has long-term architecture, and you'd rather name that than drift. The growth edge is allowing ${cs.dominant === 'Te' ? 'your Fi inferior (inner values)' : 'your Feeling function'} a real voice in decisions of the heart, not just the head. A compatible partner meets your standard without being diminished by it.`;

  // 职业：基于 dominant
  const domFull = FUNC_FULL[cs.dominant];
  const careerTheme = {
    Ni: `At work, your ${domFull} makes you the person who sees the downstream consequence of a decision before others finish describing the situation. You thrive in roles with long horizons — strategy, architecture, research, founding work — where patient pattern-finding compounds. The pitfall is the Hermit's delay: staying in contemplation past the moment action would have paid off.`,
    Ne: `At work, your ${domFull} makes you a generator of possibilities — you see ten routes where peers see one, and your value lives in reframing problems so the team can choose better. You thrive in roles with variety and conceptual range — design, founding, R&D, consulting — where novelty is the job, not a distraction. The growth edge is finishing: choosing one possibility and giving it the structure to actually ship.`,
    Si: `At work, your ${domFull} makes you the keeper of what has been proven to work — you carry an internal archive of precedents, details, and lessons that others have to look up. You thrive in roles requiring reliability and precision — operations, accounting, quality, lineage craft — where being right consistently beats being novel occasionally. The growth edge is allowing the occasional untested option a fair hearing.`,
    Se: `At work, your ${domFull} makes you unmatched in the live moment — you read the room, the field, the deal as it actually is, not as it was planned. You thrive in roles with real-time execution — sales, trading, emergency response, hands-on craft, performance — where presence under pressure is the differentiator. The growth edge is the long view: lifting your eyes from this quarter to the next three.`,
    Ti: `At work, your ${domFull} makes you a precision instrument for figuring out how things actually work — you take a system apart in your head and find the assumption nobody questioned. You thrive in roles with depth and autonomy — engineering, analysis, research, specialist craft — where being right matters more than being loud. The growth edge is communication: translating your interior findings into language others can act on.`,
    Te: `At work, your ${domFull} makes you a builder of order from ambiguity — you see the structure a situation needs and you put it there. You thrive in roles with scope and accountability — leadership, operations, founding, restructuring — where deciding and organizing is the job. The growth edge is the human factor: letting Fi inform structure rather than be flattened by it.`,
    Fi: `At work, your ${domFull} makes you the keeper of authentic alignment — you can feel when a project, a client, or a decision is off-value before anyone can articulate why. You thrive in roles with meaning and craft — writing, counseling, design, mission-driven work — where integrity compounds. The growth edge is structure: giving your inner truth a pipeline into the world, not just an interior conviction.`,
    Fe: `At work, your ${domFull} makes you a conductor of the emotional field — you sense what a group needs to hear and in what order, and you carry the relational infrastructure others rely on. You thrive in roles with human stakes — teaching, leading, care, community, HR at its best — where coherence among people is the deliverable. The growth edge is independence of judgment: letting Ti do its work even when it disagrees with the room.`
  }[cs.dominant];

  // 成长路径：基于 growth 牌 + inferior 功能（英文翻译后用 . 分句）
  const reversedShort = (t.reversed_shadow.split(/[.。—]/)[0] || t.reversed_shadow).trim().slice(0, 120) || 'over-extension of your dominant function';
  const growthReasonShort = (t.birth_cards.growth.reason.split(/[.。—]/).slice(-1)[0] || t.birth_cards.growth.reason).trim().slice(0, 240);
  const growthTheme = `Your growth path runs through ${cardArticle(t.birth_cards.growth.slug)} — the invitation encoded in your second birth card. When ${cardArticle(t.birth_cards.primary.slug)} tips into shadow (${reversedShort}), ${gCard} arrives as the corrective: ${growthReasonShort}. Pair the primary card's contemplation with the growth card's motion, and the same psychological tension that tired you becomes the engine of your next chapter.`;

  // FAQ 5 问（覆盖 PAA + 商标 + reversed）
  const faq = [
    {
      q: `What tarot card is ${type}?`,
      a: `In our Major Arcana framework, ${type} (${t.nickname}) maps to ${pCard} as the primary birth card and ${gCard} as the growth card. This is an editorial interpretation based on Jungian cognitive functions, not the court-card mapping some guides use. ${pCard} aligns with your ${FUNC_FULL[cs.dominant]} dominant function; ${gCard} supports your ${FUNC_FULL[cs.auxiliary]} auxiliary or ${FUNC_FULL[cs.inferior]} inferior.`
    },
    {
      q: `What crystals are good for ${type}?`,
      a: `Our three crystal allies for ${type} are ${t.crystals[0].name} (${t.crystals[0].role.replace(/_/g,' ')}, ${(t.crystals[0].reason.split(/[.。—]/)[0] || t.crystals[0].reason).trim().toLowerCase().slice(0, 90)}), ${t.crystals[1].name} (${t.crystals[1].role.replace(/_/g,' ')}), and ${t.crystals[2].name} (${t.crystals[2].role.replace(/_/g,' ')}). Each one anchors a different layer of the ${type} cognitive stack rather than being chosen for generic "energy".`
    },
    {
      q: `Is the ${type} tarot mapping officially recognized?`,
      a: `No. MBTI is a registered trademark of The Myers-Briggs Company; this is an independent framework based on Jungian cognitive functions (Ni/Ne/Si/Se/Ti/Te/Fi/Fe), offered for self-reflection and creative exploration — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company. Our ${pCard}/${gCard} mapping is our own editorial interpretation and does not represent official MBTI doctrine.`
    },
    {
      q: `What does the reversed ${pCard} mean for ${type}?`,
      a: `${pCard} reversed is read here as a shadow aspect, not a bad omen. For ${type}, it points to ${(t.reversed_shadow.split(/[.。—]/)[0] || t.reversed_shadow).trim().slice(0, 200)}. The growth invitation is to lean on ${gCard}'s energy — motion, integration, completion — rather than forcing more effort through the primary card.`
    },
    {
      q: `How do I use this ${type} tarot reading?`,
      a: `Three practical steps: (1) sit with ${pCard}'s archetype for a week — pull the card daily, journal one sentence on where its theme showed up; (2) carry one of the recommended crystals as a tactile anchor for that theme; (3) when you sense the shadow (the reversed reading above), pull ${gCard} and ask what its energy is inviting you to do. The goal is reflective practice, not prediction. Try our [MBTI Tarot Tool](/tools/mbti-tarot/) for an interactive version.`
    }
  ];

  return { loveTheme, careerTheme, growthTheme, faq };
}

function buildArticle(type, t) {
  const slug = 'mbti-' + lower(type) + '-tarot';
  const postSlug = slug; // URL = /mbti-{type}-tarot/
  const primarySlug = t.birth_cards.primary.slug;
  const growthSlug = t.birth_cards.growth.slug;
  const pCard = cardName(primarySlug);
  const gCard = cardName(growthSlug);
  const pCardArt = cardArticle(primarySlug);
  const gCardArt = cardArticle(growthSlug);
  const cs = t.cognitive_stack;
  const focus_kw = `${lower(type)} tarot card`;

  // 翻译字段（站点英文，knowledge 中文 → 缓存英文）
  const uprightEn = tr(type, 'upright_reading', t.upright_reading);
  const reversedEn = tr(type, 'reversed_shadow', t.reversed_shadow);
  const easternEn = tr(type, 'eastern_anchor', t.eastern_anchor);
  const primaryReasonEn = tr(type, 'birth_primary_reason', t.birth_cards.primary.reason);
  const growthReasonEn = tr(type, 'birth_growth_reason', t.birth_cards.growth.reason);
  const crystalReasonsEn = t.crystals.map((_, i) => tr(type, 'crystal_' + i + '_reason', t.crystals[i].reason));

  // 把翻译字段塞回 t 副本（perTypeExtras 和后续引用读取英文版）
  const tEn = JSON.parse(JSON.stringify(t));
  tEn.upright_reading = uprightEn;
  tEn.reversed_shadow = reversedEn;
  tEn.eastern_anchor = easternEn;
  tEn.birth_cards.primary.reason = primaryReasonEn;
  tEn.birth_cards.growth.reason = growthReasonEn;
  tEn.crystals.forEach((c, i) => { c.reason = crystalReasonsEn[i]; });

  const extras = perTypeExtras(type, tEn);

  // 内链：本命大牌牌义页（/tarot-{card}-crystals/）+ growth 牌义页
  const pCardLink = `/tarot-${primarySlug}-crystals/`;
  const gCardLink = `/tarot-${growthSlug}-crystals/`;

  // 水晶 meaning 内链（-meaning 后缀，链 meaning 页）
  const crystalLinks = t.crystals.map(c => {
    const stone = c.slug.replace(/-meaning$/, '');
    return { stone, name: c.name, role: c.role, reason: c.reason, link: `/${c.slug}/` };
  });

  // Shop CTA（三级降级；healing-jewelry 实测 404，降级到 /shop/ 兜底）
  const shopPrimary = t.shop_cta.primary === '/product-category/healing-jewelry/' ? '/shop/' : t.shop_cta.primary;
  const shopFallback = t.shop_cta.fallback === '/product-category/healing-jewelry/' ? '/shop/' : t.shop_cta.fallback;

  // related types 内链
  const relatedTypeLinks = t.related_types.map(rt => `/mbti-${lower(rt)}-tarot/`);

  // 关键词内链（塔罗千页集群相关 intention/category）
  const intentionLinks = t.related_intentions.slice(0, 3).map(i => `/category/tarot/`);

  // 4 字母解码段
  const letters = type.split('').map(L => {
    const info = LETTERS[L];
    return `- **${L} — ${info.word}**: ${info.desc}`;
  }).join('\n');

  // 认知功能栈段
  const cogStack = `- **Dominant**: ${FUNC_FULL[cs.dominant]} — your lead function, the lens you trust most\n- **Auxiliary**: ${FUNC_FULL[cs.auxiliary]} — your co-pilot, balancing the dominant\n- **Tertiary**: ${FUNC_FULL[cs.tertiary]} — develops through mid-life\n- **Inferior**: ${FUNC_FULL[cs.inferior]} — your least-resourced function, often the growth edge`;

  // 水晶段（beanlex 风格）
  const crystalSection = crystalLinks.map((c, i) => {
    const roleLabel = c.role === 'best_overall' ? 'Overall anchor' : c.role === 'best_upright' ? 'For daily practice' : 'For growth';
    return `### ${c.name} — ${roleLabel}

${tEn.crystals[i].reason}

[Read the full ${c.name} meaning →](${c.link})`
  }).join('\n\n');

  // FAQ
  const faqSection = extras.faq.map(f => `**${f.q}**

${f.a}`).join('\n\n');

  // related types 卡片
  const relatedCards = t.related_types.map(rt => `- [${rt} (${mbti.types[rt].nickname})](${relatedTypeLinks[t.related_types.indexOf(rt)]})`).join('\n');

  // H1 用 article（"the Hermit" / "Justice"）
  const pCardH1 = /^(the|a|an)\s/i.test(pCard) ? pCard.toLowerCase().replace(/^t/, 't') : pCard;

  const md = `## Brief
- focus_keyword: ${focus_kw}
- title: ${type} Tarot: Birth Cards, Crystals & Cognitive Functions (${t.nickname})
- h1: ${type} Tarot: Your ${pCard} Birth Card, Crystals & Growth Path
- URL: /${postSlug}/
- word_count_target: 2800-3200
- group: ${t.group} (${t.nickname})
- primary_card: ${pCard} (\`/${primarySlug}\`)
- growth_card: ${gCard} (\`/${growthSlug}\`)
- competitor_research: Cosmopolitan (Court Cards mapping — 我们 Major Arcana 双牌差异化) + beanlex crystal allies 结构 + PAA 问题命中 (What tarot card is ${type})

## 正文

# ${type} Tarot: Your ${pCardH1} Birth Card, Crystals & Growth Path

If you know your four letters and you've ever wondered which tarot card actually maps to your type — beyond the standard court-card lists — you're in the right place. This guide pairs the ${type} (${t.nickname}) personality with a primary birth card (${pCard}) and a growth card (${gCard}), drawn from Jungian cognitive functions rather than the more common court-card assignments, then matches each layer to specific crystals and an Eastern contemplative anchor.

${tEn.upright_reading}

*MBTI is a registered trademark of The Myers-Briggs Company. This is an independent framework based on Jungian cognitive functions (Ni/Ne/Si/Se/Ti/Te/Fi/Fe), offered for self-reflection — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company. Mapping decisions are our own editorial interpretation.*

## What Tarot Card Is ${type}?

The most common way to assign a tarot card to ${type} — what you'll find on most lifestyle sites — maps the 16 MBTI types onto the 16 **Court Cards** (Page/Knight/Queen/King of each suit). That system works, but it leaves the Major Arcana — the 22-card story-arc of the deck — entirely unused for personality mapping.

We take a different route. We map ${type} to **${pCard}** as your primary birth card in the Major Arcana, because ${pCard}'s archetype aligns with your dominant cognitive function (${FUNC_FULL[cs.dominant]}). ${tEn.birth_cards.primary.reason}

Why Major Arcana over Court Cards for ${type}? The Court Cards describe a *social role* — what you look like to others. The Major Arcana describes a *psychological archetype* — the inner pattern that produces that role. For self-reflection work, the inner pattern is the more useful anchor. You can pair the two systems: your Court Card tells you how you tend to show up; ${pCard} tells you why.

To go deeper on the card itself, read our [${pCard} meaning page](${pCardLink}).

### How to Recognize ${pCard} Energy in a ${type} Reading

When you pull ${pCardArt} in a personal reading, the card is usually pointing at one of three things for ${type}: (1) your dominant ${cs.dominant} is being asked to lead — trust the pattern you're seeing even if others haven't confirmed it yet; (2) you've drifted into the shadow side of the card and the reading is asking you to course-correct; or (3) a growth invitation is arriving through the card's archetype — usually a call to integrate something your auxiliary or inferior function has been resisting. The card isn't a verdict; it's a mirror. Notice which of the three resonates before you reach for an interpretation.

A simple daily practice: pull ${pCardArt} each morning for a week, place it next to one of the crystals recommended below, and write one sentence in a journal — *where did this card's theme show up yesterday, and where is it being asked to show up today?* By day seven you'll have a small dataset of how the archetype actually moves through your ${type} life, which is more useful than any keyword list.

## Your Growth Card: ${gCard}

A birth card reading isn't complete with only one card. We pair ${type}'s primary card with a **growth card**: ${gCard}. Where ${pCard} is the energy you carry naturally, ${gCard} is the energy that develops you — the invitation that arrives when the primary card tips into shadow.

${tEn.birth_cards.growth.reason}

The two-card structure gives you a reflective practice: notice when you're over-extending ${pCardArt}'s energy, then deliberately invoke ${gCardArt}'s. Read our [${gCard} meaning page](${gCardLink}) for the full card interpretation.

### A Practical Two-Card Spread for ${type}

Here's a small spread designed specifically for the ${type} primary/growth dynamic. Pull both cards each week — ${pCardArt} first, ${gCardArt} second — and place them side by side with a ${t.crystals[0].name} on the first card and a ${t.crystals[2].name} on the second.

- **Card 1 (${pCard})**: *Where is my primary energy being called for this week?* — Name the project, relationship, or inner pattern where your dominant ${cs.dominant} should lead.
- **Card 2 (${gCard})**: *Where is my growth edge showing up?* — Name the place where leaning into ${FUNC_FULL[cs.auxiliary]} (auxiliary) or ${FUNC_FULL[cs.inferior]} (inferior) would shift something ${pCardArt} alone cannot move.

Notice whether the two cards agree or pull against each other. When they pull apart, that's the very tension the growth card exists to surface — sit with it before you act.

## The ${type} Cognitive Stack

The tarot mapping rests on your four cognitive functions. Here's how the ${type} stack breaks down:

${cogStack}

In plain terms, the four letters of ${type} — **${type.split('').join(' / ')}** — decode as:

${letters}

The dominant-auxiliary pair is what you'll recognize in yourself most easily; the tertiary-inferior pair is where growth and friction live. ${pCard} mirrors your dominant (${cs.dominant}); ${gCard} supports your auxiliary or inferior.

### How the Stack Plays Out in Real Time

The cognitive stack isn't a static portrait — it's a moving system. Your dominant ${cs.dominant} runs constantly in the background; you'd have to work hard to turn it off. The auxiliary ${cs.auxiliary} is what you reach for when the dominant needs a partner — usually developing in your teens and twenties until you can hold both with ease. The tertiary ${cs.tertiary} comes online more in your thirties and forties, often surprising you with capacities you didn't know you had. The inferior ${cs.inferior} is the function you'll notice most under stress — it shows up as either a sudden childlike fascination (when you're rested and playful) or a clumsy over-reaction (when you're tired or triggered).

For ${type}, this means: when you're at your best, you're running ${cs.dominant}→${cs.auxiliary} as a fluent pair. When you're under prolonged stress, you're at risk of what's called *being "in the grip"* of your inferior ${cs.inferior} — the exact function you trust least suddenly driving the car. ${pCardArt} reversed (below) is one way of describing that grip state. The growth card ${gCardArt} is the road back out.

## Crystals for ${type}

We match three crystal allies to the ${type} stack — not generic "good vibes" stones, but specific anchors for specific layers of your psychology. Each one corresponds to a different position in the cognitive stack.

${crystalSection}

**Shop ${type} crystals:** we've grouped the stones that suit this type's energy — [explore ${type} crystals](${shopPrimary}). If a specific stone is out of stock, [browse the search results](${shopFallback}) for similar pieces.

### How to Work With These Three Stones

Don't try to use all three at once. A simple rotation: place the ${t.crystals[0].name} on your desk or reading table during deep ${cs.dominant}-led work (it's the primary anchor, matching your dominant function and ${pCard}'s archetype). Carry the ${t.crystals[1].name} in a pocket or wear it as jewelry for daily practice — it supports the kind of attention your auxiliary ${cs.auxiliary} asks for in real time. Reserve the ${t.crystals[2].name} for moments when you sense the shadow reading below arriving — it's the growth card's tactile cue, an invitation to invoke ${gCardArt}'s energy rather than forcing more effort through ${pCardArt}.

Cleansing and clearing these stones is part of the practice — the [crystal cleansing timer tool](/tools/crystal-cleansing-timer/) walks through methods if you're new to it.

## The Eastern Anchor

${tEn.eastern_anchor}

This is the differentiator. Most ${type} tarot guides stop at the card-meaning level. We add the Eastern contemplative layer because it gives you a *practice*, not just an interpretation — a way to inhabit ${pCard}'s archetype in your body, not just your reading journal. Pair the card with the crystal and the practice, and you have a three-point daily ritual: see the card, hold the stone, sit with the breath.

### A Three-Step ${type} Daily Ritual

1. **See** — Place ${pCardArt} (or its image) where you'll see it within the first hour of waking. Don't interpret it; let the image land.
2. **Hold** — Pick up your ${t.crystals[0].name} for thirty seconds. Notice temperature, texture, weight. This is the body's way of entering the archetype.
3. **Sit** — Three minutes of breath, eyes closed. When ${pCardArt}'s theme surfaces in thought or sensation, let it move; don't fix it. When ${gCardArt}'s theme surfaces as an impulse to act or shift, note it for the day.

The whole ritual takes under five minutes. Its job isn't mystical — it's *attentional training*, the same way athletes visualize before performance. You're teaching your nervous system to recognize ${pCardArt} when it shows up in the wild.

## ${type} in Love

${extras.loveTheme}

The ${pCard} energy in relationship asks for ${cs.dominant === 'Ni' || cs.dominant === 'Fi' ? 'depth over breadth — fewer connections, more truth in each one' : cs.dominant === 'Fe' ? 'emotional honesty, even when it rocks the harmony' : cs.dominant === 'Te' ? 'a partner who meets your standard without being flattened by it' : 'presence — being met in the moment, not in the plan'}. The shadow to watch is ${(tEn.reversed_shadow.split(/[.。—]/)[0] || tEn.reversed_shadow).trim().slice(0, 120)}.

### Compatibility Notes for ${type}

The cognitive-function lens suggests the most natural resonance for ${type} tends to land with types whose dominant or auxiliary functions complement rather than mirror yours — specifically ${t.related_types.join(', ')} (linked below). But "compatibility" in tarot terms isn't a fixed verdict; it's an energetic conversation. Two people who share a primary card can do deep mirror work; two people whose primary and growth cards cross can accelerate each other's arc. Read each match through both cards (primary + growth), not just the four letters, and the picture sharpens.

## ${type} at Work

${extras.careerTheme}

### The ${type} Career Pitfall (and How ${gCardArt} Addresses It)

The shadow of ${pCardArt} at work — when the card flips reversed, as it were — looks like ${(tEn.reversed_shadow.split(/[.。—]/)[0] || tEn.reversed_shadow).trim().slice(0, 200)}. The growth card ${gCardArt} is the specific medicine: where ${pCardArt} over-extends, ${gCardArt} invites the missing movement. Practically, this means: when you catch yourself ${cs.dominant === 'Ni' || cs.dominant === 'Ti' ? 'withdrawing into analysis past the moment of decision' : cs.dominant === 'Te' ? 'imposing structure past the point where it serves the actual people' : cs.dominant === 'Fe' ? 'managing the room\'s emotions at the cost of your own truth' : cs.dominant === 'Fi' ? 'refining the inner value at the cost of shipping the work' : cs.dominant === 'Ne' ? 'generating possibilities past the point of useful action' : cs.dominant === 'Se' ? 'reacting to the live moment past the point of strategic pause' : cs.dominant === 'Si' ? 'defaulting to precedent past the point of fresh data' : 'over-leaning on the dominant function'}, pause and ask *what would ${gCardArt} do here?* That single question, asked honestly, often dissolves the loop.

## ${type} Personal Growth Path

${extras.growthTheme}

The crystals support this arc: ${t.crystals[0].name} anchors the primary card's contemplation, ${t.crystals[1].name} supports daily practice, and ${t.crystals[2].name} invites the growth card's motion. Carry all three across a season and notice which one your hand reaches for — that's data about where you are in the ${pCardArt}→${gCardArt} arc.

## FAQ

${faqSection}

## Try Our MBTI Tarot Tool

This article is the long-form reference. For an interactive version — input your four letters and receive the primary/growth card pair, crystal recommendations, and a daily practice prompt — try our [MBTI Tarot Tool](/tools/mbti-tarot/).

## Keep Exploring

Related types that share cognitive functions or elemental energy with ${type}:

${relatedCards}

Card meanings referenced in this reading:

- [${pCard} meaning](${pCardLink})
- [${gCard} meaning](${gCardLink})

Crystals referenced:

- [${t.crystals[0].name} meaning](/${t.crystals[0].slug}/)
- [${t.crystals[1].name} meaning](/${t.crystals[1].slug}/)
- [${t.crystals[2].name} meaning](/${t.crystals[2].slug}/)

*Brief trademark notice: MBTI and Myers-Briggs are trademarks of The Myers-Briggs Company. This independent framework is not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company.*
`;

  return { slug, postSlug, focus_kw, md, primary_card: primarySlug, growth_card: growthSlug, crystals: t.crystals.map(c => c.slug.replace(/-meaning$/, '')) };
}

// ---------- 生成全部 16 篇 ----------
const out = [];
const index = [];
for (const type of TYPE_ORDER) {
  const t = mbti.types[type];
  if (!t) { console.error('缺 type: ' + type); continue; }
  const r = buildArticle(type, t);
  fs.writeFileSync(path.join(BASE, 'articles', r.slug + '.md'), r.md, 'utf8');
  out.push({ type, ...r });
  index.push({ slug: r.slug, postSlug: r.postSlug, type, primary_card: r.primary_card, growth_card: r.growth_card, crystals: r.crystals, focus_keyword: r.focus_kw });
  console.log('✓ ' + type + ' → ' + r.slug + '.md');
}

// articles-index.json（供 upload 脚本消费）
fs.writeFileSync(path.join(BASE, 'configs', 'articles-index.json'), JSON.stringify({ total: index.length, articles: index }, null, 2), 'utf8');
console.log('\n生成 ' + out.length + ' 篇，索引 → configs/articles-index.json');
