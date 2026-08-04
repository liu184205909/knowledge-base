# Gutenberg 博客文章 REST API 上传指南

> 通过 `wp-json/wp/v2/posts` 端点上传 Gutenberg 区块格式的博客文章。
> 与 Elementor 操作手册互补：Elementor 用于核心页面（首页/产品页/Landing Page），Gutenberg 用于博客文章。

---

## 1. 适用范围

| 维度 | Elementor（核心页面） | Gutenberg（博客文章） |
|------|----------------------|---------------------|
| REST API 端点 | `/wp-json/wp/v2/pages` | `/wp-json/wp/v2/posts` |
| 内容格式 | Elementor JSON（`_elementor_data`） | Gutenberg Block HTML（`content` 字段） |
| 页面类型 | 首页、产品页、Landing Page、About | 博客文章、教程、指南 |
| RLM 步骤 | 步骤 2B/2C（建站阶段） | 步骤 3（内容创作阶段） |
| 设计复杂度 | 高（可视化布局） | 低（内容驱动） |
| SEO 优势 | 页面级控制 | 文章级优化，天然适合 SEO |

**判断标准**：需要复杂视觉布局 → Elementor；纯内容输出 → Gutenberg。

---

## 2. 认证方式

与 Elementor 相同，使用 Application Password：

```
Authorization: Basic base64(username:app_password)
```

在 WP 后台 → 用户 → 个人资料 → 应用密码 中生成。

---

## 3. 发布文章完整流程

```
1. 准备文章内容（Markdown → Gutenberg Block HTML）
2. POST /wp-json/wp/v2/posts  → 创建并发布文章
3. 如需上传图片 → 先调用 /wp-json/wp/v2/media 上传，再引用 media ID
```

---

## 4. Gutenberg Block HTML 格式

Gutenberg 的 `content` 字段使用 HTML 注释标记区块边界：

```
<!-- wp:paragraph -->
<p>这是普通段落。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>这是 H2 标题</h2>
<!-- /wp:heading -->
```

### 常用区块模板

#### 标题

```html
<!-- wp:heading {"level":2} -->
<h2>H2 标题</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>H3 标题</h3>
<!-- /wp:heading -->
```

#### 段落

```html
<!-- wp:paragraph -->
<p>普通段落文本。</p>
<!-- /wp:paragraph -->
```

#### 列表

```html
<!-- wp:list -->
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
</ul>
<!-- /wp:list -->

<!-- wp:list {"ordered":true} -->
<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
</ol>
<!-- /wp:list -->
```

#### 引用

```html
<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>引用文本</p></blockquote>
<!-- /wp:quote -->
```

#### 图片

```html
<!-- wp:image {"id":123,"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
  <img src="https://example.com/image.jpg" alt="描述文本" />
</figure>
<!-- /wp:image -->
```

> `id` 对应 Media Library 中的 media ID（需先上传到 `/wp-json/wp/v2/media`）。

#### 分隔线

```html
<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->
```

#### 表格

```html
<!-- wp:table -->
<figure class="wp-block-table">
  <table>
    <thead><tr><th>列1</th><th>列2</th></tr></thead>
    <tbody>
      <tr><td>数据1</td><td>数据2</td></tr>
    </tbody>
  </table>
</figure>
<!-- /wp:table -->
```

#### 代码块

```html
<!-- wp:code -->
<pre class="wp-block-code"><code>代码内容</code></pre>
<!-- /wp:code -->
```

#### 提示框（Callout）

```html
<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}}},"backgroundColor":"secondary"} -->
<div class="wp-block-group has-secondary-background-color has-background" style="border-radius:8px;padding:24px">
  <!-- wp:paragraph -->
  <p>提示内容</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

---

## 5. API 调用示例

### 5A. 发布文章（单步）

```bash
curl -X POST 'https://example.com/wp-json/wp/v2/posts' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Amethyst Crystal Healing Guide",
    "slug": "amethyst-crystal-healing-guide",
    "status": "publish",
    "content": "<!-- wp:heading -->\n<h2>What is Amethyst?</h2>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>Amethyst is a powerful healing crystal...</p>\n<!-- /wp:paragraph -->",
    "categories": [5],
    "tags": [12, 15],
    "featured_media": 123,
    "meta": {
      "_yoast_wpseo_title": "Amethyst Crystal Healing Guide | Brand Name",
      "_yoast_wpseo_metadesc": "Learn about amethyst crystal healing properties..."
    }
  }'
```

### 5B. 先上传图片，再发布文章

```bash
# Step 1: 上传图片
curl -X POST 'https://example.com/wp-json/wp/v2/media' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Disposition: attachment; filename="amethyst-guide.jpg"' \
  -H 'Content-Type: image/jpeg' \
  --data-binary @amethyst-guide.jpg

# 返回中获取 id 字段（如 123）和 source_url

