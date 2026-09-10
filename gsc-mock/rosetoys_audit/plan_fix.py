# -*- coding: utf-8 -*-
"""rosetoys 481 SKU 机械批修计划生成器 v2：剥货号前缀 + alt + TKD"""
import json, re

BASE = r"D:\Code\knowledge-base\gsc-mock\rosetoys_audit"

def strip_tags(html):
    t = re.sub(r'<[^>]+>', ' ', html or '')
    t = t.replace('&nbsp;', ' ').replace('&amp;', '&')
    return re.sub(r'\s+', ' ', t).strip()

# 货号前缀两种形态：dash（M-294/LT-051R，实测310个）与空格（M 382/Py 605，实测24个）
# 空格形态收紧为 1-2 字母防"Boy 2 Piece"类误伤；最多循环剥 2 次（双货号实测 1 个）
SKU_DASH = re.compile(r'^[A-Za-z]{1,3}-\d+[A-Za-z]?\s+')
SKU_SPACE = re.compile(r'^[A-Za-z]{1,2}\s+\d+[A-Za-z]?\s+')

def clean_name(name):
    """返回 (new_name, stripped)。剥后<10字符返回 (None, True)。"""
    n = re.sub(r'\s{2,}', ' ', name).strip()
    stripped = False
    for _ in range(2):
        m = SKU_DASH.match(n) or SKU_SPACE.match(n)
        if not m:
            break
        rest = n[m.end():].strip()
        if len(rest) < 10:
            break
        n, stripped = rest, True
    else:
        pass
    # 循环结束仍以货号开头 = 剥后必过短 → 跳过该产品标题
    if SKU_DASH.match(n) or SKU_SPACE.match(n):
        return None, True
    if n:
        n = n[0].upper() + n[1:]
    return n, stripped

FIELD_SPLIT = re.compile(
    r'(Material\s*:|Product type\s*:|Project type\s*:|Type of item\s*:'
    r'|Item type\s*:|Single item type\s*:|Item Type\s*:'
    r'|Features?\s*:|Specialty\s*:|Colou?rs?\s*:|Specifications?\s*:'
    r'|Size\s*:|Recommended weight\s*:?)', re.I)

KEYMAP = {'type of item': 'itemtype', 'project type': 'itemtype',
          'single item type': 'itemtype', 'item type': 'itemtype',
          'product type': 'itemtype',
          'specialty': 'feature', 'features': 'feature', 'feature': 'feature',
          'specification': 'size', 'specifications': 'size',
          'colour': 'color', 'colors': 'color', 'color': 'color'}

def parse_fields(text):
    out = {}
    pos = [(m.start(), m.group(1)) for m in FIELD_SPLIT.finditer(text)]
    for i, (st, label) in enumerate(pos):
        end = pos[i+1][0] if i+1 < len(pos) else len(text)
        val = text[st+len(label):end].strip(' :;,.')
        val = re.sub(r'\s{2,}', ' ', val).strip()
        key = re.sub(r'\s*:$', '', label).lower()
        key = KEYMAP.get(key, key)
        out.setdefault(key, val)
    return out

def weight_range(text):
    """从全文提取体重范围；多单位时优先磅。返回如 '85-140 pounds' / '40-75kg'"""
    rng = re.findall(r'(\d+)\s*[-–~]\s*(\d+)\s*(pounds?|lbs|kg)\b', text, re.I)
    if rng:
        lbs = [t for t in rng if t[2].lower().startswith(('pound', 'lb'))]
        grp = lbs if lbs else rng
        lo = min(int(a) for a, b, u in grp)
        hi = max(int(b) for a, b, u in grp)
        unit = grp[0][2].lower()
        unit = 'lbs' if unit.startswith(('pound', 'lb')) else unit
        return f"{lo}-{hi} {unit}".replace(' ', '') if unit == 'kg' else f"{lo}-{hi} lbs"
    m = re.search(r'(\d+)\s*(pounds?|lbs|kg)\b', text, re.I)
    if m:
        unit = m.group(2).lower()
        unit = 'lbs' if unit.startswith(('pound', 'lb')) else unit
        return m.group(1) + unit
    return None

def trunc_word(s, maxlen):
    if len(s) <= maxlen:
        return s
    cut = s[:maxlen]
    sp = cut.rfind(' ')
    return cut[:sp] if sp > maxlen - 25 else cut.rstrip()

