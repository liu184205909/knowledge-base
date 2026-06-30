# tarotap.com 100% 抄蓝图 → goearthward 塔罗工具线

> 标杆拆解产出。方法：sitemap 全量解析（441 URL）+ Playwright 实操每个功能（24 张桌面/移动端截图）+ serp_check 真实排名验证 + 5 个主要竞品 sitemap 规模对比。
> 数据源快照：`build/_research/tarotap/data/`（structure.json + sitemap.xml）、`build/_research/tarotap/screenshots/`（24 张截图）。serp_check 采集于 2026-06-29。

---

## 一、tarotap.com 全量结构（sitemap 解析）

### 1.1 总览
- **总 URL 数：441**
- **语言版本：20 种**（en 根 + en/zh/ja/ko/es/de/pt/fr/it/nl/ru/th/tr/pl/da/no/vi/hu/fi/id 各子路径）
- **去语言后独立功能/页面：37 个**，其中**核心功能页仅 15 个**，blog 文章 14 个 slug，其余都是翻译版本
- sitemap：`/sitemap.xml`（441 页）+ `/robots.txt`
- 商业本质：**用 441 页做到中文"塔罗占卜"#1、英文"free tarot reading"#13**。不是内容海量，而是「工具优先 + 20 语言 × 精炼功能 + 每页深度内容」。

### 1.2 各语言规模（为什么是 441）
| 语言 | 页数 | 说明 |
|---|---|---|
| en（根 + /en/） | 57 | 主站最完整，含 blog + 工具全集 |
| zh | 26 | 繁体（/zh = 简体，根路径=繁体） |
| ja/ko/de | 24-25 | 二线主力 |
| fr/it/ru | 20 | |
| es/pt/nl/th/tr/pl/da/no/id | 19 | |
| vi/hu/fi | 18 | 最少（仅核心工具+少量 blog） |

**441 ≈ 15 个核心功能 × ~20 语言 + 14 blog × 平均 3 语言翻译 + 德语 4 个本地化长尾页**。

### 1.3 核心功能页清单（去语言后的 15 个真功能）
| 路径 | 类型 | 功能 |
|---|---|---|
| `/`（AI塔罗占卜） | **皇冠工具** | 选塔罗师角色 → 输入问题 → AI 自动选牌阵 → 抽牌 → 对话式解读 |
| `/yes-or-no-tarot` | 工具 | 是与否（单牌 + 三牌两种玩法） |
| `/love-tarot` | 工具 | 爱情占卜（他在想什么/正缘/关系预测/分手挽回 4 场景） |
| `/draw-cards` | 工具 | 自由抽牌（按自己节奏探索每张牌义） |
| `/oracle-cards` | 工具 | 神谕卡（6 副牌，抽一张） |
| `/tarot-manifestation` | 工具 | 塔罗显化（视觉锚点 + 每日目标打卡） |
| `/en/tarot-birth-card-calculator` | 工具 | 本命牌计算器（输入生日 → 12 种组合） |
| `/en/psychic` | **AI 对话** | Free AI Psychic Chat（角色 Celeste，7×24 免费） |
| `/tarot-spread/two-options-spread` | 牌阵页 | 二择一 |
| `/tarot-spread/three-options-spread` | 牌阵页 | 三择一 |
| `/tarot-spread/celtic-cross-spread` | 牌阵页 | 凯尔特十字（10 张） |
| `/fortune/daily` | 运势 | 每日塔罗（每天 1 张） |
| `/fortune/monthly` | 运势 | 月运（3 张 = 上中下旬） |
| `/fortune/yearly` | 运势 | 2026 年运（按季 4 维度） |
| `/fortune/seasonal` | 运势 | 四季牌阵（5 张，节气限时） |
| `/pricing` | 变现 | 3 档会员（免费/Plus/Pro） |
| `/blog` | 内容 | 14 篇 SEO 文章（见 1.4） |

**隐藏发现**（sitemap 抓取时未在 tree 首屏、需全量解析才看到）：
- `/fortune/monthly` 月运（tree 工具首屏没列，实际 20 语言都有）
- `/live-reading` 真人解读（仅 en/zh 2 语言，灰度功能）
- `/en/chat/raven`、`/en/chat/...` AI 角色 chat 独立路径（首页"和凜聊聊/和露娜聊聊"入口）
- `/en/affiliate-program` 联盟营销（变现副线）
- **德语本地化 SEO 长尾页**（4 个，单语言）：`/de/ja-nein-orakel`（是与否神谕）、`/de/was-denkt-er-ueber-mich`（他在想什么）、`/de/denkt-er-an-mich`（他在想我吗）、`/de/wann-meldet-er-sich`（他什么时候联系我）—— 德语市场专属高量长尾词

