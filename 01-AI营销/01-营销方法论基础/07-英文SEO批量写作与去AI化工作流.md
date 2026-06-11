# 英文 SEO 内容营销生产工作流

> 本文件是 RLM 体系下的内容营销专项方法论，负责把内容清单、关键词库和策略清单转化为可发布、可质检、可复盘的英文 SEO 内容。
>
> 核心解决三个问题：**写什么**、**怎么批量写**、**如何保证不像 AI 拼出来的薄内容**。

---

## 与 RLM 流程的关系

本文件是 `00-RLM营销方法论-执行版.md` 中**步骤 3.5（内容生产边界）**的执行层展开，对应执行版分层关系中的"07-批量写作 = 执行层"。同时对接 `02-SEO全链路工作流.md` 的 Content Generation、Quality Check、Monitoring 环节。

**输入/输出关系**：
- 输入：`Seed-Master` 关键词主表（1B 轨道B/D 提供）、竞品证据增强结果、1F 内容策略分析、1H 策略清单、页面承接关系、`06-内容Brief模板.md`
- 输出：内容清单批次、内容 Brief、英文初稿、编辑稿、质检报告、发布记录、内链地图、复盘更新项
- 反向更新：质检和发布表现反向更新关键词主表、内容清单、Brief 模板和后续发布节奏

**适用场景**：
- 水晶/疗愈类产品的英文 SEO 博客批量写作
- 任何需要大规模生产高质量英文内容的 DTC 品牌站

**不负责的内容**：
- 不替代 1C 关键词研究，不重新造关键词库
- 不替代 1F/1H 做策略决策，只承接已经形成的候选方向和策略条目
- 不替代技术 SEO 审计，发布后的抓取、索引和性能问题交给 `02-SEO全链路工作流.md`

---

## 方法论定位

这是一份**内容营销生产方法论**，不是资料库、词库或单篇写作教程。

它要回答的是：当 RLM 已经完成关键词、竞品、用户画像和策略清单之后，内容团队如何稳定地产出一批英文 SEO 内容，并让每篇内容都具备信息增量、品牌语气、发布价值和复盘入口。

**保留原则**：
- 只保留能指导执行的流程、字段、门槛、产出物和验收项
- 资料来源只作为方法依据，不在主流程中堆砌研究摘录
- 去 AI 化不是独立目标，而是内容质量门禁的一部分
- "能让东西看起来不像 AI 做的，本身就是一种稀缺能力"——Dan Shipper (Every)
- 批量生产不能跳过 Brief、素材证据、人工编辑和发布复盘

---

## 工作流总览

```
内容清单锁定 → 批次规划 → Brief → 起草 → 编辑/去AI化 → 质检 → 发布/内链 → 复盘
   List         Batch       Brief   Draft     Edit        QA       Publish     Review
```

### 阶段门槛

| 阶段 | 进入条件 | 产出物 | 不通过时 |
|------|---------|--------|----------|
| 内容清单锁定 | 关键词、意图、承接页面、竞品验证状态已标注 | 本批内容清单 | 回到 1C/1F 补数据 |
| 批次规划 | 确定本批主题、数量、发布节奏和资源 | 批次计划 | 缩小批次，不硬写 |
| Brief | 每篇内容有搜索意图、素材证据、结构和差异化点 | Brief 文件 | 不进入起草 |
| 起草 | Brief 已确认，语气参考已明确 | AI 初稿 | 缺素材则补 Brief |
| 编辑/去 AI 化 | 初稿完整，事实和引用可追溯 | 编辑稿 | 打回重写或局部重写 |
| 质检 | 编辑稿完成，内链和 Schema 候选已列出 | QA 报告 | 未达门槛不发布 |
| 发布/内链 | QA 通过，URL、分类、Meta、Schema 已确认 | 已发布内容 + 内链记录 | 暂存草稿 |
| 复盘 | 索引、排名、点击、转化或辅助指标可观察 | 复盘记录 | 更新清单和 Brief 模板 |

### 按生产规模选择模式

| 批次规模 | 推荐模式 | 人工介入点 |
|--------|---------|-----------|
| 1-3 篇 | 单篇精修 | Brief 确认、逐段编辑、终审 |
| 5-15 篇 | 小批次流水线 | Brief 批审、首篇样稿锁定、逐篇 QA |
| 20-40 篇 | 模板化流水线 | 先做 3-5 篇试点，通过后复制流程；QA 不得省略 |

