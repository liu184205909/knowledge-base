# Playwright 读取飞书文档工具集

## 📁 文件说明

### 1. **get-feishu-cookies.js**
获取飞书 Cookies 的教程脚本

### 2. **read-feishu-with-cookies.js**
自动化读取飞书文档的主脚本

### 3. **feishu-cookies.json**
Cookies 配置文件（需要填入你的实际 Cookies）

### 4. **使用 Playwright 读取飞书文档.md**
完整的使用教程

### 5. **README.md** (本文件)
快速上手指南

---

## 🚀 快速开始

### 方法 1: 使用 Playwright MCP（推荐，已验证成功）

**优点**: 无需安装 Node.js，直接使用 Claude Code 的 Playwright MCP

**步骤**:
1. 在浏览器中登录飞书
2. 按 F12 → Application → Cookies
3. 复制所有 Cookie 值
4. 粘贴给 Claude Code
5. Claude Code 使用 Playwright 自动读取并总结

**示例命令**:
```
使用 Playwright 访问 https://waytoagi.feishu.cn/wiki/YVC3wnT3NixTF1kVC5RckX16ney
加载这些 Cookies: [你的 Cookies]
提取并总结文档内容
```

---

### 方法 2: 使用 Node.js 脚本

#### 前置要求
```bash
# 安装 Playwright
npm install playwright

# 安装浏览器
npx playwright install chromium
```

#### 步骤

1. **获取 Cookies**
   - 打开 Chrome，登录飞书
   - F12 → Application → Cookies
   - 复制关键 Cookies（session, sl_session, passport_app_access_token 等）

2. **配置 Cookies 文件**
   编辑 `feishu-cookies.json`，填入你的 Cookies:
   ```json
   {
     "cookies": [
       {
         "name": "session",
         "value": "你的实际值",
         "domain": ".feishu.cn"
       }
     ]
   }
   ```

3. **运行脚本**
   ```bash
   node read-feishu-with-cookies.js
   ```

4. **查看结果**
   - 控制台输出文档内容
   - `feishu-doc-content.txt` - 文本内容
   - `feishu-screenshot.png` - 页面截图

---

## 📋 关键 Cookies 列表

从你提供的 Cookies 中，这些是最重要的：

| Cookie 名称 | 作用 | 必需 |
|------------|------|------|
| `session` | 会话 ID | ✅ 必需 |
| `sl_session` | 登录会话 | ✅ 必需 |
| `passport_app_access_token` | 访问令牌 | ✅ 必需 |
| `_csrf_token` | CSRF 保护 | ⭐ 推荐 |
| `bv_csrf_token` | CSRF Token | ⭐ 推荐 |
| `swp_csrf_token` | CSRF Token | ⭐ 推荐 |

---

## 🎯 使用场景

### 场景 1: 一次性读取文档
直接使用 Playwright MCP，让 Claude Code 自动操作

### 场景 2: 批量读取多个文档
使用 Node.js 脚本，修改 URL 即可

### 场景 3: 定期监控文档更新
设置定时任务，定期运行脚本

---

## ⚠️ 注意事项

1. **Cookies 安全**
   - ⚠️ 不要将 `feishu-cookies.json` 提交到 Git
   - ⚠️ Cookies 有时效性，过期后需重新获取
   - ⚠️ 不要分享包含真实 Cookies 的文件

2. **访问限制**
   - 部分飞书文档可能需要特定权限
   - 即使登录也可能无法访问某些私密文档

3. **技术限制**
   - 飞书可能有反爬虫机制
   - 频繁访问可能导致 IP 被限制

---

## 🔧 故障排除

### 问题 1: 无法读取内容
**解决方案**:
- 检查 Cookies 是否过期
- 确认账号有访问权限
- 尝试重新获取 Cookies

### 问题 2: 安装 Playwright 失败
**解决方案**:
```bash
# 使用国内镜像
npm set playwright_download_host=https://npmmirror.com/mirrors/playwright
npx playwright install chromium
```

### 问题 3: 页面加载超时
**解决方案**:
- 修改脚本中的 timeout 参数
- 检查网络连接

---

## 📚 相关资源

- [Playwright 官方文档](https://playwright.dev)
- [飞书开放平台](https://open.feishu.cn)
- [Claude Code MCP 文档](https://code.claude.com/docs)

---

## ✅ 成功案例

已成功读取:
- ✅ WaytoAGI - Vibe Coding 训练营文档
- ✅ URL: https://waytoagi.feishu.cn/wiki/YVC3wnT3NixTF1kVC5RckX16ney
- ✅ 使用 31 个 Cookies 成功加载
- ✅ 提取完整文档内容并总结

---

**最后更新**: 2026-01-10
**维护者**: Claude Code AI Assistant
**版本**: v1.0
