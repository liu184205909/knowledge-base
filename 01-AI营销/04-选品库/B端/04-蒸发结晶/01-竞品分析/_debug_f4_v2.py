# -*- coding: utf-8 -*-
"""逐行调试文件 4。"""
import sys
import os
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import (
    detect_competitor_from_h2, detect_type_from_h3, clean_slug,
    parse_file_4, INPUT_DIR
)

# 直接调用 parse_file_4
file_4 = os.path.join(INPUT_DIR, "清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md")
records = parse_file_4(file_4)
print(f"records count: {len(records)}")

# 模拟解析过程,打印关键事件
import re
current_competitor = None
current_type = None
events = 0
with open(file_4, "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        stripped = line.rstrip("\n").strip()
        if not stripped:
            continue

        if stripped.startswith("## ") and not stripped.startswith("### "):
            comp = detect_competitor_from_h2(stripped)
            print(f"L{i:4d} [H2] stripped={stripped[:60]!r} comp={comp!r}")
            if comp:
                current_competitor = comp
                current_type = None
            events += 1
        elif stripped.startswith("### "):
            t = detect_type_from_h3(stripped)
            print(f"L{i:4d} [H3] stripped={stripped[:60]!r} type={t!r}")
            if t is not None:
                current_type = t
            events += 1
        elif stripped.startswith("- ") and current_competitor and current_type:
            # 取第一条 slug 作为样本
            if events < 50 or i % 100 == 0:
                pass  # 不打印 slug 行,太多
            events += 1
        if events > 30:
            break