> 不建议一上来按日生产量倒推写作任务。先按主题批次跑通闭环，再决定是否扩大规模。

---

## 第一步：内容清单锁定（List）

**做什么：** 从 RLM 内容清单中选出本批可生产内容，确认每篇内容都有关键词、意图、承接页面和信息增量依据。

**操作方法：**

1. 从内容清单中筛选本批候选内容，不直接从零散关键词开始写
2. 检查每条内容是否具备以下字段：
   - 主关键词、次关键词、搜索意图、Volume/KD/CPC（缺失则标记待补）
   - 主题簇 / Content Pillar
   - 目标读者阶段：认知、考虑、决策、转化
   - 承接页面或目标 URL
   - 竞品验证证据：Proof URL、Proof Traffic、竞品内容缺口
   - 差异化角度：来自 1F/1H，不临场编造
3. 对 SERP 高度重叠的关键词合并为一篇，避免内部蚕食
4. 对同主题但意图不同的关键词拆成不同内容，不为了覆盖词而塞进一篇

**产出物：** 本批内容清单（文章标题暂定 | 主关键词 | 次关键词 | 意图 | Pillar | 承接页面 | 证据来源 | 差异化角度 | Brief 状态）

**可调用工具：**
- 竞品内容模式分析：`../02-自动化工具库/05-竞品内容分析工具/content_analyzer.py`
- 用途：批量抓取竞品文章的 title、meta、H1、H2，识别竞品内容类型分布和内容空白
- 输出应进入 1F 内容策略分析或本批内容清单的“证据来源/差异化角度”字段，不直接替代策略判断

**进入下一步门槛：**
- 每篇内容至少有 1 个明确的信息增量来源
- 未完成竞品验证的内容可以保留在清单中，但不能进入正式 Brief
- 找不到承接页面或内链位置的内容，先暂缓

---

## 第二步：批次规划（Batch）

**做什么：** 把内容清单拆成可执行批次，避免一次性生成大量低质量稿件。

**批次划分规则：**

| 批次类型 | 适用内容 | 建议规模 | 目标 |
|---------|---------|---------|------|
| 试点批 | 新主题、新语气、新内容类型 | 3-5 篇 | 验证 Brief、语气、QA 门槛 |
| 主题批 | 同一 Pillar 下的系列内容 | 5-15 篇 | 建立主题覆盖和内链网络 |
| 扩展批 | 已验证模板的同类内容 | 10-30 篇 | 扩大覆盖，但保持质检 |

**批次计划必须写清：**
- 本批主题范围和不做范围
- 发布顺序，不用抽象优先级
- 每篇内容对应的上游证据来源
- 首篇样稿，用来锁定结构和语气
- 预计内链关系：指向哪个 Pillar、哪些相关文章互链

**产出物：** 内容生产批次计划

---

## 第三步：内容 Brief（Brief）

**做什么：** 批量生成内容 Brief，锁定写作方向后再起草，防止返工。

**操作方法：**

1. 基于本批内容清单和批次计划，使用 `blog-brief` Skill 或模板生成 Brief
2. 每篇 Brief 必须包含：
   - 目标关键词（主 + 次）
   - 搜索意图和目标用户
   - 推荐大纲（H2/H3 结构）
   - 必含信息点（从竞品内容缺口提取）
   - 素材来源/引用要求
   - GEO 优化要求（FAQ、Schema、摘要框）
3. **批量审阅**：一次审 10-20 篇 Brief，确认方向正确后批量进入起草

**产出物：** 已确认的 Brief 文件（Markdown）

> 详见 [06-内容Brief模板.md](03-模板库/06-内容Brief模板.md)

**Brief 不合格表现：**
- 只有关键词和标题，没有素材证据
- 只复述竞品内容，没有信息增量
- 大纲看似完整，但没有说明每个 H2 要回答什么问题
- 没有定义读者阶段，导致文章语气和 CTA 混乱

### 外部参考：Fan-out 驱动的提纲生成思路

> 来源：「SEO技术流」zhidaow.com 自研工具的设计逻辑

一种高效的 Brief/提纲生成流水线，将 Query Fan-out、竞手差距分析、PAA 三步串联：

