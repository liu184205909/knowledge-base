import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')
base = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/'
out = {}
SCENARIOS = ['love', 'career', 'finances', 'health', 'spiritual']
def crystal_img(slug):
    return f'02-网站规划/assets/images/generated/1.crystal-meaning/{slug}/{slug}-hero.webp'

# 场景正位 110
s = json.load(open(base + '04-内容生产/13.tarot/configs/scenario-knowledge.json', encoding='utf-8'))
for c in s['cards']:
    for sc_name in SCENARIOS:
        sc = c['scenarios'][sc_name]
        slug = f"{c['card']}-for-{sc_name}"
        crystals = (sc.get('crystals') or [])[:3]
        out[slug] = {
            'type': 'scenario-upright',
            'hero': f'02-网站规划/images/tarot-scenario/{slug}.webp',
            'crystals': [{'slug': cs, 'img': crystal_img(cs)} for cs in crystals if cs],
            'total_images': 1 + len([cs for cs in crystals if cs])
        }

# 场景逆位 110（hero 待生，清单预留）
for c in s['cards']:
    for sc_name in SCENARIOS:
        sc = c['scenarios'][sc_name]
        slug = f"{c['card']}-for-{sc_name}-reversed"
        crystals = (sc.get('crystals') or [])[:3]
        out[slug] = {
            'type': 'scenario-reversed',
            'hero': f'02-网站规划/images/tarot-scenario/{slug}.webp',
            'hero_status': 'pending',
            'crystals': [{'slug': cs, 'img': crystal_img(cs)} for cs in crystals if cs],
            'total_images': 1 + len([cs for cs in crystals if cs])
        }

# 配对 231
p = json.load(open(base + '04-内容生产/13.tarot/configs/pair-knowledge.json', encoding='utf-8'))
for pair in p['pairs']:
    a = pair['card_a']['slug'] if isinstance(pair['card_a'], dict) else pair['card_a']
    b = pair['card_b']['slug'] if isinstance(pair['card_b'], dict) else pair['card_b']
    ps = pair.get('pair_slug') or f'{a}-and-{b}'
    cs = pair.get('crystal_synergy') or {}
    def get_slug(x):
        if isinstance(x, str): return x
        if isinstance(x, dict): return x.get('slug') or x.get('a_slug') or x.get('b_slug')
        return None
    a_slug = get_slug(cs.get('a'))
    b_slug = get_slug(cs.get('b'))
    crystals = [x for x in [a_slug, b_slug] if x]
    out[ps] = {
        'type': 'pair',
        'hero': f'02-网站规划/images/tarot-pair/{ps}.webp',
        'crystals': [{'slug': x, 'img': crystal_img(x)} for x in crystals],
        'total_images': 1 + len(crystals)
    }

json.dump(out, open(base + '04-内容生产/13.tarot/configs/articles-images.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
# 验证图存在率
import glob
exist_hero_scn = sum(1 for k,v in out.items() if v['type'].startswith('scenario') and v.get('hero_status')!='pending' and os.path.exists(base+v['hero']))
exist_hero_pair = sum(1 for k,v in out.items() if v['type']=='pair' and os.path.exists(base+v['hero']))
exist_crystal = sum(1 for k,v in out.items() for cc in v['crystals'] if os.path.exists(base+cc['img']))
total_crystal = sum(len(v['crystals']) for v in out.values())
print(f'图清单: {len(out)}篇 (场景正位110+逆位110+配对231)')
print(f'场景正位hero存在: {exist_hero_scn}/110')
print(f'配对hero存在: {exist_hero_pair}/231')
print(f'水晶图存在: {exist_crystal}/{total_crystal}')
print(f'每篇图数: 场景{out[list(out)[0]]["total_images"]}图(1hero+3水晶) / 配对3图(1hero+2水晶)')
