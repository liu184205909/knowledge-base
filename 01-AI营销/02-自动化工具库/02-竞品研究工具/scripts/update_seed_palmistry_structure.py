"""
Update SEMrush-Seed-Keywords / Seed-Palmistry to the shared Seed-* structure.

Adds/fills Entity and Content Role. Does not delete review rows or merge into
Seed-Master.
"""

import re
import urllib.parse

from build_seed_master_v1 import SPREADSHEET_ID, get_access_token, request_json


SHEET_NAME = "Seed-Palmistry"
SHEET_ID = 48805297


def read_values(token, range_a1):
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote(SHEET_NAME)}!{urllib.parse.quote(range_a1)}"
    return request_json("GET", "sheets.googleapis.com", path, token).get("values", [])


def update_values(token, range_a1, values):
    path = f"/v4/spreadsheets/{SPREADSHEET_ID}/values/{urllib.parse.quote(SHEET_NAME + '!' + range_a1)}?valueInputOption=RAW"
    request_json("PUT", "sheets.googleapis.com", path, token, body={"values": values})


def batch_update(token, requests):
    request_json(
        "POST",
        "sheets.googleapis.com",
        f"/v4/spreadsheets/{SPREADSHEET_ID}:batchUpdate",
        token,
        body={"requests": requests},
    )


def ensure_structure(token):
    header = read_values(token, "A1:N1")[0]
    if "Entity" in header and "Content Role" in header:
        return header
    batch_update(
        token,
        [
            {
                "insertDimension": {
                    "range": {"sheetId": SHEET_ID, "dimension": "COLUMNS", "startIndex": 2, "endIndex": 3},
                    "inheritFromBefore": True,
                }
            },
            {
                "insertDimension": {
                    "range": {"sheetId": SHEET_ID, "dimension": "COLUMNS", "startIndex": 4, "endIndex": 5},
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
                    "properties": {"sheetId": SHEET_ID, "gridProperties": {"frozenRowCount": 1}},
                    "fields": "gridProperties.frozenRowCount",
                }
            },
        ],
    )
    return read_values(token, "A1:N1")[0]


def row_value(row, idx):
    return row[idx].strip() if len(row) > idx and row[idx] else ""


def entity_for(keyword):
    text = keyword.lower()
    rules = [
        (r"life line", "Life Line"),
        (r"heart line", "Heart Line"),
        (r"head line", "Head Line"),
        (r"fate line", "Fate Line"),
        (r"marriage line|relationship line|love line", "Marriage / Relationship Line"),
        (r"sun line|apollo line", "Sun / Apollo Line"),
        (r"health line", "Health Line"),
        (r"money line|wealth line", "Money Line"),
        (r"mount of|mounts", "Palm Mounts"),
        (r"hand shape|finger|thumb", "Hand Shape"),
        (r"left hand|right hand|dominant hand", "Reading Hand"),
        (r"palm reading|palmistry reading|read palms", "Palm Reading"),
        (r"palmistry chart|hand chart|palm chart", "Palmistry Chart"),
    ]
    for pattern, value in rules:
        if re.search(pattern, text):
            return value
    return "Palmistry"


def content_role_for(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"near me|reader|reading|service|appointment", text):
        return "Local SEO Candidate"
    if re.search(r"^palmistry$|^palm reading$|what is palmistry|palmistry meaning", text):
        return "Guide Index / Hub"
    if re.search(r"life line|heart line|head line|fate line|marriage line|sun line|health line|money line", text):
        return "Main Article"
    if re.search(r"how to|learn|guide|chart|meaning|explained", text):
        return "Main Article / Guide Section"
    if re.search(r"mount|hand shape|finger|thumb|left hand|right hand", text):
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
        else:
            output.append([entity_for(keyword), content_role_for(keyword, subtopic)])
    if output:
        update_values(token, f"C2:C{len(output) + 1}", [[row[0]] for row in output])
        update_values(token, f"E2:E{len(output) + 1}", [[row[1]] for row in output])
    print(f"Updated {SHEET_NAME}: {len(output)} rows")


if __name__ == "__main__":
    main()
