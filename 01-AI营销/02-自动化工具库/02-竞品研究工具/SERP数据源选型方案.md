# SERP 数据源选型方案

> **目标**：为竞品发现提供稳定、低成本的 Google SERP 数据，替代现有 `googlesearch-python` 直接爬取方案。
>
> **策略**：免费额度优先（轮询 6 家服务商），付费兜底（DataForSEO MCP）。
>
> 最后更新：2026-05-07

---

## 1. 现有方案的问题

当前 `serp_competitor_finder.py` 使用 `googlesearch-python` 库直接爬取 Google：

| 问题 | 影响 |
|------|------|
| 无 API Key，容易被封 IP | 批量查询时失败率高 |
| 依赖 Google 页面结构 | Google 改版即失效 |
| 无法控制返回字段 | 只能拿到 URL，无排名/标题/描述 |
| 无地理位置/语言参数 | 无法模拟目标市场搜索结果 |

**结论：需要替换为正规 SERP API。**

---

## 2. 免费额度服务商

| # | 服务商 | 免费额度 | 刷新周期 | 需信用卡 | 注册地址 |
|---|--------|---------|---------|---------|---------|
| 1 | **TuningSearch** | 3,000 次 | 每月 | 否 | https://tuningsearch.com/ |
| 2 | **Serper.dev** | 2,500 次 | 每月 | 否 | https://serper.dev/ |
| 3 | **Brave Search API** | ~1,250 次 | 每月 | 否 | https://brave.com/search/api/ |
| 4 | **Scrape.do** | 1,000 次 | 每月 | 否 | https://scrape.do/ |
| 5 | **SearchAPI.io** | 100 次 | 每月 | 否 | https://www.searchapi.io/ |
| 6 | **SerpApi** | 250 次 | 每月 | 否 | https://serpapi.com/ |
| | **合计** | **~8,100 次/月** | | | |

> **注**：Brave Search API 每月 $5 免费额度，按 $4/1K 计算 ≈ 1,250 次。

### 各服务商要点

#### TuningSearch（额度最大）
- 定位 AI Search API，支持 `/search`、`/news`、`/crawl`
- 3000 次/月免费，无需信用卡
- 服务较新（2025），稳定性待验证
- **优先级：1（额度最大）**

#### Serper.dev（最成熟）
- 1-2 秒响应，社区生态最好（CrewAI 等框架已集成）
- 付费 $50/50K = $1/1K，价格清晰
- 支持 `gl`（国家）、`hl`（语言）、`num`（结果数）参数
- 返回 JSON 结构：organic → { title, link, snippet, position }
- **优先级：2（最稳定）**

#### Brave Search API（自有索引）
- 基于 Brave 自有搜索索引，不依赖 Google，无被封风险
- $5/月免费额度，按 $4/1K 计算
- 适合做交叉验证（对比 Google 结果）
- **优先级：3（防止单点故障）**

#### Scrape.do
- 通用爬虫 API，支持 Google SERP 端点
- 1000 次/月，每月刷新
- **优先级：4**

#### SearchAPI.io
- 100 次/月，额度最少
- 支持 coordinate-level 地理定位
- **优先级：5**

#### SerpApi
- 行业标杆，支持 80+ 搜索引擎
- 仅 250 次/月免费
- **优先级：6（备用补充）**

---

## 3. 付费兜底

| 服务商 | 说明 |
|--------|------|
| **DataForSEO MCP** | 已集成 Claude Code，`serp_organic_live_advanced` 端点，按现有订阅计费 |

当所有免费额度耗尽时自动切换。

---

## 4. 轮询架构

```
请求进来
  │
  ├─ 轮询优先级队列（按免费额度从大到小）
  │    1. TuningSearch   (3000)
  │    2. Serper.dev     (2500)
  │    3. Brave Search   (1250)
  │    4. Scrape.do      (1000)
  │    5. SearchAPI.io   (100)
  │    6. SerpApi        (250)
  │
  ├─ 当前源失败/额度耗尽 → 自动切换下一个
  │
  └─ 全部耗尽 → DataForSEO MCP（付费兜底）
```

### 轮询策略要点
- 按优先级顺序尝试，非严格轮询（优先用额度大的）
- 记录每个源的剩余额度，额度为 0 时跳过
- 每日重置计数器（按月刷新的源）
- 失败重试 1 次后切换下一个源
- 所有源返回统一格式：`{ title, url, snippet, position }`

---

## 5. 调用示例

### Serper.dev（推荐参考格式）

```python
import requests

API_KEY = "your-serper-key"
url = "https://google.serper.dev/search"

payload = {
    "q": "crystal jewelry wholesale supplier",
    "gl": "us",       # 国家
    "hl": "en",       # 语言
    "num": 20         # 结果数
}
headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

for result in data.get("organic", []):
    print(f"{result['position']}. {result['title']}")
    print(f"   {result['link']}")
    print(f"   {result['snippet']}\n")
```

### TuningSearch

```python
import requests

API_KEY = "your-tuningsearch-key"
url = "https://api.tuningsearch.com/search"

params = {
    "q": "crystal jewelry wholesale supplier",
    "num": 20
}
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
```

### Brave Search API

```python
import requests

API_KEY = "your-brave-key"
url = "https://api.search.brave.com/res/v1/web/search"

params = {
    "q": "crystal jewelry wholesale supplier",
    "count": 20
}
headers = {
    "X-Subscription-Token": API_KEY,
    "Accept": "application/json"
}

response = requests.get(url, params=params, headers=headers)
data = response.json()

for result in data.get("web", {}).get("results", []):
    print(f"{result['title']} - {result['url']}")
```

### DataForSEO MCP（兜底，已集成）

通过 Claude Code 直接调用 `mcp__dataforseo__serp_organic_live_advanced`：

```
keyword: "crystal jewelry wholesale supplier"
location_name: "United States"
language_code: "en"
depth: 20
```

---

## 6. 容量估算

| 场景 | 单次消耗 | 月可用批次 |
|------|---------|-----------|
| 10 个关键词竞品发现 | 10 次 | **810 批** |
| 50 个关键词深度调研 | 50 次 | **162 批** |
| 单关键词 100 结果深度爬取 | 1 次 | **8,100 次** |

对于 RLM 竞品发现场景，免费额度完全足够日常使用。

---

## 7. 注册清单

> 注册后将 API Key 填入配置文件，待后续集成测试。

| # | 服务商 | 注册地址 | API Key | 状态 |
|---|--------|---------|---------|------|
| 1 | TuningSearch | https://tuningsearch.com/ | — | 待注册 |
| 2 | Serper.dev | https://serper.dev/ | — | 待注册 |
| 3 | Brave Search API | https://brave.com/search/api/ | — | 待注册 |
| 4 | Scrape.do | https://scrape.do/ | — | 待注册 |
| 5 | SearchAPI.io | https://www.searchapi.io/ | — | 待注册 |
| 6 | SerpApi | https://serpapi.com/ | — | 待注册 |
| 7 | DataForSEO | 已集成 MCP | — | ✅ 已就绪 |
