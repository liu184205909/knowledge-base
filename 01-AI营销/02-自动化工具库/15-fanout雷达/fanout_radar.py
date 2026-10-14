# -*- coding: utf-8 -*-
"""
fanout_radar.py — Fan-out 雷达：AI 检索子查询 → 来源池 → 站内覆盖对照
知识真源：01-AI营销/03-SEO与GEO/15-Query-Fanout-子问题选题策略.md
架构分工：模型段（会话/skill）做展开规划与引用模拟；本脚本只做机械段（搜索执行/对照/留档/diff）

⚠️ 用途边界（防与搜索纪律混淆）：
  本工具 = AI 检索来源采集模拟（fan-out 子问题的真实搜索与站内覆盖对照）。
  禁用于竞对发现/SERP 意图实判 —— 那两件事必须走 Ubersuggest serp_analysis（CLAUDE.md 纪律）。

用法：
  python fanout_radar.py --site cushionmill.com --q "custom outdoor cushions" --q "how to measure cushions" --out runs/
  python fanout_radar.py --site cushionmill.com --queries queries.json --out runs/
  python fanout_radar.py --diff runs/2026-10-14_outdoor runs/2026-10-21_outdoor

queries.json 格式：
  {"topic": "outdoor replacement cushions", "queries": [
    {"q": "custom outdoor cushions replacement", "intent": "commercial"},
    {"q": "how to measure outdoor cushion", "intent": "informational"}
  ]}
"""
import argparse, json, io, os, sys, time, re
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API = "https://open.bigmodel.cn/api/paas/v4/web_search"
ENGINE = "search_std"
THROTTLE_S = 1.2  # 词间隔，防限流


def load_token(override=None):
    """token 真源 = ~/.claude.json 的 web-search-prime MCP 配置（不硬编码）"""
    if override:
        return override
    p = os.path.join(os.path.expanduser("~"), ".claude.json")
    cfg = json.load(io.open(p, encoding="utf-8"))
    auth = cfg["mcpServers"]["web-search-prime"]["headers"]["Authorization"]
    return auth.split(" ", 1)[1]


