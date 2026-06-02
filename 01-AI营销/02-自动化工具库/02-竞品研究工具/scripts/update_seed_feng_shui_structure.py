"""
Update SEMrush-Seed-Keywords / Seed-Feng-Shui to the shared Seed-* structure.

Adds/fills:
- Entity
- Content Role

This script does not delete Delete/Review rows and does not merge into
Seed-Master. Feng Shui should be reviewed before import.
"""

import re
import urllib.parse

from build_seed_master_v1 import SPREADSHEET_ID, get_access_token, request_json


SHEET_NAME = "Seed-Feng-Shui"
SHEET_ID = 874966104


def read_values(token, range_a1):
    enc_sheet = urllib.parse.quote(SHEET_NAME)
    enc_range = urllib.parse.quote(range_a1)
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_sheet}!{enc_range}"
    return request_json("GET", "sheets.googleapis.com", path, token).get("values", [])


def update_values(token, range_a1, values):
    enc_range = urllib.parse.quote(f"{SHEET_NAME}!{range_a1}")
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc_range}?valueInputOption=RAW"
    request_json("PUT", "sheets.googleapis.com", path, token, body={"values": values})


def batch_update(token, requests):
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate"
    request_json("POST", "sheets.googleapis.com", path, token, body={"requests": requests})


def ensure_structure(token):
    header = read_values(token, "A1:N1")[0]
    if "Entity" in header and "Content Role" in header:
        return header

    batch_update(
        token,
        [
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
    return read_values(token, "A1:N1")[0]


def row_value(row, index):
    return row[index].strip() if len(row) > index and row[index] else ""


def entity_for(keyword):
    text = keyword.lower()
    rules = [
        (r"bagua|ba gua", "Bagua"),
        (r"wealth|money|prosperity|abundance", "Wealth Feng Shui"),
        (r"bedroom|bed\b|sleep", "Bedroom Feng Shui"),
        (r"mirror", "Mirror Feng Shui"),
        (r"front door|entry|entrance", "Front Door Feng Shui"),
        (r"kitchen", "Kitchen Feng Shui"),
        (r"office|desk|work", "Office Feng Shui"),
        (r"living room", "Living Room Feng Shui"),
        (r"bathroom", "Bathroom Feng Shui"),
        (r"plant|money tree|bamboo", "Feng Shui Plants"),
        (r"color|colour", "Feng Shui Colors"),
        (r"crystal|stone|gem", "Feng Shui Crystals"),
        (r"compass|direction|north|south|east|west", "Feng Shui Directions"),
        (r"house|home|apartment|room", "Home Feng Shui"),
        (r"dragon|turtle|frog|pixiu|pi xiu|laughing buddha", "Feng Shui Symbol"),
        (r"career|love|relationship|health", "Life Area Feng Shui"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Feng Shui"


def content_role_for(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|shop|buy|for sale|store", text):
        return "Local SEO Candidate"
    if re.search(r"^feng shui$|feng shui meaning|what is feng shui|feng shui basics", text):
        return "Guide Index / Hub"
    if re.search(r"bedroom|kitchen|office|front door|living room|bathroom|home|house|room|apartment", text):
        return "Main Article"
    if re.search(r"wealth|money|love|career|health|prosperity|abundance", text):
        return "Main Article / Guide Section"
    if re.search(r"plant|money tree|bamboo|crystal|mirror|color|colour|symbol|dragon|frog|pixiu|turtle", text):
        return "Separate Article Candidate"
    if re.search(r"how to|tips|rules|layout|placement|cure", text):
        return "Separate Article Candidate"
    if subtopic:
        return "Topic Keyword"
    return "Review"


def main():
    token = get_access_token()
    ensure_structure(token)
    header = read_values(token, "A1:N1")[0]
    indexes = {name: header.index(name) for name in header}
    rows = read_values(token, "A2:N")
    output = []
    for row in rows:
        keyword = row_value(row, indexes["Keyword"])
        subtopic = row_value(row, indexes["Subtopic"])
        if not keyword:
            output.append(["", ""])
            continue
        output.append([entity_for(keyword), content_role_for(keyword, subtopic)])

    if output:
        update_values(token, f"C2:C{len(output) + 1}", [[row[0]] for row in output])
        update_values(token, f"E2:E{len(output) + 1}", [[row[1]] for row in output])
    print(f"Updated {SHEET_NAME}: {len(output)} rows")


if __name__ == "__main__":
    main()
