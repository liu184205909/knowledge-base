# Minor Arcana 56 张牌义页生产可行性研究

> **结论先行**：值得做，但不是"平移 Major 框架批量复制 56 篇"。Minor 的 SERP 生态与 Major 不同——Major 主题词被 Biddy/Labyrinthos 垄断、我们的切入口是 `crystals for {card}` 交叉长尾（小站合集页低质，独立深度页可排）；**Minor 的水晶交叉长尾 SERP 已被 Crystal Coven / Mystic Doorway 等小站合集页占据，但仍是低质单页（每牌 1 颗水晶 + 2 段），goearthward 用"独立深度页 + 四花色元素骨架 + 首饰 Shop CTA + Eastern"6 差异化可赢**。差异化空间比 Major 更大（竞品更弱），但工作量大（56 张 + 四花色体系 + 数字/宫廷两套差异化逻辑）。建议分两批：先做 16 宫廷牌 + 4 个 Ace（高搜索 + 强商业意图 20 张），验证后排期 36 张数字牌。
>
> **研究范围**：只研究可行性 + 框架改造方向 + 数据层字段设计 + 水晶绑定依据 + 选题优先级。**不生产文章、不定稿框架**（框架等用户审完研究再定）。
> **数据源**：8 词 SERP 实查（serp_check，US/desktop/en）+ 2 标杆页 webReader 抓取（Biddy Two of Wands / Labyrinthos Page of Cups）+ 1 水晶交叉竞品（Crystal Coven Pentacles 合集）+ 390 水晶库 crystal-attributes.json 实查 + Major 框架文档对照。
> **日期**：2026-07-02

---

## 1. SERP 发现（8 词实查汇总）

### 1.1 汇总表

| # | 关键词 | AIO | Featured Snippet | 前 10 主导站点 | 页面类型 | 水晶相关结果 |
|---|---|---|---|---|---|---|
| 1 | two of wands tarot meaning | ✅ 有 | ❌ | Labyrinthos / Biddy / The Tarot Guide / That Oracle Guy / Tarot Merchant / Light Seer's / Chris-Anne | **独立深度页**（每站一牌一页） | ❌ 前 10 无水晶结果 |
| 2 | page of cups meaning | ✅ 有 | ❌ | Labyrinthos / Biddy / The Tarot Guide / That Oracle Guy / Little Red Tarot / Ethony / Keen / HowStuffWorks | **独立深度页** | ❌ 前 10 无水晶结果 |
| 3 | queen of swords reversed meaning | ❌ 无 | ❌ | Labyrinthos / Biddy / The Tarot Guide / Teach Me Tarot / Keen / Elliot Oracle / Sibyl Tarot / Psychic Revelation | **独立深度页**（多站带 reversed 专章） | ❌ 前 10 无水晶 |
| 4 | king of wands love meaning | ✅ 有 | ❌ | Labyrinthos / The Tarot Guide / Tarot Forum / Angelorum / Keen / Elliot Oracle / Sibyl Tarot / Teach Me Tarot / Tarot.com | **独立深度页** + love 子页（Elliot Oracle 有 `/king-of-wands-love/` 独立 URL） | ❌ 前 10 无水晶 |
| 5 | **crystals for ace of pentacles** | ✅ 有 | ❌ | Crystal Reflections / Biddy / **Crystal Coven（合集页）/ Mystic Doorway / Little Red Tarot** / Labyrinthos / Tarot Forum | **合集页 + 独立页混合** | ✅ Crystal Coven 每牌 1 颗、Mystic Doorway 列多颗、nuicobaltdesigns 卖 Ace of Pentacles 主题首饰 |
| 6 | ten of swords meaning | ✅ 有 | ✅ 有（The Tarot Lady） | Labyrinthos / Biddy / Little Red Tarot / The Tarot Guide / That Oracle Guy / Tarot Merchant / Keen / Tarot.com / HowStuffWorks | **独立深度页** | ❌ 前 10 无水晶 |
| 7 | knight of cups meaning | ✅ 有 | ❌ | Labyrinthos / Biddy / Little Red Tarot / The Tarot Guide / Playing Card Decks / That Oracle Guy / Spirituality Health / HowStuffWorks / Learn Tarot / Cosmopolitan | **独立深度页** | ❌ 前 10 无水晶 |
| 8 | three of pentacles meaning | ✅ 有 | ✅ 有（science.howstuffworks） | Labyrinthos / Biddy / The Tarot Lady / The Tarot Guide / That Oracle Guy / Tarot Merchant / Teach Me Tarot / Ethony / Phuture / HowStuffWorks | **独立深度页** | ❌ 前 10 无水晶 |

### 1.2 SERP 生态关键发现

**发现 1 — Minor 主题词（纯牌意）SERP 高度成熟，竞争激烈**：
- 8 词里 6 词（除 #5 水晶交叉词外）前 10 全是 Biddy Tarot / Labyrinthos / The Tarot Guide / That Oracle Guy / Little Red Tarot / Teach Me Tarot / HowStuffWorks 等 DA 60+ 专站**独立深度页**
- 这些站每张 Minor 牌都有独立 URL（如 `biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-wands/two-of-wands/`、`labyrinthos.co/blogs/tarot-card-meanings-list/two-of-wands-meaning-tarot-card-meanings`），且多数带 reversed 专章 + love/career/finances 分段
- **AI Overview 出现率 7/8（87.5%）**，Featured Snippet 2/8 —— Google 已将 Minor 牌意视为"已解决问题"，新站纯牌意主题词几乎排不进
- **结论**：与 Major 一样，**纯牌意主题词（`{card} meaning`）不做**，竞争烈度等同 Major

**发现 2 — 水晶交叉长尾（`crystals for {card}`）是蓝海，但已有小站占位**：
- 词 #5 `crystals for ace of pentacles`：前 10 出现 Crystal Coven（pentacles 合集单页，每牌 1 颗水晶 2 段）、Mystic Doorway（列 Ruby/Mookaite/Garnet 等多颗）、Little Red Tarot（提及 pentacles=earth 故 crystals 通配）、nuicobaltdesigns（卖 Ace of Pentacles 主题 amethyst 首饰）
- **生态位判定**：与小站合集页直接竞争，竞品弱（Crystal Coven 每牌只 1 颗水晶 + 2 段，无首饰 Shop、无 Eastern、无 reversed 水晶、无 yes/no）—— **goearthward 同生态位靠"独立深度页 + 5 角色水晶分层 + 首饰 Shop + Eastern + 四花色元素骨架"可赢**，差异化空间比 Major 更大（竞品更弱）
- **但**：水晶交叉词的搜索量远低于纯牌意词（相关搜索里 `crystals for ace of pentacles` 不在主流 PAA/related，主流是 `meaning / yes or no / love / reversed`）—— **流量天花板低于 Major**

