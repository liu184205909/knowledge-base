# -*- coding: utf-8 -*-
# 各页 15484 区块实际范围 + marketplace/图标特征搜索
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

for name in ['home.html', 'post1.html', 'cat1.html', 'prod1.html']:
    raw = open(base + name, encoding='utf-8', errors='replace').read()
    m = re.search(r'data-elementor-id="15484"', raw)
    start = raw.rfind('<div', 0, m.start())
    # 15484 区块的结束：下一个顶层模板容器或 <footer
    foot_at = raw.find('<footer')
    nxt = re.search(r'data-elementor-id="(728|18799|3050)"', raw[m.end():])
    nxt_at = raw.rfind('<div', 0, m.end() + nxt.start()) if nxt else foot_at
    # 实际用 footer 前的最后一个 </div> 群——粗略用区间
    seg = raw[start:foot_at]
    wcount = len(re.findall(r'elementor-widget ', seg))
    print(f'{name}: 15484start={start} footer_at={foot_at} 区间大小={foot_at-start} widget≈{wcount}')
    # marketplace 特征
    for kw in ['amazon', 'marketplace', 'wpm', 'payment', 'visa', 'paypal', 'mastercard']:
        hits = seg.lower().count(kw)
        if hits: print(f'   kw [{kw}] x{hits}')
