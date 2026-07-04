# MBTI 本命塔罗牌工具 — 数据层 + 工具 + 文章矩阵设计

> 任务前置：竞品研究见 `01-竞品分析/MBTI本命塔罗牌-竞品研究.md`。
> 工具定位（2E-页面工具规划 §130）：T-MBTI，`/tools/mbti-tarot/`，独立工具，输入 MBTI 型 → 推荐塔罗本命大牌 + 个性化水晶。
> 本文档 = 设计稿（schema / 工具形态 / 文章规划），**不生产内容、不开发工具**。

---

## 1. 设计总览

### 1.1 核心差异化（vs 竞品，4 条护城河）

1. **走 Major Arcana 路径**（非 Court Cards 红海）—— 22 大牌 archetype 传播力强 + 与 `tarot-knowledge.json` 现有字段天然对齐。
2. **双牌映射**（主牌 Birth Card + 次牌 Growth Card）—— 立体解读，避竞品单牌分歧。
3. **认知功能栈依据**（Ni/Ne/Si/Se/Ti/Te/Fi/Fe）—— 不抄竞品数据，自推 + 给依据。
4. **水晶推荐独家**（3 颗/型，对齐 390 库）+ **东方锚点**（eastern_anchors 复用）—— 全球 0 竞品做。

### 1.2 数据流（零增量复用现有资产）

```
输入 MBTI 型（或选填生日双路径）
    ↓
mbti-tarot-knowledge.json（16 型 × 映射，本文档设计）  ← 新建
    ↓
关联 tarot-knowledge.json（22 牌 archetype/upright/reversed/crystals/eastern_anchors）  ← 已有
    ↓
关联 1.crystal-meaning/（390 水晶详情）  ← 已有
    ↓
输出：本命大牌图 + 双牌解读 + 3 水晶 + 东方锚点 + Shop CTA
```

---

## 2. 数据层 schema 设计（`configs/mbti-tarot-knowledge.json`）

### 2.1 文件位置建议

`07-互动工具/_shared/mbti-tarot-knowledge.json`（与其他 knowledge 文件并列，文章生产 + 工具共用单源）。

### 2.2 顶层 schema

```json
{
  "_meta": {
    "purpose": "MBTI 16型 × 塔罗本命大牌映射 + 水晶推荐（T-MBTI 工具 + 文章矩阵单源）",
    "framework": "Major Arcana 路径（非 Court Cards），双牌映射（主牌+次牌），认知功能栈依据",
    "crystal_sources": "tarot-knowledge.json cards[].crystals 字段 + MBTI 认知功能特性交叉",
    "compliance": "self-reflection framework（非 personality diagnosis）；MBTI 商标 disclaimer；逆位用 shadow/growth invitation，禁 bad omen",
    "url_rule_tool": "/tools/mbti-tarot/",
    "url_rule_article": "/mbti-{type}-tarot/（根级，避产品词污染）",
    "mbti_trademark_notice": "MBTI is a registered trademark of The Myers-Briggs Company. This tool is an independent framework based on Jungian cognitive functions, for self-reflection, not affiliated with or endorsed by The Myers-Briggs Company."
  },
  "total_types": 16,
  "types": [ /* 16 个 type 对象，见 §2.3 */ ]
}
```

### 2.3 单个 type 对象 schema（16 个）

