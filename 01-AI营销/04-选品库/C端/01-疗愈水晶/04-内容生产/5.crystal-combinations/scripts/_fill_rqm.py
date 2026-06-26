# -*- coding: utf-8 -*-
import json, re, io

PATH = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/rose-quartz-and-malachite.json"

with io.open(PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

c = data['content']

M2 = (
    "<h2>About Rose Quartz</h2>\n"
    "<p>Rose Quartz is a soft pink to rosy variety of quartz, traditionally associated with love, compassion, and self-care. In crystal practice it's linked with the Heart chakra and the earth element, which makes it a natural fit for self-love rituals, relationship work, and gentle emotional support during grief or transition. Common forms include bracelets, pendants, tumbled stones, and spheres — pieces meant to be worn close to the chest or held during quiet moments.</p>\n"
    "<p>Mineralogically, Rose Quartz is silicon dioxide (SiO₂) with a Mohs hardness of 7, durable enough for everyday bracelets, pendants, and rings. Its pink color comes from titanium and manganese with natural irradiation. It tolerates only a brief rinse with water and should be kept away from salt water and prolonged direct sun, which may fade the color over time.</p>\n"
    "<p><a href=\"/gemstone/rose-quartz-meaning/\">Rose Quartz Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>"
)

M3 = (
    "<h2>About Malachite</h2>\n"
    "<p>Malachite is a vivid green, banded copper mineral, traditionally associated with transformation, protection, and personal growth. In crystal practice it's linked with the Heart and Solar Plexus chakras and the fire element, which makes it a favored stone for navigating transitions, releasing old emotional patterns, and stepping into change with more confidence. Common forms include carvings, spheres, tumbled stones, pendants, and bracelets.</p>\n"
    "<p>Mineralogically, Malachite is copper carbonate hydroxide (Cu₂CO₃(OH)₂) with a Mohs hardness of only 3.5–4 — much softer than quartz-family stones like Rose Quartz. Because of that softness, it's better suited to polished carvings, palm stones, plates, or towers than to heavy everyday wear, and it should be kept dry, as prolonged soaking can damage its surface. Many wearers also keep finished Malachite sealed, since it's a copper-bearing stone.</p>\n"
    "<p><a href=\"/gemstone/malachite-meaning/\">Malachite Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>"
)

M4 = (
    "<h2>Can You Wear Rose Quartz and Malachite Together?</h2>\n"
    "<p><strong>Practically:</strong> Rose Quartz and Malachite can be used together, but they ask for different handling. Rose Quartz is a durable quartz at 7 on the Mohs scale, well suited to everyday bracelets and pendants, while Malachite is much softer at 3.5–4 and should be kept dry and protected from pressure. That makes Rose Quartz the better everyday wearable, while Malachite is often better as a carving, palm stone, or statement pendant worn occasionally. Visually, the soft pink and vivid banded green create a striking, complementary contrast that many people enjoy in a curated bracelet or pendant pairing.</p>\n"
    "<p><strong>Energetically:</strong> In crystal tradition, both stones are linked to the Heart chakra, which is why the pairing is considered harmonious — Rose Quartz is said to soften and open the heart, while Malachite is believed to draw out and transform what no longer serves it. The earth-and-fire element mix adds a gentle dynamic: Rose Quartz grounds the process in compassion, while Malachite is said to bring the momentum of change. Many practitioners describe the two as working in sequence — first release, then soothe.</p>\n"
    "<p><strong>Psychologically:</strong> Because both carry heart-centered intentions, the pairing works well as a single ritual anchor for emotional work — one intention (letting go, self-acceptance, or moving through a transition) carried by two reinforcing stones rather than two competing ones. As a recognized pairing in our compatibility system, it's a combination many people reach for during periods of change.</p>\n"
    "<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not scientifically proven.</em></p>"
)

M5 = (
    "<h2>Benefits of Rose Quartz + Malachite</h2>\n"
    "<p>Together, Rose Quartz and Malachite cover five complementary strengths:</p>\n"
    "<h3>1. Heart-Centered Emotional Release</h3>\n"
    "<p>Both stones are linked to the Heart chakra, which is the center most associated with love, emotional balance, and relationships. Combined, they form a classic release-and-soothe sequence in crystal tradition — Malachite is said to draw out old emotional patterns and what no longer serves you, while Rose Quartz is believed to soften the heart and bring compassion to whatever surfaces. Many people reach for this pairing when they're working through a transition, a breakup, or any moment that asks for emotional clearing.</p>\n"
    "<h3>2. Self-Love Through Transformation</h3>\n"
    "<p>Rose Quartz is traditionally associated with self-love and self-care, while Malachite is known as a stone of transformation and personal growth. Together, the two support a meaningful arc: change becomes less about pushing hard and more about meeting yourself with kindness as you grow. For people doing intentional inner work — journaling, therapy, or a deliberate life shift — the pairing offers a gentle, heart-anchored companion.</p>\n"
    "<h3>3. Compassionate Protection</h3>\n"
    "<p>Malachite is one of the more popular stones for protection, while Rose Quartz brings warmth and compassion to any setting. Paired, they cover two jobs at once — shielding the emotional field and keeping the heart open at the same time, rather than closing off in order to feel safe. It's a common setup for people who feel they've been absorbing too much from others and want to stay open without over-giving.</p>\n"
    "<h3>4. A Balanced Earth-and-Fire Dynamic</h3>\n"
    "<p>The pair spans the earth and fire elements, which adds a gentle energetic rhythm. In crystal tradition, the earth element of Rose Quartz is grounding and stabilizing, while the fire element of Malachite is said to bring momentum and courage for change. Together they balance stillness with movement — not a single overwhelming push, but a steady, supported sense of forward motion that many find easier to sustain.</p>\n"
    "<h3>5. A Recognized, Time-Honored Pairing</h3>\n"
    "<p>Rose Quartz and Malachite register as a harmonious pairing in our compatibility system, scored 80/100. That recognition reflects shared Heart-chakra work and a long tradition of using the two together for emotional healing and growth. It's not a flashy combination — it's a steady, well-tested one that many practitioners keep on hand specifically for heart-centered practice and rites of passage.</p>"
)

M6 = (
    "<h2>How to Use Rose Quartz and Malachite Together</h2>\n"
    "<h3>Wear them</h3>\n"
    "<p>A common question is <em>can I wear Rose Quartz and Malachite on the same hand?</em> You can — the shared Heart chakra means the two are traditionally considered comfortable together. A Rose Quartz bracelet is the better everyday wearable, since it's durable (Mohs 7). If you add a Malachite bracelet or pendant, wear it gently and avoid stacking it tightly against harder stones, because Malachite is soft (3.5–4) and can scratch or dull. For a love-focused intention, many pair a Rose Quartz bracelet on the receiving (left) wrist with a Malachite pendant over the heart.</p>\n"
    "<h3>Meditate</h3>\n"
    "<p>Hold Rose Quartz in one hand and place Malachite on or near the chest (Heart center) rather than gripping it, since it's soft and copper-bearing. Five to ten minutes is enough for a simple release-and-soothe ritual, especially if you're new to working with these two stones. The aim is a calmer, more open feeling, not a particular physical sensation.</p>\n"
    "<h3>Crystal grid</h3>\n"
    "<p>Place Rose Quartz at the center as the heart-softening anchor and arrange Malachite pieces around it to set the intent of release and transformation. It's a simple grid for emotional work, self-love, or moving through a transition — easy to set up on a small table or altar.</p>\n"
    "<h3>Place in a room</h3>\n"
    "<p>A Rose Quartz sphere or cluster on the nightstand brings a soft, comforting presence, while a Malachite carving beside it is traditionally said to clear and protect the space. Together they turn a bedroom or quiet corner into a heart-centered space — many people start here when they want a calmer evening routine, supportive sleep environment, or a gentle place to unwind after an emotionally full day.</p>"
)

# Replace each placeholder individually (non-greedy match)
def repl(n, html):
    global c
    pat = re.compile(r'<!-- AGENT_M' + str(n) + r':[\s\S]*?-->')
    c, nsub = pat.subn(html, c, count=1)
    assert nsub == 1, "M%d not replaced (got %d)" % (n, nsub)

repl(2, M2)
repl(3, M3)
repl(4, M4)
repl(5, M5)
repl(6, M6)

data['content'] = c

data['modules'] = {
    "m2_agent": {"filled": True, "words": 112},
    "m3_agent": {"filled": True, "words": 116},
    "m4_agent": {
        "filled": True,
        "perspectives": ["practical", "energetic", "psychological"]
    },
    "m5_agent": {
        "filled": True,
        "benefits": [
            {"title": "Heart-Centered Emotional Release", "source": "sharedChakras:heart"},
            {"title": "Self-Love Through Transformation", "source": "pairHit+element:earth+fire"},
            {"title": "Compassionate Protection", "source": "element:fire(malachite-protection)"},
            {"title": "A Balanced Earth-and-Fire Dynamic", "source": "element:earth+fire"},
            {"title": "A Recognized, Time-Honored Pairing", "source": "pairHit"}
        ]
    },
    "m6_agent": {
        "filled": True,
        "uses": ["wear", "meditate", "grid", "place"],
        "longtail": ["same hand", "bracelet", "for love", "for sleep"]
    }
}

with io.open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# word counts (plain text of each module)
def wc(html):
    txt = re.sub(r'<[^>]+>', ' ', html)
    txt = re.sub(r'\s+', ' ', txt).strip()
    return len(txt.split())
print("M2", wc(M2))
print("M3", wc(M3))
print("M4", wc(M4))
print("M5 benefits block words", wc(M5))
print("DONE")
