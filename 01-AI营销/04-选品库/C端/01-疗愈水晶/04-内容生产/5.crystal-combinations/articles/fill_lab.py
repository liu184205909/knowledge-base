# -*- coding: utf-8 -*-
import json, re

P = "labradorite-and-red-jasper.json"
d = json.load(open(P, encoding="utf-8"))

# ---- module HTML (escaped \n is fine; json.dump will serialize) ----
M2 = """<h2>About Labradorite</h2>
<p>Labradorite is a grey-black feldspar famous for its flash of blue, gold, and green light — an optical effect called labradorescence. In crystal practice it's traditionally associated with transformation, intuition, and protection, and is often linked with the Throat and Third Eye chakras. That makes it a popular stone for navigating change, creative work, and inner vision. Common forms include cabochon pendants, tumbled stones, palm stones, and rings.</p>
<p>Mineralogically, Labradorite is a plagioclase feldspar with the formula (Ca,Na)(Si,Al)₄O₈ and a Mohs hardness of 6–6.5 — durable enough for everyday pendants and rings, though slightly softer than quartz, so it should not be stacked tightly against harder stones. A brief rinse with water is safe, and it tolerates sun, but it should be kept away from salt water.</p>
<p><a href="/gemstone/labradorite-meaning/">Labradorite Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>"""

M3 = """<h2>About Red Jasper</h2>
<p>Red Jasper is an opaque, brick-red to terracotta stone colored by iron oxide, traditionally associated with grounding, strength, endurance, and courage. In crystal practice it's often linked with the Root and Sacral chakras, which makes it a natural fit for stamina, focus, and stress relief. Many people reach for it when they want a steadier, more settled energy through long days or demanding tasks. Common forms include bracelets, pendants, tumbled stones, palm stones, and raw pieces.</p>
<p>Mineralogically, Red Jasper is silicon dioxide (SiO₂) with a Mohs hardness of 6.5–7 — durable enough for everyday bracelets and pendants, and a touch harder than Labradorite. A brief rinse with water is safe, it tolerates sun, and it's also salt-safe, which makes it one of the lower-maintenance stones in a collection.</p>
<p><a href="/gemstone/red-jasper-meaning/">Red Jasper Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>"""

M4 = """<h2>Can You Wear Labradorite and Red Jasper Together?</h2>
<p><strong>Practically:</strong> Labradorite and Red Jasper work well as a wearable pair because both are hard enough for daily jewelry. Red Jasper (Mohs 6.5–7) is suited to everyday bracelets, pendants, and rings, while Labradorite (Mohs 6–6.5) is a touch softer and shines as a cabochon pendant or ring. They should not be stacked tightly against each other or against harder stones, since Labradorite can pick up scratches over time. Care is simple: both tolerate a brief water rinse and sun, but Labradorite should be kept away from salt water while Red Jasper is salt-safe. Visually, the grey-black flash of Labradorite against the warm brick-red of Jasper creates a striking, earthy contrast.</p>
<p><strong>Energetically:</strong> In crystal tradition, this is a complementary water-meets-earth pairing. Red Jasper, linked to the Root and Sacral chakras, is said to ground and stabilize, while Labradorite, linked to the Throat and Third Eye, is believed to support intuition and protect the energy field during change. Together they're often described as a steady base with an open, watchful quality above it — anchored but receptive.</p>
<p><strong>Psychologically:</strong> Both stones carry protection and personal-power intentions, so they reinforce a single goal rather than competing: feeling both grounded and quietly capable. Many people use the pairing as a daily anchor during transitions or demanding stretches.</p>
<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not established by modern research.</em></p>"""

