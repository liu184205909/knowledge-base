import html
import json
import re
from pathlib import Path


DREAMS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = DREAMS_DIR.parent.parent
SITE_ASSET_ROOT = PROJECT_ROOT / "02-网站规划" / "assets" / "images" / "generated" / "dreams"
ARTICLES_PATH = DREAMS_DIR / "articles" / "dream-articles-repaired-full-1289.jsonl"
READINESS_PATH = DREAMS_DIR / "qa" / "dream-wp-draft-readiness.jsonl"
BACKBONE_PATHS = [
    DREAMS_DIR / "backbone" / "dream-backbone-subjects-6.jsonl",
    DREAMS_DIR / "backbone" / "dream-backbone-subjects-10.jsonl",
]
CRYSTAL_REUSE_PATH = DREAMS_DIR / "images" / "dream-crystal-reuse-manifest-repaired-full-1289.jsonl"
CRYSTAL_MEANING_DIR = DREAMS_DIR.parent / "1.crystal-meaning"
PACKAGE_DIR = DREAMS_DIR / "wp-draft-package"
POSTS_DIR = PACKAGE_DIR / "posts"
MANIFEST_PATH = PACKAGE_DIR / "manifest.json"

# Verified against the live WooCommerce category counts on 2026-07-10.
# Empty categories must not produce an empty product grid in a draft.
PRODUCT_CATEGORIES_WITH_PRODUCTS = {
    "amethyst-crystals",
    "black-tourmaline-crystals",
    "carnelian-crystals",
    "citrine-crystals",
    "hematite-crystals",
    "labradorite-crystals",
    "malachite-crystals",
    "red-jasper-crystals",
    "rhodonite-crystals",
    "rose-quartz-crystals",
    "selenite-crystals",
}


