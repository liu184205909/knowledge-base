# -*- coding: utf-8 -*-
"""批次2二波五张场景页：内容构造 + 本地自检（35号§5第4步）
#16 honeymoon / #17 wedding night / #18 bridal / #19 valentines / #20 brides garter belt
SKU 池=wc/v3 REST 实况 publish（2026-09-09 拉取，batch3_wc_p1-6.json）
产出 build/s1..s5.json 供 curl 建 page 使用
"""
import json, re, os

BASE = "https://rosetoys.org"
P = {
    "honeymoon": f"{BASE}/honeymoon-lingerie/",
    "wedding": f"{BASE}/wedding-night-lingerie/",
    "bridal": f"{BASE}/bridal-lingerie-set/",
    "valentines": f"{BASE}/valentines-lingerie/",
    "garter": f"{BASE}/brides-garter-belt/",
    "white": f"{BASE}/white-stockings/",
    "thigh": f"{BASE}/thigh-high-stockings/",
    "plus": f"{BASE}/plus-size-lingerie/",
    "stockings": f"{BASE}/product-category/womens-lingerie/stockings/",
    "nightwear": f"{BASE}/product-category/womens-lingerie/nightwear/",
    "parent": f"{BASE}/product-category/womens-lingerie/",
    "accessories": f"{BASE}/product-category/accessories/",
}

def a(url, text):
    return f'<a href="{url}">{text}</a>'

# ============ #16 Honeymoon ============
s1 = {}
s1["key"] = "s1"
s1["title"] = "Honeymoon Lingerie"
s1["slug"] = "honeymoon-lingerie"
s1["seo_title"] = "Honeymoon Lingerie & Romantic Lace Slips | RoseToys"
s1["meta"] = ("Shop honeymoon lingerie in white lace, sheer mesh, and satin-touch slips — "
              "ten curated styles packed for the trip of a lifetime, at RoseToys.")
s1["intro"] = (
    "What you pack for the honeymoon matters nearly as much as the destination itself. "
    "This honeymoon lingerie edit gathers ten pieces chosen for romantic travel: white lace "
    "that photographs beautifully, sheer mesh that weighs nothing in a suitcase, and "
    "satin-touch slips that turn any hotel evening into an occasion. Styles run from a "
    "delicate <strong>honeymoon lingerie set</strong> in embroidered lace to butterfly mesh "
    "nightdresses with real personality. Every piece is soft enough to sleep in and striking "
    "enough to be seen in, so the packing list stays light while the options stay open."
)
s1["h2"] = "Building Your Honeymoon Lingerie Collection"
s1["p2"] = (
    "Pack around the trip itself: a breezy mesh piece for warm nights, a lace slip for slow "
    "mornings, and one bolder set for the evening that deserves it. Whites and soft neutrals "
    "photograph best against resort light, so lead with them when space is tight. Choose "
    "fabrics that shake out of a bag without a crease — stretch lace and mesh forgive, while "
    "structured satin wants a hanger. Wash everything in the sink, roll it in a towel, and it "
    "dries by morning, ready for the next night of a very good week."
)
s1["lead"] = "Browse the honeymoon edit below — ten pieces picked for the trip."
s1["ids"] = [20763, 21768, 22520, 22506, 22807, 22932, 22755, 21735, 22434, 22248]
s1["footer"] = (
    f"Planning a February escape too? See our {a(P['valentines'], 'Valentine&#8217;s lingerie')} "
    f"edit next. For the wedding-weekend neutrals, {a(P['white'], 'soft white hosiery')} "
    f"finishes the look, and the {a(P['nightwear'], 'nightwear shelf')} behind this edit is "
    f"worth a slow browse."
)
s1["main"] = "honeymoon lingerie"
s1["intro_limit"] = 2   # 主词1 + strong辅词(honeymoon lingerie set)内嵌1，plus页先例

