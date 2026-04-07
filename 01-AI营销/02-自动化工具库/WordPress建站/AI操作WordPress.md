# 用 Claude 自动化操作 WordPress 完整指南

> 本地文件夹是指挥中心，WordPress 只是展示终端。

## 一、核心思路

Claude 通过 WordPress REST API 操作你的网站。你需要做的就是：

1. 在 WP 后台生成一个应用密码
2. 在本地项目里放一个配置文件
3. 用自然语言告诉 Claude 你要做什么

```
你（自然语言）→ Claude（分析、生成、调 API）→ WordPress（执行）
```

---

## 二、环境配置（三步搞定）

### 第一步：生成应用密码

WP 后台 → 用户 → 个人资料 → 应用密码 → 输入名称（如 "Claude"） → 生成

### 第二步：保存配置文件

在本地项目文件夹中创建 `wp-config.json`：

```json
{
  "site_url": "https://你的网站.com",
  "username": "admin",
  "app_password": "xxxx xxxx xxxx xxxx xxxx xxxx",
  "api_base": "/wp-json/wp/v2"
}
```

### 第三步：测试

```
读取 wp-config.json，帮我列出网站最近 5 篇文章的标题
```

返回文章列表即连接成功。Claude 自己看配置文件、自己调 API，你不需要解释接口细节。

---

## 三、深度内容与 SEO 护城河

不再只是"写文章"，而是基于 E-E-A-T 原则构建内容护城河。

### 3.1 专业内容自动化排版

AI 在本地生成包含复杂层级（H2/H3）、清晰逻辑的技术文章，直接通过 API 携带完整 HTML 标签（表格、列表等）推送到 WordPress，免除后台手动排版。Schema 标记由 SEO 插件（Yoast / Rank Math）自动处理。

**你说**：
```
帮我创建一篇关于"如何选择宠物自动喂食器"的专业评测文章，1500字，
包含 H2/H3 层级、产品对比表格、Schema FAQ 标记，
发到"宠物用品"分类下
```

**常用指令**：

| 场景 | prompt 示例 |
|------|------------|
| 创建文章 | "创建一篇关于 XX 的文章，包含 H2/H3 层级结构，发到 YY 分类" |
| 创建草稿 | "写一篇关于 XX 的技术文章，先保存为草稿" |
| 按模板创建 | "按照我之前那篇 XX 的文章结构，写一篇关于 YY 的" |
| 产品描述 | "给这款产品写一段 300 字的高转化率描述，突出 XX 卖点" |

### 3.2 改写与优化

| 场景 | prompt 示例 |
|------|------------|
| 改写风格 | "把这篇文章改写得更有亲和力，像朋友聊天一样" |
| SEO 优化 | "优化这篇文章：补充关键词密度、调整标题结构、加内链" |
| 缩写/扩写 | "把这篇文章精简到 800 字" / "把 XX 段落展开，加具体案例" |
| 多语言 | "把这篇文章翻译成西班牙语，发布到 ES 分类下" |

### 3.3 SEO 元数据精准注入

发布文章的同一秒，AI 计算好字符长度，直接将 Meta Title、Meta Description 和优化的 Slug 写入 SEO 插件字段（如 Yoast 或 Rank Math）。

> **注意**：需要 SEO 插件已安装，并通过其暴露的 REST API 字段写入。不同插件的字段名不同（如 Yoast 使用 `yoast_head_json`，Rank Math 使用 `rank_math_seo`），Claude 会自动识别处理。

| 操作 | prompt 示例 |
|------|------------|
| Meta Title | "为这篇文章生成 3 个 meta title 方案，60 字符以内，包含目标关键词" |
| Meta Description | "生成 meta description，150-160 字符，包含行动号召，写入 Yoast 字段" |
| Slug | "优化这篇文章的 slug，简短且包含关键词" |

### 3.4 全站术语统一清洗

通过 API 批量拉取全站文章，让 AI 扫描并自动替换不严谨的术语。

**你说**：
```
扫描全站文章，把所有"Drill tools"替换为行业标准词汇"Drill Rods"，
保持全站 SEO 关键词一致性
```

### 3.5 智能内链网络

AI 读取全站 Sitemap 和文章列表，生成新内容时自动寻找高度相关的历史文章，在正文中埋好精准的锚文本内链。

**你说**：
```
读取 sitemap.xml，为新文章"XX"找到最相关的 5 篇历史文章，
在正文中自然地插入内链
```

---

## 四、WooCommerce 电商自动化

### WooCommerce API 密钥配置

WooCommerce 使用独立的 Consumer Key / Secret 认证（不是 WP 应用密码），生成步骤：

WP 后台 → WooCommerce → 设置 → 高级 → REST API → 添加密钥 → 权限选"读/写" → 生成

