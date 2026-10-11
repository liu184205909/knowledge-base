# -*- coding: utf-8 -*-
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

raw = open(r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/prod1.html', encoding='utf-8', errors='replace').read()

i = raw.find('924d063')
foot_at = raw.find('<footer')
print('924d063 at:', i, '| <footer at:', foot_at, '| dist to footer:', foot_at - i)

# 924d063 前最近出现的 elementor 容器开标签（section 或 container）
seg = raw[:i]
# 找所有 elementor 元素开标签位置
tags = [(m.start(), m.group()[:200]) for m in re.finditer(r'<(?:section|div|footer)[^>]*data-id="[0-9a-f]+"[^>]*>', seg)]
if tags:
    pos, tagstr = tags[-1]
    print('nearest element w/ data-id before 924d063 at', pos)
    print(tagstr[:300])

# 924d063 自己的完整开标签
m = re.search(r'<[^>]*data-id="924d063"[^>]*>', raw)
print('924d063 own tag:', m.group()[:300] if m else 'not found')

# 它的父容器：从 924d063 往前找 data-elementor-id（模板主容器）
eids = re.findall(r'data-elementor-id="(\d+)"', raw[:i])
print('elementor-ids before it:', eids[-3:])

# 924d063 与 </footer> 之间的距离；以及 924d063 区块的闭合情况：
fe = raw.find('</footer>')
block = raw[i:fe]
print('chars from 924d063 to </footer>:', fe - i)

# footer 前最后一个 </section> 或 elementor 收尾在哪里
# 输出 924d063 前后各 300 字符
print('--- context before 924d063 ---')
print(raw[i-600:i+100])
