# POD整体口径修正分析（第二轮，修正22号窄口径）

> **性质**：2026-09-04选品收敛第二轮。**本文档修正22号文档的窄口径错误**：22号把"POD定制族"窄化成了"定制地图/星空图"一条线——但POD是**生产模式**不是品类，服装/马克杯/毛毯/帆布包/手机壳/贴纸/海报全部可POD。本文按正确口径（POD=按需印刷全品类）重析。
> **22号结论的效力**：其"地图/星空线=排队末位"判定**对该线仍然有效**（词池600-900+13家占位+无感知优势的三个依据均未被本轮推翻）；其POD供应商生态（Printify/Printful/Gelato订阅即得）与毛利60-70%数据**直接复用**。其"POD定制族整体=排队"的总判定被本轮**部分推翻**（见§五）。
> **数据源分级**：`[Ubs]`=Ubersuggest MCP（locId=2840，2026-09-04）｜`[DFS]`=DataForSEO SERP live advanced（10词，$0.02）｜`[Web]`=WebFetch实抓｜`〔推断〕`=基于证据的推论。
> **企业前提纳入**：本方关键优势=**AI生图管线成熟**（批量生图）——POD的"设计生产成本"对本方趋近于零。传统POD玩家要么人工设计（小站）、要么买设计库（inkpixi数百设计号），设计库存量本身是竞争变量——这是本轮评估必须纳入的结构性差异。

---

## 一、结论先行（判定总表）

| 层 | 代表词 | 判定 | 一句话裁决依据 |
|---|---|---|---|
| **通用词层** | custom t-shirt / custom blanket / custom stickers | ⛔ 砍 | SERP被Vistaprint/Custom Ink/Walmart/Amazon/RushOrderTees锁死〔DFS〕；主词SD 65-86；大量平台导航词污染词池〔Ubs〕——22号预期本轮数据验证成立 |
| **photo打印类** | photo blanket / photo mug / personalized photo blanket | ⛔ 砍 | SERP 10/10全是photo平台（Shutterfly/Snapfish/Mpix/Walgreens/ CVS/Walmart Photo/Michaels）〔DFS〕；需用户传图+预览交互的重前端开发——与AI生图管线优势错配 |
| **B2B promotional类** | custom tote bag / custom stickers（logo意图） | ⛔ 砍 | SERP是llbeanbusiness/landsend business/staplespromo/cottoncreations领地〔DFS〕；CPC $8-10证明是B2B印刷服务生意，非C端POD |
| **niche设计定制层**（人群×品类组合词） | grandma shirt / nurse shirt / family reunion shirts / dog mom shirt | ✅ **有条件进入（第二站候选池，列于11-综合配件站之后）** | 词池SD 12-31全场最绿〔Ubs〕+SERP独立小站占位实锤（DA27的littlemamashirtshop在12.1K量词排#3〔Ubs〕）+AI生图=设计库存量结构优势——三层证据齐 |
| **pet face/pet portrait线** | custom pet portrait / pet face全品类 | 🟡 单列观察（niche层内竞争最强子线） | 独立站生态开放（crownandpaw月搜索流量68K-273K〔Ubs〕）且AI生图直接对口，但头部已成型（crownandpaw DA46+58K评价）——可做但非最优入口 |
| 地图/星空线 | custom star map | 🕐 排队末位（22号判定维持） | 22号三依据未被推翻 |

**总判定：POD生产模式下，niche设计定制层=有条件GO（进第二站候选池第二位）；通用层/photo类/B2B类=砍；22号地图线维持排队末位。**

---

## 二、三维矩阵词族扫描〔Ubs，2026-09-04〕

### 2.1 第一维：品类×定制意图（通用层）——池深/主词/可进性

| 种子组 | 合并池深 | 主词量/SD | 词池污染诊断 | 判定 |
|---|---|---|---|---|
| custom t-shirt + personalized mug | 3,601 | custom t-shirt 135K (SD78)；personalized mug仅2.9K (SD52) | 🔴 平台/品牌导航词密集（amazon/etsy/canva/walmart/big frog/sticker mule）；nearby/store类本地词多；中高量词SD普遍38-86 | 砍：主词及大词被巨头锁，词池名义深但可用性低 |
| custom blanket + custom tote bag | 996 | custom blanket 33.1K (SD37)；custom tote bag 18.1K (SD29) | blanket词池被shutterfly/walmart/walgreens/cvs/zazzle/snapfish品牌词污染；tote的top词是llbean/bulk/logo/wholesale（B2B） | 砍：photo blanket属photo平台领地；tote是B2B promo生意 |
| personalized phone case + custom stickers | 4,186 | custom stickers 110K (SD65)；personalized phone case 6.6K (SD38) | stickers词池实为"标签/车贴/贴标印刷"（by the roll/labels/vinyl/waterproof/for business），CPC $8证明B2B性质 | 砍：贴纸是印刷服务生意非C端POD礼品 |

