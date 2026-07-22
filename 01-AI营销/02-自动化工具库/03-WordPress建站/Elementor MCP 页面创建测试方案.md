# Elementor MCP 页面创建测试方案

> 测试方案文档。分阶段执行 POC 后回填结果，验证完成后升级为正式操作手册。

---

## 0. 文档关系

| 文档 | 角色 | 状态 |
|---|---|---|
| `Elementor REST API 操作手册.md` | 现有 SOP（page 生产）+ REST 边界说明 | 已验证，保留 |
| `Gutenberg博客文章REST-API上传指南.md` | post 生产 SOP | 已验证，保留 |
| **`Elementor MCP 生产 SOP（Woodmart）.md`** | **生产 SOP（已验证可靠路径）** | **2026-07-20 通过** |
| **本文档** | Elementor MCP 测试方案 + 历史 | POC 已通过 |
| Bricks 文档（未来） | Bricks 路线（如启用） | 暂不创建 |

**重要**：
- POC 通过后（2026-07-20），实际 page 生产**以生产 SOP 文档为准**
- 本测试方案文档保留为历史记录，不再作为生产依据
- REST API 在 media / categories / posts / 读取 Elementor JSON 等场景仍是基础能力，只是**不适合创建 Elementor page**（见 §2）

---

## 1. 背景与动机

### 1.1 现状痛点

项目 goearthward.com 的 page 生产长期依赖 Elementor REST API + 手写 JS 脚本（见 [REST API 手册](Elementor%20REST%20API%20操作手册.md)）。该路径存在三个根本问题：

1. **AI 难以稳定生成 Elementor JSON**：JSON 结构深嵌套、强类型，每个 widget 有 required keys，不同 widget 字段差异大
2. **CSS 生成机制不兼容**：REST API 注入 `_elementor_data` 后不触发 CSS 重生成，必须靠编辑器手动保存或后台批量重生成
3. **section/column 结构脆弱**：`structure` 属性、`_column_size` 等字段 REST 注入无效，只能用纯 Flexbox 绕过

### 1.2 测试目标

- **命题 A**：能否通过 msrbuilds MCP server，让 Claude Code 通过原子化 widget 工具创建可用页面？
- **命题 B**：能否通过 HTML-to-Elementor 转换链路，让 Claude 生成 HTML 后自动转换？
- **命题 C**：现有方案失败时，自建 MCP 的最小可行 scope 是什么？

### 1.3 产品化方向（长期目标）

POC 测试通过后，基于 [msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp) Free 版（GPL-2.0）**fork + 自写 Pro overlay** 包装成商业产品卖给其他 Elementor 用户。

**关键依据（来自 2026-07-20 调研）**：
- msrbuilds Pro 是私有仓库 + Freemius 远程验证，**不可直接 fork**
- 但 `pro-manifest.txt` 已公开所有 Pro 文件路径——等于自研蓝图
- msrbuilds Pro 80% 是自研（不依赖 Elementor Pro），证明 PHP 层完全走得通

**自研 Pro 优先级**（按 ROI 排序）：

| 功能 | 难度 | 估算 | 商业价值 |
|---|---|---|---|
| Theme Builder（header/footer/single/archive） | 中 | ~3000 行 | ★★★★★ |
| WooCommerce 集成（包 `wc/v3`） | **低** | ~600 行 | ★★★★ |
| SEO & a11y 审计（独立模块） | 中 | ~2500 行 | ★★★★ |
| Popup Builder | 低-中 | ~800 行 | ★★★ |
| AI Widget Builder | **高** | ~3500 行 | ★★★（差异化低，跳过）|

**差异化策略**：避开 msrbuilds 强项（AI Chat / Widget Builder / Agent Skills），聚焦中文市场、行业方案（如水晶项目 / SEO 站群）、Elementor 4.0 atomic elements 专项优化。

详见 §11 产品化路线。

---

## 2. REST API 创建 Elementor 页面失败的根本原因

