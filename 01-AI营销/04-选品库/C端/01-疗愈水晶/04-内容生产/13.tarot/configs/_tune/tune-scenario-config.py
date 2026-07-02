# -*- coding: utf-8 -*-
"""
scenario-knowledge.json 字段微调脚本 v2（behavior 第3项改手工映射表，质量优先）
3 项微调：
  1. behavior 单字符串 -> 数组 3 项
     - 前 2 项从现有 ' / ' 拆分
     - 第 3 项从 behavior-third.json 手工映射表读取（该牌该场景独有具体行为，动词短语）
  2. crystals 每场景 2 -> 3 颗
  3. crystals 与 tarot-knowledge.json 该牌 5 角色对齐（治本）
保留现有 14 字段不破坏。
"""
import json, os, re

BASE = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶"
SCENARIO_PATH = os.path.join(BASE, "04-内容生产/13.tarot/configs/scenario-knowledge.json")
TK_PATH = os.path.join(BASE, "07-互动工具/_shared/tarot-knowledge.json")
BEHAVIOR_THIRD_PATH = os.path.join(BASE, "04-内容生产/13.tarot/configs/_tune/behavior-third.json")

SCENARIO_POOL = {
    "love":      ["rose-quartz", "moonstone", "rhodonite"],
    "career":    ["citrine", "tiger-eye", "pyrite"],
    "finances":  ["aventurine", "pyrite", "jade"],
    "health":    ["bloodstone", "quartz", "smoky-quartz"],
    "spiritual": ["amethyst", "selenite", "labradorite"],
}
SCENARIO_ROLE_PRIORITY = {
    "love":      ["best_love", "best_daily_wear", "best_overall", "best_reversed", "best_upright"],
    "career":    ["best_upright", "best_overall", "best_daily_wear", "best_reversed", "best_love"],
    "finances":  ["best_upright", "best_overall", "best_daily_wear", "best_love", "best_reversed"],
    "health":    ["best_reversed", "best_daily_wear", "best_overall", "best_upright", "best_love"],
    "spiritual": ["best_overall", "best_upright", "best_daily_wear", "best_reversed", "best_love"],
}
ROLE_ORDER = ["best_overall", "best_upright", "best_reversed", "best_love", "best_daily_wear"]
SCENARIOS = ["love", "career", "finances", "health", "spiritual"]

# 23 个现有 behavior 为单短语（无 ' / '）的场景，补一个第2项具体行为短语
# 内容来自该场景 main_conflict / rider_waite_projection，与现有第1项 + 手工第3项均不同
SECOND_BEHAVIOR_PATCH = {
    "the-magician-health":     "treating your physiology as something you actively work with, not just endure",
    "the-emperor-health":      "holding the body upright with scaffolding rather than force",
    "the-hierophant-finances": "putting money into a tested, handed-down method instead of the new pitch",
    "strength-health":         "meeting pain or craving with steady presence instead of venting it",
    "strength-spiritual":      "courageously turning toward the wild mind without waging war on it",
    "the-hermit-health":       "giving the body real structured space to recover, away from the noise",
    "wheel-of-fortune-love":   "noticing the bond has turned a corner and adjusting your grip",
    "wheel-of-fortune-career": "recognizing the cycle is turning your way and pressing now",
    "wheel-of-fortune-health": "trusting a low-energy stretch as a season rather than a personal failure",
    "wheel-of-fortune-spiritual":"riding the turn instead of clinging to the shape it had",
    "the-hanged-man-love":     "choosing the in-between over a forced yes or no",
    "the-hanged-man-spiritual": "letting the old view release so a new one can arrive",
    "death-love":              "honoring the close instead of forcing the old form to stay",
    "death-health":            "clearing what no longer serves so the body can rebuild",
    "death-spiritual":         "allowing the old self to dissolve so the truer one can rise",
    "temperance-career":       "holding quality and speed in living tension instead of choosing",
    "temperance-finances":     "keeping the measured mix instead of swinging toward an extreme",
    "the-devil-spiritual":     "reclaiming the part of yourself you've disowned onto another",
    "the-star-health":         "pairing hope with the actual care the body is asking for",
    "judgment-finances":       "facing the number and running an honest review of it",
    "judgment-health":         "answering the wake-up with a real change in how you live",
    "the-world-health":        "keeping the aligned habits that built the integration",
    "the-world-spiritual":     "stepping through the threshold to the next cycle",
    "the-chariot-health":      "prepping for the race or rehab with disciplined daily execution",
}


