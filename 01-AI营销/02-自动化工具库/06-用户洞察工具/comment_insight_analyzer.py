#!/usr/bin/env python3
"""
comment_insight_analyzer.py - 评论/反馈智能分析工具
输入: 评论数据（支持多种来源格式）
处理: 自动分类（问题/购买意向/抱怨/功能建议/合作询盘/地域需求）
      → 提取高频话题 → 发现内容选题 → 识别产品痛点 → 筛选商业线索
输出: 评论洞察报告（Markdown）+ 分类结果 CSV + 选题建议 CSV
"""

import argparse
import csv
import os
import re
import json
from datetime import datetime
from collections import Counter, defaultdict

# ── 配置 ──────────────────────────────────────────────────────────────────────
OUTPUT_DIR = "results"

# 评论分类规则（关键词匹配 + 权重）
CATEGORY_RULES = {
    "问题求助": {
        "keywords": ["how do", "how to", "how can", "where is", "where can",
                      "what is", "why does", "why is", "help", "can't",
                      "doesn't work", "not working", "problem", "issue",
                      "trouble", "broken", "error", "stuck",
                      "怎么", "如何", "为什么", "哪里", "求助", "问题"],
        "weight": 1.0,
    },
    "购买意向": {
        "keywords": ["where to buy", "buy this", "want to buy", "price",
                      "how much", "discount", "coupon", "sale", "order",
                      "shipping", "delivery", "available in",
                      "link", "shop link", "purchase", "can i get",
                      "购买", "价格", "多少钱", "哪里买", "链接"],
        "weight": 1.5,
    },
    "投诉抱怨": {
        "keywords": ["terrible", "horrible", "worst", "waste", "scam",
                      "disappointed", "never again", "refund", "return",
                      "bad quality", "cheap", "broke", "fell apart",
                      "not worth", "overpriced", "false advertising",
                      "垃圾", "差评", "退款", "质量差", "失望"],
        "weight": 1.2,
    },
    "功能建议": {
        "keywords": ["should add", "would be great if", "wish it had",
                      "need a", "could you", "feature request",
                      "suggestion", "improve", "it would be nice",
                      "missing", "希望", "建议", "能不能", "改进"],
        "weight": 1.0,
    },
    "合作询盘": {
        "keywords": ["collaboration", "partnership", "sponsor", "business",
                      "wholesale", "bulk order", "distributor", "affiliate",
                      "influencer", "brand deal", "PR",
                      "合作", "代理", "批发", "商务"],
        "weight": 2.0,
    },
    "地域需求": {
        "keywords": ["ship to", "available in", "do you deliver to",
                      "in my country", "international shipping",
                      "any store in", "stockist in",
                      "能发到", "国内有", "海外"],
        "weight": 1.3,
    },
    "正面反馈": {
        "keywords": ["love", "great", "amazing", "awesome", "perfect",
                      "best", "beautiful", "exactly what", "highly recommend",
                      "thank you", "helped me", "life changing",
                      "喜欢", "好评", "推荐", "感谢", "太好了"],
        "weight": 0.5,
    },
    "争议讨论": {
        "keywords": ["actually", "but i think", "disagree", "wrong",
                      "not true", "myth", "fake", "controversial",
                      "evidence", "study", "research shows",
                      "反对", "不同意", "假的", "伪科学"],
        "weight": 1.0,
    },
}

# 内容选题信号词（暗示用户想要更多相关内容）
TOPIC_SIGNALS = {
    "教程需求": ["tutorial", "step by step", "how to", "guide", "learn",
                  "beginner", "starter", "入门", "教程", "新手"],
    "对比需求": ["vs", "versus", "compare", "difference", "which one",
                  "better", "对比", "区别", "哪个好"],
    "体验分享": ["my experience", "i tried", "i used", "results",
                  "before after", "review", "我的体验", "效果"],
    "知识科普": ["what is", "explain", "meaning", "science behind",
                  "why does", "原理", "是什么", "为什么"],
    "清单合集": ["list of", "types of", "best", "top", "recommend",
                  "推荐", "清单", "排行"],
}


