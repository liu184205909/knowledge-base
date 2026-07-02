# -*- coding: utf-8 -*-
"""独立质检：校验微调后的 scenario-knowledge.json"""
import json, os, re

BASE = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶"
SCENARIO_PATH = os.path.join(BASE, "04-内容生产/13.tarot/configs/scenario-knowledge.json")
TK_PATH = os.path.join(BASE, "07-互动工具/_shared/tarot-knowledge.json")

ROLE_ORDER = ["best_overall", "best_upright", "best_reversed", "best_love", "best_daily_wear"]
SCENARIOS = ["love", "career", "finances", "health", "spiritual"]

# 原 v2 14 字段（不含 behavior/crystals 这俩被改的）+ behavior/crystals
V2_FIELDS = ["metaphor", "behavior", "risk", "crystals", "tension", "depth_tier",
             "main_conflict", "upright_focus", "reversed_focus", "rider_waite_projection",
             "eastern_anchor", "faq_angles", "internal_links"]

# 合规词检查
HEALTH_FORBIDDEN = [r"\bdiagnose\b", r"\bdiagnosis\b(?!.{0,20}from)", r"\bprescribe\b",
                    r"\btreat\b(?!.{0,15}body|.{0,15}yourself|.{0,15}partner)",
                    r"\bcure\b", r"\bmedication\b", r"\bdoctor should\b"]
FINANCE_FORBIDDEN = [r"\bguaranteed return", r"\bwill earn", r"\bsure to gain",
                     r"\bcannot lose", r"\brisk-free", r"\binvest (?:now|in )\w+"]

def load(p):
    return json.load(open(p, encoding="utf-8"))