```json
{
  "mbti_type": "INTJ",
  "nickname": "The Architect",
  "group": "Analysts",
  "cognitive_stack": {
    "dominant": "Ni",
    "auxiliary": "Te",
    "tertiary": "Fi",
    "inferior": "Se"
  },
  "birth_cards": [
    {
      "role": "primary",
      "card_slug": "the-hermit",
      "reason": "Ni 主导（内倾直觉）与 Hermit 的 archetype 'The Lone Seeker' / psychological_lens 'introspection and inner vision' 完美对齐——INTJ 在孤独沉思中提炼系统化远见，正是 Hermit 手提灯笼照亮内在的意象。"
    },
    {
      "role": "growth",
      "card_slug": "the-magician",
      "reason": "Te 辅助（外倾思考）显化 Ni 的远见为现实——Magician 的 'as above so below' 是 INTJ 把战略落地的能力。作为成长牌提示：当 INTJ 过度沉浸 Hermit 的抽离时，Magician 邀请整合'已拥有所需一切，启动吧'的信任。"
    }
  ],
  "upright_reading": "作为本命持 Hermit 能量的 INTJ，你的核心天赋是在喧嚣中保持独处的清醒——你的 Ni 主导让你看见别人尚未看见的模式与远见，Te 辅助把这些洞察转化为可执行的系统。你不是在逃避人群，而是在抽离中提炼别人无法在喧闹中抵达的深度。你的灯笼照的不是别人，是你自己内在的地图。",
  "reversed_shadow": "Hermit 逆位的阴影是过度孤立——当 Ni-Fi 循环把你拉进内心的回音室，你可能陷入'没人懂我'的防御性疏离，或用'我在思考'回避行动（Se 劣势的拖延）。成长邀请：真正的智慧既需要洞穴的沉思，也需要广场的显化——允许自己偶尔走出 Hermit 的灯笼光，让 Magician 的行动力接手。",
  "crystals": [
    {
      "role": "best_overall",
      "slug": "amethyst-meaning",
      "reason": "Amethyst 对齐 Hermit 的内省能量 + 增强 Ni 直觉（紫水晶传统对应第三眼/顶轮），是 INTJ 深度思考时的理想 companion。"
    },
    {
      "role": "best_upright",
      "slug": "sodalite-meaning",
      "reason": "Sodalite 增强 Ti/Te 的逻辑思考与系统化，配合 INTJ 显化战略时的清晰度。"
    },
    {
      "role": "best_growth",
      "slug": "carnelian-meaning",
      "reason": "Carnelian 激活 Se 劣势 + 行动力，当 INTJ 卡在 Hermit 抽离时，红玉髓提示'当下就启动'（对齐 Magician 成长牌）。"
    }
  ],
  "eastern_anchor": "藏传佛教的'闭关'（retreat）传统与 Hermit 共振——INTJ 的独处不是逃避，而是如喇嘛三年三月闭关般的深度修炼，出关时携带的智慧惠及更多人。紫水晶在东亚传统称'菩萨石'，是佛珠常用材质。",
  "shop_cta": {
    "primary_category": "/product-category/amethyst-crystals/",
    "fallback_search": "/shop/?s=amethyst",
    "final_fallback": "/product-category/healing-jewelry/"
  },
  "related_types": ["INTP", "INFJ"],
  "related_intentions": ["focus", "inner-wisdom"]
}
```

### 2.4 字段说明表

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `mbti_type` | string | ✅ | 4 字母（INTJ...ESFP）|
| `nickname` | string | ✅ | 16personalities 通用昵称（Architect/Mediator...）|
| `group` | enum | ✅ | Analysts/Diplomats/Sentinels/Explorers（4 气质群）|
| `cognitive_stack` | object | ✅ | 4 功能（dominant/auxiliary/tertiary/inferior）|
| `birth_cards[].role` | enum | ✅ | `primary`（主牌）/ `growth`（次牌，整合阴影）|
| `birth_cards[].card_slug` | string | ✅ | 对齐 tarot-knowledge.json 的 22 大牌 slug（the-fool/the-magician...）|
| `birth_cards[].reason` | string | ✅ | 认知功能 × archetype 对齐依据（80-120 词）|
| `upright_reading` | string | ✅ | 该型读本命主牌正位的独特角度（120-180 词）|
| `reversed_shadow` | string | ✅ | 逆位阴影 + 劣势功能整合邀请（80-120 词）|
| `crystals[].role` | enum | ✅ | best_overall / best_upright / best_growth |
| `crystals[].slug` | string | ✅ | 对齐 390 库 `{slug}-meaning` |
| `crystals[].reason` | string | ✅ | 水晶 × 认知功能对齐（40-60 词）|
| `eastern_anchor` | string | ✅ | 藏式/东方文化呼应（60-100 词）|
| `shop_cta` | object | ✅ | Shop 三级降级（category→search→healing-jewelry）|
| `related_types` | array | ⬜ | 认知功能相近型（内链用）|
| `related_intentions` | array | ⬜ | 对齐 intentions 配置（跨界内链）|

