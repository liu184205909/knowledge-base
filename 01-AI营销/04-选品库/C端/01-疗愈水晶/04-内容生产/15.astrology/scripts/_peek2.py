import json
d=json.load(open('04-内容生产/13.tarot/_qc/_cta-by-slug.json','r',encoding='utf-8'))
print('total stones in tarot cta-by-slug:',len(d))
print('keys:',sorted(d.keys()))
for s in ['fluorite','quartz','kyanite','lapis','amazonite','shungite','sodalite','smoky-quartz','moonstone','garnet','tiger-eye','selenite','amethyst','obsidian','hematite','labradorite','black-tourmaline','citrine','rose-quartz','rhodonite','red-jasper','carnelian','bloodstone','malachite','aquamarine','sunstone','aventurine','angelite']:
    v=d.get(s)
    print(s,'->',json.dumps(v,ensure_ascii=False) if v else 'MISSING')