**通用层结构性发现**：SD低假象陷阱——custom tote bag SD29看着绿，但SERP构成是B2B promotional（§三实判）；custom blanket SD37，SERP是photo平台。**通用层不能只看SD，SERP四分法直接判死。**

### 2.2 第二维：niche层（POD真实主战场）——逐组池深与绿格

| niche组 | 合并池深 | 主词量/SD | 词族结构 | 绿格抽样（SD≤40） |
|---|---|---|---|---|
| **grandma shirt + family reunion shirts** | 666 | family reunion shirts 5.4K (SD21)；grandma shirt 2.9K (SD24) | **人群×兴趣×辈分矩阵**：grandma×sport（baseball 390/football 170/softball 140/soccer 140/cheer 140）×college（oklahoma state 110/uconn 50）×breed（dog grandma 90/cat grandma 70）；family reunion×族裔（black 590）×年份 | ideas for family reunion shirts 4.4K (SD31)/custom grandma shirt 1.3K (SD26)/grandma funny 880 (SD30)/grandkids names 390 (SD27)/custom family reunion shirts 880 (SD23)——SD 12-36全绿 |
| **nurse shirt + crochet tote bag** | 1,510 | nurse shirt 8.1K (SD39)；custom nurse shirt仅50 (SD24) | **专科×节日双维矩阵**：专科16个（emergency 590/registered 590/pediatric 480/nicu 390/icu 320/L&D 210/oncology 170/cardiac 140/dialysis 90/med surg 90/psych 70/picu 70/cvicu 50/wound care 50）×节日7个（christmas 720/halloween 390/thanksgiving 170/valentine 110/fall 110/st patrick 70/4th july 70） | funny nurse shirt 1.3K (SD37)/emergency 590 (SD15)/registered 590 (SD23)/nicu 390 (SD23)/icu 320 (SD27)——SD 15-39绿 |
| **dog mom shirt + dog mom gifts** | 388 | dog mom gifts 3.6K (SD15)；dog mom shirt 1.3K (SD16) | 人群×犬种×节日：german shepherd/shepherd/dachshund×mother's day/christmas | mother's day dog mom gifts 720 (SD17)/personalized dog mom gifts 320 (SD33)/best dog mom gifts 320 (SD14)——SD 14-36绿但单词量小 |
| custom pet portrait + golden retriever gift | 504 | custom pet portrait 6.6K (SD27) | 形态词全小量（canvas 50/jewelry 70/sweatshirt 40/pillow 20/blanket 20）——**主词强、形态词池浅** | etsy custom pet portrait 590 (SD39)/artist 170 (SD34)/necklace 40 (SD17) |
| firefighter shirt + fishing shirt for men | 162 | firefighter shirt 1K (SD24)；fishing shirt for men 9.9K (SD40) | fishing shirt是UPF功能服装（非POD），词池被firefighter占满；firefighter单niche池太浅 | custom firefighter shirt 260 (SD14)/wildland 590 (SD24) |
| teacher tote bag + custom nurse shirt | 202 | teacher tote bag 6.6K (SD22) | top词是Amazon功能包品牌（fasrom/lovevook/curmio）——**买现成功能包意图，非POD定制意图** | personalized teacher tote bag 590 (SD16)/best 880 (SD27) |
| new dad gift + gamer mug | 63 | new dad gift 590 (SD29)；gamer mug仅90 (SD29) | 池极浅 | 死海 |

**竞品词谱反推的隐藏池深**〔Ubs domain关键词〕：littlemamashirtshop（DA27小站）的排名词谱揭示家庭关系线真实池深远超666——biggest sister shirts 12.1K (SD24)/mommy shirts 5.4K (SD17)/cousin crew shirts 3.6K (SD23)/auntie shirts 2.4K (SD27)/mama sweatshirt 5.4K (SD25)/matching mom and son 6.6K (SD24)/mama hats 1.6K (SD12)——**家庭关系×服装合并池估1,500-2,500**〔推断，基于littlemama词谱+grandma/family reunion实扫〕。

