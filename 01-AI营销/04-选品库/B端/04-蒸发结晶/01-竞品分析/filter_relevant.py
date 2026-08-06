#!/usr/bin/env python3
"""
选题库第三步：相关性过滤
只保留与蒸发结晶相关的文章，删除啤酒/食品/船舶/暖通等不相关行业
"""
import json, re, os
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# 核心相关性词（只要 slug 含任一 → 保留）
# ==========================================
CORE_KW = [
    # 核心设备
    'mvr', 'mee-evaporator', 'evaporator', 'evaporat', 'evaporation',
    'crystalliz', 'crystalli', 'crystal',
    'falling-film', 'rising-film', 'raising-film',
    'forced-circulation', 'single-effect', 'double-effect',
    'triple-effect', 'multi-effect', 'thin-film', 'wiped-film',
    'dtb-', 'oslo-',
    # 核心工艺
    'zld', 'zero-liquid', 'minimal-liquid-discharge',
    'concentrat', 'crystallisation', 'crystallization',
    'desalinat', 'salt-recovery', 'salt-production',
    'brine', 'salinity', 'high-salt', 'high-salinity',
    # 核心行业
    'lithium', 'lioh', 'li2co3', 'licl', 'lithium-carbonate', 'lithium-hydroxide',
    'black-mass', 'battery-recycl', 'battery-grade', 'battery-material',
    'hydrometallurg', 'electroplating',
    'fly-ash', 'leachate', 'landfill',
    'coal-chemical', 'coal-to',
    # 废水处理
    'wastewater', 'waste-water', 'effluent', 'sewage',
    'water-treatment', 'water-reuse', 'water-recovery',
    # 关键盐类
    'ammonium-sulfate', 'ammonium-nitrate', 'ammonium-chloride',
    'potassium-chloride', 'potassium-sulfate', 'potassium-nitrate',
    'sodium-chloride', 'sodium-sulfate', 'sodium-carbonate',
    'calcium-chloride', 'magnesium-chloride',
    'nickel-sulfate', 'zinc-sulfate', 'copper-sulfate',
    'iron-phosphate',
    'potash', 'sop-', 'glauber',
    'pmida',
    # 反渗透浓水
    'ro-reject', 'ro-brine', 'reverse-osmosis',
    # 干燥（喷雾干燥属于蒸发结晶下游）
    'spray-dry', 'spray-drying', 'fluidized-bed-dry',
    # 地理SEO（只要含蒸发器/结晶器就是相关的）
    'manufacturers-in', 'suppliers-in',
    '-evaporator-', '-crystallizer-', '-evaporator-', '-crystallizer-',
]

# ==========================================
# 不相关行业词（含任一 → 候选删除）
# ==========================================
IRRELEVANT_KW = [
    # 啤酒/葡萄酒/酒精
    'brewery', 'brewing', 'brew-', 'beer', 'craft-beer', 'wort', 'hops', 'malt',
    'wine', 'winery', 'winemaking', 'winery-', '-wine',
    'whisky', 'whiskey', 'spirit', 'alcohol', 'distillery',
    'non-alcoholic', 'de-alc', 'low-alcohol',
    # 乳制品
    'dairy', 'milk', 'cheese', 'whey', 'yogurt', 'cream',
    'lactose', 'colostrum',
    # 食品（非制糖/淀粉）
    'food-processing', 'food-ingredient', 'food-safety', 'food-producer',
    'ice-cream', 'icecream', 'gelato',
    'bakery', 'baking', 'bake-', 'flour', 'silo',
    'juice', 'beverage', 'coffee', 'tea',
    'chocolate', 'confectionery', 'candy',
    'sauce', 'dressing', 'ketchup',
    'baby-food', 'infant',
    'soft-gelatin', 'capsule', 'gelatin',
    # 油脂
    'palm-oil', 'edible-oil', 'vegetable-oil', 'cooking-oil',
    'oil-refinery', 'oil-refining', 'oil-mill',
    'olive-oil', 'sunflower-oil', 'soybean-oil',
    # 动物蛋白/渔业
    'animal-protein', 'animal-byproduct', 'krill', 'fish-oil', 'fish-farm',
    'collagen', 'peptide', 'gelatine',
    'meat', 'poultry', 'beef', 'pork', 'slaughter',
    # 船舶/海运
    'marine', 'ship', 'vessel', 'cargo', 'ferry', 'boat',
    'bilge', 'ballast', 'bunker', 'port-', 'shipyard',
    'oceanglide', 'purebilge',
    # 暖通/制冷
    'hvac', 'district-heating', 'district-cooling', 'air-condition',
    'refrigerat', 'ventilation', 'heating-system',
    'chiller', 'cooling-tower', 'comfort-cooling',
    # 数据中心
    'data-centre', 'data-center', 'datacenter',
    # 半导体/电子
    'semiconductor', 'pcb', 'etching', 'wafer',
    # 能源（非工艺相关）
    'nuclear', 'neutron', 'fission', 'fusion',
    'wind-turbine', 'solar-panel', 'photovoltaic',
    'fuel-cell', 'hydrogen',
    'battery-show', 'cibf', 'ie-expo', 'battery-expo',  # 展会类
    # 纺织/棉花
    'cotton', 'fabric', 'yarn', 'weaving', 'spinning',
    'leather', 'tannery', 'hide',
    # 建筑
    'concrete', 'cement', 'asphalt', 'roofing',
    # 交通
    'air-traffic', 'airport', 'aviation',
    'railway', 'train', 'subway', 'metro',
    'tunnel', 'bridge',
    # 其他不相关
    'paint', 'coating', 'ink', 'printing',
    'cosmetic', 'perfume', 'fragrance',
    'pharma-production', 'vaccine', 'biotech',  # 生物制药(非制药废水)
    'lubrication', 'grease',
    'firefighting', 'fire-protection',
    'agitation', 'agitator', 'mixer', 'mixing',  # 通用搅拌设备
    'canning', 'steriliz', 'pasteuriz',  # 食品杀菌
    'gas-treatment', 'flue-gas', 'exhaust',  # 尾气处理
    'soil', 'groundwater-remediation',  # 土壤修复
]

