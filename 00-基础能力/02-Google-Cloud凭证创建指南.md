# Google Cloud 凭证创建指南

> 本文档面向 GSC MCP + GA4 API 的前置配置 | 中文界面操作步骤 | 最后更新: 2026-05-08

---

## 前置说明

完成本文档后你将获得：

| 产出物 | 用途 |
|--------|------|
| 一个 Google Cloud 项目 | 承载所有 API 和凭据 |
| 已启用的 3 个 API | Google Search Console API、Google Analytics Data API、Google Analytics Reporting API |
| OAuth 客户端 JSON 文件 | 给 GSC MCP 和后续 API 调用使用 |
| OAuth 同意屏幕配置 | 让 Google 允许你的应用访问数据 |

**所需时间**：约 15-20 分钟（一次性操作）

**前提条件**：一个 Google 账号（Gmail 即可）

---

## 第一步：打开 Google Cloud 控制台

1. 浏览器访问 [console.cloud.google.com](https://console.cloud.google.com)
2. 用你的 Google 账号登录
3. 界面左上角会看到 Google Cloud 的 logo

> 如果界面显示的是英文，点击右上角头像左边的 **齿轮图标** → **Language（语言）** → 选择 **中文（简体）** → 刷新页面。

---

## 第二步：创建项目

1. 点击页面 **左上角** 的项目选择器（显示当前项目名称或"选择一个项目"的位置）
2. 在弹出的窗口右上角，点击 **"新建项目"**
3. 填写：
   - **项目名称**：填一个你能认出来的名字，比如 `seo-tools` 或 `水晶站工具`
   - **组织/位置**：不用改，保持默认
4. 点击 **"创建"**
5. 等几秒，右上角会出现通知"已创建项目"
6. 再次点击左上角项目选择器，**选中刚创建的项目**（很重要，确保你正在操作的是新项目）

---

## 第三步：启用 3 个 API

> 这一步要让 Google 知道你的项目需要用哪些 API。每个 API 需要单独启用。

### 3.1 进入 API 库

1. 点击页面左上角的 **☰（三横线菜单）** 打开侧边栏
2. 找到并点击 **"API 和服务"** → **"库"**

> 如果侧边栏菜单太长，"API 和服务"通常在中间偏上的位置，图标是一个菱形。

### 3.2 启用 Google Search Console API

1. 在 **搜索 API 和服务** 框中输入：`Google Search Console API`
2. 点击搜索结果中的 **"Google Search Console API"**
3. 点击 **"启用"** 按钮
4. 页面会自动跳转到该 API 的概览页（表示已启用成功）

### 3.3 启用 Google Analytics Data API

1. 再次点击左上角 **☰** → **"API 和服务"** → **"库"**
2. 在搜索框输入：`Google Analytics Data API`
3. 点击搜索结果中的 **"Google Analytics Data API"**
4. 点击 **"启用"**

### 3.4 启用 Google Analytics Reporting API

1. 再次点击 **☰** → **"API 和服务"** → **"库"**
2. 在搜索框输入：`Google Analytics Reporting API`
3. 点击搜索结果中的 **"Google Analytics Reporting API"**
4. 点击 **"启用"**

### 验证已启用的 API

点击 **☰** → **"API 和服务"** → **"已启用的 API 和服务"**，你应该能看到这 3 个 API 列在其中。

---

## 第四步：配置 OAuth 同意屏幕（创建品牌信息）

> **你现在在哪**：你的页面标题应该显示 **"项目配置"**，左侧有 **"概览"** 被蓝色高亮选中，右侧内容区标题是 **"项目配置"**，下面有 **4 个步骤圆圈**（1 应用信息、2 受众群体、3 联系信息、4 完成）。如果你看到的是"尚未配置 Google Auth Platform"页面，先点中间的蓝色 **"开始"** 按钮就会来到这里。

> **为什么需要这步**：Google 要求任何通过 OAuth 访问数据的应用都必须有一个"品牌信息"——就是用户授权时看到的那个页面。你个人使用也需要配置它，否则无法创建 OAuth 凭据。

---

### 步骤 1/4：应用信息 ← 你现在在这里

页面右侧内容区，你会看到：

#### 字段①：应用名称（必填，有红色 * 号）

- **你在页面上看到**：一个输入框，标签写着"应用名称 *"，目前是**红色边框**，下面有红色提示"应用名称不能为空"
- **怎么填**：
  1. 用鼠标**点击**那个红色边框的输入框（光标会闪烁）
  2. 在输入框里**打字**输入：`SEO Tools`
- **命名规则**：
  - 这个名字是你自己给应用起的名字，**没有任何技术限制**
  - 可以用中文、英文、数字、空格、符号，长度 1-100 个字符都行
  - 只有你自己在授权时会看到这个名字，其他人看不到
  - 比如 `SEO Tools`、`我的SEO工具`、`水晶站后台` 都可以
  - **推荐填**：`SEO Tools`（简单好记就行）

#### 字段②：用户支持邮箱（必填，有红色 * 号）

- **你在页面上看到**：一个下拉框，标签写着"用户支持邮箱 *"，里面已经显示 `lzn184205909@gmail.com`
- **怎么填**：
  - 这个已经帮你**自动填好了**，**不用动它**
  - 如果你想确认一下，可以点下拉框看看，里面应该只有你的这一个邮箱
  - 如果有多个邮箱，选 `lzn184205909@gmail.com` 这一个

#### 然后点"下一步"

- 两个字段都填好后（应用名称不再显示红色错误），找到页面上那个 **蓝色边框的按钮"下一步"**
- 它在"用户支持邮箱"字段下面
- **用鼠标点击**"下一步"按钮

---

### 步骤 2/4：受众群体

点击"下一步"后，页面会刷新，你会看到：
- 步骤圆圈中"2 受众群体"变成蓝色（当前激活）
- 页面显示一个新表单

#### 字段①：应用模式

- **你会看到**：一个单选选项，有"生产模式"和"测试模式"两个选项
- **怎么选**：保持默认的 **"测试模式"** 不用改
- **为什么**：测试模式下只有你自己（和后面添加的测试用户）能使用，完全够用。生产模式需要 Google 审核，没必要。

#### 然后点"下一步"

- 点击页面底部的 **"下一步"** 按钮

---

### 步骤 3/4：联系信息

点击"下一步"后，页面会刷新到联系信息页。

#### 字段①：联系电子邮件地址（必填）

- **你会看到**：一个输入框，标签写着"联系电子邮件地址"或类似文字
- **怎么填**：
  1. 点击输入框
  2. 输入你的邮箱：`lzn184205909@gmail.com`
  - 如果有一个下拉框自动出现了你的邮箱，直接选它

#### 然后点"下一步"

- 点击页面底部的 **"下一步"** 按钮

---

### 步骤 4/4：完成

点击"下一步"后，页面会显示一个摘要/预览页面。

- **你会看到**：你刚才填的所有信息的汇总
- **怎么操作**：
  1. 快速扫一眼，确认信息没问题
  2. 找到页面底部的 **"创建"** 按钮（蓝色背景白色文字的大按钮）
  3. **点击"创建"**

> 点击"创建"后，页面可能会稍微加载一下，然后跳转到 Google Auth Platform 的信息中心页面。你会看到左侧菜单里"概览"下面多了几个选项（品牌塑造、目标对象、客户端、数据访问等）。
>
> 这时候状态会显示为 **"测试中"**，这是完全正常的。你的应用只有你自己用，不需要发布。

---

### 4-附加：添加测试用户（非常重要！）

> 因为你的应用处于"测试"状态，Google 只允许你添加的用户才能授权使用。必须把你自己的邮箱加进去，否则后面授权时会报错。

1. 在左侧导航菜单中，找到并 **点击"目标对象"**（图标是一个小人头）
2. 你会看到"测试用户"区域
3. 点击 **"+ 添加用户"** 按钮（或"添加用户"链接）
4. 弹出一个输入框，在里面输入：`lzn184205909@gmail.com`
5. 点击 **"添加"** 按钮
6. 你会看到你的邮箱出现在测试用户列表中
7. 页面可能会自动保存，也可能有一个 **"保存"** 按钮，如果有就点它

> 到这里，第四步全部完成。

---

## 第五步：创建 OAuth 客户端凭据

> **这步做什么**：创建一个"OAuth 客户端 ID"——相当于给你的工具（Claude Code）一把钥匙，让它能以你的身份访问 Google 数据。
> 第四步是告诉 Google"我这个应用叫什么名字"，第五步才是真正创建那把"钥匙"。

> **你现在应该在哪**：完成第四步后，你应该在 Google Auth Platform 的信息中心页面。

### 5.1 回到凭据页面

1. 点击页面 **左上角的 ☰（三横线菜单）**
2. 在弹出的侧边栏中找到 **"API 和服务"**，点击它
3. 在展开的子菜单中点击 **"凭据"**
4. 你会看到凭据页面，上面有 3 个空的表格区域：
   - "API 密钥" — 下面写着"没有要显示的 API 密钥"
   - "OAuth 2.0 客户端 ID" — 下面写着"没有要显示的 OAuth 客户端"
   - "服务账号" — 下面写着"没有要显示的服务账号"

### 5.2 点击"创建凭据"

1. 在页面顶部，标题 **"凭据"** 的右边，有一个蓝色按钮写着 **"+ 创建凭据"**
2. **点击这个按钮**（点按钮的文字或图标都可以）
3. 会弹出一个下拉菜单，里面有 3 个选项：
   ```
   API 密钥
   OAuth 客户端 ID    ← 你要选这个
   服务账号
   ```
4. **点击"OAuth 客户端 ID"**

> 如果点击后弹出提示说"需要先配置同意屏幕"，说明第四步没完成。回到第四步重来。

### 5.3 选择应用类型（关键步骤！）

点击"OAuth 客户端 ID"后，页面会跳转到一个新页面，标题是"创建 OAuth 客户端 ID"。

1. 页面上半部分有一个 **"应用类型"** 下拉菜单，目前显示的可能是一段说明文字
2. **点击这个下拉菜单**（点击后会展开一个选项列表）
3. 你会看到以下选项（从上到下）：

   ```
   Web 应用
   桌面应用              ← 选这个！
   电视和受限输入设备
   Android
   Chrome 应用
   iOS
   通用 Windows 平台 (UWP)
   其他
   ```

4. **点击"桌面应用"**

> **为什么选"桌面应用"**：因为 GSC MCP 是在你的电脑上本地运行的命令行工具，不是一个网站。选"桌面应用"才能生成正确的 JSON 文件格式。如果选了"Web 应用"，后面下载的文件格式会不对，GSC MCP 无法使用。

### 5.4 填写名称

1. 选择"桌面应用"后，下拉菜单下方会出现一个 **"名称"** 输入框
2. **点击输入框**，输入：`seo-tools-client`
3. 这个名字只是一个标识，方便你在凭据列表中认出它，**没有命名规则限制**，填什么都行
4. 下方可能还有一个"已授权的重定向 URI"的区域，**完全不用管它，不用填任何东西**

### 5.5 点击"创建"

1. 检查一下：应用类型选的是"桌面应用"，名称填了 `seo-tools-client`
2. 找到页面底部的蓝色按钮 **"创建"**
3. **点击"创建"**
4. 页面加载 2-3 秒

### 5.6 下载 JSON 文件（这一步最重要！）

点击"创建"后，会弹出一个窗口，标题是"OAuth 客户端已创建"。窗口里显示：

```
您的客户端 ID
123456789-xxxxx.apps.googleusercontent.com

您的客户端密钥
GOCSPX-xxxxxxxxxxxxxxxxx
```

> **这些信息不用记**，JSON 文件里都有。但你需要下载它。

**操作步骤：**

1. 在弹窗的 **右下角**，找到 **"下载 JSON"** 按钮
2. **点击"下载 JSON"**
3. 浏览器会下载一个文件，名字类似：`client_secret_123456789-xxxxx.apps.googleusercontent.com.json`
4. 下载完成后，点击弹窗右下角的 **"确定"** 关闭弹窗

### 5.7 把 JSON 文件放到正确位置

> 下载的文件默认在你的"下载"文件夹里，需要移动到 Claude Code 能找到的位置。

**操作步骤：**

1. 按 **Win + E** 打开文件资源管理器
2. 进入你的"下载"文件夹（通常在左侧栏或 `C:\Users\你的用户名\Downloads`）
3. 找到刚才下载的那个 `.json` 文件，名字很长，以 `client_secret_` 开头
4. **右键点击**这个文件 → **重命名** → 改名为 `gsc-oauth.json`
5. 现在，你需要把它移动到 `C:\Users\你的用户名\.claude\` 文件夹里：

   **先确认你的用户名：**
   - 按 Win 键，输入 `cmd`，回车打开命令提示符
   - 输入 `echo %USERNAME%` 然后回车
   - 屏幕上显示的就是你的用户名（比如 `Dylan`）

   **然后移动文件：**
   - 回到文件资源管理器
   - 在地址栏输入：`C:\Users\你的用户名\.claude\` 然后回车
     - 比如你的用户名是 Dylan，就输入 `C:\Users\Dylan\.claude\`
   - 如果提示"找不到文件夹"，说明 `.claude` 文件夹还没创建：
     - 在地址栏输入 `C:\Users\你的用户名\` 回车
     - 在空白处 **右键 → 新建 → 文件夹**
     - 文件夹名输入 `.claude`（注意前面有个点）
     - 按回车确认
   - 现在打开 `.claude` 文件夹
   - 把重命名后的 `gsc-oauth.json` 文件 **拖到** 这个文件夹里（或者右键复制 → 粘贴）

6. 最终文件的完整路径应该是：`C:\Users\你的用户名\.claude\gsc-oauth.json`

### 5.8 验证第五步是否成功

1. 回到浏览器，你应该在凭据页面
2. 看中间的 **"OAuth 2.0 客户端 ID"** 表格
3. 你应该能看到一行新记录：
   - 名称：`seo-tools-client`
   - 类型：`桌面应用`
   - 客户端 ID：一串 `xxxxx.apps.googleusercontent.com`
4. **看到这行记录，就说明第五步成功了**

---

## 第六步：配置环境变量

> **这步做什么**：告诉 Claude Code 你刚下载的 JSON 文件放在哪里，以及要查询哪个网站的数据。
> 环境变量就像是给程序设置的"配置信息"，设好一次以后就不用再管了。

> **你需要准备好的信息**（前面步骤已经完成的）：
> - JSON 文件的完整路径，比如 `C:\Users\Dylan\.claude\gsc-oauth.json`（第五步完成的）
> - 你的网站域名：`luckycrystals.org`

### 6.1 打开 PowerShell

1. 按键盘上的 **Win 键**（键盘左下角，有 Windows 图标的键）
2. 屏幕上出现搜索框后，**输入**：`powershell`
3. 在搜索结果中你会看到 **"Windows PowerShell"**（蓝色图标）
4. **点击它**打开
5. 你会看到一个蓝色背景的窗口，前面有 `PS` 字样

> **为什么用 PowerShell 而不用 CMD**：PowerShell 设置的环境变量是永久保存的，CMD 关闭就没了。我们用的是 PowerShell 的 `SetEnvironmentVariable` 方法，写入了系统注册表，重启也不会丢。

### 6.2 设置第一个环境变量

在 PowerShell 窗口中，**用鼠标选中下面的命令，右键复制**：

```
[System.Environment]::SetEnvironmentVariable("GSC_AUTH_MODE", "oauth", "User")
```

然后切换到 PowerShell 窗口，**在蓝色窗口里右键点击一下**（这会自动粘贴命令），然后 **按回车键**。

> **执行后会怎样**：没有任何输出。光标直接跳到下一行出现新的 `PS` 提示符。**没有输出就是成功了**，不用怀疑。

### 6.3 设置第二个环境变量（需要改路径！）

> 这条命令需要你把"你的用户名"替换成实际的用户名！

先确认你的用户名：在 PowerShell 里输入 `echo $env:USERNAME` 然后回车，屏幕会显示你的用户名。

然后复制下面的命令，**先在记事本里把"你的用户名"改成实际的**，再复制到 PowerShell 执行：

```
[System.Environment]::SetEnvironmentVariable("GSC_OAUTH_SECRETS_FILE", "C:\Users\你的用户名\.claude\gsc-oauth.json", "User")
```

比如你的用户名是 `Dylan`，那这条命令就是：

```
[System.Environment]::SetEnvironmentVariable("GSC_OAUTH_SECRETS_FILE", "C:\Users\Dylan\.claude\gsc-oauth.json", "User")
```

粘贴到 PowerShell 后，**按回车键**。同样没有任何输出就是成功了。

> **路径中的反斜杠 `\` 是正确的**，不要改成 `/`。Windows 用反斜杠作为路径分隔符。

### 6.4 设置第三个环境变量

复制下面的命令，粘贴到 PowerShell，按回车：

```
[System.Environment]::SetEnvironmentVariable("GSC_SITE_URL", "sc-domain:luckycrystals.org", "User")
```

> **域名格式说明**：
> - `sc-domain:luckycrystals.org` 中 `sc-domain:` 是固定前缀，后面跟你的域名
> - 这个格式是给"网域资源"用的（你在 GSC 里选"网域"方式添加的）
> - 如果以后添加其他网站用的是"网址前缀"方式，格式改为 `https://你的域名.com`（末尾不加 `/`）

### 6.5 验证 3 个环境变量都设置成功了

在同一个 PowerShell 窗口中，**逐行**复制粘贴以下命令，每条按回车：

```
[System.Environment]::GetEnvironmentVariable("GSC_AUTH_MODE", "User")
```
→ 应该输出：`oauth`

```
[System.Environment]::GetEnvironmentVariable("GSC_OAUTH_SECRETS_FILE", "User")
```
→ 应该输出：`C:\Users\你的用户名\.claude\gsc-oauth.json`

```
[System.Environment]::GetEnvironmentVariable("GSC_SITE_URL", "User")
```
→ 应该输出：`sc-domain:luckycrystals.org`

> **如果某一条输出为空**：说明没设置成功。检查命令中的拼写有没有错，然后重新执行对应的 6.2 / 6.3 / 6.4 步骤。

### 6.6 重启 VSCode（必须做！）

> **为什么要重启**：环境变量虽然已经写入系统了，但已经打开的程序（包括 VSCode）不会自动读取新设置的环境变量。必须关掉重新打开才行。

1. **保存** VSCode 中所有打开的文件
2. **完全关闭 VSCode**：点击右上角 X，或者菜单"文件" → "退出"
3. **关闭刚才打开的 PowerShell 窗口**（点右上角 X）
4. **重新打开 VSCode**
5. 在 VSCode 中重新打开 Claude Code

> macOS / Linux 用户把以下命令逐行粘贴到终端执行：
> ```bash
> echo 'export GSC_AUTH_MODE="oauth"' >> ~/.zshrc
> echo 'export GSC_OAUTH_SECRETS_FILE="$HOME/.claude/gsc-oauth.json"' >> ~/.zshrc
> echo 'export GSC_SITE_URL="sc-domain:luckycrystals.org"' >> ~/.zshrc
> source ~/.zshrc
> ```

---

## 第七步：安装 GSC MCP

环境变量设置好后，安装 MCP 服务：

```bash
claude mcp add -s user gsc -- npx -y gsc-mcp-server
```

### 首次授权

安装完成后，在 Claude Code 中使用 GSC 相关功能时，会自动弹出浏览器窗口让你登录 Google 账号并授权。授权完成后会生成一个 token 文件，之后就不需要再授权了。

---

## 验证清单

完成所有步骤后，逐项检查：

| # | 检查项 | 怎么验证 |
|---|--------|---------|
| 1 | 项目已创建 | 控制台左上角能看到你的项目名 |
| 2 | 3 个 API 已启用 | ☰ → API和服务 → 已启用的API和服务，能看到 3 个 API |
| 3 | OAuth 同意屏幕已配置 | ☰ → API和服务 → OAuth同意屏幕，状态为"测试中" |
| 4 | OAuth 客户端已创建 | ☰ → API和服务 → 凭据，能看到你创建的桌面应用客户端 |
| 5 | JSON 文件已下载 | 找到保存的 JSON 文件，内容包含 `client_id` 和 `client_secret` |
| 6 | 环境变量已设置 | 终端运行 `echo $GSC_OAUTH_SECRETS_FILE`（Mac）或 `echo %GSC_OAUTH_SECRETS_FILE%`（Windows CMD）能看到路径 |
| 7 | GSC MCP 已安装 | 运行 `claude mcp list`，能看到 `gsc` |

---

## 常见问题

### Q: 创建 OAuth 客户端时提示"如需创建 OAuth 客户端 ID，必须先配置同意屏幕"
**A**: 回到第四步，先配置 OAuth 同意屏幕。

### Q: 启用 API 时找不到对应的 API
**A**: 确保搜索关键词完全匹配：`Google Search Console API`（不是 Google Search API）。也可以直接访问快捷链接：
- Search Console API: [console.cloud.google.com/apis/library/searchconsole.googleapis.com](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)
- Analytics Data API: [console.cloud.google.com/apis/library/analyticsdata.googleapis.com](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)

### Q: 授权后仍然无法访问数据
**A**: 确保：
1. 你的网站已在 [Google Search Console](https://search.google.com/search-console) 中验证所有权
2. `GSC_SITE_URL` 的格式与 GSC 中注册的资源完全一致
3. OAuth 同意屏幕的测试用户中包含你的 Gmail

### Q: "此应用未经验证"警告
**A**: 这是正常的，因为你创建的是个人使用的应用，没有经过 Google 审核。点击"高级"→"前往（不安全）"即可继续。这个"不安全"只是指未经过 Google 审核，应用是你自己创建的，没有安全风险。

---

## 后续：GA4 Data API 使用

GA4 API 的使用方式不同于 GSC，不需要单独的 MCP。使用场景：

| 场景 | 使用方式 |
|------|---------|
| Claude Code 查询 GA4 数据 | 通过 Python 脚本 + google-analytics-data 库 |
| Google Data Studio 可视化 | 直接在 Data Studio 中连接 GA4 数据源（原生支持，无需 API 凭据） |
| 自动化报表 | Python 脚本 + 服务账号（Service Account） |

> GA4 Data API 的详细使用方法见 `01-AI营销/02-自动化工具库/08-数据分析工具/` 下的相关文档。

---

## 参考链接

| 资源 | 链接 |
|------|------|
| Google Cloud 控制台 | [console.cloud.google.com](https://console.cloud.google.com) |
| Google Search Console | [search.google.com/search-console](https://search.google.com/search-console) |
| GSC MCP GitHub | [github.com/suganthan-gsc-mcp](https://github.com/suganthan-gsc-mcp) |
| Google OAuth 文档 | [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2?hl=zh-cn) |