### 1.4 blog 内容（14 个 slug，去重后）
- **AI 占卜指令类**（核心引流）：`chatgpt-tarot-reading-guide`、`chatgpt-tarot-reading-accuracy`、`gemini-fortune-telling-guide`、`chatgpt-akashic-records-guide`、`ai-tarot-accuracy`、`ai-tarot-top3`（蹭 ChatGPT/Gemini 算命热点）
- **塔罗教程类**：`tarot-beginner-complete-guide`、`tarot-cards-beginners-guide-meanings-spreads-techniques`、`online-tarot-system`
- **场景工具类**：`yes-or-no-tarot`、`yes-or-no-tarot-list`、`love-tarot-spread`、`tarot-taboos`、`does-he-like-me-tarot`

**特点**：blog 是「工具型 SEO 落地页」，每篇都指向某个工具，不是纯科普。

---

## 二、tarotap 功能全量拆解（Playwright 实操 + 截图）

截图存 `build/_research/tarotap/screenshots/`（19 桌面 + 5 移动 = 24 张）。以下每个功能的「是什么 / 怎么做 / 用户路径 / 变现」。

### 2.1 皇冠：AI 塔罗占卜（`/`）⭐ 核心
- **是什么**：选 AI 塔罗师角色 → 输入问题（0/300 字）→ AI 根据问题自动决定牌阵（3 张时间线/7 张完整/爱情牌阵等）→ 抽牌 → 对话式 AI 解读 → 可追问。
- **角色卡（6 位塔罗师）**：凜（诗意·象征）/ 月瑤（温柔·疗愈）/ 林星河（抉择·釐清）/ 星月阿嬤（智慧·指引，**会员**）/ 奇靈（毒舌·真话，**会员**）/ 戀語（爱情·亲密，**会员**）。每位有独立人设开场白（如凜："一張牌從來不是一句話講得完的…我會一層一層慢慢讀"）。
- **差异化卖点**（首页 H2"這個塔羅占卜跟其他的有什麼不同"3 点）：
  1. **你不用自己选牌阵**（AI 根据问题自动选）
  2. **看完牌还可以继续问**（AI 记忆上下文，对话不断）
  3. **可以简单看，也可以看很细**（快速/深度模式切换）
- **变现**：免费 1 次/天（300 字上限），Plus/Pro 无限 + 深度洞察。
- **截图**：`home.desktop.png`、`home.mobile.png`、`zh-home.desktop.png`

### 2.2 AI Psychic Chat（`/en/psychic`）⭐ 皇冠对话入口
- **是什么**：纯 AI 对话（不抽牌也能聊），角色 Celeste（The Starwhisperer），可聊塔罗/占星/爱情/事业/人生路径/梦境。
- **4 大卖点**：Available anytime（7×24）/ Completely free（免注册免信用卡）/ Private and anonymous（匿名不留存）/ Reads tailored to you（个性化）。
- **示例问题分 4 类**：Love & Soulmate / Career & Money / Life Path / Dreams & Signs。
- **变现**：完全免费（引流入口，靠它把搜索流量导入站内，再用皇冠工具/会员变现）。
- **截图**：`psychic.desktop.png`、`psychic.mobile.png`

### 2.3 是与否塔罗（`/yes-or-no-tarot`）
- **两种玩法**：单牌（正位=是/逆位=否，最快）、三牌（2 张以上同向才判定，看清脉络）。
- **内容深度**：怎么玩 3 步 + 两种玩法对比 + 5 条 FAQ（重复占卜/准确性/提问技巧/能否预测未来/注意事项）。
- **变现**：今日 1 次免费，三牌需升级会员。

### 2.4 爱情塔罗（`/love-tarot`）
- **4 场景**：他在想什么 / 找正缘 / 关系预测 / 分手挽回。
- **截图**：`love-tarot.desktop.png`

### 2.5 自由抽牌（`/draw-cards`）
- 纯探索，按自己节奏抽牌看牌义，无 AI 解读（轻量）。

### 2.6 神谕卡（`/oracle-cards`）
- **6 副神谕牌**任选，抽一张。"六副神諭卡，六種視角"。

