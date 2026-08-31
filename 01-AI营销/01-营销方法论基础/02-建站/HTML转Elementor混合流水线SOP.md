# HTML→Elementor JSON 生成与导入规范

> v2.0（2026-08-16）。适用：任何「已有 HTML/CSS 原型 → Elementor 页面」项目。
> 本文是**要求清单**：生成 JSON 和导入 WP 时逐条对照执行，每条都是硬性标准。

---

## 0a. 原型阶段：防 AI 味设计纪律（hallmark，2026-08-27 增）

本 SOP 输入是「已有 HTML 原型」——原型的**结构与视觉质量**在上游决定。三道防 AI 味关卡各管一层，不重复：

| 层 | 工具/规则 | 时机 |
|---|---|---|
| **页面结构/视觉层** | **hallmark skill**（`~/.claude/skills/`，装机与分工见 [01-Claude-Code环境配置.md](../../../00-基础能力/01-Claude-Code环境配置.md) UI 设计三件套节） | 原型生成时：默认走 hallmark 设计流（21 结构×20 主题×50+ 组件组合 + 57 项 slop-test 自检，拒绝 hero 渐变+居中标题+三列圆角卡套路）；存量原型用 `hallmark audit {目录}` 体检出 punch list；竞品参考用 `hallmark study {URL/截图}` 提取设计 DNA（不像素级抄袭） |
| 布局保真层 | `html-layout-extract` skill（§1.6） | JSON 生成前必跑 |
| 图片层 | §1.7 提示词纪律（candid documentary / 避免完美对称与霓虹蓝光） | 每次生图 |

**分工**：frontend-design + DESIGN.md 定品牌审美方向，hallmark 管结构多样性与量化自检（两个不同 brief 的页面不应共享同一 hero→三卡→CTA 节奏）。hallmark 产出的原型即本 SOP 下游输入，照常走 §1 起全流程。

---

## 0. 核心原则：样式走组件 Style 控件，禁止 Custom CSS 复刻

**复刻 HTML 样式时，一律优先使用 Elementor 组件/容器的原生 Style 控件**（widget/container settings、Kit 全局变量），**不要用 Custom CSS 代码补丁**。

| | 组件 Style 控件 | Custom CSS 补丁 |
|---|---|---|
| 数据模型 | Elementor 正规设置，编辑器可见可改 | 游离于数据外，编辑器不可见 |
| 优先级 | 组件级 specificity 天然最高，无冲突 | 越加越多，!important 战争互相压制 |
| 复用 | 存模板/复制即带走 | 每页每容器重写，线性累积复杂化 |
| 排查 | Style 面板即真相 | 要全文搜 CSS 找谁在生效 |

**代码层实现要点（AI 批量写 settings 时）**：
1. **先查后写**：`get-widget-schema(widget_type, full:true)` 拿真实控件键名，**禁止猜键名**（实例：nav-menu 下拉字体键是 `dropdown_typography_font_family`，写成 `typography_dropdown_font_family` 是无效键、静默不生效）
2. **控件前置条件**：Border 类控件必须先设 `<prefix>_border_border:"solid"`，width/color/radius 才编译输出
3. **尺寸格式**：radius/border_width 是分边格式（top/right/bottom/left+unit+isLinked），不是 size 格式
4. **改后三步验证**：写入 → 触发 CSS 重编译（batch-update + add/remove 容器）→ 抓线上编译 CSS 确认规则输出，任何一环不落都视同未生效

**例外（仅两种情况允许 CSS）**：① 组件确实无对应控件（如 nav-menu 下拉无 line-height）——最小化写在该区块所属模板的 Custom CSS 统一管理；② 站级布局 hack（如 sticky header）——集中在 header 模板 Custom CSS。**禁止在页面级/容器级散落 Custom CSS**。

---

## 1. JSON 数据规范（生成时逐条满足）

### 1.1 容器宽度

