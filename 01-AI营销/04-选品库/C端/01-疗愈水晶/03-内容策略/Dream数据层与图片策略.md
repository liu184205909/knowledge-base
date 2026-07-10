# Dream 数据层与图片策略

> **日期**：2026-07-09
> **定位**：解梦子垂直的**底层数据契约**——Brief 模板族 + AI 工具（AI Dream Interpreter Tool）共用同一份 `dreams-knowledge.json`。
> **状态**：⏳ **供用户审核**（schema + 图片策略），审核通过后才生产 JSON 文件。
> **对标**：塔罗 `07-互动工具/_shared/tarot-knowledge.json`（78 牌完整字段，已上线验证）+ 水晶 390 库（`04-内容生产/1.crystal-meaning/*.json`，crystal-profile 全属性）。
> **边界**：本文**只设计 schema 与图片策略**，不建 JSON 文件、不裁决 URL（URL 看 2A）、不定规模（规模看 3.3）。

---

## §0 设计原则

1. **一次性全量**：不分 P0 seed 先后（memory `no-phase-ai-parallel-production`）。schema 一套覆盖 9 类内容形态。
2. **三层标配对齐文章框架**：每个 dream 对象必含 psychology / spiritual / crystal_recommendations 三层（对标解梦文章类型框架 §二）。
3. **Islamic 差异化优先**：`lens_priority` 默认偏 Islamic（7 家已验证竞品头部薄覆盖 + 系统承接缺口），Biblical 次之（dreambible 独占红海），Spiritual 补位（KD 甜区）。
4. **字段名 = Brief 占位符**：`{psychology_meaning}` / `{spiritual_islamic}` / `{crystal_recommendations}` 等命名与 Brief 模板 agent 对齐；§5.4 必须覆盖所有 Brief 占位符，避免生产时临时拼字段。
5. **390 水晶通过 slug 关联**：`crystal_recommendations[].slug` 格式 `{stone}-meaning`，直接指向 `04-内容生产/1.crystal-meaning/{stone}-meaning.json`，复用其 `images` + `crystal-profile`。
6. **合规标记内置**：medical_disclaimer / determinism_flag / violent_content / ugc_entry / religious_sensitivity 五类标记位决定内容模板与图片策略分支。
7. **来源分级标注**：每个字段在 `source_notes` 标注来源（CLEAN_DreamOpportunity / dreambible / auntyflo / dreamdictionary / dreammoods / 1D §11 交叉验证）。
8. **SEMrush 待复核强声明**：1D 是降级版（无 SEMrush，memory `1d-degraded-semrush-backfill`），volume/kd 字段必须带 `semrush_verified` 布尔位。

---

## §1 数据层 schema

### 1.1 顶层结构（对标塔罗 tarot-knowledge.json）

```json
{
  "_meta": {
    "purpose": "Dream 子垂直单源数据层（文章生产 + AI Dream Interpreter Tool 复用）",
    "framework": "解梦文章类型框架.md（9 类 + 三层标配 + CTA 三级）",
    "crystal_sources": "390 水晶库 crystal-meaning.json crystal-profile（Chakra/Element/Intentions/Forms/Safety）",
    "compliance": "不做医学诊断 / 不做命运确定论 / 不做 UGC 词条（文章框架 §四）；psychology+spiritual+crystal 三层必齐",
    "url_rule_authority": "2A-网站结构 / 页面决策表（本文不裁决 URL）",
    "lens_strategy": "偏 Islamic（7 家头部薄覆盖 + 系统承接缺口）> Biblical（dreambible 红海）> Spiritual（KD 甜区）",
    "semrush_status": "1D 降级版（无 SEMrush），volume/kd 待回填后强交叉验证"
  },
  "total_subjects": "P0 50 + P1 200-300 + P2 long-tail + P3 parked（总量 800-1500 对标千页级）",
  "dreams": [
    /* dream 对象数组，schema 见 §1.2 */
  ]
}
```

### 1.2 单个 dream 对象（全量字段）

> **设计逻辑**：dream 没有"逆位"概念，用 `variants`（颜色/场景/动作变体）+ `shadow_triggers`（噩梦/阴影变体）替代塔罗的 upright/reversed。

