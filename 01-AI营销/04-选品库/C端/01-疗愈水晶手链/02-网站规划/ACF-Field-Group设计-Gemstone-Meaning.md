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
| 全 ACF | 页面可见内容均以 ACF 字段为主；不同 Tier 允许部分模块字段为空，前端模板按字段是否有值决定是否显示该区块 |
| 标题归模板 | 模块标题（H2/H3）是模板固定文本，不存 ACF 字段；ACF Wysiwyg 字段只存正文段落 HTML，不含模块标题 |
| 命名规范 | 全部 snake_case，前缀分组：`attr_`（Quick Facts）、`mineral_`（矿物数据）、`safety_`（安全）、`product_cta_`（CTA）；图片字段用后缀 `_image`（如 `overview_image`）；正文模块无前缀 |
| 文档边界 | 本文件只定义 ACF 字段协议；文章结构和写作规则以内容框架文档为准 |

### 当前技术路线

- CPT：`gemstone`
- ACF Field Group：`Gemstone Meaning`
- 展示层：Elementor Single Template 通过 ACF Dynamic Tag 绑定字段值
- 上传方式：`POST /wp-json/wp/v2/gemstone`，通过 `acf` 键写入所有字段

### 图片规则

每个含配图的模块使用**独立 ACF Image 字段**，图片与正文分离。前端每个模块的显示顺序固定：**标题 → 配图 → 正文**。

| 规则 | 说明 |
|------|------|
| 图片字段存媒体 ID | ACF Image 字段存储 WordPress 媒体库 ID，上传脚本先上传图片拿到 ID，再填入对应字段 |
| WordPress 自动 srcset | ACF Image 字段由 WordPress 自动生成 srcset/sizes，无需手动处理响应式 |
| 正文不含 `<img>` | Wysiwyg / Text Area 字段只存纯文本段落，不嵌入任何 `<img>` 标签 |
| Featured image | 使用 WordPress 原生 `featured_media` 字段（非 ACF） |
| 空图片 = 不显示 | Image 字段为空时，前端跳过图片区域，只显示正文 |

**图片字段清单（5 个独立字段 + 1 个 WP 原生）：**

| 字段名 | 类型 | 对应模块 | 必需 | 尺寸 |
|--------|------|---------|------|------|
| `featured_media`（WP 原生） | Image | Hero 区 | ✅ | 1600×900 |
| `overview_image` | Image | Module 4: Meaning Overview | ✅ | 1200×900 |
| `properties_image` | Image | Module 5: Properties | ✅ | 1200×900 |
| `benefits_image` | Image | Module 6: Benefits | 推荐 | 1200×900 |
| `how_to_use_image` | Image | Module 8: How to Use | ✅ | 1200×900 |
| `pairings_image` | Image | Module 10: Pairings | 可选 | 1200×900 |

### 容易崩掉的边界

| 风险 | 处理方式 |
|------|----------|
| 字段过多导致批量生产变慢 | Tier A/B/C 控制必填字段；专业矿物数据只对 Tier A 强制 |
| AI 编造矿物学数据 | `entity_type` 必填；非单一矿物不强行套公式、晶系、光学参数 |
| Quick Facts 与 Mineral Data 不一致 | `attr_hardness`/`attr_origin` 必须来自 `mineral_hardness`/`mineral_origins` 的同一来源 |
| ACF Select 写入失败 | REST payload 必须写选项 key（如 `crown`），不要写显示值（如 `Crown`） |
| `none` 与安全风险多选冲突 | `safety_notes = none` 时不得同时选择其他安全项 |
| Elementor 读错数据源 | 前端模板只读 ACF 字段；`post_content` 留空，不参与前端显示 |
| Wysiwyg 内含 H2 | Wysiwyg 字段不含模块标题；模块标题是模板固定文本，不从 ACF 读取 |
| Wysiwyg 内含 `<img>` | Wysiwyg 字段不含图片；图片由独立 Image 字段管理，上传脚本校验正文不得含 `<img>` |
| 图片上传顺序错 | 必须先上传所有图片到 `/wp-json/wp/v2/media` 拿到 media ID，再填入 ACF Image 字段，最后创建 gemstone 条目 |

