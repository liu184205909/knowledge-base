# Calm & Mindfulness UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“平静日常与正念提醒”的购买入口, 不是焦虑治疗页。

- 情绪: quiet, breathable, gentle, trustworthy
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: lavender, soft blue, ivory, 只做轻点缀
- 图片: Amethyst, Lepidolite, Howlite, Amazonite, Selenite, Angelite; 安静自然光, journal/linen 可用
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Calm & Mindfulness Crystals
- Slogan: Pause, breathe, come back.
- CTA: Shop Calm Crystals / Find Your Calm Stone
- 图片位: `hero_calm_mindfulness`
- 移动端: 留足文字呼吸感, 不要让背景主体被裁掉

### S2 Quick Chooser

- 结构: Pale Green 背景, 2x2 路径卡片
- 卡片: racing mind / evening routine / meditation anchor / calm communication
- 可用小 icon 或无图文字卡

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Calm is something you make room for.
- 图片位: `editorial_calm_scene`
- 文案不超过 2 段, 移动端优先可读

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Cream 或 very pale lavender
- 图片位: Amethyst / Lepidolite / Howlite / Amazonite / Selenite / Angelite
- Selenite / Angelite 可在卡片或 FAQ 提醒 keep dry

### S5 Shop Calm & Mindfulness

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实分类: Amethyst, Lepidolite, Amazonite, Selenite, Angelite; Howlite 如果有产品再加入
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-anxiety/`, `/crystals-for-stress/`, `/crystals-for-sleep/`
- 语气: condition 是深读页, 不要在本页承诺治疗

### S7 FAQ

- 结构: 白底 Accordion
- 重点: anxiety/stress/sleep 必须有非医疗声明

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a small reminder to slow down.
- 图片位: `cta_calm_mindfulness`, 可复用 Hero 或 Amethyst 场景

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_calm_mindfulness` | Hero 背景 |
| `editorial_calm_scene` | S3 图文图 |
| `amethyst` | S4 晶石卡 |
| `lepidolite` | S4 晶石卡 |
| `howlite` | S4 晶石卡 |
| `amazonite` | S4 晶石卡 |
| `selenite` | S4 晶石卡 |
| `angelite` | S4 晶石卡 |
| `cta_calm_mindfulness` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
