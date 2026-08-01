import json, re
art = json.load(open('articles/mercury-retrograde.json','r',encoding='utf-8'))
content = art['content']
text = re.sub(r'<[^>]+>',' ',content).lower()
for p in [r'\bbad luck\b', r'\bdoom\b', r'\bcursed\b', r'\bdisaster\b', r'\bguaranteed\b', r'\bdestined\b', r'\bwill heal\b', r'\bwill attract\b', r'\bmeant to\b', r'\bcure\b']:
    for m in re.finditer(p, text):
        ctx = text[max(0,m.start()-50):m.end()+50]
        print(repr(m.group(0)), '->', repr(ctx))
