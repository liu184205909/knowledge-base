# ACF Field Group 设计 — Gemstone Meaning

> **Field Group 名称**: `Gemstone Meaning`
> **Location Rule**: Post Type == `gemstone`
> **设计依据**: [模板-Crystal-Meaning文章框架.md](../03-内容策略/内容Brief/模板-Crystal-Meaning文章框架.md)
> **创建日期**: 2026-06-08
> **状态**: 待确认后生成 PHP 代码

---

## 0. 设计原则

| 原则 | 说明 |
|------|------|
| 1 FG 1 Post Type | 所有字段在一个 FG "Gemstone Meaning" 中，通过 Tab 组织 UI |
| 全 ACF | 页面可渲染内容均以 ACF 字段为主；不同 Tier 允许部分模块字段为空，Elementor 模板按字段是否有值决定是否渲染 |
| 标题归模板 | 模块标题（H2/H3）由 Elementor 模板统一渲染；ACF Wysiwyg 字段只存正文段落 HTML，不含模块标题 |
| 命名规范 | 全部 snake_case，前缀分组：`attr_`（Quick Facts）、`mineral_`（矿物数据）、`safety_`（安全）、`product_cta_`（CTA）、正文模块无前缀 |
| 文档边界 | 本文件只定义 ACF 字段协议；文章结构和写作规则以内容框架文档为准 |

### 当前技术路线

- CPT：`gemstone`
- ACF Field Group：`Gemstone Meaning`
- 展示层：Elementor Single Template 读取 ACF 字段渲染
- 上传方式：`POST /wp-json/wp/v2/gemstone`，通过 `acf` 键写入所有字段

### 图片规则

正文图片嵌入对应模块的 Wysiwyg HTML 中，不设独立 ACF Image 字段：

- 图片 URL 必须是 WordPress 媒体库地址（`/wp-content/uploads/...`），不允许本地路径
- `<img>` 必须带 `alt` 和 `loading="lazy"`
- 图片嵌入位置由单篇 Brief 指定，不由 AI 自由决定
- Featured image 使用 WordPress 原生 `featured_media` 字段

### 容易崩掉的边界

| 风险 | 处理方式 |
|------|----------|
| 字段过多导致批量生产变慢 | Tier A/B/C 控制必填字段；专业矿物数据只对 Tier A 强制 |
| AI 编造矿物学数据 | `entity_type` 必填；非单一矿物不强行套公式、晶系、光学参数 |
| Quick Facts 与 Mineral Data 不一致 | `attr_hardness`/`attr_origin` 必须来自 `mineral_hardness`/`mineral_origins` 的同一来源 |
| ACF Select 写入失败 | REST payload 必须写选项 key（如 `crown`），不要写显示值（如 `Crown`） |
| `none` 与安全风险多选冲突 | `safety_notes = none` 时不得同时选择其他安全项 |
| Elementor 读错数据源 | Elementor 模板只读 ACF 字段渲染；`post_content` 仅作 SEO fallback，不参与前端渲染 |
| Wysiwyg 内含 H2 | Wysiwyg 字段不含模块标题；标题由 Elementor 模板渲染，字段只存正文段落 |

---

## 1. 内容存储分配

页面可渲染内容均以 ACF 字段为主。`post_content` 仅作 SEO fallback，Elementor 模板不读 `post_content`。

### `post_content` fallback 拼接白名单

上传脚本自动拼接以下字段的 HTML 内容写入 `content`，供 SEO 插件分析：

```
intro → meaning_overview → metaphysical_properties → chakra_zodiac_detail
→ how_to_use → cleanse_charge → who_should_use → closing
→ benefits（展开为 HTML 列表） → faqs（展开为 HTML 列表）
```

**不拼入 fallback 的字段**：`quick_answer`、`safety_jewelry_care`、Quick Facts 属性值、矿物数据字段、pairing 描述、Product CTA 字段。

### Tab 分配

| Tab | 模块 | 字段类型 | 字段数 |
|-----|------|---------|--------|
| Basic | 基础信息 | Text / Select | 3 |
| Quick Answer | Module 2 | Text Area | 1 |
| Quick Facts | Module 3 | Text / Select | 9 |
| Mineral Data | Module 5a | Select + Text | 23 |
| Content Modules | Module 1, 4, 5b, 7, 8, 9, 11, 14 | Wysiwyg / Text Area | 8 |
| Benefits | Module 6 | Repeater | 1（含 2 子字段） |
| Safety | Module 9 结构化部分 | Select / Checkbox / Text Area | 5 |
| Pairings | Module 10 | Repeater | 1（含 3 子字段） |
| Product CTA | Module 12 | Select / URL / Text | 3 |
| FAQ | Module 13 | Repeater | 1（含 2 子字段） |
| **合计** | | | **55 顶层字段** |

