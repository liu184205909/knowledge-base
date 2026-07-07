# Skill 设计与管理

> **Skill 设计哲学、自建方法与协作模式** | 最后更新：2026-05-17

> 安装命令和速查表见 [01-Claude-Code环境配置](./01-Claude-Code环境配置.md#skill-安装)

---

## 0. Agent 知识分层架构

> **核心观点**：Skill 不是"更长的 prompt"，而是 agent 运行时架构的一部分。真正决定 agent 稳定性的，不是你写了多少文档，而是你把经验放到了正确的层。（来源：[春秋1](https://mp.weixin.qq.com/s/KRZCnzlMSL91VLQR8Ib6yQ)）

### 0.1 八层模型

| 层级 | 内容 | 特征 | Token 成本 |
|------|------|------|-----------|
| 1. **Memory** | Agent 自动沉淀的经验（auto memory） | 解决失忆，不是手动写的 | 低 |
| 2. **CLAUDE.md / AGENTS.md** | 项目级默认行为和地图 | 每次会话都加载，要短、普适（建议 < 200 行） | 高（每次都烧） |
| 3. **Nested CLAUDE.md / Path rules** | 模块级约束 | 按目录懒加载，空间隔离 | 低（按需） |
| 4. **Skill** | 可复用的专题工作流 | **按需加载**，不消耗常驻 token | 中（触发后才烧） |
| 5. **Tools / MCP / CLI** | 动作层和数据层 | 真正执行，Skill 调用工具而非内嵌命令 | 按需 |
| 6. **Hooks** | 确定性约束 | **强制执行，不靠模型自觉** | 极低 |
| 7. **Subagents** | 隔离上下文的专门执行者 | 解放主对话，避免上下文污染 | 独立 |
| 8. **Eval & Review** | 反馈回路 | 持续迭代，让所有资产变好 | 一次性 |

**关键区分**：
- `CLAUDE.md` 是 **advisory**（建议）— 模型可能不看
- `Hooks` 是 **deterministic**（强制）— 不可能逃掉

**判断原则**：如果 CLAUDE.md 里的某一段已经长成了"procedure 而不是 fact"（多步流程、分支判断、校验顺序），就应该迁到 Skill。

### 0.2 经验分诊：该进哪一层？

> 每次真实工作流跑完后，问自己：**这次学到的东西该放哪？**

依次判断，第一个匹配就是答案：

**Q1**：这件事是不是"必须每次执行、零例外、不能靠模型自觉"？
→ 放进 **Hook**（如：提交前必须跑 lint、修改 schema 前必须备份）

**Q2**：这件事是不是"需要真实执行命令、查询接口、读取数据"？
→ 写成 **Script / MCP tool**，再在 Skill 里调用

**Q3**：这件事是不是"只对某个目录、某类文件、某个模块生效"？
→ 放进对应目录的 **Nested CLAUDE.md** 或 **path-scoped rule**

**Q4**：这件事是不是"多步流程、专题 checklist、需要分支判断的过程"？
→ 写成 **Skill**（description 必须写到能被触发的程度）

**Q5**：这件事是不是"每个会话都应该知道的高频默认行为或约束"？
→ 加到 **CLAUDE.md / AGENTS.md**（检查是否已超过 200 行）

都不匹配 → 可能太私人、太一次性，不建议沉淀。

### 0.3 经验迁移原则

| 方向 | 规则 | 示例 |
|------|------|------|
| **上移** Skill → CLAUDE.md | 专题经验变成通用约束时 | review Skill 里的反模式应在写代码阶段就避免 |
| **下移** CLAUDE.md → Skill | 常驻层里的多步流程 | "发版前 checklist"不该常驻，按需加载即可 |
| **下移** CLAUDE.md → Nested | 只对局部生效的规则 | `/legacy/` 目录的代码风格只影响该目录 |
| **下沉** Skill → Hook | Skill 里每次都要执行的步骤 | "写新组件时先跑 storybook"变成 pre-tool-use hook |

**CLAUDE.md 瘦身效果**：从 200+ 行缩回 100 行左右，但 agent 行为反而更准——因为冗余的专题流程挤占了真正重要规则的注意力。

---

## 1. Skill 设计哲学

> **核心观点**：Skill 的本质是分类学，关键是找到最合适的颗粒度，而非分得越细越好。（来源：[数字生命卡兹克](https://mp.weixin.qq.com/s/upCEc-cOKTCRjym4tzJ12Q)）

### 1.1 两个核心词：分类与触发

- **分类**：像生物学分类（界门纲目科属种）一样层层穿透，不要把所有东西摊在最顶层
- **触发**：Skill 怎么触发、能不能正确触发、触发后能干什么，才是最重要的事

**实例**：图片生成只需一个 Skill，内部包含公众号封面、小红书封面、PPT配图等场景分支，由 Agent 根据上下文二次分析选择，而非每个场景各建一个 Skill。

**描述的真正作用是路由触发器**（Perplexity 工程文档）：

模型靠 description 决定要不要加载这个 Skill。描述写的不是"技能能做什么"，而是"用户嘴里会说什么"。模型匹配的是关键词和关键词密度。

| | 描述 |
|---|---|
| ❌ 功能描述 | "监控代码合并请求的状态，支持查看进度和审查结果" |
| ✅ 用户语言 | "当用户想盯着一个合并请求顺利落地、或者担心流水线挂掉时加载。关键词：帮我盯着、确保这个能合进去、别让它被卡住" |

格式要求：以"当……时加载"开头，目标 50 词以内，用真实用户说话的方式写。

### 1.2 数量与准确率的关系

| Skills 数量 | 触发准确率 | 备注 |
|-------------|-----------|------|
| < 20 个 | 90%+ | 几乎不出错 |
| > 30 个 | 明显下降 | 开始误触发 |
| 200 个 | ~20% | 速度极慢，Token 消耗爆炸 |

> **建议**：常年保持在 **30 个以下**（同层平铺）。
>
> **例外**：如果用分类树结构组织（如 `seo/technical/robots`、`seo/on-page/title`），每层独立索引，总数量可以突破 30。kostja94/marketing-skills 用此方式管理 160+ Skills，靠目录隔离避免误触发。代价是索引层 token 消耗随 Skills 数量线性增长。
>
> **值不值建**：高频、**错不起**、做起来费劲。占一条就值得建，三条全占价值百万。

### 1.3 上下文的三层成本

> 来源：Perplexity 内部工程文档

每个 Skill 都有加载开销，而且**每一层都在烧钱**。

| 层级 | 内容 | 加载时机 | Token 预算 |
|------|------|---------|-----------|
| **索引层** | 名称 + description | **每次对话都加载**（不管用户问什么） | ~100 token/个 |
| **正文层** | SKILL.md 主体 | 触发后加载，扛到 Compact 压缩 | 理想 **5000 token 以内** |
| **运行层** | 脚本、参考文档、输出模板 | 按需加载（模型真正需要时才读取） | 无上限 |

**关键洞察**：
- 索引层成本 = 每个技能 × 用户数 × 每天对话次数，累积巨大 → description 能短则短
- 一次对话通常同时加载 3-5 个技能的正文层 → 成本叠加
- 正文层的废话不只浪费自己的空间，还会**压缩其他技能的发挥余地**
- 新增技能会让已有技能变差（索引层描述争夺模型注意力），每次新增后应跑一遍已有技能测试

### 1.4 顶级 AI 的 Prompt 设计模式

> **来源**：[system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks)（40K+ Stars）、[system-prompt-skills](https://github.com/kangarooking/system-prompt-skills) 系列分析

从 ChatGPT、Claude、Gemini、Codex、Perplexity 等产品的系统提示词中提炼的**通用设计模式**，可直接应用于 Skill 设计：

| 模式 | 说明 | Skill 设计启示 |
|------|------|---------------|
| **人格与生产分离** | 人格描述（"你是谁"）与行为规范（"你怎么做"）独立维护 | Skill 的 description 管触发（你是谁），SKILL.md 管执行（怎么做），不要混在一起 |
| **权限分层** | 工具调用需要显式授权分级（只读/读写/破坏性） | Skill 中明确标注哪些操作需要用户确认，破坏性操作必须设卡点 |
| **安全边界条件触发** | 遇特定输入模式时自动切换安全模式 | 在 Skill 触发条件中加入边界条件判断（如用户输入含敏感数据时降级处理） |
| **多角色协作** | 不同角色分工，各自有独立指令集 | 多 Skill 协作时，每个 Skill 只负责一个角色，通过上下文传递而非嵌套调用 |
| **迭代式输出控制** | 分步骤输出而非一次性生成 | Skill 流程设计为多步式，每步有明确输出，而非一次性"帮我搞定" |
| **Script + LLM 双层架构** | 确定性任务用脚本，语义判断用 LLM | 避免让 LLM 编造确定性事实（如"robots.txt存在"），也避免纯脚本无法做语义分析 |

### 1.5 Script + LLM 双层架构

> 来源：JeffLi1993/seo-audit-skill 初版提出 → [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)（650+ ⭐）生产级验证。20+ Python 脚本做确定性检查，LLM 只做语义判断，是此架构最完整的实践。

**核心洞察**：审计类任务中，80% 是机械重复的确定性检查，20% 需要语义判断。把它们混在一起会让 LLM 瞎编事实，或让纯脚本漏掉理解。

```
Layer 1（Python 脚本）        Layer 2（LLM Agent）
确定性检查 → 结构化 JSON ──→  语义判断 → 最终报告
```

| 层 | 处理什么 | 怎么工作 | 典型任务 |
|---|---------|---------|---------|
| **Layer 1: 脚本** | 有明确对错的事 | 输入URL → 抓取解析 → 输出JSON（通过/不通过/数值） | robots.txt 存在吗？title 多少字符？H1 有几个？canonical 自引用了吗？ |
| **Layer 2: LLM** | 需要理解的事 | 读取 Layer 1 的 JSON + 原始内容 → 语义分析 → 建议 | H1 语义是否匹配关键词意图？title 是否有具体价值主张？内容质量如何？ |

**设计原则**：
- 脚本输出结构化 JSON 到 stdout，退出码 `0` = 通过/警告，`1` = 失败
- LLM 只在需要语义判断时才介入，降低幻觉风险和 token 消耗
- 脚本做不了的判断才交给 LLM，不要让 LLM 做"文件存不存在"这种事

**适用场景**：SEO 审计、代码审查、合规检查、数据验证 — 任何"大部分可机械化 + 小部分需要理解"的任务。

### 1.6 GitHub 高星仓库验证的高级模式

> 来源：AgriciDaniel/claude-seo（650+ ⭐）、claude-ads、kostja94/marketing-skills（160+ Skills）实际代码分析。以下模式都在生产环境中验证过。

| 模式 | 说明 | 适用场景 | 来源 |
|------|------|---------|------|
| **编排器 + 子 Skills** | 一个主 Skill 只做编排调度，内部拆成多个 sub-skill，审计时并行触发 | 审计、分析类复杂任务 | claude-seo：1 主 + 16 sub-skills + 11 subagents |
| **置信度加权评分** | 多数据源时，每个源赋予不同置信度（如 Moz 0.85 > Common Crawl 0.50）；数据不足时报"INSUFFICIENT DATA"而非编造分数 | 多数据源聚合、评分体系 | claude-seo 外链分析 |
| **Quality Gates（硬规则）** | 不可违反的规则，触发时强制阻断。如"location page 50+ 硬停"、"Broad Match 必须配 Smart Bidding" | 规模化生成时的安全阀 | claude-seo / claude-ads |
| **行业模板 + 自动检测** | 根据页面信号自动识别行业（SaaS/电商/本地），加载对应基准和模板 | 跨行业通用工具 | claude-ads：11 个行业模板 |
| **交付前自检清单** | Skill 完成分析后，强制跑一遍自检（如"JS 渲染页面不能报 link_removed"、"schema 声明是否验证"），通过才输出 | 审计报告、分析报告 | claude-seo Pre-Delivery Review |
| **按需加载 reference** | 参考文档不放正文，运行层按需 `read`，避免正文层膨胀 | 知识密集型 Skill | claude-ads：23 个 RAG 参考文件 |
| **扩展插件系统** | 核心 Skill 不依赖外部 MCP，但检测到可选 MCP 时自动增强（如 DataForSEO/Firecrawl） | 开闭原则：核心可用、扩展增强 | claude-seo 的 extensions/ |

**编排器模式详解**（最值得借鉴的架构）：

```
/seo audit <url>
    ├── 检测行业类型（SaaS / 电商 / 本地 / 出版 / 代理）
    ├── 并行启动子代理：
    │   ├── seo-technical  → 技术SEO（9类检查）
    │   ├── seo-content    → E-E-A-T + 内容质量
    │   ├── seo-schema     → Schema 检测 + 验证
    │   ├── seo-performance→ Core Web Vitals
    │   ├── seo-geo        → AI 搜索优化
    │   └── [条件触发] seo-local / seo-backlinks / seo-google
    ├── 收集结果 → 统一 SEO Health Score (0-100)
    └── 输出优先级行动清单（Critical > High > Medium > Low）
```

**关键设计决策**：
- 子代理条件触发（local business 才启动 seo-local，有 API 凭证才启动 seo-google）— 避免无意义的空跑
- 评分权重公开透明（Technical 22% / Content 23% / On-Page 20% / Schema 10% / CWV 10% / GEO 10% / Images 5%）— 可审计
- 子 Skill 失败时报告部分结果 + 标记失败项，而非整体报错 — 容错

**置信度加权详解**（解决"多源数据冲突"问题）：

```
因子          | 权重  | 数据源偏好                    | 置信度
referring域数  | 20%  | DataForSEO > Moz > CC in-degree | 1.0 / 0.85 / 0.50
域名质量分布   | 20%  | DataForSEO > Moz DA distribution| 1.0 / 0.85
锚文本自然度   | 15%  | DataForSEO > Moz > Bing anchors | 1.0 / 0.85 / 0.70
毒性链接比     | 20%  | DataForSEO > Moz spam score     | 1.0 / 0.85
```

数据充分性门槛：4+ 因子有数据才出数字分数，否则报 `INSUFFICIENT DATA` + 显示已有因子。**永远不用低置信度数据冒充高分**。

---

## 2. 自建 Skill

### 2.1 设计思维：作战地图，不是说明书

> Skill 是给**机器**用的，不是给人看的。文档是说明书，Skill 是作战指令。（来源：[七鹿AI](https://mp.weixin.qq.com/s/XcmodqCLtn4KpWB9VVW2aw)）

**三层结构**：

| 层级 | 作用 | 关键问题 |
|------|------|---------|
| 第一层：**触发条件** | 什么情况下用这个 Skill？ | 不符合条件时，机器不应该调用它 |
| 第二层：**执行流程** | 先干什么，后干什么，遇到分支怎么办 | 每一段都要有明确的输入输出 |
| 第三层：**验收标准** | 怎么判断做完了、做好了？ | 机器没有主观判断力，不给标准就不知道什么算对 |

**写作要诀**：**把机器当傻子。** 傻子看不懂暗示，只能看懂指令。

| | 描述 |
|---|---|
| ❌ 模糊 | "帮我分析一下这个网站" |
| ✅ 明确 | "访问这个 URL，提取页面标题和 Meta 描述，判断是否包含关键词 X，把结果按格式输出" |

**辩证：给意图，不给步骤**（Perplexity 工程文档）：

"把机器当傻子"解决的是**验收标准要明确**（做什么、什么算对）。但**执行过程不要过度指令化**——强制步骤序列反而限制模型发挥，出问题时模型会卡壳。

> **"如果一件事很容易解释，说明模型早就知道了。删掉它。"**

| | 写法 |
|---|---|
| ❌ 步骤式 | `git log` → `git checkout main` → `git checkout -b <新分支>` → `git cherry-pick <提交>` |
| ✅ 意图式 | "把这个提交放到一个干净的分支上。解决冲突时保留原始意图。如果实在合不进去，解释原因。" |

**统一原则**：验收标准写得像傻子也能懂（明确做什么），执行流程写得像给专家下达作战意图（只说什么结果，不限制怎么做到）。**删掉模型已经知道的知识和步骤**，只保留模型学不到的东西。

**模型学不到的东西**才是 Skill 的真正价值：
- 审美判断（什么场景用什么字体、什么感觉是"low"的）
- 经验直觉（你的领域的隐性知识）
- 团队规范（"我们团队不用 XX 框架"）
- 失败教训（这条路走过，是死路）

### 2.2 写前调研

动手写 Skill 之前，先回答三个**值不值得做**的问题（回答不清楚就不该做）：

1. 这个 Skill **干什么用**？有没有明确边界？
2. 比人做**省多少时间**？
3. **做不好的代价**是什么？

再完成三件**怎么去做**的事（不做就动手，十个有九个要返工）：

1. **拆解任务**：这个 Skill 要干的活拆成几步？每一步机器能独立完成吗？哪一步要人介入？
2. **找工具**：完成每一步需要什么工具？能用 browser 解决的不用 API，能用 terminal 解决的不用写代码。工具越简单，Skill 越稳定。
3. **定标准**：每一步做完，什么样算对？什么样算错？不给判断标准，机器就糊弄你。

### 2.3 五步构建流程

```
写 SOP → 配工具 → 写 Skill → 跑通 → 迭代
```

| 步骤 | 内容 | 注意事项 |
|------|------|---------|
| ① 写 SOP | 先把要做的事写成标准操作流程，几步，每步干什么，标准是什么 | 写不清楚 = 没想清楚 |
| ② 配工具 | 根据 SOP 每一步需要的能力，给 Agent 配工具 | 能用 browser 不用 API |
| ③ 写 Skill | SOP → Skill prompt，三段式（触发 + 流程 + 验收） | 一个 Skill 只干一件事 |
| ④ 跑通 | 跑一遍，看哪一步卡了 | 卡了先看是 SOP 问题还是工具问题 |
| ⑤ 迭代 | 把出错的情况记录下来，加入异常处理 | 跑十遍没出问题才算基本稳定 |

**迭代铁律：只增不改，主要加反面案例**（Perplexity 工程文档）：

每次模型出错时的正确反应：

1. **不改描述** — 触发逻辑没变，动了反而影响其他场景
2. **不加新规则** — 规则越加越多，互相矛盾
3. **加一条反面案例** — 直接告诉模型"这条路走过，是死路"

> 反面案例比正面案例更值钱：正面案例说"往哪走"，反面案例说"哪里有坑"。后者的信息密度更高。

新增 Skill 后的副作用检查：两个 description 相近的 Skill 会互相干扰 → 每次新增后跑一遍已有 Skill 测试，确认没有连带破坏。

### 2.4 模板

**三原则**：① 重复3次以上才值得固化 ② 单一职责方便组合 ③ 使用中持续迭代

**存放路径**：`~/.claude/skills/<name>/SKILL.md`

```yaml
---
name: my-skill
description: |
  当用户……时加载。关键词："xxx"、"yyy"、"zzz"
---

# 技能名称

## 使用场景
- 场景1

## 工作流程
1. 步骤1
2. 步骤2

## 验收标准
- 标准1（怎么判断做对了）
- 标准2（异常情况怎么处理）

## 反面案例
- ❌ 不要……（出错时追加，只增不改）

## 输出格式
- 输出格式说明
```

> **description 写法要点**：以"当……时加载"开头，写用户嘴里会说的话（不是功能描述），50 词以内，列出触发关键词。

### 2.5 价值判断：做完怎么判断值不值

| 维度 | 判断标准 |
|------|---------|
| **复用性** | 今天用了明天还能用吗？别人遇到同样问题能直接用吗？不能复用的不叫 Skill，叫脚本 |
| **出错率** | 跑十遍，有几遍出问题？漏洞多的不值钱，边界清楚的才值钱 |
| **用户留存** | 用了三天，第四天还继续用吗？嘴上说好不一定真好，天天用才是真好 |

---

## 3. 多 Skills 协作

| 模式 | 适用场景 | 特点 |
|------|---------|------|
| **主控 Skill** ⭐ | 固定流程（内容生产、发布） | 一次配置，标准化，可复用 |
| **会话指定** | 探索性/一次性任务 | 灵活，直接在对话中指定 |
| **混合模式** ⭐⭐ | 大部分场景（推荐默认） | 固定流程自动化 + 灵活环节手动 |

**选择决策树**：
```
需要频繁重复执行？
├─ 是 → 主控 Skill 模式
└─ 否
    ├─ 需要灵活探索？ → 会话指定模式
    └─ 核心流程固定？ → 混合模式（推荐默认）
```

**最佳实践**：
- 某操作重复 3 次以上 → 立即创建 Skill
- <10 个 Skill：会话指定；10-30 个：创建主控 Skill；>30 个：混合模式
- 每个 Skill 单一职责 + 明确输入/输出格式，方便串联

---

## 4. 推荐外部 Skills

> ⚠️ **本节为历史参考，不是当前配置**。下列仓库中 marketing-skills 的 `content-strategy`/`keyword-research`/`copywriting` 等已在 2026-07-05 清理中删除（与 `01-AI营销` 文档库重叠，会截胡定制方法论）。**当前实际白名单和判断框架见 [§5 Skill 管理办法](#5-skill-管理办法)**。以下仅保留作"可选安装"参考，装前必须过 §5.1 判断框架。

### 4.1 执行层（有 Python 脚本，可自动化验证）

| 仓库 | 安装 | 核心能力 |
|------|------|---------|
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) (~650⭐) | `git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git && bash claude-seo/install.sh` | `/seo audit` 全站审计 · `/seo schema` Schema生成 · `/seo backlinks` 外链分析 · `/seo geo` AI搜索优化 · `/seo google report` PDF报告 |
| [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) | `git clone --depth 1 https://github.com/AgriciDaniel/claude-ads.git && bash claude-ads/install.sh` | `/ads plan <行业>` 广告策略 · `/ads audit` 多平台审计(190+检查项) · `/ads creative` 创意审计 |

### 4.2 知识层（纯 Markdown 最佳实践，按需加载）

| 仓库 | 推荐安装的 Skills | 覆盖领域 |
|------|------------------|---------|
| [kostja94/marketing-skills](https://github.com/kostja94/marketing-skills) (160+ Skills) | `schema-markup` · `robots-txt` · `xml-sitemap` · `title-tag` · `meta-description` · `keyword-research` · `content-strategy` · `internal-links` · `link-building` · `canonical-tag` · `google-search-console` · `email-marketing` · `content-optimization` | SEO技术 + 内容策略 + 外链建设 |

安装命令：`npx skills add kostja94/marketing-skills --skill <空格分隔的skill名>`

### 4.3 选用原则

| 问题 | 答案 |
|------|------|
| 审计/分析类任务用哪个？ | claude-seo（有脚本验证层，不是纯 LLM 猜测） |
| 需要 SEO/营销知识参考用哪个？ | marketing-skills（纯知识，160+ 覆盖面广） |
| 要跑广告用哪个？ | claude-ads（投放时再装，不需要提前装） |
| 能全装吗？ | 不要。160+ 的索引层每次对话烧 ~16000 token，只装项目需要的 10-15 个 |
| 两层怎么搭配？ | claude-seo 跑审计 → 按 audit 报告修复 → marketing-skills 指导具体实现 |

### 4.4 CLI 工具层（确定性执行，零 Token 消耗）

> 对应八层模型第 5 层（Tools / MCP / CLI）。CLI 命令在本地浏览器直接执行，不经过模型推理，确定性操作零 Token 消耗。

| 工具 | 安装 | 核心能力 |
|------|------|---------|
| [OpenCLI](https://github.com/jackwener/OpenCLI) (20k+ ⭐) | `npm install -g @jackwener/opencli`（需 Node.js 21+）+ Chrome 扩展 | 100+ 站点适配器（小红书/B站/知乎/Twitter/Reddit/HN 等）· 微信/Telegram/Discord 聊天记录导出 · 飞书/企微/钉钉办公集成 · CDP 桌面应用控制 · 社区插件系统 |

**架构定位**：

```
八层模型中的位置：

Layer 4: Skill（编排调度）     ← Skill 调用 OpenCLI 命令
Layer 5: Tools / MCP / CLI     ← OpenCLI 在这里（确定性执行层）
Layer 1.5: Script + LLM        ← OpenCLI = Script 层，零 Token；LLM 只解读结果
```

**与 MCP 的关系**：互补而非替代。OpenCLI 擅长数据采集（"读多写少"），MCP 擅长深度服务集成（工作流编排、设计编辑等），两者可在 Skill 层统一调度。

**关键特性**：
- 复用 Chrome 登录态，无需手动配 Cookie
- 输出 JSON/CSV/Markdown，直接灌入知识库或数据分析流程
- **adapter-author skill**：Agent 可自动编写新站点适配器（符合 1.6 编排器模式）
- 社区插件：`opencli plugin install` 一键装适配器

**注意事项**：
- 浏览器自动化依赖页面结构，网站改版可能导致适配器失效
- 微信聊天记录读取需 root 权限（macOS `sudo wx init`），Windows 支持待验证
- 复用 Chrome 登录态 = 暴露所有登录身份，注意安全边界
- 私域数据访问需自行评估合规风险

---

## 5. Skill 管理办法

> **核心原则**：skill 是"动作"（高频可自动触发的执行单元），文档是"知识"（需判断何时加载的方法论）。装 skill 前先判断：这是动作，还是知识冒充动作？这条区分是 2026-07-05 清理 13 个 skill 后沉淀的，避免再发生"通用 skill 截胡定制文档"。

### 5.1 判断框架：装不装新 skill

装新 skill 前，依次过这五道门（任一不通过即不装）：

| # | 问题 | 不通过则 |
|---|------|---------|
| 1 | 这件事是**高频触发**（每周 3+ 次）还是一次性？ | 一次性 → 用 prompt 或脚本 |
| 2 | 你的文档库里有没有**更贴业务的版本**？ | 有 → 删通用 skill 留文档（如 content-strategy 截胡 RLM） |
| 3 | SOP 是否**稳定固化**（迭代慢）？ | 还在演进、项目特化多 → 留文档 |
| 4 | context 占用是否**可控**（SKILL.md <500 行）？ | 太大 → 拆子 skill，母文档留文档形态 |
| 5 | 触发词是否**精确**（不会撞日常对话）？ | 泛词触发（"写文案""做策略"）→ 会误触发，不建 |

**反面信号**（命中即不建/即删）：
- 内容是"通用营销理论/写作原则" → 这是知识，且你的文档库版本更贴业务
- 触发词和日常对话撞（"做内容""写文案""想策略"）→ 会截胡
- 依赖特定平台但你没在用（如 workctl 依赖阿里 Work Agent）

### 5.2 当前白名单（2026-07-05，11 个）

> 真源 `~/.claude/skills/`。Codex 侧 `~/.agents/skills` 是 symlink 指回真源。已删 skill 备份在 `~/.claude/skills-disabled-20260705/`（实体目录 mv，非 rm，可恢复）。

| 类别 | Skill | 作用 |
|---|---|---|
| **文件处理** | `docx` / `pdf` / `xlsx` | Office/PDF 格式化生成（动作类刚需，低频但不可替代） |
| **联网** | `web-access` | CDP 浏览器自动化（JS 渲染/登录态/反爬） |
| **防护** | `fable-discipline` | 防假完成（先验证再完成，踩过大坑） |
| **开发** | `frontend-design` | 审美决策（拒绝 AI slop） |
| | `wordpress-block-theming` | WP FSE 主题开发 |
| **SEO** | `gsc-radar` | GSC 数据驱动主动扫描 |
| | `analytics-tracking` | GA4/GTM 埋点实施（近期要做 GTM） |
| **记忆** | `mem-search` / `knowledge-agent` | claude-mem 跨会话记忆 |

### 5.3 已删黑名单（13 个，备份可恢复）

| 批次 | Skill | 删除理由 |
|---|---|---|
| **营销理论（11）** | `copywriting` / `copy-editing` | 重叠 [07-去AI化工作流](../01-AI营销/01-营销方法论基础/07-英文SEO批量写作与去AI化工作流.md)（禁用词库+反模式） |
| | `content-strategy`（最危险） | 90% 重叠 RLM+1F+ACE，会截胡定制方法论 |
| | `marketing-ideas` / `marketing-psychology` | 重叠 `01-营销方法论基础/` 文档库 |
| | `customer-research` / `seo-keyword-research` | 重叠 1C + Hermes 闭环 + DataForSEO |
| | `competitor-alternatives` | SaaS 对比页工具，水晶内容站用不上 |
| | `site-architecture` / `programmatic-seo` | 有布局方案文档 + 不做 pSEO |
| | `social-content` | 不做社媒运营 |
| **平台/监控（2）** | `workctl` | 阿里 Work Agent 平台 wrapper，没用过该平台 |
| | `alert-manager` | 持续监控预警，现阶段站点没量级，gsc-radar 够用 |

**通用教训**：这些都是某个 skill 包顺带装进来的"通用知识冒充动作"。留着会污染 skill 选择、截胡定制文档、输出 SaaS 通用策略稀释项目方法论。

### 5.4 与 01-AI营销 文档库的分工边界

**铁律**：营销理论 / 内容策略 / 写作规范类需求，**先查 `01-AI营销` 文档库，不装通用 skill**。

| 需求 | 用文档（不装 skill） | 为什么文档更强 |
|---|---|---|
| 写文案/去 AI 化 | [07-英文SEO批量写作与去AI化工作流](../01-AI营销/01-营销方法论基础/07-英文SEO批量写作与去AI化工作流.md) | 带水晶站例句 + 禁用词库 + 三道门禁 |
| 内容策略/选题 | [RLM 执行版](../01-AI营销/01-营销方法论基础/00-RLM营销方法论-执行版.md) + 1F + ACE | 三源验证逻辑，非通用 4 因子评分 |
| 关键词研究 | [1C 关键词研究方法论](../01-AI营销/01-营销方法论基础/01-关键词研究方法论.md) + Seed-Master | 项目数据驱动 |
| 竞品分析 | Hermes 闭环 + DataForSEO + memory `competitor-research-serp-driven-strict` | 已有完整 SOP |

### 5.5 生命周期规则

| 信号 | 动作 | 典型 |
|---|---|---|
| 装了 3 个月没用过 | 移到备份目录 | workctl（不清楚用途） |
| 通用 skill 和文档库重叠 | 删 skill 留文档 | copywriting / content-strategy |
| 项目阶段过去了 | 移到备份 | alert-manager（站点还没量级） |
| 临时任务但近期高频 | 保留 | analytics-tracking（要做 GTM） |
| 文档里某高频片段稳定出来 | 拆成子 skill（触发条件见 §5.6） | 暂不拆，文档形态够用 |

**清理节奏**：每季度过一遍 `ls ~/.claude/skills/`，对每个 skill 问"过去 3 个月用过吗？"。删比装容易，备份目录兜底。

### 5.6 候选子 skill（触发条件未到，暂不拆）

RLM 执行版里的高频片段，理论上是子 skill 候选。但**现在不拆**——文档还在演进、反面案例还不够、加载痛点还没出现。等触发条件满足再动手，不要为"完成待办"而拆。

**拆子 skill 的四个触发信号**（任一出现再考虑）：
- 每次都要**手动粘贴**某段规则到 prompt → 加载痛感出现
- 积累了 **20+ 个反面案例**（"AI 又在这里露馅"）→ skill 内容才丰富
- 源文档**连续 2 个月没大改** → SOP 稳定了
- 需要给**非 Claude Code 的工具/agent** 复用 → 跨工具需求

**候选清单**（触发前不动，触发后按需拆）：

| 候选子 skill | 来源片段 | 现状 |
|---|---|---|
| `rlm-deai-edit` | 07 §5（禁用词库+反模式+三道门禁） | 07 还在迭代（06-28/06-01 大改），反面案例不够 |
| `rlm-brief-gate` | RLM 3.4（Brief 锁定门槛+DREAM） | Brief 流程稳定后再考虑 |
| `rlm-competitor-serp` | 1A 轨道 A（serp_check SOP） | 已有 memory `competitor-research-serp-driven-strict`，文档够用 |
| `rlm-qa-route` | 3.6（质检路由矩阵） | 矩阵类规则，文档形态反而更清晰 |

> 当前用文档形态跑水晶站几百篇文章都很顺，没有"加载痛点"。痛点没出现就别建——这是 §5.1 第 1 条的反面应用。
