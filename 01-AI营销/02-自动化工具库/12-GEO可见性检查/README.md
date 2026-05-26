# GEO 可见性检查工具

> 检查品牌在 AI 生态中的可见性信号，评估 GEO 优化空间 | 最后更新：2026-05-14 | 数据源：DataForSEO SERP API

---

## 工具定位

**解决什么问题**：在选品评估或运营优化阶段，快速了解一个品牌/产品在 AI 推荐生态中的可见程度——Google AI Overview 是否覆盖？Reddit/Quora 是否有人讨论？有没有评价网站收录？竞品对比内容是否覆盖？

**不适合什么**：这不是"排名追踪工具"，GEO 的数据天然不可复现（LLM 每次回答不同），本工具提供的是**方向性信号**，不是精确排名。

---

## 架构：Script + LLM 双层

```
Layer 1（脚本层）: geo_visibility_checker.py
  Serper.dev API → 7维度数据采集 → JSON + Markdown

Layer 2（LLM层）: Claude Code
  分析 JSON → 可见性评分 + 差距分析 + 行动建议
  → 写入 Google Sheets（通过 Google Workspace MCP）
```

---

## 七个检查维度

| # | 维度 | 检查方式 | 输出 |
|---|------|---------|------|
| 1 | **AI Overview / Featured Snippet** | 搜索品类关键词，检测 answerBox 和 knowledgeGraph | 是否出现、类型、品牌是否被提及 |
| 2 | **Reddit 讨论可见性** | `site:reddit.com [keyword] recommendation` | 品牌提及数、Top 帖子链接 |
| 3 | **Quora 讨论可见性** | `site:quora.com best [keyword]` | 品牌提及数 |
| 4 | **评价网站覆盖** | 搜索 G2/Trustpilot/Capterra/ProductHunt | 覆盖的评价平台数量 |
| 5 | **Wikipedia 实体** | `[brand] site:wikipedia.org` | 是否有独立词条 |
| 6 | **媒体报道** | 搜索品牌+关键词，排除大平台 | 权威媒体报道数 |
| 7 | **竞品对比** | `[brand] vs [competitor] [keyword]` | 对比文章数量 |

---

## 使用方法

### 前置条件

1. **DataForSEO API 凭证**：使用 DataForSEO SERP API，复用现有 MCP 配置的账号
2. **Python 依赖**：`requests`（工具库已安装）

### 设置 API 凭证

```bash
# DataForSEO 使用 Basic Auth（login:password）
# 登录 https://dataforseo.com 控制台获取
export DFS_API_LOGIN=your_login
export DFS_API_PASSWORD=your_password
```

### 基本用法

```bash
# 单关键词，无竞品（最少 API 调用：~6次）
python 12-GEO可见性检查/geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet"

# 多关键词 + 竞品（API 调用 = 4×关键词数 + 2 + 竞品数）
python 12-GEO可见性检查/geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet" "crystal bracelet meaning" \
  --competitors "Energy Muse" "Tiny Rituals"

# 欧洲市场（德国）
python 12-GEO可见性检查/geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet" \
  --location "Germany" --language de
```

### 输出文件

| 文件 | 内容 |
|------|------|
| `results/geo_visibility_<brand>_<date>.json` | 结构化数据，供 Layer 2 分析 |
| `results/geo_visibility_<brand>_<date>.md` | 可读报告模板 |

### Layer 2：Claude Code 分析

将 JSON 文件交给 Claude Code，使用以下 prompt：

```
请分析这个品牌的 GEO 可见性数据（JSON文件），给出：
1. 各维度评分（0-100），按重要性加权
2. 与竞品的差距分析
3. Top 3 可执行的改善建议（按优先级排序）
4. 适合写入 Google Sheets 的汇总行
```

Claude Code 会分析 JSON 后通过 Google Workspace MCP 写入你的 Google Sheets。

---

## API 调用消耗

| 场景 | 关键词数 | 竞品数 | API 调用数 |
|------|---------|--------|-----------|
| 最少（1关键词，无竞品） | 1 | 0 | ~6 |
| 标准（2关键词，2竞品） | 2 | 2 | ~12 |
| 完整（3关键词，3竞品） | 3 | 3 | ~17 |

> DataForSEO 按 API 调用计费，SERP Live API 约 $0.003/次。
> 与 DataForSEO MCP 共享账号配额。

---

## 工作流位置

```text
现有流程：
  02-竞品研究 → 05-内容分析 → 建站 → 10-SEO审计 → 11-用户洞察

插入后：
  02-竞品研究 → 05-内容分析 → 12-GEO可见性 → 建站 → 10-SEO审计 → 11-用户洞察
                                    ↑
                          建站前评估品类的 AI 推荐格局
                          运营期定期监测品牌 AI 可见性变化
```

**两个使用场景**：

1. **选品评估**（建站前）：检查这个品类的 AI 推荐格局是否已固化，新品牌有没有切入空间
2. **运营监测**（建站后）：定期跑一次，跟踪品牌在各维度的可见性变化趋势

---

## 局限性

| 局限 | 原因 | 应对 |
|------|------|------|
| 无法直接检测 ChatGPT/Perplexity 推荐内容 | 这些平台没有公开搜索 API | Layer 2 可通过 Claude Code Web Search 手动补充 |
| AI Overview 检测不完整 | Serper.dev 返回的是 answerBox/knowledgeGraph，不是完整的 AI Overview | 作为近似信号使用 |
| 数据不可复现 | LLM 每次回答不同，搜索结果因时间/地点变化 | 用于方向性判断，不用于精确排名追踪 |
| 评价网站覆盖偏 SaaS | G2/Capterra 等是 SaaS 评价站，B2C 产品适用性低 | B2C 场景可手动补充 Amazon/Etsy 评价分析 |

---

## 与现有工具的关系

| 工具 | 关系 |
|------|------|
| **02-竞品研究** | 11 在 02 之后使用，补充 AI 可见性维度 |
| **10-SEO审计** | 10 检查技术 SEO，12 检查 GEO 可见性，互补 |
| **11-用户洞察** | 11 采集 Reddit 评论做内容分析，12 检查品牌在 Reddit 的可见性 |
| **10-SEO审计/README 提到的 SearchAtlas** | SearchAtlas 的 LLM 可见性追踪是商业版功能，本工具是免费自建替代 |