| 项 | 要求 |
|---|---|
| 顶层 section 容器 | `content_width: "boxed"` + `boxed_width: {"unit":"px","size":1200,"sizes":[]}`（对齐 HTML `.container { max-width:1200px }`；背景色/渐变不受影响仍全宽） |
| 卡片分列容器 | `width: {"unit":"%","size":"31","sizes":[]}` **对象格式**；禁止 `_element_custom_width: "31%"` 字符串格式（对 Container 无效 → 渲染一列） |
| flex_wrap | 分列 row 容器**不设 wrap**（`nowrap` 或留空）——width 未生效时 wrap 会让 100% 宽子容器逐个换行（卡片一列的隐藏帮凶）；响应式换行一律由 `width_tablet`/`width_mobile` 三档控制，不靠 wrap |
| 响应式三档 | 每个分列容器必带 `width_tablet` / `width_mobile`。参考值：≤34% 列 → tablet 45 / mobile 100；≥35% 列 → tablet 100 / mobile 100 |
| 静态自查 | 全文件 grep `_element_custom_width` 必须 **0 命中** |

### 1.2 间距与高度

| 项 | 要求 |
|---|---|
| section padding | 顶层容器统一三档（2026-08-16 定稿）：desktop **80/0/80/0**、tablet **50/0/50/0**、mobile **40/0/40/0**——**扁平四边格式**（左右 0：内容宽由 boxed 1200 界定） |
| 顶层 gap | 正文 section 统一 `{"unit":"px","size":"30"}`；hero 统一 **20**——**禁止留空**（Elementor 默认 20，语义失控）。hero 胶囊/chips 条已全站删除（2026-08-16 用户决策），不再生成 |
| hero | 渐变背景 + `min_height`（vh 单位）；左右列 **55% / 45%**（2026-08-16 定稿，原 57/43） |
| 格式 | 尺寸字段一律对象格式（含 unit），不用字符串 |

### 1.2c 卡片圆角统一 10px

全站带边框的卡片容器 `border_radius` 统一 10、hero 大图 12、按钮/nav 下拉 8（2026-08-16 定稿；历史上 8/13/16 混用收敛）。

**⚠️ 格式硬约束（与 padding 同族坑）**：CSS 生成器对 border_radius **只认四边 dimensions 格式** `{"top":"10","right":"10","bottom":"10","left":"10","unit":"px","isLinked":true}`——scalar `{"unit":"px","size":"10"}` 被静默忽略（数据在、编辑器可见、CSS 零输出，线上一直直角渲染）。width 等其他 scalar 控件不受影响，仅 dimensions 族（padding/border_radius/border_width）敏感。

### 1.2b 卡片 hover 态（组件控件，禁止丢弃）

HTML 卡片的 :hover 效果必须映射到容器 **hover 控件**（对照源 CSS）。**键名两套前缀（2026-08-19 evapcryst P8 页 schema+线上 CSS 实锤）**：border/shadow hover 键**无下划线前缀**——`border_hover_border:"solid"` + `border_hover_color`（如 #00A4B4）+ `border_hover_width`（四边 dimensions）+ `box_shadow_hover_box_shadow_type:"yes"` + `box_shadow_hover_box_shadow`（如 0/16/40 rgba(10,37,64,.10)）；transform 键**保留下划线前缀**——`_transform_translate_popover_hover:"yes"` + `_transform_translateY_effect_hover:{"size":-4,"unit":"px"}`（上移）。⚠️ 历史文档/JSON 中的 `_border_hover_*`、`_box_shadow_hover_*` 带前缀形式是**无效键**（fc 746 线上只有 translateY 生效、shadow/border 零输出的根因），生成 JSON 时直接写入卡片容器 settings 正确键；已有页面可 batch-update 补。

### 1.3 SEO 硬规则

| 项 | 要求 |
|---|---|
| H1 唯一 | HTML 每页 `<h1>` 恰好 1 个（hero 内）；JSON 每页 `"header_size":"h1"` 恰好 1 个 |
| URL | 站内链接一律无 `.html` 后缀的绝对路径（`/solutions/zld/`） |

