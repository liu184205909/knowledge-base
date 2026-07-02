import json, io
d = json.load(open('pair-knowledge.json', encoding='utf-8'))
pairs = d['pairs']
target = 'the-chariot-and-the-devil'
found = None
for p in pairs:
    if p.get('pair_slug') == target:
        found = p
        break
out = []
if not found:
    out.append('NOT FOUND. Total pairs: ' + str(len(pairs)))
    for p in pairs:
        if 'chariot' in p.get('pair_slug','') and 'devil' in p.get('pair_slug',''):
            out.append('  match: ' + p['pair_slug'])
        elif 'chariot' in p.get('pair_slug',''):
            out.append('  chariot: ' + p['pair_slug'])
else:
    out.append(json.dumps(found, ensure_ascii=False, indent=2))
open('_extract_out.txt','w',encoding='utf-8').write('\n'.join(out))
