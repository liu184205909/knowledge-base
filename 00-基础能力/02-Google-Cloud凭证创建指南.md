# Google Cloud 凭证配置参考

> Google Workspace MCP 前置配置 | 最后更新: 2026-05

---

## 快速参考

| 项 | 值 |
|---|---|
| 授权账号 | `lzn184205909@gmail.com` |
| OAuth 应用状态 | **Production**（已发布） |
| redirect URI | `http://localhost:8000/oauth2callback` |
| 凭证文件 | `~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json` |
| 代理 | `http://127.0.0.1:10808` |

> **关键**：所有 Google Workspace MCP 工具的 `user_google_email` 必须用 `lzn184205909@gmail.com`。

---

## 创建指南（首次配置）

### 第一步：创建 Google Cloud 项目

1. 访问 [console.cloud.google.com](https://console.cloud.google.com)，登录 Google 账号
2. 左上角项目选择器 → **新建项目** → 填项目名（如 `seo-tools`）→ **创建**
3. 再次点击项目选择器 → **选中刚创建的项目**

### 第二步：启用 API

☰ → **API 和服务** → **库**，逐个搜索并启用：

| 搜索关键词 | 用途 |
|-----------|------|
| `Google Drive API` | 硬盘文件读写 |
| `Google Sheets API` | 表格读写 |
| `Google Docs API` | 文档读写 |
| `Gmail API` | 邮件搜索/发送 |

可选：`Google Search Console API`、`Google Analytics Data API`

### 第三步：配置 OAuth 同意屏幕

☰ → **API 和服务** → **OAuth 同意屏幕**

1. 应用名称填 `SEO Tools`，用户支持邮箱选你的 Gmail → **下一步**
2. 选择 **External** → **下一步**
3. 联系邮箱填你的 Gmail → **下一步** → **创建**
4. **发布为 Production**（Production 模式下 refresh_token 永久有效，6 个月不用才失效）

发布路径：Google Cloud Console → APIs & Services → OAuth consent screen → **PUBLISH APP**

### 第四步：创建 OAuth 客户端

☰ → **API 和服务** → **凭据** → **+ 创建凭据** → **OAuth 客户端 ID**

1. 应用类型选 **Web 应用**（不是桌面应用）
2. 名称填 `seo-tools-client`
3. 已获授权的重定向 URI：`http://localhost:8000/oauth2callback`
4. 已获授权的 JavaScript 来源：`http://localhost:8000`
5. 点击 **创建** → 下载 JSON 保存

> **为什么必须选 Web 应用？** MCP 的回调地址是 `http://localhost:8000/oauth2callback`，桌面应用不支持自定义 redirect path。

### 第五步：环境变量

```powershell
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "JSON中的client_id", "User")
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_SECRET", "JSON中的client_secret", "User")
[System.Environment]::SetEnvironmentVariable("OAUTHLIB_INSECURE_TRANSPORT", "1", "User")
```

> 设置后必须重启 VSCode。

### 第六步：MCP 安装

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier core
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

## Token 管理

### 完整故障链路

```
access_token 过期（1小时）
  → MCP 尝试刷新 → 请求 Google → 没走代理 → 失败
  → MCP 要求重新授权 → 浏览器授权成功
  → MCP 交换 auth code → 也没走代理 → 凭证没保存
  → 死循环
```

### 三种修复方式（按场景选择）

#### 方式 1：刷新 Token（日常维护）

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py
```

当 access_token 过期但 refresh_token 仍有效时使用。通过代理刷新，1 分钟搞定。

#### 方式 2：完整重新授权（refresh_token 失效时）

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py --reauth
```

`--reauth` 流程：打开浏览器 → 用户授权 → 复制地址栏回调 URL 粘贴到终端 → 脚本通过代理交换 Token → 保存凭证。复用 MCP 的 redirect URI，无需改 Google Cloud Console。

#### 方式 3：绕过 MCP 直接用 curl（MCP 死活不认 Token 时）

当 MCP 内部 OAuth 状态和凭证文件不同步，外部写入的 Token 不被 MCP 识别时：

```bash
# 1. 生成授权 URL（用凭证文件中的 client_id）
# 2. 用户浏览器授权，复制回调 URL
# 3. 通过代理交换 Token
curl -s --proxy http://127.0.0.1:10808 -X POST "https://oauth2.googleapis.com/token" \
  --data-urlencode "client_id=你的ID" \
  --data-urlencode "client_secret=你的密钥" \
  --data-urlencode "code=授权码" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "redirect_uri=http://localhost:8000/oauth2callback"

# 4. 拿到 access_token 后直接调用 Google API
curl -s --proxy http://127.0.0.1:10808 \
  "https://sheets.googleapis.com/v4/spreadsheets/表格ID/values/Sheet1!A1:Z10" \
  -H "Authorization: Bearer 你的access_token"
```

> **核心原理**：MCP 的代理补丁只覆盖了 `googleapiclient` 的 API 调用，不覆盖 OAuth 库内部的 token 交换。所以只要涉及 OAuth 握手的环节都可能失败。用 curl + proxy 绕过是最可靠的。

### 标准工作流

```
每次会话开始 → python refresh_google_token.py → 调用 MCP（1小时内有效）
刷新失败（invalid_grant）→ python refresh_google_token.py --reauth
MCP 仍不认 Token → 方式 3：curl + proxy 直接调 API
```

---

## 故障排查

| 错误 | 原因 | 修复 |
|------|------|------|
| `redirect_uri_mismatch` | OAuth 客户端选了"桌面应用" | 删掉重建为 **Web 应用**，redirect URI 填 `http://localhost:8000/oauth2callback` |
| `The OAuth client was deleted` | 环境变量指向已删除的旧凭证 | 用 JSON 文件中的值同时更新环境变量和 MCP 配置 |
| MCP 与环境变量凭证不一致 | `claude mcp add -e` 和 PowerShell `SetEnvironmentVariable` 是两套独立配置 | 统一使用 JSON 文件中的值 |
| `WinError 10060` / `SSLEOFError` | 代理补丁未打 | 按上面"代理补丁"完整执行 |
| 反复弹出 OAuth 授权 | `user_google_email` 参数与已授权账号不一致 | 必须使用 `lzn184205909@gmail.com` |
| "此应用未经验证"警告 | 正常 | 点"高级" → "前往（不安全）"继续 |
| Token 不到 1 小时就失效 | MCP 的 token 刷新没走代理 | 运行 `refresh_google_token.py` |
| `invalid_grant` (Token expired or revoked) | refresh_token 被撤销/失效 | 运行 `refresh_google_token.py --reauth` |
| 浏览器授权成功但 MCP 仍要求重新授权 | MCP 内部 OAuth 状态管理不认外部写入的 Token | 用方式 3（curl + proxy）绕过 MCP |

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