```
步骤1：关键词扇出（Fan-out）
  → 模拟AI搜索的查询扩展，把目标关键词拆为用户的主要/次要/隐含子需求
  → 工具参考：Queryfanout.ai、zhidaow.com 免费提纲工具

步骤2：竞手内容差距分析
  → 拉取 Google 首页排名页面，分析竞手已覆盖 vs 遗漏的话题
  → 原则："你有我有，你无我也有"

步骤3：PAA → FAQ 生成
  → 挖掘 People Also Ask 问题，生成文章 FAQ 段落
  → 同时提升用户需求覆盖率和 GEO 引用率
```

**核心原则**：用户关注的主要需求一定要覆盖 + 竞手遗漏的需求一定要覆盖 = 差异化。

**提纲生成后的人工增值环节**（不可省略）：
1. **补充真实经验**：日常经验、行业认知，产出超越通用 AI 的内容（E-E-A-T）
2. **务必加入 CTA**：公司介绍、主推产品、核心优势
3. **补充更多语料**：产品列表、用户画像、使用场景、站内数据、行业趋势
4. **给出内链需求**：让 AI 在生成时自然嵌入链接

**工具推荐**：zhidaow.com/tools/article-outline/（免费，英文关键词输入 → 中文提纲输出，含建议字数和段落简介）

---

## 第四步：AI 起草（Draft）

**做什么：** 按 Brief 用 AI 批量生成初稿。

**核心原则：AI 是 Draft Button，不是 Create Button。**

### 9 步写作流程

```
收集需求 → 加载质量标准 → 调研/规划 → 创建标题 → 写 Meta → 结构化写作 → On-page 优化 → 添加内链 → 终审
```

### 批量起草技巧

- **Prompt 模板化**：每类内容（博客、产品页、FAQ）用固定 Prompt 模板
- **反模式提示词**：在 Prompt 中直接排除 AI 写作模式（详见下方「反模式提示词」章节）
- **分批生成**：每批 5-10 篇，生成后立即进入 QA，避免批量错误
- **先样稿后批量**：新主题先生成 1 篇样稿，确认结构、语气和信息密度后再扩大批次
- **保留证据链**：初稿中涉及事实、产品、数据、引用、竞品观察的内容必须能追溯到 Brief

**产出物：** AI 初稿文件（Markdown）

**不能进入编辑的情况：**
- 初稿没有按 Brief 回答核心问题
- 关键事实没有来源，且无法快速补证据
- 内容明显偏离搜索意图，只是在套通用文章结构

---

## 第五步：编辑与去 AI 化

> 这是把 AI 初稿变成可读、可信、有品牌语气内容的核心环节。

### 5.1 七大 AI 写作特征识别

编辑时，逐项检查以下特征：

| # | 特征 | 典型表现 | 严重度 |
|---|------|---------|--------|
| 1 | **否定/对比结构** | "It's not just X, it's Y"、"We don't just sell crystals, we create experiences" | 高 |
| 2 | **可预测节奏** | 句子长度一致（15-20 词），段落像"完美矩形"，缺乏 burstiness | 高 |
| 3 | **AI 专属词汇** | delve, leverage, tapestry, landscape, seamless, robust, realm | 高 |
| 4 | **通用过渡词** | Furthermore, Moreover, Additionally, In conclusion | 中 |
| 5 | **虚假共情/体验** | "Picture this...", "As a crystal lover, you know..." | 高 |
| 6 | **模糊总结结尾** | "At the end of the day", "Ultimately"，回顾式收尾 | 中 |
| 7 | **过度修饰** | 用 "paramountly significant" 替换 "important"（更假） | 中 |

### 5.2 六大去 AI 化实操技术

#### 技术一：Pub Test（酒吧测试）

把句子大声读出来。你会这样对朋友/同事说吗？

| AI 版 | 人类版 |
|-------|--------|
| "We empower users to optimize their crystal healing journey." | "We help you get more from your crystals." |
| "This bracelet facilitates emotional balance and inner harmony." | "This bracelet helps you feel calmer." |
| "Our products leverage the multifaceted properties of amethyst." | "Our amethyst pieces use the stone's natural calming energy." |

#### 技术二：First 10% Deletion Rule（前 10% 删除法则）

几乎所有 AI 文章的真正内容从第二段才开始。删掉 AI 的"礼貌性清嗓"，直接从冲突/痛点切入。

| AI 版 | 人类版 |
|-------|--------|
| "In this article, we will explore the transformative benefits of crystal healing bracelets and how they can enhance your daily wellness routine." | "Your anxiety doesn't care about your schedule. But the right crystal bracelet might." |
| "Crystal healing has been practiced for centuries, offering a holistic approach to wellness that resonates with many modern seekers." | "I wore my first amethyst bracelet to a job interview. I got the job. Coincidence? Maybe. But I haven't taken it off since." |

