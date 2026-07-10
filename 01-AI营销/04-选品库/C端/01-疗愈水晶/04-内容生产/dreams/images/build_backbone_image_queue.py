import json
from pathlib import Path


IMAGES_DIR = Path(__file__).resolve().parent
DREAMS_DIR = IMAGES_DIR.parent
BACKBONE_DIR = DREAMS_DIR / "backbone"
QUEUE_PATH = IMAGES_DIR / "dream-image-queue-backbone-16.jsonl"

SOURCE_FILES = [
    BACKBONE_DIR / "dream-backbone-subjects-6.jsonl",
    BACKBONE_DIR / "dream-backbone-subjects-10.jsonl",
]


def read_jsonl(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                yield json.loads(line)


def main():
    rows = []
    seen = set()
    for source_file in SOURCE_FILES:
        if not source_file.exists():
            raise FileNotFoundError(source_file)
        for row in read_jsonl(source_file):
            slug = row["slug"]
            if slug in seen:
                raise ValueError(f"duplicate backbone slug: {slug}")
            seen.add(slug)
            image = row.get("image") or {}
            hero_prompt = image.get("hero_prompt")
            if not hero_prompt:
                raise ValueError(f"missing hero_prompt: {slug}")
            rows.append(
                {
                    "slug": slug,
                    "title": row.get("title"),
                    "source": row.get("source"),
                    "bucket": row.get("bucket"),
                    "source_row": row.get("source_row", {}),
                    "filename": image.get("filename") or f"{slug}-hero.webp",
                    "hero_prompt": hero_prompt,
                    "negative_prompt": image.get("negative_prompt"),
                    "alt_text": image.get("alt_text"),
                    "actual_image_request": True,
                    "route": "wp_draft_ready_backbone",
                }
            )

    with QUEUE_PATH.open("w", encoding="utf-8", newline="\n") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    summary = {
        "queue_path": str(QUEUE_PATH),
        "rows": len(rows),
        "slugs": [row["slug"] for row in rows],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
