from __future__ import annotations

import csv
import json
import shutil
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "data" / "v3" / "research"
FRONTEND = ROOT / "frontend"
IMPORT_CSV = RESEARCH / "linganshi-235-draft-catalog-20260720.import.csv"
MEDIA_MANIFEST = RESEARCH / "linganshi-235-media-upload-manifest-20260720.csv"
ASSET_DIR = FRONTEND / "assets" / "linganshi-draft"
OUTPUT = FRONTEND / "t17-builder-linganshi-draft-catalog.js"


def number(value: str) -> float:
    try:
        return float(value or 0)
    except ValueError:
        return 0.0


def display_scale(size: float, component_type: str) -> float:
    if component_type != "bead" or size <= 0:
        return 1.0
    # The canvas still uses the independent physical size. This limited display scale
    # only keeps 6–15 mm card art legible and inside the fixed card visual box.
    return round(max(0.82, min(1.12, 0.82 + (size - 6) * 0.04)), 3)


def main() -> None:
    for required in (IMPORT_CSV, MEDIA_MANIFEST):
        if not required.is_file():
            raise FileNotFoundError(required)
    for target in (ASSET_DIR, OUTPUT):
        resolved = target.resolve()
        if ROOT.resolve() not in resolved.parents:
            raise RuntimeError(f"Output escaped project root: {resolved}")

    with IMPORT_CSV.open(encoding="utf-8-sig", newline="") as handle:
        import_rows = list(csv.DictReader(handle))
    with MEDIA_MANIFEST.open(encoding="utf-8-sig", newline="") as handle:
        media_rows = list(csv.DictReader(handle))
    media_by_key = {row["material_key"]: row for row in media_rows}
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in import_rows:
        grouped[row["material_key"]].append(row)
    if len(grouped) != 235 or len(media_by_key) != 235:
        raise RuntimeError(f"Expected 235 materials, found import={len(grouped)} media={len(media_by_key)}")

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    expected_assets: set[str] = set()
    materials = []
    for material_key in sorted(grouped, key=lambda key: int(grouped[key][0]["material_sort_order"])):
        rows = grouped[material_key]
        first = rows[0]
        media = media_by_key[material_key]
        source = Path(media["source_image_path"])
        if not source.is_file():
            raise FileNotFoundError(source)
        filename = material_key + ".webp"
        expected_assets.add(filename)
        destination = ASSET_DIR / filename
        shutil.copy2(source, destination)
        relative_image = "assets/linganshi-draft/" + filename
        variants = []
        for row in sorted(rows, key=lambda item: int(item["variant_sort_order"])):
            size = number(row["size_mm"])
            price = number(row["price"])
            variants.append({
                "id": row["variant_key"],
                "size_mm": size,
                "price": price,
                "weight_g": number(row["weight_g"]),
                "occupied_length_mm": number(row["occupied_length_mm"]),
                "display_scale": display_scale(size, row["component_type"]),
                "compatible_bead_sizes": [],
                "orientation_mode": "none",
                "image_url": relative_image,
                "is_fixture": True,
                # Unknown competitor values remain visible for mapping review but
                # must never behave like selectable zero-price production data.
                "draft_pending": size <= 0 or price <= 0,
            })
        materials.append({
            "material_key": material_key,
            "component_type": first["component_type"],
            "category_slug": first["category_slug"],
            "is_fixture": True,
            "name_en": media["source_product_name_zh"],
            "primary_color": "unspecified",
            "swatch_color": "#d8d3c8",
            "color_tags": [],
            "image_url": relative_image,
            "variants": variants,
        })

    extras = sorted(path.name for path in ASSET_DIR.glob("*.webp") if path.name not in expected_assets)
    if extras:
        raise RuntimeError("Unexpected assets require manual review; no files were deleted: " + " | ".join(extras))
    if len(list(ASSET_DIR.glob("*.webp"))) != 235:
        raise RuntimeError("Local draft asset directory must contain exactly 235 WebP files")

    payload = {
        "schema_version": "ew-t17-v3-linganshi-235-draft-fixture",
        "materials": materials,
    }
    javascript = (
        "/* Generated local fixture from the 235-image Linganshi review set.\n"
        " * Never enqueue this file on a WordPress page or treat its draft values as sellable data. */\n"
        "(function (config) {\n"
        "  if (!config || !config.mockMode) { throw new Error('Linganshi draft catalog requires local mock mode.'); }\n"
        "  config.fixtureLabel = 'Linganshi 235-card development draft — missing data remains unsellable.';\n"
        "  config.currencySymbol = '¥';\n"
        "  config.mockInitialSequence = [];\n"
        "  config.mockCatalog = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n})(window.EW_T17_UI_CONFIG);\n"
    )
    OUTPUT.write_text(javascript, encoding="utf-8")
    print(f"PASS materials={len(materials)} variants={sum(len(item['variants']) for item in materials)} assets=235")
    print(OUTPUT)
    print(ASSET_DIR)


if __name__ == "__main__":
    main()
