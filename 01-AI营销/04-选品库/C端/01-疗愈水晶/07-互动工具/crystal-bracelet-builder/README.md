# T17 水晶手链定制工具 - 工程实现目录

本目录是 v3 需求基线的工程落地。需求与架构决策见 [`02-网站规划/T17水晶手链定制工具-v3需求基线.md`](../../02-网站规划/T17水晶手链定制工具-v3需求基线.md)。

## 目录结构

```
crystal-bracelet-builder/
├── plugin/          WordPress 插件源码（后端数据模型、REST、Woo 加购）
├── frontend/        独立前端 UI 包（HTML/CSS/JS，不依赖插件上传）
├── data/v3/         生产数据与导入包
│   └── research/    P0 研究数据（素材 / 官方设计 / 价格 三条独立数据线）
├── scripts/         本地验证脚本（源码检查、线上版本验证、素材闭环）
└── build/           早期 3D 原型（已淘汰，仅保留交互研究价值）
```

## 关键文档入口

| 文档 | 作用 |
|---|---|
| [data/v3/README.md](data/v3/README.md) | v3 数据包总入口：生产数据状态边界、导入审批流程 |
| [data/v3/research/README.md](data/v3/research/README.md) | P0 研究数据包入口：素材/官方设计/价格三条数据线说明 |
| [data/v3/research/P0-数据包交接摘要-20260713.md](data/v3/research/P0-数据包交接摘要-20260713.md) | 素材/官方预设数据线交接记录 |
| [data/v3/research/P0-数据线边界与字段说明-20260713.md](data/v3/research/P0-数据线边界与字段说明-20260713.md) | P0-A/B/C 各线字段定义与采集规则 |
| [data/v3/research/Earthward-首批定价模型与审核说明-20260713.md](data/v3/research/Earthward-首批定价模型与审核说明-20260713.md) | 价格版本管理、审核字段、审批流程 |
| [data/v3/research/P0-overseas-handoff-20260713.md](data/v3/research/P0-overseas-handoff-20260713.md) | 海外竞品公开价格/规格证据（只读交接） |
| [plugin/README.md](plugin/README.md) | 插件安装、后台菜单、CSV 导入说明 |
| [frontend/README.md](frontend/README.md) | 独立前端 UI 包：HTML/CSS/JS 分离交付说明 |
| [scripts/README.md](scripts/README.md) | 验证脚本：本地源码检查、线上版本验证、素材闭环 |

## 阅读顺序建议

1. **理解需求**：先读 `02-网站规划/` 下的 v3 需求基线
2. **了解数据**：读 `data/v3/README.md` → `data/v3/research/README.md`
3. **开发后端**：读 `plugin/README.md` + `scripts/` 下对应验证脚本
4. **开发前端**：读 `frontend/README.md`
