#!/usr/bin/env python3
"""
content_analyzer.py - 竞品内容分析工具
输入: sitemap 解析工具输出的博客 URL 列表 (CSV)
处理: 批量抓取 title / meta description / H1 / H2，按内容类型自动分类
输出: 跨竞品内容模式报告（哪些类型多、哪些类型少、哪些没人写）
"""

import requests
import argparse
import csv
import os
import re
import time
from datetime import datetime
from urllib.parse import urlparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ 请先安装依赖: pip install requests beautifulsoup4 pandas tqdm")
    raise

# ── 配置 ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
OUTPUT_DIR = "results"
REQUEST_TIMEOUT = 12  # 秒
DEFAULT_DELAY = 1.0   # 请求间隔（秒），避免被封
DEFAULT_CONCURRENCY = 3

# 内容类型分类规则（title/H1 关键词匹配）
CONTENT_TYPE_RULES = {
    "选购指南": ["best", "top", "review", "guide", "vs", "comparison", "alternative", "ranked"],
    "教程/How-to": ["how to", "tutorial", "tips", "step by step", "diy", "setup", "install"],
    "信息科普": ["what is", "why", "explained", "facts", "difference between", "types of"],
    "产品页/落地页": ["buy", "shop", "sale", "discount", "price", "deal", "coupon", "where to"],
    "清单/合集": ["list", "ideas", "examples", "ways to", "things", "reasons"],
    "问答/FAQ": ["faq", "question", "answer", "common", "problem", "fix", "solution"],
}

# ── 抓取逻辑 ──────────────────────────────────────────────────────────────────

def fetch_page_metadata(url: str) -> dict:
    """抓取单个页面的 title / meta description / H1 / H2 列表"""
    result = {
        "url": url,
        "domain": urlparse(url).netloc,
        "title": "",
        "meta_description": "",
        "h1": "",
        "h2s": "",
        "content_type": "未分类",
        "status": "ok",
        "error": "",
    }
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Title
        title_tag = soup.find("title")
        result["title"] = title_tag.get_text(strip=True) if title_tag else ""

        # Meta description
        meta = soup.find("meta", attrs={"name": re.compile("description", re.I)})
        result["meta_description"] = meta.get("content", "") if meta else ""

        # H1
        h1 = soup.find("h1")
        result["h1"] = h1.get_text(strip=True) if h1 else ""

        # H2s（取前5个）
        h2s = soup.find_all("h2")
        result["h2s"] = " | ".join(h.get_text(strip=True) for h in h2s[:5])

        # 内容类型分类
        text_to_classify = f"{result['title']} {result['h1']}".lower()
        result["content_type"] = classify_content(text_to_classify)

    except requests.HTTPError as e:
        result["status"] = "error"
        result["error"] = f"HTTP {e.response.status_code}"
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)[:80]

    return result


def classify_content(text: str) -> str:
    """根据 title/H1 文本判断内容类型"""
    text_lower = text.lower()
    for content_type, keywords in CONTENT_TYPE_RULES.items():
        for kw in keywords:
            if kw in text_lower:
                return content_type
    return "其他"


# ── 分析与报告 ────────────────────────────────────────────────────────────────

def analyze_results(articles: list[dict]) -> dict:
    """汇总分析所有文章数据"""
    by_domain = defaultdict(list)
    by_type = defaultdict(list)

    for article in articles:
        if article["status"] == "ok":
            by_domain[article["domain"]].append(article)
            by_type[article["content_type"]].append(article)

    return {"by_domain": by_domain, "by_type": by_type}


