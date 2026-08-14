# Elementor MCP 生产 SOP（Woodmart 主题）

> 2026-07-21 v1.2（合并测试方案文档 + 删除旧文档后）。POC 已通过，page 56325 验证样本。
> **适用范围**：goearthward.com（Woodmart 主题）。通用化见 §10，产品化路线见 §13。

---

## 0. 文档关系

| 文档 | 角色 |
|---|---|
| **本文档** | **无 HTML 原型时的 Elementor page 生产 SOP**（增量构建 + 踩坑记录 + Pro widget + 产品化路线） |
| `HTML转Elementor混合流水线SOP.md` | **有 HTML 原型时的批量生产 SOP**（dudaster 转换 + globals 展开 + SVG/渐变注入 + 间距烘焙，主题无关，2026-08-14 在 evapcryst.com 验证） |
| `Gutenberg博客文章REST-API上传指南.md` | post 生产 SOP |
| ~~`Elementor REST API 操作手册.md`~~ | 已删除（MCP SOP 替代） |
| ~~`Elementor MCP 页面创建测试方案.md`~~ | 已删除（合并到 §13 附录） |

---

## 1. 已验证工作流（核心规则）

**唯一可靠路径：增量构建 + 字段 1:1 复刻**

```
create-page (draft)
  ↓
add-container (顶层 section 容器)
  ↓ update-container (补 settings)
  ↓
add-container (内层 wrapper 或子卡片)
  ↓
add-free-widget (heading / text-editor / image / button / icon-box / image-box / accordion)
  ↓ update-widget (微调)
  ↓
重复，逐 section 推进
```

### 1.1 三种工具对比（已实测）

| 工具 | 可靠性 | 适用场景 | 失败原因 |
|---|---|---|---|
| `build-page` | ⚠️ 中 | 简单 page（< 10 元素） | normalizer 只算 desktop 列宽，不生成响应式断点 |
| `add-container` + `add-free-widget` | ✅ 高 | **所有 page（推荐）** | AI 偷懒简化字段会丢响应式 |
| `apply-template` / `save-as-template` | ✅ 高 | 局部复用（不算生产） | 整页克隆不算"AI 生产" |

### 1.2 必须遵守的规则

1. **不用 `build-page` 做复杂 page**（响应式字段会丢）
2. **每个 `add-container` 都要传完整 settings**（不能只传 padding 单值）
3. **每个 row 子容器必须显式传 `width` + `width_tablet` + `width_mobile`**
4. **每个 section 顶层容器必须传 `wd_section_stretch: "stretch"`**（否则内容区域窄、卡片挤压）
5. **不用 `direction` / `justify` / `align` 简化字段名**（这些是 `add-flexbox` 的 params，`add-container` 必须用 `flex_direction` / `flex_justify_content` / `flex_align_items`）

---

## 2. Woodmart 专属字段（必须传）

> 这些字段不在 Elementor 标准 schema 里，是 Woodmart 主题注入的。**不传 = 视觉降级**。

| 字段 | 类型 | 作用 | 不传的后果 |
|---|---|---|---|
| `wd_section_stretch` | string `"stretch"` | 让 section 边到边全宽 | 内容居中 boxed ~1140px，卡片挤压、文案换行不一致 |
| `wd_title` | widget type | Woodmart 高级标题（支持 subtitle/highlighted text） | 用标准 `heading` 替代，失去副标题等装饰 |
| `wd_products_tabs` | widget type | Woodmart 产品 Tab 展示 | 用 `wc/v3` REST + 自定义模板替代 |
| `wd_product_categories` | widget type | Woodmart 产品分类 grid | 同上 |
| `wd__woodmart_title_off` | page meta（`_elementor_page_settings`）| 关闭默认 page title | 顶部出现冗余 title |

### 2.1 wd_section_stretch 必传场景

**所有 section 顶层容器都要传**（不只是 Hero）：

```json
{
  "wd_section_stretch": "stretch",
  "content_width": "full",
  ...
}
```

