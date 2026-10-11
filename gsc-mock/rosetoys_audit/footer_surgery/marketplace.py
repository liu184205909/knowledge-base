# -*- coding: utf-8 -*-
# marketplace 特征精确定位 + wd-prefooter 区段提取
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

raw = open(base + 'prod1.html', encoding='utf-8', errors='replace').read()
# marketplace 上下文
for m in list(re.finditer(r'[Mm]arketplace', raw))[:3]:
    print('pos', m.start(), ':', re.sub(r'\s+', ' ', raw[m.start()-150:m.start()+150])[:300])
    print('---')

# wd-prefooter 区段
i = raw.find('wd-prefooter')
print('wd-prefooter at:', i, '| <footer at:', raw.find('<footer'))
seg = raw[i-300:i+2500]
print(re.sub(r'\s+', ' ', seg)[:2000])
