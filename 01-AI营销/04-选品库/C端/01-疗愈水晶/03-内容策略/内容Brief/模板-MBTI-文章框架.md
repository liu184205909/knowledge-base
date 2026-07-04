# MBTI 普通文章框架 v1（16 型 × ~3000 词 = 16 篇）

> **三层架构**：母框架（本档，策略/合规/QC 逻辑）/ Brief（16 型 brief，从 knowledge 读字段，本文档 §17）/ [QC 清单](Checklist-MBTI-文章-QC.md)（本文档 §18，待建独立档）
> **适用**：`/mbti-{type}-tarot/` 根级 post（16 篇：INTJ / INTP / INFJ / INFP / ENTJ / ENTP / ENFJ / ENFP / ISTJ / ISFJ / ISTP / ISFP / ESTJ / ESFJ / ESTP / ESFP）
> **与塔罗牌义页框架关系**：[牌义页框架](模板-Tarot-牌义页框架.md) 写**单牌普适**；本框架写**该 MBTI 型 × 该型本命大牌（primary+growth 双牌）× 认知栈 × 3 水晶 × 东方锚点**的深度解读。物理隔离：MBTI 页讲牌在某型的具体投射，不重复牌普适 archetype。
> **与塔罗场景框架关系**：[场景框架](模板-Tarot-场景文章框架.md) 写**单牌 × 单场景**（5 场景）；本框架写**双牌（primary+growth）× 单 MBTI 型**。结构上吸收场景框架的 Search Intent Lens / 生成前 Brief / 张力分级 / 合规硬边界 / 水晶反思辅助口径 / 东方锚点池 / 质检关卡。
> **竞品依据**：[MBTI文章-竞品研究](../../01-竞品分析/MBTI文章-竞品研究.md)（2026-07-04，5 篇真竞品 webReader 抓取 + 4 词 SERP 实查）。
> **数据源**：`07-互动工具/_shared/mbti-tarot-knowledge.json`（16 型 × birth_cards primary+growth × 3 水晶 × eastern_anchor × upright_reading × reversed_shadow × cognitive_stack × shop_cta，2026-07-04 全 16 型审过）+ `07-互动工具/_shared/tarot-knowledge.json`（22 牌 archetype/upright/reversed/crystals/eastern_anchors）
> **核心策略**：主词 `{TYPE} tarot card` / `{TYPE} birth card tarot` / `myers briggs {TYPE} tarot` / `{TYPE} personality crystals`。差异化：**Major Arcana 双牌映射（竞品零）+ Jung 认知栈推导（竞品零）+ 东方锚点（竞品零）+ growth 成长路径（竞品零）+ 3 颗水晶各司其职（本命/辅助/成长，竞品扁平堆砌）+ ~3000 词深度（竞品 80-400 词）**。
> **⚠️ 最大风险**：① 16 型文章同套路换皮（同型 16 篇连读雷同）② 与塔罗牌义页撞内容（牌 archetype 复读）③ MBTI 商标红线（未 disclaimer）④ 逆位写成 bad omen（违反 growth invitation 口径）⑤ 水晶万能论（违反反思辅助口径）⑥ Health/Finances 触合规（关系/职业段滑向恋爱预言/职业算命）。

---

## §0 Search Intent Lens（生成前第一关）⭐⭐⭐

> **每型动笔前必先锁定用户真实问题 + 应答重点**。搜索 `{TYPE} tarot card` 的人想问什么？不是模板填空，是"这页到底回答什么"。所有模块围绕 Intent Lens 展开。

| Intent 维度 | 用户真实问题（搜 `{TYPE} tarot card` 的人想问什么）| 应答重点（内容该交付什么）|
|---|---|---|
| **映射问题** | 我的 MBTI 型对应哪张塔罗牌？为什么是这张？ | primary 牌 archetype × 认知栈主导功能的对齐推导（不是一一对应表，是 why）|
| **天赋/阴影** | 这张牌揭示我的什么核心天赋？什么盲点？ | upright_reading（天赋）+ reversed_shadow（阴影/growth invitation）|
| **成长路径** | 我如何从阴影走向整合？成长牌是什么？ | growth 牌的"邀请"口径 + 劣势认知功能激活路径 |
| **水晶辅助** | 哪些水晶适配我的型 + 本命牌？为什么？ | 3 颗水晶各司其职（best_overall/upright/growth）+ 反思辅助口径 |
| **场景落地** | 这套牌+水晶在我关系/职业/成长里如何显现？ | 关系/职业/灵性成长 3 场景具体行为（禁预言）|

**硬约束**：
1. §1 生成前 Brief 必须显式声明该型 Intent（一句话），正文每模块回看是否服务该 Intent
2. M2 本命大牌解读的开篇句必须**直接命中**该型 Intent Lens，禁绕弯"This type corresponds to..."
3. M8 FAQ 必须从 PAA 高意图问题推导（"What tarot card is {TYPE}?" / "Which jungian archetype is {TYPE}?" 等），非 AI 自由发挥

---

## §1 URL + TKD

- **URL**：`/mbti-{type}-tarot/`（根级 post，无 category base；对齐 site-url-rule + mbti-tarot-knowledge _meta `url_rule_article`）
  - 示例：`/mbti-intj-tarot/` / `/mbti-enfp-tarot/` / `/mbti-esfj-tarot/`
  - type 全小写（intj / enfp / esfj），不带 `-a/-t`（16personalities 后缀，非 MBTI 标准）
  - 不加 `tarot-` 前缀（MBTI 词无水晶产品词污染风险）；不加 `-crystals`（MBTI 页是知识页，水晶在 M6）
