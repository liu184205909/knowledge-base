# 1I-T3 单石×sleep 深化研究

> **阶段**: sleep 线 T3（单石×sleep 深页，如 amethyst-for-sleep）专项深化
> **日期**: 2026-07-09
> **上游**: [1I-sleep内容线研究.md](1I-sleep内容线研究.md)（sleep 线全貌，5 类页面，T3 = 其第 3 类）
> **数据源**: ① serp_check 实测 8 个 {crystal}-for-sleep 词（location=us, device=mobile, language=en，2026-07-09）+ ② 390 meaning 库 5 颗目标水晶 crystal-profile 字段实读（Explore agent，2026-07-09）+ ③ 线上 condition 目录现状（recovery json，post 40530/40861）+ ④ 2A 网站结构 URL 规则 + ⑤ condition-configs 相邻页（anxiety/stress/peace）水晶重叠核查
> **目的**: 回答 4 个核心问题——① crystals-for-sleep 跟 condition 是否重叠 ② 单石×sleep 矩阵能否扩展 ③ 关键词生态 ④ 390 库 sleep 覆盖——并给出 T3 单石优先级
> **⚠️ 对 1I 的关键修正**: 1I 把 T1（crystals-for-sleep hub）列为"待做首发批次"，**但该页线上已 publish（post 40530，2026-06-19 恢复）**。T3 深化基于"T1 已存在"的现实重新定位单石页角色。

> **2026-07-09 架构再裁决**: sleep 不再定义为独立站点一级 vertical，也不再简单视为 `Crystals For Condition` 下的一个普通 spoke。已创建 `Crystals` 父类目（cat 1590）和 `Sleep Crystals` 二级类目（cat 1591，URL `/category/crystals/sleep-crystals/`）。`Sleep Crystals` 是 Crystals 体系下的专题聚合类目，可用 Elementor 深度定制为完整 Hub；T2/T3/T4/T5 先作为普通 post 归入该类目。`/crystals-for-sleep/`（post 40530）已同时归入 cat 1544 + 1591；是否保留为独立 pillar post，取决于 `Sleep Crystals` 类目页能否完整承接现有 8 石 Hub 内容；若完整承接，可后续合并并 301。
> **下游生产模板**: [模板-Sleep-Crystals文章框架.md](../03-内容策略/内容Brief/模板-Sleep-Crystals文章框架.md) 已承接 T3 单石 URL、Brief 输入、Seed 缺口、P0/P1/P2 排期与 Hub 回链规则；单石生产以该模板 + 本文 §4.5 H2 骨架共同为准。

---

## 一、重叠判断（核心问题 1）

### 1.1 crystals-for-sleep vs crystals-for-condition：不重叠，不合并

**结论：不存在 crystals-for-condition 这个 hub 页。"condition"是目录分类概念，不是页面；但 sleep 已从普通 condition spoke 升级为 Crystals 体系下的 `Sleep Crystals` 专题聚合类目。**

证据链：
- `2.crystal-condition/` 目录共 **32 个 crystals-for-{X} 文件**（sleep/anxiety/stress/peace/dreams/love/protection/luck/manifesting/meditation/focus/confidence/creativity/abundance/prosperity/emotional-healing/grief/self-love/new-beginnings/intuition/spiritual/clarity/grounding/balance/transformation/communication/motivation/money/courage/strength/happiness/health）。
- 2A §网站结构 line 68 明文规定 URL 规则：**`/crystals-for-{condition}/`（根级 post，spoke 平铺）**，无 condition 总 hub。每个 condition 是独立 spoke，互不嵌套。
- 2A line 64 明文：功效页（/crystals-for-anxiety/）与意图页（/calm-mindfulness/，WordPress page）是不同页面，分工明确，不冲突。sleep 同理——`/crystals-for-sleep/`（功效推荐 post）与可能存在的意图页（若有 sleep 相关 intent page）各司其职。

