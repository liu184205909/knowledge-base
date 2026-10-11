# -*- coding: utf-8 -*-
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

for name in ['home.html', 'post1.html', 'cat1.html', 'prod1.html']:
    raw = open(base + name, encoding='utf-8', errors='replace').read()
    has924 = '924d063' in raw
    eids = sorted(set(re.findall(r'data-elementor-id="(\d+)"', raw)))
    # 15484 区块从哪到哪：第一个 data-elementor-id="15484" 的位置
    m = re.search(r'data-elementor-id="15484"', raw)
    print(name, '| 924d063:', has924, '| elementor-ids:', eids, '| 15484 at:', m.start() if m else None)
