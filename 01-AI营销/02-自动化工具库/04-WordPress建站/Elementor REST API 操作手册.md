# Elementor REST API 操作手册

> 基于 luckycrystals.org（Elementor 3.34.0 + WoodMart 8.2.0）实战验证。
> 只记录试错出来的经验，不记录常识。

---

## 1. 核心发现：`?context=edit` 参数

WordPress REST API 默认**不暴露**也不允许写入 `_elementor_data` 元字段。加上 `?context=edit` 后即可。

```
# 读取（可看到 _elementor_data）
GET /wp-json/wp/v2/pages/7535?context=edit

# 写入（可写入 _elementor_data）
POST /wp-json/wp/v2/pages/37877?context=edit
Body: {
  "meta": {
    "_elementor_data": "[...]",
    "_elementor_edit_mode": "builder",
    "_elementor_template_type": "wp-page"
  }
}
```

## 2. 完整操作流程

```
1. POST /wp-json/wp/v2/pages           → 创建空白页面，获得 page ID
2. 生成 Elementor JSON（遵循下方规则）   → Node.js 脚本生成
3. POST /wp-json/wp/v2/pages/{id}?context=edit  → 注入 Elementor 数据
4. 浏览器访问 /?page_id={id}&preview=true  → 预览
```

## 3. 布局规则（最关键）

**多列布局必须用纯 Flexbox 模式，不能用 `structure` 属性！**

| 布局模式 | 属性 | 是否生效 | 原因 |
|---------|------|---------|------|
| 纯 Flexbox | `flex_direction: "row"`（无 structure） | **生效** | 浏览器原生 CSS flexbox 直接渲染 |
| Elementor 列系统 | `structure: "30"` + `_column_size` | **不生效** | CSS 需要编辑器保存才能生成，REST API 注入时不会触发 |

```javascript
// 正确：纯 Flexbox（推荐）
{
  flex_direction: 'row',
  flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
}
// children 自动等分空间，无需 structure 和 _column_size

// 错误：Elementor 列系统（REST API 注入无效）
{ structure: '30', flex_direction: 'row' }
// 子元素的 _column_size 对应的 CSS 不会生成，全部变成单列
```

### 响应式多列（flex_wrap + width）

```javascript
// 4列 → 平板 2x2 → 手机 1列
{
  flex_direction: 'row',
  flex_wrap: 'wrap',  // 关键：允许换行
  flex_gap: { size: 10, column: '10', row: '10', unit: 'px' }
}
// 子容器：
{
  width: { unit: '%', size: 23, sizes: [] },           // desktop 4列
  width_tablet: { unit: '%', size: 45, sizes: [] },     // tablet 2列
  width_mobile: { unit: '%', size: 100, sizes: [] }      // mobile 1列
}
```

## 4. Widget 选择策略

**Elementor 标准优先，WoodMart 仅功能必需时使用。**

| 优先级 | Widget | 类型 | 使用场景 |
|-------|--------|------|---------|
| 1 | `heading` | 标准 | 所有标题 |
| 1 | `text-editor` | 标准 | 段落文字 |
| 1 | `image` | 标准 | 图片展示 |
| 1 | `button` | 标准 | 按钮 |
| 1 | `spacer` | 标准 | 间距控制 |
| 1 | `image-box` | Pro | 图片+标题+描述卡片 |
| 1 | `icon-box` | Pro | 图标特性卡片 |
| 2 | `wd_products_widget` | WoodMart | 产品网格（WooCommerce 必需） |
| 2 | `wd_products_tabs` | WoodMart | 产品标签页（WooCommerce 必需） |

原则：`wd_title` 不要用，`heading` 完全够用。减少主题依赖。

## 5. Container 格式规则

| 规则 | 顶层容器（section） | 嵌套容器（内部） |
|-----|-------------------|-----------------|
| `isInner` | `false` | `true`（必须） |
| `content_width` | **不设**（默认 boxed） | `"full"`（必须） |
| `wd_section_stretch` | `"stretch"` | 不需要 |
| `scroll_y` | `-80` | `-80` |
| `flex_gap` | `{size, column, row, unit}` | 同左 |
| `padding/margin` 值类型 | **字符串**（`"80"` 不是 `80`） | 同左 |
| `padding/margin` 结构 | `{unit, top, right, bottom, left, isLinked}` | 同左 |
| `flex_direction` | 默认 `column`（垂直堆叠） | 按需设 `row`（水平排列） |

