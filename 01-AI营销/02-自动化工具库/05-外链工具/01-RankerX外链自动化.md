# RankerX 外链自动化

> **vehicleaid 实验线工具文档**：云端面板 REST API、账号策略、实验纪律 | 2026-09-09 CDP 实测建档
>
> 相关：[外链建设指南](../../01-营销方法论基础/05-外链建设/外链建设指南.md)（方法论层，白帽主力策略）；Web2.0 资产层实证结论出来后回填该指南，不提前写。

---

## 1. 定位与边界

- **Web2.0/Profile 外链 = 低权重补充层**，不是主力。2026 共识：只在平台有真实权威时有价值（Reddit r/localseo、BlackHatWorld）
- 本线服务 vehicleaid 实验站。**业务站（evapcryst/broachingmach/electricalcabinet）禁用**
- 锚文本纪律：branded/naked/URL 为主，精确匹配锚 <10%
- tiered 结构不提供 Google 隔离（官方垃圾政策口径），manual action 风险自担

## 2. 面板与 API（2026-09-09 CDP 实测）

**实例**：`https://vehicleaid.rankerx.net`（云端版，React SPA + Ant Design，hash 路由）

**认证**：纯 session cookie，无 CSRF token / API key。页面内 `fetch(url, {credentials:"include"})` 即全权。

**Session 特性**：
- 约 10 分钟无 UI 活动后 REST 全部 401，面板自身也会被踢到 `#/user/login`
- **刷新页面即自愈**（Chrome 密码自动填充自动重登，2026-09-09 实测）
- 自动化纪律：每批操作前先 GET `/rest/campaigns` 验登录态，401 则 navigate 刷新一次再继续

**关键端点**（从 main bundle 静态提取，全量路由见 web-access skill site-patterns/rankerx.net.md）：

| 环节 | 端点 |
|------|------|
| 资金页+关键词 | `/rest/url_list` |
| 内容 | `/action/generate/articles/`、`/rest/new_article/`、`/action/spin/test` |
| 策略 | `/rest/strategies`（BUILTIN 含 SEO Expert） |
| 建 campaign | `/action/create/xcampaign` |
| 启停 | `/action/start/project/{id}`、`/action/pause/resume/campaign/{id}` |
| 监控导出 | `/rest/campaigns`、`/action/export/backlinks_from_campaigns` |
| 账号池 | `/rest/profiles`、`/action/import/profile`、`/action/export/profile` |

POST 需 `Content-Type: application/json; charset=utf-8` + `Accept: application/json`。

**CDP 自动化路径**：web-access skill 页面内 fetch 直调 REST（勿模拟 UI 点击）。站点经验已沉淀 site-patterns/rankerx.net.md。

