#!/usr/bin/env python3
"""
选题库二次精炼
读取 restructure_topics.py 的 JSON 输出，用"语义标签"方式重新生成中文主题
策略：提取 行业+设备+动作 → 生成简短中文，不做逐词翻译
"""
import json, re, os
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# 语义标签词典
# ==========================================

# 行业标签（按特异性排序，先匹配具体的）
INDUSTRY_TAGS = [
    # 锂电/电池
    (['lithium-carbonate', 'li2co3', 'lithium-hydroxide', 'lioh'], '碳酸锂/氢氧化锂'),
    (['lithium-chloride', 'licl'], '氯化锂'),
    (['lithium', 'lithium-ore', 'lithium-mother'], '锂盐'),
    (['battery-grade', 'battery-material', 'battery-ecosystem', 'battery-industry'], '电池材料'),
    (['ev-battery', 'battery-recycling', 'black-mass', 'anode-material'], '电池回收'),
    (['iron-phosphate', 'fepo4'], '磷酸铁'),
    # 钾钠铵
    (['potassium', 'potash', 'kcl', 'k2so4', 'sop-', '-sop'], '钾肥/钾盐'),
    (['sodium-chloride', 'nacl', 'soda-ash', 'na2co3'], '钠盐'),
    (['sodium-sulfate', 'na2so4', 'glauber'], '硫酸钠'),
    (['ammonium-sulfate', 'ammonium-nitrate', 'ammonium-chloride'], '铵盐'),
    (['ammonium', 'nh4'], '铵盐'),
    # 重金属
    (['nickel-sulfate'], '硫酸镍'),
    (['zinc-sulfate', 'zinc-chloride'], '锌盐'),
    (['copper-sulfate'], '铜盐'),
    (['magnesium-chloride'], '氯化镁'),
    (['calcium-chloride', 'cacl2'], '氯化钙'),
    (['barium', 'baso4'], '钡盐'),
    (['cobalt', 'manganese', 'nickel'], '重金属盐'),
    (['copper-smelter', 'copper'], '铜冶炼'),
    # 行业应用
    (['hydrometallurg'], '湿法冶金'),
    (['metallurg'], '冶金'),
    (['mining', 'mine-', '-mine'], '矿山'),
    (['pharmaceutical', 'pharma'], '制药'),
    (['agrochemical', 'pesticide', 'herbicide'], '农药'),
    (['fertilizer'], '肥料'),
    (['electroplating', 'galvanic'], '电镀'),
    (['dyeing', 'textile', 'dye-'], '印染纺织'),
    (['pulp', 'paper-', '-paper'], '造纸'),
    (['semiconductor', 'electronics', 'pcb'], '电子半导体'),
    (['oil-industry', 'oil-and-gas', 'petrochemical', 'refinery', 'crude-oil'], '石油化工'),
    (['steel-industry', 'iron-and-steel', 'steel-mill'], '钢铁'),
    (['coal-chemical', 'coal-to', 'coal-mine'], '煤化工'),
    (['fly-ash', 'leachate', 'landfill'], '垃圾渗滤液/粉煤灰'),
    (['desalination', 'seawater', 'sea-water'], '海水淡化'),
    (['palm-oil', 'edible-oil', 'vegetable-oil'], '油脂'),
    (['sugar-beet', 'sugar-industry', 'sugar-'], '制糖'),
    (['starch', 'glucose', 'corn-'], '淀粉/葡萄糖'),
    (['dairy', 'milk', 'cheese', 'whey'], '乳制品'),
    (['brewery', 'brewing', 'beer', 'craft-beer', 'wort', 'hops', 'malt', 'fermenting-cellar'], '啤酒酿造'),
    (['wine', 'winery', 'winemaking'], '葡萄酒'),
    (['ethanol', 'biofuel', 'biodiesel', 'biogas', 'biomass'], '生物能源'),
    (['food-fermentation', 'food-processing', 'food-ingredient', 'food-safety'], '食品加工'),
    (['animal-protein', 'animal-byproduct', 'krill', 'fish', 'gelatin', 'collagen'], '动物蛋白'),
    (['vegetable-protein', 'soybean', 'plant-protein'], '植物蛋白'),
    (['beverage', 'juice', 'syrup', 'coffee', 'tea'], '饮料'),
    (['detergent', 'surfactant', 'soap'], '洗涤剂'),
    (['chlor-alkali', 'caustic', 'soda'], '氯碱'),
    (['pfas', 'arsenic', 'fluoride', 'boron', 'silica', 'phosphorus'], '特种污染物'),
    (['cooling-tower', 'boiler', 'district-heating', 'hvac'], '暖通/锅炉'),
    (['data-centre', 'data-center', 'datacenter'], '数据中心'),
    (['marine', 'ship', 'vessel', 'cargo', 'port'], '船舶海运'),
    (['ro-reject', 'ro-brine', 'reverse-osmosis', 'osmosis'], '反渗透'),
    (['zld', 'zero-liquid', 'minimal-liquid', 'mld'], 'ZLD零排放'),
    (['wastewater', 'waste-water', 'effluent', 'sewage'], '废水处理'),
    (['water-treatment', 'water-reuse', 'water-recovery', 'process-water', 'drinking-water', 'pure-water', 'ultrapure', 'deionized', 'softened'], '水处理'),
    (['chemical-industry', 'chemical-wastewater', 'chemical-plant', 'chemical-manufacturing'], '化工'),
    (['solvent', 'dmac', 'dmf', 'ethanol-recovery'], '溶剂回收'),
]

