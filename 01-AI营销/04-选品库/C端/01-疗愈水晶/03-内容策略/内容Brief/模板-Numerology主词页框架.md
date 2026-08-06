# Numerology 主词页文章框架（10 篇知识中心）

> **定位**：补 Numerology **知识中心主词页**。现有 12 篇 life path（/life-path-N/）全是"crystals for life path"交叉页，**纯 numerology 知识中心完全空白**。本框架补 10 篇主词深度页，形成"主词页（引流占位争AIO）↔ life path 交叉页（变现）↔ Shop"三层漏斗。
> **依据**：F16 竞争逻辑修正（主词被大站垄断≠不做，主词深度占位争AIO + 交叉抢中尾并行）+ SERP 验证（destiny/soul 等小站主导，极易争）。
> **生成**：2026-07-15。

---

## 一、10 篇选题（SERP 验证，slug 全根级无前缀）

| # | slug | 目标词 | AIO/SERP 信号 | 竞品（小站主导） | 优先级 |
|---|---|---|---|---|---|
| 1 | /numerology/ | numerology | ✅AIO（wikipedia/mindbodygreen 大站，hub 深度占位） | numerologist.com | P1（hub） |
| 2 | /life-path-number/ | life path number meaning | ✅AIO（creativenumerology 小站被引） | creativenumerology | P0 |
| 3 | /destiny-number/ | destiny number / expression number | featured snippet + 无AIO | **mattbeech/astrala/seventhlifepath（小站主导，极易争）** | **P0** |
| 4 | /soul-urge-number/ | soul urge number / heart's desire | 待验（推断小站主导） | 小站 | P0 |
| 5 | /personality-number/ | personality number | 待验 | 小站 | P1 |
| 6 | /birth-day-number/ | birth day number | 待验 | 小站 | P1 |
| 7 | /master-numbers/ | master numbers 11 22 33 | 待验 | 小站 | P1 |
| 8 | /karmic-debt-numbers/ | karmic debt numbers 13 14 16 19 | 待验 | numerologist.com 有深度页 | P1 |
| 9 | /numerology-compatibility/ | numerology compatibility | 待验 | 小站 | P1 |
| 10 | /numerology-chart/ | numerology chart / reading | 待验 | 小站 | P2 |

> P0 三篇（life-path-number/destiny/soul）先做：destiny number 小站主导+featured snippet 可抢，是最高 ROI。
> 标"待验"的：生产前用 serp_check（us/en/mobile）补验 AIO/头部，确认生态后定稿（content-must-have-evidence）。**补验时必须填入具体竞品 URL（不能只写"小站"），否则"待验"变"待编"。**

---

## 二、主词页统一结构模板（争 AIO 引用）

竞品标杆结构（Mattbeech 实抓验证）：**What Is → How to Calculate → by Number → Beyond**。本框架在此基础加 AIO 优化段 + 水晶交叉 + 东方锚点：

```
H1 {主词}（含明确定义短语，如 "Destiny Number: Your Life's Purpose in Numerology"）

H2 Quick Answer / At a Glance          ← 速答卡（定义+一句话+核心数字表），AIO 最爱引用片段
H2 What Is the {X} Number?             ← 定义段 80-120 字，AIO 定义抽取源
H2 {X} Number Explained                ← 深度主体
   H3 How to Calculate（编号步骤 1-5，灵数必含计算公式）
   H3 {X} Numbers by Value（1-9 / 11/22/33 / 13/14/16/19 等对照表，结构化）
   H3 Meaning & Interpretation（bullet list）
H2 Key Facts / Table                   ← 结构化表（数字×关键词×特质），AIO 引用结构化数据
H2 {X} Number and Crystals             ← 水晶交叉段：内链现有 12 life path + Shop CTA
H2 Frequently Asked Questions          ← 6-8 问（抓 PAA）+ FAQPage schema
H2 Related                             ← 集群互链（兄弟主词页 ↔ life path 交叉页）
```

