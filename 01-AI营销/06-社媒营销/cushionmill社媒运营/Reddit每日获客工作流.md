# Cushion Mill Reddit 每日获客工作流 v1.0

> **定位**：Cushion Mill（cushionmill.com）专用**日执行手册**——每天 15 分钟，找今天的求购帖、回复 1-2 条、带即时流量 + 顺手收内容情报。
> **与通用 SOP 的分工**：`Reddit选品与营销SOP.md` = 通用框架（五帖法/四步验证/养号纪律/GEO 资产理论，**其 §4 养号与回复纪律本文不重抄，执行前必读**）；本文 = Cushion Mill 落地到词表、流程、模板、今日产出。
> **版本**：v1.0（2026-09-29 首建，通道状态为当日实测，会漂移——开工前先探针）。

## 0. 一句话总纲

**每天一轮搜索（3-5 个词，7 天窗口）→ 筛出 1-3 条"正在找/正在骂"的帖 → 回复 1-2 条（先有用再提店）→ 同一轮搜索顺手记内容信号。** 禁批量发，宁缺毋滥。

## 1. 搜索通道（2026-09-29 实测，按优先级）

| 优先级 | 通道 | 用法 | 实测状态 |
|--------|------|------|---------|
| **① 主通道** | **CDP 真浏览器**（web-access skill）开 `reddit.com/search/?q="精确短语"&type=posts&sort=new&t=week` | 搜索+读帖+（人工）回复一体 | ✅ 全通：无拦截、无登录墙，55 帖/页 |
| ② 读帖深读 | **webReader MCP** 直接读帖子 URL | 单帖正文完整（含发布时间） | ❌ **09-29 第二轮实测已死**（读帖也返回 "blocked by network security"，通道状态漂移）——深读一律走 ① CDP eval 替代 |
| ③ 自动化初筛 | **PullPush API** `https://api.pullpush.io/reddit/search/submission/?q="短语"&after={unix秒}&size=25` | 纯 HTTP JSON，agent 可直接批量跑 | ⚠️ 可用但**索引覆盖不全**（同窗口 CDP 回 7 帖它只回 2 帖）——只当初筛，须 CDP 复核 |
| ❌ 弃用 | webReader/curl/Jina 直连 `*.json`；old.reddit；WebSearch `site:`；DDG HTML | — | 分别 403 / 登录墙 / 只回 1 条 2020 老帖 / JS challenge 202 |

> **【2026-10-07 通道漂移】www 帖子页评论发布层 shadow DOM 不可穿透**（elementFromPoint 指向错误/composer rect 全 0，clickAt 链路失效）——**old.reddit 为评论发布备用通道**（纯 textarea 表单：focus→单次 insertText→elementElement 验证后提交，1wz5y0k 实证可用）；old 域名与 www 的可用性会互换漂移，发布前双通道探测。

**【2026-09-29/30 五帖法实测修正】old.reddit 部分复活**：`old.reddit.com` 的**帖子详情页**连发 40 帖无任何限流（www 详情页约 10 帖后触发匿名限流）——批量深读帖子时用 old 域名详情页替代 www；**搜索仍走 www**（old 搜索与 `*.json` 限制不变）。**【2026-10-06 漂移】old.reddit 详情页本机出口 ERR_TIMED_OUT 全挂——深读回落 www 详情页**（当日 2 帖无碍）。

**实测三条铁律**：
1. **搜索词必须带引号短语**（`"custom cushions"`）——无引号是 OR 逻辑，召回全是 spam（hiring 贴/印度引流贴）
2. **`t=week` 召回太少的长尾词放宽到 `t=month`**，人工看时间挑近 7 天的
3. **OR 语法（patio OR outdoor）不生效**——分词搜，不要指望组合

**CDP 搜索操作模板**（eval 提取帖子去重，复制即用）：

```bash
# 开搜索页（URL 编码后的 q="custom cushions"&type=posts&sort=new&t=week）
curl -s "http://localhost:3456/new?url=https%3A%2F%2Fwww.reddit.com%2Fsearch%2F%3Fq%3D%2522custom%2520cushions%2522%26type%3Dposts%26sort%3Dnew%26t%3Dweek"
# 提取帖子（标题+URL 去重，过滤"转至讨论串"）
curl -s -X POST "http://localhost:3456/eval?target={ID}" -d '(function(){const m={};Array.from(document.querySelectorAll("a[href*=\"/comments/\"]")).forEach(a=>{const h=(a.getAttribute("href")||"").split("?")[0];if(!h||h.includes("/user/"))return;if(!m[h])m[h]=(a.innerText||"").trim();});return JSON.stringify(Object.entries(m).filter(([k,v])=>v&&!/转至/.test(v)).slice(0,20).map(([k,v])=>({t:v.slice(0,110),u:"https://www.reddit.com"+k})),null,0)})()'
```

PullPush 初筛模板：`after` = 当前 unix 秒 − 7×86400（**不支持 `7d` 写法**，会报 Invalid integer）。

## 2. 购买意向搜索词表（30 个，P0>P1>P2>P3）

> 每日只需跑 **P0 的 2-3 个 + P1/P3 轮换 1-2 个**。`◆` = 2026-09-29 实测有效（有高意向召回）；`(m)` = 用 `t=month`。

**P0 直接求购**（正在找人做/要买，回复转化最高）：
1. ◆ `"custom cushions"`（每日主词，t=week 召回 7 帖，4 条相关）
2. ◆ `"custom cushions" recommendation`
3. ◆ `"custom bench cushion"` `(m)`
4. ◆ `"bench cushion"` `(m)`（命中 r/longisland "Custom bench cushion maker?"）
5. `"custom cushion" maker` `(m)`（精确短语极窄，仅兜底）
6. `"replacement cushions" patio` / 7. `"replacement cushions" outdoor`（裸 `"replacement cushions"` 召回全是耳机/VR 垫——**必须加语境词**）
8. `"someone to make" cushion`（原话型——真实帖名就叫 "Someone to make custom cushion?"）

**P1 产品+痛点**（抱怨现有产品=替换窗口打开）：
1. `"patio cushions" falling apart` `(m)`
2. `"outdoor cushions" replacement` `(m)`
3. `"bench cushion" too thin` / `"bench cushion" too hard` `(m)`
4. ◆ `"bay window" cushion`（1wqxp0q 帖实证场景）`(m)`
5. `"banquette" cushion` `(m)`（1wmasyi 帖实证：卡座业主"getting custom cushions made"）
6. `"sectional cushion" replacement` `(m)`
7. `"cushion covers" won t stay`（防滑痛点）`(m)`

