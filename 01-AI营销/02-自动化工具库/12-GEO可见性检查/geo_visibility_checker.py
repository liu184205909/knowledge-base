#!/usr/bin/env python3
"""
geo_visibility_checker.py - GEO 可见性检查工具（Layer 1 数据采集）
基于 DataForSEO SERP API 搜索 Google 结果，检查品牌在 AI 生态中的可见性信号
输入: 品牌名、域名、品类关键词、竞品列表
输出: JSON（结构化数据，供 Layer 2 分析）+ Markdown 报告模板
"""

import requests
import json
import argparse
import os
import time
from datetime import datetime
from pathlib import Path

# ── 加载项目根目录 .env ───────────────────────────────────────────────────────
def _load_env_file(path):
    if path.exists():
        for line in path.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip())

_root = Path(__file__).resolve()
for parent in _root.parents:
    if (parent / '.gitignore').exists() or (parent / '.git').exists():
        _load_env_file(parent / '.env')
        break
_load_env_file(Path(__file__).parent / '.env')

# ── 配置 ──────────────────────────────────────────────────────────────────────
DFS_API_LOGIN = os.environ.get("DFS_API_LOGIN", "")
DFS_API_PASSWORD = os.environ.get("DFS_API_PASSWORD", "")
DFS_SERP_URL = "https://api.dataforseo.com/v3/serp/google/organic/live/advanced"
OUTPUT_DIR = "results"
REQUEST_TIMEOUT = 30
DEFAULT_DELAY = 0.5  # DataForSEO 速率控制


# ── DataForSEO SERP 搜索 ─────────────────────────────────────────────────────

def dfs_serp_search(keyword: str, location_name: str = "United States",
                    language_code: str = "en", depth: int = 10) -> dict | None:
    """通过 DataForSEO SERP API 搜索 Google"""
    if not DFS_API_LOGIN or not DFS_API_PASSWORD:
        print("  [X] Missing DFS_API_LOGIN or DFS_API_PASSWORD")
        print("    登录 DataForSEO 控制台获取: https://dataforseo.com")
        return None
    try:
        payload = [{
            "keyword": keyword,
            "location_name": location_name,
            "language_code": language_code,
            "depth": depth,
            "se_domain": "google.com"
        }]
        resp = requests.post(
            DFS_SERP_URL,
            auth=(DFS_API_LOGIN, DFS_API_PASSWORD),
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        resp.raise_for_status()
        data = resp.json()

        # DataForSEO 返回结构: {"tasks": [{"result": [...]}]}
        tasks = data.get("tasks", [])
        if not tasks:
            print(f"  [X] DataForSEO 无任务返回")
            return None

        task_result = tasks[0].get("result", [])
        if not task_result:
            status_msg = tasks[0].get("status_message", "unknown")
            print(f"  [X] DataForSEO 任务失败: {status_msg}")
            return None

        return task_result[0]  # 第一个 SERP 结果

    except requests.exceptions.Timeout:
        print(f"  [X] DataForSEO 请求超时（{REQUEST_TIMEOUT}s）")
        return None
    except Exception as e:
        print(f"  [X] DataForSEO 请求失败: {str(e)[:80]}")
        return None


def extract_organic_results(serp_data: dict) -> list[dict]:
    """从 DataForSEO SERP 数据中提取自然搜索结果"""
    if not serp_data:
        return []
    items = serp_data.get("items", [])
    organic = []
    for item in items:
        if item.get("type") == "organic":
            organic.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "description": item.get("description", ""),
                "position": item.get("rank_group", 0),
                "absolute_position": item.get("rank_absolute", 0)
            })
    return organic


def extract_knowledge_graph(serp_data: dict) -> dict:
    """从 DataForSEO SERP 数据中提取 Knowledge Graph"""
    if not serp_data:
        return {}
    items = serp_data.get("items", [])
    for item in items:
        if item.get("type") == "knowledge_graph":
            return {
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "url": item.get("url", "")
            }
    return {}


def extract_featured_snippet(serp_data: dict) -> dict:
    """从 DataForSEO SERP 数据中提取 Featured Snippet"""
    if not serp_data:
        return {}
    items = serp_data.get("items", [])
    for item in items:
        if item.get("type") == "featured_snippet":
            return {
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "url": item.get("url", "")
            }
    return {}


