#!/usr/bin/env python3
"""Fill empty Entity rows in Seed-Crystals using regex rules."""
import sys, io, json, os, subprocess, urllib.parse, re, tempfile

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
CRED_FILE = os.path.expanduser(
    "~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json"
)
PROXY = "http://127.0.0.1:10808"
SHEET = "Seed-Crystals"


def get_token():
    with open(CRED_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]


def sheets_get(rng):
    token = get_token()
    enc = urllib.parse.quote(SHEET) + "!" + urllib.parse.quote(rng)
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}"
    )
    r = subprocess.run(
        ["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {token}"],
        capture_output=True,
        timeout=30,
    )
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}


def sheets_write(rng, values):
    token = get_token()
    enc = urllib.parse.quote(SHEET) + "!" + urllib.parse.quote(rng)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}?valueInputOption=USER_ENTERED"
    body = json.dumps(
        {"range": f"{SHEET}!{rng}", "values": values}, ensure_ascii=False
    )
    tmp = tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False, encoding="utf-8"
    )
    tmp.write(body)
    tmp.close()
    r = subprocess.run(
        [
            "curl",
            "-s",
            "--proxy",
            PROXY,
            "-X",
            "PUT",
            url,
            "-H",
            f"Authorization: Bearer {token}",
            "-H",
            "Content-Type: application/json",
            "-d",
            f"@{tmp.name}",
        ],
        capture_output=True,
        timeout=60,
    )
    os.unlink(tmp.name)
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}


def crystal_entity(kw):
    text = kw.lower()
    rules = [
        (r"amethyst", "Amethyst"),
        (r"rose quartz", "Rose Quartz"),
        (r"citrine", "Citrine"),
        (r"selenite", "Selenite"),
        (r"carnelian", "Carnelian"),
        (r"black tourmaline", "Black Tourmaline"),
        (r"tourmaline", "Tourmaline"),
        (r"obsidian", "Obsidian"),
        (r"\bjade\b", "Jade"),
        (r"lapis lazuli", "Lapis Lazuli"),
        (r"malachite", "Malachite"),
        (r"labradorite", "Labradorite"),
        (r"moonstone", "Moonstone"),
        (r"bloodstone", "Bloodstone"),
        (r"tiger.?eye", "Tiger Eye"),
        (r"agate", "Agate"),
        (r"fluorite", "Fluorite"),
        (r"garnet", "Garnet"),
        (r"hematite", "Hematite"),
        (r"howlite", "Howlite"),
        (r"jasper", "Jasper"),
        (r"peridot", "Peridot"),
        (r"sodalite", "Sodalite"),
        (r"sunstone", "Sunstone"),
        (r"apatite", "Apatite"),
        (r"calcite", "Calcite"),
        (r"pyrite", "Pyrite"),
        (r"quartz", "Quartz"),
        (r"aquamarine", "Aquamarine"),
        (r"opal", "Opal"),
        (r"moldavite", "Moldavite"),
        (r"larimar", "Larimar"),
        (r"lepidolite", "Lepidolite"),
        (r"kyanite", "Kyanite"),
        (r"rhodonite", "Rhodonite"),
        (r"unakite", "Unakite"),
        (r"chrysocolla", "Chrysocolla"),
        (r"celestite", "Celestite"),
        (r"angelite", "Angelite"),
        (r"azurite", "Azurite"),
        (r"chalcedony", "Chalcedony"),
        (r"morganite", "Morganite"),
        (r"tanzanite", "Tanzanite"),
        (r"topaz", "Topaz"),
        (r"spinel", "Spinel"),
        (r"dumortierite", "Dumortierite"),
        (r"herkimer", "Herkimer Diamond"),
        (r"shiva lingam", "Shiva Lingam"),
        # Concepts
        (r"bracelet|necklace|ring|jewelry|earring|pendant|bead", "Crystal Jewelry"),
        (r"near me|shop|store|buy|for sale", "Crystal Shopping"),
        (r"cleans|clean|charg|purif", "Crystal Care"),
        (r"meaning|properties|benefit|healing|use", "Crystal Meanings"),
        (r"chakra", "Chakra Crystals"),
        (r"birthstone|zodiac|sign", "Birthstone Crystals"),
        (r"type|list|name|kind|category|chart|guide|identifier", "Crystal Types"),
        (
            r"cluster|geode|point|tower|sphere|wand|tumble|raw|polished",
            "Crystal Forms",
        ),
        (r"gift|present|beginner|starter", "Crystal Gifts"),
        (r"display|decor|home|feng shui|room", "Crystal Decor"),
        (r"grid|layout", "Crystal Grids"),
        (r"meditat|sleep|dream|manifest|intention", "Crystal Practices"),
    ]
    for pattern, entity in rules:
        if re.search(pattern, text):
            return entity
    return "Crystals"


def main():
    # Read
    data = sheets_get("A1:J")
    rows = data.get("values", [])
    header = rows[0]
    kw_idx = header.index("Keyword")
    entity_idx = header.index("Entity")
    print(f"Read {len(rows)-1} data rows")

    # Build entity column for empty rows only
    entity_col = []
    filled = 0
    for row in rows[1:]:
        padded = row + [""] * (max(len(header), 10) - len(row))
        kw = padded[kw_idx].strip()
        existing = padded[entity_idx].strip()
        if kw and not existing:
            entity_col.append([crystal_entity(kw)])
            filled += 1
        else:
            entity_col.append([existing])

    print(f"Filling {filled} empty Entity rows")

    # Write in batches of 500
    BATCH = 500
    for start in range(0, len(entity_col), BATCH):
        end = min(start + BATCH, len(entity_col))
        rng = f"C{start+2}:C{end+1}"
        result = sheets_write(rng, entity_col[start:end])
        print(f"  Rows {start+2}-{end+1}: {result.get('updatedCells', 'error')}")

    # Verify
    vdata = sheets_get("C1:C")
    vents = [r[0].strip() for r in vdata.get("values", [])[1:] if r and r[0].strip()]
    print(f"\nDone. Non-empty Entity: {len(vents)}/{len(entity_col)}")


if __name__ == "__main__":
    main()