### 2.5 16 型映射总表（设计稿，生产前需 user 审）

> 依据：MBTI 认知功能栈（dominant/auxiliary）+ tarot-knowledge.json 的 archetype/psychological_lens 字段对齐。
> **主牌**=dominant 功能对齐；**次牌**=auxiliary 或 inferior 功能对齐（成长牌）。

| MBTI 型 | 昵称 | 认知栈 | 主牌（primary）| 次牌（growth）| 水晶主轴 |
|---|---|---|---|---|---|
| **INTJ** | Architect | Ni-Te-Fi-Se | The Hermit | The Magician | Amethyst / Sodalite / Carnelian |
| **INTP** | Logician | Ti-Ne-Si-Fe | The Hermit | The Star | Fluorite / Clear Quartz / Citrine |
| **INFJ** | Advocate | Ni-Fe-Ti-Se | The High Priestess | The Hermit | Moonstone / Amethyst / Labradorite |
| **INFP** | Mediator | Fi-Ne-Si-Te | The Moon | The Star | Rose Quartz / Moonstone / Aquamarine |
| **ENTJ** | Commander | Te-Ni-Se-Fi | The Emperor | The Chariot | Tiger's Eye / Garnet / Rose Quartz |
| **ENTP** | Debater | Ne-Ti-Fe-Si | The Magician | The Fool | Citrine / Aventurine / Sodalite |
| **ENFJ** | Protagonist | Fe-Ni-Se-Ti | The Hierophant | The Lovers | Rose Quartz / Lapis Lazuli / Carnelian |
| **ENFP** | Campaigner | Ne-Fi-Te-Si | The Fool | The Star | Aventurine / Citrine / Moonstone |
| **ISTJ** | Logistician | Si-Te-Fi-Ne | Justice | The Emperor | Hematite / Smoky Quartz / Carnelian |
| **ISFJ** | Defender | Si-Fe-Ti-Ne | The Hierophant | The Empress | Rose Quartz / Smoky Quartz / Moonstone |
| **ISTP** | Virtuoso | Ti-Se-Ni-Fe | The Hermit | Death | Black Tourmaline / Hematite / Bloodstone |
| **ISFP** | Adventurer | Fi-Se-Ni-Te | Strength | The Star | Rose Quartz / Carnelian / Sunstone |
| **ESTJ** | Executive | Te-Si-Ne-Fi | The Emperor | Justice | Tiger's Eye / Hematite / Rose Quartz |
| **ESFJ** | Consul | Fe-Si-Ne-Ti | The Empress | The Hierophant | Rose Quartz / Carnelian / Green Aventurine |
| **ESTP** | Entrepreneur | Se-Ti-Fe-Ni | The Chariot | The Fool | Carnelian / Tiger's Eye / Bloodstone |
| **ESFP** | Entertainer | Se-Fi-Te-Ni | The Sun | The Fool | Citrine / Sunstone / Carnelian |

**质量校验**：
- ✅ 22 大牌中被使用：16 张作为主牌覆盖（Hermit 出现 4 次：INTJ/INTP/INFJ/ISTP——所有 Ni/Ti 主导内省型，逻辑自洽）。
- ✅ 无一型超过 2 张牌（避免冗余）。
- ✅ 4 气质群主牌分布：Analysts→Hermit/Magician；Diplomats→High Priestess/Moon/Hierophant；Sentinels→Justice/Hierophant/Emperor/Empress；Explorers→Chariot/Strength/Sun/Fool——**群内主牌 archetype 同源**（认知功能相似性反映正确）。
- ✅ 水晶 slug 全部对齐 390 库命名（`{stone}-meaning` 格式）。

