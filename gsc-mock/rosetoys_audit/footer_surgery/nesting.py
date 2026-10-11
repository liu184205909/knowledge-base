# -*- coding: utf-8 -*-
# 理清 728 与 <footer> 嵌套；marketplace 图标全量；728 渲染次数
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

for name in ['prod1.html', 'home.html', 'post1.html', 'cat1.html']:
    raw = open(base + name, encoding='utf-8', errors='replace').read()
    n728 = len(re.findall(r'data-elementor-id="728"', raw))
    footer_at = raw.find('<footer')
    pre_at = raw.find('wd-prefooter')
    close_footer = raw.find('</footer>')
    n_icon = len(set(re.findall(r'marketplace-icon-\d+\.svg', raw)))
    print(f'{name}: 728渲染x{n728} | <footer at {footer_at} | wd-prefooter at {pre_at} | </footer> at {close_footer} | marketplace图标种类 {sorted(set(re.findall(chr(109)+"arketplace-icon-\\d", raw)))}')

# 产品页 footer 标签前后文
raw = open(base + 'prod1.html', encoding='utf-8', errors='replace').read()
print()
print('=== prod1 around <footer ===')
print(re.sub(r'\s+', ' ', raw[149500:149900]))
print()
print('=== prod1 around </footer> ===')
print(re.sub(r'\s+', ' ', raw[161000:161400]))
# 首页 footer 前后
raw2 = open(base + 'home.html', encoding='utf-8', errors='replace').read()
print()
print('=== home around <footer ===')
print(re.sub(r'\s+', ' ', raw2[185200:185700]))
