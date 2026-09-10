# looksmaxxing/颜值分析工具站可行性分析（第三轮：SERP实判+竞品解剖+词族边界重估）

> **性质**：2026-09-04主线程词池全景的落地验证轮。任务：验证"looksmaxxing工具站"作为工具站线低成本side experiment（复用摩斯样板：1-2天开发+单页工具+内容矩阵+挂件变现）是否成立。
> **数据源分级**：`[Ubs]`=Ubersuggest MCP（locId=2840，2026-09-07）｜`[DFS]`=DataForSEO SERP live advanced（9词，2026-09-07）｜`[Web]`=WebFetch实抓｜`[Search]`=WebSearch风险调研｜〔推断〕=基于证据的推论。
> **一句话结论**：**GO，但站名和边界要改**——不是"looksmaxxing工具站"，是"face analysis工具站"。looksmaxxing只是入口词之一，真实词池（attractiveness/face rating/golden ratio/face shape/age guesser族）大5-10倍；变现三层里meme广告和affiliate挂件两条**实测死路**，唯一活路=竞品已验证的"免费浏览器内工具引流+一次性付费报告"模式。

---

## 一、结论先行（判定总表）

| 层 | 实测证据 | 判定 |
|---|---|---|
| **工具词SERP可进性**（原核心疑问：是否被app锁死） | 9词SERP实判：looksmaxxing ai前9位中独立web工具站占5席（looksmaxxingai.app/overchat.ai/maxxing.me/looxup.app/deepsiteai.com）[DFS]；face rating ai前9位独立站6席[DFS]——**未被app锁死，app下载页只占1-2席** | ✅ 开放 |
| **竞品起量实证** | thefacereport.com：2026-03起步→2026-08月流量**118,667**，DA仅3、外链41条[Ubs]；maxxing.me：DA4、外链10条→23,028/月[Ubs]；looksmaxxingai.app：DA15→5,190/月（2026-02起步）[Ubs] | ✅ SERP对无外链新站极度开放 |
| **meme流量→展示广告**（游戏codes站模式） | mewing memes前8位=Pinterest/Instagram/Giphy/meme.com/redbubble/boredpanda/knowyourmeme+媒体，**零独立gallery站先例**；且SERP首位是Google images feature box[DFS] | ⛔ 砍：满足形态是图片格子，流量入口被meme平台占据，独立站无站位 |
| **mewing教程→gum/器械affiliate** | mewing gum前7位=Amazon+jawliner品牌站×2+Walmart+healthline+ADA[DFS]；jawline exerciser前7位=Amazon×2+Walmart+Target+eBay+jawzrsize品牌[DFS]——**零affiliate站** | ⛔ 砍：电商词PD89（背景数据）+SERP实判双重确认，Amazon/品牌/权威内容三重锁死 |
| **评分工具→freemium报告/订阅** | thefacereport：免费测试（浏览器内本地跑）+$17.49一次性报告（Stripe）+付费AI图像包，宣称"160,000+ scans/30 days"[Web]；maxxing.me：$19.99/周订阅（$0.99试用）/$49.99月[Web] | ✅ 唯一活路且两种定价均有人跑通 |
| **政策/伦理风险** | 无大规模下架案例（Umax仍在线，Apple 18+/Google Play Everyone）[Search]；监管压力上升（澳洲eSafety专页/医学界警告/Apple收紧AI app审查）；web站不受app商店政策管辖；竞品风控范式已成型（"facial geometry analysis"表述+on-device本地处理+照片自动删除）[Web] | 🟡 中等可控：表述纪律是硬要求 |
| **天花板** | thefacereport 6个月118K/月；老站attractivenesstest.com从370K峰值跌至20K（-93%）[Ubs]——niche潮汐性强、站生命周期可能12-18个月 | 🟡 原$300-800/月预估中位成立；上限更高但衰减风险真实 |

**总判定：GO（改定位进第二站候选池，与POD niche层同池排序）。最小形态=1个核心面部分析工具（纯前端MediaPipe本地跑）+8-12个工具落地页+15-20篇glossary内容页，变现=freemium一次性报告+工具页广告。1.5-2.5天开发。**

---

## 二、SERP实判：9词四分法统计〔DFS，2026-09-07〕

### 2.1 工具词SERP构成（核心疑问的直答）