def extract_people_also_ask(serp_data: dict) -> list[str]:
    """从 DataForSEO SERP 数据中提取 People Also Ask"""
    if not serp_data:
        return []
    items = serp_data.get("items", [])
    questions = []
    for item in items:
        if item.get("type") == "people_also_ask":
            for el in item.get("items", []):
                q = el.get("title", "")
                if q:
                    questions.append(q)
    return questions[:10]


# ── 品牌提及检测 ─────────────────────────────────────────────────────────────

def find_brand_mentions(brand: str, organic_results: list[dict]) -> list[dict]:
    """在搜索结果中查找品牌提及"""
    if not organic_results:
        return []
    mentions = []
    brand_lower = brand.lower()
    brand_variants = [brand_lower, brand_lower.replace(" ", ""), brand_lower.replace(" ", "-")]

    for item in organic_results:
        title = item.get("title", "").lower()
        desc = item.get("description", "").lower()
        url = item.get("url", "").lower()
        matched = any(v in title or v in desc or v in url for v in brand_variants)
        if matched:
            mentions.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "snippet": item.get("description", "")[:200],
                "position": item.get("position", 0)
            })
    return mentions


def find_domain_mentions(domain: str, organic_results: list[dict]) -> list[dict]:
    """在搜索结果中查找域名提及"""
    if not organic_results:
        return []
    mentions = []
    domain_clean = domain.replace("www.", "").lower()

    for item in organic_results:
        url = item.get("url", "").lower()
        if domain_clean in url:
            mentions.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "snippet": item.get("description", "")[:200],
                "position": item.get("position", 0)
            })
    return mentions


# ── 七维度检查 ───────────────────────────────────────────────────────────────

def check_ai_overview(keyword: str, location_name: str, language_code: str) -> dict:
    """维度1: Google AI Overview / Featured Snippet / Knowledge Graph 检测"""
    serp_data = dfs_serp_search(keyword, location_name, language_code)
    if not serp_data:
        return {"appears": False, "source": "", "type": "none", "content": "",
                "people_also_ask": []}

    featured = extract_featured_snippet(serp_data)
    kg = extract_knowledge_graph(serp_data)
    paa = extract_people_also_ask(serp_data)

    has_featured = bool(featured)
    has_kg = bool(kg)

    content_parts = []
    source_url = ""
    snippet_type = "none"

    if has_featured:
        snippet_type = "featured_snippet"
        content_parts.append(featured.get("title", ""))
        content_parts.append(featured.get("description", ""))
        source_url = featured.get("url", "")

    if has_kg:
        snippet_type = "knowledge_graph" if not has_featured else "both"
        content_parts.append(kg.get("title", ""))
        content_parts.append(kg.get("description", ""))

    content = " ".join(filter(None, content_parts)).strip()

    return {
        "appears": has_featured or has_kg,
        "source": source_url,
        "type": snippet_type,
        "content": content[:500],
        "people_also_ask": paa
    }


def check_reddit(brand: str, keyword: str, location_name: str, language_code: str) -> dict:
    """维度2: Reddit 讨论可见性"""
    query = f"site:reddit.com {keyword} recommendation OR review OR best"
    serp_data = dfs_serp_search(query, location_name, language_code)
    organic = extract_organic_results(serp_data)
    brand_mentions = find_brand_mentions(brand, organic)
    total_count = serp_data.get("total_count", 0) if serp_data else 0

    return {
        "brand_mentioned": len(brand_mentions) > 0,
        "mention_count": len(brand_mentions),
        "top_mentions": brand_mentions[:5],
        "total_reddit_results": total_count
    }


def check_quora(brand: str, keyword: str, location_name: str, language_code: str) -> dict:
    """维度3: Quora 讨论可见性"""
    query = f"site:quora.com best {keyword}"
    serp_data = dfs_serp_search(query, location_name, language_code)
    organic = extract_organic_results(serp_data)
    brand_mentions = find_brand_mentions(brand, organic)
    total_count = serp_data.get("total_count", 0) if serp_data else 0

    return {
        "brand_mentioned": len(brand_mentions) > 0,
        "mention_count": len(brand_mentions),
        "top_mentions": brand_mentions[:3],
        "total_quora_results": total_count
    }


