# Claude Code 第三方API配置指南

**版本**: v1.0
**分类**: Claude Code进阶配置
**来源**: 刘小排 - 不会封号的Claude Code使用方法（已稳定测试一个月）

## 🎯 核心价值

> **通过Google AI Ultra + Antigravity Tools接入第三方API，实现稳定不掉号的Claude Code使用**

**问题**：
- Claude Code官方订阅容易被封号
- Max Plan $200/月，虽然性价比高，但封号风险大

**解决方案**：
- 使用Google AI Ultra套餐（几乎不封号）
- 通过Antigravity Tools转换为Claude API
- 官方Claude Code客户端 + 满血版Claude API = 稳定使用

## 📋 快速开始（省流版）

**三步搞定**：
1. **购买Google AI Ultra或Pro套餐**
2. **下载Antigravity Tools**（把Google AI的Claude变成API）
3. **配置Claude Code使用该API**

**效果**：
- ✅ 官方正版Claude Code客户端
- ✅ 满血版Claude Code API（Opus 4.5、Sonnet 4.5）
- ✅ 稳定使用一个月以上，无封号
- ✅ 可共享给团队使用

---

## 🔧 详细步骤

### 第一步：购买Google AI Ultra或Pro套餐

**推荐方案**：

| 套餐 | 价格 | 特点 | 推荐度 |
|------|------|------|--------|
| **Google AI Ultra** | 较贵 | 限额充足，5小时刷新一次 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| **Google AI Pro** | 闲鱼成品号一年几十元 | 可多买几个，自动轮换 | ⭐⭐⭐⭐ 预算有限选择 |

**购买渠道**：
- 闲鱼（成品账号）
- 其他官方渠道

**能力对比**：
Google AI Ultra可以同时使用：
- Gemini 3 Pro
- Gemini 3 Flash
- **Claude Opus 4.5** ✅
- **Claude Sonnet 4.5** ✅

---

### 第二步：下载Antigravity Tools

**下载地址**：https://github.com/lbjlaq/Antigravity-Manager/releases

**安装步骤**：
1. 下载适合你操作系统的最新版本
2. 安装并启动Antigravity Tools
3. 点击"添加账号"，登录第一步准备的Google AI账号

**功能面板**：
- **账号管理**：管理多个Google AI账号
- **使用统计**：查看各个模型的限额和使用情况
- **API转换**：支持多种主流协议（Anthropic、OpenAI等）

**配置Anthropic协议**：
1. 选择"Claude 4.5 Opus (Thinking)"
2. 选择协议为"Anthropic"
3. 复制生成的API端点和密钥

**示例API**：
```
端点：http://localhost:8045/v1/messages
密钥：sk-c103bdb0eae4480aacb2198e69ddfe4a
```

---

### 第三步：配置Claude Code使用该API

#### 方式一：自动配置（推荐）

使用AI Agent（如Codex）自动配置Claude Code：

**Prompt模板**：
```markdown
我的系统中已经安装了Claude Code CLI、Claude Code VS Extension

配置文件地址：
- Claude Code VS Extension: ~/Library/Application Support/Antigravity/User/settings.json
- Claude Code CLI: [请填写实际路径]

你的任务：
1. 把Claude Code CLI和VS Extension都改成使用我们自己的API，而不是通过官方订阅认证
2. 默认打开bypassPermissions
3. 让我进入的时候，不要弹出提示我登录

API信息：
```
http://localhost:8045/v1/messages
curl http://localhost:8045/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-c103bdb0eae4480aacb2198e69ddfe4a" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-5-thinking",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]'
```
```

#### 方式二：手动配置

**步骤**：
1. 找到Claude Code配置文件位置
2. 修改配置文件，填入API端点和密钥
3. 启用`bypassPermissions`
4. 禁用登录提示