### 2.3 第三维：意图结构判别——photo定制 vs 设计定制

| 类型 | 词特征 | 生产要求 | SERP归属 | 判定 |
|---|---|---|---|---|
| **photo定制**（用户传图） | photo blanket 18.1K/personalized mug with picture 9.9K/custom blanket photo 27.1K | 重交互：上传组件+预览编辑器+拼图模板 | photo平台（Shutterfly/Snapfish/Walgreens/CVS/Walmart/Mpix）〔DFS〕 | ❌ 与本方AI生图优势错配，交互开发重 |
| **设计定制**（站方设计库+用户选款） | grandma shirt/nurse shirt/family reunion shirts/dog mom shirt | 标准电商流程：collection页+产品页选尺码颜色；设计由**站方批量生产** | 独立niche站+etsy/amazon混合（§三） | ✅ **AI生图管线直接产出的正是这个层的设计资产** |
| **photo定制例外：pet portrait** | custom pet portrait 6.6K (SD27) | 用户传宠物照→风格化生成→印刷（宣称手绘，实为数字处理）〔Web实抓crownandpaw〕 | 独立DTC站（crownandpaw/westandwillow/purrandmutt）+手工艺术家+etsy〔DFS〕 | 🟡 AI生图可对口（宠物照风格化），但需上传+审稿流程开发 |

**交易意图占比**：niche层词的search_intent标注几乎全为Transactional/Commercial〔Ubs，grandma/nurse/dog mom族抽样≥80%〕，与通用层混合意图不同——礼品人群词是"搜了就买"词。

---

## 三、SERP四分法实判〔DFS，10词，2026-09-04〕

| 词 | top10构成 | 独立站位数 | 判定 |
|---|---|---|---|
| **custom t-shirt** | Vistaprint①/Uberprints②/yesweprint③/Custom Ink④/RushOrderTees⑤/Underground⑦/Bluecotton⑧/Amazon⑨/Walmart⑩+local_pack×2 | 印刷服务商6+平台2 | 🔴 平台巨头+印刷服务商锁死，通用层死刑实证 |
| **custom blanket** | walmart①/printerpix②/michaels③/Amazon④/baublebar⑤/softminky⑥/contrado⑦/in2green⑧+ai_overview+knowledge_graph | photo平台5+独立3 | 🔴 photo平台主导 |
| **custom tote bag** | llbeanbusiness①/merchery②/landsend business③/cottoncreations④/staplespromo⑥/Custom Ink⑦/threadart⑧/baublebar⑤ | B2B promo 6 | 🔴 B2B promotional领地实锤 |
| **personalized photo blanket** | michaels①/printerpix②/snapfish③/photoaffections④/walmart⑤/mpix⑥/walgreens⑦/Amazon⑧/canvasdiscount⑨/shutterfly⑩ | photo平台9/10 | 🔴 photo类=photo平台领地，独立站仅canvasdiscount |
| **family reunion shirts** | boltprinting①/rushordertees②/Amazon③/**inkpixi④**/classb⑤/pinterest⑥/powell-shirts⑦ | 独立niche站3（inkpixi/classb/powell）+团购印刷商2 | ✅ 独立站有位（头部被团购印刷商占，但inkpixi以设计库模式稳居④） |
| **grandma shirt** | target①/giftsforyounow②/Amazon③/pinterest④/**littlemamashirtshop⑤**/etsy⑥/**simplycutetees⑦**/Custom Ink⑧/walmart⑨ | **独立niche站3**（littlemama/simplycutetees/giftsforyounow）+etsy 1位非统治 | ✅ **独立小站生存空间最直接的实证**——littlemama（DA27）⑤、simplycutetees⑦ |
| **nurse shirt** | **arteryink①**/lifeisgood②/**simplycutetees③**/**shiftdrip④**/pinterest⑤/Amazon⑥/nursemates⑦/allheart⑧/**tees2urdoor⑨** | **独立niche站4/9占位（①③④⑨）** | ✅ 人群niche层独立站最强词——Milwaukee艺术家站排① |
| **teacher tote bag** | theteachertote①③（双位）/verabradley②/reddit④/instagram⑤/Amazon⑥/博客⑦/boggbag⑧/scoutbags⑨ | niche功能包品牌站1（占双位） | 🟡 有niche站但意图是功能包非POD定制 |
| **dog mom gifts** | luccathenapadog①（手工礼篮）/naturvet②（测评）/reddit③/Amazon④/sunbean⑤（博客）/jennaregan⑥/altardstate⑦/wearwagrepeat⑧（博客） | 商业位弱：测评博客4+零售2 | 🟡 gifts词=listicle意图（找灵感），POD产品页难进；应打dog mom shirt类产品词 |
| **custom pet portrait** | easycanvasprints①/**westandwillow②**/**crownandpaw③**/lacstudio④（艺术家）/purrandmutt⑤/byannieb⑥/pawsbyzann⑦（艺术家）/youtube⑧/etsy⑨ | **独立DTC站5+艺术家3+etsy 1位** | ✅ 独立站生态开放——photo类的唯一例外（输出是"艺术肖像"非"照片打印"） |

