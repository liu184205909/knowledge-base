# Skill 设计与管理

> **Skill 安装目录、设计哲学与协作模式** | 最后更新：2026-04-26

---

## 1. Skill 设计哲学

> **核心观点**：Skill 的本质是分类学，关键是找到最合适的颗粒度，而非分得越细越好。（来源：[数字生命卡兹克](https://mp.weixin.qq.com/s/upCEc-cOKTCRjym4tzJ12Q)）

### 1.1 两个核心词：分类与触发

- **分类**：像生物学分类（界门纲目科属种）一样层层穿透，不要把所有东西摊在最顶层
- **触发**：Skill 怎么触发、能不能正确触发、触发后能干什么，才是最重要的事

**实例**：图片生成只需一个 Skill，内部包含公众号封面、小红书封面、PPT配图等场景分支，由 Agent 根据上下文二次分析选择，而非每个场景各建一个 Skill。

### 1.2 数量与准确率的关系

| Skills 数量 | 触发准确率 | 备注 |
|-------------|-----------|------|
| < 20 个 | 90%+ | 几乎不出错 |
| > 30 个 | 明显下降 | 开始误触发 |
| 200 个 | ~20% | 速度极慢，Token 消耗爆炸 |

> **建议**：常年保持在 **30 个以下**。

### 1.3 一个 Skill 是否值得存在的三条标准

1. 它对应的场景有没有**明确的边界**
2. 它对应的场景是不是会**高频复现**
3. 它能不能**归属进已有的 Skill** 里

**值钱 Skill 的额外特征**：高频、**错不起**、做起来费劲。三条占一条价值显现，占两条价值明显，三条全占价值百万。（来源：[七鹿AI](https://mp.weixin.qq.com/s/XcmodqCLtn4KpWB9VVW2aw)）

### 1.4 奥卡姆剃刀原则

**如无必要，勿增实体。** 你用不到的 Skill 就别装。

需要设计自己的分类系统：哪些 CLAUDE.md 能处理，哪些该用 Skill。

### 1.5 Skill 的能力边界：知识层级模型

> **核心观点**：Skill/蒸馏技术的本质是编码**显性知识**（规则、规范），但大量专业判断依赖**隐性知识**（情境判断、品牌直觉、增长边界感知），被整理后会丧失情境适配能力。（来源：[SEO技术流](https://mp.weixin.qq.com/s/W1u1d6v67_8dL7ckUoZ7CQ)）

**四层知识金字塔**（越往上蒸馏越无效）：

| 层级 | 名称 | 蒸馏效果 | 核心特征 | 误区 |
|------|------|---------|---------|------|
| 1 | **信息层** | 最有效 | 规则明确，对错可判（如 Sitemap 格式、H1 唯一性） | 把合规当作全部 |
| 2 | **策略层** | 部分有效 | 有方法论但需结合情境（如关键词矩阵规划） | 把策略当公式套用 |
| 3 | **认知层** | 作用有限 | 对本质的理解（如流量≠商业价值、渠道有天花板） | 认为增长是唯一方向 |
| 4 | **智慧层** | 基本失效 | 基于价值观和趋势洞察重新定义目标本身 | 用价值观逃避执行 |

**实践启示**：
- Skill 最擅长**信息层**任务（合规检查、格式规范、技术 SEO）
- Skill 能辅助**策略层**，但"什么策略适合当下的你"需要人判断
- Skill 无法替代**认知层和智慧层**的真实项目经验和时间积累
- 这个框架不仅适用于 SEO，也适用于内容营销、产品增长、品牌建设

### 1.6 问题定义是 Skill 的生死线

> **核心观点**：写 Skill 之前，先回答三个问题。回答不清楚，这个 Skill 就不该做。（来源：[七鹿AI](https://mp.weixin.qq.com/s/XcmodqCLtn4KpWB9VVW2aw)）

1. 这个 Skill **干什么用**？
2. 机器做了这件事，比人做**省多少时间**？
3. **做不好的时候，代价是什么**？

**错误 vs 正确定义示例**：

| | 描述 |
|---|---|
| ❌ 错误 | 帮我读邮件并总结要点 |
| ✅ 正确 | 把一天收到的客户邮件自动分类，已处理的归档，未处理的按紧急程度排序，紧急的立即推送给我，不紧急的晚饭前看一眼 |

后者有**边界、有标准、有明确的输入输出**。前者没有边界，"要点"一百个人一百种理解，机器不知道怎么做。

---

## 2. Skill 安装与管理

> ⚠️ **安装注意事项**：
> - `npx skills add` 默认装到**项目目录**，必须加 **`-g`** 才装到全局 `~/.claude/skills/`
> - `npx clawhub@latest install` 装到**当前工作目录**，建议 `cd ~/` 后执行
> - Skill 触发原理：Agent 匹配 `description` 中的关键词，显示 `[command-message]xxx skill is loading` 即为成功触发

### 2.1 Web Access（首要安装）

搜索 + 浏览器 + 登录态 + 社媒发布一体化。通过 CDP 直连你的 Chrome，复用登录态。

**安装**（已安装）：
```bash
git clone https://github.com/eze-is/web-access ~/.claude/skills/web-access
```

**前置条件**：Chrome 打开 `chrome://inspect/#remote-debugging`，勾选 Allow remote debugging。

**安装命令汇总**：

```bash
# clawhub 来源
npx clawhub@latest install skill-vetter
npx clawhub@latest install image-generation

# skills.sh 来源（全部加 -g 全局安装）
npx skills add anthropics/skills --skill pdf xlsx docx pptx frontend-design skill-creator --agent claude-code -y -g
npx skills add aaron-he-zhu/seo-geo-claude-skills -g
npx skills add AgriciDaniel/claude-seo -g
npx skills add coreyhaines31/marketingskills --agent claude-code -y -g
npx skills add typefully/agent-skills --agent claude-code -y -g
npx skills add AgriciDaniel/claude-blog -g
npx skills add AgriciDaniel/claude-ads -g
npx skills add tanweai/pua --agent claude-code -y -g
npx skills add thedotmack/claude-mem --agent claude-code -y -g
npx skills add Bhanunamikaze/Agentic-SEO-Skill --agent claude-code -y -g
npx skills add Automattic/wordpress-agent-skills --agent claude-code -y -g
npx skills add alchaincyf/huashu-skills --agent claude-code -y -g

# 验证
npx skills list -g
```

> Skill 探索: [skills.sh](https://skills.sh/) | [agentskills.so](https://agentskills.so) | [clawhub.ai](https://clawhub.ai)

### 2.2 Skill 速查表

> 按使用场景分类。Skill 不是越多越好，功能相近会冲突，推荐 5-8 个高频使用的。

#### 联网 & 搜索

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| ⭐ **web-access** | 搜索+浏览器+登录态+社媒发布 | "帮我搜索" / "打开网页" / "去小红书搜" | [GitHub](https://github.com/eze-is/web-access) |
| **info-search-knowledge** | 多渠道信息搜索 | "查资料" / "调研" | 花叔 huashu-skills |

#### 内容创作

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **topic-generation** | 选题方向+标题+大纲 | "选题" / "写什么" | 花叔 huashu-skills |
| **ai-proofreading** | 降AI检测率至30%以下 | "AI味太重" / "更自然" | 花叔 huashu-skills |
| **article-to-x** | 长文转微博/小红书 | "转微博" / "发小红书" | 花叔 huashu-skills |
| **claude-blog** | 博客创作+SEO+AEO | "写博客" / "博客大纲" | [GitHub](https://github.com/AgriciDaniel/claude-blog) ⭐432 |
| **copywriting** | 文案撰写 | "写文案" / "产品描述" | marketingskills |
| **product-analysis** *(自建)* | 产品评估(100分制) | "分析产品" | 自建 |

#### 视频创作

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **video-outline-generation** | 视频脚本大纲 | "视频大纲" / "策划视频" | 花叔 huashu-skills |
| **video-script-collaborial** | 脚本口语化 | "口语化" / "像说话一样" | 花叔 huashu-skills |
| **video-thumbnail-check** | 封面/CTR检查 | "封面" / "点击率" | 花叔 huashu-skills |

#### SEO & 流量

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **claude-seo** | 19技能+12代理，E-E-A-T/Schema/PDF报告 | "SEO审计" / "分析SEO" | [GitHub](https://github.com/AgriciDaniel/claude-seo) ⭐4.3k |
| **seo** (Agentic-SEO) | 16技能+10代理+33脚本 | "SEO分析" / "Core Web Vitals" | [GitHub](https://github.com/Bhanunamikaze/Agentic-SEO-Skill) |
| **seo-geo** | GEO生成优化 | "GEO优化" | seo-geo-claude-skills |

#### 广告投放

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **claude-ads** | 付费广告审计(186项检查) | "审计广告" / "广告策略" | [GitHub](https://github.com/AgriciDaniel/claude-ads) |
| **typefully** | 社媒发布(X/LinkedIn/Threads等) | "发推文" / "排期帖子" | [GitHub](https://github.com/typefully/agent-skills) |

#### 营销策略

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **marketingskills** | 34个营销技能全家桶 | "营销策略" / "定价" / "launch" | [GitHub](https://github.com/coreyhaines31/marketingskills) ⭐19.7k |
| **content-strategy** | 内容规划 | "内容策略" / "内容规划" | marketingskills |

#### 调试 & 记忆

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **pua** | 卡住时强制换思路 | "不行啊" / "原地打转" / "/pua" | [GitHub](https://github.com/tanweai/pua) |
| **mem-search** (claude-mem) | 跨会话长期记忆 | "上次怎么解决的" | [GitHub](https://github.com/thedotmack/claude-mem) |
| **make-plan** | 制定执行计划 | "制定计划" | claude-mem |
| **do** | 执行计划 | "执行计划" | claude-mem |

#### 文档 & 设计

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **pdf/xlsx/docx/pptx** | 办公文档生成 | "生成PDF" / "创建Excel" | [anthropics/skills](https://github.com/anthropics/skills) |
| **frontend-design** | 前端审美约束 | "设计网页" / "落地页" | [anthropics/skills](https://github.com/anthropics/skills) |
| **image-generation** | 多模型配图(GPT/Gemini/FLUX/MJ) | "配图" / "插图" | [clawhub](https://clawhub.ai/ivangdavila/image-generation) |
| **skill-creator** | 自建 Skill | "创建skill" | [anthropics/skills](https://github.com/anthropics/skills) |
| **skill-vetter** | 安装前安全审查 | — | [clawhub](https://clawhub.ai/spclaudehome/skill-vetter) |

#### 其他

| Skill | 用途 | 触发词 | 来源 |
|-------|------|--------|------|
| **wordpress-block-theming** | WordPress主题(Automattic官方) | — | [GitHub](https://github.com/Automattic/wordpress-agent-skills) |
| **personal-material-search** | 个人素材库搜索 | "真实经历" / "找例子" | 花叔 huashu-skills |

> ⚠️ 本地 `image-generation`（花叔版，中文配图）与 ClawHub 版同名冲突：中文配图用本地版，英文配图用 ClawHub 版。

---

## 3. 自建 Skill

### 3.1 设计思维：作战地图，不是说明书

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

### 3.2 写前调研：三件事

动手写 Skill 之前，先做三件事（不做就动手，十个有九个要返工）：

1. **拆解任务**：这个 Skill 要干的活拆成几步？每一步机器能独立完成吗？哪一步要人介入？
2. **找工具**：完成每一步需要什么工具？能用 browser 解决的不用 API，能用 terminal 解决的不用写代码。工具越简单，Skill 越稳定。
3. **定标准**：每一步做完，什么样算对？什么样算错？不给判断标准，机器就糊弄你。

### 3.3 五步构建流程

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

### 3.4 自建原则与模板

**三原则**：① 重复3次以上才值得固化 ② 单一职责方便组合 ③ 使用中持续迭代

**存放路径**：`~/.claude/skills/<name>/SKILL.md`

```yaml
---
name: my-skill
description: |
  技能描述。触发关键词: "xxx"、"yyy"
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

## 输出格式
- 输出格式说明
```

### 3.5 价值判断：做完怎么判断值不值

| 维度 | 判断标准 |
|------|---------|
| **复用性** | 今天用了明天还能用吗？别人遇到同样问题能直接用吗？不能复用的不叫 Skill，叫脚本 |
| **出错率** | 跑十遍，有几遍出问题？漏洞多的不值钱，边界清楚的才值钱 |
| **用户留存** | 用了三天，第四天还继续用吗？嘴上说好不一定真好，天天用才是真好 |

---

## 4. 多 Skills 协作

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
