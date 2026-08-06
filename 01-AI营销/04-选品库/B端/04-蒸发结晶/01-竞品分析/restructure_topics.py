#!/usr/bin/env python3
"""
选题库重构脚本
1. 解析所有清洗 MD 文件
2. 删除品牌新闻类（展会/获奖/参观/邀请）
3. 智能分类（保守 Type 1，默认 Type 8）
4. 生成中文主题
5. 跨竞对去重
6. 输出 JSON + MD
"""

import re, json, os
from collections import Counter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# 1. 中英术语词典（~400 条）
# ==========================================

# 多词短语优先替换
MULTI_WORD = {
    'mechanical-vapor-recompression': 'MVR机械蒸汽再压缩',
    'mechanical-vapor-re-compression': 'MVR机械蒸汽再压缩',
    'falling-film-evaporator': '降膜蒸发器',
    'rising-film-evaporator': '升膜蒸发器',
    'forced-circulation-evaporator': '强制循环蒸发器',
    'forced-circulation-crystallizer': '强制循环结晶器',
    'single-effect-evaporator': '单效蒸发器',
    'double-effect-evaporator': '双效蒸发器',
    'triple-effect-evaporator': '三效蒸发器',
    'multi-effect-evaporator': '多效蒸发器',
    'multi-effect-evaporation': '多效蒸发',
    'thin-film-evaporator': '薄膜蒸发器',
    'wiped-film-evaporator': '刮膜蒸发器',
    'falling-film': '降膜',
    'rising-film': '升膜',
    'forced-circulation': '强制循环',
    'single-effect': '单效',
    'double-effect': '双效',
    'triple-effect': '三效',
    'multi-effect': '多效',
    'thin-film': '薄膜',
    'wiped-film': '刮膜',
    'mvr-evaporator': 'MVR蒸发器',
    'mee-evaporator': '多效蒸发器',
    'mvr-technology': 'MVR技术',
    'mvr-system': 'MVR系统',
    'mvr-solution': 'MVR解决方案',
    'mvr-compressor': 'MVR压缩机',
    'heat-exchanger': '换热器',
    'plate-heat-exchanger': '板式换热器',
    'vacuum-pump': '真空泵',
    'cooling-tower': '冷却塔',
    'spray-dryer': '喷雾干燥器',
    'spray-drying': '喷雾干燥',
    'fluidized-bed': '流化床',
    'crystallization-technology': '结晶技术',
    'evaporation-technology': '蒸发技术',
    'evaporation-crystallization': '蒸发结晶',
    'evaporative-crystallization': '蒸发结晶',
    'evaporative-cooling': '蒸发冷却',
    'cooling-crystallization': '冷却结晶',
    'wastewater-treatment': '废水处理',
    'water-treatment': '水处理',
    'water-reuse': '中水回用',
    'zero-liquid-discharge': '零排放',
    'minimal-liquid-discharge': '近零排放',
    'salt-recovery': '盐回收',
    'resource-recovery': '资源回收',
    'valuable-resource': '有价资源',
    'black-mass': '黑粉',
    'lithium-carbonate': '碳酸锂',
    'lithium-hydroxide': '氢氧化锂',
    'lithium-chloride': '氯化锂',
    'lithium-recovery': '锂回收',
    'battery-grade': '电池级',
    'battery-material': '电池材料',
    'battery-industry': '电池行业',
    'battery-recycling': '电池回收',
    'ev-battery': 'EV电池',
    'palm-oil': '棕榈油',
    'pulp-and-paper': '纸浆造纸',
    'coal-to-chemical': '煤化工',
    'oil-and-gas': '油气',
    'sea-water': '海水',
    'sea-water-desalination': '海水淡化',
    'high-salinity': '高盐',
    'high-cod': '高COD',
    'fly-ash': '粉煤灰',
    'leachate-treatment': '渗滤液处理',
    'ammonium-sulfate': '硫酸铵',
    'ammonium-chloride': '氯化铵',
    'ammonium-nitrate': '硝酸铵',
    'sodium-chloride': '氯化钠',
    'sodium-sulfate': '硫酸钠',
    'sodium-carbonate': '碳酸钠',
    'potassium-chloride': '氯化钾',
    'potassium-sulfate': '硫酸钾',
    'potassium-nitrate': '硝酸钾',
    'calcium-chloride': '氯化钙',
    'magnesium-chloride': '氯化镁',
    'copper-sulfate': '硫酸铜',
    'zinc-sulfate': '硫酸锌',
    'nickel-sulfate': '硫酸镍',
    'ferrous-sulfate': '硫酸亚铁',
    'iron-phosphate': '磷酸铁',
    'battery-ecosystem': '电池生态',
    'lithium-mother': '锂母液',
    'mother-liquid': '母液',
    'mother-liquor': '母液',
    'spent-solvent': '废溶剂',
    'spent-acid': '废酸',
    'spent-caustic': '废碱',
    'acid-recovery': '酸回收',
    'solvent-recovery': '溶剂回收',
    'dmac-recovery': 'DMAC回收',
    'dyeing-industry': '印染行业',
    'electroplating-wastewater': '电镀废水',
    'pharmaceutical-wastewater': '制药废水',
    'mining-wastewater': '矿山废水',
    'oil-industry': '石油行业',
    'steel-industry': '钢铁行业',
    'iron-and-steel': '钢铁',
    'sugar-industry': '制糖行业',
    'sugar-beet': '甜菜糖',
    'food-fermentation': '食品发酵',
    'agrochemical-wastewater': '农药废水',
    'pharmaceutical-industry': '制药行业',
    'chemical-industry': '化工行业',
    'chemical-wastewater': '化工废水',
    'coal-chemical': '煤化工',
    'reverse-osmosis': '反渗透',
    'ro-reject': '反渗透浓水',
    'ro-brine': '反渗透浓盐水',
    'vapor-recompression': '蒸汽再压缩',
    'thermal-compression': '热压缩',
    'heat-pump': '热泵',
    'waste-heat': '废热',
    'heat-recovery': '热回收',
    'energy-saving': '节能',
    'energy-efficiency': '能效',
    'energy-consumption': '能耗',
    'operating-cost': '运行成本',
    'operation-cost': '运行成本',
    'capital-cost': '投资成本',
    'total-cost': '总成本',
    'life-cycle': '全生命周期',
    'case-study': '案例研究',
    'success-story': '成功案例',
    'reference-case': '参考案例',
    'project-case': '项目案例',
    'how-to-choose': '如何选型',
    'how-to-select': '如何选型',
    'how-to-design': '如何设计',
    'how-to-operate': '如何运行',
    'how-to-reduce': '如何降低',
    'how-to-prevent': '如何防止',
    'how-to-clean': '如何清洗',
    'how-to-use': '如何使用',
    'how-to-improve': '如何提升',
    'what-is-the': '什么是',
    'how-much-does': '多少钱',
    'how-long-does': '多长时间',
    'best-way-to': '最佳方法',
    'common-problem': '常见问题',
    'common-mistake': '常见错误',
    'buying-guide': '采购指南',
    'price-guide': '价格指南',
    'selection-guide': '选型指南',
    'design-guide': '设计指南',
    'installation-guide': '安装指南',
    'maintenance-guide': '维护指南',
    'troubleshooting': '故障排除',
    'spare-parts': '备件',
    'after-sales': '售后',
    'turnkey-solution': '交钥匙方案',
    'turnkey-project': '交钥匙项目',
    'skid-mounted': '撬装',
    'modular-design': '模块化设计',
    'pilot-plant': '中试装置',
    'pilot-scale': '中试规模',
    'industrial-scale': '工业规模',
    'large-scale': '大规模',
    'continuous-production': '连续生产',
    'batch-production': '间歇生产',
    'automatic-control': '自动控制',
    'plc-control': 'PLC控制',
    'remote-monitoring': '远程监控',
    'iot-based': '物联网',
    'smart-manufacturing': '智能制造',
    'industry-4': '工业4.0',
    'sustainable-development': '可持续发展',
    'environmental-protection': '环保',
    'circular-economy': '循环经济',
    'carbon-neutral': '碳中和',
    'carbon-footprint': '碳足迹',
    'environmental-compliance': '环保达标',
    'discharge-standard': '排放标准',
    'water-intake': '取水',
    'boiler-makeup': '锅炉补给水',
    'process-water': '工艺水',
    'pure-water': '纯水',
    'ultrapure-water': '超纯水',
    'drinking-water': '饮用水',
    'deionized-water': '去离子水',
    'softened-water': '软化水',
    'oil-separation': '油水分离',
    'oil-removal': '除油',
    'cod-removal': 'COD去除',
    'bod-removal': 'BOD去除',
    'ammonia-removal': '氨氮去除',
    'heavy-metal': '重金属',
    'heavy-metal-removal': '重金属去除',
    'silica-removal': '硅去除',
    'scaling-prevention': '防垢',
    'anti-scaling': '阻垢',
    'corrosion-prevention': '防腐',
    'anti-corrosion': '防腐',
    'material-selection': '材料选择',
    'construction-material': '构造材料',
    'stainless-steel': '不锈钢',
    'duplex-steel': '双相钢',
    'titanium': '钛',
    'hastelloy': '哈氏合金',
    'frp': '玻璃钢',
    'pp': '聚丙烯',
    'pvdf': 'PVDF',
    'ptfe': '聚四氟乙烯',
    'epoxy': '环氧树脂',
    'rubber-lining': '橡胶衬里',
    'centrifugal-compressor': '离心式压缩机',
    'roots-compressor': '罗茨压缩机',
    'screw-compressor': '螺杆压缩机',
    'axial-compressor': '轴流压缩机',
    'positive-displacement': '容积式',
    'rotary-drum': '转鼓',
    'disk-stack': '碟片式',
    'decanter-centrifuge': '卧螺离心机',
    'peeler-centrifuge': '刮刀离心机',
    'pusher-centrifuge': '推料离心机',
    'basket-centrifuge': '三足离心机',
    'membrane-filter': '膜过滤',
    'filter-press': '压滤机',
    'belt-filter': '带式过滤机',
    'rotary-filter': '转鼓过滤机',
    'nutsche-filter': '吸滤器',
    'crystallizer-design': '结晶器设计',
    'crystal-size': '晶体粒径',
    'crystal-growth': '晶体生长',
    'nucleation': '成核',
    'supersaturation': '过饱和',
    'metastable-zone': '介稳区',
    'residence-time': '停留时间',
    'mvr-evaporator-vs': 'MVR蒸发器对比',
    'evaporator-vs': '蒸发器对比',
    'crystallizer-vs': '结晶器对比',
    'mvr-vs': 'MVR对比',
    'tube-sheet': '管板',
    'plate-frame': '板框',
    'shell-and-tube': '管壳式',
    'air-cooled': '空冷',
    'water-cooled': '水冷',
    'dry-running': '干式运行',
    'liquid-ring': '液环',
    'injection-molding': '注塑',
    'blow-molding': '吹塑',
    'extrusion': '挤出',
    'reaction-crystallization': '反应结晶',
    'reactive-crystallization': '反应结晶',
    'cooling-tower': '冷却塔',
    'wet-cooling': '湿式冷却',
    'dry-cooling': '干式冷却',
    'hybrid-cooling': '混合冷却',
    'ammonia-crystallization': '铵盐结晶',
    'salt-crystallization': '盐结晶',
    'sugar-crystallization': '糖结晶',
}

