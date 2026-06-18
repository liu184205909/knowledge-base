# Crystal Meaning 文章框架

> 适用范围：`gemstone` post type 的 Crystal Meaning 百科页。
> URL：`/gemstone/{crystal-slug}-meaning`
> 展示层：`post_content` HTML（左正文 + 右 Crystal Profile 卡片双栏布局），由全局 CSS 渲染。
> **数据契约**：HTML 为主，结构化辅助元数据为辅（见 §6）。`content` 字段是发布主源，辅助字段不渲染。
> **分级**：取消 Tier A/B/C 三档分级（对齐 RLM §3.3 默认执行深度）。Crystal Meaning 是可扩展到 100+ 水晶实体页的模板化生产线，默认按完整 13 模块写；Amethyst 只是试点，不代表总量。

---

## 0. 架构与退役声明（必读）

本框架是 Crystal Meaning 的**唯一现行模板**。以下旧方案已退役，不再指导生产，仅作迁移来源/素材库保留：

| 已退役对象 | 原职责 | 退役原因 | 现状处理 |
|---|---|---|---|
| `crystal-single-template.md` + `amethyst-crystal-single.md` + `pages/crystal-single.js` | Elementor 9 Section 模板及其构建脚本 | 已切换为 post_content 流程；Elementor 方案不支持双栏 sidebar 表达 | 三视角/7维标签/产品衔接规则已提炼进本模板；文件**已删除** |
| `upload-gemstone-meaning.js`（结构化 `buildPostContent`） | 结构化字段 → 组装单栏 HTML | 与当前整串 HTML JSON 不兼容；渲染单栏、无双栏 sidebar | **已删除**；由 `scripts/upload-post-content-gemstone.js` 取代（见 §6.3） |
| `configs/crystals/*.json` | 旧 ACF/JS 脚本的结构化字段输入 | 不再作为发布契约 | **已删除**（benefits/pairings/FAQ/mineral data 等素材已迁移到 `04-内容生产/crystal-meaning/` 新结构）；如需历史素材查 git 历史 |
| `/crystal-guide/`、`/crystals/` 旧路径 | Crystal Single URL | 实际 post type=gemstone，permalink 决定 `/gemstone/` | URL 权威源统一到 `/gemstone/`（见 §2） |

**核心策略继承**（从 1H 策略清单 + crystal-single-template 提炼，不可丢失）：
- 超越1：**三视角内容模型**（Scientific / Traditional-Spiritual / Psychological-Mindfulness）→ 落位 Properties 模块（§3.2）
- 超越3：7 维度标签体系（chakra/zodiac/element/number/color/hardness/source）→ 落位 sidebar（§4）
- 超越6：百科→产品自然衔接 → 4 个轻触点（§3.4），非强 Buying Guide

---

## 1. 执行顺序

0. **框架级关键词校准（已完成/定期复核）**：Crystal Meaning 属于高度模板化的实体百科页，关键词研究主要在框架层完成，而不是每篇文章都重新拉重型证据包。框架需吸收 Seed-Master Crystals 的常见 Subtopic，固化为 13 模块和标准映射（见 §3.0）。
1. **Brief 锁定**：按本框架锁定 H1/URL/H2/H3/FAQ/内链/三视角素材/图片位；单篇只做轻量关键词检查，确认该水晶的主词、明显高频词、异常机会词已被框架覆盖或进入 backlog。
2. **内容生成**：按框架生成各模块内容，组装为单个 `post_content` HTML（含双栏布局 + sidebar 卡片），写入 JSON 的 `content` 字段。
3. **图片配置**：正文结构稳定后，逐张定义 `key / placement / size / alt / prompt`。
4. **生图入库**：生成候选图，上传 WordPress 媒体库，记录媒体 ID，回写 JSON `images` + HTML 中的 `wp-image-XXX`。
5. **REST API 上传**：通过 `/wp-json/wp/v2/gemstone` 创建 `draft`，写入 `post_content` + Rank Math SEO 元数据。

---

## 2. 文章元信息

| 字段 | 规则 |
|---|---|
| Post Type | `gemstone` |
| Title/H1 | `{Crystal} Meaning: Healing Properties & Uses` |
| Slug | `{crystal-slug}-meaning`（如 `amethyst-meaning`） |
| URL | `/gemstone/{crystal-slug}-meaning`（CPT permalink 决定，不可改前缀） |
| Primary keyword | `{crystal} meaning` |
| Secondary keywords | `{crystal} benefits`, `{crystal} properties`, `{crystal} spiritual meaning`, `{crystal} chakra`, `{crystal} bracelet meaning` |
| Status | 上传默认 `draft`，人工验收后再发布 |

---

## 3. 固定文章框架（13 模块）

> **输出格式**：全部内容写入一个 `post_content` HTML，使用通用 CSS class 控制样式和布局。H2/H3 标题、正文段落、图片、表格、FAQ 折叠面板都是 HTML 元素。CSS 必须服务于整个 Crystal Meaning 系列，不能只服务某一篇文章。

### HTML/CSS 契约（生成 post_content 时必须遵守）

所有 Crystal Meaning 文章必须沿用同一套通用 class，避免为单篇文章创建 `amethyst-*`、`rose-quartz-*` 这类专用样式。下一篇文章只替换内容、图片、链接和数据，不改页面结构。

