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

**所有 section 顶层容器都要传**（不只是 Hero）。`wd_section_stretch` 控制的是**背景全宽**；`content_width` 按内容需求二选一（cushionmill 2026-09-01 用户裁定）：

| 场景 | content_width | 说明 |
|---|---|---|
| **长文档内容页（品类页等，默认）** | `"boxed"` | 背景全宽、内容居中约束——一层容器完成，无需内层 wrap 容器。**内容宽度由主题全局设置决定（如 1120/1200），不在页面 JSON 里写死** |
| 背景图/装饰铺满型 hero | `"full"` | 内容真铺满（水晶站用法） |

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

### 3.1b section padding 三档 + hero 负 margin 铁律（2026-09-01 cushionmill 定案）

**大 container（section 顶层容器）padding 统一三档**（上下值；左右 0——内容宽由 boxed 界定）：

| 档位 | padding |
|---|---|
| desktop | `{"unit":"px","top":"80","right":"10","bottom":"80","left":"10","isLinked":false}` |
| tablet | `{"unit":"px","top":"60","right":"10","bottom":"60","left":"10","isLinked":false}` |
| mobile | `{"unit":"px","top":"40","right":"10","bottom":"40","left":"10","isLinked":false}` |

**hero 例外（铁律，2026-09-01 用户裁定）**：hero section 设 `margin: {"unit":"px","top":"-40","right":"0","bottom":"0","left":"0","isLinked":false}` 上拉贴 header（消除页面顶部空隙）。**负 margin 只有 hero 生效，其它任何 section/容器禁用**。

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
| **15** | **Code Snippets REST PUT 更新会静默失活**：PUT 任意字段（含传 `active:true`）返回 200 但 snippet 变 `active:false`；带 PHP code_error 的 snippet 也被强制失活。曾致 v2 设计系统 CSS 全住在失活 snippet 里——页面样式"反复修复永不生效"的总根源（cushionmill 2026-09-01 实锤，38/9/30/59 号连环踩） | Code Snippets REST API 的 PUT 不处理 active 字段 | **激活唯一路径 = 删旧 + POST 新建**（POST 的 active:true 可靠）；改内容也走删旧重建，用完即删 |
| **16** | **wp-admin 表单通道（插件上传等）App Password 登不进**：App Password 只覆盖 REST/XMLRPC 认证，不创建浏览器 cookie 登录态，playwright 模拟表单上传必失败 | 认证体系差异 | 文件类部署（插件 assets 更新）走 **Code Snippets 一次性 PHP**：POST 新建 active snippet，`file_put_contents` base64 载荷直写目标文件，前台 GET 触发执行，验证后 DELETE（cushionmill 工具 v1.9.53+ 部署通道） |

