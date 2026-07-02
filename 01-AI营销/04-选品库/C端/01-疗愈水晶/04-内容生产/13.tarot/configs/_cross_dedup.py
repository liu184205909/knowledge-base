import glob, re, os, itertools, sys
sys.stdout.reconfigure(encoding='utf-8')
art = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/articles/'
print('跨牌去重(每场景抽样6篇M2段8-gram重叠,应<0.15)')
for sc in ['love', 'career', 'finances', 'health', 'spiritual']:
    fs = sorted(glob.glob(art + '*for-' + sc + '*'))
    samp = fs[:6]
    def m2(p):
        t = open(p, encoding='utf-8').read()
        m = re.search(r'## 正文(.*?)## 质检', t, re.S)
        b = m.group(1) if m else ''
        mm = re.search(r'(Energy.*?)(Upright|Reversed|## )', b, re.S)
        return mm.group(1) if mm else b[:800]
    def ng(t, n=8):
        w = re.findall(r"[A-Za-z']+", t.lower())
        return set(' '.join(w[i:i+n]) for i in range(len(w)-n+1)) if len(w) > n else set()
    gr = {f: ng(m2(f)) for f in samp}
    mx = 0; pair = ''
    for a, b in itertools.combinations(samp, 2):
        if gr[a] and gr[b]:
            ov = len(gr[a] & gr[b]) / min(len(gr[a]), len(gr[b]))
            if ov > mx:
                mx = ov; pair = os.path.basename(a) + ' x ' + os.path.basename(b)
    print(f'  {sc}({len(fs)}篇,抽样6) max={mx:.3f} [{"PASS" if mx < 0.15 else "FAIL"}] | {pair}')
