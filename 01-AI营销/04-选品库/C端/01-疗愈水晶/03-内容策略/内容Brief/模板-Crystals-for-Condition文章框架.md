# Crystals for Condition 文章框架

> **适用**：`/crystals-for-{condition}/` 内容 SEO 页（选品引导型）
> **参照**：[模板-Crystal-Meaning文章框架.md](模板-Crystal-Meaning文章框架.md)（方法论）+ [品牌语调配置](../品牌语调配置.md) §4/§5
> **数据**：[condition-stone-mapping.md](../../02-网站规划/产品规划/condition-stone-mapping.md)（condition→石种+category id）+ [stone-core-data.md](../../02-网站规划/产品规划/stone-core-data.md)
> **技术**：post + Gutenberg 块 + AI 生成 post_content + REST 写入（不用 CPT/Elementor/Pattern/整串 HTML）
> **修订**：2026-06-19（综合 anxiety 试点反馈：wd/products 块、TKD、图片复用 CM、care note、How We Chose、矿物、场景表、FAQ 扩展、稀有购买建议）

---

## 0. 定位（三页区分）

| 页面 | 中心 | 回答 | URL |
|---|---|---|---|
| Crystal Meaning（百科） | 以**水晶**为中心 | "紫水晶是什么" | `/gemstone/{slug}-meaning/` |
| **Condition 页（本文）** | 以**问题**为中心 | "焦虑用什么水晶"（选品引导） | `/crystals-for-{condition}/` |
| Intention Page（产品聚合） | 以**购买**为中心 | WordPress page，产品用意图 tag 拉 | `/{intention}`（如 /calm-mindfulness/） |

---

## 1. URL 结构
```
/crystals-for-{condition}/（根级，对齐 2A §9）
```

---

## 2. 文章元信息 + TKD + 技术实现

| 字段 | 规则 |
|---|---|
| Post Type | `post` + **Gutenberg 块编辑器**（不用 CPT/Elementor） |
| Title/H1 | `{N} Best Crystals for {Condition}: A Complete Guide` |
| Primary keyword | `crystals for {condition}` |
| **rank_math_title** | SEO 标题（必写，试点曾漏）|
| **rank_math_description** | 150-160 字符 SERP 摘要（必写）|
| **rank_math_focus_keyword** | `crystals for {condition}`（必写）|
| **excerpt** | 140-160 字符摘要（必写）|

### 技术实现（post + Gutenberg，AI 批量写入）
- **Gutenberg 块格式 post_content**：AI 按 11 模块生成 `<!-- wp:heading/paragraph/table/wd-products -->` 块，REST 写入 → Gutenberg 识别为可编辑块
- **不用 Pattern/Template**：AI 写入用不上
- **M8 用 wd/products 块**（见 §4，替代 shortcode）
- **不整串 HTML**：区别于 Crystal Meaning（双栏需整串 HTML），condition 页用 Gutenberg 原生块

---

## 3. 文章框架（11 模块）

| # | 模块 | H2 | 内容要点 |
|---|---|---|---|
| M1 | 导语 + Quick Answer | `Quick Answer: Best Crystals for {Condition}` | 直接答 + 60-80 词 condition 日常感受 + **末尾合规锚点**（"complementary wellness tools, not medical treatments"）|
| M2 | Understanding | `Understanding {Condition} in Daily Life` | 日常体验视角，非 DSM 诊断 |
| **M2.5** | **How We Chose** ⭐新增 | `How We Chose These Crystals` | 解释选择逻辑（"覆盖 {condition} 的常见场景：…"）|
| **M3** | 推荐水晶列表 | `{N} Best Crystals for {Condition}` | 5-8 种，链 `/gemstone/{slug}-meaning/`。**每个水晶小结构**（4 小项 + 描述）：① **Best for**（场景）② **Why people choose it**（一句话理由）③ **How to use it**（具体用法，如 "keep on nightstand"/"carry before meetings"）④ 主描述（复用 CM Benefits）⑤ **Care note**（CM safety，selenite/angelite 怕水）⑥ 矿物防医学化（lepidolite lithium）⑦ 稀有购买建议（larimar origin）|
| **M4** | 对比选择表 ⭐改 | `How to Choose by Your {Condition} Pattern` | **按场景分组**（如 anxiety: racing thoughts / emotional waves / social / bedtime → 对应石种），不只 Crystal/Chakra |
| M5 | 使用方法 | `How to Use Crystals for {Condition}` | 佩戴/冥想/摆放/随身；**不含 elixir/饮用** |
| M6 | 组合 | `Crystal Combinations` | 2-3 组搭配 |
| M7 | 细分场景（可选） | `Specific {Condition} Situations` | 仅有搜索量时（如 anxiety→travel/social）|
| **M8** | 产品衔接 ⭐ | `Shop {Condition} Crystals` | **wd/products Gutenberg 块**（见 §4），多石种 OR |
| **M9** | FAQ ⭐扩展 | `FAQ About Crystals for {Condition}` | **7-8 问**，含长尾：overthinking / night / social / cleanse（含 care 提醒）/ bracelet / **scientifically proven**（必含，提升可信）。必含 1 合规问 |
| M10 | 内链矩阵 + Closing | `Explore More Crystal Guides` | 30+ 功效内链 + Closing |

