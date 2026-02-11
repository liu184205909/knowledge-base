# Elementor JSON 生成技术规范与限制说明

## 📋 文档目的

本文档定义了AI生成Elementor页面JSON文件时必须遵守的技术规范、组件限制和格式要求。

---

## 🎯 核心原则

### 必须遵守的规则：
1. **严格遵循Elementor JSON Schema**
2. **仅使用官方支持的Widget类型**
3. **确保所有必需字段存在**
4. **生成有效的唯一ID**
5. **保持正确的嵌套结构**

---

## 📐 JSON结构规范

### 顶层结构（必需）

```json
{
  "title": "页面标题",
  "type": "page|wp-page|section|popup",
  "version": "0.4",
  "page_settings": [],
  "content": []
}
```

#### 字段说明：
- `title`: 字符串，页面名称
- `type`: 页面类型
  - `page` - 独立页面
  - `wp-page` - WordPress页面
  - `section` - 区块模板
  - `popup` - 弹窗
- `version`: **必须**是 `"0.4"`
- `page_settings`: 数组，页面级设置（可为空）
- `content`: 数组，包含所有顶层元素

### 元素结构（必需）

所有元素必须包含以下字段：

```json
{
  "id": "唯一ID字符串",
  "elType": "container|column|widget",
  "settings": {},
  "elements": []
}
```

#### 字段说明：
- `id`: **必需**，唯一字符串标识符
  - 格式：随机字符串或数字
  - 在整个JSON中必须唯一
  - 建议格式：时间戳 + 随机数
- `elType`: **必需**，元素类型
- `settings`: **必需**，对象，组件设置参数
- `elements`: **必需**，数组，子元素
  - Widget类型必须为空数组 `[]`

### Widget元素额外字段（可选但推荐）

```json
{
  "id": "xxx",
  "elType": "widget",
  "widgetType": "heading",
  "isInner": false,
  "settings": {...},
  "elements": []
}
```

- `widgetType`: **Widget元素必需**，指定组件类型
- `isInner`: 布尔值，是否为内部元素（通常为false）

---

## 🏗️ 元素类型与嵌套规则

### 允许的elType值：

| elType | 说明 | 可包含的子元素 |
|--------|------|----------------|
| `container` | 容器（Elementor 3.0+ Flexbox） | container, widget |
| `widget` | 组件 | **无（必须为空数组）** |

### 标准嵌套结构：

```
content[0]: Container (外层)
  ├─ elements[0]: Container (中层)
  │   ├─ elements[0]: Widget (heading)
  │   ├─ elements[1]: Widget (text-editor)
  │   └─ elements[2]: Widget (button)
  ├─ elements[1]: Container (中层)
  │   └─ elements[0]: Widget (image)
  └─ settings: {...}
```

**三层Container嵌套示例：**
```
Container (根层)
  ├─ Container (第二层)
  │   ├─ Widget (navigation_anchor)
  │   └─ Widget (image_or_svg)
  ├─ Container (第二层)
  │   ├─ Widget (section_title)
  │   ├─ Widget (text_block)
  │   └─ Widget (text_block)
  └─ Container (第三层/空)
```

### ⚠️ 严格限制：

1. **Widget的elements必须为空数组**
   ```json
   {
     "elType": "widget",
     "elements": []  // ✅ 正确
   }
   ```

2. **Container可以直接包含Widget（不需要Column！）**
   ```json
   // ✅ 正确 - Container直接包含Widget
   {
     "elType": "container",
     "elements": [
       {"elType": "widget", "widgetType": "heading", ...}
     ]
   }
   ```

3. **Container可以嵌套Container**
   ```json
   // ✅ 正确 - Container嵌套Container
   {
     "elType": "container",
     "elements": [
       {
         "elType": "container",
         "elements": [
           {"elType": "widget", ...}
         ]
       }
     ]
   }
   ```

