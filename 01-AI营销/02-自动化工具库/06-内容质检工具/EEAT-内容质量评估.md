# E-E-A-T 内容质量评估工具

> **定位**：文章发布前的最后一道质检关卡。评估内容是否符合 Google E-E-A-T 标准，识别同质化（Commodity Content）风险。
> **来源**：基于 Simon（赛门快跑）分享的 Chrome Ask Gemini 提示词，适配 Claude Code 本地文件评估场景。
> **适用阶段**：内容生产完成后 → 发布前质检

---

## 使用方式

在 Claude Code 中发送：

```text
请阅读以下本地文章文件，以 SEO 内容质量审核员的身份进行 E-E-A-T 评估。

文章文件路径：[填写本地 .md 文件路径]
目标关键词：[填写]
目标市场：[填写]
参考竞品页面（可选）：[填写1-3个竞品URL，用于对比差异化程度]
```

Claude Code 会读取文件并执行下方评估提示词。

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

1. **发布前必检**：每篇文章发布前跑一次，评分 ≤ 4 才建议发布
2. **竞品对比**：把竞品文章 URL 或本地存档丢进来，对比评分找差距
3. **迭代使用**：根据行动清单修改后，重新评估，看评分是否下降
4. **批量检测**：多篇文章逐个评估后汇总对比，找出整体内容短板
5. **线上文章也可评估**：文章上线后，在 Chrome 浏览器中用 Ask Gemini + 同一段提示词做线上复检

---

## 参考资料

- 原文：[Chrome 浏览器的 Ask Gemini 功能，帮你快速判断内容的 E-E-A-T](https://mp.weixin.qq.com/s/75yOkyGrbzMw-uuYJ4iA4A)
- Google 官方对 Commodity Content 的定义（Google Search Central 分享会）
- Maria Haynes 原始提示词思路
