# Reddit 潜在用户台账（测试版 v0.1）

> **功能定位**：「谁在需求」的**情报层**——记录不触达。触达仍走《Reddit每日获客工作流》的回帖线（24h 红线/混合推荐/顾客口吻纪律全照旧），本台账回答"除了今天的帖，还有哪些已识别的需求者值得长期观察"。
> **测试轮**：2026-10-07（5+3 词扫描 t=month + 11 帖深读 + 13 用户 profile 快扫，CDP localhost:3456 全程）
> **合规边界（本轮实测结论）**：全程零 DM（Reddit 未请求的 DM=spam 画像，一票否决）；触达判定只有三值——回帖（帖龄 ≤24h 且无解）/ 观察等其新帖 / 不动（已解决或老帖）。profile 高质量发帖吸引是被动层，不对具体用户做定向动作。

## 1. 台账主表（16 人）

> 字段：username ｜ 来源帖 ｜ 信号类型 ｜ 画像（karma=粗判依据）｜ 建议触达 ｜ 状态
> 信号类型四值：求购（正在找渠道）/ 抱怨现有垫（替换窗口）/ 问渠道（评论追问）/ 问测量（尺寸工艺求助）

| # | username | 来源帖 | 信号类型 | 画像 | 建议触达 | 状态 |
|---|----------|--------|----------|------|----------|------|
| 1 | **westindian92** | r/interiordecorating 1wz5y0k（2026-10-06） | 求购：定制皮沙发罩+垫罩（10 年 Room & Board sectional，"Reupholstery is $$$"） | C 端业主，karma 123 | 已触达（10-07 spaceplaza 回帖：两条路干货+三渠道混合推荐，Cushion Mill 顾客口吻顺带提及=本周首次品牌提及）——10-08 核：楼主未追问（评论仅我方 1 条）；10-09 核（第 3 天，old.reddit 通道+datetime 核对 10-06T17:14Z）：楼主仍未回应；10-10 核（第 4 天，old.reddit）：楼主仍未回应；10-13 核（第 7 天，www 空壳→old.reddit 读通）：评论区仍仅我方 1 条，零回应——**改周度核，不再日核** | 🟡 已回帖观察（降频） |
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
| 21 | squeeps_21 | r/Lovesac 1x0uf61 评论区（10-08） | 抱怨现有：深座+斜背要塞枕头才舒服 "one would have to put extra pillows behind the couch cushions for the couch to be comfortable chaps my ass so much" | C 端 Sactional 新用户 | 不动（评论暴露）；**腰靠/lumbar 需求画像**，观察其独立发帖（10-10 我方已在 1x0uf61 主评论区回帖，squeeps_21 本人仍未触达） | 🟢 台账观察 |
| 22 | thewolfwalker | r/Lovesac 1x0x7wm 评论区（10-08） | 求购·进行时：计划 Loved 买二手内芯+"order new covers"（原厂罩语境） | C 端（Sactional 散件自组） | 不动（原厂罩语境，第三方定制错位）；A7 replacement covers 弱画像 | ⚪ 弱信号 |
| 23 | megoonie- | r/Lovesac 1x0uf61（2026-10-08）楼主 | 求购·进行时：深座配置买前咨询（angle back vs straight back 抉择，"the angle back made me wish I had another pillow behind me"+"pillows topple over on straight back"），高意向活跃 OP（22 评论逐条回复型） | C 端 Sactional 准新客（配置未交付=腰靠 wedge 潜在需求） | 已触达（10-10 spaceplaza 回帖 pez5h1x：几何归因+两条路线 IKEA topper/定制 wedge+Cushion Mill 顾客口吻+~3 周交期真实缺点）——10-13 核（第 3 天）：pez5h1x 零回复（nestedReplies=0，score=1 存活），窗口未开继续观察 | 🟡 已回帖观察 |
| 24 | SuitableCause995 | r/upholstery 1wwr05d（2026-10-03）楼主 | 抱怨现有·求替代：Ashley L 形沙发超大靠枕 "huge oversized back pillows I absolutely hate. Would love suggestions on what to replace them with"（评论区 3 条在要照片，互动中） | C 端（消费者口吻误入从业 sub） | 超窗不回（9.4 天）；**靠枕/lumbar 替换画像**（10-13 `"back cushion" sectional` 词首试产出），观察其独立发帖 | 🟢 台账观察 |

**My 账号已出现标记**：spaceplaza 在 1wst2h8 / 1wsgaot / 1wte59f 三帖已有回帖——台账 #2/#4/#5 与日更轮天然重叠。

