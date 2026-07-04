from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path

srcs = [
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\e09e640801c406636679fa6584be60b9.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\9a8e8703df2844230285877db7f8c47e.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\98ff6e77fd9da4a147d20311a7c2ce0a.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\95480c67778880ae14ee94faced9ad3c.jpg',
]
out = Path(r'D:\Code\knowledge-base\t17-tray-assets')
for i, src in enumerate(srcs, 1):
    img = Image.open(src).convert('RGB')
    w, h = img.size
    side = min(w, h)
    img = img.crop(((w-side)//2, (h-side)//2, (w+side)//2, (w+side)//2) if w < h else ((w-side)//2, (h-side)//2, (w+side)//2, (h+side)//2)).resize((1200, 1200), Image.LANCZOS)
    # luma drives dark walnut colorization, preserving carved depth
    gray = ImageOps.grayscale(img)
    gray = ImageEnhance.Contrast(gray).enhance(1.45)
    colorized = ImageOps.colorize(gray, black='#3a2115', white='#c28b52', mid='#7b4b2b')
    colorized = ImageEnhance.Color(colorized).enhance(1.12)
    colorized = ImageEnhance.Contrast(colorized).enhance(1.16)
    colorized = ImageEnhance.Sharpness(colorized).enhance(1.25)
    colorized.save(out / f'tray-dark-walnut-{i}.jpg', quality=92, optimize=True)
    print(out / f'tray-dark-walnut-{i}.jpg')