def check_review_sites(brand: str, location_name: str, language_code: str) -> dict:
    """维度4: 评价网站覆盖"""
    review_sites = ["g2.com", "trustpilot.com", "sitejabber.com", "capterra.com", "producthunt.com"]
    query = f'"{brand}" review ' + " OR ".join([f"site:{s}" for s in review_sites])
    serp_data = dfs_serp_search(query, location_name, language_code)
    if not serp_data:
        return {"sites_found": [], "site_count": 0}

    organic = extract_organic_results(serp_data)
    sites_found = []
    for item in organic:
        url = item.get("url", "")
        for site in review_sites:
            if site in url:
                sites_found.append({
                    "site": site,
                    "title": item.get("title", ""),
                    "url": url,
                    "snippet": item.get("snippet", "")[:200]
                })
                break

    # 去重（按 site 域名）
    seen = set()
    unique_sites = []
    for s in sites_found:
        if s["site"] not in seen:
            seen.add(s["site"])
            unique_sites.append(s)

    return {
        "sites_found": unique_sites,
        "site_count": len(unique_sites)
    }


def check_wikipedia(brand: str, location_name: str, language_code: str) -> dict:
    """维度5: Wikipedia 实体存在"""
    query = f"{brand} site:wikipedia.org"
    serp_data = dfs_serp_search(query, location_name, language_code)
    if not serp_data:
        return {"exists": False, "url": "", "title": ""}

    organic = extract_organic_results(serp_data)
    for item in organic:
        url = item.get("url", "")
        if "wikipedia.org" in url:
            return {
                "exists": True,
                "url": url,
                "title": item.get("title", ""),
                "snippet": item.get("snippet", "")[:200]
            }

    return {"exists": False, "url": "", "title": ""}


def check_media_coverage(brand: str, keyword: str,
                         location_name: str, language_code: str) -> dict:
    """维度6: 媒体报道覆盖"""
    # 排除大平台和 UGC 站点，筛选权威媒体
    exclude_sites = [
        "reddit.com", "amazon.com", "ebay.com", "etsy.com", "walmart.com",
        "aliexpress.com", "alibaba.com", "pinterest.com", "youtube.com",
        "facebook.com", "tiktok.com", "instagram.com", "twitter.com"
    ]
    exclude = " ".join([f"-site:{s}" for s in exclude_sites])
    query = f'"{brand}" {keyword} review OR "{brand}" best {keyword} {exclude}'
    serp_data = dfs_serp_search(query, location_name, language_code)
    if not serp_data:
        return {"media_count": 0, "top_coverage": []}

    organic = extract_organic_results(serp_data)
    coverage = []
    for item in organic:
        coverage.append({
            "title": item.get("title", ""),
            "url": item.get("url", ""),
            "snippet": item.get("snippet", "")[:200],
            "position": item.get("position", 0)
        })

    return {
        "media_count": len(coverage),
        "top_coverage": coverage[:5]
    }


def check_competitor_comparison(brand: str, competitors: list[str], keyword: str,
                                location_name: str, language_code: str) -> list[dict]:
    """维度7: 竞品对比内容"""
    comparisons = []
    for comp in competitors:
        query = f"{brand} vs {comp} {keyword}"
        serp_data = dfs_serp_search(query, location_name, language_code)
        if not serp_data:
            comparisons.append({
                "competitor": comp,
                "comparison_count": 0,
                "brand_mentioned": False,
                "top_results": []
            })
            continue

        organic = extract_organic_results(serp_data)
        brand_mentions = find_brand_mentions(brand, organic)

        comparisons.append({
            "competitor": comp,
            "comparison_count": len(organic),
            "brand_mentioned": len(brand_mentions) > 0,
            "top_results": [{
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "position": item.get("position", 0)
            } for item in organic[:3]]
        })
        time.sleep(DEFAULT_DELAY)

    return comparisons


# ── 主流程 ───────────────────────────────────────────────────────────────────