**例外**：如果你**故意**让某个 section 内容居中（如 CTA 内层 wrapper），不要在**内层**传 stretch——只在 section 顶层传。

---

## 3. Elementor 标准必传字段（容易丢，必须显式）

### 3.1 响应式断点字段（三档必须全传）

| 字段类型 | 字段名 | 默认值（不传时） | 必传值 |
|---|---|---|---|
| 宽度 | `width` | auto | `{unit:"%", size: <desktop_pct>}` |
| 宽度（tablet） | `width_tablet` | **继承 desktop** | `{unit:"%", size: <tablet_pct>}` |
| 宽度（mobile） | `width_mobile` | **继承 desktop** | `{unit:"%", size: 100}` |
| 内边距 | `padding` | 0 | `{unit, top, right, bottom, left, isLinked}` |
| 内边距（tablet/mobile） | `padding_tablet` / `padding_mobile` | **继承 desktop** | 同上结构 |
| 字体大小 | `typography_font_size` | 继承主题 | `{unit:"px", size: <px>}` |
| 字体大小（tablet/mobile） | `typography_font_size_tablet` / `_mobile` | **继承 desktop** | 同上结构 |

**典型值参考**（水晶项目实测）：

| Element | desktop | tablet | mobile |
|---|---|---|---|
| Hero H1 | 48px | 36px | 28px |
| Section H2 | 35px | 30px | 25px |
| Card H3 | 22px | 22px | 20px |
| Body text | 17px | 16px | 16px |
| Subtitle | 20px | 18px | 17px |
| Row 子容器 width（4 列） | 23% | 45% | 100% |
| Row 子容器 width（3 列） | 31% | 45% | 100% |
| Row 子容器 width（2 列） | 48% | 100% | 100% |

### 3.2 容器视觉字段（容易跳过）

| 字段 | 类型 | 必传值示例 |
|---|---|---|
| `background_background` | string | `"classic"`（必须先传才能用 background_color） |
| `background_color` | hex | `"#F8F5F0"` |
| `background_image` | object | `{"url": "...", "id": <attachment_id>}` |
| `background_size` | string | `"cover"` |
| `background_overlay_background` | string | `"classic"`（启用 overlay） |
| `background_overlay_color` | hex | `"#000000"` |
| `background_overlay_opacity` | object | `{unit:"px", size:0.7}` |
| `border_border` | string | `"solid"`（必须先传才能用 border_width/color） |
| `border_width` | object | `{unit:"px", top, right, bottom, left, isLinked:true}` |
| `border_color` | hex | `"#E0E0E0"` |
| `border_radius` | object | `{unit:"px", top, right, bottom, left, isLinked:true}` |
| `box_shadow_box_shadow_type` | string | `"yes"` |
| `box_shadow_box_shadow` | object | `{horizontal, vertical, blur, spread, color}` |

### 3.3 容器布局字段

| 字段 | 取值 | 备注 |
|---|---|---|
| `container_type` | `"flex"` / `"grid"` | flex 默认 |
| `flex_direction` | `"row"` / `"column"` | 不要用 `direction` |
| `flex_justify_content` | `"center"` / `"flex-start"` / `"space-between"` | 不要用 `justify` |
| `flex_align_items` | `"center"` / `"stretch"` / `"flex-start"` | 不要用 `align` |
| `flex_wrap` | `"wrap"` / `"nowrap"` | 多列必须 wrap |
| `flex_gap` | object | `{unit:"px", size, column, row, isLinked:true}` |
| `content_width` | `"boxed"` / `"full"` | row 容器建议 `"full"` |
| `margin` | object | `{unit, top, right, bottom, left, isLinked}` |
| `min_height` | object | `{unit:"px", size}` |

### 3.4 Widget 字段（必传）

