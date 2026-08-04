#!/usr/bin/env python3
"""
content_originality_checker.py - 站外原创性检测工具
输入: 目标页面 URL + 竞品 URL 列表（或自动从 Google 搜索获取）
处理: 抓取页面正文 → 逐段与竞品比对 N-gram 重合度 → 输出原创性评分
输出: 原创性分析报告（Markdown）+ 段落级对比 CSV
"""

import requests
import argparse
import csv
import os
import re
import time
import json
from datetime import datetime
from urllib.parse import urlparse, quote_plus
from collections import Counter

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
# N-gram 参数
NGRAM_SIZE = 3  # 使用 trigram
# 原创性评分阈值
ORIGINALITY_HIGH = 80    # >= 80% 高原创
ORIGINALITY_MEDIUM = 50  # >= 50% 中等原创
# 段落最少词数（低于此值跳过比对）
MIN_PARAGRAPH_WORDS = 20


# ── 文本处理 ──────────────────────────────────────────────────────────────────

def extract_page_text(url: str) -> dict:
    """抓取页面并提取正文文本，按段落分割"""
    result = {
        "url": url,
        "title": "",
        "paragraphs": [],  # 段落列表
        "full_text": "",
        "word_count": 0,
        "status": "ok",
        "error": "",
    }
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # 移除无关标签
        for tag in soup.find_all(['script', 'style', 'nav', 'footer', 'header',
                                   'aside', 'noscript', 'iframe', 'form']):
            tag.decompose()

        # 提取标题
        title_tag = soup.find("title")
        result["title"] = title_tag.get_text(strip=True) if title_tag else ""

        # 提取正文
        main_content = soup.find('article') or soup.find('main') or soup.find('body')
        if main_content:
            # 按段落标签分割
            para_tags = main_content.find_all(['p', 'li', 'td', 'blockquote'])
            paragraphs = []
            for tag in para_tags:
                text = tag.get_text(strip=True)
                words = text.split()
                if len(words) >= MIN_PARAGRAPH_WORDS:
                    paragraphs.append(text)

            result["paragraphs"] = paragraphs
            result["full_text"] = " ".join(paragraphs)
            result["word_count"] = len(result["full_text"].split())
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


def normalize_text(text: str) -> str:
    """文本标准化：小写、去标点、去多余空格"""
    text = text.lower()
    # 保留字母、数字和空格
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def get_ngrams(text: str, n: int = NGRAM_SIZE) -> set:
    """提取 N-gram 集合"""
    words = normalize_text(text).split()
    if len(words) < n:
        return set()
    return set(tuple(words[i:i+n]) for i in range(len(words) - n + 1))


# ── 原创性比对 ────────────────────────────────────────────────────────────────

def compare_paragraph(para_text: str, competitor_ngrams: set) -> dict:
    """将单段落与竞品 N-gram 集合比对"""
    para_ngrams = get_ngrams(para_text)
    if not para_ngrams:
        return {"overlap_count": 0, "overlap_pct": 0, "total_ngrams": 0}

    overlap = para_ngrams & competitor_ngrams
    overlap_pct = round(len(overlap) / len(para_ngrams) * 100, 1) if para_ngrams else 0

    return {
        "overlap_count": len(overlap),
        "overlap_pct": overlap_pct,
        "total_ngrams": len(para_ngrams),
    }