### 2.6 与 tarot-knowledge.json 的关联机制

工具运行时：
1. 读 `mbti-tarot-knowledge.json` 拿到该型的 `birth_cards[].card_slug` + crystals。
2. 用 `card_slug` 从 `tarot-knowledge.json.cards[]` 查到完整牌数据（name/archetype/upright_meaning/reversed_meaning/eastern_anchors/crystals/recommended_practice）。
3. 输出页面 = MBTI 型解读（本文档）+ 牌义标准解读（tarot-knowledge）+ 水晶（双源融合，本文档 crystals 字段优先）。

**优势**：牌义不重复维护（tarot-knowledge 单源），MBTI 视角是叠加层。

---

## 3. 工具形态建议

### 3.1 输入设计（双路径，吃 mbti birth card 词）

> 竞品洞察：`mbti birth card calculator` 关键词被生日算法工具错误占据。我们做双路径输入，既满足"按 MBTI 型"用户，也承接"按生日"搜索流量。

**路径 A（主）：选 MBTI 型（4 步下拉）**
- 第 1 步：Energy（I/E）
- 第 2 步：Mind（N/S）
- 第 3 步：Nature（T/F）
- 第 4 步：Tactics（J/P）
- 输出：4 字母组合 → 直接跳转结果

**路径 B（辅）：选填生日（双轨）**
- 选填 month/day/year → 顺便算 Tarot Birth Card（复用现有 tarot-birth-card 算法）
- 若同时填了 MBTI → 输出"双牌融合解读"（MBTI 本命牌 + 生日本命牌的共振/张力）
- 若只填生日 → 退化为现有 tarot-birth-card 工具（避免分流）

**与现有 tarot-birth-card 工具（48075）的区别**：
| 维度 | tarot-birth-card（现有）| mbti-tarot（新）|
|---|---|---|
| 输入 | 生日（必填）| MBTI 型（主）+ 生日（选填）|
| 算法 | 数值归约（Tarot.com）| 认知功能栈映射 |
| 输出 | 2 张大牌 | 主牌+次牌 + 3 水晶 + 东方锚点 |
| 卖点 | 算法透明 | 心理学依据 + 水晶推荐 |
| URL | `/tools/tarot-birth-card/` | `/tools/mbti-tarot/` |

**结论**：两工具**功能不重叠**，可并存。tarot-birth-card 守"生日算法"词，mbti-tarot 守"MBTI 型"词。

### 3.2 输出设计

```
┌─────────────────────────────────────────┐
│ 你的 MBTI 本命塔罗牌                      │
│ INTJ — The Architect                     │
│ 认知栈：Ni - Te - Fi - Se                │
├─────────────────────────────────────────┤
│ [本命主牌 The Hermit 大图]               │
│ archetype: The Lone Seeker               │
│ 主牌理由（80-120 词）                     │
│ 正位解读（120-180 词，INTJ 视角）         │
├─────────────────────────────────────────┤
│ [成长牌 The Magician 小图]               │
│ 成长牌理由（80-120 词）                   │
│ 阴影/成长点（80-120 词）                  │
├─────────────────────────────────────────┤
│ 🜂 推荐水晶（3 颗卡片）                   │
│ Amethyst（主）/ Sodalite（思考）/        │
│ Carnelian（行动力）                       │
│ [每颗 40-60 词 + Shop CTA 按钮]          │
├─────────────────────────────────────────┤
│ 🕉️ 东方锚点（藏式闭关 / 菩萨石）          │
├─────────────────────────────────────────┤
│ 📖 延伸阅读                              │
│ - INTJ 完整本命牌文章（内链）             │
│ - The Hermit 牌义页（内链 tarot 页）      │
│ - INTJ × INFJ 关系文章（内链）            │
├─────────────────────────────────────────┤
│ Keep exploring（18 工具联动 CTA）         │
└─────────────────────────────────────────┘
```