---

## 1. 内容存储说明

页面可见内容全部存在 ACF 字段中。`post_content` 留空，SEO 元数据（title、description、focus keyword）通过 Rank Math REST API 字段直接写入，不需要 post_content 作为中间层。

### Tab 分配

| Tab | 模块 | 字段类型 | 字段数 |
|-----|------|---------|--------|
| Basic | 基础信息 | Text / Select | 3 |
| Quick Answer | Module 2 | Text Area | 1 |
| Quick Facts | Module 3 | Text / Select | 9 |
| Mineral Data | Module 5a | Select + Text | 23 |
| Content Modules | Module 1, 4, 5b, 7, 8, 9, 11, 14 | Wysiwyg / Text Area | 8 |
| Images | 模块配图 | Image | 5 |
| Benefits | Module 6 | Repeater | 1（含 2 子字段） |
| Safety | Module 9 结构化部分 | Select / Checkbox / Text Area | 5 |
| Pairings | Module 10 | Repeater | 1（含 3 子字段） |
| Product CTA | Module 12 | Select / URL / Text | 3 |
| FAQ | Module 13 | Repeater | 1（含 2 子字段） |
| **合计** | | | **60 顶层字段**（55 + 5 Image） |

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
| `overview_image` | 必填 | 必填 | **可空** |
| `properties_image` | 必填 | 必填 | 推荐 |
| `benefits_image` | 推荐 | 推荐 | **可空** |
| `how_to_use_image` | 必填 | 必填 | 推荐 |
| `pairings_image` | 可选 | 可选 | **可空** |

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
| 4 | `quick_answer` | Text Area | Quick Answer | 40-60词，适合 AI 摘取；不可夸大医疗功效 |

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

> 每个模块一个独立字段。字段只存正文段落 HTML，不含模块标题（H2/H3 是模板固定文本），不含 `<img>` 标签（图片由独立 Image 字段管理）。Tier B/C 跳过的模块对应字段留空，前端不显示该区块。

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

### Tab: Images（模块配图）

> 每个字段存储 WordPress 媒体库 ID。上传脚本先上传图片到 `/wp-json/wp/v2/media` 获取 ID，再填入对应字段。前端通过 ACF Dynamic Tag 绑定 Image 字段，WordPress 自动生成 srcset/sizes。

| # | Field Name | Field Type | Label | 对应模块 | 规则 |
|---|-----------|-----------|-------|---------|------|
| 45 | `overview_image` | Image | Overview Image | Module 4: Meaning Overview | 1200×900；Tier C 可空；返回格式选 "Image ID" |
| 46 | `properties_image` | Image | Properties Image | Module 5: Properties | 1200×900；Tier C 可空；返回格式选 "Image ID" |
| 47 | `benefits_image` | Image | Benefits Image | Module 6: Benefits | 1200×900；Tier C 可空；返回格式选 "Image ID" |
| 48 | `how_to_use_image` | Image | How to Use Image | Module 8: How to Use | 1200×900；Tier C 可空；返回格式选 "Image ID" |
| 49 | `pairings_image` | Image | Pairings Image | Module 10: Pairings | 1200×900；可选；返回格式选 "Image ID" |

> **ACF Image 字段设置**：Return Format 选 "Image ID"（非 URL/Array）；Preview Size 选 "medium"；Library 选 "All"。

---

### Tab: Benefits（Module 6）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 50 | `benefits` | Repeater | Benefits | 5-7 项 |

**Sub-fields：**

| Sub-field Name | Type | Label | 规则 |
|---------------|------|-------|------|
| `benefit_title` | Text | Benefit Title | 如 "Calms the Mind" |
| `benefit_description` | Text Area | Description | 日常场景软性收益，40-80 词 |

---

### Tab: Safety（Module 9 结构化部分）

