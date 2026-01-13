# Skills 完整指南

> **开发 + 推荐 + 分享 + 同步** | 最后更新: 2026-01-12

---

## 📋 文档用途

**给AI的理由**:
- 看到现有Skills,更好地理解用户需求
- 直接调用现成Skills,不用从零编写
- 参考Skill设计,提供优化建议

**给用户的理由**:
- 学习如何开发Skills
- 快速找到有用的Skills
- 在多台电脑间同步Skills
- 分享Skills给团队成员

---

## 第一部分: Skills开发指南

### 核心定义

**Skills = 模块化能力包 = AI工作手册**

- 固化经验为可复用知识库
- 标准化工作流程(SOP)
- Claude自动识别场景并执行
- 支持持续迭代优化

---

### 1. Skills技术架构

#### 文件结构
```
📁 skill-name/
├── SKILL.md           # 核心指令文件(必需)
├── scripts/           # 可执行脚本(可选)
├── references/        # 参考文档(可选)
└── assets/            # 模板和资源(可选)
```

#### 三层加载机制

| 层级 | 内容 | Tokens | 加载时机 |
|------|------|--------|---------|
| Level 1 | 元数据(name, description) | ~100 | 启动时 |
| Level 2 | 指令(SKILL.md正文) | 2K-5K | 匹配时 |
| Level 3 | 资源(脚本、参考文档) | 无限 | 按需 |

**关键**: 启动时可安装数十Skills但<1000 tokens, 只有脚本输出进入Context

---

### 2. SKILL.md结构

#### 基础模板
```yaml
---
name: skill-name
description: |
  功能描述 + 使用场景 + 触发关键词
  包含: 核心功能、何时使用、关键词、可用工具
---

# Skill 名称

## 核心功能
简要说明...

## 执行流程
Step 1: ...
Step 2: ...
```

#### Description设计原则(最重要)

**Description是主要触发机制,必须包含:**

```yaml
# ✅ 正确示例
description: |
  产品分析和市场评估技能。使用此技能当用户需要:
  1. 分析产品市场潜力和可行性
  2. 评估产品竞争情况
  3. 判断产品是否值得投入资源

  触发关键词: "分析XX产品"、"评估XX产品"、"XX产品可行性"

  输出: 100分制评分报告,包含市场分析、竞争评估、用户洞察和行动建议。

# ❌ 错误示例
description: Product analysis
```

**Body不应包含**: "如何使用"说明(已在description中)

---

### 3. Skills 2.1.0新功能

#### 3.1 热重载(Hot Reload)
- 自动检测 `~/.claude/skills` 和 `.claude/skills` 目录变化
- 修改后保存立即生效,无需重启会话

#### 3.2 Fork子代理执行
```yaml
---
name: code-review
context: fork  # 在独立子代理上下文运行
agent: security-expert  # 指定agent类型
allowed-tools:
  - Read
  - Grep
---
```

**优势**:
- 独立上下文,不污染主对话
- 继承sub-agent的系统提示和工具权限
- 不占用主会话上下文窗口

#### 3.3 Hooks扩展
```yaml
---
name: deploy
hooks:
  PostToolUse:
    - command: "echo 'Tool completed'"
---
```

每个Skill可设置独立的前置/后置处理逻辑

#### 3.4 语言配置
```yaml
---
name: chinese-assistant
language: chinese  # Claude尽量用中文回复
---
```

---

### 4. 开发最佳实践

#### 4.1 核心原则

**自然语言优先**: 告诉AI目标,让AI自己规划步骤

**渐进式披露**:
```markdown
# SKILL.md - 保持简洁(<2000 tokens)

## Quick Start
基础指令...

## Advanced Usage
复杂场景见 [ADVANCED.md](references/ADVANCED.md)
```

**脚本优于生成代码**: Token低,确定性强,可复用性高

#### 4.2 渐进式开发

| 阶段 | 时间 | 内容 |
|------|------|------|
| MVP | 1-2小时 | 单个SKILL.md,基础指令 |
| 增强 | 1-2天 | 添加脚本,优化指令 |
| 完整 | 1-2周 | 多Skills组合,持续迭代 |

