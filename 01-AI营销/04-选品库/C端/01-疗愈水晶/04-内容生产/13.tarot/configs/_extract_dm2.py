import json
p = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/pair-knowledge.json'
data = json.load(open(p, encoding='utf-8'))
pairs = data['pairs']
hit = None
for it in pairs:
    if it.get('pair_slug') == 'death-and-the-moon':
        hit = it
        break
out = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/_dm.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(hit, f, ensure_ascii=False, indent=2)
# also dump tarot-knowledge death+moon
tk = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/_shared/tarot-knowledge.json'
td = json.load(open(tk, encoding='utf-8'))
cards = td.get('cards', td if isinstance(td, list) else td.get('major_arcana', []))
sel = {}
for c in cards:
    s = c.get('slug')
    if s in ('death', 'the-moon'):
        sel[s] = {k: c.get(k) for k in ('name','number','archetype','element','upright_meaning','reversed_meaning','eastern_imagery','crystals') if k in c}
out2 = r'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/04-内容生产/13.tarot/configs/_dm_cards.json'
with open(out2, 'w', encoding='utf-8') as f:
    json.dump(sel, f, ensure_ascii=False, indent=2)
