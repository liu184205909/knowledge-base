# Elementor 数据库存储格式

> AI直接写入本地WordPress数据库的参考

## 存储位置

`wp_postmeta` 表：
- `meta_key`: `_elementor_data`
- `meta_value`: Elementor页面JSON数据
- `post_id`: 关联页面ID

## JSON结构

### 层级关系（Container模式）
```
Container（容器）
  └── Container（嵌套容器，可无限嵌套）
      └── Container（继续嵌套）
          └── Widget（小部件）
```

> **注意**：Elementor 3.16+ 已用Container取代旧的Section/Column结构，Container支持无限嵌套

### 基础模板
```json
[
  {
    "id": "唯一ID",
    "elType": "container",
    "settings": {
      "flex_direction": "row",
      "flex_wrap": "wrap",
      "justify_content": "center",
      "align_items": "center",
      "gap": {"unit": "px", "size": 20}
    },
    "elements": [
      {
        "id": "唯一ID",
        "elType": "widget",
        "widgetType": "heading",
        "settings": {"title": "标题文字"}
      }
    ]
  }
]
```

## 元素类型

### Container（容器）
```json
{
  "id": "container123",
  "elType": "container",
  "settings": {
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "justify_content": "center",
    "align_items": "center",
    "gap": {"unit": "px", "size": 20},
    "padding": {"unit": "px", "top": "20", "right": "20", "bottom": "20", "left": "20"},
    "background_background": "classic",
    "background_color": "#ffffff"
  },
  "elements": []
}
```

**常用flex属性**：
| 属性 | 值 |
|------|-----|
| `flex_direction` | `row`, `column` |
| `flex_wrap` | `wrap`, `nowrap` |
| `justify_content` | `flex-start`, `center`, `flex-end`, `space-between` |
| `align_items` | `flex-start`, `center`, `flex-end`, `stretch` |
| `gap` | 间距设置 |

### 常用Widget
```json
// 标题
{"elType": "widget", "widgetType": "heading", "settings": {"title": "标题文字"}}

// 文本
{"elType": "widget", "widgetType": "text-editor", "settings": {"editor": "段落内容"}}

// 图片
{"elType": "widget", "widgetType": "image", "settings": {"image": {"url": "图片地址"}}}

// 按钮
{"elType": "widget", "widgetType": "button", "settings": {"text": "按钮文字", "link": {"url": "链接"}}}

// 图标
{"elType": "widget", "widgetType": "icon", "settings": {"icon": {"value": "fas fa-star"}}}

// 视频
{"elType": "widget", "widgetType": "video", "settings": {"video_url": "视频地址"}}
```

## Elementor Pro 完整Widget列表

### Basic Widgets（基础组件）
| widgetType | 用途 |
|------------|------|
| `heading` | 标题 |
| `image` | 图片 |
| `text-editor` | 文本编辑器 |
| `video` | 视频 |
| `button` | 按钮 |
| `divider` | 分隔线 |
| `spacer` | 间距 |
| `google_maps` | 谷歌地图 |
| `icon` | 图标 |
| `image-box` | 图片盒子 |
| `icon-box` | 图标盒子 |
| `star-rating` | 星级评分 |
| `image-carousel` | 图片轮播 |
| `image-gallery` | 图片画廊 |
| `icon-list` | 图标列表 |
| `counter` | 计数器 |
| `progress` | 进度条 |
| `testimonial` | 用户评价 |
| `tabs` | 标签页 |
| `accordion` | 手风琴 |
| `toggle` | 开关切换 |
| `social-icons` | 社交图标 |
| `alert` | 提示框 |
| `audio` | 音频 |
| `shortcode` | 短代码 |
| `html` | HTML代码 |
| `menu-anchor` | 菜单锚点 |
| `read-more` | 阅读更多 |

### Pro Widgets（Pro组件）
| widgetType | 用途 |
|------------|------|
| `posts` | 文章列表 |
| `portfolio` | 作品集 |
| `gallery` | 画廊 |
| `form` | 表单 |
| `login` | 登录 |
| `slides` | 幻灯片 |
| `nav-menu` | 导航菜单 |
| `animated-headline` | 动画标题 |
| `hotspot` | 热点图 |
| `price-table` | 价格表 |
| `flip-box` | 翻转盒子 |
| `call-to-action` | 行动号召 |
| `media-carousel` | 媒体轮播 |
| `countdown` | 倒计时 |
| `share-buttons` | 分享按钮 |
| `blockquote` | 引用块 |
| `facebook-button` | Facebook按钮 |
| `facebook-comments` | Facebook评论 |
| `facebook-embed` | Facebook嵌入 |
| `facebook-page` | Facebook页面 |
| `template` | 模板 |
| `lottie` | Lottie动画 |
| `code-highlight` | 代码高亮 |
| `video-playlist` | 视频播放列表 |
| `paypal-button` | PayPal按钮 |
| `stripe-button` | Stripe按钮 |

