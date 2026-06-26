# -*- coding: utf-8 -*-
import json

PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/selenite-and-angelite.json'

# Read the ORIGINAL stones/shared/title/slug etc. are still valid in the file;
# we only need to reconstruct `content` and `modules` cleanly.
# Strategy: load everything EXCEPT the broken content field.
# Simplest: rebuild full structure by reading the known-good fields from the
# broken file via a tolerant parse is hard. Instead we hardcode from the
# authoritative data we already read at task start.

d = {
  "title": "Selenite and Angelite Together: Benefits, Meaning + How to Use",
  "slug": "selenite-and-angelite",
  "url": "/selenite-and-angelite/",
  "tier": "T1_pairing",
  "score": 100,
  "band": "Excellent",
  "stoneNames": ["Selenite", "Angelite"],
  "excerpt": "Selenite and Angelite together score 100/100 for compatibility. Learn how to wear them and their traditional use for calm, spiritual — benefits, meaning, and care.",
  "rank_math_title": "Selenite and Angelite Together: Benefits + How to Use",
  "rank_math_description": "Selenite and Angelite score 100/100 compatibility — benefits, how to wear, and care for the pair.",
  "rank_math_focus_keyword": "selenite and angelite",
  "shared": {
    "tags": ["calm", "spiritual"],
    "chakras": ["third-eye"],
    "elements": ["air", "air"],
    "pairHit": True,
    "conflict": False,
    "bestFor": ["Sleep & relaxation", "Meditation & spiritual growth"],
    "score": 100,
    "band": "Excellent"
  },
  "stones": {
    "a": {
      "slug": "selenite",
      "name": "Selenite",
      "element": "air",
      "chakras": ["crown", "third-eye"],
      "tags": ["calm", "protection", "spiritual", "personal-power"],
      "zodiac": ["taurus", "cancer"],
      "shop": "/product-category/selenite-crystals/",
      "img": "https://goearthward.com/wp-content/uploads/2026/06/selenite-overview.webp",
      "meaning": "/gemstone/selenite-meaning/",
      "overview": {
        "Chakra": "Crown, Third Eye",
        "Zodiac": "Taurus, Cancer",
        "Element": "Air",
        "Color": "White, pale, luminous",
        "Intentions": "Clarity, Cleansing, Calm",
        "Best for": "Cleansing, Space clearing, Focus",
        "Forms": "Tower/wand, Slab/plate, Tumbled, Palm stone"
      },
      "mineral": {
        "Formula": "CaSO₄·2H₂O (calcium sulfate dihydrate)",
        "Crystal system": "Monoclinic",
        "Hardness": "2 (Mohs)",
        "Luster": "Vitreous to silky (pearly)",
        "Transparency": "Transparent to translucent",
        "Specific gravity": "~2.3",
        "Color cause": "Natural gypsum; silky sheen from fibrous structure",
        "Origins": "Mexico, Morocco, Poland, USA"
      },
      "safety": {
        "water": "Water: Avoid water (soluble)",
        "sun": "Sun: Sun-safe",
        "salt": "Salt: Avoid salt"
      }
    },
    "b": {
      "slug": "angelite",
      "name": "Angelite",
      "element": "air",
      "chakras": ["throat", "third-eye"],
      "tags": ["calm", "spiritual"],
      "zodiac": ["aquarius", "pisces"],
      "shop": "/product-category/angelite-crystals/",
      "img": "https://goearthward.com/wp-content/uploads/2026/06/angelite-form-bracelet.webp",
      "meaning": "/gemstone/angelite-meaning/",
      "overview": {
        "Chakra": "Throat, Third Eye",
        "Zodiac": "Aquarius, Pisces",
        "Element": "Air",
        "Color": "Soft blue",
        "Intentions": "Calm, Communication, Gentleness",
        "Best for": "Gentle expression, Meditation, Calm",
        "Forms": "Tumbled, Palm stone, Carved figure, Sphere, Pendant"
      },
      "mineral": {
        "Formula": "CaSO₄ (anhydrite / calcium sulfate)",
        "Crystal system": "Orthorhombic",
        "Hardness": "3–3.5 (Mohs)",
        "Luster": "Vitreous to pearly",
        "Transparency": "Translucent to opaque",
        "Specific gravity": "~2.9",
        "Color cause": "Soft blue from trace minerals in anhydrite",
        "Origins": "Peru, Mexico, Poland, Germany"
      },
      "safety": {
        "water": "Water: Avoid water (turns to gypsum)",
        "sun": "Sun: Avoid prolonged sun",
        "salt": "Salt: Avoid salt water"
      }
    }
  },
  "content": "",  # filled below
  "modules": {},
  "images": {
    "featured": None,
    "pair": None,
    "how_to_use": None
  }
}