def run_full_check(brand: str, domain: str, keywords: list[str],
                   competitors: list[str], location_name: str = "United States",
                   language_code: str = "en") -> dict:
    """执行完整的 GEO 可见性检查"""
    check_start = datetime.now()
    result = {
        "brand": brand,
        "domain": domain,
        "check_date": check_start.strftime("%Y-%m-%d %H:%M:%S"),
        "market": location_name,
        "language": language_code,
        "keywords": {},
        "wikipedia": {},
        "reviews": {},
        "competitors": [],
        "api_calls_used": 0
    }

    print(f"\n{'='*60}")
    print(f"GEO Visibility Check: {brand} ({domain})")
    print(f"Keywords: {', '.join(keywords)}")
    print(f"Competitors: {', '.join(competitors) if competitors else 'None'}")
    print(f"Market: {location_name} / {language_code}")
    print(f"{'='*60}\n")

    for kw in keywords:
        print(f"── Keyword: \"{kw}\" ──")

        # 维度1: AI Overview / Featured Snippet / Knowledge Graph
        print("  [1/7] AI Overview / Featured Snippet / Knowledge Graph...")
        ai_overview = check_ai_overview(kw, location_name, language_code)
        result["api_calls_used"] += 1
        status = "[Y] Found" if ai_overview["appears"] else "[N] Not found"
        print(f"        {status} (type: {ai_overview['type']})")
        if ai_overview["people_also_ask"]:
            print(f"        People Also Ask: {len(ai_overview['people_also_ask'])} questions")
        time.sleep(DEFAULT_DELAY)

        # 检测品牌是否出现在 AI Overview 中
        brand_in_overview = False
        if ai_overview["content"]:
            brand_lower = brand.lower()
            brand_in_overview = brand_lower in ai_overview["content"].lower()

        # 维度2: Reddit
        print("  [2/7] Reddit discussions...")
        reddit = check_reddit(brand, kw, location_name, language_code)
        result["api_calls_used"] += 1
        status = f"[Y] {reddit['mention_count']} mentions" if reddit["brand_mentioned"] else "[X] Not mentioned"
        print(f"        {status}")
        time.sleep(DEFAULT_DELAY)

        # 维度3: Quora
        print("  [3/7] Quora discussions...")
        quora = check_quora(brand, kw, location_name, language_code)
        result["api_calls_used"] += 1
        status = f"[Y] {quora['mention_count']} mentions" if quora["brand_mentioned"] else "[X] Not mentioned"
        print(f"        {status}")
        time.sleep(DEFAULT_DELAY)

        # 维度6: 媒体报道（per keyword）
        print("  [6/7] Media coverage...")
        media = check_media_coverage(brand, kw, location_name, language_code)
        result["api_calls_used"] += 1
        print(f"        {media['media_count']} results found")
        time.sleep(DEFAULT_DELAY)

        result["keywords"][kw] = {
            "ai_overview": ai_overview,
            "brand_in_ai_overview": brand_in_overview,
            "reddit": reddit,
            "quora": quora,
            "media": media
        }

    # 维度4: 评价网站（brand-level，不 per keyword）
    print(f"\n── Brand-level checks ──")
    print("  [4/7] Review sites...")
    reviews = check_review_sites(brand, location_name, language_code)
    result["api_calls_used"] += 1
    print(f"        {reviews['site_count']} review sites found")
    result["reviews"] = reviews
    time.sleep(DEFAULT_DELAY)

    # 维度5: Wikipedia
    print("  [5/7] Wikipedia entity...")
    wiki = check_wikipedia(brand, location_name, language_code)
    result["api_calls_used"] += 1
    status = f"[Y] {wiki['url']}" if wiki["exists"] else "[X] No entity"
    print(f"        {status}")
    result["wikipedia"] = wiki
    time.sleep(DEFAULT_DELAY)

    # 维度7: 竞品对比
    if competitors:
        print("  [7/7] Competitor comparison...")
        comparisons = check_competitor_comparison(
            brand, competitors, keywords[0], location_name, language_code
        )
        result["api_calls_used"] += len(competitors)
        for comp in comparisons:
            print(f"        vs {comp['competitor']}: {comp['comparison_count']} comparison articles")
        result["competitors"] = comparisons

    # 元信息
    check_end = datetime.now()
    result["duration_seconds"] = int((check_end - check_start).total_seconds())

    print(f"\n{'='*60}")
    print(f"Done! {result['api_calls_used']} API calls in {result['duration_seconds']}s")
    print(f"{'='*60}\n")

    return result