**Campaign 创建协议（2026-09-09 全链路实测破解）**：
1. `PUT /action/create/xcampaign` 的 body **不是明文 JSON，是 lz-string 压缩串**：`LZString.compressToEncodedURIComponent(JSON.stringify({saveWizard:false, wizard:<wizard对象>}))`（CDN：lz-string@1.5.0 动态加载进页面即可）。发明文 JSON 服务端直接 500 无信息
2. wizard 对象从 `GET /rest/xwizards/{id}` 取，逐层改：`linksAndKeywords[i]`（urls/primaryKeyword/brandedKeyword + 五锚文本百分比；**tags 是字符串不是数组**，必填）、`content[i].contentGroupId`（**每层都要**，可共用一个组）、`campaignName`
3. **`w.startDate = Date.now()` 必须设**（epoch 毫秒）——null 会导致调度器 "Invalid date"，32 个 project 永远 SCHEDULED 不执行（首跑踩坑实测，campaign 1 因此作废重建）；`w.nDay` 控制发完天数
4. **架构真相（2026-09-10 实测定案）：云端面板（xxx.rankerx.net）只是配置/监控层，执行引擎是桌面客户端**。官网只卖桌面软件（Win/Mac/Linux，$49.99/月），云端 project 手动 start 后返回 COMPLETED 但 **Accounts/Backlinks 全 Count=0（假完成）**——云端 worker 不会替你执行。campaign 全部配好后需装桌面版登录同账号，执行引擎在本地跑（用自己的 IP/代理）。project 手动启动三步：`GET /action/delete/schedule/{id}` → `GET /action/start/project/{id}` → 25 秒内标记 COMPLETED（仅指令层）
5. 服务端校验按序报错（200 + error 数组，有明确 message，可迭代修复）
6. **硬门槛：Captcha 双开关都要配**——`autoSolveCaptcha:true + primaryZeroCaptchaInfo.captchaKey`（图片码）**且** `useGoogleNoCaptcha:true + googleNoCaptchaZeroCaptchaInfo.captchaKey`（reCAPTCHA），缺一创建被拒
7. Options 写入协议：`POST /rest/options` body 是 **options 对象本身**（不带 {options:...} 外包装，包装版报 Server error）；保存后 `GET /action/check_balance/primary_captcha` 验余额
8. 打码服务用 **0captcha.com（=RankerX 内置 ZeroCaptcha）**，2026-09 充值 $40+，image+google 双余额同 key
9. 会话内操作链全程 <10 分钟（session 时效），超时整页重载自愈后重来；**fetch hook 装两次会致栈溢出**，重装前先整页 reload；云端 *.rankerx.net 偶发全片 503 闪断，等 1-2 分钟自愈
10. 文章批量导入：`POST /rest/upload_raw_articles_file_name_title/{groupId}`，multipart FormData 字段 `file`，文件名即标题，支持 HTML 内容
11. XWizard 表单 UI 的 Ant Select tags 输入无法用合成事件填（chips 加不进），走 REST 路线绕开
12. 账号注册信息（firstName/lastName/username/password）留空自动生成 spintax；emailSource=RANKERX 用托管邮箱收验证邮件，无需自配邮箱池

## 3. 站点池现状（2026-09-09 实测，二次修正）

`GET /rest/sites` 返回 **713 个站点**（响应无分页字段，此为全量）。**module 命名有陷阱：Web2.0 博客归在 `SocialNetwork` 模块下，不是叫 "Blog"**（首查曾因此误判"无 Web2.0"）。

模块分布：

| 模块 | 数量 | 说明 |
|------|------|------|
| WebProfile | 219 | Web 档案页（含 edu/gov、pinterest/youtube 等） |
| ForumProfile | 168 | 论坛档案（Discuz/MyBB/SMF） |
| Bookmarking | 164 | 书签（Pligg/bitly/flipboard + google.* 重定向 73 个） |
| SocialNetwork | 75 | **Web2.0 博客池**（wordpress/tumblr/blogger + 长尾博客平台） |
| Wiki | 37 | Wiki 页（MediaWiki/DokuWiki） |
| GooglePlace | 19 | Google 重定向 |
| Indexer | 18 | 收录服务 |
| PDF | 7 | PDF 分发（pdf4shared/4shared PR93） |
| PressRelease | 6 | 新闻稿 |

**高权重 Web2.0 博客（SocialNetwork 内，可发文章）**：

| 平台 | PR | dofollow | 备注 |
|------|-----|---------|------|
| wordpress.com | 93 | ✅ | 首选采购/注册 |
| blogger.com | 86 | ✅ | 首选 |
| tumblr.com | 81 | ✅ | 首选 |
| telegra.ph | 92 | ✅ | Telegram 博客 |
| strikingly.com | 88 | ❌ | |
| edublogs.org | 81 | ❌ | edu 属性 |
| diigo.com | 90 | ✅ | 社会化书签+博客 |
| blogfreely.net / squareblogs.net / zenwriting.net / werite.net | 63-73 | 部分df | WriteFreely 类长尾，好注册 |

**高权重 Profile 类**：youtube PR99 / myspace PR95 / facebook PR95 / pinterest PR94 df / instructables PR93 / disqus PR93 / stanford.edu PR93 df / asu.edu PR91 df / 500px PR91 等。**Edu/Gov 平台 23 个**。