# --- Agent-written modules (joined into ONE string; json.dump escapes newlines) ---
parts = []

parts.append("<h1>Selenite and Angelite Together: Benefits, Meaning + How to Use</h1>")
parts.append("<h2>Quick Answer</h2>")
parts.append("<p>Yes — Selenite and Angelite can be worn together (compatibility score: 100/100 — Excellent). They're a time-honored pairing in crystal practice, and many people pair them for sleep & relaxation.</p>")

# M2 About Selenite
parts.append("<h2>About Selenite</h2>")
parts.append("<p>Selenite is a luminous white to pale form of gypsum, traditionally associated with clarity, cleansing, and calm spiritual focus. In crystal practice it's often linked with the Crown and Third Eye chakras, which makes it a natural match for space clearing, meditation rooms, and bedside altars. Its airy, ethereal look has made it one of the most popular stones for creating a sense of stillness in a room rather than wearing on the body. Common forms include towers and wands, slabs and plates, plus tumbled and palm stones.</p>")
parts.append("<p>Mineralogically, Selenite is calcium sulfate dihydrate (CaSO₄·2H₂O) with a Mohs hardness of 2, making it far softer than quartz-family stones and better suited to a wand, plate, tower, or palm stone than to everyday jewelry. It must be kept dry (it's water-soluble), kept away from salt, and stored apart from harder crystals that may scratch its fibrous, silky surface.</p>")
parts.append("<p><a href=\"/gemstone/selenite-meaning/\">Selenite Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>")

# M3 About Angelite
parts.append("<h2>About Angelite</h2>")
parts.append("<p>Angelite is a soft blue form of anhydrite, traditionally associated with calm, gentle communication, and a quiet, supportive presence. In crystal practice it's often linked with the Throat and Third Eye chakras, which makes it a natural fit for meditation, gentle self-expression, and any moment when you want to feel more settled and softly present. Its muted, sky-blue tone reads as soothing in a room, and common forms include tumbled stones, palm stones, carved figures, spheres, and pendants.</p>")
parts.append("<p>Mineralogically, Angelite is calcium sulfate anhydrite (CaSO₄) with a Mohs hardness of 3–3.5, meaning it's a soft, delicate stone better suited to palm stones, spheres, and pendants worn gently than to rings or heavy daily-wear bracelets. Because contact with water can turn it into gypsum and change its surface, keep it dry, avoid salt water, and protect it from prolonged direct sun, which can fade that soft blue color over time.</p>")
parts.append("<p><a href=\"/gemstone/angelite-meaning/\">Angelite Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>")

# M4 Can Wear Together
parts.append("<h2>Can You Wear Selenite and Angelite Together?</h2>")
parts.append("<p><strong>Practically:</strong> Selenite and Angelite can be used together, but both are soft, water-sensitive stones that need gentle handling. Selenite sits at 2 on the Mohs scale and Angelite at 3–3.5, so neither is ideal for a daily-wear bracelet that knocks against harder stones. Many people keep them as a pair of palm stones, a pendant plus a bedside tower, or a wand-and-sphere set rather than stacking them in heavy jewelry. Their luminous white and soft blue tones also read as calm and cohesive on an altar or nightstand. Crucially, both dissolve or change in water — keep the pair dry.</p>")
parts.append("<p><strong>Energetically:</strong> In crystal tradition, both stones carry the air element and meet at the Third Eye chakra, so together they're seen as a gentle \"high-attunement\" pair. Selenite is believed to clear and cleanse the surrounding energy field, while Angelite is traditionally associated with calm, gentle expression and a softer, supportive presence — a light, lifting combination rather than a grounding or stimulating one.</p>")
parts.append("<p><strong>Psychologically:</strong> Because the two share calm and spiritual intentions, the pairing works well as a single ritual anchor — one quiet, evening-focused intention carried by two reinforcing stones rather than two competing ones. Many people reach for it during wind-down, meditation, or a quiet reading corner.</p>")
parts.append("<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not established by modern research.</em></p>")