# ── 分类引擎 ──────────────────────────────────────────────────────────────────

def classify_comment(text: str) -> list[dict]:
    """对单条评论进行分类，返回匹配到的类别及得分"""
    text_lower = text.lower()
    matches = []

    for category, rule in CATEGORY_RULES.items():
        score = 0
        matched_keywords = []
        for kw in rule["keywords"]:
            if kw in text_lower:
                score += rule["weight"]
                matched_keywords.append(kw)

        if score > 0:
            matches.append({
                "category": category,
                "score": score,
                "matched_keywords": matched_keywords,
            })

    # 按得分降序排列
    matches.sort(key=lambda x: -x["score"])
    return matches


def detect_topic_signals(text: str) -> list[str]:
    """检测评论中的内容选题信号"""
    text_lower = text.lower()
    signals = []
    for signal_type, keywords in TOPIC_SIGNALS.items():
        for kw in keywords:
            if kw in text_lower:
                signals.append(signal_type)
                break
    return signals


def extract_sentiment(text: str) -> str:
    """简单情感判断"""
    text_lower = text.lower()
    positive_words = ["love", "great", "amazing", "awesome", "perfect", "best",
                      "beautiful", "thank", "happy", "excellent", "wonderful",
                      "helpful", "recommend", "like", "good"]
    negative_words = ["terrible", "horrible", "worst", "hate", "bad", "awful",
                      "disappointed", "waste", "scam", "broken", "cheap",
                      "overpriced", "refund", "return", "never"]

    pos_count = sum(1 for w in positive_words if w in text_lower)
    neg_count = sum(1 for w in negative_words if w in text_lower)

    if pos_count > neg_count:
        return "正面"
    elif neg_count > pos_count:
        return "负面"
    else:
        return "中性"


# ── 批量分析 ──────────────────────────────────────────────────────────────────

def analyze_comments(comments: list[dict]) -> dict:
    """批量分析评论数据"""
    results = {
        "total": len(comments),
        "by_category": defaultdict(list),
        "by_sentiment": Counter(),
        "topic_signals": Counter(),
        "high_value": [],           # 高价值评论（购买意向/合作询盘）
        "content_gaps": [],         # 内容选题建议
        "product_pain_points": [],  # 产品痛点
        "regional_demand": Counter(),
        "keyword_frequency": Counter(),
    }

    for comment in comments:
        text = comment.get("text", comment.get("content", ""))
        if not text:
            continue

        # 分类
        categories = classify_comment(text)
        primary_category = categories[0]["category"] if categories else "未分类"

        comment_result = {
            **comment,
            "text": text,
            "categories": [c["category"] for c in categories],
            "primary_category": primary_category,
            "sentiment": extract_sentiment(text),
            "topic_signals": detect_topic_signals(text),
            "score": categories[0]["score"] if categories else 0,
        }

        # 按类别归档
        for cat in [primary_category] if primary_category != "未分类" else []:
            results["by_category"][cat].append(comment_result)

        # 情感统计
        results["by_sentiment"][comment_result["sentiment"]] += 1

        # 选题信号
        for signal in comment_result["topic_signals"]:
            results["topic_signals"][signal] += 1

        # 高价值评论
        if primary_category in ["购买意向", "合作询盘"]:
            results["high_value"].append(comment_result)

        # 产品痛点
        if primary_category == "投诉抱怨":
            results["product_pain_points"].append(comment_result)

        # 地域需求
        if primary_category == "地域需求":
            # 尝试提取国家/地区名
            for pattern in [r'in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)',
                            r'to ([A-Z][a-z]+(?: [A-Z][a-z]+)*)']:
                matches = re.findall(pattern, text)
                for m in matches:
                    results["regional_demand"][m] += 1

        # 内容选题建议
        if comment_result["topic_signals"]:
            results["content_gaps"].append(comment_result)

        # 关键词频率
        words = re.findall(r'[a-z]{4,}', text.lower())
        for w in words:
            results["keyword_frequency"][w] += 1

    return results


