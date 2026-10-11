# -*- coding: utf-8 -*-
"""Wave-5 special check: categories untouched for the 14 SKUs 57-hao moved.
Only the 8 inside wave-5 scope are expected here; verify their categories
still match the 57-hao final state."""
import json, subprocess, time
AUTH="lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA=("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
EXPECT={  # id -> set of term ids that must be present (57-hao final state)
 '19149':{183},'19153':{183},'19461':{183},'20383':{183},'19157':{183},
 '18996':{179},'18990':{179},'20186':{20},
}
ok=True
for pid,exp in sorted(EXPECT.items()):
    r=subprocess.run(["curl","-s","--max-time","60","-A",UA,"-u",AUTH,
        f"https://rosetoys.org/wp-json/wc/v3/products/{pid}"],
        capture_output=True,text=True,encoding="utf-8")
    d=json.loads(r.stdout)
    cats=set(c['id'] for c in d.get('categories',[]))
    good=exp.issubset(cats)
    ok&=good
    print(pid,'cats=',sorted(cats),'expected-subset=',sorted(exp),'OK' if good else 'FAIL')
    time.sleep(0.8)
print('ALL OK' if ok else 'SOME FAILED')