---

## 2. Tier 必填矩阵

ACF 后台无法按 Tier 做条件必填，字段属性统一标"可选"。实际必填约束通过上传前校验脚本执行。

| 字段 | Tier A | Tier B | Tier C |
|------|--------|--------|--------|
| `gemstone_name` | 必填 | 必填 | 必填 |
| `subtitle` | 必填 | 必填 | 必填 |
| `tier` | 必填 | 必填 | 必填 |
| `intro` | 必填 | 必填 | 必填 |
| `quick_answer` | 必填 | 必填 | 必填 |
| `attr_*`（9 个 Quick Facts） | 必填 | 必填 | 必填 |
| `meaning_overview` | 必填 | 必填 | **可空** |
| `entity_type` | 必填 | 必填 | 必填 |
| `mineral_*` 基础区（12 个） | 必填 | 必填 | 必填 |
| `mineral_*` 专业区（10 个） | 必填 | 可选 | **可空** |
| `metaphysical_properties` | 必填 | 必填 | 必填 |
| `benefits` | 必填 | 必填 | 必填 |
| `chakra_zodiac_detail` | 必填 | 必填 | **可空** |
| `how_to_use` | 必填 | 必填 | 必填 |
| `safety_*`（5 个） | 必填 | 必填 | **可空** |
| `cleanse_charge` | 必填 | 必填 | **可空** |
| `pairings` | 推荐 | 推荐 | **可空** |
| `who_should_use` | 必填 | **可空** | **可空** |
| `product_cta_type` | 推荐必填 | 可选 | 可选 |
| `product_cta_url` | 有 type 则必填 | 有 type 则必填 | 有 type 则必填 |
| `product_cta_text` | 有 type 则必填 | 有 type 则必填 | 有 type 则必填 |
| `faqs` | 必填 | 必填 | 必填 |
| `closing` | 必填 | 必填 | 必填 |

**Product CTA 校验逻辑**：

```
if product_cta_type 非空:
    product_cta_url 必填
    product_cta_text 必填
if Tier A and product_cta_type 为空:
    允许 draft，打 warning（核心水晶应有转化入口）
```

---

## 3. 完整字段清单

### Tab: Basic（基础信息）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 1 | `gemstone_name` | Text | Gemstone Name | 水晶英文名，如 "Amethyst" |
| 2 | `subtitle` | Text | Subtitle | 诗意副标题，如 "The Stone of Peace" |
| 3 | `tier` | Select | Article Tier | 选项见下方 |

**tier 选项：**
```
a : Tier A — 核心水晶，完整14模块（3000-5000词）
b : Tier B — 普通水晶，省略模块11（2000-3000词）
c : Tier C — 长尾水晶，8个必填模块（1200-2000词）
```

---

### Tab: Quick Answer（Module 2）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 4 | `quick_answer` | Text Area | Quick Answer | 40-60词，适合 AI 摘取；不可夸大医疗功效。不进入 fallback 拼接 |

---

### Tab: Quick Facts（Module 3）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 5 | `attr_color` | Text | Main Color | 如 "Purple", "Iridescent, green, blue" |
| 6 | `attr_chakra` | Select | Chakra | 选项见下方 |
| 7 | `attr_zodiac` | Select | Zodiac | 选项见下方 |
| 8 | `attr_element` | Select | Element | 选项见下方 |
| 9 | `attr_hardness` | Text | Hardness | 消费者摘要值，如 "7"；必须与 `mineral_hardness` 同源 |
| 10 | `attr_origin` | Text | Primary Origin | 消费者摘要，如 "Brazil"；必须与 `mineral_origins` 同源 |
| 11 | `attr_intentions` | Text | Intentions | 如 "Calm, Protection, Intuition" |
| 12 | `attr_best_for` | Text | Best For | 如 "Meditation, Sleep, Stress Relief" |
| 13 | `attr_common_forms` | Text | Common Forms | 如 "Tumbled, Raw Cluster, Bracelet, Pendant" |

**Select 选项定义：**

**attr_chakra：**
```
root : Root
sacral : Sacral
solar_plexus : Solar Plexus
heart : Heart
throat : Throat
third_eye : Third Eye
crown : Crown
```

**attr_zodiac：**
```
aries : Aries
taurus : Taurus
gemini : Gemini
cancer : Cancer
leo : Leo
virgo : Virgo
libra : Libra
scorpio : Scorpio
sagittarius : Sagittarius
capricorn : Capricorn
aquarius : Aquarius
pisces : Pisces
```

