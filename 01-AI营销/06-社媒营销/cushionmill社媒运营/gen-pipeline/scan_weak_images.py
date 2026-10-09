# -*- coding: utf-8 -*-
"""
CushionMill 站内配图盘点与缺图扫描器（生图长期管线第一环）
=============================================================
只读 WP REST API，盘点 posts/pages/products 三类内容对象的配图质量，
识别 弱图/泛义图/缺场景图/复用图 页面，输出按优先级排序的生图需求清单。

用法（参数化日期，可重复运行）:
    python scan_weak_images.py                      # 默认今天
    python scan_weak_images.py --date 2026-10-09
    python scan_weak_images.py --site cushionmill.com --port 443

输出（本脚本同目录）:
    weak-images-data-{date}.json    # 全量结构化数据
    weak-images-report-{date}.md    # 人读报告（统计面板+优先级清单）

图片分类口径（文件名+URL 启发式）:
    generic_ai       cm-前缀+数字尾（moleapi 批量通用图）或任意 6位以上纯数字尾
    generic_material fabric/swatch/tape/texture/material/sample 等材质块/卷尺/面料卡
    exclusive        其余（含具体产品/场景语义，视为专属场景图）
页面级优先级:
    P0 产品页无featured / 泛义图为主 / 非swatch内文图<15
    P1 文章/页面 featured缺失 或 内文图<2
    P2 产品页轻度泛义（非P0但非专属图占比>30%）
    P3 复用图超标（页内复用图>=3张 或 占比>50%）
"""
import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
import urllib.error
from collections import Counter, defaultdict
from datetime import date as _date

# ---------------------------------------------------------------- 配置
UA = "curl/8.0.0"
CRED_FILE = r"C:\Users\Dylan\.env"
POOL_FILE_DEFAULT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 "..", "pin-素材库.json")
TYPES = [("posts", "post"), ("pages", "page"), ("product", "product")]
FIELDS = "id,slug,link,type,title,featured_media,content"

# WooCommerce/系统页 slug：不参与生图需求清单
SYSTEM_SLUGS = {"cart", "checkout", "my-account", "shop", "blog", "home-base",
                "privacy-policy", "terms-conditions"}

IMG_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
GENERIC_MATERIAL_WORDS = ("fabric", "swatch", "tape", "texture", "material",
                          "sample", "measur", "color-card", "colorcard", "palette")

# slug/标题关键词 -> 生图场景词建议
SCENE_MAP = [
    ("built-to-your-spec", "custom cushion workshop: measuring tape, fabric rolls, cut foam, sewing bench"),
    ("custom-cushion", "custom cushion workshop: measuring tape, fabric rolls, cut foam, sewing bench"),
    ("wicker", "wicker/rattan patio conversation set, weathered teak frame, outdoor"),
    ("rattan", "wicker/rattan patio conversation set, outdoor"),
    ("bench", "outdoor garden bench with tailored bench cushion, morning light"),
    ("window", "bay window seat with custom cushions, cozy reading nook"),
    ("deep-seat", "deep seating patio sofa with thick cushions, sunset"),
    ("deep-seating", "deep seating patio sofa with thick cushions, sunset"),
    ("deep_seat", "deep seating patio sofa with thick cushions, sunset"),
    ("lounge", "outdoor chaise lounge by the pool with striped cushion"),
    ("chaise", "outdoor chaise lounge by the pool with striped cushion"),
    ("swing", "porch swing with tufted cushion, farmhouse porch"),
    ("hammock", "hanging chair with cushion on balcony"),
    ("dining", "patio dining set, six chairs with custom seat cushions"),
    ("chair", "dining chair custom seat cushions, bright kitchen"),
    ("bar-stool", "kitchen bar stools with round custom cushions"),
    ("barstool", "kitchen bar stools with round custom cushions"),
    ("stool", "bar stool round custom cushions, kitchen island"),
    ("sofa", "living room sofa with custom-fit cushions, natural light"),
    ("couch", "living room sofa with custom-fit cushions, natural light"),
    ("cushion-floor", "floor cushion seating corner, living room"),
    ("floor", "floor cushion seating corner, living room"),
    ("daybed", "daybed with tailored cushion and throw pillows"),
    ("mattress", "custom mattress on daybed / RV berth, neutral bedding"),
    ("rv", "RV camper dinette with custom cushions, interior daylight"),
    ("camper", "RV camper dinette with custom cushions, interior daylight"),
    ("boat", "boat cockpit seats with marine cushions, harbor"),
    ("marine", "boat cockpit seats with marine cushions, harbor"),
    ("patio", "backyard patio lounge set with custom cushions, golden hour"),
    ("outdoor", "backyard patio lounge set with custom cushions, golden hour"),
    ("indoor", "living room custom cushions on upholstered chairs"),
    ("replacement", "worn patio furniture being refreshed with new replacement cushions"),
    ("box", "window box seat cushion, reading corner"),
    ("rocking", "rocking chair with custom cushion on porch"),
    ("recliner", "recliner with replacement cushion set"),
    ("pillow", "throw pillow arrangement on outdoor sofa"),
    ("upholster", "upholstery workshop bench with fabric rolls"),
    ("foam", "cross-section of high-density cushion foam under fabric"),
    ("sunbrella", "outdoor cushions in Sunbrella-style performance fabric, poolside"),
    ("waterproof", "rain beading on waterproof outdoor cushion, close-up"),
]