# 设备/工艺标签
EQUIP_TAGS = [
    (['mvr-evaporator', 'mvr-system', 'mvr-solution', 'mvr-technology'], 'MVR蒸发器'),
    (['mvr-compressor', 'centrifugal-compressor', 'roots-compressor', 'screw-compressor', 'vapor-recompression'], 'MVR压缩机/蒸汽再压缩'),
    (['falling-film-evaporator', 'falling-film'], '降膜蒸发器'),
    (['rising-film-evaporator', 'rising-film', 'raising-film'], '升膜蒸发器'),
    (['forced-circulation-evaporator', 'forced-circulation-crystallizer', 'forced-circulation'], '强制循环蒸发器/结晶器'),
    (['single-effect'], '单效蒸发器'),
    (['double-effect', 'two-effect'], '双效蒸发器'),
    (['triple-effect', 'three-effect'], '三效蒸发器'),
    (['multi-effect-evaporator', 'multi-effect-evaporation', 'mee-evaporator', 'mee-'], '多效蒸发器'),
    (['thin-film-evaporator', 'wiped-film', 'wiped-film-evaporator'], '薄膜/刮膜蒸发器'),
    (['dtb-crystallizer', 'dtb-'], 'DTB结晶器'),
    (['oslo-crystallizer', 'oslo-'], 'OSLO结晶器'),
    (['crystallizer', 'crystallization', 'crystallisation', 'crystalliz'], '结晶器/结晶'),
    (['evaporator', 'evaporative', 'evaporation'], '蒸发器'),
    (['evaporative-cooling', 'cooling-crystallization'], '蒸发冷却/冷却结晶'),
    (['spray-dryer', 'spray-drying', 'spray-dry'], '喷雾干燥'),
    (['dryer', 'drying', 'rotary-drum'], '干燥'),
    (['fluidized-bed'], '流化床'),
    (['heat-exchanger', 'plate-heat', 'shell-and-tube', 'compabloc', 'widegap', 'gphe', 'spiral-heat'], '换热器'),
    (['centrifuge', 'decanter', 'peeler', 'pusher', 'bactofuge', 'disk-stack'], '离心机'),
    (['separator', 'separation'], '分离器/分离技术'),
    (['filter-press', 'belt-filter', 'membrane-filter', 'rotary-filter', 'nutsche', 'ultrafiltration', 'microfiltration', 'nanofiltration'], '过滤/膜分离'),
    (['vacuum-pump', 'liquid-ring'], '真空泵'),
    (['condenser'], '冷凝器'),
    (['distillation'], '蒸馏'),
    (['ion-exchange', 'amberpack', 'adi-'], '离子交换'),
    (['membrane', 'ro-', 'reverse-osmosis'], '膜技术'),
    (['concentration', 'concentrate', 'concentrating'], '浓缩'),
    (['recovery', 'recycling', 'recover', 'recycle'], '回收'),
    (['crystal-size', 'crystal-growth', 'nucleation', 'supersaturation', 'crystal-'], '晶体工程'),
    (['skid-mounted', 'modular', 'pilot-plant', 'pilot-scale'], '撬装/模块化/中试'),
    (['compressor'], '压缩机'),
    (['pump', 'pumping'], '泵'),
    (['tank', 'vessel', 'reactor'], '容器/反应器'),
    (['cooling-tower'], '冷却塔'),
]

