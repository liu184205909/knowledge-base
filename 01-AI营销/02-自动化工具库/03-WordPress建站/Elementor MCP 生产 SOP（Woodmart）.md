# Elementor MCP 生产 SOP（Woodmart 主题）

> 2026-07-20 验证通过（page 56325）。本 SOP 记录从零生产 Elementor page 的可靠路径、必传字段、Woodmart 专属规则。后续生产以此为准。
> **适用范围**：goearthward.com（Woodmart 主题）。通用化（不依赖 Woodmart）见 §10。

---

## 0. 文档关系

| 文档 | 角色 |
|---|---|
| `Elementor MCP 页面创建测试方案.md` | 测试结论 + POC 历史 |
| **本文档** | **生产 SOP**（已验证可靠路径） |
| `Elementor REST API 操作手册.md` | 旧路径（已弃用，保留备查） |

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

---

## 7. 快速生产模板（7 个标准 section）

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
