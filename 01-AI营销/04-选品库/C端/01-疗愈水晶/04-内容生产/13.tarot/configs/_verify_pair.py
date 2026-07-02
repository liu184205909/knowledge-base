import glob, re, os, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')
art = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/articles/'
combos = sorted(glob.glob(art + '*-combination.md'))
print('配对文章数:', len(combos), '(应231)')
stitch = 0
fin_disc = 0
for f in combos:
    t = open(f, encoding='utf-8').read()
    m = re.search(r'## 正文(.*?)## 质检', t, re.S)
    body = m.group(1) if m else ''
    if re.search(r'together they mean|A means.+B means.+together|合起来.{0,10}两者相加', body, re.I):
        stitch += 1
    if 'symbolic guidance rather than investment advice' in body:
        fin_disc += 1
print('三段式拼接命中篇数:', stitch, '(应0)')
print('含Finances免责原文篇数:', fin_disc)
wcs = []
for f in combos:
    t = open(f, encoding='utf-8').read()
    m = re.search(r'## 正文(.*?)## 质检', t, re.S)
    body = m.group(1) if m else ''
    wcs.append(len(re.findall(r"[A-Za-z']{2,}", body)))
print(f'词数: min={min(wcs)} max={max(wcs)} avg={sum(wcs)//len(wcs)}')
tiers = Counter()
for f in combos:
    t = open(f, encoding='utf-8').read()
    m = re.search(r'tier["\':\s]+(\w+)', t)
    if m:
        tiers[m.group(1)] += 1
print('档位分布:', dict(tiers))
