# Chinese Zodiac Crystals 文章框架 v2（12 生肖 × 水晶，Eastern 调性）

> **适用**：`/chinese-zodiac/{animal}-crystals/`（12 篇）+ 常青 hub + 2026 Fire Horse 年度子页，共约 14 篇核心 + 生肖×天使号码/numerology 等交叉延展至 25 篇规模（策略 §40）
> **竞品依据**：desiderate.com.au（12-sign-2026 单页 hub，SERP 顶部强占位）、alberthern.com、lifestyleasia.com、naturaltreasureca.com、ownicrystos.com、tocrystal.com、chinahighlights.com（文化底层，权威高）
> **数据源**：`_shared/chinese-zodiac-knowledge.json`（12 生肖 × 5 配石字段 + 性格 + 元素 + 本命佛 + lucky/unlucky + 兼容性，含 `year_boost` 可切换字段）+ `1.crystal-meaning/`（390 库）+ `crystal-attributes.json`
> **三源验证（2026-06-28）**：⚠️ **诚实定位 —— 首饰站角度蓝海，但 SERP 有强占位者**。4 直接竞品（Tiny Rituals 1 次/Energy Muse 0/Crystal Vaults 0/Crystal Council 0）几乎全缺席；但 SERP 顶部被 desiderate.com.au（12-sign-2026 单页 hub 强占位）+ chinahighlights（文化站权威高）+ 风水站/小电商/华人媒体占满，内容质量参差（12 生肖大表/算命调，缺首饰叙事 + 合规）。**非纯蓝海**，是「Chinese Zodiac × crystals × jewelry × cultural compliance × Eastern aesthetics」组合**未被高质量水晶站系统占位**。**护城河 = 深度 + 避讳石独占 + Eastern 可执行规则**（vs 竞品浅表算命调）。

---

## 0. 东西方双线定位（关键差异化）

| 维度 | 西方 Zodiac（已有） | Chinese Zodiac（本框架） |
|---|---|---|
| URL | `/{sign}-crystals/`（aries-crystals 等） | `/chinese-zodiac/{animal}-crystals/` |
| 分割逻辑 | 月（constellation 日期段） | 年（12 年动物周期 + 农历） |
| 元素 | 4 元素（火/土/风/水）+ 守护星 | 5 元素（木/火/土/金/水）+ 本命佛 |
| 核心叙事 | 西方占星 + 性格 + birthstone | 东方生肖文化 + 五行 + 本命年（Tai Sui）+ jade/玉石传统 |
| 配石维度 | 8 颗（含义 + birthstone + avoid separately） | **4 维**：幸运石 / 平衡石 / 年度加持石 / 避讳石 |
| 商业化 | 强（西方市场熟） | 弱于西方（Eastern 品牌独占，组合蓝海占位优先） |

**双线并存**：两条线独立，hub 互相导流（「西方星座看月，东方生肖看年 —— 两个都读，更完整」）。**不混淆**（不把 Aries 写进 Chinese Zodiac，反之亦然）。**不做硬等号映射**（Dragon≠Leo，见 §7）。

---

## 1. URL + TKD

- **生肖页 URL**：`/chinese-zodiac/{animal}-crystals/`（如 `/chinese-zodiac/dragon-crystals/`）
- **常青 hub URL**：`/chinese-zodiac/year-crystals/`（常青主 hub，永久 URL，年度内容在其下）
- **年度子页 URL**：`/chinese-zodiac/fire-horse-2026/`（2026 年度子页，2027 农历新年后归档/301 重定向到新年份子页 `/chinese-zodiac/fire-goat-2027/`）
- **Title（SEO evergreen 优先）**：`{Animal} Lucky Crystals: Chinese Zodiac Stones for Luck, Balance & Protection`
  - **策略**：主标题 **evergreen（不写死 2026）**，页面寿命更长；2026 时效词放 description / M3 第三维 / FAQ（非写死 Title 核心）。
  - **可选变体**：Title 保留 `…for 2026 & Beyond` 但**必须标注年度更新计划**（每年农历新年前批量刷新 year_boost + Title 年份）。
