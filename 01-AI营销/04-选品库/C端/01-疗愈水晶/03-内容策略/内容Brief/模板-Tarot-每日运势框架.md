# Tarot 每日运势框架 v1（日期 × 牌 × 水晶，365 篇/年）

> **适用**：`/tarot-daily-{yyyy-mm-dd}/` 每日塔罗运势页（365 篇/年，程序化持续产出）
> **与牌义页框架的关系**：[模板-Tarot-牌义页框架](模板-Tarot-牌义页框架.md) 写牌的深度意义；本框架写**今日抽到该牌的当日落点**。轻量（600-1000 词），不复刻牌义页深度。
> **竞品依据**：[1F §2.5](../../01-竞品分析/1F-塔罗内容写法研究.md) —— Tarot.com 自动化日运势（量大但同质）。我们做**深化版**（600-1000 词 + 水晶落地 + 东方时辰）。
> **数据源**：`07-互动工具/_shared/tarot-knowledge.json`（22 牌）+ [星象数据参考-2026-2027](../星象数据参考-2026-2027.md)（月相/行星）+ 日期种子
> **核心策略**：主词 `daily tarot {date}` / `tarot of the day {date}` / `today's tarot`。差异化：**每日牌+水晶+星象+东方时辰三位一体**。
> **⚠️ 防雷优势**：每日运势**天然防重复**（日期 × 星象 × 牌 × 水晶的独有组合），但仍禁纯模板填充（见 §3）。

---

## 1. URL + TKD

- **URL**：`/tarot-daily-{yyyy-mm-dd}/`（根级 post；**日期 URL 例外**：对齐 2A §一第5条"运势类可带日期"）
  - 示例：`/tarot-daily-2026-06-30/`
- **Title**：`Daily Tarot Reading for {Month D, YYYY}: {Card}`（≤60 字符）
- **H1**：`Today's Tarot: {Card} — {Month D, YYYY}`
- **Primary KW**：`daily tarot {date}` / `tarot of the day` / `today's tarot card`
- rank_math 三件套（focus_keyword = `daily tarot {yyyy-mm-dd}`）

---

## 2. 模块结构（5 模块，目标 600-1000 词，轻量）

