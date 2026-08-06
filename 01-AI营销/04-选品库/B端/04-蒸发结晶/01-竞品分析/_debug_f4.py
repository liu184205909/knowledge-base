# -*- coding: utf-8 -*-
"""调试文件 4 解析问题。"""
import sys
import os
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import (
    detect_competitor_from_h2, detect_type_from_h3, clean_slug,
)

# 测试 detect_competitor_from_h2
tests = [
    "## SAMCO（抓取 287 URL，剔除 0，跨域 0）",
    "## Alaqua（抓取 247 URL，剔除 0，跨域 0）",
    "## Toption（抓取 5692 URL，剔除 5051，跨域 0）",
    "## ENCO（抓取 418 URL，剔除 215，跨域 106）",
    "## ASOS（抓取 151 URL，剔除 0，跨域 0）",
    "## Condorchem（抓取 256 URL，剔除 0，跨域 0）",
    "## 总览统计",
    "## 关键观察",
]
print("--- detect_competitor_from_h2 ---")
for t in tests:
    r = detect_competitor_from_h2(t)
    print(f"  {t[:40]:<42} -> {r}")

# 测试 detect_type_from_h3
tests2 = [
    "### Cat 1 — 解决方案/案例（65 篇）",
    "### Cat 2 — What-Is/原理/指南（106 篇）",
    "### Cat 3 — FAQ/买家提问（22 篇）",
    "### Cat 7 — 地理 SEO（13 篇）",
    "### Cat 8 — 其他（8 篇）",
]
print("\n--- detect_type_from_h3 ---")
for t in tests2:
    r = detect_type_from_h3(t)
    print(f"  {t[:40]:<42} -> {r}")

# 测试 clean_slug
tests3 = [
    "- `case-study-samco-works-with-epc-to-deliver-complete-water-treatment-solution-for-carbon-capture-power-plant`",
    "- `project/landfill-leachate-system`",
    "- `crystallizer-manufacturer-in-usa`",
]
print("\n--- clean_slug ---")
for t in tests3:
    r = clean_slug(t)
    print(f"  {t[:50]:<52} -> {r}")
