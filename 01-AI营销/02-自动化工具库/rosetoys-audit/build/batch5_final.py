# -*- coding: utf-8 -*-
"""batch5_final.py — 矩阵收尾三 hub（corset / teddy lingerie / fishnet bodystocking）
构造 + 本地全量自检（门1 锚词门 + 规格）。全绿后才建页。
用法：
  python batch5_final.py build   # 生成 payload JSON（不建页）
  python batch5_final.py check   # 本地自检全量断言
"""
import json, re, sys, unicodedata

AP = ' &#8217; '  # 撇号实体参照（内容中用 &#8217;）

# ---------------- 三页内容定义 ----------------

CORSET = {
    "title": "Corset Lingerie",
    "slug": "corset-lingerie",
    "seo_title": "Corset Lingerie: Boning, Busk & Fit | RoseToys",
    "meta": "Corset lingerie in plain words: what boning counts for, what a busk does, and the two measurements that decide the fit &#8212; the structured guide at RoseToys.",
    "H2": "The Vocabulary of Corset Lingerie",
    "kw": "corset lingerie",
    "intro": "Structure, not stretch, is what gives corset lingerie its authority. Where a slip drapes and floats, a corset argues back: rigid panels hold the line at the waist, lift the bust, and turn an outfit into a statement. The category runs from a <strong>sexy corset</strong> top layered under a blazer to full laced pieces that carry a Valentine&#8217;s evening on their own &#8212; and one vocabulary, of bones and busks and modesty panels, covers them all. This page is that vocabulary: what each part does, what to measure, and how the structured silhouettes differ.",
    "p2": "Two measurements decide the fit: the natural waist at its narrowest point, and the underbust where the top edge lands. Size to the waist &#8212; lacing fine-tunes, rigid panels never stretch to forgive. Then read the bones: more of them means a smoother line, steel means business, plastic means everyday comfort. A front busk goes on without help; back lacing adjusts the tension to the evening. Between underbust and overbust the frame changes entirely, and the vocabulary above makes those differences legible at a glance.",
    "tail": "The structured story continues across the floor: the <a href=\"https://rosetoys.org/lingerie-sets/\">matching sets next door</a> keep top and brief in agreement rather than cinching anything, <a href=\"https://rosetoys.org/valentines-lingerie/\">the Valentine&#8217;s edit</a> dresses the same silhouette in red and ribbon, and the full <a href=\"https://rosetoys.org/product-category/womens-lingerie/\">women&#8217;s lingerie floor</a> holds every cut in between.",
    "ids": None,
}

TEDDY = {
    "title": "Teddy Lingerie",
    "slug": "teddy-lingerie",
    "seo_title": "Teddy Lingerie in Lace, Mesh & Patent Leather | RoseToys",
    "meta": "Teddy lingerie in one quick piece: twelve lace, mesh and patent leather styles with deep-V and cut-out fronts &#8212; one step, one finished look. RoseToys.",
    "H2": "The Case for Teddy Lingerie",
    "kw": "teddy lingerie",
    "intro": "Teddies solve lingerie&#8217;s oldest mixing problem: what to pair with what. A <strong>teddy lingerie</strong> piece is bra and brief in one continuous line &#8212; no waistband to match, no separate top to tuck, nothing riding up at midnight. The twelve here, pulled from the nightwear rails, run from a deep-V lace bodysuit through cut-out mesh to patent leather onesies, each one a finished look that goes on in a single step. The softer babydoll cut, the teddy&#8217;s nearest cousin, keeps its own page next door.",
    "p2": "The cut around the hips does the talking: high-cut legs lengthen the line, boy-short hems keep things casual, and a plunge at the front decides how the whole piece reads. Closure comes next &#8212; a snap base makes a bodysuit practical, pull-on styling stays smoothest under clothes. Fabric follows mood: lace for romance, wet-look patent for drama, stretch mesh for the hours after midnight. And because one piece does the work of two, sizing leans on the height-and-weight chart rather than the waist measurement alone.",
    "browse": "Browse the one-piece edit below &#8212; twelve styles chosen to work as one.",
    "ids": "21542,22959,21476,22505,22020,22933,22687,22536,21819,21610,19186,22884",
    "tail": "The comparisons write themselves: a proper <a href=\"https://rosetoys.org/teddy-vs-babydoll-vs-chemise/\">side-by-side comparison</a> settles the teddy-versus-babydoll question once and for all, the rest of <a href=\"https://rosetoys.org/product-category/womens-lingerie/nightwear/\">the nightwear lineup</a> holds the softer pieces these were culled from, and the floatier <a href=\"https://rosetoys.org/babydoll-lingerie/\">babydoll cousin</a> rounds out the trio.",
}