### Theme Elements（主题元素）
| widgetType | 用途 |
|------------|------|
| `site-logo` | 站点Logo |
| `site-title` | 站点标题 |
| `page-title` | 页面标题 |
| `site-tagline` | 站点标语 |
| `archive-title` | 归档标题 |
| `post-title` | 文章标题 |
| `post-excerpt` | 文章摘要 |
| `post-content` | 文章内容 |
| `post-featured-image` | 特色图片 |
| `post-info` | 文章信息 |
| `post-terms` | 文章分类/标签 |
| `post-comments` | 文章评论 |
| `post-navigation` | 文章导航 |
| `author-box` | 作者信息 |
| `search-form` | 搜索表单 |
| `breadcrumb` | 面包屑导航 |
| `archive-description` | 归档描述 |
| `woocommerce-breadcrumb` | WC面包屑 |
| `woocommerce-product-content` | WC产品内容 |
| `woocommerce-product-data-tabs` | WC产品数据标签 |
| `woocommerce-product-meta` | WC产品元数据 |
| `woocommerce-product-related` | WC相关产品 |
| `woocommerce-product-upsells` | WC追加销售 |
| `woocommerce-products` | WC产品列表 |

### WooCommerce Widgets
| widgetType | 用途 |
|------------|------|
| `woocommerce-products` | 产品列表 |
| `woocommerce-product-add-to-cart` | 加入购物车 |
| `woocommerce-product-categories` | 产品分类 |
| `woocommerce-product-content` | 产品内容 |
| `woocommerce-product-data-tabs` | 产品数据标签 |
| `woocommerce-product-images` | 产品图片 |
| `woocommerce-product-meta` | 产品元数据 |
| `woocommerce-product-price` | 产品价格 |
| `woocommerce-product-rating` | 产品评分 |
| `woocommerce-product-related` | 相关产品 |
| `woocommerce-product-short-description` | 产品简介 |
| `woocommerce-product-stock` | 库存状态 |
| `woocommerce-product-title` | 产品标题 |
| `woocommerce-product-upsells` | 追加销售 |
| `woocommerce-cart` | 购物车 |
| `woocommerce-checkout` | 结账 |
| `woocommerce-my-account` | 我的账户 |
| `woocommerce-purchase-summary` | 订单摘要 |
| `woocommerce-notices` | WooCommerce通知 |
| `woocommerce-breadcrumb` | 面包屑 |
| `woocommerce-page-title` | 页面标题 |
| `woocommerce-order-confirmation` | 订单确认 |
| `woocommerce-customer-details` | 客户详情 |
| `woocommerce-purchase-summary` | 采购摘要 |
| `wc-elements` | WC元素（通用） |

## 本地直接写入方式

### 方式1：通过WP-CLI
```bash
# 创建页面
wp post create --post_type=page --post_title="页面标题" --post_status=publish

# 获取页面ID后，写入Elementor数据
wp post meta update <page_id> _elementor_data '<JSON数据>'
wp post meta update <page_id> _elementor_edit_mode builder
wp post meta update <page_id> _elementor_template_type wp-page
```

### 方式2：通过PHP代码
```php
// 创建页面
$page_id = wp_insert_post([
    'post_title' => '页面标题',
    'post_type' => 'page',
    'post_status' => 'publish'
]);

// 写入Elementor数据
update_post_meta($page_id, '_elementor_data', $json_data);
update_post_meta($page_id, '_elementor_edit_mode', 'builder');
update_post_meta($page_id, '_elementor_template_type', 'wp-page');
```

### 方式3：直接操作数据库
```php
global $wpdb;
$wpdb->insert(
    $wpdb->postmeta,
    [
        'post_id' => $page_id,
        'meta_key' => '_elementor_data',
        'meta_value' => $json_data
    ]
);
```

## 必需的Meta字段

创建Elementor页面时，需要同时写入：
| meta_key | meta_value |
|----------|------------|
| `_elementor_data` | JSON布局数据 |
| `_elementor_edit_mode` | `builder` |
| `_elementor_template_type` | `wp-page` |
| `_elementor_version` | `3.x.x` |
| `_page_template` | `elementor_canvas`（可选） |

## 注意事项

1. **JSON格式**：必须是有效的JSON，特殊字符需转义
2. **ID唯一性**：每个元素的id必须唯一（7-8位hex字符）
3. **备份数据**：修改前先备份wp_postmeta表
4. **版本兼容**：Container结构需要Elementor 3.16+
5. **缓存清理**：修改后清理Elementor缓存