```json
{
  "id": "dream_snake",
  "slug": "snake-dream-meaning",
  "keyword": "snake dream meaning",
  "volume": 22200,
  "kd": 77,
  "semrush_verified": true,
  "category": "Subject",
  "page_type": "Dream Subject Page",

  "source_notes": {
    "primary_source": "CLEAN_DreamOpportunity #35 / 1C P1",
    "cross_validated": ["auntyflo §11（动物池）", "dreambible §11（符号广度）"],
    "note": "印度占星小站进 top7，权威未锁定（Subject Universe §P0 蓝海）"
  },

  "dream_symbol": {
    "primary_symbol": "snake",
    "symbol_display": "Snake",
    "variants": [
      {"slug": "yellow-snake-spiritual-meaning", "type": "color", "note": "Splinter P4"},
      {"slug": "black-snake-in-house", "type": "scene", "note": "Splinter P4"},
      {"slug": "venomous-snake-biting", "type": "action", "note": "Splinter P4"},
      {"slug": "dream-of-snake-person", "type": "person", "note": "person 维度占位；用于 dead friend / ex / stranger 等人际梦变体"}
    ],
    "emotion_keywords": ["transformation", "fear", "hidden threat", "healing crisis"],
    "shadow_triggers": ["betrayal", "suppressed desire", "unconscious shadow"],
    "common_waking_life_triggers": ["transition", "conflict at work", "health anxiety"]
  },

  "psychology": {
    "meaning_skeleton": "{symbol} in dreams often represents {archetype_meaning}. From a psychological standpoint, it tends to surface when {trigger_context}. This is not a literal prediction — it reflects what your mind is processing.",
    "jung_archetype": "shadow / transformation",
    "freud_angle": "可选字段，部分梦 Freud 解释争议大可空字符串",
    "common_interpretation": "常识性解读，给用户最先看到的那句话",
    "reflection_prompt": "name one transition you are currently in, and what your reaction to the snake tells you about how you meet change"
  },

  "sleep_science": {
    "sleep_mechanism": "梦的机制简述（REM 阶段 / 记忆巩固 / 情绪处理），解释为什么 {symbol} 梦会生动、重复、或与情绪相关。只讲机制与边界，不做梦象定论。",
    "public_data_point": "公开睡眠科学数据点（如 'about 20% of people report dreaming about {symbol}'），必须可核验；未核验时 source_status=needs_verification",
    "evidence_boundary": "科学能解释的（梦的机制）vs 不能证实的（{symbol} 梦 = 某固定含义）边界声明",
    "humility_line": "科学谦逊句式（如 'Researchers haven't specifically studied whether {symbol} dreams specifically mean X'）",
    "source_status": "needs_verification"
  },

  "key_takeaways": {
    "_generation": "组装字段（生成时拼装，非独立素材）：3-4 条速览",
    "items": [
      {"type": "sleep_science", "from": "sleep_science.humility_line / sleep_mechanism"},
      {"type": "crystal_reflection", "from": "crystal_recommendations.best_overall（journaling ritual 视角，不做疗效承诺）"},
      {"type": "core_meaning", "from": "psychology.common_interpretation"}
    ]
  },

  "spiritual": {
    "islamic": {
      "available": true,
      "interpretation_skeleton": "In Islamic dream tradition (Ibn Sirin), {symbol} generally signifies {islamic_meaning}. Context matters: {color/scene/action modifiers}.",
      "scholar_reference": "Ibn Sirin / Al-Nabulsi（标注具体学者，未经核实标 false）",
      "source_confidence": "medium",
      "direct_scripture_available": false,
      "verified": false,
      "note": "⭐ 差异化核心——7 家头部薄覆盖 + 系统承接缺口；必须写明 based on classical sources, not a religious ruling"
    },
    "biblical": {
      "available": true,
      "interpretation_skeleton": "In biblical dream symbolism, {symbol} is associated with {biblical_meaning}. Key scriptural reference: {verse}.",
      "scripture_reference": "Genesis 3:1 / Numbers 21:9 等",
      "source_confidence": "medium",
      "direct_scripture_available": true,
      "verified": false,
      "note": "dreambible 独占区，需差异化切入"
    },
    "spiritual": {
      "available": true,
      "interpretation_skeleton": "From a broader spiritual lens, {symbol} carries the energy of {spiritual_meaning}.",
      "source_confidence": "low_to_medium",
      "direct_scripture_available": false,
      "note": "通用灵性，KD 甜区（cheating KD28）"
    },
    "hindu": {"available": false, "interpretation_skeleton": "", "note": "可选扩展，dreambible 亦空白"},
    "buddhist": {"available": false, "interpretation_skeleton": "", "note": "可选扩展"},
    "ritual_suggestion": "睡前仪式建议（对标塔罗 recommended_practice，例如：keep an amethyst at the bedside and name one transition before sleep）"
  },

  "crystal_recommendations": {
    "best_overall": {
      "slug": "black-tourmaline-meaning",
      "name": "Black Tourmaline",
      "reason": "转化阴影 + 防护。Snake 梦常出现在转变期，Black Tourmaline 提供落地锚点（crystal-profile: Protection/Grounding/Boundaries）",
      "chakra": "Root",
      "intention": "Protection, Grounding, Boundaries",
      "source": "goearthward dream 跨水晶统一"
    },
    "best_for_nightmare": {
      "slug": "smoky-quartz-meaning",
      "name": "Smoky Quartz",
      "reason": "噩梦变体专用——转化恐惧 + 接地阴影（crystal-profile: Grounding）",
      "source": "goearthward噩梦变体统一"
    },
    "best_for_prophetic": {
      "slug": "amethyst-meaning",
      "name": "Amethyst",
      "reason": "先知梦/清明梦专用——第三眼激活 + 灵性清醒（crystal-profile: Third Eye/Crown）",
      "source": "传统矿物学"
    },
    "best_for_lucid": {
      "slug": "labradorite-meaning",
      "name": "Labradorite",
      "reason": "清明梦专用——直觉、梦中觉察与边界感；与 prophetic 的 Amethyst/Celestite 区分",
      "source": "goearthward dream 类型映射"
    },
    "best_daily_wear": {
      "slug": "labradorite-meaning",
      "name": "Labradorite",
      "reason": "日常佩戴——直觉 + 蜕变保护（crystal-profile: Intuition/Transformation）",
      "source": "矿物学 + 首饰适配"
    },
    "source_notes": "综合四源（soulful nwild / astrosofa / labyrinthos / thecrystalcouncil）+ 390 库 crystal-profile 裁决"
  },

  "classification": {
    "dream_symbol_category": "animal",
    "dreammoods_theme": ["Fear", "Transformation"],
    "dream_type": null,
    "emotion_tone": "ambivalent",
    "lens_priority": ["islamic", "spiritual", "biblical"]
  },

  "urls": {
    "subject": "/snake-dream-meaning/",
    "lens_islamic": "/snake-dream-islamic-meaning/",
    "lens_biblical": "/snake-dream-biblical-meaning/",
    "lens_spiritual": "/snake-dream-spiritual-meaning/",
    "splinters": [
      "/yellow-snake-dream-meaning/",
      "/black-snake-in-house-meaning/"
    ],
    "hub": "/crystals-for-dreams/"
  },

  "internal_links": {
    "related_symbols": [
      {"slug": "water-dream-meaning", "reason": "情绪/潜意识共享主题"},
      {"slug": "falling-dreams-meaning", "reason": "失控感共享"}
    ],
    "parent_symbol": null,
    "splinter_children": [
      "yellow-snake-dream-meaning",
      "black-snake-in-house-meaning",
      "venomous-snake-biting-meaning"
    ],
    "cross_vertical": {
      "tarot": {"slug": "/the-tower-crystals/", "reason": "塔 Tower = 突变，与 snake 蜕皮同构"},
      "zodiac": {"slug": "/scorpio-crystals/", "reason": "Scorpio = 转化/阴影星座"},
      "angel_number": {"slug": "/angel-number-999-meaning/", "reason": "999 = 章节终结/转变"}
    }
  },

  "faq": [
    {
      "q": "What does it mean when you dream about snakes?",
      "a_skeleton": "Snake dreams often point to {transformation / hidden concern}. The meaning depends on {color/scene/your emotional reaction}. It is not a literal prediction."
    },
    {
      "q": "Is dreaming of snakes a bad omen?",
      "a_skeleton": "No. In modern dream work, no symbol is inherently bad. Snakes also signify healing (Asclepius) and transformation."
    },
    {
      "q": "What do different colored snakes mean in dreams?",
      "a_skeleton": "{variant_splinter_summary}, each pointing to a different shade of the same theme."
    }
  ],

  "images": {
    "hero_prompt": "Dreamy surreal hero illustration: a stylized snake coiled around a glowing black tourmaline crystal cluster, soft moonlit background, ethereal mist, transformation symbolism, no text, no words, 1536x864",
    "symbol_prompt": "Surreal dreamscape: a snake made of starlight winding through misty water at twilight, symbolizing transformation, soft cinematic lighting, no text",
    "crystal_image_slugs": [
      "black-tourmaline-meaning",
      "labradorite-meaning",
      "amethyst-meaning"
    ],
    "abstract_replacement": {
      "blood": "red mist / crimson ribbon",
      "shooting": "sudden flash of light / impact burst",
      "death": "transformation doorway / threshold scene",
      "teeth falling": "scattered pearls / loose seeds on velvet",
      "intruder": "shadow at the threshold / silhouette at doorway",
      "chased": "running through a corridor of light / pursuing shadow softened into mist",
      "kidnapping": "closed gate opening into dawn / protective circle of light",
      "fire": "warm amber glow / candlelight / phoenix-like sparks",
      "burning": "golden transformation flame / glowing embers without injury",
      "suffocating": "mist clearing into open sky / breath-like white ribbons",
      "car crash": "two light trails crossing then dissolving / broken road turning into stars",
      "accident": "scattered light fragments re-forming into a path",
      "monster": "large shadow shape softened by moonlight",
      "demon": "shadow archetype dissolving into protective light"
    },
    "filter_risk": "low"
  },

  "shop_cta": {
    "primary": {"slug": "/product-category/black-tourmaline-crystals/", "validation": "pending"},
    "fallback_search": "/shop/?s=black+tourmaline",
    "hub_fallback": "/crystals-for-dreams/",
    "validation_status": "pending",
    "note": "L1 类目 → L2 搜索 → L3 Hub 三级降级（解梦框架 §三）"
  },

  "compliance": {
    "medical_disclaimer_required": false,
    "determinism_flag": false,
    "violent_content": false,
    "ugc_entry": false,
    "religious_sensitivity": false,
    "note": "五类标记决定模板分支（医学警告、命运确定论警告、图片抽象化策略、UGC 拒绝、宗教谨慎措辞）"
  }
}
```

