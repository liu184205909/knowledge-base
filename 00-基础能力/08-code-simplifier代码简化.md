# Code Simplifier - 官方代码简化插件

> **Claude Code官方插件** | 自动优化代码质量 | 2026-01-09

---

## 🎯 核心价值

**Code Simplifier = AI时代的代码质量管理专家**

- ✅ **自动简化**：在不改变功能的前提下，让代码更清晰、更统一
- ✅ **强制规范**：执行项目编码标准（CLAUDE.md）
- ✅ **聚焦当下**：只优化最近修改的代码，不破坏已有代码
- ✅ **持续治理**：AI编程时代的"技术总监"，确保代码质量

---

## 💡 为什么需要 Code Simplifier？

### AI编程的痛点

**问题1：代码熵增**
```
刚开始：行云流水，AI指哪打哪
后来：代码越来越不对劲，逻辑嵌套像个迷宫
结果：功能实现了，但代码难以维护
```

**问题2：风格不统一**
```
一会儿用 try-catch，一会儿用 .then()
一会儿用 function，一会儿用箭头函数
结果：代码风格分裂，难以阅读
```

**问题3：过度简化**
```
为了追求"一行搞定"，写出嵌套三元运算符
为了减少代码行数，牺牲可读性
结果：代码变得更难理解
```

### Code Simplifier 的解决方案

**核心作用**：在不改变代码功能的前提下，让代码变得更清晰、更统一、更易读

**比喻**：就像在盖上行李箱之前，帮你把衣服一件件叠好、分类放进收纳袋里

---

## 🚀 安装方法

### 在 Claude Code 对话中安装

#### 方法1：从官方市场安装（推荐）

```bash
# 先更新官方插件市场
/plugin marketplace update claude-plugins-official

# 安装 code-simplifier
/plugin install code-simplifier
```

#### 方法2：使用命令行安装

```bash
claude plugin install code-simplifier
```

### 验证安装

```bash
# 查看已安装的插件
/plugin list

# 应该能看到 code-simplifier
```

---

## 📖 核心原则（5大铁律）

### 1. 绝对的功能守恒定律

**铁律**：永远不要改变代码的功能

- ✅ 只改变"怎么做"（how）
- ❌ 绝不触碰"做什么"（what）
- 所有原始特性、输出、行为必须保持原样

### 2. 强制执行家规

**读取 CLAUDE.md**：强制执行项目编码标准

- ES modules + 正确的导入排序和扩展名
- 优先使用 `function` 关键字而非箭头函数
- 顶层函数使用显式的返回类型注解
- 正确的 React 组件模式及显式的 Props 类型
- 正确的错误处理模式（尽可能避免 try/catch）
- 保持一致的命名约定

**解决问题**：AI编程中最大的痛点 - 风格不统一

### 3. 清晰度大于简洁度

**反直觉但正确的选择**

❌ **编程圈的坏风气**：
```javascript
// 为了炫技，写得像个天书
const result = condition ? (a ? x : y) : (b ? m : n);
```

✅ **Code Simplifier 的要求**：
```javascript
// 宁愿代码长一点、啰嗦一点，也要让人看懂
if (condition) {
  if (a) {
    result = x;
  } else {
    result = y;
  }
} else {
  if (b) {
    result = m;
  } else {
    result = n;
  }
}
```

**原文**：Choose clarity over brevity（选择清晰而非简短）

### 4. 拒绝过度简化

**平衡点**：不要为了简化而简化

避免：
- ❌ 为了减少代码行数，把不相关的功能硬凑在一起
- ❌ 移除有助于理解代码结构的抽象层
- ❌ 创造"过于聪明"但难以理解的解决方案

保持：
- ✅ 有益的抽象（提高代码组织）
- ✅ 合理的关注点分离
- ✅ 适当的注释（删除显而易见的）

### 5. 聚焦当下

**默认范围**：只关注最近修改或在当前会话中触及的代码

**原因**：
- 避免不了解历史遗留问题而把旧代码改坏
- 趁热打铁，刚写完立即整理
- 不浪费时间把整个项目翻个底朝天

---

## 🎯 使用方法

### 基本使用

#### 在 PSB 工作法的 Build 阶段使用

