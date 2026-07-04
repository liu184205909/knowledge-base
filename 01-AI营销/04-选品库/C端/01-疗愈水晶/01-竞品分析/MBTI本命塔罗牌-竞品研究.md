# MBTI 本命塔罗牌工具 — SERP 竞品研究

> 任务：T-MBTI（`/tools/mbti-tarot/`）工具的竞品调研，严格 SERP 驱动（memory `competitor-research-serp-driven-strict` 铁律：serp_check → 过滤大平台 → webReader 只抓 SERP 确认的真竞品，不预设）。
> 数据采集日期：2026-07-03。
> 调研词覆盖：`mbti tarot birth card` / `which tarot card represents your mbti type` / `mbti tarot correspondence major arcana` / `tarot card for each mbti type list` / `mbti birth card calculator` / `mbti 塔罗牌对应`（中文）。

---

## 0. 一句话结论（先看这里）

**SERP 生态是个"内容齐全 + 工具真空"的市场**：

- **内容侧饱和**：所有头部塔罗/心理站（Cosmopolitan、Benebell Wen、Labyrinthos、Spectrum Store、知乎、adeletarot、hourlightkey）都做过"16 MBTI 型 × 塔罗牌映射"内容，且基本都是**Court Cards（宫廷牌 16 张）1:1 对应 16 型**——这条路径已红海，再追没差异化。
- **工具侧真空**：搜索 5 个英文 + 1 个中文关键词，**没有任何一个工具**做"输入 MBTI 型 → 输出本命大牌（Major Arcana）+ 解读 + 推荐水晶"的形态。`mbti birth card calculator` 这个词 SERP 全被**生日驱动**的 Tarot Birth Card Calculator（数值归约算法）占据，与 MBTI 完全无关——这是**关键词错位金矿**：用户搜 "mbti birth card" 时心里想的是"按我的 MBTI 型给我对应的塔罗牌"，SERP 却只给生日算法。
- **水晶推荐 100% 空白**：所有竞品的 MBTI × Tarot 内容**没有任何一家**做水晶推荐。这是 goearthward（水晶站）的**绝对差异化机会**。
- **本命大牌（Major Arcana）路径未饱和**：Court Cards 路径被吃透，但 Major Arcana 路径只有知乎欣欣 + adeletarot + hourlightkey + Reddit r/mbti 几家在做，且**各自映射不一致**（INFP=月亮/星星/倒吊人 三种说法），用户认知未被锁定，**正是新进入者的窗口**。

---

## 1. SERP 竞品清单（过滤后真竞品）

### 1.1 关键词 SERP 摘要（6 词合并去重）

| 关键词 | 真竞品数（过滤大平台后） | AIO | 头部类型 |
|---|---|---|---|
| mbti tarot birth card | 5 | ✅ 有 AIO | 论坛贴（Reddit/personalitycafe）+ 工具站（mysticmondays/tarotschool） |
| which tarot card represents your mbti type | 6 | ✅ 有 AIO | 内容博客（cosmopolitan/benebell/tumblr）+ 论坛 |
| mbti tarot correspondence major arcana | 5 | ✅ 有 AIO | 内容博客（benebell/spectrumstore/avaloncameron）+ 论坛 |
| tarot card for each mbti type list | 5 | ✅ 有 AIO | 同上（cosmopolitan 重出）+ scribd PDF |
| mbti birth card calculator | 0（**全是生日算法**）| ✅ 有 AIO | tarot.com / mysticmondays / tarotschool / biddytarot（**全是生日数值归约，无 MBTI**）|
| mbti 塔罗牌对应（中文） | 6 | ✅ 有 AIO | 知乎/adeletarot.tw/hourlightkey/017cafe/threads |

### 1.2 已过滤大平台（剔除，不计入竞品）

reddit / pinterest / quora / medium / wikipedia / youtube / facebook / tiktok / instagram / tumblr / scribd / personality-database / 16personalities / biddy / labyrinthos / trusted-tarot / tarot.com（生日算法工具，非 MBTI）。

### 1.3 真竞品（webReader 抓取确认的 5+）