- **Description**：`Discover the best crystals for the {Animal} in the Chinese zodiac — lucky stones, balancing stones, and {current_year} ({element} {animal}) year energy. Cultural guidance, not fortune-telling.`
- **H1（可读）**：`Best Crystals for the {Animal} (Chinese Zodiac)`
- **Primary KW**：`{animal} lucky crystal` / `{animal} chinese zodiac crystal` / `crystals for {animal}`（三覆盖）
- **Secondary**：`{animal} birthstone` / `year of the {animal} crystal` / `{animal} {current_year} stone`
- rank_math 三件套必写（title / description / focus_keyword），focus_keyword 用 `{animal} lucky crystal`

---

## 2. 模块结构 + 词数分配（目标 2000-2800 词）

| # | 模块 | H2 | 词数 | 内容要点 |
|---|---|---|---|---|
| M1 | Quick Answer | `Quick Answer: Best Crystals for the {Animal}` | 80-120 | 1-2 句答 + 4 维石一览 + 合规锚点 |
| M2 | Understanding | `The {Animal} in Chinese Zodiac ({中文}·{element})` | 250-350 | **强制事实表**（生肖/中文名/元素/近年/兼容/传统主题/本年度影响）+ 表后自然段（性格/本命年状态/文化变体）。**只讲生肖文化本身，不展开"所以你需要什么水晶"**（M3 才讲）|
| **M3** | **4 维水晶** ⭐核心 | `Crystals for the {Animal}: Lucky, Balance, {Year} & Avoid` | **750-950**（重点页可至 1200） | **4 维**，每维 1 主石 H3 + **120-160 词** + 备选石。**M3 偏知识**（文化依据 + 矿物属性 + 灵性传统 why）|
| **M4** | **How to Choose** ⭐转化 | `How to Choose Your {Animal} Crystal` | 200-300 | **生活化需求场景对照表**（非 M3 四维换表格）。**M4 偏行动**（按当下需求场景选）|
| M5 | How to Use | `How to Use {Animal} Crystals` | 200-300 | 使用方式 × 产品形态（商业化）+ 佩戴讲究（合规措辞）|
| **M6** | **Avoid Stones** ⭐差异化独占 | `Crystals the {Animal} Should Use Mindfully` | 200-300 | **避讳石**（元素冲突/本命年）—— 首饰站独占。**合规硬化**：强制缓和语 + 二审硬扫描词表（见 §6）|
| **M7** | **Eastern vs Western** ⭐双线 | `{Animal} Chinese Sign vs Your Western Zodiac` | 150-250 | **双镜头阅读**（不做硬映射）+ 解释差异 + 双向内链 |
| M8 | FAQ | `FAQ About {Animal} Crystals` | 350-500 | **7 问固定结构**（含年份边界 + 文化变体问，见 §12）|
| M9 | Shop + Closing | `Shop {Animal} Crystals` + 内链 | 150-250 | 产品链接 + 三类内链 + 免责声明 |

**篇幅目标**：2000-2800 词。核心页（Dragon/Horse/Rabbit）2800+，其余 2000-2400。**M3 不强行 1200 防 AI 凑字重复泛句**——每主石 120-160 词写透 why 即可，重点页才上 1200。

### 2.1 M2 / M3 / M4 语气物理区隔（防重复）

三个模块讲同一生肖但**视角不同**，禁止内容重复：

| 模块 | 讲什么 | 不讲什么 |
|---|---|---|
| **M2** | 生肖文化本身（什么样的人/五行属性/本命年状态/文化变体） | **不展开「所以你需要什么水晶」**（水晶留给 M3） |
| **M3** | 水晶知识依据（文化依据 + 矿物属性 + 灵性传统 why 每维石为何配本生肖） | 不讲「按当下需求场景怎么选」（留给 M4） |
| **M4** | 按需求场景选（生活化行动：重大决定前要 clarity / 软化强势 / 野心期接地 / 选日常手链 / 本年度保护石） | 不重复 M3 的文化 why（只引用石名 + 场景理由） |

---

## 3. M3 四维水晶结构（核心模块，差异化于西方 zodiac 8 颗扁平列表）

每生肖 **4 维**，每维 1 主石（H3）+ **120-160 词** + 1-2 备选石（列表）：