# 单词替换
SINGLE_WORD = {
    'mvr': 'MVR', 'mee': '多效', 'zld': 'ZLD', 'mld': '近ZLD',
    'dtb': 'DTB', 'oslo': 'OSLO', 'cct': 'CCT',
    'evaporator': '蒸发器', 'evaporators': '蒸发器',
    'crystallizer': '结晶器', 'crystallizers': '结晶器',
    'crystallization': '结晶', 'crystallisation': '结晶',
    'evaporation': '蒸发', 'evaporative': '蒸发式',
    'evaporator-crystallizer': '蒸发结晶器',
    'dryer': '干燥器', 'dryers': '干燥器', 'drying': '干燥',
    'crystal': '晶体', 'crystals': '晶体',
    'compressor': '压缩机', 'compressors': '压缩机',
    'centrifugal': '离心式',
    'pump': '泵', 'pumps': '泵',
    'vacuum': '真空',
    'condenser': '冷凝器',
    'separator': '分离器',
    'filter': '过滤器', 'filtration': '过滤',
    'centrifuge': '离心机',
    'tank': '罐', 'vessel': '容器',
    'system': '系统', 'systems': '系统',
    'plant': '工厂', 'equipment': '设备',
    'machine': '机器', 'technology': '技术',
    'process': '工艺', 'solution': '方案',
    'project': '项目', 'application': '应用',
    'industrial': '工业', 'industry': '行业',
    'commercial': '商业',
    'lithium': '锂', 'battery': '电池', 'batteries': '电池',
    'mining': '矿业', 'mine': '矿山',
    'pharmaceutical': '制药', 'pharma': '制药',
    'food': '食品', 'beverage': '饮料',
    'sugar': '糖', 'starch': '淀粉',
    'chemical': '化工', 'chemicals': '化工',
    'oil': '石油', 'gas': '天然气',
    'steel': '钢铁', 'coal': '煤',
    'dairy': '乳制品', 'brewery': '啤酒', 'brewing': '酿造',
    'ethanol': '乙醇', 'solvent': '溶剂',
    'textile': '纺织', 'dye': '染料', 'dyeing': '印染',
    'pulp': '纸浆', 'paper': '纸',
    'semiconductor': '半导体',
    'fertilizer': '肥料', 'agrochemical': '农药',
    'desalination': '海水淡化', 'seawater': '海水',
    'water': '水', 'wastewater': '废水',
    'treatment': '处理', 'purification': '提纯',
    'recovery': '回收', 'recycling': '回收',
    'concentration': '浓缩', 'separation': '分离',
    'distillation': '蒸馏',
    'discharge': '排放', 'effluent': '出水',
    'brine': '卤水', 'salinity': '盐度', 'salt': '盐',
    'sodium': '钠', 'potassium': '钾', 'ammonium': '铵',
    'calcium': '钙', 'magnesium': '镁',
    'nickel': '镍', 'zinc': '锌', 'copper': '铜',
    'cobalt': '钴', 'manganese': '锰', 'barium': '钡',
    'iron': '铁', 'aluminum': '铝',
    'sulfate': '硫酸盐', 'sulfite': '亚硫酸盐',
    'chloride': '氯化物', 'carbonate': '碳酸盐',
    'nitrate': '硝酸盐', 'phosphate': '磷酸盐',
    'hydroxide': '氢氧化物', 'oxide': '氧化物',
    'acid': '酸', 'alkali': '碱', 'caustic': '烧碱',
    'membrane': '膜', 'osmosis': '渗透',
    'ion-exchange': '离子交换', 'ro': 'RO',
    'energy': '能', 'power': '电力',
    'steam': '蒸汽', 'boiler': '锅炉',
    'heat': '热', 'cooling': '冷却', 'heating': '加热',
    'boiling': '沸腾',
    'thermal': '热力', 'electric': '电动',
    'mechanical': '机械',
    'operation': '运行', 'operating': '运行',
    'maintenance': '维护', 'cleaning': '清洗',
    'scaling': '结垢', 'fouling': '污垢',
    'corrosion': '腐蚀', 'erosion': '侵蚀',
    'material': '材料', 'stainless': '不锈钢',
    'cost': '成本', 'price': '价格', 'pricing': '定价',
    'quality': '质量', 'efficiency': '效率',
    'capacity': '产能', 'production': '生产',
    'performance': '性能', 'optimization': '优化',
    'design': '设计', 'selection': '选型',
    'installation': '安装', 'commissioning': '调试',
    'manufacturing': '制造', 'manufacturer': '制造商',
    'suppliers': '供应商', 'factory': '工厂',
    'company': '公司', 'brand': '品牌',
    'guide': '指南', 'principle': '原理',
    'introduction': '介绍', 'overview': '概述',
    'types': '类型', 'classification': '分类',
    'comparison': '对比', 'vs': '对比',
    'advantage': '优势', 'disadvantage': '劣势',
    'benefit': '优势', 'feature': '特点',
    'working': '工作', 'function': '功能',
    'control': '控制', 'monitoring': '监控',
    'safety': '安全', 'environmental': '环保',
    'sustainable': '可持续', 'green': '绿色',
    'resources': '资源', 'resource': '资源',
    'circular': '循环', 'carbon': '碳',
    'scale': '规模', 'large': '大型', 'small': '小型',
    'compact': '紧凑', 'portable': '便携',
    'automatic': '自动', 'manual': '手动',
    'continuous': '连续', 'batch': '间歇',
    'high': '高', 'low': '低',
    ' advanced': '先进',
    'new': '新', 'modern': '现代',
    'custom': '定制', 'standard': '标准',
    'modular': '模块化', 'skid': '撬装',
    'turnkey': '交钥匙',
    'pilot': '中试', 'lab': '实验室',
    'industrial': '工业', 'commercial': '商业',
}

