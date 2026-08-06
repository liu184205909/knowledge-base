# T17 素材分类与浏览 Tab 决策（待实施）

状态：**分类决策已形成，尚未迁移插件数据库或改写导入 CSV。**

## 结论

> 2026-07-20 correction: the earlier automatic classification was invalid. It
> confused Variant counts with material counts and put shaped materials into
> Crystals. The only approved active storage values are now `crystal` and
> `accessory`. Source menu `水晶` and `天然石` map to `crystal`; source menu
> `配饰` and `随型` map to `accessory`. Packaging is removed from the active
> catalog, editor, and quote until separately approved. No 235-image mapping
> may be regenerated or imported until every record has this source-category
> evidence recorded.

编辑器主 Tab 固定为两个：

1. `Crystals`：所有可串接的珠类素材；
2. `Accessories`：所有非珠类、可加入手链配方的配件。

`Charms`、`Packaging` 和 `Cord` 不再作为编辑器主 Tab。

## 为什么不是五个 Tab

2026-07-20 对当前 235 张本地素材及其 348 条 Variant 的回读结果：

| 当前后端值 | Variant 数 | 现有分类 | 用户可见归属 |
| --- | ---: | --- | --- |
| `bead` | 220 | `crystal` 216、`natural-stone` 4 | `Crystals` |
| `decor` | 128 | `accessory` 127、`charm` 1 | `Accessories` |
| `finish` | 0 | 无 | 不显示为素材 Tab |
| 包装数据 | 0 | 无 | Finish Design 的包装选择，不进入串珠目录 |

这说明：

- `Charms` 只有一个素材，独立成顶级 Tab 会产生空、弱的浏览体验；吊饰、流苏、挂件本质上都属于配饰的子类。
- `Packaging` 当前没有任何素材，也不应被插入手链 sequence；它应该在 Finish Design 内作为订单选项保存到快照。
- `Cord` 是制作/收尾配置，不是当前用户逐个添加的素材卡；当前 UI 已运行时移除了该 Tab，说明它是遗留标记而非有效产品结构。
- 截图中的“天然石、随型、文玩”不适合作为与 Crystal 并列的顶级 Tab。它们应由 Crystals 的二级分类/筛选承接；不可串接的文玩不进入 T17 DIY 目录。

## 用户可见的信息架构

### Crystals

二级分类（左侧分类栏或移动端横向筛选）：

- All Crystals
- Crystal Beads
- Natural Stones

`随型` 若有穿孔、长度、重量、价格和可串接规则，归入 `Shaped Stones`；否则不进入 DIY 素材库。

### Accessories

二级分类：

- All Accessories
- Spacers & Caps（隔珠、隔片、花托、跑环）
- Accents（戒、金属件、焦点装饰）
- Charms & Pendants（吊饰、吊坠、挂件、流苏）
- Shaped stones（方糖、双尖、雕件、切面珠、水晶随型）

“吊饰 1”应为 `Accessories > Charms & Pendants`。其向外展开是 Variant 的自动布局规则（通常 `radial_out`），不是一个独立 Tab 或全局方向按钮。

### Finish Design

包装不作为 sequence item。它在 Finish Design 中选择，例如 `Box`、`Pouch`、`Card`，并以 `packaging` 快照字段随报价、购物车和订单保存。

## 后端分类合同

当前 `bead / decor / finish` 是技术名和业务名混用的根源。实施时采用下面的语义：

| 新存储类型 | 用户文案 | 是否可加入 sequence | 典型类别 |
| --- | --- | --- | --- |
| `crystal` | Crystals | 是 | crystal、natural-stone |
| `accessory` | Accessories | 是 | spacer、bead-cap、accent、charm、pendant、tassel |
| `packaging` | Packaging（仅 Finish Design） | 否 | box、pouch、card |

迁移规则：

- 旧 `decor` 统一迁移为 `accessory`；旧 CSV 导入可暂时接受 `decor`，但导入时规范化成 `accessory`。
- 旧 `finish` 只作为旧包装记录的兼容别名，迁移为 `packaging`；不能继续渲染为 Cord Tab。
- `component_type` 只描述配方/报价语义；`category_slug` 描述二级浏览分类；不新增重复的顶级 `tab` 字段。
- 方向、适配珠径、占位长度、相邻规则继续绑定到 Variant。`accessory` 可有方向规则；`bead` 与 `packaging` 不可拥有方向规则。

## 管理界面命名

插件文件/功能总名继续是 **EarthWard T17 Bracelet Builder**，因为它不止管理目录，还负责报价和订单快照。

后台菜单和页面标题改为：

- 菜单：`T17 Materials`
- 页面：`DIY Materials Library`
- 两个快捷入口：`Crystal Library`、`Accessories Library`
- 包装管理（以后有数据时）：`Packaging Options`，放在 Finish Design 设置，不放在 Materials Grid。

不使用 “T17 Material Catalog” 作为主名称：它像开发对象名，不能说明这是独立于 Woo 商品的 DIY 素材库。

## 实施边界与验收

实施将同时更新插件类型校验、数据库升级、CSV/REST 合同、报价校验、后台菜单、前端 Tab 匹配与本地 235 素材映射；不可只改显示文字。

验收时必须证明：

1. 235 个现有记录按 `bead -> Crystals`、`decor -> Accessories` 正确显示；
2. 吊饰显示在 Accessories 的子类中，且方向规则仍可被服务器校验；
3. Packaging 不出现在素材卡 Tab，也不计入手链长度/件数；
4. 旧 `decor` / `finish` 数据在升级后没有丢失或误变成普通 Woo 产品；
5. REST、报价、购物车和订单快照使用的新语义通过回读。
