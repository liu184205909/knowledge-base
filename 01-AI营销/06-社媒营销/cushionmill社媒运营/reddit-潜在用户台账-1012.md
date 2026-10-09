# Reddit 潜在用户台账（测试版 v0.1）

> **功能定位**：「谁在需求」的**情报层**——记录不触达。触达仍走《Reddit每日获客工作流》的回帖线（24h 红线/混合推荐/顾客口吻纪律全照旧），本台账回答"除了今天的帖，还有哪些已识别的需求者值得长期观察"。
> **测试轮**：2026-10-07（5+3 词扫描 t=month + 11 帖深读 + 13 用户 profile 快扫，CDP localhost:3456 全程）
> **合规边界（本轮实测结论）**：全程零 DM（Reddit 未请求的 DM=spam 画像，一票否决）；触达判定只有三值——回帖（帖龄 ≤24h 且无解）/ 观察等其新帖 / 不动（已解决或老帖）。profile 高质量发帖吸引是被动层，不对具体用户做定向动作。

## 1. 台账主表（16 人）

> 字段：username ｜ 来源帖 ｜ 信号类型 ｜ 画像（karma=粗判依据）｜ 建议触达 ｜ 状态
> 信号类型四值：求购（正在找渠道）/ 抱怨现有垫（替换窗口）/ 问渠道（评论追问）/ 问测量（尺寸工艺求助）

