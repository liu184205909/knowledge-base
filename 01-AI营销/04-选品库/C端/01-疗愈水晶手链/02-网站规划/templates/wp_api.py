"""
WordPress REST API 工具模块
用于向 luckycrystals.org 推送页面内容

使用方式:
    from wp_api import WPClient
    client = WPClient()
    client.create_page(page_data)
    client.batch_create_pages([page_data, ...])
"""

import json
import os
import requests
from typing import Optional
from dataclasses import dataclass, field, asdict


@dataclass
class PageData:
    """页面数据结构"""
    title: str                           # 页面标题
    slug: str                            # URL slug
    content: str                         # HTML 内容
    meta_description: str = ""           # SEO meta description
    focus_keyword: str = ""              # 焦点关键词 (Yoast SEO)
    template: str = ""                   # WordPress 模板名
    parent_slug: str = ""                # 父页面 slug
    status: str = "draft"                # draft / publish
    page_type: str = "page"              # page / product / post
    sections: list = field(default_factory=list)  # 内容段落结构
    schema_data: dict = field(default_factory=dict)  # Schema.org 结构化数据
    internal_links: list = field(default_factory=list)  # 内部链接推荐


class WPClient:
    """WordPress REST API 客户端"""

    BASE_URL = "https://luckycrystals.org/wp-json/wp/v2"

    def __init__(self):
        self.credentials = self._load_credentials()
        self.session = requests.Session()
        self.session.auth = (self.credentials["username"], self.credentials["password"])
        self.session.headers.update({"Content-Type": "application/json"})

    def _load_credentials(self) -> dict:
        """从环境变量或配置文件加载 WordPress 凭证"""
        # 优先从环境变量
        username = os.environ.get("WP_USERNAME", "")
        password = os.environ.get("WP_APP_PASSWORD", "")

        if username and password:
            return {"username": username, "password": password}

        # 从配置文件
        config_path = os.path.join(os.path.dirname(__file__), "wp_config.json")
        if os.path.exists(config_path):
            with open(config_path, encoding="utf-8") as f:
                return json.load(f)

        raise FileNotFoundError(
            "WordPress 凭证未找到。请设置环境变量 WP_USERNAME + WP_APP_PASSWORD，"
            "或在 templates/wp_config.json 中配置。"
        )

    def create_page(self, page: PageData) -> dict:
        """创建单个页面"""
        payload = {
            "title": page.title,
            "slug": page.slug,
            "content": page.content,
            "status": page.status,
        }

        # Yoast SEO meta
        if page.meta_description:
            payload["meta"] = {
                "yoast_wpseo_metadesc": page.meta_description,
            }
        if page.focus_keyword:
            payload["meta"]["yoast_wpseo_focuskw"] = page.focus_keyword

        # 父页面
        if page.parent_slug:
            parent = self._find_page_by_slug(page.parent_slug)
            if parent:
                payload["parent"] = parent["id"]

        # 模板
        if page.template:
            payload["template"] = page.template

        endpoint = f"{self.BASE_URL}/pages"
        resp = self.session.post(endpoint, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def _find_page_by_slug(self, slug: str) -> Optional[dict]:
        """按 slug 查找页面"""
        resp = self.session.get(
            f"{self.BASE_URL}/pages",
            params={"slug": slug, "per_page": 1},
            timeout=15,
        )
        results = resp.json()
        return results[0] if results else None

    def batch_create_pages(self, pages: list[PageData], dry_run: bool = False) -> list:
        """批量创建页面"""
        results = []
        for i, page in enumerate(pages):
            print(f"[{i+1}/{len(pages)}] 创建: {page.title} ({page.slug})")
            if dry_run:
                print(f"  → DRY RUN, 跳过实际创建")
                results.append({"slug": page.slug, "status": "dry_run"})
                continue
            try:
                result = self.create_page(page)
                print(f"  → 成功, ID={result['id']}")
                results.append({"id": result["id"], "slug": page.slug, "status": "created"})
            except Exception as e:
                print(f"  → 失败: {e}")
                results.append({"slug": page.slug, "status": "error", "error": str(e)})
        return results

    def page_exists(self, slug: str) -> bool:
        """检查页面是否已存在"""
        return self._find_page_by_slug(slug) is not None


# ============================================================================
# HTML 内容生成工具
# ============================================================================

def section_heading(text: str, tag: str = "h2", class_name: str = "") -> str:
    """生成标题 HTML"""
    cls = f' class="{class_name}"' if class_name else ""
    return f"<{tag}{cls}>{text}</{tag}>"


def section_paragraph(text: str, class_name: str = "") -> str:
    """生成段落 HTML"""
    cls = f' class="{class_name}"' if class_name else ""
    return f"<p{cls}>{text}</p>"


def section_grid(items: list[str], columns: int = 3) -> str:
    """生成网格布局 HTML"""
    items_html = "\n".join(f'<div class="grid-item">{item}</div>' for item in items)
    return f'<div class="grid grid-cols-{columns}">{items_html}</div>'


def faq_schema(questions: list[dict]) -> dict:
    """生成 FAQ Schema.org 结构化数据"""
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q["answer"]
                }
            }
            for q in questions
        ]
    }


def product_schema(product: dict) -> dict:
    """生成 Product Schema.org 结构化数据"""
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product["name"],
        "description": product["description"],
        "image": product.get("images", []),
        "brand": {"@type": "Brand", "name": "LuckyCrystals"},
        "offers": {
            "@type": "Offer",
            "price": product["price"],
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "Organization", "name": "LuckyCrystals"},
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": str(product.get("review_count", 500)),
        },
    }


def breadcrumb_schema(items: list[str]) -> dict:
    """生成 Breadcrumb Schema.org 结构化数据"""
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": item,
            }
            for i, item in enumerate(items)
        ],
    }


if __name__ == "__main__":
    print("WordPress API 工具模块")
    print("使用方式:")
    print("  from wp_api import WPClient, PageData")
    print("  client = WPClient()")
    print("  page = PageData(title='...', slug='...', content='<p>...</p>')")
    print("  client.create_page(page)")