# ── 报告生成 ──────────────────────────────────────────────────────────────────

def generate_report(analysis: dict, source_info: str) -> str:
    """生成评论洞察报告"""
    total = analysis["total"]
    lines = [
        "# 评论/反馈洞察分析报告\n",
        f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 数据来源: {source_info}",
        f"> 评论总数: {total}\n",
        "---\n",
    ]

    # 一、分类分布
    lines.append("## 一、评论分类分布\n")
    lines.append("| 类别 | 数量 | 占比 | 价值等级 |")
    lines.append("|------|------|------|---------|")

    value_map = {"合作询盘": "💰 高", "购买意向": "💰 高", "投诉抱怨": "⚠️ 中",
                 "地域需求": "🌍 中", "功能建议": "💡 中", "问题求助": "💡 中",
                 "争议讨论": "📊 低", "正面反馈": "✅ 低", "未分类": "— 低"}

    for cat, items in sorted(analysis["by_category"].items(), key=lambda x: -len(x[1])):
        pct = round(len(items) / total * 100, 1)
        value = value_map.get(cat, "—")
        lines.append(f"| {cat} | {len(items)} | {pct}% | {value} |")

    uncategorized = total - sum(len(items) for items in analysis["by_category"].values())
    if uncategorized > 0:
        lines.append(f"| 未分类 | {uncategorized} | {round(uncategorized/total*100, 1)}% | — 低 |")

    # 二、情感分布
    lines += [
        "\n---\n\n## 二、情感分布\n",
        "| 情感 | 数量 | 占比 |",
        "|------|------|------|",
    ]
    for sentiment in ["正面", "中性", "负面"]:
        count = analysis["by_sentiment"].get(sentiment, 0)
        pct = round(count / total * 100, 1) if total else 0
        lines.append(f"| {sentiment} | {count} | {pct}% |")

    # 三、高价值评论
    high_value = analysis["high_value"]
    if high_value:
        lines += [
            f"\n---\n\n## 三、💰 高价值评论（购买意向 + 合作询盘）：{len(high_value)} 条\n",
        ]
        for item in high_value[:30]:
            preview = item["text"][:80].replace("|", "/")
            lines.append(f"- **[{item['primary_category']}]** {preview}")
            if item.get("author"):
                lines[-1] += f" — _{item['author']}_"
        if len(high_value) > 30:
            lines.append(f"- ... 共 {len(high_value)} 条")

    # 四、内容选题建议
    topic_signals = analysis["topic_signals"]
    if topic_signals:
        lines += [
            f"\n---\n\n## 四、内容选题信号\n",
            "| 选题类型 | 出现次数 | 建议行动 |",
            "|---------|---------|---------|",
        ]
        action_map = {
            "教程需求": "制作 How-to 教程内容",
            "对比需求": "写竞品对比/选购指南",
            "体验分享": "增加用户案例/UGC内容",
            "知识科普": "补充 What is/Why 科普文章",
            "清单合集": "制作 Best/Top 排行内容",
        }
        for signal, count in topic_signals.most_common():
            action = action_map.get(signal, "分析具体评论")
            lines.append(f"| {signal} | {count} | {action} |")

        # 具体选题建议
        content_gaps = analysis["content_gaps"]
        if content_gaps:
            lines += [
                "\n### 具体选题建议（来自评论原文）\n",
            ]
            seen_signals = set()
            for item in content_gaps[:20]:
                signal_str = ", ".join(item["topic_signals"])
                key = f"{signal_str}_{item['text'][:30]}"
                if key not in seen_signals:
                    seen_signals.add(key)
                    preview = item["text"][:100].replace("|", "/")
                    lines.append(f"- **{signal_str}**: \"{preview}\"")

    # 五、产品痛点
    pain_points = analysis["product_pain_points"]
    if pain_points:
        lines += [
            f"\n---\n\n## 五、⚠️ 产品痛点（用户投诉/抱怨）：{len(pain_points)} 条\n",
        ]
        # 提取高频痛点关键词
        pain_keywords = Counter()
        for item in pain_points:
            for cat_info in classify_comment(item["text"]):
                for kw in cat_info.get("matched_keywords", []):
                    pain_keywords[kw] += 1

        if pain_keywords:
            lines.append("**高频痛点关键词：**\n")
            for kw, count in pain_keywords.most_common(15):
                lines.append(f"- `{kw}` × {count}")
            lines.append("")

        lines.append("**代表性投诉：**\n")
        for item in pain_points[:10]:
            preview = item["text"][:100].replace("|", "/")
            lines.append(f"- {preview}")

    # 六、地域需求
    regional = analysis["regional_demand"]
    if regional:
        lines += [
            f"\n---\n\n## 六、🌍 地域需求信号\n",
            "| 地区 | 提及次数 | 建议 |",
            "|------|---------|------|",
        ]
        for region, count in regional.most_common(10):
            lines.append(f"| {region} | {count} | 评估是否开通该地区配送/本地化 |")

    # 七、高频词
    kw_freq = analysis["keyword_frequency"]
    if kw_freq:
        # 过滤停用词
        stop = {'that', 'this', 'with', 'have', 'been', 'they', 'them',
                'their', 'would', 'could', 'should', 'about', 'which',
                'when', 'what', 'your', 'were', 'some', 'than', 'also',
                'very', 'just', 'like', 'know', 'think', 'really', 'much',
                'more', 'most', 'other', 'into', 'could', 'these', 'those',
                'does', 'doing', 'because', 'being', 'after', 'before'}
        filtered = {k: v for k, v in kw_freq.items() if k not in stop and v >= 2}
        if filtered:
            lines += [
                f"\n---\n\n## 七、高频词 TOP 20\n",
                "| 关键词 | 出现次数 |",
                "|--------|---------|",
            ]
            for kw, count in Counter(filtered).most_common(20):
                lines.append(f"| {kw} | {count} |")

    # 八、行动建议
    lines += [
        "\n---\n\n## 八、行动建议\n",
    ]
    suggestions = []
    if high_value:
        suggestions.append(f"1. **转化跟进** — {len(high_value)} 条购买/合作意向评论，优先回复并引导转化")
    if pain_points:
        suggestions.append(f"2. **修复痛点** — {len(pain_points)} 条投诉，整理后反馈产品/运营团队")
    if topic_signals:
        top_signal = topic_signals.most_common(1)[0]
        suggestions.append(f"3. **内容规划** — '{top_signal[0]}'类需求出现 {top_signal[1]} 次，优先制作对应内容")
    if regional:
        top_region = regional.most_common(1)[0]
        suggestions.append(f"4. **市场扩展** — {top_region[0]} 需求最高 ({top_region[1]} 次)，评估本地化可行性")
    if not suggestions:
        suggestions.append("评论数据暂无明显行动信号，建议积累更多数据后再次分析。")

    lines.extend(suggestions)

    return "\n".join(lines)


