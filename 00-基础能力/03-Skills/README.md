# Skills

> **补充Agent本身不具备、而你又反复需要的信息或能力**

---

## 什么是Skills？

**定义**: 补充Agent本身不具备、而你又**反复需要**的信息或能力

**比喻**: 📘 工作手册 - 告诉AI"怎么做"，AI自动识别场景并执行

### Skills vs MCP vs Plugins

| 概念 | 比喻 | 作用 |
|------|------|------|
| **Skills** | 📘 工作手册 | 告诉AI"怎么做" |
| **Plugins** | 🔌 专业顾问 | 提供专业建议 |
| **MCP** | 🧰 外部工具 | 连接外部世界 |

**关系**: Skills和MCP是**互补关系**

---

## 什么时候需要创建Skill？

**四问判断法**（来自宝玉）:

1. **你真的需要Skills吗？**
   - ❌ Agent已经知道怎么做
   - ❌ Agent能通过搜索自己搞定
   - ✅ 反复踩坑后，发现某个地方**每次都要解释一遍**

2. **Skills是最佳方案吗？**
   ```
   简单提示 ←──── Skills ────→ Web应用
      太简单        最佳方案        太复杂
   ```

3. **你的Skill能和其他Skills组合吗？**
   - ✅ 单一职责（一个Skill做好一件事）
   - ✅ 可组合（多个Skill协同工作）
   - ❌ "巨无霸"Skill（一个Skill做所有事）

4. **这个Skill值得你持续迭代吗？**
   - 好的Skill不是写出来的，是**用出来的**
   - MVP（1-2小时）→ 增强（1-2天）→ 完整（1-2周）

---

## Skills三原则

1. **因需而建** - 真正需要时再创建，不盲目追求数量
2. **可组合** - 模块化设计，与其他Skill协同工作
3. **可迭代** - 持续优化，在使用中完善

---

## Skills的局限性

**核心认知**（字节笔记本）：

1. **Skills是从1到∞，不是从0到1**
   - 需要充分理解技术基础，Skill才能成为杠杆
   - 否则只是被别人的经验蒙着眼走

2. **Skill不是功能，是经验固化**
   - 下载视频是"功能"（平台或API提供）
   - Skill固化的是"如何写标题、如何配图、如何选标签"的SOP
   - Skills不能凭空产生某种功能

3. **模块化、原子化**
   - 不应该把整个代码仓库变成一个巨大的Skill
   - 原子化、模块化才符合渐进式披露特点
   - 才能发挥组合和协调能力

4. **不可控性**
   - 同一个Skill在不同模型上表现可能天差地别
   - 只能取代小范围、容错率高的工作流
   - 精准化、原子化操作仍需代码执行

5. **安全隐患**
   - 本地Skill拥有读写文件、执行Shell命令的最高权限
   - 需要阅读源码、了解运行机制
   - 不建议使用来路不明的Skills

---

## 推荐Skills

### 官方推荐

**Superpowers** - 全流程开发增强 ⭐
- 来源: GitHub官方推荐，1.6万Star
- 功能: TDD驱动开发、系统性调试、代码质量保障
- 安装: `claude plugin install superpowers@superpowers-marketplace`

**skill-creator** - 创建Skills的元Skill
- 官方Skill创建工具，支持交互式引导
- 自动应用"最小必要语言"原则
- 位置: `~/.claude/plugins/marketplaces/.../skill-development/`

**planning-with-files** - 基于文件的任务规划
- 持久化文件作为外部记忆，替代Plan模式

### 社区热门（Top 10）

**1. NotebookLM** - AI知识库生成
- 来源: Google官方Podcast生成工具
- 功能: 自动生成播客、知识库整理
- 安装: `https://github.com/GoogleDeepMind/NotebookLM`

**2. X Article Publisher** - 文章自动发布
- 功能: Markdown文章一键发布到X平台（原Twitter）
- 支持: 自动配图、话题标签、定时发布
- 适用: 内容创作者、自媒体运营

**3. PDF处理工具集**
- `pdf` - PDF合并/拆分/文本提取
- `pdf-to-markdown` - PDF转Markdown（保留格式）
- `pdf-qa` - PDF文档问答（基于RAG）

**4. xlsx** - 非标表格处理
- 外贸PI单、财务报表等复杂表格
- 自动识别表格结构、数据清洗
- 支持批量处理和模板生成

**5. pptx** - PPT自动生成
- Word合同模板生成
- PPT自动生成+品牌规范
- 支持: 一键生成视频/播客/PPT，含字幕和时间轴
- 商业产品: `marswaveai/skills` (Listenhub)

**6. research-to-diagram** - 调研可视化
- 一句话调研+自动画图
- 支持架构图、流程图、思维导图
- 适用: 技术调研、方案设计

**7. wireframe-design-skills** - UI线稿生成
- SVG线稿生成
- 快速原型设计
- 与其他设计工具配合使用

**8. ui-ux-pro-max-skill** - UI/UX设计专家
- 多风格支持（Material Design、Ant Design等）
- 自动生成设计规范
- 代码与设计稿同步

**9. article-copilot** - 内容创作助手
- 素材→正文自动化
- SEO优化、配图建议
- 支持多平台发布

**10. ai-partner** - AI伴侣
- 基于记忆的个性化AI
- 持续学习和优化
- 适合长期使用场景

### 实战案例

#### 字节笔记本（3个月实战筛选）

**常用Skills清单**：

