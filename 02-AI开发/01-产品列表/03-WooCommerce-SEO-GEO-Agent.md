# WooCommerce SEO/GEO Agent（产品规划）

> 状态：概念阶段
> 来源：StoreClaw.ai 产品拆解 + RLM 营销方法论产品化
> 核心逻辑：先完善 AI 营销工作流 → 验证方法论有效 → 再封装成工具售卖

---

## 一、产品定位

**WordPress/WooCommerce 独立站卖家的 AI SEO/GEO 运营助手**

对标 StoreClaw.ai（聚焦 Amazon/Shopify 跨境电商），我们聚焦 WordPress/WooCommerce 独立站赛道，主打 SEO + GEO 双引擎优化。

差异化：
- StoreClaw 做全栈电商运营（选品、库存、客服），我们只做 SEO + GEO（更聚焦）
- 我们的方法论来自实战积累（RLM 方法论 + 竞品拆解 + 内容策略），不是通用 AI 套壳

---

## 二、商业模式

| 层级 | 价格 | 功能 |
|------|------|------|
| Free | $0 | 基础 SEO 健康检查（每周 1 次） |
| Pro | $29.9/月 | 全部 Skill + 每日监控 + 异常推送 |
| Agency | $79.9/月 | 多站点管理 + 白标报告 + API |

收入模型：SaaS 订阅制（参考 StoreClaw 的 Credit 体系）

---

## 三、核心 Skill 设计（5 个 MVP Skill）

### Skill 1：GEO Visibility Monitor（优先级最高）

**做什么**：定时检查品牌在 ChatGPT / Perplexity / Google AI Overview 的可见性，推送变化

**数据源**：
- ChatGPT API / Perplexity API（模拟用户查询）
- Google AI Overview（SERP 采集）
- Microsoft Clarity AI Visibility（Bot Activity + AI Citations）

**输出**：
- 品牌在 AI 回答中的提及率趋势
- 哪些页面被 AI 引用最多
- 竞品在 AI 回答中的出现情况
- 优化建议（哪些内容值得加强）

**现有基础**：`geo_visibility_checker.py`（已能跑通基础检查）

---

### Skill 2：SEO Health Radar

**做什么**：每日自动跑 SEO 审计，异常自动推送（排名下跌、索引丢失、覆盖率下降）

**数据源**：
- Google Search Console API（索引、排名、CTR）
- WordPress REST API（页面状态、结构）
- PageSpeed Insights API（Core Web Vitals）

**输出**：
- 每日 SEO 健康评分
- 异常预警（具体到哪个页面、什么指标、可能原因）
- 修复建议（AI 生成，附操作步骤）

**现有基础**：`onpage_seo_checker.py` + `seo_technical_auditor.py` + `keyword_cannibalization_checker.py`

---

### Skill 3：Competitor Radar

**做什么**：定时监控竞品页面变化（新内容、结构变动、外链增长）

**数据源**：
- 竞品网站定期爬取（curl + proxy）
- Ahrefs/SEMrush API（外链、排名变化）
- Wayback Machine（历史对比）

**输出**：
- 竞品新增页面/内容通知
- 竞品排名变化（上升/下降关键词）
- 竞品策略变化分析（AI 解读）

**现有基础**：竞品内容分析工具 + SEMrush 数据采集

---

### Skill 4：Content Advisor

**做什么**：基于 SEMrush 数据 + RLM 方法论，推荐下一步该写什么内容

**数据源**：
- SEMrush API（关键词差距、内容缺口）
- Google Search Console（现有排名数据）
- 竞品内容分析

**输出**：
- 按用户旅程阶段的内容推荐（认知→考虑→决策→转化）
- 每个推荐的主题、目标关键词、预估难度
- 内容大纲建议

**现有基础**：RLM 方法论（4 阶段用户旅程 + 内容类型规划）

---

### Skill 5：Listing Optimizer

**做什么**：WooCommerce 产品页 SEO/GEO 优化建议

**数据源**：
- WooCommerce REST API（产品数据）
- Google Search Console（产品页表现）
- 竞品同类产品页