| # | 站点 | URL | 类型 | 映射路径 | 水晶 | 流量信号 |
|---|---|---|---|---|---|---|
| 1 | **Cosmopolitan** | cosmopolitan.com/lifestyle/a36732394/ | 内容（媒体大站）| **Court Cards 1:1**（16型=16宫廷牌）| ❌ 无 | 高（2021 老文持续排名）|
| 2 | **Benebell Wen**（Oneful Tarot 评测）| benebellwen.com/2025/04/17/mbti-oneful-tarot/ | 内容（权威塔罗博主）| **Court Cards 1:1 + 认知功能映射**（Dr. Maggie Lee 体系）| ❌ 无 | 高（FTC 披露 + PDF 下载）|
| 3 | **Spectrum Store** | spectrumstore.sg/blogs/blog/mbti-tarot-card-archetypes-... | 内容（电商博客，新加坡）| **4 气质群 × 1 大牌**（Analysts=Magician / Diplomats=High Priestess / Sentinels=Hierophant / Explorers=Fool）| ❌ 无（推塔罗牌作为礼物）| 中（商业转化导向）|
| 4 | **hourlightkey（馥灵智慧牌）** | hourlightkey.com/sc/mbti-tarot.html | **工具**（中文，APESK 64型）| **APESK 64型（A/T × H/C）→ 3 张牌**（核心/挑战/礼物）| ❌ 无 | 中（中文市场独苗工具）|
| 5 | **adeletarot.tw** | adeletarot.tw/mbti-x-靈魂牌地圖 | 内容（中文塔罗师）| **Major Arcana**（INFJ=隐士 / INTJ=魔术师 / ENFJ=教皇 / INFP=月亮）| ❌ 无 | 中（每型 1 篇深度文）|
| 6 | **知乎-塔罗师欣欣** | zhuanlan.zhihu.com/p/1899146103649183428 | 内容（中文）| **22 大牌 × 16 型**（最全映射，但一型多牌矛盾：INFP=倒吊人+星星+月亮）| ❌ 无 | 高（78 牌全展开）|

---

## 2. 工具形态对标（核心：怎么输入、怎么输出）

### 2.1 竞品工具形态扫描

| 竞品 | 输入方式 | 输出 | 工具化程度 |
|---|---|---|---|
| hourlightkey（唯一真工具）| **3 步表单**（MBTI 4 字母 + A/T + H/C）| 3 张牌（核心/挑战/礼物）+ 复制 AI 解读 prompt | ✅ 工具，但**输出只到 prompt 文本，无牌图无水晶** |
| mysticmondays / tarotschool / biddytarot | 生日（月/日/年）| 2 张 Birth Cards（生日数值归约）| ✅ 工具，但**与 MBTI 无关**（占着 mbti 词却做生日算法）|
| adeletarot.tw | 无工具，每型 1 篇文章 | 文章 + 牌义解读 | ❌ 纯内容 |
| Cosmopolitan / Benebell / 知乎 | 无工具，单页表格 | 静态映射表 + 描述 | ❌ 纯内容 |

### 2.2 关键洞察

1. **MBTI 驱动的"输入型→输出牌"真工具，全球只有 hourlightkey 一家（中文）**。英文市场 0 家。
2. **`mbti birth card calculator` 关键词被生日算法工具错误占据**——用户搜索意图（按 MBTI 型拿牌）和 SERP 给出（按生日拿牌）严重错位。我们做 MBTI 输入的工具，能直接抢这个词的精准意图流量。
3. **没有任何竞品做水晶推荐**——这是 goearthward（水晶站）的天然护城河。

---

## 3. 16 MBTI 型 × 塔罗牌映射逻辑（多家对比 + 我们的差异化裁决）

### 3.1 两条映射路径的抉择

| 路径 | 描述 | 竞品密度 | 我们的决策 |
|---|---|---|---|
| **A. Court Cards 1:1**（宫廷牌）| 16 张宫廷牌（4 花色 × 王/后/骑/侍）= 16 型 | **红海**（Cosmopolitan、Benebell、Oneful Tarot、78revelationsaminute 全做了）| ❌ **不走**（无差异化，且宫廷牌 archetype 远不如大牌有传播力）|
| **B. Major Arcana 1-2 张**（大牌）| 22 张大牌中为每型挑 1-2 张本命牌 | **半饱和**（只有 adeletarot/知乎/Reddit/spectrumstore 做，且各家不一致）| ✅ **走 B 路径**（用户认知未被锁定，大牌 archetype 传播力强，且与我们现有 `tarot-knowledge.json` 22 大牌 archetype/eastern_anchors 字段天然对齐）|

### 3.2 竞品 Major Arcana 映射对照（验证我们映射的依据，非抄袭）

> 说明：以下仅作为"哪些大牌被高频绑定到哪些型"的认知锚点参考。我们的最终映射**基于 tarot-knowledge.json 的 archetype/psychological_lens/eastern_anchors + MBTI 认知功能栈（Ni/Ne/Si/Se/Ti/Te/Fi/Fe）自行推导**，与任何单一竞品不一致。