BSTK = {
    "title": "Fishnet Bodystocking",
    "slug": "fishnet-bodystocking",
    "seo_title": "Fishnet Bodystocking: Full-Body Net Looks | RoseToys",
    "meta": "Fishnet bodystocking picks, eleven of them: large-net jumpie cuts, fine mesh and fishnet-lace one-pieces, neck to ankle &#8212; full coverage in one move.",
    "H2": "A Fishnet Bodystocking Fits Like a Second Skin",
    "kw": "fishnet bodystocking",
    "intro": "One length of net, cut for the whole body. A <strong>fishnet bodystocking</strong> takes hosiery to its logical conclusion &#8212; legs, torso and shoulders in a single stretch of netting, one long uninterrupted line from neck to ankle with nothing to match, tuck or layer. The eleven here range from large-hole jumpie cuts to fine patterned mesh, fishnet-and-lace one-pieces and a drawstring-front number, each going on the way heavyweight tights do. When one piece of net covers everything, nothing else needs to cover anything at all.",
    "p2": "Go by stretch, not by size: one-piece netting follows height far more than waistline, so the height-and-weight chart is the honest starting point. Then pick the gauge &#8212; wide fishnet draws graphic lines across the body, fine mesh reads dressed-up even under clothes, lace trim softens the geometry. Open fronts serve purposes the bedroom supplies; closed fronts layer best beneath everything else. Colour is the quiet third decision: black is the classic of the genre, skin tones vanish against the body, and both read completely differently under the same evening lighting.",
    "browse": "Browse the full-body edit below &#8212; eleven pieces of net, chosen to cover in one move.",
    "ids": "21533,22213,22189,21499,21489,21485,21442,21398,21292,21518,21544",
    "tail": "The shorter versions of the same net live in <a href=\"https://rosetoys.org/product-category/womens-lingerie/fishnet-lingerie/\">the full fishnet range</a>, the fabric-backed cousin is the <a href=\"https://rosetoys.org/teddy-lingerie/\">teddy lingerie</a> edit, and the whole what-is-it question gets a longer answer in <a href=\"https://rosetoys.org/what-is-a-bodystocking/\">our full-body net primer</a>.",
}

PAGES = [CORSET, TEDDY, BSTK]

# ---------------- 门 1：他页归属词表（25 号归属表全部目标词，排除三本页主词）----------------
OTHER_WORDS = [
    "lace stockings", "fishnet stockings", "sexy nightwear", "thigh high stockings",
    "garter belt", "lingerie set", "babydoll lingerie", "chemise lingerie",
    "bodystocking", "white stockings", "honeymoon lingerie", "wedding night lingerie",
    "bridal lingerie set", "valentines lingerie", "brides garter belt",
    "plus size lingerie", "plus size stockings", "plus size fishnet",
    "plus size garter belt", "plus size lingerie set", "plus size bodystocking",
    "sexy catsuit", "crotchless pantyhose plus size",
]
DEAD = ["honeymoon stockings", "bridal stockings", "valentines stockings",
        "wedding stockings", "anniversary stockings", "date night outfit"]
SLOP = ["elevate", "unleash", "dive into", "look no further", "game-changer",
        "transformative", "unveil", "embark", "delve", "whether you're",
        "whether you’re", "in conclusion", "tapestry", "realm", "landscape",
        "testament", "journey"]

def txt(html_s):
    s = re.sub(r"<[^>]+>", " ", html_s)
    s = s.replace("&#8217;", "’").replace("&#8212;", "—").replace("&#039;", "'")
    return re.sub(r"\s+", " ", s).strip()

def decoded(s):
    """实体解码后的纯文本（含 meta/title 用）"""
    return txt(s)

def wc(s):
    return len(txt(s).split())

def render(page):
    parts = [f'<!-- wp:paragraph -->\n<p>{page["intro"]}</p>\n<!-- /wp:paragraph -->\n\n',
             f'<!-- wp:heading -->\n<h2>{page["H2"]}</h2>\n<!-- /wp:heading -->\n\n',
             f'<!-- wp:paragraph -->\n<p>{page["p2"]}</p>\n<!-- /wp:paragraph -->']
    if page.get("ids"):
        parts.append(f'\n<!-- wp:paragraph -->\n<p>{page["browse"]}</p>\n<!-- /wp:paragraph -->\n\n'
                     f'<!-- wp:shortcode -->\n[products ids="{page["ids"]}" columns="4"]\n<!-- /wp:shortcode -->')
    parts.append(f'\n<!-- wp:paragraph -->\n<p>{page["tail"]}</p>\n<!-- /wp:paragraph -->')
    return "".join(parts)

