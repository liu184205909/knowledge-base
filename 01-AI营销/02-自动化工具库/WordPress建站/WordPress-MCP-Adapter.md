# WordPress MCP Adapter

> 让 AI 直接管理你的 WordPress 网站

**GitHub**: https://github.com/WordPress/mcp-adapter

## 适用场景分析

| 场景 | 适配性 | 说明 |
|------|--------|------|
| Elementor 建站 | ❌ 有限 | Elementor 未注册 Abilities，无法直接调用 |
| 多站点日常运营 | ✅ 有用 | 批量管理产品、订单、内容 |
| WooCommerce 管理 | ⚠️ 部分 | 需要 WC 注册相应 Abilities |

**结论**：建站期帮助不大，多站点运营期再考虑使用。

## 核心概念

将 WordPress Abilities API 桥接到 MCP 协议，让 Claude 等 AI 客户端直接操作 WordPress。

---

## 配置方式

### HTTP 远程连接（管理远程网站）

```json
{
  "mcpServers": {
    "wordpress-remote": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote@latest"],
      "env": {
        "WP_API_URL": "https://你的网站.com/wp-json/mcp/mcp-adapter-default-server",
        "WP_API_USERNAME": "用户名",
        "WP_API_PASSWORD": "应用密码"
      }
    }
  }
}
```

> 应用密码：WP后台 → 用户 → 个人资料 → 应用密码

### STDIO 本地连接（需服务器 Shell）

```json
{
  "mcpServers": {
    "wordpress-local": {
      "command": "wp",
      "args": [
        "--path=/path/to/wordpress",
        "mcp-adapter", "serve",
        "--server=mcp-adapter-default-server",
        "--user=admin"
      ]
    }
  }
}
```

---

## 使用前提

1. WP 网站安装 `wordpress/abilities-api` + `wordpress/mcp-adapter`
2. 创建应用密码
3. Claude Code 配置 MCP 连接

---

## 能做什么

| 功能 | 说明 |
|------|------|
| 文章管理 | 创建/编辑/删除 |
| 页面管理 | CRUD 操作 |
| 媒体管理 | 上传/管理图片 |
| 自定义 Ability | 注册自定义能力供 AI 调用 |

---

## 注册自定义 Ability 示例

```php
add_action( 'wp_abilities_api_init', function() {
    wp_register_ability( 'my-plugin/get-posts', [
        'label' => 'Get Posts',
        'description' => '获取文章列表',
        'input_schema' => [
            'type' => 'object',
            'properties' => [
                'numberposts' => ['type' => 'integer', 'default' => 5]
            ]
        ],
        'execute_callback' => function( $input ) {
            return get_posts(['numberposts' => $input['numberposts'] ?? 5]);
        },
        'permission_callback' => function() {
            return current_user_can( 'read' );
        }
    ]);
});
```
