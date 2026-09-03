# -*- coding: utf-8 -*-
"""域名像素修补：动态扫描两处 electricalcabinet.net 文本框，擦除重写为 takusushibar.com"""
from PIL import Image, ImageDraw, ImageFont

SRC = r'D:/Code/knowledge-base/gsc-mock/taku_gsc_final.png'
im = Image.open(SRC).convert('RGB')
px = im.load()
W, H = im.size
d = ImageDraw.Draw(im)
MSYH = r'C:/Windows/Fonts/msyh.ttc'


def scan(x0, x1, y0, y1, thr=175):
    """返回区域内深色像素 bbox（含少量 padding）"""
    xs, ys = [], []
    for y in range(y0, min(y1, H)):
        for x in range(x0, min(x1, W), 1):
            r, g, b = px[x, y]
            if (r + g + b) / 3 < thr:
                xs.append(x); ys.append(y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def bg(x, y):
    return px[x, y]


# 1) 属性卡域名（侧栏顶部，地球 icon 右侧）
box1 = scan(150, 420, 105, 165)
print('prop card box:', box1)
if box1:
    x0, y0, x1, y1 = box1
    bgl = bg(x0 - 12, (y0 + y1) // 2)
    d.rectangle([x0 - 6, y0 - 6, x1 + 6, y1 + 6], fill=bgl)
    f1 = ImageFont.truetype(MSYH, 17)
    d.text((x0 - 2, y0 - 4), 'takusushibar.com', font=f1, fill=(32, 33, 36))

# 2) 搜索框 placeholder（顶栏中部）
box2 = scan(560, 1620, 8, 78)
print('search box:', box2)
if box2:
    x0, y0, x1, y1 = box2
    bgl = bg(x0 - 12, (y0 + y1) // 2)
    d.rectangle([x0 - 6, y0 - 6, x1 + 6, y1 + 6], fill=(241, 243, 244))
    f2 = ImageFont.truetype(MSYH, 19)
    d.text((x0 - 2, y0 - 4), '检查"takusushibar.com"中的任何网址', font=f2, fill=(95, 98, 104))

im.save(SRC)
print('domain patched ->', SRC)
