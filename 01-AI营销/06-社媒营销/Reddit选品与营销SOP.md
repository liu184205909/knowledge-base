# Reddit 选品与营销 SOP v1.0

> **落点**（2026-10-09）：自 01-竞品研究 迁入 06-社媒营销（Reddit 获客运营属社媒线，非竞研三级架构；竞品SOP §5b VOC 的站外对照视角仍可引用本文）。
> **读者**：主要=Claude（按本 SOP 执行 Reddit 挖掘与回复运营），次要=人（审核回复草稿）。
> **双用途**：①**选品发现**——Reddit 是未过滤的真实用户语言（VOC 原始矿），痛点/购买条件/竞品不满全以用户原话存在；②**品牌提及**——合规回复=第三方真实提及=GEO 资产（§4.6）。
> **与其他文档关系**：《竞品分析SOP》的 VOC 补充源（§5b 差评 VOC 的站外对照）；GEO 实施文（05/08）"真实品牌提及"信号的执行通道之一。
> **Reddit 全家桶互指**（本 SOP=流程框架，其他三件=执行工具/战略层）：
> - **技术参考** → `02-自动化工具库/06-用户洞察工具/Reddit的JSON功法.md`（JSON API 端点/参数/代码模板——本文 §3 技术通道的深度参考）
> - **采集工具** → `02-自动化工具库/06-用户洞察工具/reddit_comment_collector.py`（批量采集脚本，输入搜索词→输出 CSV，可直接跑 §1 五帖法）
> - **GEO 战略层** → `05-外链资产库/01-Reddit-AI可见度GEO战略指南.md`（Reddit=AI 引用基础设施的宏观框架/品牌植入技巧/量化追踪——本文 §4 Engagement 的战略依据）
> - **Cushion Mill 日执行** → `Reddit每日获客工作流.md`（靠垫项目落地版：30 购买意向词表/15 分钟双轨道流程/3 回复模板/内容信号台账——本文 §1§3§4 的执行层应用，含 2026-09-29 通道二次实测）
> **版本**：v1.0（2026-09-29 首建。五帖法=用户原始方法论如实记录；技术通道状态为当日实测，含 JSON API 403 实况）。

## 0. 铁律（每轮执行前过一遍）

1. **五帖法先行**：先明确要挖哪类信号（§1），再选工具——信号类型决定搜索词构造，不由工具倒推
2. **Reddit 只是发现层**：任何"发现"须走完 §2 四步验证才能进立项；单帖孤证 ≠ 需求
3. **用户原话 > agent 转述**：引用帖子标题/正文/高赞评论原句入档，不凭印象总结
4. **通道降级链固定**：JSON API（IP 敏感，403 先换出口节点）→ web-reader MCP → web-access CDP；通道状态会漂移，开工前先探针实测（同 MCP 可见性纪律）
5. **先有用再推广**：回复以回答问题/给建议为主体，产品只在"本地找不到/想比价"语境出现；身份披露优于伪装
6. **频率红线**：每天 1-2 条有质量回复，禁批量发；新号先养 2-4 周

## 1. 五帖法（选品信号挖掘，用户原始方法论）

| # | 帖型 | 搜索词构造 | 信号价值 | 产出 |
|---|------|-----------|---------|------|
| 1 | **抱怨帖** | `{product} + problem / hate / annoying / frustrated / disappointed` | 痛点原话——用户对现有产品最真实的不满 | 痛点清单（进落地页文案/FAQ） |
| 2 | **求推荐帖** | `{product} + looking for / recommendations / anyone know / where to buy` | **购买条件**——预算、尺寸约束、场景、时间要求全部显式写在帖里 | 购买条件表（进产品配置维度/定价） |
| 3 | **替代品帖** | `alternative to {product/brand} / better than {brand}` | 旧方案不满 + 需求仍在 = 替换窗口打开 | 竞品弱点对照表 |
| 4 | **怎么解决帖** | `how do you deal with {problem} / workaround / DIY {product}` | 用户的拼凑方案 = 现有产品的缺口（拼凑得越费劲，付费意愿越强） | 缺口机会（"他们还在用毛巾垫"级信号） |
| 5 | **跨帖反复出现** | 同一痛点在**不同 sub、不同时间**重复出现（≥3 帖） | 需求验证——跨帖跨时间是防孤证的核心过滤器 | 立项候选（进入 §2 验证） |

