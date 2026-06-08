# Crystal Meaning 文章框架

> 适用范围：通过 ACF 自定义 post type `gemstone` 发布的 Crystal Meaning 百科页。
> URL：`/gemstone/{crystal-slug}-meaning`
> 展示层：Elementor Crystal Single 模板读取 ACF 字段渲染。
> 字段协议：以 [ACF-Field-Group设计-Gemstone-Meaning.md](../../02-网站规划/ACF-Field-Group设计-Gemstone-Meaning.md) 为准。

## 1. 执行顺序

1. **文章框架**：套用本文档 14 模块结构，确定 Tier 与内容边界。
2. **单篇 Brief**：确定目标水晶、关键词、搜索量、竞品参考、Tier 等级。
3. **内容生成**：按文章框架生成各模块内容，全部写入 ACF 字段（结构化数据 + 叙述性正文）。`post_content` 由上传脚本自动拼接所有正文模块 HTML 作为 SEO fallback。
4. **图片配置**：正文结构稳定后，逐张定义 `key / placement / size / alt / prompt`。
5. **生图入库**：生成候选图，上传 WordPress 媒体库，记录媒体 ID。
6. **REST API 上传**：通过 `/wp-json/wp/v2/gemstone` 创建 `draft` 条目，写入 ACF 字段和 WordPress `content`。

## 2. 文章元信息

| 字段 | 规则 |
|---|---|
| Post Type | `gemstone`（ACF CPT） |
| Title/H1 | `{Crystal} Meaning: Healing Properties & Uses` |
| Slug | `{crystal-slug}-meaning`（如 `amethyst-meaning`） |
| URL | `/gemstone/{crystal-slug}-meaning` |
| Primary keyword | `{crystal} meaning` |
| Secondary keywords | `{crystal} benefits`, `{crystal} properties`, `{crystal} spiritual meaning`, `{crystal} chakra`, `{crystal} bracelet meaning` |
| Search intent | Informational，允许自然承接轻商业推荐 |
| Status | 上传默认 `draft`，人工验收后再发布 |

## 3. 固定文章框架

> **标题归模板**：下表"标题规则"列是给 Elementor 模板看的，模板负责渲染 H2/H3。ACF 字段只存正文段落 HTML，不含模块标题。

| 顺序 | 模块 | 标题规则 | 内容要求 |
|---|---|---|---|
| 1 | 导语 | 无 H2 | 80-120词，直接回答 `{Crystal} meaning`，说明适合谁读 |
| 2 | Quick Answer | `What Is {Crystal} Meaning?` | 40-60词，适合 AI 摘取；不可夸大医疗功效 |
| 3 | Quick Facts | `Quick Facts About {Crystal}` | 表格：color、chakra、zodiac、element、hardness、primary origin、intentions、best for、common forms |
| 4 | Meaning Overview | `{Crystal} Meaning and Symbolism` | 解释文化/灵性象征；融入历史用途、神话传说、产地故事作为文化背景支撑。**证据规则**：有可靠来源才写具体故事；没有可靠来源则改为现代使用背景或产地概述，不编造"古埃及人如何使用某某水晶"类内容 |
| 5 | Properties | `{Crystal} Properties` | 分成 5a Physical Properties 与 5b Metaphysical Properties。5a 含结构化矿物数据表（见 §3.1）；专业级数据放在可折叠区域。5b 为**传统象征和能量属性**（如"对应心轮的爱的能量"） |
| 6 | Benefits | `{Crystal} Benefits` | **用户日常场景里的软性收益**（如"冥想时更专注"、"办公桌上感到安心"）；不写疾病治疗承诺；与 5b 的边界：5b 说"传统认为有什么能量"，6 说"用户可能在什么场景感受到什么" |
| 7 | Chakra/Zodiac | `{Crystal} Chakra, Zodiac, and Element Associations` | 说明常见对应关系和使用边界 |
| 8 | How to Use | `How to Use {Crystal}` | 佩戴、冥想、家居摆放、睡前/工作场景；包含 bracelet 场景 |
| 9 | Cleanse/Charge | `How to Cleanse and Charge {Crystal}` | 推荐净化方式（月光、烟熏、声音等）；水和阳光耐受性说明（见 §3.2）；日常保养提示；安全注意事项 |
| 10 | Pairings | `Best Crystals to Pair With {Crystal}` | 3-5个搭配，说明组合意图和内链目标 |
| 11 | Who Should Use | `Who Should Use {Crystal}?` | **人群匹配和预期管理**：适合人群、谨慎使用场景、现实预期；与 6 的边界：6 说"有什么好处"，11 说"什么人适合/不适合，能期待什么" |
| 12 | Product CTA | `Recommended {Crystal} Bracelet` | 1个自然产品推荐块，教育优先，不硬广。**Fallback**：无对应产品时，改为 "Shop by Intention" 链接到相关意图分类页（如 `/collections/anxiety-relief`），或链接到 Crystal Guide 总览页 |
| 13 | FAQ | `FAQ About {Crystal} Meaning` | 5-7问，每个答案 40-70词，可转 FAQ Schema |
| 14 | Closing | 无 H2 | 50-90词，总结并引导到相关 guide 或产品 |

