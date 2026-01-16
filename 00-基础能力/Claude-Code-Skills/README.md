# Claude Code Skills - RLM工作流自动化

> **RLM方法论的可执行版本集合** | 自动触发的工作流工具

---

## 📌 文件夹定位

**这是Claude Code Skills的示例集合**：
- ✅ **当前包含**：营销领域的5个核心Skills
- ✅ **未来扩展**：开发、GEO等领域的Skills
- ✅ **通用工具**：安装脚本、检查清单、架构文档

### 目录结构

```
Claude-Code-Skills/
├── 📖 README.md                   # 本文档（Skills总览）
├── 📖 架构总结.md                  # 完整架构设计
├── 📖 RLM执行前检查清单.md          # 使用指南
├── 🔧 install-skills.bat           # Windows安装脚本
├── 🔧 install-skills.sh            # Mac/Linux安装脚本
│
├── 📂 marketing/                   # 营销领域Skills（当前）
│   ├── market-analysis/            # 市场分析
│   ├── content-strategy/           # 内容策略
│   ├── blog-production/            # 博客内容生产
│   ├── social-production/          # 社媒内容生产
│   └── marketing-master/           # 主控Skill（递归调用）
│
├── 📂 development/                 # 开发领域Skills（未来）
│   └── (待创建)
│
└── 📂 geo/                         # GEO领域Skills（未来）
    └── (待创建)
```

**当前状态**：
- ✅ **营销领域**：5个Skills已实现
- ⏳ **开发领域**：规划中
- ⏳ **GEO领域**：规划中

---

## 🎯 Skills vs 流程文档

### 流程文档（学习版）

**位置**：`01-AI营销/00-RLM营销方法论基础/`

**特点**：
- 📖 适合学习和理解工作流
- 📖 手动指定文档路径
- 📖 AI按步骤执行流程
- 📖 可读性强，易于理解

### Skills（执行版）

**位置**：`00-基础能力/Claude-Code-Skills/`

**特点**：
- 🚀 适合自动化执行
- 🚀 自动识别关键词触发
- 🚀 AI自动执行完整流程
- 🚀 效率最高，体验最好

**对应关系**：

| 流程文档 | Skills版本 | 触发方式 |
|---------|-----------|---------|
| 01-市场分析.md | marketing/market-analysis | "分析XX产品" |
| 02-内容策略.md | marketing/content-strategy | "制定XX策略" |
| 03-博客内容生产.md | marketing/blog-production | "写XX篇文章" |
| 04-社媒内容生产.md | marketing/social-production | "创建社媒内容" |
| (主控流程) | marketing/marketing-master | "完整营销方案" |

---

## 🚀 快速开始

### 安装所有Skills

**方式1: 一键复制（推荐）**
```bash
# Windows
xcopy "d:\Project code\知识库\00-基础能力\Claude-Code-Skills" "%USERPROFILE%\.claude\skills\" /E /I /Y

# Mac/Linux
cp -r ~/知识库/00-基础能力/Claude-Code-Skills/* ~/.claude/skills/
```

**方式2: 逐个创建**
```
"帮我创建market-analysis Skill，基于00-基础能力/Claude-Code-Skills/market-analysis/SKILL.md"
```

### 验证安装

```
"检查已安装的Skills列表"
```

应该看到：
- ✅ market-analysis
- ✅ content-strategy
- ✅ blog-production
- ✅ social-production
- ✅ marketing-master

---

## 📋 可用的Skills

### 1. market-analysis（市场分析）
**触发关键词**：
- "分析XX产品"
- "评估XX产品"
- "研究XX市场"

**执行流程**：
1. 产品评估（100分制）
2. 竞品发现（搜索15+竞品）
3. 竞品深度分析（5-10家）
4. 用户洞察（画像、痛点、需求）

**输出**：
- 100分制评分报告
- 竞品对比矩阵
- 用户画像和痛点
- 差异化机会建议

---

### 2. content-strategy（内容策略）
**触发关键词**：
- "制定XX策略"
- "内容策略"
- "网站结构"

**执行流程**：
1. 差异化机会识别
2. 网站结构设计
3. 关键页面策略
4. SEO关键词策略

**输出**：
- 差异化策略
- 网站架构设计
- 内容分类体系
- SEO关键词清单

---

### 3. blog-production（博客内容生产）
**触发关键词**：
- "写XX篇文章"
- "生成博客"
- "SEO文章"

**执行流程**：
1. 选题研究（SEO关键词驱动）
2. 大纲生成（结构化框架）
3. 深度撰写（1500-3000字）
4. SEO优化（关键词布局 + 元数据）
5. 质量审核（可读性 + 准确性）

**输出**：
- SEO优化的博客文章（1500-3000字）
- 元数据（标题、描述、关键词）
- 质量评分报告

---

### 4. social-production（社媒内容生产）
**触发关键词**：
- "社媒内容"
- "社交媒体"
- "XX平台内容"

**执行流程**：
1. 平台选择（IG/FB/TikTok/小红书/微博）
2. 内容规划（内容日历）
3. 短内容创作（50-800字）
4. 视觉设计（图片/视频方案）
5. 发布优化（最佳时间 + 互动策略）

**输出**：
- 多平台社媒内容包
- 发布时间建议
- 互动策略

---

### 5. marketing-master（主控Skill）⭐ 推荐
**触发关键词**：
- "完整的营销方案"
- "营销分析"
- "XX产品营销"

**执行流程**：
1. 调用market-analysis（市场分析）
2. 调用content-strategy（内容策略）
3. 调用blog-production（博客内容生产）
4. 调用social-production（社媒内容生产）
5. 汇总完整营销方案

**输出**：
- 完整的营销分析报告
- 内容策略和网站架构
- 10篇SEO博客文章
- 社媒内容包