### 2.7 塔罗显化（`/tarot-manifestation`）
- 用塔罗牌做视觉锚点 + 每日目标打卡。免费 1 个目标，Plus 3 个，Pro 无限。

### 2.8 本命牌计算器（`/en/tarot-birth-card-calculator`）
- 输入生日 → 算出 2 张本命塔罗牌（12 种组合）。列 12 组合 SEO 内容。

### 2.9 牌阵页（3 个：two/three-options + celtic-cross）
- **每个牌阵页 = 工具 + 长内容**。以凯尔特十字为例（截图 `spread-celtic.*`）：
  - Hero：输入问题 → 开始（10 张牌位图示）
  - 内容 H2：什么是 / 起源 / **10 个牌位详解**（现况/挑战/根基/近期过去/顶端/近期未来/态度/外在影响/希望与恐惧/结果）/ 如何解读 / 何时使用 / 技巧 / FAQ / 掌握
  - 10 张牌含义每张 50-80 字，是**长内容 SEO 落地页**（不是单纯工具）

### 2.10 运势（4 个：daily/monthly/yearly/seasonal）
- 每日（1 张）/ 月运（3 张 = 上中下旬）/ 年运（按季 4 维度：事业爱情财富健康）/ 四季（5 张，节气限时，制造稀缺感）。
- 月运 H1 带当前月份（如"2026年6月月运塔罗"）= 动态 SEO 钩子。

### 2.11 变现模型（`/pricing`）⭐ 重点参考
**3 档会员**（Stripe 支付，USD 计价，随时取消）：

| 权益 | 免费 | Plus（$10.83/月，年 $129.90） | Pro（$83.33/月，年 $999.90） |
|---|---|---|---|
| AI 塔罗占卜 | **1 次/天** | 无限制 | 无限制 |
| 是否/爱情占卜 | 1 次/天 | 无限制 | 无限制 |
| 提问字数 | 300 | 800 | 1,500 |
| 追问次数 | 0 | 8 次/占卜 | 20 次/占卜 |
| 星币（虚拟货币） | 5/天 | 50/天 | 500/天 |
| 显化目标 | 1 个 | 3 个 | 无限 |
| 自定义塔罗师 | - | 1 位 | 5 位 |
| 深度洞察/全部牌阵/神谕卡/年运/专属牌背/冥想音乐/塔罗师角色/对话记忆 | - | ✅ | ✅ |

**机制亮点**：
- **星币**：虚拟货币（解神谕卡/深度功能消耗），会员每日发放 → 制造回访 + 消耗焦虑
- **自定义塔罗师**（Plus/Pro）：用户自建塔罗师人设、语言风格、AI 头像 → 高粘性 + UGC
- **对话记忆**：每位塔罗师记得你 → 越聊越懂你 → 切换成本高，留存强

### 2.12 移动端体验（`home.mobile.png` 等 5 张）
- 顶部语言切换弹窗（检测浏览器语言主动引导）+ 汉堡菜单
- Hero 角色卡纵向列表、工具卡单列、抽牌输入框（0/300）+ 圆形发送按钮
- 整体流畅无错位，紫色主色调统一

### 2.13 视觉风格
- **白底 + 紫色品牌色**（神秘+科技平衡），塔罗牌图/星空元素
- 暗色模式（Toggle theme）
- 角色卡用插画/卡通头像（凜/月瑤等）

---

## 三、100% 抄蓝图：tarotap 功能 → goearthward 复制方案

### 3.1 我们手里的牌（复用资本）
- **22 张大阿尔卡那 tarot-knowledge.json**（21 字段/张：含 psychological_lens 心理学 / eastern_anchors+eastern_lens 东方 / crystals 水晶 / chakra 脉轮 / related_cards / related_intentions / shop_category / recommended_practice）—— **比 tarotap 更深，水晶电商专属**
- **390 水晶库**（crystal-attributes.json 621KB）+ 完整 Shop 电商闭环
- **现有 v6 工具**（crystal-tarot-reading.html）：focus 选择 + spread 选择 + question 输入 + 洗牌 + 切牌 + 翻牌 + reset + SEO accordion + disclaimer —— **已是完整单页塔罗，但只 22 大牌、单一流程、无 AI、无对话**
- **东方差异化主线**（Eastern-inspired crystal jewelry）—— tarotap 完全没有，是我们的护城河
- **WP/WoodMart 站点 + Rank Math SEO + 图片生成/上传脚本体系**

