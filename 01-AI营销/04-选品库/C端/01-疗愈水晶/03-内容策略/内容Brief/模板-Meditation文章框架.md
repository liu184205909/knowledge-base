# Meditation 文章框架 v2（9 篇场景化冥想系列）

> **适用**：`/{scene}-meditation/` 场景化冥想系列文章（9 篇，1 枢纽 + 6 场景深度 + 2 延伸）
> **竞品依据**：Tiny Rituals / Energy Muse / Conscious Items（清单型）/ Verywell Mind（科普型）/ Crystal Vaults / The Crystal Council / Healing Crystals / Moonrise（SERP 2026-06-27 抓取对比，三源研究 agent 报告）
> **数据**：`_shared/meditation-knowledge.json`（6 场景 × 水晶 5 角色 + Eastern 锚点 + chakra + shop_category 单源）+ `_shared/crystal-attributes.json`（390 颗 mineral+safety）+ `_shared/mineral-safety-reference.json`（措辞校准表）+ `_shared/chakra-knowledge.json`（七脉轮）+ 1.crystal-meaning/
> **v2 升级要点**：
> 1. **场景化分步冥想流程**（核心差异化，竞品全无）：每篇 5-7 步具体冥想引导（不是"选石→放石→冥想"的通用 3 步），含呼吸节奏/体感引导/时长/收尾
> 2. **Eastern 冥想传统锚点**（藏传 Dream Yoga/Milam + 瑜伽 Niyasa + 玉石文化）：每篇 ≥2 锚点，差异化于西方纯 Wicca/mindfulness 叙事
> 3. **首饰角度贯穿**（手链戴法/项链贴脉轮/贴身佩戴冥想）：站点主营水晶首饰的天然优势，竞品 0 覆盖
> 4. **三视角自然融入**（科学 40% 矿物学/颜色心理 + 灵性 40% 传统/脉轮 + 心理 20% 正念/placebo 平衡），不单独标注小标题
> 5. **合规非疗效 claim**：用 support/invite/gentle companion/mindful anchor，禁 cures/heals/treats anxiety/insomnia/depression；Sleep 用 "bedtime ritual/wind down"，Emotional 用 "emotional release practice"
> 6. **HowTo Schema 6 步通用流程**（场景是变体）+ Article + FAQPage + BreadcrumbList，全量 JSON-LD 手动推送 `rank_math_schema`（Rank Math 不自动生成 HowTo/FAQPage）
> 7. **Cleansing Timer 双向联动**：文章侧决策卡片 CTA → `/tools/crystal-cleansing-timer/`（工具侧回链位置列出供用户改）
> 8. **与 How-to H5 区隔**：H5 泛教程 5 步轻量（`/blog/how-to-meditate-with-crystals/`，未上线），Meditation 系列场景深度（场景分步流程 + 5-7 步 + 首饰 + Eastern）

---

## 0. 批次定位、差异化与场景蓝海

### 为什么做这批（基于三源研究结论）

- **流量真相**（三源校准，非伪信号）：Seed-Master "Meditation Pillar" ~3M volume 中大头是泛"meditation"纯冥想词（guided meditation/meditation for beginners），真实可切的是"crystals for X meditation"场景词约 5 万-15 万。本批次不抢纯冥想词（竞不过 Calm/Headspace），只切场景化"crystals + meditation + {场景}"长尾。
- **蓝海真实度中-高**：SERP 前列无权威垄断（Tiny/EM 清单型 + Verywell 科普型），场景化分步教程（focus/sleep/emotional/grounding）是真实蓝海——竞品给清单不给流程。
- **AIO 普遍存在但源非权威**（Reddit/YouTube/小站）：GEO 可争 citation，结构化分步 + Eastern 传统 + 矿物学事实是差异化信号。
- **4 竞品对比**：CV（condition 页有内容）/ TCC（3 篇分散）有内容，Tiny/EM 清单型无场景化体系，Healing Crystals/Moonrise 完全空白。

### 独家壁垒（v2 核心）

1. **场景化分步冥想流程**（竞品 0/6 覆盖）：不是"放石头冥想"，是"第 1 步 settling breath（4-7-8）→ 第 2 步 hold stone（左手接收）→ 第 3 步 body scan with crystal（脚→顶）→ 第 4 步 visualization（场景专属）→ 第 5 步 closing anchor（触摸 stone 收尾）"——可执行的引导脚本。
2. **Eastern 冥想传统**（藏传 Dream Yoga/Milam 睡眠瑜伽、瑜伽 Niyasa 石头摆放、玉石文化、om 音钵）：差异化于西方纯 Wicca/sage/mindfulness，与站点 Eastern-inspired crystal jewelry 定位契合。
3. **首饰角度**（手链戴非主导手接收、项链吊坠贴心轮、贴身佩戴冥想热传导感）：竞品多为原石/晶簇站无首饰实操。
4. **Cleansing Timer 联动**（冥想前净化石头的安全检查）：全行业独有工具。
5. **三视角**：把竞品纯灵性叙述补上矿物学硬事实（压电效应 piezoelectricity、颜色心理学、placebo 平衡效应）。

