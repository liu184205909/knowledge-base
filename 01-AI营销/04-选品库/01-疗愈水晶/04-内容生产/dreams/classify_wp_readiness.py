"""把 1289 篇 dream draft 按 WP 发布就绪度分到 7 桶。

三层门禁策略（2026-07-09 用户裁定）：
  - reject_non_dream / parked_*  : 绝不进 WP（错线/品牌/导航/低置信/重复）
  - needs_*                       : 可救但需处理（slug 重写 / AI topic 重写）
  - wp_draft_ready                : 可进 WP draft（dream intent 明确 + 无噪音 + slug 正常）

只给 wp_draft_ready 生成 WordPress draft 包。
"""
import json
import re
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent
SRC = BASE / "articles" / "dream-articles-repaired-full-1289.jsonl"
OUT = BASE / "qa" / "dream-wp-draft-readiness.jsonl"

BUCKETS = [
    "reject_non_dream",
    "parked_cross_vertical",
    "parked_low_confidence",
    "parked_duplicate",
    "parked_slug_review",
    "needs_slug_rewrite",
    "needs_ai_topic_rewrite",
    "wp_draft_ready",
]

DREAM_TERMS = ("dream", "dreamed", "dreaming", "sleep paralysis")
SLUG_ARTIFACTS = (
    "ai", "online", "free", "define", "definition", "dreamscape", "dreamlookup", "dreamy-bot", "tattoo", "az",
    "and-meanings", "and-their", "meanings-for", "verse-big", "within-dream",
)
EDITORIALLY_REPAIRED_SLUGS = {
    "what-is-a-dreamscape",
    "how-to-interpret-a-dreamscape",
    "dreamscape-meaning",
    "dreamscape-vs-dream",
    "dreamscape-symbolism",
    "dreamer-tattoo-symbolism",
}


def has_dream_intent(kw):
    k = kw.lower()
    return any(t in k for t in DREAM_TERMS)


def slug_clean(slug):
    if re.search(r"-\d+$", slug):  # 数字后缀 = slug 碰撞
        return False
    if "dream" not in slug and "sleep-paralysis" not in slug:
        return False
    if slug in EDITORIALLY_REPAIRED_SLUGS:
        return True
    if slug.startswith("z-dream-"):
        return False
    tokens = set(slug.split("-"))
    if any(
        artifact in tokens
        or slug.startswith(f"{artifact}-")
        or slug.endswith(f"-{artifact}")
        or f"-{artifact}-" in slug
        for artifact in SLUG_ARTIFACTS
    ):
        return False
    return True


def classify(row):
    flags = set(row.get("original_noise_flag") or [])
    kw = (row.get("repaired_keyword") or row.get("original_keyword") or "").strip()
    slug = row.get("slug", "")
    dream = has_dream_intent(kw)
    klow = kw.lower()
    spiritual_edge = "cross_vertical" in flags and ("spiritual" in klow or "meaning" in klow)

    # 1) 无 dream 意图：spiritual 边界词留给 spiritual 线未来救，其余直接 reject
    if not dream:
        return "parked_cross_vertical" if spiritual_edge else "reject_non_dream"
    # 2) 有 dream 意图但 typo / 竞品品牌 / 宽导航词 → 绝不做单页
    if "typo" in flags or "brand_query" in flags or "generic_navigation" in flags:
        return "reject_non_dream"
    # 3) 跨垂直（dream intent 但偏离）→ parked 等救
    if "cross_vertical" in flags:
        return "parked_cross_vertical"
    # 4) 无流量验证 → parked 等 SEMrush 回填
    if "low_confidence" in flags:
        return "parked_low_confidence"
    # 5) slug 碰撞 → 需重写
    if "duplicate_slug" in flags:
        return "parked_duplicate"
    if not slug_clean(slug):
        return "parked_slug_review"
    # 6) 其余：dream intent 明确 + 无噪音 + slug 正常 → 可进 WP draft
    return "wp_draft_ready"


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    counts = Counter()
    with SRC.open(encoding="utf-8") as fin, OUT.open("w", encoding="utf-8", newline="\n") as fout:
        for line in fin:
            row = json.loads(line)
            bucket = classify(row)
            counts[bucket] += 1
            fout.write(json.dumps({
                "slug": row.get("slug"),
                "url": row.get("url"),
                "original_keyword": row.get("original_keyword"),
                "repaired_keyword": row.get("repaired_keyword"),
                "priority": row.get("priority"),
                "page_type": row.get("page_type"),
                "repair_status": row.get("repair_status"),
                "original_noise_flag": row.get("original_noise_flag"),
                "bucket": bucket,
            }, ensure_ascii=False) + "\n")

    total = sum(counts.values())
    wp = counts["wp_draft_ready"]
    print(json.dumps({
        "total": total,
        "buckets": {b: counts[b] for b in BUCKETS},
        "wp_draft_ready_pct": round(wp / total * 100, 1) if total else 0,
        "parked_or_reject": sum(counts[b] for b in BUCKETS if b.startswith(("parked_", "reject_"))),
        "out": str(OUT),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
