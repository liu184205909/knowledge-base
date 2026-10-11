# -*- coding: utf-8 -*-
# 解剖首页 HTML：15484 区块完整范围 + section/widget 清单 + .gif/http 引用归属
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

raw = open(base + 'home.html', encoding='utf-8', errors='replace').read()

# 1. 找出所有顶层 elementor 模板容器（data-elementor-id 的 div）
tmpl_positions = [(m.start(), m.group(1)) for m in re.finditer(r'data-elementor-id="(\d+)"', raw)]
print('=== elementor template containers (in order) ===')
for pos, eid in tmpl_positions:
    # 向前找该属性所在的 div 开头
    div_start = raw.rfind('<div', 0, pos)
    print(f'pos {pos}: elementor-id={eid}')

# 2. .gif 引用位置及归属
print()
print('=== .gif references ===')
for m in re.finditer(r'src="([^"]+\.gif)"', raw):
    pos = m.start()
    # 归属哪个 elementor-id：往前找最近的 data-elementor-id
    prev = [p for p, e in tmpl_positions if p < pos]
    owner = None
    if prev:
        # 最近一个
        last = prev[-1]
        owner = dict(tmpl_positions)[last] if False else raw[last:last+40]
        owner = re.search(r'data-elementor-id="(\d+)"', owner).group(1)
    print(f'pos {pos} owner={owner}: {m.group(1)[:100]}')

# 3. http:// 引用位置及归属
print()
print('=== http:// rosetoys refs ===')
for m in re.finditer(r'(?:src|href)="(http://rosetoys\.org[^"]*)"', raw):
    pos = m.start()
    prev = [p for p, e in tmpl_positions if p < pos]
    owner = '-'
    if prev:
        last = prev[-1]
        owner = re.search(r'data-elementor-id="(\d+)"', raw[last:last+40]).group(1)
    print(f'pos {pos} owner={owner}: {m.group(1)[:110]}')