**用法要点**：
- 帖 1-4 各自独立搜索；帖 5 不是搜索词而是一个**判定动作**——把 1-4 收集的痛点去重后回查出现频次
- 五帖法产出同时喂选品与内容：用户原话直接进落地页文案（比 agent 编的文案可信度高一个量级）
- 高赞评论 ≥ 帖子正文权重：点赞数 = 社区共鸣度投票

## 2. 完整验证流程（四步，缺一不立项）

```
Reddit 发现 ──→ Amazon 看真实购买 ──→ Google Trends 看长期需求 ──→ 算毛利/广告/供应链
 (五帖法)        (需求已被付费验证?)      (趋势还是一年的事?)         (生意成立吗?)
```

| 步 | 看什么 | 工具/口径 | 通过标准 |
|----|--------|----------|---------|
| 1 | Reddit 信号 | §1 五帖法 | 同一痛点跨 sub 跨时间 ≥3 帖 |
| 2 | 真实购买验证 | Amazon 同品类：评论量级、星级分布、**差评内容**（与 Reddit 痛点交叉对照） | 有人持续在付费；差评痛点与 Reddit 信号重合=双重确认 |
| 3 | 长期需求 | Google Trends 5 年窗口 | 平稳或上升；纯当季尖峰按节令线纪律处理（新站吃不到当季峰值） |
| 4 | 生意测算 | 售价−成本（含物流）/ 竞对 CPC / 供应链（1688/工厂起订与交期） | 毛利与供应链可行性同时过关，才进立项流程 |

## 3. 技术通道

### 3.1 Reddit JSON API（首选形态；**出口 IP 敏感，状态须实测**）

**URL 规则**（Reddit 长期公开行为，任一页面 URL 加 `.json` 即返回结构化数据）：

```
# 全站搜索（近一月新帖）
https://www.reddit.com/search.json?q={query}&sort=new&t=month&limit=25

# 子版内搜索（更精准，运营监控主用）
https://www.reddit.com/r/{sub}/search.json?q={query}&restrict_sr=on&sort=new&limit=25

# 帖子 + 全部评论（返回 [帖子listing, 评论listing] 两元素数组）
https://www.reddit.com/r/{sub}/comments/{id}/{slug}/.json
```

**参数速查**：`sort=new|top|relevance|comments`｜`t=hour|day|week|month|year|all`（配 sort=top 用）｜`limit`≤100｜翻页用返回体里的 `after` fullname。

**curl（UA 是硬要求，默认 curl UA 直接 403）**：

```bash
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  "https://www.reddit.com/r/BuyItForLife/search.json?q=bench+cushion&restrict_sr=on&sort=new&t=year&limit=25"
```

**Python 批量监控模板**：

```python
import requests, time

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
# 注：UA 也可用识别度更好的脚本式标识 "my-research-script/1.0 (by u/你的账号)"，
# Reddit 官方推荐脚本带可联系标识；但实测当前出口两种 UA 均拦（见下）

def search(sub, query, sort="new", t="year", limit=50):
    url = f"https://www.reddit.com/r/{sub}/search.json"
    r = requests.get(url, params={"q": query, "restrict_sr": "on",
                                  "sort": sort, "t": t, "limit": limit},
                     headers=UA, timeout=30)
    r.raise_for_status()
    return [c["data"] for c in r.json()["data"]["children"]]

# 信号词过滤：抱怨/求推荐帖优先
PAIN = ["problem", "hate", "annoying", "frustrated", "disappointed", "fell apart", "flat"]
REC  = ["looking for", "recommendation", "anyone know", "where to buy", "custom"]

def monitor(subs, queries):
    hits = []
    for sub in subs:
        for q in queries:
            for post in search(sub, q):
                blob = (post["title"] + " " + post.get("selftext", "")).lower()
                tag = "pain" if any(w in blob for w in PAIN) else \
                      "rec"   if any(w in blob for w in REC)  else "watch"
                if tag != "watch":
                    hits.append({"tag": tag, "sub": sub, "title": post["title"],
                                 "url": "https://reddit.com" + post["permalink"],
                                 "created": post["created_utc"], "score": post["score"]})
            time.sleep(2)   # 匿名配额低，≥2s 间隔防触发拦截
    return sorted(hits, key=lambda h: (-h["score"]))
```

