# Etsy 全品类选品雷达与 C 端候选池

> 建库：2026-09-20 ｜ 三轮扫描：热榜轮（eRank 四国榜）→ 框架遍历轮（修饰词×18 类目）→ 语境维轮（recipient×occasion×style×情感，进行中）
> 定位：**一份文档=C 端选品的发现机制+历史档案+决策队列**（§1 机制 / §2 扫描档案 / §3 候选池=活文档）
> 额度口径（2026-09-20 用户确认）：Ubersuggest 每日刷新额度，返回体 limits 显示 200/200 只是计数器，不代表不可用

---

## §1 雷达机制

**数据源**：eRank 四国榜单+Amazon 交叉验证（`help.erank.com` WP REST API，零成本，已验证 post id：US=20551/UK=20107/CA=20108/AU=20109/Amazon=19118/HolidayHub=39833）；待接入：Etsy Open API v3（免费申请，`etsy.com/developers`——listing/favorites 一手数据做第三环交叉）

**三层漏斗**（铁律）：Etsy 层热度 → Google 层词池复核 → SERP 终裁。三次实证"站内热≠Google 有量"（night light/灯具/3D shade 层）；反向实证"主词 volume=0 ≠ 无需求"（儿童绘本 SERP 8 家垂直站活着）——**词量工具会漏整条赛道，SERP 终裁兜底**。

**正确框架（三轮演化）**：
```
① 品类维：Etsy 18 一级类目 × 子类
② 定制修饰维：personalized/custom/monogram/initial/name/photo（注：engraved/embroidered 搜索侧大面积死亡，需求一律由 personalized 承载——URL/TITLE 纪律）
③ 语境维：recipient（gifts for X）× occasion（里程碑/周年 by year）× style（farmhouse/boho...）× 情感（memorial/sympathy）
```
热榜驱动是搜索量头部切片（会漏赛道）；框架遍历+语境维才是全量。

**月度刷新 SOP**：每月 13 日后（各国报告 3-12 日发布）REST API 拉新 → diff 上月词表 → 新词聚类 → 仅全新簇做 ≤3 次 suggestions 抽验 → 更新 §3 候选池。每年 9 月拉 Q4 guide、次年 1 月拉年度 review。成本≈0（数据免费+Ubersuggest 每日额度+1-2 小时）。

**排雷方法论（累积 6 条）**：① 品牌词占比照妖镜（>50% 判死，如 wrapping paper 82% 是 staples）② 主词 0 量 SERP 终裁兜底 ③ 修饰词存亡表（见上）④ Bath 可做边界=纺织（非纺织全灭）⑤ 意图错配排雷（custom board game=B2B 制造意图）⑥ 宠物交叉是低 SD 富矿。

---

## §2 扫描档案（三轮历史记录）

### 热榜轮（8 簇深扫，2026-09-20）

28 簇聚类全景：GO 3（毛绒/Desk setup/簇绒地毯——词池抽验全过）/扩线 7/观察 8/B 端 1/已覆盖 2/排除 6。情报回流：靠垫站被 Amazon pillows CTR138% 印证；22 站白捡 TTRPG/皮革/杯壶/Q4 线；21 站获 pet plush 协同。

裁决摘要：婚礼=独立站 GO（DA7-15 在位、客单 $500-1,400/婚礼、域名 wedding 语义=排名因子）；杯壶=22 站扩线（laser engraved tumbler 2,900/SD14，SERP 赢家原型=跨材质雕刻站）；活体宠物=21 站扩线（bandana 节日×人生事件矩阵、Printify 零新增）；3D 灯=分歧（两 agent 相反，wavy lamp 词层 SERP 定案）。

### 框架遍历轮（5 agent × 14 类目，2026-09-20）