**发现 3 — 高商业意图长尾清晰**：
- 8 词的 related searches 高频出现：`{card} yes or no` / `{card} love` / `{card} reversed` / `{card} as feelings` / `{card} as a person` / `{card} spiritual meaning`
- Elliot Oracle 已做 `{card}-love/` `{card}-reversed/` 独立子 URL —— 证实 love/reversed 是可独立优化的高转化长尾
- **宫廷牌（Page/Knight/Queen/King）的 `as feelings` / `as a person` 长尾特别强**（词 #2/#4/#7 的 related 都密集出现）—— 宫廷牌天然带人物 archetype，是差异化重点

**发现 4 — 数字牌 10 是搜索热点**：
- 词 #6 `ten of swords meaning` 前 10 含 Featured Snippet（The Tarot Lady）+ AIO，竞争最烈 —— "10"= 圆满/终结，搜索量高（与 Major 的 Death/Tower 同类情绪牌）
- 数字牌里 7（挑战）/10（圆满）搜索热度高于 2-6 —— 排优先级时靠后

**发现 5 — 纯塔罗站无水晶，水晶站无 Minor 深度页**：
- Biddy/Labyrinthos（牌意权威）**完全无水晶段** —— 我们的水晶交叉页与它们不正面竞争，吃的是"用户既查牌意又想配水晶"的交叉需求
- The Crystal Council（Major 做了 10+ 牌义页）**Minor 0 张**（确认旧策略记录的"Minor 空白"）
- Crystal Coven 做了 Pentacles 全 14 张水晶映射，但**单合集页 + 每牌 1 颗 + 2 段**，深度严重不足

---

## 2. 标杆 Minor 页结构拆解（2 个深度抓取）

### 2.1 Biddy Tarot — Two of Wands（数字牌标杆）

**URL**：`biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-wands/two-of-wands/`
**词数估算**：约 900-1100 词（中等深度，比 Major 框架 1800-2500 短）
**结构（H2 模块清单）**：
1. `Two of Wands Keywords`（Upright 4 词 + Reversed 4 词，bullet 列表）
2. `Two of Wands Description`（Rider-Waite 画面描述，~150 词，写红袍男子持 globe、城堡、两根 wand、背景肥沃岩石地）
3. `Two of Wands Upright`（~250 词，4 段：Ace 火花→行动计划 / 探索选项 / 长期目标 / Twos=决定）
4. `Two of Wands Reversed`（~250 词，4 段：内在聚焦 / 缺策略 / 十字路口 / 不愿走出舒适区）

**特有点（vs Major 框架）**：
- ❌ **无水晶段**（Biddy 全站无水晶）
- ❌ **无 yes/no**（但 The Embroidered Forest 同词排名 #16 明确写 "strong yes card upright"）
- ❌ **无 love/career 分段**（Biddy 把 love 拆到独立子页或不写）
- ✅ **Keywords 顶部速答**（Upright/Reversed 各 4 词， Featured Snippet bait）
- ✅ **Description 段写 Rider-Waite 画面**（与 Major M2 同源）
- ✅ **Twos in Tarot 代表 decisions**（数字 progression 提及，但未系统化）

### 2.2 Labyrinthos — Page of Cups（宫廷牌标杆）

**URL**：`labyrinthos.co/blogs/tarot-card-meanings-list/page-of-cups-meaning-tarot-card-meanings`
**词数估算**：约 1800-2200 词（深度，与 Major 框架同量级）
**结构（H2 模块清单）**：
1. `Page of Cups Keywords`（Upright 7 词 + Reversed 7 词）
2. `Page of Cups Tarot Card Description`（~150 词，海岸少年、蓝 tunica、金色 cup、鱼跳出 cup）
3. `Upright Page of Cups Meaning`（~200 词，直觉灵感 / 创造性呼唤 / 释放情感）
4. **`Upright Love Meaning` / `Upright Career Meaning` / `Upright Finances Meaning`**（3 个并行 H3，每个 ~120 词）⭐
5. `Upright Page of Cups as Feelings`（~120 词）⭐
6. `Upright Page of Cups as Actions`（~120 词）⭐
7. `Page of Cups Reversal Meaning`（~200 词）
8. **`Reversed Love / Career / Finances Meaning`**（3 个并行 H3）⭐
9. `Reversed Page of Cups as Feelings` / `as Actions`（~120 词 each）⭐

**特有点（vs Major 框架）**：
- ❌ **无水晶段**
- ✅ **Love / Career / Finances 三段并行**（正位 + 逆位各一套 = 6 段，宫廷牌重点）
- ✅ **as Feelings / as Actions**（宫廷牌独有，因宫廷牌代表人物）
- ✅ **Keywords 7 词更丰富**（比 Biddy 4 词多）

### 2.3 Minor 页 vs Major 框架的差异总结

| 维度 | Major 框架（现有） | Minor 标杆（Biddy/Labyrinthos） | Minor 特有需补充 |
|---|---|---|---|
| 水晶段 | ⭐核心（5 角色 H3） | ❌ 无 | **我们独有差异化**（强化做） |
| Love/Career/Finances 分段 | M7 三视角（非 love/career） | ⭐Labyrinthos 6 段并行 | **Minor 需补 love/career/finances**（高搜索） |
| yes/no | M11 FAQ 一问 | The Embroidered Forest 明确做 | **Minor 需独立 yes/no 段**（related search 高频） |
| 逆位专章 | M3 | ✅ Biddy/Labyrinthos 都有 | 复用 Major M3 |
| 元素/花色解说 | M8 Eastern（非元素） | ❌ 无系统 | **Minor 需独立"花色×元素"段**（四花色骨架） |
| 数字 progression | ❌ 无 | Biddy 提一句"Twos=decisions" | **Minor 数字牌需独立 progression 段** |
| 宫廷 archetype | ❌ 无 | Labyrinthos as Feelings/Actions | **Minor 宫廷牌需独立"人物 archetype"段** |
| as feelings / as a person | ❌ 无 | ⭐宫廷牌高频长尾 | **宫廷牌独有**（差异化主力） |

---

## 3. Major→Minor 框架改造方案

### 3.1 模块复用 / 改造清单