def log(msg):
    print(msg, flush=True)

# ---------------------------------------------------------------- WP 访问
def load_env():
    user, pwd = None, None
    with open(CRED_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("WP_USER_CUSHIONMILL="):
                user = line.split("=", 1)[1]
            elif line.startswith("WP_APP_PASSWORD_CUSHIONMILL="):
                pwd = line.split("=", 1)[1]
    if not (user and pwd):
        sys.exit("FATAL: .env 中未找到 WP_USER_CUSHIONMILL / WP_APP_PASSWORD_CUSHIONMILL")
    return user, pwd

def api_get(base, path, params, auth):
    q = urllib.parse.urlencode(params)
    url = f"{base}/wp-json/wp/v2/{path}?{q}"
    user, pwd = auth
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Authorization": "Basic " + base64.b64encode(f"{user}:{pwd}".encode()).decode(),
    })
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8")), int(r.headers.get("X-WP-TotalPages", "1"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 3:
                time.sleep(5 * (attempt + 1)); continue
            raise
        except Exception:
            if attempt < 3:
                time.sleep(3); continue
            raise

def fetch_all(base, path, auth):
    out, page = [], 1
    while True:
        items, total_pages = api_get(base, path, {
            "status": "publish", "per_page": 100, "page": page, "_fields": FIELDS,
        }, auth)
        out.extend(items)
        log(f"  {path} page {page}/{total_pages} (+{len(items)})")
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.6)
    return out

def fetch_media_map(base, media_ids, auth):
    """批量取 featured_media id -> source_url"""
    mp, ids = {}, sorted(media_ids)
    for i in range(0, len(ids), 100):
        chunk = ids[i:i + 100]
        items, _ = api_get(base, "media", {
            "include": ",".join(map(str, chunk)), "per_page": 100,
            "_fields": "id,source_url",
        }, auth)
        for m in items:
            mp[m["id"]] = m.get("source_url", "")
        time.sleep(0.6)
    return mp

# ---------------------------------------------------------------- 图片分类
def basename(url):
    if not url:
        return ""
    path = urllib.parse.urlparse(url).path
    return os.path.basename(path).lower()

def classify(url):
    """返回 exclusive / generic_ai / generic_material / empty"""
    name = basename(url)
    if not name or name.startswith("data:"):
        return "empty"
    # moleapi 批量生成图：cm- 前缀 + 长数字尾
    if name.startswith("cm-") and re.search(r"\d{4,}", name):
        return "generic_ai"
    # 通用兜底：任意 6 位以上数字尾（生成图常见特征）
    if re.search(r"\d{6,}(?=\.[a-z]+$)", name):
        return "generic_ai"
    stem = re.sub(r"\.[a-z0-9]+$", "", name)
    if any(w in stem for w in GENERIC_MATERIAL_WORDS):
        return "generic_material"
    return "exclusive"

def scene_hint(slug, title):
    text = (slug or "") + " " + (title or "").lower()
    for kw, scene in SCENE_MAP:
        if kw in text:
            return scene
    base = (slug or "custom cushion").replace("-", " ")
    return f"custom cushions scene for: {base} — realistic photo, natural light"