# 地理关键词（用于提取地理位置）
GEO_KEYWORDS = {
    'china': '中国', 'chinese': '中国',
    'usa': '美国', 'america': '美国', 'us': '美国',
    'uk': '英国', 'britain': '英国',
    'germany': '德国', 'german': '德国',
    'france': '法国', 'paris': '巴黎',
    'italy': '意大利', 'italian': '意大利',
    'spain': '西班牙', 'spanish': '西班牙',
    'australia': '澳大利亚', 'sydney': '悉尼',
    'india': '印度', 'indian': '印度',
    'japan': '日本', 'japanese': '日本',
    'korea': '韩国', 'vietnam': '越南', 'hanoi': '河内',
    'indonesia': '印度尼西亚', 'jakarta': '雅加达',
    'pakistan': '巴基斯坦', 'karachi': '卡拉奇', 'lahore': '拉合尔',
    'south-africa': '南非', 'johannesburg': '约翰内斯堡',
    'brazil': '巴西',
    'turkey': '土耳其',
    'saudi': '沙特',
    'malaysia': '马来西亚',
    'thailand': '泰国',
    'russia': '俄罗斯',
    'houston': '休斯顿', 'texas': '德州',
    'shanghai': '上海', 'beijing': '北京',
    'europe': '欧洲', 'european': '欧洲',
    'asia': '亚洲', 'asian': '亚洲',
    'middle-east': '中东',
    'africa': '非洲',
    'latin': '拉美',
}

