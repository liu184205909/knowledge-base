# CLIProxyAPI - 图片生成代理（后备方案）

> 本地代理服务，提供 OpenAI/Gemini/Claude 兼容 API，主要用于图片生成
> GitHub: https://github.com/router-for-me/CLIProxyAPI
> 最后更新: 2026-05-15

---

## 简介

CLIProxyAPI 是一个本地代理服务器，将 OpenAI Codex/Claude/Gemini 等 AI 服务封装为 OpenAI 兼容的 API 接口。在图片生成场景中作为**后备方案**使用，当主工具（如 Nano Banana、picset）不可用时可切换到此方案。

---

## 安装与启动

1. 从 GitHub Releases 下载对应平台的可执行文件
2. 运行后默认监听 `http://127.0.0.1:8317`
3. 配置文件位于 `~/.cli-proxy-api/config.yaml`

---

## 配置要点

### 1. API Key 配置

在 `~/.cli-proxy-api/config.yaml` 中设置 `api-keys`，客户端请求时需携带此 key：

```yaml
host: "127.0.0.1"
port: 8317
api-keys:
  - "sk-local-你的密钥"
```

### 2. Codex 接入配置

在 `~/.codex/config.toml` 中配置自定义 provider：

```toml
model = "gpt-5.5"
model_provider = "cliproxyapi"

[model_providers.cliproxyapi]
name = "CLIProxyAPI"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
env_key = "OPENAI_API_KEY"
```

**注意**：Codex 使用 `env_key`（指向环境变量名），而非直接写 `api_key`。

### 3. 设置环境变量

将 config.yaml 中的 api-keys 值设为系统环境变量：

**Windows（PowerShell）**：
```powershell
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-local-你的密钥", "User")
```

**macOS/Linux**：
```bash
export OPENAI_API_KEY="sk-local-你的密钥"
```

设置后需**打开新终端窗口**才能生效。

---

## 验证服务状态

```bash
# 检查服务是否运行
curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-local-你的密钥"

# 测试图片生成请求
curl http://127.0.0.1:8317/v1/images/generations \
  -H "Authorization: Bearer sk-local-你的密钥" \
  -H "Content-Type: application/json" \
  -d '{"model":"dall-e-3","prompt":"product photo of a crystal bracelet","n":1}'
```

---

## 注意事项

- 免费版 ChatGPT 账号可能有权限/配额限制，遇到 403 错误时需确认账号等级
- OAuth 凭证文件存储在 `~/.cli-proxy-api/` 目录下，包含 `chatgpt_plan_type` 字段标识账号等级
- 服务需保持运行状态，关机或关闭终端后代理不可用
