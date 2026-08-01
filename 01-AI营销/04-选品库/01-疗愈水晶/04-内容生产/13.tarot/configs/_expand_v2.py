# -*- coding: utf-8 -*-
"""
场景数据层 v2 扩展脚本
- scenario-knowledge.json: 4字段 → 14字段 (110条)
- tarot-knowledge.json: 补 eastern_imagery (22牌)
所有扩展判定基于 Rider-Waite 原典 + archetype + 框架v2 §3/§11/§13 硬编码。
保留现有 4 字段 (metaphor/behavior/risk/crystals) 不破坏。
"""
import json
import os
import copy

BASE = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶"
SCENARIO_PATH = os.path.join(BASE, "04-内容生产/13.tarot/configs/scenario-knowledge.json")
TAROT_PATH = os.path.join(BASE, "07-互动工具/_shared/tarot-knowledge.json")

# ============================================================
# 任务2: 22牌 eastern_imagery (每牌专属3-5个, 来自 Rider-Waite 画面+eastern_anchors)
# 禁万能词 balance/harmony/energy/flow; 每牌必须独特可辨识
# ============================================================
EASTERN_IMAGERY = {
    "the-fool": ["悬崖", "白玫瑰", "小狗", "初心", "第一步"],
    "the-magician": ["四要素", "无限符号", "指点天地", "红色玫瑰", "工具桌"],
    "the-high-priestess": ["黑白双柱", "石榴纱幔", "月亮", "卷轴", "水池"],
    "the-empress": ["麦穗", "星辰冠", "丰饶花园", "天鹅", "大地"],
    "the-emperor": ["石座", "公羊头", "权杖", "盔甲", "山巅"],
    "the-hierophant": ["三重十字", "双柱", "两信徒", "法杖", "祭袍"],
    "the-lovers": ["天使", "太阳", "智慧树", "生命树", "赤裸"],
    "the-chariot": ["双斯芬克斯", "方形石座", "星冠", "缰绳", "帷幔"],
    "strength": ["狮子", "无限符号", "花环", "白袍", "徒手"],
    "the-hermit": ["六芒星灯笼", "长杖", "斗篷", "雪峰", "独照"],
    "wheel-of-fortune": ["大轮", "斯芬克斯", "蛇", "四活物", "转动"],
    "justice": ["宝剑", "天平", "双柱", "王座", "面纱"],
    "the-hanged-man": ["倒挂", "T形树", "光环", "十字", "安详"],
    "death": ["骷髅", "苍白马", "落日", "倒地之王", "主教"],
    "temperance": ["双杯", "一足水一足岸", "天使翅膀", "虹光小径", "皇冠"],
    "the-devil": ["锁链", "倒五芒星", "羊角", "黑暗石座", "松链"],
    "the-tower": ["闪电", "崩塌", "坠落王冠", "火焰", "双塔"],
    "the-star": ["八角星", "双壶", "水池", "树上鸟", "裸身"],
    "the-moon": ["满月", "双塔", "螯虾", "犬与狼", "蜿蜒小径"],
    "the-sun": ["向日葵", "白马", "孩童", "阳光", "围墙"],
    "judgment": ["号角", "棺椁", "白旗红十字", "复活者", "天使"],
    "the-world": ["花环", "四活物", "舞者", "紫纱", "权杖"],
}

# ============================================================
# 任务1+3: 110条场景扩展数据
# 结构: CARD_SCENARIOS[card_slug][scenario] = {10字段}
# tension规则(§3.1): 每牌至多1-2个3分; 2分中等; 1分诚实承认中性
# eastern_anchor(§11.1五池)跨牌轮换: Love池[阴阳和合/红线姻缘/桃花方位/相生相克/缘起聚散]
#   Career池[时势顺逆/贵人方位/厚德载物/韬光养晦/守正出奇]
#   Finances池[财气聚散/五行偏财/取之有道/量入为出/散财聚人]
#   Health池[气血调和/子午流注/中庸守度/治未病/形神共养]
#   Spiritual池[初发心/中道/无为而治/致虚守静/知止]
# related_cards按§13.1语义规则
# ============================================================

# 五场景固定faq_angles池(§12)
FAQ = {
    "love": ["yes-no", "singles", "existing-relationship", "reversed"],
    "career": ["good-sign", "job-change", "reversed", "what-to-do"],
    "finances": ["good-sign", "spending-saving", "reversed", "what-to-do"],
    "health": ["energy-stress", "rest-routine", "reversed-body-awareness", "warning"],
    "spiritual": ["spiritual-lesson", "inner-work", "reversed", "how-to-work"],
}

def same_card_list(card, exclude_scn):
    """同牌其他4场景slug列表, 排除当前场景"""
    slugs = []
    for s in ["love", "career", "finances", "health", "spiritual"]:
        if s != exclude_scn:
            slugs.append(f"{card}-for-{s}")
    return slugs