def analyze_originality(target: dict, competitors: list[dict]) -> dict:
    """分析目标页面相对所有竞品的原创性"""
    # 构建竞品合并 N-gram 集合
    all_competitor_ngrams = set()
    competitor_ngram_map = {}  # 每个竞品单独的 ngram

    for comp in competitors:
        if comp["status"] != "ok":
            continue
        comp_ngrams = get_ngrams(comp["full_text"])
        competitor_ngram_map[comp["url"]] = comp_ngrams
        all_competitor_ngrams |= comp_ngrams

    # 逐段落比对
    paragraph_results = []
    for i, para in enumerate(target["paragraphs"]):
        # 与所有竞品合并集合比对
        vs_all = compare_paragraph(para, all_competitor_ngrams)

        # 找出最相似的竞品
        best_match_url = ""
        best_match_pct = 0
        per_competitor = {}
        for comp_url, comp_ng in competitor_ngram_map.items():
            result = compare_paragraph(para, comp_ng)
            per_competitor[comp_url] = result["overlap_pct"]
            if result["overlap_pct"] > best_match_pct:
                best_match_pct = result["overlap_pct"]
                best_match_url = comp_url

        paragraph_results.append({
            "index": i + 1,
            "text_preview": para[:80] + "..." if len(para) > 80 else para,
            "word_count": len(para.split()),
            "overlap_vs_all_pct": vs_all["overlap_pct"],
            "best_match_url": best_match_url,
            "best_match_pct": best_match_pct,
            "originality_score": round(100 - vs_all["overlap_pct"], 1),
            "per_competitor": per_competitor,
        })

    # 整体原创性评分
    if paragraph_results:
        avg_originality = sum(p["originality_score"] for p in paragraph_results) / len(paragraph_results)
        min_originality = min(p["originality_score"] for p in paragraph_results)
    else:
        avg_originality = 100
        min_originality = 100

    return {
        "target_url": target["url"],
        "target_title": target["title"],
        "target_word_count": target["word_count"],
        "competitors_count": len([c for c in competitors if c["status"] == "ok"]),
        "avg_originality": round(avg_originality, 1),
        "min_originality": round(min_originality, 1),
        "paragraph_results": paragraph_results,
    }


# ── 报告生成 ──────────────────────────────────────────────────────────────────