**输出**：
- 标题 / 描述 / Schema 优化建议
- 结构化数据检查和修复
- GEO 可见性评分（该产品是否被 AI 推荐）

**现有基础**：WordPress 建站指南 + SEO 审计工具

---

## 四、技术架构

```
┌─────────────────────────────────────────┐
│              用户界面（Web Dashboard）      │
│  Slack/Discord/Email 推送 + 在线看板       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           定时任务引擎（Scheduler）         │
│  Cron / Celery / GitHub Actions          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Skill 执行层                    │
│  5 个 Skill = Prompt + API 调用链 + AI    │
└──────┬───────┬────────┬──────────┬───────┘
       │       │        │          │
┌──────▼──┐┌──▼────┐┌──▼────┐┌───▼──────┐
│WooCom.  ││GSC    ││SEMrush││AI APIs    │
│REST API ││API    ││API    ││(GPT/Claude)│
└─────────┘└───────┘└───────┘└───────────┘
```

**最小可行技术栈**：
- 后端：Python（FastAPI）
- 定时任务：GitHub Actions 或 Celery
- 数据库：PostgreSQL 或 Supabase
- 前端：Next.js 或 Streamlit（MVP 阶段用 Streamlit 够了）
- 推送：Slack Webhook / Email (Resend)

---

## 五、开发路径

### Phase 0：方法论验证（当前阶段）

- [x] RLM 方法论完善
- [x] SEO 核心机制文档化
- [x] GEO 策略文档化
- [x] 基础工具搭建（SEO 审计、GEO 检查、竞品分析）
- [ ] 用水晶项目跑通完整工作流（从选品到内容到排名到 AI 引用）
- [ ] 验证方法论是否带来可量化的结果

### Phase 1：工具整合（方法论验证后）

- [ ] 把现有独立脚本整合成统一 CLI 工具
- [ ] 加入 WordPress/WooCommerce API 连接器
- [ ] 加入定时任务能力
- [ ] 加入异常推送（Slack/Email）

### Phase 2：产品化（工具成熟后）

- [ ] Web Dashboard（用户注册、站点管理、报告查看）
- [ ] 计费系统（Credit 体系或订阅制）
- [ ] 多用户支持
- [ ] 文档和教程

### Phase 3：商业化

- [ ] Landing page + 付费转化
- [ ] 社群/内容营销获取用户
- [ ] 迭代优化 Skill

---

## 六、参考竞品

| 产品 | 聚焦 | 定价 | 我们的差异 |
|------|------|------|-----------|
| StoreClaw.ai | Amazon/Shopify 全栈运营 | $0-199.9/月 | 我们只做 SEO/GEO，但更深 |
| Diib | SEO 监控 + 建议 | $0-29.99/月 | 无 GEO 能力 |
| Surfer SEO | 内容优化 | $89-219/月 | 无自动化监控 + 无 GEO |
| MarketMuse | 内容策略 | $149.9/月 | 无 WooCommerce 集成 + 无 GEO |

**市场空白**：目前没有产品同时做 WooCommerce SEO + GEO 监控 + 竞品雷达 + 自动化推送。

---

## 七、关键风险

1. **API 成本**：ChatGPT/Perplexity API 调用费用需控制（批量查询时）
2. **数据准确性**：AI 可见性检查结果有波动，需要多次采样取均值
3. **竞争壁垒低**：Skill 本身容易被复制，壁垒在于方法论深度 + 数据积累
4. **市场验证**：WordPress/WooCommerce 卖家是否愿意为 SEO/GEO 工具付费，需验证

---

## 八、与知识库的关系

本产品的核心知识输入来自知识库中的：

- `01-AI营销/00-营销方法论基础/` → RLM 方法论、SEO 全链路、外链建设、关键词研究
- `01-AI营销/03-SEO与GEO/` → Google 核心机制、AI Citation 策略、内容质量标准
- `01-AI营销/02-自动化工具库/` → 现有工具脚本是 Skill 的原型
- `01-AI营销/04-选品库/` → 水晶项目是方法论验证的测试场

**方法论先行，工具跟上，产品收尾。**
