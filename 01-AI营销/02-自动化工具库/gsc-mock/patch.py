# -*- coding: utf-8 -*-
"""对真实 GSC 截图做像素级收尾：侧栏 icon 全套替换 + 两处域名改写"""
import shutil
from PIL import Image, ImageDraw, ImageFont

SRC = r'D:/Code/knowledge-base/gsc-mock/taku_gsc_final.png'
BAK = r'D:/Code/knowledge-base/gsc-mock/base_raw.png'
shutil.copyfile(SRC, BAK)
im = Image.open(BAK).convert('RGB')
d = ImageDraw.Draw(im)
px = im.load()
GRAY = (95, 98, 104)
MSYH = r'C:/Windows/Fonts/msyh.ttc'


def bg_at(x, y):
    return px[x, y]


# ---------- 1. 侧栏 icon 替换（簇中心即绘制中心） ----------
# (cy, 类型)；x 质心按簇扫描结果统一取 128
icons = [
    (205, 'grid'),      # 数据概览
    (258, 'bars'),      # 流量趋势
    (311, 'target'),    # 网址体检
    (438, 'line'),      # 搜索表现
    (491, 'flower'),    # 探索流量
    (564, 'doc'),       # 热门页面
    (619, 'play'),      # 视频表现
    (671, 'grid9'),     # 站点地图
    (724, 'minus'),     # 移除请求
    (777, 'check'),     # 网页体验
]


def wipe(cx, cy, w, h):
    bg = bg_at(cx + 45, cy)  # 右侧空隙采背景
    d.rectangle([cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2], fill=bg)


def draw_icon(cx, cy, kind):
    wipe(cx, cy, 34, 30)
    x0, y0 = cx - 11, cy - 11
    if kind == 'grid':
        for i in range(2):
            for j in range(2):
                d.rounded_rectangle([x0 + i * 12, y0 + j * 12, x0 + i * 12 + 9, y0 + j * 12 + 9], 2, fill=GRAY)
    elif kind == 'bars':
        for i, h in enumerate([9, 14, 20]):
            d.rectangle([x0 + i * 8, y0 + 22 - h, x0 + i * 8 + 5, y0 + 22], fill=GRAY)
    elif kind == 'target':
        d.ellipse([x0, y0, x0 + 22, y0 + 22], outline=GRAY, width=3)
        d.ellipse([x0 + 6, y0 + 6, x0 + 16, y0 + 16], outline=GRAY, width=3)
        d.ellipse([x0 + 10, y0 + 10, x0 + 12, y0 + 12], fill=GRAY)
    elif kind == 'line':
        pts = [(x0, y0 + 16), (x0 + 6, y0 + 8), (x0 + 11, y0 + 12), (x0 + 22, y0)]
        d.line(pts, fill=GRAY, width=4, joint='curve')
        d.ellipse([x0 + 19, y0 - 3, x0 + 25, y0 + 3], fill=GRAY)
    elif kind == 'flower':
        for (dx, dy) in [(0, -8), (0, 8), (-8, 0), (8, 0)]:
            d.ellipse([cx + dx - 4, cy + dy - 5, cx + dx + 4, cy + dy + 5], fill=GRAY)
    elif kind == 'doc':
        d.rounded_rectangle([x0 + 2, y0, x0 + 20, y0 + 22], 2, outline=GRAY, width=2)
        for k in range(3):
            yy = y0 + 6 + k * 5
            d.line([(x0 + 6, yy), (x0 + 16, yy)], fill=GRAY, width=2)
    elif kind == 'play':
        d.ellipse([x0, y0, x0 + 22, y0 + 22], fill=GRAY)
        d.polygon([(x0 + 8, y0 + 6), (x0 + 17, cy), (x0 + 8, y0 + 16)], fill=(255, 255, 255))
    elif kind == 'grid9':
        for i in range(3):
            for j in range(3):
                d.rectangle([x0 + i * 8, y0 + j * 8, x0 + i * 8 + 5, y0 + j * 8 + 5], fill=GRAY)
    elif kind == 'minus':
        d.ellipse([x0, y0, x0 + 22, y0 + 22], outline=GRAY, width=3)
        d.line([(x0 + 6, cy), (x0 + 16, cy)], fill=GRAY, width=3)
    elif kind == 'check':
        d.ellipse([x0, y0, x0 + 22, y0 + 22], outline=GRAY, width=3)
        d.line([(x0 + 5, cy + 1), (x0 + 9, cy + 6), (x0 + 17, y0 + 5)], fill=GRAY, width=3, joint='curve')


for cy, kind in icons:
    draw_icon(128, cy, kind)

# ---------- 2. 属性卡域名 ----------
d.rectangle([158, 120, 330, 140], fill=(255, 255, 255))
f1 = ImageFont.truetype(MSYH, 16)
d.text((162, 121), 'takusushibar.com', font=f1, fill=(32, 33, 36))

# ---------- 3. 搜索框 placeholder ----------
d.rectangle([578, 30, 962, 58], fill=(241, 243, 244))
f2 = ImageFont.truetype(MSYH, 19)
d.text((582, 33), '检查"takusushibar.com"中的任何网址', font=f2, fill=(95, 98, 104))

im.save(SRC)
print('patched ->', SRC)