| Widget | 必传字段 |
|---|---|
| heading | `title` / `header_size` / `align` / `title_color` / `typography_typography: "custom"` / `typography_font_size` 三档 |
| text-editor | `editor` (含 `<p>`) / `align` / `text_color` / `typography_font_size` 三档 |
| button | `text` / `link: {url}` / `size: "md"` / `align` |
| image | `image: {url, id}` / `image_size: "full"` / `align` / `width` / `image_border_radius` |
| icon-box | `selected_icon: {value, library}` / `primary_color` / `title_text` / `description_text` / `text_align` / `icon_size` / `__globals__: {title_color}` |
| image-box | `image: {url}` / `title_text` / `description_text` / `link: {url}` / `image_border_radius` / `hover_animation` |
| accordion | `tabs: [{tab_title, tab_content}]` / `border_border: "solid"` / `border_width` / `border_color` |

---

## 4. Section 全宽规则

**所有 section 顶层容器**（直接挂在 page 根下的 container）都要传：

```json
{
  "wd_section_stretch": "stretch",
  "content_width": "full"
}
```

**实际效果对比**（信任栏 4 个 23% 卡片）：
- 不传 stretch：内容宽度 boxed 1140px，每个 23% 卡片 ~262px，文案挤、行数不一致、卡片不等高
- 传 stretch：viewport 全宽（如 1920px），每个 23% 卡片 ~441px，文案宽松、卡片等高

**例外**：内层 wrapper container（不是 section 顶层）不要传 stretch，否则会破坏嵌套布局。

---

## 5. 工具选择决策树

```
需要创建 page？
│
├─ 简单 page（< 10 元素，无响应式多列）
│   └─ build-page 一次性创建 OK
│
└─ 复杂 page（含响应式多列、卡片 grid、嵌套布局）
    │
    ├─ 第 1 步：create-page 创建空壳
    │
    ├─ 第 2 步：逐 section 增量构建
    │   │
    │   ├─ add-container（section 顶层，传 wd_section_stretch）
    │   ├─ add-container（内层 wrapper）
    │   ├─ add-free-widget × N
    │   └─ 验证：get-element-settings 抽查关键字段
    │
    └─ 第 3 步：用户视觉验收 → 单点修复
```

---

## 6. 已知坑列表（实测踩过的）

| # | 现象 | 根因 | 解决 |
|---|---|---|---|
| 1 | `add-flexbox` 在 create-page 空页上失败（返回 element_id 但不持久化） | create-page 没初始化 `_elementor_data` | 用 `build-page` 创建初始结构，或 `add-container`（不要用 add-flexbox） |
| 2 | `build-page` 4 个 icon-box 不分列 | 用了 `direction` 而不是 `flex_direction` | add-container 必须用 `flex_direction` / `flex_justify_content` / `flex_align_items` |
| 3 | `build-page` 卡片无立体感 | `box_shadow` 字段没传 | 显式传 `box_shadow_box_shadow_type: "yes"` + 完整 shadow 对象 |
| 4 | `build-page` mobile 不堆叠成 1 列 | normalizer 只算 desktop width，不生成 width_tablet/mobile | 显式传 `width` / `width_tablet` / `width_mobile` 三档 |
| 5 | 4 个卡片不等高（Prepared With Care 比其他大） | section 没 `wd_section_stretch`，boxed 模式下 23% 卡片太窄，文案换行不一致 | section 顶层传 `wd_section_stretch: "stretch"` |
| 6 | Hero 不全宽 | 同上 | Hero 顶层传 `wd_section_stretch: "stretch"` + `content_width: "full"` |
| 7 | page 顶部出现冗余 title | 默认 WordPress page title 显示 | 设 `_elementor_page_settings: {wd__woodmart_title_off: "1"}` |
| 8 | image-box link 不工作 | 传成字符串 `"url"` | 必须传 object `{url: "...", is_external: "", nofollow: ""}` |
| 9 | border / box_shadow / background 不生效 | 没先传 `border_border: "solid"` / `box_shadow_box_shadow_type: "yes"` / `background_background: "classic"` 触发字段 | 这些 "type" 字段是 Elementor 的开关，必须先传 |
| 10 | `apply-template` 整页克隆结构 100% 一致但用户否定 | 克隆不算 AI 生产 | 仅用于"模板库"场景，不作为生产路径 |
| **11** | **batch-update 加 animation 后前端元素消失** | **EMCP fallback 删了 CSS 缓存（meta + 物理文件），但 LiteSpeed Cache 缓存了旧 HTML，Elementor 没机会重生 CSS → animation opacity:0 卡住** | **清缓存（Purge All）让 Elementor 下次访问时重生 CSS；或不用 MCP 加 animation，改用 add-custom-css** |
| **12** | **EMCP 后台开关变更后 MCP 工具不可用** | **开关变更不触发 MCP 客户端重连** | **重启 Claude Code / Cursor** |
| **13** | **REST API / MCP update-post 不触发 Elementor CSS 重生** | **WordPress save_post hook ≠ Elementor CSS 重生。CSS 重生需要 Elementor 的 `CSS_File::update_file()` 方法，只有编辑器保存或 WP-CLI 才调用** | **更新 post meta 不够；必须走 Elementor 内部保存流程或清缓存** |
| **14** | **EMCP CSS 重生机制（代码级分析）** | **EMCP 有两层：1) 优先 `Document::save()`（触发 CSS 重生） 2) Fallback：直接写 meta + 删 CSS 文件（让 Elementor 下次访问重生）。但页面缓存（LiteSpeed/Cloudflare）会阻止"下次访问重生"** | **见坑 #11 解决方案** |

