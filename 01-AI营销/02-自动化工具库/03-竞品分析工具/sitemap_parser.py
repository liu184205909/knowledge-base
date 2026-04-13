#!/usr/bin/env python3
"""
sitemap_parser.py - 竞品 Sitemap 解析工具
解析竞品网站的 sitemap.xml，提取 URL 结构，输出内容架构报告和博客 URL 列表
"""

import requests
import argparse
import csv
import os
import re
from urllib.parse import urlparse
from datetime import datetime
from xml.etree import ElementTree as ET
from collections import defaultdict

# ── 配置 ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; SitemapAnalyzer/1.0; research purposes)"
}
OUTPUT_DIR = "sitemap_results"
COMMON_SITEMAP_PATHS = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap.xml",
    "/post-sitemap.xml",
]

# 内容类型分类规则（URL pattern 匹配）
CONTENT_TYPE_PATTERNS = {
    "blog": [r"/blog/", r"/post/", r"/article/", r"/news/"],
    "product": [r"/product/", r"/shop/", r"/buy/", r"/store/"],
    "category": [r"/category/", r"/cat/", r"/tag/"],
    "landing": [r"/$", r"/home"],
    "other": [],
}

# ── 核心函数 ──────────────────────────────────────────────────────────────────

def fetch_sitemap(url: str) -> str | None:
    """抓取 sitemap XML 内容"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  ⚠ 抓取失败: {url} → {e}")
        return None


def auto_discover_sitemap(base_url: str) -> str | None:
    """自动发现竞品网站的 sitemap 路径"""
    domain = base_url.rstrip("/")
    print(f"🔍 自动发现 sitemap: {domain}")
    for path in COMMON_SITEMAP_PATHS:
        url = domain + path
        content = fetch_sitemap(url)
        if content and "<urlset" in content or (content and "<sitemapindex" in content):
            print(f"  ✓ 找到: {url}")
            return url
    return None


def parse_sitemap_xml(content: str) -> list[str]:
    """解析 sitemap XML，支持 sitemap index（嵌套 sitemap）"""
    urls = []
    try:
        root = ET.fromstring(content)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        # 检查是否是 sitemap index
        if root.tag.endswith("sitemapindex"):
            sub_urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
            print(f"  📂 Sitemap Index，包含 {len(sub_urls)} 个子 sitemap")
            for sub_url in sub_urls:
                sub_content = fetch_sitemap(sub_url)
                if sub_content:
                    urls.extend(parse_sitemap_xml(sub_content))
        else:
            urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]

    except ET.ParseError as e:
        print(f"  ⚠ XML 解析错误: {e}")

    return urls


def classify_url(url: str) -> str:
    """根据 URL pattern 判断内容类型"""
    path = urlparse(url).path.lower()
    for content_type, patterns in CONTENT_TYPE_PATTERNS.items():
        if content_type == "other":
            continue
        for pattern in patterns:
            if re.search(pattern, path):
                return content_type
    return "other"


def extract_path_segments(url: str) -> list[str]:
    """提取 URL 路径段（用于分析目录结构）"""
    path = urlparse(url).path
    segments = [s for s in path.split("/") if s]
    return segments


def analyze_urls(urls: list[str], domain: str) -> dict:
    """分析 URL 列表，生成统计报告"""
    stats = {
        "total": len(urls),
        "by_type": defaultdict(list),
        "top_directories": defaultdict(int),
        "depth_distribution": defaultdict(int),
    }

    for url in urls:
        # 分类
        content_type = classify_url(url)
        stats["by_type"][content_type].append(url)

        # 目录统计
        segments = extract_path_segments(url)
        if segments:
            stats["top_directories"][f"/{segments[0]}/"] += 1

        # 深度统计
        depth = len(segments)
        stats["depth_distribution"][depth] += 1

    return stats


def generate_report(domain: str, stats: dict) -> str:
    """生成 Markdown 分析报告"""
    lines = [
        f"# Sitemap 分析报告: {domain}",
        f"\n> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"\n---\n",
        f"## 总览\n",
        f"- **总 URL 数**: {stats['total']}",
    ]

    for content_type, urls in sorted(stats["by_type"].items(), key=lambda x: -len(x[1])):
        lines.append(f"- **{content_type}**: {len(urls)} 个")

    lines.append(f"\n---\n\n## 目录结构（Top 15）\n")
    lines.append("| 目录 | URL 数量 |")
    lines.append("|------|---------|")
    top_dirs = sorted(stats["top_directories"].items(), key=lambda x: -x[1])[:15]
    for dir_path, count in top_dirs:
        lines.append(f"| `{dir_path}` | {count} |")

    lines.append(f"\n---\n\n## URL 深度分布\n")
    lines.append("| 路径层级 | URL 数量 |")
    lines.append("|---------|---------|")
    for depth in sorted(stats["depth_distribution"].keys()):
        lines.append(f"| {depth} 层 | {stats['depth_distribution'][depth]} |")

    lines.append(f"\n---\n\n## 博客文章列表（前50条）\n")
    blog_urls = stats["by_type"].get("blog", [])
    for url in blog_urls[:50]:
        lines.append(f"- {url}")
    if len(blog_urls) > 50:
        lines.append(f"\n> ... 共 {len(blog_urls)} 条，完整列表见 `blog_urls.csv`")

    return "\n".join(lines)


def save_blog_urls_csv(domain_slug: str, blog_urls: list[str]):
    """保存博客 URL 列表到 CSV，供 05-竞品内容分析工具使用"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, f"{domain_slug}_blog_urls.csv")
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "domain"])
        for url in blog_urls:
            writer.writerow([url, domain_slug])
    print(f"  📄 博客 URL 已保存: {filepath}（共 {len(blog_urls)} 条）")
    return filepath


