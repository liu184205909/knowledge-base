# T17 水晶手链定制工具 - 工程实现目录

本目录是 v3 需求基线的工程落地。需求与架构决策见 [`02-网站规划/T17水晶手链定制工具-v3需求基线.md`](../../02-网站规划/T17水晶手链定制工具-v3需求基线.md)。

## 当前代码事实源

- `frontend/t17-builder-ui.js` 是后续前端交互优化的唯一主脚本，不再从旧截图或历史 ZIP 反推代码。
- `frontend/t17-builder-ui.css`、`t17-builder-fragment.html`、`t17-builder-config.php` 与 `t17-builder-mock-config.js` 是主脚本的必要配套文件，不属于可删除的旧版本。
- `plugin/` 是独立素材、REST、报价和 Woo 快照的后端源码；前端优化阶段仍需保留，不能用 `t17-builder-ui.js` 替代。
- `frontend/preview.html` 只用于本地开发验收，不是正式页面。
- 当前插件源码版本为 `0.1.10`。`build/` 中更早的 ZIP 只是历史候选包，不是源码事实源。

## 目录结构

```
crystal-bracelet-builder/
├── plugin/          WordPress 插件源码（后端数据模型、REST、Woo 加购）
├── frontend/        独立前端 UI 包（HTML/CSS/JS，不依赖插件上传）
├── data/v3/         生产数据与导入包
│   └── research/    P0 研究数据（素材 / 官方设计 / 价格 三条独立数据线）
├── scripts/         本地验证脚本（源码检查、线上版本验证、素材闭环）
└── build/           本地候选插件包；不得保留 3D 原型或 Three.js 资产
```

## 关键文档入口

| 文档 | 作用 |
|---|---|
| [data/v3/README.md](data/v3/README.md) | v3 数据包总入口：生产数据状态边界、导入审批流程 |
| [data/v3/research/README.md](data/v3/research/README.md) | P0 研究数据包入口：素材/官方设计/价格三条数据线说明 |
| [data/v3/research/P0-数据包交接摘要-20260713.md](data/v3/research/P0-数据包交接摘要-20260713.md) | 素材/官方预设数据线交接记录 |
| [data/v3/research/P0-数据线边界与字段说明-20260713.md](data/v3/research/P0-数据线边界与字段说明-20260713.md) | P0-A/B/C 各线字段定义与采集规则 |
| [data/v3/research/Earthward-首批定价模型与审核说明-20260713.md](data/v3/research/Earthward-首批定价模型与审核说明-20260713.md) | 价格版本管理、审核字段、审批流程 |
| [data/v3/research/stonelab-interaction-direction-audit-20260717.md](data/v3/research/stonelab-interaction-direction-audit-20260717.md) | StoneLAB 商品卡、交互、碰撞、方向与竞品素材使用边界的唯一事实源 |
| [interaction-acceptance-spec-20260718.md](interaction-acceptance-spec-20260718.md) | v3 当前前端交互验收合同；桌面/手机共用的行为边界 |
| [design-qa.md](design-qa.md) | 已执行的本地视觉与交互验证证据，不替代需求合同 |
| [plugin/README.md](plugin/README.md) | 插件安装、后台菜单、CSV 导入说明 |
| [frontend/README.md](frontend/README.md) | 独立前端 UI 包：HTML/CSS/JS 分离交付说明 |
| [scripts/README.md](scripts/README.md) | 验证脚本：本地源码检查、线上版本验证、素材闭环 |

## 阅读顺序建议

1. **理解需求**：先读 `02-网站规划/` 下的 v3 需求基线
2. **了解数据**：读 `data/v3/README.md` → `data/v3/research/README.md`
3. **开发后端**：读 `plugin/README.md` + `scripts/` 下对应验证脚本
4. **开发前端**：先读 `interaction-acceptance-spec-20260718.md`，再读 `frontend/README.md`
5. **回读竞品结论**：只读 `data/v3/research/stonelab-interaction-direction-audit-20260717.md`；不要重新从零浏览同一批 StoneLAB 视频