def read_jsonl(path: Path):
    rows = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def inline_markdown(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", escaped)
    escaped = re.sub(r"`([^`]+)`", r"\1", escaped)
    escaped = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', escaped)
    return escaped


def markdown_to_html(markdown: str) -> str:
    out = []
    list_type = None

    def close_list():
        nonlocal list_type
        if list_type:
            out.append(f"</{list_type}>")
            list_type = None

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()
        if not stripped:
            close_list()
            continue
        if re.fullmatch(r"[-*]{3,}", stripped):
            close_list()
            out.append("<hr>")
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading:
            close_list()
            level = min(len(heading.group(1)), 6)
            out.append(f"<h{level}>{inline_markdown(heading.group(2))}</h{level}>")
            continue
        unordered = re.match(r"^[-*]\s+(.+)$", stripped)
        if unordered:
            if list_type and list_type != "ul":
                close_list()
            if not list_type:
                list_type = "ul"
                out.append("<ul>")
            out.append(f"<li>{inline_markdown(unordered.group(1))}</li>")
            continue
        ordered = re.match(r"^\d+\.\s+(.+)$", stripped)
        if ordered:
            if list_type and list_type != "ol":
                close_list()
            if not list_type:
                list_type = "ol"
                out.append("<ol>")
            out.append(f"<li>{inline_markdown(ordered.group(1))}</li>")
            continue
        close_list()
        out.append(f"<p>{inline_markdown(stripped)}</p>")

    close_list()
    return "\n".join(out)


def pick_crystal_images(reuse_rows):
    by_profile = {}
    for row in reuse_rows:
        for crystal in row.get("crystal_reuse") or []:
            profile_slug = crystal.get("profile_slug")
            if not profile_slug or profile_slug in by_profile:
                continue
            images = crystal.get("json_images") or []
            overview = next((img for img in images if img.get("slot") == "overview" and img.get("src")), None)
            chosen = overview or next((img for img in images if img.get("src")), None)
            if chosen:
                by_profile[profile_slug] = {
                    "profile_slug": profile_slug,
                    "name": crystal.get("name") or profile_slug.replace("-meaning", "").replace("-", " ").title(),
                    "src": chosen.get("src"),
                    "alt": chosen.get("alt") or crystal.get("name") or profile_slug,
                    "wp_id": chosen.get("wp_id"),
                    "profile_path": crystal.get("profile_path") or f"/gemstone/{profile_slug}/",
                }
    if CRYSTAL_MEANING_DIR.exists():
        image_re = re.compile(r'<img[^>]+src="([^"]+)"[^>]*class="[^"]*wp-image-(\d+)[^"]*"[^>]*alt="([^"]*)"', re.I)
        image_re_alt_order = re.compile(r'<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*class="[^"]*wp-image-(\d+)[^"]*"', re.I)
        for path in sorted(CRYSTAL_MEANING_DIR.glob("*-meaning.json")):
            profile_slug = path.stem
            if profile_slug in by_profile:
                continue
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            content = data.get("content") or ""
            match = image_re.search(content)
            if match:
                src, wp_id, alt = match.group(1), match.group(2), match.group(3)
            else:
                match2 = image_re_alt_order.search(content)
                if not match2:
                    continue
                alt, src, wp_id = match2.group(1), match2.group(2), match2.group(3)
            by_profile[profile_slug] = {
                "profile_slug": profile_slug,
                "name": profile_slug.replace("-meaning", "").replace("-", " ").title(),
                "src": html.unescape(src),
                "alt": html.unescape(alt) or profile_slug,
                "wp_id": int(wp_id),
                "profile_path": f"/gemstone/{profile_slug}/",
            }
    return by_profile


def crystal_strip_html(row, crystal_lookup):
    slots = row.get("crystal_reuse_slots") or []
    images = []
    for slot in slots[:3]:
        profile_slug = slot.get("slug")
        image = crystal_lookup.get(profile_slug)
        if image:
            images.append(image)
    if not images:
        return "", []
    cards = []
    for image in images:
        cards.append(
            '<figure class="dream-crystal-reflection-card">'
            f'<a href="{html.escape(image["profile_path"])}">'
            f'<img src="{html.escape(image["src"])}" alt="{html.escape(image["alt"])}" loading="lazy" class="wp-image-{image.get("wp_id") or ""}">'
            "</a>"
            f'<figcaption>{html.escape(image["name"])}</figcaption>'
            "</figure>"
        )
    block = (
        '<div class="dream-crystal-reflection-strip" data-source="crystal-meaning-reuse">'
        + "\n".join(cards)
        + "</div>"
    )
    return block, images


def shop_module_html(crystal_images):
    """Render a WooCommerce product list without redundant category links."""
    if not crystal_images:
        return "", []
    products = [
        {
            "name": image["name"],
            "category_slug": f"{image['profile_slug'].removesuffix('-meaning')}-crystals",
        }
        for image in crystal_images
    ]
    available_products = [
        product for product in products
        if product["category_slug"] in PRODUCT_CATEGORIES_WITH_PRODUCTS
    ]
    category_slugs = ",".join(product["category_slug"] for product in available_products)
    product_shortcode = (
        f'[products category="{html.escape(category_slugs)}" limit="6" columns="3" orderby="date" order="DESC"]'
        if category_slugs
        else '[products limit="6" columns="3" orderby="date" order="DESC"]'
    )
    module = "".join([
        '<section class="dream-shop-reflection-crystals" data-module="shop-dream-reflection-crystals">',
        '<h2>Shop Dream Reflection Crystals</h2>',
        '<p>Choose a stone as a tangible cue for your journaling practice, not as a treatment or prediction.</p>',
        product_shortcode,
        '</section>',
    ])
    return module, available_products


def insert_crystal_modules(content_html: str, strip: str, shop_module: str) -> str:
    modules = "\n".join(module for module in (strip, shop_module) if module)
    if not modules:
        return content_html
    targets = [
        re.compile(r"(<h2>Crystals? for [^<]+</h2>)", re.I),
        re.compile(r"(<h2>Crystals? for Dream Reflection</h2>)", re.I),
    ]
    for target in targets:
        if target.search(content_html):
            return target.sub(r"\1\n" + modules, content_html, count=1)
    return content_html + "\n" + modules


def excerpt_from_markdown(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or stripped.startswith("-"):
            continue
        plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", stripped)
        plain = re.sub(r"[*`_]", "", plain)
        return plain[:155]
    return fallback[:155]


def normalize_meta_title(title: str, fallback_title: str) -> str:
    title = (title or fallback_title or "").replace("LuckyCrystals", "Earthward")
    if not title:
        return fallback_title
    return title


def featured_path(row) -> Path:
    slug = row["slug"]
    asset_slug = row.get("image_source_slug") or slug
    filename = (row.get("image") or {}).get("filename") or f"{slug}-hero.webp"
    return SITE_ASSET_ROOT / asset_slug / filename


def build_payload(row, crystal_lookup, source_bucket):
    body = (row.get("article") or {}).get("body_markdown") or ""
    if not body:
        raise ValueError(f"missing body_markdown: {row.get('slug')}")
    strip, crystal_images = crystal_strip_html(row, crystal_lookup)
    shop_module, shop_products = shop_module_html(crystal_images)
    content = insert_crystal_modules(markdown_to_html(body), strip, shop_module)
    title = row.get("title") or row.get("repaired_keyword") or row["slug"].replace("-", " ").title()
    image_file = featured_path(row)
    if not image_file.exists():
        raise FileNotFoundError(f"missing featured image for {row['slug']}: {image_file}")
    focus = row.get("repaired_keyword") or row.get("original_keyword") or row["slug"].replace("-", " ")
    return {
        "schema_version": "dream_wp_draft_v2",
        "source_bucket": source_bucket,
        "title": title,
        "slug": row["slug"],
        "previous_slug": row.get("previous_slug"),
        "status": "draft",
        "excerpt": row.get("meta_description") or excerpt_from_markdown(body, title),
        "content_html": content,
        "rank_math_title": normalize_meta_title(row.get("meta_title"), title),
        "rank_math_description": row.get("meta_description") or excerpt_from_markdown(body, title),
        "rank_math_focus_keyword": focus,
        "category_slug": "dreams",
        "category_name": "Dreams",
        "featured_image": {
            "file": str(image_file),
            "filename": image_file.name,
            "alt": (row.get("image") or {}).get("alt_text") or title,
        },
        "crystal_images": crystal_images,
        "shop_products": shop_products,
        "shop_module": {
            "mode": "related_categories" if shop_products else "all_products_fallback",
            "category_slugs": [product["category_slug"] for product in shop_products],
        },
        "requires_human_review": bool(row.get("requires_human_review", True)),
        "publication_ready": bool(row.get("publication_ready", False)),
        "url": row.get("url") or f"/{row['slug']}/",
        "page_type": row.get("page_type"),
        "priority": row.get("priority"),
        "repair_status": row.get("repair_status"),
    }


def main():
    readiness = read_jsonl(READINESS_PATH)
    ready_slugs = {row["slug"] for row in readiness if row.get("bucket") == "wp_draft_ready"}
    articles = {row["slug"]: row for row in read_jsonl(ARTICLES_PATH)}
    reuse_rows = read_jsonl(CRYSTAL_REUSE_PATH)
    crystal_lookup = pick_crystal_images(reuse_rows)

    selected = []
    missing_articles = sorted(slug for slug in ready_slugs if slug not in articles)
    if missing_articles:
        raise ValueError(f"ready slugs missing article rows: {missing_articles[:10]}")
    # Subject backbone pages take precedence over any short-form duplicate.
    backbone_slugs = set()
    for path in BACKBONE_PATHS:
        for row in read_jsonl(path):
            selected.append((row, "wp_draft_ready_backbone"))
            backbone_slugs.add(row["slug"])

    for slug in sorted(ready_slugs):
        if slug not in backbone_slugs:
            selected.append((articles[slug], "wp_draft_ready"))

    seen = set()
    duplicates = []
    payloads = []
    for row, bucket in selected:
        slug = row["slug"]
        if slug in seen:
            duplicates.append(slug)
            continue
        seen.add(slug)
        payloads.append(build_payload(row, crystal_lookup, bucket))
    if duplicates:
        raise ValueError(f"duplicate payload slugs: {duplicates}")

    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    for payload in payloads:
        out = POSTS_DIR / f"{payload['slug']}.json"
        out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest = {
        "schema_version": "dream_wp_draft_manifest_v2",
        "count": len(payloads),
        "posts_dir": str(POSTS_DIR),
        "manifest_path": str(MANIFEST_PATH),
        "bucket_counts": {
            "wp_draft_ready": sum(1 for p in payloads if p["source_bucket"] == "wp_draft_ready"),
            "wp_draft_ready_backbone": sum(1 for p in payloads if p["source_bucket"] == "wp_draft_ready_backbone"),
        },
        "category_slug": "dreams",
        "status": "draft",
        "publication_ready_false": sum(1 for p in payloads if not p["publication_ready"]),
        "requires_human_review_true": sum(1 for p in payloads if p["requires_human_review"]),
        "crystal_image_payloads": sum(1 for p in payloads if p["crystal_images"]),
        "shop_module_payloads": sum(1 for p in payloads if p["shop_module"]),
        "slugs": [p["slug"] for p in payloads],
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: manifest[k] for k in ["count", "bucket_counts", "publication_ready_false", "requires_human_review_true", "crystal_image_payloads"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