**页面骨架（必需）**：

```html
<div class="gemstone-page">
  <div class="gemstone-main">
    <!-- 正文内容 -->
  </div>

  <div class="crystal-profile">
    <!-- 右侧 Crystal Profile 卡片 -->
  </div>
</div>
```

**正文通用组件 class**：

| class | 用途 | 规则 |
|---|---|---|
| `gemstone-page` | 页面双栏外层容器 | 必须包住正文和 sidebar；由全局 CSS 控制 7/3 双栏布局 |
| `gemstone-main` | 左侧正文容器 | H1/H2/H3、段落、列表、图片、表格、FAQ 都放在这里 |
| `subtitle` | H1 下方副标题 | 只放一句定位语，不写长段落 |
| `quick-answer` | 首屏快速回答/边界说明 | 用 `<blockquote class="quick-answer">`，控制在 80-120 词 |
| `featured-image` | 首图 | 只用于第一张主图；其他图片只保留 `wp-image-XXX` |
| `forms-gallery` | How to Use 里的水晶饰品/佩戴形式图 | 默认只放 1 张真实产品佩戴图；确有必要时才扩展到 2-3 张 |
| `forms-table` | How to Use 里的形态/场景表 | 用三列：Form / Common use / What to notice；CSS 已做窄屏换行保护 |
| `benefits-grid` | Benefits 卡片网格 | 包住 3-4 个 benefit card |
| `benefit-card` | 单个 benefit 卡片 | 卡片标题用 H3，不用 H4；正文短段落 |
| `faq-list` | FAQ 折叠列表容器 | 内部使用 `<details><summary>...</summary><p>...</p></details>` |

**Sidebar 通用组件 class**：

| class | 用途 | 规则 |
|---|---|---|
| `crystal-profile` | 右侧固定信息卡 | 必须放在 `gemstone-page` 内、`gemstone-main` 后；由 CSS 控制 sticky |
| `sidebar-section` | sidebar 分区 | Overview / Mineral / Safety 各一个分区 |
| `sidebar-divider` | sidebar 分隔线 | 放在分区之间，不放在最后一个分区后 |
| `safety-badges` | 安全标签容器 | 只放 Water / Sun / Salt 等短标签 |
| `safety-badge` | 单个安全标签 | 需搭配 `badge-safe` / `badge-fades` / `badge-avoid` |
| `cta-button` | sidebar 唯一显性 CTA | 只放一个轻 CTA，如 `Explore {Crystal} Jewelry` / `Shop {Crystal} Crystals` |

**生成约束**：
- 不允许在正文 HTML 里写 `<style>`，CSS 统一维护在 `crystal-meaning-styles.css`。
- 不允许为单篇水晶创建专用布局 class；特殊内容优先用已有通用组件表达。
- 标题层级保持：H1 一篇一个；H2 为主模块；模块内小标题用 H3；不要用 H4 做正文卡片标题。
- `sidebar_profile` 是辅助数据，最终可见 sidebar 仍必须写入 `content` HTML；两者字段要一致。
- 如果某个组件未使用，不要在文章里输出空容器、空标题或空标签。

| # | 模块 | H2 标题规则 | 内容要求 |
|---|---|---|---|
| 1 | 导语 + Boundary Note | 无 H2 | 80-120 词，直接回答 `{Crystal} meaning`，说明适合谁读。末尾一行轻量合规锚点（见 §3.3） |
| 2 | Quick Answer | `What Is {Crystal} Meaning?` | 40-60 词，适合 AI 摘取；不可夸大医疗功效 |
| 3 | Meaning & Symbolism | `{Crystal} Meaning and Symbolism` | 文化/灵性象征；融入历史用途、神话传说、产地故事作为文化背景支撑。**证据规则**：有可靠来源才写具体故事；没有则改为现代使用背景或产地概述，不编造"古埃及人如何使用某某水晶"类内容 |
| 4 | Properties | `{Crystal} Properties` | **= Mineral Data Table + 3 个 H3 视角小节**（见 §3.1 + §3.2）。矿物表为基础事实，科学/传统/正念视角为差异化解释层 |
| 5 | Benefits | `{Crystal} Benefits` | 用户日常场景里的软性收益（"冥想时更专注""办公桌前安心"）；不写疾病治疗承诺。与三视角 Psychological lens 的边界：lens 讲机制，Benefits 讲场景感受 |
| 6 | Chakra/Zodiac/Element | `{Crystal} Chakra, Zodiac, and Element Associations` | 常见对应关系和使用边界 |
| 7 | How to Use | `How to Use {Crystal}` | 佩戴、冥想、家居摆放、睡前/工作场景；**含 `Which {Crystal} Form Is Right for You?` H3 + 1 张真实佩戴/产品图 + Common Forms 选择表**（触点②，见 §3.4） |
| 8 | Quality Notes | `How to Tell Real {Crystal} from Fakes` | 真假鉴别 + 品质避坑（触点③，用户视角教育，不写"为什么买我们"） |
| 9 | Safety & Care | `How to Cleanse and Charge {Crystal}` | 推荐净化方式、水/阳光耐受性（见 §3.3）、日常保养、Care Notes（触点④） |
| 10 | Pairings | `Best Crystals to Pair With {Crystal}` | 3-5 个搭配，说明组合意图；每个推荐水晶名必须优先链接到对应 `/gemstone/{slug}-meaning/` 页面，目标页未发布时保留 slug 并进入内链待复核 |
| 11 | Who Should Use | `Who Should Use {Crystal}?` | 人群匹配和预期管理：适合人群、谨慎使用场景、现实预期 |
| 12 | FAQ | `FAQ About {Crystal} Meaning` | 5-7 问，每答 40-70 词；**不重复正文大段内容**，只短答 + 可锚链回章节；可转 FAQ Schema |
| 13 | Closing | `Final Thoughts on {Crystal}` | 50-90 词，总结并引导到相关 guide（不重复产品 CTA，sidebar 已有） |