### CSS 重生问题总结与产品化修复

> 从 EMCP 源码 `class-elementor-data.php` line 185-280 分析得出。

**当前最佳实践（使用 EMCP Free 时）**：
1. 不用 MCP 加 animation 字段（用 `add-custom-css` 代替）
2. 每次完成 page 后在 Elementor 编辑器手动保存一次
3. 如果 CSS 丢了（前端空白）：清缓存 → Elementor 自动重生

**产品化时根治方案（fork EMCP 加 5 行 PHP）**：

```php
// 在 EMCP 的 save_page_data() fallback 路径加：
if ( class_exists( '\Elementor\Core\Files\CSS\Post' ) ) {
    $css_file = new \Elementor\Core\Files\CSS\Post( $post_id );
    $css_file->update_file();  // 直接重生 CSS，不等下次访问
}
do_action( 'litespeed_purge_post', $post_id );     // 清 LiteSpeed
do_action( 'rocket_clean_post', $post_id );          // 清 WP Rocket
```

**效果**：任何 MCP 操作后 CSS 自动正确，零用户配置，零 WP-CLI 依赖。这是 vs msrbuilds 的**核心差异化卖点**。

---

## 7. 快速生产模板（9 个标准 section）

### 7.1 Hero（全宽 + 背景图 + overlay + 双 CTA）

```json
顶层 container settings:
{
  "wd_section_stretch": "stretch",
  "content_width": "full",
  "flex_direction": "column",
  "flex_align_items": "center",
  "padding": {top:130, right:0, bottom:130, left:0,
    padding_tablet:{top:100,...}, padding_mobile:{top:80,...}},
  "background_background": "classic",
  "background_image": {url, id},
  "background_size": "cover",
  "background_overlay_background": "classic",
  "background_overlay_color": "#4A4A4A"
}
```

### 7.2 信任栏（4 卡片 grid）

```
顶层 (米色 #F8F5F0, wd_section_stretch, flex_row, gap:20)
  └─ 子容器 × 4 (width:23%/45%/100%, 白色, 圆角:20, 阴影, padding:20)
       └─ icon-box (绿色图标, 居中)
```

### 7.3 意图卡 grid（3 列 image-box）

```
顶层 (column, padding:80, gap:15)
  ├─ heading + text-editor
  └─ row (flex_wrap, gap:5)
       └─ 子容器 × N (width:31%/45%/100%)
            └─ image-box (圆角:5, hover:pulse-shrink)
```

