import json
d=json.load(open('04-内容生产/13.tarot/_qc/_cta-validation.json','r',encoding='utf-8'))
k=list(d.keys())
print('tarot CTA keys:',k[:5],'... total',len(k))
e=d[k[0]]
print('entry type:',type(e).__name__)
print('sample:',json.dumps(e,ensure_ascii=False,indent=1)[:800])
# 收集所有出现的水晶slug的CTA映射
stone_map={}
for kk,v in d.items():
    if isinstance(v,dict):
        for role,info in v.items():
            if isinstance(info,dict) and 'shop_url' in info:
                slug=info.get('shop_url','')
                # 提取stone slug from shop_url like /product-category/fluorite-crystals/
                import re
                m=re.search(r'/product-category/([a-z-]+)-crystals/',slug)
                if m:
                    stone_map[m.group(1)]={'shop_url':info['shop_url'],'meaning_url':info.get('meaning_url','')}
print('=== stone CTA map (from tarot) ===',len(stone_map),'stones')
for s in sorted(stone_map): print(s,'->',stone_map[s]['shop_url'])
