# Abundance & Success UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“机会与行动力”的购买入口, 不是财富玄学页。

- 情绪: warm, optimistic, grounded, action-oriented
- 主色: Earthward Deep Ink `#1A1A2E` / Primary Green `#2D6A4F` / Pale Green `#F0F7F4`
- 辅色: warm gold / citrine amber / cream, 只做点缀
- 图片: Citrine, Pyrite, Green Aventurine, Tiger Eye 等真实晶石, 不用金币、现金、豪车、奢侈符号
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Abundance & Success Crystals
- Slogan: Carry the courage to begin.
- CTA: Shop Abundance Crystals / Find Your Success Stone
- 图片位: `hero_abundance_success`
- 移动端: H1 32px 左右, 按钮上下排列

### S2 Quick Chooser

- 结构: Pale Green 或 Cream 背景, 2x2 白色路径卡片
- 卡片: prosperity mindset / courage to act / focus on a goal / new opportunity
- 卡片不强依赖图片, 可用小 icon 或晶石纹理点缀
- 移动端: 单列

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Abundance is a practice, not a promise.
- 图片位: `editorial_abundance_scene`
- 文案宽度控制, 不写成长文章
- 移动端: 上文下图

### S4 Featured Crystals

- 结构: 3列 x 2行晶石卡片
- 背景: Cream
- 卡片: 图片在上, 标题 + one-line angle + text link
- 图片位: Citrine / Pyrite / Green Aventurine / Tiger Eye / Clear Quartz / Carnelian
- 移动端: 单列或2列, 以不挤为准

### S5 Shop Abundance & Success

- 结构: 白底, 标题 + 简短说明 + WoodMart Products / Product Categories
- 只用 WoodMart/Elementor 可编辑组件
- 不用 WooCommerce shortcode, 不写死产品 HTML
- 等待确认: category/tag/taxonomy

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-money/`, `/crystals-for-prosperity/`, `/crystals-for-motivation/`
- 不放大图, 保持轻量

### S7 FAQ

- 结构: 白底, 居中标题 + Accordion
- 重点: money/wealth 相关回答必须避免保证结果

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案 + 单按钮
- H2: Choose a small reminder for the progress you want to make.
- 图片位: `cta_abundance_success`, 可复用 Hero

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_abundance_success` | Hero 背景 |
| `editorial_abundance_scene` | S3 图文图 |
| `citrine` | S4 晶石卡 |
| `pyrite` | S4 晶石卡 |
| `green_aventurine` | S4 晶石卡 |
| `tiger_eye` | S4 晶石卡 |
| `clear_quartz` | S4 晶石卡 |
| `carnelian` | S4 晶石卡 |
| `cta_abundance_success` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