# ==========================================
# 2. 品牌新闻删除规则
# ==========================================

DELETE_PATTERNS = [
    'expo', 'exhibition', 'fair', 'show-', '-show', 'trade-show',
    'visit', 'welcome', 'welcomed', 'welcomes', 'welcoming',
    'booth', 'invitation', 'invite',
    'attending', 'attend', 'participate', 'participating',
    'meet-at', 'meet-us', 'lets-meet', 'see-you',
    'award', 'wins', 'win-', 'winning', 'won',
    'quality-wins', 'quality-win',
    'signed', 'signing', 'contract-sign',
    'partner', 'partnership',
    'debuts', 'debut', 'landing', 'launched',
    'factory-inspection', 'pre-shipment',
    'customer-visit', 'client-visit',
    'inspection', 'fat-', 'fat-of',
    'open-house', 'groundbreaking', 'ribbon',
    'milestone', 'anniversary', 'celebration', 'celebrates',
    'promoted', 'promotion', 'campaign',
    'hiring', 'career', 'job',
    'newsletter', 'magazine', 'brochure',
    'conference', 'summit', 'forum', 'webinar',
    'press-release', 'media',
    'gift', 'giveaway',
    'season-greeting', 'happy-new-year', 'merry-christmas',
    'black-friday', 'cyber-monday',
]

# 不删除的例外（即使包含上述关键词也保留）
DELETE_EXCEPTIONS = [
    'success-story', 'case-study', 'project/',
    'reference-case', 'reference-cases',
    'industry-challenges',
]

# ==========================================
# 3. MD 文件解析器
# ==========================================

def parse_alfalaval_file(filepath):
    """格式: - slug 在 ### 类型 N 标题下，竞对在 ## XXX 全量 slug 标题下"""
    records = []
    current_comp = ""
    current_type = 0

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # 检测竞对
            m = re.match(r'^##\s+(.+?)\s+(?:全量|slug|分类)', line)
            if m:
                comp_raw = m.group(1).strip()
                comp_map = {'Alfa Laval': 'Alfa Laval', 'SPX Flow': 'SPX Flow',
                           'GEA': 'GEA', 'Myande': 'Myande'}
                for k, v in comp_map.items():
                    if k.lower() in comp_raw.lower():
                        current_comp = v
                        break
                continue
            # 检测类型
            m = re.match(r'^###\s+类型\s*(\d)', line)
            if m:
                current_type = int(m.group(1))
                continue
            # 提取 slug
            m = re.match(r'^-\s+(.+)', line)
            if m and current_comp:
                slug = m.group(1).strip().strip('`')
                # 跳过注释和空行
                if slug and not slug.startswith('#') and len(slug) > 2:
                    # 去掉行内注释
                    slug = slug.split(' #')[0].split('\t#')[0].strip()
                    if slug:
                        records.append({
                            'competitor': current_comp,
                            'slug': slug,
                            'orig_type': current_type,
                        })
    return records

def parse_samco_file(filepath):
    """格式: - `slug` 在 ### Cat N 标题下，竞对在 ## XXX 标题下"""
    records = []
    current_comp = ""
    current_type = 0
    comp_names = ['SAMCO', 'Alaqua', 'Toption', 'ENCO', 'ASOS', 'Condorchem']

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # 检测竞对（## 开头，含已知名称）
            for name in comp_names:
                if line.startswith('## ') and name.lower() in line.lower():
                    current_comp = name
                    break
            # 检测类型
            m = re.match(r'^###\s+Cat\s*(\d)', line)
            if m:
                current_type = int(m.group(1))
                continue
            # 提取 slug（带反引号）
            m = re.match(r'^-\s+`(.+?)`', line)
            if m and current_comp:
                slug = m.group(1).strip()
                if slug and len(slug) > 2:
                    records.append({
                        'competitor': current_comp,
                        'slug': slug,
                        'orig_type': current_type,
                    })
                continue
            # 提取 slug（不带反引号）
            m = re.match(r'^-\s+(.+)', line)
            if m and current_comp:
                slug = m.group(1).strip().strip('`')
                if slug and len(slug) > 2 and not slug.startswith('**') and not slug.startswith('|'):
                    slug = slug.split(' #')[0].split('\t')[0].strip()
                    if slug and len(slug) > 2:
                        records.append({
                            'competitor': current_comp,
                            'slug': slug,
                            'orig_type': current_type,
                        })
    return records

def parse_zhongxiao_file(filepath):
    """格式: slug + # Chinese comment 在代码块中，### 类型N 标题"""
    records = []
    current_comp = ""
    current_type = 0
    in_code_block = False
    comp_map = {
        'Zewatech': 'Zewatech', 'Shachi': 'Shachi', 'Goldfinch': 'Goldfinch',
        'Ion Exchange': 'Ion Exchange', 'Swenson': 'Swenson',
        '敏杰': '敏杰', '嘉泰': '嘉泰', 'Ace': 'Ace', 'MKS': 'MKS',
    }

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            stripped = line.strip()
            # 检测竞对
            for k, v in comp_map.items():
                if stripped.startswith('## ') and k.lower() in stripped.lower() and '类型' not in stripped:
                    current_comp = v
                    break
            # 检测类型
            m = re.match(r'^###\s+类型\s*(\d)', stripped)
            if m:
                current_type = int(m.group(1))
                continue
            # 代码块
            if stripped.startswith('```'):
                in_code_block = not in_code_block
                continue
            # 在代码块中提取 slug
            if in_code_block and current_comp and stripped and not stripped.startswith('#'):
                # 格式: slug  # Chinese comment
                parts = stripped.split('#')
                slug = parts[0].strip()
                if slug and len(slug) > 2 and not slug.startswith('|') and not slug.startswith('---'):
                    # 取中文注释（如果有）
                    zh_hint = parts[1].strip() if len(parts) > 1 else ''
                    records.append({
                        'competitor': current_comp,
                        'slug': slug,
                        'orig_type': current_type,
                        'zh_hint': zh_hint,
                    })
                continue
            # 非代码块的 slug 行
            if not in_code_block and current_comp:
                m = re.match(r'^-\s+(.+)', stripped)
                if m:
                    slug_raw = m.group(1).strip().strip('`')
                    parts = slug_raw.split('#')
                    slug = parts[0].strip()
                    if slug and len(slug) > 2:
                        records.append({
                            'competitor': current_comp,
                            'slug': slug,
                            'orig_type': current_type,
                        })
    return records

