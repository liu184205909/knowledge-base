# 使用 Playwright 读取飞书文档完整指南

## 📋 准备工作

### 步骤1: 获取飞书 Cookies

#### 方法 A: 使用 Chrome DevTools(推荐)

1. **打开 Chrome 浏览器,登录飞书**
   - 访问 https://feishu.cn 并登录
   - 确保能访问目标文档

2. **打开开发者工具**
   - Windows: 按 `F12` 或 `Ctrl + Shift + I`
   - Mac: 按 `Cmd + Option + I`

3. **切换到 Application 标签**
   - 点击顶部的 "Application" 或 "应用" 标签
   - 如果没有,点击 ">>" 更多按钮找到它

4. **找到 Cookies**
   - 左侧菜单展开 "Cookies" (存储 → Cookies)
   - 点击 `https://waytoagi.feishu.cn` 或 `.feishu.cn`

5. **复制关键 Cookies**
   需要复制的 Cookies 包括:
   - ✅ `passport_sessionId` (最重要)
   - ✅ `passport_csrf_session`
   - ✅ `tenant`
   - ✅ `locale`
   - ✅ 任何其他以 `feishu_` 开头的 cookie

6. **记录格式**
   点击每个 cookie,在右侧面板查看:
   ```
   名称: passport_sessionId
   值: xxxxxxxxxxxxxxxxx
   域名: .feishu.cn
   路径: /
   ```

---

#### 方法 B: 使用 EditThisCookie 扩展(最简单)

1. **安装扩展**
   - Chrome: 搜索 "EditThisCookie" 安装
   - 或使用 "Cookie-Editor"

2. **导出 Cookies**
   - 登录飞书后访问目标文档
   - 点击浏览器工具栏的 Cookie 图标
   - 选择 "Export" → "JSON 格式"
   - 复制所有内容

---

### 步骤2: 配置 Cookies 文件

将获取的 Cookies 填入 `feishu-cookies.json`:

**示例格式:**
```json
{
  "cookies": [
    {
      "name": "passport_sessionId",
      "value": "你复制的实际值",
      "domain": ".feishu.cn",
      "path": "/",
      "httpOnly": true,
      "secure": true,
      "sameSite": "None"
    },
    {
      "name": "passport_csrf_session",
      "value": "你复制的实际值",
      "domain": ".feishu.cn",
      "path": "/"
    }
  ]
}
```

**重要提示:**
- 将 `"YOUR_SESSION_ID_HERE"` 替换为实际值
- 保留引号和逗号
- 确保 JSON 格式正确

---

### 步骤3: 安装 Playwright

```bash
# 安装 Playwright
npm install playwright

# 安装浏览器(首次运行需要)
npx playwright install chromium
```

---

### 步骤4: 运行脚本

```bash
# 方式1: 直接运行
node read-feishu-with-cookies.js

# 方式2: 使用 npx
npx playwright-code-runner read-feishu-with-cookies.js
```

---

## 🎯 使用 Claude Code 的 Playwright MCP(更简单)

如果你已经安装了 Playwright MCP,可以直接让我来操作!

### 操作步骤:

1. **你提供 Cookies**
   - 按上述步骤获取 Cookies
   - 将内容粘贴给我

2. **我使用 Playwright MCP 读取**
   ```
   使用 Playwright 访问飞书文档,加载这些 Cookies: [你的 Cookies]
   ```

3. **自动提取内容并总结**

---

## 📸 快速测试方案

如果不想手动获取 Cookies,可以试试这个:

1. **我启动 Playwright 浏览器**
2. **你手动在浏览器中登录飞书**
3. **登录完成后告诉我**
4. **我提取文档内容**

---

## ✅ 推荐流程

**最快的方式:**

1. 你现在按 `F12` 打开开发者工具
2. 访问飞书文档并登录
3. 在 Application → Cookies 中找到这几个值:
   - `passport_sessionId`
   - `passport_csrf_session`
4. 把这些值粘贴给我
5. 我直接使用 Playwright MCP 读取并总结

---

**你想用哪种方式?**
- A. 你提供 Cookies,我来操作
- B. 我启动浏览器,你手动登录,然后我读取
- C. 我给你准备好脚本,你自己运行

告诉我你的选择!