> **判定**：`/crystals-for-sleep/` 与 `crystals-for-condition` 不重叠；`crystals-for-condition` 是旧有内容类目，不是总 Hub。新的结构关系是：`Crystals`（父类目）→ `Sleep Crystals`（二级专题类目）→ T2/T3/T4/T5 普通 post。T3 单石×sleep 是 `Sleep Crystals` 专题下的下钻文章，URL 仍用根级 post：`/{stone}-for-sleep/`。

### 1.2 线上现状（1I 盲区修正）⭐

**1I §八"首发批次"把 crystals-for-sleep 列为待做——实际已 publish。** 现状核查：

| 页面 | 线上状态 | post id | URL | 7 颗水晶 | 数据源 |
|---|---|---|---|---|---|
| **crystals-for-sleep** | ✅ publish（2026-06-19 恢复） | 40530 | `/crystals-for-sleep/` | amethyst/lepidolite/selenite/angelite/rainbow-moonstone/prehnite/larimar | recovery json `_recovery.id=40530` |
| **crystals-for-dreams** | ✅ publish（2026-06-20 恢复） | 40861 | `/crystals-for-dreams/` | herkimer-diamond/amethyst/rainbow-moonstone/labradorite/clear-quartz/selenite/lepidolite | recovery json `_recovery.id=40861` |

**含义**：
1. **T1 hub 已存在**——T3 单石×sleep 的定位从"跟 hub 一起新建"变成"为已上线 hub 做下钻深页"。
2. **crystals-for-dreams 已上线**（2A line 94 定位为"变现 Hub，锚 crystals for dreams 交叉长尾，承接 dream→crystal 转化"）——这是 sleep 线的**平级兄弟页**，非 dream 解梦线。T5 nightmares 协同设计里的"dream 线"实际已有变现 hub 承接。
3. sleep 跟 dreams 两 hub 的水晶重叠：**amethyst / rainbow-moonstone / selenite / lepidolite 4 颗重复**（占 sleep 7 颗的 57%）。但意图分化清晰——sleep=助眠安静，dreams=梦境回忆/象征。**不合并，做强内链协同**（dreams 页已链 sleep，sleep 页 related 需补链 dreams，当前 sleep 的 related 列表是 anxiety/stress/peace/emotional-healing/meditation，**缺 dreams 回链**——gap）。

### 1.3 sleep 跟相邻 condition（anxiety/stress/peace）的水晶重叠：正常 topic cluster，非内耗

condition-configs 四页水晶矩阵（实读配置文件）：

| 水晶 | sleep | anxiety | stress | peace | 说明 |
|---|---|---|---|---|---|
| amethyst | ✓ | ✓ | ✓ | ✓ | 平静系通用，4 页共享 |
| lepidolite | ✓ | ✓ | ✓ | ✓ | 同上 |
| selenite | ✓ | ✓ | ✓ | ✓ | 同上 |
| angelite | ✓ | ✓ | ✓ | ✓ | 同上 |
| larimar | ✓ | ✓ | — | ✓ | sleep+anxiety+peace |
| prehnite | ✓ | — | — | ✓ | sleep+peace |
| rainbow-moonstone | ✓ | — | — | — | **sleep 独有**（差异化） |
| moonstone | — | ✓ | — | — | anxiety 用（非 rainbow 变体） |
| amazonite | — | ✓ | ✓ | — | anxiety+stress 独有 |
| hematite | — | — | ✓ | — | stress 独有 |
| red jasper | — | — | ✓ | — | stress 独有 |
| chrysocolla | — | — | — | ✓ | peace 独有 |

**判定**：amethyst/lepidolite/selenite/angelite 跨 4 个 condition 是**正常的 topic cluster 设计**——同一颗水晶多用途，每页聚焦不同维度（sleep=入睡/夜间/bedtime ritual；anxiety=日常焦虑/racing thoughts；stress=工作压力/decompression；peace=内心平静/soothing）。**非内耗**，前提是 T3 单石×sleep 深页**聚焦 sleep 维度**，不复述 anxiety/stress 角度（用内链指向对应 condition 页）。