**核心问题的回答**：
1. **哪个层的SERP有独立POD站生存空间？**——人群niche×品类的产品词层（grandma shirt/nurse shirt独立站4-5个位子；family reunion有inkpixi/classb/powell）；通用词层和photo打印层零空间。
2. **Etsy listing占位能否被独立站抢？**——能，且正在发生：etsy在niche词只占0-1位（grandma shirt⑥/pet portrait⑨），且littlemama/arteryink/shiftdrip等独立站排在etsy前面——niche人群词的信任判定标准是"设计对不对味"而非平台背书〔推断〕，独立站反而能用更准的人群定位胜过etsy大杂烩。

---

## 四、竞品模式验证〔Web实抓+Ubs流量〕

### 4.1 三种存活模式

**模式A：设计库×载体矩阵（inkpixi.com，family reunion④）**
- 2003年老牌，宾州自有工厂（非dropship），"设计号为轴"——数百固定设计×~15载体（T恤/帽/啤杯/醒酒器/围裙/车牌/蜡烛）只改个性化文字
- 流量：月搜索8K-38K，DA35，23K反链〔Ubs〕；流量构成=品牌词+family reunion 5.4K词#6-8+**大量50-70量微niche词**（deer camp shirts/family farm shirt/irish pub mug/italian flag apron/woodworking hats 1K#18）——长尾微词×数千设计库加总模式
- 引擎：直邮目录（"Got a Postcard?"输设计号）+邮件+16K评价页SEO+Pinterest
- 趋势：2024年17-22K→2026年4-15K，**下滑中**〔Ubs domainTraffic〕
- **与本方适配度：★★★★★**——"设计号×载体"结构=AI生图管线可日产数百设计，本方缺的只是它的22年域名信任

**模式B：家庭关系人群niche站（littlemamashirtshop.com，grandma shirt⑤）**
- Shopify小站，DA仅27，1,580词，月搜索流量峰值128K（2024-09）、现11.5K〔Ubs〕
- 词谱=纯家庭关系矩阵：sibling（biggest sister shirts 12.1K#3）/mom（mommy shirts 5.4K）/cousin（3.6K）/auntie（2.4K）/grandma（2.9K#14）/mom-and-me matching（6.6K）
- **多人群共享一站**（妈妈/奶奶/阿姨/姐妹/表亲全包），非单一niche独立站——单一niche词池（162-666）撑不起独立站，人群簇共享站才成立
- **与本方适配度：★★★★★**——DA27即可在SD 12-28词上排#1-5，证明该层竞争烈度低；设计更新靠人工的小站正是AI生图管线的可替代对象

**模式C：pet face入口→全品类DTC（crownandpaw.com，custom pet portrait③）**
- 宣称"hand-illustrated by real artists"实为数字处理+先审稿后印刷（free proofs，1-2天出稿）〔Web〕；$19.95-79.95；产品线=画→服装→袜子→毛毯→抱枕→睡裤→内裤
- 流量：月搜索68K-273K（2024-09至2026-08区间），DA46，5,604词〔Ubs〕；主词custom pet portraits/portrait双#1（6.6K）；词谱揭示pet face结构：christmas sweatshirt for dogs 9.9K#3/personalized dog shirts 5.4K#2/christmas dog socks 4.4K#4/dog pillow 8.1K#6
- 壁垒：58K评价+850K作品+$250K公益叙事+ShareASale联盟
- **与本方适配度：★★★☆☆**——宠物照风格化与AI生图对口且天花板最高（273K/月），但头部已成（DA46+58K评价），且需上传+审稿交互开发；新站冷启动撞信任门槛（与22号pet memorial线同构问题）

### 4.2 反面样本（避坑）

