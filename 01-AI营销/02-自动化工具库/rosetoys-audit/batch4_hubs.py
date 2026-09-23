# -*- coding: utf-8 -*-
"""批次3三张 page 型 hub：#5 garter belts / #6 lingerie sets / #7 babydoll lingerie
SKU 池=wc/v3 REST 实况 publish（2026-09-09 batch3_wc_p1-6.json 快照，当日实拉）
garter hub=纯导购（全站 garter 语境仅 19866 腿环三点式，与吊袜腰带语境不匹配）
产出 build/g1..g3.json 供 curl 建 page 使用；35 号 §5 六步流程第 4 步本地自检
"""
import json, re, os

BASE = "https://rosetoys.org"
P = {
    "bridesgarter": f"{BASE}/brides-garter-belt/",
    "howto": f"{BASE}/how-to-wear-a-garter-belt/",   # 94641 future 09-11 生效，内链接受临时 404
    "stockings": f"{BASE}/product-category/womens-lingerie/stockings/",
    "parent": f"{BASE}/product-category/womens-lingerie/",
    "nightwear": f"{BASE}/product-category/womens-lingerie/nightwear/",
    "bridal": f"{BASE}/bridal-lingerie-set/",
    "honeymoon": f"{BASE}/honeymoon-lingerie/",
    "set": f"{BASE}/lingerie-sets/",        # 本批新建
    "babydoll": f"{BASE}/babydoll-lingerie/",  # 本批新建
}

def a(url, text):
    return f'<a href="{url}">{text}</a>'

# ============ #5 Garter Belts（纯导购页，无 shortcode） ============
g1 = {}
g1["key"] = "g1"
g1["title"] = "Garter Belts"
g1["slug"] = "garter-belts"
g1["seo_title"] = "Garter Belts: Styles, Fit & How They Work | RoseToys"
g1["meta"] = ("The garter belt, explained: strap counts, clip types, sizing, and how to pair "
              "one with sheer stockings — plus the bridal tradition. A RoseToys guide.")
g1["intro"] = (
    "Half waistband, half hardware, a garter belt is engineering disguised as lace. Four "
    "straps, six straps, a row of clips down each leg line — the silhouette has barely "
    "changed in a century because it barely has to. This guide walks through what a "
    "<strong>lace garter belt</strong> actually is, how the straps and clips do their work, "
    "how to size the band, and how the whole rig pairs with sheer stockings. For the version "
    "tied to weddings — the something blue, the toss, the keeping — the bridal page picks "
    "the story up from where this one ends."
)
g1["h2"] = "The Anatomy of a Garter Belt"
g1["p2"] = (
    "Count the straps before anything else: four is the classic everyday balance, six adds a "
    "smoother line down the leg, and the clips at the end of each strap should turn freely "
    "rather than sit stiff. Measure where the band will rest — high on the hip, not the "
    "waist — and check stretch before committing to a size. Wider bands stay put and read "
    "more vintage; slim straps under clothes read nearly invisible. What a garter holds up "
    "matters as much as the belt itself, so match it to stockings built for clips, not "
    "stay-up silicone."
)
g1["lead"] = ""
g1["ids"] = []
g1["footer"] = (
    f"The best next step is hands-on: our step-by-step on {a(P['howto'], 'how to wear a garter belt')} "
    f"covers clipping order and strap adjustment in practice. For the wedding version of the "
    f"tradition, the {a(P['bridesgarter'], 'brides garter belt')} page takes it from something "
    f"blue to the toss. Stockings complete the mechanism — browse "
    f"{a(P['stockings'], 'the sheer stockings they hold up')} for lace and sheer pairs built "
    f"to be clipped."
)
g1["main"] = "garter belt"
g1["intro_limit"] = 2   # 主词1 + strong辅词(lace garter belt)内嵌1，42号s1/s4先例
g1["footer_limit"] = (55, 80)  # 纯导购段（42号s5同款）

# ============ #6 Lingerie Sets（10 SKU） ============
g2 = {}
g2["key"] = "g2"
g2["title"] = "Lingerie Sets"
g2["slug"] = "lingerie-sets"
g2["seo_title"] = "Lingerie Sets in Lace, Mesh & Leather | RoseToys"
g2["meta"] = ("Lingerie sets in lace, mesh, and patent leather — from two-piece bra sets to "
              "three-point combos, ten curated picks that decide the whole look, at RoseToys.")
