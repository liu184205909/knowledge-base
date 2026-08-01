from __future__ import annotations

import argparse
import base64
import csv
import json
import mimetypes
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "v3" / "research" / "linganshi-235-media-upload-manifest-20260720.csv"


def load_env() -> dict[str, str]:
    values = dict(os.environ)
    for path in (Path.home() / ".env", Path(r"D:\Code\.env")):
        if not path.is_file():
            continue
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            if key.strip() in {"WP_SITE", "WP_USER", "WP_APP_PASSWORD"}:
                values[key.strip()] = value.strip()
    return values


def request_json(url: str, auth: str, method: str = "GET", body: bytes | None = None,
                 headers: dict[str, str] | None = None) -> tuple[int, object]:
    request_headers = {"Authorization": auth, "Accept": "application/json"}
    request_headers.update(headers or {})
    request = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = response.read()
            return response.status, json.loads(payload.decode("utf-8")) if payload else {}
    except urllib.error.HTTPError as error:
        payload = error.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {error.code} for {url}: {payload[:500]}") from error


def write_manifest(rows: list[dict[str, str]]) -> None:
    if ROOT not in MANIFEST.parents:
        raise RuntimeError(f"Manifest escaped project root: {MANIFEST}")
    fieldnames = list(rows[0])
    with MANIFEST.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Idempotently upload the 235 Linganshi draft images to WordPress Media.")
    parser.add_argument("--execute", action="store_true", help="Perform writes. Without this flag the script is read-only.")
    parser.add_argument("--confirm-site", default="", help="Must exactly equal WP_SITE before writes are allowed.")
    parser.add_argument("--limit", type=int, default=0, help="Optional maximum number of pending uploads for a controlled test.")
    arguments = parser.parse_args()

    if not MANIFEST.is_file():
        raise FileNotFoundError(MANIFEST)
    with MANIFEST.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 235 or len({row["material_key"] for row in rows}) != 235:
        raise RuntimeError("Media manifest must contain 235 unique material keys")
    missing = [row for row in rows if not Path(row["source_image_path"]).is_file()]
    if missing:
        raise RuntimeError(f"Media manifest has {len(missing)} missing source images")

    env = load_env()
    site = env.get("WP_SITE", "").strip().rstrip("/")
    user = env.get("WP_USER", "").strip()
    password = env.get("WP_APP_PASSWORD", "").strip()
    if not site or not user or not password:
        raise RuntimeError("WP_SITE, WP_USER and WP_APP_PASSWORD are required")
    host = urllib.parse.urlparse(site if "://" in site else "https://" + site).netloc
    base_url = site if "://" in site else "https://" + site
    pending = [row for row in rows if not row.get("wordpress_media_url", "").strip()]
    print(f"site={host} manifest_rows={len(rows)} pending={len(pending)} execute={arguments.execute}")
    if not arguments.execute:
        print("DRY RUN: no WordPress request or file write was performed")
        return
    if arguments.confirm_site.strip().lower() != host.lower():
        raise RuntimeError(f"Refusing WordPress writes: --confirm-site must equal {host}")

    auth = "Basic " + base64.b64encode(f"{user}:{password}".encode("utf-8")).decode("ascii")
    uploaded = 0
    reused = 0
    limit = arguments.limit if arguments.limit > 0 else len(pending)
    for row in pending:
        if uploaded + reused >= limit:
            break
        key = row["material_key"]
        query = urllib.parse.urlencode({"slug": key, "context": "edit", "per_page": 1})
        _, existing = request_json(f"{base_url}/wp-json/wp/v2/media?{query}", auth)
        if isinstance(existing, list) and existing:
            media = existing[0]
            reused += 1
            status = "reused-existing-media"
        else:
            source = Path(row["source_image_path"])
            content_type = mimetypes.guess_type(source.name)[0] or "image/webp"
            status_code, media = request_json(
                f"{base_url}/wp-json/wp/v2/media",
                auth,
                method="POST",
                body=source.read_bytes(),
                headers={
                    "Content-Type": content_type,
                    "Content-Disposition": f'attachment; filename="{row["upload_filename"]}"',
                },
            )
            if status_code not in {200, 201} or not isinstance(media, dict):
                raise RuntimeError(f"Unexpected media response for {key}: {status_code}")
            uploaded += 1
            status = "uploaded-draft-research-media"
            metadata = json.dumps({
                "title": row["source_product_name_zh"],
                "alt_text": row["source_product_name_zh"],
            }, ensure_ascii=False).encode("utf-8")
            request_json(
                f"{base_url}/wp-json/wp/v2/media/{media['id']}",
                auth,
                method="POST",
                body=metadata,
                headers={"Content-Type": "application/json; charset=utf-8"},
            )
        row["wordpress_attachment_id"] = str(media.get("id", ""))
        row["wordpress_media_url"] = str(media.get("source_url", ""))
        row["upload_status"] = status
        write_manifest(rows)
        print(f"{uploaded + reused}/{limit} {status} {key} attachment={row['wordpress_attachment_id']}")
        time.sleep(0.15)

    print(f"PASS uploaded={uploaded} reused={reused} manifest={MANIFEST}")


if __name__ == "__main__":
    main()