def generate_report(articles: list[dict], stats: dict) -> str:
    """生成跨竞品内容模式分析报告"""
    total_ok = sum(1 for a in articles if a["status"] == "ok")
    total_err = sum(1 for a in articles if a["status"] == "error")

    lines = [
        "# 竞品内容模式分析报告",
        f"\n> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')} | "
        f"总计: {len(articles)} 篇（成功 {total_ok}，失败 {total_err}）",
        "\n---\n",
        "## 一、内容类型分布（跨竞品汇总）\n",
        "| 内容类型 | 文章数 | 占比 |",
        "|---------|--------|------|",
    ]

    by_type = stats["by_type"]
    for content_type, type_articles in sorted(by_type.items(), key=lambda x: -len(x[1])):
        pct = len(type_articles) / total_ok * 100 if total_ok else 0
        lines.append(f"| {content_type} | {len(type_articles)} | {pct:.1f}% |")

    lines += [
        "\n---\n",
        "## 二、各竞品内容类型对比\n",
        "| 域名 | 总计 | " + " | ".join(CONTENT_TYPE_RULES.keys()) + " |",
        "|------|------|" + "|------|" * len(CONTENT_TYPE_RULES),
    ]

    for domain, domain_articles in sorted(stats["by_domain"].items()):
        domain_by_type = defaultdict(int)
        for a in domain_articles:
            domain_by_type[a["content_type"]] += 1
        row = f"| {domain} | {len(domain_articles)} | "
        row += " | ".join(str(domain_by_type.get(ct, 0)) for ct in CONTENT_TYPE_RULES.keys())
        row += " |"
        lines.append(row)

    lines += [
        "\n---\n",
        "## 三、内容空白（各类型示例文章）\n",
    ]

    for content_type, type_articles in sorted(by_type.items(), key=lambda x: len(x[1])):
        lines.append(f"### {content_type}（{len(type_articles)} 篇）\n")
        for a in type_articles[:5]:
            title = a["title"] or a["h1"] or "（无标题）"
            lines.append(f"- [{title}]({a['url']})")
        if len(type_articles) > 5:
            lines.append(f"- ... 共 {len(type_articles)} 篇")
        lines.append("")

    lines += [
        "---\n",
        "## 四、失败 URL 列表\n",
    ]
    errors = [a for a in articles if a["status"] == "error"]
    if errors:
        for a in errors[:20]:
            lines.append(f"- `{a['error']}` → {a['url']}")
    else:
        lines.append("_无失败记录_")

    return "\n".join(lines)


def save_detail_csv(articles: list[dict], output_path: str):
    """保存详细原始数据 CSV"""
    fieldnames = ["url", "domain", "title", "meta_description", "h1", "h2s", "content_type", "status", "error"]
    with open(output_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(articles)


# ── 主入口 ────────────────────────────────────────────────────────────────────

def load_urls_from_csv(filepath: str) -> list[str]:
    """从 CSV 文件加载 URL 列表（支持 sitemap_parser.py 的输出格式）"""
    urls = []
    with open(filepath, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row.get("url", "").strip()
            if url:
                urls.append(url)
    return urls


def load_urls_from_txt(filepath: str) -> list[str]:
    """从纯文本文件加载 URL（每行一个）"""
    with open(filepath, encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip() and not line.startswith("#")]


def main():
    parser = argparse.ArgumentParser(
        description="竞品内容分析工具 - 批量抓取竞品文章结构"
    )
    parser.add_argument(
        "--input", required=True,
        help="输入文件：sitemap_parser 输出的 CSV，或纯文本 URL 列表"
    )
    parser.add_argument(
        "--concurrency", type=int, default=DEFAULT_CONCURRENCY,
        help=f"并发请求数（默认 {DEFAULT_CONCURRENCY}，过高容易被封）"
    )
    parser.add_argument(
        "--delay", type=float, default=DEFAULT_DELAY,
        help=f"每次请求间隔秒数（默认 {DEFAULT_DELAY}）"
    )
    parser.add_argument(
        "--limit", type=int, default=0,
        help="限制分析的最大 URL 数（0 = 不限制，调试用）"
    )
    args = parser.parse_args()

    # 加载 URL
    if args.input.endswith(".csv"):
        urls = load_urls_from_csv(args.input)
    else:
        urls = load_urls_from_txt(args.input)

    if args.limit:
        urls = urls[:args.limit]

    print(f"📋 共加载 {len(urls)} 个 URL，开始分析...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 并发抓取
    articles = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {executor.submit(fetch_page_metadata, url): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            articles.append(result)
            status_icon = "✓" if result["status"] == "ok" else "✗"
            print(f"  [{i:4d}/{len(urls)}] {status_icon} {result.get('content_type', '?'):12s} {futures[future][:70]}")
            time.sleep(args.delay)

    # 分析
    stats = analyze_results(articles)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    report_path = os.path.join(OUTPUT_DIR, f"content_pattern_report_{timestamp}.md")
    detail_path = os.path.join(OUTPUT_DIR, f"articles_detail_{timestamp}.csv")

    report = generate_report(articles, stats)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    save_detail_csv(articles, detail_path)

    print(f"\n✅ 分析完成！")
    print(f"  📋 内容模式报告: {report_path}")
    print(f"  📄 原始数据 CSV: {detail_path}")

    # 打印简要汇总
    print(f"\n📊 内容类型汇总:")
    for ct, ct_articles in sorted(stats["by_type"].items(), key=lambda x: -len(x[1])):
        print(f"  {ct:15s}: {len(ct_articles):4d} 篇")


if __name__ == "__main__":
    main()