#### 技术三：High-Low Technique（高低交替）

长句（复杂、解释性）后面跟一个短句（锐利、有力）。打破 AI 产生的"完美矩形"段落。

**Before（AI 节奏）：**
> Crystal healing bracelets work by interacting with your body's energy field. Each stone carries unique vibrational properties that promote balance. Wearing these bracelets daily can help align your chakras.
> （三句等长 ≈ 15-18 词，像完美矩形）

**After（人类节奏）：**
> Crystal healing bracelets interact with your body's energy field, and each stone carries vibrational properties that promote balance when worn consistently against the skin. It sounds woo-woo. But millions swear by it. The key is consistency — wear it daily, not just when you remember.

#### 技术四：Kill List Audit（禁用词审计）

每篇文章过一遍禁用词列表（见下方「AI 禁用词汇库」），命中即替换。

替换原则：
- 用**具体名词**或**主动动词**替换 AI 词汇
- 不是 "weave a tapestry of solutions"，而是 "combine these stones"
- 不是 "navigate the complex landscape"，而是 "find your way through"

#### 技术五：Human Sandwich Workflow（人类三明治）

```
人类策略（决定写什么/怎么写）→ AI 起草 → 人类编辑（去 AI 化 + 注入个性）
```

- 人类必须是第一步和最后一步
- 如果 AI 是第一步和最后一步，流程就是坏的
- AI = 研究助手 + 糟糕的创意总监

#### 技术六：Anti-Pattern Prompting（反模式提示词）

在 Prompt 中直接排除 AI 写作模式，减少后期编辑量：

```
WRITING RULES — MANDATORY:
- Never use contrastive/negation structures ("It's not just X, it's Y" or "X goes beyond Y")
- Never start with "In today's [adjective] [noun]" or "Let's dive in"
- Never use em dashes for dramatic effect
- Vary sentence length aggressively (some 5-word sentences, some 30-word sentences)
- Use contractions (it's, don't, won't, can't)
- No hedging ("It could be argued", "Generally speaking", "aims to")
- End with forward momentum, not a summary
- Replace every word on the Kill List (see below) with a concrete alternative
```

### 5.3 去模板化：内容层去重

> 去AI化解决的是"语言层不像机器人"（词汇、句式、节奏），去模板化解决的是"内容层不像流水线"（判断、细节、场景、边界）。两者互补，缺一不可。

#### 核心测试：三道门禁

每篇文章在编辑阶段必须通过以下三道测试。任一不通过，需补充后才能进入 QA。

**测试一：独有判断测试**

> 删掉品牌名和产品名，这篇文章还能认出是我们的吗？

- 每篇文章至少包含 **1 个独有判断**——一个只有你的品牌/作者才会做的结论、观点或推荐
- 来源可以是：产品实测数据、客户反馈总结、竞品对比结论、行业趋势判断
- 不能是"Crystal healing is a powerful practice"这种正确但任何竞品都能写的话

**测试二：对象细节替换**

> 把文中的产品名替换成竞品名称，文章还能成立吗？

- 如果把"our amethyst bracelet"换成"brand X amethyst bracelet"文章依然通顺 → 说明文章没有写出自己产品的独特细节
- 必须包含：具体的产品参数、使用场景、客户故事、实测对比等只有你才知道的信息
- 替换泛泛形容词（"beautiful", "powerful", "amazing"）为可验证的具体描述（"7mm round beads", "weighs 28g", "sourced from Uruguay"）

**测试三：边界声明**

> 文章是否包含了"不确定"和"不适用"的内容？

- AI 倾向于写"什么都适用"的万金油内容。人类编辑要补上边界：
  - 哪些人不适合这个产品？（"Not recommended if you're sensitive to strong energy shifts"）
  - 哪些说法没有科学依据？（"While many users report feeling calmer, this hasn't been clinically proven"）
  - 哪些是主观体验？（"In my experience..."）
- 有边界声明的文章反而更可信，也更不像 AI 写的

#### 量化门禁

| 指标 | 门槛 | 检测方式 |
|------|------|---------|
| 站内页面相似度 | **≤ 70-80%** | 站内重复检测工具（`content_duplicate_checker.py`） |
| 独有判断数量 | ≥ 1 条/篇 | 编辑人工检查 |
| AI 禁用词命中 | ≤ 5 处/篇 | Kill List Audit |
| "正确但无用"段落 | 0 个 | 编辑判断：删掉这段后读者会损失什么？如果答案是"没什么"→ 删掉重写 |

