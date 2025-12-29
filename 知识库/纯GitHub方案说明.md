# 纯 GitHub 方案（无需 Obsidian）

## 工作流程

### 1️⃣ 编辑文档
- **电脑**: VS Code / Typora / Mark Text / 任意文本编辑器
- **手机**: 
  - iOS: Markdown编辑器（如Textastic）+ Working Copy (Git)
  - Android: Termux + Git + Vim/Nano

### 2️⃣ 同步到 GitHub
```bash
git add .
git commit -m "更新文档"
git push
```

### 3️⃣ 其他设备获取
```bash
git pull
```

## 优势
✅ 最轻量，无需额外软件
✅ 你已经在用VS Code（编程时）
✅ 直接在GitHub网页端查看/编辑
✅ 完全控制，无学习成本

## 劣势
❌ 需要手动执行 git 命令
❌ 没有自动同步（可以写脚本解决）
❌ 没有知识图谱可视化
❌ 搜索需要用工具（VS Code自带搜索很好）

## 适合你吗？
- 如果你是开发者 → ✅ 非常适合
- 如果你习惯命令行 → ✅ 最简洁
- 如果不需要双链功能 → ✅ 完全够用
