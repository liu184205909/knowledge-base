# Crystal Meaning 文章框架与图片配置

> 适用范围：`/blog/{crystal-slug}-meaning` 这一类 Crystal Meaning 文章。Gutenberg/WordPress 编辑器只是发布与排版承载，不是文章框架本身；本类型不新增 Elementor JS 文件。

## 1. 执行顺序

1. **文章框架**：先套用本文档结构，确定 H1/H2/H3、FAQ、内链、产品推荐、Schema、图片位。
2. **单篇 Brief**：从 `03-内容策略/内容清单.csv` 读取标题、关键词、搜索量、URL、优先级，再补充搜索意图、竞品结构、内链目标。
3. **正文草稿**：按文章框架写正文，避免被已有图片素材牵引内容。
4. **图片配置**：正文结构稳定后，逐张定义 `key / placement / size / alt / prompt / required / upload_target`。
5. **生图入库**：使用 Codex 内置生图生成候选图，复制到项目资产目录，上传 WordPress 媒体库，记录媒体 ID 和 URL。
6. **文章上传**：通过 WordPress REST API 创建 `draft` 文章，设置 slug、分类、标签、featured_media、excerpt、SEO字段草案。

## 2. 文章元信息

| 字段 | 规则 |
|---|---|
| Title/H1 | 使用内容清单标题，必要时保留 `{Crystal} Meaning` 主关键词 |
| Slug | 使用内容清单 URL 末段，例如 `amethyst-meaning` |
| URL | `/blog/{crystal-slug}-meaning` |
| Primary keyword | `{crystal} meaning` |
| Secondary keywords | `{crystal} benefits`, `{crystal} properties`, `{crystal} spiritual meaning`, `{crystal} chakra`, `{crystal} bracelet meaning` |
| Search intent | Informational，允许自然承接轻商业推荐 |
| Category | Crystal Meanings |
| Tags | `{Crystal}`, Crystal Meaning, Healing Crystals, Crystal Bracelet |
| Status | 上传默认 `draft`，人工验收后再发布 |

## 3. 固定文章框架

| 顺序 | 模块 | 标题规则 | 内容要求 |
|---|---|---|---|
| 1 | 导语 | 无 H2 | 80-120词，直接回答 `{Crystal} meaning`，说明适合谁读 |
| 2 | Quick Answer | `What Is {Crystal} Meaning?` | 40-60词，适合 AI 摘取；不可夸大医疗功效 |
| 3 | Quick Facts | `Quick Facts About {Crystal}` | 表格：color、chakra、zodiac、element、intentions、best for、common forms |
| 4 | Meaning Overview | `{Crystal} Meaning and Symbolism` | 解释文化/灵性象征，避免伪造历史细节 |
| 5 | Properties | `{Crystal} Properties` | 分成 physical properties 与 metaphysical properties；物理信息需可核验 |
| 6 | Benefits | `{Crystal} Benefits` | 情绪、专注、冥想、日常仪式等软性收益；不写疾病治疗承诺 |
| 7 | Chakra/Zodiac | `{Crystal} Chakra, Zodiac, and Element Associations` | 说明常见对应关系和使用边界 |
| 8 | How to Use | `How to Use {Crystal}` | 佩戴、冥想、家居摆放、睡前/工作场景；包含 bracelet 场景 |
| 9 | Cleanse/Charge | `How to Cleanse and Charge {Crystal}` | 给出安全方式，提示水/日晒敏感性 |
| 10 | Pairings | `Best Crystals to Pair With {Crystal}` | 3-5个搭配，说明组合意图和内链目标 |
| 11 | Who Should Use | `Who Should Use {Crystal}?` | 适合人群、谨慎使用场景、现实预期 |
| 12 | Product CTA | `Recommended {Crystal} Bracelet` | 1个自然产品推荐块，教育优先，不硬广 |
| 13 | FAQ | `FAQ About {Crystal} Meaning` | 5-7问，每个答案 40-70词，可转 FAQ Schema |
| 14 | Closing | 无 H2 | 50-90词，总结并引导到相关 guide 或产品 |

## 4. 图片配置

