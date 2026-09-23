# -*- coding: utf-8 -*-
"""批次2首波三页hub：内容构造 + 本地自检（35号§5第4步）
页1 thigh high stockings / 页2 white stockings / 页3 plus size lingerie
产出 build/page1..3.json 供 curl 建 page 使用
"""
import json, re, os

BASE = "https://rosetoys.org"
P = {
    "thigh": f"{BASE}/thigh-high-stockings/",
    "white": f"{BASE}/white-stockings/",
    "plus": f"{BASE}/plus-size-lingerie/",
    "stockings": f"{BASE}/product-category/womens-lingerie/stockings/",
    "nightwear": f"{BASE}/product-category/womens-lingerie/nightwear/",
    "parent": f"{BASE}/product-category/womens-lingerie/",
}

def a(url, text):
    return f'<a href="{url}">{text}</a>'

# ============ 页1 Thigh High Stockings ============
pg1 = {}
pg1["title"] = "Thigh High Stockings"
pg1["slug"] = "thigh-high-stockings"
pg1["seo_title"] = "Thigh High Stockings & Lace Top Hosiery | RoseToys"
pg1["meta"] = ("Shop thigh high stockings in sheer lace and playful prints: "
               "stay-up classics, suspender sets, and pairs that finish any boudoir look at RoseToys.")
pg1["intro"] = (
    "If a night calls for legs that do the talking, thigh high stockings answer. "
    "This edit gathers our <strong>sheer thigh highs</strong> in one place: barely-there mesh, "
    "delicate lace tops that read romantic, and suspender sets built to be shown off. "
    "Playful cow prints bring the fun, classic solids stay versatile, and a true red turns up "
    "the heat when the mood calls for it. Each pair stretches to move with you and holds its "
    "shape through the night, no constant tugging required. Dress them up with heels, keep "
    "them casual under denim, or let them stand alone as the whole statement."
)
pg1["h2"] = "How to Wear Thigh High Stockings"
pg1["p2"] = (
    "Begin with the band: suspender pairs need straps adjusted so the lace sits flat against "
    "the thigh, while pull-on styles simply roll up and stay put. Check sizing against your "
    "thigh measurement (or the height-and-weight chart) rather than shoe size, since the fit "
    "lives at the leg, not the foot. Then pick your level of sheer — barely-there mesh for "
    "warm nights and bolder looks, denser weaves when you want more coverage and durability. "
    "To keep lace and mesh snag-free, hand wash in cool water, press out the moisture, and "
    "dry flat away from direct heat."
)
pg1["lead"] = ("Browse the pairs below and find your next favorite — from barely-there basics "
               "to the boldest prints in the drawer.")
pg1["ids"] = [22131, 22248, 22130, 22258, 22154, 21016, 22276]
pg1["limit"] = 0
pg1["footer"] = (
    f"For more legwear, start with {a(P['white'], 'white stockings')} for bridal-soft "
    f"neutrals, then explore {a(P['plus'], 'plus size lingerie')} in curvy-friendly cuts. "
    f"To see the whole shelf in one place, browse {a(P['stockings'], 'our full stockings range')} "
    f"or {a(P['parent'], 'the full women&#8217;s lingerie collection')}."
)
pg1["main"] = "thigh high stockings"

# ============ 页2 White Stockings ============
pg2 = {}
pg2["title"] = "White Stockings"
pg2["slug"] = "white-stockings"
pg2["seo_title"] = "White Stockings & Lace Thigh Highs | RoseToys"
pg2["meta"] = ("Shop white stockings in lace, prints, and thigh high styles. Soft bridal "
               "whites, playful cow prints, and stretchy pairs that finish any look at RoseToys.")
pg2["intro"] = (
    "Few shades set a mood like white stockings — cleaner than black, softer than red, and "
    "quietly romantic in a way color rarely manages. This edit keeps things light: delicate "
    "lace pairs, stretchy <strong>white thigh highs</strong>, and playful cow prints for nights "
    "that refuse to take themselves seriously. Each pair is chosen for a clean, true white "
    "that stays crisp under warm light. A shade this soft layers beautifully under slip "
    "dresses and structured sets, adding leg interest without stealing the show. Wear them "
    "for bridal weekends, anniversary nights, or any moment that calls for something innocent "
    "with a hint of an edge."
)
pg2["h2"] = "What to Look for in White Stockings"
pg2["p2"] = (
    "Let the fabric lead: fine lace reads delicate and romantic, while smooth stretch knits "
    "skim the leg and hold their shape. Prints bring the personality — a cow print in crisp "
    "white stays playful without tipping into costume territory. Pale hosiery shows every "
    "detail, so study the product photos for sheen and seam placement before you buy; a clean "
    "finish is what makes white look intentional rather than an afterthought. Care matters "
    "too: rinse in cool water with a gentle detergent and keep these pieces out of the dark "
    "laundry so the shade stays true."
)
pg2["lead"] = "Browse the white edit below — lace, prints, and thigh high pairs waiting for their moment."
pg2["ids"] = [22130, 22248, 22131, 22154, 22276]
pg2["limit"] = 0
pg2["footer"] = (
    f"Keep exploring: the {a(P['thigh'], 'thigh high stockings')} edit covers the full legwear "
    f"range, while {a(P['plus'], 'sexy plus size lingerie')} brings the same attitude in "
    f"curvy-friendly cuts. For slower nights, our {a(P['nightwear'], 'nightwear edit')} has "
    f"slips and gowns worth sinking into."
)
pg2["main"] = "white stockings"

