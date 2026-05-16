# CLIProxyAPI - 图片生成代理（后备方案）

> 本地代理服务，提供 OpenAI/Gemini/Claude 兼容 API，主要用于图片生成
> GitHub: https://github.com/router-for-me/CLIProxyAPI
> 最后更新: 2026-05-15

---

## 当前状态

| 项目 | 状态 |
|------|------|
| CLIProxyAPI 服务 | **已关闭**（免费账号不支持图片生成） |
| Codex 接入 | **已断开**（config.toml 中已注释） |
| 账号等级 | Free（升级 Plus/Pro 后可开启） |

**前置条件：ChatGPT 账号需为 Plus 或 Pro，免费版无图片生成权限（会返回 403）。**

---

## 简介

CLIProxyAPI 是一个本地代理服务器，将 OpenAI Codex/Claude/Gemini 等 AI 服务封装为 OpenAI 兼容的 API 接口。在日常工作中，当需要生成产品图等图片时，可通过此代理让 Codex 调用 OpenAI 的图片生成能力。

作为**后备方案**使用，主工具为 Nano Banana / picset。

---

## 关键文件位置

| 文件 | 路径 |
|------|------|
| CLIProxyAPI 配置 | `C:\Users\Dylan\.cli-proxy-api\config.yaml` |
| OAuth 认证凭证 | `C:\Users\Dylan\.cli-proxy-api\codex-lzn184205909@gmail.com-free.json` |
| Codex 接入配置 | `C:\Users\Dylan\.codex\config.toml` |
| 可执行文件 | `C:\Users\Dylan\AppData\Local\Temp\cliproxyapi-install-8de77ca6eed84e8d9cdfdbb0338ad377\cli-proxy-api.exe` |

---

## 开启/关闭操作

### 开启（升级 Plus/Pro 后）

1. **启动 CLIProxyAPI 服务**：双击 `cli-proxy-api.exe` 或在终端运行
2. **恢复 Codex 配置**：编辑 `~/.codex/config.toml`，取消注释并添加：

```toml
model = "gpt-5.5"
model_provider = "cliproxyapi"

[model_providers.cliproxyapi]
name = "CLIProxyAPI"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
env_key = "OPENAI_API_KEY"
```

3. **重启 Codex** 使配置生效

### 关闭（当前状态）

编辑 `~/.codex/config.toml`，注释掉 `model_provider` 和 `[model_providers.cliproxyapi]` 整段：

```toml
model = "gpt-5.5"
# model_provider = "cliproxyapi"

# [model_providers.cliproxyapi]
# name = "CLIProxyAPI"
# base_url = "http://127.0.0.1:8317/v1"
# wire_api = "responses"
# env_key = "OPENAI_API_KEY"
```

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

### 2. 环境变量

将 config.yaml 中的 api-keys 值设为系统环境变量：

**Windows（PowerShell）**：
```powershell
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-local-你的密钥", "User")
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

- **免费版 ChatGPT 账号无图片生成权限**，会返回 403 错误，需升级 Plus/Pro
- OAuth 凭证文件名中的 `free` 后缀标识账号等级（如 `xxx@gmail.com-free.json`）
- 服务需保持运行状态，关机或关闭终端后代理不可用
- 升级账号后需重新通过 CLIProxyAPI 的 OAuth 登录刷新凭证