# 文章动作标签
ACTION_TAGS = [
    (['case-study', 'success-story', 'reference-case', 'reference-cases'], '案例'),
    (['project/', '/project', 'industry-challenges'], '项目案例'),
    (['how-to-choose', 'how-to-select', 'how-to-determine', 'selection-guide', 'buying-guide'], '选型指南'),
    (['how-much', 'how-many', 'cost-of', 'price-of', 'pricing', 'investment', 'opex', 'capex'], '成本/价格'),
    (['what-is', 'whats-a', 'principle', 'working-principle', 'how-does', 'how-do-', 'introduction', 'understanding', 'overview', 'basics', 'fundamentals', 'exploring', 'the-science', 'the-role', 'all-about'], '原理/科普'),
    (['guide-to', 'guide-for', 'ultimate-guide', 'tips', 'things-to-know', 'checklist'], '指南'),
    (['vs-', '-vs-', 'comparison', 'compare', 'which-is-better'], '对比'),
    (['energy-saving', 'energy-efficiency', 'reduce-energy', 'reduce-cost', 'cut-cost', 'payback', 'roi', 'energy-savings'], '节能/ROI'),
    (['cleaning', 'descale', 'scaling', 'fouling', 'corrosion', 'maintenance', 'material-selection', 'troubleshoot', 'anti-fouling', 'anti-scaling', 'anti-corrosion', 'spare-parts'], '运维/材料'),
    (['design', 'install'], '设计/安装'),
    (['custom', 'customized', 'turnkey'], '定制/交钥匙'),
    (['types-of', 'classification', 'types-'], '分类'),
    (['advantages', 'benefits', 'features', 'why-'], '优势/特点'),
    (['top-', 'best-', 'leading-', 'trusted-', 'manufacturers', 'suppliers'], 'TOP榜'),
]

# 特殊模式翻译
def translate_geo_seo(slug_lower):
    """翻译地理SEO格式 slug"""
    # top-N-XXX-manufacturers-in-LOCATION
    m = re.match(r'(top|best|leading|trusted|good|cheap|quality|reliable|professional|affordable)-(\d+)-(.+?)-(?:manufacturers?|suppliers?|companies|exporters?|brands?|makers?|factories?|dealers?|distributors?)(?:-in-(.+))?$', slug_lower)
    if m:
        adj_map = {'top': 'TOP', 'best': '最佳', 'leading': '领先', 'trusted': '值得信赖',
                   'good': '优质', 'cheap': '便宜', 'quality': '优质', 'reliable': '可靠',
                   'professional': '专业', 'affordable': '高性价比'}
        adj = adj_map.get(m.group(1), m.group(1).upper())
        n = m.group(2)
        product = extract_equipment(m.group(3))
        location = extract_geo(m.group(4)) if m.group(4) else ""
        if location:
            return f"{location}{product}{adj}{n}家制造商"
        return f"全球{product}{adj}{n}家制造商"
    return None

