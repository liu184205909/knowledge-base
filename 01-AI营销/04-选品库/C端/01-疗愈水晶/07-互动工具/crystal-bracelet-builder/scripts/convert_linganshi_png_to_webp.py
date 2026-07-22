from __future__ import annotations

"""Convert the remaining approved Linganshi PNG assets to sibling WebP files.

The source PNG files are deliberately retained.  This script only writes a
same-stem .webp file when one does not already exist, so it is safe to rerun.
"""

import argparse
from pathlib import Path

from PIL import Image


DEFAULT_SOURCE = Path(r"C:\Users\Dylan\Desktop\灵感石验室")


def convert_one(source: Path, overwrite: bool) -> str:
    target = source.with_suffix(".webp")
    if target.exists() and not overwrite:
        return "skipped"

    with Image.open(source) as image:
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        if has_alpha:
            image.save(target, "WEBP", lossless=True, method=6)
        else:
            image.convert("RGB").save(target, "WEBP", quality=90, method=6)
    if not target.is_file() or target.stat().st_size == 0:
        raise RuntimeError(f"Conversion did not create a usable file: {target}")
    return "converted"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--overwrite", action="store_true")
    arguments = parser.parse_args()

    source_dir = arguments.source.resolve()
    if not source_dir.is_dir():
        raise FileNotFoundError(source_dir)

    pngs = sorted(path for path in source_dir.iterdir() if path.is_file() and path.suffix.lower() == ".png")
    converted = 0
    skipped = 0
    for source in pngs:
        result = convert_one(source, arguments.overwrite)
        converted += result == "converted"
        skipped += result == "skipped"
        print(f"{result}: {source.name}")
    print(f"PASS png={len(pngs)} converted={converted} skipped={skipped} source={source_dir}")


if __name__ == "__main__":
    main()