### 1.4 内容保真

| 项 | 要求 |
|---|---|
| 数字 | 逐字搬运，每个绝对数字带适用条件（val+cond）；禁止编造数字，缺数据用显式 TBD 占位 |
| 特殊字符 | 范围号用 `&ndash;` 实体；下标/上标用数字实体（`&#8322;` ₂、`&#178;` ²）；`&middot;`/`&rarr;`/`&mdash;`/`&copy;` 等标准实体 |
| 转义 | HTML 属性单引号；换行 `\n`；JS 撇号 `&#39;` |
| **配色唯一来源** | 全局色/任何颜色值一律取自 HTML 原型 `:root` 与组件 CSS 原文，**禁止自选色/凭感觉配色**（evapcryst 8/13 实锤：自作主张设了一套配色导致全站色调不符，只能全局重刷） |

### 1.5 结构约定

| 项 | 要求 |
|---|---|
| nav/footer | **不进页面 JSON**（由 Theme Builder 全站统一提供）；只搬 `<main>` 内容，hero 面包屑/eyebrow 保留。原型内嵌的 header/footer（本地互链预览用，含首页全量 mega 与子页简化 header 两形态）**导入一律剥离**——首页/front page 同为 WP page，不例外（靠垫项目 2026-08-31 定案：header/footer=WoodMart Header/Footer Builder 主题级一次设置） |
| id | slug 缩写 + 段落代号 + 类型代号 + 序号（如 `mlra00001` / `mlraw00001`），全文件唯一 |
| 交互降级 | FAQ 折叠 → 静态卡片；CSS 类 → 内联样式（色值对照 HTML `:root`） |

### 1.6 布局保真（2026-08-17 新增，血的教训）

| 项 | 要求 |
|---|---|
| **判据=渲染≠源码** | HTML 源码标签顺序 ≠ 视觉排版（视觉由 CSS 决定）。生成 json 前必须在浏览器打开原型看**真实渲染**，按渲染布局映射容器结构，禁止按源码顺序线性生成 widget |
| **⚠️ 宽度预算硬约束** | 同行子容器**列宽百分比之和 + gap 必须 ≤ 容器宽**——55%+45%+gap56px=1236>1180 实锤：flex 把第二列挤下去换行（"一列"假象，CSS 编译完全正常）。列宽留 gap 余量（如 54/42）；另警惕**过度修复**：原型卡是 column（pills 在卡底整宽 wrap 成多列）时，不得拆成"文字列+pills列"左右结构（pills 列太窄反而竖排，2026-08-17 203 页返工教训） |
| 并排结构容器化 | 原型中任何并排（左文右 pills 列、图文交替行、两列列表、两端对齐行）→ Elementor 必须拆**子容器 row**（width 对象+三档、mobile 100% 堆叠），禁止拍平成顺序 widget 或塞单个 text-editor |
| 图文交替 | nth-child(even) 反向 → row / row-reverse 容器成对实现 |
| 卡内布局 | 卡片分列网格（外层）与卡内布局（内层）是两回事——外层对了内层也可能拍平，逐层检查 |
| **验收盲区警示** | 大结构验收（H1/卡片数/分列/padding）**不能发现卡内排版拍平**——验收必须含"原型渲染 vs 线上渲染逐屏截图/几何对比"（关键子元素 bounding box 相对位置：原型并排而线上堆叠=不合格） |
| **执行工具** | 本节判据的自动化工具 = skill `html-layout-extract`（`~/.claude/skills/`，playwright 渲染几何测量→布局规格单 JSON）。**生成 JSON 前必跑**（规格单驱动容器拆分）；验收对线上跑同款 diff。本文定判据，skill 定执行——SOP 与 skill 双向引用、不合并 |

---

### 1.7 图片规范（AI 生成 + 组件展示）

