#!/usr/bin/env python3
"""准备 webReader 工作文件：删除垃圾 + 按优先级排序"""
import json, re, os
from collections import Counter

SD = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(SD, '选题库_v4.json'), 'r', encoding='utf-8') as f:
    records = json.load(f)

print(f'输入: {len(records)}')

# 删除规则
def should_delete(r):
    s = r['slug'].lower().strip()
    # Toption 产品页（带数字ID）
    if re.search(r'-\d{6,}\.html', s) or re.search(r'/info/.*-\d{6,}', s):
        return True
    # 太短的 slug（栏目页/产品分类页）
    clean = s.rstrip('/').split('/')[-1]
    if len(clean) < 8:
        return True
    # 纯栏目页
    if clean in ('evaporator', 'evaporators', 'crystallizer', 'crystallizers',
                 'dryer', 'dryers', 'separator', 'separators', 'filter',
                 'spray-dryer', 'spray-dryers', 'products', 'product',
                 'about', 'contact', 'home', 'blog', 'news'):
        return True
    return False

kept = []
deleted = []
for r in records:
    if should_delete(r):
        deleted.append(r['slug'][:50])
    else:
        kept.append(r)

print(f'删除: {len(deleted)}')
print(f'保留: {len(kept)}')

# 按优先级排序（Type 1 优先，Type 7 最后）
priority = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 7: 5}
kept.sort(key=lambda r: (priority.get(r['type_num'], 9), r.get('competitor', '')))

# 统计
print(f'\n保留按类型:')
for t, c in sorted(Counter(r['type'] for r in kept).items()):
    print(f'  {t}: {c}')

print(f'\n保留按竞对:')
for comp, n in Counter(r.get('competitor','') for r in kept).most_common():
    print(f'  {comp}: {n}')

# 保存工作文件
with open(os.path.join(SD, 'webreader_work.json'), 'w', encoding='utf-8') as f:
    json.dump(kept, f, ensure_ascii=False, indent=2)

# 同时保存删除清单
with open(os.path.join(SD, 'deleted_junk.json'), 'w', encoding='utf-8') as f:
    json.dump(deleted, f, ensure_ascii=False, indent=2)

print(f'\n工作文件: webreader_work.json ({len(kept)} records)')
print(f'删除清单: deleted_junk.json ({len(deleted)} records)')

# 输出前20条预览
print(f'\n=== 前20条（最高优先级）===')
for r in kept[:20]:
    print(f'  [{r.get("competitor","")[:8]:8s}] [{r["type"][:6]:6s}] {r["slug"][:70]}')
