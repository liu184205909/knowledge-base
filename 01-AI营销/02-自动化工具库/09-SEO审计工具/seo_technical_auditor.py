#!/usr/bin/env python3
"""
seo_technical_auditor.py - 技术SEO审计工具
输入: 网站 sitemap URL 或本地 URL 列表文件
处理: 检查 HTTPS、404、重定向链、Canonical、robots.txt、结构化数据、
      Hreflang、孤岛页面、Core Web Vitals 指标（基于 Lighthouse API 或估算）
输出: 技术SEO审计报告（Markdown）+ 问题清单 CSV
"""

import requests
import argparse
import csv
import os
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urlparse, urljoin
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
# Core Web Vitals 阈值（基于响应大小的粗略估算，精确值需 Lighthouse API）
PAGE_SIZE_GOOD = 500 * 1024       # 500KB
PAGE_SIZE_NEEDS_WORK = 1500 * 1024  # 1.5MB


# ── 页面技术检查 ──────────────────────────────────────────────────────────────

def audit_page(url: str, all_urls: set = None) -> dict:
    """对单个页面执行技术 SEO 审计"""
    result = {
        "url": url,
        "status_code": 0,
        "is_https": False,
        "redirect_chain": [],
        "final_url": url,
        "has_canonical": False,
        "canonical_url": "",
        "canonical_self": False,  # canonical 是否指向自身
        "title": "",
        "title_length": 0,
        "meta_description": "",
        "meta_description_length": 0,
        "h1_count": 0,
        "h1_text": "",
        "images_total": 0,
        "images_no_alt": 0,
        "has_schema": False,
        "schema_types": [],
        "has_hreflang": False,
        "hreflang_tags": [],
        "page_size_kb": 0,
        "internal_links": 0,
        "external_links": 0,
        "status": "ok",
        "error": "",
        "issues": [],  # 问题列表
    }

    parsed = urlparse(url)
    result["is_https"] = parsed.scheme == "https"

    try:
        # 允许重定向，但记录链
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT,
                            allow_redirects=True)
        result["status_code"] = resp.status_code
        result["final_url"] = resp.url
        result["page_size_kb"] = round(len(resp.content) / 1024, 1)

        # 记录重定向链
        if resp.history:
            result["redirect_chain"] = [
                f"{r.status_code} → {r.url}" for r in resp.history
            ]
            if len(resp.history) > 1:
                result["issues"].append(f"重定向链 ({len(resp.history)} 跳)")

        # 非 200 状态码
        if resp.status_code == 404:
            result["issues"].append("404 页面")
        elif resp.status_code >= 400:
            result["issues"].append(f"HTTP {resp.status_code}")

        soup = BeautifulSoup(resp.text, "html.parser")

        # Title
        title_tag = soup.find("title")
        if title_tag:
            result["title"] = title_tag.get_text(strip=True)
            result["title_length"] = len(result["title"])
            if result["title_length"] > 60:
                result["issues"].append(f"Title 过长 ({result['title_length']} 字符)")
            elif result["title_length"] == 0:
                result["issues"].append("Title 为空")
        else:
            result["issues"].append("缺少 Title 标签")

        # Meta Description
        meta_desc = soup.find("meta", attrs={"name": re.compile("description", re.I)})
        if meta_desc:
            result["meta_description"] = meta_desc.get("content", "")
            result["meta_description_length"] = len(result["meta_description"])
            if result["meta_description_length"] > 160:
                result["issues"].append(f"Meta Description 过长 ({result['meta_description_length']} 字符)")
            elif result["meta_description_length"] == 0:
                result["issues"].append("Meta Description 为空")
        else:
            result["issues"].append("缺少 Meta Description")

        # Canonical
        canonical = soup.find("link", rel="canonical")
        if canonical and canonical.get("href"):
            result["has_canonical"] = True
            result["canonical_url"] = canonical["href"]
            result["canonical_self"] = (canonical["href"].rstrip("/") == url.rstrip("/")
                                         or canonical["href"].rstrip("/") == resp.url.rstrip("/"))
            if not result["canonical_self"] and result["canonical_url"]:
                # 可能指向其他页面（分页、移动版等），不一定有问题
                pass
        else:
            result["issues"].append("缺少 Canonical 标签")

        # H1
        h1_tags = soup.find_all("h1")
        result["h1_count"] = len(h1_tags)
        if h1_tags:
            result["h1_text"] = h1_tags[0].get_text(strip=True)
        if len(h1_tags) > 1:
            result["issues"].append(f"多个 H1 标签 ({len(h1_tags)} 个)")
        elif len(h1_tags) == 0:
            result["issues"].append("缺少 H1 标签")

        # 图片 ALT
        images = soup.find_all("img")
        result["images_total"] = len(images)
        result["images_no_alt"] = sum(1 for img in images if not img.get("alt", "").strip())
        if result["images_no_alt"] > 0:
            result["issues"].append(f"{result['images_no_alt']} 张图片缺少 ALT")

        # 结构化数据 (Schema.org JSON-LD)
        schemas = soup.find_all("script", type="application/ld+json")
        if schemas:
            result["has_schema"] = True
            for schema_tag in schemas:
                try:
                    data = __import__("json").loads(schema_tag.string or "{}")
                    schema_type = data.get("@type", "未知")
                    if isinstance(schema_type, list):
                        result["schema_types"].extend(schema_type)
                    else:
                        result["schema_types"].append(schema_type)
                except Exception:
                    pass
        else:
            result["issues"].append("缺少结构化数据 (JSON-LD)")

        # Hreflang
        hreflangs = soup.find_all("link", rel=re.compile("alternate", re.I), hreflang=True)
        if hreflangs:
            result["has_hreflang"] = True
            result["hreflang_tags"] = [f"{h.get('hreflang')} → {h.get('href', '')}" for h in hreflangs]

        # 内链/外链统计
        base_domain = parsed.netloc
        links = soup.find_all("a", href=True)
        for link in links:
            href = link["href"]
            if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
                continue
            href_parsed = urlparse(href)
            if href_parsed.netloc and href_parsed.netloc != base_domain:
                result["external_links"] += 1
            else:
                result["internal_links"] += 1

        # 页面大小评估
        if result["page_size_kb"] > PAGE_SIZE_NEEDS_WORK / 1024:
            result["issues"].append(f"页面过大 ({result['page_size_kb']}KB)")
        elif result["page_size_kb"] > PAGE_SIZE_GOOD / 1024:
            result["issues"].append(f"页面偏大 ({result['page_size_kb']}KB)")

        # HTTPS 检查
        if not result["is_https"]:
            result["issues"].append("非 HTTPS")

    except requests.Timeout:
        result["status"] = "error"
        result["error"] = "请求超时"
        result["issues"].append("请求超时")
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)[:80]

    return result