def load_json(p):
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def get_card_crystal_slugs(tk_card):
    crystals = tk_card.get("crystals", {})
    role_slug = {}
    for role in ROLE_ORDER:
        if role in crystals and isinstance(crystals[role], dict):
            slug = crystals[role].get("slug")
            if slug:
                role_slug[role] = slug
    return role_slug


def pick_3_crystals(role_slug, scenario, existing):
    pool = list(dict.fromkeys(role_slug.values()))
    pool_set = set(pool)
    scen_pool = SCENARIO_POOL[scenario]
    conflict_existing = any(e not in pool_set and e not in set(scen_pool) for e in existing)

    priority_roles = SCENARIO_ROLE_PRIORITY[scenario]
    candidates = []
    for role in priority_roles:
        if role in role_slug:
            s = role_slug[role]
            if s not in candidates:
                candidates.append(s)
    for s in pool:
        if s not in candidates:
            candidates.append(s)

    final = []
    # 稳定保留 existing 中已在牌池的
    for e in existing:
        if e in pool_set and e not in final:
            final.append(e)
    for c in candidates:
        if len(final) >= 3:
            break
        if c not in final:
            final.append(c)
    if len(final) < 3:
        for s in scen_pool:
            if len(final) >= 3:
                break
            if s not in final:
                final.append(s)
    if len(final) < 3:
        for e in existing:
            if len(final) >= 3:
                break
            if e not in final:
                final.append(e)
    while len(final) < 3:
        final.append("quartz")
    return final[:3], conflict_existing


def split_behavior_2(behavior_str):
    """现有 behavior 单字符串 -> 前 2 项（去括号注释、去重）"""
    parts = [p.strip() for p in re.split(r"\s*/\s+", behavior_str) if p.strip()]
    cleaned = []
    for p in parts:
        p2 = re.sub(r"\s*\([^)]*\)\s*", " ", p).strip()
        p2 = re.sub(r"\s+", " ", p2)
        if p2:
            cleaned.append(p2)
    # 去重保序
    out = []
    for p in cleaned:
        if p not in out:
            out.append(p)
    return out[:2]


