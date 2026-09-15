#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""sitemap 定位器 —— 竞品分析 SOP v4.1 §1 步骤 2-3 的工具化

解决: robots.txt 没有 Sitemap 声明 / 声明不全时的降级定位, 以及全量递归提取。

降级链:
  ① robots.txt 全部 Sitemap: 声明
  ② 无声明 -> 常见路径探测 (/sitemap.xml /sitemap_index.xml /wp-sitemap.xml ...)
  ③ 全失败 -> discovered_via="none", 竞研降级处理 (仅目录推断+抽样)

用法:
  python sitemap_locator.py example.com
  python sitemap_locator.py example.com --out "D:/xx/竞品研究/站点sitemap数据"
  python sitemap_locator.py example.com --probe-only   # 只定位不递归提取

输出: {domain}_sitemap_raw.json
  { domain, discovered_via: robots|probe|none, sitemap_sources: [...],
    page_urls: [...],                      # 已按口径清洗(去重/排资产/排参数)
    stats: { total_loc, pages, excluded:{params,asset}, lang_prefix } }

口径与 SOP §1 步骤 3 一致: 去重后 HTML 页面 URL; 排除 image:loc/视频/新闻/附件/参数 URL;
多语言按独立页统计并标语言维度。
"""
import argparse
import gzip
import html
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

PROBE_PATHS = [
    "/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml",
    "/wp-sitemap.xml", "/sitemap/sitemap.xml", "/sitemap1.xml",
    "/sitemap_index_1.xml", "/sitemap-map-index.xml", "/sitemap.xml.gz",
    "/index.php?sitemap=index",
]

EXCLUDE_EXT = (".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
               ".mp4", ".zip", ".gz", ".css", ".js", ".doc", ".docx", ".xls", ".xlsx")

MAX_DEPTH = 10          # sitemap index 递归层数上限
SLEEP = 0.5             # 站内请求间隔(秒), 防 429
CROSS_DOMAIN = "record" # 跨域 sitemap: 记录进 sources 但不展开


def fetch(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA,
                                               "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
        if r.headers.get("Content-Encoding") == "gzip" or url.endswith(".gz"):
            try:
                data = gzip.decompress(data)
            except OSError:
                pass
        return data.decode("utf-8", errors="replace")


def parse_robots(domain):
    """返回 robots.txt 里全部 Sitemap: 声明(可能 0 条或多条)."""
    try:
        txt = fetch("https://" + domain + "/robots.txt", timeout=15)
    except Exception:
        return []
    return [u for u in re.findall(r"(?im)^\s*sitemap\s*:\s*(\S+)", txt)]


def looks_like_sitemap(body):
    head = body[:5000]
    return "<urlset" in head or "<sitemapindex" in head


def is_index(body):
    return "<sitemapindex" in body[:5000]


def extract_locs(body):
    # 精确匹配 <loc>, 不会误吃 <image:loc>; 兼容 CDATA; 反转义 XML 实体(&amp; 等)
    return [html.unescape(u) for u in
            re.findall(r"<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*</loc>", body)]


def netloc(url):
    return urllib.parse.urlsplit(url).netloc.lower()


def same_site(url, base_domain):
    """同主域判定: 裸域或其子域(www./cdn. 等)都算同域, 防止 www 前缀导致误判跨域;
    注意后缀必须带点边界, 否则 neonsigns.com.au 会被 neonsigns.com 误匹配."""
    nl = netloc(url)
    base = netloc("https://" + base_domain)
    return nl == base or nl.endswith("." + base)


def crawl(sitemap_url, base_domain, seen, sources, locs_out, depth=0):
    """递归展开 sitemap index; 同域展开, 跨域只记录."""
    key = sitemap_url.split("#")[0]
    if depth > MAX_DEPTH or key in seen:
        return
    seen.add(key)
    try:
        body = fetch(sitemap_url)
    except Exception as e:
        sources.append({"url": sitemap_url, "status": "fetch-error: %s" % e})
        return
    if not looks_like_sitemap(body):
        sources.append({"url": sitemap_url, "status": "not-sitemap"})
        return
    locs = extract_locs(body)
    idx = is_index(body)
    sources.append({"url": sitemap_url, "status": "ok",
                    "type": "index" if idx else "urlset", "loc_count": len(locs)})
    for loc in locs:
        if idx:
            if netloc(loc) and not same_site(loc, base_domain):
                # 跨域 sitemap(常见于 CDN/子域分工): 记录不展开
                if CROSS_DOMAIN == "record":
                    sources.append({"url": loc, "status": "cross-domain-skip"})
                continue
            time.sleep(SLEEP)
            crawl(loc, base_domain, seen, sources, locs_out, depth + 1)
        else:
            locs_out.append(loc.strip())


def classify(urls):
    """按 SOP 口径清洗: 去重, 排参数/资产 URL, 标语言前缀."""
    seen, pages = set(), []
    excluded = {"params": 0, "asset": 0}
    lang_prefix = {}
    for u in urls:
        if not u or u in seen:
            continue
        seen.add(u)
        if "?" in u or "&" in u:
            excluded["params"] += 1
            continue
        path = urllib.parse.urlsplit(u).path.lower()
        if path.endswith(EXCLUDE_EXT):
            excluded["asset"] += 1
            continue
        pages.append(u)
        seg = path.split("/")
        if len(seg) > 1 and re.fullmatch(r"[a-z]{2}(-[a-z]{2})?", seg[1]):
            lang_prefix[seg[1]] = lang_prefix.get(seg[1], 0) + 1
    return pages, excluded, lang_prefix


def locate(domain, probe_only=False):
    via = "none"
    sitemap_urls = parse_robots(domain)
    if sitemap_urls:
        via = "robots"
    else:
        for p in PROBE_PATHS:
            url = "https://" + domain + p
            try:
                body = fetch(url, timeout=12)
                if looks_like_sitemap(body):
                    sitemap_urls = [url]
                    via = "probe"
                    break
            except Exception:
                continue
            time.sleep(SLEEP)
    sources, locs_out, seen = [], [], set()
    if sitemap_urls and not probe_only:
        for su in sitemap_urls:
            crawl(su, domain, seen, sources, locs_out)
    elif sitemap_urls and probe_only:
        sources = [{"url": u, "status": "located(not-fetched)"} for u in sitemap_urls]
    return via, sitemap_urls, sources, locs_out


def main():
    try:  # Win GBK 终端下中文输出保险
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser(description="sitemap 定位器(SOP §1 步骤 2-3)")
    ap.add_argument("domain", help="裸域名, 如 example.com")
    ap.add_argument("--out", default=".", help="输出目录(默认当前目录)")
    ap.add_argument("--probe-only", action="store_true", help="只定位不递归提取")
    args = ap.parse_args()

    domain = args.domain.strip().replace("https://", "").replace("http://", "").rstrip("/")
    via, sitemap_urls, sources, locs = locate(domain, args.probe_only)
    pages, excluded, lang_prefix = classify(locs)

    result = {
        "domain": domain,
        "discovered_via": via,
        "sitemap_urls": sitemap_urls,
        "sitemap_sources": sources,
        "page_urls": pages,
        "stats": {
            "total_loc": len(locs),
            "pages": len(pages),
            "excluded": excluded,
            "lang_prefix": lang_prefix,
        },
    }
    out_dir = args.out.rstrip("/")
    os.makedirs(out_dir, exist_ok=True)
    out_path = "%s/%s_sitemap_raw.json" % (out_dir, domain)
    with io.open(out_path, "w", encoding="utf-8") as f:  # Win 必带 utf-8
        json.dump(result, f, ensure_ascii=False, indent=1)

    print("[%s] %s -> %s" % (via, domain, out_path))
    print("  sitemap 源: %d 个 | loc 总数: %d | 页面 URL: %d | 排除: 参数 %d / 资产 %d"
          % (len(sitemap_urls), len(locs), len(pages),
             excluded["params"], excluded["asset"]))
    if lang_prefix:
        print("  语言前缀分布: %s" % json.dumps(lang_prefix, ensure_ascii=False))
    if via == "none":
        print("  !! 无 sitemap —— 按 SOP 降级处理(仅目录推断+抽样, 不产出 URL 底册)")


if __name__ == "__main__":
    main()