4. **不能使用Column（Elementor 3.0+已废弃）**
   ```json
   // ❌ 错误 - 不要使用column
   {
     "elType": "column",
     ...
   }

   // ✅ 正确 - 使用嵌套Container代替
   {
     "elType": "container",
     "elements": [
       {"elType": "container", ...}
     ]
   }
   ```

---

## 🧩 支持的Widget类型

### 核心组件（Elementor Free）

#### 基础组件：
- `heading` - 标题
- `image` - 图片
- `text-editor` - 文本编辑器
- `video` - 视频
- `button` - 按钮
- `divider` - 分隔线
- `spacer` - 间距
- `google_maps` - Google地图
- `icon` - 图标
- `icon-box` - 图标框
- `image-box` - 图片框
- `star-rating` - 星级评分
- `image-gallery` - 图片画廊
- `image-carousel` - 图片轮播
- `icon-list` - 图标列表
- `counter` - 计数器
- `progress` - 进度条
- `testimonial` - 客户评价
- `tabs` - 选项卡
- `accordion` - 手风琴
- `toggle` - 切换
- `alert` - 警告框
- `html` - HTML代码
- `menu-anchor` - 菜单锚点
- `sidebar` - 侧边栏
- `read-more` - 阅读更多

#### 表单组件：
- `form` - 表单（需要某些验证）

### Pro组件（Elementor Pro）

- `posts` - 文章列表
- `portfolio` - 作品集
- `slides` - 幻灯片
- `pricing-table` - 价格表
- `faq` - 常见问题
- `calculator` - 计算器
- `media-carousel` - 媒体轮播
- `gallery` - 画廊
- `loop-grid` - 循环网格
- `nav-menu` - 导航菜单
- `mega-menu` - 超级菜单
- `comments` - 评论区
- `wp-pages` - WordPress页面列表
- `wp-widget-calendar` - 日历小工具
- `wp-widget-search` - 搜索小工具
- `wp-widget-tag-cloud` - 标签云
- `theme-elements` - 主题元素
- `woocommerce` 相关组件
- `popup` - 弹窗
- `hotspot` - 热点
- `price-list` - 价格列表

### ⚠️ 严格限制：

1. **Widget类型名称必须精确**
   - 区分大小写
   - 使用连字符而不是下划线
   - 例如：`icon-box` ✅，`IconBox` ❌，`icon_box` ❌

2. **第三方插件Widget**
   - WoodMart组件需要WoodMart主题激活
   - 仅在明确需要时使用

---

## 🛒 WoodMart组件（需WoodMart主题）

### 使用原则
**Elementor为主（90%），WoodMart为辅（10%）**
- 优先使用Elementor原生组件
- 只在WoodMart明显更好或无法实现时使用

### 电商产品组件（优先使用WoodMart）

#### `wd_products` - 产品网格
```json
{
  "widgetType": "wd_products",
  "settings": {"columns": "4", "products_per_page": "8"}
}
```
**何时使用**: 产品列表、相关产品、热门产品

#### `wd_product_categories` - 产品分类
```json
{
  "widgetType": "wd_product_categories",
  "settings": {"number": "6", "hide_empty": "yes"}
}
```
**何时使用**: 产品分类导航、分类图标展示

#### `wd_product_filters` - 产品筛选
```json
{
  "widgetType": "wd_product_filters"
}
```
**何时使用**: AJAX筛选、侧边栏筛选器

#### `wd_on_sale_products` - 促销产品
#### `wd_recently_viewed` - 最近浏览

### Banner和图像组件（WoodMart更好）

#### `wd_banner` - 横幅广告
```json
{
  "widgetType": "wd_banner",
  "settings": {
    "banner_img": {"url": "..."},
    "banner_content_align": "center"
  }
}
```
**何时使用**: 促销横幅、活动Banner、分类广告

#### `wd_images_gallery` / `wd_masonry_gallery` - 图片画廊