| Major 模块 | Minor 处置 | 改造要点 |
|---|---|---|
| Intro + Hero | ✅ 复用 | 不变 |
| M1 TL;DR | ✅ 复用 | 加 yes/no 速答（Minor 高搜索） |
| M2 Upright | ✅ 复用 | 落到该牌 Rider-Waite 画面 + 花色元素基调 |
| M3 Reversed | ✅ 复用 | 不变（合规口径不变） |
| **M4 Crystals（5 角色）** | ✅ 复用 + **强化** | Minor 核心差异化（竞品无），5 角色不变，但选水晶逻辑加"花色元素映射" |
| M5 How to Use | ✅ 复用 | 不变 |
| M6 Reversed Crystals | ✅ 复用 | 不变 |
| M7 Three-Perspective | 🔄 改造 | **拆成"Love/Career/Finances 三段"**（对标 Labyrinthos，高搜索）+ 心理学维度保留 |
| M8 Eastern | ✅ 复用 | 不变（护城河） |
| M9 Shop CTA | ✅ 复用 | 不变 |
| M10 Mini Spread | ✅ 复用 | 不变 |
| M11 FAQ | ✅ 复用 | 加 yes/no / as feelings / as a person 问题（Minor 长尾） |
| M12 Related | ✅ 复用 | 不变 |
| **新增 M-Suit 花色×元素段** | ➕ 新增 | **Minor 独有**：解释该牌所属花色（Wands 火/Cups 水/Swords 风/Pentacles 土）的元素象征 + 该花色主题（激情/情感/心智/物质） |
| **新增 M-Progression（数字牌）** | ➕ 新增 | **数字牌独有**：1-10 progression 含义（Ace 起点 / 2 决定 / 3 协作 / 4 稳固 / 5 冲突 / 6 和谐 / 7 反思 / 8 精进 / 9 圆满前夜 / 10 终结转化） |
| **新增 M-Archetype（宫廷牌）** | ➕ 新增 | **宫廷牌独有**：人物 archetype（Page 学徒 / Knight 行动 / Queen 掌控 / King 精通）+ as feelings / as a person 段 |

### 3.2 16 宫廷牌差异化重心表（防模板感）

> 宫廷牌 4 角色 × 4 花色 = 16 个差异化重心。每张牌的 archetype 必须落到"角色 × 花色"的交叉，禁 16 篇只换花色名。

| 角色 \ 花色 | Wands（火/激情行动） | Cups（水/情感直觉） | Swords（风/心智思辨） | Pentacles（土/物质实务） |
|---|---|---|---|---|
| **Page（学徒/萌芽）** | The Spark-Seeker（探索热情的学徒）| The Dreamer（直觉萌芽的少年）| The Curious Mind（求知的好奇者）| The Apprentice（务实的学习者）|
| **Knight（行动/追求）** | The Adventurer（冲动的冒险骑士）| The Romantic（浪漫的追求者）| The Truth-Seeker（思辨的真相骑士）| The Steady Plodder（坚毅的实干骑士）|
| **Queen（掌控/内化）** | The Magnetic Leader（魅力的掌控者）| The Compassionate Heart（慈悲的情感女王）| The Clear-Eyed Judge（清醒的思辨女王）| The Nurturing Provider（滋养的物质女王）|
| **King（精通/外化）** | The Visionary Founder（远见的精通者）| The Emotional Master（情感的精通者）| The Principled Authority（原则的权威）| The Master of Manifestation（物质的精通者）|

**每张宫廷牌的 M-Archetype 必须写**：
- 角色阶段（学徒→行动→掌控→精通的能量层级）
- 花色基调（火/水/风/土如何在这个角色上表达）
- as feelings（这张牌代表一个人时，他对你的感觉是什么）
- as a person（这张牌描述什么样的人格特质）
- shadow（逆位时这个角色如何走偏）

### 3.3 40 数字牌 progression 表（1-10 通用骨架 + 四花色变体）

> 40 数字牌 = 4 花色 × 10 数字。数字 1-10 有通用 progression 骨架，再 × 四花色变体 = 40 个差异化重心。

| 数字 | 通用 progression | Wands（火）变体 | Cups（水）变体 | Swords（风）变体 | Pentacles（土）变体 |
|---|---|---|---|---|---|
| **Ace（1）起点** | 火花/种子/新机会 | 热情火花 / 创造灵感 | 情感觉醒 / 爱萌芽 | 心智突破 / 清晰洞察 | 物质机会 / 财务新起点 |
| **2 决定/平衡** | 选择/伙伴/二元 | 计划未来 / 跨出舒适区 | 妥协 / 吸引 / 和解 | 僵局 / 回避 / 脆弱休战 | 平衡资源 / 灵活调度 |
| **3 协作/首批成果** | 合作 / 创造 / 表达 | 扩展 / 远见布局 | 庆祝 / 友谊 / 创造表达 | 心碎 / 分离 / 悲伤（**Swords 3 是例外**）| 团队 / 学徒 / 协作建造 |
| **4 稳固/停滞** | 基础 / 占有 / 休整 | 庆祝 / 短暂休战 | 冷漠 / 厌倦 / 回避 | 静修 / 复原 / 暂停 | 占有 / 稳定 / 守财 |
| **5 冲突/挑战** | 失序 / 竞争 / 贫乏 | 竞争 / 冲突 / 内斗 | 失去 / 怀旧 / 遗憾 | 冲突 / 局限 / 受害者心态 | 贫乏 / 困难 / 被排斥 |
| **6 和谐/给予** | 平衡 / 互助 / 胜利 | 胜利 / 公认 / 回报 | 怀旧 / 路径 / 和谐 | 脱离 / 顺风 / 渡过 | 慷慨 / 给予 / 互助 |
| **7 反思/评估** | 等待 / 策略 / 防御 | 捍卫立场 / 坚守 | 幻想 / 选择 / 迷惑 | 欺骗 / 策略 / 迷失方向 | 耐心 / 评估 / 等待收成 |
| **8 精进/迁移** | 专注 / 速度 / 深造 | 迅速 / 行动 / 前进 | 离开 / 远离 / 转身 | 束缚 / 限制 / 困局 | 精进 / 工艺 / 熟练 |
| **9 圆满前夜** | 独立 / 自足 / 警觉 | 坚韧 / 边界 / 防御 | 满足 / 独立 / 丰盛 | 焦虑 / 失眠 / 担忧（**Swords 9 著名阴影**）| 自足 / 丰盛 / 独立 |
| **10 终结/转化** | 圆满 / 过载 / 传承 | 承载 / 压力 / 传承 | 情感和睦 / 家族圆满 | 终结 / 谷底 / 转化黎明 | 传承 / 财富 / 家族 |

**关键差异化点**：
- **Swords 3 / Swords 9 / Swords 10** 是塔罗著名"阴影牌"（心碎/焦虑/谷底），逆位段需特别谨慎（守 M3 合规口径，不写"诅咒"）
- **Pentacles 全系偏正面**（物质/丰盛主题），商业价值高（与 Shop CTA 协同强）
- **Cups 全系偏情感**（与 rose-quartz 系水晶天然绑定）
- **Wands 全系偏行动/激情**（与火元素水晶 carnelian/citrine/tiger-eye 绑定）