> rainbow-moonstone 是 sleep 页独有差异化石（anxiety 用的是 moonstone 非 rainbow 变体），T3 若做 moonstone-for-sleep 应明确用 rainbow-moonstone 锚定，避免跟 anxiety 页的 moonstone 混淆。

### 1.4 重叠判断总结

| 问题 | 判定 |
|---|---|
| crystals-for-sleep 跟 crystals-for-condition 重叠？ | ❌ 不重叠。condition 是目录概念非页面；sleep 已升级为 `Crystals > Sleep Crystals` 专题类目 |
| T3 单石×sleep 跟 condition hub 重叠？ | ❌ 不重叠。单石深页是 `Sleep Crystals` 下钻 post，聚焦单石 sleep 维度 |
| sleep 跟 anxiety/stress/peace 水晶重叠？ | ✅ 正常 cluster（4 石共享），非内耗，靠角度差异化 + 内链 |
| sleep 跟 dreams 重叠？ | ⚠️ 4 石重叠但意图分化（助眠 vs 梦境），不合并，补 related 回链 |

---

## 二、单石×sleep 关键词生态（核心问题 3）

### 2.1 SERP 8 词实测详表（2026-07-09）

| 词 | AIO | AIO 源性质 | healthline | energymuse | top10 构成 | 核心卖点/差异点 |
|---|---|---|---|---|---|---|
| **amethyst for sleep** | ❌ 无 | — | 缺席 | #16（总览页，非专页） | Reddit#1, rosecjewels#3, aulitfinelinens#5, angara#8, Facebook#9, frederica#10 | calming/overactive mind；小博客+珠宝+Reddit，纯净 |
| **howlite for sleep** | ✅ 有 | 全小站（Reddit/rockparadise/sarabryki/gemavenue/etsy/ajluxe/drneetikaushik/enchanting-earth/crystals.com） | 缺席 | **缺席** | Reddit#2, sarabryki#4, rockparadise#6, hawkhouse#7, enchanting-earth#8, thecrystalvan#9, ajluxe#10 | **insomnia/overactive mind/racing thoughts 最强绑定**（ravencrystals:"insomnia antidote"；dreaminggoddess:"can't turn off brain"） |
| **selenite for sleep** | ✅ 有 | sources 未锁定 | #15（selenite-properties 通用页） | 缺席 | Reddit#3, Amazon#4, eastmeetswest#5, Facebook#7, frederica#8, sarabryki#9, etsy#10 | **争议差异点**：高振动可能干扰睡眠（Reddit 坏梦/Facebook 睡不着/saatva PAA"avoid under pillow"） |
| **lepidolite for sleep** | ✅ 有 | sources 未锁定 | 缺席 | #19（meaning 页） | wildmountaincrystals#2, rockandrealm#4, Reddit#5, rockparadise#7, gemselect#8, trimakasi#9, villagerockshop#10 | **含锂抗焦虑**（多源反复）；SERP 最纯净，无 energymuse 专页无 healthline |
| **moonstone for sleep** | ✅ 有 | 全小站（beaninfinitewarrior/drneetikaushik/lolabean/moonstone-ring/thegoodnightco/产品） | 缺席 | 缺席 | beaninfinitewarrior#3, lolabean#4, Reddit#5, moonstone-store#6, trimakasi#8, YouTube#10, dreams.co.uk#11, crystalvaults#18 | **vivid dreams/dream recall/emotional cycles**（dream 线协同）；moonstone-store 专页已占位 |
| **clear quartz for sleep** | ✅ 有 | 全小站（drneetikaushik/puffy/consciousitems/sarabryki/easyrest/Reddit/产品） | 缺席 | #20（总览页） | centreofexcellence#2, Reddit#4, thehealingpear#5, Facebook#7, crystalvisions#8, puffy#9, consciousitems#10 | **amplifier 双刃剑争议**（可能太刺激浅眠者）；PAA 星座噪音（Leo/Aquarius/Aries） |
| **rose quartz for sleep** | ❌ 无（有 featured snippet） | — | #11（healing-with-rose-quartz 通用页） | #23（总览页） | Reddit#3, Facebook#7, Facebook#8, Quora#9, puffy#10, healthline#11, satincrystals#12 | **emotional healing/self-love/gentle dreams**；featured snippet 被 marothjewels 占（可抢）；偏 love 非 sleep 核心 |
| **black tourmaline for sleep** | ✅ 有 | 全小站（mooncatcrystals/sparrowtrades/drneetikaushik/ivyandlight/yahoo/beadsofcambay/tinyrituals/产品×2） | 缺席 | 缺席 | Reddit#3, mooncatcrystals#4, Facebook#5, sparrowtrades#6, drneetikaushik#7, Amazon#8, yahoo#9, etsy#10 | **protection/grounding/nightmares 协同**（T5 枢纽）；争议"too strong for light sleepers"（wikihow/tiktok） |

