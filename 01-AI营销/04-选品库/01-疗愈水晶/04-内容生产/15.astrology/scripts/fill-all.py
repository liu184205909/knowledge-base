# -*- coding: utf-8 -*-
"""通用填充：基于 astrology-knowledge.json 结构化数据 + 模板生成 5 篇事件正文
数据驱动（每篇字段已人写精炼：astrology_meaning/what_to_expect/psych_lens/eastern_lens/ritual_focus/invitation_framing）
差异化由 module_weights 保证；合规口径从 gentle_note/faq_shared_halves 注入；清除所有 DiffHint 提示行
mercury-retrograde 已用人写脚本完成，此脚本处理其余 5 篇 + Hub
"""
import json, os, re

DIR = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/15.astrology'
KNOW_PATH = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/_shared/astrology-knowledge.json'
KNOW = json.load(open(KNOW_PATH, 'r', encoding='utf-8'))

# mercury-retrograde 已用专用脚本填充，跳过
SKIP = {'mercury-retrograde'}

def gen_fills(ev, gentle_note, halves):
    name = ev['name']
    wte = ev['what_to_expect']
    am = ev['astrology_meaning']
    inv = ev['invitation_framing']
    return {
      'AI_INTRODUCTION': f"<p>{am.split('. ')[0]}. The search for the right crystals to work with during {name} is one of the most common questions in the crystal world, and this guide brings together the stones most consistently recommended for the season — with the jewelry-focused, Eastern-aware framing a healing-jewelry site is uniquely positioned to offer.</p>",
      'AI_TLDR': f"<p>{am}</p>",
      'AI_MEANING': f"<p>{am}</p><p>The traditional reframing is worth stating plainly: {inv.lower()}</p><p>Psychologically, the most useful reading of {name} is as {ev['psych_lens']}.</p>",
      'AI_EXPECT_INTRO': f"<p>During {name}, you may notice a familiar cluster of themes. None are inevitable or punishing — they are the kinds of patterns that benefit from being noticed and worked with deliberately rather than rushed past.</p>",
      'AI_CRYSTALS_INTRO': f"<p>The stones below are the ones most consistently recommended for {name} across the major crystal reference sites, each chosen to support a different facet of the season. You can match the stone to the kind of support the day asks for rather than reaching for a single all-purpose piece.</p>",
      'AI_RITUAL': f"<p>A simple {name} practice is to pair one stone with one intentional action for the duration of the season. {ev['ritual_focus'].capitalize()}. Hold your chosen stone for two minutes while you name the intention aloud, then keep it on your desk, nightstand, or wear it as jewelry as a physical cue to return to that practice each day. The crystal is an anchor for intention — a reminder to slow down and choose care — not a guarantee of a particular outcome.</p>",
      'AI_EASTERN': f"<p>{ev['eastern_lens']}</p><p>Across both Vedic and Tibetan traditions, the consistent guidance for {name} is to treat it as a period for turning inward and recalibrating, not for bracing against ill fortune. The Western crystal approach borrows the same thematic correspondence — grounding, clarity, protection, release — through stones rather than prescribing astrological remedies.</p>",
      'AI_LENSES': f"<p>{name} can be read from more than one angle, and the most useful take is usually the one that combines them. Three lenses tend to surface the most practical guidance.</p>",
      'AI_LENS_ASTRO': f"<p>Astrologically, {am.split('.')[0]}. The tradition treats {name.lower()} as {inv.lower().replace('rather than ', 'less ').replace(' is best treated', ', and more as')}</p>",
      'AI_LENS_PSYCH': f"<p>Psychologically, the value of {name} is best understood as {ev['psych_lens']}. Building deliberate slow-downs, release rituals, or intention-setting practices into these periods tends to improve accuracy and reduce reactivity, which maps neatly onto the traditional advice.</p>",
      'AI_LENS_CRYSTAL': f"<p>As a crystal companion, the season pairs naturally with stones traditionally associated with the qualities {name} asks for — grounding, clarity, protection, or release depending on the event. The crystals function as tactile anchors for the intention to slow down and work with the season deliberately — physical reminders you can hold, place on a desk, or wear as jewelry.</p>",
      'AI_SIGN_INTRO': f"<p>Each {name} is colored by the zodiac sign it moves through, and the crystals most often recommended shift accordingly. Below are common sign placements and the stones traditionally paired with each.</p>",
      'AI_SHOP': f"<p>Because {name} asks for grounding, clarity, protection, or release you can keep close through a full season, jewelry is one of the most practical ways to work with these stones daily. A bracelet or necklace stays with you through the conversations, decisions, and emotional moments when reaching for a loose stone is impractical. The pieces below link to their stone's dedicated category so you can choose by the quality you want to lean on most.</p>",
      'AI_RELATED': f"<p>If {name} resonates with the kind of seasonal energy you want to prepare for, the related guides below extend the same framing to the other major astrological events. The Full Moon and New Moon guides cover the monthly release and seeding cycles, while the retrograde and eclipse guides address the review and acceleration windows that often overlap.</p>",
      # FAQ 6 题（4 seed + 2 shared halves）
      'AI_FAQ_0': f"<p>The crystals most consistently recommended for {name} are listed in the guide above — each chosen to support a different facet of the season, from grounding and protection to clarity and release. The most practical choice depends on the kind of support the day asks for. {', '.join(c['name'] for c in list(ev['crystals'].values())[:3])} are among the most frequently named across the major crystal reference sites.</p>",
      'AI_FAQ_1': f"<p>The traditional guidance for {name} is to favor review, release, and careful attention over launching brand-new ventures — to double-check details, finish unfinished business, and build in extra time for the domains the season touches. This is not a rule that life must pause; it is a recommendation to meet the period with deliberate care rather than rushing. If a decision cannot wait, the consistent advice is to read every line and confirm every detail before committing.</p>",
      'AI_FAQ_2': f"<p>Protecting your energy during {name} comes down to pacing and grounding. Build in more time than usual, keep a grounding stone nearby when the day feels scattered, and use short reflective practices — journaling, intention-setting, or a moment of breath before responding — to stay clear and non-reactive. The goal is to meet the season with deliberate slowness rather than to brace against it.</p>",
      'AI_FAQ_3': f"<p>Yes — wearing {name} crystals as jewelry is one of the most practical ways to work with them through a full season. A bracelet or necklace keeps a grounding or clarity stone close through conversations, decisions, and the everyday moments when reaching for a loose stone is impractical. Jewelry also tends to be more durable and lower-maintenance, which suits the everyday nature of seasonal support.</p>",
      'AI_FAQ_4': '<p>' + halves['is_doom_first_half'] + '</p>',
      'AI_FAQ_5': '<p>' + halves['can_predict_future_first_half'] + '</p>',
    }

