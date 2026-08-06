#!/usr/bin/env python3
"""Classify SAMCO + Alaqua slugs into 8 article types."""
import re, json, os
from collections import defaultdict

TMP = os.environ.get('TEMP', 'C:/Users/Dylan/AppData/Local/Temp').replace('\\', '/') + '/'

with open(TMP + 'slugs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

SAMCO_POST = [s for s in data['samco_post'] if s != 'auto-draft']
SAMCO_PROJ = data['samco_project']
ALAQUA_POST = data['alaqua_post']

# 8 大文章类型分类规则（基于关键词）
# 类型 1: 技术原理与工作原理 (How ... works / What is / Principle / Working)
# 类型 2: 设备类型/产品选型 (Types of / Choosing / Best ... for)
# 类型 3: 应用场景与行业案例 (Application / Industry / Process / Used in / Case study)
# 类型 4: 操作维护与故障排除 (How to / Maintenance / Troubleshoot / Clean / Fix / Problems)
# 类型 5: 成本价格与采购 (Cost / Price / How much / Pricing)
# 类型 6: 厂商对比与采购指南 (Best companies / Top 10 / Manufacturers / Suppliers / Vendor)
# 类型 7: 法规标准与合规性 (Regulation / Compliance / EPA / Limits / Guidelines)
# 类型 8: 行业趋势与战略洞察 (Industry focus / Industry currents / Trends / Outlook / Future / Strategy)

def classify(slug, is_project=False):
    s = slug.lower()
    # project_sitemap 全部归为应用案例
    if is_project:
        return '3_应用场景与行业案例'
    # 类别匹配优先级（避免被前面的宽泛关键词吞掉）
    # 7 法规
    if any(k in s for k in ['regulation', 'compliance', 'epa ', 'epa-', 'limitation', 'limit-', 'guideline', 'checklist', 'fossil-fuel-transition', 'pfas-and-regulatory', 'effluent-guidelines', 'lead-levels', 'lead-in-drinking', 'environmental-regulation']):
        return '7_法规标准与合规性'
    # 8 趋势洞察
    if any(k in s for k in ['industry-focus', 'industry-current', 'looking-ahead', 'trends', 'outlook', 'future-of', 'strategy', 'boardroom', 'emerging-market', 'volatility', 'decentralized', 'transition', 'shaping', 'evolving', 'defining-industrial', 'reshape', 'reshaping', 'transforming', 'transform-', 'circular-water', 'ai-infrastructure', 'ai-chip', 'hydrogen-production', 'data-centers-driving', 'cooling-water-strategy', 'energy-storage', 'electrolysis', 'carbon-capture', 'bitcoin-mining']):
        return '8_行业趋势与战略洞察'
    # 5 成本价格
    if any(k in s for k in ['how-much', 'how-much-do', 'how-much-will', 'cost-', '-cost', 'cost-to', 'pricing', 'much-', 'anaerobic-wastewater-treatment-systems-cost']):
        return '5_成本价格与采购'
    # 6 厂商对比
    if any(k in s for k in ['best-companies', 'best-', 'top-10', 'top-5', '9-best', '8-signs', 'best-way', 'best-cheapest', 'manufacturers', 'suppliers', 'vendor', 'best-water-treatment-companies', 'equipment-supply']):
        return '6_厂商对比与采购指南'
    # 4 操作维护
    if any(k in s for k in ['how-to-', 'how-can-you', 'maintain', 'maintenance', 'troubleshoot', 'cleaning', 'clean-them', 'how-to-clean', 'how-to-fix', 'how-to-avoid', 'how-to-choose', 'how-to-know', 'how-to-increase', 'how-to-optimize', 'how-to-identify', 'how-to-remove', 'how-to-perform', 'how-to-reduce', 'how-to-use', 'how-do-', 'how-is-', 'how-are', 'how-can', 'signs-your', 'potential-problems', 'common-problems', 'common-ion-exchange-system-problems', 'common-raw-water', 'common-cooling', 'common-boiler', 'common-epc', 'common-industrial-water', 'common-problems-with', 'troubleshooting', 'avoid-them', 'fouling-and-how', 'how-to-choose-a-membrane', 'clean-in-place', 'membrane-clean', 'reduce-membrane', 'signs-that', 'six-signs', 'selecting-the-evaporators', 'selecting-your-water-source', 'greenfield-projects-what-to-know', 'what-to-know', 'understanding-', 'understanding-lead', 'optimization', 'optimize', '8-steps', '7-tips', '6-factors', '10-tips', '5-mistakes', 'top-5-mistakes', 'reduce-water', 'save-money', 'properties-demineralized', 'a-quick-guide', 'step-by-step', 'guide-to', 'checklist']):
        return '4_操作维护与故障排除'
    # 3 应用案例
    if any(k in s for k in ['application', 'industry', 'industries', 'case-study', 'used-in', 'used-for', 'applications', 'applicable', 'common-industrial-applications', 'in-food', 'in-the-chemical', 'in-the-cosmetics', 'in-sugar', 'in-fertilizer', 'in-refrigerator', 'in-the-refrigerator', 'in-hvac', 'in-cooling', 'for-steel', 'for-a-steel-mill', 'for-your-plant', 'for-your-facility', 'for-your-business', 'for-your-industrial', 'for-processing', 'in-the-food-industry', 'in-oil', 'in-refining', 'industrial-applications', 'uses', 'use-of', 'the-use-of', 'different-utilizations', 'industrial-facility', 'facility-needs', 'plant-need', 'does-your-plant', 'does-your-facility', 'industries-benefit', 'how-the-food-industry', 'how-is-distillation', 'in-the-petrochemical', 'in-the-power', 'in-the-semiconductor', 'in-the-steel', 'in-mining', 'oil-and-gas', 'for-the-oil', 'powers', 'for-Industrial-cooling', 'reducing-reusing-water-steel', 'reduce-water-usage-in-pulp', 'how-manufacturing', 'industrial-facilities-remove', 'best-way-remove', 'how-to-remove', 'remove-lead', 'remove-copper', 'remove-mercury', 'remove-chromium', 'removing-silica', 'removing-chromium', 'treat-brine', 'treated-vs-untreated', 'treated-versus', 'reusing-recycling', 'recycling-reuse', 'recycling-and-reuse', 'ways-your', 'seven-ways', 'five-ways', 'reduce-water-used-in-electrical', 'how-can-you-reduce', 'enhance-lithium', 'best-way-recovering', 'how-is-brine', 'copper-recovery', 'brine-waste-treatment', 'brine-management', 'produced-water', 'brine-mining', 'brine-pretreatment', 'brine-recovery', 'lithium-recovery', 'lithium-extraction', 'lithium-concentration', 'geothermal-brine', 'from-geothermal', 'in-the-battery', 'for-lithium-recovery', 'how-rising-film', 'in-sugar', 'sugar-crystallization', 'sugar-crystal', 'application-of-falling', 'master-your-craft', 'crafting-purity', 'the-role-of', 'role-of', 'the-process-of', 'since-1989', 'trusted-', 'leading-', 'processing-equipment-supplier', 'best-supplier', 'water-to-air', 'tube-and-shell', 'shell-and-tube', 'plate-type', 'plate-heat', 'plate-evaporator', 'film-evaporators', 'ltv-evaporator', 'forced-circulation', 'falling-film', 'rising-film', 'vacuum-', 'wastewater-evaporator', 'salt-evaporator', 'milk-evaporator', 'evaporator-in-food', 'evaporator-and-condenser', 'evaporator-condenser', 'evaporator-coil', 'evaporator-heat', 'evaporator-a-complete', 'evaporator-raw-material', 'ac-evaporator', 'furnace-heat', 'how-a-furnace', 'how-heat-exchangers', 'heat-exchanger-machine', 'heat-exchanger-hvac', 'heat-exchanger-in-hvac', 'heat-exchanger-equipment', 'heat-exchanger-maker', 'heat-exchanger-manufacturer', 'heat-exchanger-maintenance', 'heat-exchanger-types', 'heat-exchangers-manufacturers', 'heat-exchangers-the-basics', 'heat-exchange-in', 'function-of-heat', 'industrial-heat-exchanger', 'choosing-the-right-heat', 'choosing-the-right-distillation', 'can-a-heat', 'decoding-heat', 'different-types-of-heat', 'investigating-the', 'overview-of', 'optimization-of', 'transform-oil', 'understanding-the-world', 'understanding-crystallizers', 'understanding-the-working', 'understanding-the-role', 'unlocking-the-power', 'key-factors', 'key-components', 'key-safety', 'industrial-equipment', 'industrial-distillation', 'industrial-crystallization', 'industrial-crystallization-equipment', 'crystallization-equipment', 'crystallizer-equipment', 'crystallizer-and', 'crystallizer-process', 'crystallizer-types', 'crystallizers-and', 'crystallizers-specification', 'crystallizers-supplier', 'krystal-crystallizer', 'cooling-crystallizer', 'vacuum-crystallizer', 'oslo-crystallizer', 'mixed-salt-crystallizers', 'sulphuric-acid', 'concentrating-sulfuric', 'caustic-soda', 'different-types-of-crystallizer', 'stages-or-process', 'nucleation', 'exploring-the-role', 'sugar-crystal-growth', 'factors-that-affect', 'what-affects', 'the-process-of-producing', 'spray-drying', 'spray-dryer', 'features-of-spray', 'spray-drying-solutions', 'spray-drying-process', 'spray-dryers-work', 'spray-dryer-process', 'spray-dryer-function', 'spray-dryer-problems', 'spray-dryer-machine', 'spray-dryer-innovations', 'spray-dryer-a-complete', 'lab-spray', 'the-most-efficient', 'the-advantages-of-spray', 'the-technology', 'how-does-a-spray', 'how-does-the-food', 'spray-drying-process-an', 'solvent-recovery', 'the-ultimate-guide-to-solvent', 'solvent-distillation', 'best-distillation', 'master-your', 'distillation-equipment', 'distillation-machine', 'distillation-processes', 'distillation-and', 'distilling-equipment', 'distiller-equipment', 'fractional-distillation', 'home-alcohol', 'alcohol-distillation', 'the-application-of-distillation', 'the-distillation-equipment', 'the-different-types-of-distillation', 'the-future-of-plantation', 'plantation-of', 'the-distillation', 'advantages-of-continuous', 'benefits-of-distillation', 'cleaning-and-maintenance-of-distillation', 'cleaning-and-maintenance', 'crafting-purity', 'craft-of-distillation', 'the-role-of-processing', 'the-advantage-of', 'best-way-recovering']):
        return '3_应用场景与行业案例'
    # 2 设备类型与选型
    if any(k in s for k in ['types-of', 'type-of', 'different-types', 'type-evaporator', 'types-of-heat-exchanger', 'selecting-the', 'best-way', 'best-type', 'which-', 'what-type', 'right-heat', 'right-crystallizer', 'right-distillation', 'right-processing', 'best-heat', 'right-evaporator', 'right-spray', 'selection-', 'selecting', 'choose-the-best', 'choose-best', 'choosing-best', 'how-to-choose', 'selecting-your', 'choosing-the', 'identifying', 'best-membrane', 'best-way', 'membrane-vs', 'vs-', 'versus-', 'difference', 'differences', 'distinguish', 'comparing', 'compared', 'better-for', 'best-for']):
        return '2_设备类型与产品选型'
    # 1 技术原理
    if any(k in s for k in ['what-is', 'what-are', 'what-exactly', 'what-does', 'what-makes', 'principle', 'working', 'how-it-works', 'how-does', 'how-do', 'how-is', 'how-are', 'how-can', 'how-', 'introduction', 'the-importance', 'importance', 'understanding', 'overview', 'purpose-of', 'function', 'exploring', 'investigating', 'decoded', 'definition', 'defined', 'fundamental', 'concept', 'theory', 'mechanism', 'design-of', 'designing', 'the-science', 'science-of', 'properties']):
        return '1_技术原理与工作原理'
    # 兜底
    return '0_未分类'

def classify_alaqua(slug):
    s = slug.lower()
    # 8 趋势
    if any(k in s for k in ['trends', 'future-of', 'innovations', 'since-1989', 'trusted-', 'leading-', 'best-supplier', 'transforming', 'reshaping', 'evolving', 'shaping']):
        return '8_行业趋势与战略洞察'
    # 5 成本
    if any(k in s for k in ['cost', 'price', 'pricing', 'how-much']):
        return '5_成本价格与采购'
    # 6 厂商对比
    if any(k in s for k in ['best-supplier', 'top-10', 'top-5', 'best-evaporators-supplier', 'best-distillation', 'manufacturers', 'supplier-in-usa', 'trusted-industrial', 'leading-processing', 'best-companies', 'suppliers', 'vendor', 'processing-equipment-supplier', 'processing-equipments', 'introduction-of-process', 'the-role-of-processing', 'why-processing-equipment', 'processing-equipment-services', 'questions-you-should', 'how-to-spot', 'how-to-identify', 'how-to-choose', '7-tips', 'key-factors', 'questions']):
        return '6_厂商对比与采购指南'
    # 7 法规
    if any(k in s for k in ['gmp-', 'compliance', 'safety', 'quality-compliance', 'safety-considerations', 'reducing-risk', 'traceability']):
        return '7_法规标准与合规性'
    # 4 操作维护
    if any(k in s for k in ['how-to-', 'how-to-use', 'how-to-optimize', 'how-to-apply', 'how-to-maintain', 'how-to-identify', 'how-to-troubleshoot', 'maintain', 'maintenance', 'troubleshoot', 'cleaning', 'how-to-choose', 'installation', 'step-by-step', 'guide', '8-steps', '10-tips', '5-mistakes', 'top-5-mistakes', 'optimization', 'optimize', 'reduce-risk', 'safety-considerations', 'signs', 'prevent', 'repair', 'fix', 'replace', 'failure', 'leak-and-how', 'spot']):
        return '4_操作维护与故障排除'
    # 2 选型（优先于 3）
    if any(k in s for k in ['types-of', 'type-of', 'different-types', 'type-evaporator', 'selecting', 'right-', 'best-', 'choose-', 'choosing', 'selection', 'vs-', 'versus', 'difference', 'distinguish', 'what-type', 'right-heat', 'right-crystallizer', 'right-distillation', 'right-processing', 'right-spray', 'comparing']):
        return '2_设备类型与产品选型'
    # 3 应用案例
    if any(k in s for k in ['application', 'applications', 'applied', 'uses', 'use-of', 'the-use-of', 'used-for', 'used-in', 'common-use', 'industries', 'industry', 'industrial-', 'in-food', 'in-the-chemical', 'in-cosmetics', 'in-sugar', 'in-fertilizer', 'in-refrigerator', 'in-hvac', 'for-steel', 'in-oil', 'in-refining', 'in-pharma', 'industry-use', 'how-the-food', 'how-is-distillation', 'different-utilizations', 'the-application', 'the-process-of', 'transform-oil', 'the-role-of', 'role-of', 'the-common-use', 'plantation-of']):
        return '3_应用场景与行业案例'
    # 1 原理
    if any(k in s for k in ['what-is', 'what-are', 'what-exactly', 'what-does', 'what-makes', 'principle', 'principles', 'working', 'how-it-works', 'how-does', 'how-do', 'how-is', 'how-', 'introduction', 'importance', 'the-importance', 'understanding', 'overview', 'purpose-of', 'function', 'exploring', 'investigating', 'definition', 'fundamental', 'concept', 'mechanism', 'design', 'features', 'explained', 'an-overview', 'a-complete', 'a-guide', 'a-game-changer', 'the-technology', 'decoded', 'unlocking']):
        return '1_技术原理与工作原理'
    return '0_未分类'

# 分类
result = {
    'SAMCO': defaultdict(list),
    'Alaqua': defaultdict(list),
}

for s in SAMCO_POST:
    cat = classify(s, is_project=False)
    result['SAMCO'][cat].append(s)

for s in SAMCO_PROJ:
    cat = classify(s, is_project=True)
    result['SAMCO'][cat].append(s)

for s in ALAQUA_POST:
    cat = classify_alaqua(s)
    result['Alaqua'][cat].append(s)

# 统计
print("=== 分类统计 ===")
for site in ['SAMCO', 'Alaqua']:
    total = sum(len(v) for v in result[site].values())
    print(f"\n{site} 总计: {total}")
    for cat in sorted(result[site].keys()):
        print(f"  {cat}: {len(result[site][cat])}")

# 保存
with open(TMP + 'classified.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("\nSaved classified.json")

# 检查未分类
print("\n=== 未分类样本 ===")
for site in ['SAMCO', 'Alaqua']:
    unc = result[site].get('0_未分类', [])
    print(f"{site} 未分类 ({len(unc)}): {unc[:20]}")
