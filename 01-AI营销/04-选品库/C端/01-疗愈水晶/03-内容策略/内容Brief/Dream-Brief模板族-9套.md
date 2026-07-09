# Dream Brief 模板族（9 套 → 4 独立结构 + 5 变体）

> **日期**：2026-07-09
> **定位**：供用户审核的 Brief 模板骨架，审核确定后 AI 批量全量生产（memory `no-phase-ai-parallel-production`）
> **URL 口径**：B 方案 post 根级（/{symbol}-dream-meaning/ 等，非 CPT 非 /dream-dictionary/）
> **三层标配**：每篇 = 心理学解读 + 灵性/宗教解读 + 水晶对应推荐（→ Shop 闭环）
> **数据层字段**：用 `{占位符}` 引用 dreams-knowledge.json（与数据层 schema 对齐）

---

## §0 总则

### 三层标配（每篇 dream 内容必含）
1. **心理学解读**：荣格原型 + 弗洛伊德视角（对标 dreamdictionary/dreammoods 强项）
2. **灵性/宗教解读**：Islamic（⭐ 头部薄覆盖 + 系统承接缺口）/ Biblical / Spiritual（三 lens，偏 Islamic）
3. **水晶对应推荐**：每篇 1-3 颗水晶（→ /product-category/{stone}-crystals/ Shop 三级降级验证 200）

### DREAM 检查（每篇 Brief 锁定时过）
| 维度 | 检查 |
|---|---|
| **D 需求** | H2 说"为什么需要"（梦到 X 是什么意思）|
| **R 理由** | 给出"为什么这么解读"（心理学/灵性依据）|
| **E 证据** | 数据/经典引述支撑（Jung/Freud/古兰经/圣经 + 水晶矿物学）|
| **A 优势** | 具体差异化（Islamic 头部薄覆盖 + 系统承接缺口 + 水晶闭环 = 21 家 0 家具备）|
| **M 动机** | "现在行动"理由（Shop 对应水晶 → 加购）|

### 图片标配（每篇 3-5 张）
- **hero 图**：梦象可视化 + 水晶 graphic（1536×864，moleapi gpt-image-2，对标 angel-numues-hero-visual-style）
- **场景图**：梦象场景渲染（snake/water/teeth 等具体梦象）
- **水晶推荐卡**：对应水晶实物/佩戴（复用 390 库已有图 / 新生成搭配）
- ⚠️ 暴力/负面梦象（blood/shot/death）prompt 需抽象化（避 OpenAI 过滤）

### Schema 标配
- `Article` + `FAQPage` + `BreadcrumbList`（禁 `Product` 前端渲染）

### 内链标配（引用 2A §四）
Dreams Hub + 二级 category + Crystal Meaning（/gemstone/{slug}-meaning/）+ 相关梦象 + Lens 子页 + AI 工具 + 跨垂直（塔罗/星座）

---

## 套 1：Subject 梦象主词典页（主力模板）

> **URL**：`/{symbol}-dream-meaning/`（如 /snake-dream-meaning/ / /teeth-falling-out-dream-meaning/）
> **对标**：塔罗牌义页（模板-Tarot-牌义页框架）
> **字数**：3,000-5,000

### H2/H3 大纲

| 模块 | H2/H3 | 数据层字段 |
|---|---|---|
| **TL;DR** | H2: {Symbol} Dream Meaning: Quick Answer | `{symbol_meaning}` |
| **梦象描述** | H2: What Does Dreaming About {Symbol} Mean? | `{common_interpretation}` |
| **心理学解读** | H2: The Psychology Behind {Symbol} Dreams | `{psychology_meaning}` |
| ↳ 荣格原型 | H3: Jungian Perspective | `{jung_archetype}` |
| ↳ 弗洛伊德 | H3: Freudian Interpretation | `{freud_angle}` |
| **灵性/宗教解读** | H2: Spiritual & Religious Meanings | |
| ↳ Islamic ⭐ | H3: Islamic Dream Interpretation | `{spiritual_islamic}` |
| ↳ Biblical | H3: Biblical Meaning | `{spiritual_biblical}` |
| ↳ Spiritual | H3: Spiritual Significance | `{spiritual}` |
| **水晶对应** | H2: Crystals for {Symbol} Dreams | `{crystal_recommendations}` |
| ↳ 推荐 1-3 颗 | H3: {Crystal Name} — {Reason} | |
| ↳ Shop CTA | Casper 三段式卡片 | `{crystal_shop_url}` |
| **常见变体** | H2: Common Variations of {Symbol} Dreams | `{variations}` |
| **FAQ** | H2: Frequently Asked Questions | `{faq}` |
| **内链区** | 相关梦象 + Lens 子页 + AI 工具 + 跨垂直 | `{internal_links}` |