g2["intro"] = (
    "A matching set is the shortest route from a drawer full of singles to a look with "
    "intent, and this edit proves it ten times over. A <strong>lace lingerie set</strong> in "
    "the classic two-piece bra shape leads, three-point mesh combos bring the drama, patent "
    "leather turns the volume up, and a suspender-nightdress-and-robe pairing covers softer "
    "mornings. Every combo is chosen to work as one look — top, brief, and detail already in "
    "agreement — so nothing waits on a second decision. Start with the set and the rest of "
    "the evening tends to arrange itself."
)
g2["h2"] = "How a Lingerie Set Is Put Together"
g2["p2"] = (
    "Build outward from the bra: if the set is two-piece, the bra sets the line and the "
    "brief answers it; if it runs to three points, decide early whether the third piece is a "
    "strap, a ring, or a garter detail. Fabric decides the register — lace reads romantic, "
    "mesh reads barely-there, patent leather reads bold — so choose by the evening, not the "
    "photo. Check that the pieces sit flat together under whatever goes over them, and size "
    "to the bra first, since it carries the least forgiveness in the whole combination."
)
g2["lead"] = "Browse the set edit below — ten combos chosen to work as one."
g2["ids"] = [21637, 20776, 22710, 22541, 20815, 21588, 20782, 22498, 22717, 22439]
g2["footer"] = (
    f"Every silhouette has its own set logic: the {a(P['parent'], 'every women&#8217;s lingerie style')} "
    f"roundup shows the whole floor, the softer side lives in "
    f"{a(P['nightwear'], 'nightwear for slower nights')}, brides should start with "
    f"{a(P['bridal'], 'its bridal counterpart')}, and the one-piece answer — no pairing "
    f"required — is the {a(P['babydoll'], 'babydoll lingerie')} edit next door."
)
g2["main"] = "lingerie set"
g2["intro_limit"] = 1   # strong即那1次（42号s3同款）

# ============ #7 Babydoll Lingerie（12 SKU） ============
g3 = {}
g3["key"] = "g3"
g3["title"] = "Babydoll Lingerie"
g3["slug"] = "babydoll-lingerie"
g3["seo_title"] = "Babydoll Lingerie in Sheer Lace, Mesh & Velvet | RoseToys"
g3["meta"] = ("Babydoll lingerie in sheer lace, mesh, and velvet — twelve slip and sling "
              "nightdresses cut short, tied at the bust, and built to flatter, at RoseToys.")
g3["intro"] = (
    "The babydoll has outlasted trend after trend since the fifties, and the reason is "
    "simple cut: babydoll lingerie flares from the bust instead of hugging the waist, forgiving "
    "exactly where most nightwear clings. This edit gathers twelve of them in sheer and "
    "lace, from a slip tied with a bow to an angel-wing <strong>babydoll nightgown</strong> "
    "— mesh wraps, deep-V sling cuts, chiffon ruffles, a velvet slit — all short, light, and "
    "built to move. Slip one into a honeymoon packing list or keep it for a plain Tuesday "
    "in; either way, it reads as effort without trying."
)
g3["h2"] = "Babydoll Lingerie, from Bust to Hem"
g3["p2"] = (
    "Start at the hem and work upward: shorter hems read flirtier, a hem grazing the upper "
    "thigh covers more while still moving well, and the flare should swing rather than "
    "cling. At the bust, ties and stretch both matter — a front bow adjusts the fit, "
    "stretch lace forgives it, and a deep-V cut wants checking before anything ambitious. "
    "Fabric sets the season: mesh and chiffon for warm nights, velvet when the air cools. "
    "Between those three decisions — hem, bust, fabric — most of the rest of the choice "
    "makes itself."
)
g3["lead"] = "Browse the babydoll edit below — twelve short, light nightdresses."
g3["ids"] = [21542, 20819, 22790, 22587, 20993, 22708, 22843, 21734, 22459, 19346, 22701, 20795]
g3["footer"] = (
    f"One silhouette is never the whole plan: the rest of the shelf sits in "
    f"{a(P['nightwear'], 'the wider nightwear selection')}, the travel version is packed in "
    f"{a(P['honeymoon'], 'the honeymoon edit')}, and when the evening calls for two pieces "
    f"instead of one, {a(P['set'], 'lingerie sets')} pick up exactly where a babydoll "
    f"leaves off."
)
g3["main"] = "babydoll lingerie"
g3["intro_limit"] = 1

