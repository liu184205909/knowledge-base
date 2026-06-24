# Health & Vitality UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“身体感、日常照护、温和活力”的购买入口, 不是医疗健康页。

- 情绪: grounded, warm, steady, restorative
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: red jasper clay, jade green, warm ivory
- 图片: Bloodstone, Red Jasper, Carnelian, Hematite, Ruby, Jade; 不出现药品、医疗器械、医生场景
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Health & Vitality Crystals
- Slogan: Return to your body.
- CTA: Shop Vitality Crystals / Find Your Vitality Stone
- 图片位: `hero_health_vitality`

### S2 Quick Chooser

- 结构: Cream 背景, 2x2 路径卡片
- 卡片: daily energy / grounding / motivation to move / gentle harmony
- 用语避免 medical claims

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Vitality starts with small daily care.
- 图片位: `editorial_vitality_scene`
- 文案强调 sleep, movement, rest, presence, 不做身体功效承诺

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Pale Green 或 Cream
- 图片位: Bloodstone / Red Jasper / Carnelian / Hematite / Ruby / Jade

### S5 Shop Health & Vitality

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实产品或分类入口
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-energy/`, `/crystals-for-strength/`, `/crystals-for-grounding/`

### S7 FAQ

- 结构: 白底 Accordion
- 重点: health/vitality 问题必须说明 crystals are not medical care

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a reminder to care for your energy.
- 图片位: `cta_health_vitality`

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_health_vitality` | Hero 背景 |
| `editorial_vitality_scene` | S3 图文图 |
| `bloodstone` | S4 晶石卡 |
| `red_jasper` | S4 晶石卡 |
| `carnelian` | S4 晶石卡 |
| `hematite` | S4 晶石卡 |
| `ruby` | S4 晶石卡 |
| `jade` | S4 晶石卡 |
| `cta_health_vitality` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
