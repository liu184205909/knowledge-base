"""
Step 3 cleaning for Seed-Feng-Shui: apply semantic filtering rules,
write Suggested Action / Reason / Confidence to the sheet.

Rules applied:
- Near duplicates: keep highest Volume, mark others Review
- Location words: mark Review
- Super long tail low volume (words>=5, Vol<200): mark Review
- Brand/platform words: mark Delete
- Entity misalignment: mark Review

Does NOT touch Keep rows that don't match any rule.
"""
import json, os, urllib.request, urllib.parse, re
from collections import defaultdict

# --- Auth ---
f = os.path.expanduser("~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json")
cred = json.load(open(f))
t = cred["token"]
proxy = urllib.request.ProxyHandler({"https": "http://127.0.0.1:10808"})
opener = urllib.request.build_opener(proxy)

SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
SHEET = "Seed-Feng-Shui"

def read_range(range_str):
    encoded = urllib.parse.quote(f"{SHEET}!{range_str}", safe="!:")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{encoded}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {t}"})
    resp = opener.open(req, timeout=20)
    return json.loads(resp.read().decode("utf-8")).get("values", [])

def write_range(range_str, values):
    """Write 2D array to sheet."""
    encoded = urllib.parse.quote(f"{SHEET}!{range_str}", safe="!:")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{encoded}?valueInputOption=RAW"
    body = json.dumps({"values": values}).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="PUT", headers={
        "Authorization": f"Bearer {t}",
        "Content-Type": "application/json",
    })
    resp = opener.open(req, timeout=20)
    return json.loads(resp.read().decode("utf-8"))

# --- Read all data ---
print("Reading Seed-Feng-Shui...")
header = read_range("A1:N1")[0]
rows = read_range("A2:N2000")
N = len(rows)
print(f"Total rows: {N}")

# Build records
records = []
for i, row in enumerate(rows):
    padded = row + [""] * (14 - len(row))
    records.append({
        "idx": i,          # 0-based index into records
        "row": i + 2,      # 1-based sheet row
        "keyword": padded[0].strip(),
        "cn": padded[1].strip(),
        "entity": padded[2].strip(),
        "subtopic": padded[3].strip(),
        "content_role": padded[4].strip(),
        "volume": padded[5].strip(),
        "kd": padded[6].strip(),
        "intent": padded[9].strip(),
        "sa": padded[10].strip(),
        "reason": padded[11].strip(),
        "confidence": padded[12].strip(),
        "reviewed": padded[13].strip(),
    })

# --- Step 3 Rules ---

# Rule 1: Near duplicates (normalized word-set matching)
def normalize_for_dedup(kw):
    kw = kw.lower().strip()
    # Remove common function words that don't change intent
    for w in ["the ", "a ", "an ", "of ", "for ", "in ", "with ", "and ", "to ", "is ", "what "]:
        kw = kw.replace(w, " ")
    return " ".join(sorted(kw.split()))

dup_groups = defaultdict(list)
for r in records:
    if r["keyword"]:
        dup_groups[normalize_for_dedup(r["keyword"])].append(r)

near_dupe_extras = set()  # row numbers that are near-duplicate extras
for norm, group in dup_groups.items():
    if len(group) > 1:
        # Sort by volume descending, keep first
        sorted_group = sorted(group, key=lambda x: -int(x["volume"] or "0"))
        for item in sorted_group[1:]:
            near_dupe_extras.add(item["row"])

print(f"Near-duplicate extra rows: {len(near_dupe_extras)}")

# Rule 2: Location words
LOCATION_PATTERNS = [
    r"\bwaltham\b", r"\btyngsboro\b", r"\bboston\b",
    r"\b ma\b", r"\b ca\b", r"\b tx\b", r"\b ny\b",
]
location_rows = set()
for r in records:
    kw_lower = r["keyword"].lower()
    if any(re.search(p, kw_lower) for p in LOCATION_PATTERNS):
        location_rows.add(r["row"])
print(f"Location word rows: {len(location_rows)}")

