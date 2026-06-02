"""
Update SEMrush-Seed-Keywords / Seed-Angel-Numbers to the shared Seed-* structure.

Adds/fills:
- Entity
- Content Role
"""

import re
import urllib.parse

from build_seed_master_v1 import SPREADSHEET_ID, get_access_token, request_json


SHEET_NAME = "Seed-Angel-Numbers"
SHEET_ID = 1849388684


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


def number_entity(keyword):
    text = keyword.lower()
    spaced = re.search(r"\b(\d{1,4})\s+(\d{1,4})\b", text)
    if spaced:
        return f"Angel Number {spaced.group(1)}:{spaced.group(2)}"
    match = re.search(r"\b\d{2,4}\b", text)
    if match:
        return f"Angel Number {match.group(0)}"
    if "biblical" in text:
        return "Biblical Angel Numbers"
    if "my angel" in text or "personal" in text:
        return "Personal Angel Number"
    if "meaning" in text:
        return "Angel Number Meanings"
    return "Angel Numbers"


def content_role(keyword, subtopic):
    text = keyword.lower()
    if re.search(r"\b\d{2,4}\b", text):
        return "Main Article"
    if "my angel" in text or "calculator" in text or "personal" in text:
        return "Tool / Quiz Candidate"
    if keyword.strip().lower() in {"angel numbers", "angel number"}:
        return "Guide Index / Hub"
    if "meaning" in text or subtopic == "Angel Number Meaning":
        return "Main Article / Guide Section"
    if text.startswith("what ") or text.startswith("are ") or "biblical" in text:
        return "Guide Section / FAQ"
    return "Topic Keyword"


def main():
    token = get_access_token()
    header = ensure_structure(token)
    rows = read_values(token, "A2:N")
    header = read_values(token, "A1:N1")[0]
    indexes = {name: header.index(name) for name in header}
    output = []
    for row in rows:
        keyword = row_value(row, indexes["Keyword"])
        subtopic = row_value(row, indexes["Subtopic"])
        if not keyword:
            output.append(["", ""])
            continue
        output.append([number_entity(keyword), content_role(keyword, subtopic)])

    if output:
        update_values(token, f"C2:C{len(output) + 1}", [[row[0]] for row in output])
        update_values(token, f"E2:E{len(output) + 1}", [[row[1]] for row in output])
    print(f"Updated {SHEET_NAME}: {len(output)} rows")


if __name__ == "__main__":
    main()