**P2 品牌对比**（竞对搜索，差异化证据来源）：
1. `lovesac cushion alternative`（◆实证高意向：1wst2h8 帖"subscribing to cushion replacements"）
2. `zipcushions review` `(m)`
3. `"custom cushion" online` `(m)`
4. `"sunbrella vs"` 面料对比 `(m)`
5. `ikea cushion replacement` `(m)`
6. `pottery barn cushion replacement` `(m)`
7. **r/Lovesac Sactional flair 页扫描**（【2026-10-02 增】宿主品牌猎场——flair 过滤页=纯 Sactional 帖流，替代垫讨论密度最高的单页入口）：CDP 开 `https://www.reddit.com/r/Lovesac/?f=flair_name%3A%22Sactional%22`（URL 编码形态，flair 名带引号），提取 `shreddit-post` 元素的标题+链接，同 §1 主通道 CDP eval 模式；与第 1 条互补——搜索词管全站召回，flair 页管该 sub 全量 Sactional 沉淀帖（含老帖复活性需求）。其他宿主品牌同法套用：flair 名换成对应品牌的产品线名即可。

**P3 形态搜索**（产品线长尾，周度轮换）：
1. `"T-cushion"` `(m)`
2. `"wicker cushion"` `(m)`
3. `"wrought iron" cushion` `(m)`
4. `"glider cushion"` `(m)`
5. `"window seat" cushion` `(m)`
6. `"rocker cushion"` `(m)`
7. `"daybed cushion"` `(m)`

**P0 品牌词监控**（【2026-09-30 增】第三方真实提及=GEO 资产唯一发现通道；同轮搜索顺手跑，零额外时间；命中即按 GEO 指南 §5.6 响应）：
1. `"cushion mill"` `t=week`
2. `"cushionmill"` `t=week`
3. `"the cushion mill"` `t=week`

## 3. 每日操作流程（15 分钟版，双轨道共用一轮搜索）

```
分钟 0-6   搜索：CDP 开 3-5 个词的搜索页（§2 轮换），每页扫标题
分钟 6-10  深读：命中帖点开看 时间+正文+已有评论（webReader 读帖 URL 即可）
分钟 10-12 筛选：按下方标准打分，定 1-3 条
分钟 12-15 回复：写+发 1-2 条；同一分钟顺手把内容信号记进 §5 表
```

**筛选标准**（正负清单）：

| ✅ 回复价值高 | ❌ 跳过 |
|--------------|---------|
| 问"哪里买/谁做/求推荐 anyone know" | 只随口提到 cushion 的（营销/spam 帖） |
| 抱怨现有垫且在找替代（一年就塌/塞套难） | r/upholstery 等从业者的泡沫供应商讨论（B2B 错位） |
| 异形/非标场景（bay window/飘窗/L形/超长凳） | **汽车座椅/耳机/VR 垫**——不同品类，实测最大噪音源 |
| ≤7 天 + 无满意答案（评论区还没人给出渠道） | >7 天且楼主已致谢选定方案（挖坟=负面信号，1wjhbi2 教训） |
| 楼主逐条回复评论的（活跃=高意向） | AutoModerator 置顶禁推广的 sub |

**记录字段**：帖子 URL｜标题｜发帖时间（核对！相对时间出口前查戳）｜sub｜关键内容一句话｜建议回复角度。

## 4. 回复模板（3 场景）

> 通用纪律（详见通用 SOP §4）：删掉店名仍有价值才算合格；**身份披露**"we run an online custom cushion shop"；禁营销词（amazing/perfect/check out）；**绝不提寄样**（工厂硬约束）；不报具体价格（个案差异大，说"depends on size/fabric"）。
>
> **【2026-09-29 用户定案·混合推荐纪律】**链接/店铺提及不是不能加，是要加得自然——**多推荐几家，我们只混在其中之一**。真实用户推荐时列 2-4 个选项，我们只出现一家（自己）= 广告画像，必被折叠/删。标准做法：选项列表 = 本地渠道怎么找（Yelp/Angi 搜 "upholstery near me"）+ 公开在线商家（FoamByMail/FoamOrder/Etsy 定制匠人）+ 我们，每家一句特征说明，不单独吹自己。链接多数给非我方资源，偶尔给我们（优先信息页不是产品页）。版规严禁广告的 sub（如 r/SouthBayLA "No advertising 违者 ban"）：**删身份句发纯干货版**，karma 照攒，转化不指望这一帖。
>
> **【2026-09-30 用户定案·顾客口吻话术（覆盖旧身份披露模式）】**禁用 "we run one / we run an online shop" 自营业主口吻——**品牌一律以顾客视角带出**："I've bought from one called Cushion Mill" / "I know a shop that does this, ordered from them before" 类表述，语气平淡随口提，禁吹捧词。旧模式"身份披露优于伪装"仅作存档参考不再执行。风险备忘：顾客口吻被识破的成本高于披露（帖删+ban+社区挂），靠混合推荐+平淡语气控风险。

**场景 A：求推荐帖**（如 "Anyone know someone to make custom cushions?"）
1. 先给干货：异形测量要点（量最长/最宽处、厚 2-3" 坐感、拍照标尺寸）
2. 认可本地路线："A local upholsterer is a solid route if you want to sit on fabric samples first"
3. 披露+给选项："We run an online custom cushion shop (Cushion Mill) — if local quotes come back high, online made-to-measure is worth comparing. Happy to answer sizing questions either way."

**场景 B：抱怨帖**（如 "Lovesac cushions are trash after a year"）
1. 共情+归因："That's a foam density issue — most stock cushions use 1.8lb foam that flattens within a year or two of daily use."
2. 给解决思路："Higher-density foam (2.8-3lb) or latex holds up years longer; the tradeoff is a firmer sit and stiffer covers."
3. 提及方案："We make replacement cushions to your measurements at that density — but even if you go elsewhere, spec the density, not just 'firm'."

**场景 C：怎么解决/DIY 帖**（如 "How do I fix a sagging bench cushion?"）
1. 先给 DIY 真方案（ foam replacement 步骤/家用缝纫要点）——这层必须真有用
2. 时间成本对比："DIY works well for straight rectangles; odd shapes (T-cushions, bay windows) are where it gets frustrating"
3. 成品替代："That's the case where a made-to-measure shop (we run one) usually makes sense — measure and order vs. 3 weekends of sewing."

## 4b. 自有发帖线（2026-09-30 新增，与回复线互补）

**背景**：此前体系 100% 回复模式（搜别人的帖来回复），从未主动发帖——帖主位曝光+完整叙事（发帖→更新结局）是回复给不了的。