### FAQ 结构（5-10 问）
- "What does it mean when you dream about {symbol}?"（头部 PAA）
- "Is dreaming about {symbol} good or bad?"
- "What does {symbol} symbolize in dreams spiritually?"
- "What does Islam/Bible say about {symbol} in dreams?"（Islamic/Biblical 双宗教）
- "Which crystals help with {symbol} dreams?"（水晶交叉）
- Fan-out 三步法补 3-5 问（关键词扇出→竞手差距→PAA）

### 图片（3-5 张）
| 图片 | Prompt 模板 | 尺寸 |
|---|---|---|
| hero | "{symbol} dream meaning, {symbol} emerging from misty dreamscape with glowing {crystal} crystal, ethereal spiritual atmosphere, soft purple and blue tones, no text, 1536x864" | 1536×864 |
| 场景 | "{symbol} in a dream scene, surreal atmosphere, sleeping figure with {symbol} imagery, psychological symbolism" | 1536×864 |
| 水晶卡 | 复用 390 库 {crystal} 已有图 / 新生成 "{crystal} crystal beside dream journal, soft morning light" | 1024×1024 |

### 水晶 CTA（Casper 三段式）
```
解梦：{symbol} 梦代表 {meaning}
→ 梦境能量：{symbol} 的能量中心在 {chakra} 轮
→ 对应水晶：{crystal}（{crystal_reason}）
→ Shop: /product-category/{crystal}-crystals/（验证 200，否则降级）
```

### 数据层字段引用
`{symbol_meaning}` / `{common_interpretation}` / `{psychology_meaning}` / `{jung_archetype}` / `{freud_angle}` / `{spiritual_islamic}` / `{spiritual_biblical}` / `{spiritual}` / `{crystal_recommendations}` / `{variations}` / `{faq}` / `{internal_links}` / `{crystal_shop_url}`（全量映射见 [Dream数据层与图片策略 §5.4](../Dream数据层与图片策略.md)）

---

## 套 2：Lens 灵性/宗教页（Islamic/Biblical/Spiritual 共用）

> **URL**：`/{symbol}-dream-{lens}-meaning/`（如 /snake-dream-islamic-meaning/）
> **对标**：塔罗场景页
> **字数**：2,000-3,000
> **⭐ Islamic 优先**（7 家已验证竞品头部薄覆盖 + 系统承接缺口 = 真正差异化）

### H2/H3 大纲

| 模块 | H2/H3 | 数据层字段 |
|---|---|---|
| **TL;DR** | H2: {Symbol} Dream Meaning in {Lens} Tradition | `{spiritual_{lens}}` |
| **宗教背景** | H2: {Lens} Perspective on Dreams | `{religious_background}` |
| **经典出处** | H2: Classical {Lens} Sources and Symbolic Context | `{religious_scripture}` |
| **象征义** | H2: Symbolic Meaning of {Symbol} | `{lens_symbolism}` |
| **水晶对应** | H2: Crystals for Reflection After {Lens} {Symbol} Dreams | `{religious_crystal}` |
| ↳ 水晶搭配声明 | crystal pairing inspired by the dream theme, not a religious prescription | |
| **回链父 Subject** | H2: Learn More → [父页链接](/{symbol}-dream-meaning/) | `{parent_subject_url}` |
| **FAQ** | H2: {Lens} {Symbol} Dream FAQ | `{lens_faq}` |

### Lens 变体差异
| Lens | 经典出处 | 水晶倾向 | 差异化 |
|---|---|---|---|
| **Islamic** ⭐ | 古兰经语境 + Ibn Sirin / Al-Nabulsi 传统（有出处才写具体） | 月光石/玛瑙/玉髓（主题搭配，非宗教处方） | **头部薄覆盖 + 系统承接缺口**（dreambible 主要 Biblical）|
| Biblical | 圣经 + Joseph/Daniel 故事 | 紫水晶（Aaron 胸甲）/ 蓝宝石 | dreambible 独占红海（需细分）|
| Spiritual | 新时代灵性传统 | labradorite / amethyst / clear quartz | KD 甜区（cheating KD28）|