### 9 篇清单与优先级

| # | 文章 | URL | 场景 | 主词方向 | 优先级 | 角色定位 | 资源投入 |
|---|------|-----|------|---------|--------|---------|---------|
| M0 | Best Crystals for Meditation | `/best-crystals-for-meditation/` | 13 水晶总览 + 按场景导流 | best crystals for meditation | P1 | 枢纽页 | 枢纽级 |
| M1 | Focus & Concentration Meditation | `/crystals-for-focus-meditation/` | 专注冥想 | crystals for focus meditation | **P0** | 场景深度 | 深度级 |
| M2 | Sleep Meditation (Bedtime Ritual) | `/crystals-for-sleep-meditation/` | 睡前冥想 | crystals for sleep meditation | **P0** | 场景深度 | 深度级 |
| M3 | Emotional Release Meditation | `/crystals-for-emotional-release-meditation/` | 情绪释放 | crystals for emotional release meditation | **P0** | 场景深度 | 深度级 |
| M4 | Grounding Meditation | `/grounding-meditation-with-crystals/` | 扎根 | grounding meditation with crystals | P1 | 场景深度 | 深度级 |
| M5 | Beginners Meditation | `/meditation-crystals-for-beginners/` | 入门 | meditation crystals for beginners | P1 | 场景深度 | 轻量级 |
| M6 | Manifestation Meditation | `/manifestation-meditation-with-crystals/` | 显化 | manifestation meditation with crystals | P1 | 场景深度 | 深度级 |
| M7 | Crystal Meditation Script | `/crystal-meditation-script/` | 5 现成脚本 | crystal meditation script | P2 | 延伸 | 轻量级 |
| M8 | Meditation Room Crystals | `/meditation-room-crystals/` | 空间布置 | meditation room crystals | P2 | 延伸 | 轻量级 |

**篇幅目标**：
- M1/M2/M3/M4/M6（P0/P1 场景深度）：2000-3000 词（5-7 步分步流程 + 5-7 颗水晶 + Eastern + 首饰 + FAQ）
- M0（枢纽）：2500-3000 词（13 水晶总览 + 场景导流矩阵）
- M5/M7/M8（轻量）：1500-2000 词

**与 How-to H5 区隔**（防重复）：
- H5 `/blog/how-to-meditate-with-crystals/`：泛教程 5 步（选石/净化/摆放/呼吸/收尾），轻量入门，URL 带 `/blog/`
- M0-M8：场景深度，URL 根级 `/{scene}/`，每篇专属场景分步流程 + 水晶三要素 + Eastern + 首饰角度
- **生产前 diff 校验**：M 系列的 HowTo step 文本必须与 H5 明显不同（M 是场景专属脚本，H5 是通用流程）

---

## 1. URL + TKD 规则

- **URL**：根级 `/{scene}-meditation/` 或 `/{scene}-meditation-with-crystals/`（WP permalink 根级 post，不带 `/blog/`）
- **Title（SEO，主词靠前 + 场景钩子）**：
  - M0：`Best Crystals for Meditation: 13 Stones by Goal (Focus, Sleep, Calm)`
  - M1：`Crystals for Focus & Concentration Meditation: Stones, Steps & Script`
  - M2：`Crystals for Sleep Meditation: Bedtime Ritual Stones & Script`
  - M3：`Crystals for Emotional Release Meditation: Stones & Healing Practice`
  - M4：`Grounding Meditation with Crystals: Stones, Steps & Script`
  - M5：`Meditation Crystals for Beginners: 5-Step Start + 6 Stones`
  - M6：`Manifestation Meditation with Crystals: Stones, Steps & Script`
  - M7：`Crystal Meditation Script: 5 Ready-to-Use Guided Sessions`
  - M8：`Meditation Room Crystals: How to Set Up Your Space`
- **H1（可读，可与 Title 不同）**：场景化标题（如 "How to Use Crystals for Focus Meditation"）
- **Primary KW**：每篇主词（见 §0 表）
- **rank_math 三件套**：title / description（155 字符内含主词 + 差异化钩子 "with script" / "Eastern" / "safe stones"）/ focus_keyword

---

## 2. 模块结构表（8 模块 + 场景分步核心）

> 三视角分配：**科学 40% + 灵性 40% + 心理 20%**，自然融入正文，不单独标注小标题。