### §3.1 矿物数据写作规则

矿物字段、实体类型、基础区/专业区字段，以 ACF 字段协议为准。本文只保留写作层规则：

- 先判断 `entity_type`，再写 Physical Properties。
- 单一矿物可写完整矿物数据；岩石/集合体/贸易名只写适用字段。
- Quick Facts 的 hardness/origin 必须与 ACF Mineral Data 同源。
- 不能核验的字段不要补空话，也不要编数值。
- 专业矿物数据由 Elementor 模板用 `<details><summary>` 折叠展示。

### §3.2 模块 9 安全写作规则

安全字段选项以 ACF 字段协议为准。正文只解释推荐净化方式、保养原因和用户该怎么做，不重复列完整字段表。

### §3.3 文章分级

14 个模块全部写满，单篇可达 3000-5000 词。按水晶优先级分级执行：

| 等级 | 适用范围 | 必填模块 | 矿物数据 | 目标篇幅 |
|------|---------|---------|---------|---------|
| **Tier A** | 核心水晶（Amethyst, Rose Quartz, Citrine, Black Tourmaline, Clear Quartz） | 完整 14 模块 | 基础区 + 专业区 | 3000-5000 词 |
| **Tier B** | 普通水晶（Moonstone, Lapis Lazuli, Obsidian, Tiger Eye 等） | 1-10, 13-14 | 仅基础展示区 | 2000-3000 词 |
| **Tier C** | 长尾水晶（Howlite, Sodalite, Fluorite 等） | 1-3, 5a, 6, 8, 13, 14 | 仅基础展示区 | 1200-2000 词 |

> **省略规则**：Tier B 省略模块 11 (Who Should Use)、12 (Product CTA 可用 fallback)。Tier C 额外省略模块 4 (Meaning Overview 简化合并到导语)、7 (Chakra/Zodiac 合并到 Quick Facts)、9 (Cleanse/Charge 合并到 FAQ)、10 (Pairings 省略)。

## 4. 图片配置

正文图片嵌入对应模块的 Wysiwyg HTML（见 ACF 字段协议"图片规则"）。单篇 Brief 定义图片位、alt、prompt 和尺寸。

| 图片位 | 嵌入位置 | 尺寸 | 必需 | alt pattern |
|--------|---------|------|------|-------------|
| Featured image | `featured_media`（Hero） | 1600×900 或 1200×630 | ✅ | `{Crystal} meaning guide with {visual descriptors}` |
| Properties 图 | `meaning_overview` 或 `metaphysical_properties` Wysiwyg | 1200×900 | ✅ | `{Crystal} color and texture close-up for crystal properties` |
| Usage 图 | `how_to_use` Wysiwyg | 1200×900 | ✅ | `{Crystal} bracelet used for meditation and daily intention setting` |
| Pairings 图 | `pairing_reason`（可选） | 1200×900 | 可选 | `{Crystal} paired with complementary healing crystals` |
| OG 社交图 | SEO 插件字段 | 1200×630 | 可选 | `{Crystal} meaning social preview image` |

> 图片 prompt 模板在单篇 Brief 中定义，不在本文展开。图片生成发生在文章框架和 Brief 之后。

## 5. 上传字段

| WordPress 字段 | 来源 | 规则 |
|---|---|---|
| `title` | Brief | 与 H1 一致 |
| `slug` | Brief | `{crystal-slug}-meaning` |
| `status` | 固定 | `draft` |
| `content` | 自动拼接 | SEO fallback，按白名单拼接：intro → meaning_overview → metaphysical_properties → chakra_zodiac_detail → how_to_use → cleanse_charge → who_should_use → closing → benefits（列表）→ faqs（列表）。不含 quick_answer、safety_jewelry_care、矿物数据、pairing 描述 |
| `excerpt` | Brief | 140-160字符英文摘要，用于 SERP snippet |
| `featured_media` | 图片配置 | 使用 featured 图媒体 ID |
| `acf` | ACF Field Group "Gemstone Meaning" | 所有字段通过 `acf` 键写入（结构化 + 正文，见 §6） |

## 6. REST API 上传流程

