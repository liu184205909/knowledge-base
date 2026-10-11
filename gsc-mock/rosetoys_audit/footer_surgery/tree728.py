# -*- coding: utf-8 -*-
# 解析 728 _elementor_data 树：全部元素清单（id/类型/widget类型/关键内容）
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

data = json.load(open(base + 'before_728_elementor_data.json', encoding='utf-8'))

def summ_widget(el):
    st = el.get('settings', {})
    wt = el.get('widgetType', '?')
    out = wt
    keys = ['title', 'text', 'sub_title', 'image', 'selected_icon', 'icon', 'html', 'editor', 'link_text', 'button_text']
    for k in keys:
        if k in st:
            v = st[k]
            if isinstance(v, dict):
                v = v.get('url', str(v))[:80]
            out += f' | {k}={str(v)[:90]}'
    # 菜单 widget
    if 'menus' in st: out += f' | menus={st["menus"]}'
    if 'html_block_id' in st: out += f' | html_block_id={st["html_block_id"]}'
    return out

def walk(els, depth=0):
    for el in els:
        did = el.get('id'); et = el.get('elType')
        if et == 'widget':
            print('  ' * depth + f'[widget {did}] ' + summ_widget(el))
        elif et in ('section', 'container'):
            st = el.get('settings', {})
            extra = []
            if st.get('background_background'): extra.append('bg=' + str(st.get('_background_image', {}).get('url', st.get('background_image', '')))[:70] if isinstance(st.get('_background_image'), dict) else st.get('background_background', ''))
            print('  ' * depth + f'[{et} {did}] ' + ' '.join(str(x)[:100] for x in extra))
            walk(el.get('elements', []), depth + 1)
        elif et == 'column':
            print('  ' * depth + f'[column {did}]')
            walk(el.get('elements', []), depth + 1)

walk(data)
print()
print('=== 统计 ===')
def count(els, t):
    n = 0
    for el in els:
        if el.get('elType') == t: n += 1
        n += count(el.get('elements', []), t)
    return n
for t in ['section', 'container', 'column', 'widget']:
    print(t, count(data, t))