### 信息展示组件（WoodMart更好）

#### `wd_infobox` - 信息框
```json
{
  "widgetType": "wd_infobox",
  "settings": {
    "info_box_icon": "fas fa-star",
    "info_box_title": "免费配送",
    "info_box_text": "订单满$99免运费"
  }
}
```
**何时使用**: 服务特点、保障说明、卖点突出

#### `wd_featured_box` - 特色展示框
#### `wd_icon_box` - 图标框（增强版）

### 团队和证言组件

#### `wd_team_member` - 团队成员
```json
{
  "widgetType": "wd_team_member",
  "settings": {
    "team_member_name": "John Doe",
    "team_member_role": "CEO"
  }
}
```

#### `wd_testimonials` - 客户评价
```json
{
  "widgetType": "wd_testimonials",
  "settings": {"testimonials_style": "boxed"}
}
```

### 进度和时间组件

#### `wd_counter` - 计数器
#### `wd_progress_bar` - 进度条
#### `wd_countdown` - 倒计时器
**何时使用**: 数据统计、限时促销

### 内容展示组件

#### `wd_portfolio` - 作品集
#### `wd_blog` - 博客文章

### 其他实用组件

#### `wd_nav_menu` - 导航菜单
#### `wd_button` - 按钮（WoodMart样式）
#### `wd_social_buttons` - 社交按钮
#### `wd_search_form` - 搜索表单
#### `wd_google_map` - Google地图
#### `wd_title` - 标题组件
#### `wd_parallax_banner` - 视差横幅

### WoodMart组件使用决策表

| 需求 | 用WoodMart | 用Elementor | 推荐 |
|------|-----------|-------------|------|
| 产品列表 | ✅ | ⚠️ 有限 | **WoodMart** |
| 产品分类 | ✅ | ❌ | **WoodMart** |
| 产品筛选 | ✅ | ❌ | **WoodMart** |
| Banner广告 | ✅ | ⚠️ 需组合 | **WoodMart** |
| 信息框 | ✅ | ✅ | WoodMart |
| 团队/证言 | ✅ | ✅ | WoodMart |
| 倒计时 | ✅ | ❌ | **WoodMart** |
| 视差效果 | ✅ | ⚠️ 需代码 | **WoodMart** |
| 基础内容 | ⚠️ | ✅ | Elementor |
| 按钮 | ⚠️ | ✅ | Elementor |
| 表单 | ⚠️ | ✅ | Elementor |

---

## ⚙️ Settings参数规范

### 通用设置规则：

#### 1. 布局相关
```json
{
  "_column_size": 100,
  "_inline_size": 100,
  "_padding": {"unit": "px", "top": "20", "right": "20", "bottom": "20", "left": "20"},
  "_margin": {"unit": "px", "top": "0", "right": "0", "bottom": "0", "left": "0"},
  "_element_width": "initial",
  "_element_custom_width": {"unit": "px", "size": 500}
}
```

#### 2. 背景相关
```json
{
  "background_background": "classic|gradient",
  "background_color": "#ffffff",
  "background_color_b": "#000000",
  "background_gradient_angle": {"unit": "deg", "size": 180},
  "background_image": {"url": "https://...", "id": ""},
  "background_position": "center center",
  "background_repeat": "no-repeat",
  "background_size": "cover"
}
```

#### 3. 边框相关
```json
{
  "border_border": "solid|none",
  "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1"},
  "border_color": "#000000",
  "border_radius": {"unit": "px", "top": "5", "right": "5", "bottom": "5", "left": "5"}
}
```

#### 4. 排版相关
```json
{
  "typography_typography": "custom",
  "typography_font_family": "Roboto|Arial|...",
  "typography_font_size": {"unit": "px", "size": 16},
  "typography_font_weight": "400|500|600|700",
  "typography_line_height": {"unit": "em", "size": 1.5}
}
```

