# -*- coding: utf-8 -*-
# Atomic: write result, no dependency on file-locking; retry open.
import json, re, time
PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/selenite-and-angelite.json'
OUT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/scripts/_finalreport.txt'

def wc(html):
    txt = re.sub(r'<[^>]+>', ' ', html)
    return len(re.sub(r'\s+', ' ', txt).strip().split())

d = None
for _ in range(10):
    try:
        d = json.load(open(PATH, encoding='utf-8'))
        break
    except Exception as e:
        time.sleep(0.5)

c = d['content']
m2_section = c.split('<h2>About Selenite</h2>')[1].split('<h2>About Angelite</h2>')[0]
m3_section = c.split('<h2>About Angelite</h2>')[1].split('<h2>Can You Wear')[0]
m4_section = c.split('<h2>Can You Wear Selenite and Angelite Together?</h2>')[1].split('<h2>Benefits of Selenite + Angelite</h2>')[0]

def body_wc(section):
    paras = re.findall(r'<p>(.*?)</p>', section, re.S)
    body = [p for p in paras if 'href' not in p]
    return sum(wc(p) for p in body)

m2 = body_wc(m2_section)
m3 = body_wc(m3_section)
m4_paras = re.findall(r'<p[^>]*>(.*?)</p>', m4_section, re.S)
m4 = sum(wc(p) for p in m4_paras)
m4_core = sum(wc(p) for p in m4_paras if 'not established by modern research' not in p)

b_section = c.split('<h2>Benefits of Selenite + Angelite</h2>')[1].split('<h2>How to Use')[0]
ben = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', b_section, re.S)
u_section = c.split('<h2>How to Use Selenite and Angelite Together</h2>')[1].split('<h2>Caring for')[0]
uses = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', u_section, re.S)

banned = ['anxiety','under the pillow','upper-chakra opening','Scientifically',' sio','heal ','cure ','insomnia','depression']
hits = {w: len(re.findall(re.escape(w), c, re.I)) for w in banned}

L = []
L.append('M2_body_wc=%d (limit 100-150)' % m2)
L.append('M3_body_wc=%d (limit 100-150)' % m3)
L.append('M4_total_wc=%d | M4_core_wc=%d (limit 200-250)' % (m4, m4_core))
L.append('--- benefits ---')
for t,p in ben: L.append('%s = %d' % (t, wc(p)))
L.append('--- uses ---')
for t,p in uses: L.append('%s = %d' % (t, wc(p)))
L.append('--- banned ---')
for w,n in hits.items(): L.append('%s=%d' % (w,n))
L.append('CaSO_present=%s' % ('CaSO' in c))
L.append('AGENT_M_left=%d' % c.count('AGENT_M'))
L.append('modules.m5.benefits=%d' % len(d['modules']['m5_agent']['benefits']))

for _ in range(10):
    try:
        open(OUT,'w',encoding='utf-8').write('\n'.join(L))
        break
    except Exception:
        time.sleep(0.3)