#### 批量生产的分级策略

不是所有文章都需要同等级别的去模板化投入。根据内容层级分配编辑资源：

| 内容层级 | 描述 | AI 参与度 | 去模板化要求 |
|---------|------|----------|-------------|
| 基础信息类 | 产品参数、基础科普、FAQ | AI 为主 | 通过三道门禁即可 |
| 观点解读类 | 趋势分析、使用指南、对比评测 | AI + 人类 | 三道门禁 + 独有判断需有素材支撑 |
| 深度价值类 | 实测报告、客户案例、行业洞察 | 人类 + AI | 完整编辑流程 + 人工逐段审阅 |

### 5.4 编辑责任边界

| 角色 | 负责内容 | 不负责内容 |
|------|---------|-----------|
| Brief 审阅 | 搜索意图、素材证据、结构方向 | 逐句润色 |
| 写作/起草 | 按 Brief 生成完整初稿 | 临场新增未经验证事实 |
| 编辑 | 去 AI 化、提升可读性、补足信息增量 | 改写成另一篇没有证据的文章 |
| SEO QA | 标题、Meta、Schema、内链、意图匹配 | 用关键词密度替代内容质量 |
| 事实 QA | 引用、产品信息、数据、医疗/功效边界 | 替作者编造经验 |

### 5.5 编辑完成检查清单

- 标题和 H1 不标题党，能准确覆盖主关键词意图
- 前 10% 没有空泛铺垫，直接进入读者问题
- 每个主要 H2 都提供新信息，而不是换句话重复标题
- 文章至少有 1 个来自项目自身的证据、观察、产品信息或差异化观点
- **通过三道门禁**：独有判断测试、对象细节替换、边界声明
- AI 禁用词和典型句式已清理
- 内链位置、锚文本和目标页面已标注
- FAQ / Schema / Meta description 已准备
- 涉及功效、健康、疗愈、数据的表述已加边界或来源

**产出物：** 编辑稿

---

## 第六步：内容质检（QA）

**做什么：** 对编辑稿进行发布前门禁，确认内容不是同质化薄内容，也没有事实、原创性、站内重复或 SEO 基础问题。

本文件只定义 QA 在内容生产流程中的位置和通过条件；具体 E-E-A-T 评估提示词、评分解释和执行方法放在工具文档中维护。

**发布前必须调用：** [EEAT-内容质量评估.md](../02-自动化工具库/06-内容质检工具/EEAT-内容质量评估.md)

**按需调用工具：**
- 站外原创性检测：`../02-自动化工具库/05-竞品内容分析工具/content_originality_checker.py`
  - 用于对比预览页/已发布页与竞品页面的段落级 N-gram 重合度
  - 适合检查“是否和竞品写得太像”，不替代 E-E-A-T 语义判断
- 站内重复检测：`../02-自动化工具库/05-竞品内容分析工具/content_duplicate_checker.py`
  - 用于批量检查本站已发布内容之间是否近似重复
  - 适合月度巡检或大批量发布后复查，不要求每篇文章发布前都跑

**QA 门禁规则：**
- Commodity-content 风险分 > 4：不建议发布，先补充差异化信息
- 出现虚假经验、虚假数据、标题党或事实矛盾：直接打回
- 搜索意图错配：回到 Brief，不只做句子级润色
- AI 禁用词命中 > 5 处：打回编辑
- 文章没有内链、Meta、FAQ/Schema 候选：暂存草稿，不进入发布
- 站外原创性检测为低原创：重写高重合段落，不能只替换同义词
- 站内重复检测发现高度重复：合并、改写或 canonical 处理后再发布/保留

**产出物：** E-E-A-T 质检报告 + 通过/打回决定

---

## 第七步：发布 + 内链网络

**做什么：** 批量发布内容 + 构建站内链接网络。

**操作方法：**

1. **批量发布**：通过 CMS API（Shopify/WordPress）或发布插件自动化
2. **内链建设**：
   - 簇内文章互相链接（同主题关键词的文章交叉引用）
   - 所有簇文章指向对应的 Content Pillar 页面
   - Pillar 页面链接到产品页（转化入口）
3. **发布记录**：记录 URL、发布时间、目标关键词、所属 Pillar、内链目标、QA 结果
4. **发布后监控**：索引速度 → 排名 → 流量 → 点击 → 转化或辅助转化