| # | 模块 | H2 | 词数 | 内容要点 | 三视角侧重 |
|---|------|----|------|---------|-----------|
| M1 | **Hero 场景痛点切入** | `Why {Scene} Meditation?` | 150-250 | 场景痛点（focus: 注意力碎片 / sleep: 辗转难眠 / emotional: 情绪积压 / grounding: 失根感）+ 水晶作为"mindful anchor"的定位（非疗效）+ 三视角开篇（科学矿物学事实 + 传统 + 正念心理） | 三视角均衡 |
| **M2** | **Why {Scene} Needs Crystals** ⭐差异化 | `How Crystals Support {Scene} Meditation` | 300-450 | 该场景为什么用水晶（矿物学：压电效应/颜色心理/触觉锚定 + 传统：脉轮/文化 + 心理：placebo/正念触点）+ Featured Snippet bait（3 点 bullet） | 科学 + 灵性 |
| **M3** | **Best Crystals（5-7 颗 + 首饰角度 + mineral-safety）** ⭐核心 | `Best Crystals for {Scene} Meditation` | 500-700 | 5-7 颗水晶（按角色分配：主商业/语义匹配/入门价/进阶/安全警示/首饰场景），每颗含三要素（科学矿物属性 + 灵性传统关联 + 心理正念用法）+ safety 提示（查 mineral-safety-reference）+ Shop CTA（3 级优先验证） | 灵性 + 转化 |
| **M4** | **Step-by-Step {Scene} Meditation（场景化分步）** ⭐⭐核心差异化 | `How to Meditate with Crystals for {Scene}: {N} Steps` | 600-900 | **场景专属 5-7 步冥想脚本**（非通用 3 步）：每步含呼吸节奏/体感引导/时长/水晶用法。例 M2 Sleep：settling breath(4-7-8) → hold stone → body scan → dream visualization → closing。**这是竞品全无的差异化** | 三视角均衡 |
| **M5** | **Scene Ritual（Eastern 藏传/瑜伽 + Western）** ⭐差异化 | `{Scene} Rituals: Eastern & Western Traditions` | 250-400 | Eastern 锚点 ≥2（藏传 Dream Yoga/Milam、瑜伽 Niyasa、玉石文化、om 音钵）+ Western 正念传统（MBSR/ritual framing），文化泛述非挪用 | 灵性 + 心理 |
| **M6** | **Jewelry in {Scene} Meditation** ⭐独家 | `Wearing Crystals During {Scene} Meditation` | 150-250 | 首饰角度：手链戴非主导手（接收）、项链吊坠贴心轮/喉轮（场景对应脉轮）、贴身佩戴冥想热传导感、worry stone 转手掌替代 | 转化 |
| **M7** | **FAQ（5-8 问抓 PAA）** | `FAQ About {Scene} Meditation with Crystals` | 250-400 | 三层分层（见 §10）+ Cleansing Timer 决策卡片 CTA | 信任合规 |
| **M8** | **Related + 工具 CTA** | `Related Meditation Guides` | 100-200 | 横向互链矩阵（M0-M8）+ Cleansing Timer 双向 CTA + condition/intention 内链 | 导流 |

---

## 3. 场景化分步冥想流程（M4 核心，竞品全无 = 核心差异化）

> **痛点依据**：6 家竞品 SERP 对比，全是"选 5 颗石头放身边冥想"的清单型，0 家给可执行的分步引导脚本。M4 是本批次最强信息密度承载点。

### 3.1 分步流程通用框架（5-7 步，场景是变体）

每篇 M4 必须是**可执行的冥想脚本**（不是"放石头冥想"的通用话），结构：

```
Step 1: Settle & Breath（落定呼吸）— 场景专属呼吸法（focus: box breathing / sleep: 4-7-8 / emotional: sighing breath / grounding: earth breath）
Step 2: Hold & Connect（握石连接）— 左手接收/右手释放（场景定手）+ 触感引导（纹理/温度/重量）
Step 3: Body Scan with Crystal（水晶身体扫描）— 石头随注意力移到场景对应部位（focus: 第三眼 / sleep: 头顶松 / emotional: 心轮 / grounding: 脚底根轮）
Step 4: Scene Visualization（场景可视化）— 专属意象（focus: 单一光点 / sleep: 黑色丝绒幕 / emotional: 流水冲刷 / grounding: 树根入土）
Step 5: Anchor & Intention（锚定意图）— 设一句话意图（场景专属肯定语）
Step 6 (可选): Closing & Transition（收尾过渡）— 触摸石头 3 次收尾 + 场景过渡（sleep: 准备入睡 / focus: 睁眼聚焦 / emotional: 感恩）
Step 7 (可选): Aftercare（后续）— 净化石头（链 Cleansing Timer）+ 记录（journal）
```

### 3.2 各场景 M4 分步变体（防重复，每篇步骤文本必须不同）

| 文章 | 呼吸法 | 握手 | 身体扫描焦点 | 可视化意象 | 收尾 |
|------|--------|------|------------|----------|------|
| M1 Focus | Box breathing（4-4-4-4） | 右手（释放杂念） | 第三眼（眉心） | 单一稳定光点 | 睁眼聚焦物体 30 秒 |
| M2 Sleep | 4-7-8 呼吸 | 左手（接收安顿） | 头顶→全身松弛 | 黑色丝绒幕缓缓落下 | 放下石头，侧身准备入睡 |
| M3 Emotional | Sighing breath（双吸气长呼） | 左手贴心轮 | 心轮（胸骨中） | 流水冲刷带走积压 | 双手捂石感恩 3 件事 |
| M4 Grounding | Earth breath（长呼如扎根） | 双脚踏地+石放手心 | 脚底根轮 | 树根从脚底深入泥土 | 缓慢睁眼感受地面支撑 |
| M5 Beginners | 自然呼吸数 10 息 | 左手握石 | 简单手心→心口 | 温暖光球 | 微笑睁眼 |
| M6 Manifestation | 升调呼吸（吸 4 顶 2 呼 6） | 右手（释放愿景） | 太阳神经丛（脐上） | 目标已实现的画面 | 触石念意图 3 次 |
| M7 Script | 5 个现成脚本（focus/sleep/emotional/grounding/manifest 各一，每个 8-12 步精简版） | — | — | — | — |