| MBTI 型 | 认知栈 | 知乎-欣欣 | adeletarot | Reddit-认知功能 | **我们的方向（待数据层文档定稿）** |
|---|---|---|---|---|---|
| INTJ | Ni-Te-Fi-Se | 隐士 | 魔术师 | Magician (Ni-Te) | Hermit（主）+ Magician（次）|
| INTP | Ti-Ne-Si-Fe | 命运之轮 | — | Hermit (Ti-Ne) | Hermit（主）+ Star（次，理想主义）|
| INFJ | Ni-Fe-Ti-Se | 女祭司/节制 | 隐士 | — | High Priestess（主）+ Hermit（次）|
| INFP | Fi-Ne-Si-Te | 倒吊人/星星/月亮 | 月亮 | — | The Moon（主）+ Star（次）|
| ENTJ | Te-Ni-Se-Fi | 战车 | — | Emperor (Te-Ni) | The Emperor（主）+ Chariot（次）|
| ENTP | Ne-Ti-Fe-Si | 魔术师/世界 | — | The Tower (Ne-Ti) | The Magician（主）+ Fool（次）|
| ENFJ | Fe-Ni-Se-Ti | 恋人/审判 | 教皇 | — | The Hierophant（主）+ Lovers（次）|
| ENFP | Ne-Fi-Te-Si | 愚人 | — | — | The Fool（主）+ Star（次）|
| ISTJ | Si-Te-Fi-Ne | 正义 | — | Queen of Swords | Justice（主）+ Emperor（次）|
| ISFJ | Si-Fe-Ti-Ne | 教皇 | — | — | The Hierophant（主）+ Empress（次）|
| ISTP | Ti-Se-Ni-Fe | 死神 | — | — | The Hermit（主）+ Death（次，破局重生）|
| ISFP | Fi-Se-Ni-Te | 力量 | — | — | Strength（主）+ Star（次）|
| ESTJ | Te-Si-Ne-Fi | 皇帝 | — | King of Swords | The Emperor（主）+ Justice（次）|
| ESFJ | Fe-Si-Ne-Ti | 皇后 | — | — | The Empress（主）+ Hierophant（次）|
| ESTP | Se-Ti-Fe-Ni | 恶魔/高塔 | — | — | The Chariot（主）+ Fool（次，冒险）|
| ESFP | Se-Fi-Te-Ni | 太阳 | — | — | The Sun（主）+ Fool（次）|

**观察**：竞品对 INTJ/INFJ/INFP 的认知高度分化（隐士 vs 魔术师 vs 女祭司 vs 月亮），说明用户认知未锁定，**正适合我们用"主牌+次牌"双牌给出更立体的解读**，反而比单牌更可信。

### 3.3 我们的差异化映射原则（不抄竞品，自推）

1. **主牌（Birth Card）**：基于 MBTI **主导功能**（第 1 功能）+ tarot archetype 的 `psychological_lens` 字段对齐。
   - 例：INTJ 主导 Ni（内倾直觉）→ Hermit 的 archetype="The Lone Seeker"，psychological_lens="introspection and inner vision" → 完美对齐。
2. **次牌（Shadow/Growth Card）**：基于 MBTI **第 3/4 功能**（劣势功能）+ 该牌的 `reversed_keywords`（阴影面）。
   - 例：INTJ 劣势 Se → The Fool（冒险/当下）作为成长牌，提示整合"活在当下"。
3. **每型给水晶**：基于牌的 `crystals.best_overall` + 该型的认知功能特性（如 Ni 型给紫水晶增强直觉，Te 型给虎眼石增强决断）。
4. **东方锚点**：每型复用 tarot-knowledge.json 的 `eastern_anchors` 字段（藏式/菩萨石等），强化 goearthward 东方调性。

---

## 4. 解读格式扫描

| 竞品 | 解读结构 | 字数 | 差异化点 |
|---|---|---|---|
| Cosmopolitan | 每型 1 段（80-120 词）| 短 | 娱乐化、口语化（"you're a wild ride"）|
| Benebell Wen（Oneful）| 每型 Light/Shadow + Self-care tips | 中（200-300 词/型）| 心理学深度（认知功能栈）+ 自我照顾 |
| adeletarot.tw | 每型 1 篇独立文章（1500+ 字）| 长 | 灵魂课题/内在矛盾/牌意象三层 |
| 知乎-欣欣 | 每牌 1 行短描述 | 极短 | 78 牌全景表（信息密度高但无深度）|
| hourlightkey | 3 牌 prompt（核心/挑战/礼物）| 中 | 三层结构（本质/课题/礼物）|

