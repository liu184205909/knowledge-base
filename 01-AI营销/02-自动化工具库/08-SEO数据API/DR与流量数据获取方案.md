# DR 与流量数据获取方案

> 竞品分析阶段（RLM 步骤 1B）批量获取域名权重、自然流量、流量渠道等 SEO 指标 | 最后更新: 2026-05-10

---

## 数据来源总览

| 数据 | 获取方式 | 操作方式 | 费用 |
|------|---------|---------|------|
| DR（域名权重 0-100） | DataForSEO Google Sheets Connector | 手动在 Google Sheets 侧边栏操作 | 按次付费（~$0.02/40域名） |
| 月访问量 + 流量渠道拆分 | traffic.cv | 手动在浏览器访问 | 免费 |

---

## DR 获取：DataForSEO Google Sheets Connector

通过 Google Sheets 插件批量查询域名 DR，无需 Backlinks 订阅。

### 量表转换

DataForSEO API 默认返回 **0-1000** 量表值，需转换为 0-100：

```
转换公式：round(sin(rank / 636.62) × 100)
```

> 示例：rank=479（0-1000）→ round(sin(479/636.62) × 100) = 68（0-100）

---

## 流量数据获取：traffic.cv

在浏览器访问 `https://traffic.cv/{domain}` 获取月访问量和流量渠道拆分（search%、direct%、social%、referrals%、mail%、paidReferrals%）。免费，数据覆盖情况因域名而异。

---

## RLM 流程对接

```
步骤1A: 竞品发现 → 40+ 竞品域名
    ↓
步骤1B: 竞品筛选 → 批量获取 DR + 流量 + 渠道数据
    ├── DataForSEO Connector → DR（手动在 Google Sheets 操作）
    └── traffic.cv → 月访问量 + 流量渠道拆分（手动在浏览器获取）
    ↓
输出: 竞品清单 Google Sheets（补充 DR/流量/渠道字段） → P0/P1/P2/P3 分级
    ↓
同步: 竞品优先级说明文档（1B）DR 值同步更新
```

---

## 竞品清单字段格式

| 字段 | 列号 | 数据来源 | 格式 |
|------|------|---------|------|
| DR | E | DataForSEO Connector（手动操作） | 0-100 |
| 月访问量 | G | traffic.cv | 如 233K、2.71M |
| 搜索% | H | traffic.cv | 如 53.80% |
| 直接% | I | traffic.cv | 如 14.63% |
| 社交% | J | traffic.cv | 如 16.26% |
| 引荐% | K | traffic.cv | 如 12.83% |
| 邮件% | L | traffic.cv | 如 1.75% |
| 付费% | M | traffic.cv | 如 0.17% |