- **Title**（≤60 字符）：`{TYPE} Tarot Card: Birth Card Meaning & Crystals`
  - 示例：`INTJ Tarot Card: Birth Card Meaning & Crystals`（41 字符）
  - 长型名（4 字母全等长，无需短形式）
- **H1**：`{TYPE} Tarot Card: Your Birth Card, Crystals, and Eastern Anchor`
  - 示例：`INTJ Tarot Card: Your Birth Card, Crystals, and Eastern Anchor`
- **Primary KW**：`{type} tarot card` / `{type} birth card tarot` / `myers briggs {type} tarot`
- **Secondary KW**：`{type} personality crystals` / `{type} tarot meaning` / `{type} birth card meaning`
- rank_math 三件套（focus_keyword = `{type} tarot card`）

---

## §2 生成前 Brief（单篇 brief，控 16 型不雷同）⭐⭐⭐

> **每篇写正文前先输出一份 brief**，作为该篇的"质量契约"。Brief 通过质检门后才允许写正文。**这是 16 篇规模化不雷同的核心阀门**——brief 重复/通用，正文必然换皮。

**Brief 模板（14 字段，每篇必填）**：

```
[1] 主关键词：
[2] 搜索意图（从 §0 Intent Lens 选定，一句话）：
[3] 型概述核心特质（该型 4 字母 + nickname + group + 主导/辅助认知功能）：
[4] primary 牌 + 对齐推导（为什么是这张：archetype × 认知栈主导功能对齐，非"对应表"）：
[5] growth 牌 + 成长邀请（为什么是这张：辅助/劣势功能 × archetype 成长邀请）：
[6] 禁重复的牌义页内容（primary 牌在 tarot-knowledge 已写过、本篇不复读的 archetype 段）：
[7] primary 牌 Rider-Waite 投射（该牌独有画面 → 该型的具体投射，如 Hermit 灯笼=INTJ 的内在地图）：
[8] upright_reading 关键意象（从 knowledge upright_reading 提取 3 个该型独有的具体行为/人物画像）：
[9] reversed_shadow 关键阴影（从 knowledge reversed_shadow 提取 2-3 个该型独有阴影 + growth invitation）：
[10] 3 颗水晶及理由（每颗：role=best_overall/upright/growth + 为何这颗配该型+该牌；标注分工：本命/辅助/成长）：
[11] 东方锚点（从 knowledge eastern_anchor 提取 + 配该牌专属意象词）：
[12] 内链目标（同型 16 篇选 2-3 + primary/growth 牌义页 × 2 + 水晶 meaning × 3 + MBTI Hub × 1 + 工具 /tools/mbti-tarot/ × 1）：
[13] FAQ 6-8 问（从 §11 PAA 池选）：
[14] 结构变体（benchmark 档必填，从 §15 关卡6 清单勾选 ≥1）：
```

**硬约束**：
1. Brief 字段 [4] primary 牌对齐推导与同型其他 15 篇 brief 比对，**对齐逻辑不得雷同**（每型的"为什么是这张"必须落到该型认知栈独有特质，禁通用"X 型对应 Y 牌因为都是 Z"）
2. Brief 字段 [8] 三个关键意象必须是**该型独有具体行为/人物画像**（动词短语+情境），禁抽象状态（如"strategic thinker"）
3. Brief 字段 [10] 3 颗水晶来自 knowledge `crystals` 字段（best_overall/best_upright/best_growth 各 1），**禁生产中临时换**；理由须落 cognitive_stack × archetype 双维匹配
4. Brief 字段 [11] 东方锚点必须配该 primary 牌**专属意象词**（从 tarot-knowledge `eastern_imagery` 取，如 The Hermit=闭关/独照/灯笼/内观），否则判通用句打回

---

## §3 张力分级（3 档词数 + 弱型退路）⭐⭐⭐

> 16 型 × 双牌映射的张力天然不同（INTJ×Hermit 强隐喻 vs ISTJ×Justice 中等隐喻）。借鉴塔罗场景框架 §3，给 16 型打 tension 分决定词数+模块策略。

### 3.1 tension 打分规则

每型打 **tension 分（1/2/3）**，写入生产 brief 字段后标注：
- **3 分（标杆档）**：型 × 本命大牌有天然鲜明隐喻（如 INTJ×Hermit=孤独建筑师 / INFJ×High Priestess=神秘先知 / INFP×Moon=梦境行者 / ENTJ×Emperor=天然统帅 / ENFP×Fool=永动机探索者）
- **2 分（标准档）**：中等，隐喻清晰但不极致（如 ISTJ×Justice=守序判官 / ISFJ×Hierophant=传统守护者 / ESTP×Chariot=行动战车）
- **1 分（精简档）**：信息稀薄或隐喻抽象（如 ESFP×Sun=阳光表演者 / ESTJ×Emperor=组织执行者，与 ENTJ×Emperor 高度重叠）

**每型至少 8-10 个 3 分标杆档深做**（16 型的 50-62%），其余按 2/1 分处理。

### 3.2 三档差异化策略