M5 = """<h2>Benefits of Labradorite + Red Jasper</h2>
<p>Together, Labradorite and Red Jasper cover five complementary strengths:</p>
<h3>1. Grounded Protection</h3>
<p>Both stones share a protection intention, and together they cover it from two angles. Red Jasper is traditionally used to ground and steady the body, while Labradorite is often chosen to shield the energy field during change. Many people pair them when they want to feel both physically settled and energetically kept — protected from the ground up, rather than relying on one stone alone for a sense of safety.</p>
<h3>2. Steady Personal Power</h3>
<p>Personal-power is a shared intention for this pair, and it shows up differently in each stone. Red Jasper is traditionally associated with endurance and the courage to keep going, while Labradorite is linked to confidence through transformation and new beginnings. Combined, the pairing is often used when someone needs steady motivation through a demanding project or life change — a quiet, sustained drive rather than a quick burst.</p>
<h3>3. Earth-and-Water Balance</h3>
<p>This pairing brings together the earth element of Red Jasper and the water element of Labradorite, and that elemental mix is the heart of its appeal. Earth is traditionally associated with stability and rootedness; water with flow, intuition, and adaptability. Many people find the combination useful when life feels either too scattered or too stuck — a balance of staying power and the flexibility to move with change.</p>
<h3>4. Focus Meets Intuition</h3>
<p>Red Jasper is often reached for during long, focused work, while Labradorite is traditionally linked to intuition and creative insight. The two chakra ranges reflect this: Root and Sacral energy for stamina, Throat and Third Eye for clearer vision and expression. Together the pair is used as a work-and-vision combo — staying on task while staying open to new ideas, instead of grinding through on willpower alone.</p>
<h3>5. A Daily Anchor Through Change</h3>
<p>Because Labradorite is associated with transformation and Red Jasper with steady endurance, the pairing is a popular one for transitions — new jobs, moves, or stretches that ask for both adaptability and grit. Many people wear it as a bracelet or pendant through such periods as a simple ritual anchor: one stone to stay grounded, one to stay open, carried together as a reminder of both.</p>"""

M6 = """<h2>How to Use Labradorite and Red Jasper Together</h2>
<h3>Wear them</h3>
<p>A common question is <em>can I wear Labradorite and Red Jasper on the same hand?</em> Yes — with a small caveat. Both are hard enough for daily wear, so a Red Jasper bracelet stacks comfortably with a Labradorite bracelet or pendant. Because Labradorite (Mohs 6–6.5) is slightly softer, leave a little gap or use a leather cord rather than pressing the two stones directly against each other, which can scratch the flash surface over time. For sleep or evening wear, many people keep Red Jasper on the wrist and Labradorite as a pendant.</p>
<h3>Meditate</h3>
<p>Hold Red Jasper in one hand to settle and ground, and rest Labradorite nearby — on your lap, a mat, or a small altar — to support intuition. Five to ten minutes is enough for a simple session, especially when you're new to working with these two stones. The aim is a calmer, more focused sit, with one stone rooting you and one keeping your awareness open.</p>
<h3>Crystal grid</h3>
<p>Place Red Jasper at the center as the grounding base, with Labradorite points or tumbled stones arranged around it. It's a simple, classic grid for protection, focus, or moving through change — easy to set up on a desk or small table. State your intention once before laying the stones, then let the arrangement stand for as long as it feels useful.</p>
<h3>Place in a room</h3>
<p>A Red Jasper palm stone on the work desk supports steady focus through long tasks, while a Labradorite sphere or palm stone nearby keeps intuition and protection in play. Together they turn a workspace or entryway into a grounded, watchful environment — many people start here when they want steadier energy through a demanding season without leaning on a single stone.</p>"""

mapping = {"M2": M2, "M3": M3, "M4": M4, "M5": M5, "M6": M6}

def repl(m):
    key = re.search(r"AGENT_(M\d)", m.group(0)).group(1)
    return mapping[key]

d["content"] = re.sub(r"<!-- AGENT_M\d[\s\S]*?-->", repl, d["content"])

# word counts (strip tags)
def wc(html):
    txt = re.sub(r"<[^>]+>", " ", html)
    return len(txt.split())

d["modules"] = {
    "m2_agent": {"filled": True, "words": wc(M2)},
    "m3_agent": {"filled": True, "words": wc(M3)},
    "m4_agent": {"filled": True, "perspectives": ["practical", "energetic", "psychological"]},
    "m5_agent": {"filled": True, "benefits": [
        {"title": "Grounded Protection", "source": "sharedTags:protection"},
        {"title": "Steady Personal Power", "source": "sharedTags:personal-power"},
        {"title": "Earth-and-Water Balance", "source": "element:water+earth"},
        {"title": "Focus Meets Intuition", "source": "element:water+earth"},
        {"title": "A Daily Anchor Through Change", "source": "sharedTags:protection+personal-power"},
    ]},
    "m6_agent": {"filled": True, "uses": ["wear", "meditate", "grid", "place"],
                 "longtail": ["same hand", "bracelet", "for sleep", "pendant"]},
}

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# verify
d2 = json.load(open(P, encoding="utf-8"))
rem = re.findall(r"<!-- AGENT_M\d", d2["content"])
print("REMAINING_PLACEHOLDERS", len(rem))
print("M2_WC", wc(M2), "M3_WC", wc(M3), "M4_WC", wc(M4))
# sanity: no banned words
for bad in ["anxiety", "under the pillow", "Scientifically"]:
    if bad.lower() in d2["content"].lower():
        print("BANNED_FOUND", bad)
print("DONE")
