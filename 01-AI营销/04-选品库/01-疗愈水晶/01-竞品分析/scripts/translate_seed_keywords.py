"""
SEMrush-Seed-Keywords 批量翻译脚本 v2
- 读取所有 Seed-* 工作表的空中文列
- 跨表去重压缩：相同关键词只翻译一次，翻译完回填到所有出现位置
- LLM 批量翻译（每批 50 个关键词）
- 整列回写 Google Sheets（每表一次 API 调用）
"""

import json
import os
import time
import subprocess
import urllib.parse
import sys

# ─── 配置 ───────────────────────────────────────────────
SPREADSHEET_ID = "1HhKDz7_LlY1V1_wMSCLn4-8ASoI64u6MuW7iOkKAFDc"
CREDENTIALS_FILE = os.path.expanduser(
    "~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json"
)
CLAUDE_SETTINGS_FILE = os.path.expanduser("~/.claude/settings.json")
PROXY = "http://127.0.0.1:10808"

SHEETS = [
    "Seed-Palmistry",       # 先跑最小的表做验证
    "Seed-Feng-Shui",
    "Seed-Numerology",
    "Seed-Angel-Numbers",
    "Seed-Spirituality",
    "Seed-Meditation",
    "Seed-Moon-Phases",
    "Seed-Chakra",
    "Seed-Astrology",
    "Seed-Zodiac",
    "Seed-Tarot",
    "Seed-Dreams",
]

BATCH_SIZE = 50            # 每次翻译的关键词数
PROGRESS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "translate_progress.json")


# ─── Google Sheets 读写 ──────────────────────────────────

def get_token():
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["token"]


def _curl(url, token, method="GET", body=None, timeout=120):
    import tempfile
    cmd = ["curl", "-s", "--proxy", PROXY, url, "-H", f"Authorization: Bearer {token}"]
    tmp_file = None
    if body is not None:
        # 写入临时文件避免 Windows 命令行长度限制 (WinError 206)
        body_str = json.dumps(body, ensure_ascii=False)
        tmp_file = tempfile.NamedTemporaryFile(
            mode="w", suffix=".json", delete=False, encoding="utf-8"
        )
        tmp_file.write(body_str)
        tmp_file.close()
        cmd += [
            "-H", "Content-Type: application/json",
            "-X", "PUT",
            "-d", f"@{tmp_file.name}",
        ]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=timeout)
        return json.loads(r.stdout.decode("utf-8"))
    finally:
        if tmp_file:
            os.unlink(tmp_file.name)


def read_sheet(sheet_name, token):
    """读取 A:B 两列，返回 [(keyword, chinese), ...]，跳过表头"""
    enc = urllib.parse.quote(sheet_name)
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc}!A1:B"
    )
    data = _curl(url, token)
    rows = data.get("values", [])
    result = []
    for i, row in enumerate(rows):
        if i == 0:
            continue  # 跳表头
        kw = row[0].strip() if len(row) > 0 and row[0].strip() else ""
        cn = row[1].strip() if len(row) > 1 and row[1].strip() else ""
        result.append((kw, cn))
    return result


def write_b_column(sheet_name, values_2d, token):
    """
    整列回写 B 列。
    values_2d: [["中文1"], ["中文2"], ...]  长度 = 数据行数（不含表头）
    """
    enc = urllib.parse.quote(sheet_name)
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}"
        f"/values/{enc}!B2:B?valueInputOption=USER_ENTERED"
    )
    # Google Sheets values.update 需要完整的 ValueRange 对象
    body = {"values": values_2d}
    return _curl(url, token, method="PUT", body=body)


# ─── LLM 翻译 ──────────────────────────────────────────

