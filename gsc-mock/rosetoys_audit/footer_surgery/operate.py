# -*- coding: utf-8 -*-
# 本地 JSON 手术：728 删 section 71dc9a5 + http→https；18799 http→https；post_content 同步
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

# ============ 728 _elementor_data 手术 ============
data = json.load(open(base + 'before_728_elementor_data.json', encoding='utf-8'))
assert isinstance(data, list) and len(data) == 2, f'728 顶层应 2 section，实际 {len(data)}'
top_ids = [s.get('id') for s in data]
print('728 顶层:', top_ids)

DELETE = '71dc9a5'   # marketplace 图标条 section（删除组）
KEEP = '3791792'     # logo/政策链接/社交 section（保留组）

new_data = [s for s in data if s.get('id') != DELETE]
assert len(new_data) == 1 and new_data[0].get('id') == KEEP, '保留组异常'

def count(el, t):
    n = 1 if el.get('elType') == t else 0
    for c in el.get('elements', []):
        n += count(c, t)
    return n
w_before = sum(count(s, 'widget') for s in data)
w_after = sum(count(s, 'widget') for s in new_data)
print(f'728 widget 对账: {w_before} -> {w_after} (预期 7->3)')
assert (w_before, w_after) == (7, 3), 'widget 数对账失败'

s728 = json.dumps(new_data, ensure_ascii=False, separators=(',', ':'), )
print('728 新 _elementor_data len:', len(s728))
n_http = s728.count('http://rosetoys.org')
print('728 新数据 http 处数(替换前):', n_http, '(预期2: 背景+logo)')
s728 = s728.replace('http://rosetoys.org', 'https://rosetoys.org')
assert s728.count('http://rosetoys.org') == 0
# 断言 logo https 在
assert 'https://rosetoys.org/wp-content/uploads/2023/12/logo-no-background.png' in s728
# 断言 marketplace 图标条随删除组消失
assert 'marketplace-icon' not in s728, 'marketplace icon 应已随 71dc9a5 删除'
# 断言保留组背景图仍在（仅协议转 https）
assert 'https://rosetoys.org/wp-content/uploads/2024/01/camping-footer-bg.jpg' in s728, '保留组背景图应留存(https)'
open(base + 'after_728_elementor_data.json', 'w', encoding='utf-8').write(s728)
print('728 elementor_data 手术完成')

# ============ 728 post_content 同步（仅 logo http→https）============
pc = open(base + 'before_728_post_content.html', encoding='utf-8').read()
pc_hits = pc.count('http://rosetoys.org')
pc2 = pc.replace('http://rosetoys.org', 'https://rosetoys.org')
print(f'728 post_content http 替换 {pc_hits} 处')
assert pc2.count('http://rosetoys.org') == 0
open(base + 'after_728_post_content.html', 'w', encoding='utf-8').write(pc2)

# ============ 18799 _elementor_data http→https（注意 DB 值带 \/ 转义）============
d99 = json.load(open(base + 'recon18799.json', encoding='utf-8'))
ed99 = d99['meta']['_elementor_data']  # 字符串
n_plain = ed99.count('http://rosetoys.org')
n_esc = ed99.count('http:\\/\\/rosetoys.org')
ed99_new = ed99.replace('http://rosetoys.org', 'https://rosetoys.org').replace('http:\\/\\/rosetoys.org', 'https:\\/\\/rosetoys.org')
# json.loads 断言合法
json.loads(ed99_new)
print(f'18799 elementor_data http 替换: plain={n_plain} escaped={n_esc} (合计预期1)')
assert (n_plain + n_esc) == 1 and ed99_new.count('http:') == 0
open(base + 'after_18799_elementor_data.txt', 'w', encoding='utf-8').write(ed99_new)
print('18799 手术完成')
print()
print('=== 全部手术产物就绪，待写回 ===')
