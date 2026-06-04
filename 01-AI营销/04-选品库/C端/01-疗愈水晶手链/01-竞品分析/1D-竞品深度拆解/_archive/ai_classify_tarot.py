#!/usr/bin/env python3
"""AI batch classification for Seed-Tarot Subtopic + Entity.

Pilot test for the new workflow:
1. AI defines categories based on data analysis
2. AI batch classifies all keywords → Subtopic + Entity
3. Regex correction for known patterns
4. Write back to sheet
"""
import json, os, re, subprocess, tempfile, time, urllib.parse
from collections import Counter

SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
SHEET_NAME = "Seed-Tarot"
CREDENTIALS_FILE = os.path.expanduser("~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json")
CLAUDE_SETTINGS_FILE = os.path.expanduser("~/.claude/settings.json")
PROXY = "http://127.0.0.1:10808"
BATCH_SIZE = 50

# ── Google Sheets API ────────────────────────────────────────────────────────

def get_token():
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]

def sheets_get(range_a1):
    t = get_token()
    enc = urllib.parse.quote(f"{SHEET_NAME}!{range_a1}")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}"
    r = subprocess.run(["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {t}"], capture_output=True, timeout=30)
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}

def sheets_write(range_a1, values):
    t = get_token()
    enc = urllib.parse.quote(f"{SHEET_NAME}!{range_a1}")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{enc}?valueInputOption=USER_ENTERED"
    body = {"range": f"{SHEET_NAME}!{range_a1}", "values": values}
    body_str = json.dumps(body, ensure_ascii=False)
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(body_str)
    tmp.close()
    cmd = ["curl", "-s", "--proxy", PROXY, "-X", "PUT", url, "-H", f"Authorization: Bearer {t}", "-H", "Content-Type: application/json", "-d", f"@{tmp.name}"]
    r = subprocess.run(cmd, capture_output=True, timeout=60)
    os.unlink(tmp.name)
    return json.loads(r.stdout.decode("utf-8")) if r.stdout else {}

# ── LLM API ──────────────────────────────────────────────────────────────────

def _get_llm_config():
    with open(CLAUDE_SETTINGS_FILE, "r", encoding="utf-8") as f:
        settings = json.load(f)
    env = settings.get("env", {})
    return {
        "api_key": env.get("ANTHROPIC_AUTH_TOKEN", ""),
        "base_url": env.get("ANTHROPIC_BASE_URL", "https://open.bigmodel.cn/api/anthropic").rstrip("/"),
        "model": env.get("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-5.1"),
    }

def llm_call(system_prompt, user_msg):
    config = _get_llm_config()
    body = {
        "model": config["model"],
        "max_tokens": 4096,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_msg}],
    }
    body_str = json.dumps(body, ensure_ascii=False)
    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8")
    tmp.write(body_str)
    tmp.close()
    cmd = ["curl", "-s", "--proxy", PROXY, f"{config['base_url']}/v1/messages",
           "-H", f"x-api-key: {config['api_key']}",
           "-H", "anthropic-version: 2023-06-01",
           "-H", "Content-Type: application/json",
           "-d", f"@{tmp.name}"]
    r = subprocess.run(cmd, capture_output=True, timeout=60)
    os.unlink(tmp.name)
    resp = json.loads(r.stdout.decode("utf-8")) if r.stdout else {}
    # Extract text from response
    content = resp.get("content", [])
    for block in content:
        if block.get("type") == "text":
            return block["text"]
    return ""

# ── Step 1: AI defines categories ────────────────────────────────────────────

CATEGORIES_PROMPT = """你是 SEO 关键词分类专家。我有一批 Tarot（塔罗牌）主题的关键词需要分类。

请分析这些关键词，定义 8-12 个 Subtopic 类别。每个类别必须：
1. 覆盖一组语义相近的关键词
2. 附 3-5 个典型样本关键词
3. 类别名用英文，简洁清晰

同时为每个 Subtopic 定义对应的 Entity 细粒度范围（Entity 是 Subtopic 内更具体的实体）。

输出格式（严格 JSON）：
{
  "categories": [
    {
      "subtopic": "类别名",
      "description": "简短描述",
      "sample_keywords": ["keyword1", "keyword2", "keyword3"],
      "entity_examples": ["Entity1", "Entity2"]
    }
  ]
}"""