| 档位 | 词数 | M2 primary 深度 | M3 growth 深度 | FAQ | 内链 |
|---|---|---|---|---|---|
| **3 分 benchmark** | **2800-3500** | 深挖 500+词 + 案例/咨询师视角 | 350+词 + 成长路径具体步骤 | 8 问 | 该页为权重承接页，收同型 16 篇内链 |
| **2 分 standard** | **2200-2800** | 标准 350-450 词 | 250-350 词 | 6-7 问 | 标准配额 |
| **1 分 lite** | **1800-2200** | 250-350 词 + 允许诚实承认该型×牌映射较直观 | 200-280 词 | 5-6 问 | 通过内链把权重导向同组标杆档（3 分）页 |

**硬约束**：
1. 每篇 brief 字段 [14] 后必须声明 `tension: 1|2|3` + `depth_tier: benchmark|standard|lite`
2. 1 分页必须含"诚实承认 + 内链导向同组标杆页"二要素，禁灌水
3. 3 分页 M2 必须 ≥500 词 + 含至少 1 个匿名来访者案例或咨询师视角，否则降级 2 分

---

## §4 合规硬边界（MBTI 商标 + 逆位 shadow + Health/Finances 继承）⭐⭐⭐

### 4.1 MBTI 商标 disclaimer（强制，每篇 Intro 后固定，原文照搬禁改写）

> **MBTI is a registered trademark of The Myers-Briggs Company. This article is an independent framework based on Jungian cognitive functions (Ni/Ne/Si/Se/Ti/Te/Fi/Fe), offered for self-reflection and creative exploration — not affiliated with, endorsed by, or sponsored by The Myers-Briggs Company. Mapping decisions are our own editorial interpretation and do not represent official MBTI doctrine.**

**硬约束**：
1. 每篇 Intro 段后必须原文照搬上述 disclaimer（不简化、不改写、不挪到页脚）
2. 文中首次出现 "MBTI" 须全大写；"Myers-Briggs" 须正确大小写
3. 禁用"official MBTI" / "MBTI 官方映射" / "the MBTI Company says" 类暗示官方背书表达

### 4.2 逆位 shadow 口径（禁 bad omen / curse / evil）

> 监管红线：逆位在 MBTI 语境 = **该型的阴影面/growth invitation**，不是"坏牌"或"诅咒"。MBTI 数据 `reversed_shadow` 字段已统一用 growth invitation 口径（"过度孤立 / 防御性疏离 / 拖延"等），生产时**原文采用禁改写为 bad omen**。

| 类型 | ✅ 允许（growth invitation 口径）| ❌ 禁（bad omen 口径）|
|---|---|---|
| 阴影描述 | `over-isolation` / `Ni-Fi loop` / `growth edge` / `shadow side invites...` | `bad omen` / `curse` / `doomed` / `this is your dark side` |
| 逆位改写 | `the growth invitation is...` / `the shadow asks you to...` | `reversed means you will fail` / `a warning of doom` |

**硬约束**：
1. M4 reversed_shadow 段必须用 growth invitation 口径（从 knowledge `reversed_shadow` 原文采用）
2. 禁用"this card reversed is bad"类绝对负面表达
3. 逆位段必须落"如何从阴影走向整合"的具体路径（接 M3 growth 牌）

### 4.3 关系/职业/成长场景合规（继承塔罗场景框架 §4）

> 关系段易滑向"对方一定回头"恋爱预言；职业段易滑向"一定会升职/被裁"职业算命。本节为强制黑名单。

| 场景 | ✅ 允许 | ❌ 禁 |
|---|---|---|
| **关系** | 互动模式 / 边界感 / 沟通策略 / 该型在亲密关系的具体行为 | `对方一定回头` / `一定会出轨` / `soulmate guaranteed` |
| **职业** | 决策节奏 / 资源条件 / 工作风格 / 该型在职场的具体表现 | `一定会升职` / `会被裁` / `this job will succeed` |
| **成长** | 觉察 / 阴影整合 / 修行态度 / 内在工作 | `开悟保证` / `awaken guaranteed` / `guaranteed transformation` |

**Finances/Health**：MBTI 文章默认不写 Finances/Health 场景（不在 §6 模块），如某型 brief 必须涉及（如 ESTJ×Emperor 涉及财务结构），守塔罗场景框架 §4.1/§4.2 黑名单 + 收尾免责。

---

## §5 禁用表达库（合规前置门配套）⭐⭐

> AI 生成时极易滑入的 6 类套路句。grep 兜底 + 二审人眼双查（继承塔罗场景框架 §5）。

| 类型 | ❌ 禁 | ✅ 替代 |
|---|---|---|
| 泛泛开头 | `Every INTJ is...` / `As an INTJ, you...` / `This type corresponds to...` | 直接写型 × 牌的具体冲突（"The Hermit's lantern is the image to sit with here..."）|
| 绝对预测 | `This means you will...` / `Your type guarantees...` | `This may point to...` / `It often suggests...` / `the card invites...` |
| 恐吓逆位 | `A bad sign for INTJ` / `This ruins your...` | `The growth edge is...` / `The shadow side invites...` |
| 水晶万能 | `Wear Amethyst to enhance your intuition` / `Amethyst attracts wisdom` | 写具体使用场景（"hold Amethyst for 5 minutes before deep strategic thinking"）|
| 医疗承诺 | `This crystal heals anxiety` / `cures overthinking` | `Use it as a reminder to...` / `a tactile cue to pause` |
| 商标暗示 | `the official MBTI mapping` / `MBTI Company says` | `our editorial interpretation` / `a self-reflection framework` |