def first_sentences(text, target=155):
    """从营销长文 desc 摘开头自然句到 120-155"""
    t = re.sub(r'^\s*product\s+(details|description)\s*:?\s*', '', text, flags=re.I)
    sents = re.split(r'(?<=[.!?])\s+', t)
    out = ''
    for s in sents:
        if out and len(out) + len(s) + 1 > target:
            break
        out = (out + ' ' + s).strip()
        if len(out) >= 120:
            break
    return out

def gen_desc(name, desc_html):
    """120-155 字符 meta description；只用 description 实际参数 + 标题/品牌事实"""
    text = strip_tags(desc_html)
    f = parse_fields(text)
    # 非参数表（营销长文）：摘开头自然句
    if not (f.get('material') or f.get('color') or f.get('feature')
            or f.get('size') or f.get('itemtype')):
        if len(text) > 80:
            s = first_sentences(text)
            if len(s) >= 100:
                return trunc_word(s, 155), f
    core = name[0].lower() + name[1:]
    material = (f.get('material') or '').strip()
    color = (f.get('color') or '').strip()
    feature = (f.get('feature') or '').strip()
    itemtype = (f.get('itemtype') or '').strip()
    low = text.lower()

    # 主句
    main = f"{material} {core}" if material else core
    if feature and feature.lower() not in core.lower():
        main += f" with {feature[0].lower() + feature[1:]}"
    if color:
        main += f" in {color.replace('/', ', ').lower()}"
    main = main.rstrip(' .') + '.'
    sentences = [main]

    w = weight_range(text)
    used_w = False
    if 'one size' in low:
        if w:
            sentences.append(f"One size, recommended weight {w}.")
            used_w = True
        else:
            sentences.append("One size.")
    elif all(re.search(rf'\b{L}\b', text) for L in 'SML'):
        sentences.append("Available in S, M and L.")

    desc = ' '.join(sentences)
    # 不足 118 补素材：套装内容 → 体重 → 品牌句
    if len(desc) < 118 and itemtype and '+' in itemtype \
            and itemtype.lower() not in core.lower():
        desc = desc + f" Includes {itemtype.rstrip('.')}."
    if len(desc) < 118 and w and not used_w:
        desc = desc[:-1] + f", recommended weight {w}."
        used_w = True
    if len(desc) < 118:
        desc = desc[:-1] + ", available at RoseToys."
    return trunc_word(desc, 155), f

def main():
    prods = json.load(open(BASE + r'\all_publish.json', encoding='utf-8'))
    plan, skipped = [], []
    for p in prods:
        new_name, stripped = clean_name(p['name'])
        name_skipped = False
        if new_name is None:
            skipped.append({'id': p['id'], 'name': p['name'], 'reason': '剥前缀后<10字符'})
            new_name = re.sub(r'\s{2,}', ' ', p['name']).strip()
            name_skipped = True
        entry = {
            'id': p['id'], 'slug': p['slug'], 'permalink': p['permalink'],
            'old_name': p['name'], 'new_name': new_name, 'stripped': stripped,
            'name_changed': (not name_skipped) and new_name != p['name'],
            'name_skipped_short': name_skipped,
            'images': [{'id': im['id'], 'old_alt': im.get('alt') or '',
                        'new_alt': new_name} for im in p['images']],
        }
        t = new_name + ' | RoseToys'
        if len(t) > 60:
            t = trunc_word(new_name, 60 - len(' | RoseToys')) + ' | RoseToys'
        entry['tkd_title'] = t
        entry['tkd_desc'], _ = gen_desc(new_name, p['description'])
        if len(entry['tkd_desc']) < 110:
            # 短句回退：营销长文摘句取更长者
            raw = strip_tags(p['description'])
            if len(raw) > 150:
                s = trunc_word(first_sentences(raw), 155)
                if len(s) > len(entry['tkd_desc']):
                    entry['tkd_desc'] = s
        plan.append(entry)
    json.dump(plan, open(BASE + r'\fix_plan.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    json.dump(skipped, open(BASE + r'\skipped_names.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    dl = [len(e['tkd_desc']) for e in plan]
    print('plan:', len(plan), '| name_changed:', sum(1 for e in plan if e['name_changed']),
          '| name_skipped:', len(skipped))
    print('desc len: min', min(dl), 'max', max(dl),
          '| <110:', sum(1 for x in dl if x < 110),
          '| 110-120:', sum(1 for x in dl if 110 <= x < 120),
          '| 120-155:', sum(1 for x in dl if 120 <= x <= 155),
          '| >155:', sum(1 for x in dl if x > 155))
    tl = [len(e['tkd_title']) for e in plan]
    print('title len: max', max(tl), '| <=60 all:', all(x <= 60 for x in tl))

if __name__ == '__main__':
    main()
