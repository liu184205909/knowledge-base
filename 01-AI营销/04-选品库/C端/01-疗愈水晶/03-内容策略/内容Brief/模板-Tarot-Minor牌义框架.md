# Tarot Minor Arcana 牌义文章框架 v1（56 篇）

> **适用**：`/tarot-{card-slug}-crystals/` Minor 牌意 × 水晶 × 自我反思页（36 数字牌 + 16 宫廷牌 + 4 花色 Hub，共 56 篇 + 4 Hub）
> **竞品依据**：[Minor-Arcana-牌义竞品研究](../../01-竞品分析/Minor-Arcana-牌义竞品研究.md) —— Biddy（数字牌标杆）/ Labyrinthos（宫廷牌标杆，Love/Career/Finances+as Feelings 三段）/ Crystal Coven（Pentacles 14 张水晶合集，业界共识）/ 8 词 SERP 实查
> **数据源**：`minor-knowledge.json`（56 条单源，含 suit/suit_element/card_type/number_or_rank/court_role/court_archetype/progression_meaning/as_feelings/as_person/love/career/finances×正逆位/yes_no/crystals 5 角色/eastern_anchor/chakra/related_cards 全字段）
> **与 Major 框架关系**：[Major 牌义框架](模板-Tarot-牌义页框架.md) 写 22 Major；本框架写 56 Minor。**复用 Major 12 模块 + 新增 3 Minor 专属段 + M7 改造**。URL/合规/CTA/Schema/图片/上传管线全复用 Major。
> **核心策略**：纯牌意词（`{card} meaning`）不做——Biddy/Labyrinthos 垄断 + AIO 出现率 87.5%。做 **`crystals for {card}` 交叉长尾**：Crystal Coven/Mystic Doorway 虽占位但**单合集页 + 每牌 1 颗水晶 + 2 段低质**，goearthward 独立深度页 + 6 差异化可赢，**差异化空间比 Major 更大**（竞品更弱）。
> **6 大差异化**（vs Crystal Coven 合集单页）：
> 1. **独立深度页**：每牌独立 1500-2200 词（竞品合集单页每牌 2 段）
> 2. **5 角色水晶分层**：best_overall + upright/reversed/love/daily_wear（竞品只 1 颗）
> 3. **首饰 Shop CTA**：竞品只讲水晶 raw，无购买承接
> 4. **四花色元素骨架**：M-Suit 段系统讲花色×元素（竞品无体系）
> 5. **Eastern 藏式调性**：每牌 eastern_anchor（竞品纯西方）
> 6. **宫廷 as feelings / as a person**：宫廷牌独有长尾（竞品合集页无）+ 数字牌 progression 段
>
> **⚠️ 最大风险**：① 56 篇同质化（数字牌 2-6 中段尤易模板感）；② Swords 阴影牌（3/9/10）逆位段合规翻车。

---

## §1 URL + TKD

- **URL**：`/tarot-{card-slug}-crystals/`（根级 post，与 Major 一致，避产品词污染）
  - 示例：`/tarot-two-of-wands-crystals/` `/tarot-page-of-cups-crystals/` `/tarot-ten-of-swords-crystals/` `/tarot-ace-of-pentacles-crystals/`
  - 4 花色 Hub：`/wands-crystals/` `/cups-crystals/` `/swords-crystals/` `/pentacles-crystals/`（花色总入口，可选）+ 总 Hub `/crystals-for-tarot-cards/`（已上线）
- **Title**：`{Card} Tarot Card Meaning & Best Crystals`（≤60 字符）
- **H1**：`{Card}: Tarot Card Meaning & Best Crystals for Self-Reflection`
- **Primary KW**：`{card} tarot card meaning` / `crystals for {card}` / `{card} tarot crystals`
- **Secondary KW**：`{card} upright meaning` / `{card} reversed meaning` / `{card} yes or no` / `{card} love meaning` / 宫廷牌加 `{card} as a person` / `{card} as feelings`
- rank_math focus_keyword = `{card} tarot`

---

## §2 模块结构（Major 12 复用 + 3 新增 + M7 改造，1500-2200 词）

> **双轨**：宫廷牌（16 篇，1800-2200 词，对标 Labyrinthos 深度 + as feelings/person）；数字牌（36 篇，1500-1800 词，对标 Biddy 中等深度 + 我们差异化）。

