# Chakra / Color / Element Spoke 文章框架

> **适用**：变现层分类页，三维度共用（共 23 篇）
> - Chakra 7：`/{chakra}-chakra-crystals/`（root / sacral / solar-plexus / heart / throat / third-eye / crown）
> - Color 12：`/{color}-crystals/`（white / yellow / green / brown / black / pink / blue / red / orange / grey / blue-green / purple）
> - Element 4：`/{element}-crystals/`（earth / fire / air / water）
> **复用**：[模板-Crystals-for-Condition文章框架](模板-Crystals-for-Condition文章框架.md)（11 模块结构、Gutenberg 块、技术实现完全同）
> **数据**：[spoke-data.json](../../04-内容生产/6.chakra-color-element/spoke-data.json)（每维度→水晶列表）+ [crystal-attributes.json](../../07-互动工具/_shared/crystal-attributes.json) + [condition-stone-mapping.md](../../02-网站规划/产品规划/condition-stone-mapping.md)（石种 category id）
> **定位**（2A §一第8条）：变现层分类页，spoke 根级平铺，slug 带 `crystals` 锚定商业意图。无引流层（chakra/color/element 无独立知识搜索需求，纯变现）。

---

## 与 Condition 框架的差异（仅内容侧重，结构不变）

| 模块 | Condition（/crystals-for-X/） | Spoke（本文） |
|---|---|---|
| 中心 | "问题"（焦虑用什么水晶） | "维度"（root chakra 的水晶 / 黑色水晶 / 火元素水晶） |
| M2 Understanding | 日常问题体验 | **维度知识**：脉轮位置+功能 / 颜色象征意义 / 元素特性 |
| M3 推荐列表 | 按 condition 场景选 5-8 颗 | **按维度筛**（spoke-data.crystals，chakra/element 用30核心，color 用390精选8-9） |
| M4 对比表 | 按 condition 模式分组 | 按 sub-场景分组（如 root: grounding vs protection；black: protective vs grounding） |
| M6 组合 | condition 搭配 | **跨维度搭配**（如 root chakra + earth element 共振） |
| M9 FAQ | condition 长尾 | 维度长尾（which chakra for X / what do black crystals mean） |
| TKD keyword | crystals for {condition} | {kw}（spoke-data，如 root chakra crystals / black crystals / fire element crystals） |

**其余模块（M1/M2.5/M5/M7/M8/M10）完全同 condition 框架。**

---

## 11 模块速查（详见 condition 框架 §3）

| # | 模块 | H2 模板 |
|---|---|---|
| M1 | Quick Answer + 导语 | `Quick Answer: Best Crystals for {维度}` + 合规锚点 |
| M2 | Understanding | `Understanding the {维度}`（脉轮位置/颜色象征/元素特性）|
| M2.5 | How We Chose | `How We Chose These Crystals` |
| M3 | 推荐列表 | `{N} Best Crystals for {维度}`（每颗 4 小项：Best for/Why/How to use/描述 + Care note）|
| M4 | 对比表 | `How to Choose by Your {维度} Need` |
| M5 | 使用方法 | `How to Use {维度} Crystals` |
| M6 | 组合 | `Crystal Combinations`（跨维度）|
| M7 | 细分（可选） | `Specific {维度} Situations` |
| M8 | Shop | `Shop {维度} Crystals`（wd/products 块）|
| M9 | FAQ | `FAQ About {维度} Crystals`（7-8 问）|
| M10 | 内链+Closing | `Explore More Crystal Guides` |

**篇幅**：1200-1800 词。**AI 填充**：M2/M3/M4/M5/M6/M9（维度特化内容），其余参数化。

---

## 数据使用

- **spoke-data.json**：每 spoke 的 `crystals` 数组（slug 列表，已按 30 核心优先排序）
- **crystal-attributes.json**：单石 overview（Color/Chakra/Element/Intentions/Best for/Forms）→ 复用到 M3 每颗水晶小项
- **condition-stone-mapping.md**：石种 WooCommerce category id → M8 wd/products 块 `categoriesIds`
- **生成脚本**：`04-内容生产/6.chakra-color-element/scripts/`（骨架 generate-articles.js + AI 填充 workflow）
