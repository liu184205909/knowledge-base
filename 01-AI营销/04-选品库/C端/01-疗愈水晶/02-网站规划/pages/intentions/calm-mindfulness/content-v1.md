# Calm & Mindfulness 页面内容与布局文档 v1

> 页面类型: WordPress Page + Elementor
> URL: `/calm-mindfulness/`
> 页面角色: Shop by Intention 下的购买型意图页
> 重要边界: `/crystals-for-anxiety/`、`/crystals-for-stress/`、`/crystals-for-sleep/` 是 Condition/Post 内容页。本页可以链接它们, 但不复制长文定位。

## 1. 页面定位

这个页面服务的是“我想让日常更平静、更有正念感”的用户, 不是治疗 anxiety 或 sleep disorder 的医疗内容页。

页面要完成三件事:

1. 确认用户来到 Calm & Mindfulness 意图入口。
2. 帮用户按场景选择: racing thoughts / evening wind-down / meditation / gentle communication。
3. 导向真实产品、晶石 meaning 页和相关 condition 深读页。

## 2. KTD / SEO 草案

| 项目 | 内容 |
|---|---|
| H1 | Calm & Mindfulness Crystals |
| URL | `/calm-mindfulness/` |
| 页面主意图 | Shop crystals by intention: calm, mindfulness, reflection, gentle grounding |
| Primary keyword 候选 | calming crystals |
| Secondary keywords | mindfulness crystals, crystals for calm, meditation crystals |
| 不抢占关键词 | crystals for anxiety, crystals for stress, crystals for sleep |
| SEO Title | Calm & Mindfulness Crystals \| Earthward |
| Meta Description | Shop genuine crystals for calm, mindfulness, meditation, and gentle daily grounding. Explore amethyst, lepidolite, howlite, amazonite, selenite, and angelite. |

## 3. 内容边界

可用表达:

- a reminder to pause and breathe
- traditionally associated with calm and reflection
- a mindfulness anchor
- part of a self-care routine

避免表达:

- cure anxiety
- treat insomnia
- remove stress
- scientifically proven to calm the mind
- replace therapy or medical care

合规基调: 水晶是正念提醒物和象征载体, 不是焦虑、压力或睡眠问题的治疗方案。

## 4. 推荐晶石范围

| Crystal | 页面角色 | 内容角度 |
|---|---|---|
| Amethyst | 第一主推 | evening calm, reflection, meditation |
| Lepidolite | 情绪波动 | transition, softness, emotional steadiness |
| Howlite | 过度思考 | patience, slowing down, bedtime cue |
| Amazonite | 温和表达 | calm communication, honest voice |
| Selenite | 清晰感 | mental space, ritual clarity, dry-care warning |
| Angelite | 温柔感 | gentle calm, bedtime reflection, dry-care warning |

## 5. Section 蓝图

### S1 Hero

- H1: Calm & Mindfulness Crystals
- Slogan: Pause, breathe, come back.
- Subtitle: Choose crystals as gentle reminders to slow down, return to your body, and make room for a calmer daily rhythm.
- Primary CTA: Shop Calm Crystals
- Secondary CTA: Find Your Calm Stone

### S2 Quick Chooser

| Path | 推荐晶石 | 链接 |
|---|---|---|
| My mind keeps racing | Amethyst / Howlite | `/crystals-for-anxiety/` |
| I need a softer evening routine | Amethyst / Angelite | `/crystals-for-sleep/` |
| I want a meditation anchor | Selenite / Amethyst | `/crystals-for-meditation/` |
| I want calm communication | Amazonite / Lepidolite | 本页产品区或 meaning 页 |

### S3 Short Editorial

H2: Calm is something you make room for.

内容方向: 平静不是靠物件“制造”, 而是由暂停、呼吸、环境和日常选择组成。水晶可以作为一个可触摸的提醒, 帮用户把注意力从噪音拉回当下。

### S4 Featured Calm Crystals

| Crystal | One-line angle | Link |
|---|---|---|
| Amethyst | A classic purple stone for quiet evenings, reflection, and meditation. | `/gemstone/amethyst-meaning/` |
| Lepidolite | A soft lavender stone often chosen during emotional waves and transitions. | `/gemstone/lepidolite-meaning/` |
| Howlite | A white stone used as a reminder for patience, pause, and slower thoughts. | `/gemstone/howlite-meaning/` |
| Amazonite | A blue-green stone for calm communication and honest expression. | `/gemstone/amazonite-meaning/` |
| Selenite | A luminous stone for clarity, space, and gentle ritual reset. | `/gemstone/selenite-meaning/` |
| Angelite | A pale blue stone for softness, reflection, and bedtime calm. | `/gemstone/angelite-meaning/` |

### S5 Shop Calm & Mindfulness

结构: WoodMart Products / Product Categories 组件。
要求: 优先展示 Amethyst / Lepidolite / Howlite / Amazonite / Selenite / Angelite 相关真实产品或分类入口。不使用 WooCommerce shortcode。

### S6 Deepen Your Path

| Title | Description | Link |
|---|---|---|
| Crystals for Anxiety | A deeper guide for anxious thoughts and emotional tension. | `/crystals-for-anxiety/` |
| Crystals for Stress | Explore stones commonly chosen for stressful seasons. | `/crystals-for-stress/` |
| Crystals for Sleep | Build a softer wind-down ritual with calming stones. | `/crystals-for-sleep/` |

### S7 FAQ

建议问题:

1. What crystal is best for calm and mindfulness?
2. Can crystals cure anxiety or stress?
3. What crystal is best for a racing mind?
4. What crystal is good for meditation?
5. Which calming crystals should stay dry?
6. How should I choose a calming crystal?

### S8 Final CTA

- H2: Choose a small reminder to slow down.
- Text: Browse crystals selected for calmer evenings, mindful pauses, and gentle daily grounding.
- CTA: Shop Calm & Mindfulness

## 6. 图片需求

| 用途 | 图片建议 |
|---|---|
| Hero | Amethyst / Howlite / Selenite 的安静自然光场景, 可有 journal/linen, 不要医疗暗示 |
| Quick Chooser | 可不用图或使用轻量晶石细节图 |
| Featured Crystals | 6张真实晶石图, 单石清晰 |
| Shop | 真实产品图 |
| CTA | 可复用 Hero 或生成 amethyst evening wind-down 场景 |

## 7. Elementor 组件映射建议

| Section | Elementor / WoodMart 组件 |
|---|---|
| Hero | Container, Heading, Text Editor, Button, background image |
| Quick Chooser | Flexbox Container, Icon Box 或 Text Card |
| Editorial | Flexbox Container, Heading, Text Editor, Image |
| Featured Crystals | Flexbox Container, Image Box |
| Shop | WoodMart Products / Product Categories 组件 |
| Deepen Your Path | Image Box 或 Icon Box + Button |
| FAQ | Accordion |
| Final CTA | Container, background image, Heading, Text Editor, Button |

## 8. 待确认项

1. Primary keyword 是否用 `calming crystals`。
2. Selenite / Angelite care note 是否在 FAQ 和卡片中都提醒。
3. 6张晶石图和 Hero/CTA 图的最终资产与 media id。