### 3.2 逐功能对应表

| tarotap 功能 | 我们现状 | 复制方案 | 优先级 | 工程量 |
|---|---|---|---|---|
| **皇冠：AI 塔罗占卜（选角色→输入→AI选阵→抽牌→对话解读→追问）** | v6 有抽牌流程但无 AI、无角色、无自动选阵 | **新建**：①3-5 个塔罗师角色（东方化命名：如"墨竹·抉择"/"琉璃·疗愈"/"星河·抉择"，复用 eastern_lens）②接 AI（先固定 prompt 模板生成解读，非真对话）③AI 按问题关键词选牌阵 ④解读后给 3 个追问按钮（预设，非自由对话，省 LLM） | **P0** | M（角色卡 UI + AI 接入 + 牌阵路由 + 解读模板） |
| **AI Psychic Chat（纯对话）** | 无 | **降级新建**：MVP 不做真自由对话（LLM 成本高），做"问题模板化回复"——用户选问题分类（爱情/事业/人生/水晶），AI 基于抽牌结果给结构化解读。真对话放 P2 | P1 | L（真对话）/ S（模板化） |
| **是与否塔罗（单牌+三牌）** | v6 可改造 | **复用 v6**：加"是与否"spread 预设（单牌看正逆位、三牌看多数倾向）+ 是与否判定逻辑 + 该主题 SEO 内容 | **P0** | S |
| **爱情塔罗（4 场景）** | v6 可改造 | **复用 v6**：加爱情 spread 预设 + 4 场景 SEO 落地页（他在想什么/正缘/关系/挽回） | **P1** | S |
| **自由抽牌** | v6 就是 | **复用 v6**：draw-cards 页面 = 当前 v6 简化版 | P1 | XS |
| **神谕卡（6 副）** | 无 | **新建（差异化）**：做"水晶神谕卡"——用 390 水晶库做牌面（每张水晶 = 一张神谕卡，含能量关键词+东方寓意），这是 **tarotap 没有的独家功能** | P2 | M |
| **塔罗显化（目标打卡）** | 无 | **暂缓**（需用户系统+打卡，工程重，P3） | P3 | L |
| **本命牌计算器** | 无（有 life-path 计算器可复用前端） | **新建**：输入生日→算 2 张本命大牌→12 组合 SEO 页。复用 numerology 计算器前端 | P2 | S |
| **牌阵页（二择一/三择一/凯尔特十字）** | v6 有 spread 选择但无独立页 | **复用 v6 + 新建内容**：每个牌阵独立 SEO 页（工具 + 长内容），凯尔特十字 10 牌位详解直接抄结构 | **P1** | M（3 页内容+工具） |
| **每日运势（1 张）** | 无 | **新建**：每日一牌（按日期种子固定出牌）+ 每日内容。可复用 horoscope 月运脚本逻辑 | P1 | S |
| **月运/年运/四季** | 无（有 horoscope 年月运内容线） | **新建**：复用 horoscope 内容线的图片/脚本体系，做塔罗版月运（3 张）/年运（4 维度）/四季（5 张） | P2 | M |
| **多语言（20 语言）** | 无 | **战略缓做**：先中文（主）+ 英文（次）。tarotap 靠 20 语言放大 20 倍页面，但我们中文 SERP 已能打（见四），且电商转化以中英为主。其他语言用机器翻译批量做需 P3 | P3 | XL（20 语言）/ S（中英双语） |
| **变现：会员 3 档 + 星币 + 自定义塔罗师** | 电商（卖水晶） | **关键差异化**：tarotap 卖订阅，**我们卖实物（水晶）**。不做会员，改"工具免费引流 → 解读末尾推荐水晶 → Shop 转化"。可保留：①深度解读（需邮箱留存，做 lead gen）②专属牌背（Shop 实体产品，卖塔罗牌/水晶套装）| - | XS（复用现有 Shop） |
| **联盟营销（affiliate-program）** | 无 | **暂缓**（流量起来后再做） | P3 | S |
| **德语本地化长尾页模式** | 无 | **借鉴方法**：不抄德语，但**学它的"本地化长尾工具页"思路**——中文做"他喜欢我吗塔罗""该不该分手塔罗""换工作塔罗"等场景化长尾工具页（中文长尾词） | P1 | S/页 |

### 3.3 内容架构蓝图（goearthward 该建哪些页面）