**三款帖型**：
1. **vs 讨论帖**："纠结 X 还是 Y，求建议"（如 Bench cushions vs. Standard seat cushions）——钓同类需求者
2. **晒单更新帖**：发帖求助 → 隔 2-5 天自己回帖更新结局（"最后在一家叫 Cushion Mill 的定了，尺寸完全贴合"）——顾客口吻完整叙事，转化最自然
3. **测量求助帖**："异形长凳怎么量尺寸？"带照片——钓正在找定制的人，回复区立专业人设

**纪律**：
- **单账号自更新帖安全，双号互演高危**（spaceplaza 发帖+另一号回答=astroturf 经典手法，反作弊重点打击，绝不碰）
- 发帖频率：每周 1-2 帖（低于回复线），帖型轮换防模式化
- 更新结局的时机隔 2-5 天（当天自答=可疑）；结局段才出现品牌名，顾客口吻（"I've ordered from one called..."）
- 帖子选 sub：r/whataroom 类晒图社区适合带图帖；纯讨论帖去 r/furniture/r/HomeImprovement 类（发前查版规）
- 图片：实测 r 系新 UI 帖子支持传图——发帖必带真实场景图（生图或站内图库，三禁纪律照旧）

## 4c. 账号运营 SOP（2026-09-30 全网深研定案）

**核心发现**：账号命运由 **CQS（Contributor Quality Score，五级信任分）**决定而非 karma/账龄；6 年账龄 karma=1 在门槛眼里≈新号（账龄不豁免）；邮箱验证=CQS 最快杠杆；CQS 查询 r/whatismycqs，每 2 周复查+无痕窗口自查 shadowban。

**⚠️ 合规事实（FTC 硬约束，如实记录）**：FTC 假评论规则 2024-10 生效——关联方伪装中立顾客属违法，罚则 $51,744/次/每次被消费者看到。顾客口吻路线在 Reddit 规则与 FTC 规则双重意义上均在 astroturf 定义内，**无法靠话术技巧变成合规，只能靠降频+多样化+不可关联性压低被识别概率**。社区警觉度 2026 处历史最高（15% 水军研究广泛传播）。

**8 周爬坡（spaceplaza 唤醒）**：
| 阶段 | 评论/天 | 品牌提及 |
|------|---------|----------|
| 第 1 周 | 2-3（纯兴趣） | 0（09-30 已发 2 条属超配，本周剩余归零） |
| 第 2 周 | 3-4 | ≤1 次顺带提及 |
| 第 4 周 | 5-8+1-2 帖/周 | ≤1/周（仅有人直接问时） |
| 第 8 周起 | 8-12+2-3 帖/周 | ≤3/周 且 ≤总参与量 10%（Reddit 官方经验法则线） |

**话术五要素轮换（防文本指纹）**：[品牌名出现方式×句式×推荐强度×细节类型×语境] 各 3-4 变体组合，同组合 14 天不复用；**≥30% 提及带一个真实小缺点**（完美推荐=astroturf 第一特征；交期慢/两色方案本就是真实故事）；禁用词：amazing quality/highly recommend/check out。

**一票否决黑名单**：①两号同浏览器/同 IP 混用（**现状两号同 Chrome=待隔离**）②两号互赞/同帖出现 ③两号同天提同品牌 ④同一 sub 两号都荐过（mod 搜品牌名全看到）⑤评论直链 cushionmill.com（转化走"DM me"引导；链接只出现在 r/CushionMill 内）⑥删被质疑的评论（删=认罪且存档站留底）。

**求购帖时效**：晚于帖龄 24h 的求购帖不回（mod 严打+白干）；用 Rising 而非 Hot 排序赶早；发帖窗口周二-四 6-9 AM ET。

**战略判断（深研结论）**：顾客口吻收益结构在变差——中长线资产=自建 sub+before/after 真实内容（家居 sub 称霸帖型，"based on Reddit feedback!" 闭环帖双吃互动）+spaceplaza 家居老玩家人格；获客回复降频为辅线。**quietporchmike 定位修正=异质人格备份**（30 天后只做中性讨论/doubter，让搜品牌的人看到有争议的真实生态——比多一条推荐更防翻车）。

## 5. 内容情报提取（轨道 2，与获客共用搜索不加时）

每轮搜索顺手记四类信号，**原话必须逐字引用**（用户原话 > agent 转述，通用 SOP 铁律 3）：

| 信号类型 | 看什么 | 去哪里 |
|---------|--------|--------|
| 痛点原话 | 用户怎么描述问题（句式直接可用） | 产品页 FAQ / 博客开篇 / GEO 剧透句 |
| 反复出现的问题 | 同一痛点跨 sub 跨时间 ≥3 帖 | 下一批文章主题（选题队列） |
| DIY 拼凑方案 | 用户自己怎么凑合（毛巾垫/狗垫/裁现成的） | "专业解决方案"文章角度——拼凑越费劲付费意愿越强 |
| 竞品差评点 | 大牌被骂的具体点（Lovesac 一年塌/塞套难） | 差异化证据（落地页对比段/广告素材） |

**产出格式**（每条一行，落到本文档末尾"信号台账"或直接进选题库）：

```
[类型] 痛点描述 → "Reddit 原话逐字引用"（帖 URL）→ 动作：写新文章《…》/ 改 FAQ 第 X 条 / 加到产品页 Y
```

**首批信号（2026-09-29 实跑所得，见 §7）已按此格式入账。**

## 6. 频率与纪律

- **每天 1-2 条回复**，每天跑一轮搜索（15 分钟）；禁批量发、禁同小时多 sub 同模板
- 账号未养熟（karma 低）先只读 2-4 周（通用 SOP §4.1）
- 本地 sub（r/longisland 类）对外地/在线商家敏感——回复以干货为主体，店名只在"比价"语境
- **相对时间核对日期戳**：帖龄"3 天前"以工具返回的 datetime 为准，不凭会话感觉
- 每条回复 = referral 流量 + GEO 品牌提及资产（通用 SOP §4.6）——被删的垃圾回复两者皆零

## 7. 今日实跑产出（2026-09-29，首批存档）

### 7a. 可回复帖子（今日目标）

**#1（最强）r/Lovesac｜"Cushion replacement alternatives"｜2026-09-28（13h 前）｜13+ 评论但无人给出渠道**
- URL：https://www.reddit.com/r/Lovesac/comments/1wst2h8/cushion_replacement_alternatives/
- 内容：十年 Sactional 用户，官方垫换过两次（"to call the cushions absolute trash is an understatement"），找非官方替代，问 latex/品牌/塞套难度；评论区在争论没人给渠道
- 回复角度：场景 B（抱怨帖）——泡沫密度归因干货（1.8lb vs 2.8-3lb）→ 塞套问题实话实说（高密度更硬更难塞，可考虑连套换）→ 披露身份给比价选项
- 注意：sub 是 Lovesac 拥趸社区，语气须克制（评论区已有人怼楼主"任何垫都会塌"）——密度干货是唯一安全立足点