**我们的最优结构**（综合 adeletarot 深度 + Benebell 心理学 + hourlightkey 三层）：
- **本命牌主解读**（150 词）：该型如何"活在"这张牌的正位能量里
- **阴影/成长点**（80 词）：逆位阴影 + 劣势功能的整合邀请
- **水晶推荐 3 颗**（每颗 40 词）：角色（best_overall/best_upright/best_reversed 对齐 390 库）
- **东方锚点**（50 词）：藏式/水晶文化的呼应

详见数据层设计文档 §2。

---

## 5. 差异化机会（我们的护城河）

| 维度 | 竞品现状 | goearthward 机会 |
|---|---|---|
| **水晶推荐** | 0/6 竞品做 | ✅ 独家（390 水晶库 + tarot-knowledge 已有 crystals 字段）|
| **东方藏式调性** | 0/6 竞品做（全是西方塔罗叙事）| ✅ 独家（eastern_anchors 字段已就绪）|
| **MBTI 输入的真工具**（英文）| 0 家 | ✅ 抢占 `mbti birth card calculator` 关键词错位流量 |
| **Major Arcana 双牌映射** | 单牌为主 | ✅ 主牌+次牌立体解读（避开 Court Cards 红海）|
| **认知功能栈依据** | Benebell 一家做 | ✅ 第二家做（且 + 水晶交叉）|

---

## 6. 流量与定位判断

### 6.1 关键词机会（基于 SERP 观察非 volume 工具，待 Seed-Master Sheet 验证 volume）

| 关键词 | SERP 占据者 | 我们能否进 top 10 | 策略 |
|---|---|---|---|
| `mbti birth card calculator` | 生日算法工具（与 MBTI 无关）| **高概率**（意图错位金矿）| 工具页 + 文章双吃 |
| `mbti tarot birth card` | 论坛贴 + 内容站 | 中（需工具差异化）| 工具 + 长尾矩阵 |
| `tarot card for [type]`（如 INFJ tarot card）| adeletarot + Cosmopolitan | **高概率**（每型独立文章）| 16 型 hub 文章 |
| `[type] birth card crystals` | 0 占据者 | **极高概率**（独家）| 长尾文章矩阵 |

### 6.2 风险点

1. **MBTI 商标**：MBTI 是 Myers-Briggs Company 注册商标。竞品（Cosmopolitan/Benebell）都直接用，普遍未授权。我们用 "MBTI" 关键词做 SEO 流量合规风险低（教育性引用），但工具内文案建议加 disclaimer（"based on Jungian cognitive functions, for self-reflection"）。
2. **认知功能栈理论争议**：MBTI 在心理学界有争议（不是 Big Five）。文案定位"self-reflection framework, not a personality diagnosis"（与现有 tarot 工具 gentle note 一致）。
3. **竞品映射不一致**：用户可能问"为什么我（INTJ）是 Hermit，adeletarot 说是 Magician？" → 我们的解读必须给出**认知功能栈依据**（Ni 主导 → Hermit 内视；Te 辅助 → Magician 显化），让用户理解而非盲信。

---

## 7. 下一步（交接给数据层 + 工具 + 文章设计文档）

本研究的核心结论 → 输入到：
1. **数据层设计**（`configs/mbti-tarot-knowledge.json`）：16 型 × 主牌+次牌 + 水晶 + 东方锚点，依据认知功能栈自推（详见独立设计文档）。
2. **工具形态**：输入选 16 型（下拉）+ 选填生日（双重路径，吃 mbti birth card 词），输出本命大牌图 + 双牌解读 + 3 水晶 CTA（详见设计文档）。
3. **文章矩阵**：16 型 hub + 16 × 本命牌交叉（避免 352 全量，详见设计文档）。

---

**数据源说明**：
- SERP：google-seo-mcp `serp_check`（US desktop / CN desktop），2026-07-03。
- 竞品正文：webReader 抓取 6 个真竞品 URL（Cosmopolitan / Benebell / Spectrum Store / hourlightkey / adeletarot via 中文 SERP / 知乎-欣欣）。
- 映射依据：tarot-knowledge.json（22 大牌 archetype/psychological_lens/eastern_anchors/crystals 字段）+ MBTI 认知功能栈（Jungian Ni/Ne/Si/Se/Ti/Te/Fi/Fe）。
- Volume/KD 待查：Seed-Master Sheet（SEMrush-Seed-Keywords ID 1HhKDz7，按 memory `dataforseo-serp-only` 规则 volume 看 Seed-Master）。
