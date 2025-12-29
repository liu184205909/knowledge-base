# 🎯 知识库 GitHub 仓库设置 - 完整教程

> **目标**: 将本地知识库推送到 GitHub 私有仓库，实现多设备同步

---

## 📋 前置准备

- ✅ GitHub 账号（没有？去 https://github.com 注册）
- ✅ 本地知识库已初始化 Git（已完成 ✅）
- ✅ 5分钟时间

---

## 第一步：创建 GitHub 仓库

### 1. 访问 GitHub

打开浏览器访问: https://github.com/new

### 2. 填写仓库信息

```
Repository name*: knowledge-base
└─ 或者自定义名称，如: my-knowledge-base

Description (可选): 我的个人知识库 - 数字营销/AI/开发

选择: ⚪ Private (私有)  ← 重要！选私有，不要选Public
```

### 3. 其他设置

```
不要勾选任何选项:
☐ Add a README file
☐ Add .gitignore
☐ Choose a license

全部留空，直接点击 "Create repository"
```

### 4. 创建成功

页面会显示类似：
```
…or create a new repository on the command line
echo "# knowledge-base" >> README.md
git init
git add README.md
git commit -m "first commit"
...
```

**复制你的仓库URL**，格式为：
```
https://github.com/你的用户名/knowledge-base.git
```

---

## 第二步：关联本地仓库到 GitHub

### 打开命令行（Git Bash 或 PowerShell）

```bash
cd "D:\Project code\知识库"
```

### 关联远程仓库

**替换下面的 `YOUR_USERNAME` 为你的 GitHub 用户名：**

```bash
git remote add origin https://github.com/YOUR_USERNAME/knowledge-base.git
```

**示例**：
```bash
# 如果你的GitHub用户名是 zhangsan
git remote add origin https://github.com/zhangsan/knowledge-base.git
```

### 验证关联

```bash
git remote -v
```

应该显示：
```
origin    https://github.com/YOUR_USERNAME/knowledge-base.git (fetch)
origin    https://github.com/YOUR_USERNAME/knowledge-base.git (push)
```

---

## 第三步：推送到 GitHub

### 方法1：使用快捷脚本（推荐）

```bash
# 双击运行这个文件
push-to-github.bat
```

会提示输入提交说明，输入：
```
初始化知识库，推送到GitHub
```

### 方法2：手动命令

```bash
# 推送到GitHub
git push -u origin master
```

**注意**：首次推送会要求登录 GitHub

### 登录 GitHub

#### 方式A：使用 Personal Access Token（推荐）

1. **生成 Token**
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - Note: `知识库访问`
   - 勾选: `repo` (Full control of private repositories)
   - 点击 "Generate token"
   - **复制Token**（只显示一次！）

2. **使用Token推送**
   ```bash
   git push -u origin master
   # 用户名: 输入你的GitHub用户名
   # 密码: 粘贴刚才复制的Token
   ```

#### 方式B：使用 SSH（更安全，但配置稍复杂）

```bash
# 1. 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub  # Linux/Mac
type %USERPROFILE%\.ssh\id_ed25519.pub  # Windows

# 3. 添加到GitHub
# 访问: https://github.com/settings/ssh/new
# 粘贴公钥，点击 Add SSH key

# 4. 切换远程仓库为SSH
git remote set-url origin git@github.com:YOUR_USERNAME/knowledge-base.git

# 5. 推送
git push -u origin master
```

---

## 第四步：验证成功

### 在浏览器访问

```
https://github.com/YOUR_USERNAME/knowledge-base
```

你应该看到：
- ✅ 所有文件夹（AI工作流方法库、GEO相关文章等）
- ✅ README.md
- ✅ 所有 Markdown 文件

### 测试克隆到新位置

```bash
# 在其他位置测试
cd "D:\Project code\test"
git clone https://github.com/YOUR_USERNAME/knowledge-base.git test-kb

# 查看克隆的内容
cd test-kb
ls
```

---

## 🎉 完成后的后续配置

### 1. 测试多设备同步

#### 在另一台电脑克隆

```bash
cd "D:\Project code"
git clone https://github.com/YOUR_USERNAME/knowledge-base.git 知识库
```

#### 在另一台电脑修改后推送

```bash
cd 知识库
# 编辑一个文件...
git add .
git commit -m "测试多设备同步"
git push origin master
```

#### 回到原电脑拉取

```bash
cd "D:\Project code\知识库"
git pull origin master
# 看到另一台电脑的修改！✅
```

### 2. 配置手机（可选）

#### iOS (iPhone/iPad)
1. 安装 **Working Copy** (免费)
2. 克隆仓库
3. 安装 **Obsidian** 或 **Textastic**
4. 在 Working Copy 中打开文件

#### Android
1. 安装 **Termux**
2. `pkg install git`
3. `git clone https://...`

### 3. 设置自动同步（可选）

#### 使用 GitHub Desktop（图形界面）
- 下载: https://desktop.github.com/
- 登录后自动同步
- 适合不喜欢命令行的用户

#### 使用批处理脚本（已创建）
- `pull-from-github.bat` - 一键拉取
- `push-to-github.bat` - 一键推送
- `sync-github.bat` - 一键同步

---

## ⚠️ 常见问题

### Q1: 推送失败，提示 "Authentication failed"

**解决**:
1. 确认使用的是正确的用户名和Token
2. 或切换到SSH方式（见上文方式B）

### Q2: 提示 "error: failed to push some refs"

**解决**:
```bash
# 先拉取远程内容
git pull origin master --allow-unrelated-histories

# 再推送
git push origin master
```

### Q3: 看到 "LF will be replaced by CRLF" 警告

**说明**: 这是Windows换行符警告，可以忽略

**解决**（如果想消除警告）:
```bash
git config --global core.autocrlf true
```

### Q4: 忘记 GitHub 用户名

**查看**:
```bash
git remote -v
```
会显示完整URL，包含用户名

---

## 📝 检查清单

完成以下步骤后，打勾 ✅

- [ ] GitHub 仓库已创建（私有）
- [ ] 本地仓库已关联到 GitHub
- [ ] 首次推送成功
- [ ] 在浏览器能看到所有文件
- [ ] 测试克隆到其他位置成功
- [ ] 理解 `git pull` 和 `git push` 的作用
- [ ] 知道如何处理冲突（查看流程图）

---

## 🎯 下一步

设置完成后，阅读：
1. [GitHub使用指南.md](./GitHub使用指南.md) - 详细使用方法
2. [多设备同步流程图.md](./多设备同步流程图.md) - 实战场景
3. [快速参考-命令速查.md](./快速参考-命令速查.md) - 常用命令

---

**祝你使用愉快！** 🚀

有问题？查看 [GitHub使用指南.md](./GitHub使用指南.md) 的故障排除章节
