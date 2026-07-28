# T17 前端源码

`t17-builder-ui.js`、`t17-builder-ui.css` 和 `t17-builder-fragment.html` 是 v3 2D 编辑器事实源；插件内同名文件必须保持一致。

## 本地 fixture

`preview.html` 只用于本地验收，加载 `t17-builder-mock-config.js` 和灵感石草稿目录。它禁用 Woo 加购，素材和价格均不可作为生产数据使用。用 `?t17_design=9001` 可检查官方设计导入路径的本地 fixture。

## 线上运行

线上通过插件 shortcode 输出编辑器，并由 `EW_T17_UI_CONFIG` 提供 REST、nonce、购物车和托盘配置。前端不得保存价格、配方或 Catalog 规则；这些均以服务端接口为准。

## 本地检查

```powershell
./validate-frontend-bundle.ps1
node --check ./t17-builder-ui.js
```
