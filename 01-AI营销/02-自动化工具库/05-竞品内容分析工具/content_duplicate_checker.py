#!/usr/bin/env python3
"""
content_duplicate_checker.py - 站内重复内容检测工具
输入: 网站 sitemap URL 或本地 URL 列表文件
处理: 抓取所有页面正文 → SimHash 指纹比对 → 找出站内重复/近似的页面对
输出: 重复内容报告（Markdown）+ 详细对比 CSV
"""

import requests
import argparse
import csv
import os
import re
import time
import hashlib
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urlparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("请先安装依赖: pip install requests beautifulsoup4 tqdm")
    raise

# ── 配置 ──────────────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
OUTPUT_DIR = "results"
REQUEST_TIMEOUT = 15
DEFAULT_DELAY = 0.8
DEFAULT_CONCURRENCY = 3
# SimHash 参数
SIMHASH_BITS = 64
# 重复判定阈值：汉明距离 <= 此值视为近似重复
DUPLICATE_THRESHOLD = 10
# 正文最短字数（低于此值跳过比对）
MIN_CONTENT_LENGTH = 100


# ── SimHash 实现 ──────────────────────────────────────────────────────────────

def tokenize(text: str) -> list[str]:
    """简单分词：英文按空格，提取字母数字 token"""
    # 去除 HTML 标签残留
    text = re.sub(r'<[^>]+>', ' ', text)
    # 提取单词（英文 + 数字组合）
    tokens = re.findall(r'[a-zA-Z0-9]+', text.lower())
    # 过滤停用词和过短的 token
    stop_words = {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
                  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                  'would', 'could', 'should', 'may', 'might', 'can', 'shall',
                  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
                  'as', 'into', 'through', 'during', 'before', 'after', 'and',
                  'but', 'or', 'not', 'no', 'nor', 'so', 'yet', 'both', 'either',
                  'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
                  'other', 'some', 'such', 'than', 'too', 'very', 'just', 'about',
                  'also', 'this', 'that', 'these', 'those', 'it', 'its', 'we',
                  'our', 'you', 'your', 'they', 'their', 'he', 'she', 'him', 'her'}
    return [t for t in tokens if len(t) > 2 and t not in stop_words]


def simhash(text: str) -> int:
    """计算文本的 SimHash 指纹（64位）"""
    tokens = tokenize(text)
    if not tokens:
        return 0

    # 初始化 64 位向量
    v = [0] * SIMHASH_BITS

    for token in tokens:
        # 对每个 token 做 MD5，取 64 位作为 hash
        token_hash = int(hashlib.md5(token.encode('utf-8')).hexdigest()[:16], 16)
        for i in range(SIMHASH_BITS):
            if token_hash & (1 << i):
                v[i] += 1
            else:
                v[i] -= 1

    # 生成指纹
    fingerprint = 0
    for i in range(SIMHASH_BITS):
        if v[i] > 0:
            fingerprint |= (1 << i)
    return fingerprint


def hamming_distance(hash1: int, hash2: int) -> int:
    """计算两个 SimHash 的汉明距离"""
    x = hash1 ^ hash2
    distance = 0
    while x:
        distance += 1
        x &= x - 1
    return distance


def similarity_percentage(hash1: int, hash2: int) -> float:
    """将汉明距离转换为相似度百分比"""
    dist = hamming_distance(hash1, hash2)
    return round((1 - dist / SIMHASH_BITS) * 100, 1)


# ── 页面抓取 ──────────────────────────────────────────────────────────────────

def extract_content(url: str) -> dict:
    """抓取页面并提取正文文本"""
    result = {
        "url": url,
        "title": "",
        "content": "",
        "word_count": 0,
        "simhash": 0,
        "status": "ok",
        "error": "",
    }
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # 移除不需要的标签
        for tag in soup.find_all(['script', 'style', 'nav', 'footer', 'header',
                                   'aside', 'noscript', 'iframe', 'form']):
            tag.decompose()

        # 提取标题
        title_tag = soup.find("title")
        result["title"] = title_tag.get_text(strip=True) if title_tag else ""

        # 提取正文（优先 article/main，其次 body）
        main_content = soup.find('article') or soup.find('main') or soup.find('body')
        if main_content:
            text = main_content.get_text(separator=' ', strip=True)
            result["content"] = text
            result["word_count"] = len(text.split())
            result["simhash"] = simhash(text) if result["word_count"] >= MIN_CONTENT_LENGTH else 0
        else:
            result["status"] = "error"
            result["error"] = "无法提取正文"

    except requests.HTTPError as e:
        result["status"] = "error"
        result["error"] = f"HTTP {e.response.status_code}"
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)[:80]

    return result


