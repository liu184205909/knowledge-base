# 西方塔罗竞品 1D 深度拆解（11 家）

> 数据源：59 张已抓桌面截图（`07-互动工具/crystal-tarot-draw/build/_research/competitors-west/{站}/screenshots/`）+ 同目录 `data/structure_readable.txt`（抓图时同步记录的 TITLE/HEADINGS/NAV/CTAS/BODY）+ `mcp__sitemap` 实时拉取的 sitemap 结构。
> 抓取日期：2026-06-29。
> 选站依据：`serp_check "free tarot reading" us` 真实靠前（标注为 SERP 名次）。

---

## 0. 一句话结论：选牌交互抄谁

| 维度 | 标杆 | 抄什么 |
|---|---|---|
| **选牌交互（用户认可）** | **evatarot** | 牌背**横向一排铺开** + 顶部 `Choose 10 cards` 引导 + `Shuffle` / `Cut` / `Validate` 三按钮 + **可选问题输入框** + 牌背复古金棕花纹 + 深紫氛围 |
| **抽牌仪式感（Shuffle+Cut+Validate 三段式）** | **evatarot / 7tarot** | 切牌、确认两步给用户「我亲自参与了」的掌控感，区别于一键出牌 |
| **牌阵丰富度（14 种牌阵下拉）** | **trustedtarot** | 单页 14 种牌阵（Celtic 经典/新版、Universal 6、PPF、爱情、金钱、Mind-Body-Spirit…）+ `Enable reversed cards` 逆位开关 |
| **AI 个性化叙事（新世代）** | **tarotoo** | AI 结合用户问题动态解读（非静态文案）+ 动画牌面 + `Ask me anything` 问题框 + Deep/Simple 双模式 + 6 语言 |
| **真人占卜变现收口** | **micheleknight / trustedtarot / free-tarot-reading.net** | 免费工具引流 → 电话/SMS/直播真人占卜付费（£1.53/min、$9.95 会员、 affiliate） |
| **内容护城河（牌意+学习）** | **free-tarot-reading.net / llewellyn / tarot.com** | 78 张牌意库 + 12 周学习课程 + 百科 + 期刊，SEO 长尾 |

**最终建议（对水晶塔罗工具）**：选牌交互 = **evatarot 模式**（横向铺开 + Shuffle/Cut/Validate + 可选问题，已被用户认可）+ 牌阵丰富度学 **trustedtarot**（多牌阵 + 逆位开关）+ AI 个性化解读学 **tarotoo**（结合问题动态生成，区别于竞品静态文案，正好契合水晶站「390 颗水晶库 + 兼容引擎」的东方差异化叙事）。

---

## 1. 11 家选牌交互横向对比表

