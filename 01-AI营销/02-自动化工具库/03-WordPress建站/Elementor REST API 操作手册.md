# Elementor REST API 操作手册

> 基于 goearthward.com（Elementor 3.34.0 + WoodMart 8.2.0）实战验证。
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

---

## 11. Elementor 模板（Templates）创建

> Elementor 模板存储为自定义文章类型 `elementor_library`，与 Page 共享同一套 `?context=edit` 机制。
> 已验证 goearthward.com 的 `/wp-json/wp/v2/elementor_library` 端点可用。

### Page vs Template 端点对比

| 维度 | Page | Template |
|------|------|----------|
| REST API 端点 | `/wp-json/wp/v2/pages` | `/wp-json/wp/v2/elementor_library` |
| `_elementor_template_type` | `wp-page` | `section` / `container` / `widget` / `page` 等 |
| 出现位置 | WordPress → Pages | Elementor → Templates → My Templates |
| 复用性 | 单页独占 | **全局可复用** |

### 创建模板完整流程

```
1. POST /wp-json/wp/v2/elementor_library           → 创建空白模板，获得 template ID
2. 生成 Elementor JSON（与 Page 完全相同的格式）      → Node.js 脚本生成
3. POST /wp-json/wp/v2/elementor_library/{id}?context=edit  → 注入数据
4. Elementor 编辑器 → Templates → My Templates 中可见
```

### 创建模板 API 示例

```javascript
// Step 1: 创建空白模板
const tpl = await apiRequest('/wp-json/wp/v2/elementor_library', 'POST', {
  title: 'Hero Section',
  status: 'publish',
  content: ''
});
const tplId = tpl.id;

// Step 2: 注入 Elementor 数据
await apiRequest('/wp-json/wp/v2/elementor_library/' + tplId + '?context=edit', 'POST', {
  title: 'Hero Section',
  status: 'publish',
  content: '',
  meta: {
    _elementor_data: JSON.stringify(sections),   // 与 Page 格式完全一致
    _elementor_edit_mode: 'builder',
    _elementor_template_type: 'section'           // 模板类型，见下表
  }
});
```

### 模板类型（`_elementor_template_type`）

| 值 | 含义 | 使用场景 |
|----|------|---------|
| `section` | 区块模板 | Hero、CTA、特性展示等可复用区块 |
| `container` | 容器模板 | 更小的布局单元 |
| `widget` | 全局 Widget | 统一的表单、按钮组等 |
| `page` | 页面模板 | 完整页面模板 |
| `header` | 页眉模板 | Theme Builder 通用页眉 |
| `footer` | 页脚模板 | Theme Builder 通用页脚 |
| `single` | 文章模板 | 文章详情页布局 |
| `archive` | 归档模板 | 分类/标签归档页布局 |

### 模板在页面中引用（3 种方式）

**方式 1：Elementor 编辑器内插入**
> 打开页面编辑 → 点「+」→ Templates → My Templates → 选择模板

**方式 2：Shortcode**
```
[elementor-template id="XXXX"]
```

**方式 3：API 注入页面时引用（适合自动化）**
```javascript
// 在页面的 _elementor_data 中直接引用模板 ID
// 页面会自动渲染该模板的内容
const pageData = [
  {
    elType: 'container',
    settings: { templateID: tplId },  // 引用已创建的模板
    elements: [],
    isInner: false
  }
];
```

### 踩坑提醒

| # | 坑 | 解决方案 |
|---|---|---------|
| 1 | 模板类型写错 | `section` 不是 `sections`，注意单数 |
| 2 | 模板不显示在列表中 | 确认 `status` 为 `publish`，不是 `draft` |
| 3 | 页面引用模板后编辑器报错 | 先确保模板本身可正常打开预览 |

---

## 12. 读取与更新已有页面

> 真实业务中，读取和修改已有页面比从零创建更常见。

### 读取页面 Elementor 数据

```bash
# 获取页面列表（找到目标页面 ID）
GET /wp-json/wp/v2/pages?per_page=100

# 读取单个页面的 Elementor 数据（必须加 ?context=edit）
GET /wp-json/wp/v2/pages/{id}?context=edit
```