**硬约束**：质检脚本对全文 grep 上表 ❌ 列，命中即打回；M4 逆位段 + M6 水晶段 + Intro 为高发区，重点扫。

### 5.1 否定教学句上下文判定（继承塔罗场景框架 §5.1）

> 合规反向声明（"no crystal that guarantees wisdom" / "not a personality diagnosis"）会被 grep 禁词误命中。脚本须加上下文判定：命中词前后 30 字符含 not/no/never/cannot/can't/without → 视为合规反向声明放行。

---

## §6 模块结构（10 模块，~3000 词）⭐⭐⭐

> 模块顺序：Intro → M1 型概述 + Intent → M2 本命大牌 primary（核心）→ M3 成长牌 growth → M4 阴影 reversed_shadow → M5 关系场景 → M6 职业场景 → M7 成长场景 → M8 3 水晶 → M9 东方锚点 → M10 FAQ + CTA。
> **顺序逻辑**：先讲"你是谁"（M1）→ "你的本命牌说什么"（M2）→ "你的成长路径"（M3）→ "你的阴影"（M4）→ 三场景落地（M5-M7）→ 水晶辅助（M8）→ 东方锚点（M9）→ FAQ + CTA（M10）。

### 6.1 全量模块表（3 分 benchmark 档全做；2/1 分按 §3.2 裁剪）

| # | 模块 | H2 | 3分词数 | 2分词数 | 1分词数 | 要点 |
|---|---|---|---|---|---|---|
| Intro | Hero + 钩子 + 商标 disclaimer | | 150-200 | 130-180 | 100-150 | 直接命中 §0 Intent + 原文照搬商标 disclaimer |
| M1 | 型概述 + Intent | `{TYPE} at a Glance: The {Nickname}` | 200-280 | 180-220 | 150-200 | 4 字母 + nickname + group + 认知栈 + 该型 Intent Lens |
| **M2** | **本命大牌 primary 解读 ⭐⭐⭐** | `Your Birth Card: {Primary Card}` | **500-650** | 350-450 | 250-350 | archetype × 认知栈主导功能对齐 + Rider-Waite 投射 + 案例/咨询师视角 |
| M3 | 成长牌 growth | `Your Growth Card: {Growth Card}` | 300-400 | 250-350 | 200-280 | 辅助/劣势功能 × archetype 成长邀请 + 具体步骤 |
| M4 | 阴影 reversed_shadow | `The Shadow Side: Reversed {Primary Card}` | 250-350 | 200-280 | 180-250 | growth invitation 口径 + 阴影整合路径 |
| M5 | 关系场景 | `{TYPE} in Relationships` | 200-300 | 180-250 | 合并入 M7 | 该型在亲密关系/友谊的具体行为（禁预言）|
| M6 | 职业场景 | `{TYPE} at Work` | 200-300 | 180-250 | 合并入 M7 | 该型在职场的具体表现（禁算命）|
| M7 | 成长场景 | `{TYPE} on the Growth Path` | 200-280 | 150-220 | 250-350（吸收 M5/M6）| 灵性成长 + 内在工作 + 阴影整合 |
| **M8** | **3 水晶（核心差异化）⭐⭐⭐** | `Crystals for {TYPE}` | 350-450 | 280-350 | 200-280 | 3 颗各司其职（本命/辅助/成长）+ 反思辅助口径（见 §9）|
| **M9** | **东方锚点（核心差异化）⭐⭐⭐** | `{TYPE}: An Eastern Lens` | 250-350 | 200-280 | 180-250 | 东方锚点（藏传/道家/中医等）+ 该牌专属意象词（见 §10）|
| M10 | FAQ + Shop CTA + 工具 CTA + Related | | 280-380 | 200-300 | 150-220 | §11 PAA 池 8/6-7/5-6 问 + 首饰 Shop CTA 三级降级 + /tools/mbti-tarot/ |

**1 分页合并规则**：M5 关系 + M6 职业 + M7 成长 三合一为单节 `{TYPE} in Daily Life`，避免 lite 页模块碎裂。

---

## §7 M2 本命大牌 primary 解读（核心防雷 ⭐⭐⭐）

> **竞品雷同根源**：竞品要么一一对应表（cosmopolitan "INTJ = Knight of Pentacles"），要么属性堆砌（shinepurity "INTJ 适合 Amethyst"）。**本模块禁此写法。**

**核心写法 = archetype × 认知栈主导功能对齐推导**：
- ❌ 禁（一一对应，无 why）："INTJ's birth card is The Hermit because both are introspective."
- ✅ 要（对齐推导，落 why）："The Hermit's archetype 'The Seeker' aligns with INTJ's dominant Ni (introverted intuition) — the function that lets you see patterns and visions others haven't yet articulated. The Hermit's lantern illuminates an inner map, not a crowd's consensus; that's exactly where your Ni does its work."

### 7.1 Rider-Waite 投射（核心防雷）

**每型 M2 必须落该 primary 牌 Rider-Waite 独有画面在该型的具体投射**（不是该牌普适画面）：

| ❌ 禁（通用，任何型都能套） | ✅ 要（型 × 牌独有投射） |
|---|---|
| "The Hermit stands alone on a mountain with a lantern." | "The Hermit's six-pointed lantern — not the mountain, not the staff — is the image to sit with for INTJ. That lantern illuminates **an inner map**: the patterns Ni synthesizes when external noise falls away. Your strategic vision isn't borrowed from the crowd; it's lit from within, often in solitude." |

