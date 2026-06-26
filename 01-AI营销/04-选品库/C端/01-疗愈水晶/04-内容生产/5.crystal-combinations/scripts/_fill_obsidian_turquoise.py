# -*- coding: utf-8 -*-
import json, re, os

PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/obsidian-and-turquoise.json'

with open(PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

c = data['content']

# ---- M2 About Obsidian ----
m2 = (
'<h2>About Obsidian</h2>\n'
'<p>Obsidian is a deep black volcanic glass, traditionally associated with protection, truth, and grounding. '
'In crystal practice it is often linked with the Root and Third Eye chakras, which is why many people turn to it for '
'shadow work, energetic boundaries, and honest self-reflection. Common forms include palm stones, mirrors, spheres, and pendants '
'— pieces meant to be held or placed rather than worn hard every day.</p>\n'
'<p>Mineralogically, Obsidian is a natural non-crystalline volcanic glass (amorphous, no crystal structure) with a Mohs hardness of 5–5.5. '
'That softness means it is better suited to palm stones, plates, and towers than to rings or bracelets that take daily knocks. '
'It tolerates only a brief rinse with water, is sun-safe, and should be kept away from salt water.</p>\n'
'<p><a href="/gemstone/obsidian-meaning/">Obsidian Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>'
)

# ---- M3 About Turquoise ----
m3 = (
'<h2>About Turquoise</h2>\n'
'<p>Turquoise is a blue-to-green gemstone, traditionally associated with protection, communication, and friendship. '
'In crystal practice it is often linked with the Throat and Third Eye chakras, which makes it a natural fit for honest expression, '
'self-trust, and protective amulets — it is also a well-loved December birthstone. Common forms include cabochons, beads, pendants, and inlay work.</p>\n'
'<p>Mineralogically, Turquoise is a copper-aluminium phosphate (CuAl₆(PO₄)₄(OH)₈·4H₂O) with a Mohs hardness of 5–6. '
'Because it is porous and fairly soft, it is best kept dry and out of prolonged sun, and should never sit in salt water. '
'Pendants and beads worn occasionally hold up better than rings worn daily, and many people prefer it as a palm stone or placed piece.</p>\n'
'<p><a href="/gemstone/turquoise-meaning/">Turquoise Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>'
)

# ---- M4 Can Wear Together ----
m4 = (
'<h2>Can You Wear Obsidian and Turquoise Together?</h2>\n'
'<p><strong>Practically:</strong> Obsidian and Turquoise can sit together in a stack or on an altar, but both are on the softer side '
'— Obsidian at 5–5.5 and Turquoise at 5–6 on the Mohs scale — so neither is an ideal ring-or-bracelet stone for heavy daily wear. '
'That makes them better suited to pendants, palm stones, plates, and bedside pieces. Turquoise in particular is porous, so it should stay dry '
'and out of prolonged sun and salt water; keep the two pieces away from water and salt and cleanse gently instead. '
'Visually, the deep black of Obsidian against the blue-green of Turquoise is one of the more striking color contrasts in crystal jewelry — '
'a grounding dark stone paired with a luminous, protective blue.</p>\n'
'<p><strong>Energetically:</strong> In crystal tradition, both stones share the earth element and meet at the Third Eye chakra, '
'with Obsidian also anchoring the Root and Turquoise opening the Throat. That gives the pairing a layered quality — '
'Obsidian is said to ground and shield, while Turquoise is believed to guard and clarify expression. Many practitioners describe the combination as '
'a steady protective base with a clearer channel for honest communication.</p>\n'
'<p><strong>Psychologically:</strong> Because the two share a protection intention, they work well as a single ritual anchor — '
'one goal (safe boundaries and clear truth) carried by two reinforcing stones rather than two competing ones.</p>\n'
'<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not scientifically proven.</em></p>'
)

# ---- M5 Benefits ----
m5 = (
'<h2>Benefits of Obsidian + Turquoise</h2>\n'
'<p>Together, Obsidian and Turquoise cover six complementary strengths:</p>\n'
'<h3>1. Layered Protection</h3>\n'
'<p>Both stones are traditionally associated with protection, which is why many people pair them for everyday energetic boundaries. '
'Obsidian is said to act as a strong, absorbing shield, while Turquoise is believed to guard the wearer in a gentler, steadier way. '
'Used together, the protection often feels layered — a firmer outer boundary from Obsidian, with Turquoise keeping the field calm inside it. '
'It is a popular setup for people who work with the public, travel often, or simply want a stronger sense of being held.</p>\n'
'<h3>2. Grounded Honesty</h3>\n'
'<p>The pairing brings together Obsidian’s root-level grounding and Turquoise’s throat-chakra clarity, which crystal tradition links to truthful, grounded expression. '
'Many people find the combination helpful when they need to say something honest without losing their footing — the dark stone keeps them steady while the blue one opens the channel. '
'It is a common choice for difficult conversations, boundary-setting, or journaling about things that feel heavy to admit.</p>\n'
'<h3>3. Shared Third-Eye Insight</h3>\n'
'<p>Both Obsidian and Turquoise are linked to the Third Eye chakra, the center most associated with perception, intuition, and honest self-seeing. '
'Combined, they are traditionally used for shadow work and clear inner vision — Obsidian is said to surface what is usually avoided, while Turquoise is believed to soften the process so it feels manageable. '
'For people doing reflective practice, this is one of the steadier pairings for honest, supported insight.</p>\n'
'<h3>4. Steady Earth-Element Stability</h3>\n'
'<p>Obsidian and Turquoise are both earth-element stones, and in crystal tradition that shared element is associated with stability, patience, and grounded presence. '
'Worn or placed together, the two tend to read as settling rather than stimulating — a useful quality for people who feel scattered and want to come back down into the body. '
'Many keep this pairing on a desk or nightstand precisely for its calm, reliable feel.</p>\n'
'<h3>5. Grounded Truth-Seeking Ritual</h3>\n'
'<p>The pairing of a truth stone (Obsidian) with a communication stone (Turquoise) makes a natural anchor for any honesty-focused ritual. '
'Many people hold Obsidian in one hand to stay grounded and place Turquoise nearby to keep expression clear, then write, meditate, or simply sit for a few minutes. '
'It is a simple, repeatable practice that turns the two stones into a single intention rather than two separate tools.</p>\n'
'<h3>6. A Striking, Symbolic Daily Pair</h3>\n'
'<p>Beyond the metaphysical side, the deep black of Obsidian next to the blue-green of Turquoise is visually memorable — a contrast many cultures have paired for centuries as a protective combination. '
'Whether worn as a pendant and bead, or placed as a palm stone and cabochon on a nightstand, the look reinforces the intention: a grounding dark stone held beside a luminous, protective one. '
'For people who like their ritual objects to feel both meaningful and beautiful, this is a pairing that tends to earn its place.</p>'
)

# ---- M6 How to Use ----
m6 = (
'<h2>How to Use Obsidian and Turquoise Together</h2>\n'
'<h3>Wear them</h3>\n'
'<p>A common question is <em>can I wear Obsidian and Turquoise on the same hand?</em> Yes — the shared earth element means the two are traditionally considered comfortable together. '
'Because both are softer stones (Obsidian 5–5.5, Turquoise 5–6), a pendant or a loose bead bracelet worn occasionally holds up better than rings worn daily. '
'For sleep, many prefer to set them on the nightstand rather than wear them, since Turquoise should stay dry and away from prolonged sun.</p>\n'
'<h3>Meditate</h3>\n'
'<p>Hold Obsidian in one hand to stay grounded and place Turquoise nearby — on the floor, mat, or altar — rather than directly on the throat. '
'Five to ten minutes is enough for a simple session, especially if you are new to working with these two stones. The aim is a steadier, more honest sit, not a particular physical sensation.</p>\n'
'<h3>Crystal grid</h3>\n'
'<p>Place Turquoise at the center as the protective, clarifying stone and Obsidian pieces around it to set a grounding boundary. '
'It is a classic, simple grid for protection, truth, or steady communication — easy to set up on a nightstand, desk, or small table.</p>\n'
'<h3>Place in a room</h3>\n'
'<p>An Obsidian sphere or palm stone by the entry keeps a space feeling shielded, while a Turquoise cabochon or bead beside it brings a calmer, clearer note. '
'Together they turn an entryway, bedroom, or workspace into a grounded, protected area — many people start here when they want a steadier home environment.</p>'
)

# Replace each placeholder in order using regex
def replace_one(content, marker_re, replacement):
    new, n = re.subn(marker_re, lambda m: replacement, content, count=1)
    assert n == 1, f"FAILED to replace {marker_re}: matched {n}"
    return new

c = replace_one(c, r'<!-- AGENT_M2:[\s\S]*?-->', m2)
c = replace_one(c, r'<!-- AGENT_M3:[\s\S]*?-->', m3)
c = replace_one(c, r'<!-- AGENT_M4:[\s\S]*?-->', m4)
c = replace_one(c, r'<!-- AGENT_M5:[\s\S]*?-->', m5)
c = replace_one(c, r'<!-- AGENT_M6:[\s\S]*?-->', m6)

data['content'] = c

# word counts for the agent-written prose (strip HTML tags for a fair count)
def wc(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())

m2_words = wc(m2)
m3_words = wc(m3)
# m4 word count excludes the boundary disclaimer line for the perspective count, but we count whole prose
m4_words = wc(re.sub(r'<em>.*?</em>', '', m4))

data['modules'] = {
    "m2_agent": {"filled": True, "words": m2_words},
    "m3_agent": {"filled": True, "words": m3_words},
    "m4_agent": {
        "filled": True,
        "words": m4_words,
        "perspectives": ["practical", "energetic", "psychological"]
    },
    "m5_agent": {
        "filled": True,
        "benefits": [
            {"title": "Layered Protection", "source": "sharedTags:protection"},
            {"title": "Grounded Honesty", "source": "sharedChakras:third-eye + element:earth"},
            {"title": "Shared Third-Eye Insight", "source": "sharedChakras:third-eye"},
            {"title": "Steady Earth-Element Stability", "source": "element:earth"},
            {"title": "Grounded Truth-Seeking Ritual", "source": "sharedTags:protection + sharedChakras:third-eye"},
            {"title": "A Striking, Symbolic Daily Pair", "source": "element:earth + pairHit:false(traditional-pair)"}
        ]
    },
    "m6_agent": {
        "filled": True,
        "uses": ["wear", "meditate", "grid", "place"],
        "longtail": ["same hand", "bracelet", "for sleep", "pendant"]
    }
}

with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("M2 words:", m2_words)
print("M3 words:", m3_words)
print("M4 words:", m4_words)

# Verify no placeholders remain and banned words absent
remaining = re.findall(r'<!-- AGENT_M\d:', data['content'])
print("Remaining placeholders:", len(remaining))

banned = ['anxiety', 'under the pillow', 'upper-chakra opening', 'Scientifically']
full = data['content'].lower()
for b in banned:
    if b.lower() in full:
        print("BANNED WORD PRESENT:", b)
print("DONE")
