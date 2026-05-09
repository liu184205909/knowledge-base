#!/usr/bin/env python3
"""
keyword_cannibalization_checker.py - 关键词蚕食检测工具
输入: 网站 sitemap URL 或本地 URL 列表文件
处理: 抓取每个页面的 Title + H1 + Meta Description → 提取目标关键词/主题
      → 找出多个页面竞争同一关键词的情况
输出: 关键词蚕食报告（Markdown）+ 重叠关键词 CSV
"""

import requests
import argparse
import csv
import os
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urlparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("请先安装依赖: pip install requests beautifulsoup4")
    raise

# ── 配置 ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
OUTPUT_DIR = "results"
REQUEST_TIMEOUT = 15
DEFAULT_DELAY = 0.5
DEFAULT_CONCURRENCY = 3
# 停用词列表（用于提取核心关键词）
STOP_WORDS = {
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'and', 'but', 'or', 'not', 'no', 'nor', 'so',
    'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any',
    'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very',
    'just', 'about', 'also', 'this', 'that', 'these', 'those', 'it', 'its',
    'we', 'our', 'you', 'your', 'they', 'their', 'he', 'she', 'him', 'her',
    'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'if',
    'then', 'else', 'up', 'out', 'off', 'over', 'under', 'down', 'only',
    'own', 'same', 'here', 'there', 'now', 'been', 'being', 'get', 'got',
    'much', 'many', 'well', 'back', 'even', 'still', 'way', 'need', 'use',
    'make', 'like', 'long', 'look', 'day', 'come', 'its', 'new', 'one',
    'two', 'first', 'last', 'best', 'top', 'guide', 'complete', 'ultimate',
    'review', '2026', '2025', '2024',
}
# 最短关键词长度
MIN_KW_LENGTH = 3


# ── 关键词提取 ────────────────────────────────────────────────────────────────

