# Spiritual Connection UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“冥想、内在聆听、精神练习”的购买入口, 不要神秘能力保证。

- 情绪: quiet, luminous, reflective, grounded
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: amethyst purple, lapis blue, selenite white, small gold accent
- 图片: Amethyst, Clear Quartz, Selenite, Lapis Lazuli, Labradorite, Kyanite; 不用夸张星光魔法
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Spiritual Connection Crystals
- Slogan: Turn inward. Listen gently.
- CTA: Shop Spiritual Crystals / Find Your Meditation Stone
- 图片位: `hero_spiritual_connection`

### S2 Quick Chooser

- 结构: Cream 背景, 2x2 路径卡片
- 卡片: meditation anchor / ritual clarity / intuition / calmer practice
- 文案清晰, 不写“打开第三眼保证”

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Connection begins with attention.
- 图片位: `editorial_spiritual_scene`
- 重点: attention, stillness, reflection, inner listening

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Pale Green 或 Cream
- 图片位: Amethyst / Clear Quartz / Selenite / Lapis Lazuli / Labradorite / Kyanite

### S5 Shop Spiritual Connection

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实产品或分类入口
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-spirituality/`, `/crystals-for-meditation/`, `/crystals-for-intuition/`

### S7 FAQ

- 结构: 白底 Accordion
- 重点: 不承诺 supernatural result; 只说 symbolic reminder / practice

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a reminder for your quiet practice.
- 图片位: `cta_spiritual_connection`

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_spiritual_connection` | Hero 背景 |
| `editorial_spiritual_scene` | S3 图文图 |
| `amethyst` | S4 晶石卡 |
| `clear_quartz` | S4 晶石卡 |
| `selenite` | S4 晶石卡 |
| `lapis_lazuli` | S4 晶石卡 |
| `labradorite` | S4 晶石卡 |
| `kyanite` | S4 晶石卡 |
| `cta_spiritual_connection` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