# Step 2: 发布文章，引用图片
curl -X POST 'https://example.com/wp-json/wp/v2/posts' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Amethyst Crystal Healing Guide",
    "status": "publish",
    "content": "<!-- wp:image {\"id\":123,\"sizeSlug\":\"large\"} -->\n<figure class=\"wp-block-image size-large\"><img src=\"https://example.com/wp-content/uploads/amethyst-guide.jpg\" alt=\"Amethyst crystal\" /></figure>\n<!-- /wp:image -->\n\n<!-- wp:paragraph -->\n<p>Amethyst is...</p>\n<!-- /wp:paragraph -->",
    "featured_media": 123
  }'
```

### 5C. 更新已有文章

```bash
curl -X POST 'https://example.com/wp-json/wp/v2/posts/{post_id}' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "<!-- wp:paragraph -->\n<p>更新后的内容</p>\n<!-- /wp:paragraph -->"
  }'
```

---

## 6. 关键字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 文章标题 |
| `slug` | string | URL 别名（可选，不填则从标题自动生成） |
| `status` | string | `publish`（发布）/ `draft`（草稿） |
| `content` | string | Gutenberg Block HTML（核心内容） |
| `categories` | array[int] | 分类 ID 列表 |
| `tags` | array[int] | 标签 ID 列表 |
| `featured_media` | int | 特色图片的 media ID |
| `excerpt` | string | 摘要（可选，不填则从内容截取） |
| `meta` | object | 自定义字段（如 Yoast SEO 元数据） |

---

## 7. Markdown → Gutenberg Block HTML 转换规则

| Markdown | Gutenberg Block HTML |
|----------|---------------------|
| `## 标题` | `<!-- wp:heading {"level":2} --><h2>标题</h2><!-- /wp:heading -->` |
| `### 标题` | `<!-- wp:heading {"level":3} --><h3>标题</h3><!-- /wp:heading -->` |
| 普通段落 | `<!-- wp:paragraph --><p>文本</p><!-- /wp:paragraph -->` |
| `- 列表项` | `<!-- wp:list --><ul><li>列表项</li></ul><!-- /wp:list -->` |
| `1. 列表项` | `<!-- wp:list {"ordered":true} --><ol><li>列表项</li></ol><!-- /wp:list -->` |
| `> 引用` | `<!-- wp:quote --><blockquote><p>引用</p></blockquote><!-- /wp:quote -->` |
| `` `代码` `` | `<!-- wp:code --><pre><code>代码</code></pre><!-- /wp:code -->` |
| `---` | `<!-- wp:separator --><hr/><!-- /wp:separator -->` |
| `![alt](url)` | `<!-- wp:image --><figure><img src="url" alt="alt"/></figure><!-- /wp:image -->` |

---

## 8. 踩坑清单

| # | 坑 | 现象 | 解决方案 |
|---|---|------|---------|
| 1 | Block HTML 注释缺失 | 内容显示为纯文本或格式混乱 | 每个 HTML 元素必须包裹在 `<!-- wp:xxx -->` 和 `<!-- /wp:xxx -->` 之间 |
| 2 | `content` 中有未转义引号 | API 返回 400 错误 | JSON 中双引号需用 `\"` 转义，或用单引号包裹 JSON |
| 3 | 图片 `id` 未上传就引用 | 图片显示为占位符 | 先调 `/wp-json/wp/v2/media` 上传，拿到 ID 后再引用 |
| 4 | `status` 不写 | 文章变成草稿 | 明确传 `"status": "publish"` |
| 5 | 分类/标签 ID 不存在 | 文章无分类 | 先通过 `/wp-json/wp/v2/categories` 和 `/wp-json/wp/v2/tags` 确认 ID |
| 6 | 嵌套区块格式错误 | 嵌套内容不渲染 | 嵌套区块必须完整包含在外层区块的 HTML 内部 |
| 7 | content 中使用换行符 | 部分区块被吞 | 用 `\n\n` 分隔区块（两个换行），区块内用 `\n` |

---

## 9. 获取分类和标签 ID

```bash
# 查看所有分类
curl 'https://example.com/wp-json/wp/v2/categories' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk'

# 查看所有标签
curl 'https://example.com/wp-json/wp/v2/tags' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk'

# 创建新分类
curl -X POST 'https://example.com/wp-json/wp/v2/categories' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Crystal Guide", "slug": "crystal-guide"}'
```

---

## 10. 自动化工作流（RLM 步骤 3）

```
AI 生成文章（Markdown）
    ↓
转换 Markdown → Gutenberg Block HTML（按第7节规则）
    ↓
上传图片到 /wp-json/wp/v2/media（如有）
    ↓
POST /wp-json/wp/v2/posts 发布文章
    ↓
浏览器检查渲染效果
```

**批量发布时**：可编写脚本循环处理，每篇间隔 5-10 秒避免服务器压力。
