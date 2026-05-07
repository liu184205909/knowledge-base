# DR 与流量数据获取方案

> 竞品分析阶段（RLM 步骤 1B）批量获取域名权重、自然流量、流量渠道等 SEO 指标的工具方案 | 最后更新: 2026-05-07

---

## 1. 需求背景

RLM 步骤 1B 竞品筛选需要对 40+ 竞品域名批量获取以下指标：

| 指标 | 用途 | RLM 中的角色 |
|------|------|-------------|
| DR / 权重 | 判断域名 SEO 实力 | P0/P1/P2/P3 分级依据 |
| 自然流量 | 评估竞品流量规模 | 筛选重点竞品 |
| 流量渠道拆分 | Direct / Search / Social / Referral / Email / Paid | 差异化策略依据 |
| 反链数 / 引荐域数 | 外链资源评估 | 参考 |

---

## 2. 方案总览

采用 **三层工具组合**，各取所长：

```
DR + 反链 + 自然流量  →  DataForSEO MCP（已有）
流量渠道拆分         →  RapidAPI Similarweb API（需订阅）
备用/补充            →  Apify Similarweb Actor（按需）
```

---

## 3. DataForSEO（已有 MCP）

RLM 当前已集成 DataForSEO MCP，可直接使用。

### 3.1 可获取的数据

| 指标 | 端点 | 字段名 | 说明 |
|------|------|--------|------|
| 域名权重（DR 等价） | `/v3/backlinks/summary/live` | `rank` | 0-1000 量表，设 `rank_scale: "one_hundred"` 转为 0-100 |
| 反链数 | 同上 | `backlinks` | 总外链数 |
| 引荐域数 | 同上 | `referring_domains` | 链接域名数 |
| 自然流量（ETV） | `/v3/dataforseo_labs/google/domain_rank_overview/live` | `etv` | 基于 CTR x 搜索量估算的月自然流量 |
| 付费流量 | 同上 | `etv` (paid) | 付费搜索月流量 |
| 排名分布 | 同上 | `pos_1` ~ `pos_91_100` | 各排名区间关键词数 |

### 3.2 批量查询

```text
Bulk Ranks 端点：一次最多 1000 个域名
Bulk Pages Summary：一次最多 1000 个页面
```

### 3.3 限制

- **没有流量渠道拆分**（Direct / Social / Referral 占比）
- `rank` 不是行业标准 DR（但可作为相对参考值使用）

---

## 4. RapidAPI Similarweb API（推荐接入）

### 4.1 服务信息

| 项目 | 详情 |
|------|------|
| 名称 | Similarweb Traffic API (by oceanrock) |
| 平台 | RapidAPI |
| 链接 | https://rapidapi.com/oceanrock/api/similarweb-api1 |
| 类型 | 第三方二开 API（非爬虫），基于 SimilarWeb 数据 |
| 定价 | 见下方 |

### 4.2 定价方案

| 套餐 | 月费 | 请求数 | 限速 | 适合场景 |
|------|------|--------|------|---------|
| Basic | **$0** | 50 次/月 | 1000 次/小时 | 测试验证 |
| Pro | **$19** | 15,000 次/月 | 1 次/秒 | 正式使用（推荐） |
| Ultra | **$49** | 60,000 次/月 | 1 次/秒 | 大批量项目 |

> 40 个域名 = 40 次请求，Basic 免费套餐即可覆盖首次测试。

### 4.3 返回数据

```json
{
  "SiteName": "example.com",
  "GlobalRank": 47814,
  "CountryRank": 19272,
  "CategoryRank": 528,
  "Engagments": {
    "Visits": "1491058",
    "BounceRate": "0.51",
    "PagePerVisit": "2.09",
    "TimeOnSite": "64.9"
  },
  "TrafficSources": {
    "Direct": 0.44,
    "Search": 0.41,
    "Social": 0.04,
    "Referrals": 0.08,
    "Mail": 0.02,
    "Paid Referrals": 0.01
  },
  "TopKeywords": [
    { "Name": "keyword", "Volume": 51720, "Cpc": 2.31 }
  ],
  "TopCountryShares": [
    { "CountryCode": "US", "Value": 0.478 }
  ]
}
```

### 4.4 数据字段对照

