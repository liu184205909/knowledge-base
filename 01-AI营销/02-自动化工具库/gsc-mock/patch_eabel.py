# -*- coding: utf-8 -*-
"""eabel_gsc.png 域名修补（精确坐标版）：属性卡 + 搜索框 -> www.eabel.com"""
from PIL import Image, ImageDraw, ImageFont

SRC = r'D:/Code/knowledge-base/gsc-mock/eabel_gsc.png'
im = Image.open(SRC).convert('RGB')
px = im.load()
W, H = im.size
d = ImageDraw.Draw(im)
MSYH = r'C:/Windows/Fonts/msyh.ttc'


def text_row(y0, y1, x0, x1):
    """在窗口内找文本行 bbox（高 8-30px 才算文本）"""
    rows = []
    for y in range(y0, y1):
        xs = [x for x in range(x0, x1) if sum(px[x, y]) / 3 < 175]
        if len(xs) >= 3:
            rows.append((y, min(xs), max(xs)))
    if not rows:
        return None
    lines, cur = [], [rows[0]]
    for r in rows[1:]:
        if r[0] - cur[-1][0] <= 3:
            cur.append(r)
        else:
            lines.append(cur); cur = [r]
    lines.append(cur)
    for ln in lines:
        h = ln[-1][0] - ln[0][0] + 1
        if 10 <= h <= 30:
            return ln[0][0], ln[-1][0], min(r[1] for r in ln), max(r[2] for r in ln)
    return None


# 1) 属性卡域名
b1 = text_row(155, 195, 150, 420)
print('prop row:', b1)
if b1:
    y0, y1, x0, x1 = b1
    bg = px[x0 - 14, (y0 + y1) // 2]
    d.rectangle([x0 - 8, y0 - 6, x1 + 8, y1 + 6], fill=bg)
    d.text((x0 - 2, y0 - 5), 'eabel.com', font=ImageFont.truetype(MSYH, 17), fill=(31, 31, 31))
    print('patched prop card')

# 2) 搜索框 placeholder（窗口只覆盖文字段，避开右侧 AI 按钮）
b2 = text_row(30, 82, 712, 1070)
print('search row:', b2)
if b2:
    y0, y1, x0, x1 = b2
    d.rectangle([x0 - 10, y0 - 8, x1 + 10, y1 + 8], fill=(226, 236, 252))
    d.text((x0 - 2, y0 - 6), '检查"www.eabel.com"中的任何网址', font=ImageFont.truetype(MSYH, 19), fill=(117, 117, 117))
    print('patched search box')

im.save(SRC)
print('saved ->', SRC)
