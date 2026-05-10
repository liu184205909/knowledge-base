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

### 操作流程

1. **准备工作**：在 DataForSEO 官网注册账号并充值（最低 $50，余额不过期）
2. **安装插件**：在 Google Sheets 中安装 DataForSEO Connector 插件（扩展程序 → 获取插件 → 搜索 "DataForSEO"）
3. **导入模板**：复制 DataForSEO 官方模板到自己的 Google Sheets
   - 模板地址：`https://docs.google.com/spreadsheets/d/17erVBDKaIfCwicM2sbEVS1xihGu-_diMWQ20JdpCOs0/template/preview`
4. **选择工具**：在插件侧边栏选择 **Bulk Backlink Rank Checker**
5. **输入域名**：在绿色列（A 列，从第 12 行开始）粘贴待查询域名
6. **点击 Run**：插件自动批量查询，结果显示在 B 列
7. **量表转换**：API 默认返回 0-1000 量表值，需用公式转换为 0-100：
   ```
   转换公式：round(sin(rank / 636.62) × 100)
   ```
8. **复制结果**：将转换后的 DR 值复制到竞品清单的 E 列

### 注意事项

- **无需 Backlinks 订阅**：Connector 方式不需要激活 $100/月的 Backlinks 订阅
- **模板 sheet 不可删除**：DataForSEO Connector 的 Google Apps Script 依赖模板中的 sheet 结构，删除模板 sheet 会导致侧边栏无法加载
- **rank_scale 说明**：默认 `one_thousand`（0-1000），Connector 不支持传入 `rank_scale: "one_hundred"` 参数，需要手动转换
- **DataForSEO DR 与 Ahrefs/Semrush 差异**：算法和数据库不同，DataForSEO 基于 Google 原始 PageRank（阻尼因子 0.5），数值偏低属正常，仅适合同批查询内的相对排序

### 费用说明

| 项目 | 费用 |
|------|------|
| 充值最低金额 | $50（余额不过期） |
| Bulk Backlink Rank Checker | $0.02/RUN + $0.00003/target |
| 40 个域名单次查询成本 | 约 $0.02 |

---

## 流量数据获取：traffic.cv

### 操作流程

1. 访问 `https://traffic.cv/{domain}`（如 `https://traffic.cv/lonerwolf.com`）
2. 页面显示该域名的流量数据：
   - **Total Visits**（月访问量）
   - **Traffic Sources**：search%、direct%、social%、referrals%、mail%、paidReferrals%
3. 手动将数据填入竞品清单对应列

### 数据覆盖情况

| 结果 | 说明 |
|------|------|
| 完整数据（visits + 6 渠道%） | traffic.cv 有完整数据 |
| 部分数据 | 仅 Semrush 免费页有基础数据 |
| 无数据 | 流量太小或域名不在数据库 |

### 注意事项

- traffic.cv 有 Cloudflare 保护，连续访问多个域名可能触发验证
- 无付费 API，数据只能通过网页手动获取

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
