import json, io, sys
p = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/pair-knowledge.json'
data = json.load(open(p, encoding='utf-8'))
# find the container of pairs
pairs = None
if isinstance(data, dict):
    for k in ('pairs', 'combinations', 'pairings', 'data'):
        if isinstance(data.get(k), list):
            pairs = data[k]
            print('CONTAINER KEY:', k, 'LEN:', len(pairs))
            break
if pairs is None:
    print('NO LIST FOUND; keys=', list(data.keys()))
    sys.exit(0)

found = []
for item in pairs:
    if not isinstance(item, dict):
        continue
    ps = item.get('pair_slug') or item.get('slug')
    a = (item.get('card_a') or {}).get('slug')
    b = (item.get('card_b') or {}).get('slug')
    if ps == 'death-and-the-moon' or {a, b} == {'death', 'the-moon'}:
        found.append(item)

out = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/_extract_dm_out.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump({'count': len(found), 'items': found}, f, ensure_ascii=False, indent=2)
print('FOUND', len(found))
print('OUT', out)