| 项 | 要求 |
|---|---|
| 展示方式 | 用 **image 组件**（`widgetType:"image"`）+ `aspect_ratio` 控件（"4:3"/"16:9"），禁止容器背景图+min_height 模拟比例（比例失控） |
| 比例约定 | hero 右图 / Solutions 卡图 4:3；Industries 行业条 16:9（以各项目 HTML 原型为准） |
| 图片尺寸 | gpt-image-2 生成 1536x1024，展示端由 aspect_ratio + object-fit cover 裁切 |
| 写实要求 | 提示词强调：candid documentary industrial photography / DSLR / natural daylight / realistic wear and tear / film grain / no people / not a 3D render——避免完美对称与霓虹蓝光（AI 感主要来源） |
| **多效/混合系统参考风格** | 多效蒸发/混合盐系统配图参考 enchem 实拍风格：多组立式蒸发器按序排列+钢结构平台+黄色检修护栏+管线走向+蓝天简洁背景（写实摄影，无文字标签）——"落地感"与现场代入是这类图的核心价值（用户 2026-08-18 指定参考） |
| **室内厂房/中央循环场景** | 双效/中央循环蒸发器配图参考 enchem 冶金案例：**室内厂房环境**（墙面+水泥地面）+中央循环管集中式结构+上层黄护栏平台+下层蓝色泵组辅助设备——与室外多效组图（蓝天）形成场景区分；写实实拍、细节到泵的机械结构（2026-08-18 补充参考） |
| **工业尺度感（设备类硬要求）** | 设备图提示词必须含尺度参照物词：manways / steel platform with railings / ladders / multi-story plant structure / piping rack / factory floor——AI 默认倾向生成"实验室小设备"观感，无参照物则大装置会被画小。生成后质检专门判一项：**设备是 10 米级大型装置还是小型设备观感**（双视觉模型交叉判定更稳，2026-08-17 ZLD 设备卡实测 3/3 达标范例） |
| ⚠️ 提示词坑 | 提示词含 "4:3" 等比例字样会诱导 gpt-image-2 偏离 size 参数（输出错尺寸）——比例由 aspect_ratio 控件控制，提示词不写比例 |
| 部署链路 | 本地 JSON `image:{url:"assets/...",id:""}` → 部署前 Python 深拷贝替换 url=媒体库 source_url、id=attachment id（REST POST /wp-json/wp/v2/media multipart 上传）→ import-template |
| **贴合性（硬要求）** | 每张图的提示词必须取自**所在页面的实际内容**（页面主题/hero 副标题/核心工艺），禁止脱离页面性质的"通用工业图" |
| **生成后质检** | 每张图用视觉分析比对"图内容 vs 页面性质"（能否看出该页特有工艺/行业元素），不贴合的重生成——AI 生成结果与提示词可能偏差，不质检等于乱生成 |

---

## 2. 导入流程（每页固定 5 步）

```
① REST 建页（draft，含 slug/parent）或复用已有页
② SQL 补 meta：_elementor_edit_mode=builder（wppi_postmeta INSERT——REST 写不持久、emcp 保存会清掉它；缺此键 Elementor 前端不接管，内容退化裸 HTML、post-XX.css 永不生成）
③ import-template 导入 JSON content（大文件分批；Windows 下大 body 走临时文件避开 32K 命令行限制）
④ batch-update 重写各顶层容器 padding（四边平铺格式）
⑤ add-container → remove-element 一次
⑥ REST 设模板 elementor_header_footer（禁止 Canvas）
⑦ publish 窗口渲染：<30 秒临时 publish → 匿名访问该页（?cb= 防缓存）触发 CSS 生成与线上审计 → 切回 draft。draft 页 CSS 永不自动生成，此步是 CSS 落盘的唯一可靠路径
```

**通道备注**：若会话无目标站点 MCP 服务器，用 EMCP 插件 MCP-over-HTTP：`POST /wp-json/mcp/emcp-tools-server`（basic auth + Mcp-Session-Id 会话，工具名带 emcp-tools- 前缀），全部工具等效。