# ---------------------------------------------------------------- 主逻辑
def scan(base, date_str):
    auth = load_env()
    objects = []
    for path, typ in TYPES:
        log(f"[fetch] {path} ...")
        items = fetch_all(base, path, auth)
        for it in items:
            objects.append({
                "id": it["id"], "slug": it.get("slug", ""),
                "link": it.get("link", ""), "type": typ,
                "title": (it.get("title") or {}).get("rendered", ""),
                "featured_media": it.get("featured_media", 0),
                "content_html": (it.get("content") or {}).get("rendered", ""),
            })
    log(f"[fetch] 共 {len(objects)} 个 publish 对象")

    media_ids = {o["featured_media"] for o in objects if o.get("featured_media")}
    log(f"[fetch] featured media ids: {len(media_ids)}，批量取 source_url ...")
    media_map = fetch_media_map(base, media_ids, auth)

    # ---- 素材池
    pool_set = set()
    pool_file = os.path.abspath(POOL_FILE_DEFAULT)
    if os.path.isfile(pool_file):
        try:
            with open(pool_file, "r", encoding="utf-8") as f:
                for it in json.load(f):
                    if it.get("img"):
                        pool_set.add(it["img"].split("?")[0])
            log(f"[pool] pin-素材库.json 载入 {len(pool_set)} 张池图")
        except Exception as e:
            log(f"[pool] 素材库读取失败（忽略）: {e}")
    else:
        log(f"[pool] 未找到素材库 {pool_file}，跳过交叉")

    # ---- 每对象解析图片
    url_refs = Counter()   # url -> 引用它的对象数
    parsed = []
    for o in objects:
        featured_url = media_map.get(o["featured_media"], "")
        content_urls = []
        for src in IMG_RE.findall(o["content_html"]):
            if src.startswith("data:"):
                continue
            content_urls.append(src)
        content_urls = list(dict.fromkeys(content_urls))  # 去重保序
        all_urls = ([featured_url] if featured_url else []) + content_urls
        all_unique = list(dict.fromkeys(all_urls))
        for u in all_unique:
            url_refs[u] += 1
        cats = {u: classify(u) for u in all_unique}
        parsed.append({
            **{k: o[k] for k in ("id", "slug", "link", "type", "title")},
            "featured_url": featured_url,
            "featured_class": cats.get(featured_url, "missing"),
            "content_imgs": content_urls,
            "n_content": len(content_urls),
            "n_total": len(all_unique),
            "classes": cats,
            "all_urls": all_unique,
        })

    # ---- 二次标注：复用 / 素材池
    for p in parsed:
        p["reused"] = [u for u in p["all_urls"] if url_refs[u] >= 2]
        p["n_reused"] = len(p["reused"])
        c = Counter(p["classes"].values())
        p["cnt"] = {
            "exclusive": c.get("exclusive", 0),
            "generic_ai": c.get("generic_ai", 0),
            "generic_material": c.get("generic_material", 0),
        }
        p["n_generic"] = p["cnt"]["generic_ai"] + p["cnt"]["generic_material"]
        p["generic_ratio"] = round(p["n_generic"] / p["n_total"], 3) if p["n_total"] else 0.0
        # 非swatch内容图（产品页口径）：排除材质类
        p["n_non_swatch_content"] = sum(
            1 for u in p["content_imgs"] if p["classes"][u] != "generic_material")
        p["in_pool"] = sum(1 for u in p["all_urls"] if u.split("?")[0] in pool_set)

    # ---- 优先级判定
    def priority(p):
        if p["slug"] in SYSTEM_SLUGS:
            return ""
        if p["type"] == "product":
            no_fig = (not p["featured_url"]) or p["featured_class"] in ("missing",)
            if no_fig or p["generic_ratio"] > 0.5 or p["n_non_swatch_content"] < 15:
                return "P0"
            if p["generic_ratio"] > 0.3:
                return "P2"
            return ""
        else:  # post / page
            if (not p["featured_url"]) or p["n_content"] < 2:
                return "P1"
            return ""
    for p in parsed:
        p["priority"] = priority(p)
        if not p["priority"] and (p["n_reused"] >= 3 or
                                  (p["n_total"] and p["n_reused"] / p["n_total"] > 0.5)):
            p["priority"] = "P3"

    # ---- 统计面板
    def panel(typ):
        sub = [p for p in parsed if p["type"] == typ]
        if not sub:
            return {"total": 0}
        return {
            "total": len(sub),
            "no_featured": sum(1 for p in sub if not p["featured_url"]),
            "featured_ok_pct": round(100 * sum(1 for p in sub if p["featured_url"]) / len(sub), 1),
            "exclusive_dominant": sum(1 for p in sub if p["cnt"]["exclusive"] > 0 and
                                      p["cnt"]["exclusive"] >= p["n_generic"]),
            "generic_dominant": sum(1 for p in sub if p["n_total"] and
                                    p["generic_ratio"] > 0.5),
            "thin_content_imgs": sum(1 for p in sub if p["n_content"] < 2),
            "has_reused": sum(1 for p in sub if p["n_reused"] >= 1),
            "in_pool_pages": sum(1 for p in sub if p["in_pool"] > 0),
            "img_class_share": {
                "exclusive": sum(p["cnt"]["exclusive"] for p in sub),
                "generic_ai": sum(p["cnt"]["generic_ai"] for p in sub),
                "generic_material": sum(p["cnt"]["generic_material"] for p in sub),
            },
        }
    stats = {t: panel(t) for _, t in TYPES}
    unique_urls = set(url_refs)
    uniq_classes = Counter(classify(u) for u in unique_urls)
    stats["global"] = {
        "objects": len(parsed),
        "unique_imgs": len(unique_urls),
        "unique_exclusive": uniq_classes.get("exclusive", 0),
        "unique_generic_ai": uniq_classes.get("generic_ai", 0),
        "unique_generic_material": uniq_classes.get("generic_material", 0),
        "reused_urls_ge2": sum(1 for u, n in url_refs.items() if n >= 2),
        "pool_urls": len(pool_set),
        "priority_counts": Counter(p["priority"] for p in parsed if p["priority"]),
    }

    # ---- 生图需求清单（排序：P0>P1>P2>P3；同级按缺口严重度）
    sev = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
    def p0_severity(p):
        s = 0
        if not p["featured_url"]: s += 100
        s += int(p["generic_ratio"] * 50)
        s += max(0, 15 - p["n_non_swatch_content"])
        return s
    needs = [p for p in parsed if p["priority"]]
    needs.sort(key=lambda p: (sev[p["priority"]],
                              -p0_severity(p) if p["priority"] == "P0" else -(p["n_total"] - p["n_content"] + 1),
                              p["slug"]))
    for p in parsed:
        p["status_desc"] = status_desc(p)
    for p in needs:
        p["scene_suggest"] = scene_hint(p["slug"], p["title"])

    return parsed, stats, needs, url_refs