def extract_equipment(text):
    """从文本中提取设备中文名"""
    s = text.lower()
    equip_map = {
        'mvr-evaporator': 'MVR蒸发器', 'mvr': 'MVR蒸发器',
        'falling-film-evaporator': '降膜蒸发器', 'falling-film': '降膜蒸发器',
        'forced-circulation-evaporator': '强制循环蒸发器', 'forced-circulation': '强制循环蒸发器',
        'single-effect-evaporator': '单效蒸发器', 'single-effect': '单效蒸发器',
        'double-effect-evaporator': '双效蒸发器', 'double-effect': '双效蒸发器',
        'multi-effect-evaporator': '多效蒸发器', 'mee-evaporator': '多效蒸发器',
        'mee': '多效蒸发器',
        'dtb-crystallizer': 'DTB结晶器', 'dtb': 'DTB结晶器',
        'crystallizer': '结晶器', 'crystallization': '结晶',
        'evaporator': '蒸发器', 'evaporative': '蒸发',
        'cooling-tower': '冷却塔',
        'heat-exchanger': '换热器',
        'dryer': '干燥器', 'spray-dryer': '喷雾干燥器',
        'compressor': '压缩机',
        'vacuum-pump': '真空泵',
        'centrifuge': '离心机',
        'separator': '分离器',
        'crystal': '结晶',
    }
    # 按长度降序匹配（先匹配长词）
    for k in sorted(equip_map.keys(), key=len, reverse=True):
        if k in s:
            return equip_map[k]
    return text

def extract_geo(text):
    """提取地理位置中文名"""
    if not text:
        return ""
    s = text.lower()
    geo_map = {
        'china': '中国', 'shanghai': '上海', 'beijing': '北京',
        'usa': '美国', 'us-': '美国', 'america': '美国', 'houston': '休斯顿', 'texas': '德州',
        'uk': '英国', 'britain': '英国',
        'germany': '德国',
        'france': '法国', 'paris': '巴黎',
        'italy': '意大利',
        'spain': '西班牙',
        'australia': '澳大利亚', 'sydney': '悉尼', 'melbourne': '墨尔本',
        'india': '印度',
        'japan': '日本',
        'korea': '韩国',
        'vietnam': '越南', 'hanoi': '河内',
        'indonesia': '印尼', 'jakarta': '雅加达',
        'pakistan': '巴基斯坦', 'karachi': '卡拉奇', 'lahore': '拉合尔',
        'south-africa': '南非', 'johannesburg': '约翰内斯堡',
        'brazil': '巴西',
        'turkey': '土耳其',
        'saudi': '沙特', 'dubai': '迪拜', 'uae': '阿联酋',
        'malaysia': '马来西亚',
        'thailand': '泰国', 'bangkok': '曼谷',
        'russia': '俄罗斯',
        'europe': '欧洲', 'european': '欧洲',
        'asia': '亚洲',
        'middle-east': '中东',
        'africa': '非洲',
    }
    for k in sorted(geo_map.keys(), key=len, reverse=True):
        if k in s:
            return geo_map[k]
    return ""

