# -*- coding: utf-8 -*-
"""Build Dream Subject Backbone batch 2.

Outputs:
- dream-backbone-subjects-10.jsonl
- appends/replaces these 10 rows in ../qa/dream-wp-draft-readiness.jsonl
"""

from __future__ import annotations

import json
from pathlib import Path


BACKBONE_DIR = Path(__file__).resolve().parent
DREAMS_DIR = BACKBONE_DIR.parent
OUT_JSONL = BACKBONE_DIR / "dream-backbone-subjects-10.jsonl"
READINESS_JSONL = DREAMS_DIR / "qa" / "dream-wp-draft-readiness.jsonl"


COMMON_SLEEP = {
    "sleep_mechanism": (
        "Dreams usually become most vivid in REM sleep, when emotion and memory systems are active "
        "and the waking brain's linear filtering is quieter. Dream content often follows the continuity "
        "hypothesis: it recombines recent concerns, body sensations, memories, and emotional conflicts."
    ),
    "evidence_boundary": (
        "Sleep science can describe REM mechanisms and waking-life continuity. It has not confirmed a "
        "single fixed symbolic meaning for this dream image."
    ),
    "source_status": "needs_verification",
}


TOPICS = [
    {
        "keyword": "house dream meaning",
        "slug": "house-dream-meaning",
        "title": "House Dream Meaning",
        "meta": "House Dream Meaning: Self, Safety, Rooms, Family Patterns & Crystal Reflection | Earthward",
        "description": "A grounded guide to house dreams: sleep science, Jungian psychology, spiritual symbolism, room variations, and Black Tourmaline crystal journaling.",
        "symbol": "house",
        "core": "the structure of the self, your sense of safety, and the rooms of life you are currently living in",
        "quick": "A house dream usually points to the self as a whole: your body, identity, family pattern, private life, and inner architecture. The room, condition, and ownership of the house matter more than the word house by itself.",
        "sleep_specific": "House dreams often reuse familiar spatial memory. Bedrooms, kitchens, stairs, basements, attics, and locked rooms can appear because the brain stores emotional memory in place-based maps as well as stories.",
        "psych": "Psychologically, a house dream asks which part of your inner life is being shown. A clean, known house can reflect integration and safety. A strange house can mark unfamiliar parts of yourself. A damaged house can mirror exhaustion or a boundary that needs repair. A hidden room often points to unused capacity or a memory you have not fully entered.",
        "jung": "In a Jungian reading, the house is one of the clearest images of the psyche. The upper floors often point toward conscious identity and ideals, while basements and cellars point toward shadow material, instincts, family memory, and what has been stored below awareness. Renovating a house can suggest inner development; being locked out can suggest estrangement from your own needs.",
        "spiritual": "Spiritually, house dreams often speak about stewardship, protection, ancestry, and the condition of the soul's dwelling place. Islamic and Biblical frames both treat the home as a place of trust and responsibility, but this page offers reflection rather than doctrine.",
        "crystal": ("black-tourmaline-meaning", "smoky-quartz-meaning", "selenite-meaning"),
        "crystal_text": "Black Tourmaline is the primary anchor for boundary and home-protection reflection; Smoky Quartz supports grounding when the house feels unstable; Selenite is used as a symbolic clearing stone for rooms, thresholds, and reset rituals.",
        "variations": [
            "Childhood house: family pattern, old identity, inherited emotional weather.",
            "Unknown house: an unfamiliar part of the self asking to be explored.",
            "Messy or damaged house: neglected needs, burnout, or boundaries needing repair.",
            "Hidden room: unused capacity, memory, or possibility.",
            "Moving house: identity transition and a new life structure forming.",
        ],
        "links": [
            ("water dream meaning", "/water-dream-meaning/"),
            ("death dream meaning", "/death-dream-meaning/"),
            ("lost dream meaning", "/lost-dream-meaning/"),
        ],
    },
    {
        "keyword": "car dream meaning",
        "slug": "car-dream-meaning",
        "title": "Car Dream Meaning",
        "meta": "Car Dream Meaning: Direction, Control, Accidents, Passengers & Crystal Reflection | Earthward",
        "description": "A grounded guide to car dreams and car accident dreams: direction, control, passengers, sleep science, symbolism, and Hematite crystal journaling.",
        "symbol": "car",
        "core": "direction, agency, life momentum, and who or what is steering your current path",
        "quick": "A car dream usually reflects how you are moving through life: your direction, speed, control, and the people or pressures riding with you. A car accident dream is usually about fear of collision, loss of control, or a path that needs slowing down.",
        "sleep_specific": "Driving is a familiar procedural pattern, so dreams can easily turn life pressure into scenes of braking, swerving, getting lost, losing control, or being a passenger.",
        "psych": "Psychologically, the car is a mobility symbol. If you drive confidently, the dream may reflect agency. If someone else drives, the dream may ask who is steering your choices. If the brakes fail, look for a waking-life situation where pace has outrun control. If you crash, ask what two obligations, identities, or desires are colliding.",
        "jung": "In a Jungian reading, a vehicle is an ego-vessel: the structure carrying the conscious self through the world. A damaged car can mark a damaged life strategy. A missing car can mark stalled agency. A road trip can signal individuation, with the landscape showing the emotional terrain of the path.",
        "spiritual": "Spiritually, car dreams often read as path and stewardship symbols. Islamic and Biblical reflection may frame the road as moral direction and the driver as responsibility; broader spiritual readings ask whether your path is aligned with your values.",
        "crystal": ("hematite-meaning", "black-tourmaline-meaning", "citrine-meaning"),
        "crystal_text": "Hematite is the primary anchor for staying embodied and steady while choosing direction; Black Tourmaline supports boundary reflection around passengers and pressure; Citrine is used as a confidence and decision-making journaling stone.",
        "variations": [
            "Car accident: conflict, collision of responsibilities, or fear that the path is unsafe.",
            "Brakes fail: pace without enough control.",
            "Someone else driving: another person, habit, or fear steering your choices.",
            "Lost while driving: uncertainty about direction.",
            "New car: new identity, role, or life vehicle.",
        ],
        "links": [
            ("being chased dream meaning", "/being-chased-dream-meaning/"),
            ("lost dream meaning", "/lost-dream-meaning/"),
            ("falling dream meaning", "/falling-dream-meaning/"),
        ],
    },
    {
        "keyword": "fire dream meaning",
        "slug": "fire-dream-meaning",
        "title": "Fire Dream Meaning",
        "meta": "Fire Dream Meaning: Anger, Purification, Desire, Transformation & Crystal Reflection | Earthward",
        "description": "A grounded guide to fire dreams: anger, passion, purification, spiritual symbolism, safe language, and Carnelian crystal journaling.",
        "symbol": "fire",
        "core": "intensity, transformation, anger, desire, purification, and energy that can warm or burn",
        "quick": "A fire dream usually points to intense energy: anger, passion, purification, urgency, creative force, or a situation that feels hard to contain. Whether the fire warms, illuminates, spreads, or destroys changes the meaning.",
        "sleep_specific": "Fire imagery can intensify during stressful periods because REM dreams amplify emotional salience. The brain may choose heat, flame, smoke, or burning scenes to dramatize urgency, conflict, and change.",
        "psych": "Psychologically, fire asks what is heating up. A contained candle or hearth can reflect inspiration and life force. A spreading fire can mirror anger, pressure, or a conflict that needs containment. Smoke can point to confusion after intensity. Being afraid of fire can mark fear of your own anger or desire.",
        "jung": "In Jungian work, fire is a transformation symbol: alchemy, purification, libido, and spirit. It is not simply good or bad. The question is whether the fire is serving consciousness or consuming what needs protection.",
        "spiritual": "Spiritually, fire carries purification, judgment, presence, warning, and illumination across traditions. Islamic and Biblical frames treat fire with seriousness; broader spiritual readings may see it as kundalini, creative charge, or cleansing. These are reflective readings, not doctrine.",
        "crystal": ("carnelian-meaning", "red-jasper-meaning", "smoky-quartz-meaning"),
        "crystal_text": "Carnelian is the primary anchor for creative fire and desire; Red Jasper supports steady action rather than impulsive reaction; Smoky Quartz helps ground the after-heat of anger or conflict.",
        "variations": [
            "House on fire: private life, family pattern, or identity under pressure.",
            "Forest fire: large-scale change or emotion beyond one person.",
            "Candle flame: attention, prayer, inspiration, or a small living hope.",
            "Putting out fire: containment, repair, or emotional regulation.",
            "Being burned: sensitivity around anger, shame, or exposure.",
        ],
        "links": [
            ("house dream meaning", "/house-dream-meaning/"),
            ("death dream meaning", "/death-dream-meaning/"),
            ("water dream meaning", "/water-dream-meaning/"),
        ],
    },
    {
        "keyword": "baby dream meaning",
        "slug": "baby-dream-meaning",
        "title": "Baby Dream Meaning",
        "meta": "Baby Dream Meaning: New Beginnings, Care, Vulnerability & Crystal Reflection | Earthward",
        "description": "A grounded guide to baby dreams: new beginnings, care responsibilities, vulnerability, pregnancy boundaries, and Rose Quartz crystal journaling.",
        "symbol": "baby",
        "core": "new beginnings, vulnerability, responsibility, and something young in you that needs care",
        "quick": "A baby dream most often points to something new and vulnerable: a project, relationship, identity, creative seed, or part of yourself that needs care. It does not automatically predict pregnancy.",
        "sleep_specific": "Dreams often incorporate care-related emotion and recent concerns. For people parenting, trying to conceive, grieving, or navigating change, baby imagery can carry both literal and symbolic material.",
        "psych": "Psychologically, a baby dream asks what is new, fragile, dependent, or not yet fully formed. Holding a baby can reflect willingness to care for a new responsibility. Forgetting or losing a baby can reflect fear of neglecting something important. A crying baby can point to an unmet need that has become impossible to ignore.",
        "jung": "In Jungian work, the baby often appears as the divine child or new self: the small beginning of a future identity. It may be hopeful and demanding at once, because new life requires protection before it can mature.",
        "spiritual": "Spiritually, baby dreams can be read as blessing, innocence, entrusted care, or the beginning of a new chapter. Religious interpretations should be held gently and never used to promise pregnancy, predict gender, or make a doctrinal claim.",
        "crystal": ("rose-quartz-meaning", "moonstone-meaning", "selenite-meaning"),
        "crystal_text": "Rose Quartz is the primary anchor for tenderness and self-compassion; Moonstone supports reflection on cycles and beginnings; Selenite is used as a simple clarity stone for naming what needs care.",
        "variations": [
            "Holding a baby: accepting responsibility for something new.",
            "Crying baby: an unmet need demanding attention.",
            "Losing a baby: fear of neglecting a project, bond, or vulnerable part of self.",
            "Baby girl or baby boy: qualities of receptive or active new energy, not literal prediction.",
            "Unknown baby: a new aspect of self not yet named.",
        ],
        "links": [
            ("pregnancy dream meaning", "/pregnancy-dream-meaning/"),
            ("wedding dream meaning", "/wedding-dream-meaning/"),
            ("death dream meaning", "/death-dream-meaning/"),
        ],
    },
    {
        "keyword": "lost dream meaning",
        "slug": "lost-dream-meaning",
        "title": "Lost Dream Meaning",
        "meta": "Lost Dream Meaning: Direction, Uncertainty, Identity Drift & Crystal Reflection | Earthward",
        "description": "A grounded guide to dreams about being lost: uncertainty, identity drift, transitions, spiritual symbolism, and Labradorite crystal journaling.",
        "symbol": "being lost",
        "core": "uncertainty, identity drift, and the search for orientation when old maps no longer work",
        "quick": "A lost dream usually points to uncertainty: not knowing where you are, where you are going, or which part of yourself to trust. It often appears during transitions when the old map no longer fits.",
        "sleep_specific": "The dreaming brain often uses spatial navigation to express emotional uncertainty. Getting lost in a school, city, house, forest, airport, or road can turn a vague waking problem into a map problem.",
        "psych": "Psychologically, being lost asks where you lack orientation. Are you lost in a role, a relationship, a decision, a place, or an identity? The setting matters. A school points to performance and learning; a city to social complexity; a forest to instinct and uncertainty; a house to inner life.",
        "jung": "In a Jungian reading, being lost can be part of initiation. The ego loses the known road so the deeper self can reveal a different path. That does not make the dream easy; it means the disorientation may be meaningful rather than merely random.",
        "spiritual": "Spiritually, lost dreams often read as guidance dreams: the soul asking for a new compass, a return to prayer or practice, or humility about not controlling the entire path.",
        "crystal": ("labradorite-meaning", "smoky-quartz-meaning", "fluorite-meaning"),
        "crystal_text": "Labradorite is the primary anchor for finding intuition in uncertainty; Smoky Quartz supports grounding when the map disappears; Fluorite is used as a clarity stone for sorting next steps.",
        "variations": [
            "Lost in a house: unsure where you belong inside yourself.",
            "Lost in a city: social complexity, overstimulation, or too many options.",
            "Lost in a forest: instinct, uncertainty, and the need for patience.",
            "Lost while driving: life direction and decision pressure.",
            "Trying to find someone: a missing quality, relationship, or support system.",
        ],
        "links": [
            ("house dream meaning", "/house-dream-meaning/"),
            ("car dream meaning", "/car-dream-meaning/"),
            ("being chased dream meaning", "/being-chased-dream-meaning/"),
        ],
    },
    {
        "keyword": "sex dream meaning",
        "slug": "sex-dream-meaning",
        "title": "Sex Dream Meaning",
        "meta": "Sex Dream Meaning: Intimacy, Desire, Integration, Boundaries & Crystal Reflection | Earthward",
        "description": "A non-explicit, grounded guide to sex dreams: intimacy, desire, integration, boundaries, spiritual sensitivity, and Rose Quartz crystal journaling.",
        "symbol": "sex",
        "core": "intimacy, desire, integration, vulnerability, boundaries, and the psyche's search for union",
        "quick": "A sex dream is usually less about literal prediction and more about intimacy, attraction, integration, curiosity, boundaries, or a quality in the other person that your psyche is trying to meet. This page keeps the interpretation non-explicit and reflective.",
        "sleep_specific": "Sexual or intimate dream imagery can arise from normal REM physiology, emotional memory, recent attraction, relationship stress, or symbolic integration. It does not automatically reveal a secret desire or require action.",
        "psych": "Psychologically, sex dreams ask what kind of connection is being dramatized. With a partner, the dream may reflect closeness or tension. With an ex, it may reflect unfinished emotional material, not a command to reconnect. With a stranger, it may symbolize a quality you are integrating. With a taboo or uncomfortable figure, the first task is boundaries and emotional safety, not literal interpretation.",
        "jung": "In Jungian work, intimate union can symbolize integration of opposites: conscious and unconscious, masculine and feminine, active and receptive, known and unknown parts of the self. The person in the dream may represent an inner quality more than an external instruction.",
        "spiritual": "Spiritually, sex dreams are treated carefully. Some traditions frame them as temptation, soul tie, impurity, or energetic exchange, while others read them as union and life force. This page does not make doctrinal claims. If your faith tradition has specific teachings, bring the dream to a trusted advisor rather than treating a web page as authority.",
        "crystal": ("rose-quartz-meaning", "carnelian-meaning", "rhodonite-meaning"),
        "crystal_text": "Rose Quartz is the primary anchor for tenderness and consent-aware self-reflection; Carnelian supports creative life force; Rhodonite is used for boundary, repair, and heart-centered accountability.",
        "variations": [
            "Sex with an ex: unresolved emotion, memory, or an old relationship pattern.",
            "Sex with a stranger: integrating an unknown quality in yourself.",
            "Sex with a friend: intimacy, admiration, or boundary questions, not automatic attraction.",
            "Uncomfortable sex dream: pause literal interpretation and focus on safety, boundaries, and support.",
            "Recurring sex dream: a repeated emotional pattern asking for honest reflection.",
        ],
        "links": [
            ("wedding dream meaning", "/wedding-dream-meaning/"),
            ("baby dream meaning", "/baby-dream-meaning/"),
            ("naked dream meaning", "/naked-dream-meaning/"),
        ],
        "sensitive": True,
    },
    {
        "keyword": "being chased dream meaning",
        "slug": "being-chased-dream-meaning",
        "title": "Being Chased Dream Meaning",
        "meta": "Being Chased Dream Meaning: Avoidance, Fear, Pressure & Crystal Reflection | Earthward",
        "description": "A grounded guide to being chased dreams: avoidance, threat response, recurring nightmares, spiritual symbolism, and Black Tourmaline crystal journaling.",
        "symbol": "being chased",
        "core": "avoidance, pressure, fear response, and the part of life you are running from",
        "quick": "A being chased dream usually points to avoidance or pressure. The chaser often represents a feeling, responsibility, conflict, memory, or decision that your waking self has not yet faced.",
        "sleep_specific": "Chase dreams belong to the common nightmare family. They often use the body's threat-response system to dramatize waking stress, avoidance, or unresolved fear. Recurring chase nightmares that disturb sleep deserve care, not just interpretation.",
        "psych": "Psychologically, the key question is not only who is chasing you, but what happens when you stop running. A faceless pursuer can represent generalized pressure. An animal can represent instinct. A known person can represent conflict or projection. The dream often asks for one step toward facing, naming, or containing the avoided thing.",
        "jung": "In Jungian work, the chaser is often shadow material: a disowned part of the self pursuing consciousness. The point is not to be caught by it, but to turn toward it with enough support and ask what energy it carries.",
        "spiritual": "Spiritually, chase dreams are often read as warning, conviction, pressure, or a call to stop fleeing truth. Religious readings should remain reflective and never become accusation or fear-based doctrine.",
        "crystal": ("black-tourmaline-meaning", "smoky-quartz-meaning", "amethyst-meaning"),
        "crystal_text": "Black Tourmaline is the primary anchor for protection and boundary reflection; Smoky Quartz supports grounding after a fear dream; Amethyst helps create reflective distance before journaling.",
        "variations": [
            "Chased by a person: conflict, fear, projection, or unresolved relationship pressure.",
            "Chased by an animal: instinct, anger, desire, or survival energy.",
            "Chased but unable to run: freeze response and felt helplessness.",
            "Chased in a house: private or family pattern pursuing awareness.",
            "Turning to face the chaser: readiness to engage what has been avoided.",
        ],
        "links": [
            ("falling dream meaning", "/falling-dream-meaning/"),
            ("lost dream meaning", "/lost-dream-meaning/"),
            ("car dream meaning", "/car-dream-meaning/"),
        ],
    },
    {
        "keyword": "dying dream meaning",
        "slug": "dying-dream-meaning",
        "title": "Dying Dream Meaning",
        "meta": "Dying Dream Meaning: Transition, Fear, Letting Go & Crystal Reflection | Earthward",
        "description": "A careful guide to dreams about dying: transformation, fear, grief boundaries, crisis-safe language, and Malachite crystal journaling.",
        "symbol": "dying",
        "core": "the process of ending, fear of change, surrender, and the slow letting go of an old identity",
        "quick": "A dying dream usually points to a process of change rather than literal death. It can reflect fear, grief, health anxiety, or the slow ending of an old role, pattern, or chapter.",
        "sleep_specific": "Dying dreams can be emotionally vivid because REM sleep binds fear, memory, and body sensation into narrative. They can also appear during grief, illness anxiety, major transition, or after exposure to death-related media.",
        "psych": "Psychologically, dying differs from death: death is an event; dying is a process. The dream may show you living through the ending, not only seeing the result. Ask what part of life feels like it is fading, changing, or asking to be released.",
        "jung": "In Jungian work, dying is an initiation image. The old ego position weakens so a new relationship to the Self can form. The dream can be frightening because the psyche experiences transformation as real loss before it experiences it as renewal.",
        "spiritual": "Spiritually, dying dreams may be read as surrender, repentance, humility, or transition. They are not predictions. This page does not make doctrinal claims and does not treat the dream as a sign that anyone will die.",
        "crystal": ("malachite-meaning", "smoky-quartz-meaning", "rose-quartz-meaning"),
        "crystal_text": "Malachite is the primary transformation anchor; Smoky Quartz supports grounding through shadow material; Rose Quartz offers a gentle heart anchor for grief-aware journaling.",
        "variations": [
            "Dreaming of your own dying: an identity or role in transition.",
            "Dying peacefully: acceptance, closure, or a clean ending.",
            "Dying violently: disruptive change or fear of being overwhelmed.",
            "Watching someone die: grief, relationship change, or projection.",
            "Waking before death: fear of the threshold, not a prediction.",
        ],
        "links": [
            ("death dream meaning", "/death-dream-meaning/"),
            ("baby dream meaning", "/baby-dream-meaning/"),
            ("falling dream meaning", "/falling-dream-meaning/"),
        ],
        "death_sensitive": True,
    },
    {
        "keyword": "wedding dream meaning",
        "slug": "wedding-dream-meaning",
        "title": "Wedding Dream Meaning",
        "meta": "Wedding Dream Meaning: Commitment, Union, Anxiety, Family Roles & Crystal Reflection | Earthward",
        "description": "A grounded guide to wedding dreams: commitment, union, family pressure, missed weddings, spiritual symbolism, and Rose Quartz crystal journaling.",
        "symbol": "wedding",
        "core": "commitment, union, public promises, identity change, and the pressure around choosing a shared future",
        "quick": "A wedding dream usually points to commitment and union: a relationship, life choice, role, or inner integration asking for a public or personal yes. It does not automatically predict marriage.",
        "sleep_specific": "Dreams often dramatize commitment and social expectation through ceremony scenes. Weddings combine relationship memory, family roles, clothing, timing pressure, performance, and future identity in one strong image.",
        "psych": "Psychologically, a wedding dream asks what you are joining yourself to. A joyful wedding can reflect readiness for commitment. A chaotic wedding can reveal pressure, ambivalence, or fear of public judgment. Missing the wedding can show avoidance or uncertainty.",
        "jung": "In Jungian work, the wedding is the coniunctio: the union of opposites within the psyche. It can symbolize masculine and feminine, conscious and unconscious, independence and intimacy, or two life paths trying to become one.",
        "spiritual": "Spiritually, wedding dreams carry covenant, blessing, union, and preparation imagery across many traditions. Religious readings should be reflective rather than predictive or doctrinal.",
        "crystal": ("rose-quartz-meaning", "moonstone-meaning", "amethyst-meaning"),
        "crystal_text": "Rose Quartz is the primary anchor for heart-centered commitment; Moonstone supports cycle and transition reflection; Amethyst helps create clarity around vows, values, and discernment.",
        "variations": [
            "Your own wedding: commitment, identity change, or pressure around a choice.",
            "Someone else's wedding: witnessing union or comparing your path.",
            "Missing a wedding: avoidance, timing anxiety, or fear of not being ready.",
            "Wedding dress problems: visibility, self-image, or public judgment.",
            "Marrying a stranger: integration of an unknown quality or future self.",
        ],
        "links": [
            ("baby dream meaning", "/baby-dream-meaning/"),
            ("sex dream meaning", "/sex-dream-meaning/"),
            ("house dream meaning", "/house-dream-meaning/"),
        ],
    },
    {
        "keyword": "naked dream meaning",
        "slug": "naked-dream-meaning",
        "title": "Naked Dream Meaning",
        "meta": "Naked Dream Meaning: Vulnerability, Exposure, Shame, Authenticity & Crystal Reflection | Earthward",
        "description": "A careful, non-explicit guide to naked dreams: vulnerability, public exposure, authenticity, shame, spiritual symbolism, and Rose Quartz crystal journaling.",
        "symbol": "being naked",
        "core": "vulnerability, exposure, shame, authenticity, and the wish to be seen without armor",
        "quick": "A naked dream usually points to vulnerability or exposure. It can mean fear of being judged, a truth being revealed, or a desire to be more authentic. It is not inherently sexual.",
        "sleep_specific": "Naked-in-public dreams are common because they combine social evaluation, body awareness, and threat-of-exposure emotion. The dream often exaggerates embarrassment to make a social fear visible.",
        "psych": "Psychologically, naked dreams ask where you feel exposed. Are you unprepared, seen too clearly, afraid of judgment, or relieved to stop hiding? If no one in the dream reacts, the dream may be showing that your shame is louder inside you than it is outside you.",
        "jung": "In Jungian work, nakedness can symbolize the unmasked self: the person beneath persona, role, clothing, status, and performance. The dream may be uncomfortable because authenticity feels risky before it feels free.",
        "spiritual": "Spiritually, nakedness can carry innocence, truth, humility, or shame depending on the tradition and scene. Biblical imagery especially holds both innocence and exposure. This page offers reflection, not religious judgment.",
        "crystal": ("rose-quartz-meaning", "rhodonite-meaning", "amethyst-meaning"),
        "crystal_text": "Rose Quartz is the primary anchor for self-compassion when shame is activated; Rhodonite supports repair and accountability; Amethyst helps hold reflective distance from embarrassment.",
        "variations": [
            "Naked in public: fear of judgment or exposure.",
            "Naked at school or work: performance anxiety and unpreparedness.",
            "No one notices: shame may be internal more than external.",
            "Feeling free while naked: authenticity and release from persona.",
            "Trying to cover yourself: boundaries, modesty, or fear of being known.",
        ],
        "links": [
            ("sex dream meaning", "/sex-dream-meaning/"),
            ("wedding dream meaning", "/wedding-dream-meaning/"),
            ("house dream meaning", "/house-dream-meaning/"),
        ],
        "sensitive": True,
    },
]