**产出物：** 已发布内容 + 内链地图

---

## 第八步：复盘与模板更新

**做什么：** 用发布表现反向更新内容清单、Brief 模板、禁用词和后续批次计划。

**复盘节奏：**

| 时间点 | 看什么 | 决策 |
|-------|-------|------|
| 发布后 7-14 天 | 是否收录、是否被抓取、基础展现 | 技术或索引问题交给 SEO 工作流 |
| 发布后 30 天 | 初始排名、点击、查询词偏差 | 调整标题、Meta、内链或补段落 |
| 发布后 60-90 天 | 稳定排名、转化、辅助转化 | 决定扩写、合并、重写或作为模板复用 |

**复盘输出：**
- 表现好的结构：回写到 Brief 模板
- 表现差的原因：标注为意图错配、证据不足、标题问题、内链不足、内容薄弱或竞争过强
- 新发现关键词：回写到 Seed-Master 或待验证池
- 反复出现的 AI 味问题：回写到禁用词和编辑清单

---

## AI 禁用词汇库

> 本词库用于 Prompt 约束和编辑审计，命中后优先替换为具体名词、主动动词或更自然的短语。

### 动词类（最常见的 AI 标志词）

> delve, leverage, foster, ignite, empower, uncover, unleash, underscore, optimize, streamline, navigate, demystify, elevate, spearhead, catalyze, orchestrate, harness, augment, synergize, encapsulate, elucidate, contextualize, amalgamate

### 形容词/副词类

> cutting-edge, seamless, robust, future-ready, multifaceted, pivotal, dynamic, scalable, comprehensive, unwavering, meticulous, adept, intricate, nuanced, paramount, quintessential, bespoke, ubiquitous, transformative, revolutionary, game-changing, groundbreaking

### 名词/隐喻类

> tapestry, landscape, realm, beacon, symphony, testament, journey, roadmap, ecosystem, paradigm, crucible, cornucopia, nexus, zenith, harbinger, constellation, mosaic, labyrinth

### 过渡短语类

> Furthermore, Moreover, Additionally, In conclusion, At the end of the day, Ultimately, In essence, It is important to note, It is worth noting, In the grand scheme of things, On a broader scale

### 句式结构类（模式，不是词）

| 模式 | 替代方案 |
|------|---------|
| "In today's [adj] [metaphor]..." | 直接切入主题 |
| "Let's dive in" | 删掉，直接开始 |
| "Picture this..." | 用具体的、有细节的场景替代 |
| "At its core..." | 直接说核心观点 |
| "Imagine a world where..." | 用真实数据或故事替代 |
| "It's not just X, it's Y" | 直接说 Y |
| "We don't just X, we Y" | 直接说 Y |
| "X goes beyond Y" | 直接说 X 的具体表现 |

### 替换原则

> 通用替换原则：用**具体名词**或**主动动词**替换 AI 词汇。不是替换同义词，而是降级到日常用语。
>
> 例：leverage → use，navigate → deal with，tapestry → mix，seamless → smooth，cutting-edge → new，robust → reliable。完整对照见上方词表。

---

## AI 风格指南构建方法

### 三级体系

| 级别 | 适用场景 | 包含内容 | 构建时间 |
|------|---------|---------|---------|
| **Level 1 入门** | 刚开始用 AI 写作 | 3-5 条语调描述 + 简单结构 + 5-10 个禁用模式 + 2-3 个正面案例 | 20 分钟 |
| **Level 2 工作** | 每日用 AI 起草 | + 句子级偏好 + 命名特色手法 + 修订检查清单 + 结构模板 + 扩展反模式 | 数月迭代 |
| **Level 3 复合系统** | AI 是核心工作流 | + 自动化检查 + 工作流集成 + 反馈循环（每次错误 → 更新指南） | 持续迭代 |

### 8 模块模板

1. **Voice & Tone（语调）**：3-5 条描述，含张力和边界（如 "温暖但不玄乎，专业但不学术"）
2. **Structure（结构）**：文章如何开头、如何展开、如何结尾
3. **Sentence-level Preferences（句子级偏好）**：长短句比例、标点习惯、节奏
4. **Signature Moves（特色手法）**：你的写作有什么独特点？
5. **Anti-patterns / Blacklist（反模式/黑名单）**：上面那张禁用词表就是起点
6. **Positive Examples（正面案例）**：你觉得写得好的段落，附注"为什么好"
7. **Negative Examples（反面案例）**：AI 味重的段落，附注"哪里假"
8. **Revision Checklist（修订检查清单）**：发布前过一遍的问题清单

