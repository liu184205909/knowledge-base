# Personal Empowerment UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“自信、行动、边界”的购买入口, 有力量但不攻击。

- 情绪: confident, grounded, clear, encouraging
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: tiger-eye gold, carnelian orange, labradorite blue flash
- 图片: Tiger Eye, Carnelian, Citrine, Pyrite, Labradorite, Clear Quartz; 不用成功学海报感
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Personal Empowerment Crystals
- Slogan: Stand where you are.
- CTA: Shop Empowerment Crystals / Find Your Power Stone
- 图片位: `hero_personal_empowerment`

### S2 Quick Chooser

- 结构: Cream 背景, 2x2 路径卡片
- 卡片: confidence / courage / follow-through / intuition
- 卡片文字直接、短, 不用夸张励志话术

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Empowerment is quiet before it is loud.
- 图片位: `editorial_empowerment_scene`
- 重点: self-trust, boundaries, next honest step

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Cream
- 图片位: Tiger Eye / Carnelian / Citrine / Pyrite / Labradorite / Clear Quartz

### S5 Shop Personal Empowerment

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实产品或分类入口
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-confidence/`, `/crystals-for-courage/`, `/crystals-for-motivation/`

### S7 FAQ

- 结构: 白底 Accordion
- 重点: 不承诺 confidence/courage 结果, 强调 reminder 和 practice

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a reminder for the person you are becoming.
- 图片位: `cta_personal_empowerment`

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_personal_empowerment` | Hero 背景 |
| `editorial_empowerment_scene` | S3 图文图 |
| `tiger_eye` | S4 晶石卡 |
| `carnelian` | S4 晶石卡 |
| `citrine` | S4 晶石卡 |
| `pyrite` | S4 晶石卡 |
| `labradorite` | S4 晶石卡 |
| `clear_quartz` | S4 晶石卡 |
| `cta_personal_empowerment` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