### 7.4 Why Earthward（图文不对称）

```
顶层 (row, padding:80, gap:40, align:center)
  ├─ 左容器 (width:45%/100%/100%)
  │    └─ image (圆角:12)
  └─ 右容器 (width:50%/100%/100%, column, gap:15)
       ├─ heading
       ├─ text-editor
       └─ row (2 个 button)
```

### 7.5 Use cases（3 圆形图卡片）

```
顶层 (灰色 #FAFAFA, column, padding:80)
  ├─ heading + text-editor
  └─ row (flex_wrap, gap:20)
       └─ 子容器 × 3 (column, align:center, width:31%/45%/100%)
            ├─ image (圆形 border_radius:50%)
            ├─ heading (h3)
            ├─ text-editor
            └─ button
```

### 7.6 FAQ（accordion）

```
顶层 (column, padding:80, gap:30)
  ├─ heading
  ├─ text-editor
  └─ accordion (border:solid, border_color:#E0E0E0, tabs:[...])
```

### 7.7 CTA（背景图 + 黑色 overlay）

```
顶层 (wd_section_stretch, column, padding:80, bg_image, overlay:#000000 opacity:0.7)
  ├─ heading (白色)
  ├─ text-editor (灰色 #CCCCCC)
  └─ button
```

---

## 8. 生产流程示例（含 7 section 的完整 page）

参考 `Home Clone - MCP Rebuild`（page 56325），共 64 元素 / 7 section / max_depth 4 / warnings=[]。

**生成步骤**（约 30 个 MCP 调用）：
1. `create-page` 1 次
2. Hero section：1 add-container + 1 add-container（inner）+ 2 add-widget（heading + text-editor）+ 1 add-container（button row）+ 2 add-widget = 7 调用
3. 信任栏：1 add-container + 4 add-container（子卡片）+ 4 add-widget = 9 调用
4. 意图卡：1 add-container + 1 add-container（标题栏）+ 2 add-widget + 1 add-container（row）+ 3 add-container + 3 add-widget = 11 调用
5. Why：1 add-container + 2 add-container + 3 add-widget + 1 add-container + 2 add-widget = 9 调用
6. Use cases：1 add-container + 1 add-widget + 1 add-container + 3 add-container + 12 add-widget = 18 调用
7. FAQ：1 add-container + 3 add-widget = 4 调用
8. CTA：1 add-container + 3 add-widget = 4 调用

**总耗时**：~5-10 分钟（含 AI 思考时间）

---

## 9. 验收清单

每个 page 完成后必须验收：

- [ ] **结构完整**：所有 section 元素数符合预期（用 `get-page-snapshot` 检查）
- [ ] **响应式三档**：随机抽 3 个元素用 `get-element-settings` 检查 width_tablet / width_mobile 是否存在
- [ ] **Woodmart 字段**：所有 section 顶层都有 `wd_section_stretch: "stretch"`
- [ ] **CSS 生成**：`warnings` 字段为 `[]`，前端预览样式正常
- [ ] **移动端**：切换响应式视图，4 列变 1 列、3 列变 1 列正常
- [ ] **跨设备一致性**：desktop / tablet / mobile 视觉合理

---

## 10. 通用化路线（后期考虑）

> 目前 SOP 强依赖 Woodmart。未来产品化时需要解决：

| Woodmart 依赖点 | 通用化方案 |
|---|---|
| `wd_section_stretch` | 用 Elementor 标准 `page_template: elementor_header_footer` 或 `full-width` page template |
| `wd_title` widget | 用标准 `heading` widget + 自定义副标题 text-editor |
| `wd_products_tabs` | 自研 widget 包装 `wc/v3` REST |
| `wd_product_categories` | 同上 |
| `wd__woodmart_title_off` page meta | 用标准 `elementor_canvas` page template |

**产品化时机的判断**：当 §11.2 P0（行业模板库）已经覆盖 80% 常用 section 类型时，再考虑通用化。

