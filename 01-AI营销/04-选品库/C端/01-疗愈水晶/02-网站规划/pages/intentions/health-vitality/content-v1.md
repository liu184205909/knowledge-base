# Health & Vitality 页面内容与布局文档 v1

> 页面类型: WordPress Page + Elementor
> URL: `/health-vitality/`
> 页面角色: Shop by Intention 下的购买型意图页
> 重要边界: 本页不能写成医疗健康承诺页。涉及 fatigue、energy、strength 时必须使用 self-care / vitality reminder / symbolic support 表达。

## 1. 页面定位

这个页面服务的是“我想围绕活力、身体感、日常照顾选择水晶”的用户, 不是治疗疾病或改善身体指标的医疗页面。

页面要完成三件事:

1. 确认用户来到 Health & Vitality 意图入口。
2. 帮用户把 vitality 拆成 grounding / steady energy / recovery mood / courage to move。
3. 导向真实产品、晶石 meaning 页和相关 condition/学习页。

## 2. KTD / SEO 草案

| 项目 | 内容 |
|---|---|
| H1 | Health & Vitality Crystals |
| URL | `/health-vitality/` |
| 页面主意图 | Shop crystals by intention: vitality, grounding, daily self-care, embodied energy |
| Primary keyword 候选 | vitality crystals |
| Secondary keywords | crystals for vitality, crystals for energy, health crystals |
| 不抢占关键词 | crystals for energy, crystals for strength |
| SEO Title | Health & Vitality Crystals \| Earthward |
| Meta Description | Shop genuine crystals for vitality, grounding, and daily self-care intentions. Explore bloodstone, red jasper, carnelian, hematite, ruby, and jade. |

## 3. 内容边界

可用表达:

- a reminder to care for the body that carries you
- traditionally associated with vitality and grounding
- support a self-care intention
- a cue for movement, rest, and steady presence

避免表达:

- heal the body
- improve circulation
- cure fatigue
- boost immunity
- treat illness
- medical recovery claims

合规基调: 水晶可以承载 vitality 的象征意义, 但不能替代睡眠、营养、运动或医疗建议。

## 4. 推荐晶石范围

| Crystal | 页面角色 | 内容角度 |
|---|---|---|
| Bloodstone | 生命力传统象征 | vitality, renewal, grounded strength |
| Red Jasper | 稳定耐力 | endurance, steady presence |
| Carnelian | 动力 | creative life force, motivation |
| Hematite | 身体感 | grounding, focus, presence |
| Ruby | 热情与勇气 | passion, courage, devotion to life |
| Jade | 平衡与照护 | harmony, longevity symbolism, gentle wellbeing |

## 5. Section 蓝图

### S1 Hero

- H1: Health & Vitality Crystals
- Slogan: Return to your body.
- Subtitle: Choose crystals as daily reminders for grounding, steady vitality, and the simple self-care that helps you feel present again.
- Primary CTA: Shop Vitality Crystals
- Secondary CTA: Find Your Vitality Stone

### S2 Quick Chooser

| Path | 推荐晶石 | 链接 |
|---|---|---|
| I want steadier daily energy | Bloodstone / Red Jasper | `/crystals-for-energy/` |
| I need grounding and body presence | Hematite / Red Jasper | `/crystals-for-grounding/` |
| I want motivation to move | Carnelian / Ruby | `/crystals-for-motivation/` |
| I want gentle harmony | Jade / Bloodstone | 本页产品区或 meaning 页 |

### S3 Short Editorial

H2: Vitality starts with small daily care.

内容方向: 活力不是“被水晶制造”的效果, 而是睡眠、行动、休息、身体感和持续照顾的总和。水晶在这里作为一个随身提醒, 让用户记得回到身体、回到节奏。

### S4 Featured Vitality Crystals

| Crystal | One-line angle | Link |
|---|---|---|
| Bloodstone | A traditional vitality stone for renewal, grounded strength, and resilience. | `/gemstone/bloodstone-meaning/` |
| Red Jasper | A steady red stone for endurance, grounding, and long-haul support. | `/gemstone/red-jasper-meaning/` |
| Carnelian | A warm orange stone for motivation, movement, and creative life force. | `/gemstone/carnelian-meaning/` |
| Hematite | A dense metallic stone for grounding, focus, and physical presence. | `/gemstone/hematite-meaning/` |
| Ruby | A vivid stone for courage, passion, and devotion to life. | `/gemstone/ruby-meaning/` |
| Jade | A green stone long associated with harmony, balance, and gentle wellbeing. | `/gemstone/jade-meaning/` |

### S5 Shop Health & Vitality

结构: WoodMart Products / Product Categories 组件。
要求: 展示 Bloodstone / Red Jasper / Carnelian / Hematite / Ruby / Jade 相关真实产品或分类入口。不使用 shortcode。

### S6 Deepen Your Path

| Title | Description | Link |
|---|---|---|
| Crystals for Energy | A deeper guide for stones tied to everyday energy intentions. | `/crystals-for-energy/` |
| Crystals for Strength | Explore stones traditionally associated with courage and steadiness. | `/crystals-for-strength/` |
| Crystals for Grounding | Find stones for body presence, steadiness, and rootedness. | `/crystals-for-grounding/` |

### S7 FAQ

建议问题:

1. What crystal is best for vitality?
2. Can crystals improve my health?
3. What crystal is good for grounding the body?
4. What crystal is good for motivation and movement?
5. Are vitality crystals a replacement for medical care?
6. How should I choose a vitality crystal?

### S8 Final CTA

- H2: Choose a reminder to care for your energy.
- Text: Browse crystals selected for grounding, daily vitality, movement, and steady self-care intentions.
- CTA: Shop Health & Vitality

## 6. 图片需求

| 用途 | 图片建议 |
|---|---|
| Hero | Bloodstone / Red Jasper / Carnelian / Jade 的自然光组合, 生命力但不过度医疗化 |
| Quick Chooser | 可用红/绿晶石局部图或无图卡片 |
| Featured Crystals | 6张真实晶石图 |
| Shop | 真实产品图 |
| CTA | 可生成 jade + carnelian self-care scene, 不出现药品/医疗器械 |

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

1. Primary keyword 是否用 `vitality crystals`。
2. Health 表达需要二次合规检查。
3. 6张晶石图和 Hero/CTA 图的最终资产与 media id。
