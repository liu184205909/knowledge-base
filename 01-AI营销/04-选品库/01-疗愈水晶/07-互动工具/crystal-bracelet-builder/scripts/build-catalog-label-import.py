"""Build the name-only CSV accepted by the T17 catalog label importer.

The source snapshot may contain commercial Chinese labels. This script never
touches price, stock, images, or variants; it emits one row per material key.
"""

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data' / 'v3' / 'site-imports' / 'linganshi-catalog-import.json'
OUTPUT = ROOT / 'data' / 'v3' / 'catalog-labels.en.csv'

CATEGORY = {
    '白水晶': 'Clear Quartz', '粉水晶': 'Rose Quartz', '紫水晶': 'Amethyst',
    '海蓝宝': 'Aquamarine', '黄水晶': 'Citrine', '绿水晶': 'Green Quartz',
    '胶花': 'Garden Quartz', '幽灵': 'Phantom Quartz', '草莓晶': 'Strawberry Quartz',
    '蓝晶石': 'Kyanite', '茶晶': 'Smoky Quartz', '黑金超七': 'Black Gold Super Seven',
    '发晶/兔毛': 'Rutilated Quartz', '闪灵': 'Herkimer Quartz', '岫玉': 'Xiuyu Jade',
    '紫锂辉': 'Lepidolite', '蓝虎眼': 'Blue Tiger Eye', '黄虎眼': 'Yellow Tiger Eye',
    '黄萤石': 'Yellow Fluorite', '月光拉长石': 'Moonstone & Labradorite',
    '曜石': 'Obsidian', '天河石': 'Amazonite', '南红玛瑙': 'Southern Red Agate',
    '绿龙晶': 'Green Dragon Stone', '紫云母': 'Purple Mica', '其他': 'Other',
    '吊坠/挂件': 'Charms & Pendants', '隔珠/隔片': 'Spacers & Separators',
    '魔盒': 'Locket Beads', '花托': 'Bead Caps', '跑环': 'Slider Beads',
    '水晶随型': 'Crystal Focal Beads', '方糖': 'Cube Beads', '雕件': 'Carved Beads',
    '切面珠': 'Faceted Beads',
}

EXACT = {
    '白阿塞': 'White Azeztulite', '白水晶': 'Clear Quartz', '高品净体白水晶': 'High-Grade Clear Quartz',
    '莫粉': 'Morganite', '西柚粉晶': 'Grapefruit Rose Quartz', '粉晶': 'Rose Quartz', '紫马粉': 'Purple Rose Quartz',
    '薰衣草': 'Lavender Amethyst', '巴西紫水晶': 'Brazilian Amethyst', '乌拉圭紫水晶': 'Uruguayan Amethyst',
    '玻利维亚紫水晶': 'Bolivian Amethyst', '魔鬼蓝海蓝宝': 'Deep Blue Aquamarine', '冰川蓝海蓝宝': 'Glacier Blue Aquamarine',
    '蓝天白云海蓝宝': 'Sky Blue Aquamarine', '柠檬黄水晶': 'Lemon Citrine', '高透黄水晶': 'High-Clarity Citrine',
    '黄塔晶': 'Yellow Tower Quartz', '绿水晶': 'Green Quartz', '浅色透底黄胶花': 'Light Clear Yellow Garden Quartz',
    '浅色透底红胶花': 'Light Clear Red Garden Quartz', '牛血红胶花': 'Ox-Blood Red Garden Quartz',
    '浅色红胶花': 'Light Red Garden Quartz', '黄胶花': 'Yellow Garden Quartz', '芬达色胶花': 'Fanta-Color Garden Quartz',
    '白幽灵': 'White Phantom Quartz', '满天星绿幽灵': 'Starry Green Phantom Quartz', '千层彩幽灵': 'Layered Color Phantom Quartz',
    '奶油体雪花幽灵': 'Creamy Snowflake Phantom Quartz', '半盆绿幽灵': 'Half-Garden Green Phantom Quartz',
    '透体雪花幽灵': 'Clear Snowflake Phantom Quartz', '千层绿幽灵': 'Layered Green Phantom Quartz',
    '浅色草莓晶': 'Light Strawberry Quartz', '草莓晶': 'Strawberry Quartz', '蓝晶石': 'Kyanite',
    '深茶晶': 'Dark Smoky Quartz', '浅茶晶': 'Light Smoky Quartz', '透体黑金超': 'Clear Black Gold Super Seven',
    '黑金超七色浓': 'Rich-Color Black Gold Super Seven', '满发黑金超七': 'Dense Black Gold Super Seven',
    '高品金发晶': 'High-Grade Golden Rutilated Quartz', '黑发晶浅色': 'Light Black Rutilated Quartz',
    '透体黑发晶': 'Clear Black Rutilated Quartz', '金发晶': 'Golden Rutilated Quartz',
    '满发绿发晶': 'Dense Green Rutilated Quartz', '黑发晶深色': 'Dark Black Rutilated Quartz',
    '浅色绿发晶': 'Light Green Rutilated Quartz', '闪灵': 'Herkimer Quartz', '岫玉': 'Xiuyu Jade',
    '青提奶盖': 'Milky Green Grape Jade', '紫锂辉': 'Lepidolite', '蓝虎眼': 'Blue Tiger Eye',
    '黄虎眼': 'Yellow Tiger Eye', '黄萤石': 'Yellow Fluorite', '太阳石': 'Sunstone', '月光石': 'Moonstone',
    '金太阳': 'Golden Sunstone', '透体灰月光': 'Clear Grey Moonstone', '双眼金曜石': 'Double-Eye Gold Obsidian',
    '双眼银曜石': 'Double-Eye Silver Obsidian', '高透冰耀石': 'High-Clarity Ice Obsidian',
    '天河石': 'Amazonite', '南红玛瑙': 'Southern Red Agate', '绿龙晶': 'Green Dragon Stone',
    '紫云母': 'Purple Mica', '绿英石': 'Green Aventurine', '朱砂': 'Cinnabar', '葡萄石': 'Prehnite',
    '岁岁平安': 'Peace & Safety', '半蝴蝶银': 'Half Butterfly Silver', '半蝴蝶金': 'Half Butterfly Gold',
    '贝珠': 'Shell Pearl', '古银花托': 'Antique Silver Bead Cap', '檀木隔片厚': 'Thick Sandalwood Spacer',
    '大锆石魔盒': 'Large Zircon Locket Bead', '白锆魔盒': 'White Zircon Locket Bead',
    '雪花魔盒': 'Snowflake Locket Bead', '四叶草': 'Four-Leaf Clover', '紫锆魔盒': 'Purple Zircon Locket Bead',
    '透明白跑环': 'Clear White Slider Bead', '冰耀石跑环': 'Ice Obsidian Slider Bead',
    '五叶绕戒': 'Five-Leaf Ring',
    '镂空隔环戒银': 'Openwork Ring Spacer Silver', '四环绕戒隔环金': 'Four-Ring Ring Spacer Gold',
    '四环绕戒隔环银': 'Four-Ring Ring Spacer Silver', '藏银隔环戒': 'Tibetan Silver Ring-Shape Spacer',
    '粉水晶五角星': 'Rose Quartz Five-Point Star', '黄水晶五角星': 'Citrine Five-Point Star',
}