#### 4.3 单一职责原则
```
✅ 拆分:
skills/
├── code-review/      # 只负责审查
├── test-generation/  # 只负责测试
└── documentation/    # 只负责文档
```

#### 4.4 版本管理
```bash
git add skills/my-skill/
git commit -m "feat(my-skill): add new feature"
```

---

### 5. 何时使用Skills

**信号1: 反复解释同一件事**
→ 把规则打包成Skill

**信号2: 需要特定知识/模板**
→ 通用Agent + 垂直知识 = 场景Context

**信号3: 多流程协同完成**
→ 多个Skill模块智能调用

---

### 6. Skills vs MCP vs Plugins

| 概念 | 比喻 | 作用 | 使用方式 |
|------|------|------|---------|
| Skills | 📘 工作手册 | 告诉AI"怎么做" | 自动加载 |
| Plugins | 🔌 专业顾问 | 提供专业建议 | 自动调用 |
| MCP | 🧰 外部工具 | 连接外部世界 | 自动使用 |

**关系**: Skills和MCP是互补关系,非替代

---

## 第二部分: Skills资源库

## 1. 推荐Skills清单

### 1.1 官方Skills (Anthropic)

#### **skill-creator** ⭐ 必备
- **功能**: 创建Skills的元Skill
- **用途**: 帮助你创建新的Skills
- **安装**:
  ```bash
  cd ~/.claude/skills
  git clone https://github.com/anthropics/skills/tree/main/skills/skill-creator
  ```
- **文档**: https://github.com/anthropics/skills/tree/main/skills/skill-creator

#### **code-review-helper**
- **功能**: 代码审查助手
- **用途**: 检查代码质量、性能优化、最佳实践
- **场景**: 提交PR前自动审查

#### **test-automator**
- **功能**: 测试自动化
- **用途**: 生成单元测试、集成测试
- **场景**: 开发新功能时

---

### 1.2 社区热门Skills

#### **Superpowers** ⭐ 推荐
- **功能**: 增强AI能力
- **包含**:
  - 高级代码分析
  - 架构设计建议
  - 性能优化
- **仓库**: [搜索GitHub]
- **适合**: 所有开发者

#### **planning-with-files** ⭐ 推荐
- **功能**: 基于文件的任务规划
- **用途**:
  - 分析项目结构
  - 生成实施计划
  - 任务拆分
- **场景**: 接手新项目时

#### **documentation-generator**
- **功能**: 自动生成文档
- **用途**:
  - API文档
  - README生成
  - 代码注释
- **场景**: 开发完成后

---

### 1.3 营销专用Skills

#### **topic-generation**
- **功能**: 快速生成文章选题
- **输出**: 3-4个选题方向,包含标题、大纲、目标受众
- **触发**: "选题"、"写什么"、"内容选题"

#### **video-outline-generation**
- **功能**: 生成视频脚本大纲
- **输出**: 2-3个方案,包含标题、缩略图建议
- **触发**: "视频大纲"、"视频脚本"

#### **personal-material-search**
- **功能**: 搜索个人素材库(1800+条记录)
- **用途**: 为内容增加真实案例
- **触发**: "真实经历"、"个人案例"、"素材库"

#### **ai-proofreading**
- **功能**: 降低AI检测率至30%以下
- **方法**: 三遍审校(内容、风格、细节)
- **触发**: "AI味太重"、"降低AI检测率"

---

### 1.4 产品分析Skills

#### **product-analysis** (测试用)
- **功能**: 产品分析和市场评估
- **输出**: 100分制评分报告
- **框架**:
  1. 市场潜力评估
  2. 竞争分析
  3. 用户洞察
  4. 行动建议
- **触发**: "分析XX产品"、"评估XX产品"

---

## 2. Skills分享方法

### 2.1 本地导出

#### 方法1: 直接复制目录
```bash
# 复制单个Skill
cp -r ~/.claude/skills/my-skill /path/to/backup/

# 复制所有Skills
cp -r ~/.claude/skills/* /path/to/backup/skills/
```

#### 方法2: 打包分享
```bash
# 打包单个Skill
tar -czf my-skill.tar.gz -C ~/.claude/skills my-skill

# 打包所有Skills
tar -czf my-skills.tar.gz -C ~/.claude/skills .
```