def parse_yuanbaogao_file(filepath):
    """格式: 代码块中的裸 slug，### 类型N 标题，## 一、XXX 竞对标题"""
    records = []
    current_comp = ""
    current_type = 0
    in_code_block = False
    comp_map = {
        'ANDRITZ': 'ANDRITZ', 'Saltworks': 'Saltworks', 'EBNER': 'EBNER',
        'Sunevap': 'Sunevap', 'Vanoo': 'Vanoo', 'Enchem': 'Enchem',
    }

    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            stripped = line.strip()
            # 检测竞对
            for k, v in comp_map.items():
                if k in stripped and (stripped.startswith('## ') or '##'.startswith(stripped[:2])):
                    current_comp = v
                    break
            # 检测类型
            m = re.match(r'^###\s+类型\s*(\d)', stripped)
            if m:
                current_type = int(m.group(1))
                continue
            # 代码块
            if stripped.startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block and current_comp and stripped and not stripped.startswith('|'):
                slug = stripped.split('#')[0].strip()
                if slug and len(slug) > 2 and not slug.startswith('---') and not slug.startswith('|'):
                    records.append({
                        'competitor': current_comp,
                        'slug': slug,
                        'orig_type': current_type,
                    })
    return records

def parse_supplement_file(filepath):
    """格式: - Competitor | Type | Industry | slug"""
    records = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            stripped = line.strip()
            if not stripped.startswith('- '):
                continue
            content = stripped[2:].strip()
            parts = [p.strip() for p in content.split('|')]
            if len(parts) >= 4:
                comp = parts[0]
                type_str = parts[1]
                industry = parts[2]
                slug = parts[3]
                if slug and len(slug) > 2:
                    # 提取类型号
                    m = re.match(r'(\d)', type_str)
                    orig_type = int(m.group(1)) if m else 0
                    records.append({
                        'competitor': comp,
                        'slug': slug,
                        'orig_type': orig_type,
                        'industry_hint': industry,
                    })
    return records

# ==========================================
# 4. 品牌新闻删除
# ==========================================

def should_delete(slug):
    """判断是否为品牌新闻类（应删除）"""
    s = slug.lower()
    # 例外：保留案例研究类
    for ex in DELETE_EXCEPTIONS:
        if ex in s:
            return False
    # 匹配删除模式
    for pattern in DELETE_PATTERNS:
        if pattern in s:
            return True
    return False

# ==========================================
# 5. 智能分类
# ==========================================

TYPE_NAMES = {
    1: "1-解决方案/案例",
    2: "2-What-Is/原理",
    3: "3-FAQ/选型",
    4: "4-技术对比/ROI",
    5: "5-运维/材料/节能",
    7: "7-地理SEO",
    8: "8-其他",
}

