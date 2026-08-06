# -*- coding: utf-8 -*-
"""调试文件 4 的 slug 行解析。"""
import sys
import os
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import clean_slug

# 文件 4 第 35 行的实际内容
samples = [
    "- `case-study-samco-works-with-epc-to-deliver-complete-water-treatment-solution-for-carbon-capture-power-plant`",
    "- `project/landfill-leachate-system`",
]
for s in samples:
    # 模拟 parse_file_4 中的 stripped[2:]
    after_dash = s.strip()[2:]
    print(f"after_dash = {after_dash!r}")
    r = clean_slug(after_dash)
    print(f"  -> {r!r}")

# 试试直接读取文件
print("\n--- 文件实际读取 ---")
file_4 = r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析/清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md"
with open(file_4, "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 35 <= i <= 37:
            print(f"L{i}: raw={line.rstrip()!r}")
            stripped = line.strip()
            print(f"     stripped={stripped!r}")
            print(f"     startswith '- ': {stripped.startswith('- ')}")
            if stripped.startswith("- "):
                after = stripped[2:]
                print(f"     after dash: {after!r}")
                r = clean_slug(after)
                print(f"     clean_slug: {r!r}")
