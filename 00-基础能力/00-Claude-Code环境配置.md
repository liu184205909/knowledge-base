# Claude Code 环境配置

> 换电脑恢复指南 | 最后更新: 2026-04-20

---

## 恢复步骤

### 唯一需要人工做的事：提供 API Key

向 Claude Code 发送：

```
请按照 00-基础能力/00-Claude-Code环境配置.md 中的模板，帮我完成环境初始化。
我的智谱 API Key 是：xxx
```

Claude Code 会自动完成以下所有操作：

| 操作 | 说明 |
|------|------|
| 检测并安装 Node.js、Git 等依赖 | 缺什么装什么 |
| 创建 `~/.claude/settings.json` | 使用下方模板，填入你的 Key |
| 创建 `~/.claude/CLAUDE.md` | 全局指令文件 |
| 安装 MCP（4 个） | zai-mcp-server、web-search-prime、web-reader、zread |
| 安装 Skills | 按 [01-Skill设计与管理](./01-Skill设计与管理.md) 自动安装 |
| 克隆知识库 | git clone knowledge-base |

---

## 配置模板

> 以下模板供 Claude Code 参考，**不需要手动操作**。

### settings.json 模板

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "language": "chinese",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Edit(*)", "Write(*)",
      "Bash(npm run *)", "Bash(git *)", "Bash(npx *)",
      "mcp__*", "Agent(*)"
    ],
    "deny": ["Read(.env)", "Read(./secrets/**)"]
  },
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "{{API_KEY}}",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.1",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5-turbo",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5-turbo",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "enabledPlugins": {
    "glm-plan-usage@zai-coding-plugins": true,
    "glm-plan-bug@zai-coding-plugins": true
  }
}
```

### CLAUDE.md 模板

```markdown
# 全局指令
- 始终使用中文回复
- 工作方式：Read → Edit → Write，优先编辑已有文件
- 禁止在项目目录下安装 Skills
- 提交信息使用中文，格式：`类型: 简述`
```

---

## 配置文件速查

| 文件 | 路径 | 说明 |
|------|------|------|
| settings.json | `~/.claude/settings.json` | API、权限、环境变量 |
| CLAUDE.md | `~/.claude/CLAUDE.md` | 全局指令 |
| Skills | `~/.claude/skills/` | 技能目录 |
| Commands | `~/.claude/commands/` | 自定义指令 |
| Agents | `~/.claude/agents/` | 自定义智能体 |

> Windows 下 `~` = `C:\Users\<用户名>\`

---

## 常用指令速查

| 指令 | 说明 | 场景 |
|------|------|------|
| `/compact` | 压缩上下文 | 50% context 时触发 |
| `/context` | 查看 token 用量 | 随时查看 |
| `/plan` | 规划模式 | 复杂任务先规划 |
| `/focus` | 只看最终结果 | 信任模型时 |
| `/rewind` | 回退状态 | 出错时 |
| `/resume` | 恢复会话 | 中断后继续 |

### 关键习惯

| 习惯 | 说明 |
|------|------|
| 50% 时手动 `/compact` | 提前压缩，保留更多关键信息 |
| 给 Claude 验证手段 | 后端→运行测试；前端→Chrome 控制 |
| 单文件单提交 | git 历史干净 |

---

## 参考资源

| 资源 | 链接 |
|------|------|
| claude-code-best-practice | [GitHub](https://github.com/shanraisshan/claude-code-best-practice) |
| 官方文档 | [code.claude.com/docs](https://code.claude.com/docs/en) |
| Skills 完整列表 | [01-Skill设计与管理](./01-Skill设计与管理.md) |
