# HTML→Elementor 混合转换流水线 SOP（通用）

> 2026-08-14 v1.0。验证样本：evapcryst.com 首页（Test D, page 145）——7 section 全指标达标。
> **适用范围**：任何「已有 HTML/CSS 原型 → 批量生产 Elementor 页面」的项目，不限主题（Hello Elementor / Woodmart / Astra 均可）。
> 与《Elementor MCP 生产 SOP（Woodmart）》互补：**有 HTML 原型走本流水线（快、可批量）；无原型走增量构建**。

---

## 0. 路径选择（先读这里）

```
手里有什么？
│
├─ 完整 HTML/CSS 原型（设计稿已定型）
│   └─ ★ 本流水线：dudaster 转换 + 4 步后处理（30+ 页可批量）
│
└─ 只有参考图 / 从零设计
    └─ 增量构建：create-page + add-container + add-free-widget（见 Woodmart SOP §1）
```

**核心思路**：dudaster（开源 MIT，本地运行）负责 CSS 级联保真——grid 列数、按钮、排版、颜色全自动且准确；自研后处理负责它做不到的四件事：globals 展开、模板剥离、视觉资产注入、间距烘焙。

---

## 1. 环境准备（一次性）

```bash
# dudaster 转换器（已 clone 到 _tools/html2elementor，已修 Windows GBK 编码）
git clone https://github.com/dudaster/html2elementor.git
pip install beautifulsoup4 tinycss2 cssselect2 playwright pillow
```

**Windows 必修**：`cli.py` 三处 `open()` 加 `encoding="utf-8"`（读 HTML / 读 --css / 写 JSON），否则 GBK 解码崩溃。

**流水线脚本**：`_tools/hybrid_pipeline.py`（转换+注入+烘焙一体）、`_tools/upload_test_page.py`（REST 上传）。

---

## 2. 五步流水线

```bash
# ① 转换 + 后处理（一条命令）
python _tools/hybrid_pipeline.py prototype/index.html prototype/json/home.json
# 输出摘要：sections=N globals_expanded=N hero_svg=OK gradients=9/9 padded=N

# ② 上传到 WP 页面
python _tools/upload_test_page.py <page_id> prototype/json/home.json

# ③ 触发 Elementor CSS 重生（MCP）
add-container(post_id, 最小 settings) → remove-element(返回的 element_id)
```

脚本内部自动完成的 4 步后处理：

| 步骤 | 做什么 | 为什么 dudaster 不做 |
|------|--------|---------------------|
| expand globals | `__globals__` 颜色/字体引用 → 字面值 | 它默认写 kit.json 引用，不导入 kit 则全页无色；系统角色（primary/text）保留 |
| trim nav/footer | 剥离首尾 section | HTML 原型自带 `<nav>`/`<footer>`，站点有独立 Header/Footer 模板 |
| SVG 注入 | 抓 `.hero-visual` 内联 `<svg>` → html widget 进 hero 右列 | dudaster 不解析内联 SVG |
| 渐变注入/补全 | CSS 渐变 div → Elementor gradient 容器（补 `gradient_type`/`stops` 键） | dudaster 会转渐变容器但缺 3 个键 → Elementor 4.2 不渲染 |
| 烘焙间距 | 每个 top section 写入 `padding 96px`；hero 加 `min_height 88vh` | 所有转换器都只管子元素间距，不管 section 呼吸感 |

---

## 3. 项目定制点（仅 2 处）

| 定制点 | 位置 | 说明 |
|--------|------|------|
| 行业卡片关键字 | `hybrid_pipeline.py` 的 `INDUSTRY_TITLES` | 换项目时改成该项目的卡片标题关键字 |
| 间距/hero 值 | `bake_spacing()` | 默认 96px section / 88vh hero，按原型 CSS 改 |

渐变提取是通用正则（`.xxx-image.iN` 的 `linear-gradient`），hero SVG 定位是通用 `.hero-visual` 类约定——新项目 HTML 遵循同样类名约定即可零改动。

---

## 4. 踩坑清单（全部实测，按发生频率排序）