> **模块边界（防重复，写作时必须区分）**：
> - **Properties 三视角小节** = 机制/为什么（"紫色来自铁离子辐照"/"传统认为对应顶轮"/"触感锚点原理"）
> - **Benefits** = 场景/感受（"冥想时更专注"/"办公桌前安心"）
> - **Chakra/Zodiac** = 对应关系（只陈述关联，不重复机制）
> 三处都在讲 "calm" 是最常见的重复雷区，按上表分工写死。

### §3.0 框架级关键词校准 + 单篇轻量检查

> **核心**：Crystal Meaning 不做每篇重型关键词证据包。框架创建/大改时必须研究 Seed-Master Crystals 的 Subtopic 分布，把常见搜索意图吸收到固定模块；单篇 Brief 只做轻量检查，避免漏掉该水晶特有的明显机会。

**框架级校准（创建/大改/季度复核时执行）**：

| 标准桶 | 吸收的 Seed-Master Subtopic | 框架处理 |
|---|---|---|
| Meaning | Meaning / Spiritual Meaning | H1、模块3、Traditional lens |
| Properties | Properties | 模块4（Mineral Table + 三个 H3 视角小节） |
| Benefits | Benefits / Use Case / Intention | 模块5；全部按传统/个人体验语境降风险 |
| Chakra | Chakra Basics / Specific Chakra / Chakra Crystals & Jewelry | 模块6；产品型词只做内链或 sidebar 承接 |
| Usage | How to Use / Meditation Basics / Spiritual Practice | 模块7 |
| Care | Cleansing / Charging | 模块9 + FAQ |
| Forms & Quality | Crystal Type / Color-Type / Real-Fake-Quality | 模块7 Common Forms + 模块8 Quality Notes；只选代表词，不铺满变体 |
| Commerce Link | Shopping / Product / Local / Price / Sale | 不驱动百科正文；只进入 sidebar CTA、相关产品/类目内链，或进入 backlog |
| FAQ | PAA 长尾 / 问题型低量词 | 模块12 FAQ |

**单篇轻量检查（Brief 内一张小清单，不另建重证据包章节）**：

| 检查项 | 规则 |
|---|---|
| 主词 | 确认 `{crystal} meaning` / `{crystal} crystal meaning` 与 URL/H1/首屏匹配 |
| 高频支撑词 | 抽查该水晶 top 5-10 关键词是否能落入 13 模块；无需逐词列入正文 |
| 特有机会 | 只记录该水晶独有、框架未覆盖的词（如品种辨析、特殊颜色、极低 KD 教程词） |
| 商业词 | `{crystal} bracelet` / jewelry / price / near me 不进百科主叙事，只做 CTA、内链或 backlog |
| 子页候选 | 不做机械拆分；只有“独立意图明确 + 关键词簇充足 + 主文可自然承接”三条件同时满足，才进入后续子页 backlog |

> `_keyword-evidence-drafts/*.md` 这类重证据包只作为框架校准或审计草稿，不是每篇 Brief 的必需产物，也不作为批量生产默认步骤。

### §3.1 矿物数据写作规则（Mineral Data Table）

- 先判断矿物类型（单一矿物 / 岩石集合体 / 处理品 / 不确定），再写 Physical Properties。
- 单一矿物可写完整矿物数据；岩石/集合体/贸易名只写适用字段。
- sidebar 的 hardness/origin 必须与 Mineral Data 一致。
- 不能核验的字段不要补空话，也不要编数值。
- 矿物数据**不再用表格**——只在右侧 sidebar 的 Material/Mineral 区展示（对齐 amethyst 实践，避免正文表格与 sidebar 数据重复/不一致）。Properties 模块**只写三视角 H3 小节**（The Science / Traditional / Mindfulness），顶部不放 mineral-table。

### §3.2 Properties 三视角写作规则（H3 小节）⭐ 差异化核心

三视角是本框架的头号差异化策略（1H 超越1，5/5 竞品无此结构），**所有水晶必填**，落位 Properties 模块（Mineral Table 之后）。不用额外卡片 class，直接用 H3 + 段落表达，避免 CSS 过度组件化。每个视角控制在 **80-120 词**。

**HTML 结构示例**：
```html
<h3>The Science</h3>
<p>...</p>

<h3>Traditional Meaning</h3>
<p>...</p>

<h3>Mindfulness &amp; Psychology</h3>
<p>...</p>
```

**三个 Lens 各写什么 / 禁止什么**：