### 构建方法

不要自己写风格指南——让 AI 采访你提取偏好：给 AI 3-5 篇代表性文章 → AI 通过对比提问提取偏好（"这两段你更喜欢哪个？为什么？"） → 对具体文本做反应，不描述抽象风格 → AI 综合对话生成草稿 → 用一周找到还在重复纠错的地方 → 更新指南。

---

## 内容生产边界合规检查项

每个批次结束时，用下面清单判断工作流是否合格：

| 检查项 | 合格标准 |
|--------|---------|
| 上游边界 | 内容来自 RLM 内容清单，不绕过 1C/1F/1H 临场选题 |
| 数据边界 | 缺失 Volume/KD/CPC 或竞品验证时明确标记，不编造 |
| Brief 边界 | Brief 包含素材证据、搜索意图、差异化点和结构要求 |
| AI 使用边界 | AI 负责起草，不负责最终事实、策略和发布判断 |
| 编辑边界 | 编辑稿消除 AI 腔，同时保留证据链和搜索意图 |
| 质量边界 | 未通过 QA 的文章不发布，不能用“先发再说”绕过 |
| 发布边界 | 每篇文章有 URL、内链、Meta、Schema 或对应待办 |
| 复盘边界 | 发布表现必须回写到内容清单或模板，不只看单篇成败 |

---

## 内容集群自动化流程

> **来源**：黄子阳（跨境女装卖家），出海指南AI私享会 2026.05
>
> 本节是对上面八步工作流的增强，聚焦"如何用 AI 从数据中自动发现内容机会并批量生产"。

### 自动化内容集群工作流

```
多源数据采集 → AI 关键词聚类 → 内容缺口发现 → 自动生成集群 → 余弦相似度去重 → 批量生产
```

**Step 1：多源数据采集**

| 数据源 | 采集内容 | 工具 |
|--------|---------|------|
| Reddit | 用户真实痛点和讨论主题 | `11-用户洞察工具/reddit_comment_collector.py` |
| Amazon 评论 | 竞品用户反馈、产品改进需求 | Apify / 手动导出 |
| 社媒评论 | TikTok/YouTube 用户关注点 | DataForSEO MCP |
| Semrush | 关键词搜索量/KD/竞品页面 | `02-竞品研究工具/semrush_to_sheets.py` |

**Step 2：AI 关键词聚类（内容集群发现）**

将关键词按语义自动归入集群，找到机会词：

```
输入：Semrush 导出的 20万+ 关键词
  ↓
AI 聚类：按搜索意图和主题自动分组
  ↓
输出：内容集群 + 每个集群的机会词（高搜索量、低 KD）
  ↓
决策：确定每个集群的 Pillar 页面和支撑文章
```

**Step 3：余弦相似度去重（防关键词蚕食）**

> **问题**：批量生产时容易出现多篇文章标题和主题高度重叠，导致站内关键词蚕食（自己和自己竞争）。

**方法**：用余弦相似度计算文章标题的重复度，超过阈值的合并或改写。

```
每篇文章标题 → 文本向量化（embedding）
  ↓
计算所有标题对之间的余弦相似度
  ↓
相似度 > 阈值（建议 0.85）→ 标记为潜在蚕食
  ↓
人工判断：合并为一篇 or 调整角度差异化
```

**与现有工具的关系**：`10-SEO审计工具/keyword_cannibalization_checker.py` 做的是发布后的关键词蚕食检测；余弦相似度去重做的是**发布前**的标题级预防。两者互补。

**Step 4：结构化数据自动化**

每篇文章发布前，AI 自动补全结构化数据（JSON-LD Schema），提升搜索可见性和 AI 可解析性：

| Schema 类型 | 适用内容 | AI 自动生成字段 |
|------------|---------|----------------|
| Article | 博客文章 | headline, datePublished, author, image |
| FAQ | 问答型内容 | 多个 Q&A 对 |
| HowTo | 教程型内容 | steps, tools, materials |
| Product | 产品相关文章 | name, description, image, offers |
| Review | 评测类文章 | reviewRating, itemReviewed |

**Step 5：自动选题 → 文章生成**