### 1.3 字段完整性矩阵（哪些字段对哪类页面必填）

| 字段块 | Subject | Lens Islamic/Biblical/Spiritual | Type | Animal | Splinter | Emotion | Hub | Crystals×Dreams |
|---|---|---|---|---|---|---|---|---|
| dream_symbol | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ |
| psychology | ✅ | ✅（与该 lens 对比）| ✅ | ✅ | ⬜ 轻量 | ✅ | ⬜ | ⬜ |
| spiritual.{lens} | ✅ 全填 | ✅ **该 lens 深填** | ✅ | ✅ | ⬜ 轻量 | ✅ | ⬜ | ⬜ |
| crystal_recommendations | ✅ | ✅ 灵性水晶 | ✅ 按类型 | ✅ | ✅ 颜色映射 | ✅ 情绪映射 | ⬜ | ✅ **最强** |
| classification | ✅ | ✅ | ✅ **dream_type 必填** | ✅ | ✅ parent_symbol 必填 | ✅ | ⬜ | ⬜ |
| internal_links.cross_vertical | ✅ | ⬜ | ✅ | ✅ | ✅ parent 必填 | ✅ | ✅ 入口卡片 | ✅ |
| faq | ✅ 5-8 条 | ✅ 3-5 条 | ✅ | ✅ | ⬜ 0-2 条 | ✅ | ⬜ | ✅ |
| images | hero+symbol+crystal | hero+symbol | hero | hero+symbol | hero 单图 | hero+symbol | hero | hero+crystal×3 |
| shop_cta | L1-L3 | L1-L3 | L1-L3 | L1-L3 | L1-L3 | L1-L3 | L3 | **L1 套装** |
| sleep_science | ✅ | ✅（边界铺垫，不压信仰）| ✅ | ✅ | ⬜ 轻量 | ✅ | ⬜ | ⬜ |
| key_takeaways | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ |

### 1.4 关键字段说明

**dream_symbol.variants** —— 取代塔罗的 upright/reversed二元。梦的变体是开放的（颜色/场景/动作/person 四维复合），所以用数组。每个 variant 有自己的 slug（对应 Splinter 页 URL）。`type` 枚举：`color` / `scene` / `action` / `person`。

**spiritual.islamic.available + verified** —— Islamic 差异化核心字段。`available: true` 但 `verified: false` 表示我们已写但未经伊斯兰学者核实，content 中必须出现"based on classical sources, not a religious ruling"免责声明。学者引用（Ibn Sirin / Al-Nabulsi）必须标注 `verified: false`，未核实不包装成定论。

**crystal_recommendations.best_for_nightmare / best_for_prophetic / best_for_lucid** —— dream 独有的水晶槽位（塔罗有 best_reversed 对应逆位，dream 用 nightmare / prophetic / lucid 对应梦类型变体）。每个槽位关联 390 库的 crystal-profile.Intentions 字段。

**classification.lens_priority** —— 数组排序决定 Brief 模板里 lens 出现顺序。默认 `["islamic", "spiritual", "biblical"]`（差异化优先），Biblical 单页可调整为 `["biblical", "spiritual"]`。

**internal_links.parent_symbol / splinter_children** —— Splinter 页必填父级，Subject 页必填子级（数组）。构成 dream 内部 subject → splinter 树。

**compliance 五类标记位** —— 决定模板分支：
- `medical_disclaimer_required: true` → 模板插入医学免责声明（精神类/身体类梦必加）
- `determinism_flag: true` → 模板插入"not a prediction"警告（先知梦/逝者梦必加）
- `violent_content: true` → 图片生成强制走 abstract_replacement 抽象化映射
- `ugc_entry: true` → 拒绝（自动标记，不生产）
- `religious_sensitivity: true` → Islamic/Biblical 等跨宗教内容强制使用谨慎措辞，禁止写成 religious ruling，禁止无出处经文断言

**source_notes** —— 每个对象必须有，记录该词来源（CLEAN_DreamOpportunity 行号 / dreambible / auntyflo / dreamdictionary / dreammoods / 1D §11）。对标塔罗每张牌的 source_notes。