| Lens | 写什么 | 禁止什么 |
|---|---|---|
| **Scientific**（The Science） | 可验证的矿物学/地质学/光学/材料属性：化学式、莫氏硬度、晶系、颜色成因、产地、物理特性 | ❌ 远红外、负离子、压电疗愈、频率/振动疗愈、排毒、任何医学效果声称（见下方科学红线） |
| **Traditional-Spiritual**（Traditional Meaning） | 传统象征、文化寓意、脉轮/星座/元素对应、仪式语境，框定为"traditionally associated with / many believe" | ❌ "能治疗/清除疾病"等确定疗效；❌ 绝对化承诺 |
| **Psychological-Mindfulness**（Mindfulness & Psychology） | 颜色心理、注意力锚点、仪式感的心理机制、情绪提示物（有研究支撑则引用，如正念/积极心理学） | ❌ "减少焦虑/改善睡眠"的医学式承诺；❌ 把水晶说成心理治疗工具 |

**🔬 科学红线（强规则，逐篇强制）**：
```
The Scientific lens ONLY covers verifiable mineralogical, geological, optical,
and material properties (chemical formula, Mohs hardness, crystal system,
color origin, geographic sources, physical behavior).

NEVER use these in any lens unless backed by credible peer-reviewed sources:
- far-infrared radiation / infrared therapy claims
- negative ions / negative ion generation
- piezoelectric healing / piezoelectric effect therapy
- frequency / vibration / resonance healing
- detox / toxin-removal claims
- any medical-effect or physiological-treatment claim

水晶的科学价值在矿物事实本身，不在给营销话术披科学外衣。
```

**证据边界句**（Psychological lens 结尾必须自带，替代独立 disclaimer 块）：
> "These effects come from tradition and personal practice, not clinical research. Crystals complement — but never replace — professional care."

### §3.3 安全写作规则（Safety & Care + Disclaimer）

- **Disclaimer 轻量化**：不做独立大模块。导语末尾一行锚链（"Crystal meanings reflect tradition and personal practice, not medical advice →"）+ Psychological lens 结尾证据边界句（§3.2）共同承担合规声明，零篇幅膨胀。
- **合规强制层**：所有措辞必须符合 [品牌语调配置](../品牌语调配置.md) §4-5（GEO+FTC 禁用词表 + 三句话原则 + 销售页禁虚构数据）。本框架不重复禁用词表，写作前必读该文件。
- 正文只解释推荐净化方式、保养原因和用户该怎么做。安全耐受性标识用 `<span class="safety-badge">` 输出到 sidebar（§4）。
- sidebar 的 Safety 字段必须与正文 Care 一致（如 Salt 不写 "Safe" 而写实际耐受）。

### §3.4 产品触点规则（4 个轻触点，非强 Buying Guide）

"百科→产品自然衔接"通过 4 个教育型触点实现，**不单独做 Buying Guide / Brand Selection Standard 模块**：

| 触点 | 位置 | 形式 | 性质 |
|---|---|---|---|
| ① sidebar CTA | 右侧 Crystal Profile 卡片底部 | 一个 `Explore {Crystal} Jewelry` / `Shop {Crystal} Crystals` 按钮 | 唯一显性购买入口 |
| ② Common Forms 选择表 | How to Use 模块内 | H3 `Which {Crystal} Form Is Right for You?` + 1 张真实佩戴/产品图 + Form / Best for / Choose it if 三列轻表（Bracelet / Pendant / Earrings / Anklet / Tumbled / Cluster 等） | 形态+场景教育，帮助购买决策但不写成硬导购 |
| ③ Quality Notes | 独立模块（#8） | 真假鉴别 + 品质避坑 | 信任建设，用户视角 |
| ④ Care Notes | Safety & Care 模块（#9） | 保养提示 + safety 字段 | 保养教育 |

> 文末不再插"一句自然 CTA"。sidebar CTA 是正文区唯一的购买引导，避免软广嫌疑。等有真实选品标准素材，再考虑加 Brand 内容（当前不编造）。

### §3.5 篇幅预算（目标 2500–3500 词，信息密度优先）

| 模块 | 目标词数 |
|---|---|
| 导语 + Quick Answer | 160 |
| Meaning & Symbolism | 400 |
| Properties（Mineral Table + 三视角 H3 小节） | 400 |
| Benefits | 380 |
| Chakra/Zodiac/Element | 240 |
| How to Use + Common Forms 选择表 | 360 |
| Quality Notes | 250 |
| Safety & Care | 250 |
| Pairings | 220 |
| Who Should Use | 240 |
| FAQ | 300 |
| Closing | 80 |
| **合计（上限参考）** | **~3280** |

> **区间 2500–3500，信息密度优先，不为降而降**：上表 ~3280 是深度展开的上限参考；信息密度允许时向 **2500** 压缩（精简各模块内部、**不删模块**），深度需要时至 3500。三视角已压缩（3 个 H3 小节 × 80-120 词 ≈ 300 词）。13 模块必须完整，压缩只在各模块内部，不砍模块。Quality Notes 对 amethyst 是标准化已有内容，对其余水晶是新增但属必要信任模块。
>
> **变更记录**：2026-06-16 由默认 3000–3500 改为 2500–3500（用户偏好，RLM 回流）。

---

## 4. 右侧 Sidebar：Crystal Profile 卡片

