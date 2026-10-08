# Pinterest 运营自动化工具生态调研（为 cushionmill.com 选型）

> 调研日期：2026-10-06 | 方法：WebSearch + GitHub/npm API + 官方文档/社区交叉验证
> 我方条件：Claude Code agent + CDP 浏览器（Chrome 已登录商业账户）+ WP 站 160 product 图 + 文章图
> 需求：发 pin / 板管理 / 定时 / 数据（impression、outbound click）/ 批量

---

## TL;DR 三路线对比

| 路线 | 一句话定位 | 成本 | 接入难度 | 核心风险/限制 |
|---|---|---|---|---|
| **A. 官方 API v5 + agent 脚本** | 合规天花板，能力全（发 pin/板/analytics 全有），一次性过审核后零边际成本 | $0 | 中（要过 Standard 审核：录 OAuth 视频 demo，1~数周） | 审核有门槛；无原生"定时"参数（需自己 cron） |
| **B. 开源（MCP/Selenium/插件）** | MCP 封装层已现成（star 均个位数~40）；Selenium 类违反 ToS | $0 | 低~中 | 浏览器自动化 = 明确封号风险；小项目维护不确定 |
| **C. SaaS（Buffer/Tailwind 等）** | 免费用 Buffer（10 帖队列），Pinterest 专精用 Tailwind（$17.99+/mo） | $0~$30/mo | 极低 | 免费档量太小；批量+数据回读受限于厂商面板 |

**首推：A（官方 API v5 + agent 直写 Python 脚本），过渡期用 Buffer 免费档或 Pinterest 网页端原生定时。**
**CDP 浏览器只用于"看"（竞品板研究/趋势），绝不用于"发"（发 = 封号风险，见 §1.4）。**

---

## 1. 官方通道：Pinterest API v5（2026 现状）

### 1.1 权限层级（关键门槛）

| | Trial access | Standard access |
|---|---|---|
| 读端点（boards/pins/analytics） | ✅ 可用 | ✅ |
| 写端点（POST /v5/pins 等） | 仅沙盒（pin 只有自己可见，公众不可见） | ✅ 生产可用 |
| 申请方式 | 注册 app 后自动/约 3 个工作日 | 需提交**视频 demo** |
| 真实审核时长 | ~3 天 | 官方称"每工作日审"，社区实测 **1 周~数周不等**，有长期 pending 案例 |

**Standard 被拒的两大原因**（Pinterest 社区版主原话，2025-11）：
1. demo 视频没有展示 Pinterest 集成（只拍了自家产品）
2. demo 没有展示**完整 OAuth 流程**（从跳转授权到回调拿 token 全程）

申请要点：demo 保持简单、展示正当商业用途、**避免任何像 mass-posting/spam 的行为**。

账户要求：**必须 Pinterest Business 账户**（我们已满足）+ 在 developers.pinterest.com 注册 app + OAuth 2.0。所需 scopes：`pins:read` `pins:write` `boards:read` `boards:write` `user_accounts:read`。

### 1.2 速率限制（各来源口径）

| 来源 | 数字 |
|---|---|
| PostZen（标准档） | 100 writes/min/user，1,000 reads/min |
| Blotato 2026 指南 | pin 创建端点 ~30 req/min |
| PostEverywhere | ~300 req/min，1,000 writes/天，批量需排队 |
| clugtu/pinterest-mcp README（保守值） | 10 pins/min，250 pins/天 |

结论：口径不一但**量级远超我们需求**（3-5 pins/天起步，哪怕 200 pins/周也碰不到顶）。写脚本时按"间隔 6s+ 每日 ≤250"做节流即可绝对安全。

### 1.3 能力面（对我们需求的覆盖）

| 需求 | 官方端点 | 状态 |
|---|---|---|
| 发 pin（图+标题+描述+链接） | POST /v5/pins（配 POST /v5/media 先传图拿 media_id） | ✅ |
| 板管理 | /v5/boards CRUD + board sections | ✅ |
| 数据：impression/outbound click | GET /v5/pins/{id}/analytics + /v5/user_account/analytics（指标含 impressions、saves、pin_clicks、**outbound_clicks**） | ✅ 官方原生 |
| 批量 | 无原生 bulk 端点，循环调 /pins 即可（节流） | ✅（自实现） |
| 定时 | **无原生 scheduled_at 参数**（推断：PostOnce 等托管服务的 publish_at 是自家队列，非 API 原生）。方案 = agent 侧 cron/计划任务；或先存草稿 | ⚠️ 自建 |
| 关键词/趋势 | GET /v5/trends/keywords/{region}（热门搜索） | ✅ 附赠 |

