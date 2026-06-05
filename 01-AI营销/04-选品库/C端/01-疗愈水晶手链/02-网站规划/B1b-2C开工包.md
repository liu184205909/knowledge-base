# B1b 2C 开工包

> **RLM步骤**: 步骤2C开工前验收  
> **创建时间**: 2026-05-18  
> **适用范围**: B1b核心SEO模板，Crystal Single(×15) + Intention Category(×6)  
> **当前结论**: 暂不建议直接批量生成/上传。B1b应先完成真实竞品URL替换、URL归属决策、脚本安全改造、图片位置清单和单页依据包。
> **边界**: 本文件只服务 B1b 进入 2C 前的局部验收，不是项目入口；项目当前下一步以 [00-项目简报.md](../00-项目简报.md) 为准。

---

## 1. 范围边界

### 本开工包包含

- Crystal Single(×15): 首批15种水晶单页/百科模板。
- Intention Category(×6): 首批6个意图分类页。
- 真实竞品URL核验状态。
- `pages/*.js` 模板可执行性审计。
- B1b进入逐页2C前必须解决的决策点。

### 本开工包不包含

- B2/B3页面。
- 博客正文批量生产。
- WordPress页面上传/发布。
- 图片生成和上传。图片属于2D前的资产执行环节，本文件只定义图片位置和独立prompt要求。

---

## 2. 2C开工门槛

B1b每个页面进入2C前必须同时满足以下条件：

- 页面已经在 `页面决策表.md` 中被批准进入 B1b。
- 模板URL已经替换为真实可访问URL，不能使用 `[crystal]`、`[intention]` 这类占位路径。
- 每个页面必须有单页依据包：核心参考竞品、真实参考URL、上游来源索引（1C关键词/1D深度拆解/1E结构/1F内容/1H策略）、采用/规避/差异化点。B1b 属于高价值SEO模板，建议每个模板维度准备 3-5 家核心参考；最低不得少于2家。
- 2C 只做核心URL轻量复核，不重新深度拆解竞品；新增临时参考必须能追溯到上游分析或补充说明其使用边界。
- 已确定该页面的 canonical URL，避免和步骤3博客内容形成同关键词重复页面。
- 已完成图片位置清单，且每个关键视觉位都有独立图片prompt或明确复用理由。
- Elementor脚本可以被安全引用和批量配置，不会因为 `require()` 或批处理加载而自动创建测试draft。

---

## 3. 首批 Crystal Single(×15) 建议清单

> 清单来源优先使用项目简报登记的内容清单 Google Sheet；本地 `03-内容策略/内容清单.csv` 未重新导出前仅作旧快照。B1b是核心SEO模板，页面数量和顺序应由关键词数据驱动，而不是由现有图片资产倒推。

| # | Crystal | 主关键词 | 搜索量 | 内容清单URL | B1b建议URL | 当前图片资产 | 竞品URL核验状态 |
|---|---|---:|---:|---|---|---|---|
| 1 | Amethyst | amethyst meaning | 90500 | `/blog/amethyst-meaning` | 待决策 | 有 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 2 | Rose Quartz | rose quartz meaning | 74000 | `/blog/rose-quartz-meaning` | 待决策 | 有 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 3 | Citrine | citrine meaning | 49500 | `/blog/citrine-meaning` | 待决策 | 有 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 4 | Black Tourmaline | black tourmaline meaning | 40500 | `/blog/black-tourmaline-meaning` | 待决策 | 有 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 5 | Clear Quartz | clear quartz meaning | 33100 | `/blog/clear-quartz-meaning` | 待决策 | 有但偏通用 | Crystal Vaults `quartz/` 为 `200`; Moonrise需浏览器复核 |
| 6 | Tiger Eye | tiger eye meaning | 27100 | `/blog/tiger-eye-meaning` | 待决策 | 有但偏通用 | Crystal Vaults当前候选URL `404`; 需补真实URL |
| 7 | Moonstone | moonstone meaning | 22200 | `/blog/moonstone-meaning` | 待决策 | 有但偏通用 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 8 | Lapis Lazuli | lapis lazuli meaning | 18100 | `/blog/lapis-lazuli-meaning` | 待决策 | 缺资产key | Crystal Vaults当前候选URL `404`; 需补真实URL |
| 9 | Obsidian | obsidian meaning | 22200 | `/blog/obsidian-meaning` | 待决策 | 有 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 10 | Howlite | howlite meaning | 12100 | `/blog/howlite-meaning` | 待决策 | 有但偏通用 | Crystal Vaults当前候选URL `404`; 需补真实URL |
| 11 | Selenite | selenite meaning | 14800 | `/blog/selenite-meaning` | 待决策 | 有但偏通用 | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 12 | Fluorite | fluorite meaning | 12100 | `/blog/fluorite-meaning` | 待决策 | 有但偏通用 | Crystal Vaults候选URL跳转到博客页; 需确认是否可作为百科参考 |
| 13 | Green Aventurine | green aventurine meaning | 9900 | `/blog/green-aventurine-meaning` | 待决策 | 有 | Crystal Vaults当前候选URL `404`; 需补真实URL |
| 14 | Carnelian | carnelian meaning | 9900 | `/blog/carnelian-meaning` | 待决策 | 缺资产key | Crystal Vaults `200`; Moonrise需浏览器复核 |
| 15 | Pyrite | pyrite meaning | 8100 | `/blog/pyrite-meaning` | 待决策 | 缺资产key | Crystal Vaults `200`; Moonrise需浏览器复核 |

