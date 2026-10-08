# Cushion Mill Quora 运营手册 v1.0

> **定位**：Quora 线的日执行与实验数据手册（对齐 Reddit 工作流模式）。技术通道层（发布链路/CDP 操作）见 `~/.claude/skills/web-access/references/site-patterns/quora.md`（单一真源，本文不重抄）。
> **账号**：Dylan Liu（quora.com/profile/Dylan-Liu-45）｜创建：2026-10-01｜13 Answers。
> **版本**：v1.0（2026-10-08，从 10-01~08 实战沉淀）。

## 0. 一句话总纲

**隔日 1-2 条答案，形态=披露文字+纯文本 URL（组合形态），48h/72h 复查存活，遇 CF 挑战立即冷却 24h。**

## 1. 节奏与额度

| 项 | 定案 | 依据 |
|---|---|---|
| 单日上限 | ≤2 条 | 10-02 四连发触发验证门槛的教训 |
| 推荐节奏 | **隔日 1-2 条** | 门槛滞留 48h 后降频（10-04 复查结论） |
| 发布时段 | 美国白天 | 与 Reddit 的周二-四 6-9 AM ET 窗口一致参考 |
| 门槛判定 | **未答问题页**看 Answer 按钮渲染 | 已答页无 Answer 按钮是正常现象（10-04 误判教训） |

## 2. 答案形态（B 类对照实验数据，持续更新）

| # | 日期 | 问题 | 形态 | 48h 存活 | 折叠 | URL 状态 |
|---|------|------|------|---------|------|---------|
| 1 | 10-04 | Where can you buy replacement couch cushions | disclosure 无链接（发布时后处理失败） | ✅ 96h+（10-08 复查仍活） | 无 | 无链接（disclosure 文字仍在） |
| 2 | 10-04 | Are personalized cushions good to buy | 无披露+纯文本 URL | ✅ 96h+（10-08 复查仍活） | 无 | ✅ 完好 |
| 3 | 10-08 | How can I find a custom bench cushion | 披露+纯文本 URL（草稿 temp/quora_answer3_draft.txt） | ✅ 20h 存活（题页时间戳 20h，早于 48h——10-10 补 72h 点复查） | 无（题页 Recommended 第 1 位展开，另 2 个他人答案被折叠） | ✅ 纯文本完好，无锚点 |

**初判（n=3 不足以下结论）**：三形态（disclosure-only / URL-only / 组合）全部零死亡零折叠，前两条已跨 96h；组合形态（#3）~20h 首查通过且题页独占可见位。**推荐组合形态=披露文字+纯文本 URL**（披露是账号长期防封资产，URL 放答案中后段第三方列举语境）。

## 3. 内容纪律

- 干货主体：删掉链接仍有价值（2-3 段真实有用答案）
- 链接形态：**纯文本 URL** 嵌 "workshops like The Cushion Mill (URL) to local upholsterers" 三方列举
- **锚文本程序化三路全败**（10-04 实证：createLink 被吞/Add Link 弹窗选区丢失/Enter 无效）——锚文本只能人工 Ctrl+K
- 无营销词（amazing/perfect/check out）；URL 验证**只能在 /answer/ 独立页**（题页截断长答案是误报源，10-08 修正）
- 选题优先：采购意图题（customized/replacement/best place to buy）> 保养知识题；优先 0-2 答案或全折叠的题（独占位）

## 4. CF/风控应对模式（10-05~08 实证）

| 症状 | 应对 |
|---|---|
| 弹窗式挑战 15s 自动过 | 可继续 |
| 一次合成点击触发整页挑战 | **立即停手**（自动化已记分，重试拉高分） |
| 挑战连续两天 | 冷却 24h + 发布前人工浏览器开一次 Quora 热身 + 考虑换出口 IP |
| 点击通道 | **一律用代理原生 /click 端点**（10-08 实证：推翻"trusted click 无效"旧结论；eval 合成点击是升级触发器） |

## 5. 每日轮流程（并入社媒日常，~10 分钟）

```
1. 未答问题页探门槛（Answer 按钮渲染？）
2. 渲染=搜采购意图新题（quora.com/search?q=custom+X+cushion）
3. 写答案（干货+组合形态）→ /click 三步发布
4. /answer/ 独立页验证
5. 到期答案 48h/72h 复查（存活/折叠/URL）→ 回填 §2 实验表
```

## 6. 与其他线的分工

- **Reddit**：获客主力（求购帖直接触达）；Quora=搜索长尾资产（答案持续吃搜索流量+GEO 引用源）
- Quora 答案的 URL 落地页优先产品页（采购题）/指南文（知识题）——与 Pinterest pin 落地页策略一致
- 通用 Quora 外链方法论的补充：`05-外链资产库/05-Medium-Quora运营SOP.md`

## 信号台账

- 10-08 复查读数：#3 3 views / 0 upvote（题页独占展开位）；#1 #2 各 2 views / 0 upvote；profile 13 Answers / 40 content views（20 this month）；全站无 Verify 黄条、无 CF 挑战。
- 选题池（10-08 搜索实测，均 0 答案）：What are the best custom window seat cushions（best 型+3 年老题）；I have an odd-shaped window seat that requires custom cushions. Where can I order cushions that fit perfectly（真实求购场景，采购意图最强）——第 4 条候选，落地页发布前先验产品页 200。