| # | username | 来源帖 | 信号类型 | 画像 | 建议触达 | 状态 |
|---|----------|--------|----------|------|----------|------|
| 1 | **westindian92** | r/interiordecorating 1wz5y0k（2026-10-06） | 求购：定制皮沙发罩+垫罩（10 年 Room & Board sectional，"Reupholstery is $$$"） | C 端业主，karma 123 | 已触达（10-07 spaceplaza 回帖：两条路干货+三渠道混合推荐，Cushion Mill 顾客口吻顺带提及=本周首次品牌提及）——10-08 核：楼主未追问（评论仅我方 1 条）；10-09 核（第 3 天，old.reddit 通道+datetime 核对 10-06T17:14Z）：楼主仍未回应，跟进窗口未开，继续观察 | 🟡 已回帖观察 |
| 2 | hardyz | r/Lovesac 1wst2h8（09-28） | 抱怨现有垫：Sactional 十年垫塌，找 latex/品牌替代 | C 端真实老户（12 年，7,320 karma，1,699 帖） | 已触达（spaceplaza 已回密度干货）——观察其追问 | 🟡 已回帖观察 |
| 3 | Disastrous_Soup5314 | 同上评论区 | 抱怨现有垫：Sactional 3 年+两男孩使用，同需求者（评论区暴露的第二需求人） | C 端，533 karma | 观察其独立发帖 | 🟢 台账观察 |
| 4 | Lower-Attention-3205 | r/upholstery 1wsgaot（09-28） | 问测量+求购：摇椅坐高降 2"，"no idea what type of foam to order" | C 端新号（20 karma，为求助注册） | 已触达（spaceplaza 已回）——倾向换底座方案，不强推 | 🟡 已回帖观察 |
| 5 | Key_Pressure_3308 | r/DesignMyRoom 1wte59f（09-29） | 求购进行时：bay window 窗座垫定制中，正选色（ivory/cream） | C 端新号（18 karma，全屋装修语境） | 已触达（spaceplaza 已回 2 条配色干货）——垫未定，跟进追问 | 🟡 已回帖观察 |
| 6 | Negative-Owl4154 | r/upholstery 1whdxe2（09-15） | 求购·批量：NJ 10+ 住宅项目找 upholsterer，"more than willing to pay"，曾做沙发重包/系带垫罩/户外垫 | **B 端/批量客户**（室内设计或房产改造，1,882 karma） | 不动该帖（已获 Jammal 推荐）；**画像标记=其新帖优先响应** | 🟢 高价值画像 |
| 7 | muddycrocs | r/westernmass 1w6n3kl（09-03） | 求购：梯形飘窗垫，"feel free to PM me" | C 端真实老户（8,979 karma） | 老帖不动（34 天+已有本地推荐）；观察其后续发帖 | 🟢 台账观察 |
| 8 | bakedbeans-gas | r/longisland 1wqxp0q（09-26） | 求购：Nassau 飘窗异形长凳垫 | C 端业主（264 karma） | 不动（评论已获 4 个本地渠道并致谢——已解决，挖坟=负面） | ⚪ 已解决归档 |
| 9 | jdvfx | r/culvercity 1worgaq（09-24） | 求购：狗咬坏沙发垫，换芯+拉链 | C 端重度用户（58,144 karma） | 老帖不回（13 天>24h）；其渠道 Foam Mart 已搬迁=需求未完全闭环，观察新帖 | 🟢 台账观察 |
| 10 | Own-Neck-2089 | r/Charlottesville 1vwkdle（08-23） | 求购：女儿房窗座垫罩，自备面料，价格敏感（"didn't cost a fortune"） | C 端（746 karma） | 老帖不动（45 天）；**A7 replacement covers 精确画像** | 🟢 台账观察 |
| 11 | Dry-Address6017 | r/interiordecorating 1wvg11x 评论区（10-02） | 抱怨现有垫："I have that west elm couch and it is not very comfy" | C 端老户（6,719 karma） | 无帖可回（评论暴露）；观察其是否发求助帖 | 🟢 台账观察 |
| 12 | islandtheory | r/culvercity 1worgaq 评论区 | 问渠道·已消费：曾买高价定制户外垫+户外面料（"went with more expensive cushions/outdoor fabric"） | C 端老户（11,779 karma） | 付费意愿已验证的画像样本，不主动触达 | 🟢 画像样本 |
| 13 | aclassybetch | r/SofaSnobs 1wtthrr 评论区 | B 端信号："Used it in a **client's** movie theater"（为客户选家具） | **B 端室内设计师**（13,277 karma） | 不主动触达；价值=定制垫 B 端需求存在证据+潜在内容合作对象 | 🟢 B 端画像 |
| 14 | bird_of_prey8 | r/SofaSnobs 1wtthrr 评论区 | 问渠道：正订 What A Room 全定制沙发（"fully customizable"） | C 端（karma 未扫） | 品类错配（沙发级非垫级），弱观察 | ⚪ 弱信号 |
| 15 | Realistic-Garage6267 | r/Latex_Discussions 1wu26wu（09-30） | 求购：UK latex 定制椅垫罩 | C 端但**地域+材质双错配**（UK/latex） | 不入运营范围，仅作"特殊材质需求存在"样本 | ⚪ 范围外 |
| 16 | ShinyFlesh | 同上评论区 | B 端信号：想自制 latex 垫罩并"for my brand"售卖 | B 端小品牌主 | 观察其品牌是否成型（潜在同业/供应链需求） | ⚪ 边缘 |
| 17 | Guitar-Such | r/Mid_Century 1wojhug 评论区（09-23） | 求购：Adrian Pearsall 2196-TR 弧形咖啡桌配套垫（"Perfect!! Now to find a cushion"） | C 端中古家具玩家（karma 2,081，显示名 SA TACOS） | 老帖评论区不回（14 天）；观察其独立发帖 | 🟢 台账观察 |
| 18 | NeverSky454 | r/AskIreland 1v8qvzv（07-28） | 求购：沙发整体换芯（"after 5 years everything is feeling a bit squashed and flat"，0 人类回答） | C 端（爱尔兰） | 不动（71 天超龄+地域范围外——美站 50 states 配送不覆盖） | ⚪ 范围外 |
| 19 | Guygirl00 | r/nova 1v2utvx（07-21） | 求购：皮革坐垫换芯 "foam replaced in leather seat cushions"（0 回答） | C 端（弗吉尼亚） | 不动（77 天超龄+本地意图） | ⚪ 范围外 |
| 20 | PvtCW | r/Lovesac 1x0up6p 评论区（10-08） | 抱怨现有·退货中：$5k Sactional 整组退货（"experience has been so bad... white glove pickup"），对比 Room & Board 价差 | C 端高客单（$5k 档） | 不动该帖（价格讨论语境）；**画像标记=退货完成后的替代方案帖优先响应** | 🟢 高价值画像 |
| 21 | squeeps_21 | r/Lovesac 1x0uf61 评论区（10-08） | 抱怨现有：深座+斜背要塞枕头才舒服 "one would have to put extra pillows behind the couch cushions for the couch to be comfortable chaps my ass so much" | C 端 Sactional 新用户 | 不动（评论暴露）；**腰靠/lumbar 需求画像**，观察其独立发帖 | 🟢 台账观察 |
| 22 | thewolfwalker | r/Lovesac 1x0x7wm 评论区（10-08） | 求购·进行时：计划 Loved 买二手内芯+"order new covers"（原厂罩语境） | C 端（Sactional 散件自组） | 不动（原厂罩语境，第三方定制错位）；A7 replacement covers 弱画像 | ⚪ 弱信号 |