| # | Field Name | Field Type | Label | 规则 |
|---|-----------|-----------|-------|------|
| 51 | `safety_water` | Select | Water Tolerance | 选项见下方 |
| 52 | `safety_sunlight` | Select | Sunlight Tolerance | 选项见下方 |
| 53 | `safety_salt` | Select | Salt Tolerance | 选项见下方 |
| 54 | `safety_jewelry_care` | Text Area | Jewelry Care | 手链专用保养说明 |
| 55 | `safety_notes` | Checkbox | Safety Notes | 多选，选项见下方 |

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
| 56 | `pairings` | Repeater | Crystal Pairings | 3-5 项；Tier C 可空 |

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
| 57 | `product_cta_type` | Select | CTA Type | 可选；Tier A 推荐必填 |
| 58 | `product_cta_url` | URL | CTA Link | type 非空时必填 |
| 59 | `product_cta_text` | Text | CTA Button Text | type 非空时必填 |

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
| 60 | `faqs` | Repeater | FAQ | 5-7 项 |

**Sub-fields：**

| Sub-field Name | Type | Label | 规则 |
|---------------|------|-------|------|
| `faq_question` | Text | Question | 如 "Can amethyst go in water?" |
| `faq_answer` | Text Area | Answer | 40-70 词 |

---

## 4. 旧字段迁移口径

旧 FG 保留作数据备份；迁移脚本单独维护。

### 4.1 图片字段映射

| 旧字段名 | 新字段名 | 说明 |
|----------|---------|------|
| `banner_link2` | `featured_media`（WP 原生） | Banner → Hero Featured Image |
| `image_link1` | `overview_image` | 概览图 → Meaning Overview 配图 |
| `energy_&_healing_image_link4` | `properties_image` | 能量图 → Properties 配图 |
| `benefits_image_link3` | `benefits_image` | Benefits 配图 |
| `application_image_link5` | `how_to_use_image` | 应用图 → How to Use 配图 |
| `benefits_image_link6` | **丢弃** | 冗余，旧版有两个 Benefits 图 |

### 4.2 结构化字段映射

| 旧字段名 | 新字段名 | 转换说明 |
|----------|---------|---------|
| `chakra` | `attr_chakra` | Text → Select key（如 "Root" → "root"） |
| `zodiac` | `attr_zodiac` | Text → Select key（如 "Cancer" → "cancer"） |
| `element` | `attr_element` | Text → Select key（如 "Water" → "water"） |
| `mohs_hardness` | `attr_hardness` + `mineral_hardness` | 消费者摘要 → attr，详细值 → mineral |
| `main_origins` | `attr_origin` + `mineral_origins` | 主要产地 → attr，全部产地 → mineral |
| `energy_colors` | `attr_color` | 颜色值迁移 |
| —（新增） | `entity_type` | 根据矿物数据判断，Abalone = `rock_aggregate` |
| —（新增） | `tier` | 迁移时统一设为 `b`，后续按需调整 |
| —（新增） | `subtitle` | 旧版无此字段，迁移时由脚本根据水晶名生成 |
| —（新增） | `intro` | 旧版无独立导语，从 `what_is` 前 120 词提取 |

### 4.3 叙述性字段映射

| 旧字段名 | 新字段名 | 说明 |
|----------|---------|------|
| `what_is` | `intro`（部分）+ `meaning_overview` | 拆分：前段作导语，剩余作 Meaning Overview |
| `type_of` | `meaning_overview`（追加） | 品种差异补充到文化背景中 |
| `cultural_&_structural_notes` | `meaning_overview`（追加） | 文化结构说明 |
| `Primary_Energy_Benefits` | `metaphysical_properties` | 能量属性 → 形而上学属性 |
| `Suitable_Use_Contexts` | `how_to_use` | 使用场景 |
| `how_to_use` | `how_to_use`（合并） | 与上面合并 |
| `cleansing_and_charging` | `cleanse_charge` | 净化充电 |
| `maintenance_tips` | `safety_jewelry_care` | 保养 → 安全模块 |
| `safety_notes` | `safety_notes`（转换格式） | Text → Checkbox 多选，需解析文本映射到选项 |
| `historical_uses` | `meaning_overview`（追加） | 历史用途补充到文化背景 |
| `related_myths_` | `meaning_overview`（追加） | 神话传说补充到文化背景 |
| `famous_origins_&_mine_stories` | `meaning_overview`（追加） | 产地故事补充到文化背景 |
| `connections_with_religiondeities` | `meaning_overview`（追加） | 宗教联系补充 |
| `modern_influence` | `meaning_overview`（追加） | 现代影响补充 |

