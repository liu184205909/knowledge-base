# -*- coding: utf-8 -*-
"""
pair-knowledge.json v2 字段补全脚本
补 3 字段: tension / depth_tier / structure_variants
依据: 模板-Tarot-配对文章框架.md §5.1(张力分级) + §3.1(结构变体)
保留现有 8 字段不破坏, 只追加新字段。
"""
import json, hashlib, os
from collections import defaultdict, Counter

CONFIG = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/pair-knowledge.json'

# ============================================================
# 1) BENCHMARK 集(41 对) — 框架 §5.1 明点名 + 经典高叙事弧, 每牌 2-6
# ============================================================
TIER1 = {  # 框架明点名(核心, 不可动)
  'the-fool-and-the-world','the-magician-and-the-high-priestess','the-empress-and-the-emperor',
  'the-tower-and-the-star','death-and-the-sun','the-fool-and-the-emperor','the-lovers-and-the-devil',
  'the-moon-and-the-sun','the-hermit-and-judgment','the-hanged-man-and-judgment','the-devil-and-the-tower',
  'the-fool-and-death','the-fool-and-the-tower','death-and-the-star','the-hermit-and-the-star',
}
TIER2 = {  # 强叙事弧/经典对立(每牌 2-3 目标)
  'the-fool-and-the-magician','the-fool-and-the-lovers','the-fool-and-judgment',
  'the-magician-and-the-devil','the-magician-and-death','the-magician-and-judgment',
  'the-high-priestess-and-the-emperor','the-high-priestess-and-the-devil','the-high-priestess-and-the-tower',
  'the-empress-and-death','the-empress-and-the-devil','the-empress-and-judgment',
  'the-emperor-and-death','the-emperor-and-the-tower','the-emperor-and-the-devil',
  'the-fool-and-the-hierophant','the-hierophant-and-the-lovers','the-hierophant-and-the-devil',
  'the-lovers-and-death','the-lovers-and-the-tower','the-lovers-and-judgment',
  'the-chariot-and-the-hermit','the-chariot-and-death','the-chariot-and-the-tower',
  'strength-and-the-devil','strength-and-death','strength-and-judgment',
  'the-hermit-and-the-devil','the-hermit-and-death',
  'the-magician-and-wheel-of-fortune','wheel-of-fortune-and-judgment','wheel-of-fortune-and-the-tower',
  'justice-and-the-tower','justice-and-the-hanged-man','justice-and-the-devil',
  'the-hanged-man-and-the-tower','the-hanged-man-and-death',
  'death-and-temperance','temperance-and-the-tower','temperance-and-judgment','temperance-and-the-devil',
  'the-tower-and-the-sun','the-tower-and-judgment','the-tower-and-the-moon',
  'the-star-and-judgment','judgment-and-the-world','death-and-judgment','death-and-the-world',
  'the-high-priestess-and-the-moon',
}

def build_benchmark(pairs_by_slug, all_cards):
    """复刻 build_benchmark 的两阶段贪心: 每牌>=2 再尽量到3, 枢纽牌封顶6"""
    strength_score = {'transformation':3,'causal':3,'tension':3,'complementary':2,'amplifying':1}
    def score(sl):
        pr = pairs_by_slug[sl]; s = strength_score[pr['relationship_type']]
        return s + (5 if sl in TIER1 else 0)

    final = set(TIER1)
    cc = defaultdict(int)
    for sl in final:
        pr=pairs_by_slug[sl]; cc[pr['card_a']['slug']]+=1; cc[pr['card_b']['slug']]+=1

    card2cand = defaultdict(list)
    for sl in (TIER2 - final):
        pr=pairs_by_slug[sl]
        card2cand[pr['card_a']['slug']].append(sl)
        card2cand[pr['card_b']['slug']].append(sl)
    remaining = set(TIER2 - final)

    def fill(target, cap_hub=6, cap_normal=3):
        for _ in range(8):
            progressed = False
            for c in sorted(all_cards):
                if cc[c] >= target: continue
                cands = [sl for sl in card2cand.get(c,[]) if sl in remaining]
                cands.sort(key=score, reverse=True)
                for sl in cands:
                    pr=pairs_by_slug[sl]; a,b=pr['card_a']['slug'],pr['card_b']['slug']
                    if cc[a] >= cap_hub or cc[b] >= cap_hub: continue
                    final.add(sl); remaining.discard(sl); cc[a]+=1; cc[b]+=1
                    progressed = True
                    break
            if not progressed: break

    fill(2, cap_hub=6, cap_normal=3)   # 每牌>=2
    fill(3, cap_hub=6, cap_normal=3)   # 尽量到3
    # 强制保底: 仍 <2 的牌, 无视 cap 强制提拔其最高分 TIER2 候选(保证每牌>=2)
    for c in sorted(all_cards):
        if cc[c] < 2:
            cands = [sl for sl in card2cand.get(c, []) if sl in remaining]
            cands.sort(key=score, reverse=True)
            for sl in cands:
                pr = pairs_by_slug[sl]; a, b = pr['card_a']['slug'], pr['card_b']['slug']
                final.add(sl); remaining.discard(sl); cc[a] += 1; cc[b] += 1
                break
    return final