SYSTEM_PROMPT = """你是关键词翻译专家。将英文 SEO 关键词翻译为中文。

规则：
1. 字面翻译，逐词对应，用空格分隔
2. 不要添加解释、建议、或重复英文原词
3. 示例：
   - "chakra healing stones" -> "脉轮 疗愈 石"
   - "tarot cards" -> "塔罗 牌"
   - "pisces dates" -> "双鱼座 日期"
   - "dream interpretation" -> "梦境 解读"
   - "angel numbers meanings" -> "天使 数字 含义"
   - "feng shui" -> "风水"
   - "horoscope" -> "星座运势"
   - "meditation techniques" -> "冥想 技巧"
   - "full moon ritual" -> "满月 仪式"
   - "palm reading" -> "手相 阅读"
   - "life path number" -> "生命 灵数"
   - "crystal bracelet" -> "水晶 手链"

请严格按 JSON 数组格式返回翻译结果，不要有任何其他文字：
["翻译1", "翻译2", ...]"""


def _get_llm_config():
    """从 Claude Code settings.json 读取智谱 API 配置"""
    with open(CLAUDE_SETTINGS_FILE, "r", encoding="utf-8") as f:
        settings = json.load(f)
    env = settings.get("env", {})
    return {
        "api_key": env.get("ANTHROPIC_AUTH_TOKEN", ""),
        "base_url": env.get("ANTHROPIC_BASE_URL", "https://open.bigmodel.cn/api/anthropic"),
        "model": env.get("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-5.1"),
    }


def translate_batch(keywords, llm_config):
    """用智谱 API（Anthropic 兼容格式）批量翻译一批关键词"""
    api_key = llm_config["api_key"]
    base_url = llm_config["base_url"].rstrip("/")
    model = llm_config["model"]

    user_msg = f"翻译以下 {len(keywords)} 个关键词：\n{json.dumps(keywords, ensure_ascii=False)}"

    body = {
        "model": model,
        "max_tokens": 4096,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_msg}],
    }

    cmd = [
        "curl", "-s", "--proxy", PROXY,
        f"{base_url}/v1/messages",
        "-H", f"x-api-key: {api_key}",
        "-H", "anthropic-version: 2023-06-01",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(body, ensure_ascii=False),
    ]
    r = subprocess.run(cmd, capture_output=True, timeout=120)
    resp = json.loads(r.stdout.decode("utf-8"))

    if "error" in resp:
        print(f"\n  [API ERROR] {resp['error'].get('message', resp)}")
        return None

    try:
        text = resp["content"][0]["text"]
        # 提取 JSON 数组
        start = text.index("[")
        end = text.rindex("]") + 1
        translations = json.loads(text[start:end])
        if len(translations) == len(keywords):
            return translations
        print(f"\n  [WARN] 数量不匹配: 期望{len(keywords)}, 得到{len(translations)}")
        return None
    except (KeyError, IndexError, json.JSONDecodeError, ValueError) as e:
        print(f"\n  [ERROR] 解析失败: {e}")
        raw = resp.get("content", [{}])[0].get("text", "")[:300]
        print(f"  原始响应: {raw}")
        return None


# ─── 进度文件 ────────────────────────────────────────────

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"translations": {}, "written_sheets": []}


def save_progress(progress):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)


# ─── 主流程 ─────────────────────────────────────────────