**attr_element：**
```
earth : Earth
water : Water
fire : Fire
air : Air
```

---

### Tab: Mineral Data（Module 5a）

#### 实体类型（必填）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 14 | `entity_type` | Select | Entity Type | 填写矿物数据前必须先判断 |

**entity_type 选项：**
```
single_mineral : 单一矿物 — 有明确化学式和晶体结构
rock_aggregate : 岩石/集合体/宝石贸易名 — 多矿物混合或商业名称
treated : 处理/染色/人造/复合材料 — 经人工处理
uncertain : 不确定 — 只填可核验字段
```

#### 基础展示区（始终可见）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 15 | `mineral_chemical_formula` | Text | Chemical Formula | 如 "SiO₂", "CaCO₃" |
| 16 | `mineral_category` | Text | Mineral Category | 如 "Silicate", "Carbonate" |
| 17 | `mineral_crystal_system` | Text | Crystal System | 如 "Trigonal", "Hexagonal" |
| 18 | `mineral_origins` | Text | Main Origins | 如 "Australia, New Zealand, Japan" |
| 19 | `mineral_hardness` | Text | Mohs Hardness | 可核验细节值，如 "6.5–7" |
| 20 | `mineral_specific_gravity` | Text | Specific Gravity | 如 "2.85–2.90" |
| 21 | `mineral_tenacity` | Text | Tenacity | 如 "Brittle" |
| 22 | `mineral_cleavage` | Text | Cleavage | 如 "None", "Perfect" |
| 23 | `mineral_fracture` | Text | Fracture | 如 "Uneven", "Conchoidal" |
| 24 | `mineral_main_color` | Text | Main Color | 矿物学视角色，如 "Iridescent, green, blue" |
| 25 | `mineral_luster` | Text | Luster | 如 "Pearly to nacreous", "Vitreous" |
| 26 | `mineral_transparency` | Text | Transparency | 如 "Translucent", "Opaque" |

#### 专业数据区（可折叠 / 默认收起）

> 仅 Tier A 必填。Tier B/C 选填。字段值为 "none" 或无数据时，该行不显示。

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 27 | `mineral_crystal_class` | Text | Crystal Class | 如 "Hexagonal scalenohedral" |
| 28 | `mineral_space_group` | Text | Space Group | 如 "R3̄c" |
| 29 | `mineral_refractive_index` | Text | Refractive Index | 如 "1.53–1.69" |
| 30 | `mineral_birefringence` | Text | Birefringence | 如 "~0.155" |
| 31 | `mineral_pleochroism` | Text | Pleochroism | 如 "None", "Weak" |
| 32 | `mineral_dispersion` | Text | Dispersion | 如 "None", "Weak" |
| 33 | `mineral_2v_angle` | Text | 2V Angle | 如 "None" |
| 34 | `mineral_fluorescence` | Text | Fluorescence | 如 "Weak to moderate pink" |
| 35 | `mineral_absorption_spectrum` | Text | Absorption Spectrum | 如 "None" |
| 36 | `mineral_streak` | Text | Streak | 如 "White" |

**entity_type 对矿物字段的约束：**

| entity_type | 基础区 | 专业区 |
|------------|--------|--------|
| `single_mineral` | 可填全部 | 可填全部 |
| `rock_aggregate` | 只填适用字段，不强行套 | 通常留空 |
| `treated` | 必须标注处理方式 | 通常留空 |
| `uncertain` | 只填可核验字段 | 其余标 "varies" |

---

### Tab: Content Modules（正文模块）

> 每个模块一个独立字段。字段只存正文段落 HTML，不含模块标题（H2/H3 由 Elementor 模板渲染）。图片通过 `<img src="媒体库URL" alt="..." loading="lazy">` 嵌入对应模块 HTML。Tier B/C 跳过的模块对应字段留空，模板不渲染。

