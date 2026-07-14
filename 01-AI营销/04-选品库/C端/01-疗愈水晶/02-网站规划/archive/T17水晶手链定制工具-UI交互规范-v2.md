# T17 水晶手链定制工具 - UI/交互规范（成品页锁定版）

> **状态**：2026-07-08 成品页执行规范  
> **适用页面**：`/tools/crystal-bracelet-builder/`  
> **上游真源**：[T17水晶手链定制工具-主文档.md](T17水晶手链定制工具-主文档.md)  
> **说明**：本文档以当前线上成品页为准，旧版本中“右侧尺寸控制”“近全宽布局”“左侧顶部状态条”等要求已废弃。

---

## 1. 总体布局

T17 是嵌入 WordPress / WoodMart 页面内的桌面优先工具。桌面端使用左右双栏：左侧负责设计预览和结算入口，右侧负责序列和部件选择。

| 区域 | 内容 | 验收重点 |
|---|---|---|
| 左侧设计区 | Hand Dimension、Bead Size、木托/手链预览、Reset/Release/2D View、Design Summary、价格拆分、Checkout | 珠子不分散；中心 logo 可见；Checkout 可见；底部信息不挤压 |
| 右侧选择区 | Strand Sequence、一级 Tab、左侧筛选、商品卡网格 | Strand Sequence 与下方数据分区清楚；商品卡紧凑；滚动区域高度合理 |

桌面端工具主体目标宽度为 **1360px**，视口不足时使用 `calc(100vw - 32px)` 退让。不要再做接近全屏的 `calc(100vw - 48px)` 方案；用户反馈后的目标是整体收窄到约 1300px 以上，而不是铺满页面。

---

## 2. 左侧设计区

### 2.1 顶部控制

顶部只保留两个核心入口：

- `Hand Dimension`：显示当前手围，例如 `20 CM`。
- `Bead Size`：6mm / 8mm / 10mm / 12mm 全局珠径 step。

位置要求：

- `Hand Dimension` 和 `Bead Size` 整体应贴近设计区上方，但不能压住木托。
- 木托/预览区应在顶部控制和底部 Reset 操作区之间视觉垂直居中。
- 如果上下空间略紧，可优先让顶部控制上移约 2px，而不是压缩珠子或底部结算区。

### 2.2 木托与珠子轨道

当前 2D 视图的木托是主视觉，珠子轨道必须围绕木托内凹中心，而不是贴在外侧边缘。

验收规则：

- 12mm 珠子不应在最外侧；它应落在木托中间凹槽附近，大概接近旧版 6mm/8mm 的位置。
- 10mm 和 12mm 都要控制尺寸，尤其 12mm 需要明显小于旧版，避免压迫画面。
- 珠径越小，珠子视觉尺寸越小，轨道也应按比例更内收，避免小珠子显得过于分散。
- 中心 `Earthward` logo 必须可见，但透明度要克制，不能抢木托和珠子主体。

### 2.3 底部操作

底部操作按钮保持三项：

```text
RESET / RELEASE BEADS / 2D VIEW
```

按钮在左侧设计区内水平排列，不遮挡木托，也不压到下方 Design Summary。

### 2.4 Design Summary 与价格区

底部信息区使用三个并列胶囊：

| 胶囊 | 内容 | 布局 |
|---|---|---|
| Design Summary | Wrist / Bead Size / Slots / Weight | 2 行 2 列；每项 label 在上，value 在下 |
| Price Breakdown | Beads / Charms / Cord / Accessories | 2 行 2 列；每项 label 在上，金额或名称在下 |
| Checkout | Checkout 按钮 + 状态提示 | 不再放 Total，只负责加购动作 |

Design Summary 的文案应使用上下显示，例如：

```text
Wrist
20.0 cm
```

不要再把 `Wrist: 20.0 cm` 这类摘要挤成单行长文本。Design Summary 保持整体两行两列，单项内部 label/value 上下显示。

Price Breakdown 左侧保持 `Beads / Charms / Cord / Accessories` 2 行 2 列；Total 作为 Price Breakdown 胶囊内右侧独立窄列显示，中间用竖线分隔，不放到 Checkout 胶囊里。

---

## 3. 右侧选择区

### 3.1 Strand Sequence

`Strand Sequence` 是右侧顶部独立模块，位于一级 Tab 上方。

