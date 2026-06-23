# Love & Relationships 页面内容与布局文档 v1

> 页面类型: WordPress Page + Elementor  
> URL: `/love-relationships/`  
> 页面角色: Shop by Intention 下的购买型意图页  
> 重要边界: `/crystals-for-love/` 是 Condition/Post 页面, 不是本页。本页可以链接它, 但不要复制它的长文和关键词定位。

## 1. 页面定位

这个页面服务的不是“写一篇 crystals for love 文章”, 而是帮助用户从“我想围绕爱、自我关怀、关系修复选择水晶”走到“我知道该看哪些水晶和产品”。

本页应该完成三件事:

1. 让用户确认这里是 Love & Relationships 意图入口。
2. 用简洁内容帮助用户判断自己更接近 self-love / relationship support / emotional healing / passion commitment 哪个方向。
3. 把用户导向真实产品、晶石 meaning 页、以及更深的 condition 内容页。

## 2. KTD / SEO 草案

| 项目 | 内容 |
|---|---|
| H1 | Love & Relationships Crystals |
| URL | `/love-relationships/` |
| 页面主意图 | Shop crystals by intention: love, self-love, emotional openness, relationship support |
| Primary keyword 候选 | love crystals |
| Secondary keywords | crystals for relationships, relationship crystals, self love crystals |
| 不抢占关键词 | crystals for love, 由 `/crystals-for-love/` 承接 |
| SEO Title | Love & Relationships Crystals \| Earthward |
| Meta Description | Shop genuine crystals for love, self-compassion, emotional openness, and meaningful connection. Explore rose quartz, rhodonite, ruby, prehnite, and related heart-centered stones. |

> Primary keyword 需要后续用现有关键词文档或工具再确认。当前先按页面角色避开 `crystals for love`, 防止和 condition 页面冲突。

## 3. 内容边界

可用表达:

- support self-love
- a reminder for honest connection
- traditionally associated with love, compassion, or emotional openness
- choose a crystal that reflects the kind of love you want to practice

避免表达:

- attract a specific person
- bring love into your life as a guaranteed result
- heal a broken heart
- fix a relationship
- open/block chakras as确定事实
- powerful ritual / energetic guarantee

合规基调: 水晶是象征物、提醒物、个人意图载体, 不是关系、心理或医疗问题的替代方案。

## 4. 推荐晶石范围

### 主推晶石

| Crystal | 页面角色 | 内容角度 |
|---|---|---|
| Rose Quartz | 第一主推 | self-love, tenderness, gentle emotional openness |
| Rhodonite | 关系修复/自我价值 | compassion, forgiveness, emotional healing |
| Ruby | 热情与承诺 | courage, passion, devotion, vitality |
| Prehnite | 温和稳定 | calm love, clarity, gentle heart-centered choice |

### 可作为延伸链接的晶石

| Crystal | 使用方式 |
|---|---|
| Rainbow Moonstone | 可在 emotional healing 相关内容里出现, 不作为本页主推产品晶石 |
| Opal | 可作为 emotional healing 延伸阅读 |
| Malachite | 可作为 emotional healing 延伸阅读, 注意文案不要过度承诺 |

## 5. Section 蓝图

### S1 Hero

目的: 确认用户来到 Love & Relationships 意图页, 给出购买入口。

结构: 全宽背景图 + 居中文案 + 1 个主 CTA + 1 个次 CTA。

内容:

- H1: Love & Relationships Crystals
- Subtitle: Choose crystals as gentle reminders for self-love, honest connection, and the kind of love you want to practice.
- Primary CTA: Shop Love Crystals
- Secondary CTA: Find Your Stone

图片: Rose Quartz / Rhodonite / Ruby 的自然光静物或温暖生活方式图。避免过度情侣化、婚恋化素材。

备注: 如果主题 Page Title 已经输出 H1, Elementor Hero 里不要再重复 H1；但页面最终必须有清晰 H1。

### S2 Quick Chooser

目的: 让用户快速找到自己的爱与关系方向。

结构: 4 个横向或 2x2 卡片, 每张卡一条路径。

卡片:

| Path | 推荐晶石 | 链接 |
|---|---|---|
| I want to feel softer with myself | Rose Quartz / Prehnite | `/crystals-for-self-love/` |
| I am healing after hurt | Rhodonite / Rose Quartz | `/crystals-for-emotional-healing/` |
| I want more warmth in love | Ruby / Rose Quartz | `/crystals-for-love/` |
| I want steadier connection | Prehnite / Rhodonite | 可链接本页产品区或相关 meaning 页 |

### S3 Short Editorial