| 字段 | 类型 | 说明 |
|------|------|------|
| `SiteName` | string | 网站名称 |
| `GlobalRank` | int | 全球排名 |
| `CountryRank` | int | 国家排名 |
| `CategoryRank` | int | 类目排名 |
| `Engagments.Visits` | string | 月访问量 |
| `Engagments.BounceRate` | string | 跳出率 |
| `Engagments.PagePerVisit` | string | 每次访问页数 |
| `Engagments.TimeOnSite` | string | 平均停留时长（秒） |
| `TrafficSources.Direct` | float | 直接访问占比 |
| `TrafficSources.Search` | float | 搜索流量占比 |
| `TrafficSources.Social` | float | 社交流量占比 |
| `TrafficSources.Referrals` | float | 引荐流量占比 |
| `TrafficSources.Mail` | float | 邮件流量占比 |
| `TrafficSources.Paid Referrals` | float | 付费引荐占比 |
| `TopKeywords` | array | Top 有机关键词（含搜索量、CPC） |
| `TopCountryShares` | array | Top 国家流量分布 |

### 4.5 接入方式

**Step 1**: 注册 RapidAPI 账号，订阅 `oceanrock/similarweb-api1`

**Step 2**: 获取 API Key（RapidAPI 自动生成 `X-RapidAPI-Key`）

**Step 3**: Python 调用示例

```python
import requests
import json

API_KEY = "your-rapidapi-key"
HOST = "similarweb-api1.p.rapidapi.com"
BASE_URL = f"https://{HOST}/api/v1"

headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": HOST
}

def get_domain_traffic(domain: str) -> dict:
    """获取单个域名的 Similarweb 流量数据"""
    response = requests.get(
        f"{BASE_URL}/traffic",
        headers=headers,
        params={"domain": domain}
    )
    return response.json()

def batch_get_traffic(domains: list[str]) -> list[dict]:
    """批量获取多个域名的流量数据"""
    results = []
    for domain in domains:
        try:
            data = get_domain_traffic(domain)
            results.append(data)
            print(f"[OK] {domain}")
        except Exception as e:
            results.append({"domain": domain, "error": str(e)})
            print(f"[FAIL] {domain}: {e}")
    return results

# 使用示例
if __name__ == "__main__":
    domains = ["example.com", "competitor1.com", "competitor2.com"]
    data = batch_get_traffic(domains)

    # 保存结果
    with open("traffic_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
```

### 4.6 注意事项

- 实际端点路径需订阅后在 RapidAPI 控制台确认（上述为示例，需按文档调整）
- Pro 套餐限速 1 次/秒，40 个域名需 ~40 秒
- 数据来源为 SimilarWeb 估算值，非精确数据，标注来源即可
- 小型/新域名可能返回有限数据

---

## 5. Apify Similarweb Actor（备用方案）

当 RapidAPI 不可用或需要额外数据（AI 流量、竞品发现）时，使用 Apify Actor。

### 5.1 推荐 Actor

| Actor | 评分 | 用户数 | 单价 | 特色 |
|-------|------|--------|------|------|
| `just_scrape/similarweb-advanced-scraper` | 5.0 | 11 | ~$1.05/1000 | AI流量 + 竞品 + 自愈解析器 |
| `pro100chok/similarweb-scraper` | 5.0 | **197** | 按用量 | 最成熟稳定，用户最多 |
| `sourabhbgp/similarweb-scraper` | 5.0 | 47 | $5/1000 | 最便宜，HTTP-only 速度快 |

### 5.2 首选：just_scrape/similarweb-advanced-scraper

| 项目 | 详情 |
|------|------|
| 链接 | https://apify.com/just_scrape/similarweb-advanced-scraper |
| 定价 | ~$1.05/1000 域名（40 域名约 $0.05） |
| 输入 | `domains`: 域名列表（字符串数组） |
| 输出字段 | globalRank、categoryRank、totalVisits、bounceRate、pagesPerVisit、avgTimeOnSite、trafficSources（search/direct/social/referrals）、topKeywords、aiTraffic、historicalVisits、competitors |

### 5.3 独有数据（RapidAPI 没有）

- **AI 流量**：ChatGPT / Gemini / Perplexity 引荐流量
- **竞品发现**：Top 5 相似竞品域名 + 相似度评分
- **历史趋势**：近 3 个月访问量变化
- **地理分布**：Top 5 国家流量占比

### 5.4 调用方式