| # | 模块 | H2 | 数字牌词数 | 宫廷牌词数 | 要点 |
|---|---|---|---|---|---|
| Intro | Hero + TL;DR | | 120-180 | 120-180 | 牌钩子 + archetype 一句话 + 主 KW |
| M1 | at a Glance + yes/no | `{Card} at a Glance` | 100-150 | 100-150 | 速答 + yes/no（Minor 高搜索）+ 3 点 bullet（archetype/牌意/水晶） |
| **M-Suit** | **花色×元素 ⭐新增** | `The Suit of {Suit}: {Element} Energy` | 100-150 | 100-150 | 花色元素象征 + 花色主题（Wands 火/Cups 水/Swords 风/Pentacles 土） |
| **M2** | **Upright Meaning** | `{Card} Upright: Meaning & Message` | 250-350 | 280-380 | 落 Rider-Waite 画面 + 花色基调 + archetype（非泛词） |
| **M-Progression** | **数字 progression ⭐数字牌专属** | `{Card} and the Number {N} in Tarot` | 80-120 | — | 数字 1-10 在该花色的 progression（见 §3） |
| **M-Archetype** | **宫廷 archetype ⭐宫廷专属** | `{Card} as an Archetype: The {Role} of {Suit}` | — | 150-220 | 角色阶段 + 花色表达 + **as feelings + as a person**（见 §4） |
| **M3** | **Reversed** | `{Card} Reversed: The Shadow Aspect` | 200-300 | 200-300 | 逆位独立深化（shadow aspect 口径，合规见 §6） |
| **M7** | **Love/Career/Finances ⭐改造** | `{Card} in Love, Career & Finances` | 250-350 | 300-400 | **三段并行 H3**（正位 love/career/finances，对标 Labyrinthos，高搜索长尾） |
| **M4** | **Crystals（5 角色）⭐核心** | `Best Crystals for {Card}` | 350-450 | 350-450 | 5 角色 H3 分层 + 四花色元素映射（见 §5）+ 三要素 |
| M5 | How to Use | `How to Work with {Card} Crystals` | 150-220 | 150-220 | 仪式/练习步骤 + 抽牌冥想 |
| M6 | Reversed Crystals | `Crystals to Support {Card} Reversed` | 120-180 | 120-180 | 逆位换哪颗水晶 + shadow work 支持 |
| M8 | Eastern | `{Card} in the Eastern Tradition` | 150-220 | 150-220 | Eastern 锚点（藏传/印度/东亚，至少 2 处） |
| M9 | Shop CTA | `Shop {Card} Crystals` | 80-120 | 80-120 | 首饰 Shop CTA + 已验证 URL |
| M11 | FAQ | `Frequently Asked Questions` | 250-350 | 300-400 | 含 yes/no / as feelings（宫廷）/ love / reversed 问题 |
| M12 | Related | `Related Tarot Cards` | 80-120 | 80-120 | 同花色 + Major 关联互链 |

**规则**：数字牌写 M-Progression（跳过 M-Archetype）；宫廷牌写 M-Archetype（跳过 M-Progression）。

---

## §3 数字牌 progression 差异化（36 数字牌，防模板感）

> 每数字 × 四花色落独有 progression，禁中段（2-6）模板感。完整表见 [研究文档附录 B](../../01-竞品分析/Minor-Arcana-牌义竞品研究.md)，生产时从 `minor-knowledge.json > progression_meaning / progression_position` 取。

| 数字 | 通用 | Wands（火） | Cups（水） | Swords（风） | Pentacles（土） |
|---|---|---|---|---|---|
| Ace(1) 起点 | 火花/种子 | 热情火花 | 情感觉醒 | 心智突破 | 物质机会 |
| 2 决定/平衡 | 选择/伙伴 | 计划未来 | 妥协吸引 | 僵局回避 | 平衡资源 |
| 3 协作/首果 | 合作/创造 | 扩展远见 | 庆祝友谊 | **心碎分离** | 团队学徒 |
| 4 稳固/停滞 | 基础/占有 | 庆祝休战 | 冷漠厌倦 | 静修复原 | 占有守财 |
| 5 冲突/挑战 | 失序/竞争 | 竞争冲突 | 失去遗憾 | 冲突局限 | **贫乏困难** |
| 6 和谐/给予 | 平衡/互助 | 胜利回报 | 怀旧和谐 | 脱离顺风 | 慷慨给予 |
| 7 反思/评估 | 等待/策略 | 捍卫坚守 | 幻想迷惑 | 欺骗迷失 | 耐心评估 |
| 8 精进/迁移 | 专注/速度 | 迅速行动 | 离开转身 | **束缚限制** | 精进工艺 |
| 9 圆满前夜 | 独立/自足 | 坚韧边界 | 满足独立 | **焦虑失眠** | 自足丰盛 |
| 10 终结/转化 | 圆满/过载 | 承载传承 | 家族圆满 | **终结谷底** | 传承财富 |