def status_desc(p):
    bits = []
    if not p["featured_url"]:
        bits.append("无featured图")
    else:
        cls = {"exclusive": "专属", "generic_ai": "AI泛义", "generic_material": "材质图"}.get(
            p["featured_class"], p["featured_class"])
        bits.append(f"featured={cls}")
    bits.append(f"内文图{p['n_content']}(非swatch {p['n_non_swatch_content']})")
    bits.append(f"专属{p['cnt']['exclusive']}/泛义{p['n_generic']}")
    if p["n_reused"]:
        bits.append(f"复用图{p['n_reused']}")
    if p["in_pool"]:
        bits.append(f"入素材池{p['in_pool']}")
    return "；".join(bits)

# ---------------------------------------------------------------- 输出
def write_outputs(parsed, stats, needs, date_str, out_dir):
    data_path = os.path.join(out_dir, f"weak-images-data-{date_str}.json")
    report_path = os.path.join(out_dir, f"weak-images-report-{date_str}.md")

    with open(data_path, "w", encoding="utf-8") as f:
        json.dump({
            "date": date_str,
            "stats": {k: (dict(v) if not isinstance(v, dict) else
                          {kk: (dict(vv) if isinstance(vv, Counter) else vv) for kk, vv in v.items()})
                      for k, v in stats.items()},
            "needs": [{k: p[k] for k in ("slug", "link", "type", "priority", "status_desc",
                                          "scene_suggest", "n_total", "n_content", "generic_ratio",
                                          "featured_class", "in_pool")} for p in needs],
            "objects": [{k: p[k] for k in ("slug", "link", "type", "status_desc", "priority",
                                           "all_urls", "classes")} for p in parsed],
        }, f, ensure_ascii=False, indent=1)
    log(f"[out] JSON -> {data_path}")

    g = stats["global"]
    L = []
    L.append(f"# CushionMill 站内配图盘点与缺图报告 {date_str}")
    L.append("")
    L.append("> 由 `gen-pipeline/scan_weak_images.py` 生成（只读 WP REST；可参数化日期重复运行）。")
    L.append("> 口径：泛义图=cm-前缀数字尾(moleapi通用图)/材质卡卷尺类；复用图=同一URL被>=2对象引用。")
    L.append("")
    L.append("## 一、统计面板")
    L.append("")
    L.append(f"- 内容对象：{g['objects']}（post/page/product 见下表）")
    L.append(f"- 全站唯一配图：{g['unique_imgs']} 张 = 专属 {g['unique_exclusive']}（{pct(g['unique_exclusive'], g['unique_imgs'])}）"
             f" + AI泛义 {g['unique_generic_ai']}（{pct(g['unique_generic_ai'], g['unique_imgs'])}）"
             f" + 材质/工具 {g['unique_generic_material']}")
    L.append(f"- 被>=2对象复用的图：{g['reused_urls_ge2']} 张")
    L.append(f"- 社媒素材池规模：{g['pool_urls']} 张（pin-素材库.json）")
    L.append("")
    L.append("| 类型 | 总数 | 无featured | featured率 | 专属为主页 | 泛义为主页 | 内文图<2 | 含复用图页 | 配图已入池页 |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    label = {"post": "posts", "page": "pages", "product": "products"}
    for t in ("post", "page", "product"):
        s = stats[t]
        if not s.get("total"):
            continue
        L.append(f"| {label[t]} | {s['total']} | {s['no_featured']} | {s['featured_ok_pct']}% | "
                 f"{s['exclusive_dominant']} | {s['generic_dominant']} | {s['thin_content_imgs']} | "
                 f"{s['has_reused']} | {s['in_pool_pages']} |")
    L.append("")
    pc = g["priority_counts"]
    L.append(f"**缺图分层**：P0 产品页 {pc.get('P0',0)} · P1 文章/页面 {pc.get('P1',0)} · "
             f"P2 轻度泛义 {pc.get('P2',0)} · P3 复用超标 {pc.get('P3',0)}；合计 {sum(pc.values())} 页")
    L.append("")
    L.append("## 二、生图需求清单（按优先级）")
    L.append("")
    order = ["P0", "P1", "P2", "P3"]
    titles = {
        "P0": "P0 — 产品页无图/泛义为主（转化直接损失）",
        "P1": "P1 — 文章内文图<2 / 无featured（阅读体验与图片搜索损失）",
        "P2": "P2 — 产品页轻度泛义（专属图占比不足）",
        "P3": "P3 — 复用图超标（图片多样性不足）",
    }
    caps = {"P0": None, "P1": 40, "P2": 40, "P3": 40}
    for prio in order:
        sub = [p for p in needs if p["priority"] == prio]
        if not sub:
            continue
        L.append(f"### {titles[prio]}（{len(sub)}）")
        L.append("")
        cap = caps[prio]
        shown = sub[:cap] if cap else sub
        L.append("| # | slug | 状况 | 建议生图场景 |")
        L.append("|---|---|---|---|")
        for i, p in enumerate(shown, 1):
            L.append(f"| {i} | [{p['slug']}]({p['link']}) | {p['status_desc']} | {p['scene_suggest']} |")
        if cap and len(sub) > cap:
            L.append("")
            L.append(f"*（仅列前 {cap} 条，全量见 JSON：{os.path.basename(data_path)}）*")
        L.append("")
    L.append("## 三、用法备注")
    L.append("")
    L.append("- 重跑：`python scan_weak_images.py --date <YYYY-MM-DD>`（自动覆盖同名输出）")
    L.append("- 生图后回写：替换对应 slug 的 featured/内文图后重跑本扫描器，专属图率应上升")
    L.append("- 素材池联动：`in_pool` 表示该页配图已有部分进 pin-素材库.json，可直接复用为社媒素材")
    L.append("")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    log(f"[out] MD   -> {report_path}")

def pct(a, b):
    return f"{round(100*a/b,1)}%" if b else "0%"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=_date.today().strftime("%Y-%m-%d"))
    ap.add_argument("--site", default="cushionmill.com")
    ap.add_argument("--port", type=int, default=443)
    args = ap.parse_args()
    base = f"https://{args.site}" + (f":{args.port}" if args.port != 443 else "")
    out_dir = os.path.dirname(os.path.abspath(__file__))
    parsed, stats, needs, url_refs = scan(base, args.date)
    write_outputs(parsed, stats, needs, args.date, out_dir)
    log("[done]")

if __name__ == "__main__":
    main()
