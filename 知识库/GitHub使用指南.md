# 知识库 GitHub 管理完整指南

> **版本**: v1.0
> **更新**: 2025-12-29
> **适用**: 多设备、跨时间在线管理知识库

---

## 📚 目录

1. [快速开始](#快速开始)
2. [多设备同步流程](#多设备同步流程)
3. [日常使用方法](#日常使用方法)
4. [常见场景](#常见场景)
5. [故障排除](#故障排除)

---

## 🚀 快速开始

### 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 设置仓库名：`knowledge-base`（或自定义）
3. **设置为 Private**（私有仓库）
4. 不要勾选任何初始化选项
5. 点击 "Create repository"

### 第二步：关联本地仓库到 GitHub

```bash
# 在知识库文件夹中执行
cd "D:\Project code\知识库"

# 关联远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/knowledge-base.git

# 推送到 GitHub
git push -u origin master
```

**示例**：
```bash
git remote add origin https://github.com/zhangsan/knowledge-base.git
git push -u origin master
```

---

## 🔄 多设备同步流程

### 核心原理

```
┌─────────────┐      push      ┌─────────────┐
│  设备A(家)  │ ──────────────> │   GitHub   │
│  本地编辑   │ <────────────── │  远程仓库   │
└─────────────┘      pull      └─────────────┘
        ▲                             │
        │                             │
        └─────────────┬───────────────┘
                      │
                 ┌─────┴─────┐
                 │  设备B(公司)│
                 │  本地编辑   │
                 └───────────┘
```

### 工作流程

#### 场景1：在设备A上编辑后同步

```bash
# 1. 编辑文档（使用VS Code等）
# 2. 推送到GitHub
双击运行: push-to-github.bat
# 或手动执行:
git add .
git commit -m "更新了XX文档"
git push origin master
```

#### 场景2：在设备B上获取设备A的更新

```bash
# 拉取最新内容
双击运行: pull-from-github.bat
# 或手动执行:
git pull origin master
```

#### 场景3：在设备B上编辑后，回到设备A继续工作

```bash
# 设备A执行：先拉取（获取设备B的修改），再编辑
git pull origin master

# 编辑后推送到GitHub
git add .
git commit -m "继续完善XX内容"
git push origin master
```

---

## 📝 日常使用方法

### 方法1：使用快捷脚本（推荐）

在知识库根目录下，已创建3个批处理文件：

#### ① `pull-from-github.bat` - 仅拉取
**用途**: 从GitHub获取最新内容到本地
**场景**: 切换设备时，或者别人更新了内容

```
双击运行 → 自动执行 git pull
```

#### ② `push-to-github.bat` - 仅推送
**用途**: 推送本地修改到GitHub
**场景**: 你编辑完文档后，想要备份到云端

```
双击运行 → 输入提交说明 → 自动执行 git add + commit + push
```

#### ③ `sync-github.bat` - 双向同步
**用途**: 先拉取最新内容，再推送本地修改
**场景**: 在多设备间切换时的安全同步

```
双击运行 → 自动执行 git pull → git add → git commit → git push
```

### 方法2：手动 Git 命令

```bash
# 查看当前状态
git status

# 拉取最新内容
git pull origin master

# 添加所有修改
git add .

# 提交到本地仓库
git commit -m "你的提交说明"

# 推送到GitHub
git push origin master
```

---

## 💡 常见场景

### 场景1：每天开始工作前

```bash
# 1. 拉取最新内容（获取其他设备的更新）
git pull origin master

# 2. 查看哪些文件被修改了
git status
```

### 场景2：完成编辑后

```bash
# 推送更新到GitHub
双击 push-to-github.bat
```

### 场景3：切换设备时（家 ↔ 公司）

```bash
# 旧设备：确保推送了所有修改
git push origin master

# 新设备：拉取最新内容
git pull origin master
```

### 场景4：多设备同时编辑导致冲突

```bash
# 1. 先拉取（会提示冲突）
git pull origin master

# 2. 手动解决冲突文件（用VS Code打开）
# 搜索 "====" 标记，选择保留哪部分内容

# 3. 解决后重新提交
git add .
git commit -m "解决冲突"
git push origin master
```

### 场景5：查看历史版本

```bash
# 查看提交历史
git log --oneline

# 回退到某个版本（如果需要）
git reset --hard 版本号
```

### 场景6：只在GitHub网页查看/编辑

**访问**: https://github.com/YOUR_USERNAME/knowledge-base

**优点**:
- 无需本地环境
- 任何设备有浏览器即可
- GitHub网页编辑器支持Markdown

**缺点**:
- 需要网络
- 编辑体验不如本地工具

---

## 🔧 故障排除

### 问题1：提示 "Failed to connect to github.com"

**原因**: 网络问题

**解决**:
- 检查网络连接
- 如果在国内，可能需要配置代理或使用GitHub镜像
- 使用手机热点测试

### 问题2：提示 "Permission denied"

**原因**: 认证失败

**解决**:
```bash
# 配置GitHub Personal Access Token
# 1. 访问 https://github.com/settings/tokens
# 2. 生成新 Token，勾选 repo 权限
# 3. 使用Token代替密码

# 或者使用SSH方式（推荐）
git remote set-url origin git@github.com:YOUR_USERNAME/knowledge-base.git
```

### 问题3：提示 "Conflict" 冲突

**原因**: 多设备同时修改了同一文件的同一行

**解决**:
```bash
# 1. 查看冲突文件
git status

# 2. 用VS Code打开冲突文件，搜索 "<<<<<<<"

# 3. 手动编辑，保留需要的内容

# 4. 标记为已解决
git add 冲突文件.md

# 5. 提交
git commit -m "解决冲突"
git push origin master
```

### 问题4：想撤销本地修改

```bash
# 撤销单个文件的修改
git checkout -- 文件名.md

# 撤销所有本地修改
git reset --hard HEAD

# ⚠️ 注意：这会丢失未提交的修改！
```

### 问题5：误删了文件，想恢复

```bash
# 从Git历史恢复
git checkout HEAD -- 文件名.md
```

---

## 📱 新设备配置

### 配置新电脑

```bash
# 1. 安装 Git
# 下载：https://git-scm.com/downloads

# 2. 克隆仓库
cd "D:\Project code"
git clone https://github.com/YOUR_USERNAME/knowledge-base.git 知识库

# 3. 完成！现在可以编辑和同步了
```

### 配置手机

#### iOS (iPhone/iPad)
1. 安装 **Working Copy** (Git客户端)
2. 安装 **Obsidian** 或 **Textastic** (Markdown编辑器)
3. 在Working Copy中克隆仓库
4. 配置自动同步

#### Android
1. 安装 **Termux** (终端模拟器)
2. 在Termux中安装Git: `pkg install git`
3. 克隆仓库: `git clone https://github.com/YOUR_USERNAME/knowledge-base.git`
4. 使用Markdown编辑器编辑文件

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **每天开始工作前先 `git pull`**
   - 确保本地是最新版本

2. **编辑完成后立即 `git push`**
   - 避免忘记同步
   - 防止多设备冲突

3. **写清晰的提交说明**
   - 好：`"更新SEO内容营销模块-添加GEO优化部分"`
   - 差：`"update"` 或 `"123"`

4. **定期查看提交历史**
   ```bash
   git log --oneline --graph --all
   ```

5. **重要修改前先备份**
   ```bash
   git branch backup-2025-12-29
   git checkout backup-2025-12-29
   ```

### ❌ 避免做法

1. **不要在不同设备上同时编辑同一个文件**
   - 容易产生冲突

2. **不要在本地修改后直接在GitHub网页编辑**
   - 会导致冲突

3. **不要强制推送（`git push -f`）**
   - 会丢失历史记录
   - 除非你确定要这样做

4. **不要把敏感信息提交到GitHub**
   - 即使是私有仓库，也要注意密码、API密钥等

---

## 📊 版本记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-12-29 | 初始版本 |

---

## 🆘 获取帮助

- **GitHub文档**: https://docs.github.com
- **Git文档**: https://git-scm.com/doc
- **常见问题**: 查看 [GitHub FAQ](https://docs.github.com/get-started)

---

**祝你使用愉快！** 🎉