结构要求：

- 左侧摘要区域比旧版略宽，避免按钮挤压。
- 左侧摘要使用 2 列布局：第一行 `Beads 18 / Charms 0`，第二行 `Cord 1 / Pack. 0`，第三行 `Accessories 0`。
- 每个摘要按钮内部使用左右显示：label 在左，数量在右。
- `Size` 不放进 Strand Sequence 摘要；尺寸只保留在左侧设计区顶部的 `Bead Size` 控件里。
- 右侧序列区桌面端尝试并采用 **一行 4 列**，至少显示 3 行；行与行之间必须有清楚间距。
- 移动端序列区为一行 2 列，显示 2 行。

### 3.2 Strand Sequence 与商品区间距

`Strand Sequence` 和下方 Tab / 商品数据之间必须有明显间距，不能粘在一起。桌面端建议保留约 8-12px 的视觉间隔。

### 3.3 一级 Tab

一级 Tab 固定为：

```text
Crystals / Accessories / Charms / Packaging / Cord
```

规则：

- active 使用黑底白字；inactive 使用浅灰胶囊。
- Tab 文案用 Title Case，不强制全大写。
- Tab 居中排列，按钮宽度略大于文字，不贴字。

### 3.4 左侧筛选与商品卡

右侧下半区由左侧筛选列 + 右侧商品卡组成。

- 水晶 Tab 默认显示 `Color / Type` 分段切换。
- Color 下显示颜色分类；Type 下显示石种分类。
- Charms / Packaging / Cord SKU 少时可只保留 `All`。
- 商品卡桌面端一行 3 个；卡片保持紧凑，图小、字小、价格清楚。
- 商品卡不拆 6mm/8mm/10mm/12mm 四张重复卡，只显示当前全局珠径下的价格。
- 右侧选择区整体高度可比旧版降低约 10px，但不能牺牲商品卡可读性。

---

## 4. 手机端执行规则

手机端以“先选商品，再看序列”为主，不照搬桌面端右侧顺序。

- 右侧选择区在手机端顺序为：一级 Tab → 筛选/商品列表 → Strand Sequence。
- Strand Sequence 手机端整体高度继续降低，当前目标约 82px。
- Strand Sequence 左侧摘要适度加宽；右侧序列区保持 2 列，显示 2 行。
- 一级 Tab 使用 5 等分网格，避免 `Crystals / Accessories / Charms / Packaging / Cord` 横向溢出。
- 筛选列宽度比旧版更宽，手机端目标约 120px；分类项字体要轻一点、行高稳定、圆点克制，避免像粗糙按钮列。
- 水晶商品卡在手机端保持一行 2 个，包括 430px 以下窄屏，不再退成 1 列。
- Design Summary / Price Breakdown 手机端整体高度降低；字段采用横向 label/value，但 label 和 value 应成组靠近，相邻两组之间留出更清楚的列间距。价格数字不要用过重字重，Total 价格使用克制的加粗和更均匀的间距。

---

## 5. 尺寸逻辑

珠径是全局控制，但入口在左侧设计区顶部的 `Bead Size`，不是右侧商品区。

MVP 规则：

- 一串手链只允许一个全局珠径。
- 支持 6mm / 8mm / 10mm / 12mm。
- 切换珠径时统一更新：珠子视觉尺寸、轨道半径、目标槽位、商品卡价格、总价。
- 不支持混合珠径；混合尺寸留给后续高级模式。

---

## 6. 当前验收清单

1. 工具主体桌面端宽度约 1360px，不能被 WordPress 正文容器压到 1200px 以下。
2. 左侧木托位于顶部控制和底部操作之间的视觉中心。
3. 12mm 珠子不在外侧；10mm/12mm 尺寸受控，轨道更内收。
4. 中心 logo 可见。
5. Checkout 按钮可见，Total 不在 Checkout 胶囊内。
6. Design Summary 是两行两列；Price Breakdown 左侧两行两列，右侧单列 Total，用竖线分隔。
7. Strand Sequence 左侧摘要字段左右显示，不包含 Size；右侧序列桌面端 4 列且有行距。
8. Strand Sequence 与下方 Tab/商品区有明显间距。
9. 商品卡桌面端 3 列，手机端 2 列。
10. 页面没有乱码、重叠、按钮文字溢出。