---

## 4. Minor 数据层 json 字段设计

### 4.1 字段结构（扩展自 Major tarot-knowledge.json）

```json
{
  // === Major 复用字段 ===
  "slug": "two-of-wands",
  "name": "Two of Wands",
  "archetype": "The Planner at the Threshold",   // 每牌独有 archetype
  "upright_keywords": [...],
  "reversed_keywords": [...],
  "upright_meaning": "...",
  "reversed_meaning": "...",
  "psychological_lens": "...",
  "eastern_anchor": "...",
  "recommended_practice": "...",
  "crystals": {
    "best_overall": {...}, "best_upright": {...},
    "best_reversed": {...}, "best_love": {...},
    "best_daily_wear": {...}
  },
  "chakra": "...",
  "related_cards": [...],
  "source_notes": "...",

  // === Minor 专属字段（新增）===
  "arcana": "minor",                              // 区分 major/minor
  "suit": "wands",                                // wands/cups/swords/pentacles
  "suit_element": "fire",                         // fire/water/air/earth
  "suit_theme": "passion / action / creativity",  // 花色主题一句话
  "card_type": "number",                          // number / court
  "number_or_rank": 2,                            // 数字牌 1-10 / 宫廷牌 page=11,knight=12,queen=13,king=14

  // 数字牌专属（card_type=number 时填）
  "progression_meaning": "decision / planning / crossroads",  // 数字 progression
  "progression_position": "2 = the moment of choosing direction after the Ace's spark",

  // 宫廷牌专属（card_type=court 时填）
  "court_role": null,                             // page/knight/queen/king
  "court_archetype": null,                        // 角色阶段 archetype
  "as_feelings": null,                            // 这张牌代表一个人时他对你的感觉
  "as_person": null,                              // 这张牌描述什么人格

  // === Minor 高搜索长尾字段（新增，供 FAQ/yes-no 工具复用）===
  "yes_no": "yes",                                // upright yes/no/maybe
  "yes_no_reversed": "maybe",                     // reversed yes/no/maybe
  "love_meaning": "...",                          // 独立 love 段（对标 Labyrinthos）
  "career_meaning": "...",                        // 独立 career 段
  "finances_meaning": "...",                      // 独立 finances 段
  "love_meaning_reversed": "...",
  "career_meaning_reversed": "...",
  "finances_meaning_reversed": "..."
}
```

### 4.2 样例 1 — Two of Wands（数字牌）

```json
{
  "slug": "two-of-wands",
  "name": "Two of Wands",
  "arcana": "minor",
  "suit": "wands",
  "suit_element": "fire",
  "suit_theme": "passion / action / creativity / will",
  "card_type": "number",
  "number_or_rank": 2,
  "archetype": "The Planner at the Threshold",
  "progression_meaning": "decision / future planning / crossroads",
  "progression_position": "2 = the moment of choosing direction after the Ace's spark; turning inspiration into a plan",
  "upright_keywords": ["future planning","progress","decisions","discovery","planning horizon"],
  "reversed_keywords": ["fear of unknown","lack of planning","personal goals","inner alignment","playing safe"],
  "upright_meaning": "The figure in the red robe stands at the battlement of his castle, holding a small globe...（Rider-Waite 画面：红袍男子、城堡、两根 wand、手中 globe、肥沃岩石地）。The Two of Wands takes the spark of the Ace and asks: now where? ...",
  "reversed_meaning": "Reversed, the Two of Wands turns the gaze inward. The plan dissolves; the globe falls from your hand...（shadow aspect：恐惧未知 / 拒绝跨出舒适区 / 大鱼小池）",
  "psychological_lens": "future orientation vs avoidance; implementation intention",
  "eastern_anchor": "In Tibetan Buddhist practice, the energy of the Two of Wands resonates with the stage of practice called lam-rim (the graduated path) — clear mapping of the journey before setting out. Clear Quartz, historically called 'bosatsu-seki' (菩萨石, the Bodhisattva stone) in East Asian tradition, pairs naturally with this clarifying, path-mapping quality.",
  "recommended_practice": "Hold a clear quartz point and name one direction you've been hesitating to commit to; speak one concrete next step aloud.",
  "yes_no": "yes",
  "yes_no_reversed": "maybe",
  "love_meaning": "In love readings, the Two of Wands suggests you're weighing a relationship's long-term horizon. If single, you may be deciding whether to step toward someone or stay comfortable as you are.",
  "career_meaning": "In career readings, this card signals you're planning your next professional move — possibly a career switch, further education, or overseas expansion.",
  "finances_meaning": "For finances, the Two of Wands encourages long-term financial planning and exploring investment horizons beyond your immediate comfort zone.",
  "love_meaning_reversed": "Reversed in love, hesitation or fear of commitment may be keeping you in a comfort zone; reassess whether your current path aligns with your deeper values.",
  "career_meaning_reversed": "Reversed in career, you may be working haphazardly without a clear strategy; go back to your original intention.",
  "finances_meaning_reversed": "Reversed in finances, beware of clinging to what's familiar instead of exploring better opportunities.",
  "crystals": {
    "best_overall": {"slug": "citrine", "name": "Citrine", "reason": "Citrine's Fire element + abundance/motivation Intentions resonate with Two of Wands' fire-suit planning energy and forward-looking horizon.", "source": "element-match + Crystal Coven fire-suit consensus"},
    "best_upright": {"slug": "aventurine", "name": "Green Aventurine", "reason": "Opportunity/growth Intentions amplify the card's discovery of new territories.", "source": "Crystal Coven pentacles-pattern"},
    "best_reversed": {"slug": "smoky-quartz", "name": "Smoky Quartz", "reason": "Grounding through fear of unknown; release hesitation to step out.", "source": "earth-grounding consensus"},
    "best_love": {"slug": "rose-quartz", "name": "Rose Quartz", "reason": "Cross-card unified love intention.", "source": "house-standard"},
    "best_daily_wear": {"slug": "tiger-eye", "name": "Tiger's Eye", "reason": "Courage/confidence Intentions support daily decision-making.", "source": "fire-suit consensus"}
  },
  "chakra": "Solar Plexus",
  "related_cards": ["three-of-wands", "ace-of-wands", "the-magician"],
  "related_reason": "Two of Wands sits between Ace's spark and Three's expansion; Magician (Major 1) shares manifestation theme.",
  "source_notes": "Crystal Coven (pentacles pattern reference) does not cover Two of Wands; fire-suit crystal consensus from element-mapping: Citrine (Fire/Abundance) primary. Biddy/Labyrinthos do not list crystals."
}
```