### 图片
- hero: "{lens} spiritual symbols + {symbol} dream imagery + {religious_crystal}, sacred geometry, {lens} color palette (Islamic=non-figurative geometric / arabesque patterns, green/gold, no calligraphy, no sacred text, no human figures; Biblical=purple/blue stained-glass-inspired light; Spiritual=indigo/white), no text"
- 回链卡: 父 Subject 页缩略

---

## 套 3：Type 梦类型页

> **URL**：`/{type}-dreams-meaning/`（如 /recurring-dreams-meaning/ / /lucid-dreams-meaning/）
> **对标**：塔罗牌阵页（聚拢型）
> **字数**：2,000-3,000

### H2/H3 大纲
| 模块 | 字段 |
|---|---|
| H2: What Are {Type} Dreams? | `{type_definition}` |
| H2: Why Do We Have {Type} Dreams? | `{type_psychology}` |
| H2: Spiritual Meaning of {Type} Dreams | `{type_spiritual}` |
| H2: How to Handle {Type} Dreams + Crystals | `{type_crystals}` |
| H2: Common {Type} Dream Symbols | `{type_common_symbols}`（子 Subject 链接）|
| FAQ | `{type_faq}` |

---

## 套 4：Hub 水晶×梦交叉（变现层）

> **URL**：`/crystals-for-dreams/`（+ 子页 /crystals-for-dream-recall/ / /crystals-for-nightmares/ / /crystals-for-lucid-dreaming/）
> **对标**：Crystals-for-Condition
> **字数**：1,500-2,500

### H2/H3 大纲
| 模块 | 字段 |
|---|---|
| H2: Best Crystals for Dreams | `{top_dream_crystals}` |
| H2: How to Use Crystals for Better Dreams | `{usage_method}` |
| H2: Crystals for Dream Recall | `{recall_crystals}` |
| H2: Crystals for Stopping Nightmares | `{nightmare_crystals}` |
| H2: Crystal Dream Journal Method | `{journal_method}` |
| FAQ | `{hub_faq}` |
| Shop CTA | dream crystal 套装（amethyst + labradorite + howlite）|

---

## 5 变体说明（基于套 1 Subject 的差异）

| # | 变体 | URL | 与套 1 差异 |
|---|---|---|---|
| 5 | **动物梦** | /{animal}-dream-meaning/ | + 动物象征义强化（文化/图腾/本能）+ animal-dreams category |
| 6 | **复合 Splinter** | /{attr}-{symbol}-dream-meaning/ | + 颜色/属性变体段 + **回链父 Subject**（/yellow-snake → /snake-dream-meaning/）+ 防 3 段拼接 |
| 7 | **情感/场景梦** | /{emotion}-dream-meaning/ | + 情绪/场景段强化（焦虑/关系/工作）+ dream-emotions category |
| 8 | **AI 工具页** | /tools/ai-dream-interpreter/ | 不用 Brief 模板（独立工具 PRD，对标塔罗皇冠 AI 塔）|
| 9 | **Dreams category Hub** | /category/dreams/ + 5 二级 | 不用 Brief 模板（模板承接归档页，非内容页）|

---

## §审核清单（供用户审核）

| 检查项 | 套 1 | 套 2 | 套 3 | 套 4 |
|---|---|---|---|---|
| H2 大纲覆盖三层（心理学+灵性+水晶）| ✅ | ✅ | ✅ | ✅ |
| Islamic lens 独立 H3 | ✅ | ✅（⭐核心）| — | — |
| 水晶 CTA Casper 三段式 + Shop 三级降级 | ✅ | ✅ | ✅ | ✅ |
| FAQ 5-10 问（PAA + Fan-out）| ✅ | ✅ | ✅ | ✅ |
| Schema Article + FAQPage + Breadcrumb | ✅ | ✅ | ✅ | ✅ |
| 图片 hero + 场景 + 水晶卡（1536×864）| ✅ | ✅ | ✅ | ✅ |
| 数据层字段占位符 | ✅ | ✅ | ✅ | ✅ |
| DREAM 检查 5 维度 | ✅ | ✅ | ✅ | ✅ |
| 内链（Hub+category+Crystal+相关+Lens+工具+跨垂直）| ✅ | ✅（+回链父 Subject）| ✅ | ✅ |
| Lens 回链父 Subject | — | ✅ | — | — |

---

*Dream Brief 模板族完成于 2026-07-09 | 9 套归并为 4 独立结构 + 5 变体 | 供用户审核 | 审核确定后 AI 批量全量生产*