# 制糖/淀粉 borderline：与蒸发结晶相关，从不相关列表中排除
SUGAR_STARCH_KW = ['sugar', 'starch', 'glucose', 'sucrose', 'beet', 'cane-sugar', 'refining-sugar']

def is_relevant(slug):
    """判断 slug 是否与蒸发结晶相关"""
    s = slug.lower()

    # 1. 含核心关键词 → 直接保留
    for kw in CORE_KW:
        if kw in s:
            return True, "core"

    # 2. 制糖/淀粉/乙醇相关（蒸发结晶重要应用）→ 保留
    for kw in SUGAR_STARCH_KW:
        if kw in s:
            return True, "sugar_starch"
    if 'ethanol' in s or 'biofuel' in s or 'biodiesel' in s:
        return True, "biofuel"

    # 3. 含不相关行业词 → 删除
    for kw in IRRELEVANT_KW:
        if kw in s:
            return False, f"irrelevant:{kw}"

    # 4. 无法判断 → 保留（待人工审核）
    return True, "unclassified"

# ==========================================
# 主流程
# ==========================================

print("=" * 60)
print("选题库相关性过滤")
print("=" * 60)

# 读取精炼后的 JSON
json_path = os.path.join(SCRIPT_DIR, "选题库_refined.json")
with open(json_path, 'r', encoding='utf-8') as f:
    records = json.load(f)

print(f"读取 {len(records)} 条")

# 过滤
kept = []
deleted_reasons = Counter()
delete_samples = []

for r in records:
    keep, reason = is_relevant(r['slug'])
    if keep:
        r['filter_reason'] = reason
        kept.append(r)
    else:
        deleted_reasons[reason] += 1
        if len(delete_samples) < 30:
            delete_samples.append((r['slug'][:60], r['title_zh'][:30], reason))

print(f"\n删除: {len(records) - len(kept)} 条")
print(f"保留: {len(kept)} 条")

print(f"\n删除原因 TOP 15:")
for reason, count in deleted_reasons.most_common(15):
    print(f"  {reason}: {count}")

print(f"\n保留原因:")
keep_reasons = Counter(r['filter_reason'] for r in kept)
for reason, count in keep_reasons.most_common():
    print(f"  {reason}: {count}")

# 统计最终数据
type_dist = Counter(r['type'] for r in kept)
has_zh = sum(1 for r in kept if r['title_zh'])
has_industry = sum(1 for r in kept if r['industry'])

print(f"\n最终类型分布:")
for t, c in sorted(type_dist.items()):
    print(f"  {t}: {c} ({100*c//len(kept)}%)")

print(f"\n有中文主题: {has_zh} / {len(kept)} ({100*has_zh//len(kept)}%)")
print(f"有行业标注: {has_industry} / {len(kept)} ({100*has_industry//len(kept)}%)")

# 输出删除样本
print(f"\n删除样本（前 15 条）:")
for slug, zh, reason in delete_samples[:15]:
    print(f"  [{reason}] {slug}")

# 输出 JSON
out_json = os.path.join(SCRIPT_DIR, "选题库_final.json")
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(kept, f, ensure_ascii=False, indent=2)
print(f"\nJSON: {out_json}")

# 输出样本 MD
out_md = os.path.join(SCRIPT_DIR, "选题库_final_sample.md")
with open(out_md, 'w', encoding='utf-8') as f:
    f.write(f"# 选题库最终版（{len(kept)} 条）\n\n")
    f.write(f"## 过滤统计\n\n")
    f.write(f"- 输入: {len(records)} 条\n")
    f.write(f"- 删除不相关: {len(records) - len(kept)} 条\n")
    f.write(f"- 最终: {len(kept)} 条\n\n")
    f.write(f"## 类型分布\n\n")
    f.write(f"| 类型 | 数量 | 占比 |\n|------|------|------|\n")
    for t, c in sorted(type_dist.items()):
        f.write(f"| {t} | {c} | {100*c//len(kept)}% |\n")
    f.write(f"\n## 样本预览\n\n")

    for type_name in sorted(set(r['type'] for r in kept)):
        type_records = [r for r in kept if r['type'] == type_name]
        if not type_records:
            continue
        f.write(f"### {type_name}（{len(type_records)} 条）\n\n")
        f.write(f"| 中文主题 | 行业 | 英文标题 | slug |\n")
        f.write(f"|----------|------|----------|------|\n")
        for r in type_records[:30]:
            zh = r['title_zh'] or '(待标注)'
            ind = r['industry'] or '-'
            f.write(f"| {zh} | {ind} | {r['title_en'][:50]} | {r['slug'][:40]} |\n")
        f.write(f"\n")

print(f"MD样本: {out_md}")
print(f"\n{'=' * 60}")
