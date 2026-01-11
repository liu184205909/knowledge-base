# API 配置指南

## 📋 目录
- [DeepSeek API](#deepseek-api)
- [豆包生图 API](#豆包生图-api)
- [飞书开放平台](#飞书开放平台)
- [其他常用 API](#其他常用-api)

---

## DeepSeek API

### 注册申请
1. 访问 https://platform.deepseek.com/
2. 注册并登录账号
3. 进入"API Keys"页面
4. 点击"Create API Key"
5. 复制保存（只显示一次）

### 在 n8n 中配置

#### 方式1：使用 AI Agent 节点（推荐）
```json
{
  "model": "deepseek-chat",
  "credentials": {
    "name": "DeepSeek API",
    "apiKey": "sk-xxxxxxxxxxxxxxxx"
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

#### 方式2：使用 HTTP Request 节点
```json
{
  "method": "POST",
  "url": "https://api.deepseek.com/v1/chat/completions",
  "authentication": "headerAuth",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer sk-xxxxxxxxxxxxxxxx"
  },
  "body": {
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }
}
```

### 常用参数
```json
{
  "model": "deepseek-chat",  // 模型名称
  "temperature": 0.7,        // 0-2，越高越随机
  "max_tokens": 2000,        // 最大输出长度
  "top_p": 0.9,             // 核采样
  "stream": false           // 是否流式输出
}
```

### 计费说明
- 按实际使用的 tokens 计费
- 输入：¥1/百万 tokens
- 输出：¥2/百万 tokens
- 新用户有免费额度

---

## 豆包生图 API

### 注册申请
1. 访问 https://www.volcengine.com/
2. 注册并登录
3. 进入"火山引擎方舟"
4. 开通"豆包 4.0"服务
5. 创建 API Key

### 在 n8n 中配置

#### HTTP Request 节点配置
```json
{
  "method": "POST",
  "url": "https://ark.cn-beijing.volces.com/api/v3/image/generate",
  "authentication": "headerAuth",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-api-key"
  },
  "sendBody": true,
  "bodyParameters": {
    "prompt": "一只可爱的橘猫，动漫风格",
    "model": "doubao-v4-pro",
    "size": "1024x1024",
    "n": 1
  }
}
```

### 获取生成的图片
豆包 API 返回的是图片 URL，需要再次请求下载：

```json
{
  "method": "GET",
  "url": "={{ $json.image_url }}"
}
```

### 常用参数
```json
{
  "model": "doubao-v4-pro",    // 模型版本
  "prompt": "提示词",          // 图片描述
  "size": "1024x1024",        // 图片尺寸
  "n": 1,                     // 生成数量
  "style": "vivid"            // 风格：vivid/natural
}
```

### 支持的尺寸
- 1024x1024（标准）
- 1024x1792（竖版）
- 1792x1024（横版）
- 512x512（小图）

### 注意事项
⚠️ 提示词不要包含平台名称（小红书、抖音等）
⚠️ 避免敏感词汇
⚠️ 图片 URL 有效期1小时，及时保存

---

## 飞书开放平台

### 创建应用
1. 访问 https://open.feishu.cn/
2. 登录飞书账号
3. 点击"创建企业自建应用"
4. 填写应用信息
5. 记录 App ID 和 App Secret

### 开通权限
在"权限管理"中开通：

#### 多维表格权限
- `bitable:app` - 应用权限
- `bitable:app:readonly` - 只读权限
- `bitable:app:write` - 写入权限

#### 消息权限
- `im:message` - 发送消息
- `im:message:send_as_bot` - 机器人发送

#### 文件权限
- `drive:drive` - 云文件权限
- `drive:drive:readonly` - 只读权限

### 在 n8n 中配置

#### 创建凭证
```json
{
  "credentialType": "feishuOAuth2Api",
  "clientId": "cli_xxxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxx",
  "tenantType": "self"
}
```

#### 获取 App Access Token
```json
{
  "method": "POST",
  "url": "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
  "body": {
    "app_id": "cli_xxxxxxxxxxxxx",
    "app_secret": "xxxxxxxxxxxxxxxxxx"
  }
}
```

#### 写入多维表格
```json
{
  "method": "POST",
  "url": "https://open.feishu.cn/open-apis/bitable/v1/apps/app_xxx/tables/tbl_xxx/records",
  "authentication": "feishuOAuth2Api",
  "body": {
    "fields": {
      "主题": "={{ $json.topic }}",
      "标题": "={{ $json.title }}",
      "正文": "={{ $json.content }}",
      "图片": [{{ $json.image_url }}]
    }
  }
}
```

### 获取多维表格信息
1. 打开多维表格
2. 右键点击表格名称
3. 选择"查看表格详情"
4. 复制 `app_token` 和 `table_id`

---

## 即梦 AI API

### 注册申请
1. 访问 https://jimeng.jianying.com/
2. 注册并登录
3. 进入开发者中心
4. 创建应用获取 API Key

### 在 n8n 中配置
```json
{
  "method": "POST",
  "url": "https://api.jimeng.jianying.com/v1/image/generate",
  "headers": {
    "Authorization": "Bearer your-api-key",
    "Content-Type": "application/json"
  },
  "body": {
    "prompt": "提示词",
    "size": "1024x1024",
    "style": "anime"
  }
}
```

---

## Sora API

### 注册申请
1. 访问 OpenAI 官网
2. 开通 Sora 访问权限
3. 获取 API Key

### 在 n8n 中配置
```json
{
  "method": "POST",
  "url": "https://api.openai.com/v1/videos/generations",
  "headers": {
    "Authorization": "Bearer sk-xxxxxxxxxxxxxxxx",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "sora-1.0",
    "prompt": "视频提示词",
    "duration": 5
  }
}
```

---

## Gmail API

### 开通步骤
1. 访问 https://console.cloud.google.com/
2. 创建新项目
3. 开启 Gmail API
4. 创建 OAuth 2.0 凭证
5. 下载客户端密钥文件

### 在 n8n 中配置
1. 上传客户端密钥文件
2. 授权 n8n 访问 Gmail
3. 使用 Gmail 发送节点

---

## 微信公众号 API

### 开通步骤
1. 注册微信公众号
2. 获取 AppID 和 AppSecret
3. 开发者配置
4. 服务器地址配置

### 获取 Access Token
```json
{
  "method": "GET",
  "url": "https://api.weixin.qq.com/cgi-bin/token",
  "queryParameters": {
    "grant_type": "client_credential",
    "appid": "your-appid",
    "secret": "your-secret"
  }
}
```

### 发送模板消息
```json
{
  "method": "POST",
  "url": "https://api.weixin.qq.com/cgi-bin/message/template/send",
  "queryParameters": {
    "access_token": "={{ $json.access_token }}"
  },
  "body": {
    "touser": "openid",
    "template_id": "template-id",
    "data": {
      "first": {
        "value": "通知内容"
      }
    }
  }
}
```

---

## 通用 API 配置技巧

### 1. Header Auth（最常用）
适用于大多数 API：
```json
{
  "name": "Authorization",
  "value": "Bearer your-api-key"
}
```

### 2. Query Auth
用于 API Key 在 URL 中：
```json
{
  "name": "api_key",
  "value": "your-api-key"
}
```

### 3. OAuth 2.0
用于需要授权的 API：
```json
{
  "clientId": "client-id",
  "clientSecret": "client-secret",
  "authUrl": "https://api.com/auth",
  "tokenUrl": "https://api.com/token"
}
```

---

## 错误处理

### 常见错误码
- 400: 参数错误
- 401: 认证失败
- 403: 权限不足
- 429: 请求过快
- 500: 服务器错误

### 处理策略
```javascript
// 在 Code 节点中处理错误
if ($json.error) {
  const error = $json.error;

  // 记录错误
  console.error('API Error:', error);

  // 重试逻辑
  if (error.code === 429) {
    // 等待后重试
    return {
      json: {
        retry: true,
        waitTime: 60000
      }
    };
  }

  throw new Error(error.message);
}
```

---

## 调试技巧

### 1. 使用 API 测试工具
- Postman
- cURL
- 在线 API 文档

### 2. 查看原始响应
在 n8n 中添加 No-Op 节点查看完整响应：
```
HTTP Request → No-Op
```

### 3. 添加日志
```javascript
// 在 Code 节点中记录
console.log('Request:', JSON.stringify($input.all(), null, 2));
console.log('Response:', JSON.stringify($json, null, 2));
```

---

## 安全最佳实践

### 1. 不要硬编码 API Key
```javascript
// ❌ 错误
const apiKey = "sk-123456";

// ✅ 正确
const apiKey = $env.DEEPSEEK_API_KEY;
```

### 2. 使用环境变量
在 docker-compose.yml 中配置：
```yaml
environment:
  - DEEPSEEK_API_KEY=sk-xxxxxxxx
  - DOUBAO_API_KEY=xxxxxxxx
```

### 3. 定期轮换密钥
- 每30-90天更换一次
- 使用不同的开发/生产密钥
- 立即撤销泄露的密钥

---

## 成本优化

### 1. 选择合适的模型
- 简单任务用小模型
- 复杂任务用大模型
- 批量任务用批量接口

### 2. 缓存结果
```javascript
// 使用飞书表格作为缓存
const cacheKey = generateKey(input);
const cached = await lookupCache(cacheKey);

if (cached) {
  return cached; // 避免重复调用
}
```

### 3. 控制请求频率
```javascript
// 使用 Wait 节点控制
// 设置请求间隔为 1 秒
Wait time: 1000ms
```

---

## 参考资料

- DeepSeek 文档: https://platform.deepseek.com/docs
- 豆包文档: https://www.volcengine.com/docs
- 飞书开放平台: https://open.feishu.cn/document
- n8n API 文档: https://docs.n8n.io/integrations/creating-nodes/

---

> **提示**: 本文档将持续更新，如有问题请在社区反馈。

> **安全提醒**: API Key 是敏感信息，请妥善保管，不要分享给他人或提交到公开仓库。