返回的 `meta._elementor_data` 字段包含完整的 Elementor JSON。

### 更新已有页面

```bash
# 只更新内容，不改变页面 ID/URL
POST /wp-json/wp/v2/pages/{id}?context=edit
Body: {
  "meta": {
    "_elementor_data": "[修改后的 JSON]"
  }
}
```

### 常用操作场景

| 场景 | 方法 | 说明 |
|------|------|------|
| **读取竞品/参考页面** | `GET ...?context=edit` | 提取 JSON 作为新页面参考 |
| **修改某个 Section** | 读取 → 定位 section → 替换 → 写回 | 按 `elType` + `id` 定位 |
| **克隆页面** | 读取旧页面 JSON → POST 新页面 → 注入数据 | slug 必须不同 |
| **追加 Section** | 读取 → 在 JSON 数组末尾追加 → 写回 | 不要覆盖已有 sections |
| **替换 Section** | 读取 → 找到目标 section → 替换整个对象 → 写回 | 保持 id 不变或重新生成 |

### 克隆页面完整流程

```javascript
// 1. 读取源页面
const source = await apiRequest('/wp-json/wp/v2/pages/' + sourceId + '?context=edit', 'GET');
const elementorData = source.meta._elementor_data;

// 2. 创建新页面
const newPage = await apiRequest('/wp-json/wp/v2/pages', 'POST', {
  title: 'Cloned: ' + source.title.rendered,
  status: 'draft',
  slug: 'cloned-' + Date.now(),
  content: ''
});

// 3. 注入 Elementor 数据
await apiRequest('/wp-json/wp/v2/pages/' + newPage.id + '?context=edit', 'POST', {
  status: 'draft',
  content: '',
  meta: {
    _elementor_data: elementorData,
    _elementor_edit_mode: 'builder',
    _elementor_template_type: 'wp-page'
  }
});
```

### 注意事项

| 注意 | 说明 |
|------|------|
| 不要覆盖 slug | 更新内容时不要传 `slug` 字段，避免 URL 变化 |
| 不要覆盖 featured_media | 除非明确要改，否则不传 `featured_media` |
| 保留 SEO 字段 | `_yoast_wpseo_*` 等 meta 字段更新时要保留原值 |
| 响应式测试 | 更新后在 `/?page_id={id}&preview=true` 检查效果 |

---

## 13. 字体三端规范（电脑 / 平板 / 手机）

> 2026-06-21 about/home 重构踩坑后，用户确认的字体标准。**非固定**，按文字长短可微调，但这是 baseline。

| 元素 | 电脑 desktop | 平板 tablet | 手机 mobile |
|------|------|------|------|
| **H1**（Hero） | 50px | 45px | 40px |
| **H2**（section 主标题） | 35px | 30px | 25px |
| **H3**（section 子标题） | 22-25px | 22px | 20-22px |
| **H2 下的正文** text-editor | 20px | ≈20 | ≈20 |
| **H3 下的正文** text-editor | 16px | ≈16 | ≈16 |
| **base 下限** | ≥16 | ≥16 | ≥16 |

**关键**：heading 函数按 `header_size` 设字体——**H3 千万别设成 H2 的值（35）**（曾 S6/S7 的 6 个 H3 串成 35，前端像 H2）。textEditor 字体按"它在 H2 下还是 H3 下"定 20/16。

heading/textEditor 函数的 mobile 下限用 `Math.max(16, round(fs*系数))`，确保手机端不低于 16（曾 14×0.85=11，手机端灾难）。

## 14. 样式规范

| 项 | 规范 | 原因 |
|---|---|---|
| 圆形/圆角图 `border-radius` | **用 %**（圆形 50%） | px（如 150px）对大图不够圆；em 不必要；% 任意尺寸都圆 |
| heading advanced `margin` | **0**（别设 10） | 用户偏好，间距用 spacer/padding 控 |
| section `margin-top` | **-40px** | WoodMart 主题约定（抵消主题默认间距） |
| 多列布局 | 纯 Flexbox（`flex_direction:"row"` 无 structure） | 见 §3，REST 注入 structure 的 CSS 不生成 |
| container `scroll_y` | -80 | 主题默认 |
| 字体单位 | px（具体值）或主题 Global Fonts | 项目用具体 px baseline |