```json
// 顶层容器
{
  "id": "7位hex", "elType": "container",
  "settings": { "wd_section_stretch": "stretch", "scroll_y": -80, "flex_direction": "column" },
  "elements": [], "isInner": false
}

// 嵌套容器
{
  "id": "7位hex", "elType": "container",
  "settings": { "content_width": "full", "scroll_y": -80 },
  "elements": [], "isInner": true
}
```

## 6. 响应式属性命名规则

```
桌面端（默认）：     padding: { unit: 'px', top: '80', ... }
平板端（后缀 _tablet）： padding_tablet: { unit: 'px', top: '40', ... }
手机端（后缀 _mobile）： padding_mobile: { unit: 'px', top: '20', ... }

同理适用于：width → width_tablet → width_mobile
          typography_font_size → typography_font_size_tablet → typography_font_size_mobile
```

## 7. Widget 完整列表

### Elementor 标准 Widget
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
| `shortcode` | 短代码 |
| `html` | HTML代码 |

### Elementor Pro Widget
| widgetType | 用途 |
|------------|------|
| `posts` | 文章列表 |
| `portfolio` | 作品集 |
| `form` | 表单 |
| `nav-menu` | 导航菜单 |
| `animated-headline` | 动画标题 |
| `hotspot` | 热点图 |
| `price-table` | 价格表 |
| `flip-box` | 翻转盒子 |
| `call-to-action` | 行动号召 |
| `media-carousel` | 媒体轮播 |
| `countdown` | 倒计时 |
| `share-buttons` | 分享按钮 |
| `lottie` | Lottie动画 |

### WooCommerce Widget
| widgetType | 用途 |
|------------|------|
| `woocommerce-products` | 产品列表 |
| `woocommerce-product-add-to-cart` | 加入购物车 |
| `woocommerce-product-categories` | 产品分类 |
| `woocommerce-cart` | 购物车 |
| `woocommerce-checkout` | 结账 |
| `woocommerce-my-account` | 我的账户 |

### WoodMart Widget（仅功能必需时）
| widgetType | 用途 |
|------------|------|
| `wd_products_widget` | 产品网格（样式更丰富） |
| `wd_products_tabs` | 产品标签页 |

## 8. 认证方式

```javascript
const AUTH = 'Basic ' + Buffer.from('username:app_password').toString('base64');

// app_password 在 WP 后台 → 用户 → 个人资料 → 应用密码 生成
// 格式：xxxx xxxx xxxx xxxx xxxx xxxx（空格分隔，6组，每组4位）
```

## 9. 踩坑清单

| # | 坑 | 现象 | 解决方案 |
|---|---|------|---------|
| 1 | `_elementor_data` 无法写入 | POST 后数据为空 | 加 `?context=edit` 参数 |
| 2 | `content_width` 无效值 | UI 布局完全乱掉 | 不设（默认 boxed）或只设 `"boxed"` / `"full"` |
| 3 | 嵌套容器缺少 `isInner` | 子元素不显示 | 所有嵌套容器必须设 `isInner: true` |
| 4 | 用了 `structure` 属性 | 多列变单列 | 改用纯 Flexbox（`flex_direction: "row"`） |
| 5 | `padding` 值用数字 | 渲染异常 | 必须用字符串 `"80"` |
| 6 | `flex_gap` 格式错误 | 间距不生效 | 用 `{size, column, row, unit}` 四字段 |
| 7 | 用了 WoodMart `wd_title` | 不必要的主题依赖 | 改用 Elementor 标准 `heading` |
| 8 | Widget 的 `elements` 不是空数组 | 渲染报错 | 所有 Widget 的 `elements` 必须是 `[]` |
| 9 | 页面打开无 CSS | 编辑器未保存过 | 用 flexbox 模式绕过，或编辑器中点一次更新 |

## 10. 代码 vs 编辑器的区别

| 维度 | 编辑器手动搭建 | 代码写入 |
|------|-------------|---------|
| CSS 文件 | 保存时自动生成页面专属 CSS | **不会生成**（用 flexbox 绕过） |
| JSON 体积 | 冗余字段多（编辑器写入所有默认值） | 精简（只写必要字段） |
| 响应式 | UI 勾选，自动加 `_tablet`/`_mobile` | 手动写每个响应式属性 |
| 编辑器兼容 | 完美 | 可打开编辑，但随机 ID 不可追溯 |

**最佳工作流**：代码生成 80% 框架 → 编辑器精修 20% 细节。