def classify_slug(slug):
    """智能分类，返回 (type_num, industry, confidence)"""
    s = slug.lower()

    # === 类型7: 地理 SEO ===
    if re.search(r'(top|best|leading|trusted|good|cheap|affordable|professional|reliable|quality|find|where|looking-for)-\d', s) \
       or re.search(r'-\d+-(manufacturers?|suppliers?|companies|exporters?|brands?|makers?|factories?|dealers?|distributors?)', s) \
       or 'manufacturers-in' in s or 'suppliers-in' in s:
        return 7, "", "high"

    # === 类型3: FAQ/选型 ===
    faq_kw = ['how-much', 'how-many', 'how-to-choose', 'how-to-select',
              'what-book', 'what-should', 'what-type', 'what-are',
              'how-do-you', 'how-does', 'how-to-know', 'how-to-determine',
              'how-to-identify', 'common-problem', 'common-mistake',
              'things-to-know', 'tips-for', 'mistakes-to-avoid',
              'do-you-need', 'do-i-need', 'is-it-worth',
              'best-way-to', 'which-is-better']
    for kw in faq_kw:
        if kw in s:
            return 3, "", "high"

    # === 类型2: What-Is/原理 ===
    whatis_kw = ['what-is', 'whats-a', 'what-are', 'what-is-the',
                 'working-principle', 'how-does-it-work', 'how-do-',
                 'how-to-use', 'how-to-operate', 'how-to-design',
                 'how-to-install', 'how-to-maintain', 'how-to-clean',
                 'how-to-improve', 'how-to-troubleshoot',
                 'introduction-to', 'understanding', 'understand-',
                 'overview-of', 'basics-of', 'fundamentals',
                 'guide-to', 'guide-for', 'ultimate-guide',
                 'everything-you-need-to-know', 'all-about',
                 'types-of', 'classification-of', 'exploring',
                 'the-science-of', 'the-role-of', 'the-benefits-of',
                 'why-is', 'why-do', 'why-are', 'why-should',
                 'advantages-of', 'benefits-of', 'features-of']
    for kw in whatis_kw:
        if kw in s:
            return 2, "", "high"

    # === 类型4: 技术对比/ROI ===
    compare_kw = ['vs-', '-vs-', '-versus-', 'comparison', 'compare',
                  'cost-analysis', 'roi', 'payback', 'opex', 'capex',
                  'pricing', 'energy-saving', 'reduce-cost',
                  'reduce-energy', 'reduce-operating', 'cut-cost',
                  'cost-of', 'price-of']
    for kw in compare_kw:
        if kw in s:
            return 4, "", "high"

    # === 类型5: 运维/材料/节能 ===
    ope_kw = ['cleaning', 'descale', 'descaling', 'scaling', 'fouling',
              'anti-fouling', 'anti-scaling', 'corrosion', 'anti-corrosion',
              'material-selection', 'construction-material', 'stainless-steel',
              'maintenance', 'troubleshoot', 'prevent-clogg',
              'boiling-point', 'condensate', 'inlet-temperature',
              'compressor-selection', 'vacuum-pump-selection',
              'operation-cost', 'energy-consumption', 'power-consumption',
              'clean-in-place', 'cip-', 'desupersaturation']
    for kw in ope_kw:
        if kw in s:
            return 5, "", "medium"

    # === 类型1: 解决方案/案例 ===
    # 必须包含行业关键词 AND (工艺关键词 OR 设备关键词)
    INDUSTRY_KW = [
        'lithium', 'battery', 'batteries', 'lioh', 'li2co3', 'licl', 'black-mass',
        'potassium', 'sodium', 'ammonium', 'nickel', 'zinc', 'copper', 'cobalt',
        'manganese', 'magnesium', 'calcium', 'barium', 'iron', 'aluminum',
        'mining', 'mine', 'pharmaceutical', 'pharma', 'food', 'sugar', 'starch',
        'chemical', 'oil', 'gas', 'steel', 'coal', 'dairy', 'brewery', 'brewing',
        'ethanol', 'solvent', 'textile', 'dye', 'dyeing', 'pulp', 'paper',
        'semiconductor', 'fertilizer', 'agrochemical', 'desalination', 'seawater',
        'sea-water', 'wastewater', 'waste-water', 'effluent', 'brine',
        'fly-ash', 'leachate', 'landfill', 'electroplating',
        'hydrometallurg', 'metallurg', 'palm-oil', 'beer', 'wine', 'winery',
        'circular-economy', 'coal-chemical', 'coal-to',
        'sulfate', 'chloride', 'carbonate', 'nitrate', 'phosphate',
        'hydroxide', 'acid', 'alkali', 'caustic', 'detergent',
        'osmosis', 'ro-reject', 'ro-brine', 'boiler', 'cooling-tower',
        'fermentation', 'biogas', 'biodiesel', 'biofuel',
        'animal-protein', 'animal-byproduct', 'starch', 'glucose',
        'vegetable-protein', 'soybean', 'corn', 'wheat',
        'chlor-alkali', 'arsenic', 'fluoride', 'silica',
        'pfas', 'phosphorus', 'boron', 'nitrate',
    ]
    PROCESS_KW = [
        'evaporat', 'crystalli', 'crystalliz', 'concentr', 'dry', 'drying',
        'distillat', 'separat', 'filtrat', 'precipitat', 'extract',
        'recover', 'recycl', 'reuse', 'discharge', 'treatm',
        'purif', 'desalinat', 'deioniz', 'soften',
        'zero-liquid', 'zld', 'mld',
        'mvr', 'mee', 'dtb', 'oslo',
        'spray-dry', 'fluidized-bed', 'cooling-tower',
        'evaporative-cool', 'cooling-crystalli',
        'falling-film', 'rising-film', 'forced-circulation',
        'thin-film', 'wiped-film',
        'single-effect', 'double-effect', 'multi-effect', 'triple-effect',
        'membrane', 'ion-exchange', 'reverse-osmosis',
        'plate-heat', 'shell-and-tube',
        'wash', 'leach', 'crystalliz',
        'deposits', 'scaling', 'fouling', 'corrosion',
    ]

    has_industry = any(k in s for k in INDUSTRY_KW)
    has_process = any(k in s for k in PROCESS_KW)

    # case-study / project / success-story 明确是案例
    if any(k in s for k in ['case-study', 'success-story', 'reference-case',
                            'project/', '/project']):
        if has_industry:
            return 1, infer_industry(s), "high"
        else:
            # 案例 slug 但无明确行业词，从 slug 其他部分推断
            return 1, "", "medium"

    # 行业 + 工艺都有 → 高置信度 Type 1
    if has_industry and has_process:
        return 1, infer_industry(s), "high"

    # 只有行业或只有工艺，且 slug 较长（>30字符，说明有足够上下文）
    if (has_industry or has_process) and len(s) > 30:
        ind = infer_industry(s) if has_industry else ""
        return 1, ind, "medium"

    # === 默认: Type 8 ===
    return 8, "", "low"

def infer_industry(slug_lower):
    """从 slug 推断行业"""
    industry_map = [
        # (keywords, industry_name) — 顺序很重要，先匹配具体的
        (['lithium', 'lioh', 'li2co3', 'licl', 'lithium-carbonate', 'lithium-hydroxide'], '锂盐'),
        (['battery', 'batteries', 'ev-battery', 'battery-grade', 'battery-material', 'battery-recycling', 'black-mass'], '锂电池'),
        (['hydrometallurg'], '湿法冶金'),
        (['potassium', 'kcl', 'k2so4', 'sop', 'potash'], '钾肥'),
        (['sodium', 'nacl', 'na2so4', 'na2co3', 'soda-ash'], '钠盐'),
        (['ammonium', 'nh4'], '铵盐'),
        (['nickel', 'cobalt', 'manganese'], '重金属盐'),
        (['zinc'], '锌盐'),
        (['copper'], '铜盐'),
        (['magnesium'], '镁盐'),
        (['calcium', 'gypsum'], '钙盐'),
        (['barium'], '钡盐'),
        (['iron-phosphate', 'fepo4'], '磷酸铁'),
        (['pharmaceutical', 'pharma'], '制药'),
        (['food', 'sugar', 'starch', 'dairy', 'glucose', 'beet', 'fermentation'], '食品'),
        (['brewery', 'brewing', 'beer', 'wine', 'winery'], '酿酒'),
        (['chemical', 'detergent'], '化工'),
        (['dye', 'dyeing', 'textile'], '印染'),
        (['oil', 'gas', 'petroleum', 'refinery'], '油气'),
        (['steel', 'iron-and-steel', 'metallurg'], '钢铁'),
        (['coal', 'fly-ash'], '煤化工'),
        (['leachate', 'landfill'], '垃圾渗滤液'),
        (['electroplating'], '电镀'),
        (['semiconductor', 'electronics'], '电子'),
        (['fertilizer', 'agrochemical'], '农化'),
        (['mining', 'mine'], '矿山'),
        (['desalination', 'seawater', 'sea-water'], '海水淡化'),
        (['zld', 'zero-liquid', 'mld', 'minimal-liquid'], 'ZLD零排放'),
        (['wastewater', 'waste-water', 'effluent'], '废水处理'),
        (['pulp', 'paper'], '造纸'),
        (['palm-oil'], '油脂'),
        (['ethanol', 'solvent'], '溶剂'),
        (['biogas', 'biofuel', 'biodiesel'], '生物能源'),
        (['animal-protein', 'animal-byproduct'], '动物蛋白'),
        (['vegetable-protein', 'soybean'], '植物蛋白'),
        (['osmosis', 'ro-reject', 'ro-brine'], '反渗透浓水'),
        (['boiler', 'cooling-tower', 'process-water'], '工业水处理'),
    ]

    for keywords, industry in industry_map:
        for kw in keywords:
            if kw in slug_lower:
                return industry
    return ""