#### 方法3: ZIP压缩(Windows)
```powershell
# 压缩单个Skill
Compress-Archive -Path ~/.claude/skills/my-skill -DestinationPath my-skill.zip

# 压缩所有Skills
Compress-Archive -Path ~/.claude/skills/* -DestinationPath my-skills.zip
```

---

### 2.2 Git仓库管理 (推荐)

#### 创建Skills仓库
```bash
# 创建仓库目录
mkdir ~/my-skills
cd ~/my-skills
git init

# 复制Skills到仓库
cp -r ~/.claude/skills/* .

# 创建README
echo "# My Skills Collection" > README.md
echo "这是我个人收集和开发的Skills" >> README.md

# 提交到GitHub
git add .
git commit -m "Initial commit: Add my skills"
git branch -M main
git remote add origin https://github.com/yourname/my-skills.git
git push -u origin main
```

#### 仓库结构建议
```bash
my-skills/
├── README.md                  # Skills说明文档
├── skills/
│   ├── official/             # 官方Skills
│   ├── community/            # 社区Skills
│   └── custom/               # 自定义Skills
│       ├── product-analysis/
│       ├── topic-generation/
│       └── ...
└── scripts/                  # 相关脚本
    ├── sync-skills.sh        # 同步脚本
    └── backup-skills.sh      # 备份脚本
```

---

### 2.3 多设备同步

#### 方法1: Git克隆(推荐) ⭐

**在新电脑上**:
```bash
# 克隆仓库
git clone https://github.com/yourname/my-skills.git ~/.claude/skills

# 或者使用SSH
git clone git@github.com:yourname/my-skills.git ~/.claude/skills

# 验证安装
ls ~/.claude/skills
```

**保持同步**:
```bash
# 拉取最新更新
cd ~/.claude/skills
git pull origin main

# 推送本地修改
git add .
git commit -m "Update skills"
git push origin main
```

#### 方法2: 云同步工具

**iCloud (macOS/iOS)**:
```bash
# 创建符号链接
ln -s ~/Library/Mobile\ Documents/com~apple~CloudDocs/skills ~/.claude/skills
```

**Dropbox**:
```bash
# 创建符号链接
ln -s ~/Dropbox/skills ~/.claude/skills
```

**OneDrive**:
```bash
# 创建符号链接
ln -s ~/OneDrive/skills ~/.claude/skills
```

**优点**:
- 自动同步,无需手动操作
- 支持多平台
- 版本历史

**缺点**:
- 需要安装云服务客户端
- 大文件同步可能较慢

#### 方法3: 手动同步

**从备份恢复**:
```bash
# 解压备份
tar -xzf my-skills.tar.gz -C ~/.claude/skills

# 或在Windows上
Expand-Archive -Path my-skills.zip -DestinationPath ~/.claude/skills
```

---

## 3. Skills市场与社区

### 3.1 官方资源

**Anthropic Official Skills**:
- **GitHub**: https://github.com/anthropics/skills
- **文档**: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- **包含**: 20+ 官方Skills

**Claude Code Docs**:
- **Agent Skills**: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- **最佳实践**: https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers

---

### 3.2 社区资源

**Awesome Claude Skills** (假设存在):
- 搜索GitHub: `topic:claude-skills`
- 搜索关键词: `claude skills`, `claude code skills`

**Reddit社区**:
- r/Claude
- r/LocalLLaMA

**中文社区**:
- 微信公众号(搜索"Claude Code")
- 知乎专栏
- 掘金社区

---

### 3.3 贡献自己的Skills

#### 发布到GitHub
```bash
# 1. 创建仓库
git init my-skill
cd my-skill

# 2. 添加SKILL.md
echo "# My Skill" > SKILL.md

# 3. 提交到GitHub
git add .
git commit -m "Add my skill"
git remote add origin https://github.com/yourname/my-skill.git
git push -u origin main

# 4. 添加topics(方便搜索)
# 在GitHub仓库页面: Settings → Topics
# 添加: claude-skills, claude-code, agent
```

#### 发布到社区
- Reddit: 发布到 r/Claude
- Twitter: 使用 #ClaudeSkills 标签
- 微信: 写文章介绍你的Skill

---

## 4. Skills开发工作流

### 4.1 创建新Skill