**CSS 生成机制（读插件源码证实的系统性事实）**：EMCP 的 import/batch-update/add-remove 写数据**均不保证生成 CSS**（仅 themer 渲染器走 Post::create）。批量部署的可选核武器：临时装 Code Snippets → REST 激活 snippet 调 `files_manager->clear_cache()` + 每页 `Post::create()` 强制重编译 → 用完停用删除插件（evapcryst 43 页部署实测，站点恢复原状无残留）。

**验证口径**：Elementor 4.2 的 padding 编译输出为 `--padding-top:84px` **CSS 变量格式**——终验按变量计数，不是 `padding: 88px` 字面量。

**扁平化时序与队列干扰（43 页批量实测的结构性事实）**：
1. import-template 保留 JSON 的嵌套 `sizes` padding，但 CSS 生成器只渲染扁平四边——**import 后必须做"全容器 padding 扁平化"**（不只顶层：子容器同样嵌套不渲染；flatfix 脚本模式：export 读全量 → 递归扁平化 → 批量写回）
2. **draft 状态下写入的扁平数据，publish 切换时会被 Elementor 保存流程迁回嵌套**——扁平化 batch-update 必须在 **publish 状态下**执行才持久（正确顺序：publish → batch 扁平化 → 渲染验证 → 切回 draft 前复核计数）
3. **"邻页 CSS 被回滚"的真相是 Cloudflare 对裸 URL 的独立缓存**（2026-08-17 按钮批量修复实测证伪"重编译队列回滚"假说）：页面实际引用的是 `post-XX.css?ver=<新版本号>` URL（永远新版），裸抓 `post-XX.css` 命中的是 CF 缓存的旧版。**终验必须抓页面 HTML 提取其中的 `?ver=` URL 再抓 CSS**，不要裸抓 CSS 文件名；裸 URL 结果异常时先怀疑 CF 缓存再怀疑数据

**⚠️ 重导警告**：`delete-page-content` + 重新 import = 全新导入，**该页之前所有线上手工修复（padding/hover/组件设置）全部被清掉**，必须从 ③ 重新走完 ③④⑤，且 padding 一律四边平铺格式。

---

## 3. 验收清单（声明完成前逐项打勾）

- [ ] JSON 静态检查：`_element_custom_width` 0 命中；width/padding 对象格式带三档；H1 恰好 1 个；boxed 1200 在顶层容器上
- [ ] `json.load` 通过（仅证明语法，不证明渲染）
- [ ] **线上预览逐项确认**：卡片分列正确、Industries 等区块卡片数正确、section 间距正常、H1 数量 1、头尾（Theme Builder）在
- [ ] 线上 HTML 抓取验证：`<h1` 计数 = 1；`data-elementor-type="header"` 存在；`page-header` 不存在
- [ ] 移动端 375px：多列卡片堆叠 1 列

**验收纪律**：数据层验证通过 ≠ 完成。凡"声明完成"，必须以线上预览为准。

---

## 4. 错误写法对照表

