# HTML 原型 UI 设计标准（通用，2026-09-01）

> **定位**：任何项目**在生成 HTML 原型时**（写进生成器脚本/agent prompt/设计模板），必须内置本标准的 CSS 专业度要求——**不是生成后再检查返工，而是从出生就专业**。
> **来源**：evapcryst（专业级）vs 靠垫 cushionmill（极简）对比实测——同一转换流水线，前者 80-90% 保真，后者 0% 视觉还原。根因不在 Elementor，在**原型 CSS 层**。

---

## 一、门禁检查清单（任一不满足 → 先改 CSS 再进 SOP）

| # | 检查项 | 最低标准 | 为什么 |
|---|---|---|---|
| 1 | **微动效** | 交互元素（卡片/按钮/链接）有 `transition` + hover 效果（位移/阴影/边框变化） | 0 条 transition = 页面是"死的"；evapcryst 293 个元素有 transition vs 靠垫 0 |
| 2 | **卡片阴影** | 卡片类容器有 `box-shadow`（常态微阴影 + hover 增强），非纯 1px 边框 | 白卡贴浅底 = 平面感；阴影 = 立体浮起感 |
| 3 | **字号尺度** | H1 ≥ 40px，H1:正文 ≥ 2.5×（桌面端） | 压扁的字号（H1=30px）= 无冲击力；Cormorant 类衬线体在小字号无优势 |
| 4 | **配色层次** | ≥ 8 种计算色（主色+辅色+中性灰阶+深色 band），CSS 变量大量未用 = 色彩单薄 | 4 色全页 = 单调；evapcryst 17 色 = 层次感 |
| 5 | **版块交替** | 页面有深色 band ↔ 白色 band 交替（hero/CTA/章节分隔） | 全页单一米白 = 无"章节感"；深浅交替 = 节奏 |
| 6 | **SVG/图形** | 箭头/图标用内联 SVG，伪元素装饰线 | 纯文字+字符箭头（→）= 无设计感 |

## 二、最小改动集（纯 CSS 约 40 行，解决 70% 差距）

### 2.1 微动效（全局）
```css
/* 所有交互卡片 */
.leg, .trust .t, .tool, .fabric-grid figure, .build-grid figure {
  transition: box-shadow .3s ease, transform .3s ease, border-color .3s ease;
}
.leg:hover, .trust .t:hover, .tool:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(27,59,90,.08);
  border-color: rgba(27,59,90,.16);
}
/* 卡片内图片 hover 缩放 */
.leg:hover img, .tool:hover img { transform: scale(1.03); }
```

### 2.2 卡片阴影化
```css
/* 常态：微阴影替代灰边框 */
.leg, .trust .t, .tool {
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(27,59,90,.05);
}
```

### 2.3 字号放大
```css
h1 { font-size: 46px; }  /* 原 30px */
h2 { font-size: 30px; }  /* 原 22px */
h3 { font-size: 21px; }  /* 原 17px */
.sub { font-size: 19px; } /* 原 17px */
```

### 2.4 按钮
```css
.btn, .cta-btn {
  padding: 12px 24px;
  transition: transform .2s, box-shadow .2s;
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,164,180,.3); }
```

### 2.5 Header 吸顶
```css
header.site { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,.95); backdrop-filter: blur(8px); }
```

### 2.6 深色 Band（需改 HTML：section 外包全宽层）
```html
<section class="band"><div class="wrap">...内容...</div></section>
<style>
.band { background: linear-gradient(135deg, #1B3B5A, #0a2540); color: #FAF8F5; padding: 80px 0; }
.band h2, .band h3 { color: #FAF8F5; }
</style>
```

## 三、图文交替行标准

长 H2 节（>300 词）必须有配图，形式为左图右文或右图左文交替（非机械 nth-child，图服务论点）：

```html
<div class="media-row">
  <figure class="media-img"><img src="..." alt="..."></figure>
  <div class="media-txt">
    <h3>小标题</h3>
    <p>段落...</p>
  </div>
</div>
<style>
.media-row { display: flex; gap: 32px; align-items: center; margin: 40px 0; }
.media-row:nth-of-type(even) { flex-direction: row-reverse; }
.media-img { flex: 0 0 42%; }
.media-txt { flex: 1; }
@media(max-width:768px){ .media-row { flex-direction: column; } }
</style>
```

## 四、工具链

| 步骤 | 工具 | 说明 |
|---|---|---|
| 设计改版 | **hallmark skill**（`~/.claude/skills/hallmark/`）| `redesign` verb，支持 Multi-page flow；品类/页型母版用 hallmark 做，脚本批量复制 |
| 风格探索 | frontend-design skill | 仅在改版前出 3-5 个风格小样供挑选（**不适合批量**，每页要求不同风格正反于一致性） |
| 机械门禁 | `_check_ui_quality.py` | 转换前自动跑：CSS 规则数>30？有 gradient/shadow/transition？有多列？不过→停止 |
| 布局验收 | html-layout-extract skill | 改版后跑同款做 diff |

## 五、与 SOP 的关系

本标准是 `HTML转Elementor混合流水线SOP.md` §0a 的**上游前置门禁**：
- SOP §0a 已有"防 AI 味设计纪律（hallmark）"
- 本标准补充"CSS 专业度达标"维度
- SOP 只加 3 行引用本文件，不膨胀

## 六、证据数据（evapcryst vs 靠垫实测，2026-09-01）

| 指标 | evapcryst | 靠垫 |
|---|---|---|
| CSS 规则数 | 1274 | 71 |
| hover 规则 | 100 | 9 |
| transition 元素 | 293 | 0 |
| box-shadow | 13 | 5（仅 5 处） |
| 渐变 | 15 | 0 |
| SVG 图标 | 25 | 0 |
| 计算色 | 17 | 4 |
| H1 字号 | 50px | 30px |
| 区块交替 | 深蓝↔白↔透明 | 全页米白 |