| **17** | **CF 对同 URL 的 CSS/JS 缓存 7 天：内容变更不 bump 版本 = 用户永远看旧文件**（cushionmill 工具 v1.9.52 部署后同 URL 再改内容，cf-cache HIT 拦截） | `?ver=` 参数不变则 URL 不变，CF 按旧 URL 回源缓存 | **文件内容任何变更必须 bump 版本参数换 URL**（插件=CD_VERSION+Plugin Version 双处；CSS/JS 文件=改名或加查询参数） |
| **18** | **TB conditions 格式陷阱**：`singular/post`（无 include/ 前缀）被 parse_condition 解析为 exclude 而**静默不接管**（页面继续走主题默认模板）；且 conditions 写入后必须调 `Conditions_Manager->save_conditions()` 触发缓存重建（get_cache() 只是内存态，"缓存空"是伪信号） | Elementor 条件解析首段语义 | 条件一律写 **`include/singular/post`** 完整格式；写完走 save_conditions 管线（cushionmill TB 32823 实锤，evapcryst 生产站 meta 对照证实） |
| **19** | **TB 接管后 WoodMart 页头残留**（大图+分类+双 H1+meta）：TB 只接管 body 内容区，主题 single 页头照出 | 主题与 TB 的分工边界 | snippet 挂 `template_redirect` 时机 filter `woodmart_option`（single post 时 single_post_design=default + page_title=false）——filter 不能全局挂（早期调用污染主查询）；另留 CSS `.single-post .wd-page-title{display:none}` 双保险（cushionmill 32823） |
| **20** | **html_block（WoodMart HTML Block）承载 Elementor 组件的可行性**：menu 引用的 mega block 若要组件化，需 block 可被 Elementor 编辑且前台 the_content 渲染走 Elementor 管线——预研先行，不可行则列表语义用 Elementor Template 承载 | WoodMart block 与 Elementor 文档上下文差异 | 组件化 mega 前先拿一个 block 试验 Elementor 化渲染（cushionmill 29197-29201 组件化工程 2026-09-02） |
| **21** | **`update_post_meta` 写 `_elementor_data` 必须用 `wp_slash()` 包裹**：裸写（哪怕 base64 解码后是合法 JSON）会被 WP `update_metadata` 内部 `wp_unslash` 剥掉 JSON 的 `\"` 转义 → data 损坏 → Document 渲染静默崩（含动态标签/嵌套引号的 section 整页空白，无引号的简单组件反而正常，极具迷惑性）。主会话与 agent 同日各踩一次 | WP core 对 meta_value 统一 `wp_unslash`（anti-magic-quotes） | **`update_post_meta($id,'_elementor_data', wp_slash(base64_decode($b64)))`**；写后读回 `json_decode` 验证（cushionmill 2026-09-03 archive 模板事故根因） |
| **22** | **`DELETE /wp-json/elementor/v1/cache` 会杀死 Theme Builder 接管**：该端点=Files_Manager::clear_cache()，删全站 `_elementor_css`/`_elementor_document_cache`/assets meta + frontend option；single 模板能 lazy 重建，**archive 模板可能不回**（cushionmill 34946 全绿模板被此操作打死，重建 34948 才恢复） | clear_cache 的删除面远超"CSS 缓存"，TB location 依赖的文档缓存被清后部分场景不自愈 | **禁用该端点**；触发 CSS 重编译用单文件 API `\Elementor\Core\Files\CSS\Post::create($id)->delete()+update_file()` 或 LiteSpeed purge 头（`GET 页面 + X-LiteSpeed-Purge: public`） |
| **23** | **`_elementor_page_settings` 必须存 PHP array**：存 JSON 字符串 → `Document::get_data()→sanitize_settings()` TypeError，连环引发 CSS 生成 fatal、conditions REST 500、**前台接管后渲染空白**（Elementor 4.2.4 实测） | Elementor 期望 meta 反序列化后即 array | 写入时传 PHP array 字面量；对照 known-good 模板（get_post_meta 单值读回 `gettype()` 必须是 array） |
| **24** | **`save_conditions()` 参数必须是嵌套三元组**：传 `['include/archive/category']`（斜杠字符串）报 `Cannot unset string offsets`；传对格式但写完不生效时，检查 option `elementor_pro_theme_builder_conditions` 树（手工 update_option 写树是有效的兜底通道，但**先清掉已删模板的死 id 条目**——死引用会毒死整个 location 分支） | Pro 4.x conditions 数据结构为元素级数组 | `save_conditions($doc, [['include','archive','category']])`；option 树结构 `['archive'=>['模板id'=>['include/archive/category']], 'single'=>[...]]` |
| **25** | **动态标签参数名先查源码禁猜**：archive-title 去 "Category:" 前缀的参数是 `include_context`（switcher，'no'=去前缀），不是 include_type；猜错参数名+坑 #21 叠加会表现为"tag 渲染空"，误导排查方向 | Pro 动态标签控件名无外部文档 | grep `wp-content/plugins/elementor-pro/modules/dynamic-tags/tags/` 读 tag 类 `register_controls()`；tag settings 写在 `[elementor-tag id=\"\" name=\"archive-title\" settings=\"%7B%22include_context%22%3A%22no%22%7D\"]`（URL 编码 JSON） |
| **26** | **Code Snippets REST 的 `?status=trash` 过滤不生效（返回全部）**：批量清 trash 会误删 active snippet 打成失活；且 DELETE ?force=1 第一次 200 只是进 trash，第二次才 204 真删；新建 snippet 的 add_action 钩子有对象缓存时序（时灵时不灵），顶层代码（激活即执行）可靠、挂钩代码不可靠 | 插件 REST 实现缺陷 + 对象缓存 | 批量操作前逐条核 active；挂钩类逻辑走 **mu-plugin**（file_put_contents 写入，每请求必加载必执行，用完 unlink）；顶层一次性代码走 Code Snippets POST |
| **27** | **elementor_library 模板数据可经 WP REST 原生直写**（cushionmill 2026-09-04 实测）：`GET/POST /wp-json/wp/v2/elementor_library/{id}?context=edit` 的 `meta._elementor_data` 可读可写，一次写入读回校验即过——比 Code Snippets 落盘通道干净（无临时 snippet 残留）。同期发现服务器安全层（污点分析式）开始**静默拦截**"读请求/文件数据 + 写 _elementor_data"组合的 snippet 代码（code 存储完好但不执行），Code Snippets 写模板通道不可全信 | REST meta 白名单 + 主机安全层收紧 | elementor_library 类型（TB 模板）优先走 REST 直写；普通 page 的 _elementor_data 仍走 Code Snippets wp_slash 通道（坑 #21），被拦截时降级 REST 试 meta 暴露 |
| **28** | **Elementor 容器移动端隐藏的原生键是 `hide_mobile: "hidden-mobile"`**（不是 hidden_mobile:'yes'——那是 3.4 前废弃机制，全库 grep 不到）：`add_hidden_device_controls()` 动态拼 `hide_{device}`，return_value 为 `hidden-{device}`，前端 CSS `.elementor-hidden-mobile` 生效 | 4.x 控件命名 | 组件 settings 加 `"hide_mobile": "hidden-mobile"`；tablet 同理 `hide_tablet`；证据链=插件源码 element-base.php + frontend.min.css + 站内用例（cushionmill TB 32823 右栏移动端隐藏 2026-09-04） |
| **29** | **LiteSpeed purge 请求头在新服务器无效**（cushionmill 正式域 2026-09-04 实测）：`X-LiteSpeed-Purge: public`/tag/no-cache 全部不触发清除——页面缓存条目在 `/home/{user}/lscache`，服务器级 purge 配置未启用。曾造成全天多次"改了没生效/数据陈旧"假信号 | 服务器 purge 通道未启用，头被静默忽略 | **线上验证一律带随机 query 参数绕缓存**（且部分配置忽略 query——最可靠是 URL 加随机参数+对照无参数版）；确需清缓存走 Code Snippets 顶层清 lscache 条目或等 TTL；CF 侧 asset 另有 4h TTL |
| **30** | **前台渲染真源是 `_elementor_element_cache`（Elementor 4.2.4）**：只改 `_elementor_data` 前台输出不变——element cache postmeta 缓存了渲染产物，写回通道必须连带删除该页的 element cache（delete_post_meta 或清该 key）前台才更新。**样式类改动（背景/边框等）还多一层：该文档的 post CSS 文件必须重建**（`\Elementor\Core\Files\CSS\Post::create($id)->delete()+update_file()`），否则 HTML 结构更新而 CSS 规则缺（cushionmill shop hero 背景 2026-09-14 实证：data+cache 都对了 bg 仍 none，重建 CSS 才出）。与坑 #21（wp_unslash）#29（lscache）并列为"改了前台不变"四大根因 | Elementor 4.x 渲染层缓存机制 | 批量写 _elementor_data 的固定动作链：`update_post_meta(wp_slash(base64_decode()))` → **删该页 _elementor_element_cache** → 涉及样式再重建 Post CSS → 清 lscache 条目 → 带随机 query 前台验证 |
| **31** | **Elementor Conditions_Manager::$location_cache 全局中毒**：早期某次调用把空结果毒进静态 location 缓存后，template_include 永远命中污染值——**任何新建 TB 模板都不接管**（旧模板能用纯属树里旧数据侥幸）。修复=mu-plugin 在 template_include 优先级 9 调 `Conditions_Manager->clear_location_cache()`（cushionmill `mu-plugins/cm-fix-tb-location-cache.php`，**不可删**）。另：wp_unslash 损坏的历史模板副本会与好模板同条件竞争劫持页面（34947/34949 三胞胎事件）——建新 TB 后必须核对 conditions 树无重复/死引用 | Elementor Pro 静态缓存无失效机制 | 新建 TB 模板不接管时先查 location_cache；conditions 树保持"每 location 一个活模板"；Posts 皮肤控件写值带 `cards_` 前缀（如 cards_posts_per_page，注册名无前缀读取名有前缀——skin get_control_id 机制） |
| **32** | **PHP 字面量含非 ASCII 字符经 Code Snippets 通道会静默损坏**（POÄNG 写进 snippet code 后执行时变坏串，str_replace 空转/写入失败两次实锤）——与 GBK/shell 转义坑同族 | snippet 存储层编码 | 需要非 ASCII 字面量时：PHP 侧用 chr(0xC3).chr(0x84) 构造字节，或**替换逻辑放 Python 侧**（PHP 只做 base64 读写回）；snippet 返回值必须用独立 GET 复查 DB 实态（fixed 计数≠落库） |

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