在 post_content HTML 末尾生成一个 `<div class="crystal-profile">`（用 `<div>` 不用 `<aside>`，避免 wpautop 问题），包含：

| 区域 | 内容 |
|------|------|
| Overview | Chakra / Zodiac / Element / **Number** / Color / Intentions / Best For / Common Forms |
| Mineral | Formula / Crystal System / Hardness / Specific Gravity / Luster / Transparency / Origins |
| Safety | Water / Sunlight / Salt 耐受性标识（彩色 `safety-badge` 标签，与正文 Care 一致） |
| Shop | 产品推荐按钮（触点①） |

> **Number 维度**：传统灵数/数字对应（如 amethyst 常对应 3 或 7）。**可选字段，有传统对应才填，不编造**。该维度服务未来水晶×数字矩阵交叉内链。

> **Safety 字段精确化**（修正旧版"Salt: Safe"等过度乐观表述）：
> - Water → "Brief rinse safe" / "Avoid water"
> - Sunlight → "Avoid prolonged sun" / "Sun-safe"
> - Salt → "Avoid salt water"（尤其首饰）/ "Salt-safe"
> - Transparency 写 "Transparent to translucent"（多数商业水晶非完全透明）
> - Origins 写多产地（"Brazil, Uruguay, Zambia, Mexico"），不写单一国家

---

## 5. 图片配置

图片嵌入 post_content HTML，使用 `<img class="wp-image-XXX">` 标签。单篇 Brief 定义图片位、alt、prompt、尺寸和 `source_type`。Crystal Meaning 可以先用 AI 图跑通生产线，但宝石/水晶类内容最终应逐步替换真实产品图、真实场景图和真实对比图，以提升视觉信任。

| 图片位 | 位置 | 尺寸 | 必需 | 推荐 source_type | alt pattern |
|--------|------|------|------|-------------------|-------------|
| Featured image | Hero 区（`featured_media` WP 原生） | 1600×900 | ✅ | `real_crystal_closeup` 或 `ai_generated` | `{Crystal} meaning guide with {visual descriptors}` |
| Overview 图 | Module 3 内 | 1600×900 | ✅ | `real_scene_or_diagram` 或 `ai_generated` | `{Crystal} meaning and symbolism visual guide` |
| Properties 图 | Module 4 内 | 1600×900 | ✅ | `real_crystal_closeup` | `{Crystal} color and texture close-up for crystal properties` |
| Benefits 图 | Module 5 内 | 1600×900 | 推荐 | `real_product_or_wearing_photo` | `{Crystal} jewelry benefits for meditation and calm` |
| Usage 图 | Module 7 内 | 1600×900 | ✅ | `real_product_or_scene_photo` | `{Crystal} used for meditation and daily intention setting` |
| Forms 佩戴/产品图 | Module 7 Common Forms 内 | 900×900 或 1600×900 | 推荐 | `real_product_photo` / `real_wearing_photo` | `{Crystal} jewelry worn in daily use` |
| Quality 图 | Module 8 内 | 1600×900 | 可选 | `comparison` / `real_detail_photo` | `{Crystal} real vs fake comparison or quality detail` |
| Pairings 图 | Module 10 内 | 1600×900 | 可选，不默认放 | `real_pairing_photo` 或 `ai_generated` | `{Crystal} paired with complementary healing crystals` |

> **少图原则**：默认控制在 6 张左右：5 张核心内容图 + 1 张真实产品/佩戴图。图片不为凑数量而加；Pairings、Quality 等模块只有在有明确解释价值或可信真实素材时才加图。
>
> **真实素材优先级**：真实佩戴图（手链、项链/吊坠、耳环、脚链）、真实产品细节图、珠子近距离图、颜色深浅对比图、天然色带/色区示例图、床边/办公桌场景图，优先替换 AI 图。Quality Notes 的真假辨别图只有在有可信对比素材时再放；没有可信素材时，宁可暂不放图，也不要用容易误导的 AI 对比图。
>
> 图片 prompt 在单篇图片清单中定义。图片生成发生在文章框架和 Brief 之后。