TOKENS = {
    '高品': 'High-Grade ', '高透': 'High-Clarity ', '透体': 'Clear ', '浅色': 'Light ', '深色': 'Dark ', '千层': 'Layered ', '青提': 'Green Grape ', '薰衣草': 'Lavender Amethyst ', '白': 'White ',
    '满发': 'Dense ', '色浓': 'Rich-Color ', '奶体': 'Milky ', '奶黄': 'Cream Yellow ', '奶盖': 'Milky ',
    '白水晶': 'Clear Quartz ', '粉水晶': 'Rose Quartz ', '粉晶': 'Rose Quartz ', '黄水晶': 'Citrine ',
    '黄塔晶': 'Yellow Tower Quartz ', '柠檬晶': 'Lemon Quartz ', '海蓝宝': 'Aquamarine ',
    '黑金超': 'Black Gold Super Seven ', '黑金超七': 'Black Gold Super Seven ', '银曜石': 'Silver Obsidian ',
    '黑曜石': 'Obsidian ', '冰耀石': 'Ice Obsidian ', '紫水晶': 'Amethyst ', '草莓晶': 'Strawberry Quartz ',
    '绿幽灵': 'Green Phantom Quartz ', '白幽灵': 'White Phantom Quartz ', '红胶花': 'Red Garden Quartz ',
    '黄胶花': 'Yellow Garden Quartz ', '黑发晶': 'Black Rutilated Quartz ', '绿发晶': 'Green Rutilated Quartz ',
    '金发晶': 'Golden Rutilated Quartz ', '黄虎眼': 'Yellow Tiger Eye ', '蓝虎眼': 'Blue Tiger Eye ',
    '青金石': 'Lapis Lazuli ', '南红玛瑙': 'Southern Red Agate ', '红玛瑙': 'Red Agate ',
    '茶晶': 'Smoky Quartz ', '琥珀': 'Amber ', '蜜蜡': 'Amber ', '檀木': 'Sandalwood ',
    '锆石': 'Zircon ', '珍珠': 'Pearl ', '贝珠': 'Shell Pearl ', '沉香': 'Agarwood ', '珠': 'Bead ', '藏银': 'Tibetan Silver ',
'古银': 'Antique Silver ', '金色': 'Gold ', '银色': 'Silver ', '黄': 'Yellow ', '蓝': 'Blue ', '金': 'Gold ', '银': 'Silver ',
    '左': 'Left ', '右': 'Right ', '小': 'Small ', '大': 'Large ', '多': 'Multi ', '长': 'Long ', '厚': 'Thick ', '细': 'Fine ', '四': 'Four ',
    '方': 'Square ', '块': 'Block ', '多面': 'Faceted ', '圆柱': 'Cylinder ', '椭圆': 'Oval ', '对角': 'Diagonal ', '弧形': 'Curved ', '锥形': 'Conical ', '菱形': 'Diamond-Shaped ', '棱形': 'Diamond-Shaped ',
'多角': 'Multi-Petal ', '花瓣': 'Petal ', '花朵': 'Flower ', '花型': 'Floral ', '花饰': 'Floral Accent ', '花嵌': 'Floral Inlay ', '梅花': 'Plum Blossom ', '小花': 'Small Flower ', '花': 'Flower ',
    '蝴蝶': 'Butterfly ', '配饰': 'Accent ', '叶子': 'Leaf ', '多叶': 'Multi-Leaf ', '五叶': 'Five-Leaf ', '双花': 'Double Flower ',
    '荆棘': 'Thorn ', '祥云': 'Auspicious Cloud ', '云': 'Cloud ', '雪花': 'Snowflake ', '月蝶': 'Moon Butterfly ', '猫猫': 'Cat ',
    '爱心': 'Heart ', '四叶草': 'Four-Leaf Clover ', '月亮': 'Moon ', '葫芦': 'Gourd ', '貔貅': 'Pi Xiu ', '醒狮': 'Lion Dance ',
    '平安扣': 'Peace Button ', '跑环': 'Slider Bead ', '隔环戒': 'Spacer Ring ', '隔环': 'Spacer Ring ', '隔珠': 'Spacer Bead ',
    '隔片': 'Spacer ', '花托': 'Bead Cap ', '魔盒': 'Locket Bead ', '吊坠': 'Pendant ', '方糖': 'Cube Bead ',
    '双尖': 'Double Point ', '随型': 'Focal Bead ', '切面': 'Faceted ', '钻切': 'Diamond Cut ',
    '菠萝珠': 'Pineapple Bead ', '桶珠': 'Barrel Bead ', '蝴蝶结': 'Bow ', '胖星星': 'Chubby Star ',
    '五星': 'Five-Star ', '小熊': 'Little Bear ', '猫爪': 'Cat Paw ', '月球': 'Moon ', '水滴': 'Teardrop ',
    '水棱': 'Water-Ridge ', '金棱': 'Gold-Ridge ', '绣球花': 'Hydrangea ', '繁花': 'Blooming Flower ',
    '古荷': 'Antique Lotus ', '千伞流苏': 'Umbrella Tassel ', '小金条': 'Small Gold Bar ',
    '小金砖': 'Small Gold Brick ', '随型': 'Focal Bead ', '通用': 'Classic ', '单排': 'Single-Row ',
    '双排': 'Double-Row ', '四环绕戒': 'Four-Ring ', '四环绕': 'Four-Ring ', '双戒环绕': 'Double-Ring ', '环绕': 'Ring-Wrapped ', '环': 'Ring ',
    '镂空': 'Openwork ', '丝球': 'Wire Ball ', '深紫': 'Deep Purple ', '水晶': 'Crystal ', '绿纹石': 'Green Stripe Stone ',
    '灰月光': 'Grey Moonstone ', '蓝月光': 'Blue Moonstone ', '紫水晶': 'Amethyst ', '紫锆': 'Purple Zircon ',
}


def translate(name: str) -> str:
    if name in EXACT:
        return EXACT[name]
    translated = name
    for zh, en in sorted(TOKENS.items(), key=lambda item: len(item[0]), reverse=True):
        translated = translated.replace(zh, en)
    translated = ' '.join(translated.split())
    if any('\u3400' <= char <= '\u9fff' for char in translated):
        raise ValueError(f'Untranslated label: {name} -> {translated}')
    return translated


def main() -> None:
    payload = json.loads(SOURCE.read_text(encoding='utf-8'))
    rows = payload['rows'] if isinstance(payload, dict) else payload
    materials = {}
    for row in rows:
        materials.setdefault(row['material_key'], row)
    output_rows = []
    for material_key, row in materials.items():
        category = row['category_label']
        if category not in CATEGORY:
            raise ValueError(f'Untranslated category: {category}')
        output_rows.append((material_key, translate(row['name_en']), CATEGORY[category]))
    with OUTPUT.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.writer(handle)
        writer.writerow(('material_key', 'name_en', 'category_label'))
        writer.writerows(output_rows)
    print(f'Wrote {len(output_rows)} labels to {OUTPUT}')


if __name__ == '__main__':
    main()
