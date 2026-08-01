#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一 judgement → judgment（跟 tarot-knowledge.json slug+name 权威）
- 5对重复（正位5场景）：judgement版归档到 _archive/，保留 judgment版上线
- 24个纯 judgement 文件（19配对+5逆位）：重命名 judgement→judgment
- 内容替换：\bJudgement\b→Judgment, \bjudgement\b→judgment（全文章+json，词边界精确）
- 图已全部 judgment（盘点确认），不用改图
用法：python unify-judgement-slug.py        # dry-run
     python unify-judgement-slug.py --run   # 实际执行
"""
import os, re, glob, sys, shutil
sys.stdout.reconfigure(encoding='utf-8')

BASE = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/'
ART = BASE + '04-内容生产/13.tarot/articles/'
CONFIGS = BASE + '04-内容生产/13.tarot/configs/'
ARCHIVE = ART + '_archive/'
DRY = '--run' not in sys.argv
print(f'=== MODE: {"DRY-RUN" if DRY else "EXECUTE"} ===\n')

PAT_JE = re.compile(r'\bJudgement\b')
PAT_je = re.compile(r'\bjudgement\b')

# ---- 1. 归档5对重复（正位judgement版 → _archive，保留judgment版）----
print('[1] 归档5对重复（正位 judgement版 → _archive，保留 judgment版上线）')
archived = 0
for sc in ['love', 'career', 'finances', 'health', 'spiritual-growth']:
    je = f'{ART}judgement-for-{sc}.md'
    jt = f'{ART}judgment-for-{sc}.md'
    if os.path.exists(je) and os.path.exists(jt):
        if not DRY:
            os.makedirs(ARCHIVE, exist_ok=True)
            shutil.move(je, ARCHIVE + f'judgement-for-{sc}.md')
        archived += 1
        print(f'  归档: judgement-for-{sc}.md → _archive/ （上线保留 judgment-for-{sc}.md）')
print(f'  小计: {archived} 个归档\n')

# ---- 2. 内容替换（所有上线文章 + json + 归档文件）----
print('[2] 内容替换 \\bJudgement\\b→Judgment, \\bjudgement\\b→judgment')
files = glob.glob(ART + '*.md') + glob.glob(ART + '_archive/*.md') + glob.glob(CONFIGS + '*.json')
content_changed = 0
total_hits = 0
for f in sorted(files):
    if not os.path.exists(f):
        continue
    t = open(f, encoding='utf-8').read()
    hits = len(PAT_JE.findall(t)) + len(PAT_je.findall(t))
    if hits == 0:
        continue
    new = PAT_JE.sub('Judgment', t)
    new = PAT_je.sub('judgment', new)
    content_changed += 1
    total_hits += hits
    if not DRY:
        open(f, 'w', encoding='utf-8').write(new)
    print(f'  {os.path.basename(f)}: {hits} 处')
print(f'  小计: {content_changed} 文件, {total_hits} 处\n')

# ---- 3. 重命名剩余纯 judgement 文件（19配对+5逆位）----
print('[3] 重命名纯 judgement 文件 → judgment')
rn = 0
for f in sorted(glob.glob(ART + '*judgement*')):
    if not os.path.exists(f):
        continue
    new = f.replace('judgement', 'judgment')
    if os.path.exists(new):
        print(f'  SKIP(目标已存在): {os.path.basename(f)}')
        continue
    if not DRY:
        os.rename(f, new)
    rn += 1
    print(f'  {os.path.basename(f)} → {os.path.basename(new)}')
print(f'  小计: {rn} 文件重命名\n')

print('=== 汇总 ===')
print(f'归档重复: {archived}')
print(f'内容替换: {content_changed} 文件 / {total_hits} 处')
print(f'文件重命名: {rn}')
if DRY:
    print('\n(dry-run，加 --run 实际执行)')