- **simplycutetees.com**（grandma⑦+nurse③双词占位）：实为**囤货批发零售商**（约20个批发品牌，非POD，无设计工具）〔Web〕——提醒：SERP里的"独立站"不全是POD模式，囤货零售也能占位，但这恰说明该层进入者形态多元、无垄断者。
- **dog mom gifts词的listicle陷阱**：头部是测评博客+Amazon〔DFS〕——gift guide类词要靠内容页承接，产品collection页打不进，页面结构须分层。

---

## 五、判定（对照四象限纪律）

### 5.1 市场六问（niche设计定制层）

| # | 问题 | 判定 | 依据 |
|---|---|---|---|
| 1 | 真实需求？ | ✅ | 家庭关系线合并池1,500-2,500+主词全绿（family reunion 5.4K SD21/biggest sister 12.1K SD24/nurse 8.1K SD39）；交易意图≥80% |
| 2 | 问题重要？ | 🟡 | 礼品场景情感溢价高非刚需；季节性Q4+母亲节双峰（与地图线同） |
| 3 | 有效竞争？ | ✅ | **无平台垄断**：etsy占0-1位、Amazon占1位；独立站4-5位且形态分散（艺术家/小站/老牌/囤货商），DA27即可排#1-5 |
| 4 | 线上成交？ | ✅ | Shopify标准DTC选款下单，无编辑器/无审稿交互（与地图线最大差异） |
| 5 | 生意账？ | ✅ | 服装零售$22-45（littlemama/inkpixi定价带〔Web〕）；POD毛利60-70%（22号§4.1复用） |
| 6 | 获客入口？ | ✅ | 词池深度=niche层全场最深（1,500-2,500）；圈内博客弱（inkpixi目录电商遗产、littlemama无博客〔Web〕）——内容是可追赶项 |

### 5.2 企业六问

| # | 问题 | 判定 | 依据 |
|---|---|---|---|
| 1 | 供应链能做？ | ✅ | Printify/Printful/Gelato API订阅即得（22号§4.1复用）；DTG印花+刺绣是POD标准工艺 |
| 2 | 可感知优势？ | ✅ **本轮核心修正** | AI生图管线=设计库存量结构优势：inkpixi数百设计号维持22年、littlemama靠人工设计更新——本方日产百级设计的能力对该层是降维打击。22号地图线"无感知优势"判定不适用于此层（星空图设计空间窄、比拼信任；niche设计层比拼设计库存量与更新速度） |
| 3 | 内容素材持续？ | ✅ | 产品渲染图=设计本身，AI直接产；gift guide内容线（dog mom gifts类listicle词）可做承接层 |
| 4 | 渠道能力？ | ✅ | 轻资产SEO既定；Pinterest是圈内已验证引擎（inkpixi/littlemama均布局）〔Web〕 |
| 5 | 承担服务？ | 🟡 | 服装退换/尺码客诉高于海报；无编辑器工程（优于地图线）——运营负重中等 |
| 6 | 投入意愿？ | →用户决断（本报告不越权） |

### 5.3 象限落位与排位

**niche设计定制层=「市场有证据×企业接得住」可进象限**——但进入时机受执行资源约束：

| 候选 | 结构匹配 | 排位 |
|---|---|---|
| 11-综合配件站（既定） | 替换件复购+能力圈同构 | **第二站首位（不变）** |
| **POD niche设计定制线（本轮新增）** | 一次性购买无复购，但词池绿格密度+AI生图优势加成 | **第二站候选池第二位** |
| POD地图/星空线（22号） | 词池600-900+无感知优势 | 池末（维持；若niche线GO则地图线可并入同站作collection而非独立站〔推断〕） |
| pet memorial线（22号） | 成交方式错配 | 池外观察（维持） |

### 5.4 若GO：启动方案

**前3个niche×品类组合候选**（数据支撑排序）：

1. **家庭关系×服装/帽**（grandma/mama/auntie/big sister/cousin crew/family reunion/mom-and-me）——词池1,500-2,500（实扫666+littlemama词谱反推）、SD 12-31全绿、littlemama（DA27）活标本证明可复制；人群簇共享一站，collection按"关系词"建（每词一collection，SD 12-28可排#1-5）
2. **护士/医疗职业×服装**——nurse shirt 8.1K主词+16专科×7节日矩阵结构清晰、独立站占位4/9（arteryink①/shiftdrip④）；专科collection+专科×节日设计页
3. **宠物×设计款服装**（dog mom shirt 1.3K SD16/pet breed shirt，**非pet face照片线**）——SD全场最低（14-36），与AI生图犬种设计直接对口，避开photo上传交互