```
VOC 痛点库 + 内容集群 + 机会词
  ↓
AI 自动匹配：哪个痛点 × 哪个集群 × 哪个机会词
  ↓
自动生成文章主题和标题
  ↓
进入上方八步工作流（Brief → Draft → Edit → QA → Publish）
```

### AI 文章幻觉处理

> 批量生产时 AI 幻觉（生成虚假信息）风险更高。

**解决方案**：利用公司知识库让 AI 检测 AI。

1. 建立品牌知识库（产品参数、真实数据、客户反馈）
2. AI 生成初稿后，用另一个 AI 模型对照知识库逐段验证
3. 标记无来源支撑的事实声明
4. 人类审核标记内容，决定保留、补充来源或删除

### 多模型融合写作

不同大模型有不同写作特点，可结合使用提升质量：

| 模型 | 擅长方面 | 用途 |
|------|---------|------|
| Claude | 长文逻辑、结构化写作 | 文章主体段落 |
| Gemini | 数据分析、事实整合 | 数据密集段落 |
| Gemini Pro | 拼接和整合 | 最终稿组装 |

**操作方法**：用 Claude 写 A 段、Gemini 写 B 段，最后用 Gemini Pro 拼接为完整文章，确保各段风格统一。

---

## 方法论来源索引

| 来源 | 贡献 |
|------|------|
| aaron-he-zhu/seo-geo-claude-skills | 9 步写作流程、CORE-EEAT 基准框架 |
| OliviaCal (oliviacal.com) | Pub Test、First 10% Deletion、High-Low Technique、Human Sandwich |
| Jodie Cook Ban List (jodiecook.com) | AI 禁用词汇库主体 |
| Blake Stockton (blakestockton.com) | Anti-Pattern Prompting、否定结构分析 |
| Every.to | 风格指南三级体系、8 模块模板 |
| SUSO Digital | 人性化编辑技术与 AI 检测特征 |
| Nav43 | Ingest → Brief → Draft → QA → Publish 流水线 |
| Launchmind | 批次试点与可扩展内容工作流 |
| Sight AI | 批量内容生产框架 |
| LinkedIn 内容评分 | 7 维度内容评分参考 |
| Hashmeta (hashmeta.net) | Programmatic SEO 去重：70-80% 相似度阈值、模块化内容块、动态内容组装、分批发布策略 |
| 商汤小浣熊 (shangchen-tech.com) | AI 批量写作三层模型（基础信息/观点解读/深度价值）、"正确但无用"诊断、素材库+方法论库+风格指南三库体系 |
| 黄子阳（出海指南AI私享会 2026.05） | 内容集群自动化流程、余弦相似度去重、结构化数据自动化、多模型融合写作、AI 幻觉处理 |

---

## 与现有文件的引用关系

| 本文件章节 | 引用/对接 | 目标文件 |
|-----------|----------|---------|
| 第一步 内容清单锁定 | 关键词来源与竞品验证 | [01-关键词研究方法论.md](01-关键词研究方法论.md) |
| 第二步 批次规划 | RLM 步骤3内容策略 | [00-RLM营销方法论-执行版.md](00-RLM营销方法论-执行版.md) |
| 第三步 内容 Brief | Brief 模板 | [06-内容Brief模板.md](03-模板库/06-内容Brief模板.md) |
| 第四步 AI 起草 | Content Generation | [02-SEO全链路工作流.md](02-SEO全链路工作流.md) 第四步 |
| 第五步 编辑/去 AI 化 | 写作 Prompt 与风格指南 | 本文件 AI 禁用词汇库 / AI 风格指南 |
| 第五步 去模板化 | 站内重复检测 | [content_duplicate_checker.py](../02-自动化工具库/05-竞品内容分析工具/content_duplicate_checker.py) |
| 第六步 内容质检 | Quality Check | [02-SEO全链路工作流.md](02-SEO全链路工作流.md) 第五步；[EEAT-内容质量评估.md](../02-自动化工具库/06-内容质检工具/EEAT-内容质量评估.md) |
| 第七步 发布/内链 | 发布后 SEO 监控 | [02-SEO全链路工作流.md](02-SEO全链路工作流.md) 第六步 |
| 第八步 复盘 | 反向更新内容清单和模板 | [00-RLM营销方法论-执行版.md](00-RLM营销方法论-执行版.md) |
| AI 禁用词汇库 | 嵌入 Prompt | 写作 Prompt 模板中引用 |
| 风格指南 | 项目配置 | Claude Project / Custom GPT 系统提示词 |
