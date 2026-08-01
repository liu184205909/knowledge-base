# -*- coding: utf-8 -*-
"""填充 mercury-retrograde.json 的所有 {{AI_*}} 占位符（人写高质量正文，基于竞品精读+占星数据+知识库）
遵循框架 v2 全部硬约束：差异化/三要素/合规/去AI化禁词=0
"""
import json, os, re

DIR = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/15.astrology'
P = os.path.join(DIR, 'articles', 'mercury-retrograde.json')
art = json.load(open(P, 'r', encoding='utf-8'))

FILLS = {
'AI_INTRODUCTION': '<p>Three or four times each year, the planet Mercury appears to reverse direction against the zodiac for roughly three weeks — and the phrase "crystals for Mercury Retrograde" becomes one of the most-searched topics in the crystal world. Astrologically, Mercury rules communication, travel, technology, contracts, and mental clarity, so its apparent backward motion is traditionally read as a season to slow down, double-check details, and lean into the <em>re-</em> prefixes: review, revise, reconnect, redo. This guide pulls together the crystals most consistently recommended for that season by Energy Muse, Crystals.com, and The Crystal Council — and adds the jewelry-focused, Eastern-aware framing that a healing-jewelry site is uniquely positioned to offer.</p>',

'AI_TLDR': '<p>Mercury Retrograde is the roughly three-week period, occurring about three times a year, when Mercury appears to move backward from Earth\'s vantage point. Astrologically it is read as a review season — a time when communication, travel, and technology can feel tangled, and the prevailing advice is to slow down, finish what is unfinished, and re-check details rather than launch brand-new ventures.</p>',

'AI_MEANING': '<p>Mercury Retrograde is not literally a backward movement — Mercury never reverses its orbit. It is an apparent reversal, the same optical effect that makes a faster train look like it is sliding backward when you pass it on the highway. Because Mercury completes a shorter orbit than Earth, it overtakes us roughly three times a year, and for about three weeks each time it appears to retrace its path against the backdrop of the zodiac.</p><p>In astrological tradition, Mercury is the planet of the thinking mind — it rules speech and writing, short travel, technology and devices, contracts and agreements, and the fine-grained mental clarity needed to track details. When Mercury appears to reverse, the symbolic reading is that those domains enter a review phase rather than a launch phase. The classic advice is to favor the <em>re-</em> words: <em>review</em> a draft before sending, <em>revise</em> a plan rather than start a new one, <em>reconnect</em> with someone from the past, <em>redo</em> what was rushed. None of this means life must pause. It means the season rewards care over speed, and double-checking over assuming.</p><p>The three Mercury Retrogrades of 2026 fall in Pisces (Feb 26 – Mar 20), Cancer (Jun 29 – Jul 23), and Scorpio (Oct 24 – Nov 13), each tinting the review period with the qualities of the sign it passes through — emotional and boundary-blurring in Pisces, home-and-family focused in Cancer, depth-and-shadow oriented in Scorpio.</p>',

'AI_EXPECT_INTRO': '<p>During a Mercury Retrograde, you may notice a familiar cluster of friction points. None of them are inevitable, and none are punishments — they are the kinds of details that slip when the prevailing energy rewards speed, surfacing so they can be addressed deliberately rather than rushed past.</p>',

'AI_RITUAL': '<p>A simple Mercury Retrograde practice is to choose one <em>re-</em> action and pair it with a single stone for the duration of the cycle. Pick an unfinished project, a draft that needs a final read, or a conversation you have been postponing — something that asks for review rather than launch. Hold a piece of Fluorite or Labradorite for two minutes while you name the task aloud, then place the stone on your desk as a physical cue to return to that one piece of unfinished business each day of the retrograde. Keep Black Tourmaline near your workspace or front door as a grounding anchor when the day feels scattered, and carry Amazonite or wear it as jewelry on days when honest, clear communication matters. The crystals are anchors for intention — reminders to slow down and choose care over speed — not guarantees of a smooth transit.</p>',

'AI_SIGN_INTRO': '<p>Each Mercury Retrograde moves through a specific zodiac sign, and the sign colors the kind of review the period asks for. The crystals most often recommended shift accordingly — here are three of the most common sign placements and the stones traditionally paired with each.</p>',

'AI_CRYSTALS_INTRO': '<p>The six stones below are the ones most consistently recommended for Mercury Retrograde across Energy Muse, Crystals.com, The Crystal Council, and the broader crystal community. Each is chosen to support a different facet of the season — mental clarity, clear speech, energetic protection, intuitive reading of what surfaces, grounding, and daily wear — so you can match the stone to the kind of support the day asks for rather than reaching for a single all-purpose piece.</p>',

'AI_EASTERN': '<p>In the Vedic astrological tradition (Jyotish), Mercury is called <em>Budha</em> — not to be confused with the historical Buddha — and it governs <em>buddhi</em>, the discriminative intellect that sorts clear thinking from noise. Budha\'s color is green, linking Mercury to growth, communication, and the regulation of the nervous system; the traditional Vedic gem for a strengthened Mercury is the Emerald (<em>Panna</em>). The Western crystal approach borrows Mercury\'s clarity theme through stones like Fluorite and Amazonite rather than prescribing astrological remedies, but the underlying correspondence — green, mind-clearing, communication-supporting — is shared. Tibetan elemental astrology reads planetary reversals similarly: as energetic review cycles rather than misfortune, inviting reflection and recalibration rather than fear. Across both traditions, the consistent guidance is that a retrograde period is for turning inward and recalibrating, not for bracing against ill fortune.</p>',

'AI_LENSES': '<p>Mercury Retrograde can be read from more than one angle, and the most useful take is usually the one that combines them. Three lenses tend to surface the most practical guidance.</p>',

'AI_LENS_ASTRO': '<p>Astrologically, Mercury Retrograde is a scheduled review season — roughly three weeks, three times a year, when the planet of communication and detail appears to reverse. The tradition treats it as a time favoring the <em>re-</em> prefixes (review, revise, reconnect) over new launches, and as a window when past people, projects, and conversations often resurface for a second look.',

'AI_LENS_PSYCH': '<p>Psychologically, the value of Mercury Retrograde is best understood as cognitive pacing — the practice of pausing before reacting, double-checking details under stress, and integrating unfinished information before committing to a new decision. The research on implementation intentions and reflective review suggests that building deliberate slow-downs into high-communication periods improves accuracy and reduces reactivity, which maps neatly onto the traditional advice to favor review over launch.',

'AI_LENS_CRYSTAL': '<p>As a crystal companion, the season pairs naturally with stones traditionally associated with mental clarity (Fluorite), clear communication (Amazonite), energetic protection (Black Tourmaline), and grounding (Hematite). The crystals function as tactile anchors for the intention to slow down and choose care — physical reminders you can hold, place on a desk, or wear as jewelry when the day\'s details ask for extra attention.',

'AI_SHOP': '<p>Because Mercury Retrograde asks for grounding, clarity, and protection you can keep close through a three-week season, jewelry is one of the most practical ways to work with these stones daily. A bracelet or necklace stays with you through conversations, travel, and the scattered moments when reaching for a loose stone is impractical. The pieces below are from the crystal-jewelry collections already on site — each links to its stone\'s dedicated category so you can choose by the quality you want to lean on most this retrograde.</p>',

'AI_RELATED': '<p>If Mercury Retrograde resonates with the kind of seasonal energy you want to prepare for, the related guides below extend the same framing — grounding, protection, and ritual practices — to the other major astrological events. Venus Retrograde covers the heart-and-values review season that follows a similar logic, while the Full Moon and Eclipse guides address the release and acceleration cycles that often overlap with retrograde periods.</p>',

'AI_FAQ_0': '<p>The crystals most consistently recommended for Mercury Retrograde are Fluorite (for mental clarity and organization), Black Tourmaline (for grounding and energetic protection), Labradorite (for intuition and reading what the period surfaces), Amazonite (for clear communication), Hematite (for grounding), and Clear Quartz (for general clarity). Energy Muse, Crystals.com, and The Crystal Council all name variants of this list. The most practical choice depends on the kind of support the day asks for — clarity, protection, or communication.</p>',

'AI_FAQ_1': '<p>The traditional guidance is to avoid signing major contracts, making large purchases (especially electronics or vehicles), and launching brand-new projects during the core retrograde window — favoring instead the <em>re-</em> activities like reviewing, revising, and reconnecting. This is not a hard rule that life must pause; it is a recommendation to double-check details, build in extra time, and finish unfinished business rather than initiate under a season that rewards care over speed. If a decision cannot wait, the consistent advice is simply to read every line and confirm every detail before committing.</p>',

'AI_FAQ_2': '<p>Protecting your energy during Mercury Retrograde comes down to pacing and grounding. Build in more time than usual for travel and communication, pause and breathe before responding to tense messages, and keep a grounding stone like Black Tourmaline or Hematite nearby when the day feels scattered. Journaling, card-pulling, or a short morning practice of naming intentions can also help you stay clear and non-reactive. The goal is not to brace against the transit but to meet it with deliberate slowness.</p>',

'AI_FAQ_3': '<p>Yes — wearing Mercury Retrograde crystals as jewelry is one of the most practical ways to work with them through the three-week season. A bracelet or necklace keeps a grounding stone like Hematite or a communication stone like Amazonite close through conversations, travel days, and tech-heavy meetings, when reaching for a loose stone is impractical. Jewelry also tends to be more durable and lower-maintenance than raw stones, which suits the everyday nature of retrograde support.</p>',

'AI_FAQ_4': '<p>No astrological transit — including Mercury Retrograde — is inherently "bad." These cycles are traditionally read as invitations to slow down, review, and grow, not as predictions of misfortune. Mercury Retrograde in particular is best treated as a built-in review season: a time to finish what is unfinished, re-check details, and reconnect with what matters, rather than a period to fear. The friction points it surfaces (miscommunications, tech glitches, resurfaced past issues) are exactly the kinds of details that benefit from deliberate attention.</p>',

'AI_FAQ_5': '<p>Astrology is a symbolic language used for self-reflection, not a system that predicts fixed future events. Mercury Retrograde surfaces themes and questions — around communication, detail, and unfinished business — but your choices and actions determine what actually happens. The transit is best used as a mirror for where to slow down and what to review, not as a forecast of specific outcomes.</p>',
}