### 4.4 FAQ 字段映射

| 旧字段名 | 新字段名 | 说明 |
|----------|---------|------|
| `faq-wearing_taboos_and_safety_precautions` | `faqs` Repeater 第 1 项 | 扁平字段 → Repeater |
| `faq-what_is_the_easiest_maintenance` | `faqs` Repeater 第 2 项 | 扁平字段 → Repeater |
| `can_be_put_in_water_sunlight` | `faqs` Repeater 第 3 项 + `safety_water`/`safety_sunlight` | 同时写入 FAQ 和安全字段 |
| `faq-how_to_avoid_buying_fake` | `faqs` Repeater 第 4 项 | 扁平字段 → Repeater |
| `faq-how_to_tell_` | `faqs` Repeater 第 5 项 | 扁平字段 → Repeater |

### 4.5 矿物数据字段映射

| 旧字段名 | 新字段名 | 变化 |
|----------|---------|------|
| `chemical_formula` | `mineral_chemical_formula` | 加前缀 |
| `mineral_category` | `mineral_category` | 不变 |
| `crystal_system` | `mineral_crystal_system` | 加前缀 |
| `crystal_class` | `mineral_crystal_class` | 加前缀 |
| `space_group` | `mineral_space_group` | 加前缀 |
| `main_color` | `mineral_main_color` | 加前缀 |
| `streak` | `mineral_streak` | 加前缀 |
| `luster` | `mineral_luster` | 加前缀 |
| `transparency` | `mineral_transparency` | 加前缀 |
| `refractive_index` | `mineral_refractive_index` | 加前缀 |
| `birefringence` | `mineral_birefringence` | 加前缀 |
| `pleochroism` | `mineral_pleochroism` | 加前缀 |
| `dispersion` | `mineral_dispersion` | 加前缀 |
| `2v_angle` | `mineral_2v_angle` | 加前缀 |
| `fluorescence` | `mineral_fluorescence` | 加前缀 |
| `absorption_spectrum` | `mineral_absorption_spectrum` | 加前缀 |
| `specific_gravity__density` | `mineral_specific_gravity` | 简化命名 |
| `tenacity` | `mineral_tenacity` | 加前缀 |
| `cleavage_` | `mineral_cleavage` | 加前缀，去尾部下划线 |
| `fracture` | `mineral_fracture` | 加前缀 |

### 4.6 不迁移的字段（保留旧数据备份）

| 旧字段名 | 原因 |
|----------|------|
| `slug` | 旧版冗余（WordPress 原生 slug 已管理） |
| `core_value` | 合并到 `subtitle` 或 `intro` |
| `key_buying_points` | 商业字段，不在文章框架中 |
| `chinese_zodiac` | 不在新 FG 范围内 |
| `planet` | 不在新 FG 范围内 |
| `Purpose_&_Symbolism` ~ `principle_&_expected_outcome`（12 个） | Tarot/Feng Shui 专用，不适用于 Crystal Meaning 页面 |
| `main_referenceswebsites` | 参考资料不在前端页面显示范围内 |
| `word_audio` | 音频文件，不在新 FG 范围内 |

迁移后 `post_content` 留空，SEO 元数据直接写入 Rank Math 字段。

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

## 6. 字段与前端位置对照

> 本表说明每个 ACF 字段对应前端页面的哪个区块。模板实现细节（如何绑定、如何条件显示）由 Elementor 模板设计文档定义。