目的: 给页面一点情绪和 SEO 语义, 但不写成长文章。

结构: 左文右图或居中窄文本。

H2: Love begins with what you practice daily

内容方向: 爱不是只关于吸引别人, 也关于你如何对待自己、如何表达边界、如何选择诚实的连接。水晶在这里是每日提醒物, 帮助用户把抽象意图变成可见、可触摸的选择。

字数: 120-180 words。

### S4 Featured Love Crystals

目的: 告诉用户本页最该看哪些晶石。

结构: 4 张晶石卡片, 可 4 列或 2x2。

卡片内容:

| Crystal | One-line angle | Link |
|---|---|---|
| Rose Quartz | A gentle classic for self-love, tenderness, and emotional softness. | `/gemstone/rose-quartz-meaning/` |
| Rhodonite | A heart-centered stone often chosen for compassion, forgiveness, and self-worth. | `/gemstone/rhodonite-meaning/` |
| Ruby | A vivid choice for passion, courage, devotion, and life force. | `/gemstone/ruby-meaning/` |
| Prehnite | A soft green stone for calm love, clarity, and steady emotional presence. | `/gemstone/prehnite-meaning/` |

### S5 Shop Love & Relationships

目的: 进入真实导购。

结构: WoodMart 可编辑产品组件或产品分类组件。

内容要求:

- 优先展示与 love tag / Rose Quartz / Rhodonite / Ruby / Prehnite 相关的真实产品。
- 不使用 WooCommerce shortcode。
- 不用 HTML 写死产品卡。
- 如果产品不足, 可以先展示分类入口或精选产品, 但必须是 Elementor/WoodMart 可编辑组件。

### S6 Deepen Your Path

目的: 把本页和 condition 内容页连接起来, 同时避免关键词冲突。

结构: 3 张内容入口卡片。

卡片:

| Title | Description | Link |
|---|---|---|
| Crystals for Love | A deeper guide for love-focused crystal choices. | `/crystals-for-love/` |
| Crystals for Self-Love | Explore stones for self-kindness, confidence, and emotional care. | `/crystals-for-self-love/` |
| Crystals for Emotional Healing | For tender seasons, grief, recovery, and gentle emotional support. | `/crystals-for-emotional-healing/` |

### S7 FAQ

目的: 处理疑虑、合规和购买前问题。

结构: Accordion。

建议问题:

1. What crystal is best for love and relationships?
2. Can crystals attract a specific person?
3. What is the best crystal for self-love?
4. What crystal supports emotional healing after heartbreak?
5. Are love crystals scientifically proven to change relationships?
6. How should I choose a love crystal?

核心回答原则:

- 不承诺结果。
- 不说吸引特定对象。
- 强调象征、提醒、个人意图和审美选择。
- 引导到产品选择和 condition 深读页。

### S8 Final CTA

目的: 收尾转化。

结构: 背景图 CTA banner + 居中文案 + 按钮。

内容:

- H2: Choose a small reminder for the love you want to practice.
- Text: Browse crystals selected for self-love, compassion, tenderness, and meaningful connection.
- CTA: Shop Love & Relationships

## 6. 图片需求

| 用途 | 图片建议 |
|---|---|
| Hero | Rose Quartz / Rhodonite / Ruby 的温暖自然光组合图 |
| Quick Chooser | 可用简洁晶石局部图或不配图, 保持轻量 |
| Featured Crystals | 使用各晶石真实图片 |
| Shop | 使用真实产品图, 不生成假产品图 |
| CTA | 可复用 Hero 图, 加深色或暖色遮罩 |

## 7. Elementor 组件映射建议

| Section | Elementor / WoodMart 组件 |
|---|---|
| Hero | Container, Heading, Text Editor, Button, background image |
| Quick Chooser | Flexbox Container, Icon Box 或 Image Box |
| Editorial | Flexbox Container, Heading, Text Editor, Image |
| Featured Crystals | Flexbox Container, Image Box |
| Shop | WoodMart Products / Product Categories 组件 |
| Deepen Your Path | Image Box 或 Icon Box + Button |
| FAQ | Accordion |
| Final CTA | Container, background image, Heading, Text Editor, Button |

## 8. 待确认项

1. `love crystals` 是否作为本页 primary keyword, 需要从现有关键词文档确认。
2. Love 产品在 WooCommerce/WoodMart 中对应的 tag/category/查询条件。
3. Hero 是否由主题 Page Title 承担 H1, 还是 Elementor Hero 内输出 H1。
4. Rose Quartz / Rhodonite / Ruby / Prehnite 的最终图片资产和 media id。

