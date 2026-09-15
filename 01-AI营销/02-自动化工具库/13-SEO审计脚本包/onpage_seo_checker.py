#!/usr/bin/env python3
"""
onpage_seo_checker.py - On-Page SEO 检查工具
输入: 目标页面 URL（单页）或 URL 列表文件
处理: 检查 Title/Meta/H标签/关键词密度/内链/图片ALT/URL结构/E-E-A-T 信号
输出: On-Page SEO 评分报告（Markdown）+ 各页面评分 CSV
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
from collections import Counter
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

# 评分权重
SCORE_CONFIG = {
    "title": 15,           # Title 标签（长度、关键词位置）
    "meta_description": 10, # Meta Description
    "url_structure": 10,    # URL 结构（短、含关键词、无特殊字符）
    "headings": 15,         # H1/H2/H3 层级结构
    "content": 20,          # 内容质量（字数、关键词密度、前150字）
    "images": 10,           # 图片优化（ALT、文件名）
    "internal_links": 10,   # 内链（数量、锚文本）
    "eeat_signals": 10,     # E-E-A-T 信号
}


# ── 检查函数 ──────────────────────────────────────────────────────────────────

def check_url_structure(url: str) -> dict:
    """检查 URL 结构"""
    result = {"score": 0, "max_score": SCORE_CONFIG["url_structure"], "issues": [], "details": []}
    parsed = urlparse(url)
    path = parsed.path

    score = result["max_score"]

    # URL 长度（建议 < 60 字符路径部分）
    if len(path) > 100:
        score -= 3
        result["issues"].append(f"URL 过长 ({len(path)} 字符)")
        result["details"].append(f"路径长度: {len(path)} 字符（建议 < 100）")
    else:
        result["details"].append(f"✓ URL 长度合适 ({len(path)} 字符)")

    # 是否包含关键词（路径部分应为可读英文）
    if re.search(r'[a-z]+-[a-z]+', path.lower()):
        result["details"].append("✓ URL 包含描述性关键词")
    elif path == '/' or not path.strip('/'):
        result["details"].append("首页 URL")

    # 是否有特殊字符/参数
    if '?' in url or '&' in url:
        score -= 2
        result["issues"].append("URL 包含查询参数")
    if re.search(r'[^\w\-/.:]', path):
        score -= 2
        result["issues"].append("URL 包含特殊字符")

    # 是否为 HTTPS
    if parsed.scheme != 'https':
        score -= 3
        result["issues"].append("非 HTTPS")

    # 是否有多层嵌套（超过3级）
    depth = len([p for p in path.split('/') if p])
    if depth > 3:
        score -= 2
        result["issues"].append(f"URL 层级过深 ({depth} 级)")
        result["details"].append(f"URL 层级: {depth}（建议 <= 3）")
    else:
        result["details"].append(f"✓ URL 层级: {depth}")

    result["score"] = max(0, score)
    return result


def check_title(soup: BeautifulSoup) -> dict:
    """检查 Title 标签"""
    result = {"score": 0, "max_score": SCORE_CONFIG["title"], "issues": [], "details": []}
    title_tag = soup.find("title")

    if not title_tag:
        result["issues"].append("缺少 Title 标签")
        return result

    title = title_tag.get_text(strip=True)
    length = len(title)
    score = result["max_score"]

    if length == 0:
        result["issues"].append("Title 为空")
        return result

    result["details"].append(f"Title: \"{title[:60]}{'...' if len(title) > 60 else ''}\"")
    result["details"].append(f"长度: {length} 字符")

    if length > 60:
        score -= 3
        result["issues"].append(f"Title 过长 ({length} 字符，建议 50-60)")
    elif length < 30:
        score -= 2
        result["issues"].append(f"Title 过短 ({length} 字符)")
    else:
        result["details"].append("✓ Title 长度合适")

    # 检查 Title 是否包含修饰符
    modifiers = ["2026", "2025", "guide", "best", "review", "how to", "tips", "complete",
                 "ultimate", "top", "最新", "完整", "指南"]
    title_lower = title.lower()
    has_modifier = any(m in title_lower for m in modifiers)
    if has_modifier:
        result["details"].append("✓ 包含点击诱饵修饰词")
    else:
        score -= 2
        result["details"].append("建议添加修饰词（如 '2026 指南'、'完整教程'）")

    result["score"] = max(0, score)
    return result


def check_meta_description(soup: BeautifulSoup) -> dict:
    """检查 Meta Description"""
    result = {"score": 0, "max_score": SCORE_CONFIG["meta_description"], "issues": [], "details": []}
    meta = soup.find("meta", attrs={"name": re.compile("description", re.I)})

    if not meta:
        result["issues"].append("缺少 Meta Description")
        return result

    content = meta.get("content", "")
    length = len(content)
    score = result["max_score"]

    if length == 0:
        result["issues"].append("Meta Description 为空")
        return result

    result["details"].append(f"长度: {length} 字符")

    if length > 160:
        score -= 3
        result["issues"].append(f"Meta Description 过长 ({length}，建议 150-160)")
    elif length < 100:
        score -= 2
        result["issues"].append(f"Meta Description 过短 ({length})")
    else:
        result["details"].append("✓ Meta Description 长度合适")

    # 是否包含行动号召
    cta_words = ["learn", "discover", "find", "get", "try", "shop", "read", "explore"]
    if any(w in content.lower() for w in cta_words):
        result["details"].append("✓ 包含行动号召 (CTA)")

    result["score"] = max(0, score)
    return result


def check_headings(soup: BeautifulSoup) -> dict:
    """检查 H 标签层级结构"""
    result = {"score": 0, "max_score": SCORE_CONFIG["headings"], "issues": [], "details": []}
    score = result["max_score"]

    h1_tags = soup.find_all("h1")
    h2_tags = soup.find_all("h2")
    h3_tags = soup.find_all("h3")

    # H1 检查
    if len(h1_tags) == 0:
        score -= 5
        result["issues"].append("缺少 H1 标签")
    elif len(h1_tags) > 1:
        score -= 3
        result["issues"].append(f"多个 H1 标签 ({len(h1_tags)} 个)")
        result["details"].append(f"H1 数量: {len(h1_tags)}（建议 1 个）")
    else:
        h1_text = h1_tags[0].get_text(strip=True)
        result["details"].append(f"✓ H1: \"{h1_text[:50]}\"")

    # H2 检查
    if h2_tags:
        result["details"].append(f"H2 数量: {len(h2_tags)}")
        if len(h2_tags) < 2:
            score -= 2
            result["issues"].append("H2 数量太少（建议至少 2-3 个）")
    else:
        score -= 3
        result["issues"].append("缺少 H2 标签")

    # H3 检查
    result["details"].append(f"H3 数量: {len(h3_tags)}")

    # 层级是否合理（H1 → H2 → H3，不应跳级）
    all_headings = soup.find_all(re.compile(r'^h[1-6]$'))
    prev_level = 0
    skip_count = 0
    for h in all_headings:
        level = int(h.name[1])
        if prev_level > 0 and level > prev_level + 1:
            skip_count += 1
        prev_level = level

    if skip_count > 0:
        score -= 2
        result["issues"].append(f"标题层级跳级 {skip_count} 处（如 H1 直接到 H3）")

    result["score"] = max(0, score)
    return result


def check_content(soup: BeautifulSoup, target_keyword: str = "") -> dict:
    """检查内容质量"""
    result = {"score": 0, "max_score": SCORE_CONFIG["content"], "issues": [], "details": []}
    score = result["max_score"]

    # 提取正文
    main_content = soup.find('article') or soup.find('main') or soup.find('body')
    if not main_content:
        result["issues"].append("无法提取正文内容")
        return result

    # 清理
    for tag in main_content.find_all(['script', 'style', 'nav', 'footer']):
        tag.decompose()

    text = main_content.get_text(separator=' ', strip=True)
    words = text.split()
    word_count = len(words)

    result["details"].append(f"字数: {word_count}")

    # 字数检查
    if word_count < 300:
        score -= 5
        result["issues"].append(f"内容过短 ({word_count} 词，建议 > 800)")
    elif word_count < 800:
        score -= 2
        result["details"].append("内容偏短（建议 800+ 词的深度内容）")
    else:
        result["details"].append("✓ 内容长度充足")

    # 前150字是否包含关键词
    first_150 = " ".join(words[:150]).lower()
    if target_keyword and target_keyword.lower() in first_150:
        result["details"].append(f"✓ 前150字包含目标关键词 '{target_keyword}'")
    elif target_keyword:
        score -= 3
        result["issues"].append(f"前150字未包含目标关键词 '{target_keyword}'")

    # 关键词密度（如果提供了关键词）
    if target_keyword:
        text_lower = text.lower()
        kw_count = text_lower.count(target_keyword.lower())
        density = round(kw_count / max(word_count, 1) * 100, 2)
        result["details"].append(f"关键词密度: {density}%（出现 {kw_count} 次）")
        if density > 3:
            score -= 2
            result["issues"].append(f"关键词密度过高 ({density}%)")
        elif density < 0.5 and word_count > 300:
            score -= 1
            result["issues"].append(f"关键词密度过低 ({density}%)")

    # 是否包含列表（ul/ol）
    lists = main_content.find_all(['ul', 'ol'])
    if lists:
        result["details"].append(f"✓ 包含 {len(lists)} 个列表")
    else:
        score -= 1
        result["details"].append("建议添加列表提高可读性")

    # 是否包含表格
    tables = main_content.find_all('table')
    if tables:
        result["details"].append(f"✓ 包含 {len(tables)} 个表格（利于 Featured Snippet）")

    result["score"] = max(0, score)
    return result


def check_images(soup: BeautifulSoup) -> dict:
    """检查图片优化"""
    result = {"score": 0, "max_score": SCORE_CONFIG["images"], "issues": [], "details": []}
    score = result["max_score"]

    images = soup.find_all("img")
    if not images:
        result["details"].append("页面无图片")
        result["score"] = score
        return result

    total = len(images)
    no_alt = sum(1 for img in images if not img.get("alt", "").strip())
    no_src = sum(1 for img in images if not img.get("src", ""))

    result["details"].append(f"图片总数: {total}")

    if no_alt > 0:
        alt_penalty = min(5, no_alt)
        score -= alt_penalty
        result["issues"].append(f"{no_alt}/{total} 张图片缺少 ALT 标签")
    else:
        result["details"].append("✓ 所有图片都有 ALT 标签")

    if no_src > 0:
        score -= 2
        result["issues"].append(f"{no_src} 张图片缺少 src 属性")

    # 检查图片文件名是否描述性
    generic_names = 0
    for img in images:
        src = img.get("src", "")
        filename = src.split("/")[-1].split("?")[0] if src else ""
        if re.match(r'(img|image|photo|pic)\d*\.(jpg|png|webp)', filename, re.I):
            generic_names += 1
    if generic_names > 0:
        score -= 1
        result["details"].append(f"{generic_names} 张图片使用通用文件名")

    result["score"] = max(0, score)
    return result


def check_internal_links(soup: BeautifulSoup, base_domain: str) -> dict:
    """检查内链"""
    result = {"score": 0, "max_score": SCORE_CONFIG["internal_links"], "issues": [], "details": []}
    score = result["max_score"]

    links = soup.find_all("a", href=True)
    internal_links = []
    external_links = []

    for link in links:
        href = link["href"]
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        href_parsed = urlparse(href)
        if not href_parsed.netloc or href_parsed.netloc == base_domain:
            internal_links.append(href)
        else:
            external_links.append(href)

    # 排除导航等重复链接后统计独特内链
    unique_internal = len(set(internal_links))
    result["details"].append(f"独特内链: {unique_internal}（总内链: {len(internal_links)}）")
    result["details"].append(f"外链: {len(external_links)}")

    if unique_internal < 3:
        score -= 5
        result["issues"].append(f"内链过少 ({unique_internal}，建议 >= 5)")
    elif unique_internal < 5:
        score -= 2
        result["issues"].append(f"内链偏少 ({unique_internal}，建议 >= 5)")
    else:
        result["details"].append("✓ 内链数量充足")

    # 是否有外链到权威来源
    if external_links:
        result["details"].append("✓ 包含外部链接（引用权威来源）")
    else:
        score -= 2
        result["details"].append("建议添加外链到权威来源")

    result["score"] = max(0, score)
    return result


def check_eeat_signals(soup: BeautifulSoup) -> dict:
    """检查 E-E-A-T 信号"""
    result = {"score": 0, "max_score": SCORE_CONFIG["eeat_signals"], "issues": [], "details": []}
    score = result["max_score"]
    text = soup.get_text(separator=' ', strip=True).lower()

    # 第一人称经验
    first_person = any(w in text for w in ["i found", "i tried", "in my experience",
                                             "i tested", "we found", "our team",
                                             "personally", "my experience"])
    if first_person:
        result["details"].append("✓ 包含第一人称经验")
    else:
        score -= 2
        result["details"].append("建议添加第一人称经验分享")

    # 引用来源
    has_citations = bool(soup.find_all("a", href=re.compile(r'(doi|pubmed|wikipedia|gov|edu|research)', re.I)))
    blockquotes = soup.find_all("blockquote")
    if has_citations or blockquotes:
        result["details"].append("✓ 包含引用/来源")
    else:
        score -= 2
        result["details"].append("建议添加信息来源引用")

    # 作者信息
    author_meta = soup.find("meta", attrs={"name": re.compile("author", re.I)})
    author_link = soup.find("a", href=re.compile(r'author', re.I))
    if author_meta or author_link:
        result["details"].append("✓ 包含作者信息")
    else:
        score -= 2
        result["issues"].append("缺少作者信息")

    # 日期/更新时间
    time_tags = soup.find_all(["time", "meta"], attrs={"content": re.compile(r'\d{4}-\d{2}')})
    date_published = soup.find("meta", property="article:published_time")
    date_modified = soup.find("meta", property="article:modified_time")
    if date_published or date_modified or time_tags:
        result["details"].append("✓ 包含发布/更新日期")
    else:
        score -= 2
        result["details"].append("建议显示内容更新日期")

    result["score"] = max(0, score)
    return result


# ── 综合审计 ──────────────────────────────────────────────────────────────────

def audit_single_page(url: str, target_keyword: str = "") -> dict:
    """对单个页面执行完整的 On-Page SEO 审计"""
    parsed = urlparse(url)
    base_domain = parsed.netloc

    result = {
        "url": url,
        "domain": base_domain,
        "checks": {},
        "total_score": 0,
        "max_score": sum(SCORE_CONFIG.values()),
        "percentage": 0,
        "all_issues": [],
        "status": "ok",
        "error": "",
    }

    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # 执行所有检查
        result["checks"]["url_structure"] = check_url_structure(url)
        result["checks"]["title"] = check_title(soup)
        result["checks"]["meta_description"] = check_meta_description(soup)
        result["checks"]["headings"] = check_headings(soup)
        result["checks"]["content"] = check_content(soup, target_keyword)
        result["checks"]["images"] = check_images(soup)
        result["checks"]["internal_links"] = check_internal_links(soup, base_domain)
        result["checks"]["eeat_signals"] = check_eeat_signals(soup)

        # 汇总分数
        total = sum(c["score"] for c in result["checks"].values())
        result["total_score"] = total
        result["percentage"] = round(total / result["max_score"] * 100, 1)

        # 汇总问题
        for check_name, check_result in result["checks"].items():
            result["all_issues"].extend(check_result["issues"])

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)[:80]

    return result


# ── 报告生成 ──────────────────────────────────────────────────────────────────

def generate_report(results: list[dict]) -> str:
    """生成 On-Page SEO 检查报告"""
    ok_results = [r for r in results if r["status"] == "ok"]
    err_results = [r for r in results if r["status"] == "error"]

    avg_score = round(sum(r["percentage"] for r in ok_results) / max(len(ok_results), 1), 1)

    lines = [
        "# On-Page SEO 检查报告\n",
        f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 审计页面: {len(results)}（成功 {len(ok_results)}，失败 {len(err_results)}）",
        f"> 平均得分: {avg_score}%\n",
        "---\n",
        "## 一、页面评分总览\n",
        "| URL | 得分 | URL结构 | Title | Meta | H标签 | 内容 | 图片 | 内链 | E-E-A-T |",
        "|-----|------|---------|-------|------|-------|------|------|------|---------|",
    ]

    for r in sorted(ok_results, key=lambda x: x["percentage"]):
        checks = r["checks"]
        short_url = r["url"][:45] + "..." if len(r["url"]) > 45 else r["url"]
        row = f"| {short_url} | **{r['percentage']}%** |"
        for check_key in ["url_structure", "title", "meta_description", "headings",
                          "content", "images", "internal_links", "eeat_signals"]:
            c = checks.get(check_key, {})
            pct = round(c.get("score", 0) / max(c.get("max_score", 1), 1) * 100)
            icon = "🟢" if pct >= 80 else "🟡" if pct >= 50 else "🔴"
            row += f" {icon} |"
        lines.append(row)

    # 各页面详细分析
    for r in ok_results:
        lines += [
            f"\n---\n\n## 详细分析: [{r['url'][:60]}]({r['url']})\n",
            f"**总得分: {r['percentage']}%** ({r['total_score']}/{r['max_score']})\n",
        ]
        for check_name, check_result in r["checks"].items():
            pct = round(check_result["score"] / max(check_result["max_score"], 1) * 100)
            icon = "🟢" if pct >= 80 else "🟡" if pct >= 50 else "🔴"
            lines.append(f"### {icon} {check_name.replace('_', ' ').title()} ({pct}%)\n")
            for detail in check_result["details"]:
                lines.append(f"- {detail}")
            for issue in check_result["issues"]:
                lines.append(f"- ⚠️ {issue}")
            lines.append("")

    # 常见问题汇总
    all_issues = []
    for r in ok_results:
        all_issues.extend(r["all_issues"])

    if all_issues:
        issue_counts = Counter(all_issues)
        lines += [
            "---\n\n## 常见问题 TOP 10\n",
            "| 问题 | 出现次数 |",
            "|------|---------|",
        ]
        for issue, count in issue_counts.most_common(10):
            lines.append(f"| {issue} | {count} |")

    return "\n".join(lines)


# ── URL 加载 ──────────────────────────────────────────────────────────────────

def load_urls(args_input: str) -> list[str]:
    """加载 URL 列表"""
    if args_input.startswith('http'):
        # 尝试作为 sitemap 加载
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
        # 单个 URL
        return [args_input]
    else:
        # 本地文件
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
        description="On-Page SEO 检查工具 - 评估页面的 SEO 优化水平"
    )
    parser.add_argument(
        "--input", required=True,
        help="输入: 单个 URL、sitemap URL 或本地 URL 文件"
    )
    parser.add_argument(
        "--keyword", default="",
        help="目标关键词（用于检查关键词密度和位置）"
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
        help="限制检查的最大 URL 数（0 = 不限制）"
    )
    args = parser.parse_args()

    urls = load_urls(args.input)
    if args.limit:
        urls = urls[:args.limit]

    print(f"📋 共 {len(urls)} 个 URL，开始 On-Page SEO 检查...")
    if args.keyword:
        print(f"🎯 目标关键词: {args.keyword}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 并发审计
    results = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {executor.submit(audit_single_page, url, args.keyword): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            results.append(result)
            if result["status"] == "ok":
                icon = "🟢" if result["percentage"] >= 80 else "🟡" if result["percentage"] >= 50 else "🔴"
                print(f"  [{i:4d}/{len(urls)}] {icon} {result['percentage']:5.1f}%  {futures[future][:60]}")
            else:
                print(f"  [{i:4d}/{len(urls)}] ✗ {result['error'][:40]}  {futures[future][:60]}")
            time.sleep(args.delay)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    report_path = os.path.join(OUTPUT_DIR, f"onpage_seo_report_{timestamp}.md")
    csv_path = os.path.join(OUTPUT_DIR, f"onpage_seo_scores_{timestamp}.csv")

    report = generate_report(results)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存 CSV
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "得分%", "问题数", "问题列表"])
        for r in results:
            if r["status"] == "ok":
                writer.writerow([r["url"], r["percentage"],
                                 len(r["all_issues"]), "; ".join(r["all_issues"])])

    ok_results = [r for r in results if r["status"] == "ok"]
    avg = round(sum(r["percentage"] for r in ok_results) / max(len(ok_results), 1), 1)

    print(f"\n✅ 检查完成！")
    print(f"  📋 On-Page SEO 报告: {report_path}")
    print(f"  📄 评分 CSV: {csv_path}")
    print(f"  📊 平均得分: {avg}%")


if __name__ == "__main__":
    main()
