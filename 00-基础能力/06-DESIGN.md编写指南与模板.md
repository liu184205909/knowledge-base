# DESIGN.md 编写指南与模板

> DESIGN.md 是 Google Labs 提出的文件格式规范，专门给 AI Coding Agents（Cursor、Claude Code、Copilot 等）描述项目的视觉设计系统。放在项目根目录中，AI 工具会自动读取并遵循。

---

## 为什么要用 DESIGN.md

**没有 DESIGN.md 时**：每次让 AI 生成 UI，它随意使用颜色、字体、间距，产出不符合品牌风格。

**有了 DESIGN.md 后**：AI 拥有长期、结构化、可复用的设计系统认知，自动遵循设计规范，不需要每次重复描述。

---

## DESIGN.md 包含哪些内容

| 模块 | 说明 | 示例 |
|------|------|------|
| 调色板 | 主色、辅助色、语义色 | 主色 #1A73E8、错误色 #D93025 |
| 字体系统 | 字体家族、字号层级、行高 | 标题 Inter 32px、正文 16px |
| 间距规则 | 基础单位、padding/margin 规范 | 基础单位 8px，卡片 padding 24px |
| 组件风格 | 按钮、卡片、输入框的视觉规则 | 按钮圆角 8px、阴影 0 2px 8px |
| 设计原则 | 品牌调性、风格描述 | 简约、专业、留白充足 |

---

## 4 种生成方式

### 方式 A：给 AI 看设计稿（最实用）

把 Figma 截图、品牌色板、UI 页面截图发给 Claude 或 ChatGPT，用以下 Prompt：

```
请根据以下设计内容，生成标准的 DESIGN.md 文件。

格式要求：
1. 顶部用 YAML front matter 定义所有设计 token（颜色、字体、间距、圆角、阴影）
2. 正文用 Markdown 说明每个 token 的使用场景和禁止事项
3. 包含 Components 章节，描述主要组件的视觉规则

设计内容如下：[粘贴描述 / 上传截图]
```

### 方式 B：从 Figma Variables 导出

1. 在 Figma 中导出 Design Tokens 为 JSON
2. 将 JSON 交给 AI 转换为 DESIGN.md

### 方式 C：Google Stitch 自动生成

Google Stitch 支持一键导出 DESIGN.md，适合已在使用 Stitch 的项目。

### 方式 D：使用现成模板

GitHub 上有大量 DESIGN.md 模板，下载后根据品牌定制即可。

---

## 通用 DESIGN.md 模板

```markdown
---
# Design Tokens（YAML front matter）

colors:
  primary: "#________"
  primary_hover: "#________"
  secondary: "#________"
  accent: "#________"
  background: "#________"
  surface: "#________"
  text_primary: "#________"
  text_secondary: "#________"
  text_muted: "#________"
  border: "#________"
  error: "#D93025"
  success: "#1E8E3E"
  warning: "#F9AB00"
  info: "#1A73E8"

typography:
  font_family_heading: "________"
  font_family_body: "________"
  font_size_h1: "2.5rem"
  font_size_h2: "2rem"
  font_size_h3: "1.5rem"
  font_size_h4: "1.25rem"
  font_size_body: "1rem"
  font_size_small: "0.875rem"
  line_height_heading: "1.2"
  line_height_body: "1.6"
  font_weight_normal: "400"
  font_weight_medium: "500"
  font_weight_bold: "700"

spacing:
  base_unit: "8px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"

border_radius:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"

shadows:
  sm: "0 1px 3px rgba(0,0,0,0.1)"
  md: "0 4px 12px rgba(0,0,0,0.1)"
  lg: "0 8px 24px rgba(0,0,0,0.12)"

breakpoints:
  mobile: "480px"
  tablet: "768px"
  desktop: "1024px"
  wide: "1440px"
---

# [项目名称] 设计系统

## 设计原则

- [原则1，如：简约优先，留白充足]
- [原则2，如：内容驱动，装饰克制]
- [原则3，如：移动优先，响应式设计]

## 调色板

| 角色 | 色值 | 使用场景 |
|------|------|---------|
| 主色 | `#________` | CTA 按钮、链接、品牌标识 |
| 辅助色 | `#________` | 次要按钮、标签、图标 |
| 强调色 | `#________` | 提示、徽章、高亮 |

**禁止**：不要混用未定义的颜色。不要用主色做大面积背景。

## 字体

- 标题：`________`（________ 字重）
- 正文：`________`（________ 字重）

**禁止**：不要在标题中使用正文font-family，反之亦然。

## 间距

所有间距必须是 `8px` 的倍数（4px、8px、16px、24px、32px、48px）。

## 组件规范

### 按钮

- 主按钮：主色背景 + 白色文字 + 8px 圆角
- 次要按钮：透明背景 + 主色边框 + 主色文字
- 禁用状态：灰色背景 + 灰色文字，无 hover 效果

### 卡片

- 白色/表面色背景 + md 阴影 + 12px 圆角
- 内边距 24px
- hover 时阴影加深至 lg

### 输入框

- 1px 实线边框（border 色）+ 8px 圆角
- 聚焦时边框变为主色
- 高度 48px

### 导航栏

- 固定顶部，白色背景 + sm 阴影
- Logo 居左，导航链接居右
- 移动端折叠为汉堡菜单
```

---

## 在 Claude Code 中使用

1. 将 DESIGN.md 放在**项目根目录**
2. 在项目的 `CLAUDE.md` 中引用：`设计规范：本项目根目录 DESIGN.md`
3. Claude Code 启动时会自动读取两个文件

## 在 Cursor 中使用

Cursor 默认读取项目根目录的 `.cursorrules` 文件。可以在 `.cursorrules` 中写：

```
Always follow the design system defined in DESIGN.md in the project root.
```

---

## 多项目复用

如果你有多个项目共享同一品牌设计：

1. 知识库中保留一份**通用模板**（即本文档中的模板）
2. 每个新项目从模板出发，定制具体 token 值
3. 不同项目的 DESIGN.md 独立维护，跟着项目 git 版本管理

**核心原则**：方法论文档放知识库，具体 DESIGN.md 放项目根目录。