**My 账号已出现标记**：spaceplaza 在 1wst2h8 / 1wsgaot / 1wte59f 三帖已有回帖——台账 #2/#4/#5 与日更轮天然重叠。

## 2. 本轮扫描覆盖与噪音账本（词召回率实测）

| 词 | 召回 | 有效 | 噪音构成 |
|----|------|------|----------|
| `"custom cushions"` (m) | 7 | 2 | 宝石垫形切割×2、壁炉、办公椅、法式装修（弱） |
| `"bench cushion"` (m) | 7 | 1 | Camry 汽车座垫×3、中古桌、超深沙发（弱） |
| `"replacement cushions" patio` (m) | 6 | 1 | affiliate 垃圾帖×2（r/HomeXpert 营销体）、黄蜂×2、园艺店（弱） |
| `"cushion covers" custom` (m) | 7 | 2 | 股票、印度摩托、IKEA 转卖（地域） |
| `"foam replacement"` cushion (m) | 7 | 2 | 摩托车座、汽车座椅（nova）、耳机垫、船垫（服务商广告） |
| 补扫 `"custom bench cushion"` (m) | 6 | 0（全老帖/已读） | 2023-25 老帖×5+r/cushion 广告 |
| 补扫 `"someone to make" cushion` (m) | 7 | 2（皆旧档补 username） | 小说×2、车垫、约会帖、银戒 |
| 合计 | 47 | 10 | 噪音率 ≈79%（按帖）；有效帖用户产出比 1:1.6 |

**词效结论**：`"foam replacement"` cushion 与 `"custom cushions"` 是本轮用户产出最高的两词；`"replacement cushions" patio` 召回质量最差（affiliate 池+老帖）；评论区挖掘贡献 4/16 用户（#3/#11/#12/#13/#14——纯 OP 视角会漏一半 B 端信号）。

### 2a. 日更轮追加（2026-10-08，4 词+品牌 3 词）

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| `"custom cushions"` (w) | 7 | 0 | 与 10-06/10-07 轮完全一致（2 已档+5 噪音）——周窗连续 3 轮冻结零新增 |
| `"bench cushion"` (m) | 7 | 1 | 4 已档+Camry×3+1wojhug（新面孔，评论区产出 #17） |
| `"cushion covers" custom` (m) | 7 | 0 | 5 已档+2 噪音（IKEA 班加罗尔转卖/股票） |
| `"foam replacement"` cushion (m) | 7 | 2 | 2 已档+4 噪音+1v8qvzv/1v2utvx（双超龄范围外，#18/#19） |
| 品牌词×3 (w) | 0 | — | 连续第 8 轮零命中 |
| 合计 | 28 | 3 | 3 新用户全为观察级/范围外，无 ≤24h 可回帖 |

**10-08 词效侧证**：`"foam replacement"` cushion 连续两轮为唯一产出新面孔的词（10-07 结论再验证），但月窗已滚动见底（新面孔全为 07 月超龄帖）；`"cushion covers" custom` 边际归零。

### 2b. 日更轮追加（2026-10-09，3 词+品牌 3 词）

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| `"custom cushions"` (w) | 7 | 0 | 2 已档+5 噪音（宝石×2/办公椅+周窗滚动新面孔壁炉 1wxpk6q/法式装修 1wxmj5h——标题层即滤） |
| `"foam replacement" cushion` (m) | 7 | 0 | 与 10-08 轮完全一致零新增（2 已档+摩托/耳机/汽车×2/船垫广告）——月窗见底第 3 轮验证 |
| `"daybed cushion"` (m) | 5 | 0 | 全老帖/噪音（1p 双投求购 2025 中期/1m affiliate/1h frame dupe/1a 办公室）——daybed 亦证安静形态词 |
| 品牌词×3 (w) | 0 | — | 连续第 9 轮零命中（词 1 仅 1 条 mobygames 游戏噪音） |
| 合计 | 19 | 0 | 无 ≤24h 可回帖，无新 username 入账 |