# ============ #17 Wedding Night ============
s2 = {}
s2["key"] = "s2"
s2["title"] = "Wedding Night Lingerie"
s2["slug"] = "wedding-night-lingerie"
s2["seo_title"] = "Wedding Night Lingerie in Satin & Lace | RoseToys"
s2["meta"] = ("Wedding night lingerie in satin, white lace, and soft mesh — ten curated "
              "pieces for the evening the whole day has been building toward, at RoseToys.")
s2["intro"] = (
    "The wedding night is the one evening the entire day has been building toward, and the "
    "right wedding night lingerie decides the mood the moment the gown comes off. This edit "
    "collects ten pieces made for that handoff: satin slips that feel like a second "
    "honeymoon, white lace with just enough sheer, an angel-wing nightgown for the "
    "romantics, and deep-V cuts for brides who planned everything — including this. Soft "
    "mesh keeps things light after a long day in structured wear, and every piece doubles "
    "beautifully on <strong>anniversary lingerie</strong> duty for years to come."
)
s2["h2"] = "Planning Your Wedding Night Lingerie"
s2["p2"] = (
    "Weight and drape come first: after twelve hours in a structured gown, nothing beats "
    "satin and stretch mesh against the skin. Keep one piece classic — a white slip or lace "
    "nightdress — and one playful, so the mood can go either way. Practicality matters more "
    "than brides expect: choose pieces that slip on without help and photograph well from "
    "every angle. Pack them in a separate bag so the evening's look stays a surprise, and "
    "hand wash the lace the morning after so it stays fresh for every anniversary that "
    "follows."
)
s2["lead"] = "Browse the wedding night edit below — ten pieces for the evening itself."
s2["ids"] = [20801, 20832, 21768, 22806, 20819, 22520, 22807, 22818, 22997, 22506]
s2["footer"] = (
    f"Still building the bridal trousseau? The {a(P['bridal'], 'bridal lingerie set')} edit "
    f"covers the weeks before, and {a(P['thigh'], 'lace-top thigh highs')} complete the "
    f"look. For every other night of the marriage, browse "
    f"{a(P['nightwear'], 'every nightwear silhouette')} in the collection."
)
s2["main"] = "wedding night lingerie"
s2["intro_limit"] = 1

# ============ #18 Bridal ============
s3 = {}
s3["key"] = "s3"
s3["title"] = "Bridal Lingerie Set"
s3["slug"] = "bridal-lingerie-set"
s3["seo_title"] = "Bridal Lingerie Set Edit: White Lace & Satin | RoseToys"
s3["meta"] = ("Find your bridal lingerie set in white lace, satin slips, and embroidered "
              "finishes — ten curated pieces for under the gown and long after, at RoseToys.")
s3["intro"] = (
    "Somewhere between the final dress fitting and the walk down the aisle, every bride "
    "needs a <strong>bridal lingerie set</strong> that lives up to the moment. This edit "
    "collects ten pieces in bridal whites: satin slips that smooth under the gown, "
    "embroidered lace for the wedding night, white thigh highs for the after-party, and "
    "halter sets that finish the getting-ready photos. Whites stay crisp, lace stays soft "
    "against skin, and every cut is made to be seen — because the best bridal pieces work "
    "the whole wedding weekend, from morning mimosas to the last dance and long after."
)
s3["h2"] = "What Makes a Beautiful Bridal Lingerie Set"
s3["p2"] = (
    "Order with the dress in mind: smooth satin slips disappear under structured gowns, "
    "while embroidered lace and halter sets shine once the gown comes off. Check the fit "
    "against your usual size before the final alteration, since bridal pieces cut close. "
    "Keep one set for the ceremony itself — seamless, whisper-quiet, invisible — and a "
    "second, bolder one for the wedding night. Whites vary a shade between fabrics, so lay "
    "pieces together before packing, and let tie details flex the fit right through the "
    "last dance of a very long, very good day of celebrating."
)
s3["lead"] = "Browse the bridal edit below — ten white-ready pieces for the weekend."
s3["ids"] = [20801, 20832, 20763, 22818, 20776, 22997, 22579, 22434, 22932, 22130]
s3["footer"] = (
    f"Once the weekend turns into a marriage, see the {a(P['wedding'], 'wedding night lingerie')} "
    f"edit next. Complete the whites with {a(P['white'], 'the all-white edit')} in legwear, or "
    f"browse {a(P['parent'], 'our full women&#8217;s lingerie selection')} for every silhouette."
)
s3["main"] = "bridal lingerie set"
s3["intro_limit"] = 1   # strong即首句那1次