媒体上传：图片直接 base64 进 /pins 或走 /media；**视频**是异步流（上传→轮询处理状态→创建 pin），我们图片为主暂不需要。

### 1.4 ToS 红线（决定 CDP 不能用来发）

- Pinterest Business ToS（2025-04-30 更新）：禁止"以未授权方式 scrape/collect/访问 Pinterest 数据"
- Developer Guidelines：禁止绕过 Pinterest 同意机制；禁止做"用户未逐条考虑就自动发起动作"的功能（= 自动化要留人工/agent 审查关口）
- 多家 2026 指南一致：**模拟浏览器点击/headless 脚本/账密登录型工具 = 真实封号风险（永久 suspension）**；OAuth 走官方 API = 安全
- postoncehq（商业 MCP 厂商）README 直接点名："GitHub 上许多 Pinterest MCP 驱动登录态浏览器会话或非官方抓包 API，违反 Pinterest 条款，会被限制账号"

→ **结论：我们有 CDP 是优势，但用在 Pinterest 上只能做只读研究（看竞品板/看趋势页），发布动作必须走官方 API。** 这与"读用浏览器、写用 API"的通用合规口径一致。

---

## 2. GitHub 开源生态（2026-10 实测 star/活跃度）

### 2.1 MCP server 封装（对接官方 API，值得参考）

| 项目 | star | 最近更新 | 能力 | 评估 |
|---|---|---|---|---|
| **clugtu/pinterest-mcp**（PyPI `pinterest-mcp`） | 4 | 2026-03 | create/update/delete_pin、**bulk_create_pins（自带节流）**、pin/account analytics、board CRUD、search_pins、**get_trending**；OAuth CLI（`pinterest-mcp-auth`） | 功能面最全且与官方 API 对齐；项目小，代码量少可审计。**参考其端点映射与节流实现** |
| **aymandakirgh/pinterest-mcp**（npm `pinterest-mcp` v0.3.0） | — | 2026-09-11 | v5 全覆盖：boards/pins/analytics/search/OAuth，stdio 或 HTTP | npm 侧最新；同类 |
| what-name/pinterest-mcp | 6 | 2026-03 | v5 全覆盖，托管 Cloudflare | 需托管，不合我方 |
| postoncehq/pinterest-mcp | 2 | 2026-10-05 | 发布/定时/轮播/视频 pin + **7 个 Pinterest skills**（描述生成/SEO 关键词/板命名/1000×1500 制图/blog-to-pins/内容日历） | 走 PostOnce 托管（官方 API 转手），7 天免费后收费；**skills 的 prompt 思路值得抄**，服务本身不必买 |
| terryso/mcp-pinterest | 40 | 2025-07 停更 | 搜索/下载类 | 方向不对（下载器） |
| CData pinterest-mcp-server | 5 | 2025-10 | 只读 JDBC | 无用 |

### 2.2 生产系统/管线类

| 项目 | star | 评估 |
|---|---|---|
| **EditorialOS/pinterest-marketing-strategist** | 2 | **Claude 插件**（Anthropic community marketplace 可装）。定位 = pin 生产系统而非调度器：图片库→概念生成→图文匹配→板分配→关键词→表现追踪学习回路。Pinterest API 为可选 connector。理念（"3-5 pins/day 的一致性是 Pinterest 奖励的"）与批量-审查-发布工作流与我方 article-factory 思路同构，**架构参考价值 > 直接安装价值**（绑定 Google Drive/Cloudinary） |
| mehdreaming/tiktok-to-pinterest | 23 | TikTok→AI 文案→Google Sheets 队列管线；管线思路可参考 |
| SoCloseSociety/PinterestBulkPostBot | 25 | Python+Selenium 批量发 pin，CSV 元数据，活跃（2026-06）。**典型 ToS 违规方案**，只看不装 |
| ndesv21/socialclaw | 94 | 社媒调度 CLI+skill（X/LinkedIn/IG/FB/TikTok），多平台但 Pinterest 非主力 |
| n8n 路线（SynthOperator playbook） | — | AI 生图+关键词聚类+n8n 调度；我们 agent 本身就是更强调度器，无必要引入 n8n |