**书签类高权重**：bitly PR93 df / flipboard PR91 df / instapaper PR85 df；google.* 系 73 个为 nofollow 重定向（引蜘蛛用，非权重）。

**guest post：无此功能**。changelog（1.4.3.0→2.3.6.4 全版本）零 guest post 记录——guest post 属人工/付费投递，走[外链建设指南](../../01-营销方法论基础/05-外链建设/外链建设指南.md)白帽线，不在本工具范围。

**changelog 要点**（rankerx.com/homepage/rankerx-changelog/，桌面版版本号 1.x/2.x）：Tumblr/Wordpress 从"新增"列表缺席但在几十个版本的修复列表高频出现（长期支持+持续修引擎）；最新版 2.3.6.4 新增 Medium 风格文章平台、DA70+ 社区档案站；2.3.3.9 加自定义域名 Web2.0 模块。Blogspot 全 changelog 无记录（blogger.com 在池内可用）。

## 4. 账号策略：购买 vs 自注册

**结论：首跑用购买账号，自注册三件套后补。**

| | 购买现成账号 | 自注册 |
|---|---|---|
| 前置依赖 | 无（导入即用） | 邮箱池 + 住宅代理 + 验证码服务（当前全空） |
| 账号质量 | aged 账号 PA 更高（BHW 共识：aged accounts work best） | 新号，需养 |
| 成本 | $1-5/个（BHW 市场、HStock 等） | 邮箱+代理+验证码 ≈ $30-50/月固定 |
| 风险 | 卖家同 IP 批量注册可能整批封；一鱼多吃 | 注册成功率取决于代理质量 |
| 导入路径 | RankerX `/action/import/profile`（格式用 `/action/export/profile` 导模板看） | Authority Sites 模块自动注册（**桌面版**） |

**采购验证清单**（HStock 建议）：账号年龄、博客历史、邮箱是否可改绑、recovery 信息完整性。

**采购平台限定**（2026-09-10 市场核实，公开账号市场 Web2.0 在售现状）：
- **Tumblr：唯一规模化流通**。HStock（hstock.fit/tumblr-accounts）分级供应：Fresh $0.7/个（100 起批）、1-6月 $1、7-11月 $2、1-2年 $2.75、3-5年 $3.50（均 10 起批）。BHW 帖多为已关闭的历史帖
- **Blogger/Blogspot：公开市场绝迹**——Blogger 账号=Gmail 账号（Google 统一体系），流通受限于 Gmail 买卖灰色地带 + Google 风控强，无稳定货源
- **WordPress.com：无市场**——注册零门槛（邮箱即可），无付费需求；RankerX emailSource=RANKERX 托管邮箱自动注册已覆盖
- **Medium/Quora：HStock 有售但不在 RankerX 713 池内**，导入无用，只能手动发
- **expired Web2.0 路线**：BHW 长期讨论"expired tumblr"（过期高 PA 子域重新注册），是 aged 属性的另一获取路径
- **决策顺序**：先看首跑 campaign 2 的自动注册结果——自注册存活率 OK 则 Tumblr 老号仅锦上添花；大批死再买号救场

**买前抽查**：先买 5-10 个小批量验证存活率（3 天后复测），再批量。

**首单实测（2026-09-10，~150 个 expired Tumblr，抽验 2/2）**：
- 号是活的：密码全部正确，PA 分布 10-75（高值号：caseykaui PA74/6.5万外链、becauseitisjohnnydepp PA70、frankensteinsbrides PA70）
- **全部卡异地首登强制改密墙**（"请更改你的密码"），改密需邮箱验证链接 → 邮箱控制权在卖家手里（~100 个号挂 johnpatel0812+xxx@gmail.com 单 Gmail 别名；~50 个挂 abincol.com/azteen.com 等一次性域名）——**交付规格缺陷，不是号质量问题**
- **采购纪律（教训）**：批发 Tumblr 必须要求 ①邮箱账密随号交付（能改绑）或 ②cookies 版或 ③卖家代完成首登改密后再交付。只给"邮箱地址+Tumblr密码"的规格=租用不是拥有
- 待办：向卖家要 johnpatel0812@gmail.com 主邮箱 / cookies / 代改密，三选一；拿到后流程：改绑自有邮箱 → 高 PA 号优先导入 RankerX profiles → 发 cushionmill 内容