### 7.2 匿名来访者案例规范（3 分 benchmark 档 M2 案例感来源）

> 3 分 benchmark 档 M2 要求 **500-650 词 + 案例感/咨询师视角**。匿名案例若写成"某 INTJ 会成功/失败"的占卜预言，反触 §4.2 红线。本节规范"匿名来访者案例"写法（继承塔罗场景框架 §7.1）。

**4 要素**（缺任一判不合格案例，改用咨询师视角段）：
1. **化名**：单字母 + M./J./A.（不编全名、不编可识别细节）
2. **场景细节**：具体到节点（"三场深度对话后""提出战略那天"）
3. **两个同时为真的事实**（核心防预言结构）：当事人内心两件同时成立的事，不写结局预测
4. **牌意投射**（illustrate 非 predict）：案例只演示牌意如何投射该情境，不预测结局

**反例（案例变占卜预言，必打回）**：
> ❌ "M. came to me as an INTJ carrying the Hermit. I told him his strategy would succeed. Six months later, it did — proving the Hermit's power."

**正例（双真事实 + 投射非预测）**：
> ✅ "M., 32, an INTJ and product strategist, sat with the Hermit after his team pushed back on a five-year vision only he could see. He was genuinely certain the vision was right **and**, in the same breath, aware he'd built no bridge for his team to arrive at it with him. The Hermit wasn't forecasting the vision's success — it was naming the gap between inner clarity and shared execution, the gap Ni dominance creates when Te hasn't yet done its translation work. The work wasn't to predict; it was to ask the question he'd been circling."

---

## §8 M3 成长牌 growth 解读（差异化护城河 ⭐⭐）

> **竞品集体空白**：5 篇竞品 0 篇有 growth 牌概念。竞品只给"幸运水晶/单一张对应牌"，无成长路径。我们 growth 牌 = **该型从 primary 阴影走向整合的邀请**。

**growth 牌推导逻辑**（从 knowledge `birth_cards.growth.reason`）：
- **辅助认知功能** × **archetype 成长邀请**
- 示例（INTJ）：growth = The Magician（Te 辅助 × "as above so below" 显化能量）—— 当 INTJ 过度沉浸 Hermit 抽离时，Magician 邀请"你已拥有所需一切，启动吧"

**M3 结构**：
1. growth 牌 archetype 简介（不复读牌义页）
2. 为什么是这张作为该型的成长邀请（辅助/劣势功能 × archetype 对齐）
3. **3 个具体成长步骤**（动词开头，可在 24h-30 天内做）—— 示例（INTJ×Magician）：
   - "Pick one half-formed vision and ship its smallest version this week — imperfect, public, real."
   - "Name one resource you already have (skill, network, evidence) that you've been discounting."
   - "Schedule the conversation you've been rehearsing in your head for 30 days — say it out loud."

**硬约束**：
1. M3 growth 牌禁与 M2 primary 牌 archetype 重叠（如 INTJ primary=Hermit 内省，growth=Magician 显化，禁 growth 也是"内省"向）
2. growth 步骤必须是该型独有（INTJ 步骤=显化；ENTP 步骤=聚焦；ENFP 步骤=落地），禁万能"meditate on it"

---

## §9 M8 3 水晶（核心差异化护城河 ⭐⭐⭐）

> **竞品集体扁平**：beanlex 2 颗 / shinepurity 4 颗，全属性堆砌（"Amethyst 平静心灵"），无 why 推导。我们 3 颗各司其职（best_overall 本命 / best_upright 辅助 / best_growth 成长），每颗落 cognitive_stack × archetype 双维匹配。

### 9.1 3 颗水晶的职能分工（从 knowledge `crystals` 字段）

| role | 职能 | 该型逻辑 | 示例（INTJ） |
|---|---|---|---|
| **best_overall** | 本命水晶 = primary 牌 archetype × 主导认知功能 | 该型核心天赋的 companion | Amethyst（Hermit 内省 × Ni 直觉） |
| **best_upright** | 辅助水晶 = 辅助认知功能 | 帮助主导功能更好地显化 | Sodalite（增强 Ti/Te 逻辑清晰度） |
| **best_growth** | 成长水晶 = growth 牌 × 劣势功能激活 | 帮助该型从阴影走向整合 | Carnelian（Magician 显化 × Se 劣势激活） |

### 9.2 反思辅助口径（反复强调，避免玄学承诺）

水晶 = **反思辅助 + 触觉锚**，非改变性格/吸引X 的工具。
- ✅ "Hold Amethyst for five minutes before a strategic thinking session — a tactile cue to drop into Ni's depth rather than Te's reactivity."
- ❌ "Amethyst enhances your intuition and makes you a better INTJ."（玄学承诺）

### 9.3 M8 结构（每颗 1 段，~80-120 词）

1. 该水晶的职能（接 M2/M3）
2. 为什么这颗配该型+该牌（cognitive_stack × archetype 双维匹配，非属性堆砌）
3. 具体使用场景（"hold for 5 min before X" / "place on desk during Y" / "carry to Z"）—— **触觉锚**