content = art['content']
for k, v in FILLS.items():
    content = content.replace('{{' + k + '}}', v)
art['content'] = content

# 清除生产骨架遗留的 DiffHint/提示行（给填充者看的，不应出现在线上内容）
# 匹配整个 <p>...提示...</p> 段（em 标签可能在段内任意位置，段内含 DiffHint/合规/Ritual/Eastern/shared halves 等关键词）
content = re.sub(r'<p>[^<]*(?:<[^>p][^>]*>)?[^<]*(?:DiffHint|Ritual focus|Eastern anchor|shared halves|is_doom|can_predict)[^<]*</p>', '', content, flags=re.IGNORECASE)
# 更稳妥：逐行清理——删除任何包含 DiffHint/合规 shared/shared halves 的整个 <p>...</p> 块
def strip_hint_blocks(c):
    out = []
    parts = re.split(r'(<p>.*?</p>)', c, flags=re.DOTALL)
    for part in parts:
        if part.startswith('<p>') and part.endswith('</p>'):
            if re.search(r'DiffHint|shared halves|is_doom|can_predict|Ritual focus:|Eastern anchor:', part):
                continue
        out.append(part)
    return ''.join(out)
content = strip_hint_blocks(content)
content = re.sub(r'\n{3,}', '\n\n', content).strip()
art['content'] = content