**站形态**：**独立多人群niche站**（littlemama模式），不并入既有站（rosetoys情趣站语义不匹配、ClearFit滤芯心智伤害定位——22号§5.4判定沿用）。WordPress+WooCommerce（C端统一栈既定）+Printify/Gelato API。

**AI生图设计矩阵启动**：
- 设计资产结构=inkpixi"设计号×载体"复用模式：1个设计母版→T恤/卫衣/帽/马克杯/帆布袋5载体，设计边际成本趋零
- 首批目标：3人群簇（家庭关系/护士/犬种）×各100设计=300设计×5载体=1,500 SKU；collection页60-100个（按词建）
- 内容层：gift guide listicle（承接dog mom gifts类测评意图词）+Pinterest分发（圈内已验证引擎）
- 时序锚点：Q4圣诞季（家庭关系+节日矩阵词Q4双峰，启动须赶在9-10月设计定稿）——若赶不上Q4则母亲节（次年3月内容启动）

**风险与前置排雷**：
1. **IP侵权排雷前置**：grandma/nurse词谱中大量迪士尼/MLB/大学品牌词（disney grandma shirt/minnie mouse/oklahoma state/uconn/buffalo bills nurse shirt）——这些词流量必须放弃，设计库全原创，AI生图prompt须排除品牌IP元素
2. Comfort Colors等空白品牌版权：POD供应商提供正版空白衫，无风险；但"comfort colors"作为搜索词的品牌属性注意页面用"garment-dyed"类通用词承接〔推断〕
3. 新域名冷启动DA0→27需6-12个月+外链投入——这是排第二位而非首位的主要原因（配件站有ClearFit能力圈复用，冷启动更快）

### 5.5 若排队：触发条件（备选路径）

- **资源触发**：ClearFit跑通+配件站立站后，第三站窗口重评（与22号地图线触发条件对齐，两线合并复查）
- **生态触发**：半年复查grandma shirt/nurse shirt的SERP——若littlemama/arteryink/shiftdrip等小站仍在top5=生态持续开放；若被etsy/Amazon挤出=关闭
- **Q4观察窗**：2026-Q4家庭关系词搜索峰是天然的SERP动态观察期，可零成本验证该层季节弹性

---

## 六、方法论增量（供沉淀）

1. **"POD=生产模式≠品类"的口径教训**：22号把POD窄化成地图线得出"整体排队"，本轮按全品类口径重扫得出分层判定（通用/photo/B2B砍，niche设计定制层可进）——**生产模式类选品必须先分层再判定，任何单线结论不可上推到模式整体**。
2. **SD绿格假象的SERP校验纪律**：custom tote bag SD29/custom blanket SD37均绿，但SERP是B2B promo/photo平台——**SD只反映链接权重不反映"谁占位"，通用词层必须SERP四分法先行**。
3. **词谱反推池深法**：niche词池合并扫描（match_keywords）会低估人群簇的真实规模——用竞品domain的organic关键词谱（littlemama 1,580词）反推同簇隐藏词（biggest sister 12.1K/mommy 5.4K未在grandma种子扫描中出现）。**扫描池≠簇全池，竞品词谱是池深的第二信源**。
4. **gifts词与shirt词的意图分层**：dog mom gifts（3.6K）是listicle意图（测评博客+Amazon占位），dog mom shirt（1.3K）是产品意图（独立站可进）——**人群礼品线须把"gifts后缀词"与"品类词"分成两类页面策略**，前者内容页承接后者产品页承接。
5. **AI生图优势的适用边界**：22号地图线判"无感知优势"正确（该层比拼信任与专利），niche设计层判"有优势"亦正确（该层比拼设计库存量与更新速度）——**企业优势不是全域常量，须按层的竞争变量逐层匹配**。

---

## 数据成本与复现

- Ubersuggest MCP：10次调用（match_keywords×9+domain_overview×3）
- DataForSEO：10词SERP live advanced（$0.02），JSON存 `C:/Users/Dylan/AppData/Local/Temp/pod_serp2/*.json`
- WebFetch：3站（simplycutetees/inkpixi/crownandpaw）

---

**报告日期**：2026-09-04
**判定**：niche设计定制层=有条件GO（第二站候选池第二位，前3组合=家庭关系×服装/护士职业×服装/宠物设计款×服装）；通用层/photo类/B2B promo类=砍；22号地图线维持排队末位（若niche线GO可并入作collection）
**下次复评**：配件站立项后第三站窗口期，或2026-Q4家庭关系词SERP动态观察