PAGES = [g1, g2, g3]

def wc(t):
    return len([w for w in re.sub(r"<[^>]+>", "", t).split() if re.search(r"[A-Za-z0-9]", w)])

def strip_tags(t):
    return re.sub(r"<[^>]+>", "", t)

def norm(t):
    return t.lower().replace("’", "").replace("'", "").replace("&#8217;", "")

FAIL = []
def check(label, cond, detail=""):
    mark = "PASS" if cond else "FAIL"
    print(f"  [{mark}] {label} {detail}")
    if not cond:
        FAIL.append(label)

FOREIGN_ALL = ["lace stockings", "fishnet stockings", "sexy nightwear", "thigh high stockings",
               "garter belt", "lingerie set", "babydoll lingerie", "teddy lingerie",
               "corset lingerie", "chemise lingerie", "bodystocking", "white stockings",
               "honeymoon lingerie", "wedding night lingerie", "bridal lingerie set",
               "valentines lingerie", "brides garter belt", "plus size lingerie",
               "plus size stockings", "plus size fishnet", "plus size garter belt",
               "plus size bodystocking"]

# 指向对应页的内链锚文本白名单（30号先例：下行链锚=目标页主词）
ANCHOR_OK = {
    "g1": {"brides garter belt": P["bridesgarter"]},
    "g2": {"babydoll lingerie": P["babydoll"]},
    "g3": {"lingerie set": P["set"]},   # 锚用复数 sets，norm 后含主词
}
# 本页辅词白名单：辅词含他页归属词子串时剔除后再计数
ANNEX = {"g1": ["lace garter belt"], "g2": ["lace lingerie set"], "g3": ["babydoll nightgown"]}

for pg in PAGES:
    print(f"== {pg['key']} {pg['title']} ==")
    parts = [pg["intro"], pg["h2"], pg["p2"]]
    if pg["lead"]:
        parts.append(pg["lead"])
    parts.append(strip_tags(pg["footer"]))
    body = " ".join(parts)
    body_plain = strip_tags(body)
    anchors = " | ".join([pg["seo_title"], pg["meta"], strip_tags(pg["h2"])])
    anchors_n = norm(anchors)
    strongs = re.findall(r"<strong>(.*?)</strong>", pg["intro"])
    main_n = norm(pg["main"])

    check("SEO title <=60", len(pg["seo_title"]) <= 60, f"= {len(pg['seo_title'])}")
    check("meta 120-155", 120 <= len(pg["meta"]) <= 155, f"= {len(pg['meta'])}")
    check("intro 词数 93-103", 93 <= wc(pg["intro"]) <= 103, f"= {wc(pg['intro'])}")
    check("P2 词数 88-95", 88 <= wc(pg["p2"]) <= 95, f"= {wc(pg['p2'])}")
    check("主词 title x1", norm(pg["seo_title"]).count(main_n) == 1)
    check("主词 meta x1", norm(pg["meta"]).count(main_n) == 1)
    n_intro = norm(strip_tags(pg["intro"])).count(main_n)
    check(f"主词 intro x{pg['intro_limit']}", n_intro == pg["intro_limit"], f"= {n_intro}")
    check("主词 H2 x1", norm(pg["h2"]).count(main_n) == 1)
    check("主词 P2 x0", norm(strip_tags(pg["p2"])).count(main_n) == 0)
    check("strong 恰1处", len(strongs) == 1, f"= {strongs}")
    if "footer_limit" in pg:
        lo, hi = pg["footer_limit"]
        check("导购段 词数 55-80", lo <= wc(pg["footer"]) <= hi, f"= {wc(pg['footer'])}")
    else:
        check("footer 词数>15", wc(pg["footer"]) > 15, f"= {wc(pg['footer'])}")

    body_clean = body_plain
    for ann in ANNEX.get(pg["key"], []):
        body_clean = body_clean.replace(ann, "")
    ok_whitelist = ANCHOR_OK.get(pg["key"], {})
    hrefs_txt = re.findall(r'<a href="([^"]+)">(.*?)</a>', pg["footer"])
    for wl_word, wl_url in ok_whitelist.items():
        for hu, at in hrefs_txt:
            if hu == wl_url:
                body_clean = body_clean.replace(strip_tags(at), "")
    for w in FOREIGN_ALL:
        w_n = norm(w)
        if w_n == main_n or w_n in main_n:
            continue  # 本页主词或其子串——由主词词频断言覆盖
        in_anchor = any(w_n in norm(at) and ok_whitelist.get(w) == hu for hu, at in hrefs_txt)
        n_body = norm(body_clean).count(w_n)
        n_anchor_pos = anchors_n.count(w_n)
        if w in ok_whitelist:
            ok = in_anchor and (n_body == 0) and (n_anchor_pos == 0)
            check(f"他页词[{w}] 白名单锚1+锚位0", ok, f"body_clean={n_body} anchor={in_anchor}")
        else:
            check(f"他页词[{w}] 全页0", n_body == 0 and n_anchor_pos == 0, f"body_clean={n_body} pos={n_anchor_pos}")

    for bare in ["stockings", "pantyhose", "corset", "chemise", "lingerie"]:
        for m in re.finditer(rf"\b{bare}\b", anchors_n):
            s = max(0, m.start() - 30)
            print(f"    (裸词锚位[{bare}]): ...{anchors_n[s:m.end()+10]}...")

    for dead in ["honeymoon stockings", "date night outfit", "bridal stockings",
                 "valentines stockings", "wedding stockings", "anniversary stockings"]:
        check(f"死格[{dead}]=0", norm(body_plain).count(norm(dead)) == 0)

    check("无硬年份", not re.search(r"\b20\d{2}\b", body_plain))

    zw = sum(t.count("​") for t in [pg["seo_title"], pg["meta"], body])
    check("U+200B=0", zw == 0)
    hrefs = re.findall(r'href="([^"]+)"', pg["footer"])
    check("href 全 https 全路径", all(h.startswith("https://rosetoys.org/") for h in hrefs), f"x{len(hrefs)}")
    n_links = 3 if pg["key"] == "g1" else (4 if pg["key"] == "g2" else 3)
    check(f"出链数={n_links}", len(hrefs) == n_links, f"= {len(hrefs)}")
    print(f"    SKU池: {len(pg['ids'])} 个 = {pg['ids']}")
    print()