### 3.3 Eastern 冥想传统锚点（M5，每篇 ≥2 锚点）

| 文章 | Eastern 锚点 1 | Eastern 锚点 2 |
|------|---------------|---------------|
| M0 枢纽 | 瑜伽 Niyasa（石头沿脉轮摆放序列） | om 音钵（冥想开场/收尾） |
| M1 Focus | 藏传 "single-pointed"（奢摩他 shamatha 单所缘）冥想传统 | 瑜伽 trataka（凝视/凝点法） |
| M2 Sleep | 藏传 Dream Yoga / Milam（梦瑜伽，睡眠作为修行） | 瑜伽 Yoga Nidra（睡眠瑜伽，body scan 起源） |
| M3 Emotional | 慈心冥想（Metta Bhavana，佛教慈心培养） | 瑜伽心轮开启（Anahata 开胸体式 + 石头贴心轮） |
| M4 Grounding | 瑜伽 grounding asana（山式 Tadasana + 树式 Vrksasana） | 道家"接地气"/ 大地冥想（玉石返璞归真） |
| M5 Beginners | 瑜伽入门冥想传统（8 支 Astanga 起手） | 日本禅 zazen（坐禅简素传统） |
| M6 Manifestation | 藏传 Kriya（身语意行动）+ 曼陀罗（mandala 意象可视化） | 瑜伽 sankalpa（正念决心/意图设定） |
| M7 Script | 整合上述传统（每脚本标注出处） | — |
| M8 Room | 藏传佛龛/神坛布置传统（净化空间） | 日本禅 "茶室" 简素空间美学 |

**文化泛述原则**：用 "in the Tibetan tradition of..." / "yoga tradition describes..." / "many cultures..."，**避免** "this will give you dream yoga powers" 等功效 claim。

### 3.4 三视角自然融入示例（不单独标注）

> "Amethyst is a purple quartz (SiO₂) whose color comes from natural irradiation of iron impurities — a mineral fact that explains both its lightfastness concerns and its long association with calm (science). In many traditions, amethyst is placed at the crown during meditation as a symbol of clarity and stillness (spirituality). The act of holding a cool, smooth stone during breathwork also gives the mind a tactile anchor — a well-documented mindfulness principle that works whether or not one believes in the stone's energetic properties (psychology)."

---

## 4. 水晶推荐规则（M3，5-7 颗 + 三要素 + mineral-safety + Shop CTA）

### 4.1 水晶角色分配（每篇 5-7 颗，对齐 angel-numbers v2 §3 内链平衡）

| 角色 | 数量 | 选择标准 |
|------|------|---------|
| 主商业水晶（高毛利/主推） | 1 | 站点主推产品线（常为 Black Tourmaline/Clear Quartz/Rose Quartz 等首饰主力） |
| 场景语义最匹配 | 1-2 | 本场景最相关（focus: Fluorite / sleep: Howlite,Amethyst / emotional: Rose Quartz,Rhodochrosite / grounding: Black Tourmaline,Hematite / manifestation: Citrine,Pyrite） |
| 价格友好（入门） | 1 | Clear Quartz（万能放大）|
| 进阶/小众 | 1 | 带动长尾 meaning 流量（Moonstone/Labradorite/Lepidolite 等） |
| 安全警示石 | 0-1 | 凸显 safety 价值（Selenite 忌水 / Malachite 含铜，措辞按 mineral-safety 校准表） |
| 首饰场景石 | 1-2 | 接 M6 首饰段（手链/项链常戴石） |

### 4.2 每颗水晶三要素（防通用泛泛）

每颗水晶描述必须含三要素（对齐 v2 差异化）：
1. **科学（矿物属性）**：化学式/硬度/压电效应/颜色成因/热传导（40%）
2. **灵性（传统关联）**：脉轮/文化传统/Eastern 锚点（40%）
3. **心理（正念用法）**：触觉锚定/视觉意象/仪式行为（20%）

**禁通用句**：❌ "Amethyst is a calming stone that brings peace" → ✅ 三要素具体（见 §3.4 示例）

### 4.3 Shop CTA 3 级优先（按 shop-cta-no-deadlink-rule，生产前逐颗 REST 验证 200）

1. **特定石类目** `/product-category/{stone}-crystals/`（REST 验证 200）→ 跳该类目
2. **该石产品搜索** `/shop/?s={stone}`（返回 ≥1 产品）→ 跳搜索
3. **都没有** → 总类目 `/product-category/healing-crystals-jewelry/`（200 兜底）