### 2.3 结论

**没有值得直接安装的"成熟大项目"**——MCP 封装 star 都是个位数，本质是 v5 REST 的薄壳；Selenium 类有封号风险。v5 API 本身是极简 REST+Bearer token，**agent 直写脚本（requests，~100 行）比装一个 4★ 中间层更可控**。clugtu 的 README 可当端点清单+节流参数的参考实现来读。

---

## 3. X/Twitter 上的实践（检索受限的说明）

X 内容不被外部搜索引擎索引，site:x.com 检索为空——改用博客/案例站交叉替代，以下为社区共识数据：

- **PinBoostr 案例**（自动化前后各 30 天）：impressions 4.8K→20.07K，outbound clicks 62→515，saves 188。共识：**outbound click 是唯一值得盯的信任指标**（impression 可注水）
- **CreatorBlade 2026 playbook**：优化好的 profile 月 outbound clicks 5,000~40,000；可承受 200+ pins/周；**pin 半衰期是"月"级**（与 X 的小时级相反）→ Pinterest 内容是资产不是动态，适合我方"生产一次长期收租"模型
- **频率共识**：3-5 pins/天（EditorialOS 文档同口径）；配 human/agent 审查关口，禁盲发
- 删低效 pin 的 Make.com 自动化案例（YouTube 讨论）存在，但属于边缘玩法，Pinterest 官方态度不明，不建议

---

## 4. SaaS 备选（免费档实测口径）

| 工具 | 免费档 | 付费入口 | Pinterest 专精度 | 适合 |
|---|---|---|---|---|
| **Buffer** | 3 channels、**10 帖/频道队列**、100 ideas、30 天分析 | $6/channel/mo | 一般（多网络调度器） | **过渡期最优免费档** |
| **Tailwind** | 仅 ~5 帖/月、1 账号 | Pro $17.99/mo（年付）~$29.99/mo | 高（SmartSchedule 最佳时间、interval pinning、批量上传、Pinterest 关键词工具、AI 制 pin） | 不想碰代码时的全托管 |
| PostOnce | 7 天免费 | 订阅 | 中（MCP+skills，见 §2.1） | 不合我方 |
| Metricool | 免费档有限 | ~$22/mo | 中（表格批量上传、多账户分析） | 备选 |

判断：SaaS 的本质是把"API 调用+定时队列+面板"卖回给我们——**这三样（agent 脚本、cron、analytics 端点）我们全有且更灵活**。SaaS 唯一胜出场景 = Standard 审核期间的 1~3 周空窗，用 Buffer 免费档顶上（10 帖队列刚好够首周节奏）。

---

## 5. 图片规格与 SEO 要素（2026 最佳实践）

### 5.1 规格

| 要素 | 规范 | 来源级别 |
|---|---|---|
| Pin 尺寸 | **1000×1500 px（2:3 纵图）**，feed 满屏不裁切；更长的比例会被裁 | 官方 creative 准则确认 |
| 标题 | ≤100 字符，关键词前置 | 官方 |
| 描述 | **300-500 字符**，主关键词放最前（feed 只露开头） | 官方社区 + 多家 2026 指南 |
| Alt text | 准确描述图片+自然含主关键词（影响视觉搜索排名），禁堆砌 | 行业共识 |
| 链接 | 直达与 pin 内容/关键词**语义匹配**的落地页（产品图→产品页，教程图→文章） | 行业共识 |
| 板名 | 板名本身参与 SEO——用"可搜索的"关键词板名（custom cushions / outdoor cushion covers 类） | 行业共识 |

### 5.2 落到 cushionmill 的具体规范（160 product 图 + 文章图）