**工具页（独立 URL，复用 v6 引擎改造）**：
1. `/tools/tarot-reading/`（皇冠，AI 塔罗，角色+自动选阵）— 升级 v6
2. `/tools/yes-no-tarot/`（是与否）
3. `/tools/love-tarot/`（爱情 4 场景）
4. `/tools/draw-tarot-cards/`（自由抽牌，= v6 现状）
5. `/tools/crystal-oracle-cards/`（**水晶神谕卡，独家**）
6. `/tools/tarot-birth-card/`（本命牌计算器）
7. `/tools/tarot-spread/two-options/`、`/three-options/`、`/celtic-cross/`（3 牌阵）

**运势页**：`/tarot/fortune/daily`、`/monthly`、`/yearly`、`/seasonal`（4 个）

**场景化长尾工具页（学德语模式，中文长尾）**：8-12 个
- 他喜欢我吗塔罗 / 该不该分手塔罗 / 换工作塔罗 / 该不该告白塔罗 / 复合塔罗 / 学业塔罗 / 财运塔罗 / 健康塔罗 …

**内容页（blog/学习，工具型 SEO 落地）**：对标 tarotap 14 篇 + 水晶差异化
- 塔罗新手完整指南 / 78 牌牌义系列（22 大牌先做，复用 tarot-knowledge.json 每张生成深度页）/ 是与否塔罗指南 / 爱情塔罗牌阵 / 塔罗禁忌 / 水晶+塔罗联动（独家：每张大牌对应哪些水晶，已含 crystals 字段）

**牌义库**（tarotap 没有独立 78 牌义页，jasiyu 靠这个堆 4803 页）：
- 22 张大牌深度页（先做，每张 = 牌义+心理学+东方+水晶+脉轮+推荐实践+Shop CTA）—— 我们数据深度远超竞品，是 SEO 长尾金矿

**预估页面总量**：MVP 阶段 30-40 页（7 工具 + 4 运势 + 10 场景长尾 + 10-15 内容/牌义），达到 tarothall（94 页 #2）规模即可争中文 SERP 前列；中期 80-120 页争 #1。

---

## 四、真实 SERP 对标（serp_check 验证）

### 4.1 tarotap 蹭哪些词（确认抄它能蹭的流量）
- **中文"塔罗占卜"（TW）**：tarotap.com **#1**，/zh 简体版 #13 → 中文 SERP 统治级
- **英文"free tarot reading"（US）**：tarotap.com/en **#13** → 前 12 都是老牌英文站（free-tarot-reading.net / llewellyn / evatarot / tarot.com / labyrinthos），#13 已是 AI 塔罗类第一

**结论**：tarotap 的中文流量是它的核心阵地（#1），英文靠 AI 差异化撕开缺口。**我们抄 tarotap 的中文打法，主攻中文 SERP**。

### 4.2 中文"塔罗占卜"竞品 sitemap 规模对比
| 站点 | SERP 位 | 页数 | 模式 |
|---|---|---|---|
| **tarotap.com** | **#1** | **441** | 工具优先 + 20 语言 + 精炼内容 |
| tarothall.com（塔罗馆） | #2 | 94 | 老牌中文，工具+少量内容 |
| cctarot.com | #5 | 90 | 工具型 |
| jasiyu.com（家思宇） | #14 | **4803** | WP 内容农场，海量长尾（牌义+博客） |
| tarotal.com | #15 | 660 | AI 塔罗平台，工具+多语言 |
| tarotbalance.com | #18 | 131 | AI 塔罗 |

**关键洞察**：
1. **tarotap 用 441 页打赢 jasiyu 的 4803 页**——靠工具优先 + 多语言，不是堆内容。这是我们应走的路径（轻内容重工具）。
2. **jasiyu 4803 页只排 #14**——纯内容堆量在工具站面前打不过，但它的「牌义库」是长尾金矿（我们 22 大牌深度页可抢这个长尾）。
3. **tarothall 94 页 #2**——中文老牌，工具型，是我们的直接对标（30-40 页 MVP 起步合理）。
4. tarotap 没有独立 78 牌义库（它的牌义在 blog 文章里），**这是 jasiyu 的优势 + 我们的差异化机会**。

### 4.3 中文 SERP 相关搜索词（可做工具/内容页）
塔罗牌在线占卜 / 塔罗牌占卜爱情 / 免费塔罗占卜 / 塔罗牌抽牌 / 塔罗牌测试 / 塔罗牌在线占卜事业 → 全部对应 tarotap 已有的工具页，我们复制同样工具页即可承接。