# ============ #19 Valentines ============
s4 = {}
s4["key"] = "s4"
s4["title"] = "Valentine's Lingerie"
s4["slug"] = "valentines-lingerie"
s4["seo_title"] = "Valentine's Lingerie in Red & Pink | RoseToys"
s4["meta"] = ("Shop Valentine's lingerie in reds and pinks — lace, mesh, and daring cuts "
              "in twelve curated styles that make each February one to remember, at RoseToys.")
s4["intro"] = (
    "Each February, the search begins: something red, something pink, something that says "
    "the night was planned. This Valentine's lingerie edit answers with twelve pieces in "
    "the colors of the season — deep lace in true red, a pink sling nightdress that flirts "
    "with sweet, wine-red slits, mesh suspender slips in passionate pink. From a full "
    "<strong>Valentine's lingerie set</strong> in lace to a daring jumpsuit with cut-outs, "
    "every piece is chosen for the one night a year when lingerie is the gift and the "
    "greeting card both. Pick your shade, pick your cut, and let the evening handle itself."
)
s4["h2"] = "How to Shop for Valentine's Lingerie"
s4["p2"] = (
    "Anchor the look in color: true red reads bold and classic, pink stays playful and "
    "sweet, and wine tones split the difference. Then match the cut to the evening — a lace "
    "set for gift-box drama, a slit nightdress when the night is long, a jumpsuit when you "
    "want the whole statement in one piece. Sizing runs standard, so trust your usual "
    "letter and the chart for anything strapless. And since February photographs everything, "
    "choose lace and mesh that flatter in low light; the right shade does half the work "
    "before you even slip it on."
)
s4["lead"] = "Browse the Valentine's edit below — twelve reds and pinks for February."
s4["ids"] = [21766, 21733, 21732, 21767, 22433, 22768, 22592, 20765, 21768, 19866, 22507, 22153]
s4["footer"] = (
    f"Taking the romance further this year? Our {a(P['honeymoon'], 'honeymoon lingerie')} "
    f"edit packs the same feeling into a whole trip. For every curve, "
    f"{a(P['plus'], 'plus size Valentine&#8217;s styles')} bring the reds and pinks in "
    f"curvy-friendly cuts, and the {a(P['nightwear'], 'red-hot nightwear styles')} behind "
    f"this edit keep going."
)
s4["main"] = "valentine's lingerie"   # 撇号自然拼写；normalize后=valentines lingerie（Ubersuggest归一词形，Google分词同token）
s4["intro_limit"] = 2   # 主词1 + strong辅词(valentines lingerie set)内嵌1

# ============ #20 Brides Garter（纯导购页，无shortcode） ============
s5 = {}
s5["key"] = "s5"
s5["title"] = "Brides Garter Belt"
s5["slug"] = "brides-garter-belt"
s5["seo_title"] = "Brides Garter Belt — Tradition & How to Wear | RoseToys"
s5["meta"] = ("The brides garter belt, from the something-blue tradition to modern lace — "
              "how to size one, wear one, and clip it to sheer stockings. A RoseToys guide.")
