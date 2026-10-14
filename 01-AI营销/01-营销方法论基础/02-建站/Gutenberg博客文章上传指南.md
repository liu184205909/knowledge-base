# Gutenberg 博客文章 REST API 上传指南

> post 走 MD→Gutenberg 通道的唯一文档。与 Elementor 分工：核心页面走 [Elementor MCP 生产 SOP（Woodmart）](./Elementor%20MCP%20生产%20SOP（Woodmart）.md)（无原型）或 [HTML转Elementor混合流水线SOP](./HTML转Elementor混合流水线SOP.md)（有原型），博客文章走本指南。

**执行与验收协议（条款卡模式——防执行层摘要化，2026-10-14 定案；三规则全库统一，文字真源=竞品分析SOP 协议段）**：①**派活=抄卡**——派活把上传通道条款（front matter 规范/REST 端点与认证/写后验证断言）**原文整块抄进任务书**，禁指针；②**交付=回执先行**——执行 agent 交付物第一部分=**条款回执表**，逐条标 `✅已做（证据落点）｜不适用（原因）｜未做（原因+补做时点）`，无证据落点视同未做，分析与产物附后；③**验收=数表**——对照本 SOP 逐行核回执，空行/含糊行一律打回，无回执表=交付无效。先例：article-factory 条款全文注入制（仿真花两轮实战验证）。

## 1. 适用范围

| 维度 | Elementor（核心页面） | Gutenberg（博客文章） |
|------|----------------------|---------------------|
| REST 端点 | `/wp-json/wp/v2/pages` | `/wp-json/wp/v2/posts` |
| 内容格式 | Elementor JSON（`_elementor_data`） | Gutenberg Block HTML（`content` 字段） |

**判断标准**：复杂视觉布局（首页/产品页/Landing）→ Elementor；纯内容输出（博客/教程/指南）→ Gutenberg。

## 2. 认证

Application Password（WP 后台 → 用户 → 个人资料 → 应用密码生成）：`Authorization: Basic base64(username:app_password)`

## 3. 发布流程

```
Markdown → Gutenberg Block HTML（§7 规则）
  → （如有图片）POST /wp-json/wp/v2/media 上传拿 ID
  → POST /wp-json/wp/v2/posts 发布
```

## 4. Gutenberg Block HTML 格式

`content` 字段用 HTML 注释标记区块边界。标题/段落即此格式（wp:heading 带 level、wp:paragraph 包 `<p>`）：

```
<!-- wp:heading {"level":2} -->
<h2>这是 H2 标题</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>这是普通段落。</p>
<!-- /wp:paragraph -->
```

### 列表

```html
<!-- wp:list -->
<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
</ul>
<!-- /wp:list -->
```

有序列表：`<!-- wp:list {"ordered":true} --><ol>...</ol><!-- /wp:list -->`

### 图片

```html
<!-- wp:image {"id":123,"sizeSlug":"large"} -->
<figure class="wp-block-image size-large">
  <img src="https://example.com/image.jpg" alt="描述文本" />
</figure>
<!-- /wp:image -->
```

> `id` 对应 Media Library 的 media ID（需先上传到 `/wp-json/wp/v2/media`）。

### 单行块（引用 / 分隔线 / 代码）

```html
<!-- wp:quote --><blockquote class="wp-block-quote"><p>引用文本</p></blockquote><!-- /wp:quote -->
<!-- wp:separator --><hr class="wp-block-separator has-alpha-channel-opacity"/><!-- /wp:separator -->
<!-- wp:code --><pre class="wp-block-code"><code>代码内容</code></pre><!-- /wp:code -->
```

### 表格

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

### 提示框（Callout）

```html
<!-- wp:group {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"24px","right":"24px","bottom":"24px","left":"24px"}}},"backgroundColor":"secondary"} -->
<div class="wp-block-group has-secondary-background-color has-background" style="border-radius:8px;padding:24px">
  <!-- wp:paragraph -->
  <p>提示内容</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

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

> **meta 键按站内 SEO 插件替换**：现役多站用 RankMath（`rank_math_title` / `rank_math_description`），Yoast 键名仅为老站示范——上传前查目标站点实际插件。

### 5B. 先上传图片，再发布文章

```bash
# Step 1: 上传图片，返回中取 id 与 source_url
curl -X POST 'https://example.com/wp-json/wp/v2/media' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Disposition: attachment; filename="amethyst-guide.jpg"' \
  -H 'Content-Type: image/jpeg' \
  --data-binary @amethyst-guide.jpg
```

Step 2 发布请求体同 §5A，两处差异：① content 内嵌 `wp:image` 块（引用 Step 1 的 id 与 source_url）；② 加 `"featured_media": 123`。

### 5C. 更新已有文章

```bash
curl -X POST 'https://example.com/wp-json/wp/v2/posts/{post_id}' \
  -H 'Authorization: Basic dXNlcm5hbWU6YXBwX3Bhc3N3b3Jk' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "<!-- wp:paragraph -->\n<p>更新后的内容</p>\n<!-- /wp:paragraph -->"
  }'
```

## 6. 关键字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 文章标题 |
| `slug` | string | URL 别名（可选，不填从标题自动生成） |
| `status` | string | `publish` / `draft` |
| `content` | string | Gutenberg Block HTML（核心内容） |
| `categories` | array[int] | 分类 ID 列表 |
| `tags` | array[int] | 标签 ID 列表 |
| `featured_media` | int | 特色图片的 media ID |
| `excerpt` | string | 摘要（可选，不填从内容截取） |
| `meta` | object | 自定义字段（SEO 元数据） |

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

## 8. 踩坑清单

| # | 坑 | 现象 | 解决方案 |
|---|---|------|---------|
| 1 | Block HTML 注释缺失 | 内容显示为纯文本或格式混乱 | 每个 HTML 元素必须包裹在 `<!-- wp:xxx -->` 和 `<!-- /wp:xxx -->` 之间 |
| 2 | `content` 中有未转义引号 | API 返回 400 | JSON 中双引号用 `\"` 转义，或单引号包裹 JSON |
| 3 | 图片 `id` 未上传就引用 | 图片显示为占位符 | 先调 `/wp-json/wp/v2/media` 上传拿 ID 再引用 |
| 4 | `status` 不写 | 文章变草稿 | 明确传 `"status": "publish"` |
| 5 | 分类/标签 ID 不存在 | 文章无分类 | 先通过 `/wp-json/wp/v2/categories` / `tags` 确认 ID |
| 6 | 嵌套区块格式错误 | 嵌套内容不渲染 | 嵌套区块必须完整包含在外层区块 HTML 内部 |
| 7 | content 中使用换行符 | 部分区块被吞 | 用 `\n\n` 分隔区块，区块内用 `\n` |

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

批量发布：脚本循环处理，每篇间隔 5-10 秒避免服务器压力。