> **⚠ 踩坑规则（2026-06-18 补充，下一篇起强制）**：
> - **featured image 不要放进 content**：hero 图由 WP `featured_media`（特色图片）负责，上传脚本设 `payload.featured_media`。**content 里不放** `<img class="featured-image">`——否则前台 hero 区（featured_media）和正文重复显示同一张图。早期 amethyst/coral/citrine 已修正。
> - **图片占位符用花括号 + 上传脚本 urlToken 也含花括号**：content 占位符写 `{FEATURED_IMAGE_URL}`（含 `{}`）。上传脚本的 `IMAGE_PLACEHOLDERS.urlToken` **也必须含花括号**（`{FEATURED_IMAGE_URL}`），否则 `split('FEATURED_IMAGE_URL').join(url)` 会把中间替换但**花括号残留** → `{https://...}` → 编辑器/前台破损。这是 coral/citrine 编辑器图片破损的根因（已修）。
> - **图片尺寸 gpt-image 不严格，sharp cover 兜底**：gpt-image-2 的 `size` 参数不保证（请求 1536×1024 可能返回竖图/方图）。生图脚本用 **sharp `resize(1536,864,{fit:'cover'})`** 强制 16:9，不靠原图方向判断。
> - **图片文件夹两级**：`assets/images/generated/crystal-meaning/{crystal}/`（对齐 amethyst），不要用一级 `generated/{crystal}/`。
> - **图片上传后脚本写回本地 json**：`--upload-images` 时把替换后的 content（wp-image）+ media id 写回 json，让下次 `--skip-images` 可用、不重复传图。
> - **⚠ 稀有/贸易名石头必须查命名者原著**：Que Sera、Llanite、Azeztulie 等是市场/贸易名，矿物学描述各流派不一（Melody 正宗 vs 市场叙事常有冲突）。**写 Scientific lens 前必须查命名者原著或权威源**（Melody《Love Is In The Earth》/Mindat/GIA），不能用网络 crystal lore 博客或卖家叙事。例：Que Sera 正宗是蓝粉棕砾岩（无 lepidolite），但市场常当 lavender 锂质岩卖——两套叙事。写时用正宗矿物学，市场叙事降级为"some sellers describe..."。
> - **⚠ 不写幻觉来源**：`eeat.fact_sources` 只填**真实存在的权威条目**（Mindat 矿物条目 URL、GIA 页面、可查的 Wikipedia 条目）。不要编"Wikipedia: Que Sera (crystal)"这种不存在的条目。不确定就留空或标"待验证"。

---

## 6. JSON 数据契约（HTML 为主，结构化为辅）

### §6.1 JSON 骨架

```json
{
  "title": "Amethyst Meaning: Healing Properties & Uses",
  "slug": "amethyst-meaning",
  "status": "draft",
  "excerpt": "140-160 字符英文 SERP 摘要",
  "rank_math_title": "Amethyst Meaning: Healing Properties & Uses",
  "rank_math_description": "...",
  "rank_math_focus_keyword": "amethyst meaning",

  "content": "<div class='gemstone-page'>...完整 HTML（双栏布局 + Crystal Profile sidebar，含 13 模块 + 三视角）...</div>",

  "sidebar_profile": {
    "overview": { "chakra": "", "zodiac": "", "element": "", "number": "", "color": "", "intentions": "", "best_for": "", "forms": "" },
    "mineral":  { "formula": "", "system": "", "hardness": "", "gravity": "", "luster": "", "transparency": "", "origins": "" },
    "safety":   { "water": "", "sunlight": "", "salt": "" }
  },

  "claim_policy": {
    "disclaimer_present": true,
    "medical_claims_audit": "pending",
    "scientific_lens_sources_verified": false,
    "notes": "本篇合规自检记录，QA 用"
  },

  "eeat": {
    "author": "",
    "reviewed_by": "",
    "fact_sources": [],
    "status": "pending"
  },

  "status": {
    "brief_locked": false,
    "draft_uploaded": false,
    "qa_passed": false,
    "published": false
  },

  "images": {
    "featured":   { "file": "...", "alt": "...", "source_type": "ai_generated", "preferred_source_type": "real_crystal_closeup", "wp_id": null },
    "overview":   { "file": "...", "alt": "...", "source_type": "ai_generated", "preferred_source_type": "real_scene_or_diagram", "wp_id": null },
    "properties": { "file": "...", "alt": "...", "source_type": "ai_generated", "preferred_source_type": "real_crystal_closeup", "wp_id": null },
    "benefits":   { "file": "...", "alt": "...", "source_type": "ai_generated", "preferred_source_type": "real_product_or_wearing_photo", "wp_id": null },
    "how_to_use": { "file": "...", "alt": "...", "source_type": "ai_generated", "preferred_source_type": "real_product_or_scene_photo", "wp_id": null },
    "form_bracelet": { "file": "...", "alt": "...", "source_type": "real_product_photo", "preferred_source_type": "real_wearing_photo", "wp_id": null }
  }
}
```

### §6.2 字段渲染规则

| 字段 | 是否渲染到页面 | 用途 |
|---|---|---|
| `content` | ✅ **发布主源**，整串 HTML 直接写入 `post_content` | 页面全部可见内容 |
| `title` / `slug` / `excerpt` / `rank_math_*` | ✅ 写入 WP 字段 / Rank Math meta | SEO |
| `images` | ✅ 上传媒体库后，URL + `wp-image-XXX` 回填进 `content` | 图片渲染 |
| `sidebar_profile` | ❌ 不渲染（sidebar 已在 `content` HTML 内） | 辅助元数据：QA、未来结构化转换钩子 |
| `claim_policy` | ❌ 不渲染 | 合规自检记录，QA 用 |
| `eeat` | ❌ 不渲染；**只填真实信息，没有就留空，绝不编造** | 作者/审核人/来源；未来 E-E-A-T 展示时启用 |
| `status` | ❌ 不渲染 | 生产状态追踪 |

> **辅助字段原则**：`sidebar_profile` / `claim_policy` / `eeat` / `status` 是数据钩子，用于 QA、复用、未来批量转换。它们**不由脚本强制组装 HTML**，页面表达完全由 `content` 控制。这保证当前上线页面不被打断，同时未来若要结构化也有数据可转。

### §6.3 上传流程（post_content 直接上传）

> ⚠️ **当前 Crystal Meaning post_content 流程不使用旧 `buildPostContent()` 渲染器**。旧结构化字段 → 组装单栏 HTML 的逻辑已退役（见 §0）。