1. **文章自动配图** - 分析Markdown文章，自动生成插图并插入合适位置
2. **自动commit** - 分析代码变更，生成规范的中文提交信息
3. **浏览器自动化** (agent-browser) - 快照+元素引用，token消耗降低90%
4. **小红书发布** - 从选题到发布全流程无人值守
5. **任务管理** (planning-with-files) - 持久化文件作为外部记忆，替代Plan模式
6. **Obsidian知识库** - 处理OFM、Bases、JSON Canvas文件
7. **定时任务** - 每日采集科技简报等自动化任务
8. **Context7 Skills** - 搜索24,000+技能库
9. **视频转录和字幕合成** - 全流程由单个Skill完成
10. **PPT生成** - 与MCP/Script混合使用的代表性案例
11. **Skill Creator** - 制造Skill的元Skill

**核心发现**:
- 很多之前的Command和MCP逐渐转向Skill
- Skills正在取代N8N等传统工作流工具
- Skill可以与MCP、Script混合使用

#### 橘子（Listenhub）- 多AI协同案例

**场景**: 30分钟制作"AI时代知识管理"主题演讲PPT

**多AI协同流程**:
1. **研究Agent** - 收集资料、生成演讲提纲
2. **设计Agent** - 使用wireframe-design-skills生成SVG线稿
3. **用户集成** - 将线稿转为最终PPT

**核心价值**: 3个AI协同工作，实现分工协作

---

## 主要资源

### 官方资源

**Anthropic官方Skills文档**
- 官方文档: https://docs.claude.com/en/docs/claude-code/skills
- 官方示例: https://github.com/anthropics/skills
- 更新频率: 跟随Claude Code版本更新

### Skills商店

**CC Switch (Skills Store)**
- 功能: 可视化Skills管理平台
- 特点: 一键安装、自动更新、评分系统
- 搜索24,000+技能库

**GitHub Skills集合**
- wshobson/agents: 80+插件集合
- 安装: `claude plugin marketplace add https://github.com/wshobson/agents`
- 搜索: `claude plugin marketplace search`

### 社区资源

**Superpowers Marketplace**
- 不仅提供Superpowers插件
- 包含相关Skills集合
- 安装: `claude plugin marketplace add obra/superpowers-marketplace`

**Context7 Skills**
- 搜索24,000+技能库
- 快速查找所需Skills
- 字节笔记本推荐

### 开发工具

**skill-creator**
- 官方Skill创建工具
- 交互式创建流程
- 自动优化SKILL.md

**手动开发**
- 位置: `~/.claude/skills/`
- 模板: SKILL.md + references/
- 调试: 重启Claude Code后生效

---

### 获取方式

**方法1: AI帮你安装** ⭐推荐
```
"帮我安装Superpowers skill"
```

**方法2: 手动克隆**
```bash
cd ~/.claude/skills
git clone https://github.com/anthropics/superpowers.git
```

---

## Skills位置

| 位置 | 作用 | 适用场景 |
|-----|------|---------| 全局Skills | 所有项目通用 |
| `.claude/skills/` | 项目级Skills | 项目特定需求 |

---

## 如何使用Skills

Claude会根据description中的触发关键词自动识别并加载Skill：

```
用户: "帮我分析这个产品"
→ Claude识别到关键词"分析产品"
→ 自动加载product-analysis Skill
→ 执行分析流程
```

手动指定：
```
"使用pdf skill合并这些文件"
"用research-to-diagram skill画个架构图"
```

---

## 多Skills协作

当Skill库越来越丰富时，需要让多个Skill协同工作。

**三种协作模式**:
- **主控Skill模式** - 创建"指挥Skill"协调其他Skills
- **会话指定模式** - 在对话中手动指定使用哪些Skill
- **混合模式** ⭐ - 固定流程自动化 + 特殊环节手动

详细说明：[多Skills协作.md](./多Skills协作.md)

---

## 快速创建Skill

### 方式1: 让AI帮你创建 ⭐推荐

**基础命令**:
```
"帮我创建一个[XX功能]的Skill"
```

**优化技巧** ⭐重要：

AI默认会写很冗长的if-else规则（打补丁式），导致无法泛化、浪费上下文。

**解决方案**：在命令中加一句
```
"帮我创建一个[XX功能]的Skill。在确保信息不遗漏的情况下，使用最小必要语言来写，并考虑泛化性，避免仅支持当前任务。"
```

**示例对比**：

❌ **冗长写法**（AI默认）:
```yaml
# 邮件回复Skill（打补丁式）
## 如果是客户投诉
1. 先道歉、再解释、给方案
## 如果是合作邀请
1. 先感谢、再评估、给意向
## 如果是催款
...
```

✅ **简洁写法**（最小必要语言）:
```yaml
# 邮件回复Skill
## 核心原则
识别对方核心诉求，给出明确回应和下一步行动。
```

**效果**：泛化性强、节省上下文

### 方式2: 手动创建

```bash
mkdir -p ~/.claude/skills/my-skill
```

**SKILL.md模板**:
```yaml
---
name: skill-name
description: |
  功能描述。使用此技能当用户需要:
  1. 场景1
  2. 场景2

  触发关键词: "关键词1"、"关键词2"
---

# Skill名称

## 执行流程
Step 1: ...
Step 2: ...
```

**关键点**:
- `description`是最重要的触发机制，必须包含使用场景和触发关键词
- SKILL.md保持简洁（<2000 tokens）
- 复杂内容放references/目录

### 关于skill-creator

官方Skill创建工具，位于：
```
~/.claude/plugins/marketplaces/.../skill-development/
```

使用skill-creator时，AI会自动应用"最小必要语言"原则。

---

## 参考资料

- **[宝玉方法论](./references/宝玉方法论.md)** - Skills四问判断法、三原则
- **[官方Skills文档](https://docs.claude.com/en/docs/claude-code/skills)**
- **[多Skills协作.md](./多Skills协作.md)** - 多个Skill配合工作

