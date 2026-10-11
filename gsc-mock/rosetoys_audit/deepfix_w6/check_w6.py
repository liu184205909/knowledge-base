# -*- coding: utf-8 -*-
"""Wave 6 local pre-flight check: word counts, char lengths, slop, banned words."""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan_source_w6 import PLAN

SLOP = ['elevate', 'effortless', 'timeless', 'perfect', 'must-have', 'must have',
        'whether you', 'whether it', 'unleash', 'look no further', 'game-changer',
        'stunning', 'unlock', 'level up']
BANNED = ['swim', 'pool', 'beach', 'tanning', 'lovingocean', 'children', 'child',
          'kids', 'baby', 'little one', '&']

def words(s):
    return len(re.findall(r"[A-Za-z0-9'+-]+", re.sub(r'<[^>]+>', ' ', s)))

problems = []
print(f"{'id':6} {'desc_w':>6} {'short_w':>7} {'tkdT':>5} {'tkdD':>5}")
for pid in sorted(PLAN, key=int):
    it = PLAN[pid]
    dw, sw = words(it['desc']), words(it['short'])
    tt, td = len(it['tkd_title']), len(it['tkd_desc'])
    print(f"{pid:6} {dw:6} {sw:7} {tt:5} {td:5}")
    if not (150 <= dw <= 200): problems.append(f"{pid}: desc words {dw}")
    if not (20 <= sw <= 30): problems.append(f"{pid}: short words {sw}")
    if not (tt <= 60): problems.append(f"{pid}: tkd_title len {tt}")
    if not (118 <= td <= 155): problems.append(f"{pid}: tkd_desc len {td}")
    if not it['tkd_title'].endswith(' | RoseToys'): problems.append(f"{pid}: tkd_title suffix")
    blob = (it['desc'] + it['short'] + it['tkd_desc'] + it['new_name'] + it['tkd_title']).lower()
    for w in SLOP:
        if w in blob: problems.append(f"{pid}: slop '{w}'")
    for w in BANNED:
        if w in blob: problems.append(f"{pid}: banned '{w}'")

# internal phrase-repeat check (10+ char distinctive phrases used twice+)
import collections
phrases = collections.Counter()
for pid, it in PLAN.items():
    txt = re.sub(r'<[^>]+>', ' ', it['desc']).lower()
    toks = re.findall(r"[a-z'-]+", txt)
    for i in range(len(toks) - 4):
        phrases[' '.join(toks[i:i+5])] += 1
dups = [(p, c) for p, c in phrases.items() if c >= 2 and len(p) > 25]
print("\ninternal 5-gram dups:", dups[:20])

print("\nPROBLEMS:" if problems else "\nALL CHECKS PASS")
for p in problems:
    print(" -", p)