| 词 | top10构成 | 独立工具站 | app下载页 | 大平台 | 内容/媒体 |
|---|---|---|---|---|---|
| looksmaxxing ai | 9 organic | **5**（looksmaxxingai.app/overchat.ai/maxxing.me/looxup.app/deepsiteai.com） | 2（apps.apple/play.google） | 1（reddit） | 1（youtube） |
| looksmaxxing gpt | 8 organic | 2（overchat/deepsiteai）+2个aiprm GPT商店页 | 0 | 2（reddit/wikipedia） | 2（businessinsider/vice） |
| looksmaxxing rating | 9 organic | **6**（looksmaxxingai.app/overchat/imagetoolshub/realsmile.online/maxxing.me/lookmax-analyzer.com） | 1（apps.apple） | 1（reddit） | 1（youtube） |
| face rating ai | 9 organic | **6**（thefacereport/ailabtools/lookmax-analyzer/maxxing.me/facewow/videoweb） | 0 | 1（fotor） | 1（swipestats） |
| attractiveness test | 9 organic | **5**（pfpmaker/thefacereport/attractivenesstest.com/maxxing.me/attractivenesstest.net） | 0 | 2（buzzfeed/youtube） | 2（reddit/proprofs） |
| glow up | 9 organic | 1（theglowup.app） | 1（play.google） | **7**（wikipedia/netflix/instagram/merriam-webster/reddit/rottentomatoes） | — |

**三条明文结论**：

1. **工具词SERP未被app锁死**。四个工具词（ai/gpt/rating/face rating ai/attractiveness test）的独立web工具站占比50-67%，app下载页仅0-2席。rankings上大量是2026年新起的DA3-15小站（§三流量数据佐证）。
2. **glow up裸词是废词**：SERP被BBC节目《Glow Up: Britain's Next Make-Up Star》支配（wikipedia知识图谱+netflix+rottentomatoes+cast carousel）[DFS]。该族只能走长尾（§四）。
3. **looksmaxxing gpt词已被媒体叙事占据**（businessinsider/vice的"ChatGPT给我打分"报道文+reddit道德恐慌帖）[DFS]——这个词进得去（aiprm/deepsiteai都排上了）但天然带争议叙事，非首选落地词。

### 2.2 meme词与挂件词SERP形态

| 词 | top位构成 | 判定 |
|---|---|---|
| mewing memes | **SERP首位=images feature box**；organic前8=Pinterest/Instagram/Giphy/meme.com/scarymommy/redbubble/boredpanda/knowyourmeme[DFS] | 独立gallery站零先例。Google把meme意图导给图片格子+meme平台。游戏codes站模式成立的条件是"SERP本身就排独立codes站"（刚性查询需求），此处条件不满足——**meme流量砍掉** |
| mewing gum | Amazon+jawliner.us（品牌DTC）+Walmart+healthline+YouTube+jawliner.com+adanews.ada.org；**popular_products模块出现4次**[DFS] | 纯电商SERP。ADA（美国牙科协会）下场辟谣=权威内容位也被占据。**affiliate砍掉** |
| jawline exerciser | Amazon×2+Walmart+Target+eBay+healthline+jawzrsize.com（品牌）[DFS] | 同上，五席纯零售平台+品牌站+一席权威内容，零affiliate站 |

**游戏codes站模式对照**〔推断〕：codes站能吃娱乐流量是因为"查code"是刚性导航查询、Google愿意排轻量工具页；mewing memes的满足形态是**看图**，Google用自家images box+Pinterest/Giphy满足——独立站没有可占的格。

---

## 三、竞品解剖：五个站的市场被吃程度〔Ubs domain_overview + Web实抓〕

### 3.1 流量与成长曲线（关键：全是2026年新站）

| 域名 | 2026-08月流量 | 起步时间 | DA | 外链/引用域 | 排名词数 | 核心占位词 |
|---|---|---|---|---|---|---|
| **thefacereport.com** | **118,667** | 2026-03 | **3** | 41/31 | 4,904 | how attractive am i 14.8K排#1；ai attractiveness test 14.8K排#2；am i pretty 12.1K排#2；face rating 9.9K排#2；golden ratio face 8.1K排#3；jawline rating 4.4K排#2 |
| **maxxing.me** | 23,028 | 2026-02 | **4** | **10/8** | 3,183 | ethnicity guesser 8.1K排#1；attractiveness test 27.1K排#4；psl score 8.1K排#3；how old do i look 22.2K排#10 |
| **attractivenesstest.com** | 20,897 | 2024-09前 | 31 | 2,161/722 | 3,408 | attractiveness test 27.1K排#2；how hot am i排#1 |
| **looksmaxxingai.app** | 5,190 | 2026-02 | 15 | 261/141 | 1,086 | looksmaxing scale 9.9K排#2；looksmaxxing rating 720排#1；mog face 6.6K排#6 |
| **lookmax-analyzer.com** | 4,520（7月峰值7,451） | 2025-09 | **3** | 43/39 | 1,521 | looksmaxing scale 9.9K排#1；face rating 9.9K排#3；jawline rating排#7 |