def crystal_name(slug: str) -> str:
    return slug.replace("-meaning", "").replace("-", " ").title()


def make_body(t: dict) -> str:
    crystals = [crystal_name(s) for s in t["crystal"]]
    related = ", ".join(f"[{label}]({url})" for label, url in t["links"])
    variations = "\n".join(f"- **{v.split(':', 1)[0]}.**{':' + v.split(':', 1)[1] if ':' in v else ' ' + v}" for v in t["variations"])
    faq_subject = t["title"].replace(" Dream Meaning", "").lower()
    body = f"""# {t['title']}

Dreams about {t['symbol']} are strong because they turn a waking-life pressure into an image you can feel. In most modern dream work, {t['symbol']} points to **{t['core']}**. This does not mean every {t['symbol']} dream has one fixed meaning. The scene, emotion, people involved, and the way you wake up matter more than a dictionary definition.

This page reads the dream through sleep science, psychological reflection, spiritual symbolism, and a grounded crystal journaling practice. It is reflective content, not medical advice, mental-health assessment, faith doctrine, prediction, or promise.

## Key Takeaways

- **Psychologically**, {t['quick']}
- **From sleep science**, {t['sleep_specific']} Research has not confirmed one universal meaning for this dream image, so the science section stays modest and mechanism-focused.
- **Spiritually**, {t['spiritual']}
- **For crystal reflection**, {t['crystal_text']} The stones are journaling anchors, not treatments or promises.

## {t['title']}: Quick Answer

{t['quick']}

The most useful first question is: **what was the emotional tone of the dream?** A calm version can point toward integration, readiness, or a message you can receive. A frightening version can point toward pressure, avoidance, shame, grief, or a change that feels too fast. A confusing version often means the dream is still trying to assemble material that has not become clear in waking life.

Read the dream in three layers. First, name the literal scene: what happened, who was there, what changed? Second, name the feeling: fear, relief, tenderness, urgency, desire, shame, wonder, or grief. Third, connect it to one waking-life area: relationship, work, family, body, faith, creativity, or identity. That three-step reading is safer than forcing a fixed meaning onto the symbol.

## From Sleep Science

Sleep research has not confirmed that {t['symbol']} dreams have one universal symbolic meaning. What it can responsibly say is that vivid dreams often arise during REM sleep, when emotional memory and image-making systems are highly active. Dreams can also follow the **continuity hypothesis**: the brain continues emotional threads from waking life by turning them into scenes, symbols, and story fragments.

For {t['symbol']} dreams specifically, the science-aware reading is modest:

1. **The image may carry recent emotional material.** If {t['symbol']} has been part of your recent life, media, stress, relationship focus, or body awareness, the dream may simply be using available material.
2. **The feeling is evidence, not the symbol alone.** Fear, calm, embarrassment, excitement, grief, and relief each point in different directions.
3. **Recurring distress deserves care.** If this dream becomes a repeated nightmare, disrupts sleep, or connects with trauma, anxiety, depression, panic, or health worry, the useful next step may be support from a qualified professional.

Evidence boundary: sleep science can describe REM mechanisms, emotional memory, and waking-life continuity. It has **not** proven that "{t['symbol']} in a dream" always means one fixed thing. That boundary leaves room for personal, cultural, and spiritual reflection without pretending the science says more than it does.

## Psychological Reflection

{t['psych']}

### Jungian Perspective

{t['jung']}

### Broad Psychological Perspectives

In contemporary dream work, the question is practical: **where does this dream touch waking life?** Look for a current situation that shares the same emotional shape as the dream. The symbol may point to a relationship pattern, a work pressure, a family role, a body concern, a creative urge, or a threshold between old and new identity.

Avoid over-literalizing the image. A {t['symbol']} dream does not require you to act on the dream scene. It asks you to notice what the scene is carrying. If the dream feels uncomfortable, start with regulation and journaling before interpretation.

### Common Psychological Triggers

Common triggers include major transitions, relationship pressure, family stress, body awareness, conflict avoidance, grief, creative change, public evaluation, and simple recent exposure to the theme. The dream may also appear when a feeling has no easy waking-life language, so the mind chooses an image instead.

### How to Read Your Version Without Forcing It

Use four filters before deciding what this dream is asking from you. **First, track agency:** were you choosing, watching, hiding, running, waiting, protecting, or being carried by events? Agency tells you whether the dream is about action, surrender, avoidance, or acceptance. **Second, track setting:** the place around {t['symbol']} shows which life area is involved, such as family, work, faith, body, romance, creativity, or public identity. **Third, track repetition:** a one-time dream can be emotional residue, while a recurring dream usually points to an active pattern. **Fourth, track the ending:** whether the dream resolves, loops, interrupts, or wakes you suddenly can show whether the psyche has found a workable ending yet.

This method keeps the page from becoming a rigid dream dictionary. A {t['symbol']} dream can carry {t['core']}, but the exact meaning belongs to the shape of your dream and the actual pressures of your life. If the image is sensitive, frightening, or connected to shame, start with steadiness before interpretation. Drink water, write the scene in plain language, and wait until the body has settled before drawing conclusions.

## Spiritual Symbolism & Religious Meanings

{t['spiritual']}

### Islamic Dream Interpretation

Within classical Islamic dream interpretation, images are read with attention to the dreamer's condition, the scene, and the wider moral and spiritual context. A {t['symbol']} dream may be approached as a prompt for self-examination, humility, prayer, or practical correction. This is not a fatwa and not a claim that the dream has one binding meaning. Islamic tradition also distinguishes between true dreams, psychological dreams, and confused dreams; this page cannot decide which type yours is.

### Biblical Meaning

In Biblical and Christian reflection, {t['symbol']} can be read through themes of discernment, humility, covenant, exposure, change, or stewardship depending on the scene. The Bible does not give a simple verse that says this dream must mean one thing. Treat the dream as an invitation to prayerful reflection rather than as a prediction.

### Spiritual Significance

In broader spiritual language, this dream asks where energy is moving and what kind of attention the symbol wants. The best spiritual reading is not fear-based. It should leave you more honest, grounded, compassionate, and responsible, not more superstitious or alarmed.

## Crystals for {t['title'].replace(' Dream Meaning', '')} Dream Reflection

A crystal practice can give the dream a physical anchor for journaling. It is **not** a treatment, diagnosis, promise, or substitute for professional care.

### {crystals[0]} - primary anchor

{crystals[0]} is the primary reflection stone for this dream because it supports the central question of {t['symbol']}: {t['core']}. Hold it while writing the first clear sentence about the dream: "This dream may be showing me..."

### {crystals[1]} - grounding or balance

{crystals[1]} supports the second layer: grounding the feeling so the dream does not remain only a charge in the body. Use it to name the waking-life situation that most resembles the dream.

### {crystals[2]} - integration

{crystals[2]} is the integration stone for the final step. Use it while writing one small, non-dramatic next action: a conversation, rest, boundary, prayer, plan, apology, or creative step.

Together: {crystals[0]} for the core symbol, {crystals[1]} for steadiness, and {crystals[2]} for integration. The value is in the reflection practice, not in a promise that the stone will change the dream.

## Common Variations of {t['title'].replace(' Dream Meaning', '')} Dreams

{variations}

## Journal Prompts

1. **Scene prompt:** What exactly happened in the dream, and what detail felt most emotionally charged?
2. **Mirror prompt:** Where in waking life do I feel the same emotional shape as this dream?
3. **Integration prompt:** What is one small, grounded action I can take without treating the dream as a prediction?

## Gentle Boundaries for This Interpretation

Do not use a {t['symbol']} dream to accuse yourself, diagnose yourself, or make a rushed life decision. A good interpretation should make you more grounded and more honest, not more frightened. If the dream involves another person, it is usually better to ask what that person represents in your inner life before assuming the dream is giving instructions about them. If the dream carries faith language, keep humility at the center: pray, reflect, or seek trusted counsel, but do not turn one dream into a rule for your life. If the dream touches your body, sleep, grief, or safety, practical care comes first and symbolism comes second.

## Frequently Asked Questions

### What does it mean when you dream about {faq_subject}?

It usually points to {t['core']}. The specific meaning depends on the scene, your emotion, and what is happening in your waking life. Start with the feeling-tone before choosing an interpretation.

### Is a {t['symbol']} dream a prediction?

No. This page treats dream interpretation as reflection, not prediction. A dream can highlight fear, desire, grief, or change, but it should not be used as a certain forecast.

### Why do I keep having this dream?

Recurring dreams often mean the underlying waking-life pattern is still active. They can also repeat because the brain is practicing a threat, processing a transition, or returning to a feeling that has not yet been named.

### What does this dream mean spiritually?

Spiritually, it may be asking for honesty, humility, attention, prayer, grounding, or a better relationship to the part of life symbolized by {t['symbol']}. Specific religious readings should be held gently and brought to a trusted teacher if they feel important.

### Which crystals are best for this dream?

For journaling and reflection, this page uses {crystals[0]}, {crystals[1]}, and {crystals[2]}. They are symbolic anchors, not medicines, promises, or substitutes for professional support.

### When should I get support instead of interpreting the dream alone?

If the dream is recurring, frightening, linked to trauma, disrupting sleep, or connected to thoughts of self-harm or harm to someone else, interpretation is not enough. Please reach out to a qualified professional or local crisis support. In the US, call or text 988 if you are in crisis.

## Related Dream Pages

For related readings, see {related}. Lens pages for Islamic, Biblical, and spiritual meanings should link back here once published so the subject page remains the main hub.
"""
    return body


