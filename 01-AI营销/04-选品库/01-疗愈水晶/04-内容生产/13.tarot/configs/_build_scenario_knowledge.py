# -*- coding: utf-8 -*-
"""
Build scenario-knowledge.json: 22 Major Arcana x 5 scenarios (Love/Career/Finances/Health/Spiritual)
= 110 metaphor determinations.

Core rule: each card's 5 scenario metaphors MUST differ (no generic card-meaning reuse).
Each behavior is card-x-scenario specific (persona/action), not a generic "when X in Y reading".
Crystals follow scenario tendency (Love=heart/Career=manifest/Finances=abundance/Health=grounding/Spiritual=higher)
tuned by the card's archetype.
"""
import json, os

# 22 cards x 5 scenarios.
# Each entry: (number, slug, archetype, {scenario: {metaphor, behavior, risk, crystals}})
# metaphor MUST be unique within each card (5 different words/phrases per card).

CARDS = [
    # ---------- 0. The Fool ----------
    (0, "the-fool", "The Innocent Pioneer", {
        "love":       {"metaphor": "adventurous fall",         "behavior": "swiping right on someone completely outside your usual type / starting over where you were burned",
                       "risk": "falling with no safety net",          "crystals": ["rose-quartz", "moonstone"]},
        "career":     {"metaphor": "quit-to-startup leap",     "behavior": "leaving a stable role with only an idea and no backup plan / launching before the plan is built",
                       "risk": "jumping before looking",              "crystals": ["citrine", "tiger-eye"]},
        "finances":   {"metaphor": "speculative bet",          "behavior": "going all in on a tip without due diligence / chasing the novelty investment",
                       "risk": "ignoring the financial cliff edge",   "crystals": ["aventurine", "pyrite"]},
        "health":     {"metaphor": "ignored body alarm",       "behavior": "dismissing the body's warning signs as nothing / pushing through pain because you feel invincible",
                       "risk": "delaying a checkup until it's urgent", "crystals": ["bloodstone", "quartz"]},
        "spiritual":  {"metaphor": "beginner's-mind return",   "behavior": "emptying the cup and asking the most basic questions anew / dropping accumulated certainty",
                       "risk": "naive spiritual bypass",             "crystals": ["amethyst", "selenite"]},
    }),
    # ---------- 1. The Magician ----------
    (1, "the-magician", "The Manifestor", {
        "love":       {"metaphor": "engineered attraction",    "behavior": "curating every detail of how you appear / charming someone into a version of connection you designed",
                       "risk": "performance replacing genuine relating", "crystals": ["rose-quartz", "carnelian"]},
        "career":     {"metaphor": "tools-in-hand launch",     "behavior": "recognizing you already have the skills and shipping the project this week / directing scattered effort into one outcome",
                       "risk": "over-promising what one person can deliver", "crystals": ["citrine", "tiger-eye"]},
        "finances":   {"metaphor": "multi-income orchestration","behavior": "arranging several income streams so each tool (skill/asset) earns / turning a hobby into a paying offer",
                       "risk": "spinning too many plates at once", "crystals": ["pyrite", "aventurine"]},
        "health":     {"metaphor": "mind-body leverage",       "behavior": "using breathwork, visualization, and habit-stacking as active tools to steer your physiology",
                       "risk": "tricking yourself that technique replaces rest", "crystals": ["bloodstone", "quartz"]},
        "spiritual":  {"metaphor": "as-above-so-below channel","behavior": "aligning intention, breath, and action so inner vision lands in daily life / ritualizing your practice",
                       "risk": "mistaking ritual mastery for realization", "crystals": ["amethyst", "selenite"]},
    }),
    # ---------- 2. The High Priestess ----------
    (2, "the-high-priestess", "The Intuitive", {
        "love":       {"metaphor": "unspoken read",            "behavior": "sensing a partner's real state beneath their words / holding back to feel the undercurrent before responding",
                       "risk": "withholding instead of communicating",   "crystals": ["moonstone", "rose-quartz"]},
        "career":     {"metaphor": "behind-the-scenes knowing","behavior": "having the read on the room but staying quiet / the advisor who sees the pattern leadership misses",
                       "risk": "staying invisible when you should speak", "crystals": ["labradorite", "selenite"]},
        "finances":   {"metaphor": "contra the noise instinct","behavior": "acting on a gut sense that contradicts the market mood / sitting still when everyone else is buying",
                       "risk": "confusing intuition with anxiety",       "crystals": ["moonstone", "aventurine"]},
        "health":     {"metaphor": "interoceptive listening",  "behavior": "tracking subtle body signals (heartbeat, gut tension) instead of overriding them / cycles as data",
                       "risk": "over-monitoring into health anxiety",    "crystals": ["bloodstone", "moonstone"]},
        "spiritual":  {"metaphor": "veil-parting stillness",   "behavior": "sitting in silence until the answer arrives on its own / trusting what surfaces between thoughts",
                       "risk": "drifting into dissociation",            "crystals": ["selenite", "labradorite"]},
    }),
    # ---------- 3. The Empress ----------
    (3, "the-empress", "The Nurturer", {
        "love":       {"metaphor": "generous tenderness",      "behavior": "feeding the relationship with food, beauty, and touch / making a home that holds both of you",
                       "risk": "over-giving until you're emptied",      "crystals": ["rose-quartz", "rhodonite"]},
        "career":     {"metaphor": "creative gestation",       "behavior": "tending a project slowly into life like a garden / the manager who grows people, not just output",
                       "risk": "softness that avoids hard decisions",   "crystals": ["aventurine", "citrine"]},
        "finances":   {"metaphor": "abundance through tending","behavior": "growing wealth patiently like a crop / investing in what nourishes (land, art, quality)",
                       "risk": "spending on care for others before self", "crystals": ["aventurine", "jade"]},
        "health":     {"metaphor": "embodied self-care",       "behavior": "returning to pleasure, rest, and good food as medicine / fertility and hormonal honoring",
                       "risk": "indulgence framed as self-care",        "crystals": ["aventurine", "rose-quartz"]},
        "spiritual":  {"metaphor": "sacred feminine creation", "behavior": "creating as spiritual practice (art, garden, cooking) / receiving as devotion, not just giving",
                       "risk": "spiritualizing avoidance of structure", "crystals": ["rose-quartz", "moonstone"]},
    }),
    # ---------- 4. The Emperor ----------
    (4, "the-emperor", "The Sovereign", {
        "love":       {"metaphor": "protective structure",     "behavior": "setting clear terms for how the relationship runs / being the steady one when chaos hits",
                       "risk": "structure tipping into control",        "crystals": ["rose-quartz", "garnet"]},
        "career":     {"metaphor": "throne-builder authority", "behavior": "founding the operating system, setting the rules, holding the line / stepping into the founder seat",
                       "risk": "rigidity that cannot delegate",         "crystals": ["tiger-eye", "citrine"]},
        "finances":   {"metaphor": "foundational architecture","behavior": "building the budget, the trust, the legal structure before scaling / disciplined capital allocation",
                       "risk": "control that misses emergent opportunity", "crystals": ["tiger-eye", "jade"]},
        "health":     {"metaphor": "disciplined regimen",      "behavior": "installing a non-negotiable routine (sleep, training, schedule) as scaffolding for the body",
                       "risk": "discipline that becomes self-punishment", "crystals": ["bloodstone", "garnet"]},
        "spiritual":  {"metaphor": "upright sovereign path",   "behavior": "building an inner throne of principle and standing on it / ordered practice over mystical drift",
                       "risk": "dogma replacing direct experience",      "crystals": ["red-jasper", "hematite"]},
    }),
    # ---------- 5. The Hierophant ----------
    (5, "the-hierophant", "The Teacher", {
        "love":       {"metaphor": "convention-aligned union", "behavior": "following the roadmap (meet families, mark milestones, marry) / seeking a partnership that fits a known shape",
                       "risk": "convention overriding your real feelings", "crystals": ["rose-quartz", "rhodonite"]},
        "career":     {"metaphor": "lineage apprenticeship",   "behavior": "learning under a mentor or institution before innovating / getting the credential, doing the tenure",
                       "risk": "staying an apprentice forever",          "crystals": ["lapis", "sodalite"]},
        "finances":   {"metaphor": "proven-path strategy",     "behavior": "following established methods (index funds, financial advisor, traditional business) over speculation",
                       "risk": "inherited rules that no longer fit",     "crystals": ["jade", "pyrite"]},
        "health":     {"metaphor": "guided protocol",          "behavior": "trusting a clinician's protocol / following a lineage practice (TCM, Ayurveda) over DIY biohacking",
                       "risk": "deferring to authority over your own data", "crystals": ["bloodstone", "amethyst"]},
        "spiritual":  {"metaphor": "received-wisdom devotion", "behavior": "sitting with a teacher and a lineage rather than inventing your path / formal study of a tradition",
                       "risk": "dogma clung to past its truth",          "crystals": ["amethyst", "lapis"]},
    }),
    # ---------- 6. The Lovers ----------
    (6, "the-lovers", "The Choosers", {
        "love":       {"metaphor": "values-aligned union",     "behavior": "choosing the partner whose values match yours, not just the one you're drawn to / a conscious yes",
                       "risk": "the third option you won't name",        "crystals": ["rose-quartz", "rhodonite"]},
        "career":     {"metaphor": "partnership pick",         "behavior": "choosing a co-founder, an offer, or a path because it aligns with what you stand for / a yes that costs",
                       "risk": "choosing from pressure, not alignment",  "crystals": ["citrine", "tiger-eye"]},
        "finances":   {"metaphor": "values-based money",       "behavior": "investing in what you actually believe in / saying no to lucrative-but-misaligned deals",
                       "risk": "avoiding the decision that needs making", "crystals": ["aventurine", "pyrite"]},
        "health":     {"metaphor": "body-heart agreement",     "behavior": "choosing a health path that your values and your body both consent to / no more forcing one over the other",
                       "risk": "two needs pulling you apart",           "crystals": ["rhodonite", "rose-quartz"]},
        "spiritual":  {"metaphor": "sacred union of opposites","behavior": "integrating two inner poles (masculine/feminine, doing/being) into one path / a vow to your whole self",
                       "risk": "splitting instead of integrating",      "crystals": ["rhodochrosite", "rose-quartz"]},
    }),
    # ---------- 7. The Chariot ----------
    (7, "the-chariot", "The Victor", {
        "love":       {"metaphor": "two-reins partnership",   "behavior": "guiding a relationship where two very different drives must pull in one direction / shared momentum",
                       "risk": "one partner dragging the other",         "crystals": ["rose-quartz", "garnet"]},
        "career":     {"metaphor": "focused-charge drive",     "behavior": "harnessing competing demands into one campaign and winning / the disciplined push to the finish",
                       "risk": "force without direction",               "crystals": ["tiger-eye", "citrine"]},
        "finances":   {"metaphor": "harnessed momentum",       "behavior": "driving multiple income pulls toward one financial goal on a deadline / out-working the field",
                       "risk": "aggression that scatters capital",      "crystals": ["pyrite", "tiger-eye"]},
        "health":     {"metaphor": "disciplined training arc","behavior": "running a structured program (race prep, rehab protocol) that holds opposing needs in line",
                       "risk": "driving the body past its line",        "crystals": ["bloodstone", "hematite"]},
        "spiritual":  {"metaphor": "middle-way mastery",       "behavior": "integrating opposing inner forces rather than repressing one / the meditator who harnesses drive",
                       "risk": "suppression mistaken for mastery",      "crystals": ["hematite", "selenite"]},
    }),
    # ---------- 8. Strength ----------
    (8, "strength", "The Gentle Power", {
        "love":       {"metaphor": "patient taming",           "behavior": "meeting a partner's raw edges (anger, fear) with steady presence instead of fighting back / softness that holds",
                       "risk": "gentleness that tolerates harm",        "crystals": ["rose-quartz", "rhodonite"]},
        "career":     {"metaphor": "soft-handle-hard",         "behavior": "leading a difficult team or client through patience and composure, not force / the calm in the storm",
                       "risk": "mastery masked as weakness",            "crystals": ["tiger-eye", "sunstone"]},
        "finances":   {"metaphor": "patient-capital fortitude","behavior": "holding a long position through volatility without flinching / the discipline of not panic-selling",
                       "risk": "endurance mistaken for stubbornness",   "crystals": ["pyrite", "aventurine"]},
        "health":     {"metaphor": "instinct-mastery",         "behavior": "meeting cravings, pain, or fear with one minute of patient attention rather than suppression or venting",
                       "risk": "burnout from being strong too long",    "crystals": ["bloodstone", "carnelian"]},
        "spiritual":  {"metaphor": "lion-taming within",       "behavior": "taming the wild mind through non-violent attention / courage that does not wage war on itself",
                       "risk": "self-doubt underestimating your power", "crystals": ["carnelian", "tiger-eye"]},
    }),
    # ---------- 9. The Hermit ----------
    (9, "the-hermit", "The Seeker", {
        "love":       {"metaphor": "space-to-feel withdrawal","behavior": "taking real space to know what you actually want before committing / communicating it as restoration not rejection",
                       "risk": "distance that reads as abandonment",     "crystals": ["rose-quartz", "moonstone"]},
        "career":     {"metaphor": "solo-deep-work",           "behavior": "withdrawing from meetings and noise to do the one piece of work only you can do / the lone expert phase",
                       "risk": "isolation that hides you from opportunity", "crystals": ["labradorite", "lapis"]},
        "finances":   {"metaphor": "independent research",     "behavior": "doing your own deep diligence instead of following the crowd's tip / the contrarian who reads the filings alone",
                       "risk": "over-thinking into missed entries",      "crystals": ["aventurine", "lapis"]},
        "health":     {"metaphor": "restorative retreat",      "behavior": "a real pause (digital detox, sleep reset, solo reset week) to hear what the body has been trying to say",
                       "risk": "retreat that becomes hiding",            "crystals": ["smoky-quartz", "amethyst"]},
        "spiritual":  {"metaphor": "lantern-lit inner guide",  "behavior": "carrying your own light through structured solitude / retreat with a question and a return date",
                       "risk": "stuckness disguised as depth",          "crystals": ["labradorite", "amethyst"]},
    }),
    # ---------- 10. Wheel of Fortune ----------
    (10, "wheel-of-fortune", "The Turning", {
        "love":       {"metaphor": "phase-turn of a bond",     "behavior": "recognizing a relationship has entered a new phase (commitment, cooling, reunion) and riding it",
                       "risk": "clinging to a phase that has ended",     "crystals": ["rose-quartz", "moonstone"]},
        "career":     {"metaphor": "momentum-on your side",    "behavior": "acting now because the cycle is turning your way / a role, market, or project whose time has come",
                       "risk": "passivity when you should press",        "crystals": ["citrine", "aventurine"]},
        "finances":   {"metaphor": "cycle-timing",             "behavior": "reading where in the cycle a market or income source sits / buying the dip, taking profit on the upturn",
                       "risk": "gambling disguised as timing",          "crystals": ["aventurine", "turquoise"]},
        "health":     {"metaphor": "seasonal body rhythm",     "behavior": "honoring the body's natural cycles (circadian, hormonal, seasonal) instead of forcing constant output",
                       "risk": "fatalism about a hard streak",          "crystals": ["bloodstone", "aventurine"]},
        "spiritual":  {"metaphor": "impermanence acceptance",  "behavior": "sorting what you can shape from what you must release / riding change instead of gripping it",
                       "risk": "passive resignation",                   "crystals": ["turquoise", "amethyst"]},
    }),
    # ---------- 11. Justice ----------
    (11, "justice", "The Truth-Seeker", {
        "love":       {"metaphor": "fair-reckoning",           "behavior": "an honest accounting of who has given what in the relationship / a decision weighed on evidence, not hope",
                       "risk": "fairness that reads as coldness",        "crystals": ["rose-quartz", "lapis"]},
        "career":     {"metaphor": "evidence-based call",      "behavior": "making the decision on the data, not office politics / a contract, a verdict, a promotion weighed fairly",
                       "risk": "honesty without warmth",                "crystals": ["lapis", "sodalite"]},
        "finances":   {"metaphor": "books-balanced audit",     "behavior": "an honest audit of what you owe and what you're owed / a settlement, a contract, fair terms",
                       "risk": "avoiding the responsibility you owe",   "crystals": ["pyrite", "aventurine"]},
        "health":     {"metaphor": "honest diagnosis",         "behavior": "getting the real test result and facing it / weighing symptoms on evidence, not denial",
                       "risk": "self-blame for what isn't your fault",  "crystals": ["bloodstone", "sodalite"]},
        "spiritual":  {"metaphor": "karmic accounting",        "behavior": "an honest review of cause and effect in your life without self-sentencing / the scales of conscience",
                       "risk": "inner judge replacing inner guide",     "crystals": ["lapis", "amethyst"]},
    }),
    # ---------- 12. The Hanged Man ----------
    (12, "the-hanged-man", "The Surrendered", {
        "love":       {"metaphor": "willing pause",            "behavior": "choosing to wait in limbo (a break, a maybe) to let a new angle on the relationship surface",
                       "risk": "stalling disguised as patience",         "crystals": ["rose-quartz", "aquamarine"]},
        "career":     {"metaphor": "inverted perspective",     "behavior": "deliberately flipping your view of a stuck problem / the pause before the strategic pivot",
                       "risk": "indecision wearing patience's clothes", "crystals": ["sodalite", "lapis"]},
        "finances":   {"metaphor": "hold-and-see",             "behavior": "intentionally not acting on a position, letting the situation reveal itself / sacrificing short-term for position",
                       "risk": "martyrdom around money sacrificed",      "crystals": ["aventurine", "sodalite"]},
        "health":     {"metaphor": "forced slowdown",          "behavior": "an injury or illness that asks you to stop and see your body from a new angle / bed rest as revelation",
                       "risk": "refusing to re-engage once healed",      "crystals": ["bloodstone", "smoky-quartz"]},
        "spiritual":  {"metaphor": "reversed-view surrender",  "behavior": "arguing the opposite of a fixed belief to loosen its grip / chosen sacrifice for insight",
                       "risk": "spiritualizing avoidance",              "crystals": ["selenite", "amethyst"]},
    }),
    # ---------- 13. Death ----------
    (13, "death", "The Transformer", {
        "love":       {"metaphor": "relationship ending",      "behavior": "a bond completing (not always a breakup; sometimes a death of an old dynamic so a new one can form)",
                       "risk": "clinging to what has already closed",   "crystals": ["rose-quartz", "obsidian"]},
        "career":     {"metaphor": "role-identity death",      "behavior": "the end of a job title or career chapter that has completed / clearing a defunct business to start fresh",
                       "risk": "refusing to let an old self end",       "crystals": ["malachite", "obsidian"]},
        "finances":   {"metaphor": "structure-completion",     "behavior": "closing a dead income source, a failing venture, a debt chapter / the write-off that clears the books",
                       "risk": "keeping a dead asset on life support",  "crystals": ["obsidian", "smoky-quartz"]},
        "health":     {"metaphor": "regenerative clearing",    "behavior": "a detox, a fast, a surgery, a shedding of an old habit so the body can rebuild",
                       "risk": "forcing an ending before its time",     "crystals": ["bloodstone", "obsidian"]},
        "spiritual":  {"metaphor": "ego-death rebirth",        "behavior": "letting an old identity die so a truer one can live / the dark night that precedes morning",
                       "risk": "resistance that turns to stagnation",   "crystals": ["obsidian", "amethyst"]},
    }),
    # ---------- 14. Temperance ----------
    (14, "temperance", "The Alchemist", {
        "love":       {"metaphor": "patient blending",         "behavior": "mixing two different needs/styles slowly into a sustainable rhythm / the art of not forcing either side",
                       "risk": "middle that avoids hard edges",          "crystals": ["rose-quartz", "amazonite"]},
        "career":     {"metaphor": "middle-way integration",   "behavior": "blending competing priorities (quality vs speed, team vs solo) into one workable approach",
                       "risk": "compromise that loses the edge",         "crystals": ["fluorite", "citrine"]},
        "finances":   {"metaphor": "balanced allocation",      "behavior": "a measured portfolio mix (risk/safety, save/spend) held with patience, not swung between extremes",
                       "risk": "impatience with slow compounding",       "crystals": ["aventurine", "jade"]},
        "health":     {"metaphor": "steady-regulation",        "behavior": "the middle path in food, drink, training: enough, not extreme / recovery and effort blended",
                       "risk": "excess hiding as balance",               "crystals": ["amethyst", "smoky-quartz"]},
        "spiritual":  {"metaphor": "alchemical blending",      "behavior": "holding opposites (effort and surrender, heaven and earth) in living tension / slow integration",
                       "risk": "impatience with the pace of integration", "crystals": ["amethyst", "fluorite"]},
    }),
    # ---------- 15. The Devil ----------
    (15, "the-devil", "The Shadow-Knower", {
        "love":       {"metaphor": "toxic-bond chain",         "behavior": "the relationship you keep returning to despite knowing the cost / devotion indistinguishable from compulsion",
                       "risk": "mistaking intensity for love",            "crystals": ["rose-quartz", "black-tourmaline"]},
        "career":     {"metaphor": "golden-handcuff bind",     "behavior": "stuck in a role for the money, status, or fear / a workplace that feeds your shadow (ego, ambition)",
                       "risk": "the chain you can lift but don't",        "crystals": ["smoky-quartz", "black-tourmaline"]},
        "finances":   {"metaphor": "consumption-loop trap",    "behavior": "spending tied to identity, status, or addiction / debt that feeds on a self-limiting story",
                       "risk": "seeing the chain but not lifting it",     "crystals": ["obsidian", "pyrite"]},
        "health":     {"metaphor": "substance-habit bond",     "behavior": "the pattern (sugar, alcohol, scroll, stimulant) you've named but not loosened / the body carrying the attachment",
                       "risk": "shame that tightens the chain",           "crystals": ["bloodstone", "black-tourmaline"]},
        "spiritual":  {"metaphor": "shadow-facing liberation", "behavior": "looking directly at the attachment you've projected outward / reclaiming the disowned part",
                       "risk": "fascination with the shadow over release", "crystals": ["black-tourmaline", "obsidian"]},
    }),
    # ---------- 16. The Tower ----------
    (16, "the-tower", "The Awakener", {
        "love":       {"metaphor": "sudden disclosure",        "behavior": "a truth that detonates the relationship's unspoken premise / an affair, a lie, a breaking-real moment",
                       "risk": "rebuilding on the same false base",        "crystals": ["rose-quartz", "smoky-quartz"]},
        "career":     {"metaphor": "structure-collapse",       "behavior": "a layoff, a shutdown, a public failure of a plan that was already unstable / the org chart blows up",
                       "risk": "propping up what has already cracked",     "crystals": ["smoky-quartz", "hematite"]},
        "finances":   {"metaphor": "portfolio shock",          "behavior": "a sudden loss, a margin call, a fraud revealed, an income source wiped / the number you didn't want to see",
                       "risk": "avoiding the lesson in the loss",          "crystals": ["black-tourmaline", "smoky-quartz"]},
        "health":     {"metaphor": "acute wake-up",            "behavior": "a sudden symptom or diagnosis that ends denial overnight / the collapse that forces the lifestyle change",
                       "risk": "returning to the habits that caused it",   "crystals": ["bloodstone", "smoky-quartz"]},
        "spiritual":  {"metaphor": "false-structure fall",     "behavior": "the belief-system or identity that collapses under truth / rebuilding on foundations that are now actually true",
                       "risk": "resisting the necessary rebuild",          "crystals": ["smoky-quartz", "labradorite"]},
    }),
    # ---------- 17. The Star ----------
    (17, "the-star", "The Hopeful", {
        "love":       {"metaphor": "renewed-heart reopening",  "behavior": "letting love back in gently after a hard season / a relationship renewing on truer terms",
                       "risk": "forcing hope before you've grieved",        "crystals": ["rose-quartz", "aquamarine"]},
        "career":     {"metaphor": "guiding-vision return",    "behavior": "reconnecting with the purpose that made you choose this path / a clear sense of direction after drift",
                       "risk": "hope without the work",                    "crystals": ["aquamarine", "citrine"]},
        "finances":   {"metaphor": "recovery-guided rebuild",  "behavior": "a slow, principled rebuild after a loss / trusting the long view while doing the patient work",
                       "risk": "denial dressed as faith",                 "crystals": ["aventurine", "aquamarine"]},
        "health":     {"metaphor": "healing-trust restore",    "behavior": "trusting the body to heal and doing the gentle daily things (water, rest, light) that let it",
                       "risk": "passive hope skipping treatment",         "crystals": ["aquamarine", "lepidolite"]},
        "spiritual":  {"metaphor": "rekindled-faith star",     "behavior": "the quiet return of meaning after despair / the still pool in which guidance is reflected again",
                       "risk": "clinging to hope to avoid grief",         "crystals": ["selenite", "aquamarine"]},
    }),
    # ---------- 18. The Moon ----------
    (18, "the-moon", "The Dreamer", {
        "love":       {"metaphor": "half-lit doubt",           "behavior": "not everything is clear about a partner or a new interest / the part of the story you can't yet see",
                       "risk": "building defenses against the unconfirmed", "crystals": ["moonstone", "rose-quartz"]},
        "career":     {"metaphor": "uncertain-path fog",       "behavior": "moving through a phase where the rational map doesn't fit / hidden office dynamics surfacing",
                       "risk": "forcing premature clarity",                 "crystals": ["labradorite", "moonstone"]},
        "finances":   {"metaphor": "murky-terms haze",         "behavior": "a deal, a contract, or a market you can't fully read / the fine print hiding in the half-light",
                       "risk": "acting on fear or illusion",               "crystals": ["moonstone", "smoky-quartz"]},
        "health":     {"metaphor": "unclear-symptom dream",    "behavior": "symptoms, dreams, or signals whose meaning isn't yet clear / staying with the not-knowing without spiraling",
                       "risk": "anxiety amplifying the unknown",           "crystals": ["lepidolite", "moonstone"]},
        "spiritual":  {"metaphor": "subconscious-surfacing",   "behavior": "dreams, synchronicities, and half-formed impressions carrying information / honoring what's emerging",
                       "risk": "confusing intuition with projection",      "crystals": ["moonstone", "amethyst"]},
    }),
    # ---------- 19. The Sun ----------
    (19, "the-sun", "The Radiant", {
        "love":       {"metaphor": "shared-joy warmth",        "behavior": "the simple warmth of two people genuinely enjoying each other / a relationship in its sunlit season",
                       "risk": "taking the good for granted",               "crystals": ["rose-quartz", "carnelian"]},
        "career":     {"metaphor": "success-in-bloom",         "behavior": "a project, role, or venture in its moment of warmth and recognition / the season going well",
                       "risk": "ego inflation after the win",              "crystals": ["citrine", "sunstone"]},
        "finances":   {"metaphor": "abundance-flow high",      "behavior": "a strong income season, a payout, a deal closing / the portfolio in the sun",
                       "risk": "excessive optimism on spending",           "crystals": ["citrine", "aventurine"]},
        "health":     {"metaphor": "vitality-season",          "behavior": "a genuine high-energy, well-rested, thriving stretch / cultivating joy as part of wellness",
                       "risk": "ignoring limits under the high",           "crystals": ["carnelian", "sunstone"]},
        "spiritual":  {"metaphor": "luminous-clarity",         "behavior": "the unobscured warm clarity of a settled mind / joy as a genuine resource, not denial",
                       "risk": "toxic positivity masking shadow",          "crystals": ["sunstone", "citrine"]},
    }),
    # ---------- 20. Judgment ----------
    (20, "judgment", "The Awakened", {
        "love":       {"metaphor": "honest-reckoning call",    "behavior": "a clear-eyed accounting of the relationship that asks for renewal or release / the wake-up conversation",
                       "risk": "reckoning curdling into blame",             "crystals": ["rose-quartz", "angelite"]},
        "career":     {"metaphor": "calling-answer pivot",      "behavior": "hearing and answering a call to a larger, truer career / the career pivot you can no longer ignore",
                       "risk": "refusing the call out of fear",             "crystals": ["citrine", "angelite"]},
        "finances":   {"metaphor": "clean-slate reckoning",     "behavior": "an honest financial reckoning (debt plan, write-off, restructure) that clears the way for renewal",
                       "risk": "self-criticism replacing honest review",    "crystals": ["pyrite", "aventurine"]},
        "health":     {"metaphor": "wake-up diagnosis",         "behavior": "a result or moment that asks you to finally answer the body's call and change how you live",
                       "risk": "the inner judge sentencing the body",        "crystals": ["bloodstone", "angelite"]},
        "spiritual":  {"metaphor": "rebirth-trumpet",           "behavior": "the call to a larger life heard as guidance, not accusation / rising to the next version of yourself",
                       "risk": "doubting the path that's stirring",          "crystals": ["angelite", "selenite"]},
    }),
    # ---------- 21. The World ----------
    (21, "the-world", "The Complete", {
        "love":       {"metaphor": "milestone-integration",    "behavior": "a relationship reaching a fulfilled level (commitment, family, a chapter complete) / honoring what you've built",
                       "risk": "loose ends before the next threshold",       "crystals": ["rose-quartz", "lapis"]},
        "career":     {"metaphor": "chapter-complete summit",   "behavior": "a project, role, or body of work reaching its fulfilled end / the graduation, the exit, the recognition",
                       "risk": "lingering instead of stepping through",      "crystals": ["citrine", "lapis"]},
        "finances":   {"metaphor": "cycle-fulfilled close",     "behavior": "a financial goal reached and a cycle closed / the sale, the payoff, the milestone met",
                       "risk": "almost-there loose ends",                   "crystals": ["aventurine", "pyrite"]},
        "health":     {"metaphor": "integrated-wholeness",      "behavior": "a health journey reaching integration: body, mind, habits aligned into a sustainable whole",
                       "risk": "stopping the practices that got you here",   "crystals": ["bloodstone", "quartz"]},
        "spiritual":  {"metaphor": "mandala-completion",        "behavior": "the integrated wholeness of a long inner journey / recognizing the threshold to the next cycle (back to The Fool)",
                       "risk": "resistance to closure",                    "crystals": ["selenite", "quartz"]},
    }),
]

