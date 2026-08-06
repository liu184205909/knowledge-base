#!/usr/bin/env python3
"""Build the final markdown output for SAMCO + Alaqua slugs."""
import json, os
from datetime import datetime

TMP = os.environ.get('TEMP', 'C:/Users/Dylan/AppData/Local/Temp').replace('\\', '/') + '/'
OUT = 'd:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析/sitemap全量_SAMCO_Alaqua.md'

# 重新加载原始 slugs 以区分 post 和 project
with open(TMP + 'slugs.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)
with open(TMP + 'classified.json', 'r', encoding='utf-8') as f:
    result = json.load(f)

SAMCO_PROJ_SET = set(raw['samco_project'])

CATS = [
    ('1_技术原理与工作原理', '1. 技术原理与工作原理', 'What is / How it works / Principle / Working / 产品原理'),
    ('2_设备类型与产品选型', '2. 设备类型与产品选型', 'Types of / vs / Versus / Difference / Selection / 选型对比'),
    ('3_应用场景与行业案例', '3. 应用场景与行业案例', 'Application / Industry / Case study / 行业应用'),
    ('4_操作维护与故障排除', '4. 操作维护与故障排除', 'How to / Maintenance / Troubleshoot / Clean / Fix'),
    ('5_成本价格与采购', '5. 成本价格与采购', 'Cost / Price / How much / Pricing'),
    ('6_厂商对比与采购指南', '6. 厂商对比与采购指南', 'Best companies / Top 10 / Suppliers / Manufacturers'),
    ('7_法规标准与合规性', '7. 法规标准与合规性', 'Regulation / Compliance / EPA / Limits'),
    ('8_行业趋势与战略洞察', '8. 行业趋势与战略洞察', 'Trends / Outlook / Future / Strategy / Industry focus'),
]

def total(site):
    return sum(len(v) for v in result[site].values())

samco_total = total('SAMCO')
alaqua_total = total('Alaqua')
samco_proj_count = len(raw['samco_project'])
samco_post_count = samco_total - samco_proj_count

lines = []
lines.append('# SAMCO + Alaqua 全量文章 slug 清单')
lines.append('')
lines.append(f'> 生成时间：{datetime.now().strftime("%Y-%m-%d %H:%M")}')
lines.append(f'> 数据来源：samcotech.com / alaquainc.com Yoast SEO sitemap（post + project）')
lines.append('> 范围：仅"文章类"内容（post + project 案例库）；不含 page-sitemap 中的产品/服务/感谢/招聘页')
lines.append('')
lines.append('## 总览')
lines.append('')
lines.append('| 站点 | sitemap 总数 | 去重后文章数 | 备注 |')
lines.append('|---|---|---|---|')
lines.append(f'| **SAMCO** | post(223) + project(64) | **{samco_total}** | 去除 1 个 `auto-draft`；project 案例库 63 篇全保留（其中 1 条 `/project/` 顶级目录不计） |')
lines.append(f'| **Alaqua** | post(247) | **{alaqua_total}** | 247 篇博客文章全部纳入；page-sitemap 17 条为产品/服务页不计入 |')
lines.append(f'| **合计** | — | **{samco_total + alaqua_total}** | |')
lines.append('')
lines.append('### 分类分布')
lines.append('')
lines.append('| 类型 | SAMCO | Alaqua | 合计 |')
lines.append('|---|---:|---:|---:|')
for key, label, _ in CATS:
    sc = len(result['SAMCO'].get(key, []))
    al = len(result['Alaqua'].get(key, []))
    lines.append(f'| {label} | {sc} | {al} | {sc + al} |')
lines.append(f'| **合计** | **{samco_total}** | **{alaqua_total}** | **{samco_total + alaqua_total}** |')
lines.append('')
lines.append('### 站点差异观察')
lines.append('')
sc_3 = len(result['SAMCO'].get('3_应用场景与行业案例', []))
sc_4 = len(result['SAMCO'].get('4_操作维护与故障排除', []))
sc_6 = len(result['SAMCO'].get('6_厂商对比与采购指南', []))
al_1 = len(result['Alaqua'].get('1_技术原理与工作原理', []))
lines.append(f'- **SAMCO**（水处理 EPC 总承包商）：类型 3（行业应用 {sc_3}）+ 类型 4（操作维护 {sc_4}）+ 类型 6（厂商选型 {sc_6}）共 {sc_3+sc_4+sc_6} 篇，占总量 {(sc_3+sc_4+sc_6)*100//samco_total}%。反映其面向化工厂、电厂、半导体厂的"项目交付 + 设备选型 + 运维指南"内容主线。')
lines.append(f'- **Alaqua**（蒸发/结晶/蒸馏设备制造商）：类型 1（产品原理）独占 {al_1} 篇（占总量 {al_1*100//alaqua_total}%）。反映其 SEO 策略是围绕"蒸发器/结晶器/蒸馏塔/换热器/喷雾干燥器/溶剂回收"的纯产品科普内容矩阵，缺乏深度行业案例和采购指南。')
lines.append(f'- **SAMCO project 案例库**：{samco_proj_count} 篇真实客户案例（`/project/` 路径），是 B 端信任建设资产，Alaqua 无对应内容。')
lines.append('')
lines.append('---')
lines.append('')

# 每个站点
for site_name, site_key, base_url in [
    ('SAMCO', 'SAMCO', 'https://www.samcotech.com'),
    ('Alaqua', 'Alaqua', 'https://www.alaquainc.com'),
]:
    lines.append(f'## {site_name}（{base_url}）')
    lines.append('')
    site_total = total(site_key)
    lines.append(f'**全量 {site_total} 篇**，按 8 种文章类型分类如下：')
    lines.append('')
    for key, label, desc in CATS:
        slugs = result[site_key].get(key, [])
        if not slugs:
            continue
        lines.append(f'### {label}（{len(slugs)} 篇）')
        lines.append('')
        lines.append(f'> 关键词：{desc}')
        lines.append('')
        lines.append('| # | slug | URL |')
        lines.append('|---:|---|---|')
        for i, slug in enumerate(slugs, 1):
            # SAMCO project slug 加 /project/ 前缀
            if site_key == 'SAMCO' and slug in SAMCO_PROJ_SET:
                url = base_url + '/project/' + slug + '/'
                lines.append(f'| {i} | `{slug}` ⭐ | {url} |')
            else:
                url = base_url + '/' + slug + '/'
                lines.append(f'| {i} | `{slug}` | {url} |')
        lines.append('')
    lines.append('---')
    lines.append('')

lines.append('## 附录：分类规则')
lines.append('')
lines.append('| 类型 | 判定优先级 | 主要关键词模式 |')
lines.append('|---|---|---|')
lines.append('| 1. 技术原理与工作原理 | P4 | `what-is` / `how-it-works` / `principle` / `working` / 纯产品名（evaporator/crystallizer/distillation/heat-exchanger/spray-dryer/solvent-recovery） |')
lines.append('| 2. 设备类型与产品选型 | P3 | `types-of` / `vs` / `versus` / `difference` / `selecting` / `choose-the-best` / `does-your-facility-need` |')
lines.append('| 3. 应用场景与行业案例 | P5（兜底）| `application` / `industry` / `case-study` / `used-in` / `remove-X-from` / `brine/lithium/copper-recovery`；SAMCO `/project/` 全归此 |')
lines.append('| 4. 操作维护与故障排除 | P2 | `how-to` / `maintenance` / `troubleshoot` / `clean` / `fix` / `optimize` / `common-problems` / `N-tips/N-steps` |')
lines.append('| 5. 成本价格与采购 | P1 | `how-much` / `cost` / `pricing` / `price` |')
lines.append('| 6. 厂商对比与采购指南 | P2 | `best-companies` / `top-10` / `manufacturers` / `suppliers` / `best-supplier` / `buy-industrial` |')
lines.append('| 7. 法规标准与合规性 | P1 | `regulation` / `compliance` / `epa` / `pfas` / `gmp` / `safety-considerations` |')
lines.append('| 8. 行业趋势与战略洞察 | P1 | `industry-focus` / `industry-current` / `trends` / `outlook` / `future-of` / `innovation` |')
lines.append('')
lines.append('> 优先级说明：P1 > P2 > P3 > P4 > P5。即"成本价格"先于"操作维护"先于"选型"先于"原理"先于"应用兜底"。这样避免"how much does industrial water treatment cost"被误判为原理类。')
lines.append('')
lines.append('## 附录：sitemap 原始数据')
lines.append('')
lines.append('- SAMCO sitemap_index.xml: https://www.samcotech.com/sitemap_index.xml')
lines.append('  - post-sitemap.xml: 223 条（含 1 条 `auto-draft`，已剔除）')
lines.append('  - project-sitemap.xml: 64 条（含 1 条顶级 `/project/`，已剔除）')
lines.append('  - page-sitemap.xml: 133 条（产品/服务/感谢页/电子书下载页，不计入文章）')
lines.append('  - category / post_tag / project_category / project_tag / author-sitemap：分类与作者页，不计入')
lines.append('- Alaqua sitemap_index.xml: https://www.alaquainc.com/sitemap_index.xml')
lines.append('  - post-sitemap.xml: 247 条（全部纳入）')
lines.append('  - page-sitemap.xml: 17 条（首页/服务页/产品页/客户页/Contact/Blog 索引页，不计入）')
lines.append('  - category / post_tag：分类与标签页，不计入')
lines.append('')

# 写文件
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Written: {OUT}")
print(f"SAMCO: {samco_total} (post {samco_post_count} + project {samco_proj_count})")
print(f"Alaqua: {alaqua_total}")
print(f"Total: {samco_total + alaqua_total}")