def main():
    scen_data = load_json(SCENARIO_PATH)
    tk_data = load_json(TK_PATH)
    behavior_third = load_json(BEHAVIOR_THIRD_PATH)

    tk_by_slug = {c["slug"]: c for c in tk_data["cards"]}

    stats = {
        "behavior_array_done": 0, "behavior_total": 0,
        "behavior_third_from_table": 0, "behavior_third_fallback": 0,
        "crystals_3_done": 0, "crystals_total": 0,
        "alignment_full": 0, "alignment_partial": 0,
        "conflicts_fixed": 0,
    }
    conflict_log = []
    sample = {"the-fool": {}, "the-tower": {}}
    behavior_quality_issues = []

    for card in scen_data["cards"]:
        cslug = card["card"]
        tk_card = tk_by_slug.get(cslug)
        if not tk_card:
            continue
        role_slug = get_card_crystal_slugs(tk_card)
        pool_set = set(role_slug.values())

        scenarios = card["scenarios"]
        for scenario in SCENARIOS:
            if scenario not in scenarios:
                continue
            sc = scenarios[scenario]
            stats["behavior_total"] += 1
            stats["crystals_total"] += 1

            # --- 1. behavior 数组化（前2项拆分 + 第3项查表）---
            old_behavior = sc.get("behavior", "")
            if isinstance(old_behavior, str):
                first_two = split_behavior_2(old_behavior)
                third = ""
                if cslug in behavior_third and scenario in behavior_third[cslug]:
                    third = behavior_third[cslug][scenario].strip()
                    stats["behavior_third_from_table"] += 1
                else:
                    stats["behavior_third_fallback"] += 1
                    behavior_quality_issues.append(f"MISSING behavior-third: {cslug}-{scenario}")

                arr = []
                for p in first_two:
                    if p and p not in arr and p != third:
                        arr.append(p)
                # 单短语场景：first_two 只得 1 项，用 patch 表补第 2 项
                if len(arr) < 2:
                    patch_key = f"{cslug}-{scenario}"
                    if patch_key in SECOND_BEHAVIOR_PATCH:
                        patched = SECOND_BEHAVIOR_PATCH[patch_key]
                        if patched and patched not in arr and patched != third:
                            arr.append(patched)
                if third and third not in arr:
                    arr.append(third)
                # 兜底补到 3（不应触发；若触发说明 patch 也缺，记录问题）
                while len(arr) < 3:
                    filler = f"acting on the {cslug} cue in this {scenario} moment"
                    if filler not in arr:
                        arr.append(filler)
                    else:
                        break
                sc["behavior"] = arr[:3]
                stats["behavior_array_done"] += 1

                # 质量校验：任何项不该是占位符（精确匹配占位符模板，避免误报合法的 "recognizing the bond..."）
                for idx, t in enumerate(sc["behavior"]):
                    is_placeholder = (
                        re.match(r"^recognizing the [\w-]+ pattern in this", t)
                        or re.match(r"^acting on the [\w-]+ cue in this", t)
                    )
                    if is_placeholder:
                        behavior_quality_issues.append(f"PLACEHOLDER leaked: {cslug}-{scenario} item{idx+1} -> {t}")

            # --- 2 & 3. crystals 补第3颗 + 对齐牌池 ---
            existing = sc.get("crystals", [])
            if not isinstance(existing, list):
                existing = []
            existing = [s for s in existing if isinstance(s, str)]
            final3, conflict = pick_3_crystals(role_slug, scenario, existing)
            sc["crystals"] = final3
            stats["crystals_3_done"] += 1

            in_pool = sum(1 for s in final3 if s in pool_set)
            if in_pool == 3:
                stats["alignment_full"] += 1
            elif in_pool >= 1:
                stats["alignment_partial"] += 1
            if conflict:
                stats["conflicts_fixed"] += 1
                removed = [e for e in existing if e not in final3]
                conflict_log.append({
                    "card": cslug, "scenario": scenario,
                    "existing": existing, "final": final3,
                    "removed": removed, "card_pool": sorted(pool_set),
                })

            if cslug in sample:
                sample[cslug][scenario] = {
                    "behavior": sc["behavior"],
                    "crystals": sc["crystals"],
                    "card_5role_slugs": sorted(pool_set),
                }

    # 更新 _meta
    meta = scen_data.setdefault("_meta", {})
    meta["v3_field_tune"] = "2026-07-01 v3 behavior->3项数组(前2项拆分+第3项手工映射该牌该场景独有行为) + crystals->3颗并按该牌 tarot-knowledge 5角色对齐 (治本: 场景crystals ⊆ 牌5角色∪场景倾向池)"
    rules = meta.get("rules", [])
    rules = [r for r in rules if not r.startswith("behavior 必须是") and not r.startswith("crystals 每场景")]
    rules.insert(2, "behavior 每场景 3 项数组（前2项拆分现有+第3项该牌该场景独有具体行为，动词短语+情境）")
    rules.insert(3, "crystals 每场景 3 颗，小写 slug，优先从该牌 tarot-knowledge 5 角色选场景贴合的，不足从场景倾向池补")
    meta["rules"] = rules

    with open(SCENARIO_PATH, "w", encoding="utf-8") as f:
        json.dump(scen_data, f, ensure_ascii=False, indent=2)

    # 统计
    print("=== 微调统计 ===")
    print(f"behavior 数组化: {stats['behavior_array_done']}/{stats['behavior_total']}")
    print(f"  第3项来自手工表: {stats['behavior_third_from_table']}, fallback: {stats['behavior_third_fallback']}")
    print(f"crystals 3 颗:   {stats['crystals_3_done']}/{stats['crystals_total']}")
    full = stats['alignment_full']
    tot = stats['crystals_total']
    print(f"对齐率(3颗全在牌5角色池): {full}/{tot} = {full*100/tot:.1f}%")
    print(f"对齐率(部分在牌池):       {stats['alignment_partial']}/{tot}")
    print(f"冲突修正(existing含牌池外slug): {stats['conflicts_fixed']}")
    if behavior_quality_issues:
        print(f"\n!! behavior 质量问题 {len(behavior_quality_issues)} 处:")
        for q in behavior_quality_issues:
            print(f"  {q}")
    else:
        print("\nbehavior 质量校验: 无占位符泄漏")

    print("\n=== 抽样: the-fool 5 场景 ===")
    for s in SCENARIOS:
        if s in sample["the-fool"]:
            d = sample["the-fool"][s]
            print(f"\n[{s}] crystals={d['crystals']}  (牌5角色={d['card_5role_slugs']})")
            for i, b in enumerate(d["behavior"], 1):
                print(f"  behavior{i}: {b}")
    print("\n=== 抽样: the-tower 5 场景 ===")
    for s in SCENARIOS:
        if s in sample["the-tower"]:
            d = sample["the-tower"][s]
            print(f"\n[{s}] crystals={d['crystals']}  (牌5角色={d['card_5role_slugs']})")
            for i, b in enumerate(d["behavior"], 1):
                print(f"  behavior{i}: {b}")
    print(f"\n=== 冲突修正记录(共{len(conflict_log)}) ===")
    for c in conflict_log:
        print(f"{c['card']}-{c['scenario']}: {c['existing']} -> {c['final']} (removed={c['removed']})")


if __name__ == "__main__":
    main()
