# WordPress MCP 插件开发 SOP

> 日期：2026-07-28 | 适用：PagePilote 及后续 WordPress MCP 插件项目

---

## 1. 前置条件

| 工具 | 用途 | 版本 |
|------|------|------|
| Local by Flywheel | 本地 WordPress 开发环境 | WP 6.9+ |
| Elementor | 页面构建器（测试用） | 3.x / 4.x |
| PHP CLI | 语法校验 `php -l` | 7.4+ |
| Composer | 依赖管理 | 2.x |
| Git | 版本控制 | - |
| curl / Python requests | MCP 协议测试 | - |

---

## 2. 核心原则（教训总结）

### 不做

| ❌ 禁止 | 原因 |
|---------|------|
| Fork 其他插件 | EMCP fork 导致反复崩溃（freemius stub / text domain / option 共享）|
| 在生产站点测试 | 导致网站 500 / 数据库连接耗尽 |
| 用 gettext filter 中文化 | 污染同站其他插件 |
| `permission_callback = __return_true` | 安全漏洞 |
| 激活即开放远程控制面 | 安全部署的大忌 |
| 全局禁用其他插件的默认 Server | 影响其他 MCP 插件 |
| 用 `updated_post_meta` hook 做 CSS 重生 | 前台任何 meta 更新都会触发 |
| 用 transient 做并发锁 | 非原子操作，可能双写 |

### 必做

| ✅ 要求 | 原因 |
|---------|------|
| 从零开发，用官方 wordpress/mcp-adapter | 代码可控，无历史包袱 |
| 先写 PRD + 契约文档再写代码 | 避免"边改边炸" |
| 前台零副作用硬门槛 | 插件激活不改变前台渲染 |
| 渐进式风险暴露（A/B/C/D 四级） | 安全默认 + 按需开启 |
| 两步 token 确认（D 级操作） | 防止 AI 模型自动携带 confirm:true |
| 资源级 allowlist（路径/表/SQL） | 防止任意写入 |
| Composer lockfile + vendor/ 打包 | 可复现构建 |
| 本地 → staging → 生产 三阶段测试 | 不跳过任何阶段 |

---

## 3. 文档优先级（先文档后代码）

```
PRD（产品需求）
  ↓ 引用
├── Tool Catalog（工具唯一事实源）
├── Adapter Integration Contract（技术规范）
├── Safety Contract（安全规范）
└── 竞品分析（市场定位）

文档全部审查通过 → 标记"可执行" → 开始写代码
```

---

## 4. 开发阶段

### Alpha（底座，3-5 天）

不开发具体工具，只搭建框架 + 验证安全契约：

1. Composer 初始化 + lockfile
2. Adapter 集成（vendor/autoload.php 加载 + 版本冲突检测）
3. MCP server 注册（`create_server()` + transport 权限）
4. 权限分级（RiskLevel.php + A/B/C/D 默认策略）
5. 审计日志（CPT + 脱敏规则）
6. 快照机制（原子锁 + gzipped JSON + 上限）
7. 两步 token 确认（preview → token → execute）
8. 管理面板（Dashboard + Connection + 工具开关）
9. **前台零副作用验证**（硬门槛）

### Beta（工具实现，10-15 天）

在 Alpha 底座上按能力域批量开发：

| 顺序 | 能力域 | 工具数 |
|------|--------|--------|
| 1 | Core（WordPress CRUD） | ~50 |
| 2 | Elementor（页面构建） | ~50 |
| 3 | Gutenberg（区块操作） | ~10 |
| 4 | Integrations（ACF/CF7/SEO） | ~20 |
| 5 | Operations（文件/数据库/搜索） | ~15 |
| 6 | Security（安全/性能） | ~5 |
| 7 | PagePilote 差异化（CSS 重生/Skills/SEO） | ~10 |

**开发方式**：一次性批量开发（AI 优势），开发完后按域逐个验收。

### v2.0.0（发布，2-3 天）

1. 本地完整测试
2. PHP 语法校验全部文件
3. Staging 完整 MCP 流程测试
4. 视觉回归（截图像素对比）
5. 安全审查
6. 打包 zip + 文档

---

## 5. 测试流程

### 本地（每次提交）

```bash
# 1. PHP 语法校验
find . -name "*.php" -not -path "./vendor/*" | xargs php -l

# 2. MCP 协议测试
curl -X POST http://localhost:10003/wp-json/pagepilote/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1,"params":{...}}'

# 3. 工具调用测试
curl -X POST ... -d '{"jsonrpc":"2.0","method":"tools/call","id":2,"params":{"name":"pagepilote-list-pages","arguments":{}}}'
```

### Staging（每次发布前）

1. 安装 PagePilote
2. 截图对比（安装前 vs 安装后 vs 停用后）→ 像素必须 100% 相同
3. 负向测试（未认证 / 错误密码 / C 未开启 / D 无 token / 越权）
4. MCP 完整流程（initialize → tools/list → tools/call × N）

### 生产（发布后）

1. WP 后台上传 zip + 启用
2. 监控首页响应时间（< 3 秒）
3. 如果异常 → 立即停用 → 查 debug.log

---

## 6. 安全检查清单

发布前逐项检查：

- [ ] 前台零副作用（10 条禁止全部通过）
- [ ] 安装/启用/停用/卸载不改变前台渲染
- [ ] 匿名首页 + Elementor 页面截图像素对比
- [ ] 响应时间增量 < 100ms
- [ ] 未认证 → 401
- [ ] 错误密码 → 401
- [ ] MCP 关闭 → 403
- [ ] C 级未开启 → 403
- [ ] D 级无 token → 403
- [ ] 跨资源越权 → 403
- [ ] 版本冲突 → fail-closed + admin notice
- [ ] 无 Elementor → 不崩溃 + 工具隐藏
- [ ] PHP error log 无 Fatal Error
- [ ] 审计日志正确记录 + 脱敏
- [ ] 快照正确保存 + 并发锁验证
- [ ] 文件路径 allowlist 生效
- [ ] 数据库表 allowlist 生效
- [ ] SQL 类型 allowlist 生效
- [ ] 敏感字段脱敏生效
- [ ] 两步 token 确认流程完整

---

## 7. 目录结构规范

```
项目名/
├── 01-竞品分析/
├── 02-参考资料/
│   ├── 原始代码/          # 参考的 GPL 代码（只读）
│   └── 研究报告/          # 技术调研
├── 03-技术设计/
│   ├── PRD-vX.Y.md       # 产品需求文档
│   ├── Tool-Catalog.md   # 工具唯一事实源
│   ├── Adapter-Contract.md
│   ├── Safety-Contract.md
│   └── ...
├── plugin/               # 插件代码
│   └── 项目名/           # 实际插件目录
├── scripts/              # 构建脚本
└── 归档/                 # 废弃版本
```

---

## 8. 版本规范

- **PRD 版本**：v2.1, v2.2, ...（文档迭代）
- **插件发布版本**：v1.0.0, v2.0.0, ...（语义化版本）
- 两者独立，不混淆
