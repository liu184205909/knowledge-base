# Pinterest 运营方案 v2 —— Buffer 网页 UI 通道（CDP 驱动）

> 定稿：2026-10-08 | 探测实测：2026-10-08（CDP localhost:3456 全程）
> 取代关系：本文取代 `批量排程架构方案.md`（v1，2026-10-07）的执行层结论——v1 的 Pinterest agent API 队列、原生 CSV Bulk、Buffer 付费 CSV 三通道全部废弃（用户 10-09 裁定）。v1 的发布时间科学、板策略分析仍有效，本文引用不重抄。
> 来源分级：**本文 §1 探测结论全部为实测**（Buffer UI 实抓，代码级证据）；标〔推断〕处为基于证据的推论。

---

## 0. 背景定案（用户 10-09 裁定）

| 项 | 定案 |
|---|---|
| 存量定制 pin | **全删清零重来**（7 个板保留，板内空） |
| RSS / CSV / Standard API | **全部关闭放弃**（Buffer API 公开 token 已被 legacy 通道拒；Pinterest 线同理不碰） |
| 唯一发布通道 | **Buffer 网页 UI**（CDP 操作第三方 SaaS=安全，无 Pinterest 反自动化风险——与 Meta Business Suite 的红线不同，Buffer 是已过审中间商，我方只是模拟人手填表） |
| 素材策略 | 站内几百页一天一条也够；**图片复用就生图**——生图同时替换网站 + 发社媒（一图两用） |
| 素材库现状 | 542 条 100% 唯一图 + 74 张生图就位（本地 `pin-gen-images/`）+ feed 已关 |

---

## 1. 探测结论（2026-10-08 实测）

### 1.1 账户与套餐

| 项 | 实测值 |
|---|---|
| 登录态 | lzn184205909@gmail.com（owner），已登录 |
| **套餐** | **Free Plan**（Billing 页明文："You're on the Free plan with up to 3 channels"） |
| 队列上限 | **10 scheduled posts per channel**（免费档滚动上限，Billing 页明文） |
| 其他配额 | 100 ideas / 1 user / 1 API key / Basic analytics |
| 时区 | **Shanghai**（队列页 Timezone 实测）——配 posting schedule 时须按美东流量峰倒算（见 §3.3） |
| 已连频道 | **2/3**：`CushionMill (facebook)`〔用户此前 OAuth 残留〕+ `00cfjrq2x1vptrvnzzqscovuwyldgl (pinterest)` |
| Pinterest 连接 | **已完成，无需用户再点 OAuth**。channel id `6ac751946a5c39ccb64e3622`；composer 能读到 Pinterest 板（默认选中 Custom Bench Cushions，即 7 板已同步） |
| 当前队列 | Queue 0 / Drafts 0 / Sent 6（历史测试痕迹，无待清理项） |
| 付费档参考 | Essentials $120/年（2 channels，Unlimited posts）/ Team $240/年——**当前不升**，10 槽滚动够用（§3 论证） |

**注意**：频道名 "CushionMill" 被给了 Facebook 频道（OAuth 时命名），Pinterest 频道显示原始用户名。不影响功能；可选动作：断开 Facebook 频道（反正不用，还能防 composer 频道记忆混乱——CDP 管线已做 deselect 校验，不断开亦可）。

### 1.2 UI 可操作性结论（一句话）

**完全可行——composer 全字段（图/描述/Title/Destination Link/板/定时）均可用 eval 注入驱动，图上传、Slate 文本、React 受控 input 三类写入全部实测通过。**

实测通过的写入路径（细节见 §7）：

| composer 字段 | 写入方法 | 实测 |
|---|---|---|
| 图片上传 | canvas/File → DataTransfer → `input[type=file][multiple]`.files → dispatch change | ✅ 测试图出现在 composer（Edit Image/Remove image 出现） |
| 描述文本（500 字限） | Slate contenteditable：focus + `document.execCommand("insertText")` | ✅ |
| Title | `input[placeholder="Your pin title"]` + 原生 value setter + input 事件 | ✅ |
| Destination Link | `input[placeholder="Enter destination link..."]` 同法 | ✅ |
| Pinning To（板） | 默认已选 Custom Bench Cushions；切换待管线开发时实测〔推断：同为 Radix 下拉，pointerdown 序列同 §7.4〕 | ⏳ |
| 定时模式 | 四选一菜单：**Next Available**（默认，队列模式）/ Prioritize / Now / Set Date and Time | ✅ 菜单结构实抓 |
| 频道切换 | cmdk 下拉，pointerdown+mouseup+click 事件序列可靠触发；composer 有频道记忆，每次须校验只选 Pinterest | ✅ |