def main():
    print("=" * 60)
    print("SEMrush-Seed-Keywords 批量翻译脚本 v2")
    print("API: 智谱 (从 Claude Code settings.json 读取)")
    print("=" * 60)

    # 读取智谱 API 配置
    llm_config = _get_llm_config()
    print(f"  模型: {llm_config['model']}")
    print(f"  端点: {llm_config['base_url']}/v1/messages")

    token = get_token()
    progress = load_progress()
    translations = progress["translations"]
    written_sheets = progress.get("written_sheets", [])

    # ── 步骤 1 & 2：收集 + 去重 ──
    print("\n── 步骤 1/3: 收集空行关键词 & 跨表去重 ──")
    all_sheet_rows = {}   # {sheet: [(kw, cn), ...]}
    kw_to_locations = {}  # {kw_lower: [(sheet, index), ...]}
    total_empty = 0

    for name in SHEETS:
        rows = read_sheet(name, token)
        all_sheet_rows[name] = rows
        empty = 0
        for idx, (kw, cn) in enumerate(rows):
            if kw and not cn:
                empty += 1
                kw_lower = kw.lower()
                if kw_lower not in kw_to_locations:
                    kw_to_locations[kw_lower] = []
                kw_to_locations[kw_lower].append((name, idx))
        total_empty += empty
        print(f"  {name:25s} 空中文={empty:>7,}")

    unique_kws = [kw for kw in kw_to_locations if kw not in translations]
    print(f"\n  总空行: {total_empty:,}")
    print(f"  去重后唯一关键词: {len(kw_to_locations):,}")
    print(f"  已有翻译(进度恢复): {len(translations):,}")
    print(f"  本次需翻译: {len(unique_kws):,}")

    # ── 步骤 3：批量翻译 ──
    if unique_kws:
        print(f"\n── 步骤 2/3: LLM 批量翻译 ──")
        total_batches = (len(unique_kws) + BATCH_SIZE - 1) // BATCH_SIZE
        failed_batches = []

        for i in range(total_batches):
            start = i * BATCH_SIZE
            end = min(start + BATCH_SIZE, len(unique_kws))
            batch = unique_kws[start:end]

            print(f"  批次 {i+1}/{total_batches} ({len(batch)} 个)...", end="", flush=True)
            result = translate_batch(batch, llm_config)

            if result:
                for kw, cn in zip(batch, result):
                    translations[kw] = cn
                print(" OK")
            else:
                print(" FAILED")
                failed_batches.append(i)
                # 连续失败 3 次则暂停
                if len(failed_batches) >= 3 and all(
                    f - failed_batches[-3 + j] == j for j, f in enumerate(failed_batches[-3:])
                ):
                    print("\n  [WARN] 连续 3 次失败，保存进度后退出")
                    break

            # 每 20 批保存进度
            if (i + 1) % 20 == 0:
                save_progress({"translations": translations, "written_sheets": written_sheets})
                print(f"    [进度已保存: {len(translations)}/{len(kw_to_locations)}]")

            time.sleep(0.5)  # 避免 rate limit

        save_progress({"translations": translations, "written_sheets": written_sheets})
        print(f"\n  翻译完成: {len(translations)}/{len(kw_to_locations)} 唯一关键词")
    else:
        print("\n  所有唯一关键词已翻译完成（从进度恢复）")

    # ── 步骤 4：整列写回 Sheets ──
    print(f"\n── 步骤 3/3: 写回 Google Sheets ──")
    token = get_token()  # 刷新 token

    for name in SHEETS:
        if name in written_sheets:
            print(f"  {name:25s} 已写入（跳过）")
            continue

        # 重新从 Google API 读取，不依赖步骤 1 的缓存（避免 token 过期导致空数据）
        rows = read_sheet(name, token)
        if not rows:
            print(f"  {name:25s} [WARN] 读取为空，可能 token 过期，跳过")
            continue

        # 构建 B 列完整数据
        b_col = []
        filled = 0
        for kw, cn in rows:
            if cn:
                # 已有中文，保留
                b_col.append([cn])
            elif kw:
                # 空中文，查翻译
                cn_new = translations.get(kw.lower(), "")
                b_col.append([cn_new])
                if cn_new:
                    filled += 1
                else:
                    b_col[-1] = [""]  # 没翻译到的留空
            else:
                b_col.append([""])

        print(f"  {name:25s} 总行={len(rows)}, 新填={filled}")

        # 整列写入 B2:B（无论 filled 是否为 0，都写入以覆盖整个 B 列）
        result = write_b_column(name, b_col, token)
        if "error" in result:
            print(f"  {name:25s} [ERROR] {result['error']}")
        else:
            updated = result.get("updatedCells", "?")
            print(f"  {name:25s} 写入 OK (updatedCells={updated})")
            written_sheets.append(name)
            save_progress({"translations": translations, "written_sheets": written_sheets})

        time.sleep(1)  # 避免 rate limit

    print("\n" + "=" * 60)
    print("全部完成!")
    print("=" * 60)


if __name__ == "__main__":
    main()