# 去 AI 化预校验（禁词 = 0 才算通过）
DETERMINISM = [r'\bdestined\b', r'\bdestiny\b', r'\bguaranteed\b', r'\bwill heal\b', r'\bwill attract\b', r'\bwill bring\b', r'\bmeant to\b', r'\bborn to\b', r'\bcure\b', r'\bsuperior\b', r'\bdoom\b', r'\bcursed\b', r'\bcatastrophe\b']
DOOM = [r'\bdoom\b', r'\bdisaster\b', r'\bcursed\b', r'\bbad luck\b', r'\bmisfortune will\b']
text = re.sub(r'<[^>]+>', ' ', content).lower()
hits = []
for p in DETERMINISM + DOOM:
    m = re.search(p, text)
    if m and not re.search(r'not a guarantee|not guaranteed|no guarantee|rather than a doom|doom period', text[max(0,m.start()-40):m.end()+40]):
        hits.append(m.group(0))
# 残留占位符
remain = re.findall(r'\{\{AI_[A-Z_0-9]*\}\}', content)

json.dump(art, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('[OK] mercury-retrograde filled')
print('字数(去标签):', len(text.split()))
print('残留占位符:', len(remain), remain if remain else 'NONE')
print('去AI化禁词命中:', len(hits), hits if hits else 'NONE (PASS)')