---

## 11. 修订记录

- 2026-07-20：v1.0 首版，基于 page 56325 验证结果
- 2026-07-21：v1.1 更新
  - 新增坑 #11-14（batch-update animation / EMCP 开关重连 / Elementor 4.x Regenerate CSS 缺失 / _elementor_css meta 失效）
  - §7 从 7 section 扩展到 9 section（新增 Testimonial Carousel + Contact Form）
  - 新增 §12 Pro widget 使用经验（3 个已验证）
  - page 56325 最终成果：72 元素 / 9 section / 3 个 Pro widget / 前端渲染完美
- 2026-07-21：v1.2 简化合并
  - 删除 `Elementor REST API 操作手册.md`（page 生产旧路径，已被 MCP 完全替代）
  - 删除 `Elementor MCP 页面创建测试方案.md`（POC 历史文档，有用内容合并到 §13）
  - 新增 §13 附录（POC 测试结论 + 产品化路线 + 引用来源）
  - 目录从 6 文档简化到 4 文档（删除 2 个 Elementor page 生产冗余文档）

---

## 12. Pro widget 使用经验（已验证）

> 前提：EMCP Tools 后台 → Tools → **Add Pro Widget** 开关 ON，且重启 MCP 客户端。
> 工具：`emcp-tools-add-pro-widget`（不是 `add-free-widget`）。

### 12.1 已验证可用的 Pro widget（page 56325 实测）

| Widget | 用途 | 关键 settings | CSS 风险 |
|---|---|---|---|
| `animated-headline` | Hero 标题高亮动画 | `headline_style: "highlighted"` / `before_text` / `highlighted_text` / `marker: "underline"` / `highlight_color` | ✅ 无（不触发 CSS 重生问题） |
| `testimonial-carousel` | 客户评价轮播 | `slides: [{_id, content, name, title}]` / `slides_per_view` 三档 / `autoplay` / `space_between` / `slide_background_color` | ✅ 无 |
| `form` | 联系表单 | `form_fields: [{_id, field_type, field_label, placeholder, required, width}]` / `submit_actions: ["email"]` / `email_to` / `button_background_color` | ✅ 无 |

### 12.2 调用方式

```python
# 关键区别：用 add-pro-widget，不是 add-free-widget
emcp-tools-add-pro-widget(
    post_id=N,
    parent_id="container_id",
    widget_type="testimonial-carousel",
    settings={...}
)
```

**用 `add-free-widget` 传 Pro widget_type 会报错**："That is a Pro widget — use add-pro-widget"。

### 12.3 Pro widget 注意事项

1. **不要在 Pro widget 上加 `animation` 字段**（会触发坑 #11 的 CSS 问题）
2. **form widget 的 `email_to` 必须是站点域名邮箱**（避免被标记为 spam）
3. **testimonial-carousel 的 `slides` 数组每项必须有 `_id`**（否则 Elementor repeater 不识别）
4. **animated-headline 的 `tag` 默认是 div**——如果要 SEO 友好，显式传 `tag: "h1"`（但 page-snapshot 的 H1 检测可能不识别，可忽略 warnings）

### 12.4 未测试但理论上可用的 Pro widget（30 个 catalog）

参考 `list-widgets(tier="pro")` 完整清单（flip-box / price-table / portfolio / loop-grid / media-carousel / nav-menu / search / lottie / hotspot / off-canvas 等），按需调用 `add-pro-widget`。

---

## 13. 附录：POC 测试结论与产品化路线

> 从测试方案文档合并（2026-07-21）。POC 已通过，page 56325 是验证样本。

### 13.1 POC 测试结论

| 用例 | 结果 | 关键发现 |
|---|---|---|
| B1 简单 page | ✅ 通过 | MCP 原子操作可靠 |
| B2 build-page 复刻 home | ❌ 失败 | AI 简化 settings 导致响应式字段丢失（不是工具限制，是 AI 实现问题） |
| B4 apply-template | ✅ 通过 | 100% 保真，但克隆不算生产 |
| **56325 增量构建（最终路径）** | ✅ **完美** | **add-container + add-free-widget + 严格 1:1 字段 = 可靠的 AI 生产路径** |