**绝对不要 REST 清 `_elementor_css` meta**——会让前端样式全丢变乱码，且 REST 不触发重生成，只能 Elementor 编辑器更新恢复。

## 15. 设计原则

1. **图文左右交替**：相邻叙事 section 方向交替（S2 图左文右 → S3 文左图右），打破单调。手机端都图上文下（`flex_direction_mobile:"column-reverse"`）。
2. **并列要点文字等长**：S6 4 承诺 / S7 4 场景 这类并列项的标题+描述长度必须接近，否则卡片高度参差难看。
3. **相邻 section 风格交替**：背景色/布局方向/结构上下交替（白→浅灰→白→深色→白→浅灰），避免连续同风格。
4. **图文比例按文字长短**：文字短→图 4:3，文字长→图 1:1（让图文左右等高平衡）。
5. **列表 vs 叙事**：要点列表（4 承诺/4 场景）用**紧凑网格 2×2 + 文字等长**，**不要图文交替**（会占近 4 屏太冗长）；叙事 section（品牌故事/工艺）才用图文交替。
6. **一个 textEditor 放多段**：textEditor 是富文本，一个 widget 内可多段 `<p>`（content 用 `段1</p><p>段2` 拼接），**不要每段单独做一个 textEditor widget**。
7. **缺图就生成/找，不要挪用**：A section 缺 1:1 图就 moleapi 生成或本地找，不要把 B section 的图挪过来（会破坏 B + 主题不符）。

## 16. 生成检查清单（.js 上传前必自检）

上传前拉生成结果（_data 或 JSON），逐项核对：

- [ ] 每个 heading 的 `header_size`（H1/H2/H3）**不串档**（H3 不能是 35=H2值）
- [ ] 每个 heading 三端字体值符合 §13 规范（统计 `h1/h2/h3 各自 desktop 值分布`，无串档）
- [ ] 所有字体三端都设且 ≥16（mobile 下限 16）
- [ ] 圆形/圆角图 `border-radius` 用 %
- [ ] 图文 section 方向交替 + mobile 图上文下（column-reverse）
- [ ] 并列要点（4 承诺/4 场景）文字长度接近
- [ ] 相邻 section 背景/布局风格交替
- [ ] section margin-top -40、heading margin 0
- [ ] 图文比例按内容（短 4:3 / 长 1:1）
- [ ] 多段文字合在 1 个 textEditor（非每段一个 widget）

## 17. WoodMart 主题补充（8.2.0 + Elementor 3.34.0）

- **Widget 策略**（§4）：Elementor 标准优先（heading/image/text-editor/button/spacer/image-box/icon-box），WoodMart 仅功能必需（`wd_products_widget`/`wd_products_tabs` 产品网格/标签）。**`wd_title` 不用**，用标准 `heading`。
- **Container**（§5）：顶层 `wd_section_stretch:"stretch"` + `scroll_y:-80`；`content_width` 顶层不设（boxed）/嵌套 `"full"`；嵌套必 `isInner:true`。
- **Page Title 区**：WoodMart 每个 page 顶部（导航下、Hero 上）有 Page Title section（标题+面包屑）。per-page 关闭：编辑页面 → WoodMart 设置 → Disable Page title（protected meta，REST 写不了）。全局关闭会影响 product/post/page 所有（主题设置），慎用。REST 改不了，只能编辑器设或 per-page CSS。
- **REST 改 _data 后前端不更新**：WoodMart+Elementor 缓存 CSS（post-XXXX.css），REST 改不重编译。解法：**WP 后台 → Elementor → 工具 → 「重新生成文件与数据」**（一次清所有 CSS 缓存），比每次编辑器 save 彻底。
- **REST 改 vs 编辑器 save 冲突**：用户在 Elementor 编辑器（旧 _data）点保存会**覆盖** REST 改动。REST 改后要让用户**重新加载编辑器**（关闭重开加载最新 _data）再保存。