# ============ 页3 Plus Size Lingerie ============
pg3 = {}
pg3["title"] = "Plus Size Lingerie"
pg3["slug"] = "plus-size-lingerie"
pg3["seo_title"] = "Plus Size Lingerie & Sultry Nightwear Styles | RoseToys"
pg3["meta"] = ("Shop plus size lingerie in curvy-friendly cuts across our nightwear: sultry "
               "slips, daring nightdresses, and more in sizes up to 5XL at RoseToys.")
pg3["intro"] = (
    "Some nights call for lingerie that fits like it was cut for you — and that is the whole "
    "point of this edit. Our plus size lingerie brings together curvy-friendly styles from "
    "across our nightwear, from sultry slips and daring nightdresses to bodysuits with real "
    "stretch. If <strong>sexy plus size lingerie</strong> is what you are after, expect soft "
    "mesh, forgiving lace, and cuts that celebrate rather than minimize your shape. Sizes "
    "here run from S to 5XL, and each piece is chosen to flatter curves, not fight them — "
    "because confidence is the best thing you can wear to bed."
)
pg3["h2"] = "How to Pair Plus Size Lingerie with Hosiery and Heels"
pg3["p2"] = (
    "Check the size chart before anything else: our pieces size by weight ranges as well as "
    "standard letters, so match your usual letter size first and confirm against the chart "
    "numbers. Lean on stretch — lace-and-spandex blends forgive a size either way, while "
    "structured pieces like the denim shorts want an exact fit. Then style for the moment: a "
    "long slip under a robe for slow evenings, a daring nightdress when the night is yours, "
    "sheer hosiery and heels when you want the full effect. Hand wash cool to keep the "
    "stretch alive."
)
pg3["lead"] = "Browse the curvy edit below — slips, nightdresses, and bodysuits in sizes that actually fit."
pg3["ids"] = [21633, 21685, 21768, 22884, 21542, 21493, 22960, 22708, 22507,
              22434, 21564, 20857, 20782, 20097, 19756, 19274, 19187, 19186, 19010]
pg3["limit"] = 12
pg3["footer"] = (
    f"Complete the look with {a(P['thigh'], 'sheer thigh highs')} or a pair of "
    f"{a(P['white'], 'white thigh highs')} from our legwear edit, and shop "
    f"{a(P['nightwear'], 'the full nightwear range')} for the rest of the silhouettes. "
    f"To see the whole boutique, browse {a(P['parent'], 'the complete women&#8217;s lingerie range')}."
)
pg3["main"] = "plus size lingerie"

PAGES = [pg1, pg2, pg3]

def wc(t):
    return len([w for w in re.sub(r"<[^>]+>", "", t).split() if re.search(r"[A-Za-z0-9]", w)])

def strip_tags(t):
    return re.sub(r"<[^>]+>", "", t)

FAIL = []
def check(label, cond, detail=""):
    mark = "PASS" if cond else "FAIL"
    print(f"  [{mark}] {label} {detail}")
    if not cond:
        FAIL.append(label)

# 他页归属词精确形（本页正文/锚位不得作自锚；正文与锚文本位逐页白名单化检查）
FOREIGN_ALL = ["lace stockings", "fishnet stockings", "sexy nightwear", "thigh high stockings",
               "garter belt", "lingerie set", "babydoll lingerie", "teddy lingerie",
               "corset lingerie", "chemise lingerie", "bodystocking", "white stockings",
               "honeymoon lingerie", "wedding night lingerie", "bridal lingerie set",
               "valentines lingerie", "brides garter belt", "plus size lingerie",
               "plus size stockings"]

