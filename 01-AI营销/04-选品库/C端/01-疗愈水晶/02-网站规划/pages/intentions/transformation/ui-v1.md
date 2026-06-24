# Transformation UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“转变、放下、新开始”的购买入口, 情绪要深但不沉重。

- 情绪: transitional, hopeful, tender, grounded
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: labradorite blue flash, moonstone cream, malachite green
- 图片: Labradorite, Moonstone, Malachite, Lepidolite, Serpentine, Green Aventurine; 不用魔法门、夸张特效
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Transformation Crystals
- Slogan: Carry the threshold.
- CTA: Shop Transformation Crystals / Find Your Transition Stone
- 图片位: `hero_transformation`

### S2 Quick Chooser

- 结构: Cream 背景, 2x2 路径卡片
- 卡片: beginning again / uncertainty / release old pattern / emotional steadiness
- 语气温和, 不夸大痛苦

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Change asks for something to hold.
- 图片位: `editorial_transformation_scene`
- 重点: transition, threshold, release, next chapter

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Pale Green 或 Cream
- 图片位: Labradorite / Moonstone / Malachite / Lepidolite / Serpentine / Green Aventurine

### S5 Shop Transformation

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实产品或分类入口
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-new-beginnings/`, `/crystals-for-transformation/`, `/crystals-for-emotional-healing/`

### S7 FAQ

- 结构: 白底 Accordion
- 重点: 不说 heal trauma / change fate / guarantee a new life

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a reminder for the change you are carrying.
- 图片位: `cta_transformation`

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_transformation` | Hero 背景 |
| `editorial_transformation_scene` | S3 图文图 |
| `labradorite` | S4 晶石卡 |
| `moonstone` | S4 晶石卡 |
| `malachite` | S4 晶石卡 |
| `lepidolite` | S4 晶石卡 |
| `serpentine` | S4 晶石卡 |
| `green_aventurine` | S4 晶石卡 |
| `cta_transformation` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