def generate_zh_title(slug, type_num):
    """生成中文主题标签"""
    s = slug.lower().replace('_', '-').replace('/', '-')

    # 地理 SEO 特殊处理
    if type_num == 7:
        geo_zh = translate_geo_seo(s)
        if geo_zh:
            return geo_zh

    # 提取行业标签
    industry = ""
    for keywords, label in INDUSTRY_TAGS:
        for kw in keywords:
            if kw in s:
                industry = label
                break
        if industry:
            break

    # 提取设备标签
    equipment = ""
    for keywords, label in EQUIP_TAGS:
        for kw in keywords:
            if kw in s:
                equipment = label
                break
        if equipment:
            break

    # 提取动作标签
    action = ""
    for keywords, label in ACTION_TAGS:
        for kw in keywords:
            if kw in s:
                action = label
                break
        if action:
            break

    # 组合
    parts = [p for p in [industry, equipment, action] if p]
    if parts:
        return ''.join(parts)
    elif type_num == 1:
        # 如果是 Type 1 但没有标签，提取关键名词
        # 移除常见虚词
        stop_words = {'the', 'a', 'an', 'of', 'and', 'or', 'to', 'in', 'for',
                      'with', 'from', 'by', 'on', 'at', 'is', 'are', 'was', 'were',
                      'how', 'what', 'why', 'when', 'where', 'which', 'that', 'this',
                      'your', 'their', 'its', 'his', 'her', 'our', 'my',
                      'new', 'best', 'top', 'more', 'most', 'better',
                      'alfa', 'laval', 'spx', 'flow', 'gea', 'myande',
                      'samco', 'alaqua', 'toption', 'andritz'}
        words = [w for w in s.split('-') if w and len(w) > 2 and w not in stop_words]
        if words:
            # 取前5个词作为关键词
            return ' / '.join(w.capitalize() for w in words[:5])
        return ""

    return ""

def reclassify(slug, orig_type, old_type_num):
    """重新分类"""
    s = slug.lower()

    # 地理 SEO
    if re.search(r'(top|best|leading|trusted|good|cheap|quality|reliable|professional|affordable)-\d', s) \
       or re.search(r'-\d+-(manufacturers?|suppliers?|companies)', s) \
       or 'manufacturers-in' in s or 'suppliers-in' in s:
        return 7

    # FAQ/选型
    faq_kw = ['how-much', 'how-many', 'how-to-choose', 'how-to-select',
              'what-should', 'what-type', 'what-are', 'how-do-you',
              'how-does-it', 'common-problem', 'things-to-know', 'tips-for',
              'mistakes-to-avoid', 'do-you-need', 'do-i-need', 'best-way-to',
              'which-is-better', 'how-to-know', 'how-to-determine']
    for kw in faq_kw:
        if kw in s:
            return 3

    # What-Is/原理
    whatis_kw = ['what-is', 'working-principle', 'how-does', 'how-do-',
                 'how-to-use', 'how-to-operate', 'how-to-design',
                 'how-to-install', 'how-to-maintain', 'how-to-clean',
                 'how-to-improve', 'how-to-troubleshoot',
                 'introduction', 'understanding', 'understand-',
                 'overview', 'basics', 'fundamentals',
                 'guide-to', 'ultimate-guide',
                 'everything-you-need', 'all-about',
                 'types-of', 'classification',
                 'exploring', 'the-science', 'the-role',
                 'advantages-of', 'benefits-of', 'features-of',
                 'why-is', 'why-do', 'why-are', 'why-should']
    for kw in whatis_kw:
        if kw in s:
            return 2

    # 技术对比
    compare_kw = ['vs-', '-vs-', '-versus-', 'comparison', 'compare',
                  'cost-analysis', 'roi', 'payback', 'opex', 'capex',
                  'energy-saving', 'reduce-cost', 'reduce-energy',
                  'reduce-operating', 'cut-cost', 'cost-of', 'price-of',
                  'energy-savings']
    for kw in compare_kw:
        if kw in s:
            return 4

    # 运维/材料
    ope_kw = ['cleaning', 'descale', 'scaling', 'fouling', 'anti-fouling',
              'anti-scaling', 'corrosion', 'anti-corrosion',
              'material-selection', 'construction-material',
              'maintenance', 'troubleshoot', 'prevent-clogg',
              'operation-cost', 'energy-consumption', 'spare-parts',
              'clean-in-place', 'cip-']
    for kw in ope_kw:
        if kw in s:
            return 5

    # 解决方案/案例 - 大幅放宽条件
    # 1. 明确的案例标记
    if any(k in s for k in ['case-study', 'success-story', 'reference-case',
                            'project/', 'industry-challenges']):
        return 1

    # 2. 包含行业词
    for keywords, _ in INDUSTRY_TAGS:
        for kw in keywords:
            if kw in s:
                return 1

    # 3. 包含设备/工艺词
    for keywords, _ in EQUIP_TAGS:
        for kw in keywords:
            if kw in s:
                return 1

    # 4. 原来就是 Type 1 且 slug 较长（有内容）
    if old_type_num == 1 and len(s) > 15:
        return 1

    # 5. 原来就是 Type 2-6 且有实际内容
    if old_type_num in [2, 3, 4, 5] and len(s) > 10:
        return old_type_num

    return 8

