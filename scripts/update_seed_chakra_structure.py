"""
Update SEMrush-Seed-Keywords / Seed-Chakra to the shared Seed-* structure:

Keyword / 中文 / Entity / Subtopic / Content Role / Volume / KD / CPC /
Number of Results / Intent / Suggested Action / Reason / Confidence / Reviewed

The script is idempotent: if Entity and Content Role already exist, it only
refreshes those two columns.
"""

import json
import os
import re
import subprocess
import tempfile
import urllib.parse


SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
SHEET_NAME = "Seed-Chakra"
SHEET_ID = 56384262
PROXY = "http://127.0.0.1:10808"
CREDENTIALS_FILE = os.path.expanduser(
    "~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json"
)


def get_token():
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]


def curl_json(url, token, method="GET", body=None):
    cmd = ["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {token}"]
    tmp_name = None
    if body is not None:
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as tmp:
            json.dump(body, tmp, ensure_ascii=False)
            tmp_name = tmp.name
        cmd.extend(["-H", "Content-Type: application/json", "-X", method, "-d", f"@{tmp_name}"])

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or "curl failed")
        data = json.loads(result.stdout)
        if "error" in data:
            raise RuntimeError(json.dumps(data["error"], ensure_ascii=False))
        return data
    finally:
        if tmp_name:
            os.unlink(tmp_name)


def get_values(token, range_a1):
    enc_sheet = urllib.parse.quote(SHEET_NAME)
    enc_range = urllib.parse.quote(range_a1)
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc_sheet}!{enc_range}"
    )
    return curl_json(url, token).get("values", [])


def batch_update(token, requests):
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    return curl_json(url, token, method="POST", body={"requests": requests})


def values_batch_update(token, data):
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values:batchUpdate"
    return curl_json(
        url,
        token,
        method="POST",
        body={"valueInputOption": "RAW", "data": data},
    )


def contains(pattern, text):
    return re.search(pattern, text, re.I) is not None


def entity_for(keyword):
    kw = keyword.lower()
    rules = [
        (r"third eye|3rd eye|ajna|brow", "Third Eye Chakra"),
        (r"root|muladhara|mooladhara|base chakra", "Root Chakra"),
        (r"sacral|svadhisthana|swadhisthana", "Sacral Chakra"),
        (r"solar plexus|manipura", "Solar Plexus Chakra"),
        (r"heart|anahata", "Heart Chakra"),
        (r"throat|vishuddha", "Throat Chakra"),
        (r"crown|sahasrara", "Crown Chakra"),
        (r"7 chakra|seven chakra|all chakra", "Seven Chakras"),
        (r"color|colour", "Chakra Colors"),
        (r"symbol|chart", "Chakra Symbols / Chart"),
        (r"stone|crystal|gem|bracelet|necklace|bead|wand", "Chakra Crystals & Jewelry"),
        (r"meditation", "Chakra Meditation"),
        (r"yoga|pose|asana", "Chakra Yoga"),
        (r"healing|balance|cleansing|align|unblock|open", "Chakra Healing"),
        (r"frequency|sound|music|note", "Chakra Sound / Frequency"),
        (r"affirmation|mantra|mudra", "Chakra Practice"),
    ]
    for pattern, value in rules:
        if contains(pattern, kw):
            return value
    return "Chakra"


def content_role_for(keyword, subtopic):
    kw = keyword.lower()
    if contains(r"near me|shop|buy|bracelet|necklace|stone|crystal|gem|bead|wand", kw):
        return "Product / Category Page"
    if contains(r"^chakras?$|^7 chakras?$|^seven chakras$|^the 7 chakras$", kw):
        return "Guide Index / Hub"
    if subtopic == "Specific Chakra" and not contains(
        r"meaning|color|frequency|blocked|healing|meditation|affirmation|yoga|crystal|stone|open|unblock|balance|pose|mudra|mantra",
        kw,
    ):
        return "Main Article"
    if contains(r"meaning|definition|what is|what are|explained|color|symbol|chart", kw):
        return "Main Article / Guide Section"
    if contains(r"how to|unblock|open|balance|heal|healing|meditation|yoga|affirmation|frequency|mantra|mudra|pose|cleansing|align", kw):
        return "Separate Article Candidate"
    if subtopic == "Chakra Healing & Practice":
        return "Separate Article Candidate"
    if subtopic == "Chakra Crystals & Jewelry":
        return "Product / Category Page"
    return "Topic Keyword"


def ensure_structure(token):
    header = get_values(token, "A1:N1")[0]
    if "Entity" in header and "Content Role" in header:
        return header

    requests = [
        {
            "insertDimension": {
                "range": {
                    "sheetId": SHEET_ID,
                    "dimension": "COLUMNS",
                    "startIndex": 2,
                    "endIndex": 3,
                },
                "inheritFromBefore": True,
            }
        },
        {
            "insertDimension": {
                "range": {
                    "sheetId": SHEET_ID,
                    "dimension": "COLUMNS",
                    "startIndex": 4,
                    "endIndex": 5,
                },
                "inheritFromBefore": True,
            }
        },
        {
            "updateCells": {
                "range": {
                    "sheetId": SHEET_ID,
                    "startRowIndex": 0,
                    "endRowIndex": 1,
                    "startColumnIndex": 2,
                    "endColumnIndex": 5,
                },
                "rows": [
                    {
                        "values": [
                            {"userEnteredValue": {"stringValue": "Entity"}},
                            {"userEnteredValue": {"stringValue": "Subtopic"}},
                            {"userEnteredValue": {"stringValue": "Content Role"}},
                        ]
                    }
                ],
                "fields": "userEnteredValue",
            }
        },
    ]
    batch_update(token, requests)
    return get_values(token, "A1:N1")[0]


def main():
    token = get_token()
    header = ensure_structure(token)
    rows = get_values(token, "A2:N")

    output = []
    for row in rows:
        keyword = row[0].strip() if len(row) > 0 else ""
        subtopic = row[3].strip() if len(row) > 3 else ""
        if not keyword:
            output.append(["", ""])
            continue
        output.append([entity_for(keyword), content_role_for(keyword, subtopic)])

    values_batch_update(
        token,
        [
            {"range": f"{SHEET_NAME}!C2:C{len(output) + 1}", "values": [[r[0]] for r in output]},
            {"range": f"{SHEET_NAME}!E2:E{len(output) + 1}", "values": [[r[1]] for r in output]},
        ],
    )

    batch_update(
        token,
        [
            {
                "repeatCell": {
                    "range": {
                        "sheetId": SHEET_ID,
                        "startRowIndex": 0,
                        "endRowIndex": 1,
                        "startColumnIndex": 0,
                        "endColumnIndex": 14,
                    },
                    "cell": {
                        "userEnteredFormat": {
                            "backgroundColorStyle": {
                                "rgbColor": {"red": 0.82, "green": 0.94, "blue": 0.86}
                            },
                            "textFormat": {"bold": True},
                        }
                    },
                    "fields": "userEnteredFormat(backgroundColorStyle,textFormat)",
                }
            },
            {
                "updateSheetProperties": {
                    "properties": {
                        "sheetId": SHEET_ID,
                        "gridProperties": {"frozenRowCount": 1},
                    },
                    "fields": "gridProperties.frozenRowCount",
                }
            },
        ],
    )
    print(f"Updated {SHEET_NAME}: {len(output)} rows")


if __name__ == "__main__":
    main()