新独立 GO：绣花帽（74K 最大、DA13-18 霸前 11 巨头沉底）/儿童绘本（iseeme 模式+订阅制变体+宠物书第二品类）/star map（CPC$20.93、Etsy 零席位纯独立站、DA3 生成器工具页实证）。
新扩线：22 站+photo puzzle/洗漱包/wood 壳；摩斯站+initial 字母矩阵/文化名首饰；靠垫站+apron/名字毯/浴袍；犬种站+dog blanket/pet doormat；婚礼站+派对套件 1.1 万聚合。
候补：iPad case/family portrait/denim jacket/门垫 coir/婴儿毯 27,100/cross stitch/pinata/jersey 缝/季节 pajamas 缝。
否决：photo 壳/充电宝/AirTag/Vintage/肥皂/剃刀/宠物床/shoe charms/baby shoes/handbag/stickers/wrapping paper/invitations/board game/求婚道具等 20+。

### 语境维轮（4 agent，2026-09-20 完成）

**Recipient 维**：teachers 巨族（**25-30 万/月全场最大**，品类×9 科目×场景日历三维 pSEO，SERP DA18 可进）→22 站最强扩线；nurses 族 4.5-6 万（graduation/week/pinning/bulk 场景分层+badge reel）→新独立站候选；dog mom 3,600/**SD15 全表最低**→21 站；判死：coworker（SD54+低价带内卷）、plant lover/new homeowner/cat dad（长尾断崖）。

**Occasion 维**：**graduation lei 站=三轮全场最强新发现**（主词 40,500/SD24，SERP 实证 DA16 小站月 12,628 clicks；money lei 27K；**差异化=ribbon/candy/money lei 耐储可邮寄 vs 头部全是鲜花冷链**；缎带+糖果+折纸币 kit=中国供应链主场）；retirement×职业矩阵（27,100 主词，teacher 3,600/nurse/police/military 30+ 职业）→22 站扩线；milestone birthday 年份 pSEO 层（50th 簇 45,000+，森林站 11 年份结构同构复制品）；25th silver 14,800→摩斯站银婚簇优先；降级：milestone blanket/quinceanera（Etsy 内搜型）；内容型：bat mitzvah amount/first communion ideas（咨询词非商品词）。

**Style 维**：交易/浏览分界定律=**style+实物词=交易型、style+decor/ideas=浏览型、风格越小众 intent 越纯**。Top3：vintage mirror 词域（主词 9,900+长尾 3.5 万纯交易，SERP DA16 小站 #3 月 1,214 clicks、Amazon 被压 #4；木框镜 2,400 与 22 站木工产线协同；避开大件易碎切小镜/镜面砖/托盘）；wabi-sabi/japandi/cottagecore 东方极简实物簇（四词全交易型 SD12-28，长尾 0 量=**词域形成早期现在入=卡位**）；coastal wall decor（2,400/SD21=farmhouse 低竞争镜像，品牌挤占为零）。dark academia 证伪（≤30 信息型）。

**情感纪念维**：memorial wind chimes（6,600/SD21，SERP DA9 排 #2 月 2,489 clicks 亲验，纯购物 SERP 无 AI Overview）→22 站 memorial 最优扩容；**男士纪念=全场最大结构性缺口**（men's cremation jewelry 2,400/SD14+men's sympathy 1,300/SD20，三语境同时验证供给不足）；cremation jewelry 27,100 大盘（材质细分充分，需金属供应链+丧葬级调性）→独立站候选（laurelbox 模式二期）；memory quilt（逝者衣物改被 $250-600 服务客单）=独立服务形态不挂站；意象线（cardinal 1,600/SD17/rainbow bridge/声波木刻）22 站直接做；CoL 320=仪式语非搜索语。

**语境维轮新增独立站候选 3**：graduation lei（强）/ nurses / cremation jewelry（二期）。扩线增量：22 站（teachers 巨族+retirement 职业 30+ +memorial wind chimes 全线+木框镜+golf/fishermen 顺手线）、摩斯站（silver 婚簇）、21 站（dog mom/cat dad）、pSEO 层（born-in-year 年份×anniversary 材质年谱=跨站目录骨架）。

---

## §3 C 端候选池（活文档·决策队列）

### 独立站候选队（按启动优先级，三轮合并终版）

| # | 候选 | 词池量级 | 启动窗口 | 状态 |
|---|---|---|---|---|
| 1 | **仿真花全场景大站** → **已立项：C端/26-仿真花站/**（2026-09-20 由"门口装饰站"重构：五线架构=家居成品主轴+wreath 40 万流量底盘+婚礼+花材 DIY+户外待验，合并词池 15 万+；**flag 拆出回归独立候选**——柯桥供应链与义乌不同源；10 月 15 前上线死线不变） | 合并词池 15 万+/月；lingsmoment+darbycreek 双对标 | 🚀 已立项 |
| 1f | **custom flag 定制旗帜**（从门口装饰站拆出恢复独立） | 33K/SD27；anley 峰值 163K；柯桥毛利 80% | **10 月中前上线（Q4 双峰死线）** | 🟢 |
| 1b | **仿真花婚礼站**（独立） | 胸花 14,800/**KD10 词王**（低 DR 实证+套装词 AOV）+捧花 4,300+拱门 6,600/KD4+绿叶 garland 6,600/KD0 副轴；有效 3-5 万；差异化文案="zero preservation needed"；义乌双实证（lingsmoment/rinlongflower） | 随时 | 🟢 |
| 1c | **仿真花家居+花材站**（聚合形态待定：独立两站 vs lingsmoment 式一站） | 家居成品 35-40K（arrangements 三变体 15.2K+with/in vase 7.2K+**outdoor 18.1K 待验 SERP**+四轴 pSEO 活）+ 花材 DIY 3 万（bulk 7.9K+八花种矩阵 8.5K+wedding DIY 4.8K/CPC$2.34）+backdrop 8.8K；**craft flowers 12.1K=教程陷阱勿建页**；花种词 SERP 无平台垄断；批零兼营页吃 wholesale 6K | outdoor SERP 验证后定 | 🟢 |
| 2 | 定制绣花帽 | 74K（最大）；B2B logo 18K/CPC$5-6.5 | 随时 | 🟢 |
| 3 | 婚礼礼品站 | 18-25 万第一梯队；客单 $500-1,400/婚礼 | Q4-Q1 建站卡 2027 Q1-Q2 | 🟢 |
| ~~4~~ | ~~graduation lei 毕业花环~~ | ~~40,500/SD24~~ | **用户裁决移除（2026-09-20）：花卉品类认知远+季节单峰+鲜花玩家主场，耐储差异化不足以抵消能力圈错位** | ❌ |
| 5 | 儿童定制绘本 | SERP 实证 DA15-19 进前 10；客单 $30-60 | 随时 | 🟢 |
| 6 | 定制毛绒 | 22K；扬州 5 件起订；⚠️ 人工运营重 | 随时 | 🟢 |
| 7 | star map 星空图 | CPC$20.93 最高；生成器 tool-hybrid | 随时 | 🟢 |
| 8 | Desk setup 桌垫+键帽 | 6-8 万；POD 零库存最轻 | 随时 | 🟢 |
| 9 | ~~簇绒地毯~~ → **已立项：C端/22-地毯/**（用户 2026-09-20 建目录） | SD13 最松；毛利 70%+ | 🚀 已立项 |
| 10 | nurses 护士礼品站 | 4.5-6 万；场景分层+badge reel；唯一职业人群站 | 随时（可降级为 22 站子线） | 🟢 |
| ~~11~~ | ~~永生花礼盒垂直站~~ | ~~preserved roses 14,800~~ | **用户裁决移除（2026-09-20）：不必要，方向重心=仿真花 Artificial Flowers** | ❌ |
| 11 | cremation jewelry 骨灰首饰 | 27,100；材质细分充分 | 二期（需金属供应链+丧葬调性，laurelbox 模式） | 🟡 |
| ~~9~~ | ~~3D 韵律灯~~ | **❌ 独立站否决（2026-09-20 wavy lamp SERP 终裁）**：小站可进属实（DA1/DA3/DA8 产品页在排）但**全词月 clicks 仅 300-400 级**（wooj #1 才 236）——盘子撑不起品牌站投入（设计门槛+SKU 家族）；wooj 已进 Nordstrom/UO 渠道压缩独立空间；AI Overview 在位。降候补：若做 3D 打印走 Etsy 轻验证或他站品类线 | ❌ 已终裁 |

### 站外立项登记（非雷达产出，用户独立方向，2026-09-20 并池）

| 项目 | 状态 | 核心结论（详见各项目 01-候选决策文档.md） |
|---|---|---|
| **C端/23-低敏耳环** | 🟢 第二梯队（12 月复查 +163% 趋势后动工） | 材质痛点生意非定制生意；hypoallergenic 90.5K+flat back 49.5K（✅ 已验趋势稳定）+titanium 27.1K 双主轴；pSEO 矩阵 200-250 页可触达 30-40 万/月；竞对 tinilux 订阅盒/grayling 属性切片模式已解剖；禁区=儿童 screwback/huggie 正面/刻字；复用摩斯站工具引流打法 |
| **C端/24-图书印刷** | 🟡 条件 GO（**硬前置：供应链底价表落实**） | prosumer/B2C2B 混合；装订×品类结构词带 SD21-46；**童书/board book=五重利好最优品类（HTS 4903 免税 0 关税+精装 DDP 省 45-51%）**；甜点区 300-5,000 册；切入=三组平行页矩阵+DDP 即时计算器（超越 qin 的 EXW/假计算器）；中国玩家在装订/品类词族零渗透=词位空白 |

### 扩线登记（🔵 已并入现有站，三轮累积）

| 站 | 扩线 |
|---|---|
| **22 定制木礼站**（已成最大承接站） | 原始六类目 + photo puzzle、洗漱包、杯壶、TTRPG、皮革、wood 壳 + **teachers 巨族（25-30 万，hub×科目×场景三维）** + **retirement×职业 30+** + **memorial wind chimes/ornament/意象线/男士纪念专区** + 木框镜 + golf/fishermen 顺手线 + anniversary 年谱 pSEO 层 + 永生花 sympathy 组合 + **仿真花墓地族（25-30K/KD0-6/SERP 仅 199 条 EMD 霸榜/memorial CPC$2.96/年复购 2-4 次水滤网式逻辑——全场信号最佳扩容点；spike 花瓶/碑鞍/墓毯 8.1K 硬件抬客单；grave blanket 冬季峰拉趋势定日历；EMD 敏感先目录级 SEO 试）** |
| 摩斯首饰站 | initial 单字母矩阵、文化名首饰 + **25th silver 银婚簇（14,800）** + **"记忆载体首饰"三族（2026-09-20 DFS 补验：指纹族 fingerprint jewelry 4,400+necklace 3,600+thumbprint 3,600；照片族 photo necklace 4,400/$4.10+picture 2,900+custom 1,600；handwriting 480/coordinates 170/$6.24——合计约 2.1 万/月 CPC$2-6 HIGH，与摩斯码"隐藏信息×情感载体"完全同谱系）** |
| 靠垫站 | apron、名字毯、浴袍浴巾 |
| 21 犬种站 | bandana、dog blanket、pet doormat、tag、portrait + **dog mom（SD15）/cat dad** |
| 婚礼站（候选#3） | 派对套件 1.1 万 + hunters 伴郎页 + **silk 婚礼捧花**（silk wedding flowers 簇 3,600/bridal bouquet 2,400——只收随身礼品不收场地装饰；义乌供应链同源。⚠️ 词根纪律：用 silk 不用 artificial——artificial wedding bouquet 70/月死海） |
| pSEO 跨站骨架层 | born-in-{year}×{age}th（森林站 11 年份结构同构）+ anniversary 材质年谱（1st paper→50th gold） |

### 候补池（🟡 带触发器）

iPad case（2,400/SD21）/ family portrait（720/SD15）/ denim jacket（5K/SD13-21 服装归属待定）/ 门垫 doormat（3,500+ 归属待定）/ infant blanket（27,100/SD29 与名字毯合并评估）/ cross stitch kit / pinata / jersey 缝 / 季节 pajamas 缝。

### 已否决存档

见 §2 各轮记录（防重复扫描，20+ 项）。

---

## §4 对现有项目的情报回流

靠垫站方向被独立印证（Amazon pillows CTR138%）/ 22 站扩线 7 条 / 21 站扩线 5 条 / 摩斯站扩线 2 条——每轮扫描的免费增量，随轮次累积。

> **排期原则**：窗口硬约束优先（flag 死线→婚礼窗口），其余按产能分批；每启动一个新站更新 §3 状态；月度刷新 diff 新增候选进候补池。
