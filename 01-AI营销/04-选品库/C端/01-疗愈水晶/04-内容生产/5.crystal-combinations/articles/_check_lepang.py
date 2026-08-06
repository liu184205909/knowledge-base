import json, re, os
f = os.path.join(os.path.dirname(__file__), 'lepidolite-and-angelite.json')
d = json.load(open(f, encoding='utf-8'))
c = d['content']

def block(c, start, end):
    s = c.find(start)
    e = c.find(end, s + len(start))
    return c[s:e]

m2 = block(c, '<h2>About Lepidolite</h2>', '<h2>About Angelite</h2>')
m3 = block(c, '<h2>About Angelite</h2>', '<h2>Can You Wear')
m4 = block(c, '<h2>Can You Wear', '<h2>Benefits of')

def wc(t):
    t = re.sub(r'<[^>]+>', ' ', t)
    return len(re.findall(r"[A-Za-z][A-Za-z'-]*", t))

print('M2 words:', wc(m2))
print('M3 words:', wc(m3))
print('M4 words:', wc(m4))
print('placeholders left:', c.count('AGENT_M'))
print('modules keys:', list(d['modules'].keys()))
print('m5 benefits count:', len(d['modules']['m5_agent']['benefits']))
print('m5 filled:', d['modules']['m5_agent']['filled'])
print('m6 filled:', d['modules']['m6_agent']['filled'])
print('m6 longtail:', d['modules']['m6_agent']['longtail'])
print('JSON valid: OK')
