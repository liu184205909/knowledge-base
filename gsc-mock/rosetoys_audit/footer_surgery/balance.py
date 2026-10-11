# -*- coding: utf-8 -*-
# 精确配平 div 找 15484 容器闭合；列出内部 elementor 元素清单
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

def find_close(raw, open_start):
    """从 open_start（容器开标签的 '<' 位置）起做 div 配平，返回闭合 </div> 的结束位置"""
    depth = 0
    for m in re.finditer(r'<div\b|</div>', raw[open_start:]):
        if m.group() == '<div':
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return open_start + m.end()
    return -1

for name in ['post1.html', 'prod1.html', 'cat1.html', 'home.html']:
    raw = open(base + name, encoding='utf-8', errors='replace').read()
    m = re.search(r'data-elementor-id="15484"', raw)
    div_start = raw.rfind('<div', 0, m.start())
    end = find_close(raw, div_start)
    seg = raw[div_start:end]
    print(f'== {name}: 15484 容器 {div_start}-{end} size={len(seg)}')
    open(base + f'blk15484_{name}', 'w', encoding='utf-8').write(seg)
    # 内部元素清单（排除容器自身第一个）
    els = re.findall(r'data-id="([0-9a-f]+)" data-element_type="([^"]+)"[^>]*data-widget_type="([^"?]*)"?', seg)
    for i, (did, et, wt) in enumerate(els):
        print(f'   {i}. {did} {et} {wt}')
    # 更稳的：直接按标签属性抽
    print('   --- widgets by data-widget_type ---')
    for m2 in re.finditer(r'data-id="([0-9a-f]+)"[^>]*data-widget_type="([^"]+)"', seg):
        print(f'   {m2.group(1)} -> {m2.group(2)}')
    print('   --- sections/columns ---')
    for m2 in re.finditer(r'data-id="([0-9a-f]+)"[^>]*data-element_type="(section|container|column)"', seg):
        print(f'   {m2.group(1)} -> {m2.group(2)}')
    print()