**已验证（2026-06-28）**：
- 有独立类目（CAT 200）：amethyst, black-tourmaline, carnelian, citrine, clear-quartz, hematite, jade, kyanite, labradorite, lepidolite, pyrite, rose-quartz, selenite, shungite, fluorite 走搜索（无独立类目但有产品）, aventurine, bloodstone, red-jasper, larimar, turquoise, smoky-quartz 走搜索
- 走搜索（无独立类目有产品）：howlite, moonstone, fluorite, smoky-quartz, lepidolite 实测 CAT 404 但 SEARCH 有产品
- rhodochrosite / blue-lace-agate：搜索 500 错误 → 走总类目 healing-crystals-jewelry
- meaning 页 `/gemstone/{slug}-meaning/`：大部分上线（200），但 clear-quartz/howlite/moonstone/hematite/lepidolite/kyanite 等 meaning 页 404（未上线）→ **未上线 meaning 页不强链**（只链已验证 200 的）

---

## 5. 首饰角度（M6，站点主营优势，竞品 0 覆盖）

### 5.1 首饰角度场景化（每篇差异化）

| 文章 | 首饰角度 |
|------|---------|
| M1 Focus | 手链戴右手（释放杂念）+ 项链吊坠放第三眼（眉心，躺/坐前倾） |
| M2 Sleep | 手链戴左手腕（不硌）+ Howlite/Amethyst 项链贴心口 + 枕下放石（无佩戴） |
| M3 Emotional | Rose Quartz 项链贴心轮（胸骨中）+ 手链左手接收 |
| M4 Grounding | Black Tourmaline 手链双脚平踏 + 脚踝链（如有） |
| M5 Beginners | 一条手链一个意图 + worry stone 转手掌（替代原石） |
| M6 Manifestation | Citrine 手链戴左手（接收丰盛）+ 吊坠放太阳神经丛 |

### 5.2 首饰冥想通用 tips（M6 汇总）

- 戴哪只手：传统说法左手接收、右手释放（标 "in many traditions"）
- 项链定位：吊坠贴心轮（emotional）/ 喉轮（expression）/ 太阳神经丛（manifestation）
- 贴身佩戴：热传导感作为体感锚定（科学事实：石头比体温低，触感真实）
- worry stone：凹槽转拇指替代握石（便携 + 隐蔽办公场景）

**合规**：不写 "bracelet will protect you"，写 "wear as a daily reminder to..." / "the tactile weight becomes a mindfulness cue"。

---

## 6. Cleansing Timer 工具联动（决策卡片 CTA）

### 工具状态（2026-06-28）
- **URL**：`/tools/crystal-cleansing-timer/`（已上线 200）
- **功能**：选水晶 → safety 检查 → 推荐净化法 → 倒计时 + 步骤
- **数据单源**：`cleansing-knowledge.json` + `crystal-attributes.json` + `mineral-safety-reference.json`

### 6.1 决策卡片 CTA（文章侧，非普通内链）

**M4 分步流程 Step 7 Aftercare 或 M3 末必加决策卡片**：

```markdown
> 💡 **Before your next session, is your stone ready?**
> Crystals used in meditation benefit from regular cleansing. Enter your stone name in the **[Crystal Cleansing Timer](/tools/crystal-cleansing-timer/)** →
> check its water/salt/sun safety, get the recommended method, and start a guided countdown.
```

**卡片位置**：M4 末（主决策卡，9 篇全加）+ M7 FAQ 前（底部曝光卡，P0 篇加）。

### 6.2 双向 CTA（工具侧回链，列出供用户改）

工具 `cleansing-timer/build/seo-content.html` 加 "Meditation Guides" 段（位置供用户改）：
- "Read: **Best Crystals for Meditation**" → `/best-crystals-for-meditation/`
- "Focus session: **Crystals for Focus Meditation**" → `/crystals-for-focus-meditation/`
- "Sleep ritual: **Crystals for Sleep Meditation**" → `/crystals-for-sleep-meditation/`
- （其余 M3-M8 按需补）

---

## 7. 内链规则（≥ Crystal Meaning + condition + intention + 工具 + 横向互链）

每篇内链下限：

| 链接到 | 数量 | 位置 | 说明 |
|--------|------|------|------|
| Crystal Meaning（gemstone 页） | ≥3 | 正文首次提及每颗石 | 只链已验证 200 的（amethyst/rose-quartz/citrine/selenite/black-tourmaline/fluorite/smoky-quartz/labradorite/pyrite/jade 等），未上线的不强链 |
| Crystals by Condition | ≥1（适用篇） | M3 推荐区 | M2→/crystals-for-sleep/、M3→/crystals-for-anxiety/（已验证 200）；emotional-release 未上线不链 |
| Intention Page | ≥1 | M6/M8 | calm-mindfulness（200 已验证）；其他 intention 页 404 不链 |
| Cleansing Timer 工具（决策卡片） | ≥1（全 9 篇） | M4 末 + M7 | 见 §6.1 决策卡片组件 |
| **M0 枢纽（hub 内链矩阵）** | ≥1（M1-M8 必链） | M8 Related | "For the full crystal overview, see Best Crystals for Meditation" |
| 横向互链（M1-M8 互链） | ≥2 | M8 Related | 场景互补（focus↔sleep↔grounding） |
| Shop 总类目 | ≥1 | M3/M6 末 | /product-category/healing-crystals-jewelry/（200 兜底） |
| How-to H5（泛教程） | 0-1 | M5 | "For a general 5-step intro, see How to Meditate with Crystals"（H5 未上线，链了接受临时 404，或暂不链） |