将生成的密钥追加到配置文件：

```json
{
  "site_url": "https://你的网站.com",
  "username": "admin",
  "app_password": "xxxx xxxx xxxx xxxx xxxx xxxx",
  "api_base": "/wp-json/wp/v2",
  "wc_consumer_key": "ck_xxxxxxxxxxxxxxxx",
  "wc_consumer_secret": "cs_xxxxxxxxxxxxxxxx"
}
```

> 测试命令：`curl -u ck_xxx:cs_xxx https://你的网站.com/wp-json/wc/v3/products`，返回产品列表即成功。

---

### 4.1 产品矩阵极速上架

丢给 AI 一份参数表格，AI 自动扩写为高转化率的产品描述，通过 API 创建产品、分配分类、打标签。

**你说**：
```
读取这份产品参数表（products.csv），为每个产品生成吸引人的描述，
自动创建 WooCommerce 产品，分配到对应分类
```

### 4.2 价格与库存批量同步

针对不同客户群体（零售/批发），AI 根据策略批量调整价格。

**你说**：
```
把"B2B 钻头"分类下所有产品的批发价调整为零售价的 7 折，
通过 API 更新 Regular Price 和 Sale Price
```

### 4.3 产品 FAQ 批量生成

针对销量高但转化率遇瓶颈的产品，AI 自动生成解决客户痛点的 Q&A。

**你说**：
```
找出销量前 10 但转化率低于 2% 的产品，为每个生成 5 条 FAQ，
更新到产品描述区
```

---

## 五、媒体与视觉资产接管

### 5.1 图片自动入库

用 AI 生成或外部工具制作的图片，自动上传至 WordPress 媒体库。

**你说**：
```
上传这张图片到媒体库，文件名改为"best-pet-feeder-2026.jpg"，
ALT 设为"2026年最佳宠物自动喂食器对比"，然后设为 XX 文章的特色图片
```

Claude 会：上传图片 → 设置文件名 → 注入 ALT → 绑定为特色图片（Featured Image）。

### 5.2 全站图片 SEO 批量优化

**你说**：
```
扫描全站所有图片，找出缺少 ALT 的，根据文章上下文自动生成 ALT 并更新
```

---

## 六、数据源与数据驱动操作

### 6.0 可用数据源

| 数据源 | 用途 |
|--------|------|
| GSC 导出数据 | 分析搜索表现、发现机会词 |
| 关键词工具数据 | Ahrefs / SEMrush 导出的关键词列表 |
| 竞品 Keyword Gap | Semrush 导出的竞对关键词差距 |
| Sitemap | 下载 sitemap.xml，掌握完整站内结构 |
| 产品参数表 | Excel/CSV 表格，批量生成产品描述 |

> **提示**：简单操作可以一句话搞定。批量操作（如全站扫描、大批量更新）可能超出 Claude 上下文窗口，需要分批处理或配合脚本完成。

### 6.1 竞对数据直接转化为内容

把 Semrush 等工具导出的关键词差距数据（Keyword Gap）喂给 AI，AI 分析价值洼地后直接批量创建草稿占位文章。

**你说**：
```
分析这份 Keyword Gap 数据（keyword-gap.csv），找出我们还没覆盖但竞对排名靠前的关键词，
为每个关键词创建一篇草稿文章，分配好分类和重点关键词
```



### 6.2 GSC 数据驱动闭环

```
导出 GSC 数据 → AI 分析发现机会 → 优化/创建内容 → 发布更新 → 下次看效果
```

**案例**：GSC 显示 "pet feeder reviews" 排名第 15 位，500 展现但只有 15 点击：

```
关键词 "pet feeder reviews" 排名第 15 位，帮我优化对应的页面。
目标：提升到前 10 位。
```

---

## 七、常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 应用密码无效 | 格式错误或权限不足 | 重新生成，确认用户有管理员权限 |
| API 返回 403 | REST API 被安全插件拦截 | 检查防火墙/安全插件设置，放行 /wp-json/ |
| 批量操作超时 | 请求过多 | 分批执行，每批 10-20 篇 |
| WooCommerce 接口不通 | 需要单独的 WooCommerce API 密钥 | 见第四章"WooCommerce API 密钥配置" |
| Elementor 页面无法通过 API 修改 | Elementor 数据存储在 `post_content` 的 JSON 中，不是普通 HTML | 指令中说明"读取该页面的 Elementor JSON 数据，修改 XX 部分后写回"。建议先用 API 读取一篇 Elementor 页面，理解 JSON 结构后再批量操作 |

---

## 参考

- 成海《通过Rest API连接WordPress和Claude Code实现自动化操作》
- 小渔《使用 AI 接管 WordPress 网站》
- [WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter)（官方封装方案，目前还在开发阶段）
