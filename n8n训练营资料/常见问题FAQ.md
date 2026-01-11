# n8n 常见问题 FAQ

## 📋 目录
- [安装部署](#安装部署)
- [节点使用](#节点使用)
- [API 集成](#api-集成)
- [数据流转](#数据流转)
- [性能优化](#性能优化)
- [错误处理](#错误处理)
- [安全相关](#安全相关)

---

## 安装部署

### Q1: Docker 部署后无法访问？

**可能原因**:
1. 端口被占用
2. 防火墙阻止
3. 容器未正常启动

**解决方案**:
```bash
# 1. 检查容器状态
docker-compose ps

# 2. 查看日志
docker-compose logs n8n

# 3. 修改端口
# 在 docker-compose.yml 中修改
ports:
  - 5679:5678  # 使用其他端口

# 4. 重启服务
docker-compose restart
```

---

### Q2: 忘记管理员密码怎么办？

**解决方案**:
```bash
# 1. 停止容器
docker-compose down

# 2. 修改 docker-compose.yml
# 修改密码配置
environment:
  - N8N_BASIC_AUTH_PASSWORD=new_password

# 3. 重新启动
docker-compose up -d
```

---

### Q3: 数据存储在哪里？如何备份？

**数据位置**:
- Docker volume: `n8n_data`
- 完整路径: `/var/lib/docker/volumes/n8n_data/_data`

**备份方法**:
```bash
# 1. 停止容器
docker-compose down

# 2. 备份数据
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n_backup.tar.gz /data

# 3. 恢复数据
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n_backup.tar.gz -C /
```

---

## 节点使用

### Q4: 如何在节点之间传递数据？

**方法1: 直接引用上一个节点**
```javascript
// 引用上一个节点的数据
{{ $json.fieldName }}
```

**方法2: 引用特定节点**
```javascript
// 引用特定节点的数据
{{ $node['Node Name'].json.fieldName }}
```

**方法3: 使用表达式**
```javascript
// 复杂表达式
{{ $json.firstName + ' ' + $json.lastName }}
```

---

### Q5: Code 节点如何处理数组？

**输入数据**:
```json
[
  {"name": "Alice", "age": 25},
  {"name": "Bob", "age": 30}
]
```

**Code 节点处理**:
```javascript
// 方法1: 处理所有项
return $input.all().map(item => ({
  json: {
    ...item.json,
   成年: item.json.age >= 18
  }
}));

// 方法2: 处理单个项
return {
  json: {
    ...$input.first().json,
   成年: $input.first().json.age >= 18
  }
};
```

---

### Q6: 如何循环处理列表？

**方法1: Loop 节点（推荐）**
```
Split in Batches → Loop → 处理节点
```

**方法2: Code 节点**
```javascript
// 分割数组为单个项
const items = $input.first().json.items;

return items.map(item => ({
  json: item
}));
```

---

### Q7: AI Agent 节点如何优化输出？

**优化提示词**:
```javascript
System Prompt:
你是一个专业的文案写作助手，擅长创作小红书风格的内容。

要求：
1. 标题要吸引人，使用表情符号
2. 正文要分段，每段不超过3行
3. 结尾要有互动话题
4. 添加相关话题标签

请按照以下格式输出：
---
标题：[标题]

正文：
[正文内容]

#标签1 #标签2 #标签3
---
```

---

## API 集成

### Q8: API 调用返回 401 错误？

**可能原因**:
1. API Key 错误
2. 认证方式不对
3. 密钥已过期

**解决方案**:
```json
// 1. 检查 API Key
// 确保复制完整，没有多余空格

// 2. 检查认证方式
// Header Auth
{
  "name": "Authorization",
  "value": "Bearer sk-xxxxxxxx"
}

// 3. 测试 API Key
curl -H "Authorization: Bearer sk-xxx" https://api.example.com/test
```

---

### Q9: 如何处理 API 限流？

**问题**: 频繁调用导致 429 错误

**解决方案**:
```javascript
// 方法1: 添加 Wait 节点
// 在 HTTP Request 后添加 Wait 节点
// 设置等待时间: 1000ms

// 方法2: 使用重试机制
// 在 HTTP Request 节点中设置
{
  "options": {
    "retry": {
      "maxAttempts": 3,
      "waitBetweenAttempts": 2000
    }
  }
}

// 方法3: 批量处理
// 使用 Split in Batches 节点
// 每批处理 5 个
```

---

### Q10: 飞书 API 返回 403 错误？

**可能原因**:
1. 权限未开通
2. 多维表格 ID 错误
3. 字段名称不匹配

**解决方案**:
```javascript
// 1. 检查权限
// 确保开通了 bitable:app:write 权限

// 2. 获取正确的 app_token 和 table_id
// 打开多维表格 → 右键表格 → 查看详情

// 3. 检查字段名称
// 字段名称必须完全匹配，区分大小写
```

---

## 数据流转

### Q11: 如何合并两个数据源？

**方法1: Merge 节点**
```
数据源1 ↘
        Merge → 输出
数据源2 ↗
```

**方法2: Code 节点**
```javascript
// 假设两个节点的输出已通过引用连接
const source1 = $node['Source1'].json;
const source2 = $node['Source2'].json;

return {
  json: {
    ...source1,
    ...source2
  }
};
```

---

### Q12: 如何条件分支？

**方法1: Switch 节点**
```
输入 → Switch → 分支1
             → 分支2
             → 分支3
```

**方法2: IF 节点**
```javascript
// 条件判断
{{ $json.age >= 18 }}  // true/false
```

**方法3: Code 节点**
```javascript
const age = $json.age;

if (age >= 18) {
  // 成年分支
  return {
    json: {
      ...$json,
      category: "成年"
    }
  };
} else {
  // 未成年分支
  return {
    json: {
      ...$json,
      category: "未成年"
    }
  };
}
```

---

## 性能优化

### Q13: 工作流执行太慢怎么办？

**优化方法**:

1. **减少不必要的节点**
```
❌ 错误：多个 Edit Fields
Edit Fields (field1) → Edit Fields (field2) → Edit Fields (field3)

✅ 正确：合并为一个节点
Edit Fields (field1, field2, field3)
```

2. **使用并行处理**
```
串行：A → B → C (耗时 3s)
并行：A ↘
      B → Merge (耗时 1s)
      C ↗
```

3. **批量处理**
```
❌ 逐个处理：100次 API 调用
✅ 批量处理：1次调用处理100个
```

4. **缓存结果**
```javascript
// 检查缓存
const cacheKey = $json.id;
const cached = await checkCache(cacheKey);

if (cached) {
  return cached; // 直接返回缓存
}

// 处理数据
const result = await process($json);

// 写入缓存
await setCache(cacheKey, result);

return result;
```

---

### Q14: 内存占用过高？

**原因**:
1. 处理大量数据
2. 循环未正确终止
3. 数据未及时释放

**解决方案**:
```javascript
// 1. 分批处理
// 使用 Split in Batches 节点
{
  "batchSize": 100  // 每批处理100条
}

// 2. 及时释放数据
// 只保留必要字段
return {
  json: {
    id: $json.id,
    name: $json.name
    // 不需要的字段不要传递
  }
};

// 3. 使用流式处理
// 对于超大文件，使用 Stream 模式
```

---

## 错误处理

### Q15: 工作流执行失败如何排查？

**排查步骤**:

1. **查看执行日志**
```
右上角 Executions → 选择失败的执行 → 查看每个节点状态
```

2. **查看节点输出**
```
点击失败的节点 → Output 选项卡 → 查看错误信息
```

3. **添加调试节点**
```
在可能失败的位置插入 No-Op 节点
查看中间数据
```

4. **测试单个节点**
```
右键节点 → Execute Node
单独测试该节点
```

---

### Q16: 如何处理 API 异常？

**方法1: Error Trigger 节点**
```
工作流 → Error Trigger → 发送通知
```

**方法2: Try-Catch 模式**
```javascript
// 在 Code 节点中
try {
  // 可能失败的代码
  const result = await riskyOperation();
  return { json: result };
} catch (error) {
  // 错误处理
  console.error('Error:', error);
  return {
    json: {
      error: true,
      message: error.message
    }
  };
}
```

**方法3: 重试机制**
```json
// 在 HTTP Request 节点中
{
  "options": {
    "retry": {
      "maxAttempts": 3,
      "waitBetweenAttempts": 1000,
      "retryOn": ["5xx", "429"]
    }
  }
}
```

---

## 安全相关

### Q17: 如何保护 API Key？

**最佳实践**:

1. **使用 Credentials**
```
Settings → Credentials → New Credential
存储敏感信息，不要硬编码
```

2. **环境变量**
```yaml
# docker-compose.yml
environment:
  - API_KEY=sk-xxxxxxxx
```

3. **不要提交到 Git**
```gitignore
# .gitignore
.env
credentials.json
```

---

### Q18: Webhook 如何防止滥用？

**防护措施**:

1. **验证请求来源**
```javascript
// 验证签名
const signature = $headers['x-signature'];
const calculatedSignature = hmac($input.body, secret);

if (signature !== calculatedSignature) {
  throw new Error('Invalid signature');
}
```

2. **限制请求频率**
```javascript
// 使用数据库记录请求
const key = $json.clientId;
const count = await getRequestCount(key);

if (count > 100) {
  throw new Error('Rate limit exceeded');
}
```

3. **使用 Token**
```javascript
// 验证 Token
const token = $headers['authorization'];

if (token !== 'Bearer valid-token') {
  throw new Error('Unauthorized');
}
```

---

## 其他问题

### Q19: 如何定时执行工作流？

**方法1: Schedule 节点**
```yaml
# Cron 表达式
# 每天上午9点
0 9 * * *

# 每小时
0 * * * *

# 每5分钟
*/5 * * * *

# 每周一上午10点
0 10 * * 1
```

**方法2: Webhook + 外部定时器**
```
外部定时器 → Webhook → 工作流
```

---

### Q20: 如何导出/导入工作流？

**导出工作流**:
```
右上角 ... → Download
保存为 JSON 文件
```

**导入工作流**:
```
右上角 ... → Import from File
选择 JSON 文件
```

**分享工作流**:
```
1. 导出为 JSON
2. 移除敏感信息（API Key等）
3. 分享 JSON 文件
```

---

### Q21: 如何监控工作流状态？

**方法1: 内置 Executions**
```
Executions 页面查看所有历史执行
```

**方法2: 发送通知**
```
工作流结束 → 发送到飞书/微信/邮件
```

**方法3: 外部监控**
```javascript
// 写入监控系统
await fetch('https://monitoring.com/api/log', {
  method: 'POST',
  body: JSON.stringify({
    workflow: 'my-workflow',
    status: 'success',
    duration: $execution.duration
  })
});
```

---

## 获取帮助

### 官方资源
- **n8n 文档**: https://docs.n8n.io/
- **社区论坛**: https://community.n8n.io/
- **Discord**: https://discord.gg/n8n
- **GitHub**: https://github.com/n8n-io/n8n

### 中文社区
- **WaytoAGI**: https://waytoagi.feishu.cn/
- **微信群**: 搜索"n8n中文社区"

### 学习建议
1. 先看官方文档
2. 在社区搜索类似问题
3. 提问时附上工作流截图和错误信息
4. 分享你的解决方案帮助他人

---

> **提示**: 本文档会持续更新，如有新问题请在社区反馈。

> **最佳实践**: 遇到问题时，先查看执行日志，大多数错误都能通过日志信息快速定位。
