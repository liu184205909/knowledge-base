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

1. **应用类型**：选 **"桌面应用"**
2. **名称**：填 `seo-tools-client`
3. 点击 **"创建"**
4. 弹窗中点击 **"下载 JSON"** → 保存到 `C:\Users\你的用户名\.claude\gsc-oauth.json`
5. 点"确定"关闭弹窗

> `.claude` 文件夹不存在就手动创建：在 `C:\Users\你的用户名\` 下新建文件夹，命名 `.claude`

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
