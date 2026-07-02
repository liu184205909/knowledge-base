import glob, re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
art = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/articles/'
combos = sorted(glob.glob(art + '*-combination.md'))
print('=== 词数<300 异常篇(结构问题) ===')
low = 0
for f in combos:
    t = open(f, encoding='utf-8').read()
    m = re.search(r'## 正文(.*?)## 质检', t, re.S)
    body = m.group(1) if m else ''
    wc = len(re.findall(r"[A-Za-z']{2,}", body))
    if wc < 300:
        low += 1
        total_wc = len(re.findall(r"[A-Za-z']{2,}", t))
        print(f'  {os.path.basename(f)}: 正文段wc={wc} 文件总wc={total_wc} (差={total_wc-wc})')
print(f'异常篇总数: {low}')
print()
print('=== 三段式"together they mean"上下文(精确,抽样10) ===')
cnt = 0
for f in combos:
    t = open(f, encoding='utf-8').read()
    m = re.search(r'## 正文(.*?)## 质检', t, re.S)
    body = m.group(1) if m else ''
    for mm in re.finditer(r'together they mean', body, re.I):
        ctx = body[max(0, mm.start()-70):mm.end()+70].replace('\n', ' ')
        print(f'  {os.path.basename(f)}: ...{ctx[:160]}...')
        cnt += 1
        if cnt >= 10:
            break
    if cnt >= 10:
        break
print(f'抽样 {cnt} 处')