| 站点 | SERP | 牌背铺开方式 | 选牌引导 | Shuffle 洗牌 | Cut 切牌 | Validate 确认 | 问题输入框 | 牌阵/牌数 | 选满行为 |
|---|---|---|---|---|---|---|---|---|---|
| **evatarot** | #3 | **横向一排铺开**（金棕复古牌背） | `Choose 10 cards from the deck below` | ✅ Shuffle | ✅ Cut | ✅ **Validate** | ✅ 可选(optional) | 10 牌（固定） | 选满→Validate 确认→翻牌 |
| **7tarot** | #12 | **横向一排铺开**（黑底白花纹） | `SELECT 10 CARDS FROM THE DECK BELOW` | ✅（流程内） | ✅（流程内） | ✅（流程内） | ✅ | 10 牌 | 选满→翻牌 |
| **free-tarot-reading.net** | #1 | **堆叠成一叠**（点牌堆抽牌） | `We shuffled 5 times. Tap the deck and choose 6 cards` | ✅（`tap here to shuffle again`） | ❌ | ❌ | ❌ | Universal 6 牌阵（固定） | 点牌堆 6 次 |
| **trustedtarot** | #13 | **网格铺开**（约 5×10 矩阵，蓝白花纹） | `Please choose 10 Tarot cards` | ✅ `Shuffle Virtual Tarot Deck` | ❌ | ❌ | ❌ | **14 种牌阵下拉** + 逆位开关 | 按所选牌阵定张数 |
| **tarotoo** | #17 | **横向铺开** + 动画牌面（3D 感） | `Select 5/4/3/2/1 cards`（倒计数引导） | ✅ SHUFFLE | ❌ | ✅ `PICK THE CARDS` | ✅ `Ask me anything 0/200` | **3 牌 / 5 牌可切** + Deep/Simple 双模式 | 倒计数→选满→PICK |
| **tarot.com** | #15 | 牌阵页（hub 不展示铺开，进占卜页才有） | 各占卜入口 | 占卜页内有 | — | — | 占卜页内 | **极丰富**：3 牌/爱情/是否/每日/Celtic/Twin Flame/Soulmate/Two Hearts… | 按占卜类型 |
| **tellmytarot** | #4 | 引导页（首屏单牌装饰，未进抽牌流） | 入口 Daily/Love/YesNo 三按钮 | 占卜子页 | — | — | 占卜子页 | 主打「hyper-personalized」 | 子页流程 |
| **tarotgoddess** | #5 | 首页不直接铺开（分类入口） | 分类 Card of Day/multi-card | 占卜子页 | — | — | 占卜子页 | One Card / PPF(4 牌) / Celtic / yes-no oracle / Rune 等 | 按类型 |
| **micheleknight** | #6 | Start 按钮→系统抽单牌（非手选） | `Click the start button to begin` | 系统自动 | ❌ | ❌ | ❌ | **单牌**为主（Single/3 牌/Celtic） | 一键 Start |
| **llewellyn** | #2 | 分步流程（Step1-5 选 deck/位置/逆位/问题） | Step 引导 | ❌ | ❌ | `Show Tarot Reading` | Step4 提示想问题（无框） | **3 牌 PPF**（固定） | 选满 3 位置→Show |
| **ifate** | #18 | 占卜子页（截图被 Cloudflare 挡） | `start this reading` 入口 | 占卜页内 | — | — | 占卜页内 | Celtic Cross(10) / PPF(3) / Rune 等 + Tarot GPT(AI) | 按类型 |

**图例**：✅ = 有 / ❌ = 无 / — = 未在抓取页确认。

---

## 2. 三大交互流派

### 流派 A：evatarot 式「横向铺开 + 三按钮仪式」（用户认可标杆）
- 代表：**evatarot、7tarot**
- 特征：牌背横向一排整齐铺开，用户逐张点选；配套 `Shuffle`（洗牌）+ `Cut`（切牌）+ `Validate`（确认翻牌）三段式，模拟真实塔罗仪式；顶部明确 `Choose N cards` 引导。
- 优势：用户掌控感最强（自己洗、自己切、自己确认），仪式感拉满，复购/分享率高。
- 这正是用户已认可的标杆（见 memory `tarot-draw-interaction-preference`）。

### 流派 B：trustedtarot 式「网格铺开 + 多牌阵」
- 代表：**trustedtarot**
- 特征：牌背以网格矩阵（约 5×10）铺开；顶部 **14 种牌阵下拉**（Celtic 经典/新版、Universal、PPF、爱情、金钱、Prosperity、Mind-Body-Spirit、Issue-Action-Event…）；`Enable reversed cards` 逆位开关 + 自选逆位概率（5%/10%/50%）。
- 优势：牌阵选择最丰富，单页覆盖最多意图；逆位开关是专业感加分项。
- 劣势：纯功能导向，仪式感弱于 evatarot。

### 流派 C：tarotoo 式「AI 个性化 + 倒计数 + 动画」（新世代）
- 代表：**tarotoo**
- 特征：牌面带动画/3D 感；`Select 5/4/3/2/1 cards` **倒计数引导**（每选一张数字递减，视觉反馈强）；`Ask me anything 0/200` 问题输入框；Deep（5 牌）/ Simple（3 牌）双模式；AI **结合用户问题动态生成解读**（非静态预写文案）；6 语言。
- 优势：最现代、最个性化，AI 解读是区别于老站静态文案的核心差异化。
- 劣势：仪式感（Shuffle/Cut）弱于 evatarot。

### 流派 D：一键出牌（弱交互）
- 代表：**micheleknight**（Start 按钮→系统自动抽单牌）、**free-tarot-reading.net**（点牌堆 6 次）、**llewellyn**（分步流程）
- 特征：用户参与度低，主打「快速拿结果」或「真人/付费引流」。
- 优势：门槛低、转化快。
- 劣势：无掌控感，复购靠内容/真人而非交互。

---

## 3. 各家变现模式对比

