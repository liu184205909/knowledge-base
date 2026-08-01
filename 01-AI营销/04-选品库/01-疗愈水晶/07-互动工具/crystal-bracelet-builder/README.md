# T17 水晶手链定制工具

## 当前状态（2026-07-25 已回读线上）

- 线上插件：公开 CSS/JS 均加载 `?ver=0.1.35`（2026-07-28 只读回读）。同日页面曾出现间歇性 WordPress `Database Error` 500，不能将资源版本更新视为稳定或视觉验收通过。本地 `0.1.41` 为下一轮候选包，尚未上传或部署。
- 本地 `0.1.41` 候选源保留已完成的分类与商品卡独立纵向滚动、120px 左对齐分类栏、420px 设计盘、受限的预览图尺寸与完整商品名提示；Catalog 两侧内边距为 5px，商品网格没有额外右留白。独立滚动商品网格固定桌面行轨道，防止 Crystal 的 All 列表及 Accessories 的标题、价格在卡片之间重叠。搜索改为非悬浮关键词筛选条；设计盘不会渲染文字或品牌图；工具工作区可按固定网站顶栏偏移对齐。尚未部署，必须完成构建和浏览器视觉验收后才能更新线上状态。
- 公开页面已是 v3 2D 编辑器（`.ew-t17-ui[data-t17-ui]`）。
- 公开 Catalog：281 个素材、453 个变体；英文名称与分类标签已事务更新并逐条回读，服务端报价已通过一条真实 Variant 的只读验证。
- 旧的 Step-0 Woo Snippet 已停用；当前隐藏承载商品仍名为 `Custom Crystal Bracelet Test` 且为 virtual。测试环境、履约策略、素材授权和成本/价格审批尚未完成，线上目录全部为 `onbackorder`，不能据此宣称可售准备完成。

## 代码事实源

- `frontend/`：唯一前端源码与本地 fixture；`preview.html` 只作本地验收。
- `plugin/`：素材、REST、报价、Woo 加购与订单快照；插件内前端副本必须与 `frontend/` 同步。
- `data/v3/`：本地导入合同和审批模板，不是线上 Catalog 的审批证明。
- `scripts/`：本地合同检查、候选包构建和公开只读验证。

## 只读验证

```powershell
./frontend/validate-frontend-bundle.ps1
./scripts/validate-backend-material-loop.ps1
./scripts/validate-directional-decor.ps1 -FailOnMissing
./data/v3/validate-v3-data-contract.ps1
./scripts/verify-live-post-upgrade.ps1 -BaseUrl 'https://goearthward.com' -VerificationScope Full -RequiredUiMarker 'ew-t17-ui'
```

`Full` 不会创建购物车或订单；它仍会明确报告交易闭环需要管理员测试。

## 入口文档

| 文档 | 用途 |
|---|---|
| [interaction-acceptance-spec-20260718.md](interaction-acceptance-spec-20260718.md) | 当前 2D 编辑器的交互验收合同 |
| [data/v3/README.md](data/v3/README.md) | 本地导入合同、审批边界与线上状态说明 |
| [scripts/README.md](scripts/README.md) | 验证与候选包命令 |
| [plugin/README.md](plugin/README.md) | 插件和 Woo 边界 |
| [frontend/README.md](frontend/README.md) | 前端源码与本地 fixture |
| [data/v3/research/stonelab-interaction-direction-audit-20260717.md](data/v3/research/stonelab-interaction-direction-audit-20260717.md) | 竞品交互与方向性依据 |