def generate_report(analysis: dict, competitor_urls: list[str]) -> str:
    """生成原创性分析报告"""
    avg = analysis["avg_originality"]
    if avg >= ORIGINALITY_HIGH:
        grade = "🟢 高原创"
    elif avg >= ORIGINALITY_MEDIUM:
        grade = "🟡 中等原创"
    else:
        grade = "🔴 低原创"

    lines = [
        "# 站外原创性检测报告\n",
        f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 目标页面: [{analysis['target_title'][:60]}]({analysis['target_url']})",
        f"> 目标字数: {analysis['target_word_count']}",
        f"> 对比竞品: {analysis['competitors_count']} 个\n",
        "---\n",
        f"## 总体评分: {avg}% — {grade}\n",
    ]

    # 评分等级说明
    lines += [
        "| 等级 | 分数范围 | 含义 |",
        "|------|---------|------|",
        f"| 🟢 高原创 | >= {ORIGINALITY_HIGH}% | 内容独特性良好 |",
        f"| 🟡 中等 | {ORIGINALITY_MEDIUM}-{ORIGINALITY_HIGH-1}% | 部分段落需要重写 |",
        f"| 🔴 低原创 | < {ORIGINALITY_MEDIUM}% | 内容大量雷同，需要大幅修改 |\n",
    ]

    # 段落级分析
    para_results = analysis["paragraph_results"]
    if para_results:
        lines += [
            "---\n",
            "## 段落级原创性分析\n",
            "| # | 原创性 | 最相似竞体重合 | 段落预览 |",
            "|---|--------|--------------|---------|",
        ]
        for p in para_results:
            if p["originality_score"] >= ORIGINALITY_HIGH:
                icon = "🟢"
            elif p["originality_score"] >= ORIGINALITY_MEDIUM:
                icon = "🟡"
            else:
                icon = "🔴"
            preview = p["text_preview"].replace("|", "/")
            lines.append(f"| {p['index']} | {icon} {p['originality_score']}% | {p['best_match_pct']}% | {preview} |")

    # 高重合段落详情
    low_orig = [p for p in para_results if p["originality_score"] < ORIGINALITY_MEDIUM]
    if low_orig:
        lines += [
            f"\n---\n\n## ⚠️ 需要修改的段落（{len(low_orig)} 段）\n",
        ]
        for p in low_orig:
            lines.append(f"### 段落 {p['index']}（原创性 {p['originality_score']}%）\n")
            lines.append(f"> {p['text_preview']}\n")
            lines.append("**竞体重合度：**")
            for comp_url, pct in sorted(p["per_competitor"].items(), key=lambda x: -x[1]):
                if pct > 5:
                    domain = urlparse(comp_url).netloc
                    lines.append(f"- {domain}: {pct}%")
            lines.append("")

    # 优化建议
    lines += [
        "---\n",
        "## 优化建议\n",
    ]
    if avg >= ORIGINALITY_HIGH:
        lines.append("- 内容原创性良好，继续保持")
        if low_orig:
            lines.append(f"- 仍有 {len(low_orig)} 段落重合度较高，建议针对性修改")
    elif avg >= ORIGINALITY_MEDIUM:
        lines.append(f"- 平均原创性 {avg}%，建议重点关注低分段落进行重写")
        lines.append("- 增加 Information Gain：添加竞品没有的数据、案例、个人观点")
        lines.append("- 调整内容结构和叙事角度，避免与竞品框架雷同")
    else:
        lines.append(f"- 平均原创性仅 {avg}%，建议大幅重写内容")
        lines.append("- 仅保留核心信息点，用完全不同的语言和结构重新表达")
        lines.append("- 加入第一手经验（E-E-A-T）来增加独特性")

    return "\n".join(lines)


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="站外原创性检测工具 - 对比目标页面与竞品的 N-gram 重合度"
    )
    parser.add_argument(
        "--target", required=True,
        help="目标页面 URL"
    )
    parser.add_argument(
        "--competitors", required=True,
        help="竞品 URL 列表文件（每行一个 URL 的 TXT，或含 url 列的 CSV）"
    )
    parser.add_argument(
        "--ngram", type=int, default=NGRAM_SIZE,
        help=f"N-gram 大小（默认 {NGRAM_SIZE}，增大则比对更严格）"
    )
    args = parser.parse_args()

    print(f"🎯 目标页面: {args.target}")

    # 加载竞品 URL
    comp_urls = []
    if args.competitors.endswith('.csv'):
        with open(args.competitors, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row.get('url', '').strip()
                if url:
                    comp_urls.append(url)
    else:
        with open(args.competitors, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    comp_urls.append(line)

    print(f"📋 竞品页面: {len(comp_urls)} 个")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 抓取目标页面
    print("\n📡 抓取目标页面...")
    target = extract_page_text(args.target)
    if target["status"] != "ok":
        print(f"❌ 目标页面抓取失败: {target['error']}")
        return
    print(f"  ✓ {target['title'][:60]} — {target['word_count']} 词, {len(target['paragraphs'])} 段落")

    # 抓取竞品页面
    print("\n📡 抓取竞品页面...")
    competitors = []
    for i, url in enumerate(comp_urls, 1):
        comp = extract_page_text(url)
        competitors.append(comp)
        icon = "✓" if comp["status"] == "ok" else "✗"
        domain = urlparse(url).netloc
        print(f"  [{i:2d}/{len(comp_urls)}] {icon} {domain} — {comp.get('word_count', 0)} 词")
        time.sleep(0.5)

    # 分析
    print("\n🔍 开始原创性分析...")
    analysis = analyze_originality(target, competitors)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    domain = urlparse(args.target).netloc
    report_path = os.path.join(OUTPUT_DIR, f"originality_{domain}_{timestamp}.md")
    csv_path = os.path.join(OUTPUT_DIR, f"originality_paragraphs_{domain}_{timestamp}.csv")

    report = generate_report(analysis, comp_urls)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存段落级 CSV
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["段落#", "原创性%", "最相似竞体%", "最相似竞体URL", "词数", "段落预览"])
        for p in analysis["paragraph_results"]:
            writer.writerow([
                p["index"], p["originality_score"], p["best_match_pct"],
                p["best_match_url"], p["word_count"], p["text_preview"]
            ])

    print(f"\n✅ 分析完成！")
    print(f"  📋 原创性报告: {report_path}")
    print(f"  📄 段落级 CSV: {csv_path}")
    print(f"  📊 总体原创性: {analysis['avg_originality']}%")
    print(f"     最低段落原创性: {analysis['min_originality']}%")


if __name__ == "__main__":
    main()