# M5 Benefits
parts.append("<h2>Benefits of Selenite + Angelite</h2>")
parts.append("<p>Together, Selenite and Angelite cover five complementary strengths:</p>")
parts.append("<h3>1. Layered, Gentle Calm</h3>")
parts.append("<p>Both stones are traditionally associated with calm, so the pairing tends to arrive in two soft layers rather than one heavy wave. Angelite is often described as bringing a quiet, supportive presence, while Selenite is valued for the sense of space and clarity it opens up around it. Many people reach for this combination during an evening wind-down, when they want to step out of a busy day into something lighter and quieter.</p>")
parts.append("<h3>2. Clearer, More Open Spiritual Focus</h3>")
parts.append("<p>The pair meet at the Third Eye chakra — the center most associated with insight, contemplation, and intuitive work. Combined, they're traditionally used to deepen meditation and reflective practice, with Selenite believed to keep the mental channel clear and Angelite said to soften the experience so it stays gentle rather than intense. It's a popular combination for people who sit in meditation regularly.</p>")
parts.append("<h3>3. A Light, Airy Energy Field</h3>")
parts.append("<p>Both Selenite and Angelite carry the air element, which in crystal tradition is associated with lightness, openness, and a sense of lift. Used together, the two reinforce that airy quality — a room or corner that feels less heavy and stagnant. This makes them a common choice for bedrooms, meditation spaces, and reading nooks where a cleared, lifted atmosphere is welcome.</p>")
parts.append("<h3>4. Easier, Gentler Self-Expression</h3>")
parts.append("<p>Angelite is traditionally linked with the Throat chakra and gentle communication, while Selenite is believed to clear and refresh the surrounding space. The combination is often used when someone wants to speak, write, or journal with a softer, less pressured voice — supported rather than pushed. Many practitioners pair them before a conversation, class, or creative session that calls for calm honesty.</p>")
parts.append("<h3>5. A Time-Honored, Site-Recognized Pairing</h3>")
parts.append("<p>This is one of the combinations our compatibility engine recognizes as a deliberate, traditional pairing, not just a random match. That shared recognition is why the two are so often placed together on altars and nightstands — practitioners trust the combination for sleep & relaxation and meditation & spiritual growth, the exact use-cases where a gentle, air-element duo shines brightest.</p>")

# M6 How to Use
parts.append("<h2>How to Use Selenite and Angelite Together</h2>")
parts.append("<h3>Wear them</h3>")
parts.append("<p>A common question is <em>can I wear Selenite and Angelite on the same hand?</em> Yes — the shared air element means the two are traditionally considered comfortable together on the same wrist or in the same bracelet stack. That said, both are soft (Mohs 2 and 3–3.5), so if you wear a Selenite or Angelite bracelet, do so gently and avoid stacking it tightly against harder stones like quartz. For daily wear, many prefer an Angelite pendant kept apart from heavy rings.</p>")
parts.append("<h3>Meditate</h3>")
parts.append("<p>Hold Angelite in one hand as the gentle, supportive anchor and place Selenite nearby — on the floor, mat, or altar — to clear the space. Five to ten minutes is enough for a simple ritual, especially if you're new to working with these two stones. The aim is a calmer, more open sit, not a particular physical sensation. Their shared air element is traditionally associated with lightness and lift.</p>")
parts.append("<h3>Crystal grid</h3>")
parts.append("<p>Place Selenite at the center as the cleanser and Angelite stones around it to set a calm, communicative intent. It's a classic, simple grid for rest, gentle self-expression, or spiritual focus — easy to set up on a nightstand or small table. The luminous white and soft blue tones also make the grid visually cohesive for a bedroom or meditation corner.</p>")
parts.append("<h3>Place in a room</h3>")
parts.append("<p>A Selenite tower on the nightstand keeps the bedroom feeling clear, while a soft blue Angelite palm stone beside it brings a quiet, supportive presence. Together they turn a bedroom or meditation corner into a low-stimulation space — many people start here for calmer evenings and a gentler wind-down routine. Keep both dry and out of prolonged direct sun.</p>")