```
Step 1: 上传图片 → POST /wp-json/wp/v2/media（每张一次）→ 获得 media ID + URL
Step 2: 回写 content HTML（图片 URL + wp-image-ID 填入对应位置）
Step 3: 创建草稿 → POST /wp-json/wp/v2/gemstone
        payload: { title, slug, status:"draft", content(整串HTML), excerpt, featured_media }
Step 4: 写 Rank Math meta → 使用已验证的 Rank Math REST 写入方式
        （普通 WordPress REST API 的 meta 字段可能不生效；具体 endpoint 和 payload 以 dry-run/草稿实测为准）
```

> 上传脚本已由 `scripts/upload-post-content-gemstone.js` 取代（旧 `upload-gemstone-meaning.js` 及 `buildPostContent` 已删除）。新脚本：读 content HTML → 上传图片并替换占位符 → 写 post_content + Rank Math meta。**默认 dry-run 不连 WP**；`--status draft` 创建草稿；`--publish` 才发布。图片分层：`--upload-images` 上传+替换占位符，`--skip-images` 只传 content（content 仍含占位符时报错，不静默跳过）。dry-run 已验证可正确解析 amethyst-meaning.json（20681 字符 + 6 个占位符）。

---

## 7. 单篇 Brief 必填项

- 目标水晶名、关键词、搜索量。
- 实体类型判断（单一矿物 / 岩石集合体 / 处理品 / 不确定）。
- 搜索意图判断：用户想要定义、功效、使用方法、搭配，还是购买前了解。
- 竞品结构摘要：只写结构洞察，不复制竞品原文。
- 文章 H2/H3 大纲：必须沿用本文档 13 模块固定框架。
- **三视角素材**：Scientific lens 的矿物事实来源（GIA/Mindat 等，或标注"待验证"）；Traditional/Psychological lens 的传统与心理学依据。
- 图片位清单：至少 3 张必需图，全部有 alt 与 prompt。
- 内链计划：至少链接 Crystal Guide Index、相关水晶百科、相关功效/教程、产品或分类。
- **风险声明**：不写医疗承诺，不把水晶描述成治疗疾病的替代方案（引用品牌语调配置 §4-5）。

---

## 8. 去 AI 化规则

> 参考：[英文SEO批量写作与去AI化工作流.md](../../../../../01-营销方法论基础/07-英文SEO批量写作与去AI化工作流.md)
> **合规层**：写作前必读 [品牌语调配置](../品牌语调配置.md) §4-5（GEO+FTC 禁用词表）。本节禁用词是"AI 味"词，品牌语调禁用词是"合规"词，两者职责不同、均强制。

### 生成阶段 Prompt 约束

```
- Never use "It's not just X, it's Y" or "X goes beyond Y" (negation/comparison pattern)
- Never start with "Whether you're..." or "In today's..."
- Vary sentence length aggressively (some 5-word sentences, some 30-word)
- Use contractions (it's, don't, won't, can't)
- No hedging ("It could be argued", "Generally speaking")
- End with forward momentum, not a summary
- Replace banned words with concrete alternatives
```

### 禁用词表（AI 味）

**动词**：delve, leverage, foster, ignite, empower, uncover, unleash, underscore, optimize, streamline, navigate, demystify, elevate, harness, augment

**形容词**：cutting-edge, seamless, robust, multifaceted, transformative, revolutionary, comprehensive

**名词/隐喻**：tapestry, landscape, realm, beacon, symphony, testament, journey, roadmap, ecosystem, paradigm

**过渡词**：Furthermore, Moreover, Additionally, In conclusion, Ultimately, At the end of the day

### 编辑阶段检查清单

| # | 检查项 | 标准 |
|---|--------|------|
| 1 | AI 味禁用词命中 | ≤ 5 处/篇 |
| 2 | 合规禁用词命中（品牌语调 §4） | 0 处（heal/cure/treat/guarantee 等） |
| 3 | "associated with" 重复 | ≤ 2 次/篇 |
| 4 | 句式等长 | 有长短交替（burstiness） |
| 5 | 否定/对比结构 | 0 处（"not just X, it's Y"） |
| 6 | 模糊结尾 | 不用 "timeless"、"companion"、"journey" |
| 7 | 科学红线 | Scientific lens 无 far-infrared/negative ions/piezoelectric 等伪科学 |
| 8 | 边界声明 | 每篇至少 1 处"不适用/不确定/非医疗"声明 |
| 9 | 三视角分工 | Lens/Benefits/Chakra 无重复讲同一机制 |

---

## 9. 验收清单

### 内容质量

- [ ] 13 模块完整，无 Tier 分级遗漏（已取消分级，全水晶统一）。
- [ ] **三视角已落地**：Properties 含 Scientific / Traditional-Spiritual / Psychological-Mindfulness 三 lens，各 80-120 词。
- [ ] **科学红线通过**：Scientific lens 无伪科学声称（far-infrared/negative ions/piezoelectric/frequency/detox/medical）。
- [ ] 矿物数据已做实体类型判断，岩石/集合体不强行套单一矿物参数。
- [ ] sidebar 的 hardness/origin/safety 与正文 Mineral Data / Care 来自同一数据源。
- [ ] 模块 3 历史内容有可靠来源支撑，无编造。
- [ ] 三视角 / Benefits / Chakra 边界清晰，无重复机制。
- [ ] Quality Notes 独立成模块，用户视角，无品牌自夸。
- [ ] 不包含无法证实的医学、历史、矿物学断言。
- [ ] 去 AI 化检查通过（§8 全部 9 项）+ 品牌语调合规检查通过。

