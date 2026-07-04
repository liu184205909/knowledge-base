from PIL import Image, ImageEnhance
from pathlib import Path

srcs = [
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\e09e640801c406636679fa6584be60b9.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\9a8e8703df2844230285877db7f8c47e.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\98ff6e77fd9da4a147d20311a7c2ce0a.jpg',
    r'C:\Users\Dylan\Documents\xwechat_files\liu184205909_1746\temp\RWTemp\2026-07\95480c67778880ae14ee94faced9ad3c.jpg',
]
out = Path(r'D:\Code\knowledge-base\t17-tray-assets')
walnut = (126, 78, 38)
for i, src in enumerate(srcs, 1):
    img = Image.open(src).convert('RGB')
    w, h = img.size
    side = min(w, h)
    img = img.crop(((w-side)//2, (h-side)//2, (w+side)//2, (h+side)//2)).resize((1200, 1200), Image.LANCZOS)
    img = ImageEnhance.Contrast(img).enhance(1.28)
    img = ImageEnhance.Sharpness(img).enhance(1.35)
    img = ImageEnhance.Color(img).enhance(1.18)
    overlay = Image.new('RGB', img.size, walnut)
    img = Image.blend(img, overlay, 0.34)
    img = ImageEnhance.Brightness(img).enhance(0.82)
    img = ImageEnhance.Contrast(img).enhance(1.18)
    img.save(out / f'tray-walnut-{i}.jpg', quality=92, optimize=True)
    print(out / f'tray-walnut-{i}.jpg')