**加粗** = 塔罗著名阴影牌（Swords 3/9/10），逆位段守 §6 合规口径。

---

## §4 宫廷牌 archetype 差异化（16 宫廷牌，防模板感）

> 16 张 = 角色（Page/Knight/Queen/King）× 花色（Wands/Cups/Swords/Pentacles）交叉独有，禁 16 篇只换花色名。完整 archetype 见 `minor-knowledge.json > court_archetype_uniqueness_table`。

| 角色 \ 花色 | Wands（火） | Cups（水） | Swords（风） | Pentacles（土） |
|---|---|---|---|---|
| **Page（学徒）** | Spark-Seeker | Dreamer | Curious Mind | Apprentice |
| **Knight（行动）** | Adventurer | Romantic | Truth-Seeker | Steady Plodder |
| **Queen（掌控）** | Magnetic Leader | Compassionate Heart | Clear-Eyed Judge | Nurturing Provider |
| **King（精通）** | Visionary Founder | Emotional Master | Principled Authority | Master of Manifestation |

**M-Archetype 必写 5 点**：① 角色阶段能量（学徒→行动→掌控→精通）；② 花色基调如何在该角色表达；③ **as feelings**（牌代表某人时他对你的感觉）；④ **as a person**（牌描述什么人格）；⑤ shadow（逆位时该角色如何走偏）。

---

## §5 水晶绑定（四花色 × 元素，5 角色差异化）

> **依据**：390 库 `crystal-attributes.json > overview.Element/Intentions` 实查 + Crystal Coven Pentacles 14 张业界共识。**slug 必须带 `-meaning` 后缀对齐 390 库**（`quartz-meaning` 非 `quartz`，防死链）。

| 花色 | 元素 | 主推水晶（5 角色从中选） |
|---|---|---|
| **Wands** | 🔥 Fire | Carnelian / Citrine / Sunstone / Tiger's Eye / Garnet |
| **Cups** | 💧 Water | Moonstone / Aquamarine / Blue Lace Agate / Rhodochrosite / Labradorite / Rose Quartz |
| **Swords** | 💨 Air | Amethyst / Selenite / Sodalite / Lapis / Fluorite / Angelite |
| **Pentacles** | 🌍 Earth | Green Aventurine / Red Jasper / Hematite / Pyrite / Jade / Tiger's Eye |

完整 16 宫廷牌 × 水晶 best_overall 映射见 [研究文档 §5.2](../../01-竞品分析/Minor-Arcana-牌义竞品研究.md)。每牌 5 角色（best_overall/upright/reversed/love/daily_wear）从 `minor-knowledge.json > crystals` 取，已逐颗核对 390 库 slug。

**水晶口径**：反思辅助非改结果（与 Major/是与否一致，✅"support the energy {Card} asks for" ❌"wear X for luck"）。

---

## §6 合规（Swords 阴影牌 + Health/Finances 重点）

> Minor 牌义页讲牌意 + 水晶，合规口径同 Major §16。**Swords 阴影牌（3/9/10）+ Five of Pentacles 是 Minor 专属高风险处**。

**逆位口径**（M3 全 Minor 统一）：用 shadow aspect / invitation to reflect，**禁** `bad omen` / `curse` / `evil` / `disease prediction`。

**Swords 阴影牌特殊规则**：
- **Three of Swords**（心碎）/ **Nine of Swords**（焦虑/失眠）/ **Ten of Swords**（谷底/终结）：M3 + FAQ 守 **Health 黑名单**——不医疗化（不诊断失眠/焦虑/抑郁为疾病、只描述情绪体验）、不承诺水晶疗效（如 Nine of Swords 的 Amethyst 仅"traditionally placed under pillow"，非疗效承诺）
- **Five of Pentacles**（贫乏/匮乏）：M7 finances + FAQ 守 **Finances 黑名单**——不投资建议、不承诺脱贫、谈 money mindset + 接受帮助 + 建议寻求专业支持

