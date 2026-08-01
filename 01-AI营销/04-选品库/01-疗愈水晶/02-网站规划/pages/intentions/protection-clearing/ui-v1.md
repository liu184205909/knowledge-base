# Protection & Clearing UI 设计方案 v1

> 对应内容文档: `content-v1.md`
> 用途: JS 施工前确认 UI, 等图片上传完成后再进入 Elementor 映射。

## 0. 视觉目标

页面应像一个“边界、安定、清理感”的购买入口, 不要恐惧营销。

- 情绪: grounded, clear, protective, calm
- 主色: Deep Ink / Primary Green / Pale Green
- 辅色: charcoal, obsidian black, clear quartz white
- 图片: Black Tourmaline, Obsidian, Clear Quartz, Amethyst, Tiger Eye; 深色但不恐怖
- 布局: Elementor Flexbox Container, 不用 CSS Grid, 不用 shortcode

## 1. Section UI

### S1 Hero

- 结构: 全宽背景图 + 深色 overlay + 居中文案 + 双按钮
- H1: Protection & Clearing Crystals
- Slogan: Protect your peace.
- CTA: Shop Protection Crystals / Find Your Grounding Stone
- 图片位: `hero_protection_clearing`

### S2 Quick Chooser

- 结构: Pale Green 或 Cream 背景, 2x2 路径卡片
- 卡片: grounding / reset ritual / stronger boundaries / courage with calm
- 文案不能制造恐惧

### S3 Short Editorial

- 结构: 左文右图, 白底
- H2: Protection starts with a clear boundary.
- 图片位: `editorial_protection_scene`
- 重点: boundaries, reset, peace, grounded presence

### S4 Featured Crystals

- 结构: 5张晶石卡, 桌面可 5列或 3+2
- 背景: Cream 或 Pale Green
- 图片位: Black Tourmaline / Obsidian / Clear Quartz / Amethyst / Tiger Eye

### S5 Shop Protection & Clearing

- 结构: 白底 + WoodMart Products / Product Categories
- 优先真实产品或分类入口
- 不用 shortcode

### S6 Deepen Your Path

- 结构: Pale Green 背景, 3张内容入口卡片
- 链接: `/crystals-for-protection/`, `/crystals-for-grounding/`, `/crystals-for-peace/`

### S7 FAQ

- 结构: 白底 Accordion
- 重点: 不说 block all negative energy, 不说 bad luck, 不做超自然保证

### S8 Final CTA

- 结构: 背景图 + 深色 overlay + 居中文案
- H2: Choose a reminder to protect your peace.
- 图片位: `cta_protection_clearing`

## 2. 图片上传后需要补入

| Key | 用途 |
|---|---|
| `hero_protection_clearing` | Hero 背景 |
| `editorial_protection_scene` | S3 图文图 |
| `black_tourmaline` | S4 晶石卡 |
| `obsidian` | S4 晶石卡 |
| `clear_quartz` | S4 晶石卡 |
| `amethyst` | S4 晶石卡 |
| `tiger_eye` | S4 晶石卡 |
| `cta_protection_clearing` | Final CTA 背景 |

每张图需要: WP URL, media id, alt text。