### 4.3 样例 2 — Page of Cups（宫廷牌）

```json
{
  "slug": "page-of-cups",
  "name": "Page of Cups",
  "arcana": "minor",
  "suit": "cups",
  "suit_element": "water",
  "suit_theme": "emotion / intuition / relationship / creativity of the heart",
  "card_type": "court",
  "number_or_rank": 11,
  "court_role": "page",
  "court_archetype": "The Dreamer — the apprentice of feeling, the inner child awakening to its emotional world",
  "archetype": "The Dreamer",
  "upright_keywords": ["creative message","intuition","sensitivity","curiosity","inner child","new emotional beginning"],
  "reversed_keywords": ["emotional immaturity","escapism","insecurity","creative block","daydreaming without action"],
  "upright_meaning": "A youth at the seashore in a blue floral tunic holds a golden cup; a fish pops out to greet her, like a message from a fairytale.（Rider-Waite 画面：海岸少年、蓝 tunica、金 cup、跃出的鱼）The Page of Cups is the suit's apprentice — the part of you that is just beginning to listen to feeling... ",
  "reversed_meaning": "Reversed, the Page's dreaminess curdles into avoidance. Sensitivity becomes withdrawal; the inner child acts out instead of plays.",
  "psychological_lens": "openness to experience + affective forecasting; the beginner's mind in emotional life",
  "eastern_anchor": "The fish emerging from the cup echoes the Eastern image of the lotus rising from muddy water — something emerging from the depths of the unconscious into form. Moonstone, sacred in both Indian and East Asian traditions as a stone of the moon's reflective, receptive principle (Chandra/Soma), pairs naturally with this page's watery, intuitive quality.",
  "recommended_practice": "Before sleep, hold a moonstone and ask your unconscious one question you've been avoiding; record whatever surfaces in the morning.",
  "court_role_meaning": "Page = the apprentice phase of the suit — learning the element's language, receptive, beginner's mind, not yet skilled at wielding it.",
  "as_feelings": "If Page of Cups represents how someone feels about you: they feel a tender, curious, slightly awkward budding attraction — like a crush in its earliest stirrings, more poetry than plan.",
  "as_person": "As a person, the Page of Cups is someone youthful (in age or in spirit), imaginative, sensitive, possibly artistically gifted but emotionally unpracticed — they feel before they understand.",
  "yes_no": "yes",
  "yes_no_reversed": "maybe",
  "love_meaning": "In love, the Page of Cups heralds a tender new beginning — a message, a confession, a small romantic gesture. If single, someone may approach with gentle, slightly nervous interest.",
  "career_meaning": "In career, this card points to creative fields — art, music, poetry, fashion — or a fresh creative impulse entering your current work. Watch for daydreaming without follow-through.",
  "finances_meaning": "For finances, the Page can signal unrealistic financial daydreams; ground your goals in achievable steps rather than hoping for windfalls.",
  "love_meaning_reversed": "Reversed in love, emotional immaturity or shyness may be blocking connection; insecurity rather than genuine disinterest.",
  "career_meaning_reversed": "Reversed in career, creative blocks or letting emotions interfere with professionalism.",
  "finances_meaning_reversed": "Reversed in finances, denial about financial reality; avoidance of money decisions.",
  "crystals": {
    "best_overall": {"slug": "moonstone", "name": "Moonstone", "reason": "Moonstone's Water element + intuition/new beginnings Intentions match Page of Cups' watery, dreamy, intuitive-messenger archetype.", "source": "element-match + water-suit consensus"},
    "best_upright": {"slug": "aquamarine", "name": "Aquamarine", "reason": "Water/Throat — gentle communication of feeling; amplifies the page's message-bearing quality.", "source": "water-suit consensus"},
    "best_reversed": {"slug": "rhodochrosite", "name": "Rhodochrosite", "reason": "Inner child / self-worth healing for the page's reversed emotional immaturity.", "source": "court-card shadow consensus"},
    "best_love": {"slug": "rose-quartz", "name": "Rose Quartz", "reason": "Cross-card unified love intention.", "source": "house-standard"},
    "best_daily_wear": {"slug": "blue-lace-agate", "name": "Blue Lace Agate", "reason": "Calm gentle expression — wearable emotional openness.", "source": "water-suit consensus"}
  },
  "chakra": "Third Eye, Heart",
  "related_cards": ["knight-of-cups", "ace-of-cups", "the-high-priestess"],
  "related_reason": "Page→Knight progression in Cups; Ace of Cups is the suit's source; High Priestess shares the unconscious/intuitive theme.",
  "source_notes": "Page of Cups crystals mapped from Water-suit consensus (Moonstone/Aquamarine/Blue Lace Agate all Water-element in 390 library); Biddy/Labyrinthos do not list crystals. Labyrinthos keywords (upright 7 + reversed 7) used as keyword source."
}
```

---

## 5. 四花色 × 水晶绑定体系（带依据）

### 5.1 四花色 × 元素 × 水晶主映射表

> **依据来源**：390 水晶库 `crystal-attributes.json > overview.Element / Intentions / Chakra`（实查，非通识）+ Crystal Coven Pentacles 14 张水晶映射（业界共识基准）+ 与 Major 框架四源逻辑一致（元素 + 首饰适配 + 平价 + 不抄单一源）。

| 花色 | 元素 | 花色主题 | 主推水晶（3-5 颗，按 best_overall 优先） | 依据（库内 Element/Intentions） |
|---|---|---|---|---|
| **Wands** | 🔥 Fire | 激情 / 行动 / 创造 / 意志 | **Carnelian**（Fire / Courage Motivation Creativity）<br>**Citrine**（Fire / Abundance Confidence Motivation）<br>**Tiger's Eye**（Fire / Courage Confidence Protection）<br>**Sunstone**（Fire / Confidence Joy Warmth）<br>**Garnet**（Fire / Protection Passion Energy Commitment） | 全部库内 Element=Fire，Intentions 命中 Wands 行动/激情主题 |
| **Cups** | 💧 Water | 情感 / 直觉 / 关系 / 心之创造 | **Rose Quartz**（Earth 但 Heart/love — 跨花色统一）<br>**Moonstone**（Water / Intuition New beginnings Calm）<br>**Aquamarine**（Water / Courage Communication Calm）<br>**Blue Lace Agate**（Water / Calm communication Soothing）<br>**Rhodochrosite**（Fire+Water / Self-Love Compassion Inner Child）<br>**Labradorite**（Water / Transformation Intuition Protection） | 全部库内 Element=Water（Rose Quartz 例外，Heart/love 跨花色统一） |
| **Swords** | 💨 Air | 心智 / 思辨 / 沟通 / 真相 | **Amethyst**（Air / Calm Spiritual awareness Protection）<br>**Selenite**（Air / Clarity Cleansing Calm）<br>**Sodalite**（Air / Clarity Logic Honesty）<br>**Lapis Lazuli**（Air / Wisdom Truth Inner vision）<br>**Angelite**（Air / Calm Communication Gentleness）<br>**Fluorite**（Air / Focus Clarity Decision） | 全部库内 Element=Air，Intentions 命中 Swords 心智/真相主题 |
| **Pentacles** | 🌍 Earth | 物质 / 丰盛 / 实务 / 身体 | **Green Aventurine**（Earth / Opportunity Growth Confidence）⭐Crystal Coven 主推<br>**Red Jasper**（Earth / Grounding Strength Endurance）<br>**Hematite**（Earth / Grounding Protection Strength）<br>**Pyrite**（Fire 但 Abundance — 财务特化）<br>**Jade**（Earth / Harmony Wisdom Good fortune）<br>**Tiger's Eye**（Fire 但财富保护 — Crystal Coven King of Pentacles 推荐） | 库内 Element=Earth 为主；Pyrite/Tiger's Eye 虽 Fire 但 Intentions 命中 Pentacles 物质/丰盛主题（Crystal Coven 业界共识） |