```
场景：你刚完成一个功能模块的开发

1. 不要急着提交代码
2. 对 Claude Code 说：
   "请使用 code-simplifier 帮我整理一下刚才修改的代码"
3. Claude Code 会自动：
   - 识别最近修改的代码部分
   - 应用项目编码标准
   - 简化复杂逻辑
   - 提高可读性
4. 检查优化后的代码
5. 提交
```

### 最佳实践

#### 1. 在 CLAUDE.md 中定义编码规范

```markdown
# 项目编码规范

## JavaScript/TypeScript
- 优先使用 `function` 关键字
- 使用显式返回类型
- 避免 try/catch，优先使用 .catch()

## React
- 函数组件 + Hooks
- Props 必须定义类型

## 命名约定
- 变量：小驼峰 (camelCase)
- 常量：大写下划线 (UPPER_SNAKE_CASE)
```

#### 2. 建议使用 Opus 模型

**为什么用 Opus？**
- 代码重构容错率极低
- 需要极强的逻辑理解能力
- Opus 的推理能力更强

**配置方法**：
```yaml
---
name: code-simplifier
model: opus  # 指定使用 Opus 模型
---
```

#### 3. 定制化配置

**找到插件配置文件**：
```bash
~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-simplifier/agents/
```

**根据团队口味微调**：
```yaml
# 示例：添加中文注释要求
- 所有注释必须使用中文
- 所有变量命名必须遵循小驼峰命名法
```

**把它当成模板，而不是标准**

---

## 📊 实际效果对比

### 优化前

```javascript
// 功能：检查用户权限
const check=(u,r)=>u&&u.roles&&u.roles.includes(r)?true:false
```

**问题**：
- 过度压缩，难以阅读
- 嵌套三元运算符
- 变量名不清晰

### 优化后

```javascript
// 检查用户是否拥有指定角色
function checkUserRole(user, requiredRole) {
  // 如果用户不存在，返回 false
  if (!user) {
    return false;
  }

  // 如果用户没有角色信息，返回 false
  if (!user.roles) {
    return false;
  }

  // 检查用户是否拥有所需角色
  return user.roles.includes(requiredRole);
}
```

**改进**：
- ✅ 清晰的函数名和参数名
- ✅ 显式的逻辑步骤
- ✅ 有意义的注释
- ✅ 易于调试和扩展

---

## ⚠️ 注意事项

### 1. 不要盲目照搬

**为什么？**
- 每个人/团队的编码习惯不同
- 官方提示词只是模板

**建议**：
1. 先安装体验，了解 code-simplifier 的能力
2. 根据自己的喜好微调配置
3. 改造成符合个人/团队口味的专属代码管家

### 2. 使用时机

**✅ 推荐使用**：
- 刚写完一个功能模块
- 感觉代码开始变味的时候
- 提交代码之前的最后一步

**❌ 不推荐使用**：
- 代码已经很规范的时候
- 不确定是否需要优化的时候（可以用 git diff 查看）

### 3. 配合其他工具

**代码质量管理工具链**：
1. **Linters** (ESLint, Pylint)：静态检查
2. **Formatters** (Prettier, Black)：自动格式化
3. **Code Simplifier**：语义级别的简化
4. **Tests**：功能验证

---

## 🎯 总结

### Code Simplifier 告诉我们什么？

**AI 编程正在转变**：
- 从"写得快"到"写得好"
- 从"功能实现"到"代码治理"
- 从"一次生成"到"持续优化"

### 核心价值

对于非科班出身或独立开发者：
- ✅ 相当于配了一个不知疲倦的技术总监
- ✅ 随时帮你做 Code Review
- ✅ 确保代码质量不因AI编程而下降

**Claude Code 这次开源 code-simplifier，传递了一个重要信号**：
> AI 编程正在从单纯的生成代码，向代码治理转变

---

## 🔗 相关链接

- **官方GitHub**: https://github.com/anthropics/claude-code
- **插件市场**: `/plugin marketplace update claude-plugins-official`
- **相关文档**: [02-Skills核心概念.md](./02-Skills核心概念.md)

---

**创建时间**: 2026-01-09
**基于**: Claude Code 2.1.0
**插件来源**: Anthropic Official