def process_one(url: str):
    """处理单个竞品网站"""
    # 自动发现 sitemap
    if not url.endswith(".xml"):
        sitemap_url = auto_discover_sitemap(url)
        if not sitemap_url:
            print(f"  ✗ 无法找到 {url} 的 sitemap")
            return
    else:
        sitemap_url = url

    domain = urlparse(sitemap_url).netloc
    domain_slug = domain.replace(".", "_")
    print(f"\n📊 分析: {domain}")

    # 抓取并解析
    content = fetch_sitemap(sitemap_url)
    if not content:
        return

    urls = parse_sitemap_xml(content)
    print(f"  ✓ 共找到 {len(urls)} 个 URL")

    if not urls:
        return

    # 分析
    stats = analyze_urls(urls, domain)

    # 保存报告
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    report = generate_report(domain, stats)
    report_path = os.path.join(OUTPUT_DIR, f"{domain_slug}_sitemap_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"  📋 分析报告: {report_path}")

    # 保存博客 URL CSV
    blog_urls = stats["by_type"].get("blog", [])
    if blog_urls:
        save_blog_urls_csv(domain_slug, blog_urls)
    else:
        print(f"  ⚠ 未识别到博客类 URL（可检查 CONTENT_TYPE_PATTERNS 配置）")

    # 打印简要汇总
    print(f"\n  📈 内容结构汇总:")
    for content_type, type_urls in sorted(stats["by_type"].items(), key=lambda x: -len(x[1])):
        print(f"    {content_type:12s}: {len(type_urls):5d} 个")


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="竞品 Sitemap 解析工具 - 分析竞品网站内容结构"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="单个竞品网站 URL 或 sitemap.xml URL")
    group.add_argument("--file", help="包含多个竞品 URL 的文本文件（每行一个）")
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if args.url:
        process_one(args.url)
    elif args.file:
        with open(args.file, encoding="utf-8") as f:
            urls = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        print(f"📋 批量模式：共 {len(urls)} 个竞品")
        for url in urls:
            process_one(url)

    print(f"\n✅ 完成！结果保存在 {OUTPUT_DIR}/ 目录")


if __name__ == "__main__":
    main()