### 5.2 16 宫廷牌 × 水晶绑定表（每牌 1-2 颗 best_overall）

> 逻辑：court_role（角色阶段）× suit_element（花色元素）双维选水晶。角色阶段决定水晶的"成熟度"（Page=萌芽接收型 / Knight=行动输出型 / Queen=掌控内化型 / King=精通外化型）。

| 宫廷牌 | best_overall | 备选 | 依据（角色 × 花色） |
|---|---|---|---|
| **Page of Wands** | Carnelian | Sunstone | 火 + 学徒 = 热情火花刚点燃，Carnelian 是行动勇气的 Starter 石 |
| **Knight of Wands** | Carnelian | Tiger's Eye | 火 + 行动 = 冲锋冒险，Carnelian 促行动 / Tiger's Eye 护勇 |
| **Queen of Wands** | Sunstone | Carnelian | 火 + 掌控 = 魅力自信，Sunstone 的 Joy/Confidence 配磁性领导力 |
| **King of Wands** | Tiger's Eye | Citrine | 火 + 精通 = 远见领导，Tiger's Eye 的 Courage/Protection 配 Founder archetype |
| **Page of Cups** | Moonstone | Aquamarine | 水 + 学徒 = 直觉萌芽，Moonstone 是直觉/新开始的 Starter 石 |
| **Knight of Cups** | Aquamarine | Rose Quartz | 水 + 行动 = 浪漫追求，Aquamarine 的情感沟通配 Romantic |
| **Queen of Cups** | Rose Quartz | Moonstone | 水 + 掌控 = 慈悲情感，Rose Quartz 的 Compassion 配情感女王 |
| **King of Cups** | Lapis Lazuli | Aquamarine | 水 + 精通 = 情感平衡的权威（Lapis 第三眼+喉，理性掌情感）|
| **Page of Swords** | Sodalite | Fluorite | 风 + 学徒 = 求知好奇，Sodalite 的 Logic/Honesty 配 Curious Mind |
| **Knight of Swords** | Selenite | Amethyst | 风 + 行动 = 真相骑士冲锋，Selenite 的 Clarity 配真相追击 |
| **Queen of Swords** | Lapis Lazuli | Sodalite | 风 + 掌控 = 清醒判断，Lapis 的 Wisdom/Truth 配 Clear-Eyed Judge |
| **King of Swords** | Lapis Lazuli | Sodalite | 风 + 精通 = 原则权威，Lapis 的 Wisdom/Inner vision 配 Principled Authority |
| **Page of Pentacles** | Green Aventurine | Jade | 土 + 学徒 = 务实学习，Aventurine 的 Opportunity/Growth 配 Apprentice（Crystal Coven 共识）|
| **Knight of Pentacles** | Hematite | Red Jasper | 土 + 行动 = 坚毅实干，Hematite 的 Grounding/Strength 配 Steady Plodder（Crystal Coven 共识）|
| **Queen of Pentacles** | Green Aventurine | Rose Quartz | 土 + 掌控 = 滋养丰盛，Aventurine 的 Growth/Abundance 配 Nurturing Provider（Crystal Coven 共识）|
| **King of Pentacles** | Tiger's Eye | Pyrite | 土 + 精通 = 物质精通，Tiger's Eye 的 Strength/Clarity/Determination 配 Master of Manifestation（Crystal Coven 共识）|

**依据强度说明**：
- **Pentacles 14 张**：Crystal Coven 给出全套水晶映射（Aventurine/Carnelian/Citrine/Red Jasper/Tiger's Eye/Hematite），是业界最完整共识 → 我们直接采用并扩展
- **Wands / Cups / Swords 水晶**：Crystal Coven 未做（只做了 Pentacles），我们的映射基于 390 库 `overview.Element` 严格匹配（Fire→Carnelian/Citrine/Sunstone/Garnet；Water→Moonstone/Aquamarine/Blue Lace Agate；Air→Amethyst/Selenite/Sodalite/Lapis），是元素骨架自洽推导，**非凭 AI 通识编**

---

## 6. 56 张选题优先级（top 20 先做清单）

### 6.1 排序维度

1. **搜索量**（SERP 前 10 站点密度 + AIO/Featured Snippet 出现率，越高越热）
2. **商业价值**（love/yes-no/career 意图强 → Shop CTA 转化好）
3. **竞争度**（独立深度页少 / Featured Snippet 缺 = 机会窗）
4. **与现有 Major 内链协同**（与已上线的 23 Major 牌义页互链密度）
5. **水晶绑定商业价值**（Pentacles 全系偏物质 → Shop；Cups 全系偏情感 → Rose Quartz 主推线）

### 6.2 Top 20 先做清单