# Pre-existing tail modules (Caring / Shop / FAQ / Related / disclaimer) — preserved verbatim
parts.append("<h2>Caring for Selenite + Angelite</h2>")
parts.append("<p>Each stone has its own care needs:</p>")
parts.append("<ul>")
parts.append("<li><strong>Selenite:</strong> Water: Avoid water (soluble) · Sun: Sun-safe · Salt: Avoid salt.</li>")
parts.append("<li><strong>Angelite:</strong> Water: Avoid water (turns to gypsum) · Sun: Avoid prolonged sun · Salt: Avoid salt water.</li>")
parts.append("</ul>")
parts.append("<p>When in doubt, cleanse both with sound or moonlight — methods that are gentle across all stone types.</p>")
parts.append("<p><a href=\"/blog/how-to-cleanse-crystals/\">How to cleanse your crystals →</a></p>")
parts.append("<h2>Shop Selenite + Angelite</h2>")
parts.append("<p>Every stone below is genuine, ethically sourced, and real — not dyed, not glass.</p>")
parts.append("<!-- wp:html -->")
parts.append("<div style=\"display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:16px 0;\">")
parts.append("<a href=\"/product-category/selenite-crystals/\" style=\"display:block;background:#2D6A4F;color:#fff;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-weight:600;\">Shop Selenite →</a>")
parts.append("<a href=\"/product-category/angelite-crystals/\" style=\"display:block;background:#2D6A4F;color:#fff;border-radius:10px;padding:14px;text-align:center;text-decoration:none;font-weight:600;\">Shop Angelite →</a>")
parts.append("</div>")
parts.append("<!-- /wp:html -->")
parts.append("<p><em>Bundle any 3 and save 20%.</em></p>")

# FAQ
parts.append("<h2>Frequently Asked Questions</h2>")
parts.append("<h3>Can I wear Selenite and Angelite together every day?</h3>")
parts.append("<p>Many people do. If you're new to combining stones, start with a few hours and notice how the pairing feels before making it a daily habit.</p>")
parts.append("<h3>Can I wear Selenite and Angelite on the same hand?</h3>")
parts.append("<p>Yes — both are air-element stones, so they're traditionally considered comfortable together on the same wrist or in the same bracelet stack.</p>")
parts.append("<h3>Can I sleep with Selenite and Angelite?</h3>")
parts.append("<p>You can keep them nearby while you sleep. Selenite is often placed on the wrist or nightstand, while Angelite is best kept on the nightstand, since it's soft and can be damaged by pressure or moisture.</p>")
parts.append("<h3>How do I cleanse Selenite and Angelite?</h3>")
parts.append("<p><strong>Selenite:</strong> Water: Avoid water (soluble) · Sun: Sun-safe · Salt: Avoid salt. <strong>Angelite:</strong> Water: Avoid water (turns to gypsum) · Sun: Avoid prolonged sun · Salt: Avoid salt water. When in doubt, sound or moonlight cleansing is gentle across all stone types.</p>")
parts.append("<h3>Can I add a third stone to Selenite and Angelite?</h3>")
parts.append("<p>Yes — Clear Quartz is a neutral amplifier that bridges most pairings without competing. Add one stone at a time so you can notice each shift.</p>")

faq_schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Can I wear Selenite and Angelite together every day?", "acceptedAnswer": {"@type": "Answer", "text": "Many people do. If you're new to combining stones, start with a few hours and notice how the pairing feels before making it a daily habit."}},
    {"@type": "Question", "name": "Can I wear Selenite and Angelite on the same hand?", "acceptedAnswer": {"@type": "Answer", "text": "Yes — both are air-element stones, so they're traditionally considered comfortable together on the same wrist or in the same bracelet stack."}},
    {"@type": "Question", "name": "Can I sleep with Selenite and Angelite?", "acceptedAnswer": {"@type": "Answer", "text": "You can keep them nearby while you sleep. Selenite is often placed on the wrist or nightstand, while Angelite is best kept on the nightstand, since it's soft and can be damaged by pressure or moisture."}},
    {"@type": "Question", "name": "How do I cleanse Selenite and Angelite?", "acceptedAnswer": {"@type": "Answer", "text": "Selenite: Water: Avoid water (soluble) · Sun: Sun-safe · Salt: Avoid salt. Angelite: Water: Avoid water (turns to gypsum) · Sun: Avoid prolonged sun · Salt: Avoid salt water. When in doubt, sound or moonlight cleansing is gentle across all stone types."}},
    {"@type": "Question", "name": "Can I add a third stone to Selenite and Angelite?", "acceptedAnswer": {"@type": "Answer", "text": "Yes — Clear Quartz is a neutral amplifier that bridges most pairings without competing. Add one stone at a time so you can notice each shift."}}
  ]
}
parts.append('<script type="application/ld+json">')
parts.append(json.dumps(faq_schema, ensure_ascii=False, separators=(',', ':')))
parts.append('</script>')

