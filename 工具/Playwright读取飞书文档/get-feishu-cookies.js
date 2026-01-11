/**
 * 获取飞书 Cookies 的教程
 *
 * 请按照以下步骤操作获取你的飞书 Cookies
 */

console.log(`
========================================
飞书 Cookies 获取教程
========================================

方法1: Chrome 浏览器 (推荐)
---------------------------
1. 在 Chrome 中打开飞书并登录
2. 访问: https://waytoagi.feishu.cn/wiki/YVC3wnT3NixTF1kVC5RckX16ney
3. 按 F12 打开开发者工具
4. 点击 "Application" 或 "应用" 标签
5. 左侧菜单找到 "Cookies" → "https://waytoagi.feishu.cn"
6. 复制所有 Cookie 值

需要的关键 Cookies:
- passport_sessionId
- passport_csrf_session
- tenant
- locale
- (可能还有其他以 feishu 开头的 cookie)

方法2: 使用扩展插件
---------------------------
1. 安装 "EditThisCookie" 或 "Cookie-Editor" 扩展
2. 登录飞书后,点击扩展图标
3. 导出为 JSON 格式
4. 复制所有内容

方法3: Network 抓包
---------------------------
1. 登录飞书后按 F12
2. 切换到 "Network" 标签
3. 刷新页面 (F5)
4. 点击第一个请求 (通常是文档 URL)
5. 找到 "Request Headers" 中的 "Cookie" 字段
6. 复制整个 Cookie 字符串

========================================
获取后的格式示例:
========================================

格式1 - JSON 格式 (推荐):
[
  {"name":"passport_sessionId", "value":"xxx", "domain":".feishu.cn"},
  {"name":"passport_csrf_session", "value":"yyy", "domain":".feishu.cn"},
  ...
]

格式2 - 字符串格式:
passport_sessionId=xxx; passport_csrf_session=yyy; tenant=zzz; ...

========================================
`);

// 将获取的 Cookies 保存到文件
const fs = require('fs');
const path = require('path');

const cookiesFile = path.join(__dirname, 'feishu-cookies.json');

console.log(`
请将你的 Cookies 保存到:
${cookiesFile}

格式如下:
{
  "cookies": [
    {"name": "passport_sessionId", "value": "你的值", "domain": ".feishu.cn"},
    {"name": "passport_csrf_session", "value": "你的值", "domain": ".feishu.cn"}
  ]
}
`);