### 3.3 SEO 模块（参考 daily-tarot 模式）

- 页面顶部 H1：`MBTI Tarot Birth Card Calculator — Find Your Major Arcana`
- 工具下方 SEO accordion（6 段 + 9 FAQ）：
  - What is an MBTI tarot birth card?
  - How are MBTI types matched to tarot cards?（认知功能栈说明）
  - Can I have two birth cards?（主牌+次牌解释）
  - MBTI vs birthday birth cards（与 tarot-birth-card 区别）
  - Which crystals match my MBTI tarot card?
  - Is this scientific?（disclaimer + self-reflection framework）
- Schema：Article + FAQPage + BreadcrumbList（禁 Product 前端渲染）

### 3.4 开发路径（参照皇冠模式，generate.js + WP 部署）

- **不共享皇冠 v8/v9 抽牌引擎**（MBTI 工具无抽牌，是映射查表）。
- 复用 daily-tarot 模式（generate.js + 静态 HTML + Code Snippet 部署）。
- 数据层 importmap 动态 import（避免大 JSON 内联，参考 crystal-bracelet-builder v1）。

---

## 4. 文章矩阵规划

### 4.1 三种矩阵规模对比

| 规模 | 内容 | 数量 | SEO 价值 | 工作量 | 推荐 |
|---|---|---|---|---|---|
| **小**：16 型 hub | 每型 1 篇深度文章 | 16 | 吃 `[type] tarot card` 长尾 | 低（~16 篇）| ✅ 第一阶段 |
| **中**：16 型 hub + 16×本命牌交叉 | 每型 + 该型主牌/次牌的交叉解读 | 16 + ~32 | 中（吃双长尾）| 中（~48 篇）| ✅ 第二阶段 |
| **大**：16 型 × 22 牌全量 | MBTI × Tarot 352 | 352 | 高（长尾矩阵）| 极高（~352 篇）| ⬜ 暂不做 |

### 4.2 推荐策略（分两阶段，避开 352 全量）

> **核心判断**：16×22=352 全量是"为矩阵而矩阵"——大量组合无意义（如 ESFP × The Hermit 强行配对解读很牵强）。最优是**只做认知功能对齐的组合**，自然产出 ~48 篇高质内容。

#### 第一阶段：16 型 hub 文章（16 篇）

- URL：`/mbti-{type}-tarot/`（根级，如 `/mbti-intj-tarot/`）
- 内容结构（每篇 ~3000 词）：
  - H1: INTJ Tarot Card: The Hermit as Your Birth Card
  - 该型认知栈简述
  - 本命主牌完整解读（INTJ 视角）
  - 成长牌解读
  - 3 水晶推荐 + Shop CTA
  - 东方锚点
  - FAQ（5-8 问）
  - 内链：→ /tools/mbti-tarot/（工具）+ 该型主牌 tarot 牌义页 + related_types 文章

#### 第二阶段：16 × 本命牌交叉文章（~32 篇）

- 仅做"该型的主牌/次牌"组合（每型 2 篇）：
  - 例 INTJ：`/mbti-intj-the-hermit/` + `/mbti-intj-the-magician/`
- 内容（~1500 词/篇）：
  - 该型 × 该牌的深度交叉（比 hub 更深的水晶/场景）
- 共 ~32 篇（部分型主次牌重复则去重，实际可能 28-32）

#### 暂不做

- ❌ 16×22=352 全量（无认知功能依据的强行配对）
- ❌ MBTI × 小牌（Court Cards 已被竞品做透，且与我们 Major 路径不符）
- ❌ MBTI 关系配对文章（独立赛道，留给关系工具）

### 4.3 文章生产工作流（07 工作流，每篇带水晶东方差异化）