# ==========================================
# 主流程
# ==========================================

print("=" * 60)
print("选题库二次精炼")
print("=" * 60)

# 读取 JSON
json_path = os.path.join(SCRIPT_DIR, "选题库_restructured.json")
with open(json_path, 'r', encoding='utf-8') as f:
    records = json.load(f)

print(f"读取 {len(records)} 条记录")

# 重新分类 + 生成中文
refined = []
for r in records:
    slug = r['slug']
    old_type = r.get('type_num', 0)

    # 重新分类
    new_type = reclassify(slug, r.get('type', ''), old_type)

    # 生成中文标题
    zh_title = generate_zh_title(slug, new_type)

    # 英文标题
    en_title = slug.replace('-', ' ').replace('/', ' ')
    en_title = ' '.join(w.capitalize() for w in en_title.split()[:15])

    refined.append({
        'type_num': new_type,
        'type': {1: '1-解决方案/案例', 2: '2-What-Is/原理', 3: '3-FAQ/选型',
                 4: '4-技术对比/ROI', 5: '5-运维/材料/节能',
                 7: '7-地理SEO', 8: '8-其他'}.get(new_type, '8-其他'),
        'industry': r.get('industry', ''),
        'slug': slug,
        'title_en': en_title[:150],
        'title_zh': zh_title[:150] if zh_title else '',
        'competitor': r.get('competitor', ''),
        'normalized': r.get('normalized', ''),
    })

# 统计
type_dist = Counter(r['type'] for r in refined)
has_zh = sum(1 for r in refined if r['title_zh'])
has_industry = sum(1 for r in refined if r['industry'])

print(f"\n按类型（重新分类后）:")
for t, c in sorted(type_dist.items()):
    pct = 100 * c // len(refined)
    print(f"  {t}: {c} ({pct}%)")

print(f"\n有中文主题: {has_zh} / {len(refined)} ({100*has_zh//len(refined)}%)")
print(f"有行业标注: {has_industry} / {len(refined)} ({100*has_industry//len(refined)}%)")

# 输出 JSON
out_json = os.path.join(SCRIPT_DIR, "选题库_refined.json")
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(refined, f, ensure_ascii=False, indent=2)
print(f"\nJSON: {out_json}")

# 输出样本 MD
out_md = os.path.join(SCRIPT_DIR, "选题库_refined_sample.md")
with open(out_md, 'w', encoding='utf-8') as f:
    f.write(f"# 选题库精炼样本（{len(refined)} 条）\n\n")
    f.write(f"## 统计\n\n")
    f.write(f"| 类型 | 数量 | 占比 |\n")
    f.write(f"|------|------|------|\n")
    for t, c in sorted(type_dist.items()):
        f.write(f"| {t} | {c} | {100*c//len(refined)}% |\n")

    f.write(f"\n## 样本预览\n\n")
    for type_name in sorted(set(r['type'] for r in refined)):
        type_records = [r for r in refined if r['type'] == type_name]
        if not type_records:
            continue
        f.write(f"### {type_name}（{len(type_records)} 条）\n\n")
        f.write(f"| 中文主题 | 行业 | 英文标题 | slug |\n")
        f.write(f"|----------|------|----------|------|\n")
        for r in type_records[:25]:
            zh = r['title_zh'] or '(待翻译)'
            ind = r['industry'] or '-'
            f.write(f"| {zh} | {ind} | {r['title_en'][:60]} | {r['slug'][:40]} |\n")
        f.write(f"\n")

print(f"MD样本: {out_md}")
print(f"\n{'=' * 60}")