对 Business Suite 评估的继承结论：无 iframe 编辑器、无 shadow DOM、无 canvas 渲染输入区——**比 MBS 更好操作**。composer 还带 "Create Another" 按钮（保存并继续下一条），批量循环时不用反复开关弹层。

### 1.3 CSV 批量导入：不存在（免费版确认）

- 设置全菜单（Profile/Preferences/General/Channels/Billing/Tags/API/Apps & Extras/Beta/Integrations）、队列页 More actions、Apps & Extras 三个层面全部实查：**无 import/CSV/upload 入口**。
- v1 调研口径：CSV 上传是付费档功能（100 条/次）。用户已定案唯一通道=网页 UI 手动/CDP 排入，不走 CSV——此项结论：**无需依赖，彻底关闭**。
- 批量能力的实际承担者=CDP 排帖管线（§7），配 Free 10 槽滚动。

### 1.4 Tabbit 通道技术坑（CDP 排帖管线开发必读）

1. **eval / click 端点的 POST body 必须原样直传**：不带 `body=` 前缀、不做 URL 编码——服务端把 raw body 原样转交给 `Runtime.evaluate` / `querySelector`。带前缀或编码必报 Uncaught / invalid selector（本次探测踩坑 40 分钟定位，坑因：`body=document.title` 恰是合法 JS 赋值，掩盖了问题）。
2. eval 支持任意 JS（IIFE/async 均可），click 端点支持任意 CSS 选择器（含 `:has()`）。
3. Radix/cmdk 组件（频道下拉、定时菜单）需要 **pointerdown + mouseup + click 三事件序列**，纯 click() 无效。
4. React 受控 input 写值必须用 **原生 value setter**（`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set`）+ dispatch input 事件，直接赋 value 不触发 React 状态。
5. Buffer 页面偶发自动跳转（登录态初始化/OAuth 残留回调），tab 可能丢失——管线每步先 `/info` 校验存活再操作。

---

## 2. 架构

```
pin-素材库.json（542 条：img/title/link/desc/board）
        │
        │  ① CDP 排帖管线（Tabbit eval，§7 SOP）
        ▼
Buffer 队列（Free：10 槽/频道滚动，Next Available 模式自动落位）
        │
        │  ② Buffer 按 posting schedule 定时发布
        ▼
Pinterest 7 板（板名与素材库 board 字段一一对应，实测同步正常）
        │
        ├── ③ KPI：Buffer Basic analytics（过程指标）+ Pinterest 原生 Analytics（outbound clicks 权威源）
        ▼
cushionmill.com 落地页（Destination Link 全带，UTM 规则见 §6）
```

- 每日维护动作只有一步：**跑一次 CDP 排帖管线，把队列补满到 10 槽**（约 3-5 分钟）。
- 素材库消耗与生图循环见 §4；542 条 × 当前节奏可用 6-9 个月，远期内循环补池。

## 3. 节奏与队列运作

### 3.1 节奏定案：**3 条/天起步**（区间 1-3，先跑满）

- 3 条/天 × 10 槽 = 队列常滚 3.3 天深度，每天补 3 条即满；542 条吃 **181 天（6 个月）**。
- 2 条/天 = 271 天；1 条/天太慢（养号期后 Pinterest 算法偏好稳定输出，1 条/天仅作降级档）。
- 判断依据〔推断〕：新账号冷启动期稳定 3 条/天优于脉冲式批量；Pinterest 原生 scheduler 上限也是 10 条，同为 10 槽滚动无额外风险。

### 3.2 队列运作细节