### Crystal Single 必须先解决的URL归属冲突

当前内容清单口径把 Crystal Meaning 系列规划为 `/blog/[crystal]-meaning`，而 `crystal-single.js` 注释中使用 `/crystal-guide/[crystal]-meaning`。这会形成同一关键词的两个潜在目标页：

- 博客文章: `/blog/amethyst-meaning`
- B1b Elementor百科页: `/crystal-guide/amethyst-meaning`

**已决策 (2026-06-05)**：采用推荐方案。

- **已采纳**: B1b Crystal Single 作为 canonical SEO 百科页，使用 `/crystal-guide/[crystal]-meaning`。
- **内容清单同步**: 步骤3博客中对应的 `[crystal]-meaning` 选题改为支撑/扩展文章（如 "amethyst properties", "how to cleanse amethyst"），避免争夺同一主关键词。内容清单的 `/blog/[crystal]-meaning` URL 需在 Step 3 Brief 阶段更新。

---

## 4. 首批 Intention Category(×6) 建议清单

> 意图页应承接商品转化和内部链接，不应和步骤3的 `crystals for ...` 博客文章互相抢同一SERP位置。分类页偏购买/浏览，博客页偏解释/教程。

| # | 建议页面名 | 建议slug | 对应内容清单主题 | 竞品URL核验状态 | 需要决策 |
|---|---|---|---|---|---|
| 1 | Anxiety & Stress Relief | `anxiety-relief` | crystals for anxiety / crystals for stress | Energy Muse模板路径 `404`; Satin候选URL `404` | 需补真实竞品页或更换参考站 |
| 2 | Love & Relationships | `love-relationships` | crystals for love | Satin `love-crystals` 为 `200`; Energy Muse模板路径 `404` | 可先以Satin为结构参考，补第二竞品 |
| 3 | Protection & Clearing | `protection-clearing` | crystals for protection | Satin `protection-crystals` 为 `200`; Energy Muse模板路径 `404` | 与脚本默认 `protection-grounding` 统一命名 |
| 4 | Abundance & Success | `abundance-success` | crystals for wealth | Energy Muse模板路径 `404`; Satin `prosperity-crystals` 为 `404` | 与脚本默认 `wealth-prosperity` 统一命名 |
| 5 | Sleep & Calm | `sleep-calm` | crystals for sleep | Energy Muse模板路径 `404`; Satin `sleep-crystals` 为 `404` | 与已存在站点分类 `calm-mindfulness` 做取舍 |
| 6 | Focus & Clarity | `focus-clarity` | crystals for focus | Satin `focus-crystals` 为 `200`; Energy Muse模板路径 `404` | 可先以Satin为结构参考，补第二竞品 |

### Intention Category 命名建议

优先统一为面向购买意图的短slug：

- `anxiety-relief`
- `love-relationships`
- `protection-clearing`
- `abundance-success`
- `sleep-calm`
- `focus-clarity`

其中 `protection-clearing` 和 `abundance-success` 更贴近当前站点已出现的分类命名；脚本里的 `protection-grounding`、`wealth-prosperity` 应在批量生成前统一。

---

## 5. 竞品URL核验记录

### Crystal Vaults