```
### Lucky Stone: {Name} （幸运石 — 传统共识）
{AI 120-160词：why it fits this animal(文化依据) + how to use(矿物属性/佩戴) + also consider(备选提示), 原创不抄 meaning 页}
- **Element**: {overview.Element}  | **Best for**: {overview['Best for']}
- **Also consider**: {备选石1}, {备选石2}
[图] + 内链到 /gemstone/{slug}-meaning/

### Balance Stone: {Name} （平衡石 — 补生肖短板）
{同上结构, 120-160词}

### {Current Year} {Element Animal} Stone: {Name} （年度加持石 — 读 year_boost 字段）
{读 chinese-zodiac-knowledge.json → {animal} → year_boost 字段。2026=Fire Horse对应石; 2027切换后自动读Fire Goat年石。说明该石对本生肖在当前年度的特殊作用}

### Mindful-Avoid Stone: {Name} （避讳石 — 元素冲突/本命年）
{元素冲突解释 + 合规措辞 + "trust how a stone feels to you over any hard rule" 收尾。措辞硬化见 §6}
```

**数据来源**：`chinese-zodiac-knowledge.json` → `{animal}` → `lucky_stone` / `balance_stone` / **`year_boost`（年度切换字段）** / `avoid_stone`（每维已预填 name/slug/why）。

**字段优先级**：why（文化依据）> Element / Best for > 备选石。

**词数纪律**：每主石 120-160 词写透「why it fits this animal + how to use + also consider」即可；**禁止凑字到 200+**（会触发 AI 重复泛句）。4 维 600-750 词 + 模块开头引导段 + 备选石列表 = 750-950 词。重点页（Dragon/Horse/Rabbit）可至 1200，靠的是深化 why 而非堆字。

---

## 4. M4 需求场景对照表（核心转化模块，区别于 M3）

放 M3 之后（先认识水晶知识，再按当下需求场景行动）。**M4 偏行动**——按生活化需求场景选石，**不是 M3 四维换表格**：

| 生活化需求场景 | Best Crystal | Why（场景理由，非文化 why） |
|---|---|---|
| Clarity before a big decision | Amethyst | When your mind is looping at 2am, this is the one people reach for to quiet the noise |
| Softening intensity without losing drive | Rose Quartz | Keeps the {Animal} edge without the sharpness that burns bridges |
| Staying grounded during an ambitious push | Smoky Quartz | Anchors you when the year asks for speed you're not sure you can sustain |
| Choosing a daily bracelet you'll actually wear | Citrine | Low-maintenance, pairs with everything, a quiet confidence boost |
| A protective stone for {current_year} | Black Tourmaline | The default anchor for ben ming nian instability — wear it, don't overthink it |

**本命年加成**（仅 Horse 2026 / Snake 2025 回响）：表后加一行 ⚠️「Ben Ming Nian (本命年) Note」— 优先 Black Tourmaline / Smoky Quartz / Jade 保护石（**陈述传统关联，不保证避灾**）。

**纪律**：M4 表的 Why 列写**场景理由 + 行动指引**，不重复 M3 的文化 why / 矿物属性。两表读起来视角不同（M3 偏知识 / M4 偏行动）。

---

## 5. M5 商业化（使用方式 × 产品形态 + 东方佩戴讲究）

每种使用方式对应产品形态（同 chakra v2 §5）：
- **佩戴** → bracelets / necklaces（日常提醒）
- **冥想** → palm stones / tumbled
- **摆放** → towers / raw stones / clusters（工作台 / 财位 / 床头）
- **本命佛配石** → 小吊坠 / 随身石（与本命佛搭配，措辞见下）

**东方佩戴讲究**（轻量、合规、文化准确 —— 全部用传统/象征框架）：
- 「左进右出」：**用 "traditionally" / "symbolically" 框架** —— 「In some Chinese wearing traditions, the left wrist is associated with receiving energy, so absorbing stones (lucky/wealth) are often worn there; the right with releasing, so protective stones may go there.」**禁** "to absorb luck"（确定性 claim）。
- 本命年：陈述「many people choose to wear a protective stone throughout their ben ming nian as a symbolic anchor」—— **禁**「必须全年戴某石 / 某石保证避灾」。
- **措辞合规**：用 "traditionally worn on the left wrist as a symbolic reminder of..."，非 "to absorb luck / to ward off Tai Sui's curse"。