**semrush_verified** —— ⚠️ 1D 是降级版（无 SEMrush，memory `1d-degraded-semush-backfill`），所有 volume/kd 必须标 `true/false`。false 的词在生产前必须回填 SEMrush 复核，否则降级到 P3 parked。

---

## §2 来源映射（5 来源 → 字段填充规则）

| 来源 | 权重 | 主填字段 | 填充规则 |
|---|---|---|---|
| **CLEAN_DreamOpportunity 1,443 行** | ⭐⭐⭐⭐⭐ | `keyword` `volume` `kd` `category` `page_type` | SEMrush 实测，P0/P1 主候选池；每行 → 一个 dream 对象 |
| **dreambible 6,666 符号 + 180 biblical** | ⭐⭐⭐ | `spiritual.biblical` `dream_symbol.variants` `faq` | Biblical 独占词 dreambible #2，差异化切入；符号广度做 Subject 扩展池；⚠️ **不可 URL join**（4 集合不重叠），只确认"有搜索触达" |
| **auntyflo §11 验证** | ⭐⭐⭐⭐ | `keyword`（低 KD 动物/灾难池）`psychology.common_interpretation` | KD<30 甜区（apes KD32 / tornado KD19 / bear KD18 / black cat KD10）；⭐ auntyflo = "长尾分散的新站唯一可学流派"（1D §11 memory）|
| **dreamdictionary 7 轴** | ⭐⭐⭐ | `classification.dream_symbol_category` | A-Z / Common / Nightmares / Symbols / Types / Biblical / Animals 七轴映射 dream_symbol_category 八值（animal/body/scene/emotion/spiritual/disaster/object/person）|
| **dreammoods 26 Themes + 8 Types** | ⭐⭐ | `classification.dreammoods_theme` `classification.dream_type` | 流量极端集中（头部词为主），theme 多选数组；dream_type 单选（recurring/lucid/nightmare/prophetic/visitation，仅 Type 类页面填）|
| **390 水晶库 crystal-profile** | ⭐⭐⭐⭐⭐ | `crystal_recommendations` 关联源 | slug 格式 `{stone}-meaning`，关联 `04-内容生产/1.crystal-meaning/{stone}-meaning.json`；读取其 `crystal-profile.Chakra/Element/Intentions/Forms/Safety` 自动填充 reason 模板 |
| **塔罗/星座/天使号数据层（cross_vertical）** | ⭐⭐⭐ | `internal_links.cross_vertical` | 通过主题同构匹配（snake↔Tower 蜕变 / snake↔Scorpio 转化 / 999↔终结），跨垂直内链 |
| **1D §11 7 家交叉验证** | ⭐⭐⭐ | `source_notes.cross_validated` | 1D 是降级版（无 SEMrush），7 家覆盖数据到位后必须复核（memory `1d-degraded-semrush-backfill`）|

### 2.1 category 八值映射表

| dream_symbol_category | 典型 dream | 来源轴 | CTA 倾向水晶 |
|---|---|---|---|
| **animal** | snake / bear / black cat / apes / crocodile | dreamdictionary Animals + dreammoods Animals | 转化/保护/勇气 |
| **body** | teeth falling / hair falling | dreamdictionary Common | 表达/喉咙（Blue Lace Agate）|
| **scene** | intruder in home / tornado / burning house | dreamdictionary Symbols | 安全/保护 |
| **emotion** | partner cheating / getting fired | dreamdictionary Common | 关系/工作（Rose Quartz/Citrine）|
| **spiritual** | prophetic dreams / visitation | dreamdictionary Biblical + Types | 第三眼/灵性（Amethyst/Labradorite）|
| **disaster** | tornado / tsunami / earthquake | auntyflo 低 KD 池 | 接地/稳定 |
| **object** | car / jewelry / lottery | dreamdictionary Symbols | 丰盛/旅程 |
| **person** | dead friend / ex married | dreamdictionary Common | 疗愈/释放 |

### 2.2 page_type → Brief 模板映射

| page_type | 对应塔罗模板 | Brief 模板（待 Brief 模板 agent 设计） |
|---|---|---|
| Dream Subject Page | Tarot Card Meaning Page | 模板-Dream-Subject |
| Spiritual/Religious Lens | Tarot Card Scene Page（塔罗场景页） | 模板-Dream-Lens-Islamic / Biblical / Spiritual（3 套）|
| Dream Type Page | Tarot Cards Hub | 模板-Dream-Type |
| Animal Dream | Tarot Card Meaning Page（子集） | 模板-Dream-Animal（复用 Subject）|
| Splinter Page | Tarot Combinations | 模板-Dream-Splinter（轻量）|
| Emotion/Scenario | Tarot Card Meaning Page（变体） | 模板-Dream-Emotion |
| AI Dream Interpreter Tool | Tarot Reading Tool | 工具页（独立工程，复用 dreams-knowledge.json）|
| Hub/Category Intro | Tarot Hub | 模板-Dream-Hub |
| Crystals×Dreams Page | Tarot × Crystals | 模板-Crystals-for-Dreams（最强 CTA）|

---

## §3 图片策略

### 3.1 每篇图片类型组合（按 page_type）

| page_type | hero | symbol/scene | crystal×dream | 总图数 |
|---|---|---|---|---|
| Subject | ✅ 梦象符号+水晶 graphic | ✅ 1-2 张场景 | ✅ 3 颗水晶产品/佩戴图（复用 390 库）| 5-6 |
| Lens Islamic/Biblical/Spiritual | ✅ 该传统视觉符号+水晶 | ✅ 1 张场景 | ✅ 1-2 颗灵性水晶 | 3-4 |
| Type（recurring/nightmare/...）| ✅ 类型符号+水晶 | ✅ 1 张代表性场景 | ✅ 1-2 颗（按类型）| 3-4 |
| Animal | ✅ 动物+水晶 | ✅ 1-2 张动物梦境场景 | ✅ 1-2 颗 | 4-5 |
| Splinter | ✅ 单张抽象场景 | ⬜ | ✅ 1 颗（颜色映射）| 2 |
| Emotion | ✅ 情绪场景+水晶 | ✅ 1 张场景 | ✅ 1-2 颗情绪水晶 | 3-4 |
| Hub | ✅ Hub 主视觉 | ⬜ | ⬜ | 1 |
| Crystals×Dreams | ✅ 套装主视觉 | ⬜ | ✅ **3-5 颗水晶组合图**（新生成）| 4-6 |

