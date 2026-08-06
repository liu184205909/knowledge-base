#!/usr/bin/env python3
"""Classify SAMCO + Alaqua slugs - v3 with clearer priority.

类型定义（8 大类）:
  1. 技术原理与工作原理 - What is / How it works / Working principle / Principle
  2. 设备类型与产品选型 - Types / vs / Versus / Difference / Selection / Right ...
  3. 应用场景与行业案例 - Application / Industry / Used in / Case study
  4. 操作维护与故障排除 - How to / Maintenance / Troubleshoot / Clean / Fix
  5. 成本价格与采购 - Cost / Price / How much
  6. 厂商对比与采购指南 - Best companies / Top 10 / Suppliers / Manufacturers
  7. 法规标准与合规性 - Regulation / Compliance / EPA / Limits
  8. 行业趋势与战略洞察 - Trends / Outlook / Future / Strategy / Industry focus

优先级（避免宽泛关键词覆盖）：
  P1: 7 法规, 8 趋势, 5 成本
  P2: 6 厂商, 4 维护
  P3: 2 选型
  P4: 1 原理
  P5: 3 应用（兜底）
"""
import re, json, os
from collections import defaultdict

TMP = os.environ.get('TEMP', 'C:/Users/Dylan/AppData/Local/Temp').replace('\\', '/') + '/'