| # | Field Name | Field Type | Label | 对应模块 | 规则 |
|---|-----------|-----------|-------|---------|------|
| 37 | `intro` | Text Area | Introduction | Module 1 | 80-120 词，直接回答 meaning，说明适合谁读 |
| 38 | `meaning_overview` | Wysiwyg | Meaning Overview | Module 4 | 文化/灵性象征、历史、产地故事；Tier C 可空 |
| 39 | `metaphysical_properties` | Wysiwyg | Metaphysical Properties | Module 5b | 传统象征和能量属性（如"对应心轮的爱的能量"） |
| 40 | `chakra_zodiac_detail` | Wysiwyg | Chakra & Zodiac Detail | Module 7 | 对应关系和使用边界详述；Tier C 可空 |
| 41 | `how_to_use` | Wysiwyg | How to Use | Module 8 | 佩戴、冥想、家居摆放、睡前/工作场景；包含 bracelet 场景 |
| 42 | `cleanse_charge` | Wysiwyg | Cleanse & Charge | Module 9 | 推荐净化方式、保养提示（补充 Safety 结构化字段）；Tier C 可空 |
| 43 | `who_should_use` | Wysiwyg | Who Should Use | Module 11 | 人群匹配和预期管理；Tier B/C 可空 |
| 44 | `closing` | Text Area | Closing | Module 14 | 50-90 词，总结并引导 |

---

### Tab: Benefits（Module 6）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 45 | `benefits` | Repeater | Benefits | 5-7 项 |

**Sub-fields：**

| Sub-field Name | Type | Label | 规则 |
|---------------|------|-------|------|
| `benefit_title` | Text | Benefit Title | 如 "Calms the Mind" |
| `benefit_description` | Text Area | Description | 日常场景软性收益，40-80 词 |

---

### Tab: Safety（Module 9 结构化部分）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 46 | `safety_water` | Select | Water Tolerance | 选项见下方 |
| 47 | `safety_sunlight` | Select | Sunlight Tolerance | 选项见下方 |
| 48 | `safety_salt` | Select | Salt Tolerance | 选项见下方 |
| 49 | `safety_jewelry_care` | Text Area | Jewelry Care | 手链专用保养说明 |
| 50 | `safety_notes` | Checkbox | Safety Notes | 多选，选项见下方 |

**Select 选项：**

**safety_water：**
```
safe : Safe — 可接触水
avoid : Avoid — 避免接触水
brief_rinse_only : Brief Rinse Only — 仅可快速冲洗
unknown : Unknown — 未知
```

**safety_sunlight：**
```
safe : Safe — 可晒
fades : Fades — 会褪色
avoid_prolonged_exposure : Avoid Prolonged Exposure — 避免长时间暴晒
unknown : Unknown — 未知
```

**safety_salt：**
```
safe : Safe — 可接触盐
avoid : Avoid — 避免接触盐
```

**safety_notes（Checkbox 多选）：**
```
toxic_dust : Toxic Dust — 粉尘有毒
friable : Friable — 易碎
dyed : Dyed — 染色处理
treated : Treated — 人工处理
sharp_edges : Sharp Edges — 边缘锋利
none : None — 无特殊安全注意
```

---

### Tab: Pairings（Module 10）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 51 | `pairings` | Repeater | Crystal Pairings | 3-5 项；Tier C 可空 |

**Sub-fields：**

| Sub-field Name | Type | Label | 规则 |
|---------------|------|-------|------|
| `pairing_crystal_name` | Text | Crystal Name | 如 "Clear Quartz" |
| `pairing_reason` | Text Area | Reason | 组合意图说明，30-60 词 |
| `pairing_link` | URL | Internal Link | 内链目标，如 `/gemstone/clear-quartz-meaning` |

---

### Tab: Product CTA（Module 12）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 52 | `product_cta_type` | Select | CTA Type | 可选；Tier A 推荐必填 |
| 53 | `product_cta_url` | URL | CTA Link | type 非空时必填 |
| 54 | `product_cta_text` | Text | CTA Button Text | type 非空时必填 |

**product_cta_type 选项：**
```
product : WooCommerce 产品页
intention_category : Shop by Intention 分类页
guide_page : Crystal Guide 总览页
```

---

### Tab: FAQ（Module 13）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 55 | `faqs` | Repeater | FAQ | 5-7 项 |

**Sub-fields：**

| Sub-field Name | Type | Label | 规则 |
|---------------|------|-------|------|
| `faq_question` | Text | Question | 如 "Can amethyst go in water?" |
| `faq_answer` | Text Area | Answer | 40-70 词 |

---

## 4. 旧字段迁移口径

旧 FG 保留作数据备份；迁移脚本单独维护。

| 类型 | 处理 | 示例 |
|------|------|------|
| 结构化字段 | 直接迁移到对应 ACF 字段 | `chakra → attr_chakra`、`mohs_hardness → attr_hardness + mineral_hardness` |
| 叙述性字段 | 迁移到对应 ACF 正文模块字段 | `how_to_use → how_to_use`（Wysiwyg）、`historical_uses → meaning_overview` |
| 不适用字段 | 保留旧数据备份，不进入新 FG | Tarot/Feng Shui 专用字段、旧图片链接、内部参考字段 |