#### 使用skill-creator
```bash
# 在Claude Code中
"帮我创建一个[功能描述]的Skill"

# skill-creator会自动:
# 1. 生成SKILL.md模板
# 2. 设计description
# 3. 提供最佳实践建议
```

#### 手动创建
```bash
# 创建目录
mkdir -p ~/.claude/skills/my-skill

# 创建SKILL.md
cat > ~/.claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: |
  功能描述。使用此技能当用户需要:
  1. 场景1
  2. 场景2

  触发关键词: "关键词1", "关键词2"

  输出: 产出说明。
---

# Skill 名称

## 核心功能
简要说明...

## 执行流程
Step 1: ...
Step 2: ...
EOF
```

---

### 4.2 测试Skill

#### 本地测试
```bash
# 在Claude Code中
"测试my-skill skill"

# 或者直接触发
"使用my-skill功能"
```

#### 验证触发
```bash
# 查看Skill是否被加载
# 在Claude Code启动时会显示:
# "my-skill is loading"
```

---

### 4.3 优化Skill

#### 迭代流程
1. **使用测试**: 实际使用Skill
2. **收集反馈**: 记录问题
3. **优化description**: 让触发更准确
4. **简化指令**: 删除冗余内容
5. **添加脚本**: 如果需要,添加scripts/

#### 版本管理
```bash
cd ~/.claude/skills/my-skill
git add SKILL.md
git commit -m "v2.0: Optimize description and simplify instructions"
git tag v2.0
git push origin main --tags
```

---

### 4.4 分享Skill

#### 导出到仓库
```bash
# 复制到Git仓库
cp -r ~/.claude/skills/my-skill ~/my-skills/skills/custom/

# 提交
cd ~/my-skills
git add skills/custom/my-skill
git commit -m "Add my-skill v2.0"
git push origin main
```

#### 生成分享链接
```bash
# GitHub仓库链接
https://github.com/yourname/my-skills/tree/main/skills/custom/my-skill

# 或创建Release(带下载)
gh release create v2.0 --title "My Skill v2.0" --notes "Release notes"
```

---

## 5. 常见问题

### Q1: Skill不生效怎么办?
**A**:
1. 检查SKILL.md格式(特别是YAML frontmatter)
2. 检查description是否包含触发关键词
3. 重启Claude Code会话
4. 查看`~/.claude/skills/`目录权限

### Q2: 多台电脑如何保持最新?
**A**:
```bash
# 方法1: Git(推荐)
cd ~/.claude/skills
git pull origin main

# 方法2: 云同步
# 等待自动同步完成
```

### Q3: Skill冲突怎么办?
**A**:
1. 检查是否有同名Skill
2. 删除旧版本: `rm -rf ~/.claude/skills/conflicting-skill`
3. 安装新版本

### Q4: 如何备份Skills?
**A**:
```bash
# 定期备份
tar -czf skills-backup-$(date +%Y%m%d).tar.gz ~/.claude/skills

# 或使用Git
cd ~/.claude/skills
git push origin main
```

---

## 6. 快速开始检查清单

### 首次设置
- [ ] 安装skill-creator
- [ ] 创建GitHub仓库存储Skills
- [ ] 安装3-5个核心Skills
- [ ] 测试Skill触发

### 日常使用
- [ ] 使用Git同步Skills
- [ ] 定期备份Skills
- [ ] 记录有用的Skills到仓库

### 多设备同步
- [ ] 在每台电脑上克隆Skills仓库
- [ ] 配置自动同步(可选)
- [ ] 验证Skill在所有设备上可用

---

**核心原则**:

> **不要重复造轮子。优先使用社区验证过的Skills,然后根据需求定制。**
>
> **及时分享你的Skills。帮助社区成长,也会获得反馈和改进建议。**
>
> **保持Skills仓库整洁。定期清理不用的Skills,保持仓库可维护性。**

---

**相关文档**:
- [00-Claude-Code环境配置.md](./00-Claude-Code环境配置.md) - 安装配置Claude Code
- [02-Agent开发与系统搭建.md](./02-Agent开发与系统搭建.md) - Agent开发与个人系统
- [03-RLM递归思想.md](./03-RLM递归思想.md) - RLM方法论