**横向互链矩阵**（场景互补）：
- M1 Focus ↔ M5 Beginners（专注是入门第一场景）
- M2 Sleep ↔ M3 Emotional（睡前情绪释放互补）
- M4 Grounding ↔ M3 Emotional（扎根支持情绪稳定）
- M6 Manifestation ↔ M1 Focus（显化需专注）
- M7 Script → 全 M1-M6（脚本汇总导流）
- M8 Room → 全 M0-M7（空间布置支持所有场景）

---

## 8. 图片配置

| 图片类型 | 规格 | 数量 | 内容 |
|---------|------|------|------|
| Hero | 1536×864 | 1 | 场景视觉（focus: 单光点+水晶 / sleep: 月光+枕边石 / emotional: 心轮+流水 / grounding: 脚踏大地+黑石）|
| 冥想分步示意 | 1200×800 | 1-2 | 关键步骤（呼吸/握石/身体扫描/可视化）场景化 |
| 水晶图 | 复用 390 图库 | 3-5 | M3 推荐水晶（复用已有 img） |
| 首饰场景 | 1200×800 | 0-1 | 手链/项链佩戴冥想场景（M6） |

**文件名规范**：`{slug}-hero.webp` / `{slug}-{step}.webp`（如 `crystals-for-sleep-meditation-breath.webp`）
**生图**：复用 `9.angel-numbers/scripts/generate-images.js` 模式，scene 风格（真实水晶摄影无文字），设 NODE_PATH 全局 sharp，loadEnv 强制覆盖。

---

## 9. FAQ 三层分层（M7）

### 第一类：主搜索意图（必含 3-4 问）
- What are the best crystals for {scene} meditation?
- How do I use crystals in {scene} meditation?（引出 M4 分步）
- How long should a {scene} crystal meditation be?
- Can I use any crystal for {scene} meditation?

### 第二类：高转化意图（必含 2-3 问）
- Which crystal should I wear for {scene}?（接 M6 首饰）
- Do I need to cleanse my meditation crystals?（接 Cleansing Timer）
- Can beginners do {scene} crystal meditation?（接 M5）

### 第三类：信任与合规（必含 2 问）
- Is there scientific evidence that crystals help meditation?（**中性答**：矿物学事实真实如压电效应/触觉锚定；能量属性是传统信仰，no scientific evidence crystals emit energy；可作为正念仪式提升体验）
- Will the wrong crystal interfere with my meditation?（引出 safety + 无害化答）

**合规**：FAQ 答案与 Schema FAQPage 严格一致（同数据块生成页面 + schema）。

---

## 10. 合规（不疗效 claim）+ 合规转化句式库

### 10.1 合规（遵循品牌语调）

**禁用表达**：
- ❌ "cures/treats/heals anxiety, insomnia, depression"
- ❌ "removes negative energy / blocks negativity"
- ❌ "amplifies healing power / awakens magical properties"
- ❌ "guaranteed to / will definitely"

**推荐表达**：
- ✅ "support / invite / gentle companion / mindful anchor"
- ✅ "traditionally associated with / many people experience / in many traditions"
- ✅ "use as a mindfulness ritual, not a medical substitute"

**场景专属合规措辞**：
- **M2 Sleep**：用 "bedtime ritual / wind-down practice / settling into rest"，**禁** "cures insomnia / treats sleep disorders"
- **M3 Emotional**：用 "emotional release practice / holding space for feelings"，**禁** "treats depression / heals trauma"
- **M1 Focus**：用 "supporting attention / single-pointed practice"，**禁** "cures ADHD / treats attention disorders"

**固定 Gentle Note**（M7 FAQ 前，全站统一）：
> "Crystal meditation practices draw on spiritual traditions, symbolism, and personal mindfulness. There is no scientific evidence that crystals store or release energy, but the mineral properties (piezoelectricity, color, thermal conductivity) and the mindfulness principle of tactile anchoring are real — and a meditation ritual can be meaningful whether or not one believes in a stone's energetic properties. Crystals are not a substitute for medical or mental health care."

### 10.2 合规转化句式库（v2，卖点基于体验非功效）