可直接用于首批部分Crystal Single参考：

- `https://www.crystalvaults.com/crystal-encyclopedia/amethyst/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/rose-quartz/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/citrine/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/black-tourmaline/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/quartz/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/moonstone/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/obsidian/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/selenite/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/carnelian/` - 200
- `https://www.crystalvaults.com/crystal-encyclopedia/pyrite/` - 200

需要重新搜索真实URL（已补齐 2026-06-05）：

- ~~Tiger Eye~~ — Crystal Vaults 无独立百科页；替代竞品：`beadage.net/gemstones/tigers-eye/`、`moonrisecrystals.com/tigers-eye-meaning/`、`mycrystals.com/meaning/tiger-eye`
- ~~Lapis Lazuli~~ — `crystalvaults.com/crystal-encyclopedia/lapis/` 已确认
- ~~Howlite~~ — Crystal Vaults 无独立百科页；替代竞品：`beadage.net/gemstones/howlite/`、`moonrisecrystals.com/howlite-meaning/`、`mycrystals.com/meaning/howlite`
- ~~Green Aventurine~~ — `crystalvaults.com/crystal-encyclopedia/aventurine-green/` 已确认
- ~~Fluorite~~ — Crystal Vaults 按颜色分 4 个百科页：`clear-fluorite/`、`purple-fluorite/`、`green-fluorite/`、`blue-fluorite/`；主力参考 `purple-fluorite/`

### Moonrise Crystals

搜索结果可以确认其存在水晶meaning页面，但命令行HTTP请求容易被拦截或返回非标准状态。进入2C轻量复核前应使用浏览器逐个打开并记录实际URL，而不是继续沿用 `moonrisecrystals.com/crystal-guides/[crystal]` 这类占位路径。

### Satin Crystals

可直接用于部分Intention Category参考：

- `https://www.satincrystals.com/collections/love-crystals` - 200
- `https://www.satincrystals.com/collections/protection-crystals` - 200
- `https://www.satincrystals.com/collections/focus-crystals` - 200

以下候选URL不可直接用于2C：

- `https://www.satincrystals.com/collections/anxiety-relief` - 404
- `https://www.satincrystals.com/collections/prosperity-crystals` - 404
- `https://www.satincrystals.com/collections/sleep-crystals` - 404

### Energy Muse

当前 `energymuse.com/collections/[intention]` 模板路径不可靠，下列候选均返回404：

- `/collections/anxiety-relief`
- `/collections/love`
- `/collections/protection`
- `/collections/sleep`
- `/collections/prosperity`
- `/collections/focus`

2C前必须重新搜索Energy Muse真实可访问页面；如果没有稳定页面，应改用其他竞品作为该意图页的第二参考。

---

## 6. 脚本审计

### `pages/crystal-single.js`

当前不能直接进入批量2C，原因：

- 文件末尾无 `module.exports`，不能被批量配置脚本安全复用。
- 文件末尾直接执行 `main()`，一旦被加载可能自动创建默认Amethyst draft。
- 图片使用 `IMAGES.products.bracelet.url` 和 `IMAGES.shared.wide.url`，会导致15种水晶共用通用图。
- 默认内容只覆盖Amethyst，不是15种水晶的可配置内容源。
- URL策略与当前内容清单口径冲突：脚本偏 `/crystal-guide/[crystal]-meaning`，内容清单偏 `/blog/[crystal]-meaning`。

开工前建议改造：

- 导出 `generateCrystalSingle`。
- 用 `if (require.main === module)` 包裹 `main()`。
- 支持 `config.heroImage`、`config.productImage`、`config.relatedImages`。
- 新增15种水晶配置文件，配置文件只放页面数据，不自动上传。

### `pages/intention-category.js`

当前不能直接进入批量2C，原因：

- 虽然已 `module.exports = generateIntentionPage`，但文件末尾仍直接执行 `main()`。
- 大量使用 `IMAGES.shared.card.url` 作为占位图，容易复现“图片严重复用”的历史问题。
- 默认配置只有 Anxiety & Stress Relief。
- 默认相关意图命名和现有站点分类存在冲突：`protection-grounding` vs `protection-clearing`，`wealth-prosperity` vs `abundance-success`。

开工前建议改造：

- 用 `if (require.main === module)` 包裹 `main()`。
- 支持每个意图页的 `heroImage`、水晶卡片图、相关意图图、博客卡片图。
- 新增6个意图配置文件，配置文件只放页面数据，不自动上传。

