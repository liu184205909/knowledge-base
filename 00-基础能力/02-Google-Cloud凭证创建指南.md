# Google Cloud 凭证创建指南

> Google Workspace MCP（表格/文档/硬盘/Gmail）前置配置 | GSC/GA4 可选扩展 | 最后更新: 2026-05-09

---

## 完成后产出

| 产出物 | 用途 |
|--------|------|
| Google Cloud 项目 | 承载所有 API 和凭据 |
| 4 个已启用的 API | Drive、Sheets、Docs、Gmail |
| OAuth 客户端 | Claude Code 访问 Google 数据的"钥匙" |

**所需时间**：15-20 分钟（一次性） | **前提**：一个 Google 账号

---

## 第一步：创建 Google Cloud 项目

1. 访问 [console.cloud.google.com](https://console.cloud.google.com)，登录 Google 账号
2. 点击左上角项目选择器 → **"新建项目"**
3. 填项目名（如 `seo-tools`）→ 点击 **"创建"**
4. 再次点击项目选择器，**选中刚创建的项目**

> 英文界面？右上角齿轮 → Language → 中文（简体）→ 刷新

---

## 第二步：启用 API

☰ → **"API 和服务"** → **"库"**，逐个搜索并启用：

**必须（Google Workspace MCP）：**

| 搜索关键词 | 用途 |
|-----------|------|
| `Google Drive API` | 硬盘文件读写 |
| `Google Sheets API` | 表格读写 |
| `Google Docs API` | 文档读写 |
| `Gmail API` | 邮件搜索/发送 |

**可选（GSC/GA4 自动化）：** `Google Search Console API`、`Google Analytics Data API`

验证：☰ → "API 和服务" → "已启用的 API 和服务"，至少看到上面 4 个。

---

## 第三步：配置 OAuth 同意屏幕

☰ → **"API 和服务"** → **"OAuth 同意屏幕"**（如果提示"尚未配置"，点"开始"）

1. **应用名称**：填 `SEO Tools`
2. **用户支持邮箱**：选你的 Gmail（已自动填好）
3. 点 **"下一步"** → 保持"测试模式" → **"下一步"**
4. **联系邮箱**：填你的 Gmail → **"下一步"**
5. 确认信息 → 点击 **"创建"**

**添加测试用户（必须）**：左侧菜单点"目标对象" → "测试用户" → "+ 添加用户" → 输入你的 Gmail → "添加"

> 测试模式下只有添加的用户才能授权，不需要发布到生产。

---

## 第四步：创建 OAuth 客户端

☰ → **"API 和服务"** → **"凭据"** → **"+ 创建凭据"** → **"OAuth 客户端 ID"**

1. **应用类型**：选 **"Web 应用"**（不是"桌面应用"）
2. **名称**：填 `seo-tools-client`
3. **已获授权的重定向 URI**：点击"添加 URI"，填入 `http://localhost:8000/oauth2callback`
4. **已获授权的 JavaScript 来源**：点击"添加"，填入 `http://localhost:8000`
5. 点击 **"创建"**
6. 弹窗中点击 **"下载 JSON"** → 保存到 `C:\Users\你的用户名\.claude\gsc-oauth.json`
7. 点"确定"关闭弹窗

> `.claude` 文件夹不存在就手动创建：在 `C:\Users\你的用户名\` 下新建文件夹，命名 `.claude`
>
> **为什么用 Web 应用而不是桌面应用？** workspace-mcp 的 OAuth 回调地址是 `http://localhost:8000/oauth2callback`（见 `auth/oauth_config.py`），桌面应用类型不支持自定义 redirect path，会导致 `redirect_uri_mismatch` 错误。

---

## 第五步：配置环境变量

打开 **PowerShell**（Win 键 → 输入 `powershell` → 点击打开）

### 5.1 Google Workspace MCP（必须）

打开下载的 JSON 文件，找到 `client_id` 和 `client_secret` 的值，替换下面命令：

```powershell
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "你的客户端ID", "User")
[System.Environment]::SetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_SECRET", "你的客户端密钥", "User")
[System.Environment]::SetEnvironmentVariable("OAUTHLIB_INSECURE_TRANSPORT", "1", "User")
```

### 5.2 GSC MCP（可选 — 网站上线后）

```powershell
[System.Environment]::SetEnvironmentVariable("GSC_AUTH_MODE", "oauth", "User")
[System.Environment]::SetEnvironmentVariable("GSC_OAUTH_SECRETS_FILE", "C:\Users\你的用户名\.claude\gsc-oauth.json", "User")
[System.Environment]::SetEnvironmentVariable("GSC_SITE_URL", "sc-domain:luckycrystals.org", "User")
```

### 5.3 验证

```powershell
[System.Environment]::GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "User")   # 应输出客户端 ID
[System.Environment]::GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_SECRET", "User") # 应输出客户端密钥
```

> 没有输出 = 设置失败，检查拼写后重试。

### 5.4 安装 uv

```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

关掉 PowerShell 重开，验证：`uvx --version`

### 5.5 重启 VSCode

环境变量写入后，**已打开的程序不会自动读取**，必须完全关闭并重新打开 VSCode。

> **macOS / Linux** 环境变量写入方式：
> ```bash
> echo 'export GOOGLE_OAUTH_CLIENT_ID="你的客户端ID"' >> ~/.zshrc
> echo 'export GOOGLE_OAUTH_CLIENT_SECRET="你的客户端密钥"' >> ~/.zshrc
> echo 'export OAUTHLIB_INSECURE_TRANSPORT="1"' >> ~/.zshrc
> source ~/.zshrc
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

---

## 第六步：安装 MCP 服务

### 6.1 Google Workspace MCP（必须）

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier core
```

首次使用时弹出浏览器进行 Google 授权，授权一次后自动缓存。

### 6.2 GSC MCP（可选）

```bash
claude mcp add -s user gsc -- npx -y gsc-mcp-server
```

---

## 第七步（中国大陆必须）：代理补丁

> **问题**：在中国大陆，Google 服务被 GFW 屏蔽。MCP 的 Python 进程（`httplib2`）不会自动走系统代理，导致连接超时（`WinError 10060`）。
>
> **症状**：MCP 安装成功，首次调用 Google 工具时报 `connection timeout` 或 `SSLEOFError`。
>
> **原理**：MCP 使用 `httplib2` 发起 Google API 请求，但 `httplib2` 不读取 `HTTPS_PROXY` 环境变量，需要手动注入代理配置。

### 7.1 前提

确保本地已有 HTTP 代理（如 V2RayN），默认地址 `http://127.0.0.1:10808`。验证：

```powershell
curl -x http://127.0.0.1:10808 -s -o NUL -w "%{http_code}" https://www.googleapis.com/
```

返回 `404` 或 `200` 即代理正常。

### 7.2 补丁步骤

找到 MCP 的安装目录（路径中的哈希值 `NiLXFnQ_-dRwqxzg` 因版本而异）：

```
C:\Users\你的用户名\AppData\Local\uv\cache\archive-v0\NiLXFnQ_-dRwqxzg\Lib\site-packages\
```

> 不确定具体目录？在 PowerShell 中运行：
> ```powershell
> Get-ChildItem "C:\Users\$env:USERNAME\AppData\Local\uv\cache\archive-v0" -Directory | ForEach-Object { if (Test-Path "$($_.FullName)\Lib\site-packages\httplib2") { Write-Host $_.FullName } }
> ```

#### 补丁 1：安装 PySocks

```powershell
pip install PySocks --target "上面找到的路径\Lib\site-packages"
```

#### 补丁 2：修改 `core/server.py`

文件：`...Lib\site-packages\core\server.py`

在 `import os` 那一行后面（其他 `import` 之前），加入：

```python
# === Proxy patch ===
_PROXY_URL = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or "http://127.0.0.1:10808"
os.environ.setdefault("HTTPS_PROXY", _PROXY_URL)
os.environ.setdefault("HTTP_PROXY", _PROXY_URL)
os.environ.setdefault("https_proxy", _PROXY_URL)
os.environ.setdefault("http_proxy", _PROXY_URL)
# === End proxy patch ===
```

> 作用：确保 `requests` 库（token 刷新）走代理。

#### 补丁 3：修改 `googleapiclient/http.py`

文件：`...Lib\site-packages\googleapiclient\http.py`

找到 `build_http()` 函数（约在 1933 行），将函数替换为：

```python
def build_http():
    if socket.getdefaulttimeout() is not None:
        http_timeout = socket.getdefaulttimeout()
    else:
        http_timeout = DEFAULT_HTTP_TIMEOUT_SEC

    # === Proxy patch: read proxy from env vars for httplib2 ===
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

> 作用：让 `httplib2`（Google API 调用）通过代理连接 Google 服务器。

#### 补丁 4：MCP 配置加入代理环境变量

```bash
claude mcp add -s user google-workspace \
  -e GOOGLE_OAUTH_CLIENT_ID=你的客户端ID \
  -e GOOGLE_OAUTH_CLIENT_SECRET=你的客户端密钥 \
  -e OAUTHLIB_INSECURE_TRANSPORT=1 \
  -e HTTPS_PROXY=http://127.0.0.1:10808 \
  -e HTTP_PROXY=http://127.0.0.1:10808 \
  -- uvx workspace-mcp --tools drive sheets docs gmail --tool-tier core
```

> 如果代理端口不是 10808，改成你的实际端口。

### 7.3 重启验证

1. 完全关闭并重新打开 VSCode
2. 在 Claude Code 中测试：`搜索我的 Google Sheets`
3. 如果返回表格列表，说明补丁成功

### 7.4 首次授权（大陆用户必看）

> 代理补丁只解决了 API 调用和 token 自动刷新的问题。**首次 OAuth 授权**（MCP 弹出浏览器让你点"允许"）仍然会失败，因为 OAuth 回调服务器的 token 交换代码没有被补丁覆盖。

**解决方法**：让 Claude Code 用 curl 通过代理手动完成授权。操作步骤：

1. 当 MCP 弹出授权链接时，告诉 Claude Code "授权失败了"
2. Claude Code 会用 `curl -x http://127.0.0.1:10808` 通过代理完成 token 交换
3. 授权成功后，后续使用由代理补丁自动处理，**不需要再手动授权**

> 此操作只需一次。只要 refresh_token 不失效（6 个月不用才会失效），就永远不需要再次授权。

### 7.5 注意事项

- **MCP 更新后补丁会失效**：`uvx` 更新 `workspace-mcp` 包时会覆盖补丁文件，需要重新执行补丁 2 和补丁 3
- **代理地址变更时**：修改 `core/server.py` 中的 `127.0.0.1:10808` 为新地址，并重新执行补丁 4
- **海外用户不需要此补丁**

---

## 验证清单

| # | 检查项 | 验证方式 |
|---|--------|---------|
| 1 | 项目已创建 | 控制台左上角显示项目名 |
| 2 | API 已启用 | ☰ → API和服务 → 已启用的API，有 Drive/Sheets/Docs/Gmail |
| 3 | OAuth 同意屏幕 | 状态为"测试中"，测试用户已添加 |
| 4 | OAuth 客户端 | 凭据页面能看到桌面应用类型的客户端 |
| 5 | 环境变量 | PowerShell `GetEnvironmentVariable` 有输出 |
| 6 | uv 已安装 | `uvx --version` 有版本号 |
| 7 | MCP 已安装 | `claude mcp list` 能看到 `google-workspace` |
| 8 | 代理补丁（大陆） | 调用 Google 工具不报 timeout |

---

## 踩坑记录（AI 排障参考）

> 以下问题在 2026-05 实际部署中遇到，供 AI 排障时快速定位。

### 1. OAuth 客户端类型选错 → `redirect_uri_mismatch`

- **现象**：浏览器授权后回调报 `redirect_uri_mismatch`
- **原因**：OAuth 客户端类型选了"桌面应用"，桌面应用的 redirect URI 只支持 `http://localhost`（无路径），而 workspace-mcp 使用 `http://localhost:8000/oauth2callback`
- **修复**：删掉桌面应用类型的客户端，重新创建 **Web 应用** 类型，redirect URI 填 `http://localhost:8000/oauth2callback`

### 2. 系统环境变量残留已删除的旧凭证 → `The OAuth client was deleted`

- **现象**：MCP 报 `The OAuth client was deleted`，但 Google Cloud 控制台看不到这个客户端
- **原因**：系统环境变量 `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` 指向了一个已删除的旧 OAuth 客户端（可能是之前桌面应用类型创建的），与新下载的 JSON 文件中的凭证不一致
- **修复**：用下载的 JSON 文件中的 `client_id` 和 `client_secret` **同时更新**系统环境变量和 MCP 配置，确保两者一致
- **验证**：`[System.Environment]::GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID", "User")` 输出应与 JSON 文件中一致

### 3. MCP 配置与系统环境变量的凭证不一致

- **现象**：MCP 配置的凭证和系统环境变量指向不同的 OAuth 客户端
- **原因**：`claude mcp add` 的 `-e` 参数和 PowerShell `SetEnvironmentVariable` 是两套独立的配置，改了一边忘改另一边
- **修复**：两边都用 JSON 文件中的值，或者统一只通过 MCP 配置传入（`-e` 参数），不在系统环境变量中设置

### 4. 代理补丁未打 → `WinError 10060` / `SSLEOFError`

- **现象**：MCP 安装成功，但首次调用 Google 工具时报连接超时
- **原因**：第七步的三个代理补丁未执行（PySocks、server.py、http.py）
- **修复**：按第七步完整执行所有补丁，补丁打完后 MCP 内置的 OAuth 授权流程**可以正常完成**（不需要 curl 手动交换 token）

### 5. 首次 OAuth 授权流程说明（修正）

- 第七步 7.4 节说"首次 OAuth 授权仍然会失败，需要用 curl 手动完成"——这是**不准确的**
- **实际测试**：代理补丁（补丁 1-3）+ MCP 配置中传入代理环境变量（补丁 4）都正确配置后，MCP 内置的 OAuth 流程**可以自动完成**首次授权
- 正确流程：在 Claude Code 中调用任意 Google 工具 → MCP 自动弹出授权链接 → 在浏览器中打开并授权 → 浏览器回调到 `http://localhost:8000/oauth2callback` → MCP 自动完成 token 交换 → 授权成功

### 6. `user_google_email` 参数与已授权账号不匹配 → 反复触发授权

- **现象**：调用 Google 工具时不断弹出 OAuth 授权链接，即使之前已成功授权过
- **原因**：MCP 的 OAuth token 缓存按邮箱地址绑定。调用工具时传入的 `user_google_email` 参数必须与之前授权时登录的 Google 账号**完全一致**，否则 MCP 认为该邮箱未授权，重新触发 OAuth 流程
- **实际案例**：已授权账号为 `lzn184205909@gmail.com`，但 AI 使用了 `luckycrystals.org@gmail.com`（从配置文件读取的默认值）→ 触发授权失败；改为 `lzn184205909@gmail.com` → 直接成功，无需重新授权
- **修复**：
  1. 确认你在 OAuth 同意屏幕中添加的**测试用户邮箱**（第三步）
  2. 调用所有 Google Workspace MCP 工具时，`user_google_email` 参数必须使用该邮箱
  3. 如果 MCP 配置中有默认邮箱设置，确保与测试用户一致
- **预防**：在项目文档或 Claude Code 的 `CLAUDE.md` 中记录正确的 Google 邮箱，避免 AI 使用错误邮箱

---

## 常见问题

### Q: "此应用未经验证"警告
**A**: 正常。点击"高级" → "前往（不安全）"继续。应用是你自己创建的，没有安全风险。

### Q: OAuth 授权后仍无法访问
**A**: 检查 3 点：
1. OAuth 同意屏幕的测试用户包含你的 Gmail
2. `GSC_SITE_URL` 格式与 GSC 注册的资源一致
3. 网站已在 Search Console 验证所有权

### Q: `WinError 10060` 连接超时（中国大陆）
**A**: 需要打代理补丁，见第七步。

### Q: `SSLEOFError` 或 `SSL: UNEXPECTED_EOF_WHILE_READING`
**A**: 同上，代理未配置导致无法连接 Google 服务器。

### Q: MCP 更新后补丁失效
**A**: 重新执行第七步的补丁 2 和补丁 3。

### Q: Token 频繁过期（不足 1 小时就失效）

**A**: 这是中国大陆环境下的已知严重问题，**根本原因是 MCP 的 token 自动刷新机制没有走代理**。

#### 问题链路

```
access_token 过期（1小时）
    → MCP 尝试用 refresh_token 刷新
    → 请求 oauth2.googleapis.com/token
    → 没有走代理 → 连不上 Google → 刷新失败
    → MCP 报错要求重新授权
```

#### 凭证文件位置

```
~/.google_workspace_mcp/credentials/<你的邮箱>.json
```

文件内容包含 `token`（access_token，1小时有效）、`refresh_token`（长期有效）和 `expiry`（过期时间）。

#### 修复方案：一键刷新脚本

已部署脚本到 `C:\Users\Dylan\tools\refresh_google_token.py`，当 MCP 报授权错误时运行：

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py
```

脚本会自动：扫描凭证目录 → 通过本地代理刷新 → 更新凭证文件。刷新后 MCP 立即恢复，无需重新在浏览器中授权。

#### 推荐工作流：写入前自动刷新 Token

在实际使用中，建议在每次需要写入 Google 表格/文档前，先运行刷新脚本：

```powershell
python C:\Users\Dylan\tools\refresh_google_token.py
```

**Claude Code 中的标准流程**：

```
1. 先运行 refresh_google_token.py 刷新 token
2. 然后再调用 Google Workspace MCP 写入数据
3. Token 有效期 1 小时，长会话中可能需要多次刷新
```

> 这个脚本通过本地代理（`127.0.0.1:10808`）调用 Google OAuth2 刷新端点，解决了 MCP 自身刷新机制不走代理的问题。

#### 关于 OAuth 应用发布模式

| 模式 | Refresh Token 有效期 | 说明 |
|------|---------------------|------|
| Testing（默认） | **7 天** | 每 7 天需要重新在浏览器授权一次 |
| Production（推荐） | **永久** | 除非手动撤销或 6 个月不使用 |

建议在 Google Cloud Console → OAuth consent screen 中将应用发布为 **Production** 模式：
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → OAuth consent screen
3. 找到 Publishing status，点击 **PUBLISH APP**
4. 确认发布（忽略"未验证"警告，个人使用不受影响）

发布后 refresh_token 不会过期，只需运行上面的刷新脚本就能恢复 access_token，不需要反复在浏览器中授权。

---

## 后续：GSC + GA4 自动化（服务账号方式）

> 适用场景：服务器脚本、定时任务、无人值守 | 前提：第一~二步已完成

| 对比 | OAuth（前文） | 服务账号（本节） |
|------|-------------|----------------|
| 场景 | Claude Code 交互 | 服务器脚本、定时任务 |
| 授权 | 弹浏览器 | JSON 密钥自动认证 |
| 身份 | 你自己 | 机器人账号 |

### 1. 创建服务账号

☰ → "API 和服务" → "凭据" → "+ 创建凭据" → "服务账号" → 填名称 → "创建并继续" → "完成"

### 2. 下载密钥

点击服务账号名称 → "密钥"标签 → "添加密钥" → "创建新密钥" → JSON → 保存到项目目录，**加入 `.gitignore`**

### 3. 授权 GSC

Search Console → 设置 → 用户和权限 → "添加用户" → 输入服务账号邮箱 → 权限选"受限"或"完整"

### 4. 授权 GA4

Google Analytics → 管理 → 访问权限管理 → 添加用户 → 角色选"查看者"

### 5. 常见错误

| 报错 | 原因 | 解决 |
|------|------|------|
| 403 permission denied | 服务账号没加权限 | 回到第 3/4 步 |
| property not found | GA4 未授权或 ID 错误 | 检查授权和 property ID |
| no matching site | GSC 资源类型不匹配 | URL资源 vs domain资源 |

### 安全提醒

不要公开：`service_account.json`、`client_secret.json`、`refresh_token`、`private_key`。

---

## 参考链接

| 资源 | 链接 |
|------|------|
| Google Cloud 控制台 | [console.cloud.google.com](https://console.cloud.google.com) |
| Google Workspace MCP | [github.com/taylorwilsdon/google_workspace_mcp](https://github.com/taylorwilsdon/google_workspace_mcp) |
| GSC MCP | [github.com/drewbeechler/gsc-mcp-server](https://github.com/drewbeechler/gsc-mcp-server) |
| Google OAuth 文档 | [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2?hl=zh-cn) |