- 定时模式固定用 **Next Available**（默认）：管线只管灌内容，落位时刻交给 Buffer 的 posting schedule——这就是"零日常关注"的免费版实现。
- posting schedule 首次配置（**待办，一次性**）：queue 页 → 设置每日 3 个发布时刻。时刻按美东流量峰（v1 `批量排程架构方案.md` §二的时刻表：晚 8-11 点美东为主）换算成上海时间录入；夏令时切换时（11 月/3 月）核对一次。

### 3.3 时区红线

Buffer 账户时区=Shanghai（实测）。posting schedule、队列显示均按上海时间。**换算错误=发布时刻全偏 12-13 小时**，配置后必看队列页第一条的落位时刻是否等于预期。

## 4. 生图循环（一图两用）

优先级顺序：

1. **新素材优先**：站内几百页仍有未入池页面（指南/品类页/cover 线新页）——每轮先扫 sitemap 对比素材库 link 字段，未入池页面直接从站内现有 featured/内文图取图入池（零成本）。
2. **复用就生图**：某页面图已在池中被用过、或该页无 Pinterest 竖版（2:3）适配图时——走 moleapi 生图（知识库已有策略文档与白名单纪律），一次生成 1000×1500 竖版。
3. **一图两用**：生图产物先传 WP 媒体库替换/补充站内对应页配图 → URL 进素材库 → 同一张图既服务 SEO 页面又服务 pin。生图存量：`pin-gen-images/` 共 73 张（+gen-state.json），**其中 69 张已上传入池**（文件名与素材库 URL 交集实测），仅 4 张待补入——一图两用闭环已跑通过一轮，循环继续按此模式。

生图三禁、白名单纪律按知识库既有 SOP 执行，不在本文重复。

## 5. 板策略（7 板沿用，实测已同步到 Buffer）

| 板 | 素材库条数 | 占比 | 每日 3 条的轮换权重 |
|---|---|---|---|
| Cushion Guides & Ideas | 236 | 43.5% | ~1.3 条/天 |
| Custom Patio Cushions | 195 | 35.9% | ~1.1 条/天 |
| Custom Chair Cushions | 38 | 7.0% | 2-3 天 1 条 |
| Specialty Custom Cushions | 28 | 5.2% | 2-3 天 1 条 |
| Custom Indoor Cushions | 21 | 3.9% | 3-4 天 1 条 |
| Custom Bench Cushions | 20 | 3.7% | 3-4 天 1 条 |
| Custom Cushion Covers | 4 | 0.7% | 周期 1 条 |

- 轮换目的〔推断〕：避免单板独占 feed 触发算法降权；产品板（Patio/Chair/Bench）带转化链接为主，Guides 板养搜索覆盖。
- 板选择在 composer 的 Pinning To 下拉完成，素材库 `board` 字段值与 Pinterest 板名已对齐（7/7 匹配）。

## 6. KPI 观察项

| 指标 | 数据源 | 频率 | 看什么 |
|---|---|---|---|
| **outbound clicks**（核心） | Pinterest 原生 Analytics（权威源；Buffer 免费分析不含点击归因） | 周 | 哪些 pin/板在导流→决定生图循环往哪个方向加投 |
| impressions / saves | Pinterest Analytics | 周 | saves 高=素材 resonates，进生图参考 |
| 队列健康（10 槽是否满） | Buffer 队列页（CDP 可查） | 日 | 排帖管线自检项 |
| 发布成功率 | Buffer Sent 列表 vs 排帖台账 | 周 | 漏发/publish error 捕获 |
| 落地侧 | GSC（免费引流面板）+ 站内 inquiry 表单来源 | 月 | Pinterest 流量的询盘转化（UTM 见下） |

**UTM 规则**：Destination Link 统一带 `?utm_source=pinterest&utm_medium=social&utm_campaign=board名简写`〔待管线实现时定稿具体值〕。注意：Pinterest 出站跳转会经 pinterest.com/outbound 中转，GA 直接流量会偏高——归因以 GSC+Pinterest Analytics 交叉为准。

## 7. CDP 排帖管线 SOP（已验证路径，开发即用）

> 环境：Tabbit（CDP localhost:3456，`curl --noproxy '*'`）。素材源：`pin-素材库.json`。

### 7.1 单条排帖流程（选择器全部实测）