---

## 6. M6 避讳石（⭐ 首饰站独占差异化，最高踩雷段，合规硬化）

**蓝海依据**：SERP「chinese zodiac avoid unlucky stones」查询，首饰站 0 覆盖，只有风水/算命站讲（lifestyleasia unlucky colors / potalastore Horse avoid / lemon8 3 signs never wear gold）。**我们做首饰站角度的「元素冲突避讳」可独占**。

### 6.1 内容要点
1. **元素理论**：5 元素相生相克（如 Fire 融 Metal、Water 灭 Fire、Wood 耗 Earth）—— 本生肖元素 + 大量堆叠相克元素石 = 传统上说不和谐
2. **本命年避讳**：Horse 2026 不宜过度堆叠 Fire 石（Fire on Fire 过旺）；Snake 刚出本命年仍需保护
3. **不否定石**：不说「X 石对 Y 生肖有害」，说「traditionally suggested to use mindfully / as an accent rather than a dominant stone」

### 6.2 合规硬化（两道关卡）

**关卡 A —— 模板必填位（每篇 M6 至少各出现一次）**：
- 必填①：「These are traditional elemental guidelines, not hard rules.」
- 必填②：「Trust how a stone feels to you over any textbook.」（personal resonance overrules tradition）

**关卡 B —— 二审硬扫描词表（命中强制改写）**：
以下短语**单独使用且无缓和语**时，命中即强制改写：

| ❌ 禁用（裸用） | ✅ 改写为 |
|---|---|
| harmful / bad for {animal} | traditionally suggested to use mindfully |
| should never wear | traditionally suggested to wear as an accent rather than a dominant stone |
| will bring bad luck | (删除; 改为 elemental-tradition guidance) |
| clashes with {animal} | is traditionally said to create elemental friction when stacked in large amounts |
| must avoid / forbidden | (删除; 改为 "traditionally used mindfully") |

**收尾模板（固定）**：「These are traditional elemental guidelines, not hard rules. A {Animal} who adores {avoid_stone} should wear it — personal resonance overrules tradition. Trust how a stone feels to you.」（对齐西方 zodiac-crystals「use separately」框架，避免绝对禁忌 claim）。

---

## 7. M7 东西方双镜头（⭐ 双向内链，不做硬映射）

**核心原则**：生肖（按年）↔ 西方星座（按月）**非一一对应，不做 Dragon=Leo 硬等号**。改「双镜头阅读」框架：

1. **解释差异（教育性）**：
   - 「Your Chinese zodiac sign is based on your **birth year** and carries cultural symbolism (personality archetypes, elemental themes, tradition). Your Western zodiac sign is based on your **birth month** and carries astrological symbolism (constellation positions, ruling planets). They're two different self-reflection lenses — not the same system.」
2. **条件式「两篇都读」CTA**（非硬映射）：
   - 「If you're a **Dragon** in the Chinese zodiac **and** a **Leo** in Western astrology, both pages offer something — read both: [Leo Crystals →](/leo-crystals/) and [Dragon Crystals →](/chinese-zodiac/dragon-crystals/). Two lenses on one you.」
   - **关键**：用「If you're X and Y」条件式，**不**用「Dragon = Leo」陈述式。生肖页不知道读者西方星座，让读者自查。
3. **西方对应关系表（可选，简短，标注 approximate）**：12 Chinese animal ↔ 大致 Western sign 区间（按出生年月映射）—— **必须标注**「approximate — your Western sign depends on exact birth date; the two systems are not equivalent」。

**双向**：西方 zodiac-crystals 页未来更新时也加反向 CTA → Chinese Zodiac（已有 12 篇上线后回填）。

---

## 8. 内链（四类 + 横向）