### ⚠️ Settings参数限制：

1. **数值类型**
   - 数字值必须是字符串格式：`"16"` 而不是 `16`
   - 单位必须包含在对象中：
     ```json
     "font_size": {"unit": "px", "size": "16"}  // ✅
     ```

2. **颜色格式**
   - 使用十六进制格式：`"#ffffff"`
   - 或RGBA格式：`"rgba(255,255,255,1)"`

3. **响应式设置**
   - 桌面：直接设置
   - 平板：使用 `"_"` 前缀的响应式参数
   - 手机：使用 `"__"` 前缀的响应式参数
   ```json
   {
     "padding": {"unit": "px", "top": "20", ...},      // 桌面
     "_padding": {"unit": "px", "top": "15", ...},     // 平板
     "__padding": {"unit": "px", "top": "10", ...}     // 手机
   }
   ```

4. **不要创建自定义参数**
   - 只使用Elementor官方支持的参数名
   - 自定义参数会被忽略

---

## 🎨 常用Widget的Settings示例

### Heading Widget
```json
{
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "这里是标题文字",
    "header_size": "h1|h2|h3|h4|h5|h6|div",
    "align": "left|center|right",
    "title_color": "#333333",
    "typography_typography": "custom",
    "typography_font_size": {"unit": "px", "size": "48"},
    "typography_font_weight": "700"
  }
}
```

### Image Widget
```json
{
  "elType": "widget",
  "widgetType": "image",
  "settings": {
    "image": {"url": "https://example.com/image.jpg", "id": "", "alt": "描述文字", "source": "library"},
    "image_size": "full",
    "align": "center",
    "width": {"unit": "%", "size": 100}
  }
}
```

### Button Widget
```json
{
  "elType": "widget",
  "widgetType": "button",
  "settings": {
    "text": "点击这里",
    "link": {"url": "https://example.com", "is_external": true, "nofollow": false},
    "size": "md|sm|lg|xl",
    "button_text_color": "#ffffff",
    "background_color": "#007bff",
    "border_radius": {"unit": "px", "top": "5", "right": "5", "bottom": "5", "left": "5"},
    "align": "center"
  }
}
```

### Icon Box Widget
```json
{
  "elType": "widget",
  "widgetType": "icon-box",
  "settings": {
    "icon": "fas fa-star",
    "title_text": "图标标题",
    "description_text": "这里是描述文字",
    "position": "top",
    "content_alignment": "center",
    "icon_color": "#007bff",
    "title_color": "#333333"
  }
}
```

---

## 🚫 常见错误与限制

### ❌ 严重错误（会导致导入失败）：

1. **缺少必需字段**
   ```json
   // ❌ 错误 - 缺少id
   {
     "elType": "widget",
     "settings": {...}
   }

   // ✅ 正确
   {
     "id": "abc123",
     "elType": "widget",
     "settings": {...}
   }
   ```

2. **错误的元素嵌套**
   ```json
   // ❌ 错误 - Container下不能直接放Widget
   {
     "elType": "container",
     "elements": [
       {"elType": "widget", ...}
     ]
   }
   ```

3. **Widget有子元素**
   ```json
   // ❌ 错误 - Widget的elements不能有内容
   {
     "elType": "widget",
     "elements": [
       {"elType": "column", ...}
     ]
   }
   ```

4. **无效的Widget类型**
   ```json
   // ❌ 错误 - Widget类型不存在
   {
     "widgetType": "my-custom-widget"
   }

   // ✅ 正确 - 使用官方Widget
   {
     "widgetType": "heading"
   }
   ```

5. **版本号错误**
   ```json
   // ❌ 错误
   {"version": "0.3"}

   // ✅ 正确
   {"version": "0.4"}
   ```

### ⚠️ 警告错误（可能导致显示问题）：

1. **不支持的参数**
   - 会被忽略，但不会导致导入失败

2. **无效的图片URL**
   - 会显示破损图片图标