**东方锚点段**（每篇加，独家差异化，竞品零覆盖）：数字×东方数理——洛书/河图数字观、七曜（日月火水木金土）对应、藏传数字学。差异化于 numerologist.com 等纯西方站。⚠️ **灵数本质是毕达哥拉斯西方体系，东方数理（洛书/河图/七曜）是"平行参照非历史对应"，必须注明，避免文化挪用嫌疑。**

---

## 三、水晶交叉段（变现承接）

每篇 "{X} and Crystals" 段：
- **内链现有 12 life path 交叉页**（/life-path-1/ ... /life-path-33/）：按该主词相关的 life path 推荐（如 destiny number 段链"Life Path 与 Destiny Number 关系"+"Best crystals for life path N"）
- **Shop CTA 三级降级**（shop-cta-no-deadlink-rule）：
  1. 类目页 `/product-category/{stone}-crystals/`（先验 200）
  2. 产品搜索 `/shop/?s={stone}`（基本都有）
  3. 兜底 `/shop/healing-jewelry/` 或 `/shop/`
- 数据层：调 `_shared/` 390 库 byIntention/byStone 查询，复用 life path 交叉页的水晶数据

---

## 四、QC 门（生产后逐篇过）

1. **去 AI 化**：禁"delve into/unlock the power/in conclusion"等 AI 套话；每篇独特角度
2. **站内重复度**：content_duplicate_checker，主词页之间 + 与 12 life path 交叉页重复度 < 阈值（主词页讲"概念"，life path 讲"水晶"，天然区分）
3. **确定论合规**：禁"必定/保证/一定"等（灵数是 reflection 非预测）；加 disclaimer（复用 gentle-note 组件）
4. **计算准确性**：How to Calculate 段的公式（Pythagorean / Chaldean）必须正确，destiny/soul/personality 公式不同（destiny=字母和/ soul=元音/ personality=辅音），易错需核
5. **FAQ schema**：FAQPage 结构化数据写入 rank_math schema 或 content
6. **Schema**：Article + FAQPage + BreadcrumbList（**禁 Product 前端渲染**）

---

## 五、URL 规则与生产复用

- **URL 全根级无前缀**：/destiny-number/、/soul-urge-number/（**非** /numerology/destiny-number/）。符合 site-url-rule-post-vs-category-archive。
- **生成器**：复用 `10.numerology/scripts/generate-articles.js`（/numerology/ 前缀 bug 已修 2026-07-15）。新增 configs 文件（如 `configs/destiny-number.json` 等）+ 复用脚本模板切换。
- **数据层**：`_shared/` 390 库 + 现有 KNOW.numbers（numerology 数据层，含 module_weights）。
- **图片**：moleapi 流水线（hero + 计算 diagram）。
- **部署**：WP REST + base64 + Rank Math TKD（curl/8.0.0 UA）。
- **内链**：主词页 ↔ 12 life path 双向（cluster 模式）。

---

## 六、与现有线关系

- **现有 12 life path 交叉页**：保留（crystals for life path，变现主力）。本框架主词页是**知识中心上层**，内链导流到 life path。
- **/numerology/ hub**：聚合 9 个主词页 + 12 life path，总入口。
- **不冲突**：主词页讲概念（what is/calculate/meaning），life path 讲水晶（best crystals for），URL 与主题区分清晰，无 cannibalization。
- **⚠️ Cannibalization 边界（二审必修）**：/life-path-number/ 主词页只写 life path number **整体概念 + 怎么算 + 1-9 总览**，1-9 各数字的**独立深度解读归现有 /life-path-N/ 交叉页**，主词页不展开各数字深度。/numerology-compatibility/ 同理只写 compatibility 概念+方法，具体 life path 配对归交叉页。

---

*框架版本 v1 · 2026-07-15 · 依据 F16 主词页方案 + SERP 验证 + Mattbeech 竞品结构 · 待框架二审门通过后生产*
