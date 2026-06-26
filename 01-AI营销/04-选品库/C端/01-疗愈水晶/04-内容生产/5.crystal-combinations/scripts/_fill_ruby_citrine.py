# -*- coding: utf-8 -*-
import json, re

path = "D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/ruby-and-citrine.json"
d = json.load(open(path, "r", encoding="utf-8"))
c = d["content"]

m2 = (
'<h2>About Ruby</h2>\n'
'<p>Ruby is a deep red variety of corundum, traditionally associated with passion, love, and courage. In crystal practice it’s often linked with the Root and Heart chakras, which makes it a natural fit for personal-power rituals, leadership intentions, and grounding vitality. Its classic “pigeon blood” red is the most sought-after shade, and common forms include faceted rings, pendants, star cabochons, and bead bracelets.</p>\n'
'<p>Mineralogically, Ruby is aluminum oxide (Al₂O₃), chromium-colored, with a Mohs hardness of 9 — second only to diamond — making it exceptionally durable for everyday rings, pendants, and bracelets. It tolerates brief contact with water and is sun-safe, though salt water should be avoided to protect its setting and surface.</p>\n'
'<p><a href="/gemstone/ruby-meaning/">Ruby Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>'
)

m3 = (
'<h2>About Citrine</h2>\n'
'<p>Citrine is a golden-yellow to warm-orange variety of quartz, traditionally associated with abundance, confidence, and motivation. In crystal practice it’s often linked with the Solar Plexus and Sacral chakras, which makes it a natural fit for morning energy, wealth intentions, and personal-power work. Its sunny tones range from pale lemon to rich brownish-gold, and common forms include bracelets, rings, pendants, tumbled stones, and raw points.</p>\n'
'<p>Mineralogically, Citrine is silicon dioxide (SiO₂) with a Mohs hardness of 7, durable enough for everyday bracelets, rings, and pendants. Its color comes from iron and natural heat. It tolerates brief contact with water, is sun-safe (its color is stable), and is generally salt-safe — one of the easier stones to care for.</p>\n'
'<p><a href="/gemstone/citrine-meaning/">Citrine Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>'
)

m4 = (
'<h2>Can You Wear Ruby and Citrine Together?</h2>\n'
'<p><strong>Practically:</strong> Ruby and Citrine are both durable enough for daily wear. Ruby sits at 9 on the Mohs scale and Citrine at 7, so both hold up well in everyday rings, pendants, and bracelets without scratching each other under normal use. Their shared care needs are also easy to manage — both tolerate a brief water rinse and sun exposure — with the only real difference being that Ruby should be kept away from salt water. Visually, the deep red of Ruby and the warm gold of Citrine create a striking, sun-warmed contrast that reads as bold and confident in a bracelet stack or pendant pairing.</p>\n'
'<p><strong>Energetically:</strong> Both stones are linked to the fire element, so together they’re seen as a high-drive, outward-facing pair rather than a calming one. Ruby is traditionally associated with the Root and Heart chakras (passion, courage, leadership), while Citrine is linked to the Solar Plexus and Sacral chakras (confidence, motivation, abundance). In crystal tradition, the two reinforce one another’s fire — Ruby grounds the drive, Citrine lifts and brightens it — which is why many people pair them for confidence and motivation rather than for rest.</p>\n'
'<p><strong>Psychologically:</strong> Because Ruby and Citrine share the “personal-power” intention, the pairing works as a single, focused ritual anchor rather than two competing ones. Worn together, they’re often used as a daily reminder of courage and forward momentum — a wearable cue for showing up boldly. The shared theme keeps the intention clean and easy to hold onto.</p>\n'
'<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not established by modern research.</em></p>'
)

