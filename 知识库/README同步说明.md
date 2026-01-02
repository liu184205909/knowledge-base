# README 同步说明

> 本文档说明如何将知识库同步到 GitHub

---

## 🎯 同步目标

**GitHub 仓库**：https://github.com/liu184205909/knowledge-base

**同步内容**：
- ✅ 知识库文档
- ✅ 主 README.md
- ✅ 本同步说明文档

---

## 📋 同步步骤

### 第1步：初始化 Git 仓库（首次）

```bash
cd "d:\Program Files (x86)\Project Code\知识库"
git init
git add .
git commit -m "Initial commit: AI驱动个人知识库 v3.2"
```

### 第2步：连接 GitHub 仓库

```bash
git remote add origin https://github.com/liu184205909/knowledge-base.git
git branch -M main
```

### 第3步：推送到 GitHub

```bash
git push -u origin main
```

---

## 🔄 后续更新流程

### 本地修改后同步

```bash
cd "d:\Program Files (x86)\Project Code\知识库"

# 查看修改状态
git status

# 添加所有修改
git add .

# 提交修改
git commit -m "描述你的修改内容"

# 推送到GitHub
git push
```

### 快捷提交（一条命令）

```bash
cd "d:\Program Files (x86)\Project Code\知识库" && git add . && git commit -m "更新内容" && git push
```

---

## 📝 Commit 规范

### Commit 消息格式

```
<类型>: <简短描述>

<详细说明（可选）>
```

### 类型（Type）

- `feat`: 新增功能
- `update`: 更新内容
- `fix`: 修复问题
- `docs`: 文档修改
- `refactor`: 重构优化
- `delete`: 删除内容

### 示例

```bash
# 新增文档
git commit -m "feat: 添加Claude Code快速安装指南"

# 更新内容
git commit -m "update: 简化Skills完全指南（2370行→447行）"

# 修复问题
git commit -m "fix: 修正README中的文件路径引用"

# 重构
git commit -m "refactor: 重命名文件夹和文档，统一命名规范"
```

---

## ✅ v3.2 版本更新内容

### 文件夹重命名
- `00-Claude基础配置/` → `00-Claude Code/`

### 文档重命名
- `Claude Code自动安装指南.md` → `01-快速安装.md`
- `Claude-Skills完全指南.md` → `02-Skills核心概念.md`
- `UI设计资源.md` → `03-UI设计自动化.md`

### 删除文档
- ❌ `Claude Code工具生态.md`
- ❌ `Claude Code基础配置.md`
- ❌ `ZRead MCP配置.md`
- ❌ `快速开始/` 文件夹

### 简化文档
- Skills完全指南：2370行 → 447行（减少81%）
- 总文档：3500行 → 920行（减少74%）

### 更新主 README
- ✅ 修改文件夹路径引用
- ✅ 更新文档名称
- ✅ 更新统计数据（25个文档，~25,000行）
- ✅ 添加 v3.2 更新日志

---

## 🎯 版本历史

| 版本 | 日期 | 主要更新 |
|------|------|---------|
| v3.1 | 2025-12-31 | 初始版本 |
| v3.2 | 2026-01-02 | 简化文档、重命名文件夹、统一命名规范 |

---

## 💡 注意事项

### 1. 敏感信息检查

**提交前检查**：
- ❌ 不要包含 API Key
- ❌ 不要包含密码
- ❌ 不要包含个人隐私信息

**验证命令**：
```bash
git diff --cached # 查看将要提交的内容
```

### 2. 大文件处理

**如果仓库过大**：
```bash
# 查看仓库大小
du -sh .git

# 清理历史（如需）
git gc --prune=now --aggressive
```

### 3. .gitignore 文件

**建议创建** `.gitignore`：
```
# 备份文件
*.backup
*.bak
*~

# 临时文件
*.tmp
*.temp

# 系统文件
.DS_Store
Thumbs.db

# IDE文件
.vscode/
.idea/
```

---

## 🔗 快捷命令

### 完整工作流

```bash
# 同步到GitHub
cd "d:\Program Files (x86)\Project Code\知识库" && git add . && git commit -m "update: 更新内容" && git push
```

### 查看状态

```bash
# 查看修改状态
git status

# 查看修改内容
git diff

# 查看提交历史
git log --oneline
```

### 撤销操作

```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销工作区修改
git checkout -- .

# 撤销暂存区修改
git reset HEAD
```

---

**最后更新**：2026-01-02
**适用版本**：v3.2
**维护**：保持简洁，同步及时