> 这一节的内容已通过实战验证，可直接引用。

### 2.1 数据结构层面（明文，来自 Elementor 官方文档）

Elementor 官方开发者文档（[developers.elementor.com/docs/data-structure](https://developers.elementor.com/docs/data-structure/)）说明：
> "Elementor uses JSON to structure data as it's easy for humans to read and write and easy for machines to parse and generate."

但实战中，这个 JSON 对 AI 不友好，具体表现：

| 问题 | 说明 |
|---|---|
| 深嵌套 | section → column → widget 多层嵌套，AI 难以一次生成正确层级 |
| 强类型 | 每个 widget 有特定 required keys，缺失即渲染失败 |
| Schema 散落 | 不同 widget 字段差异大，没有统一的 schema 文档让 AI 学习 |
| ID 不可追溯 | 7 位 hex 随机 ID，AI 生成后无法回溯调试 |

### 2.2 渲染机制层面（明文，来自 REST API 手册 §10、§17）

| 维度 | 编辑器手动搭建 | REST API 写入 |
|---|---|---|
| CSS 文件 | 保存时自动生成 `post-XXXX.css` | **不会生成**（用 Flexbox 绕过） |
| 缓存 | 自动更新 | REST 改 `_data` 后必须后台批量重生成 CSS |
| 编辑器冲突 | 用户旧编辑器点保存会**覆盖** REST 改动 | 用户必须重新加载编辑器 |

### 2.3 已确认的失败模式（来自 `Elementor REST API 操作手册.md`）

- `structure: "30"` + `_column_size` 多列变单列（§3）
- 嵌套容器缺 `isInner: true` 子元素不显示（§9）
- `padding` 值用数字而非字符串渲染异常（§9）
- REST 清 `_elementor_css` 前端样式全丢（§14）
- category archive 的 `_elementor_conditions` REST 无法精确设（§18.3）

### 2.4 架构层面的根因（推断）

REST API 是**数据层**（resource-oriented），适合 CRUD。但 Elementor page 创建是**任务层**（task-oriented），需要：
- 原子化的 widget 操作能力（不是整段 JSON 替换）
- 运行时 widget schema 发现（AI 不知道站点装了哪些 widget）
- 与编辑器状态同步的能力（避免覆盖）

**这正是 WordPress 6.9 Abilities API 要解决的问题**（见 §3）。

---

## 3. 关键技术背景：Abilities API 与 MCP Adapter

### 3.1 三层关系

```
WP 6.9+ 核心：Abilities API 框架（自带，空壳）
       ↑ 注册 ability
MCP Adapter 插件（把 ability 暴露为 MCP tools）
       ↑ HTTP / STDIO
AI 客户端（Claude Code / Cursor 等）
```

### 3.2 关键结论

- WP 6.9+ 自带 Abilities API 框架（空壳，无 ability）
- goearthward.com 7.0.2 已具备框架
- **msrbuilds/elementor-mcp 已打包 MCP Adapter**（[README 原文](https://github.com/msrbuilds/elementor-mcp)："Bundled, no separate install"）
- **不需要单独安装 wordpress/mcp-adapter**——这就是为什么 WP 后台插件市场搜不到 mcp-adapter 也不影响

### 3.3 与 REST API 的关系

Abilities API 是 REST API 的**叠加层**，不替代。REST API 在 media 上传、categories 管理、读取已有页面 JSON 等场景仍是基础能力（见 [REST API 手册](Elementor%20REST%20API%20操作手册.md)）。MCP 路径解决的是 **Elementor page 创建**这个具体问题。

---

## 4. 待测试的两条路径

### 4.1 路径 B：直接 JSON 生成（主要测试对象）

```
Claude Code → msrbuilds MCP → 拿到 Elementor widget schema → 通过 add-* 工具落库
```

**关键澄清**：路径 B 不是让 AI 凭空生成完整嵌套 JSON，而是通过 MCP 提供的**原子化工具**逐个 widget 添加：
- `list-widgets` + `get-widget-schema` —— AI 实时发现可用 widget 和字段
- `add-free-widget` / `add-pro-widget` —— 按 schema 添加 widget（不需要手写 JSON）
- `add-container` / `update-container` —— 原子化容器操作
- `build-page` —— 也支持 declarative JSON 一次性创建完整页面
- `rollback-change` —— **AI 修改可回滚**（REST 路径做不到）

- **优点**：原生支持所有 Elementor 组件；schema 自动发现避免手写 JSON；变更可回滚
- **风险**：工具数量多（128-152），AI 选错工具的可能性；HTTP 端点的会话管理复杂度
- **代表方案**：[msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp) v3.5.0（538 stars，2026-07 活跃维护，**第三方开源**，不是 Elementor 官方）

### 4.2 路径 A：HTML 转换流（次要测试）

```
Claude 生成 HTML/CSS → HTML-to-Elementor 转换器 → 导入 JSON → 落库
```

- **优点**：AI 生成 HTML 几乎不会出错
- **风险**：转换器对复杂 Elementor 组件（Form、Carousel、WooCommerce widget）支持有限
- **代表方案**：
  - [Ak-Elementor-Studio](https://github.com/abanoubkhaliil/Ak-Elementor-Studio)（Claude AI Skill）
  - [AI to Elementor — HTML Importer](https://wordpress.org/plugins/aitoel-html-importer/)（WP 插件）

### 4.3 两条路径的测试优先级

| 优先级 | 路径 | 理由 |
|---|---|---|
| **P0** | 路径 B（msrbuilds MCP） | 安装最简（自带 MCP Adapter），工具最丰富，开源活跃 |
| **P2** | 路径 A（HTML 转换） | 路径 B 测试中如果发现 widget schema 仍不够用再启用 |

> Elementor Angie AI 只能在 Elementor 编辑器内用，无法被 Claude Code 调用，不测试。

---

## 5. 工具清单与安装决策

### 5.1 依赖确认（goearthward.com 实测）

| 依赖 | 状态 |
|---|---|
| WordPress | 7.0.2 ✅ |
| PHP | 8.3.31 ✅ |
| Elementor | 4.1.5 + Pro 4.1.3（支持 atomic elements） ✅ |
| WordPress MCP Adapter | msrbuilds 已打包，不需要单独装 |
| WordPress Abilities API | WP 6.9+ 核心自带 |

### 5.2 候选方案

| 方案 | 决策 |
|---|---|
| [msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp) v3.5.0 | **首选（已激活）** |
| [Ak-Elementor-Studio](https://github.com/abanoubkhaliil/Ak-Elementor-Studio)（Claude Skill） | 备选（路径 A） |
| [aitoel-html-importer](https://wordpress.org/plugins/aitoel-html-importer/) | 备选（路径 A） |
| 其他（bvisible / Aguaitech / Respira / AI Engine / Angie AI） | 不测试（详见 §4.4 / 各方案 GitHub README） |

> msrbuilds 有 Free / Pro 之分，定价见 [emcptools.com/pricing](https://emcptools.com/pricing)。**当前用 Free**，遇到功能阻塞再评估。

### 5.3 安装清单

> 插件不在 wordpress.org 目录，后台搜索搜不到。必须从 [GitHub Releases](https://github.com/msrbuilds/elementor-mcp/releases) 下载 zip 后用 Upload Plugin 上传。插件名 "MCP Tools for Elementor"，admin 菜单 "EMCP Tools"。

| 序号 | 操作 |
|---|---|
| 1 | 下载 release zip（[Releases 页](https://github.com/msrbuilds/elementor-mcp/releases)） |
| 2 | goearthward.com 后台 → Plugins → Add New → **Upload Plugin**（不能用搜索） |
| 3 | 激活 "MCP Tools for Elementor" 插件（MCP Adapter 自动激活） |
| 4 | WP 后台 → **EMCP Tools** 菜单 → Connection，生成 Application Password |
| 5 | 在 `~/.claude.json` 的 `mcpServers` 里添加 emcp-tools HTTP 端点（见下方） |
| 6 | 重启 Claude Code |

`mcpServers` 配置：

```json
"emcp-tools": {
    "type": "http",
    "url": "https://goearthward.com/wp-json/mcp/emcp-tools-server",
    "headers": {
        "Authorization": "Basic BASE64_ENCODED_CREDENTIALS"
    }
}
```

> 直接 HTTP 连接可能要求 `Mcp-Session-Id` header（见 msrbuilds README Troubleshooting）。如果 Claude Code 不自动处理，切到 Node.js proxy 方案（`type: "stdio"` + `npx @msrbuilds/emcp-proxy`）。

### 5.4 后台设置策略

EMCP Tools 设置页所有 Free 版可用的开关**全部保持默认 ON**，Pro 专属开关保持 OFF。工作流原则：**优先 MCP，REST API 兜底**——Claude 在同一对话中自行选择最合适的工具，不强制区分。

---

## 6. 分阶段测试计划

### 阶段 0：环境准备（0.5 天）

- [x] 确认 goearthward.com WordPress 版本：**7.0.2**（> 6.9，Abilities API 自带）
- [x] 确认 Elementor 版本：**4.1.5 + Pro 4.1.3**（支持 atomic elements，msrbuilds 会激活 152 工具档位）
- [x] 确认 PHP 版本：**8.3.31**（≥ 8.1）
- [x] 确认 msrbuilds 是否依赖 wordpress/mcp-adapter：**已打包在内，不需要单独装**（2026-07-20 核实 README）
- [x] 从 [GitHub Releases](https://github.com/msrbuilds/elementor-mcp/releases) 下载 emcp-tools zip
- [x] 在 goearthward.com 主站后台 Upload Plugin 上传并激活（**用户已操作，2026-07-20**）
- [x] 验证 MCP 端点连接：**成功**（initialize 返回 serverInfo: MCP Tools for Elementor Server v3.5.0）
- [x] 配置 `~/.claude.json` 添加 emcp-tools HTTP 端点
- [x] **重启 Claude Code** 后验证 `emcp-tools/list-widgets` 能否调用：**成功**（2026-07-20，detect-elementor-version 返回 4.1.5+4.1.3，list-widgets 返回 28 个 Free widget）

**阶段 0 结果**：
```
WP 版本：7.0.2（已确认）
Elementor 版本：4.1.5 + Pro 4.1.3（已确认，支持 atomic elements）
PHP 版本：8.3.31（已确认）
EMCP Tools 版本：v3.5.0（已激活）
MCP Adapter 状态：bundled，自动激活
MCP 端点：https://goearthward.com/wp-json/mcp/emcp-tools-server
initialize 响应：成功（2026-07-20）
Claude Code 能否调用 emcp-tools/list-widgets：✅ 成功
遇到的坑：无
```

### 阶段 1：路径 B（直接 JSON）POC（2-3 天）

#### 测试用例 B1：简单页面（about 类型）

- [x] 目标：纯文本 + 图片的 about 页面
- [x] 期望：Claude 通过 MCP 直接生成可用 Elementor JSON
- [x] 验收：页面在 Elementor 编辑器可正常打开，前端渲染正确

**B1 结果**：
```
测试日期：2026-07-20
MCP 调用次数：4（create-page + build-page + add-free-widget + update-widget）
成功 / 部分成功 / 失败：✅ 成功
最终页面元素数：4（1 容器 + 3 widget：heading/button/text-editor）
warnings 字段：[] 空
CSS 自动生成：✅（Elementor 编辑器打开正常显示样式）
判定：B1 通过，原子操作（add/update-widget）完全可靠
踩坑：add-flexbox 在 create-page 创建的空 page 上会失败（返回 element_id 但不持久化），用 build-page 一次性创建可绕过
测试 page 已 trash：56298 / 56301
```

#### 测试用例 B2：中等复杂度（克隆 home 简化版）

- [x] 目标：克隆 home page 简化版（7 sections，去掉 wd_* 主题 widget）
- [x] 关键测试点：Flexbox 多列、响应式 width、icon-box/image-box 多卡布局
- [x] 验收：**❌ 失败**——结构成功但 UI 样式大面积丢失

**B2 结果**：
```
测试日期：2026-07-20
MCP 调用：build-page（一次性传入完整 structure 数组）
结构写入：✅ 成功（56 元素，warnings=[]）
UI 渲染：❌ 失败（用户验收）
  - 4 个 icon-box 未分列（应 desktop 4列 / tablet 2列 / mobile 1列）
  - image-box 布局错乱
  - 整体视觉与原 home 差距巨大

根因（重要发现）：
  AI 在构造 build-page 的 settings JSON 时倾向于"简化"，丢失关键响应式字段：
  1. width / width_tablet / width_mobile 三档响应式宽度 → 未传，默认 auto
  2. flex_wrap 显式 wrap → 未传，子元素不换行
  3. padding 复合值 {top,right,bottom,left,padding_mobile} → 简化为单值
  4. box_shadow / border_radius → 跳过
  5. image-box.link 应为 {url:"..."} 对象 → 错误传成字符串

技术结论：
  ✅ MCP 路径 B 技术上完全 work（写入 + warnings）
  ❌ AI 自由生成复杂 page 的 UI 还原度不可靠
  ⚠️ AI 精确克隆 page 必须忠实复刻每个字段，等于人肉 JSON
  🎯 AI 生成 page 的真正甜区是「模板化」而非「自由生成」——见 B4

测试 page 已 trash：56305（export/import 失败方向） / 56308（build-page 过度简化方向）
```

#### 测试用例 B3：复杂页面（含 Form / Carousel 的 landing page）

- [ ] 暂缓——B2 已暴露 AI 自由生成的 UI 还原度问题，B3 复杂度更高预计结果相同
- [ ] 直接跳到 B4 模板化路径测试

#### 测试用例 B4：模板化路径（apply-template，新增）

> B2 失败后的策略调整。模板化是 AI 生成 page 的真正可靠路径。

- [ ] 用 `save-as-template` 把 home 的一个 section（如 4 icon-box 信任标识）保存为模板
- [ ] 创建新 page
- [ ] 用 `apply-template` 套用到新 page
- [ ] 验证：响应式布局是否完整保留（vs B2 的失败）

**B4 结果**：
```
测试日期：2026-07-20
模板化保存：save-as-template(element_id=a00b29b, template_type=container) → template_id=56310
  源：home page (43017) 的 4 icon-box 信任标识 section（5 containers + 4 icon-box = 9 元素）
apply-template(template_id=56310 → post_id=56312)：✅ 成功（elements_added=9）

响应式 settings 保留验证（get-element-settings 抽查）：
  ✅ 子容器 width: 23% (desktop) / 45% (tablet) / 100% (mobile) — 全保留
  ✅ 父容器 flex_direction: row / flex_wrap: wrap — 全保留
  ✅ padding 复合值 + padding_mobile — 全保留
  ✅ border_radius / box_shadow / background_color — 全保留
  ✅ flex_gap / flex_align_items / flex_justify_content — 全保留

vs B2 的对比结论：
  B2 (build-page AI 自由生成)：5 类响应式 settings 全丢失 → UI 错乱
  B4 (save-as-template + apply-template)：100% settings 保留 → UI 应与原 section 一致
  倍数级可靠性提升，验证 §11.2 P0 转向正确

前端验证 URL：
  https://goearthward.com/wp-admin/post.php?post=56312&action=elementor
  预期：desktop 4 列 / tablet 2 列 / mobile 1 列，米色背景 #F8F5F0

测试 page：56312（保留，供用户验证；验证后由用户决定是否 trash）
模板：56310（保留，作为后续行业模板库的种子）
```

#### 阶段 1 小结

| 用例 | 结果 | 关键发现 |
|---|---|---|
| B1（简单 page） | ✅ 通过 | MCP 原子操作可靠 |
| B2（克隆 home 简化版） | ❌ 失败 | AI 自由生成会丢响应式 settings |
| B3（复杂 landing） | 暂缓 | 预计结果同 B2 |
| B4（模板化路径） | ✅ 通过 | **save-as-template + apply-template 100% 保留 settings，AI 生成 page 的真正甜区** |

**阶段 1 总判定**：
- MCP 路径 B 在**原子操作 + 模板化生产**两个场景完全可用
- AI **自由生成复杂 page 不可靠**（B2 失败模式已记录）
- 产品化方向 §11.2 P0 已调整：行业模板库 + apply-template 工作流

### 阶段 2：路径 A（HTML 转换）POC（2-3 天）

#### 准备

- [ ] 装 Ak-Elementor-Studio Skill 到本机 Claude Code
- [ ] 装 aitoel-html-importer 到测试站
- [ ] 重做阶段 1 中失败的用例（B2 / B3）

#### 测试用例 A1：HTML → Elementor 基础

- [ ] 让 Claude 生成 about 页 HTML
- [ ] 用 aitoel-html-importer 转换
- [ ] 检查 Elementor 编辑器中的还原度

**记录位 A1**
```
转换成功率：__________
哪些 HTML 元素正确转成 Elementor widget：__________
哪些丢失或错误：__________
```

#### 测试用例 A2：复杂页面（重做 B3）

- [ ] 用路径 A 重新创建 B3 失败的 landing page
- [ ] 对比两条路径的产出质量

**记录位 A2**
```
路径 A vs 路径 B 对比：
- Pro widget 支持：__________
- 复杂布局支持：__________
- 微调成本：__________
```

### 阶段 3：决策与归档（1 天）

根据测试结果填写 §7 的决策矩阵，选择主力路径。

---

## 7. 测试结果决策矩阵

> 测试完成后填写，作为长期决策依据。

| 维度 | 路径 B（直接 JSON） | 路径 A（HTML 转换） |
|---|---|---|
| 简单页面成功率 | 待测 | 待测 |
| 中等复杂度成功率 | 待测 | 待测 |
| 复杂页面成功率 | 待测 | 待测 |
| 微调工作量 | 待测 | 待测 |
| 学习成本 | 待测 | 待测 |
| Pro widget 支持 | 待测 | 待测 |
| 推荐主路径 | 待定 | 待定 |

### 7.1 三种可能结论

**结论 1**：两条路径都够用 → 写正式操作手册（基于实战），把本文档升级
**结论 2**：两条路径都有明显短板 → 触发自建 MCP 评估（见 §8）
**结论 3**：Bricks 2.4 正式发布 + 表现优异 → 重新评估是否新站用 Bricks

---

## 8. 自建 MCP 的触发条件与 scope

### 8.1 触发条件（任一满足即评估）

- [ ] 路径 B 在中等复杂度（B2）成功率 < 50%
- [ ] 路径 A 对 Pro widget 还原度 < 70%
- [ ] Elementor 官方 Angie AI 长期不发布或能力不足
- [ ] 项目出现高频重复工作流（如水晶卡片、塔罗解读页）值得封装

### 8.2 自建 MCP 的 scope 原则

**通用化优先，不局限水晶项目**。具体方向：

| Ability 方向 | 价值 | 优先级 |
|---|---|---|
| RLM 营销方法论工作流封装（Hero / CTA / 价值主张 section 模板） | 高，跨站点复用 | P0 |
| 水晶/塔罗/数字占卜等内容类型的快速建页 | 中，水晶项目专用 | P1 |
| Elementor 国际化（结合 TranslatePress） | 待评估 | P2 |
| 多站点同步（design system / global classes） | 待评估 | P2 |

### 8.3 实施原则

- **基于 fork，不从零写**：fork [bvisible/elementor-mcp-api](https://github.com/bvisible/elementor-mcp-api) 或 [msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp)，加定制 ability
- **基于 WordPress 6.9 Abilities API**，不绕开官方标准
- **每个 ability 独立测试**，避免引入破坏性变更
- **开源回馈**：定制 ability 成熟后可向上游 PR

---

## 9. 失败模式记录模板

> 测试过程中遇到任何失败，按此模板记录，避免重复踩坑。

```
### 失败 #N
- 日期：__________
- 路径：A / B
- 触发场景：__________
- 期望行为：__________
- 实际行为：__________
- 根因分析：__________
- 临时绕过方法：__________
- 是否需要 ability 定制：是 / 否
- 如果是，ability 设计草案：__________
```

---

## 10. 引用来源

### 官方文档（高可信度）
- [WordPress MCP Adapter 官方介绍](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/)
- [Bricks 2.4 Beta 发布说明](https://bricksbuilder.io/release/bricks-2-4-beta/)
- [Bricks AI Abilities Academy 文档](https://academy.bricksbuilder.io/builder/features/ai-abilities-and-skills/)
- [Elementor 数据结构官方文档](https://developers.elementor.com/docs/data-structure/)

### GitHub 项目（中-高可信度）
- [msrbuilds/elementor-mcp](https://github.com/msrbuilds/elementor-mcp) — 首选方案（自带 MCP Adapter）
- [bvisible/elementor-mcp-api](https://github.com/bvisible/elementor-mcp-api) — 备选
- [abanoubkhaliil/Ak-Elementor-Studio](https://github.com/abanoubkhaliil/Ak-Elementor-Studio) — HTML → Elementor JSON Claude Skill（路径 A）
- [wordpress/mcp-adapter](https://github.com/wordpress/mcp-adapter) — 官方 MCP Adapter（msrbuilds 已打包）

### WordPress 插件（中可信度）
- [AI to Elementor — HTML Importer](https://wordpress.org/plugins/aitoel-html-importer/)
- [DocsBot Elementor JSON Prompt](https://docsbot.ai/prompts/technical/elementor-json-conversion)

### 商业方案（待评估）
- Respira for Elementor — 动态 Schema 读取，闭源
- Aguaitech Elementor MCP — Agency 级多站点管理

### 行业分析（低-中可信度，仅参考）
- [WP Mayor: Abilities API vs REST API](https://wpmayor.com)
- [miniOrange: Abilities API for WordPress in 6.9](https://www.miniorange.com/blog/wordpress-api-abilities-and-mcp-ai-agents/)
- [InstaWP: 10 Best WordPress MCP Servers Compared](https://instawp.com/best-wordpress-mcp-servers-compared/)
- [10 Best WordPress MCP Servers to Try in 2026](https://responsive.menu/10-best-wordpress-mcp-servers/)

---

## 11. 产品化路线

> 本章是 §1.3 产品化方向的展开。POC 通过且决定商业化后启动。

### 11.1 fork 路线选择

| 方案 | 合法性 | 工作量 | 风险 |
|---|---|---|---|
| **fork Free（GPL-2.0）+ 自写 Pro overlay** | ✅ 完全合法 | 中（Pro 部分） | 跟随上游同步成本 |
| 直接复用 msrbuilds Pro 私有代码 | ❌ 违反版权 + 拿不到源码 | — | 法律 + 技术（Freemius 验证）双重风险 |
| 完全自研，不 fork | ✅ 合法 | 高（重写基础设施） | 失去 Free 现成的 120+ 工具 |

**选择 fork Free + 自写 Pro overlay**：基础设施（MCP Adapter 集成、Abilities 注册、Page Snapshot、Change Ledger、ACF/WPForms/Yoast 集成、Filesystem/Database guards）Free 版已完成，自写 Pro 等于只补 5-8 个商业功能。

### 11.2 Pro 功能优先级

> 2026-07-20 B2 测试后调整：原 P0 是 Theme Builder + WooCommerce，但 B2 暴露出**AI 自由生成 page 不可靠**——真正的产品价值是"模板化生产"而非"自由生成"。

按 ROI 排序（详情见 §1.3 表格）：

**P0（必做，发布 MVP 时一起上）—— 模板化生产闭环**：
1. **行业模板库** — 把水晶项目、SEO 站群、塔罗等垂直领域的高质量 section（Hero / CTA / 信任标识 / FAQ / 卡片 grid）预先做成 Elementor Template，存到插件自带的 templates CPT。AI 调用 `apply-template` 套用 + `update-widget` 改文案，**100% 继承原 section 的响应式 settings**，绕过 B2 的失败模式
2. **apply-template 工作流增强** — 包装一层 "industry-template-pack" ability，按行业（水晶 / SEO / 教育）批量加载模板。每个模板带 metadata（意图、配色、推荐使用场景）

**P1（v1.1 增量）—— 自研 Elementor 能力**：
3. **Theme Builder** — 注册 CPT `emcp_theme_template` + condition matcher + front-end render controller，~3000 行 PHP。参考 msrbuilds 公开的 `class-themer-abilities.php:25`
4. **WooCommerce 集成** — 包装 `wc/v3` REST 控制器，~600 行 PHP。最小投入最大覆盖

**P2（v1.2 增量）—— 差异化能力**：
5. **SEO & a11y 审计** — 完全自研独立模块（不依赖 Yoast/RankMath），~2500 行
6. **Popup Builder** — 优先调 Elementor Pro 的 `\ElementorPro\Modules\Popup`（如果用户装了 Elementor Pro），自研兜底

**P3（评估后决定，跳过）**：
7. AI Widget Builder、AI Chat in Editor、Agent Skills — 高投入低差异化，跳过

> **关键转向**：B2 测试结果直接证明——**AI 生成 Elementor page 的甜区不是"从零构建"而是"套用高质量模板"**。这条结论改变了 P0 的方向，从"自研 widget 工具"改为"建立行业模板库 + 模板化工作流"。

### 11.3 许可证 & 商业化基础设施

- **License 系统**：用 [License Manager for WooCommerce](https://wordpress.org/plugins/license-manager-for-woocommerce/)（免费）或自写；不接 Freemius（避免商业依赖）
- **更新通道**：参考 Free 版 `class-github-updater.php`，自建私有 release 通道
- **定价**：参照 msrbuilds（$29.99/年 单站点），中文市场可定 ¥199-299/年

### 11.4 差异化策略

避开 msrbuilds 强项（功能广度 + 英文社区），聚焦：

1. **中文市场**：完整 i18n、国内 AI 模型适配（智谱 / 通义 / DeepSeek 接入 MCP）、国内支付（微信/支付宝）
2. **行业方案**：水晶/塔罗/SEO 站群等垂直领域的 prebuilt templates + prompts
3. **Elementor 4.0 atomic elements 专项**：msrbuilds 的 atomic 工具覆盖不全（只 13 个），可深耕

### 11.5 启动条件

POC 测试完成后，**满足以下条件即启动产品化**：

- [ ] 路径 B（直接 JSON 生成）B2 中等复杂度成功率 ≥ 70%
- [ ] MCP 路径在前端渲染 + CSS 自动生成上完全 work
- [ ] 已 fork Free 仓库，本地能编译运行

**前置任务**（启动产品化时执行）：
1. 申请新 GitHub 组织（不污染现有 `Dylan/` 个人账号）
2. Fork `msrbuilds/elementor-mcp`，改 plugin slug（避免商标冲突）
3. 移除 Freemius SDK 依赖，改自写 license
4. 按优先级实现 P0 功能