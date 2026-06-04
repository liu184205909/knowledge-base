"""
Build Seed-Master v2 from cleaned Seed-* sheets.

Scope: all 12 Seed-* topics (Crystals, Chakra, Tarot, Astrology, Zodiac,
Numerology, Angel Numbers, Feng Shui, Meditation, Moon Phases, Palmistry,
Spirituality).

Imports only core fields:
Keyword / 中文 / Topic Pillar / Entity / Subtopic / Content Role / Volume / KD /
CPC / Number of Results / Intent

Cross-topic dedup: normalized keyword -> keep highest Volume.
Does not import cleaning helper columns:
Suggested Action / Reason / Confidence / Reviewed
"""

import json
import os
import http.client
import re
import socket
import ssl
import time
import urllib.parse


SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
SOCKS_HOST = "127.0.0.1"
SOCKS_PORT = 10808
CREDENTIALS_FILE = os.path.expanduser(
    "~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json"
)

SOURCE_SHEETS = [
    ("Seed-Crystals", "Crystals"),
    ("Seed-Chakra", "Chakra"),
    ("Seed-Tarot", "Tarot"),
    ("Seed-Astrology", "Astrology"),
    ("Seed-Zodiac", "Zodiac"),
    ("Seed-Numerology", "Numerology"),
    ("Seed-Angel-Numbers", "Angel Numbers"),
    ("Seed-Feng-Shui", "Feng Shui"),
    ("Seed-Meditation", "Meditation"),
    ("Seed-Moon-Phases", "Moon Phases"),
    ("Seed-Palmistry", "Palmistry"),
    ("Seed-Spirituality", "Spirituality"),
]

MASTER_SHEET = "Seed-Master"
MASTER_SHEET_ID = 940704268
MASTER_HEADER = [
    "Keyword",
    "中文",
    "Topic Pillar",
    "Entity",
    "Subtopic",
    "Content Role",
    "Volume",
    "KD",
    "CPC",
    "Number of Results",
    "Intent",
]


class SocksHTTPSConnection(http.client.HTTPSConnection):
    def connect(self):
        sock = socket.create_connection((SOCKS_HOST, SOCKS_PORT), self.timeout)
        sock.sendall(b"\x05\x01\x00")
        response = sock.recv(2)
        if response != b"\x05\x00":
            raise OSError(f"SOCKS auth failed: {response!r}")

        host_bytes = self.host.encode("idna")
        request = (
            b"\x05\x01\x00\x03"
            + bytes([len(host_bytes)])
            + host_bytes
            + int(self.port).to_bytes(2, "big")
        )
        sock.sendall(request)
        response = sock.recv(10)
        if len(response) < 2 or response[1] != 0:
            raise OSError(f"SOCKS connect failed: {response!r}")

        context = self._context or ssl.create_default_context()
        self.sock = context.wrap_socket(sock, server_hostname=self.host)


def https_json(host, path, method="GET", token=None, body=None, content_type="application/json"):
    headers = {"Accept": "application/json"}
    payload = None
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if body is not None:
        if isinstance(body, bytes):
            payload = body
        else:
            payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = content_type
        headers["Content-Length"] = str(len(payload))

    conn = SocksHTTPSConnection(host, timeout=180)
    conn.request(method, path, body=payload, headers=headers)
    response = conn.getresponse()
    text = response.read().decode("utf-8")
    conn.close()
    if response.status >= 400:
        raise RuntimeError(f"HTTP {response.status}: {text[:500]}")
    return json.loads(text) if text else {}


def get_access_token():
    env_token = os.environ.get("GOOGLE_ACCESS_TOKEN")
    if env_token:
        return env_token

    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        cred = json.load(f)

    form = urllib.parse.urlencode(
        {
            "client_id": cred["client_id"],
            "client_secret": cred["client_secret"],
            "refresh_token": cred["refresh_token"],
            "grant_type": "refresh_token",
        }
    ).encode("utf-8")
    response = https_json(
        "oauth2.googleapis.com",
        "/token",
        method="POST",
        body=form,
        content_type="application/x-www-form-urlencoded",
    )
    return response["access_token"]


def request_json(method, host, path, token, body=None):
    for attempt in range(5):
        try:
            return https_json(host, path, method=method, token=token, body=body)
        except Exception as exc:
            if attempt == 4:
                raise
            message = str(exc)
            if "HTTP 429" in message or "RESOURCE_EXHAUSTED" in message:
                time.sleep(65)
            else:
                time.sleep(2 + attempt * 2)


