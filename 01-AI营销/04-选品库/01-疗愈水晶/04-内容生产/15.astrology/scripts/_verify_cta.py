import urllib.request, json, ssl, base64
ctx=ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
auth=base64.b64encode(b'lzn184205909@gmail.com:QsF9VjRLDNzN9JXCI72f6HmN').decode()
stones=['fluorite','amazonite','black-tourmaline','labradorite','hematite','kyanite','shungite','obsidian','lapis','sodalite','amethyst','selenite','smoky-quartz','citrine','moonstone','quartz','garnet','tiger-eye','red-jasper','carnelian','bloodstone','malachite','aquamarine','sunstone','rose-quartz','rhodonite','aventurine','pyrite','angelite','blue-lace-agate','apatite','howlite','prehnite']
ok=[]; miss=[]
for s in stones:
    url=f'https://goearthward.com/wp-json/wc/store/v1/products/categories?slug={s}-crystals'
    try:
        req=urllib.request.Request(url, headers={'Authorization':'Basic '+auth})
        r=urllib.request.urlopen(req,context=ctx,timeout=15)
        data=json.loads(r.read().decode())
        if len(data)>0: ok.append(s)
        else: miss.append(s)
    except Exception as e:
        miss.append(s+'(ERR:'+str(e)[:20]+')')
print('OK',len(ok),ok)
print('MISS',len(miss),miss)