迁移后自动生成 `post_content` fallback（按 §1 白名单拼接）。

---

## 5. 数据一致性规则

### Quick Facts ↔ Mineral Data

| Quick Facts 字段 | 对应 Mineral 字段 | 关系 |
|-----------------|-------------------|------|
| `attr_hardness` | `mineral_hardness` | 摘要 vs 详细（如 "7" vs "6.5–7"） |
| `attr_origin` | `mineral_origins` | 主要产地 vs 全部产地 |

### ACF 条件必填

ACF 后台无法按 Tier 做严格条件必填，先用字段说明和上传前校验脚本约束。不要为了后台校验强行拆多个 Field Group。

---

## 6. Elementor 渲染映射

> 详细模板设计在 Step 3 完成。此处只列渲染逻辑概要。

**核心原则**：Elementor 模板负责模块标题（H2/H3），ACF 字段只提供正文内容。模板按字段是否有值决定是否渲染整个区块。

| 渲染区块 | 标题（模板渲染） | 内容来源 |
|---------|----------------|---------|
| Hero | — | `gemstone_name` + `subtitle` + `featured_media` |
| Module 1 导语 | 无标题 | `intro` Text Area |
| Module 2 Quick Answer | 模板渲染 H2 | `quick_answer` Text Area |
| Module 3 Quick Facts | 模板渲染 H2 | `attr_*` Select/Text → 标签网格表格 |
| Module 4 Meaning Overview | 模板渲染 H2 | `meaning_overview` Wysiwyg |
| Module 5a Physical Properties | 模板渲染 H2 | `entity_type` + `mineral_*` → 结构化表格 |
| Module 5b Metaphysical | 模板渲染 H3（在 Properties 下） | `metaphysical_properties` Wysiwyg |
| Module 6 Benefits | 模板渲染 H2 | `benefits` Repeater → 图标卡片列表 |
| Module 7 Chakra/Zodiac | 模板渲染 H2 | `chakra_zodiac_detail` Wysiwyg |
| Module 8 How to Use | 模板渲染 H2 | `how_to_use` Wysiwyg |
| Module 9 Cleanse/Charge | 模板渲染 H2 | `cleanse_charge` Wysiwyg + `safety_*` → 安全标签条 |
| Module 10 Pairings | 模板渲染 H2 | `pairings` Repeater → 文字卡片 + 内链 |
| Module 11 Who Should Use | 模板渲染 H2 | `who_should_use` Wysiwyg |
| Module 12 Product CTA | 模板渲染 H2 | `product_cta_*` → 产品卡片/按钮 |
| Module 13 FAQ | 模板渲染 H2 | `faqs` Repeater → 手风琴 + FAQ Schema |
| Module 14 Closing | 无标题 | `closing` Text Area |

---

## 7. REST API 最小 Payload

```json
{
  "title": "{Crystal} Meaning: Healing Properties & Uses",
  "slug": "{crystal-slug}-meaning",
  "status": "draft",
  "content": "{SEO fallback: 上传脚本按白名单自动拼接}",
  "excerpt": "{140-160 character summary}",
  "featured_media": 12345,
  "acf": {
    "gemstone_name": "Amethyst",
    "subtitle": "The Stone of Peace",
    "tier": "a",
    "intro": "...",
    "quick_answer": "...",
    "attr_color": "...", "attr_chakra": "...", "...": "...",
    "meaning_overview": "<p>...</p>",
    "entity_type": "single_mineral",
    "mineral_chemical_formula": "...", "...": "...",
    "metaphysical_properties": "<p>...</p>",
    "benefits": [{"benefit_title": "...", "benefit_description": "..."}],
    "chakra_zodiac_detail": "<p>...</p>",
    "how_to_use": "<p>...</p>",
    "safety_water": "safe", "safety_sunlight": "fades", "...": "...",
    "cleanse_charge": "<p>...</p>",
    "pairings": [{"pairing_crystal_name": "...", "pairing_reason": "...", "pairing_link": "..."}],
    "who_should_use": "<p>...</p>",
    "product_cta_type": "product", "product_cta_url": "...", "product_cta_text": "...",
    "faqs": [{"faq_question": "...", "faq_answer": "..."}],
    "closing": "..."
  }
}
```

> ACF Repeater 字段（`benefits`、`pairings`、`faqs`）格式为对象数组。所有 ACF 字段必须在 FG 中开启 "Show in REST API"。Select 字段写 key（如 `crown`）不写显示值（如 `Crown`）。
