#!/usr/bin/env python3
"""应用 PR 改造 + URL 修复"""
import json, re, os
from collections import Counter

SD = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(SD, '选题库_strict.json'), 'r', encoding='utf-8') as f:
    records = json.load(f)
print(f'原始: {len(records)}')

DELETE_SLUGS = [
    'alfa-laval-is-introducing-the-alfa-laval-ac65',
    'new-patent-gea-spray-dryers',
    'gea-addcool-in-spray-drying-plant',
    'gea-centrifuges-for-lithium-hydroxide',
    'gea-jgc-chugai-pharmaceutical',
]

UPDATES = {
    'akzo-nobel-steps-ahead': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'Akzo Nobel瑞典烧碱浓缩板式蒸发器替代壳管式案例（占地减半）',
        'industry': '化工/烧碱',
        'url': 'https://www.alfalaval.com/media/stories/inorganic-chemicals/akzo-nobel-steps-ahead-with-new-technology-for-caustic-evaporation/'},
    'chelsea-sugar-reduces-carbon': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'Chelsea Sugar新西兰糖厂AlfaVap+MVR蒸发系统节能9%减排11%案例',
        'industry': '制糖',
        'url': 'https://www.alfalaval.com/media/stories/food-processing/chelsea-sugar-reduces-carbon-emissions-with-new-alfa-laval-evaporation-system/'},
    'distillery-in-sugar-mill-achieves': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': '印度Harinagar糖厂蒸馏废液六效蒸发+汽提ZLD日回收80万升水',
        'industry': '制糖/ZLD',
        'url': 'https://www.alfalaval.com/media/stories/food-processing/distillery-in-sugar-mill-achieves-zero-liquid-discharge-with-alfa-laval-water-recycling-system/'},
    'alfa-laval-helps-itc-live-up': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': '印度ITC纸厂BCTMP黑液七效蒸发+汽提ZLD达法定零排案例',
        'industry': '造纸/ZLD',
        'url': 'https://www.alfalaval.com/media/stories/pulp-production/alfa-laval-helps-itc-live-up-to-zero-liquid-discharge-statutory-directive/'},
    'alfa-laval-compact-plate-evaporators': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': '瑞典Absolut Vodka蒸馏厂AlfaVap板式再沸器紧凑扩产案例',
        'industry': '蒸馏',
        'url': 'https://www.alfalaval.com/media/stories/industries/alfa-laval-compact-plate-evaporators-allow-plant-expansion-in-middle-of-city/'},
    'm30-heat-exchanger-boosts': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': '澳大利亚Mulgrave糖厂M30板换预热清汁蒸发产能提升2.5-5%',
        'industry': '制糖',
        'url': 'https://www.alfalaval.com/media/stories/food-processing/m30-heat-exchanger-boosts-evaporation-capacity-at-australian-sugar-mill/'},
    'veramaris-s-algae-oil': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'Veramaris藻油：AlfaFlash+MVR蒸发助力Omega-3生产(产量+61%)',
        'industry': '微藻发酵',
        'url': 'https://www.alfalaval.com/media/stories/2025/sustainability/veramaris-s-algae-oil-revolution-boosted-by-alfa-laval-s-evaporation-technology/'},
    'alfa-laval-systems-makes-operating': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'Alfa Laval三效板式蒸发助力哥伦比亚玉米淀粉厂能耗降40-50%',
        'industry': '淀粉',
        'url': 'https://www.alfalaval.com/media/stories/starch-and-sweetener-processing/alfa-laval-systems-makes-operating-costs-evaporate/'},
    'beer-concentrate-a-new-generation': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'Alfa Laval Revos啤酒浓缩系统：运输效率提升6倍',
        'industry': '啤酒/饮料',
        'url': 'https://www.alfalaval.com/media/stories/beverage-processing/beer-concentrate-a-new-generation-of-beer/'},
    'why-do-industrial-plants-need-zero': {
        'type_num': 2, 'type': '2-What-Is/原理',
        'title_zh': '工业工厂为何需要ZLD零排放系统：板式蒸发器技术原理',
        'industry': 'ZLD零排放',
        'url': 'https://www.alfalaval.com/media/stories/industrial-water-waste-treatment/why-do-industrial-plants-need-zero-liquid-discharge-systems/'},
    'gea-agm-lithium-production': {
        'type_num': 1, 'type': '1-解决方案/案例',
        'title_zh': 'GEA为AMG锂业提供电池级氢氧化锂生产工艺(浓缩+结晶+干燥)',
        'industry': '锂电池/锂盐',
        'url': 'https://www.gea.com/en/news/trade-press/2021/gea-agm-lithium-production/'},
    'gea-compacon-new-compact': {
        'type_num': 2, 'type': '2-What-Is/原理',
        'title_zh': 'GEA CompaCon紧凑型蒸发器系列(降膜+强制循环50-3000kg/h)',
        'industry': '',
        'url': 'https://www.gea.com/en/news/trade-press/2021/gea-compacon-new-compact-evaporator-series/'},
    'gea-icecon-to-produce-liquid': {
        'type_num': 2, 'type': '2-What-Is/原理',
        'title_zh': 'GEA IceCon Compact冷冻浓缩装置(冰晶结晶分离100-900kg/h)',
        'industry': '食品/饮料',
        'url': 'https://www.gea.com/en/news/trade-press/2022/gea-icecon-to-produce-liquid-food-concentrates/'},
}

# GEA URL mapping from sitemap
gea_urls = {}
try:
    with open(os.path.join(SD, 'gea_sm.xml'), 'r', encoding='utf-8', errors='replace') as f:
        xml = f.read()
    urls = re.findall(r'<loc>(.*?)</loc>', xml)
    for url in urls:
        m = re.search(r'/([^/]+)/?$', url.rstrip('/'))
        if m:
            s = m.group(1).lower()
            if len(s) > 10:
                gea_urls[s] = url
    print(f'GEA sitemap: {len(gea_urls)} URLs')
except Exception as e:
    print(f'GEA sitemap error: {e}')

# Apply
updated = []
deleted_count = 0
updated_count = 0

for r in records:
    slug = r['slug'].rstrip('/').lower()

    # Delete?
    skip = False
    for d in DELETE_SLUGS:
        if d in slug:
            deleted_count += 1
            skip = True
            break
    if skip:
        continue

    # Update?
    for u_key, u_data in UPDATES.items():
        if u_key in slug:
            r['type_num'] = u_data['type_num']
            r['type'] = u_data['type']
            r['title_zh'] = u_data['title_zh']
            r['industry'] = u_data['industry']
            r['correct_url'] = u_data['url']
            updated_count += 1
            break

    # GEA URL fix
    if r.get('competitor') == 'GEA' and not r.get('correct_url'):
        for gs, gu in gea_urls.items():
            if slug in gs or gs in slug or slug[:20] in gs:
                r['correct_url'] = gu
                break

    updated.append(r)

print(f'删除: {deleted_count}')
print(f'PR更新: {updated_count}')
print(f'最终: {len(updated)}')

type_dist = Counter(r['type'] for r in updated)
print(f'\n类型分布:')
for t, c in sorted(type_dist.items()):
    print(f'  {t}: {c}')

with open(os.path.join(SD, '选题库_v4.json'), 'w', encoding='utf-8') as f:
    json.dump(updated, f, ensure_ascii=False, indent=2)
print(f'\n保存: 选题库_v4.json')
