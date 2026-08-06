#!/usr/bin/env python3
"""Classify SAMCO + Alaqua slugs - v2 improved rules."""
import re, json, os
from collections import defaultdict

TMP = os.environ.get('TEMP', 'C:/Users/Dylan/AppData/Local/Temp').replace('\\', '/') + '/'

with open(TMP + 'slugs.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

SAMCO_POST = [s for s in data['samco_post'] if s != 'auto-draft']
SAMCO_PROJ = data['samco_project']
ALAQUA_POST = data['alaqua_post']

# 通用分类（适用于两个站点）
def classify(slug, is_project=False, site='SAMCO'):
    s = slug.lower()

    # project 案例全部归 3
    if is_project:
        return '3_应用场景与行业案例'

    # 7 法规合规
    if any(k in s for k in [
        'regulation', 'compliance', 'epa-', 'epa ', 'guideline', 'checklist',
        'pfas', 'effluent-guidelines', 'lead-levels', 'lead-in-drinking',
        'environmental-regulation', 'gmp-', 'quality-compliance',
        'safety-considerations', 'safety-', 'acceptable-lead', 'fossil-fuel-transition',
        'new-steam-electric-power-generating-effluent', 'drinking-water-and-wastewater-infrastructure',
    ]):
        return '7_法规标准与合规性'

    # 8 行业趋势与战略
    if any(k in s for k in [
        'industry-focus', 'industry-current', 'looking-ahead', 'future-of',
        'trends', 'outlook', 'strategy', 'boardroom', 'emerging-market',
        'volatility', 'decentralized', 'transition', 'shaping', 'evolving',
        'defining-industrial', 'reshape', 'reshaping', 'transforming',
        'circular-water', 'ai-infrastructure', 'ai-chip', 'hydrogen-production',
        'data-centers-driving', 'energy-storage', 'electrolysis', 'carbon-capture',
        'bitcoin-mining', 'industry-currents', 'innovation', 'innovations',
        'since-1989', 'how-does-modern-distillation',
    ]):
        return '8_行业趋势与战略洞察'

    # 5 成本价格
    if any(k in s for k in [
        'how-much', 'cost-', '-cost', 'cost-to', 'pricing', 'much-',
        'price', 'how-much-do', 'how-much-will',
    ]):
        return '5_成本价格与采购'

    # 6 厂商对比与采购指南
    if any(k in s for k in [
        'best-companies', 'top-10', 'top-5', '9-best', '8-signs',
        'manufacturers', 'suppliers', 'vendor', 'best-water-treatment-companies',
        'equipment-supply', 'supplier-in-usa', 'trusted-industrial',
        'leading-processing', 'best-supplier', 'processing-equipment-supplier',
        'processing-equipments', 'processing-equipment-services',
        'best-evaporators-supplier', 'best-distillation', 'best-',
        'distillation-equipment-suppliers', 'heat-exchangers-manufacturers',
        'heat-exchanger-manufacturer', 'crystallizer-manufacturer',
        'a-guide-to-reliable', 'equipment-supplier', 'how-to-spot',
        'questions-you-should', 'how-to-identify-the-leading',
        'how-to-identify-the-right', 'identifying', 'questions',
    ]):
        return '6_厂商对比与采购指南'

    # 4 操作维护与故障排除
    if any(k in s for k in [
        'how-to-', 'how-can-you', 'maintain', 'maintenance', 'troubleshoot',
        'cleaning', 'clean-them', 'how-to-clean', 'how-to-fix', 'how-to-avoid',
        'how-to-choose', 'how-to-know', 'how-to-increase', 'how-to-optimize',
        'how-to-identify', 'how-to-remove', 'how-to-perform', 'how-to-reduce',
        'how-to-use', 'how-to-apply', 'how-to-maintain', 'how-to-troubleshoot',
        'how-do-', 'signs-your', 'signs-that', 'six-signs', 'potential-problems',
        'common-problems', 'troubleshooting', 'avoid-them', 'fouling-and-how',
        'how-to-choose-a-membrane', 'clean-in-place', 'membrane-clean',
        'reduce-membrane', 'optimization', 'optimize', '8-steps', '7-tips',
        '6-factors', '10-tips', '5-mistakes', 'top-5-mistakes', 'reduce-water',
        'save-money', 'a-quick-guide', 'step-by-step', 'guide-to', 'checklist',
        'reduce-risk', 'reduce-water-used', 'reducing-risk', 'repair',
        'fix', 'replace', 'failure', 'leak-and-how', 'spot', 'safety-considerations',
        'signs', 'prevent', 'installation', 'guide', 'membrane-fouling',
        'fouling', 'how-can-you-tell', 'how-can-you-reduce',
        'ways-your', 'seven-ways', 'five-ways', 'ways-', 'selecting-your',
        'greenfield-projects-what-to-know', 'what-to-know', 'what-to-do',
        'selecting-the', 'understanding-lead-times',
        'common-epc-project-challenges', 'common-',
        'how-to-apply-evaporators',
    ]):
        return '4_操作维护与故障排除'

    # 2 设备类型与产品选型（vs / difference / types / choose / selecting 放到 2）
    if any(k in s for k in [
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
        'what-are-the-different-types', 'type-evaporator',
        'different-types-of-distillation', 'different-types-of-heat',
        'different-types-of-crystallizer',
    ]):
        return '2_设备类型与产品选型'

    # 3 应用案例与行业应用
    if any(k in s for k in [
        'application', 'industry', 'industries', 'case-study', 'case-studies',
        'used-in', 'used-for', 'applications', 'applicable',
        'common-industrial-applications', 'in-food', 'in-the-chemical',
        'in-the-cosmetics', 'in-sugar', 'in-fertilizer', 'in-refrigerator',
        'in-hvac', 'in-cooling', 'for-steel', 'for-a-steel-mill',
        'for-your-plant', 'for-your-facility', 'for-your-business',
        'for-your-industrial', 'for-processing', 'in-the-food-industry',
        'in-oil', 'in-refining', 'industrial-applications', 'uses',
        'use-of', 'the-use-of', 'different-utilizations', 'industrial-facility',
        'facility-needs', 'plant-need', 'does-your-plant', 'does-your-facility',
        'industries-benefit', 'how-the-food-industry', 'how-is-distillation',
        'in-the-petrochemical', 'in-the-power', 'in-the-semiconductor',
        'in-the-steel', 'in-mining', 'oil-and-gas', 'for-the-oil', 'powers',
        'for-industrial-cooling', 'reducing-reusing-water-steel',
        'reduce-water-usage-in-pulp', 'how-manufacturing',
        'industrial-facilities-remove', 'best-way-remove', 'remove-lead',
        'remove-copper', 'remove-mercury', 'remove-chromium', 'removing-silica',
        'removing-chromium', 'treat-brine', 'treated-vs-untreated',
        'treated-versus', 'reusing-recycling', 'recycling-reuse',
        'recycling-and-reuse', 'reduce-water-used-in-electrical',
        'how-can-you-reduce', 'enhance-lithium', 'best-way-recovering',
        'how-is-brine', 'copper-recovery', 'brine-waste-treatment',
        'brine-management', 'produced-water', 'brine-mining', 'brine-pretreatment',
        'brine-recovery', 'lithium-recovery', 'lithium-extraction',
        'lithium-concentration', 'geothermal-brine', 'from-geothermal',
        'in-the-battery', 'for-lithium-recovery', 'how-rising-film',
        'in-sugar', 'sugar-crystallization', 'sugar-crystal', 'application-of-falling',
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
    ]):
        return '3_应用场景与行业案例'

    # 1 技术原理
    if any(k in s for k in [
        'what-is', 'what-are', 'what-exactly', 'what-does', 'what-makes',
        'principle', 'principles', 'working', 'how-it-works', 'how-does',
        'how-do', 'how-is', 'how-are', 'how-can', 'how-', 'introduction',
        'the-importance', 'importance', 'understanding', 'overview',
        'purpose-of', 'function', 'exploring', 'investigating', 'definition',
        'defined', 'fundamental', 'concept', 'theory', 'mechanism', 'design-of',
        'designing', 'the-science', 'science-of', 'properties', 'explained',
        'a-complete', 'a-guide', 'a-game-changer', 'the-technology', 'decoded',
        'unlocking', 'what-is-the-role', 'what-is-the-working',
        'what-is-the-equipment', 'what-is-the-best-way', 'what-is-heat',
        'what-is-demineralization', 'what-is-reverse', 'what-is-membrane',
        'what-is-lithium', 'what-is-zero', 'what-is-ultrafiltration',
        'what-is-a-', 'what-are-the-', 'what-are-microfiltration',
        'what-are-biofiltration', 'what-are-aerobic', 'what-to-know',
        'what-affects', 'what-makes', 'how-is-brine',
    ]):
        return '1_技术原理与工作原理'

    # 兜底再扫一轮 - 特殊模式
    if 'work' in s or 'process' in s or 'works' in s:
        return '1_技术原理与工作原理'
    if 'importance' in s or 'necessary' in s or 'matters' in s:
        return '1_技术原理与工作原理'
    if 'advantages' in s or 'disadvantages' in s or 'benefits' in s:
        return '3_应用场景与行业案例'
    if 'why-' in s or 'why-' == s[:3]:
        return '8_行业趋势与战略洞察'
    if 'know' in s or 'understanding' in s:
        return '1_技术原理与工作原理'

    return '0_未分类'

# 分类
result = {
    'SAMCO': defaultdict(list),
    'Alaqua': defaultdict(list),
}

for s in SAMCO_POST:
    cat = classify(s, is_project=False, site='SAMCO')
    result['SAMCO'][cat].append(s)

for s in SAMCO_PROJ:
    cat = classify(s, is_project=True, site='SAMCO')
    result['SAMCO'][cat].append(s)

for s in ALAQUA_POST:
    cat = classify(s, is_project=False, site='Alaqua')
    result['Alaqua'][cat].append(s)

# 排序
for site in result:
    for cat in result[site]:
        result[site][cat].sort()

# 统计
print("=== 分类统计 v2 ===")
for site in ['SAMCO', 'Alaqua']:
    total = sum(len(v) for v in result[site].values())
    print(f"\n{site} total: {total}")
    for cat in sorted(result[site].keys()):
        print(f"  {cat}: {len(result[site][cat])}")

# 检查未分类
print("\n=== 未分类详情 ===")
for site in ['SAMCO', 'Alaqua']:
    unc = result[site].get('0_未分类', [])
    print(f"\n{site} 未分类 ({len(unc)}):")
    for s in unc:
        print(f"  - {s}")

# 保存
with open(TMP + 'classified.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("\nSaved classified.json")