### 3.2 hero 图 prompt 模板

**对标**：angel-numbers-hero-visual-style（数字/符号+水晶graphic，gpt-image-2，9/10 评级）

```
模板 A（Subject/Animal/Emotion 页 hero）：
"Dreamy surreal hero illustration: [梦象符号描述] coiled around / intertwined with / emerging from a glowing [主推水晶] crystal cluster, soft [moonlit/twilight/dawn] background, ethereal mist, [transformation/protection/intuition] symbolism, atmospheric depth, no text, no words, 16:9 aspect ratio"

示例（snake）：
"Dreamy surreal hero illustration: a stylized serpent made of starlight coiled around a glowing black tourmaline crystal cluster, soft moonlit background, ethereal mist, transformation symbolism, atmospheric depth, no text, no words, 1536x864"

模板 B（Lens Islamic 页 hero，差异化视觉）：
"Surreal non-figurative hero illustration: [梦象符号] with [水晶], Islamic geometric and arabesque-inspired patterns, deep emerald and gold palette, soft dreamlike atmosphere, no calligraphy, no sacred text, no human figures, no faces, no text, 1536x864"

模板 C（Lens Biblical 页 hero）：
"Surreal hero illustration inspired by illuminated manuscripts: [梦象符号] with [水晶], gold leaf, stained glass palette, ethereal light, no text, 1536x864"

模板 D（Crystals×Dreams 套装页 hero）：
"Surreal hero illustration: a dream bedroom altar with [3-5 颗水晶名称] arranged on a silk cloth under a crescent moon, soft candlelight, restful sacred atmosphere, no text, 1536x864"
```

### 3.3 符号/场景图 prompt 模板

```
"模板 E（具体梦象场景）：
"Surreal dreamscape: [具体场景描述], symbolizing [核心象征], soft cinematic lighting, dreamy color grading, [emotion tone] atmosphere, no text, 1536x864"

示例（teeth falling）：
"Surreal dreamscape: scattered pearls and white seeds drifting from an open hand onto dark velvet, symbolizing release and transition, soft cinematic lighting, dreamy color grading, melancholy-but-hopeful atmosphere, no text, 1536x864"
```

### 3.4 规格

| 维度 | 规格 | 来源 |
|---|---|---|
| **尺寸** | 1536×864（16:9）| 对标塔罗/配对文章 `crystal-combinations-images-pipeline` |
| **格式** | webp | 全站统一 |
| **生成主力** | moleapi gpt-image-2 | memory `moleapi-image-gen-strategy` |
| **备用** | agnes-image-2.1-flash（免费，颜色稍逊）| memory `moleapi-image-gen-strategy` |
| **并发** | 6（实测稳定）| memory `moleapi-image-gen-strategy` |
| **重试错误码** | /524\|500\|503\|overloaded\|cpu/ 全覆盖 | memory `moleapi-image-gen-strategy`，曾漏 503 致 81% 失败 |
| **OpenAI 过滤应对** | 抽象化映射（§3.5）| memory `moleapi-image-gen-strategy`（naked figures 改 flowing robes 的同类教训）|

### 3.5 ⭐ 暴力/负面场景抽象化映射表

**梦象特殊性**：dream 主题含暴力/负面场景词（blood/shooting/death/rape/teeth falling/intruder），gpt-image-2 直接渲染会被 OpenAI 过滤。**必须抽象化**。

| 原词（触发过滤）| 抽象化替换（在 prompt 中）| 抽象化理由 |
|---|---|---|
| blood | red mist / crimson ribbon / rose petals drifting | 保留"红色液体"视觉但去血腥 |
| shooting / gunshot | sudden flash of light / impact burst / lightning strike | 保留"突发冲击"但去武器 |
| death / dying | transformation doorway / threshold scene / passage of light | 保留"过渡"但去尸体 |
| murder / killing | shadow being guided toward light / silhouette dissolving into mist | 保留"消失"但去暴力 |
| rape / sexual violence | ⚠️ **完全跳过，不写此类 dream 页** | 合规边界 |
| teeth falling | scattered pearls / loose seeds on velvet / white pebbles | 保留"白色物体脱落"但去生理 |
| intruder / attacker | shadow at the threshold / silhouette in doorway / presence at edge of light | 保留"入侵"但去具象 |
| chased / chasing | running through a corridor of light / pursuing shadow softened into mist | 保留"被追赶"压力但去威胁具象 |
| kidnapping / abducted | closed gate opening into dawn / protective circle of light | 保留"失控/被带走"但去犯罪具象 |
| fire / burning | warm amber glow / candlelight / phoenix-like sparks | 保留"燃烧/转化"但去伤害 |
| suffocating / choking | mist clearing into open sky / breath-like white ribbons | 保留"呼吸受限"但去窒息画面 |
| car crash / accident | light trails crossing then dissolving / broken road turning into stars | 保留"突发事故"但去撞击伤害 |
| monster / demon | large shadow shape softened by moonlight / shadow archetype dissolving into protective light | 保留阴影原型但去恐怖具象 |
| falling | figure suspended in mid-air / floating with clouds below | 保留"失控"但去撞击 |
| drowning | figure submerged in luminous blue / suspended in turquoise water with light above | 保留"窒息感"但去绝望 |
| tsunami / tornado | immense wave of starlight / spiral of wind and petals | 保留"规模感"但去灾难 |
| earthquake | ground cracking with light emerging from fissures | 保留"地裂"但去毁坏 |
| corpse / dead body | luminous figure dissolving into fireflies / empty cloak of light | 保留"消失"但去尸体 |
| war / explosion | distant lights across a horizon / blossoming flowers of light | 保留"远景冲突"但去具象 |

**实施**：每个 dream 对象的 `images.abstract_replacement` 字段记录该词的替换映射。生成脚本读此字段，在拼 prompt 前自动替换原词。`compliance.violent_content: true` 的 dream 强制走此流程，false 的可省略。

### 3.6 水晶图复用策略（关键成本控制）

**原则**：390 水晶库已生成全套图（`04-内容生产/1.crystal-meaning/{stone}-meaning.json` 中 `images.overview/properties/benefits/how_to_use/form_bracelet/featured`），dream 文章**复用，不重复生成**。