---

## 五、MVP 路线图（先抄什么，按 ROI 排序）

### Phase 0：升级现有 v6（1-2 天，零新增依赖）⭐ 最高 ROI
- v6 已有完整抽牌流程，**只缺是与否判定 + 爱情场景预设 + SEO 内容**
- 立刻产出 3 个工具页：`/tools/yes-no-tarot/`（加判定逻辑）、`/tools/love-tarot/`（4 场景）、`/tools/draw-tarot-cards/`（= v6 现状包装）
- 复用 22 大牌 tarot-knowledge.json（含水晶/chakra/东方/相关牌）→ 解读深度天然 > tarotap
- **产出**：3 个工具页 + Shop CTA（解读末尾推荐对应水晶，卖实物）

### Phase 1：皇冠 AI 塔罗（3-5 天）⭐ 流量核心
- 升级 v6 为皇冠工具：3-5 个东方化塔罗师角色卡 + AI 接入（先用模板化 prompt 生成解读，非真对话）+ AI 按问题自动选牌阵 + 3 个预设追问按钮
- 这是 tarotap 中文 #1 的核心入口，必须复制
- **差异化**：角色用东方人设、解读末尾水晶推荐

### Phase 2：牌阵页 + 运势 + 场景长尾（5-7 天）
- 3 个牌阵独立 SEO 页（二择一/三择一/凯尔特十字，长内容抄 tarotap 结构）
- 4 个运势页（每日/月运/年运/四季，复用 horoscope 脚本逻辑）
- 8-12 个场景化中文长尾工具页（他喜欢我吗/换工作/复合…，学德语模式）
- **累计页面**：~25-30 页，达到 tarothall 规模，争中文 SERP 前 5

### Phase 3：水晶神谕卡 + 本命牌 + 牌义库（差异化，5-7 天）
- **水晶神谕卡**（独家）：390 水晶做牌面，tarotap 没有
- 本命牌计算器（复用 numerology 前端）
- 22 张大牌深度牌义页（复用 tarot-knowledge.json 21 字段，SEO 长尾金矿，抢 jasiyu 的牌义流量）
- **累计页面**：~50-60 页

### Phase 4（可选，流量起来后）
- 中英双语（英文蹭"free tarot reading"AI 差异化）
- 更多语言（机器翻译批量）
- AI 真自由对话（LLM 成本可控后）
- 联盟营销

### 不抄的部分（刻意差异化）
- ❌ **不抄会员订阅**：我们是电商，工具免费引流→卖水晶，不做付费墙（tarotap 卖订阅 vs 我们卖实物，模式不同）
- ❌ **不抄星币/虚拟货币**：复杂且不适合电商
- ❌ **不抄自定义塔罗师**：UGC 重，留 P3 后评估
- ❌ **暂不抄 20 语言**：先中英，避免分散

---

## 六、方法论透明记录

1. **sitemap 全量解析**（mcp__sitemap__*）：get_sitemap_tree（441 页结构）+ get_sitemap_stats + 全量 curl 下载 sitemap.xml 用 Python 归类（按语言前缀 + path 模式）。**未只看首页**，全 441 URL 逐个归类，发现隐藏的 monthly/live-reading/德语长尾/affiliate 等页面。
2. **Playwright 实操每个功能**（shoot.py）：19 个桌面页 + 5 个移动页，每页截图 + 提取 H1/H2/nav/CTA/body_text。headless + 代理 http://127.0.0.1:10808。**未凭描述**，每个功能真实访问。
3. **截图视觉确认**（zai-mcp-server analyze_image）：home/psychic/pricing/spread-celtic/home.mobile 5 张关键截图逐张读图，确认布局/交互/变现/移动端。
4. **真实 SERP**（serp_check）：中文"塔罗占卜"+ 英文"free tarot reading"，确认 tarotap 实际排名 + 列全竞争对手。**未用 WebSearch 泛搜**。
5. **竞品规模对比**（get_sitemap_stats）：5 个主要中文竞品 sitemap 页数，验证"工具优先 vs 内容堆量"两种打法。
6. **现有能力核对**：读取 tarot-knowledge.json（22 大牌 21 字段）+ v6 generate.js/html（确认现有抽牌能力边界），作为"复用 vs 新建"依据。
