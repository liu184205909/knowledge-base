import urllib.request, ssl, json, re
ctx=ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
def status(url):
    try:
        req=urllib.request.Request(url,headers=UA,method='GET')
        r=urllib.request.urlopen(req,context=ctx,timeout=20)
        return r.getcode()
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return 'ERR:'+str(e)[:30]

# 验证缺失的 kyanite / shungite + meaning 页
missing=['kyanite','shungite']
result={}
for s in missing:
    cat_url=f'https://goearthward.com/product-category/{s}-crystals/'
    cat_st=status(cat_url)
    meaning_url=f'https://goearthward.com/gemstone/{s}-meaning/'
    meaning_st=status(meaning_url)
    shop_st=None
    if cat_st!=200:
        shop_url=f'https://goearthward.com/shop/?s={s}'
        shop_st=status(shop_url)
    result[s]={'category':cat_st,'meaning':meaning_st,'search':shop_st}
    print(s,'CATEGORY',cat_st,'| MEANING',meaning_st,'| SEARCH',shop_st)

# 决定 CTA
final={}
for s,v in result.items():
    if v['category']==200:
        shop_cta='CATEGORY'; shop_url=f'/product-category/{s}-crystals/'
    elif v['search']==200:
        shop_cta='SEARCH'; shop_url=f'/shop/?s={s}'
    else:
        shop_cta='HEALING_JEWELRY'; shop_url='/product-category/healing-jewelry/'
    if v['meaning']==200:
        meaning_cta='INCLUDE'; meaning_url=f'/gemstone/{s}-meaning/'
        no_meaning=False
    else:
        meaning_cta='OMIT'; meaning_url=None; no_meaning=True
    final[s]={'meaning_cta':meaning_cta,'meaning_url':meaning_url,'shop_cta':shop_cta,'shop_url':shop_url,'status':'OK','no_meaning':no_meaning}
print('=== FINAL CTA for missing ===')
print(json.dumps(final,ensure_ascii=False,indent=1))
# 合并 tarot 的全量 + 这两个 → 生成 astrology cta-by-slug
tarot=json.load(open('04-内容生产/13.tarot/_qc/_cta-by-slug.json','r',encoding='utf-8'))
merged=dict(tarot)
merged.update(final)
json.dump(merged,open('04-内容生产/15.astrology/_qc/_cta-by-slug.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('merged total:',len(merged),'written to 15.astrology/_qc/_cta-by-slug.json')