### 2.2 模式洞察

**洞察 1：8 词全部无医疗权威专页占位。**
healthline 即便出现也是水晶通用属性页（selenite-properties / healing-with-rose-quartz），排 #11-15，非 for-sleep 专页。印证 1I 判断：{crystal}-for-sleep 是 Google 判定的**灵性/生活方式意图层**，医疗权威不介入。新站可切入。

**洞察 2：AIO 存在 ≠ 不可切。**
8 词中 6 个有 AIO，但 AIO 源**全是水晶小博客/Reddit/水晶电商**（rockparadise/hawkhouse/sarabryki/consciousitems/drneetikaushik/ivyandlight/mooncatcrystals 等），**无一医疗权威、无一大型出版商**。Google 尚未锁定权威源——AIO 引用小站 = 小站进 AIO 的窗口（对标 1C 解梦线 UGC 进 AIO 逻辑）。amethyst/rose quartz 无 AIO，纯 organic 空间更开放。

**洞察 3：energymuse 没做单石×sleep 专页。**
energymuse 在 amethyst#16/lepidolite#19/clear-quartz#20/rose-quartz#23 占位，**全是 10 石总览页（healing-crystals-help-sleep）或 meaning 页**，无单石 for-sleep 专页。howlite/selenite/moonstone/black-tourmaline energymuse 缺席。**单石×sleep 是 energymuse 也未覆盖的空白层**——这是差异化空间。

**洞察 4：反复出现的竞争对手是中型水晶博客/电商（非权威）。**
跨 8 词高频出现：rockparadise / hawkhouse / sarabryki / consciousitems / thehealingpear / earthinspiredgifts / lolabean / ivyandlight / dreaminggoddess / ravencrystals / thecrystalvan / wildmountaincrystals / trimakasi / crystals.com / mooncatcrystals / sparrowtrades / centreofexcellence / puffy（床垫品牌内容）。无一家是 MD 审核/机构背书。深度对标 energymuse（1I §五已拆）仍是我们内容标杆。

**洞察 5：争议/反向内容是跨石差异点。**
selenite（高振动干扰）/ clear quartz（amplifier 太刺激）/ black tourmaline（too strong, vivid dreams）三石均有"该不该放枕下/哪些人要谨慎"的 SERP 讨论。这对应 1I T4 的 worst-crystals-for-sleep 差异内容——T3 单石页可内嵌"who should be cautious"段，互链 worst-crystals 页。

**洞察 6：PAA 可承接。**
跨词高频 PAA：「What is the best crystal for sleep?」「Which stone is best for sleeping?」「What crystals should I not sleep with?」——这 3 个通用 PAA 在多词重复，T3 每篇 FAQ 段承接。

> **⚠️ volume/KD 待验证**：8 词搜索量未采（无 SEMrush sleep 单石数据）。优先级基于 SERP 竞争强度（AIO 源性质 + healthline/energymuse 是否占位 + 小站密度）推断，非搜索量。howlite/lepidolite/amethyst 推断高意图（用户带 insomnia/racing thoughts 具体痛点），待 SEMrush 回填。

---

## 三、390 meaning 库 sleep 覆盖（核心问题 4）

### 3.1 字段结构关键说明 ⭐