```python
from apify_client import ApifyClient

apify_client = ApifyClient("your-apify-token")

run = apify_client.actor("just_scrape/similarweb-advanced-scraper").call(run_input={
    "domains": ["example.com", "competitor1.com"],
    "simplifiedOutput": True,
    "includeRaw": False,
    "maxAgeDays": 14,
    "stealthMode": True
})

# 获取结果
for item in apify_client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item["domain"], item["data"]["engagements"]["totalVisits"])
```

---

## 6. RLM 流程中的对接位置

```
步骤1A: 竞品发现 → 40+ 竞品域名
    ↓
步骤1B: 竞品筛选 → 批量获取 DR + 流量 + 渠道数据
    ├── DataForSEO MCP → DR(rank) + 反链 + ETV(自然流量)
    ├── RapidAPI Similarweb → 流量渠道拆分 + Engagement 指标
    └── (可选) Apify Actor → AI流量 + 竞品发现
    ↓
输出: 竞品清单.xlsx（补充 DR/流量/渠道字段） → P0/P1/P2/P3 分级
```

---

## 7. 成本估算

### 单个项目（40 个域名）

| 工具 | 调用量 | 费用 |
|------|--------|------|
| DataForSEO MCP | 40 域名 x 2 端点 | 已包含在现有订阅 |
| RapidAPI Similarweb | 40 次 | **$0**（Basic 套餐） |
| Apify（备用） | 40 域名 | ~$0.05 |

**单项目成本：$0（用免费额度）**

### 月度（多个项目）

| 工具 | 套餐 | 月费 |
|------|------|------|
| DataForSEO MCP | 现有 | 已有 |
| RapidAPI Similarweb | Pro | **$19/月** |
| Apify | Starter | $29/月（共享其他 Actor） |

---

## 8. 测试清单

接入前按以下顺序验证：

- [ ] **DataForSEO rank 端点**：用已知域名（如 ahrefs.com DR=93）验证 `rank` 值是否合理
- [ ] **DataForSEO ETV 端点**：对比 SimilarWeb 免费页面的流量数字，判断偏差范围
- [ ] **RapidAPI Basic 套餐**：用 3 个域名测试，验证返回字段完整性（特别是 TrafficSources 是否有 6 个渠道）
- [ ] **RapidAPI 小型域名**：测试一个 DR<10 的小型域名，确认是否返回有效数据
- [ ] **Apify Actor**（可选）：运行 just_scrape Actor，验证 AI 流量和竞品数据是否返回
- [ ] **数据一致性**：同一域名在 DataForSEO 和 RapidAPI 的流量数字偏差是否可接受（记录偏差比例，输出时标注数据来源）

---

## 9. 数据输出格式（竞品清单补充字段）

竞品清单.xlsx 在原有字段基础上增加：

| 字段 | 数据来源 | 格式 |
|------|---------|------|
| DR / 权重 | DataForSEO `rank` (one_hundred) | 0-100 |
| 自然流量 | DataForSEO `etv` | 数字（月访问量） |
| 反链数 | DataForSEO `backlinks` | 数字 |
| 引荐域数 | DataForSEO `referring_domains` | 数字 |
| 总访问量 | RapidAPI Similarweb `Visits` | 数字 |
| 跳出率 | RapidAPI Similarweb `BounceRate` | 百分比 |
| 流量渠道-搜索 | RapidAPI Similarweb `TrafficSources.Search` | 百分比 |
| 流量渠道-直接 | RapidAPI Similarweb `TrafficSources.Direct` | 百分比 |
| 流量渠道-社交 | RapidAPI Similarweb `TrafficSources.Social` | 百分比 |
| 流量渠道-引荐 | RapidAPI Similarweb `TrafficSources.Referrals` | 百分比 |
| 全球排名 | RapidAPI Similarweb `GlobalRank` | 数字 |
| AI流量 | Apify `aiTraffic.totalVisits` | 数字（可选） |

---

## 附录：备选方案对比

| 能力 | DataForSEO (已有) | RapidAPI Similarweb | Apify just_scrape |
|------|---|---|---|
| DR 等价指标 | rank (0-1000) | Global Rank | Global Rank |
| 自然流量 | etv | Visits | totalVisits |
| 流量渠道拆分 | 无 | 6 渠道(最全) | 4 渠道 |
| AI 流量 | 无 | 无 | 有 |
| 竞品发现 | 有(其他端点) | 无 | 有(Top5) |
| 数据稳定性 | 高(API) | 高(API) | 中(爬虫+自愈) |
| 接入难度 | 已接入 | REST API | Apify SDK |
| 月费 | 已有 | $0-19 | 按用量 |
