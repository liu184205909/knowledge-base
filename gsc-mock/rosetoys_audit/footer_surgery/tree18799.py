# -*- coding: utf-8 -*-
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'
d = json.load(open(base + 'recon18799.json', encoding='utf-8'))
data = json.loads(d['meta']['_elementor_data'])

def walk(els, depth=0):
    for el in els:
        did = el.get('id'); et = el.get('elType')
        if et == 'widget':
            st = el.get('settings', {})
            print('  '*depth + f"[widget {did}] {el.get('widgetType')}")
            for k, v in st.items():
                if k in ('image','selected_image','_background_image','background_image','site_logo') or 'image' in k.lower() or 'icon' in k.lower():
                    print('  '*depth + f"   {k} = {json.dumps(v, ensure_ascii=False)[:150]}")
        else:
            print('  '*depth + f"[{et} {did}]")
            walk(el.get('elements', []), depth+1)
walk(data)