1. **每颗石 → meaning 页**：锚文本自然变化（"Garnet meaning" / "learn what jade represents"）
2. **Chinese Zodiac 横向**：正文上下文内链（Dragon 提 Rabbit/Goat 兼容、Horse 提 Tiger/Dog 三合、本命年链 Snake）
3. **东西方双线**：M7 链西方 zodiac-crystals（双向，条件式非硬映射）
4. **上层 hub**：`/chinese-zodiac/year-crystals/`（**常青主 hub**，永久）+ `/chinese-zodiac/fire-horse-2026/`（**2026 年度子页**，2027 归档/301 到 fire-goat-2027）+ `/gemstones/`
5. **工具联动**：见 §11

---

## 9. 图片策略

每篇：
- **hero 图**：`{animal}-crystals-hero.webp` —— 生肖动物 motif + 4 维代表石 flat-lay，Eastern 美学（暖色 linen / 木桌面 / 玉石质感）
- **M3 重点石图**（幸运石 1 张必备，其余按资源优先级）
- **可选 Eastern 元素图**：本命佛 / 五行图 / 生肖年表（轻量装饰）

**文件名规范**：`{animal}-crystals-{用途}.webp`（如 `dragon-crystals-amethyst.webp`）
**Alt**：`{Name} crystal for {Animal} Chinese zodiac {用途}`（如 `Amethyst crystal for Dragon Chinese zodiac clarity`）

**资源优先级**：① hero ② 幸运石图 ③ Shop 图（不必每维都配独立图）。

---

## 10. Schema（Rank Math 配置，Product 谨慎）

| Schema | 何时配 |
|---|---|
| **Article + FAQ** | **每篇必配**（M8 FAQ → FAQPage）|
| **Breadcrumb** | 根级 + Chinese Zodiac hub 结构 |
| **ItemList** | M3「4 维水晶」列表（**可选，4 项偏少，价值低于 chakra 12 颗**；指向 meaning 页/锚点，价值有限不强制）|
| **Product** | **仅 M9 有真实商品卡片时（价格/库存/商品名/图齐全且与可见商品完全一致）**。无真实商品卡片**禁用 Product schema**（避免空指针/虚假商品信号）。M3 四维**不用 Product**，用 ItemList 或 Article 内链 |

---

## 11. 工具联动（Chinese Zodiac Checker，发布前置依赖 + 静态降级）

**双向 CTA + 数据校验一致**：
- **文章 → 工具**：M2 末 + M4 前，CTA「Not sure of your Chinese zodiac sign? **Try the free Chinese Zodiac Checker** ↗」
- **工具 → 文章**：Chinese Zodiac Checker 的 12 结果分别链 `/chinese-zodiac/{animal}-crystals/`
- **数据源**：`chinese-zodiac-knowledge.json`（本数据层）—— 文章 M2 与工具共用同一 JSON（单一真源，避免漂移）

### 11.1 工具未上线的降级方案（防空指针 / 死链）

**Chinese Zodiac Checker 列为发布前置依赖**；若工具未上线，**降级为静态生肖年表页**：

- **静态降级页**：`/chinese-zodiac/find-your-sign/` —— 出生年份对照表（生肖只需查年表，**不需计算**，比 Life Path 更适合静态降级）
- **降级规则**：工具未上线时，文章 CTA 指向静态年表页（`/chinese-zodiac/find-your-sign/`），**不死链**。工具上线后批量回填为 Checker URL。
- **落地状态（2026-06-28）**：工具未建（zodiac-crystals Western Checker 已上线 page 43246，Chinese 版可复用框架）。**当前文章产出用静态年表页降级 CTA**，工具建后回填。
- **锚文本规范**：文章→工具「Chinese Zodiac Checker」；文章→静态页「Find your Chinese zodiac sign」；工具→文章「{Animal} Crystals Guide」（如 Dragon Crystals Guide）

---

## 12. FAQ（7 问固定结构 + 文化变体）

每篇 M8 FAQ **固定保留 7 问**（顺序可调，内容按本生肖定制）：