def step1_define_categories(keywords_sample):
    print("=== Step 1: AI defines categories ===")
    user_msg = f"以下是 Tarot 关键词样本（前150条按 Volume 排序）：\n{json.dumps(keywords_sample[:150], ensure_ascii=False)}"
    result = llm_call(CATEGORIES_PROMPT, user_msg)
    print(result)
    # Parse JSON from result
    try:
        # Find JSON in response
        start = result.index("{")
        end = result.rindex("}") + 1
        parsed = json.loads(result[start:end])
        cats = parsed.get("categories", [])
        print(f"\n  Defined {len(cats)} categories:")
        for c in cats:
            print(f"    {c['subtopic']}: {', '.join(c['sample_keywords'][:3])}")
        return cats
    except (ValueError, json.JSONDecodeError) as e:
        print(f"  Failed to parse: {e}")
        return []

# ── Step 2: AI batch classify ────────────────────────────────────────────────

CLASSIFY_PROMPT_TEMPLATE = """你是 SEO 关键词分类专家。将以下 Tarot 关键词分类到 Subtopic 和 Entity。

类别列表：
{categories_text}

规则：
1. 每个关键词必须归入上面列出的某个 Subtopic
2. Entity 是更细粒度的实体（如特定塔罗牌名、概念名）
3. 如果关键词太泛无法确定具体实体，Entity 填 "Tarot"
4. Subtopic 必须是列表中已有的类别名，不得自创

严格按 JSON 数组格式返回，不要有任何其他文字：
[{{"keyword": "...", "subtopic": "...", "entity": "..."}}]"""

def step2_classify_batch(keywords, categories):
    categories_text = "\n".join(
        f"- **{c['subtopic']}**: {c['description']} (如 {', '.join(c['sample_keywords'][:3])})"
        for c in categories
    )
    prompt = CLASSIFY_PROMPT_TEMPLATE.format(categories_text=categories_text)
    user_msg = f"分类以下 {len(keywords)} 个关键词：\n{json.dumps(keywords, ensure_ascii=False)}"
    result = llm_call(prompt, user_msg)

    try:
        start = result.index("[")
        end = result.rindex("]") + 1
        parsed = json.loads(result[start:end])
        return parsed
    except (ValueError, json.JSONDecodeError) as e:
        print(f"    Parse error: {e}")
        print(f"    Raw: {result[:200]}")
        return []

# ── Step 3: Regex correction ─────────────────────────────────────────────────

REGEX_CORRECTIONS_SUBTOPIC = [
    (r"chinese zodiac", "Chinese Tarot"),
]

REGEX_CORRECTIONS_ENTITY = [
    # Specific Major Arcana - must match before generic "Tarot"
    (r"\bfool\b", "The Fool"),
    (r"\bmagician\b", "The Magician"),
    (r"\bhigh priestess\b", "The High Priestess"),
    (r"\bempress\b", "The Empress"),
    (r"\bemperor\b", "The Emperor"),
    (r"\bhierophant\b", "The Hierophant"),
    (r"\blovers\b", "The Lovers"),
    (r"\bchariot\b", "The Chariot"),
    (r"\bstrength\b", "Strength"),
    (r"\bhermit\b", "The Hermit"),
    (r"\bwheel of fortune\b", "Wheel of Fortune"),
    (r"\bjustice\b", "Justice"),
    (r"\bhanged man\b", "The Hanged Man"),
    (r"\bdeath\b", "Death"),
    (r"\btemperance\b", "Temperance"),
    (r"\bdevil\b", "The Devil"),
    (r"\btower\b", "The Tower"),
    (r"\bstar\b", "The Star"),
    (r"\bmoon\b", "The Moon"),
    (r"\bsun\b", "The Sun"),
    (r"\bjudgement\b", "Judgement"),
    (r"\bworld\b", "The World"),
]