| 页面区块 | 说明 | 用到的 ACF 字段 |
|---------|------|----------------|
| Hero | 水晶名 + 副标题 + 封面图 | `gemstone_name` + `subtitle` + `featured_media`（WP 原生） |
| Module 1 导语 | 无标题，直接正文 | `intro` |
| Module 2 Quick Answer | 有 H2 标题 | `quick_answer` |
| Module 3 Quick Facts | 有 H2 标题，属性标签网格 | `attr_*`（9 个） |
| Module 4 Meaning Overview | 有 H2 标题 + 配图 | `overview_image` + `meaning_overview` |
| Module 5a Physical Properties | 有 H2 标题 + 配图，结构化矿物表格 | `properties_image` + `entity_type` + `mineral_*` |
| Module 5b Metaphysical | H3（在 Properties 区块内） | `metaphysical_properties` |
| Module 6 Benefits | 有 H2 标题 + 配图，图标卡片列表 | `benefits_image` + `benefits`（Repeater） |
| Module 7 Chakra/Zodiac | 有 H2 标题 | `chakra_zodiac_detail` |
| Module 8 How to Use | 有 H2 标题 + 配图 | `how_to_use_image` + `how_to_use` |
| Module 9 Cleanse/Charge | 有 H2 标题 | `cleanse_charge` + `safety_*`（5 个） |
| Module 10 Pairings | 有 H2 标题 + 配图（可选），文字卡片 + 内链 | `pairings_image` + `pairings`（Repeater） |
| Module 11 Who Should Use | 有 H2 标题 | `who_should_use` |
| Module 12 Product CTA | 有 H2 标题，产品卡片/按钮 | `product_cta_type` + `product_cta_url` + `product_cta_text` |
| Module 13 FAQ | 有 H2 标题，手风琴 + FAQ Schema | `faqs`（Repeater） |
| Module 14 Closing | 无标题，直接正文 | `closing` |

---

## 7. REST API 最小 Payload

### 7.1 上传顺序（严格执行）

```
Step 1: 上传图片 → POST /wp-json/wp/v2/media（每张图片一次请求）→ 获得 media IDs
Step 2: 创建草稿 → POST /wp-json/wp/v2/gemstone → 写入 title/slug/excerpt/featured_media + acf 全部字段
```

### 7.2 Payload 示例

```json
{
  "title": "{Crystal} Meaning: Healing Properties & Uses",
  "slug": "{crystal-slug}-meaning",
  "status": "draft",
  "content": "",
  "excerpt": "{140-160 character summary}",
  "featured_media": 12345,
  "acf": {
    "gemstone_name": "Amethyst",
    "subtitle": "The Stone of Peace",
    "tier": "a",
    "intro": "...",
    "quick_answer": "...",
    "attr_color": "...", "attr_chakra": "...", "...": "...",
    "overview_image": 23456,
    "meaning_overview": "<p>...</p>",
    "entity_type": "single_mineral",
    "mineral_chemical_formula": "...", "...": "...",
    "properties_image": 23457,
    "metaphysical_properties": "<p>...</p>",
    "benefits_image": 23458,
    "benefits": [{"benefit_title": "...", "benefit_description": "..."}],
    "chakra_zodiac_detail": "<p>...</p>",
    "how_to_use_image": 23459,
    "how_to_use": "<p>...</p>",
    "safety_water": "safe", "safety_sunlight": "fades", "...": "...",
    "cleanse_charge": "<p>...</p>",
    "pairings_image": 23460,
    "pairings": [{"pairing_crystal_name": "...", "pairing_reason": "...", "pairing_link": "..."}],
    "who_should_use": "<p>...</p>",
    "product_cta_type": "product", "product_cta_url": "...", "product_cta_text": "...",
    "faqs": [{"faq_question": "...", "faq_answer": "..."}],
    "closing": "..."
  }
}
```

> **Image 字段值为整数**（媒体 ID），非 URL 或数组。ACF Repeater 字段（`benefits`、`pairings`、`faqs`）格式为对象数组。所有 ACF 字段必须在 FG 中开启 "Show in REST API"。Select 字段写 key（如 `crown`）不写显示值（如 `Crown`）。

---