**评论树解析**：帖子 `.json` 返回两元素数组——`[0]` 帖子，`[1]` 评论森林；评论在 `data.children[].data.replies.data.children` 递归嵌套（无回复时 `replies == ""`）。

**⚠ 实测状态（2026-09-29，本机出口，持续复核）**：
- `www.reddit.com/*.json` 匿名请求 → **403 "blocked by network security"**（浏览器 UA + `Accept: application/json` 均拦）
- `old.reddit.com/*.json` → 302 跳登录页
- 判定：**出口 IP 级拦截**（代理节点被 Reddit 风控标记），非 API 形态废弃——换出口节点可能即恢复。403 处理顺序：**换代理节点重试 → §3.2 webReader → §3.3 CDP**
- 即使通了也守频率纪律（≥2s 间隔、单轮 ≤50 请求）；连坐风险：同出口高频请求会把整个节点拉黑

### 3.2 web-reader MCP（⚠ 两轮实测状态相反，用前必探针）

- 一次一 URL，返回 Markdown 正文+全部评论（含楼中楼与楼主回复）
- **适合**：单帖深读——回帖前必读全楼（避免重复别人已给的推荐/撞已经提过的店）；五帖法的帖 5 逐帖人工判读
- **实测记录**：2026-09-29 第一轮 ✅ 读 r/longisland 靠垫帖（1wqxp0q）正文+5 评论全拿到；**同日第二轮 ❌ 已死**（读帖也返回 blocked by network security，见 cushionmill 工作流 §1 表）——通道状态漂移快，**开工前必探针实测**，死了按降级链走 §3.3
- **不适合**：批量搜索扫描（无搜索语义，只能喂具体帖子 URL）；列表页结果可能不全

### 3.3 web-access skill（CDP 真实浏览器）

- 适用：①JSON API + webReader 双降级后的兜底浏览 ②需要登录态的操作（发帖/回帖/养号只能走这里）③需要翻页/交互的列表页
- Reddit 反自动化检测较严（滚动行为/访问频率/登录风控）——**能用 JSON API 就不用 CDP**
- 养号与发回复的操作全部走 CDP，控制节奏模拟真人
- **2026-09-29 二次实测（JSON API 403 环境下）**：CDP 开 `reddit.com/search/?q="精确短语"&type=posts&sort=new&t=week` 搜索页**为当期主通道**——无拦截、无登录墙、55 帖/页；eval 用 `a[href*="/comments/"]` 提取（shreddit-post 选择器在搜索页不命中）。三条搜索铁律（引号短语/OR 不生效/长尾放宽 t=month）与提取脚本模板见《Reddit每日获客工作流》§1

### 3.4 不推荐 / 备而不用

| 通道 | 状态 | 说明 |
|------|------|------|
| Pushshift API | ❌ 已限制 | 2023 起仅对 mod/审批应用开放，历史帖批量回溯场景曾主力，现放弃 |
| PullPush API（pushshift 社区后继） | ⚠️ 初筛辅助 | 2026-09-29 实测通：`api.pullpush.io/reddit/search/submission/?q="短语"&after={unix秒}&size=25`（`after` 只收 unix 秒，`7d` 写法报错）。**索引覆盖不全**（同窗口 CDP 7 帖仅回 2 帖）——只作 agent 批量初筛，结果须 CDP 复核 |
| Reddit 官方 OAuth API | ⏸ 备而不用 | 需注册 app（免费，100 QPM 匿名级 OAuth 额度其实够用）；注册+token 管理有成本，等 JSON API 确认长期死亡再启用。真要日级稳定监控时这是正路 |

## 4. Engagement 策略（回复运营）

### 4.1 账号准备：先养号

- 新号**先养 2-4 周**：正常发评论/帖子积累 karma，参与目标 sub 的日常讨论——禁止新号直接推广
- Reddit 社区对低 karma 推广账号极敏感；通行 **9:1 惯例**（约 9 成普通参与 : 1 成涉及自家）——非官方规则但被各 sub 普遍执行
- 账号发帖历史=可信度；被一个 sub ban 会留下公开记录，污染账号

