import json, re, io, sys
p = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/amethyst-and-rose-quartz.json'
d = json.load(open(p, encoding='utf-8'))
c = d['content']
m2 = re.search(r'About Amethyst</h2>(.+?)<h2>About Rose Quartz', c, re.S).group(1)
m3 = re.search(r'About Rose Quartz</h2>(.+?)<h2>Can You Wear', c, re.S).group(1)
m4 = re.search(r'Can You Wear Amethyst and Rose Quartz Together\?</h2>(.+?)<h2>Benefits', c, re.S).group(1)
strip = lambda t: len(re.sub('<[^>]+>', '', t).split())
low = c.lower()
banned = ['anxiety', 'under the pillow', 'upper-chakra opening', 'scientifically', 'heal ', 'cure ', 'insomnia', 'depression']
found = [b for b in banned if b in low]
# formula presence (use repr to avoid unicode print crash)
has_sio = 'SiO' in c  # subscript char follows but 'SiO' prefix is ascii
has_lower_bad = ('sio' in low) and not ('SiO' in c)
lines = [
  'JSON-OK',
  'M2=' + str(strip(m2)),
  'M3=' + str(strip(m3)),
  'M4=' + str(strip(m4)),
  'BANNED=' + str(found),
  'SiO_present=' + str(has_sio),
  'lowercase_bad=' + str(has_lower_bad),
  'm5count=' + str(len(d['modules']['m5_agent']['benefits'])),
  'mods=' + str(list(d['modules'].keys())),
]
open('D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/_validate_result.txt','w',encoding='utf-8').write('\n'.join(lines))