## 5. 配置缺口（2026-09-09 /rest/options 实测）

- [ ] 邮箱池：空（`emails: []`）——导入 catch-all 域名邮箱
- [ ] 代理：`useProxyForPosting: false`——批量操作必须配住宅代理
- [ ] 验证码：`autoSolveCaptcha: false`，各家 key 全空（支持 TwoCaptcha/AntiCaptcha/DBC/ImageTypers/ZeroCaptcha 等十余家）
- [ ] Spinner：SpinRewriter/eSpinner 等多家可选，均未配

## 6. 实验纪律（vehicleaid 首跑）

**靶站变更记录**：2026-09-09 首跑靶站定为 **cushionmill.com**（靠垫站，已上线）。vehicleaid 暂不用。

**cushionmill.com 基线快照（2026-09-09/10）**：
- GSC 已接入（sc-domain，4 个 sitemap 09-04 提交）；**GSC 近 28 天：8 clicks / 515 impressions / 均位 31.5**（2026-08-13~09-09，外链发出前真基线）
- DA 1 / 外链 3 条（全 nofollow）/ 引用域 3（Ubersuggest）
- 已排名词（pSEO 矩阵页已被索引）：cushions for breakfast nook **#38**（量1300）、27x27 **#19**（量1000）、custom couch cushions #69（880）、custom cushions for sofa #56（880）、standard outdoor cushion sizes #111（110）
- 复查节奏：外链发出后每 2 周拉一次 backlinks_overview + domain_overview + GSC searchAnalytics 对照

**首跑配置（2026-09-10 已发出）**：
- wizard: cushionmill-first（Social Profile Writer Loop 策略）
- 资金页 https://cushionmill.com/，primary="custom outdoor cushions"（30%）、branded="Cushion Mill"（50%）、naked URL 20%
- 内容组 cushionmill-p1（2 篇文章已上传：测量指南+换海绵指南）
- campaign 名 cushionmill-p1，nDay=2，startDate=Date.now()
- **campaignId=2**，ACTIVE，32 project（14 账号注册 + 18 发帖，tier1-5），调度 nextRun 排期后由云端 worker 异步执行
- 验证码：0captcha（ZeroCaptcha）双项已配，余额 $40.27（2026-09-10）
- account 注册信息自动 spintax 生成，emailSource=RANKERX 托管邮箱
- 废 campaign 1（startDate=null 致 Invalid date 永不执行）：删除接口 4 种字段名均 Failed，无 UI 删除入口，留着无害
- **复查动作（次日）**：`GET /rest/campaign/2` 看 project 状态分布与 lastError；Ubersuggest backlinks_overview 对照基线（外链3/DA1）

1. **基线**：✅ 已记录（上方快照）；GSC 若接入再补展示/点击层
2. **温和首跑**：10-20 条外链、真人可读内容、branded 锚文本为主、2 天发完
3. **观察期**：2-4 周看排名响应 + GSC manual actions 报告
4. **加量决策**：有正响应再上量；出现异常立即停
5. 复盘结论回填外链建设指南（方法论层），本档只记工具执行

## 来源

- CDP 实测（本会话）：REST 路由、713 站点池、options 配置、session 行为——一手证据
- [Google 垃圾政策](https://developers.google.com/search/docs/essentials/spam-policies)（官方）
- [BHW Web2.0 账号市场](https://www.blackhatworld.com/tags/web-20-accounts/)、[HStock Tumblr](https://hstock.fit/tumblr-accounts)（账号采购）
- [AVS 工具对比 2026](https://asiavirtualsolutions.com/ranker-x-vs-gsa-ser-vs-money-robot/)（工具选型）