**Claude Code VS Extension配置示例**：
```json
{
  "apiUrl": "http://localhost:8045/v1/messages",
  "apiKey": "sk-c103bdb0eae4480aacb2198e69ddfe4a",
  "bypassPermissions": true,
  "disableLoginPrompt": true
}
```

**配置验证**：
```bash
claude code config
```

应该显示类似：
```
API URL: http://localhost:8045/v1/messages
API Key: sk-c103bdb0eae4480aacb2198e69ddfe4a
Model: claude-opus-4-5-thinking
```

---

### 第四步：正常使用Claude Code！

**限额查看**：
- 在Antigravity Tools里查看各个模型的限额
- Google AI Ultra：5小时刷新一次，无周限额
- Google AI Pro：根据购买账号情况

**Have Fun！** 🎉

---

## 👥 团队共享方案

### 内网团队

**配置方式**：
1. 把API访问地址改成内网地址
2. 团队成员配置相同的API端点和密钥
3. 不需要下载Google Antigravity和Antigravity Tools

### 公网团队

**配置方式**：
1. 给API做内网穿透，让它拥有公网地址
2. 团队成员只需修改API地址即可
3. 如果团队较大，建议多买几个Google AI账号

**团队配置示例**：
```json
{
  "apiUrl": "http://your-team-server:8045/v1/messages",
  "apiKey": "sk-c103bdb0eae4480aacb2198e69ddfe4a"
}
```

---

## 🔍 常见问题

### Q1: 搜索能力怎么办？

**答案**：
- 使用其他MCP提供搜索能力
- 推荐配置：context7（写代码已足够）
- 不配置搜索也能正常使用大部分编程功能

### Q2: 速度和官方API有区别吗？

**答案**：
- **没有区别**
- 使用的是官方Claude Code客户端
- API也是满血版Claude（Opus 4.5、Sonnet 4.5）
- 唯一区别是API来源不是Claude Code Max Plan

### Q3: 稳定吗？

**答案**：
- **非常稳定**
- 已测试一个多月，无封号
- Google AI Ultra套餐几乎从不封号
- 团队多人同时使用也无问题

### Q4: 合规性如何？

**答案**：
- 通过正常渠道付费购买Google AI套餐
- 使用官方Claude Code客户端
- 相当于通过不同渠道获取Claude API

---

## 📊 成本对比

| 方案 | 月成本 | 优点 | 缺点 |
|------|--------|------|------|
| **Claude Code Max Plan** | $200 | 官方支持 | 易封号 |
| **Google AI Ultra + 本方案** | ~¥100-200 | 稳定不封号 | 配置稍复杂 |
| **Google AI Pro + 本方案** | ~¥50-100 | 成本低 | 需要多个账号轮换 |

**结论**：本方案性价比更高，稳定性更好

---

## 🎯 适用场景

**推荐使用**：
- ✅ 个人开发者（担心封号）
- ✅ 小型团队（2-10人）
- ✅ 预算有限的开发者
- ✅ 需要长期稳定使用的用户

**不推荐使用**：
- ❌ 大型企业（建议直接购买企业版）
- ❌ 需要官方技术支持的用户
- ❌ 不愿意折腾配置的用户

---

## 📝 总结

**核心优势**：
1. ✅ **稳定**：使用一个月以上，无封号风险
2. ✅ **满血**：Claude Opus 4.5、Sonnet 4.5全部可用
3. ✅ **团队**：可共享给团队使用
4. ✅ **官方客户端**：Claude Code CLI和VS Extension都支持
5. ✅ **性价比**：比官方Max Plan更便宜

**关键点**：
- 通过Google AI Ultra套餐（几乎不封号）
- Antigravity Tools转换为API
- 官方Claude Code客户端完美支持

**风险提示**：
- 本方法仅供学习交流
- 请遵守相关服务条款
- 建议优先购买官方订阅

---

**参考文章**：刘小排 - 《不会封号的Claude Code使用方法！已稳定测试一个月，还能共享给团队。》