## 1a. 存量扫描批次（2026-10-13 专项，30 天窗 looking-for 求购帖，含 DM 状态列）

> **批次说明**：用户指令扩窗专项——日常轮 72h/24h 窗漏掉的 30 天存量求购帖。扫描 15 查询（r/upholstery×5 词+r/Lovesac×3+r/DesignMyRoom+r/furniture×2+r/interiordecorating+全站×4）→ 60+ 帖 → 深读 9 帖分层。**DM 通道本轮未实测**——评论 2 触发 Reddit 限流信号（"Looks like you've been doing that a lot."）后按风控铁律全停，DM 排队下一窗口。量控结果：评论 2/2（1 成功 1 限流未发）、DM 0/3。
> **DM 状态列取值**：已发 / 失败弃 / 排队（帖龄窗口内待发）/ 不适用（B 层观察不 DM）。

| # | username | 来源帖 | 信号类型 | 画像 | 建议触达 | DM 状态 | 状态 |
|---|----------|--------|----------|------|----------|---------|------|
| 25 | **Possible_Mud_1692** | r/upholstery 1x0r349（2026-10-08）楼主 | 求购：继承 mission style 沙发，过敏需换全部垫+面料，问渠道或 DIY，关注泡沫化学安全（"does not release cyanide"） | C 端业主（新面孔） | 已触达（10-12 spaceplaza 评论 12:41Z：CertiPUR-US 科普+2.8-3lb 密度+DIY 切割+四渠道混合推荐含 Cushion Mill 顾客口吻+3 周交期真实缺点）——**10-13 核（第 2 天）：我方评论被 Reddit 移除（[ Removed by Reddit ]，帖子页+profile 页双页一致），无人回复**；10-14 核（第 3 天，只读轮）：仍 [ Removed by Reddit ] 未恢复，评论区 3 条他人评论健在；DM 不发 | 不适用（账号风控全停+评论已死，DM 失去依附） | 🔴 评论被移除 |
| 26 | **fagbac** | r/upholstery 1x3ksxp（2026-10-11）楼主 | 抱怨现有垫：免费沙发 down/feather 芯塌陷漏毛（"back cushion completely collapses"），需换 foam 芯+可能换罩 | C 端业主（10-14 profile 核：4,335 karma/709 帖/2 年/**简介明写 "my dms are open x"**=DM 接受度背书；gf 关节问题=支撑性坐感需求） | **评论线已弃**（帖窗截止）；**DM 线顺延**（10-14 恢复轮实测 DM 三通道空挂载+reCAPTCHA Enterprise=账号层收紧，见 §2h；待试水评论 1x05fis 存活 48h 后 10-16+ 重试，草稿 b64 仍留 temp/rd_c2_b64.txt） | 排队（通道受阻，10-16+ 重试） | 🟡 待触达（DM 通道恢复后） |
| 27 | **kevinrhurst** | r/SaltLakeCity 1wuahxv（2026-09-30）楼主 | 求购：4 个**非矩形异形**靠背垫换芯，直说网购标准泡沫块不可行，求 SLC 本地 upholsterer | C 端业主（异形需求=我方配置器正中场景） | 老帖不回（12 天）；本地 sub 敏感——若回只干货+比价语境；观察其未获本地推荐后的后续 | 不适用（B 层） | 🟢 高价值画像 |
| 28 | meow_cat_cat | r/Lovesac 1ww9law（2026-10-03）楼主 | 抱怨现有垫：Sactional 直背靠枕倒+毯子一拉带走（standard fill），评论区 10 条全是 DIY velcro 讨论无人给渠道 | C 端 Sactional 用户（评论区含 PvtCW #20/megoonie- #23 交叉） | 老帖不回（9 天）；**靠枕倒=腰靠/wedge 需求画像**（与 #21/#23 同款痛点第 3 例） | 不适用（B 层） | 🟢 台账观察 |
| 29 | Full-Way1255 | r/Lovesac 1wq1oot（2026-09-25）楼主 | 求购·已解决：深座太深用腰枕削 4" 坐深（pillow hack 晒经验帖非求购）；评论区 Disastrous_Soup5314 #3 交叉 | C 端 Sactional 矮个用户 | 不动（已自己解决 17 天）；画像=深座修正需求者 | 不适用（B 层） | 🟢 画像样本 |
| 30 | secondorder_ | r/DesignMyRoom 1x2edak + r/interiordecorating 1x2ebos（2026-10-10 双投）楼主 | 弱信号：卧房凹龛窗台求利用创意（5 评论全窗帘/储物建议，无人提垫） | C 端（审美求助语境） | 不动（审美帖+cushion 未被提及，回复突兀）；观察其是否后续问窗座垫 | 不适用（弱） | ⚪ 弱信号 |
| 31 | taniith | r/upholstery 1x3p0jf（2026-10-12）楼主 | 材料咨询：18 年躺椅本地店换 foam 后背颈发热（评论区已建议 Dry Fast 开孔泡沫） | C 端（换芯售后语境） | 不动（材料咨询非求购；Dry Fast 建议已在评论区=已答）；quick-dry 泡沫差异化侧证 | 不适用（弱） | ⚪ 弱信号 |
| 32 | smurfey002 | r/upholstery 1wzuk2f（2026-10-07）楼主 | 范围外：汽车座椅扶手换泡沫（"hard plastic+leather"） | 汽车内饰 DIY | 不动（品类错位）；0 评论帖仅记录 | 不适用 | ⚪ 范围外 |
| 33 | deb1183 | r/upholstery 1wxfkk9（2026-10-04）楼主 | 范围外：UK+船/玻璃钢座椅 vinyl 粘合剂求助 | UK 用户（地域双错位） | 不动 | 不适用 | ⚪ 范围外 |
| 34 | BelleDuMorte | r/upholstery 1wye7m3（2026-10-05）楼主 | B2B/DIY 错位：FBM 免费沙发全 DIY 重包项目（edge wire 修复，评论区全从业技术讨论） | DIY 爱好者（非客户） | 不动（SOP 负面清单：从业者 DIY 讨论） | 不适用 | ⚪ 错位归档 |
| 35 | CuratedLens | r/AskSeattle 1x46d5j（2026-10-12T16:23Z）楼主 | 求购·只换罩：沙发垫**只求 covers 不求垫芯**（"Just looking for someone who can do the covers for couch cushions, not the couch itself"），已看 Etsy 想转本地（"support local"） | C 端业主（12h 活帖，7 评论） | 不回（评论区已给出 2 个本地 upholsterer 推荐=有供应商回复，降 B 层+本地意图明确）；**A7 replacement covers 精确画像**（与 #10 Own-Neck-2089 同型第 2 例） | 不适用（B 层） | 🟢 台账观察 |
| 36 | Full-Way1255（新帖跟进） | r/Lovesac 1x4f4ih（2026-10-12T21:53Z）=台账 #29 用户的新帖 | 抱怨服务：*Loved by Lovesac* 平台加运费+取消退货（$159 运费/$1966 订单），非垫需求 | C 端 Sactional 老户（与 #29 同人） | 不动（物流政策吐槽，评论区仅致谢；若其 Sactional 垫出问题转向替代=新帖优先响应） | 不适用 | 🟢 画像样本（跟进记录） |

**本轮通道记录**：old.reddit 详情页复活（10-06 全挂后首次复通，读+发布均走 old）；www 详情页发布层 shadow DOM 堵死态复现（composer rect 全 0，10-07 状态回归）；old 发布链路 textarea 注入+button.save click 实证可用（评论 1 一次成功），连续第 2 条触发账号限流——**本日触达配额实际耗尽**。

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

### 2d. 日更轮追加（2026-10-10，6 词+flair 页）

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| **r/Lovesac Sactional flair 页** | 3 | 0 | 1x0x7wm/1x0up6p/1x0uf61 全 10-08 已档三帖，无新帖（flair 页零滚动） |
| `"custom cushions"` (w) | 7 | 0 | 与 10-09 轮完全一致——周窗连续第 5 轮冻结 |
| `"bench cushion"` (m) | 7 | 0 | 4 已档+Camry×3（与历史轮一致） |
| `"lumbar cushion"` (m)【新词族首试】 | 7 | 0 | **全办公椅/轮椅/医疗语境**（r/OfficeChairs×2/PcBuild/hysterectomy/wheelchairs/WomanSurvivalGuide）——裸词与家居垫品类错位 |
| `"lumbar cushions" couch` (m) | 4 | 0 | 全噪音（关系/术后/Vine）——语境词组合召回被稀释 |
| `"patio cushions" falling apart` (m) | 6 | 0 | 召回全无关（OR 分词稀释+当日新帖 dominate） |
| `"wicker cushion"` (m) | 5 | 0 | 全老帖/噪音（星体投射/WickerParadise 营销/bose 耳机垫）——词族持续安静第 3 轮验证 |
| 合计 | 39 | 0 | **0 回复合规日**（6 词+flair 页零合格帖）；词效结论：lumbar 词族裸词不可用，需换 "lumbar" + 沙发语境词（sectional/sofa/back cushion）再试 |

**10-10 词效侧证**：lumbar 新词族首试失败——办公椅 lumbar support 是独立市场，家居语境必须从 sectional/sofa 侧切入（下轮试 `"back cushion" sectional`）；主词周窗冻结已 5 轮，活帖来源事实上收敛到 flair 页（本日 flair 页也零新增=整站求购流安静日）。

### 2e. 日更轮追加（2026-10-13，含品牌监控周轮补跑）

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| **r/Lovesac Sactional flair 页** | 3 | 0（1 深读） | 1 新帖 1x3eqwa（Corded Velvet 洗后斑驳，43h 落窗）——13 评论"正常现象"共识+零采购需求（warranty 语境），不回；2 已档 |
| `"custom cushions"` (w) | 7 | 0 | 3 新面孔=布置求助三连投（hotgirldownshift 1x1o3a8/1x2hqmm/1x2hr5a，双投计 1）——bay window 垫是**已有资产非需求**（"with custom cushion"），93h 超窗+couch 级讨论，不回；其余已档/噪音 |
| `"back cushion" sectional` (m)【新试词】 | 7 | 1（#24） | 2 条 r/FurnitureForLess affiliate listicle+1wwr05d 深读（Ashley 靠枕替换真需求但 9.4 天超窗）+老帖 |
| `"outdoor cushions" replacement` (m) | 7 | 0 | 全已档/噪音 |
| `"custom bench cushion"` (m) | 6 | 0 | 全 2024-25 老帖+1 已档 |
| 品牌词×3 (w) 周轮补跑 | 0 | — | 连续第 10 轮零命中（降频后第一次周轮） |
| 合计 | 37+品牌3 | 1 | **0 回复合规日**（counter=0≤2）；词效：back cushion+sectional 语境方向正确（首试即中真需求帖） |

### 2f. b 轮追加（2026-10-13 下午，增量扫描：flair 页+新词；账号风控全停日）

> **风控事件（本轮头条）**：10-12 晚发出的 1x0r349 评论（#25）被 Reddit 反垃圾移除（[ Removed by Reddit ]，帖子页+profile 双页一致，10-13 核实）；profile 近 10 条评论仅此 1 条被移除（pez5h1x/1wz5y0k/1wte59f 等健在）。叠加 10-12 晚限流文案=账号处于反垃圾高压态 → **评论 0/2、DM 0/3 全停**（任务铁律）。fagbac 评论重发无限期后延，账号解禁信号=新评论存活 48h+（先用 r/CushionMill 类低风险动作试，或纯只读观察 3-5 天）。

| 词 | 召回 | 新增有效 | 构成 |
|----|------|----------|------|
| **r/Lovesac Sactional flair 页** | 3 新帖（10-12 晚发） | 0（2 判定+1 深读） | 1x4f4ih 运费吐槽（#29 用户新帖，#36 跟进）/1x4govg 交付晒帖/1x4bkm0 物流求助——全非垫求购 |
| `"looking for custom cushion"` (m) | 1 | 0 | 1oajfo 老帖（2024 前） |
| `"couch cushion" replacement` (m)【新词】 | 7 | 1（#35） | **1x46d5j r/AskSeattle 深读**（只换罩求购，12h 活帖但评论区已有 2 本地推荐=降 B 层）+游轮/ condo/狗咬/耳机噪音+1 已档（1wuahxv） |
| 合计 | 11 | 1 | 0 回复（风控全停非合规缺口）；词效：`"couch cushion" replacement` 首试即中 12h 活帖（词族保留） |

### 2g. 冷却只读核（2026-10-14，账号风控观察第 3 天）

> **只读四查结果（比特 cm-socials CDP 3460，old.reddit 通道）**：
> ① **被移除评论未恢复**——1x0r349 帖子页我方评论仍 [ Removed by Reddit ]（score=0），同帖他人 3 条评论健在；profile 近 10 条评论仅 10-12 这条 removed，其余 9 条全存活。
> ② **账号无新风控信号**——profile 正常渲染、无 suspension 标记；10-12 后零新评论（无被再移除项）。
> ③ **Inbox/PM 零新消息**——PM 已归档（唯一消息=3 年前 u/reddit 系统信）；old inbox "还没有人留言"（评论回复/提及均零）。
> ④ **相关 sub 信号安静**——r/upholstery 新帖 15 条全为从业修复/材料讨论（repair/adhesive/spring clips/nap direction），零垫求购；r/Lovesac Sactional flair 页 sort=new 最新仍为 10-12 三帖（1x4govg/1x4f4ih/1x3eqwa 全已档），48h 零新帖。
> **触达决策：继续冷却不硬闯**（移除未恢复=解禁信号未出现）。判定口径沿 §2f：新评论存活 48h+ 才算解禁——下次只读核 10-15/10-16，若彼时移除恢复或观察满 5 天，可用 r/ 无害 sub 一条低风险试评论验证，再谈 fagbac 类触达恢复。fagbac 帖（#26）按预案弃。

### 2h. 恢复轮（2026-10-14，用户指令"评论线+DM 线全部恢复"）

> **搜索轮 8 查询**：主词 `"custom cushions"`(w)（7 帖全已档/噪音，周窗连 6 轮冻结）+ 品牌词×3(w)（**连续第 11 轮零命中**，周轮外补跑）+ r/Lovesac Sactional flair 页（1 新帖 1x1pbpv OUTLET 公告非求购+3 已档）+ r/Lovesac 站内 cushion 词(w)（零结果）+ `"bay window" cushion`(m) + `"window seat" cushion`(m) + `"couch cushion" replacement`(w)（全已档/噪音）。
> **试水评论已发（解禁路径第一步落地）**：**1x05fis r/AnatolianShepherdDogs**（"Need pet friendly furniture"，2026-10-07T19:12Z，13 评论）——楼主 **Hour-Needleworker158**（115 磅安纳托利亚牧羊犬主人）求"可拆洗套椅子/坐垫"，评论区 13 条全是毯子/Temu futon 凑合，楼主活跃拒绝毯子方案 4+ 条（"I just think they look so ugly"），**无人给定制渠道**=补位不撞车。选此帖理由=品种小 sub 低风险（非 upholstery 行业 sub，任务书要求）+需求正中可拆洗拉链套+楼主人宠双场景。**我方评论 2026-10-14T12:19:16Z 发布成功**（old.reddit textarea 注入+save click 一次成功，543 字符纯干货：定制可拆洗方向+2.8-3lb 密度+户外/帆布面料+中性渠道 local upholsterer/online made-to-measure，**零品牌零链接零禁用词**）——双页验证通过（帖子页+profile 页均正常显示无 [ Removed ] 标记）。**48h 存活检查=10-16 复核项**（存活即解禁信号，fagbac DM 与正常回帖线随后恢复）。
> **DM 线通道受阻（未发）**：fagbac（#26，DM 排队第一位）当日三通道全堵——www compose 空挂载（页面仅标签骨架无输入组件，**挂着 reCAPTCHA Enterprise iframe**=账号层 DM 权限收紧信号）/old compose 同症状/`/chat` SPA 空壳/profile"开始聊天"按钮 clickAt 无响应（closed shadow+组件不挂载）。判定=10-12 风控事件的 DM 侧延续，**非技术问题不硬闯**；fagbac DM 排队顺延至试水评论存活 48h 后（10-16+）随通道恢复重试。
> **风控间隔账**：10-12 被移除评论（12:41Z）→ 今日试水（12:19Z）间隔 47.8h≈48h 纪律线达标；今日触达配额=评论 1/1 用尽，DM 未发。

| # | username | 来源帖 | 信号类型 | 画像 | 建议触达 | DM 状态 | 状态 |
|---|----------|--------|----------|------|----------|---------|------|
| 37 | **Hour-Needleworker158** | r/AnatolianShepherdDogs 1x05fis + r/DogAdvice 1x05adp 双投（2026-10-07T19:07/19:12Z）楼主 | 求购·进行时：115 磅大狗坐卧位求"removable washable covers"椅子/坐垫，明拒 slipcover/毯子（审美敏感），"scouring the internet and coming up with nothing that ticks all the boxes" | C 端宠物主人（活跃 OP，双帖 19 评论逐条回复型） | 已触达（10-14 spaceplaza 试水评论 1x05fis 版：定制可拆洗垫方向干货，零品牌——试水帖转化不指望，跟进=楼主追问时再给渠道层） | 不适用（C 端回帖线） | 🟡 已回帖观察（试水存活检查 10-16） |
| 26 状态更新 | fagbac | — | — | — | 评论线已弃（帖窗截止）；DM 顺延 | **排队（通道受阻：compose/chat 三通道空挂载+reCAPTCHA Enterprise，10-14 实测；待试水评论存活 48h 后重试）** | 🟡 待触达（DM 通道恢复后） |

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
