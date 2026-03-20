# WordPress MCP Adapter

> 让 AI 直接管理你的 WordPress 网站

## 概述

WordPress MCP Adapter 是 WordPress 官方的 MCP (Model Context Protocol) 适配器，它将 WordPress Abilities API 桥接到 MCP 协议，让 AI 客户端（如 Claude）能够直接发现和调用 WordPress 的能力。

- **GitHub**: https://github.com/WordPress/mcp-adapter
- **依赖**: WordPress Abilities API
- **PHP版本**: >= 7.4

## 核心功能

| 功能 | 说明 |
|------|------|
| **Ability-to-MCP 转换** | 自动将 WordPress abilities 转换为 MCP 工具/资源/提示 |
| **多服务器管理** | 创建和管理多个 MCP 服务器 |
| **双传输协议** | HTTP (MCP 2025-06-18) + STDIO |
| **自动发现** | 所有 WordPress abilities 自动暴露为 MCP 工具 |
| **权限控制** | 细粒度的权限检查 |
| **可观测性** | 内置指标追踪 |

---

## 安装方式

### 方式一：Composer 安装（推荐）

```bash
composer require wordpress/abilities-api wordpress/mcp-adapter
```

### 方式二：作为插件安装

```bash
# 克隆到插件目录
git clone https://github.com/WordPress/mcp-adapter.git wp-content/plugins/mcp-adapter

# 安装依赖
cd wp-content/plugins/mcp-adapter
composer install
```

### 方式三：使用 Jetpack Autoloader（多插件场景推荐）

```bash
composer require wordpress/abilities-api wordpress/mcp-adapter automattic/jetpack-autoloader
```

然后在主插件文件中：
```php
// 使用 Jetpack autoloader 替代标准 autoload
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload_packages.php';
```

---

## 连接配置

### HTTP 远程连接（管理远程网站）

```json
{
  "mcpServers": {
    "wordpress-remote": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote@latest"],
      "env": {
        "WP_API_URL": "https://你的网站.com/wp-json/mcp/mcp-adapter-default-server",
        "WP_API_USERNAME": "你的用户名",
        "WP_API_PASSWORD": "应用密码"
      }
    }
  }
}
```

**获取应用密码**：
1. WordPress 后台 → 用户 → 个人资料
2. 找到"应用密码"部分
3. 输入名称 → 点击"添加新应用密码"
4. 复制生成的密码

### STDIO 本地连接（需要服务器 Shell 权限）

```json
{
  "mcpServers": {
    "wordpress-local": {
      "command": "wp",
      "args": [
        "--path=/path/to/your/wordpress/site",
        "mcp-adapter",
        "serve",
        "--server=mcp-adapter-default-server",
        "--user=admin"
      ]
    }
  }
}
```

---

## 使用示例

### 在插件中注册 Ability

```php
add_action( 'wp_abilities_api_init', function() {
    wp_register_ability( 'my-plugin/get-posts', [
        'label' => 'Get Posts',
        'description' => 'Retrieve WordPress posts with optional filtering',
        'input_schema' => [
            'type' => 'object',
            'properties' => [
                'numberposts' => [
                    'type' => 'integer',
                    'description' => 'Number of posts to retrieve',
                    'default' => 5,
                    'minimum' => 1,
                    'maximum' => 100
                ],
                'post_status' => [
                    'type' => 'string',
                    'description' => 'Post status to filter by',
                    'enum' => ['publish', 'draft', 'private'],
                    'default' => 'publish'
                ]
            ]
        ],
        'output_schema' => [
            'type' => 'array',
            'items' => [
                'type' => 'object',
                'properties' => [
                    'ID' => ['type' => 'integer'],
                    'post_title' => ['type' => 'string'],
                    'post_content' => ['type' => 'string'],
                    'post_date' => ['type' => 'string'],
                    'post_author' => ['type' => 'string']
                ]
            ]
        ],
        'execute_callback' => function( $input ) {
            $args = [
                'numberposts' => $input['numberposts'] ?? 5,
                'post_status' => $input['post_status'] ?? 'publish'
            ];
            return get_posts( $args );
        },
        'permission_callback' => function() {
            return current_user_can( 'read' );
        }
    ]);
});
```

### WP-CLI 测试命令

```bash
# 列出所有 MCP 服务器
wp mcp-adapter list

# 测试发现 abilities 工具
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"mcp-adapter-discover-abilities","arguments":{}}}' | wp mcp-adapter serve --user=admin --server=mcp-adapter-default-server

# 列出可用工具
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | wp mcp-adapter serve --user=admin --server=mcp-adapter-default-server
```

---

## API 端点

安装后自动创建的默认端点：

| 端点 | 说明 |
|------|------|
| `/wp-json/mcp/mcp-adapter-default-server` | 默认 MCP 服务器 |
| `/wp-json/{namespace}/{route}` | 自定义服务器端点 |

---

## 架构概览

```
includes/
├── Core/                    # 核心组件
│   ├── McpAdapter.php      # 主注册表
│   ├── McpServer.php       # 服务器配置
│   └── McpTransportFactory.php
├── Abilities/              # 内置能力
│   ├── DiscoverAbilitiesAbility.php
│   ├── ExecuteAbilityAbility.php
│   └── GetAbilityInfoAbility.php
├── Domain/                 # MCP 组件
│   ├── Tools/             # 工具实现
│   ├── Resources/         # 资源实现
│   └── Prompts/           # 提示实现
├── Transport/             # 传输层
│   └── HttpTransport.php  # HTTP 传输 (MCP 2025-06-18)
└── Infrastructure/        # 基础设施
    ├── ErrorHandling/     # 错误处理
    └── Observability/     # 可观测性
```

---

## 应用场景

1. **AI 内容管理** - 用 Claude 直接创建/编辑文章
2. **批量操作** - AI 辅助批量修改内容
3. **自动化发布** - 结合 AI 工作流自动发布
4. **站点监控** - AI 检查站点状态和内容
5. **数据分析** - AI 分析站点数据并生成报告

---

## 注意事项

1. **安全** - 应用密码权限等同于用户权限，请谨慎分配
2. **性能** - 大量操作时注意服务器负载
3. **版本** - 建议使用 Jetpack Autoloader 避免多插件版本冲突
4. **日志** - 可配置 `LOG_FILE` 环境变量记录调试日志

---

## 相关链接

- [WordPress Abilities API 文档](https://developer.wordpress.org/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [GitHub 仓库](https://github.com/WordPress/mcp-adapter)