| # | 场景 | ❌ 功效句（禁用） | ✅ 合规转化句（采用） |
|---|------|----------------|-------------------|
| 1 | Amethyst（sleep） | "Cures insomnia" | "A stone many keep on their nightstand as part of a **wind-down ritual** before bed" |
| 2 | Fluorite（focus） | "Boosts brain power" | "A multi-colored stone many place at their desk as a **visual anchor for single-tasking**" |
| 3 | Rose Quartz（emotional） | "Heals heartbreak" | "A soft pink stone many hold over the heart during **emotional release practice**" |
| 4 | Black Tourmaline（grounding） | "Blocks negative energy" | "A popular choice for a **grounding touchstone** during seated meditation" |
| 5 | Citrine（manifestation） | "Attracts wealth" | "A warm-toned stone many use as a **tactile cue for an intention** they're working toward" |
| 6 | Clear Quartz（通用） | "Amplifies healing" | "A versatile piece collectors describe as a **neutral staple** for any practice" |
| 7 | Howlite（sleep） | "Cures insomnia" | "A white stone with grey veining many tuck under their pillow as part of a **bedtime ritual**" |
| 8 | 首饰 CTA | "Wear for protection" | "Wear as a **daily reminder of an intention** you've set in meditation" |

---

## 11. Schema 配置（Rank Math，全量手动推送）

> **关键发现（2026-06-28 线上验证）**：Rank Math **自动生成** Article(BlogPosting)/BreadcrumbList/Organization/WebSite，**不自动生成** FAQPage/HowTo（全站 0 篇 HowTo）。故 FAQPage + HowTo 必须通过 `rank_math_schema` meta 手动推送完整 JSON-LD。

### 11.1 Schema 总览（每篇手动推送 `rank_math_schema`）

| Schema | 来源 | 字段 |
|--------|------|------|
| Article | Rank Math 自动 + 手动补全 | headline / datePublished / dateModified / author / image |
| FAQPage | **手动推送**（Rank Math 不自动） | M7 FAQ 问题答案（与页面严格一致） |
| HowTo | **手动推送**（核心差异化） | M4 场景化 6 步流程（通用框架的 6 步，见 §3.1） |
| BreadcrumbList | Rank Math 自动 | Home > Meditation > {Scene} Meditation |

### 11.2 HowTo Schema 6 步通用流程（场景是变体）

**核心**：HowTo 是 M4 分步流程的 6 步通用版（非场景专属变体的全部 7 步），场景差异体现在 step name/text。

| Step | name（通用） | text（场景变体） |
|------|-------------|----------------|
| ① | Settle with a breath technique | 场景专属呼吸法（focus: box breathing / sleep: 4-7-8 等） |
| ② | Hold your chosen crystal | 握石（左/右手按场景）+ 触感引导 |
| ③ | Body scan with the crystal | 石头随注意力移到场景对应部位 |
| ④ | Scene visualization | 专属意象（光点/丝绒幕/流水/树根） |
| ⑤ | Set an intention or affirmation | 场景专属肯定语 |
| ⑥ | Close and transition | 触摸石头收尾 + 场景过渡（入睡/睁眼/感恩）|

**关键字段**：
- `name`：`How to Meditate with Crystals for {Scene}`
- `totalTime`：场景推荐时长（M1: PT10M / M2: PT15M / M3: PT12M / M4: PT10M）
- `step[]`：6 步
- `supply[]`：场景水晶 + 可选配件（瑜伽垫/蜡烛/音钵）

### 11.3 rank_math_schema 推送格式

upload 脚本的 `setRankMath` 必须额外推送 `rank_math_schema` 字段（JSON 字符串），含完整 Article + FAQPage + HowTo + BreadcrumbList 的 JSON-LD 数组。

---

## 12. 数据层 meditation-knowledge.json 字段设计

建 `_shared/meditation-knowledge.json`（9 篇配置 + 6 场景 × 水晶 5 角色 + Eastern 锚点 + chakra + shop_category）：

```json
{
  "_meta": {
    "purpose": "Meditation 系列 9 篇单源（文章 + 未来工具共用）",
    "version": "v1.0",
    "created": "2026-06-28",
    "data_snapshot": {
      "crystal_attributes_version": "v1.1",
      "mineral_safety_reference_version": "v1.0",
      "chakra_knowledge_version": "v1.0",
      "verified_date": "2026-06-28"
    }
  },
  "scenes": {
    "focus": {
      "name": "Focus & Concentration",
      "pain_point": "fragmented attention, constant context-switching",
      "breath": "box breathing (4-4-4-4)",
      "hold_hand": "right (release distraction)",
      "scan_focus": "third eye (between brows)",
      "visualization": "single stable point of light",
      "chakra": "third-eye",
      "eastern": ["Tibetan shamatha (single-pointed)", "yoga trataka"],
      "duration": "10-15 min",
      "crystals": {
        "semantic_match_1": {"slug": "fluorite", "role": "focus-organizer"},
        "semantic_match_2": {"slug": "clear-quartz", "role": "clarity-amplifier"},
        "main_commercial": {"slug": "hematite", "role": "grounding-focus"},
        "entry_price": {"slug": "tiger-eye", "role": "alert-calm"},
        "jewelry_scene": {"slug": "amethyst", "role": "third-eye-bracelet"}
      }
    }
    // ... sleep / emotional / grounding / beginners / manifestation
  },
  "articles": [
    {
      "id": "M0", "slug": "best-crystals-for-meditation", "url": "/best-crystals-for-meditation/",
      "title": "Best Crystals for Meditation: 13 Stones by Goal",
      "h1": "Best Crystals for Meditation",
      "primary_kw": "best crystals for meditation",
      "scene": "hub", "priority": "P1", "tier": "hub",
      "word_target": 2800,
      "concept_focus": "13 crystals overview + scene routing matrix",
      // ... crystals(M0 用 13 颗总览) / howto_6_steps / faq_picks / internal_links / image_plan / schema / compliance
    }
    // M1-M8
  ]
}
```

