# Medium vs Quora 2026 运营现状与 SOP 决策依据

> 调研日期：2026-09-10。用途：cushionmill.com（B2C 定制靠垫，DA1 新站）+ B2B 工业站的外链/GEO 运营决策。
> 标注体系：【官方明文】=平台规则/官方文档原文；【实测数据】=第三方研究有量化数字；【社区经验】=无量化但多源一致的一线报告。

---

## 一、Medium

### 1.1 2026 现状：付费墙 / 自定域名 / 账号类型

- **付费墙是作者 opt-in，不是平台强制**。免费账号可正常发布文章，发文与是否付费无关；付费墙（metered story）只影响"作者想赚 Partner Program 分成"的场景。不进付费墙的文章对所有读者免费可见，外链不受付费墙影响。【官方明文+社区经验】
  - 来源：[Should You Paywall Your Articles 2026](https://stories.byburk.net/should-you-paywall-your-articles-2026-e6622716db51)（2026）、[A Guide to Writing on Medium](https://thesideblogger.com/how-to-start-writing-on-medium/)
  - **对运营的含义**：做外链/GEO 的文章一律**不进付费墙**（免费可见才能被 Google 索引、被 AI 爬虫抓取）。
- **自定义域名仍可用**。Medium Help Center 的 [custom domain 设置文档](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication) 仍在线，且 Medium Rules 里有专门的 "Use of custom domain features" 条款段（禁止注入广告/追踪代码/代理绕过）。历史：2017 年对新刊物关闭过，2020 年恢复，2025-2026 无关闭公告。【官方明文】
  - 但注意：自定义域名指向的仍是 Medium 托管页面，受 Medium ToS 管辖，且要求关闭代理才能生效——对国内运营者是个实际障碍。
- **分发机制巨变：Boost 收紧**。2025 年 1 月 Medium 调整分发算法，Boost（编辑提名→算法放大分发）通过率大降，有作者从 2024 年的 30% 掉到 2025 年的 7%（27 篇仅 2 篇被 boost）。【社区经验，多源一致】
  - 来源：[Did Medium Secretly Stop the Boost Program?](https://medium.com/write-a-catalyst/did-medium-secretly-stop-the-boost-program-bb70253c36e5)、[Medium Boost is Dead, Medium Isn't](https://lindac.substack.com/p/medium-boost-is-dead-medium-isnt)（2025-01）
  - **对运营的含义**：新号指望平台内流量不现实，Medium 文章的价值在站外（Google 索引 + AI 引用），不在站内推荐流。

### 1.2 Google 排名待遇

- **没有发现 2024-2026 针对 Medium 的大规模降权事件**。搜索 Medium 降权/惩罚事件，返回的全是行业性流量下滑（AI Overview + zero-click），而非 Google 单独惩罚 Medium 的证据。【调研结论，无反证】
- Medium 的 Google 流量下滑是全行业现象：零点击搜索从 2024-05 的 56% 升到 2025-05 的 69%；全美出版商自然搜索 referral 从 23 亿降到 17-18 亿月访问（Similarweb/Digiday）；Google 搜索流量 2025 年全球降 33%（Reuters Institute 口径）。【实测数据】
  - 来源：[Zero-click 报告综述](https://medium.com/the-citation-lab/your-analytics-cant-explain-what-s-happening-right-now-14f770e87f77)、[PixelMojo: Google Traffic Dropped 33%](https://www.pixelmojo.io/blogs/google-traffic-dropped-33-percent-ai-search-shift)
- **Medium 子页仍有排名能力**：DA 94-96，长尾词上 Medium 文章仍频繁出现在 SERP（本次调研的多个查询本身就返回 Medium 文章作为答案）。但权重属于 medium.com 而非你的站。【实测数据+社区经验】
  - 来源：[50+ Do-Follow Backlinks Sites 2025](https://ai-businessplans.com/p/50-high-quality-websites-with-do-follow-backlinks-in-2025)（DA 94-96 多源一致）

### 1.3 带外链文章的存活政策（官方规则原文已核实）

抓取了 [Medium Rules](https://help.medium.com/hc/en-us/articles/213477928-Medium-Rules) 官方全文，关键条款：

- **一方推广明确允许**："First party promotion is allowed, and you may promote and link to your own business, website, mailing list, or fundraiser." —— 推广并链接到**自己的业务/网站/邮件列表**是合规的。【官方明文】
- **但"主要为引流/提升外站排名而发内容"是 spam**："Posting content primarily to drive traffic to, or increase the search rankings of, an external site, product, or service"（Spam or Site Misuse 条款第一条）。判定关键词是 **primarily**（主要目的）——纯导流文会被删，内容为主+自然带链可活。【官方明文】
- **"剪裁文"明确违规**："Stories where the content is clipped with the purpose of linking to the rest of the article on a different website" —— 只发一半、引导去自己站读完 = 违规。【官方明文】
- **重复内容违规**：同一内容多发（单号或多号）禁止；但从**自己的博客** cross-post 到 Medium 允许（须拥有版权）。【官方明文】
- **Affiliate 链接允许但须 FTC 披露**（文末一句声明即可）。第三方广告/赞助禁止。【官方明文】
- **封号后开新号会被持续封杀**："If you attempt to evade suspension by creating new accounts or posts, we will suspend your new accounts and posts."【官方明文】
- **封号案例与申诉**：有 1.4K 粉丝账号因文内塞博客链接+affiliate 链接被封（社区案例）；r/Medium 社区反馈申诉成功率不低（很多封号是自动 spam 过滤误判）。最常见的封号原因就是 spam/site misuse。【社区经验】
  - 来源：[Medium Suspended My Account with 1.4K Followers](https://vocal.media/writers/medium-suspended-my-account-with-1-4-k-followers-and-376-stories-here-s-the-shocking-reason-why)、[Reasons for Suspensions](https://help.medium.com/hc/en-us/articles/21308869037975-Reasons-for-Suspensions-or-Restrictions)、[Reddit: Account Suspended](https://www.reddit.com/r/Medium/comments/1on4c9w/account_suspended/)
- **实操密度共识（社区经验，无官方数字）**：官方不公布链接密度阈值。社区经验是每篇 1-3 条高度相关外链安全；文章本身有独立价值（不是站内文章的复读）；新号首发纯内容、第 3-5 篇起带链更稳。
- **外链属性：全站 nofollow**。Medium 对文章内所有外链加 `rel="noopener nofollow"`（站内链接 dofollow）。无正式公告，2019 年前后逐步实施，2025/2026 年第三方列表均标 nofollow。【实测数据，多源一致；本次 curl 直抓 Medium 正文被反爬拦截（返回 5.9KB 挑战页），未能一手验证】
  - 来源：[iCopify 分析](https://www.icopify.com/guest-posting/is-medium-com-guest-post-actually-good-for-seo/)、[Victoria Olsina: Medium bad for SEO?](https://victoriaolsina.com/blog/medium-bad-for-seo-analysis/)
  - 注意：Google 2019 年起 nofollow 只是 hint 不是指令，高相关 nofollow 链仍有发现/抓取与品牌信号价值，但不传传统 link equity。

### 1.4 AI 引用证据（对 GEO 决策最关键的一条）

Semrush 3 个月研究（2025-07-14 至 10-12，每周 23 万 prompts，1 亿+ citations）：

- **ChatGPT：Medium 是 top-5 被引域名，且是 2025 年 9 月调整后的"最大赢家"之一**（与 PRNewswire、Forbes 并列，引用量上升）。同期 Reddit 从 ~60% 掉到 ~10%、Wikipedia 从 ~55% 掉到 <20%——**ChatGPT 的引用池在从 UGC 论坛向"编辑型长文"迁移，Medium 直接受益**。【实测数据】
- Google AI Mode：Medium 是**最大下滑者之一**（与 LinkedIn、Quora 并列；YouTube/Reddit/Facebook 增长最大）。【实测数据】
- Perplexity：Reddit 一家占 top citations 的 46.5%，Medium 不在头部。【实测数据】
  - 来源：[Semrush: The Most-Cited Domains in AI](https://www.semrush.com/blog/most-cited-domains-ai/)（2025-11-10 发布）、[Profound: AI Platform Citation Patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)

**结论：Medium 的 GEO 价值集中在 ChatGPT（调研型长查询），不在 Perplexity/AI Mode。**

### 1.5 注册门槛

- 一个邮箱只能绑一个号；**多号允许但须不同邮箱**，且号之间禁止互动（互 clap/评论）。【官方明文+社区经验】来源：[Blogging Guide](https://bloggingguide.com/multiple-medium-accounts/)、[Medium Help](https://help.medium.com/hc/en-us/articles/360024580253)
- 无强制手机验证的报道；注册仅需邮箱或 Google/Apple SSO。【社区经验】
- IP 风控：无官方明文，但本次实测 curl 直抓正文即被反爬拦截；VPN/机房 IP 注册可能触发风控属一般性推断（非 Medium 特有证据）。印度 2025 年出现 ISP 级访问屏蔽（非账号限制）。【实测+社区经验】

---

## 二、Quora

### 2.1 2026 现状：排名机制 / 变现计划 / Spaces

- **Partner Program 已死**：英文版 2022-09-01 关闭（[TechCrunch](https://techcrunch.com/2022/08/18/quora-shutting-down-english-version-partner-program/)），全语言 2023-03-24 终止（[官方 FAQ](https://help.quora.com/hc/en-us/articles/360000673263-Partner-Program-Frequently-Asked-Questions)）。替代品 Quora+ 订阅分成、Space 订阅、广告分成也于 **2024-11-18 全部关闭**——2025 年起 Quora 上没有任何创作者直接变现渠道。【官方明文+社区经验】
- **注意：用户问的 "BEP / Boost Entry Program" 在 Quora 上不存在**——"Boost" 是 **Medium** 的分发计划（见 §1.1）。Quora 侧没有等价物；2024 年底结束的是 Quora+/Space 变现。【调研结论，多轮检索无果】
- **回答排名机制**：upvote/downvote + 作者历史回答质量记录 + 参与信号（views/shares）；作弊投票被算法过滤；有良好记录的作者新回答有初始加权。credits 系统多年前已废。【社区经验，与 Quora 员工在站内讨论一致】
  - 来源：[How does the ranking of answers on Quora work?](https://www.quora.com/How-does-the-ranking-of-answers-on-Quora-work)、[G2 Guide](https://learn.g2.com/what-is-quora)
- **Poe AI 回答被置顶**在问题页顶部，压低真人回答——社区强烈不满，但官方持续推进（公司战略重心已转向 Poe，Forbes 2024 报道 D'Angelo 把未来押在 Poe 上）。【实测数据+社区经验】
  - 来源：[Forbes: Inside Quora's Quest for Relevance](https://www.forbes.com/sites/richardnieva/2024/05/20/quora-adam-dangelo-poe/)、[Quora 站内抱怨帖](https://www.quora.com/Why-are-Poe-A-I-s-answers-often-at-the-top-of-the-question-pages-even-though-I-want-more-human-answers-first)
- **平台质量滑坡**：AI 生成回答占比从 2020 年 3.06% 升到 2024 年 10.94%（Originality.ai，[研究](https://originality.ai/blog/ai-quora-answers-study)）；2026-07 用户报告"AI slop 激增"。这反而意味着：**真人、有经验的回答在劣币环境中更容易出头**。【实测数据】
- **Spaces 功能存活但无变现**：admin/contributor/moderator 结构保留，纯社区功能。【社区经验】

### 2.2 带链接回答政策

- **明文红线**：自我推广链接归为 spam；**affiliate 链接任何形式全禁**（封号级）。【社区经验+Quora 站内政策讨论，多源一致】
  - 来源：[Is it okay to include links in my answers?](https://www.quora.com/Is-it-okay-to-include-links-in-my-answers-on-Quora?no_redirect=1)
- **折叠机制（自动审核）**：带外链的回答被自动折叠的案例大量存在——同一账号带链回答被折、不带链回答存活。折叠不影响账号但让回答从问题页消失=白干。形式要求：链接必须**直接回答问题**（问题问"有什么好的 X 推荐"时给链远比硬塞安全）、账号有回答历史与 upvote 记录、新号先答 10-20 个无链问题养权重。【社区经验，多源一致】
  - 来源：[Answers collapsed without warning](https://www.quora.com/I-keep-on-getting-Answer-collapsed-by-Quora-Moderation-without-warning-just-six-minutes-after-I-posted-my-answer-where-my-answer-complies-with-policies-and-isnt-too-short-How-do-I-fix-this)、[Crowdo: Quora Backlinks 2026](https://crowdo.net/blog/link-building-on-quora)、[yannickveys 申诉指南](https://yannickveys.com/quora/how-to-successfully-appeal-a-quora-policy-violation/)（affiliate/硬广申诉无效）
- **外链属性：全站 nofollow**，与 Medium 相同。Quora 的价值=referral 流量+品牌暴露+AIO 引用，不是 link equity。【实测数据，多源一致】
  - 来源：[LinkedIn 2025 Guide](https://www.linkedin.com/pulse/quora-link-building-step-by-step-guide-2025-abhinav-puri-fjlxc)、[diib](https://diib.com/learn/does-quora-help-seo/)

### 2.3 Google SERP 表现

- **论坛/UGC 整体在 SERP 上升期**：Reddit 视见度 +190%（部分指标 +1274 点），社区实测 Reddit +78%。Quora 同步受益但幅度小得多。【实测数据】来源：[Single Grain: Forum SEO](https://www.singlegrain.com/seo/forum-seo/)、[WebmasterWorld](https://www.webmasterworld.com/google/5109170.htm)
- **Quora 的份额被 Reddit 挤压+重构**：7100 万个 Quora 排名词中约 2200 万被移入 Google 专门的 "Discussions & Forums" SERP 模块——不是消失，是**换了个更差的展示位**（模块折叠、点击率低于标准 organic）。【实测数据】来源：[r/SEO: Reddit and Quora rankings coming down](https://www.reddit.com/r/SEO/comments/1dnmd66/reddit_and_quora_rankings_are_coming_down_in_serps/)
- 实操含义：Quora 回答能排上词（尤其长尾问句词），但拿到的展示是 D&F 模块位，点击率天然打折。

### 2.4 AI 引用频率（Quora 的核心价值所在）

- **Google AI Overviews：Quora 是被引第一多的域名**（Reddit 第二）——Semrush 千万级关键词研究结论，Quora Business 官方页面自己也在宣传这个。【实测数据】
  - 来源：[Semrush AI Overviews Study](https://www.semrush.com/blog/semrush-ai-overviews-study/)、[Quora Business 官方页](https://business.quora.com/lp/semrush-research-shows-quora-cited-most-in-google-ai-overviews/)
- **Google AI Mode：Quora 出现在 7.25% 的回答中，第 4 被引域名**（278,279 条回答、20,189 次引用、26K Quora URL 数据集）。【实测数据】
  - 来源：[Semrush: We Analyzed 26K Quora URLs Cited in Google AI Mode](https://www.semrush.com/blog/quora-google-ai-mode-research/)（Yahoo Finance 转载确认第 4 位）
- **但趋势在收缩**：Semrush 7-10 月追踪显示 Quora 与 Medium、LinkedIn 并列 Google AI Mode "最大下滑者"，而 YouTube/Reddit/Facebook 增长最大。即：**存量地位仍高（第 4），边际在恶化**。【实测数据】来源：[Semrush Most-Cited Domains](https://www.semrush.com/blog/most-cited-domains-ai/)
- ChatGPT/Perplexity：Quora 不在头部（ChatGPT 头部=Wikipedia/Medium/Forbes/LinkedIn；Perplexity 头部=Reddit 46.5%）。间接效应存在：在 Reddit/Quora 被大量提及的域名，被 ChatGPT 引用的几率高 4 倍（r/seogrowth 报告）。【实测数据】来源：[r/seogrowth 报告帖](https://www.reddit.com/r/seogrowth/comments/1p5hzmi/what_actually_gets_you_cited_by_chatgpt_we/)

**结论：Quora 的 GEO 价值集中在 Google 生态（AI Overviews #1 + AI Mode #4），对 Perplexity/ChatGPT 几乎为零。**

### 2.5 注册门槛与养号

- 注册无强制手机验证的官方明文；但 2026 年第三方防关联浏览器厂商（GoLogin/BitBrowser）专门出 Quora 封号申诉指南，说明**风控/自动封禁强度在上升**（AI 触发的误封、edit-blocked 账号常见）。【社区经验】来源：[GoLogin 2026 申诉指南](https://gologin.com/blog/quora-account-suspended/)、[BitBrowser](https://www.bitbrowser.net/blog/quora-account-suspended)
- 新号行为阈值：一天数十条回答会触发限制（bettermarketing 案例列明的 5 种作死行为之一）；不存在"每周必须答 20 题"之类的强制配额（社区澄清）。【社区经验】
- 养号共识：新号前 1-2 周只答无链问题（每天 2-5 条，真人画像），积累 upvote 与回答历史后再带链；带链回答占比控制在 1/5-1/3 以下；同 IP 多号有连坐风险（防关联厂商的核心卖点即此）。【社区经验】
- Poe 回答会插进问题页，但 Poe 内容与你的真人回答不冲突——反而是真人回答的稀缺性在上升。

---

## 三、对比结论与首月投入建议

### 3.1 两平台价值结构对照

| 维度 | Medium | Quora |
|---|---|---|
| 外链 link equity | ❌ 全站 nofollow，不传权重 | ❌ 全站 nofollow，不传权重 |
| Google 长尾流量 | 中（子页 DA94 有排名，但受 zero-click 大势拖累） | 中（能排长尾问句词，但多落入 Discussions & Forums 模块位，CTR 打折） |
| AI 引用主战场 | **ChatGPT top-5 且上升期**；AI Mode 下滑；Perplexity 无 | **AI Overviews 第 1 + AI Mode 第 4（7.25%）**但边际收缩；ChatGPT/Perplexity 无 |
| 存活难度 | 低-中（一方推广官方明文允许；红线是纯导流文/剪裁文/重复文） | 中-高（自动折叠带链回答；affiliate 全禁；新号需 1-2 周养号） |
| 单件成本 | 高（800-1500 词长文） | 低（150-400 词回答） |
| 见效周期 | 慢（索引+被引需数周） | 快（回答即上线，长尾词当周可见） |
| 变现/平台势能 | 平台分发收紧但 AI 引用上升 | 平台整体萎缩（变现全关/Poe 置顶/AI slop），但 AIO 存量地位第 1 |

### 3.2 首月投入建议——cushionmill.com（B2C 定制，DA1）

**建议配比：Medium 60% / Quora 40%（以每周产出件数计：Medium 2-3 篇 + Quora 5-8 答）**

- **Medium 主攻（GEO + 品牌层）**：
  - 专号（品牌名真人画像），首月 8-12 篇，全部不进付费墙；
  - 内容 = 靠垫定制相关的独立选题（选料/工艺/尺寸/how-to-choose 类），每篇可完整读完（禁止剪裁文），每篇 1-2 条链自然指向 cushionmill 对应品类页（/custom-{type}-cushions/ 语义页是天然链接落点）；
  - 目标回报形态：**ChatGPT 引用**（Medium 正处 ChatGPT 引用上升期，消费品类"how to choose/best X"调研词是 ChatGPT 高频场景）+ 品牌名被 AI 训练语料收录。**不要计入外链 KPI**（nofollow）。
- **Quora 副攻（AIO 占位 + 长尾 referral）**：
  - 第 1-2 周养号：每天 2-3 条无链回答（家居/软装/宠物相关真人经验向），积累 upvote；
  - 第 3 周起每周 2-3 条带链回答，只答"求推荐/怎么选"型问题（链接相关性最高、折叠风险最低），affiliate 思维严禁；
  - 目标回报形态：**AI Overviews 引用**（Quora 是 AIO 第 1 被引域，B2C 消费问答词覆盖最广）+ 零星 referral。AI Mode 上的 Quora 引用在收缩——把它当作 AIO 渠道而非全 AI 渠道。
- **两平台共同的正确预期**：首月没有可测量的 SEO 权重回报；第 2-3 个月开始看的指标是品牌词出现在 AI 回答里的频率（可用知识库既有 AI 搜索 Prompt 执行库跑品牌引用检查）。

### 3.3 B2B 工业站适配调整

- 配比改为 **Medium 70% / Quora 30%**：B2B 工业词（工艺/选型/故障排除）是 ChatGPT 调研型查询的主场，Medium 长文承载技术细节的能力远强于 Quora 问答；Quora 上工业垂直问题池浅，但竞争者也少——优先答"X vs Y 选型"和"为什么我的 X 会 Y"类已有流量的问题，宁缺毋滥。
- B2B 的 Medium 文章更要走"技术增量"路线（与站内文章差异化选题，不重复站内内容），因为 B2B 采购调研者会拿 ChatGPT 问深度技术问题——这正是 Medium 被引上升的红利区。

### 3.4 风险清单（两平台共用）

1. 任何账号被平台封禁后开新号会被持续追杀（Medium 明文），所以**号比内容贵**，宁可慢不可激进；
2. 两平台链接全是 nofollow——若主会话目标是"DA 提升"，这两个平台都不是手段，应走 RankerX/客座博文等既定外链线，Medium/Quora 只服务 GEO+referral；
3. Quora AI Mode 引用率在下滑、Medium AI Mode 同样下滑——**两者共同的确定性窗口在 ChatGPT（Medium）和 AI Overviews（Quora）**，验证动作应分别对着这两个引擎做。

---

## 附：核心来源索引

**官方明文**
- [Medium Rules](https://help.medium.com/hc/en-us/articles/213477928-Medium-Rules)（2026-09 抓取全文）
- [Medium 自定义域名设置](https://help.medium.com/hc/en-us/articles/115003053487-Setting-up-a-custom-domain-for-your-profile-or-publication)
- [Quora Partner Program FAQ（终止公告）](https://help.quora.com/hc/en-us/articles/360000673263-Partner-Program-Frequently-Asked-Questions)
- [Google 2019 nofollow 变 hint 公告](https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify)

**实测数据**
- [Semrush: The Most-Cited Domains in AI（2025-11-10，7-10月数据）](https://www.semrush.com/blog/most-cited-domains-ai/)
- [Semrush: Quora in Google AI Mode（278K 回答/26K URL）](https://www.semrush.com/blog/quora-google-ai-mode-research/)
- [Semrush AI Overviews Study](https://www.semrush.com/blog/semrush-ai-overviews-study/)
- [Originality.ai: AI 生成 Quora 回答研究](https://originality.ai/blog/ai-quora-answers-study)
- [TechCrunch: Quora 关闭英文 Partner Program（2022-08-18）](https://techcrunch.com/2022/08/18/quora-shutting-down-english-version-partner-program/)

**社区经验**
- [r/SEO: Reddit and Quora rankings coming down](https://www.reddit.com/r/SEO/comments/1dnmd66/reddit_and_quora_rankings_are_coming_down_in_serps/)
- [Crowdo: Quora Link Building 2026](https://crowdo.net/blog/link-building-on-quora)
- [Medium 封号案例（Vocal）](https://vocal.media/writers/medium-suspended-my-account-with-1-4-k-followers-and-376-stories-here-s-the-shocking-reason-why)
- [Medium Boost is Dead（2025-01）](https://lindac.substack.com/p/medium-boost-is-dead-medium-isnt)
- [GoLogin: Quora 封号申诉 2026](https://gologin.com/blog/quora-account-suspended/)