def check():
    ok = True
    def fail(msg):
        nonlocal ok; ok = False; print("  [FAIL]", msg)

    for pg in PAGES:
        print(f"\n=== {pg['slug']} ===")
        body = render(pg)
        plain = txt(body)
        kw = pg["kw"]
        # 长度：按实体解码后计（渲染口径）
        tl = len(decoded(pg["seo_title"]))
        ml = len(decoded(pg["meta"]))
        print(f"  title {tl} chars, meta {ml} chars, intro {wc(pg['intro'])}w, P2 {wc(pg['p2'])}w, tail {wc(pg['tail'])}w")
        if tl > 60: fail("title >60")
        if not (120 <= ml <= 155): fail(f"meta {ml} out of 120-155")
        for ln, name in [(pg["intro"], "intro"), (pg["p2"], "P2")]:
            w = wc(ln)
            if not (85 <= w <= 105): fail(f"{name} words {w} out of 85-105")
        if "| RoseToys" not in pg["seo_title"]: fail("title lacks | RoseToys")
        # 词频：主词 title/meta/intro×1/H2×1/P2×0
        cnt = {
            "title": decoded(pg["seo_title"]).lower().count(kw),
            "meta": decoded(pg["meta"]).lower().count(kw),
            "intro": txt(pg["intro"]).lower().count(kw),
            "H2": pg["H2"].lower().count(kw),
            "p2": txt(pg["p2"]).lower().count(kw),
            "tail": txt(pg["tail"]).lower().count(kw),
        }
        print(f"  kw freq: {cnt}")
        if cnt["title"] != 1: fail("title kw != 1")
        if cnt["meta"] != 1: fail("meta kw != 1")
        if cnt["intro"] != 1: fail("intro kw != 1")
        if cnt["H2"] != 1: fail("H2 kw != 1")
        if cnt["p2"] != 0: fail("P2 kw != 0")
        # 他页归属词：精确形=0（主词子串豁免——先移除主词再查，44 号辅词内嵌先例）
        zones = {"title": decoded(pg["seo_title"]), "meta": decoded(pg["meta"]), "body": plain}
        for w in OTHER_WORDS:
            for z, s in zones.items():
                s2 = re.sub(re.escape(kw), "#", s, flags=re.I)  # 剥主词（含其子串）
                if re.search(rf"(?i)\b{re.escape(w)}\b", s2):
                    fail(f"other-page word '{w}' in {z}")
        for w in DEAD:
            if re.search(rf"(?i)\b{re.escape(w)}\b", plain + pg['seo_title'] + pg['meta']):
                fail(f"dead word '{w}'")
        for w in SLOP:
            if w in (plain + pg['seo_title'] + pg['meta']).lower():
                fail(f"slop '{w}'")
        if re.search(r"\b20\d{2}\b", plain + pg["seo_title"] + pg["meta"]):
            fail("hard year")
        if "​" in body: fail("U+200B")
        # strong ≤1
        if body.count("<strong>") != 1: fail("strong count != 1")
        # 内链数与 href
        hrefs = re.findall(r'href="([^"]+)"', body)
        anchors = [txt(a) for a in re.findall(r'<a[^>]+>(.*?)</a>', body)]
        print(f"  links: {len(hrefs)}")
        for h, a in zip(hrefs, anchors):
            if not h.startswith("https://rosetoys.org/"): fail(f"non-absolute href {h}")
            if not (2 <= len(hrefs) <= 3): fail(f"link count {len(hrefs)} not 2-3")
            for w in OTHER_WORDS:
                if re.search(rf"(?i)\b{re.escape(w)}\b", a):
                    fail(f"anchor '{a}' contains other-page word '{w}'")
        # Gutenberg 块闭合
        if body.count("<!-- wp:paragraph -->") != body.count("<!-- /wp:paragraph -->"):
            fail("paragraph block unclosed")
        if body.count("<!-- wp:heading -->") != body.count("<!-- /wp:heading -->"):
            fail("heading block unclosed")
        if pg.get("ids"):
            ids = pg["ids"].split(",")
            if len(ids) != len(set(ids)): fail("dup ids")
            print(f"  shortcode ids: {len(ids)}")
    print("\n==>", "ALL GREEN" if ok else "HAS FAILURES")
    return ok

def build():
    import os
    for i, pg in enumerate(PAGES, 1):
        payload = {"title": pg["title"], "slug": pg["slug"], "status": "publish",
                   "content": render(pg)}
        with open(f"b5_p{i}.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        print(f"b5_p{i}.json written ({pg['slug']})")

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    if mode == "check":
        sys.exit(0 if check() else 1)
    elif mode == "build":
        build()