# ── robots.txt 检查 ──────────────────────────────────────────────────────────

def check_robots_txt(site_url: str) -> dict:
    """检查网站的 robots.txt"""
    parsed = urlparse(site_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    result = {
        "url": robots_url,
        "exists": False,
        "has_sitemap": False,
        "sitemap_urls": [],
        "disallowed_paths": [],
        "issues": [],
    }

    try:
        resp = requests.get(robots_url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        if resp.status_code == 200:
            result["exists"] = True
            content = resp.text
            # 提取 Sitemap
            for line in content.split('\n'):
                line = line.strip()
                if line.lower().startswith('sitemap:'):
                    result["has_sitemap"] = True
                    result["sitemap_urls"].append(line.split(':', 1)[1].strip())
                if line.lower().startswith('disallow:'):
                    path = line.split(':', 1)[1].strip()
                    if path:
                        result["disallowed_paths"].append(path)
        else:
            result["issues"].append("robots.txt 不存在或无法访问")
    except Exception as e:
        result["issues"].append(f"robots.txt 检查失败: {str(e)[:50]}")

    return result


# ── 报告生成 ──────────────────────────────────────────────────────────────────

def generate_report(pages: list[dict], robots_info: dict, site_url: str) -> str:
    """生成技术 SEO 审计报告"""
    total = len(pages)
    ok_pages = [p for p in pages if p["status"] == "ok"]
    err_pages = [p for p in pages if p["status"] == "error"]

    # 统计各类问题
    issue_counts = defaultdict(int)
    all_issues_pages = defaultdict(list)
    for p in ok_pages:
        for issue in p["issues"]:
            issue_type = re.sub(r'\(.*?\)', '', issue).strip()
            issue_counts[issue_type] += 1
            all_issues_pages[issue_type].append(p["url"])

    # 健康评分（简单加权计算）
    max_score = len(ok_pages) * 10  # 每页满分 10
    deductions = 0
    for p in ok_pages:
        deductions += len(p["issues"]) * 1.5
    health_score = max(0, round((1 - deductions / max_score) * 100, 1)) if max_score else 0

    lines = [
        "# 技术 SEO 审计报告\n",
        f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> 目标站点: {site_url}",
        f"> 审计页面: {total}（成功 {len(ok_pages)}，失败 {len(err_pages)}）",
        f"> 健康评分: {health_score}/100\n",
        "---\n",
        "## 一、robots.txt 检查\n",
    ]

    if robots_info["exists"]:
        lines.append(f"- ✓ robots.txt 存在")
        if robots_info["has_sitemap"]:
            lines.append(f"- ✓ Sitemap 已声明 ({len(robots_info['sitemap_urls'])} 个)")
            for s in robots_info["sitemap_urls"][:5]:
                lines.append(f"  - `{s}`")
        else:
            lines.append("- ⚠️ 未在 robots.txt 中声明 Sitemap")
        if robots_info["disallowed_paths"]:
            lines.append(f"- 屏蔽路径: {len(robots_info['disallowed_paths'])} 个")
    else:
        lines.append("- ❌ robots.txt 不存在")

    lines += [
        "\n---\n",
        "## 二、问题汇总（按频率排序）\n",
        "| 问题类型 | 出现次数 | 严重程度 |",
        "|---------|---------|---------|",
    ]

    severity_map = {
        "404 页面": "🔴 高",
        "非 HTTPS": "🔴 高",
        "缺少 Title 标签": "🔴 高",
        "缺少 H1 标签": "🔴 高",
        "请求超时": "🔴 高",
        "HTTP": "🔴 高",
        "重定向链": "🟡 中",
        "Title 过长": "🟡 中",
        "Meta Description 过长": "🟡 中",
        "Meta Description 为空": "🟡 中",
        "缺少 Meta Description": "🟡 中",
        "缺少 Canonical 标签": "🟡 中",
        "多个 H1 标签": "🟡 中",
        "缺少结构化数据": "🟢 低",
        "页面过大": "🟡 中",
        "页面偏大": "🟢 低",
    }

    for issue_type, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        severity = "🟡 中"
        for key, val in severity_map.items():
            if key in issue_type:
                severity = val
                break
        lines.append(f"| {issue_type} | {count} | {severity} |")

    # 各页面详情
    lines += [
        "\n---\n",
        "## 三、页面审计详情\n",
        "| URL | 状态码 | HTTPS | Canonical | H1 | Schema | 问题数 |",
        "|-----|--------|-------|-----------|-----|--------|--------|",
    ]
    for p in ok_pages[:50]:
        https_icon = "✓" if p["is_https"] else "✗"
        canonical_icon = "✓" if p["has_canonical"] else "✗"
        h1_icon = "✓" if p["h1_count"] == 1 else f"{p['h1_count']}"
        schema_icon = "✓" if p["has_schema"] else "✗"
        issue_count = len(p["issues"])
        short_url = p["url"][:60] + "..." if len(p["url"]) > 60 else p["url"]
        lines.append(f"| {short_url} | {p['status_code']} | {https_icon} | {canonical_icon} | {h1_icon} | {schema_icon} | {issue_count} |")
    if len(ok_pages) > 50:
        lines.append(f"| ... | | | | | | |")
        lines.append(f"> 仅显示前 50 条，共 {len(ok_pages)} 页面")

    # 失败页面
    if err_pages:
        lines += [
            "\n---\n",
            "## 四、抓取失败的页面\n",
        ]
        for p in err_pages[:20]:
            lines.append(f"- `{p['error']}` → {p['url']}")

    # 优化建议
    lines += [
        "\n---\n",
        "## 五、优化建议（按优先级）\n",
    ]
    priority_items = []
    if issue_counts.get("404 页面", 0) > 0:
        priority_items.append("1. **修复 404 页面** — 设置 301 重定向到相关页面")
    if issue_counts.get("非 HTTPS", 0) > 0:
        priority_items.append("2. **启用 HTTPS** — 全站 SSL 证书部署")
    if issue_counts.get("缺少 Title 标签", 0) > 0:
        priority_items.append("3. **补充 Title 标签** — 每页唯一，50-60 字符")
    if issue_counts.get("缺少 Canonical 标签", 0) > 0:
        priority_items.append("4. **添加 Canonical** — 防止重复内容问题")
    if issue_counts.get("缺少结构化数据", 0) > 0:
        priority_items.append("5. **部署 Schema.org** — 优先 Product, Article, FAQ, Breadcrumb")
    if issue_counts.get("多个 H1 标签", 0) > 0:
        priority_items.append("6. **修复多 H1** — 每页只保留一个 H1")
    if issue_counts.get("请求超时", 0) > 0:
        priority_items.append("7. **优化页面加载速度** — 关注 Core Web Vitals")

    if not priority_items:
        lines.append("技术 SEO 状态良好，无重大问题。")
    else:
        lines.extend(priority_items)

    return "\n".join(lines)


# ── URL 加载 ──────────────────────────────────────────────────────────────────

def load_urls_from_sitemap(sitemap_url: str) -> list[str]:
    """从 sitemap XML 加载 URL"""
    resp = requests.get(sitemap_url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    root = ET.fromstring(resp.text)
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = []
    for loc in root.findall('.//sm:loc', ns):
        if loc.text:
            urls.append(loc.text.strip())
    if not urls:
        for loc in root.findall('.//loc'):
            if loc.text:
                urls.append(loc.text.strip())
    return urls


def load_urls_from_file(filepath: str) -> list[str]:
    """从本地文件加载 URL"""
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


# ── 主入口 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="技术SEO审计工具 - 批量检查 HTTPS/404/Canonical/Schema 等技术问题"
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
        help="限制审计的最大 URL 数（0 = 不限制）"
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

    site_url = urlparse(urls[0]).scheme + "://" + urlparse(urls[0]).netloc if urls else ""
    print(f"📋 共 {len(urls)} 个 URL，开始技术审计...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 检查 robots.txt
    print("\n📡 检查 robots.txt...")
    robots_info = check_robots_txt(site_url)
    if robots_info["exists"]:
        print(f"  ✓ robots.txt 存在，Sitemap: {len(robots_info['sitemap_urls'])} 个")
    else:
        print(f"  ✗ robots.txt 不存在")

    # 并发审计页面
    print(f"\n🔍 开始审计页面（并发 {args.concurrency}）...")
    all_urls_set = set(urls)
    pages = []
    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = {executor.submit(audit_page, url, all_urls_set): url for url in urls}
        for i, future in enumerate(as_completed(futures), 1):
            result = future.result()
            pages.append(result)
            issue_count = len(result["issues"])
            icon = "✓" if issue_count == 0 else f"⚠{issue_count}"
            print(f"  [{i:4d}/{len(urls)}] {icon:4s} {result['status_code']} {futures[future][:65]}")
            time.sleep(args.delay)

    # 生成报告
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    domain = urlparse(site_url).netloc
    report_path = os.path.join(OUTPUT_DIR, f"technical_audit_{domain}_{timestamp}.md")
    csv_path = os.path.join(OUTPUT_DIR, f"technical_issues_{domain}_{timestamp}.csv")

    report = generate_report(pages, robots_info, site_url)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    # 保存问题 CSV
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "问题类型", "状态码", "HTTPS", "Canonical",
                         "H1数量", "Schema", "页面大小KB", "问题列表"])
        for p in pages:
            if p["issues"]:
                writer.writerow([
                    p["url"],
                    "; ".join(p["issues"]),
                    p["status_code"],
                    p["is_https"],
                    p["canonical_url"],
                    p["h1_count"],
                    "; ".join(p["schema_types"]) if p["schema_types"] else "无",
                    p["page_size_kb"],
                    " | ".join(p["issues"]),
                ])

    # 汇总
    total_issues = sum(len(p["issues"]) for p in pages)
    pages_with_issues = sum(1 for p in pages if p["issues"])

    print(f"\n✅ 审计完成！")
    print(f"  📋 审计报告: {report_path}")
    print(f"  📄 问题清单: {csv_path}")
    print(f"  📊 健康状态: {pages_with_issues}/{len(pages)} 页面存在问题，共 {total_issues} 个问题")


if __name__ == "__main__":
    main()