# 全局锚文本唯一性（同目标不同来源不同锚）
from collections import defaultdict
tgt_anchors = defaultdict(list)
for pg in PAGES:
    for hu, at in re.findall(r'<a href="([^"]+)">(.*?)</a>', pg["footer"]):
        tgt_anchors[hu].append(norm(strip_tags(at)))
dup = {u: [x for x in v if v.count(x) > 1] for u, v in tgt_anchors.items()}
dup = {u: d for u, d in dup.items() if d}
check("本批内同目标锚文本无重复", not dup, str(dup))

# 与已上线页锚撞（41/42号+94641已用锚清单）
USED = {
    "white": ["white stockings", "sexy plus size lingerie", "white stockings guide"],
    "thigh": ["thigh high stockings", "sheer thigh highs", "white thigh highs", "lace-top thigh highs guide"],
    "plus": ["plus size lingerie"],
    "nightwear": ["our nightwear edit", "the full nightwear range", "nightwear collection",
                  "every nightwear silhouette", "red-hot nightwear styles", "nightwear shelf"],
    "stockings": ["our full stockings range", "stockings collection", "every stockings style on the shelf"],
    "parent": ["the full women&#8217;s lingerie collection", "the complete women&#8217;s lingerie range",
               "women&#8217;s lingerie boutique", "our full women&#8217;s lingerie selection"],
    "bridal": ["bridal lingerie set", "the bridal edit"],
    "honeymoon": ["honeymoon lingerie"],
    "brides-garter-belt": [],
    "how-to-wear-a-garter-belt": [],
}
for pg in PAGES:
    for hu, at in re.findall(r'<a href="([^"]+)">(.*?)</a>', pg["footer"]):
        for cat, anchors_used in USED.items():
            if cat in hu and anchors_used:
                hit = [u for u in anchors_used if norm(u) == norm(at)]
                check(f"锚[{strip_tags(at)}]->{cat} 不撞已用", not hit, str(hit))

