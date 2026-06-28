import re
f = r"D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/9.angel-numbers/_placeholders/606.txt"
t = open(f, encoding='utf-8').read()
seg = re.findall(r'@@@AI_[^@]+@@@', t)
print('segments:', len(seg))
clean = re.sub(r'@@@[^@]+@@@', ' ', t)
clean = re.sub(r'<[^>]+>', ' ', clean)
words = re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", clean)
print('wordcount:', len(words))
md = re.search(r'@@@AI_META_DESC@@@\s*(.+)', t).group(1).strip()
print('meta_chars:', len(md))
banned = ['delve','harness','landscape','realm','tapestry','unlock','navigate','journey',
          'transformative','elevate','vibrant','intricate','robust','seamless','leverage',
          'foster','underscore','paramount','plethora','myriad','beacon','conduit',
          'moreover','furthermore','shed light','pave the way','when it comes to','serves as',
          'in today','it is important to note']
low = clean.lower()
hits = [b for b in banned if re.search(r'\b' + re.escape(b) + r'\b', low)]
print('banned_hits:', hits)
