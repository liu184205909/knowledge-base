import json, re, os
p = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/5.crystal-combinations/articles/black-tourmaline-and-rhodonite.json'
d = json.load(open(p, encoding='utf-8'))
c = d['content']

def words(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    return len(re.findall(r"[A-Za-z0-9']+", s))

# Split modules by h2 boundaries
def section(name):
    idx = c.find('<h2>'+name)
    if idx == -1: return ''
    nxt = c.find('<h2>', idx+4)
    return c[idx:nxt if nxt!=-1 else len(c)]

m2 = section('About Black Tourmaline')
m3 = section('About Rhodonite')
m4 = section('Can You Wear Black Tourmaline and Rhodonite Together')
m5 = section('Benefits of Black Tourmaline + Rhodonite')
m6 = section('How to Use Black Tourmaline and Rhodonite Together')

print('placeholder_left:', '<!-- AGENT_M' in c)
print('m2_words:', words(m2))
print('m3_words:', words(m3))
print('m4_words:', words(m4))
print('m5_h3_count:', m5.count('<h3>'))
print('m6_h3_count:', m6.count('<h3>'))

low = c.lower()
print('BAN_anxiety:', 'anxiety' in low)
print('BAN_pillow:', 'under the pillow' in low or 'pillow' in low)
print('BAN_upper_chakra_opening:', 'upper-chakra opening' in low)
print('BAN_Scientifically:', 'Scientifically' in c)
print('BAN_heal:', ' heal ' in low)
print('BAN_cure:', 'cure' in low)
# chemical formula case preserved
print('formula_schorl_ok:', 'NaFe' in c)
print('formula_sio3_ok:', 'SiO' in d['stones']['b']['mineral']['Formula'])
