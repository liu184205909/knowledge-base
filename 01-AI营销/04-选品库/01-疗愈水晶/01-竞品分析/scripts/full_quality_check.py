#!/usr/bin/env python3
"""Full quality check for all Seed-* sheets: near-dup, location, Entity completeness."""
import sys, io, json, os, subprocess, urllib.parse, re, tempfile
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
CRED_FILE = os.path.expanduser(
    "~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json"
)
PROXY = "http://127.0.0.1:10808"

SHEETS = [
    "Seed-Crystals", "Seed-Chakra", "Seed-Tarot", "Seed-Astrology",
    "Seed-Zodiac", "Seed-Numerology", "Seed-Angel-Numbers", "Seed-Feng-Shui",
    "Seed-Meditation", "Seed-Moon-Phases", "Seed-Palmistry", "Seed-Spirituality",
]


def get_token():
    with open(CRED_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]


def refresh_token():
    with open(CRED_FILE, "r", encoding="utf-8") as f:
        cred = json.load(f)
    data = json.dumps({
        "client_id": cred["client_id"],
        "client_secret": cred["client_secret"],
        "refresh_token": cred["refresh_token"],
        "grant_type": "refresh_token",
    }).encode("utf-8")
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(data)
    tmp.close()
    r = subprocess.run(
        ["curl", "-s", "--proxy", PROXY, "https://oauth2.googleapis.com/token",
         "-X", "POST", "-H", "Content-Type: application/json", "-d", f"@{tmp.name}"],
        capture_output=True, timeout=30,
    )
    os.unlink(tmp.name)
    resp = json.loads(r.stdout.decode("utf-8")) if r.stdout else {}
    if "access_token" in resp:
        cred["token"] = resp["access_token"]
        with open(CRED_FILE, "w", encoding="utf-8") as f:
            json.dump(cred, f, indent=2)
        print("[Token refreshed]")
        return cred["token"]
    print(f"[Token refresh failed: {resp.get('error', 'unknown')}]")
    return cred["token"]


def sheets_get(rng, token=None):
    if token is None:
        token = get_token()
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{rng}"
    r = subprocess.run(
        ["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {token}"],
        capture_output=True, timeout=30,
    )
    text = r.stdout.decode("utf-8") if r.stdout else ""
    if not text or "error" in text[:50].lower():
        # Try refresh
        token = refresh_token()
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{rng}"
        r = subprocess.run(
            ["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {token}"],
            capture_output=True, timeout=30,
        )
        text = r.stdout.decode("utf-8") if r.stdout else ""
    return json.loads(text) if text else {}


def make_range(sheet, rng):
    return urllib.parse.quote(sheet) + "!" + urllib.parse.quote(rng)


def normalize(kw):
    t = kw.lower().strip()
    t = re.sub(r"[^a-z0-9: ]", "", t)
    t = re.sub(r"\b(the|a|an)\b", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return " ".join(sorted(t.split()))


def main():
    token = get_token()

    # ===== CHECK 2: Near-duplicate =====
    print("=" * 80)
    print("CHECK 2: Strict near-duplicate groups")
    print("=" * 80)

    for sheet in SHEETS:
        rng = make_range(sheet, "A2:A")
        data = sheets_get(rng, token)
        keywords = [r[0].strip() for r in data.get("values", []) if r and r[0].strip()]

        groups = defaultdict(list)
        for kw in keywords:
            key = normalize(kw)
            groups[key].append(kw)

        dups = {k: v for k, v in groups.items() if len(v) > 1}
        if dups:
            sorted_dups = sorted(dups.items(), key=lambda x: -len(x[1]))[:5]
            total_redundant = sum(len(v) - 1 for v in dups.values())
            print(f"\n{sheet}: {len(dups)} groups, {total_redundant} redundant rows")
            for key, kws in sorted_dups:
                print(f"  [{key}] -> {kws[:4]}")
        else:
            print(f"{sheet}: CLEAN")

    # ===== CHECK 3: Location keywords =====
    print("\n" + "=" * 80)
    print("CHECK 3: Location keywords (near me)")
    print("=" * 80)

    loc_re = re.compile(r"\bnear me\b", re.I)
    for sheet in SHEETS:
        rng = make_range(sheet, "A2:A")
        data = sheets_get(rng, token)
        keywords = [r[0].strip() for r in data.get("values", []) if r and r[0].strip()]
        loc = [kw for kw in keywords if loc_re.search(kw)]
        if loc:
            print(f"\n{sheet}: {len(loc)} found")
            for kw in loc[:5]:
                print(f"  {kw}")
        else:
            print(f"{sheet}: CLEAN")

    # ===== CHECK 1b: Crystals Entity post-fix =====
    print("\n" + "=" * 80)
    print("CHECK 1b: Seed-Crystals Entity distribution (post-fix)")
    print("=" * 80)
    rng = make_range("Seed-Crystals", "C2:C")
    data = sheets_get(rng, token)
    ents = [r[0].strip() for r in data.get("values", []) if r and r[0].strip()]
    cnt = Counter(ents)
    print(f"Total non-empty Entity: {len(ents)}")
    for e, c in cnt.most_common(10):
        print(f"  {c:5d} ({c/len(ents)*100:5.1f}%)  {e}")
    fallback = sum(v for k, v in cnt.items() if k in ("Crystals", "Crystal"))
    print(f"Fallback 'Crystals': {fallback} ({fallback/len(ents)*100:.1f}%)")


if __name__ == "__main__":
    main()
