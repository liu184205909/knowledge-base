"""
Audit SEMrush-Seed-Keywords Seed-* sheets.

Outputs row counts, header status, Suggested Action counts, and whether the
shared fields Entity / Subtopic / Content Role exist.
"""

from build_seed_master_v1 import SPREADSHEET_ID, get_access_token, request_json


SHEETS = [
    "Seed-Crystals",
    "Seed-Chakra",
    "Seed-Tarot",
    "Seed-Astrology",
    "Seed-Zodiac",
    "Seed-Numerology",
    "Seed-Angel-Numbers",
    "Seed-Feng-Shui",
    "Seed-Meditation",
    "Seed-Moon-Phases",
    "Seed-Palmistry",
    "Seed-Spirituality",
]


def read_values(token, sheet_name, range_a1):
    import urllib.parse

    enc_sheet = urllib.parse.quote(sheet_name)
    enc_range = urllib.parse.quote(range_a1)
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_sheet}!{enc_range}"
    return request_json("GET", "sheets.googleapis.com", path, token).get("values", [])


def main():
    token = get_access_token()
    print("| Sheet | Rows | Has Entity | Has Content Role | Keep | Delete | Review | Other/Blank | Notes |")
    print("|---|---:|---|---|---:|---:|---:|---:|---|")
    for sheet in SHEETS:
        rows = read_values(token, sheet, "A1:N")
        if not rows:
            print(f"| {sheet} | 0 | - | - | 0 | 0 | 0 | 0 | empty |")
            continue
        header = rows[0]
        data = rows[1:]
        has_entity = "Entity" in header
        has_content_role = "Content Role" in header
        action_idx = header.index("Suggested Action") if "Suggested Action" in header else None
        counts = {"Keep": 0, "Delete": 0, "Review": 0, "Other/Blank": 0}
        for row in data:
            action = ""
            if action_idx is not None and len(row) > action_idx:
                action = row[action_idx].strip()
            if action in counts:
                counts[action] += 1
            else:
                counts["Other/Blank"] += 1
        notes = []
        required = ["Keyword", "中文", "Subtopic", "Volume", "KD", "CPC", "Number of Results", "Intent"]
        missing = [field for field in required if field not in header]
        if missing:
            notes.append("missing " + ",".join(missing))
        if not has_entity or not has_content_role:
            notes.append("needs shared fields")
        print(
            f"| {sheet} | {len(data)} | {'yes' if has_entity else 'no'} | {'yes' if has_content_role else 'no'} | "
            f"{counts['Keep']} | {counts['Delete']} | {counts['Review']} | {counts['Other/Blank']} | "
            f"{'; '.join(notes) or 'ok'} |"
        )


if __name__ == "__main__":
    main()