def search(token, query):
    body = json.dumps({"search_engine": ENGINE, "search_query": query,
                       "count": 20}).encode("utf-8")
    req = Request(API, data=body, headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"})
    with urlopen(req, timeout=40) as r:
        return json.loads(r.read().decode("utf-8"))


def norm_dom(u):
    try:
        u = u.strip().lower()
        if not u:
            return ""
        if "//" not in u:
            u = "http://" + u  # 裸域名兜底（urlparse 无 scheme 时 netloc 为空）
        h = urlparse(u).netloc
        return h[4:] if h.startswith("www.") else h
    except Exception:
        return ""


def run(args):
    token = load_token(args.token)
    # 组装查询清单
    if args.queries:
        pkg = json.load(io.open(args.queries, encoding="utf-8"))
        topic, items = pkg.get("topic", "adhoc"), pkg["queries"]
    else:
        topic, items = args.topic or "adhoc", [{"q": q, "intent": ""} for q in args.q or []]
    if not items:
        sys.exit("无查询：给 --q 或 --queries")
    site = norm_dom(args.site) if args.site else ""

    # 站内 URL 底册（可选：精确 path 级对照）
    urlset = set()
    if args.urls and os.path.exists(args.urls):
        for line in io.open(args.urls, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#"):
                urlset.add(line.rstrip("/"))

    outdir = os.path.join(args.out, "%s_%s" % (time.strftime("%Y-%m-%d"),
                                               re.sub(r"[^\w-]+", "_", topic)[:40]))
    rawdir = os.path.join(outdir, "raw")
    os.makedirs(rawdir, exist_ok=True)

    pool = {}       # url -> {title, domain, hits:[(query,rank)], publish}
    domains = {}    # domain -> count
    intent_map = {}
    print("== fanout_radar run: %s | %d queries | site=%s ==" % (topic, len(items), site or "（未指定）"))
    for i, it in enumerate(items):
        q = it["q"]
        try:
            d = search(token, q)
        except HTTPError as e:
            print("  [%d] HTTP %s：%s（跳过）" % (i + 1, e.code, q)); continue
        rs = d.get("search_result", [])
        # search_intent 为 list[{intent,keywords,...}]：keywords=搜索引擎侧查询扩展（fan-out 信号，留 JSON）；
        # md 只取 intent 枚举
        si = d.get("search_intent") or []
        intent_map[q] = si  # 完整原始结构（含 keywords=搜索引擎侧查询扩展）留 sources.json
        io.open(os.path.join(rawdir, "q%02d.json" % (i + 1)), "w", encoding="utf-8") \
          .write(json.dumps(d, ensure_ascii=False, indent=1))
        for rank, r in enumerate(rs, 1):
            u = (r.get("link") or "").rstrip("/")
            dom = norm_dom(u) or r.get("media", "")
            if not u:
                continue
            pool.setdefault(u, {"title": r.get("title", ""), "domain": dom,
                                "hits": [], "publish": r.get("publish_date", "")})
            pool[u]["hits"].append({"q": q, "rank": rank})
            domains[dom] = domains.get(dom, 0) + 1
        print("  [%d/%d] %-55s -> %2d 来源" % (i + 1, len(items), q[:55], len(rs)))
        if i < len(items) - 1:
            time.sleep(THROTTLE_S)

    # 站内在位
    mine = {u: v for u, v in pool.items() if site and v["domain"] == site}

    json.dump({"topic": topic, "site": site, "queries": items,
               "intents": intent_map, "pool": pool,
               "domains": dict(sorted(domains.items(), key=lambda x: -x[1]))},
              io.open(os.path.join(outdir, "sources.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    md = ["# fanout 对照报告：%s" % topic,
          "- 日期：%s｜子查询：%d｜来源池：%d URL / %d 域名｜我方在位：%d" %
          (time.strftime("%Y-%m-%d"), len(items), len(pool), len(domains), len(mine)),
          "", "## 一、子查询与我方在位", "",
          "| # | 子查询 | 意图 | 来源数 | 我方在位 |", "|---|--------|------|--------|----------|"]
    for i, it in enumerate(items):
        q = it["q"]
        n = sum(1 for u, v in pool.items() if any(h["q"] == q for h in v["hits"]))
        pos = ", ".join("#%d" % h["rank"] for u, v in mine.items() for h in v["hits"] if h["q"] == q) or "—"
        md.append("| %d | %s | %s | %d | %s |" % (i + 1, q, (intent_map.get(q) or [{}])[0].get("intent", "") if isinstance(intent_map.get(q), list) else it.get("intent", ""), n, pos))
    md += ["", "## 二、来源域名分布（Top 25）", "", "| 域名 | 来源数 |", "|------|--------|"]
    for dom, c in sorted(domains.items(), key=lambda x: -x[1])[:25]:
        flag = " ⭐我方" if dom == site else ""
        md.append("| %s%s | %d |" % (dom, flag, c))
    md += ["", "## 三、我方被命中的 URL 明细", ""]
    if mine:
        for u, v in mine.items():
            md.append("- %s\n  - %s\n  - 命中：%s" % (u, v["title"], ", ".join("%s(#%d)" % (h["q"], h["rank"]) for h in v["hits"])))
    else:
        md.append("（零命中——该主题子查询的来源池中无我方页面）")
    md += ["", "## 四、未覆盖子问题（模型段解读用）", "",
           "来源池中高频出现、我站无对应页面的主题/实体，由会话模型段基于 sources.json 分析后填入 15 号选题。"]
    io.open(os.path.join(outdir, "coverage.md"), "w", encoding="utf-8").write("\n".join(md))
    print("== 完成：%s ==" % os.path.join(outdir, "coverage.md"))


def diff(args):
    a = json.load(io.open(os.path.join(args.a, "sources.json"), encoding="utf-8"))
    b = json.load(io.open(os.path.join(args.b, "sources.json"), encoding="utf-8"))
    ua, ub = set(a["pool"]), set(b["pool"])
    print("新增来源 %d｜消失 %d｜留存 %d" % (len(ub - ua), len(ua - ub), len(ua & ub)))
    da = {v["domain"] for v in a["pool"].values()}
    db = {v["domain"] for v in b["pool"].values()}
    print("新增域名:", ", ".join(sorted(db - da)) or "—")
    print("消失域名:", ", ".join(sorted(da - db)) or "—")
    sa = {v["domain"] for v in a["pool"].values() if v["domain"] == a.get("site")}
    sb = {v["domain"] for v in b["pool"].values() if v["domain"] == b.get("site")}
    print("我方在位: %s -> %s" % ("有" if sa else "无", "有" if sb else "无"))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--site"); ap.add_argument("--q", action="append")
    ap.add_argument("--queries"); ap.add_argument("--urls"); ap.add_argument("--out", default="runs")
    ap.add_argument("--topic"); ap.add_argument("--token")
    ap.add_argument("--diff", nargs=2, metavar=("RUN_A", "RUN_B"))
    args = ap.parse_args()
    if args.diff:
        diff(args)
    else:
        run(args)