**篇幅**：1200-1800 词（Complete Guide 要名副其实，比试点版充实）

---

## 4. M8 产品衔接（wd/products Gutenberg 块）

用 WoodMart 的 `wd/products` 块（替代 shortcode），按石种 category **id** 多选 OR：

```
<!-- wp:wd/products {"categoriesIds":"1489,1512,1503,1499,1491,1525,1511"} /-->
```

- `categoriesIds`：石种 WooCommerce category **id**（逗号分隔，OR 查询 → 多石种产品）
- anxiety 示例：amethyst=1489, lepidolite=1512, rainbow-moonstone=1503, amazonite=1499, selenite=1491, larimar=1525, angelite=1511
- **全 by-stone id 映射**见 condition-stone-mapping.md / stone-core-data.md
- 可加 `tagsIds` 叠加意图 tag（如 calm）

### Condition→石种 映射（数据）
```json
{
  "anxiety": {
    "primary_crystals": ["amethyst","lepidolite","rainbow-moonstone","amazonite","selenite","larimar","angelite"],
    "product_categories_ids": "1489,1512,1503,1499,1491,1525,1511",
    "intention_page": "/calm-mindfulness/",
    "related_conditions": ["stress","sleep","protection"]
  }
}
```
- M3 水晶描述复用 Crystal Meaning 的 Benefits 模块精华 + 1 句 condition 衔接
- `intention_page` 只作导航链接（intention page 是 WordPress page，产品用 tag，与 condition 页并行）

---

## 5. 图片配置（复用 Crystal Meaning）

| 图位 | 来源 | 添加方式 |
|---|---|---|
| **Featured（hero）** | 复用 CM 的 overview 图，或单独生成 condition 主题图 | REST `featured_media` |
| **M3 水晶卡图**（5-8张）| **复用 CM** `crystal-meaning/{slug}/*.webp`（对应石种图，如 amethyst 卡用 crystal-meaning/amethyst/）| Gutenberg `<!-- wp:image --><figure><img class="wp-image-XXX"/></figure><!-- /wp:image -->` |
| M2/M5 场景图（可选）| 场景图，可生成或暂不加 | wp:image |

> 图片优先复用 CM（已生成/部分已上传 WP），缺的 AI 生成。复用前确认 CM 图的 wp_id（已上传）或 file 路径（本地 webp）。

---

## 6. 合规边界（§4/§5，比竞品更严）

| ❌ 禁用 | ✅ 替换 |
|---|---|
| heal/cure/treat | support/complement/accompany |
| energy/vibration/frequency | presence/influence（传统视角注 "traditionally believed"）|
| "crystals help with anxiety" | "many people seek crystals for..." |
| "relieve/alleviate" | "navigate feelings of"/"find moments of calm" |
| DSM 诊断术语 | 日常体验 |

**合规锚点 3 位置**：M1 导语末 + M9 FAQ（"Can crystals cure?"→No + scientifically proven 问）+ footer。

---

## 7. 去AI化（继承 Crystal Meaning §8）
个人体验视角、避免 AI 句式（In conclusion/important to note）、具体场景、不对称句长、5-8 种水晶描述避免模板句式。

---

## 8. 内链（Condition 页是枢纽）
```
/crystals-for-{condition}/
  ├── → 5-8 Crystal Meaning 百科页
  ├── → 产品页（M8 wd/products）
  ├── → Intention Page（/calm-mindfulness/，WordPress page）
  ├── → 相关 Condition
  └── M10 30+ 功效矩阵
```

---

## 9. 第一批候选（详见 product-structure-plan.md §二）
- **P0**：anxiety / sleep / love / protection / stress
- **P1**：focus / emotional-healing / prosperity / meditation / abundance
- **P2**：confidence / creativity / luck / grief / self-love
- ⚠️ 医疗化（depression/fertility/cancer/pregnancy/weight loss）：M8 不放产品，只教育或暂不做

---

## 10. 与 Crystal Meaning 方法论对齐
| Crystal Meaning（13 模块） | Condition 页（11 模块） |
|---|---|
| 13 模块固定 | 11 模块固定 |
| 三视角 | 不展开，内链到百科 |
| 去AI化/合规锚点 | 完全继承（3 位置）|
| 整串 HTML（双栏）| **Gutenberg 原生块**（单栏，不整串 HTML）|

---

**状态**：综合 anxiety 试点反馈的正式版。下一步：按此重跑 anxiety（wd/products + TKD + 图片复用CM + care note + 扩展FAQ + How We Chose + 矿物 + 场景表）。