**硬约束**：
1. 每颗水晶 slug 来自 knowledge `crystals[].slug`（已是 `{stone}-meaning` 格式，对应 1.crystal-meaning/{stone}-meaning.json），**禁生产中临时换**
2. crystal_role 反思辅助口径，生产时原文采用禁改写为万能论
3. CTA 三级降级（memory `shop-cta-no-deadlink-rule`）：HEAD 检查 knowledge `shop_cta.primary`（/product-category/{stone}-crystals/）→ 200 用主类目；404 → `/shop/?s={stone}` 搜索 → 搜索空 → `/healing-jewelry/` 总
4. 同型 3 颗水晶尽量不重复（除非职能互补）

---

## §10 M9 东方锚点（核心差异化护城河 ⭐⭐⭐）

> **竞品集体空白**：5 篇竞品 0 篇有东方锚点。东方节最薄弱：每篇都能套"Eastern traditions view X as..."万能句。本节用**每型东方锚点 + 该 primary 牌专属意象词强制校验**。

### 10.1 东方锚点来源

从 knowledge `eastern_anchor` 字段（每型独有，2026-07-04 已审）。示例：
- INTJ：藏传佛教"闭关"传统 × Hermit + 紫水晶"菩萨石"（佛珠常用）
- INFP：道家"庄周梦蝶" × The Moon + 月光石"明月之石"
- ENTJ：儒家"内圣外王" × The Emperor + 虎眼石"将军石"
- INFJ：禅宗"默照禅" × High Priestess + 月光石"观音石"

### 10.2 正例公式（4 要素）

**东方锚点 + 型 × 牌张力 + 该牌提醒 + 一个具体行动**

✅ **正例（INTJ，锚点=藏传闭关）**：
> "藏传佛教的'闭关'（retreat）传统与 Hermit 共振——INTJ 的独处不是逃避，而是如喇嘛三年三月闭关般的深度修炼，出关时携带的智慧惠及更多人。紫水晶在东亚传统称'菩萨石'，是佛珠常用材质——持握冥想时，它不是'提升直觉'的魔法石，是闭关时手中那串提醒'内观而非外求'的触觉锚。"

❌ **反例（通用万能句，必打回）**：
> "Eastern traditions view crystals as energy amplifiers that can support your INTJ journey."（无锚点、无该牌专属意象、无行动）

### 10.3 该 primary 牌专属意象词校验（硬约束）

1. M9 东方段必须出现**该 primary 牌专属意象词**（从 tarot-knowledge `eastern_imagery` 取）
   - The Hermit：闭关 / 独照 / 灯笼 / 内观 / 寂静
   - The Magician：显化 / 一以贯之 / 内圣外王
   - The High Priestess：默照 / 阴阳 / 内听 / 玄秘
   - The Emperor：内圣外王 / 爻 / 中正 / 守正
   - The Moon：梦 / 幻 / 月相 / 阴影 / 子时
   - ...（全 22 牌见 tarot-knowledge `eastern_imagery`）
2. 缺该牌专属意象词 → 判通用句打回
3. 东方锚点必须具体（非"Eastern traditions use crystals"万能句）

---

## §11 M10 FAQ（PAA 高意图问题池 + 16 篇规模化防重复）⭐⭐

> 16 篇若 FAQ 自由发挥必重复。本节用**固定问题池**：同结构跨型用相同 8 问（换型名），保证语义一致结构不雷同。

### 11.1 8 问固定池（3 分 benchmark 全 8 问；2 分 6-7 问；1 分 5-6 问）

| # | 问题（{TYPE} / {Primary Card} 替换）|
|---|---|
| 1 | `What tarot card is {TYPE}?`（PAA 高意图，承接主词）|
| 2 | `Why is {Primary Card} the birth card for {TYPE}?`（对齐推导）|
| 3 | `What is the growth card for {TYPE}?`（growth 牌概念）|
| 4 | `What does reversed {Primary Card} mean for {TYPE}?`（shadow 口径）|
| 5 | `Which jungian archetype is {TYPE}?`（PAA 高意图，认知栈角度）|
| 6 | `What are the best crystals for {TYPE}?`（水晶长尾）|
| 7 | `How does the Eastern perspective view {TYPE}?`（东方差异化）|
| 8 | `Is the {TYPE} tarot mapping official MBTI?`（商标 disclaimer 强化）|

**硬约束**：
1. 每篇从池选 5-8 问（3 分全 8 问，2 分 6-7 问，1 分 5-6 问）
2. 答案必须落该型 × 该牌，禁牌义页普适复读
3. 问 8（商标）答案必须原文采用 _meta `mbti_trademark_notice` 核心句

---

## §12 内链配额 + 关联型/牌语义化 ⭐⭐

**每篇固定内链配额**：

| 内链类型 | 数量 | 说明 |
|---|---|---|
| primary 牌义页 | ×1 | `/tarot-{primary-slug}-crystals/`（牌普适页）|
| growth 牌义页 | ×1 | `/tarot-{growth-slug}-crystals/` |
| 同组（Analysts/Diplomats/Sentinels/Explorers）相关型 | ×2-3 | 从 knowledge `related_types` 选（语义关联）|
| 水晶 meaning | ×3 | M8 提到的 3 颗水晶各链 meaning 页 |
| MBTI Hub | ×1 | `/category/mbti-tarot/`（待建，临时 404 OK，按 memory `internal-link-planned-pages-ok-404`）|
| MBTI 工具 | ×1 | `/tools/mbti-tarot/`（待建，临时 404 OK）|

### 12.1 关联型语义矩阵（节选，全 16 型见 knowledge `related_types`）

