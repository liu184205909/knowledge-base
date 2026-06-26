# -*- coding: utf-8 -*-
import json, re
PATH = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/selenite-and-angelite.json'
OUT = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/scripts/_wc_result.txt'
d = json.load(open(PATH, encoding='utf-8'))
c = d['content']

def wc(html):
    txt = re.sub(r'<[^>]+>', ' ', html)
    txt = re.sub(r'\s+', ' ', txt).strip()
    return len(txt.split())

m2_section = c.split('<h2>About Selenite</h2>')[1].split('<h2>About Angelite</h2>')[0]
m3_section = c.split('<h2>About Angelite</h2>')[1].split('<h2>Can You Wear')[0]
m4_section = c.split('<h2>Can You Wear Selenite and Angelite Together?</h2>')[1].split('<h2>Benefits of Selenite + Angelite</h2>')[0]

def body_paras(section):
    paras = re.findall(r'<p>(.*?)</p>', section, re.S)
    body = [p for p in paras if 'href' not in p]
    return body

m2b = body_paras(m2_section)
m3b = body_paras(m3_section)
m4_paras = re.findall(r'<p[^>]*>(.*?)</p>', m4_section, re.S)
m4_no_disc = [p for p in m4_paras if 'not established by modern research' not in p]

lines = []
lines.append('M2 body paras wc: %s => total %d' % ([wc(p) for p in m2b], sum(wc(p) for p in m2b)))
lines.append('M3 body paras wc: %s => total %d' % ([wc(p) for p in m3b], sum(wc(p) for p in m3b)))
lines.append('M4 wc (incl disclaimer): %d' % sum(wc(p) for p in m4_paras))
lines.append('M4 wc excl disclaimer: %d' % sum(wc(p) for p in m4_no_disc))

# M5 benefits word counts
b_section = c.split('<h2>Benefits of Selenite + Angelite</h2>')[1].split('<h2>How to Use')[0]
h3s = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', b_section, re.S)
lines.append('--- M5 benefits ---')
for t, p in h3s:
    lines.append('%s : %d words' % (t, wc(p)))

# M6 uses word counts
u_section = c.split('<h2>How to Use Selenite and Angelite Together</h2>')[1].split('<h2>Caring for')[0]
uh3s = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', u_section, re.S)
lines.append('--- M6 uses ---')
for t, p in uh3s:
    lines.append('%s : %d words' % (t, wc(p)))

# banned word scan over full content
banned = ['anxiety', 'under the pillow', 'upper-chakra opening', 'Scientifically', ' sio', 'heal ', 'cure ', 'insomnia', 'depression']
lines.append('--- banned scan ---')
for w in banned:
    n = len(re.findall(re.escape(w), c, re.IGNORECASE))
    lines.append('%s : %d' % (repr(w), n))
lines.append('CaSO present: %s' % ('CaSO' in c))
lines.append('AGENT_M left: %d' % c.count('AGENT_M'))

open(OUT, 'w', encoding='utf-8').write('\n'.join(lines))
print('done')