| 排名 | 牌 | 类型 | 主关键词 | 优先理由 |
|---|---|---|---|---|
| 1 | **Ace of Cups** | 数字/水 | ace of cups meaning / crystals for ace of cups | 搜索热（情感起点）+ 水晶交叉蓝海 + Rose Quartz 主推线协同 |
| 2 | **Ten of Swords** | 数字/风 | ten of swords meaning | **Featured Snippet + AIO 双占**（最高搜索热）+ 阴影牌需权威解读（合规口径赢） |
| 3 | **Queen of Wands** | 宫廷/火 | queen of wands as a person / as feelings | 宫廷 `as feelings/person` 长尾极强 + Sunstone 主推 + 与 Major Strength/Emperor 互链 |
| 4 | **King of Pentacles** | 宫廷/土 | king of pentacles love / as a person | 商业价值最高（物质精通）+ Tiger's Eye 主推 + Crystal Coven 共识水晶 |
| 5 | **King of Wands** | 宫廷/火 | king of wands love meaning | 词 #4 实查 SERP 前 10 最热 + AIO + love 长尾 + Tiger's Eye 主推 |
| 6 | **Queen of Swords** | 宫廷/风 | queen of swords reversed meaning | 词 #3 实查（reversed 长尾独立搜索）+ Lapis 主推 + 独立女性 archetype |
| 7 | **Knight of Cups** | 宫廷/水 | knight of cups meaning | 词 #7 实查 SERP 前 10 极热 + 浪漫 archetype + Aquamarine 主推 |
| 8 | **Page of Cups** | 宫廷/水 | page of cups meaning | 词 #2 实查 SERP 前 10 极热 + Moonstone 主推（直觉/新开始） |
| 9 | **Ace of Pentacles** | 数字/土 | crystals for ace of pentacles | 词 #5 实查（水晶交叉长尾，已有小站占位但弱）+ 物质丰盛 + Aventurine 主推 |
| 10 | **Three of Pentacles** | 数字/土 | three of pentacles meaning | 词 #8 实查 Featured Snippet + 团队协作 + Crystal Coven Carnelian 共识 |
| 11 | **Ace of Wands** | 数字/火 | ace of wands meaning | Ace 系列起点（火）+ Carnelian 主推 + 与 Major Magician/Fool 互链 |
| 12 | **Ace of Swords** | 数字/风 | ace of swords meaning | Ace 系列（风）+ 心智突破 + Selenite 主推 + 与 Major Justice 互链 |
| 13 | **Seven of Pentacles** | 数字/土 | seven of pentacles meaning | 耐心/收成主题 + Crystal Coven Aventurine 共识 + 与 Major Wheel/Hermit 互链 |
| 14 | **Eight of Pentacles** | 数字/土 | eight of pentacles meaning | 工艺/精进 + Crystal Coven Tiger's Eye 共识 + 手作首饰站天然契合 |
| 15 | **Nine of Swords** | 数字/风 | nine of swords meaning | 阴影牌（焦虑/失眠）+ Amethyst 镇静主推 + 与 Major Moon 互链 |
| 16 | **Six of Pentacles** | 数字/土 | six of pentacles meaning | 慷慨/给予 + Crystal Coven Carnelian 共识 + 商业价值（财富流动）|
| 17 | **King of Cups** | 宫廷/水 | king of cups as feelings | 情感精通 archetype + `as feelings` 长尾 + Lapis/Aquamarine 主推 |
| 18 | **Queen of Pentacles** | 宫廷/土 | queen of pentacles meaning | 滋养丰盛 + Crystal Coven Aventurine 共识 + 与 Major Empress 互链 |
| 19 | **Two of Wands** | 数字/火 | two of wands tarot meaning | 词 #1 实查 SERP 前 10（数字牌标杆）+ Citrine 主推 + 与 Major Magician 互链 |
| 20 | **Page of Pentacles** | 宫廷/土 | page of pentacles meaning | 务实学习 + Crystal Coven Aventurine 共识 + 学徒 archetype（年轻用户入口）|

**Top 20 构成**：8 宫廷（50%）+ 12 数字（Ace 全 4 + Pentacles 数字 5 + 阴影牌 2 + 标杆 1）

### 6.3 后 36 张排期建议

- **第二批（数字牌 7-10 阴影/圆满系）**：Three of Swords（心碎）/ Seven of Swords（欺骗）/ Ten of Wands（过载）/ Ten of Cups（家族圆满）等
- **第三批（数字牌 2-6 中段）**：Four of Cups（冷漠）/ Five of Pentacles（贫乏）等
- **第四批（剩余宫廷 + 数字牌补全）**

---

## 7. 结论与建议

### 7.1 值不值得做？

**值得做，但需调整策略认知**：

| 维度 | Major（已做 23 篇） | Minor（拟做 56 张） |
|---|---|---|
| 纯牌意主题词竞争 | 高（Biddy/Labyrinthos 垄断） | 同样高（同样对手） |
| 水晶交叉长尾 SERP | 小站合集页（soulfulnwild/astrosofa）低质 → 独立深度页可排 | 小站合集页（Crystal Coven/Mystic Doorway）稍完整但仍低质 → **差异化空间更大**（竞品做了水晶但无首饰 Shop / 无 Eastern / 无 reversed 水晶 / 无 yes-no 段） |
| 流量天花板 | 中（Major 22 牌是塔罗核心搜索） | **低于 Major**（Minor 单牌搜索量 < Major 单牌，但 56 张总量大） |
| 商业价值 | 中（首饰 Shop CTA） | **Pentacles 全系 + 宫廷牌 as feelings 高**（物质/情感双线转化）|
| 工作量 | 23 篇 | **56 张 + 四花色体系 + 数字/宫廷两套差异化**（约 Major 的 2.5 倍）|

**核心判断**：
1. **生态位仍成立**——Minor 水晶交叉长尾的竞品（Crystal Coven 合集单页）比 Major 的（soulfulnwild 合集）稍完整但仍弱，我们 6 差异化（独立深度页 + 5 角色水晶 + 首饰 Shop + Eastern + 四花色元素骨架 + 宫廷 as feelings）的赢面更大
2. **流量预期要降低**——Minor 单牌搜索量低于 Major（Major 的 Fool/Lovers/Star 是大众入口，Minor 的 Two of Wands/Page of Cups 偏玩家向），但 56 张 × 长尾矩阵 × 互链密度，累积流量可能追平甚至超过 Major
3. **"故意留空白"旧策略应调整**——Major 框架第 3 差异化点"Minor Arcana 空白占位 = 卖点"是当时 0 数据时的保守策略。现在 Major 23 篇已上线、数据层/工具/图片管线已跑通，**继续留空白等于把 Minor 流量让给 Crystal Coven 等小站**。建议从"留空白当卖点"转为"Minor 是 Major 的纵深延展"

### 7.2 工作量估算

