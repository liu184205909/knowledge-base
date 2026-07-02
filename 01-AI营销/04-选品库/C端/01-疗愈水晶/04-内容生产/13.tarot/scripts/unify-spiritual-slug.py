#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一 spiritual 场景 slug → spiritual-growth
权威依据：模板-Tarot-场景文章框架.md 第45行 /{card}-for-spiritual-growth/
精确规则：只改 -for-spiritual 的 slug 引用（负向前瞻避免 -growth 重复），
         不动 "spiritual meaning"/"spiritual path" 等关键词短语（无 -for- 前缀）。
用法：python unify-spiritual-slug.py        # dry-run 预览
     python unify-spiritual-slug.py --run   # 实际执行
不处理 judgement/judgment 双拼（独立问题，等配对图跑完）。
"""
import os, re, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/'
ART = BASE + '04-内容生产/13.tarot/articles/'
SCN = BASE + '02-网站规划/images/tarot-scenario/'
CONFIGS = BASE + '04-内容生产/13.tarot/configs/'
DRY = '--run' not in sys.argv
print(f'=== MODE: {"DRY-RUN（预览，不改动）" if DRY else "EXECUTE（实际执行）"} ===\n')

# -for-spiritual 后面不是 -growth 的，才替换（避免 -growth-growth 重复）
PAT = re.compile(r'-for-spiritual(?!-growth)')

# ---- 1. 文件内容替换（文章 + configs json）----
print('[1] 文件内容引用替换（-for-spiritual → -for-spiritual-growth）')
files = glob.glob(ART + '*.md') + glob.glob(CONFIGS + '*.json')
content_changed = 0
total_hits = 0
for f in sorted(files):
    t = open(f, encoding='utf-8').read()
    hits = len(PAT.findall(t))
    if hits == 0:
        continue
    new = PAT.sub('-for-spiritual-growth', t)
    content_changed += 1
    total_hits += hits
    if not DRY:
        open(f, 'w', encoding='utf-8').write(new)
    print(f'  {os.path.basename(f)}: {hits} 处')
print(f'  小计: {content_changed} 文件, {total_hits} 处\n')

# ---- 2. 重命名文章文件 ----
print('[2] 文章文件重命名')
rn_md = 0
targets = glob.glob(ART + '*-for-spiritual.md') + glob.glob(ART + '*-for-spiritual-reversed.md')
for f in sorted(targets):
    f = f.replace('\\', '/')
    new = PAT.sub('-for-spiritual-growth', f)
    if new == f:
        continue
    if os.path.exists(new):
        print(f'  SKIP(目标已存在，可能双拼): {os.path.basename(f)} → {os.path.basename(new)}')
        continue
    if not DRY:
        os.rename(f, new)
    rn_md += 1
    print(f'  {os.path.basename(f)} → {os.path.basename(new)}')
print(f'  小计: {rn_md} 文件重命名\n')

# ---- 3. 重命名场景图 ----
print('[3] 场景正位图重命名 (*-for-spiritual.webp → *-for-spiritual-growth.webp)')
rn_img = 0
for f in sorted(glob.glob(SCN + '*-for-spiritual.webp')):
    f = f.replace('\\', '/')
    new = PAT.sub('-for-spiritual-growth', f)
    if os.path.exists(new):
        continue
    if not DRY:
        os.rename(f, new)
    rn_img += 1
    print(f'  {os.path.basename(f)} → {os.path.basename(new)}')
print(f'  小计: {rn_img} 图重命名\n')

print('=== 汇总 ===')
print(f'内容替换: {content_changed} 文件 / {total_hits} 处')
print(f'文章重命名: {rn_md}')
print(f'场景图重命名: {rn_img}')
if DRY:
    print('\n(dry-run，加 --run 实际执行)')