assert len(CARDS) == 22, f"expected 22 cards, got {len(CARDS)}"

SCENARIOS = ["love", "career", "finances", "health", "spiritual"]

cards_out = []
for number, slug, archetype, scenarios in CARDS:
    assert set(scenarios.keys()) == set(SCENARIOS), f"{slug} scenario keys mismatch"
    # metaphor uniqueness within card (5 distinct)
    metaphors = [scenarios[s]["metaphor"] for s in SCENARIOS]
    assert len(set(metaphors)) == 5, f"{slug} metaphor not unique: {metaphors}"
    # crystal slugs lowercase, 2 per scenario
    for s in SCENARIOS:
        assert len(scenarios[s]["crystals"]) == 2, f"{slug}.{s} needs 2 crystals"
        for c in scenarios[s]["crystals"]:
            assert c == c.lower(), f"{slug}.{s} crystal not lowercase: {c}"
    cards_out.append({
        "card": slug,
        "number": number,
        "archetype": archetype,
        "scenarios": {s: scenarios[s] for s in SCENARIOS},
    })

out = {
    "_meta": {
        "purpose": "22 Major Arcana x 5 scenarios metaphor determination config (110 entries)",
        "framework": "模板-Tarot-场景文章框架.md (§3 场景锚定 / §4 五场景差异化 / §5 场景化水晶)",
        "data_source": "07-互动工具/_shared/tarot-knowledge.json (22 牌 archetype/upright_meaning 单源)",
        "scenarios": SCENARIOS,
        "scenario_crystal_tendency": {
            "love": "heart chakra / relationship flow → rose-quartz / moonstone / rhodonite",
            "career": "manifestation / will → citrine / tiger-eye / pyrite",
            "finances": "abundance / stability → aventurine / pyrite / jade",
            "health": "grounding / detox clarity → bloodstone / quartz / smoky-quartz",
            "spiritual": "higher self / intuition → amethyst / selenite / labradorite",
        },
        "rules": [
            "每牌 5 场景 metaphor 必须不同（防同牌 5 篇雷同，硬校验已通过）",
            "behavior 必须是该牌该场景的具体人物画像/行为，禁通用句",
            "crystals 每场景 2 颗，小写 slug，按场景倾向+牌 archetype 调配",
            "metaphor 落到该牌 Rider-Waite 独有画面在该场景的投射",
        ],
        "build_validated": "5 metaphor uniqueness per card + scenario key set + crystal count + lowercase slugs",
        "total_cards": 22,
        "total_entries": 110,
    },
    "cards": cards_out,
}

out_path = os.path.join(os.path.dirname(__file__), "scenario-knowledge.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

size = os.path.getsize(out_path)
print(f"WROTE: {out_path}")
print(f"SIZE: {size} bytes")
print(f"CARDS: {len(cards_out)}  ENTRIES: {sum(len(c['scenarios']) for c in cards_out)}")