def make_row(t: dict) -> dict:
    body = make_body(t)
    words = len(body.split())
    crystals = list(t["crystal"])
    crystal_names = [crystal_name(s) for s in crystals]
    religious = True
    sensitive = bool(t.get("sensitive") or t.get("death_sensitive"))
    return {
        "source_row": {
            "original_keyword": t["keyword"],
            "priority": "P0",
            "page_type": "Subject",
        },
        "original_keyword": t["keyword"],
        "repaired_keyword": t["keyword"],
        "original_slug": t["slug"],
        "slug": t["slug"],
        "url": f"/{t['slug']}/",
        "priority": "P0",
        "page_type": "Subject",
        "repair_status": "backbone_subject_v2",
        "original_noise_flag": [],
        "publication_ready": True,
        "requires_human_review": False,
        "title": t["title"],
        "meta_title": t["meta"],
        "meta_description": t["description"],
        "evidence": {
            "intent_summary": f"User searching '{t['keyword']}' wants a main Subject page, not only a religious lens: quick meaning, psychology, spiritual reflection, common variations, crystals, and FAQ.",
            "evidence_boundary": COMMON_SLEEP["evidence_boundary"],
            "sleep_science": f"{COMMON_SLEEP['sleep_mechanism']} For this subject: {t['sleep_specific']} source_status: needs_verification.",
            "key_takeaways": f"4 takeaways: psychology ({t['core']}), sleep science humility, spiritual reflection without rulings, crystal reflection with {crystal_names[0]} primary.",
            "psychology_angle": t["psych"],
            "spiritual_angle": t["spiritual"],
            "crystal_angle": t["crystal_text"],
        },
        "brief": {
            "h1": t["title"],
            "key_takeaways": [
                f"Psychologically, {t['quick']}",
                f"From sleep science, {t['sleep_specific']} Research has not confirmed one fixed meaning. source_status: needs_verification.",
                f"Spiritually, {t['spiritual']}",
                f"For crystal reflection, use {crystal_names[0]}, {crystal_names[1]}, and {crystal_names[2]} as journaling anchors, not treatments.",
            ],
            "sleep_science": f"{COMMON_SLEEP['sleep_mechanism']} {COMMON_SLEEP['evidence_boundary']} public_data_point: empty; source_status: needs_verification.",
            "psychological_reflection": t["psych"],
            "spiritual_symbolism": t["spiritual"],
            "crystals_for_dream_reflection": t["crystal_text"],
            "journal_prompts": [
                "What exact scene and emotion from the dream stayed with me after waking?",
                "Where in waking life do I feel the same pattern or pressure?",
                "What is one grounded action I can take without treating the dream as a prediction?",
            ],
            "h2_outline": [
                "Key Takeaways",
                f"{t['title']}: Quick Answer",
                "From Sleep Science",
                "Psychological Reflection",
                "Spiritual Symbolism & Religious Meanings",
                f"Crystals for {t['title'].replace(' Dream Meaning', '')} Dream Reflection",
                f"Common Variations of {t['title'].replace(' Dream Meaning', '')} Dreams",
                "Journal Prompts",
                "Frequently Asked Questions",
                "Related Dream Pages",
            ],
            "template_family": "dream_subject_v2",
            "crystal_profile_slugs": crystals,
        },
        "article": {
            "body_markdown": body,
            "faq_count": body.count("### "),
            "word_count": words,
        },
        "image": {
            "filename": f"{t['slug']}-hero.webp",
            "hero_prompt": f"Dreamy symbolic hero illustration for {t['title']}: {t['symbol']} as a gentle surreal symbol, reflective and calm, with {crystal_names[0]} as a subtle anchor, no text, no words, no horror, 1536x864",
            "negative_prompt": "no gore, no graphic injury, no explicit nudity, no sexual content, no sacred text, no calligraphy, no realistic distress, no text, no words, no watermark",
            "alt_text": f"Symbolic dream illustration for {t['title']} with {crystal_names[0]} as a reflective crystal anchor.",
            "actual_image_generated": False,
        },
        "crystal_reuse_slots": [
            {
                "slug": s,
                "profile_path": f"/gemstone/{s}/",
                "image_request": "reuse_existing_390_library",
            }
            for s in crystals
        ],
        "compliance": {
            "not_medical_advice": True,
            "not_mental_health_assessment": True,
            "not_a_religious_ruling": True,
            "no_prediction_guarantee": True,
            "religious_sensitivity": religious,
            "sensitive_topic": sensitive,
            "root_level_url": True,
            "note": "Dream interpretation is framed as reflection. Sleep science is humble and source_status remains needs_verification. Crystal practice is journaling only.",
        },
        "sleep_science": {
            **COMMON_SLEEP,
            "public_data_point": "",
            "humility_line": f"Researchers have not confirmed that {t['symbol']} dreams have one universal meaning; read the image alongside emotion, waking context, and recurrence.",
        },
        "key_takeaways": [
            {"type": "core_meaning", "text": t["quick"]},
            {"type": "sleep_science", "text": f"{t['sleep_specific']} source_status: needs_verification."},
            {"type": "spiritual", "text": t["spiritual"]},
            {"type": "crystal_reflection", "text": t["crystal_text"]},
        ],
        "source": "backbone_subject_v2",
        "bucket": "wp_draft_ready_backbone",
    }


def write_jsonl(path: Path, rows: list[dict]) -> None:
    path.write_text(
        "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows),
        encoding="utf-8",
    )


def update_readiness(rows: list[dict]) -> int:
    existing = []
    if READINESS_JSONL.exists():
        existing = [
            json.loads(line)
            for line in READINESS_JSONL.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
    slugs = {row["slug"] for row in rows}
    kept = [row for row in existing if row.get("slug") not in slugs]
    write_jsonl(READINESS_JSONL, kept + rows)
    return len(kept + rows)


def main() -> None:
    rows = [make_row(t) for t in TOPICS]
    write_jsonl(OUT_JSONL, rows)
    readiness_count = update_readiness(rows)
    print(json.dumps({
        "output": str(OUT_JSONL),
        "rows": len(rows),
        "readiness_rows": readiness_count,
        "slugs": [row["slug"] for row in rows],
    }, indent=2))


if __name__ == "__main__":
    main()
