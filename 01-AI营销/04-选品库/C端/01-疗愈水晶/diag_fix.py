# -*- coding: utf-8 -*-
with open('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/ewmoon_extracted.js','r',encoding='utf-8') as f:
    src = f.read()

APOS = chr(0x27)  # '
BACK = chr(0x5C)  # \

# 第46行: >Today's Crystal</div>  -> >Today\'s Crystal</div>
t1 = ">" + "Today" + APOS + "s Crystal</div>"
t1f = ">" + "Today" + BACK + APOS + "s Crystal</div>"
# 第48行: >Today's theme:
t2 = ">" + "Today" + APOS + "s theme: "
t2f = ">" + "Today" + BACK + APOS + "s theme: "

print("t1 in src:", t1 in src)
print("t2 in src:", t2 in src)

fixed = src.replace(t1, t1f).replace(t2, t2f)
print("changed:", fixed != src)

with open('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/ewmoon_fixed.js','w',encoding='utf-8') as f:
    f.write(fixed)

for i,ln in enumerate(fixed.split('\n')[43:49], 44):
    print(f'{i}: {ln}')