1. **What is the best crystal for {Animal}?** → 答 lucky stone（传统共识）
2. **What is the lucky crystal for {Animal} in {current_year} ({element} {animal} year)?** → 答 year_boost 字段石（年度时效）
3. **What is the protection crystal for {Animal}?** → 答 Black Tourmaline / Smoky Quartz / Jade（本命年保护）
4. **Is crystal healing scientifically proven?** → 合规答（symbolic / cultural tradition, not medical claim）
5. **Can I wear a crystal that's traditionally not recommended for my sign?** → 答 personal resonance overrules tradition（呼应 M6 合规）
6. **What if I was born in January or February?**（农历新年边界）→ 导向 Checker / 静态年表页：「Chinese zodiac year starts at lunar new year (late Jan/Feb), not Jan 1. If your birthday falls in Jan/Feb, check the exact lunar new year date for your birth year — [Find your Chinese zodiac sign →](/chinese-zodiac/find-your-sign/)」
7. **How is this different from Western zodiac crystals?** → 答 M7 双镜头差异（年 vs 月，文化 vs 占星）

### 12.1 hub / FAQ 文化变体说明

**hub 页 + 重点生肖 FAQ 轻量说明文化变体**（体现文化深度，避免绝对化）：

> 「Chinese zodiac traditions vary across regions. This guide follows the common 12-animal framework while acknowledging variants — e.g., Vietnam's zodiac has the **Cat** where China has the **Rabbit**; Japan's **Boar** corresponds to China's **Pig**. Korean and other East Asian traditions share the same 12-animal core with minor naming differences.」

（Rabbit 篇可展开 Vietnam Cat；Pig 篇可展开 Japan Boar；其余生肖 FAQ 轻量提及或省略。）

---

## 13. Writing & Compliance Rules（合规标准化 — Eastern 文化尤其敏感）

### 13.1 文化尊重（Eastern 调性核心）
- **文化数据锁死（杜绝 AI 编造）**：本命佛 / 五行相生相克 / 本命年（Tai Sui）/ 兼容性在 `chinese-zodiac-knowledge.json` **预填锁死**，文章/工具**只读不重写**。本命佛对应固定（鼠千手观音/虎兔虚空藏/龙蛇普贤/马羊大势至/猴大日如来/鸡不动尊/狗猪阿弥陀佛等），**错会显眼且不尊重**。
- **本命佛谨慎措辞**：用「in some East Asian Buddhist-inspired traditions, {Animal} is associated with {Buddha}」或「in certain folk traditions」—— **非所有体系统一认可**，不陈述为 universally accepted 事实。
- **文化准确性**：本命佛 / 五行 / 本命年（Tai Sui）/「左进右出」等必须准确（依据 chinahighlights.com 等权威源，不编造）
- **非算命 claim**：守住「symbolic reminder / traditional association」框架，**不**做确定性运势预测（「this stone will bring you wealth in 2026」❌）
- **Jade/玉石叙事**：Eastern 品牌调性独占点 —— Jade 作为「Stone of Heaven」在 Ox 等生肖重点展开（文化权威源 + 我们有 jadeite/nephrite 库）

### 13.2 禁医学/运势声明
- ❌ "cures / treats / heals anxiety"
- ❌ "guaranteed to bring luck / wealth / fortune"
- ❌ "will protect you from Tai Sui's curse"（确定性 claim）
- ❌ "化太岁 / 保证好运 / 避灾 / 某生肖必须全年戴某石 / 某石保证"（任何确定性保护/运势 claim）
- ✅ "traditionally associated with..."
- ✅ "in Chinese zodiac tradition, ... is linked to"
- ✅ "many people wear ... as a symbolic reminder of"
- ✅ "may support a sense of..."

### 13.3 免责声明（固定模块）
M9 末必加：`Crystal and zodiac traditions are shared for cultural appreciation and spiritual practice. They're not a substitute for professional medical, mental-health, or financial advice, and they don't guarantee specific outcomes.`

### 13.4 避讳石措辞（M6 专项，见 §6.2 硬化关卡）
**必须**收尾「personal resonance overrules tradition」—— 避免绝对禁忌（文化敏感性 + 合规）。二审硬扫描词表强制改写。

---

## 14. SEO Enhancements
- Title 主词靠前（`{Animal} Lucky Crystals` 在前）—— **evergreen 优先**，2026 时效词放 description / M3 / FAQ
- FAQ Schema（M8）+ Article
- rank_math 三件套
- **{current_year} 时效**：所有文章融入年度加持维度（M3 第 3 维读 year_boost 字段），捕获「{animal} {year} lucky crystal」时效流量
- **本命年长尾**：Horse/Snake 篇捕获「ben ming nian crystal / 犯太岁 stone」
- **东西方对比长尾**：M7 捕获「chinese zodiac vs western astrology」
- **年度刷新机制**：每年农历新年前批量切换 year_boost + 生新年份 hub + 旧 hub 归档（见数据层 `_meta` notes）

