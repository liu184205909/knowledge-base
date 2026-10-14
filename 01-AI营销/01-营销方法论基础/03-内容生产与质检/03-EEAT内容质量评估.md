# E-E-A-T 内容质量评估工具

> **定位**：文章发布前的最后一道质检关卡（发布前终审；02-SOP §3.1 Marie Haynes prompt 是作者自查初筛——批量生产先过 §3.1，发布前按路由档位过本关）。存量内容的批量审计见 [04-内容审计与优化工具包.md](./04-内容审计与优化工具包.md)。
> **覆盖边界**：7 条 criteria 只评 Experience/Expertise/差异化，不评 Authority 与 Trust——那两维由 04 号维度 1 站点级评分覆盖，过了本关≠EEAT 四维全过。
> **来源**：Simon（赛门快跑）Chrome Ask Gemini 提示词，适配 Claude Code 本地文件评估。
> **EEAT 三档（接 02-SOP §4.1 路由表）**：
> - **加强**（对比/选购类必用）：先按标准档跑评分，再附加——①附 1-3 个竞品 URL 逐维度对比点评 ②差异化声明逐条核验（DREAM 五维）③行动清单含"竞品没有而本篇有"≥1 条
> - **标准**（百科/教程类）：完整跑评分流程（评分+最弱部分+行动清单）
> - **轻量**（转化型页面）：仅跑评分 + 一句话结论，跳过逐维度展开
> **关卡前移（批量场景）**：≥20 篇时——①每类模板首篇必跑（>4 分修模板再放量）②每类型抽 10% 复评监测模板漂移 ③单篇 ≥5 分：暂停该模板产出，补强差异化资产后复评。

**执行与验收协议（条款卡模式——防执行层摘要化，2026-10-14 定案；三规则全库统一，文字真源=竞品分析SOP 协议段）**：①**派活=抄卡**——评估任务把评分 prompt 全文+EEAT 三档路由（本文档"EEAT 三档"节）+关卡前移规则**原文整块抄进审核 agent 任务书**，禁指针；②**交付=回执先行**——评估 agent 报告第一部分=**7 条 criteria 逐条回执**（逐条评分+依据，非只给总分叙述），按档位附加最弱部分/行动清单/竞品对比；③**验收=数表**——逐行核回执，缺 criteria/含糊评分一律打回，无逐条回执=评估无效。先例：article-factory 条款全文注入制。

---

## 使用方式

内容生产完成后、发布前，在 Claude Code 中发送：

```text
请阅读以下本地文章文件，以 SEO 内容质量审核员的身份进行 E-E-A-T 评估。

文章文件路径：[填写本地 .md 文件路径]
目标关键词：[填写]
目标市场：[填写]
参考竞品页面（可选）：[填写1-3个竞品URL，用于对比差异化程度]
```

---

## 评估提示词

```text
Act as an SEO content quality reviewer. Read the provided article file and determine whether it is generic commodity content or meaningfully differentiated from typical competing pages.

Do not just answer yes or no. Explain the reasoning with specific references to the article content in Chinese.

Evaluate it using these criteria:
- Original experience or first-hand knowledge
- Unique data, examples, screenshots, testing, or case studies
- Expert insight or clear editorial point of view
- Depth beyond basic definitions and obvious advice
- Usefulness compared with likely top-ranking pages
- Specificity to the audience, product, location, industry, or use case
- Evidence that the author has actually used, tested, researched, or analyzed the topic

Then provide:
1. A clear verdict (commodity vs. differentiated)
2. A commodity-content risk score from 1–10 (1 = highly differentiated, 10 = pure commodity)
3. The weakest/generic parts of the article
4. The strongest/differentiated parts of the article
5. Concrete additions that would make this article harder to copy and more valuable for users
6. A prioritized action list for improving the article
```

---

## 评分参考标准

| 评分 | 等级 | 含义 |
|------|------|------|
| 1-2 | 极低风险 | 内容高度差异化，含独特经验/数据/案例 |
| 3-4 | 低风险 | 大部分内容有价值，个别段落可加强 |
| 5-6 | 中等风险 | 部分内容同质化，需要补充差异化元素 |
| 7-8 | 高风险 | 大面积同质化，缺乏一手经验和独特视角 |
| 9-10 | 极高风险 | 纯搬运/AI生成感强，与竞品无差异 |

---

## 使用建议

1. **发布前必检**：每篇文章发布前跑一次，评分 ≤ 4 才建议发布（批量场景按头部"关卡前移"执行）
2. **竞品对比**：把竞品文章 URL 或本地存档丢进来，对比评分找差距
3. **迭代与批量**：按行动清单修改后复评看分数变化；多篇文章逐个评估后汇总对比找整体短板
4. **线上文章也可评估**：文章上线后，在 Chrome 浏览器中用 Ask Gemini + 同一段提示词做线上复检

---

## 参考资料

- 原文：[Chrome 浏览器的 Ask Gemini 功能，帮你快速判断内容的 E-E-A-T](https://mp.weixin.qq.com/s/75yOkyGrbzMw-uuYJ4iA4A)
- Google 官方对 Commodity Content 的定义（Google Search Central 分享会）
- Maria Haynes 原始提示词思路
