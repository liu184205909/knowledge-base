# -*- coding: utf-8 -*-
import json, re
PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/selenite-and-angelite.json'
try:
    d = json.load(open(PATH, encoding='utf-8'))
    print('VALID JSON')
except Exception as e:
    print('JSON ERROR:', repr(e))
    raise SystemExit(1)

c = d['content']
m = d['modules']
print('tier:', d['tier'])
print('content length:', len(c))
print('AGENT_M left:', c.count('AGENT_M'))
print('m2.words:', m['m2_agent']['words'], '| m3.words:', m['m3_agent']['words'])
print('m4.perspectives:', m['m4_agent']['perspectives'])
print('m5.benefits:', len(m['m5_agent']['benefits']))
for b in m['m5_agent']['benefits']:
    print('   -', b['title'], '=>', b['source'])
print('m6.longtail:', m['m6_agent']['longtail'])
print('CaSO present:', 'CaSO' in c)
banned = ['anxiety', 'under the pillow', 'upper-chakra opening', 'Scientifically', ' sio', 'heal ', 'cure', 'insomnia', 'depression']
for w in banned:
    n = len(re.findall(re.escape(w), c, re.IGNORECASE))
    print('BAN', repr(w), n)