# H2/intro开头/P2起手 三页互不同 + 避开已用句式族
h2_firsts = [" ".join(pg["h2"].split()[:2]) for pg in PAGES]
intro_firsts = [" ".join(strip_tags(pg["intro"]).split()[:3]) for pg in PAGES]
p2_firsts = [" ".join(strip_tags(pg["p2"]).split()[:4]) for pg in PAGES]
check("H2 起手三页互不同", len(set(h2_firsts)) == 3, str(h2_firsts))
check("intro 开头三页互不同", len(set(intro_firsts)) == 3, str(intro_firsts))
check("P2 起手三页互不同", len(set(p2_firsts)) == 3, str(p2_firsts))
BAN_H2 = ["choose your", "style ", "find your", "wear ", "look for", "pair ", "occasion",
          "building", "planning", "what makes", "how to shop", "picking"]
for pg in PAGES:
    h2n = norm(pg["h2"])
    hits = [b for b in BAN_H2 if b in h2n]
    check(f"H2避开已用12句式族 {pg['key']}", not hits, str(hits))
BAN_INTRO = ["shop ", "fastest way", "every ", "starts with", "what you pack", "the one evening",
             "somewhere between", "each february", "no single"]
for pg in PAGES:
    in_n = norm(strip_tags(pg["intro"]))[:60]
    hits = [b for b in BAN_INTRO if b in in_n]
    check(f"intro开头避开已用族 {pg['key']}", not hits, str(hits))
BAN_P2 = ["think color", "match the", "start with the", "lead with", "begin with",
          "let the fabric", "check the size chart", "pack around", "weight and drape",
          "order with", "anchor the look", "size is everything"]
for pg in PAGES:
    p2_n = norm(strip_tags(pg["p2"]))[:60]
    hits = [b for b in BAN_P2 if b in p2_n]
    check(f"P2起手避开已用族 {pg['key']}", not hits, str(hits))

# slop 扫描（43号16词表）
SLOP = ["elevate", "unleash", "dive into", "look no further", "game-changer", "transformative",
        "unveil", "embark", "delve", "whether you're", "in conclusion", "tapestry",
        "realm", "landscape", "testament", "journey"]
for pg in PAGES:
    all_text = " ".join([pg["seo_title"], pg["meta"], strip_tags(pg["intro"]), pg["h2"],
                         strip_tags(pg["p2"]), strip_tags(pg["footer"])])
    hits = [s for s in SLOP if s in norm(all_text)]
    check(f"slop扫描 {pg['key']}", not hits, str(hits))

# 输出 build JSON
os.makedirs(os.path.join(os.path.dirname(__file__), "build"), exist_ok=True)
for pg in PAGES:
    blocks = [
        f"<!-- wp:paragraph -->\n<p>{pg['intro']}</p>\n<!-- /wp:paragraph -->",
        f"<!-- wp:heading -->\n<h2>{pg['h2']}</h2>\n<!-- /wp:heading -->",
        f"<!-- wp:paragraph -->\n<p>{pg['p2']}</p>\n<!-- /wp:paragraph -->",
    ]
    if pg["lead"]:
        blocks.append(f"<!-- wp:paragraph -->\n<p>{pg['lead']}</p>\n<!-- /wp:paragraph -->")
    if pg["ids"]:
        blocks.append(f"<!-- wp:shortcode -->\n[products ids=\"{','.join(map(str, pg['ids']))}\" columns=\"4\"]\n<!-- /wp:shortcode -->")
    blocks.append(f"<!-- wp:paragraph -->\n<p>{pg['footer']}</p>\n<!-- /wp:paragraph -->")
    content = "\n\n".join(blocks)
    payload = {"title": pg["title"], "slug": pg["slug"], "status": "publish", "content": content}
    with open(os.path.join(os.path.dirname(__file__), "build", f"{pg['key']}.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    meta_payload = {"objectType": "post", "objectID": "PGID",
                    "meta": {"rank_math_title": pg["seo_title"], "rank_math_description": pg["meta"]}}
    with open(os.path.join(os.path.dirname(__file__), "build", f"{pg['key']}_meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta_payload, f, ensure_ascii=False)
    print(f"{pg['key']}.json 写出 | slug={pg['slug']} | ids={len(pg['ids'])}")

print()
print("FAIL 项:", FAIL if FAIL else "无，全过")