def regex_correct(kw, subtopic, entity):
    """Apply deterministic regex corrections."""
    text = kw.lower()
    # Entity corrections for specific cards
    for pattern, correct_entity in REGEX_CORRECTIONS_ENTITY:
        if re.search(pattern, text):
            entity = correct_entity
            break
    return subtopic, entity

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    # Read all keywords
    print("Reading keywords...")
    data = sheets_get("A2:A")
    rows = data.get("values", [])
    keywords = [row[0].strip() for row in rows if row and row[0].strip()]
    N = len(keywords)
    print(f"Total keywords: {N}\n")

    # Step 1: Define categories
    categories = step1_define_categories(keywords)
    if not categories:
        print("Failed to define categories, aborting.")
        return

    # Step 2: Batch classify
    print(f"\n=== Step 2: AI batch classifying {N} keywords ({BATCH_SIZE}/batch) ===")
    all_results = {}
    total_batches = (N + BATCH_SIZE - 1) // BATCH_SIZE
    errors = 0

    for batch_idx in range(total_batches):
        start = batch_idx * BATCH_SIZE
        end = min(start + BATCH_SIZE, N)
        batch_kws = keywords[start:end]

        print(f"  Batch {batch_idx+1}/{total_batches} ({start+1}-{end})...", end=" ", flush=True)
        results = step2_classify_batch(batch_kws, categories)

        if not results:
            print("FAILED")
            errors += 1
            if errors >= 3:
                print("  Too many errors, stopping.")
                break
            continue

        # Build keyword → result map
        for item in results:
            kw = item.get("keyword", "").strip()
            if kw:
                all_results[kw] = (item.get("subtopic", ""), item.get("entity", ""))

        matched = sum(1 for kw in batch_kws if kw in all_results)
        print(f"OK ({matched}/{len(batch_kws)} matched)")

        # Rate limit
        if batch_idx < total_batches - 1:
            time.sleep(1)

    print(f"\n  Total classified: {len(all_results)} keywords")
    print(f"  Coverage: {len(all_results)/N*100:.1f}%")

    # Step 3: Regex correction + build write columns
    print("\n=== Step 3: Regex correction + building columns ===")
    subtopic_col = []
    entity_col = []
    st_counter = Counter()
    ent_counter = Counter()
    unmatched = []

    for kw in keywords:
        if kw in all_results:
            st, ent = all_results[kw]
            st, ent = regex_correct(kw, st, ent)
        else:
            # Fallback: mark as unclassified
            st = "Tarot Basics"
            ent = "Tarot"
            unmatched.append(kw)
        subtopic_col.append([st])
        entity_col.append([ent])
        st_counter[st] += 1
        ent_counter[ent] += 1

    print(f"\n  Subtopic distribution:")
    for k, v in st_counter.most_common():
        pct = v / N * 100
        print(f"    {v:5d} ({pct:5.1f}%)  {k}")

    print(f"\n  Entity top 15:")
    for k, v in ent_counter.most_common(15):
        pct = v / N * 100
        print(f"    {v:5d} ({pct:5.1f}%)  {k}")

    if unmatched:
        print(f"\n  Unmatched keywords: {len(unmatched)}")
        print(f"    Samples: {unmatched[:5]}")

    # Step 4: Write back
    print(f"\n=== Step 4: Writing back to sheet ===")
    WRITE_BATCH = 500
    for start in range(0, N, WRITE_BATCH):
        end = min(start + WRITE_BATCH, N)
        # Subtopic → D
        sheets_write(f"D{start+2}:D{end+1}", subtopic_col[start:end])
        # Entity → C
        sheets_write(f"C{start+2}:C{end+1}", entity_col[start:end])
        print(f"  Written rows {start+2}-{end+1}")

    print("\n=== DONE ===")

if __name__ == "__main__":
    main()