# ── 报告生成 ─────────────────────────────────────────────────────────────────

def generate_report(result: dict, output_dir: str = OUTPUT_DIR) -> tuple[str, str]:
    """生成 Markdown 报告 + JSON 数据文件"""
    os.makedirs(output_dir, exist_ok=True)

    brand = result["brand"].replace(" ", "_")
    date_str = datetime.now().strftime("%Y%m%d_%H%M")

    # ── Markdown 报告 ──
    md = f"# GEO Visibility Report: {result['brand']}\n\n"
    md += f"| Field | Value |\n|-------|-------|\n"
    md += f"| Brand | {result['brand']} |\n"
    md += f"| Domain | {result['domain']} |\n"
    md += f"| Check Date | {result['check_date']} |\n"
    md += f"| Market | {result['market']} |\n"
    md += f"| Language | {result['language']} |\n"
    md += f"| API Calls Used | {result['api_calls_used']} |\n"
    md += f"| Duration | {result['duration_seconds']}s |\n\n"
    md += "---\n\n"

    # 逐关键词
    for kw, kw_data in result["keywords"].items():
        md += f"## Keyword: \"{kw}\"\n\n"

        # AI Overview
        ao = kw_data["ai_overview"]
        md += "### 1. AI Overview / Featured Snippet / Knowledge Graph\n\n"
        md += f"- **Appears**: {'Yes' if ao['appears'] else 'No'}\n"
        md += f"- **Type**: {ao['type']}\n"
        md += f"- **Brand mentioned**: {'**Yes**' if kw_data['brand_in_ai_overview'] else 'No'}\n"
        if ao["content"]:
            md += f"- **Content preview**: {ao['content'][:300]}\n"
        if ao["source"]:
            md += f"- **Source**: {ao['source']}\n"
        if ao.get("people_also_ask"):
            md += "\n**People Also Ask:**\n\n"
            for q in ao["people_also_ask"][:5]:
                md += f"- {q}\n"
        md += "\n"

        # Reddit
        rd = kw_data["reddit"]
        md += "### 2. Reddit Discussions\n\n"
        md += f"- **Brand mentioned**: {'Yes' if rd['brand_mentioned'] else 'No'}\n"
        md += f"- **Mention count**: {rd['mention_count']}\n"
        md += f"- **Total Reddit results**: {rd['total_reddit_results']}\n"
        if rd["top_mentions"]:
            md += "\n**Top mentions:**\n\n"
            for m in rd["top_mentions"]:
                md += f"- [{m['title']}]({m['url']})\n"
        md += "\n"

        # Quora
        qu = kw_data["quora"]
        md += "### 3. Quora Discussions\n\n"
        md += f"- **Brand mentioned**: {'Yes' if qu['brand_mentioned'] else 'No'}\n"
        md += f"- **Mention count**: {qu['mention_count']}\n"
        md += f"- **Total Quora results**: {qu['total_quora_results']}\n"
        if qu["top_mentions"]:
            md += "\n**Top mentions:**\n\n"
            for m in qu["top_mentions"]:
                md += f"- [{m['title']}]({m['url']})\n"
        md += "\n"

        # Media
        me = kw_data["media"]
        md += "### 6. Media Coverage\n\n"
        md += f"- **Coverage count**: {me['media_count']}\n"
        if me["top_coverage"]:
            md += "\n**Top coverage:**\n\n"
            for c in me["top_coverage"]:
                md += f"- [{c['title']}]({c['url']})\n"
        md += "\n"

    # Review Sites (brand-level)
    rv = result["reviews"]
    md += "---\n\n## Brand-level Signals\n\n"
    md += "### 4. Review Sites\n\n"
    md += f"- **Sites found**: {rv['site_count']}\n"
    for s in rv.get("sites_found", []):
        md += f"  - **{s['site']}**: [{s['title']}]({s['url']})\n"
    md += "\n"

    # Wikipedia
    wiki = result["wikipedia"]
    md += "### 5. Wikipedia Entity\n\n"
    md += f"- **Exists**: {'Yes' if wiki['exists'] else 'No'}\n"
    if wiki["exists"]:
        md += f"- **URL**: [{wiki['title']}]({wiki['url']})\n"
        if wiki.get("snippet"):
            md += f"- **Snippet**: {wiki['snippet']}\n"
    md += "\n"

    # Competitors
    if result["competitors"]:
        md += "### 7. Competitor Comparison\n\n"
        md += "| Competitor | Comparison Articles | Brand Mentioned |\n"
        md += "|-----------|--------------------|----------------|\n"
        for comp in result["competitors"]:
            mentioned = "Yes" if comp.get("brand_mentioned") else "No"
            md += f"| {comp['competitor']} | {comp['comparison_count']} | {mentioned} |\n"
        md += "\n"

    # Layer 2 指引
    md += "---\n\n## Layer 2: LLM Analysis\n\n"
    md += "> **下一步**: 将本报告对应的 JSON 文件交给 Claude Code 进行语义分析：\n"
    md += ">\n"
    md += "> ```\n"
    md += "> 请分析这个品牌的 GEO 可见性数据（JSON文件），给出：\n"
    md += "> 1. 各维度评分（0-100）\n"
    md += "> 2. 与竞品的差距分析\n"
    md += "> 3. Top 3 可执行的改善建议（按优先级排序）\n"
    md += "> 4. 适合写入 Google Sheets 的汇总行\n"
    md += "> ```\n"

    # 写文件
    md_path = os.path.join(output_dir, f"geo_visibility_{brand}_{date_str}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md)

    json_path = os.path.join(output_dir, f"geo_visibility_{brand}_{date_str}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Report: {md_path}")
    print(f"Data:   {json_path}")

    return md_path, json_path


# ── 入口 ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="GEO Visibility Checker - 品牌在 AI 生态中的可见性检查（DataForSEO）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 基本用法
  python geo_visibility_checker.py \\
    --brand "Crystal Healing" \\
    --domain "crystalhealing.com" \\
    --keywords "healing crystal bracelet" "crystal bracelet meaning"

  # 带竞品
  python geo_visibility_checker.py \\
    --brand "Crystal Healing" \\
    --domain "crystalhealing.com" \\
    --keywords "healing crystal bracelet" \\
    --competitors "Energy Muse" "Tiny Rituals"

  # 指定欧洲市场（德国）
  python geo_visibility_checker.py \\
    --brand "Crystal Healing" \\
    --domain "crystalhealing.com" \\
    --keywords "healing crystal bracelet" \\
    --location "Germany" --language de

  # DataForSEO 环境变量:
  export DFS_API_LOGIN=your_login
  export DFS_API_PASSWORD=your_password
        """
    )

    parser.add_argument("--brand", required=True, help="品牌名称")
    parser.add_argument("--domain", required=True, help="品牌域名（如 crystalhealing.com）")
    parser.add_argument("--keywords", nargs="+", required=True, help="品类关键词（1-5个）")
    parser.add_argument("--competitors", nargs="*", default=[], help="竞品品牌名")
    parser.add_argument("--location", default="United States",
                        help="DataForSEO location_name（默认 United States）")
    parser.add_argument("--language", default="en", help="language_code（默认 en）")
    parser.add_argument("--output", default=OUTPUT_DIR, help="输出目录（默认 results/）")

    args = parser.parse_args()

    # 前置检查
    if not DFS_API_LOGIN or not DFS_API_PASSWORD:
        print("ERROR: DataForSEO API 凭证未设置")
        print("  export DFS_API_LOGIN=your_login")
        print("  export DFS_API_PASSWORD=your_password")
        print("  登录控制台获取: https://dataforseo.com")
        return

    if len(args.keywords) > 5:
        print("WARNING: keywords 建议不超过5个，过多的关键词会消耗大量 API 配额")
        print(f"  当前: {len(args.keywords)} 个关键词")
        confirm = input("  继续? (y/N): ")
        if confirm.lower() != "y":
            return

    # 执行检查
    result = run_full_check(
        brand=args.brand,
        domain=args.domain,
        keywords=args.keywords,
        competitors=args.competitors,
        location_name=args.location,
        language_code=args.language
    )

    # 生成报告
    generate_report(result, args.output)


if __name__ == "__main__":
    main()