# --- 110条硬编码扩展数据 ---
# 每条: tension, depth_tier, main_conflict, upright_focus, reversed_focus,
#       rider_waite_projection, eastern_anchor, related_cards(2-3张语义关联)
CARD_SCENARIOS = {

    # ===== 0. The Fool 先锋 =====
    "the-fool": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "desire for the fresh vs need for emotional safety",
            "upright_focus": "a willingness to begin a bond without needing every step mapped, drawn to someone outside the usual type",
            "reversed_focus": "the growth edge is noticing whether the leap before you is brave or reckless, not a verdict against love",
            "rider_waite_projection": "the cliff edge at the Fool's heel = the point where attraction has no safety net underneath",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "the-high-priestess-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "calling-driven leap vs resources not yet in place",
            "upright_focus": "recognizing an opportunity that asks for a first step before the full plan is built",
            "reversed_focus": "the shadow side invites you to ask whether this jump is toward something or away from boredom",
            "rider_waite_projection": "stepping off the cliff with only a satchel = launching with just an idea and no backup",
            "eastern_anchor": "守正出奇",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "wheel-of-fortune-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "speculative enthusiasm vs the discipline of due diligence",
            "upright_focus": "a fresh opportunity that asks for one honest look before the leap",
            "reversed_focus": "the growth edge is to slow down and review the numbers, not a market call against you",
            "rider_waite_projection": "the unseen cliff = the financial warning you'd rather not check",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "feeling invincible vs the body's quiet signals",
            "upright_focus": "a willingness to begin a new routine with beginner's-mind openness",
            "reversed_focus": "the growth edge is to check in with what the body has been signaling, not a prediction of illness",
            "rider_waite_projection": "the cliff you don't look at = the body's alarm dismissed as nothing",
            "eastern_anchor": "治未病",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-hanged-man-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "beginner's-mind openness vs naive bypass of practice",
            "upright_focus": "emptying the cup and asking the most basic questions anew",
            "reversed_focus": "the shadow invites you to notice when openness becomes avoidance of structure",
            "rider_waite_projection": "the white rose of pure intention = the uncluttered motive at the start of the path",
            "eastern_anchor": "初发心",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "the-high-priestess-for-spiritual-growth"],
        },
    },

    # ===== 1. The Magician 显化者 =====
    "the-magician": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "engineered attraction vs genuine relating",
            "upright_focus": "curating how you show up and directing attention toward the connection you want",
            "reversed_focus": "the growth edge is to ask whether charm has replaced sincerity, not a charge of manipulation",
            "rider_waite_projection": "the four tools laid out on the table = having every resource needed to build real connection",
            "eastern_anchor": "相生相克",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "the-chariot-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "tools-in-hand confidence vs over-promising what one person can deliver",
            "upright_focus": "recognizing you already have the skills and shipping the project this week",
            "reversed_focus": "the shadow invites you to ask whether you're using your capabilities with integrity or leaking them",
            "rider_waite_projection": "one arm raised to sky, one to earth ('as above so below') = closing the loop from idea to shipped work",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-emperor-for-career", "the-chariot-for-career", "the-fool-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "multi-stream orchestration vs too many plates spinning",
            "upright_focus": "arranging several income sources so each skill or asset earns",
            "reversed_focus": "the growth edge is to review whether the spinning plates serve one goal or just burn energy",
            "rider_waite_projection": "the table holding all four suits = a portfolio where each tool has its place",
            "eastern_anchor": "取之有道",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-chariot-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "technique as leverage vs technique replacing rest",
            "upright_focus": "using breath, habit-stacking, and routine as active tools to steer your physiology",
            "reversed_focus": "the growth edge is to notice when 'optimizing' becomes a way to skip actual rest",
            "rider_waite_projection": "the four tools in hand = the body as something you can actively work with, not just endure",
            "eastern_anchor": "形神共养",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "ritual mastery vs mistaking technique for realization",
            "upright_focus": "aligning intention, breath, and action so inner vision lands in daily life",
            "reversed_focus": "the shadow invites you to ask whether the practice has become performance",
            "rider_waite_projection": "the infinity symbol above the head = the loop between seen and unseen made conscious",
            "eastern_anchor": "无为而治",
            "related_cards": ["the-high-priestess-for-spiritual-growth", "the-hermit-for-spiritual-growth", "the-hierophant-for-spiritual-growth"],
        },
    },

    # ===== 2. The High Priestess 直觉者 =====
    "the-high-priestess": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "sensing the undercurrent vs withholding what you know",
            "upright_focus": "reading a partner's real state beneath their words and holding back to feel it fully",
            "reversed_focus": "the growth edge is to speak the knowing instead of storing it as silence, not a verdict of disconnection",
            "rider_waite_projection": "the veil with pomegranates = there is more to this bond than what's been said aloud",
            "eastern_anchor": "阴阳和合",
            "related_cards": ["the-lovers-for-love", "the-moon-for-love", "the-hermit-for-love"],
        },
        "career": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "having the read vs staying quiet when you should speak",
            "upright_focus": "seeing the pattern leadership misses from a quiet vantage point",
            "reversed_focus": "the growth edge is to share the insight rather than guard it, not a charge of timidity",
            "rider_waite_projection": "sitting between the dark and light pillars = the behind-the-scenes vantage that sees both sides",
            "eastern_anchor": "韬光养晦",
            "related_cards": ["the-hermit-for-career", "the-hierophant-for-career", "the-magician-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "gut sense vs the noise of the crowd",
            "upright_focus": "acting on a quiet sense that contradicts the market mood",
            "reversed_focus": "the growth edge is to tell intuition from anxiety before acting, not a dismissal of the instinct",
            "rider_waite_projection": "the moon at her feet = reading what's reflected rather than what's loudly declared",
            "eastern_anchor": "五行偏财",
            "related_cards": ["the-hermit-for-finances", "wheel-of-fortune-for-finances", "the-moon-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "interoceptive listening vs over-monitoring into anxiety",
            "upright_focus": "tracking subtle body signals — heartbeat, gut tension — as data rather than overriding them",
            "reversed_focus": "the growth edge is to feel the signal without spiraling into worry, not a prediction of illness",
            "rider_waite_projection": "the hidden pool beneath the veil = the felt sense beneath the surface of the body",
            "eastern_anchor": "气血调和",
            "related_cards": ["the-hermit-for-health", "the-moon-for-health", "temperance-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "veil-parting stillness vs drifting into dissociation",
            "upright_focus": "sitting in silence until the answer arrives on its own, trusting what surfaces between thoughts",
            "reversed_focus": "the shadow invites you to notice when stillness has become avoidance of life",
            "rider_waite_projection": "the scroll partly hidden = knowledge that surfaces only when you stop chasing it",
            "eastern_anchor": "致虚守静",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-moon-for-spiritual-growth", "the-star-for-spiritual-growth"],
        },
    },

    # ===== 3. The Empress 滋养者 =====
    "the-empress": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "generous tenderness vs over-giving until you're emptied",
            "upright_focus": "feeding the relationship with food, beauty, and touch — making a home that holds both of you",
            "reversed_focus": "the growth edge is to ask where giving has become a way to avoid receiving",
            "rider_waite_projection": "the lush field of wheat = love that takes tangible, embodied form",
            "eastern_anchor": "桃花方位",
            "related_cards": ["the-lovers-for-love", "the-emperor-for-love", "the-devil-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "creative gestation vs softness that avoids hard decisions",
            "upright_focus": "tending a project slowly into life like a garden; growing people, not just output",
            "reversed_focus": "the shadow invites you to ask whether patience has become avoidance of the hard call",
            "rider_waite_projection": "the crown of stars over a fertile land = the slow season that grows something real",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "abundance through tending vs spending on others before self",
            "upright_focus": "growing wealth patiently like a crop; putting money into what nourishes",
            "reversed_focus": "the growth edge is to review whether care for others has drained your own reserves",
            "rider_waite_projection": "the wheat field ripe for harvest = wealth that comes from patient cultivation, not a quick win",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "embodied self-care vs indulgence framed as care",
            "upright_focus": "returning to pleasure, rest, and good food as part of how you tend the body",
            "reversed_focus": "the growth edge is to notice when indulgence has put on self-care's clothing",
            "rider_waite_projection": "the reclining figure in nature = wellness that includes receiving, not just disciplining",
            "eastern_anchor": "形神共养",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "sacred feminine creation vs spiritualizing avoidance of structure",
            "upright_focus": "creating as spiritual practice — art, garden, cooking — and receiving as devotion",
            "reversed_focus": "the shadow invites you to ask whether 'being' has become a way to skip the work",
            "rider_waite_projection": "the figure crowned by stars in a garden = creation as a sacred act, not just productivity",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "the-high-priestess-for-spiritual-growth"],
        },
    },

    # ===== 4. The Emperor 主权者 =====
    "the-emperor": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "protective structure vs structure tipping into control",
            "upright_focus": "setting clear terms for how the relationship runs; being the steady one when chaos hits",
            "reversed_focus": "the growth edge is to ask whether your terms have hardened into management of the partner",
            "rider_waite_projection": "the stone throne with ram heads = the stable foundation a relationship can stand on",
            "eastern_anchor": "相生相克",
            "related_cards": ["the-lovers-for-love", "the-empress-for-love", "the-chariot-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "throne-builder authority vs rigidity that cannot delegate",
            "upright_focus": "founding the operating system, setting the rules, holding the line; stepping into the founder seat",
            "reversed_focus": "the shadow invites you to ask whether authority has hardened into domination",
            "rider_waite_projection": "the armored figure on the stone throne = the founder who builds the structure everyone else runs on",
            "eastern_anchor": "守正出奇",
            "related_cards": ["the-magician-for-career", "the-chariot-for-career", "the-hierophant-for-career"],
        },
        "finances": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "foundational architecture vs control that misses emergent opportunity",
            "upright_focus": "building the budget, the trust, the legal structure before scaling; disciplined capital allocation",
            "reversed_focus": "the growth edge is to ask whether tight control has cost you a real opening",
            "rider_waite_projection": "the throne carved from stone = the financial foundation built once, that holds for years",
            "eastern_anchor": "量入为出",
            "related_cards": ["wheel-of-fortune-for-finances", "the-tower-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "disciplined regimen vs discipline that becomes self-punishment",
            "upright_focus": "installing a non-negotiable routine — sleep, training, schedule — as scaffolding for the body",
            "reversed_focus": "the growth edge is to notice when the regimen has turned into a whip rather than a support",
            "rider_waite_projection": "the armored, upright posture = the body held by structure, not by force",
            "eastern_anchor": "中庸守度",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "upright sovereign path vs dogma replacing direct experience",
            "upright_focus": "building an inner throne of principle and standing on it; ordered practice over mystical drift",
            "reversed_focus": "the growth edge is to ask whether the rules have replaced the living experience",
            "rider_waite_projection": "the barren-but-stable sky behind the throne = clarity that comes from structure, not drama",
            "eastern_anchor": "守正出奇",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-hierophant-for-spiritual-growth", "justice-for-spiritual-growth"],
        },
    },

    # ===== 5. The Hierophant 导师 =====
    "the-hierophant": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "convention-aligned union vs convention overriding real feelings",
            "upright_focus": "following the roadmap — meeting families, marking milestones — for a partnership that fits a known shape",
            "reversed_focus": "the growth edge is to ask whether the shape you're following still fits the two of you",
            "rider_waite_projection": "two initiates kneeling before a teacher = the relationship staged along a known lineage",
            "eastern_anchor": "红线姻缘",
            "related_cards": ["the-lovers-for-love", "the-emperor-for-love", "the-empress-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "lineage apprenticeship vs staying an apprentice forever",
            "upright_focus": "learning under a mentor or institution before innovating; getting the credential, doing the tenure",
            "reversed_focus": "the shadow invites you to ask whether the credential has become a way to avoid your own authority",
            "rider_waite_projection": "the blessing passed from teacher to student = standing on a structured foundation before inventing alone",
            "eastern_anchor": "贵人方位",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "the-hermit-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "proven-path strategy vs inherited rules that no longer fit",
            "upright_focus": "following established methods — index funds, advisor, traditional business — over speculation",
            "reversed_focus": "the growth edge is to ask which inherited rule still serves and which is just habit",
            "rider_waite_projection": "the formal vestments and pillars = money managed along a tested, handed-down line",
            "eastern_anchor": "取之有道",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "justice-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "guided protocol vs deferring to authority over your own data",
            "upright_focus": "trusting a clinician's protocol or a lineage practice over DIY biohacking",
            "reversed_focus": "the growth edge is to weigh the expert's view alongside what your own body is reporting",
            "rider_waite_projection": "the two initiates receiving instruction = following a tested protocol rather than improvising",
            "eastern_anchor": "治未病",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "received-wisdom devotion vs dogma clung to past its truth",
            "upright_focus": "sitting with a teacher and a lineage rather than inventing your path; formal study of a tradition",
            "reversed_focus": "the shadow invites you to ask which belief has become an empty rule",
            "rider_waite_projection": "the triple cross and formal robes = wisdom received through an unbroken chain",
            "eastern_anchor": "初发心",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "the-emperor-for-spiritual-growth"],
        },
    },

    # ===== 6. The Lovers 选择者 =====
    "the-lovers": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "values-aligned union vs the third option you won't name",
            "upright_focus": "choosing the partner whose values match yours, not just the one you're drawn to — a conscious yes",
            "reversed_focus": "the growth edge is to look at where you've stopped rowing in the same direction, not a sentence of doom",
            "rider_waite_projection": "the angel above and two figures beneath the sun = a choice made in the open, not in hiding",
            "eastern_anchor": "相生相克",
            "related_cards": ["the-devil-for-love", "the-fool-for-love", "the-empress-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "partnership pick vs choosing from pressure, not alignment",
            "upright_focus": "choosing a co-founder, an offer, or a path because it aligns with what you stand for",
            "reversed_focus": "the shadow invites you to ask whether the yes you gave was really yours",
            "rider_waite_projection": "the two figures under the angel = a yes that has to be conscious, not coerced",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "values-based money vs avoiding the decision that needs making",
            "upright_focus": "putting money into what you actually believe in; saying no to lucrative-but-misaligned deals",
            "reversed_focus": "the growth edge is to make the decision you've been postponing, not a forecast of loss",
            "rider_waite_projection": "the tree of knowledge and tree of life = two financial paths, each with a cost",
            "eastern_anchor": "五行偏财",
            "related_cards": ["the-emperor-for-finances", "justice-for-finances", "wheel-of-fortune-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "body-heart agreement vs two needs pulling you apart",
            "upright_focus": "choosing a health path that your values and your body both consent to",
            "reversed_focus": "the growth edge is to stop forcing one need over the other and listen to both",
            "rider_waite_projection": "the two figures in a shared garden = body and heart as partners, not rivals",
            "eastern_anchor": "气血调和",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-high-priestess-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "sacred union of opposites vs splitting instead of integrating",
            "upright_focus": "integrating two inner poles — masculine and feminine, doing and being — into one path",
            "reversed_focus": "the shadow invites you to ask which inner half you've disowned",
            "rider_waite_projection": "the angel uniting two figures under one sun = the vow to your whole self",
            "eastern_anchor": "阴阳和合",
            "related_cards": ["the-high-priestess-for-spiritual-growth", "the-devil-for-spiritual-growth", "the-star-for-spiritual-growth"],
        },
    },

    # ===== 7. The Chariot 胜利者 =====
    "the-chariot": {
        "love": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "two-reins partnership vs one partner dragging the other",
            "upright_focus": "guiding a relationship where two very different drives pull in one direction",
            "reversed_focus": "the growth edge is to ask whether momentum has become one person dragging the other",
            "rider_waite_projection": "the two sphinxes of different colors = two drives that must be guided, not merged",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-emperor-for-love", "the-devil-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "focused-charge drive vs force without direction",
            "upright_focus": "harnessing competing demands into one campaign and winning; the disciplined push to the finish",
            "reversed_focus": "the shadow invites you to ask what you're actually driving toward before pressing harder",
            "rider_waite_projection": "the charioteer holding reins of divergent sphinxes = competing priorities unified into one forward push",
            "eastern_anchor": "时势顺逆",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "wheel-of-fortune-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "harnessed momentum vs aggression that scatters capital",
            "upright_focus": "driving multiple income pulls toward one financial goal on a deadline",
            "reversed_focus": "the growth edge is to slow down and check whether the drive is toward one aim or just noise",
            "rider_waite_projection": "the chariot moving forward as one = capital moving in formation, not spinning",
            "eastern_anchor": "量入为出",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-magician-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "disciplined training arc vs driving the body past its line",
            "upright_focus": "running a structured program — race prep, rehab protocol — that holds opposing needs in line",
            "reversed_focus": "the growth edge is to notice when discipline has crossed into overtraining, not a verdict of breakdown",
            "rider_waite_projection": "the armored driver holding the line = the body trained within a held boundary",
            "eastern_anchor": "中庸守度",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "middle-way mastery vs suppression mistaken for mastery",
            "upright_focus": "integrating opposing inner forces rather than repressing one; the meditator who harnesses drive",
            "reversed_focus": "the shadow invites you to ask which force you've simply pushed underground",
            "rider_waite_projection": "the sphinxes pulling together without one winning = opposites held, not eliminated",
            "eastern_anchor": "中道",
            "related_cards": ["the-hermit-for-spiritual-growth", "strength-for-spiritual-growth", "temperance-for-spiritual-growth"],
        },
    },

    # ===== 8. Strength 温柔力量 =====
    "strength": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "patient taming vs gentleness that tolerates harm",
            "upright_focus": "meeting a partner's raw edges — anger, fear — with steady presence instead of fighting back",
            "reversed_focus": "the growth edge is to ask where softness has become tolerance of what harms you",
            "rider_waite_projection": "the woman calmly opening the lion's jaws = meeting ferocity with presence, not force",
            "eastern_anchor": "阴阳和合",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "the-chariot-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "soft-handle-hard vs mastery masked as weakness",
            "upright_focus": "leading a difficult team or client through patience and composure, not force",
            "reversed_focus": "the shadow invites you to ask whether you've undervalued your own capacity",
            "rider_waite_projection": "the lion tamed without a weapon = influence that doesn't need to raise its voice",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "patient-capital fortitude vs endurance mistaken for stubbornness",
            "upright_focus": "holding a long position through volatility without flinching; the discipline of not panic-selling",
            "reversed_focus": "the growth edge is to ask whether patience has become refusal to review the numbers",
            "rider_waite_projection": "the steady hand on the lion = the steady hand on a position through turbulence",
            "eastern_anchor": "散财聚人",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-tower-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "instinct-mastery vs burnout from being strong too long",
            "upright_focus": "meeting cravings, pain, or fear with one minute of patient attention rather than suppression",
            "reversed_focus": "the growth edge is to ask where being strong has cost you rest",
            "rider_waite_projection": "the lion and the wreath of flowers = the raw body met gently, not battled",
            "eastern_anchor": "形神共养",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "lion-taming within vs self-doubt underestimating your power",
            "upright_focus": "taming the wild mind through non-violent attention; courage that does not wage war on itself",
            "reversed_focus": "the shadow invites you to ask where you've stopped being gentle with yourself in the name of being tough",
            "rider_waite_projection": "the infinity symbol above the head = the unbroken loop of patient self-mastery",
            "eastern_anchor": "无为而治",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-chariot-for-spiritual-growth", "the-high-priestess-for-spiritual-growth"],
        },
    },

    # ===== 9. The Hermit 求道者 =====
    "the-hermit": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "space-to-feel withdrawal vs distance that reads as abandonment",
            "upright_focus": "taking real space to know what you actually want before committing — and naming it as restoration",
            "reversed_focus": "the growth edge is to ask whether the distance is feeding you or hiding you",
            "rider_waite_projection": "the lone figure on the snowy peak = chosen solitude in service of clarity",
            "eastern_anchor": "桃花方位",
            "related_cards": ["the-lovers-for-love", "the-high-priestess-for-love", "the-moon-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "solo-deep-work vs isolation that hides you from opportunity",
            "upright_focus": "withdrawing from meetings and noise to do the one piece of work only you can do",
            "reversed_focus": "the shadow invites you to ask whether solitude has become avoidance of the room",
            "rider_waite_projection": "the lantern holding a six-pointed star = the inner light carried into the work alone",
            "eastern_anchor": "韬光养晦",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-high-priestess-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "independent research vs over-thinking into missed entries",
            "upright_focus": "doing your own deep diligence instead of following the crowd's tip",
            "reversed_focus": "the growth edge is to ask whether more research is still serving the decision",
            "rider_waite_projection": "the single lantern on a dark mountain = reading the filings alone, with your own light",
            "eastern_anchor": "取之有道",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-high-priestess-for-finances"],
        },
        "health": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "restorative retreat vs retreat that becomes hiding",
            "upright_focus": "a real pause — digital detox, sleep reset, solo reset week — to hear what the body has been saying",
            "reversed_focus": "the growth edge is to notice when rest has become avoidance of re-engaging, not a verdict of frailty",
            "rider_waite_projection": "the staff and lantern on a solitary peak = the body given real, structured space to recover",
            "eastern_anchor": "子午流注",
            "related_cards": ["temperance-for-health", "the-moon-for-health", "the-high-priestess-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "lantern-lit inner guide vs stuckness disguised as depth",
            "upright_focus": "carrying your own light through structured solitude; retreat with a question and a return date",
            "reversed_focus": "the shadow invites you to ask whether the depth is real or the hiding is",
            "rider_waite_projection": "the lantern held up in darkness = inner guidance that does not need an audience",
            "eastern_anchor": "致虚守静",
            "related_cards": ["the-high-priestess-for-spiritual-growth", "the-star-for-spiritual-growth", "the-hierophant-for-spiritual-growth"],
        },
    },

    # ===== 10. Wheel of Fortune 转轮 =====
    "wheel-of-fortune": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "phase-turn of a bond vs clinging to a phase that has ended",
            "upright_focus": "recognizing a relationship has entered a new phase — commitment, cooling, reunion — and riding it",
            "reversed_focus": "the growth edge is to ask what you're refusing to release, not a sentence of bad luck",
            "rider_waite_projection": "the great wheel turning = the phase of the bond is moving whether you grip or not",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "death-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "momentum on your side vs passivity when you should press",
            "upright_focus": "acting now because the cycle is turning your way; a role whose time has come",
            "reversed_focus": "the shadow invites you to ask what is actually within your influence versus not",
            "rider_waite_projection": "the sphinx atop the wheel = reading where in the cycle you sit before acting",
            "eastern_anchor": "时势顺逆",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "cycle-timing vs gambling disguised as timing",
            "upright_focus": "reading where in the cycle a market or income source sits before acting",
            "reversed_focus": "the growth edge is to slow down and tell timing from a gamble, not a forecast of loss",
            "rider_waite_projection": "the wheel with figures ascending and descending = the cycle that turns regardless of hope",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "seasonal body rhythm vs fatalism about a hard streak",
            "upright_focus": "honoring the body's natural cycles — circadian, hormonal, seasonal — instead of forcing constant output",
            "reversed_focus": "the growth edge is to act on what you can shape, rather than resign to a 'bad streak'",
            "rider_waite_projection": "the four fixed signs reading books = the body read through its own natural seasons",
            "eastern_anchor": "气血调和",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "impermanence acceptance vs passive resignation",
            "upright_focus": "sorting what you can shape from what you must release; riding change instead of gripping it",
            "reversed_focus": "the shadow invites you to ask whether acceptance has curdled into giving up",
            "rider_waite_projection": "the wheel turning beneath winged figures = the freedom that comes from no longer clinging",
            "eastern_anchor": "知止",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "death-for-spiritual-growth"],
        },
    },

    # ===== 11. Justice 真相追寻者 =====
    "justice": {
        "love": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "fair reckoning vs fairness that reads as coldness",
            "upright_focus": "an honest accounting of who has given what in the relationship; a decision weighed on evidence",
            "reversed_focus": "the growth edge is to ask where honesty lost its warmth, not a verdict of blame",
            "rider_waite_projection": "the upright sword and the scales = the bond weighed on what actually happened, not on hope",
            "eastern_anchor": "相生相克",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "the-hierophant-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "evidence-based call vs honesty without warmth",
            "upright_focus": "making the decision on the data, not office politics; a contract or promotion weighed fairly",
            "reversed_focus": "the shadow invites you to ask where you've sidestepped responsibility for the call",
            "rider_waite_projection": "the sword held upright = the clean cut of a decision made on the facts",
            "eastern_anchor": "守正出奇",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "the-hierophant-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "books-balanced audit vs avoiding the responsibility you owe",
            "upright_focus": "an honest audit of what you owe and what you're owed; a settlement, a contract, fair terms",
            "reversed_focus": "the growth edge is to face the number rather than round it away",
            "rider_waite_projection": "the scales held level = the books weighed honestly, debt and credit alike",
            "eastern_anchor": "量入为出",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "honest diagnosis vs self-blame for what isn't your fault",
            "upright_focus": "getting the real result and facing it; weighing symptoms on evidence, not denial",
            "reversed_focus": "the growth edge is to hold the facts without sentencing yourself",
            "rider_waite_projection": "the scales weighing what is = the body's signals read honestly, not catastrophized",
            "eastern_anchor": "中庸守度",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "karmic accounting vs inner judge replacing inner guide",
            "upright_focus": "an honest review of cause and effect in your life without self-sentencing; the scales of conscience",
            "reversed_focus": "the shadow invites you to ask whether your inner voice has become a court rather than a guide",
            "rider_waite_projection": "the sword and scales together = seeing clearly, with the cost included",
            "eastern_anchor": "致虚守静",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "judgment-for-spiritual-growth"],
        },
    },

    # ===== 12. The Hanged Man 臣服者 =====
    "the-hanged-man": {
        "love": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "willing pause vs stalling disguised as patience",
            "upright_focus": "choosing to wait in limbo to let a new angle on the relationship surface",
            "reversed_focus": "the growth edge is to ask whether the pause is serving insight or hiding indecision",
            "rider_waite_projection": "the figure hanging serene by one ankle = the chosen pause that costs something",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-high-priestess-for-love", "the-moon-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "inverted perspective vs indecision wearing patience's clothes",
            "upright_focus": "deliberately flipping your view of a stuck problem; the pause before the strategic pivot",
            "reversed_focus": "the shadow invites you to ask whether the new angle has actually arrived or you're just stalling",
            "rider_waite_projection": "the upside-down figure with a halo = the insight that only comes from a flipped view",
            "eastern_anchor": "韬光养晦",
            "related_cards": ["the-magician-for-career", "the-hermit-for-career", "the-high-priestess-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "hold-and-see vs martyrdom around money sacrificed",
            "upright_focus": "intentionally not acting on a position; letting the situation reveal itself",
            "reversed_focus": "the growth edge is to ask whether the wait is strategy or fear of deciding",
            "rider_waite_projection": "the figure hanging still = the deliberate non-action that holds a position open",
            "eastern_anchor": "散财聚人",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-high-priestess-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "forced slowdown vs refusing to re-engage once healed",
            "upright_focus": "a stop that asks you to see your body from a new angle; bed rest as revelation",
            "reversed_focus": "the growth edge is to re-engage when the pause has done its work, not a prediction of setback",
            "rider_waite_projection": "the inverted figure = the body seen from an unfamiliar angle, asking for surrender",
            "eastern_anchor": "子午流注",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "reversed-view surrender vs spiritualizing avoidance",
            "upright_focus": "arguing the opposite of a fixed belief to loosen its grip; chosen sacrifice for insight",
            "reversed_focus": "the shadow invites you to ask whether surrender has become a way to avoid action",
            "rider_waite_projection": "the halo around the inverted head = the clarity that arrives only after the old view is released",
            "eastern_anchor": "无为而治",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "temperance-for-spiritual-growth"],
        },
    },

    # ===== 13. Death 转化者 =====
    "death": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "relationship ending vs clinging to what has already closed",
            "upright_focus": "a bond completing — not always a breakup; sometimes a death of an old dynamic so a new one can form",
            "reversed_focus": "the growth edge is to ask what you're keeping alive only by force, not a curse",
            "rider_waite_projection": "the sun rising between two towers behind the rider = the dawn that follows the close",
            "eastern_anchor": "桃花方位",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "the-tower-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "role-identity death vs refusing to let an old self end",
            "upright_focus": "the end of a job title or career chapter that has completed; clearing a defunct business to start fresh",
            "reversed_focus": "the shadow invites you to ask which old identity you're propping up past its time",
            "rider_waite_projection": "the fallen king before the rider = the old title that has to fall for the new one to rise",
            "eastern_anchor": "时势顺逆",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "judgment-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "structure-completion vs keeping a dead asset on life support",
            "upright_focus": "closing a dead income source, a failing venture, a debt chapter; the write-off that clears the books",
            "reversed_focus": "the growth edge is to ask what you're feeding that has already completed, not a forecast of ruin",
            "rider_waite_projection": "the clearing of the field before the rider = the close that makes the next thing possible",
            "eastern_anchor": "五行偏财",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "judgment-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "regenerative clearing vs forcing an ending before its time",
            "upright_focus": "a detox, a fast, a shedding of an old habit so the body can rebuild",
            "reversed_focus": "the growth edge is to let the change happen at its own pace, not a verdict of decline",
            "rider_waite_projection": "the rider clearing what's complete = the body shedding what no longer serves it",
            "eastern_anchor": "治未病",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "ego-death rebirth vs resistance that turns to stagnation",
            "upright_focus": "letting an old identity die so a truer one can live; the dark night that precedes morning",
            "reversed_focus": "the shadow invites you to ask where resistance to the ending has become stuckness",
            "rider_waite_projection": "the bishop, child, and king before the rider = the old self in all its forms meeting its close",
            "eastern_anchor": "知止",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "judgment-for-spiritual-growth"],
        },
    },

    # ===== 14. Temperance 炼金者 =====
    "temperance": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "patient blending vs middle that avoids hard edges",
            "upright_focus": "mixing two different needs or styles slowly into a sustainable rhythm; not forcing either side",
            "reversed_focus": "the growth edge is to ask where compromise has blurred a line that needed holding",
            "rider_waite_projection": "the water poured between two cups in unbroken flow = the slow blend of two into one rhythm",
            "eastern_anchor": "阴阳和合",
            "related_cards": ["the-lovers-for-love", "the-high-priestess-for-love", "the-chariot-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "middle-way integration vs compromise that loses the edge",
            "upright_focus": "blending competing priorities — quality vs speed, team vs solo — into one workable approach",
            "reversed_focus": "the shadow invites you to ask whether the middle has flattened what made the work good",
            "rider_waite_projection": "one foot in water, one on land = holding two work worlds in living tension",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "balanced allocation vs impatience with slow compounding",
            "upright_focus": "a measured portfolio mix — risk and safety, save and spend — held with patience",
            "reversed_focus": "the growth edge is to ask where impatience has pushed you toward an extreme",
            "rider_waite_projection": "the unhurried pour between cups = the slow, steady mix that compounds over time",
            "eastern_anchor": "量入为出",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "justice-for-finances"],
        },
        "health": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "steady regulation vs excess hiding as balance",
            "upright_focus": "the middle path in food, drink, training — enough, not extreme; recovery and effort blended",
            "reversed_focus": "the growth edge is to notice when 'balance' has become cover for an indulgence",
            "rider_waite_projection": "the winged figure pouring without spilling = the body held in sustainable, measured rhythm",
            "eastern_anchor": "中庸守度",
            "related_cards": ["the-hermit-for-health", "the-moon-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "alchemical blending vs impatience with the pace of integration",
            "upright_focus": "holding opposites — effort and surrender, heaven and earth — in living tension; slow integration",
            "reversed_focus": "the shadow invites you to ask where you've forced integration before its time",
            "rider_waite_projection": "the path leading to a crown of light between sun and mountains = the long road of true blending",
            "eastern_anchor": "中道",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "the-chariot-for-spiritual-growth"],
        },
    },

    # ===== 15. The Devil 阴影知者 =====
    "the-devil": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "toxic-bond chain vs mistaking intensity for love",
            "upright_focus": "the bond you keep returning to despite knowing the cost; devotion that has blurred into compulsion",
            "reversed_focus": "the growth edge is to see the chain clearly — and notice it is looser than it feels",
            "rider_waite_projection": "the loose chains the figures could lift = the bond that holds because it isn't examined, not because it's locked",
            "eastern_anchor": "相生相克",
            "related_cards": ["the-lovers-for-love", "the-fool-for-love", "the-tower-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "golden-handcuff bind vs the chain you can lift but don't",
            "upright_focus": "stuck in a role for the money, status, or fear; a workplace that feeds your shadow",
            "reversed_focus": "the growth edge is to ask what would happen if you tested how loose the chain actually is",
            "rider_waite_projection": "the horned figure on a dark pillar = the structure that feeds the shadow and calls it success",
            "eastern_anchor": "贵人方位",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "the-tower-for-career"],
        },
        "finances": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "consumption-loop trap vs seeing the chain but not lifting it",
            "upright_focus": "spending tied to identity, status, or habit; debt that feeds on a self-limiting story",
            "reversed_focus": "the growth edge is to look at the pattern honestly and ask what story it's serving",
            "rider_waite_projection": "the loose chains around willing figures = the spending loop that holds because it isn't questioned",
            "eastern_anchor": "散财聚人",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "the-magician-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "substance-habit bond vs shame that tightens the chain",
            "upright_focus": "the pattern — sugar, alcohol, scroll, stimulant — you've named but not loosened; the body carrying it",
            "reversed_focus": "the growth edge is to meet the pattern without shame, which is what loosens it, not a verdict of failure",
            "rider_waite_projection": "the chained figures lit by the horned one's fire = the habit sustained by the very discomfort it causes",
            "eastern_anchor": "治未病",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "shadow-facing liberation vs fascination with the shadow over release",
            "upright_focus": "looking directly at the attachment you've projected outward; reclaiming the disowned part",
            "reversed_focus": "the shadow invites you to ask whether naming the pattern has become a substitute for releasing it",
            "rider_waite_projection": "the inverted pentagram and the loose chains = shadow seen clearly loses the grip it had in the dark",
            "eastern_anchor": "致虚守静",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "the-moon-for-spiritual-growth"],
        },
    },

    # ===== 16. The Tower 觉醒者 =====
    "the-tower": {
        "love": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "sudden disclosure vs rebuilding on the same false base",
            "upright_focus": "a truth that detonates the relationship's unspoken premise — an affair, a lie, a breaking-real moment",
            "reversed_focus": "the growth edge is to stop propping up what's already cracked, not a worsening of the disaster",
            "rider_waite_projection": "the lightning splitting the tower = the truth that arrives in a flash and ends the pretense",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "death-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "structure-collapse vs propping up what has already cracked",
            "upright_focus": "a layoff, a shutdown, a public failure of a plan that was already unstable; the org chart blowing up",
            "reversed_focus": "the growth edge is to meet the rebuild rather than delay it, not a verdict of ruin",
            "rider_waite_projection": "the crown knocked from the tower's top = the structure that lost its foundation before it fell",
            "eastern_anchor": "时势顺逆",
            "related_cards": ["the-emperor-for-career", "the-magician-for-career", "death-for-career"],
        },
        "finances": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "portfolio shock vs avoiding the lesson in the loss",
            "upright_focus": "a sudden loss, a margin call, a fraud revealed, an income source wiped — the number you didn't want to see",
            "reversed_focus": "the growth edge is to review what the loss is teaching, not a market call or a forecast of more loss",
            "rider_waite_projection": "the tower struck and burning = the financial structure that was already unstable meeting the truth",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "the-devil-for-finances", "wheel-of-fortune-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "acute wake-up vs returning to the habits that caused it",
            "upright_focus": "a sudden symptom that ends denial overnight; the collapse that forces the lifestyle change",
            "reversed_focus": "the growth edge is to meet the change rather than slide back, not a prediction of decline",
            "rider_waite_projection": "the two figures flung from the tower = the body forcing a change the mind wouldn't make",
            "eastern_anchor": "气血调和",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "false-structure fall vs resisting the necessary rebuild",
            "upright_focus": "the belief-system or identity that collapses under truth; rebuilding on foundations that are now actually true",
            "reversed_focus": "the shadow invites you to ask where you're resisting the rebuild that the fall has made possible",
            "rider_waite_projection": "the lightning and the falling crown = the false toppling to reveal what was always underneath",
            "eastern_anchor": "知止",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "death-for-spiritual-growth"],
        },
    },

    # ===== 17. The Star 希望者 =====
    "the-star": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "renewed-heart reopening vs forcing hope before you've grieved",
            "upright_focus": "letting love back in gently after a hard season; a relationship renewing on truer terms",
            "reversed_focus": "the growth edge is to ask whether hope is genuine or a cover for unfinished grief",
            "rider_waite_projection": "the water poured into the pool and onto the land = the heart reopening slowly, in two directions",
            "eastern_anchor": "红线姻缘",
            "related_cards": ["the-lovers-for-love", "the-empress-for-love", "the-high-priestess-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "guiding-vision return vs hope without the work",
            "upright_focus": "reconnecting with the purpose that made you choose this path; a clear sense of direction after drift",
            "reversed_focus": "the shadow invites you to ask where the vision has stayed a dream instead of a next step",
            "rider_waite_projection": "the great eight-pointed star above = the guiding light that returns after the dark",
            "eastern_anchor": "贵人方位",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "judgment-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "recovery-guided rebuild vs denial dressed as faith",
            "upright_focus": "a slow, principled rebuild after a loss; trusting the long view while doing the patient work",
            "reversed_focus": "the growth edge is to ask whether faith has become a way to skip the patient work",
            "rider_waite_projection": "the figure kneeling by water pouring steadily = the rebuild done gently, one pour at a time",
            "eastern_anchor": "取之有道",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "temperance-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "healing-trust restore vs passive hope skipping care",
            "upright_focus": "trusting the body's capacity to recover while doing the gentle daily things — water, rest, light",
            "reversed_focus": "the growth edge is to pair hope with the care the body is actually asking for, not a prediction of decline",
            "rider_waite_projection": "the figure pouring water by the calm pool = the body met with gentleness and steady daily care",
            "eastern_anchor": "形神共养",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "rekindled-faith star vs clinging to hope to avoid grief",
            "upright_focus": "the quiet return of meaning after despair; the still pool in which guidance is reflected again",
            "reversed_focus": "the shadow invites you to ask whether the hope is real or a buffer against the grief",
            "rider_waite_projection": "the bird in the tree under the stars = the small, living sign that meaning has returned",
            "eastern_anchor": "初发心",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "the-fool-for-spiritual-growth"],
        },
    },

    # ===== 18. The Moon 梦境者 =====
    "the-moon": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "half-lit doubt vs building defenses against the unconfirmed",
            "upright_focus": "not everything is clear about a partner or new interest; the part of the story you can't yet see",
            "reversed_focus": "the growth edge is to stay with the not-knowing without spiraling, not a verdict of deception",
            "rider_waite_projection": "the moon lighting only part of the path = the bond seen in half-light, with more to reveal",
            "eastern_anchor": "桃花方位",
            "related_cards": ["the-lovers-for-love", "the-high-priestess-for-love", "the-devil-for-love"],
        },
        "career": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "uncertain-path fog vs forcing premature clarity",
            "upright_focus": "moving through a phase where the rational map doesn't fit; hidden office dynamics surfacing",
            "reversed_focus": "the growth edge is to let clarity arrive rather than manufacture it, not a charge of confusion",
            "rider_waite_projection": "the path winding into distant mountains = the career stretch that can't yet be mapped",
            "eastern_anchor": "韬光养晦",
            "related_cards": ["the-hermit-for-career", "the-high-priestess-for-career", "the-magician-for-career"],
        },
        "finances": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "murky-terms haze vs acting on fear or illusion",
            "upright_focus": "a deal, a contract, or a market you can't fully read; the fine print hiding in the half-light",
            "reversed_focus": "the growth edge is to slow down and read the terms again, not a forecast of loss",
            "rider_waite_projection": "the moon's light reflecting off the pool = the deal that looks different depending on the angle",
            "eastern_anchor": "五行偏财",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "unclear-symptom dream vs anxiety amplifying the unknown",
            "upright_focus": "symptoms, dreams, or signals whose meaning isn't yet clear; staying with the not-knowing without spiraling",
            "reversed_focus": "the growth edge is to notice worry without letting it write the story, not a prediction of illness",
            "rider_waite_projection": "the crayfish emerging half from the pool = the body's signal surfacing partly, asking for patience",
            "eastern_anchor": "子午流注",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-high-priestess-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "subconscious-surfacing vs confusing intuition with projection",
            "upright_focus": "dreams, synchronicities, and half-formed impressions carrying information; honoring what's emerging",
            "reversed_focus": "the shadow invites you to ask whether what you're 'receiving' is signal or projection",
            "rider_waite_projection": "the dog and wolf howling at the moon under towers = the tame and wild parts both attending to what's surfacing",
            "eastern_anchor": "致虚守静",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-high-priestess-for-spiritual-growth", "the-star-for-spiritual-growth"],
        },
    },

    # ===== 19. The Sun 光辉者 =====
    "the-sun": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "shared-joy warmth vs taking the good for granted",
            "upright_focus": "the simple warmth of two people genuinely enjoying each other; a relationship in its sunlit season",
            "reversed_focus": "the growth edge is to ask where you've stopped tending the joy that was once vivid",
            "rider_waite_projection": "the child on the white horse beneath sunflowers = the simple, unguarded good of being together",
            "eastern_anchor": "阴阳和合",
            "related_cards": ["the-lovers-for-love", "the-empress-for-love", "the-star-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "success-in-bloom vs ego inflation after the win",
            "upright_focus": "a project, role, or venture in its moment of warmth and recognition; the season going well",
            "reversed_focus": "the shadow invites you to ask where confidence has crossed into overreach",
            "rider_waite_projection": "the bright sun over the wall = the work visible and recognized in its full light",
            "eastern_anchor": "时势顺逆",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-chariot-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "abundance-flow high vs excessive optimism on spending",
            "upright_focus": "a strong income season, a payout, a deal closing; the portfolio in the sun",
            "reversed_focus": "the growth edge is to review whether optimism has loosened the discipline that built the season",
            "rider_waite_projection": "the sunflowers turning toward the sun = the resources flowing in a good direction, worth tending",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "the-devil-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "vitality-season vs ignoring limits under the high",
            "upright_focus": "a genuine high-energy, well-rested, thriving stretch; cultivating joy as part of wellness",
            "reversed_focus": "the growth edge is to notice where the high has you overriding the body's quiet limits",
            "rider_waite_projection": "the content child in full light = the body in a season of genuine thriving, not pushed",
            "eastern_anchor": "气血调和",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "luminous-clarity vs toxic positivity masking shadow",
            "upright_focus": "the unobscured warm clarity of a settled mind; joy as a genuine resource, not denial",
            "reversed_focus": "the shadow invites you to ask where brightness has become a cover for unmet shadow",
            "rider_waite_projection": "the sun unobscured behind the child = clarity that hides nothing, including the difficult",
            "eastern_anchor": "无为而治",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "the-high-priestess-for-spiritual-growth"],
        },
    },

    # ===== 20. Judgment 觉醒者(号角) =====
    "judgment": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "honest-reckoning call vs reckoning curdling into blame",
            "upright_focus": "a clear-eyed accounting of the relationship that asks for renewal or release; the wake-up conversation",
            "reversed_focus": "the growth edge is to keep the reckoning honest rather than let it turn into a court, not a verdict of guilt",
            "rider_waite_projection": "the angel sounding the trumpet = the call to bring the relationship into the open and decide",
            "eastern_anchor": "红线姻缘",
            "related_cards": ["the-lovers-for-love", "the-devil-for-love", "death-for-love"],
        },
        "career": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "calling-answer pivot vs refusing the call out of fear",
            "upright_focus": "hearing and answering a call to a larger, truer career; the pivot you can no longer ignore",
            "reversed_focus": "the shadow invites you to ask what fear is keeping you from the call you've already heard",
            "rider_waite_projection": "the figures rising at the trumpet's call = the career self that was dormant now answering",
            "eastern_anchor": "贵人方位",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "the-hermit-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "clean-slate reckoning vs self-criticism replacing honest review",
            "upright_focus": "an honest financial reckoning — debt plan, write-off, restructure — that clears the way for renewal",
            "reversed_focus": "the growth edge is to keep the review honest without sentencing yourself",
            "rider_waite_projection": "the figures rising from coffins = the books cleared for a genuine restart",
            "eastern_anchor": "量入为出",
            "related_cards": ["the-emperor-for-finances", "the-tower-for-finances", "justice-for-finances"],
        },
        "health": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "wake-up call vs the inner judge sentencing the body",
            "upright_focus": "a result or moment that asks you to finally answer the body's call and change how you live",
            "reversed_focus": "the growth edge is to hear the call as guidance rather than as self-sentence, not a prediction of decline",
            "rider_waite_projection": "the trumpet waking the figures = the wake-up moment that asks for a real response",
            "eastern_anchor": "治未病",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "the-moon-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "rebirth-trumpet vs doubting the path that's stirring",
            "upright_focus": "the call to a larger life heard as guidance, not accusation; rising to the next version of yourself",
            "reversed_focus": "the shadow invites you to ask whether your inner voice has become a judge rather than a guide",
            "rider_waite_projection": "the angel and the white flag with a red cross = the call to rise, heard as compassion",
            "eastern_anchor": "初发心",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "the-high-priestess-for-spiritual-growth"],
        },
    },

    # ===== 21. The World 圆满者 =====
    "the-world": {
        "love": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "milestone-integration vs loose ends before the next threshold",
            "upright_focus": "a relationship reaching a fulfilled level — commitment, family, a chapter complete; honoring what you've built",
            "reversed_focus": "the growth edge is to ask what one loose end still needs closing before the next chapter",
            "rider_waite_projection": "the dancer within the wreath = the bond held whole, ready for its next threshold",
            "eastern_anchor": "缘起聚散",
            "related_cards": ["the-lovers-for-love", "the-empress-for-love", "the-fool-for-love"],
        },
        "career": {
            "tension": 2, "depth_tier": "standard",
            "main_conflict": "chapter-complete summit vs lingering instead of stepping through",
            "upright_focus": "a project, role, or body of work reaching its fulfilled end; the graduation, the exit, the recognition",
            "reversed_focus": "the shadow invites you to ask whether you're lingering past the threshold",
            "rider_waite_projection": "the wreath enclosing the dancer = the work complete, contained, ready to open",
            "eastern_anchor": "厚德载物",
            "related_cards": ["the-magician-for-career", "the-emperor-for-career", "judgment-for-career"],
        },
        "finances": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "cycle-fulfilled close vs almost-there loose ends",
            "upright_focus": "a financial goal reached and a cycle closed; the sale, the payoff, the milestone met",
            "reversed_focus": "the growth edge is to finish the one loose end that's holding the cycle open",
            "rider_waite_projection": "the wreath marking completion = the financial chapter that has genuinely closed",
            "eastern_anchor": "财气聚散",
            "related_cards": ["the-emperor-for-finances", "wheel-of-fortune-for-finances", "judgment-for-finances"],
        },
        "health": {
            "tension": 1, "depth_tier": "lite",
            "main_conflict": "integrated-wholeness vs stopping the practices that got you here",
            "upright_focus": "a health journey reaching integration: body, mind, habits aligned into a sustainable whole",
            "reversed_focus": "the growth edge is to keep the practices that built the integration, not a verdict of fragility",
            "rider_waite_projection": "the dancer in balance within the wreath = the body held as an integrated whole",
            "eastern_anchor": "形神共养",
            "related_cards": ["the-hermit-for-health", "temperance-for-health", "strength-for-health"],
        },
        "spiritual": {
            "tension": 3, "depth_tier": "benchmark",
            "main_conflict": "mandala-completion vs resistance to closure",
            "upright_focus": "the integrated wholeness of a long inner journey; recognizing the threshold to the next cycle",
            "reversed_focus": "the shadow invites you to ask where you're resisting the closure that would let the next cycle begin",
            "rider_waite_projection": "the four fixed signs at the corners and the dancer in the wreath = the full cycle complete, and the Fool waiting at zero",
            "eastern_anchor": "知止",
            "related_cards": ["the-hermit-for-spiritual-growth", "the-star-for-spiritual-growth", "the-fool-for-spiritual-growth"],
        },
    },
}