# ==========================================
# 6. 中文翻译引擎
# ==========================================

def translate_slug(slug):
    """将 slug 翻译为中文主题"""
    s = slug.lower().replace('_', '-')

    # 处理特殊模式
    # 模式1: top-N-XXX-manufacturers-in-LOCATION
    m = re.match(r'(top|best|leading|trusted|good)-(\d+)-(.+)-manufacturers?-in-(.+)', s)
    if m:
        adj = {'top': '排名前', 'best': '最佳', 'leading': '领先',
               'trusted': '值得信赖的', 'good': '优质'}
        adj_zh = adj.get(m.group(1), m.group(1))
        n = m.group(2)
        product = translate_terms(m.group(3))
        location = translate_geo(m.group(4))
        return f"{location}{adj_zh}{n}家{product}制造商"

    # 模式2: top-N-XXX-manufacturers (无地点)
    m = re.match(r'(top|best|leading)-(\d+)-(.+)-manufacturers?', s)
    if m:
        adj = {'top': '排名前', 'best': '最佳', 'leading': '领先'}
        adj_zh = adj.get(m.group(1), m.group(1))
        n = m.group(2)
        product = translate_terms(m.group(3))
        return f"全球{adj_zh}{n}家{product}制造商"

    # 模式3: what-is-XXX
    m = re.match(r'what[ -]is[ -](.+)', s)
    if m:
        rest = translate_terms(m.group(1))
        return f"什么是{rest}"

    # 模式4: how-to-XXX
    m = re.match(r'how[ -]to[ -](.+)', s)
    if m:
        rest = translate_terms(m.group(1))
        return f"如何{rest}"

    # 模式5: why-XXX
    m = re.match(r'why[ -](.+)', s)
    if m:
        rest = translate_terms(m.group(1))
        return f"为什么{rest}"

    # 模式6: XXX-vs-YYY
    if '-vs-' in s or '-versus-' in s:
        parts = re.split(r'-vs-|-versus-', s)
        left = translate_terms(parts[0]) if parts[0] else ""
        right = translate_terms(parts[1]) if len(parts) > 1 else ""
        return f"{left}与{right}对比"

    # 模式7: success-story-XXX
    m = re.match(r'success-story-(.+)', s)
    if m:
        rest = translate_terms(m.group(1))
        return f"成功案例：{rest}"

    # 模式8: case-study-XXX
    m = re.match(r'case-study-(.+)', s)
    if m:
        rest = translate_terms(m.group(1))
        return f"案例研究：{rest}"

    # 通用翻译
    result = translate_terms(s)
    return result

def translate_terms(text):
    """翻译 slug 片段为中文"""
    s = '-' + text.lower().replace('_', '-') + '-'

    # 先替换多词短语
    for en, zh in sorted(MULTI_WORD.items(), key=lambda x: -len(x[0])):
        s = s.replace('-' + en + '-', '-' + zh + '-')

    # 再替换单词
    parts = s.strip('-').split('-')
    result_parts = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if p in SINGLE_WORD:
            result_parts.append(SINGLE_WORD[p])
        elif p.isdigit():
            result_parts.append(p)
        elif len(p) <= 2:
            result_parts.append(p.upper() if p.isalpha() else p)
        else:
            result_parts.append(p)

    return ''.join(result_parts)

def translate_geo(text):
    """翻译地理位置"""
    s = text.lower().replace('_', '-')
    for en, zh in sorted(GEO_KEYWORDS.items(), key=lambda x: -len(x[0])):
        if en in s:
            return zh
    return text

# ==========================================
# 7. 跨竞对去重
# ==========================================

def normalize_for_dedup(slug):
    """标准化 slug 用于跨竞对去重"""
    s = slug.lower()

    # 移除前缀
    for prefix in ['how-to-', 'what-is-', 'what-are-', 'why-', 'the-',
                    'a-', 'an-', 'best-way-to-', 'understanding-',
                    'ultimate-guide-to-', 'guide-to-', 'introduction-to-']:
        if s.startswith(prefix):
            s = s[len(prefix):]

    # 移除 top-N / best-N 模式
    s = re.sub(r'^(top|best|leading|trusted)-\d+-', '', s)
    s = re.sub(r'-\d+$', '', s)  # 移除末尾数字

    # 移除地理位置后缀
    s = re.sub(r'-in-(china|usa|us|uk|india|germany|france|italy|spain|australia|japan|korea|vietnam|indonesia|pakistan|south-africa|brazil|turkey|saudi|malaysia|thailand|russia|europe|asia|houston|shanghai|beijing|paris|sydney|hanoi|jakarta|karachi|lahore|johannesburg|europe|middle-east|africa|latin)', '', s)

    # 移除 manufacturers/suppliers/factories 等后缀
    s = re.sub(r'-(manufacturers?|suppliers?|companies|exporters?|brands?|makers?|factories?|dealers?|distributors?|list)$', '', s)

    # 移除常见连接词
    s = s.replace('-the-', '-').replace('-and-', '-').replace('-of-', '-').replace('-for-', '-')
    s = s.replace('-to-', '-').replace('-in-', '-').replace('-on-', '-').replace('-with-', '-')

    # 移除连字符，按字母排序
    words = sorted([w for w in s.split('-') if w and len(w) > 1])
    return ''.join(words)