**核心结论**：增量构建（逐 section add-container + 严格字段传递）是唯一可靠的 AI 生产路径。不用 build-page（字段会被 normalizer 简化），不用 apply-template（克隆不算生产）。

### 13.2 fork 路线选择

| 方案 | 合法性 | 工作量 | 风险 |
|---|---|---|---|
| **fork Free（GPL-2.0）+ 自写 Pro overlay** | ✅ 合法 | 中 | 跟随上游同步 |
| 复用 msrbuilds Pro 私有代码 | ❌ 违反版权 | — | 法律 + 技术（Freemius）双重风险 |
| 完全自研，不 fork | ✅ 合法 | 高 | 失去 Free 现成的 120+ 工具 |

**选择 fork Free + 自写 Pro overlay**。

### 13.3 Pro 功能优先级（修正版）

> 基于测试方案 v1（"模板化生产闭环"）修正。56325 成功证明增量构建可行，所以 P0 从"模板库"调整为"工具链优化 + 行业预设"。

| 优先级 | 功能 | 说明 |
|---|---|---|
| **P0** | **行业预设 settings 库** | 把水晶 / SEO / 塔罗等垂直领域的高质量 section 的 settings JSON 预设存到插件。AI 引用预设 build-page，不需每次手写字段 |
| **P0** | **增量构建工作流优化** | 基于本文档 SOP 的可靠路径，封装为"一键生产 page" ability |
| P1 | Theme Builder | ~3000 行 PHP，参考 msrbuilds 公开代码 |
| P1 | WooCommerce 集成 | ~600 行 PHP，包装 `wc/v3` |
| P2 | SEO & a11y 审计 | ~2500 行，完全自研 |
| P2 | Popup Builder | 调 Elementor Pro 或自研兜底 |
| P3（跳过） | AI Widget Builder / AI Chat / Agent Skills | 高投入低差异化 |

### 13.4 许可证 & 商业化

- License 系统：[License Manager for WooCommerce](https://wordpress.org/plugins/license-manager-for-woocommerce/)（免费）或自写
- 更新通道：参考 Free 版 `class-github-updater.php`
- 定价：参照 msrbuilds $29.99/年，中文市场 ¥199-299/年

### 13.5 差异化策略

1. **中文市场**：i18n + 国内 AI 模型（智谱 / 通义 / DeepSeek）+ 国内支付
2. **行业方案**：水晶/塔罗/SEO 站群 prebuilt presets
3. **Elementor 4.0 atomic**：深耕 msrbuilds 未覆盖的 atomic widget

### 13.6 启动条件

POC 已通过（2026-07-21），以下条件满足：
- [x] 增量构建路径在 9 section / 72 元素 / 3 Pro widget page 上验证成功
- [x] CSS 自动生成正常（Pro widget 不触发坑 #11）
- [ ] 已 fork Free 仓库，本地能编译运行（待执行）

**前置任务**（启动时执行）：
1. 申请新 GitHub 组织
2. Fork `msrbuilds/elementor-mcp`，改 plugin slug
3. 移除 Freemius SDK，改自写 license
4. 按 P0 优先级实现功能

### 13.7 引用来源

**官方文档**：
- [WordPress MCP Adapter](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/)
- [Elementor 数据结构](https://developers.elementor.com/docs/data-structure/)

**GitHub 项目**：
- [msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp) — 当前使用
- [wordpress/mcp-adapter](https://github.com/wordpress/mcp-adapter) — 官方（msrbuilds 已打包）
- [bvisible/elementor-mcp-api](https://github.com/bvisible/elementor-mcp-api) — 备选

**行业分析**：
- [InstaWP: Best WordPress MCP Servers](https://instawp.com/best-wordpress-mcp-servers-compared/)