3. **颜色格式错误**
   - 会回退到默认颜色

---

## 🔧 响应式设计规则

### 断点标准：
- **桌面**: 默认（无前缀）
- **平板**: `_` 前缀，断点 1024px
- **手机**: `__` 前缀，断点 767px

### 响应式设置示例：
```json
{
  "padding": {"unit": "px", "top": "40", "right": "40", "bottom": "40", "left": "40"},
  "_padding": {"unit": "px", "top": "30", "right": "30", "bottom": "30", "left": "30"},
  "__padding": {"unit": "px", "top": "20", "right": "20", "bottom": "20", "left": "20"}
}
```

### 隐藏元素：
```json
{
  "_element_custom_width": {"unit": "px", "size": 0},
  "__position": "absolute",
  "__left": "-9999px"
}
```

---

## 📝 完整示例

### 简单的Hero区块示例（使用Container结构）：
```json
{
  "title": "Hero区块示例",
  "type": "page",
  "version": "0.4",
  "page_settings": [],
  "content": [
    {
      "id": "container-root-001",
      "elType": "container",
      "settings": {
        "content_width": "full",
        "background_background": "gradient",
        "background_color": "#007bff",
        "background_color_b": "#0056b3",
        "background_gradient_angle": {"unit": "deg", "size": 135},
        "padding": {"unit": "px", "top": "100", "right": "0", "bottom": "100", "left": "0"}
      },
      "elements": [
        {
          "id": "container-inner-001",
          "elType": "container",
          "settings": {
            "content_width": { "unit": "px", "size": 1200 }
          },
          "elements": [
            {
              "id": "widget-001",
              "elType": "widget",
              "widgetType": "heading",
              "settings": {
                "title": "欢迎来到我们的网站",
                "header_size": "h1",
                "align": "center",
                "title_color": "#ffffff",
                "typography_font_size": {"unit": "px", "size": "48"}
              },
              "elements": []
            },
            {
              "id": "widget-002",
              "elType": "widget",
              "widgetType": "text-editor",
              "settings": {
                "editor": "<p>这是一段描述文字，介绍您的产品或服务。</p>",
                "align": "center",
                "text_color": "#ffffff"
              },
              "elements": []
            },
            {
              "id": "widget-003",
              "elType": "widget",
              "widgetType": "button",
              "settings": {
                "text": "开始使用",
                "align": "center",
                "size": "lg",
                "button_text_color": "#ffffff",
                "background_color": "#28a745"
              },
              "elements": []
            }
          ]
        }
      ]
    }
  ]
}
```

---

## ✅ 生成检查清单

在生成Elementor JSON时，确保：

- [ ] version字段为"0.4"
- [ ] 所有元素有唯一ID
- [ ] elType值合法
- [ ] widgetType仅使用官方组件
- [ ] Widget的elements为空数组
- [ ] 嵌套结构正确（Container → Widget 或 Container → Container → Widget）
- [ ] Settings参数使用合法的Elementor参数名
- [ ] 数值类型使用字符串格式
- [ ] 颜色使用十六进制或RGBA格式
- [ ] 响应式设置使用正确的前缀

---

## 🎯 最佳实践

1. **ID生成**
   - 使用 `Date.now()` + 随机数
   - 或使用UUID生成器

2. **默认值**
   - 提供合理的默认样式
   - 颜色使用中性色调
   - 间距使用标准值

3. **内容占位**
   - 使用通用的占位文本
   - 图片使用占位服务（如placeholder.com）

4. **结构化**
   - 合理组织嵌套层级
   - 避免过深的嵌套
   - 保持代码可读性

5. **兼容性**
   - 优先使用Elementor Free组件
   - 如使用Pro组件，明确标注
   - 避免使用第三方插件组件

---

**版本**: 1.0
**最后更新**: 2026-02-03
**适用于**: Elementor 3.0+