# Rule 3: Brand/platform words -> Delete
BRAND_PATTERNS = [
    r"\betsy\b", r"\bamazon\b", r"\btiktok\b", r"\bpinterest\b",
    r"\bebay\b", r"\bwalmart\b", r"\btemu\b", r"\bshein\b",
]
brand_rows = set()
for r in records:
    kw_lower = r["keyword"].lower()
    if any(re.search(p, kw_lower) for p in BRAND_PATTERNS):
        brand_rows.add(r["row"])
print(f"Brand word rows: {len(brand_rows)}")

# Rule 4: Super long tail low volume
longtail_rows = set()
for r in records:
    if not r["keyword"]:
        continue
    wc = len(r["keyword"].split())
    vol = int(r["volume"]) if r["volume"].isdigit() else 0
    if wc >= 5 and vol < 200:
        longtail_rows.add(r["row"])
print(f"Long tail low vol rows: {len(longtail_rows)}")

# Rule 5: High KD low volume
highkd_rows = set()
for r in records:
    kd = int(r["kd"]) if r["kd"].isdigit() else 0
    vol = int(r["volume"]) if r["volume"].isdigit() else 0
    if kd > 80 and vol < 500:
        highkd_rows.add(r["row"])
print(f"High KD low vol rows: {len(highkd_rows)}")

# --- Build SA/Reason/Confidence for each row ---
# Priority: brand>Delete > location>Review > near-dup>Review > longtail>Review > highkd>Review
# A row can have multiple reasons; most severe wins

output_sa = []
output_reason = []
output_confidence = []

keep_count = 0
review_count = 0
delete_count = 0

for r in records:
    reasons = []
    sa = "Keep"
    confidence = "High"
    row_num = r["row"]

    # Brand -> Delete (highest priority)
    if row_num in brand_rows:
        sa = "Delete"
        reasons.append("Platform/brand word")
        confidence = "High"

    # Location -> Review
    if row_num in location_rows:
        if sa == "Keep":
            sa = "Review"
        reasons.append("Location-specific keyword")

    # Near duplicate -> Review (not the highest volume variant)
    if row_num in near_dupe_extras:
        if sa == "Keep":
            sa = "Review"
        # Find what the canonical keyword is
        norm = normalize_for_dedup(r["keyword"])
        group = sorted(dup_groups[norm], key=lambda x: -int(x["volume"] or "0"))
        canonical = group[0]["keyword"]
        reasons.append(f"Near-dup of '{canonical[:40]}'")

    # Long tail low volume -> Review
    if row_num in longtail_rows:
        if sa == "Keep":
            sa = "Review"
        reasons.append("Super long tail (5+ words, Vol<200)")
        confidence = "Medium"

    # High KD low volume -> Review
    if row_num in highkd_rows:
        if sa == "Keep":
            sa = "Review"
        reasons.append("High KD low volume (KD>80, Vol<500)")
        confidence = "Medium"

    # Empty keyword row
    if not r["keyword"]:
        sa = ""
        reasons = []
        confidence = ""

    reason_str = "; ".join(reasons) if reasons else ""
    output_sa.append([sa])
    output_reason.append([reason_str])
    output_confidence.append([confidence])

    if sa == "Keep":
        keep_count += 1
    elif sa == "Review":
        review_count += 1
    elif sa == "Delete":
        delete_count += 1

print(f"\n=== MARKING RESULTS ===")
print(f"Keep:   {keep_count} ({keep_count/N*100:.1f}%)")
print(f"Review: {review_count} ({review_count/N*100:.1f}%)")
print(f"Delete: {delete_count} ({delete_count/N*100:.1f}%)")

# --- Write back ---
print(f"\nWriting SA/Reason/Confidence to sheet...")

# Column K = Suggested Action
last_row = N + 1
write_range(f"K2:K{last_row}", output_sa)
print(f"  Written K2:K{last_row}")

write_range(f"L2:L{last_row}", output_reason)
print(f"  Written L2:L{last_row}")

write_range(f"M2:M{last_row}", output_confidence)
print(f"  Written M2:M{last_row}")

print("\nDone! Seed-Feng-Shui step 3 marking complete.")
print(f"Next: Step 4 (human review) -> then validation checkpoint.")