| 站点 | 主变现 | 价格/机制 |
|---|---|---|
| **micheleknight** | 真人电话/SMS/直播占卜 | £1.53/min 电话、£1.50/条 SMS、Zoom 视频、psychic reader 79 人 |
| **free-tarot-reading.net** | 会员制 + AI tokens + live reader 分成 | $9.95/$39.95/$79.95 会员 + LTT tokens 调 AI + live reader affiliate |
| **tarot.com** | 付费占卜 + Karma Coins + 占星报告 | premium reading + 50% OFF 首单 + 占星/爱情报告 |
| **trustedtarot** | live reading 引流 + 打赏 + App | /live-reading/ 引流、patron 捐赠、iOS/Android App |
| **llewellyn** | 卖书/卖牌/卖年历（出版社主业） | BUY NOW 实体塔罗牌 + 1901 年至今的出版帝国 |
| **tarotoo** | App 下载 + psychic chat + affiliate | /psychic 引流 + App + 多语言全球化 |
| **tarotgoddess** | Amazon affiliate + Ko-fi 打赏 | Amazon 联盟（塔罗牌）+ 自愿打赏，轻商业化 |
| **evatarot / 7tarot / tellmytarot / ifate** | 广告 + 引流 psychic | 广告位 + /psychic-reading 等引流 |

---

## 4. 单家文档索引

| 文档 | 站点 | SERP | 一句话定位 |
|---|---|---|---|
| [西-free-tarot-reading-net.md](./西-free-tarot-reading-net.md) | free-tarot-reading.net | #1 | Lotus Tarot，2002 至今，200 万次+，会员制 + AI tokens |
| [西-llewellyn.md](./西-llewellyn.md) | llewellyn.com | #2 | 1901 年身心灵出版社，塔罗占卜为卖书引流 |
| [西-evatarot.md](./西-evatarot.md) | evatarot.net | #3 | **选牌交互标杆**，横向铺开+Shuffle/Cut/Validate |
| [西-tellmytarot.md](./西-tellmytarot.md) | tellmytarot.com | #4 | 主打 hyper-personalized，引导页式 |
| [西-tarotgoddess.md](./西-tarotgoddess.md) | tarotgoddess.com | #5 | 2006 至今，女神风，Amazon affiliate 轻商业 |
| [西-micheleknight.md](./西-micheleknight.md) | micheleknight.com | #6 | 真人 psychic 电话/SMS 变现，免费塔罗引流 |
| [西-7tarot.md](./西-7tarot.md) | 7tarot.com | #12 | evatarot 同款横向铺开+三按钮，多语言 |
| [西-trustedtarot.md](./西-trustedtarot.md) | trustedtarot.com | #13 | **14 种牌阵 + 逆位开关**，真人手洗牌叙事 |
| [西-tarot-com.md](./西-tarot-com.md) | tarot.com | #15 | 体量最大（1354 页），占卜+占星+东方智慧全矩阵 |
| [西-tarotoo.md](./西-tarotoo.md) | tarotoo.com | #17 | **AI 个性化 + 动画牌面**，6 语言新世代 |
| [西-ifate.md](./西-ifate.md) | ifate.com | #18 | 2007 至今，塔罗+易经+占星+塔罗 GPT，UGC-free |

---

## 5. 给水晶塔罗工具的可抄清单（§9 汇总）

1. **选牌交互 = evatarot 模式**：横向铺开牌背 + `Choose N cards` 引导 + `Shuffle`/`Cut`/`Validate` 三按钮 + 可选问题框（用户已认可，见 memory）。
2. **牌阵丰富度 = trustedtarot**：单工具支持多牌阵（单牌/PPF/Celtic/爱情/金钱…）+ 逆位开关 + 自选逆位概率。
3. **AI 个性化解读 = tarotoo**：结合用户问题 + 水晶库 6 维数据动态生成（区别于竞品静态文案，是东方水晶站的核心差异化）。
4. **倒计数反馈 = tarotoo**：`Select 5/4/3/2/1 cards` 每选一张递减，视觉反馈强。
5. **仪式文案 = evatarot/trustedtarot**：抽牌前「专注想问题 / 接地冥想」引导文，强化仪式感与信任。
6. **变现收口 = micheleknight**：免费塔罗引流 → 水晶 Shop（我们独有，竞品没有实物）。
7. **内容护城河 = free-tarot-reading.net**：78 张牌意库 + 牌阵百科 + 学习课程，做 SEO 长尾。
8. **避坑**：micheleknight 单牌靠 Start 一键（无掌控感）、free-tarot-reading 点牌堆（复古但不直观），都不如 evatarot 横向铺开。