# ── 数据加载 ──────────────────────────────────────────────────────────────────

def load_comments(args_input: str) -> list[dict]:
    """加载评论数据，支持多种格式"""
    comments = []

    if args_input.endswith('.json'):
        with open(args_input, encoding='utf-8') as f:
            data = json.load(f)
        # 支持多种 JSON 结构
        if isinstance(data, list):
            comments = data
        elif isinstance(data, dict):
            # YouTube API 格式
            if 'items' in data:
                for item in data['items']:
                    snippet = item.get('snippet', {})
                    top_comment = snippet.get('topLevelComment', {}).get('snippet', {})
                    comments.append({
                        "text": top_comment.get("textDisplay", ""),
                        "author": top_comment.get("authorDisplayName", ""),
                        "likes": top_comment.get("likeCount", 0),
                        "date": top_comment.get("publishedAt", ""),
                        "source": "youtube",
                    })
            else:
                comments = [data]

    elif args_input.endswith('.csv'):
        with open(args_input, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 兼容多种字段名
                text = row.get("text") or row.get("comment") or row.get("content") or row.get("body") or ""
                author = row.get("author") or row.get("name") or row.get("user") or ""
                comments.append({
                    "text": text,
                    "author": author,
                    "likes": int(row.get("likes", row.get("likeCount", 0))),
                    "date": row.get("date", row.get("publishedAt", "")),
                    "source": row.get("source", "csv"),
                })

    else:  # 纯文本，每行一条评论
        with open(args_input, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    comments.append({"text": line, "source": "txt"})

    return comments


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="评论/反馈智能分析工具 - 分类、洞察、选题建议"
    )
    parser.add_argument(
        "--input", required=True,
        help="输入文件: 评论 CSV/JSON/TXT（CSV 支持列名: text/comment/content/body）"
    )
    parser.add_argument(
        "--source", default="",
        help="数据来源描述（如 'YouTube视频评论'、'竞品Amazon评论'）"
    )
    args = parser.parse_args()

    print(f"📁 加载评论数据: {args.input}")
    comments = load_comments(args.input)
    print(f"📋 共 {len(comments)} 条评论，开始分析...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 过滤空评论
    comments = [c for c in comments if c.get("text", "").strip()]
    print(f"  有效评论: {len(comments)} 条")

    # 分析
    analysis = analyze_comments(comments)

    # 保存报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    source_info = args.source or args.input
    report_path = os.path.join(OUTPUT_DIR, f"comment_insight_{timestamp}.md")
    classified_csv = os.path.join(OUTPUT_DIR, f"comments_classified_{timestamp}.csv")
    topics_csv = os.path.join(OUTPUT_DIR, f"content_topics_{timestamp}.csv")

    report = generate_report(analysis, source_info)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存分类结果 CSV
    with open(classified_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["原文", "主分类", "所有分类", "情感", "选题信号", "得分",
                          "作者", "点赞", "日期"])
        for cat_items in analysis["by_category"].values():
            for item in cat_items:
                writer.writerow([
                    item["text"][:200],
                    item["primary_category"],
                    "; ".join(item["categories"]),
                    item["sentiment"],
                    "; ".join(item["topic_signals"]) if item["topic_signals"] else "",
                    item["score"],
                    item.get("author", ""),
                    item.get("likes", 0),
                    item.get("date", ""),
                ])

    # 保存选题建议 CSV
    with open(topics_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["选题类型", "评论原文", "建议行动"])
        action_map = {
            "教程需求": "制作 How-to 教程",
            "对比需求": "写竞品对比/选购指南",
            "体验分享": "增加用户案例/UGC",
            "知识科普": "补充科普文章",
            "清单合集": "制作排行/清单",
        }
        for item in analysis["content_gaps"]:
            for signal in item["topic_signals"]:
                writer.writerow([
                    signal,
                    item["text"][:150],
                    action_map.get(signal, ""),
                ])

    # 汇总
    high_value_count = len(analysis["high_value"])
    pain_count = len(analysis["product_pain_points"])

    print(f"\n✅ 分析完成！")
    print(f"  📋 洞察报告: {report_path}")
    print(f"  📄 分类结果: {classified_csv}")
    print(f"  📄 选题建议: {topics_csv}")
    print(f"\n📊 汇总:")
    for cat, items in sorted(analysis["by_category"].items(), key=lambda x: -len(x[1])):
        print(f"  {cat:10s}: {len(items):4d} 条")
    if high_value_count:
        print(f"\n  💰 高价值评论（购买意向+合作）: {high_value_count} 条 ← 优先处理")
    if pain_count:
        print(f"  ⚠️  产品痛点: {pain_count} 条")


if __name__ == "__main__":
    main()