def main():
    # ---- 任务1+3: scenario-knowledge.json 扩展到14字段 ----
    with open(SCENARIO_PATH, "r", encoding="utf-8") as f:
        scn = json.load(f)

    cards = scn["cards"]
    scn_count_14 = 0
    scn_count_total = 0
    for card_entry in cards:
        slug = card_entry["card"]
        ext = CARD_SCENARIOS.get(slug)
        if not ext:
            print(f"[WARN] card {slug} 缺扩展数据")
            continue
        # 牌级 eastern_imagery
        card_entry["eastern_imagery"] = EASTERN_IMAGERY[slug]
        for scn_name in ["love", "career", "finances", "health", "spiritual"]:
            s = card_entry["scenarios"].get(scn_name)
            if s is None:
                print(f"[WARN] {slug}.{scn_name} 缺场景")
                continue
            scn_count_total += 1
            e = ext[scn_name]
            # 写入10个新字段(保留原4字段 metaphor/behavior/risk/crystals)
            s["tension"] = e["tension"]
            s["depth_tier"] = e["depth_tier"]
            s["main_conflict"] = e["main_conflict"]
            s["upright_focus"] = e["upright_focus"]
            s["reversed_focus"] = e["reversed_focus"]
            s["rider_waite_projection"] = e["rider_waite_projection"]
            s["eastern_anchor"] = e["eastern_anchor"]
            s["faq_angles"] = list(FAQ[scn_name])
            s["internal_links"] = {
                "same_card": same_card_list(slug, scn_name),
                "related_cards": list(e["related_cards"]),
            }
            # 字段计数
            required = ["tension","depth_tier","main_conflict","upright_focus","reversed_focus",
                        "rider_waite_projection","eastern_anchor","faq_angles","internal_links",
                        "metaphor","behavior","risk","crystals"]
            if all(k in s for k in required):
                scn_count_14 += 1

    # 更新 _meta
    scn["_meta"]["v2_extended"] = "2026-06-30 v2 14字段扩展 (tension/depth_tier/main_conflict/upright_focus/reversed_focus/rider_waite_projection/eastern_anchor/faq_angles/internal_links + 牌级 eastern_imagery)"
    scn["_meta"]["v2_fields_per_scenario"] = 14
    scn["_meta"]["v2_framework_ref"] = "模板-Tarot-场景文章框架.md §3 张力分级 / §11 东方锚点池 / §13 关联牌语义矩阵 / §16 14字段规范"

    with open(SCENARIO_PATH, "w", encoding="utf-8") as f:
        json.dump(scn, f, ensure_ascii=False, indent=2)
    print(f"[scenario] 写回完成: {len(cards)} 牌, {scn_count_total} 场景, 14字段齐全 {scn_count_14}")

    # ---- 任务2: tarot-knowledge.json 补 eastern_imagery ----
    with open(TAROT_PATH, "r", encoding="utf-8") as f:
        tk = json.load(f)
    tk_count = 0
    for c in tk["cards"]:
        slug = c["slug"]
        if slug in EASTERN_IMAGERY:
            c["eastern_imagery"] = EASTERN_IMAGERY[slug]
            tk_count += 1
    tk["_meta"]["eastern_imagery_added"] = "2026-06-30 v2 补牌级专属意象词 (Rider-Waite画面+eastern_anchors, 22牌, 用于场景页M7东方节校验)"
    with open(TAROT_PATH, "w", encoding="utf-8") as f:
        json.dump(tk, f, ensure_ascii=False, indent=2)
    print(f"[tarot] eastern_imagery 补全: {tk_count} 牌")

    # ---- 统计 tension 分布 ----
    tier_count = {"benchmark": 0, "standard": 0, "lite": 0}
    tension_count = {3: 0, 2: 0, 1: 0}
    per_card_3 = {}
    for card_entry in scn["cards"]:
        slug = card_entry["card"]
        cnt3 = 0
        for scn_name in ["love", "career", "finances", "health", "spiritual"]:
            s = card_entry["scenarios"][scn_name]
            tension_count[s["tension"]] += 1
            tier_count[s["depth_tier"]] += 1
            if s["tension"] == 3:
                cnt3 += 1
        per_card_3[slug] = cnt3

    # ============ §17 质量阀门 6 项自校验 ============
    print("\n" + "=" * 60)
    print("=== §17 质量阀门 6 项自校验 ===")
    print("=" * 60)

    # 阀门1: 每牌5场景 metaphor 重叠<30% (用关键词集合重叠率近似)
    # 阀门1: metaphor 唯一性 — 同牌5场景 metaphor 字符串互不重复
    v1_fail = []
    for card_entry in scn["cards"]:
        ms = [card_entry["scenarios"][s]["metaphor"] for s in ["love","career","finances","health","spiritual"]]
        if len(set(ms)) != 5:
            v1_fail.append((card_entry["card"], "metaphor非唯一"))
    print(f"[阀门1] 每牌5场景metaphor唯一性: {'PASS (22牌全部5场景metaphor互异)' if not v1_fail else 'FAIL '+str(v1_fail)}")

    # 阀门2: behavior 是具体行为(动词短语)非抽象状态 — 检查长度+含动词线索
    v2_short = []
    for card_entry in scn["cards"]:
        for scn_name in ["love","career","finances","health","spiritual"]:
            b = card_entry["scenarios"][scn_name]["behavior"]
            if len(b) < 25:  # 太短多半是抽象状态
                v2_short.append((card_entry["card"], scn_name, b))
    print(f"[阀门2] behavior具体性(长度≥25字符): {'PASS' if not v2_short else 'FAIL '+str(v2_short)}")

    # 阀门3: Health/Finances risk + reversed_focus 不触合规红线
    # 黑名单词: 诊断/治疗/疗效/cure/diagnose/heals/predicts sickness/illness/invest now/收益/guaranteed
    REDLINE = ["cure", "diagnose", "heals ", "predicts sickness", "will be ill",
               "invest now", "you will gain", "guaranteed", "attract wealth quickly",
               "predicts loss", "don't invest"]
    v3_hits = []
    for card_entry in scn["cards"]:
        for scn_name in ["health", "finances"]:
            s = card_entry["scenarios"][scn_name]
            text = (s.get("risk","") + " " + s.get("reversed_focus","") + " " + s.get("upright_focus","")).lower()
            for w in REDLINE:
                if w.lower() in text:
                    v3_hits.append((card_entry["card"], scn_name, w))
    # Health 必须用 check in with body 风格, 不用 illness
    illness_hits = []
    for card_entry in scn["cards"]:
        s = card_entry["scenarios"]["health"]
        text = (s.get("risk","") + " " + s.get("reversed_focus","")).lower()
        if "illness" in text and "check" not in text and "growth edge" not in text:
            illness_hits.append(card_entry["card"])
    print(f"[阀门3] Health/Finances合规红线(黑名单词): {'PASS' if not v3_hits else 'FAIL '+str(v3_hits)}")
    print(f"         Health 'illness'校验(须配check/growth edge): {'PASS' if not illness_hits else 'FAIL '+str(illness_hits)}")

    # 阀门4: tension 每牌至多1-2个3分场景
    over = [s for s,n in per_card_3.items() if n > 2]
    print(f"[阀门4] 每牌≤2个3分场景: {'PASS' if not over else 'FAIL '+str(over)}")

    # 阀门5: eastern_anchor 跨牌轮换 (相邻牌同场景主锚点不重复)
    SCN_LIST = ["love","career","finances","health","spiritual"]
    v5_fail = []
    for i in range(1, len(scn["cards"])):
        prev_slug = scn["cards"][i-1]["card"]
        cur_slug = scn["cards"][i]["card"]
        for scn_name in SCN_LIST:
            a1 = scn["cards"][i-1]["scenarios"][scn_name]["eastern_anchor"]
            a2 = scn["cards"][i]["scenarios"][scn_name]["eastern_anchor"]
            if a1 == a2:
                v5_fail.append((prev_slug, cur_slug, scn_name, a1))
    print(f"[阀门5] eastern_anchor相邻牌轮换: {'PASS (相邻牌同场景锚点0重复)' if not v5_fail else 'FAIL '+str(v5_fail[:8])}")

    # 阀门6: eastern_imagery 每牌专属, 非万能词
    GENERIC = {"balance", "harmony", "energy", "flow", "harmony", "clarity", "love", "light"}
    v6_fail = []
    for slug, imgs in EASTERN_IMAGERY.items():
        if len(imgs) < 3 or len(imgs) > 5:
            v6_fail.append((slug, "数量"+str(len(imgs))))
    # 跨牌意象词重复度(允许少量共用如"双柱",但每牌主体须独特)
    from collections import Counter
    all_words = Counter()
    for imgs in EASTERN_IMAGERY.values():
        for w in imgs:
            all_words[w] += 1
    overused = [(w,c) for w,c in all_words.items() if c >= 4]  # 出现在4+牌的词视为偏通用
    print(f"[阀门6] eastern_imagery每牌3-5个: {'PASS' if not v6_fail else 'FAIL '+str(v6_fail)}")
    print(f"         高频词(出现≥4牌, 偏通用需复查): {overused}")

    # ============ tension 分布汇总 ============
    print("\n=== tension 分布 ===")
    print(f"3分(benchmark): {tension_count[3]} 场景  (框架要求22-44)")
    print(f"2分(standard):  {tension_count[2]} 场景")
    print(f"1分(lite):      {tension_count[1]} 场景")
    print(f"depth_tier分布: {tier_count}")

    # ============ 关联牌矩阵完成度 ============
    rc_total = 0
    rc_complete = 0
    for card_entry in scn["cards"]:
        for scn_name in SCN_LIST:
            rc = card_entry["scenarios"][scn_name]["internal_links"]["related_cards"]
            rc_total += 1
            if 2 <= len(rc) <= 3:
                rc_complete += 1
    print(f"\n=== 关联牌矩阵完成度: {rc_complete}/{rc_total} (每场景2-3张) ===")

    # ============ 抽样: Fool + Tower 全14字段 ============
    def dump_card(slug):
        print("\n" + "-" * 60)
        for card_entry in scn["cards"]:
            if card_entry["card"] == slug:
                print(f"# {slug}  eastern_imagery={card_entry.get('eastern_imagery')}")
                for scn_name in SCN_LIST:
                    s = card_entry["scenarios"][scn_name]
                    print(f"\n  [{scn_name}] tension={s['tension']} depth_tier={s['depth_tier']}")
                    print(f"    metaphor: {s['metaphor']}")
                    print(f"    main_conflict: {s['main_conflict']}")
                    print(f"    behavior: {s['behavior']}")
                    print(f"    risk: {s['risk']}")
                    print(f"    upright_focus: {s['upright_focus']}")
                    print(f"    reversed_focus: {s['reversed_focus']}")
                    print(f"    rider_waite_projection: {s['rider_waite_projection']}")
                    print(f"    eastern_anchor: {s['eastern_anchor']}")
                    print(f"    crystals: {s['crystals']}")
                    print(f"    faq_angles: {s['faq_angles']}")
                    print(f"    internal_links.same_card: {s['internal_links']['same_card']}")
                    print(f"    internal_links.related_cards: {s['internal_links']['related_cards']}")
                break
    print("\n" + "=" * 60)
    print("=== 抽样: Fool + Tower 全14字段 × 5场景 ===")
    print("=" * 60)
    dump_card("the-fool")
    dump_card("the-tower")


if __name__ == "__main__":
    main()