def extract_keywords_from_text(text: str) -> list[str]:
    """从文本中提取核心关键词（去停用词后的词组）"""
    text = text.lower()
    # 去标点
    text = re.sub(r'[^a-z0-9\s-]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    words = [w for w in text.split() if w not in STOP_WORDS and len(w) >= MIN_KW_LENGTH]

    # 单词关键词
    keywords = list(set(words))

    # 双词组合（bigram）
    bigrams = []
    for i in range(len(words) - 1):
        if words[i] not in STOP_WORDS and words[i+1] not in STOP_WORDS:
            bigrams.append(f"{words[i]} {words[i+1]}")
    keywords.extend(bigrams)

    # 三词组合（trigram）
    trigrams = []
    for i in range(len(words) - 2):
        trigram = f"{words[i]} {words[i+1]} {words[i+2]}"
        trigrams.append(trigram)
    keywords.extend(trigrams)

    return list(set(keywords))


def extract_page_keywords(url: str) -> dict:
    """抓取页面并提取关键词信息"""
    result = {
        "url": url,
        "title": "",
        "h1": "",
        "meta_description": "",
        "keywords": [],
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

        # H1
        h1 = soup.find("h1")
        result["h1"] = h1.get_text(strip=True) if h1 else ""

        # Meta Description
        meta = soup.find("meta", attrs={"name": re.compile("description", re.I)})
        result["meta_description"] = meta.get("content", "") if meta else ""

        # 提取关键词（从 Title + H1 为主）
        combined_text = f"{result['title']} {result['h1']} {result['meta_description']}"
        result["keywords"] = extract_keywords_from_text(combined_text)

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)[:80]

    return result


# ── 蚕食检测 ──────────────────────────────────────────────────────────────────

def detect_cannibalization(pages: list[dict]) -> list[dict]:
    """检测关键词蚕食：多个页面竞争同一关键词"""
    # 构建关键词 → 页面映射
    keyword_pages = defaultdict(list)
    for page in pages:
        if page["status"] != "ok":
            continue
        for kw in page["keywords"]:
            keyword_pages[kw].append(page)

    # 只保留被多个页面竞争的关键词
    cannibalized = []
    for keyword, page_list in keyword_pages.items():
        if len(page_list) >= 2:
            # 优先级：双词/三词短语 > 单词
            word_count = len(keyword.split())
            # 跳过太通用的单词（除非被3+页面竞争）
            if word_count == 1 and len(page_list) < 3:
                continue

            cannibalized.append({
                "keyword": keyword,
                "word_count": word_count,
                "competing_pages": len(page_list),
                "pages": [
                    {"url": p["url"], "title": p["title"], "h1": p["h1"]}
                    for p in page_list
                ],
                "severity": "high" if len(page_list) >= 3 else "medium" if word_count >= 2 else "low",
            })

    # 按严重程度和竞争页面数排序
    severity_order = {"high": 0, "medium": 1, "low": 2}
    cannibalized.sort(key=lambda x: (severity_order[x["severity"]], -x["competing_pages"]))

    return cannibalized


# ── 报告生成 ──────────────────────────────────────────────────────────────────

def generate_report(pages: list[dict], cannibalized: list[dict], site_url: str) -> str:
    """生成关键词蚕食检测报告"""
    ok_pages = [p for p in pages if p["status"] == "ok"]
    err_pages = [p for p in pages if p["status"] == "error"]

    lines = [
        "# 关键词蚕食检测报告\n",
        f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 目标站点: {site_url}",
        f"> 分析页面: {len(ok_pages)}（失败: {len(err_pages)}）",
        f"> 发现蚕食关键词: {len(cannibalized)} 个\n",
        "---\n",
    ]

    if not cannibalized:
        lines.append("## 检测结果：未发现明显关键词蚕食 ✓\n")
        lines.append("所有页面的目标关键词/主题没有显著重叠。")
    else:
        # 按严重程度分组
        high = [c for c in cannibalized if c["severity"] == "high"]
        medium = [c for c in cannibalized if c["severity"] == "medium"]
        low = [c for c in cannibalized if c["severity"] == "low"]

        if high:
            lines.append(f"## 🔴 高优先级（3+ 页面竞争同一关键词）：{len(high)} 个\n")
            for c in high[:20]:
                lines.append(f"### \"{c['keyword']}\" — {c['competing_pages']} 个页面竞争\n")
                for p in c["pages"]:
                    title = p["title"][:60] or p["h1"][:60] or "（无标题）"
                    lines.append(f"- [{title}]({p['url']})")
                lines.append("")

        if medium:
            lines.append(f"## 🟡 中优先级（2 页面竞争短语关键词）：{len(medium)} 个\n")
            for c in medium[:30]:
                lines.append(f"### \"{c['keyword']}\" — {c['competing_pages']} 个页面\n")
                for p in c["pages"]:
                    title = p["title"][:50] or p["h1"][:50] or "（无标题）"
                    lines.append(f"- [{title}]({p['url']})")
                lines.append("")

        if low:
            lines.append(f"## 🟢 低优先级（2 页面竞争单词）：{len(low)} 个\n")
            lines.append("（详见 CSV 报告）\n")

    # 优化建议
    lines += [
        "---\n",
        "## 优化建议\n",
    ]
    if cannibalized:
        lines += [
            "### 解决关键词蚕食的策略：\n",
            "1. **合并（Merge）** — 如果两个页面主题高度重合，合并为一个更全面的内容",
            "2. **差异化（Differentiate）** — 明确每个页面的搜索意图（信息型 vs 交易型 vs 导航型）",
            "3. **Canonical 标签** — 对相似页面使用 canonical 指向权威版本",
            "4. **内链优化** — 通过锚文本内链告诉搜索引擎哪个页面是主页面",
            "5. **301 重定向** — 将弱页面重定向到强页面",
            "6. **Noindex** — 对低价值重复页面设置 noindex",
        ]
    else:
        lines.append("当前站点关键词分配良好，建议定期检查以防止新的蚕食问题。")

    # 各页面关键词分配表
    lines += [
        "\n---\n",
        "## 各页面关键词分配表\n",
        "| 页面 | Title | 提取的关键词 |",
        "|------|-------|-------------|",
    ]
    for p in ok_pages[:30]:
        title = p["title"][:40] or "（无标题）"
        kws = ", ".join(p["keywords"][:5])
        if len(p["keywords"]) > 5:
            kws += f" (+{len(p['keywords'])-5})"
        lines.append(f"| {title} | {title} | {kws} |")
    if len(ok_pages) > 30:
        lines.append(f"| ... | | 共 {len(ok_pages)} 页面 |")

    return "\n".join(lines)


# ── URL 加载 ──────────────────────────────────────────────────────────────────

def load_urls(args_input: str) -> list[str]:
    """加载 URL"""
    if args_input.startswith('http'):
        try:
            resp = requests.get(args_input, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            root = ET.fromstring(resp.text)
            ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            urls = [loc.text.strip() for loc in root.findall('.//sm:loc', ns) if loc.text]
            if not urls:
                urls = [loc.text.strip() for loc in root.findall('.//loc') if loc.text]
            if urls:
                return urls
        except Exception:
            pass
        return [args_input]
    else:
        urls = []
        if args_input.endswith('.csv'):
            with open(args_input, encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    url = row.get('url', '').strip()
                    if url:
                        urls.append(url)
        else:
            with open(args_input, encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        urls.append(line)
        return urls


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="关键词蚕食检测工具 - 发现多个页面竞争同一关键词"
    )
    parser.add_argument(
        "--input", required=True,
        help="输入: sitemap URL 或本地 URL 文件"
    )
    parser.add_argument(
        "--concurrency", type=int, default=DEFAULT_CONCURRENCY,
        help=f"并发请求数（默认 {DEFAULT_CONCURRENCY}）"
    )
    parser.add_argument(
        "--delay", type=float, default=DEFAULT_DELAY,
        help=f"请求间隔秒数（默认 {DEFAULT_DELAY}）"
    )
    parser.add_argument(
        "--limit", type=int, default=0,
        help="限制分析的最大 URL 数（0 = 不限制）"
    )
    args = parser.parse_args()

    urls = load_urls(args.input)
    if args.limit:
        urls = urls[:args.limit]

    site_url = urlparse(urls[0]).scheme + "://" + urlparse(urls[0]).netloc if urls else ""
    print(f"📋 共 {len(urls)} 个 URL，开始关键词提取...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 并发抓取
    pages = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {executor.submit(extract_page_keywords, url): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            pages.append(result)
            icon = "✓" if result["status"] == "ok" else "✗"
            kw_count = len(result["keywords"])
            print(f"  [{i:4d}/{len(urls)}] {icon} {kw_count:3d}kw  {futures[future][:65]}")
            time.sleep(args.delay)

    # 检测蚕食
    print(f"\n🔍 检测关键词蚕食...")
    cannibalized = detect_cannibalization(pages)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    domain = urlparse(site_url).netloc
    report_path = os.path.join(OUTPUT_DIR, f"cannibalization_{domain}_{timestamp}.md")
    csv_path = os.path.join(OUTPUT_DIR, f"cannibalized_keywords_{domain}_{timestamp}.csv")

    report = generate_report(pages, cannibalized, site_url)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存 CSV
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["关键词", "词数", "竞争页面数", "严重程度", "页面URL", "页面Title"])
        for c in cannibalized:
            for p in c["pages"]:
                writer.writerow([c["keyword"], c["word_count"], c["competing_pages"],
                                 c["severity"], p["url"], p["title"]])

    print(f"\n✅ 检测完成！")
    print(f"  📋 蚕食检测报告: {report_path}")
    print(f"  📄 关键词 CSV: {csv_path}")
    if cannibalized:
        print(f"  ⚠️  发现 {len(cannibalized)} 个蚕食关键词")
        high = len([c for c in cannibalized if c["severity"] == "high"])
        medium = len([c for c in cannibalized if c["severity"] == "medium"])
        print(f"     🔴 高优先级: {high} | 🟡 中优先级: {medium}")
    else:
        print(f"  ✓ 未发现关键词蚕食问题")


if __name__ == "__main__":
    main()