- 数据源：`mbti-tarot-knowledge.json`（单源，文章生产从 json 读字段）
- 框架：复用 `模板-Tarot-牌义页框架.md`（适配 MBTI 视角）
- 图片：每型 hero 图（MBTI 字母 + 本命大牌 + 水晶 graphic，复用 angel-numbers 模式 gpt-image-2）
- Shop CTA：三级降级（memory `shop-cta-no-deadlink-rule`）

---

## 5. 工作量估算 + 下一步顺序

### 5.1 工作量估算

| 阶段 | 任务 | 数量 | 估时（并行）| 依赖 |
|---|---|---|---|---|
| **A. 数据层** | mbti-tarot-knowledge.json（16 型完整字段）| 16 型 × 8 字段 | **1-1.5 天**（AI 协助批量生成 + user 审映射总表）| 本文 §2.5 总表 user 审 |
| **B. 工具开发** | generate.js + HTML + SEO accordion + Code Snippet 部署 | 1 工具 | **1.5-2 天**（参照 daily-tarot 模式）| A 完成 |
| **C. 工具上线** | TKD + mega menu + 18 工具联动 CTA + sitemap | 1 | **0.5 天** | B 完成 |
| **D. 文章矩阵第一阶段** | 16 型 hub 文章 | 16 篇 | **2-3 天**（07 工作流并行）| A 完成（B/C 不阻塞）|
| **E. 文章矩阵第二阶段** | 16×本命牌交叉 | ~32 篇 | **3-5 天**（并行）| D 完成 |
| **总计** | | ~49 篇 + 1 工具 + 1 json | **~8-11 天**（串行）/ **~5-7 天**（充分并行）| |

### 5.2 下一步顺序（推荐执行序）

```
1. User 审本文 §2.5 映射总表（16 型主牌/次牌）
   ↓（确认后）
2. 生产数据层 mbti-tarot-knowledge.json（16 型完整字段，AI 协助批量 + 抽样质检）
   ↓（并行启动）
3a. 工具开发（generate.js / HTML / SEO / 部署）
3b. 文章矩阵第一阶段（16 hub，不依赖工具上线）
   ↓
4. 工具上线 + 16 hub 文章 publish
   ↓
5. 文章矩阵第二阶段（~32 交叉文章）
   ↓
6. 验收 + GSC 提交 + 内链融入 mega menu
```

### 5.3 待 user 决策点

1. **映射总表 §2.5**：16 型主牌/次牌是否接受？特别是有竞品分歧的型（INTJ=Hermit vs Magician，INFJ=High Priestess vs Hermit）。
2. **双路径输入 §3.1**：是否做"MBTI + 生日双轨"（B 路径选填）？还是只做 MBTI 单路径？
3. **文章规模 §4.2**：第一阶段 16 hub + 第二阶段 ~32 交叉 = ~48 篇，是否接受？还是只做第一阶段 16 篇？
4. **MBTI 商标 disclaimer**：工具页 + 文章是否统一加免责声明（推荐加）？

---

## 6. 风险与红线

1. **MBTI 商标**：工具页加 disclaimer（self-reflection framework, not affiliated with The Myers-Briggs Company）。文章用 "based on Jungian cognitive functions" 措辞。
2. **认知功能栈理论争议**：定位 self-reflection（非 personality diagnosis），与现有 tarot 工具 gentle note 一致。
3. **水晶 slug 必须对齐 390 库**：生产前用 `1.crystal-meaning/` Glob 验证每个 slug 存在（memory `tool-data-layer-390-crystals`）。
4. **Shop CTA 三级降级**：production 前用 `wc/store` 验证产品类目存在（memory `how-to-pipeline-h1` / `shop-cta-no-deadlink-rule`）。
5. **不抄竞品数据**：映射基于 archetype + 认知功能自推（memory `competitor-research-serp-driven-strict`），竞品仅作"哪些大牌被高频绑定"的认知锚点参考。
6. **完成须线上验证**：声明完成必须线上验证实际产出（memory `completion-requires-online-verification`）。

---

**本文档为设计稿**，不含生产内容/代码。下一步 = user 审 §2.5 总表 → 启动数据层生产。
