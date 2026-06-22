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
| MCP 配置 | `~/.claude.json`（args）+ `~/.claude/settings.json`（env） |

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

### 第五步：安装 MCP

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier extended
```

将代理 env vars 同步加入 `~/.claude/settings.json` 的全局 `env`：

```json
{
  "env": {
    ...现有项...,
    "HTTPS_PROXY": "http://127.0.0.1:10808",
    "HTTP_PROXY": "http://127.0.0.1:10808",
    "ALL_PROXY": "http://127.0.0.1:10808"
  }
}
```

### 第六步：中国大陆代理补丁

`httplib2` 不读 `HTTPS_PROXY` 环境变量 → Google API 调用超时。需要打 3 个补丁：

1. **安装 PySocks**：找到 uvx 缓存目录（含 `Lib/site-packages/httplib2`），执行 `pip install PySocks --target "该目录/Lib/site-packages"`
2. **`core/server.py`**：在 `import os` 后添加代理 env vars 设置（`setdefault` 方式）
3. **`googleapiclient/http.py`**：在 `build_http()` 函数中添加 `proxy_info` 参数（用 `socks.PROXY_TYPE_HTTP`）

> **注意**：`uvx` 更新 workspace-mcp 后补丁会失效，需重新执行。详细补丁代码见 Git 历史或询问 AI。

### 第六步补遗：google-seo-mcp（Mario 版）同款补丁

Mario 版（google-seo-mcp）同样用 `googleapiclient + httplib2`，httplib2 不读 `HTTPS_PROXY` → GSC/GA4 API 调用 `WinError 10060` 直连超时（2026-06-22 实测）。注意它的 OAuth 登录/token 刷新走 `requests`（读 HTTPS_PROXY），所以登录能成功、卡在 API 调用那步。补丁：

```bash
# 1. 装 PySocks 到 Mario venv
pipx runpip google-seo-mcp install pysocks

# 2. patch build_http() 走代理
#    文件：C:\Users\Dylan\pipx\venvs\google-seo-mcp\Lib\site-packages\googleapiclient\http.py
#    找到 def build_http() 里的：
#        http = httplib2.Http(timeout=http_timeout)
#    改成：
#        http = httplib2.Http(
#            timeout=http_timeout,
#            proxy_info=httplib2.proxy_info_from_url("http://127.0.0.1:10808"),
#        )
# 3. 重启 Claude Code 让 Mario 进程重新加载补丁后的库
# 4. 验证：gsc_list_sites 返回站点列表（不再 WinError 10060）
```

> **注意**：`pipx upgrade google-seo-mcp` 会覆盖 googleapiclient、清掉补丁，需重打上面 2 步。补丁只影响 Mario venv，不影响系统其他 Python。

---

## Token 管理

### 标准工作流

```
每次会话开始 → python refresh_google_token.py → 调用 MCP（1小时内有效）
刷新失败（invalid_grant）→ python refresh_google_token.py --reauth
MCP 仍不认 Token → curl + proxy 直接调 API（见下方方式 3）
```

### 方式 1：刷新 Token（日常维护）

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py
```

### 方式 2：完整重新授权（refresh_token 失效时）

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py --reauth
```

`--reauth` 流程：打开浏览器 → 用户授权 → 复制地址栏回调 URL 粘贴到终端 → 脚本通过代理交换 Token → 保存凭证。

### 方式 3：绕过 MCP 直接用 curl

当 MCP 内部 OAuth 状态和凭证文件不同步时：

```bash
curl -s --proxy http://127.0.0.1:10808 \
  "https://sheets.googleapis.com/v4/spreadsheets/表格ID/values/Sheet1!A1:Z10" \
  -H "Authorization: Bearer $(python -c "import json,os; print(json.load(open(os.path.expanduser('~/.google_workspace_mcp/credentials/lzn184205909@gmail.com.json')))['token'])")"
```

---

## 故障排查

| 错误 | 原因 | 修复 |
|------|------|------|
| `redirect_uri_mismatch` | OAuth 客户端选了"桌面应用" | 重建为 **Web 应用** |
| `WinError 10060` | 代理补丁未打或 PySocks 未安装 | 按第六步执行补丁 |
| MCP 每次要求 OAuth 授权 | 凭证文件缺少 `scopes` 字段或格式错误（必须是列表不是字符串） | `refresh_google_token.py` 已自动补全 |
| Token 不到 1 小时就失效 | MCP 刷新没走代理 | 运行 `refresh_google_token.py` |
| `invalid_grant` | refresh_token 失效 | 运行 `refresh_google_token.py --reauth` |
| 代理 env vars 未生效 | VSCode 扩展未传递 MCP server 的 `env` 块 | 确认 `~/.claude/settings.json` 全局 env 中有代理设置 |

---

## 已知限制

1. **MCP 内部 OAuth 不走代理**：proxy 补丁只覆盖 `googleapiclient` 的 API 调用，不覆盖 OAuth 库内部 token 交换 → 所以每次会话必须外部刷新 Token
2. **uvx 更新清补丁**：workspace-mcp 更新后代理补丁和 PySocks 失效，需重新打
3. **VSCode 扩展 env 传递**：MCP server 的 `env` 块可能不被传递，代理 env vars 需同时放在 `~/.claude/settings.json` 全局 env 中

---

## 参考

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2?hl=zh-cn)
