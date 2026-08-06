# Minor 牌义文章 · 生产执行版 Brief v1

> 写手 / AI 生产单篇时**只看本档**。策略 / 合规见 [母框架](模板-Tarot-Minor牌义框架.md)，审核见 [QC 清单](Checklist-Tarot-Minor牌义-QC.md)。
> **前置**：`minor-knowledge.json`（56 条）已就绪。生产 = **从数据层取值 → 填模块 → 自检**，不边写边判断。

---

## 1. 单篇关键字段（从 `minor-knowledge.json` 取该牌对象）

| 字段 | json 路径 | 示例（Two of Wands） | 示例（Page of Cups） |
|---|---|---|---|
| URL | `/tarot-{slug}-crystals/` | `/tarot-two-of-wands-crystals/` | `/tarot-page-of-cups-crystals/` |
| Card Type | `card_type` | number | court |
| Suit / Element | `suit` / `suit_element` | wands / fire | cups / water |
| Archetype | `archetype` | The Planner at the Threshold | The Dreamer |
| **Progression**（数字牌） | `progression_meaning` / `progression_position` | decision / future planning | — |
| **Court Role**（宫廷牌） | `court_role` / `court_archetype` | — | page / The Dreamer |
| **as Feelings / as Person**（宫廷） | `as_feelings` / `as_person` | — | 从 json 取 |
| Love / Career / Finances | `love_meaning` / `career_meaning` / `finances_meaning`（+ `_reversed`） | 从 json 取 | 从 json 取 |
| yes / no | `yes_no` / `yes_no_reversed` | yes / maybe | yes / maybe |
| Crystals（5 角色） | `crystals.best_overall/upright/reversed/love/daily_wear` | citrine-meaning 等 | moonstone-meaning 等 |

---

## 2. 模块填空（数字牌 vs 宫廷牌**双轨**，1500-2200 词）

| 模块 | 数字牌 | 宫廷牌 | 自检 |
|---|---|---|---|
| Intro + Hero | 写 | 写 | 含主 KW |
| M1 at a Glance | 写（含 yes/no 速答） | 写（含 yes/no） | Featured Snippet bait |
| **M-Suit 花色×元素** | 写 | 写 | 落该花色元素基调 |
| **M2 Upright** | 写 | 写 | 落 Rider-Waite 画面 + 花色基调 |
| **M-Progression**（数字 N） | ✅ 写 | ❌ 跳过 | 数字 × 花色独有 progression |
| **M-Archetype**（角色） | ❌ 跳过 | ✅ 写（含 as feelings / as a person） | 角色 × 花色独有 archetype |
| M3 Reversed | 写 | 写 | shadow aspect 口径 |
| **M7 Love/Career/Finances** | 写三段（正位 + 逆位） | 写三段（正位 + 逆位） | 从 json 取，非泛化 |
| M4 Crystals 5 角色 | 写 | 写 | 花色元素映射 + slug 带 -meaning |
| M5/M6/M8/M9/M11/M12 | 写 | 写 | 复用 Major |

---

## 3. 生产顺序

1. 从 `minor-knowledge.json` 取该牌全字段
2. 判 `card_type`：number → 写 M-Progression 跳 M-Archetype；court → 写 M-Archetype 跳 M-Progression
3. M7 三段从 json `love/career/finances_meaning` 取（已含正逆位各 6 段，直接用）
4. M4 5 角色水晶从 json `crystals` 取（slug 已带 `-meaning`，对齐 390 库）
5. 内链按母框架 §7 配方（4-6 条）
6. 自检 QC 关卡 0-5

---

## 4. 水晶口径

反思辅助非改结果（同 Major / 是与否）：
- ✅ "Carnelian supports the courage Two of Wands asks for as you choose a direction"
- ❌ "Wear Carnelite to guarantee success"

---

## 5. 合规快查（Swords 阴影牌 + Five of Pentacles 必看）

- **逆位口径**：shadow aspect / invitation to reflect，禁 `curse` / `bad omen` / `evil`
- **Three / Nine / Ten of Swords**：M3 + FAQ 不医疗化（不诊断失眠/焦虑/抑郁为疾病，只描述情绪体验）；水晶不承诺疗效（如 Nine of Swords 的 Amethyst 仅写"traditionally placed under pillow"）
- **Five of Pentacles**：M7 finances + FAQ 不投资建议、不承诺脱贫、含 "seek qualified support where appropriate"