def read_values(token, sheet_name, range_a1):
    enc_sheet = urllib.parse.quote(sheet_name)
    enc_range = urllib.parse.quote(range_a1)
    url = (
        f"/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc_sheet}!{enc_range}"
    )
    return request_json("GET", "sheets.googleapis.com", url, token).get("values", [])


def clear_master(token):
    enc_range = urllib.parse.quote(f"{MASTER_SHEET}!A:K")
    url = (
        f"/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc_range}:clear"
    )
    request_json("POST", "sheets.googleapis.com", url, token, body={})


def batch_update(token, requests):
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    return request_json("POST", "sheets.googleapis.com", path, token, body={"requests": requests})


def resize_master(token, row_count):
    batch_update(
        token,
        [
            {
                "updateSheetProperties": {
                    "properties": {
                        "sheetId": MASTER_SHEET_ID,
                        "gridProperties": {
                            "rowCount": row_count,
                            "columnCount": max(len(MASTER_HEADER), 19),
                            "frozenRowCount": 1,
                        },
                    },
                    "fields": "gridProperties(rowCount,columnCount,frozenRowCount)",
                }
            }
        ],
    )


def update_values(token, range_a1, values):
    enc_range = urllib.parse.quote(range_a1)
    url = (
        f"/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc_range}?valueInputOption=RAW"
    )
    request_json("PUT", "sheets.googleapis.com", url, token, body={"values": values})


def normalize_keyword(keyword):
    return re.sub(r"\s+", " ", keyword.strip().lower())


def to_number(value):
    if value is None:
        return 0.0
    text = str(value).replace(",", "").strip()
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def row_value(row, index):
    if index >= len(row):
        return ""
    return row[index]


def source_records(token):
    records = {}
    topic_overlaps = {}  # normalized_keyword -> set of topic pillars
    stats = {}
    required = [
        "Keyword",
        "中文",
        "Entity",
        "Subtopic",
        "Content Role",
        "Volume",
        "KD",
        "CPC",
        "Number of Results",
        "Intent",
        "Suggested Action",
    ]

    for sheet_name, topic_pillar in SOURCE_SHEETS:
        rows = read_values(token, sheet_name, "A1:N")
        if not rows:
            raise RuntimeError(f"{sheet_name} is empty")
        header = rows[0]
        indexes = {name: header.index(name) for name in required if name in header}
        missing = [name for name in required if name not in indexes]
        if missing:
            raise RuntimeError(f"{sheet_name} missing columns: {missing}")

        kept = 0
        skipped = 0
        for row in rows[1:]:
            keyword = row_value(row, indexes["Keyword"]).strip()
            if not keyword:
                continue
            action = row_value(row, indexes["Suggested Action"]).strip()
            if action and action != "Keep":
                skipped += 1
                continue

            record = [
                keyword,
                row_value(row, indexes["中文"]),
                topic_pillar,
                row_value(row, indexes["Entity"]),
                row_value(row, indexes["Subtopic"]),
                row_value(row, indexes["Content Role"]),
                row_value(row, indexes["Volume"]),
                row_value(row, indexes["KD"]),
                row_value(row, indexes["CPC"]),
                row_value(row, indexes["Number of Results"]),
                row_value(row, indexes["Intent"]),
            ]
            key = normalize_keyword(keyword)
            # Track topic overlaps (a keyword naturally spans multiple topics)
            if key not in topic_overlaps:
                topic_overlaps[key] = set()
            topic_overlaps[key].add(topic_pillar)

            existing = records.get(key)
            if existing is None or to_number(record[6]) > to_number(existing[6]):
                records[key] = record
            kept += 1
        stats[sheet_name] = {"kept": kept, "skipped": skipped}

    # Count cross-topic overlaps (normal: keywords naturally span multiple topics)
    overlaps = {k: list(v) for k, v in topic_overlaps.items() if len(v) > 1}
    stats["_cross_topic_overlaps"] = len(overlaps)
    stats["_overlap_samples"] = dict(list(overlaps.items())[:20])

    return list(records.values()), stats


def write_master(token, records):
    resize_master(token, len(records) + 1)
    clear_master(token)
    update_values(token, f"{MASTER_SHEET}!A1:K1", [MASTER_HEADER])
    chunk_size = 400
    for start in range(0, len(records), chunk_size):
        end = min(start + chunk_size, len(records))
        row_start = start + 2
        row_end = end + 1
        update_values(token, f"{MASTER_SHEET}!A{row_start}:K{row_end}", records[start:end])


def main():
    token = get_access_token()
    records, stats = source_records(token)
    write_master(token, records)
    print(json.dumps({"rows_written": len(records), "source_stats": stats}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