## 8. 上传管线：JSON 输入格式

> 每个水晶一个 JSON 文件，上传脚本读取后自动执行：校验 → 上传图片 → 构建 payload → 创建草稿。
> JSON 中图片用本地文件路径（或 URL），脚本负责上传到 WordPress 媒体库并替换为 media ID。

### 8.1 JSON 文件结构

```json
{
  "meta": {
    "gemstone_name": "Amethyst",
    "subtitle": "The Stone of Peace",
    "tier": "a",
    "slug": "amethyst-meaning",
    "title": "Amethyst Meaning: Healing Properties & Uses",
    "excerpt": "Discover the meaning, healing properties, and uses of amethyst..."
  },
  "images": {
    "featured": {
      "file": "images/amethyst-hero.jpg",
      "alt": "Amethyst crystal meaning guide with purple gemstone cluster"
    },
    "overview": {
      "file": "images/amethyst-overview.jpg",
      "alt": "Amethyst color and texture close-up for crystal properties"
    },
    "properties": {
      "file": "images/amethyst-properties.jpg",
      "alt": "Amethyst mineral structure and crystal formation"
    },
    "benefits": {
      "file": "images/amethyst-benefits.jpg",
      "alt": "Amethyst bracelet benefits for meditation and calm"
    },
    "how_to_use": {
      "file": "images/amethyst-usage.jpg",
      "alt": "Amethyst bracelet used for meditation and daily intention setting"
    },
    "pairings": {
      "file": null,
      "alt": null
    }
  },
  "content": {
    "intro": "Amethyst is one of the most beloved crystals...",
    "quick_answer": "Amethyst is a purple variety of quartz...",
    "meaning_overview": "<p>For thousands of years, amethyst has been...</p>",
    "metaphysical_properties": "<p>In crystal healing traditions...</p>",
    "chakra_zodiac_detail": "<p>Amethyst is most commonly associated with...</p>",
    "how_to_use": "<p>There are many ways to incorporate amethyst into your daily life...</p>",
    "cleanse_charge": "<p>To keep your amethyst energetically vibrant...</p>",
    "who_should_use": "<p>Amethyst is an excellent choice for anyone seeking...</p>",
    "closing": "Whether you're drawn to amethyst for its beauty..."
  },
  "attributes": {
    "attr_color": "Purple",
    "attr_chakra": "crown",
    "attr_zodiac": "pisces",
    "attr_element": "water",
    "attr_hardness": "7",
    "attr_origin": "Brazil",
    "attr_intentions": "Calm, Protection, Intuition",
    "attr_best_for": "Meditation, Sleep, Stress Relief",
    "attr_common_forms": "Tumbled, Raw Cluster, Bracelet, Pendant"
  },
  "mineral": {
    "entity_type": "single_mineral",
    "mineral_chemical_formula": "SiO₂",
    "mineral_category": "Silicate",
    "mineral_crystal_system": "Trigonal",
    "mineral_origins": "Brazil, Uruguay, Zambia, Mexico",
    "mineral_hardness": "6.5–7",
    "mineral_specific_gravity": "2.65",
    "mineral_tenacity": "Brittle",
    "mineral_cleavage": "None",
    "mineral_fracture": "Conchoidal",
    "mineral_main_color": "Purple, lavender, violet",
    "mineral_luster": "Vitreous",
    "mineral_transparency": "Transparent to translucent",
    "mineral_crystal_class": "Hexagonal scalenohedral",
    "mineral_space_group": "R3̄c",
    "mineral_refractive_index": "1.544–1.553",
    "mineral_birefringence": "0.009",
    "mineral_pleochroism": "Weak",
    "mineral_dispersion": "0.013",
    "mineral_2v_angle": "~37°",
    "mineral_fluorescence": "Weak bluish",
    "mineral_absorption_spectrum": "None diagnostic",
    "mineral_streak": "White"
  },
  "benefits": [
    {
      "benefit_title": "Calms the Mind",
      "benefit_description": "Many people find that holding or wearing amethyst during stressful moments helps quiet racing thoughts and promotes a sense of inner calm."
    }
  ],
  "safety": {
    "safety_water": "safe",
    "safety_sunlight": "fades",
    "safety_salt": "avoid",
    "safety_jewelry_care": "Remove before swimming or showering. Store away from direct sunlight to prevent color fading.",
    "safety_notes": ["none"]
  },
  "pairings": [
    {
      "pairing_crystal_name": "Rose Quartz",
      "pairing_reason": "Amethyst and Rose Quartz together create a gentle, heart-centered energy ideal for self-love practices.",
      "pairing_link": "/gemstone/rose-quartz-meaning"
    }
  ],
  "product_cta": {
    "product_cta_type": "product",
    "product_cta_url": "/product/amethyst-bracelet",
    "product_cta_text": "Shop Amethyst Bracelet"
  },
  "faqs": [
    {
      "faq_question": "Can amethyst go in water?",
      "faq_answer": "Yes, amethyst is safe to briefly rinse under running water. Avoid prolonged soaking, as it may cause minor clouding over time."
    }
  ]
}
```