| 用途 | 来源 | 处理 |
|---|---|---|
| 水晶 hero 出现 | 390 库 `images.overview.src` | 直接嵌入 dream 文章 hero 区下方"主推水晶"卡片 |
| 水晶佩戴 CTA | 390 库 `images.form_bracelet.src` 或 `how_to_use.src` | 直接嵌入"Shop CTA"卡片 |
| 梦象×水晶搭配场景 | **新生成** | 仅 Crystals×Dreams 套装页 + Subject 页主推水晶 hero 图（§3.2 模板 A）|

**为什么**：390 库 390×6=2340 张图已上传 WP 媒体库（memory `crystal-content-recovery`），dream 文章复用通过 `wp_id` 直接引用，省 80% 生图成本。

**例外**：
- Subject 页 hero 图（梦象+水晶 graphic）—— **必须新生成**（390 库没有梦象场景）
- Crystals×Dreams 套装页 hero —— **必须新生成**（3 颗以上水晶组合场景）
- Lens Islamic 页 hero —— **必须新生成**（伊斯兰视觉符号+水晶，差异化需要）

---

## §4 批量生成方式

### 4.1 脚本架构（对标塔罗 / moleapi-image-gen-strategy）

```
04-内容生产/dreams/（待建）
├── _shared/
│   ├── dreams-knowledge.json     # 本文档审核通过后生产的数据层
│   └── dream-image-prompts/      # 从 dreams-knowledge 自动提取 prompts
├── scripts/
│   ├── 1_build_dreams_knowledge.py    # 从 5 来源组装 dreams-knowledge.json
│   ├── 2_extract_image_prompts.py     # 提取每个 dream 的 prompts 到待生成队列
│   ├── 3_generate_images.js           # moleapi 并发生图（NODE_PATH 全局 sharp）
│   ├── 4_upload_images.js             # 上传 WP + 回填 wp_id 到 dreams-knowledge
│   ├── 5_generate_brief.py            # 从 dreams-knowledge + Brief 模板生成单篇 Brief
│   └── 6_qc.py                        # 抽样质检（差异化/水晶/合规）
└── _qc/
    ├── cta-by-slug.json          # CTA 验证（对标塔罗 _cta-by-slug.json）
    ├── image-inventory.json      # 图片清单（已有/新生成/复用映射）
    └── sample-briefs/            # 抽样 Brief 审核目录
```

### 4.2 moleapi 并发生成（memory `moleapi-image-gen-strategy`）

```javascript
// 核心参数（对标塔罗 194 张 / 配对 121 张成功经验）
const CONCURRENCY = 6;        // 实测稳定
const MAX_RETRIES = 3;
const RETRY_ERROR_CODES = /524|500|503|overloaded|cpu/;  // 全错误码覆盖
const MODEL_PRIMARY = 'gpt-image-2';
const MODEL_BACKUP = 'agnes-image-2.1-flash';

// 抽象化替换（§3.5）
function applyAbstractReplacement(prompt, dream) {
  if (!dream.images.abstract_replacement) return prompt;
  let replaced = prompt;
  for (const [orig, abstract] of Object.entries(dream.images.abstract_replacement)) {
    replaced = replaced.replaceAll(orig, abstract);
  }
  return replaced;
}

// 生成队列
const queue = dreams
  .filter(d => d.images.filter_risk !== 'skip')
  .map(d => ({
    slug: d.slug,
    prompt: applyAbstractReplacement(d.images.hero_prompt, d),
    size: '1536x864',
    model: MODEL_PRIMARY
  }));

// 并发 + 全错误码重试
await pMap(queue, generateSingle, { concurrency: CONCURRENCY });
```

### 4.3 失败重试策略

| 错误类型 | 处理 |
|---|---|
| 524 / 500 / 503 / overloaded / cpu | 等 10s 重试，最多 3 次（memory `moleapi-image-gen-strategy`）|
| OpenAI 过滤（content policy）| **自动用 abstract_replacement 替换重试**；仍过滤则 fallback 到 agnes 备用 |
| 429 限流 | 退避至 30s 再重试 |
| 网络断开 | 跳过，记入 failed-queue.json，下批补 |

### 4.4 水晶图复用流程

```python
# 对每个 dream 对象
for dream in dreams:
    for crystal_rec in dream.crystal_recommendations.values():
        if not crystal_rec or not crystal_rec.slug:
            continue
        # 读 390 库
        crystal_path = f"04-内容生产/1.crystal-meaning/{crystal_rec.slug}.json"
        crystal = load(crystal_path)
        # 直接复用 images.overview.wp_id（已上传）
        crystal_rec.inherited_image_wp_id = crystal.images.overview.wp_id
        crystal_rec.inherited_image_src = crystal.images.overview.src
```

### 4.5 整体生产工作流

```
1. dreams-knowledge.json 组装（5 来源 + 390 关联）
   ↓
2. 用户审核 schema + 图片策略（本文档）  ← 当前步骤
   ↓
3. AI 工具 + Brief 模板 agent 同步设计（共用本数据层）
   ↓
4. moleapi 批量生图（hero + symbol 新生成；水晶图复用 390）
   ↓
5. 上传 WP 媒体库 + 回填 wp_id
   ↓
6. Brief 模板批量生产草稿（用 dreams-knowledge 字段填充占位符）
   ↓
7. 抽样质检（差异化/水晶 100% 三要素/合规五类标记）
   ↓
8. publish + 索引验证
```

---

## §5 审核清单（供用户审核）

### 5.1 schema 完整性审核

| 项 | 问题 | 我的方案 | 待用户确认 |
|---|---|---|---|
| 9 类 page_type 覆盖 | Subject/Lens×3/Type/Animal/Splinter/Emotion/Hub/Crystals×Dreams 是否够 | ✅ 9 类全有字段矩阵（§1.3）| 是否扩展 Type×Lens 交叉页（如"prophetic dream islamic"）|
| 字段命名 | 是否与 Brief 占位符对齐 | snake_case：`{psychology_meaning}` `{spiritual_islamic}` `{crystal_recommendations}` | Brief 模板 agent 是否接受这套命名 |
| Islamic 字段结构 | 子字段 `available` `verified` `scholar_reference` 是否过度 | 4 子字段 + `source_confidence/direct_scripture_available`，verified 必填以免包装成定论 | ✅ 不补 `madhab`；涉及具体律例时自然表述，不做教派判断 |
| crystal_recommendations 槽位 | best_overall/best_for_nightmare/best_for_prophetic/best_daily_wear 是否够 | ✅ 已加 `best_for_lucid`，与 prophetic 区分 | OK |
| variants 结构 | 数组+type(color/scene/action/person) 是否够 | ✅ 已加 `person` 维度，覆盖 dead friend / living friend / stranger 等人际梦 | OK |
| compliance 五类标记 | medical/determinism/violent/ugc/religious_sensitivity 是否够 | ✅ 已补 `religious_sensitivity`，触发更严格宗教合规措辞 | OK |
| semrush_verified | 1D 降级版的强声明 | 每个对象必填，false 必须回填 | OK |