# ==========================================
# 8. 主流程
# ==========================================

print("=" * 60)
print("选题库重构")
print("=" * 60)

all_records = []

# 解析所有文件
files_config = [
    ("清洗_AlfaLaval_SPXFlow_GEA_Myande.md", parse_alfalaval_file),
    ("清洗_原报告6家_ANDRITZ_Saltworks_EBNER_Sunevap_Vanoo_Enchem.md", parse_yuanbaogao_file),
    ("清洗_中小站9家.md", parse_zhongxiao_file),
    ("清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md", parse_samco_file),
    ("清洗_补充3家_final.md", parse_supplement_file),
]

for fname, parser in files_config:
    fpath = os.path.join(SCRIPT_DIR, fname)
    if os.path.exists(fpath):
        records = parser(fpath)
        print(f"  {fname}: {len(records)} 条")
        all_records.extend(records)
    else:
        print(f"  {fname}: 文件不存在!")

print(f"\n解析总计: {len(all_records)} 条")

# === Step 1: 删除品牌新闻 ===
kept = []
deleted = 0
for r in all_records:
    if should_delete(r['slug']):
        deleted += 1
    else:
        kept.append(r)

print(f"删除品牌新闻: {deleted} 条")
print(f"保留: {len(kept)} 条")

# === Step 2: 同竞对去重 ===
seen = set()
deduped_same = []
for r in kept:
    key = (r['competitor'], r['slug'].lower())
    if key not in seen:
        seen.add(key)
        deduped_same.append(r)

print(f"同竞对去重: {len(kept)} → {len(deduped_same)} 条")

# === Step 3: 重新分类 + 翻译 ===
processed = []
for r in deduped_same:
    slug = r['slug']
    type_num, industry, confidence = classify_slug(slug)
    title_zh = translate_slug(slug)
    title_en = slug.replace('-', ' ').replace('/', ' ').title()
    norm = normalize_for_dedup(slug)

    processed.append({
        'type': TYPE_NAMES.get(type_num, '8-其他'),
        'type_num': type_num,
        'industry': industry,
        'slug': slug,
        'title_en': title_en[:200],
        'title_zh': title_zh[:200],
        'normalized': norm,
        'confidence': confidence,
        'competitor': r['competitor'],
    })

# === Step 4: 跨竞对去重 ===
# 按 normalized 分组，同组只保留第一条（按置信度排序）
by_norm = {}
for r in processed:
    norm = r['normalized']
    if norm not in by_norm:
        by_norm[norm] = []
    by_norm[norm].append(r)

# 如果 normalized 完全相同且来自不同竞对 → 合并
final = []
merge_count = 0
for norm, group in by_norm.items():
    if len(group) == 1:
        final.append(group[0])
    else:
        # 按置信度排序，保留最佳
        conf_order = {'high': 0, 'medium': 1, 'low': 2}
        group.sort(key=lambda x: conf_order.get(x['confidence'], 3))
        best = group[0].copy()
        competitors = list(set([g['competitor'] for g in group]))
        if len(competitors) > 1:
            best['merged_from'] = ', '.join(competitors)
            merge_count += len(group) - 1
        final.append(best)

print(f"跨竞对去重: {len(processed)} → {len(final)} 条 (合并 {merge_count} 条)")

# === 统计 ===
type_dist = Counter(r['type'] for r in final)
conf_dist = Counter(r['confidence'] for r in final)
has_industry = sum(1 for r in final if r['industry'])

print(f"\n按类型:")
for t, c in sorted(type_dist.items()):
    print(f"  {t}: {c}")

print(f"\n按置信度:")
for c, n in sorted(conf_dist.items()):
    print(f"  {c}: {n}")

print(f"\n有行业标注: {has_industry} / {len(final)} ({100*has_industry//len(final) if final else 0}%)")

# === 输出 JSON ===
json_path = os.path.join(SCRIPT_DIR, "选题库_restructured.json")
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(final, f, ensure_ascii=False, indent=2)
print(f"\nJSON: {json_path}")

# === 输出 MD 样本 ===
md_path = os.path.join(SCRIPT_DIR, "选题库_restructured_sample.md")
with open(md_path, 'w', encoding='utf-8') as f:
    f.write(f"# 选题库重构样本（共 {len(final)} 条）\n\n")
    f.write(f"## 统计\n\n")
    f.write(f"- 解析总量: {len(all_records)}\n")
    f.write(f"- 删除品牌新闻: {deleted}\n")
    f.write(f"- 同竞对去重后: {len(deduped_same)}\n")
    f.write(f"- 跨竞对去重后: {len(final)}\n\n")

    f.write(f"## 按类型分布\n\n")
    for t, c in sorted(type_dist.items()):
        f.write(f"- {t}: {c}\n")

    f.write(f"\n## 样本预览（每类型 20 条）\n\n")
    for type_name in sorted(TYPE_NAMES.values()):
        type_records = [r for r in final if r['type'] == type_name]
        if not type_records:
            continue
        f.write(f"### {type_name}（{len(type_records)} 条）\n\n")
        f.write(f"| 类型 | 行业 | 中文主题 | 英文slug | 置信度 |\n")
        f.write(f"|------|------|----------|----------|--------|\n")
        for r in type_records[:20]:
            f.write(f"| {r['type']} | {r['industry']} | {r['title_zh']} | {r['slug'][:60]} | {r['confidence']} |\n")
        f.write(f"\n")

print(f"MD样本: {md_path}")
print(f"\n{'=' * 60}")
print(f"完成！请检查样本文件，确认后推送到飞书")
print(f"{'=' * 60}")
