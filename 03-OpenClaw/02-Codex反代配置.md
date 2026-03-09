# Codex 反代配置指南

> **低价方案** - 每月仅需8元，OpenAI Team版Codex配额
> **来源**：蓝点网 | **最后更新**：2026-03-09

---

## 一、方案概述

### 1.1 核心优势

| 优势 | 说明 |
|------|------|
| **独立配额** | Team版每个人配额独立，互不影响 |
| **双倍计划** | 当前OpenAI有双倍计划，Codex额度翻倍 |
| **低成本** | 每月仅需8元，适合日常大量使用 |
| **适合场景** | OpenClaw、日常编程、自动化任务 |

### 1.2 适用人群

- OpenClaw用户 - 降低AI调用成本
- 独立开发者 - 日常编程辅助
- 自动化从业者 - 大量AI调用需求

---

## 二、购买注意事项

### 2.1 必知要点

| 事项 | 说明 | 原因 |
|------|------|------|
| **使用小号** | 用小号接受邀请 | 避免影响大号 |
| **确认售后** | 务必咨询"掉了能不能补" | 保障权益 |
| **禁止聊天** | 不要用Team版聊天 | 卖家被封会导致记录丢失 |

### 2.2 风险提示

```
⚠️ 注意事项：
1. 这是第三方拼车服务，存在一定风险
2. 仅用于Codex编程任务，不要用于ChatGPT聊天
3. 重要数据做好备份
4. 选择信誉好的卖家
```

---

## 三、配置步骤

### 3.1 备份现有配置

```bash
# 备份OpenClaw配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# 备份Claude Code配置（如有）
cp ~/.claude/config.json ~/.claude/config.json.bak
```

### 3.2 配置API端点

根据卖家提供的配置，修改API端点和密钥。

### 3.3 回滚操作（如出问题）

```bash
# 回滚OpenClaw配置
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json

# 回滚Claude Code配置
cp ~/.claude/config.json.bak ~/.claude/config.json
```

---

## 四、配额检查

### 4.1 检查方式

访问：https://chatgpt.com/codex/settings/usage

### 4.2 配额说明

| 项目 | 说明 |
|------|------|
| 快速模型 | 适合简单任务 |
| 慢速模型 | 适合复杂任务 |
| 双倍计划 | 当前额度x2 |

---

## 五、相关链接

- **详细教程**：https://www.landiannews.com/archives/111964.html
- **配额检查**：https://chatgpt.com/codex/settings/usage
- **蓝点网**：https://www.landiannews.com/
