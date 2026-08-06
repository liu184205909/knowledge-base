import json
from collections import Counter
from pathlib import Path


DREAM_IMAGES_DIR = Path(__file__).resolve().parent
DREAMS_DIR = DREAM_IMAGES_DIR.parent
PROJECT_DIR = DREAMS_DIR.parent.parent
CONTENT_DIR = DREAMS_DIR.parent
CRYSTAL_JSON_DIR = CONTENT_DIR / "1.crystal-meaning"
CRYSTAL_ASSET_DIR = PROJECT_DIR / "02-网站规划" / "assets" / "images" / "generated" / "1.crystal-meaning"

QUEUE_PATH = DREAM_IMAGES_DIR / "dream-image-queue-repaired-full-1289.jsonl"
MANIFEST_PATH = DREAM_IMAGES_DIR / "dream-crystal-reuse-manifest-repaired-full-1289.jsonl"
SUMMARY_PATH = DREAM_IMAGES_DIR / "dream-crystal-reuse-summary-repaired-full-1289.json"


def read_jsonl(path):
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def read_profile(slug):
    path = CRYSTAL_JSON_DIR / f"{slug}.json"
    if not path.exists():
        return None, []
    profile = json.loads(path.read_text(encoding="utf-8"))
    images = []
    for slot, item in (profile.get("images") or {}).items():
        images.append({
            "slot": slot,
            "src": item.get("src"),
            "alt": item.get("alt"),
            "wp_id": item.get("wp_id"),
        })
    return profile, images


def local_assets(slug):
    folder = CRYSTAL_ASSET_DIR / slug.removesuffix("-meaning")
    if not folder.exists():
        return []
    return sorted((
        {
            "filename": path.name,
            "local_path": str(path),
            "site_relative_path": path.relative_to(PROJECT_DIR).as_posix(),
            "size": path.stat().st_size,
        }
        for path in folder.glob("*.webp")
    ), key=lambda item: item["filename"])


def preferred_asset(assets, slug):
    stem = slug.removesuffix("-meaning")
    preferred_names = [
        f"{stem}-overview.webp",
        f"{stem}-hero.webp",
        f"{stem}-benefits.webp",
    ]
    for name in preferred_names:
        match = next((asset for asset in assets if asset["filename"] == name), None)
        if match:
            return match
    return assets[0] if assets else None


def crystal_name(slug, profile):
    if profile:
        title = profile.get("title") or ""
        if title:
            return title.split(" Meaning", 1)[0].strip()
    return slug.removesuffix("-meaning").replace("-", " ").title()


def build():
    rows = read_jsonl(QUEUE_PATH)
    manifest = []
    missing_json = 0
    missing_assets = 0
    unique_profiles = set()
    ref_distribution = Counter()

    for row in rows:
        reuse = []
        for slot in row.get("crystal_reuse_slots") or []:
            slug = slot["slug"]
            unique_profiles.add(slug)
            profile, json_images = read_profile(slug)
            assets = local_assets(slug)
            if profile is None:
                missing_json += 1
            if not assets:
                missing_assets += 1
            reuse.append({
                "name": crystal_name(slug, profile),
                "profile_slug": slug,
                "profile_path": slot.get("profile_path") or f"/{slug}/",
                "image_request": slot.get("image_request") or "reuse_existing_390_library",
                "reuse_source": "repaired-full crystal_reuse_slots",
                "json_image_count": len(json_images),
                "local_asset_count": len(assets),
                "preferred_asset": preferred_asset(assets, slug),
                "json_images": json_images,
                "all_crystal_assets_resolved": bool(assets),
                "all_crystal_json_resolved": profile is not None,
            })
        ref_distribution[str(len(reuse))] += 1
        manifest.append({
            "source_row": row.get("source_row"),
            "dream_slug": row.get("slug"),
            "keyword": row.get("keyword"),
            "priority": row.get("priority"),
            "repair_status": row.get("repair_status"),
            "hero_image": row.get("image"),
            "crystal_reuse": reuse,
            "crystal_reuse_count": len(reuse),
            "all_crystal_assets_resolved": all(item["all_crystal_assets_resolved"] for item in reuse),
            "all_crystal_json_resolved": all(item["all_crystal_json_resolved"] for item in reuse),
        })

    MANIFEST_PATH.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in manifest) + "\n",
        encoding="utf-8",
    )
    summary = {
        "dream_rows": len(rows),
        "dream_rows_with_crystal_reuse": sum(1 for row in manifest if row["crystal_reuse_count"] > 0),
        "unique_crystal_profiles_reused": len(unique_profiles),
        "unique_crystal_profiles": sorted(unique_profiles),
        "missing_crystal_json_refs": missing_json,
        "missing_local_asset_refs": missing_assets,
        "crystal_json_dir": str(CRYSTAL_JSON_DIR),
        "crystal_asset_dir": str(CRYSTAL_ASSET_DIR),
        "crystal_ref_count_distribution": dict(sorted(ref_distribution.items())),
        "output": str(MANIFEST_PATH),
    }
    SUMMARY_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    build()
