import os, re, glob, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')
art = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/articles/'
files = glob.glob(art + '*.md')
cf = defaultdict(list)
for f in files:
    n = os.path.basename(f)
    card = n.split('-for-')[0]
    cf[card].append(n)
print('=== 缺篇牌(应5) ===')
for c, fs in sorted(cf.items()):
    if len(fs) < 5:
        print(f'  {c}: {len(fs)} -> {[x.split("-for-")[1] for x in fs]}')
print(f'总牌 {len(cf)} 总篇 {sum(len(v) for v in cf.values())} (预期21牌105篇)')
print()
print('=== Finances 违规上下文 ===')
neg_words = ['not ', 'no ', 'never ', 'cannot ', 'without ', 'no crystal', 'isn', 'don']
for f in sorted(glob.glob(art + '*for-finances*')):
    t = open(f, encoding='utf-8').read()
    m = re.search(r'## 正文(.*?)## 质检', t, re.S)
    body = m.group(1) if m else ''
    for mm in re.finditer(r'(.{0,45})(invest now|you will (?:gain|make money)|attract wealth quickly|guaranteed returns)(.{0,45})', body, re.I):
        before = mm.group(1).lower()
        neg = any(w in before for w in neg_words)
        ctx = (mm.group(1) + mm.group(2) + mm.group(3)).replace(chr(10), ' ')
        print(f'  {os.path.basename(f)} [neg={neg}]: ...{ctx[:115]}...')