def main():
    scen = load(SCENARIO_PATH)
    tk = load(TK_PATH)
    tk_by = {c["slug"]: c for c in tk["cards"]}

    issues = []
    behavior_cnt = {"total": 0, "three": 0, "nonempty": 0, "unique_per_scenario": 0}
    crystals_cnt = {"total": 0, "three": 0, "lowercase": 0, "in_card_pool": 0, "in_card_or_scen_pool": 0}
    fields_ok = 0
    fields_missing = 0
    align_per_card = {}
    health_compliance_violations = []
    finance_compliance_violations = []

    SCENARIO_POOL = {
        "love": ["rose-quartz", "moonstone", "rhodonite"],
        "career": ["citrine", "tiger-eye", "pyrite"],
        "finances": ["aventurine", "pyrite", "jade"],
        "health": ["bloodstone", "quartz", "smoky-quartz"],
        "spiritual": ["amethyst", "selenite", "labradorite"],
    }

    for card in scen["cards"]:
        cslug = card["card"]
        tkc = tk_by.get(cslug)
        pool = set()
        if tkc:
            for r in ROLE_ORDER:
                cr = tkc.get("crystals", {}).get(r, {})
                if isinstance(cr, dict) and cr.get("slug"):
                    pool.add(cr["slug"])
        align_per_card[cslug] = {"total": 0, "aligned": 0}

        for s in SCENARIOS:
            sc = card["scenarios"].get(s)
            if not sc:
                issues.append(f"{cslug}-{s}: scenario missing")
                continue

            # 字段完整性（14 字段）
            for f in V2_FIELDS:
                if f in sc:
                    fields_ok += 1
                else:
                    fields_missing += 1
                    issues.append(f"{cslug}-{s}: field {f} missing")

            # behavior 校验
            b = sc.get("behavior")
            behavior_cnt["total"] += 1
            if isinstance(b, list) and len(b) == 3:
                behavior_cnt["three"] += 1
            else:
                issues.append(f"{cslug}-{s}: behavior not 3-item array: {b}")
                continue
            if all(isinstance(x, str) and x.strip() for x in b):
                behavior_cnt["nonempty"] += 1
            # 3 项互不相同
            if len(set(b)) == 3:
                behavior_cnt["unique_per_scenario"] += 1
            else:
                issues.append(f"{cslug}-{s}: behavior items not unique: {b}")
            # 该牌该场景独有（同牌 5 场景 behavior 不应完全相同——抽查集合）
            # placeholder 检查
            for x in b:
                if re.match(r"^(recognizing the [\w-]+ pattern|acting on the [\w-]+ cue)", x):
                    issues.append(f"{cslug}-{s}: placeholder in behavior: {x}")

            # crystals 校验
            cr = sc.get("crystals")
            crystals_cnt["total"] += 1
            if not (isinstance(cr, list) and len(cr) == 3):
                issues.append(f"{cslug}-{s}: crystals not 3: {cr}")
                continue
            if all(re.match(r"^[a-z][a-z0-9-]*$", c) for c in cr):
                crystals_cnt["lowercase"] += 1
            align_per_card[cslug]["total"] += 3
            sp = set(SCENARIO_POOL.get(s, []))
            in_pool = sum(1 for c in cr if c in pool)
            in_pool_or_scen = sum(1 for c in cr if c in pool or c in sp)
            if in_pool == 3:
                crystals_cnt["in_card_pool"] += 1
                align_per_card[cslug]["aligned"] += 3
            if in_pool_or_scen == 3:
                crystals_cnt["in_card_or_scen_pool"] += 1
            # 记录不在牌池的具体 slug
            not_in = [c for c in cr if c not in pool]
            if not_in:
                issues.append(f"{cslug}-{s}: crystals not in card 5-role pool: {not_in} (pool={sorted(pool)})")

            # 合规：Health / Finances behavior + risk + upright_focus
            if s == "health":
                text = " ".join(b + [sc.get("risk", ""), sc.get("upright_focus", ""), sc.get("reversed_focus", "")]).lower()
                for pat in HEALTH_FORBIDDEN:
                    if re.search(pat, text):
                        health_compliance_violations.append(f"{cslug}-{s}: matched '{pat}' in behavior/risk")
            if s == "finances":
                text = " ".join(b + [sc.get("risk", ""), sc.get("upright_focus", ""), sc.get("reversed_focus", "")]).lower()
                for pat in FINANCE_FORBIDDEN:
                    if re.search(pat, text):
                        finance_compliance_violations.append(f"{cslug}-{s}: matched '{pat}'")

    # 同牌 5 场景 behavior 雷同检查（任两项完全相同则警告）
    same_card_duplicate = []
    for card in scen["cards"]:
        bsets = {}
        for s in SCENARIOS:
            b = card["scenarios"].get(s, {}).get("behavior")
            if isinstance(b, list):
                key = tuple(b)
                bsets.setdefault(key, []).append(s)
        for key, ss in bsets.items():
            if len(ss) > 1:
                same_card_duplicate.append(f"{card['card']}: scenarios {ss} identical behavior")

    print("=== 独立质检结果 ===")
    print(f"字段完整性: {V2_FIELDS}字段 × 110场景 = {len(V2_FIELDS)*110} 期望, present={fields_ok}, missing={fields_missing}")
    print(f"behavior 3项数组:  {behavior_cnt['three']}/{behavior_cnt['total']}")
    print(f"behavior 非空:     {behavior_cnt['nonempty']}/{behavior_cnt['total']}")
    print(f"behavior 3项互异:  {behavior_cnt['unique_per_scenario']}/{behavior_cnt['total']}")
    print(f"crystals 3颗:      {crystals_cnt['three']}/{crystals_cnt['total']}")
    print(f"crystals 小写slug: {crystals_cnt['lowercase']}/{crystals_cnt['total']}")
    print(f"crystals 全在牌5角色池: {crystals_cnt['in_card_pool']}/{crystals_cnt['total']} = {crystals_cnt['in_card_pool']*100/crystals_cnt['total']:.1f}%")
    print(f"crystals 全在牌池∪场景池: {crystals_cnt['in_card_or_scen_pool']}/{crystals_cnt['total']}")
    print(f"Health 合规违规: {len(health_compliance_violations)}")
    for v in health_compliance_violations[:10]:
        print(f"  {v}")
    print(f"Finances 合规违规: {len(finance_compliance_violations)}")
    for v in finance_compliance_violations[:10]:
        print(f"  {v}")
    print(f"同牌5场景behavior完全雷同: {len(same_card_duplicate)}")
    for d in same_card_duplicate[:10]:
        print(f"  {d}")

    print(f"\n=== 对齐率分牌明细（每牌5场景=15颗，aligned=在牌5角色池里的）===")
    full_cards = []
    partial_cards = []
    for cslug, v in align_per_card.items():
        if v["total"] == 0:
            continue
        if v["aligned"] == v["total"]:
            full_cards.append(cslug)
        else:
            partial_cards.append(f"{cslug}: {v['aligned']}/{v['total']}")
    print(f"全对齐牌数(15/15): {len(full_cards)}/22")
    if partial_cards:
        print(f"部分对齐: {partial_cards}")

    print(f"\n=== 问题清单({len(issues)}) ===")
    for i in issues[:30]:
        print(f"  {i}")

    # 字节数
    sz = os.path.getsize(SCENARIO_PATH)
    sz_bak = os.path.getsize(SCENARIO_PATH + ".bak-pre-tune")
    print(f"\n文件字节: 原={sz_bak}, 微调后={sz}, 增量={sz-sz_bak} (+{(sz-sz_bak)*100/sz_bak:.1f}%)")

if __name__ == "__main__":
    main()
