# -*- coding: utf-8 -*-
# 15484 的 DOM 上下文（前后标签） + 728 在 prefooter/footer 两份的 data-id 对照
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

raw = open(base + 'home.html', encoding='utf-8', errors='replace').read()
print('=== home: 15484 前的 DOM 上下文 ===')
i = raw.find('data-elementor-id="15484"')
div_start = raw.rfind('<div', 0, i)
print(re.sub(r'\s+', ' ', raw[div_start-700:div_start+200]))
print()
print('=== home: 15484 之后紧跟什么（配平后） ===')
# 配平
def find_close(raw, open_start):
    depth = 0
    for m in re.finditer(r'<div\b|</div>', raw[open_start:]):
        if m.group() == '<div': depth += 1
        else:
            depth -= 1
            if depth == 0: return open_start + m.end()
    return -1
end = find_close(raw, div_start)
print(re.sub(r'\s+', ' ', raw[end:end+500]))
print()
# 728 两份渲染对照（用 prod1）
raw2 = open(base + 'prod1.html', encoding='utf-8', errors='replace').read()
occ = [m.start() for m in re.finditer(r'data-elementor-id="728"', raw2)]
print('prod1: 728 occurrences at', occ)
for n, pos in enumerate(occ):
    ds = raw2.rfind('<div', 0, pos)
    e = find_close(raw2, ds)
    seg = raw2[ds:e]
    ids = re.findall(r'data-id="([0-9a-f]+)"', seg)
    print(f'  copy#{n+1}: {ds}-{e} size={len(seg)} ids={ids}')
# 两份是否内容一致
segs = []
for pos in occ:
    ds = raw2.rfind('<div', 0, pos)
    e = find_close(raw2, ds)
    segs.append(raw2[ds:e])
print('两份 728 内容完全一致:', segs[0] == segs[1])
open(base + 'prod1_728_copy1.html', 'w', encoding='utf-8').write(segs[0])
open(base + 'prod1_728_copy2.html', 'w', encoding='utf-8').write(segs[1])