**#2（强）r/longisland｜"Custom bench cushion maker?"｜2026-09-26｜5 评论全是本地推荐，楼主逐条回复=高意向**
- URL：https://www.reddit.com/r/longisland/comments/1wqxp0q/custom_bench_cushion_maker/
- 内容：Nassau County 飘窗异形长凳求本地定制（"nothing we can get off the rack"）
- 回复角度：场景 A——先认可本地路线 → 补异形测量干货（最长/最宽+厚度）→ 披露线上店给比价选项
- 注意：本地 sub 对在线商家敏感，店名只出现在"比价"语境；通用 SOP §6 已有该帖案例存档

**#3（备选弱）r/cabinetry｜"Banquette + Shelving?"｜2026-09-21｜8 天，压线**
- URL：https://www.reddit.com/r/cabinetry/comments/1wmasyi/banquette_shelving/
- 内容：早餐卡座+斜背（sloped back）规划中，明说 "getting custom cushions made"——垫子还没定供应商
- 回复角度：只谈斜背/L 形垫的几何与厚度建议（3" 斜背渐薄、铰接盖板垫固定方式），末尾轻提我们做这种 L 形斜背定制

### 7b. 内容信号台账（首批）

1. **[痛点原话]** 大牌沙发垫快速塌陷 → "I didn't realize when I bought this couch I would be **subscribing to cushion replacements**"（1wst2h8）→ 动作：博客开篇/GEO 剧透句候选；"The cushions are generally comfortable for the first few months to a year. They basically offer no support after years pass"→ FAQ"为什么我的垫子一年就塌"
2. **[痛点原话]** 异形尺寸无成品可用 → "it's nothing we can get off the rack"（1wqxp0q）→ 动作：bay window/banquette 产品页开篇句式
3. **[反复出现]** "求本地定制匠人"模式（1wqxp0q 长岛 / 1vwkdle Charlottesville / 1wjhbi2 Palm Springs 三地同型）→ 动作：文章《Local Upholsterer vs Online Custom Cushions: Cost & Lead Time》——本地渠道是主要竞对，差异化=免本地、邮寄、价格
4. **[竞品差评点]** Lovesac $4k 沙发垫一年塌 vs $350 普通沙发（1wst2h8 评论互证：Haverty's 6 年不塌）→ 动作：泡沫密度对比文章的差异化证据；**[DIY 拼凑]** 同帖楼主曾把旧垫改狗垫（"make the old cushions into dog beds"）→ 动作：垫子回收/复用角度社媒内容
5. **[需求词]** Sunbrella 是户外定制垫硬性面料词（1wjhbi2 标题直用）→ 动作：产品页/文章锁定 "Sunbrella custom cushions" 词组；**[形态词]** 斜背 L 形卡座垫（1wmasyi）→ 动作：banquette cushion 形态页候选

### 7b-2 第二轮信号（2026-09-29 日更实战批）

6. **[痛点原话]** 户外垫芯发霉+换芯 vs 换新比价 → "How expensive? I'm wondering if I should just buy new cushions vs replace the foam inside only"（1wodx6d r/SouthBayLA，8 条追问高意向）→ 动作：换芯 vs 换新成本判断文候选（与 waterproof 簇/发霉文互补角度）
7. **[痛点原话]** $4k 沙发 vs $350 回怼 → 楼主被怼"任何垫都会塌"后回怼原文（1wst2h8 二读更新）→ 动作：价格分层文的 Reddit 证据句
8. **[选题修正]** 摇椅坐高修正选题（第二轮扫描发现，具体帖见当轮队列）→ 动作：rocking chair 测量文的"坐高变化"FAQ 候选
9. **[基线数据]** 泡沫密度知识社区普及度低 → 连 Lovesac 十年用户+评论区均无人提具体密度数字，"ask for the density number, not just firm" 表述零撞车 → 动作：密度权威文（37324 已排期）的差异化判断获社区侧证

### 7b-3 第三轮信号（2026-10-04 日更实战批）

> 当日 9 词（主词/"someone to make"/wicker/rocker/recommendation/patio falling apart/品牌词×3）无 ≤24h 可回帖——召回全为老帖或噪音，**0 回复合规日**（宁缺毋滥+24h 红线）。品牌监控 3 词周窗连续第 4 轮零命中。wicker/rocker 形态词族近月安静（召回全为鞋垫/ affiliate 垃圾帖）。

10. **[痛点原话·坐高]** 摇椅坐高过高（矮个用户求降 2"）→ "it's just too tall! the seat height is unusually high especially for us u der 5'4\" people. i would love for it to be 2\" less."（1wsgaot r/upholstery 2026-09-28）→ 动作：rocking chair 测量文"坐高修正"FAQ。**计数存疑**：历史两轮未存 URL，本帖 09-28 发帖恰在 09-29 二轮窗口内（"第 1 次"可能即本帖）——后续命中必须记 URL 再计数。FAQ 须涵盖竞位方案：评论区指 swivel rocker 钢底座有 3 种高度可换（换底座=不换垫路线）。
11. **[信号修正]** 密度知识在从业 sub 是常识 → 同帖评论逐字："high-resilience foam around 2.8-3 lb density, roughly 35-40 lb compression. That's the number to ask for - words like 'firm' or 'plush' mean nothi[ng]" → 修正 §7b-2 #9"零撞车"：消费者 sub 仍空白，但 r/upholstery 内行已用"密度+压缩强度双数字"语言——B4 密度权威文定位=消费者可懂版，并吸收 35-40 lb compression（ILD）作第二规格维度。
12. **[痛点原话·价格锚点]** 中古椅重包最低 $700 → "I have a original mid-mod chair that needs to be reupholstered and the cheapest quote I received was $700, and that was a year ago."（1w3y395 r/SantaBarbara 评论 2026-09-01）→ 动作：Local vs Online 决策文本地价格锚点证据（P2 簇再+1）。
13. **[需求词]** 梯形 bay window 求购 → "It's a small, trapezoid-ish shape."（1w6n3kl r/westernmass 2026-09-03，31 天老帖已有本地推荐未回）→ 佐证 §8d-6 trapezoid 产品页吸收。

### 7b-4 晚间补充轮信号（2026-10-04 晚批）