def strip_hint_blocks(c):
    out = []
    parts = re.split(r'(<p>.*?</p>)', c, flags=re.DOTALL)
    for part in parts:
        if part.startswith('<p>') and part.endswith('</p>'):
            if re.search(r'DiffHint|shared halves|is_doom|can_predict|Ritual focus:|Eastern anchor:', part):
                continue
        out.append(part)
    return ''.join(out)

DETERMINISM = [r'\bdestined\b', r'\bdestiny\b', r'\bguaranteed\b', r'\bwill heal\b', r'\bwill attract\b', r'\bwill bring\b', r'\bmeant to\b', r'\bborn to\b', r'\bcure\b', r'\bsuperior\b', r'\bdoom\b', r'\bcursed\b', r'\bcatastrophe\b', r'\bdisaster\b', r'\bbad luck\b', r'\bmisfortune will\b']

gentle = KNOW['gentle_note']
halves = KNOW['faq_shared_halves']
summary = []

for ev in KNOW['events']:
    if ev['slug'] in SKIP:
        continue
    P = os.path.join(DIR, 'articles', ev['slug'] + '.json')
    art = json.load(open(P, 'r', encoding='utf-8'))
    fills = gen_fills(ev, gentle, halves)
    content = art['content']
    for k, v in fills.items():
        content = content.replace('{{' + k + '}}', v)
    # 清除提示行
    content = strip_hint_blocks(content)
    content = re.sub(r'\n{3,}', '\n\n', content).strip()
    art['content'] = content
    # 预校验
    text = re.sub(r'<[^>]+>', ' ', content).lower()
    hits = []
    for p in DETERMINISM:
        m = re.search(p, text)
        if m and not re.search(r'not a guarantee|not guaranteed|no guarantee|rather than|not a prediction|not inherently', text[max(0,m.start()-50):m.end()+50]):
            hits.append(m.group(0))
    remain = re.findall(r'\{\{AI_[A-Z_0-9]*\}\}', content)
    json.dump(art, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    wc = len(text.split())
    summary.append((ev['slug'], wc, len(remain), len(hits), hits))
    print(f"[OK] {ev['slug']}: words={wc} placeholders={len(remain)} forbidden={len(hits)}{(' '+str(hits)) if hits else ''}")

print("\n=== 5 篇填充完成 ===")
print("ALL PASS" if all(r==0 and h==0 for _,_,r,h,_ in summary) else "NEED REVIEW")
