# -*- coding: utf-8 -*-
"""Auto-fix placeholder deficits: insert missing @@IMG@@ slots after </ul> (before the closing paragraph)."""
import json, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))

def fix(plan_path):
    p = json.load(open(os.path.join(HERE, plan_path), encoding='utf-8'))
    media = json.load(open(os.path.join(HERE, 'media_counts.json'), encoding='utf-8'))
    for pid, it in p.items():
        d = it['desc']
        want = media[pid][0]
        ifr = media[pid][1]
        cur_img = d.count('@@IMG@@') + d.count(chr(0x27E6) + 'IMG' + chr(0x27E7))
        cur_if = d.count('@@IF@@') + d.count(chr(0x27E6) + 'IFRAME' + chr(0x27E7))
        need = want - cur_img
        for _ in range(need):
            if '</ul>\n' in d:
                d = d.replace('</ul>\n', '</ul>\n@@IMG@@\n', 1)
            else:
                d = d.rstrip() + '\n@@IMG@@'
        for _ in range(ifr - cur_if):
            d = d.rstrip() + '\n@@IF@@'
        it['desc'] = d
    json.dump(p, open(os.path.join(HERE, plan_path), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('placeholders autofixed for', plan_path)

if __name__ == '__main__':
    fix(sys.argv[1])