| # | 模块 | H2 | 词数 | 要点 |
|---|---|---|---|---|
| Intro | 今日牌 + 能量一句话 | | 100-150 | 今日抽到的牌 + 当日能量一句话（含日期+主词）|
| M1 | Today's Card Energy | `{Card}: Today's Energy` | 150-200 | 该牌**当日落点**（结合当日星象，非通用牌意）|
| **M2** | **Today's Crystal** ⭐ | `Today's Crystal: {Crystal}` | 120-180 | 当日水晶（对应今日牌 + 首饰 Shop CTA）|
| M3 | Astrological Context | `Today's Astrological Context` | 120-180 | 今日**月相/行星位/东方时辰**（从星象数据读取）|
| M4 | How to Use Today's Energy | `Working with Today's Energy` | 120-180 | 当日行动/仪式 |

---

## 3. 防模板填充（核心 ⭐）

> **天然防重复**：日期 × 星象 × 牌 × 水晶组合每日独有。但仍禁纯模板填充。

| ❌ 禁（模板填充，任何日都能套） | ✅ 要（当日独有组合） |
|---|---|
| "Today's card is {Card}. It means {通用牌意}. Wear {水晶}." | "June 30, 2026 — with the Last Quarter Moon in Aries adding friction to the day, The Fool shows up asking where you've been playing too safe. The Aries moon wants action; The Fool wants a leap. Today's crystal: Clear Quartz, to make sure the leap is clear-sighted, not reactive..." |

**硬约束**：
1. M1 必须结合**当日星象**（月相/行星位，从星象数据参考读取）写该牌落点
2. M2 水晶必须结合**今日牌+今日星象**选（非固定映射）
3. M3 东方时辰必须落**当日具体时辰能量**（子时胆经/午时心经…）
4. 禁"今日抽到 {Card}，意味着 {通用牌意}"填充式（[1F §2.5](../../01-竞品分析/1F-塔罗内容写法研究.md)）

---

## 4. 日期种子规则（程序化）

- **今日牌**：按日期种子映射 22 Major（或每日官方抽牌），`seed = hash(yyyy-mm-dd) % 22`
- **今日星象**：从 [星象数据参考-2026-2027](../星象数据参考-2026-2027.md) 读取当日月相/行星位
- **今日水晶**：今日牌的 best_overall（tarot-knowledge.json）× 当日星象调和
- **东方时辰**：当日节气/时辰能量（子午流注）

---

## 5. 通用组件（复用）

| 组件 | 执行依据 | 运势页专属 |
|---|---|---|
| 合规/去AI化 | 牌义页 §16 + [1F §0A](../../01-竞品分析/1F-塔罗内容写法研究.md) | 同 + **禁"今日必发生X"确定论**，用"today's energy invites..."；**Health/Finances 落点守 [1F §0A.1](../../01-竞品分析/1F-塔罗内容写法研究.md) 黑名单**（今日牌落健康/财运时禁 cure/invest now/guaranteed）；**禁用表达库 6 类见 [1F §0A.2](../../01-竞品分析/1F-塔罗内容写法研究.md)**（运势页高发区：M2 水晶万能句、M1 泛泛开头）|
| CTA 预验证 | 牌义页 §3 | 今日水晶 meaning/category HEAD 检查，三级降级 |
| Schema | 牌义页 §12 | Article + BreadcrumbList（运势页 FAQ 可选）|
| 内链 | 2A §四塔罗页 | 牌义页（`/tarot-{card}-crystals/`）+ 前后日运势 + 月运/年运 Hub + 水晶 meaning |
| 图片 | 牌义页 §14 | hero（今日牌视觉+水晶+日期，1536×864）|

## 6. 质检关卡

- **关卡 0 合规前置门（全塔罗统一 ⭐）**：grep [1F §0A.1 Health/Finances 黑名单](../../01-竞品分析/1F-塔罗内容写法研究.md) + [1F §0A.2 禁用表达库](../../01-竞品分析/1F-塔罗内容写法研究.md) 6 类。运势页重点：今日牌落健康/财运（如 The Star 谈疗愈、The Emperor 谈财务结构）时守边界；M2 水晶段禁万能句/医疗承诺/财务承诺
- **关卡 1 当日独有性**：M1/M3 含当日星象+时辰具体数据（非通用）
- **关卡 2 禁模板填充**：grep 黑名单"today's card is X. it means"
- **关卡 3 跨日 n-gram**：连续 8-gram 重复率 < 15%（重点查同牌不同日）
- **关卡 4 合规**：禁确定论（today will/guaranteed/destined）
- **关卡 5 语义去重 + 结构指纹（全塔罗普适升级 ⭐，见 [1F §0A.3](../../01-竞品分析/1F-塔罗内容写法研究.md)）**：
  - **语义去重**：365 运势页 M1 Card Energy 段跨日 embedding 余弦相似度 **> 0.85 触发复审**——重点查**同牌不同日**（22 牌 × 各多日，同牌不同日的 M1 最易换日期不换骨）
  - **结构指纹**：5 模块开场句式 + 论证路径指纹重复率 **< 40%**；**强制 ≥ 30% 运势页打乱默认起承转合**（如 M3 星象前置、M4 行动并入 M2、加"今日避坑"段等变体）
  - **人工连读兜底**：抽同牌 5-10 日连读，判断"换日期能否互换"

## 7. 生产流程（程序化，复用 horoscope 脚本逻辑）

1. 日期序列生成（365/年）→ 每日种子映射牌 + 星象 + 水晶 + 时辰
2. CTA 预验证（当日水晶批量 HEAD）
3. AI 填充（BATCH，每篇结合当日星象差异化）
4. 四质检 → 二审（抽样）→ 图片 → upload → 防假完成
5. **持续产出**：每月初批量生成下月 30 篇（程序化，对齐 horoscope 月运节奏）

## 8. 与其他框架边界

见 [配对框架 §11](模板-Tarot-配对文章框架.md)。运势页讲**日期×牌×水晶×星象**，完全不同维度（日期驱动 vs 组合/场景/问题驱动），天然不与其他类型重复。
