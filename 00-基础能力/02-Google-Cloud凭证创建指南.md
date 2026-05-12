# Google Cloud 凭证配置参考

> Google Workspace MCP 前置配置 | 最后更新: 2026-05

---

## 第一步：创建 Google Cloud 项目

1. 访问 [console.cloud.google.com](https://console.cloud.google.com)，登录 Google 账号
2. 左上角项目选择器 → **新建项目** → 填项目名（如 `seo-tools`）→ **创建**
3. 再次点击项目选择器 → **选中刚创建的项目**

---

## 第二步：启用 API

☰ → **API 和服务** → **库**，逐个搜索并启用：

| 搜索关键词 | 用途 |
|-----------|------|
| `Google Drive API` | 硬盘文件读写 |
| `Google Sheets API` | 表格读写 |
| `Google Docs API` | 文档读写 |
| `Gmail API` | 邮件搜索/发送 |

可选：`Google Search Console API`、`Google Analytics Data API`

---

## 第三步：配置 OAuth 同意屏幕

☰ → **API 和服务** → **OAuth 同意屏幕**

1. 应用名称填 `SEO Tools`，用户支持邮箱选你的 Gmail → **下一步**
2. 保持测试模式 → **下一步**
3. 联系邮箱填你的 Gmail → **下一步** → **创建**
4. 左侧 **目标对象** → 测试用户 → **+ 添加用户** → 输入你的 Gmail → **添加**

> 测试模式下只有添加的用户才能授权。建议后续发布为 **Production** 模式（见 Token 刷新方案章节）。

---

## 第四步：创建 OAuth 客户端

☰ → **API 和服务** → **凭据** → **+ 创建凭据** → **OAuth 客户端 ID**

1. 应用类型选 **Web 应用**（不是桌面应用）
2. 名称填 `seo-tools-client`
3. 已获授权的重定向 URI：添加 `http://localhost:8000/oauth2callback`
4. 已获授权的 JavaScript 来源：添加 `http://localhost:8000`
5. 点击 **创建**
6. 弹窗中点击 **下载 JSON** → 保存到 `C:\Users\你的用户名\.claude\gsc-oauth.json`

> **为什么必须选 Web 应用？** workspace-mcp 的回调地址是 `http://localhost:8000/oauth2callback`，桌面应用不支持自定义 redirect path，会导致 `redirect_uri_mismatch`。

---

## 第五步：环境变量

```powershell
# 必须
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "JSON中的client_id", "User")
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_SECRET", "JSON中的client_secret", "User")
[System.Environment]::SetEnvironmentVariable("OAUTHLIB_INSECURE_TRANSPORT", "1", "User")

# GSC 可选
[System.Environment]::SetEnvironmentVariable("GSC_AUTH_MODE", "oauth", "User")
[System.Environment]::SetEnvironmentVariable("GSC_OAUTH_SECRETS_FILE", "C:\Users\$env:USERNAME\.claude\gsc-oauth.json", "User")
[System.Environment]::SetEnvironmentVariable("GSC_SITE_URL", "sc-domain:luckycrystals.org", "User")
```

> 设置后必须重启 VSCode。验证：`[System.Environment]::GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "User")`

---

## MCP 安装

```bash
# Google Workspace（必须）— 含代理环境变量（大陆用户）
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier core

# GSC（可选）
claude mcp add -s user gsc -- npx -y gsc-mcp-server
```

---

## 代理补丁（中国大陆必须）

**问题**：`httplib2` 不读 `HTTPS_PROXY` 环境变量 → Google API 调用超时。

### 定位 MCP 安装目录

```powershell
Get-ChildItem "C:\Users\$env:USERNAME\AppData\Local\uv\cache\archive-v0" -Directory | ForEach-Object { if (Test-Path "$($_.FullName)\Lib\site-packages\httplib2") { Write-Host $_.FullName } }
```

### 补丁 1：安装 PySocks

```powershell
pip install PySocks --target "上面路径\Lib\site-packages"
```

### 补丁 2：`core/server.py` — 在 `import os` 后添加

```python
# === Proxy patch ===
_PROXY_URL = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or "http://127.0.0.1:10808"
os.environ.setdefault("HTTPS_PROXY", _PROXY_URL)
os.environ.setdefault("HTTP_PROXY", _PROXY_URL)
os.environ.setdefault("https_proxy", _PROXY_URL)
os.environ.setdefault("http_proxy", _PROXY_URL)
# === End proxy patch ===
```

### 补丁 3：`googleapiclient/http.py` — 替换 `build_http()` 函数

```python
def build_http():
    if socket.getdefaulttimeout() is not None:
        http_timeout = socket.getdefaulttimeout()
    else:
        http_timeout = DEFAULT_HTTP_TIMEOUT_SEC

    # === Proxy patch ===
    proxy_info = None
    _proxy_url = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy")
    if _proxy_url:
        from urllib.parse import urlparse as _urlparse
        try:
            _parsed = _urlparse(_proxy_url)
            import socks
            proxy_info = httplib2.ProxyInfo(
                proxy_type=socks.PROXY_TYPE_HTTP,
                proxy_host=_parsed.hostname or "127.0.0.1",
                proxy_port=_parsed.port or 10808,
            )
        except Exception:
            pass
    # === End proxy patch ===

    http = httplib2.Http(timeout=http_timeout, proxy_info=proxy_info)
    try:
        http.redirect_codes = http.redirect_codes - {308}
    except AttributeError:
        pass
    return http
```

**注意事项**：`uvx` 更新 workspace-mcp 后补丁会失效，需重新执行补丁 2 和 3。

---

## Token 刷新方案

### 问题链路

```
access_token 过期（1小时）→ MCP 刷新 → 请求 Google → 没走代理 → 失败 → 要求重新授权
```

### 凭证文件

```
~/.google_workspace_mcp/credentials/<邮箱>.json
```

### 一键刷新脚本

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py
```

脚本自动：扫描凭证目录 → 通过代理（`127.0.0.1:10808`）刷新 → 更新凭证文件。

### 标准工作流

```
写入 Google 前先运行 refresh_google_token.py → 再调用 MCP → Token 有效期 1 小时
```

### OAuth 发布模式

| 模式 | Refresh Token 有效期 |
|------|---------------------|
| Testing（默认） | 7 天，需定期浏览器重新授权 |
| **Production（推荐）** | 永久（6 个月不用才失效） |

发布路径：Google Cloud Console → APIs & Services → OAuth consent screen → **PUBLISH APP**

---

## 故障排查

| 错误 | 原因 | 修复 |
|------|------|------|
| `redirect_uri_mismatch` | OAuth 客户端选了"桌面应用" | 删掉重建为 **Web 应用**，redirect URI 填 `http://localhost:8000/oauth2callback` |
| `The OAuth client was deleted` | 环境变量指向已删除的旧凭证 | 用 JSON 文件中的值同时更新环境变量和 MCP 配置 |
| MCP 与环境变量凭证不一致 | `claude mcp add -e` 和 PowerShell `SetEnvironmentVariable` 是两套独立配置 | 统一使用 JSON 文件中的值 |
| `WinError 10060` / `SSLEOFError` | 代理补丁未打 | 按上面"代理补丁"完整执行 |
| 反复弹出 OAuth 授权 | `user_google_email` 参数与已授权账号不一致 | 必须使用 `lzn184205909@gmail.com`（已授权账号） |
| "此应用未经验证"警告 | 正常 | 点"高级" → "前往（不安全）"继续 |
| Token 不到 1 小时就失效 | MCP 的 token 刷新没走代理 | 运行 `refresh_google_token.py` |

> **关键**：调用所有 Google Workspace MCP 工具时，`user_google_email` 必须用 `lzn184205909@gmail.com`。

---

## 服务账号方式（GSC/GA4 自动化）

| 对比 | OAuth | 服务账号 |
|------|-------|----------|
| 场景 | Claude Code 交互 | 服务器脚本、定时任务 |
| 授权 | 弹浏览器 | JSON 密钥自动认证 |

步骤：创建服务账号 → 下载 JSON 密钥（加入 `.gitignore`）→ GSC/GA4 添加服务账号邮箱权限

| 报错 | 解决 |
|------|------|
| 403 permission denied | 服务账号未加权限 |
| property not found | GA4 未授权或 ID 错误 |
| no matching site | GSC 资源类型不匹配（URL vs domain） |

**安全提醒**：不要公开 `service_account.json`、`client_secret.json`、`refresh_token`、`private_key`。

---

## 参考

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)
- [GSC MCP](https://github.com/drewbeechler/gsc-mcp-server)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2?hl=zh-cn)
