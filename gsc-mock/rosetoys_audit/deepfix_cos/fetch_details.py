# -*- coding: utf-8 -*-
import json, subprocess, time, os
AUTH="lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
HERE=os.path.dirname(os.path.abspath(__file__))
inv=json.load(open(os.path.join(HERE,'inventory.json'),encoding='utf-8'))
ids=sorted(inv.keys(),key=int)
done=set()
if os.path.exists(os.path.join(HERE,'details_all.json')):
    done=set(json.load(open(os.path.join(HERE,'details_all.json'),encoding='utf-8')).keys())
out={} if not done else json.load(open(os.path.join(HERE,'details_all.json'),encoding='utf-8'))
for i,pid in enumerate(ids):
    if pid in done: continue
    r=subprocess.run(["curl","-s","--max-time","60","-A",UA,"-u",AUTH,
        f"https://rosetoys.org/wp-json/wc/v3/products/{pid}"],capture_output=True,text=True,encoding="utf-8")
    try: d=json.loads(r.stdout)
    except Exception as e:
        print(pid,'ERR',r.stdout[:100]); continue
    keep={k:d.get(k) for k in ['id','name','slug','price','description','short_description','categories','images','attributes','meta_data']}
    out[pid]=keep
    with open(os.path.join(HERE,'_before_%s.json'%pid),'w',encoding='utf-8') as f:
        json.dump(keep,f,ensure_ascii=False,indent=1)
    if (i+1)%20==0:
        json.dump(out,open(os.path.join(HERE,'details_all.json'),'w',encoding='utf-8'),ensure_ascii=False)
        print(i+1,'saved')
    time.sleep(0.8)
json.dump(out,open(os.path.join(HERE,'details_all.json'),'w',encoding='utf-8'),ensure_ascii=False)
print('total fetched:',len(out))