# ============================================================
# 2) LITE 集(37 对) — 框架 §5.1: 同元素重叠高 / 无强叙事平行主题
# ============================================================
LITE_SET = {
  'the-star-and-the-sun','strength-and-the-sun','temperance-and-the-sun','the-emperor-and-the-sun',
  'justice-and-the-sun','death-and-the-moon','the-hanged-man-and-the-moon',
  'the-high-priestess-and-the-hanged-man','the-empress-and-the-hierophant','the-hierophant-and-the-hermit',
  'the-magician-and-justice','the-lovers-and-the-star','the-hermit-and-the-moon',
  'wheel-of-fortune-and-the-moon','the-devil-and-the-moon','the-high-priestess-and-the-star',
  'the-empress-and-the-star','the-empress-and-the-sun','the-empress-and-temperance',
  'the-lovers-and-the-sun','the-hierophant-and-the-sun','the-hierophant-and-temperance',
  'the-chariot-and-wheel-of-fortune','the-chariot-and-the-sun','the-chariot-and-strength',
  'strength-and-the-hanged-man','the-hermit-and-the-hanged-man','the-fool-and-the-sun',
  'temperance-and-the-star','justice-and-judgment','wheel-of-fortune-and-death',
  'the-high-priestess-and-the-hermit','the-high-priestess-and-temperance',
  'strength-and-temperance','strength-and-the-hermit','justice-and-temperance','the-hermit-and-temperance',
}

# ============================================================
# 3) STRUCTURE_VARIANTS 轮换 — 框架 §3.1 V1-V7, 子群内 max_share<=30%
# ============================================================
# 行=relationship_type, 列 V1..V7 权重(3=核心首选 2=次选 1=可用)
WEIGHTS = {
  'complementary':[3,3,2,1,2,3,1],  # V1对话 V2画面 V6阴阳和合
  'amplifying':   [2,3,1,1,3,1,1],  # V2画面 V5水晶协同(共振)
  'tension':      [3,3,1,3,1,1,1],  # V1对话 V2画面 V4Myth-Reality(拉扯)
  'causal':       [1,2,3,1,2,1,3],  # V3牌位语境 V7倒叙(因果链)
  'transformation':[2,3,1,3,2,3,1], # V2画面 V4Myth V6阴阳炼金(蜕变)
}
VARIANTS = ['V1','V2','V3','V4','V5','V6','V7']
def _vn(v): return int(v[1])
CORE = {rt:[v for v in VARIANTS if WEIGHTS[rt][_vn(v)-1]>=2] for rt in WEIGHTS}
STRONG = {rt:[v for v in VARIANTS if WEIGHTS[rt][_vn(v)-1]>=3] for rt in WEIGHTS}