s5["intro"] = (
    "No single bridal accessory carries as much history as the <strong>brides garter "
    "belt</strong>. Tossed "
    "at receptions for centuries, it is the one piece of the wedding look guests actually "
    "cheer for — and the one only two people see up close. A good garter is a wide band of "
    "lace or satin that slides to the upper thigh, holds without pinching, and carries a "
    "tiny something blue when tradition calls. Modern brides often wear two: one to keep, "
    "one to throw. This guide covers how to size the band, where it sits, what it clips "
    "to, and how the whole ritual plays out."
)
s5["h2"] = "Picking the Right Brides Garter Belt"
s5["p2"] = (
    "Size is everything with a garter: measure around the mid-thigh where the band will "
    "sit, and choose one with a touch of stretch lace so it stays put through dinner and "
    "dancing. Width sets the tone — a slim satin band reads minimal and modern, while wide "
    "lace with ribbon detail reads classic bridal. Blue charms, pearls, or a small bow "
    "cover the something-blue without a second thought. Slip it on just before the "
    "reception, over bare skin or over sheer stockings, and wear the second one higher "
    "for the toss."
)
s5["lead"] = ""
s5["ids"] = []
s5["footer"] = (
    f"The right garter deserves the right company: sheer stockings it can clip to, and the "
    f"finishing touches around it. Browse {a(P['stockings'], 'every stockings style on the shelf')} "
    f"for lace and sheer pairs, poke through {a(P['accessories'], 'our accessories shelf')} "
    f"for the rest of the look, and see the {a(P['bridal'], 'bridal edit')} for the full "
    f"trousseau — then let tradition handle the rest."
)
s5["main"] = "brides garter belt"
s5["intro_limit"] = 1

PAGES = [s1, s2, s3, s4, s5]

def wc(t):
    return len([w for w in re.sub(r"<[^>]+>", "", t).split() if re.search(r"[A-Za-z0-9]", w)])

def strip_tags(t):
    return re.sub(r"<[^>]+>", "", t)

def norm(t):
    """撇号归一：valentine's -> valentines（Ubersuggest 归一词形）"""
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