---

## 7. 图片策略

B1b不能沿用B1a之前的通用复用图逻辑。建议最小图片清单如下：

| 页面类型 | 最小图片数 | 用途 |
|---|---:|---|
| Crystal Single | 每种3张，合计45张 | hero图、对应商品/佩戴图、搭配/相关水晶图 |
| Intention Category | 每个意图4张，合计24张 | hero图、核心水晶组合图、场景图、相关意图图 |

如果为了速度采用阶段化方案，至少也要保证：

- 每个Crystal Single有独立hero图，不得15页共用同一张宽图。
- 每个Intention Category有独立hero图和核心水晶组合图。
- 复用图必须在单页依据包中说明复用理由。

---

## 8. B1b下一步执行顺序

1. 先决策 Crystal Meaning canonical URL：`/crystal-guide/` 还是 `/blog/`。
2. 修复 `crystal-single.js` 和 `intention-category.js` 的自动执行问题。
3. 新建 B1b 配置数据，不直接上传。
4. 逐个补齐真实竞品URL：
   - Crystal Single先补 Crystal Vaults缺口和Moonrise实际URL。
   - Intention Category先补 Energy Muse/Satin不可用URL的替代竞品。
5. 逐页生成单页依据包，再进入内容撰写和图片prompt。
6. 完成一页的抓取、内容、图片prompt和脚本配置后，再开始下一页。

---

## 9. Product Detail 结构化评价字段规格（2026-06-01补充）

> **来源**：C端水晶站 GEO 优化策略 — "UGC和评价要结构化，把评价从简单星级改成更有结构的信息"
> **详细设计**：见 [GEO-AI购物旅程内容补充.md §3.1](../03-内容策略/GEO-AI购物旅程内容补充.md)
> **执行时机**：B1b Product Detail 模板开发时同步实现，属于 WooCommerce 产品模板范畴

### WooCommerce 产品评价结构化字段

| 字段 | 类型 | 选项 | Schema 标记 |
|------|------|------|------------|
| Wearing Scenario | 单选标签 | Daily Wear / Sleep / Meditation / Gift / Work / Ritual | `PropertyValue` |
| Purchase Purpose | 单选标签 | Self-Care / Gift / Emotional Support / Style / Spiritual Practice | `PropertyValue` |
| Wrist Size | 数字输入 | 14-18cm | `PropertyValue` |
| Comfort Rating | 1-5星 | — | `Rating` |
| Overall Rating | 1-5星 | — | `Rating` |
| Photo Upload | 图片（可选） | 用户佩戴照片 | `ImageObject` |
| Free-text Review | 文本 | — | `reviewBody` |

### 实现方式

| 方案 | 说明 | 推荐度 |
|------|------|:------:|
| **WooCommerce 插件** | 使用 "WC Product Reviews Pro" 或 "YITH WooCommerce Product Reviews" 插件添加自定义评价字段 | ⭐ 推荐 |
| **自定义 Hook** | 通过 `woocommerce_product_review_comment_form_args` 添加自定义字段 + `comment_meta` 存储 | 备选（开发量大） |
| **Elementor 评价模板** | 产品页评价区用 Elementor Pro 的 WooCommerce Reviews widget 渲染 | 搭配插件方案使用 |

### 2C 开工包补充要求

B1b Product Detail 的 2C 开工包（当前 Product Detail 由 WooCommerce 模板承接，B1a 不创建独立页面）需额外包含：
- 评价区结构化字段布局设计
- Review Schema 的 `additionalProperty` 标记模板
- 评价引导 CTA 的文案和设计

---

## 10. 当前开工判断

| 项目 | 判断 | 原因 |
|---|---|---|
| B1a 2D前端验收 | 可以继续 | B1a图片已入库，draft已存在，下一步是预览验收 |
| B1b Crystal Single 2C | 准备工作基本完成 | URL归属已决策(/crystal-guide/)、脚本已修复、15个配置文件已创建、竞品URL已补齐。剩余：单页依据包、图片prompt、浏览器复核竞品URL |
| B1b Intention Category 2C | 准备工作基本完成 | slug命名已统一、脚本已修复、6个配置文件已创建、Satin部分URL可用。剩余：Energy Muse替代竞品、单页依据包、图片prompt |