**时间**: 5-10分钟（传统方式需要2-5天）

---

## 🔄 RLM执行前检查清单

### Step 1: 检查Skills状态

```
"检查Claude Code Skills是否已安装"
```

**如果已安装** ✅：
```
✅ market-analysis
✅ content-strategy
✅ blog-production
✅ social-production
✅ marketing-master
```

→ 直接执行RLM，使用Skills自动触发

**如果未安装** ⚠️：
```
❌ Skills未安装
```

→ 提供两个选项：
- **A) 先安装Skills（推荐）**
  ```bash
  # 一键安装
  xcopy "d:\Project code\知识库\00-基础能力\Claude-Code-Skills" "%USERPROFILE%\.claude\skills\" /E /I /Y
  ```

- **B) 直接执行（深度有限）**
  - 基于知识库文档手动执行
  - 每次需要手动指定流程文档
  - 无法自动触发，效率较低

---

### Step 2: 根据Skills状态调整执行策略

#### ✅ Skills可用模式（推荐）

**用户**:
```
"分析智能宠物健康监测产品"
```

**Claude**:
1. 自动识别关键词"分析XX产品"
2. 触发market-analysis Skill
3. 按Skill定义的流程自动执行
4. 输出专业报告

**优势**：
- ✅ 自动触发，无需指定文档
- ✅ 流程标准化，结果一致
- ✅ 可递归调用子Skill
- ✅ 效率最高

#### ⚠️ Skills不可用模式（降级）

**用户**:
```
"分析智能宠物健康监测产品"
```

**Claude**:
1. 明确告知："Skills未安装，将基于流程文档执行"
2. 读取`01-市场分析.md`
3. 手动执行文档中的步骤
4. 输出基础报告

**局限性**：
- ⚠️ 需要手动指定文档路径
- ⚠️ 每次需要重新描述工作流
- ⚠️ 无法自动触发
- ⚠️ 深度可能有限

---

## 📚 Skills vs 流程文档对比

| 维度 | Skills | 流程文档 |
|------|--------|---------|
| **触发方式** | 自动识别关键词 | 手动指定文档 |
| **执行方式** | AI自动执行 | AI手动执行步骤 |
| **深度** | ⭐⭐⭐⭐⭐ 深度 | ⭐⭐⭐⭐ 中等 |
| **效率** | ⭐⭐⭐⭐⭐ 最高 | ⭐⭐⭐ 中等 |
| **配置难度** | 需要安装配置 | 无需配置 |
| **可读性** | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 高 |
| **学习性** | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 高 |
| **适用场景** | 频繁使用、自动化 | 学习、临时项目 |

**建议**：
- 频繁使用（每天多次） → Skills
- 学习理解 → 流程文档
- 临时项目 → 流程文档

---

## 🛠️ 技术细节

### Skills的目录结构

```
market-analysis/
├── SKILL.md                    # Skill定义文件
└── references/                 # 参考文档
    ├── 01-市场分析.md          # 工作流定义
    ├── 选品评估框架.md         # 评估标准
    └── 竞品分析方法.md         # 分析方法
```

### Skills的热重载

修改Skill文件后：
1. 保存SKILL.md
2. 无需重启Claude Code
3. 下次触发自动加载新版本

### Skills的递归调用

**主控Skill (marketing-master)**:
```yaml
执行流程:
  1. 调用market-analysis子Skill
  2. 调用content-strategy子Skill
  3. 调用blog-production子Skill
  4. 调用social-production子Skill
  5. 汇总完整营销方案
```

---

## 📞 维护和更新

### 版本历史

- **v1.0** (2026-01-16) - 初始版本
  - 创建5个核心营销Skills
  - 支持递归调用
  - 集成MCP工具

### 反馈和改进

**发现问题或建议改进**：
- 提交Issue到知识库
- 直接修改SKILL.md（热重载立即生效）

**贡献新的Skills**：
- 遵循现有目录结构
- 包含完整的触发关键词
- 提供使用示例

---

## 🎯 最佳实践

### 1. 定期检查Skills状态

换电脑或重新安装后：
```
"检查Claude Code Skills是否已安装"
```

### 2. 优先使用marketing-master

完整的营销分析，使用主控Skill：
```
"为XX产品制定完整营销方案"
→ 自动触发marketing-master
→ 依次调用4个子Skill
→ 输出完整报告
```

### 3. 单独使用子Skill

只需要某个环节：
```
"分析XX产品的竞品" → market-analysis
"制定XX的内容策略" → content-strategy
"写10篇SEO文章" → blog-production
```

### 4. Skills + 流程文档结合

- **开发阶段**: 使用流程文档理解工作流
- **生产阶段**: 使用Skills自动化执行
- **调试阶段**: 查看流程文档理解Skill逻辑

---

## 📖 相关文档

**理论文档**:
- [02-RLM递归思想.md](../02-RLM递归思想.md) - RLM基础概念
- [04-Skills完整指南.md](../04-Skills完整指南.md) - Skills开发指南

**营销工作流**:
- [01-AI营销/00-RLM营销方法论基础/00-营销RLM理论基础.md](../../01-AI营销/00-RLM营销方法论基础/00-营销RLM理论基础.md)
- [01-市场分析.md](../../01-AI营销/00-RLM营销方法论基础/01-市场分析.md)
- [02-内容策略.md](../../01-AI营销/00-RLM营销方法论基础/02-内容策略.md)
- [03-博客内容生产.md](../../01-AI营销/00-RLM营销方法论基础/03-博客内容生产.md)
- [04-社媒内容生产.md](../../01-AI营销/00-RLM营销方法论基础/04-社媒内容生产.md)

---

**一句话总结**: **Skills = RLM的可执行版本，一键安装，自动触发，永久复用** 🚀