```
1. /new 打开 https://publish.buffer.com/schedule/queue → /info 校验加载完成
2. 点击主区 "New Post" 按钮（filter: innerText==="New Post" 且 getBoundingClientRect().x>500）
3. 校验频道：dialog 内应只有 "Deselect 00cfjrq2x1vptrvnzzqscovuwyldgl"
   - 若 Facebook 也在选（频道记忆）：点 "Deselect CushionMill"
   - 若 Pinterest 未选：点 "Add channel" → 对 [cmdk-item] 含 00cfjrq 的项发 pointerdown+mouseup+click
4. 图片注入（见 7.2）→ 等上传完成（dialog 出现 "Edit Image"）
5. 描述：[contenteditable=true].focus() → execCommand("insertText", 素材.desc)（截 480 字防 500 限）
6. Title：input[placeholder="Your pin title"] 原生 setter + input 事件（截 100 字〔Pinterest 标题上限待实测确认〕）
7. Destination Link：input[placeholder="Enter destination link..."] 同法（素材.link + UTM）
8. 板：点 "Pinning To" 下拉 → 选素材.board（Radix 菜单，pointerdown 序列；⏳ 首次开发实测）
9. 确认定时按钮显示 "Next Available"（默认即队列模式）→ 点 "Schedule Post"
10. 若继续排下一条：点 "Create Another"（⏳ 行为待实测：预期保存当前并清空继续）
```

### 7.2 图片注入的两条路径（按优先级）

- **路径 A（优先实测）**：页面内 `fetch(素材.img URL) → blob → new File → DataTransfer → input.files → dispatch change`。**风险**：publish.buffer.com 页面跨域 fetch cushionmill.com，WP 默认无 CORS 头，大概率失败——一次实测即知，失败转 B。
- **路径 B（保底，无跨域问题）**：python 先下载素材图 → base64 → eval 传入页面 → `fetch("data:image/png;base64,...")` → blob → File → DataTransfer。注意 base64 体积（1000×1500 JPEG 约 300-700KB/条），单条一次 POST，Tabbit body 上限未知——若超限先压缩质量再传。

### 7.3 批量循环与状态回写

- 每日一次：算出"10 - 当前队列数"= 今日应补条数 → 从素材库按板轮换权重（§5）取下 N 条 → 循环 7.1。
- 素材库 JSON 增加状态字段（`queued_at` / `published_at`），排入即写 `queued_at`，防重复取条；Buffer Sent 数对账写 `published_at`。
- 熔断：单条失败重试 1 次，连续 2 条失败停整批报告（防 UI 改版后盲写）。

### 7.4 Radix/cmdk 菜单通用触发器（已验证）

```js
el.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));
el.dispatchEvent(new MouseEvent("mouseup",{bubbles:true}));
el.click();
```

---

## 8. 下一步分工

**agent（我方）：**
1. 开发 CDP 排帖管线脚本（§7，含 7.2 路径 A/B 实测、板切换实测、Create Another 行为实测）
2. 首次跑通后排 3 条/天 × 3 天观察队列运作与发布成功率
3. 生图循环续跑：4 张未入池生图补入 + 下一轮未入池页面扫描（§4）

**用户（你方）：**
1. queue 页配置 posting schedule：每日 3 时刻（美东晚峰换算上海时间，§3.2/3.3；或告诉我时刻我来配）
2. 决定 Facebook 频道去留（§1.1 建议：断开，释放心智；2 分钟操作）
3. 首批发布后一周，一起看 Pinterest Analytics 的 outbound clicks 定方向（§6）

**升级触发器**（何时考虑付费）：日节奏想提到 3 条/天以上（10 槽不够滚）/ 需要 Hashtag manager / First comment / 高级分析。在此之前 Free 档完全承载。

---

## 附：探测痕迹归档

- 探测截图：`temp/buffer_*.png`（calendar/schedule/channels/composer/menu/queue/filled）
- 测试污染：零（composer 测试内容已清空关闭，Queue 0 / Drafts 0，无草稿残留）
- 历史工件处置：`csv-批次/batch-001.csv`、`pin-素材库.json.bak` 为已废弃通道残留，可归档不删（git 可溯）
