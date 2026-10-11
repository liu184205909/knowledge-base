# -*- coding: utf-8 -*-
# 解剖产品页 15484 之后到 <footer 之间的 ~99KB 内容
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

raw = open(base + 'prod1.html', encoding='utf-8', errors='replace').read()
mid = raw[50589:149711]
open(base + 'prod1_midgap.html', 'w', encoding='utf-8').write(mid)
print('mid size:', len(mid))

# 顶层结构：找 top-level section / 大容器开标签
# WoodMart 常见尾部容器
for pat in ['related-products', 'wd-related', 'product-tabs', 'upsell', 'footer-before', 'wd-prefooter', 'prefooter', 'mobile-nav', 'wd-sticky', 'cookies', 'wd-popup', 'images-of-product']:
    c = mid.count(pat)
    if c: print(f'  [{pat}] x{c}')

# 标题文本扫一遍（h2/h3/h4）
for m in re.finditer(r'<h[234][^>]*>(.*?)</h[234]>', mid, re.S):
    t = re.sub(r'<[^>]+>', '', m.group(1)).strip()
    if t: print('  H:', t[:80])