### 8.2 上传脚本处理流程

```python
# 伪代码，展示核心逻辑

def upload_gemstone(json_path):
    data = load_json(json_path)

    # Step 1: Tier 必填校验
    validate_tier_fields(data)  # 按 §2 必填矩阵检查

    # Step 2: 上传图片 → 拿到 media IDs
    media_ids = {}
    for key, img in data["images"].items():
        if img["file"]:
            media_id = upload_to_wp_media(img["file"], img["alt"])
            media_ids[key] = media_id

    # Step 3: 构建 ACF payload
    acf = {}
    acf.update(data["meta"])           # gemstone_name, subtitle, tier
    acf.update(data["content"])        # 正文模块
    acf.update(data["attributes"])     # Quick Facts
    acf.update(data["mineral"])        # 矿物数据
    acf.update(data["safety"])         # 安全字段
    acf["benefits"] = data["benefits"]
    acf["pairings"] = data["pairings"]
    acf["faqs"] = data["faqs"]
    acf.update(data["product_cta"])    # CTA

    # 图片字段：映射 images key → ACF Image 字段名
    image_map = {
        "overview": "overview_image",
        "properties": "properties_image",
        "benefits": "benefits_image",
        "how_to_use": "how_to_use_image",
        "pairings": "pairings_image"
    }
    for key, field_name in image_map.items():
        if key in media_ids:
            acf[field_name] = media_ids[key]

    # Step 4: 创建草稿
    payload = {
        "title": data["meta"]["title"],
        "slug": data["meta"]["slug"],
        "status": "draft",
        "content": "",
        "excerpt": data["meta"]["excerpt"],
        "featured_media": media_ids.get("featured"),
        "acf": acf
    }
    result = post_to_wp("/wp-json/wp/v2/gemstone", payload)

    # Step 5: 校验返回
    verify_upload(result, data)
```

### 8.3 JSON 字段 → ACF 字段映射

| JSON 路径 | ACF 字段名 | 类型 |
|-----------|-----------|------|
| `meta.gemstone_name` | `gemstone_name` | Text |
| `meta.subtitle` | `subtitle` | Text |
| `meta.tier` | `tier` | Select |
| `images.featured` | `featured_media`（WP 原生） | — |
| `images.overview` | `overview_image` | Image |
| `images.properties` | `properties_image` | Image |
| `images.benefits` | `benefits_image` | Image |
| `images.how_to_use` | `how_to_use_image` | Image |
| `images.pairings` | `pairings_image` | Image |
| `content.*` | 同名字段 | Wysiwyg / Text Area |
| `attributes.*` | 同名字段 | Text / Select |
| `mineral.*` | 同名字段 | Text / Select |
| `benefits[]` | `benefits` | Repeater |
| `safety.*` | 同名字段 | Select / Checkbox / Text Area |
| `pairings[]` | `pairings` | Repeater |
| `product_cta.*` | 同名字段 | Select / URL / Text |
| `faqs[]` | `faqs` | Repeater |