parts.append("<h2>Related</h2>")
parts.append("<ul>")
parts.append("<li><a href=\"/gemstone/selenite-meaning/\">Selenite Meaning</a></li>")
parts.append("<li><a href=\"/gemstone/angelite-meaning/\">Angelite Meaning</a></li>")
parts.append("<li><a href=\"/blog/how-to-cleanse-crystals/\">How to Cleanse Crystals</a></li>")
parts.append("<li><a href=\"/amethyst-and-selenite/\">Amethyst and Selenite</a></li>")
parts.append("<li><a href=\"/amethyst-and-angelite/\">Amethyst and Angelite</a></li>")
parts.append("<li><a href=\"/selenite-and-fluorite/\">Selenite and Fluorite</a></li>")
parts.append("<li><a href=\"/rose-quartz-and-selenite/\">Rose Quartz and Selenite</a></li>")
parts.append("<li><a href=\"/tools/crystal-compatibility-checker/\">Crystal Compatibility Checker</a></li>")
parts.append("</ul>")
parts.append("<p><em>Crystal meanings are shared for entertainment and spiritual practice. They're not a substitute for professional medical or mental-health care.</em></p>")

d["content"] = "\n\n".join(parts)

# modules metadata
def wc(html):
    import re
    txt = re.sub(r'<[^>]+>', ' ', html)
    txt = re.sub(r'\s+', ' ', txt).strip()
    return len(txt.split())

# isolate each agent module text for word counts
m2_html = "\n\n".join([p for p in parts if p.startswith("<h2>About Selenite") or (parts.index(p) > parts.index("<h2>About Selenite</h2>") and p.startswith("<p>") and parts.index(p) < parts.index("<h2>About Angelite</h2>"))])

# Simpler: re-slice by known anchors
def slice_between(parts, start_marker, end_marker):
    s = parts.index(start_marker)
    e = parts.index(end_marker)
    return "\n".join(parts[s:e])

m2_text = slice_between(parts, "<h2>About Selenite</h2>", "<h2>About Angelite</h2>")
m3_text = slice_between(parts, "<h2>About Angelite</h2>", "<h2>Can You Wear Selenite and Angelite Together?</h2>")
m4_text = slice_between(parts, "<h2>Can You Wear Selenite and Angelite Together?</h2>", "<h2>Benefits of Selenite + Angelite</h2>")

d["modules"] = {
  "m2_agent": {"filled": True, "words": wc(m2_text)},
  "m3_agent": {"filled": True, "words": wc(m3_text)},
  "m4_agent": {"filled": True, "perspectives": ["practical", "energetic", "psychological"]},
  "m5_agent": {
    "filled": True,
    "benefits": [
      {"title": "Layered, Gentle Calm", "source": "sharedTags:calm"},
      {"title": "Clearer, More Open Spiritual Focus", "source": "sharedChakras:third-eye"},
      {"title": "A Light, Airy Energy Field", "source": "element:air+air"},
      {"title": "Easier, Gentler Self-Expression", "source": "sharedTags:spiritual+throat-chakra"},
      {"title": "A Time-Honored, Site-Recognized Pairing", "source": "pairHit"}
    ]
  },
  "m6_agent": {
    "filled": True,
    "uses": ["wear", "meditate", "grid", "place"],
    "longtail": ["same hand", "bracelet", "pendant", "for calm", "wind-down"]
  }
}

print("m2 words:", d["modules"]["m2_agent"]["words"])
print("m3 words:", d["modules"]["m3_agent"]["words"])
print("m4 words:", wc(m4_text))

with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

# verify round-trip parse
json.load(open(PATH, encoding='utf-8'))
print("WROTE + REPARSE OK")