# 指向对应页的内链锚文本白名单（30号halloween父页先例：下行链锚=目标页主词）
ANCHOR_OK = {
    "s1": {"valentines lingerie": P["valentines"]},
    "s2": {"bridal lingerie set": P["bridal"]},
    "s3": {"wedding night lingerie": P["wedding"]},
    "s4": {"honeymoon lingerie": P["honeymoon"]},
}
# 本页辅词白名单：辅词含他页归属词子串时（honeymoon lingerie set ⊃ lingerie set），
# 剔除辅词与白名单锚文本后再计数他页词
ANNEX = {"s1": ["honeymoon lingerie set"], "s4": ["Valentine's lingerie set"]}

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
    check("footer 词数>15" if pg["ids"] else "导购段 词数 55-80",
          (wc(pg["footer"]) > 15) if pg["ids"] else (55 <= wc(pg["footer"]) <= 80), f"= {wc(pg['footer'])}")

    # 他页归属词：锚位（title/meta/H2）=0；正文命中仅允许=指向对应页的锚文本/本页辅词内嵌
    body_clean = body_plain
    for ann in ANNEX.get(pg["key"], []):
        body_clean = body_clean.replace(ann, "").replace(ann.replace("'s ", "&#8217;s "), "")
    ok_whitelist = ANCHOR_OK.get(pg["key"], {})
    hrefs_txt = re.findall(r'<a href="([^"]+)">(.*?)</a>', pg["footer"])
    for wl_word, wl_url in ok_whitelist.items():
        for hu, at in hrefs_txt:
            if hu == wl_url:
                body_clean = body_clean.replace(strip_tags(at), "")
    for w in FOREIGN_ALL:
        w_n = norm(w)
        if w_n == main_n or w_n in main_n:
            continue  # 本页主词或其子串（brides garter belt 含 garter belt）——由主词词频断言覆盖
        in_anchor = any(w_n in norm(at) and ok_whitelist.get(w) == hu for hu, at in hrefs_txt)
        n_body = norm(body_clean).count(w_n)
        n_anchor_pos = anchors_n.count(w_n)
        if w in ok_whitelist:
            ok = in_anchor and (n_body == 0) and (n_anchor_pos == 0)
            check(f"他页词[{w}] 白名单锚1+锚位0", ok, f"body_clean={n_body} anchor={in_anchor}")
        else:
            check(f"他页词[{w}] 全页0", n_body == 0 and n_anchor_pos == 0, f"body_clean={n_body} pos={n_anchor_pos}")

    # 禁用裸词锚位上下文人工复核打印
    for bare in ["stockings", "pantyhose", "corset", "chemise"]:
        for m in re.finditer(rf"\b{bare}\b", anchors_n):
            s = max(0, m.start() - 30)
            print(f"    (裸词锚位[{bare}]): ...{anchors_n[s:m.end()+10]}...")

    # 组合死格红线：honeymoon stockings / date night outfit 等场景x袜组合
    for dead in ["honeymoon stockings", "date night outfit", "bridal stockings",
                 "valentines stockings", "wedding stockings", "anniversary stockings"]:
        check(f"死格[{dead}]=0", norm(body_plain).count(norm(dead)) == 0)

    # 年份禁写（valentines 页禁死年份）
    check("无硬年份", not re.search(r"\b20\d{2}\b", body_plain))

    zw = sum(t.count("​") for t in [pg["seo_title"], pg["meta"], body])
    check("U+200B=0", zw == 0)
    hrefs = re.findall(r'href="([^"]+)"', pg["footer"])
    check("href 全 https 全路径", all(h.startswith("https://rosetoys.org/") for h in hrefs), f"x{len(hrefs)}")
    # 链数 2-3
    check("出链数 2-3", 2 <= len(hrefs) <= 3, f"= {len(hrefs)}")
    # SKU 池实数声明匹配（intro/lead/P2 里的 ten/twelve 等数字）
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
# 与已上线页锚撞（41号已用锚清单）
USED = {"white": ["white stockings", "sexy plus size lingerie"], "thigh": ["thigh high stockings", "sheer thigh highs", "white thigh highs"],
        "plus": ["plus size lingerie"], "nightwear": ["our nightwear edit", "the full nightwear range", "nightwear collection"],
        "stockings": ["our full stockings range", "stockings collection"], "parent": ["the full women&#8217;s lingerie collection", "the complete women&#8217;s lingerie range", "women&#8217;s lingerie boutique"]}
for pg in PAGES:
    for hu, at in re.findall(r'<a href="([^"]+)">(.*?)</a>', pg["footer"]):
        for cat, anchors_used in USED.items():
            if cat in hu:
                hit = [u for u in anchors_used if norm(u) == norm(at)]
                check(f"锚[{strip_tags(at)}]->{hu} 不撞已用", not hit, str(hit))

# H2/intro开头/P2起手 五页互不同（句式轮换）
h2_firsts = [pg["h2"].split()[0] + " " + pg["h2"].split()[1] for pg in PAGES]
intro_firsts = [" ".join(strip_tags(pg["intro"]).split()[:3]) for pg in PAGES]
p2_firsts = [" ".join(strip_tags(pg["p2"]).split()[:3]) for pg in PAGES]
check("H2 起手五页互不同", len(set(h2_firsts)) == 5, str(h2_firsts))
check("intro 开头五页互不同", len(set(intro_firsts)) == 5, str(intro_firsts))
check("P2 起手五页互不同", len(set(p2_firsts)) == 5, str(p2_firsts))
BAN_H2 = ["choose your", "style ", "find your", "wear ", "look for", "pair ", "occasion"]
for pg in PAGES:
    h2n = norm(pg["h2"])
    hits = [b for b in BAN_H2 if b in h2n]
    check(f"H2避开已用句式族 {pg['key']}", not hits, str(hits))

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