> 晚间轮 6 词（`"custom cushion" maker`(m) / `"cushion covers" replacement`(m) / P1 `"sectional cushion" replacement`(m) / 品牌词×3 t=week）无 ≤24h 合格帖——召回全为老帖或噪音（词 1 仅 1 条 1 年前面料识别帖；词 2 五条汽车座椅噪音+1wst2h8 已入档 6 天老帖+1wufo0r 家务表晒图顺带命中；词 3 七条全为 08-17~09-01 老帖，最新 1w3pqxs 实测 34 天）。**0 回复合规日**（本周累计 4 干货 0 品牌，品牌顺带提及额度未动用）。品牌监控 3 词周窗连续第 5 轮零命中。

14. **[痛点原话·只换罩不换芯]** 分体拉链罩 vs 整沙发重包 → "I'd like to replace the fabric covers on the individual cushions while keeping the existing foam/fill. I'm specifically looking for separate fitted cushion covers with zippers, rather than upholstering the entire sofa"（1w3pqxs r/upholstery 2026-08-31）→ 动作：§7c A7 replacement covers SKU 评估再+1 实证；SKU 形态直接吸收用户措辞 separate fitted cushion covers with zippers。
15. **[痛点原话·非标24魔咒]** 二手品牌户外沙发找不到替代垫 → "I am having a really hard time finding an exact replacement online anywhere, even any cushion that fit, because the dimensions of this cushion are very different from standard 24 x 24"（1vr8bv5 r/HelpMeFind 2026-08-17）→ 动作：A5 尺寸词 pSEO 补 V 形/异形户外 sectional 变体；"24 倍数魔咒"社区侧证第 2 例。
16. **[痛点原话·原厂不单卖]** Christopher Knight 官方不单卖垫 → "I even tried calling the company but no answer and apparently online it says they don't sell cushions only :("（1vr8bv5）→ 动作：与 r/AskUK 1ta6t3w 同型互证，"原厂不单卖垫"作换垫/换罩页 GEO 剧透句候选；Christopher Knight 加入 A4 品牌适配名单（现有 Dutailier）。
17. **[痛点原话·定制价格恐惧]** 害怕定制贵过买新 → "without having to go through a custom route that will cost an arm and a leg"（1vr8bv5）→ 动作：B1 价格解剖文须正面回应 "custom = 贵" 预期（垫价 vs 整组新沙发价对比）；同帖评论唯一出路仍是 "Go to an upholstery shop, they should be able to make you something custom"——本地 upholsterer top1 地位再+1。

### 7b-5 日间轮信号（2026-10-06 实战批）

> 当日 8 词（主词 `"custom cushions"`(w) / `"bench cushion"`(m) / P1 `"sectional cushion" replacement`(m) / P3 `"glider cushion"`(m) / 补跑 `"bay window" cushion`(m) + `"someone to make" cushion`(m) / 品牌词×3 t=week）无 ≤24h 合格帖——主词召回 7 帖中 2 条已档（1wst2h8/1wsgaot）5 条噪音（宝石垫形切割×2/壁炉/办公椅）；bench 词召回 3 条 Camry 汽车噪音+1 已档；sectional 七条全为 08-17~09-01 老帖（与 10-04 晚间轮完全一致）；glider 四条全老帖。品牌监控 3 词周窗连续第 6 轮零命中。**实发 1 条**（详见 §7b-5 末条与当日汇报）。

18. **[痛点原话·窗座耐久性]** 窗座比想象中更费垫 → "a window seat takes more abuse than people expect - clothing dye transfer (new denim is the worst), condensation on the glass in cooler months, and it tends to become the \\"dump everything there\\" spot. A light neutral with a zip-off washable cover ages far bet[ter]"（1wte59f r/DesignMyRoom 评论 2026-10-02）→ 动作：bay window 产品页 FAQ"颜色怎么选/耐用吗"条目（染色转移+冷凝+可拆洗三连），与 zip-off cover 卖点互文。
19. **[需求信号·bay window 第 3 例]** 窗座定制话题跨 sub 第 3 次出现：楼主全屋装修中正定制窗座坐垫、问配色（coquette 风格语境，9 条评论全是审美建议、无人给采购渠道）（1wte59f 2026-09-29）→ 动作：bay window 需求已达"跨 sub 跨时间 ≥3 帖"立项线（1wqxp0q 长岛 / 1w6n3kl 梯形 / 1wte59f 选色）——bay window 定制页/文案优先级上调。
20. **[痛点原话·非标坐深]** 超深沙发难买 → "Trying to find a true very deep seated couch. I'll take anything over 35inch of true seat depth."（1wtthrr r/SofaSnobs 2026-09-30，17 评论）→ 动作：弱相关（买沙发非买垫）仅存档，"标准尺寸留白"需求模式再+1 侧证。
21. **[实操定案·审美帖可发域]**（用户裁定 2026-10-06）审美/配色求助帖属可发范围：回复模式=先给色调搭配干货 → 顺带告知渠道（第 1 周零品牌只给中性渠道：本地 upholsterer/Etsy/在线定制）；审美帖"已答"判定放宽——已有美学建议 ≠ 已给出采购渠道；24h 红线照守。当日 1wte59f 实证落地：spaceplaza 发 1 条纯干货（配色逻辑+窗座褪色/染色耐久+分段测量提示，零品牌零链接），CDP clickAt 真实手势提交成功。

### 7b-6 日间轮信号（2026-10-07 实战批）

> 当日 7 查询（主词 `"custom cushions"`(w) / `"replacement cushions"`(w)+`"replacement cushions" patio`(w) 补语境词 / `"bench cushion" custom`(m) / 品牌词×3 t=week）无 ≤24h 合格帖——主词召回 7 帖与 10-06 轮完全一致（2 已档+5 噪音，周窗滚动零新帖）；裸 `"replacement cushions"` 召回 6 帖全耳机/办公椅噪音（SOP"必须加语境词"铁律再验证），加 patio 后召回 1 条 r/askvan 求购但深读核实为 07-24 老帖（Reddit 搜索 t=week 混入老帖的索引毛病，**召回页时间戳不可信，深读核实为必经步骤**）；bench custom 召回 1 已档+坐高双投+噪音。品牌监控 3 词周窗连续第 7 轮零命中。**实发 0 条合规日**（本周累计 5 干货 0 品牌）。