### 数据契约

- [ ] JSON `content` 为整串 HTML，含双栏布局 + Crystal Profile sidebar。
- [ ] 辅助字段（sidebar_profile/claim_policy/eeat/status）已填，eeat 无真实信息则留空不编造。
- [ ] `claim_policy` 记录合规自检结果。

### 上传与渲染

- [ ] 文章发布到 `gemstone` post type，URL 为 `/gemstone/{slug}-meaning`。
- [ ] `post_content` HTML 结构完整（双栏布局 + sidebar）。
- [ ] 使用 `<div>` 而非 `<main>`/`<aside>`（避免 wpautop 问题）。
- [ ] Featured image 已上传媒体库并设置 `featured_media`。
- [ ] 所有图片有 `alt` 文本和 `wp-image-XXX` class。
- [ ] Rank Math meta 已通过草稿实测写入，SEO title / description / focus keyword 在后台可见。
- [ ] 内链可正常点击：单品页 `/gemstone/{slug}-meaning/`、Crystal Guide Index `/gemstones/`（**注意复数**，不是 `/gemstone/`——后者会被 WP 重定向到产品页）、分类页根级（见 [2A-网站结构](../../02-网站规划/2A-网站结构.md) §二）；非旧 `/crystal-guide/` 或 `/crystals/`。
- [ ] 移动端布局正常（sidebar 堆叠到正文下方）。

### SEO & 合规

- [ ] 单篇 Brief 已定义 H1、三视角素材、FAQ、内链、图片位。
- [ ] `excerpt` 已填写 140-160 字符英文摘要。
- [ ] 发布前已通过 [EEAT 评估](../../../../../02-自动化工具库/06-内容质检工具/EEAT-内容质量评估.md)。
- [ ] 品牌语调配置 §4-5 禁用词零命中。

---

## 10. 内容独特性规则（变体水晶）

> 当两个水晶属于同一矿物族（如 Blue Calcite 和 Green Calcite 都是 CaCO₃），内容独特性必须达标，否则 Google 会判定为 thin/duplicate content。

### 必须独特的内容（≥ 80% 措辞不同）

| 模块 | 为什么必须不同 |
|------|-------------|
| 导语 + Quick Answer | 每个水晶的"一句话定义"不同 |
| Meaning & Symbolism | 历史故事、文化寓意、产地故事完全不同 |
| Three Lenses — Traditional | 传统象征不同（Blue Calcite = 沟通；Green Calcite = 情绪平衡） |
| Three Lenses — Psychological | 心理学角度不同（注意力锚点/场景不同） |
| Benefits | 具体使用场景和感受描述不同 |
| FAQ | 每个水晶有自己的常见问题 |
| Closing | 收尾感悟不同 |

### 可以部分共享的内容（模板 + 水晶专属细节）

| 模块 | 共享部分 | 必须不同的部分 |
|------|---------|-------------|
| Three Lenses — Scientific | 矿物族基础数据（化学式、晶系） | 颜色成因、产地、物理特性差异 |
| How to Use | 使用方法框架（佩戴/冥想/摆放） | 专属建议（如该水晶适合特定场景） |
| Safety & Care | 通用保养规则 | 水晶特定警告（褪色/溶水/刮擦） |
| Chakra/Zodiac | 对应体系说明 | 具体对应关系（不同轮/不同星座） |
| Pairings | 搭配格式 | 推荐搭配的水晶和理由不同 |

### 可以完全共享的内容（事实数据，不算重复）

| 内容 | 理由 |
|------|------|
| Mineral Data Table（矿物表格） | 事实性数据（CaCO₃ 就是 CaCO₃），Google 不判定为重复 |
| Safety Badges（安全标识） | 事实性数据 |
| Crystal Profile sidebar 数据 | 结构化事实数据 |

### 独特性比例要求

| 指标 | 标准 |
|------|------|
| 必须独特的内容占总词数 | ≥ 65% |
| 同矿物族变体之间的文本相似度 | ≤ 40%（不含矿物表格和安全标识） |
| 禁止"换名复制" | 不能只替换水晶名、颜色名，其余文本不变 |

### 变体独特性验证

写完同族变体后，对比检查：

```
Blue Calcite vs Green Calcite：
  ✅ 导语不同（一个是"沟通石"，一个是"情绪疗愈石"）
  ✅ 历史不同（不同文化背景）
  ✅ Benefits 不同（不同使用场景）
  ✅ FAQ 不同（不同常见问题）
  ✅ Chakra 不同（喉轮 vs 心轮）
  ⚠️ 矿物表相同（都是 CaCO₃）← OK，事实数据
  ⚠️ Safety 相似（都怕酸）← OK，加水晶专属警告
```

> **稀有矿物例外**：如果某水晶形而上学传统极有限（如 Acanthite、Aegirine），正文可短至 800-1200 词，诚实标注 "limited metaphysical tradition"。不硬凑重复内容。
