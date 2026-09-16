# affiliate 分发与外链操作（联盟客侧）

> **定位**：我们作为联盟客的变现操作——平台政策/链接架构/parasite 边界/Woo 推荐位。2026-09 调研入库。
> **核心架构律**：**aff 链接对 SEO 是零资产**（Google webspam 识别联盟网络参数/IP 后主动"中和"，前 webspam 工程师 Fili Wiese 口径，对拿 aff 链接做外链的站发过 manual action）→ **双层分离**：外链建设（平台内容→自己站）与变现（自己站→商户 aff）永不同层；aff 链接只在自己站上挂。

---

## 一、变现优先级（2026-09 口径）

| 层级 | 对象 | 量级 |
|---|---|---|
| **主力** | 递归佣金 SaaS（GetResponse 40-60%/ManyChat 50%/ClickFunnels 40%/HubSpot 30%×12月+180天 cookie） | 20-50% **循环**佣金 |
| 次选 | 独立品牌计划（30 天 cookie，优质 60-90 天） | 10-30% 一次 |
| 仅补充 | Amazon Associates | 多数品类 3-4%，**24h cookie**（加购后 89 天）；2026-04 OA 更新杀 halo sale（创作者收入普遍 -25%）；PA-API 2026-04-30 弃用 |
| **排除** | coupon/deal 站形态 | 浏览器扩展劫持 last-click（Honey 诉讼实证）+ zero-click SERP + 大站垄断三重挤压，2026 基本判死 |

选品公式：佣金率 × 转化率 × AOV ÷ 竞争度。词类排序：低竞争长尾 "best X for [use case]" → 对比词 X vs Y（转化最高）→ alternatives（截竞品流）。

## 二、平台政策清单（挂 aff 链接可行性，官方文档级）

| 平台 | 政策 | 操作 |
|---|---|---|
| **Medium** | 允许，必须**文内**披露（官方 Rules 明文）；未披露取消 curation 分发 | 直接可挂 |
| **Quora** | 敌对（aff 链接=spam 分类，申诉无效） | 只做漏斗：Quora 回答→自己站→aff |
| **Reddit** | 官方 10:1 纪律（1 推广配 9 贡献），多子版禁直挂，违者 shadowban | 高 karma 养号+链自己评测文 |
| **Pinterest** | 允许（官方发过 affiliate 入门文）；日更 5-15 pin 持续 3-6 月起量 | 图钉直挂可 |
| **YouTube** | 描述区+置顶评论可挂（链接进前 3 行）；**FTC 要求披露在视频内**而非仅描述 | 可挂 |
| TikTok/IG | 仅 bio | — |
| 小 Web2.0 | Substack 免费文/Steemit/SlideShare 允许 | 按需 |

## 三、parasite SEO 的 2026 边界

- **官方政策**：2024-03 Site Reputation Abuse 上线，2024-11 堵死"第一方参与"漏洞——**不论是否有第一方参与**均可能违规；目前**仅人工处罚未算法化**；Forbes Advisor/CNN Underscored/USA Today 评测板块已被降权
- **剩余价值三判据**（选 parasite 平台不再看 DR）：①索引速度 ②自带分发（Reddit/YouTube/LinkedIn 受众）③**AI 引用资格**（内容进 ChatGPT/AIO 引用池）
- **平台衰退警示**：Medium/Quora 排名能力 2026 大幅下滑；优先 Reddit > YouTube > LinkedIn > GitHub
- 风险结构：处罚落在 host 站不在投稿者（损失=时间资产蒸发，自己域名不受牵连）；页面寿命从 ~9 个月缩至 6-8 周
- 白帽/黑帽分界=**编辑控制**：有真实编辑审核=正当内容营销；零编辑批量纯商业=寄生
- 与 `05-外链资产库/02-Parasite-SEO平台资源库` 衔接：该库的平台按本节三判据复核可用性

## 四、Woo 站挂互补品 aff（零插件）

WooCommerce **原生 External/Affiliate 产品类型**：Product data 下拉选 external/affiliate → 填 Product URL+按钮文字，即以正常产品卡出现在店铺/分类页（官方文档）。批量走 CSV 的 External Product URL 列。

实操纪律：①只挂**互补品不挂替代品**（防自己品类页 cannibalization）②`rel="sponsored"`+cloaking 管理 ③FTC 披露放推荐位附近（不是页底）④这是既有 C 端 Woo 站最低成本的变现附加层（互补品 review 文+external 推荐位）

## 五、链接管理与追踪（联盟客侧工具）

- **ThirstyAffiliates Pro**（$99.60/年）：cloaking+点击追踪+**SubID/click-ID 原生传递**（商家侧报表按 SubID 分组=定位哪个页面产转化）+地理定位链接——比 Pretty Links 更适合做 aff
- **cloaking 红线**：技术本身合法（301/302 管理+换商家），**红线在隐藏链接去向**——Amazon OA 明文禁 obscure URL 与 Tracking ID；Awin/CJ 要求披露跳转链；FTC 要求链接级 disclosure（"(paid link)"级）
- X 平台分发：按"外链仍可能降权"保守处理（2025-10 Musk 宣布取消降权与 2026 实测报告矛盾并存）

## 六、收入现实（全部降权标注：来源均为营销公司口径，有乐观动机）

- 首笔佣金：有既有流量 1-7 天；SEO 冷启动 60-90 天；"有意义收入"6-12 个月
- 收入分布：41% 月入 <$1K / 9% >$50K/月；均值 $8,038 但中位 $500-2K（极端右偏）
- 点击→订单 ~1.8%（评测文 2.3% vs 横幅 1.5%）；点击→成交平均 10 天
- **不存在**新站到首佣的大样本公开统计——所有时间线按上限预估

## 来源

Google/Medium/Reddit/Woo/FTC/Amazon 官方文档=官方级；gsqi（Glenn Gabe）/Adam Riemer（Fili Wiese 口径）/heroicrankings=专家级；wecantrack/AH 调查=行业级（降权）；azonpress/Reddit=社区级
