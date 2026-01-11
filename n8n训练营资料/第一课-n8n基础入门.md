# 第一课：n8n基础入门

## 📚 学习目标
- 掌握 n8n 基础概念和安装部署
- 了解 n8n 的核心价值和应用场景
- 搭建第一个 n8n 工作流

---

## 1. 什么是 n8n？

### 核心定义
- **开源工作流自动化工具**（140K+ GitHub stars）
- **低代码、可扩展、支持 AI 集成**
- 比起 Zapier 等工具更强、更灵活

### 为什么选择 n8n？
- ✅ 最强的 AI 调用能力
- ✅ 变现机会明确
- ✅ 低门槛快速上手
- ✅ 开源免费无锁定

---

## 2. 三种部署方式对比

### 方式1：n8n Cloud
**优点**: 开箱即用
**缺点**: 功能受限
**推荐度**: ⭐⭐☆☆☆

### 方式2：npm 安装
**优点**: 灵活性高
**缺点**: 需要技术基础
**推荐度**: ⭐⭐⭐☆☆

### 方式3：Docker 部署（推荐）
**优点**: 平衡易用性和灵活性
**缺点**: 需要了解 Docker
**推荐度**: ⭐⭐⭐⭐⭐

---

## 3. Docker 部署详细步骤

### 步骤1：安装 Docker

#### Windows
```bash
# 下载 Docker Desktop
https://www.docker.com/products/docker-desktop
```

#### macOS
```bash
# 下载 Docker Desktop for Mac
https://www.docker.com/products/docker-desktop
```

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 步骤2：创建 docker-compose.yml

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    restart: always
    ports:
      - 5678:5678
    environment:
      # 基础认证
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password

      # 访问配置
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http

      # 时区设置
      - GENERIC_TIMEZONE=Asia/Shanghai
      - TZ=Asia/Shanghai

    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
    driver: local
```

### 步骤3：启动 n8n

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f n8n

# 停止服务
docker-compose down
```

### 步骤4：访问 n8n

打开浏览器访问：http://localhost:5678

使用设置的账号密码登录（admin/your_password）

---

## 4. n8n 界面介绍

### 主要区域
- **左侧面板**: 节点库（所有可用节点）
- **中间画布**: 工作流编辑区
- **右侧面板**: 节点配置和参数设置

### 基本概念
- **节点（Node）**: 工作流的基本单元
- **连接（Connection）**: 节点之间的数据流
- **工作流（Workflow）**: 多个节点组成的自动化流程

---

## 5. 搭建第一个工作流

### 实战：Hello World 工作流

#### 节点1：Manual Trigger（手动触发）
1. 在左侧搜索 "Manual Trigger"
2. 拖拽到画布
3. 点击节点，无需配置

#### 节点2：Edit Fields（编辑字段）
1. 拖拽 "Edit Fields" 节点到画布
2. 连接 Manual Trigger → Edit Fields
3. 配置字段：
   - Field Name: `message`
   - Value: `Hello, n8n!`

#### 节点3：No-Op（仅查看结果）
1. 拖拽 "No-Op" 节点到画布
2. 连接 Edit Fields → No-Op

#### 执行工作流
1. 点击右上角 "Test workflow"
2. 点击 "Execute Workflow"
3. 查看 No-Op 节点的输出结果

---

## 6. 常用节点介绍

### 触发类节点
- **Manual Trigger**: 手动触发工作流
- **Webhook**: 通过 HTTP 请求触发
- **Schedule**: 定时触发
- **On Form Submission**: 表单提交触发

### 数据处理节点
- **Edit Fields**: 添加/编辑字段
- **Set**: 设置字段值
- **Code**: 执行自定义代码
- **Merge**: 合并多个数据源
- **Split**: 分割数组

### AI 相关节点
- **AI Agent**: AI 智能体节点
- **HTTP Request**: 调用任何 API
- **OpenAI**: GPT 模型集成
- **Anthropic**: Claude 模型集成

### 外部集成节点
- **飞书**: 多维表格、消息发送
- **微信**: 公众号、企业微信
- **Gmail**: 邮件发送

---

## 7. 数据流概念

### 数据传递方式
```
节点A → 输出数据 → 节点B → 处理数据 → 节点C → 输出结果
```

### 数据引用
- 使用 `{{ $json.fieldName }}` 引用上一个节点的数据
- 使用 `{{ $node.nodeName.json.fieldName }}` 引用特定节点的数据

### 示例
```javascript
// 引用上一个节点的 name 字段
{{ $json.name }}

// 引用特定节点的 age 字段
{{ $node['Edit Fields'].json.age }}
```

---

## 8. 环境变量配置

### 配置 Credentials（凭证）
1. 点击左侧 "Credentials"
2. 点击 "New Credential"
3. 选择凭证类型（如 Header Auth）
4. 填写凭证信息
5. 保存并在节点中引用

### 配置环境变量
在 docker-compose.yml 中添加：
```yaml
environment:
  - N8N_BASIC_AUTH_USER=admin
  - N8N_BASIC_AUTH_PASSWORD=secure_password
  - WEBHOOK_URL=https://your-domain.com
```

---

## 9. 调试技巧

### 查看节点输出
1. 点击节点
2. 右侧面板选择 "Output" 选项卡
3. 查看节点执行后的数据

### 测试单个节点
1. 选中节点
2. 点击 "Execute Node"
3. 仅执行当前节点

### 查看执行日志
1. 点击工作流右上角 "Executions"
2. 查看历史执行记录
3. 点击具体记录查看详细日志

---

## 10. 常见问题

### Q1: 端口被占用怎么办？
修改 docker-compose.yml 中的端口映射：
```yaml
ports:
  - 5679:5678  # 使用 5679 端口
```

### Q2: 忘记密码怎么办？
```bash
# 停止容器
docker-compose down

# 修改 docker-compose.yml 中的密码
# 重新启动
docker-compose up -d
```

### Q3: 数据存储在哪里？
Docker volume: `n8n_data`，包含：
- 工作流配置
- 凭证信息
- 执行历史

---

## 🎯 课后练习

### 练习1：简单数据流
创建一个工作流：
1. Manual Trigger
2. Edit Fields（添加 name 和 age 字段）
3. Code（计算出生年份）
4. No-Op（查看结果）

### 练习2：API 调用
创建一个工作流：
1. Manual Trigger
2. HTTP Request（调用 http://api.github.com/zen）
3. Set（提取返回的 quote）
4. No-Op（查看结果）

### 练习3：定时任务
创建一个工作流：
1. Schedule（每分钟执行一次）
2. Edit Fields（添加 timestamp）
3. No-Op（查看结果）

---

## 📝 下一课预告

**第二课：常见 n8n 自动化工作流案例**
- 批量生图工作流
- 批量生视频工作流
- 自动邮件日报工作流

---

> **学习目标检查点**:
> - [ ] 成功安装并运行 n8n
> - [ ] 理解节点、连接、工作流的概念
> - [ ] 能够创建简单的 Hello World 工作流
> - [ ] 了解常用节点类型和用途
> - [ ] 掌握数据引用的基本方法