**字段说明**：
- `scenes.{scene}.crystals.*.slug` 必须存在于 `crystal-attributes.json`（390 颗之一）+ mineral-safety-reference
- `articles[].crystals` 覆盖默认场景水晶（个别篇可替换）
- `shop_category` 生产时逐颗验证覆盖（§4.3）
- `data_snapshot` 记录数据源版本（JSON 改动触发文章更新）

---

## 13. 生产流程（一次 9 篇，统一把控重复度）

> **核心**：9 篇一次生产（非分批），重复度统一把控——每场景 M4 分步流程 + M2 水晶三要素 + M5 Eastern 差异化，跨场景 FAQ 后半差异化。

### 阶段 1：框架 + 数据层（当前）
1. 本框架审核（已完成）
2. 建 `_shared/meditation-knowledge.json`（9 篇 config + 6 场景水晶/Eastern/chakra）

### 阶段 2：骨架 + AI 填充（一次 9 篇）
3. 建生产目录 `04-内容生产/14.meditation/`（articles/configs/scripts/images/_placeholders）
4. `generate-articles.js` 读 meditation-knowledge 产出 8 模块骨架（参数化场景水晶 + 分步流程 + Eastern + 首饰 + FAQ + Schema）
5. AI 填充（_placeholders + fill，BATCH=2 避智谱限流，glm 质量门）：
   - **统一把控重复度**：M4 分步流程每篇场景专属（呼吸/握手/扫描/可视化全不同）、M2 水晶三要素非通用、M5 Eastern 锚点每篇 ≥2 且不同、FAQ 后半（信任类）跨场景差异化措辞
6. `validate-meditation.js` 二审（场景差异化 / 水晶三要素非通用 / 非疗效 claim 扫描 cures-heals-treats / 跨场景重复度 / 占位符残留 / 字数）

### 阶段 3：图片 + 上传
7. `generate-images.js`（hero 场景视觉 + 冥想分步 + 水晶，gpt-image-2，loadEnv 强制覆盖，NODE_PATH sharp）
8. `upload-meditation.js`（URL 根级 `/{slug}/`，分类 meditation 建，Shop wc/store 验证，Cleansing Timer CTA 双向，rank_math + **全量 Schema 手动推送 Article+FAQPage+HowTo+BreadcrumbList**）

### 阶段 4：防假完成验证
9. WP REST GET 验证每篇 featured_media + content img + rank_math_schema（含 HowTo/FAQPage）+ status，**附证据**

---

## 14. 与现有框架对齐说明

| 维度 | 对齐对象 | 对齐点 |
|------|---------|--------|
| 模块表格式 | How-to v2 §2 / Angel-Numbers v2 §2 | 8 模块 + H2 + 词数 + 要点，核心 ⭐ 标注 |
| 三视角 | How-to v2 §11 | 科学+灵性+心理不单独标注 |
| 合规 | How-to v2 §11 + 品牌语调 §4 | traditionally/many people + 场景专属合规措辞 + 句式库 |
| 工具联动 | How-to v2 §7（cleansing-timer）| 决策卡片 CTA + 双向 + 数据单源 |
| 水晶内链 | Angel-Numbers v2 §3 | 5-7 角色分配 + 三要素 |
| Shop CTA | shop-cta-no-deadlink-rule | 3 级优先逐颗验证 200 |
| 数据层 | Angel-Numbers v2 §12 / How-to v2 §13 | JSON 参数化 + data_snapshot |
| Schema | How-to v2 §12 | Article+FAQPage+HowTo+Breadcrumb，HowTo 6 步 + **手动推送（v2 独有，修正 How-to 批次遗漏）** |
| 生产流程 | How-to v2 §14 | 竞品研究→数据校验→骨架→AI填充→合规校验→二审→图片→上传+验证 |

**本批次独有差异化**（其他框架无）：
1. **场景化分步冥想流程**（M4，竞品全无，每篇 5-7 步可执行脚本）
2. **Eastern 冥想传统锚点**（M5，藏传 Dream Yoga/瑜伽 Niyasa/玉石文化，每篇 ≥2）
3. **首饰冥想角度**（M6，手链戴法/项链贴脉轮/热传导，竞品 0 覆盖）
4. **场景合规措辞**（Sleep/Emotional/Focus 各自禁用词 + 合规替代）
5. **HowTo Schema 全量手动推送**（修正 How-to/angel-numbers 批次 schema 遗漏，v2 独有）
6. **与 How-to H5 区隔**（场景深度 vs 泛教程，URL 意图错开防双占位）