- **product 图直接可用**：WP 媒体库原图导出→批量缩放/合成到 1000×1500（白底产品图可加品牌色顶栏+文字标题模板，用 Pillow/HTML→PNG 管线，同 postonce `pin-maker` 思路）
- **一图多 pin**：同一产品图配 2-3 组不同标题/描述词组 = 独立 pin（Pinterest 视角是不同内容），配合"pin 半衰期月级"特性做长尾铺量
- **文章图**：how-to/选型指南类文章图是 Pinterest 流量主力（教程意图占搜索大头），每篇文章产 3-5 pin 链接回文
- **关键词策略**：先用官方 trends 端点（GET /v5/trends/keywords/US）+ Pinterest 搜索建议拉词，建板名+pin 描述词表（可挂到现有词库管线）
- **节奏**：3-5 pins/天起步，固定时段；每周看 outbound clicks/saves 砍弱留强

---

## 6. 推荐路线（分阶段执行）

### 阶段 0（立即，0 成本）：Buffer 免费档 + 网页端手动
- 注册 Buffer 免费档连 Pinterest 商业账户，10 帖队列手动排首周 3-5 pins/天
- 同时用 CDP（已登录态）做**只读研究**：扒竞品靠垫站的板结构/pin 文案模式（这一步 CDP 完全安全）

### 阶段 1（本周主任务）：申请官方 API
1. developers.pinterest.com 注册 app（挂 cushionmill 商业账户）→ 拿 Trial access（~3 天）
2. Trial 期间用读端点验证 token/板列表/analytics 拉取
3. **录 OAuth demo 视频**（完整授权流+一次真实 pin 创建演示，用干净的测试页面）→ 提交 Standard 申请
4. 预期 1~数周；被拒就按两大被拒原因补拍重提

### 阶段 2（Standard 到手后）：agent 自建管线（无 MCP、无 SaaS）
- Python `requests` 直调 v5 REST：token 刷新 + 媒体上传 + create_pin + analytics 拉取，~100 行
- 节流：≥6s 间隔、日 ≤250（绝对安全边际）
- 定时：Windows 计划任务/cron 调 agent 脚本，从 WP 站产品/文章 JSON 清单消费
- 内容生产沿用 article-factory 思路（参考 EditorialOS 的批次-学习回路设计）
- 数据回流：每日拉 impressions/outbound_clicks/saves 存本地 JSON，周报汇总
- **MCP 不装**：clugtu（PyPI）留作端点参考实现；若日后想要交互式调试再评估

### CDP 的最终定位
- ✅ 只读研究：竞品板、趋势页、搜索建议词（登录态可见的商业数据）
- ❌ 发布动作：封号风险，永久不做

---

## 7. 来源

**官方/一级**
- Pinterest Developers：developers.pinterest.com（API v5 文档、access tiers、rate limits）
- Pinterest Business ToS（2025-04-30）+ Developer Guidelines：policy.pinterest.com
- Pinterest 社区（审批经验/被拒原因）：community.pinterest.biz（#38889、#40244、#43906、2025-11 版主回复）

**工具/厂商文档**
- PostZen（速率口径 100 writes/min）、Blotato/PostEverywhere 2026 API 指南
- Zernio Pinterest API 教程（trial 沙盒/OAuth 视频 demo 要求）
- Tailwind 定价页 tailwindapp.com/pricing-overview；Buffer 定价（2026 多源复核）

**GitHub/npm（2026-10-06 API 实查）**
- github.com/clugtu/pinterest-mcp（PyPI pinterest-mcp）
- github.com/aymandakirgh/pinterest-mcp（npm pinterest-mcp v0.3.0）
- github.com/postoncehq/pinterest-mcp、github.com/EditorialOS/pinterest-marketing-strategist
- github.com/SoCloseSociety/PinterestBulkPostBot（ToS 反面教材）
- GitHub search：pinterest automation / pinterest mcp 全量 star 排序

**实践/案例数据**
- PinBoostr 自动化案例（4.8K→20K impr、62→515 outbound）
- CreatorBlade 2026 Pinterest automation playbook（5K-40K outbound/月、pin 半衰期月级）
- RaisePin（官方 API 合作伙伴 vs 不安全调度器判别）
- Pinterest 社区 2026-01（描述 300-500 字符、关键词前置）

*标注：速率限制各源不一（§1.2）；"API 无原生定时参数"为基于 PostOnce 文档的推断；其余关键事实均有 ≥2 独立来源交叉。*