---

## 15. 模板化风险防控（12 篇同结构）

12 篇参数化必然，但**每篇强制注入差异化信息密度**：
- **M2 事实表 + 文化深化原创**：本命佛 / 五行 / 兼容性 / 本命年状态（Horse 2026 = ben ming nian，其余不是）每篇不同；文化变体（Rabbit→Vietnam Cat / Pig→Japan Boar）按生肖定制
- **M3 why 字段原创**：针对本生肖性格 + 当前年度能量重写（非换关键词）
- **M4 场景对照表**：按本生肖真实生活化需求分组（Dragon clarity before big decisions vs Rabbit softening sensitivity vs Horse grounding during speed）
- **M6 避讳石**：按本生肖元素冲突定制（Metal-Fire / Water-Fire / Earth-Wood 等不同组合）
- **M7 双镜头**：每篇对应不同西方星座条件式 CTA（非硬映射）

---

## 16. 与现有框架的关系

| 框架 | 关系 |
|---|---|
| [模板-星座水晶框架](模板-星座水晶框架.md)（西方 12 星座） | **东西方双线兄弟框架** —— 结构借鉴（Quick Answer/字段表/H3 列表/FAQ/Shop），但 4 维体系 + Eastern 文化 + 避讳石独占 + 东西方双镜头是 Chinese Zodiac 独有 |
| [模板-Chakra-Crystals文章框架](模板-Chakra-Crystals文章框架.md) v2 | **方法论参考** —— 模块化思路 + 合规标准化 + 差异化防控 + 工具联动模式直接复用 |
| [模板-Angel-Numbers文章框架](模板-Angel-Numbers文章框架.md) | **交叉延展参考** —— 未来「Chinese Zodiac × Angel Numbers」（如 Dragon Year Lucky Numbers & Crystals）用天使号码框架交叉 |

---

## 17. 选题清单 + 发布优先级（约 25 篇规模，围绕 2026 时效）

### 核心 14 篇（本框架直接生产）—— 按 2026 时效排序

| 批次 | # | 选题 | URL | 类型 | 优先级 | 理由 |
|---|---|---|---|---|---|---|
| **P0** | 1 | 2026 Fire Horse Crystals 年度子页 | `/chinese-zodiac/fire-horse-2026/` | 年度子页 | **P0（首发）** | 时效最强，2026 火马年核心入口 |
| **P1** | 2 | Horse 生肖页（2026 本命年） | `/chinese-zodiac/horse-crystals/` | 生肖页 | **P1** | 2026 本命年，时效 + 本命年长尾 |
| **P1** | 3 | Dragon 生肖页 | `/chinese-zodiac/dragon-crystals/` | 生肖页 | **P1** | 高搜索，最 coveted sign |
| **P1** | 4 | Rabbit 生肖页 | `/chinese-zodiac/rabbit-crystals/` | 生肖页 | **P1** | 高搜索 + Vietnam Cat 变体深度 |
| **P1** | 5 | Snake 生肖页（2025 蛇年余温） | `/chinese-zodiac/snake-crystals/` | 生肖页 | **P1（提高）** | 2025 蛇年刚过 + 年度转换 + 本命年回响 |
| **P2** | 6 | Tiger 生肖页 | `/chinese-zodiac/tiger-crystals/` | 生肖页 | P2 | 三合（Horse）联动 |
| **P2** | 7 | Dog 生肖页 | `/chinese-zodiac/dog-crystals/` | 生肖页 | P2 | 三合（Horse）联动 |
| **P2** | 8-12 | Ox / Goat / Monkey / Rooster / Rat / Pig | `/chinese-zodiac/{animal}-crystals/` | 生肖页 | P2 | 其余生肖 |
| **P3** | 13 | 常青主 hub | `/chinese-zodiac/year-crystals/` | 常青 hub | **P3（最后发）** | **6-8 篇生肖上线后再发**，避免早期空链 |
| **P3** | 14 | 静态生肖年表页（工具降级） | `/chinese-zodiac/find-your-sign/` | 工具降级页 | **P3（随首批文章同步上）** | 文章 CTA 降级目标，防空指针 |