m5 = (
'<h2>Benefits of Ruby + Citrine</h2>\n'
'<p>Together, Ruby and Citrine cover six complementary strengths:</p>\n'
'<h3>1. Amplified Confidence &amp; Motivation</h3>\n'
'<p>This is the heart of the pairing. Both stones carry the “personal-power” intention, so combined they reinforce one drive rather than splitting it. Ruby is traditionally associated with courage and leadership, while Citrine is linked to self-assurance and forward momentum. Worn or carried together, many people reach for them at the start of a demanding week or before a high-stakes moment when they want to show up boldly without second-guessing.</p>\n'
'<h3>2. Grounded, Stable Fire Energy</h3>\n'
'<p>Ruby and Citrine are both fire-element stones, which is why the pairing reads as warm, active, and outward-facing rather than calming. Ruby’s link to the Root chakra is said to anchor that fire so it doesn’t feel scattered, while Citrine’s Solar Plexus association lifts and brightens it. The result, in crystal tradition, is energy that moves with intention instead of spiking and fading.</p>\n'
'<h3>3. Passion Meets Abundance</h3>\n'
'<p>Ruby is traditionally used for passion and love, while Citrine is one of the most popular stones for abundance and wealth intentions. Together they cover two complementary draws — the courage to pursue what you care about, and the confidence to receive. Many people pair them for business, creative work, or any goal that asks for both drive and an abundance mindset.</p>\n'
'<h3>4. A Bold, Cohesive Morning Ritual</h3>\n'
'<p>Because Citrine is often chosen for morning energy and Ruby for vitality, the two naturally slot into an energizing start-of-day routine. Worn as a bracelet or kept on a workspace, they serve as a simple, single-theme anchor — courage plus momentum — rather than a competing set of intentions. It’s a low-fuss way to make a personal-power intention part of an ordinary morning.</p>\n'
'<h3>5. Leadership &amp; Vitality Support</h3>\n'
'<p>Ruby is classically associated with bravery and leadership, and Citrine with confidence and the kind of warmth that draws people in. In crystal tradition, the pairing is often used by people in visible, high-responsibility roles — teaching, managing, performing — who want steady self-assurance without edginess. The shared fire element is said to keep the energy generous rather than aggressive.</p>\n'
'<h3>6. An Easy-to-Care-For Power Pair</h3>\n'
'<p>Practically, Ruby (Mohs 9) and Citrine (Mohs 7) are both durable enough for everyday jewelry and share similar care needs — both tolerate brief water rinses and sun exposure. That makes this one of the lower-maintenance fire pairings: a daily bracelet stack or pendant set you can wear through normal activity without constant caution, with only the note to keep Ruby away from salt water.</p>'
)

m6 = (
'<h2>How to Use Ruby and Citrine Together</h2>\n'
'<h3>Wear them</h3>\n'
'<p>A common question is <em>can I wear Ruby and Citrine on the same hand?</em> Yes — both are fire-element stones, so they’re traditionally considered comfortable together. A Ruby bead bracelet on the left wrist paired with a Citrine bracelet on the same hand is a popular daily combo for confidence and motivation. Both are durable (Mohs 9 and 7), so a bracelet stack holds up to normal wear without scratching under gentle contact.</p>\n'
'<h3>Meditate</h3>\n'
'<p>For a personal-power meditation, hold Ruby in one hand to anchor courage and place Citrine nearby — on your lap, a mat, or an altar — to keep motivation and abundance in focus. Five to ten minutes is enough for a simple ritual, especially if you’re new to working with these stones. The aim is steadier self-assurance, not a particular physical sensation, so set a clear intention before you begin.</p>\n'
'<h3>Crystal grid</h3>\n'
'<p>Place a Ruby at the center as the courage anchor and arrange Citrine points around it to set the motivation and abundance intent. It’s a classic, simple fire-element grid for confidence, leadership, or wealth goals — easy to set up on a desk, workspace, or small table where you want steady forward-drive energy during the day.</p>\n'
'<h3>Place in a room</h3>\n'
'<p>A Citrine cluster or raw point on your desk brings warmth and an abundance focus to a workspace, while a Ruby on the nightstand or near your mirror serves as a daily courage cue. Together they turn a desk or entryway into a personal-power corner — many people start here when they want a bolder, more confident start to the day. For sleep, keep the fire pair on a nightstand rather than directly under you.</p>'
)

repl = {"M2": m2, "M3": m3, "M4": m4, "M5": m5, "M6": m6}

def sub_one(content, key, html):
    pat = re.compile(r"<!-- AGENT_" + key + r":[\s\S]*?-->")
    new, n = pat.subn(html, content)
    assert n == 1, "placeholder M%s replaced %d times" % (key, n)
    return new

for key, html in repl.items():
    c = sub_one(c, key, html)

d["content"] = c

d["modules"] = {
    "m2_agent": {"filled": True, "words": 110},
    "m3_agent": {"filled": True, "words": 112},
    "m4_agent": {"filled": True, "perspectives": ["practical", "energetic", "psychological"]},
    "m5_agent": {
        "filled": True,
        "benefits": [
            {"title": "Amplified Confidence & Motivation", "source": "sharedTags:personal-power"},
            {"title": "Grounded, Stable Fire Energy", "source": "element:fire"},
            {"title": "Passion Meets Abundance", "source": "sharedTags:personal-power+abundance"},
            {"title": "A Bold, Cohesive Morning Ritual", "source": "element:fire+bestFor:morning-energy"},
            {"title": "Leadership & Vitality Support", "source": "sharedTags:personal-power"},
            {"title": "An Easy-to-Care-For Power Pair", "source": "element:fire+durability"}
        ]
    },
    "m6_agent": {
        "filled": True,
        "uses": ["wear", "meditate", "grid", "place"],
        "longtail": ["same hand", "bracelet", "for sleep", "morning energy"]
    }
}

with open(path, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

def wc(html):
    txt = re.sub(r"<[^>]+>", " ", html)
    txt = re.sub(r"\s+", " ", txt).strip()
    return len(txt.split())

print("M2 words:", wc(m2))
print("M3 words:", wc(m3))
print("M4 words:", wc(m4))
print("placeholders remaining:", len(re.findall(r"<!-- AGENT_M", d["content"])))
print("OK written")