**三个结构性发现**：

1. **市场远未被吃满，反而在快速换血**。五个站里四个是2026年起量的新站；attractivenesstest.com（老站，2025-06峰值370K/月）已跌至20K（**-94%**）[Ubs domain_traffic月度曲线]——老站崩、新站起的循环说明①排名更替频繁=进入窗口持续开放②站的生命周期可能只有12-18个月（潮汐性，与游戏codes站同性质，接受即可）。
2. **DA3-4+不到50条外链就能做到月流量2-12万**——这个niche的排名门槛是全知识库已扫词池里最低的一档（对照：POD niche层需DA27起量，custom通用层SD65+）。maxxing.me以10条外链做23K/月是极端例证[Ubs]。
3. **词池高度可拆分**：五站各占不同子族头位（thefacereport占attractiveness/golden ratio/symmetry族，maxxing.me占ethnicity/age族，looksmaxxingai占scale/rating/mog族）——没有站通吃，子族间存在"一页一族"的占位机会。

### 3.2 工具形态与变现（Web实抓两站）

**thefacereport.com**〔Web〕：
- **功能**：478个面部 landmarks→40+指标（对称性/黄金比例/三庭五眼/canthal tilt/FWHR/下颌角），免费出分0-100；付费报告含脸型、改善排序、4周行动计划、AI造型预览
- **变现**：freemium——免费测试无账号无上传（"Runs right in your browser. No upload, no account"）；完整报告**$17.49一次性**（Stripe，web报告+PDF邮件，无订阅）；另有Glow-Up Pack/Custom Studio/Procedure Preview/Hairstyle Pack/Time Machine等付费AI图像包；宣称160,000+ scans/30天
- **页面结构**：23个工具页（/tools/attractiveness、/tools/golden-ratio、/tools/symmetry、/tools/jawline-score、/tools/canthal-tilt、/tools/facial-ratios、/tools/face-age…）+约17篇指南页（looksmaxxing/mewing/glow-up tips/**"Umax Alternative"竞品对比文**）
- **风控范式**：照片on-device处理、免费扫描2小时自动删除、"never sold or used for AI training"声明

**maxxing.me**〔Web〕：
- **功能**：glow-up test（面部+发型+风格扫描）→吸引力报告→个性化改善路径+20天课程
- **变现**：**$19.99/周**（$0.99试用7天自动续费）或$49.99/月——典型looksmax app式激进订阅，运营主体Glow Up LLC
- **页面结构**：10个工具型博客页（/blog/psl-scale、/blog/attractiveness-test、/blog/ethnicity、/blog/ai-age-guesser、/blog/celebrity-look-alike…每篇=一个工具+一篇内容）

**形态结论**〔明文+推断〕：两站均未公开所用模型；thefacereport"478 landmarks"正是MediaPipe Face Landmarker的478点数字且"浏览器内跑、无上传"——**纯前端MediaPipe方案已被竞品验证可行**，1-2天开发量成立。变现两种定价（一次性$17.49 vs 周订阅$19.99）都有人跑，一次性报告与本方"低摩擦side experiment"定位更配（无订阅客服/退款循环）。

---

## 四、词族边界重估：face analysis词池远大于looksmaxxing〔Ubs match_keywords，2026-09-07〕

### 4.1 三个相邻族实扫

**face rating + attractiveness test族**（建议词824个）——工具词密度极高：

| 词 | 量/SD | 词 | 量/SD |
|---|---|---|---|
| attractiveness test（seed） | 27.1K/26 | face rating（seed） | 9.9K/15 |
| ai attractiveness test | 14.8K/**16** | chatgpt attractiveness test | 1.3K/24 |
| face attractiveness test | 2.9K/13 | face rating app | 1K/30 |
| face rating ai | 2.4K/13 | attractiveness test ai | 720/16 |
| ai face rating | 1.6K/18 | psl face rating | 480/14 |
| free face rating / face rating website | 390+390/22,17 | chatgpt face rating + gpt族长尾 | 260-1.3K合计约2.5K |

工具词普遍SD 13-30、intent标Informational（用户找的就是"测一下"页面）。**族内还有竞品词谱暴露的更大家族**[Ubs domain关键词]：how attractive am i 14.8K、am i pretty 12.1K、psl scale 27.1K、psl score 8.1K、golden ratio face 8.1K、face symmetry 5.4K、face shape test（what is my face shape 14.8K）、rate my face 4.4K、jawline rating 4.4K、how old do i look 22.2K、ethnicity guesser 8.1K、hunter eyes 49.5K（glossary内容词）——**合并工具可承接词池保守60-100K/月**〔推断：seed实扫+五站排名词谱去重合计〕，对比背景口径的"looksmaxxing工具词仅~5K"（looksmaxxing ai 1.9K+gpt 2.4K+rating 720）放大了**10倍以上**。

**glow up族**（建议词25,023个）——大但脏：
- 可用长尾：skin care routine for glow up 9.9K/SD14、how to glow up 8.1K/SD18、glow up tips 4.4K/SD18、how to have/get a glow up 1.9K×2、how to glow up overnight/in a week 1K×2、glow up app 720（Transactional）、glow up ai 390/SD29[Ubs]
- 污染源三重：BBC节目词（season 6/7/netflix/cast/watch online合计约3K）、名人glow up词（bad bunny/will poulter/mark zuckerberg等，单个0.4-1.9K）、本地商家词（med spa/salon/studio/beauty supply，NAP意图）——**裸词22.2K不可用，how-to类约20-25K/月可用且SD 14-30偏绿**[Ubs]
- 该族是**内容页承接**（how to glow up指南）而非工具页，thefacereport的glow-up guides页已验证此路

### 4.2 边界结论

looksmaxxing（165K主词+工具词5K）只是这个市场的**一个小入口**；真实市场是"face analysis/test工具池"：attractiveness族27K+face rating族10K+golden ratio 8K+symmetry 5K+face shape 15K+age 22K+ethnicity 8K+PSL族35K+glossary内容族（hunter eyes 49.5K/midface/canthal tilt等）。**定位应从"looksmaxxing站"上移为"face analysis工具站"，looksmaxxing词族作为其中的内容线之一**——这与thefacereport（站名都不含looksmaxxing）的结构完全一致。

---

## 五、风险调研：政策/伦理/表述边界〔Search，2026-09-07〕

### 5.1 实况：无下架潮，但压力三面聚集

- **app侧**：Umax至今在架（App Store 18+ / Google Play "Everyone"，分级不一致已被theattractivenessreport点名）；克隆app（BestYou AI等）分级低至4+。Apple在收紧低质AI应用审查+改革年龄分级，但**无一例颜值评分app因"评分"本身被下架的实锤**[Search]
- **监管侧**：澳洲eSafety Commissioner已发布Umax专门警示页；澳洲U-16社交媒体禁令（2025-12生效）目前仅覆盖10个指定平台、不含此类app——监管在逼近但未落地到web站[Search]
- **舆论/医学侧**：Yahoo Finance/Mt.Sinai收录文"给男孩脸打分的looksmaxxing app加剧青少年心理危机"；Cleveland Clinic/Johns Hopkins（2026-08）/Nationwide Children's发表looksmaxxing与焦虑/抑郁/身体变形障碍关联警告；学界批评集中于**种族偏见**（UMD研究）与未成年人隐私[Search]

### 5.2 web站的表述边界（从竞品实做反推）

| 做 | 不做 |
|---|---|
| "facial geometry / proportions / symmetry analysis"（thefacereport范式） | "rate how ugly you are"式羞辱表述（blackpill/brutal词仅限glossary解释性内容页） |
| 照片on-device本地处理、不落库、声明不用于AI训练 | 强制上传+服务器存储 |
| 分数配套改善建议（建设性框架） | 裸分数无上下文 |
| 13+/18+提示+心理免责声明 | 面向未成年人的营销话术 |

〔推断〕风险本质是**声誉/广告平台政策风险**（AdSense对body shaming类内容有政策红线，meme线和羞辱式文案会触发）而非法律风险；按上表执行则与在跑竞品同水位。广告变现前应先过一遍AdSense内容政策再上广告位。

---

## 六、判定输出

### 6.1 GO/砍

**GO**——进第二站候选池（与23号POD niche层同池，排序建议在niche设计定制层之后或并列：本站开发量更小/起量更快，POD层变现天花板更高）。原设想的**三层变现砍两层**：meme广告线、mewing affiliate线均判死；主变现=freemium报告+广告。

### 6.2 最小形态规格（1.5-2.5天开发）

**核心引擎（1天）**：MediaPipe Face Landmarker（478点）纯前端本地跑——一次检测派生全部指标：总分0-100、对称性%、黄金比例偏差、canthal tilt、三庭比例、FWHR、下颌角。无上传无账号（thefacereport已验证此交互是转化前置）。

**工具落地页×8-12**（每页=引擎+一个词族定向文案+CTA，1天）：attractiveness test（27.1K）/ face rating（9.9K）/ golden ratio face（8.1K）/ face symmetry test（5.4K）/ rate my face（4.4K）/ jawline rating（4.4K）/ psl scale test（1.9K+）/ face rating ai（2.4K）/ canthal tilt calculator（480）/ attractiveness calculator（1.3K）——**一引擎多壳**，每个壳页独立承接一个词族（五站"一页一族"占位模式）。

**内容页×15-20**（0.5天，AI批量）：looksmaxxing glossary线（hunter eyes 49.5K/midface ratio 1.9K/smv/canthal tilt解释文）+how to glow up线（8.1K+tips 4.4K+overnight/in a week）+竞品对比线（"Umax alternative"型，thefacereport已验证）+mewing教程线（before and after 4.4K/does mewing work 5.4K，背景数据）。注意：内容承接mewing教程流量但不挂gum affiliate（死路），改引流回工具。

**变现（0.5天）**：免费=浏览器内简化分数；付费=$14.99-17.49一次性完整报告（Stripe Checkout+PDF邮件，抄thefacereport定价带）；工具页/内容页AdSense（过政策审核后加，执行§5.2表述纪律）。

**红线**：§5.2表述边界全表执行；不做app（避开Apple审查+本方无app开发管线）；不做周订阅（客服/退款循环不配side experiment定位）；照片永不落库。

### 6.3 与摩斯样板的复用点与差异

| 维度 | 摩斯工具站 | 本站 | 复用度 |
|---|---|---|---|
| 架构 | 单页工具+pSEO矩阵+Woo挂件 | 单引擎+多工具壳页+glossary矩阵 | 高：页面骨架/批量内容管线/部署流程全复用 |
| 工具实现 | 纯前端JS | 纯前端MediaPipe JS | 高：同"无后端"模式，只多一个landmark库 |
| 挂件变现 | 首饰Woo（词→实物） | **不可用**（affiliate死路） | 零：本站变现改freemium报告+广告 |
| 词池 | A类34K/月 | 工具词池保守60-100K/月 | 本站更深 |
| SERP门槛 | 工具词SD低+新站可进 | DA3-4+10外链→23K/月实证 | 本站更开放（全库最低档） |
| 潮汐风险 | 常青（摩斯码不变） | 高（370K→20K前车之鉴） | 摩斯更稳；本站要求快速上线快速收割心态 |
| 新增开发 | — | Stripe+PDF报告层（+0.5天） | 净新增量 |

**对照23号的第二站候选池排序建议**：POD niche设计定制层（变现天花板高、开发重、竞争DA27级）vs 本站（天花板中、开发极轻、竞争DA3-15级）。若工具站线优先试水"最快验证→最快变现"路径，本站应排第一；若以单品毛利天花板为纲，POD层在前。〔推断，供主线程排期裁决〕

---

## 附：本轮数据花费与复验口径

- DataForSEO 9词×$0.002=$0.018（存档`C:/Users/Dylan/AppData/Local/Temp/lm_serp/*.json`，2026-09-07）
- Ubersuggest：5次domain_overview+2次match_keywords（150/天额度内）
- 复验口径：SERP构成=organic前9-10位人工四分法（独立工具站/app页/大平台/内容媒体）；流量=Ubs est. organic traffic（月度曲线取2026-08）；"DA3-4起量"=domainAuthority字段+backlinks字段