| 当前型 | 语义关联型（链这 2-3 个） | 关联逻辑 |
|---|---|---|
| INTJ | INTP / INFJ / ENTJ | 同主导 Ni（INTJ/INFJ）+ 同 Analysts（INTP/ENTJ）|
| INFP | INFP / ENFP / INFJ | 同辅助 Ne（INFP/ENFP）+ 同 Diplomats（INFJ）|
| ENTJ | ESTJ / INTJ / ENFJ | 同主导 Te（ENTJ/ESTJ）+ 同 Analysts（INTJ）|
| ESFP | ESTP / ISFP / ENFP | 同主导 Se（ESFP/ESTP）+ 同 Explorers（ISFP）|

**硬约束**：关联型必须从 knowledge `related_types` 选（每型 ≥2 个语义关联），禁随机互链。

---

## §13 通用组件（复用塔罗牌义页/场景框架）

| 组件 | 执行依据 | MBTI 页专属 |
|---|---|---|
| 合规/去AI化 | 塔罗场景框架 §5 + 本框架 §4-§5 | + **§4.1 MBTI 商标 disclaimer 原文照搬** + **§4.2 逆位 growth invitation 口径** |
| CTA 预验证 | 塔罗场景框架 §10 | knowledge `shop_cta` 字段三级降级 + 工具 CTA /tools/mbti-tarot/ |
| Schema | 塔罗场景框架 §14 | Article + FAQPage + BreadcrumbList + ItemList（水晶指 meaning 页，禁 Product）|
| 内链 | §12 配额 + 语义矩阵 | primary/growth 牌义页 ×2 + 同组型 ×2-3 + 水晶 meaning ×3 + MBTI Hub ×1 + 工具 ×1 |
| 图片 | 塔罗场景框架 §14 | hero（型 × primary 牌视觉 + 3 水晶 + 东方锚点元素，1536×864）|
| 免责声明 | §4.1 商标 + §4.2 逆位 | Intro 后商标 disclaimer 原文照搬禁改写 |

---

## §14 数据源（双重，禁生产中自创）⭐⭐⭐

**两份 knowledge 协同**：

| 数据 | 来源 | 用途 |
|---|---|---|
| 16 型 primary/growth 牌 | `mbti-tarot-knowledge.json > types[{TYPE}].birth_cards` | M2/M3 牌映射 |
| 16 型 upright_reading | `mbti-tarot-knowledge.json > types[{TYPE}].upright_reading` | M2 关键意象 |
| 16 型 reversed_shadow | `mbti-tarot-knowledge.json > types[{TYPE}].reversed_shadow` | M4 阴影段 |
| 16 型 3 水晶 | `mbti-tarot-knowledge.json > types[{TYPE}].crystals` | M8 三颗水晶 |
| 16 型 eastern_anchor | `mbti-tarot-knowledge.json > types[{TYPE}].eastern_anchor` | M9 东方段 |
| 16 型 cognitive_stack | `mbti-tarot-knowledge.json > types[{TYPE}].cognitive_stack` | M1/M2 认知栈对齐 |
| 16 型 shop_cta | `mbti-tarot-knowledge.json > types[{TYPE}].shop_cta` | M10 CTA 三级降级 |
| 22 牌 archetype/upright/reversed | `tarot-knowledge.json > cards[i]` | M2/M3 牌 archetype 引用（不复读）|
| 22 牌 eastern_imagery | `tarot-knowledge.json > cards[i].eastern_imagery` | M9 该牌专属意象词校验 |
| 22 牌 crystals（普适） | `tarot-knowledge.json > cards[i].crystals` | 不直接用（MBTI 用型专属 crystals，不混入牌普适）|

**MBTI 水晶 vs 牌义页水晶的差异说明**：
- 牌义页 `tarot-knowledge > cards[i].crystals.best_overall` = 该牌普适水晶（如 Hermit = Labradorite）
- MBTI 页 `mbti-tarot-knowledge > types[{TYPE}].crystals[0]` = 该型专属水晶（如 INTJ×Hermit = Amethyst）
- **差异是合理的**：MBTI 数据按认知栈定制（INTJ 的 Ni 主导 → Amethyst 增强直觉），与牌普适推荐不同
- **生产时只用 MBTI 数据**，不混入牌普适水晶（避免读者困惑"为何 INTJ 推 Amethyst 但 Hermit 推 Labradorite"）

---

## §15 质检关卡（9 关卡 0-8 + 同型 16 篇连读）⭐⭐⭐

> 继承塔罗场景框架 §15 的 9 关卡范式，针对 MBTI 文章调整。**16 篇必须同批生产 + 同型 16 篇连读验关卡 2/3/5/6**（同塔罗场景框架 §18.1）。