| # | 坑 | 解法 |
|---|----|------|
| 1 | **REST 上传后样式全丢** | CSS 不会自动重生成。必走 `add-container → remove-element` 触发（SOP 坑 #13 同源）。batch-update 在部分页面也要再触发一次 |
| 2 | **`__globals__` 引用全空**（颜色）与 **H2 全部变 16px**（字体） | dudaster 输出指向未导入 kit.json 的哈希 ID 引用。**colors 和 custom typography 都要展开成字面值**——只展开颜色会漏字体（`globals/typography?id=xxx` 失效 → 回落默认 16px）。系统角色（primary/text 等）保留（站点 kit 已定义）。已内置 |
| 3 | **渐变容器不渲染（全页任何位置）** | Elementor 4.2 需要 `background_gradient_type:"linear"` + `background_color_stop`/`background_color_b_stop`，dudaster 只写 3 个基础键。**section 级渐变（如子页 hero 背景）同样中招**——`fix_gradient_keys_everywhere` 全页补全（已内置） |
| 4 | **检测显示渐变/SVG = 0 的假阴性** | 容器 background-image 有懒加载，Playwright 不滚动直接读 computed 永远是 none。**必须逐屏滚动后再检测**；渐变在 `backgroundImage` 上，别只查 `backgroundColor` |
| 5 | **nav/footer 重复出现** | 剥离 JSON 首尾 section（已内置） |
| 6 | **Windows GBK 编码崩溃** | cli.py 三处 open 加 utf-8；或统一 `python -X utf8`；被 `redirect_stdout` 捕获时 StringIO 无 `reconfigure`，需 try/except |
| 7 | **hero 分栏堆叠** | 检查 hero 容器 `flex_direction` 必须 `"row"`（dudaster 对 `1.2fr 1fr` 非均匀 grid 会退化） |
| 8 | **icon-box 图标不可见** | `view:"stacked"` 时 `primary_color`=背景、`secondary_color`=图标前景，别写反 |
| 9 | **子页 hero 整块空白无内容** | 子页 hero 常写成 `<header class="hero">`——dudaster 把一切 `<header>` 当导航转换（h1/正文全丢）。预处理改标签 `<section class="hero">`（已内置，CSS 类选择器不受影响） |
| 10 | **icon-box 显示清一色星星图标**（dudaster 默认 `fas fa-star`，HTML 内联 SVG 无法映射 FA 名）与 **hover 时图标消失**（dudaster 生成 `hover_primary_color:"#0096a514"` 8位hex=8%透明度 → stacked 色块 hover 变透明 → 白图标消失在白底） | AI 可直接批量换（无需手动）。已内置 `inject_icons`：① 标题关键字→FA 语义映射表（star/空才覆盖）② `view:"stacked"` + `primary_color`（色块）+ `secondary_color`（**图标前景，白**）③ 无条件覆盖 `hover_primary_color`/`icon_hover_color` 保持不变。注意：Elementor 4.2 图标颜色 CSS 只输出到 `view-stack`/`view-frame` 变体——default view 图标永远灰色；`icon_size` 含 padding（实际图标 = size − 2×icon_padding） |
| 11 | **image-box / 图片更换** | 同样可批量：`update-widget` 设 `image: {url, id}`。外部图片先 `sideload-image` 进媒体库再引用 attachment id |

---

## 5. 验收清单（每页必做）

- [ ] 逐屏滚动后检测：每 section 的 `padding`、grid 列数（`4col`/`3col`）、SVG/渐变计数
- [ ] 像素分布抽检：全页截图 → 主色占比符合设计（深色 Hero、品牌强调色存在）
- [ ] 移动端宽度 375px：多列卡片堆叠为 1 列
- [ ] 链接检查：卡片 href 指向真实页面（转换后手动或脚本批量替换 `href="#"`）
- [ ] `get-page-snapshot` 无 warnings

```python
# 验收脚本模板（滚动 + computed 检测，防假阴性）
for y in range(0, total, 800):
    page.evaluate(f'window.scrollTo(0, {y})')  # 触发懒加载
    page.wait_for_timeout(400)
```

---

## 6. 与 Woodmart SOP 的关系

| | 本流水线 | Woodmart SOP（增量构建） |
|---|---------|------------------------|
| 前提 | HTML 原型已定型 | 无原型 / 参考图 |
| 速度 | 秒级/页，可批量 | 5-10 分钟/页 |
| 保真度 | 90%+（CSS 级联） | 100%（1:1 字段） |
| 主题依赖 | 无（标准 Elementor 字段） | Woodmart 专属字段 |
| 适用 | 批量建站（30+ 页） | 单页精修 / 无原型 |

**组合用法**：批量页面走本流水线 → 重点页面（首页/Landing）用增量构建精修 → 局部复用 `save-as-template`。

---

## 7. 修订记录

- 2026-08-14 v1.0：evapcryst.com Test D 验证通过（7 section：Hero SVG+88vh ✓ / 4+2×2+3×3+4+5 列网格 ✓ / 9 渐变 ✓ / 96px 间距 ✓）
- 2026-08-14 v1.1：**28/28 全站页面批量转换零错误**（含 10 行业 hub / 4 solutions / technologies / tools / about 等）。新增坑 #9（`<header class="hero">` 标签误判）与全页渐变键补全（`fix_gradient_keys_everywhere`）；子页样本 Test E 验证通过（hero 渐变背景 + h1 内容 + 7 section 间距全达标）