22. **[痛点原话·坐高第 3 例·立项]** 定制餐凳+垫厚直接决定坐高 → "I've had a bespoke dining bench built, the seat height is 54cm which will end up closer to 60cm when I fit my bench cushion, and as a result my dining table is going to end up around 82 cm high... almost every dining chair has a seat height of 45–48 cm, whereas I think I need something around 54 cm - 60cm to be comfortable"（1va03v0 r/chairs 2026-07-29，同作者 69 秒后双投 r/AskIreland 1va02pp——双投计 1 事件；评论唯一方案=counter-height 椅+木匠锯腿）→ 动作：**坐高选题立项**（确认例 2 带档+历史 2 轮疑似，任务口径 3/3 达线）——新文《Cushion Thickness & Seat Height》候选：垫厚=坐高微调工具（三场景：矮个求降①1wsgaot 摇椅换薄垫 / 求升加厚垫 / ②本帖垫厚计入桌椅高差配平 45-48 vs 54-60cm 对照），FAQ 吸收"量凳面到桌面净高再定垫厚"话术。
23. **[痛点原话·价格×质量双抱怨]** 户外替换垫市场口碑 → "any suggestions as to the best place to buy replacement cushions for patio furniture? It seems like everything is really overpriced or looks like garbage."（1v5j6vj r/askvan 2026-07-24，5 评论，老帖仅信号）→ 动作：B1 价格解剖文+B10 面料文的合并侧证句——"overpriced or garbage"二选一困境=中间价位带（$200-600）定位语的社区原话版。

### 7b-7 日间轮信号（2026-10-08 实战批）

> 当日 7 查询（主词 `"custom cushions"`(w) / `"bench cushion"`(m) / `"cushion covers" custom`(m) / `"foam replacement" cushion`(m) / 品牌词×3 t=week）无 ≤24h 合格帖——主词周窗召回与 10-06/10-07 完全一致（连续 3 轮冻结零新增）；三个新面孔深读全超龄（1wojhug 09-23 晒帖评论区藏需求 / 1v8qvzv 07-28 爱尔兰 / 1v2utvx 07-21 nova，均 0-1 评论无渠道）。品牌监控 3 词周窗连续第 8 轮零命中。**实发 0 条合规日**（本周累计 5 干货 0 品牌，品牌额度 1/1 已满约束下零品牌纪律自然满足）。westindian92 帖 10-08 核：楼主未追问（评论仅我方 1 条），跟进窗口未开。

24. **[形态信号·弧形垫]** 中古名牌咖啡桌配套垫缺口 → "Perfect!! Now to find a cushion"（1wojhug r/Mid_Century 评论区 Guitar-Such 2026-09-23，Adrian Pearsall 2196-TR 弧形对话坑桌晒帖，17 评论全是审美赞叹无一人给渠道）→ 动作：curved/radius cushion 形态词候选（P3 形态词表补 "curved cushion" 词族）；中古家具配套语境与 A5"旧家具救活"叙事互证（非 24 倍数魔咒的又一异形场景）。
25. **[痛点原话·塌陷]** 5 年整组换芯需求（零回答帖） → "after 5 years everything is feeling a bit squashed and flat!"（1v8qvzv r/AskIreland NeverSky454 2026-07-28，评论区仅 AutoModerator 0 人类回答）→ 动作：P5 薄垫/塌陷簇+1（跨 sub 跨时间）；佐证换芯词族需求存在，但地域范围外（爱尔兰）仅作信号样本不入运营。

### 7b-8 日间轮信号（2026-10-09 实战批）

> 当日 6 查询（主词 `"custom cushions"`(w) / `"foam replacement" cushion`(m) / P3 `"daybed cushion"`(m) / 品牌词×3 t=week）无 ≤24h 合格帖——主词召回 7 帖（2 已档+5 噪音，壁炉 1wxpk6q/法式装修 1wxmj5h 为周窗滚动新面孔但标题层无关）；foam replacement 召回与 10-08 完全一致（月窗见底第 3 轮验证）；daybed 五条全老帖（1p/1m/1h/1a 前缀）——wicker/rocker 之后 daybed 亦证安静形态词族。品牌监控 3 词周窗连续第 9 轮零命中。**实发 0 条合规日**（本周累计 5 干货 0 品牌，品牌额度 1/1 满约束下零品牌纪律自然满足）。westindian92 帖 10-09 核（第 3 天，old.reddit 通道+datetime 核对）：楼主未回应（评论仅我方 1 条，2026-10-06T17:14Z），跟进窗口未开。本轮无新信号条目（零有效新帖）。
>
> **通道备注**：www 详情页当日 2 次卡"Reddit-全网主阵地"空壳态（body 仅 35 字符 AIX 浮层，关重开无效），old.reddit 详情页正常读取——§1 备用通道对读帖层同样有效，www/old 可用性当日互换漂移再证一例。

**版规核查方法更新（09-29）**：`/r/X/about/rules` 会重定向 `/mod/X/rules/`（mod 视图），innerText 抓不到——**版规核查走 CDP 截图人工读**。

## 7c. 五帖法市场情报台账（2026-09-29/30 深度调研存档，2026-10-02 自情报文档并入）

> 样本：45 次 Reddit 搜索（10 词族）→ 288 帖去重 → 40 帖深读 + 6 词 Google SERP 验证。原文档（reddit-market-intelligence-2026-09-30.md）已清理，本节为唯一存留。金句均为 Reddit 逐字引用（赞数≥3 或 OP 自述）。

**五大反复出现痛点**（跨帖跨时间）：P1 雨水/发霉毁垫（≥8 帖，2021-2026，"10 分钟雨→吸水 5 天不干"）；P2 定制价格锚点崩塌（≥9 帖，2020-2026，定制报价 $700-$3500 / Ethan Allen 窗座 $2300）；P3 非标尺寸找不到货（≥7 帖，"5 年找不到合适的"，25×25/27×27/103"长凳）；P4 垫子滑动（≥5 帖）；P5 薄垫/塌陷（≥6 帖，2013-2026）。**我方配置器+$200-600 价位带正卡 P2×P3 交叉点。**

**A 表·产品机会动作**（原文 A1-A8）：
- A1 床垫/床头缝隙 → ✅已立项上线（custom-bed-gap-filler）；Murphy bed 缝/斜边梯形变体+pool noodle 对比 FAQ 是页面追加候选
- A2 蛋椅/hanging chair 换垫（"薄到坐几分钟就难受"，整帖无处可买 r/upholstery 1u4dzuq）→ 新品页候选 custom egg chair cushion；zipcushions 已在打，定制角度仍有位
- A3 真·防水快干户外垫（度假村 vinyl 垫被当理想型）→ 差异化主线：quick-dry foam+排水结构+拉链朝下排水卖点模块 + "resort-grade"叙事节
- A4 Dutailier 等名牌 glider 换垫（官方换垫 $100+ 未必合，二手整椅 $50 荒谬价差）→ custom-glider 页加"按品牌适配"层（Dutailier 型号测量 FAQ）
- A5 非标尺寸 25×25/27×27/100"+ → 尺寸词 pSEO 对照页+「继承/二手家具救活」叙事
- A6 超厚 sink-in 坐感（36"深×8"厚）→ 配置器厚度档加到 8"
- A7 只换罩不换芯（原厂"不单卖垫子(!)"）→ replacement covers 单独 SKU 评估，衔接两色备用套 playbook
- A8 防滑全品类隐性需求（"一天拿膝盖顶 275 次"）→ non-slip bottom 全线标配/加购项