| 阶段 | 工作内容 | 估时 | 依赖 |
|---|---|---|---|
| **数据层** | 56 张 json（含 suit/element/progression/court_role/love/career/finances/yes_no 等新字段）+ 56 张 × 5 角色 = 280 条水晶映射（基于四花色元素表，已建骨架） | **3-4 天** | crystal-attributes.json（已就绪）+ Crystal Coven 共识（已抓） |
| **框架文档** | Minor 框架 v1（基于 Major 框架改造：复用 12 模块 + 新增 M-Suit/M-Progression/M-Archetype 三段 + Love/Career/Finances 改造） | **1-2 天** | 本研究 + Major 框架（已读） |
| **生产** | 56 篇文章（AI workflow 一次填充，分批 BATCH=2-3 避智谱限流；Top 20 先做，后 36 张分批）| **5-7 天**（Top 20 三天 + 后 36 张四天）| 数据层 + 框架 + CTA 预验证脚本 |
| **图片** | 56 hero（牌视觉 + 花色元素色 + best_overall 水晶）+ 56 Mini Spread | **2-3 天** | gpt-image-2 管线（已就绪）|
| **上传 + TKD + Schema** | 56 draft + rank_math + Article/FAQPage/BreadcrumbList/ItemList | **2-3 天** | upload-tarot 管线（已就绪，复用 Major 模式）|
| **合计** | | **13-19 天**（Top 20 先做 7-9 天可见结果）| |

### 7.3 与"故意留空白"旧策略的取舍建议

**旧策略（Major 框架 §0 第 3 点）**：
> "Minor Arcana 空白占位：明确声明 Major 优先，Minor 留扩展（竞品无人系统做 Minor × 水晶）"

**取舍建议**：
1. **背景已变**——旧策略制定时（2026-06-28），Major 0 上线、工具层未就绪、数据层未跑通，保守留空白合理。现在（2026-07-02）Major 23 篇已上线、皇冠 AI 塔/是与否/爱情/神谕卡/本命牌 5 工具已上线、配对/场景/是与否/每日运势 4 类已排期 future，**Minor 不再做"卖点"而是"纵深"**
2. **竞品已动**——Crystal Coven 已做 Pentacles 14 张水晶合集（虽然是单页低质），证明"竞品无人做 Minor × 水晶"的前提已不成立。我们再不做，等竞品把单页深化成独立页，我们的差异化窗口就收窄
3. **建议措辞调整**——把"Minor 空白占位 = 卖点"改为"**Minor 是 Major 的元素纵深**（四花色 × 元素 × 水晶的体系化延展，竞品 Crystal Coven 只做合集单页，我们做独立深度页 + 5 角色水晶 + 首饰 Shop + Eastern + 宫廷 archetype）"。差异化从"有没有"升级为"深不深"
4. **不建议一次做 56 张**——分两批：Top 20（宫廷 8 + 数字 12，高搜索高商业）先做验证，跑通后再排后 36 张。降低一次性投入风险，也给框架/数据层迭代留窗口

### 7.4 风险与红线

| 风险 | 缓解 |
|---|---|
| **56 篇同质化**（数字牌 2-6 中段尤易模板感）| M-Progression 表 + M-Archetype 表强制每牌落到独立 progression/角色；关卡 1 语义去重 embedding 余弦相似度 > 0.85 触发复审（沿用 Major 关卡 4）|
| **Swords 阴影牌（3/9/10）逆位段翻车** | M3 合规口径不变（禁 bad omen/curse）；阴影牌 reversed 段守 Health/Finances 黑名单（不写"诅咒/疾病预测"）|
| **水晶绑定凭通识编**（最大红线）| 本研究的四花色 × 水晶表已带 390 库 Element/Intentions 依据 + Crystal Coven 共识；生产前数据层 json 验收关卡（沿用 Major §15）逐牌验 source 字段 |
| **CTA 死链**（56 × 5 = 280 个潜在死链）| 沿用 Major M4 CTA 预验证脚本（HEAD 检查 meaning/category → 降级 → 全绿才填充）|
| **AI workflow 56 篇智谱限流** | BATCH=2-3，分批填充（Top 20 一批 / 中段 18 一批 / 后段 18 一批）|

---

## 附录 A：数据源清单

| 数据 | 来源 | 路径/URL |
|---|---|---|
| Major 框架（对照改造基准） | 本地文档 | `03-内容策略/内容Brief/模板-Tarot-牌义页框架.md` |
| 390 水晶库（Intentions/Element/Chakra 依据） | 本地 json | `07-互动工具/_shared/crystal-attributes.json`（390 颗，overview.Intentions/Element/Chakra 实查）|
| 数据层现状（确认无 Minor） | 本地 json | `04-内容生产/13.tarot/configs/`（7 个 json 全 Major 衍生）|
| 工具层现状（确认无 Minor） | 本地 json | `07-互动工具/_shared/tarot-knowledge.json`（仅 22 Major）|
| 竞品分析现状 | 本地文档 | `01-竞品分析/1D-塔罗深度拆解/`（22 站拆解，Minor 仅零星提及）|
| SERP 词 1-8 | serp_check 实查 | US/desktop/en，2026-07-02，详见 §1 |
| 标杆页 1（数字牌） | webReader | `biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-wands/two-of-wands/` |
| 标杆页 2（宫廷牌） | webReader | `labyrinthos.co/blogs/tarot-card-meanings-list/page-of-cups-meaning-tarot-card-meanings` |
| 水晶交叉竞品（Pentacles 全套共识） | webReader | `crystalcoven.co.uk/pentacles`（14 张水晶映射完整抓取）|

## 附录 B：四花色 × 元素 × 数字 progression 速查（生产时取用）

| 数字 | 通用 progression | Wands（火） | Cups（水） | Swords（风） | Pentacles（土） |
|---|---|---|---|---|---|
| Ace | 起点/火花 | 热情火花 | 情感觉醒 | 心智突破 | 物质机会 |
| 2 | 决定/平衡 | 计划未来 | 妥协吸引 | 僵局回避 | 平衡资源 |
| 3 | 协作/首批成果 | 扩展远见 | 庆祝友谊 | **心碎分离** | 团队学徒 |
| 4 | 稳固/停滞 | 庆祝休战 | 冷漠厌倦 | 静修复原 | 占有守财 |
| 5 | 冲突/挑战 | 竞争冲突 | 失去遗憾 | 冲突局限 | 贫乏困难 |
| 6 | 和谐/给予 | 胜利回报 | 怀旧和谐 | 脱离顺风 | 慷慨给予 |
| 7 | 反思/评估 | 捍卫坚守 | 幻想迷惑 | 欺骗迷失 | 耐心评估 |
| 8 | 精进/迁移 | 迅速行动 | 离开转身 | 束缚限制 | 精进工艺 |
| 9 | 圆满前夜 | 坚韧边界 | 满足独立 | **焦虑失眠** | 自足丰盛 |
| 10 | 终结/转化 | 承载传承 | 家族圆满 | **终结谷底** | 传承财富 |

> **加粗**=塔罗著名阴影牌（Swords 3/9/10），逆位段守 Health 合规口径（不写疾病/诅咒预测）。

---

**文档状态**：研究完成，待用户审阅。下一步（用户确认后）：①定稿 Minor 框架文档 → ②建数据层 json（56 张）→ ③Top 20 生产。