for i, pg in enumerate(PAGES, 1):
    print(f"== 页{i} {pg['title']} ==")
    body = " ".join([pg["intro"], pg["h2"], pg["p2"], pg["lead"], strip_tags(pg["footer"])])
    body_plain = strip_tags(body)
    # 锚位串（title/meta/strong/H2）
    anchors = " | ".join([pg["seo_title"], pg["meta"], strip_tags(pg["h2"])])
    strongs = re.findall(r"<strong>(.*?)</strong>", pg["intro"])

    check("SEO title 字符数<=60", len(pg["seo_title"]) <= 60, f"= {len(pg['seo_title'])}")
    check("meta 字符数 120-155", 120 <= len(pg["meta"]) <= 155, f"= {len(pg['meta'])}")
    check(f"intro 词数 93-103", 93 <= wc(pg["intro"]) <= 103, f"= {wc(pg['intro'])}")
    check(f"P2 词数 88-95", 88 <= wc(pg["p2"]) <= 95, f"= {wc(pg['p2'])}")
    check("主词 title x1", pg["seo_title"].lower().count(pg["main"]) == 1)
    check("主词 meta x1", pg["meta"].lower().count(pg["main"]) == 1)
    n_intro = strip_tags(pg["intro"]).lower().count(pg["main"])
    # plus 页 intro=2（主词1+辅词strong内嵌1，nightwear先例）；其余=1
    limit_intro = 2 if pg["main"] == "plus size lingerie" else 1
    check(f"主词 intro x{limit_intro}", n_intro == limit_intro, f"= {n_intro}")
    check("主词 H2 x1", pg["h2"].lower().count(pg["main"]) == 1)
    check("主词 P2 x0", strip_tags(pg["p2"]).lower().count(pg["main"]) == 0)
    check("strong 恰1处", len(strongs) == 1, f"= {strongs}")
    # 他页词：本页自锚位零命中；正文命中仅允许=指向该页的锚文本
    own = {"thigh high stockings": "thigh", "white stockings": "white", "plus size lingerie": "plus"}[pg["main"]]
    for w in FOREIGN_ALL:
        if w == pg["main"]:
            continue
        # 主词互指的词（thigh high stockings/white stockings/plus size lingerie）允许出现在指向对应页的锚文本
        if w in ("thigh high stockings", "white stockings", "plus size lingerie"):
            in_anchor = any(w in at for at in re.findall(r"<a href=\"[^\"]+\">(.*?)</a>", pg["footer"]))
            in_body = body_plain.lower().count(w)
            ok = (in_body <= (1 if in_anchor else 0)) and (anchors.lower().count(w) == 0)
            check(f"他页词[{w}] 仅锚文本位<=1+锚位0", ok, f"body={in_body} anchor={in_anchor}")
        else:
            n_body = body_plain.lower().count(w)
            n_anchor = anchors.lower().count(w)
            check(f"他页词[{w}] 全页0", n_body == 0 and n_anchor == 0, f"body={n_body} anchorpos={n_anchor}")
    # 禁用裸词进锚位检查（组合词形内允许：thigh high stockings/white stockings/plus size lingerie 主词与辅词）
    for bare in ["stockings", "pantyhose", "corset", "chemise", "lingerie"]:
        for m in re.finditer(rf"\b{bare}\b", anchors, re.I):
            s = max(0, m.start() - 30)
            ctx = anchors[s:m.end() + 10]
            print(f"    (裸词锚位上下文[{bare}]): ...{ctx}...")
    # 零宽
    zw = sum(t.count("​") for t in [pg["seo_title"], pg["meta"], body])
    check("U+200B 零宽=0", zw == 0, f"= {zw}")
    # 内链 href 全路径
    hrefs = re.findall(r'href="([^"]+)"', pg["footer"])
    check("内链 href 全 https 全路径", all(h.startswith("https://rosetoys.org/") for h in hrefs), f"x{len(hrefs)}")
    print()

# 输出 build JSON
os.makedirs(os.path.join(os.path.dirname(__file__), "build"), exist_ok=True)
for i, pg in enumerate(PAGES, 1):
    content = (
        f"<!-- wp:paragraph -->\n<p>{pg['intro']}</p>\n<!-- /wp:paragraph -->\n\n"
        f"<!-- wp:heading -->\n<h2>{pg['h2']}</h2>\n<!-- /wp:heading -->\n\n"
        f"<!-- wp:paragraph -->\n<p>{pg['p2']}</p>\n<!-- /wp:paragraph -->\n\n"
        f"<!-- wp:paragraph -->\n<p>{pg['lead']}</p>\n<!-- /wp:paragraph -->\n\n"
        f"<!-- wp:shortcode -->\n[products ids=\"{','.join(map(str, pg['ids']))}\" columns=\"4\"{f' limit=\"{pg[chr(108)+chr(105)+chr(109)+chr(105)+chr(116)]}\"' if pg['limit'] else ''}]\n<!-- /wp:shortcode -->\n\n"
        f"<!-- wp:paragraph -->\n<p>{pg['footer']}</p>\n<!-- /wp:paragraph -->"
    )
    payload = {"title": pg["title"], "slug": pg["slug"], "status": "publish",
               "content": content}
    with open(os.path.join(os.path.dirname(__file__), "build", f"page{i}.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    meta_payload = {"objectType": "post", "objectID": "PGID", "title": pg["seo_title"], "description": pg["meta"]}
    with open(os.path.join(os.path.dirname(__file__), "build", f"page{i}_meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta_payload, f, ensure_ascii=False)
    print(f"page{i}.json 写出 | slug={pg['slug']} | ids={len(pg['ids'])} limit={pg['limit']}")

print()
print("FAIL 项:", FAIL if FAIL else "无，全过")