### 5.2 字段覆盖审核

| 字段块 | 覆盖来源 | 待确认 |
|---|---|---|
| psychology（jung_archetype / freud_angle / reflection_prompt）| 待定：1D §11 内容站（cafeausoul / thesymbolicdream / psychologistworld / dreamtending）| 是否需要外采心理学专家验证 Jung 原型归属 |
| spiritual.islamic | 待定：Ibn Sirin / Al-Nabulsi 经典 + 1D §11（dreambible 真空）| 是否需要伊斯兰学者审稿（合规需要）|
| spiritual.biblical | dreambible 独占区 + 1D §11 + 公开圣经辞典 | OK，差异化切入 |
| crystal_recommendations | 390 库 crystal-profile 自动匹配 + dream-emotion 映射表（解梦框架 §三）| 映射规则是否需要人工逐 dream 调 |
| faq | dreambible + dreammoods + PAA + Suggest | 是否对每个 dream 实时跑 serp_check 抓 PAA |

### 5.3 图片可行性审核

| 项 | 我的方案 | 待确认 |
|---|---|---|
| 每篇图数 | Subject 5-6 / Lens 3-4 / Splinter 2 / Hub 1 / Crystals×Dreams 4-6 | 是否过度（塔罗牌义 4-6 张、配对 1 张、how-to 3-4 张参考）|
| 水晶图复用 | 复用 390 库 overview/form_bracelet，仅 hero 与搭配场景新生成 | 是否需要为每颗水晶在 dream 场景下重新生图（成本权衡）|
| 抽象化映射 | §3.5 已补 19 组替换 + violent_content 标记强制启用 | 生产时 failed-queue 继续回填新触发词 |
| Lens Islamic hero 视觉 | 改为 non-figurative Islamic geometric / arabesque patterns；禁 calligraphy / sacred text / human figures | 先出 1-2 张样本审，不按旧 miniature painting 批量 |
| OpenAI 过滤失败 fallback | agnes-image-2.1-flash（颜色稍逊）| 是否接受备用图质量降级 |
| 1536×864 全站统一 | OK（塔罗/配对/how-to 全用此尺寸）| OK |

### 5.4 与 Brief 模板 agent / AI 工具 agent 的字段对齐

| 占位符（Brief 模板用）| 数据层字段路径 | 备注 |
|---|---|---|
| `{symbol}` | `dream_symbol.primary_symbol` | |
| `{symbol_display}` | `dream_symbol.symbol_display` | |
| `{slug}` | `slug` / `urls.subject` | URL 示例变量；生成时不得自行改 URL 规则 |
| `{animal}` | `dream_symbol.primary_symbol`（当 category=animal） | Animal 变体 URL/H1 用 |
| `{attr}` | `dream_symbol.variants[].slug/type` | Splinter 属性变量，如 yellow / black / in-house |
| `{emotion}` | `dream_symbol.emotion_keywords[]` 或 `classification.emotion_tone` | Emotion/Scenario 页变量 |
| `{type}` | `classification.dream_type` | Type 页 URL/H1 用 |
| `{Lens}` | `classification.lens_priority[]` / 当前 lens label | Lens 页面显示名 |
| `{symbol_meaning}` | `psychology.common_interpretation` | Subject TL;DR 快答；无独立字段时取 common_interpretation |
| `{common_interpretation}` | `psychology.common_interpretation` | |
| `{psychology_meaning}` | `psychology.meaning_skeleton` | |
| `{jung_archetype}` | `psychology.jung_archetype` | |
| `{freud_angle}` | `psychology.freud_angle` | 可空；争议梦象不强填 |
| `{reflection_prompt}` | `psychology.reflection_prompt` | |
| `{spiritual_{lens}}` | `spiritual[lens].interpretation_skeleton` | Lens 模板动态字段；lens = islamic/biblical/spiritual |
| `{spiritual_islamic}` | `spiritual.islamic.interpretation_skeleton` | |
| `{spiritual_islamic_verified}` | `spiritual.islamic.verified` | 控制是否显示"未经学者核实"声明 |
| `{spiritual_biblical}` | `spiritual.biblical.interpretation_skeleton` | |
| `{spiritual}` | `spiritual.spiritual.interpretation_skeleton` | Brief 套 1 使用；等同 general spiritual |
| `{spiritual_general}` | `spiritual.spiritual.interpretation_skeleton` | |
| `{religious_background}` | `spiritual[lens].scholar_reference + source_notes` | 只写背景和传统来源，不包装成宗教裁决 |
| `{religious_scripture}` | `spiritual[lens].scripture_reference/direct_scripture_available/source_confidence` | 无直接出处时写 symbolic context，不编经文 |
| `{lens_symbolism}` | `spiritual[lens].interpretation_skeleton` | 去掉经文断言后的象征义段落 |
| `{religious_crystal}` | `crystal_recommendations.best_overall + lens-specific note` | 必须带 not a religious prescription 声明 |
| `{crystal_recommendations}` | `crystal_recommendations.best_overall + best_for_nightmare + best_for_prophetic + best_for_lucid + best_daily_wear` | Brief 渲染为 1-3 张水晶卡片，按 page_type 选择 |
| `{crystal}` | `crystal_recommendations.best_overall.name` | Prompt / CTA 通用变量 |
| `{stone}` | `crystal_recommendations.*.slug` | 水晶库 slug 变量 |
| `{crystal_reason}` | `crystal_recommendations.best_overall.reason` | Casper 三段式 CTA 用 |
| `{chakra}` | `crystal_recommendations.best_overall.chakra` | 从 390 crystal-profile 继承 |
| `{meaning}` | `psychology.common_interpretation` | CTA 快答/解释变量 |
| `{Reason}` | `crystal_recommendations.*.reason` | H3 标题变量，实际渲染时转 sentence case |
| `{crystal_best_overall_name}` | `crystal_recommendations.best_overall.name` | |
| `{crystal_best_overall_reason}` | `crystal_recommendations.best_overall.reason` | |
| `{crystal_best_overall_image}` | 继承自 390 库 `images.overview.src` | 通过 slug 关联 |
| `{variations}` | `dream_symbol.variants` | 渲染颜色/场景/动作/person 变体 |
| `{parent_subject_url}` | `internal_links.parent_symbol` 或 `urls.subject` | Lens/Splinter 回链父 Subject |
| `{type_definition}` | `classification.dream_type + page_type/type source_notes` | Type 页专用；生成脚本从 type config 补正文 |
| `{type_psychology}` | `psychology.meaning_skeleton` | Type 页按 dream_type 改写 |
| `{type_spiritual}` | `spiritual.spiritual.interpretation_skeleton` | Type 页通用灵性段 |
| `{type_crystals}` | `crystal_recommendations.best_for_nightmare/prophetic/lucid/best_overall` | 按 Type 选择槽位 |
| `{type_common_symbols}` | `internal_links.related_symbols` | Type 页下挂 Subject 列表 |
| `{type_faq}` | `faq` | Type 页筛选 dream_type 相关 FAQ |
| `{top_dream_crystals}` | `crystal_recommendations` 聚合 | Hub / Crystals×Dreams 页专用 |
| `{usage_method}` | `spiritual.ritual_suggestion` | |
| `{recall_crystals}` | `crystal_recommendations.best_for_lucid + best_for_prophetic` | dream recall/lucid/prophetic 相关 |
| `{nightmare_crystals}` | `crystal_recommendations.best_for_nightmare` | |
| `{journal_method}` | `psychology.reflection_prompt + spiritual.ritual_suggestion` | |
| `{lens_priority_islamic_first}` | `classification.lens_priority[0] === 'islamic'` | 控制 Brief 中 lens 出现顺序 |
| `{related_symbols_links}` | `internal_links.related_symbols` | Brief 渲染为内链列表 |
| `{internal_links}` | `internal_links` | Hub/category/crystal/related/lens/tool/cross-vertical 全量渲染 |
| `{faq}` | `faq` | Brief 套 1 使用 |
| `{faq_list}` | `faq[].q + faq[].a_skeleton` | Brief 模板填 a_skeleton 后扩展成段 |
| `{lens_faq}` | `faq` | Lens 页筛选宗教相关 FAQ |
| `{hub_faq}` | `faq` | Hub / Crystals×Dreams 页筛选水晶使用相关 FAQ |
| `{crystal_shop_url}` | `shop_cta.primary.slug` | Subject CTA 使用；失败走 fallback_search/hub_fallback |
| `{shop_cta_url}` | `shop_cta.primary.slug`（fallback_search / hub_fallback）| 三级降级 |
| `{medical_disclaimer}` | `compliance.medical_disclaimer_required` | true 时模板插入免责声明 |
| `{not_a_prediction_warning}` | `compliance.determinism_flag` | true 时模板插入警告 |
| `{hero_image_prompt}` | `images.hero_prompt`（经 abstract_replacement 处理）| 生图脚本读 |
| `{symbol_image_prompt}` | `images.symbol_prompt` | 生图脚本读 |