### 4.2 回复原则：先有用再推广

- 主体是**回答问题/给建议/分享经验**——一条回复删掉产品名仍然有价值，才算合格
- 产品提及放"**如果本地找不到合适的 / 想比价**"语境，作为选项之一而非答案本身
- **【2026-09-30 用户定案·改顾客口吻话术】**品牌以顾客视角带出（'I've bought from one called X' 类），不再用 'we run a shop' 自营披露——本条原"身份披露优于伪装"原则已由 Cushion Mill 项目实操覆盖，通用场景仍可参考但执行以顾客口吻为准
- 禁营销词汇：amazing / perfect / check out / game-changer 一类；语气=懂行的热心人，不是官方客服

### 4.3 子版规则：发前必读

- 每个 subreddit 有自己的 self-promotion 规则（sidebar / Rules / Wiki），**发前必读**
- 本地社区（r/longisland 类）通常更严格——推荐本地商家欢迎，外地/在线商家易被删
- 首次进入一个 sub：先看最近被删/被怼的推广帖长什么样（避坑样本）

### 4.4 频率

- 每天 1-2 条（铁律 6，宁可少发）；不同 sub 间隔开，禁同小时多 sub 同模板

### 4.5 目标子版清单（靠垫相关，随运营补充）

| 子版 | 相关性 |
|------|--------|
| r/BuyItForLife | 耐用品心智——定制垫"用十年"卖点对位 |
| r/HomeImprovement | 家装改造场景，飘窗/窗座/长凳高频 |
| r/furniture | 家具本体讨论 |
| r/PatioDesign | 户外家具+定制坐垫需求 |
| r/InteriorDesign | 设计向，内容合作潜力 |
| r/Costco | 户外家具讨论多——买标准尺寸后不合适的转化人群 |
| 本地子版（r/longisland 等） | 求本地定制匠人帖密集——"本地+比价"回复模式主场（§案例：1wqxp0q） |

### 4.6 核心纪律：Reddit 回复 = GEO 资产

Google 官方 GEO 指南明确**"真实品牌提及"是 AI 引用信号**。Reddit 回复 = 第三方语境下的品牌提及 = GEO 资产，且 Reddit 内容被 Google 高量收录、常进 AI Overview 引用源。每条合规回复的价值=**直接 referral 流量 + AI 引用资产**双重；被删的垃圾回复两个价值都是零——这就是"先有用再推广"的量化理由。

## 5. 监控体系

| 层级 | 做法 | 触发 |
|------|------|------|
| 手动 | 每天/每周用 §3.1 搜索 URL 跑一轮关键词，人工过结果 | 冷启动期（词组少） |
| 半自动 | §3.1 Python 模板：批量搜索 + PAIN/REC 信号词过滤 + 按 score 排序 | 词组 ≥3×子版 ≥3 时固化脚本（落 `02-自动化工具库/`） |
| 工具化 | skill 或 MCP 封装（搜索→过滤→打分→输出待回复队列） | 半自动脚本稳定跑 2 周后再考虑，不为工具而工具 |

**监控词组基线（靠垫项目，运营中扩充）**：
- 抱怨族：`cushion fell apart` / `bench cushion flat` / `outdoor cushion faded`
- 求推荐族：`custom bench cushion` / `bay window cushion` / `odd shape cushion` / `replacement cushions` + `looking for / anyone know / where to get`
- 替代族：`alternative to {竞品垫品牌}` / `better than Sunbrella`

**待回复队列字段**：帖子 URL｜sub｜信号类型（pain/rec/alt）｜发帖时间（>3 天且楼主已选定方案则降权）｜楼主活跃度（逐条回复过评论的=高意向，如 §案例）｜建议回复角度。

## 6. 案例存档

- **2026-09-29｜r/longisland 1wqxp0q（custom bench cushion maker）**：Nassau County 楼主为飘窗异形长凳求本地定制，5 条评论全推荐本地店（船垫翻新/diamondupholstery/Sewzeal/Mells Karon/Calico Corner），楼主逐条热情回复=高意向活跃帖。回复策略：认可本地推荐（尤其船垫翻新思路）→ 补异形测量要点（最长/最宽处+厚度）→ 披露身份给比价选项。草稿见当次会话（不入库）。
