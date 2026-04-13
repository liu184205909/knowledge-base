#!/usr/bin/env python3
"""
serp_competitor_finder.py - 竞品挖掘工具
通过 Google SERP 批量发现竞品独立站，过滤大平台，输出竞品 URL 列表
供 03-竞品分析工具（Sitemap解析）使用
"""

import argparse
import time
import os
import re
from urllib.parse import urlparse
from datetime import datetime

try:
    from googlesearch import search
except ImportError:
    print("❌ 请先安装依赖: pip install googlesearch-python requests beautifulsoup4")
    raise

# ── 配置 ──────────────────────────────────────────────────────────────────────
OUTPUT_FILE = "competitor_urls.txt"
DEFAULT_PAGES = 3       # 默认抓取页数（每页约10条）
DEFAULT_DELAY = 2.0     # 请求间隔（秒），避免被 Google 封

# 过滤黑名单：大平台、聚合站、非独立站
BLACKLIST_DOMAINS = {
    "amazon", "ebay", "walmart", "target", "costco",
    "reddit", "quora", "youtube", "tiktok", "instagram",
    "facebook", "twitter", "pinterest", "linkedin",
    "wikipedia", "wikihow", "fandom",
    "etsy", "shopify", "aliexpress", "alibaba", "dhgate",
    "wayfair", "homedepot", "lowes", "bestbuy",
    "google", "bing", "yahoo", "forbes", "cnn", "bbc",
    "medium", "substack", "wordpress.com", "blogspot",
}

# ── 核心函数 ──────────────────────────────────────────────────────────────────

def is_blacklisted(url: str) -> bool:
    """检查 URL 是否属于大平台黑名单"""
    domain = urlparse(url).netloc.lower()
    # 去掉 www.
    domain = re.sub(r"^www\.", "", domain)
    for bl in BLACKLIST_DOMAINS:
        if bl in domain:
            return True
    return False


def get_root_domain(url: str) -> str:
    """提取根域名（去掉子域名）"""
    netloc = urlparse(url).netloc.lower()
    netloc = re.sub(r"^www\.", "", netloc)
    return netloc


def search_competitors(keyword: str, pages: int = DEFAULT_PAGES, delay: float = DEFAULT_DELAY) -> list[str]:
    """搜索单个关键词，返回过滤后的竞品域名列表"""
    num_results = pages * 10
    print(f"\n🔍 搜索: \"{keyword}\" （取前 {num_results} 条结果）")

    found_domains = set()
    try:
        results = search(keyword, num_results=num_results, lang="en", sleep_interval=delay)
        for url in results:
            if is_blacklisted(url):
                print(f"  ⊘ 跳过黑名单: {get_root_domain(url)}")
                continue
            domain = get_root_domain(url)
            if domain and domain not in found_domains:
                found_domains.add(domain)
                full_url = f"https://{domain}"
                print(f"  ✓ 发现竞品: {full_url}")
    except Exception as e:
        print(f"  ⚠ 搜索出错: {e}")

    return list(found_domains)


def save_results(all_domains: set[str], keywords: list[str]) -> str:
    """保存竞品 URL 列表到文件"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        f"# 竞品挖掘结果",
        f"# 生成时间: {timestamp}",
        f"# 关键词: {', '.join(keywords)}",
        f"# 共发现 {len(all_domains)} 个独立站竞品",
        f"# 格式: 每行一个 URL，供 03-竞品分析工具使用",
        "",
    ]
    lines += sorted(all_domains)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    return OUTPUT_FILE


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="竞品挖掘工具 - 通过 SERP 批量发现竞品独立站"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--keyword", help="单个目标关键词（例: \"gel blaster gun\"）")
    group.add_argument("--file", help="关键词列表文件（每行一个关键词）")

    parser.add_argument("--pages", type=int, default=DEFAULT_PAGES,
                        help=f"每个关键词抓取的 SERP 页数（默认 {DEFAULT_PAGES}）")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY,
                        help=f"请求间隔秒数（默认 {DEFAULT_DELAY}，过低会被 Google 封）")
    args = parser.parse_args()

    # 加载关键词
    if args.keyword:
        keywords = [args.keyword]
    else:
        with open(args.file, encoding="utf-8") as f:
            keywords = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        print(f"📋 从文件加载 {len(keywords)} 个关键词")

    # 逐个关键词搜索
    all_domains: set[str] = set()
    for kw in keywords:
        domains = search_competitors(kw, pages=args.pages, delay=args.delay)
        all_domains.update(f"https://{d}" for d in domains)
        if len(keywords) > 1:
            time.sleep(args.delay * 2)  # 多关键词时额外等待

    # 保存结果
    output_path = save_results(all_domains, keywords)

    print(f"\n✅ 完成！共发现 {len(all_domains)} 个竞品独立站")
    print(f"  📄 结果保存: {output_path}")
    print(f"\n下一步 → 运行竞品 Sitemap 分析:")
    print(f"  python ../03-竞品分析工具/sitemap_parser.py --file {output_path}")


if __name__ == "__main__":
    main()