390 meaning json **顶层无独立 Intentions/properties 字段**。意图/属性标签藏在 `content` HTML 末尾的 `<div class="crystal-profile">` 块，以 `<dt>Intentions</dt><dd>...</dd>` + `<dt>Best for</dt><dd>...</dd>` 形式存在。

> **实操影响**：做 T3 单石×sleep 页时，**不能直接读 JSON 顶层字段**取意图，必须从 content HTML 解析 crystal-profile 块。生成脚本需正则/DOM 解析该 div。

### 3.2 五颗目标水晶 sleep 覆盖实读（Explore agent，2026-07-09）

| 水晶 | live_status | crystal-profile.Intentions | crystal-profile.Best for | sleep 专属文案 | 判定 |
|---|---|---|---|---|---|
| **Howlite** | future（草稿） | Calm, Patience, **Sleep** | Calm, **Sleep**, Patience | excerpt"restful sleep"；"bedtime stone"；benefit-card"A calmer bedtime"；"Howlite + Amethyst 经典 sleep pairing" | ✅**最充分**（双标 Sleep） |
| **Amethyst** | publish | Calm, Spiritual awareness, Protection | Meditation, **Sleep**, Stress relief | excerpt"...sleep, or simply a quieter mind"；"bedside stone for winding down"；benefit-card"An easier wind-down"；**正文已内链 /crystals-for-sleep/** | ✅充分（已内链 hub） |
| **Selenite** | publish | Clarity, Cleansing, **Calm** | Cleansing, Space clearing, Focus（无 Sleep） | benefit-card"A quiet bedtime cue"；"Keep it by the bed"；正文内链 /crystals-for-stress（非 sleep） | 🟡部分（有 bedtime 段，缺 Sleep 标签） |
| **Lepidolite** | future（草稿） | Calm, Emotional balance, Transition | Calm, Stress relief, Transitions（无 Sleep） | "calm a racing mind"；"soothing talisman"；**无 bedtime/nightstand/sleep 字眼** | 🟡部分（Calm 充分，sleep 语境零，需自建） |
| **Moonstone** | future（草稿） | Intuition, New beginnings, Calm | Intuition, Emotional balance, June birthstone（无 Sleep） | "quiet the mind"；"restful to focus on"；**睡眠语境最薄**，insomnia 仅在免责声明 | 🟡部分（最弱） |

### 3.3 覆盖结论

1. **可直接复用做 T3 单石×sleep 页**：Howlite（双标 Sleep，文案最密）、Amethyst（Best for 含 Sleep，已内链 hub）
2. **需补 sleep 角度**：Selenite（加 Sleep 标签 + 睡前段落已有）、Lepidolite（从"calm→睡前过渡"二次加工）、Moonstone（基本新建 sleep 语境）
3. **live_status 影响**：Howlite/Lepidolite/Moonstone 的 meaning 页本身是 future 草稿（未上线），但**本地 json 内容素材完整可用**做 T3 深页原料。Amethyst/Selenite 的 meaning 页已 publish，T3 页可双向内链。
4. **矿物诚实声明已具备**：Lepidolite 的 mineral_note（"含锂但不释放到身体"）已在 meaning + condition 配置双处声明，T3 深页直接复用，避免"含锂助眠"过度宣称（1I §四科学谦逊原则）。

---

## 四、T3 单石×sleep 矩阵可行性与优先级（核心问题 2）

### 4.1 八颗单石三维评估（SERP 机会 × meaning 素材 × 协同）

| 单石 | SERP 机会 | meaning 素材 | 协同维度 | 综合判定 |
|---|---|---|---|---|
| **Amethyst** | ✅ 无 AIO 无 healthline，纯净 | ✅ Best for 含 Sleep，已内链 | 品牌主石，首饰收口最强，4 condition 共享 | **第一梯队** |
| **Howlite** | ✅ insomnia/overactive mind 最强绑定，energymuse 缺席 | ✅ 双标 Sleep，文案最密 | **线上 sleep hub 漏 howlite（gap）**，T3 补位+反哺 hub | **第一梯队** |
| **Lepidolite** | ✅ SERP 最纯净（无 energymuse 专页无 healthline） | 🟡 Calm 充分但无 sleep 语境 | 含锂抗焦虑，anxiety/stress 协同 | **第一梯队** |
| **Selenite** | ✅ 有 AIO 全小站，争议差异点 | 🟡 bedtime 段有，缺 Sleep 标签 | 高振动争议→worst-crystals 协同 | **第二梯队** |
| **Black Tourmaline** | ✅ 有 AIO 全小站，nightmares 协同强 | ❓ 未读（推测 protection 标签为主） | **T5 nightmares 枢纽核心石**，保护向 | **第二梯队** |
| **Moonstone** | ✅ 有 AIO，dreams.co.uk/crystalvaults 交叉 | 🟡 最薄，基本新建 | vivid dreams/dream recall→dream 线协同 | **第三梯队**（条件性） |
| **Clear Quartz** | 🟡 amplifier 争议+星座意图污染 | ❓ 未读 | amplifier 定位偏辅助，非 sleep 主石 | **第三梯队**（条件性） |
| **Rose Quartz** | 🟡 偏 love/emotional，有 FS 要抢 | ❓ 未读 | partner bed/情感向，sleep 相关性弱 | **暂缓** |

### 4.2 T3 单石×sleep 优先级（三梯队）

#### 第一梯队（P0，必做 3 页）⭐

| 顺序 | 页面 | URL 建议 | 理由 |
|---|---|---|---|
| 1 | **Amethyst for Sleep** | `/amethyst-for-sleep/` | SERP 无 AIO 无 healthline 最开放；meaning 已内链 hub；品牌主石首饰收口最强；1I §二 P0 已列 |
| 2 | **Howlite for Sleep** | `/howlite-for-sleep/` | SERP insomnia/racing thoughts 最高意图词；meaning 双标 Sleep 文案最密；**线上 hub 漏 howlite，T3 同时反哺 hub 补石** |
| 3 | **Lepidolite for Sleep** | `/lepidolite-for-sleep/` | SERP 最纯净（energymuse/healthline 双缺席）；含锂抗焦虑差异化；meaning 需补 sleep 语境但 Calm 素材足 |

#### 第二梯队（P1，强协同 2 页）

| 顺序 | 页面 | URL 建议 | 理由 |
|---|---|---|---|
| 4 | **Selenite for Sleep** | `/selenite-for-sleep/` | 争议差异点（高振动该不该放枕下）= 独家内容角度；meaning 有 bedtime 段；护城河=科学谦逊处理争议 |
| 5 | **Black Tourmaline for Sleep** | `/black-tourmaline-for-sleep/` | nightmares/保护协同，T5 枢纽核心石；建议跟 T5 nightmares 页同期上线互链 |

#### 第三梯队（P2，条件性 2-3 页）

| 页面 | 条件 | 理由 |
|---|---|---|
| **Moonstone for Sleep** | dream 线协同做强后 | vivid dreams/dream recall 交叉，需跟 crystals-for-dreams hub 明确分工；meaning 素材最薄需新建 |
| **Clear Quartz for Sleep** | worst-crystals 页配套后 | amplifier 争议角度有价值，但星座意图污染+energymuse 占位，优先级低 |
| **Rose Quartz for Sleep** | 暂缓 | 偏 love/emotional，sleep 相关性最弱；除非做"partner sleep"场景页 |

### 4.3 Sleep Crystals 类目 → 下钻 post 架构

```
/category/crystals/sleep-crystals/  (Sleep Crystals 二级类目，可 Elementor 深度定制为完整 Hub)
        │
        ├── /crystals-for-sleep/  (T1 已上线 post 40530，当前 7 石总览；可保留或后续合并进类目 Hub)
        │
        ├─ 内链下钻（Hub/类目页/现有 T1 每石卡片 → 单石深页）
        │
        ├── /amethyst-for-sleep/      (T3-P0)
        ├── /howlite-for-sleep/       (T3-P0, ★补位：hub 当前7石不含howlite,需同步补)
        ├── /lepidolite-for-sleep/    (T3-P0)
        ├── /selenite-for-sleep/      (T3-P1)
        ├── /black-tourmaline-for-sleep/ (T3-P1, ↔T5 nightmares)
        ├── /moonstone-for-sleep/     (T3-P2, ↔crystals-for-dreams)
        └── /clear-quartz-for-sleep/  (T3-P2, ↔worst-crystals-for-sleep)
```

**双向内链规则**：
- `Sleep Crystals` 类目 Hub → T1/T2/T3/T4/T5 重点入口
- T1 `/crystals-for-sleep/` 若保留：每石卡片 → 对应 T3 单石深页；若合并进类目 Hub：将该内链职责迁到类目页
- T3 单石深页 → `Sleep Crystals` 类目 Hub + 其他单石深页 + 相邻 condition 页（anxiety/stress，差异化）+ dream 协同页

### 4.4 dream 线协同（避免内耗）

**边界规则**（防止 T3 单石×sleep 跟 crystals-for-dreams hub 内容重复）：

| 维度 | T3 单石×sleep 聚焦 | crystals-for-dreams hub 聚焦 |
|---|---|---|
| 核心意图 | 入睡/夜间安静/bedtime ritual | 梦境回忆/象征/lucid |
| 水晶角度 | 这颗石怎么帮我**睡着** | 这颗石怎么帮我**记住/理解梦** |
| 重叠水晶 | amethyst/moonstone/selenite/lepidolite | 同左 + herkimer/labradorite/clear-quartz |
| 内链方向 | T3 提 dreams → 链 /crystals-for-dreams/（不展开） | dreams hub 提 sleep → 链 /crystals-for-sleep/ |

**moonstone-for-sleep 特别处理**：moonstone 同时是 sleep（emotional cycles）+ dreams（vivid dreams/dream recall）两线交叉石。T3 moonstone-for-sleep 聚焦"睡前情绪平复→入睡"，vivid dreams 部分用一段带过 + 内链 /crystals-for-dreams/，不展开 dream recall 教程（那是 dreams hub 的活）。

### 4.5 T3 单石深页 H2 骨架（基于 1I §6.2 T3，强化下钻 + 协同）

对标 1I §6.2 T3 骨架，补充下钻与协同内链字段：

```
H1: {Crystal} for Sleep: How This {Subtitle} Stone Supports Rest
{{key_takeaways}}（4 条，含科学谦逊句式）

H2: Why {Crystal} for Sleep?  ← 灵性属性（chakra/振动/传统），复用 meaning crystal-profile
H2: What Science Says  ← 科学层（无临床证据诚实声明 + relaxation ritual 机制）
H2: How to Use {Crystal} for Sleep
  H3: Under Your Pillow
  H3: As a Bracelet You Wear  ← 首饰收口（差异化护城河）
  H3: On Your Nightstand
  H3: In a Bedtime Meditation
H2: Best {Crystal} Pairings for Sleep  ← 组合（对标 energymuse + meaning pairing）
H2: Who Should Be Cautious  ← 争议差异段（selenite/clear-quartz/black-tourmaline 才有，amethyst/howlite/lepidolite 可省）
H2: {Crystal} for Dreams & Nightmares  ← dream 协同（一段带过 + 内链 /crystals-for-dreams/）
H2: More Crystals for Sleep  ← 内链 hub + 其他单石深页
{{faq}}（承接 PAA：Which stone best? / What crystals not to sleep with?）
{{shop_cta}}（{crystal} 手链/原石）
```

> **URL 口径**：`/{stone}-for-sleep/`（根级 post），归入 `Sleep Crystals` 类目（cat 1591）。非 `/crystals-for-sleep/{stone}/`（不符合 2A 根级平铺原则），也暂不为 `insomnia/deep-sleep/under-pillow` 创建三级类目；只有当某个子专题下有足够多的下钻文章时，才升级为更深类目。

---

## 五、关键 gap 与修正清单

### 5.1 对 1I 的修正

| 1I 原表述 | 实际现状 | 修正建议 |
|---|---|---|
| §八"首发批次 P0 第 1 页 crystals-for-sleep（T1 总览 Hub）" | ✅ **已 publish（post 40530）** | 1I §八应改"T1 已上线，首发聚焦 T2/T3/T4/T5" |
| §6.4 dream×sleep 内链闭环未提 crystals-for-dreams 已上线 | ✅ **crystals-for-dreams 已 publish（post 40861）** | 闭环图应补 dreams hub 节点 |
| §六 T1 H2 骨架按"待做"设计 | T1 线上已是 7 石版（amethyst/lepidolite/selenite/angelite/rainbow-moonstone/prehnite/larimar） | T1 优化方向=补 howlite（见 5.2）+ 补 dreams 回链 |

### 5.2 线上 sleep hub 的内容 gap

**线上 crystals-for-sleep 的 7 颗不含 Howlite**——但 SERP 证明 howlite for sleep 是**最强 sleep 意图词**（insomnia/overactive mind/racing thoughts 绑定最深，energymuse 缺席）。线上 hub 用 lepidolite 替代了 howlite 的"racing thoughts"角色，但 SERP 上 howlite 的 insomnia 绑定远强于 lepidolite。

> **建议**：T3 howlite-for-sleep 单石深页做 P0 的同时，**同步把 howlite 补进线上 crystals-for-sleep hub**（7→8 石），补位"racing thoughts / insomnia"痛点。这同时修正 hub 内容深度 + 为 T3 单石页做反哺内链。

### 5.3 线上 sleep hub 的 related 回链 gap

crystals-for-sleep 的 related 列表：anxiety/stress/peace/emotional-healing/meditation——**缺 dreams 回链**。crystals-for-dreams 的 Explore More 已链 sleep（单向）。建议补双向：sleep 的 related 加 dreams。

### 5.4 volume/KD 数据缺口（沿用 1I §七）

8 个 {crystal}-for-sleep 词的 SEMrush volume/KD 未采集。当前优先级基于 SERP 竞争强度推断。**待 SEMrush 回填**后可量化排序（推断 howlite/lepidolite/amethyst 为高意图中高量，待验）。

---

## 六、本深化产出总结

| 核心问题 | 结论 |
|---|---|
| ① sleep 跟 condition 重叠？ | ❌ 不重叠。condition 是目录概念。sleep 已升级为 `Crystals > Sleep Crystals` 专题类目（cat 1591）；T3 单石页是该类目下钻 post |
| ② 单石×sleep 矩阵能扩展？ | ✅ 可扩展。8 词 SERP 全部小站空间。P0 三颗（amethyst/howlite/lepidolite）+ P1 两颗（selenite/black-tourmaline）+ P2 条件性（moonstone/clear-quartz），rose quartz 暂缓 |
| ③ 关键词生态？ | 8 词全部无医疗权威专页；6 词有 AIO 但源全小站；energymuse 无单石专页只占总览；争议差异点（selenite/clear-quartz/black-tourmaline）是内容护城河 |
| ④ 390 库 sleep 覆盖？ | Howlite/Amethyst 充分（双标/单标 Sleep）；Selenite/Lepidolite/Moonstone 部分需补。意图标签藏在 content HTML crystal-profile 块（非顶层字段） |

**下一步输入**：Sleep Crystals 类目 Hub 内容方案（是否完整承接并合并 `/crystals-for-sleep/`）→ SEMrush 回填 P0 三词 → Brief 模板设计（T3 单石深页 H2 骨架 + crystal-profile 解析逻辑）→ 1H 策略清单（T3 三梯队排期）。

---

*1I-T3 完成于 2026-07-09 | 方法：RLM §1A SERP 驱动 5 步铁律（8 词 serp_check）+ meaning 库实读（Explore agent）+ 线上现状核查（recovery json）+ 2A URL 规则交叉 | 工具：serp_check（8 词）+ Read/Grep/Glob（condition 目录 + 2A + configs）| 关联：1I sleep 线全貌 / dream 线 1C/1D / crystal-meaning 390 库 / 2A 网站结构*