def pick_variants(slug, rt, tier, idx_in_rt):
    w = WEIGHTS[rt]
    h = int(hashlib.md5(slug.encode()).hexdigest(), 16)
    n = {'benchmark':3, 'standard':2, 'lite':1}[tier]
    core = CORE[rt]
    first = core[idx_in_rt % len(core)]
    chosen = [first]
    if n == 1:
        return sorted(chosen)
    # 第2位: 首位非strong则补strong; 否则权重次高+hash
    if first not in STRONG[rt]:
        pool = [v for v in STRONG[rt] if v not in chosen]
    else:
        cand = [v for v in VARIANTS if v not in chosen]
        cand.sort(key=lambda v: (-w[_vn(v)-1], (h >> (_vn(v)*3)) % 7))
        pool = cand
    if pool:
        second = pool[(idx_in_rt // len(core)) % len(pool)]
        if second not in chosen: chosen.append(second)
    # 补足到 n(benchmark 第3位): 全局 idx+hash 轮换打散3元组
    while len(chosen) < n:
        cand = [v for v in VARIANTS if v not in chosen]
        cand.sort(key=lambda v: ((_vn(v) + idx_in_rt + (h % 3)) % 7))
        chosen.append(cand[0])
    return sorted(chosen)

# ============================================================
# 主流程
# ============================================================
def main():
    with open(CONFIG, encoding='utf-8') as f:
        d = json.load(f)
    pairs = d['pairs']
    by_slug = {pr['pair_slug']: pr for pr in pairs}
    all_cards = set()
    for pr in pairs:
        all_cards.add(pr['card_a']['slug']); all_cards.add(pr['card_b']['slug'])

    benchmark_set = build_benchmark(by_slug, all_cards)
    lite_set = set(LITE_SET) & set(by_slug)          # 只保留存在的 slug
    lite_set -= benchmark_set                         # benchmark 优先

    def tier_of(slug):
        if slug in benchmark_set: return 'benchmark'
        if slug in lite_set: return 'lite'
        return 'standard'

    # 组内 index(稳定排序)
    by_rt = defaultdict(list)
    for pr in pairs: by_rt[pr['relationship_type']].append(pr)
    idx_map = {}
    for rt, prs in by_rt.items():
        for idx, pr in enumerate(sorted(prs, key=lambda x: x['pair_slug'])):
            idx_map[pr['pair_slug']] = idx

    # 回填
    for pr in pairs:
        slug = pr['pair_slug']; rt = pr['relationship_type']; tier = tier_of(slug)
        tension_val = tier  # 'benchmark'/'standard'/'lite'
        depth = {'benchmark':'deep','standard':'standard','lite':'lite'}[tier]
        variants = pick_variants(slug, rt, tier, idx_map[slug])
        pr['tension'] = tension_val
        pr['depth_tier'] = depth
        pr['structure_variants'] = variants

    # 更新 _meta
    d['_meta']['v2_fields_added'] = {
        'tension': 'benchmark/standard/lite (§5.1 张力分级)',
        'depth_tier': 'deep/standard/lite (与 tension 1:1)',
        'structure_variants': 'V1-V7 子集 (§3.1, 子群内 max_share<=30%)',
        'distribution': {
            'benchmark': sum(1 for p in pairs if p['tension']=='benchmark'),
            'standard':  sum(1 for p in pairs if p['tension']=='standard'),
            'lite':      sum(1 for p in pairs if p['tension']=='lite'),
        },
    }

    # 写回(保留原缩进风格, ensure_ascii=False)
    with open(CONFIG, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=2)

    # 报告
    from collections import Counter
    tier_cnt = Counter(pr['tension'] for pr in pairs)
    print('=== 回填完成 ===')
    print(f'总对数: {len(pairs)}')
    print(f'tension 分布: benchmark={tier_cnt["benchmark"]} standard={tier_cnt["standard"]} lite={tier_cnt["lite"]}')

    # 每牌标杆数
    card_bm = Counter()
    for pr in pairs:
        if pr['tension']=='benchmark':
            card_bm[pr['card_a']['slug']]+=1; card_bm[pr['card_b']['slug']]+=1
    print('\n每牌 benchmark 对数:')
    for c in sorted(all_cards):
        print(f'  {c:20s}: {card_bm[c]}')

    # 子群 max_share
    combo_by_rt = defaultdict(Counter)
    for pr in pairs:
        combo_by_rt[pr['relationship_type']][tuple(pr['structure_variants'])] += 1
    print('\n各子群 structure_variants max_share:')
    for rt in ['complementary','amplifying','tension','causal','transformation']:
        cc = combo_by_rt[rt]; total=sum(cc.values())
        print(f'  {rt}: max_share={max(cc.values())/total:.0%}, unique_combos={len(cc)}')

    return pairs

if __name__ == '__main__':
    main()
