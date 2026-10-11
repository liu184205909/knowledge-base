# -*- coding: utf-8 -*-
"""Plan validator for wave 4 toy line: JSON parse, word/char budgets, slop scan, media placeholder counts."""
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
SLOP = ['elevate', 'effortless', 'timeless', 'perfect', 'must-have', 'must have',
        'whether you', 'whether it', 'unleash', 'look no further', 'game-changer',
        'stunning', 'unlock', 'level up']
# extra template-crap watchlist (warn only)
WATCH = ['like never before', 'new heights', 'craving more', 'unveil', 'embark',
         'revolutionary', 'ultimate', 'mind-blowing', 'unparalleled', 'sensational',
         'exquisite', 'groundbreaking', 'state-of-the-art', 'cutting-edge', 'delve']

def words(s):
    return len(re.findall(r"[A-Za-z0-9'+-]+", re.sub(r'<[^>]+>', ' ', s)))

def strip_tags(s):
    return re.sub(r'<[^>]+>', ' ', s).replace('⟦IMG⟧', ' ').replace('⟦IFRAME⟧', ' ')

def main(plan_path):
    plan = json.load(open(os.path.join(HERE, plan_path), encoding='utf-8'))
    media = json.load(open(os.path.join(HERE, 'media_counts.json'), encoding='utf-8'))
    errs, warns = [], []
    for pid, it in plan.items():
        dw = words(it['desc'])
        sw = words(it['short'])
        tl, dl = len(it['tkd_title']), len(it['tkd_desc'])
        if not (150 <= dw <= 225): errs.append(f"{pid}: desc words {dw}")
        if not (18 <= sw <= 32): errs.append(f"{pid}: short words {sw}")
        if tl > 60: errs.append(f"{pid}: tkd_title len {tl}")
        if 'RoseToys' not in it['tkd_title']: errs.append(f"{pid}: tkd_title no RoseToys")
        if not (115 <= dl <= 155): errs.append(f"{pid}: tkd_desc len {dl}")
        blob = (it['desc'] + it['short'] + it['tkd_title'] + it['tkd_desc'] + it['new_name']).lower()
        for w in SLOP:
            if w in blob: errs.append(f"{pid}: SLOP '{w}'")
        for w in WATCH:
            if w in blob: warns.append(f"{pid}: watch '{w}'")
        ph = it['desc'].count('⟦IMG⟧') + it['desc'].count('@@IMG@@')
        phf = it['desc'].count('⟦IFRAME⟧') + it['desc'].count('@@IF@@')
        ni, nf = media.get(pid, (0, 0))
        if ph != ni or phf != nf:
            errs.append(f"{pid}: placeholders IMG {ph}/{ni} IFRAME {phf}/{nf}")
        if '??' in blob or '�' in blob: errs.append(f"{pid}: mojibake")
        # html sanity: balanced p/ul
        for tag in ('p', 'ul', 'li', 'strong'):
            o = len(re.findall(f'<{tag}[ >]', it['desc'])); c = it['desc'].count(f'</{tag}>')
            if o != c: errs.append(f"{pid}: <{tag}> {o} open vs {c} close")
    print(f"== {plan_path}: {len(plan)} items, {len(errs)} errors, {len(warns)} warnings")
    for e in errs: print("ERR", e)
    for w in warns: print("WARN", w)
    return 1 if errs else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