普适黑名单 + 禁用表达库见 [1F §0A](../../01-竞品分析/1F-塔罗内容写法研究.md)。

---

## §7 内链配方

| 内链类型 | 数量 | 锚文本示例 | 目标 |
|---|---|---|---|
| 同花色其他牌 | 1-2 | "{Other Card} tarot meaning" | `/tarot-{other-card}-crystals/` |
| Major 关联牌 | 1 | "{Major Card} tarot card meaning" | `/tarot-{major-card}-crystals/` |
| 花色 Hub / 总 Hub | 1 | "crystals for {suit} cards" / "crystals for tarot cards" | `/wands-crystals/` 或 `/crystals-for-tarot-cards/` |
| 水晶页 | 0-1 | "{crystal} meaning" | `/gemstone/{crystal}-meaning/` |
| 配对页（可选） | 可选 | "{Card} with {Other}" | `/{card}-and-{other}/` |

**每篇 4-6 条内链**，锚文本含主 KW 变体。宫廷牌优先链同角色其他花色（Page of Wands ↔ Page of Cups）；数字牌优先链同数字其他花色（Four of Wands ↔ Four of Cups）+ 同花色 Ace/上下数字。

---

## §8 质检关卡（概览，可勾选项见 [QC 清单](Checklist-Tarot-Minor牌义-QC.md)）

- **关卡 0 合规前置**：grep 黑名单；Swords 阴影牌 + Five of Pentacles 全审（Health/Finances 重点）
- **关卡 1 archetype/progression 独有**：数字牌同数字×四花色不可互换（Four of Wands≠Four of Cups）；宫廷牌同角色×四花色不可互换（Page of Wands≠Page of Cups）
- **关卡 2 禁照抄 Biddy/Labyrinthos**：M2 落独有论证 + Eastern 段（竞品无）
- **关卡 3 M7 三段落该牌独有**：love/career/finances 非泛化（从 `minor-knowledge.json` love/career/finances_meaning 取）
- **关卡 4 水晶口径 + slug 对齐**：反思辅助口径 + 5 角色 slug 全带 `-meaning` 对齐 390 库
- **关卡 5 语义去重**：同花色连读（14 张）、同数字连读（4 张）、同角色连读（4 张）—— embedding 余弦 > 0.85 触发复审
- **关卡 6 完成性**：post 存在 / 图片全字段嵌 content / rank_math / schema 渲染

---

## §9 通用组件（复用 Major）

| 组件 | 执行依据 |
|---|---|
| 合规/去 AI 化 | Major §16 + [1F §0A](../../01-竞品分析/1F-塔罗内容写法研究.md) + **本框架 §6**（Swords 阴影牌加固） |
| CTA 预验证 | Major §3（meaning→shop search→healing-jewelry 三级降级） |
| Schema | Major §12（Article + FAQPage + BreadcrumbList + ItemList 水晶，无 Product 前端渲染） |
| 图片 | Major §14（hero 1536×864：牌视觉 + 花色元素色 + best_overall 水晶） |
| 上传/TKD/排期 | upload-tarot 管线（复用 Major 模式） |

---

## 附录：三层架构

| 层 | 文件 | 用途 |
|---|---|---|
| 母框架 | 本档 | 策略 / 模块 / 差异化 / 合规 / QC 标准 |
| 生产 Brief | [Brief-Tarot-Minor牌义-生产执行版.md](Brief-Tarot-Minor牌义-生产执行版.md) | 单篇生成模板（字段 + 模块填空） |
| QC 清单 | [Checklist-Tarot-Minor牌义-QC.md](Checklist-Tarot-Minor牌义-QC.md) | 可勾选检查项 |

---

## §10 与其他框架边界

- **Major 牌义框架**：22 Major 牌义（已上线 23 篇）。Minor 是 Major 的元素纵深（四花色 × 元素 × 水晶体系延展）。
- **是与否框架**：单牌×问题判定页。Minor 牌义页 M1 含 yes/no 速答（从 `minor-knowledge.json > yes_no` 取），但不展开条件论证（那是是与否页的活）。
- **配对框架**：两牌组合。Minor 牌义页可链配对页（如 Two of Wands 链 the-magician-and-the-fool）。