- **关卡 0 合规前置门**：grep §4 商标 + §5 禁用表达库；校验 §4.1 商标 disclaimer 原文存在；§5.1 否定教学句上下文判定
- **关卡 1 Intent 锚定**：M2 含该型 × primary 牌独有对齐推导，grep 黑名单通用句；M2 开篇命中 §0 Intent
- **关卡 2 同型 16 篇差异化**：M2 对齐推导逻辑重叠率 < 30%（防 16 篇雷同）；同型连读还须扫 M2 Rider-Waite 投射是否每篇不同画面元素切入 + 开篇句式是否每篇不同
- **关卡 3 跨型 n-gram**：同型跨篇 M2 段落连续 8-gram 重复率 < 15%
- **关卡 4 与牌义页不重复**：M2/M3 不复制 tarot-knowledge archetype 段落（n-gram 比对）
- **关卡 5 语义去重**：同组（Analysts 4 篇 / Diplomats 4 篇 / Sentinels 4 篇 / Explorers 4 篇）M2 embedding 余弦相似度 >0.85 触发复审
- **关卡 6 结构指纹**：模块开场句式 + 论证路径指纹，同组跨型重复率 < 40%；benchmark 档须从下方清单勾选 ≥1 个结构变体
  - [ ] **咨询师引言段**（开篇用"在咨询室里 INTJ 携带 Hermit 常这样出现"视角框架）
  - [ ] **匿名来访者案例段**（化名+节点+双真事实，见 §7.2）
  - [ ] **Myth vs Reality 段**（先列对该型×牌的常见误读，再逐一纠正）
  - [ ] **M4 列表化阴影**（逆位用"three shapes of reversal"列表式：over-isolation / Ni-Fi loop / Se-avoidance 三形态）
  - [ ] **M3 步骤前置**（成长步骤前置，让用户先拿到"怎么办"，M2 能量放其后展开）
  - [ ] **加"常见误读/避坑"段**（独立一节列 2-3 个该型×牌高频误读 + 纠正）
  - [ ] **M9 东方反向破题**（先否定"万能句"如"这不是 Eastern traditions view X as energy amplifier 套话"，再落该牌专属锚点）
- **关卡 7 东方意象词**：M9 含该 primary 牌专属意象词（从 tarot-knowledge 校验）
- **关卡 8 水晶职能分工**：M8 3 颗水晶必须 best_overall/best_upright/best_growth 各 1，禁重复职能；slug 在 1.crystal-meaning/ 存在

**最低成本兜底**：同组 4 篇连读人工抽查"是否同套路换皮"（关卡 5/6 脚本能漏过的结构性雷同）。

---

## §16 生产流程（6 步）

1. **16 型清单**（带 tension 分）：从 mbti-tarot-knowledge 16 型 + 每型打 tension 分（§3）
2. **CTA 预验证**：HEAD 检查每型 `shop_cta.primary`（/product-category/{stone}-crystals/），三级降级写入生产 brief
3. **每篇生成前 Brief**（§2 模板 14 字段）→ 质检门（对齐推导不雷同、行为具体、意象词命中）
4. **AI 填充正文**（按 §6 模块顺序 + §3 张力档词数 + §0 Intent Lens）
5. **9 关质检**（§15）→ 二审 → 图片（hero 型×牌视觉+3 水晶+东方元素）→ upload → **防假完成**（线上抽样验证 img 数/schema/TKD）
6. **同型 4 组 × 4 篇连读**：Analysts（INTJ/INTP/ENTJ/ENTP）/ Diplomats（INFJ/INFP/ENFJ/ENFP）/ Sentinels（ISTJ/ISFJ/ESTJ/ESFJ）/ Explorers（ISTP/ISFP/ESTP/ESFP）四组各 4 篇同批生产 + 连读验关卡 2/3/5/6

### 16.1 同批连读生产硬规则（继承塔罗场景框架 §18.1）

> **同组 4 型必须同一批次生产 + 连读验关卡 2/3/5/6，禁单篇零散产出**。

1. 生产批次 = 同组 4 型同批（Analysts 4 篇 / Diplomats 4 篇 / Sentinels 4 篇 / Explorers 4 篇）
2. 同批 4 篇产出后立即连读跑关卡 2/3/5/6，四关任一不过则 4 篇同批返工
3. M2 Rider-Waite 投射 + 开篇句式 + 投射核心句式三处连读重点扫
4. 跨型连读基准 = mbti-tarot-knowledge 该组 4 型 config
5. 单篇零散产出（如临时补写某型）必须先回读该组其余已有篇，按连读标准自检四关

---

## §17 16 型 Brief（从 knowledge 读字段，本文档略，见 [16型-Brief.md](16型-Brief.md)）

> 16 型 brief 独立成档（避免本框架过长）。每型 brief 14 字段从 mbti-tarot-knowledge.json 提取 + AI 填结构变体。INTJ brief 见试点正文 §1 之前的 Brief 块（本框架试点前置示例）。

---

## §18 QC 清单（独立成档 Checklist-MBTI-文章-QC.md，待建）

> 9 关卡的可勾选清单版本（继承塔罗场景/牌阵框架的 QC 独立档范式）。试点完成后基于试点反馈再建独立 QC 档。

---

## §19 与其他框架边界

| 框架 | 写什么 | 与本框架边界 |
|---|---|---|
| [塔罗牌义页框架](模板-Tarot-牌义页框架.md) | 单牌普适（archetype/画面/三视角）| 本框架讲该牌在某型的具体投射，链回牌义页，不复读 archetype |
| [塔罗场景框架](模板-Tarot-场景文章框架.md) | 单牌 × 单场景（5 场景）| 本框架讲双牌 × 单 MBTI 型，不写 5 场景 |
| [塔罗配对框架](模板-Tarot-配对文章框架.md) | 两牌关系 | 本框架讲 primary+growth 双牌在该型的成长路径，不写两牌普适关系 |
| 水晶 meaning 框架 | 单水晶普适 | 本框架讲 3 颗水晶在该型的职能，链回 meaning 页 |