| key | placement | size | required | alt pattern | prompt pattern | upload target |
|---|---|---|---|---|---|---|
| `crystalMeaning.{slug}.featured` | Featured image + 首屏 | 1600x900 或 1200x630 | 必需 | `{Crystal} meaning guide with {visual descriptors}` | `Premium editorial product photograph for LuckyCrystals: {Crystal} stones and a matching crystal bracelet on a clean warm studio surface, soft natural light, subtle spiritual ritual styling, no text, no hands, no face, realistic, high detail` | WordPress Media Library，设为 `featured_media` |
| `crystalMeaning.{slug}.properties` | Quick Facts 或 Properties 后 | 1200x900 | 必需 | `{Crystal} color and texture close-up for crystal properties` | `Macro educational photo of {Crystal} texture, natural polished and raw stones, neutral background, realistic mineral detail, no labels, no text` | WordPress Media Library，正文 image block |
| `crystalMeaning.{slug}.usage` | How to Use 模块 | 1200x900 | 必需 | `{Crystal} bracelet used for meditation and daily intention setting` | `Lifestyle still life of a {Crystal} bracelet beside a journal, candle, and small crystal bowl on a calm desk, premium crystal wellness brand, no people, no text` | WordPress Media Library，正文 image block |
| `crystalMeaning.{slug}.pairings` | Pairings 模块 | 1200x900 | 可选 | `{Crystal} paired with complementary healing crystals` | `Flat lay of {Crystal} with complementary crystals for energy pairing, organized editorial composition, warm clean background, no text` | WordPress Media Library，正文 image block |
| `crystalMeaning.{slug}.og` | 社交分享图 | 1200x630 | 可选 | `{Crystal} meaning social preview image` | `Wide social preview image for a {Crystal} meaning article, premium crystal arrangement, clean space for optional overlay, no generated text` | WordPress Media Library 或 SEO 插件字段 |

## 5. 上传字段

| WordPress 字段 | 来源 | 规则 |
|---|---|---|
| `title` | 内容清单/Brief | 与 H1 一致 |
| `slug` | 内容清单 URL | 去掉 `/blog/` |
| `status` | 固定 | `draft` |
| `content` | 正文草稿 | 可用普通 HTML/块注释；不要走 Elementor JSON |
| `excerpt` | Brief | 140-160字符英文摘要 |
| `featured_media` | 图片配置 | 使用 featured 图媒体 ID |
| `categories` | WordPress 分类 | `Crystal Meanings` 分类 ID，上传前查表确认 |
| `tags` | WordPress 标签 | `{Crystal}`、`Crystal Meaning`、`Healing Crystals` 等标签 ID |
| `meta` | SEO 插件字段 | 先生成 title/meta description 草案；具体字段按站点插件确认 |

## 6. WordPress REST 上传流程

> 上传文章时只操作 WordPress `posts` 与 `media`，不要生成 Elementor 页面 JSON。

1. **查分类与标签**：读取或创建 `Crystal Meanings` 分类，以及 `{Crystal}`、`Crystal Meaning`、`Healing Crystals`、`Crystal Bracelet` 标签，记录 ID。
2. **上传 featured 图**：`POST /wp-json/wp/v2/media`，成功后记录 `id`、`source_url`、`alt_text`。
3. **上传正文图**：逐张上传 properties/usage/pairings 图，记录媒体 ID 与 URL，用于正文 image block。
4. **生成文章内容**：将正文转成 WordPress 可接受的 HTML 或块内容；图片使用媒体库 URL，不引用本地路径。
5. **创建草稿文章**：`POST /wp-json/wp/v2/posts`，`status` 固定为 `draft`，写入 `title / slug / content / excerpt / categories / tags / featured_media`。
6. **上传后校验**：读取返回的 draft 链接，检查 H1/H2/H3、图片 URL、alt、featured image、FAQ、内链是否完整。

最小 payload 结构：

```json
{
  "title": "{Article Title}",
  "slug": "{crystal-slug}-meaning",
  "status": "draft",
  "content": "{article HTML or block content}",
  "excerpt": "{140-160 character summary}",
  "featured_media": 12345,
  "categories": [123],
  "tags": [456, 457, 458]
}
```

## 7. 单篇 Brief 必填项

- 内容清单行号、标题、关键词、搜索量、KD、CPC、意图、URL。
- 搜索意图判断：用户想要定义、功效、使用方法、搭配，还是购买前了解。
- 竞品结构摘要：只写结构洞察，不复制竞品原文。
- 文章 H2/H3 大纲：必须沿用本文档固定框架，可按具体水晶微调。
- 图片位清单：至少 3 张必需图，全部有 alt 与 prompt。
- 内链计划：至少链接 Crystal Guide、相关功效文章、清洁/充能教程、相关产品或分类。
- 风险声明：不写医疗承诺，不把水晶描述成治疗疾病的替代方案。

## 8. 验收清单

- [ ] 文档中没有把 Gutenberg 称为文章框架。
- [ ] 没有新增或修改 `pages/blog.js` 作为文章发布模板。
- [ ] 单篇 Brief 已定义完整 H1/H2/H3、FAQ、内链、Schema、图片位。
- [ ] 图片生成发生在文章框架和 Brief 之后。
- [ ] 每张图都有 `key / placement / size / alt / prompt / upload target`。
- [ ] 上传到 WordPress 的文章状态为 `draft`。
- [ ] Featured image 已上传媒体库并设置 `featured_media`。
- [ ] 正文图片使用媒体库 URL，不引用 Codex 缓存目录。
- [ ] 不包含无法证实的医学、历史、矿物学断言。