**发布顺序逻辑**：先 P0 年度子页（时效最强）→ P1 Horse（本命年）/Dragon/Rabbit/Snake → P2 其余生肖 → P3 常青 hub（6-8 篇上线后发，避免空链）+ 静态年表页（随首批同步，承接 CTA）。

### 交叉延展 11 篇（达 25 篇规模，后续批次）
| 选题 | 类型交叉 | URL 模式 |
|---|---|---|
| Dragon Year Lucky Numbers & Crystals | Chinese Zodiac × Angel Numbers | `/chinese-zodiac/dragon-lucky-numbers/` |
| {Animal} × Western Sign Dual Guide（3-5 篇精选） | Chinese × Western Zodiac | `/chinese-zodiac/dragon-leo-crystals/` |
| Ben Ming Nian: Crystals for Your Zodiac Year | 本命年专题 | `/chinese-zodiac/ben-ming-nian-crystals/` |
| Chinese Zodiac Compatibility × Crystals（3 合/6 合） | 兼容性 × 水晶 | `/chinese-zodiac/{a}-{b}-compatibility-crystals/` |
| Jade in Chinese Culture: The Stone of Heaven | Eastern 玉石专题 | `/chinese-zodiac/jade-stone-of-heaven/` |

> 交叉延展篇数/优先级由后续批次三源验证定（本框架只规划核心 14 篇 + 交叉方向，不擅自定稿）。

---

## 附录：v1 → v2 变更摘要（用户两轮审查 14 点落实）

1. **year_boost 可切换字段**：数据层加 `year_boost`（每生肖）+ 顶层 `current_year` + 年度刷新机制（§3 / §14 / 数据层 `_meta`）
2. **Title evergreen**：主标题不写死 2026，时效词移 description/M3/FAQ（§1）
3. **hub 可持续 URL**：常青 `/chinese-zodiac/year-crystals/` + 年度子页 `fire-horse-2026/`（2027 归档/301）（§1 / §8 / §17）
4. **蓝海诚实修正**：改「首饰站角度蓝海，但 SERP 有强占位者」，护城河=深度+避讳石独占（文档顶部 / §0）
5. **M3 词数校准**：每主石 120-160 词，4 维 600-750 + 备选 = 750-950，重点页可 1200，禁凑字（§2 / §3）
6. **M2 强制事实表**：生肖/中文名/元素/近年/兼容/主题/本年度影响（§2 / §2.1）
7. **本命佛谨慎措辞**：「in some East Asian Buddhist-inspired traditions」（§13.1）
8. **文化数据锁死**：本命佛/五行/Tai Sui/兼容性预填锁死，只读不重写（§13.1）
9. **工具 CTA 降级**：静态生肖年表页 `/chinese-zodiac/find-your-sign/`（§11.1 / §17）
10. **M4 避免重复 M3**：生活化需求场景对照表，M3 偏知识/M4 偏行动（§2.1 / §4）
11. **M5 佩戴合规**：「左进右出」用 traditionally/symbolically，禁化太岁/保证（§5）
12. **M7 双镜头**：不做 Dragon=Leo 硬等号，条件式「If you're X and Y」+ 解释差异（§7）
13. **M6 合规硬化**：必填缓和语 + 二审硬扫描词表（harmful/bad for/should never wear/will bring bad luck/clashes with）（§6.2）
14. **Schema Product 谨慎**：无真实商品卡片禁用 Product，M3 用 ItemList/Article（§10）
15. **FAQ 7 问固定**：加年份边界（Jan/Feb 农历新年）+ 文化变体（Vietnam Cat/Japan Boar）（§12 / §12.1）
16. **M2/M3/M4 语气物理区隔**：M2 讲文化/M3 讲知识 why/M4 讲场景行动（§2.1）
17. **发布优先级**：P0 年度子页 → P1 Horse/Dragon/Rabbit/Snake → P2 其余 → P3 常青 hub（6-8 篇后）+ 静态年表页（§17）