| 错误 | 后果 | 正确 |
|---|---|---|
| `"_element_custom_width": "48%"` | 卡片全部一列 | `"width": {"unit":"%","size":"48","sizes":[]}` + 三档 |
| 顶层容器 `content_width: "full"` | 内容撑满全屏无 1200 约束 | `content_width: "boxed"` + `boxed_width` 1200 |
| 页面模板 Canvas | Theme Builder 头尾消失 | Full Width（`elementor_header_footer`） |
| 导入后不做 CSS 触发 | 数据对但零间距零样式 | batch-update + add/remove 组合 |
| JSON 里带 nav/footer | 与 Theme Builder 头尾三层重复 | 页面 JSON 只含 main 内容 |
| HTML 属性双引号嵌 JSON | 转义冲突 | 属性改单引号 |
| 范围号用 Unicode `–` | 检索/匹配不稳定 | `&ndash;` 实体 |
| 样式差异用 Custom CSS 补 | 优先级打架、逐页累积不可维护 | 组件 Style 控件（先 get-widget-schema full:true 查真实键名） |
| 猜控件键名直接写 | 无效键静默不生效（typography_dropdown_* 之鉴） | `get-widget-schema(full:true)` 查准再写 |
| padding 写成 `{"size":"88","isLinked":true}` | **dimensions 控件不认 size 格式，静默无效**——数据在、编辑器可见、CSS 不编译，间距丢失（evapcryst 反复"时好时坏"的总根因之一） | 四边平铺：`{"top":"88","right":"24","bottom":"88","left":"24","unit":"px","isLinked":false}` |
| border_radius 写成 scalar `{"unit":"px","size":"10"}` | CSS 生成器静默忽略（dimensions 族只认四边格式）——线上永远直角 | `{"top":"10","right":"10","bottom":"10","left":"10","unit":"px","isLinked":true}` |
| padding 保留 import 带入的**嵌套 `sizes:{top..}` 格式** | **CSS 生成器只认扁平四边格式**——嵌套格式数据在、编辑器可见，但 post-XX.css 零输出（间距丢失的另一半根因，2026-08-16 Home 57 首轮实测） | 导入后必 batch-update 用扁平格式重写全部顶层容器 padding（get-element-settings 返回的是嵌套格式，**不能直接当写回模板**） |
| 验证只看工具 success / 数据在 | 数据写入≠渲染生效 | 终验一律抓 `post-XX.css` 数目标规则（如 padding-top:88px ≥N 处），404 等 6 秒重试；**必须抓页面 HTML 里的 `?ver=` URL**（裸 URL 会被 Cloudflare 缓存误导） |
| 用 find-element search_text 找图片 | 搜不到 image widget 嵌套的 image.url（假阴性） | 直接 curl 渲染 HTML grep 图文件名/attachment id |
| 重导后不重跑 ③④⑤ | 之前线上修复全被清掉，间距/hover 失而复得地丢失 | 重导=全新导入，完整重走流程 |
| 生图提示词写 "4:3" 等比例 | gpt-image-2 被诱导偏离 size 参数输出错尺寸 | 比例只由 aspect_ratio 控件控，提示词不提比例 |
| REST 建页后不补 `_elementor_edit_mode=builder` | Elementor 不接管，内容裸 HTML 零样式零 CSS（数据全对） | SQL INSERT wppi_postmeta（REST 写不持久） |
| draft 页等 CSS 自动生成 | draft 前端不渲染，post-XX.css 永不生成 | publish 窗口渲染一次再切回（或 snippet 强制 clear_cache+Post::create） |

---

## 5. 需求落盘纪律

用户提出的结构/内容修改要求（卡片数量、宽度、布局等），**当日写入项目规划文档**（状态行带日期）。禁止只存在对话上下文中——会话断链即丢失（evapcryst 8/15-16 两例：Industries 5→9 卡、1200px 宽度，均因未落盘而返工）。

**修复回流纪律**：任何线上/数据层问题的修法，**必须同步回流到生成脚本与本文档**——只修产物不改脚本 = 同一坑必然复发（evapcryst 8/16 实锤：`_element_custom_width` 字符串格式在踩坑记录里修过一次，因未回流 `_gen_*.py`，二次扩散 856 处）。

---

## 6. 历史路径：dudaster 转换器（已不用，备查）

8/14 曾用 dudaster（`_tools/html2elementor`，已修 Windows GBK 编码）+ 4 步后处理（globals 展开/剥 nav/footer/SVG 注入/渐变键补全）批量转换 28 页（产物即 `json/hybrid/` 中间层）。8/15 起改为**按本文规范直接生成 JSON**（`_gen_*.py` 脚本或 agent 按规范生成），dudaster 路径保留备查。Windows 下若复用：`cli.py` 三处 `open()` 需加 `encoding="utf-8"`。

---