### 2c. 晚间轮追加（2026-10-09 晚，5 词+主词滚动核+Lovesac flair 页）

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| `"custom cushions" recommendation` (w) | 7 | 0 | 4 已档+3 噪音（摩托/脚伤×2） |
| `"outdoor cushions" replacement` (m) | 7 | 0（1 信号） | 1 已档+1vz1j1z 发霉清洗帖（08-26 超龄，信号入 §7b-9）+5 噪音 |
| `"banquette" cushion` (m) | 7 | 0 | 1 已档+1w0gqn3 banquette 求购（ID 序≈8 月底超龄）+1x08udb 油漆帖（跑题）+UK 双投+2 弱 |
| `"window seat" cushion` (m) | 7 | 0 | 1 已档+6 噪音（小说×3/AI 生图×2/猫） |
| `"someone to make" cushion` (m) | 7 | 0 | 2 已档+5 噪音（脚垫/小说×2/约会/银戒） |
| `"custom cushions"` (w) 滚动核 | 7 | 0 | 与日间轮一致+Kia 汽车双投新噪音（1x0umfa/1x0ujy7） |
| **r/Lovesac Sactional flair 页** | 3 | **3 活帖** | 1x0uf61/1x0x7wm/1x0up6p 全 10-08 发（13-28h）——**flair 页通道首发命中：全部 1x0 前缀<24h，是当晚唯一活帖来源** |
| 合计 | 45 | 3 活帖/3 用户 | #20/#21/#22 入账；1x0uf61 可回（发布遇静默失败见 §7b-9） |

## 3. 画像粗判方法与数据

- **通道**：CDP 开 `reddit.com/user/{name}/` → eval 抓 karma/发帖数/账龄（中文界面正则）
- **B/C 端判据**：评论区出现 "client's"（客户语境）或批量项目数= B 端；求助语境+低 karma 新号= C 端即时需求；高 karma 老户= C 端可信画像（回复存活率高）
- **本轮 B:C ≈ 2:11**（B 端=#6 Negative-Owl4154、#13 aclassybetch；#16 边缘）——B 端不出现在"求购垫"词里，出现在**选家具/批量项目**语境里（SofaSnobs/upholstery 工单帖），词表要分开打

## 4. 功能可行性结论（是否纳入日更轮）

| 维度 | 实测 | 判定 |
|------|------|------|
| 词召回率 | 8 词 47 帖→10 有效帖→16 用户；噪音 79% 但扫描快（每词 ~40 秒） | 可接受——噪音在标题层即滤，不耗深读时间 |
| 用户提取难度 | 低——每帖一次 eval 全树提取（OP+评论者+正文），~15 秒/帖；**评论区同需求者是 OP 视角的 1.6 倍增量** | 核心能力成立 |
| profile 快扫 | ~6 秒/人，karma 足够 B/C 粗分 | 成立，仅对新增用户跑 |
| 日常化成本 | 净增 ~5-8 分钟/天（扫描轮与日更词表完全重叠，仅多"记 username+判定"动作）；独立周度复盘（去重+画像更新）~15 分钟 | **值得纳入，但作为日更轮的字段扩展而非独立流程** |
| 与现有工作流关系 | 本轮 #1（westindian92）即标准日更目标；#2/#4/#5 日更轮已回帖 | 台账=日更轮的"记忆层"，解决日更只看今天、漏掉"已识别未转化"人群的问题 |

**纳入方案（建议）**：《Reddit每日获客工作流》§3 记录字段追加 `username｜信号类型｜触达判定` 三字段；每轮顺手 append 本台账；周度去重一次。**不新增搜索轮次**。

## 5. 测试轮技术备注（通道漂移记录）

- AIX 下载器扩展浮层偶发导致 eval 返回 NOPOST（页面实际已加载）——重试或补 slug 后恢复
- tab 偶发卡在"Reddit - 全网主阵地"标题态——关闭重开 tab 即恢复
- 1wte59f 无 slug URL 首次导航失败，补全 slug（/comments/1wte59f/coquette_room/）后正常
- www 详情页本轮连续深读 11 帖未见限流（此前记录约 10 帖触发——窗口有波动，留观察）