### 5.5 ⭐ 核心决策点（2026-07-09 已裁决）

1. **Islamic 字段不补 madhab（教派）子字段**：避免 over-engineering；涉及具体律例时只在 `interpretation_skeleton` 内自然表述，不做教派裁决。
2. **crystal_recommendations 加 `best_for_lucid` 槽**：清明梦市场大且与 prophetic 不同；Lucid 偏 Labradorite/Moldavite，Prophetic 偏 Amethyst/Celestite。
3. **variants 加 `person` 维度**：`type` 枚举为 `color/scene/action/person`，覆盖 dead friend / living friend / stranger 等人际梦。
4. **Lens Islamic hero 不用具象宗教绘画风格**：改为 non-figurative Islamic geometric / arabesque patterns；禁 calligraphy / sacred text / human figures。先出 1-2 张样本审，不批量冒进。
5. **水晶图默认复用 390 库**：仅 hero / 梦象×水晶搭配场景 / Crystals×Dreams 套装页新生成；接受此成本权衡。
6. **abstract_replacement 已从 13 组扩到 19 组**：生产中继续用 failed-queue 回填新增过滤触发词。
7. **补 `religious_sensitivity` 标记**：Islamic/Biblical 跨宗教内容触发更严格合规措辞；非额外审查，但禁止 religious ruling、禁止无出处经文断言。
8. **dreams-knowledge.json 路径采用**：`04-内容生产/dreams/_shared/dreams-knowledge.json`；AI 工具通过相对路径或同步副本引用，避免跨目录硬耦合。

---

## §6 已知风险与降级

| 风险 | 影响 | 降级方案 |
|---|---|---|
| Islamic 内容未经学者核实 | 合规风险 | `spiritual.islamic.verified: false` → 模板必加 "based on classical sources, not a religious ruling" 声明 |
| 1D 降级版无 SEMrush | volume/kd 不准 | `semrush_verified: false` 强声明，数据到位后批量复核（memory `1d-degraded-semrush-backfill`）|
| OpenAI 过滤率高（暴力梦象）| 生图失败 | abstract_replacement 映射 + agnes 备用模型 + failed-queue.json 补 |
| crystal-profile 缺字段（390 库部分恢复自线上）| crystal_recommendations reason 缺素材 | 自动从 content HTML 提取 Intentions/Chakra fallback |
| dreambible 不可 URL join | 符号广度有但无法精确承接 | 只做 Subject 扩展池，URL 不直接对接 dreambible 符号 |
| 噩梦/PTSD 类梦触发用户不适 | 用户安全 | `compliance.medical_disclaimer_required: true` 自动加"if recurring nightmares affect your wellbeing, please consult a healthcare professional" |
| religious_sensitivity 漏标 | 跨宗教冒犯 | 已补 `compliance.religious_sensitivity`；Islamic/Biblical 内容强制谨慎措辞 |

---

*Dream 数据层与图片策略 完成于 2026-07-09 | 对标塔罗 tarot-knowledge.json + 水晶 390 库 crystal-meaning.json + 解梦文章类型框架 | 依赖：1D 解梦深度拆解（降级版，SEMrush 待补）+ Subject-Candidate-Universe | 下游：Brief 模板族 + AI Dream Interpreter Tool + 图片批量生产脚本*