with open(TMP + 'slugs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

SAMCO_POST = [s for s in data['samco_post'] if s != 'auto-draft']
SAMCO_PROJ = data['samco_project']
ALAQUA_POST = data['alaqua_post']


def hit(keywords, s):
    return any(k in s for k in keywords)


def classify(slug, is_project=False):
    s = slug.lower()

    # project sitemap 全部归 3
    if is_project:
        return '3_应用场景与行业案例'

    # ========== P1 高优先级 ==========
    # 7 法规
    if hit([
        'regulation', 'compliance', 'epa-', 'epa ', 'guideline', 'checklist',
        'pfas', 'effluent-guidelines', 'lead-levels', 'lead-in-drinking',
        'environmental-regulation', 'gmp-', 'quality-compliance',
        'acceptable-lead', 'fossil-fuel-transition',
        'new-steam-electric-power-generating-effluent',
        'drinking-water-and-wastewater-infrastructure',
        'safety-considerations',
    ], s):
        return '7_法规标准与合规性'

    # 8 行业趋势与战略
    if hit([
        'industry-focus', 'industry-current', 'looking-ahead', 'future-of',
        'trends', 'outlook', 'strategy', 'boardroom', 'emerging-market',
        'volatility', 'decentralized', 'shaping', 'evolving',
        'defining-industrial', 'reshape', 'reshaping', 'transforming',
        'circular-water', 'ai-infrastructure', 'ai-chip', 'hydrogen-production',
        'data-centers-driving', 'energy-storage', 'electrolysis', 'carbon-capture',
        'bitcoin-mining', 'innovation', 'innovations', 'since-1989',
        'how-does-modern-distillation', 'transition', 'fossil-fuel',
        'are-you-ready', 'industry-currents',
    ], s):
        return '8_行业趋势与战略洞察'

    # 5 成本价格
    if hit([
        'how-much', 'cost-', '-cost', 'cost-to', 'pricing', 'much-',
        'how-much-do', 'how-much-will', 'price',
    ], s):
        return '5_成本价格与采购'

    # ========== P2 中优先级 ==========
    # 6 厂商对比与采购指南
    if hit([
        'best-companies', 'top-10', 'top-5', '9-best', '8-signs',
        'manufacturers', 'suppliers', 'vendor', 'best-water-treatment-companies',
        'equipment-supply', 'supplier-in-usa', 'trusted-industrial',
        'leading-processing', 'best-supplier', 'processing-equipment-supplier',
        'processing-equipments', 'processing-equipment-services',
        'best-evaporators-supplier', 'best-distillation',
        'distillation-equipment-suppliers', 'heat-exchangers-manufacturers',
        'heat-exchanger-manufacturer', 'crystallizer-manufacturer',
        'a-guide-to-reliable', 'equipment-supplier', 'how-to-spot',
        'questions-you-should', 'how-to-identify-the-leading',
        'how-to-identify-the-right', 'reasons-purchase',
        'buy-industrial', 'buying-industrial', 'best-',
        'buy-', 'buying-', 'purchase-',
    ], s):
        return '6_厂商对比与采购指南'

    # 4 操作维护与故障排除
    if hit([
        'how-to-', 'how-can-you', 'maintain', 'maintenance', 'troubleshoot',
        'cleaning', 'clean-them', 'how-to-clean', 'how-to-fix', 'how-to-avoid',
        'how-to-choose', 'how-to-know', 'how-to-increase', 'how-to-optimize',
        'how-to-identify', 'how-to-remove', 'how-to-perform', 'how-to-reduce',
        'how-to-use', 'how-to-apply', 'how-to-maintain', 'how-to-troubleshoot',
        'signs-your', 'signs-that', 'six-signs', 'potential-problems',
        'common-problems', 'troubleshooting', 'avoid-them', 'fouling-and-how',
        'how-to-choose-a-membrane', 'clean-in-place', 'membrane-clean',
        'reduce-membrane', 'optimization', 'optimize', '8-steps', '7-tips',
        '6-factors', '10-tips', '5-mistakes', 'top-5-mistakes', 'reduce-water',
        'save-money', 'a-quick-guide', 'step-by-step', 'checklist',
        'reduce-risk', 'reduce-water-used', 'reducing-risk', 'repair',
        'failure', 'leak-and-how', 'prevent', 'installation',
        'membrane-fouling', 'fouling', 'how-can-you-tell', 'how-can-you-reduce',
        'ways-your', 'seven-ways', 'five-ways', 'ways-',
        'selecting-your', 'greenfield-projects-what-to-know', 'what-to-know',
        'what-to-do', 'selecting-the', 'understanding-lead-times',
        'common-epc-project-challenges', 'common-',
        'how-to-apply-evaporators', 'membrane-fouling-and-how',
        'from-proposal-to-commissioning', 'water-treatment-technologies-to-reduce',
        'reusing-recycling', 'recycling-reuse', 'recycling-and-reuse',
        'reduce-water-usage', 'how-manufacturing', 'reduce-water',
        'how-can-you-reduce-water',
    ], s):
        return '4_操作维护与故障排除'

    # ========== P3 选型 ==========
    # 2 设备类型与产品选型
    if hit([
        'types-of', 'type-of', 'different-types', 'type-evaporator',
        'vs-', 'versus', 'difference', 'differences', 'distinguish',
        'comparing', 'compared', 'better-for', 'best-for',
        'what-type', 'right-heat', 'right-crystallizer', 'right-distillation',
        'right-processing', 'right-spray', 'selecting', 'choose-the-best',
        'choose-best', 'choosing-best', 'choosing-the', 'best-membrane',
        'membrane-vs', 'selection', 'choose-', 'choosing',
        'selecting-your-water-source', 'does-your-facility-need',
        'does-your-plant-need', 'know-industrial-facility-needs',
        'know-need-cooling', 'how-to-know-if', 'is-it-possible',
        'do-you-need', 'does-your-facility-need-zero',
        'right-for-your', 'can-a-membrane-bioreactor',
        'are-biological-trickling-filters-right',
        'crystallizer-and-its-types', 'crystallizer-types',
        'what-are-the-different-types', 'different-types-of-distillation',
        'different-types-of-heat', 'different-types-of-crystallizer',
        'how-to-choose', 'best-membrane',
    ], s):
        return '2_设备类型与产品选型'

    # ========== P4 技术原理（优先于 3 应用） ==========
    # 1 技术原理与工作原理
    if hit([
        'what-is', 'what-are', 'what-exactly', 'what-does', 'what-makes',
        'principle', 'principles', 'working', 'how-it-works', 'how-does',
        'how-do', 'how-is', 'how-are', 'how-can', 'how-',
        'introduction', 'importance', 'the-importance', 'understanding',
        'overview', 'purpose-of', 'function', 'exploring', 'investigating',
        'definition', 'defined', 'fundamental', 'concept', 'theory',
        'mechanism', 'design-of', 'designing', 'the-science', 'science-of',
        'properties', 'explained', 'a-complete', 'a-guide', 'a-game-changer',
        'the-technology', 'decoded', 'unlocking', 'what-is-the-role',
        'what-is-the-working', 'what-is-the-equipment', 'what-is-the-best-way',
        'what-is-heat', 'what-is-demineralization', 'what-is-reverse',
        'what-is-membrane', 'what-is-lithium', 'what-is-zero',
        'what-is-ultrafiltration', 'what-is-a-', 'what-are-the-',
        'what-are-microfiltration', 'what-are-biofiltration', 'what-are-aerobic',
        'what-affects', 'what-makes-milk',
        # Alaqua 纯产品/原理关键词
        'evaporator', 'evaporators', 'crystallizer', 'crystallizers',
        'distillation', 'distilling', 'distiller', 'spray-dryer', 'spray-dryers',
        'spray-drying', 'heat-exchanger', 'heat-exchangers', 'solvent-recovery',
        'ion-exchange', 'membrane', 'reverse-osmosis', 'nanofiltration',
        'microfiltration', 'ultrafiltration', 'demineralization', 'softening',
        'filtration', 'biological-', 'biofiltration', 'aerobic', 'anaerobic',
        'zld', 'zero-liquid-discharge', 'wastewater-treatment',
        'water-treatment', 'boiler-feed', 'cooling-tower',
        'brine-waste', 'brine-water', 'raw-water', 'potable-water',
        'mixed-bed', 'electrodeionization', 'edi',
        'work', 'process', 'works',
        # SAMCO 产品/原理类
        'amberpack', 'upcore', 'dowex', 'resin', 'ion-exchange-resin',
        'osmosis', 'nanofiltration', 'polishing', 'mbr', 'mbbr', 'fbbr',
        'trickling-filter', 'bioreactor', 'clarification', 'softening',
        'cicculation', 'filtration', 'evaporator', 'crystallizer',
    ], s):
        return '1_技术原理与工作原理'

    # ========== P5 应用兜底 ==========
    # 3 应用场景与行业案例
    if hit([
        'application', 'industry', 'industries', 'case-study', 'case-studies',
        'used-in', 'used-for', 'applications', 'applicable',
        'in-food', 'in-the-chemical', 'in-the-cosmetics', 'in-sugar',
        'in-fertilizer', 'in-refrigerator', 'in-hvac', 'in-cooling',
        'for-steel', 'for-a-steel-mill', 'for-your-plant', 'for-your-facility',
        'for-your-business', 'for-your-industrial', 'for-processing',
        'in-the-food-industry', 'in-oil', 'in-refining',
        'industrial-applications', 'uses', 'use-of', 'the-use-of',
        'different-utilizations', 'industrial-facility', 'facility-needs',
        'plant-need', 'does-your-plant', 'does-your-facility',
        'industries-benefit', 'how-the-food-industry', 'how-is-distillation',
        'in-the-petrochemical', 'in-the-power', 'in-the-semiconductor',
        'in-the-steel', 'in-mining', 'oil-and-gas', 'for-the-oil', 'powers',
        'for-industrial-cooling', 'reducing-reusing-water-steel',
        'reduce-water-usage-in-pulp', 'how-manufacturing',
        'industrial-facilities-remove', 'best-way-remove', 'remove-lead',
        'remove-copper', 'remove-mercury', 'remove-chromium', 'removing-silica',
        'removing-chromium', 'treat-brine', 'treated-vs-untreated',
        'treated-versus', 'how-can-you-reduce', 'enhance-lithium',
        'best-way-recovering', 'how-is-brine', 'copper-recovery',
        'brine-waste-treatment', 'brine-management', 'produced-water',
        'brine-mining', 'brine-pretreatment', 'brine-recovery',
        'lithium-recovery', 'lithium-extraction', 'lithium-concentration',
        'geothermal-brine', 'from-geothermal', 'in-the-battery',
        'for-lithium-recovery', 'how-rising-film', 'in-sugar',
        'sugar-crystallization', 'sugar-crystal', 'application-of-falling',
        'master-your-craft', 'crafting-purity', 'the-role-of', 'role-of',
        'the-process-of', 'the-common-use', 'plantation-of',
        'the-application-of-distillation', 'the-application-of',
        'how-does-modern-distillation', 'how-does-the-food',
        'how-is-distillation-equipment-used', 'use-of-distillation',
        'common-use-of', 'utilization', 'the-role-of-processing',
        'industrial-distillation-equipment', 'industrial-crystallization-equipment',
        'industrial-equipment-of-crystallization', 'industrial-heat-exchanger',
        'industrial-distillation', 'industrial-crystallization',
        'industrial-applications-of-distillation', 'industrial-evaporators-uses',
        'industrial-applications', 'the-process-of-producing',
        'how-do-evaporators-work-for-thermal', 'how-evaporators-help',
        'how-heat-exchangers-help', 'transform-oil', 'application',
        'crystallizers-and-their-applications', 'crystallizer-equipment',
        'crystallization-equipment', 'crystallizer', 'crystallizers',
        'evaporator-systems', 'evaporators-technologies', 'evaporators',
        'heat-exchangers', 'heat-exchanger', 'distillation-equipment',
        'distillation', 'distilling-equipment', 'distiller-equipment',
        'distillation-equipment-and-processes', 'distillation-processes',
        'spray-dryer', 'spray-drying', 'spray-dryers',
        'spray-drying-process', 'spray-drying-solutions', 'solvent-recovery',
        'solvent-recovery-system', 'solvent-recovery-systems', 'solvent-recovery-plant',
        'solvent-recovery-process', 'solvent-distillation',
        'plate-heat', 'plate-type', 'plate-evaporator', 'plate-evaporators',
        'shell-and-tube', 'tube-and-shell', 'shell-and-tube-heat',
        'forced-circulation', 'falling-film', 'rising-film', 'ltv-evaporator',
        'vacuum-crystallizer', 'vacuum-cooling', 'vacuum-processing',
        'wastewater-evaporator', 'salt-evaporator', 'milk-evaporator',
        'evaporator-in-food', 'evaporator-and-condenser', 'evaporator-condenser',
        'evaporator-coil', 'evaporator-heat', 'evaporator-a-complete',
        'evaporator-raw-material', 'ac-evaporator', 'evaporators-services',
        'evaporators-explained', 'evaporators-types', 'evaporators-coil',
        'furnace-heat', 'how-a-furnace', 'heat-exchanger-machine',
        'heat-exchanger-hvac', 'heat-exchanger-in-hvac', 'heat-exchanger-equipment',
        'heat-exchanger-maker', 'heat-exchanger-manufacturer', 'heat-exchanger-maintenance',
        'heat-exchanger-types', 'heat-exchangers-manufacturers', 'heat-exchangers-the-basics',
        'heat-exchange-in', 'function-of-heat', 'choosing-the-right-heat',
        'choosing-the-right-distillation', 'can-a-heat', 'decoding-heat',
        'different-types-of-heat', 'investigating-the', 'overview-of',
        'optimization-of', 'understanding-the-world', 'understanding-crystallizers',
        'understanding-the-working', 'understanding-the-role', 'unlocking-the-power',
        'key-factors', 'key-components', 'key-safety', 'sulphuric-acid',
        'concentrating-sulfuric', 'caustic-soda', 'nucleation', 'exploring-the-role',
        'factors-that-affect', 'what-affects', 'water-to-air',
        'evaporator-condenser-explained', 'evaporator-heat-exchanger-queries',
        'how-evaporators-help-to-save', 'how-heat-exchangers-help-save',
        'how-do-evaporators-work', 'craft-of-distillation',
        'the-advantage-of', 'the-advantages-of', 'advantages-of',
        'benefits-of', 'benefits-of-distillation', 'best-way-recovering',
        'crystallizer-process-and-how-it-works', 'how-does-a-vacuum',
        'how-does-a-spray', 'how-rising-film-evaporators-work',
        'how-to-apply-evaporators-crystallizers-to-fertilizer-production',
        'how-to-use-rising-film-evaporators', 'how-to-use-distillation',
        'how-to-use-spray-dryers', 'how-is-brine-mining',
        'salt-crystallization-for-wastewater-treatment',
    ], s):
        return '3_应用场景与行业案例'

    # 兜底：why-/know/important/benefits
    if s.startswith('why-'):
        return '8_行业趋势与战略洞察'
    if 'benefit' in s or 'advantage' in s:
        return '3_应用场景与行业案例'
    if 'important' in s or 'necessary' in s or 'matters' in s:
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
    cat = classify(s, is_project=False)
    result['Alaqua'][cat].append(s)

# 排序
for site in result:
    for cat in result[site]:
        result[site][cat].sort()

# 统计
print("=== 分类统计 v3 ===")
for site in ['SAMCO', 'Alaqua']:
    total = sum(len(v) for v in result[site].values())
    print(f"\n{site} total: {total}")
    for cat in sorted(result[site].keys()):
        print(f"  {cat}: {len(result[site][cat])}")

# 检查未分类
print("\n=== 未分类详情 ===")
for site in ['SAMCO', 'Alaqua']:
    unc = result[site].get('0_未分类', [])
    print(f"\n{site} uncategorized ({len(unc)}):")
    for s in unc:
        print(f"  - {s}")

# 保存
with open(TMP + 'classified.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("\nSaved classified.json")