# ── URL 加载 ──────────────────────────────────────────────────────────────────

def load_urls_from_sitemap(sitemap_url: str) -> list[str]:
    """从 sitemap XML 加载 URL"""
    resp = requests.get(sitemap_url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    root = ET.fromstring(resp.text)
    # 处理 XML namespace
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = []
    for loc in root.findall('.//sm:loc', ns):
        if loc.text:
            urls.append(loc.text.strip())
    # 如果没有 namespace 也尝试直接查找
    if not urls:
        for loc in root.findall('.//loc'):
            if loc.text:
                urls.append(loc.text.strip())
    return urls


def load_urls_from_file(filepath: str) -> list[str]:
    """从本地文件加载 URL（支持 CSV 和纯文本）"""
    urls = []
    if filepath.endswith('.csv'):
        with open(filepath, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row.get('url', '').strip()
                if url:
                    urls.append(url)
    else:
        with open(filepath, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    urls.append(line)
    return urls


# ── 分析与报告 ────────────────────────────────────────────────────────────────

def find_duplicates(pages: list[dict], threshold: int = DUPLICATE_THRESHOLD) -> list[dict]:
    """比对所有页面对，找出重复内容"""
    valid_pages = [p for p in pages if p["status"] == "ok" and p["simhash"] != 0]
    duplicates = []

    for i in range(len(valid_pages)):
        for j in range(i + 1, len(valid_pages)):
            p1, p2 = valid_pages[i], valid_pages[j]
            sim_pct = similarity_percentage(p1["simhash"], p2["simhash"])
            dist = hamming_distance(p1["simhash"], p2["simhash"])

            if dist <= threshold:
                duplicates.append({
                    "url_1": p1["url"],
                    "title_1": p1["title"],
                    "url_2": p2["url"],
                    "title_2": p2["title"],
                    "similarity": sim_pct,
                    "hamming_distance": dist,
                    "words_1": p1["word_count"],
                    "words_2": p2["word_count"],
                })

    # 按相似度降序排列
    duplicates.sort(key=lambda x: -x["similarity"])
    return duplicates


def generate_report(pages: list[dict], duplicates: list[dict], site_url: str) -> str:
    """生成站内重复内容检测报告"""
    total = len(pages)
    ok_pages = [p for p in pages if p["status"] == "ok"]
    err_pages = [p for p in pages if p["status"] == "error"]
    short_pages = [p for p in ok_pages if p["simhash"] == 0]

    lines = [
        "# 站内重复内容检测报告",
        f"\n> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 目标站点: {site_url}",
        f"> 总页面: {total} | 有效: {len(ok_pages)} | 内容过短: {len(short_pages)} | 失败: {len(err_pages)}",
        f"> 重复阈值: 汉明距离 <= {DUPLICATE_THRESHOLD}（相似度 >= {similarity_percentage(0, (1 << DUPLICATE_THRESHOLD) - 1)}%）",
        "\n---\n",
    ]

    if not duplicates:
        lines.append("## 检测结果：未发现明显重复内容 ✓\n")
        lines.append("所有有效页面之间的 SimHash 汉明距离均超过阈值。")
    else:
        lines.append(f"## 检测结果：发现 {len(duplicates)} 对疑似重复内容\n")

        # 按严重程度分组
        high_sim = [d for d in duplicates if d["similarity"] >= 90]
        medium_sim = [d for d in duplicates if 70 <= d["similarity"] < 90]
        low_sim = [d for d in duplicates if d["similarity"] < 70]

        if high_sim:
            lines.append(f"### 🔴 高度重复（相似度 >= 90%）：{len(high_sim)} 对\n")
            for d in high_sim:
                lines.append(f"- **{d['similarity']}%** [{d['title_1'][:50]}]({d['url_1']})")
                lines.append(f"  ↔ [{d['title_2'][:50]}]({d['url_2']})")
                lines.append("")

        if medium_sim:
            lines.append(f"### 🟡 中度相似（70%-89%）：{len(medium_sim)} 对\n")
            for d in medium_sim[:20]:
                lines.append(f"- **{d['similarity']}%** [{d['title_1'][:50]}]({d['url_1']})")
                lines.append(f"  ↔ [{d['title_2'][:50]}]({d['url_2']})")
                lines.append("")
            if len(medium_sim) > 20:
                lines.append(f"- ... 共 {len(medium_sim)} 对\n")

        if low_sim:
            lines.append(f"### 🟢 轻度相似（< 70%）：{len(low_sim)} 对\n")
            lines.append("（详见 CSV 报告）\n")

    # 内容过短的页面
    if short_pages:
        lines.append(f"\n---\n\n## 内容过短的页面（<{MIN_CONTENT_LENGTH} 词，已跳过比对）\n")
        for p in short_pages[:10]:
            lines.append(f"- [{p['title'][:60]}]({p['url']}) — {p['word_count']} 词")
        if len(short_pages) > 10:
            lines.append(f"- ... 共 {len(short_pages)} 个")

    # 建议
    lines += [
        "\n---\n",
        "## 优化建议\n",
    ]
    if duplicates:
        high_count = len([d for d in duplicates if d["similarity"] >= 90])
        if high_count:
            lines.append(f"1. **优先处理** {high_count} 对高度重复页面：合并或使用 canonical 标签指向权威版本")
        lines.append("2. 检查是否为分页、标签页、搜索结果页导致的重复")
        lines.append("3. 考虑使用 robots.txt 或 noindex 屏蔽低价值重复页")
        lines.append("4. 对保留的页面增加 Information Gain（信息增益）内容")
    else:
        lines.append("站内内容唯一性良好，继续保持。")

    return "\n".join(lines)


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="站内重复内容检测工具 - 基于 SimHash 比对页面相似度"
    )
    parser.add_argument(
        "--input", required=True,
        help="输入: sitemap URL (如 https://example.com/sitemap.xml) 或本地 URL 文件"
    )
    parser.add_argument(
        "--threshold", type=int, default=DUPLICATE_THRESHOLD,
        help=f"汉明距离阈值，低于此值视为重复（默认 {DUPLICATE_THRESHOLD}）"
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
        help="限制抓取的最大 URL 数（0 = 不限制）"
    )
    args = parser.parse_args()

    # 加载 URL
    if args.input.startswith('http'):
        print(f"📡 从 sitemap 加载 URL: {args.input}")
        urls = load_urls_from_sitemap(args.input)
    else:
        print(f"📁 从文件加载 URL: {args.input}")
        urls = load_urls_from_file(args.input)

    if args.limit:
        urls = urls[:args.limit]

    print(f"📋 共 {len(urls)} 个 URL，开始抓取页面内容...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 并发抓取
    pages = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {executor.submit(extract_content, url): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            pages.append(result)
            icon = "✓" if result["status"] == "ok" else "✗"
            print(f"  [{i:4d}/{len(urls)}] {icon} {result['word_count']:5d}w  {futures[future][:70]}")
            time.sleep(args.delay)

    # 比对
    print(f"\n🔍 开始比对 {len([p for p in pages if p['status'] == 'ok'])} 个有效页面的 SimHash...")
    duplicates = find_duplicates(pages, args.threshold)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    site_url = urlparse(urls[0]).netloc if urls else "unknown"

    report_path = os.path.join(OUTPUT_DIR, f"duplicate_report_{site_url}_{timestamp}.md")
    csv_path = os.path.join(OUTPUT_DIR, f"duplicate_pairs_{site_url}_{timestamp}.csv")

    report = generate_report(pages, duplicates, site_url)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存 CSV
    if duplicates:
        with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=["url_1", "title_1", "url_2", "title_2",
                                                     "similarity", "hamming_distance",
                                                     "words_1", "words_2"])
            writer.writeheader()
            writer.writerows(duplicates)

    print(f"\n✅ 检测完成！")
    print(f"  📋 重复内容报告: {report_path}")
    if duplicates:
        print(f"  📄 重复对 CSV: {csv_path}")
        print(f"  ⚠️  发现 {len(duplicates)} 对疑似重复内容")
    else:
        print(f"  ✓ 未发现明显重复内容")


if __name__ == "__main__":
    main()
