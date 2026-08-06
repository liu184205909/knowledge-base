# -*- coding: utf-8 -*-
"""Dry-run: 只解析,不写入飞书,验证解析逻辑。"""
import sys
import os
sys.path.insert(0, r"d:/Code/knowledge-base/01-AI营销/04-选品库/B端/04-蒸发结晶/01-竞品分析")
from import_to_feishu import (
    parse_file_1, parse_file_2, parse_file_3, parse_file_4,
    COUNTRY_MAP, TYPE_MAP, INPUT_DIR
)
from collections import Counter

file_1 = os.path.join(INPUT_DIR, "清洗_AlfaLaval_SPXFlow_GEA_Myande.md")
file_2 = os.path.join(INPUT_DIR, "清洗_原报告6家_ANDRITZ_Saltworks_EBNER_Sunevap_Vanoo_Enchem.md")
file_3 = os.path.join(INPUT_DIR, "清洗_中小站9家.md")
file_4 = os.path.join(INPUT_DIR, "清洗_SAMCO_Alaqua_Toption_ENCO_ASOS_Condorchem.md")

r1 = parse_file_1(file_1)
r2 = parse_file_2(file_2)
r3 = parse_file_3(file_3)
r4 = parse_file_4(file_4)

print(f"文件 1: {len(r1)} 条")
print(f"文件 2: {len(r2)} 条")
print(f"文件 3: {len(r3)} 条")
print(f"文件 4: {len(r4)} 条")
print(f"合计: {len(r1)+len(r2)+len(r3)+len(r4)} 条")

print("\n--- 文件 1 按竞对 ---")
for k, v in sorted(Counter(r['竞对'] for r in r1).items(), key=lambda x: -x[1]):
    print(f"  {k:<15} {v}")

print("\n--- 文件 1 按类型 ---")
for k, v in sorted(Counter(r['文章类型'] for r in r1).items()):
    print(f"  {k:<25} {v}")

print("\n--- 文件 2 按竞对 ---")
for k, v in sorted(Counter(r['竞对'] for r in r2).items(), key=lambda x: -x[1]):
    print(f"  {k:<15} {v}")

print("\n--- 文件 3 按竞对 ---")
for k, v in sorted(Counter(r['竞对'] for r in r3).items(), key=lambda x: -x[1]):
    print(f"  {k:<15} {v}")

print("\n--- 文件 4 按竞对 ---")
for k, v in sorted(Counter(r['竞对'] for r in r4).items(), key=lambda x: -x[1]):
    print(f"  {k:<15} {v}")

print("\n--- 文件 3 按类型 ---")
for k, v in sorted(Counter(r['文章类型'] for r in r3).items()):
    print(f"  {k:<25} {v}")

print("\n--- 文件 4 按类型 ---")
for k, v in sorted(Counter(r['文章类型'] for r in r4).items()):
    print(f"  {k:<25} {v}")

# 打印前 5 条样本
print("\n--- 样本(各文件前 3 条) ---")
for name, records in [("文件1", r1), ("文件2", r2), ("文件3", r3), ("文件4", r4)]:
    print(f"\n{name}:")
    for r in records[:3]:
        print(f"  {r}")

# 去重统计
seen = set()
deduped = []
dups = 0
for r in r1 + r2 + r3 + r4:
    key = (r['竞对'], r['slug'])
    if key in seen:
        dups += 1
        continue
    seen.add(key)
    deduped.append(r)
print(f"\n去重后: {len(deduped)} 条 (移除 {dups} 重复)")

# 重复样本
print("\n--- 重复样本(前 5) ---")
seen2 = set()
dup_samples = []
for r in r1 + r2 + r3 + r4:
    key = (r['竞对'], r['slug'])
    if key in seen2:
        dup_samples.append(r)
    else:
        seen2.add(key)
for r in dup_samples[:5]:
    print(f"  {r['竞对']:<15} {r['slug']}")