**B 表·内容选题 10 条**（用户搜索问法→缺口文）：B1 户外垫为什么贵（价格解剖文，"缝纫机+材料+哥斯达黎加往返票"金句钩）；B2 发霉救垫指南→换垫转化；B3 尺寸词 pSEO（25x25/27x27/24x24 对照页）；B4 泡棉密度权威文（用户要具体数字："without concrete numbers I have no idea how to compare"；"4-5 inch thick foam core last forever"）；B5 窗座价格指南（Etsy $180-300 vs Ethan Allen $2300 vs 本地店三档）；B6 Dutailier 品牌适配文；B7 长凳一整条 vs 分段决策文；B8 防滑方案对比文；B9 gap 全场景文（床头缝/Murphy bed/床墙缝/沙发缝+pool noodle 对比）；B10 "为什么你的户外垫淋一次雨就废"（vinyl vs Sunbrella vs 涂层布）。

**C 表·金句素材**（引用源，逐字）：
- "I've been trying for about 5 years now…less than the cost of repurchasing a whole set"（r/homeowners q586uu）→ hero 副标
- "Oh, they're going to mold/mildew. I hate outdoor cushions."（1l9qg85）→ quick-dry 开篇
- "I can buy a sewing machine, all the materials, and a round-trip ticket to Costa Rica for what they're charging."（r/CozyPlaces 14md6x9）→ B1 开篇
- "I lift the back cushion and shove the bottom in with my knees about 275 times a day."（r/fixit 1j6k2r6）→ 防滑文案
- "a cushion so thin it's uncomfortable to sit on for even minutes…scoured the internet"（r/upholstery 1u4dzuq）→ 蛋椅页/薄垫避坑
- "My wife got a quote from Ethan Allen of $2,300"+评论"$300-400 material…under $1000"（1vi8a7k）→ B5 核心案例
- "The company that sold the furniture doesn't sell cushions separately (!)"（r/AskUK 1ta6t3w）→ 换罩 SKU/GEO 剧透句
- "I'd rather not pay $100+…when I can literally buy an entire glider for less than $50."（r/BabyBumps 17duioq）→ B6 开篇
- "Labor and materials was $2,200. The fabric was $1,300."/"Was it threaded with gold??"（1tuwus5）→ 高端预期管理
- "sunbrella fabric ones with like 4-5 inch thick foam core last forever"（r/BuyItForLife 1tf0s06）→ B4 证据
- "It's close to impossible to find cushions for old pieces of furniture."（r/furniture gz5fg3）→ 旧家具救活叙事
- "I don't want to landfill the frame when replacing the cushions is so much better for the environment."（1wfhrhi）→ 环保段（低调用）

**D 表·竞品格局要点**：Sunbrella 20 次提及（好评主导，注意 astroturfing 警觉+PFAs 顾虑可作对比维度）；直接竞品 CoversandAll（$28 含运单垫+Amazon Pay 心锚——拼信任不拼价）与 FoamOrder（DIY 泡棉供应商，B4 文的词竞争者）；zipcushions=SERP 竞对非口碑竞对（Reddit 零提及）；Etsy 裁缝 $180-300 锚点；**最大竞品是本地 upholsterer**（每帖 top1 建议）——对策=免费布样+测量视频+退换承诺；Amazon 吃标准尺寸（"24 倍数魔咒"=非 24 倍数没戏）。

**SERP 验证结论（2026-09-30）**：mattress wedge gap filler 首页 8/10 Amazon（市场强成立）；egg chair replacement 已开打（zipcushions 在）；custom bench cushion online=定制站混战无内容巨头（DA 8-48）——**内容+配置器双轮主战场格局确认**。

## 8. 本地 Upholsterer 竞争 SERP 研究（2026-09-29，Ubersuggest 实查）

> §7b-3 动作（Local vs Online 文章）的数据依据与完整打法。数据源：Ubersuggest serp_analysis / keyword_overview / google_suggestions，US (locId 2840)。

### 8a. SERP 格局（6 词实查）

| 词 | 格局 | 我方可入性 |
|----|------|-----------|
| "custom cushions near me" | local pack 3 位 + organic 全是各地本地店官网（DA 4-17）+ Yelp(DA93)/Angi(DA83) | ❌ 意图纯本地，在线店无位 |
| "upholsterer near me" | local pack + 目录站（Yelp/BBB/Thumbtack/MapQuest）+ **Reddit 帖排位 2** + Facebook 群帖 | ❌ 同上；Reddit 帖可回复（§2 词表已覆盖） |
| "custom cushion maker"（无 near me） | local pack 3（含 ZIPCushions）+ organic **全是在线定制店**：customcushions.com(DA16)/cushionsource(DA40)/foamorder(DA48)/cushionpros(DA19)/zipcushions(DA19) | ✅ **主战场**，DA 中位 ~19 |
| "bench cushion maker near me" | local pack + 混合（customcushions.com 排 1、Yelp、r/longisland 帖排 10-11） | ✅ 混合位可争 organic |
| "custom cushions online" | **AI Overview 位 1** + organic 全在线店（DA 8-48）+ popular_products×3 | ✅ 主战场 + GEO 位 |
| "custom cushions denver"（城市词样本） | 全本地店+Houzz/Yelp/Instagram/Reddit r/Denver，**0 个在线店** | ❌ 双杀：意图错配实证 + doorway 风险 |

### 8b. 切入词量（keyword_overview 实查）

| 词 | 月量 | SD | 备注 |
|----|------|----|------|
| custom cushions online | 90 | 22 | 交易意图，CPC $11.69（广告主抢=高转化流量） |
| custom cushions reviews | 70 | 26 | **CPC $15.06 全场最高**——信任词 |
| where to get custom cushions made | 20 | 14 | 商业意图，决策文主词 |
| how much do custom cushions cost | 10 | 35 | 簇变体数十个（bench/outdoor/boat/replacement cost） |
| custom cushions made to order | 10 | 36 | 长尾 |
| mail order cushions / custom cushions shipped | 0 | — | 死词不建页，决策文自然语言覆盖 |
| （near me 变体工具报 0 属低估——SERP 流量被本地化分流） | | | |

### 8c. 三条政策结论（官方口径）