> 所有操作通过 `/wp-json/wp/v2/gemstone` 端点完成。

1. **上传图片**：逐张上传到 `POST /wp-json/wp/v2/media`，记录每个媒体 ID。
2. **创建草稿**：`POST /wp-json/wp/v2/gemstone`，`status` 固定为 `draft`，写入 `title / slug / content / excerpt / featured_media` + `acf` 键中的所有结构化字段。
3. **上传后校验**：读取返回的 draft 链接，检查 H1/H2/H3、图片 URL、alt、featured image、FAQ、内链、ACF 字段值是否完整。

最小 payload 结构：

```json
{
  "title": "{Crystal} Meaning: Healing Properties & Uses",
  "slug": "{crystal-slug}-meaning",
  "status": "draft",
  "content": "{SEO fallback: 按白名单自动拼接}",
  "excerpt": "{140-160 character summary}",
  "featured_media": 12345,
  "acf": {
    "gemstone_name": "Amethyst",
    "subtitle": "The Stone of Peace",
    "tier": "a",
    "intro": "...",
    "quick_answer": "...",
    "attr_chakra": "crown",
    "attr_zodiac": "pisces",
    "attr_element": "water",
    "meaning_overview": "<p>...</p>",
    "metaphysical_properties": "<p>...</p>",
    "benefits": [
      {"benefit_title": "Calms the Mind", "benefit_description": "..."}
    ],
    "how_to_use": "<p>...</p>",
    "safety_water": "safe", "safety_sunlight": "fades",
    "cleanse_charge": "<p>...</p>",
    "faqs": [
      {"faq_question": "Can amethyst go in water?", "faq_answer": "..."}
    ],
    "closing": "..."
  }
}
```

> **注意**：ACF Repeater 字段（`benefits`、`pairings`、`faqs`）通过 REST API 写入时，格式为对象数组。所有 ACF 字段必须在 Field Group 中开启 "Show in REST API"。

## 7. 单篇 Brief 必填项

- 目标水晶名、关键词、搜索量、Tier 等级。
- 实体类型判断（单一矿物 / 岩石集合体 / 处理品 / 不确定）。
- 搜索意图判断：用户想要定义、功效、使用方法、搭配，还是购买前了解。
- 竞品结构摘要：只写结构洞察，不复制竞品原文。
- 文章 H2/H3 大纲：必须沿用本文档固定框架，可按 Tier 等级微调。
- 图片位清单：至少 3 张必需图，全部有 alt 与 prompt。
- 内链计划：至少链接 Crystal Guide、相关功效文章、清洁/充能教程、相关产品或分类。
- 风险声明：不写医疗承诺，不把水晶描述成治疗疾病的替代方案。

## 8. 验收清单

### 内容质量

- [ ] 文章分级（Tier A/B/C）已标注，模块覆盖符合 §3.3 要求。
- [ ] Tier 对应的必填字段已全部填写（对照 FG 文档 Tier 必填矩阵）。
- [ ] 矿物数据已做 `entity_type` 判断，岩石/集合体不强行套单一矿物参数。
- [ ] Quick Facts 的 hardness/origin 与 Mineral Data 来自同一数据源。
- [ ] 模块 4 历史内容有可靠来源支撑，无编造。
- [ ] 模块 5b、6、11 边界清晰：Metaphysical = 传统象征，Benefits = 日常场景收益，Who Should Use = 人群匹配。
- [ ] 模块 9 安全字段使用 §3.2 标准化格式。
- [ ] Wysiwyg 字段不含模块标题（H2/H3），标题由 Elementor 模板渲染。
- [ ] 不包含无法证实的医学、历史、矿物学断言。

### ACF & 上传

- [ ] 文章发布到 `gemstone` 自定义 post type，状态为 `draft`。
- [ ] ACF 结构化字段已通过 REST API 写入，Repeater 格式为对象数组。
- [ ] Select 字段写入 key（如 `crown`）而非显示值（如 `Crown`）。
- [ ] `post_content` fallback 已按白名单自动拼接。
- [ ] Featured image 已上传媒体库并设置 `featured_media`。
- [ ] 正文图片使用媒体库 URL，带 `alt` 和 `loading="lazy"`。
- [ ] Product CTA：Tier A 如果为空打了 warning；有 type 时 url/text 已填。

### SEO & 合规

- [ ] 单篇 Brief 已定义 H1、FAQ、内链、图片位。
- [ ] `excerpt` 已填写 140-160 字符英文摘要。
- [ ] 图片生成发生在文章框架和 Brief 之后，每张有 alt。
- [ ] 发布前已通过 [EEAT 评估](../../../02-自动化工具库/06-内容质检工具/EEAT-内容质量评估.md)。