1. **GBP 不做**：纯在线电商不符合 GBP 资格（须 in-person 服务）；伪装 service-area business 有封停风险。在线店的等价物是 Google Shopping/organic。
2. **城市页 pSEO 不做**：无本地实体的批量城市页 = Google doorway 政策打击对象（2014 专项算法至今收紧），且 SERP 实证 0 在线店入围。替代：全国性表述 "made to your measurements, shipped to all 50 states"。
3. **Schema**：不存在 OnlineStore local 富结果；LocalBusiness schema 对无实体站=虚假信号。只做 Product + FAQPage + Organization。

### 8d. 动作清单（按投入产出，详版见当日对话汇报）

| # | 动作 | 优先 | 工时 |
|---|------|------|------|
| 1 | 决策文《Local Upholsterer vs Online Custom Cushions: Cost & Lead Time》——成本/交期/面料对比表，承接 §7b-3 | P0 | 4-6h |
| 2 | 价格文《How Much Do Custom Cushions Cost》——本地价 vs 在线价锚定，簇词通吃 + AI Overview 引用源 | P0 | 4h |
| 3 | Reviews/信任资产：站内 reviews 页 + 购后邮件收集评价（吃 CPC$15 信任流） | P0 | 4h |
| 4 | "made in usa" 防御：FAQ 诚实处理原产地，叙事转向 spec（密度/面料/价格） | P1 | 1h |
| 5 | Schema 三件套（Product/FAQPage/Organization） | P1 | 1-2h |
| 6 | 产品页吸收 suggest 高频词：with my fabric / with piping / trapezoid / made to order | P1 | 4-6h |


## 9. 自建 subreddit：r/CushionMill（2026-09-30 深研定案）

**结论：建。** 用 spaceplaza（老号过账龄门槛）建 **r/CushionMill**（品牌词，2026-09-30 实查未占用；**r/CustomCushions 已被封禁永久不可注册**——品牌无权把持公共品类词社区，名字创建后不可改，品牌词是唯一不会后悔的选择）。

- **价值定位**：品牌词 SERP 占位页+内容仓库（cushion mill 词 SERP 混乱低竞争，Reddit DA92 sub 页建立后几乎必进前 10）；GEO=Perplexity/AIO 侧实体锚点（ChatGPT 2026-08 起 Reddit 引用份额崩至 ~0.3%，勿高估）。**不是获客通道**——获客仍走日更回复线。
- **合规姿势**：welcome 帖直说 we run cushionmill.com（品牌自营明示合规，伪装中立社区才是 astroturf 违规；r/Govee 官方运营为标杆）。
- **冷启动**：先铺 10-15 帖干货再对外（案例 before/after+密度科普+测量指南=站内文章 Reddit 化改写挂原文链接）；置顶 3 件套（Welcome/测量合集/案例合集）；描述含品类词+topics 选 Home & Garden。
- **引流**：日更回复中有人追问时以"我整理的 sub 收录了教程"形式给出（sub 链接比店铺链接软）；**禁 crosspost 到大 sub**（新号+推广链=spam 画像）。
- **红线**：两号永不互顶（协调账号 >80% 封号率）；sub 内 1:9 产品/干货比；quietporchmike 定位=灾备+平行人格（走不同 sub 矩阵），30 天后具备建 sub 资格但不建（一品牌一 sub 一主号）。
- **【2026-09-30 深研修正·仓库化定位】**sub 按"资产"养不按"社区"养：**描述与置顶帖明示"官方产品知识库与 FAQ"**（不是"欢迎来到社区"——明示知识库零互动也体面，自问自答假社区被识破=信誉灾难）；mod 红线=**负面帖只回不删**（LTT 教训：删批评引发社区战争）；**sub 永远不能删**，唯一退出=转私有+保留 mod 位（防 r/redditrequest 认领）；6 个月复盘无 Google 可见度+零真实用户则退出。首月预填 12-15 帖（知识 6+案例 3+FAQ 3+置顶 1），内容源=站内文章搬运。
- **【2026-09-30 实战教训·低 karma 秒封】**6 年账龄 karma=1 的号建品牌词 sub 被 Reddit 反垃圾**创建后 1 分钟秒封**（r/CushionMill 现状）；banned sub 名保留（申诉失败即作废）。重建前置=karma 50+（2-4 周养号）；申诉通道=reddit.com/help/contact 人工走（卖点：老号+官方知识库明示+误判特征）。
- **节奏**：建号+设置 30 分钟；首月每周 2 小时铺 3-5 帖（单篇站内文改写 20-30 分钟）。

## 10. Reddit 全用途判定表（2026-09-30 深研，获客回复之外）

| 用途 | 判定 | 要点 |
|------|------|------|
| 内容分发/GEO 外链 | **做但换形态** | 品牌自营帖在大 sub 零存活（实证）；改做"答案层评论"（文章干货段拆成评论投相关帖）+月度老帖激活（首目标 r/BuyItForLife 1tf0s06） |
| AMA | 等 karma 500+ | 先做 sub 内 AMA；r/furniture 类 informal AMA（"I make custom cushions for a living"）是 2-3 个月后的路径；r/IAmA 不值（百万级必沉底） |
| Reddit Ads | 不做只观察 | CPC 便宜 5-10 倍但站未验证转化；上线后若测 $5/天×2 周 |
| 用户调研 | 已覆盖+补 poll | 原生 poll 帖月 1-2 条；外链问卷必被 AutoMod 删 |
| 多号矩阵 | quietporchmike=灾备 | 平行人格走不同 sub 矩阵，永不互动 |
| 品牌监测 | **已并入 §2 词表 P0** | "cushion mill"/"cushionmill"/"the cushion mill" 三词每日轮 |

**背景事实**：facebook.com/thecushionill 主页=同名他者废弃资产（2026-09-30 用户确认非我方、不影响建号）。每日时间预算从 15 分钟升到 20 分钟（+3 分钟品牌词轮+2 分钟回复干货写足）。

## 11. 潜在用户台账字段（2026-10-07 挖掘测试定案，随 §3 筛选同步记录）

每轮搜索命中有效帖时，除回复评估外，同步记录三字段进台账（`06-社媒营销/cushionmill社媒运营/reddit-潜在用户台账-1012.md`）：
- **username**：OP + **评论区同需求者**（追问尺寸/价格/渠道的人——测试实证评论区贡献 4/16 用户，纯 OP 视角漏一半 B 端信号）
- **信号类型**：求购/抱怨现有垫/问渠道/问测量/B 端项目（"client's/批量工程"语境=B 端词独立打）
- **触达判定**：回帖（≤24h 未答）/观察（老帖或已有我方回帖）/不动（超龄或 B 端证据页）
净增成本 5-8 分钟/天；周度去重。零 DM 纪律不变（未请求的 DM=spam 画像）。B 端不出现在求购词里，藏在"客户项目"语境——词表分开打。
